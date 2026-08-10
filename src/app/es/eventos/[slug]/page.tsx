import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { MapListCard } from "@/components/cards/MapListCard";
import { getLocalizedCityPath } from "@/lib/i18n/paths";
import {
  findDestinationRouteTranslation,
  getDestinationRouteTranslations,
} from "@/lib/i18n/server";
import { getAbsoluteHref, getEventHref } from "@/lib/routes";
import { getServerEditorialGuides } from "@/lib/server-editorial-guides";
import { serializeJsonForHtml } from "@/lib/serialize-json";

export const dynamic = "force-dynamic";

interface SpanishEventPageProps { params: Promise<{ slug: string }> }

async function loadEvent(slug: string) {
  const [guides, destinationTranslations] = await Promise.all([
    getServerEditorialGuides({ locale: "es", bypassCache: true }),
    getDestinationRouteTranslations("es"),
  ]);
  const events = guides.filter((guide) => guide.submissionType === "event" || guide.id.startsWith("event-"));
  const event = events.find((guide) => guide.seoSlug === slug || guide.slug === slug) ?? null;
  return { event, events, destinationTranslations };
}

export async function generateMetadata({ params }: SpanishEventPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { event } = await loadEvent(slug);
  if (!event) return { title: "Evento no encontrado", robots: { index: false, follow: true } };
  const canonical = `/es/eventos/${event.seoSlug ?? event.slug}`;
  const englishPath = getEventHref(event);
  return {
    title: event.seoTitle ?? event.title,
    description: event.seoDescription ?? event.description,
    alternates: { canonical, languages: { en: englishPath, es: canonical, "x-default": englishPath } },
    robots: { index: false, follow: true },
    openGraph: { title: event.title, description: event.description, url: canonical, locale: "es_ES", images: event.photo ? [{ url: event.photo, alt: event.title }] : undefined },
  };
}

export default async function SpanishEventPage({ params }: SpanishEventPageProps) {
  const { slug } = await params;
  const { event, events, destinationTranslations } = await loadEvent(slug);
  if (!event) notFound();
  const canonical = `/es/eventos/${event.seoSlug ?? event.slug}`;
  const cityTranslation = findDestinationRouteTranslation(destinationTranslations, {
    name: event.location.city ?? "",
    scope: "city",
  });
  const related = events.filter((candidate) => candidate.id !== event.id && candidate.location.city === event.location.city).slice(0, 3);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": event.itinerary ? "ItemList" : "Event",
    name: event.title,
    description: event.description,
    url: getAbsoluteHref(canonical),
    image: event.photo,
    inLanguage: "es",
  };
  return (
    <>
      <div className="page-shell py-10">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonForHtml(jsonLd) }} />
        <div className="space-y-8">
          <article className="surface p-6 sm:p-8">
            <nav aria-label="Migas de pan" className="mb-4">
              <ol className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <li><Link href="/es" className="hover:text-slate-700">Inicio</Link></li>
                <li aria-hidden="true">/</li>
                {event.location.city ? (
                  <>
                    <li>
                      <Link href={getLocalizedCityPath("es", { name: event.location.city }, cityTranslation?.slug)} className="hover:text-slate-700">
                        {cityTranslation?.displayName ?? event.location.city}
                      </Link>
                    </li>
                    <li aria-hidden="true">/</li>
                  </>
                ) : null}
                <li className="text-slate-700">Eventos</li>
              </ol>
            </nav>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-orange-600">Evento semanal</p>
            <h1 className="mt-2 text-4xl font-semibold text-slate-900">{event.title}</h1>
            <p className="mt-4 max-w-3xl text-slate-600">{event.description}</p>
          </article>
          <MapListCard list={event} expandable expanded />
          {related.length ? (
            <section className="space-y-4" aria-labelledby="related-events-heading">
              <h2 id="related-events-heading" className="text-2xl font-semibold text-slate-900">Más eventos en {cityTranslation?.displayName ?? event.location.city}</h2>
              <ul className="space-y-4">{related.map((item) => <li key={item.id}><MapListCard list={item} /></li>)}</ul>
            </section>
          ) : null}
        </div>
      </div>
    </>
  );
}
