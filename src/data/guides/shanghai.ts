import type { GuideStop, ListCategory, ListSource, MapList } from "@/types";
import { buildNatureGuide } from "@/data/guides/nature-guide-builder";

const createdAt = "2026-07-29T00:00:00.000Z";
const checkedAt = "2026-07-29";

const shanghaiLocation = {
  city: "Shanghai",
  country: "China",
  continent: "Asia",
  scope: "city" as const,
};

const categoryColors: Record<ListCategory, string> = {
  Food: "0f766e",
  Nightlife: "7c3aed",
  Nature: "15803d",
  Culture: "b45309",
  Stay: "0369a1",
  Activities: "be123c",
  Routes: "475569",
  Essentials: "475569",
};

function avatar(category: ListCategory) {
  const fill = categoryColors[category] ?? "475569";
  return `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
      <rect width="160" height="160" rx="80" fill="#${fill}" />
      <text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle"
        font-family="Arial, sans-serif" font-size="76" font-weight="700" fill="white">R</text>
    </svg>
  `)}`;
}

function source(name: string, url: string): ListSource {
  return { name, url };
}

function maps(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function commons(fileName: string) {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}?width=1600`;
}

const hours = {
  reservation: {
    default:
      "Service days, seating times, and reservation release are controlled by the restaurant's official reservation page and booking calendar.",
  },
  hotel: {
    default:
      "Open 24 hours daily; check-in, check-out, restaurant, and spa windows are published on the official property page.",
  },
  liveVenue: {
    default:
      "Evening service follows the current venue listing; ticketed nights and altered closing times are published on the venue's official event calendar.",
  },
  cocktail: {
    default:
      "Evening bar service follows the current venue listing; reservations, guest shifts, and holiday closures are published on the official booking page.",
  },
};

type StopInput = Partial<GuideStop> & {
  id: string;
  name: string;
  coordinates: [number, number];
  description: string;
  neighborhood: string;
  sourcePhoto: string;
  editorialUrls?: string[];
  platformUrls?: string[];
  mapQuery?: string;
};

function stop(input: StopInput): GuideStop {
  const {
    id,
    name,
    coordinates,
    description,
    neighborhood,
    sourcePhoto,
    editorialUrls = [],
    platformUrls = [],
    mapQuery,
    sourceEvidence,
    sourceUrls: extraUrls = [],
    officialUrl,
    bookingUrl,
    ...rest
  } = input;
  const mapUrl = sourceEvidence?.mapUrl ?? maps(mapQuery ?? `${name} Shanghai`);
  const officialEvidence =
    sourceEvidence?.officialUrl ?? officialUrl ?? bookingUrl ?? platformUrls[0];
  const sourceUrls = [
    officialEvidence,
    bookingUrl,
    mapUrl,
    sourcePhoto,
    ...editorialUrls,
    ...platformUrls,
    ...extraUrls,
  ].filter(Boolean) as string[];

  return {
    id,
    poiId: input.poiId ?? `shanghai-venue-${id.replace(/^shanghai-/, "")}`,
    name,
    coordinates,
    description,
    subcategory: neighborhood,
    photo: sourcePhoto,
    imageSourceUrl: sourcePhoto,
    imageSourceName: sourcePhoto.includes("wikimedia")
      ? "Wikimedia Commons"
      : "Venue or editorial source",
    sourceUrls: [...new Set(sourceUrls)],
    sourceEvidence: {
      officialUrl: officialEvidence,
      mapUrl,
      currentStatusUrl: mapUrl,
      imageSourceUrl: sourcePhoto,
      editorialUrls,
      platformUrls,
      checkedAt,
      notes:
        "Venue-controlled, government, current editorial, or booking evidence and a map listing were checked for operating status; no permanent-closure warning was found.",
      ...sourceEvidence,
    },
    ...(officialUrl ? { officialUrl } : {}),
    ...(bookingUrl ? { bookingUrl } : {}),
    ...rest,
  };
}

const diningStops: GuideStop[] = [
  stop({
    id: "shanghai-dining-taian-table",
    name: "Taian Table",
    neighborhood: "Changning",
    coordinates: [31.2238808, 121.4282084],
    description:
      "Stefan Stiller's counter builds ten- or twelve-course menus from a broad choice of plates, letting diners shape a German-Asian progression without losing the kitchen's exacting rhythm.",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["creative", "german", "asian", "tasting_menu"],
    price: "$$$$",
    priceSource: "MICHELIN Guide Shanghai 2026",
    attributeTags: ["fine_dining", "tasting_menu", "reservation_required", "destination_dining"],
    hours: hours.reservation,
    officialUrl:
      "https://guide.michelin.com/en/shanghai-municipality/shanghai/restaurant/taian-table",
    sourcePhoto:
      "https://prod-pics.guide.michelin.com/api/public/content/814583d135a8402f8b6e9c83b67ce9e4.jpg?format=jpeg&w=1200&h=900",
    editorialUrls: [
      "https://www.michelin.com/en/publications/products-and-services/michelin-guide-shanghai-jiangsu-zhejiang",
    ],
  }),
  stop({
    id: "shanghai-dining-meet-the-bund",
    name: "Meet the Bund",
    neighborhood: "The Bund",
    coordinates: [31.228818, 121.493593],
    description:
      "Meet the Bund gives Fujian seafood a metropolitan stage, balancing pristine fish, red-sturgeon glutinous rice, and a shark-fin-free Buddha Jumps Over the Wall with polished service.",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["fujian", "seafood", "modern_chinese"],
    price: "$$$$",
    priceSource: "Asia's 50 Best Restaurants 2026 / MICHELIN Guide",
    attributeTags: ["fine_dining", "seafood", "destination_dining", "reservation_required"],
    hours: hours.reservation,
    officialUrl:
      "https://guide.michelin.com/hk/en/shanghai-municipality/shanghai/restaurant/meet-the-bund",
    sourcePhoto:
      "https://prod-pics.guide.michelin.com/api/public/content/25bc5873a4044276ab6dbd7291de15c0.jpeg?format=jpeg&w=1200&h=900",
    editorialUrls: [
      "https://www.theworlds50best.com/restaurants/best-in-asia/the-list/meet-the-bund.html",
    ],
  }),
  stop({
    id: "shanghai-dining-ling-long",
    name: "Ling Long",
    neighborhood: "The Bund",
    coordinates: [31.241756, 121.488143],
    description:
      "Jason Liu's tasting menu moves through regional Chinese memories with modern structure, including preserved-vegetable chicken, fish maw with Parmesan, and restrained honey-led desserts.",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["modern_chinese", "tasting_menu", "creative"],
    price: "$$$$",
    priceSource: "Asia's 50 Best Restaurants 2026 / MICHELIN Guide",
    attributeTags: ["fine_dining", "tasting_menu", "date_night", "reservation_required"],
    hours: hours.reservation,
    officialUrl:
      "https://guide.michelin.com/is/en/shanghai-municipality/shanghai/restaurant/ling-long-1209951",
    sourcePhoto:
      "https://prod-pics.guide.michelin.com/api/public/content/645d4eb427d64be7b362790297bab3b9.jpeg?format=jpeg&w=1200&h=900",
    editorialUrls: [
      "https://www.theworlds50best.com/restaurants/best-in-asia/the-list/ling-long.html",
    ],
  }),
  stop({
    id: "shanghai-dining-fu-he-hui",
    name: "Fu He Hui",
    neighborhood: "Changning",
    coordinates: [31.2205002, 121.4250678],
    description:
      "Fu He Hui treats vegetarian cooking as a study of Chinese agriculture, fermentation, tea, and seasonality, using historical techniques instead of imitating meat or leaning on luxury garnish.",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["vegetarian", "chinese", "tasting_menu"],
    price: "$$$$",
    priceSource: "Asia's 50 Best Restaurants 2026 / MICHELIN Guide",
    attributeTags: ["vegetarian_friendly", "fine_dining", "tasting_menu", "quiet_food"],
    hours: hours.reservation,
    officialUrl:
      "https://guide.michelin.com/sg/en/shanghai-municipality/shanghai/restaurant/fu-he-hui",
    sourcePhoto:
      "https://prod-pics.guide.michelin.com/api/public/content/c76f007b55d146ddb53c124c1492e8df.jpeg?format=jpeg&w=1200&h=900",
    editorialUrls: [
      "https://www.theworlds50best.com/restaurants/best-in-asia/the-list/fu-he-hui.html",
    ],
  }),
  stop({
    id: "shanghai-dining-102-house",
    name: "102 House",
    neighborhood: "The Bund",
    coordinates: [31.2433, 121.4916],
    description:
      "This small Bund dining room revives formal Cantonese banquet cooking through seasonal set menus, double-boiled soups, roast meats, and sweet-and-sour pork sharpened with house fruit vinegar.",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["cantonese", "banquet", "tasting_menu"],
    price: "$$$$",
    priceSource: "Asia's 50 Best Restaurants 2026 / MICHELIN Guide",
    attributeTags: ["fine_dining", "tasting_menu", "reservation_required", "scenic_food"],
    hours: hours.reservation,
    officialUrl:
      "https://guide.michelin.com/us/en/shanghai-municipality/shanghai/restaurant/102-house",
    sourcePhoto:
      "https://www.theworlds50best.com/stories/filestore/jpg/A50BR26-1-50-102House-LIP.jpg",
    editorialUrls: [
      "https://www.theworlds50best.com/restaurants/best-in-asia/the-list/102-house.html",
    ],
  }),
  stop({
    id: "shanghai-dining-la-bourriche-133",
    name: "La Bourriche 133",
    neighborhood: "Rockbund",
    coordinates: [31.2401, 121.4902],
    description:
      "Lee Jiawei applies French technique to oysters, crab, turbot, and other peak-season seafood in a restrained Rockbund room whose submarine mood never overwhelms the catch.",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["seafood", "french", "seasonal"],
    price: "$$$$",
    priceSource: "Asia's 50 Best Restaurants 2026",
    attributeTags: ["seafood", "fine_dining", "date_night", "reservation_required"],
    hours: {
      mon: "Closed",
      tue: "5:45 PM-11:00 PM",
      wed: "5:45 PM-11:00 PM",
      thu: "5:45 PM-11:00 PM",
      fri: "11:30 AM-2:00 PM, 5:45 PM-11:00 PM",
      sat: "11:30 AM-2:00 PM, 5:45 PM-11:00 PM",
      sun: "11:30 AM-2:00 PM, 5:45 PM-11:00 PM",
    },
    officialUrl: "https://labourriche133.com/contact?lang=en",
    bookingUrl: "https://labourriche133.com/reserve",
    sourcePhoto:
      "https://www.theworlds50best.com/stories/filestore/jpg/A50BR26-1-50-LaBourriche133-LIP.jpg",
    editorialUrls: [
      "https://www.theworlds50best.com/restaurants/best-in-asia/the-list/La-Bourriche-133.html",
    ],
  }),
  stop({
    id: "shanghai-dining-bao-li-xuan",
    name: "Bao Li Xuan",
    neighborhood: "Suzhou Creek",
    coordinates: [31.242798, 121.482315],
    description:
      "Bao Li Xuan places disciplined Cantonese cooking inside the restored Chamber of Commerce building, pairing dim sum, seafood, and roast meats with a quieter heritage setting.",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["cantonese", "dim_sum", "seafood"],
    price: "$$$$",
    priceSource: "MICHELIN Guide Shanghai 2026",
    attributeTags: ["fine_dining", "destination_dining", "romantic_food", "reservation_required"],
    hours: hours.reservation,
    officialUrl:
      "https://guide.michelin.com/us/en/shanghai-municipality/shanghai/restaurant/bao-li-xuan",
    bookingUrl: "https://www.bulgarihotels.com/shanghai/dining/bao-li-xuan",
    sourcePhoto:
      "https://prod-pics.guide.michelin.com/api/public/content/ab525cc3f03844dfbfb9fbfa5b2293d6.jpeg?format=jpeg&w=1200&h=900",
  }),
  stop({
    id: "shanghai-dining-da-vittorio",
    name: "Da Vittorio",
    neighborhood: "The Bund",
    coordinates: [31.229464, 121.492954],
    description:
      "Da Vittorio translates the Cerea family's Italian luxury into a Bund dining room, with seafood, handmade pasta, and exact service carrying more weight than novelty.",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["italian", "seafood", "fine_dining"],
    price: "$$$$",
    priceSource: "MICHELIN Guide Shanghai 2026",
    attributeTags: ["fine_dining", "splurge_food", "romantic_food", "reservation_required"],
    hours: hours.reservation,
    officialUrl:
      "https://guide.michelin.com/en/shanghai-municipality/shanghai/restaurant/da-vittorio-570570",
    sourcePhoto:
      "https://prod-pics.guide.michelin.com/api/public/content/27c599980fb143d4a5852fac99d43b9d.jpg?format=jpeg&w=1200&h=900",
  }),
  stop({
    id: "shanghai-dining-fu-1088",
    name: "Fu 1088",
    neighborhood: "Changning",
    coordinates: [31.2234563, 121.4312403],
    description:
      "Set in a 1920s villa, Fu 1088 frames red-braised pork, smoked fish, river produce, and other Shanghainese signatures through private-room pacing and old-house atmosphere.",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["shanghainese", "jiangnan", "classic"],
    price: "$$$",
    priceSource: "MICHELIN Guide Shanghai 2026",
    attributeTags: ["local_favorite", "destination_dining", "group_friendly", "reservation_required"],
    hours: hours.reservation,
    officialUrl:
      "https://guide.michelin.com/en/shanghai-municipality/shanghai/restaurant/fu-1088",
    sourcePhoto:
      "https://prod-pics.guide.michelin.com/api/public/content/2222821454c045d8992c3f29521188f7.jpg?format=jpeg&w=1200&h=900",
  }),
  stop({
    id: "shanghai-dining-canton-8",
    name: "Canton 8",
    neighborhood: "Huangpu",
    coordinates: [31.2045625, 121.4788056],
    description:
      "Canton 8 makes serious Cantonese cooking unusually accessible, with double-boiled soups, char siu, seafood, dim sum, and desserts served without luxury-hotel pricing.",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["cantonese", "dim_sum", "barbecue"],
    price: "$$$",
    priceSource: "MICHELIN Guide Shanghai 2026",
    attributeTags: ["fine_dining", "group_friendly", "family_friendly_food", "reservation_recommended"],
    hours: hours.reservation,
    officialUrl:
      "https://guide.michelin.com/us/en/shanghai-municipality/shanghai/restaurant/canton-8-runan-street",
    sourcePhoto:
      "https://prod-pics.guide.michelin.com/api/public/content/dcbcaedc13314b8f9fd23d66baa7a8d7.jpg?format=jpeg&w=1200&h=900",
  }),
];

