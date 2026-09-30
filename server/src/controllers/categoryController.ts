import { Request, Response, NextFunction } from 'express';
import Category from '../models/Category';
import Product from '../models/Product';
import { ApiError } from '../utils/apiError';
import { ApiResponse } from '../utils/apiResponse';

export const DEFAULT_MAHESHWARI_CATEGORIES = [
  {
    name: 'Garbha Reshami',
    slug: 'garbha-reshami',
    description: 'Traditional Garbha Reshami silk sarees featuring vibrant borders and rich handwoven silk textures.',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Premium Sarees',
    slug: 'premium-sarees',
    description: 'Exclusive royal Maheshwari silk sarees crafted for special occasions and heritage celebrations.',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Lotus Butta Sarees',
    slug: 'lotus-butta-sarees',
    description: 'Handcrafted sarees adorned with intricate gold and silver lotus flower motif (butta) weaving.',
    image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Tissue Silk',
    slug: 'tissue-silk',
    description: 'Lustrous, lightweight Tissue Silk sarees woven with delicate metallic zari threads.',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Zari Checks',
    slug: 'zari-checks',
    description: 'Classic Maheshwari sarees featuring geometric zari grid and check patterns.',
    image: 'https://images.unsplash.com/photo-1583391733958-6c5188f54124?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Pure Silk Sarees',
    slug: 'pure-silk-sarees',
    description: '100% Silk Mark certified pure handloom silk sarees with imperial drape.',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Zari Border Sarees',
    slug: 'zari-border-sarees',
    description: 'Signature Maheshwari sarees defined by heavy gold and silver zari border craftsmanship.',
    image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Zari Lining Butti',
    slug: 'zari-lining-butti',
    description: 'Refined sarees featuring delicate zari stripe lines paired with subtle woven butti motifs.',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Flower Butti Saree',
    slug: 'flower-butti-saree',
    description: 'Handwoven silk sarees embellished with traditional floral motifs across the body and pallu.',
    image: 'https://images.unsplash.com/photo-1583391733958-6c5188f54124?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Diamond Butti Nayanthara',
    slug: 'diamond-butti-nayanthara',
    description: 'Royal Nayanthara weave sarees showcasing radiant diamond-shaped zari butti work.',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Triangle Butti Sarees',
    slug: 'triangle-butti-sarees',
    description: 'Geometric triangle motif handloom sarees celebrating heritage Central Indian art.',
    image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Swastika Butti Sarees',
    slug: 'swastika-butti-sarees',
    description: 'Auspicious Swastika motif silk sarees woven for festive rituals and wedding ceremonies.',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Ganga Jamuna Border',
    slug: 'ganga-jamuna-border',
    description: 'Dual-tone contrast border sarees featuring two distinct border colors on top and bottom.',
    image: 'https://images.unsplash.com/photo-1583391733958-6c5188f54124?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Resham Border',
    slug: 'resham-border',
    description: 'Soft silk sarees featuring pure resham thread border weaving.',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Maheshwari Rich Pallu Silk Sarees',
    slug: 'maheshwari-rich-pallu-silk-sarees',
    description: 'Imperial sarees highlighted by elaborate, heavy zari pallu artistry.',
    image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Maheshwari Silver Zari Sarees',
    slug: 'maheshwari-silver-zari-sarees',
    description: 'Elegant silk sarees woven exclusively with silver zari threads.',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Bagh Print Sarees',
    slug: 'bagh-print-sarees',
    description: 'Traditional Madhya Pradesh hand block printed Bagh motif silk sarees.',
    image: 'https://images.unsplash.com/photo-1583391733958-6c5188f54124?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Maheshwari Rewa Border Sarees',
    slug: 'maheshwari-rewa-border-sarees',
    description: 'Classic Rewa pattern border sarees representing royal Holkar heritage.',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Multi Colored Maheshwari',
    slug: 'multi-colored-maheshwari',
    description: 'Vibrant multi-hued Maheshwari sarees woven with complementary warp and weft silk yarns.',
    image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Chanderi Sarees',
    slug: 'chanderi-sarees',
    description: 'Ultra-lightweight, sheer texture Chanderi silk sarees with gold accent motifs.',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Cotton Hand Block Printed Sarees',
    slug: 'cotton-hand-block-printed-sarees',
    description: 'Breathable pure cotton handloom sarees featuring organic vegetable dye block prints.',
    image: 'https://images.unsplash.com/photo-1583391733958-6c5188f54124?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'All Maheshwari Sarees',
    slug: 'all-maheshwari-sarees',
    description: 'Comprehensive collection of authentic Maheshwari silk and cotton-silk handloom sarees.',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800'
  }
];

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

export const seedCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const seededCategories = [];
    for (const cat of DEFAULT_MAHESHWARI_CATEGORIES) {
      const existing = await Category.findOne({ slug: cat.slug });
      if (!existing) {
        const created = await Category.create(cat);
        seededCategories.push(created);
      } else {
        const updated = await Category.findByIdAndUpdate(
          existing._id,
          {
            image: existing.image || cat.image,
            description: existing.description || cat.description,
          },
          { new: true }
        );
        seededCategories.push(updated);
      }
    }
    res.status(200).json(new ApiResponse('Categories seeded successfully', seededCategories));
  } catch (error) {
    next(error);
  }
};
