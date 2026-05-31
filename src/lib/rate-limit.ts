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

function getClientKey(request: Request) {
  return (
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

export function checkRateLimit(request: Request, options: RateLimitOptions): RateLimitResult {
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

  const remaining = Math.max(options.limit - bucket.count, 0);

  return {
    allowed: bucket.count <= options.limit,
    limit: options.limit,
    remaining,
    resetAt: bucket.resetAt,
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
