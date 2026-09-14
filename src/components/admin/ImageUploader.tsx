"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { Loader2, Upload, X } from "lucide-react";
import { Thumb } from "@/components/shop/Thumb";

export function ImageUploader({
  value,
  onChange,
}: {
  value: string[];
  onChange: (urls: string[]) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Ошибка загрузки");
        uploaded.push(data.url);
      }
      onChange([...value, ...uploaded]);
      toast.success(
        uploaded.length > 1 ? `Загружено: ${uploaded.length}` : "Фото загружено",
      );
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Ошибка загрузки");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {value.map((url, i) => (
          <div
            key={url}
            className="relative size-24 overflow-hidden rounded-lg border bg-muted"
          >
            <Thumb src={url} alt="" className="size-full object-cover" />
            {i === 0 && (
              <span className="absolute bottom-0 left-0 right-0 bg-primary/90 py-0.5 text-center text-[10px] font-medium text-primary-foreground">
                Главное
              </span>
            )}
            <button
              type="button"
              onClick={() => onChange(value.filter((u) => u !== url))}
              className="absolute right-1 top-1 grid size-6 place-items-center rounded-full bg-background/90 text-muted-foreground hover:text-destructive"
              aria-label="Удалить фото"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="grid size-24 place-items-center rounded-lg border border-dashed text-muted-foreground transition hover:bg-accent disabled:opacity-60"
        >
          {uploading ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <span className="flex flex-col items-center gap-1 text-xs">
              <Upload className="size-5" />
              Загрузить
            </span>
          )}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => handleFiles(e.target.files)}
      />
      <p className="text-xs text-muted-foreground">
        JPG, PNG, WEBP, SVG до 5 МБ. Первое фото — главное в каталоге.
      </p>
    </div>
  );
}
