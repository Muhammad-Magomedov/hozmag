import type { NextRequest } from "next/server";
import { isValidObjectId } from "mongoose";
import { dbConnect } from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { productSchema } from "@/lib/validation";
import { serializeProduct } from "@/lib/serialize";
import {
  badRequest,
  currentUser,
  forbidden,
  notFound,
  ok,
  serverError,
  unauthorized,
} from "@/lib/api-helpers";
import { canManageProducts } from "@/lib/permissions";
import { uniqueSlug } from "@/lib/slug";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params;
    if (!isValidObjectId(id)) return notFound();
    await dbConnect();
    const doc = await Product.findById(id).populate("category").lean();
    if (!doc) return notFound();
    return ok({ product: serializeProduct(doc) });
  } catch (e) {
    return serverError((e as Error).message);
  }
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  try {
    const user = await currentUser();
    if (!user) return unauthorized();
    if (!canManageProducts(user)) return forbidden();

    const { id } = await params;
    if (!isValidObjectId(id)) return notFound();

    const parsed = productSchema.safeParse(await req.json());
    if (!parsed.success) {
      return badRequest(
        parsed.error.issues[0]?.message ?? "Проверьте поля",
        parsed.error.issues,
      );
    }
    const data = parsed.data;

    await dbConnect();
    const existing = await Product.findById(id).lean();
    if (!existing) return notFound();

    const cat = await Category.findById(data.category).lean();
    if (!cat) return badRequest("Категория не найдена");

    // Пересобираем слаг при смене названия.
    let slug = existing.slug;
    if (data.name !== existing.name) {
      slug = await uniqueSlug(
        data.name,
        async (s) =>
          (await Product.exists({ slug: s, _id: { $ne: id } })) !== null,
      );
    }

    const full = await Product.findByIdAndUpdate(
      id,
      {
        name: data.name,
        description: data.description,
        category: cat._id,
        brand: data.brand,
        sku: data.sku,
        price: data.price,
        oldPrice: data.oldPrice ?? null,
        stock: data.stock,
        images: data.images,
        specs: data.specs,
        featured: data.featured,
        isActive: data.isActive,
        slug,
      },
      { new: true },
    )
      .populate("category")
      .lean();
    return ok({ product: serializeProduct(full) });
  } catch (e) {
    return serverError((e as Error).message);
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  try {
    const user = await currentUser();
    if (!user) return unauthorized();
    if (!canManageProducts(user)) return forbidden();

    const { id } = await params;
    if (!isValidObjectId(id)) return notFound();

    await dbConnect();
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) return notFound();
    return ok({ ok: true });
  } catch (e) {
    return serverError((e as Error).message);
  }
}
