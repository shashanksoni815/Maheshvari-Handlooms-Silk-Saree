import { Request, Response } from 'express';
export declare const getBlogs: (req: Request, res: Response) => Promise<void>;
export declare const getBlogBySlug: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createBlog: (req: Request, res: Response) => Promise<void>;
export declare const updateBlog: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteBlog: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=blogController.d.ts.map