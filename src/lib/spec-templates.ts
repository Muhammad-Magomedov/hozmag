// Подсказки характеристик по категориям — для быстрого заполнения формы товара.
// Ключ — slug категории (см. seed).

export interface SpecSuggestion {
  name: string;
  unit?: string;
}

export const SPEC_TEMPLATES: Record<string, SpecSuggestion[]> = {
  truby: [
    { name: "Диаметр", unit: "мм" },
    { name: "Толщина стенки", unit: "мм" },
    { name: "Материал" },
    { name: "Длина", unit: "м" },
    { name: "Рабочее давление", unit: "бар" },
    { name: "Макс. температура", unit: "°C" },
  ],
  kotly: [
    { name: "Мощность", unit: "кВт" },
    { name: "Тип топлива" },
    { name: "КПД", unit: "%" },
    { name: "Количество контуров" },
    { name: "Макс. давление", unit: "бар" },
    { name: "Материал теплообменника" },
  ],
  gorelki: [
    { name: "Мощность", unit: "кВт" },
    { name: "Тип топлива" },
    { name: "Регулирование" },
    { name: "Расход топлива", unit: "кг/ч" },
    { name: "Напряжение", unit: "В" },
  ],
  fitingi: [
    { name: "Диаметр", unit: "мм" },
    { name: "Тип соединения" },
    { name: "Материал" },
    { name: "Угол", unit: "°" },
  ],
  radiatory: [
    { name: "Тепловая мощность", unit: "Вт" },
    { name: "Материал" },
    { name: "Межосевое расстояние", unit: "мм" },
    { name: "Количество секций" },
    { name: "Макс. давление", unit: "бар" },
  ],
  nasosy: [
    { name: "Мощность", unit: "Вт" },
    { name: "Напор", unit: "м" },
    { name: "Производительность", unit: "л/мин" },
    { name: "Напряжение", unit: "В" },
    { name: "Диаметр подключения", unit: "мм" },
  ],
};

export const DEFAULT_SPECS: SpecSuggestion[] = [
  { name: "Материал" },
  { name: "Вес", unit: "кг" },
  { name: "Габариты", unit: "мм" },
  { name: "Страна производства" },
];

export function specSuggestions(categorySlug?: string): SpecSuggestion[] {
  if (categorySlug && SPEC_TEMPLATES[categorySlug]) {
    return SPEC_TEMPLATES[categorySlug];
  }
  return DEFAULT_SPECS;
}
