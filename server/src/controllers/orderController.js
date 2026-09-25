"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelOrder = exports.updateOrderToDelivered = exports.getOrders = exports.getMyOrders = exports.getOrderById = exports.createOrder = void 0;
const Order_1 = __importDefault(require("../models/Order"));
const apiError_1 = require("../utils/apiError");
const apiResponse_1 = require("../utils/apiResponse");
// Helper to generate order number
const generateOrderNumber = () => {
    return 'MHS-' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
};
// @desc    Create new order
// @route   POST /api/v1/orders
// @access  Private
const createOrder = async (req, res, next) => {
    try {
        const { items, shippingAddress, paymentMethod, pricing, couponCode, } = req.body;
        if (!items || items.length === 0) {
            return next(new apiError_1.ApiError(400, 'No order items'));
        }
        const order = new Order_1.default({
            user: req.user._id,
            orderNumber: generateOrderNumber(),
            items,
            shippingAddress,
            paymentInfo: {
                method: paymentMethod || 'RAZORPAY',
                status: 'PENDING'
            },
            pricing,
        });
        const createdOrder = await order.save();
        res.status(201).json(new apiResponse_1.ApiResponse('Order created', createdOrder));
    }
    catch (error) {
        console.error('Create Order Error:', error);
        next(new apiError_1.ApiError(500, 'Error creating order'));
    }
};
exports.createOrder = createOrder;
// @desc    Get order by ID
// @route   GET /api/v1/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
    try {
        const order = await Order_1.default.findById(req.params.id).populate('user', 'firstName lastName email');
        if (!order) {
            return next(new apiError_1.ApiError(404, 'Order not found'));
        }
        // Check if the order belongs to the user or if user is admin
        if (order.user._id.toString() !== req.user._id.toString() && req.user.role === 'USER') {
            return next(new apiError_1.ApiError(403, 'Not authorized to access this order'));
        }
        res.status(200).json(new apiResponse_1.ApiResponse('Order fetched', order));
    }
    catch (error) {
        console.error('Get Order Error:', error);
        next(new apiError_1.ApiError(500, 'Error fetching order'));
    }
};
exports.getOrderById = getOrderById;
// @desc    Get logged in user orders
// @route   GET /api/v1/orders/myorders
// @access  Private
const getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order_1.default.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders,
        });
    }
    catch (error) {
        console.error('Get My Orders Error:', error);
        next(new apiError_1.ApiError(500, 'Error fetching your orders'));
    }
};
exports.getMyOrders = getMyOrders;
// @desc    Get all orders
// @route   GET /api/v1/orders
// @access  Private/Admin
const getOrders = async (req, res, next) => {
    try {
        const orders = await Order_1.default.find({}).populate('user', 'id firstName lastName').sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders,
        });
    }
    catch (error) {
        console.error('Get Orders Error:', error);
        next(new apiError_1.ApiError(500, 'Error fetching all orders'));
    }
};
exports.getOrders = getOrders;
// @desc    Update order to delivered
// @route   PUT /api/v1/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = async (req, res, next) => {
    try {
        const order = await Order_1.default.findById(req.params.id);
        if (!order) {
            return next(new apiError_1.ApiError(404, 'Order not found'));
        }
        order.status = 'DELIVERED';
        order.trackingInfo = order.trackingInfo || {};
        const updatedOrder = await order.save();
        res.status(200).json(new apiResponse_1.ApiResponse('Order delivered', updatedOrder));
    }
    catch (error) {
        console.error('Update Order Error:', error);
        next(new apiError_1.ApiError(500, 'Error updating order'));
    }
};
exports.updateOrderToDelivered = updateOrderToDelivered;
// @desc    Cancel order (by user)
// @route   PUT /api/v1/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res, next) => {
    try {
        const order = await Order_1.default.findById(req.params.id);
        if (!order) {
            return next(new apiError_1.ApiError(404, 'Order not found'));
        }
        if (order.user._id.toString() !== req.user._id.toString()) {
            return next(new apiError_1.ApiError(403, 'Not authorized to cancel this order'));
        }
        if (!['PENDING', 'CONFIRMED', 'PROCESSING'].includes(order.status)) {
            return next(new apiError_1.ApiError(400, 'Order cannot be cancelled at this stage. Please contact support.'));
        }
        order.status = 'CANCELLED';
        if (order.paymentInfo.status === 'COMPLETED') {
            order.isRefunded = true;
            order.paymentInfo.status = 'REFUNDED';
            order.refundDetails = {
                amount: order.pricing.total,
                reason: 'User cancelled order',
                refundedAt: new Date(),
                refundedBy: req.user._id,
            };
        }
        const updatedOrder = await order.save();
        res.status(200).json(new apiResponse_1.ApiResponse('Order cancelled successfully', updatedOrder));
    }
    catch (error) {
        console.error('Cancel Order Error:', error);
        next(new apiError_1.ApiError(500, 'Error cancelling order'));
    }
};
exports.cancelOrder = cancelOrder;
//# sourceMappingURL=orderController.js.map