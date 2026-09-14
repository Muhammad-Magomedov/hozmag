import { Header } from "@/components/shop/Header";
import { Footer } from "@/components/shop/Footer";
import { getCategories } from "@/lib/categories";

// Витрина зависит от БД, строки поиска и сессии — рендерим динамически.
export const dynamic = "force-dynamic";

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Не роняем весь магазин, если БД ещё не настроена — шапка отрисуется без категорий.
  const categories = await getCategories().catch(() => []);
  return (
    <>
      <Header categories={categories} />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
        {children}
      </main>
      <Footer categories={categories} />
    </>
  );
}
