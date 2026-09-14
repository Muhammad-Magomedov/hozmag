import { isValidObjectId } from "mongoose";
import { dbConnect } from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import User from "@/models/User";
import Order from "@/models/Order";
import { serializeProduct, serializeUser } from "@/lib/serialize";
import type { ProductDTO, Role, UserDTO } from "@/types";

export async function getAdminProducts(): Promise<ProductDTO[]> {
  await dbConnect();
  const docs = await Product.find()
    .populate("category")
    .sort({ createdAt: -1 })
    .lean();
  return docs.map(serializeProduct);
}

export async function getAdminProductById(
  id: string,
): Promise<ProductDTO | null> {
  if (!isValidObjectId(id)) return null;
  await dbConnect();
  const doc = await Product.findById(id).populate("category").lean();
  return doc ? serializeProduct(doc) : null;
}

export async function getAdminUsers(actorRole: Role): Promise<UserDTO[]> {
  await dbConnect();
  // Обычный админ видит только покупателей.
  const query: Record<string, unknown> =
    actorRole === "superadmin" ? {} : { role: "customer" };
  const docs = await User.find(query).sort({ createdAt: -1 }).lean();
  return docs.map(serializeUser);
}

export async function getAdminUserById(id: string): Promise<UserDTO | null> {
  if (!isValidObjectId(id)) return null;
  await dbConnect();
  const doc = await User.findById(id).lean();
  return doc ? serializeUser(doc) : null;
}

export interface AdminStats {
  products: number;
  active: number;
  outOfStock: number;
  discounted: number;
  categories: number;
  customers: number;
  admins: number;
  newOrders: number;
}

export async function getAdminStats(): Promise<AdminStats> {
  await dbConnect();
  const [
    products,
    active,
    outOfStock,
    discounted,
    categories,
    customers,
    admins,
    newOrders,
  ] = await Promise.all([
    Product.countDocuments({}),
    Product.countDocuments({ isActive: true }),
    Product.countDocuments({ stock: { $lte: 0 } }),
    Product.countDocuments({
      oldPrice: { $gt: 0 },
      $expr: { $gt: ["$oldPrice", "$price"] },
    }),
    Category.countDocuments({}),
    User.countDocuments({ role: "customer" }),
    User.countDocuments({ role: { $in: ["admin", "superadmin"] } }),
    Order.countDocuments({ status: "new" }),
  ]);
  return {
    products,
    active,
    outOfStock,
    discounted,
    categories,
    customers,
    admins,
    newOrders,
  };
}
