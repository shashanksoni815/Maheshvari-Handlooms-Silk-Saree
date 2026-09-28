import { Router } from 'express';
import { authorizePermission } from '../../middleware/auth';
import { auditLog } from '../../middleware/audit';
import { getCustomers, getCustomerById, updateCustomerStatus } from '../../controllers/admin/adminCustomerController';

const router = Router();

router.get('/', authorizePermission('customers.read'), getCustomers);
router.get('/:id', authorizePermission('customers.read'), getCustomerById);
router.put('/:id/status', authorizePermission('customers.update'), auditLog('UPDATE_STATUS', 'CUSTOMER'), updateCustomerStatus);

export default router;
