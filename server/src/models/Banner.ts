import mongoose, { Schema, Document } from 'mongoose';

export interface IBanner extends Document {
  title: string;
  image: string;
  mobileImage?: string;
  link: string;
  position: string; // e.g., 'HOME_HERO', 'CATEGORY_TOP'
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const BannerSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    image: { type: String, required: true },
    mobileImage: { type: String },
    link: { type: String, required: true },
    position: { type: String, required: true, default: 'HOME_HERO' },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IBanner>('Banner', BannerSchema);
