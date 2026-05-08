"use client";

import dynamic from "next/dynamic";

import { useAppData } from "@/components/shared/useAppData";
import type { MapList } from "@/types";

const ListGuideWorkspace = dynamic(
  () => import("@/components/list/ListGuideWorkspace").then((module) => module.ListGuideWorkspace),
  {
    ssr: false,
    loading: () => (
      <div className="surface p-5">
        <p className="text-sm font-medium text-slate-900">Preparing the map workspace...</p>
      </div>
    ),
  },
);

export function ListGuideWorkspaceLoader({ list }: { list: MapList }) {
  const { data } = useAppData();

  if (!data) {
    return (
      <div className="surface p-5">
        <p className="text-sm font-medium text-slate-900">Preparing the map workspace...</p>
      </div>
    );
  }

  return <ListGuideWorkspace list={list} continents={data.continents} />;
}
