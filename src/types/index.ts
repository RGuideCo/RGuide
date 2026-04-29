export type ListCategory =
  | "Food"
  | "Nightlife"
  | "Nature"
  | "Culture"
  | "Stay"
  | "Activities";

export type SubmissionType = "guide" | "journal";

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
  url: string;
  category: ListCategory;
  submissionType?: SubmissionType;
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
  name: string;
  coordinates: [number, number];
  description: string;
  price?: "$" | "$$" | "$$$";
  priceSource?: string;
  places?: GuideStop[];
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
