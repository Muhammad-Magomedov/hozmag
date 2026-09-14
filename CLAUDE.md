# CLAUDE.md — ТеплоСнаб (интернет-магазин)

Интернет-магазин промышленного/инженерного оборудования (трубы, котлы, горелки,
фитинги, радиаторы, насосы). Витрина + корзина + админ-панель с ролями.

## Стек
Next.js 16 (App Router) · React 19 · TypeScript · MongoDB/Mongoose ·
NextAuth v5 (Auth.js) · shadcn/ui (**Base UI**, не Radix!) · Tailwind v4 ·
Zustand (корзина) · react-hook-form + zod · bcryptjs.

## ⚠️ Важно про UI-компоненты
shadcn стоит в стиле **base-nova** — это компоненты на **Base UI** (`@base-ui/react`),
а НЕ Radix. У них **нет `asChild`**. Композиция — через проп **`render`**:
```tsx
// Ссылка-кнопка:
<Button render={<Link href="/x" />}>Текст</Button>
// Триггеры/пункты меню так же:
<SheetTrigger render={<Button variant="outline" />}>…</SheetTrigger>
<DropdownMenuItem render={<Link href="/x" />}>…</DropdownMenuItem>
```
Base UI `Select` отдаёт в `onValueChange` значение `string | null` — коэрсить.

## Роли и права
- `superadmin` — всё, в т.ч. создание/редактирование админов и назначение им прав.
- `admin` — набор прав (`products:manage`, `categories:manage`, `users:manage`,
  `orders:manage`); управляет только покупателями, не сотрудниками.
- `customer` — покупатель.
Логика в `src/lib/permissions.ts` (`canActOnRole`, `canManage*`). API-роуты и
серверные страницы админки дублируют проверки (defense in depth).

## Структура
- `src/app/(shop)` — витрина (force-dynamic), `(auth)` — вход/регистрация,
  `admin` — панель (гейт по роли в layout + на каждой странице), `api` — REST.
- `src/lib` — `db` (кэш-коннект mongoose), `auth-helpers`, `products`/`categories`/
  `admin` (серверные выборки), `serialize` (doc→DTO), `validation` (zod), `slug`
  (транслит), `permissions`, `spec-templates` (подсказки характеристик по категориям).
- `src/models` — User, Category, Product (specs — массив {name,value,unit}), Order.
- `src/store/cart.ts` — zustand + persist(localStorage).
- `auth.config.ts` (edge-safe, для `proxy.ts`) + `auth.ts` (Credentials + mongoose).

## Команды
- `npm run dev` / `npm run build` / `npm start`
- `npm run seed` — 6 категорий, ~18 товаров, 3 аккаунта (см. README)
- `npm run typecheck`

## Аккаунты после сида
`admin@teplosnab.ru/admin123` (супер), `manager@teplosnab.ru/manager123` (админ),
`client@teplosnab.ru/client123` (покупатель).

## Заметки
- Фото товаров грузятся в `public/uploads` (в git не идут). Для serverless-хостинга
  нужен S3/Cloudinary.
- Защита /admin — `src/proxy.ts` (бывш. middleware, переименован под Next 16).
- Название/контакты магазина — `src/lib/site.ts`.
