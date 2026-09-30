import { Router } from 'express';
import { authorizePermission } from '../../middleware/auth';
import { auditLog } from '../../middleware/audit';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  seedCategories,
} from '../../controllers/categoryController';

const router = Router();

router.get('/', authorizePermission('categories.read'), getCategories);
router.post('/seed', authorizePermission('categories.create'), auditLog('CREATE', 'CATEGORY_SEED'), seedCategories);
router.post('/', authorizePermission('categories.create'), auditLog('CREATE', 'CATEGORY'), createCategory);
router.put('/:id', authorizePermission('categories.update'), auditLog('UPDATE', 'CATEGORY'), updateCategory);
router.delete('/:id', authorizePermission('categories.delete'), auditLog('DELETE', 'CATEGORY'), deleteCategory);

export default router;
