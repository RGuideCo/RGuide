import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import pg from "pg";
import { createClient } from "@supabase/supabase-js";
import { timingSafeEqual } from "node:crypto";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "RGuide Analytics",
  robots: {
    index: false,
    follow: false,
  },
};

type MetricRow = {
  total: number;
  affiliate_clicks: number;
  unique_sessions: number;
  clicks_24h: number;
};

type LabelCountRow = {
  label: string | null;
  count: number;
};

type DayRow = {
  day: string;
  total: number;
  affiliate_clicks: number;
};

type RecentRow = {
  created_at: string;
  event_type: string;
  current_path: string | null;
  destination_host: string | null;
  destination_path: string | null;
  link_text: string | null;
  affiliate_campaign: string | null;
  affiliate_hotel_name: string | null;
  country: string | null;
};

type AnalyticsDashboardData = {
  metrics: MetricRow;
  daily: DayRow[];
  eventTypes: LabelCountRow[];
  campaigns: LabelCountRow[];
  pages: LabelCountRow[];
  hotels: LabelCountRow[];
  countries: LabelCountRow[];
  recent: RecentRow[];
  recentTotal: number;
};

type AnalyticsClickEvent = RecentRow & {
  session_id: string | null;
  created_at: string;
};

const ANALYTICS_ACCESS_COOKIE = "rguide_analytics_access";
const DEFAULT_ANALYTICS_PASSWORD = "rguide2026";
const RECENT_PAGE_SIZE = 50;
const TIME_ZONE = "Pacific/Auckland";
const RANGE_OPTIONS = [
  { label: "7 days", value: "7", days: 7 },
  { label: "14 days", value: "14", days: 14 },
  { label: "30 days", value: "30", days: 30 },
  { label: "90 days", value: "90", days: 90 },
  { label: "All time", value: "all", days: 0 },
] as const;

type AnalyticsRange = (typeof RANGE_OPTIONS)[number];
type AnalyticsQuery = {
  range: AnalyticsRange;
  page: number;
  offset: number;
};

function getAnalyticsAccessToken() {
  return process.env.ANALYTICS_DASHBOARD_TOKEN?.trim() || DEFAULT_ANALYTICS_PASSWORD;
}

function isValidAccessToken(candidate: string | undefined | null) {
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

async function hasAnalyticsAccess() {
  const cookieStore = await cookies();
  return isValidAccessToken(cookieStore.get(ANALYTICS_ACCESS_COOKIE)?.value);
}

function getDatabaseUrl() {
  return (
    process.env.SUPABASE_DB_URL ??
    process.env.SUPABASE_DATABASE_URL ??
    process.env.DATABASE_URL ??
    null
  );
}

function getSupabaseAnalyticsConfig() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? null;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? null;
  const publicKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    null;
  const key = serviceKey ?? publicKey;

  return url && key ? { url, key, canReadDirectly: Boolean(serviceKey) } : null;
}

function getPgSslConfig(databaseUrl: string) {
  return databaseUrl.includes("localhost") || databaseUrl.includes("127.0.0.1")
    ? false
    : { rejectUnauthorized: false };
}

function toNumber(value: unknown) {
  return typeof value === "number" ? value : Number(value ?? 0);
}

function getAnalyticsQuery(searchParams: Record<string, string | string[] | undefined>): AnalyticsQuery {
  const daysParam = Array.isArray(searchParams.days) ? searchParams.days[0] : searchParams.days;
  const pageParam = Array.isArray(searchParams.page) ? searchParams.page[0] : searchParams.page;
  const range = RANGE_OPTIONS.find((option) => option.value === daysParam) ?? RANGE_OPTIONS[2];
  const page = Math.max(Number.parseInt(pageParam ?? "1", 10) || 1, 1);

  return {
    range,
    page,
    offset: (page - 1) * RECENT_PAGE_SIZE,
  };
}

function getRangeStart(days: number) {
  if (days <= 0) {
    return null;
  }

  return Date.now() - days * 24 * 60 * 60 * 1000;
}

function isInsideRange(row: AnalyticsClickEvent, days: number) {
  const rangeStart = getRangeStart(days);
  return !rangeStart || new Date(row.created_at).getTime() >= rangeStart;
}

function formatDashboardTime(value: string) {
  return new Intl.DateTimeFormat("en-NZ", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    timeZone: TIME_ZONE,
    timeZoneName: "short",
  }).format(new Date(value));
}

function getRangeHref(days: string, page = 1) {
  return `/admin/analytics?days=${days}&page=${page}`;
}

