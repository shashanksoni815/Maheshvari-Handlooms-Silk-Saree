import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth';
import Order from '../../models/Order';
import { ApiError } from '../../utils/apiError';
import { ApiResponse } from '../../utils/apiResponse';

export const getAdminOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await Order.find()
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 });
    res.status(200).json(new ApiResponse('Orders fetched', orders));
  } catch (error) {
    next(error);
  }
};

export const getAdminOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'firstName lastName email')
      .populate('items.product', 'name sku images price');

    if (!order) {
      return next(new ApiError(404, 'Order not found'));
    }

    res.status(200).json(new ApiResponse('Order fetched', order));
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.body; // Pending, Processing, Shipped, Delivered, Cancelled
    
    // Validate status against allowed enum here if needed (e.g., in a real prod app)
    const allowedStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!allowedStatuses.includes(status)) {
      return next(new ApiError(400, 'Invalid status'));
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return next(new ApiError(404, 'Order not found'));
    }

    // We update the order status
    // Map legacy 'Shipped', 'Delivered', etc to uppercase equivalent if needed, but assuming frontend sends correct casing or we just force it.
    const normalizedStatus = status.toUpperCase();
    const validStatuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(normalizedStatus)) {
      return next(new ApiError(400, 'Invalid status'));
    }
    
    // We update the order status
    order.status = normalizedStatus as any;
    await order.save();

    res.status(200).json(new ApiResponse('Order status updated', order));
  } catch (error) {
    next(error);
  }
};

export const issueRefund = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { amount, reason } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return next(new ApiError(404, 'Order not found'));
    }

    if (order.paymentInfo?.status !== 'COMPLETED') {
      return next(new ApiError(400, 'Cannot refund an unpaid order'));
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

    res.status(200).json(new ApiResponse('Refund issued successfully', order));
  } catch (error) {
    next(error);
  }
};
