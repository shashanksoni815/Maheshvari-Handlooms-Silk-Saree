"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkUpdateProducts = exports.deleteAdminProduct = exports.updateAdminProduct = exports.createAdminProduct = void 0;
const Product_1 = __importDefault(require("../../models/Product"));
const apiError_1 = require("../../utils/apiError");
const apiResponse_1 = require("../../utils/apiResponse");
const createAdminProduct = async (req, res, next) => {
    try {
        const product = await Product_1.default.create(req.body);
        res.status(201).json(new apiResponse_1.ApiResponse('Product created successfully', product));
    }
    catch (error) {
        next(error);
    }
};
exports.createAdminProduct = createAdminProduct;
const updateAdminProduct = async (req, res, next) => {
    try {
        const product = await Product_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!product) {
            return next(new apiError_1.ApiError(404, 'Product not found'));
        }
        res.status(200).json(new apiResponse_1.ApiResponse('Product updated successfully', product));
    }
    catch (error) {
        next(error);
    }
};
exports.updateAdminProduct = updateAdminProduct;
const deleteAdminProduct = async (req, res, next) => {
    try {
        const product = await Product_1.default.findById(req.params.id);
        if (!product) {
            return next(new apiError_1.ApiError(404, 'Product not found'));
        }
        // Use soft delete by setting status to archived, or just remove if that's safe.
        // The prompt says: "Do NOT blindly hard-delete products that have historical orders. Use Archive / Soft Delete"
        // Since we don't know yet if there are orders, let's just mark it as archived for safety.
        product.status = 'ARCHIVED';
        await product.save();
        res.status(200).json(new apiResponse_1.ApiResponse('Product archived successfully', {}));
    }
    catch (error) {
        next(error);
    }
};
exports.deleteAdminProduct = deleteAdminProduct;
const bulkUpdateProducts = async (req, res, next) => {
    try {
        const { productIds, updateData } = req.body;
        if (!Array.isArray(productIds) || productIds.length === 0) {
            return next(new apiError_1.ApiError(400, 'Please provide an array of product IDs'));
        }
        await Product_1.default.updateMany({ _id: { $in: productIds } }, { $set: updateData });
        res.status(200).json(new apiResponse_1.ApiResponse('Products bulk updated successfully', {}));
    }
    catch (error) {
        next(error);
    }
};
exports.bulkUpdateProducts = bulkUpdateProducts;
//# sourceMappingURL=adminProductController.js.map