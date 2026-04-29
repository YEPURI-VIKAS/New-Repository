import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import { env } from "./config/env";
import { authRouter } from "./routes/auth";
import { collegesRouter } from "./routes/colleges";
import { savedRouter } from "./routes/saved";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(compression());
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: false,
    }),
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan("dev"));

  app.get("/health", (_req, res) => res.status(200).json({ ok: true }));

  app.use("/api", authRouter);
  app.use("/api", collegesRouter);
  app.use("/api", savedRouter);

  app.use((_req, res) => res.status(404).json({ message: "Route not found" }));

  return app;
}

