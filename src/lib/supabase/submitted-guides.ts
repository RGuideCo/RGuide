"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { MapList } from "@/types";

interface SubmittedGuideRecord {
  id: string;
  user_id: string;
  list: MapList;
  updated_at: string;
}

export async function loadSubmittedGuides() {
  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    return { guides: [] as MapList[], error: null };
  }

  const { data, error } = await supabase
    .from("submitted_guides")
    .select("id,user_id,list,updated_at")
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
  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    return { error: null };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: userError };
  }

  const { error } = await supabase.from("submitted_guides").upsert({
    id: list.id,
    user_id: user.id,
    list,
  });

  return { error };
}

export async function deleteSubmittedGuide(listId: string) {
  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    return { error: null };
  }

  const { error } = await supabase.from("submitted_guides").delete().eq("id", listId);

  return { error };
}
