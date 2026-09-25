"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductFilters = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getProducts = void 0;
const Product_1 = __importDefault(require("../models/Product"));
const apiError_1 = require("../utils/apiError");
const apiResponse_1 = require("../utils/apiResponse");
const getProducts = async (req, res, next) => {
    try {
        const { category, collection, search, sort, status, limit, page, fabric, silkType, weave, color, minPrice, maxPrice, zariType, inStock, tags } = req.query;
        const query = {};
        if (status)
            query.status = status;
        else
            query.status = 'PUBLISHED'; // default for public view
        if (category)
            query.category = category;
        if (collection)
            query.collections = collection;
        // Deep Filters
        if (fabric)
            query['attributes.fabric'] = { $in: fabric.split(',') };
        if (silkType)
            query['attributes.silkType'] = { $in: silkType.split(',') };
        if (weave)
            query['attributes.weave'] = { $in: weave.split(',') };
        if (zariType)
            query['attributes.zariType'] = { $in: zariType.split(',') };
        if (color) {
            query.tags = { $in: color.split(',') };
        }
        if (tags) {
            if (!query.tags)
                query.tags = {};
            query.tags.$in = [...(query.tags.$in || []), ...tags.split(',')];
        }
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice)
                query.price.$gte = Number(minPrice);
            if (maxPrice)
                query.price.$lte = Number(maxPrice);
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
        const sortOptions = {};
        if (sort === 'newest')
            sortOptions.createdAt = -1;
        else if (sort === 'price_asc')
            sortOptions.price = 1;
        else if (sort === 'price_desc')
            sortOptions.price = -1;
        else
            sortOptions.createdAt = -1; // default
        const pageNum = parseInt(page, 10) || 1;
        const limitNum = parseInt(limit, 10) || 12;
        const skip = (pageNum - 1) * limitNum;
        const products = await Product_1.default.find(query)
            .populate('category', 'name slug')
            .populate('collections', 'name slug')
            .sort(sortOptions)
            .skip(skip)
            .limit(limitNum);
        const total = await Product_1.default.countDocuments(query);
        res.status(200).json(new apiResponse_1.ApiResponse('Products fetched successfully', {
            products,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                pages: Math.ceil(total / limitNum),
            },
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.getProducts = getProducts;
const getProductById = async (req, res, next) => {
    try {
        const product = await Product_1.default.findById(req.params.id)
            .populate('category', 'name slug')
            .populate('collections', 'name slug');
        if (!product) {
            return next(new apiError_1.ApiError(404, 'Product not found'));
        }
        res.status(200).json(new apiResponse_1.ApiResponse('Product fetched successfully', product));
    }
    catch (error) {
        next(error);
    }
};
exports.getProductById = getProductById;
const createProduct = async (req, res, next) => {
    try {
        const product = await Product_1.default.create(req.body);
        res.status(201).json(new apiResponse_1.ApiResponse('Product created successfully', product));
    }
    catch (error) {
        next(error);
    }
};
exports.createProduct = createProduct;
const updateProduct = async (req, res, next) => {
    try {
        const product = await Product_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!product) {
            return next(new apiError_1.ApiError(404, 'Product not found'));
        }
        res.status(200).json(new apiResponse_1.ApiResponse('Product updated successfully', product));
    }
    catch (error) {
        next(error);
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product_1.default.findByIdAndDelete(req.params.id);
        if (!product) {
            return next(new apiError_1.ApiError(404, 'Product not found'));
        }
        res.status(200).json(new apiResponse_1.ApiResponse('Product deleted successfully'));
    }
    catch (error) {
        next(error);
    }
};
exports.deleteProduct = deleteProduct;
const getProductFilters = async (req, res, next) => {
    try {
        const query = { status: 'PUBLISHED' };
        // Run distinct queries in parallel for better performance
        const [fabrics, silkTypes, weaves, colors] = await Promise.all([
            Product_1.default.distinct('attributes.fabric', query),
            Product_1.default.distinct('attributes.silkType', query),
            Product_1.default.distinct('attributes.weave', query),
            // We mapped color to tags earlier. Assuming tags contain colors or just distinct colors from attributes if we add it
            Product_1.default.distinct('attributes.color', query) // Wait, we didn't have attributes.color in the backend schema?
        ]);
        // Fallback: If attributes.color is empty, distinct tags.
        let colorList = colors.filter(Boolean);
        if (colorList.length === 0) {
            colorList = await Product_1.default.distinct('tags', query);
        }
        res.status(200).json(new apiResponse_1.ApiResponse('Filters fetched successfully', {
            fabric: fabrics.filter(Boolean),
            silkType: silkTypes.filter(Boolean),
            weave: weaves.filter(Boolean),
            color: colorList.filter(Boolean)
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.getProductFilters = getProductFilters;
//# sourceMappingURL=productController.js.map