"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ProductDTO } from "@/types";
import { AddToCartButton } from "./AddToCartButton";

export function ProductBuyBox({ product }: { product: ProductDTO }) {
  const [qty, setQty] = useState(1);
  const outOfStock = product.stock <= 0;
  const max = product.stock > 0 ? product.stock : 99;

  return (
    <div className="flex flex-wrap items-center gap-3">
      {!outOfStock && (
        <div className="inline-flex items-center rounded-lg border">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={qty <= 1}
            aria-label="Уменьшить"
          >
            <Minus className="size-4" />
          </Button>
          <span className="w-10 text-center text-sm font-medium tabular-nums">
            {qty}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setQty((q) => Math.min(max, q + 1))}
            disabled={qty >= max}
            aria-label="Увеличить"
          >
            <Plus className="size-4" />
          </Button>
        </div>
      )}
      <AddToCartButton
        product={product}
        qty={qty}
        size="lg"
        className="min-w-[200px] flex-1"
      />
    </div>
  );
}
