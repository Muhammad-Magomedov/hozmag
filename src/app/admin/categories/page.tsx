import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getCategoriesWithCounts } from "@/lib/categories";
import { canManageCategories } from "@/lib/permissions";
import { PageHeader } from "@/components/admin/PageHeader";
import { CategoriesManager } from "@/components/admin/CategoriesManager";

export default async function AdminCategoriesPage() {
  const session = await auth();
  if (!canManageCategories(session!.user)) redirect("/admin");

  const categories = await getCategoriesWithCounts();

  return (
    <div>
      <PageHeader
        title="Категории"
        description="Разделы каталога для группировки товаров"
      />
      <CategoriesManager categories={categories} />
    </div>
  );
}
