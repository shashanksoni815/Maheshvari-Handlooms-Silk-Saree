import { Request, Response, NextFunction } from 'express';
// @ts-ignore
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/Order';
import { AuthRequest } from '../middleware/auth';
import { ApiError } from '../utils/apiError';
import { ApiResponse } from '../utils/apiResponse';
import sendEmail from '../utils/emailService';

const isRazorpayConfigured = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  return Boolean(
    keyId && keySecret &&
    keyId !== 'rzp_test_your_key_id' &&
    keySecret !== 'your_razorpay_key_secret'
  );
};

const getRazorpayClient = () => {
  if (!isRazorpayConfigured()) {
    throw new ApiError(503, 'Online payments are not configured');
  }

  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });
};

// @desc    Create Razorpay Order
// @route   POST /api/v1/payments/create-order/:orderId
// @access  Private
export const createRazorpayOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!isRazorpayConfigured()) {
      return next(new ApiError(503, 'Online payments are not configured'));
    }

    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return next(new ApiError(404, 'Order not found'));
    }

    // Check authorization
    if (order.user.toString() !== (req as any).user._id.toString()) {
      return next(new ApiError(403, 'Not authorized'));
    }

    if (order.paymentInfo.status !== 'PENDING') {
      return next(new ApiError(409, 'This order is not awaiting payment'));
    }

    if (order.paymentInfo.razorpayOrderId) {
      return res.status(200).json(new ApiResponse('Razorpay order already created', {
        id: order.paymentInfo.razorpayOrderId,
        amount: Math.round(order.pricing.total * 100),
        currency: 'INR',
      }));
    }

    const options = {
      amount: Math.round(order.pricing.total * 100), // Amount in smallest currency unit (paise)
      currency: 'INR',
      receipt: `receipt_order_${order._id}`,
    };

    const razorpay = getRazorpayClient();
    const razorpayOrder = await razorpay.orders.create(options);
    order.paymentInfo.razorpayOrderId = razorpayOrder.id;
    await order.save();
    
    res.status(200).json(new ApiResponse('Razorpay order created', razorpayOrder));
  } catch (error) {
    console.error('Razorpay Error:', error);
    next(new ApiError(500, 'Error creating Razorpay order'));
  }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/v1/payments/verify
// @access  Private
export const verifyPayment = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = req.body;

    if (![razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId].every(value => typeof value === 'string' && value.length > 0)) {
      return next(new ApiError(400, 'Payment verification details are incomplete'));
    }

    const order = await Order.findById(orderId).populate('user', 'email firstName');

    if (!order) {
      return next(new ApiError(404, 'Order not found'));
    }

    if (order.user._id.toString() !== req.user._id.toString()) {
      return next(new ApiError(403, 'Not authorized to verify payment for this order'));
    }

    if (order.paymentInfo.razorpayOrderId !== razorpayOrderId) {
      return next(new ApiError(400, 'Payment does not match this order'));
    }

    if (order.paymentInfo.status === 'COMPLETED') {
      if (order.paymentInfo.razorpayPaymentId === razorpayPaymentId) {
        return res.status(200).json(new ApiResponse('Payment already verified', order));
      }
      return next(new ApiError(409, 'This order has already been paid'));
    }

    if (order.paymentInfo.status !== 'PENDING') {
      return next(new ApiError(409, 'This order is not awaiting payment'));
    }

    // Create signature for verification
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret || !isRazorpayConfigured()) {
      return next(new ApiError(503, 'Online payments are not configured'));
    }
    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest();
    const receivedSignature = Buffer.from(razorpaySignature, 'hex');
    const isSignatureValid = receivedSignature.length === generatedSignature.length &&
      crypto.timingSafeEqual(generatedSignature, receivedSignature);

    if (isSignatureValid) {
      const razorpay = getRazorpayClient();
      const providerPayment = await razorpay.payments.fetch(razorpayPaymentId);
      if (providerPayment.order_id !== razorpayOrderId ||
          providerPayment.amount !== Math.round(order.pricing.total * 100) ||
          providerPayment.currency !== 'INR' ||
          providerPayment.status !== 'captured') {
        return next(new ApiError(400, 'Payment is not captured for the expected order amount'));
      }

      // Payment is successful
      order.paymentInfo.status = 'COMPLETED';
      order.paymentInfo.razorpayPaymentId = razorpayPaymentId;
      order.paymentInfo.razorpaySignature = razorpaySignature;
      order.status = 'CONFIRMED';

      const updatedOrder = await order.save();

      // Send Invoice Email
      try {
        const invoiceHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <h2 style="color: #6C2237;">Payment Successful!</h2>
            <p>Dear ${(order.user as any).firstName},</p>
            <p>Thank you for your purchase from Maheshwari Handloom Silk Saree. Your payment for Order <strong>#${order.orderNumber}</strong> has been successfully processed.</p>
            
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <h3 style="margin-top: 0; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Order Summary</h3>
              <p><strong>Total Amount:</strong> ₹${order.pricing.total.toLocaleString('en-IN')}</p>
              <p><strong>Payment Method:</strong> ${order.paymentInfo.method}</p>
              <p><strong>Payment Status:</strong> COMPLETED</p>
            </div>
            
            <p>We are now processing your order and will notify you once it's shipped.</p>
            <p>Best Regards,<br/>Maheshwari Handloom Silk Saree Team</p>
          </div>
        `;
        await sendEmail({
          email: (order.user as any).email,
          subject: `Invoice for Order #${order.orderNumber}`,
          html: invoiceHtml,
        });
      } catch (err) {
        console.error('Invoice email failed to send:', err);
      }

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
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret || secret === 'your_razorpay_webhook_secret') {
      return res.status(503).send('Webhook is not configured');
    }

    const signature = req.headers['x-razorpay-signature'] as string;
    const rawBody = (req as Request & { rawBody?: Buffer }).rawBody;
    if (!signature || !rawBody) {
      return res.status(400).send('Missing webhook signature or raw payload');
    }

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest();
    const receivedSignature = Buffer.from(signature, 'hex');

    if (receivedSignature.length !== expectedSignature.length || !crypto.timingSafeEqual(expectedSignature, receivedSignature)) {
      return res.status(400).send('Invalid signature');
    }

    const event = req.body.event;

    if (event === 'payment.captured' || event === 'order.paid') {
      const paymentEntity = req.body?.payload?.payment?.entity;
      const providerOrderId = paymentEntity?.order_id || req.body?.payload?.order?.entity?.id;
      if (!providerOrderId || !paymentEntity?.id) {
        return res.status(400).send('Webhook payment details are incomplete');
      }

      const order = await Order.findOne({ 'paymentInfo.razorpayOrderId': providerOrderId });
      if (!order) {
        return res.status(404).send('Order not found for provider payment');
      }

      if (paymentEntity.amount !== Math.round(order.pricing.total * 100) || paymentEntity.currency !== 'INR') {
        return res.status(400).send('Webhook payment amount or currency does not match the order');
      }

      if (order.paymentInfo.status === 'PENDING') {
        order.paymentInfo.status = 'COMPLETED';
        order.paymentInfo.razorpayPaymentId = paymentEntity.id;
        order.status = 'CONFIRMED';
        await order.save();
      }
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook Error:', error);
    res.status(500).send('Server Error');
  }
};
