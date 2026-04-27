"use client";

import { useRouter } from "next/navigation";

import { MapListCard } from "@/components/cards/MapListCard";
import { getListHref } from "@/lib/routes";
import { MapList } from "@/types";

interface ExperienceExpandableCardProps {
  list: MapList;
}

export function ExperienceExpandableCard({ list }: ExperienceExpandableCardProps) {
  const router = useRouter();

  return (
    <MapListCard
      list={list}
      expandable
      expanded={false}
      onToggleExpand={(target) => {
        router.push(getListHref(target));
      }}
    />
  );
}

