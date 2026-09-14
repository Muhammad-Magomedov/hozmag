import {
  getBrands,
  getDiscountedProducts,
  getFeaturedProducts,
  getPriceRange,
  getProducts,
} from "@/lib/products";
import { getCategories } from "@/lib/categories";
import { one, numOr, type SP } from "@/lib/search-params";
import type { SortKey } from "@/types";
import { Hero } from "@/components/shop/Hero";
import { FilterSortBar } from "@/components/shop/FilterSortBar";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { ProductSection } from "@/components/shop/ProductSection";
import { Pagination } from "@/components/shop/Pagination";

const PAGE_SIZE = 20;

export default async function HomePage({
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
  const discount = one(sp.discount) === "1";
  const sort = (one(sp.sort) as SortKey) || "new";
  const page = Math.max(1, numOr(one(sp.page)) ?? 1);

  const hasFilters = Boolean(
    q ||
      category ||
      brand ||
      minPrice ||
      maxPrice ||
      inStock ||
      discount ||
      one(sp.sort) ||
      page > 1,
  );

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
      onlyDiscount: discount,
      sort,
      page,
      limit: PAGE_SIZE,
    }),
  ]);

  // Витринные подборки — только на «чистой» главной без фильтров.
  const [featured, discounted] = hasFilters
    ? [[], []]
    : await Promise.all([getFeaturedProducts(10), getDiscountedProducts(10)]);

  const totalPages = Math.max(1, Math.ceil(listing.total / PAGE_SIZE));
  const categoryName = category
    ? categories.find((c) => c.slug === category)?.name
    : undefined;

  const heading = q
    ? `Результаты по запросу «${q}»`
    : (categoryName ?? "Каталог товаров");

  return (
    <div className="space-y-10">
      {!hasFilters && <Hero />}
      {!hasFilters && (
        <ProductSection title="Рекомендуемые товары" products={featured} />
      )}
      {!hasFilters && (
        <ProductSection
          title="Товары со скидкой"
          products={discounted}
          href="/sale"
          accent
        />
      )}

      <section id="catalog" className="scroll-mt-28 space-y-4">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
            {heading}
          </h2>
          <span className="shrink-0 text-sm text-muted-foreground">
            Найдено: {listing.total}
          </span>
        </div>

        <FilterSortBar
          categories={categories}
          brands={brands}
          priceRange={priceRange}
        />

        <ProductGrid
          products={listing.products}
          emptyLabel={
            q
              ? `По запросу «${q}» ничего не найдено`
              : "В этой категории пока нет товаров"
          }
        />

        <Pagination page={page} totalPages={totalPages} />
      </section>
    </div>
  );
}
