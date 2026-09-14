"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, ProductDTO } from "@/types";

interface CartState {
  items: CartItem[];
  add: (product: ProductDTO, qty?: number) => void;
  remove: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clear: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

const clampQty = (qty: number, stock: number) =>
  stock > 0 ? Math.max(1, Math.min(qty, stock)) : Math.max(1, qty);

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      add: (product, qty = 1) =>
        set((state) => {
          const stock = product.stock ?? 0;
          const existing = state.items.find(
            (i) => i.productId === product._id,
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === product._id
                  ? { ...i, qty: clampQty(i.qty + qty, stock) }
                  : i,
              ),
            };
          }
          const item: CartItem = {
            productId: product._id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            image: product.images?.[0] ?? "",
            qty: clampQty(qty, stock),
            stock,
          };
          return { items: [...state.items, item] };
        }),

      remove: (productId) =>
        set((s) => ({
          items: s.items.filter((i) => i.productId !== productId),
        })),

      setQty: (productId, qty) =>
        set((s) => ({
          items: s.items
            .map((i) =>
              i.productId === productId
                ? { ...i, qty: clampQty(qty, i.stock) }
                : i,
            )
            .filter((i) => i.qty > 0),
        })),

      clear: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.qty, 0),
      totalPrice: () => get().items.reduce((sum, i) => sum + i.qty * i.price, 0),
    }),
    { name: "hozmag-cart" },
  ),
);
