"use client";

import { useEffect } from "react";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { loadEditorialGuides } from "@/lib/supabase/editorial-guides";
import { loadSubmittedGuides } from "@/lib/supabase/submitted-guides";
import { useAppStore } from "@/store/app-store";

const ENABLE_EDITORIAL_REALTIME =
  process.env.NEXT_PUBLIC_ENABLE_EDITORIAL_REALTIME === "1";

export function SubmittedGuidesSync() {
  const setEditorialLists = useAppStore((state) => state.setEditorialLists);
  const setSubmittedLists = useAppStore((state) => state.setSubmittedLists);

  useEffect(() => {
    let isMounted = true;
    const supabase = getSupabaseBrowserClient();

    async function refreshEditorialGuides() {
      const { guides, error } = await loadEditorialGuides();

      if (!isMounted || error || !guides.length) {
        return;
      }

      setEditorialLists(guides);
    }

    async function refreshSubmittedGuides() {
      const { guides, error } = await loadSubmittedGuides();

      if (!isMounted || error) {
        return;
      }

      setSubmittedLists(guides);
    }

    if (ENABLE_EDITORIAL_REALTIME) {
      void refreshEditorialGuides();
    }
    void refreshSubmittedGuides();

    if (!supabase) {
      return () => {
        isMounted = false;
      };
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      void refreshSubmittedGuides();
    });
    const normalizedContentChannel = ENABLE_EDITORIAL_REALTIME
      ? supabase
          .channel("normalized-content-sync")
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "entries" },
            () => {
              void refreshEditorialGuides();
            },
          )
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "entry_render_cache" },
            () => {
              void refreshEditorialGuides();
            },
          )
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "weekly_event_publications" },
            () => {
              void refreshEditorialGuides();
            },
          )
          .subscribe()
      : null;

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      if (normalizedContentChannel) {
        void supabase.removeChannel(normalizedContentChannel);
      }
    };
  }, [setEditorialLists, setSubmittedLists]);

  return null;
}
