import type { NextRequest } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";
import {
  badRequest,
  currentUser,
  forbidden,
  ok,
  serverError,
  unauthorized,
} from "@/lib/api-helpers";
import { canManageProducts } from "@/lib/permissions";

export const runtime = "nodejs";

const ALLOWED: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
};
const MAX_SIZE = 5 * 1024 * 1024; // 5 МБ

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) return unauthorized();
    if (!canManageProducts(user)) return forbidden();

    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return badRequest("Файл не передан");

    const ext = ALLOWED[file.type];
    if (!ext) return badRequest("Допустимы JPG, PNG, WEBP, GIF, SVG");
    if (file.size > MAX_SIZE) return badRequest("Файл больше 5 МБ");

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now().toString(36)}-${crypto
      .randomBytes(6)
      .toString("hex")}.${ext}`;

    const dir = path.join(process.cwd(), "public", "uploads");
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, filename), buffer);

    return ok({ url: `/uploads/${filename}` }, 201);
  } catch (e) {
    return serverError((e as Error).message);
  }
}
