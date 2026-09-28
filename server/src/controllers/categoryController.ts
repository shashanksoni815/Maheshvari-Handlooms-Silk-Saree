import { Request, Response, NextFunction } from 'express';
import Category from '../models/Category';
import Product from '../models/Product';
import { ApiError } from '../utils/apiError';
import { ApiResponse } from '../utils/apiResponse';

export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await Category.find().populate('parentCategory', 'name slug');
    res.status(200).json(new ApiResponse('Categories fetched successfully', categories));
  } catch (error) {
    next(error);
  }
};

export const getCategoryById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await Category.findById(req.params.id).populate('parentCategory', 'name slug');
    if (!category) {
      return next(new ApiError(404, 'Category not found'));
    }
    res.status(200).json(new ApiResponse('Category fetched successfully', category));
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.body.slug && req.body.name) {
      req.body.slug = req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    const category = await Category.create(req.body);
    res.status(201).json(new ApiResponse('Category created successfully', category));
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.body.slug && req.body.name) {
      req.body.slug = req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!category) {
      return next(new ApiError(404, 'Category not found'));
    }
    res.status(200).json(new ApiResponse('Category updated successfully', category));
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categoryId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!categoryId) return next(new ApiError(404, 'Category not found'));
    const productCount = await Product.countDocuments({ category: categoryId });
    if (productCount > 0) {
      return next(new ApiError(409, 'Cannot delete a category that is assigned to products'));
    }
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return next(new ApiError(404, 'Category not found'));
    }
    res.status(200).json(new ApiResponse('Category deleted successfully'));
  } catch (error) {
    next(error);
  }
};
