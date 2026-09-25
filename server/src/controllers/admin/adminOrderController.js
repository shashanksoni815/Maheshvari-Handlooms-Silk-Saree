"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.issueRefund = exports.updateOrderStatus = exports.getAdminOrderById = exports.getAdminOrders = void 0;
const Order_1 = __importDefault(require("../../models/Order"));
const apiError_1 = require("../../utils/apiError");
const apiResponse_1 = require("../../utils/apiResponse");
const getAdminOrders = async (req, res, next) => {
    try {
        const orders = await Order_1.default.find()
            .populate('user', 'firstName lastName email')
            .sort({ createdAt: -1 });
        res.status(200).json(new apiResponse_1.ApiResponse('Orders fetched', orders));
    }
    catch (error) {
        next(error);
    }
};
exports.getAdminOrders = getAdminOrders;
const getAdminOrderById = async (req, res, next) => {
    try {
        const order = await Order_1.default.findById(req.params.id)
            .populate('user', 'firstName lastName email')
            .populate('items.product', 'name sku images price');
        if (!order) {
            return next(new apiError_1.ApiError(404, 'Order not found'));
        }
        res.status(200).json(new apiResponse_1.ApiResponse('Order fetched', order));
    }
    catch (error) {
        next(error);
    }
};
exports.getAdminOrderById = getAdminOrderById;
const updateOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body; // Pending, Processing, Shipped, Delivered, Cancelled
        // Validate status against allowed enum here if needed (e.g., in a real prod app)
        const allowedStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
        if (!allowedStatuses.includes(status)) {
            return next(new apiError_1.ApiError(400, 'Invalid status'));
        }
        const order = await Order_1.default.findById(req.params.id);
        if (!order) {
            return next(new apiError_1.ApiError(404, 'Order not found'));
        }
        // We update the order status
        // Map legacy 'Shipped', 'Delivered', etc to uppercase equivalent if needed, but assuming frontend sends correct casing or we just force it.
        const normalizedStatus = status.toUpperCase();
        const validStatuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];
        if (!validStatuses.includes(normalizedStatus)) {
            return next(new apiError_1.ApiError(400, 'Invalid status'));
        }
        // We update the order status
        order.status = normalizedStatus;
        await order.save();
        res.status(200).json(new apiResponse_1.ApiResponse('Order status updated', order));
    }
    catch (error) {
        next(error);
    }
};
exports.updateOrderStatus = updateOrderStatus;
const issueRefund = async (req, res, next) => {
    try {
        const { amount, reason } = req.body;
        const order = await Order_1.default.findById(req.params.id);
        if (!order) {
            return next(new apiError_1.ApiError(404, 'Order not found'));
        }
        if (order.paymentInfo?.status !== 'COMPLETED') {
            return next(new apiError_1.ApiError(400, 'Cannot refund an unpaid order'));
        }
        // In a real app, integrate with Stripe / Razorpay API here.
        // e.g. await razorpay.payments.refund(order.paymentResult.id, { amount: amount * 100 })
        order.isRefunded = true;
        order.refundDetails = {
            amount,
            reason,
            refundedAt: new Date(),
            refundedBy: req.user?._id
        };
        await order.save();
        res.status(200).json(new apiResponse_1.ApiResponse('Refund issued successfully', order));
    }
    catch (error) {
        next(error);
    }
};
exports.issueRefund = issueRefund;
//# sourceMappingURL=adminOrderController.js.map