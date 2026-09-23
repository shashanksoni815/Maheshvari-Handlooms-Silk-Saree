import mongoose, { Schema, Document } from 'mongoose';

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

const AddressSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    addressLine1: { type: String, required: true, trim: true },
    addressLine2: { type: String, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    pincode: { type: String, required: true, trim: true },
    country: { type: String, default: 'India', trim: true },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IAddress>('Address', AddressSchema);
