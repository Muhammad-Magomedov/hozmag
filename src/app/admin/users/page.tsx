import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { auth } from "@/auth";
import { getAdminUsers } from "@/lib/admin";
import { canManageUsers } from "@/lib/permissions";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/admin/PageHeader";
import { UsersTable } from "@/components/admin/UsersTable";

export default async function AdminUsersPage() {
  const session = await auth();
  const user = session!.user;
  if (!canManageUsers(user)) redirect("/admin");

  const users = await getAdminUsers(user.role);

  return (
    <div>
      <PageHeader
        title="Пользователи"
        description={
          user.role === "superadmin"
            ? "Покупатели и сотрудники магазина"
            : "Покупатели магазина"
        }
        action={
          <Button render={<Link href="/admin/users/new" />}>
            <Plus className="size-4" />
            Добавить
          </Button>
        }
      />
      <UsersTable users={users} currentUserId={user.id} />
    </div>
  );
}
