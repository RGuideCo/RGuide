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

function getStringAppMetadata(user: SupabaseUser, key: string) {
  const value = user.app_metadata?.[key];
  return typeof value === "string" ? value : undefined;
}

function getBooleanAppMetadata(user: SupabaseUser, key: string) {
  const value = user.app_metadata?.[key];
  return typeof value === "boolean" ? value : undefined;
}

function getProfileName(user: SupabaseUser) {
  return (
    getStringMetadata(user, "full_name") ??
    getStringMetadata(user, "name") ??
    user.email?.split("@")[0] ??
    "RGuide traveler"
  );
}

function canPublishGuides(user: SupabaseUser) {
  if (
    getBooleanAppMetadata(user, "can_publish_guides") === true ||
    getBooleanAppMetadata(user, "rguide_can_publish_guides") === true
  ) {
    return true;
  }

  const userType =
    getStringAppMetadata(user, "rguide_user_type") ??
    getStringAppMetadata(user, "user_type") ??
    getStringAppMetadata(user, "role");

  return ["admin", "editor", "publisher", "guide_publisher"].includes(
    userType?.toLowerCase() ?? "",
  );
}

function toAppUser(user: SupabaseUser): User {
  const emailKey = encodeURIComponent(user.email ?? user.id);
  const userType =
    getStringAppMetadata(user, "rguide_user_type") ??
    getStringAppMetadata(user, "user_type") ??
    getStringAppMetadata(user, "role");

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
    canPublishGuides: canPublishGuides(user),
    userType,
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
