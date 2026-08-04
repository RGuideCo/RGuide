import { isIndexableEditorialGuide } from "@/lib/deep-link-routes";
import type { ListCategory, MapList } from "@/types";

export type GuideRecommendationGroup = {
  id: "local" | "neighborhoods" | "citywide" | "complementary";
  title: string;
  guides: MapList[];
};

const CATEGORY_LABELS: Record<ListCategory, string> = {
  Food: "Food guides",
  Nightlife: "Nightlife",
  Nature: "Parks and nature",
  Culture: "Culture",
  Stay: "Places to stay",
  Activities: "Things to do",
  Routes: "Routes and walks",
  Essentials: "Travel essentials",
};

const COMPLEMENTARY_CATEGORY_ORDER: Record<ListCategory, ListCategory[]> = {
  Food: ["Nightlife", "Culture", "Stay", "Activities", "Nature", "Routes", "Essentials"],
  Nightlife: ["Food", "Stay", "Culture", "Activities", "Routes", "Nature", "Essentials"],
  Nature: ["Activities", "Culture", "Food", "Stay", "Routes", "Nightlife", "Essentials"],
  Culture: ["Food", "Activities", "Stay", "Nature", "Nightlife", "Routes", "Essentials"],
  Stay: ["Food", "Nightlife", "Culture", "Activities", "Routes", "Nature", "Essentials"],
  Activities: ["Culture", "Food", "Nature", "Stay", "Nightlife", "Routes", "Essentials"],
  Routes: ["Food", "Culture", "Activities", "Stay", "Nature", "Nightlife", "Essentials"],
  Essentials: ["Routes", "Stay", "Food", "Activities", "Culture", "Nature", "Nightlife"],
};

