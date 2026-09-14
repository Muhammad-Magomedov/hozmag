/* eslint-disable @typescript-eslint/no-explicit-any */
import type { CategoryDTO, ProductDTO, Spec, UserDTO } from "@/types";

export function serializeCategory(c: any): CategoryDTO {
  return {
    _id: String(c._id),
    name: c.name,
    slug: c.slug,
    description: c.description ?? "",
  };
}

export function serializeProduct(p: any): ProductDTO {
  const oldPrice: number | null = p.oldPrice ?? null;
  const discountPercent =
    oldPrice && oldPrice > p.price
      ? Math.round((1 - p.price / oldPrice) * 100)
      : 0;

  let category: CategoryDTO | null = null;
  if (p.category && typeof p.category === "object" && "name" in p.category) {
    category = serializeCategory(p.category);
  }

  return {
    _id: String(p._id),
    name: p.name,
    slug: p.slug,
    description: p.description ?? "",
    category,
    brand: p.brand ?? "",
    sku: p.sku ?? "",
    price: p.price,
    oldPrice,
    discountPercent,
    stock: p.stock ?? 0,
    images: p.images ?? [],
    specs: (p.specs ?? []).map(
      (s: any): Spec => ({
        name: s.name,
        value: s.value,
        unit: s.unit || undefined,
      }),
    ),
    featured: !!p.featured,
    isActive: p.isActive !== false,
    rating: p.rating ?? 0,
    createdAt: p.createdAt ? new Date(p.createdAt).toISOString() : "",
  };
}

export function serializeUser(u: any): UserDTO {
  return {
    _id: String(u._id),
    name: u.name,
    email: u.email,
    role: u.role,
    permissions: u.permissions ?? [],
    phone: u.phone ?? "",
    createdAt: u.createdAt ? new Date(u.createdAt).toISOString() : "",
  };
}
