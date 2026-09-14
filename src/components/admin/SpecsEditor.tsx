"use client";

import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Spec } from "@/types";
import { specSuggestions, type SpecSuggestion } from "@/lib/spec-templates";

export function SpecsEditor({
  value,
  onChange,
  categorySlug,
}: {
  value: Spec[];
  onChange: (specs: Spec[]) => void;
  categorySlug?: string;
}) {
  const suggestions = specSuggestions(categorySlug);
  const existing = new Set(value.map((s) => s.name.trim().toLowerCase()));

  function update(index: number, patch: Partial<Spec>) {
    onChange(value.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  }
  function add(preset?: SpecSuggestion) {
    onChange([
      ...value,
      { name: preset?.name ?? "", value: "", unit: preset?.unit ?? "" },
    ]);
  }
  function remove(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-3">
      {value.length > 0 && (
        <div className="space-y-2">
          <div className="hidden gap-2 px-1 text-xs text-muted-foreground sm:flex">
            <span className="flex-1">Характеристика</span>
            <span className="flex-1">Значение</span>
            <span className="w-20">Ед.</span>
            <span className="w-8" />
          </div>
          {value.map((s, i) => (
            <div key={i} className="flex gap-2">
              <Input
                placeholder="Напр. Диаметр"
                value={s.name}
                onChange={(e) => update(i, { name: e.target.value })}
                className="flex-1"
              />
              <Input
                placeholder="Напр. 32"
                value={s.value}
                onChange={(e) => update(i, { value: e.target.value })}
                className="flex-1"
              />
              <Input
                placeholder="мм"
                value={s.unit ?? ""}
                onChange={(e) => update(i, { unit: e.target.value })}
                className="w-20"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(i)}
                aria-label="Удалить характеристику"
              >
                <X className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => add()}>
          <Plus className="size-4" />
          Добавить
        </Button>
        {suggestions
          .filter((s) => !existing.has(s.name.toLowerCase()))
          .map((s) => (
            <button
              key={s.name}
              type="button"
              onClick={() => add(s)}
              className="rounded-full border border-dashed px-2.5 py-1 text-xs text-muted-foreground transition hover:bg-accent hover:text-foreground"
            >
              + {s.name}
              {s.unit ? ` (${s.unit})` : ""}
            </button>
          ))}
      </div>
    </div>
  );
}
