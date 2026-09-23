import { Request, Response, NextFunction } from 'express';
import Review from '../models/Review';
import Product from '../models/Product';
import { ApiError } from '../utils/apiError';
import { ApiResponse } from '../utils/apiResponse';
import mongoose from 'mongoose';

// @desc    Add review to product
// @route   POST /api/v1/products/:productId/reviews
// @access  Private
export const createProductReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { rating, title, description, images } = req.body;
    const productId = req.params.productId;

    const product = await Product.findById(productId);
    if (!product) return next(new ApiError(404, 'Product not found'));

    // Check if user already reviewed
    const existingReview = await Review.findOne({
      product: productId as any,
      user: (req as any).user._id
    });

    if (existingReview) {
      return next(new ApiError(400, 'You have already reviewed this product'));
    }

    // TODO: Verify if the user actually purchased the product by checking Orders
    // For now, assume false unless we implement the check
    const isVerifiedPurchase = false; 

    const review = await Review.create({
      product: productId as any,
      user: (req as any).user._id,
      rating: Number(rating),
      title,
      description,
      images,
      isVerifiedPurchase,
      isApproved: true // Auto approve for now
    });

    // Recalculate product average rating
    const allReviews = await Review.find({ product: productId as any, isApproved: true });
    
    product.rating.count = allReviews.length;
    product.rating.average = allReviews.reduce((acc, item: any) => item.rating + acc, 0) / allReviews.length;
    
    await product.save();

    res.status(201).json(new ApiResponse('Review added successfully', review));
  } catch (error) {
    next(error);
  }
};

// @desc    Get product reviews
// @route   GET /api/v1/products/:productId/reviews
// @access  Public
export const getProductReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = req.params.productId;
    
    const reviews = await Review.find({ product: productId as any, isApproved: true })
      .populate('user', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.status(200).json(new ApiResponse('Reviews fetched successfully', reviews));
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a review (Admin)
// @route   DELETE /api/v1/products/:productId/reviews/:reviewId
// @access  Private/Admin
export const deleteReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) return next(new ApiError(404, 'Review not found'));

    await review.deleteOne();

    // Recalculate
    const productId = review.product;
    const product = await Product.findById(productId);
    
    if (product) {
      const allReviews = await Review.find({ product: productId, isApproved: true });
      product.rating.count = allReviews.length;
      product.rating.average = allReviews.length > 0 
        ? allReviews.reduce((acc, item) => item.rating + acc, 0) / allReviews.length
        : 0;
      await product.save();
    }

    res.status(200).json(new ApiResponse('Review deleted successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Update review status (approve/reject)
// @route   PUT /api/v1/products/:productId/reviews/:reviewId/status
// @access  Private/Admin
export const updateReviewStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { isApproved } = req.body;
    
    const review = await Review.findByIdAndUpdate(
      req.params.reviewId,
      { isApproved },
      { new: true, runValidators: true }
    );
    
    if (!review) return next(new ApiError(404, 'Review not found'));

    // Recalculate
    const productId = review.product;
    const product = await Product.findById(productId);
    
    if (product) {
      const allReviews = await Review.find({ product: productId, isApproved: true });
      product.rating.count = allReviews.length;
      product.rating.average = allReviews.length > 0 
        ? allReviews.reduce((acc, item) => item.rating + acc, 0) / allReviews.length
        : 0;
      await product.save();
    }

    res.status(200).json(new ApiResponse('Review status updated successfully', review));
  } catch (error) {
    next(error);
  }
};
