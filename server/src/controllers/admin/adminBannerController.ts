import { Request, Response, NextFunction } from 'express';
import Banner from '../../models/Banner';
import { ApiError } from '../../utils/apiError';
import { ApiResponse } from '../../utils/apiResponse';

export const getBanners = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const banners = await Banner.find().sort({ position: 1, sortOrder: 1 });
    res.status(200).json(new ApiResponse('Banners fetched', banners));
  } catch (error) {
    next(error);
  }
};

export const createBanner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const banner = await Banner.create(req.body);
    res.status(201).json(new ApiResponse('Banner created successfully', banner));
  } catch (error) {
    next(error);
  }
};

export const updateBanner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!banner) return next(new ApiError(404, 'Banner not found'));
    res.status(200).json(new ApiResponse('Banner updated', banner));
  } catch (error) {
    next(error);
  }
};

export const deleteBanner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) return next(new ApiError(404, 'Banner not found'));
    res.status(200).json(new ApiResponse('Banner deleted', {}));
  } catch (error) {
    next(error);
  }
};
