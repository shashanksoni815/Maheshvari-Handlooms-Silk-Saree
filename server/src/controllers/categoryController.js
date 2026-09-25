"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategoryById = exports.getCategories = void 0;
const Category_1 = __importDefault(require("../models/Category"));
const apiError_1 = require("../utils/apiError");
const apiResponse_1 = require("../utils/apiResponse");
const getCategories = async (req, res, next) => {
    try {
        const categories = await Category_1.default.find().populate('parentCategory', 'name slug');
        res.status(200).json(new apiResponse_1.ApiResponse('Categories fetched successfully', categories));
    }
    catch (error) {
        next(error);
    }
};
exports.getCategories = getCategories;
const getCategoryById = async (req, res, next) => {
    try {
        const category = await Category_1.default.findById(req.params.id).populate('parentCategory', 'name slug');
        if (!category) {
            return next(new apiError_1.ApiError(404, 'Category not found'));
        }
        res.status(200).json(new apiResponse_1.ApiResponse('Category fetched successfully', category));
    }
    catch (error) {
        next(error);
    }
};
exports.getCategoryById = getCategoryById;
const createCategory = async (req, res, next) => {
    try {
        if (!req.body.slug && req.body.name) {
            req.body.slug = req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        }
        const category = await Category_1.default.create(req.body);
        res.status(201).json(new apiResponse_1.ApiResponse('Category created successfully', category));
    }
    catch (error) {
        next(error);
    }
};
exports.createCategory = createCategory;
const updateCategory = async (req, res, next) => {
    try {
        if (!req.body.slug && req.body.name) {
            req.body.slug = req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        }
        const category = await Category_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!category) {
            return next(new apiError_1.ApiError(404, 'Category not found'));
        }
        res.status(200).json(new apiResponse_1.ApiResponse('Category updated successfully', category));
    }
    catch (error) {
        next(error);
    }
};
exports.updateCategory = updateCategory;
const deleteCategory = async (req, res, next) => {
    try {
        const category = await Category_1.default.findByIdAndDelete(req.params.id);
        if (!category) {
            return next(new apiError_1.ApiError(404, 'Category not found'));
        }
        res.status(200).json(new apiResponse_1.ApiResponse('Category deleted successfully'));
    }
    catch (error) {
        next(error);
    }
};
exports.deleteCategory = deleteCategory;
//# sourceMappingURL=categoryController.js.map