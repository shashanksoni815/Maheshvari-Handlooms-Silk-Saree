import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const createOrder: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getOrderById: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getMyOrders: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getOrders: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const updateOrderToDelivered: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const cancelOrder: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=orderController.d.ts.map