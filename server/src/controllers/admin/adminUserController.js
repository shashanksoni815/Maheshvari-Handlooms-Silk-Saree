"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAdminUser = exports.updateAdminUser = exports.createAdminUser = exports.getAdminUsers = void 0;
const User_1 = __importDefault(require("../../models/User"));
const apiError_1 = require("../../utils/apiError");
const apiResponse_1 = require("../../utils/apiResponse");
const getAdminUsers = async (req, res, next) => {
    try {
        const admins = await User_1.default.find({ role: { $in: ['ADMIN', 'SUPER_ADMIN'] } })
            .populate('customRole', 'name permissions')
            .select('-password')
            .sort({ createdAt: -1 });
        res.status(200).json(new apiResponse_1.ApiResponse('Admins fetched', admins));
    }
    catch (error) {
        next(error);
    }
};
exports.getAdminUsers = getAdminUsers;
const createAdminUser = async (req, res, next) => {
    try {
        const { firstName, lastName, email, password, role, customRole, isActive } = req.body;
        const exists = await User_1.default.findOne({ email });
        if (exists)
            return next(new apiError_1.ApiError(400, 'User already exists'));
        const admin = await User_1.default.create({
            firstName,
            lastName,
            email,
            password,
            role,
            customRole: role === 'ADMIN' ? customRole : undefined,
            isActive
        });
        const adminResponse = await User_1.default.findById(admin._id).select('-password').populate('customRole', 'name permissions');
        res.status(201).json(new apiResponse_1.ApiResponse('Admin created successfully', adminResponse));
    }
    catch (error) {
        next(error);
    }
};
exports.createAdminUser = createAdminUser;
const updateAdminUser = async (req, res, next) => {
    try {
        const { firstName, lastName, role, customRole, isActive } = req.body;
        const userToUpdate = await User_1.default.findById(req.params.id);
        if (!userToUpdate)
            return next(new apiError_1.ApiError(404, 'User not found'));
        // Prevent removing the last super admin
        if (userToUpdate.role === 'SUPER_ADMIN' && role !== 'SUPER_ADMIN') {
            const superAdminsCount = await User_1.default.countDocuments({ role: 'SUPER_ADMIN', isActive: true });
            if (superAdminsCount <= 1) {
                return next(new apiError_1.ApiError(400, 'Cannot demote the last active super admin'));
            }
        }
        // Prevent deactivating the last super admin
        if (userToUpdate.role === 'SUPER_ADMIN' && isActive === false) {
            const superAdminsCount = await User_1.default.countDocuments({ role: 'SUPER_ADMIN', isActive: true });
            if (superAdminsCount <= 1) {
                return next(new apiError_1.ApiError(400, 'Cannot deactivate the last active super admin'));
            }
        }
        userToUpdate.firstName = firstName || userToUpdate.firstName;
        userToUpdate.lastName = lastName || userToUpdate.lastName;
        userToUpdate.role = role || userToUpdate.role;
        userToUpdate.customRole = role === 'ADMIN' ? customRole : undefined;
        if (isActive !== undefined)
            userToUpdate.isActive = isActive;
        await userToUpdate.save();
        const updated = await User_1.default.findById(req.params.id).select('-password').populate('customRole', 'name permissions');
        res.status(200).json(new apiResponse_1.ApiResponse('Admin updated', updated));
    }
    catch (error) {
        next(error);
    }
};
exports.updateAdminUser = updateAdminUser;
const deleteAdminUser = async (req, res, next) => {
    try {
        const userToDelete = await User_1.default.findById(req.params.id);
        if (!userToDelete)
            return next(new apiError_1.ApiError(404, 'User not found'));
        if (userToDelete.role === 'SUPER_ADMIN') {
            const superAdminsCount = await User_1.default.countDocuments({ role: 'SUPER_ADMIN' });
            if (superAdminsCount <= 1) {
                return next(new apiError_1.ApiError(400, 'Cannot delete the last super admin'));
            }
        }
        // Prevent deleting oneself
        if (userToDelete._id.toString() === req.user?._id.toString()) {
            return next(new apiError_1.ApiError(400, 'Cannot delete yourself'));
        }
        await User_1.default.findByIdAndDelete(req.params.id);
        res.status(200).json(new apiResponse_1.ApiResponse('Admin deleted', {}));
    }
    catch (error) {
        next(error);
    }
};
exports.deleteAdminUser = deleteAdminUser;
//# sourceMappingURL=adminUserController.js.map