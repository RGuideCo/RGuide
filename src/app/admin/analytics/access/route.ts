import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

const ANALYTICS_ACCESS_COOKIE = "rguide_analytics_access";

function getAnalyticsAccessToken() {
  return process.env.ANALYTICS_DASHBOARD_TOKEN?.trim() || null;
}

function isValidAccessToken(candidate: string | null) {
  const token = getAnalyticsAccessToken();

  if (!token || !candidate) {
    return false;
  }

  const tokenBuffer = Buffer.from(token);
  const candidateBuffer = Buffer.from(candidate);

  return (
    tokenBuffer.length === candidateBuffer.length &&
    timingSafeEqual(tokenBuffer, candidateBuffer)
  );
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const token = formData.get("token");
  const isValid = isValidAccessToken(typeof token === "string" ? token : null);
  const redirectUrl = new URL("/admin/analytics", request.url);

  if (!isValid) {
    redirectUrl.searchParams.set("error", "1");
    return NextResponse.redirect(redirectUrl, { status: 303 });
  }

  const response = NextResponse.redirect(redirectUrl, { status: 303 });

  response.cookies.set(ANALYTICS_ACCESS_COOKIE, token as string, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin/analytics",
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
}
