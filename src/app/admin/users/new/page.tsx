import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { canManageUsers } from "@/lib/permissions";
import { PageHeader } from "@/components/admin/PageHeader";
import { UserForm } from "@/components/admin/UserForm";

export default async function NewUserPage() {
  const session = await auth();
  const user = session!.user;
  if (!canManageUsers(user)) redirect("/admin");

  return (
    <div>
      <PageHeader
        title="Новый пользователь"
        description={
          user.role === "superadmin"
            ? "Покупатель или сотрудник с правами"
            : "Новый покупатель"
        }
      />
      <UserForm canManageAdmins={user.role === "superadmin"} />
    </div>
  );
}
