"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUploader } from "./ImageUploader";
import { SpecsEditor } from "./SpecsEditor";
import type { CategoryDTO, ProductDTO, Spec } from "@/types";

export function ProductForm({
  categories,
  product,
}: {
  categories: CategoryDTO[];
  product?: ProductDTO;
}) {
  const router = useRouter();
  const editing = Boolean(product);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: product?.name ?? "",
    category: product?.category?._id ?? categories[0]?._id ?? "",
    brand: product?.brand ?? "",
    sku: product?.sku ?? "",
    price: product?.price != null ? String(product.price) : "",
    oldPrice: product?.oldPrice != null ? String(product.oldPrice) : "",
    stock: product?.stock != null ? String(product.stock) : "0",
    description: product?.description ?? "",
    featured: product?.featured ?? false,
    isActive: product?.isActive ?? true,
    images: (product?.images ?? []) as string[],
    specs: (product?.specs ?? []) as Spec[],
  });

  const set = (patch: Partial<typeof form>) =>
    setForm((f) => ({ ...f, ...patch }));

  const categorySlug = categories.find((c) => c._id === form.category)?.slug;

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("Введите название");
    if (!form.category) return toast.error("Выберите категорию");

    const price = Number(form.price);
    if (!Number.isFinite(price) || price < 0)
      return toast.error("Некорректная цена");

    const oldPrice = form.oldPrice.trim() ? Number(form.oldPrice) : null;
    if (oldPrice !== null && (!Number.isFinite(oldPrice) || oldPrice <= price))
      return toast.error("Старая цена должна быть больше текущей");

    const payload = {
      name: form.name.trim(),
      description: form.description,
      category: form.category,
      brand: form.brand.trim(),
      sku: form.sku.trim(),
      price,
      oldPrice,
      stock: Number(form.stock) || 0,
      images: form.images,
      specs: form.specs.filter((s) => s.name.trim() && s.value.trim()),
      featured: form.featured,
      isActive: form.isActive,
    };

    setSaving(true);
    try {
      const res = await fetch(
        editing ? `/api/products/${product!._id}` : "/api/products",
        {
          method: editing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка сохранения");
      toast.success(editing ? "Товар обновлён" : "Товар создан");
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Ошибка");
    } finally {
      setSaving(false);
    }
  }

  if (!categories.length) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
          <AlertTriangle className="size-8 text-amber-500" />
          <p className="text-muted-foreground">
            Нет ни одной категории. Товар нельзя создать без категории.
          </p>
          <Button render={<Link href="/admin/categories" />}>
            Создать категорию
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={submit} className="max-w-3xl space-y-6 pb-20">
      <Card>
        <CardHeader>
          <CardTitle>Основное</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Название *</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => set({ name: e.target.value })}
              placeholder="Труба полипропиленовая PN25 32 мм"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Категория *</Label>
              <Select
                value={form.category}
                onValueChange={(v) => set({ category: v ?? "" })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Выберите" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c._id} value={c._id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="brand">Производитель</Label>
              <Input
                id="brand"
                value={form.brand}
                onChange={(e) => set({ brand: e.target.value })}
                placeholder="Valtec"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="price">Цена, ₽ *</Label>
              <Input
                id="price"
                type="number"
                min={0}
                inputMode="numeric"
                value={form.price}
                onChange={(e) => set({ price: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="oldPrice">Старая цена, ₽</Label>
              <Input
                id="oldPrice"
                type="number"
                min={0}
                inputMode="numeric"
                value={form.oldPrice}
                onChange={(e) => set({ oldPrice: e.target.value })}
                placeholder="для скидки"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="stock">Остаток, шт.</Label>
              <Input
                id="stock"
                type="number"
                min={0}
                inputMode="numeric"
                value={form.stock}
                onChange={(e) => set({ stock: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="sku">Артикул</Label>
            <Input
              id="sku"
              value={form.sku}
              onChange={(e) => set({ sku: e.target.value })}
              placeholder="SKU-001"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              rows={4}
              value={form.description}
              onChange={(e) => set({ description: e.target.value })}
              placeholder="Назначение, особенности, область применения…"
            />
          </div>

          <div className="flex flex-wrap gap-6 pt-1">
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={form.featured}
                onCheckedChange={(v) => set({ featured: v === true })}
              />
              Рекомендуемый (Хит продаж)
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={form.isActive}
                onCheckedChange={(v) => set({ isActive: v === true })}
              />
              Активен (показывать в каталоге)
            </label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Фотографии</CardTitle>
        </CardHeader>
        <CardContent>
          <ImageUploader
            value={form.images}
            onChange={(images) => set({ images })}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Характеристики</CardTitle>
        </CardHeader>
        <CardContent>
          <SpecsEditor
            value={form.specs}
            onChange={(specs) => set({ specs })}
            categorySlug={categorySlug}
          />
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button type="submit" disabled={saving} size="lg">
          {saving ? "Сохранение…" : editing ? "Сохранить изменения" : "Создать товар"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => router.push("/admin/products")}
        >
          Отмена
        </Button>
      </div>
    </form>
  );
}
