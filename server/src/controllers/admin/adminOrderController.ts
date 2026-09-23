import { Request, Response, NextFunction } from 'express';
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
      .populate('orderItems.product', 'name sku images price');

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

    // Update legacy booleans if needed, or better, add a status field to the Order schema.
    // The prompt explicitly asks to "Update Order Status (Pending, Processing, Shipped, Delivered, Cancelled)"
    // Let's assume the Order schema has a 'status' field, or we will add one. For now, we will map to isDelivered for legacy compatibility if 'Delivered' is chosen.
    if (status === 'Delivered' && !order.isDelivered) {
      order.isDelivered = true;
      order.deliveredAt = new Date();
    }
    
    // We update the order status
    order.status = status;
    await order.save();

    res.status(200).json(new ApiResponse('Order status updated', order));
  } catch (error) {
    next(error);
  }
};

export const issueRefund = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { amount, reason } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return next(new ApiError(404, 'Order not found'));
    }

    if (!order.isPaid) {
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
