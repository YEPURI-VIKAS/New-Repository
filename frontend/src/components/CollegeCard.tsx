"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Button } from "./Button";
import type { College } from "@/lib/api";

function formatFees(fees: number) {
  // Show as approx. lakhs/year
  const lakhs = Math.round((fees / 100000) * 10) / 10;
  return `₹ ${lakhs} L/yr`;
}

export function CollegeCard({
  college,
  saved = false,
  compared = false,
  onToggleSave,
  onToggleCompare,
}: {
  college: College;
  saved?: boolean;
  compared?: boolean;
  onToggleSave?: () => void;
  onToggleCompare?: () => void;
}) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-zinc-200/70 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl">
      <div className="relative h-36 sm:h-40">
        <img
          src={college.image}
          alt={college.name}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/15 to-black/0" />
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="truncate text-base font-extrabold tracking-tight text-zinc-900">{college.name}</h3>
            <p className="mt-1 text-sm text-zinc-600">{college.location}</p>
          </div>
          <div className="text-right">
            <div className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-zinc-900 to-zinc-800 px-3 py-1 text-xs font-bold text-white shadow-sm">
              <span className="translate-y-[0.5px]">★</span>
              {college.rating.toFixed(1)}
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="text-sm font-semibold text-zinc-900">{formatFees(college.fees)}</div>
          <div className="text-sm text-zinc-600">{college.placement}% placement</div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {college.courses.slice(0, 3).map((c) => (
            <span
              key={c}
              className="rounded-full border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs text-zinc-700"
            >
              {c}
            </span>
          ))}
          {college.courses.length > 3 ? (
            <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs text-zinc-700">
              +{college.courses.length - 3} more
            </span>
          ) : null}
        </div>

        <div className="mt-4 flex items-center justify-between gap-2">
          <Link href={`/college/${college.id}`}>
            <Button size="sm" variant="secondary">
              View
            </Button>
          </Link>

          <div className="flex items-center gap-2">
            {onToggleCompare ? (
              <Button
                size="sm"
                variant={compared ? "primary" : "ghost"}
                aria-pressed={compared}
                onClick={onToggleCompare}
                type="button"
              >
                {compared ? "In Compare" : "Compare"}
              </Button>
            ) : null}
            {onToggleSave ? (
              <Button
                size="sm"
                variant={saved ? "primary" : "ghost"}
                aria-pressed={saved}
                onClick={onToggleSave}
                type="button"
              >
                {saved ? "Saved" : "Save"}
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

