import { Request, Response, NextFunction } from 'express';
import Banner from '../models/Banner';
import { ApiResponse } from '../utils/apiResponse';

export const getActiveBanners = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const banners = await Banner.find({ isActive: true }).sort({ sortOrder: 1, createdAt: -1 });
    res.status(200).json(new ApiResponse('Active banners fetched', banners));
  } catch (error) {
    next(error);
  }
};
