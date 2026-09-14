import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getAdminProductById } from "@/lib/admin";
import { getCategories } from "@/lib/categories";
import { canManageProducts } from "@/lib/permissions";
import { PageHeader } from "@/components/admin/PageHeader";
import { ProductForm } from "@/components/admin/ProductForm";
import { DeleteButton } from "@/components/admin/DeleteButton";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!canManageProducts(session!.user)) redirect("/admin");

  const { id } = await params;
  const [product, categories] = await Promise.all([
    getAdminProductById(id),
    getCategories(),
  ]);
  if (!product) notFound();

  return (
    <div>
      <PageHeader
        title="Редактирование товара"
        description={product.name}
        action={
          <DeleteButton
            url={`/api/products/${product._id}`}
            title="Удалить товар?"
            description={`«${product.name}» будет удалён безвозвратно.`}
            redirectTo="/admin/products"
            label="Удалить"
          />
        }
      />
      <ProductForm categories={categories} product={product} />
    </div>
  );
}
