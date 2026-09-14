import mongoose, { Schema, type Model } from "mongoose";

const OrderItemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product" },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    qty: { type: Number, required: true, min: 1 },
    image: { type: String, default: "" },
  },
  { _id: false },
);

const OrderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", default: null },
    items: { type: [OrderItemSchema], default: [] },
    total: { type: Number, required: true },
    customer: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, default: "" },
      comment: { type: String, default: "" },
    },
    status: {
      type: String,
      enum: ["new", "processing", "done", "cancelled"],
      default: "new",
    },
  },
  { timestamps: true },
);

export type OrderDoc = mongoose.InferSchemaType<typeof OrderSchema> & {
  _id: mongoose.Types.ObjectId;
};

const Order: Model<OrderDoc> =
  (mongoose.models.Order as Model<OrderDoc>) ||
  mongoose.model<OrderDoc>("Order", OrderSchema);

export default Order;
