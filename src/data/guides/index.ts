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
import { romeGuides } from "@/data/guides/rome";
import { sanFranciscoGuides } from "@/data/guides/san-francisco";
import type { MapList } from "@/types";

export const editorialGuideLists: MapList[] = [
  ...parisNeighborhoodGuides,
  ...parisCitywideGuides,
  ...londonNeighborhoodGuides,
  ...londonCitywideGuides,
  ...madridNeighborhoodGuides,
  ...globalGuides,
  ...barcelonaCoreGuides,
  ...amsterdamNeighborhoodGuides,
  ...amsterdamCitywideGuides,
  ...amsterdamItineraryGuides,
  ...romeGuides,
  ...madridCitywideGuides,
  ...barcelonaItineraryGuides,
  ...sanFranciscoGuides,
];
