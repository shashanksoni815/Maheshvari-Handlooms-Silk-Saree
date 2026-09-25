"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInventoryHistory = exports.adjustInventory = void 0;
const Product_1 = __importDefault(require("../../models/Product"));
const InventoryTransaction_1 = __importDefault(require("../../models/InventoryTransaction"));
const apiError_1 = require("../../utils/apiError");
const apiResponse_1 = require("../../utils/apiResponse");
const adjustInventory = async (req, res, next) => {
    try {
        const { productId, sku, type, quantity, reason } = req.body;
        const adminId = req.user?._id;
        if (!productId || !type || !quantity || !reason) {
            return next(new apiError_1.ApiError(400, 'Please provide all required fields for inventory adjustment'));
        }
        if (quantity <= 0) {
            return next(new apiError_1.ApiError(400, 'Quantity must be greater than zero'));
        }
        const product = await Product_1.default.findById(productId);
        if (!product) {
            return next(new apiError_1.ApiError(404, 'Product not found'));
        }
        const beforeStock = product.stock;
        let afterStock = beforeStock;
        if (type === 'INCREASE') {
            afterStock = beforeStock + quantity;
        }
        else if (type === 'DECREASE') {
            afterStock = beforeStock - quantity;
            if (afterStock < 0) {
                return next(new apiError_1.ApiError(400, 'Cannot reduce stock below zero'));
            }
        }
        else if (type === 'SET') {
            afterStock = quantity;
        }
        else {
            return next(new apiError_1.ApiError(400, 'Invalid adjustment type'));
        }
        // Atomic update to prevent race conditions if possible
        const updatedProduct = await Product_1.default.findOneAndUpdate({ _id: productId, stock: beforeStock }, // Ensure stock hasn't changed since we read it
        { stock: afterStock }, { new: true });
        if (!updatedProduct) {
            // If it fails, someone else updated it. Throw error and let client retry.
            return next(new apiError_1.ApiError(409, 'Concurrent update detected. Please try again.'));
        }
        // Create ledger entry
        await InventoryTransaction_1.default.create({
            product: productId,
            sku: product.sku,
            type,
            quantity,
            beforeStock,
            afterStock,
            reason,
            admin: adminId
        });
        res.status(200).json(new apiResponse_1.ApiResponse('Inventory adjusted successfully', { currentStock: updatedProduct.stock }));
    }
    catch (error) {
        next(error);
    }
};
exports.adjustInventory = adjustInventory;
const getInventoryHistory = async (req, res, next) => {
    try {
        const { productId } = req.query;
        let filter = {};
        if (productId) {
            filter = { product: productId };
        }
        const history = await InventoryTransaction_1.default.find(filter)
            .populate('admin', 'firstName lastName email')
            .populate('order', 'orderNumber')
            .sort({ createdAt: -1 })
            .limit(100);
        res.status(200).json(new apiResponse_1.ApiResponse('Inventory history fetched', history));
    }
    catch (error) {
        next(error);
    }
};
exports.getInventoryHistory = getInventoryHistory;
//# sourceMappingURL=adminInventoryController.js.map