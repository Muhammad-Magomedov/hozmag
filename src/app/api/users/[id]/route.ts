import type { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { isValidObjectId } from "mongoose";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { userUpdateSchema } from "@/lib/validation";
import { serializeUser } from "@/lib/serialize";
import {
  badRequest,
  currentUser,
  forbidden,
  notFound,
  ok,
  serverError,
  unauthorized,
} from "@/lib/api-helpers";
import { canActOnRole, canManageUsers } from "@/lib/permissions";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Ctx) {
  try {
    const user = await currentUser();
    if (!user) return unauthorized();
    if (!canManageUsers(user)) return forbidden();

    const { id } = await params;
    if (!isValidObjectId(id)) return notFound();

    const parsed = userUpdateSchema.safeParse(await req.json());
    if (!parsed.success) {
      return badRequest(
        parsed.error.issues[0]?.message ?? "Проверьте поля",
        parsed.error.issues,
      );
    }
    const data = parsed.data;

    await dbConnect();
    const target = await User.findById(id);
    if (!target) return notFound();

    // Право трогать текущую роль цели.
    if (!canActOnRole(user, target.role)) return forbidden();

    const nextRole = data.role ?? target.role;
    if (nextRole !== target.role && !canActOnRole(user, nextRole)) {
      return forbidden("Недостаточно прав для смены роли");
    }

    // Нельзя понизить последнего супер-админа.
    if (target.role === "superadmin" && nextRole !== "superadmin") {
      const supers = await User.countDocuments({ role: "superadmin" });
      if (supers <= 1) {
        return badRequest("Нельзя понизить роль последнего супер-админа");
      }
    }

    if (data.email && data.email.toLowerCase() !== target.email) {
      const email = data.email.toLowerCase().trim();
      const clash = await User.findOne({ email, _id: { $ne: id } }).lean();
      if (clash) return badRequest("Email уже занят");
      target.email = email;
    }
    if (data.name !== undefined) target.name = data.name;
    if (data.phone !== undefined) target.phone = data.phone;
    if (data.password) target.password = await bcrypt.hash(data.password, 10);
    if (data.role !== undefined) target.role = data.role;

    // Права: назначает только супер-админ и только роли admin.
    if (user.role === "superadmin" && data.permissions !== undefined) {
      target.permissions = nextRole === "admin" ? data.permissions : [];
    } else if (nextRole !== "admin") {
      target.permissions = [];
    }

    await target.save();
    return ok({ user: serializeUser(target) });
  } catch (e) {
    return serverError((e as Error).message);
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  try {
    const user = await currentUser();
    if (!user) return unauthorized();
    if (!canManageUsers(user)) return forbidden();

    const { id } = await params;
    if (!isValidObjectId(id)) return notFound();
    if (id === user.id) return badRequest("Нельзя удалить собственный аккаунт");

    await dbConnect();
    const target = await User.findById(id);
    if (!target) return notFound();

    if (!canActOnRole(user, target.role)) return forbidden();

    if (target.role === "superadmin") {
      const supers = await User.countDocuments({ role: "superadmin" });
      if (supers <= 1) {
        return badRequest("Нельзя удалить последнего супер-админа");
      }
    }

    await target.deleteOne();
    return ok({ ok: true });
  } catch (e) {
    return serverError((e as Error).message);
  }
}
