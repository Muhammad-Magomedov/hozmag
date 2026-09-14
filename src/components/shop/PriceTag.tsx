import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/format";

const SIZES = {
  sm: "text-base",
  md: "text-xl",
  lg: "text-3xl",
} as const;

export function PriceTag({
  price,
  oldPrice,
  size = "md",
  className,
}: {
  price: number;
  oldPrice?: number | null;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  const hasDiscount = !!oldPrice && oldPrice > price;
  return (
    <div className={cn("flex flex-wrap items-baseline gap-2", className)}>
      <span
        className={cn(
          "font-bold tracking-tight",
          SIZES[size],
          hasDiscount && "text-red-600 dark:text-red-500",
        )}
      >
        {formatPrice(price)}
      </span>
      {hasDiscount && (
        <span className="text-sm text-muted-foreground line-through">
          {formatPrice(oldPrice)}
        </span>
      )}
    </div>
  );
}
