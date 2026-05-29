"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { MapList } from "@/types";

interface SubmittedGuideRecord {
  list: MapList;
  updated_at: string;
}

function errorFromMessage(message: string) {
  return new Error(message);
}

async function getAuthHeader() {
  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    return { supabase: null, authorization: null, error: null };
  }

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session?.access_token) {
    return {
      supabase,
      authorization: null,
      error: error ?? errorFromMessage("Sign in before saving."),
    };
  }

  return {
    supabase,
    authorization: `Bearer ${session.access_token}`,
    error: null,
  };
}

async function parseResponseError(response: Response) {
  try {
    const payload = (await response.json()) as { error?: string };
    return errorFromMessage(payload.error || "Request failed.");
  } catch {
    return errorFromMessage("Request failed.");
  }
}

export async function loadSubmittedGuides() {
  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    return { guides: [] as MapList[], error: null };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { guides: [] as MapList[], error: userError };
  }

  const { data, error } = await supabase
    .from("entries_maplist")
    .select("list,updated_at")
    .eq("source_table", "submitted_guides")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .returns<SubmittedGuideRecord[]>();

  if (error) {
    return { guides: [] as MapList[], error };
  }

  return {
    guides: (data ?? []).map((record) => record.list),
    error: null,
  };
}

export async function saveSubmittedGuide(list: MapList) {
  const { authorization, error } = await getAuthHeader();

  if (error || !authorization) {
    return { guide: null as MapList | null, error };
  }

  const response = await fetch("/api/submitted-guides", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authorization,
    },
    body: JSON.stringify({ list }),
  });

  if (!response.ok) {
    return { guide: null as MapList | null, error: await parseResponseError(response) };
  }

  const payload = (await response.json()) as { guide?: MapList };
  return { guide: payload.guide ?? list, error: null };
}

export async function deleteSubmittedGuide(listId: string) {
  const { authorization, error } = await getAuthHeader();

  if (error || !authorization) {
    return { error };
  }

  const response = await fetch(`/api/submitted-guides?id=${encodeURIComponent(listId)}`, {
    method: "DELETE",
    headers: {
      Authorization: authorization,
    },
  });

  if (!response.ok) {
    return { error: await parseResponseError(response) };
  }

  return { error: null };
}
