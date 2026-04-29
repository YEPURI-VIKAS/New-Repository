"use client";

export function Spinner({ className = "" }: { className?: string }) {
  return (
    <div
      className={`h-6 w-6 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-900 ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}

