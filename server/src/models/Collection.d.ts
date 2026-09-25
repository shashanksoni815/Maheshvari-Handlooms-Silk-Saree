import mongoose, { Document } from 'mongoose';
export interface ICollection extends Document {
    name: string;
    slug: string;
    description?: string;
    bannerImage?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<ICollection, {}, {}, {}, mongoose.Document<unknown, {}, ICollection, {}, mongoose.DefaultSchemaOptions> & ICollection & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ICollection>;
export default _default;
//# sourceMappingURL=Collection.d.ts.map