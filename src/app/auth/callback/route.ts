import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

import { getSupabaseServerConfig } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const config = getSupabaseServerConfig();
  const code = request.nextUrl.searchParams.get("code");

  if (!config || !code) {
    return NextResponse.redirect(new URL("/auth/error", request.nextUrl.origin));
  }

  const response = NextResponse.redirect(new URL("/", request.nextUrl.origin));
  const supabase = createServerClient(config.url, config.publicKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  return error
    ? NextResponse.redirect(new URL("/auth/error", request.nextUrl.origin))
    : response;
}
