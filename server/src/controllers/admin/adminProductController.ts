import { Request, Response, NextFunction } from 'express';
import Product from '../../models/Product';
import { ApiError } from '../../utils/apiError';
import { ApiResponse } from '../../utils/apiResponse';

export const createAdminProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(new ApiResponse('Product created successfully', product));
  } catch (error) {
    next(error);
  }
};

export const updateAdminProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return next(new ApiError(404, 'Product not found'));
    }

    res.status(200).json(new ApiResponse('Product updated successfully', product));
  } catch (error) {
    next(error);
  }
};

export const deleteAdminProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ApiError(404, 'Product not found'));
    }

    // Use soft delete by setting status to archived, or just remove if that's safe.
    // The prompt says: "Do NOT blindly hard-delete products that have historical orders. Use Archive / Soft Delete"
    // Since we don't know yet if there are orders, let's just mark it as archived for safety.
    product.status = 'archived';
    await product.save();

    res.status(200).json(new ApiResponse('Product archived successfully', {}));
  } catch (error) {
    next(error);
  }
};

export const bulkUpdateProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productIds, updateData } = req.body;
    
    if (!Array.isArray(productIds) || productIds.length === 0) {
      return next(new ApiError(400, 'Please provide an array of product IDs'));
    }

    await Product.updateMany(
      { _id: { $in: productIds } },
      { $set: updateData }
    );

    res.status(200).json(new ApiResponse('Products bulk updated successfully', {}));
  } catch (error) {
    next(error);
  }
};
