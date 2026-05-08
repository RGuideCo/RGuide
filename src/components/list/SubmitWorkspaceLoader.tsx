"use client";

import dynamic from "next/dynamic";

import { useAppData } from "@/components/shared/useAppData";

const SubmitWorkspace = dynamic(
  () => import("@/components/list/SubmitWorkspace").then((module) => module.SubmitWorkspace),
  {
    ssr: false,
    loading: () => (
      <div className="surface p-5">
        <p className="text-sm font-medium text-slate-900">Preparing the submission workspace...</p>
      </div>
    ),
  },
);

export function SubmitWorkspaceLoader() {
  const { data } = useAppData();

  if (!data) {
    return (
      <div className="surface p-5">
        <p className="text-sm font-medium text-slate-900">Preparing the submission workspace...</p>
      </div>
    );
  }

  return <SubmitWorkspace continents={data.continents} />;
}
