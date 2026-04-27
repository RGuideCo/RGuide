import Link from "next/link";

import { EmptyState } from "@/components/shared/EmptyState";

export default function NotFound() {
  return (
    <div className="page-shell py-16">
      <EmptyState
        title="Page not found"
        description="The destination, list, or profile you requested is not available in this mock dataset yet."
      />
      <div className="mt-6 text-center">
        <Link href="/" className="rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white">
          Return home
        </Link>
      </div>
    </div>
  );
}
