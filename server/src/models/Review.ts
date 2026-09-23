import mongoose, { Schema, Document } from 'mongoose';

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

const ReviewSchema: Schema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    images: [{ type: String }],
    isVerifiedPurchase: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: true }, // Default true for now, can be false if moderation is strict
  },
  { timestamps: true }
);

export default mongoose.model<IReview>('Review', ReviewSchema);
