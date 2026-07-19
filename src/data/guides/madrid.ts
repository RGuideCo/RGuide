import type { GuideStop, ListSource, MapList } from "@/types";
import {
  createDerivedEditorialGuide,
  createResearchedEditorialStop,
  createVenueVariantFromGuideStop,
} from "@/lib/derived-editorial-guide";

const madridNeighborhoodGuideSeeds = [
  {
    "id": "list-madrid-sol-centro-restaurants",
    "slug": "madrid-sol-centro-restaurants",
    "seoSlug": "best-restaurants",
    "seoTitle": "Best Restaurants in Sol and Centro, Madrid",
    "seoDescription": "Best restaurants in Sol and Centro, Madrid, for historic dining rooms, tapas counters, market halls, churros, and central old-Madrid meals.",
    "title": "Kilometer-Zero Classics and Counters",
    "description": "Sol and Centro restaurants that resist the old-center tourist-trap pattern through serious cooking, historic character, specialist counters, and dependable service.",
    "url": "https://www.google.com/maps/search/sol+centro+madrid+restaurants",
    "category": "Food",
    "location": {
      "city": "Madrid",
      "neighborhood": "Sol & Centro",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-food",
      "name": "R Food",
      "avatar": "data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20"
    },
    "upvotes": 0,
    "createdAt": "2026-05-06T00:00:00.000Z",
    "stops": [
      {
        "id": "sol-food-lhardy",
        "name": "Lhardy",
        "coordinates": [
          40.4172,
          -3.7003
        ],
        "description": "Lhardy is a historic Sol institution for cocido, croquetas, consomme, and polished old-Madrid dining-room ceremony. Its ground-floor bakery and takeaway counter add a second, less formal way to experience the house.",
        "price": "$$",
        "priceSource": "The Infatuation / Google Maps",
        "hours": {
          "mon": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "tue": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "wed": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "thu": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "fri": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sat": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sun": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM"
        },
        "photo": "https://lhardy.com/wp-content/uploads/Lhardy-Primera-20.jpg"
      },
      {
        "id": "sol-food-casa-labra",
        "name": "Casa Labra",
        "coordinates": [
          40.4172,
          -3.7044
        ],
        "description": "Casa Labra serves salt-cod fritters, croquettes, and beer with quick standing-room service near Puerta del Sol. The narrow menu and old tavern rhythm are the point.",
        "price": "$",
        "priceSource": "Time Out / Google Maps",
        "hours": {
          "mon": "12:00 PM-11:00 PM",
          "tue": "12:00 PM-11:00 PM",
          "wed": "12:00 PM-11:00 PM",
          "thu": "12:00 PM-11:30 PM",
          "fri": "12:00 PM-12:00 AM",
          "sat": "12:00 PM-12:00 AM",
          "sun": "12:00 PM-10:30 PM"
        },
        "photo": "http://www.casalabra.es/wp-content/uploads/2013/06/el-bar.jpg"
      },
      {
        "id": "sol-food-mercado-san-miguel",
        "name": "Mercado de San Miguel",
        "coordinates": [
          40.4154,
          -3.7091
        ],
        "description": "Mercado de San Miguel has moved from a century-old wholesale market into one of Madrid's flagship gastronomic halls. Its polished counters let groups graze across Spanish flavors near Plaza Mayor, though the busy room is no substitute for a quiet sit-down meal.",
        "price": "$",
        "priceSource": "Time Out / Google Maps",
        "hours": {
          "mon": "12:00 PM-12:00 AM",
          "tue": "12:00 PM-12:00 AM",
          "wed": "12:00 PM-12:00 AM",
          "thu": "12:00 PM-12:00 AM",
          "fri": "12:00 PM-1:00 AM",
          "sat": "12:00 PM-1:00 AM",
          "sun": "12:00 PM-12:00 AM"
        },
        "photo": "https://live.staticflickr.com/3542/3668195177_a0390718b5_b.jpg"
      },
      {
        "id": "sol-food-san-gines",
        "name": "Chocolatería San Ginés",
        "coordinates": [
          40.4168,
          -3.7068
        ],
        "description": "Chocolatería San Ginés is the central churros-and-chocolate classic tucked off the passage near Plaza Mayor and Sol.",
        "price": "$",
        "priceSource": "Google Maps / Tripadvisor",
        "hours": {
          "mon": "12:00 PM-12:00 AM",
          "tue": "12:00 PM-12:00 AM",
          "wed": "12:00 PM-12:00 AM",
          "thu": "12:00 PM-12:00 AM",
          "fri": "12:00 PM-1:00 AM",
          "sat": "12:00 PM-1:00 AM",
          "sun": "12:00 PM-12:00 AM"
        },
        "photo": "https://estaticos.esmadrid.com/cdn/farfuture/sGn19FpiOybb7I5KRcKLKJ9pIvO7LT-EfrDeShGkX8E/mtime:1646729406/sites/default/files/styles/content_type_full/public/editorial/dondeir/noche/entradaplazuela_y_arco_san_gines.jpg?itok=cHqpFYyq"
      }
    ],
    "sources": [
      {
        "name": "The Infatuation - Best Restaurants in Madrid",
        "url": "https://www.theinfatuation.com/madrid/guides/best-madrid-restaurants"
      },
      {
        "name": "The Infatuation - Best Tapas Spots in Madrid",
        "url": "https://www.theinfatuation.com/madrid/guides/best-tapas-spots-madrid"
      },
      {
        "name": "MICHELIN Guide - Madrid restaurants",
        "url": "https://guide.michelin.com/us/en/comunidad-de-madrid/madrid/restaurants"
      },
      {
        "name": "Time Out Madrid - Restaurants",
        "url": "https://www.timeout.es/madrid/es/restaurantes"
      },
      {
        "name": "Google Maps",
        "url": "https://maps.google.com"
      }
    ]
  },
  {
    "id": "list-madrid-sol-centro-popular-bars",
    "slug": "madrid-sol-centro-popular-bars",
    "seoSlug": "best-bars",
    "seoTitle": "Best Bars in Sol and Centro, Madrid",
    "seoDescription": "Best bars in Sol and Centro, Madrid, covering historic taverns, central cocktail rooms, rooftop drinks, and late-night institutions.",
    "title": "Central Drinks With a Reason",
    "description": "Across Sol and Gran Via, a night out can mean a 19th-century tavern, a rooftop above the old center, a singalong piano room, or a serious cocktail bar. Choose by format: the tavern starts early with cod and beer, while the piano bar is built for a late, participatory crowd.",
    "url": "https://www.google.com/maps/search/sol+centro+madrid+bars",
    "category": "Nightlife",
    "location": {
      "city": "Madrid",
      "neighborhood": "Sol & Centro",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-nightlife",
      "name": "R Nightlife",
      "avatar": "data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20"
    },
    "upvotes": 0,
    "createdAt": "2026-05-06T00:00:00.000Z",
    "stops": [
      {
        "id": "sol-nightlife-casa-labra",
        "name": "Casa Labra",
        "coordinates": [
          40.4172,
          -3.7044
        ],
        "description": "Casa Labra is a centenary tavern near Puerta del Sol, famous for cod and cod croquettes served in a room that still feels close to its 19th-century bar roots.",
        "hours": {
          "mon": "12:00 PM-11:00 PM",
          "tue": "12:00 PM-11:00 PM",
          "wed": "12:00 PM-11:00 PM",
          "thu": "12:00 PM-11:30 PM",
          "fri": "12:00 PM-12:00 AM",
          "sat": "12:00 PM-12:00 AM",
          "sun": "12:00 PM-10:30 PM"
        },
        "photo": "http://www.casalabra.es/wp-content/uploads/2013/06/el-bar.jpg"
      },
      {
        "id": "sol-nightlife-edition-roof",
        "name": "The Madrid EDITION Roof",
        "coordinates": [
          40.4171,
          -3.7062
        ],
        "description": "The Madrid EDITION Roof means Oroya's terrace above Plaza de Celenque, with Peruvian-leaning drinks, greenery, and rooftop views over the old center.",
        "hours": {
          "mon": "6:00 PM-12:30 AM",
          "tue": "6:00 PM-12:30 AM",
          "wed": "6:00 PM-1:00 AM",
          "thu": "6:00 PM-1:30 AM",
          "fri": "6:00 PM-2:30 AM",
          "sat": "6:00 PM-2:30 AM",
          "sun": "6:00 PM-12:00 AM"
        },
        "photo": "https://www.oroyamadrid.com/en/resourcefiles/homeimages/oroya-terrace.jpg"
      },
      {
        "id": "sol-nightlife-toni2",
        "name": "Toni 2 Piano Bar",
        "coordinates": [
          40.421,
          -3.6976
        ],
        "description": "Toni 2 Piano Bar is the Gran Via singalong institution where the room, piano, and crowd participation matter more than cocktail seriousness.",
        "hours": {
          "mon": "10:00 PM-2:30 AM",
          "tue": "10:00 PM-2:30 AM",
          "wed": "10:00 PM-3:30 AM",
          "thu": "10:00 PM-4:30 AM",
          "fri": "10:00 PM-5:00 AM",
          "sat": "10:00 PM-5:00 AM",
          "sun": "10:00 PM-2:30 AM"
        },
        "photo": "https://toni2.es/wp-content/uploads/2021/09/Barra-Toni-2-madrid-scaled-e1636977700852-2048x1295.jpeg"
      },
      {
        "id": "sol-nightlife-josealfredo",
        "name": "Josealfredo",
        "coordinates": [
          40.4214,
          -3.7028
        ],
        "description": "Josealfredo is the central cocktail room for a quieter, more deliberate drink around Gran Via and Malasana.",
        "hours": {
          "mon": "6:00 PM-12:30 AM",
          "tue": "6:00 PM-12:30 AM",
          "wed": "6:00 PM-1:00 AM",
          "thu": "6:00 PM-1:30 AM",
          "fri": "6:00 PM-2:30 AM",
          "sat": "6:00 PM-2:30 AM",
          "sun": "6:00 PM-12:00 AM"
        },
        "photo": "https://www.josealfredobar.com/img/copa011.jpg"
      }
    ],
    "sources": [
      {
        "name": "Condé Nast Traveler - Best Bars in Madrid",
        "url": "https://www.cntraveler.com/gallery/best-bars-in-madrid"
      },
      {
        "name": "World's 50 Best Bars - Salmon Guru",
        "url": "https://www.theworlds50best.com/bars/the-list/salmon-guru.html"
      },
      {
        "name": "World's 50 Best Discovery - Angelita",
        "url": "https://www.theworlds50best.com/discovery/Establishments/Spain/Madrid/Angelita.html"
      },
      {
        "name": "Time Out Madrid - Bars and pubs",
        "url": "https://www.timeout.es/madrid/es/bares-y-pubs"
      },
      {
        "name": "Mondo Disko official",
        "url": "https://www.mondodisko.es/en/mondo-disko/"
      },
      {
        "name": "Google Maps",
        "url": "https://maps.google.com"
      }
    ]
  },
  {
    "id": "list-madrid-sol-centro-stays",
    "slug": "madrid-sol-centro-hotels",
    "seoSlug": "best-hotels",
    "seoTitle": "Best Hotels in Sol and Centro, Madrid",
    "seoDescription": "Best hotels in Sol and Centro, Madrid, for Canalejas luxury, Plaza Mayor atmosphere, Gran Via access, rooftops, and old-city walks.",
    "title": "Hotels at Kilometer Zero",
    "description": "Hotels around Sol trade immediate old-city access for noise, ranging from polished luxury and Plaza Mayor views to more independent rooms toward Gran Via and Malasana.",
    "url": "https://www.google.com/maps/search/sol+centro+madrid+hotels",
    "category": "Stay",
    "location": {
      "city": "Madrid",
      "neighborhood": "Sol & Centro",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-stay",
      "name": "R Stay",
      "avatar": "data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20"
    },
    "upvotes": 0,
    "createdAt": "2026-05-06T00:00:00.000Z",
    "stops": [
      {
        "id": "stay-four-seasons",
        "name": "Four Seasons Hotel Madrid",
        "coordinates": [
          40.4172,
          -3.7015
        ],
        "description": "Four Seasons Hotel Madrid brings high-touch service, destination dining, a spa, and quiet rooms to the Canalejas complex. Sol, Plaza Mayor, and Gran Via remain immediately accessible despite the property's retreat-like polish.",
        "price": "$$",
        "priceSource": "Condé Nast Traveler / Google Maps",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://www.fourseasons.com/alt/img-opt/~80.1860.0,4983-553,1924-2999,5017-1687,2197/publish/content/dam/fourseasons/images/web/MMD/MMD_306_original.jpg"
      },
      {
        "id": "stay-edition",
        "name": "The Madrid EDITION",
        "coordinates": [
          40.4171,
          -3.7062
        ],
        "description": "The Madrid EDITION is the contemporary Sol/Centro hotel when Plaza Mayor access should come with rooftop polish and a sharper design mood. It fits travelers who want the old city close but still expect a full-service, social hotel reset.",
        "price": "$$",
        "priceSource": "Condé Nast Traveler / Google Maps",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://www.editionhotels.com/wp-content/uploads/2026/03/EDT_Madrid2_23-_RGB_V1-2-scaled.jpg"
      },
      {
        "id": "stay-pestana-plaza-mayor",
        "name": "Pestana Plaza Mayor Madrid",
        "coordinates": [
          40.415,
          -3.7074
        ],
        "description": "Pestana Plaza Mayor pairs a historic-square address with contemporary rooms and spa facilities. The comforts inside offset some of the tourist churn directly outside.",
        "price": "$$",
        "priceSource": "Tourism Madrid / Pestana",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://www.pestana.com/content/dam/pestana/en_us/destinations/spain/madrid/pestana-plaza-mayor/gallery/overview/pestana-plaza-mayor-gallery-surroundings-cafe-terrace.jpg"
      },
      {
        "id": "stay-seven-islas",
        "name": "7 Islas Hotel",
        "coordinates": [
          40.4217,
          -3.7012
        ],
        "description": "7 Islas Hotel gives Sol/Centro travelers a Valverde base that leans toward Gran Via and Malasana rather than Plaza Mayor formality.",
        "price": "$",
        "priceSource": "7 Islas official / Google Maps",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://www.7islashotel.com/wp-content/uploads/2026/01/7-islas-hotel-verano-2025-c-mariana-borau-87-copia-scaled.jpg"
      }
    ],
    "sources": [
      {
        "name": "Tourism Madrid - MICHELIN Key Hotels",
        "url": "https://www.esmadrid.com/en/michelin-key-hotels"
      },
      {
        "name": "Condé Nast Traveler - Madrid hotels",
        "url": "https://www.cntraveler.com/hotels/madrid"
      },
      {
        "name": "MICHELIN Guide - Only YOU Boutique Hotel Madrid",
        "url": "https://guide.michelin.com/us/en/hotels-stays/madrid/only-you-boutique-hotel-madrid-8366"
      },
      {
        "name": "Mandarin Oriental Ritz Madrid official",
        "url": "https://www.mandarinoriental.com/en/madrid"
      },
      {
        "name": "Tourism Madrid - Pestana Plaza Mayor",
        "url": "https://www.esmadrid.com/en/accommodation/pestana-plaza-mayor"
      },
      {
        "name": "Google Maps",
        "url": "https://maps.google.com"
      }
    ]
  },
  {
    "id": "list-madrid-sol-centro-hostels",
    "slug": "madrid-sol-centro-hostels",
    "seoSlug": "best-hostels",
    "seoTitle": "Best Hostels in Sol and Centro, Madrid",
    "seoDescription": "Best hostels in Sol and Centro, Madrid, for social dorms, private-room flexibility, Plaza Mayor access, Tirso de Molina, and first-trip logistics.",
    "title": "Central Hostels With a Social Spine",
    "description": "Central Madrid hostels keep the old city immediate through social dorms, private rooms, rooftop common spaces, and addresses between Sol, Tirso de Molina, and Plaza Mayor.",
    "url": "https://www.google.com/maps/search/sol+centro+madrid+hostels",
    "category": "Stay",
    "location": {
      "city": "Madrid",
      "neighborhood": "Sol & Centro",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-stay",
      "name": "R Stay",
      "avatar": "data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20"
    },
    "upvotes": 0,
    "createdAt": "2026-05-06T00:00:00.000Z",
    "stops": [
      {
        "id": "stay-the-hat",
        "name": "The Hat Madrid",
        "coordinates": [
          40.4145,
          -3.7073
        ],
        "description": "The Hat Madrid places dorms, private rooms, active common spaces, and a rooftop beside Plaza Mayor. Social programming gives solo guests an easy way into the city, while Sol and La Latina remain within a short walk.",
        "price": "$",
        "priceSource": "Hostelworld / The Hat official",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://thehatmadrid.com/wp-content/uploads/slider/cache/cb3097b9f7bb39d19fd625c1017d58d6/1.the_hat-88-1.webp"
      },
      {
        "id": "stay-onefam-sungate",
        "name": "Onefam Sungate",
        "coordinates": [
          40.4183,
          -3.7044
        ],
        "description": "Onefam Sungate is a social Sol hostel with nightly activities and immediate central access. The programming makes it easy to meet people quickly, while the atmosphere favors sociability over the quietest possible room.",
        "price": "$",
        "priceSource": "Hostelworld / Google Maps",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://a.hwstatic.com/image/upload/f_auto,q_auto,w_1024,c_limit,e_sharpen,e_improve,e_vibrance:60/propertyimages/9/90911/izvgkywwbwo424w3hvc5.jpg"
      },
      {
        "id": "stay-2060-newton",
        "name": "2060 The Newton Hostel",
        "coordinates": [
          40.412,
          -3.7048
        ],
        "description": "2060 The Newton Hostel is the Tirso de Molina base to use when Sol and Plaza Mayor need to stay walkable without sleeping directly on the busiest square. The rooftop-bar setup and common areas make it better for a social center-city rhythm than for anyone chasing quiet boutique lodging.",
        "price": "$",
        "priceSource": "Hostelworld / Google Maps",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://2060hostelandmarket.com/wp-content/uploads/2023/09/las-mejores-vistas-madrid-hostel-4.jpg.webp"
      },
      {
        "id": "stay-ok-hostel",
        "name": "Ok Hostel Madrid",
        "coordinates": [
          40.4113,
          -3.708
        ],
        "description": "Ok Hostel Madrid gives Sol and Centro travelers a practical base just below Plaza Mayor, with both dorms and private rooms available.",
        "price": "$",
        "priceSource": "Hostelworld / Google Maps",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://a.hwstatic.com/image/upload/f_auto,q_auto,h_720,c_limit,e_sharpen,e_improve,e_vibrance:60/propertyimages/9/94332/nibn7kmmmvkunz0dsq6i.jpg"
      }
    ],
    "sources": [
      {
        "name": "Hostelworld - Madrid Hostels",
        "url": "https://www.hostelworld.com/hostels/europe/spain/madrid/"
      },
      {
        "name": "The Hat Madrid official",
        "url": "https://www.thehatmadrid.com/en/"
      },
      {
        "name": "Latroupe Prado official",
        "url": "https://www.latroupe.com/en/latroupe-prado/hostel/"
      },
      {
        "name": "Hostelworld - Onefam Madrid",
        "url": "https://www.hostelworld.com/hostels/p/286369/onefam-madrid/"
      },
      {
        "name": "Hostelworld - 2060 The Newton Hostel",
        "url": "https://www.hostelworld.com/hostels/p/282289/2060-the-newton-hostel/"
      },
      {
        "name": "Hostelworld - room00 Chueca Hostel",
        "url": "https://www.hostelworld.com/st/hotels/p/83795/room007-chueca-hostel/"
      },
      {
        "name": "Google Maps",
        "url": "https://maps.google.com"
      }
    ]
  },
  {
    "id": "list-madrid-sol-centro-culture",
    "slug": "madrid-sol-centro-culture",
    "seoSlug": "best-culture",
    "seoTitle": "Best Culture in Sol and Centro, Madrid",
    "seoDescription": "Best culture in Sol and Centro, Madrid, from Puerta del Sol and Plaza Mayor to the Royal Palace, Almudena, and old-city streets.",
    "title": "Royal Madrid and Kilometer Zero",
    "description": "This is Madrid at its most public and ceremonial, where the city explains itself in stone, crowds, and royal scale.",
    "url": "https://www.google.com/maps/search/sol+centro+madrid+culture",
    "category": "Culture",
    "location": {
      "city": "Madrid",
      "neighborhood": "Sol & Centro",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-culture",
      "name": "R Culture",
      "avatar": "data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20"
    },
    "upvotes": 0,
    "createdAt": "2026-05-06T00:00:00.000Z",
    "stops": [
      {
        "id": "sol-culture-puerta-del-sol",
        "name": "Puerta del Sol",
        "coordinates": [
          40.4169,
          -3.7036
        ],
        "description": "Puerta del Sol is one of Madrid's iconic and busiest public squares, marked by Kilometer Zero, the clock tower of the Real Casa de Correos, and constant movement between shopping streets, metro entrances, and civic rituals. It gives the old center its public pulse.",
        "hours": {
          "mon": "Open public space",
          "tue": "Open public space",
          "wed": "Open public space",
          "thu": "Open public space",
          "fri": "Open public space",
          "sat": "Open public space",
          "sun": "Open public space"
        },
        "photo": "https://satguruexperiences.com/wp-content/uploads/2024/09/Curiosidades-de-la-Puerta-del-Sol.webp"
      },
      {
        "id": "sol-culture-plaza-mayor",
        "name": "Plaza Mayor",
        "coordinates": [
          40.4155,
          -3.7074
        ],
        "description": "Plaza Mayor is the grand arcaded square of Habsburg Madrid, built for ceremonies, markets, bullfights, and public gatherings. Today its uniform facades, frescoed Casa de la Panaderia, and stone portals make it one of the clearest architectural statements in the historic center.",
        "hours": {
          "mon": "Open public space",
          "tue": "Open public space",
          "wed": "Open public space",
          "thu": "Open public space",
          "fri": "Open public space",
          "sat": "Open public space",
          "sun": "Open public space"
        },
        "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Plaza_Mayor_de_Madrid_02.jpg/1920px-Plaza_Mayor_de_Madrid_02.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail&_=20101226073741"
      },
      {
        "id": "sol-culture-royal-palace",
        "name": "Royal Palace of Madrid",
        "coordinates": [
          40.4179,
          -3.7143
        ],
        "description": "The Royal Palace of Madrid is the largest palace in Western Europe, with more than 135,000 square meters and 3,418 rooms tied to centuries of Spanish monarchy. The visit is about ceremonial scale: grand staircases, throne rooms, royal collections, armory displays, and the formal plaza setting beside Almudena.",
        "hours": {
          "mon": "9:00 AM-8:00 PM",
          "tue": "9:00 AM-8:00 PM",
          "wed": "9:00 AM-8:00 PM",
          "thu": "9:00 AM-8:00 PM",
          "fri": "9:00 AM-8:00 PM",
          "sat": "9:00 AM-8:00 PM",
          "sun": "9:00 AM-8:00 PM"
        },
        "photo": "https://upload.wikimedia.org/wikipedia/commons/9/9b/Palacio_Real_de_Madrid_Julio_2016_%28cropped%29.jpg"
      },
      {
        "id": "sol-culture-almudena",
        "name": "Almudena Cathedral",
        "coordinates": [
          40.4156,
          -3.7146
        ],
        "description": "Almudena Cathedral stands opposite the Royal Palace with a mix of neoclassical exterior, Neo-Gothic interior, and a brightly painted contemporary ceiling. The best cultural visits include the cathedral museum, dome views, and the crypt below, which turns the palace area into a fuller religious and royal-history stop.",
        "hours": {
          "mon": "9:00 AM-8:00 PM",
          "tue": "9:00 AM-8:00 PM",
          "wed": "9:00 AM-8:00 PM",
          "thu": "9:00 AM-8:00 PM",
          "fri": "9:00 AM-8:00 PM",
          "sat": "9:00 AM-8:00 PM",
          "sun": "9:00 AM-8:00 PM"
        },
        "photo": "https://cdn.getyourguide.com/image/format=auto,fit=crop,gravity=auto,quality=60,width=400,height=265,dpr=2/tour_img/59a772c4d649cac3.jpeg"
      }
    ],
    "sources": [
      {
        "name": "Tourism Madrid",
        "url": "https://www.esmadrid.com/en"
      },
      {
        "name": "Tourism Madrid - Prado Museum",
        "url": "https://www.esmadrid.com/en/tourist-information/museo-del-prado"
      },
      {
        "name": "Tourism Madrid - Reina Sofia Museum",
        "url": "https://www.esmadrid.com/en/tourist-information/reina-sofia-museum"
      },
      {
        "name": "Museo Nacional del Prado - Opening Times",
        "url": "https://www.museodelprado.es/en/visit/opening-times-and-prices"
      },
      {
        "name": "Google Maps",
        "url": "https://maps.google.com"
      }
    ]
  },
  {
    "id": "list-madrid-letras-restaurants",
    "slug": "madrid-barrio-de-las-letras-restaurants",
    "seoSlug": "best-restaurants",
    "seoTitle": "Best Restaurants in Barrio de las Letras, Madrid",
    "seoDescription": "Best restaurants in Barrio de las Letras, Madrid, for pre-theater dinners, tapas, taverns, modern Spanish rooms, and Art Walk meals.",
    "title": "Pre-Theater Tables and Literary Taverns",
    "description": "In Barrio de las Letras, restaurants serve museum visitors and theater crowds without relying on the generic tapas menus around Huertas. Compact modern rooms suit a booked dinner, while historic taverns are better for vermouth and traditional plates before a performance.",
    "url": "https://www.google.com/maps/search/barrio+de+las+letras+madrid+restaurants",
    "category": "Food",
    "location": {
      "city": "Madrid",
      "neighborhood": "Barrio de las Letras",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-food",
      "name": "R Food",
      "avatar": "data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20"
    },
    "upvotes": 0,
    "createdAt": "2026-05-06T00:00:00.000Z",
    "stops": [
      {
        "id": "letras-food-la-malontina",
        "name": "La Malontina",
        "coordinates": [
          40.4144,
          -3.6981
        ],
        "description": "A compact Cortes dinner for modern Spanish plates, first dates, and pre-theater plans that need more care than a tourist tapas crawl.",
        "price": "$",
        "priceSource": "The Infatuation / Google Maps",
        "hours": {
          "mon": "Closed",
          "tue": "7:00 PM-10:30 PM",
          "wed": "7:00 PM-10:30 PM",
          "thu": "7:00 PM-10:30 PM",
          "fri": "7:00 PM-10:30 PM",
          "sat": "7:00 PM-10:30 PM",
          "sun": "Closed"
        },
        "photo": "https://images.squarespace-cdn.com/content/v1/5f8c4ebce7e6c83bd00bdac4/1738692480370-VCSG7Q1DPJ0X4VOI7X1F/Almeja+rubia+gallega+a+la+marinera+2.jpg?format=1000w"
      },
      {
        "id": "letras-food-casa-alberto",
        "name": "Casa Alberto",
        "coordinates": [
          40.4136,
          -3.7003
        ],
        "description": "Casa Alberto is a historic Huertas tavern for vermouth, traditional plates, red-painted woodwork, and the old literary-quarter atmosphere in a compact local room.",
        "price": "$",
        "priceSource": "Time Out / Google Maps",
        "hours": {
          "mon": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "tue": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "wed": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "thu": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "fri": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sat": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sun": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM"
        },
        "photo": "https://www.casaalberto.es/data/ficheros/N000001/2025/07/3_4gj3qlxcw7_LIBRILLO.jpg"
      },
      {
        "id": "letras-food-triciclo",
        "name": "TriCiclo",
        "coordinates": [
          40.4133,
          -3.6994
        ],
        "description": "A polished neighborhood restaurant for shared modern Spanish plates near the Art Walk and Plaza Santa Ana.",
        "price": "$",
        "priceSource": "MICHELIN Guide / Google Maps",
        "hours": {
          "mon": "Closed",
          "tue": "1:00 PM-3:30 PM, 8:00 PM-11:00 PM",
          "wed": "1:00 PM-3:30 PM, 8:00 PM-11:00 PM",
          "thu": "1:00 PM-3:30 PM, 8:00 PM-11:00 PM",
          "fri": "1:00 PM-3:30 PM, 8:00 PM-11:30 PM",
          "sat": "1:00 PM-3:30 PM, 8:00 PM-11:30 PM",
          "sun": "Closed"
        },
        "photo": "https://static.wixstatic.com/media/ff3b54_3f1fb814f34f44708baafe64f6a6a58d~mv2.jpg/v1/fill/w_676,h_1646,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/ff3b54_3f1fb814f34f44708baafe64f6a6a58d~mv2.jpg"
      },
      {
        "id": "letras-food-viva-madrid",
        "name": "Viva Madrid",
        "coordinates": [
          40.4148,
          -3.7003
        ],
        "description": "Viva Madrid is a restored old tavern serving tapas and vermouth amid tilework and historic room detail near Huertas.",
        "price": "$",
        "priceSource": "Time Out / Google Maps",
        "hours": {
          "mon": "12:00 PM-12:30 AM",
          "tue": "12:00 PM-12:30 AM",
          "wed": "12:00 PM-12:30 AM",
          "thu": "12:00 PM-1:30 AM",
          "fri": "12:00 PM-2:00 AM",
          "sat": "12:00 PM-2:00 AM",
          "sun": "12:00 PM-12:00 AM"
        },
        "photo": "https://www.vivamadrid.com/uploads/1/3/6/3/136359884/img-3343_orig.jpg"
      }
    ],
    "sources": [
      {
        "name": "The Infatuation - Best Restaurants in Madrid",
        "url": "https://www.theinfatuation.com/madrid/guides/best-madrid-restaurants"
      },
      {
        "name": "The Infatuation - Best Tapas Spots in Madrid",
        "url": "https://www.theinfatuation.com/madrid/guides/best-tapas-spots-madrid"
      },
      {
        "name": "MICHELIN Guide - Madrid restaurants",
        "url": "https://guide.michelin.com/us/en/comunidad-de-madrid/madrid/restaurants"
      },
      {
        "name": "Time Out Madrid - Restaurants",
        "url": "https://www.timeout.es/madrid/es/restaurantes"
      },
      {
        "name": "Google Maps",
        "url": "https://maps.google.com"
      }
    ]
  },
  {
    "id": "list-madrid-letras-popular-bars",
    "slug": "madrid-barrio-de-las-letras-bars",
    "seoSlug": "best-bars",
    "seoTitle": "Best Bars in Barrio de las Letras, Madrid",
    "seoDescription": "Best bars in Barrio de las Letras, Madrid, including destination cocktails, sherry bars, vermouth taverns, and live music around Huertas.",
    "title": "Huertas Cocktails and Old Taverns",
    "description": "Huertas nightlife spans theatrical cocktails, austere sherry bars, tiled vermouth taverns, and live jazz. The neighborhood is busiest on foot, but its strongest rooms have a clear drink or music identity beyond the surrounding bar traffic.",
    "url": "https://www.google.com/maps/search/barrio+de+las+letras+madrid+bars",
    "category": "Nightlife",
    "location": {
      "city": "Madrid",
      "neighborhood": "Barrio de las Letras",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-nightlife",
      "name": "R Nightlife",
      "avatar": "data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20"
    },
    "upvotes": 0,
    "createdAt": "2026-05-06T00:00:00.000Z",
    "stops": [
      {
        "id": "letras-nightlife-salmon-guru",
        "name": "Salmon Guru",
        "coordinates": [
          40.4159,
          -3.6997
        ],
        "description": "Salmon Guru is Diego Cabrera's high-voltage cocktail bar, known for comic-book rooms, playful glassware, inventive drinks, and a globally recognized program. Spectacle matters as much as quiet precision here.",
        "hours": {
          "mon": "6:00 PM-12:30 AM",
          "tue": "6:00 PM-12:30 AM",
          "wed": "6:00 PM-1:00 AM",
          "thu": "6:00 PM-1:30 AM",
          "fri": "6:00 PM-2:30 AM",
          "sat": "6:00 PM-2:30 AM",
          "sun": "6:00 PM-12:00 AM"
        },
        "photo": "https://salmonguru.es/wp-content/uploads/2024/07/mad-bunny.jpg"
      },
      {
        "id": "letras-nightlife-la-venencia",
        "name": "La Venencia",
        "coordinates": [
          40.415,
          -3.6992
        ],
        "description": "La Venencia is the old sherry bar that keeps Las Letras tied to a drier, stricter Madrid drinking tradition. Go for fino, manzanilla, dusty bottles, and a room where the rules and patina are part of the experience.",
        "hours": {
          "mon": "6:00 PM-12:00 AM",
          "tue": "6:00 PM-12:00 AM",
          "wed": "6:00 PM-12:00 AM",
          "thu": "6:00 PM-12:30 AM",
          "fri": "6:00 PM-1:00 AM",
          "sat": "6:00 PM-1:00 AM",
          "sun": "6:00 PM-11:00 PM"
        },
        "photo": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/29/bf/3d/58/caption.jpg?w=1200&h=1200&s=1"
      },
      {
        "id": "letras-nightlife-viva-madrid",
        "name": "Viva Madrid",
        "coordinates": [
          40.4148,
          -3.7003
        ],
        "description": "Viva Madrid is a restored literary-quarter tavern where tilework, vermouth, cocktails, and old-room detail carry the night.",
        "hours": {
          "mon": "12:00 PM-12:30 AM",
          "tue": "12:00 PM-12:30 AM",
          "wed": "12:00 PM-12:30 AM",
          "thu": "12:00 PM-1:30 AM",
          "fri": "12:00 PM-2:00 AM",
          "sat": "12:00 PM-2:00 AM",
          "sun": "12:00 PM-12:00 AM"
        },
        "photo": "https://www.vivamadrid.com/uploads/1/3/6/3/136359884/img-3343_orig.jpg"
      },
      {
        "id": "letras-nightlife-cafe-central",
        "name": "Café Central",
        "coordinates": [
          40.4142,
          -3.7009
        ],
        "description": "Cafe Central is a Plaza Santa Ana jazz institution built around seated live performances, table service, and an audience sharing one focused room. The official program determines the musicians and set times.",
        "hours": {
          "mon": "Event schedule (check venue)",
          "tue": "Event schedule (check venue)",
          "wed": "Event schedule (check venue)",
          "thu": "Event schedule (check venue)",
          "fri": "Event schedule (check venue)",
          "sat": "Event schedule (check venue)",
          "sun": "Event schedule (check venue)"
        },
        "photo": "https://cafecentralmadrid.com/uploads/events/00-evento-20260329-173600_hu_94ba4bdc15a3c8f.webp"
      }
    ],
    "sources": [
      {
        "name": "Condé Nast Traveler - Best Bars in Madrid",
        "url": "https://www.cntraveler.com/gallery/best-bars-in-madrid"
      },
      {
        "name": "World's 50 Best Bars - Salmon Guru",
        "url": "https://www.theworlds50best.com/bars/the-list/salmon-guru.html"
      },
      {
        "name": "World's 50 Best Discovery - Angelita",
        "url": "https://www.theworlds50best.com/discovery/Establishments/Spain/Madrid/Angelita.html"
      },
      {
        "name": "Time Out Madrid - Bars and pubs",
        "url": "https://www.timeout.es/madrid/es/bares-y-pubs"
      },
      {
        "name": "Mondo Disko official",
        "url": "https://www.mondodisko.es/en/mondo-disko/"
      },
      {
        "name": "Google Maps",
        "url": "https://maps.google.com"
      }
    ]
  },
  {
    "id": "list-madrid-letras-stays",
    "slug": "madrid-barrio-de-las-letras-hotels",
    "seoSlug": "best-hotels",
    "seoTitle": "Best Hotels in Barrio de las Letras, Madrid",
    "seoDescription": "Best hotels in Barrio de las Letras, Madrid, for Art Walk access, Plaza Santa Ana, theater nights, Huertas dinners, and classic central hotels.",
    "title": "Art Walk Hotels With Nightlife Nearby",
    "description": "The best Las Letras hotels let you move between museums, Plaza Santa Ana, and late dinners without treating sleep as an afterthought.",
    "url": "https://www.google.com/maps/search/barrio+de+las+letras+madrid+hotels",
    "category": "Stay",
    "location": {
      "city": "Madrid",
      "neighborhood": "Barrio de las Letras",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-stay",
      "name": "R Stay",
      "avatar": "data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20"
    },
    "upvotes": 0,
    "createdAt": "2026-05-06T00:00:00.000Z",
    "stops": [
      {
        "id": "stay-room-mate-alba",
        "name": "Room Mate Alba",
        "coordinates": [
          40.4135,
          -3.7002
        ],
        "description": "Room Mate Alba is the Las Letras boutique hotel for Huertas, Plaza Santa Ana, and the Art Walk nearby without palace-hotel pricing. It fits museum mornings and late neighborhood dinners in a compact, practical way.",
        "price": "$",
        "priceSource": "Google Maps / hotel site",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://room-matehotels.com/data/webp/alba-roommatealba-suiteroom9669-c813f8fb45bdac0f5af1d049c81e64ee.webp"
      },
      {
        "id": "stay-me-madrid-reina-victoria",
        "name": "ME Madrid Reina Victoria",
        "coordinates": [
          40.4142,
          -3.701
        ],
        "description": "ME Madrid Reina Victoria is the Plaza Santa Ana hotel for theater, bars, and Las Letras foot traffic at the door.",
        "price": "$$",
        "priceSource": "Google Maps / hotel site",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://mereinavictoria.madridhotels360.net/data/Photos/1080x700w/17057/1705707/1705707742.JPEG"
      },
      {
        "id": "stay-westin-palace",
        "name": "The Westin Palace Madrid",
        "coordinates": [
          40.4153,
          -3.695
        ],
        "description": "The Westin Palace Madrid is the grand Las Letras-edge hotel under the landmark stained-glass La Cupula dome. It suits stays built around Prado and Thyssen access, classic service, wellness and fitness facilities, and a polished evening at the 27 Club bar.",
        "price": "$$",
        "priceSource": "Google Maps / hotel site",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://cache.marriott.com/is/image/marriotts7prod/lc-madcl-la-cupula-32193:Classic-Ver?wid=377&fit=constrain"
      },
      {
        "id": "stay-nh-collection-suecia",
        "name": "NH Collection Madrid Suecia",
        "coordinates": [
          40.417,
          -3.6969
        ],
        "description": "NH Collection Madrid Suecia is useful when Las Letras, Gran Via, Cibeles, and museum days all need to stay walkable. NH Collection Madrid Suecia fits travelers who want a central hotel with more business-polish and rooftop reach than a small neighborhood inn.",
        "price": "$",
        "priceSource": "NH Collection / Google Maps",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://img.nh-hotels.net/8zMwb/VDjD4/original/V_NH_collection_suecia_101.jpg?output-quality=80&resize=1110:*&composite-to=center,center|1110:380&background-color=white"
      }
    ],
    "sources": [
      {
        "name": "Tourism Madrid - MICHELIN Key Hotels",
        "url": "https://www.esmadrid.com/en/michelin-key-hotels"
      },
      {
        "name": "Condé Nast Traveler - Madrid hotels",
        "url": "https://www.cntraveler.com/hotels/madrid"
      },
      {
        "name": "MICHELIN Guide - Only YOU Boutique Hotel Madrid",
        "url": "https://guide.michelin.com/us/en/hotels-stays/madrid/only-you-boutique-hotel-madrid-8366"
      },
      {
        "name": "Mandarin Oriental Ritz Madrid official",
        "url": "https://www.mandarinoriental.com/en/madrid"
      },
      {
        "name": "Tourism Madrid - Pestana Plaza Mayor",
        "url": "https://www.esmadrid.com/en/accommodation/pestana-plaza-mayor"
      },
      {
        "name": "Google Maps",
        "url": "https://maps.google.com"
      }
    ]
  },
  {
    "id": "list-madrid-letras-hostels",
    "slug": "madrid-barrio-de-las-letras-hostels",
    "seoSlug": "best-hostels",
    "seoTitle": "Best Hostels near Barrio de las Letras, Madrid",
    "seoDescription": "Best hostels near Barrio de las Letras, Madrid, for Art Walk days, Atocha access, Tirso de Molina, social dorms, and budget central rooms.",
    "title": "Hostels for the Art Walk Edge",
    "description": "Hostel beds around Las Letras sit mainly on the edges near Atocha, Reina Sofia, Tirso de Molina, Plaza Mayor, and La Latina, balancing museum access against old-city social energy.",
    "url": "https://www.google.com/maps/search/barrio+de+las+letras+madrid+hostels",
    "category": "Stay",
    "location": {
      "city": "Madrid",
      "neighborhood": "Barrio de las Letras",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-stay",
      "name": "R Stay",
      "avatar": "data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20"
    },
    "upvotes": 0,
    "createdAt": "2026-05-06T00:00:00.000Z",
    "stops": [
      {
        "id": "stay-latroupe-prado",
        "name": "Latroupe Prado",
        "coordinates": [
          40.4119,
          -3.6943
        ],
        "description": "Latroupe Prado is a hostel near Atocha, Reina Sofia, and the Art Walk, with a bar, restaurant, coworking area, and common spaces. Museum and rail access outweigh immediate nightlife proximity.",
        "price": "$",
        "priceSource": "Latroupe official / Hostelworld",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://www.latroupe.com/data/webp/hotel1125742-fa85b6f4b8a42e52a10641a84db3f801.webp"
      },
      {
        "id": "stay-2060-newton",
        "name": "2060 The Newton Hostel",
        "coordinates": [
          40.412,
          -3.7048
        ],
        "description": "2060 The Newton Hostel works for Las Letras trips because Tirso de Molina keeps Huertas, Plaza Santa Ana, and the Art Walk within an easy walk.",
        "price": "$",
        "priceSource": "Hostelworld / Google Maps",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://2060hostelandmarket.com/wp-content/uploads/2023/09/las-mejores-vistas-madrid-hostel-4.jpg.webp"
      },
      {
        "id": "stay-the-hat",
        "name": "The Hat Madrid",
        "coordinates": [
          40.4145,
          -3.7073
        ],
        "description": "The Hat Madrid works from Las Letras as the more social old-city alternative to sleeping directly on Huertas.",
        "price": "$",
        "priceSource": "Hostelworld / The Hat official",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://thehatmadrid.com/wp-content/uploads/slider/cache/cb3097b9f7bb39d19fd625c1017d58d6/1.the_hat-88-1.webp"
      },
      {
        "id": "stay-ok-hostel",
        "name": "Ok Hostel Madrid",
        "coordinates": [
          40.4113,
          -3.708
        ],
        "description": "Ok Hostel Madrid can work for Las Letras for Huertas, Plaza Santa Ana, and Tirso de Molina nearby without Art Walk hotel rates. Dorms and private rooms make it flexible for solo travelers, friends, or couples who want hostel pricing while staying close to museum days and late central streets.",
        "price": "$",
        "priceSource": "Hostelworld / Google Maps",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://a.hwstatic.com/image/upload/f_auto,q_auto,h_720,c_limit,e_sharpen,e_improve,e_vibrance:60/propertyimages/9/94332/nibn7kmmmvkunz0dsq6i.jpg"
      }
    ],
    "sources": [
      {
        "name": "Hostelworld - Madrid Hostels",
        "url": "https://www.hostelworld.com/hostels/europe/spain/madrid/"
      },
      {
        "name": "The Hat Madrid official",
        "url": "https://www.thehatmadrid.com/en/"
      },
      {
        "name": "Latroupe Prado official",
        "url": "https://www.latroupe.com/en/latroupe-prado/hostel/"
      },
      {
        "name": "Hostelworld - Onefam Madrid",
        "url": "https://www.hostelworld.com/hostels/p/286369/onefam-madrid/"
      },
      {
        "name": "Hostelworld - 2060 The Newton Hostel",
        "url": "https://www.hostelworld.com/hostels/p/282289/2060-the-newton-hostel/"
      },
      {
        "name": "Hostelworld - room00 Chueca Hostel",
        "url": "https://www.hostelworld.com/st/hotels/p/83795/room007-chueca-hostel/"
      },
      {
        "name": "Google Maps",
        "url": "https://maps.google.com"
      }
    ]
  },
  {
    "id": "list-madrid-letras-culture",
    "slug": "madrid-barrio-de-las-letras-culture",
    "seoSlug": "best-culture",
    "seoTitle": "Best Culture in Barrio de las Letras, Madrid",
    "seoDescription": "Best culture in Barrio de las Letras, Madrid, from literary streets and Lope de Vega to Teatro Español, CaixaForum, and the Prado edge.",
    "title": "Golden Age Streets and Art Walk Edges",
    "description": "Golden Age domestic history, live theatre around Plaza Santa Ana, and major art institutions along the nearby museum corridor give Las Letras cultural substance beyond its literary street names.",
    "url": "https://www.google.com/maps/search/barrio+de+las+letras+madrid+culture",
    "category": "Culture",
    "location": {
      "city": "Madrid",
      "neighborhood": "Barrio de las Letras",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-culture",
      "name": "R Culture",
      "avatar": "data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20"
    },
    "upvotes": 0,
    "createdAt": "2026-05-06T00:00:00.000Z",
    "stops": [
      {
        "id": "letras-culture-lope",
        "name": "Casa Museo Lope de Vega",
        "coordinates": [
          40.4142,
          -3.6978
        ],
        "description": "Casa Museo Lope de Vega preserves the 17th-century home where the Golden Age playwright lived for the last decades of his life. The rooms, garden, study, and domestic objects turn Barrio de las Letras' literary history into an intimate house visit rather than only street names and plaques.",
        "hours": {
          "mon": "Closed",
          "tue": "10:00 AM-7:00 PM",
          "wed": "10:00 AM-7:00 PM",
          "thu": "10:00 AM-7:00 PM",
          "fri": "10:00 AM-7:00 PM",
          "sat": "10:00 AM-7:00 PM",
          "sun": "10:00 AM-7:00 PM"
        },
        "photo": "https://upload.wikimedia.org/wikipedia/commons/a/af/Casa-Museo_de_Lope_de_Vega_%28Madrid%29_01.jpg"
      },
      {
        "id": "letras-culture-teatro-espanol",
        "name": "Teatro Español",
        "coordinates": [
          40.4144,
          -3.7007
        ],
        "description": "Teatro Espanol traces its roots to the 16th-century Corral del Principe, making Plaza Santa Ana one of Madrid's oldest stages for live performance. The building connects Golden Age theater history with current drama, classics, and contemporary productions in the middle of Las Letras.",
        "hours": {
          "mon": "Event schedule (check venue)",
          "tue": "Event schedule (check venue)",
          "wed": "Event schedule (check venue)",
          "thu": "Event schedule (check venue)",
          "fri": "Event schedule (check venue)",
          "sat": "Event schedule (check venue)",
          "sun": "Event schedule (check venue)"
        },
        "photo": "https://www.teatroespanol.es/sites/default/files/monograficos/img-historia-espanol.jpg"
      },
      {
        "id": "letras-culture-prado",
        "name": "Museo Nacional del Prado",
        "coordinates": [
          40.4138,
          -3.6921
        ],
        "description": "Museo Nacional del Prado is Madrid's great classical painting museum, with Spanish, Italian, and Flemish masterpieces at its core. The experience centers on Velazquez, Goya, El Greco, Bosch, Rubens, and Titian, making it the essential stop for royal collections, religious painting, portraiture, and European art history.",
        "hours": {
          "mon": "10:00 AM-8:00 PM",
          "tue": "10:00 AM-8:00 PM",
          "wed": "10:00 AM-8:00 PM",
          "thu": "10:00 AM-8:00 PM",
          "fri": "10:00 AM-8:00 PM",
          "sat": "10:00 AM-8:00 PM",
          "sun": "10:00 AM-7:00 PM"
        },
        "photo": "https://upload.wikimedia.org/wikipedia/commons/6/68/Museo_del_Prado_2016_%2825185969599%29.jpg"
      },
      {
        "id": "letras-culture-caixaforum",
        "name": "CaixaForum Madrid",
        "coordinates": [
          40.411,
          -3.6932
        ],
        "description": "CaixaForum Madrid is a Herzog & de Meuron conversion of a former power station, recognizable for its floating brick volume and vertical garden. Its programming shifts across contemporary art, photography, design, architecture, science, and social-history exhibitions, so the visit feels more flexible than a single-collection museum.",
        "hours": {
          "mon": "10:00 AM-7:00 PM",
          "tue": "10:00 AM-7:00 PM",
          "wed": "10:00 AM-7:00 PM",
          "thu": "10:00 AM-7:00 PM",
          "fri": "10:00 AM-7:00 PM",
          "sat": "10:00 AM-7:00 PM",
          "sun": "10:00 AM-7:00 PM"
        },
        "photo": "https://live.staticflickr.com/2900/14047205258_8544c9ca6c_b.jpg"
      }
    ],
    "sources": [
      {
        "name": "Tourism Madrid",
        "url": "https://www.esmadrid.com/en"
      },
      {
        "name": "Tourism Madrid - Prado Museum",
        "url": "https://www.esmadrid.com/en/tourist-information/museo-del-prado"
      },
      {
        "name": "Tourism Madrid - Reina Sofia Museum",
        "url": "https://www.esmadrid.com/en/tourist-information/reina-sofia-museum"
      },
      {
        "name": "Museo Nacional del Prado - Opening Times",
        "url": "https://www.museodelprado.es/en/visit/opening-times-and-prices"
      },
      {
        "name": "Google Maps",
        "url": "https://maps.google.com"
      }
    ]
  },
  {
    "id": "list-madrid-retiro-restaurants",
    "slug": "madrid-retiro-restaurants",
    "seoSlug": "best-restaurants",
    "seoTitle": "Best Restaurants in Retiro, Madrid",
    "seoDescription": "Best restaurants in Retiro, Madrid, for park-adjacent meals, polished taverns, museum-day lunches, and quieter dinners near Ibiza and Jerónimos.",
    "title": "Park-Edge Lunches and Polished Taverns",
    "description": "Retiro's restaurants sit between the park, the museum corridor, and the residential streets of Ibiza, where small taverns offer a quieter alternative to monument-side dining. A wine-led seafood lunch is slower and more intimate; the park's multi-space complex seats larger groups but sacrifices some of that quiet.",
    "url": "https://www.google.com/maps/search/retiro+madrid+restaurants",
    "category": "Food",
    "location": {
      "city": "Madrid",
      "neighborhood": "Retiro",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-food",
      "name": "R Food",
      "avatar": "data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20"
    },
    "upvotes": 0,
    "createdAt": "2026-05-06T00:00:00.000Z",
    "stops": [
      {
        "id": "retiro-food-la-catapa",
        "name": "La Catapa",
        "coordinates": [
          40.421,
          -3.6757
        ],
        "description": "La Catapa is a compact Retiro/Ibiza tavern for wines, tapas, seafood-leaning plates, and a quieter local meal built around bottles and conversation.",
        "price": "$",
        "priceSource": "Google Maps / local food coverage",
        "hours": {
          "mon": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "tue": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "wed": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "thu": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "fri": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sat": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sun": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM"
        },
        "photo": "https://tabernalacatapa.com/wp-content/uploads/2025/07/Salpicebiche_La_Catapa_03-2048x1366.webp"
      },
      {
        "id": "retiro-food-kulto",
        "name": "KultO",
        "coordinates": [
          40.4216,
          -3.6764
        ],
        "description": "KultO reinterprets southern Spanish flavors through a traveler's lens, letting Mediterranean dishes cross paths with Asian influence.",
        "price": "$",
        "priceSource": "MICHELIN Guide / Google Maps",
        "hours": {
          "mon": "Closed",
          "tue": "1:00 PM-3:30 PM, 8:00 PM-11:00 PM",
          "wed": "1:00 PM-3:30 PM, 8:00 PM-11:00 PM",
          "thu": "1:00 PM-3:30 PM, 8:00 PM-11:00 PM",
          "fri": "1:00 PM-3:30 PM, 8:00 PM-11:30 PM",
          "sat": "1:00 PM-3:30 PM, 8:00 PM-11:30 PM",
          "sun": "Closed"
        },
        "photo": "https://kulto.es/wp-content/uploads/carta-kulto-restaurante-platos-restaurante-madrid-kulto.jpg"
      },
      {
        "id": "retiro-food-florida",
        "name": "Florida Retiro",
        "coordinates": [
          40.4193,
          -3.6882
        ],
        "description": "Florida Retiro is the park's day-to-night food and leisure complex, with multiple spaces built around dining, music, and social events. Its comfort-food menu leans on local produce, seasonality, tradition, and Madrid recipes.",
        "price": "$",
        "priceSource": "Time Out / Google Maps",
        "hours": {
          "mon": "12:00 PM-12:00 AM",
          "tue": "12:00 PM-12:00 AM",
          "wed": "12:00 PM-12:00 AM",
          "thu": "12:00 PM-12:00 AM",
          "fri": "12:00 PM-1:00 AM",
          "sat": "12:00 PM-1:00 AM",
          "sun": "12:00 PM-12:00 AM"
        },
        "photo": "https://www.floridapark.es/assets/media/florida-park/locales-fotos/la-galeria/2025.08.02_Fotos%20La%20Galeri%CC%81a%20de%20Florida%20Park%20Sergio%20Almarcha89-12122025103016268.jpg"
      },
      {
        "id": "retiro-food-perro-galleta",
        "name": "El Perro y la Galleta",
        "coordinates": [
          40.4196,
          -3.6815
        ],
        "description": "El Perro y la Galleta works for a casual Retiro meal at the park-side Ibiza location, part of a small Madrid group rather than a single one-off restaurant.",
        "price": "$",
        "priceSource": "Google Maps / Tripadvisor",
        "hours": {
          "mon": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "tue": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "wed": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "thu": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "fri": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sat": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sun": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM"
        },
        "photo": "https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=900&q=80"
      }
    ],
    "sources": [
      {
        "name": "The Infatuation - Best Restaurants in Madrid",
        "url": "https://www.theinfatuation.com/madrid/guides/best-madrid-restaurants"
      },
      {
        "name": "The Infatuation - Best Tapas Spots in Madrid",
        "url": "https://www.theinfatuation.com/madrid/guides/best-tapas-spots-madrid"
      },
      {
        "name": "MICHELIN Guide - Madrid restaurants",
        "url": "https://guide.michelin.com/us/en/comunidad-de-madrid/madrid/restaurants"
      },
      {
        "name": "Time Out Madrid - Restaurants",
        "url": "https://www.timeout.es/madrid/es/restaurantes"
      },
      {
        "name": "Google Maps",
        "url": "https://maps.google.com"
      }
    ]
  },
  {
    "id": "list-madrid-retiro-popular-bars",
    "slug": "madrid-retiro-bars",
    "seoSlug": "best-bars",
    "seoTitle": "Best Bars in Retiro, Madrid",
    "seoDescription": "Best bars in Retiro, Madrid, for park drinks, refined hotel bars, vermouth stops, and quieter nights around Ibiza and Jerónimos.",
    "title": "Park Drinks and Quiet Finishes",
    "description": "Retiro nightlife is quieter and more polished than Madrid's club districts. Multi-space dining, hotel cocktails, wine-and-tapas rooms, and dressed-up park-edge bars favor conversation and a composed evening over all-night volume.",
    "url": "https://www.google.com/maps/search/retiro+madrid+bars",
    "category": "Nightlife",
    "location": {
      "city": "Madrid",
      "neighborhood": "Retiro",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-nightlife",
      "name": "R Nightlife",
      "avatar": "data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20"
    },
    "upvotes": 0,
    "createdAt": "2026-05-06T00:00:00.000Z",
    "stops": [
      {
        "id": "retiro-nightlife-florida",
        "name": "Florida Retiro",
        "coordinates": [
          40.4193,
          -3.6882
        ],
        "description": "Florida Retiro combines dining, cocktails, music, and events across several spaces inside the park. La Galeria and the wider complex shift between meals and later social programming, so the official calendar affects the experience.",
        "hours": {
          "mon": "6:00 PM-12:30 AM",
          "tue": "6:00 PM-12:30 AM",
          "wed": "6:00 PM-1:00 AM",
          "thu": "6:00 PM-1:30 AM",
          "fri": "6:00 PM-2:30 AM",
          "sat": "6:00 PM-2:30 AM",
          "sun": "6:00 PM-12:00 AM"
        },
        "photo": "https://www.floridapark.es/assets/media/florida-park/locales-fotos/la-galeria/2025.08.02_Fotos%20La%20Galeri%CC%81a%20de%20Florida%20Park%20Sergio%20Almarcha89-12122025103016268.jpg"
      },
      {
        "id": "retiro-nightlife-mandarin-bar",
        "name": "Pictura at Mandarin Oriental Ritz",
        "coordinates": [
          40.4156,
          -3.6926
        ],
        "description": "The draw is palace-hotel polish, careful service, and a quieter room than the surrounding late-night neighborhoods.",
        "hours": {
          "mon": "6:00 PM-12:30 AM",
          "tue": "6:00 PM-12:30 AM",
          "wed": "6:00 PM-1:00 AM",
          "thu": "6:00 PM-1:30 AM",
          "fri": "6:00 PM-2:30 AM",
          "sat": "6:00 PM-2:30 AM",
          "sun": "6:00 PM-12:00 AM"
        },
        "photo": "https://cdn-assets-eu.frontify.com/s3/frontify-enterprise-files-eu/eyJvYXV0aCI6eyJjbGllbnRfaWQiOiJzaXRlY29yZSJ9LCJwYXRoIjoibWFuZGFyaW4tb3JpZW50YWwtaG90ZWwtZ3JvdXBcL2ZpbGVcLzZMd05RWWZoQnM0YVlDempzMTJxLmpwZyJ9:mandarin-oriental-hotel-group:O39D5V82VXKlHWiQx3UZCeJRD96bv2et1FNJExRxEJ0?width=1920&height=617&fp=0.5,0.5&crop=fp&quality=75"
      },
      {
        "id": "retiro-nightlife-la-catapa",
        "name": "La Catapa",
        "coordinates": [
          40.421,
          -3.6757
        ],
        "description": "La Catapa is a Retiro/Ibiza tavern centered on wine, tapas, seafood-leaning plates, and conversation rather than club volume.",
        "hours": {
          "mon": "12:00 PM-11:00 PM",
          "tue": "12:00 PM-11:00 PM",
          "wed": "12:00 PM-11:00 PM",
          "thu": "12:00 PM-11:30 PM",
          "fri": "12:00 PM-12:00 AM",
          "sat": "12:00 PM-12:00 AM",
          "sun": "12:00 PM-10:30 PM"
        },
        "photo": "https://tabernalacatapa.com/wp-content/uploads/2025/07/Salpicebiche_La_Catapa_03-2048x1366.webp"
      },
      {
        "id": "retiro-nightlife-ramses",
        "name": "Ramses",
        "coordinates": [
          40.4202,
          -3.6887
        ],
        "description": "Ramses combines design-forward drinks and dinner with a polished terrace facing Puerta de Alcalá. The landmark setting carries more ceremony than a low-key neighborhood bar.",
        "hours": {
          "mon": "6:00 PM-12:30 AM",
          "tue": "6:00 PM-12:30 AM",
          "wed": "6:00 PM-1:00 AM",
          "thu": "6:00 PM-1:30 AM",
          "fri": "6:00 PM-2:30 AM",
          "sat": "6:00 PM-2:30 AM",
          "sun": "6:00 PM-12:00 AM"
        },
        "photo": "https://ramseslife.com/img/terrace.jpg"
      }
    ],
    "sources": [
      {
        "name": "Condé Nast Traveler - Best Bars in Madrid",
        "url": "https://www.cntraveler.com/gallery/best-bars-in-madrid"
      },
      {
        "name": "World's 50 Best Bars - Salmon Guru",
        "url": "https://www.theworlds50best.com/bars/the-list/salmon-guru.html"
      },
      {
        "name": "World's 50 Best Discovery - Angelita",
        "url": "https://www.theworlds50best.com/discovery/Establishments/Spain/Madrid/Angelita.html"
      },
      {
        "name": "Time Out Madrid - Bars and pubs",
        "url": "https://www.timeout.es/madrid/es/bares-y-pubs"
      },
      {
        "name": "Mondo Disko official",
        "url": "https://www.mondodisko.es/en/mondo-disko/"
      },
      {
        "name": "Google Maps",
        "url": "https://maps.google.com"
      }
    ]
  },
  {
    "id": "list-madrid-retiro-stays",
    "slug": "madrid-retiro-hotels",
    "seoSlug": "best-hotels",
    "seoTitle": "Best Hotels in Retiro, Madrid",
    "seoDescription": "Best hotels in Retiro, Madrid, for Prado access, park mornings, Atocha rail links, museum days, and quieter central sleep.",
    "title": "Museum Hotels and Park Mornings",
    "description": "These hotels make sense when Madrid starts with museums, park mornings, and a calmer return at night. Mandarin Oriental Ritz and The Westin Palace bring the grand Art Walk mood, Petit Palace Savoy Alfonso XII faces Retiro with practical ease, and Only YOU Hotel Atocha keeps rail, Reina Sofia, and the park in play.",
    "url": "https://www.google.com/maps/search/retiro+madrid+hotels",
    "category": "Stay",
    "location": {
      "city": "Madrid",
      "neighborhood": "Retiro",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-stay",
      "name": "R Stay",
      "avatar": "data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20"
    },
    "upvotes": 0,
    "createdAt": "2026-05-06T00:00:00.000Z",
    "stops": [
      {
        "id": "stay-mandarin-oriental-ritz",
        "name": "Mandarin Oriental Ritz, Madrid",
        "coordinates": [
          40.4156,
          -3.6926
        ],
        "description": "Mandarin Oriental Ritz is a museum-corridor luxury hotel because it sits beside the Prado and Retiro in Madrid's Golden Triangle of Art. Choose Mandarin Oriental Ritz when Belle Epoque atmosphere, service, dining, and park-museum proximity matter more than nightlife at the door.",
        "price": "$$",
        "priceSource": "Mandarin Oriental / MICHELIN Guide",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://media.ffycdn.net/eu/mandarin-oriental-hotel-group/H8U5enphbFo3zGj8XfaK.jpg?mod=v1/contain=-x1000&quality=75"
      },
      {
        "id": "stay-petit-palace-savoy",
        "name": "Petit Palace Savoy Alfonso XII",
        "coordinates": [
          40.4166,
          -3.6891
        ],
        "description": "Petit Palace Savoy Alfonso XII gives the Retiro hotel set a practical park-facing option without the grand-luxury jump.",
        "price": "$",
        "priceSource": "Google Maps / hotel site",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://petitpalace.com/backoffice/images/4838-surrounding-petit-palace-savoy-alfonso-xii-retiro1.jpg"
      },
      {
        "id": "stay-only-you-atocha",
        "name": "Only YOU Hotel Atocha",
        "coordinates": [
          40.4076,
          -3.6909
        ],
        "description": "Only YOU Hotel Atocha is the Retiro and Art Walk hotel for rail access without losing Madrid style. Its lobby, dining, and social spaces make it more than a transit base, while Atocha, Reina Sofia, the Prado, and the park stay easy to reach.",
        "price": "$",
        "priceSource": "Google Maps / hotel site",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://www.onlyyouhotels.com/data/webp/copiadecabeceradesktopcolectivodecantado2620.jpg-f4c144c55eddcb65d4839780ffba4bee.webp"
      },
      {
        "id": "stay-westin-palace",
        "name": "The Westin Palace Madrid",
        "coordinates": [
          40.4153,
          -3.695
        ],
        "description": "The Westin Palace Madrid places Retiro, the Prado, and the Thyssen within easy reach of its historic dome, formal rooms, wellness facilities, and 27 Club bar. The stay feels museum-led and ceremonial rather than neighborhood-casual.",
        "price": "$$",
        "priceSource": "Google Maps / hotel site",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://cache.marriott.com/is/image/marriotts7prod/lc-madcl-la-cupula-32193:Classic-Ver?wid=377&fit=constrain"
      }
    ],
    "sources": [
      {
        "name": "Tourism Madrid - MICHELIN Key Hotels",
        "url": "https://www.esmadrid.com/en/michelin-key-hotels"
      },
      {
        "name": "Condé Nast Traveler - Madrid hotels",
        "url": "https://www.cntraveler.com/hotels/madrid"
      },
      {
        "name": "MICHELIN Guide - Only YOU Boutique Hotel Madrid",
        "url": "https://guide.michelin.com/us/en/hotels-stays/madrid/only-you-boutique-hotel-madrid-8366"
      },
      {
        "name": "Mandarin Oriental Ritz Madrid official",
        "url": "https://www.mandarinoriental.com/en/madrid"
      },
      {
        "name": "Tourism Madrid - Pestana Plaza Mayor",
        "url": "https://www.esmadrid.com/en/accommodation/pestana-plaza-mayor"
      },
      {
        "name": "Google Maps",
        "url": "https://maps.google.com"
      }
    ]
  },
  {
    "id": "list-madrid-retiro-hostels",
    "slug": "madrid-retiro-hostels",
    "seoSlug": "best-hostels",
    "seoTitle": "Best Hostels near Retiro, Madrid",
    "seoDescription": "Best hostels near Retiro, Madrid, for Atocha access, Prado and Reina Sofia days, budget rooms, and central transit without nightlife-first pressure.",
    "title": "Budget Bases for Museum Days",
    "description": "Budget hostels serving Retiro cluster around Atocha, Lavapies, and Tirso rather than deep inside the park-side blocks. Rail and museum access, social common rooms, and lower prices compensate for the extra walk to the gardens.",
    "url": "https://www.google.com/maps/search/retiro+madrid+hostels",
    "category": "Stay",
    "location": {
      "city": "Madrid",
      "neighborhood": "Retiro",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-stay",
      "name": "R Stay",
      "avatar": "data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20"
    },
    "upvotes": 0,
    "createdAt": "2026-05-06T00:00:00.000Z",
    "stops": [
      {
        "id": "stay-latroupe-prado",
        "name": "Latroupe Prado",
        "coordinates": [
          40.4119,
          -3.6943
        ],
        "description": "Latroupe Prado sits near Atocha and Reina Sofia while keeping Retiro manageable on foot. Its bar, restaurant, coworking area, and common spaces favor museum and rail access over late-bar proximity.",
        "price": "$",
        "priceSource": "Latroupe official / Hostelworld",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://www.latroupe.com/data/webp/hotel1125742-fa85b6f4b8a42e52a10641a84db3f801.webp"
      },
      {
        "id": "stay-2060-newton",
        "name": "2060 The Newton Hostel",
        "coordinates": [
          40.412,
          -3.7048
        ],
        "description": "2060 The Newton Hostel is the Retiro-budget compromise: not park-side, but close enough to Atocha, the Art Walk, and Tirso de Molina to make museum days workable. It suits travelers who would rather spend on food and galleries than on a quieter hotel by the park.",
        "price": "$",
        "priceSource": "Hostelworld / Google Maps",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://2060hostelandmarket.com/wp-content/uploads/2023/09/las-mejores-vistas-madrid-hostel-4.jpg.webp"
      },
      {
        "id": "stay-ok-hostel",
        "name": "Ok Hostel Madrid",
        "coordinates": [
          40.4113,
          -3.708
        ],
        "description": "Ok Hostel Madrid is a Retiro-list budget hostel for travelers who accept a short hop or longer walk to the museums in exchange for old-city hostel pricing. Its dorms and private rooms help it cover different comfort levels, especially when the day starts with culture but the evening ends around La Latina or Lavapies.",
        "price": "$",
        "priceSource": "Hostelworld / Google Maps",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://a.hwstatic.com/image/upload/f_auto,q_auto,h_720,c_limit,e_sharpen,e_improve,e_vibrance:60/propertyimages/9/94332/nibn7kmmmvkunz0dsq6i.jpg"
      }
    ],
    "sources": [
      {
        "name": "Hostelworld - Madrid Hostels",
        "url": "https://www.hostelworld.com/hostels/europe/spain/madrid/"
      },
      {
        "name": "The Hat Madrid official",
        "url": "https://www.thehatmadrid.com/en/"
      },
      {
        "name": "Latroupe Prado official",
        "url": "https://www.latroupe.com/en/latroupe-prado/hostel/"
      },
      {
        "name": "Hostelworld - Onefam Madrid",
        "url": "https://www.hostelworld.com/hostels/p/286369/onefam-madrid/"
      },
      {
        "name": "Hostelworld - 2060 The Newton Hostel",
        "url": "https://www.hostelworld.com/hostels/p/282289/2060-the-newton-hostel/"
      },
      {
        "name": "Hostelworld - room00 Chueca Hostel",
        "url": "https://www.hostelworld.com/st/hotels/p/83795/room007-chueca-hostel/"
      },
      {
        "name": "Google Maps",
        "url": "https://maps.google.com"
      }
    ]
  },
  {
    "id": "list-madrid-retiro-culture",
    "slug": "madrid-retiro-culture",
    "seoSlug": "best-culture",
    "seoTitle": "Best Culture in Retiro, Madrid",
    "seoDescription": "Best culture in Retiro, Madrid, from El Retiro Park and Puerta de Alcalá to Prado-adjacent landmarks, museum edges, and garden walks.",
    "title": "Park Culture and Prado Edges",
    "description": "Retiro culture moves between water, gardens, monuments, civic architecture, royal history, and major museum collections. The park's open air prevents the district from becoming only an indoor art corridor.",
    "url": "https://www.google.com/maps/search/retiro+madrid+culture",
    "category": "Culture",
    "location": {
      "city": "Madrid",
      "neighborhood": "Retiro",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-culture",
      "name": "R Culture",
      "avatar": "data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20"
    },
    "upvotes": 0,
    "createdAt": "2026-05-06T00:00:00.000Z",
    "stops": [
      {
        "id": "retiro-culture-park",
        "name": "El Retiro Park",
        "coordinates": [
          40.4153,
          -3.6844
        ],
        "description": "El Retiro Park is Madrid's historic royal garden turned public park, with formal paths, the boating lake, the Alfonso XII monument, rose gardens, fountains, and the Crystal Palace. It offers a cultural landscape rather than a single sight, mixing sculpture, architecture, leisure, and garden design.",
        "hours": {
          "mon": "Open public space",
          "tue": "Open public space",
          "wed": "Open public space",
          "thu": "Open public space",
          "fri": "Open public space",
          "sat": "Open public space",
          "sun": "Open public space"
        },
        "photo": "https://cdn1.yumping.com/emp/fotos/28/P/032080/960/el-retiro-madrid.jpg"
      },
      {
        "id": "retiro-culture-puerta-alcala",
        "name": "Puerta de Alcalá",
        "coordinates": [
          40.4199,
          -3.6887
        ],
        "description": "Puerta de Alcala is the monumental 18th-century gate that frames the northwest edge of Retiro and the start of Calle de Alcala's grand civic axis. Its neoclassical arches make it one of Madrid's most recognizable public monuments.",
        "hours": {
          "mon": "Open public space",
          "tue": "Open public space",
          "wed": "Open public space",
          "thu": "Open public space",
          "fri": "Open public space",
          "sat": "Open public space",
          "sun": "Open public space"
        },
        "photo": "https://mldvwwasb8tu.i.optimole.com/w:894/h:671/q:90/f:best/ig:avif/https://veebrant.com/wp-content/uploads/2013/02/alcala-gate.jpg"
      },
      {
        "id": "retiro-culture-prado",
        "name": "Museo Nacional del Prado",
        "coordinates": [
          40.4138,
          -3.6921
        ],
        "description": "Museo Nacional del Prado gives Retiro immediate access to Madrid's deepest classical art collection. Its galleries are strongest for Spanish court painting, religious canvases, European portraiture, and major works by Velazquez, Goya, El Greco, Bosch, Rubens, and Titian.",
        "hours": {
          "mon": "10:00 AM-8:00 PM",
          "tue": "10:00 AM-8:00 PM",
          "wed": "10:00 AM-8:00 PM",
          "thu": "10:00 AM-8:00 PM",
          "fri": "10:00 AM-8:00 PM",
          "sat": "10:00 AM-8:00 PM",
          "sun": "10:00 AM-7:00 PM"
        },
        "photo": "https://upload.wikimedia.org/wikipedia/commons/6/68/Museo_del_Prado_2016_%2825185969599%29.jpg"
      },
      {
        "id": "retiro-culture-cason",
        "name": "Casón del Buen Retiro",
        "coordinates": [
          40.4141,
          -3.6896
        ],
        "description": "Cason del Buen Retiro is one of the surviving buildings from the old Buen Retiro palace complex, now tied to the Prado's institutional history. Its neoclassical facade and painted interior ceiling make it a useful architectural reminder that the park area was once a royal landscape.",
        "hours": {
          "mon": "Closed",
          "tue": "10:00 AM-7:00 PM",
          "wed": "10:00 AM-7:00 PM",
          "thu": "10:00 AM-7:00 PM",
          "fri": "10:00 AM-7:00 PM",
          "sat": "10:00 AM-7:00 PM",
          "sun": "10:00 AM-7:00 PM"
        },
        "photo": "https://upload.wikimedia.org/wikipedia/commons/6/66/Cas%C3%B3n_del_Buen_Retiro_-_Este.jpg"
      }
    ],
    "sources": [
      {
        "name": "Tourism Madrid",
        "url": "https://www.esmadrid.com/en"
      },
      {
        "name": "Tourism Madrid - Prado Museum",
        "url": "https://www.esmadrid.com/en/tourist-information/museo-del-prado"
      },
      {
        "name": "Tourism Madrid - Reina Sofia Museum",
        "url": "https://www.esmadrid.com/en/tourist-information/reina-sofia-museum"
      },
      {
        "name": "Museo Nacional del Prado - Opening Times",
        "url": "https://www.museodelprado.es/en/visit/opening-times-and-prices"
      },
      {
        "name": "Google Maps",
        "url": "https://maps.google.com"
      }
    ]
  },
  {
    "id": "list-madrid-malasana-restaurants",
    "slug": "madrid-malasana-restaurants",
    "seoSlug": "best-restaurants",
    "seoTitle": "Best Restaurants in Malasana, Madrid",
    "seoDescription": "Best restaurants in Malasana, Madrid, for modern tasting menus, casual cafes, Lebanese plates, late dinners, and neighborhood food before bars.",
    "title": "Indie Dinners and Small Rooms",
    "description": "Malasana's restaurants keep the neighborhood's small scale, from an eight-seat tasting counter to relaxed rooms for Lebanese cooking, brunch, and shared plates. The tasting counter requires advance booking and a long, structured dinner; the larger informal rooms accommodate groups and unplanned drinks afterward.",
    "url": "https://www.google.com/maps/search/malasana+madrid+restaurants",
    "category": "Food",
    "location": {
      "city": "Madrid",
      "neighborhood": "Malasana",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-food",
      "name": "R Food",
      "avatar": "data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20"
    },
    "upvotes": 0,
    "createdAt": "2026-05-06T00:00:00.000Z",
    "stops": [
      {
        "id": "malasana-food-playing-solo",
        "name": "Playing Solo",
        "coordinates": [
          40.4285,
          -3.7041
        ],
        "description": "Playing Solo is a tiny kitchen-facing Malasana room serving a modern tasting menu without losing the neighborhood's small scale. The meal depends on a reservation, not crawl momentum.",
        "price": "$",
        "priceSource": "The Infatuation",
        "hours": {
          "mon": "Closed",
          "tue": "7:00 PM-10:30 PM",
          "wed": "7:00 PM-10:30 PM",
          "thu": "7:00 PM-10:30 PM",
          "fri": "7:00 PM-10:30 PM",
          "sat": "7:00 PM-10:30 PM",
          "sun": "Closed"
        },
        "photo": "https://playingsolorestaurant.com/wp-content/uploads/2023/01/5-playingSolo-min.webp"
      },
      {
        "id": "malasana-food-aredna",
        "name": "Aredna",
        "coordinates": [
          40.4265,
          -3.7007
        ],
        "description": "A warm Lebanese room near Barceló, useful for generous spices and vegetables rather than another tapas default.",
        "price": "$",
        "priceSource": "The Infatuation / Google Maps",
        "hours": {
          "mon": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "tue": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "wed": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "thu": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "fri": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sat": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sun": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM"
        },
        "photo": "https://arednarestaurante.com/wp-content/uploads/2025/12/Diseno-sin-titulo-2025-12-04T115020.668.jpg"
      },
      {
        "id": "malasana-food-ojala",
        "name": "Ojalá",
        "coordinates": [
          40.4265,
          -3.7045
        ],
        "description": "Ojala is a Malasana standby for casual meals, brunch, drinks, and easy group tables in a lively, informal room.",
        "price": "$",
        "priceSource": "Google Maps / Time Out",
        "hours": {
          "mon": "12:00 PM-12:00 AM",
          "tue": "12:00 PM-12:00 AM",
          "wed": "12:00 PM-12:00 AM",
          "thu": "12:00 PM-12:00 AM",
          "fri": "12:00 PM-1:00 AM",
          "sat": "12:00 PM-1:00 AM",
          "sun": "12:00 PM-12:00 AM"
        },
        "photo": "https://grupolamusa.com/wp-content/uploads/2025/11/Musa-Latina.webp"
      },
      {
        "id": "malasana-food-la-musa",
        "name": "La Musa",
        "coordinates": [
          40.4254,
          -3.7053
        ],
        "description": "La Musa serves modern Spanish small plates and globally inflected dishes in a relaxed Malasaña dining room. The full menu supports a sit-down reservation rather than a passing bar snack.",
        "price": "$",
        "priceSource": "Google Maps / Tripadvisor",
        "hours": {
          "mon": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "tue": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "wed": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "thu": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "fri": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sat": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sun": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM"
        },
        "photo": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/07/bf/13/la-carta-de-la-musa-es.jpg?w=900&h=500&s=1"
      }
    ],
    "sources": [
      {
        "name": "The Infatuation - Best Restaurants in Madrid",
        "url": "https://www.theinfatuation.com/madrid/guides/best-madrid-restaurants"
      },
      {
        "name": "The Infatuation - Best Tapas Spots in Madrid",
        "url": "https://www.theinfatuation.com/madrid/guides/best-tapas-spots-madrid"
      },
      {
        "name": "MICHELIN Guide - Madrid restaurants",
        "url": "https://guide.michelin.com/us/en/comunidad-de-madrid/madrid/restaurants"
      },
      {
        "name": "Time Out Madrid - Restaurants",
        "url": "https://www.timeout.es/madrid/es/restaurantes"
      },
      {
        "name": "Google Maps",
        "url": "https://maps.google.com"
      }
    ]
  },
  {
    "id": "list-madrid-malasana-popular-bars",
    "slug": "madrid-malasana-bars",
    "seoSlug": "best-bars",
    "seoTitle": "Best Bars in Malasana, Madrid",
    "seoDescription": "Best bars in Malasana, Madrid, including classic cocktail bars, indie dives, live-music rooms, electronic clubs, and Movida-era nightlife.",
    "title": "Movida Rooms and Late Drinks",
    "description": "Malasana still carries the Movida through poster-covered indie bars and late rooms, now mixed with serious cocktails, live music, and electronic club programming. Personality and sound outrank polished uniformity.",
    "url": "https://www.google.com/maps/search/malasana+madrid+bars",
    "category": "Nightlife",
    "location": {
      "city": "Madrid",
      "neighborhood": "Malasana",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-nightlife",
      "name": "R Nightlife",
      "avatar": "data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20"
    },
    "upvotes": 0,
    "createdAt": "2026-05-06T00:00:00.000Z",
    "stops": [
      {
        "id": "malasana-nightlife-1862",
        "name": "1862 Dry Bar",
        "coordinates": [
          40.4234,
          -3.7036
        ],
        "description": "1862 Dry Bar is the Malasana classic-cocktail room for drinkers who want technique, a historic bar feel, and a calmer start than the neighborhood's louder late rooms.",
        "hours": {
          "mon": "6:00 PM-12:30 AM",
          "tue": "6:00 PM-12:30 AM",
          "wed": "6:00 PM-1:00 AM",
          "thu": "6:00 PM-1:30 AM",
          "fri": "6:00 PM-2:30 AM",
          "sat": "6:00 PM-2:30 AM",
          "sun": "6:00 PM-12:00 AM"
        },
        "photo": "https://estaticos.esmadrid.com/cdn/farfuture/f2OlWoiKmQozuxODMg8jCByoDu9gIyI31IYrKt8vme4/mtime:1593508178/sites/default/files/recursosturisticos/noche/1862_dry_bar_2.jpg"
      },
      {
        "id": "malasana-nightlife-mondo",
        "name": "Mondo Disko",
        "coordinates": [
          40.4264,
          -3.7004
        ],
        "description": "Mondo Disko is an electronic-club near Barceló, built around programmed nights rather than casual drop-in drinks.",
        "hours": {
          "mon": "Event schedule (check venue)",
          "tue": "Event schedule (check venue)",
          "wed": "Event schedule (check venue)",
          "thu": "Event schedule (check venue)",
          "fri": "Event schedule (check venue)",
          "sat": "Event schedule (check venue)",
          "sun": "Event schedule (check venue)"
        },
        "photo": "https://www.mondodisko.es/assets/images/mondo-disko-2.jpg"
      },
      {
        "id": "malasana-nightlife-via-lactea",
        "name": "La Vía Láctea",
        "coordinates": [
          40.4267,
          -3.7044
        ],
        "description": "La Via Lactea is a Malasana classic tied to Movida memory, rock-and-roll posters, affordable drinks, and late neighborhood energy. The room preserves the area's scruffier nightlife history.",
        "hours": {
          "mon": "6:00 PM-12:30 AM",
          "tue": "6:00 PM-12:30 AM",
          "wed": "6:00 PM-1:00 AM",
          "thu": "6:00 PM-1:30 AM",
          "fri": "6:00 PM-2:30 AM",
          "sat": "6:00 PM-2:30 AM",
          "sun": "6:00 PM-12:00 AM"
        },
        "photo": "https://upload.wikimedia.org/wikipedia/commons/8/86/Malasa%C3%B1a_Via_lactea.jpg"
      },
      {
        "id": "malasana-nightlife-tupperware",
        "name": "TupperWare",
        "coordinates": [
          40.4271,
          -3.7042
        ],
        "description": "TupperWare is a pop-culture dive where kitsch, music, and unpolished Malasaña character matter more than a perfectly made cocktail. Go for personality, color, and noise.",
        "hours": {
          "mon": "6:00 PM-12:30 AM",
          "tue": "6:00 PM-12:30 AM",
          "wed": "6:00 PM-1:00 AM",
          "thu": "6:00 PM-1:30 AM",
          "fri": "6:00 PM-2:30 AM",
          "sat": "6:00 PM-2:30 AM",
          "sun": "6:00 PM-12:00 AM"
        },
        "photo": "https://live.staticflickr.com/65535/52806715131_61477c7969_b.jpg"
      }
    ],
    "sources": [
      {
        "name": "Condé Nast Traveler - Best Bars in Madrid",
        "url": "https://www.cntraveler.com/gallery/best-bars-in-madrid"
      },
      {
        "name": "World's 50 Best Bars - Salmon Guru",
        "url": "https://www.theworlds50best.com/bars/the-list/salmon-guru.html"
      },
      {
        "name": "World's 50 Best Discovery - Angelita",
        "url": "https://www.theworlds50best.com/discovery/Establishments/Spain/Madrid/Angelita.html"
      },
      {
        "name": "Time Out Madrid - Bars and pubs",
        "url": "https://www.timeout.es/madrid/es/bares-y-pubs"
      },
      {
        "name": "Mondo Disko official",
        "url": "https://www.mondodisko.es/en/mondo-disko/"
      },
      {
        "name": "Google Maps",
        "url": "https://maps.google.com"
      }
    ]
  },
  {
    "id": "list-madrid-malasana-stays",
    "slug": "madrid-malasana-hotels",
    "seoSlug": "best-hotels",
    "seoTitle": "Best Hotels in Malasana, Madrid",
    "seoDescription": "Best hotels in Malasana, Madrid, for Tribunal access, Gran Via edges, boutique design, value hotels, and quieter resets near nightlife.",
    "title": "Hotels Near the Noise, Not Inside It",
    "description": "The trick in Malasana is sleeping near the noise without letting the noise own the trip. URSO offers spa-level calm, 7 Islas brings an art-led Valverde base, Ibis Madrid Centro keeps things simple inside the neighborhood, and Brach Madrid adds a sharper design-hotel option near Gran Via.",
    "url": "https://www.google.com/maps/search/malasana+madrid+hotels",
    "category": "Stay",
    "location": {
      "city": "Madrid",
      "neighborhood": "Malasana",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-stay",
      "name": "R Stay",
      "avatar": "data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20"
    },
    "upvotes": 0,
    "createdAt": "2026-05-06T00:00:00.000Z",
    "stops": [
      {
        "id": "stay-urso",
        "name": "URSO Hotel & Spa Madrid",
        "coordinates": [
          40.4252,
          -3.6999
        ],
        "description": "URSO is a restored-palace hotel on the Malasana edge with calm rooms, spa-level amenities, and easy access to Tribunal and Chueca without sleeping inside their loudest streets.",
        "price": "$$",
        "priceSource": "MICHELIN Key Hotels / Google Maps",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://b4411764.smushcdn.com/4411764/wp-content/uploads/2018/10/Lobby_urso_2023-scaled.jpg?lossy=2&strip=1&webp=1"
      },
      {
        "id": "stay-seven-islas",
        "name": "7 Islas Hotel",
        "coordinates": [
          40.4217,
          -3.7012
        ],
        "description": "7 Islas Hotel is a Malasana-edge design hotel for the neighborhood nearby but not directly under the loudest bar blocks.",
        "price": "$",
        "priceSource": "7 Islas official / Google Maps",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://www.7islashotel.com/wp-content/uploads/2026/01/7-islas-hotel-verano-2025-c-mariana-borau-87-copia-scaled.jpg"
      },
      {
        "id": "stay-ibis-centro",
        "name": "Ibis Madrid Centro",
        "coordinates": [
          40.4292,
          -3.7037
        ],
        "description": "Ibis Madrid Centro is a value hotel inside Malasana, useful when location and predictable sleep matter more than boutique character. Tourism Madrid places it in the Movida-linked neighborhood, so it works for the bars close but still prefer hotel basics over dorms.",
        "price": "$",
        "priceSource": "Tourism Madrid / Google Maps",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://www.ahstatic.com/photos/3318_ho_00_p_1024x768.jpg"
      },
      {
        "id": "stay-brach",
        "name": "Brach Madrid",
        "coordinates": [
          40.4198,
          -3.6995
        ],
        "description": "Brach Madrid is a fashion-forward hotel on the Gran Via and Chueca edge, pairing polished design with immediate shopping, nightlife, and central transport.",
        "price": "$$",
        "priceSource": "Google Maps / hotel site",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://brachmadrid.com/wp-content/uploads/sites/3/2024/11/suite-Antonio-Brach-Madrid-gdelaubier-septembre-1-1-548x796.jpg"
      }
    ],
    "sources": [
      {
        "name": "Tourism Madrid - MICHELIN Key Hotels",
        "url": "https://www.esmadrid.com/en/michelin-key-hotels"
      },
      {
        "name": "Condé Nast Traveler - Madrid hotels",
        "url": "https://www.cntraveler.com/hotels/madrid"
      },
      {
        "name": "MICHELIN Guide - Only YOU Boutique Hotel Madrid",
        "url": "https://guide.michelin.com/us/en/hotels-stays/madrid/only-you-boutique-hotel-madrid-8366"
      },
      {
        "name": "Mandarin Oriental Ritz Madrid official",
        "url": "https://www.mandarinoriental.com/en/madrid"
      },
      {
        "name": "Tourism Madrid - Pestana Plaza Mayor",
        "url": "https://www.esmadrid.com/en/accommodation/pestana-plaza-mayor"
      },
      {
        "name": "Google Maps",
        "url": "https://maps.google.com"
      }
    ]
  },
  {
    "id": "list-madrid-malasana-hostels",
    "slug": "madrid-malasana-hostels",
    "seoSlug": "best-hostels",
    "seoTitle": "Best Hostels in Malasana, Madrid",
    "seoDescription": "Best hostels in Malasana, Madrid, for social travelers, Tribunal access, dorm value, design-hostel rooms, and nightlife within walking distance.",
    "title": "Social Beds Around Tribunal",
    "description": "These hostels understand that Malasana travelers often want people, movement, and a late return. Onefam Madrid is the community machine, Bastardo brings design-hostel polish near Tribunal, and room00 Chueca gives the edge of the neighborhood a more flexible budget sleep option.",
    "url": "https://www.google.com/maps/search/malasana+madrid+hostels",
    "category": "Stay",
    "location": {
      "city": "Madrid",
      "neighborhood": "Malasana",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-stay",
      "name": "R Stay",
      "avatar": "data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20"
    },
    "upvotes": 0,
    "createdAt": "2026-05-06T00:00:00.000Z",
    "stops": [
      {
        "id": "stay-onefam-madrid",
        "name": "Onefam Madrid",
        "coordinates": [
          40.4287,
          -3.7039
        ],
        "description": "The family-dinner and activity model fits Tribunal nights, casual bar plans, and travelers who want the neighborhood to set the pace.",
        "price": "$",
        "priceSource": "Hostelworld / Google Maps",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://onefamhostels.com/wp-content/uploads/2024/09/02Onefam-Madrid-terrace2.webp"
      },
      {
        "id": "stay-bastardo",
        "name": "Bastardo Hostel",
        "coordinates": [
          40.4248,
          -3.7009
        ],
        "description": "Bastardo Hostel is the Malasana design-hostel hybrid for style, shared spaces, and Tribunal proximity without a purely party-hostel feel. It is a social base that still gives private-room flexibility.",
        "price": "$",
        "priceSource": "Bastardo official / Hostelworld",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://images.getaroom-cdn.com/image/upload/s--0BmdvxGV--/c_limit,e_improve,fl_lossy.immutable_cache,h_940,q_auto:good,w_940/v1770188687/7e17436d28e4641d7b45a45a79dcd38e43ee6d18?_a=BACAEuEv&atc=e7cd1cfa"
      },
      {
        "id": "stay-room00-chueca",
        "name": "room00 Chueca Hostel",
        "coordinates": [
          40.4245,
          -3.6977
        ],
        "description": "room00 Chueca Hostel works from Malasana as a budget sleep option near Hortaleza, Gran Via, and the Chueca border. Dorms, private rooms, and family rooms make it useful for nightlife access without committing to a full party-hostel program.",
        "price": "$",
        "priceSource": "Hostelworld / Visit Chueca",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://room00hostel.com/wp-content/uploads/2026/04/1-Doble-Superior-min.webp"
      }
    ],
    "sources": [
      {
        "name": "Hostelworld - Madrid Hostels",
        "url": "https://www.hostelworld.com/hostels/europe/spain/madrid/"
      },
      {
        "name": "The Hat Madrid official",
        "url": "https://www.thehatmadrid.com/en/"
      },
      {
        "name": "Latroupe Prado official",
        "url": "https://www.latroupe.com/en/latroupe-prado/hostel/"
      },
      {
        "name": "Hostelworld - Onefam Madrid",
        "url": "https://www.hostelworld.com/hostels/p/286369/onefam-madrid/"
      },
      {
        "name": "Hostelworld - 2060 The Newton Hostel",
        "url": "https://www.hostelworld.com/hostels/p/282289/2060-the-newton-hostel/"
      },
      {
        "name": "Hostelworld - room00 Chueca Hostel",
        "url": "https://www.hostelworld.com/st/hotels/p/83795/room007-chueca-hostel/"
      },
      {
        "name": "Google Maps",
        "url": "https://maps.google.com"
      }
    ]
  },
  {
    "id": "list-madrid-malasana-culture",
    "slug": "madrid-malasana-culture",
    "seoSlug": "best-culture",
    "seoTitle": "Best Culture in Malasana, Madrid",
    "seoDescription": "Best culture in Malasana, Madrid, from Museo de Historia and Plaza Dos de Mayo to Conde Duque, Teatro Lara, and Movida-era streets.",
    "title": "Movida Memory and Neighborhood Stages",
    "description": "Malasana culture lives in street memory as much as institutions, from the 1808 uprising and the city's historical record to contemporary arts programming and small-stage theater. Movida-era identity remains visible in the neighborhood around them.",
    "url": "https://www.google.com/maps/search/malasana+madrid+culture",
    "category": "Culture",
    "location": {
      "city": "Madrid",
      "neighborhood": "Malasana",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-culture",
      "name": "R Culture",
      "avatar": "data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20"
    },
    "upvotes": 0,
    "createdAt": "2026-05-06T00:00:00.000Z",
    "stops": [
      {
        "id": "malasana-culture-history-museum",
        "name": "Museo de Historia de Madrid",
        "coordinates": [
          40.4259,
          -3.7009
        ],
        "description": "Museo de Historia de Madrid tells the city's story from its 16th-century court-capital rise through maps, paintings, models, prints, and everyday objects. The Baroque facade on Fuencarral also makes the museum feel connected to the street history of Malasana itself.",
        "hours": {
          "mon": "Closed",
          "tue": "10:00 AM-7:00 PM",
          "wed": "10:00 AM-7:00 PM",
          "thu": "10:00 AM-7:00 PM",
          "fri": "10:00 AM-7:00 PM",
          "sat": "10:00 AM-7:00 PM",
          "sun": "10:00 AM-7:00 PM"
        },
        "photo": "https://estaticos.esmadrid.com/cdn/farfuture/s4kycL0wqQbfwpdoMYZ5v46zOq0dibShr8ZdRiwAun8/mtime:1524832499/sites/default/files/recursosturisticos/infoturistica/Museodehistoria663x335_1409746743.637.jpg"
      },
      {
        "id": "malasana-culture-dos-mayo",
        "name": "Plaza del Dos de Mayo",
        "coordinates": [
          40.4266,
          -3.7045
        ],
        "description": "Plaza del Dos de Mayo is Malasana's symbolic square, named for the 1808 uprising against Napoleonic troops and marked by the monument to Daoiz and Velarde. It is also a lived neighborhood space, with cafe terraces, families, nightlife spillover, and the area's independent character in plain view.",
        "hours": {
          "mon": "Open public space",
          "tue": "Open public space",
          "wed": "Open public space",
          "thu": "Open public space",
          "fri": "Open public space",
          "sat": "Open public space",
          "sun": "Open public space"
        },
        "photo": "https://upload.wikimedia.org/wikipedia/commons/a/a8/Plaza_del_Dos_de_Mayo%2C_Madrid.jpg"
      },
      {
        "id": "malasana-culture-conde-duque",
        "name": "Centro de Cultura Contemporánea Condeduque",
        "coordinates": [
          40.4273,
          -3.7103
        ],
        "description": "Centro de Cultura Contemporanea Condeduque fills a former royal guards barracks with contemporary exhibitions, concerts, theater, dance, film, talks, and festival programming. Its large courtyards and brick military architecture give Malasana a cultural center with real institutional scale.",
        "hours": {
          "mon": "Closed",
          "tue": "10:00 AM-7:00 PM",
          "wed": "10:00 AM-7:00 PM",
          "thu": "10:00 AM-7:00 PM",
          "fri": "10:00 AM-7:00 PM",
          "sat": "10:00 AM-7:00 PM",
          "sun": "10:00 AM-7:00 PM"
        },
        "photo": "https://estaticos.esmadrid.com/cdn/farfuture/RHdtpU4v_49sNbLIEjWLrJSxgCAaS9DTNlfGzUsrLy4/mtime:1646729507/sites/default/files/styles/content_type_full/public/recursosturisticos/infoturistica/417051595_1072012135931_adj.jpg?itok=YDRDdC_X"
      },
      {
        "id": "malasana-culture-teatro-lara",
        "name": "Teatro Lara",
        "coordinates": [
          40.4219,
          -3.7042
        ],
        "description": "Teatro Lara has been operating since 1879, with a red-and-gold historic auditorium that keeps Malasana connected to Madrid's small-theater tradition. Its program leans toward plays, comedy, music, and intimate stage work rather than monumental opera-house scale.",
        "hours": {
          "mon": "Event schedule (check venue)",
          "tue": "Event schedule (check venue)",
          "wed": "Event schedule (check venue)",
          "thu": "Event schedule (check venue)",
          "fri": "Event schedule (check venue)",
          "sat": "Event schedule (check venue)",
          "sun": "Event schedule (check venue)"
        },
        "photo": "https://teatrolara.com/images/parallax.jpg"
      }
    ],
    "sources": [
      {
        "name": "Tourism Madrid",
        "url": "https://www.esmadrid.com/en"
      },
      {
        "name": "Tourism Madrid - Prado Museum",
        "url": "https://www.esmadrid.com/en/tourist-information/museo-del-prado"
      },
      {
        "name": "Tourism Madrid - Reina Sofia Museum",
        "url": "https://www.esmadrid.com/en/tourist-information/reina-sofia-museum"
      },
      {
        "name": "Museo Nacional del Prado - Opening Times",
        "url": "https://www.museodelprado.es/en/visit/opening-times-and-prices"
      },
      {
        "name": "Google Maps",
        "url": "https://maps.google.com"
      }
    ]
  },
  {
    "id": "list-madrid-la-latina-restaurants",
    "slug": "madrid-la-latina-restaurants",
    "seoSlug": "best-restaurants",
    "seoTitle": "Best Restaurants in La Latina, Madrid",
    "seoDescription": "Best restaurants in La Latina, Madrid, for Cava Baja tapas, market meals, old taverns, Sunday El Rastro stops, and classic Madrid lunches.",
    "title": "Cava Baja Tapas and Old Taverns",
    "description": "La Latina concentrates Cava Baja tapas, old taverns, tortilla, vermouth, and crowded Sunday streets into Madrid's most recognizable grazing district.",
    "url": "https://www.google.com/maps/search/la+latina+madrid+restaurants",
    "category": "Food",
    "location": {
      "city": "Madrid",
      "neighborhood": "La Latina",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-food",
      "name": "R Food",
      "avatar": "data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20"
    },
    "upvotes": 0,
    "createdAt": "2026-05-06T00:00:00.000Z",
    "stops": [
      {
        "id": "latina-food-juana-loca",
        "name": "Juana La Loca",
        "coordinates": [
          40.4113,
          -3.7115
        ],
        "description": "Juana La Loca is a polished Cava Baja tapas bar known for tortilla, pintxos, and a more composed La Latina meal than random grazing.",
        "price": "$",
        "priceSource": "The Infatuation / Google Maps",
        "hours": {
          "mon": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "tue": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "wed": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "thu": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "fri": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sat": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sun": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM"
        },
        "photo": "https://static.wixstatic.com/media/1aa0f7_0b697c156a8f469aaa022ac129c18011~mv2.jpeg/v1/fit/w_1279,h_852,q_90,enc_avif,quality_auto/1aa0f7_0b697c156a8f469aaa022ac129c18011~mv2.jpeg"
      },
      {
        "id": "latina-food-casa-lucio",
        "name": "Casa Lucio",
        "coordinates": [
          40.412,
          -3.7106
        ],
        "description": "Casa Lucio is an old-Madrid dining room known for huevos rotos and a splurge-leaning La Latina lunch or dinner. Reservations matter more here than on a casual Cava Baja crawl.",
        "price": "$",
        "priceSource": "Time Out / Google Maps",
        "hours": {
          "mon": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "tue": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "wed": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "thu": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "fri": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sat": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sun": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM"
        },
        "photo": "https://casalucio.es/wp-content/uploads/2015/09/local_01.jpg"
      },
      {
        "id": "latina-food-taberna-concha",
        "name": "Taberna La Concha",
        "coordinates": [
          40.4115,
          -3.7114
        ],
        "description": "Taberna La Concha is a compact Cava Baja tavern for vermouth, tapas, and a small, social meal that feels specific to La Latina.",
        "price": "$",
        "priceSource": "Google Maps / Tripadvisor",
        "hours": {
          "mon": "12:00 PM-12:30 AM",
          "tue": "12:00 PM-12:30 AM",
          "wed": "12:00 PM-12:30 AM",
          "thu": "12:00 PM-1:30 AM",
          "fri": "12:00 PM-2:00 AM",
          "sat": "12:00 PM-2:00 AM",
          "sun": "12:00 PM-12:00 AM"
        },
        "photo": "http://www.laconchataberna.com/wp-content/uploads/2018/10/fondopag2.jpg"
      },
      {
        "id": "latina-food-mercado-cebada",
        "name": "Mercado de la Cebada",
        "coordinates": [
          40.4115,
          -3.7089
        ],
        "description": "Mercado de la Cebada combines a working neighborhood market with prepared-food stalls and casual counters near La Latina. The variety handles mixed appetites without forcing one fixed meal.",
        "price": "$",
        "priceSource": "Google Maps / local guides",
        "hours": {
          "mon": "12:00 PM-12:00 AM",
          "tue": "12:00 PM-12:00 AM",
          "wed": "12:00 PM-12:00 AM",
          "thu": "12:00 PM-12:00 AM",
          "fri": "12:00 PM-1:00 AM",
          "sat": "12:00 PM-1:00 AM",
          "sun": "12:00 PM-12:00 AM"
        },
        "photo": "https://www.mercadodelacebada.com/wp-content/uploads/2022/06/Planta-baja_Bier-pause.jpg"
      }
    ],
    "sources": [
      {
        "name": "The Infatuation - Best Restaurants in Madrid",
        "url": "https://www.theinfatuation.com/madrid/guides/best-madrid-restaurants"
      },
      {
        "name": "The Infatuation - Best Tapas Spots in Madrid",
        "url": "https://www.theinfatuation.com/madrid/guides/best-tapas-spots-madrid"
      },
      {
        "name": "MICHELIN Guide - Madrid restaurants",
        "url": "https://guide.michelin.com/us/en/comunidad-de-madrid/madrid/restaurants"
      },
      {
        "name": "Time Out Madrid - Restaurants",
        "url": "https://www.timeout.es/madrid/es/restaurantes"
      },
      {
        "name": "Google Maps",
        "url": "https://maps.google.com"
      }
    ]
  },
  {
    "id": "list-madrid-la-latina-popular-bars",
    "slug": "madrid-la-latina-bars",
    "seoSlug": "best-bars",
    "seoTitle": "Best Bars in La Latina, Madrid",
    "seoDescription": "Best bars in La Latina, Madrid, including Cava Baja vermouth stops, rooftop drinks, tapas bars, and late rooms after El Rastro.",
    "title": "Cava Baja Into the Night",
    "description": "La Latina nightlife blurs dinner and drinking through Cava Baja taverns, vermouth, wine bars, and late rooms that stay informal rather than club-driven.",
    "url": "https://www.google.com/maps/search/la+latina+madrid+bars",
    "category": "Nightlife",
    "location": {
      "city": "Madrid",
      "neighborhood": "La Latina",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-nightlife",
      "name": "R Nightlife",
      "avatar": "data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20"
    },
    "upvotes": 0,
    "createdAt": "2026-05-06T00:00:00.000Z",
    "stops": [
      {
        "id": "latina-nightlife-viajero",
        "name": "El Viajero",
        "coordinates": [
          40.4113,
          -3.711
        ],
        "description": "El Viajero spreads La Latina nightlife across multiple floors, with street-level energy, indoor dining, and the rooftop terrace as the main prize.",
        "hours": {
          "mon": "12:00 PM-12:30 AM",
          "tue": "12:00 PM-12:30 AM",
          "wed": "12:00 PM-12:30 AM",
          "thu": "12:00 PM-1:30 AM",
          "fri": "12:00 PM-2:00 AM",
          "sat": "12:00 PM-2:00 AM",
          "sun": "12:00 PM-12:00 AM"
        },
        "photo": "https://www.elviajeromadrid.com/images/nosotros4.jpg"
      },
      {
        "id": "latina-nightlife-taberna-concha",
        "name": "Taberna La Concha",
        "coordinates": [
          40.4115,
          -3.7114
        ],
        "description": "Taberna La Concha keeps a La Latina night anchored in vermouth, wine, tapas, and compact Cava Baja energy. It is better as a flavorful neighborhood start than as a late-room destination.",
        "hours": {
          "mon": "12:00 PM-12:30 AM",
          "tue": "12:00 PM-12:30 AM",
          "wed": "12:00 PM-12:30 AM",
          "thu": "12:00 PM-1:30 AM",
          "fri": "12:00 PM-2:00 AM",
          "sat": "12:00 PM-2:00 AM",
          "sun": "12:00 PM-12:00 AM"
        },
        "photo": "http://www.laconchataberna.com/wp-content/uploads/2018/10/fondopag2.jpg"
      },
      {
        "id": "latina-nightlife-marula",
        "name": "Marula Café",
        "coordinates": [
          40.4134,
          -3.71327
        ],
        "description": "Marula Café sits by Caños Viejos as a La Latina music-and-dance room known for funk, soul, jazz, Afrobeat, and DJ-led nights.",
        "hours": {
          "mon": "10:00 PM-2:30 AM",
          "tue": "10:00 PM-2:30 AM",
          "wed": "10:00 PM-3:30 AM",
          "thu": "10:00 PM-4:30 AM",
          "fri": "10:00 PM-5:00 AM",
          "sat": "10:00 PM-5:00 AM",
          "sun": "10:00 PM-2:30 AM"
        },
        "photo": "https://marulacafe.com/wp-content/uploads/2025/03/vlcsnap-2025-03-14-10h48m24s722.jpg"
      },
      {
        "id": "latina-nightlife-contra",
        "name": "ContraClub",
        "coordinates": [
          40.4102,
          -3.7093
        ],
        "description": "ContraClub is a small live-room and club for when La Latina moves beyond taverns and rooftops.",
        "hours": {
          "mon": "Event schedule (check venue)",
          "tue": "Event schedule (check venue)",
          "wed": "Event schedule (check venue)",
          "thu": "Event schedule (check venue)",
          "fri": "Event schedule (check venue)",
          "sat": "Event schedule (check venue)",
          "sun": "Event schedule (check venue)"
        },
        "photo": "https://live.staticflickr.com/21/27496477_31da0c243d_b.jpg"
      }
    ],
    "sources": [
      {
        "name": "Condé Nast Traveler - Best Bars in Madrid",
        "url": "https://www.cntraveler.com/gallery/best-bars-in-madrid"
      },
      {
        "name": "World's 50 Best Bars - Salmon Guru",
        "url": "https://www.theworlds50best.com/bars/the-list/salmon-guru.html"
      },
      {
        "name": "World's 50 Best Discovery - Angelita",
        "url": "https://www.theworlds50best.com/discovery/Establishments/Spain/Madrid/Angelita.html"
      },
      {
        "name": "Time Out Madrid - Bars and pubs",
        "url": "https://www.timeout.es/madrid/es/bares-y-pubs"
      },
      {
        "name": "Mondo Disko official",
        "url": "https://www.mondodisko.es/en/mondo-disko/"
      },
      {
        "name": "Google Maps",
        "url": "https://maps.google.com"
      }
    ]
  },
  {
    "id": "list-madrid-la-latina-stays",
    "slug": "madrid-la-latina-hotels",
    "seoSlug": "best-hotels",
    "seoTitle": "Best Hotels in La Latina, Madrid",
    "seoDescription": "Best hotels in La Latina, Madrid, for Cava Baja tapas, old-city walks, Plaza Mayor access, boutique inns, and central design hotels.",
    "title": "Hotels for Tapas-First Nights",
    "description": "Hotels around La Latina and the historic center range from intimate old-Madrid rooms to polished square-front properties. Street noise, restaurant access, room character, and service level define the tradeoffs.",
    "url": "https://www.google.com/maps/search/la+latina+madrid+hotels",
    "category": "Stay",
    "location": {
      "city": "Madrid",
      "neighborhood": "La Latina",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-stay",
      "name": "R Stay",
      "avatar": "data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20"
    },
    "upvotes": 0,
    "createdAt": "2026-05-06T00:00:00.000Z",
    "stops": [
      {
        "id": "stay-posada-leon",
        "name": "Posada del León de Oro",
        "coordinates": [
          40.4124,
          -3.7105
        ],
        "description": "Posada del León de Oro is the La Latina hotel for Cava Baja as the base, not just an evening detour. Choose Posada del León de Oro when old-city atmosphere, tapas access, and a smaller boutique scale matter more than broad hotel facilities.",
        "price": "$",
        "priceSource": "Google Maps / hotel site",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://posadadelleondeoro.com/wp-content/uploads/FACHADA-ILUMINADA-HORIZONTAL.jpeg"
      },
      {
        "id": "stay-pestana-plaza-mayor",
        "name": "Pestana Plaza Mayor Madrid",
        "coordinates": [
          40.415,
          -3.7074
        ],
        "description": "Pestana Plaza Mayor occupies Madrid's landmark central square while keeping Cava Baja and the older streets of La Latina close. Its spa and full hotel facilities offer more support than a small neighborhood inn.",
        "price": "$$",
        "priceSource": "Tourism Madrid / Pestana",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://www.pestana.com/content/dam/pestana/en_us/destinations/spain/madrid/pestana-plaza-mayor/gallery/overview/pestana-plaza-mayor-gallery-surroundings-cafe-terrace.jpg"
      },
      {
        "id": "stay-edition",
        "name": "The Madrid EDITION",
        "coordinates": [
          40.4171,
          -3.7062
        ],
        "description": "The Madrid EDITION works for La Latina trips as the polished hotel just above the tapas streets, useful when Cava Baja nights should end somewhere more controlled. Book it when rooftop energy and Plaza Mayor proximity matter as much as the neighborhood crawl.",
        "price": "$$",
        "priceSource": "Condé Nast Traveler / Google Maps",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://www.editionhotels.com/wp-content/uploads/2026/03/EDT_Madrid2_23-_RGB_V1-2-scaled.jpg"
      },
      {
        "id": "stay-room-mate-alba",
        "name": "Room Mate Alba",
        "coordinates": [
          40.4135,
          -3.7002
        ],
        "description": "Room Mate Alba works for La Latina trips as a slightly eastward boutique base, useful when tapas nights should pair with Las Letras and Art Walk days.",
        "price": "$",
        "priceSource": "Google Maps / hotel site",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://room-matehotels.com/data/webp/alba-roommatealba-suiteroom9669-c813f8fb45bdac0f5af1d049c81e64ee.webp"
      }
    ],
    "sources": [
      {
        "name": "Tourism Madrid - MICHELIN Key Hotels",
        "url": "https://www.esmadrid.com/en/michelin-key-hotels"
      },
      {
        "name": "Condé Nast Traveler - Madrid hotels",
        "url": "https://www.cntraveler.com/hotels/madrid"
      },
      {
        "name": "MICHELIN Guide - Only YOU Boutique Hotel Madrid",
        "url": "https://guide.michelin.com/us/en/hotels-stays/madrid/only-you-boutique-hotel-madrid-8366"
      },
      {
        "name": "Mandarin Oriental Ritz Madrid official",
        "url": "https://www.mandarinoriental.com/en/madrid"
      },
      {
        "name": "Tourism Madrid - Pestana Plaza Mayor",
        "url": "https://www.esmadrid.com/en/accommodation/pestana-plaza-mayor"
      },
      {
        "name": "Google Maps",
        "url": "https://maps.google.com"
      }
    ]
  },
  {
    "id": "list-madrid-la-latina-hostels",
    "slug": "madrid-la-latina-hostels",
    "seoSlug": "best-hostels",
    "seoTitle": "Best Hostels in La Latina, Madrid",
    "seoDescription": "Best hostels in La Latina, Madrid, for Cava Baja access, Tirso de Molina, social dorms, private rooms, El Rastro, and budget central walks.",
    "title": "Hostels for Cava Baja and Tirso",
    "description": "Hostels serving La Latina keep tapas streets and the historic center accessible at dorm prices. Rooftop social energy, quieter museum-edge rooms, common spaces, and distance from Cava Baja separate the properties.",
    "url": "https://www.google.com/maps/search/la+latina+madrid+hostels",
    "category": "Stay",
    "location": {
      "city": "Madrid",
      "neighborhood": "La Latina",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-stay",
      "name": "R Stay",
      "avatar": "data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20"
    },
    "upvotes": 0,
    "createdAt": "2026-05-06T00:00:00.000Z",
    "stops": [
      {
        "id": "stay-the-hat",
        "name": "The Hat Madrid",
        "coordinates": [
          40.4145,
          -3.7073
        ],
        "description": "The Hat Madrid is a La Latina-adjacent social hotel, close enough to Cava Baja and Plaza Mayor to make tapas nights simple.",
        "price": "$",
        "priceSource": "Hostelworld / The Hat official",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://thehatmadrid.com/wp-content/uploads/slider/cache/cb3097b9f7bb39d19fd625c1017d58d6/1.the_hat-88-1.webp"
      },
      {
        "id": "stay-ok-hostel",
        "name": "Ok Hostel Madrid",
        "coordinates": [
          40.4113,
          -3.708
        ],
        "description": "Ok Hostel Madrid sits close to Cava Baja, Tirso de Molina, and the Rastro side of La Latina. Dorms and private rooms let the stay remain social and low-cost without forcing every guest into a shared bunk.",
        "price": "$",
        "priceSource": "Hostelworld / Google Maps",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://a.hwstatic.com/image/upload/f_auto,q_auto,h_720,c_limit,e_sharpen,e_improve,e_vibrance:60/propertyimages/9/94332/nibn7kmmmvkunz0dsq6i.jpg"
      },
      {
        "id": "stay-2060-newton",
        "name": "2060 The Newton Hostel",
        "coordinates": [
          40.412,
          -3.7048
        ],
        "description": "2060 The Newton Hostel sits at Tirso de Molina between Cava Baja, Lavapies, Sol, and the market streets. Social spaces and a central bed suit evenings spread across several old-city pockets.",
        "price": "$",
        "priceSource": "Hostelworld / Google Maps",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://2060hostelandmarket.com/wp-content/uploads/2023/09/las-mejores-vistas-madrid-hostel-4.jpg.webp"
      },
      {
        "id": "stay-latroupe-prado",
        "name": "Latroupe Prado",
        "coordinates": [
          40.4119,
          -3.6943
        ],
        "description": "Latroupe Prado is a quieter hostel near Atocha and the museum corridor, with more distance from Cava Baja than the neighborhood's closest dorm beds.",
        "price": "$",
        "priceSource": "Latroupe official / Hostelworld",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://www.latroupe.com/data/webp/hotel1125742-fa85b6f4b8a42e52a10641a84db3f801.webp"
      }
    ],
    "sources": [
      {
        "name": "Hostelworld - Madrid Hostels",
        "url": "https://www.hostelworld.com/hostels/europe/spain/madrid/"
      },
      {
        "name": "The Hat Madrid official",
        "url": "https://www.thehatmadrid.com/en/"
      },
      {
        "name": "Latroupe Prado official",
        "url": "https://www.latroupe.com/en/latroupe-prado/hostel/"
      },
      {
        "name": "Hostelworld - Onefam Madrid",
        "url": "https://www.hostelworld.com/hostels/p/286369/onefam-madrid/"
      },
      {
        "name": "Hostelworld - 2060 The Newton Hostel",
        "url": "https://www.hostelworld.com/hostels/p/282289/2060-the-newton-hostel/"
      },
      {
        "name": "Hostelworld - room00 Chueca Hostel",
        "url": "https://www.hostelworld.com/st/hotels/p/83795/room007-chueca-hostel/"
      },
      {
        "name": "Google Maps",
        "url": "https://maps.google.com"
      }
    ]
  },
  {
    "id": "list-madrid-la-latina-culture",
    "slug": "madrid-la-latina-culture",
    "seoSlug": "best-culture",
    "seoTitle": "Best Culture in La Latina, Madrid",
    "seoDescription": "Best culture in La Latina, Madrid, from El Rastro and Plaza de la Paja to San Francisco el Grande, Cava Baja, and old Madrid streets.",
    "title": "Markets, Plazas, and Old Madrid",
    "description": "La Latina's culture is carried by a Sunday street market, monumental religious architecture, intimate old-city plazas, and tavern streets that remain part of daily Madrid. Its history is public, social, and visible outside conventional museums.",
    "url": "https://www.google.com/maps/search/la+latina+madrid+culture",
    "category": "Culture",
    "location": {
      "city": "Madrid",
      "neighborhood": "La Latina",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-culture",
      "name": "R Culture",
      "avatar": "data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20"
    },
    "upvotes": 0,
    "createdAt": "2026-05-06T00:00:00.000Z",
    "stops": [
      {
        "id": "latina-culture-rastro",
        "name": "El Rastro",
        "coordinates": [
          40.4086,
          -3.7071
        ],
        "description": "El Rastro is Madrid's famous Sunday flea market, spreading through Ribera de Curtidores and the surrounding La Latina streets. The cultural experience is the ritual itself: antiques, secondhand stalls, prints, clothes, bargaining, crowds, and the neighborhood's morning-to-vermouth rhythm.",
        "hours": {
          "mon": "Closed",
          "tue": "Closed",
          "wed": "Closed",
          "thu": "Closed",
          "fri": "Closed",
          "sat": "Closed",
          "sun": "9:00 AM-3:00 PM"
        },
        "photo": "https://upload.wikimedia.org/wikipedia/commons/d/df/Madrid_-_El_Rastro%2C_25_de_marzo_de_2018_%2818%29.jpg"
      },
      {
        "id": "latina-culture-san-francisco",
        "name": "Basílica de San Francisco el Grande",
        "coordinates": [
          40.4109,
          -3.7148
        ],
        "description": "Basílica de San Francisco el Grande brings a vast frescoed dome, monumental scale, and serious sacred art to La Latina's older streets. The interior is far grander than the surrounding neighborhood lanes suggest.",
        "hours": {
          "mon": "9:00 AM-8:00 PM",
          "tue": "9:00 AM-8:00 PM",
          "wed": "9:00 AM-8:00 PM",
          "thu": "9:00 AM-8:00 PM",
          "fri": "9:00 AM-8:00 PM",
          "sat": "9:00 AM-8:00 PM",
          "sun": "9:00 AM-8:00 PM"
        },
        "photo": "https://upload.wikimedia.org/wikipedia/commons/0/0e/Madrid_Real_Bas%C3%ADlica_de_San_Francisco_el_Grande_16-03-2010_16-35-14.JPG"
      },
      {
        "id": "latina-culture-plaza-paja",
        "name": "Plaza de la Paja",
        "coordinates": [
          40.4123,
          -3.7118
        ],
        "description": "Plaza de la Paja is one of La Latina's most atmospheric medieval-feeling squares, bordered by old walls, church history, and sloping lanes.",
        "hours": {
          "mon": "Open public space",
          "tue": "Open public space",
          "wed": "Open public space",
          "thu": "Open public space",
          "fri": "Open public space",
          "sat": "Open public space",
          "sun": "Open public space"
        },
        "photo": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/17/f0/d7/7b/dalla-costanilla-de-san.jpg?w=900&h=500&s=1"
      },
      {
        "id": "latina-culture-cava-baja",
        "name": "Cava Baja",
        "coordinates": [
          40.412,
          -3.7108
        ],
        "description": "Cava Baja is La Latina's classic tavern street, famous for packing more than 50 traditional tapas bars and restaurants into roughly 300 meters. Its cultural value is the concentration: old inns, wine bars, tiled facades, and the ritual of moving from one small room to the next.",
        "hours": {
          "mon": "Open public space",
          "tue": "Open public space",
          "wed": "Open public space",
          "thu": "Open public space",
          "fri": "Open public space",
          "sat": "Open public space",
          "sun": "Open public space"
        },
        "photo": "https://live.staticflickr.com/2939/32534583963_d39a8e5042_b.jpg"
      }
    ],
    "sources": [
      {
        "name": "Tourism Madrid",
        "url": "https://www.esmadrid.com/en"
      },
      {
        "name": "Tourism Madrid - Prado Museum",
        "url": "https://www.esmadrid.com/en/tourist-information/museo-del-prado"
      },
      {
        "name": "Tourism Madrid - Reina Sofia Museum",
        "url": "https://www.esmadrid.com/en/tourist-information/reina-sofia-museum"
      },
      {
        "name": "Museo Nacional del Prado - Opening Times",
        "url": "https://www.museodelprado.es/en/visit/opening-times-and-prices"
      },
      {
        "name": "Google Maps",
        "url": "https://maps.google.com"
      }
    ]
  },
  {
    "id": "list-madrid-chueca-restaurants",
    "slug": "madrid-chueca-restaurants",
    "seoSlug": "best-restaurants",
    "seoTitle": "Best Restaurants in Chueca, Madrid",
    "seoDescription": "Best restaurants in Chueca, Madrid, for wine-led dinners, market meals, modern Spanish cooking, LGBTQ+ nightlife-adjacent dining, and stylish central rooms.",
    "title": "Wine, Market Plates, and Stylish Rooms",
    "description": "Chueca's dining runs alongside its wine bars, market, and late-night streets, with both formal tasting menus and flexible group meals. Book the small high-end rooms for a planned occasion; market counters and shareable plates are easier when appetites or arrival times differ.",
    "url": "https://www.google.com/maps/search/chueca+madrid+restaurants",
    "category": "Food",
    "location": {
      "city": "Madrid",
      "neighborhood": "Chueca",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-food",
      "name": "R Food",
      "avatar": "data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20"
    },
    "upvotes": 0,
    "createdAt": "2026-05-06T00:00:00.000Z",
    "stops": [
      {
        "id": "chueca-food-angelita",
        "name": "Angelita",
        "coordinates": [
          40.4208,
          -3.7005
        ],
        "description": "Angelita combines a wine-led Chueca dining room upstairs with a serious cocktail bar downstairs, allowing dinner to continue without changing addresses.",
        "price": "$",
        "priceSource": "The Infatuation / World's 50 Best Bars",
        "hours": {
          "mon": "1:00 PM-4:00 PM, 8:00 PM-11:00 PM",
          "tue": "1:00 PM-4:00 PM, 8:00 PM-11:00 PM",
          "wed": "1:00 PM-4:00 PM, 8:00 PM-11:00 PM",
          "thu": "1:00 PM-4:00 PM, 8:00 PM-11:00 PM",
          "fri": "1:00 PM-4:00 PM, 8:00 PM-11:30 PM",
          "sat": "1:00 PM-4:00 PM, 8:00 PM-11:30 PM",
          "sun": "1:00 PM-4:00 PM, 8:00 PM-11:00 PM"
        },
        "photo": "https://madrid-angelita.es/wp-content/uploads/elementor/thumbs/img5-food-qzwl3ptwk9tg7q6stw4dct91z09bj6nylbgfgsnknm.jpg"
      },
      {
        "id": "chueca-food-mercado-san-anton",
        "name": "Mercado de San Antón",
        "coordinates": [
          40.4228,
          -3.6972
        ],
        "description": "Mercado de San Antón layers produce stalls, prepared-food counters, and rooftop dining inside a modern Chueca market. Mixed appetites can split up and regroup without committing to one menu.",
        "price": "$",
        "priceSource": "Google Maps / Time Out",
        "hours": {
          "mon": "12:00 PM-12:00 AM",
          "tue": "12:00 PM-12:00 AM",
          "wed": "12:00 PM-12:00 AM",
          "thu": "12:00 PM-12:00 AM",
          "fri": "12:00 PM-1:00 AM",
          "sat": "12:00 PM-1:00 AM",
          "sun": "12:00 PM-12:00 AM"
        },
        "photo": "https://www.mercadosananton.com/wp-content/uploads/2022/06/1-Maru_MSA_21Mayo_Generales_04.jpg"
      },
      {
        "id": "chueca-food-dstage",
        "name": "DSTAgE",
        "coordinates": [
          40.4248,
          -3.6971
        ],
        "description": "DSTAgE serves an ambitious tasting menu in a high-end Chueca/Salesas room close to the neighborhood's nightlife streets.",
        "price": "$",
        "priceSource": "MICHELIN Guide / Google Maps",
        "hours": {
          "mon": "Closed",
          "tue": "7:00 PM-10:30 PM",
          "wed": "7:00 PM-10:30 PM",
          "thu": "7:00 PM-10:30 PM",
          "fri": "7:00 PM-10:30 PM",
          "sat": "7:00 PM-10:30 PM",
          "sun": "Closed"
        },
        "photo": "https://mybb-storage-prod.s3.fr-par.scw.cloud/media_manager/b417b949-95ea-4255-848e-44fc6dcd41fa/160415_DSTAgE_0Z6A0767.jpg"
      },
      {
        "id": "chueca-food-kuoco",
        "name": "Kuoco 360",
        "coordinates": [
          40.4216,
          -3.6986
        ],
        "description": "Kuoco 360 is a lively, fusion-leaning Chueca restaurant built around big flavors, shareable plates, and a social room suited to groups.",
        "price": "$",
        "priceSource": "Google Maps / Tripadvisor",
        "hours": {
          "mon": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "tue": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "wed": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "thu": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "fri": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sat": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sun": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM"
        },
        "photo": "https://www.gastroactitud.com/wp-content/uploads/2023/02/kuoco-360-madrid-0103.jpg"
      }
    ],
    "sources": [
      {
        "name": "The Infatuation - Best Restaurants in Madrid",
        "url": "https://www.theinfatuation.com/madrid/guides/best-madrid-restaurants"
      },
      {
        "name": "The Infatuation - Best Tapas Spots in Madrid",
        "url": "https://www.theinfatuation.com/madrid/guides/best-tapas-spots-madrid"
      },
      {
        "name": "MICHELIN Guide - Madrid restaurants",
        "url": "https://guide.michelin.com/us/en/comunidad-de-madrid/madrid/restaurants"
      },
      {
        "name": "Time Out Madrid - Restaurants",
        "url": "https://www.timeout.es/madrid/es/restaurantes"
      },
      {
        "name": "Google Maps",
        "url": "https://maps.google.com"
      }
    ]
  },
  {
    "id": "list-madrid-chueca-popular-bars",
    "slug": "madrid-chueca-bars",
    "seoSlug": "best-bars",
    "seoTitle": "Best Bars in Chueca, Madrid",
    "seoDescription": "Best bars in Chueca, Madrid, including LGBTQ+ nightlife, cocktail rooms, wine bars, piano-bar classics, and stylish Gran Via-adjacent drinks.",
    "title": "Cocktails, Queer Rooms, and Late Classics",
    "description": "Chueca nightlife has range: basement cocktails, lush new rooms, historic glamour, and piano-bar chaos within a short walk.",
    "url": "https://www.google.com/maps/search/chueca+madrid+bars",
    "category": "Nightlife",
    "location": {
      "city": "Madrid",
      "neighborhood": "Chueca",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-nightlife",
      "name": "R Nightlife",
      "avatar": "data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20"
    },
    "upvotes": 0,
    "createdAt": "2026-05-06T00:00:00.000Z",
    "stops": [
      {
        "id": "chueca-nightlife-angelita",
        "name": "Angelita",
        "coordinates": [
          40.4208,
          -3.7005
        ],
        "description": "Angelita pairs a wine-led restaurant upstairs with an intimate basement bar serving produce-driven cocktails. The two formats make food, bottles, and serious mixed drinks part of one address.",
        "hours": {
          "mon": "6:00 PM-12:30 AM",
          "tue": "6:00 PM-12:30 AM",
          "wed": "6:00 PM-1:00 AM",
          "thu": "6:00 PM-1:30 AM",
          "fri": "6:00 PM-2:30 AM",
          "sat": "6:00 PM-2:30 AM",
          "sun": "6:00 PM-12:00 AM"
        },
        "photo": "https://madrid-angelita.es/wp-content/uploads/elementor/thumbs/img5-food-qzwl3ptwk9tg7q6stw4dct91z09bj6nylbgfgsnknm.jpg"
      },
      {
        "id": "chueca-nightlife-ficus",
        "name": "Ficus Bar",
        "coordinates": [
          40.4221,
          -3.6984
        ],
        "description": "Ficus Bar is a current Chueca cocktail room with plant-filled styling, neighborhood scale, and a more relaxed pace than the Gran Via classics.",
        "hours": {
          "mon": "6:00 PM-12:30 AM",
          "tue": "6:00 PM-12:30 AM",
          "wed": "6:00 PM-1:00 AM",
          "thu": "6:00 PM-1:30 AM",
          "fri": "6:00 PM-2:30 AM",
          "sat": "6:00 PM-2:30 AM",
          "sun": "6:00 PM-12:00 AM"
        },
        "photo": "https://static.wixstatic.com/media/504b29_8a2a776ee62b41fcb512d06189491966~mv2.jpg/v1/fill/w_3360,h_1392,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/504b29_8a2a776ee62b41fcb512d06189491966~mv2.jpg"
      },
      {
        "id": "chueca-nightlife-museo-chicote",
        "name": "Museo Chicote",
        "coordinates": [
          40.4204,
          -3.6999
        ],
        "description": "Museo Chicote opened as Spain's first cocktail bar and preserves old Madrid glamour through a mirrored Gran Via room and classic cocktail service on the Chueca edge.",
        "hours": {
          "mon": "6:00 PM-12:30 AM",
          "tue": "6:00 PM-12:30 AM",
          "wed": "6:00 PM-1:00 AM",
          "thu": "6:00 PM-1:30 AM",
          "fri": "6:00 PM-2:30 AM",
          "sat": "6:00 PM-2:30 AM",
          "sun": "6:00 PM-12:00 AM"
        },
        "photo": "https://www.museochicote.com/wp-content/uploads/sites/126/2025/08/MUSEO-CHICOTE-10-BAJA-1920x1294.jpg"
      },
      {
        "id": "chueca-nightlife-toni2",
        "name": "Toni 2 Piano Bar",
        "coordinates": [
          40.421,
          -3.6976
        ],
        "description": "Toni 2 Piano Bar is the Chueca-adjacent singalong finish, close enough for the neighborhood's late rhythm but theatrical in its own old-school way.",
        "hours": {
          "mon": "10:00 PM-2:30 AM",
          "tue": "10:00 PM-2:30 AM",
          "wed": "10:00 PM-3:30 AM",
          "thu": "10:00 PM-4:30 AM",
          "fri": "10:00 PM-5:00 AM",
          "sat": "10:00 PM-5:00 AM",
          "sun": "10:00 PM-2:30 AM"
        },
        "photo": "https://toni2.es/wp-content/uploads/2021/09/Barra-Toni-2-madrid-scaled-e1636977700852-2048x1295.jpeg"
      }
    ],
    "sources": [
      {
        "name": "Condé Nast Traveler - Best Bars in Madrid",
        "url": "https://www.cntraveler.com/gallery/best-bars-in-madrid"
      },
      {
        "name": "World's 50 Best Bars - Salmon Guru",
        "url": "https://www.theworlds50best.com/bars/the-list/salmon-guru.html"
      },
      {
        "name": "World's 50 Best Discovery - Angelita",
        "url": "https://www.theworlds50best.com/discovery/Establishments/Spain/Madrid/Angelita.html"
      },
      {
        "name": "Time Out Madrid - Bars and pubs",
        "url": "https://www.timeout.es/madrid/es/bares-y-pubs"
      },
      {
        "name": "Mondo Disko official",
        "url": "https://www.mondodisko.es/en/mondo-disko/"
      },
      {
        "name": "Google Maps",
        "url": "https://maps.google.com"
      }
    ]
  },
  {
    "id": "list-madrid-chueca-stays",
    "slug": "madrid-chueca-hotels",
    "seoSlug": "best-hotels",
    "seoTitle": "Best Hotels in Chueca, Madrid",
    "seoDescription": "Best hotels in Chueca, Madrid, for boutique stays, rooftop access, Gran Via edges, LGBTQ+ nightlife, and polished central sleep.",
    "title": "Boutique Stays Around Chueca",
    "description": "Hotels in and around Chueca keep Barquillo, Gran Via, and the neighborhood's nightlife within walking distance, with quieter rooms toward the Salesas edge. Room Mate Oscar has the rooftop pool; spa hotels provide more separation from the busiest late-night blocks.",
    "url": "https://www.google.com/maps/search/chueca+madrid+hotels",
    "category": "Stay",
    "location": {
      "city": "Madrid",
      "neighborhood": "Chueca",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-stay",
      "name": "R Stay",
      "avatar": "data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20"
    },
    "upvotes": 0,
    "createdAt": "2026-05-06T00:00:00.000Z",
    "stops": [
      {
        "id": "stay-only-you-boutique",
        "name": "Only YOU Boutique Hotel Madrid",
        "coordinates": [
          40.4235,
          -3.6964
        ],
        "description": "Only YOU Boutique Hotel Madrid is a Chueca hotel, with MICHELIN-noted palace-to-boutique design and a Barquillo address near shopping, cocktails, and Salesas. It is best when the neighborhood itself should shape the stay.",
        "price": "$$",
        "priceSource": "MICHELIN Guide / Google Maps",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://www.onlyyouhotels.com/data/webp/galeria-fotos-oyb5872.jpg-577afb9e3b5f0876d20535f0f7b9a1cd.webp"
      },
      {
        "id": "stay-room-mate-oscar",
        "name": "Room Mate Óscar",
        "coordinates": [
          40.4206,
          -3.6981
        ],
        "description": "Room Mate Oscar sits in the heart of Chueca on Plaza de Pedro Zerolo, making it especially convenient for exploring central Madrid on foot. Its rooftop terrace and pool add a social, open-air reset above the neighborhood's dining, shopping, and nightlife streets.",
        "price": "$",
        "priceSource": "Google Maps / hotel site",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://room-matehotels.com/data/webp/27754-524a64bed079429d8d1bc1877d4bdbac.webp"
      },
      {
        "id": "stay-brach",
        "name": "Brach Madrid",
        "coordinates": [
          40.4198,
          -3.6995
        ],
        "description": "Brach Madrid is a polished design hotel near Gran Via, Salesas, and Chueca's cocktail bars. Contemporary social spaces come with the services needed for a more complete hotel retreat.",
        "price": "$$",
        "priceSource": "Google Maps / hotel site",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://brachmadrid.com/wp-content/uploads/sites/3/2024/11/suite-Antonio-Brach-Madrid-gdelaubier-septembre-1-1-548x796.jpg"
      },
      {
        "id": "stay-hotel-urban",
        "name": "Hotel Urban",
        "coordinates": [
          40.4166,
          -3.699
        ],
        "description": "Hotel Urban is a unique, art-driven luxury hotel between Chueca, Sol, and Las Letras, with a strong design identity and museum-like character. It fits travelers who want central access, polished service, and a stay that feels more distinctive than a standard business hotel.",
        "price": "$$",
        "priceSource": "Google Maps / hotel site",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://api.fishhotels.com/api/sites/f08d948c-e22b-44f8-91bb-2c70c5acf572/media-images/ur-suite-loft-2.jpg?cw=2000&ch=1125&cx=0&cy=104&s=xxl&w=2000&h=1125"
      },
      {
        "id": "stay-urso",
        "name": "URSO Hotel & Spa Madrid",
        "coordinates": [
          40.4252,
          -3.6999
        ],
        "description": "URSO sits on Chueca's refined edge, close to Barquillo, Salesas, and cocktail bars but removed from the loudest blocks. Polished rooms and a spa take priority over sleeping directly above nightlife.",
        "price": "$$",
        "priceSource": "MICHELIN Key Hotels / Google Maps",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://b4411764.smushcdn.com/4411764/wp-content/uploads/2018/10/Lobby_urso_2023-scaled.jpg?lossy=2&strip=1&webp=1"
      }
    ],
    "sources": [
      {
        "name": "Tourism Madrid - MICHELIN Key Hotels",
        "url": "https://www.esmadrid.com/en/michelin-key-hotels"
      },
      {
        "name": "Condé Nast Traveler - Madrid hotels",
        "url": "https://www.cntraveler.com/hotels/madrid"
      },
      {
        "name": "MICHELIN Guide - Only YOU Boutique Hotel Madrid",
        "url": "https://guide.michelin.com/us/en/hotels-stays/madrid/only-you-boutique-hotel-madrid-8366"
      },
      {
        "name": "Mandarin Oriental Ritz Madrid official",
        "url": "https://www.mandarinoriental.com/en/madrid"
      },
      {
        "name": "Tourism Madrid - Pestana Plaza Mayor",
        "url": "https://www.esmadrid.com/en/accommodation/pestana-plaza-mayor"
      },
      {
        "name": "Google Maps",
        "url": "https://maps.google.com"
      }
    ]
  },
  {
    "id": "list-madrid-chueca-hostels",
    "slug": "madrid-chueca-hostels",
    "seoSlug": "best-hostels",
    "seoTitle": "Best Hostels in Chueca, Madrid",
    "seoDescription": "Best hostels in Chueca, Madrid, for Hortaleza dorms, Chueca-Malasana access, Gran Via walks, social stays, and budget rooms near nightlife.",
    "title": "Budget Beds on the Chueca Edge",
    "description": "Hostels on the Chueca edge range from designed social properties to dorms, private rooms, and family rooms near Hortaleza, Gran Via, and Tribunal. Community level matters as much as address.",
    "url": "https://www.google.com/maps/search/chueca+madrid+hostels",
    "category": "Stay",
    "location": {
      "city": "Madrid",
      "neighborhood": "Chueca",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-stay",
      "name": "R Stay",
      "avatar": "data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20"
    },
    "upvotes": 0,
    "createdAt": "2026-05-06T00:00:00.000Z",
    "stops": [
      {
        "id": "stay-room00-chueca",
        "name": "room00 Chueca Hostel",
        "coordinates": [
          40.4245,
          -3.6977
        ],
        "description": "room00 Chueca Hostel is the direct Chueca budget base, close to Hortaleza, Gran Via, shopping, and nightlife. It offers dorms, private rooms, and family rooms, so it can handle solo travelers, groups, and families who care most about location.",
        "price": "$",
        "priceSource": "Hostelworld / Visit Chueca",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://room00hostel.com/wp-content/uploads/2026/04/1-Doble-Superior-min.webp"
      },
      {
        "id": "stay-bastardo",
        "name": "Bastardo Hostel",
        "coordinates": [
          40.4248,
          -3.7009
        ],
        "description": "Bastardo Hostel sits between Chueca's queer nightlife, Malasana bars, and Gran Via. Its social, design-conscious rooms feel more considered than the city's most stripped-back dorms.",
        "price": "$",
        "priceSource": "Bastardo official / Hostelworld",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://images.getaroom-cdn.com/image/upload/s--0BmdvxGV--/c_limit,e_improve,fl_lossy.immutable_cache,h_940,q_auto:good,w_940/v1770188687/7e17436d28e4641d7b45a45a79dcd38e43ee6d18?_a=BACAEuEv&atc=e7cd1cfa"
      },
      {
        "id": "stay-onefam-madrid",
        "name": "Onefam Madrid",
        "coordinates": [
          40.4287,
          -3.7039
        ],
        "description": "Onefam Madrid works for Chueca hostel planning as the social base just northwest of the neighborhood's main nightlife spine.",
        "price": "$",
        "priceSource": "Hostelworld / Google Maps",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://onefamhostels.com/wp-content/uploads/2024/09/02Onefam-Madrid-terrace2.webp"
      }
    ],
    "sources": [
      {
        "name": "Hostelworld - Madrid Hostels",
        "url": "https://www.hostelworld.com/hostels/europe/spain/madrid/"
      },
      {
        "name": "The Hat Madrid official",
        "url": "https://www.thehatmadrid.com/en/"
      },
      {
        "name": "Latroupe Prado official",
        "url": "https://www.latroupe.com/en/latroupe-prado/hostel/"
      },
      {
        "name": "Hostelworld - Onefam Madrid",
        "url": "https://www.hostelworld.com/hostels/p/286369/onefam-madrid/"
      },
      {
        "name": "Hostelworld - 2060 The Newton Hostel",
        "url": "https://www.hostelworld.com/hostels/p/282289/2060-the-newton-hostel/"
      },
      {
        "name": "Hostelworld - room00 Chueca Hostel",
        "url": "https://www.hostelworld.com/st/hotels/p/83795/room007-chueca-hostel/"
      },
      {
        "name": "Google Maps",
        "url": "https://maps.google.com"
      }
    ]
  },
  {
    "id": "list-madrid-chueca-culture",
    "slug": "madrid-chueca-culture",
    "seoSlug": "best-culture",
    "seoTitle": "Best Culture in Chueca, Madrid",
    "seoDescription": "Best culture in Chueca, Madrid, from Museo del Romanticismo and Plaza de Chueca to Gran Via architecture, galleries, and LGBTQ+ urban history.",
    "title": "Romantic Rooms and Chueca Streets",
    "description": "Chueca culture is not only nightlife; it is domestic history, public identity, and architecture with a bit of swagger.",
    "url": "https://www.google.com/maps/search/chueca+madrid+culture",
    "category": "Culture",
    "location": {
      "city": "Madrid",
      "neighborhood": "Chueca",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-culture",
      "name": "R Culture",
      "avatar": "data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20"
    },
    "upvotes": 0,
    "createdAt": "2026-05-06T00:00:00.000Z",
    "stops": [
      {
        "id": "chueca-culture-romanticismo",
        "name": "Museo del Romanticismo",
        "coordinates": [
          40.425,
          -3.6986
        ],
        "description": "Museo del Romanticismo is a 19th-century mansion museum that recreates the daily life, taste, and social customs of Madrid's upper bourgeoisie. Period rooms, paintings, furniture, decorative arts, and the garden cafe make the visit feel domestic, intimate, and historically specific.",
        "hours": {
          "mon": "Closed",
          "tue": "10:00 AM-7:00 PM",
          "wed": "10:00 AM-7:00 PM",
          "thu": "10:00 AM-7:00 PM",
          "fri": "10:00 AM-7:00 PM",
          "sat": "10:00 AM-7:00 PM",
          "sun": "10:00 AM-7:00 PM"
        },
        "photo": "https://upload.wikimedia.org/wikipedia/commons/b/be/Museo_del_Romanticismo_-_Sal%C3%B3n_de_baile_-_Sala_IV_Sal%C3%B3n_de_Baile.jpg"
      },
      {
        "id": "chueca-culture-plaza",
        "name": "Plaza de Chueca",
        "coordinates": [
          40.4227,
          -3.6976
        ],
        "description": "Plaza de Chueca is the lively center of Madrid's LGBTQ+ district, known for outdoor dining, inclusive nightlife, boutique streets, and neighborhood celebrations.",
        "hours": {
          "mon": "Open public space",
          "tue": "Open public space",
          "wed": "Open public space",
          "thu": "Open public space",
          "fri": "Open public space",
          "sat": "Open public space",
          "sun": "Open public space"
        },
        "photo": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/69/9e/67/plaza-de-chueca.jpg?w=900&h=500&s=1"
      },
      {
        "id": "chueca-culture-gran-via",
        "name": "Gran Vía",
        "coordinates": [
          40.42,
          -3.7016
        ],
        "description": "Gran Via is Madrid's most iconic avenue, running 1.36 kilometers from Calle de Alcala to Plaza de Espana. Known as the Spanish Broadway, it combines early 20th-century architecture, theaters, cinemas, shops, hotel rooftops, and the constant energy of central Madrid.",
        "hours": {
          "mon": "Open public space",
          "tue": "Open public space",
          "wed": "Open public space",
          "thu": "Open public space",
          "fri": "Open public space",
          "sat": "Open public space",
          "sun": "Open public space"
        },
        "photo": "https://live.staticflickr.com/8141/7584292430_d24ee67b35_b.jpg"
      },
      {
        "id": "chueca-culture-longoria",
        "name": "Palacio de Longoria",
        "coordinates": [
          40.4247,
          -3.6968
        ],
        "description": "Palacio de Longoria is Madrid's standout Art Nouveau palace, with flowing stonework, floral ornament, curved balconies, and an unusually sculptural facade for the city. It adds a distinct modernista layer to the Salesas and Chueca architectural walk.",
        "hours": {
          "mon": "Open public space",
          "tue": "Open public space",
          "wed": "Open public space",
          "thu": "Open public space",
          "fri": "Open public space",
          "sat": "Open public space",
          "sun": "Open public space"
        },
        "photo": "https://upload.wikimedia.org/wikipedia/commons/1/17/Palacio_Longoria_%2827001564923%29.jpg"
      }
    ],
    "sources": [
      {
        "name": "Tourism Madrid",
        "url": "https://www.esmadrid.com/en"
      },
      {
        "name": "Tourism Madrid - Prado Museum",
        "url": "https://www.esmadrid.com/en/tourist-information/museo-del-prado"
      },
      {
        "name": "Tourism Madrid - Reina Sofia Museum",
        "url": "https://www.esmadrid.com/en/tourist-information/reina-sofia-museum"
      },
      {
        "name": "Museo Nacional del Prado - Opening Times",
        "url": "https://www.museodelprado.es/en/visit/opening-times-and-prices"
      },
      {
        "name": "Google Maps",
        "url": "https://maps.google.com"
      }
    ]
  }
] satisfies MapList[];

