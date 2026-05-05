import type { Feature, Geometry } from "geojson";
import amsterdamBoundaries from "@/data/boundaries/amsterdam.json";
import athensBoundaries from "@/data/boundaries/athens.json";
import barcelonaBoundaries from "@/data/boundaries/barcelona.json";
import berlinBoundaries from "@/data/boundaries/berlin.json";
import bostonBoundaries from "@/data/boundaries/boston.json";
import chicagoBoundaries from "@/data/boundaries/chicago.json";
import dallasBoundaries from "@/data/boundaries/dallas.json";
import dubaiBoundaries from "@/data/boundaries/dubai.json";
import honoluluBoundaries from "@/data/boundaries/honolulu.json";
import houstonBoundaries from "@/data/boundaries/houston.json";
import jacksonvilleBoundaries from "@/data/boundaries/jacksonville.json";
import lasVegasBoundaries from "@/data/boundaries/las-vegas.json";
import lisbonBoundaries from "@/data/boundaries/lisbon.json";
import londonBoundaries from "@/data/boundaries/london.json";
import losAngelesBoundaries from "@/data/boundaries/los-angeles.json";
import lyonBoundaries from "@/data/boundaries/lyon.json";
import madridBoundaries from "@/data/boundaries/madrid.json";
import medellinBoundaries from "@/data/boundaries/medellin.json";
import melbourneBoundaries from "@/data/boundaries/melbourne.json";
import mexicoCityBoundaries from "@/data/boundaries/mexico-city.json";
import miamiBoundaries from "@/data/boundaries/miami.json";
import milanBoundaries from "@/data/boundaries/milan.json";
import nashvilleBoundaries from "@/data/boundaries/nashville.json";
import newOrleansBoundaries from "@/data/boundaries/new-orleans.json";
import newYorkCityBoundaries from "@/data/boundaries/new-york-city.json";
import orlandoBoundaries from "@/data/boundaries/orlando.json";
import parisBoundaries from "@/data/boundaries/paris.json";
import philadelphiaBoundaries from "@/data/boundaries/philadelphia.json";
import phoenixBoundaries from "@/data/boundaries/phoenix.json";
import portoBoundaries from "@/data/boundaries/porto.json";
import pragueBoundaries from "@/data/boundaries/prague.json";
import romeBoundaries from "@/data/boundaries/rome.json";
import sanAntonioBoundaries from "@/data/boundaries/san-antonio.json";
import sanDiegoBoundaries from "@/data/boundaries/san-diego.json";
import sanFranciscoBoundaries from "@/data/boundaries/san-francisco.json";
import seattleBoundaries from "@/data/boundaries/seattle.json";
import sydneyBoundaries from "@/data/boundaries/sydney.json";
import tokyoBoundaries from "@/data/boundaries/tokyo.json";
import viennaBoundaries from "@/data/boundaries/vienna.json";
import washingtonDcBoundaries from "@/data/boundaries/washington-dc.json";

type NeighborhoodBoundaryProperties = {
  id: string;
  name: string;
};

export type NeighborhoodBoundaryMap = Record<string, Feature<Geometry, NeighborhoodBoundaryProperties>>;

const boundaryCollections = [
  amsterdamBoundaries,
  athensBoundaries,
  barcelonaBoundaries,
  berlinBoundaries,
  bostonBoundaries,
  chicagoBoundaries,
  dallasBoundaries,
  dubaiBoundaries,
  honoluluBoundaries,
  houstonBoundaries,
  jacksonvilleBoundaries,
  lasVegasBoundaries,
  lisbonBoundaries,
  londonBoundaries,
  losAngelesBoundaries,
  lyonBoundaries,
  madridBoundaries,
  medellinBoundaries,
  melbourneBoundaries,
  mexicoCityBoundaries,
  miamiBoundaries,
  milanBoundaries,
  nashvilleBoundaries,
  newOrleansBoundaries,
  newYorkCityBoundaries,
  orlandoBoundaries,
  parisBoundaries,
  philadelphiaBoundaries,
  phoenixBoundaries,
  portoBoundaries,
  pragueBoundaries,
  romeBoundaries,
  sanAntonioBoundaries,
  sanDiegoBoundaries,
  sanFranciscoBoundaries,
  seattleBoundaries,
  sydneyBoundaries,
  tokyoBoundaries,
  viennaBoundaries,
  washingtonDcBoundaries,
] as Array<Record<string, Feature<Geometry, NeighborhoodBoundaryProperties>>>;

export const neighborhoodBoundaryFeatures: NeighborhoodBoundaryMap = Object.assign({}, ...boundaryCollections);

export default neighborhoodBoundaryFeatures;
