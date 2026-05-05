import {
  madridCitywideGuides,
  madridNeighborhoodGuides,
} from "@/data/guides/madrid";
import { globalGuides } from "@/data/guides/global";
import {
  barcelonaCoreGuides,
  barcelonaItineraryGuides,
} from "@/data/guides/barcelona";
import { sanFranciscoGuides } from "@/data/guides/san-francisco";
import type { MapList } from "@/types";

export const editorialGuideLists: MapList[] = [
  ...madridNeighborhoodGuides,
  ...globalGuides,
  ...barcelonaCoreGuides,
  ...madridCitywideGuides,
  ...barcelonaItineraryGuides,
  ...sanFranciscoGuides,
];
