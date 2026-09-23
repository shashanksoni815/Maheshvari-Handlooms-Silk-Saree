import { Request, Response, NextFunction } from 'express';
import Store from '../../models/Store';
import FAQ from '../../models/FAQ';
import Setting from '../../models/Setting';
import { ApiError } from '../../utils/apiError';
import { ApiResponse } from '../../utils/apiResponse';

// --- STORES ---
export const getStores = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stores = await Store.find().sort({ createdAt: -1 });
    res.status(200).json(new ApiResponse('Stores fetched', stores));
  } catch (error) {
    next(error);
  }
};

export const createStore = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const store = await Store.create(req.body);
    res.status(201).json(new ApiResponse('Store created successfully', store));
  } catch (error) {
    next(error);
  }
};

export const updateStore = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const store = await Store.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!store) return next(new ApiError(404, 'Store not found'));
    res.status(200).json(new ApiResponse('Store updated', store));
  } catch (error) {
    next(error);
  }
};

export const deleteStore = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const store = await Store.findByIdAndDelete(req.params.id);
    if (!store) return next(new ApiError(404, 'Store not found'));
    res.status(200).json(new ApiResponse('Store deleted', {}));
  } catch (error) {
    next(error);
  }
};

// --- FAQS ---
export const getFaqs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const faqs = await FAQ.find().sort({ order: 1, createdAt: -1 });
    res.status(200).json(new ApiResponse('FAQs fetched', faqs));
  } catch (error) {
    next(error);
  }
};

export const createFaq = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const faq = await FAQ.create(req.body);
    res.status(201).json(new ApiResponse('FAQ created successfully', faq));
  } catch (error) {
    next(error);
  }
};

export const updateFaq = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!faq) return next(new ApiError(404, 'FAQ not found'));
    res.status(200).json(new ApiResponse('FAQ updated', faq));
  } catch (error) {
    next(error);
  }
};

export const deleteFaq = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const faq = await FAQ.findByIdAndDelete(req.params.id);
    if (!faq) return next(new ApiError(404, 'FAQ not found'));
    res.status(200).json(new ApiResponse('FAQ deleted', {}));
  } catch (error) {
    next(error);
  }
};

// --- SETTINGS ---
export const getSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const settings = await Setting.find();
    res.status(200).json(new ApiResponse('Settings fetched', settings));
  } catch (error) {
    next(error);
  }
};

export const updateSetting = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { key, value, type, description } = req.body;
    
    let setting = await Setting.findOne({ key });
    
    if (setting) {
      setting.value = value;
      if (type) setting.type = type;
      if (description) setting.description = description;
      await setting.save();
    } else {
      setting = await Setting.create({ key, value, type, description });
    }

    res.status(200).json(new ApiResponse('Setting updated', setting));
  } catch (error) {
    next(error);
  }
};