const cheapEatStops: GuideStop[] = [
  stop({
    id: "shanghai-cheap-jia-jia-tang-bao",
    name: "Jia Jia Tang Bao",
    neighborhood: "Huangpu",
    coordinates: [31.2102, 121.487],
    description:
      "The Liyuan Road branch keeps Jia Jia's thin-skinned soup dumplings, mild pork filling, and crab-rich seasonal variations in a quick, no-frills neighborhood format.",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["xiaolongbao", "shanghainese", "dumplings"],
    price: "$",
    priceSource: "SmartShanghai current listing / Google Maps",
    attributeTags: ["budget_food", "local_favorite", "walk_in_friendly", "solo_friendly"],
    hours: { default: "Daily 9:00 AM-9:30 PM on the current map and venue listings." },
    officialUrl:
      "https://www.smartshanghai.com/venue/19007/jia_jia_tangbao_liyuan_lu",
    sourcePhoto:
      "https://images.smartshanghai.com.cn/uploads/repository/2021/11/17/133a6dd9-14ab-4782-9df7-1473ebd20879.jpg",
    editorialUrls: [
      "https://www.smartshanghai.com/listings/dining/shanghainese/",
    ],
  }),
  stop({
    id: "shanghai-cheap-qiao-ai-lai-lai",
    name: "Qiao Ai Lai Lai Xiao Long",
    neighborhood: "People's Square",
    coordinates: [31.2381117, 121.472547],
    description:
      "Lai Lai specializes in crabmeat xiaolongbao with broth-rich fillings, delicate skins, and enough seasonal variation to justify the narrow room's regular queue.",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["xiaolongbao", "crab", "dim_sum"],
    price: "$",
    priceSource: "MICHELIN Guide / current platform listing",
    attributeTags: ["budget_food", "local_favorite", "queue_likely", "walk_in_friendly"],
    hours: { default: "Daily 8:00 AM-2:00 PM on the current platform listing." },
    officialUrl:
      "https://guide.michelin.com/gb/en/shanghai-municipality/shanghai/restaurant/qiao-ai-lai-lai-xiao-long-huangpu",
    sourcePhoto:
      "https://prod-pics.guide.michelin.com/api/public/content/c5612793b4e94769824a40095b1b915d.jpeg?format=jpeg&w=1200&h=900",
    editorialUrls: [
      "https://guide.michelin.com/sg/en/article/travel/best-shanghai-xiao-long-bao",
    ],
  }),
  stop({
    id: "shanghai-cheap-wei-xiang-zhai",
    name: "Wei Xiang Zhai",
    neighborhood: "Former French Concession",
    coordinates: [31.225537, 121.478169],
    description:
      "Wei Xiang Zhai's sesame noodles are nutty, savory, and fast, while spicy pork and beef broth turn the tiny Yandang Road shop into a fuller meal.",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["noodles", "shanghainese", "sesame"],
    price: "$",
    priceSource: "MICHELIN Guide / Shanghai Cervantes city guide",
    attributeTags: ["budget_food", "local_favorite", "solo_friendly", "breakfast"],
    hours: { default: "Daily 6:30 AM-9:00 PM in the current Shanghai city guide." },
    officialUrl:
      "https://guide.michelin.com/sg/en/shanghai-municipality/shanghai/restaurant/wei-xiang-zhai",
    sourcePhoto:
      "https://prod-pics.guide.michelin.com/api/public/content/b35c17e8f9d34f0ba44932ca590317ad.jpeg?format=jpeg&w=1200&h=900",
    editorialUrls: [
      "https://shanghai.cervantes.es/imagenes/File/Guia_de_Shanghai_2025.pdf",
    ],
  }),
  stop({
    id: "shanghai-cheap-xiao-tao-mian-guan",
    name: "Xiao Tao Mian Guan",
    neighborhood: "Xuhui",
    coordinates: [31.2108452, 121.4550106],
    description:
      "Xiao Tao's scallion-oil noodles arrive glossy and aromatic, with a useful roster of toppings and noodle refills that suit hungry solo diners.",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["noodles", "shanghainese", "scallion_oil"],
    price: "$",
    priceSource: "MICHELIN Guide / current map listing",
    attributeTags: ["budget_food", "solo_friendly", "walk_in_friendly", "local_favorite"],
    hours: { default: "Daily 6:30 AM-9:00 PM on the current map listing." },
    officialUrl:
      "https://guide.michelin.com/gb/en/shanghai-municipality/shanghai/restaurant/xiao-tao-mian-guan",
    sourcePhoto:
      "https://prod-pics.guide.michelin.com/api/public/content/6b9d675e9725420ca7520e611e21329f.jpeg?format=jpeg&w=1200&h=900",
  }),
  stop({
    id: "shanghai-cheap-jingmei-wuxi-noodles",
    name: "Jingmei Wuxi Noodles",
    neighborhood: "Jing'an",
    coordinates: [31.2310493, 121.436471],
    description:
      "This Yanping Road shop brings Wuxi's sweeter palate through rib noodles and three-white wontons, offering a useful regional counterpoint to Shanghai's darker braises.",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["wuxi", "noodles", "wontons"],
    price: "$",
    priceSource: "MICHELIN Guide / current map listing",
    attributeTags: ["budget_food", "solo_friendly", "walk_in_friendly", "local_favorite"],
    hours: { default: "Daily 10:30 AM-8:30 PM on the current map listing." },
    officialUrl:
      "https://guide.michelin.com/tw/en/shanghai-municipality/shanghai/restaurant/jing-mei-wu-xi-si-fang-mian-guan",
    sourcePhoto:
      "https://prod-pics.guide.michelin.com/api/public/content/55a46fdc7c9145328219fda1ff829a2c.jpeg?format=jpeg&w=1200&h=900",
  }),
  stop({
    id: "shanghai-cheap-ding-te-le",
    name: "Ding Te Le Zhou Mian Guan",
    neighborhood: "Huaihai Road",
    coordinates: [31.2233192, 121.4650451],
    description:
      "Ding Te Le is the round-the-clock safety valve for congee and noodles, hidden down a Huaihai Road lane and especially valuable after late drinks.",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["congee", "noodles", "shanghainese"],
    price: "$",
    priceSource: "MICHELIN Guide / current map listing",
    attributeTags: ["budget_food", "late_night", "solo_friendly", "local_favorite"],
    hours: { default: "Open 24 hours daily on the current map and MICHELIN listings." },
    officialUrl:
      "https://guide.michelin.com/us/en/shanghai-municipality/shanghai/restaurant/ding-te-le-zhou-mian-guan",
    sourcePhoto:
      "https://prod-pics.guide.michelin.com/api/public/content/4bb3c839d6a5427d8694b0560bdbe91d.jpg?format=jpeg&w=1200&h=900",
  }),
  stop({
    id: "shanghai-cheap-nanxiang-steamed-bun",
    name: "Nanxiang Steamed Bun",
    neighborhood: "Old City",
    coordinates: [31.226445, 121.491658],
    description:
      "The century-old Yuyuan institution serves classic pork, crab, and seasonal xiaolongbao, including oversized soup buns, in a renovated teahouse above the bazaar crowds.",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["xiaolongbao", "dim_sum", "shanghainese"],
    price: "$",
    priceSource: "MICHELIN Guide / current venue listing",
    attributeTags: ["budget_food", "classic", "group_friendly", "queue_likely"],
    hours: { default: "Daily 8:30 AM-9:00 PM on the current venue and map listings." },
    officialUrl:
      "https://guide.michelin.com/us/en/shanghai-municipality/shanghai/restaurant/nanxiang-steamed-bun-city-god-temple",
    sourcePhoto:
      "https://prod-pics.guide.michelin.com/api/public/content/117c21ba1f804d928fb9807d28f6e34a.jpeg?format=jpeg&w=1200&h=900",
    editorialUrls: [
      "https://guide.michelin.com/sg/en/article/travel/best-shanghai-xiao-long-bao",
    ],
  }),
  stop({
    id: "shanghai-cheap-wu-you-xian",
    name: "Wu You Xian",
    neighborhood: "Xuhui",
    coordinates: [31.2254163, 121.456094],
    description:
      "Wu You Xian concentrates on handmade dim sum and crab-rich xiaolongbao, offering a more composed sit-down meal while remaining accessible by fine-dining standards.",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["dim_sum", "crab", "xiaolongbao"],
    price: "$$",
    priceSource: "MICHELIN Guide / current map listing",
    attributeTags: ["local_favorite", "group_friendly", "reservation_recommended", "budget_food"],
    hours: { default: "Daily 10:30 AM-9:00 PM on the current map listing." },
    officialUrl:
      "https://guide.michelin.com/en/shanghai-municipality/shanghai/restaurant/wu-you-xian",
    sourcePhoto:
      "https://prod-pics.guide.michelin.com/api/public/content/8fb08d010485428898cc3c5123e71583.jpg?format=jpeg&w=1200&h=900",
  }),
  stop({
    id: "shanghai-cheap-da-hu-chun",
    name: "Da Hu Chun",
    neighborhood: "People's Square",
    coordinates: [31.2367338, 121.4848305],
    description:
      "Da Hu Chun fries its shengjian pleat-side up, producing a crisp, sturdy base and breadier shell around pork broth than the city's thinner modern versions.",
    venueKind: "food_drink",
    foodServiceType: "counter_service",
    cuisineTypes: ["shengjian", "dumplings", "shanghainese"],
    price: "$",
    priceSource: "MICHELIN Guide / current map listing",
    attributeTags: ["budget_food", "local_favorite", "walk_in_friendly", "breakfast"],
    hours: { default: "Daily 6:30 AM-8:30 PM on the current map listing." },
    officialUrl:
      "https://guide.michelin.com/en/shanghai-municipality/shanghai/restaurant/da-hu-chun-middle-sichuan-road",
    sourcePhoto:
      "https://prod-pics.guide.michelin.com/api/public/content/9f05dc6cb24a45de9c9fe91fc724bc84.jpeg?format=jpeg&w=1200&h=900",
  }),
  stop({
    id: "shanghai-cheap-dong-tai-xiang",
    name: "Dong Tai Xiang",
    neighborhood: "People's Square",
    coordinates: [31.2296, 121.4729],
    description:
      "Dong Tai Xiang is a practical shengjian stop near People's Square, pairing crisp-bottomed pork buns with soup and simple breakfast dishes in a brisk counter-service room.",
    venueKind: "food_drink",
    foodServiceType: "counter_service",
    cuisineTypes: ["shengjian", "dumplings", "shanghainese"],
    price: "$",
    priceSource: "SmartShanghai current listing / Google Maps",
    attributeTags: ["budget_food", "breakfast", "solo_friendly", "walk_in_friendly"],
    hours: { default: "Daily 6:30 AM-8:30 PM on the current venue and map listings." },
    officialUrl:
      "https://www.smartshanghai.com/venue/14527/dong_tai_xiang_chongqing_bei_lu",
    sourcePhoto:
      "https://images.smartshanghai.com.cn/uploads/repository/2020/07/31/5ae64757-023b-42bd-b0ef-1d47884e81db.jpeg",
  }),
];

