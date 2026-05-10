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

export type FoodServiceType = "restaurant" | "cafe" | "fast_food" | "stall" | "food_truck" | "food_cart";

export type PriceTier = "$" | "$$" | "$$$" | "$$$$";

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
  | "splurge_food";

export type RegionKind = "north" | "south" | "east" | "west" | "central";

export interface User {
  id: string;
  name: string;
  email?: string;
  joinedAt?: string;
  avatar: string;
  bio: string;
}

export interface LocationRef {
  city?: string;
  neighborhood?: string;
  country: string;
  continent: string;
  scope: "continent" | "country" | "city";
}

export interface MapList {
  id: string;
  slug: string;
  seoSlug?: string;
  seoTitle?: string;
  seoDescription?: string;
  title: string;
  description: string;
  highlights?: string[];
  photo?: string;
  url: string;
  category: ListCategory;
  submissionType?: SubmissionType;
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
  name: string;
  coordinates: [number, number];
  description: string;
  category?: ListCategory;
  photo?: string;
  price?: "$" | "$$" | "$$$";
  priceSource?: string;
  bookingUrl?: string;
  officialUrl?: string;
  eventTime?: string;
  eventVenue?: string;
  places?: GuideStop[];
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

export interface SubArea {
  id: string;
  name: string;
  coordinates: [number, number];
  description?: string;
  subareas?: SubArea[];
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
}

export interface Country {
  id: string;
  name: string;
  continent: string;
  description: string;
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
