import jwt, { type SignOptions } from "jsonwebtoken";

export type JwtPayload = {
  sub: string; // userId
  email: string;
};

export function signJwt(payload: JwtPayload, opts: { secret: string; expiresIn: string }) {
  const options: SignOptions = { expiresIn: opts.expiresIn as any };
  return jwt.sign(payload as any, opts.secret as any, options);
}

export function verifyJwt(token: string, opts: { secret: string }) {
  return jwt.verify(token, opts.secret) as JwtPayload;
}

