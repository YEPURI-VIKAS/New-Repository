import dotenv from "dotenv";

dotenv.config();

function required(name: string, fallback?: string) {
  const v = process.env[name];
  if (!v || !v.trim()) return fallback;
  return v;
}

export const env = {
  PORT: Number(required("PORT", "4000")),
  NODE_ENV: required("NODE_ENV", "development"),
  JWT_SECRET: required("JWT_SECRET", "dev-change-me") as string,
  JWT_EXPIRES_IN: required("JWT_EXPIRES_IN", "7d") as string,
  CORS_ORIGIN: required("CORS_ORIGIN", "*") as string,
};