const hotelStops: GuideStop[] = [
  stop({
    id: "shanghai-hotel-capella",
    name: "Capella Shanghai, Jian Ye Li",
    neighborhood: "Xuhui",
    coordinates: [31.2005, 121.4548],
    description:
      "Capella occupies restored 1930s shikumen lanes, giving each villa a courtyard and roof terrace while keeping the Former French Concession outside the gate.",
    venueKind: "lodging",
    lodgingType: "hotel",
    price: "$$$$",
    priceSource: "Official property booking page / MICHELIN Key selection",
    attributeTags: ["luxury", "design", "romantic", "central"],
    hours: hours.hotel,
    officialUrl: "https://capellahotels.com/en/en/cn/shanghai",
    bookingUrl: "https://capellahotels.com/en/en/cn/shanghai/offers",
    sourcePhoto:
      "https://www.meet-in-shanghai.net/static//upload/mainpic/20190809165013_732508349.jpg",
    editorialUrls: [
      "https://www.meet-in-shanghai.net/en/hotels/capella-shanghai-jian-ye-li-523673/",
    ],
  }),
  stop({
    id: "shanghai-hotel-upper-house",
    name: "Upper House Shanghai",
    neighborhood: "Jing'an",
    coordinates: [31.2292, 121.461],
    description:
      "The former Middle House now carries the Upper House name, retaining Piero Lissoni's tactile rooms, art-led calm, and direct access to HKRI Taikoo Hui.",
    venueKind: "lodging",
    lodgingType: "hotel",
    price: "$$$$",
    priceSource: "Official property booking page",
    attributeTags: ["luxury", "design", "central", "wellness"],
    hours: hours.hotel,
    officialUrl: "https://www.upperhouse.com/en/shanghai/",
    bookingUrl: "https://www.upperhouse.com/en/shanghai/stay/",
    sourcePhoto:
      "https://edge.sitecorecloud.io/swirehotels1-swirehotels-production-ebf6/media/Project/Upper-House/upper-house/shanghai/homepage/shanghai-homepage-hero.jpg?h=1725&iar=0&w=3372",
  }),
  stop({
    id: "shanghai-hotel-edition",
    name: "The Shanghai EDITION",
    neighborhood: "East Nanjing Road",
    coordinates: [31.2392, 121.4832],
    description:
      "The EDITION combines a 145-room tower, Bund-facing windows, multiple bars, and serious nightlife energy at the point where East Nanjing Road meets the river.",
    venueKind: "lodging",
    lodgingType: "hotel",
    price: "$$$$",
    priceSource: "Official property booking page",
    attributeTags: ["luxury", "design", "central", "lively"],
    hours: hours.hotel,
    officialUrl: "https://www.editionhotels.com/shanghai/",
    bookingUrl:
      "https://www.marriott.com/en-us/hotels/shaeb-the-shanghai-edition/overview/",
    sourcePhoto:
      "https://www.editionhotels.com/wp-content/uploads/2019/01/EDT_SHI1_03_RGB_V3-e1547057146173.jpg",
  }),
  stop({
    id: "shanghai-hotel-bvlgari",
    name: "Bvlgari Hotel Shanghai",
    neighborhood: "Suzhou Creek",
    coordinates: [31.2428, 121.4823],
    description:
      "Bvlgari links a contemporary tower to the restored Chamber of Commerce, trading immediate Bund crowds for Suzhou Creek gardens, skyline views, and intimate scale.",
    venueKind: "lodging",
    lodgingType: "hotel",
    price: "$$$$",
    priceSource: "Official property booking page",
    attributeTags: ["luxury", "design", "scenic", "wellness"],
    hours: hours.hotel,
    officialUrl: "https://www.bulgarihotels.com/shanghai/",
    bookingUrl: "https://www.bulgarihotels.com/shanghai/rooms-and-suites",
    sourcePhoto:
      "https://www.meet-in-shanghai.net/static//upload/mainpic/20181031153950_504835516.jpg",
    editorialUrls: [
      "https://www.meet-in-shanghai.net/en/hotels/bulgari-hotel-shanghai-566413/",
    ],
  }),
  stop({
    id: "shanghai-hotel-amanyangyun",
    name: "Amanyangyun",
    neighborhood: "Minhang",
    coordinates: [30.9778, 121.3812],
    description:
      "Amanyangyun is a destination resort rather than a downtown base, built around relocated Ming- and Qing-era houses, a camphor forest, cultural programming, and deep spa facilities.",
    venueKind: "lodging",
    lodgingType: "resort",
    price: "$$$$",
    priceSource: "Official property booking page",
    attributeTags: ["luxury", "wellness", "quiet", "nature"],
    hours: hours.hotel,
    officialUrl: "https://www.aman.com/resorts/amanyangyun",
    bookingUrl: "https://www.aman.com/resorts/amanyangyun/accommodation",
    sourcePhoto:
      "https://www.aman.com/sites/default/files/2023-05/amanyangyun-china-nanshufang_1.jpg",
  }),
  stop({
    id: "shanghai-hotel-sukhothai",
    name: "The Sukhothai Shanghai",
    neighborhood: "Jing'an",
    coordinates: [31.2282, 121.4644],
    description:
      "The Sukhothai offers warm contemporary design, a 25-meter indoor pool, and a calmer residential feel while remaining close to Nanjing West Road and Zhangyuan.",
    venueKind: "lodging",
    lodgingType: "hotel",
    price: "$$$",
    priceSource: "Official property booking page / Shanghai tourism listing",
    attributeTags: ["luxury", "design", "central", "wellness"],
    hours: hours.hotel,
    officialUrl: "https://www.sukhothai.com/shanghai/en",
    bookingUrl: "https://www.sukhothai.com/shanghai/en/rooms-suites",
    sourcePhoto:
      "https://www.meet-in-shanghai.net/static//upload/mainpic/20180814103508_273152816.jpg",
    editorialUrls: [
      "https://www.meet-in-shanghai.net/en/hotels/the-sukhothai-shanghai-336424/",
    ],
  }),
  stop({
    id: "shanghai-hotel-fairmont-peace",
    name: "Fairmont Peace Hotel",
    neighborhood: "The Bund",
    coordinates: [31.2394, 121.4897],
    description:
      "The Peace Hotel is the Bund's Art Deco grande dame, strongest for travelers who value Jazz Bar history, river-facing public rooms, and landmark atmosphere over contemporary understatement.",
    venueKind: "lodging",
    lodgingType: "hotel",
    price: "$$$$",
    priceSource: "Official property booking page",
    attributeTags: ["luxury", "historic", "central", "scenic"],
    hours: hours.hotel,
    officialUrl:
      "https://www.fairmont.com/en/hotels/shanghai/fairmont-peace-hotel.html",
    bookingUrl:
      "https://www.fairmont.com/en/hotels/shanghai/fairmont-peace-hotel/rooms.html",
    sourcePhoto: commons("Shanghai Fairmont Peace Hotel-20150516-RM-125411.jpg"),
  }),
  stop({
    id: "shanghai-hotel-waldorf-astoria",
    name: "Waldorf Astoria Shanghai on the Bund",
    neighborhood: "The Bund",
    coordinates: [31.2331, 121.4892],
    description:
      "Waldorf Astoria joins the historic Shanghai Club building to a newer tower, creating a formal Bund stay with river views and easy Old City access.",
    venueKind: "lodging",
    lodgingType: "hotel",
    price: "$$$$",
    priceSource: "Official property booking page",
    attributeTags: ["luxury", "historic", "central", "romantic"],
    hours: hours.hotel,
    officialUrl:
      "https://www.hilton.com/en/hotels/shawawa-waldorf-astoria-shanghai-on-the-bund/",
    bookingUrl:
      "https://www.hilton.com/en/hotels/shawawa-waldorf-astoria-shanghai-on-the-bund/rooms/",
    sourcePhoto: commons(
      "Waldorf Astoria - The Bund - Shanghai, China (9067025468).jpg",
    ),
  }),
  stop({
    id: "shanghai-hotel-mandarin-oriental",
    name: "Mandarin Oriental Pudong",
    neighborhood: "Lujiazui",
    coordinates: [31.2452, 121.5092],
    description:
      "Mandarin Oriental sits on the quieter north Lujiazui riverfront, pairing large rooms, a substantial spa, and promenade access with a longer trip to Puxi nightlife.",
    venueKind: "lodging",
    lodgingType: "hotel",
    price: "$$$$",
    priceSource: "Official property booking page",
    attributeTags: ["luxury", "scenic", "wellness", "quiet"],
    hours: hours.hotel,
    officialUrl: "https://www.mandarinoriental.com/en/shanghai/pudong",
    bookingUrl:
      "https://www.mandarinoriental.com/en/shanghai/pudong/stay",
    sourcePhoto:
      "https://media.ffycdn.net/eu/mandarin-oriental-hotel-group/Szq8MMmpoLyEYsaL5xyL.jpg",
  }),
  stop({
    id: "shanghai-hotel-peninsula",
    name: "The Peninsula Shanghai",
    neighborhood: "The Bund",
    coordinates: [31.2388, 121.4864],
    description:
      "The Peninsula provides a quieter north-Bund address, generous rooms, polished traditional service, and rooftop views that work especially well for first-time city visits.",
    venueKind: "lodging",
    lodgingType: "hotel",
    price: "$$$$",
    priceSource: "Official property booking page",
    attributeTags: ["luxury", "central", "scenic", "romantic"],
    hours: hours.hotel,
    officialUrl:
      "https://www.peninsula.com/en/shanghai/5-star-luxury-hotel-bund",
    bookingUrl:
      "https://www.peninsula.com/en/shanghai/5-star-luxury-hotel-bund/rooms-suites",
    sourcePhoto: commons("The Peninsula Shanghai.JPG"),
  }),
];

