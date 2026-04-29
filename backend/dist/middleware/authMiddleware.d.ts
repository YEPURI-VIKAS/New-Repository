import type { Request, Response, NextFunction } from "express";
export type AuthedRequest = Request & {
    user?: {
        id: string;
        email: string;
    };
};
export declare function requireAuth(req: AuthedRequest, res: Response, next: NextFunction): void | Response<any, Record<string, any>>;
//# sourceMappingURL=authMiddleware.d.ts.map