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
import { athensCitywideGuides } from "@/data/guides/athens";
import { bangkokCitywideGuides } from "@/data/guides/bangkok";
import { berlinCitywideGuides } from "@/data/guides/berlin";
import { copenhagenCitywideGuides } from "@/data/guides/copenhagen";
import { hanoiCitywideGuides } from "@/data/guides/hanoi";
import { hongKongCitywideGuides } from "@/data/guides/hong-kong";
import { istanbulCitywideGuides } from "@/data/guides/istanbul";
import { lisbonCitywideGuides } from "@/data/guides/lisbon";
import { losAngelesCitywideGuides } from "@/data/guides/los-angeles";
import { miamiCitywideGuides } from "@/data/guides/miami";
import { mexicoCityCitywideGuides } from "@/data/guides/mexico-city";
import { newYorkCityCitywideGuides } from "@/data/guides/new-york-city";
import { orlandoCitywideGuides } from "@/data/guides/orlando";
import { pragueCitywideGuides } from "@/data/guides/prague";
import { romeGuides } from "@/data/guides/rome";
import { sanFranciscoGuides } from "@/data/guides/san-francisco";
import {
  tokyoCitywideGuides,
  tokyoNeighborhoodGuides,
} from "@/data/guides/tokyo";
import { enrichGuidesCuisineTypes } from "@/lib/guide-cuisine";
import type { MapList } from "@/types";

export const editorialGuideLists: MapList[] = enrichGuidesCuisineTypes([
  ...parisNeighborhoodGuides,
  ...parisCitywideGuides,
  ...londonNeighborhoodGuides,
  ...londonCitywideGuides,
  ...newYorkCityCitywideGuides,
  ...losAngelesCitywideGuides,
  ...miamiCitywideGuides,
  ...orlandoCitywideGuides,
  ...mexicoCityCitywideGuides,
  ...madridNeighborhoodGuides,
  ...globalGuides,
  ...istanbulCitywideGuides,
  ...lisbonCitywideGuides,
  ...pragueCitywideGuides,
  ...tokyoNeighborhoodGuides,
  ...tokyoCitywideGuides,
  ...barcelonaCoreGuides,
  ...bangkokCitywideGuides,
  ...athensCitywideGuides,
  ...hanoiCitywideGuides,
  ...hongKongCitywideGuides,
  ...berlinCitywideGuides,
  ...copenhagenCitywideGuides,
  ...amsterdamNeighborhoodGuides,
  ...amsterdamCitywideGuides,
  ...amsterdamItineraryGuides,
  ...romeGuides,
  ...madridCitywideGuides,
  ...barcelonaItineraryGuides,
  ...sanFranciscoGuides,
]);
