import type { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils/jwt";
import { env } from "../config/env";

export type AuthedRequest = Request & {
  user?: {
    id: string;
    email: string;
  };
};

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const auth = req.header("authorization");
  if (!auth) return res.status(401).json({ message: "Missing Authorization header" });

  const [scheme, token] = auth.split(" ");
  if (scheme !== "Bearer" || !token) return res.status(401).json({ message: "Invalid Authorization format" });

  try {
    const payload = verifyJwt(token, { secret: env.JWT_SECRET });
    req.user = { id: payload.sub, email: payload.email };
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

