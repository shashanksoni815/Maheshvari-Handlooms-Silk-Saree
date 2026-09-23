import mongoose, { Schema, Document } from 'mongoose';

export interface ICoupon extends Document {
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  maxDiscount?: number; // Useful for percentage type
  minPurchase: number;
  startDate: Date;
  expiryDate: Date;
  usageLimit: number;
  usedCount: number;
  perUserLimit: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CouponSchema: Schema = new Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    discountType: { type: String, enum: ['PERCENTAGE', 'FIXED'], required: true },
    discountValue: { type: Number, required: true, min: 0 },
    maxDiscount: { type: Number, min: 0 },
    minPurchase: { type: Number, default: 0, min: 0 },
    startDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true },
    usageLimit: { type: Number, default: 0 }, // 0 = unlimited
    usedCount: { type: Number, default: 0 },
    perUserLimit: { type: Number, default: 1 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<ICoupon>('Coupon', CouponSchema);
