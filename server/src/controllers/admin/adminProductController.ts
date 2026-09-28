import { Request, Response, NextFunction } from 'express';
import Product from '../../models/Product';
import { ApiError } from '../../utils/apiError';
import { ApiResponse } from '../../utils/apiResponse';

export const getAdminProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, page, limit, search } = req.query;
    const query: Record<string, unknown> = {};
    if (typeof status === 'string' && status) query.status = status;
    if (typeof search === 'string' && search.trim()) {
      const escapedSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.$or = [
        { name: { $regex: escapedSearch, $options: 'i' } },
        { sku: { $regex: escapedSearch, $options: 'i' } },
      ];
    }

    const pageNumber = Math.max(1, Number.parseInt(String(page || '1'), 10) || 1);
    const pageSize = Math.min(100, Math.max(1, Number.parseInt(String(limit || '50'), 10) || 50));
    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('category', 'name slug')
        .populate('collections', 'name slug')
        .sort({ updatedAt: -1 })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize),
      Product.countDocuments(query),
    ]);

    res.status(200).json(new ApiResponse('Admin products fetched', {
      products,
      pagination: { total, page: pageNumber, limit: pageSize, pages: Math.ceil(total / pageSize) },
    }));
  } catch (error) {
    next(error);
  }
};

export const getAdminProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug')
      .populate('collections', 'name slug');
    if (!product) return next(new ApiError(404, 'Product not found'));
    res.status(200).json(new ApiResponse('Admin product fetched', product));
  } catch (error) {
    next(error);
  }
};

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
    product.status = 'ARCHIVED';
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
