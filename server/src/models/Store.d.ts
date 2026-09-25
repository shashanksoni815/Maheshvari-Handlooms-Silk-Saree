import mongoose, { Document } from 'mongoose';
export interface IStore extends Document {
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
    email: string;
    mapEmbedUrl?: string;
    workingHours: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IStore, {}, {}, {}, mongoose.Document<unknown, {}, IStore, {}, mongoose.DefaultSchemaOptions> & IStore & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IStore>;
export default _default;
//# sourceMappingURL=Store.d.ts.map