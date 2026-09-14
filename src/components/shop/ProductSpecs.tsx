import type { Spec } from "@/types";

export function ProductSpecs({ specs }: { specs: Spec[] }) {
  if (!specs.length) return null;
  return (
    <div className="overflow-hidden rounded-lg border">
      <table className="w-full text-sm">
        <tbody>
          {specs.map((s, i) => (
            <tr key={i} className="border-b last:border-0 even:bg-muted/40">
              <td className="w-1/2 px-4 py-2.5 text-muted-foreground">
                {s.name}
              </td>
              <td className="px-4 py-2.5 font-medium">
                {s.value}
                {s.unit ? ` ${s.unit}` : ""}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
