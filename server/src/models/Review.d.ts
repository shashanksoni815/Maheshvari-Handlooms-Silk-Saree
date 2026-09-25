import mongoose, { Document } from 'mongoose';
export interface IReview extends Document {
    product: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    rating: number;
    title: string;
    description: string;
    images?: string[];
    isVerifiedPurchase: boolean;
    isApproved: boolean;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IReview, {}, {}, {}, mongoose.Document<unknown, {}, IReview, {}, mongoose.DefaultSchemaOptions> & IReview & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IReview>;
export default _default;
//# sourceMappingURL=Review.d.ts.map