const hostelStops: GuideStop[] = [
  stop({
    id: "shanghai-hostel-dayin-east-nanjing",
    name: "Dayin Hostel — East Nanjing Road & The Bund",
    neighborhood: "People's Square",
    coordinates: [31.2386, 121.4674],
    description:
      "Dayin's Liuhe Road flagship mixes bunks with a café, craft-beer bar, books, laundry, and a social lobby within walking distance of People's Square.",
    venueKind: "lodging",
    lodgingType: "hostel",
    price: "$$",
    priceSource: "Hostelworld live dorm and private-room inventory",
    attributeTags: ["budget", "social", "central", "solo_friendly"],
    hours: {
      default:
        "Daily; reception open 24 hours, check-in 2:00 PM-11:00 PM, and checkout by 12:00 PM on the Hostelworld property page.",
    },
    officialUrl:
      "https://www.hostelworld.com/hostels/p/312935/dayin-hostel-east-nanjing-road-and-the-bund/",
    bookingUrl:
      "https://www.hostelworld.com/hostels/p/312935/dayin-hostel-east-nanjing-road-and-the-bund/",
    sourcePhoto:
      "https://a.hwstatic.com/image/upload/f_auto,q_auto,h_320,c_limit,e_sharpen,e_improve,e_vibrance:60/propertyimages/3/312935/tz14e79wq5bzguyjhlcu.jpg",
  }),
  stop({
    id: "shanghai-hostel-desti-jingan",
    name: "Shanghai Desti Youth Hostel — Jing'an Temple",
    neighborhood: "Jing'an",
    coordinates: [31.2355, 121.444],
    description:
      "Desti combines soundproof sleeping pods, lockers, a café-bar, games, and an event stage near Changping Road, making it the strongest explicitly social Jing'an option.",
    venueKind: "lodging",
    lodgingType: "hostel",
    price: "$$",
    priceSource: "Hostelworld live dorm and private-room inventory",
    attributeTags: ["budget", "social", "central", "lively"],
    hours: {
      default:
        "Daily; reception open 24 hours, check-in 2:00 PM-11:00 PM, and checkout by 12:00 PM on the Hostelworld property page.",
    },
    officialUrl:
      "https://www.hostelworld.com/hostels/p/335239/shanghai-desti-youth-hostel-jing-an-temple/",
    bookingUrl:
      "https://www.hostelworld.com/hostels/p/335239/shanghai-desti-youth-hostel-jing-an-temple/",
    sourcePhoto:
      "https://a.hwstatic.com/image/upload/f_auto,q_auto,h_320,c_limit,e_sharpen,e_improve,e_vibrance:60/propertyimages/3/335239/mq6nwqzrbjm9qwxon4in.jpg",
  }),
  stop({
    id: "shanghai-hostel-hi-cozy-bund",
    name: "Hi Cozy Hostel Shanghai Bund",
    neighborhood: "Huangpu",
    coordinates: [31.2303, 121.474],
    description:
      "Hi Cozy pairs modern dorms and private rooms with coworking space on South Shanxi Road, useful for travelers splitting work time between the Bund and central Shanghai.",
    venueKind: "lodging",
    lodgingType: "hostel",
    price: "$$",
    priceSource: "Hostelworld live dorm and private-room inventory",
    attributeTags: ["budget", "work_friendly", "central", "solo_friendly"],
    hours: {
      default:
        "Daily; check-in 2:00 PM-11:00 PM and checkout by 12:00 PM on the Hostelworld property page.",
    },
    officialUrl:
      "https://www.hostelworld.com/hostels/p/334052/hi-cozy-hostel-shanghai-bund/",
    bookingUrl:
      "https://www.hostelworld.com/hostels/p/334052/hi-cozy-hostel-shanghai-bund/",
    sourcePhoto:
      "https://a.hwstatic.com/image/upload/f_auto,q_auto,h_320,c_limit,e_sharpen,e_improve,e_vibrance:60/propertyimages/3/334052/j14tpzisndelipnikdfb.jpg",
  }),
  stop({
    id: "shanghai-hostel-dayin-tianzifang",
    name: "Dayin Youth Hostel — Tianzifang & Xintiandi",
    neighborhood: "Former French Concession",
    coordinates: [31.2094, 121.468],
    description:
      "This compact Dayin branch sits between Tianzifang and Xintiandi, trading the chain's largest social spaces for clean bunks and unusually strong lane-walking access.",
    venueKind: "lodging",
    lodgingType: "hostel",
    price: "$$",
    priceSource: "Hostelworld live dorm and private-room inventory",
    attributeTags: ["budget", "central", "solo_friendly", "walkable"],
    hours: {
      default:
        "Daily lodging operation; check-in, checkout, and reception windows are published on the Hostelworld booking page.",
    },
    officialUrl:
      "https://www.hostelworld.com/hostels/p/338225/dayin-youth-hostel-tianzifang-and-xintiandi/",
    bookingUrl:
      "https://www.hostelworld.com/hostels/p/338225/dayin-youth-hostel-tianzifang-and-xintiandi/",
    sourcePhoto:
      "https://a.hwstatic.com/image/upload/f_auto,q_auto,h_320,c_limit,e_sharpen,e_improve,e_vibrance:60/propertyimages/3/338225/wqfeitbcvrwptttn9m9j.jpg",
  }),
  stop({
    id: "shanghai-hostel-dayin-garden-lujiazui",
    name: "Dayin Garden Hostel — Oriental Pearl & Lujiazui",
    neighborhood: "Lujiazui",
    coordinates: [31.238, 121.512],
    description:
      "Dayin Garden adds a terrace, garden, food, beer, free laundry, and ensuite dorms to the usual bunk format, making Pudong practical for longer budget stays.",
    venueKind: "lodging",
    lodgingType: "hostel",
    price: "$$",
    priceSource: "Hostelworld live dorm and private-room inventory",
    attributeTags: ["budget", "social", "scenic", "group_friendly"],
    hours: {
      default:
        "Daily; reception open 24 hours, with check-in and checkout windows published on the Hostelworld property page.",
    },
    officialUrl:
      "https://www.hostelworld.com/hostels/p/278757/dayin-garden-hostel-oriental-pearl-and-lujiazui/",
    bookingUrl:
      "https://www.hostelworld.com/hostels/p/278757/dayin-garden-hostel-oriental-pearl-and-lujiazui/",
    sourcePhoto:
      "https://a.hwstatic.com/image/upload/f_auto,q_auto,h_320,c_limit,e_sharpen,e_improve,e_vibrance:60/propertyimages/2/278757/j05vmuhuzdb7uncmfalb.jpg",
  }),
  stop({
    id: "shanghai-hostel-weflow-xintiandi",
    name: "WeFlow Hostel Shanghai Xintiandi",
    neighborhood: "Xintiandi",
    coordinates: [31.213, 121.468],
    description:
      "WeFlow uses private pods, lockers, charging points, a shared fridge, and microwave to deliver a quieter, more self-contained hostel experience near Xintiandi.",
    venueKind: "lodging",
    lodgingType: "hostel",
    price: "$$",
    priceSource: "Hostelworld live dorm inventory",
    attributeTags: ["budget", "quiet", "central", "solo_friendly"],
    hours: {
      default:
        "Daily; reception open 24 hours, check-in 1:00 PM-12:00 AM, and checkout by 12:00 PM on Hostelworld.",
    },
    officialUrl:
      "https://www.hostelworld.com/hostels/p/325242/weflow-hostel-shanghai-xintiandi/",
    bookingUrl:
      "https://www.hostelworld.com/hostels/p/325242/weflow-hostel-shanghai-xintiandi/",
    sourcePhoto:
      "https://a.hwstatic.com/image/upload/f_auto,q_auto,h_320,c_limit,e_sharpen,e_improve,e_vibrance:60/propertyimages/3/325242/bwrtmkmefrskppvudzu5.jpg",
  }),
  stop({
    id: "shanghai-hostel-dayin-old-town",
    name: "Dayin Hostel — People's Square & Old Town",
    neighborhood: "Old City",
    coordinates: [31.222, 121.477],
    description:
      "A large rooftop camping terrace, brunch café, beer, books, and practical laundry facilities make this Dayin branch a social base between People's Square and the Old City.",
    venueKind: "lodging",
    lodgingType: "hostel",
    price: "$$",
    priceSource: "Hostelworld live dorm and private-room inventory",
    attributeTags: ["budget", "social", "central", "lively"],
    hours: {
      default:
        "Daily; reception open 24 hours, with check-in and checkout windows published on the Hostelworld property page.",
    },
    officialUrl:
      "https://www.hostelworld.com/hostels/p/327548/dayin-hostel-people-s-square-and-old-town/",
    bookingUrl:
      "https://www.hostelworld.com/hostels/p/327548/dayin-hostel-people-s-square-and-old-town/",
    sourcePhoto:
      "https://a.hwstatic.com/image/upload/f_auto,q_auto,h_320,c_limit,e_sharpen,e_improve,e_vibrance:60/propertyimages/3/327548/f1ssucvbtdlju11iw9q6.jpg",
  }),
  stop({
    id: "shanghai-hostel-dayin-suzhou-creek",
    name: "Dayin Hostel — People's Square & Nanjing Road",
    neighborhood: "Suzhou Creek",
    coordinates: [31.2445, 121.472],
    description:
      "The Minde Road Dayin sits close to Suzhou Creek and five metro lines, combining design-hotel polish with a café, craft beer, books, and dorm beds.",
    venueKind: "lodging",
    lodgingType: "hostel",
    price: "$$",
    priceSource: "Hostelworld live dorm and private-room inventory",
    attributeTags: ["budget", "design", "central", "work_friendly"],
    hours: {
      default:
        "Daily lodging operation; check-in, checkout, and reception windows are published on the Hostelworld booking page.",
    },
    officialUrl:
      "https://www.hostelworld.com/hostels/p/328754/dayin-hostel-people-s-square-and-nanjing-road/",
    bookingUrl:
      "https://www.hostelworld.com/hostels/p/328754/dayin-hostel-people-s-square-and-nanjing-road/",
    sourcePhoto:
      "https://a.hwstatic.com/image/upload/f_auto,q_auto,h_320,c_limit,e_sharpen,e_improve,e_vibrance:60/propertyimages/3/328754/y3wkboo5q9gisskyoajz.jpg",
  }),
  stop({
    id: "shanghai-hostel-meego",
    name: "Meego Youth Hotel",
    neighborhood: "Jing'an",
    coordinates: [31.239, 121.449],
    description:
      "Meego mixes dorms, multi-bed rooms, and private rooms around a communal hall, water bar, and video room, favoring practical downtown access over boutique styling.",
    venueKind: "lodging",
    lodgingType: "hostel",
    price: "$",
    priceSource: "Hostelworld live dorm and private-room inventory",
    attributeTags: ["budget", "social", "central", "group_friendly"],
    hours: {
      default:
        "Daily; reception and check-in operate 24 hours, with checkout rules published on the Hostelworld property page.",
    },
    officialUrl:
      "https://www.hostelworld.com/hostels/p/284448/meego-youth-hotel/",
    bookingUrl:
      "https://www.hostelworld.com/hostels/p/284448/meego-youth-hotel/",
    sourcePhoto:
      "https://a.hwstatic.com/image/upload/f_auto,q_auto,h_320,c_limit,e_sharpen,e_improve,e_vibrance:60/propertyimages/2/284448/n7qtm21qe0szowayrvlb.jpg",
  }),
  stop({
    id: "shanghai-hostel-mijia",
    name: "Mijia International Youth Hostel",
    neighborhood: "People's Square",
    coordinates: [31.237, 121.461],
    description:
      "Mijia is a newer social hostel near People's Square, using colorful common areas and central transit to serve travelers who want easy group interaction.",
    venueKind: "lodging",
    lodgingType: "hostel",
    price: "$$",
    priceSource: "Hostelworld live dorm and private-room inventory",
    attributeTags: ["budget", "social", "central", "solo_friendly"],
    hours: {
      default:
        "Daily; check-in 2:00 PM-11:00 PM and checkout by 12:00 PM on the Hostelworld property page.",
    },
    officialUrl:
      "https://www.hostelworld.com/hostels/p/334709/mijia-international-youth-hostel-people-s-square/",
    bookingUrl:
      "https://www.hostelworld.com/hostels/p/334709/mijia-international-youth-hostel-people-s-square/",
    sourcePhoto:
      "https://a.hwstatic.com/image/upload/f_auto,q_auto,h_320,c_limit,e_sharpen,e_improve,e_vibrance:60/propertyimages/3/334709/dfxxnwgwzk0vxni9mcco.jpg",
  }),
];

const casualBarStops: GuideStop[] = [
  stop({
    id: "shanghai-casual-cages",
    name: "Cages Bar and Sports",
    neighborhood: "Jing'an",
    coordinates: [31.235134, 121.453072],
    description:
      "Cages is Shanghai's maximalist sports-bar option: a huge room, dozens of screens, batting cages, arcade games, American bar food, and enough capacity for major fixtures.",
    venueKind: "nightlife",
    nightlifeType: "sports_bar",
    price: "$$",
    priceSource: "SmartShanghai current venue listing",
    attributeTags: ["sports_screening", "games", "group_friendly", "lively_nightlife"],
    hours: {
      mon: "11:00 AM-2:00 AM",
      tue: "11:00 AM-2:00 AM",
      wed: "11:00 AM-2:00 AM",
      thu: "11:00 AM-2:00 AM",
      fri: "11:00 AM-2:00 AM",
      sat: "9:00 AM-2:00 AM",
      sun: "9:00 AM-2:00 AM",
    },
    officialUrl:
      "https://www.smartshanghai.com/venue/13509/cages_bar_and_sports",
    sourcePhoto:
      "https://images.smartshanghai.com.cn/uploads/repository/2021/01/20/f3eeab34-d437-4ded-8bee-9467a8f55e01.jpeg",
    editorialUrls: [
      "https://www.smartshanghai.com/articles/sports-and-recreation/where-and-when-to-watch-the-2026-world-cup",
    ],
  }),
  stop({
    id: "shanghai-casual-specters",
    name: "Specters",
    neighborhood: "C·PARK, Changning",
    coordinates: [31.213961, 121.419601],
    description:
      "Specters' third incarnation keeps the punk-and-misfit spirit, cheap beer, pool, foosball, and unpredictable rock soundtrack while adding two floors and more breathing room.",
    venueKind: "nightlife",
    nightlifeType: "dive_bar",
    musicGenres: ["punk", "rock", "alternative"],
    price: "$",
    priceSource: "SmartShanghai venue listing and current deals",
    attributeTags: ["cheap_drinks", "local_bar", "live_music", "late_late"],
    hours: hours.liveVenue,
    officialUrl:
      "https://www.smartshanghai.com/venue/34241/specters_c_park",
    sourcePhoto:
      "https://images.smartshanghai.com.cn/uploads/repository/2025/12/22/e54b76b6-65f1-43fc-9afe-f3363b540037.jpg",
  }),
  stop({
    id: "shanghai-casual-the-shed",
    name: "The Shed",
    neighborhood: "Jing'an",
    coordinates: [31.2344, 121.449997],
    description:
      "The Shed is an old-school neighborhood sports pub where cold beer, unfussy food, televised matches, and a regular crowd matter more than polished interiors.",
    venueKind: "nightlife",
    nightlifeType: "sports_bar",
    price: "$$",
    priceSource: "SmartShanghai current venue listing",
    attributeTags: ["sports_screening", "casual_nightlife", "local_bar", "group_friendly"],
    hours: hours.liveVenue,
    officialUrl: "https://www.smartshanghai.com/venue/6115/The_Shed",
    sourcePhoto:
      "https://images.smartshanghai.com.cn/uploads/repository/2020/07/30/ce5dfe7f-ddfc-4e5f-bb11-8c09e7f3a4f8.jpeg",
    editorialUrls: [
      "https://www.smartshanghai.com/articles/sports-and-recreation/where-and-when-to-watch-the-2026-world-cup",
    ],
  }),
  stop({
    id: "shanghai-casual-abbey-road",
    name: "Abbey Road",
    neighborhood: "Xuhui",
    coordinates: [31.208952, 121.451141],
    description:
      "Abbey Road's shaded Taojiang Road patio, accessible food, live music, and sports screens make it a forgiving group choice before a more ambitious night.",
    venueKind: "nightlife",
    nightlifeType: "pub",
    musicGenres: ["rock", "pop", "acoustic"],
    price: "$$",
    priceSource: "SmartShanghai current venue listing",
    attributeTags: ["live_music", "sports_screening", "group_friendly", "casual_nightlife"],
    hours: hours.liveVenue,
    officialUrl:
      "https://www.smartshanghai.com/venue/11846/abbey_road_taojiang_lu",
    sourcePhoto:
      "https://images.smartshanghai.com.cn/uploads/repository/2020/08/25/abdcbd0d-cd73-4aa1-9ec9-eb34da02701f.jpeg",
    editorialUrls: [
      "https://www.smartshanghai.com/articles/sports-and-recreation/where-and-when-to-watch-the-2026-world-cup",
    ],
  }),
  stop({
    id: "shanghai-casual-parlay",
    name: "Parlay",
    neighborhood: "Shankang Li",
    coordinates: [31.235125, 121.450073],
    description:
      "Parlay brings a newer sports-bar format to Shankang Li, with selected match screenings, a social courtyard setting, and an easy handoff to nearby Jing'an bars.",
    venueKind: "nightlife",
    nightlifeType: "sports_bar",
    price: "$$",
    priceSource: "SmartShanghai current venue listing",
    attributeTags: ["sports_screening", "social", "group_friendly", "walk_in_friendly_nightlife"],
    hours: hours.liveVenue,
    officialUrl: "https://www.smartshanghai.com/venue/31343/parlay",
    sourcePhoto:
      "https://images.smartshanghai.com.cn/uploads/repository/2024/05/20/83e8f7fd-62e4-4e3a-ad0c-d516e6b5d93c.jpg",
    editorialUrls: [
      "https://www.smartshanghai.com/articles/sports-and-recreation/where-and-when-to-watch-the-2026-world-cup",
    ],
  }),
  stop({
    id: "shanghai-casual-grand-yard",
    name: "Grand Yard",
    neighborhood: "Jing'an",
    coordinates: [31.235077, 121.446472],
    description:
      "Grand Yard works as a laid-back neighborhood pub rather than a destination spectacle, with a courtyard, simple drinks, screens, and space for low-pressure groups.",
    venueKind: "nightlife",
    nightlifeType: "pub",
    price: "$$",
    priceSource: "SmartShanghai current venue listing",
    attributeTags: ["low_key_nightlife", "local_bar", "group_friendly", "sports_screening"],
    hours: hours.liveVenue,
    officialUrl:
      "https://www.smartshanghai.com/venue/14417/grand_yard_cafe_and_bar",
    sourcePhoto:
      "https://images.smartshanghai.com.cn/uploads/repository/2019/03/31/abfd6957-de82-4f85-91ec-61acc0e47ac3.jpeg",
    editorialUrls: [
      "https://www.smartshanghai.com/articles/sports-and-recreation/where-and-when-to-watch-the-2026-world-cup",
    ],
  }),
  stop({
    id: "shanghai-casual-zeitgeist",
    name: "Zeitgeist",
    neighborhood: "Jing'an",
    coordinates: [31.237015, 121.443542],
    description:
      "Zeitgeist is the city's Austrian-German gathering room, strongest for Bundesliga and national-team matches, draft beer, schnitzel, sausages, and communal tables.",
    venueKind: "nightlife",
    nightlifeType: "beer_bar",
    price: "$$",
    priceSource: "SmartShanghai current venue listing",
    attributeTags: ["sports_screening", "craft_beer", "group_friendly", "lively_nightlife"],
    hours: hours.liveVenue,
    officialUrl:
      "https://www.smartshanghai.com/venue/14316/zeitgeist_bavarian_eatery_and_bar",
    sourcePhoto:
      "https://images.smartshanghai.com.cn/uploads/repository/2020/07/21/ff3116a7-b648-4091-b546-ac94bfbce961.jpeg",
    editorialUrls: [
      "https://www.smartshanghai.com/articles/sports-and-recreation/where-and-when-to-watch-the-2026-world-cup",
    ],
  }),
  stop({
    id: "shanghai-casual-big-bamboo",
    name: "Big Bamboo",
    neighborhood: "Hongqiao",
    coordinates: [31.191196, 121.387985],
    description:
      "Big Bamboo remains Hongqiao's reliable sports-pub default, useful when downtown travel is impractical and a broad food menu, patio, and match coverage solve the night.",
    venueKind: "nightlife",
    nightlifeType: "sports_bar",
    price: "$$",
    priceSource: "SmartShanghai current venue listing",
    attributeTags: ["sports_screening", "group_friendly", "casual_nightlife", "tourist_friendly"],
    hours: hours.liveVenue,
    officialUrl:
      "https://www.smartshanghai.com/venue/1908/Baby_Bamboo_shanghai",
    sourcePhoto:
      "https://images.smartshanghai.com.cn/uploads/repository/2022/08/14/f0ce78ff-23ed-4166-aede-c0ec13fdf7f1.jpg",
  }),
  stop({
    id: "shanghai-casual-bamboo-river-house",
    name: "Bamboo River House",
    neighborhood: "Jinqiao",
    coordinates: [31.241922, 121.592819],
    description:
      "Bamboo River House gives Pudong and Jinqiao residents the Big Bamboo formula—screens, pub food, draft beer, and group tables—without crossing the river.",
    venueKind: "nightlife",
    nightlifeType: "sports_bar",
    price: "$$",
    priceSource: "SmartShanghai current venue listing",
    attributeTags: ["sports_screening", "group_friendly", "casual_nightlife", "local_bar"],
    hours: hours.liveVenue,
    officialUrl:
      "https://www.smartshanghai.com/venue/4220/Big_Bamboo_(Pudong)_shanghai",
    sourcePhoto:
      "https://images.smartshanghai.com.cn/uploads/repository/2022/08/14/19d8c1a3-ccab-433c-a5b9-b3547ed46f9a.jpg",
  }),
  stop({
    id: "shanghai-casual-home-field",
    name: "Home Field",
    neighborhood: "Minhang",
    coordinates: [31.176376, 121.373756],
    description:
      "Home Field is a neighborhood sports bar for Minhang, prioritizing televised fixtures, familiar drinks, and regulars over the journey into central Shanghai.",
    venueKind: "nightlife",
    nightlifeType: "sports_bar",
    price: "$$",
    priceSource: "SmartShanghai current venue listing",
    attributeTags: ["sports_screening", "local_bar", "casual_nightlife", "group_friendly"],
    hours: hours.liveVenue,
    officialUrl:
      "https://www.smartshanghai.com/venue/17000/home_field_xianfeng_jie",
    sourcePhoto:
      "https://images.smartshanghai.com.cn/uploads/repository/2021/12/31/06d768e3-8e09-43d9-8bfa-94c0ffc3b1c8.jpg",
  }),
];

