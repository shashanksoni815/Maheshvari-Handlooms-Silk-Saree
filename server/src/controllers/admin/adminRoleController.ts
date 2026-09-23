import { Request, Response, NextFunction } from 'express';
import Role from '../../models/Role';
import { ApiError } from '../../utils/apiError';
import { ApiResponse } from '../../utils/apiResponse';

export const getRoles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const roles = await Role.find();
    res.status(200).json(new ApiResponse('Roles fetched', roles));
  } catch (error) {
    next(error);
  }
};

export const createRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const role = await Role.create(req.body);
    res.status(201).json(new ApiResponse('Role created successfully', role));
  } catch (error) {
    next(error);
  }
};

export const updateRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const role = await Role.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!role) return next(new ApiError(404, 'Role not found'));
    res.status(200).json(new ApiResponse('Role updated', role));
  } catch (error) {
    next(error);
  }
};

export const deleteRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const role = await Role.findByIdAndDelete(req.params.id);
    if (!role) return next(new ApiError(404, 'Role not found'));
    res.status(200).json(new ApiResponse('Role deleted', {}));
  } catch (error) {
    next(error);
  }
};
