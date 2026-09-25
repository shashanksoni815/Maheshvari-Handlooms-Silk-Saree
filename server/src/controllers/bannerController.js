"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActiveBanners = void 0;
const Banner_1 = __importDefault(require("../models/Banner"));
const apiResponse_1 = require("../utils/apiResponse");
const getActiveBanners = async (req, res, next) => {
    try {
        const banners = await Banner_1.default.find({ isActive: true }).sort({ sortOrder: 1, createdAt: -1 });
        res.status(200).json(new apiResponse_1.ApiResponse('Active banners fetched', banners));
    }
    catch (error) {
        next(error);
    }
};
exports.getActiveBanners = getActiveBanners;
//# sourceMappingURL=bannerController.js.map