import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { ApiError } from '../utils/apiError';

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return next(new ApiError(401, 'Not authorized to access this route'));
    }

    const decoded: any = jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'secret');

    const user = await User.findById(decoded.id).populate('customRole');

    if (!user) {
      return next(new ApiError(401, 'The user belonging to this token does no longer exist.'));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new ApiError(401, 'Not authorized to access this route'));
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError(401, 'Not authorized'));
    }
    
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, `User role ${req.user.role} is not authorized to access this route`));
    }
    next();
  };
};

export const authorizePermission = (permission: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError(401, 'Not authorized'));
    }

    // Super Admin has all permissions
    if (req.user.role === 'SUPER_ADMIN') {
      return next();
    }

    // If they have a custom role, check permissions array
    if (req.user.customRole && req.user.customRole.permissions) {
      if (req.user.customRole.permissions.includes(permission)) {
        return next();
      }
    }

    return next(new ApiError(403, `Not authorized to perform this action. Requires permission: ${permission}`));
  };
};