const madridCitywideGuideSeeds = [
  {
    "id": "list-madrid-citywide-restaurants",
    "slug": "madrid-citywide-restaurants",
    "seoSlug": "best-restaurants",
    "seoTitle": "Best Restaurants in Madrid",
    "seoDescription": "Best restaurants in Madrid, from tapas counters and market tortillas to modern Spanish rooms, wine-led Chueca dining, and destination tasting menus.",
    "title": "Tapas Streets, Markets, and Modern Rooms",
    "description": "Madrid's restaurants range from market-stall tortilla and old-capital dining rooms to eight-seat counters and high-budget tasting menus. Market lunches and old taverns rarely require a long booking, while the smallest modern rooms and internationally recognized fine dining demand advance reservations and more time.",
    "url": "https://www.google.com/maps/search/best+restaurants+madrid",
    "category": "Food",
    "location": {
      "city": "Madrid",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-food",
      "name": "R Food",
      "avatar": "data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20"
    },
    "upvotes": 0,
    "createdAt": "2026-05-06T00:00:00.000Z",
    "stops": [
      {
        "id": "madrid-food-casa-dani",
        "name": "Casa Dani",
        "coordinates": [
          40.4255,
          -3.6869
        ],
        "description": "Casa Dani is a Salamanca market because Madrid food planning needs at least one stop that is about the everyday tortilla ritual rather than a formal reservation. The Infatuation highlights it inside Mercado de la Paz, and its sustained market-stall demand makes it a practical lunch or bar-seat stop when the day is moving through Serrano or Retiro-adjacent neighborhoods.",
        "price": "$",
        "priceSource": "The Infatuation / Google Maps",
        "hours": {
          "mon": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "tue": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "wed": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "thu": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "fri": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sat": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sun": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM"
        },
        "photo": "https://static.wixstatic.com/media/ffa181_13e0b9bd9cb043488dabb7ecf16a0370~mv2.jpg/v1/fill/w_1405,h_667,al_c,q_85,enc_avif,quality_auto/ffa181_13e0b9bd9cb043488dabb7ecf16a0370~mv2.jpg"
      },
      {
        "id": "madrid-food-la-malontina",
        "name": "La Malontina",
        "coordinates": [
          40.4144,
          -3.6981
        ],
        "description": "La Malontina gives Barrio de las Letras a compact, food-first dinner that is more useful than a generic Huertas tapas crawl. The Infatuation points to the Cortes room for casual Spanish cooking, and the size of the restaurant keeps it in the date-night, pre-theater, and neighborhood-dinner lane rather than the big occasion lane.",
        "price": "$",
        "priceSource": "The Infatuation / Google Maps",
        "hours": {
          "mon": "Closed",
          "tue": "7:00 PM-10:30 PM",
          "wed": "7:00 PM-10:30 PM",
          "thu": "7:00 PM-10:30 PM",
          "fri": "7:00 PM-10:30 PM",
          "sat": "7:00 PM-10:30 PM",
          "sun": "Closed"
        },
        "photo": "https://images.squarespace-cdn.com/content/v1/5f8c4ebce7e6c83bd00bdac4/1738692480370-VCSG7Q1DPJ0X4VOI7X1F/Almeja+rubia+gallega+a+la+marinera+2.jpg?format=1000w"
      },
      {
        "id": "madrid-food-angelita",
        "name": "Angelita",
        "coordinates": [
          40.4208,
          -3.7005
        ],
        "description": "Angelita pairs a produce-led restaurant with an unusually deep wine program near Chueca. Seasonal plates and serious bottles make the dining room more than an annex to the cocktail bar downstairs.",
        "price": "$$",
        "priceSource": "The Infatuation / World's 50 Best Bars",
        "hours": {
          "mon": "1:00 PM-4:00 PM, 8:00 PM-11:00 PM",
          "tue": "1:00 PM-4:00 PM, 8:00 PM-11:00 PM",
          "wed": "1:00 PM-4:00 PM, 8:00 PM-11:00 PM",
          "thu": "1:00 PM-4:00 PM, 8:00 PM-11:00 PM",
          "fri": "1:00 PM-4:00 PM, 8:00 PM-11:30 PM",
          "sat": "1:00 PM-4:00 PM, 8:00 PM-11:30 PM",
          "sun": "1:00 PM-4:00 PM, 8:00 PM-11:00 PM"
        },
        "photo": "https://madrid-angelita.es/wp-content/uploads/elementor/thumbs/img5-food-qzwl3ptwk9tg7q6stw4dct91z09bj6nylbgfgsnknm.jpg"
      },
      {
        "id": "madrid-food-playing-solo",
        "name": "Playing Solo",
        "coordinates": [
          40.4285,
          -3.7041
        ],
        "description": "Playing Solo is an eight-seat, kitchen-facing tasting-menu restaurant in Malasana. The tiny counter puts modern Madrid cooking and direct contact with the kitchen ahead of grand-room fine-dining ceremony.",
        "price": "$$",
        "priceSource": "The Infatuation",
        "hours": {
          "mon": "Closed",
          "tue": "7:00 PM-10:30 PM",
          "wed": "7:00 PM-10:30 PM",
          "thu": "7:00 PM-10:30 PM",
          "fri": "7:00 PM-10:30 PM",
          "sat": "7:00 PM-10:30 PM",
          "sun": "Closed"
        },
        "photo": "https://playingsolorestaurant.com/wp-content/uploads/2023/01/5-playingSolo-min.webp"
      },
      {
        "id": "madrid-food-lhardy",
        "name": "Lhardy",
        "coordinates": [
          40.4172,
          -3.7003
        ],
        "description": "Lhardy preserves an old-capital dining room near Puerta del Sol, serving croquetas, consomme, and formal Madrid history with unapologetic ceremony.",
        "price": "$$",
        "priceSource": "The Infatuation / Google Maps",
        "hours": {
          "mon": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "tue": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "wed": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "thu": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "fri": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sat": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sun": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM"
        },
        "photo": "https://lhardy.com/wp-content/uploads/Lhardy-Primera-20.jpg"
      },
      {
        "id": "madrid-food-diverxo",
        "name": "DiverXO",
        "coordinates": [
          40.4585,
          -3.6856
        ],
        "description": "DiverXO is the trip-defining fine-dining entry, backed by MICHELIN's three-star rating and World's 50 Best's No. 4 placement in 2025.",
        "price": "$$",
        "priceSource": "MICHELIN Guide / World's 50 Best",
        "hours": {
          "mon": "Closed",
          "tue": "1:00 PM-6:30 PM, 7:30 PM-12:00 AM",
          "wed": "1:00 PM-6:30 PM, 7:30 PM-12:00 AM",
          "thu": "1:00 PM-6:30 PM, 7:30 PM-12:00 AM",
          "fri": "1:00 PM-6:30 PM, 7:30 PM-12:00 AM",
          "sat": "Closed",
          "sun": "Closed"
        },
        "photo": "https://diverso.it.com/assets/img/DSC_6171.jpg"
      },
      {
        "id": "madrid-food-smoked-room",
        "name": "Smoked Room",
        "coordinates": [
          40.4381,
          -3.6918
        ],
        "description": "Smoked Room is the intimate high-end alternative to DiverXO: MICHELIN gives it two stars and describes a highly exclusive, smoke-and-charcoal-focused dining room inside Hyatt Regency Hesperia Madrid.",
        "price": "$$",
        "priceSource": "MICHELIN Guide",
        "hours": {
          "mon": "Closed",
          "tue": "1:00 PM-4:00 PM, 8:30 PM-1:00 AM",
          "wed": "1:00 PM-4:00 PM, 8:30 PM-1:00 AM",
          "thu": "1:00 PM-4:00 PM, 8:30 PM-1:00 AM",
          "fri": "1:00 PM-4:00 PM, 8:30 PM-1:00 AM",
          "sat": "1:00 PM-4:00 PM, 8:30 PM-1:00 AM",
          "sun": "Closed"
        },
        "photo": "https://smokedroomrestaurants.com/wp-content/uploads/2025/07/SR_home_carrusel-2.jpg"
      }
    ],
    "sources": [
      {
        "name": "The Infatuation - Best Restaurants in Madrid",
        "url": "https://www.theinfatuation.com/madrid/guides/best-madrid-restaurants"
      },
      {
        "name": "The Infatuation - Best Tapas Spots in Madrid",
        "url": "https://www.theinfatuation.com/madrid/guides/best-tapas-spots-madrid"
      },
      {
        "name": "MICHELIN Guide - DiverXO",
        "url": "https://guide.michelin.com/us/en/comunidad-de-madrid/madrid/restaurant/diverxo"
      },
      {
        "name": "MICHELIN Guide - Smoked Room",
        "url": "https://guide.michelin.com/us/en/comunidad-de-madrid/madrid/restaurant/smoked-room"
      },
      {
        "name": "World's 50 Best Restaurants - DiverXO",
        "url": "https://www.theworlds50best.com/discovery/Establishments/Spain/Madrid/DiverXO.html"
      },
      {
        "name": "Google Maps",
        "url": "https://maps.google.com"
      }
    ]
  },
  {
    "id": "list-madrid-citywide-popular-bars",
    "slug": "madrid-best-bars-citywide",
    "seoSlug": "best-bars",
    "seoTitle": "Best Bars in Madrid",
    "seoDescription": "Best bars in Madrid, including vermouth rooms, Chueca cocktail bars, Las Letras destination drinks, Malasana clubs, and late-night Madrid institutions.",
    "title": "Vermouth, Cocktails, and Late Rooms",
    "description": "Madrid nights move easily from vermouth and wine bars to precise cocktails and loud late rooms without losing the city's street-level sociability.",
    "url": "https://www.google.com/maps/search/best+bars+madrid",
    "category": "Nightlife",
    "location": {
      "city": "Madrid",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-nightlife",
      "name": "R Nightlife",
      "avatar": "data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20"
    },
    "upvotes": 0,
    "createdAt": "2026-05-06T00:00:00.000Z",
    "stops": [
      {
        "id": "madrid-nightlife-salmon-guru",
        "name": "Salmon Guru",
        "coordinates": [
          40.4159,
          -3.6997
        ],
        "description": "Salmon Guru is Madrid's citywide cocktail showpiece, known for Diego Cabrera's inventive drinks, graphic rooms, and international bar-list attention.",
        "hours": {
          "mon": "6:00 PM-12:30 AM",
          "tue": "6:00 PM-12:30 AM",
          "wed": "6:00 PM-1:00 AM",
          "thu": "6:00 PM-1:30 AM",
          "fri": "6:00 PM-2:30 AM",
          "sat": "6:00 PM-2:30 AM",
          "sun": "6:00 PM-12:00 AM"
        },
        "photo": "https://salmonguru.es/wp-content/uploads/2024/07/mad-bunny.jpg"
      },
      {
        "id": "madrid-nightlife-angelita",
        "name": "Angelita",
        "coordinates": [
          40.4208,
          -3.7005
        ],
        "description": "Angelita combines a wine-led restaurant upstairs with a serious cocktail bar downstairs, allowing an entire Chueca evening to unfold at one address without feeling generic.",
        "hours": {
          "mon": "6:00 PM-12:30 AM",
          "tue": "6:00 PM-12:30 AM",
          "wed": "6:00 PM-1:00 AM",
          "thu": "6:00 PM-1:30 AM",
          "fri": "6:00 PM-2:30 AM",
          "sat": "6:00 PM-2:30 AM",
          "sun": "6:00 PM-12:00 AM"
        },
        "photo": "https://madrid-angelita.es/wp-content/uploads/elementor/thumbs/img5-food-qzwl3ptwk9tg7q6stw4dct91z09bj6nylbgfgsnknm.jpg"
      },
      {
        "id": "madrid-nightlife-ficus",
        "name": "Ficus Bar",
        "coordinates": [
          40.4221,
          -3.6984
        ],
        "description": "Ficus Bar gives the citywide set a newer Chueca cocktail mood: lush room, neighborhood intimacy, and drinks that feel current without the scale of the big destination bars. It is a strong bar when the night should stay stylish but not overproduced.",
        "hours": {
          "mon": "6:00 PM-12:30 AM",
          "tue": "6:00 PM-12:30 AM",
          "wed": "6:00 PM-1:00 AM",
          "thu": "6:00 PM-1:30 AM",
          "fri": "6:00 PM-2:30 AM",
          "sat": "6:00 PM-2:30 AM",
          "sun": "6:00 PM-12:00 AM"
        },
        "photo": "https://static.wixstatic.com/media/504b29_8a2a776ee62b41fcb512d06189491966~mv2.jpg/v1/fill/w_3360,h_1392,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/504b29_8a2a776ee62b41fcb512d06189491966~mv2.jpg"
      },
      {
        "id": "madrid-nightlife-1862",
        "name": "1862 Dry Bar",
        "coordinates": [
          40.4234,
          -3.7036
        ],
        "description": "1862 Dry Bar is a Malasana classic-cocktail room known for measured drinks, serious technique, and an intimate two-level setting. It favors conversation and precision over high-volume late-night energy.",
        "hours": {
          "mon": "6:00 PM-12:30 AM",
          "tue": "6:00 PM-12:30 AM",
          "wed": "6:00 PM-1:00 AM",
          "thu": "6:00 PM-1:30 AM",
          "fri": "6:00 PM-2:30 AM",
          "sat": "6:00 PM-2:30 AM",
          "sun": "6:00 PM-12:00 AM"
        },
        "photo": "https://estaticos.esmadrid.com/cdn/farfuture/f2OlWoiKmQozuxODMg8jCByoDu9gIyI31IYrKt8vme4/mtime:1593508178/sites/default/files/recursosturisticos/noche/1862_dry_bar_2.jpg"
      },
      {
        "id": "madrid-nightlife-mondo-disko",
        "name": "Mondo Disko",
        "coordinates": [
          40.4264,
          -3.7004
        ],
        "description": "Mondo Disko is an electronic club near Barcelo built around DJs, programmed nights, late hours, and a dedicated dance floor. The official calendar matters more than casual drop-in drinking.",
        "hours": {
          "mon": "Event schedule (check venue)",
          "tue": "Event schedule (check venue)",
          "wed": "Event schedule (check venue)",
          "thu": "Event schedule (check venue)",
          "fri": "Event schedule (check venue)",
          "sat": "Event schedule (check venue)",
          "sun": "Event schedule (check venue)"
        },
        "photo": "https://www.mondodisko.es/assets/images/mondo-disko-2.jpg"
      },
      {
        "id": "madrid-nightlife-toni2",
        "name": "Toni 2 Piano Bar",
        "coordinates": [
          40.421,
          -3.6976
        ],
        "description": "Toni 2 is a theatrical late-night piano bar where regulars, live playing, and audience singalongs define the room. Cocktails are secondary to participation and Madrid institution status.",
        "hours": {
          "mon": "10:00 PM-2:30 AM",
          "tue": "10:00 PM-2:30 AM",
          "wed": "10:00 PM-3:30 AM",
          "thu": "10:00 PM-4:30 AM",
          "fri": "10:00 PM-5:00 AM",
          "sat": "10:00 PM-5:00 AM",
          "sun": "10:00 PM-2:30 AM"
        },
        "photo": "https://toni2.es/wp-content/uploads/2021/09/Barra-Toni-2-madrid-scaled-e1636977700852-2048x1295.jpeg"
      }
    ],
    "sources": [
      {
        "name": "World's 50 Best Bars - Salmon Guru",
        "url": "https://www.theworlds50best.com/bars/the-list/salmon-guru.html"
      },
      {
        "name": "World's 50 Best Discovery - Angelita",
        "url": "https://www.theworlds50best.com/discovery/Establishments/Spain/Madrid/Angelita.html"
      },
      {
        "name": "Condé Nast Traveler - Best Bars in Madrid",
        "url": "https://www.cntraveler.com/gallery/best-bars-in-madrid"
      },
      {
        "name": "Condé Nast Traveler - Salmon Guru",
        "url": "https://www.cntraveler.com/bars/salmon-guru"
      },
      {
        "name": "Time Out - Ficus Bar",
        "url": "https://www.timeout.es/madrid/es/bares-y-pubs/ficus-bar"
      },
      {
        "name": "Mondo Disko official",
        "url": "https://www.mondodisko.es/en/mondo-disko/"
      },
      {
        "name": "Google Maps",
        "url": "https://maps.google.com"
      }
    ]
  },
  {
    "id": "list-madrid-citywide-stays",
    "slug": "madrid-best-hotels-citywide",
    "seoSlug": "best-hotels",
    "seoTitle": "Best Hotels in Madrid",
    "seoDescription": "Best hotels in Madrid, comparing Sol luxury, Retiro museum hotels, Chueca boutique stays, Malasana design bases, and La Latina old-city access.",
    "title": "Hotels That Match the Madrid Route",
    "description": "Madrid hotels range from polished high-end service and art-district grandeur to design-led neighborhood rooms, quiet spa stays, and old-center atmosphere. The right choice depends on whether museums, nightlife, calm, or walkable historic streets matter most.",
    "url": "https://www.google.com/maps/search/best+hotels+madrid",
    "category": "Stay",
    "location": {
      "city": "Madrid",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-stay",
      "name": "R Stay",
      "avatar": "data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20"
    },
    "upvotes": 0,
    "createdAt": "2026-05-06T00:00:00.000Z",
    "stops": [
      {
        "id": "stay-four-seasons",
        "name": "Four Seasons Hotel Madrid",
        "coordinates": [
          40.4172,
          -3.7015
        ],
        "description": "Four Seasons Hotel Madrid turns the Canalejas complex into a polished luxury property with high-touch service, destination dining, a spa, and quiet rooms. Sol, Gran Via, the Art Walk, and old Madrid remain immediately accessible.",
        "price": "$$",
        "priceSource": "Condé Nast Traveler / Google Maps",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://www.fourseasons.com/alt/img-opt/~80.1860.0,4983-553,1924-2999,5017-1687,2197/publish/content/dam/fourseasons/images/web/MMD/MMD_306_original.jpg"
      },
      {
        "id": "stay-mandarin-oriental-ritz",
        "name": "Mandarin Oriental Ritz, Madrid",
        "coordinates": [
          40.4156,
          -3.6926
        ],
        "description": "Mandarin Oriental Ritz ties Belle Epoque atmosphere and polished service to the Prado triangle and Retiro, with destination dining and museum access taking priority over nightlife at the door.",
        "price": "$$",
        "priceSource": "Mandarin Oriental / MICHELIN Guide",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://media.ffycdn.net/eu/mandarin-oriental-hotel-group/H8U5enphbFo3zGj8XfaK.jpg?mod=v1/contain=-x1000&quality=75"
      },
      {
        "id": "stay-only-you-boutique",
        "name": "Only YOU Boutique Hotel Madrid",
        "coordinates": [
          40.4235,
          -3.6964
        ],
        "description": "Only YOU Boutique Hotel Madrid occupies a restored mansion near Chueca, with bold interiors, lively public rooms, and polished service. Its central address keeps nightlife, shopping, and several metro lines close without sacrificing a proper hotel reset.",
        "price": "$$",
        "priceSource": "MICHELIN Guide / Google Maps",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://www.onlyyouhotels.com/data/webp/galeria-fotos-oyb5872.jpg-577afb9e3b5f0876d20535f0f7b9a1cd.webp"
      },
      {
        "id": "stay-urso",
        "name": "URSO Hotel & Spa Madrid",
        "coordinates": [
          40.4252,
          -3.6999
        ],
        "description": "URSO is a calm luxury hotel between Malasana, Chamberi, and Chueca, with restored interiors, polished rooms, and a spa. Central nightlife stays close while the property itself remains quiet.",
        "price": "$$",
        "priceSource": "MICHELIN Key Hotels / Google Maps",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://b4411764.smushcdn.com/4411764/wp-content/uploads/2018/10/Lobby_urso_2023-scaled.jpg?lossy=2&strip=1&webp=1"
      },
      {
        "id": "stay-edition",
        "name": "The Madrid EDITION",
        "coordinates": [
          40.4171,
          -3.7062
        ],
        "description": "The Madrid EDITION is a citywide design-hotel for central movement, rooftop energy, and a contemporary room standard in one place. It is best when the trip mixes old Madrid walks with a more polished hotel scene.",
        "price": "$$",
        "priceSource": "Condé Nast Traveler / Google Maps",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://www.editionhotels.com/wp-content/uploads/2026/03/EDT_Madrid2_23-_RGB_V1-2-scaled.jpg"
      },
      {
        "id": "stay-pestana-plaza-mayor",
        "name": "Pestana Plaza Mayor Madrid",
        "coordinates": [
          40.415,
          -3.7074
        ],
        "description": "Pestana Plaza Mayor places contemporary rooms, spa facilities, and a seasonal rooftop directly on the historic square. Old-city walkability and atmosphere come with more tourist activity than a residential district.",
        "price": "$$",
        "priceSource": "Tourism Madrid / Pestana",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://www.pestana.com/content/dam/pestana/en_us/destinations/spain/madrid/pestana-plaza-mayor/gallery/overview/pestana-plaza-mayor-gallery-surroundings-cafe-terrace.jpg"
      },
      {
        "id": "stay-seven-islas",
        "name": "7 Islas Hotel",
        "coordinates": [
          40.4217,
          -3.7012
        ],
        "description": "7 Islas Hotel is a citywide boutique hotel for a central address with an independent, art-forward rhythm. It is useful when Gran Via access, Malasana proximity, and a smaller hotel personality matter more than grand-hotel service.",
        "price": "$",
        "priceSource": "7 Islas official / Google Maps",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://www.7islashotel.com/wp-content/uploads/2026/01/7-islas-hotel-verano-2025-c-mariana-borau-87-copia-scaled.jpg"
      }
    ],
    "sources": [
      {
        "name": "Tourism Madrid - MICHELIN Key Hotels",
        "url": "https://www.esmadrid.com/en/michelin-key-hotels"
      },
      {
        "name": "Condé Nast Traveler - Madrid hotels",
        "url": "https://www.cntraveler.com/hotels/madrid"
      },
      {
        "name": "MICHELIN Guide - Only YOU Boutique Hotel Madrid",
        "url": "https://guide.michelin.com/us/en/hotels-stays/madrid/only-you-boutique-hotel-madrid-8366"
      },
      {
        "name": "Mandarin Oriental Ritz Madrid official",
        "url": "https://www.mandarinoriental.com/en/madrid"
      },
      {
        "name": "Tourism Madrid - Pestana Plaza Mayor",
        "url": "https://www.esmadrid.com/en/accommodation/pestana-plaza-mayor"
      },
      {
        "name": "Google Maps",
        "url": "https://maps.google.com"
      }
    ]
  },
  {
    "id": "list-madrid-citywide-hostels",
    "slug": "madrid-best-hostels-citywide",
    "seoSlug": "best-hostels",
    "seoTitle": "Best Hostels in Madrid",
    "seoDescription": "Best hostels in Madrid, comparing Sol, La Latina, Malasana, Chueca, Tirso de Molina, Atocha, social dorms, private rooms, and budget bases.",
    "title": "Social Beds Across the Center",
    "description": "Madrid hostels differ in social programming, central location, design, and the quality of sleep after midnight. Party-forward dorms, practical old-center beds, and polished Chueca or Prado options all offer private-room flexibility to different degrees.",
    "url": "https://www.google.com/maps/search/best+hostels+madrid",
    "category": "Stay",
    "location": {
      "city": "Madrid",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-stay",
      "name": "R Stay",
      "avatar": "data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20"
    },
    "upvotes": 0,
    "createdAt": "2026-05-06T00:00:00.000Z",
    "stops": [
      {
        "id": "stay-the-hat",
        "name": "The Hat Madrid",
        "coordinates": [
          40.4145,
          -3.7073
        ],
        "description": "The Hat Madrid is a central hostel for a recognizably social, first-visit base. The value is not quiet; it is rooftop momentum, dorm/private flexibility, and quick access to Sol, Plaza Mayor, and La Latina.",
        "price": "$",
        "priceSource": "Hostelworld / The Hat official",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://thehatmadrid.com/wp-content/uploads/slider/cache/cb3097b9f7bb39d19fd625c1017d58d6/1.the_hat-88-1.webp"
      },
      {
        "id": "stay-onefam-madrid",
        "name": "Onefam Madrid",
        "coordinates": [
          40.4287,
          -3.7039
        ],
        "description": "Onefam Madrid is a hostel for travelers who care most about built-in community, activities, and nights out. It is less about quiet lodging and more about using Malasana as a launchpad for meeting people quickly.",
        "price": "$",
        "priceSource": "Hostelworld / Google Maps",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://onefamhostels.com/wp-content/uploads/2024/09/02Onefam-Madrid-terrace2.webp"
      },
      {
        "id": "stay-2060-newton",
        "name": "2060 The Newton Hostel",
        "coordinates": [
          40.412,
          -3.7048
        ],
        "description": "2060 The Newton Hostel is the practical central all-rounder: strong walkability, rooftop energy, and easy movement between Sol, La Latina, Lavapies, and the Art Walk.",
        "price": "$",
        "priceSource": "Hostelworld / Google Maps",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://2060hostelandmarket.com/wp-content/uploads/2023/09/las-mejores-vistas-madrid-hostel-4.jpg.webp"
      },
      {
        "id": "stay-latroupe-prado",
        "name": "Latroupe Prado",
        "coordinates": [
          40.4119,
          -3.6943
        ],
        "description": "Latroupe Prado offers shared lodging near Atocha, Reina Sofia, and the museum corridor, with a bar, restaurant, coworking area, and common spaces. Rail and culture access matter more than party-street proximity.",
        "price": "$",
        "priceSource": "Latroupe official / Hostelworld",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://www.latroupe.com/data/webp/hotel1125742-fa85b6f4b8a42e52a10641a84db3f801.webp"
      },
      {
        "id": "stay-ok-hostel",
        "name": "Ok Hostel Madrid",
        "coordinates": [
          40.4113,
          -3.708
        ],
        "description": "Ok Hostel Madrid is the value hostel for Madrid's old center, La Latina, and Lavapies in one simple base. Dorms and private rooms keep it flexible, and the appeal is budget, location, and social access rather than design-hotel polish.",
        "price": "$",
        "priceSource": "Hostelworld / Google Maps",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://a.hwstatic.com/image/upload/f_auto,q_auto,h_720,c_limit,e_sharpen,e_improve,e_vibrance:60/propertyimages/9/94332/nibn7kmmmvkunz0dsq6i.jpg"
      },
      {
        "id": "stay-bastardo",
        "name": "Bastardo Hostel",
        "coordinates": [
          40.4248,
          -3.7009
        ],
        "description": "Bastardo Hostel is a design-hostel for travelers comparing dorms, privates, and a more polished social atmosphere. Its value is the Tribunal position between Malasana and Chueca, not total quiet.",
        "price": "$",
        "priceSource": "Bastardo official / Hostelworld",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://images.getaroom-cdn.com/image/upload/s--0BmdvxGV--/c_limit,e_improve,fl_lossy.immutable_cache,h_940,q_auto:good,w_940/v1770188687/7e17436d28e4641d7b45a45a79dcd38e43ee6d18?_a=BACAEuEv&atc=e7cd1cfa"
      },
      {
        "id": "stay-room00-chueca",
        "name": "room00 Chueca Hostel",
        "coordinates": [
          40.4245,
          -3.6977
        ],
        "description": "room00 Chueca Hostel is a low-cost Chueca hostel for central nightlife, shopping, and metro access without hotel pricing. Dorms, private rooms, and family rooms give it more range than a simple shared-bed hostel.",
        "price": "$",
        "priceSource": "Hostelworld / Visit Chueca",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://room00hostel.com/wp-content/uploads/2026/04/1-Doble-Superior-min.webp"
      }
    ],
    "sources": [
      {
        "name": "Hostelworld - Madrid Hostels",
        "url": "https://www.hostelworld.com/hostels/europe/spain/madrid/"
      },
      {
        "name": "The Hat Madrid official",
        "url": "https://www.thehatmadrid.com/en/"
      },
      {
        "name": "Latroupe Prado official",
        "url": "https://www.latroupe.com/en/latroupe-prado/hostel/"
      },
      {
        "name": "Hostelworld - Onefam Madrid",
        "url": "https://www.hostelworld.com/hostels/p/286369/onefam-madrid/"
      },
      {
        "name": "Hostelworld - 2060 The Newton Hostel",
        "url": "https://www.hostelworld.com/hostels/p/282289/2060-the-newton-hostel/"
      },
      {
        "name": "Hostelworld - room00 Chueca Hostel",
        "url": "https://www.hostelworld.com/st/hotels/p/83795/room007-chueca-hostel/"
      },
      {
        "name": "Google Maps",
        "url": "https://maps.google.com"
      }
    ]
  },
  {
    "id": "list-madrid-citywide-culture",
    "slug": "madrid-best-culture-citywide",
    "seoSlug": "best-culture",
    "seoTitle": "Best Culture in Madrid",
    "seoDescription": "Best culture in Madrid, connecting the Prado, Reina Sofia, Thyssen, Royal Palace, literary streets, galleries, and Retiro-area museum days.",
    "title": "Art Walk, Palace Rooms, and Literary Streets",
    "description": "Madrid's culture moves from royal collections and the major art museums to palace rooms, literary streets, contemporary exhibition spaces, and converted industrial architecture. The contrast between courtly and modern institutions is the city's real cultural strength.",
    "url": "https://www.google.com/maps/search/best+culture+madrid",
    "category": "Culture",
    "location": {
      "city": "Madrid",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-culture",
      "name": "R Culture",
      "avatar": "data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20"
    },
    "upvotes": 0,
    "createdAt": "2026-05-06T00:00:00.000Z",
    "stops": [
      {
        "id": "madrid-culture-prado",
        "name": "Museo Nacional del Prado",
        "coordinates": [
          40.4138,
          -3.6921
        ],
        "description": "Museo Nacional del Prado holds Madrid's deepest classical art collection, with Spanish, Italian, and Flemish painting from Velazquez and Goya to Bosch, Rubens, Titian, and El Greco. The visit is best understood as royal collections, religious painting, portraiture, mythology, and European art history at museum scale.",
        "hours": {
          "mon": "10:00 AM-8:00 PM",
          "tue": "10:00 AM-8:00 PM",
          "wed": "10:00 AM-8:00 PM",
          "thu": "10:00 AM-8:00 PM",
          "fri": "10:00 AM-8:00 PM",
          "sat": "10:00 AM-8:00 PM",
          "sun": "10:00 AM-7:00 PM"
        },
        "photo": "https://upload.wikimedia.org/wikipedia/commons/6/68/Museo_del_Prado_2016_%2825185969599%29.jpg"
      },
      {
        "id": "madrid-culture-reina-sofia",
        "name": "Museo Reina Sofia",
        "coordinates": [
          40.408,
          -3.694
        ],
        "description": "Museo Reina Sofia is Madrid's major modern and contemporary art museum, centered on 20th-century Spanish art and Picasso's Guernica. Its Sabatini and Nouvel buildings move from Civil War memory into Surrealism, abstraction, conceptual work, and changing contemporary exhibitions.",
        "hours": {
          "mon": "Closed",
          "tue": "10:00 AM-7:00 PM",
          "wed": "10:00 AM-7:00 PM",
          "thu": "10:00 AM-7:00 PM",
          "fri": "10:00 AM-7:00 PM",
          "sat": "10:00 AM-7:00 PM",
          "sun": "10:00 AM-7:00 PM"
        },
        "photo": "https://recursos.museoreinasofia.es/styles/large_landscape/public/Visita/sabatini.jpg.webp"
      },
      {
        "id": "madrid-culture-thyssen",
        "name": "Museo Nacional Thyssen-Bornemisza",
        "coordinates": [
          40.416,
          -3.6947
        ],
        "description": "Museo Nacional Thyssen-Bornemisza bridges the Prado and Reina Sofia with a broad private collection that moves through European painting, from medieval and Renaissance works to Impressionism, Expressionism, Pop Art, and 20th-century modernism.",
        "hours": {
          "mon": "10:00 AM-7:00 PM",
          "tue": "10:00 AM-7:00 PM",
          "wed": "10:00 AM-7:00 PM",
          "thu": "10:00 AM-7:00 PM",
          "fri": "10:00 AM-7:00 PM",
          "sat": "10:00 AM-7:00 PM",
          "sun": "10:00 AM-7:00 PM"
        },
        "photo": "https://www.esmadrid.com/sites/default/files/styles/content_type_full/public/recursosturisticos/infoturistica/museo_thyssen.jpg?itok=8LiTSzHG"
      },
      {
        "id": "madrid-culture-royal-palace",
        "name": "Royal Palace of Madrid",
        "coordinates": [
          40.4179,
          -3.7143
        ],
        "description": "The Royal Palace of Madrid is the largest palace in Western Europe and one of the largest in the world, with more than 135,000 square meters and 3,418 rooms. Its ceremonial halls, royal collections, armory, staircases, and plaza setting show centuries of Spanish dynastic history.",
        "hours": {
          "mon": "9:00 AM-8:00 PM",
          "tue": "9:00 AM-8:00 PM",
          "wed": "9:00 AM-8:00 PM",
          "thu": "9:00 AM-8:00 PM",
          "fri": "9:00 AM-8:00 PM",
          "sat": "9:00 AM-8:00 PM",
          "sun": "9:00 AM-8:00 PM"
        },
        "photo": "https://upload.wikimedia.org/wikipedia/commons/9/9b/Palacio_Real_de_Madrid_Julio_2016_%28cropped%29.jpg"
      },
      {
        "id": "madrid-culture-barrio-letras",
        "name": "Barrio de las Letras",
        "coordinates": [
          40.4143,
          -3.6986
        ],
        "description": "Barrio de las Letras is Madrid's literary quarter, where Cervantes, Lope de Vega, Quevedo, and other Golden Age writers shaped the city's cultural memory. The experience is a street-level one: engraved pavement texts, Plaza de Santa Ana, theaters, house museums, galleries, and taverns layered into a compact walk.",
        "hours": {
          "mon": "Open public space",
          "tue": "Open public space",
          "wed": "Open public space",
          "thu": "Open public space",
          "fri": "Open public space",
          "sat": "Open public space",
          "sun": "Open public space"
        },
        "photo": "https://www.entredosamores.es/insolito%20madrid/imagenes/insolito221.jpg"
      },
      {
        "id": "madrid-culture-caixaforum",
        "name": "CaixaForum Madrid",
        "coordinates": [
          40.411,
          -3.6932
        ],
        "description": "CaixaForum Madrid combines a dramatic Herzog & de Meuron power-station conversion with a vertical garden and rotating exhibitions. Its program ranges across contemporary art, photography, design, architecture, science, and cultural history, making it one of the Art Walk's most flexible exhibition spaces.",
        "hours": {
          "mon": "10:00 AM-7:00 PM",
          "tue": "10:00 AM-7:00 PM",
          "wed": "10:00 AM-7:00 PM",
          "thu": "10:00 AM-7:00 PM",
          "fri": "10:00 AM-7:00 PM",
          "sat": "10:00 AM-7:00 PM",
          "sun": "10:00 AM-7:00 PM"
        },
        "photo": "https://live.staticflickr.com/2900/14047205258_8544c9ca6c_b.jpg"
      },
      {
        "id": "madrid-culture-matadero",
        "name": "Matadero Madrid",
        "coordinates": [
          40.3913,
          -3.6972
        ],
        "description": "Matadero Madrid is a vast contemporary arts center in the former municipal slaughterhouse by Madrid Rio. Its brick pavilions now hold exhibitions, theater, cinema, design events, workshops, festivals, and experimental cultural programming on a scale that feels different from the museum triangle.",
        "hours": {
          "mon": "Closed",
          "tue": "10:00 AM-7:00 PM",
          "wed": "10:00 AM-7:00 PM",
          "thu": "10:00 AM-7:00 PM",
          "fri": "10:00 AM-7:00 PM",
          "sat": "10:00 AM-7:00 PM",
          "sun": "10:00 AM-7:00 PM"
        },
        "photo": "https://live.staticflickr.com/4301/36176921785_f5163eecec_b.jpg"
      }
    ],
    "sources": [
      {
        "name": "Tourism Madrid - Prado Museum",
        "url": "https://www.esmadrid.com/en/tourist-information/museo-del-prado"
      },
      {
        "name": "Museo Nacional del Prado - Opening Times",
        "url": "https://www.museodelprado.es/en/visit/opening-times-and-prices"
      },
      {
        "name": "Tourism Madrid - Reina Sofia Museum",
        "url": "https://www.esmadrid.com/en/tourist-information/reina-sofia-museum"
      },
      {
        "name": "Tourism Madrid",
        "url": "https://www.esmadrid.com/en"
      },
      {
        "name": "Google Maps",
        "url": "https://maps.google.com"
      }
    ]
  }
] satisfies MapList[];

