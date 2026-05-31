import { NextResponse } from "next/server";

import { getContinentsWithDestinationDescriptions } from "@/lib/destination-descriptions";
import { checkRateLimit, rateLimitResponse, withRateLimitHeaders } from "@/lib/rate-limit";
import { getServerEditorialGuides } from "@/lib/server-editorial-guides";

const APP_DATA_CACHE_SECONDS = Number.parseInt(process.env.APP_DATA_CACHE_SECONDS ?? "900", 10);
const cacheSeconds = Number.isFinite(APP_DATA_CACHE_SECONDS) ? APP_DATA_CACHE_SECONDS : 900;

export const revalidate = 900;
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cityName = searchParams.get("city")?.trim() || undefined;
    const rateLimit = checkRateLimit(request, {
      namespace: "app-data",
      limit: 120,
      windowMs: 60_000,
      keyParts: [cityName],
    });

    if (!rateLimit.allowed) {
      return rateLimitResponse(rateLimit);
    }

    const [continents, guides] = await Promise.all([
      getContinentsWithDestinationDescriptions({ forceDatabase: true }),
      getServerEditorialGuides({ cityName }),
    ]);

    return withRateLimitHeaders(
      NextResponse.json(
        { continents, guides },
        {
          headers: {
            "Cache-Control": `public, s-maxage=${cacheSeconds}, stale-while-revalidate=${cacheSeconds * 4}`,
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
