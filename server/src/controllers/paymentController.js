"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.razorpayWebhook = exports.verifyPayment = exports.createRazorpayOrder = void 0;
// @ts-ignore
const razorpay_1 = __importDefault(require("razorpay"));
const crypto_1 = __importDefault(require("crypto"));
const Order_1 = __importDefault(require("../models/Order"));
const apiError_1 = require("../utils/apiError");
const apiResponse_1 = require("../utils/apiResponse");
const emailService_1 = __importDefault(require("../utils/emailService"));
const razorpay = new razorpay_1.default({
    key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key_id',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret',
});
// @desc    Create Razorpay Order
// @route   POST /api/v1/payments/create-order/:orderId
// @access  Private
const createRazorpayOrder = async (req, res, next) => {
    try {
        const order = await Order_1.default.findById(req.params.orderId);
        if (!order) {
            return next(new apiError_1.ApiError(404, 'Order not found'));
        }
        // Check authorization
        if (order.user.toString() !== req.user._id.toString()) {
            return next(new apiError_1.ApiError(403, 'Not authorized'));
        }
        const options = {
            amount: Math.round(order.pricing.total * 100), // Amount in smallest currency unit (paise)
            currency: 'INR',
            receipt: `receipt_order_${order._id}`,
        };
        let razorpayOrder;
        if (process.env.RAZORPAY_KEY_ID === 'rzp_test_your_key_id' || !process.env.RAZORPAY_KEY_ID) {
            razorpayOrder = {
                id: `mock_order_${Date.now()}`,
                amount: options.amount,
                currency: options.currency,
                receipt: options.receipt,
                status: 'created'
            };
        }
        else {
            razorpayOrder = await razorpay.orders.create(options);
        }
        res.status(200).json(new apiResponse_1.ApiResponse('Razorpay order created', razorpayOrder));
    }
    catch (error) {
        console.error('Razorpay Error:', error);
        next(new apiError_1.ApiError(500, 'Error creating Razorpay order'));
    }
};
exports.createRazorpayOrder = createRazorpayOrder;
// @desc    Verify Razorpay Payment
// @route   POST /api/v1/payments/verify
// @access  Private
const verifyPayment = async (req, res, next) => {
    try {
        const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = req.body;
        const order = await Order_1.default.findById(orderId).populate('user', 'email firstName');
        if (!order) {
            return next(new apiError_1.ApiError(404, 'Order not found'));
        }
        // Create signature for verification
        const secret = process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret';
        let isSignatureValid = false;
        if (process.env.RAZORPAY_KEY_ID === 'rzp_test_your_key_id' || !process.env.RAZORPAY_KEY_ID) {
            if (razorpaySignature === 'mock_signature') {
                isSignatureValid = true;
            }
        }
        else {
            const generatedSignature = crypto_1.default
                .createHmac('sha256', secret)
                .update(`${razorpayOrderId}|${razorpayPaymentId}`)
                .digest('hex');
            isSignatureValid = generatedSignature === razorpaySignature;
        }
        if (isSignatureValid) {
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
            <p>Dear ${order.user.firstName},</p>
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
                await (0, emailService_1.default)({
                    email: order.user.email,
                    subject: `Invoice for Order #${order.orderNumber}`,
                    html: invoiceHtml,
                });
            }
            catch (err) {
                console.error('Invoice email failed to send:', err);
            }
            res.status(200).json(new apiResponse_1.ApiResponse('Payment verified successfully', updatedOrder));
        }
        else {
            return next(new apiError_1.ApiError(400, 'Payment verification failed: Invalid signature'));
        }
    }
    catch (error) {
        console.error('Payment Verify Error:', error);
        next(new apiError_1.ApiError(500, 'Error verifying payment'));
    }
};
exports.verifyPayment = verifyPayment;
// @desc    Razorpay Webhook (Direct & Secure Server-to-Server Payment Completion)
// @route   POST /api/v1/payments/webhook
// @access  Public
const razorpayWebhook = async (req, res, next) => {
    try {
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'dummy_webhook_secret';
        const signature = req.headers['x-razorpay-signature'];
        const bodyStr = JSON.stringify(req.body);
        const expectedSignature = crypto_1.default
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
                const order = await Order_1.default.findById(dbOrderId);
                if (order && order.paymentInfo.status !== 'COMPLETED') {
                    order.paymentInfo.status = 'COMPLETED';
                    order.paymentInfo.razorpayPaymentId = paymentEntity.id;
                    order.status = 'CONFIRMED';
                    await order.save();
                }
            }
        }
        res.status(200).send('OK');
    }
    catch (error) {
        console.error('Webhook Error:', error);
        res.status(500).send('Server Error');
    }
};
exports.razorpayWebhook = razorpayWebhook;
//# sourceMappingURL=paymentController.js.map