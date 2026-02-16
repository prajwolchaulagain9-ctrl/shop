import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrderItem {
  productId: string;
  name: string;
  price: string;
  image: string;
  quantity: number;
}

export interface IOrder extends Document {
  userId?: string;
  sessionId: string;
  items: IOrderItem[];
  totalAmount: number;
  paymentMethod: 'cod' | 'esewa' | 'khalti' | 'bank';
  paymentStatus: 'pending' | 'verified' | 'failed';
  transactionId?: string;
  customerDetails?: {
    name: string;
    email?: string;
    phone: string;
    address: string;
    location?: {
      lat: number;
      lng: number;
      formattedAddress?: string;
    };
  };
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: String, required: true },
  image: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1, min: 1 },
}, { _id: false });

const OrderSchema = new Schema<IOrder>({
  userId: { type: String, required: false },
  sessionId: { type: String, required: true },
  items: { type: [OrderItemSchema], default: [] },
  totalAmount: { type: Number, required: true },
  paymentMethod: { 
    type: String, 
    enum: ['cod', 'esewa', 'khalti', 'bank'],
    required: true 
  },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'verified', 'failed'],
    default: 'pending',
    required: true 
  },
  transactionId: { type: String, required: false },
  customerDetails: {
    name: { type: String, required: false },
    email: { type: String, required: false },
    phone: { type: String, required: false },
    address: { type: String, required: false },
    location: {
      lat: { type: Number, required: false },
      lng: { type: Number, required: false },
      formattedAddress: { type: String, required: false },
    },
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
    required: true
  },
}, {
  timestamps: true,
});

// Indexes for faster queries
OrderSchema.index({ userId: 1 });
OrderSchema.index({ sessionId: 1 });
OrderSchema.index({ paymentStatus: 1 });
OrderSchema.index({ orderStatus: 1 });
OrderSchema.index({ createdAt: -1 });

const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
