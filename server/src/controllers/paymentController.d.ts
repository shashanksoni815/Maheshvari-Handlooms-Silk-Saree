import { Request, Response, NextFunction } from 'express';
export declare const createRazorpayOrder: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const verifyPayment: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const razorpayWebhook: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=paymentController.d.ts.map