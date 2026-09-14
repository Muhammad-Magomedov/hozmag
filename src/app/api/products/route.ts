import type { NextRequest } from "next/server";
import { dbConnect } from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { productSchema } from "@/lib/validation";
import { serializeProduct } from "@/lib/serialize";
import { getProducts } from "@/lib/products";
import {
  badRequest,
  currentUser,
  forbidden,
  ok,
  serverError,
  unauthorized,
} from "@/lib/api-helpers";
import { canManageProducts } from "@/lib/permissions";
import { uniqueSlug } from "@/lib/slug";
import { numOr } from "@/lib/search-params";
import type { SortKey } from "@/types";

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const result = await getProducts({
      q: sp.get("q") ?? undefined,
      category: sp.get("category") ?? undefined,
      brand: sp.get("brand") ?? undefined,
      minPrice: numOr(sp.get("minPrice") ?? undefined),
      maxPrice: numOr(sp.get("maxPrice") ?? undefined),
      onlyInStock: sp.get("inStock") === "1",
      onlyDiscount: sp.get("discount") === "1",
      sort: (sp.get("sort") as SortKey) ?? undefined,
      page: numOr(sp.get("page") ?? undefined),
      limit: numOr(sp.get("limit") ?? undefined),
    });
    return ok(result);
  } catch (e) {
    return serverError((e as Error).message);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) return unauthorized();
    if (!canManageProducts(user)) return forbidden();

    const parsed = productSchema.safeParse(await req.json());
    if (!parsed.success) {
      return badRequest(
        parsed.error.issues[0]?.message ?? "Проверьте поля",
        parsed.error.issues,
      );
    }
    const data = parsed.data;

    await dbConnect();
    const cat = await Category.findById(data.category).lean();
    if (!cat) return badRequest("Категория не найдена");

    const slug = await uniqueSlug(
      data.name,
      async (s) => (await Product.exists({ slug: s })) !== null,
    );

    const doc = await Product.create({
      ...data,
      oldPrice: data.oldPrice ?? null,
      slug,
    });
    const full = await Product.findById(doc._id).populate("category").lean();
    return ok({ product: serializeProduct(full) }, 201);
  } catch (e) {
    return serverError((e as Error).message);
  }
}
