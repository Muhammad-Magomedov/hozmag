import { PackageSearch } from "lucide-react";
import type { ProductDTO } from "@/types";
import { ProductCard } from "./ProductCard";

export function ProductGrid({
  products,
  emptyLabel = "Товары не найдены",
}: {
  products: ProductDTO[];
  emptyLabel?: string;
}) {
  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed py-16 text-center text-muted-foreground">
        <PackageSearch className="size-8" />
        <p>{emptyLabel}</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {products.map((p) => (
        <ProductCard key={p._id} product={p} />
      ))}
    </div>
  );
}
