import mongoose, { Schema, Document } from 'mongoose';

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

const StoreSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    mapEmbedUrl: { type: String },
    workingHours: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<IStore>('Store', StoreSchema);
