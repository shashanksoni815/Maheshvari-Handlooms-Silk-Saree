import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth';
export declare const adjustInventory: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getInventoryHistory: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=adminInventoryController.d.ts.map