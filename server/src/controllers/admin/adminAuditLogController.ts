import { Request, Response, NextFunction } from 'express';
import AuditLog from '../../models/AuditLog';
import { ApiResponse } from '../../utils/apiResponse';

export const getAuditLogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const logs = await AuditLog.find()
      .populate('admin', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(500); // Limit to recent 500 for performance

    res.status(200).json(new ApiResponse('Audit logs fetched', logs));
  } catch (error) {
    next(error);
  }
};