function countBy<T>(
  rows: T[],
  getLabel: (row: T) => string | null | undefined,
  limit = 12,
): LabelCountRow[] {
  const counts = new Map<string, number>();

  for (const row of rows) {
    const label = getLabel(row) || "(blank)";
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

function buildDailyRows(rows: AnalyticsClickEvent[], days: number): DayRow[] {
  const today = new Date();
  const chartDays = days > 0 ? Math.min(days, 90) : 90;
  const dayBuckets = Array.from({ length: chartDays }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (chartDays - 1 - index));
    date.setHours(0, 0, 0, 0);
    return date;
  });

  return dayBuckets.map((day) => {
    const nextDay = new Date(day);
    nextDay.setDate(day.getDate() + 1);
    const dayRows = rows.filter((row) => {
      const createdAt = new Date(row.created_at);
      return createdAt >= day && createdAt < nextDay;
    });

    return {
      day: day.toLocaleDateString("en-US", { month: "short", day: "2-digit" }),
      total: dayRows.length,
      affiliate_clicks: dayRows.filter((row) => row.event_type === "affiliate_click").length,
    };
  });
}

async function loadSupabaseDashboardData(query: AnalyticsQuery): Promise<AnalyticsDashboardData | null> {
  const config = getSupabaseAnalyticsConfig();

  if (!config) {
    return null;
  }

  const supabase = createClient(config.url, config.key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  if (!config.canReadDirectly) {
    const { data, error } = await supabase.rpc("analytics_dashboard_summary", {
      p_days: query.range.days,
      p_recent_limit: RECENT_PAGE_SIZE,
      p_recent_offset: query.offset,
    });

    if (!error) {
      const dashboardData = data as AnalyticsDashboardData;
      return {
        ...dashboardData,
        recentTotal: toNumber(dashboardData.recentTotal ?? dashboardData.recent?.length ?? 0),
      };
    }

    const { data: fallbackData, error: fallbackError } = await supabase.rpc("analytics_dashboard_summary");

    if (fallbackError) {
      throw error;
    }

    const dashboardData = fallbackData as AnalyticsDashboardData;
    return {
      ...dashboardData,
      recentTotal: toNumber(dashboardData.recentTotal ?? dashboardData.recent?.length ?? 0),
    };
  }

  const rangeStart = getRangeStart(query.range.days);
  const allCountQuery = supabase.from("analytics_click_events").select("id", { count: "exact", head: true });
  const affiliateCountQuery = supabase
    .from("analytics_click_events")
    .select("id", { count: "exact", head: true })
    .eq("event_type", "affiliate_click");
  const recentCountQuery = supabase
    .from("analytics_click_events")
    .select("id", { count: "exact", head: true });
  const recentRowsQuery = supabase
    .from("analytics_click_events")
    .select(
      [
        "created_at",
        "event_type",
        "session_id",
        "current_path",
        "destination_host",
        "destination_path",
        "link_text",
        "affiliate_campaign",
        "affiliate_hotel_name",
        "country",
      ].join(","),
    )
    .order("created_at", { ascending: false })
    .range(query.offset, query.offset + RECENT_PAGE_SIZE - 1);

  if (rangeStart) {
    const since = new Date(rangeStart).toISOString();
    allCountQuery.gte("created_at", since);
    affiliateCountQuery.gte("created_at", since);
    recentCountQuery.gte("created_at", since);
    recentRowsQuery.gte("created_at", since);
  }

  const [allCount, affiliateCount, recentCount, summaryRows, recentRows] = await Promise.all([
    allCountQuery,
    affiliateCountQuery,
    recentCountQuery,
    supabase
      .from("analytics_click_events")
      .select(
        [
          "created_at",
          "event_type",
          "session_id",
          "current_path",
          "destination_host",
          "destination_path",
          "link_text",
          "affiliate_campaign",
          "affiliate_hotel_name",
          "country",
        ].join(","),
      )
      .order("created_at", { ascending: false })
      .limit(5000),
    recentRowsQuery,
  ]);

  if (allCount.error) throw allCount.error;
  if (affiliateCount.error) throw affiliateCount.error;
  if (recentCount.error) throw recentCount.error;
  if (summaryRows.error) throw summaryRows.error;
  if (recentRows.error) throw recentRows.error;

  const rows = ((summaryRows.data ?? []) as unknown as AnalyticsClickEvent[]).filter((row) =>
    isInsideRange(row, query.range.days),
  );
  const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
  const uniqueSessions = new Set(rows.map((row) => row.session_id).filter(Boolean));

  return {
    metrics: {
      total: allCount.count ?? rows.length,
      affiliate_clicks: affiliateCount.count ?? rows.filter((row) => row.event_type === "affiliate_click").length,
      unique_sessions: uniqueSessions.size,
      clicks_24h: rows.filter((row) => new Date(row.created_at).getTime() >= dayAgo).length,
    },
    daily: buildDailyRows(rows, query.range.days),
    eventTypes: countBy(rows, (row) => row.event_type),
    campaigns: countBy(rows.filter((row) => row.event_type === "affiliate_click"), (row) => row.affiliate_campaign),
    pages: countBy(rows, (row) => row.current_path),
    hotels: countBy(rows.filter((row) => row.event_type === "affiliate_click"), (row) => row.affiliate_hotel_name),
    countries: countBy(rows, (row) => row.country),
    recent: (recentRows.data ?? []) as unknown as RecentRow[],
    recentTotal: recentCount.count ?? 0,
  };
}

async function loadAnalyticsDashboardData(query: AnalyticsQuery): Promise<AnalyticsDashboardData | null> {
  const databaseUrl = getDatabaseUrl();

  if (!databaseUrl) {
    return loadSupabaseDashboardData(query);
  }

  const client = new pg.Client({
    connectionString: databaseUrl,
    ssl: getPgSslConfig(databaseUrl),
  });

  await client.connect();

  try {
    const rangeWhere = query.range.days > 0 ? "where created_at >= now() - ($1::int * interval '1 day')" : "";
    const affiliateRangeWhere =
      query.range.days > 0
        ? "where event_type = 'affiliate_click' and created_at >= now() - ($1::int * interval '1 day')"
        : "where event_type = 'affiliate_click'";
    const queryParams = query.range.days > 0 ? [query.range.days] : [];
    const recentParams = query.range.days > 0
      ? [query.range.days, RECENT_PAGE_SIZE, query.offset]
      : [RECENT_PAGE_SIZE, query.offset];

    const [
      metrics,
      daily,
      eventTypes,
      campaigns,
      pages,
      hotels,
      countries,
      recent,
      recentTotal,
    ] = await Promise.all([
      client.query<MetricRow>(
        [
          "select",
          "count(*)::int as total,",
          "count(*) filter (where event_type = 'affiliate_click')::int as affiliate_clicks,",
          "count(distinct session_id)::int as unique_sessions,",
          "count(*) filter (where created_at >= now() - interval '24 hours')::int as clicks_24h",
          "from public.analytics_click_events",
          rangeWhere,
        ].join(" "),
        queryParams,
      ),
      client.query<DayRow>(
        [
          "select to_char(day, 'Mon DD') as day,",
          "coalesce(count(event.id), 0)::int as total,",
          "coalesce(count(event.id) filter (where event.event_type = 'affiliate_click'), 0)::int as affiliate_clicks",
          `from generate_series(current_date - interval '${query.range.days > 0 ? Math.min(query.range.days, 90) - 1 : 89} days', current_date, interval '1 day') day`,
          "left join public.analytics_click_events event on event.created_at >= day",
          "and event.created_at < day + interval '1 day'",
          query.range.days > 0 ? "and event.created_at >= now() - ($1::int * interval '1 day')" : "",
          "group by day order by day",
        ].join(" "),
        queryParams,
      ),
      client.query<LabelCountRow>(
        `select event_type as label, count(*)::int from public.analytics_click_events ${rangeWhere} group by event_type order by count desc`,
        queryParams,
      ),
      client.query<LabelCountRow>(
        [
          "select coalesce(affiliate_campaign, '(no campaign)') as label, count(*)::int",
          "from public.analytics_click_events",
          affiliateRangeWhere,
          "group by affiliate_campaign order by count desc limit 12",
        ].join(" "),
        queryParams,
      ),
      client.query<LabelCountRow>(
        [
          "select coalesce(current_path, '(unknown page)') as label, count(*)::int",
          "from public.analytics_click_events",
          rangeWhere,
          "group by current_path order by count desc limit 12",
        ].join(" "),
        queryParams,
      ),
      client.query<LabelCountRow>(
        [
          "select coalesce(affiliate_hotel_name, '(no hotel name)') as label, count(*)::int",
          "from public.analytics_click_events",
          affiliateRangeWhere,
          "group by affiliate_hotel_name order by count desc limit 12",
        ].join(" "),
        queryParams,
      ),
      client.query<LabelCountRow>(
        [
          "select coalesce(country, '(unknown)') as label, count(*)::int",
          "from public.analytics_click_events",
          rangeWhere,
          "group by country order by count desc limit 12",
        ].join(" "),
        queryParams,
      ),
      client.query<RecentRow>(
        [
          "select created_at, event_type, current_path, destination_host, destination_path,",
          "link_text, affiliate_campaign, affiliate_hotel_name, country",
          "from public.analytics_click_events",
          rangeWhere,
          `order by created_at desc limit $${query.range.days > 0 ? 2 : 1} offset $${query.range.days > 0 ? 3 : 2}`,
        ].join(" "),
        recentParams,
      ),
      client.query<{ count: number }>(
        `select count(*)::int from public.analytics_click_events ${rangeWhere}`,
        queryParams,
      ),
    ]);

    const metric = metrics.rows[0] ?? {
      total: 0,
      affiliate_clicks: 0,
      unique_sessions: 0,
      clicks_24h: 0,
    };

    return {
      metrics: {
        total: toNumber(metric.total),
        affiliate_clicks: toNumber(metric.affiliate_clicks),
        unique_sessions: toNumber(metric.unique_sessions),
        clicks_24h: toNumber(metric.clicks_24h),
      },
      daily: daily.rows.map((row) => ({
        ...row,
        total: toNumber(row.total),
        affiliate_clicks: toNumber(row.affiliate_clicks),
      })),
      eventTypes: eventTypes.rows.map((row) => ({ ...row, count: toNumber(row.count) })),
      campaigns: campaigns.rows.map((row) => ({ ...row, count: toNumber(row.count) })),
      pages: pages.rows.map((row) => ({ ...row, count: toNumber(row.count) })),
      hotels: hotels.rows.map((row) => ({ ...row, count: toNumber(row.count) })),
      countries: countries.rows.map((row) => ({ ...row, count: toNumber(row.count) })),
      recent: recent.rows,
      recentTotal: toNumber(recentTotal.rows[0]?.count),
    };
  } finally {
    await client.end().catch(() => {});
  }
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-2 text-3xl font-semibold text-slate-950">{value.toLocaleString()}</div>
    </div>
  );
}

