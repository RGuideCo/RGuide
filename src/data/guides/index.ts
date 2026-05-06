import {
  madridCitywideGuides,
  madridNeighborhoodGuides,
} from "@/data/guides/madrid";
import { globalGuides } from "@/data/guides/global";
import {
  barcelonaCoreGuides,
  barcelonaItineraryGuides,
} from "@/data/guides/barcelona";
import { romeGuides } from "@/data/guides/rome";
import { sanFranciscoGuides } from "@/data/guides/san-francisco";
import type { MapList } from "@/types";

export const editorialGuideLists: MapList[] = [
  ...madridNeighborhoodGuides,
  ...globalGuides,
  ...barcelonaCoreGuides,
  ...romeGuides,
  ...madridCitywideGuides,
  ...barcelonaItineraryGuides,
  ...sanFranciscoGuides,
];
