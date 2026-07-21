import { createHmac, timingSafeEqual } from "node:crypto";

export const ANALYTICS_ACCESS_COOKIE = "rguide_analytics_access";
export const ANALYTICS_SESSION_MAX_AGE_SECONDS = 60 * 60 * 12;

type AnalyticsAccessPayload = {
  exp: number;
  version: 1;
};

function getAnalyticsAccessToken() {
  return process.env.ANALYTICS_DASHBOARD_TOKEN?.trim() || null;
}

function safelyEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function signPayload(payload: string, token: string) {
  return createHmac("sha256", token)
    .update(`rguide-analytics-access:${payload}`)
    .digest("base64url");
}

export function isValidAnalyticsAccessToken(candidate: string | null) {
  const token = getAnalyticsAccessToken();
  return Boolean(token && candidate && safelyEqual(token, candidate));
}

export function createAnalyticsAccessSession() {
  const token = getAnalyticsAccessToken();

  if (!token) {
    return null;
  }

  const payload = Buffer.from(
    JSON.stringify({
      exp: Math.floor(Date.now() / 1000) + ANALYTICS_SESSION_MAX_AGE_SECONDS,
      version: 1,
    } satisfies AnalyticsAccessPayload),
  ).toString("base64url");

  return `${payload}.${signPayload(payload, token)}`;
}

export function isValidAnalyticsAccessSession(session: string | null | undefined) {
  const token = getAnalyticsAccessToken();

  if (!token || !session) {
    return false;
  }

  const [payload, signature, extra] = session.split(".");

  if (!payload || !signature || extra || !safelyEqual(signPayload(payload, token), signature)) {
    return false;
  }

  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as Partial<AnalyticsAccessPayload>;
    return (
      parsed.version === 1 &&
      typeof parsed.exp === "number" &&
      Number.isInteger(parsed.exp) &&
      parsed.exp > Math.floor(Date.now() / 1000)
    );
  } catch {
    return false;
  }
}