const madridCheckedAt = "2026-07-16";

const madridTargetGuideIds = new Set([
  "list-madrid-sol-centro-restaurants",
  "list-madrid-sol-centro-popular-bars",
  "list-madrid-letras-restaurants",
  "list-madrid-letras-popular-bars",
  "list-madrid-retiro-restaurants",
  "list-madrid-retiro-popular-bars",
  "list-madrid-retiro-stays",
  "list-madrid-malasana-restaurants",
  "list-madrid-malasana-popular-bars",
  "list-madrid-la-latina-restaurants",
  "list-madrid-la-latina-popular-bars",
  "list-madrid-la-latina-stays",
  "list-madrid-chueca-restaurants",
  "list-madrid-chueca-popular-bars",
  "list-madrid-chueca-stays",
  "list-madrid-letras-stays",
  "list-madrid-citywide-restaurants",
  "list-madrid-citywide-stays",
]);

const madridDaily = (value: string, defaultNote?: string): GuideStop["hours"] => ({
  ...(defaultNote ? { default: defaultNote } : {}),
  mon: value,
  tue: value,
  wed: value,
  thu: value,
  fri: value,
  sat: value,
  sun: value,
});

type MadridStopRepair = Partial<GuideStop> & {
  officialUrl: string;
  statusUrl?: string;
};

