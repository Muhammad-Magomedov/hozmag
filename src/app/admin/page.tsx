import Link from "next/link";
import {
  FolderTree,
  Package,
  PackageX,
  Percent,
  Plus,
  ShoppingCart,
  UserCog,
  Users,
} from "lucide-react";
import { auth } from "@/auth";
import { getAdminStats } from "@/lib/admin";
import {
  canManageCategories,
  canManageProducts,
  canManageUsers,
} from "@/lib/permissions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/admin/PageHeader";

function Stat({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: number;
  icon: typeof Package;
  accent?: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 py-5">
        <span
          className={`grid size-11 shrink-0 place-items-center rounded-xl ${
            accent ?? "bg-primary/10 text-primary"
          }`}
        >
          <Icon className="size-5" />
        </span>
        <div>
          <div className="text-2xl font-bold tabular-nums">{value}</div>
          <div className="text-sm text-muted-foreground">{label}</div>
        </div>
      </CardContent>
    </Card>
  );
}

export default async function AdminDashboard() {
  const session = await auth();
  const user = session!.user;
  const stats = await getAdminStats();

  return (
    <div>
      <PageHeader
        title={`Здравствуйте, ${user.name ?? "администратор"}`}
        description="Обзор магазина и быстрые действия"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {canManageProducts(user) && (
          <>
            <Stat label="Товаров всего" value={stats.products} icon={Package} />
            <Stat
              label="Активных"
              value={stats.active}
              icon={Package}
              accent="bg-green-500/10 text-green-600"
            />
            <Stat
              label="Нет в наличии"
              value={stats.outOfStock}
              icon={PackageX}
              accent="bg-amber-500/10 text-amber-600"
            />
            <Stat
              label="Со скидкой"
              value={stats.discounted}
              icon={Percent}
              accent="bg-red-500/10 text-red-600"
            />
          </>
        )}
        {canManageCategories(user) && (
          <Stat label="Категорий" value={stats.categories} icon={FolderTree} />
        )}
        {canManageUsers(user) && (
          <Stat label="Покупателей" value={stats.customers} icon={Users} />
        )}
        {user.role === "superadmin" && (
          <>
            <Stat label="Сотрудников" value={stats.admins} icon={UserCog} />
            <Stat
              label="Новых заказов"
              value={stats.newOrders}
              icon={ShoppingCart}
              accent="bg-blue-500/10 text-blue-600"
            />
          </>
        )}
      </div>

      <div className="mt-8 space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground">
          Быстрые действия
        </h2>
        <div className="flex flex-wrap gap-2">
          {canManageProducts(user) && (
            <Button render={<Link href="/admin/products/new" />}>
              <Plus className="size-4" />
              Добавить товар
            </Button>
          )}
          {canManageCategories(user) && (
            <Button variant="outline" render={<Link href="/admin/categories" />}>
              <FolderTree className="size-4" />
              Категории
            </Button>
          )}
          {canManageUsers(user) && (
            <Button variant="outline" render={<Link href="/admin/users/new" />}>
              <Plus className="size-4" />
              Добавить пользователя
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
