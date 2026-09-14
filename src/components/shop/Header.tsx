"use client";

import Link from "next/link";
import { Menu, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { CategoryDTO } from "@/types";
import { BrandLogo, BrandMark, BrandWordmark } from "./BrandLogo";
import { SearchBar } from "./SearchBar";
import { CartButton } from "./CartButton";
import { UserMenu } from "./UserMenu";

export function Header({ categories }: { categories: CategoryDTO[] }) {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
        <MobileMenu categories={categories} />

        <Link href="/" className="shrink-0" aria-label="ТеплоСнаб — на главную">
          <BrandLogo textClassName="hidden text-lg font-bold tracking-tight sm:inline-flex" />
        </Link>

        <SearchBar className="mx-auto hidden max-w-xl flex-1 md:block" />

        <div className="ml-auto flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="hidden lg:inline-flex"
            render={<Link href="/sale" />}
          >
            <Percent className="size-4" />
            Скидки
          </Button>
          <UserMenu />
          <CartButton />
        </div>
      </div>

      {/* Навигация по категориям */}
      <nav className="border-t bg-muted/30">
        <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-4 py-2 text-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Link
            href="/"
            className="whitespace-nowrap rounded-md px-3 py-1.5 font-medium hover:bg-accent"
          >
            Все товары
          </Link>
          {categories.map((c) => (
            <Link
              key={c._id}
              href={`/?category=${c.slug}`}
              className="whitespace-nowrap rounded-md px-3 py-1.5 hover:bg-accent"
            >
              {c.name}
            </Link>
          ))}
          <Link
            href="/sale"
            className="ml-1 inline-flex items-center gap-1 whitespace-nowrap rounded-md px-3 py-1.5 font-medium text-red-600 hover:bg-accent dark:text-red-500"
          >
            <Percent className="size-3.5" />
            Со скидкой
          </Link>
        </div>
      </nav>

      {/* Поиск под шапкой на мобильных */}
      <div className="border-t px-4 py-2 md:hidden">
        <SearchBar />
      </div>
    </header>
  );
}

function MobileMenu({ categories }: { categories: CategoryDTO[] }) {
  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Меню"
          />
        }
      >
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <BrandMark className="size-7" />
            <BrandWordmark />
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-0.5 overflow-y-auto px-2 pb-4">
          <SheetClose
            render={
              <Link
                href="/"
                className="rounded-md px-3 py-2 font-medium hover:bg-accent"
              />
            }
          >
            Все товары
          </SheetClose>
          {categories.map((c) => (
            <SheetClose
              key={c._id}
              render={
                <Link
                  href={`/?category=${c.slug}`}
                  className="rounded-md px-3 py-2 hover:bg-accent"
                />
              }
            >
              {c.name}
            </SheetClose>
          ))}
          <SheetClose
            render={
              <Link
                href="/sale"
                className="rounded-md px-3 py-2 font-medium text-red-600 hover:bg-accent dark:text-red-500"
              />
            }
          >
            Со скидкой
          </SheetClose>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
