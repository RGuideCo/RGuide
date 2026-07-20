import { createHash } from "node:crypto";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

type RateLimitBucket = {
  count: number;
  resetAt: number;
};

export type RateLimitResult = {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
};

export type RateLimitOptions = {
  namespace: string;
  limit: number;
  windowMs: number;
  keyParts?: Array<string | null | undefined>;
};

const buckets = new Map<string, RateLimitBucket>();
const MAX_BUCKETS = 10_000;
let rateLimitClient: SupabaseClient | null | undefined;

function getClientKey(request: Request) {
  return (
    request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

function pruneExpiredBuckets(now: number) {
  if (buckets.size < MAX_BUCKETS) return;

  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) {
      buckets.delete(key);
    }
  }
}

function getRateLimitClient() {
  if (rateLimitClient !== undefined) {
    return rateLimitClient;
  }

  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  rateLimitClient =
    url && serviceRoleKey
      ? createClient(url, serviceRoleKey, {
          auth: { autoRefreshToken: false, persistSession: false },
        })
      : null;

  return rateLimitClient;
}

function consumeLocalBucket(key: string, options: RateLimitOptions, now: number): RateLimitResult {
  const existing = buckets.get(key);
  const bucket =
    existing && existing.resetAt > now
      ? existing
      : {
          count: 0,
          resetAt: now + options.windowMs,
        };

  bucket.count += 1;
  buckets.set(key, bucket);

  return {
    allowed: bucket.count <= options.limit,
    limit: options.limit,
    remaining: Math.max(options.limit - bucket.count, 0),
    resetAt: bucket.resetAt,
  };
}

export async function checkRateLimit(
  request: Request,
  options: RateLimitOptions,
): Promise<RateLimitResult> {
  if (process.env.RATE_LIMIT_DISABLED === "1") {
    return {
      allowed: true,
      limit: options.limit,
      remaining: options.limit,
      resetAt: Date.now() + options.windowMs,
    };
  }

  const now = Date.now();
  pruneExpiredBuckets(now);

  const key = [
    options.namespace,
    getClientKey(request),
    ...(options.keyParts ?? []).map((part) => String(part ?? "").trim().toLowerCase()),
  ].join(":");
  const keyHash = createHash("sha256").update(key).digest("hex");
  const localResult = consumeLocalBucket(keyHash, options, now);

  if (!localResult.allowed) {
    return localResult;
  }

  const supabase = getRateLimitClient();

  if (!supabase) {
    return localResult;
  }

  const { data, error } = await supabase.rpc("consume_api_rate_limit", {
    p_key_hash: keyHash,
    p_limit: options.limit,
    p_window_seconds: Math.max(1, Math.ceil(options.windowMs / 1000)),
  });

  if (error || !data || typeof data !== "object" || Array.isArray(data)) {
    console.error("Distributed rate limit unavailable; using process-local fallback", error);
    return localResult;
  }

  const distributedResult = data as { allowed?: unknown; count?: unknown; resetAt?: unknown };
  const count = Number(distributedResult.count);
  const resetAt = Number(distributedResult.resetAt);

  if (!Number.isFinite(count) || !Number.isFinite(resetAt)) {
    return localResult;
  }

  return {
    allowed: distributedResult.allowed === true,
    limit: options.limit,
    remaining: Math.max(options.limit - count, 0),
    resetAt,
  };
}

export function withRateLimitHeaders<T extends NextResponse>(response: T, result: RateLimitResult) {
  response.headers.set("X-RateLimit-Limit", String(result.limit));
  response.headers.set("X-RateLimit-Remaining", String(result.remaining));
  response.headers.set("X-RateLimit-Reset", String(Math.ceil(result.resetAt / 1000)));
  return response;
}

export function rateLimitResponse(result: RateLimitResult) {
  return withRateLimitHeaders(
    NextResponse.json(
      { error: "Too many requests. Try again shortly." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.max(Math.ceil((result.resetAt - Date.now()) / 1000), 1)),
        },
      },
    ),
    result,
  );
}
