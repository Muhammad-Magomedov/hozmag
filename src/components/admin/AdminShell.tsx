"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import {
  FolderTree,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Store,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandMark, BrandWordmark } from "@/components/shop/BrandLogo";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  canManageCategories,
  canManageProducts,
  canManageUsers,
  type Principal,
} from "@/lib/permissions";
import { ROLE_LABELS, type Permission, type Role } from "@/types";

interface AdminUser {
  name?: string | null;
  email?: string | null;
  role: Role;
  permissions: Permission[];
}

const NAV: {
  href: string;
  label: string;
  icon: typeof Package;
  exact?: boolean;
  show: (u: Principal) => boolean;
}[] = [
  {
    href: "/admin",
    label: "Дашборд",
    icon: LayoutDashboard,
    exact: true,
    show: () => true,
  },
  {
    href: "/admin/products",
    label: "Товары",
    icon: Package,
    show: (u) => canManageProducts(u),
  },
  {
    href: "/admin/categories",
    label: "Категории",
    icon: FolderTree,
    show: (u) => canManageCategories(u),
  },
  {
    href: "/admin/users",
    label: "Пользователи",
    icon: Users,
    show: (u) => canManageUsers(u),
  },
];

function SidebarInner({ user }: { user: AdminUser }) {
  const pathname = usePathname();
  const items = NAV.filter((i) => i.show(user));

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b p-4">
        <BrandMark className="size-9" />
        <div className="min-w-0">
          <div className="truncate text-sm font-bold">
            <BrandWordmark />
          </div>
          <div className="text-xs text-muted-foreground">Админ-панель</div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {items.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition",
                active
                  ? "bg-primary font-medium text-primary-foreground"
                  : "text-foreground/80 hover:bg-accent",
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-2 border-t p-3">
        <div className="rounded-md bg-muted/60 px-3 py-2">
          <div className="truncate text-sm font-medium">{user.name}</div>
          <div className="truncate text-xs text-muted-foreground">
            {user.email}
          </div>
          <div className="mt-1 inline-block rounded bg-background px-1.5 py-0.5 text-[11px] font-medium">
            {ROLE_LABELS[user.role]}
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start"
          render={<Link href="/" />}
        >
          <Store className="size-4" />
          Открыть магазин
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-muted-foreground"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="size-4" />
          Выйти
        </Button>
      </div>
    </div>
  );
}

export function AdminShell({
  user,
  children,
}: {
  user: AdminUser;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  return (
    <div className="flex min-h-screen flex-1 bg-muted/20">
      <aside className="hidden w-60 shrink-0 border-r bg-card md:block">
        <div className="sticky top-0 h-screen">
          <SidebarInner user={user} />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-2 border-b bg-card p-3 md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={<Button variant="outline" size="icon" aria-label="Меню" />}
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SheetHeader className="sr-only">
                <SheetTitle>Меню админ-панели</SheetTitle>
              </SheetHeader>
              <SidebarInner user={user} />
            </SheetContent>
          </Sheet>
          <span className="font-semibold">Админ-панель</span>
        </div>

        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
