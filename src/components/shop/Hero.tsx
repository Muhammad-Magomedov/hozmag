import Link from "next/link";
import {
  ArrowRight,
  Boxes,
  CreditCard,
  Flame,
  Percent,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";

const TRUST = [
  { icon: Truck, label: "Доставка по РФ" },
  { icon: ShieldCheck, label: "Гарантия производителя" },
  { icon: Boxes, label: "Опт и розница" },
  { icon: CreditCard, label: "Удобная оплата" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-orange-50 via-background to-background p-6 sm:p-10 dark:from-orange-950/30">
      {/* тёплое свечение */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-24 size-80 rounded-full bg-orange-500/15 blur-3xl"
      />
      {/* декоративное пламя справа (только на широких экранах) */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-6 top-1/2 hidden -translate-y-1/2 lg:block"
      >
        <Flame className="size-64 text-orange-500/10" strokeWidth={0.9} />
      </div>

      <div className="relative max-w-2xl space-y-5">
        <span className="inline-flex items-center gap-1.5 rounded-full border bg-background/80 px-3 py-1 text-xs font-medium backdrop-blur">
          <Flame className="size-3.5 text-primary" />
          Отопление · Водоснабжение · Инженерные системы
        </span>

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          {SITE.tagline}
        </h1>

        <p className="text-base text-muted-foreground sm:text-lg">
          {SITE.description}
        </p>

        <div className="flex flex-wrap gap-3">
          <Button size="lg" render={<Link href="#catalog" />}>
            Перейти в каталог
            <ArrowRight className="size-4" />
          </Button>
          <Button size="lg" variant="outline" render={<Link href="/sale" />}>
            <Percent className="size-4" />
            Товары со скидкой
          </Button>
        </div>

        <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5 pt-3 sm:flex sm:flex-wrap">
          {TRUST.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <Icon className="size-4 shrink-0 text-primary" />
              {label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
