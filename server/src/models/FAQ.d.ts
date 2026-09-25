import mongoose, { Document } from 'mongoose';
export interface IFAQ extends Document {
    question: string;
    answer: string;
    category: 'GENERAL' | 'SHIPPING' | 'RETURNS' | 'PAYMENT' | 'PRODUCTS';
    isActive: boolean;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IFAQ, {}, {}, {}, mongoose.Document<unknown, {}, IFAQ, {}, mongoose.DefaultSchemaOptions> & IFAQ & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IFAQ>;
export default _default;
//# sourceMappingURL=FAQ.d.ts.map