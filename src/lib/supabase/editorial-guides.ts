"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { applyEditorialPoiPhotos } from "@/lib/editorial-guides-shared";
import type { EditorialPoiPhotoRecord } from "@/lib/editorial-guides-shared";
import type { MapList } from "@/types";

interface EditorialGuideRecord {
  id: string;
  list: MapList;
  updated_at: string;
}

async function loadEditorialGuidesFromApi() {
  const response = await fetch("/api/editorial-guides");

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
    .returns<EditorialPoiPhotoRecord[]>();
  const guides = (data ?? []).map((record) => record.list);

  return {
    guides: applyEditorialPoiPhotos(guides, pois ?? []),
    error: null,
  };
}
