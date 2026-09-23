import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import AuditLog from '../models/AuditLog';

/**
 * Middleware to automatically create an audit log for an admin action.
 * @param action The action performed (e.g. 'CREATE', 'UPDATE', 'DELETE')
 * @param resource The resource affected (e.g. 'PRODUCT', 'ORDER')
 */
export const auditLog = (action: string, resource: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    // Listen for the response to finish
    res.on('finish', async () => {
      // Only log if the request was successful and user is authenticated
      if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
        
        let resourceId = (req.params.id || req.params.productId || req.params.orderId) as string | string[] | undefined;
        if (Array.isArray(resourceId)) {
          resourceId = resourceId[0];
        }
        const finalResourceId = resourceId as string | undefined;
        
        // For CREATE, we might have the created document's ID in the response, but intercepting it is tricky.
        // We will try to extract it from req.body if it's there (unlikely), or just leave it blank.
        
        // We can capture the request body (excluding passwords) as details
        const details = { ...req.body };
        if (details.password) delete details.password;

        try {
          await AuditLog.create({
            admin: req.user._id,
            action,
            resource,
            resourceId: finalResourceId,
            details,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'] as string | undefined
          });
        } catch (error) {
          console.error('Audit Log Error:', error);
        }
      }
    });

    next();
  };
};
