import type { NextRequest } from "next/server";
import { dbConnect } from "@/lib/db";
import Category from "@/models/Category";
import { categorySchema } from "@/lib/validation";
import { serializeCategory } from "@/lib/serialize";
import { getCategoriesWithCounts } from "@/lib/categories";
import {
  badRequest,
  currentUser,
  forbidden,
  ok,
  serverError,
  unauthorized,
} from "@/lib/api-helpers";
import { canManageCategories } from "@/lib/permissions";
import { uniqueSlug } from "@/lib/slug";

export async function GET() {
  try {
    const categories = await getCategoriesWithCounts();
    return ok({ categories });
  } catch (e) {
    return serverError((e as Error).message);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) return unauthorized();
    if (!canManageCategories(user)) return forbidden();

    const parsed = categorySchema.safeParse(await req.json());
    if (!parsed.success) {
      return badRequest(
        parsed.error.issues[0]?.message ?? "Проверьте поля",
        parsed.error.issues,
      );
    }
    const data = parsed.data;

    await dbConnect();
    const slug = await uniqueSlug(
      data.name,
      async (s) => (await Category.exists({ slug: s })) !== null,
    );
    const doc = await Category.create({ ...data, slug });
    return ok({ category: serializeCategory(doc) }, 201);
  } catch (e) {
    return serverError((e as Error).message);
  }
}
