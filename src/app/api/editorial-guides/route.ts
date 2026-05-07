import { NextResponse } from "next/server";

import { getServerEditorialGuides } from "@/lib/server-editorial-guides";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    return NextResponse.json(
      { guides: await getServerEditorialGuides() },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    console.error("Failed to load editorial guides", error);
    return NextResponse.json({ guides: [] }, { status: 500 });
  }
}
