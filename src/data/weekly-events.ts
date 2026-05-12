import { cityWeeklyEventRuns, getWeeklyEventImage } from "@/data/weekly-event-runs";
import type { ListCategory, MapList } from "@/types";

export type WeeklyEventCategory =
  | "Signature"
  | "Music"
  | "Film"
  | "Culture Festival"
  | "Maker Fair"
  | "Gaming"
  | "Sports"
  | "Culture";

export interface WeeklyCityEvent {
  id: string;
  cityId: string;
  cityName: string;
  title: string;
  category: WeeklyEventCategory;
  startsAt: string;
  endsAt?: string;
  venue: string;
  neighborhood?: string;
  description: string;
  highlights?: string[];
  url: string;
  sourceName: string;
  coordinates: [number, number];
  timezone?: string;
  price?: string;
  isGuideWorthy?: boolean;
  guideReason?: string;
  activations?: {
    id: string;
    title: string;
    venue: string;
    startsAt?: string;
    description: string;
    coordinates?: [number, number];
    url?: string;
  }[];
}

export interface WeeklyCityEventSourceRun {
  cityId: string;
  cityName: string;
  weekLabel: string;
  sourcedAt: string;
  timezone: string;
  refreshCadence: "weekly";
  sourceStrategy: string[];
  events: WeeklyCityEvent[];
}

export const weeklyCityEventRuns: WeeklyCityEventSourceRun[] = cityWeeklyEventRuns;

export function getWeeklyEventRunForCity(cityId?: string | null, cityName?: string | null) {
  const normalizedCityId = cityId?.toLowerCase();
  const normalizedCityName = cityName?.toLowerCase();

  return weeklyCityEventRuns.find(
    (run) =>
      run.cityId === normalizedCityId ||
      run.cityName.toLowerCase() === normalizedCityName,
  ) ?? null;
}

export function groupWeeklyEventsByCategory(events: WeeklyCityEvent[]) {
  return events.reduce<Record<WeeklyEventCategory, WeeklyCityEvent[]>>((groups, event) => {
    groups[event.category] = [...(groups[event.category] ?? []), event];
    return groups;
  }, {} as Record<WeeklyEventCategory, WeeklyCityEvent[]>);
}

export const weeklyEventCategoryOrder: WeeklyEventCategory[] = [
  "Signature",
  "Sports",
  "Culture",
  "Culture Festival",
  "Maker Fair",
  "Gaming",
  "Music",
  "Film",
];


const weeklyEventCategoryToGuideCategory: Record<WeeklyEventCategory, ListCategory> = {
  Signature: "Activities",
  Music: "Nightlife",
  Film: "Culture",
  "Culture Festival": "Culture",
  "Maker Fair": "Culture",
  Gaming: "Activities",
  Sports: "Activities",
  Culture: "Culture",
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatEventWindow(event: WeeklyCityEvent) {
  const timeZone = event.timezone ?? "UTC";
  const startsAt = new Intl.DateTimeFormat("en", {
    timeZone,
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(event.startsAt));

  if (!event.endsAt) {
    return startsAt;
  }

  const endsAt = new Intl.DateTimeFormat("en", {
    timeZone,
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(event.endsAt));

  return `${startsAt} to ${endsAt}`;
}

export function weeklyEventToGuideList(event: WeeklyCityEvent, run: WeeklyCityEventSourceRun): MapList {
  const cityEvent = { ...event, timezone: event.timezone ?? run.timezone };
  const eventWindow = formatEventWindow(cityEvent);
  const guideNote = event.isGuideWorthy && event.guideReason ? ` Guide candidate: ${event.guideReason}` : "";
  const slug = `this-week-${slugify(event.cityName)}-${slugify(event.title)}`;

  return {
    id: `event-${event.id}`,
    slug,
    seoSlug: slug,
    seoTitle: `${event.title} in ${event.cityName}`,
    seoDescription: `${event.title} is happening during ${run.weekLabel}. ${event.description}`,
    title: event.title,
    photo: event.activations?.length
      ? getWeeklyEventImage(event.activations[0]?.title ?? event.title, event.cityId)
      : getWeeklyEventImage(event.title, event.cityId),
    description: `${event.description}${guideNote}`,
    highlights: event.highlights,
    url: event.url,
    category: weeklyEventCategoryToGuideCategory[event.category],
    submissionType: "event",
    itinerary: event.activations?.length
      ? {
          startDate: cityEvent.startsAt.slice(0, 10),
          endDate: cityEvent.endsAt?.slice(0, 10),
        }
      : undefined,
    location: {
      city: event.cityName,
      neighborhood: event.neighborhood,
      country: "Spain",
      continent: "Europe",
      scope: "city",
    },
    creator: {
      id: "r-events",
      name: "R Events",
      avatar: "/images/rguide-avatar.svg",
    },
    upvotes: event.isGuideWorthy ? 18 : 8,
    createdAt: run.sourcedAt,
    stops: event.activations?.length
      ? event.activations.map((activation, index) => ({
          id: `${event.id}-${activation.id}`,
          name: activation.title,
          coordinates: activation.coordinates ?? event.coordinates,
          description: [
            activation.description,
            activation.startsAt ? `When: ${formatEventWindow({ ...cityEvent, startsAt: activation.startsAt, endsAt: undefined })}.` : null,
            `Venue: ${activation.venue}.`,
          ]
            .filter(Boolean)
            .join(" "),
          bookingUrl: activation.url ?? event.url,
          officialUrl: activation.url ?? event.url,
          photo: getWeeklyEventImage(activation.title, event.cityId),
          eventTime: activation.startsAt
            ? formatEventWindow({ ...cityEvent, startsAt: activation.startsAt, endsAt: undefined })
            : undefined,
          eventVenue: activation.venue,
          itineraryDate: activation.startsAt?.slice(0, 10),
          itineraryDay: activation.startsAt
            ? Math.max(
                1,
                Math.round(
                  (Date.parse(`${activation.startsAt.slice(0, 10)}T00:00:00`) -
                    Date.parse(`${cityEvent.startsAt.slice(0, 10)}T00:00:00`)) /
                    86400000,
                ) + 1,
              )
            : index + 1,
        }))
      : [
          {
            id: `${event.id}-venue`,
            name: event.venue,
            coordinates: event.coordinates,
            description: [
              event.description,
              `When: ${eventWindow}.`,
              event.price ? `Price: ${event.price}.` : null,
              event.isGuideWorthy && event.guideReason ? `Guide candidate: ${event.guideReason}` : null,
            ]
              .filter(Boolean)
              .join(" "),
            bookingUrl: event.url,
            officialUrl: event.url,
            photo: getWeeklyEventImage(event.title, event.cityId),
            eventTime: eventWindow,
            eventVenue: event.venue,
          },
        ],
    sources: [
      {
        name: event.sourceName,
        url: event.url,
      },
    ],
  };
}

export function getWeeklyEventGuideListsForCity(cityId?: string | null, cityName?: string | null) {
  const run = getWeeklyEventRunForCity(cityId, cityName);

  if (!run) {
    return [];
  }

  return run.events
    .slice()
    .sort((left, right) => {
      const categoryDelta =
        weeklyEventCategoryOrder.indexOf(left.category) - weeklyEventCategoryOrder.indexOf(right.category);
      return categoryDelta || Date.parse(left.startsAt) - Date.parse(right.startsAt);
    })
    .map((event) => weeklyEventToGuideList(event, run));
}
