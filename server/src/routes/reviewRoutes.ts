import express from 'express';
import {
  createProductReview,
  getProductReviews,
  deleteReview,
  updateReviewStatus
} from '../controllers/reviewController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router({ mergeParams: true });

// Public routes
router.get('/', getProductReviews);

// Protected routes
router.post('/', protect, createProductReview);

// Admin routes
router.delete('/:reviewId', protect, authorize('ADMIN', 'SUPER_ADMIN'), deleteReview);
router.put('/:reviewId/status', protect, authorize('ADMIN', 'SUPER_ADMIN'), updateReviewStatus);

export default router;
