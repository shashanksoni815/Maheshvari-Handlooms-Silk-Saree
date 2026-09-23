import { Request, Response } from 'express';
import { Order } from '../models/Order';
import { AppError } from '../middleware/error';

// @desc    Create new order
// @route   POST /api/v1/orders
// @access  Private
export const createOrder = async (req: Request, res: Response) => {
  const {
    items,
    shippingAddress,
    paymentMethod,
    pricing
  } = req.body;

  if (items && items.length === 0) {
    throw new AppError('No order items', 400);
  } else {
    const order = new Order({
      user: req.user._id,
      items,
      shippingAddress,
      paymentMethod,
      ...pricing
    });

    const createdOrder = await order.save();

    res.status(201).json({
      success: true,
      data: createdOrder,
    });
  }
};

// @desc    Get order by ID
// @route   GET /api/v1/orders/:id
// @access  Private
export const getOrderById = async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'firstName lastName email'
  );

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  // Check if the order belongs to the user or if user is admin
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role === 'USER') {
    throw new AppError('Not authorized to access this order', 403);
  }

  res.status(200).json({
    success: true,
    data: order,
  });
};

// @desc    Get logged in user orders
// @route   GET /api/v1/orders/myorders
// @access  Private
export const getMyOrders = async (req: Request, res: Response) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders,
  });
};

// @desc    Get all orders
// @route   GET /api/v1/orders
// @access  Private/Admin
export const getOrders = async (req: Request, res: Response) => {
  const orders = await Order.find({}).populate('user', 'id firstName lastName').sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders,
  });
};

// @desc    Update order to delivered
// @route   PUT /api/v1/orders/:id/deliver
// @access  Private/Admin
export const updateOrderToDelivered = async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  order.isDelivered = true;
  order.deliveredAt = new Date();

  const updatedOrder = await order.save();

  res.status(200).json({
    success: true,
    data: updatedOrder,
  });
};

