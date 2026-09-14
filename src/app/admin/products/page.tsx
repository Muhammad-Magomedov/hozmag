import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { auth } from "@/auth";
import { getAdminProducts } from "@/lib/admin";
import { canManageProducts } from "@/lib/permissions";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/admin/PageHeader";
import { ProductsTable } from "@/components/admin/ProductsTable";

export default async function AdminProductsPage() {
  const session = await auth();
  const user = session!.user;
  if (!canManageProducts(user)) redirect("/admin");

  const products = await getAdminProducts();

  return (
    <div>
      <PageHeader
        title="Товары"
        description={`Всего: ${products.length}`}
        action={
          <Button render={<Link href="/admin/products/new" />}>
            <Plus className="size-4" />
            Добавить товар
          </Button>
        }
      />
      <ProductsTable products={products} />
    </div>
  );
}
