import { NextResponse } from "next/server";
import { auth } from "@/auth";
import type { Permission, Role } from "@/types";

export interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  role: Role;
  permissions: Permission[];
}

/** Текущий пользователь из сессии (или null). */
export async function currentUser(): Promise<SessionUser | null> {
  const session = await auth();
  return (session?.user as SessionUser) ?? null;
}

export const ok = (data: unknown, status = 200) =>
  NextResponse.json(data, { status });
export const badRequest = (error: string, details?: unknown) =>
  NextResponse.json({ error, details }, { status: 400 });
export const unauthorized = (error = "Требуется вход") =>
  NextResponse.json({ error }, { status: 401 });
export const forbidden = (error = "Недостаточно прав") =>
  NextResponse.json({ error }, { status: 403 });
export const notFound = (error = "Не найдено") =>
  NextResponse.json({ error }, { status: 404 });
export const serverError = (error = "Внутренняя ошибка сервера") =>
  NextResponse.json({ error }, { status: 500 });
