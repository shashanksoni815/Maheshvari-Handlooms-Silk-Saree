import { Request, Response, NextFunction } from 'express';
// @ts-ignore
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/Order';
import { AuthRequest } from '../middleware/auth';
import { ApiError } from '../utils/apiError';
import { ApiResponse } from '../utils/apiResponse';
import sendEmail from '../utils/emailService';

const cleanEnvVal = (val?: string) => {
  if (!val) return '';
  return val.trim().replace(/^['"]|['"]$/g, '');
};

const getKeyId = () => {
  const envKey = cleanEnvVal(process.env.RAZORPAY_KEY_ID);
  return envKey === 'rzp_test_your_key_id' ? '' : envKey;
};

const getKeySecret = () => {
  const envSecret = cleanEnvVal(process.env.RAZORPAY_KEY_SECRET);
  return envSecret === 'your_razorpay_key_secret' ? '' : envSecret;
};

const isRazorpayConfigured = () => {
  return Boolean(getKeyId() && getKeySecret());
};

const getRazorpayClient = () => {
  const keyId = getKeyId();
  const keySecret = getKeySecret();

  let RazorpayConstructor = Razorpay;
  if (typeof RazorpayConstructor !== 'function') {
    RazorpayConstructor = (Razorpay as any).default || (Razorpay as any).Razorpay || Razorpay;
  }
  if (typeof RazorpayConstructor !== 'function' && typeof (RazorpayConstructor as any).default === 'function') {
    RazorpayConstructor = (RazorpayConstructor as any).default;
  }

  try {
    return new (RazorpayConstructor as any)({
      key_id: keyId,
      key_secret: keySecret,
    });
  } catch (error: any) {
    console.error('Failed to initialize Razorpay SDK:', error);
    throw new ApiError(503, `Razorpay Initialization Error: ${error.message || 'Check credentials'}`);
  }
};

// @desc    Create Razorpay Order
// @route   POST /api/v1/payments/create-order OR POST /api/v1/payments/create-order/:orderId
// @access  Private
export const createRazorpayOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!isRazorpayConfigured()) {
      return next(new ApiError(503, 'Online payments are not configured'));
    }

    const orderId = req.params.orderId || req.body.orderId || req.body.order_id;
    if (!orderId) {
      return next(new ApiError(400, 'Order ID is required'));
    }

    const order = await Order.findOne({ _id: orderId, user: req.user?._id });
    if (!order) {
      return next(new ApiError(404, 'Order not found'));
    }

    if (order.paymentInfo.status !== 'PENDING') {
      return next(new ApiError(409, 'This order is not awaiting payment'));
    }

    const amountInPaise = Math.round(Number(order.pricing?.total ?? order.pricing?.subtotal) * 100);
    if (!Number.isSafeInteger(amountInPaise) || amountInPaise < 100) {
      return next(new ApiError(400, 'Order amount must be at least 100 paise (₹1)'));
    }

    if (order.paymentInfo.razorpayOrderId) {
      return res.status(200).json(new ApiResponse('Razorpay order already created', {
        order_id: order.paymentInfo.razorpayOrderId,
        id: order.paymentInfo.razorpayOrderId,
        amount: amountInPaise,
        currency: 'INR',
      }));
    }

    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `rcpt_${order._id}`.slice(0, 40),
    };

    const razorpay = getRazorpayClient();
    if (!razorpay || !razorpay.orders || typeof razorpay.orders.create !== 'function') {
      throw new ApiError(500, 'Razorpay SDK instance is unavailable');
    }

    let razorpayOrder: any;
    try {
      razorpayOrder = await razorpay.orders.create(options);
    } catch (error: any) {
      console.error('Razorpay provider order creation failed:', error);
      const providerStatus = Number(error.statusCode || error.status);
      const message = providerStatus === 401 || providerStatus === 403
        ? 'Razorpay authentication failed. Verify the server-side key ID and secret match in Vercel, then redeploy.'
        : error.error?.description || error.description || 'Razorpay could not create the payment order.';
      return next(new ApiError(502, message));
    }

    if (!razorpayOrder || (!razorpayOrder.id && !(razorpayOrder as any).order_id)) {
      throw new ApiError(500, 'Razorpay provider failed to return valid order details');
    }

    const rzpId = razorpayOrder.id || (razorpayOrder as any).order_id;
    const rzpAmount = razorpayOrder.amount || amountInPaise;
    const rzpCurrency = razorpayOrder.currency || 'INR';

    order.paymentInfo.razorpayOrderId = rzpId;
    await order.save();

    res.status(200).json(new ApiResponse('Razorpay order created successfully', {
      order_id: rzpId,
      id: rzpId,
      amount: rzpAmount,
      currency: rzpCurrency,
      receipt: razorpayOrder.receipt || options.receipt,
      data: razorpayOrder,
    }));
  } catch (error: any) {
    console.error('Razorpay Order Creation Error:', error);
    const statusCode = error.statusCode || error.status || (typeof error.statusCode === 'number' ? error.statusCode : 500);
    const message = error.error?.description || error.description || error.message || 'Error creating Razorpay order';
    next(new ApiError(statusCode, message));
  }
};

