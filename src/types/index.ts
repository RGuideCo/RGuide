import type { Geometry } from "geojson";

export type ListCategory =
  | "Food"
  | "Nightlife"
  | "Nature"
  | "Culture"
  | "Stay"
  | "Activities"
  | "Routes"
  | "Essentials";

export type SubmissionType = "guide" | "journal" | "journey" | "itinerary" | "event";

export type VenueKind =
  | "lodging"
  | "food_drink"
  | "nightlife"
  | "culture"
  | "outdoors"
  | "event_venue"
  | "transport"
  | "retail"
  | "service"
  | "landmark"
  | "other";

export type LodgingType =
  | "hotel"
  | "hostel"
  | "resort"
  | "airbnb"
  | "apartment_hotel"
  | "guesthouse"
  | "camping"
  | "holiday_park";

export type FoodServiceType =
  | "restaurant"
  | "cafe"
  | "fast_food"
  | "stall"
  | "food_truck"
  | "food_cart"
  | "bakery"
  | "counter_service"
  | "cafeteria"
  | "pub"
  | "fast_casual";

export type NightlifeType =
  | "dive_bar"
  | "cocktail_bar"
  | "pub"
  | "sports_bar"
  | "gaming_bar"
  | "wine_bar"
  | "beer_bar"
  | "rooftop_bar"
  | "lounge"
  | "club"
  | "live_music_venue"
  | "theatre"
  | "concert_hall"
  | "comedy_club"
  | "karaoke_bar"
  | "casino"
  | "brewery"
  | "other";

export type PriceTier = "$" | "$$" | "$$$" | "$$$$";

export type VenueOperatingStatus = "open" | "temporarily_closed" | "permanently_closed" | "seasonal" | "unknown";

export interface DestinationCategoryInsightChip {
  slug: string;
  label: string;
  filterKind: "subcategory" | "cuisine" | "attribute" | "freeform";
  filterValue: string;
}

export interface DestinationCategoryInsightNote {
  key?: string;
  label?: string;
  body: string;
}

export interface DestinationCategoryInsight {
  category: ListCategory;
  label?: string;
  summary?: string;
  chips: DestinationCategoryInsightChip[];
  notes: DestinationCategoryInsightNote[];
}

export interface DestinationCategoryNeighborhoodStrength {
  neighborhoodId: string;
  neighborhoodName?: string;
  category: ListCategory;
  fieldKey: string;
  score: number;
  rationale?: string;
  sourceUrls?: string[];
}

export interface VenueHoursInterval {
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  intervalOrder?: number;
  isClosed?: boolean;
  is24Hours?: boolean;
  opensAt?: string;
  closesAt?: string;
  opensNextDay?: boolean;
  validFrom?: string;
  validTo?: string;
  rawText?: string;
  lastVerifiedAt?: string;
}

export interface VenueSpecialHoursInterval {
  date: string;
  intervalOrder?: number;
  isClosed?: boolean;
  is24Hours?: boolean;
  opensAt?: string;
  closesAt?: string;
  opensNextDay?: boolean;
  reason?: string;
  rawText?: string;
  lastVerifiedAt?: string;
}

export type VenueAttributeTag =
  | "relaxing"
  | "quiet"
  | "lively"
  | "party"
  | "social"
  | "scenic"
  | "beach"
  | "nature"
  | "central"
  | "budget"
  | "midrange"
  | "luxury"
  | "family_friendly"
  | "romantic"
  | "work_friendly"
  | "wellness"
  | "design"
  | "accessible"
  | "pet_friendly"
  | "casual"
  | "date_night"
  | "group_friendly"
  | "solo_friendly"
  | "family_friendly_food"
  | "local_favorite"
  | "destination_dining"
  | "fine_dining"
  | "tasting_menu"
  | "street_food"
  | "market"
  | "late_night"
  | "breakfast"
  | "brunch"
  | "coffee"
  | "bakery"
  | "seafood"
  | "vegetarian_friendly"
  | "vegan_friendly"
  | "gluten_free_friendly"
  | "reservation_recommended"
  | "walk_in_friendly"
  | "scenic_food"
  | "romantic_food"
  | "lively_food"
  | "quiet_food"
  | "budget_food"
  | "splurge_food"
  | "cheap_drinks"
  | "premium_drinks"
  | "dance_floor"
  | "late_late"
  | "low_key_nightlife"
  | "lively_nightlife"
  | "party_nightlife"
  | "romantic_nightlife"
  | "scenic_nightlife"
  | "local_bar"
  | "speakeasy"
  | "craft_cocktails"
  | "craft_beer"
  | "natural_wine"
  | "live_music"
  | "dj_sets"
  | "comedy"
  | "theatre_show"
  | "karaoke"
  | "games"
  | "sports_screening"
  | "queer_friendly"
  | "tourist_friendly"
  | "dressy"
  | "casual_nightlife"
  | "reservation_recommended_nightlife"
  | "walk_in_friendly_nightlife";

export type RegionKind = "north" | "south" | "east" | "west" | "central";

export interface User {
  id: string;
  name: string;
  email?: string;
  joinedAt?: string;
  avatar: string;
  bio: string;
  visibility?: "public" | "private";
  canPublishGuides?: boolean;
  userType?: string;
}

export interface LocationRef {
  city?: string;
  neighborhood?: string;
  country: string;
  continent: string;
  scope: "continent" | "country" | "city" | "neighborhood";
}

