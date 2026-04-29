export type JwtPayload = {
    sub: string;
    email: string;
};
export declare function signJwt(payload: JwtPayload, opts: {
    secret: string;
    expiresIn: string;
}): string;
export declare function verifyJwt(token: string, opts: {
    secret: string;
}): JwtPayload;
//# sourceMappingURL=jwt.d.ts.map