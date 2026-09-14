import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getCategories } from "@/lib/categories";
import { canManageProducts } from "@/lib/permissions";
import { PageHeader } from "@/components/admin/PageHeader";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const session = await auth();
  if (!canManageProducts(session!.user)) redirect("/admin");

  const categories = await getCategories();

  return (
    <div>
      <PageHeader title="Новый товар" description="Заполните карточку товара" />
      <ProductForm categories={categories} />
    </div>
  );
}
