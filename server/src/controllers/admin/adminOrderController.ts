import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth';
import Order from '../../models/Order';
import User from '../../models/User';
import mongoose from 'mongoose';
// @ts-ignore
import Razorpay from 'razorpay';
import { ApiError } from '../../utils/apiError';
import { ApiResponse } from '../../utils/apiResponse';

export const getAdminOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Math.max(1, Number.parseInt(String(req.query.page || '1'), 10) || 1);
    const limit = Math.min(100, Math.max(1, Number.parseInt(String(req.query.limit || '50'), 10) || 50));
    const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
    const filter: Record<string, unknown> = {};
    if (search) {
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const users = await User.find({ role: 'USER', $or: [
        { firstName: { $regex: escaped, $options: 'i' } },
        { lastName: { $regex: escaped, $options: 'i' } },
        { email: { $regex: escaped, $options: 'i' } },
      ] }).select('_id');
      const searchConditions: Record<string, unknown>[] = [
        { orderNumber: { $regex: escaped, $options: 'i' } },
        { user: { $in: users.map(user => user._id) } },
      ];
      if (mongoose.Types.ObjectId.isValid(search)) searchConditions.push({ _id: search });
      filter.$or = searchConditions;
    }
    const [orders, total] = await Promise.all([
      Order.find(filter)
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
      Order.countDocuments(filter),
    ]);
    res.status(200).json(new ApiResponse('Orders fetched', { orders, pagination: { total, page, limit, pages: Math.ceil(total / limit) } }));
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

export const updateOrderStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const status = typeof req.body.status === 'string' ? req.body.status.toUpperCase() : '';

    const order = await Order.findById(req.params.id);
    if (!order) {
      return next(new ApiError(404, 'Order not found'));
    }

    const validStatuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return next(new ApiError(400, 'Invalid status'));
    }

    if (status === 'CANCELLED' && order.paymentInfo.status === 'COMPLETED' && !order.isRefunded) {
      return next(new ApiError(409, 'Refund the paid order through the payment provider before cancelling it'));
    }

    if (order.status !== status) {
      order.status = status as typeof order.status;
      if (status === 'SHIPPED' && !order.trackingInfo?.shippedAt) {
        order.trackingInfo = { ...order.trackingInfo, shippedAt: new Date() };
      }
      order.adminUpdates.push({
        type: 'STATUS',
        status: order.status,
        updatedBy: req.user._id,
        updatedAt: new Date(),
      });
    }
    await order.save();

    res.status(200).json(new ApiResponse('Order status updated', order));
  } catch (error) {
    next(error);
  }
};

export const updateOrderTracking = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { courier, trackingId, trackingUrl, expectedDelivery } = req.body;
    if (trackingUrl && !/^https?:\/\//i.test(String(trackingUrl))) {
      return next(new ApiError(400, 'Tracking URL must be an http or https URL'));
    }
    const expectedDate = expectedDelivery ? new Date(expectedDelivery) : undefined;
    if (expectedDate && Number.isNaN(expectedDate.getTime())) {
      return next(new ApiError(400, 'Expected delivery must be a valid date'));
    }

    const order = await Order.findById(req.params.id);
    if (!order) return next(new ApiError(404, 'Order not found'));
    order.trackingInfo = {
      ...order.trackingInfo,
      courier: String(courier || '').trim(),
      trackingId: String(trackingId || '').trim(),
      trackingUrl: String(trackingUrl || '').trim(),
      ...(expectedDate ? { expectedDelivery: expectedDate } : {}),
      ...(order.status === 'SHIPPED' && !order.trackingInfo?.shippedAt ? { shippedAt: new Date() } : {}),
    };
    order.adminUpdates.push({
      type: 'TRACKING',
      trackingInfo: {
        courier: order.trackingInfo.courier || '',
        trackingId: order.trackingInfo.trackingId || '',
        trackingUrl: order.trackingInfo.trackingUrl || '',
        ...(order.trackingInfo.expectedDelivery ? { expectedDelivery: order.trackingInfo.expectedDelivery } : {}),
      },
      updatedBy: req.user?._id,
      updatedAt: new Date(),
    });
    await order.save();
    res.status(200).json(new ApiResponse('Order tracking updated', order));
  } catch (error) {
    next(error);
  }
};

export const issueRefund = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { amount, reason } = req.body;

    if (!Number.isFinite(Number(amount)) || Number(amount) <= 0 || !String(reason || '').trim()) {
      return next(new ApiError(400, 'A positive refund amount and reason are required'));
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret || keyId === 'rzp_test_your_key_id' || keySecret === 'your_razorpay_key_secret') {
      return next(new ApiError(503, 'Payment refunds are not configured'));
    }
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return next(new ApiError(404, 'Order not found'));
    }

    if (order.paymentInfo?.status !== 'COMPLETED') {
      return next(new ApiError(400, 'Cannot refund an unpaid order'));
    }

    if (order.isRefunded || !order.paymentInfo.razorpayPaymentId) {
      return next(new ApiError(409, 'This order is already refunded or has no provider payment reference'));
    }

    const refundAmount = Math.round(Number(amount) * 100) / 100;
    if (Math.round(refundAmount * 100) !== Math.round(order.pricing.total * 100)) {
      return next(new ApiError(400, 'Only full-order refunds are supported'));
    }

    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const providerRefund = await razorpay.payments.refund(order.paymentInfo.razorpayPaymentId, {
      amount: Math.round(refundAmount * 100),
    });

    order.isRefunded = true;
    order.paymentInfo.status = 'REFUNDED';
    order.refundDetails = {
      amount: refundAmount,
      reason: String(reason).trim(),
      refundedAt: new Date(),
      refundedBy: req.user?._id,
      providerRefundId: providerRefund.id,
    };
    order.adminUpdates.push({
      type: 'REFUND',
      refundInfo: { amount: refundAmount, reason: String(reason).trim() },
      updatedBy: req.user?._id,
      updatedAt: new Date(),
    });
    
    await order.save();

    res.status(200).json(new ApiResponse('Refund issued successfully', order));
  } catch (error) {
    next(error);
  }
};
