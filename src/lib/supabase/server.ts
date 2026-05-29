import { createClient } from "@supabase/supabase-js";

function getPublicSupabaseKey() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    null
  );
}

export function getSupabaseServerConfig() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? null;
  const publicKey = getPublicSupabaseKey();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? null;

  return url && publicKey
    ? {
        url,
        publicKey,
        serviceRoleKey,
      }
    : null;
}

export function getSupabaseServiceClient() {
  const config = getSupabaseServerConfig();

  if (!config?.serviceRoleKey) {
    return null;
  }

  return createClient(config.url, config.serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function getAuthenticatedSupabaseUser(request: Request) {
  const config = getSupabaseServerConfig();
  const authorization = request.headers.get("authorization")?.trim();

  if (!config || !authorization?.toLowerCase().startsWith("bearer ")) {
    return { user: null, error: "Sign in before saving." };
  }

  const supabase = createClient(config.url, config.publicKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      headers: {
        Authorization: authorization,
      },
    },
  });

  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return { user: null, error: error?.message ?? "Sign in before saving." };
  }

  return { user: data.user, error: null };
}
