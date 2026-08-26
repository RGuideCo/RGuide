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
  parisSeoQueryGuides,
} from "@/data/guides/paris";
import { globalGuides } from "@/data/guides/global";
import {
  barcelonaCoreGuides,
  barcelonaItineraryGuides,
  barcelonaSeoQueryGuides,
} from "@/data/guides/barcelona";
import {
  amsterdamCitywideGuides,
  amsterdamItineraryGuides,
  amsterdamNeighborhoodGuides,
} from "@/data/guides/amsterdam";
import { valenciaCitywideGuides } from "@/data/guides/valencia";
import { addisAbabaCitywideGuides } from "@/data/guides/addis-ababa";
import { athensCitywideGuides } from "@/data/guides/athens";
import { aucklandCitywideGuides } from "@/data/guides/auckland";
import { bangkokCitywideGuides } from "@/data/guides/bangkok";
import { belgradeCitywideGuides } from "@/data/guides/belgrade";
import { buenosAiresCitywideGuides } from "@/data/guides/buenos-aires";
import { cairoCitywideGuides } from "@/data/guides/cairo";
import { capeTownCitywideGuides } from "@/data/guides/cape-town";
import {
  berlinCitywideGuides,
  berlinNeighborhoodGuides,
} from "@/data/guides/berlin";
import { copenhagenCitywideGuides } from "@/data/guides/copenhagen";
import { cuscoCitywideGuides } from "@/data/guides/cusco";
import { danangCitywideGuides } from "@/data/guides/danang";
import { dublinCitywideGuides } from "@/data/guides/dublin";
import { edinburghCitywideGuides } from "@/data/guides/edinburgh";
import { dubaiCitywideGuides } from "@/data/guides/dubai";
import { florenceCitywideGuides } from "@/data/guides/florence";
import { hanoiCitywideGuides } from "@/data/guides/hanoi";
import { hamburgCitywideGuides } from "@/data/guides/hamburg";
import { hongKongCitywideGuides } from "@/data/guides/hong-kong";
import { houstonCitywideGuides } from "@/data/guides/houston";
import { istanbulCitywideGuides } from "@/data/guides/istanbul";
import { kyotoCitywideGuides } from "@/data/guides/kyoto";
import { krakowCitywideGuides } from "@/data/guides/krakow";
import { kualaLumpurCitywideGuides } from "@/data/guides/kuala-lumpur";
import { lasVegasCitywideGuides } from "@/data/guides/las-vegas";
import { limaCitywideGuides } from "@/data/guides/lima";
import { lisbonCitywideGuides } from "@/data/guides/lisbon";
import { lagosCitywideGuides } from "@/data/guides/lagos";
import { losAngelesCitywideGuides } from "@/data/guides/los-angeles";
import { miamiCitywideGuides } from "@/data/guides/miami";
import { mexicoCityCitywideGuides } from "@/data/guides/mexico-city";
import { marrakeshCitywideGuides } from "@/data/guides/marrakesh";
import { melbourneCitywideGuides } from "@/data/guides/melbourne";
import { medellinCitywideGuides } from "@/data/guides/medellin";
import { nairobiCitywideGuides } from "@/data/guides/nairobi";
import { zanzibarCitywideGuides } from "@/data/guides/zanzibar";
import { bogotaCitywideGuides } from "@/data/guides/bogota";
import { milanCitywideGuides } from "@/data/guides/milan";
import { munichCitywideGuides } from "@/data/guides/munich";
import { newYorkCityCitywideGuides } from "@/data/guides/new-york-city";
import { newYorkBoroughFoodStayNightlifeGuides } from "@/data/guides/new-york-boroughs";
import { orlandoCitywideGuides } from "@/data/guides/orlando";
import { osakaCitywideGuides } from "@/data/guides/osaka";
import { osloCitywideGuides } from "@/data/guides/oslo";
import { pragueCitywideGuides } from "@/data/guides/prague";
import { romeGuides } from "@/data/guides/rome";
import { sanFranciscoGuides } from "@/data/guides/san-francisco";
import { seoulCitywideGuides } from "@/data/guides/seoul";
import { santiagoCitywideGuides } from "@/data/guides/santiago";
import { shanghaiCitywideGuides } from "@/data/guides/shanghai";
import { singaporeCitywideGuides } from "@/data/guides/singapore";
import { stockholmCitywideGuides } from "@/data/guides/stockholm";
import { sydneyCitywideGuides } from "@/data/guides/sydney";
import { taipeiCitywideGuides } from "@/data/guides/taipei";
import { torontoCitywideGuides } from "@/data/guides/toronto";
import { tbilisiCitywideGuides } from "@/data/guides/tbilisi";
import { tiranaCitywideGuides } from "@/data/guides/tirana";
import { veniceCitywideGuides } from "@/data/guides/venice";
import { viennaCitywideGuides } from "@/data/guides/vienna";
import { wellingtonCitywideGuides } from "@/data/guides/wellington";
import { warsawCitywideGuides } from "@/data/guides/warsaw";
import { zurichCitywideGuides } from "@/data/guides/zurich";
import {
  tokyoCitywideGuides,
  tokyoNeighborhoodGuides,
} from "@/data/guides/tokyo";
import { enrichGuidesCuisineTypes } from "@/lib/guide-cuisine";
import { applyGuideMediaCache } from "@/lib/guide-media-cache";
import type { MapList } from "@/types";

