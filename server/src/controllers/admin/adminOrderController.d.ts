import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth';
export declare const getAdminOrders: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getAdminOrderById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const updateOrderStatus: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const issueRefund: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=adminOrderController.d.ts.map