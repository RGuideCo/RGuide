import { FOOD_CUISINE_ANY } from "@/components/home/split-screen-config";
import type { DestinationCategoryInsight as DestinationCategoryInsightContent, ListCategory } from "@/types";

export type CategoryInsightNote = {
  label?: string;
  body: string;
};

export type CategoryInsight = {
  category: ListCategory;
  label: string;
  chips: string[];
  notes: CategoryInsightNote[];
};

type CategoryInsightRequest = {
  category: ListCategory;
  cityId?: string | null;
  placeLabel: string;
  cuisines: string[];
  subcategories: string[];
  categoryInsights?: DestinationCategoryInsightContent[];
};

type CityCategoryInsightConfig = Partial<
  Record<
    ListCategory,
    {
      label?: string;
      notes: CategoryInsightNote[];
    }
  >
>;

const defaultCategoryInsightChips: Record<ListCategory, string[]> = {
  Food: ["Restaurants", "Markets", "Local staples", "Reservations"],
  Nightlife: ["Cocktails", "Live rooms", "Late streets", "Wine bars"],
  Nature: ["Viewpoints", "Parks", "Waterfront", "Easy walks"],
  Culture: ["Museums", "Architecture", "Galleries", "Historic streets"],
  Stay: ["Hotels", "Hostels", "Design stays", "Transit bases"],
  Activities: ["Top picks", "Tours", "Shopping", "Wellness"],
  Routes: ["Walking loops", "Transit hops", "Scenic links", "Day plans"],
  Essentials: ["Arrival", "Transit", "Money", "Safety"],
};

const defaultCategoryInsightNotes: Record<ListCategory, CategoryInsightNote[]> = {
  Food: [
    {
      label: "Breakfast",
      body: "Coffee, bakeries, markets, classic counters, and quick neighborhood rooms that can start the day without a reservation.",
    },
    {
      label: "Lunch",
      body: "Local staples, market halls, casual restaurants, and set-menu rooms where value and timing usually work in your favor.",
    },
    {
      label: "Dinner",
      body: "Reservations, wine rooms, tasting menus, late counters, and neighborhood anchors that should shape the evening route.",
    },
  ],
  Nightlife: [
    {
      label: "District",
      body: "Pick the area before the venue: bar streets, club zones, hotel lounges, and music rooms usually solve different kinds of nights.",
    },
    {
      label: "Late plan",
      body: "Keep the second half of the night close to the first stop, especially when transit thins out or taxis become the fallback.",
    },
  ],
  Nature: [
    {
      label: "Pace",
      body: "Use parks, waterfronts, gardens, and viewpoints as route breaks, not as isolated detours that split the day.",
    },
    {
      label: "Season",
      body: "Light, weather, blossom, foliage, and heat change the best open-air choice more than a static ranking does.",
    },
  ],
  Culture: [
    {
      label: "Anchor",
      body: "Start with one major museum, landmark, or district, then let nearby streets and smaller stops carry the gaps.",
    },
    {
      label: "Timing",
      body: "Book timed entries first and keep flexible culture stops nearby in case the day opens up or slows down.",
    },
  ],
  Stay: [
    {
      label: "Base",
      body: "Choose the sleep area by repeat routes: nights, early trains, museum days, budget, quiet, or first-timer convenience.",
    },
    {
      label: "Tradeoff",
      body: "The best stay is rarely just the nicest room; it is the room that keeps the rest of the trip from fighting geography.",
    },
  ],
  Activities: [
    {
      label: "Cluster",
      body: "Activities work best when they share a station area or neighborhood arc instead of pulling the day across town.",
    },
    {
      label: "Slack",
      body: "Leave room for queues, weather, shopping, changed reservations, and the walking that makes the city make sense.",
    },
  ],
  Routes: [
    {
      label: "Direction",
      body: "A good route has a clean direction of travel, a natural pause, and a reason the stops belong together.",
    },
    {
      label: "Transit",
      body: "Use transit as a connector between clusters, not as the main structure of every hour.",
    },
  ],
  Essentials: [
    {
      label: "Before",
      body: "Use essentials to solve arrival, transit, payments, booking rhythm, weather, safety, and connectivity before the day fills up.",
    },
    {
      label: "Friction",
      body: "The best practical note removes a decision from the trip instead of adding another thing to check.",
    },
  ],
};

