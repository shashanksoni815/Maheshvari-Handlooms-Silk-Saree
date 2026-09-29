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
// @route   POST /api/create-order OR POST /api/v1/payments/create-order OR POST /api/v1/payments/create-order/:orderId
// @access  Private
export const createRazorpayOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!isRazorpayConfigured()) {
      return next(new ApiError(503, 'Online payments are not configured'));
    }

    const orderIdParam = req.params.orderId || req.body.orderId || req.body.order_id;
    let amountInPaise: number | null = null;
    let currency = req.body.currency || 'INR';
    let receipt = req.body.receipt || `receipt_${Date.now()}`;
    let order: any = null;

    if (orderIdParam) {
      order = await Order.findById(orderIdParam);

      if (!order) {
        return next(new ApiError(404, 'Order not found'));
      }

      // Check authorization
      const userId = (req as any).user?._id;
      if (userId && order.user.toString() !== userId.toString()) {
        return next(new ApiError(403, 'Not authorized for this order'));
      }

      if (order.paymentInfo.status !== 'PENDING') {
        return next(new ApiError(409, 'This order is not awaiting payment'));
      }

      amountInPaise = Math.round(order.pricing.total * 100);
      receipt = `receipt_order_${order._id}`;

      if (order.paymentInfo.razorpayOrderId) {
        return res.status(200).json(new ApiResponse('Razorpay order already created', {
          order_id: order.paymentInfo.razorpayOrderId,
          id: order.paymentInfo.razorpayOrderId,
          amount: amountInPaise,
          currency: 'INR',
        }));
      }
    } else if (req.body.amount) {
      amountInPaise = Math.round(Number(req.body.amount));
    }

    if (!amountInPaise || isNaN(amountInPaise)) {
      return next(new ApiError(400, 'Amount is required and must be a valid number'));
    }

    // Minimum amount validation: 100 paise (₹1)
    if (amountInPaise < 100) {
      return next(new ApiError(400, 'Minimum order amount must be at least 100 paise (₹1)'));
    }

    const options = {
      amount: amountInPaise,
      currency: currency,
      receipt: receipt,
    };

    const razorpay = getRazorpayClient();
    const razorpayOrder = await razorpay.orders.create(options);

    if (order) {
      order.paymentInfo.razorpayOrderId = razorpayOrder.id;
      await order.save();
    }

    res.status(200).json(new ApiResponse('Razorpay order created successfully', {
      order_id: razorpayOrder.id,
      id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      receipt: razorpayOrder.receipt,
      data: razorpayOrder,
    }));
  } catch (error: any) {
    console.error('Razorpay Order Creation Error:', error);
    if (error.statusCode === 401 || error?.error?.code === 'BAD_REQUEST_ERROR') {
      return next(new ApiError(401, error.message || 'Razorpay authentication failed'));
    }
    next(new ApiError(500, error.message || 'Error creating Razorpay order'));
  }
};

// @desc    Verify Razorpay Payment Signature
// @route   POST /api/verify-payment OR POST /api/v1/payments/verify OR POST /api/v1/payments/verify-payment
// @access  Private
export const verifyPayment = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const razorpay_order_id = req.body.razorpay_order_id || req.body.razorpayOrderId;
    const razorpay_payment_id = req.body.razorpay_payment_id || req.body.razorpayPaymentId;
    const razorpay_signature = req.body.razorpay_signature || req.body.razorpaySignature;
    const orderId = req.body.orderId || req.body.order_id;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return next(new ApiError(400, 'Payment verification details are incomplete (razorpay_order_id, razorpay_payment_id, and razorpay_signature are required)'));
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret || !isRazorpayConfigured()) {
      return next(new ApiError(503, 'Online payments are not configured'));
    }

    // Algorithm: HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const isSignatureValid = generatedSignature === razorpay_signature;

    if (!isSignatureValid) {
      return next(new ApiError(400, 'Payment verification failed: Signature mismatch'));
    }

    // If orderId or razorpay_order_id is in DB, update order state
    let updatedOrder: any = null;
    const searchId = orderId || null;
    const query = searchId 
      ? { _id: searchId } 
      : { 'paymentInfo.razorpayOrderId': razorpay_order_id };

    const order = await Order.findOne(query).populate('user', 'email firstName');

    if (order) {
      if (order.paymentInfo.status === 'COMPLETED') {
        return res.status(200).json(new ApiResponse('Payment already verified', {
          success: true,
          order,
          razorpay_order_id,
          razorpay_payment_id,
        }));
      }

      order.paymentInfo.status = 'COMPLETED';
      order.paymentInfo.razorpayPaymentId = razorpay_payment_id;
      order.paymentInfo.razorpaySignature = razorpay_signature;
      order.status = 'CONFIRMED';
      updatedOrder = await order.save();

      // Send Invoice Email
      if (order.user && (order.user as any).email) {
        try {
          const invoiceHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
              <h2 style="color: #063F35;">Payment Successful!</h2>
              <p>Dear ${(order.user as any).firstName},</p>
              <p>Thank you for your purchase from Maheshwari Handloom Silk Saree. Your payment for Order <strong>#${order.orderNumber}</strong> has been successfully processed.</p>
              
              <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5d8bf;">
                <h3 style="margin-top: 0; border-bottom: 1px solid #ddd; padding-bottom: 10px; color: #063F35;">Order Summary</h3>
                <p><strong>Total Amount:</strong> ₹${order.pricing.total.toLocaleString('en-IN')}</p>
                <p><strong>Payment Method:</strong> Razorpay</p>
                <p><strong>Payment Status:</strong> COMPLETED</p>
                <p><strong>Transaction ID:</strong> ${razorpay_payment_id}</p>
              </div>
              
              <p>We are now preparing your handwoven saree and will notify you once it's shipped.</p>
              <p>Best Regards,<br/>Maheshwari Handloom Silk Saree Team</p>
            </div>
          `;
          await sendEmail({
            email: (order.user as any).email,
            subject: `Invoice for Order #${order.orderNumber}`,
            html: invoiceHtml,
          });
        } catch (err) {
          console.error('Invoice email notification error:', err);
        }
      }
    }

    res.status(200).json(new ApiResponse('Payment verified successfully', {
      success: true,
      message: 'Payment verified successfully',
      razorpay_order_id,
      razorpay_payment_id,
      order: updatedOrder || order,
    }));
  } catch (error: any) {
    console.error('Payment Verification Error:', error);
    next(new ApiError(500, error.message || 'Error verifying payment'));
  }
};

// @desc    Razorpay Webhook (Direct Server-to-Server Verification)
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
      .digest('hex');

    if (signature !== expectedSignature) {
      return res.status(400).send('Invalid webhook signature');
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
        return res.status(400).send('Webhook payment amount or currency does not match order');
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
