import express from 'express';
import { getCoupons, createCoupon, updateCoupon, deleteCoupon } from '../controllers/couponController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.route('/')
  .get(protect, authorize('ADMIN', 'SUPER_ADMIN'), getCoupons)
  .post(protect, authorize('ADMIN', 'SUPER_ADMIN'), createCoupon);

router.route('/:id')
  .put(protect, authorize('ADMIN', 'SUPER_ADMIN'), updateCoupon)
  .delete(protect, authorize('ADMIN', 'SUPER_ADMIN'), deleteCoupon);

export default router;