// @desc    Verify Razorpay Payment Signature
// @route   POST /api/v1/payments/verify OR POST /api/v1/payments/verify-payment
// @access  Private
export const verifyPayment = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const razorpay_order_id = req.body.razorpay_order_id || req.body.razorpayOrderId;
    const razorpay_payment_id = req.body.razorpay_payment_id || req.body.razorpayPaymentId;
    const razorpay_signature = req.body.razorpay_signature || req.body.razorpaySignature;
    const orderId = req.body.orderId || req.body.order_id;

    if (!req.user || !orderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return next(new ApiError(400, 'Payment verification details are incomplete (razorpay_order_id, razorpay_payment_id, and razorpay_signature are required)'));
    }

    const secret = getKeySecret();
    if (!secret || !isRazorpayConfigured()) {
      return next(new ApiError(503, 'Online payments are not configured'));
    }

    // Algorithm: HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const receivedSignature = /^[a-f\d]{64}$/i.test(razorpay_signature)
      ? Buffer.from(razorpay_signature, 'hex')
      : Buffer.alloc(0);
    const isSignatureValid = receivedSignature.length === 32 && crypto.timingSafeEqual(
      Buffer.from(generatedSignature, 'hex'),
      receivedSignature
    );

    if (!isSignatureValid) {
      return next(new ApiError(400, 'Payment verification failed: Signature mismatch'));
    }

    const order = await Order.findOne({
      _id: orderId,
      user: req.user._id,
      'paymentInfo.razorpayOrderId': razorpay_order_id,
    }).populate('user', 'email firstName');

    if (!order) {
      return next(new ApiError(404, 'Order not found for this payment'));
    }

    if (order.paymentInfo.status === 'COMPLETED') {
      if (order.paymentInfo.razorpayPaymentId !== razorpay_payment_id) {
        return next(new ApiError(409, 'This order has already been paid with a different payment'));
      }
      return res.status(200).json(new ApiResponse('Payment already verified', {
        success: true,
        order,
        razorpay_order_id,
        razorpay_payment_id,
      }));
    }

    if (order.paymentInfo.status !== 'PENDING') {
      return next(new ApiError(409, 'This order is not awaiting payment'));
    }

    const razorpay = getRazorpayClient();
    const payment = await razorpay.payments.fetch(razorpay_payment_id);
    if (
      payment.order_id !== razorpay_order_id ||
      payment.status !== 'captured' ||
      payment.amount !== Math.round(order.pricing.total * 100) ||
      payment.currency !== 'INR'
    ) {
      return next(new ApiError(409, 'Payment is not captured for this order amount'));
    }

    const updatedOrder = await Order.findOneAndUpdate(
      {
        _id: order._id,
        user: req.user._id,
        'paymentInfo.razorpayOrderId': razorpay_order_id,
        'paymentInfo.status': 'PENDING',
      },
      {
        $set: {
          'paymentInfo.status': 'COMPLETED',
          'paymentInfo.razorpayPaymentId': razorpay_payment_id,
          'paymentInfo.razorpaySignature': razorpay_signature,
          status: 'CONFIRMED',
        },
      },
      { new: true }
    ).populate('user', 'email firstName');

    if (!updatedOrder) {
      const currentOrder = await Order.findOne({ _id: order._id, user: req.user._id })
        .populate('user', 'email firstName');
      if (currentOrder?.paymentInfo.status === 'COMPLETED' && currentOrder.paymentInfo.razorpayPaymentId === razorpay_payment_id) {
        return res.status(200).json(new ApiResponse('Payment already verified', {
          success: true,
          order: currentOrder,
          razorpay_order_id,
          razorpay_payment_id,
        }));
      }
      return next(new ApiError(409, 'Order payment status changed; refresh the order and try again'));
    }

      // Send Invoice Email
      if (updatedOrder.user && (updatedOrder.user as any).email) {
        try {
          const invoiceHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
              <h2 style="color: #063F35;">Payment Successful!</h2>
              <p>Dear ${(updatedOrder.user as any).firstName},</p>
              <p>Thank you for your purchase from Maheshwari Handloom Silk Saree. Your payment for Order <strong>#${updatedOrder.orderNumber}</strong> has been successfully processed.</p>
              
              <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5d8bf;">
                <h3 style="margin-top: 0; border-bottom: 1px solid #ddd; padding-bottom: 10px; color: #063F35;">Order Summary</h3>
                <p><strong>Total Amount:</strong> ₹${updatedOrder.pricing.total.toLocaleString('en-IN')}</p>
                <p><strong>Payment Method:</strong> Razorpay</p>
                <p><strong>Payment Status:</strong> COMPLETED</p>
                <p><strong>Transaction ID:</strong> ${razorpay_payment_id}</p>
              </div>
              
              <p>We are now preparing your handwoven saree and will notify you once it's shipped.</p>
              <p>Best Regards,<br/>Maheshwari Handloom Silk Saree Team</p>
            </div>
          `;
          await sendEmail({
            email: (updatedOrder.user as any).email,
            subject: `Invoice for Order #${updatedOrder.orderNumber}`,
            html: invoiceHtml,
          });
        } catch (err) {
          console.error('Invoice email notification error:', err);
        }
      }

    res.status(200).json(new ApiResponse('Payment verified successfully', {
      success: true,
      message: 'Payment verified successfully',
      razorpay_order_id,
      razorpay_payment_id,
      order: updatedOrder,
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