const cocktailBarStops: GuideStop[] = [
  stop({
    id: "shanghai-cocktail-j-boroski",
    name: "J. Boroski",
    neighborhood: "Jing'an",
    coordinates: [31.21884, 121.451462],
    description:
      "J. Boroski is a dark, meticulously built speakeasy where bartenders work from guest preferences instead of a conventional menu; the bespoke format carries luxury pricing.",
    venueKind: "nightlife",
    nightlifeType: "cocktail_bar",
    price: "$$$",
    priceSource: "SmartShanghai current cocktail directory",
    attributeTags: ["craft_cocktails", "speakeasy", "premium_drinks", "date_night"],
    hours: hours.cocktail,
    officialUrl:
      "https://www.smartshanghai.com/venue/19853/j.boroski_fumin_lu",
    sourcePhoto:
      "https://images.smartshanghai.com.cn/uploads/repository/2020/07/31/3d855688-3d5d-4c7d-801b-da6c611f3fe5.jpeg",
  }),
  stop({
    id: "shanghai-cocktail-root-down",
    name: "Root Down",
    neighborhood: "Huangpu",
    coordinates: [31.217218, 121.463112],
    description:
      "Root Down pairs Japanese-led cocktails with vintage Tannoy speakers and focused funk, soul, jazz, and rare-groove vinyl, rewarding a bar seat and attentive listening.",
    venueKind: "nightlife",
    nightlifeType: "cocktail_bar",
    musicGenres: ["funk", "soul", "jazz"],
    price: "$$",
    priceSource: "SmartShanghai review updated April 2026",
    attributeTags: ["craft_cocktails", "low_key_nightlife", "solo_friendly", "date_night"],
    hours: {
      mon: "7:00 PM-1:30 AM",
      tue: "7:00 PM-1:30 AM",
      wed: "7:00 PM-1:30 AM",
      thu: "7:00 PM-1:30 AM",
      fri: "7:00 PM-2:00 AM",
      sat: "3:00 PM-2:00 AM",
      sun: "3:00 PM-2:00 AM",
    },
    officialUrl:
      "https://www.smartshanghai.com/venue/23551/root_down_nanchang_lu",
    sourcePhoto:
      "https://images.smartshanghai.com.cn/uploads/repository/2021/02/24/f1db7eb1-5350-4dc0-bec3-d8ec28f0e792.jpeg",
  }),
  stop({
    id: "shanghai-cocktail-senator-saloon",
    name: "Senator Saloon",
    neighborhood: "Xuhui",
    coordinates: [31.2131, 121.446999],
    description:
      "Senator Saloon has survived by protecting a simple formula: bourbon, Prohibition-era classics, barrel-aged drinks, dark wood, and a cozy room with little trend chasing.",
    venueKind: "nightlife",
    nightlifeType: "cocktail_bar",
    price: "$$",
    priceSource: "SmartShanghai review updated March 2026",
    attributeTags: ["craft_cocktails", "local_bar", "date_night", "low_key_nightlife"],
    hours: { default: "Daily 5:00 PM-1:00 AM on the current venue listing." },
    officialUrl:
      "https://www.smartshanghai.com/venue/7340/Senator_Saloon",
    bookingUrl: "https://www.senatorsaloon.com/",
    sourcePhoto:
      "https://images.smartshanghai.com.cn/uploads/repository/2020/07/31/2eed84bb-daae-4050-9749-399e998c6daa.jpeg",
  }),
  stop({
    id: "shanghai-cocktail-dead-poet",
    name: "Dead Poet",
    neighborhood: "Huangpu",
    coordinates: [31.22154, 121.459198],
    description:
      "Dead Poet favors subtle, slow-sipping cocktails and living-room seating on Jinxian Road, making the tight room better for a date or two friends than a crowd.",
    venueKind: "nightlife",
    nightlifeType: "cocktail_bar",
    price: "$$",
    priceSource: "SmartShanghai review updated March 2026",
    attributeTags: ["craft_cocktails", "date_night", "quiet", "low_key_nightlife"],
    hours: {
      mon: "5:00 PM-2:00 AM",
      tue: "5:00 PM-2:00 AM",
      wed: "5:00 PM-2:00 AM",
      thu: "5:00 PM-2:00 AM",
      fri: "5:00 PM-3:00 AM",
      sat: "5:00 PM-3:00 AM",
      sun: "5:00 PM-2:00 AM",
    },
    officialUrl:
      "https://www.smartshanghai.com/venue/17860/dead_poet_jinxian_lu",
    sourcePhoto:
      "https://images.smartshanghai.com.cn/uploads/repository/2020/07/22/4341de4f-ab83-4a9d-8b5c-5fcc3170a020.jpeg",
  }),
  stop({
    id: "shanghai-cocktail-speak-low",
    name: "Speak Low",
    neighborhood: "Former French Concession",
    coordinates: [31.215033, 121.466637],
    description:
      "Hidden behind a bartending-equipment shop, Speak Low stacks several rooms with rising intensity and price, from lively classics to intimate premium pours upstairs.",
    venueKind: "nightlife",
    nightlifeType: "cocktail_bar",
    price: "$$$",
    priceSource: "SmartShanghai review updated April 2026",
    attributeTags: ["speakeasy", "craft_cocktails", "lively_nightlife", "reservation_recommended_nightlife"],
    hours: {
      mon: "6:00 PM-1:30 AM",
      tue: "6:00 PM-1:30 AM",
      wed: "6:00 PM-1:30 AM",
      thu: "6:00 PM-1:30 AM",
      fri: "6:00 PM-2:30 AM",
      sat: "6:00 PM-2:30 AM",
      sun: "6:00 PM-1:30 AM",
    },
    officialUrl:
      "https://www.smartshanghai.com/venue/11327/speak_low",
    sourcePhoto:
      "https://images.smartshanghai.com.cn/uploads/repository/2020/07/31/0774667e-9015-450d-abf8-55ca617df4b1.jpeg",
  }),
  stop({
    id: "shanghai-cocktail-bar-no-3",
    name: "Bar No. 3",
    neighborhood: "Changning",
    coordinates: [31.205315, 121.437546],
    description:
      "Bar No. 3 is an unusually comfortable all-day cocktail room with low seating, measured jazz, strong classics, and a small terrace suited to unhurried dates.",
    venueKind: "nightlife",
    nightlifeType: "cocktail_bar",
    price: "$$",
    priceSource: "SmartShanghai review updated March 2026",
    attributeTags: ["craft_cocktails", "date_night", "low_key_nightlife", "walk_in_friendly_nightlife"],
    hours: { default: "Daily 11:00 AM-2:00 AM on the current venue listing." },
    officialUrl:
      "https://www.smartshanghai.com/venue/11835/bar_no._3",
    sourcePhoto:
      "https://images.smartshanghai.com.cn/uploads/repository/2024/03/21/be326d91-c495-4e50-a605-14bda513234a.jpg",
  }),
  stop({
    id: "shanghai-cocktail-healer",
    name: "Healer",
    neighborhood: "Xuhui",
    coordinates: [31.203419, 121.437767],
    description:
      "Healer builds cocktails around Chinese herbs, teas, fruits, and medicinal ideas, delivering an unmistakably local vocabulary without turning the drinks into costume.",
    venueKind: "nightlife",
    nightlifeType: "cocktail_bar",
    price: "$$",
    priceSource: "SmartShanghai current cocktail directory",
    attributeTags: ["craft_cocktails", "local_bar", "date_night", "premium_drinks"],
    hours: hours.cocktail,
    officialUrl: "https://www.smartshanghai.com/venue/14037/healer",
    sourcePhoto:
      "https://images.smartshanghai.com.cn/uploads/repository/2020/07/31/ed70eb26-a001-4766-9289-70d3b7856f05.jpeg",
  }),
  stop({
    id: "shanghai-cocktail-union-trading",
    name: "Union Trading Company",
    neighborhood: "Xuhui",
    coordinates: [31.211517, 121.45401],
    description:
      "Union Trading Company balances stiff American-style classics, bourbon, brandy, and house infusions with enough bar food and warmth to remain social rather than reverential.",
    venueKind: "nightlife",
    nightlifeType: "cocktail_bar",
    price: "$$",
    priceSource: "SmartShanghai current cocktail directory",
    attributeTags: ["craft_cocktails", "group_friendly", "lively_nightlife", "local_bar"],
    hours: {
      mon: "6:00 PM-2:00 AM",
      tue: "6:00 PM-2:00 AM",
      wed: "6:00 PM-2:00 AM",
      thu: "6:00 PM-2:00 AM",
      fri: "6:00 PM-2:00 AM",
      sat: "6:00 PM-2:00 AM",
      sun: "Closed",
    },
    officialUrl:
      "https://www.smartshanghai.com/venue/11351/union_trading_company",
    sourcePhoto:
      "https://images.smartshanghai.com.cn/uploads/repository/2020/07/31/45e26831-947c-470e-9c94-a9b533a7dfba.jpeg",
  }),
  stop({
    id: "shanghai-cocktail-coa",
    name: "COA Shanghai",
    neighborhood: "Huangpu",
    coordinates: [31.214899, 121.465034],
    description:
      "COA Shanghai spreads agave spirits across several levels, with mezcal, tequila, and flavor-driven cocktails connecting the Hong Kong original to a more expansive room.",
    venueKind: "nightlife",
    nightlifeType: "cocktail_bar",
    price: "$$",
    priceSource: "Asia's 50 Best Bars 2026 / SmartShanghai",
    attributeTags: ["craft_cocktails", "premium_drinks", "lively_nightlife", "date_night"],
    hours: hours.cocktail,
    officialUrl: "https://www.smartshanghai.com/venue/32392/coa",
    sourcePhoto:
      "https://images.smartshanghai.com.cn/uploads/repository/2024/08/22/1ebe15ce-1987-44f4-9fa4-4e0cf427bfd2.jpg",
    editorialUrls: [
      "https://www.theworlds50best.com/stories/News/asias-50-best-bars-2026-the-51-100-list-revealed.html",
    ],
  }),
  stop({
    id: "shanghai-cocktail-penicillin",
    name: "Penicillin Shanghai",
    neighborhood: "Huangpu",
    coordinates: [31.21946, 121.470093],
    description:
      "The Shanghai branch of Hong Kong's sustainability-minded Penicillin turns fermentation, preservation, and low-waste technique into bold drinks rather than a moralizing concept pitch.",
    venueKind: "nightlife",
    nightlifeType: "cocktail_bar",
    price: "$$$",
    priceSource: "SmartShanghai current cocktail directory",
    attributeTags: ["craft_cocktails", "premium_drinks", "design", "date_night"],
    hours: hours.cocktail,
    officialUrl:
      "https://www.smartshanghai.com/venue/34052/penicillin",
    sourcePhoto:
      "https://images.smartshanghai.com.cn/uploads/repository/2025/07/09/24ddb33c-8731-4fc6-ac48-510e0c547058.jpg",
  }),
];