const madridStopRepairs: Record<string, MadridStopRepair> = {
  "sol-food-casa-labra": {
    officialUrl: "http://www.casalabra.es/",
    statusUrl: "https://www.esmadrid.com/restaurantes/casa-labra",
    description: "Casa Labra has served fried salt cod and croquettes beside Puerta del Sol since 1860. The quick standing-bar format and focused, low-cost order make it a stronger cheap meal than the area's generic tourist menus.",
    hours: madridDaily("11:30 AM-3:30 PM; 6:30 PM-10:30 PM"),
    price: "$",
    priceSource: "Casa Labra / Tourism Madrid",
    foodServiceType: "counter_service",
    cuisineTypes: ["Madrilenian", "Tapas", "Salt cod"],
    attributeTags: ["cheap_eats", "historic", "local_specialty", "walk_in_friendly"],
  },
  "sol-food-san-gines": {
    officialUrl: "https://chocolateriasangines.com/",
    statusUrl: "https://www.google.com/maps/search/Chocolater%C3%ADa%20San%20Gin%C3%A9s",
    description: "Chocolatería San Ginés is Madrid's historic chocolate-and-churros stop near Sol, serving an inexpensive order that works for breakfast, dessert, or food after a late night. Peak-hour queues are real, but the short menu moves steadily.",
    hours: madridDaily("Open 24 hours", "The flagship Pasadizo de San Gines location operates continuously; holiday changes are published by the official venue."),
    price: "$",
    priceSource: "Chocolateria San Gines official site / Google Maps",
    foodServiceType: "cafe",
    cuisineTypes: ["Churros", "Chocolate", "Spanish"],
    attributeTags: ["cheap_eats", "24_hours", "historic", "local_specialty"],
    photo: "https://commons.wikimedia.org/wiki/Special:FilePath/Inside_the_Chocolater%C3%ADa_San_Gin%C3%A9s_in_Madrid%2C_Spain.JPG",
    imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Inside_the_Chocolater%C3%ADa_San_Gin%C3%A9s_in_Madrid%2C_Spain.JPG",
  },
  "sol-nightlife-casa-labra": {
    officialUrl: "http://www.casalabra.es/",
    statusUrl: "https://www.esmadrid.com/restaurantes/casa-labra",
    hours: madridDaily("11:30 AM-3:30 PM; 6:30 PM-10:30 PM"),
    price: "$",
    priceSource: "Casa Labra / Tourism Madrid",
    venueKind: "nightlife",
    nightlifeType: "pub",
    attributeTags: ["historic", "local_bar", "cheap_drinks", "walk_in_friendly"],
  },
  "sol-nightlife-edition-roof": {
    officialUrl: "https://www.oroyamadrid.com/en/oroya",
    statusUrl: "https://www.editionhotels.com/madrid/restaurants-and-bars/oroya/",
    hours: {
      mon: "12:00 PM-12:00 AM", tue: "12:00 PM-12:00 AM", wed: "12:00 PM-12:00 AM",
      thu: "12:00 PM-12:00 AM", fri: "12:00 PM-1:00 AM", sat: "12:00 PM-1:00 AM", sun: "12:00 PM-12:00 AM",
    },
    price: "$$$",
    priceSource: "Oroya official menu / Madrid EDITION",
    venueKind: "nightlife",
    nightlifeType: "rooftop_bar",
    attributeTags: ["rooftop", "scenic_nightlife", "premium_drinks", "date_night"],
  },
  "sol-nightlife-toni2": {
    officialUrl: "https://toni2.es/contacto/",
    statusUrl: "https://www.esmadrid.com/en/nightlife/toni-2",
    hours: {
      mon: "11:30 PM-5:30 AM", tue: "11:30 PM-5:30 AM", wed: "11:30 PM-5:30 AM",
      thu: "11:30 PM-5:30 AM", fri: "10:00 PM-6:00 AM", sat: "10:00 PM-6:00 AM", sun: "11:30 PM-5:30 AM",
    },
    price: "$$",
    priceSource: "Toni 2 official contact page / Tourism Madrid",
    venueKind: "nightlife",
    nightlifeType: "live_music_venue",
    musicGenres: ["piano", "singalong"],
    attributeTags: ["live_music", "late_late", "lively_nightlife", "local_bar"],
  },
  "sol-nightlife-josealfredo": {
    officialUrl: "https://josealfredobar.com/",
    statusUrl: "https://www.esmadrid.com/en/nightlife/josealfredo",
    hours: madridDaily("7:00 PM-3:00 AM"),
    price: "$$",
    priceSource: "Josealfredo official site / Tourism Madrid",
    venueKind: "nightlife",
    nightlifeType: "cocktail_bar",
    attributeTags: ["premium_drinks", "date_night", "late_night", "low_key_nightlife"],
  },

  "letras-nightlife-salmon-guru": {
    officialUrl: "https://salmonguru.es/",
    statusUrl: "https://salmonguru.es/",
    description: "Salmon Guru is Diego Cabrera's maximalist cocktail bar, pairing technically serious drinks with comic-book rooms, theatrical glassware, and a no-reservations queue. It is deliberately energetic rather than hushed or ceremonial.",
    hours: { mon: "4:00 PM-2:00 AM", tue: "4:00 PM-2:00 AM", wed: "4:00 PM-2:00 AM", thu: "4:00 PM-2:00 AM", fri: "4:00 PM-2:30 AM", sat: "4:00 PM-2:30 AM", sun: "4:00 PM-2:00 AM" },
    price: "$$$",
    priceSource: "Salmon Guru official cocktail menu",
    venueKind: "nightlife",
    nightlifeType: "cocktail_bar",
    attributeTags: ["world_ranked", "creative_cocktails", "no_reservations", "high_energy"],
  },
  "letras-nightlife-viva-madrid": {
    officialUrl: "https://www.vivamadrid1856.com/en/",
    statusUrl: "https://www.vivamadrid1856.com/en/",
    description: "Viva Madrid combines an 1856 tiled tavern with modern aperitif drinks and unusual cocktails from the Salmon Guru group. It is the strongest choice on this list when historic atmosphere should not mean an outdated drinks program.",
    hours: { mon: "12:00 PM-2:00 AM", tue: "12:00 PM-2:00 AM", wed: "12:00 PM-2:00 AM", thu: "12:00 PM-2:00 AM", fri: "12:00 PM-2:30 AM", sat: "12:00 PM-2:30 AM", sun: "12:00 PM-2:00 AM" },
    price: "$$$",
    priceSource: "Viva Madrid official 2026 cocktail menu",
    venueKind: "nightlife",
    nightlifeType: "cocktail_bar",
    attributeTags: ["historic", "aperitif", "creative_cocktails", "late_night"],
  },

  "letras-food-la-malontina": {
    officialUrl: "https://lamalontina.es/reservas",
    statusUrl: "https://www.esmadrid.com/en/restaurants/malontina",
    hours: {
      mon: "12:30 PM-10:30 PM", tue: "12:30 PM-10:30 PM", wed: "12:30 PM-10:30 PM",
      thu: "12:30 PM-10:30 PM", fri: "12:30 PM-11:00 PM", sat: "12:30 PM-11:00 PM", sun: "1:30 PM-10:00 PM",
    },
    foodServiceType: "restaurant", cuisineTypes: ["Spanish", "Mediterranean"],
    attributeTags: ["local_favorite", "casual", "date_night", "reservation_recommended"],
  },
  "letras-food-casa-alberto": {
    officialUrl: "https://www.casaalberto.es/reservar-casa-alberto",
    statusUrl: "https://www.esmadrid.com/en/restaurants/casa-alberto",
    hours: { mon: "Closed", tue: "12:00 PM-11:00 PM", wed: "12:00 PM-11:00 PM", thu: "12:00 PM-11:00 PM", fri: "12:00 PM-11:00 PM", sat: "12:00 PM-11:00 PM", sun: "12:00 PM-4:00 PM" },
    foodServiceType: "restaurant", cuisineTypes: ["Madrilenian", "Spanish", "Traditional"],
    attributeTags: ["historic", "local_specialty", "local_favorite", "reservation_recommended"],
  },
  "letras-food-triciclo": {
    officialUrl: "https://www.restaurantetriciclo.com/",
    statusUrl: "https://www.esmadrid.com/en/restaurants/triciclo",
    hours: { mon: "1:00 PM-4:00 PM; 8:00 PM-11:00 PM", tue: "1:00 PM-4:00 PM; 8:00 PM-11:00 PM", wed: "1:00 PM-4:00 PM; 8:00 PM-11:00 PM", thu: "1:00 PM-4:00 PM; 8:00 PM-11:00 PM", fri: "1:00 PM-4:00 PM; 8:00 PM-11:00 PM", sat: "1:00 PM-4:00 PM; 8:00 PM-11:00 PM", sun: "Closed" },
    foodServiceType: "restaurant", cuisineTypes: ["Modern Spanish", "Mediterranean"],
    attributeTags: ["date_night", "reservation_recommended", "share_plates", "local_favorite"],
  },
  "letras-food-viva-madrid": {
    officialUrl: "https://www.vivamadrid1856.com/",
    statusUrl: "https://www.esmadrid.com/en/restaurants/viva-madrid",
    hours: {
      default: "The kitchen serves daily from 12:00 PM to 1:00 AM.",
      mon: "12:00 PM-2:00 AM", tue: "12:00 PM-2:00 AM", wed: "12:00 PM-2:00 AM", thu: "12:00 PM-2:00 AM",
      fri: "12:00 PM-2:30 AM", sat: "12:00 PM-2:30 AM", sun: "12:00 PM-2:00 AM",
    },
    foodServiceType: "restaurant", cuisineTypes: ["Spanish", "Tapas"],
    attributeTags: ["historic", "lively_food", "late_night", "share_plates"],
  },

  "retiro-food-la-catapa": {
    officialUrl: "https://tabernalacatapa.com/",
    statusUrl: "https://tabernalacatapa.com/",
    hours: { default: "The official June and July timetable closes dining at 8:00 PM and the kitchen at 7:00 PM.", mon: "Closed", tue: "12:00 PM-8:00 PM", wed: "12:00 PM-8:00 PM", thu: "12:00 PM-8:00 PM", fri: "12:00 PM-8:00 PM", sat: "12:00 PM-8:00 PM", sun: "Closed" },
    foodServiceType: "restaurant", cuisineTypes: ["Spanish", "Tapas"],
    attributeTags: ["local_favorite", "share_plates", "casual", "reservation_recommended"],
  },
  "retiro-food-kulto": {
    officialUrl: "https://kulto.es/",
    statusUrl: "https://www.esmadrid.com/restaurantes/kulto",
    hours: { mon: "Closed", tue: "Closed", wed: "1:00 PM-11:00 PM", thu: "1:00 PM-11:00 PM", fri: "1:00 PM-11:00 PM", sat: "1:00 PM-11:00 PM", sun: "1:00 PM-11:00 PM" },
    foodServiceType: "restaurant", cuisineTypes: ["Andalusian", "Modern Spanish"],
    attributeTags: ["date_night", "seafood", "reservation_recommended", "local_favorite"],
  },
  "retiro-food-florida": {
    officialUrl: "https://www.floridapark.es/en/el-pabellon/info",
    statusUrl: "https://www.floridapark.es/en/el-pabellon/info",
    hours: madridDaily("12:00 PM-4:00 PM; 8:00 PM-11:00 PM", "These are El Pabellon's official kitchen hours; Florida Park's wider entertainment complex remains open later."),
    foodServiceType: "restaurant", cuisineTypes: ["Spanish", "Mediterranean"],
    attributeTags: ["scenic_food", "group_friendly", "lively_food", "reservation_recommended"],
  },
  "retiro-food-perro-galleta": {
    officialUrl: "https://elperroylagalleta.com/locales/restaurante-en-retiro/",
    statusUrl: "https://www.esmadrid.com/en/restaurants/perro-y-la-galleta-retiro",
    hours: { mon: "1:00 PM-1:00 AM", tue: "1:00 PM-1:00 AM", wed: "1:00 PM-1:00 AM", thu: "1:00 PM-1:00 AM", fri: "1:00 PM-1:00 AM", sat: "10:00 AM-1:00 AM", sun: "10:00 AM-1:00 AM" },
    foodServiceType: "restaurant", cuisineTypes: ["Mediterranean", "Modern Spanish"],
    attributeTags: ["casual", "group_friendly", "family_friendly_food", "reservation_recommended"],
    photo: "https://elperroylagalleta.com/wp-content/uploads/2025/03/Cenas-con-Encanto.jpg",
    imageSourceUrl: "https://elperroylagalleta.com/locales/restaurante-en-retiro/",
  },
  "retiro-nightlife-florida": {
    officialUrl: "https://www.floridapark.es/en/",
    statusUrl: "https://www.floridapark.es/en/agenda",
    description: "Florida Retiro combines cocktails, dining, music, and scheduled events across several spaces inside the park. Choose it for a broad social night with a scenic setting; the official agenda determines which room and programme are active.",
    hours: { mon: "6:00 PM-12:30 AM", tue: "6:00 PM-12:30 AM", wed: "6:00 PM-1:00 AM", thu: "6:00 PM-1:30 AM", fri: "6:00 PM-2:30 AM", sat: "6:00 PM-2:30 AM", sun: "6:00 PM-12:00 AM", default: "La Galeria, El Pabellon, and club programming follow the dated official Florida Park agenda; restaurant service hours are listed by space." },
    price: "$$$",
    priceSource: "Florida Park official menus",
    venueKind: "nightlife",
    nightlifeType: "cocktail_bar",
    attributeTags: ["cocktails", "live_programme", "park_setting", "reservations"],
  },
  "retiro-nightlife-ramses": {
    officialUrl: "https://ramseslife.com/en",
    statusUrl: "https://www.esmadrid.com/en/restaurants/ramses",
    description: "Ramses serves signature cocktails across a year-round terrace and design-led rooms facing Puerta de Alcala. The landmark setting and full food programme make it a polished, expensive all-evening option rather than an intimate specialist bar.",
    hours: { mon: "12:00 PM-2:00 AM", tue: "12:00 PM-2:00 AM", wed: "12:00 PM-2:00 AM", thu: "12:00 PM-2:00 AM", fri: "12:00 PM-2:30 AM", sat: "12:00 PM-2:30 AM", sun: "12:00 PM-2:00 AM" },
    price: "$$$",
    priceSource: "Ramses official menus / Tourism Madrid",
    venueKind: "nightlife",
    nightlifeType: "cocktail_bar",
    attributeTags: ["cocktails", "landmark_view", "terrace", "premium"],
  },

  "malasana-food-playing-solo": {
    officialUrl: "https://playingsolorestaurant.com/",
    statusUrl: "https://guide.michelin.com/es/es/comunidad-de-madrid/madrid/restaurante/playing-solo",
    hours: { mon: "Closed", tue: "8:00 PM-11:00 PM", wed: "8:00 PM-11:00 PM", thu: "8:00 PM-11:00 PM", fri: "8:00 PM-11:00 PM", sat: "8:00 PM-11:00 PM", sun: "Closed" },
    price: "$$$", priceSource: "Playing Solo official tasting menus / MICHELIN Guide",
    foodServiceType: "restaurant", cuisineTypes: ["Japanese", "French", "Contemporary"],
    attributeTags: ["tasting_menu", "counter_seating", "fine_dining", "reservation_required"],
  },
  "malasana-food-aredna": {
    officialUrl: "https://arednarestaurante.com/",
    statusUrl: "https://www.esmadrid.com/en/restaurants/aredna",
    hours: madridDaily("1:00 PM-1:00 AM"),
    foodServiceType: "restaurant", cuisineTypes: ["Mediterranean", "Modern Spanish"],
    attributeTags: ["date_night", "reservation_recommended", "central", "local_favorite"],
  },
  "malasana-food-ojala": {
    officialUrl: "https://grupolamusa.com/restaurante-ojala/",
    statusUrl: "https://www.esmadrid.com/en/restaurants/ojala",
    foodServiceType: "restaurant", cuisineTypes: ["International", "Mediterranean", "Brunch"],
    attributeTags: ["brunch", "group_friendly", "lively_food", "casual"],
  },
  "malasana-food-la-musa": {
    officialUrl: "https://grupolamusa.com/restaurante-musa-malasana/",
    statusUrl: "https://grupolamusa.com/restaurante-musa-malasana/",
    hours: { mon: "1:00 PM-12:00 AM", tue: "1:00 PM-12:00 AM", wed: "1:00 PM-12:00 AM", thu: "1:00 PM-12:30 AM", fri: "1:00 PM-1:00 AM", sat: "1:00 PM-1:00 AM", sun: "1:00 PM-12:00 AM" },
    foodServiceType: "restaurant", cuisineTypes: ["Mediterranean", "Spanish"],
    attributeTags: ["share_plates", "group_friendly", "casual", "lively_food"],
    photo: "https://grupolamusa.com/wp-content/uploads/2025/11/Musa-Malasana-1.webp",
    imageSourceUrl: "https://grupolamusa.com/restaurante-musa-malasana/",
  },
  "malasana-nightlife-1862": {
    officialUrl: "https://www.instagram.com/1862drybar/",
    statusUrl: "https://www.diffordsguide.com/bars/9NMA67/1862-dry-bar",
    description: "1862 Dry Bar is Malasana's classic-cocktail specialist, favoring measured technique, familiar structures, and a calm historic room over theatrical presentation. It remains a useful reference point for drinkers who want the classics made correctly.",
    price: "$$$",
    priceSource: "1862 Dry Bar official menu / Difford's Guide",
    venueKind: "nightlife",
    nightlifeType: "cocktail_bar",
    attributeTags: ["classic_cocktails", "historic_room", "low_key_nightlife", "malasana"],
  },

  "latina-food-juana-loca": {
    officialUrl: "https://www.juanalaloca.es/",
    statusUrl: "https://www.esmadrid.com/en/restaurants/juana-loca",
    description: "Juana La Loca's tortilla and pintxos remain popular, but the restaurant no longer operates at its former La Latina address. This listing points to the current Recoletos location and treats it as a moderately priced shared-plate stop rather than a bargain tavern.",
    coordinates: [40.4218737, -3.6902566],
    hours: madridDaily("1:00 PM-5:00 PM; 8:00 PM-12:00 AM"),
    price: "$$",
    priceSource: "Tourism Madrid (EUR 16-30)",
    foodServiceType: "restaurant",
    cuisineTypes: ["Spanish", "Pintxos", "Tortilla"],
    attributeTags: ["tortilla", "share_plates", "current_location", "reservations"],
  },
  "latina-food-mercado-cebada": {
    officialUrl: "http://www.mercadodelacebada.com/",
    statusUrl: "https://www.madrid.es/portales/munimadrid/es/Mercado-municipal-de-la-Cebada/?vgnextchannel=60e7c5dee78fe410VgnVCM1000000b205a0aRCRD&vgnextfmt=default&vgnextoid=7a47e1635561c010VgnVCM1000000b205a0aRCRD",
    description: "Mercado de la Cebada is a working La Latina market where produce stalls and prepared-food counters offer a cheaper, less polished alternative to Madrid's destination food halls. Individual stall hours vary inside the municipal market schedule.",
    hours: { mon: "9:00 AM-2:00 PM; 5:00 PM-8:30 PM", tue: "9:00 AM-2:00 PM; 5:00 PM-8:30 PM", wed: "9:00 AM-2:00 PM; 5:00 PM-8:30 PM", thu: "9:00 AM-2:00 PM; 5:00 PM-8:30 PM", fri: "9:00 AM-2:00 PM; 5:00 PM-8:30 PM", sat: "9:00 AM-6:00 PM", sun: "Closed", default: "The first Sunday of each month opens 11:00 AM-5:00 PM; individual food stalls may keep shorter hours." },
    price: "$",
    priceSource: "Madrid municipal market listings",
    foodServiceType: "stall",
    cuisineTypes: ["Market food", "Spanish", "Tapas"],
    attributeTags: ["cheap_eats", "market", "local_shopping", "mixed_appetites"],
  },
  "latina-nightlife-viajero": {
    officialUrl: "https://www.elviajeromadrid.com/",
    statusUrl: "https://www.elviajeromadrid.com/",
    description: "El Viajero spreads La Latina nightlife across a street-level restaurant and an upper terrace with neighborhood roof views. It is a social food-and-drink roof rather than a panoramic hotel sky bar, which also keeps the experience more casual.",
    price: "$$",
    priceSource: "El Viajero official menu",
    venueKind: "nightlife",
    nightlifeType: "rooftop_bar",
    attributeTags: ["rooftop", "casual", "food", "la_latina"],
  },

  "chueca-food-angelita": {
    officialUrl: "https://madrid-angelita.es/es/",
    statusUrl: "https://www.esmadrid.com/en/restaurants/angelita-madrid",
    hours: { mon: "5:30 PM-12:30 AM", tue: "5:30 PM-12:30 AM", wed: "5:30 PM-12:30 AM", thu: "5:30 PM-12:30 AM", fri: "5:30 PM-12:30 AM", sat: "Closed", sun: "Closed" },
    foodServiceType: "restaurant", cuisineTypes: ["Modern Spanish", "Wine-led"],
    attributeTags: ["date_night", "wine", "reservation_recommended", "local_favorite"],
  },
  "chueca-food-mercado-san-anton": {
    officialUrl: "https://www.mercadosananton.com/",
    statusUrl: "https://www.madrid.es/portales/munimadrid/es/Inicio/Actividad-economica-y-hacienda/Comercio-y-mercados/Mercado-municipal-de-San-Anton/",
    hours: {
      default: "Market counters run Monday-Saturday 10:00 AM-10:00 PM; dining floors keep the later hours below.",
      mon: "10:00 AM-12:00 AM", tue: "10:00 AM-12:00 AM", wed: "10:00 AM-12:00 AM", thu: "10:00 AM-12:00 AM",
      fri: "10:00 AM-1:30 AM", sat: "10:00 AM-1:30 AM", sun: "10:00 AM-12:00 AM",
    },
    foodServiceType: "stall", cuisineTypes: ["Spanish", "International", "Market food"],
    attributeTags: ["market", "group_friendly", "share_plates", "walk_in_friendly"],
  },
  "chueca-food-dstage": {
    officialUrl: "https://www.dstageconcept.com/",
    statusUrl: "https://guide.michelin.com/es/es/comunidad-de-madrid/madrid/restaurante/dstage",
    hours: { mon: "Closed", tue: "8:30 PM-11:30 PM", wed: "8:30 PM-11:30 PM", thu: "8:30 PM-11:30 PM", fri: "1:30 PM-4:00 PM; 8:30 PM-11:30 PM", sat: "1:30 PM-4:00 PM; 8:30 PM-11:30 PM", sun: "Closed" },
    foodServiceType: "restaurant", cuisineTypes: ["Contemporary", "Modern Spanish"],
    attributeTags: ["fine_dining", "tasting_menu", "destination_dining", "reservation_required"],
  },
  "chueca-food-kuoco": {
    officialUrl: "https://kuoco360food.wixsite.com/kuoco",
    statusUrl: "https://www.esmadrid.com/restaurantes/kuoco-360o-food",
    hours: { mon: "Closed", tue: "1:30 PM-4:00 PM; 8:30 PM-11:30 PM", wed: "1:30 PM-4:00 PM; 8:30 PM-11:30 PM", thu: "1:30 PM-4:00 PM; 8:30 PM-11:30 PM", fri: "1:30 PM-4:00 PM; 8:30 PM-11:30 PM", sat: "1:30 PM-4:00 PM; 8:30 PM-11:30 PM", sun: "1:30 PM-4:00 PM; 8:30 PM-11:30 PM" },
    foodServiceType: "restaurant", cuisineTypes: ["Latin American", "Asian", "Fusion"],
    attributeTags: ["date_night", "share_plates", "reservation_recommended", "local_favorite"],
    photo: "https://static.wixstatic.com/media/2768e0_5436d6cc2a7a49df8b261ccbbe5f4ea4%7Emv2.jpg/v1/fit/w_2500,h_1330,al_c/2768e0_5436d6cc2a7a49df8b261ccbbe5f4ea4%7Emv2.jpg",
    imageSourceUrl: "https://kuoco360food.wixsite.com/kuoco",
  },
  "chueca-nightlife-angelita": {
    officialUrl: "https://madrid-angelita.es/es/",
    statusUrl: "https://www.esmadrid.com/en/nightlife/angelita-madrid",
    description: "Angelita's basement cocktail bar uses produce from the owners' family allotment, while the floors above add a deep wine list and food. The current programme runs Monday through Friday, making this a weekday destination rather than a weekend fallback.",
    hours: { mon: "5:30 PM-2:00 AM", tue: "5:30 PM-2:00 AM", wed: "5:30 PM-2:00 AM", thu: "5:30 PM-2:00 AM", fri: "5:30 PM-2:00 AM", sat: "Closed", sun: "Closed" },
    price: "$$$",
    priceSource: "Angelita official menu / Tourism Madrid",
    venueKind: "nightlife",
    nightlifeType: "cocktail_bar",
    attributeTags: ["produce_driven", "world_ranked", "wine", "weekday_only"],
  },
  "chueca-nightlife-ficus": {
    officialUrl: "https://www.ficusbar.com/contact",
    statusUrl: "https://www.ficusbar.com/contact",
    description: "Ficus Bar brings a plant-filled, maximalist room and modern cocktails to Salesas. It does not accept reservations, so its long weekend opening window works best for flexible drinkers who can arrive before the room peaks.",
    hours: { mon: "6:00 PM-1:00 AM", tue: "6:00 PM-1:00 AM", wed: "5:00 PM-2:00 AM", thu: "5:00 PM-2:00 AM", fri: "3:30 PM-2:30 AM", sat: "3:30 PM-2:30 AM", sun: "4:00 PM-1:00 AM" },
    price: "$$$",
    priceSource: "Ficus Bar official menu",
    venueKind: "nightlife",
    nightlifeType: "cocktail_bar",
    attributeTags: ["creative_cocktails", "no_reservations", "salesas", "design"],
  },
  "chueca-nightlife-museo-chicote": {
    officialUrl: "https://www.museochicote.com/",
    statusUrl: "https://www.museochicote.com/en/menu/",
    description: "Museo Chicote preserves the mirrored Gran Via room opened by Perico Chicote in 1931 while continuing to serve classics and current house cocktails. Go for history and atmosphere with a real bar programme, not for a quiet modern speakeasy.",
    price: "$$$",
    priceSource: "Museo Chicote official menu",
    venueKind: "nightlife",
    nightlifeType: "cocktail_bar",
    attributeTags: ["historic", "classic_cocktails", "gran_via", "reservations"],
  },

  "stay-four-seasons": { officialUrl: "https://www.fourseasons.com/madrid/", lodgingType: "hotel", attributeTags: ["luxury", "spa", "central", "fine_dining"] },
  "stay-mandarin-oriental-ritz": { officialUrl: "https://www.mandarinoriental.com/en/madrid/hotel-ritz", lodgingType: "hotel", attributeTags: ["luxury", "historic", "museums", "fine_dining"] },
  "stay-only-you-boutique": { officialUrl: "https://www.onlyyouhotels.com/en/hotels/only-you-boutique-hotel-madrid/", lodgingType: "hotel", attributeTags: ["design", "luxury", "central", "nightlife"] },
  "stay-room-mate-oscar": { officialUrl: "https://room-matehotels.com/gb/hotel-oscar-madrid/", lodgingType: "hotel", attributeTags: ["design", "rooftop", "central", "lively"] },
  "stay-westin-palace": {
    officialUrl: "https://www.thepalacehotelmadrid.com/",
    name: "The Palace, a Luxury Collection Hotel, Madrid",
    description: "The Palace is the landmark Art Walk hotel beneath a restored stained-glass dome, with the Prado and Thyssen museums a short walk away. Choose it for historic grandeur, fully renovated rooms, polished service, and a cultural itinerary centered on the UNESCO-listed Paseo del Prado.",
    priceSource: "The Palace official site",
    lodgingType: "hotel",
    attributeTags: ["luxury", "historic", "museums", "fine_dining"],
  },
  "stay-posada-leon": {
    officialUrl: "https://posadadelleondeoro.com/en/inicio-english/",
    description: "Posada del Leon de Oro is a small historic hotel on La Latina's Cava Baja, operating as lodging since 1880. Choose it for old-city character, immediate tapas access, and a more intimate base than Madrid's large luxury hotels.",
    priceSource: "Posada del Leon de Oro official site",
    lodgingType: "hotel",
    attributeTags: ["historic", "boutique", "local_character", "walkable"],
  },
  "stay-brach": { officialUrl: "https://brachmadrid.com/", lodgingType: "hotel", attributeTags: ["luxury", "design", "wellness", "central"] },
  "stay-hotel-urban": { officialUrl: "https://www.hotelurban.com/", lodgingType: "hotel", attributeTags: ["luxury", "rooftop", "design", "central"] },
  "stay-urso": { officialUrl: "https://hotelurso.com/", lodgingType: "hotel", attributeTags: ["luxury", "wellness", "quiet", "design"] },
  "stay-edition": { officialUrl: "https://www.editionhotels.com/madrid/", lodgingType: "hotel", attributeTags: ["luxury", "design", "rooftop", "central"] },
  "stay-pestana-plaza-mayor": { officialUrl: "https://www.pestana.com/uk/hotel/pestana-madrid-plaza-mayor", lodgingType: "hotel", attributeTags: ["historic_center", "spa", "rooftop", "walkable"] },
  "stay-seven-islas": {
    officialUrl: "https://www.esmadrid.com/alojamientos/siete-islas-hotel",
    statusUrl: "https://www.esmadrid.com/alojamientos/siete-islas-hotel",
    priceSource: "Tourism Madrid",
    lodgingType: "hotel",
    attributeTags: ["boutique", "design", "central", "independent"],
  },

  "madrid-food-casa-dani": {
    officialUrl: "https://casadani.es/contacto",
    statusUrl: "https://www.mercadodelapaz.com/portfolio/54-casa-dani-bar-restaurante/",
    description: "Casa Dani is the busy Mercado de la Paz counter for tortilla de patatas, croquetas, and straightforward Madrid market cooking, served from early morning through the market day.",
    hours: { mon: "7:00 AM-8:00 PM", tue: "7:00 AM-8:00 PM", wed: "7:00 AM-8:00 PM", thu: "7:00 AM-8:00 PM", fri: "7:00 AM-8:00 PM", sat: "7:00 AM-5:00 PM", sun: "Closed" },
    priceSource: "Casa Dani official menu / Mercado de la Paz",
    foodServiceType: "counter_service", cuisineTypes: ["Spanish", "Madrilenian"],
    attributeTags: ["market", "local_specialty", "walk_in_friendly", "casual"],
    imageSourceUrl: "https://casadani.es/",
  },
  "madrid-food-la-malontina": {
    officialUrl: "https://lamalontina.es/reservas",
    statusUrl: "https://www.esmadrid.com/en/restaurants/malontina",
    description: "La Malontina is a small Barrio de las Letras dining room serving seasonal Spanish and Mediterranean plates, with an intimate scale that suits a quiet lunch or dinner.",
    hours: { mon: "12:30 PM-10:30 PM", tue: "12:30 PM-10:30 PM", wed: "12:30 PM-10:30 PM", thu: "12:30 PM-10:30 PM", fri: "12:30 PM-11:00 PM", sat: "12:30 PM-11:00 PM", sun: "1:30 PM-10:00 PM" },
    foodServiceType: "restaurant", cuisineTypes: ["Spanish", "Mediterranean"],
    attributeTags: ["local_favorite", "casual", "date_night", "reservation_recommended"],
  },
  "madrid-food-angelita": {
    officialUrl: "https://madrid-angelita.es/es/",
    statusUrl: "https://www.esmadrid.com/en/restaurants/angelita-madrid",
    hours: { mon: "5:30 PM-12:30 AM", tue: "5:30 PM-12:30 AM", wed: "5:30 PM-12:30 AM", thu: "5:30 PM-12:30 AM", fri: "5:30 PM-12:30 AM", sat: "Closed", sun: "Closed" },
    foodServiceType: "restaurant", cuisineTypes: ["Modern Spanish", "Wine-led"],
    attributeTags: ["date_night", "wine", "reservation_recommended", "local_favorite"],
  },
  "madrid-food-playing-solo": {
    officialUrl: "https://playingsolorestaurant.com/",
    statusUrl: "https://guide.michelin.com/es/es/comunidad-de-madrid/madrid/restaurante/playing-solo",
    hours: { mon: "Closed", tue: "8:00 PM-11:00 PM", wed: "8:00 PM-11:00 PM", thu: "8:00 PM-11:00 PM", fri: "8:00 PM-11:00 PM", sat: "8:00 PM-11:00 PM", sun: "Closed" },
    price: "$$$", priceSource: "Playing Solo official tasting menus / MICHELIN Guide",
    foodServiceType: "restaurant", cuisineTypes: ["Japanese", "French", "Contemporary"],
    attributeTags: ["tasting_menu", "counter_seating", "fine_dining", "reservation_required"],
  },
  "madrid-food-lhardy": { officialUrl: "https://lhardy.com/", statusUrl: "https://www.esmadrid.com/en/restaurants/lhardy", foodServiceType: "restaurant", cuisineTypes: ["Madrilenian", "Traditional Spanish"], attributeTags: ["historic", "local_specialty", "reservation_recommended"] },
  "madrid-food-diverxo": {
    officialUrl: "https://diverxo.com/",
    statusUrl: "https://guide.michelin.com/es/es/comunidad-de-madrid/madrid/restaurante/diverxo",
    description: "Dabiz Muñoz's DiverXO serves a long, theatrical tasting menu that moves between Spanish, Asian, and global references in a surreal dining room near Castellana.",
    price: "$$$", priceSource: "DiverXO official tasting menu / MICHELIN Guide",
    foodServiceType: "restaurant", cuisineTypes: ["Creative", "Fusion"],
    attributeTags: ["fine_dining", "tasting_menu", "destination_dining", "reservation_required"],
    photo: "https://diverxo.com/wp-content/uploads/2021/12/xo-obra-opt.webp",
    imageSourceUrl: "https://diverxo.com/",
  },
  "madrid-food-smoked-room": {
    officialUrl: "https://smokedroom.com/madrid/",
    statusUrl: "https://guide.michelin.com/es/es/comunidad-de-madrid/madrid/restaurante/smoked-room",
    description: "Smoked Room is an intimate counter restaurant inside Hyatt Regency Hesperia Madrid, building its tasting menu around fire, smoke, charcoal, and closely watched grill work.",
    price: "$$$", priceSource: "Smoked Room official tasting menu / MICHELIN Guide",
    foodServiceType: "restaurant", cuisineTypes: ["Japanese", "Grill", "Contemporary"],
    attributeTags: ["fine_dining", "tasting_menu", "counter_seating", "reservation_required"],
  },
};

