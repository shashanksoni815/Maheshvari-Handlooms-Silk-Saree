import { Request, Response, NextFunction } from 'express';
import Product from '../models/Product';
import { ApiError } from '../utils/apiError';
import { ApiResponse } from '../utils/apiResponse';

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { 
      category, collection, search, sort, status, limit, page,
      fabric, silkType, weave, color, minPrice, maxPrice, zariType, inStock
    } = req.query;

    const query: any = {};
    if (status) query.status = status;
    else query.status = 'PUBLISHED'; // default for public view

    if (category) query.category = category;
    if (collection) query.collections = collection;
    
    // Deep Filters
    if (fabric) query['attributes.fabric'] = fabric;
    if (silkType) query['attributes.silkType'] = silkType;
    if (weave) query['attributes.weave'] = weave;
    if (zariType) query['attributes.zariType'] = zariType;
    
    if (color) {
      // Assuming color might be a tag or an attribute in the future. We'll search tags for now.
      query.tags = { $in: [color] };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    
    if (inStock === 'true') {
      query.stock = { $gt: 0 };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
      ];
    }

    const sortOptions: any = {};
    if (sort === 'newest') sortOptions.createdAt = -1;
    else if (sort === 'price_asc') sortOptions.price = 1;
    else if (sort === 'price_desc') sortOptions.price = -1;
    else sortOptions.createdAt = -1; // default

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 12;
    const skip = (pageNum - 1) * limitNum;

    const products = await Product.find(query)
      .populate('category', 'name slug')
      .populate('collections', 'name slug')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    const total = await Product.countDocuments(query);

    res.status(200).json(
      new ApiResponse('Products fetched successfully', {
        products,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          pages: Math.ceil(total / limitNum),
        },
      })
    );
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug')
      .populate('collections', 'name slug');
    if (!product) {
      return next(new ApiError(404, 'Product not found'));
    }
    res.status(200).json(new ApiResponse('Product fetched successfully', product));
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(new ApiResponse('Product created successfully', product));
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
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

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return next(new ApiError(404, 'Product not found'));
    }
    res.status(200).json(new ApiResponse('Product deleted successfully'));
  } catch (error) {
    next(error);
  }
};
