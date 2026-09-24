import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
  customRole?: mongoose.Types.ObjectId | any;
  isActive: boolean;
  isVerified: boolean;
  refreshToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: { type: String, select: false },
    role: {
      type: String,
      enum: ['USER', 'ADMIN', 'SUPER_ADMIN'],
      default: 'USER',
    },
    customRole: { type: Schema.Types.ObjectId, ref: 'Role' },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    refreshToken: { type: String, select: false },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
