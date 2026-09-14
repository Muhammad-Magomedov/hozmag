// Общие типы приложения (используются и на клиенте, и на сервере).

export type Role = "superadmin" | "admin" | "customer";

export type Permission =
  | "products:manage"
  | "categories:manage"
  | "users:manage"
  | "orders:manage";

export const ALL_PERMISSIONS: Permission[] = [
  "products:manage",
  "categories:manage",
  "users:manage",
  "orders:manage",
];

export const PERMISSION_LABELS: Record<Permission, string> = {
  "products:manage": "Управление товарами",
  "categories:manage": "Управление категориями",
  "users:manage": "Управление пользователями",
  "orders:manage": "Управление заказами",
};

export const ROLE_LABELS: Record<Role, string> = {
  superadmin: "Супер-админ",
  admin: "Администратор",
  customer: "Покупатель",
};

/** Характеристика товара: «Диаметр» = «32» «мм». */
export interface Spec {
  name: string;
  value: string;
  unit?: string;
}

export interface CategoryDTO {
  _id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface ProductDTO {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: CategoryDTO | null;
  brand: string;
  sku: string;
  price: number;
  oldPrice: number | null;
  discountPercent: number;
  stock: number;
  images: string[];
  specs: Spec[];
  featured: boolean;
  isActive: boolean;
  rating: number;
  createdAt: string;
}

export interface UserDTO {
  _id: string;
  name: string;
  email: string;
  role: Role;
  permissions: Permission[];
  phone?: string;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  qty: number;
  stock: number;
}

export type SortKey =
  | "new"
  | "price-asc"
  | "price-desc"
  | "name-asc"
  | "discount";

export const SORT_LABELS: Record<SortKey, string> = {
  new: "Сначала новые",
  "price-asc": "Сначала дешёвые",
  "price-desc": "Сначала дорогие",
  "name-asc": "По названию (А-Я)",
  discount: "По размеру скидки",
};
