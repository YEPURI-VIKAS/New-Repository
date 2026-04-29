import { STORAGE_KEYS } from "./storage";

export type AuthUser = { id: string; email: string };
export type AuthState = { token: string; user: AuthUser };

export function getAuth(): AuthState | null {
  if (typeof window === "undefined") return null;
  try {
    const token = window.localStorage.getItem(STORAGE_KEYS.authToken);
    const userRaw = window.localStorage.getItem(STORAGE_KEYS.authUser);
    if (!token || !userRaw) return null;
    const user = JSON.parse(userRaw) as AuthUser;
    return { token, user };
  } catch {
    return null;
  }
}

export function setAuth(auth: AuthState) {
  window.localStorage.setItem(STORAGE_KEYS.authToken, auth.token);
  window.localStorage.setItem(STORAGE_KEYS.authUser, JSON.stringify(auth.user));
}

export function clearAuth() {
  window.localStorage.removeItem(STORAGE_KEYS.authToken);
  window.localStorage.removeItem(STORAGE_KEYS.authUser);
}

