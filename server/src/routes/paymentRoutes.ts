import express from 'express';
import { createRazorpayOrder, verifyPayment } from '../controllers/paymentController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect);

router.post('/create-order/:orderId', createRazorpayOrder);
router.post('/verify', verifyPayment);

export default router;