const madridFoodSources: ListSource[] = [
  { name: "Tourism Madrid - Gastronomy", url: "https://www.esmadrid.com/en/gastronomy" },
  { name: "Tourism Madrid - Michelin-starred restaurants", url: "https://www.esmadrid.com/en/michelin-starred-restaurants" },
  { name: "MICHELIN Guide - Madrid restaurants", url: "https://guide.michelin.com/us/en/comunidad-de-madrid/madrid/restaurants" },
  { name: "Guia Repsol - Madrid restaurants", url: "https://www.guiarepsol.com/es/comer/restaurantes/madrid/" },
  { name: "The Infatuation - Best Madrid restaurants", url: "https://www.theinfatuation.com/madrid/guides/best-madrid-restaurants" },
  { name: "Time Out Madrid - Best restaurants", url: "https://www.timeout.es/madrid/es/restaurantes/los-100-mejores-restaurantes-de-madrid-top-100" },
  { name: "Conde Nast Traveler - Madrid restaurants", url: "https://www.cntraveler.com/gallery/best-restaurants-in-madrid" },
  { name: "Madrid municipal markets", url: "https://www.madrid.es/portales/munimadrid/es/Inicio/Actividad-economica-y-hacienda/Comercio-y-mercados/" },
  { name: "Google Maps", url: "https://maps.google.com" },
  { name: "OpenStreetMap Madrid", url: "https://www.openstreetmap.org/relation/5326784" },
];

