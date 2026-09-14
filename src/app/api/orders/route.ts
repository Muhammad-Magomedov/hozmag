import type { NextRequest } from "next/server";
import { isValidObjectId } from "mongoose";
import { dbConnect } from "@/lib/db";
import Product from "@/models/Product";
import Order from "@/models/Order";
import { orderSchema } from "@/lib/validation";
import {
  badRequest,
  currentUser,
  forbidden,
  ok,
  serverError,
  unauthorized,
} from "@/lib/api-helpers";
import { canManageOrders } from "@/lib/permissions";

export async function POST(req: NextRequest) {
  try {
    const parsed = orderSchema.safeParse(await req.json());
    if (!parsed.success) {
      return badRequest(
        parsed.error.issues[0]?.message ?? "Проверьте корзину",
        parsed.error.issues,
      );
    }
    const { items, customer } = parsed.data;

    if (items.some((i) => !isValidObjectId(i.productId))) {
      return badRequest("В корзине есть некорректный товар");
    }

    await dbConnect();
    const ids = items.map((i) => i.productId);
    const products = await Product.find({
      _id: { $in: ids },
      isActive: true,
    }).lean();
    const map = new Map(products.map((p) => [String(p._id), p]));

    // Цены берём из БД, а не из клиента.
    const orderItems = [];
    for (const it of items) {
      const p = map.get(it.productId);
      if (!p) return badRequest("Некоторые товары больше недоступны");
      orderItems.push({
        product: p._id,
        name: p.name,
        price: p.price,
        qty: it.qty,
        image: p.images?.[0] ?? "",
      });
    }
    const total = orderItems.reduce((s, i) => s + i.price * i.qty, 0);

    const user = await currentUser();
    const order = await Order.create({
      user: user?.id ?? null,
      items: orderItems,
      total,
      customer,
      status: "new",
    });

    return ok({ ok: true, orderId: String(order._id) }, 201);
  } catch (e) {
    return serverError((e as Error).message);
  }
}

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) return unauthorized();
    if (!canManageOrders(user)) return forbidden();

    await dbConnect();
    const orders = await Order.find().sort({ createdAt: -1 }).limit(200).lean();
    return ok({
      orders: orders.map((o) => ({
        _id: String(o._id),
        items: o.items,
        total: o.total,
        customer: o.customer,
        status: o.status,
        createdAt: o.createdAt
          ? new Date(o.createdAt as unknown as string).toISOString()
          : "",
      })),
    });
  } catch (e) {
    return serverError((e as Error).message);
  }
}
