import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import Order from '../models/Order';
import Product from '../models/Product';
import mongoose from 'mongoose';
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
  const reserved: Array<{ productId: string; quantity: number }> = [];

  try {
    const { items, shippingAddress, paymentMethod, couponCode } = req.body;

    const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!razorpayKeyId || !razorpayKeySecret ||
      razorpayKeyId === 'rzp_test_your_key_id' ||
      razorpayKeySecret === 'your_razorpay_key_secret') {
      return next(new ApiError(503, 'Online payments are not configured'));
    }

    if (!Array.isArray(items) || items.length === 0) {
      return next(new ApiError(400, 'At least one order item is required'));
    }

    if (items.length > 50) {
      return next(new ApiError(400, 'An order cannot contain more than 50 line items'));
    }

    if (paymentMethod && paymentMethod !== 'RAZORPAY') {
      return next(new ApiError(400, 'Unsupported payment method'));
    }

    if (couponCode) {
      return next(new ApiError(400, 'Coupon codes are not currently available at checkout'));
    }

    const requiredAddressFields = ['fullName', 'phone', 'addressLine1', 'city', 'state', 'pincode'];
    if (!shippingAddress || requiredAddressFields.some(field => !String(shippingAddress[field] || '').trim())) {
      return next(new ApiError(400, 'A complete shipping address is required'));
    }

    // Ignore client-supplied names, images, prices and totals. Combine duplicate
    // product lines before validating and reserving stock.
    const quantities = new Map<string, number>();
    for (const item of items) {
      const productId = String(item?.product || '');
      const quantity = Number(item?.quantity);
      if (!mongoose.Types.ObjectId.isValid(productId) || !Number.isSafeInteger(quantity) || quantity < 1) {
        return next(new ApiError(400, 'Each item must have a valid product and positive whole-number quantity'));
      }
      quantities.set(productId, (quantities.get(productId) || 0) + quantity);
    }

    const productIds = [...quantities.keys()];
    const products = await Product.find({ _id: { $in: productIds }, status: 'PUBLISHED' });
    if (products.length !== productIds.length) {
      return next(new ApiError(400, 'One or more products are unavailable'));
    }

    const productsById = new Map(products.map(product => [product._id.toString(), product]));
    const orderItems = productIds.map(productId => {
      const product = productsById.get(productId)!;
      return {
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: quantities.get(productId)!,
        image: product.images.find(image => image.isPrimary)?.url || product.images[0]?.url,
      };
    });

    if (orderItems.some(item => !item.image)) {
      return next(new ApiError(400, 'One or more products do not have a purchasable image'));
    }

    const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = 0;
    const shipping = 0;
    const pricing = {
      subtotal,
      discount: 0,
      tax: 0,
      shipping: 0,
      total: Math.round(subtotal * 100) / 100,
    };

    // Reserve stock atomically. Any failure restores reservations made earlier
    // in this request so partial orders do not consume inventory.
    for (const item of orderItems) {
      const updated = await Product.findOneAndUpdate(
        { _id: item.product, status: 'PUBLISHED', stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { new: true }
      );
      if (!updated) {
        throw new ApiError(409, `Insufficient stock for ${item.name}`);
      }
      reserved.push({ productId: item.product.toString(), quantity: item.quantity });
    }

    const order = new Order({
      user: req.user._id,
      orderNumber: generateOrderNumber(),
      items: orderItems,
      shippingAddress: {
        fullName: String(shippingAddress.fullName).trim(),
        phone: String(shippingAddress.phone).trim(),
        addressLine1: String(shippingAddress.addressLine1).trim(),
        addressLine2: String(shippingAddress.addressLine2 || '').trim(),
        city: String(shippingAddress.city).trim(),
        state: String(shippingAddress.state).trim(),
        pincode: String(shippingAddress.pincode).trim(),
      },
      paymentInfo: {
        method: 'RAZORPAY',
        status: 'PENDING'
      },
      pricing,
    });

    const createdOrder = await order.save();

    res.status(201).json(new ApiResponse('Order created', createdOrder));
  } catch (error) {
    console.error('Create Order Error:', error);
    await Promise.all(reserved.map(({ productId, quantity }) =>
      Product.updateOne({ _id: productId }, { $inc: { stock: quantity } })
    ));
    next(error instanceof ApiError ? error : new ApiError(500, 'Error creating order'));
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
    const orderId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
      return next(new ApiError(404, 'Order not found'));
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return next(new ApiError(404, 'Order not found'));
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return next(new ApiError(403, 'Not authorized to cancel this order'));
    }

    if (!['PENDING', 'CONFIRMED', 'PROCESSING'].includes(order.status)) {
      return next(new ApiError(400, 'Order cannot be cancelled at this stage. Please contact support.'));
    }

    if (order.paymentInfo.status === 'COMPLETED') {
      return next(new ApiError(409, 'This paid order requires a provider-confirmed refund. Please contact support.'));
    }

    order.status = 'CANCELLED';

    const updatedOrder = await order.save();
    await Promise.all(order.items.map(item =>
      Product.updateOne({ _id: item.product }, { $inc: { stock: item.quantity } })
    ));

    res.status(200).json(new ApiResponse('Order cancelled successfully', updatedOrder));
  } catch (error) {
    console.error('Cancel Order Error:', error);
    next(new ApiError(500, 'Error cancelling order'));
  }
};
