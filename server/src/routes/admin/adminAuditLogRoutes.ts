import { Router } from 'express';
import { getAuditLogs } from '../../controllers/admin/adminAuditLogController';

const router = Router();

// In adminRoutes, this router is wrapped in authorizePermission('super.admin')
router.get('/', getAuditLogs);

export default router;
