"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart";

export function CartButton() {
  const count = useCart((s) => s.items.reduce((sum, i) => sum + i.qty, 0));
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative"
      render={<Link href="/cart" aria-label="Корзина" />}
    >
      <ShoppingCart className="size-5" />
      {mounted && count > 0 && (
        <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[11px] font-semibold text-primary-foreground">
          {count}
        </span>
      )}
    </Button>
  );
}
