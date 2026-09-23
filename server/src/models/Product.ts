import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription?: string;
  price: number;
  mrp: number;
  discount: number;
  images: { url: string; publicId: string; isPrimary: boolean }[];
  category: mongoose.Types.ObjectId;
  collections: mongoose.Types.ObjectId[];
  stock: number;
  status: 'DRAFT' | 'PUBLISHED' | 'OUT_OF_STOCK' | 'ARCHIVED';
  
  // Silk Saree specific attributes
  attributes: {
    fabric?: string;
    silkType?: string;
    weave?: string;
    pattern?: string;
    zariType?: string;
    occasion?: string[];
    sareeLength?: string;
    sareeWidth?: string;
    blousePiece?: boolean;
    blouseLength?: string;
    weight?: string;
    origin?: string;
    careInstructions?: string;
  };
  
  rating: {
    average: number;
    count: number;
  };
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    sku: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: { type: String, required: true },
    shortDescription: { type: String },
    price: { type: Number, required: true, min: 0 },
    mrp: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0 },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
        isPrimary: { type: Boolean, default: false },
      },
    ],
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    collections: [{ type: Schema.Types.ObjectId, ref: 'Collection' }],
    stock: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['DRAFT', 'PUBLISHED', 'OUT_OF_STOCK', 'ARCHIVED'],
      default: 'DRAFT',
    },
    attributes: {
      fabric: String,
      silkType: String,
      weave: String,
      pattern: String,
      zariType: String,
      occasion: [String],
      sareeLength: String,
      sareeWidth: String,
      blousePiece: Boolean,
      blouseLength: String,
      weight: String,
      origin: String,
      careInstructions: String,
    },
    rating: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>('Product', ProductSchema);
