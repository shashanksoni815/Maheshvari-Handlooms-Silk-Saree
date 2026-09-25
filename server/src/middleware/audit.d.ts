import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
/**
 * Middleware to automatically create an audit log for an admin action.
 * @param action The action performed (e.g. 'CREATE', 'UPDATE', 'DELETE')
 * @param resource The resource affected (e.g. 'PRODUCT', 'ORDER')
 */
export declare const auditLog: (action: string, resource: string) => (req: AuthRequest, res: Response, next: NextFunction) => void;
//# sourceMappingURL=audit.d.ts.map