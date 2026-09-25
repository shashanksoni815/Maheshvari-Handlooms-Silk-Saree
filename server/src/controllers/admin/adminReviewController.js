"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReview = exports.updateReviewStatus = exports.getReviews = void 0;
const Review_1 = __importDefault(require("../../models/Review"));
const apiError_1 = require("../../utils/apiError");
const apiResponse_1 = require("../../utils/apiResponse");
const getReviews = async (req, res, next) => {
    try {
        const reviews = await Review_1.default.find()
            .populate('user', 'firstName lastName email')
            .populate('product', 'name sku images')
            .sort({ createdAt: -1 });
        res.status(200).json(new apiResponse_1.ApiResponse('Reviews fetched', reviews));
    }
    catch (error) {
        next(error);
    }
};
exports.getReviews = getReviews;
const updateReviewStatus = async (req, res, next) => {
    try {
        const { isApproved } = req.body;
        const review = await Review_1.default.findByIdAndUpdate(req.params.id, { isApproved }, { new: true });
        if (!review) {
            return next(new apiError_1.ApiError(404, 'Review not found'));
        }
        res.status(200).json(new apiResponse_1.ApiResponse(`Review ${isApproved ? 'approved' : 'rejected'} successfully`, review));
    }
    catch (error) {
        next(error);
    }
};
exports.updateReviewStatus = updateReviewStatus;
const deleteReview = async (req, res, next) => {
    try {
        const review = await Review_1.default.findByIdAndDelete(req.params.id);
        if (!review) {
            return next(new apiError_1.ApiError(404, 'Review not found'));
        }
        res.status(200).json(new apiResponse_1.ApiResponse('Review deleted successfully', {}));
    }
    catch (error) {
        next(error);
    }
};
exports.deleteReview = deleteReview;
//# sourceMappingURL=adminReviewController.js.map