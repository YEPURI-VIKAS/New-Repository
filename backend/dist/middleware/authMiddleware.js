"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
const jwt_1 = require("../utils/jwt");
const env_1 = require("../config/env");
function requireAuth(req, res, next) {
    const auth = req.header("authorization");
    if (!auth)
        return res.status(401).json({ message: "Missing Authorization header" });
    const [scheme, token] = auth.split(" ");
    if (scheme !== "Bearer" || !token)
        return res.status(401).json({ message: "Invalid Authorization format" });
    try {
        const payload = (0, jwt_1.verifyJwt)(token, { secret: env_1.env.JWT_SECRET });
        req.user = { id: payload.sub, email: payload.email };
        return next();
    }
    catch {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}
//# sourceMappingURL=authMiddleware.js.map