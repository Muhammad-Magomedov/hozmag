import type { Metadata } from "next";
import { Percent } from "lucide-react";
import {
  getBrands,
  getPriceRange,
  getProducts,
} from "@/lib/products";
import { getCategories } from "@/lib/categories";
import { one, numOr, type SP } from "@/lib/search-params";
import type { SortKey } from "@/types";
import { FilterSortBar } from "@/components/shop/FilterSortBar";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { Pagination } from "@/components/shop/Pagination";

export const metadata: Metadata = {
  title: "Товары со скидкой",
  description: "Акции и скидки на промышленное и инженерное оборудование.",
};

const PAGE_SIZE = 20;

export default async function SalePage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const q = one(sp.q);
  const category = one(sp.category);
  const brand = one(sp.brand);
  const minPrice = numOr(one(sp.minPrice));
  const maxPrice = numOr(one(sp.maxPrice));
  const inStock = one(sp.inStock) === "1";
  const sort = (one(sp.sort) as SortKey) || "discount";
  const page = Math.max(1, numOr(one(sp.page)) ?? 1);

  const [categories, brands, priceRange, listing] = await Promise.all([
    getCategories(),
    getBrands(),
    getPriceRange(),
    getProducts({
      q,
      category,
      brand,
      minPrice,
      maxPrice,
      onlyInStock: inStock,
      onlyDiscount: true, // страница всегда только про скидки
      sort,
      page,
      limit: PAGE_SIZE,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(listing.total / PAGE_SIZE));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-xl bg-red-600 text-white">
          <Percent className="size-6" />
        </span>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Товары со скидкой
          </h1>
          <p className="text-sm text-muted-foreground">
            Найдено: {listing.total}
          </p>
        </div>
      </div>

      <FilterSortBar
        categories={categories}
        brands={brands}
        priceRange={priceRange}
        showDiscountToggle={false}
      />

      <ProductGrid
        products={listing.products}
        emptyLabel="Сейчас нет товаров со скидкой"
      />

      <Pagination page={page} totalPages={totalPages} />
    </div>
  );
}
