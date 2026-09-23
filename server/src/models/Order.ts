import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  orderNumber: string;
  items: {
    product: mongoose.Types.ObjectId;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  shippingAddress: {
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  };
  pricing: {
    subtotal: number;
    shipping: number;
    tax: number;
    discount: number;
    total: number;
  };
  paymentInfo: {
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
    status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
    method: 'RAZORPAY' | 'COD';
  };
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  trackingInfo?: {
    courier?: string;
    trackingId?: string;
    trackingUrl?: string;
    shippedAt?: Date;
    expectedDelivery?: Date;
  };
  isRefunded?: boolean;
  refundDetails?: {
    amount: number;
    reason: string;
    refundedAt: Date;
    refundedBy: mongoose.Types.ObjectId;
  };
  orderNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    orderNumber: { type: String, required: true, unique: true },
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
        image: { type: String, required: true },
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      addressLine1: { type: String, required: true },
      addressLine2: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      phone: { type: String, required: true },
    },
    pricing: {
      subtotal: { type: Number, required: true },
      shipping: { type: Number, required: true },
      tax: { type: Number, required: true },
      discount: { type: Number, default: 0 },
      total: { type: Number, required: true },
    },
    paymentInfo: {
      razorpayOrderId: { type: String },
      razorpayPaymentId: { type: String },
      razorpaySignature: { type: String },
      status: {
        type: String,
        enum: ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'],
        default: 'PENDING',
      },
      method: {
        type: String,
        enum: ['RAZORPAY', 'COD'],
        required: true,
      },
    },
    status: {
      type: String,
      enum: ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'],
      default: 'PENDING',
    },
    trackingInfo: {
      courier: String,
      trackingId: String,
      trackingUrl: String,
      shippedAt: Date,
      expectedDelivery: Date,
    },
    isRefunded: { type: Boolean, default: false },
    refundDetails: {
      amount: Number,
      reason: String,
      refundedAt: Date,
      refundedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    },
    orderNotes: String,
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>('Order', OrderSchema);
