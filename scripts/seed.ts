import { config } from "dotenv";
config({ path: ".env.local" });

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Category from "../src/models/Category";
import Product from "../src/models/Product";
import User from "../src/models/User";
import { slugify } from "../src/lib/slug";

const MONGODB_URI = process.env.MONGODB_URI;

interface SpecInput {
  name: string;
  value: string;
  unit?: string;
}
const s = (name: string, value: string, unit = ""): SpecInput => ({
  name,
  value,
  unit,
});

async function main() {
  if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI не задан. Заполни .env.local (см. .env.example).");
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI);
  console.log("✔ Подключено к MongoDB");

  // ── Категории (slug должен совпадать с ключами spec-templates) ──
  const categoriesData = [
    { name: "Трубы", slug: "truby", description: "Полипропиленовые, металлопластиковые и стальные трубы" },
    { name: "Котлы", slug: "kotly", description: "Газовые, электрические и твердотопливные котлы" },
    { name: "Горелки", slug: "gorelki", description: "Газовые, дизельные и комбинированные горелки" },
    { name: "Фитинги", slug: "fitingi", description: "Муфты, уголки, тройники и переходники" },
    { name: "Радиаторы", slug: "radiatory", description: "Биметаллические и алюминиевые радиаторы отопления" },
    { name: "Насосы", slug: "nasosy", description: "Циркуляционные и повысительные насосы" },
  ];

  await Product.deleteMany({});
  await Category.deleteMany({});
  const cats = await Category.insertMany(categoriesData);
  const bySlug = Object.fromEntries(cats.map((c) => [c.slug, c._id]));
  console.log(`✔ Категории: ${cats.length}`);

  const p = (opts: {
    name: string;
    cat: string;
    brand: string;
    price: number;
    oldPrice?: number | null;
    stock: number;
    specs: SpecInput[];
    sku?: string;
    featured?: boolean;
    description?: string;
  }) => ({
    name: opts.name,
    slug: slugify(opts.name),
    description: opts.description ?? "",
    category: bySlug[opts.cat],
    brand: opts.brand,
    sku: opts.sku ?? "",
    price: opts.price,
    oldPrice: opts.oldPrice ?? null,
    stock: opts.stock,
    images: [`/products/${opts.cat}.jpg`],
    specs: opts.specs,
    featured: opts.featured ?? false,
    isActive: true,
  });

  const products = [
    // ── Трубы ──
    p({
      name: "Труба полипропиленовая PN25 32 мм армированная",
      cat: "truby", brand: "Valtec", price: 145, oldPrice: 180, stock: 500, featured: true, sku: "PPR-32-25",
      description: "Армированная стекловолокном труба для систем отопления и горячего водоснабжения.",
      specs: [s("Диаметр", "32", "мм"), s("Толщина стенки", "5.4", "мм"), s("Материал", "PP-R"), s("Длина", "4", "м"), s("Рабочее давление", "25", "бар"), s("Макс. температура", "95", "°C")],
    }),
    p({
      name: "Труба полипропиленовая PN20 20 мм",
      cat: "truby", brand: "Valtec", price: 78, stock: 800, sku: "PPR-20-20",
      description: "Труба для холодного и горячего водоснабжения.",
      specs: [s("Диаметр", "20", "мм"), s("Толщина стенки", "3.4", "мм"), s("Материал", "PP-R"), s("Длина", "4", "м"), s("Рабочее давление", "20", "бар"), s("Макс. температура", "70", "°C")],
    }),
    p({
      name: "Труба полипропиленовая PN25 63 мм армированная",
      cat: "truby", brand: "FV-Plast", price: 520, oldPrice: 610, stock: 120, sku: "PPR-63-25",
      specs: [s("Диаметр", "63", "мм"), s("Толщина стенки", "10.5", "мм"), s("Материал", "PP-R"), s("Длина", "4", "м"), s("Рабочее давление", "25", "бар"), s("Макс. температура", "95", "°C")],
    }),
    p({
      name: "Труба гофрированная нержавеющая 20 мм",
      cat: "truby", brand: "Neptun", price: 210, stock: 300, sku: "INOX-20",
      specs: [s("Диаметр", "20", "мм"), s("Материал", "нерж. сталь AISI 304"), s("Рабочее давление", "15", "бар"), s("Макс. температура", "120", "°C")],
    }),

    // ── Котлы ──
    p({
      name: "Котёл газовый настенный двухконтурный 24 кВт",
      cat: "kotly", brand: "BAXI", price: 42000, oldPrice: 48000, stock: 15, featured: true, sku: "BAXI-24F",
      description: "Настенный газовый котёл с закрытой камерой сгорания для отопления и ГВС.",
      specs: [s("Мощность", "24", "кВт"), s("Тип топлива", "природный газ"), s("КПД", "93", "%"), s("Количество контуров", "2"), s("Макс. давление", "3", "бар"), s("Материал теплообменника", "медь")],
    }),
    p({
      name: "Котёл газовый одноконтурный 18 кВт",
      cat: "kotly", brand: "Protherm", price: 33000, stock: 10, sku: "PROT-18",
      specs: [s("Мощность", "18", "кВт"), s("Тип топлива", "природный газ"), s("КПД", "92", "%"), s("Количество контуров", "1"), s("Макс. давление", "3", "бар")],
    }),
    p({
      name: "Котёл твердотопливный длительного горения 25 кВт",
      cat: "kotly", brand: "Stropuva", price: 78000, stock: 5, featured: true, sku: "STR-25",
      description: "Котёл длительного горения на дровах и угле, до 30 часов на одной загрузке.",
      specs: [s("Мощность", "25", "кВт"), s("Тип топлива", "дрова, уголь"), s("КПД", "85", "%"), s("Материал теплообменника", "сталь 6 мм")],
    }),
    p({
      name: "Котёл электрический 9 кВт",
      cat: "kotly", brand: "ЭВАН", price: 21000, oldPrice: 24500, stock: 20, sku: "EVAN-9",
      specs: [s("Мощность", "9", "кВт"), s("Тип топлива", "электричество"), s("КПД", "99", "%"), s("Напряжение", "380", "В")],
    }),

    // ── Горелки ──
    p({
      name: "Горелка газовая двухступенчатая 30 кВт",
      cat: "gorelki", brand: "Riello", price: 28000, stock: 8, featured: true, sku: "RIE-G30",
      specs: [s("Мощность", "30", "кВт"), s("Тип топлива", "природный газ"), s("Регулирование", "двухступенчатое"), s("Напряжение", "220", "В")],
    }),
    p({
      name: "Горелка дизельная 40 кВт",
      cat: "gorelki", brand: "Weishaupt", price: 45000, oldPrice: 52000, stock: 6, sku: "WEI-D40",
      specs: [s("Мощность", "40", "кВт"), s("Тип топлива", "дизель"), s("Расход топлива", "3.4", "кг/ч"), s("Напряжение", "220", "В")],
    }),
    p({
      name: "Горелка комбинированная газ/дизель 50 кВт",
      cat: "gorelki", brand: "Baltur", price: 61000, stock: 3, sku: "BAL-C50",
      specs: [s("Мощность", "50", "кВт"), s("Тип топлива", "газ / дизель"), s("Регулирование", "модулируемое"), s("Напряжение", "380", "В")],
    }),

    // ── Фитинги ──
    p({
      name: "Муфта комбинированная ПП 32×1\" наружная резьба",
      cat: "fitingi", brand: "Valtec", price: 95, stock: 1000, sku: "F-M32-1",
      specs: [s("Диаметр", "32", "мм"), s("Тип соединения", "резьбовое / пайка"), s("Материал", "PP-R / латунь"), s("Резьба", "1\"")],
    }),
    p({
      name: "Уголок ПП 25 мм 90°",
      cat: "fitingi", brand: "Valtec", price: 22, stock: 2000, sku: "F-U25",
      specs: [s("Диаметр", "25", "мм"), s("Тип соединения", "пайка"), s("Материал", "PP-R"), s("Угол", "90", "°")],
    }),
    p({
      name: "Тройник ПП 32 мм",
      cat: "fitingi", brand: "FV-Plast", price: 41, oldPrice: 55, stock: 900, sku: "F-T32",
      specs: [s("Диаметр", "32", "мм"), s("Тип соединения", "пайка"), s("Материал", "PP-R")],
    }),

    // ── Радиаторы ──
    p({
      name: "Радиатор биметаллический 500/80, 10 секций",
      cat: "radiatory", brand: "Rifar", price: 5400, oldPrice: 6200, stock: 60, featured: true, sku: "RIF-500-10",
      description: "Биметаллический радиатор с высокой теплоотдачей для любых систем отопления.",
      specs: [s("Тепловая мощность", "1900", "Вт"), s("Материал", "биметалл"), s("Межосевое расстояние", "500", "мм"), s("Количество секций", "10"), s("Макс. давление", "20", "бар")],
    }),
    p({
      name: "Радиатор алюминиевый 500, 8 секций",
      cat: "radiatory", brand: "Global", price: 3900, stock: 80, sku: "GLB-500-8",
      specs: [s("Тепловая мощность", "1360", "Вт"), s("Материал", "алюминий"), s("Межосевое расстояние", "500", "мм"), s("Количество секций", "8"), s("Макс. давление", "16", "бар")],
    }),

    // ── Насосы ──
    p({
      name: "Насос циркуляционный 25/60, 180 мм",
      cat: "nasosy", brand: "Grundfos", price: 8700, oldPrice: 9900, stock: 40, featured: true, sku: "GRF-2560",
      description: "Циркуляционный насос для систем отопления с тремя скоростями.",
      specs: [s("Мощность", "93", "Вт"), s("Напор", "6", "м"), s("Производительность", "50", "л/мин"), s("Напряжение", "220", "В"), s("Диаметр подключения", "25", "мм")],
    }),
    p({
      name: "Насос циркуляционный 32/80",
      cat: "nasosy", brand: "Wilo", price: 11200, stock: 25, sku: "WIL-3280",
      specs: [s("Мощность", "130", "Вт"), s("Напор", "8", "м"), s("Производительность", "70", "л/мин"), s("Напряжение", "220", "В"), s("Диаметр подключения", "32", "мм")],
    }),
  ];

  await Product.insertMany(products);
  console.log(`✔ Товары: ${products.length}`);

  // ── Пользователи (upsert, чтобы не затирать реальные аккаунты) ──
  const users = [
    { name: "Супер-админ", email: "admin@teplosnab.ru", password: "admin123", role: "superadmin", permissions: [] as string[] },
    { name: "Менеджер каталога", email: "manager@teplosnab.ru", password: "manager123", role: "admin", permissions: ["products:manage", "categories:manage"] },
    { name: "Иван Покупатель", email: "client@teplosnab.ru", password: "client123", role: "customer", permissions: [] as string[] },
  ];
  for (const u of users) {
    const hash = await bcrypt.hash(u.password, 10);
    await User.updateOne(
      { email: u.email },
      { $set: { name: u.name, password: hash, role: u.role, permissions: u.permissions } },
      { upsert: true },
    );
  }
  console.log(`✔ Пользователи: ${users.length}`);

  console.log("\n── Тестовые аккаунты ─────────────────────────────");
  console.log("  Супер-админ:  admin@teplosnab.ru   / admin123");
  console.log("  Админ:        manager@teplosnab.ru / manager123");
  console.log("  Покупатель:   client@teplosnab.ru  / client123");
  console.log("──────────────────────────────────────────────────\n");

  await mongoose.disconnect();
  console.log("✔ Готово");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