const cityCategoryInsightOverrides: Record<string, CityCategoryInsightConfig> = {
  tokyo: {
    Food: {
      label: "Food notes",
      notes: [
        {
          label: "Breakfast",
          body: "Coffee shops, kissaten, bakeries, onigiri counters, and early ramen or fish breakfasts near markets and stations.",
        },
        {
          label: "Lunch",
          body: "Ramen, sushi sets, curry, soba, depachika food halls, and quick counters where turnover is part of the appeal.",
        },
        {
          label: "Dinner",
          body: "Izakaya, omakase, yakitori, tonkatsu, reservation rooms, and neighborhood counters that work better when the night has a lane.",
        },
      ],
    },
    Nightlife: {
      label: "Nightlife notes",
      notes: [
        {
          label: "Districts",
          body: "Shinjuku and Shibuya carry the broadest night energy; Roppongi skews international and clubby; Ginza is better for polished cocktail rooms.",
        },
        {
          label: "Last train",
          body: "Tokyo nights are train-shaped until they are not. Keep late plans in one district unless the group is comfortable with taxis.",
        },
        {
          label: "Room type",
          body: "Tiny bars, izakaya, karaoke, jazz rooms, clubs, and hotel lounges are different nights. Pick the room type before the neighborhood.",
        },
      ],
    },
    Culture: {
      label: "Culture notes",
      notes: [
        {
          label: "Clusters",
          body: "Ueno handles museum density, Roppongi handles design and contemporary art, Asakusa handles old-city texture, and Harajuku/Omotesando handles youth and style.",
        },
        {
          label: "Pairing",
          body: "Temples and gardens work best early; museums and shopping streets are better as weatherproof anchors later in the day.",
        },
        {
          label: "Scale",
          body: "Tokyo culture is often a district mood, not only a landmark. Leave time for station exits, side streets, and small retail rituals.",
        },
      ],
    },
    Stay: {
      label: "Stay notes",
      notes: [
        {
          label: "Rail logic",
          body: "Choose the base by the line you will repeat: Shinjuku for west-side reach, Shibuya for nightlife and shopping, Ginza/Tokyo Station for polish and transit.",
        },
        {
          label: "Pace",
          body: "Asakusa and Ueno trade late-night energy for value and old-town mornings; Roppongi gives central nights and museums at higher prices.",
        },
        {
          label: "Sleep style",
          body: "Capsules, hostels, business hotels, design hotels, and ryokan-style rooms solve different trips. Compare the room type before the neighborhood.",
        },
      ],
    },
    Nature: {
      label: "Nature notes",
      notes: [
        {
          label: "Quiet",
          body: "Shrine groves, gardens, rivers, and parks are the reset button between station-heavy routes, especially around Meiji Jingu, Ueno, and the bay.",
        },
        {
          label: "Season",
          body: "Cherry blossom, foliage, humidity, rain, and sunset matter more than distance. A nearby garden can beat a famous view on the wrong day.",
        },
        {
          label: "Edges",
          body: "Use waterfronts, canal walks, and mountain day trips when the city feels too dense, but build the return route before committing.",
        },
      ],
    },
    Activities: {
      label: "Activity notes",
      notes: [
        {
          label: "Station clusters",
          body: "Tokyo activities work best by station cluster: Shibuya/Harajuku, Ueno/Asakusa, Ginza/Tsukiji, Shinjuku, or Roppongi/Akasaka.",
        },
        {
          label: "Queues",
          body: "Popular shops, cafes, observatories, and character stops can eat the day. Keep one flexible backup within the same area.",
        },
        {
          label: "Energy",
          body: "Mix one high-stimulation area with one calmer pause. Tokyo gets better when the day has pressure valves.",
        },
      ],
    },
    Routes: {
      label: "Route notes",
      notes: [
        {
          label: "Line first",
          body: "Build around a rail spine or adjacent districts. A clean Yamanote or subway arc beats a prettier list that zigzags across the map.",
        },
        {
          label: "Transfer cost",
          body: "Every transfer adds stairs, exits, and orientation. Keep meals and shops near the same station when the route is already dense.",
        },
      ],
    },
    Essentials: {
      label: "Essential notes",
      notes: [
        {
          label: "Transit",
          body: "IC cards, last trains, station exits, and luggage routes shape the trip more than most first-time visitors expect.",
        },
        {
          label: "Cash",
          body: "Tokyo is card-friendly but not card-only. Small restaurants, bars, ticket machines, and older shops can still reward cash.",
        },
        {
          label: "Booking",
          body: "Reserve small restaurants early, watch closed days, and do not assume a famous room accepts walk-ins just because it is on the map.",
        },
      ],
    },
  },
};

