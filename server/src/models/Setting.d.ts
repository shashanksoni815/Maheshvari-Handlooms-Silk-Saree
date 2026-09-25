import mongoose, { Document } from 'mongoose';
export interface ISetting extends Document {
    key: string;
    value: string;
    type: 'STRING' | 'BOOLEAN' | 'JSON' | 'HTML';
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<ISetting, {}, {}, {}, mongoose.Document<unknown, {}, ISetting, {}, mongoose.DefaultSchemaOptions> & ISetting & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ISetting>;
export default _default;
//# sourceMappingURL=Setting.d.ts.map