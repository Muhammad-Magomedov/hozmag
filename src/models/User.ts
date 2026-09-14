import mongoose, { Schema, type Model } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    // Хэш пароля (bcrypt). select:false — не отдаём по умолчанию.
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["superadmin", "admin", "customer"],
      default: "customer",
    },
    // Гранулярные права для роли admin (супер-админ имеет все неявно).
    permissions: [
      {
        type: String,
        enum: [
          "products:manage",
          "categories:manage",
          "users:manage",
          "orders:manage",
        ],
      },
    ],
    phone: { type: String, trim: true },
  },
  { timestamps: true },
);

export type UserDoc = mongoose.InferSchemaType<typeof UserSchema> & {
  _id: mongoose.Types.ObjectId;
};

const User: Model<UserDoc> =
  (mongoose.models.User as Model<UserDoc>) ||
  mongoose.model<UserDoc>("User", UserSchema);

export default User;
