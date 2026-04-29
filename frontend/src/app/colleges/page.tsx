"use client";

import { Suspense } from "react";
import { Spinner } from "@/components/Spinner";
import CollegesClient from "./CollegesClient";

export default function CollegesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-10">
          <Spinner />
        </div>
      }
    >
      <CollegesClient />
    </Suspense>
  );
}

