import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

import type { VenueEvent } from "@/types";

interface VenuePageProps {
  params: Promise<{ venueId: string }>;
}

interface VenueRow {
  id: string;
  name: string;
  official_url: string | null;
}

function getSupabaseDataApiConfig() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? null;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    null;

  return url && key ? { url, key } : null;
}

async function getVenuePageData(venueId: string) {
  const config = getSupabaseDataApiConfig();

  if (!config) {
    return null;
  }

  const supabase = createClient(config.url, config.key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const [{ data: venues }, { data: events }] = await Promise.all([
    supabase
      .from("venues")
      .select("id,name,official_url")
      .eq("id", venueId)
      .limit(1)
      .returns<VenueRow[]>(),
    supabase
      .from("venue_events")
      .select("*")
      .eq("venue_id", venueId)
      .gte("latest_occurrence_at_venue", new Date().toISOString())
      .order("next_occurrence_at_venue", { ascending: true, nullsFirst: false })
      .returns<VenueEvent[]>(),
  ]);

  const venue = venues?.[0] ?? null;
  if (!venue) {
    return null;
  }

  return { venue, events: events ?? [] };
}

export async function generateMetadata({ params }: VenuePageProps): Promise<Metadata> {
  const { venueId } = await params;
  const data = await getVenuePageData(venueId);

  if (!data) {
    return { title: "Venue not found" };
  }

  return {
    title: `${data.venue.name} events`,
    description: `Upcoming events at ${data.venue.name}.`,
    robots: {
      index: false,
      follow: true,
    },
  };
}

function formatVenueEventDate(event: VenueEvent) {
  const value = event.next_occurrence_at_venue ?? event.starts_at ?? event.starts_on;
  if (!value) {
    return "Date TBA";
  }

  return new Intl.DateTimeFormat("en", {
    timeZone: event.timezone || "UTC",
    month: "short",
    day: "numeric",
    hour: event.next_occurrence_at_venue || event.starts_at ? "numeric" : undefined,
    minute: event.next_occurrence_at_venue || event.starts_at ? "2-digit" : undefined,
  }).format(new Date(value));
}

export default async function VenueEventsPage({ params }: VenuePageProps) {
  const { venueId } = await params;
  const data = await getVenuePageData(venueId);

  if (!data) {
    notFound();
  }

  return (
    <main className="page-shell py-10">
      <section className="surface p-6 sm:p-8">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">Venue</p>
        <h1 className="mt-2 text-4xl font-semibold text-slate-900">{data.venue.name}</h1>
        {data.venue.official_url ? (
          <Link
            href={data.venue.official_url}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:border-slate-300 hover:text-slate-950"
          >
            Official site
          </Link>
        ) : null}
      </section>

      <section className="mt-8 space-y-4" aria-labelledby="venue-events-heading">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-orange-600">Upcoming</p>
          <h2 id="venue-events-heading" className="mt-2 text-2xl font-semibold text-slate-900">
            Events at {data.venue.name}
          </h2>
        </div>
        {data.events.length ? (
          <div className="grid gap-4">
            {data.events.map((event) => (
              <article key={event.event_id} className="surface p-5">
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  {formatVenueEventDate(event)} · {event.event_category}
                </p>
                <h3 className="mt-2 text-xl font-semibold text-slate-900">{event.event_title}</h3>
                {event.occurrence_count_at_venue > 1 ? (
                  <p className="mt-1 text-sm text-slate-600">
                    {event.occurrence_count_at_venue} schedule items at this venue
                  </p>
                ) : null}
                {event.official_url ? (
                  <Link
                    href={event.official_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex text-sm font-medium text-slate-700 underline-offset-2 hover:text-slate-950 hover:underline"
                  >
                    Official event site
                  </Link>
                ) : null}
              </article>
            ))}
          </div>
        ) : (
          <div className="surface p-5 text-sm text-slate-600">No current or upcoming events are linked to this venue yet.</div>
        )}
      </section>
    </main>
  );
}
