"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiFetch, type College, type CollegeListResponse } from "@/lib/api";
import { CollegeCard } from "@/components/CollegeCard";
import { Button } from "@/components/Button";
import { SkeletonCollegeCard } from "@/components/Skeleton";
import { getCompareCollegeIds, getSavedCollegeIds, setCompareCollegeIds, setSavedCollegeIds } from "@/lib/storage";

function toNumberOrUndef(v: string | null) {
  if (!v) return undefined;
  const n = Number(v);
  if (!Number.isFinite(n)) return undefined;
  return n;
}

function uniq(arr: string[]) {
  return Array.from(new Set(arr)).sort((a, b) => a.localeCompare(b));
}

export default function CollegesClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialQ = searchParams.get("q") ?? "";
  const initialLocation = searchParams.get("location") ?? "";
  const initialCourse = searchParams.get("course") ?? "";
  const initialFeesMin = toNumberOrUndef(searchParams.get("feesMin"));
  const initialFeesMax = toNumberOrUndef(searchParams.get("feesMax"));
  const initialSort = searchParams.get("sort") ?? "rating_desc";

  const [q, setQ] = useState(initialQ);
  const [location, setLocation] = useState(initialLocation);
  const [course, setCourse] = useState(initialCourse);
  const [feesMin, setFeesMin] = useState<number | undefined>(initialFeesMin);
  const [feesMax, setFeesMax] = useState<number | undefined>(initialFeesMax);
  const [sort, setSort] = useState(initialSort);

  const [items, setItems] = useState<College[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [allForFilters, setAllForFilters] = useState<College[]>([]);

  const [uiRefresh, setUiRefresh] = useState(0);
  void uiRefresh; // used to force rerenders after localStorage updates

  const savedIds = new Set(getSavedCollegeIds());
  const compareIds = new Set(getCompareCollegeIds());

  const locationOptions = useMemo(() => uniq(allForFilters.map((c) => c.location)), [allForFilters]);
  const courseOptions = useMemo(() => uniq(allForFilters.flatMap((c) => c.courses)), [allForFilters]);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiFetch<CollegeListResponse>("/api/colleges?sort=rating_desc&limit=200&page=1");
        setAllForFilters(res.items);
      } catch {
        setAllForFilters([]);
      }
    })();
  }, []);

  useEffect(() => {
    // Keep URL + UI in sync on navigation.
    // Avoid direct setState calls in the effect body (eslint rule) by deferring updates.
    queueMicrotask(() => {
      setQ(initialQ);
      setLocation(initialLocation);
      setCourse(initialCourse);
      setFeesMin(initialFeesMin);
      setFeesMax(initialFeesMax);
      setSort(initialSort);
    });
  }, [initialQ, initialLocation, initialCourse, initialFeesMin, initialFeesMax, initialSort]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setPage(1);
      try {
        const params = new URLSearchParams();
        if (q.trim()) params.set("q", q.trim());
        if (location.trim()) params.set("location", location.trim());
        if (course.trim()) params.set("course", course.trim());
        if (typeof feesMin === "number") params.set("feesMin", String(feesMin));
        if (typeof feesMax === "number") params.set("feesMax", String(feesMax));
        if (sort) params.set("sort", sort);
        params.set("page", "1");
        params.set("limit", "12");

        const res = await apiFetch<CollegeListResponse>(`/api/colleges?${params.toString()}`);
        if (!mounted) return;
        setItems(res.items);
        setTotalPages(res.totalPages);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [q, location, course, feesMin, feesMax, sort]);

  async function loadMore() {
    if (loadingMore) return;
    if (page >= totalPages) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const params = new URLSearchParams();
      if (q.trim()) params.set("q", q.trim());
      if (location.trim()) params.set("location", location.trim());
      if (course.trim()) params.set("course", course.trim());
      if (typeof feesMin === "number") params.set("feesMin", String(feesMin));
      if (typeof feesMax === "number") params.set("feesMax", String(feesMax));
      if (sort) params.set("sort", sort);
      params.set("page", String(nextPage));
      params.set("limit", "12");

      const res = await apiFetch<CollegeListResponse>(`/api/colleges?${params.toString()}`);
      setItems((prev) => [...prev, ...res.items]);
      setPage(nextPage);
      setTotalPages(res.totalPages);
    } finally {
      setLoadingMore(false);
    }
  }

  function toggleCompare(collegeId: string) {
    const current = getCompareCollegeIds();
    const set = new Set(current);
    if (set.has(collegeId)) {
      set.delete(collegeId);
    } else {
      if (set.size >= 3) return;
      set.add(collegeId);
    }
    setCompareCollegeIds(Array.from(set));
    setUiRefresh((x) => x + 1);
  }

  function toggleSave(collegeId: string) {
    const current = getSavedCollegeIds();
    const set = new Set(current);
    if (set.has(collegeId)) set.delete(collegeId);
    else set.add(collegeId);
    setSavedCollegeIds(Array.from(set));
    setUiRefresh((x) => x + 1);
  }

  function applySearchToUrl() {
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (location.trim()) params.set("location", location.trim());
    if (course.trim()) params.set("course", course.trim());
    if (typeof feesMin === "number") params.set("feesMin", String(feesMin));
    if (typeof feesMax === "number") params.set("feesMax", String(feesMax));
    if (sort) params.set("sort", sort);
    router.push(`/colleges?${params.toString()}`);
  }

  const canLoadMore = page < totalPages && items.length > 0;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-xl">
          <h1 className="text-2xl font-extrabold text-zinc-900">College Listings</h1>
          <p className="mt-1 text-sm text-zinc-600">
            Search by name, filter by location/course/fees, and sort by rating or low fees.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <div className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-semibold text-zinc-700">
              Results: {items.length} shown
            </div>
            {totalPages ? (
              <div className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-semibold text-zinc-700">
                Total pages: {totalPages}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-3xl bg-gradient-to-r from-zinc-200/80 via-zinc-200/40 to-zinc-200/80 p-[1px] shadow-sm">
        <div className="rounded-3xl bg-white p-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-zinc-800">Search</span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="e.g., IIT Delhi"
              className="h-11 rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-zinc-900/30 focus:ring-2 focus:ring-zinc-900/10"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-zinc-800">Location</span>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              list="location-options"
              placeholder="City / State"
              className="h-11 rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-zinc-900/30 focus:ring-2 focus:ring-zinc-900/10"
            />
            <datalist id="location-options">
              {locationOptions.map((l) => (
                <option key={l} value={l} />
              ))}
            </datalist>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-zinc-800">Course</span>
            <input
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              list="course-options"
              placeholder="e.g., Computer Science"
              className="h-11 rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-zinc-900/30 focus:ring-2 focus:ring-zinc-900/10"
            />
            <datalist id="course-options">
              {courseOptions.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </label>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-zinc-800">Fees range (INR/year)</span>
            <div className="grid grid-cols-2 gap-2">
              <input
                value={feesMin ?? ""}
                onChange={(e) => setFeesMin(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="Min"
                inputMode="numeric"
                className="h-11 rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-zinc-900/30 focus:ring-2 focus:ring-zinc-900/10"
              />
              <input
                value={feesMax ?? ""}
                onChange={(e) => setFeesMax(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="Max"
                inputMode="numeric"
                className="h-11 rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-zinc-900/30 focus:ring-2 focus:ring-zinc-900/10"
              />
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <label className="flex items-center gap-2">
            <span className="text-sm font-semibold text-zinc-800">Sort</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="h-11 rounded-xl border border-zinc-200 bg-white px-3 text-sm font-semibold text-zinc-800 outline-none focus:border-zinc-900/30 focus:ring-2 focus:ring-zinc-900/10"
            >
              <option value="rating_desc">Rating: High to Low</option>
              <option value="fees_asc">Fees: Low to High</option>
            </select>
          </label>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                setQ("");
                setLocation("");
                setCourse("");
                setFeesMin(undefined);
                setFeesMax(undefined);
                setSort("rating_desc");
                router.push("/colleges");
              }}
            >
              Reset
            </Button>
            <Button onClick={applySearchToUrl}>Apply Filters</Button>
          </div>
        </div>
          </div>
        </div>

      <div className="mt-6">
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <SkeletonCollegeCard key={i} />
            ))}
          </div>
        ) : items.length ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((c) => (
                <CollegeCard
                  key={c.id}
                  college={c}
                  saved={savedIds.has(c.id)}
                  compared={compareIds.has(c.id)}
                  onToggleSave={() => toggleSave(c.id)}
                  onToggleCompare={() => toggleCompare(c.id)}
                />
              ))}
            </div>

            {canLoadMore ? (
              <div className="mt-8 flex justify-center">
                <Button onClick={loadMore} disabled={loadingMore}>
                  {loadingMore ? "Loading..." : "Load more"}
                </Button>
              </div>
            ) : null}
          </>
        ) : (
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 text-center text-sm text-zinc-600 shadow-sm">
            No colleges match your filters.
          </div>
        )}
      </div>
    </main>
  );
}

