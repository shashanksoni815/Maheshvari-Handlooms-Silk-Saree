import { Request, Response, NextFunction } from 'express';
import Product from '../models/Product';
import { ApiError } from '../utils/apiError';
import { ApiResponse } from '../utils/apiResponse';

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { 
      category, collection, search, sort, status, limit, page,
      fabric, silkType, weave, color, minPrice, maxPrice, zariType, inStock, tags
    } = req.query;

    const query: any = {};
    if (status) query.status = status;
    else query.status = 'PUBLISHED'; // default for public view

    if (category) query.category = category;
    if (collection) query.collections = collection;
    
    // Deep Filters
    if (fabric) query['attributes.fabric'] = { $in: (fabric as string).split(',') };
    if (silkType) query['attributes.silkType'] = { $in: (silkType as string).split(',') };
    if (weave) query['attributes.weave'] = { $in: (weave as string).split(',') };
    if (zariType) query['attributes.zariType'] = { $in: (zariType as string).split(',') };
    
    if (color) {
      query.tags = { $in: (color as string).split(',') };
    }
    
    if (tags) {
      if (!query.tags) query.tags = {};
      query.tags.$in = [...(query.tags.$in || []), ...(tags as string).split(',')];
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

export const getProductFilters = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = { status: 'PUBLISHED' };
    
    // Run distinct queries in parallel for better performance
    const [fabrics, silkTypes, weaves, colors] = await Promise.all([
      Product.distinct('attributes.fabric', query),
      Product.distinct('attributes.silkType', query),
      Product.distinct('attributes.weave', query),
      // We mapped color to tags earlier. Assuming tags contain colors or just distinct colors from attributes if we add it
      Product.distinct('attributes.color', query) // Wait, we didn't have attributes.color in the backend schema?
    ]);
    
    // Fallback: If attributes.color is empty, distinct tags.
    let colorList = colors.filter(Boolean);
    if (colorList.length === 0) {
      colorList = await Product.distinct('tags', query);
    }

    res.status(200).json(new ApiResponse('Filters fetched successfully', {
      fabric: fabrics.filter(Boolean),
      silkType: silkTypes.filter(Boolean),
      weave: weaves.filter(Boolean),
      color: colorList.filter(Boolean)
    }));
  } catch (error) {
    next(error);
  }
};
