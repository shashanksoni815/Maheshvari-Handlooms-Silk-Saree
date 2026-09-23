import mongoose, { Schema, Document } from 'mongoose';

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

const InventoryTransactionSchema: Schema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    sku: { type: String, required: true },
    type: { type: String, enum: ['INCREASE', 'DECREASE', 'SET'], required: true },
    quantity: { type: Number, required: true },
    beforeStock: { type: Number, required: true },
    afterStock: { type: Number, required: true },
    reason: { type: String, required: true },
    admin: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    order: { type: Schema.Types.ObjectId, ref: 'Order' },
  },
  { 
    timestamps: { createdAt: true, updatedAt: false } // Immutable ledger
  }
);

export default mongoose.model<IInventoryTransaction>('InventoryTransaction', InventoryTransactionSchema);
