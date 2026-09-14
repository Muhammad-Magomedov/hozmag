import type { Permission, Role } from "@/types";

export interface Principal {
  role: Role;
  permissions?: Permission[];
}

export function isSuperAdmin(u?: Principal | null): boolean {
  return u?.role === "superadmin";
}

/** Любой сотрудник админки (админ или супер-админ). */
export function isAdmin(u?: Principal | null): boolean {
  return u?.role === "admin" || u?.role === "superadmin";
}

export function hasPermission(
  u: Principal | null | undefined,
  perm: Permission,
): boolean {
  if (!u) return false;
  if (u.role === "superadmin") return true; // супер-админ может всё
  if (u.role !== "admin") return false;
  return (u.permissions ?? []).includes(perm);
}

export const canManageProducts = (u?: Principal | null) =>
  hasPermission(u, "products:manage");
export const canManageCategories = (u?: Principal | null) =>
  hasPermission(u, "categories:manage");
export const canManageUsers = (u?: Principal | null) =>
  hasPermission(u, "users:manage");
export const canManageOrders = (u?: Principal | null) =>
  hasPermission(u, "orders:manage");

/**
 * Может ли актор создавать/редактировать/удалять пользователя с ролью `role`.
 * Админов и супер-админов трогает только супер-админ; покупателей — любой,
 * у кого есть право users:manage.
 */
export function canActOnRole(actor: Principal, role: Role): boolean {
  if (role === "admin" || role === "superadmin") {
    return actor.role === "superadmin";
  }
  return canManageUsers(actor);
}
