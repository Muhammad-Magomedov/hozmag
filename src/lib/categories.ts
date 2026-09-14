import { dbConnect } from "@/lib/db";
import Category from "@/models/Category";
import Product from "@/models/Product";
import { serializeCategory } from "@/lib/serialize";
import type { CategoryDTO } from "@/types";

export async function getCategories(): Promise<CategoryDTO[]> {
  await dbConnect();
  const docs = await Category.find().sort({ name: 1 }).lean();
  return docs.map(serializeCategory);
}

/** Категории вместе с количеством активных товаров в каждой. */
export async function getCategoriesWithCounts(): Promise<
  (CategoryDTO & { count: number })[]
> {
  await dbConnect();
  const [docs, counts] = await Promise.all([
    Category.find().sort({ name: 1 }).lean(),
    Product.aggregate<{ _id: unknown; count: number }>([
      { $match: { isActive: true } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]),
  ]);
  const countMap = new Map(counts.map((c) => [String(c._id), c.count]));
  return docs.map((d) => ({
    ...serializeCategory(d),
    count: countMap.get(String(d._id)) ?? 0,
  }));
}
