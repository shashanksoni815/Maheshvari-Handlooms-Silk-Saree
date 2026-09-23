import { Router } from 'express';
import { authorizePermission } from '../../middleware/auth';
import { auditLog } from '../../middleware/audit';
import { adjustInventory, getInventoryHistory } from '../../controllers/admin/adminInventoryController';

const router = Router();

router.post('/adjust', authorizePermission('inventory.adjust'), auditLog('ADJUST', 'INVENTORY'), adjustInventory);
router.get('/history', authorizePermission('inventory.read'), getInventoryHistory);

export default router;
