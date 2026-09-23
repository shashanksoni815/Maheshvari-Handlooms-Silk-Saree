import mongoose, { Document, Schema } from 'mongoose';

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

const blogSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    readTime: { type: String, required: true, default: '5 min read' },
    isPublished: { type: Boolean, default: true },
    author: { type: String, default: 'Maheshwari Silk' }
  },
  {
    timestamps: true,
  }
);

const Blog = mongoose.model<IBlog>('Blog', blogSchema);
export default Blog;
