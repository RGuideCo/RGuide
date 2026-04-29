"use client";

import { useMemo } from "react";

import { MapListCard } from "@/components/cards/MapListCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { getEditorialLists, useAppStore } from "@/store/app-store";

export default function FavoritesPage() {
  const favoriteIds = useAppStore((state) => state.favoriteIds);
  const editorialLists = useAppStore((state) => state.editorialLists);
  const submittedLists = useAppStore((state) => state.submittedLists);

  const lists = useMemo(() => {
    const merged = [...submittedLists, ...getEditorialLists(editorialLists)];
    return merged.filter((list) => favoriteIds.includes(list.id));
  }, [editorialLists, favoriteIds, submittedLists]);

  return (
    <div className="page-shell py-10">
      <div className="max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-orange-600">Favorites</p>
        <h1 className="mt-2 text-4xl font-semibold text-slate-900">Saved lists for later planning</h1>
        <p className="mt-3 text-slate-600">
          Favorites persist in local demo state across pages. TODO: sync this to authenticated user profiles later.
        </p>
      </div>
      <div className="mt-8 space-y-4">
        {lists.length ? (
          lists.map((list) => <MapListCard key={list.id} list={list} />)
        ) : (
          <EmptyState
            title="No favorites yet"
            description="Save lists from city, category, or list detail pages and they will appear here."
          />
        )}
      </div>
    </div>
  );
}
