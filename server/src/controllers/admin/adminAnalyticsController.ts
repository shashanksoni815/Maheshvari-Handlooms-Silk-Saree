import { Request, Response, NextFunction } from 'express';
import Order from '../../models/Order';
import Product from '../../models/Product';
import User from '../../models/User';
import { ApiResponse } from '../../utils/apiResponse';

const getAnalytics = async () => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const previousYear = currentYear - 1;
  const periodStart = new Date(previousYear, 0, 1);
  const paidOrders = {
    'paymentInfo.status': 'COMPLETED',
    isRefunded: { $ne: true },
    status: { $ne: 'CANCELLED' },
  };

  const [totalOrders, totalProducts, totalUsers, lowStockItems, revenue, recentOrders, monthlyRevenue, categorySales] = await Promise.all([
    Order.countDocuments(),
    Product.countDocuments({ status: { $ne: 'ARCHIVED' } }),
    User.countDocuments({ role: 'USER' }),
    Product.countDocuments({ status: 'PUBLISHED', stock: { $lte: 5 } }),
    Order.aggregate([
      { $match: paidOrders },
      { $group: { _id: null, total: { $sum: '$pricing.total' } } },
    ]),
    Order.find().populate('user', 'firstName lastName email').sort({ createdAt: -1 }).limit(5),
    Order.aggregate([
      { $match: { ...paidOrders, createdAt: { $gte: periodStart } } },
      { $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        total: { $sum: '$pricing.total' },
      } },
    ]),
    Order.aggregate([
      { $match: paidOrders },
      { $unwind: '$items' },
      { $lookup: { from: 'products', localField: 'items.product', foreignField: '_id', as: 'product' } },
      { $unwind: '$product' },
      { $lookup: { from: 'categories', localField: 'product.category', foreignField: '_id', as: 'category' } },
      { $unwind: '$category' },
      { $group: {
        _id: '$category.name',
        value: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
      } },
      { $sort: { value: -1 } },
      { $limit: 6 },
    ]),
  ]);

  const revenueLookup = new Map<string, number>();
  for (const entry of monthlyRevenue) {
    revenueLookup.set(`${entry._id.year}-${entry._id.month}`, entry.total);
  }

  const revenueByMonth = Array.from({ length: 12 }, (_, index) => {
    const month = index + 1;
    const name = new Date(currentYear, index, 1).toLocaleString('en', { month: 'short' });
    return {
      name,
      current: revenueLookup.get(`${currentYear}-${month}`) || 0,
      previous: revenueLookup.get(`${previousYear}-${month}`) || 0,
    };
  });

  return {
    totalRevenue: revenue[0]?.total || 0,
    totalOrders,
    totalProducts,
    totalUsers,
    lowStockItems,
    revenueByMonth,
    categorySales: categorySales.map((item: { _id: string; value: number }) => ({ name: item._id, value: item.value })),
    recentOrders,
  };
};

export const getAdminDashboard = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json(new ApiResponse('Dashboard data fetched', await getAnalytics()));
  } catch (error) {
    next(error);
  }
};

export const getAdminReports = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json(new ApiResponse('Reports data fetched', await getAnalytics()));
  } catch (error) {
    next(error);
  }
};
