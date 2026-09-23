import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController';
import { createProductReview } from '../controllers/reviewController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', protect, authorize('ADMIN', 'SUPER_ADMIN'), createProduct);
router.put('/:id', protect, authorize('ADMIN', 'SUPER_ADMIN'), updateProduct);
router.delete('/:id', protect, authorize('ADMIN', 'SUPER_ADMIN'), deleteProduct);

// Reviews
router.post('/:id/reviews', protect, createProductReview);

export default router;
