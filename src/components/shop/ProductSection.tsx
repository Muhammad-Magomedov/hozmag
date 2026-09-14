import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ProductDTO } from "@/types";
import { ProductGrid } from "./ProductGrid";

export function ProductSection({
  title,
  products,
  href,
  hrefLabel = "Смотреть все",
  accent,
}: {
  title: string;
  products: ProductDTO[];
  href?: string;
  hrefLabel?: string;
  accent?: boolean;
}) {
  if (!products.length) return null;
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <h2
          className={`text-xl font-bold tracking-tight sm:text-2xl ${
            accent ? "text-red-600 dark:text-red-500" : ""
          }`}
        >
          {title}
        </h2>
        {href && (
          <Link
            href={href}
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            {hrefLabel}
            <ArrowRight className="size-4" />
          </Link>
        )}
      </div>
      <ProductGrid products={products} />
    </section>
  );
}