export interface MapList {
  id: string;
  slug: string;
  visibility?: "private" | "followers" | "public";
  seoSlug?: string;
  seoTitle?: string;
  seoDescription?: string;
  title: string;
  description: string;
  highlights?: string[];
  photo?: string;
  routeCoordinates?: [number, number][];
  routeLegend?: {
    label: string;
    dateRange?: string;
  };
  url: string;
  category: ListCategory;
  submissionType?: SubmissionType;
  eventVenueId?: string;
  eventStartsAt?: string;
  eventEndsAt?: string;
  itinerary?: {
    startDate?: string;
    endDate?: string;
  };
  journey?: {
    startDate?: string;
    endDate?: string;
  };
  journal?: {
    visitedAt?: string;
    note?: string;
    visibility?: "public" | "private";
  };
  location: LocationRef;
  creator: {
    id: string;
    name: string;
    avatar: string;
  };
  upvotes: number;
  createdAt: string;
  updatedAt?: string;
  stops: GuideStop[];
  sources?: ListSource[];
}

export interface ListSource {
  name: string;
  url: string;
}

export interface GuideStop {
  id: string;
  poiId?: string;
  venueId?: string;
  sourceKind?: "guide" | "stop";
  sourceListId?: string;
  sourceStopId?: string;
  sourceVenueId?: string;
  defaultDescription?: string;
  externalPlace?: ExternalPlaceReference;
  name: string;
  coordinates: [number, number];
  description: string;
  category?: ListCategory;
  subcategory?: string;
  subcategories?: string[];
  venueKind?: VenueKind;
  lodgingType?: LodgingType;
  foodServiceType?: FoodServiceType;
  cuisineTypes?: string[];
  nightlifeType?: NightlifeType;
  musicGenres?: string[];
  attributeTags?: VenueAttributeTag[] | string[];
  tags?: string[];
  photo?: string;
  imageSourceUrl?: string;
  imageSourceName?: string;
  imageCredit?: string;
  imageLicense?: string;
  sourceUrls?: string[];
  sourceEvidence?: {
    officialUrl?: string;
    mapUrl?: string;
    currentStatusUrl?: string;
    imageSourceUrl?: string;
    editorialUrls?: string[];
    platformUrls?: string[];
    notes?: string;
    checkedAt?: string;
  };
  price?: PriceTier;
  priceSource?: string;
  bookingUrl?: string;
  officialUrl?: string;
  timetableUrl?: string;
  eventVenueId?: string;
  eventTime?: string;
  eventVenue?: string;
  places?: GuideStop[];
  mapMarker?: PoiMapMarker;
  routeCoordinates?: [number, number][];
  itineraryDate?: string;
  itineraryDay?: number;
  journeyDate?: string;
  journeyDay?: number;
  hours?:
    | string
    | {
        mon?: string;
        tue?: string;
        wed?: string;
        thu?: string;
        fri?: string;
        sat?: string;
        sun?: string;
        default?: string;
        spring?: string;
        summer?: string;
        fall?: string;
        winter?: string;
      };
}

export type ExternalPlaceProvider =
  | "geoapify"
  | "google"
  | "osm"
  | "rguide"
  | "manual"
  | "wikidata"
  | "foursquare"
  | "other";

export interface ExternalPlaceReference {
  provider: ExternalPlaceProvider;
  providerPlaceId?: string;
  label?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  country?: string;
  postcode?: string;
  url?: string;
  coordinates?: [number, number];
}

export type PoiMapMarker =
  | {
      kind: "geometry";
      geometry: Geometry;
      label?: string;
    }
  | {
      kind: "neighborhood-boundary";
      cityId?: string;
      subareaId: string;
      nestedSubareaId?: string;
      label?: string;
    };

export interface VenueEvent {
  venue_id: string;
  city_id: string;
  event_id: string;
  event_slug: string;
  event_title: string;
  event_category: string;
  guide_category: ListCategory;
  starts_at: string | null;
  ends_at: string | null;
  starts_on: string | null;
  ends_on: string | null;
  timezone: string;
  official_url: string | null;
  photo_url: string | null;
  is_festival: boolean;
  is_guide_worthy: boolean;
  occurrence_count_at_venue: number;
  next_occurrence_at_venue: string | null;
  latest_occurrence_at_venue: string | null;
}

export interface SubArea {
  id: string;
  name: string;
  coordinates: [number, number];
  description?: string;
  subareas?: SubArea[];
  categoryInsights?: DestinationCategoryInsight[];
  categoryNeighborhoodStrengths?: DestinationCategoryNeighborhoodStrength[];
}

export interface CountryState extends SubArea {
  countrySubareaId: string;
}

export interface City {
  id: string;
  name: string;
  country: string;
  continent: string;
  coordinates: [number, number];
  countrySubareaId?: string;
  stateId?: string;
  isPlaceholderRegion?: boolean;
  regionKind?: RegionKind;
  subareas?: SubArea[];
  image: string;
  listCount: number;
  description: string;
  affiliateLinks?: {
    cityLeftPanelStayUrl?: string;
  };
  popularFoodCuisines?: string[];
  categoryInsights?: DestinationCategoryInsight[];
  categoryNeighborhoodStrengths?: DestinationCategoryNeighborhoodStrength[];
}

export interface Country {
  id: string;
  name: string;
  continent: string;
  description: string;
  image?: string;
  cities: City[];
  subareas?: SubArea[];
  states?: CountryState[];
  bounds: [[number, number], [number, number]];
}

export interface Continent {
  id: string;
  name: string;
  countries: Country[];
  subareas?: SubArea[];
  coordinates: [number, number];
  bounds: [[number, number], [number, number]];
  backgroundGradient: string;
}

export interface SelectionState {
  continentId?: string;
  continentSubareaId?: string;
  countryId?: string;
  countrySubareaId?: string;
  stateId?: string;
  cityId?: string;
  subareaId?: string;
  nestedSubareaId?: string;
}
