"use client";

import { useEffect } from "react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useAppStore } from "@/store/app-store";
import type { User } from "@/types";

function getStringMetadata(user: SupabaseUser, key: string) {
  const value = user.user_metadata?.[key];
  return typeof value === "string" ? value : undefined;
}

function getProfileName(user: SupabaseUser) {
  return (
    getStringMetadata(user, "full_name") ??
    getStringMetadata(user, "name") ??
    user.email?.split("@")[0] ??
    "RGuide traveler"
  );
}

function toAppUser(user: SupabaseUser): User {
  const emailKey = encodeURIComponent(user.email ?? user.id);

  return {
    id: user.id,
    name: getProfileName(user),
    email: user.email,
    joinedAt: user.created_at,
    avatar:
      getStringMetadata(user, "avatar_url") ??
      `https://i.pravatar.cc/150?u=${emailKey}`,
    bio:
      getStringMetadata(user, "bio") ??
      "Building a personal city guide with RGuide.",
  };
}

export function AuthSync() {
  const setCurrentUser = useAppStore((state) => state.setCurrentUser);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setCurrentUser(null);
      return;
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ? toAppUser(session.user) : null);
    });

    return () => subscription.unsubscribe();
  }, [setCurrentUser]);

  return null;
}
