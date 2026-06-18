import type { ListCategory } from "@/types";

export type SeoPriorityPlacement = "home" | "country" | "city" | "category";

export type SeoPriorityLink = {
  id: string;
  label: string;
  href: string;
  city: string;
  country: string;
  category: ListCategory;
  neighborhood?: string;
  queries: string[];
  priority: number;
  revenueRelevant: boolean;
  placements: SeoPriorityPlacement[];
};

export const SEO_PRIORITY_LINKS = [
  {
    id: "barcelona-hostels",
    label: "Best hostels in Barcelona",
    href: "/city/barcelona/stay/best-hostels",
    city: "Barcelona",
    country: "Spain",
    category: "Stay",
    queries: ["hostels in barcelona", "barcelona hostels"],
    priority: 100,
    revenueRelevant: true,
    placements: ["home", "country", "city", "category"],
  },
  {
    id: "madrid-hotels",
    label: "Best hotels in Madrid",
    href: "/city/madrid/stay/best-hotels",
    city: "Madrid",
    country: "Spain",
    category: "Stay",
    queries: ["madrid hotels", "best hotels in madrid"],
    priority: 95,
    revenueRelevant: true,
    placements: ["home", "country", "city", "category"],
  },
  {
    id: "paris-7th-district-hotels",
    label: "Best hotels in Paris 7th district",
    href: "/city/paris/7th-arrondissement/stay/best-hotels",
    city: "Paris",
    country: "France",
    category: "Stay",
    neighborhood: "7th Arrondissement",
    queries: ["paris 7th district hotels", "hotels in paris 7th district", "7th arrondissement hotels"],
    priority: 92,
    revenueRelevant: true,
    placements: ["home", "country", "city", "category"],
  },
  {
    id: "paris-1st-district-restaurants",
    label: "Restaurants in Paris 1st district",
    href: "/city/paris/1st-arrondissement/food/best-restaurants",
    city: "Paris",
    country: "France",
    category: "Food",
    neighborhood: "1st Arrondissement",
    queries: ["paris 1st district restaurants", "restaurants in paris 1st district", "1st arrondissement restaurants"],
    priority: 88,
    revenueRelevant: false,
    placements: ["home", "country", "city", "category"],
  },
  {
    id: "paris-1st-district-things-to-do",
    label: "Things to do in Paris 1st district",
    href: "/city/paris/1st-arrondissement/culture/best-culture",
    city: "Paris",
    country: "France",
    category: "Culture",
    neighborhood: "1st Arrondissement",
    queries: ["things to do in paris 1st district", "paris 1st district attractions", "1st arrondissement things to do"],
    priority: 82,
    revenueRelevant: false,
    placements: ["home", "country", "city", "category"],
  },
  {
    id: "london-shoreditch-restaurants",
    label: "Best restaurants in Shoreditch",
    href: "/city/london/shoreditch/food/best-restaurants",
    city: "London",
    country: "United Kingdom",
    category: "Food",
    neighborhood: "Shoreditch",
    queries: ["best restaurant shoreditch", "shoreditch restaurants"],
    priority: 90,
    revenueRelevant: false,
    placements: ["home", "country", "city", "category"],
  },
  {
    id: "london-fine-dining",
    label: "Fine dining in London",
    href: "/city/london/food/best-fine-dining",
    city: "London",
    country: "United Kingdom",
    category: "Food",
    queries: ["fine dining london", "best fine dining london"],
    priority: 85,
    revenueRelevant: false,
    placements: ["home", "country", "city", "category"],
  },
  {
    id: "london-covent-garden-restaurants",
    label: "Best restaurants in Covent Garden",
    href: "/city/london/covent-garden/food/best-restaurants",
    city: "London",
    country: "United Kingdom",
    category: "Food",
    neighborhood: "Covent Garden",
    queries: ["best restaurant covent garden", "covent garden restaurants"],
    priority: 80,
    revenueRelevant: false,
    placements: ["home", "country", "city", "category"],
  },
  {
    id: "london-marylebone-restaurants",
    label: "Marylebone restaurants",
    href: "/city/london/marylebone/food/best-restaurants",
    city: "London",
    country: "United Kingdom",
    category: "Food",
    neighborhood: "Marylebone",
    queries: ["marylebone restaurants", "best restaurants marylebone"],
    priority: 75,
    revenueRelevant: false,
    placements: ["home", "country", "city", "category"],
  },
  {
    id: "london-soho-hostels",
    label: "Hostels in and near Soho",
    href: "/city/london/soho/stay/best-hostels",
    city: "London",
    country: "United Kingdom",
    category: "Stay",
    neighborhood: "Soho",
    queries: ["hostels in soho", "soho hostels"],
    priority: 70,
    revenueRelevant: true,
    placements: ["home", "country", "city", "category"],
  },
] as const satisfies ReadonlyArray<SeoPriorityLink>;

function byPriority(left: SeoPriorityLink, right: SeoPriorityLink) {
  return right.priority - left.priority || left.label.localeCompare(right.label);
}

export function getSeoPriorityLinksForPlacement(placement: SeoPriorityPlacement) {
  return SEO_PRIORITY_LINKS.filter((link) => link.placements.includes(placement)).slice().sort(byPriority);
}

export function getSeoPriorityLinksForCity(city: string, placement?: SeoPriorityPlacement) {
  return SEO_PRIORITY_LINKS.filter(
    (link) => link.city === city && (!placement || link.placements.includes(placement)),
  )
    .slice()
    .sort(byPriority);
}

export function getSeoPriorityLinksForCountry(country: string, placement?: SeoPriorityPlacement) {
  return SEO_PRIORITY_LINKS.filter(
    (link) => link.country === country && (!placement || link.placements.includes(placement)),
  )
    .slice()
    .sort(byPriority);
}

export function getSeoPriorityLinksForCategory(category: ListCategory, placement?: SeoPriorityPlacement) {
  return SEO_PRIORITY_LINKS.filter(
    (link) => link.category === category && (!placement || link.placements.includes(placement)),
  )
    .slice()
    .sort(byPriority);
}
