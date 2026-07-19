import "server-only";

import { unstable_cache } from "next/cache";
import { createClient } from "@supabase/supabase-js";

import { DEFAULT_LOCALE, type AppLocale } from "@/lib/i18n/config";
import type { DestinationRouteTranslation } from "@/lib/i18n/types";

export type { DestinationRouteTranslation } from "@/lib/i18n/types";

export interface LocalePublicationState {
  active: boolean;
  indexable: boolean;
}

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return url && key ? { url, key } : null;
}

const getCachedLocalePublicationState = unstable_cache(
  async (locale: AppLocale): Promise<LocalePublicationState> => {
    if (locale === DEFAULT_LOCALE) return { active: true, indexable: true };
    const config = getSupabaseConfig();
    if (!config) return { active: false, indexable: false };
    const supabase = createClient(config.url, config.key, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { data, error } = await supabase
      .from("content_locales")
      .select("is_active,is_indexable")
      .eq("code", locale)
      .maybeSingle<{ is_active: boolean; is_indexable: boolean }>();
    if (error || !data) return { active: false, indexable: false };
    return { active: data.is_active, indexable: data.is_indexable };
  },
  ["locale-publication-state-v1"],
  { revalidate: 300, tags: ["content-locales"] },
);

export function getLocalePublicationState(locale: AppLocale) {
  return getCachedLocalePublicationState(locale);
}

const getCachedDestinationRouteTranslations = unstable_cache(
  async (locale: AppLocale): Promise<DestinationRouteTranslation[]> => {
    if (locale === DEFAULT_LOCALE) return [];
    const config = getSupabaseConfig();
    if (!config) return [];
    const supabase = createClient(config.url, config.key, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { data, error } = await supabase
      .from("destination_translations")
      .select("display_name,slug,destination:destinations!inner(legacy_id,name,scope)")
      .eq("locale", locale)
      .eq("translation_status", "published");
    if (error || !data) return [];
    return data.flatMap((row) => {
      const destinationValue = row.destination as unknown;
      const destination = Array.isArray(destinationValue) ? destinationValue[0] : destinationValue;
      if (!destination || typeof destination !== "object") return [];
      const value = destination as { legacy_id?: string | null; name?: string; scope?: string };
      if (!value.name || !value.scope) return [];
      return [{
        legacyId: value.legacy_id ?? null,
        sourceName: value.name,
        scope: value.scope,
        displayName: row.display_name,
        slug: row.slug,
      }];
    });
  },
  ["destination-route-translations-v1"],
  { revalidate: 3600, tags: ["destination-translations"] },
);

export function getDestinationRouteTranslations(locale: AppLocale) {
  return getCachedDestinationRouteTranslations(locale);
}

export function findDestinationRouteTranslation(
  translations: DestinationRouteTranslation[],
  destination: { id?: string; name: string; scope?: string },
) {
  return translations.find((translation) =>
    (!destination.scope || translation.scope === destination.scope) &&
    (translation.legacyId === destination.id || translation.sourceName === destination.name),
  );
}
