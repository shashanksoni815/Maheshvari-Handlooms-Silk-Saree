import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import generateToken from '../utils/generateToken';
import bcrypt from 'bcrypt';
import { ApiError } from '../utils/apiError';
import { ApiResponse } from '../utils/apiResponse';

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

    const { accessToken, refreshToken } = generateToken(user._id as string, user.role);

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

    const { accessToken, refreshToken } = generateToken(user._id as string, user.role);

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

    const tokens = generateToken(user._id as string, user.role);

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
