import { Router } from 'express';
import { auditLog } from '../../middleware/audit';
import { getSettings, updateSettings, deleteSetting } from '../../controllers/admin/adminSettingController';

const router = Router();

// In adminRoutes, this router is wrapped in authorizePermission('super.admin')
router.get('/', getSettings);
router.post('/', auditLog('UPDATE', 'SETTING'), updateSettings);
router.delete('/:id', auditLog('DELETE', 'SETTING'), deleteSetting);

export default router;
