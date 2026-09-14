"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ALL_PERMISSIONS,
  PERMISSION_LABELS,
  ROLE_LABELS,
  type Permission,
  type Role,
  type UserDTO,
} from "@/types";

export function UserForm({
  user,
  canManageAdmins,
}: {
  user?: UserDTO;
  // true, если текущий актор — супер-админ (может назначать роли и права).
  canManageAdmins: boolean;
}) {
  const router = useRouter();
  const editing = Boolean(user);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    password: "",
    phone: user?.phone ?? "",
    role: (user?.role ?? "customer") as Role,
    permissions: (user?.permissions ?? []) as Permission[],
  });

  const set = (patch: Partial<typeof form>) =>
    setForm((f) => ({ ...f, ...patch }));

  function togglePerm(p: Permission) {
    set({
      permissions: form.permissions.includes(p)
        ? form.permissions.filter((x) => x !== p)
        : [...form.permissions, p],
    });
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("Введите имя");
    if (!form.email.trim()) return toast.error("Введите email");
    if (!editing && form.password.length < 6)
      return toast.error("Пароль минимум 6 символов");
    if (editing && form.password && form.password.length < 6)
      return toast.error("Пароль минимум 6 символов");

    const role: Role = canManageAdmins ? form.role : "customer";
    const payload: Record<string, unknown> = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      role,
      permissions: role === "admin" ? form.permissions : [],
    };
    if (!editing || form.password) payload.password = form.password;

    setSaving(true);
    try {
      const res = await fetch(
        editing ? `/api/users/${user!._id}` : "/api/users",
        {
          method: editing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка сохранения");
      toast.success(editing ? "Сохранено" : "Пользователь создан");
      router.push("/admin/users");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Ошибка");
    } finally {
      setSaving(false);
    }
  }

  const showPermissions = canManageAdmins && form.role === "admin";

  return (
    <form onSubmit={submit} className="max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Данные пользователя</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="u-name">Имя *</Label>
              <Input
                id="u-name"
                value={form.name}
                onChange={(e) => set({ name: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="u-phone">Телефон</Label>
              <Input
                id="u-phone"
                value={form.phone}
                onChange={(e) => set({ phone: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="u-email">Email *</Label>
            <Input
              id="u-email"
              type="email"
              value={form.email}
              onChange={(e) => set({ email: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="u-password">
              Пароль {editing ? "(оставьте пустым, чтобы не менять)" : "*"}
            </Label>
            <Input
              id="u-password"
              type="password"
              autoComplete="new-password"
              value={form.password}
              onChange={(e) => set({ password: e.target.value })}
            />
          </div>

          {canManageAdmins && (
            <div className="space-y-1.5">
              <Label>Роль</Label>
              <Select
                value={form.role}
                onValueChange={(v) => set({ role: (v ?? "customer") as Role })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(["customer", "admin", "superadmin"] as Role[]).map((r) => (
                    <SelectItem key={r} value={r}>
                      {ROLE_LABELS[r]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      {showPermissions && (
        <Card>
          <CardHeader>
            <CardTitle>Права администратора</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="flex items-start gap-2 text-sm text-muted-foreground">
              <Info className="mt-0.5 size-4 shrink-0" />
              Отметьте разделы, к которым у администратора будет доступ. Права на
              управление другими администраторами есть только у супер-админа.
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {ALL_PERMISSIONS.map((p) => (
                <label
                  key={p}
                  className="flex items-center gap-2 rounded-lg border p-3 text-sm"
                >
                  <Checkbox
                    checked={form.permissions.includes(p)}
                    onCheckedChange={() => togglePerm(p)}
                  />
                  {PERMISSION_LABELS[p]}
                </label>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-2">
        <Button type="submit" disabled={saving} size="lg">
          {saving
            ? "Сохранение…"
            : editing
              ? "Сохранить изменения"
              : "Создать пользователя"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => router.push("/admin/users")}
        >
          Отмена
        </Button>
      </div>
    </form>
  );
}
