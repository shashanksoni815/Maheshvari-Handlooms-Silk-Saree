import mongoose, { Document } from 'mongoose';
export interface ICoupon extends Document {
    code: string;
    discountType: 'PERCENTAGE' | 'FIXED';
    discountValue: number;
    maxDiscount?: number;
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
declare const _default: mongoose.Model<ICoupon, {}, {}, {}, mongoose.Document<unknown, {}, ICoupon, {}, mongoose.DefaultSchemaOptions> & ICoupon & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ICoupon>;
export default _default;
//# sourceMappingURL=Coupon.d.ts.map