const cultureStops: GuideStop[] = [
  stop({
    id: "shanghai-culture-museum-east",
    name: "Shanghai Museum East",
    neighborhood: "Pudong",
    coordinates: [31.2286, 121.5425],
    description:
      "The vast east branch gives ancient Chinese bronze, ceramics, calligraphy, painting, seals, jade, and archaeology enough room for deep study rather than a rushed highlights lap.",
    venueKind: "culture",
    price: "$",
    priceSource: "Free general admission; special-exhibition rules on official visit page",
    attributeTags: ["museum", "family_friendly", "accessible", "rainy_day"],
    hours: {
      mon: "10:00 AM-6:00 PM",
      tue: "Closed",
      wed: "10:00 AM-6:00 PM",
      thu: "10:00 AM-6:00 PM",
      fri: "10:00 AM-6:00 PM",
      sat: "10:00 AM-6:00 PM",
      sun: "10:00 AM-6:00 PM",
      default: "Last entry 5:00 PM; holiday openings are published on the official visit page.",
    },
    officialUrl:
      "https://www.shanghaimuseum.cn/mu/frontend/pg/en/service/visit-east",
    sourcePhoto: commons(
      "The Bronze Gallery, Shanghai Museum East (20251026164213).jpg",
    ),
    editorialUrls: [
      "https://english.shanghai.gov.cn/en-MuseumsGalleries/20241205/756c96bd7dd940378b9ac056f11429e2.html",
    ],
  }),
  stop({
    id: "shanghai-culture-museum-peoples-square",
    name: "Shanghai Museum — People's Square",
    neighborhood: "People's Square",
    coordinates: [31.2304, 121.4756],
    description:
      "The original People's Square museum remains the compact central counterpart to the east branch, with rotating exhibitions and collection displays inside its bronze-vessel-shaped landmark.",
    venueKind: "culture",
    price: "$",
    priceSource: "Free general admission; official exhibition and reservation page",
    attributeTags: ["museum", "central", "accessible", "rainy_day"],
    hours: {
      default:
        "Daily 10:00 AM-6:00 PM, last admission 5:00 PM; exhibition changeovers and temporary closures are published on the official visit page.",
    },
    officialUrl: "https://www.shanghaimuseum.cn/mu/frontend/pg/en/index",
    sourcePhoto: commons("2008 Shanghai People's Square- Shanghai Museum 2.jpg"),
    editorialUrls: [
      "https://english.shanghai.gov.cn/en-EditorsPick-travelinshanghai/20250828/e77b240fab254a3db8fbadec14645a9d.html",
    ],
  }),
  stop({
    id: "shanghai-culture-power-station-art",
    name: "Power Station of Art",
    neighborhood: "South Bund",
    coordinates: [31.2075, 121.4974],
    description:
      "China's first state-run contemporary-art museum occupies a converted power plant, giving the Shanghai Biennale, architecture, moving image, and large installations genuine industrial scale.",
    venueKind: "culture",
    price: "$",
    priceSource: "Free and ticketed exhibitions listed by the museum",
    attributeTags: ["museum", "design", "scenic", "rainy_day"],
    hours: {
      mon: "Closed",
      tue: "11:00 AM-7:00 PM",
      wed: "11:00 AM-7:00 PM",
      thu: "11:00 AM-7:00 PM",
      fri: "11:00 AM-7:00 PM",
      sat: "11:00 AM-7:00 PM",
      sun: "11:00 AM-7:00 PM",
      default: "Last entry 6:00 PM; national-holiday hours follow the official exhibition page.",
    },
    officialUrl: "https://www.powerstationofart.com/",
    sourcePhoto: commons("Interior of Power Station of Art.jpg"),
    editorialUrls: [
      "https://english.shanghai.gov.cn/en-MuseumsGalleries/20250702/64d1d26886b3458b8dffb3a8533787b5.html",
    ],
  }),
  stop({
    id: "shanghai-culture-museum-art-pudong",
    name: "Museum of Art Pudong",
    neighborhood: "Lujiazui",
    coordinates: [31.2388, 121.5058],
    description:
      "Jean Nouvel's riverfront museum pairs major international loans and ambitious temporary exhibitions with mirrored halls and direct sightlines back to the Bund.",
    venueKind: "culture",
    price: "$$",
    priceSource: "Official exhibition and ticket page",
    attributeTags: ["museum", "design", "scenic", "date_night"],
    hours: {
      default: "Daily 10:00 AM-9:00 PM, with last entry at 8:00 PM.",
    },
    officialUrl: "https://www.museumofartpd.org.cn/",
    sourcePhoto: commons("Museum of Art Pudong from the Bund.jpg"),
    editorialUrls: [
      "https://english.shanghai.gov.cn/en-MuseumsGalleries/20250702/64d1d26886b3458b8dffb3a8533787b5.html",
    ],
  }),
  stop({
    id: "shanghai-culture-rockbund",
    name: "Rockbund Art Museum",
    neighborhood: "Rockbund",
    coordinates: [31.2397, 121.4907],
    description:
      "Rockbund uses a restored Royal Asiatic Society building for tightly curated contemporary shows, preserving Art Deco detail while encouraging a slower neighborhood-scale visit.",
    venueKind: "culture",
    price: "$$",
    priceSource: "Official exhibition ticket page",
    attributeTags: ["museum", "design", "central", "quiet"],
    hours: {
      mon: "Closed",
      tue: "Closed",
      wed: "11:00 AM-8:00 PM",
      thu: "11:00 AM-8:00 PM",
      fri: "11:00 AM-8:00 PM",
      sat: "11:00 AM-8:00 PM",
      sun: "11:00 AM-8:00 PM",
      default: "Last entry 7:30 PM on the official museum schedule.",
    },
    officialUrl: "https://www.rockbundartmuseum.org/",
    sourcePhoto: commons("Rockbund Art Museum, Shanghai.JPG"),
    editorialUrls: [
      "https://english.shanghai.gov.cn/en-MuseumsGalleries/20250702/64d1d26886b3458b8dffb3a8533787b5.html",
    ],
  }),
  stop({
    id: "shanghai-culture-west-bund-museum",
    name: "West Bund Museum",
    neighborhood: "West Bund",
    coordinates: [31.1801, 121.459],
    description:
      "West Bund Museum combines David Chipperfield's riverfront architecture with Centre Pompidou collaborations and rotating contemporary programs, making the promenade part of the museum day.",
    venueKind: "culture",
    price: "$$",
    priceSource: "Official exhibition ticket page",
    attributeTags: ["museum", "design", "scenic", "family_friendly"],
    hours: {
      mon: "Closed",
      tue: "11:00 AM-6:00 PM",
      wed: "11:00 AM-6:00 PM",
      thu: "11:00 AM-6:00 PM",
      fri: "11:00 AM-6:00 PM",
      sat: "11:00 AM-6:00 PM",
      sun: "11:00 AM-6:00 PM",
      default: "Last entry 5:30 PM; special evening sessions follow the official exhibition page.",
    },
    officialUrl: "https://www.westbund.com/en/index/WEST-BUND-MUSEUM",
    sourcePhoto: commons("West Bund Museum, Shanghai, Jun 2020.jpg"),
    editorialUrls: [
      "https://english.shanghai.gov.cn/en-MuseumsGalleries/20250702/64d1d26886b3458b8dffb3a8533787b5.html",
    ],
  }),
  stop({
    id: "shanghai-culture-history-museum",
    name: "Shanghai History Museum",
    neighborhood: "People's Square",
    coordinates: [31.2343, 121.4672],
    description:
      "Inside the former Race Club, this museum traces Shanghai from ancient settlement through treaty-port transformation and revolution with maps, street scenes, objects, and architectural fragments.",
    venueKind: "culture",
    price: "$",
    priceSource: "Free admission on official tourism listing",
    attributeTags: ["museum", "historic", "central", "family_friendly"],
    hours: {
      mon: "Closed",
      tue: "9:00 AM-5:00 PM",
      wed: "9:00 AM-5:00 PM",
      thu: "9:00 AM-5:00 PM",
      fri: "9:00 AM-5:00 PM",
      sat: "9:00 AM-5:00 PM",
      sun: "9:00 AM-5:00 PM",
      default: "Last admission 4:00 PM; public-holiday openings follow the official museum notice.",
    },
    officialUrl:
      "https://www.meet-in-shanghai.net/en/revolutionary-memorial-site/shanghai-history-museum-shanghai-revolution-museum-422833/",
    sourcePhoto: commons("Gate of Shanghai History Museum.jpg"),
  }),
  stop({
    id: "shanghai-culture-jewish-refugees",
    name: "Shanghai Jewish Refugees Museum",
    neighborhood: "Hongkou",
    coordinates: [31.2558, 121.5038],
    description:
      "Built around Ohel Moshe Synagogue, the museum documents the roughly 20,000 Jewish refugees who found shelter in Shanghai and the constrained Hongkou lives they built.",
    venueKind: "culture",
    price: "$",
    priceSource: "Official museum ticket page",
    attributeTags: ["museum", "historic", "quiet", "accessible"],
    hours: {
      mon: "Closed",
      tue: "9:00 AM-5:00 PM",
      wed: "9:00 AM-5:00 PM",
      thu: "9:00 AM-5:00 PM",
      fri: "9:00 AM-5:00 PM",
      sat: "9:00 AM-5:00 PM",
      sun: "9:00 AM-5:00 PM",
      default: "Last entry 4:00 PM; statutory-holiday hours follow official announcements.",
    },
    officialUrl: "https://www.shhkjrm.com/en/About_Us/Plan_Your_Visit.htm",
    sourcePhoto: commons("Shanghai Jewish Refugees Museum courtyard.jpg"),
  }),
  stop({
    id: "shanghai-culture-china-art-museum",
    name: "China Art Museum",
    neighborhood: "Pudong",
    coordinates: [31.1867, 121.4901],
    description:
      "The vast former China Pavilion holds modern Chinese art, Shanghai-focused collection displays, and changing exhibitions inside one of the 2010 Expo's defining structures.",
    venueKind: "culture",
    price: "$",
    priceSource: "Official museum and exhibition page",
    attributeTags: ["museum", "architecture", "family_friendly", "rainy_day"],
    hours: {
      mon: "Closed",
      tue: "10:00 AM-6:00 PM",
      wed: "10:00 AM-6:00 PM",
      thu: "10:00 AM-6:00 PM",
      fri: "10:00 AM-6:00 PM",
      sat: "10:00 AM-6:00 PM",
      sun: "10:00 AM-6:00 PM",
      default: "Last entry 5:00 PM; holiday openings follow the official exhibition page.",
    },
    officialUrl:
      "https://english.shanghai.gov.cn/en-MuseumsGalleries/20241018/dfda779aa5f644f48f99e89ffb745703.html",
    sourcePhoto: commons("China Art Museum, Shanghai.jpg"),
  }),
  stop({
    id: "shanghai-culture-propaganda-poster",
    name: "Propaganda Poster Art Centre",
    neighborhood: "Changning",
    coordinates: [31.215, 121.425],
    description:
      "Yang Peiming's private collection uses original Mao-era posters to show how graphic design, mass persuasion, political campaigns, and daily aspiration changed across decades.",
    venueKind: "culture",
    price: "$",
    priceSource: "Current SmartShanghai ticket listing",
    attributeTags: ["museum", "historic", "offbeat", "rainy_day"],
    hours: {
      default: "Daily 10:00 AM-5:00 PM, with last entrance at 4:30 PM.",
    },
    officialUrl: "http://www.shanghaipropagandaart.com/",
    sourcePhoto:
      "https://images.smartshanghai.com.cn/uploads/repository/2020/07/22/d0b5595f-fcd7-4352-a522-454a2afbfb76.jpeg",
    editorialUrls: [
      "https://www.smartshanghai.com/venue/18654/propaganda_poster_art_centre_yanan_xi_lu",
    ],
  }),
];

