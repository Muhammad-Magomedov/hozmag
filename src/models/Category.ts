import mongoose, { Schema, type Model } from "mongoose";

const CategorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: "" },
  },
  { timestamps: true },
);

export type CategoryDoc = mongoose.InferSchemaType<typeof CategorySchema> & {
  _id: mongoose.Types.ObjectId;
};

const Category: Model<CategoryDoc> =
  (mongoose.models.Category as Model<CategoryDoc>) ||
  mongoose.model<CategoryDoc>("Category", CategorySchema);

export default Category;
