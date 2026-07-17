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

const MAX_AVATAR_BYTES = 5 * 1024 * 1024;
const AVATAR_EXTENSION_BY_MIME_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

function getAvatarExtension(file: File) {
  return AVATAR_EXTENSION_BY_MIME_TYPE[file.type] ?? null;
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
    const extension = getAvatarExtension(avatarFile);
    if (!extension) {
      return {
        avatarUrl,
        error: new Error("Use a JPEG, PNG, or WebP profile image."),
      };
    }

    if (avatarFile.size > MAX_AVATAR_BYTES) {
      return {
        avatarUrl,
        error: new Error("Profile images must be 5 MB or smaller."),
      };
    }

    const path = `${user.id}/avatar.${extension}`;
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
