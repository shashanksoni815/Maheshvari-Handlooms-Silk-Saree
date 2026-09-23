import { Request, Response, NextFunction } from 'express';
import User from '../../models/User';
import { ApiError } from '../../utils/apiError';
import { ApiResponse } from '../../utils/apiResponse';

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
    const { firstName, lastName, email, password, role, customRole, isActive } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return next(new ApiError(400, 'User already exists'));

    const admin = await User.create({
      firstName,
      lastName,
      email,
      password,
      role,
      customRole: role === 'ADMIN' ? customRole : undefined,
      isActive
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

    const userToUpdate = await User.findById(req.params.id);
    if (!userToUpdate) return next(new ApiError(404, 'User not found'));

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
    (userToUpdate as any).customRole = role === 'ADMIN' ? customRole : undefined;
    if (isActive !== undefined) (userToUpdate as any).isActive = isActive;

    await userToUpdate.save();

    const updated = await User.findById(req.params.id).select('-password').populate('customRole', 'name permissions');
    res.status(200).json(new ApiResponse('Admin updated', updated));
  } catch (error) {
    next(error);
  }
};

export const deleteAdminUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userToDelete = await User.findById(req.params.id);
    if (!userToDelete) return next(new ApiError(404, 'User not found'));

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

    await User.findByIdAndDelete(req.params.id);
    res.status(200).json(new ApiResponse('Admin deleted', {}));
  } catch (error) {
    next(error);
  }
};
