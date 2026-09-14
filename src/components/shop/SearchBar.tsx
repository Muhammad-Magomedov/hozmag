"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { Input } from "@/components/ui/input";

export function SearchBar({ className }: { className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [q, setQ] = useState(sp.get("q") ?? "");

  useEffect(() => {
    setQ(sp.get("q") ?? "");
  }, [sp]);

  function submit(e: FormEvent) {
    e.preventDefault();
    const base = pathname === "/sale" ? "/sale" : "/";
    const params = new URLSearchParams(
      base === pathname ? Array.from(sp.entries()) : [],
    );
    const value = q.trim();
    if (value) params.set("q", value);
    else params.delete("q");
    params.delete("page");
    const qs = params.toString();
    router.push(qs ? `${base}?${qs}` : base);
  }

  return (
    <form onSubmit={submit} className={className} role="search">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Поиск: трубы, котлы, горелки…"
          className="pl-9"
          type="search"
        />
      </div>
    </form>
  );
}
