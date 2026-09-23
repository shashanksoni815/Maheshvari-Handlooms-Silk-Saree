import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError';

export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  } else {
    // Handling standard Node errors
    message = err.message || message;
  }

  const response = {
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  };

  res.status(statusCode).json(response);
};
