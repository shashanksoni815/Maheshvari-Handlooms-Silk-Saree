import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import generateToken from '../utils/generateToken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/apiError';
import { ApiResponse } from '../utils/apiResponse';
import sendEmail from '../utils/emailService';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return next(new ApiError(400, 'User already exists'));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    const { accessToken, refreshToken } = generateToken((user._id as any).toString(), user.role);

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

    res.status(201).json(new ApiResponse('User registered successfully', {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      accessToken
    }));
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ApiError(400, 'Please provide email and password'));
    }

    const user = await User.findOne({ email }).select('+password').populate('customRole');
    if (!user) {
      return next(new ApiError(401, 'Invalid credentials'));
    }

    const isMatch = await bcrypt.compare(password, user.password!);
    if (!isMatch) {
      return next(new ApiError(401, 'Invalid credentials'));
    }

    const { accessToken, refreshToken } = generateToken((user._id as any).toString(), user.role);

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

    res.status(200).json(new ApiResponse('Login successful', {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      customRole: user.customRole,
      accessToken
    }));
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      const user = await User.findOne({ refreshToken });
      if (user) {
        user.refreshToken = undefined as any;
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

    res.status(200).json(new ApiResponse('Logged out successfully'));
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return next(new ApiError(401, 'Refresh token not found'));
    }

    const decoded: any = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'refreshSecret');
    const user = await User.findById(decoded.id).populate('customRole');

    if (!user || user.refreshToken !== refreshToken) {
      return next(new ApiError(401, 'Invalid refresh token'));
    }

    const tokens = generateToken((user._id as any).toString(), user.role);

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

    res.status(200).json(new ApiResponse('Token refreshed', { accessToken: tokens.accessToken }));
  } catch (error) {
    return next(new ApiError(401, 'Invalid or expired refresh token'));
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(new ApiError(404, 'There is no user with that email'));
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    
    // Hash token and set to resetPasswordToken field
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
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
      await sendEmail({
        email: user.email,
        subject: 'Password Reset Request',
        html: message,
      });

      res.status(200).json(new ApiResponse('Email sent', {}));
    } catch (error) {
      user.resetPasswordToken = undefined as any;
      user.resetPasswordExpire = undefined as any;
      await user.save();
      return next(new ApiError(500, 'Email could not be sent'));
    }
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken as string)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: new Date() },
    });

    if (!user) {
      return next(new ApiError(400, 'Invalid or expired token'));
    }

    // Set new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
    user.resetPasswordToken = undefined as any;
    user.resetPasswordExpire = undefined as any;

    await user.save();

    // Send confirmation email
    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Changed Successfully',
        html: '<p>Your password has been successfully updated.</p>',
      });
    } catch (e) {
      // Ignore if confirmation email fails
      console.log('Confirmation email failed', e);
    }

    res.status(200).json(new ApiResponse('Password updated successfully', {}));
  } catch (error) {
    next(error);
  }
};
