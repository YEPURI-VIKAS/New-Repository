"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function required(name, fallback) {
    const v = process.env[name];
    if (!v || !v.trim())
        return fallback;
    return v;
}
exports.env = {
    PORT: Number(required("PORT", "4000")),
    NODE_ENV: required("NODE_ENV", "development"),
    JWT_SECRET: required("JWT_SECRET", "dev-change-me"),
    JWT_EXPIRES_IN: required("JWT_EXPIRES_IN", "7d"),
    CORS_ORIGIN: required("CORS_ORIGIN", "*"),
};
//# sourceMappingURL=env.js.map