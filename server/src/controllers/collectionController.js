"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCollection = exports.updateCollection = exports.createCollection = exports.getCollectionById = exports.getCollectionBySlug = exports.getCollections = void 0;
const Collection_1 = __importDefault(require("../models/Collection"));
const apiError_1 = require("../utils/apiError");
const apiResponse_1 = require("../utils/apiResponse");
const getCollections = async (req, res, next) => {
    try {
        const { isActive, isFeatured } = req.query;
        const query = {};
        if (isActive !== undefined)
            query.isActive = isActive === 'true';
        if (isFeatured !== undefined)
            query.isFeatured = isFeatured === 'true';
        const collections = await Collection_1.default.find(query).sort({ order: 1, createdAt: -1 });
        res.status(200).json(new apiResponse_1.ApiResponse('Collections fetched successfully', collections));
    }
    catch (error) {
        next(error);
    }
};
exports.getCollections = getCollections;
const getCollectionBySlug = async (req, res, next) => {
    try {
        const collection = await Collection_1.default.findOne({ slug: req.params.slug, isActive: true });
        if (!collection) {
            return next(new apiError_1.ApiError(404, 'Collection not found'));
        }
        res.status(200).json(new apiResponse_1.ApiResponse('Collection fetched successfully', collection));
    }
    catch (error) {
        next(error);
    }
};
exports.getCollectionBySlug = getCollectionBySlug;
const getCollectionById = async (req, res, next) => {
    try {
        const collection = await Collection_1.default.findById(req.params.id);
        if (!collection) {
            return next(new apiError_1.ApiError(404, 'Collection not found'));
        }
        res.status(200).json(new apiResponse_1.ApiResponse('Collection fetched successfully', collection));
    }
    catch (error) {
        next(error);
    }
};
exports.getCollectionById = getCollectionById;
const createCollection = async (req, res, next) => {
    try {
        if (!req.body.slug && req.body.name) {
            req.body.slug = req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        }
        const collection = await Collection_1.default.create(req.body);
        res.status(201).json(new apiResponse_1.ApiResponse('Collection created successfully', collection));
    }
    catch (error) {
        next(error);
    }
};
exports.createCollection = createCollection;
const updateCollection = async (req, res, next) => {
    try {
        if (!req.body.slug && req.body.name) {
            req.body.slug = req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        }
        const collection = await Collection_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!collection) {
            return next(new apiError_1.ApiError(404, 'Collection not found'));
        }
        res.status(200).json(new apiResponse_1.ApiResponse('Collection updated successfully', collection));
    }
    catch (error) {
        next(error);
    }
};
exports.updateCollection = updateCollection;
const deleteCollection = async (req, res, next) => {
    try {
        const collection = await Collection_1.default.findByIdAndDelete(req.params.id);
        if (!collection) {
            return next(new apiError_1.ApiError(404, 'Collection not found'));
        }
        res.status(200).json(new apiResponse_1.ApiResponse('Collection deleted successfully'));
    }
    catch (error) {
        next(error);
    }
};
exports.deleteCollection = deleteCollection;
//# sourceMappingURL=collectionController.js.map