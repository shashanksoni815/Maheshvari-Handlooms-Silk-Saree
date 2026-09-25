import { Request, Response, NextFunction } from 'express';
import User from '../../models/User';
import Order from '../../models/Order';
import { ApiError } from '../../utils/apiError';
import { ApiResponse } from '../../utils/apiResponse';

export const getCustomers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Only return users with role USER
    const customers = await User.find({ role: 'USER' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json(new ApiResponse('Customers fetched', customers));
  } catch (error) {
    next(error);
  }
};

export const getCustomerById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customer = await User.findById(req.params.id).select('-password');
    if (!customer) {
      return next(new ApiError(404, 'Customer not found'));
    }

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
    const customer = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select('-password');

    if (!customer) {
      return next(new ApiError(404, 'Customer not found'));
    }

    res.status(200).json(new ApiResponse('Customer status updated', customer));
  } catch (error) {
    next(error);
  }
};
