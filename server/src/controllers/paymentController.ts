import { Request, Response } from 'express';
// @ts-ignore
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { Order } from '../models/Order';
import { AppError } from '../middleware/error';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret',
});

// @desc    Create Razorpay Order
// @route   POST /api/v1/payments/create-order/:orderId
// @access  Private
export const createRazorpayOrder = async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.orderId);

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  // Check authorization
  if (order.user.toString() !== req.user._id.toString()) {
    throw new AppError('Not authorized', 403);
  }

  const options = {
    amount: Math.round(order.total * 100), // Amount in smallest currency unit (paise)
    currency: 'INR',
    receipt: `receipt_order_${order._id}`,
  };

  try {
    const razorpayOrder = await razorpay.orders.create(options);
    
    res.status(200).json({
      success: true,
      data: razorpayOrder,
    });
  } catch (error) {
    console.error('Razorpay Error:', error);
    throw new AppError('Error creating Razorpay order', 500);
  }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/v1/payments/verify
// @access  Private
export const verifyPayment = async (req: Request, res: Response) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = req.body;

  const order = await Order.findById(orderId);

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  // Create signature for verification
  const secret = process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret';
  const generatedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex');

  if (generatedSignature === razorpaySignature) {
    // Payment is successful
    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentResult = {
      id: razorpayPaymentId,
      status: 'Paid',
      update_time: new Date().toISOString(),
      email_address: req.user.email,
    };

    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      data: updatedOrder,
    });
  } else {
    throw new AppError('Payment verification failed', 400);
  }
};
