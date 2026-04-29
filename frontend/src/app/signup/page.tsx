"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { apiFetch } from "@/lib/api";
import { setAuth } from "@/lib/authStorage";
import { Button } from "@/components/Button";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(64),
});

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Validation failed");
      return;
    }

    try {
      setLoading(true);
      const res = await apiFetch<{ token: string; user: { id: string; email: string } }>(
        "/api/signup",
        {
          method: "POST",
          body: JSON.stringify({ email: parsed.data.email, password: parsed.data.password }),
        },
      );

      setAuth({ token: res.token, user: res.user });
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-extrabold text-zinc-900">Sign up</h1>
      <p className="mt-1 text-sm text-zinc-600">Create an account to sync saved colleges.</p>

      <div className="mt-6 rounded-3xl bg-gradient-to-r from-zinc-200/80 via-zinc-200/40 to-zinc-200/80 p-[1px] shadow-sm">
        <form onSubmit={onSubmit} className="rounded-3xl bg-white p-6">
        <div className="grid gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-zinc-800">Email</span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="h-11 rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-zinc-900/30 focus:ring-2 focus:ring-zinc-900/10"
              autoComplete="email"
              required
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-zinc-800">Password</span>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="h-11 rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-zinc-900/30 focus:ring-2 focus:ring-zinc-900/10"
              autoComplete="new-password"
              required
            />
          </label>

          {error ? <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}

          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create account"}
          </Button>

          <div className="text-sm text-zinc-600">
            Already have an account?{" "}
            <a href="/login" className="font-semibold text-zinc-900 hover:underline">
              Login
            </a>
          </div>
        </div>
        </form>
      </div>
    </main>
  );
}

