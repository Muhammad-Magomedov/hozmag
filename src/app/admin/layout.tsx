import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@/auth";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  title: "Админ-панель",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const user = session?.user;
  if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
    redirect("/login?callbackUrl=/admin");
  }

  return (
    <AdminShell
      user={{
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
      }}
    >
      {children}
    </AdminShell>
  );
}
