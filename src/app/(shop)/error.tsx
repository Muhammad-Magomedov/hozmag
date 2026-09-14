"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ShopError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 py-20 text-center">
      <AlertTriangle className="size-10 text-amber-500" />
      <h1 className="text-2xl font-bold">Не удалось загрузить данные</h1>
      <p className="text-muted-foreground">
        Убедитесь, что в <code className="rounded bg-muted px-1">.env.local</code>{" "}
        указан <code className="rounded bg-muted px-1">MONGODB_URI</code> и база
        заполнена командой <code className="rounded bg-muted px-1">npm run seed</code>.
      </p>
      <p className="max-w-full break-words text-xs text-muted-foreground">
        {error.message}
      </p>
      <Button onClick={reset}>Повторить</Button>
    </div>
  );
}
