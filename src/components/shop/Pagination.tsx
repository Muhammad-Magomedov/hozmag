"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

function pageList(current: number, total: number): (number | "gap")[] {
  const set = new Set<number>([1, total]);
  for (let p = current - 1; p <= current + 1; p++) {
    if (p >= 1 && p <= total) set.add(p);
  }
  const sorted = Array.from(set).sort((a, b) => a - b);
  const out: (number | "gap")[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (p - prev > 1) out.push("gap");
    out.push(p);
    prev = p;
  }
  return out;
}

export function Pagination({
  page,
  totalPages,
}: {
  page: number;
  totalPages: number;
}) {
  const pathname = usePathname();
  const sp = useSearchParams();
  if (totalPages <= 1) return null;

  const href = (p: number) => {
    const params = new URLSearchParams(Array.from(sp.entries()));
    if (p <= 1) params.delete("page");
    else params.set("page", String(p));
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };

  return (
    <div className="flex items-center justify-center gap-1 pt-4">
      {page > 1 ? (
        <Button
          variant="outline"
          size="icon"
          render={
            <Link href={href(page - 1)} aria-label="Предыдущая страница" />
          }
        >
          <ChevronLeft className="size-4" />
        </Button>
      ) : (
        <Button variant="outline" size="icon" disabled aria-label="Предыдущая страница">
          <ChevronLeft className="size-4" />
        </Button>
      )}

      {pageList(page, totalPages).map((p, i) =>
        p === "gap" ? (
          <span key={`gap-${i}`} className="px-2 text-muted-foreground">
            …
          </span>
        ) : (
          <Button
            key={p}
            variant={p === page ? "default" : "outline"}
            size="icon"
            render={<Link href={href(p)} />}
          >
            {p}
          </Button>
        ),
      )}

      {page < totalPages ? (
        <Button
          variant="outline"
          size="icon"
          render={
            <Link href={href(page + 1)} aria-label="Следующая страница" />
          }
        >
          <ChevronRight className="size-4" />
        </Button>
      ) : (
        <Button variant="outline" size="icon" disabled aria-label="Следующая страница">
          <ChevronRight className="size-4" />
        </Button>
      )}
    </div>
  );
}
