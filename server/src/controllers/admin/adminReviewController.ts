import { Request, Response, NextFunction } from 'express';
import Review from '../../models/Review';
import { ApiError } from '../../utils/apiError';
import { ApiResponse } from '../../utils/apiResponse';

export const getReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reviews = await Review.find()
      .populate('user', 'firstName lastName email')
      .populate('product', 'name sku images')
      .sort({ createdAt: -1 });

    res.status(200).json(new ApiResponse('Reviews fetched', reviews));
  } catch (error) {
    next(error);
  }
};

export const updateReviewStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { isApproved } = req.body;
    
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isApproved },
      { new: true }
    );

    if (!review) {
      return next(new ApiError(404, 'Review not found'));
    }

    res.status(200).json(new ApiResponse(`Review ${isApproved ? 'approved' : 'rejected'} successfully`, review));
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return next(new ApiError(404, 'Review not found'));
    }

    res.status(200).json(new ApiResponse('Review deleted successfully', {}));
  } catch (error) {
    next(error);
  }
};
