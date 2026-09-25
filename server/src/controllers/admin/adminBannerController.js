"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBanner = exports.updateBanner = exports.createBanner = exports.getBanners = void 0;
const Banner_1 = __importDefault(require("../../models/Banner"));
const apiError_1 = require("../../utils/apiError");
const apiResponse_1 = require("../../utils/apiResponse");
const getBanners = async (req, res, next) => {
    try {
        const banners = await Banner_1.default.find().sort({ position: 1, sortOrder: 1 });
        res.status(200).json(new apiResponse_1.ApiResponse('Banners fetched', banners));
    }
    catch (error) {
        next(error);
    }
};
exports.getBanners = getBanners;
const createBanner = async (req, res, next) => {
    try {
        const banner = await Banner_1.default.create(req.body);
        res.status(201).json(new apiResponse_1.ApiResponse('Banner created successfully', banner));
    }
    catch (error) {
        next(error);
    }
};
exports.createBanner = createBanner;
const updateBanner = async (req, res, next) => {
    try {
        const banner = await Banner_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!banner)
            return next(new apiError_1.ApiError(404, 'Banner not found'));
        res.status(200).json(new apiResponse_1.ApiResponse('Banner updated', banner));
    }
    catch (error) {
        next(error);
    }
};
exports.updateBanner = updateBanner;
const deleteBanner = async (req, res, next) => {
    try {
        const banner = await Banner_1.default.findByIdAndDelete(req.params.id);
        if (!banner)
            return next(new apiError_1.ApiError(404, 'Banner not found'));
        res.status(200).json(new apiResponse_1.ApiResponse('Banner deleted', {}));
    }
    catch (error) {
        next(error);
    }
};
exports.deleteBanner = deleteBanner;
//# sourceMappingURL=adminBannerController.js.map