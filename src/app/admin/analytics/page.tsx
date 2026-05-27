import type { Metadata } from "next";
import pg from "pg";
import { createClient } from "@supabase/supabase-js";

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
};

type AnalyticsClickEvent = RecentRow & {
  session_id: string | null;
  created_at: string;
};

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

function buildDailyRows(rows: AnalyticsClickEvent[]): DayRow[] {
  const today = new Date();
  const days = Array.from({ length: 14 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (13 - index));
    date.setHours(0, 0, 0, 0);
    return date;
  });

  return days.map((day) => {
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

async function loadSupabaseDashboardData(): Promise<AnalyticsDashboardData | null> {
  const config = getSupabaseAnalyticsConfig();

  if (!config) {
    return null;
  }

  const supabase = createClient(config.url, config.key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  if (!config.canReadDirectly) {
    const { data, error } = await supabase.rpc("analytics_dashboard_summary");

    if (error) {
      throw error;
    }

    return data as AnalyticsDashboardData;
  }

  const [allCount, affiliateCount, recentRows] = await Promise.all([
    supabase.from("analytics_click_events").select("id", { count: "exact", head: true }),
    supabase
      .from("analytics_click_events")
      .select("id", { count: "exact", head: true })
      .eq("event_type", "affiliate_click"),
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
  ]);

  if (allCount.error) throw allCount.error;
  if (affiliateCount.error) throw affiliateCount.error;
  if (recentRows.error) throw recentRows.error;

  const rows = (recentRows.data ?? []) as unknown as AnalyticsClickEvent[];
  const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
  const uniqueSessions = new Set(rows.map((row) => row.session_id).filter(Boolean));

  return {
    metrics: {
      total: allCount.count ?? rows.length,
      affiliate_clicks: affiliateCount.count ?? rows.filter((row) => row.event_type === "affiliate_click").length,
      unique_sessions: uniqueSessions.size,
      clicks_24h: rows.filter((row) => new Date(row.created_at).getTime() >= dayAgo).length,
    },
    daily: buildDailyRows(rows),
    eventTypes: countBy(rows, (row) => row.event_type),
    campaigns: countBy(rows.filter((row) => row.event_type === "affiliate_click"), (row) => row.affiliate_campaign),
    pages: countBy(rows, (row) => row.current_path),
    hotels: countBy(rows.filter((row) => row.event_type === "affiliate_click"), (row) => row.affiliate_hotel_name),
    countries: countBy(rows, (row) => row.country),
    recent: rows.slice(0, 30),
  };
}

async function loadAnalyticsDashboardData(): Promise<AnalyticsDashboardData | null> {
  const databaseUrl = getDatabaseUrl();

  if (!databaseUrl) {
    return loadSupabaseDashboardData();
  }

  const client = new pg.Client({
    connectionString: databaseUrl,
    ssl: getPgSslConfig(databaseUrl),
  });

  await client.connect();

  try {
    const [
      metrics,
      daily,
      eventTypes,
      campaigns,
      pages,
      hotels,
      countries,
      recent,
    ] = await Promise.all([
      client.query<MetricRow>(
        [
          "select",
          "count(*)::int as total,",
          "count(*) filter (where event_type = 'affiliate_click')::int as affiliate_clicks,",
          "count(distinct session_id)::int as unique_sessions,",
          "count(*) filter (where created_at >= now() - interval '24 hours')::int as clicks_24h",
          "from public.analytics_click_events",
        ].join(" "),
      ),
      client.query<DayRow>(
        [
          "select to_char(day, 'Mon DD') as day,",
          "coalesce(count(event.id), 0)::int as total,",
          "coalesce(count(event.id) filter (where event.event_type = 'affiliate_click'), 0)::int as affiliate_clicks",
          "from generate_series(current_date - interval '13 days', current_date, interval '1 day') day",
          "left join public.analytics_click_events event on event.created_at >= day",
          "and event.created_at < day + interval '1 day'",
          "group by day order by day",
        ].join(" "),
      ),
      client.query<LabelCountRow>(
        "select event_type as label, count(*)::int from public.analytics_click_events group by event_type order by count desc",
      ),
      client.query<LabelCountRow>(
        [
          "select coalesce(affiliate_campaign, '(no campaign)') as label, count(*)::int",
          "from public.analytics_click_events",
          "where event_type = 'affiliate_click'",
          "group by affiliate_campaign order by count desc limit 12",
        ].join(" "),
      ),
      client.query<LabelCountRow>(
        [
          "select coalesce(current_path, '(unknown page)') as label, count(*)::int",
          "from public.analytics_click_events",
          "group by current_path order by count desc limit 12",
        ].join(" "),
      ),
      client.query<LabelCountRow>(
        [
          "select coalesce(affiliate_hotel_name, '(no hotel name)') as label, count(*)::int",
          "from public.analytics_click_events",
          "where event_type = 'affiliate_click'",
          "group by affiliate_hotel_name order by count desc limit 12",
        ].join(" "),
      ),
      client.query<LabelCountRow>(
        [
          "select coalesce(country, '(unknown)') as label, count(*)::int",
          "from public.analytics_click_events",
          "group by country order by count desc limit 12",
        ].join(" "),
      ),
      client.query<RecentRow>(
        [
          "select created_at, event_type, current_path, destination_host, destination_path,",
          "link_text, affiliate_campaign, affiliate_hotel_name, country",
          "from public.analytics_click_events",
          "order by created_at desc limit 30",
        ].join(" "),
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

function RecentClicks({ rows }: { rows: RecentRow[] }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm lg:col-span-2">
      <h2 className="text-base font-semibold text-slate-950">Recent Clicks</h2>
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
                  {new Date(row.created_at).toLocaleString()}
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

export default async function AnalyticsDashboardPage() {
  const data = await loadAnalyticsDashboardData();

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
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-teal-700">RGuide</p>
            <h1 className="text-3xl font-semibold">Analytics Dashboard</h1>
          </div>
          <p className="text-sm text-slate-500">Updates when the page refreshes.</p>
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
          <RecentClicks rows={data.recent} />
        </div>
      </div>
    </main>
  );
}
