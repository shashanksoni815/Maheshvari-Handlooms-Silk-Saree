import { Router } from 'express';
import { authorizePermission } from '../../middleware/auth';
import { auditLog } from '../../middleware/audit';
import { getReviews, updateReviewStatus, deleteReview } from '../../controllers/admin/adminReviewController';

const router = Router();

router.get('/', authorizePermission('reviews.read'), getReviews);
router.put('/:id/status', authorizePermission('reviews.update'), auditLog('UPDATE_STATUS', 'REVIEW'), updateReviewStatus);
router.delete('/:id', authorizePermission('reviews.delete'), auditLog('DELETE', 'REVIEW'), deleteReview);

export default router;
