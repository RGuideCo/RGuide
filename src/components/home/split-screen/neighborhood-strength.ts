import type { DestinationCategoryNeighborhoodStrength, ListCategory } from "@/types";

type NeighborhoodStrengthInput = {
  activeSubcategory?: string | null;
  cityId?: string | null;
  category?: ListCategory | null;
  neighborhoodId?: string | null;
  neighborhoodName?: string | null;
  nightlifeBarType?: string | null;
  researchStrengths?: DestinationCategoryNeighborhoodStrength[];
};

type ResearchStrength = {
  score: number;
};

type NeighborhoodStrengthField = {
  rationale: string;
  scores: Record<string, number>;
};

type NeighborhoodStrengthConfig = {
  methodology: string;
  sourceUrls: string[];
  fields: Record<string, NeighborhoodStrengthField>;
};

const normalizeStrengthKey = (value?: string | null) =>
  (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const tokyoNightlifeStrength: NeighborhoodStrengthConfig = {
  methodology:
    "Scores use researched neighborhood reputation first, then the app adds guide coverage as a secondary signal. Use 0-10 scores where 9+ means city-defining, 7-8 means strong for the field, 5-6 means useful but narrower, and below 5 means secondary.",
  sourceUrls: [
    "https://www.gotokyo.org/en/destinations/western-tokyo/shinjuku/index.html",
    "https://www.gotokyo.org/en/destinations/western-tokyo/shibuya/index.html",
    "https://www.gotokyo.org/en/destinations/southern-tokyo/roppongi/index.html",
    "https://www.gotokyo.org/en/destinations/central-tokyo/ginza/index.html",
    "https://www.gotokyo.org/en/destinations/eastern-tokyo/asakusa/index.html",
  ],
  fields: {
    default: {
      rationale: "General nightlife strength across bar density, late districts, visitor usefulness, and range of night formats.",
      scores: {
        shinjuku: 9.4,
        shibuya: 9,
        roppongi: 8.6,
        ginza: 6.4,
        asakusa: 4,
      },
    },
    "late night": {
      rationale: "Late-night usefulness after dinner, transit cutoff, bar density, and post-midnight energy.",
      scores: {
        shinjuku: 9.6,
        shibuya: 9.3,
        roppongi: 8.4,
        ginza: 5.6,
        asakusa: 3.6,
      },
    },
    "live music": {
      rationale: "Music rooms, clubs, jazz/live venues, and areas where a night can be built around sound rather than only drinks.",
      scores: {
        shibuya: 8.4,
        shinjuku: 7.8,
        roppongi: 6.8,
        ginza: 4.6,
        asakusa: 3.8,
      },
    },
    rooftops: {
      rationale: "Hotel bars, skyline rooms, and elevated night views rather than general street-level nightlife.",
      scores: {
        roppongi: 8.2,
        ginza: 7.4,
        shibuya: 6.4,
        shinjuku: 5.8,
        asakusa: 3.4,
      },
    },
    bars: {
      rationale: "General bar usefulness, including tiny rooms, casual bars, cocktail rooms, and walkable backup density.",
      scores: {
        shinjuku: 9.2,
        shibuya: 8.8,
        roppongi: 8.6,
        ginza: 7.2,
        asakusa: 4.2,
      },
    },
    "cocktail bar": {
      rationale: "Polished cocktail-room strength and serious drinks rather than all-purpose party energy.",
      scores: {
        ginza: 8.6,
        roppongi: 8.4,
        shibuya: 8,
        shinjuku: 7.8,
        asakusa: 4,
      },
    },
    "dive bar": {
      rationale: "Tiny, loose, lower-polish, late, or counter-heavy bar energy.",
      scores: {
        shinjuku: 9.3,
        shibuya: 7.8,
        roppongi: 6,
        asakusa: 4.2,
        ginza: 3.4,
      },
    },
    pub: {
      rationale: "Casual drinking usefulness, low-friction group stops, and pub-style nights.",
      scores: {
        shinjuku: 8.4,
        shibuya: 8.2,
        roppongi: 7.2,
        asakusa: 5,
        ginza: 4.8,
      },
    },
  },
};

const cityCategoryResearchStrengths: Record<string, Partial<Record<ListCategory, NeighborhoodStrengthConfig>>> = {
  tokyo: {
    Nightlife: tokyoNightlifeStrength,
  },
};

export function getNeighborhoodResearchStrength({
  activeSubcategory,
  cityId,
  category,
  neighborhoodId,
  neighborhoodName,
  nightlifeBarType,
  researchStrengths,
}: NeighborhoodStrengthInput): ResearchStrength | null {
  if (!cityId || !category || (!neighborhoodName && !neighborhoodId)) {
    return null;
  }

  const fieldKeys = [
    category === "Nightlife" ? nightlifeBarType : null,
    activeSubcategory,
    "default",
  ]
    .map(normalizeStrengthKey)
    .filter(Boolean);

  const databaseStrengths = researchStrengths?.filter((strength) => {
    if (strength.category !== category) {
      return false;
    }

    if (neighborhoodId && strength.neighborhoodId === neighborhoodId) {
      return true;
    }

    return normalizeStrengthKey(strength.neighborhoodName) === normalizeStrengthKey(neighborhoodName);
  });

  for (const fieldKey of fieldKeys) {
    const score = databaseStrengths?.find((strength) => normalizeStrengthKey(strength.fieldKey) === fieldKey)?.score;

    if (typeof score === "number") {
      return { score };
    }
  }

  const categoryResearch = cityCategoryResearchStrengths[cityId]?.[category];
  if (!categoryResearch) {
    return null;
  }

  const neighborhoodKey = normalizeStrengthKey(neighborhoodName);

  for (const fieldKey of fieldKeys) {
    const score = categoryResearch.fields[fieldKey]?.scores[neighborhoodKey];
    if (typeof score === "number") {
      return { score };
    }
  }

  return null;
}
