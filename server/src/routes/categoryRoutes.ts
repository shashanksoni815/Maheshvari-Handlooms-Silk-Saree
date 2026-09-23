import { Router } from 'express';
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

router.get('/', getCategories);
router.get('/:id', getCategoryById);
router.post('/', protect, authorize('ADMIN', 'SUPER_ADMIN'), createCategory);
router.put('/:id', protect, authorize('ADMIN', 'SUPER_ADMIN'), updateCategory);
router.delete('/:id', protect, authorize('ADMIN', 'SUPER_ADMIN'), deleteCategory);

export default router;