const activityStops: GuideStop[] = [
  stop({
    id: "shanghai-activity-the-bund",
    name: "The Bund Promenade",
    neighborhood: "The Bund",
    coordinates: [31.2381, 121.4902],
    description:
      "Walk the riverfront early or after dark to read Shanghai's geography in one view: treaty-port facades west, Pudong towers east, and working river traffic between.",
    venueKind: "outdoors",
    price: "$",
    priceSource: "Free public promenade",
    attributeTags: ["scenic", "walkable", "family_friendly", "central"],
    hours: {
      default:
        "Open 24 hours daily as a public promenade; temporary riverfront restrictions follow official city notices.",
    },
    officialUrl: "https://english.shanghai.gov.cn/en-TravelinShanghai/index.html",
    sourcePhoto: commons("Promenade -The Bund (Wai Tan) Shanghai- (685405681).jpg"),
  }),
  stop({
    id: "shanghai-activity-yu-garden",
    name: "Yu Garden",
    neighborhood: "Old City",
    coordinates: [31.227, 121.492],
    description:
      "Yu Garden compresses Ming-style rockeries, ponds, pavilions, corridors, and borrowed views into a dense historic garden; arrive near opening before the surrounding bazaar peaks.",
    venueKind: "landmark",
    price: "$",
    priceSource: "Official timed-ticket page",
    attributeTags: ["historic", "garden", "family_friendly", "central"],
    hours: {
      default:
        "Daily 9:00 AM-4:30 PM, with last entry at 4:00 PM; seasonal and holiday sessions follow the official timed-ticket page.",
    },
    officialUrl: "https://www.yugarden.com.cn/",
    sourcePhoto: commons("Yuyuan Garden 3.jpg"),
  }),
  stop({
    id: "shanghai-activity-shanghai-tower",
    name: "Top of Shanghai Observatory",
    neighborhood: "Lujiazui",
    coordinates: [31.2336, 121.5055],
    description:
      "The Shanghai Tower observatory delivers the clearest high-altitude lesson in the city's scale, best timed for clear weather when the Bund, river bends, and outer districts remain visible.",
    venueKind: "landmark",
    price: "$$",
    priceSource: "Official observatory ticket page",
    attributeTags: ["scenic", "ticketed", "family_friendly", "accessible"],
    hours: {
      default:
        "Daily 8:30 AM-10:00 PM, with last admission at 9:30 PM; weather restrictions follow the official timed-ticket page.",
    },
    officialUrl: "https://en.shanghaitower.com/",
    sourcePhoto: commons("View from Shanghai Tower Observation Deck.jpg"),
  }),
  stop({
    id: "shanghai-activity-huangpu-cruise",
    name: "Huangpu River Cruise",
    neighborhood: "Shiliupu",
    coordinates: [31.2206, 121.4983],
    description:
      "A one-hour river cruise makes the Bund-Pudong contrast legible without sidewalk crowds, especially after sunset when both banks become a continuous architectural light show.",
    venueKind: "transport",
    price: "$$",
    priceSource: "Official cruise ticket and timetable page",
    attributeTags: ["scenic", "ticketed", "family_friendly", "romantic"],
    hours: {
      default:
        "Daily departures operate from late morning through about 9:30 PM; exact sailings and weather cancellations are published on the official timetable.",
    },
    officialUrl:
      "https://english.shanghai.gov.cn/en-ScenicSpots/20231229/3435873037a94772828128cd49858f75.html",
    timetableUrl:
      "https://english.shanghai.gov.cn/en-TravelinShanghai/index.html",
    sourcePhoto: commons("Shanghai- Huangpu river cruise (584850359).jpg"),
  }),
  stop({
    id: "shanghai-activity-wukang-road",
    name: "Wukang Road Walk",
    neighborhood: "Former French Concession",
    coordinates: [31.2012, 121.4388],
    description:
      "Wukang Road is best treated as an architecture walk, linking plane trees, villas, the Wukang Mansion, small galleries, cafés, and quieter side streets rather than one photo stop.",
    venueKind: "outdoors",
    price: "$",
    priceSource: "Free public streets",
    attributeTags: ["walkable", "historic", "architecture", "solo_friendly"],
    hours: {
      default:
        "Open 24 hours daily as public streets; museums, shops, and residences along the route keep their own official hours.",
    },
    officialUrl: "https://english.shanghai.gov.cn/en-TravelinShanghai/index.html",
    sourcePhoto: commons("Street View of Wukang Road.JPG"),
  }),
  stop({
    id: "shanghai-activity-disneyland",
    name: "Shanghai Disneyland",
    neighborhood: "Pudong",
    coordinates: [31.1443, 121.657],
    description:
      "Shanghai Disneyland is a full-day logistics project with a distinct castle, TRON, Zootopia, and resort transport; advance tickets and an early arrival matter on busy dates.",
    venueKind: "landmark",
    price: "$$$",
    priceSource: "Official Disney date-specific ticket calendar",
    attributeTags: ["family_friendly", "ticketed", "theme_park", "day_trip"],
    hours: {
      default:
        "The official calendar and timed ticket page publish each date's opening, early-entry, parade, and ride windows.",
    },
    officialUrl: "https://www.shanghaidisneyresort.com/en/",
    timetableUrl:
      "https://www.shanghaidisneyresort.com/en/calendars/day/",
    sourcePhoto: commons("Shanghai Disneyland Park Main Entry.jpg"),
  }),
  stop({
    id: "shanghai-activity-zhujiajiao",
    name: "Zhujiajiao Ancient Town",
    neighborhood: "Qingpu",
    coordinates: [31.1074, 121.0567],
    description:
      "Zhujiajiao offers canals, stone bridges, lanes, temples, gardens, and short boat rides within metro reach, but the reward improves sharply beyond the busiest central bridge.",
    venueKind: "outdoors",
    price: "$",
    priceSource: "Public town access; individual sights and boats ticketed",
    attributeTags: ["day_trip", "historic", "scenic", "walkable"],
    hours: {
      default:
        "Public lanes remain open 24 hours daily; ticketed gardens, temples, and boats generally operate 8:30 AM-4:30 PM on the official attraction schedule.",
    },
    officialUrl: "https://www.zhujiajiao.com/",
    sourcePhoto: commons("1 zhujiajiao ancient water town 2023.jpg"),
  }),
  stop({
    id: "shanghai-activity-circus-world",
    name: "Shanghai Circus World",
    neighborhood: "Jing'an",
    coordinates: [31.2794, 121.4481],
    description:
      "The purpose-built arena hosts ERA's high-production acrobatics, combining traditional physical disciplines with staging, projection, and live spectacle in a compact evening format.",
    venueKind: "event_venue",
    price: "$$",
    priceSource: "Official ERA performance and seat-selection page",
    attributeTags: ["ticketed", "family_friendly", "theatre_show", "rainy_day"],
    hours: {
      default:
        "Performance days and curtain times are published on the official show calendar; doors and box office follow the selected ticket session.",
    },
    officialUrl: "https://www.era-shanghai.com/",
    timetableUrl: "https://www.era-shanghai.com/",
    sourcePhoto: commons("Shanghai Circus World, exterior.jpg"),
  }),
  stop({
    id: "shanghai-activity-ocean-aquarium",
    name: "Shanghai Ocean Aquarium",
    neighborhood: "Lujiazui",
    coordinates: [31.2401, 121.4988],
    description:
      "The aquarium's long underwater tunnel and geographically organized galleries make it a dependable family or bad-weather stop beside the Oriental Pearl, though weekends become crowded.",
    venueKind: "landmark",
    price: "$$",
    priceSource: "Official aquarium ticket page",
    attributeTags: ["family_friendly", "ticketed", "rainy_day", "accessible"],
    hours: {
      default:
        "Daily 9:00 AM-6:00 PM, with ticket sales ending at 5:30 PM; holiday extensions follow the official ticket page.",
    },
    officialUrl: "https://www.sh-aquarium.com/en/",
    sourcePhoto: commons("Shanghai Ocean Aquarium.jpg"),
  }),
  stop({
    id: "shanghai-activity-natural-history",
    name: "Shanghai Natural History Museum",
    neighborhood: "Jing'an",
    coordinates: [31.2351, 121.4635],
    description:
      "This spiraling museum handles fossils, biodiversity, evolution, and Shanghai ecology with enough interactive material for children and enough collection depth for a half-day visit.",
    venueKind: "culture",
    price: "$",
    priceSource: "Official museum ticket page",
    attributeTags: ["family_friendly", "museum", "rainy_day", "accessible"],
    hours: {
      mon: "Closed",
      tue: "9:00 AM-5:00 PM",
      wed: "9:00 AM-5:00 PM",
      thu: "9:00 AM-5:00 PM",
      fri: "9:00 AM-5:00 PM",
      sat: "9:00 AM-5:00 PM",
      sun: "9:00 AM-5:00 PM",
      default: "Last admission 4:00 PM; holiday sessions follow the official timed-ticket page.",
    },
    officialUrl: "https://www.snhm.org.cn/",
    sourcePhoto: commons("Shanghai Natural History Museum (New) 01.JPG"),
  }),
];

function guideSources(
  primary: ListSource[],
  stops: GuideStop[],
): ListSource[] {
  const combined = [
    ...primary,
    ...stops.map((item) =>
      source(
        `${item.name} venue source`,
        item.officialUrl ?? item.sourceEvidence?.officialUrl ?? maps(`${item.name} Shanghai`),
      ),
    ),
  ];
  return [...new Map(combined.map((item) => [item.url, item])).values()];
}

function guide(
  id: string,
  title: string,
  category: ListCategory,
  seoSlug: string,
  seoTitle: string,
  seoDescription: string,
  description: string,
  stops: GuideStop[],
  primarySources: ListSource[],
): MapList {
  return {
    id,
    slug: id,
    seoSlug,
    seoTitle,
    seoDescription,
    title,
    description,
    photo: stops[0]?.photo,
    url: `/list/${id}`,
    category,
    location: shanghaiLocation,
    creator: {
      id: "rguide-editorial",
      name: "R Guide Editorial",
      avatar: avatar(category),
    },
    upvotes: 0,
    createdAt,
    stops,
    sources: guideSources(primarySources, stops),
  };
}

