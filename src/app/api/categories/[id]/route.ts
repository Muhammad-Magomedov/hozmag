import type { NextRequest } from "next/server";
import { isValidObjectId } from "mongoose";
import { dbConnect } from "@/lib/db";
import Category from "@/models/Category";
import Product from "@/models/Product";
import { categorySchema } from "@/lib/validation";
import { serializeCategory } from "@/lib/serialize";
import {
  badRequest,
  currentUser,
  forbidden,
  notFound,
  ok,
  serverError,
  unauthorized,
} from "@/lib/api-helpers";
import { canManageCategories } from "@/lib/permissions";
import { uniqueSlug } from "@/lib/slug";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Ctx) {
  try {
    const user = await currentUser();
    if (!user) return unauthorized();
    if (!canManageCategories(user)) return forbidden();

    const { id } = await params;
    if (!isValidObjectId(id)) return notFound();

    const parsed = categorySchema.safeParse(await req.json());
    if (!parsed.success) {
      return badRequest(
        parsed.error.issues[0]?.message ?? "Проверьте поля",
        parsed.error.issues,
      );
    }
    const data = parsed.data;

    await dbConnect();
    const category = await Category.findById(id);
    if (!category) return notFound();

    if (data.name !== category.name) {
      category.slug = await uniqueSlug(
        data.name,
        async (s) =>
          (await Category.exists({ slug: s, _id: { $ne: id } })) !== null,
      );
    }
    category.name = data.name;
    category.description = data.description;
    await category.save();

    return ok({ category: serializeCategory(category) });
  } catch (e) {
    return serverError((e as Error).message);
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  try {
    const user = await currentUser();
    if (!user) return unauthorized();
    if (!canManageCategories(user)) return forbidden();

    const { id } = await params;
    if (!isValidObjectId(id)) return notFound();

    await dbConnect();
    const count = await Product.countDocuments({ category: id });
    if (count > 0) {
      return badRequest(
        `В категории ${count} тов. — сначала перенесите или удалите их`,
      );
    }
    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted) return notFound();
    return ok({ ok: true });
  } catch (e) {
    return serverError((e as Error).message);
  }
}
