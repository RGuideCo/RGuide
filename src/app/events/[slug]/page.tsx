import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { MapListCard } from "@/components/cards/MapListCard";
import { getWeeklyEventGuideListsForCity } from "@/data/weekly-events";
import { getCityHref, getEventHref } from "@/lib/routes";
import { getServerEditorialGuides } from "@/lib/server-editorial-guides";

export const dynamic = "force-dynamic";

interface EventDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

function isEventGuideId(id: string) {
  return id.startsWith("event-");
}

async function getEventGuideBySlug(slug: string) {
  const guides = await getServerEditorialGuides();
  const localEventGuides = getWeeklyEventGuideListsForCity("barcelona");
  const eventGuides = [
    ...guides.filter((guide) => isEventGuideId(guide.id)),
    ...localEventGuides.filter(
      (localGuide) => !guides.some((guide) => guide.id === localGuide.id),
    ),
  ];
  const eventGuide = eventGuides.find((guide) => guide.slug === slug) ?? null;

  return { eventGuide, eventGuides };
}

export async function generateMetadata({ params }: EventDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { eventGuide } = await getEventGuideBySlug(slug);

  if (!eventGuide) {
    return { title: "Event not found" };
  }

  const locationLabel = [eventGuide.location.city, eventGuide.location.country].filter(Boolean).join(", ");

  return {
    title: `${eventGuide.title} (${locationLabel})`,
    description: eventGuide.description,
    alternates: {
      canonical: getEventHref(eventGuide),
    },
    openGraph: {
      title: `${eventGuide.title} | ${locationLabel}`,
      description: eventGuide.description,
      url: getEventHref(eventGuide),
      images: eventGuide.photo
        ? [
            {
              url: eventGuide.photo,
              alt: `${eventGuide.title} cover image`,
            },
          ]
        : undefined,
    },
  };
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { slug } = await params;
  const { eventGuide, eventGuides } = await getEventGuideBySlug(slug);

  if (!eventGuide) {
    notFound();
  }

  const relatedEvents = eventGuides
    .filter(
      (guide) =>
        guide.id !== eventGuide.id &&
        guide.location.city === eventGuide.location.city,
    )
    .slice(0, 3);
  const eventJsonLd = {
    "@context": "https://schema.org",
    "@type": eventGuide.itinerary ? "ItemList" : "Event",
    name: eventGuide.title,
    description: eventGuide.description,
    url: getEventHref(eventGuide),
    image: eventGuide.photo,
    location: eventGuide.location.city
      ? {
          "@type": "Place",
          name: eventGuide.location.city,
          address: [eventGuide.location.city, eventGuide.location.country].filter(Boolean).join(", "),
        }
      : undefined,
    itemListElement: eventGuide.itinerary
      ? eventGuide.stops.map((stop, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: stop.name,
          description: stop.description,
        }))
      : undefined,
  };

  return (
    <div className="page-shell py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />
      <div className="space-y-8">
        <article className="surface p-6 sm:p-8">
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <li>
                <Link href="/" className="hover:text-slate-700">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              {eventGuide.location.city ? (
                <>
                  <li>
                    <Link
                      href={getCityHref({
                        continent: eventGuide.location.continent,
                        country: eventGuide.location.country,
                        name: eventGuide.location.city,
                      })}
                      className="hover:text-slate-700"
                    >
                      {eventGuide.location.city}
                    </Link>
                  </li>
                  <li aria-hidden="true">/</li>
                </>
              ) : null}
              <li className="text-slate-700">Events</li>
            </ol>
          </nav>
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-orange-600">Weekly Event</p>
          <h1 className="mt-2 text-4xl font-semibold text-slate-900">{eventGuide.title}</h1>
          {eventGuide.itinerary?.startDate || eventGuide.itinerary?.endDate ? (
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              {[eventGuide.itinerary?.startDate, eventGuide.itinerary?.endDate].filter(Boolean).join(" to ")}
            </p>
          ) : null}
          <p className="mt-4 max-w-3xl text-slate-600">{eventGuide.description}</p>
        </article>

        <MapListCard list={eventGuide} expandable expanded />

        {relatedEvents.length ? (
          <section className="space-y-4" aria-labelledby="related-events-heading">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-orange-600">Related</p>
              <h2 id="related-events-heading" className="mt-2 text-2xl font-semibold text-slate-900">
                More events in {eventGuide.location.city}
              </h2>
            </div>
            <ul className="space-y-4">
              {relatedEvents.map((item) => (
                <li key={item.id}>
                  <MapListCard list={item} />
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </div>
  );
}
