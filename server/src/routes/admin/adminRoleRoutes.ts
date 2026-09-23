import { Router } from 'express';
import { authorizePermission } from '../../middleware/auth';
import { auditLog } from '../../middleware/audit';
import { getRoles, createRole, updateRole, deleteRole } from '../../controllers/admin/adminRoleController';

const router = Router();

// Only super admins should manage roles, but we'll use a specific permission 'roles.manage' or hardcode 'super.admin'
// In adminRoutes, this router is wrapped in authorizePermission('super.admin')
router.get('/', getRoles);
router.post('/', auditLog('CREATE', 'ROLE'), createRole);
router.put('/:id', auditLog('UPDATE', 'ROLE'), updateRole);
router.delete('/:id', auditLog('DELETE', 'ROLE'), deleteRole);

export default router;
