import { Request, Response } from 'express';
import Blog from '../models/Blog';

// @desc    Get all blogs
// @route   GET /api/v1/blogs
// @access  Public
export const getBlogs = async (req: Request, res: Response) => {
  try {
    const blogs = await Blog.find({ isPublished: true }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: blogs });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single blog
// @route   GET /api/v1/blogs/:slug
// @access  Public
export const getBlogBySlug = async (req: Request, res: Response) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug as string, isPublished: true });
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }
    res.status(200).json({ success: true, data: blog });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a blog
// @route   POST /api/v1/blogs
// @access  Private/Admin
export const createBlog = async (req: Request, res: Response) => {
  try {
    const blog = await Blog.create(req.body);
    res.status(201).json({ success: true, data: blog });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a blog
// @route   PUT /api/v1/blogs/:id
// @access  Private/Admin
export const updateBlog = async (req: Request, res: Response) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }
    res.status(200).json({ success: true, data: blog });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a blog
// @route   DELETE /api/v1/blogs/:id
// @access  Private/Admin
export const deleteBlog = async (req: Request, res: Response) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
