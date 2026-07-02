"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { getProfileAvatarUrl, isGeneratedProfileAvatar } from "@/lib/profile-avatar";

interface ProfileInput {
  name: string;
  bio: string;
  avatarFile?: File | null;
  fallbackAvatarUrl: string;
  visibility?: "public" | "private";
}

function getAvatarExtension(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase();
  return extension && /^[a-z0-9]+$/.test(extension) ? extension : "jpg";
}

export async function updateSupabaseProfile({
  name,
  bio,
  avatarFile,
  fallbackAvatarUrl,
  visibility,
}: ProfileInput) {
  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    return {
      avatarUrl: fallbackAvatarUrl,
      error: new Error("Supabase is not configured yet."),
    };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      avatarUrl: fallbackAvatarUrl,
      error: userError ?? new Error("Sign in before updating your profile."),
    };
  }

  let avatarUrl = getProfileAvatarUrl(fallbackAvatarUrl);

  if (avatarFile) {
    const path = `${user.id}/avatar.${getAvatarExtension(avatarFile)}`;
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, avatarFile, {
        cacheControl: "3600",
        contentType: avatarFile.type,
        upsert: true,
      });

    if (uploadError) {
      return { avatarUrl, error: uploadError };
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    avatarUrl = `${data.publicUrl}?v=${Date.now()}`;
  }

  const { error } = await supabase.auth.updateUser({
    data: {
      full_name: name,
      name,
      bio,
      avatar_url: isGeneratedProfileAvatar(avatarUrl) ? null : avatarUrl,
      ...(visibility ? { profile_visibility: visibility } : {}),
    },
  });

  return { avatarUrl, error };
}

export async function updateSupabaseProfileVisibility(visibility: "public" | "private") {
  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    return {
      error: new Error("Supabase is not configured yet."),
    };
  }

  const { error } = await supabase.auth.updateUser({
    data: {
      profile_visibility: visibility,
    },
  });

  return { error };
}
