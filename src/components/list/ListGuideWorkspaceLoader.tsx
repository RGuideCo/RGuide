"use client";

import dynamic from "next/dynamic";

import { useAppData } from "@/components/shared/useAppData";
import type { Continent } from "@/types";
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

type ListGuideWorkspaceLoaderProps = {
  list: MapList;
  continents?: Continent[];
};

function ListGuideWorkspaceLoaderClient({ list }: { list: MapList }) {
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

export function ListGuideWorkspaceLoader({ list, continents }: ListGuideWorkspaceLoaderProps) {
  if (continents) {
    return <ListGuideWorkspace list={list} continents={continents} />;
  }

  return <ListGuideWorkspaceLoaderClient list={list} />;
}
