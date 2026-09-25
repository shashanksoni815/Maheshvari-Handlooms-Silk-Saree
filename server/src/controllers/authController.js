"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.refresh = exports.logout = exports.login = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const apiError_1 = require("../utils/apiError");
const apiResponse_1 = require("../utils/apiResponse");
const emailService_1 = __importDefault(require("../utils/emailService"));
const register = async (req, res, next) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const userExists = await User_1.default.findOne({ email });
        if (userExists) {
            return next(new apiError_1.ApiError(400, 'User already exists'));
        }
        const salt = await bcrypt_1.default.genSalt(10);
        const hashedPassword = await bcrypt_1.default.hash(password, salt);
        const user = await User_1.default.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });
        const { accessToken, refreshToken } = (0, generateToken_1.default)(user._id.toString(), user.role);
        user.refreshToken = refreshToken;
        await user.save();
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        res.status(201).json(new apiResponse_1.ApiResponse('User registered successfully', {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            accessToken
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new apiError_1.ApiError(400, 'Please provide email and password'));
        }
        const user = await User_1.default.findOne({ email }).select('+password').populate('customRole');
        if (!user) {
            return next(new apiError_1.ApiError(401, 'Invalid credentials'));
        }
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            return next(new apiError_1.ApiError(401, 'Invalid credentials'));
        }
        const { accessToken, refreshToken } = (0, generateToken_1.default)(user._id.toString(), user.role);
        user.refreshToken = refreshToken;
        await user.save();
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000,
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(200).json(new apiResponse_1.ApiResponse('Login successful', {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            customRole: user.customRole,
            accessToken
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
const logout = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (refreshToken) {
            const user = await User_1.default.findOne({ refreshToken });
            if (user) {
                user.refreshToken = undefined;
                await user.save();
            }
        }
        res.cookie('accessToken', 'none', {
            expires: new Date(Date.now() + 10 * 1000),
            httpOnly: true,
        });
        res.cookie('refreshToken', 'none', {
            expires: new Date(Date.now() + 10 * 1000),
            httpOnly: true,
        });
        res.status(200).json(new apiResponse_1.ApiResponse('Logged out successfully'));
    }
    catch (error) {
        next(error);
    }
};
exports.logout = logout;
const refresh = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return next(new apiError_1.ApiError(401, 'Refresh token not found'));
        }
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'refreshSecret');
        const user = await User_1.default.findById(decoded.id).populate('customRole');
        if (!user || user.refreshToken !== refreshToken) {
            return next(new apiError_1.ApiError(401, 'Invalid refresh token'));
        }
        const tokens = (0, generateToken_1.default)(user._id.toString(), user.role);
        user.refreshToken = tokens.refreshToken;
        await user.save();
        res.cookie('accessToken', tokens.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000,
        });
        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(200).json(new apiResponse_1.ApiResponse('Token refreshed', { accessToken: tokens.accessToken }));
    }
    catch (error) {
        return next(new apiError_1.ApiError(401, 'Invalid or expired refresh token'));
    }
};
exports.refresh = refresh;
const forgotPassword = async (req, res, next) => {
    try {
        const user = await User_1.default.findOne({ email: req.body.email });
        if (!user) {
            return next(new apiError_1.ApiError(404, 'There is no user with that email'));
        }
        // Generate reset token
        const resetToken = crypto_1.default.randomBytes(20).toString('hex');
        // Hash token and set to resetPasswordToken field
        user.resetPasswordToken = crypto_1.default.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        await user.save();
        // Create reset url
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/resetpassword/${resetToken}`;
        const message = `
      <h1>You have requested a password reset</h1>
      <p>Please go to this link to reset your password:</p>
      <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
    `;
        try {
            await (0, emailService_1.default)({
                email: user.email,
                subject: 'Password Reset Request',
                html: message,
            });
            res.status(200).json(new apiResponse_1.ApiResponse('Email sent', {}));
        }
        catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();
            return next(new apiError_1.ApiError(500, 'Email could not be sent'));
        }
    }
    catch (error) {
        next(error);
    }
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res, next) => {
    try {
        // Get hashed token
        const resetPasswordToken = crypto_1.default
            .createHash('sha256')
            .update(req.params.resettoken)
            .digest('hex');
        const user = await User_1.default.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: new Date() },
        });
        if (!user) {
            return next(new apiError_1.ApiError(400, 'Invalid or expired token'));
        }
        // Set new password
        const salt = await bcrypt_1.default.genSalt(10);
        user.password = await bcrypt_1.default.hash(req.body.password, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        // Send confirmation email
        try {
            await (0, emailService_1.default)({
                email: user.email,
                subject: 'Password Changed Successfully',
                html: '<p>Your password has been successfully updated.</p>',
            });
        }
        catch (e) {
            // Ignore if confirmation email fails
            console.log('Confirmation email failed', e);
        }
        res.status(200).json(new apiResponse_1.ApiResponse('Password updated successfully', {}));
    }
    catch (error) {
        next(error);
    }
};
exports.resetPassword = resetPassword;
//# sourceMappingURL=authController.js.map