const madridNightlifeSources: ListSource[] = [
  { name: "Tourism Madrid - Nightlife", url: "https://www.esmadrid.com/en/nightlife" },
  { name: "Tourism Madrid - Cocktail bars", url: "https://www.esmadrid.com/en/madrid-nightlife-areas" },
  { name: "Time Out Madrid - Bars", url: "https://www.timeout.es/madrid/es/bares-y-pubs" },
  { name: "World's 50 Best Bars", url: "https://www.worlds50bestbars.com/list/1-50" },
  { name: "Conde Nast Traveler - Madrid bars", url: "https://www.cntraveler.com/gallery/best-bars-in-madrid" },
  { name: "Madrid EDITION dining", url: "https://www.editionhotels.com/madrid/restaurants-and-bars/" },
  { name: "Toni 2 official", url: "https://toni2.es/" },
  { name: "Josealfredo official", url: "https://josealfredobar.com/" },
  { name: "Google Maps", url: "https://maps.google.com" },
  { name: "OpenStreetMap Madrid", url: "https://www.openstreetmap.org/relation/5326784" },
];

const madridStaySources: ListSource[] = [
  { name: "Tourism Madrid - Accommodation", url: "https://www.esmadrid.com/en/accommodation" },
  { name: "Conde Nast Traveler - Best Madrid hotels", url: "https://www.cntraveler.com/gallery/best-hotels-in-madrid" },
  { name: "MICHELIN Guide - Madrid hotels", url: "https://guide.michelin.com/us/en/hotels-stays/madrid" },
  { name: "Forbes Travel Guide - Madrid", url: "https://www.forbestravelguide.com/destinations/madrid-spain" },
  { name: "Booking.com - Madrid", url: "https://www.booking.com/city/es/madrid.html" },
  { name: "Tripadvisor - Madrid hotels", url: "https://www.tripadvisor.com/Hotels-g187514-Madrid-Hotels.html" },
  { name: "Only YOU Boutique Hotel Madrid", url: "https://www.onlyyouhotels.com/en/hotels/only-you-boutique-hotel-madrid/" },
  { name: "Room Mate Oscar", url: "https://room-matehotels.com/en/oscar/" },
  { name: "Brach Madrid", url: "https://brachmadrid.com/" },
  { name: "Google Maps", url: "https://maps.google.com" },
];

