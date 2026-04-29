"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const env_1 = require("./config/env");
const auth_1 = require("./routes/auth");
const colleges_1 = require("./routes/colleges");
const saved_1 = require("./routes/saved");
function createApp() {
    const app = (0, express_1.default)();
    app.use((0, helmet_1.default)());
    app.use((0, compression_1.default)());
    app.use((0, cors_1.default)({
        origin: env_1.env.CORS_ORIGIN,
        credentials: false,
    }));
    app.use(express_1.default.json({ limit: "1mb" }));
    app.use((0, morgan_1.default)("dev"));
    app.get("/health", (_req, res) => res.status(200).json({ ok: true }));
    app.use("/api", auth_1.authRouter);
    app.use("/api", colleges_1.collegesRouter);
    app.use("/api", saved_1.savedRouter);
    app.use((_req, res) => res.status(404).json({ message: "Route not found" }));
    return app;
}
//# sourceMappingURL=app.js.map