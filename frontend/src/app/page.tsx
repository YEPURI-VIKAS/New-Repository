"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, type College, type CollegeListResponse } from "@/lib/api";
import { Button } from "@/components/Button";
import { CollegeCard } from "@/components/CollegeCard";
import { Spinner } from "@/components/Spinner";

export default function Home() {
  const router = useRouter();
  const [featured, setFeatured] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await apiFetch<CollegeListResponse>(
          "/api/colleges?sort=rating_desc&limit=6&page=1",
        );
        if (!mounted) return;
        setFeatured(res.items);
      } catch {
        if (!mounted) return;
        setFeatured([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  function onSearch() {
    const q = query.trim();
    router.push(q ? `/colleges?q=${encodeURIComponent(q)}` : "/colleges");
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <section className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
        <div className="absolute inset-0 bg-[radial-gradient(65%_60%_at_20%_10%,rgba(24,24,27,0.10)_0%,rgba(24,24,27,0)_60%),radial-gradient(45%_50%_at_85%_15%,rgba(63,63,70,0.10)_0%,rgba(63,63,70,0)_60%)]" />
        <div className="relative p-6 sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-4 py-2 text-xs font-bold text-white">
                Premium college discovery
              </div>
              <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-zinc-900 sm:text-4xl">
                Find your best-fit college with confidence.
              </h1>
              <p className="mt-3 text-zinc-600">
                Search, compare, and save colleges based on fees, ratings, placements,
                and course offerings.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" onClick={() => router.push("/colleges")}>
                  Explore Colleges
                </Button>
                <Button variant="secondary" size="lg" onClick={() => router.push("/compare")}>
                  Compare Now
                </Button>
              </div>
            </div>

            <div className="w-full lg:max-w-md">
              <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
                <div className="text-sm font-semibold text-zinc-800">Start with a search</div>
                <div className="mt-3 flex gap-2">
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by college name (e.g., IIT Delhi)"
                    className="h-11 flex-1 rounded-full border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-zinc-900/30 focus:ring-2 focus:ring-zinc-900/10"
                  />
                  <Button size="md" onClick={onSearch}>
                    Search
                  </Button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {["IIT Delhi", "NIT Trichy", "BITS Pilani", "VIT"].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => router.push(`/colleges?q=${encodeURIComponent(s)}`)}
                      className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-semibold text-zinc-800 hover:bg-zinc-100 transition"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              { title: "Fees + placements", desc: "Transparent comparison for faster decisions." },
              { title: "Course-based filtering", desc: "Find colleges offering what you need." },
              { title: "Save favorites", desc: "Keep your shortlist ready for later." },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border border-zinc-200 bg-white p-4">
                <div className="text-sm font-bold text-zinc-900">{f.title}</div>
                <div className="mt-1 text-sm text-zinc-600">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-zinc-900">Featured colleges</h2>
            <p className="mt-1 text-sm text-zinc-600">Top picks based on rating and placement outcomes.</p>
          </div>
          <Button variant="secondary" onClick={() => router.push("/colleges")}>
            View all
          </Button>
        </div>

        {loading ? (
          <div className="mt-6 flex items-center justify-center">
            <Spinner />
          </div>
        ) : featured.length ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((c) => (
              <CollegeCard key={c.id} college={c} />
            ))}
          </div>
        ) : (
          <div className="mt-6 text-center text-sm text-zinc-600">Unable to load featured colleges.</div>
        )}
      </section>
    </main>
  );
}