export const shanghaiCitywideGuides: MapList[] = [
  guide(
    "list-shanghai-citywide-dining",
    "Jiangnan Precision & Destination Tables",
    "Food",
    "best-restaurants",
    "Best Restaurants in Shanghai",
    "Best restaurants in Shanghai for modern Chinese tasting menus, Shanghainese classics, Cantonese banquets, Fujian seafood, and serious Bund reservations.",
    "Shanghai's destination dining is not one cuisine. These rooms move from Jiangnan and Shanghainese memory to Fujian seafood, Cantonese banquets, vegetarian technique, and international fine dining, with enough contrast to justify every reservation.",
    diningStops,
    [
      source(
        "MICHELIN Guide Shanghai, Jiangsu and Zhejiang 2026",
        "https://www.michelin.com/en/publications/products-and-services/michelin-guide-shanghai-jiangsu-zhejiang",
      ),
      source(
        "Asia's 50 Best Restaurants 2026",
        "https://www.theworlds50best.com/stories/News/asias-50-best-restaurants-2026-1-50-list.html",
      ),
    ],
  ),
  guide(
    "list-shanghai-citywide-cheap-eats",
    "Soup Dumplings, Shengjian & Noodle Counters",
    "Food",
    "best-cheap-eats",
    "Best Cheap Eats in Shanghai",
    "Best cheap eats in Shanghai for xiaolongbao, shengjian, sesame noodles, congee, wontons, crab dumplings, and fast local breakfasts.",
    "Shanghai's everyday food is strongest when the format stays narrow: one style of dumpling, a practiced noodle sauce, congee at any hour, or a regional specialty served quickly. These stops favor current, source-backed branches over vanished legends.",
    cheapEatStops,
    [
      source(
        "MICHELIN Guide Shanghai restaurant selection",
        "https://guide.michelin.com/en/cn/shanghai-municipality/restaurants",
      ),
      source(
        "SmartShanghai current Shanghainese directory",
        "https://www.smartshanghai.com/listings/dining/shanghainese/",
      ),
    ],
  ),
  guide(
    "list-shanghai-citywide-hotels",
    "Bund Grande Dames, Design Houses & Quiet Resorts",
    "Stay",
    "best-hotels",
    "Best Hotels in Shanghai",
    "Best hotels in Shanghai for the Bund, Jing'an, the Former French Concession, Lujiazui, heritage villas, design stays, spas, and river views.",
    "Shanghai hotels turn geography into mood: Bund landmarks place the spectacle outside the window, Jing'an design houses put dining and shopping close, and city-edge resorts exchange convenience for space, heritage, and recovery.",
    hotelStops,
    [
      source(
        "MICHELIN Guide Shanghai hotel selection",
        "https://guide.michelin.com/us/en/hotels-stays/shanghai",
      ),
      source(
        "Official Shanghai tourism hotel directory",
        "https://www.meet-in-shanghai.net/en/hotels/",
      ),
    ],
  ),
  guide(
    "list-shanghai-citywide-hostels",
    "Social Bunks, Pods & Metro-Smart Budget Bases",
    "Stay",
    "best-hostels",
    "Best Hostels in Shanghai",
    "Best hostels in Shanghai for People's Square, Jing'an, Xintiandi, the Old City, Lujiazui, coworking, social roofs, pods, and private rooms.",
    "Shanghai's current hostel market is concentrated and chain-heavy. The useful distinctions are neighborhood, reception schedule, social space, pod privacy, work facilities, and whether a Pudong or Puxi base matches the rest of the trip.",
    hostelStops,
    [
      source(
        "Hostelworld Shanghai live hostel inventory",
        "https://www.hostelworld.com/hostels/asia/china/shanghai/",
      ),
      source(
        "Google Maps Shanghai hostel search",
        maps("best hostels Shanghai"),
      ),
    ],
  ),
  guide(
    "list-shanghai-citywide-casual-bars",
    "Sports Pubs, Punk Rooms & Neighborhood Beer",
    "Nightlife",
    "best-bars",
    "Best Casual Bars in Shanghai",
    "Best casual bars in Shanghai for sports screens, patios, punk music, draft beer, group nights, Jing'an pubs, and neighborhood drinking.",
    "Outside the cocktail circuit, Shanghai drinks through sports pubs, patios, dive bars, live music, and neighborhood rooms built around regulars. These picks separate downtown energy from useful Hongqiao, Pudong, and Minhang locals.",
    casualBarStops,
    [
      source(
        "SmartShanghai nightlife directory",
        "https://www.smartshanghai.com/nightlife/",
      ),
      source(
        "SmartShanghai 2026 World Cup venues",
        "https://www.smartshanghai.com/articles/sports-and-recreation/where-and-when-to-watch-the-2026-world-cup",
      ),
    ],
  ),
  guide(
    "list-shanghai-citywide-cocktail-bars",
    "Listening Bars, Speakeasies & Shanghai Technique",
    "Nightlife",
    "best-cocktail-bars",
    "Best Cocktail Bars in Shanghai",
    "Best cocktail bars in Shanghai for Speak Low, COA, listening bars, bourbon rooms, Chinese ingredients, agave, bespoke drinks, and late reservations.",
    "Shanghai cocktail culture rewards precise room choice: some bars are designed for listening, some for bespoke conversation, some for local ingredients, and others for a louder multi-floor night. Technique matters, but so do seating, music, and pace.",
    cocktailBarStops,
    [
      source(
        "SmartShanghai current cocktail-bar directory",
        "https://www.smartshanghai.com/listings/nightlife/cocktails/",
      ),
      source(
        "Asia's 50 Best Bars 2026 extended list",
        "https://www.theworlds50best.com/stories/News/asias-50-best-bars-2026-the-51-100-list-revealed.html",
      ),
    ],
  ),
  guide(
    "list-shanghai-citywide-culture",
    "Ancient Collections, Port History & Contemporary Art",
    "Culture",
    "best-museums",
    "Best Museums and Culture in Shanghai",
    "Best museums and cultural sites in Shanghai for Chinese art, contemporary exhibitions, treaty-port history, Jewish refugee history, propaganda design, and riverfront architecture.",
    "Shanghai's cultural map runs from ancient Chinese collections to the city's port-era transformations and unusually ambitious contemporary-art institutions. The strongest route crosses the river and keeps Hongkou, West Bund, and central museums in distinct clusters.",
    cultureStops,
    [
      source(
        "Shanghai government museum and gallery guide",
        "https://english.shanghai.gov.cn/en-MuseumsGalleries/20250702/64d1d26886b3458b8dffb3a8533787b5.html",
      ),
      source(
        "Shanghai Museum official",
        "https://www.shanghaimuseum.cn/mu/frontend/pg/en/index",
      ),
    ],
  ),
  guide(
    "list-shanghai-citywide-activities",
    "River Views, Garden Lanes & Big-Ticket Days",
    "Activities",
    "best-things-to-do",
    "Best Things to Do in Shanghai",
    "Best things to do in Shanghai for the Bund, Yu Garden, Shanghai Tower, river cruises, Wukang Road, Disneyland, Zhujiajiao, acrobatics, and family museums.",
    "Shanghai's essential activities work best as geographic contrasts: walk Puxi before looking back from Pudong, pair historic lanes with formal gardens, and reserve full days for Disney or a water town instead of forcing them into central sightseeing.",
    activityStops,
    [
      source(
        "Official Shanghai travel portal",
        "https://english.shanghai.gov.cn/en-TravelinShanghai/index.html",
      ),
      source(
        "Official Shanghai tourism website",
        "https://www.meet-in-shanghai.net/en/",
      ),
    ],
  ),
];

shanghaiCitywideGuides.push(buildNatureGuide({
  city: "Shanghai", country: "China", continent: "Asia",
  id: "list-shanghai-citywide-nature", slug: "shanghai-best-parks-and-nature-citywide", seoSlug: "best-parks",
  seoTitle: "Best Parks and Nature in Shanghai", seoDescription: "Shanghai nature guide to major parks, botanical gardens, riverside landscapes, forest, wetlands, cherry blossom, and Sheshan hills.",
  title: "River Forest, Wetland Islands, and Botanical Scale",
  description: "Shanghai’s nature is planned at metropolitan scale: huge parks, botanical collections, riverside restoration, coastal forest, wetland islands, and low wooded hills beyond the core. Seasonal blossom, humidity, typhoons, gate hours, and long metro transfers shape the useful route.",
  createdAt: "2026-07-29T00:00:00.000Z", checkedAt: "2026-08-04",
  sources: [
    { name: "Top organic result: Meet in Shanghai parks", url: "https://www.meet-in-shanghai.net/" },
    { name: "Shanghai municipal landscaping authority", url: "https://lhsr.sh.gov.cn/" },
    { name: "Shanghai tourism official", url: "https://www.shanghai.gov.cn/nw48081/index.html" },
    { name: "Google Maps - Shanghai parks and nature", url: "https://www.google.com/maps/search/best+parks+and+nature+Shanghai" },
  ],
  stops: [
    { id: "shanghai-nature-century", name: "Century Park", coordinates: [31.214, 121.552], description: "Century Park spreads lawns, woodland, ponds, flower fields, and cycling roads across Pudong’s largest central green space. The park is broad and exposed, with blossom seasons and holiday crowds concentrating activity around specific gates.", hours: { default: "Open 24 hours daily." }, officialUrl: "https://english.shanghai.gov.cn/en-Parks/20231220/489a4c048d594b1d9fec56e57214a284.html", photo: commons("Century Park Shanghai.jpg"), subcategory: "metropolitan_park", attributeTags: ["park", "lake", "cycling", "flowers", "family_friendly"] },
    { id: "shanghai-nature-botanical", name: "Shanghai Botanical Garden", coordinates: [31.147, 121.44], description: "Shanghai Botanical Garden holds magnolias, bonsai, medicinal plants, greenhouses, and extensive themed collections beside the southern rail corridor. Seasonal flowering changes the strongest sections, while separate exhibition houses keep their own entry schedules.", hours: { default: "Gate 1 daily: November–April 7:00 AM–5:00 PM; May–October 7:00 AM–6:00 PM. Gates 3 and 4 daily: November–April 6:00 AM–5:00 PM; May–October 6:00 AM–6:00 PM. Ticketed conservatories and specialty gardens daily 8:30 AM–5:00 PM, last ticket 4:30 PM." }, officialUrl: "https://www.shbg.org/sites/zhiwuyuan/InfoContent.aspx?CtgId=0edaa119-62ca-47bb-b971-2a90e001674c&InfoId=d1bd8a47-2e2e-4cd5-bf55-1059762699ff", photo: commons("Shanghai Botanical Garden, China (Unsplash Jy6luiLBsrk).jpg"), subcategory: "botanical_garden", attributeTags: ["garden", "plants", "greenhouse", "bonsai", "seasonal"] },
    { id: "shanghai-nature-chenshan", name: "Chenshan Botanical Garden", coordinates: [31.077, 121.181], description: "Chenshan Botanical Garden combines quarry cliffs, lakes, conservatories, forests, and immense plant collections around a low hill in Songjiang. Its scale and distance justify a full half-day, with glasshouses providing reliable bad-weather depth.", hours: { default: "March–October daily 8:00 AM–5:30 PM; November–February daily 8:00 AM–5:00 PM." }, officialUrl: "https://www.csnbgsh.com/portal/ticket/guide", photo: commons("Chenshan Site.JPG"), subcategory: "botanical_landscape_park", attributeTags: ["garden", "quarry", "greenhouse", "lake", "full_day"] },
    { id: "shanghai-nature-gongqing", name: "Gongqing Forest Park", coordinates: [31.32, 121.55], description: "Gongqing Forest Park uses dense planted woodland, lawns, lakes, rides, and long paths near the Huangpu’s northern bend. Family recreation occupies central zones, while outer forest tracks provide the calmer walking and cycling experience.", hours: { default: "East, South, North, and Wanzhu Garden gates daily 5:00 AM–6:00 PM. West Gate daily 5:00 AM–7:30 PM; after 6:00 PM only the West Gate lawn area remains open." }, officialUrl: "https://english.shanghai.gov.cn/en-ClosetoNature-travelinshanghai/20250423/927175c3853847008da3141882c2c9bc.html", photo: commons("共青森林公园，Gongqing Forest Park - panoramio.jpg"), subcategory: "urban_forest_park", attributeTags: ["forest", "cycling", "lake", "family_friendly", "ticketed"] },
    { id: "shanghai-nature-binjiang", name: "Shanghai Binjiang Forest Park", coordinates: [31.383, 121.535], description: "Binjiang Forest Park protects planted forest, wetland, flower fields, and river-confluence views at Pudong’s northern tip. The distant setting buys space and birdlife, but ferry, metro, and taxi combinations demand more time than central parks.", hours: { default: "March–October daily 8:00 AM–5:30 PM; November–February daily 8:00 AM–5:00 PM." }, officialUrl: "https://web.lhsr.sh.gov.cn/sites/ShanghaiGreen/qiantao/gongyuan_con.aspx?InfoId=97f0193f-f8c1-4045-b79f-d386ae5c91b3", photo: commons("上海滨江森林公园 05.jpg"), subcategory: "riverfront_forest_park", attributeTags: ["forest", "wetland", "birdwatching", "flowers", "day_trip"] },
    { id: "shanghai-nature-dongtan", name: "Dongtan Wetland Park", coordinates: [31.519, 121.973], description: "Dongtan Wetland Park presents reed bed, mudflat, waterbird habitat, and boardwalk landscape on eastern Chongming Island. Migration season strengthens the wildlife, while distance and managed entry turn it into a committed day trip.", hours: { default: "Daily 8:30 AM–5:00 PM; last entry 4:00 PM." }, officialUrl: "https://www.meet-in-shanghai.net/en/news/dont-miss-this-sea-of-purple-flowers-in-shanghai-in-june-730588/", photo: commons("20111231崇明东滩湿地公园廊桥 - panoramio.jpg"), subcategory: "coastal_wetland", attributeTags: ["wetland", "birdwatching", "boardwalk", "island", "day_trip"] },
    { id: "shanghai-nature-west-bund", name: "West Bund Riverside", coordinates: [31.183, 121.466], description: "West Bund Riverside converts industrial Huangpu shore into long walking and cycling paths, lawns, wetlands, art spaces, and broad water views. It is designed river landscape rather than wilderness, strongest when evening light and local exercise take over.", hours: { default: "Open 24 hours daily." }, officialUrl: "https://www.westbund.com/en/", photo: commons("Xuhui Riverside Shanghai.jpg"), subcategory: "riverfront_greenway", attributeTags: ["river", "cycling", "walking", "wetland", "art"] },
    { id: "shanghai-nature-jingan-sculpture", name: "Jing'an Sculpture Park", coordinates: [31.237, 121.466], description: "Jing’an Sculpture Park combines lawns, mature trees, contemporary sculpture, and the Shanghai Natural History Museum’s planted roof in the dense center. It is compact and cultural, useful for outdoor relief rather than a long nature immersion.", hours: { default: "Open 24 hours daily." }, officialUrl: "https://www.shanghai.gov.cn/jingan/index.html", photo: commons("Jing'an Sculptures Park 23000-Shanghai (10921630936).jpg"), subcategory: "urban_art_park", attributeTags: ["park", "sculpture", "central", "accessible", "family_friendly"] },
    { id: "shanghai-nature-gucun", name: "Gucun Park", coordinates: [31.35, 121.372], description: "Gucun Park spreads lakes, woodland, lawns, cycling, and one of Shanghai’s largest cherry collections across the northern suburbs. Blossom festival dates bring immense crowds, while ordinary seasons reveal a much calmer metropolitan park.", hours: { default: "Daily 6:00 AM–6:00 PM." }, officialUrl: "https://english.shanghai.gov.cn/en-Parks/20240319/a809632bf77141e7bd8e60768f18a0a5.html", photo: commons("Gucun Park Shanghai China (211580163).jpeg"), subcategory: "flower_park", attributeTags: ["cherry_blossom", "park", "lake", "cycling", "seasonal"] },
    { id: "shanghai-nature-sheshan", name: "Sheshan National Forest Park", coordinates: [31.099, 121.19], description: "Sheshan’s low wooded hills provide forest paths, bamboo, viewpoints, observatory ground, and religious landmarks in otherwise flat Shanghai. The elevation is modest, but humidity, holiday traffic, and separate hill attractions shape the outing.", hours: { default: "East and West Sheshan daily: January–May 14 and October 16–December 8:30 AM–5:00 PM, last entry 4:30 PM; May 15–June 30 and September 1–October 15 8:30 AM–6:00 PM, last entry 5:30 PM; July–August 8:30 AM–6:30 PM, last entry 6:00 PM." }, officialUrl: "https://www.songjiang.gov.cn/xwzx/001001/20260511/be9d356f-6c91-40f8-90b5-a2aa3b3e3e62.html", photo: commons("Sheshan Shanghai.jpg"), subcategory: "national_forest_park", attributeTags: ["forest", "hiking", "viewpoint", "bamboo", "day_trip"] },
  ],
}));
