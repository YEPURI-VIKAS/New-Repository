"use client";

import { useEffect, useState } from "react";
import { apiFetch, type College } from "@/lib/api";
import { CollegeCard } from "@/components/CollegeCard";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/Button";
import { Spinner } from "@/components/Spinner";
import { clearCompareCollegeIds, getSavedCollegeIds, setSavedCollegeIds } from "@/lib/storage";
import { getAuth } from "@/lib/authStorage";

export default function SavedPage() {
  const [loading, setLoading] = useState(true);
  const [savedIds, setSavedIdsState] = useState<string[]>([]);
  const [savedColleges, setSavedColleges] = useState<College[]>([]);

  async function refresh() {
    setLoading(true);
    try {
      const ids = getSavedCollegeIds();
      setSavedIdsState(ids);
      if (!ids.length) {
        setSavedColleges([]);
        return;
      }

      const results = await Promise.all(
        ids.map((id) =>
          apiFetch<College>(`/api/colleges/${id}`).catch(() => null),
        ),
      );
      setSavedColleges(results.filter(Boolean) as College[]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void (async () => {
      // Defer initial state updates to avoid the setState-in-effect lint rule.
      await Promise.resolve();
      await refresh();
    })();
  }, []);

  async function toggleSaved(collegeId: string) {
    const current = new Set(getSavedCollegeIds());
    const exists = current.has(collegeId);
    if (exists) current.delete(collegeId);
    else current.add(collegeId);
    setSavedCollegeIds(Array.from(current));

    // Optional backend sync when logged in.
    const auth = getAuth();
    if (auth?.token) {
      await apiFetch(`/api/save-college`, {
        method: "POST",
        body: JSON.stringify({ collegeId }),
      }).catch(() => null);
    }

    await refresh();
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-900">Saved Colleges</h1>
          <p className="mt-1 text-sm text-zinc-600">
            Your shortlist lives in localStorage (and syncs when you’re logged in).
          </p>
        </div>
        {savedIds.length ? (
          <Button
            variant="secondary"
            onClick={() => {
              setSavedCollegeIds([]);
              clearCompareCollegeIds();
              refresh();
            }}
          >
            Clear all
          </Button>
        ) : null}
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Spinner />
          </div>
        ) : savedColleges.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {savedColleges.map((c) => (
              <CollegeCard
                key={c.id}
                college={c}
                saved
                onToggleSave={() => toggleSaved(c.id)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No saved colleges yet"
            description="Save a few colleges from the listings or details page."
            ctaHref="/colleges"
            ctaText="Browse colleges"
          />
        )}
      </div>
    </main>
  );
}

