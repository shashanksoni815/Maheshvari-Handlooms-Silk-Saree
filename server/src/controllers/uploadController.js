"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImages = exports.uploadImage = void 0;
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const apiResponse_1 = require("../utils/apiResponse");
const apiError_1 = require("../utils/apiError");
const uploadImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return next(new apiError_1.ApiError(400, 'No file was uploaded.'));
        }
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary_1.default.uploader.upload_stream({
                folder: 'maheshwari-silk/uploads', // Default folder
                resource_type: 'image',
            }, (error, result) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve({
                        url: result?.secure_url,
                        publicId: result?.public_id,
                    });
                }
            });
            stream.end(req.file.buffer);
        });
        res.status(200).json(new apiResponse_1.ApiResponse('Image uploaded successfully', result));
    }
    catch (error) {
        next(error);
    }
};
exports.uploadImage = uploadImage;
const uploadImages = async (req, res, next) => {
    try {
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            return next(new apiError_1.ApiError(400, 'No files were uploaded.'));
        }
        const uploadPromises = req.files.map((file) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary_1.default.uploader.upload_stream({
                    folder: 'maheshwari-silk/products', // Default folder
                    resource_type: 'image',
                }, (error, result) => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve({
                            url: result?.secure_url,
                            publicId: result?.public_id,
                        });
                    }
                });
                stream.end(file.buffer);
            });
        });
        const results = await Promise.all(uploadPromises);
        res.status(200).json(new apiResponse_1.ApiResponse('Images uploaded successfully', results));
    }
    catch (error) {
        next(error);
    }
};
exports.uploadImages = uploadImages;
//# sourceMappingURL=uploadController.js.map