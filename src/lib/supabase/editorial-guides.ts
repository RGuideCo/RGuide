"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { applyGuideMediaCache } from "@/lib/guide-media-cache";
import type { MapList } from "@/types";

interface NormalizedGuideRecord {
  list: MapList;
  updated_at: string;
}

interface RenderCacheRecord {
  rendered_payload: MapList;
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
      return { guides: applyGuideMediaCache(guides), error: null };
    }
  } catch {
    // Fall back to the Supabase browser client below when the API is unavailable.
  }

  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    return { guides: [] as MapList[], error: null };
  }

  const { data: normalizedData, error: normalizedError } = await supabase
    .from("entries_maplist")
    .select("list,updated_at")
    .eq("source_table", "editorial_guides")
    .order("updated_at", { ascending: false })
    .returns<NormalizedGuideRecord[]>();

  if (!normalizedError && normalizedData?.length) {
    return {
      guides: applyGuideMediaCache(
        normalizedData.map((record) => ({ ...record.list, updatedAt: record.updated_at })),
      ),
      error: null,
    };
  }

  const { data, error } = await supabase
    .from("entry_render_cache")
    .select("rendered_payload,updated_at")
    .eq("render_format", "maplist")
    .eq("render_version", 1)
    .eq("is_current", true)
    .order("updated_at", { ascending: false })
    .returns<RenderCacheRecord[]>();

  if (error) {
    return { guides: [] as MapList[], error: normalizedError ?? error };
  }

  const guides = applyGuideMediaCache(
    (data ?? []).map((record) => ({
      ...record.rendered_payload,
      updatedAt: record.updated_at,
    })),
  );

  return {
    guides,
    error: null,
  };
}
