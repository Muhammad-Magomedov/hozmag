import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Некорректный email"),
  password: z.string().min(1, "Введите пароль"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Минимум 2 символа"),
  email: z.string().email("Некорректный email"),
  password: z.string().min(6, "Минимум 6 символов"),
  phone: z.string().optional(),
});

export const specSchema = z.object({
  name: z.string().min(1, "Название характеристики"),
  value: z.string().min(1, "Значение"),
  unit: z.string().optional().default(""),
});

export const productSchema = z.object({
  name: z.string().min(2, "Введите название"),
  description: z.string().optional().default(""),
  category: z.string().min(1, "Выберите категорию"),
  brand: z.string().optional().default(""),
  sku: z.string().optional().default(""),
  price: z.coerce.number().min(0, "Цена не может быть отрицательной"),
  oldPrice: z.coerce.number().min(0).nullable().optional(),
  stock: z.coerce.number().int().min(0).default(0),
  images: z.array(z.string()).default([]),
  specs: z.array(specSchema).default([]),
  featured: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

export const categorySchema = z.object({
  name: z.string().min(2, "Введите название категории"),
  description: z.string().optional().default(""),
});

const permissionEnum = z.enum([
  "products:manage",
  "categories:manage",
  "users:manage",
  "orders:manage",
]);

const roleEnum = z.enum(["superadmin", "admin", "customer"]);

export const userCreateSchema = z.object({
  name: z.string().min(2, "Введите имя"),
  email: z.string().email("Некорректный email"),
  password: z.string().min(6, "Минимум 6 символов"),
  role: roleEnum,
  permissions: z.array(permissionEnum).default([]),
  phone: z.string().optional().default(""),
});

export const userUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  // Пустая строка = «не менять пароль».
  password: z.union([z.string().min(6), z.literal("")]).optional(),
  role: roleEnum.optional(),
  permissions: z.array(permissionEnum).optional(),
  phone: z.string().optional(),
});

export const orderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        qty: z.coerce.number().int().min(1),
      }),
    )
    .min(1, "Корзина пуста"),
  customer: z.object({
    name: z.string().min(2, "Введите имя"),
    phone: z.string().min(5, "Введите телефон"),
    address: z.string().optional().default(""),
    comment: z.string().optional().default(""),
  }),
});

export type ProductInput = z.infer<typeof productSchema>;
export type UserCreateInput = z.infer<typeof userCreateSchema>;
export type OrderInput = z.infer<typeof orderSchema>;
