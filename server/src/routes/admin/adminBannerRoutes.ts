import { Router } from 'express';
import { authorizePermission } from '../../middleware/auth';
import { auditLog } from '../../middleware/audit';
import { getBanners, createBanner, updateBanner, deleteBanner } from '../../controllers/admin/adminBannerController';

const router = Router();

router.get('/', authorizePermission('banners.read'), getBanners);
router.post('/', authorizePermission('banners.update'), auditLog('CREATE', 'BANNER'), createBanner);
router.put('/:id', authorizePermission('banners.update'), auditLog('UPDATE', 'BANNER'), updateBanner);
router.delete('/:id', authorizePermission('banners.update'), auditLog('DELETE', 'BANNER'), deleteBanner);

export default router;
