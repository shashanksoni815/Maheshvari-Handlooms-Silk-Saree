import mongoose, { Document } from 'mongoose';
export interface IProduct extends Document {
    name: string;
    slug: string;
    sku: string;
    description: string;
    shortDescription?: string;
    price: number;
    mrp: number;
    discount: number;
    images: {
        url: string;
        publicId: string;
        isPrimary: boolean;
    }[];
    category: mongoose.Types.ObjectId;
    collections: mongoose.Types.ObjectId[];
    stock: number;
    status: 'DRAFT' | 'PUBLISHED' | 'OUT_OF_STOCK' | 'ARCHIVED';
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
declare const _default: mongoose.Model<IProduct, {}, {}, {}, mongoose.Document<unknown, {}, IProduct, {}, mongoose.DefaultSchemaOptions> & IProduct & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IProduct>;
export default _default;
//# sourceMappingURL=Product.d.ts.map