/* eslint-disable @typescript-eslint/no-explicit-any */
import { dbConnect } from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { serializeProduct } from "@/lib/serialize";
import type { ProductDTO, SortKey } from "@/types";

export interface ProductFilters {
  q?: string;
  category?: string; // slug
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  onlyDiscount?: boolean;
  onlyInStock?: boolean;
  featured?: boolean;
  sort?: SortKey;
  page?: number;
  limit?: number;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function sortToMongo(sort?: SortKey): Record<string, 1 | -1> {
  switch (sort) {
    case "price-asc":
      return { price: 1 };
    case "price-desc":
      return { price: -1 };
    case "name-asc":
      return { name: 1 };
    case "discount":
      return { oldPrice: -1 };
    case "new":
    default:
      return { createdAt: -1 };
  }
}

export async function getProducts(
  filters: ProductFilters = {},
): Promise<{ products: ProductDTO[]; total: number }> {
  await dbConnect();
  const query: any = { isActive: true };

  if (filters.q) {
    const rx = new RegExp(escapeRegex(filters.q.trim()), "i");
    query.$or = [{ name: rx }, { brand: rx }, { description: rx }, { sku: rx }];
  }

  if (filters.category) {
    const cat = await Category.findOne({ slug: filters.category })
      .select("_id")
      .lean();
    if (!cat) return { products: [], total: 0 };
    query.category = cat._id;
  }

  if (filters.brand) query.brand = filters.brand;
  if (filters.onlyInStock) query.stock = { $gt: 0 };
  if (filters.featured) query.featured = true;

  if (
    typeof filters.minPrice === "number" ||
    typeof filters.maxPrice === "number"
  ) {
    query.price = {};
    if (typeof filters.minPrice === "number")
      query.price.$gte = filters.minPrice;
    if (typeof filters.maxPrice === "number")
      query.price.$lte = filters.maxPrice;
  }

  if (filters.onlyDiscount) {
    query.oldPrice = { $gt: 0 };
    query.$expr = { $gt: ["$oldPrice", "$price"] };
  }

  const page = Math.max(1, filters.page ?? 1);
  const limit = Math.min(60, filters.limit ?? 24);
  const skip = (page - 1) * limit;

  const [docs, total] = await Promise.all([
    Product.find(query)
      .populate("category")
      .sort(sortToMongo(filters.sort))
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(query),
  ]);

  return { products: docs.map(serializeProduct), total };
}

export async function getProductBySlug(
  slug: string,
): Promise<ProductDTO | null> {
  await dbConnect();
  const doc = await Product.findOne({ slug: slug.toLowerCase(), isActive: true })
    .populate("category")
    .lean();
  return doc ? serializeProduct(doc) : null;
}

export async function getFeaturedProducts(limit = 8): Promise<ProductDTO[]> {
  const { products } = await getProducts({ featured: true, sort: "new", limit });
  return products;
}

export async function getDiscountedProducts(limit = 8): Promise<ProductDTO[]> {
  const { products } = await getProducts({
    onlyDiscount: true,
    sort: "discount",
    limit,
  });
  return products;
}

/** Рекомендуемые к товару: та же категория, затем добор из featured. */
export async function getRelatedProducts(
  product: ProductDTO,
  limit = 4,
): Promise<ProductDTO[]> {
  await dbConnect();
  const excluded: any[] = [product._id];
  const query: any = { isActive: true, _id: { $ne: product._id } };
  if (product.category?._id) query.category = product.category._id;

  const docs = await Product.find(query)
    .populate("category")
    .sort({ featured: -1, createdAt: -1 })
    .limit(limit)
    .lean();
  let list = docs.map(serializeProduct);
  list.forEach((p) => excluded.push(p._id));

  if (list.length < limit) {
    const extra = await Product.find({
      isActive: true,
      _id: { $nin: excluded },
    })
      .populate("category")
      .sort({ featured: -1, createdAt: -1 })
      .limit(limit - list.length)
      .lean();
    list = list.concat(extra.map(serializeProduct));
  }
  return list;
}

export async function getBrands(): Promise<string[]> {
  await dbConnect();
  const brands = await Product.distinct("brand", {
    isActive: true,
    brand: { $nin: ["", null] },
  });
  return (brands as string[]).filter(Boolean).sort((a, b) => a.localeCompare(b));
}

export async function getPriceRange(): Promise<{ min: number; max: number }> {
  await dbConnect();
  const r = await Product.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: null, min: { $min: "$price" }, max: { $max: "$price" } } },
  ]);
  if (!r.length) return { min: 0, max: 100000 };
  return {
    min: Math.floor(r[0].min ?? 0),
    max: Math.ceil(r[0].max ?? 100000),
  };
}
