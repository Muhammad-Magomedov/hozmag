"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Thumb } from "./Thumb";

export function ProductGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const list = images.length ? images : [""];
  const [active, setActive] = useState(0);

  return (
    <div className="space-y-3">
      <div className="aspect-square overflow-hidden rounded-xl border bg-muted">
        <Thumb
          src={list[active]}
          alt={alt}
          className="size-full object-contain"
        />
      </div>
      {list.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {list.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "size-16 shrink-0 overflow-hidden rounded-lg border bg-muted transition",
                i === active
                  ? "ring-2 ring-primary ring-offset-1"
                  : "opacity-70 hover:opacity-100",
              )}
            >
              <Thumb
                src={img}
                alt={`${alt} — фото ${i + 1}`}
                className="size-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
