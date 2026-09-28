import { Request, Response, NextFunction } from 'express';
import Role from '../../models/Role';
import User from '../../models/User';
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
    const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
    const permissions: string[] = Array.isArray(req.body.permissions)
      ? Array.from(new Set<string>(req.body.permissions.filter((permission: unknown): permission is string => typeof permission === 'string')))
      : [];
    if (!name) return next(new ApiError(400, 'Role name is required'));
    const role = await Role.create({ name, description: req.body.description || '', permissions });
    res.status(201).json(new ApiResponse('Role created successfully', role));
  } catch (error) {
    next(error);
  }
};

export const updateRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const update: Record<string, unknown> = {};
    if (typeof req.body.name === 'string' && req.body.name.trim()) update.name = req.body.name.trim();
    if (typeof req.body.description === 'string') update.description = req.body.description;
    if (Array.isArray(req.body.permissions)) {
      update.permissions = Array.from(new Set<string>(req.body.permissions.filter((permission: unknown): permission is string => typeof permission === 'string')));
    }
    const role = await Role.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!role) return next(new ApiError(404, 'Role not found'));
    res.status(200).json(new ApiResponse('Role updated', role));
  } catch (error) {
    next(error);
  }
};

export const deleteRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) return next(new ApiError(404, 'Role not found'));
    if (role.isSystem) return next(new ApiError(400, 'System roles cannot be deleted'));
    const assignedUsers = await User.countDocuments({ customRole: role._id });
    if (assignedUsers > 0) return next(new ApiError(409, 'This role is assigned to admin users. Reassign them before deleting it.'));
    await role.deleteOne();
    res.status(200).json(new ApiResponse('Role deleted', {}));
  } catch (error) {
    next(error);
  }
};
