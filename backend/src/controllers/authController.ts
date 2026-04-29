import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { env } from "../config/env";
import { signJwt } from "../utils/jwt";
import { createUser, findUserByEmail } from "../db/userStore";

const emailSchema = z.string().email();
const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .max(64, "Password must be at most 64 characters");

const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export async function signup(req: Request, res: Response) {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Validation failed", errors: parsed.error.flatten() });
  }

  try {
    const passwordHash = await bcrypt.hash(parsed.data.password, 10);
    const user = await createUser({ email: parsed.data.email, passwordHash });

    const token = signJwt(
      { sub: user.id, email: user.email },
      { secret: env.JWT_SECRET, expiresIn: env.JWT_EXPIRES_IN },
    );

    return res.status(201).json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    if (err instanceof Error && err.message === "EMAIL_TAKEN") {
      return res.status(409).json({ message: "Email already in use" });
    }
    return res.status(500).json({ message: "Signup failed" });
  }
}

export async function login(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Validation failed", errors: parsed.error.flatten() });
  }

  const user = await findUserByEmail(parsed.data.email);
  if (!user) return res.status(401).json({ message: "Invalid email or password" });

  const ok = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: "Invalid email or password" });

  const token = signJwt(
    { sub: user.id, email: user.email },
    { secret: env.JWT_SECRET, expiresIn: env.JWT_EXPIRES_IN },
  );

  return res.status(200).json({ token, user: { id: user.id, email: user.email } });
}

