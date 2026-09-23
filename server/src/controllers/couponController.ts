import { Request, Response } from 'express';
import Coupon from '../models/Coupon';

// @desc    Get all coupons
// @route   GET /api/v1/coupons
// @access  Private/Admin
export const getCoupons = async (req: Request, res: Response) => {
  try {
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: coupons.length, data: coupons });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a coupon
// @route   POST /api/v1/coupons
// @access  Private/Admin
export const createCoupon = async (req: Request, res: Response) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ success: true, data: coupon });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a coupon
// @route   PUT /api/v1/coupons/:id
// @access  Private/Admin
export const updateCoupon = async (req: Request, res: Response) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }
    res.status(200).json({ success: true, data: coupon });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a coupon
// @route   DELETE /api/v1/coupons/:id
// @access  Private/Admin
export const deleteCoupon = async (req: Request, res: Response) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
