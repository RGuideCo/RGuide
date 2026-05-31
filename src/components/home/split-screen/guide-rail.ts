import { CATEGORY_STYLES } from "@/lib/constants";
import type { ListCategory, MapList } from "@/types";

function getCityHighlightSearchText(list: MapList) {
  return [
    list.title,
    list.seoTitle,
    list.seoDescription,
    list.description,
    list.slug,
    list.location.neighborhood,
    ...list.stops.map((stop) => stop.description),
  ]
    .filter((value): value is string => Boolean(value))
    .join(" ")
    .toLowerCase();
}

export function doesGuideMatchHighlightTheme(list: MapList, theme: string) {
  const text = getCityHighlightSearchText(list);

  switch (theme) {
    case "Tapas":
      return /\b(tapas|pintxos|bites|counter|cava|vermouth|blai)\b/.test(text);
    case "Seafood":
      return /\b(seafood|fish|shellfish|clams|squid|rice)\b/.test(text);
    case "British":
      return /\b(british|modern british|sunday roast|roast|pie|fish and chips|gastropub|pub)\b/.test(text);
    case "Pub Food":
      return /\b(pub|gastropub|pint|ale|roast|pie|fish and chips)\b/.test(text);
    case "Indian":
      return /\b(indian|south asian|curry|tandoor|biryani|dishoom|brick lane)\b/.test(text);
    case "Michelin-level dining":
    case "Michelin":
      return /\b(michelin|tasting menu|fine dining|chef-led|destination restaurant|special-occasion)\b/.test(text);
    case "Late hours":
    case "Late":
      return /\b(late|late-night|nightlife|after-dark|party|club|apolo)\b/.test(text);
    case "Bar hopping zones":
    case "Bars":
      return /\b(bar hopping|bar circuit|bars|pub|vermouth|plaza|old-city|neighborhood)\b/.test(text);
    case "Cocktail bars":
    case "Cocktails":
      return /\b(cocktail|speakeasy|popular bars|destination nightlife)\b/.test(text);
    case "Architecture":
      return /\b(architecture|gaudi|gaudí|modernista|gothic|landmark)\b/.test(text);
    case "Museums":
      return /\b(museum|museums|gallery|galleries|collection|artist)\b/.test(text);
    case "Historic quarters":
    case "History":
      return /\b(historic|old-city|old city|quarter|cathedral|heritage|memory)\b/.test(text);
    case "Boutique hotels":
    case "Boutique":
      return /\b(boutique|hotel|design|private rooms|stylish)\b/.test(text);
    case "Social hostels":
    case "Hostels":
      return /\b(hostel|hostels|dorm|social|solo travelers|backpackers)\b/.test(text);
    case "Walkable bases":
    case "Walkable":
      return /\b(walkable|base|location|transit|neighborhood|walking)\b/.test(text);
    case "Social":
      return /\b(social|bars|nightlife|hostel|group|solo travelers)\b/.test(text);
    case "High energy":
    case "Energy":
      return /\b(high energy|weekend|nightcap|party|busy|packed|circuit)\b/.test(text);
    case "Views":
      return /\b(view|views|lookout|hilltop|scenic|panorama)\b/.test(text);
    case "Urban parks":
      return /\b(park|parks|gardens|green)\b/.test(text);
    case "Waterfront":
      return /\b(waterfront|coastal|beach|river|harbor|harbour)\b/.test(text);
    default:
      return false;
  }
}

export function getLightCategoryTextColor(category: ListCategory, mixWithWhite = 0.58) {
  const color = CATEGORY_STYLES[category].mapColor;
  const normalized = color.startsWith("#") ? color.slice(1) : color;

  if (normalized.length !== 6) {
    return color;
  }

  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);

  if (![red, green, blue].every(Number.isFinite)) {
    return color;
  }

  const mix = (channel: number) => Math.round(channel * (1 - mixWithWhite) + 255 * mixWithWhite);
  const toHex = (channel: number) => mix(channel).toString(16).padStart(2, "0");

  return `#${toHex(red)}${toHex(green)}${toHex(blue)}`;
}
