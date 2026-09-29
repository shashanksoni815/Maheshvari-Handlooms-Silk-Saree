import express from 'express';
import { createRazorpayOrder, verifyPayment, razorpayWebhook } from '../controllers/paymentController';
import { protect } from '../middleware/auth';

const router = express.Router();

// Webhook route must be public (Razorpay server hits this directly)
router.post('/webhook', razorpayWebhook);

// Protected routes (User hits these from the browser)
router.use(protect);

// Standard Razorpay routes & parameterized routes
router.post('/create-order', createRazorpayOrder);
router.post('/create-order/:orderId', createRazorpayOrder);
router.post('/verify', verifyPayment);
router.post('/verify-payment', verifyPayment);

export default router;