function normalizePlace(value?: string | null) {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function compareGuideQuality(left: MapList, right: MapList) {
  return (
    right.upvotes - left.upvotes ||
    right.stops.length - left.stops.length ||
    left.title.localeCompare(right.title)
  );
}

function uniqueGuidesBy(guides: MapList[], getKey: (guide: MapList) => string) {
  const seen = new Set<string>();

  return guides.filter((guide) => {
    const key = getKey(guide);
    if (!key || seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function compareComplementaryGuides(currentCategory: ListCategory, left: MapList, right: MapList) {
  const order = COMPLEMENTARY_CATEGORY_ORDER[currentCategory];
  const leftCategoryRank = left.category === currentCategory ? -1 : order.indexOf(left.category);
  const rightCategoryRank = right.category === currentCategory ? -1 : order.indexOf(right.category);

  return leftCategoryRank - rightCategoryRank || compareGuideQuality(left, right);
}

function getGuideIntentRank(currentGuide: MapList, candidate: MapList) {
  const currentIntent = normalizePlace(currentGuide.seoSlug);
  return currentIntent && normalizePlace(candidate.seoSlug) === currentIntent ? 0 : 1;
}

function compareGuideIntent(currentGuide: MapList, left: MapList, right: MapList) {
  const leftIntentRank = getGuideIntentRank(currentGuide, left);
  const rightIntentRank = getGuideIntentRank(currentGuide, right);

  return leftIntentRank - rightIntentRank || compareGuideQuality(left, right);
}

function getGuideCenter(guide: MapList) {
  const coordinates = guide.stops
    .map((stop) => stop.coordinates)
    .filter(([latitude, longitude]) => Number.isFinite(latitude) && Number.isFinite(longitude));
  if (!coordinates.length) return null;

  const [latitudeTotal, longitudeTotal] = coordinates.reduce(
    ([latitudeSum, longitudeSum], [latitude, longitude]) => [
      latitudeSum + latitude,
      longitudeSum + longitude,
    ],
    [0, 0],
  );

  return [latitudeTotal / coordinates.length, longitudeTotal / coordinates.length] as const;
}

function getGuideDistanceScore(currentGuide: MapList, candidate: MapList) {
  const currentCenter = getGuideCenter(currentGuide);
  const candidateCenter = getGuideCenter(candidate);
  if (!currentCenter || !candidateCenter) return Number.POSITIVE_INFINITY;

  const latitudeDelta = candidateCenter[0] - currentCenter[0];
  const longitudeScale = Math.cos((currentCenter[0] * Math.PI) / 180);
  const longitudeDelta = (candidateCenter[1] - currentCenter[1]) * longitudeScale;
  return latitudeDelta ** 2 + longitudeDelta ** 2;
}

function compareGuideIntentByProximity(currentGuide: MapList, left: MapList, right: MapList) {
  const intentDifference = getGuideIntentRank(currentGuide, left) - getGuideIntentRank(currentGuide, right);
  if (intentDifference) return intentDifference;

  const distanceDifference = getGuideDistanceScore(currentGuide, left) - getGuideDistanceScore(currentGuide, right);
  return distanceDifference || compareGuideQuality(left, right);
}

function buildGroup(
  id: GuideRecommendationGroup["id"],
  title: string,
  guides: MapList[],
): GuideRecommendationGroup | null {
  return guides.length ? { id, title, guides } : null;
}

export function getGuideCrossLinkGroups(
  currentGuide: MapList,
  guideSource: MapList[],
): GuideRecommendationGroup[] {
  const cityName = currentGuide.location.city?.trim();
  if (!cityName || !isIndexableEditorialGuide(currentGuide)) {
    return [];
  }

  const cityKey = normalizePlace(cityName);
  const countryKey = normalizePlace(currentGuide.location.country);
  const currentNeighborhoodKey = normalizePlace(currentGuide.location.neighborhood);
  const cityGuides = guideSource
    .filter(isIndexableEditorialGuide)
    .filter(
      (guide) =>
        guide.id !== currentGuide.id &&
        normalizePlace(guide.location.city) === cityKey &&
        (!countryKey || normalizePlace(guide.location.country) === countryKey),
    );

  if (currentNeighborhoodKey) {
    const localGuides = uniqueGuidesBy(
      cityGuides
        .filter((guide) => normalizePlace(guide.location.neighborhood) === currentNeighborhoodKey)
        .sort((left, right) => compareComplementaryGuides(currentGuide.category, left, right)),
      (guide) => guide.category,
    ).slice(0, 3);
    const neighborhoodComparisons = uniqueGuidesBy(
      cityGuides
        .filter(
          (guide) =>
            guide.category === currentGuide.category &&
            Boolean(guide.location.neighborhood) &&
            normalizePlace(guide.location.neighborhood) !== currentNeighborhoodKey,
        )
        .sort((left, right) => compareGuideIntentByProximity(currentGuide, left, right)),
      (guide) => normalizePlace(guide.location.neighborhood),
    ).slice(0, 2);
    const citywideGuides = cityGuides
      .filter((guide) => guide.category === currentGuide.category && !guide.location.neighborhood)
      .sort((left, right) => compareGuideIntent(currentGuide, left, right))
      .slice(0, 1);

    return [
      buildGroup("local", `More in ${currentGuide.location.neighborhood}`, localGuides),
      buildGroup("neighborhoods", `${CATEGORY_LABELS[currentGuide.category]} around ${cityName}`, neighborhoodComparisons),
      buildGroup("citywide", `${cityName} citywide`, citywideGuides),
    ].filter((group): group is GuideRecommendationGroup => Boolean(group));
  }

  const neighborhoodGuides = uniqueGuidesBy(
    cityGuides
      .filter((guide) => guide.category === currentGuide.category && Boolean(guide.location.neighborhood))
      .sort((left, right) => compareGuideIntent(currentGuide, left, right)),
    (guide) => normalizePlace(guide.location.neighborhood),
  ).slice(0, 4);
  const complementaryCitywideGuides = uniqueGuidesBy(
    cityGuides
      .filter((guide) => !guide.location.neighborhood && guide.category !== currentGuide.category)
      .sort((left, right) => compareComplementaryGuides(currentGuide.category, left, right)),
    (guide) => guide.category,
  ).slice(0, 2);

  return [
    buildGroup("neighborhoods", `${CATEGORY_LABELS[currentGuide.category]} by neighborhood`, neighborhoodGuides),
    buildGroup("complementary", `More ways to explore ${cityName}`, complementaryCitywideGuides),
  ].filter((group): group is GuideRecommendationGroup => Boolean(group));
}
