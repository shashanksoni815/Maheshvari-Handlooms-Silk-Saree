import { Request, Response } from 'express';
import User from '../models/User';

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private/Admin
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
