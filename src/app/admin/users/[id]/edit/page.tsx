import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getAdminUserById } from "@/lib/admin";
import { canManageUsers } from "@/lib/permissions";
import { PageHeader } from "@/components/admin/PageHeader";
import { UserForm } from "@/components/admin/UserForm";

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const actor = session!.user;
  if (!canManageUsers(actor)) redirect("/admin");

  const { id } = await params;
  const target = await getAdminUserById(id);
  if (!target) notFound();

  // Обычный админ не может редактировать сотрудников.
  if (target.role !== "customer" && actor.role !== "superadmin") {
    redirect("/admin/users");
  }

  return (
    <div>
      <PageHeader title="Редактирование пользователя" description={target.email} />
      <UserForm user={target} canManageAdmins={actor.role === "superadmin"} />
    </div>
  );
}
