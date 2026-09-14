import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/site";

/**
 * Фирменный знак ТеплоСнаба — пламя в тёплом огненном градиенте.
 * Размер задаётся через className (например `size-9`).
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative grid shrink-0 place-items-center overflow-hidden rounded-xl",
        "bg-gradient-to-br from-amber-400 via-orange-500 to-orange-600",
        "text-white shadow-sm shadow-orange-500/30 ring-1 ring-orange-600/20",
        className,
      )}
    >
      {/* лёгкий блик сверху */}
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/25" />
      <Flame className="relative size-[58%]" strokeWidth={2.4} />
    </span>
  );
}

/**
 * Логотип: знак + текстовое начертание с акцентом на «Снаб».
 * showText=false — только знак (иконка).
 */
export function BrandLogo({
  className,
  markClassName,
  textClassName,
  showText = true,
}: {
  className?: string;
  markClassName?: string;
  textClassName?: string;
  showText?: boolean;
}) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <BrandMark className={cn("size-9", markClassName)} />
      {showText && (
        <span
          className={cn(
            "text-lg font-bold tracking-tight text-foreground",
            textClassName,
          )}
        >
          <BrandWordmark />
        </span>
      )}
    </span>
  );
}

/** «ТеплоСнаб» с акцентом фирменным цветом на второй половине. */
export function BrandWordmark() {
  const name = SITE.name;
  const split = name.match(/^(Тепло)(Снаб)$/);
  if (split) {
    return (
      <>
        {split[1]}
        <span className="text-primary">{split[2]}</span>
      </>
    );
  }
  return <>{name}</>;
}
