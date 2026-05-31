import { NextResponse } from "next/server";

import { checkRateLimit, rateLimitResponse, withRateLimitHeaders } from "@/lib/rate-limit";
import { getServerEditorialGuides } from "@/lib/server-editorial-guides";

const EDITORIAL_GUIDES_CACHE_SECONDS = Number.parseInt(
  process.env.EDITORIAL_GUIDES_CACHE_SECONDS ?? "900",
  10,
);
const cacheSeconds = Number.isFinite(EDITORIAL_GUIDES_CACHE_SECONDS)
  ? EDITORIAL_GUIDES_CACHE_SECONDS
  : 900;

export const revalidate = 900;
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cityName = searchParams.get("city")?.trim() || undefined;
    const rateLimit = checkRateLimit(request, {
      namespace: "editorial-guides",
      limit: 120,
      windowMs: 60_000,
      keyParts: [cityName],
    });

    if (!rateLimit.allowed) {
      return rateLimitResponse(rateLimit);
    }

    return withRateLimitHeaders(
      NextResponse.json(
        { guides: await getServerEditorialGuides({ cityName }) },
        {
          headers: {
            "Cache-Control": `public, s-maxage=${cacheSeconds}, stale-while-revalidate=${cacheSeconds * 4}`,
          },
        },
      ),
      rateLimit,
    );
  } catch (error) {
    console.error("Failed to load editorial guides", error);
    return NextResponse.json({ guides: [] }, { status: 500 });
  }
}
