import { Router } from 'express';
import { authorizePermission } from '../../middleware/auth';
import { auditLog } from '../../middleware/audit';
import {
  getStores,
  createStore,
  updateStore,
  deleteStore,
  getFaqs,
  createFaq,
  updateFaq,
  deleteFaq,
  getSettings,
  updateSetting
} from '../../controllers/admin/adminCmsController';

const router = Router();

// Store Routes
router.get('/stores', authorizePermission('cms.read'), getStores);
router.post('/stores', authorizePermission('cms.update'), auditLog('CREATE', 'STORE'), createStore);
router.put('/stores/:id', authorizePermission('cms.update'), auditLog('UPDATE', 'STORE'), updateStore);
router.delete('/stores/:id', authorizePermission('cms.update'), auditLog('DELETE', 'STORE'), deleteStore);

// FAQ Routes
router.get('/faqs', authorizePermission('cms.read'), getFaqs);
router.post('/faqs', authorizePermission('cms.update'), auditLog('CREATE', 'FAQ'), createFaq);
router.put('/faqs/:id', authorizePermission('cms.update'), auditLog('UPDATE', 'FAQ'), updateFaq);
router.delete('/faqs/:id', authorizePermission('cms.update'), auditLog('DELETE', 'FAQ'), deleteFaq);

// Settings Routes (for Policies like Terms, Privacy, etc.)
router.get('/settings', authorizePermission('cms.read'), getSettings);
router.put('/settings', authorizePermission('cms.update'), auditLog('UPDATE', 'SETTING'), updateSetting);

export default router;
