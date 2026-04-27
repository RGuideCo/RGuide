"use client";

import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="page-shell flex min-h-screen items-center justify-center py-16">
      <div className="surface max-w-xl p-8 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-orange-600">Error state</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">Something went wrong</h1>
        <p className="mt-3 text-sm text-slate-600">
          {error.message || "An unexpected rendering error occurred."}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700"
          >
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}
