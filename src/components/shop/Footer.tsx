import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { SITE } from "@/lib/site";
import type { CategoryDTO } from "@/types";
import { BrandMark, BrandWordmark } from "./BrandLogo";

export function Footer({ categories }: { categories: CategoryDTO[] }) {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 border-t bg-muted/30">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <BrandMark className="size-8" />
            <span className="text-lg font-bold">
              <BrandWordmark />
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{SITE.description}</p>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Каталог</h3>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            {categories.slice(0, 6).map((c) => (
              <li key={c._id}>
                <Link href={`/?category=${c.slug}`} className="hover:text-foreground">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Покупателям</h3>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            <li>
              <Link href="/sale" className="hover:text-foreground">
                Товары со скидкой
              </Link>
            </li>
            <li>
              <Link href="/cart" className="hover:text-foreground">
                Корзина
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-foreground">
                Личный кабинет
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Контакты</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Phone className="size-4 shrink-0" />
              <a href={`tel:${SITE.phone}`} className="hover:text-foreground">
                {SITE.phone}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="size-4 shrink-0" />
              <a href={`mailto:${SITE.email}`} className="hover:text-foreground">
                {SITE.email}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="size-4 shrink-0 translate-y-0.5" />
              <span>{SITE.address}</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t py-4 text-center text-xs text-muted-foreground">
        © {year} {SITE.name}. Все права защищены.
      </div>
    </footer>
  );
}