export function buildCategoryInsight({
  category,
  cityId,
  placeLabel,
  cuisines,
  subcategories,
  categoryInsights,
}: CategoryInsightRequest): CategoryInsight {
  const destinationInsight = categoryInsights?.find((insight) => insight.category === category);
  const destinationChips = destinationInsight?.chips.map((chip) => chip.label).filter(Boolean).slice(0, 4) ?? [];
  const destinationNotes =
    destinationInsight?.notes
      .map((note) => ({
        label: note.label,
        body: note.body,
      }))
      .filter((note) => note.body.trim()) ?? [];
  const cuisineChips = cuisines.slice(0, 4);
  const chips =
    destinationChips.length
      ? destinationChips
      : category === "Food" && cuisineChips.length
      ? cuisineChips
      : subcategories.length
        ? subcategories.slice(0, 4)
        : defaultCategoryInsightChips[category];
  const override = cityId ? cityCategoryInsightOverrides[cityId]?.[category] : null;

  return {
    category,
    label: destinationInsight?.label ?? override?.label ?? `${category} notes`,
    chips,
    notes: destinationNotes.length ? destinationNotes : override?.notes ?? defaultCategoryInsightNotes[category],
  };
}

const foodCuisineNeedToKnowNotes: Record<string, CategoryInsightNote[]> = {
  sushi: [
    {
      label: "Booking",
      body: "Serious counters are small and punctual; book early, keep the group compact, and treat the seating time like part of the meal.",
    },
    {
      label: "Lunch",
      body: "Lunch sets can be the smarter way into high-end rooms, while value sushi and conveyor spots work better as flexible route food.",
    },
    {
      label: "Range",
      body: "Do not judge all sushi by one lane: omakase, standing sushi, department-store counters, and casual chains solve different days.",
    },
  ],
  ramen: [
    {
      label: "Pace",
      body: "Ramen is usually quick, solo-friendly, and queue-driven; go off peak if the bowl matters more than the line.",
    },
    {
      label: "Styles",
      body: "Watch the style before choosing: shio, shoyu, tonkotsu, miso, tsukemen, and spicy bowls are very different meals.",
    },
    {
      label: "Timing",
      body: "Late morning, post-shopping, or after bars can work better than forcing ramen into a formal dinner slot.",
    },
  ],
  izakaya: [
    {
      label: "Mood",
      body: "Izakaya are for rounds, not one perfect plate; order lightly at first, then let drinks and small dishes shape the night.",
    },
    {
      label: "Group",
      body: "They work best with two to four people, especially when the room is small, smoky, or built around counter seats.",
    },
    {
      label: "Route",
      body: "Use izakaya as a neighborhood anchor, then keep a second bar or late snack nearby instead of crossing town after dinner.",
    },
  ],
  japanese: [
    {
      label: "Scope",
      body: "Japanese is a broad filter, so use it for mixed guides: tempura, tonkatsu, soba, curry, set meals, counters, and classics.",
    },
    {
      label: "Decision",
      body: "Pick the format before the venue: fast counter, reservation room, department-store floor, or neighborhood staple.",
    },
    {
      label: "Backup",
      body: "Keep backups close; many small rooms have limited seats, odd closures, or service windows that sell through early.",
    },
  ],
  seafood: [
    {
      label: "Freshness",
      body: "Seafood guides work best around markets, coastal rooms, raw bars, and reservation restaurants where sourcing is part of the point.",
    },
    {
      label: "Timing",
      body: "Lunch can be easier and brighter for seafood; dinner is better when the room has wine, pacing, and a real reservation shape.",
    },
  ],
  "street food": [
    {
      label: "Flow",
      body: "Street food is strongest when it follows a walkable route with multiple small stops instead of one huge detour.",
    },
    {
      label: "Timing",
      body: "Go when turnover is visible, avoid forcing peak lines, and keep a nearby backup in case a stall closes early.",
    },
  ],
};

export function buildCategoryInsightNotes({
  categoryInsight,
  activeFoodCuisine,
  placeLabel,
}: {
  categoryInsight: CategoryInsight | null;
  activeFoodCuisine: string;
  placeLabel: string;
}) {
  if (!categoryInsight) {
    return [];
  }

  if (categoryInsight.category === "Food" && activeFoodCuisine !== FOOD_CUISINE_ANY) {
    return buildFoodCuisineNeedToKnowNotes(activeFoodCuisine, placeLabel);
  }

  return categoryInsight.notes;
}

function buildFoodCuisineNeedToKnowNotes(cuisine: string, placeLabel: string): CategoryInsightNote[] {
  const normalizedCuisine = cuisine.trim().toLowerCase();
  const knownNotes = foodCuisineNeedToKnowNotes[normalizedCuisine];

  if (knownNotes) {
    return knownNotes;
  }

  return [
    {
      label: `${cuisine} need to knows`,
      body: `Use ${cuisine.toLowerCase()} as a narrower lane inside ${placeLabel} food: check whether the guide is built for a quick stop, a reservation, or a neighborhood route.`,
    },
    {
      label: "Plan",
      body: "Match the meal to the day before picking the room: casual lunch, flexible snack, planned dinner, or a stop that anchors the whole route.",
    },
  ];
}
