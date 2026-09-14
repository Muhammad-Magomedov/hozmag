import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Check, ChevronRight, X } from "lucide-react";
import { getProductBySlug, getRelatedProducts } from "@/lib/products";
import { Badge } from "@/components/ui/badge";
import { PriceTag } from "@/components/shop/PriceTag";
import { ProductSpecs } from "@/components/shop/ProductSpecs";
import { ProductGallery } from "@/components/shop/ProductGallery";
import { ProductBuyBox } from "@/components/shop/ProductBuyBox";
import { ProductSection } from "@/components/shop/ProductSection";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug).catch(() => null);
  if (!product) return { title: "Товар не найден" };
  return {
    title: product.name,
    description: (product.description || product.name).slice(0, 160),
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product, 5);
  const inStock = product.stock > 0;

  return (
    <div className="space-y-12">
      <nav className="flex items-center gap-1 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Главная
        </Link>
        <ChevronRight className="size-4" />
        {product.category && (
          <>
            <Link
              href={`/?category=${product.category.slug}`}
              className="hover:text-foreground"
            >
              {product.category.name}
            </Link>
            <ChevronRight className="size-4" />
          </>
        )}
        <span className="truncate text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        <ProductGallery images={product.images} alt={product.name} />

        <div className="space-y-5">
          <div className="space-y-2">
            {product.brand && (
              <span className="text-sm text-muted-foreground">
                Бренд:{" "}
                <span className="font-medium text-foreground">
                  {product.brand}
                </span>
              </span>
            )}
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {product.name}
            </h1>
            {product.sku && (
              <span className="block text-xs text-muted-foreground">
                Артикул: {product.sku}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <PriceTag
              price={product.price}
              oldPrice={product.oldPrice}
              size="lg"
            />
            {product.discountPercent > 0 && (
              <Badge className="bg-red-600 text-white hover:bg-red-600">
                −{product.discountPercent}%
              </Badge>
            )}
          </div>

          <div
            className={`inline-flex items-center gap-1.5 text-sm ${
              inStock
                ? "text-green-600 dark:text-green-500"
                : "text-muted-foreground"
            }`}
          >
            {inStock ? (
              <>
                <Check className="size-4" />В наличии
                {product.stock <= 10 ? ` — осталось ${product.stock} шт.` : ""}
              </>
            ) : (
              <>
                <X className="size-4" />
                Нет в наличии
              </>
            )}
          </div>

          <ProductBuyBox product={product} />

          {product.description && (
            <div className="space-y-2 border-t pt-5">
              <h2 className="font-semibold">Описание</h2>
              <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                {product.description}
              </p>
            </div>
          )}
        </div>
      </div>

      {product.specs.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">Характеристики</h2>
          <div className="max-w-2xl">
            <ProductSpecs specs={product.specs} />
          </div>
        </section>
      )}

      <ProductSection title="Рекомендуемые товары" products={related} />
    </div>
  );
}
