"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizePermission = exports.authorize = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const apiError_1 = require("../utils/apiError");
const protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        else if (req.cookies?.accessToken) {
            token = req.cookies.accessToken;
        }
        if (!token) {
            return next(new apiError_1.ApiError(401, 'Not authorized to access this route'));
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_ACCESS_SECRET || 'secret');
        const user = await User_1.default.findById(decoded.id).populate('customRole');
        if (!user) {
            return next(new apiError_1.ApiError(401, 'The user belonging to this token does no longer exist.'));
        }
        req.user = user;
        next();
    }
    catch (error) {
        return next(new apiError_1.ApiError(401, 'Not authorized to access this route'));
    }
};
exports.protect = protect;
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new apiError_1.ApiError(401, 'Not authorized'));
        }
        if (!roles.includes(req.user.role)) {
            return next(new apiError_1.ApiError(403, `User role ${req.user.role} is not authorized to access this route`));
        }
        next();
    };
};
exports.authorize = authorize;
const authorizePermission = (permission) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new apiError_1.ApiError(401, 'Not authorized'));
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
        return next(new apiError_1.ApiError(403, `Not authorized to perform this action. Requires permission: ${permission}`));
    };
};
exports.authorizePermission = authorizePermission;
//# sourceMappingURL=auth.js.map