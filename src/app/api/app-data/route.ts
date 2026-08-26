import { NextResponse } from "next/server";

import { getClientGeography } from "@/lib/client-geography";
import { getContinentsWithDestinationDescriptions } from "@/lib/destination-descriptions";
import { DEFAULT_LOCALE, isSupportedLocale } from "@/lib/i18n/config";
import { checkRateLimit, rateLimitResponse, withRateLimitHeaders } from "@/lib/rate-limit";
import { getServerEditorialGuides } from "@/lib/server-editorial-guides";

const APP_DATA_CACHE_SECONDS = Number.parseInt(process.env.APP_DATA_CACHE_SECONDS ?? "21600", 10);
const cacheSeconds = Number.isFinite(APP_DATA_CACHE_SECONDS) ? APP_DATA_CACHE_SECONDS : 21600;
const APP_DATA_SCOPED_CACHE_SECONDS = Number.parseInt(
  process.env.APP_DATA_SCOPED_CACHE_SECONDS ?? "60",
  10,
);
const scopedCacheSeconds = Number.isFinite(APP_DATA_SCOPED_CACHE_SECONDS)
  ? Math.max(0, APP_DATA_SCOPED_CACHE_SECONDS)
  : 60;

export const revalidate = 21600;
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const requestedLocale = searchParams.get("locale")?.trim() || DEFAULT_LOCALE;
    if (!isSupportedLocale(requestedLocale)) {
      return NextResponse.json({ error: "Unsupported locale" }, { status: 400 });
    }
    const locale = requestedLocale;
    const cityName = searchParams.get("city")?.trim() || undefined;
    const countryName = cityName ? undefined : searchParams.get("country")?.trim() || undefined;
    const continentName = cityName || countryName
      ? undefined
      : searchParams.get("continent")?.trim() || undefined;
    const isDestinationScoped = Boolean(cityName || countryName || continentName);
    const rateLimit = await checkRateLimit(request, {
      namespace: "app-data",
      limit: 120,
      windowMs: 60_000,
      keyParts: [locale, cityName, countryName, continentName],
    });

    if (!rateLimit.allowed) {
      return rateLimitResponse(rateLimit);
    }

    const [continents, guides] = await Promise.all([
      getContinentsWithDestinationDescriptions({ forceDatabase: true, locale }),
      getServerEditorialGuides({
        cityName,
        countryName,
        continentName,
        locale,
        bypassCache: isDestinationScoped,
      }),
    ]);

    const clientContinents = getClientGeography(continents, { cityName, countryName, continentName });
    const cacheControl = isDestinationScoped
      ? guides.length > 0 && scopedCacheSeconds > 0
        // Keep repeat navigation fast without recreating the old long-lived stale/empty cache failure.
        ? `public, max-age=0, s-maxage=${scopedCacheSeconds}, must-revalidate`
        : "no-store, max-age=0"
      : `public, s-maxage=${cacheSeconds}, stale-while-revalidate=${cacheSeconds * 4}`;

    return withRateLimitHeaders(
      NextResponse.json(
        { continents: clientContinents, guides, locale },
        {
          headers: {
            "Cache-Control": cacheControl,
          },
        },
      ),
      rateLimit,
    );
  } catch (error) {
    console.error("Failed to load app data", error);
    return NextResponse.json({ continents: [], guides: [] }, { status: 500 });
  }
}
