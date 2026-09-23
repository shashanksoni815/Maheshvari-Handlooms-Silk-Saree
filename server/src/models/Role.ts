import mongoose, { Schema, Document } from 'mongoose';

export interface IRole extends Document {
  name: string;
  description: string;
  permissions: string[];
  isSystem: boolean; // System roles (like SUPER_ADMIN) cannot be deleted
  createdAt: Date;
  updatedAt: Date;
}

const RoleSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true },
    permissions: [{ type: String }],
    isSystem: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IRole>('Role', RoleSchema);
