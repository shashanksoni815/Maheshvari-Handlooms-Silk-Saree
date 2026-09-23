import mongoose, { Schema, Document } from 'mongoose';

export interface ISetting extends Document {
  key: string;
  value: string;
  type: 'STRING' | 'BOOLEAN' | 'JSON' | 'HTML';
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SettingSchema: Schema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    value: { type: String, required: true },
    type: { 
      type: String, 
      enum: ['STRING', 'BOOLEAN', 'JSON', 'HTML'], 
      default: 'STRING' 
    },
    description: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<ISetting>('Setting', SettingSchema);
