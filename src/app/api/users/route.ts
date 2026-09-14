/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { userCreateSchema } from "@/lib/validation";
import { serializeUser } from "@/lib/serialize";
import {
  badRequest,
  currentUser,
  forbidden,
  ok,
  serverError,
  unauthorized,
} from "@/lib/api-helpers";
import { canActOnRole, canManageUsers } from "@/lib/permissions";

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) return unauthorized();
    if (!canManageUsers(user)) return forbidden();

    await dbConnect();
    const sp = req.nextUrl.searchParams;
    const q = sp.get("q");
    const roleFilter = sp.get("role");
    const query: any = {};

    // Обычный админ видит только покупателей.
    if (user.role !== "superadmin") {
      query.role = "customer";
    } else if (
      roleFilter &&
      ["superadmin", "admin", "customer"].includes(roleFilter)
    ) {
      query.role = roleFilter;
    }

    if (q) {
      const rx = new RegExp(escapeRegex(q), "i");
      query.$or = [{ name: rx }, { email: rx }, { phone: rx }];
    }

    const docs = await User.find(query).sort({ createdAt: -1 }).lean();
    return ok({ users: docs.map(serializeUser) });
  } catch (e) {
    return serverError((e as Error).message);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) return unauthorized();
    if (!canManageUsers(user)) return forbidden();

    const parsed = userCreateSchema.safeParse(await req.json());
    if (!parsed.success) {
      return badRequest(
        parsed.error.issues[0]?.message ?? "Проверьте поля",
        parsed.error.issues,
      );
    }
    const data = parsed.data;

    if (!canActOnRole(user, data.role)) {
      return forbidden("Недостаточно прав для создания пользователя с этой ролью");
    }

    await dbConnect();
    const email = data.email.toLowerCase().trim();
    const exists = await User.findOne({ email }).lean();
    if (exists) return badRequest("Пользователь с таким email уже существует");

    const hash = await bcrypt.hash(data.password, 10);
    // Права имеют смысл только для роли admin и назначаются супер-админом.
    const permissions =
      data.role === "admin" && user.role === "superadmin"
        ? data.permissions
        : [];

    const doc = await User.create({
      name: data.name,
      email,
      password: hash,
      role: data.role,
      permissions,
      phone: data.phone ?? "",
    });

    return ok({ user: serializeUser(doc) }, 201);
  } catch (e) {
    return serverError((e as Error).message);
  }
}
