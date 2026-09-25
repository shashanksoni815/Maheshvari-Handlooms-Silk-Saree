import mongoose, { Document } from 'mongoose';
export interface IAddress extends Document {
    user: mongoose.Types.ObjectId;
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    isDefault: boolean;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IAddress, {}, {}, {}, mongoose.Document<unknown, {}, IAddress, {}, mongoose.DefaultSchemaOptions> & IAddress & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IAddress>;
export default _default;
//# sourceMappingURL=Address.d.ts.map