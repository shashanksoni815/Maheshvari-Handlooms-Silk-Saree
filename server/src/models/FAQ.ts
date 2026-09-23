import mongoose, { Schema, Document } from 'mongoose';

export interface IFAQ extends Document {
  question: string;
  answer: string;
  category: 'GENERAL' | 'SHIPPING' | 'RETURNS' | 'PAYMENT' | 'PRODUCTS';
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const FAQSchema: Schema = new Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    category: {
      type: String,
      enum: ['GENERAL', 'SHIPPING', 'RETURNS', 'PAYMENT', 'PRODUCTS'],
      default: 'GENERAL',
    },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IFAQ>('FAQ', FAQSchema);
