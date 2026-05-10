import type { Metadata } from "next";
import { Suspense } from "react";

import { SubmitWorkspaceLoader } from "@/components/list/SubmitWorkspaceLoader";

export const metadata: Metadata = {
  title: "Submit a List",
  description: "Front-end submission flow for curated travel guides on RGuide.",
  alternates: {
    canonical: "/submit",
  },
};

export default function SubmitPage() {
  return (
    <div className="mx-auto w-full max-w-[1600px] px-3 py-10 sm:px-4 lg:px-6">
      <Suspense
        fallback={
          <div className="surface p-5">
            <p className="text-sm font-medium text-slate-900">Preparing the submission workspace...</p>
          </div>
        }
      >
        <SubmitWorkspaceLoader />
      </Suspense>
    </div>
  );
}
