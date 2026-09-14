import Link from "next/link";
import { BrandMark, BrandWordmark } from "@/components/shop/BrandLogo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-1 flex-col items-center justify-center gap-6 bg-muted/30 px-4 py-10">
      <Link href="/" className="flex items-center gap-2">
        <BrandMark className="size-10" />
        <span className="text-xl font-bold">
          <BrandWordmark />
        </span>
      </Link>
      <div className="w-full max-w-sm rounded-2xl border bg-card p-6 shadow-sm">
        {children}
      </div>
      <Link
        href="/"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← Вернуться в магазин
      </Link>
    </div>
  );
}
