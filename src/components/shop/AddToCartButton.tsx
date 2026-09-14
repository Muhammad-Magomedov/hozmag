"use client";

import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart";
import type { ProductDTO } from "@/types";

export function AddToCartButton({
  product,
  qty = 1,
  size = "default",
  className,
}: {
  product: ProductDTO;
  qty?: number;
  size?: "sm" | "default" | "lg";
  className?: string;
}) {
  const add = useCart((s) => s.add);
  const inCart = useCart((s) =>
    s.items.some((i) => i.productId === product._id),
  );
  const outOfStock = product.stock <= 0;

  function handleClick() {
    add(product, qty);
    toast.success(`«${product.name}» — добавлено в корзину`);
  }

  return (
    <Button
      type="button"
      size={size}
      className={className}
      disabled={outOfStock}
      onClick={handleClick}
    >
      <ShoppingCart className="size-4" />
      {outOfStock ? "Нет в наличии" : inCart ? "Добавить ещё" : "В корзину"}
    </Button>
  );
}
