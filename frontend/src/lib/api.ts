import { getAuth } from "./authStorage";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const auth = typeof window === "undefined" ? null : getAuth();
  const headers = new Headers(init?.headers);

  if (!headers.has("Content-Type") && init?.body) {
    headers.set("Content-Type", "application/json");
  }

  if (auth?.token) {
    headers.set("Authorization", `Bearer ${auth.token}`);
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });

  if (!res.ok) {
    let message = `Request failed with ${res.status}`;
    try {
      const data = await res.json();
      message = data?.message ?? message;
    } catch {
      // ignore json parse errors
    }
    throw new Error(message);
  }

  return (await res.json()) as T;
}

export type College = {
  id: string;
  name: string;
  location: string;
  fees: number;
  rating: number;
  placement: number;
  courses: string[];
  image: string;
  description: string;
};

export type CollegeListResponse = {
  items: College[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

