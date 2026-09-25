import { Request, Response, NextFunction } from 'express';
export declare const getCollections: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getCollectionBySlug: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getCollectionById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const createCollection: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const updateCollection: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteCollection: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=collectionController.d.ts.map