export const editorialGuideLists: MapList[] = applyGuideMediaCache(enrichGuidesCuisineTypes([
  ...valenciaCitywideGuides,
  ...addisAbabaCitywideGuides,
  ...parisNeighborhoodGuides,
  ...parisCitywideGuides,
  ...parisSeoQueryGuides,
  ...londonNeighborhoodGuides,
  ...londonCitywideGuides,
  ...newYorkCityCitywideGuides,
  ...newYorkBoroughFoodStayNightlifeGuides,
  ...losAngelesCitywideGuides,
  ...miamiCitywideGuides,
  ...orlandoCitywideGuides,
  ...mexicoCityCitywideGuides,
  ...marrakeshCitywideGuides,
  ...melbourneCitywideGuides,
  ...medellinCitywideGuides,
  ...nairobiCitywideGuides,
  ...zanzibarCitywideGuides,
  ...bogotaCitywideGuides,
  ...milanCitywideGuides,
  ...munichCitywideGuides,
  ...madridNeighborhoodGuides,
  ...globalGuides,
  ...istanbulCitywideGuides,
  ...lisbonCitywideGuides,
  ...lagosCitywideGuides,
  ...pragueCitywideGuides,
  ...tokyoNeighborhoodGuides,
  ...tokyoCitywideGuides,
  ...barcelonaCoreGuides,
  ...barcelonaSeoQueryGuides,
  ...bangkokCitywideGuides,
  ...belgradeCitywideGuides,
  ...buenosAiresCitywideGuides,
  ...cairoCitywideGuides,
  ...capeTownCitywideGuides,
  ...athensCitywideGuides,
  ...aucklandCitywideGuides,
  ...hanoiCitywideGuides,
  ...hamburgCitywideGuides,
  ...hongKongCitywideGuides,
  ...houstonCitywideGuides,
  ...kyotoCitywideGuides,
  ...krakowCitywideGuides,
  ...kualaLumpurCitywideGuides,
  ...lasVegasCitywideGuides,
  ...limaCitywideGuides,
  ...osakaCitywideGuides,
  ...osloCitywideGuides,
  ...berlinNeighborhoodGuides,
  ...berlinCitywideGuides,
  ...copenhagenCitywideGuides,
  ...cuscoCitywideGuides,
  ...danangCitywideGuides,
  ...dublinCitywideGuides,
  ...edinburghCitywideGuides,
  ...dubaiCitywideGuides,
  ...florenceCitywideGuides,
  ...seoulCitywideGuides,
  ...santiagoCitywideGuides,
  ...shanghaiCitywideGuides,
  ...singaporeCitywideGuides,
  ...stockholmCitywideGuides,
  ...sydneyCitywideGuides,
  ...taipeiCitywideGuides,
  ...torontoCitywideGuides,
  ...tbilisiCitywideGuides,
  ...tiranaCitywideGuides,
  ...veniceCitywideGuides,
  ...viennaCitywideGuides,
  ...wellingtonCitywideGuides,
  ...warsawCitywideGuides,
  ...zurichCitywideGuides,
  ...amsterdamNeighborhoodGuides,
  ...amsterdamCitywideGuides,
  ...amsterdamItineraryGuides,
  ...romeGuides,
  ...madridCitywideGuides,
  ...barcelonaItineraryGuides,
  ...sanFranciscoGuides,
]));
