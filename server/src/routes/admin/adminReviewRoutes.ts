import { Router } from 'express';
import { authorizePermission } from '../../middleware/auth';
import { getReviews, updateReviewStatus, deleteReview } from '../../controllers/admin/adminReviewController';

const router = Router();

router.get('/', authorizePermission('reviews.read'), getReviews);
router.put('/:id/status', authorizePermission('reviews.update'), updateReviewStatus);
router.delete('/:id', authorizePermission('reviews.delete'), deleteReview);

export default router;
