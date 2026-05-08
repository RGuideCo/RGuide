import { NextResponse } from "next/server";

import { getContinentsWithDestinationDescriptions } from "@/lib/destination-descriptions";
import { getServerEditorialGuides } from "@/lib/server-editorial-guides";

const APP_DATA_CACHE_SECONDS = Number.parseInt(process.env.APP_DATA_CACHE_SECONDS ?? "900", 10);
const cacheSeconds = Number.isFinite(APP_DATA_CACHE_SECONDS) ? APP_DATA_CACHE_SECONDS : 900;

export const revalidate = 900;
export const runtime = "nodejs";

export async function GET() {
  try {
    const [continents, guides] = await Promise.all([
      getContinentsWithDestinationDescriptions(),
      getServerEditorialGuides(),
    ]);

    return NextResponse.json(
      { continents, guides },
      {
        headers: {
          "Cache-Control": `public, s-maxage=${cacheSeconds}, stale-while-revalidate=${cacheSeconds * 4}`,
        },
      },
    );
  } catch (error) {
    console.error("Failed to load app data", error);
    return NextResponse.json({ continents: [], guides: [] }, { status: 500 });
  }
}
