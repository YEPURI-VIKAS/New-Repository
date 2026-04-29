"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signup = signup;
exports.login = login;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const zod_1 = require("zod");
const env_1 = require("../config/env");
const jwt_1 = require("../utils/jwt");
const userStore_1 = require("../db/userStore");
const emailSchema = zod_1.z.string().email();
const passwordSchema = zod_1.z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(64, "Password must be at most 64 characters");
const signupSchema = zod_1.z.object({
    email: emailSchema,
    password: passwordSchema,
});
const loginSchema = zod_1.z.object({
    email: emailSchema,
    password: passwordSchema,
});
async function signup(req, res) {
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ message: "Validation failed", errors: parsed.error.flatten() });
    }
    try {
        const passwordHash = await bcryptjs_1.default.hash(parsed.data.password, 10);
        const user = await (0, userStore_1.createUser)({ email: parsed.data.email, passwordHash });
        const token = (0, jwt_1.signJwt)({ sub: user.id, email: user.email }, { secret: env_1.env.JWT_SECRET, expiresIn: env_1.env.JWT_EXPIRES_IN });
        return res.status(201).json({ token, user: { id: user.id, email: user.email } });
    }
    catch (err) {
        if (err instanceof Error && err.message === "EMAIL_TAKEN") {
            return res.status(409).json({ message: "Email already in use" });
        }
        return res.status(500).json({ message: "Signup failed" });
    }
}
async function login(req, res) {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ message: "Validation failed", errors: parsed.error.flatten() });
    }
    const user = await (0, userStore_1.findUserByEmail)(parsed.data.email);
    if (!user)
        return res.status(401).json({ message: "Invalid email or password" });
    const ok = await bcryptjs_1.default.compare(parsed.data.password, user.passwordHash);
    if (!ok)
        return res.status(401).json({ message: "Invalid email or password" });
    const token = (0, jwt_1.signJwt)({ sub: user.id, email: user.email }, { secret: env_1.env.JWT_SECRET, expiresIn: env_1.env.JWT_EXPIRES_IN });
    return res.status(200).json({ token, user: { id: user.id, email: user.email } });
}
//# sourceMappingURL=authController.js.map