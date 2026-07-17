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
import { dublinCitywideGuides } from "@/data/guides/dublin";
import { dubaiCitywideGuides } from "@/data/guides/dubai";
import { florenceCitywideGuides } from "@/data/guides/florence";
import { hanoiCitywideGuides } from "@/data/guides/hanoi";
import { hongKongCitywideGuides } from "@/data/guides/hong-kong";
import { istanbulCitywideGuides } from "@/data/guides/istanbul";
import { kyotoCitywideGuides } from "@/data/guides/kyoto";
import { lisbonCitywideGuides } from "@/data/guides/lisbon";
import { losAngelesCitywideGuides } from "@/data/guides/los-angeles";
import { miamiCitywideGuides } from "@/data/guides/miami";
import { mexicoCityCitywideGuides } from "@/data/guides/mexico-city";
import { melbourneCitywideGuides } from "@/data/guides/melbourne";
import { milanCitywideGuides } from "@/data/guides/milan";
import { munichCitywideGuides } from "@/data/guides/munich";
import { newYorkCityCitywideGuides } from "@/data/guides/new-york-city";
import { orlandoCitywideGuides } from "@/data/guides/orlando";
import { osakaCitywideGuides } from "@/data/guides/osaka";
import { pragueCitywideGuides } from "@/data/guides/prague";
import { romeGuides } from "@/data/guides/rome";
import { sanFranciscoGuides } from "@/data/guides/san-francisco";
import { seoulCitywideGuides } from "@/data/guides/seoul";
import { singaporeCitywideGuides } from "@/data/guides/singapore";
import { sydneyCitywideGuides } from "@/data/guides/sydney";
import {
  tokyoCitywideGuides,
  tokyoNeighborhoodGuides,
} from "@/data/guides/tokyo";
import { enrichGuidesCuisineTypes } from "@/lib/guide-cuisine";
import type { MapList } from "@/types";

function enrichDiveBarTags(lists: MapList[]): MapList[] {
  return lists.map((list) => {
    if (list.seoSlug !== "best-dive-bars") return list;

    return {
      ...list,
      stops: list.stops.map((stop) => ({
        ...stop,
        attributeTags: [
          "dive_bars",
          ...(stop.attributeTags ?? []).filter((tag) => tag !== "dive_bars"),
        ],
      })),
    };
  });
}

export const editorialGuideLists: MapList[] = enrichDiveBarTags(enrichGuidesCuisineTypes([
  ...parisNeighborhoodGuides,
  ...parisCitywideGuides,
  ...londonNeighborhoodGuides,
  ...londonCitywideGuides,
  ...newYorkCityCitywideGuides,
  ...losAngelesCitywideGuides,
  ...miamiCitywideGuides,
  ...orlandoCitywideGuides,
  ...mexicoCityCitywideGuides,
  ...melbourneCitywideGuides,
  ...milanCitywideGuides,
  ...munichCitywideGuides,
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
  ...kyotoCitywideGuides,
  ...osakaCitywideGuides,
  ...berlinCitywideGuides,
  ...copenhagenCitywideGuides,
  ...dublinCitywideGuides,
  ...dubaiCitywideGuides,
  ...florenceCitywideGuides,
  ...seoulCitywideGuides,
  ...singaporeCitywideGuides,
  ...sydneyCitywideGuides,
  ...amsterdamNeighborhoodGuides,
  ...amsterdamCitywideGuides,
  ...amsterdamItineraryGuides,
  ...romeGuides,
  ...madridCitywideGuides,
  ...barcelonaItineraryGuides,
  ...sanFranciscoGuides,
]));
