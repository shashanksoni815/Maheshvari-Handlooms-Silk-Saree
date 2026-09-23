import { Request, Response, NextFunction } from 'express';
import Collection from '../models/Collection';
import { ApiError } from '../utils/apiError';
import { ApiResponse } from '../utils/apiResponse';

export const getCollections = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { isActive, isFeatured } = req.query;
    const query: any = {};
    
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (isFeatured !== undefined) query.isFeatured = isFeatured === 'true';

    const collections = await Collection.find(query).sort({ order: 1, createdAt: -1 });
    
    res.status(200).json(new ApiResponse('Collections fetched successfully', collections));
  } catch (error) {
    next(error);
  }
};

export const getCollectionBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const collection = await Collection.findOne({ slug: req.params.slug as any, isActive: true });
    
    if (!collection) {
      return next(new ApiError(404, 'Collection not found'));
    }
    
    res.status(200).json(new ApiResponse('Collection fetched successfully', collection));
  } catch (error) {
    next(error);
  }
};

export const getCollectionById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const collection = await Collection.findById(req.params.id);
    
    if (!collection) {
      return next(new ApiError(404, 'Collection not found'));
    }
    
    res.status(200).json(new ApiResponse('Collection fetched successfully', collection));
  } catch (error) {
    next(error);
  }
};

export const createCollection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const collection = await Collection.create(req.body);
    res.status(201).json(new ApiResponse('Collection created successfully', collection));
  } catch (error) {
    next(error);
  }
};

export const updateCollection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const collection = await Collection.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    
    if (!collection) {
      return next(new ApiError(404, 'Collection not found'));
    }
    
    res.status(200).json(new ApiResponse('Collection updated successfully', collection));
  } catch (error) {
    next(error);
  }
};

export const deleteCollection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const collection = await Collection.findByIdAndDelete(req.params.id);
    
    if (!collection) {
      return next(new ApiError(404, 'Collection not found'));
    }
    
    res.status(200).json(new ApiResponse('Collection deleted successfully'));
  } catch (error) {
    next(error);
  }
};
