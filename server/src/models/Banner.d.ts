import mongoose, { Document } from 'mongoose';
export interface IBanner extends Document {
    title: string;
    image: string;
    mobileImage?: string;
    link: string;
    position: string;
    isActive: boolean;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IBanner, {}, {}, {}, mongoose.Document<unknown, {}, IBanner, {}, mongoose.DefaultSchemaOptions> & IBanner & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IBanner>;
export default _default;
//# sourceMappingURL=Banner.d.ts.map