const madridCitywideAdditions: GuideStop[] = [
  {
    id: "madrid-food-sala-despiece",
    name: "Sala de Despiece",
    coordinates: [40.43894, -3.69923],
    description: "Sala de Despiece moved its original Chamberi restaurant to Alonso Cano in 2024, keeping the butcher-room design, long counter, and precise plates built around seasonal vegetables, fish, and meat.",
    hours: { mon: "1:30 PM-5:00 PM; 8:00 PM-11:45 PM", tue: "1:30 PM-5:00 PM; 8:00 PM-11:45 PM", wed: "1:30 PM-5:00 PM; 8:00 PM-11:45 PM", thu: "1:30 PM-5:00 PM; 8:00 PM-11:45 PM", fri: "1:00 PM-5:00 PM; 8:00 PM-11:45 PM", sat: "1:00 PM-5:00 PM; 8:00 PM-11:45 PM", sun: "1:00 PM-5:00 PM; 8:00 PM-11:45 PM" },
    price: "$$", priceSource: "Sala de Despiece official site / Tourism Madrid (EUR 16-30)",
    officialUrl: "https://saladedespiece.com/", bookingUrl: "https://saladedespiece.com/",
    venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["Tapas", "Modern Spanish"],
    attributeTags: ["counter_seating", "share_plates", "lively_food", "reservation_recommended"],
    photo: "https://s2.abcstatics.com/abc/www/multimedia/gastronomia/2025/04/04/sala-despiece-1-U02107046745zXJ-760x427%40diario_abc.jpg",
    imageSourceUrl: "https://www.abc.es/gastronomia/sala-despiece-alonso-cano-madrid-londres-aperturas-restaurantes-20250404194746-nt.html",
  },
  {
    id: "madrid-food-la-tasqueria",
    name: "La Tasqueria",
    coordinates: [40.44367, -3.69604],
    description: "Javi Estevez treats Madrid's offal tradition as modern fine dining at La Tasqueria, where tasting menus turn cheeks, trotters, tripe, and lesser-used cuts into carefully judged courses.",
    hours: { mon: "1:30 PM-3:30 PM; 7:30 PM-10:30 PM", tue: "1:30 PM-3:30 PM; 7:30 PM-10:30 PM", wed: "1:30 PM-3:30 PM; 7:30 PM-10:30 PM", thu: "1:30 PM-3:30 PM; 7:30 PM-10:30 PM", fri: "1:30 PM-3:30 PM; 8:30 PM-10:30 PM", sat: "1:30 PM-3:30 PM", sun: "Closed" },
    price: "$$$", priceSource: "La Tasqueria official menus / Tourism Madrid (EUR 60+)",
    officialUrl: "https://latasqueria.com/", bookingUrl: "https://latasqueria.com/",
    venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["Madrilenian", "Offal", "Contemporary"],
    attributeTags: ["fine_dining", "tasting_menu", "local_specialty", "reservation_required"],
    photo: "https://latasqueria.com/wp-content/uploads/2024/07/la-tasqueria-2024-home-portada.jpg",
    imageSourceUrl: "https://latasqueria.com/",
  },
  {
    id: "madrid-food-casa-lucio",
    name: "Casa Lucio",
    coordinates: [40.41218, -3.7114],
    description: "Casa Lucio occupies a centuries-old Cava Baja dining room and remains a reference for traditional Madrid cooking, especially huevos rotos, roasts, fish, and old-school table service.",
    hours: madridDaily("1:00 PM-4:00 PM; 8:00 PM-11:45 PM", "The restaurant closes for the full month of August under its official seasonal schedule."),
    price: "$$$", priceSource: "Casa Lucio official menu / Tourism Madrid",
    officialUrl: "https://casalucio.es/es/contacto/", bookingUrl: "https://casalucio.es/es/contacto/",
    venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["Madrilenian", "Traditional Spanish"],
    attributeTags: ["historic", "local_specialty", "classic", "reservation_recommended"],
    photo: "https://casalucio.es/wp-content/uploads/2015/09/local_01.jpg",
    imageSourceUrl: "https://casalucio.es/es/el-local/",
  },
];

