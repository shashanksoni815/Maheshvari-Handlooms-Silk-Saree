"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReviewStatus = exports.deleteReview = exports.getProductReviews = exports.createProductReview = void 0;
const Review_1 = __importDefault(require("../models/Review"));
const Product_1 = __importDefault(require("../models/Product"));
const apiError_1 = require("../utils/apiError");
const apiResponse_1 = require("../utils/apiResponse");
// @desc    Add review to product
// @route   POST /api/v1/products/:productId/reviews
// @access  Private
const createProductReview = async (req, res, next) => {
    try {
        const { rating, title, description, images } = req.body;
        const productId = req.params.productId;
        const product = await Product_1.default.findById(productId);
        if (!product)
            return next(new apiError_1.ApiError(404, 'Product not found'));
        // Check if user already reviewed
        const existingReview = await Review_1.default.findOne({
            product: productId,
            user: req.user._id
        });
        if (existingReview) {
            return next(new apiError_1.ApiError(400, 'You have already reviewed this product'));
        }
        // TODO: Verify if the user actually purchased the product by checking Orders
        // For now, assume false unless we implement the check
        const isVerifiedPurchase = false;
        const review = await Review_1.default.create({
            product: productId,
            user: req.user._id,
            rating: Number(rating),
            title,
            description,
            images,
            isVerifiedPurchase,
            isApproved: true // Auto approve for now
        });
        // Recalculate product average rating
        const allReviews = await Review_1.default.find({ product: productId, isApproved: true });
        product.rating.count = allReviews.length;
        product.rating.average = allReviews.reduce((acc, item) => item.rating + acc, 0) / allReviews.length;
        await product.save();
        res.status(201).json(new apiResponse_1.ApiResponse('Review added successfully', review));
    }
    catch (error) {
        next(error);
    }
};
exports.createProductReview = createProductReview;
// @desc    Get product reviews
// @route   GET /api/v1/products/:productId/reviews
// @access  Public
const getProductReviews = async (req, res, next) => {
    try {
        const productId = req.params.productId;
        const reviews = await Review_1.default.find({ product: productId, isApproved: true })
            .populate('user', 'firstName lastName')
            .sort({ createdAt: -1 });
        res.status(200).json(new apiResponse_1.ApiResponse('Reviews fetched successfully', reviews));
    }
    catch (error) {
        next(error);
    }
};
exports.getProductReviews = getProductReviews;
// @desc    Delete a review (Admin)
// @route   DELETE /api/v1/products/:productId/reviews/:reviewId
// @access  Private/Admin
const deleteReview = async (req, res, next) => {
    try {
        const review = await Review_1.default.findById(req.params.reviewId);
        if (!review)
            return next(new apiError_1.ApiError(404, 'Review not found'));
        await review.deleteOne();
        // Recalculate
        const productId = review.product;
        const product = await Product_1.default.findById(productId);
        if (product) {
            const allReviews = await Review_1.default.find({ product: productId, isApproved: true });
            product.rating.count = allReviews.length;
            product.rating.average = allReviews.length > 0
                ? allReviews.reduce((acc, item) => item.rating + acc, 0) / allReviews.length
                : 0;
            await product.save();
        }
        res.status(200).json(new apiResponse_1.ApiResponse('Review deleted successfully'));
    }
    catch (error) {
        next(error);
    }
};
exports.deleteReview = deleteReview;
// @desc    Update review status (approve/reject)
// @route   PUT /api/v1/products/:productId/reviews/:reviewId/status
// @access  Private/Admin
const updateReviewStatus = async (req, res, next) => {
    try {
        const { isApproved } = req.body;
        const review = await Review_1.default.findByIdAndUpdate(req.params.reviewId, { isApproved }, { new: true, runValidators: true });
        if (!review)
            return next(new apiError_1.ApiError(404, 'Review not found'));
        // Recalculate
        const productId = review.product;
        const product = await Product_1.default.findById(productId);
        if (product) {
            const allReviews = await Review_1.default.find({ product: productId, isApproved: true });
            product.rating.count = allReviews.length;
            product.rating.average = allReviews.length > 0
                ? allReviews.reduce((acc, item) => item.rating + acc, 0) / allReviews.length
                : 0;
            await product.save();
        }
        res.status(200).json(new apiResponse_1.ApiResponse('Review status updated successfully', review));
    }
    catch (error) {
        next(error);
    }
};
exports.updateReviewStatus = updateReviewStatus;
//# sourceMappingURL=reviewController.js.map