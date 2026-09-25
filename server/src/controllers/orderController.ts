import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import Order from '../models/Order';
import { ApiError } from '../utils/apiError';
import { ApiResponse } from '../utils/apiResponse';

// Helper to generate order number
const generateOrderNumber = () => {
  return 'MHS-' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
};

// @desc    Create new order
// @route   POST /api/v1/orders
// @access  Private
export const createOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
      pricing,
      couponCode,
    } = req.body;

    if (!items || items.length === 0) {
      return next(new ApiError(400, 'No order items'));
    }

    const order = new Order({
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

    res.status(201).json(new ApiResponse('Order created', createdOrder));
  } catch (error) {
    console.error('Create Order Error:', error);
    next(new ApiError(500, 'Error creating order'));
  }
};

// @desc    Get order by ID
// @route   GET /api/v1/orders/:id
// @access  Private
export const getOrderById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'firstName lastName email'
    );

    if (!order) {
      return next(new ApiError(404, 'Order not found'));
    }

    // Check if the order belongs to the user or if user is admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role === 'USER') {
      return next(new ApiError(403, 'Not authorized to access this order'));
    }

    res.status(200).json(new ApiResponse('Order fetched', order));
  } catch (error) {
    console.error('Get Order Error:', error);
    next(new ApiError(500, 'Error fetching order'));
  }
};

// @desc    Get logged in user orders
// @route   GET /api/v1/orders/myorders
// @access  Private
export const getMyOrders = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error('Get My Orders Error:', error);
    next(new ApiError(500, 'Error fetching your orders'));
  }
};

// @desc    Get all orders
// @route   GET /api/v1/orders
// @access  Private/Admin
export const getOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await Order.find({}).populate('user', 'id firstName lastName').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error('Get Orders Error:', error);
    next(new ApiError(500, 'Error fetching all orders'));
  }
};

// @desc    Update order to delivered
// @route   PUT /api/v1/orders/:id/deliver
// @access  Private/Admin
export const updateOrderToDelivered = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new ApiError(404, 'Order not found'));
    }

    order.status = 'DELIVERED';
    order.trackingInfo = order.trackingInfo || {};
    
    const updatedOrder = await order.save();

    res.status(200).json(new ApiResponse('Order delivered', updatedOrder));
  } catch (error) {
    console.error('Update Order Error:', error);
    next(new ApiError(500, 'Error updating order'));
  }
};

// @desc    Cancel order (by user)
// @route   PUT /api/v1/orders/:id/cancel
// @access  Private
export const cancelOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new ApiError(404, 'Order not found'));
    }

    if (order.user._id.toString() !== req.user._id.toString()) {
      return next(new ApiError(403, 'Not authorized to cancel this order'));
    }

    if (!['PENDING', 'CONFIRMED', 'PROCESSING'].includes(order.status)) {
      return next(new ApiError(400, 'Order cannot be cancelled at this stage. Please contact support.'));
    }

    order.status = 'CANCELLED';
    
    if (order.paymentInfo.status === 'COMPLETED') {
      order.isRefunded = true;
      order.paymentInfo.status = 'REFUNDED';
      order.refundDetails = {
        amount: order.pricing.total,
        reason: 'User cancelled order',
        refundedAt: new Date(),
        refundedBy: req.user._id as any,
      };
    }

    const updatedOrder = await order.save();

    res.status(200).json(new ApiResponse('Order cancelled successfully', updatedOrder));
  } catch (error) {
    console.error('Cancel Order Error:', error);
    next(new ApiError(500, 'Error cancelling order'));
  }
};
