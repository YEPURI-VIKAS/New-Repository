export const STORAGE_KEYS = {
  authToken: "cdp_auth_token",
  authUser: "cdp_auth_user",
  savedCollegeIds: "cdp_saved_college_ids",
  compareCollegeIds: "cdp_compare_college_ids",
} as const;

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getSavedCollegeIds(): string[] {
  return readJson<string[]>(STORAGE_KEYS.savedCollegeIds, []);
}

export function setSavedCollegeIds(ids: string[]) {
  writeJson(STORAGE_KEYS.savedCollegeIds, ids);
}

export function getCompareCollegeIds(): string[] {
  return readJson<string[]>(STORAGE_KEYS.compareCollegeIds, []);
}

export function setCompareCollegeIds(ids: string[]) {
  writeJson(STORAGE_KEYS.compareCollegeIds, ids);
}

export function clearCompareCollegeIds() {
  setCompareCollegeIds([]);
}

