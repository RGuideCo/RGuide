import { NextResponse } from "next/server";

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

export async function GET() {
  try {
    return NextResponse.json(
      { guides: await getServerEditorialGuides() },
      {
        headers: {
          "Cache-Control": `public, s-maxage=${cacheSeconds}, stale-while-revalidate=${cacheSeconds * 4}`,
        },
      },
    );
  } catch (error) {
    console.error("Failed to load editorial guides", error);
    return NextResponse.json({ guides: [] }, { status: 500 });
  }
}
