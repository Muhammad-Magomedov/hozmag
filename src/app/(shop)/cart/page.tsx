"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Thumb } from "@/components/shop/Thumb";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const clear = useCart((s) => s.clear);
  const total = items.reduce((sum, i) => sum + i.qty * i.price, 0);
  const count = items.reduce((sum, i) => sum + i.qty, 0);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    comment: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function checkout(e: FormEvent) {
    e.preventDefault();
    if (!items.length) return;
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, qty: i.qty })),
          customer: form,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Не удалось оформить заказ");
      clear();
      toast.success("Заказ оформлен! Мы свяжемся с вами в ближайшее время.");
      router.push("/");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Ошибка");
    } finally {
      setLoading(false);
    }
  }

  if (!items.length) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-20 text-center">
        <ShoppingBag className="size-12 text-muted-foreground" />
        <h1 className="text-2xl font-bold">Корзина пуста</h1>
        <p className="text-muted-foreground">
          Загляните в каталог — там есть что подобрать для отопления и
          водоснабжения.
        </p>
        <Button render={<Link href="/" />}>
          <ArrowLeft className="size-4" />В каталог
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          Корзина{" "}
          <span className="text-base font-normal text-muted-foreground">
            · {count} шт.
          </span>
        </h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={clear}
          className="text-muted-foreground"
        >
          <Trash2 className="size-4" />
          Очистить
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Список товаров */}
        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={item.productId}
              className="flex gap-3 rounded-xl border bg-card p-3"
            >
              <Link
                href={`/product/${item.slug}`}
                className="size-20 shrink-0 overflow-hidden rounded-lg border bg-muted"
              >
                <Thumb
                  src={item.image}
                  alt={item.name}
                  className="size-full object-cover"
                />
              </Link>

              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <Link
                  href={`/product/${item.slug}`}
                  className="line-clamp-2 text-sm font-medium hover:underline"
                >
                  {item.name}
                </Link>
                <span className="text-sm text-muted-foreground">
                  {formatPrice(item.price)} / шт.
                </span>

                <div className="mt-auto flex items-center justify-between gap-2">
                  <div className="inline-flex items-center rounded-lg border">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      onClick={() => setQty(item.productId, item.qty - 1)}
                      aria-label="Уменьшить"
                    >
                      <Minus className="size-3.5" />
                    </Button>
                    <span className="w-9 text-center text-sm font-medium tabular-nums">
                      {item.qty}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      onClick={() => setQty(item.productId, item.qty + 1)}
                      disabled={item.stock > 0 && item.qty >= item.stock}
                      aria-label="Увеличить"
                    >
                      <Plus className="size-3.5" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-semibold tabular-nums">
                      {formatPrice(item.price * item.qty)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-muted-foreground hover:text-destructive"
                      onClick={() => remove(item.productId)}
                      aria-label="Удалить"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Оформление */}
        <form
          onSubmit={checkout}
          className="h-fit space-y-4 rounded-xl border bg-card p-4 lg:sticky lg:top-28"
        >
          <h2 className="font-semibold">Оформление заказа</h2>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Товары ({count})</span>
            <span className="tabular-nums">{formatPrice(total)}</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between text-base font-semibold">
            <span>Итого</span>
            <span className="tabular-nums">{formatPrice(total)}</span>
          </div>

          <div className="space-y-3 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="name">Имя *</Label>
              <Input
                id="name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Иван Иванов"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Телефон *</Label>
              <Input
                id="phone"
                required
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+7 900 000-00-00"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="address">Адрес доставки</Label>
              <Input
                id="address"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="Город, улица, дом"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="comment">Комментарий</Label>
              <Textarea
                id="comment"
                rows={2}
                value={form.comment}
                onChange={(e) => setForm({ ...form, comment: e.target.value })}
                placeholder="Пожелания к заказу"
              />
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? "Оформляем…" : "Оформить заказ"}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Нажимая кнопку, вы соглашаетесь на обработку персональных данных.
          </p>
        </form>
      </div>
    </div>
  );
}
