"use client";

export function Skeleton({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-zinc-200/70 dark:bg-zinc-800/50 ${className}`}
      aria-hidden="true"
    />
  );
}

export function SkeletonCollegeCard() {
  return (
    <div className="rounded-3xl border border-zinc-200/70 bg-white p-0 shadow-sm">
      <div className="relative h-40 overflow-hidden rounded-t-3xl">
        <Skeleton className="absolute inset-0 rounded-t-3xl" />
      </div>
      <div className="p-4">
        <Skeleton className="h-5 w-4/5" />
        <div className="mt-3">
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-14" />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}

