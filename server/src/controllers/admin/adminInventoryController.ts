import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth';
import Product from '../../models/Product';
import InventoryTransaction from '../../models/InventoryTransaction';
import mongoose from 'mongoose';
import { ApiError } from '../../utils/apiError';
import { ApiResponse } from '../../utils/apiResponse';

export const adjustInventory = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { productId, type, quantity, reason } = req.body;
    const adminId = req.user?._id;
    const quantityValue = Number(quantity);

    if (!productId || !type || !Number.isSafeInteger(quantityValue) || !String(reason || '').trim()) {
      return next(new ApiError(400, 'Please provide all required fields for inventory adjustment'));
    }

    if (!mongoose.Types.ObjectId.isValid(String(productId))) {
      return next(new ApiError(400, 'Invalid product ID'));
    }

    if (quantityValue <= 0) {
      return next(new ApiError(400, 'Quantity must be a positive whole number'));
    }

    const product = await Product.findById(productId);
    if (!product) {
      return next(new ApiError(404, 'Product not found'));
    }

    const beforeStock = product.stock;
    let afterStock = beforeStock;

    if (type === 'INCREASE') {
      afterStock = beforeStock + quantityValue;
    } else if (type === 'DECREASE') {
      afterStock = beforeStock - quantityValue;
      if (afterStock < 0) {
        return next(new ApiError(400, 'Cannot reduce stock below zero'));
      }
    } else if (type === 'SET') {
      afterStock = quantityValue;
    } else {
      return next(new ApiError(400, 'Invalid adjustment type'));
    }

    // Atomic update to prevent race conditions if possible
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: productId, stock: beforeStock }, // Ensure stock hasn't changed since we read it
      { stock: afterStock },
      { new: true }
    );

    if (!updatedProduct) {
      // If it fails, someone else updated it. Throw error and let client retry.
      return next(new ApiError(409, 'Concurrent update detected. Please try again.'));
    }

    // Create ledger entry
    await InventoryTransaction.create({
      product: productId,
      sku: product.sku,
      type,
      quantity: quantityValue,
      beforeStock,
      afterStock,
      reason: String(reason).trim(),
      admin: adminId
    });

    res.status(200).json(new ApiResponse('Inventory adjusted successfully', { currentStock: updatedProduct.stock }));
  } catch (error) {
    next(error);
  }
};

export const getInventoryHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.query;
    
    let filter: Record<string, unknown> = {};
    if (productId) {
      if (!mongoose.Types.ObjectId.isValid(String(productId))) {
        return next(new ApiError(400, 'Invalid product ID'));
      }
      filter = { product: productId };
    }

    const history = await InventoryTransaction.find(filter)
      .populate('admin', 'firstName lastName email')
      .populate('order', 'orderNumber')
      .sort({ createdAt: -1 })
      .limit(100);

    res.status(200).json(new ApiResponse('Inventory history fetched', history));
  } catch (error) {
    next(error);
  }
};
