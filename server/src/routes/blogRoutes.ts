import express from 'express';
import { getBlogs, getBlogBySlug, createBlog, updateBlog, deleteBlog } from '../controllers/blogController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.route('/')
  .get(getBlogs)
  .post(protect, authorize('ADMIN', 'SUPER_ADMIN'), createBlog);

router.route('/:slug').get(getBlogBySlug);

router.route('/:id')
  .put(protect, authorize('ADMIN', 'SUPER_ADMIN'), updateBlog)
  .delete(protect, authorize('ADMIN', 'SUPER_ADMIN'), deleteBlog);

export default router;
