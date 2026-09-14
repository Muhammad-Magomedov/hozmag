const TRANSLIT: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh",
  з: "z", и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o",
  п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "c",
  ч: "ch", ш: "sh", щ: "sch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu",
  я: "ya",
};

function translit(input: string): string {
  return input
    .split("")
    .map((ch) => {
      const lower = ch.toLowerCase();
      const mapped = TRANSLIT[lower];
      if (mapped === undefined) return ch;
      return ch === lower ? mapped : mapped.toUpperCase();
    })
    .join("");
}

export function slugify(input: string): string {
  const base = translit(input)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return base || "item";
}

/** Подбирает уникальный слаг, добавляя -2, -3 … пока `exists` не вернёт false. */
export async function uniqueSlug(
  source: string,
  exists: (slug: string) => Promise<boolean>,
): Promise<string> {
  const root = slugify(source);
  let candidate = root;
  let i = 2;
  while (await exists(candidate)) {
    candidate = `${root}-${i}`;
    i += 1;
    if (i > 100) {
      candidate = `${root}-${Date.now().toString(36)}`;
      break;
    }
  }
  return candidate;
}
