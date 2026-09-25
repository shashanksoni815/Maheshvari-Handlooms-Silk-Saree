import mongoose, { Document } from 'mongoose';
export interface IBlog extends Document {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    image: string;
    category: string;
    readTime: string;
    isPublished: boolean;
    author: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const Blog: mongoose.Model<IBlog, {}, {}, {}, mongoose.Document<unknown, {}, IBlog, {}, mongoose.DefaultSchemaOptions> & IBlog & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IBlog>;
export default Blog;
//# sourceMappingURL=Blog.d.ts.map