import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Источники изображений",
  description: "Авторы и лицензии фотографий товаров.",
};

interface Credit {
  category: string;
  author: string;
  license: string;
  licenseUrl: string;
  source: string;
}

// Фото категорий взяты с Wikimedia Commons и масштабированы.
const IMAGE_CREDITS: Credit[] = [
  {
    category: "Трубы",
    author: "Dwight Burdette",
    license: "CC BY 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by/3.0/",
    source:
      "https://commons.wikimedia.org/wiki/File:Dura-Blue_PVC_Pipe_for_Underground_Water_Mains.JPG",
  },
  {
    category: "Котлы",
    author: "Chixoy",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
    source:
      "https://commons.wikimedia.org/wiki/File:Calderacondensaci%C3%B3.JPG",
  },
  {
    category: "Горелки",
    author: "K. Krallis (SV1XV)",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
    source: "https://commons.wikimedia.org/wiki/File:Light_fuel_oil_burner.JPG",
  },
  {
    category: "Фитинги",
    author: "Emilian Robert Vicol",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
    source:
      "https://commons.wikimedia.org/wiki/File:Polypropylene-PPR-Pipe-Tee_173369-480x360_(5000534776).jpg",
  },
  {
    category: "Радиаторы",
    author: "Tiia Monto",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
    source: "https://commons.wikimedia.org/wiki/File:Heat_radiator.jpg",
  },
  {
    category: "Насосы",
    author: "The RedBurn",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    source:
      "https://commons.wikimedia.org/wiki/File:Circulationspumpe_Grundfos_2017-10.jpg",
  },
];

export default function CreditsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 py-4">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">
          Источники изображений
        </h1>
        <p className="text-sm text-muted-foreground">
          Фотографии категорий товаров взяты с{" "}
          <a
            href="https://commons.wikimedia.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Wikimedia Commons
          </a>{" "}
          под лицензиями Creative Commons и масштабированы. Ниже — авторы и
          лицензии (требование условий лицензий).
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/40 text-left">
              <th className="px-4 py-2.5 font-medium">Категория</th>
              <th className="px-4 py-2.5 font-medium">Автор</th>
              <th className="px-4 py-2.5 font-medium">Лицензия</th>
              <th className="px-4 py-2.5 font-medium">Источник</th>
            </tr>
          </thead>
          <tbody>
            {IMAGE_CREDITS.map((c) => (
              <tr key={c.category} className="border-b last:border-0">
                <td className="px-4 py-2.5 font-medium">{c.category}</td>
                <td className="px-4 py-2.5 text-muted-foreground">
                  {c.author}
                </td>
                <td className="px-4 py-2.5">
                  <a
                    href={c.licenseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {c.license}
                  </a>
                </td>
                <td className="px-4 py-2.5">
                  <a
                    href={c.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    файл
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted-foreground">
        Изображения носят иллюстративный характер и могут отличаться от
        конкретной модели товара.
      </p>
    </div>
  );
}
