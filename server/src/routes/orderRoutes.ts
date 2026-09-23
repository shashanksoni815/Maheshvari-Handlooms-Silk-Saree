import express from 'express';
import { createOrder, getOrderById, getMyOrders, getOrders, updateOrderToDelivered } from '../controllers/orderController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.use(protect); // All order routes require authentication

router.route('/').post(createOrder).get(authorize('ADMIN', 'SUPER_ADMIN'), getOrders);
router.route('/myorders').get(getMyOrders);
router.route('/:id').get(getOrderById);
router.route('/:id/deliver').put(authorize('ADMIN', 'SUPER_ADMIN'), updateOrderToDelivered);

export default router;
