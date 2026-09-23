import { Router } from 'express';
import { authorizePermission } from '../../middleware/auth';
import { auditLog } from '../../middleware/audit';
import {
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  bulkUpdateProducts
} from '../../controllers/admin/adminProductController';
import { getProducts, getProductById } from '../../controllers/productController';

const router = Router();

// GET routes can reuse storefront controllers if appropriate, but with read permission
router.get('/', authorizePermission('products.read'), getProducts);
router.get('/:id', authorizePermission('products.read'), getProductById);

router.post('/', authorizePermission('products.create'), auditLog('CREATE', 'PRODUCT'), createAdminProduct);
router.put('/:id', authorizePermission('products.update'), auditLog('UPDATE', 'PRODUCT'), updateAdminProduct);
router.delete('/:id', authorizePermission('products.delete'), auditLog('DELETE', 'PRODUCT'), deleteAdminProduct);

router.post('/bulk-update', authorizePermission('products.update'), auditLog('BULK_UPDATE', 'PRODUCT'), bulkUpdateProducts);

export default router;
