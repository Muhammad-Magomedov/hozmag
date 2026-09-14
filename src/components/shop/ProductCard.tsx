import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { ProductDTO } from "@/types";
import { Thumb } from "./Thumb";
import { PriceTag } from "./PriceTag";
import { AddToCartButton } from "./AddToCartButton";

export function ProductCard({ product }: { product: ProductDTO }) {
  const outOfStock = product.stock <= 0;
  const keySpecs = product.specs
    .slice(0, 2)
    .map((s) => `${s.name}: ${s.value}${s.unit ? ` ${s.unit}` : ""}`)
    .join(" · ");

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border bg-card transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-300/70 hover:shadow-lg hover:shadow-orange-500/10 dark:hover:border-orange-500/30">
      <Link
        href={`/product/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-gradient-to-br from-muted to-muted/40"
      >
        <Thumb
          src={product.images[0]}
          alt={product.name}
          className="size-full object-cover transition duration-300 group-hover:scale-105"
        />
        <div className="absolute left-2 top-2 flex flex-col items-start gap-1">
          {product.discountPercent > 0 && (
            <Badge className="bg-red-600 text-white hover:bg-red-600">
              −{product.discountPercent}%
            </Badge>
          )}
          {product.featured && (
            <Badge className="border-transparent bg-orange-100 text-orange-700 hover:bg-orange-100 dark:bg-orange-950 dark:text-orange-300">
              Хит продаж
            </Badge>
          )}
        </div>
        {outOfStock && (
          <div className="absolute inset-0 grid place-items-center bg-background/60 text-sm font-medium backdrop-blur-[1px]">
            Нет в наличии
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-1.5 p-3">
        {product.category && (
          <span className="text-xs text-muted-foreground">
            {product.category.name}
          </span>
        )}
        <Link
          href={`/product/${product.slug}`}
          className="line-clamp-2 text-sm font-medium leading-snug hover:underline"
        >
          {product.name}
        </Link>
        {keySpecs && (
          <span className="line-clamp-1 text-xs text-muted-foreground">
            {keySpecs}
          </span>
        )}
        <div className="mt-auto flex flex-col gap-2 pt-2">
          <PriceTag price={product.price} oldPrice={product.oldPrice} size="md" />
          <AddToCartButton product={product} size="sm" className="w-full" />
        </div>
      </div>
    </div>
  );
}
