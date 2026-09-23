import { Router } from 'express';
import { authorizePermission } from '../../middleware/auth';
import { auditLog } from '../../middleware/audit';
import { getCoupons, createCoupon, updateCoupon, deleteCoupon } from '../../controllers/couponController';

const router = Router();

router.get('/', authorizePermission('coupons.read'), getCoupons);
router.post('/', authorizePermission('coupons.create'), auditLog('CREATE', 'COUPON'), createCoupon);
router.put('/:id', authorizePermission('coupons.update'), auditLog('UPDATE', 'COUPON'), updateCoupon);
router.delete('/:id', authorizePermission('coupons.delete'), auditLog('DELETE', 'COUPON'), deleteCoupon);

export default router;
