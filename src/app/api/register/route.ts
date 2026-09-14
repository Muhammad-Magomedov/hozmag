import type { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { registerSchema } from "@/lib/validation";
import { badRequest, ok, serverError } from "@/lib/api-helpers";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest(
        parsed.error.issues[0]?.message ?? "Проверьте поля",
        parsed.error.issues,
      );
    }
    const { name, email, password, phone } = parsed.data;
    const normEmail = email.toLowerCase().trim();

    await dbConnect();
    const exists = await User.findOne({ email: normEmail }).lean();
    if (exists) {
      return badRequest("Пользователь с таким email уже существует");
    }

    const hash = await bcrypt.hash(password, 10);
    await User.create({
      name,
      email: normEmail,
      password: hash,
      phone: phone ?? "",
      role: "customer",
      permissions: [],
    });

    return ok({ ok: true }, 201);
  } catch (e) {
    return serverError((e as Error).message);
  }
}
