"use client";

import { useEffect } from "react";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { loadSubmittedGuides } from "@/lib/supabase/submitted-guides";
import { useAppStore } from "@/store/app-store";

export function SubmittedGuidesSync() {
  const setSubmittedLists = useAppStore((state) => state.setSubmittedLists);

  useEffect(() => {
    let isMounted = true;
    const supabase = getSupabaseBrowserClient();

    async function refreshSubmittedGuides() {
      const { guides, error } = await loadSubmittedGuides();

      if (!isMounted || error) {
        return;
      }

      setSubmittedLists(guides);
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

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [setSubmittedLists]);

  return null;
}
