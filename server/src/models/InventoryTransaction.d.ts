import mongoose, { Document } from 'mongoose';
export interface IInventoryTransaction extends Document {
    product: mongoose.Types.ObjectId;
    sku: string;
    type: 'INCREASE' | 'DECREASE' | 'SET';
    quantity: number;
    beforeStock: number;
    afterStock: number;
    reason: string;
    admin: mongoose.Types.ObjectId;
    order?: mongoose.Types.ObjectId;
    createdAt: Date;
}
declare const _default: mongoose.Model<IInventoryTransaction, {}, {}, {}, mongoose.Document<unknown, {}, IInventoryTransaction, {}, mongoose.DefaultSchemaOptions> & IInventoryTransaction & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IInventoryTransaction>;
export default _default;
//# sourceMappingURL=InventoryTransaction.d.ts.map