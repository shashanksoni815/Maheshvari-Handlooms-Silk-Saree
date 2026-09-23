import mongoose, { Schema, Document } from 'mongoose';

export interface ICollection extends Document {
  name: string;
  slug: string;
  description?: string;
  bannerImage?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CollectionSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String },
    bannerImage: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<ICollection>('Collection', CollectionSchema);
