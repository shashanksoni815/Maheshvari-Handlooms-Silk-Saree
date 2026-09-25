import mongoose, { Document } from 'mongoose';
export interface IOrder extends Document {
    user: mongoose.Types.ObjectId;
    orderNumber: string;
    items: {
        product: mongoose.Types.ObjectId;
        name: string;
        price: number;
        quantity: number;
        image: string;
    }[];
    shippingAddress: {
        fullName: string;
        addressLine1: string;
        addressLine2?: string;
        city: string;
        state: string;
        pincode: string;
        phone: string;
    };
    pricing: {
        subtotal: number;
        shipping: number;
        tax: number;
        discount: number;
        total: number;
    };
    paymentInfo: {
        razorpayOrderId?: string;
        razorpayPaymentId?: string;
        razorpaySignature?: string;
        status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
        method: 'RAZORPAY' | 'COD';
    };
    status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
    trackingInfo?: {
        courier?: string;
        trackingId?: string;
        trackingUrl?: string;
        shippedAt?: Date;
        expectedDelivery?: Date;
    };
    isRefunded?: boolean;
    refundDetails?: {
        amount: number;
        reason: string;
        refundedAt: Date;
        refundedBy: mongoose.Types.ObjectId;
    };
    orderNotes?: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IOrder, {}, {}, {}, mongoose.Document<unknown, {}, IOrder, {}, mongoose.DefaultSchemaOptions> & IOrder & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IOrder>;
export default _default;
//# sourceMappingURL=Order.d.ts.map