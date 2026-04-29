"use client";

import Link from "next/link";
import { Button } from "./Button";

export function EmptyState({
  title,
  description,
  ctaHref,
  ctaText,
}: {
  title: string;
  description?: string;
  ctaHref?: string;
  ctaText?: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-center shadow-sm">
      <h3 className="text-base font-semibold text-zinc-900">{title}</h3>
      {description ? <p className="mt-1 text-sm text-zinc-600">{description}</p> : null}
      {ctaHref && ctaText ? (
        <div className="mt-4">
          <Link href={ctaHref} className="inline-block">
            <Button variant="primary">{ctaText}</Button>
          </Link>
        </div>
      ) : null}
    </div>
  );
}

