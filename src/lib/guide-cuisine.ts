import type { GuideStop, MapList } from "@/types";

function uniqueValues(values: string[]) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function textForStop(stop: GuideStop, list: MapList) {
  return [
    stop.name,
    stop.description,
    ...(stop.attributeTags ?? []),
    ...(stop.tags ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function inferFoodServiceType(stop: GuideStop, list: MapList): GuideStop["foodServiceType"] {
  if (stop.foodServiceType) {
    return stop.foodServiceType;
  }

  const text = textForStop(stop, list);
  if (/\b(food market|market hall|covered market|food hall|stalls?|grazing hall|mercado)\b/.test(text)) return "stall";
  if (/\b(bakery|boulangerie|patisserie|pastry|croissant|bread)\b/.test(text)) return "bakery";
  if (/\b(cafe|coffee|tea[-\s]?room|brunch)\b/.test(text)) return "cafe";
  if (/\b(counter|sandwich|falafel|churros|kebab|burger|fast|quick|standing-room|slice)\b/.test(text)) return "counter_service";
  if (/\b(pub|gastropub|pints?|ale|beer hall)\b/.test(text)) return "pub";
  return "restaurant";
}

export function inferCuisineTypes(stop: GuideStop, list: MapList) {
  if (Array.isArray(stop.cuisineTypes) && stop.cuisineTypes.length) {
    return uniqueValues(stop.cuisineTypes);
  }

  const text = textForStop(stop, list);
  const city = list.location.city?.toLowerCase();
  const country = list.location.country?.toLowerCase();
  const cuisines: string[] = [];

  const add = (value: string) => cuisines.push(value);
  const has = (pattern: RegExp) => pattern.test(text);

  if (has(/\b(vegan|plant[-\s]?based|vegetarian)\b/)) add(has(/\bvegan|plant[-\s]?based\b/) ? "vegan" : "vegetarian");
  if (has(/\b(fine dining|michelin|tasting menu|omakase|destination dinner|special-occasion|splurge)\b/)) add("fine_dining");
  if (has(/\b(tapas|pinchos|cava baja|small plates|vermouth)\b/)) add("tapas");
  if (has(/\b(seafood|fish|oyster|shellfish|crudo|fideu|paella|coastal|cod|calamari|anchov)\b/)) add("seafood");
  if (has(/\b(food market|market hall|covered market|food hall|stalls?|grazing|mercado)\b/)) add("market");
  if (has(/\b(street food|kebab|falafel|currywurst|churros|sandwich|burger|hot dog|counter|standing-room|quick stop)\b/)) add("street_food");
  if (has(/\b(pub|gastropub|pint|ale|roast|pie|cask)\b/)) add("pub_food");
  if (has(/\b(bakery|boulangerie|patisserie|pastry|macaron|croissant|bread|dessert|chocolate|churros)\b/)) add("bakery");
  if (has(/\b(cafe|coffee|tea room|brunch|breakfast)\b/)) add("cafe");
  if (has(/\b(wine|natural wine|bottle|bistro|brasserie|bouillon)\b/)) add(has(/\bbrasserie|bouillon\b/) ? "brasserie" : "bistro");

  if (has(/\b(turkish|anatolian|ottoman|lokanta|meyhane|meze|kebab)\b/)) add("turkish");
  if (has(/\b(roman|italian|pasta|pizza|trattoria|osteria|gelato|lazio)\b/)) add("italian");
  if (has(/\b(french|brasserie|bistro|bouillon|breton|galette|crepe|alsatian)\b/)) add("french");
  if (has(/\b(spanish|cocido|croquetas|gazpacho|huevos rotos)\b/)) add("spanish");
  if (has(/\b(catalan|catalonia)\b/)) add("catalan");
  if (has(/\b(portuguese|tasca|bifana|cervejaria|alentejo)\b/)) add("portuguese");
  if (has(/\b(dutch|rijsttafel)\b/)) add("dutch");
  if (has(/\b(german|austrian|schnitzel|currywurst)\b/)) add("german");
  if (has(/\b(czech|bohemian|beer hall|chlebicky)\b/)) add("czech");
  if (has(/\b(british|english|full[-\s]?english|fish and chips|roast|pie)\b/)) add("british");
  if (has(/\b(indian|south asian|sri lankan|curry|dishoom|hoppers|gunpowder)\b/)) add("indian");
  if (has(/\b(thai|bangkok|kiln|smoking goat)\b/)) add("thai");
  if (has(/\b(chinese|cantonese|mapo|tofu vegan|dumpling|noodles)\b/)) add("chinese");
  if (has(/\b(japanese|sushi|omakase|udon|bento|ramen)\b/)) add("japanese");
  if (has(/\b(middle eastern|lebanese|moroccan|tagine|couscous|laffa|halloumi|falafel|fallafel)\b/)) add("middle_eastern");
  if (has(/\b(mexican|taco|taqueria)\b/)) add("mexican");
  if (has(/\b(american|barbecue|bbq|wings|burger)\b/)) add("american");
  if (has(/\b(mediterranean|greek|levant|seasonal produce)\b/)) add("mediterranean");

  const regionalCuisines = new Set([
    "turkish",
    "italian",
    "french",
    "spanish",
    "catalan",
    "portuguese",
    "dutch",
    "german",
    "czech",
    "british",
    "indian",
    "thai",
    "chinese",
    "japanese",
    "middle_eastern",
    "mexican",
    "american",
    "mediterranean",
  ]);
  const hasRegionalCuisine = cuisines.some((cuisine) => regionalCuisines.has(cuisine));

  if (!hasRegionalCuisine) {
    if (city === "london") add("british");
    else if (city === "paris") add("french");
    else if (city === "rome") add("italian");
    else if (city === "madrid") add("spanish");
    else if (city === "barcelona") add("catalan");
    else if (city === "istanbul") add("turkish");
    else add("local");
  }

  return uniqueValues(cuisines);
}

function enrichFoodStop(stop: GuideStop, list: MapList, forceFood: boolean): GuideStop {
  const isFoodStop = forceFood || stop.category === "Food" || stop.venueKind === "food_drink" || Boolean(stop.foodServiceType);
  const nextPlaces = stop.places?.map((place) => enrichFoodStop(place, list, isFoodStop));

  if (!isFoodStop) {
    return nextPlaces ? { ...stop, places: nextPlaces } : stop;
  }

  return {
    ...stop,
    foodServiceType: inferFoodServiceType(stop, list),
    cuisineTypes: inferCuisineTypes(stop, list),
    ...(nextPlaces ? { places: nextPlaces } : {}),
  };
}

export function enrichGuideCuisineTypes(list: MapList): MapList {
  if (list.category !== "Food" && !list.stops.some((stop) => stop.category === "Food" || stop.venueKind === "food_drink")) {
    return list;
  }

  return {
    ...list,
    stops: list.stops.map((stop) => enrichFoodStop(stop, list, list.category === "Food")),
  };
}

export function enrichGuidesCuisineTypes(lists: MapList[]) {
  return lists.map(enrichGuideCuisineTypes);
}
