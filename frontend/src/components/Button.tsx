"use client";

import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: Props) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60";

  const sizeClasses =
    size === "sm"
      ? "h-9 px-3 text-sm"
      : size === "lg"
        ? "h-12 px-6 text-base"
        : "h-10 px-5 text-sm";

  const variantClasses =
    variant === "secondary"
      ? "bg-white text-zinc-900 border border-zinc-200 shadow-sm hover:bg-zinc-50 focus:ring-zinc-900/20"
      : variant === "ghost"
        ? "bg-transparent text-zinc-800 hover:bg-zinc-100 focus:ring-zinc-900/10"
        : "text-white bg-gradient-to-b from-zinc-900 to-zinc-800 shadow-sm hover:from-zinc-800 hover:to-zinc-800 focus:ring-zinc-900/30";

  const focusRing =
    variant === "primary"
      ? "focus:ring-zinc-900/30"
      : variant === "secondary"
        ? "focus:ring-zinc-900/20"
        : "focus:ring-zinc-900/10";

  return (
    <button
      className={`${base} ${focusRing} ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    />
  );
}

