import { Request, Response, NextFunction } from 'express';
import cloudinary from '../config/cloudinary';
import { ApiResponse } from '../utils/apiResponse';
import { ApiError } from '../utils/apiError';

export const uploadImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return next(new ApiError(400, 'No file was uploaded.'));
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'maheshwari-silk/uploads', // Default folder
          resource_type: 'image',
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve({
              url: result?.secure_url,
              publicId: result?.public_id,
            });
          }
        }
      );
      stream.end(req.file!.buffer);
    });

    res.status(200).json(new ApiResponse('Image uploaded successfully', result));
  } catch (error) {
    next(error);
  }
};

export const uploadImages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return next(new ApiError(400, 'No files were uploaded.'));
    }

    const uploadPromises = (req.files as Express.Multer.File[]).map((file) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'maheshwari-silk/products', // Default folder
            resource_type: 'image',
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve({
                url: result?.secure_url,
                publicId: result?.public_id,
              });
            }
          }
        );
        stream.end(file.buffer);
      });
    });

    const results = await Promise.all(uploadPromises);

    res.status(200).json(new ApiResponse('Images uploaded successfully', results));
  } catch (error) {
    next(error);
  }
};
