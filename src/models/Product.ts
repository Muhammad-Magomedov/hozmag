import mongoose, { Schema, type Model } from "mongoose";

// Характеристика: name="Диаметр", value="32", unit="мм".
const SpecSchema = new Schema(
  {
    name: { type: String, required: true },
    value: { type: String, required: true },
    unit: { type: String, default: "" },
  },
  { _id: false },
);

const ProductSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: "" },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
    brand: { type: String, default: "", trim: true },
    sku: { type: String, default: "", trim: true },
    price: { type: Number, required: true, min: 0, index: true },
    // Старая цена > price ⇒ товар «со скидкой».
    oldPrice: { type: Number, default: null, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
    images: { type: [String], default: [] },
    specs: { type: [SpecSchema], default: [] },
    // «Рекомендуемые товары».
    featured: { type: Boolean, default: false, index: true },
    isActive: { type: Boolean, default: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
  },
  { timestamps: true },
);

export type ProductDoc = mongoose.InferSchemaType<typeof ProductSchema> & {
  _id: mongoose.Types.ObjectId;
};

const Product: Model<ProductDoc> =
  (mongoose.models.Product as Model<ProductDoc>) ||
  mongoose.model<ProductDoc>("Product", ProductSchema);

export default Product;
