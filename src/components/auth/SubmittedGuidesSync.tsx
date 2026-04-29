"use client";

import { useEffect } from "react";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { loadEditorialGuides } from "@/lib/supabase/editorial-guides";
import { loadSubmittedGuides } from "@/lib/supabase/submitted-guides";
import { useAppStore } from "@/store/app-store";

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

    void refreshEditorialGuides();
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
    const editorialChannel = supabase
      .channel("editorial-guides-sync")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "editorial_guides" },
        () => {
          void refreshEditorialGuides();
        },
      )
      .subscribe();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      void supabase.removeChannel(editorialChannel);
    };
  }, [setEditorialLists, setSubmittedLists]);

  return null;
}
