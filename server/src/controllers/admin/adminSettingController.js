"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSetting = exports.updateSettings = exports.getSettings = void 0;
const Setting_1 = __importDefault(require("../../models/Setting"));
const apiError_1 = require("../../utils/apiError");
const apiResponse_1 = require("../../utils/apiResponse");
// Get all settings
const getSettings = async (req, res, next) => {
    try {
        const settings = await Setting_1.default.find();
        res.status(200).json(new apiResponse_1.ApiResponse('Settings fetched successfully', settings));
    }
    catch (error) {
        next(error);
    }
};
exports.getSettings = getSettings;
// Update multiple settings at once (Bulk update)
const updateSettings = async (req, res, next) => {
    try {
        const { settings } = req.body; // Array of { key, value, type, description }
        if (!Array.isArray(settings)) {
            return next(new apiError_1.ApiError(400, 'Settings must be an array'));
        }
        const updatedSettings = [];
        for (const settingData of settings) {
            if (!settingData.key)
                continue;
            const updated = await Setting_1.default.findOneAndUpdate({ key: settingData.key }, {
                value: settingData.value,
                type: settingData.type || 'STRING',
                description: settingData.description
            }, { new: true, upsert: true } // Create if doesn't exist
            );
            updatedSettings.push(updated);
        }
        res.status(200).json(new apiResponse_1.ApiResponse('Settings updated successfully', updatedSettings));
    }
    catch (error) {
        next(error);
    }
};
exports.updateSettings = updateSettings;
// Delete a setting
const deleteSetting = async (req, res, next) => {
    try {
        const setting = await Setting_1.default.findByIdAndDelete(req.params.id);
        if (!setting) {
            return next(new apiError_1.ApiError(404, 'Setting not found'));
        }
        res.status(200).json(new apiResponse_1.ApiResponse('Setting deleted successfully', {}));
    }
    catch (error) {
        next(error);
    }
};
exports.deleteSetting = deleteSetting;
//# sourceMappingURL=adminSettingController.js.map