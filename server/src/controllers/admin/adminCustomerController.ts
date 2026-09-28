import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import User from '../../models/User';
import Order from '../../models/Order';
import { ApiError } from '../../utils/apiError';
import { ApiResponse } from '../../utils/apiResponse';

export const getCustomers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Math.max(1, Number.parseInt(String(req.query.page || '1'), 10) || 1);
    const limit = Math.min(100, Math.max(1, Number.parseInt(String(req.query.limit || '50'), 10) || 50));
    const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
    const filter: Record<string, unknown> = { role: 'USER' };
    if (search) {
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [
        { firstName: { $regex: escaped, $options: 'i' } },
        { lastName: { $regex: escaped, $options: 'i' } },
        { email: { $regex: escaped, $options: 'i' } },
      ];
    }
    const [customers, total] = await Promise.all([
      User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
      User.countDocuments(filter),
    ]);

    res.status(200).json(new ApiResponse('Customers fetched', { customers, pagination: { total, page, limit, pages: Math.ceil(total / limit) } }));
  } catch (error) {
    next(error);
  }
};

export const getCustomerById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customerId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!customerId || !mongoose.Types.ObjectId.isValid(customerId)) return next(new ApiError(404, 'Customer not found'));
    const customer = await User.findById(customerId).select('-password');
    if (!customer) {
      return next(new ApiError(404, 'Customer not found'));
    }
    if (customer.role !== 'USER') return next(new ApiError(404, 'Customer not found'));

    // Also fetch their recent orders
    const orders = await Order.find({ user: customer._id }).sort({ createdAt: -1 }).limit(10);
    
    // Total spent
    const allOrders = await Order.find({ user: customer._id, 'paymentInfo.status': 'COMPLETED' });
    const totalSpent = allOrders.reduce((acc, curr) => acc + (curr.pricing?.total || 0), 0);

    res.status(200).json(new ApiResponse('Customer fetched', { customer, orders, stats: { totalSpent, orderCount: allOrders.length } }));
  } catch (error) {
    next(error);
  }
};

export const updateCustomerStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { isActive } = req.body;
    const customerId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!customerId || !mongoose.Types.ObjectId.isValid(customerId)) return next(new ApiError(404, 'Customer not found'));
    if (typeof isActive !== 'boolean') {
      return next(new ApiError(400, 'isActive must be a boolean'));
    }
    const existing = await User.findById(customerId);
    if (!existing || existing.role !== 'USER') return next(new ApiError(404, 'Customer not found'));
    existing.isActive = isActive;
    await existing.save();
    const customer = await User.findById(customerId).select('-password');

    if (!customer) {
      return next(new ApiError(404, 'Customer not found'));
    }

    res.status(200).json(new ApiResponse('Customer status updated', customer));
  } catch (error) {
    next(error);
  }
};
