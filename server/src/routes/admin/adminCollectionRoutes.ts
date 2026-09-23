import { Router } from 'express';
import { authorizePermission } from '../../middleware/auth';
import { auditLog } from '../../middleware/audit';
import {
  createCollection,
  updateCollection,
  deleteCollection,
} from '../../controllers/collectionController';

const router = Router();

router.post('/', authorizePermission('collections.create'), auditLog('CREATE', 'COLLECTION'), createCollection);
router.put('/:id', authorizePermission('collections.update'), auditLog('UPDATE', 'COLLECTION'), updateCollection);
router.delete('/:id', authorizePermission('collections.delete'), auditLog('DELETE', 'COLLECTION'), deleteCollection);

export default router;