function BarList({ title, rows }: { title: string; rows: LabelCountRow[] }) {
  const max = Math.max(...rows.map((row) => row.count), 1);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">{title}</h2>
      <div className="mt-4 space-y-3">
        {rows.length ? rows.map((row) => {
          const label = row.label || "(blank)";
          return (
            <div key={label}>
              <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                <span className="truncate text-slate-700">{label}</span>
                <span className="font-medium text-slate-950">{row.count.toLocaleString()}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-teal-600"
                  style={{ width: `${Math.max((row.count / max) * 100, 4)}%` }}
                />
              </div>
            </div>
          );
        }) : (
          <p className="text-sm text-slate-500">No data yet.</p>
        )}
      </div>
    </section>
  );
}

function DailyChart({ rows }: { rows: DayRow[] }) {
  const max = Math.max(...rows.map((row) => row.total), 1);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm lg:col-span-2">
      <h2 className="text-base font-semibold text-slate-950">Clicks By Day</h2>
      <div className="mt-4 flex h-56 items-end gap-2">
        {rows.map((row) => (
          <div key={row.day} className="flex min-w-0 flex-1 flex-col items-center gap-2">
            <div className="flex h-44 w-full items-end rounded bg-slate-50">
              <div
                className="w-full rounded-t bg-slate-900"
                style={{ height: `${Math.max((row.total / max) * 100, row.total ? 8 : 0)}%` }}
                title={`${row.total} clicks, ${row.affiliate_clicks} affiliate`}
              />
            </div>
            <div className="w-full truncate text-center text-xs text-slate-500">{row.day}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function RangeControls({ selectedRange }: { selectedRange: AnalyticsRange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {RANGE_OPTIONS.map((option) => {
        const isSelected = option.value === selectedRange.value;
        return (
          <Link
            key={option.value}
            href={getRangeHref(option.value)}
            className={`rounded-md border px-3 py-2 text-sm font-medium transition ${
              isSelected
                ? "border-slate-950 bg-slate-950 text-white"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
            }`}
          >
            {option.label}
          </Link>
        );
      })}
    </div>
  );
}

function RecentClicks({
  rows,
  query,
  total,
}: {
  rows: RecentRow[];
  query: AnalyticsQuery;
  total: number;
}) {
  const firstRow = total === 0 ? 0 : query.offset + 1;
  const lastRow = Math.min(query.offset + rows.length, total);
  const hasPrevious = query.page > 1;
  const hasNext = query.offset + rows.length < total;

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm lg:col-span-2">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-950">Click History</h2>
          <p className="mt-1 text-xs text-slate-500">Times shown in NZ time. Showing {firstRow.toLocaleString()}-{lastRow.toLocaleString()} of {total.toLocaleString()} clicks in this range.</p>
        </div>
        <div className="flex gap-2">
          {hasPrevious ? (
            <Link
              className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:border-slate-300"
              href={getRangeHref(query.range.value, query.page - 1)}
            >
              Previous
            </Link>
          ) : null}
          {hasNext ? (
            <Link
              className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:border-slate-300"
              href={getRangeHref(query.range.value, query.page + 1)}
            >
              Next
            </Link>
          ) : null}
        </div>
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-xs uppercase text-slate-500">
            <tr>
              <th className="whitespace-nowrap py-2 pr-4">Time</th>
              <th className="whitespace-nowrap py-2 pr-4">Type</th>
              <th className="whitespace-nowrap py-2 pr-4">Page</th>
              <th className="whitespace-nowrap py-2 pr-4">Campaign / Hotel</th>
              <th className="whitespace-nowrap py-2 pr-4">Country</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length ? rows.map((row) => (
              <tr key={`${row.created_at}-${row.event_type}-${row.current_path}`}>
                <td className="whitespace-nowrap py-2 pr-4 text-slate-500">
                  {formatDashboardTime(row.created_at)}
                </td>
                <td className="whitespace-nowrap py-2 pr-4 font-medium text-slate-950">{row.event_type}</td>
                <td className="max-w-xs truncate py-2 pr-4 text-slate-700">{row.current_path || row.link_text || "-"}</td>
                <td className="max-w-xs truncate py-2 pr-4 text-slate-700">
                  {row.affiliate_hotel_name || row.affiliate_campaign || row.destination_host || "-"}
                </td>
                <td className="whitespace-nowrap py-2 pr-4 text-slate-700">{row.country || "-"}</td>
              </tr>
            )) : (
              <tr>
                <td className="py-4 text-slate-500" colSpan={5}>No clicks recorded yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function AnalyticsAccessGate() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-950">
      <div className="mx-auto max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-wide text-teal-700">RGuide</p>
        <h1 className="mt-2 text-2xl font-semibold">Analytics Access</h1>
        <p className="mt-2 text-sm text-slate-500">
          Enter the dashboard password to view analytics.
        </p>
        <form className="mt-5 space-y-4" action="/admin/analytics/access" method="post">
          <label className="block text-sm font-medium text-slate-700" htmlFor="analytics-token">
            Password
          </label>
          <input
            id="analytics-token"
            name="token"
            type="password"
            autoComplete="current-password"
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            required
          />
          <button
            type="submit"
            className="w-full rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Unlock Dashboard
          </button>
        </form>
      </div>
    </main>
  );
}

export default async function AnalyticsDashboardPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const canViewAnalytics = await hasAnalyticsAccess();

  if (!canViewAnalytics) {
    return <AnalyticsAccessGate />;
  }

  const query = getAnalyticsQuery((await searchParams) ?? {});
  const data = await loadAnalyticsDashboardData(query);

  if (!data) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-4xl rounded-lg border border-amber-200 bg-amber-50 p-5 text-amber-950">
          Analytics needs a database connection in Vercel before the dashboard can load.
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-950">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-teal-700">RGuide</p>
            <h1 className="text-3xl font-semibold">Analytics Dashboard</h1>
            <p className="mt-2 text-sm text-slate-500">
              Showing {query.range.label.toLowerCase()} from the first-party click tracker.
            </p>
          </div>
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <RangeControls selectedRange={query.range} />
            <p className="text-sm text-slate-500">Updates when the page refreshes.</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Clicks" value={data.metrics.total} />
          <StatCard label="Stay22 Clicks" value={data.metrics.affiliate_clicks} />
          <StatCard label="Anonymous Sessions" value={data.metrics.unique_sessions} />
          <StatCard label="Clicks Last 24h" value={data.metrics.clicks_24h} />
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <DailyChart rows={data.daily} />
          <BarList title="Event Types" rows={data.eventTypes} />
          <BarList title="Top Stay22 Campaigns" rows={data.campaigns} />
          <BarList title="Top Pages" rows={data.pages} />
          <BarList title="Top Hotels" rows={data.hotels} />
          <BarList title="Countries" rows={data.countries} />
          <RecentClicks rows={data.recent} query={query} total={data.recentTotal} />
        </div>
      </div>
    </main>
  );
}
