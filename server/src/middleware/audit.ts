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
    let responseBody: any;
    const originalJson = res.json.bind(res);
    res.json = ((body: any) => {
      responseBody = body;
      return originalJson(body);
    }) as Response['json'];

    // Listen for the response to finish
    res.on('finish', async () => {
      // Only log if the request was successful and user is authenticated
      if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
        
        let resourceId = (req.params.id || req.params.productId || req.params.orderId) as string | string[] | undefined;
        if (Array.isArray(resourceId)) {
          resourceId = resourceId[0];
        }
        const responseData = responseBody?.data;
        const createdId = responseData?._id || responseData?.id;
        const finalResourceId = (resourceId || createdId) as string | undefined;

        const details = { ...req.body };
        for (const key of Object.keys(details)) {
          if (/password|secret|token|api.?key/i.test(key)) delete details[key];
        }

        try {
          const payload: any = {
            admin: req.user._id,
            action,
            resource,
            details
          };
          if (finalResourceId) payload.resourceId = finalResourceId;
          if (req.ip) payload.ipAddress = req.ip;
          if (req.headers['user-agent']) payload.userAgent = req.headers['user-agent'];

          await AuditLog.create(payload);
        } catch (error) {
          console.error('Audit Log Error:', error);
        }
      }
    });

    next();
  };
};
