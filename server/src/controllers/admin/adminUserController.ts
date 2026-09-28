import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import User from '../../models/User';
import Role from '../../models/Role';
import { ApiError } from '../../utils/apiError';
import { ApiResponse } from '../../utils/apiResponse';

const getRouteId = (id: string | string[] | undefined) => Array.isArray(id) ? id[0] : id;

export const getAdminUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const admins = await User.find({ role: { $in: ['ADMIN', 'SUPER_ADMIN'] } })
      .populate('customRole', 'name permissions')
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json(new ApiResponse('Admins fetched', admins));
  } catch (error) {
    next(error);
  }
};

export const createAdminUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firstName, lastName, email, password, role = 'ADMIN', customRole, isActive = true } = req.body;

    if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || typeof password !== 'string' || password.length < 8) {
      return next(new ApiError(400, 'First name, last name, email, and a password of at least 8 characters are required'));
    }
    if (!['ADMIN', 'SUPER_ADMIN'].includes(role)) {
      return next(new ApiError(400, 'Admin role must be ADMIN or SUPER_ADMIN'));
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const exists = await User.findOne({ email: normalizedEmail });
    if (exists) return next(new ApiError(400, 'User already exists'));

    if (role === 'ADMIN' && customRole) {
      if (!mongoose.Types.ObjectId.isValid(customRole)) return next(new ApiError(400, 'Selected custom role is invalid'));
      const matchingRole = await Role.findById(customRole);
      if (!matchingRole) return next(new ApiError(400, 'Selected custom role was not found'));
    }

    const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(10));

    const admin = await User.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role,
      customRole: role === 'ADMIN' && customRole ? customRole : undefined,
      isActive: Boolean(isActive)
    });

    const adminResponse = await User.findById(admin._id).select('-password').populate('customRole', 'name permissions');
    res.status(201).json(new ApiResponse('Admin created successfully', adminResponse));
  } catch (error) {
    next(error);
  }
};

export const updateAdminUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firstName, lastName, role, customRole, isActive } = req.body;
    const adminId = getRouteId(req.params.id);
    if (!adminId || !mongoose.Types.ObjectId.isValid(adminId)) return next(new ApiError(404, 'Admin user not found'));

    if (role !== undefined && !['ADMIN', 'SUPER_ADMIN'].includes(role)) {
      return next(new ApiError(400, 'Admin role must be ADMIN or SUPER_ADMIN'));
    }
    if (role === 'ADMIN' && customRole) {
      if (!mongoose.Types.ObjectId.isValid(customRole)) return next(new ApiError(400, 'Selected custom role is invalid'));
      const matchingRole = await Role.findById(customRole);
      if (!matchingRole) return next(new ApiError(400, 'Selected custom role was not found'));
    }

    const userToUpdate = await User.findById(adminId);
    if (!userToUpdate) return next(new ApiError(404, 'User not found'));
    if (!['ADMIN', 'SUPER_ADMIN'].includes(userToUpdate.role)) return next(new ApiError(404, 'Admin user not found'));

    // Prevent removing the last super admin
    if (userToUpdate.role === 'SUPER_ADMIN' && role !== 'SUPER_ADMIN') {
      const superAdminsCount = await User.countDocuments({ role: 'SUPER_ADMIN', isActive: true });
      if (superAdminsCount <= 1) {
        return next(new ApiError(400, 'Cannot demote the last active super admin'));
      }
    }

    // Prevent deactivating the last super admin
    if (userToUpdate.role === 'SUPER_ADMIN' && isActive === false) {
      const superAdminsCount = await User.countDocuments({ role: 'SUPER_ADMIN', isActive: true });
      if (superAdminsCount <= 1) {
        return next(new ApiError(400, 'Cannot deactivate the last active super admin'));
      }
    }

    userToUpdate.firstName = firstName || userToUpdate.firstName;
    userToUpdate.lastName = lastName || userToUpdate.lastName;
    userToUpdate.role = role || userToUpdate.role;
    if (role === 'SUPER_ADMIN') (userToUpdate as any).customRole = undefined;
    else if (role === 'ADMIN' && customRole !== undefined) (userToUpdate as any).customRole = customRole || undefined;
    if (isActive !== undefined) (userToUpdate as any).isActive = isActive;

    await userToUpdate.save();

    const updated = await User.findById(adminId).select('-password').populate('customRole', 'name permissions');
    res.status(200).json(new ApiResponse('Admin updated', updated));
  } catch (error) {
    next(error);
  }
};

export const deleteAdminUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const adminId = getRouteId(req.params.id);
    if (!adminId || !mongoose.Types.ObjectId.isValid(adminId)) return next(new ApiError(404, 'Admin user not found'));
    const userToDelete = await User.findById(adminId);
    if (!userToDelete) return next(new ApiError(404, 'User not found'));
    if (!['ADMIN', 'SUPER_ADMIN'].includes(userToDelete.role)) return next(new ApiError(404, 'Admin user not found'));

    if (userToDelete.role === 'SUPER_ADMIN') {
      const superAdminsCount = await User.countDocuments({ role: 'SUPER_ADMIN' });
      if (superAdminsCount <= 1) {
        return next(new ApiError(400, 'Cannot delete the last super admin'));
      }
    }

    // Prevent deleting oneself
    if (userToDelete._id.toString() === (req as any).user?._id.toString()) {
      return next(new ApiError(400, 'Cannot delete yourself'));
    }

    await User.findByIdAndDelete(adminId);
    res.status(200).json(new ApiResponse('Admin deleted', {}));
  } catch (error) {
    next(error);
  }
};
