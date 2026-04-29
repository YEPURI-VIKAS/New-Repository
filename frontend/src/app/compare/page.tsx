"use client";

import { type ReactNode, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, type College } from "@/lib/api";
import { Button } from "@/components/Button";
import { Spinner } from "@/components/Spinner";
import { EmptyState } from "@/components/EmptyState";
import { clearCompareCollegeIds, getCompareCollegeIds, setCompareCollegeIds } from "@/lib/storage";

type CompareRow = {
  label: string;
  render: (c: College) => ReactNode;
};

export default function ComparePage() {
  const router = useRouter();
  const [ids, setIds] = useState<string[]>(() => getCompareCollegeIds());
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        if (!ids.length) {
          setColleges([]);
          return;
        }
        const results = await Promise.all(
          ids.map((id) => apiFetch<College>(`/api/colleges/${id}`).catch(() => null)),
        );
        const cleaned = results.filter(Boolean) as College[];
        if (!mounted) return;
        setColleges(cleaned);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [ids]);

  const rows: CompareRow[] = useMemo(
    () => [
      { label: "Name", render: (c) => c.name },
      { label: "Fees (INR/year)", render: (c) => `₹ ${Math.round((c.fees / 100000) * 10) / 10} L/yr` },
      { label: "Rating", render: (c) => `${c.rating.toFixed(1)} ★` },
      { label: "Placement", render: (c) => `${c.placement}%` },
      { label: "Location", render: (c) => c.location },
      { label: "Courses", render: (c) => c.courses.slice(0, 4).join(", ") + (c.courses.length > 4 ? "..." : "") },
    ],
    [],
  );

  function remove(id: string) {
    const next = ids.filter((x) => x !== id);
    setCompareCollegeIds(next);
    setIds(next);
  }

  function clearAll() {
    clearCompareCollegeIds();
    setIds([]);
    setColleges([]);
  }

  if (!ids.length) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8">
        <EmptyState
          title="No colleges selected"
          description="Pick 2–3 colleges to compare. Use the Compare button on a college card."
          ctaHref="/colleges"
          ctaText="Browse colleges"
        />
      </main>
    );
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

  if (ids.length < 2) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8">
        <EmptyState
          title="Select at least 2 colleges"
          description="Add one more college to unlock a proper comparison table."
          ctaHref="/colleges"
          ctaText="Find another college"
        />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-900">Compare Colleges</h1>
          <p className="mt-1 text-sm text-zinc-600">
            Professional comparison across fees, placements, rating, and course offerings.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => router.push("/colleges")}>
            Add more
          </Button>
          <Button variant="ghost" onClick={clearAll}>
            Clear
          </Button>
        </div>
      </div>

      <div className="mt-6 rounded-3xl bg-gradient-to-r from-zinc-200/80 via-zinc-200/40 to-zinc-200/80 p-[1px] shadow-sm">
        <div className="rounded-3xl bg-white p-4">
        <div className="hidden overflow-hidden rounded-2xl border border-zinc-200 sm:block">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-zinc-50 to-zinc-100/50">
                <th className="w-[200px] px-4 py-3 text-left text-sm font-bold text-zinc-900">Field</th>
                {colleges.map((c) => (
                  <th key={c.id} className="px-4 py-3 text-left align-top">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-sm font-extrabold text-zinc-900">{c.name}</div>
                        <div className="mt-1 text-xs font-semibold text-zinc-600">{c.location}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(c.id)}
                        className="rounded-lg border border-zinc-200 bg-white/80 px-2 py-1 text-xs font-bold text-zinc-700 hover:bg-white"
                        aria-label={`Remove ${c.name}`}
                      >
                        Remove
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="border-t border-zinc-200">
                  <td className="px-4 py-3 text-sm font-semibold text-zinc-900">{row.label}</td>
                  {colleges.map((c) => (
                    <td key={c.id} className="px-4 py-3 text-sm text-zinc-700">
                      {row.render(c)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="sm:hidden">
          <div className="flex flex-col gap-4">
            {colleges.map((c) => (
              <div key={c.id} className="rounded-3xl border border-zinc-200/70 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-base font-extrabold text-zinc-900">{c.name}</div>
                    <div className="mt-1 text-sm text-zinc-600">{c.location}</div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => remove(c.id)}>
                    Remove
                  </Button>
                </div>

                <div className="mt-3 grid gap-2">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-semibold text-zinc-600">Fees</div>
                    <div className="text-sm font-bold text-zinc-900">{`₹ ${Math.round((c.fees / 100000) * 10) / 10} L/yr`}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-semibold text-zinc-600">Rating</div>
                    <div className="text-sm font-bold text-zinc-900">{c.rating.toFixed(1)} ★</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-semibold text-zinc-600">Placement</div>
                    <div className="text-sm font-bold text-zinc-900">{c.placement}%</div>
                  </div>
                  <div className="mt-2 text-xs font-semibold text-zinc-600">Courses</div>
                  <div className="text-sm text-zinc-700">{c.courses.join(", ")}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>
      </div>
    </main>
  );
}

