import {
  madridCitywideGuides,
  madridNeighborhoodGuides,
} from "@/data/guides/madrid";
import {
  londonCitywideGuides,
  londonNeighborhoodGuides,
} from "@/data/guides/london";
import {
  parisCitywideGuides,
  parisNeighborhoodGuides,
} from "@/data/guides/paris";
import { globalGuides } from "@/data/guides/global";
import {
  barcelonaCoreGuides,
  barcelonaItineraryGuides,
} from "@/data/guides/barcelona";
import {
  amsterdamCitywideGuides,
  amsterdamItineraryGuides,
  amsterdamNeighborhoodGuides,
} from "@/data/guides/amsterdam";
import { berlinCitywideGuides } from "@/data/guides/berlin";
import { istanbulCitywideGuides } from "@/data/guides/istanbul";
import { lisbonCitywideGuides } from "@/data/guides/lisbon";
import { newYorkCityCitywideGuides } from "@/data/guides/new-york-city";
import { pragueCitywideGuides } from "@/data/guides/prague";
import { romeGuides } from "@/data/guides/rome";
import { sanFranciscoGuides } from "@/data/guides/san-francisco";
import { enrichGuidesCuisineTypes } from "@/lib/guide-cuisine";
import type { MapList } from "@/types";

export const editorialGuideLists: MapList[] = enrichGuidesCuisineTypes([
  ...parisNeighborhoodGuides,
  ...parisCitywideGuides,
  ...londonNeighborhoodGuides,
  ...londonCitywideGuides,
  ...newYorkCityCitywideGuides,
  ...madridNeighborhoodGuides,
  ...globalGuides,
  ...istanbulCitywideGuides,
  ...lisbonCitywideGuides,
  ...pragueCitywideGuides,
  ...barcelonaCoreGuides,
  ...berlinCitywideGuides,
  ...amsterdamNeighborhoodGuides,
  ...amsterdamCitywideGuides,
  ...amsterdamItineraryGuides,
  ...romeGuides,
  ...madridCitywideGuides,
  ...barcelonaItineraryGuides,
  ...sanFranciscoGuides,
]);
