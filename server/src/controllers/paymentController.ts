import { Request, Response, NextFunction } from 'express';
// @ts-ignore
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { Order } from '../models/Order';
import { ApiError } from '../utils/apiError';
import { ApiResponse } from '../utils/apiResponse';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret',
});

// @desc    Create Razorpay Order
// @route   POST /api/v1/payments/create-order/:orderId
// @access  Private
export const createRazorpayOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return next(new ApiError(404, 'Order not found'));
    }

    // Check authorization
    if (order.user.toString() !== req.user._id.toString()) {
      return next(new ApiError(403, 'Not authorized'));
    }

    const options = {
      amount: Math.round(order.pricing.total * 100), // Amount in smallest currency unit (paise)
      currency: 'INR',
      receipt: `receipt_order_${order._id}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);
    
    res.status(200).json(new ApiResponse('Razorpay order created', razorpayOrder));
  } catch (error) {
    console.error('Razorpay Error:', error);
    next(new ApiError(500, 'Error creating Razorpay order'));
  }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/v1/payments/verify
// @access  Private
export const verifyPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return next(new ApiError(404, 'Order not found'));
    }

    // Create signature for verification
    const secret = process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret';
    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (generatedSignature === razorpaySignature) {
      // Payment is successful
      order.paymentInfo.status = 'COMPLETED';
      order.paymentInfo.razorpayPaymentId = razorpayPaymentId;
      order.paymentInfo.razorpaySignature = razorpaySignature;
      order.status = 'CONFIRMED';

      const updatedOrder = await order.save();

      res.status(200).json(new ApiResponse('Payment verified successfully', updatedOrder));
    } else {
      return next(new ApiError(400, 'Payment verification failed: Invalid signature'));
    }
  } catch (error) {
    console.error('Payment Verify Error:', error);
    next(new ApiError(500, 'Error verifying payment'));
  }
};

// @desc    Razorpay Webhook (Direct & Secure Server-to-Server Payment Completion)
// @route   POST /api/v1/payments/webhook
// @access  Public
export const razorpayWebhook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'dummy_webhook_secret';
    const signature = req.headers['x-razorpay-signature'] as string;

    const bodyStr = JSON.stringify(req.body);
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(bodyStr)
      .digest('hex');

    if (expectedSignature !== signature) {
      return res.status(400).send('Invalid signature');
    }

    const event = req.body.event;

    if (event === 'payment.captured' || event === 'order.paid') {
      const paymentEntity = req.body.payload.payment.entity;
      const orderId = paymentEntity.notes?.orderId || paymentEntity.order_id;
      
      // We need to find the order. Since Razorpay creates an order_id which is stored in Razorpay, 
      // but in our DB we might not have it saved if it wasn't saved during create-order.
      // Wait, in `createRazorpayOrder`, we don't save the `razorpayOrder.id` to the DB!
      // But we passed `receipt_order_${order._id}` as the receipt. So we can extract it from the receipt!
      const receipt = req.body.payload.order?.entity?.receipt || '';
      let dbOrderId = '';
      if (receipt && receipt.startsWith('receipt_order_')) {
        dbOrderId = receipt.replace('receipt_order_', '');
      }

      if (dbOrderId) {
        const order = await Order.findById(dbOrderId);
        if (order && order.paymentInfo.status !== 'COMPLETED') {
          order.paymentInfo.status = 'COMPLETED';
          order.paymentInfo.razorpayPaymentId = paymentEntity.id;
          order.status = 'CONFIRMED';
          await order.save();
        }
      }
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook Error:', error);
    res.status(500).send('Server Error');
  }
};
