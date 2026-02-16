import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICartItem {
  productId: string;
  name: string;
  price: string;
  image: string;
  quantity: number;
}

export interface ICart extends Document {
  userId?: string;
  sessionId: string;
  items: ICartItem[];
  createdAt: Date;
  updatedAt: Date;
}

const CartItemSchema = new Schema<ICartItem>({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: String, required: true },
  image: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1, min: 1 },
}, { _id: false });

const CartSchema = new Schema<ICart>({
  userId: { type: String, required: false },
  sessionId: { type: String, required: true },
  items: { type: [CartItemSchema], default: [] },
}, {
  timestamps: true,
});

// Index for faster queries
CartSchema.index({ userId: 1 });
CartSchema.index({ sessionId: 1 });

const Cart: Model<ICart> = mongoose.models.Cart || mongoose.model<ICart>('Cart', CartSchema);

export default Cart;
