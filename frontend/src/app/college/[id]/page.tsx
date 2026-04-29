"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch, type College } from "@/lib/api";
import { Button } from "@/components/Button";
import { Spinner } from "@/components/Spinner";
import { getAuth } from "@/lib/authStorage";
/* eslint-disable @next/next/no-img-element */
import {
  getCompareCollegeIds,
  getSavedCollegeIds,
  setCompareCollegeIds,
  setSavedCollegeIds,
} from "@/lib/storage";

function formatFees(fees: number) {
  const lakhs = Math.round((fees / 100000) * 10) / 10;
  return `₹ ${lakhs} L/yr`;
}

export default function CollegeDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [college, setCollege] = useState<College | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [, setUiRefresh] = useState(0);
  const savedIds = new Set(getSavedCollegeIds());
  const compareIds = new Set(getCompareCollegeIds());

  const saved = id ? savedIds.has(id) : false;
  const compared = id ? compareIds.has(id) : false;
  const compareCount = compareIds.size;

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        if (!id) {
          setError("Missing college id");
          return;
        }
        const res = await apiFetch<College>(`/api/colleges/${id}`);
        if (!mounted) return;
        setCollege(res);
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "Failed to load college");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  async function toggleSave() {
    if (!id) return;
    const current = new Set(getSavedCollegeIds());
    const exists = current.has(id);
    if (exists) current.delete(id);
    else current.add(id);
    setSavedCollegeIds(Array.from(current));

    const auth = getAuth();
    if (auth?.token) {
      await apiFetch(`/api/save-college`, {
        method: "POST",
        body: JSON.stringify({ collegeId: id }),
      }).catch(() => null);
    }

    setUiRefresh((x) => x + 1);
  }

  async function toggleCompare() {
    if (!id) return;
    const current = getCompareCollegeIds();
    const set = new Set(current);

    if (set.has(id)) {
      set.delete(id);
    } else {
      if (set.size >= 3) return;
      set.add(id);
    }
    setCompareCollegeIds(Array.from(set));
    setUiRefresh((x) => x + 1);
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex items-center justify-center py-10">
          <Spinner />
        </div>
      </main>
    );
  }

  if (error || !college) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 text-center shadow-sm">
          <div className="text-sm font-semibold text-zinc-900">Unable to load college details.</div>
          <div className="mt-2 text-sm text-zinc-600">{error ?? "Unknown error"}</div>
          <div className="mt-4">
            <Button variant="secondary" onClick={() => router.push("/colleges")}>
              Back to listings
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-4 flex items-center justify-between gap-3">
        <Button variant="ghost" onClick={() => router.back()}>
          ← Back
        </Button>
        {compareCount >= 2 ? (
          <Button onClick={() => router.push("/compare")}>View comparison</Button>
        ) : null}
      </div>

      <section className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
        <div className="relative h-56 sm:h-72">
          <img
            src={college.image}
            alt={college.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/0" />
          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-white/80">College</div>
                <h1 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">{college.name}</h1>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">
                    {college.location}
                  </span>
                  <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">
                    {college.rating.toFixed(1)}★ rating
                  </span>
                  <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">
                    {college.placement}% placements
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:items-end">
                <div className="text-lg font-extrabold text-white">{formatFees(college.fees)}</div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={saved ? "primary" : "secondary"}
                    onClick={toggleSave}
                    aria-pressed={saved}
                  >
                    {saved ? "Saved" : "Save college"}
                  </Button>
                  <Button
                    variant={compared ? "primary" : "ghost"}
                    onClick={toggleCompare}
                    aria-pressed={compared}
                    disabled={!compared && compareCount >= 3}
                  >
                    {compared ? "In Compare" : "Compare"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-7">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div>
                <h2 className="text-lg font-extrabold text-zinc-900">Overview</h2>
                <p className="mt-2 text-sm leading-6 text-zinc-700">{college.description}</p>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-extrabold text-zinc-900">Courses offered</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {college.courses.map((c) => (
                    <span key={c} className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-semibold text-zinc-700">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
              <div className="text-sm font-bold text-zinc-900">Quick facts</div>
              <div className="mt-3 grid gap-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-zinc-700">Fees</span>
                  <span className="font-extrabold text-zinc-900">{formatFees(college.fees)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-zinc-700">Rating</span>
                  <span className="font-extrabold text-zinc-900">{college.rating.toFixed(1)}★</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-zinc-700">Placement</span>
                  <span className="font-extrabold text-zinc-900">{college.placement}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-zinc-700">Location</span>
                  <span className="font-extrabold text-zinc-900 text-right">{college.location}</span>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Button variant="secondary" onClick={() => router.push("/colleges")}>
                  Find more
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    if (compareCount >= 2) router.push("/compare");
                    else router.push("/colleges");
                  }}
                >
                  {compareCount >= 2 ? "Compare" : "Add to compare"}
                </Button>
              </div>

              <div className="mt-3 text-xs text-zinc-600">
                Compare selection supports 2–3 colleges.
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

