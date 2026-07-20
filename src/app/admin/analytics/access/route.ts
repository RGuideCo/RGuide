import { NextResponse } from "next/server";

import {
  ANALYTICS_ACCESS_COOKIE,
  ANALYTICS_SESSION_MAX_AGE_SECONDS,
  createAnalyticsAccessSession,
  isValidAnalyticsAccessToken,
} from "@/lib/analytics-access";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const rateLimit = await checkRateLimit(request, {
    namespace: "analytics-dashboard-access",
    limit: 10,
    windowMs: 15 * 60 * 1000,
  });

  if (!rateLimit.allowed) {
    return rateLimitResponse(rateLimit);
  }

  const formData = await request.formData();
  const token = formData.get("token");
  const isValid = isValidAnalyticsAccessToken(typeof token === "string" ? token : null);
  const redirectUrl = new URL("/admin/analytics", request.url);

  if (!isValid) {
    redirectUrl.searchParams.set("error", "1");
    return NextResponse.redirect(redirectUrl, { status: 303 });
  }

  const session = createAnalyticsAccessSession();

  if (!session) {
    return NextResponse.json({ error: "Analytics access is not configured." }, { status: 503 });
  }

  const response = NextResponse.redirect(redirectUrl, { status: 303 });

  response.cookies.set(ANALYTICS_ACCESS_COOKIE, session, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin/analytics",
    maxAge: ANALYTICS_SESSION_MAX_AGE_SECONDS,
  });

  return response;
}
