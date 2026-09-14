"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ArrowDownUp, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { SORT_LABELS, type CategoryDTO, type SortKey } from "@/types";

const ALL = "all";

export function FilterSortBar({
  categories,
  brands,
  priceRange,
  showDiscountToggle = true,
}: {
  categories: CategoryDTO[];
  brands: string[];
  priceRange: { min: number; max: number };
  showDiscountToggle?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [open, setOpen] = useState(false);

  const active = {
    category: sp.get("category") ?? "",
    brand: sp.get("brand") ?? "",
    minPrice: sp.get("minPrice") ?? "",
    maxPrice: sp.get("maxPrice") ?? "",
    inStock: sp.get("inStock") === "1",
    discount: sp.get("discount") === "1",
    sort: (sp.get("sort") as SortKey) || "new",
  };

  const [draft, setDraft] = useState(active);

  function onOpenChange(o: boolean) {
    if (o) setDraft(active);
    setOpen(o);
  }

  function pushParams(updates: Record<string, string | null>) {
    const params = new URLSearchParams(Array.from(sp.entries()));
    for (const [k, v] of Object.entries(updates)) {
      if (v === null || v === "") params.delete(k);
      else params.set(k, v);
    }
    params.delete("page");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  function applyFilters() {
    pushParams({
      category: draft.category || null,
      brand: draft.brand || null,
      minPrice: draft.minPrice || null,
      maxPrice: draft.maxPrice || null,
      inStock: draft.inStock ? "1" : null,
      discount: draft.discount ? "1" : null,
    });
    setOpen(false);
  }

  function resetFilters() {
    pushParams({
      category: null,
      brand: null,
      minPrice: null,
      maxPrice: null,
      inStock: null,
      discount: null,
    });
    setOpen(false);
  }

  let activeCount = 0;
  if (active.category) activeCount++;
  if (active.brand) activeCount++;
  if (active.minPrice || active.maxPrice) activeCount++;
  if (active.inStock) activeCount++;
  if (active.discount) activeCount++;

  const categoryName = categories.find((c) => c.slug === active.category)?.name;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Sheet open={open} onOpenChange={onOpenChange}>
          <SheetTrigger render={<Button variant="outline" size="sm" />}>
            <SlidersHorizontal className="size-4" />
            Фильтры
            {activeCount > 0 && (
              <Badge className="ml-1 h-5 min-w-5 justify-center px-1">
                {activeCount}
              </Badge>
            )}
          </SheetTrigger>
          <SheetContent side="left" className="flex w-full max-w-sm flex-col">
            <SheetHeader>
              <SheetTitle>Фильтры</SheetTitle>
            </SheetHeader>
            <div className="flex-1 space-y-5 overflow-y-auto px-4">
              <div className="space-y-2">
                <Label>Категория</Label>
                <Select
                  value={draft.category || ALL}
                  onValueChange={(v) =>
                    setDraft((d) => ({
                      ...d,
                      category: !v || v === ALL ? "" : v,
                    }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Все категории" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL}>Все категории</SelectItem>
                    {categories.map((c) => (
                      <SelectItem key={c._id} value={c.slug}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {brands.length > 0 && (
                <div className="space-y-2">
                  <Label>Производитель</Label>
                  <Select
                    value={draft.brand || ALL}
                    onValueChange={(v) =>
                      setDraft((d) => ({ ...d, brand: !v || v === ALL ? "" : v }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Любой" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ALL}>Любой</SelectItem>
                      {brands.map((b) => (
                        <SelectItem key={b} value={b}>
                          {b}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label>Цена, ₽</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    placeholder={String(priceRange.min)}
                    value={draft.minPrice}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, minPrice: e.target.value }))
                    }
                  />
                  <span className="text-muted-foreground">—</span>
                  <Input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    placeholder={String(priceRange.max)}
                    value={draft.maxPrice}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, maxPrice: e.target.value }))
                    }
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={draft.inStock}
                  onCheckedChange={(v) =>
                    setDraft((d) => ({ ...d, inStock: v === true }))
                  }
                />
                Только в наличии
              </label>
              {showDiscountToggle && (
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={draft.discount}
                    onCheckedChange={(v) =>
                      setDraft((d) => ({ ...d, discount: v === true }))
                    }
                  />
                  Только со скидкой
                </label>
              )}
            </div>
            <SheetFooter className="flex-row gap-2">
              <Button variant="outline" className="flex-1" onClick={resetFilters}>
                Сбросить
              </Button>
              <Button className="flex-1" onClick={applyFilters}>
                Применить
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>

        <div className="ml-auto flex items-center gap-2">
          <ArrowDownUp className="hidden size-4 text-muted-foreground sm:block" />
          <Select
            value={active.sort}
            onValueChange={(v) =>
              pushParams({ sort: v === "new" ? null : v })
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              {(Object.keys(SORT_LABELS) as SortKey[]).map((k) => (
                <SelectItem key={k} value={k}>
                  {SORT_LABELS[k]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {activeCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {active.category && (
            <Chip onRemove={() => pushParams({ category: null })}>
              {categoryName ?? active.category}
            </Chip>
          )}
          {active.brand && (
            <Chip onRemove={() => pushParams({ brand: null })}>
              {active.brand}
            </Chip>
          )}
          {(active.minPrice || active.maxPrice) && (
            <Chip
              onRemove={() => pushParams({ minPrice: null, maxPrice: null })}
            >
              {active.minPrice || priceRange.min} – {active.maxPrice || priceRange.max} ₽
            </Chip>
          )}
          {active.inStock && (
            <Chip onRemove={() => pushParams({ inStock: null })}>В наличии</Chip>
          )}
          {active.discount && (
            <Chip onRemove={() => pushParams({ discount: null })}>Со скидкой</Chip>
          )}
          <button
            onClick={resetFilters}
            className="text-xs text-muted-foreground underline-offset-2 hover:underline"
          >
            Сбросить всё
          </button>
        </div>
      )}
    </div>
  );
}

function Chip({
  children,
  onRemove,
}: {
  children: React.ReactNode;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border bg-background px-2.5 py-1 text-xs">
      {children}
      <button
        onClick={onRemove}
        aria-label="Убрать фильтр"
        className="text-muted-foreground hover:text-foreground"
      >
        <X className="size-3" />
      </button>
    </span>
  );
}
