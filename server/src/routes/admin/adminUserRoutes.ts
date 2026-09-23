import { Router } from 'express';
import { auditLog } from '../../middleware/audit';
import { getAdminUsers, createAdminUser, updateAdminUser, deleteAdminUser } from '../../controllers/admin/adminUserController';

const router = Router();

// In adminRoutes, this router is wrapped in authorizePermission('super.admin')
router.get('/', getAdminUsers);
router.post('/', auditLog('CREATE', 'ADMIN_USER'), createAdminUser);
router.put('/:id', auditLog('UPDATE', 'ADMIN_USER'), updateAdminUser);
router.delete('/:id', auditLog('DELETE', 'ADMIN_USER'), deleteAdminUser);

export default router;
