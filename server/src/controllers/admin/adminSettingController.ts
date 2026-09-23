import { Request, Response, NextFunction } from 'express';
import Setting from '../../models/Setting';
import { ApiError } from '../../utils/apiError';
import { ApiResponse } from '../../utils/apiResponse';

// Get all settings
export const getSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const settings = await Setting.find();
    res.status(200).json(new ApiResponse('Settings fetched successfully', settings));
  } catch (error) {
    next(error);
  }
};

// Update multiple settings at once (Bulk update)
export const updateSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { settings } = req.body; // Array of { key, value, type, description }

    if (!Array.isArray(settings)) {
      return next(new ApiError(400, 'Settings must be an array'));
    }

    const updatedSettings = [];

    for (const settingData of settings) {
      if (!settingData.key) continue;

      const updated = await Setting.findOneAndUpdate(
        { key: settingData.key },
        { 
          value: settingData.value,
          type: settingData.type || 'STRING',
          description: settingData.description
        },
        { new: true, upsert: true } // Create if doesn't exist
      );
      updatedSettings.push(updated);
    }

    res.status(200).json(new ApiResponse('Settings updated successfully', updatedSettings));
  } catch (error) {
    next(error);
  }
};

// Delete a setting
export const deleteSetting = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const setting = await Setting.findByIdAndDelete(req.params.id);
    if (!setting) {
      return next(new ApiError(404, 'Setting not found'));
    }
    res.status(200).json(new ApiResponse('Setting deleted successfully', {}));
  } catch (error) {
    next(error);
  }
};
