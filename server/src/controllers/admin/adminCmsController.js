"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSetting = exports.getSettings = exports.deleteFaq = exports.updateFaq = exports.createFaq = exports.getFaqs = exports.deleteStore = exports.updateStore = exports.createStore = exports.getStores = void 0;
const Store_1 = __importDefault(require("../../models/Store"));
const FAQ_1 = __importDefault(require("../../models/FAQ"));
const Setting_1 = __importDefault(require("../../models/Setting"));
const apiError_1 = require("../../utils/apiError");
const apiResponse_1 = require("../../utils/apiResponse");
// --- STORES ---
const getStores = async (req, res, next) => {
    try {
        const stores = await Store_1.default.find().sort({ createdAt: -1 });
        res.status(200).json(new apiResponse_1.ApiResponse('Stores fetched', stores));
    }
    catch (error) {
        next(error);
    }
};
exports.getStores = getStores;
const createStore = async (req, res, next) => {
    try {
        const store = await Store_1.default.create(req.body);
        res.status(201).json(new apiResponse_1.ApiResponse('Store created successfully', store));
    }
    catch (error) {
        next(error);
    }
};
exports.createStore = createStore;
const updateStore = async (req, res, next) => {
    try {
        const store = await Store_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!store)
            return next(new apiError_1.ApiError(404, 'Store not found'));
        res.status(200).json(new apiResponse_1.ApiResponse('Store updated', store));
    }
    catch (error) {
        next(error);
    }
};
exports.updateStore = updateStore;
const deleteStore = async (req, res, next) => {
    try {
        const store = await Store_1.default.findByIdAndDelete(req.params.id);
        if (!store)
            return next(new apiError_1.ApiError(404, 'Store not found'));
        res.status(200).json(new apiResponse_1.ApiResponse('Store deleted', {}));
    }
    catch (error) {
        next(error);
    }
};
exports.deleteStore = deleteStore;
// --- FAQS ---
const getFaqs = async (req, res, next) => {
    try {
        const faqs = await FAQ_1.default.find().sort({ order: 1, createdAt: -1 });
        res.status(200).json(new apiResponse_1.ApiResponse('FAQs fetched', faqs));
    }
    catch (error) {
        next(error);
    }
};
exports.getFaqs = getFaqs;
const createFaq = async (req, res, next) => {
    try {
        const faq = await FAQ_1.default.create(req.body);
        res.status(201).json(new apiResponse_1.ApiResponse('FAQ created successfully', faq));
    }
    catch (error) {
        next(error);
    }
};
exports.createFaq = createFaq;
const updateFaq = async (req, res, next) => {
    try {
        const faq = await FAQ_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!faq)
            return next(new apiError_1.ApiError(404, 'FAQ not found'));
        res.status(200).json(new apiResponse_1.ApiResponse('FAQ updated', faq));
    }
    catch (error) {
        next(error);
    }
};
exports.updateFaq = updateFaq;
const deleteFaq = async (req, res, next) => {
    try {
        const faq = await FAQ_1.default.findByIdAndDelete(req.params.id);
        if (!faq)
            return next(new apiError_1.ApiError(404, 'FAQ not found'));
        res.status(200).json(new apiResponse_1.ApiResponse('FAQ deleted', {}));
    }
    catch (error) {
        next(error);
    }
};
exports.deleteFaq = deleteFaq;
// --- SETTINGS ---
const getSettings = async (req, res, next) => {
    try {
        const settings = await Setting_1.default.find();
        res.status(200).json(new apiResponse_1.ApiResponse('Settings fetched', settings));
    }
    catch (error) {
        next(error);
    }
};
exports.getSettings = getSettings;
const updateSetting = async (req, res, next) => {
    try {
        const { key, value, type, description } = req.body;
        let setting = await Setting_1.default.findOne({ key });
        if (setting) {
            setting.value = value;
            if (type)
                setting.type = type;
            if (description)
                setting.description = description;
            await setting.save();
        }
        else {
            setting = await Setting_1.default.create({ key, value, type, description });
        }
        res.status(200).json(new apiResponse_1.ApiResponse('Setting updated', setting));
    }
    catch (error) {
        next(error);
    }
};
exports.updateSetting = updateSetting;
//# sourceMappingURL=adminCmsController.js.map