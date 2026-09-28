import { Router } from 'express';
import { authorizePermission } from '../../middleware/auth';
import { auditLog } from '../../middleware/audit';
import {
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  bulkUpdateProducts,
  getAdminProducts,
  getAdminProductById,
} from '../../controllers/admin/adminProductController';

const router = Router();

// Admin reads include drafts and archived records needed for full catalog management.
router.get('/', authorizePermission('products.read'), getAdminProducts);
router.get('/:id', authorizePermission('products.read'), getAdminProductById);

router.post('/', authorizePermission('products.create'), auditLog('CREATE', 'PRODUCT'), createAdminProduct);
router.put('/:id', authorizePermission('products.update'), auditLog('UPDATE', 'PRODUCT'), updateAdminProduct);
router.delete('/:id', authorizePermission('products.delete'), auditLog('DELETE', 'PRODUCT'), deleteAdminProduct);

router.post('/bulk-update', authorizePermission('products.update'), auditLog('BULK_UPDATE', 'PRODUCT'), bulkUpdateProducts);

export default router;
