"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { CategoryDTO } from "@/types";
import { DeleteButton } from "./DeleteButton";

type CatWithCount = CategoryDTO & { count: number };

export function CategoriesManager({
  categories,
}: {
  categories: CatWithCount[];
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<CatWithCount | null>(null);

  async function add(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return toast.error("Введите название");
    setAdding(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка");
      toast.success("Категория создана");
      setName("");
      setDescription("");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Ошибка");
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <Card className="h-fit">
        <CardHeader>
          <CardTitle>Новая категория</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={add} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="cat-name">Название</Label>
              <Input
                id="cat-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Трубы"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cat-desc">Описание</Label>
              <Textarea
                id="cat-desc"
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={adding} className="w-full">
              <Plus className="size-4" />
              Добавить
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-2">
        {categories.length === 0 && (
          <div className="rounded-xl border border-dashed py-16 text-center text-muted-foreground">
            Категорий пока нет.
          </div>
        )}
        {categories.map((c) => (
          <div
            key={c._id}
            className="flex items-center gap-3 rounded-xl border bg-card p-3"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium">{c.name}</span>
                <Badge variant="secondary">{c.count} тов.</Badge>
              </div>
              {c.description && (
                <p className="line-clamp-1 text-sm text-muted-foreground">
                  {c.description}
                </p>
              )}
              <p className="text-xs text-muted-foreground">/{c.slug}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={() => setEditing(c)}
              aria-label="Редактировать"
            >
              <Pencil className="size-4" />
            </Button>
            {c.count === 0 ? (
              <DeleteButton
                url={`/api/categories/${c._id}`}
                title="Удалить категорию?"
                description={`«${c.name}» будет удалена.`}
              />
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="size-8 text-muted-foreground/40"
                disabled
                title="Сначала перенесите товары"
                aria-label="Удаление недоступно"
              >
                <Trash2 className="size-4" />
              </Button>
            )}
          </div>
        ))}
      </div>

      <EditCategoryDialog
        category={editing}
        onClose={() => setEditing(null)}
        onSaved={() => {
          setEditing(null);
          router.refresh();
        }}
      />
    </div>
  );
}

function EditCategoryDialog({
  category,
  onClose,
  onSaved,
}: {
  category: CatWithCount | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (category) {
      setName(category.name);
      setDescription(category.description ?? "");
    }
  }, [category]);

  async function save() {
    if (!category) return;
    if (!name.trim()) return toast.error("Введите название");
    setSaving(true);
    try {
      const res = await fetch(`/api/categories/${category._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка");
      toast.success("Сохранено");
      onSaved();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Ошибка");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={!!category} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Редактировать категорию</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="edit-cat-name">Название</Label>
            <Input
              id="edit-cat-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="edit-cat-desc">Описание</Label>
            <Textarea
              id="edit-cat-desc"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button onClick={save} disabled={saving}>
            {saving ? "Сохранение…" : "Сохранить"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
