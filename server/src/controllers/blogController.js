"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBlog = exports.updateBlog = exports.createBlog = exports.getBlogBySlug = exports.getBlogs = void 0;
const Blog_1 = __importDefault(require("../models/Blog"));
// @desc    Get all blogs
// @route   GET /api/v1/blogs
// @access  Public
const getBlogs = async (req, res) => {
    try {
        const blogs = await Blog_1.default.find({ isPublished: true }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: blogs });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getBlogs = getBlogs;
// @desc    Get single blog
// @route   GET /api/v1/blogs/:slug
// @access  Public
const getBlogBySlug = async (req, res) => {
    try {
        const blog = await Blog_1.default.findOne({ slug: req.params.slug, isPublished: true });
        if (!blog) {
            return res.status(404).json({ success: false, message: 'Blog not found' });
        }
        res.status(200).json({ success: true, data: blog });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getBlogBySlug = getBlogBySlug;
// @desc    Create a blog
// @route   POST /api/v1/blogs
// @access  Private/Admin
const createBlog = async (req, res) => {
    try {
        const blog = await Blog_1.default.create(req.body);
        res.status(201).json({ success: true, data: blog });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.createBlog = createBlog;
// @desc    Update a blog
// @route   PUT /api/v1/blogs/:id
// @access  Private/Admin
const updateBlog = async (req, res) => {
    try {
        const blog = await Blog_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!blog) {
            return res.status(404).json({ success: false, message: 'Blog not found' });
        }
        res.status(200).json({ success: true, data: blog });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateBlog = updateBlog;
// @desc    Delete a blog
// @route   DELETE /api/v1/blogs/:id
// @access  Private/Admin
const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog_1.default.findByIdAndDelete(req.params.id);
        if (!blog) {
            return res.status(404).json({ success: false, message: 'Blog not found' });
        }
        res.status(200).json({ success: true, data: {} });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.deleteBlog = deleteBlog;
//# sourceMappingURL=blogController.js.map