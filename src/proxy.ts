import { NextRequest, NextResponse } from "next/server";

import { resolveCityDeepLink } from "@/lib/deep-link-routes";

export function proxy(request: NextRequest) {
  const segments = request.nextUrl.pathname.split("/").filter(Boolean);

  if (segments[0] !== "city") {
    return NextResponse.next();
  }

  const route = resolveCityDeepLink(segments.slice(1));
  if (!route?.guide || request.nextUrl.pathname === route.canonicalPath) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = route.canonicalPath;
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: ["/city/:path*"],
};
