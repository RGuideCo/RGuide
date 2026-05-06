"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { GuideStop, MapList } from "@/types";

interface EditorialGuideRecord {
  id: string;
  list: MapList;
  updated_at: string;
}

interface EditorialPoiRecord {
  id: string;
  photo: string | null;
}

function applyPoiPhotos(guides: MapList[], pois: EditorialPoiRecord[]) {
  const photoByPoiId = new Map(
    pois
      .filter((poi) => poi.photo)
      .map((poi) => [poi.id, poi.photo as string]),
  );
  const applyStopPhoto = (stop: GuideStop): GuideStop => ({
    ...stop,
    photo: stop.poiId ? photoByPoiId.get(stop.poiId) ?? stop.photo : stop.photo,
    places: stop.places?.map(applyStopPhoto),
  });

  return guides.map((guide) => ({
    ...guide,
    stops: guide.stops.map(applyStopPhoto),
  }));
}

async function loadEditorialGuidesFromApi() {
  const response = await fetch("/api/editorial-guides", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Editorial guide API returned ${response.status}`);
  }

  const payload = (await response.json()) as { guides?: MapList[] };
  return payload.guides ?? [];
}

export async function loadEditorialGuides() {
  try {
    const guides = await loadEditorialGuidesFromApi();

    if (guides.length) {
      return { guides, error: null };
    }
  } catch {
    // Fall back to the Supabase browser client below when the API is unavailable.
  }

  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    return { guides: [] as MapList[], error: null };
  }

  const { data, error } = await supabase
    .from("editorial_guides")
    .select("id,list,updated_at")
    .order("updated_at", { ascending: false })
    .returns<EditorialGuideRecord[]>();

  if (error) {
    return { guides: [] as MapList[], error };
  }

  const { data: pois } = await supabase
    .from("editorial_pois")
    .select("id,photo")
    .returns<EditorialPoiRecord[]>();
  const guides = (data ?? []).map((record) => record.list);

  return {
    guides: applyPoiPhotos(guides, pois ?? []),
    error: null,
  };
}
