import { Router } from 'express';
import { authorizePermission } from '../../middleware/auth';
import { auditLog } from '../../middleware/audit';
import {
  getAdminOrders,
  getAdminOrderById,
  updateOrderStatus,
  updateOrderTracking,
  issueRefund
} from '../../controllers/admin/adminOrderController';

const router = Router();

router.get('/', authorizePermission('orders.read'), getAdminOrders);
router.get('/:id', authorizePermission('orders.read'), getAdminOrderById);
router.put('/:id/status', authorizePermission('orders.update'), auditLog('UPDATE_STATUS', 'ORDER'), updateOrderStatus);
router.put('/:id/tracking', authorizePermission('orders.update'), auditLog('UPDATE_TRACKING', 'ORDER'), updateOrderTracking);
router.post('/:id/refund', authorizePermission('orders.refund'), auditLog('REFUND', 'ORDER'), issueRefund);

export default router;