function uniqueMadridSources(sources: ListSource[]) {
  return [...new Map(sources.filter((source) => /^https?:\/\//i.test(source.url)).map((source) => [source.url, source])).values()];
}

function repairMadridGuide(list: MapList): MapList {
  if (!madridTargetGuideIds.has(list.id)) return list;

  const seedStops = list.id === "list-madrid-citywide-restaurants"
    ? [...list.stops, ...madridCitywideAdditions]
    : list.stops;

  const stops = seedStops.map((stop) => {
    const repair = madridStopRepairs[stop.id] ?? {};
    const officialUrl = repair.officialUrl ?? stop.officialUrl ?? stop.bookingUrl;
    if (!officialUrl) return stop;
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${stop.coordinates[0]},${stop.coordinates[1]}`)}`;
    const statusUrl = repair.statusUrl ?? officialUrl;
    const imageSourceUrl = repair.imageSourceUrl ?? stop.imageSourceUrl ?? officialUrl;
    const categoryDefaults: Partial<GuideStop> = list.category === "Food"
      ? { venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["Spanish"], attributeTags: ["central", "reservation_recommended"] }
      : list.category === "Nightlife"
        ? { venueKind: "nightlife", nightlifeType: "other", attributeTags: ["central", "lively_nightlife"] }
        : {
            venueKind: "lodging",
            lodgingType: "hotel",
            hours: madridDaily("Open 24 hours", "Guest operations run continuously; check-in and amenity times are controlled by the official property page."),
            bookingUrl: officialUrl,
            attributeTags: ["central", "design"],
          };

    return {
      ...stop,
      ...categoryDefaults,
      ...repair,
      officialUrl,
      ...(list.category === "Stay" ? { bookingUrl: repair.bookingUrl ?? officialUrl } : {}),
      imageSourceUrl,
      sourceUrls: [...new Set([...(stop.sourceUrls ?? []), officialUrl, mapUrl, statusUrl, imageSourceUrl])],
      sourceEvidence: {
        ...stop.sourceEvidence,
        officialUrl,
        mapUrl,
        currentStatusUrl: statusUrl,
        imageSourceUrl,
        checkedAt: madridCheckedAt,
      },
    } satisfies GuideStop;
  });

  const categorySources = list.category === "Food"
    ? madridFoodSources
    : list.category === "Nightlife"
      ? madridNightlifeSources
      : madridStaySources;
  const stopSources = stops.flatMap((stop) => [
    ...(stop.officialUrl ? [{ name: `${stop.name} official`, url: stop.officialUrl }] : []),
    ...(stop.sourceEvidence?.currentStatusUrl ? [{ name: `${stop.name} current status`, url: stop.sourceEvidence.currentStatusUrl }] : []),
  ]);

  return { ...list, stops, sources: uniqueMadridSources([...(list.sources ?? []), ...categorySources, ...stopSources]) };
}

export const madridNeighborhoodGuides = madridNeighborhoodGuideSeeds.map(repairMadridGuide) satisfies MapList[];

const madridNeighborhoodStopsById = new Map(
  madridNeighborhoodGuides.flatMap((guide) => guide.stops).map((stop) => [stop.id, stop]),
);
const madridCitywideHotelExtraStopIds = ["stay-westin-palace", "stay-room-mate-oscar", "stay-posada-leon"];

function expandMadridCitywideHotelGuide(list: MapList): MapList {
  if (list.id !== "list-madrid-citywide-stays") return list;

  const extraStops = madridCitywideHotelExtraStopIds.map((stopId) => {
    const stop = madridNeighborhoodStopsById.get(stopId);
    if (!stop) throw new Error(`Missing Madrid citywide hotel stop: ${stopId}`);
    return stop;
  });

  const extraSources = extraStops.flatMap((stop) => [
    ...(stop.officialUrl ? [{ name: `${stop.name} official`, url: stop.officialUrl }] : []),
    ...(stop.sourceEvidence?.currentStatusUrl
      ? [{ name: `${stop.name} current status`, url: stop.sourceEvidence.currentStatusUrl }]
      : []),
  ]);

  return {
    ...list,
    stops: [...list.stops, ...extraStops],
    sources: uniqueMadridSources([...(list.sources ?? []), ...extraSources]),
  };
}

const madridBaseCitywideGuides = madridCitywideGuideSeeds
  .map(repairMadridGuide)
  .map(expandMadridCitywideHotelGuide) satisfies MapList[];
const madridSourceGuides = [...madridNeighborhoodGuides, ...madridBaseCitywideGuides];

const madridCheapEatStops: GuideStop[] = [
  createResearchedEditorialStop({
    id: "madrid-cheap-casa-revuelta",
    name: "Casa Revuelta",
    coordinates: [40.4139218, -3.707839],
    description: "Casa Revuelta is a standing-room Madrid tavern built around crisp battered salt cod, croquettes, tripe, torreznos, beer, and vermouth. Most people need only the signature cod and a drink, keeping the bill low and the visit focused near Plaza Mayor.",
    category: "Food",
    venueKind: "food_drink",
    foodServiceType: "counter_service",
    cuisineTypes: ["Madrilenian", "Tapas", "Salt cod"],
    attributeTags: ["cheap_eats", "local_specialty", "historic", "walk_in_friendly"],
    price: "$",
    priceSource: "Tourism Madrid (EUR 15 or under) / Casa Revuelta official tavern menu",
    hours: { mon: "Closed", tue: "10:30 AM-4:00 PM; 7:00 PM-11:00 PM", wed: "10:30 AM-4:00 PM; 7:00 PM-11:00 PM", thu: "10:30 AM-4:00 PM; 7:00 PM-11:00 PM", fri: "10:30 AM-4:00 PM; 7:00 PM-11:00 PM", sat: "10:30 AM-4:00 PM; 7:00 PM-11:00 PM", sun: "10:30 AM-4:00 PM" },
    officialUrl: "https://www.casarevuelta.com/en/about-us",
    currentStatusUrl: "https://www.esmadrid.com/en/restaurants/casa-revuelta",
    editorialUrls: ["https://www.esmadrid.com/en/tapas-in-madrid"],
    mapQuery: "Casa Revuelta, Calle de Latoneros 3, Madrid",
    photo: "https://www.casarevuelta.com/assets/images/banner-2.jpg",
  }),
];

const madridRooftopStops: GuideStop[] = [
  createVenueVariantFromGuideStop({
    sourceGuides: madridSourceGuides,
    sourceStopId: "stay-room-mate-oscar",
    id: "madrid-rooftop-oscar",
    name: "La Terraza de Óscar",
    description: "La Terraza de Óscar pairs 360-degree Chueca views with more than 30 cocktails, evening food, Balinese beds, and a seasonal pool. The bar is 18+ and can close for private events; non-guests who want daytime pool access must arrange it directly with the hotel.",
    category: "Nightlife",
    venueKind: "food_drink",
    nightlifeType: "rooftop_bar",
    attributeTags: ["rooftop", "cocktails", "pool", "18_plus"],
    price: "$$$",
    hours: { mon: "7:30 PM-1:00 AM", tue: "7:30 PM-1:00 AM", wed: "7:30 PM-1:00 AM", thu: "7:30 PM-1:00 AM", fri: "7:30 PM-2:00 AM", sat: "7:30 PM-2:00 AM", sun: "7:30 PM-1:00 AM", summer: "Pool season begins 19 May; daily pool hours are 10:30 AM-7:00 PM." },
    officialUrl: "https://room-matehotels.com/gb/hotel-oscar-madrid/oscar-terrace/",
    currentStatusUrl: "https://room-matehotels.com/es/hotel-oscar-madrid/terraza-oscar/",
    mapQuery: "La Terraza de Oscar, Plaza de Pedro Zerolo 12, Madrid",
  }),
  createVenueVariantFromGuideStop({
    sourceGuides: madridSourceGuides,
    sourceStopId: "stay-nh-collection-suecia",
    id: "madrid-rooftop-casa-suecia",
    name: "Casa Suecia Rooftop",
    description: "Casa Suecia's two-level roof sits above the NH Collection Madrid Suecia with Cibeles and central rooftops in view. Cocktails and a compact snack menu run late, and an enclosure keeps part of the venue usable in cooler months; August service starts later in the day.",
    category: "Nightlife",
    venueKind: "food_drink",
    nightlifeType: "rooftop_bar",
    attributeTags: ["rooftop", "cocktails", "year_round", "city_views"],
    price: "$$$",
    hours: { mon: "1:00 PM-1:00 AM", tue: "1:00 PM-1:00 AM", wed: "1:00 PM-1:00 AM", thu: "1:00 PM-1:00 AM", fri: "1:00 PM-2:00 AM", sat: "12:00 PM-2:00 AM", sun: "12:00 PM-1:00 AM", summer: "In August, rooftop service begins at 5:00 PM." },
    officialUrl: "https://casasuecia.es/",
    mapQuery: "Casa Suecia Rooftop, Calle del Marques de Casa Riera 4, Madrid",
  }),
  createVenueVariantFromGuideStop({
    sourceGuides: madridSourceGuides,
    sourceStopId: "stay-the-hat",
    id: "madrid-rooftop-the-hat",
    name: "The Hat Rooftop",
    description: "The Hat Rooftop is an open-to-the-city hostel terrace with beer, cocktails, sharing plates, an indoor conservatory, and a social crowd near Plaza Mayor. Dinner tables can be reserved for groups up to ten; music and drinks run until the roof's firm 11:45 PM close.",
    category: "Nightlife",
    venueKind: "food_drink",
    nightlifeType: "rooftop_bar",
    attributeTags: ["rooftop", "social", "budget_friendly", "food"],
    price: "$$",
    hours: { default: "Daily service follows the official rooftop reservation calendar; the terrace closes at 11:45 PM every night." },
    officialUrl: "https://thehatmadrid.com/en/the-terrace/",
    currentStatusUrl: "https://thehatmadrid.com/la-terraza/",
    mapQuery: "The Hat Rooftop, Calle Imperial 9, Madrid",
  }),
  createVenueVariantFromGuideStop({
    sourceGuides: madridSourceGuides,
    sourceStopId: "stay-hotel-urban",
    id: "madrid-rooftop-urban",
    name: "La Terraza del Urban",
    description: "La Terraza del Urban opens its cocktail-and-tapas bar to non-guests in spring and summer, with central roof views and food from the Hotel Urban's CEBO team. The pool remains hotel-only; the public bar is the reason to visit and runs later on Friday and Saturday.",
    category: "Nightlife",
    venueKind: "food_drink",
    nightlifeType: "rooftop_bar",
    attributeTags: ["rooftop", "seasonal", "cocktails", "tapas"],
    price: "$$$",
    hours: { mon: "11:00 AM-12:00 AM", tue: "11:00 AM-12:00 AM", wed: "11:00 AM-12:00 AM", thu: "11:00 AM-12:00 AM", fri: "11:00 AM-2:00 AM", sat: "11:00 AM-2:00 AM", sun: "11:00 AM-12:00 AM", summer: "Open only during the official spring-summer season; pool access is reserved for hotel guests." },
    officialUrl: "https://www.hotelurban.com/en/the-urban-terrace",
    currentStatusUrl: "https://www.hotelurban.com/en/faqs-frequently-asked-questions",
    mapQuery: "La Terraza del Urban, Carrera de San Jeronimo 34, Madrid",
  }),
  createResearchedEditorialStop({
    id: "madrid-rooftop-azotea-circulo",
    name: "Azotea del Círculo",
    coordinates: [40.4181727, -3.6963263],
    description: "Azotea del Círculo sits above the Círculo de Bellas Artes with a direct sightline to the Metropolis building and a wide sweep over central Madrid. The roof combines a paid building access point with restaurant and cocktail service, so arrive earlier when the view matters more than dinner.",
    category: "Nightlife",
    venueKind: "food_drink",
    nightlifeType: "rooftop_bar",
    attributeTags: ["rooftop", "landmark_views", "cocktails", "central"],
    price: "$$$",
    hours: { mon: "10:00 AM-1:30 AM", tue: "10:00 AM-1:30 AM", wed: "10:00 AM-1:30 AM", thu: "10:00 AM-1:30 AM", fri: "10:00 AM-2:00 AM", sat: "10:00 AM-2:00 AM", sun: "10:00 AM-1:30 AM" },
    officialUrl: "https://azoteadelcirculo.azoteagrupo.com/azoteadelcirculo/",
    mapQuery: "Azotea del Circulo, Calle del Marques de Casa Riera 2, Madrid",
    photo: "https://azoteadelcirculo.azoteagrupo.com/wp-content/uploads/2024/12/circulo_slider_1.jpg",
  }),
  createResearchedEditorialStop({
    id: "madrid-rooftop-picalagartos",
    name: "Picalagartos Sky Bar",
    coordinates: [40.4197573, -3.7013563],
    description: "Picalagartos layers a restaurant and rooftop bar over Gran Vía, with a close view of central facades, cocktails, and late summer hours. The ninth-floor roof is the casual drinks option; restaurant reservations suit anyone planning a full meal rather than standing-room sunset traffic.",
    category: "Nightlife",
    venueKind: "food_drink",
    nightlifeType: "rooftop_bar",
    attributeTags: ["rooftop", "gran_via", "cocktails", "reservations"],
    price: "$$$",
    hours: { mon: "3:00 PM-1:00 AM", tue: "3:00 PM-1:00 AM", wed: "3:00 PM-1:00 AM", thu: "3:00 PM-1:00 AM", fri: "1:00 PM-2:00 AM", sat: "12:00 PM-2:00 AM", sun: "12:00 PM-1:00 AM" },
    officialUrl: "https://picalagartos.azoteagrupo.com/",
    currentStatusUrl: "https://www.esmadrid.com/en/nightlife/picalagartos-sky-bar",
    mapQuery: "Picalagartos Sky Bar, Gran Via 21, Madrid",
    photo: "https://picalagartos.azoteagrupo.com/wp-content/uploads/2024/09/noticia_picalagartos_1.webp",
  }),
  createResearchedEditorialStop({
    id: "madrid-rooftop-ginkgo",
    name: "Ginkgo Sky Bar",
    coordinates: [40.422785, -3.711608],
    description: "Ginkgo crowns VP Plaza España Design with an indoor-outdoor roof, cocktails, food, live performances, and direct views across Plaza de España. It trades neighborhood intimacy for a large-format night out; check the live programme when music matters and expect a premium hotel-bar bill.",
    category: "Nightlife",
    venueKind: "food_drink",
    nightlifeType: "rooftop_bar",
    musicGenres: ["live_music", "dj"],
    attributeTags: ["rooftop", "live_music", "cocktails", "premium"],
    price: "$$$",
    hours: { mon: "1:00 PM-2:00 AM", tue: "1:00 PM-2:00 AM", wed: "1:00 PM-2:00 AM", thu: "1:00 PM-2:00 AM", fri: "1:00 PM-2:30 AM", sat: "11:00 AM-2:30 AM", sun: "11:00 AM-2:00 AM" },
    officialUrl: "https://www.ginkgoskybarmadrid.com/en/",
    currentStatusUrl: "https://www.ginkgoskybarmadrid.com/en/contact/",
    mapQuery: "Ginkgo Sky Bar, Plaza de Espana 3, Madrid",
    photo: "https://www.ginkgoskybarmadrid.com/wp-content/uploads/2024/03/espacios-ginkgoskybarmadrid-2.jpg",
  }),
  createResearchedEditorialStop({
    id: "madrid-rooftop-riu360",
    name: "360 Rooftop Bar",
    coordinates: [40.4233, -3.7108],
    description: "360 Rooftop Bar circles the top of Hotel Riu Plaza España with glass walkways and uninterrupted city views. It operates more like a paid viewpoint with drinks and food than a hidden neighborhood bar; last admission is earlier than closing, so do not leave entry until midnight.",
    category: "Nightlife",
    venueKind: "food_drink",
    nightlifeType: "rooftop_bar",
    attributeTags: ["rooftop", "panoramic_views", "paid_entry", "landmark"],
    price: "$$$",
    hours: { default: "Daily 11:00 AM-2:00 AM; kitchen 12:00 PM-11:30 PM; last rooftop admission 12:00 AM." },
    officialUrl: "https://www.riu360rooftopbar.com/en/",
    mapQuery: "360 Rooftop Bar Riu Plaza Espana, Gran Via 84, Madrid",
    photo: "https://www.riu360rooftopbar.com/wp-content/uploads/2023/04/DSC00317-scaled.jpg",
  }),
];

const madridSeoQueryGuides = [
  createDerivedEditorialGuide({
    id: "list-madrid-citywide-cheap-eats",
    slug: "madrid-best-cheap-eats-citywide",
    seoSlug: "best-cheap-eats",
    seoTitle: "Best Cheap Eats in Madrid",
    seoDescription: "The best cheap eats in Madrid for tortilla, churros, tapas, market counters, neighborhood lunches, and casual sharing plates across the center.",
    title: "Tortilla, Churros, Markets, and Everyday Madrid",
    description: "Eating cheaply in Madrid works best through specialist counters, old taverns, market stalls, and neighborhood rooms where a focused order carries the meal. These ten stops favor real value and casual formats over tasting menus or expensive restaurants with misleading price metadata.",
    category: "Food",
    city: "Madrid",
    country: "Spain",
    continent: "Europe",
    stopIds: [
      "madrid-food-casa-dani",
      "sol-food-casa-labra",
      "sol-food-san-gines",
      "letras-food-la-malontina",
      "letras-food-casa-alberto",
      "malasana-food-ojala",
      "malasana-food-la-musa",
      "madrid-cheap-casa-revuelta",
      "latina-food-mercado-cebada",
      "chueca-food-mercado-san-anton",
    ],
    sourceGuides: madridSourceGuides,
    extraStops: madridCheapEatStops,
  }),
  createDerivedEditorialGuide({
    id: "list-madrid-citywide-cocktail-bars",
    slug: "madrid-best-cocktail-bars-citywide",
    seoSlug: "best-cocktail-bars",
    seoTitle: "Best Cocktail Bars in Madrid",
    seoDescription: "The best cocktail bars in Madrid for modern mixology, historic rooms, classics, wine-led drinks, rooftop cocktails, and late-night bars across the center.",
    title: "Modern Mixology, Historic Bars, and Rooftop Drinks",
    description: "Madrid cocktails stretch from internationally known modern bars to historic Gran Via rooms, intimate classics, wine-led basements, and rooftops. These ten picks give each night a distinct format rather than treating every late bar as interchangeable.",
    category: "Nightlife",
    city: "Madrid",
    country: "Spain",
    continent: "Europe",
    stopIds: [
      "letras-nightlife-salmon-guru",
      "chueca-nightlife-angelita",
      "chueca-nightlife-ficus",
      "chueca-nightlife-museo-chicote",
      "malasana-nightlife-1862",
      "sol-nightlife-josealfredo",
      "letras-nightlife-viva-madrid",
      "retiro-nightlife-florida",
      "retiro-nightlife-ramses",
      "sol-nightlife-edition-roof",
    ],
    sourceGuides: madridSourceGuides,
  }),
  createDerivedEditorialGuide({
    id: "list-madrid-citywide-rooftop-bars",
    slug: "madrid-best-rooftop-bars-citywide",
    seoSlug: "best-rooftop-bars",
    seoTitle: "Best Rooftop Bars in Madrid",
    seoDescription: "The best rooftop bars in Madrid for Gran Via views, Chueca cocktails, Plaza de Espana panoramas, casual hostel terraces, landmark roofs, and late summer nights.",
    title: "Gran Vía Roofs, Chueca Cocktails, and Open Sky",
    description: "Madrid's rooftop season is long, but the formats differ sharply: public viewpoints, hotel cocktail bars, social hostel terraces, restaurant roofs, and seasonal pools do not solve the same night. These ten picks spell out access, age, season, and closing-time tradeoffs before the lift ride.",
    category: "Nightlife",
    city: "Madrid",
    country: "Spain",
    continent: "Europe",
    stopIds: [
      "sol-nightlife-edition-roof",
      "latina-nightlife-viajero",
      "madrid-rooftop-azotea-circulo",
      "madrid-rooftop-picalagartos",
      "madrid-rooftop-ginkgo",
      "madrid-rooftop-riu360",
      "madrid-rooftop-oscar",
      "madrid-rooftop-casa-suecia",
      "madrid-rooftop-the-hat",
      "madrid-rooftop-urban",
    ],
    sourceGuides: madridSourceGuides,
    extraStops: madridRooftopStops,
  }),
];

export const madridCitywideGuides = [...madridBaseCitywideGuides, ...madridSeoQueryGuides];

export const madridGuides = [
  ...madridNeighborhoodGuides,
  ...madridCitywideGuides,
] satisfies MapList[];
