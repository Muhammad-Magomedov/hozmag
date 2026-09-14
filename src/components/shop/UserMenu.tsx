"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { LayoutDashboard, LogIn, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ROLE_LABELS } from "@/types";

export function UserMenu() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="size-9 shrink-0" aria-hidden />;
  }

  if (!session?.user) {
    return (
      <Button variant="outline" size="sm" render={<Link href="/login" />}>
        <LogIn className="size-4" />
        <span className="hidden sm:inline">Войти</span>
      </Button>
    );
  }

  const user = session.user;
  const isStaff = user.role === "admin" || user.role === "superadmin";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="ghost" size="icon" aria-label="Аккаунт" />}
      >
        <User className="size-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="flex flex-col gap-0.5">
          <span className="truncate">{user.name}</span>
          <span className="truncate text-xs font-normal text-muted-foreground">
            {user.email}
          </span>
          <span className="mt-1 w-fit rounded bg-muted px-1.5 py-0.5 text-[11px] font-medium">
            {ROLE_LABELS[user.role]}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isStaff && (
          <DropdownMenuItem render={<Link href="/admin" />}>
            <LayoutDashboard className="size-4" />
            Админ-панель
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
          <LogOut className="size-4" />
          Выйти
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
