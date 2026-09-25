import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const getMyAddresses: (req: AuthRequest, res: Response) => Promise<void>;
export declare const createAddress: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateAddress: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteAddress: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=addressController.d.ts.map