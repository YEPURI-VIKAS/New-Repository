"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "./Button";
import { getAuth, clearAuth } from "@/lib/authStorage";
import { getCompareCollegeIds, getSavedCollegeIds } from "@/lib/storage";

export function Navbar() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [savedCount, setSavedCount] = useState(0);
  const [compareCount, setCompareCount] = useState(0);
  const [authedEmail, setAuthedEmail] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const read = () => {
      const auth = getAuth();
      setAuthedEmail(auth?.user.email ?? null);
      setSavedCount(getSavedCollegeIds().length);
      setCompareCount(getCompareCollegeIds().length);
    };
    read();
    const t = window.setInterval(read, 2500);
    return () => window.clearInterval(t);
  }, []);

  function goToSearch(q: string) {
    const query = q.trim();
    router.push(query ? `/colleges?q=${encodeURIComponent(query)}` : "/colleges");
  }

  function onLogout() {
    clearAuth();
    setAuthedEmail(null);
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 font-extrabold">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 text-white">
                CD
              </span>
              <span className="hidden text-sm sm:block">
                College <span className="text-zinc-700">Discovery</span>
              </span>
            </Link>
          </div>

          <nav className="hidden items-center gap-1 md:flex">
            <Link href="/" className="px-3 py-2 text-sm font-semibold text-zinc-800 hover:bg-zinc-100 rounded-xl transition">
              Home
            </Link>
            <Link href="/colleges" className="px-3 py-2 text-sm font-semibold text-zinc-800 hover:bg-zinc-100 rounded-xl transition">
              Colleges
            </Link>
            <Link href="/compare" className="px-3 py-2 text-sm font-semibold text-zinc-800 hover:bg-zinc-100 rounded-xl transition relative">
              Compare
              {compareCount > 0 ? (
                <span className="absolute -top-2 -right-2 rounded-full bg-zinc-900 px-2 py-0.5 text-[10px] font-bold text-white">
                  {compareCount}
                </span>
              ) : null}
            </Link>
            <Link href="/saved" className="px-3 py-2 text-sm font-semibold text-zinc-800 hover:bg-zinc-100 rounded-xl transition relative">
              Saved
              {savedCount > 0 ? (
                <span className="absolute -top-2 -right-2 rounded-full bg-zinc-900 px-2 py-0.5 text-[10px] font-bold text-white">
                  {savedCount}
                </span>
              ) : null}
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <div className="relative">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search colleges..."
                className="w-64 rounded-full border border-zinc-200 bg-white px-4 py-2 pr-10 text-sm outline-none focus:border-zinc-900/30 focus:ring-2 focus:ring-zinc-900/10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-zinc-700 hover:bg-zinc-100"
                aria-label="Search"
                onClick={() => goToSearch(search)}
              >
                <span className="text-xs font-bold">↵</span>
              </button>
            </div>

            {authedEmail ? (
              <Button variant="secondary" size="sm" onClick={onLogout}>
                Logout
              </Button>
            ) : (
              <Link href="/login">
                <Button size="sm">Login</Button>
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center gap-2">
            {authedEmail ? (
              <Button variant="secondary" size="sm" onClick={onLogout}>
                Logout
              </Button>
            ) : (
              <Link href="/login" aria-label="Login">
                <Button size="sm">Login</Button>
              </Link>
            )}
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50"
              onClick={() => setMobileOpen((s) => !s)}
              aria-expanded={mobileOpen}
              aria-label="Open menu"
            >
              <span className="text-lg font-black">{mobileOpen ? "×" : "≡"}</span>
            </button>
          </div>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t bg-white md:hidden">
          <div className="mx-auto max-w-7xl px-4 py-3">
            <div className="mb-3">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search colleges..."
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm outline-none focus:border-zinc-900/30 focus:ring-2 focus:ring-zinc-900/10"
              />
              <div className="mt-2 flex justify-end">
                <Button size="sm" onClick={() => goToSearch(search)}>
                  Search
                </Button>
              </div>
            </div>

            <div className="grid gap-1">
              <Link href="/" onClick={() => setMobileOpen(false)} className="rounded-xl bg-zinc-50 px-3 py-2 text-sm font-semibold text-zinc-800">
                Home
              </Link>
              <Link href="/colleges" onClick={() => setMobileOpen(false)} className="rounded-xl bg-zinc-50 px-3 py-2 text-sm font-semibold text-zinc-800">
                Colleges
              </Link>
              <Link href="/compare" onClick={() => setMobileOpen(false)} className="rounded-xl bg-zinc-50 px-3 py-2 text-sm font-semibold text-zinc-800">
                Compare {compareCount > 0 ? `(${compareCount})` : ""}
              </Link>
              <Link href="/saved" onClick={() => setMobileOpen(false)} className="rounded-xl bg-zinc-50 px-3 py-2 text-sm font-semibold text-zinc-800">
                Saved {savedCount > 0 ? `(${savedCount})` : ""}
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}

