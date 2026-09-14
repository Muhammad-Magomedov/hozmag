"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import { ROLE_LABELS, type Role, type UserDTO } from "@/types";
import { DeleteButton } from "./DeleteButton";

const roleBadge: Record<Role, "default" | "secondary" | "outline"> = {
  superadmin: "default",
  admin: "secondary",
  customer: "outline",
};

export function UsersTable({
  users,
  currentUserId,
}: {
  users: UserDTO[];
  currentUserId: string;
}) {
  if (!users.length) {
    return (
      <div className="rounded-xl border border-dashed py-16 text-center text-muted-foreground">
        Пользователей пока нет.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Пользователь</TableHead>
            <TableHead className="hidden sm:table-cell">Телефон</TableHead>
            <TableHead>Роль</TableHead>
            <TableHead className="hidden md:table-cell">Регистрация</TableHead>
            <TableHead className="text-right">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((u) => {
            const isSelf = u._id === currentUserId;
            return (
              <TableRow key={u._id}>
                <TableCell>
                  <div className="font-medium">
                    {u.name}
                    {isSelf && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        (вы)
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">{u.email}</div>
                </TableCell>
                <TableCell className="hidden text-sm text-muted-foreground sm:table-cell">
                  {u.phone || "—"}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col items-start gap-1">
                    <Badge variant={roleBadge[u.role]}>
                      {ROLE_LABELS[u.role]}
                    </Badge>
                    {u.role === "admin" && u.permissions.length > 0 && (
                      <span className="text-[11px] text-muted-foreground">
                        прав: {u.permissions.length}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                  {formatDate(u.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      render={
                        <Link
                          href={`/admin/users/${u._id}/edit`}
                          aria-label="Редактировать"
                        />
                      }
                    >
                      <Pencil className="size-4" />
                    </Button>
                    {!isSelf && (
                      <DeleteButton
                        url={`/api/users/${u._id}`}
                        title="Удалить пользователя?"
                        description={`«${u.name}» будет удалён.`}
                      />
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
