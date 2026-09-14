"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Thumb } from "@/components/shop/Thumb";
import { formatPrice } from "@/lib/format";
import type { ProductDTO } from "@/types";
import { DeleteButton } from "./DeleteButton";

export function ProductsTable({ products }: { products: ProductDTO[] }) {
  if (!products.length) {
    return (
      <div className="rounded-xl border border-dashed py-16 text-center text-muted-foreground">
        Товаров пока нет. Нажмите «Добавить».
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Товар</TableHead>
            <TableHead className="hidden md:table-cell">Категория</TableHead>
            <TableHead>Цена</TableHead>
            <TableHead className="hidden sm:table-cell">Остаток</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead className="text-right">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((p) => (
            <TableRow key={p._id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="size-11 shrink-0 overflow-hidden rounded-md border bg-muted">
                    <Thumb
                      src={p.images[0]}
                      alt={p.name}
                      className="size-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <Link
                      href={`/product/${p.slug}`}
                      className="line-clamp-1 font-medium hover:underline"
                    >
                      {p.name}
                    </Link>
                    <div className="text-xs text-muted-foreground">
                      {p.brand || p.sku || "—"}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                {p.category?.name ?? "—"}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                <div className="font-medium">{formatPrice(p.price)}</div>
                {p.discountPercent > 0 && (
                  <div className="text-xs text-red-600">
                    −{p.discountPercent}%
                  </div>
                )}
              </TableCell>
              <TableCell className="hidden tabular-nums sm:table-cell">
                {p.stock}
              </TableCell>
              <TableCell>
                <div className="flex flex-col items-start gap-1">
                  {p.isActive ? (
                    <Badge variant="secondary">Активен</Badge>
                  ) : (
                    <Badge variant="outline">Скрыт</Badge>
                  )}
                  {p.featured && <Badge>Хит</Badge>}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    render={
                      <Link
                        href={`/admin/products/${p._id}/edit`}
                        aria-label="Редактировать"
                      />
                    }
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <DeleteButton
                    url={`/api/products/${p._id}`}
                    title="Удалить товар?"
                    description={`«${p.name}» будет удалён безвозвратно.`}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
