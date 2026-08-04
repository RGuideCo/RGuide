import type { GuideStop, ListCategory, ListSource, MapList } from "@/types";
import { buildNatureGuide } from "@/data/guides/nature-guide-builder";

const createdAt = "2026-07-18T00:00:00.000Z";
const checkedAt = "2026-07-18";

const taipeiLocation = {
  city: "Taipei",
  country: "Taiwan",
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

const michelinPhoto = (id: string, extension = "jpeg") =>
  `https://prod-pics.guide.michelin.com/api/public/content/${id}.${extension}?format=jpeg&w=1200&h=900`;

const images = {
  tairroir: michelinPhoto("18dba928ed7d48588507e0db835785b8"),
  lePalais: michelinPhoto("b3879d28c93f44d6a019d078db9e7b5b"),
  logy: michelinPhoto("e6a67d42fb8340e4b09aee046726cc93"),
  mountainSea: michelinPhoto("4fddd96e8c0247bc8e0a2c55a2886ee3"),
  mume: michelinPhoto("59f9d3581b1b46be9445ee08c78179da", "jpg"),
  robuchon: michelinPhoto("71bee640be4f4c15b413b9b38c762da7", "jpg"),
  mudan: michelinPhoto("e38a809add894462baf8c5583c05fb17"),
  molino: michelinPhoto("b80cdf81265d4525b31c2bb74cf477f4", "jpg"),
  impromptu: michelinPhoto("a38908d13c1043958dad94acce626c99", "png"),
  goldenFormosa: michelinPhoto("ca259327ab5049a08eb37ad5f8fb1df6"),
  fuhang: commons("TW TP 台北 阜杭豆浆店 Fu Hang Soy Milk Congee Breakfast shop March 2024 R12S 01.jpg"),
  ayChung: michelinPhoto("a5e3dcacfba7481fbf75d379be378091"),
  liuShandong: michelinPhoto("d7439e42cfdb4920a13744ef6c40619f", "jpg"),
  muji: "https://prod-pics.guide.michelin.com/api/public/content/70a9406cc9184ba4a244def13b222db9.jpeg?format=jpeg&w=1200&h=900",
  jinFeng: michelinPhoto("19d8c569bc4c4ac9b0e735f540f5e880", "png"),
  wangsBroth: michelinPhoto("5b9ea75825ef403aa2dc62be90cdcc6b", "jpg"),
  yuanFang: michelinPhoto("57ab0defed67482dbdcd9e3558ba57c1"),
  goodFriend: michelinPhoto("8de7b259203046caa4707ebfb18936f4"),
  laoShanDong: michelinPhoto("45d623e5a26e4593b099e0617be152e5", "jpg"),
  chungChia: michelinPhoto("49380a39d12b42b5a12a7df9f6eff45c"),
  capella: "https://img.ltn.com.tw/Upload/playing/page/2025/03/25/250325-31048-1-ddaTj.jpg",
  mandarin: commons("Main Gate of the Mandarin Oriental, Taipei 20240704.jpg"),
  regent: commons("Lobby of the Regent Taipei-01.2024-05-31.jpg"),
  grandHyatt: commons("Taipei 101 and Grand Hyatt Taipei 20100721b.jpg"),
  kimpton: commons("Exterior of Kimpton Da An Hotel.jpg"),
  eslite: "https://www.eslitehotel.com/en/wp-content/themes/wp_eslite/images/safe_image.php2.jpeg",
  proverbs: "https://www.hotel-proverbs.com/uploads/photos/shares/index/proverbs_outside_M.jpg",
  okura: "https://www.okurataipei.com.tw/upload/base_fb_img/bn__24C19hMCJN.jpg",
  shangriLa: commons("Interior of Shangri-La Far Eastern,Taipei-03.2023-08-29.jpg"),
  grandHotel: commons("Yuanshan Great Hotel (Grand Hotel) in Taipei.jpg"),
  meander: "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/8/81680/ketmpb1ewosdetyqnyzy.jpg",
  meander1948: "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/2/291838/hhqkwie2gdmdpci0cud1.jpg",
  starHostel: "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/8/85980/1.jpg",
  mayRooms: "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/2/289035/hlhtmpqhuhwjuwfouhxv.jpg",
  beimen: "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/2/270141/1.jpg",
  workinn: "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/3/328822/ps8amsslkuhut3fl0p8e.jpg",
  dongmen: "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/2/269813/ehb32mfa4onrnlhcifox.jpg",
  cornerHostel: "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/2/293890/mjyuqn4w2jncz8uoxuxp.jpg",
  taipei109: "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/2/294739/dn1ikxdcpa7xuasawv0j.jpg",
  taiwanYouth: "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/2/271891/45.jpg",
  taihu: "https://img.shoplineapp.com/media/image_clips/67bbff9b3186b000107c849c/original.png?1740373915",
  mikkeller: "https://cdn.prod.website-files.com/64ad1f9e95d96a6e7e92a6d0/64e61cc741db7617c22d3c23_1572377214-taipei.webp",
  floating: "https://taiwanderers.com/wp-content/uploads/2024/10/floating-taipei-3-635x800.jpg",
  revolver: "https://www.travelerluxe.com/public/article/2017/atl_20220921162818_116.jpg",
  flow: "https://taiwanderers.com/wp-content/uploads/2026/06/flow-3.jpg",
  public23: "https://media.walkerland.com.tw/wlk_media/thumbnail/images/upload/poi/p72264/m26624/92b50f77781c4ce71755db0d878d88b6bdd6db53-640x427.webp",
  jimDads: "https://beerasia.net/wp-content/uploads/2024/12/Taipei_JimDads_Outdoor.jpg",
  crafted: "https://taiwan.bier-reise.net/wp-content/uploads/19247600_460688544284706_8701848701677329830_n.png",
  ximenBeer: "https://www.taiwanobsessed.com/wp-content/uploads/2024/07/ximen-beer-bar-taipei.jpg",
  onTap: "https://www.taipeitravelgeek.com/wp-content/uploads/2019/06/On-Tap-2-1024x692.jpg",
  infinity: "https://www.theworlds50best.com/bars/best-in-asia/filestore/jpg/To%20Infinity%20and%20Beyond-hero_A50BB25-profile.jpg",
  barMood: "https://barmood.wordpress.com/wp-content/uploads/2023/11/bar-mood-taipei-interior-2-1.jpg",
  publicHouse: "https://www.theworlds50best.com/discovery/filestore/jpg/The_Public_House_Interior.jpg",
  lab: "https://www.theworlds50best.com/discovery/filestore/jpg/Lab_interior1.jpg",
  indulge: "https://www.theworlds50best.com/discovery/filestore/jpg/IndulgeExperimentalBistro-Taipei-Taiwan-02.jpg",
  barPine: "https://freight.cargo.site/w/1000/i/H2319294072373417945835982821803/Pine_space_wide_02.png",
  ounce: "https://barsforkings.com/images/places/bars/taipei/ounce/00-hero.jpg",
  eastEnd: "https://barsforkings.com/images/places/bars/taipei/east-end-cocktail/00-hero.jpg",
  draftland: "https://static.wixstatic.com/media/94e204_1a708d1d4a9e443195d67199ffc80ddc~mv2.jpg",
  barPun: "https://doqvf81n9htmm.cloudfront.net/data/crop_article/81411/166.jpg_1140x855.jpg",
  palaceMuseum: commons("Taipei Taiwan National-Palace-Museum-04.jpg"),
  tfam: commons("Taipei Fine Arts Museum 20240107.jpg"),
  moca: commons("Before Museum of Contemporary Art, Taipei 01.jpg"),
  taiwanMuseum: "https://commons.wikimedia.org/wiki/Special:FilePath/National%20Taiwan%20Museum%2020170803.jpg?width=1600",
  historyMuseum: commons("National Museum of History in night 20240405.jpg"),
  longshan: commons("Longshan Temple, Taipei 01.jpg"),
  baoan: commons("Dalongdong Baoan Temple, Taiwan.jpg"),
  songshanPark: commons("Entrance 1, Songshan Cultural and Creative Park 20160723.jpg"),
  huashan: commons("Huashan 1914 Creative Park and Hueida Building 20090127.jpg"),
  cks: commons("Chiang Kai-shek memorial amk.jpg"),
  taipei101: "https://ws.taipei-101.com.tw/upload/observatory/20191105/9f7ca9742d8741b192c5c48aa09c01f1/9f7ca9742d8741b192c5c48aa09c01f1.jpg",
  elephant: commons("Taipei night skyline and Elephant Mountain May 2025.jpg"),
  maokong: commons("Taipei Taiwan Maokong-Gondola-01.jpg"),
  zoo: commons("Taipei Zoo Entrance 20220822.jpg"),
  beitouMuseum: commons("Beitou Hotspring Museum 2015.jpg"),
  thermalValley: commons("Beitou Hell Valley 20220722 01.jpg"),
  qingtiangang: commons("Qingtiangang Grassland, Taipei City, Taiwan.jpg"),
  dihua: commons("Buildings along Dihua Street 07.23 (2).jpg"),
  raohe: commons("East Entrance of Raohe Street Night Market 20060118 night.jpg"),
  ximending: commons("Ximending rainbow crossing 20260326 (IMG 8643).jpg"),
};

const hours = {
  reservation: { default: "Service days, seating times, and reservation release are controlled by the linked official reservation page and booking calendar." },
  restaurantListing: { default: "Service days and meal windows are published on the linked MICHELIN venue page and Google Maps listing." },
  hotel: { default: "Open 24 hours daily; check-in, check-out, restaurant, and spa windows are published on the linked official property and Booking.com pages." },
  hostel: { default: "Daily lodging operation; reception, check-in, and check-out windows are published on the linked Hostelworld property page." },
  cocktail: { default: "Evening bar service; opening windows, booking rules, and special closures are published on the linked official page or reservation calendar." },
};

const guideUrls = {
  michelinRestaurants: "https://guide.michelin.com/en/tw/taipei-region/taipei/restaurants",
  michelinSelection: "https://guide.michelin.com/tw/en/article/michelin-guide-ceremony/taiwan-full-list",
  michelinHotels: "https://guide.michelin.com/en/hotels-stays/taipei",
  hostelworld: "https://www.hostelworld.com/hostels/asia/taiwan-china/taipei/",
  beerAsia: "https://beerasia.net/craft-beer-guides/taipei-craft-beer-guide/",
  taiwanderersBeer: "https://taiwanderers.com/taipei-craft-beer-brewery-bars/",
  bars2026: "https://barsforkings.com/taipei/",
  asiaBars2026: "https://www.theworlds50best.com/stories/News/asias-50-best-bars-2026-the-51-100-list-revealed.html",
  travelTaipei: "https://travel.taipei/en/attraction",
};

const sources = {
  dining: [
    source("MICHELIN Guide Taipei restaurants", guideUrls.michelinRestaurants), source("MICHELIN Guide Taiwan 2025 selection", guideUrls.michelinSelection),
    source("Taïrroir - MICHELIN", "https://guide.michelin.com/en/taipei-region/taipei/restaurant/tairroir"), source("Le Palais - MICHELIN", "https://guide.michelin.com/en/taipei-region/taipei/restaurant/le-palais"),
    source("logy - MICHELIN", "https://guide.michelin.com/en/taipei-region/taipei/restaurant/logy"), source("Mountain and Sea House - MICHELIN", "https://guide.michelin.com/en/taipei-region/taipei/restaurant/mountain-and-sea-house"),
    source("MUME - MICHELIN", "https://guide.michelin.com/en/taipei-region/taipei/restaurant/mume"), source("Mudan - MICHELIN", "https://guide.michelin.com/en/taipei-region/taipei/restaurant/mudan"),
    source("Impromptu - MICHELIN", "https://guide.michelin.com/en/taipei-region/taipei/restaurant/impromptu-by-paul-lee"), source("Google Maps - Taipei fine dining", maps("best restaurants Taipei")),
  ],
  cheap: [
    source("MICHELIN Guide Taipei Bib Gourmand", "https://guide.michelin.com/en/tw/taipei-region/taipei/restaurants/bib-gourmand"), source("MICHELIN Guide Taipei restaurants", guideUrls.michelinRestaurants),
    source("Fuhang Soy Milk - MICHELIN", "https://guide.michelin.com/en/taipei-region/taipei/restaurant/fuhang-soy-milk"), source("Ay-Chung - MICHELIN", "https://guide.michelin.com/en/taipei-region/taipei/restaurant/ay-chung-flour-rice-noodle"),
    source("Liu Shandong - MICHELIN", "https://guide.michelin.com/en/taipei-region/taipei/restaurant/liu-shandong-beef-noodles"), source("Jin Feng - MICHELIN", "https://guide.michelin.com/en/taipei-region/taipei/restaurant/jin-feng-braised-pork-rice"),
    source("Wang's Broth - MICHELIN", "https://guide.michelin.com/en/taipei-region/taipei/restaurant/hsiao-wang-steamed-minced-pork-with-pickles-in-broth"), source("Good Friend Cold Noodles - MICHELIN", "https://guide.michelin.com/en/taipei-region/taipei/restaurant/good-friend-cold-noodles"),
    source("Lao Shan Dong - MICHELIN", "https://guide.michelin.com/en/taipei-region/taipei/restaurant/lao-shan-dong-homemade-noodles"), source("Google Maps - Taipei cheap eats", maps("best cheap eats Taipei")),
  ],
  hotels: [
    source("MICHELIN Guide Taipei hotels", guideUrls.michelinHotels), source("Capella Taipei official", "https://capellahotels.com/en/en/cn/taipei"),
    source("Mandarin Oriental Taipei official", "https://www.mandarinoriental.com/en/taipei/songshan"), source("Regent Taipei official", "https://www.ihg.com/regent/hotels/us/en/taipei/tperg/hoteldetail"),
    source("Grand Hyatt Taipei official", "https://www.hyatt.com/grand-hyatt/en-US/taigh-grand-hyatt-taipei"), source("Kimpton Da An official", "https://www.ihg.com/kimptonhotels/hotels/us/en/da-an-hotel-taipei/tpekm/hoteldetail"),
    source("eslite hotel official", "https://www.eslitehotel.com/en/"), source("Okura Prestige Taipei official", "https://www.okurataipei.com.tw/en/"),
    source("Shangri-La Far Eastern Taipei official", "https://www.shangri-la.com/taipei/fareasternplazashangrila/"), source("Booking.com Taipei hotels", "https://www.booking.com/city/tw/t-ai-pei.html"),
  ],
  hostels: [
    source("Hostelworld Taipei", guideUrls.hostelworld), source("Booking.com Taipei hostels", "https://www.booking.com/hostels/city/tw/t-ai-pei.html"),
    source("MEANDER Taipei - Hostelworld", "https://www.hostelworld.com/hostels/p/81680/meander-taipei/"), source("MEANDER 1948 - Hostelworld", "https://www.hostelworld.com/hostels/p/291838/meander-1948/"),
    source("Star Hostel - Hostelworld", "https://www.hostelworld.com/hostels/p/85980/star-hostel-taipei-main-station/"), source("May Rooms - Hostelworld", "https://www.hostelworld.com/hostels/p/289035/may-rooms-taipei-main-station-hostel/"),
    source("Beimen WOW - Hostelworld", "https://www.hostelworld.com/hostels/p/270141/beimen-wow-poshtel/"), source("Dongmen 3 - Hostelworld", "https://www.hostelworld.com/hostels/p/269813/dongmen-3-hostel/"),
    source("Taipei 109 - Hostelworld", "https://www.hostelworld.com/hostels/p/294739/taipei-109-hostel/"), source("Taiwan Youth Hostel - Hostelworld", "https://www.hostelworld.com/hostels/p/271891/taiwan-youth-hostel-and-capsule-hotel/"),
  ],
  casual: [
    source("Beer Asia Taipei craft beer guide", guideUrls.beerAsia), source("Taiwanderers Taipei craft beer guide 2026", guideUrls.taiwanderersBeer),
    source("Taipei Quarterly Summer 2026 - craft beer", "https://www.travel.taipei/en/pictorial/article/67397"), source("Taihu Brewing official", "https://www.taihubrewing.com/en/pages/taihu-retail"),
    source("Mikkeller Bar Taipei official", "https://www.mikkeller.com/locations/mikkeller-bar-taipei"), source("Floating Taipei official", "https://www.instagram.com/floatingtaipei/"),
    source("Revolver official", "https://www.facebook.com/revolvertaipei/"), source("Flow Brewing official", "https://www.instagram.com/flowbrewing.tw/"),
    source("Jim & Dad's official", "https://www.instagram.com/jimanddads.taipei/"), source("Google Maps - Taipei craft beer", maps("craft beer bars Taipei")),
  ],
  cocktails: [
    source("Asia's 50 Best Bars 2026 extended list", guideUrls.asiaBars2026), source("Taipei Bar Guide 2026", guideUrls.bars2026),
    source("To Infinity & Beyond - 50 Best", "https://www.theworlds50best.com/bars/best-in-asia/the-list/to-infinity-and-beyond.html"), source("Bar Mood official", "https://barmood.wordpress.com/"),
    source("The Public House - 50 Best", "https://www.theworlds50best.com/discovery/Establishments/Taiwan/Taipei/The-Public-House.html"), source("Lab - 50 Best", "https://www.theworlds50best.com/discovery/Establishments/Taiwan/Taipei/Lab.html"),
    source("Indulge - 50 Best", "https://www.theworlds50best.com/discovery/Establishments/Taiwan/Taipei/Indulge-Experimental-Bistro.html"), source("Bar Pine official", "https://barpine.com/about"),
    source("Draft Land Taipei official", "https://www.draftland.tw/tpe"), source("Google Maps - Taipei cocktail bars", maps("best cocktail bars Taipei")),
  ],
  culture: [
    source("Taipei Travel attractions", guideUrls.travelTaipei), source("National Palace Museum official", "https://www.npm.gov.tw/Articles.aspx?l=2&sno=02007001"),
    source("Taipei Fine Arts Museum official", "https://www.tfam.museum/"), source("MOCA Taipei official", "https://www.moca.taipei/en/"),
    source("National Taiwan Museum official", "https://www.taiwanmuseum.tw/en/cp.aspx?n=5684"), source("National Museum of History official", "https://www.nmh.gov.tw/en/cp.aspx?n=7162"),
    source("Longshan Temple official", "https://www.lungshan.org.tw/en/"), source("Dalongdong Baoan Temple - Taipei Travel", "https://travel.taipei/en/attraction/details/480"),
    source("Songshan Cultural Park official", "https://www.songshanculturalpark.org/english"), source("Huashan 1914 official", "https://www.huashan1914.com/w/huashan1914_en/index"),
  ],
  activities: [
    source("Taipei Travel attractions", guideUrls.travelTaipei), source("Taipei 101 Observatory official", "https://www.taipei-101.com.tw/en/observatory"),
    source("Elephant Mountain - Taipei Travel", "https://travel.taipei/en/attraction/details/564"), source("Maokong Gondola official", "https://www.gondola.taipei/"),
    source("Taipei Zoo official", "https://english.zoo.gov.taipei/"), source("Beitou Hot Spring Museum official", "https://hotspringmuseum.taipei/en/content.aspx?id=33&pid=29"),
    source("Thermal Valley - Taipei Travel", "https://travel.taipei/en/attraction/details/505"), source("Yangmingshan National Park official", "https://www.ymsnp.gov.tw/En/StaticPage/Recreation"),
    source("Raohe Night Market - Taipei Travel", "https://travel.taipei/en/attraction/details/1691"), source("Google Maps - Taipei things to do", maps("best things to do Taipei")),
  ],
};

type StopInput = Partial<GuideStop> & {
  id: string;
  name: string;
  coordinates: [number, number];
  description: string;
  neighborhood: string;
  sourcePhoto: string;
  officialUrl: string;
  mapQuery?: string;
  editorialUrls?: string[];
  platformUrls?: string[];
};

function stop(input: StopInput): GuideStop {
  const {
    id, name, coordinates, description, neighborhood, sourcePhoto, officialUrl, mapQuery,
    editorialUrls = [], platformUrls = [], bookingUrl, sourceEvidence, ...rest
  } = input;
  const mapUrl = sourceEvidence?.mapUrl ?? maps(mapQuery ?? `${name} Taipei`);
  const sourceUrls = [officialUrl, bookingUrl, mapUrl, sourcePhoto, ...editorialUrls, ...platformUrls, ...(input.sourceUrls ?? [])]
    .filter(Boolean) as string[];

  return {
    id: `taipei-${id}`,
    poiId: `taipei-venue-${id}`,
    name,
    coordinates,
    description,
    subcategory: neighborhood,
    photo: sourcePhoto,
    imageSourceUrl: sourcePhoto,
    officialUrl,
    ...(bookingUrl ? { bookingUrl } : {}),
    sourceUrls: [...new Set(sourceUrls)],
    sourceEvidence: {
      officialUrl,
      mapUrl,
      currentStatusUrl: mapUrl,
      imageSourceUrl: sourcePhoto,
      editorialUrls,
      platformUrls,
      checkedAt,
      notes: "Official, platform, or venue-controlled page plus Google Maps checked for current operation; no permanent-closure warning found.",
      ...sourceEvidence,
    },
    ...rest,
  };
}

function dining(input: StopInput): GuideStop {
  return stop({ venueKind: "food_drink", foodServiceType: "restaurant", price: "$$$$", priceSource: "MICHELIN Guide Taiwan 2025", hours: hours.reservation, ...input });
}

function cheap(input: StopInput): GuideStop {
  return stop({ venueKind: "food_drink", foodServiceType: "restaurant", price: "$", priceSource: "MICHELIN Guide / current menu and map listings", hours: hours.restaurantListing, ...input });
}

function hotel(input: StopInput): GuideStop {
  return stop({ venueKind: "lodging", lodgingType: "hotel", price: "$$$$", priceSource: "Official property and Booking.com rate pages", hours: hours.hotel, ...input });
}

function hostel(input: StopInput): GuideStop {
  return stop({ venueKind: "lodging", lodgingType: "hostel", price: "$", priceSource: "Hostelworld Taipei 2026 property listings", hours: hours.hostel, ...input });
}

function casualBar(input: StopInput): GuideStop {
  return stop({ venueKind: "food_drink", nightlifeType: "beer_bar", price: "$$", priceSource: "Official venue and 2026 Taipei craft-beer guides", ...input });
}

function cocktailBar(input: StopInput): GuideStop {
  return stop({ venueKind: "food_drink", nightlifeType: "cocktail_bar", price: "$$$", priceSource: "Official venue / Asia's 50 Best Bars and 2026 listings", hours: hours.cocktail, ...input });
}

function cultureStop(input: StopInput): GuideStop {
  return stop({ venueKind: "culture", priceSource: "Official venue admission page", ...input });
}

const diningStops = [
  dining({
    id: "dining-tairroir", name: "Taïrroir", neighborhood: "Zhongshan", coordinates: [25.0827822, 121.5592485],
    description: "Kai Ho folds Taiwanese pantry staples, banquet memories, and indigenous ingredients into a precise tasting menu. The room is polished without erasing the island's flavors; reserve early and expect a long, structured dinner rather than à-la-carte flexibility.",
    cuisineTypes: ["taiwanese", "contemporary", "fine_dining"], attributeTags: ["fine_dining", "tasting_menu", "destination_dining", "reservation_recommended"],
    officialUrl: "https://www.tairroir.com/", sourcePhoto: images.tairroir,
    editorialUrls: ["https://guide.michelin.com/en/taipei-region/taipei/restaurant/tairroir"],
  }),
  dining({
    id: "dining-le-palais", name: "Le Palais", neighborhood: "Datong", coordinates: [25.04944, 121.51631],
    description: "Le Palais is a grand Cantonese dining room best known for exacting dim sum, roast meats, and labor-intensive banquet dishes. It sits inside Palais de Chine by Taipei Main Station; lunch is the sharper choice for dumplings, while large signature dishes reward a group.",
    cuisineTypes: ["cantonese", "dim_sum", "chinese"], attributeTags: ["fine_dining", "dim_sum", "group_friendly", "reservation_recommended"],
    officialUrl: "https://www.palaisdechinehotel.com/en/restaurant.php", sourcePhoto: images.lePalais,
    editorialUrls: ["https://guide.michelin.com/en/taipei-region/taipei/restaurant/le-palais"],
  }),
  dining({
    id: "dining-logy", name: "logy", neighborhood: "Neihu", coordinates: [25.0806, 121.5749],
    description: "Ryogo Tahara's counter moved to Neihu in 2025, carrying its Japanese technique and Taiwan-focused produce into a quieter, more spacious room. The menu is fixed, seasonal, and technically dense; confirm the current Ruiguang Road address when booking.",
    cuisineTypes: ["japanese", "contemporary", "tasting_menu"], attributeTags: ["fine_dining", "tasting_menu", "counter_seating", "reservation_recommended"],
    officialUrl: "https://logy.tw/", sourcePhoto: images.logy,
    editorialUrls: ["https://guide.michelin.com/en/taipei-region/taipei/restaurant/logy"],
  }),
  dining({
    id: "dining-mountain-sea-house", name: "Mountain and Sea House", neighborhood: "Zhongzheng", coordinates: [25.0331, 121.5261],
    description: "A restored Japanese-era house frames elegant Taiwanese banquet cooking built from traceable local produce. Mullet roe, seafood, and heritage recipes make more sense shared than solo; the meal feels ceremonial, yet the flavors remain recognizably Taiwanese.",
    cuisineTypes: ["taiwanese", "banquet", "seafood"], attributeTags: ["fine_dining", "historic_setting", "group_friendly", "reservation_recommended"],
    officialUrl: "https://www.mountainandseahouse.com/", sourcePhoto: images.mountainSea,
    editorialUrls: ["https://guide.michelin.com/en/taipei-region/taipei/restaurant/mountain-and-sea-house"],
  }),
  dining({
    id: "dining-mume", name: "MUME", neighborhood: "Da'an", coordinates: [25.0363015, 121.5480405],
    description: "MUME treats Taiwanese farms and fisheries as the starting point for contemporary plates rather than decorative provenance. The compact dining room is lively, the cooking Nordic-influenced but not derivative, and the shorter menu makes this a less formal splurge than many tasting counters.",
    cuisineTypes: ["contemporary", "taiwanese", "european"], attributeTags: ["fine_dining", "local_ingredients", "date_night", "reservation_recommended"],
    officialUrl: "https://www.mume.tw/", sourcePhoto: images.mume,
    editorialUrls: ["https://guide.michelin.com/en/taipei-region/taipei/restaurant/mume"],
  }),
  dining({
    id: "dining-robuchon", name: "L'Atelier de Joël Robuchon Taipei", neighborhood: "Xinyi", coordinates: [25.0342, 121.5645],
    description: "The red-and-black counter in Bellavita delivers the Robuchon vocabulary—silken potato purée, exact sauces, and luxury ingredients—with clear views of the open kitchen. Choose counter seats for the theatre; tasting menus are expensive, but lunch can be a more measured entry point.",
    cuisineTypes: ["french", "fine_dining", "contemporary"], attributeTags: ["fine_dining", "counter_seating", "splurge_food", "reservation_recommended"],
    officialUrl: "https://www.robuchon.com.tw/", sourcePhoto: images.robuchon,
    editorialUrls: ["https://guide.michelin.com/en/taipei-region/taipei/restaurant/l-atelier-de-joel-robuchon"],
  }),
  dining({
    id: "dining-mudan", name: "Mudan", neighborhood: "Da'an", coordinates: [25.0329, 121.5427],
    description: "Mudan is a disciplined tempura counter where batter, oil temperature, and pacing change for every ingredient. Seasonal seafood is the point, not spectacle; seats are scarce and the experience depends on arriving promptly for the fixed seating.",
    cuisineTypes: ["japanese", "tempura", "seafood"], attributeTags: ["fine_dining", "counter_seating", "omakase", "reservation_recommended"],
    officialUrl: "https://www.facebook.com/mudantempura/", sourcePhoto: images.mudan,
    editorialUrls: ["https://guide.michelin.com/en/taipei-region/taipei/restaurant/mudan"],
  }),
  dining({
    id: "dining-molino", name: "Molino de Urdániz", neighborhood: "Zhongshan", coordinates: [25.0575, 121.5225],
    description: "The Taipei branch of the Navarre restaurant applies Spanish technique to a tasting menu served in the MVSA Hotel. Sauces and reductions do serious work here, while Taiwanese ingredients prevent the meal from feeling imported wholesale; wine pairing is worthwhile for a full evening.",
    cuisineTypes: ["spanish", "basque", "tasting_menu"], attributeTags: ["fine_dining", "tasting_menu", "wine_pairing", "reservation_recommended"],
    officialUrl: "https://www.mvsahotel.com/en/dining/molino-de-urdaniz", sourcePhoto: images.molino,
    editorialUrls: ["https://guide.michelin.com/en/taipei-region/taipei/restaurant/molino-de-urdaniz"],
  }),
  dining({
    id: "dining-impromptu", name: "Impromptu by Paul Lee", neighborhood: "Zhongshan", coordinates: [25.0554, 121.5226],
    description: "Paul Lee works from an open counter inside the Regent, building a seasonal tasting menu around Taiwanese seafood and globally trained technique. The kitchen conversation is part of the appeal; book counter seats and disclose dietary limits before the menu is set.",
    cuisineTypes: ["contemporary", "taiwanese", "tasting_menu"], attributeTags: ["fine_dining", "counter_seating", "tasting_menu", "reservation_recommended"],
    officialUrl: "https://www.regenthotels.com/taipei/dining/impromptu", sourcePhoto: images.impromptu,
    editorialUrls: ["https://guide.michelin.com/en/taipei-region/taipei/restaurant/impromptu-by-paul-lee"],
  }),
  dining({
    id: "dining-golden-formosa", name: "Golden Formosa", neighborhood: "Shilin", coordinates: [25.0986, 121.5246],
    description: "This family-run Shilin dining room specializes in richly seasoned Taiwanese classics: deep-fried pork ribs, crab, seafood, and dishes made for a lazy Susan. The retro room is less hushed than a tasting counter and far better with four people than one.",
    cuisineTypes: ["taiwanese", "seafood", "family_style"], attributeTags: ["local_favorite", "group_friendly", "family_friendly_food", "reservation_recommended"],
    officialUrl: "https://www.goldenformosa.com.tw/", sourcePhoto: images.goldenFormosa,
    editorialUrls: ["https://guide.michelin.com/en/taipei-region/taipei/restaurant/golden-formosa"],
  }),
];

const cheapEatStops = [
  cheap({
    id: "cheap-fuhang", name: "Fuhang Soy Milk", neighborhood: "Zhongzheng", coordinates: [25.0442057, 121.5247742],
    description: "The queue climbs to the second-floor food court for clay-oven breads, warm soy milk, and egg-and-youtiao sandwiches assembled at speed. Arrive near opening or accept the wait; the thick, lightly sweet soy milk and flaky shaobing justify an early alarm.",
    foodServiceType: "cafeteria", cuisineTypes: ["taiwanese", "breakfast", "soy_milk"], attributeTags: ["breakfast", "budget_food", "local_favorite", "queue_expected"],
    hours: { mon: "Closed", tue: "05:30-12:30", wed: "05:30-12:30", thu: "05:30-12:30", fri: "05:30-12:30", sat: "05:30-12:30", sun: "05:30-12:30" },
    officialUrl: "https://guide.michelin.com/en/taipei-region/taipei/restaurant/fuhang-soy-milk", sourcePhoto: images.fuhang,
  }),
  cheap({
    id: "cheap-ay-chung", name: "Ay-Chung Flour-Rice Noodle", neighborhood: "Ximending", coordinates: [25.0433177, 121.5076858],
    description: "Ay-Chung serves one thing fast: a thick, bonito-scented bowl of thin rice noodles with pork intestine, garlic, vinegar, and chilli at the condiment station. There are no proper seats, so treat it as a standing snack amid Ximending rather than a relaxed meal.",
    foodServiceType: "stall", cuisineTypes: ["taiwanese", "rice_noodles", "offal"], attributeTags: ["street_food", "budget_food", "quick_service", "solo_friendly"],
    hours: { mon: "08:00-22:30", tue: "08:00-22:30", wed: "08:00-22:30", thu: "08:00-22:30", fri: "08:00-23:00", sat: "08:00-23:00", sun: "08:00-22:30" },
    officialUrl: "https://guide.michelin.com/en/taipei-region/taipei/restaurant/ay-chung-flour-rice-noodle", sourcePhoto: images.ayChung,
  }),
  cheap({
    id: "cheap-liu-shandong", name: "Liu Shandong Beef Noodles", neighborhood: "Zhongzheng", coordinates: [25.0457, 121.5138],
    description: "Hidden in a lane near Taipei Main Station, Liu Shandong pairs springy hand-worked noodles with clear or braised beef broth. The room is plain and turnover brisk; add the house chilli carefully, then order small cold dishes if the queue has earned you an appetite.",
    cuisineTypes: ["taiwanese", "beef_noodles", "noodles"], attributeTags: ["budget_food", "local_favorite", "noodles", "solo_friendly"],
    hours: { mon: "08:00-18:00", tue: "08:00-18:00", wed: "08:00-18:00", thu: "08:00-18:00", fri: "08:00-18:00", sat: "08:00-18:00", sun: "Closed" },
    officialUrl: "https://guide.michelin.com/en/taipei-region/taipei/restaurant/liu-shandong-beef-noodles", sourcePhoto: images.liuShandong,
  }),
  cheap({
    id: "cheap-muji", name: "Muji Beef Noodles", neighborhood: "Xinyi", coordinates: [25.0339, 121.5645],
    description: "Muji's compact counter focuses on robust braised beef noodle soup, with generous meat, pickled mustard greens, and a broth built for chilli. It is a practical low-cost counterpoint to Xinyi's malls; check the linked Michelin listing for the current branch and service schedule.",
    cuisineTypes: ["taiwanese", "beef_noodles", "noodles"], attributeTags: ["budget_food", "quick_service", "noodles", "solo_friendly"],
    hours: { mon: "11:00-15:00, 17:00-21:00", tue: "11:00-15:00, 17:00-21:00", wed: "Closed", thu: "Closed", fri: "11:00-15:00, 17:00-21:00", sat: "11:00-15:00, 17:00-21:00", sun: "11:00-15:00, 17:00-21:00" },
    officialUrl: "https://guide.michelin.com/en/taipei-region/taipei/restaurants", sourcePhoto: images.muji,
    mapQuery: "Muji Beef Noodles Taipei",
  }),
  cheap({
    id: "cheap-jin-feng", name: "Jin Feng Braised Pork Rice", neighborhood: "Zhongzheng", coordinates: [25.0322, 121.5189],
    description: "Jin Feng ladles glossy minced pork over rice in several sizes, leaving room for bamboo shoots, braised egg, bitter-melon soup, or tofu. The dining room moves quickly and stays busy; order a small rice bowl first so the side dishes can do their share.",
    cuisineTypes: ["taiwanese", "lu_rou_fan", "rice"], attributeTags: ["budget_food", "local_favorite", "quick_service", "solo_friendly"],
    hours: { mon: "Closed", tue: "11:00-01:00", wed: "11:00-01:00", thu: "11:00-01:00", fri: "11:00-01:00", sat: "11:00-01:00", sun: "11:00-01:00" },
    officialUrl: "https://guide.michelin.com/en/taipei-region/taipei/restaurant/jin-feng-braised-pork-rice", sourcePhoto: images.jinFeng,
  }),
  cheap({
    id: "cheap-wangs-broth", name: "Wang's Broth", neighborhood: "Wanhua", coordinates: [25.0367, 121.4983],
    description: "At Huaxi Street, Wang's Broth turns chopped pork, pickles, and a peppery clear soup into a deceptively deep bowl. Pair it with braised pork rice and cabbage; the market setting is functional, crowded, and more rewarding before the late dinner rush.",
    cuisineTypes: ["taiwanese", "pork", "rice"], attributeTags: ["market", "budget_food", "local_favorite", "quick_service"],
    hours: { mon: "09:00-20:00", tue: "Closed", wed: "09:00-20:00", thu: "09:00-20:00", fri: "09:00-20:00", sat: "09:00-20:00", sun: "09:00-20:00" },
    officialUrl: "https://guide.michelin.com/en/taipei-region/taipei/restaurant/hsiao-wang-steamed-minced-pork-with-pickles-in-broth", sourcePhoto: images.wangsBroth,
  }),
  cheap({
    id: "cheap-yuan-fang", name: "Yuan Fang Guabao", neighborhood: "Wanhua", coordinates: [25.0365, 121.4981],
    description: "Yuan Fang stuffs a steamed white bun with braised pork belly, pickled mustard greens, coriander, and peanut sugar. It is rich, sweet, sharp, and designed to be eaten in a few messy minutes while exploring Huaxi Street—napkins are not optional.",
    foodServiceType: "stall", cuisineTypes: ["taiwanese", "guabao", "pork"], attributeTags: ["street_food", "market", "budget_food", "quick_service"],
    hours: { mon: "Closed", tue: "11:30-20:00", wed: "11:30-20:00", thu: "11:30-20:00", fri: "11:30-20:00", sat: "11:30-20:00", sun: "11:30-20:00" },
    officialUrl: "https://guide.michelin.com/en/taipei-region/taipei/restaurant/yuan-fang-guabao", sourcePhoto: images.yuanFang,
  }),
  cheap({
    id: "cheap-good-friend", name: "Good Friend Cold Noodles", neighborhood: "Shilin", coordinates: [25.0891236, 121.5255571],
    description: "Sesame sauce, cucumber, and chewy chilled noodles make this Shilin stall a clean reset between fried night-market snacks. Add the miso soup with egg and pork balls; service is fast, portions modest, and the stall works especially well on humid evenings.",
    foodServiceType: "stall", cuisineTypes: ["taiwanese", "cold_noodles", "night_market"], attributeTags: ["street_food", "market", "budget_food", "late_night"],
    hours: { mon: "16:30-23:30", tue: "16:30-23:30", wed: "16:30-23:30", thu: "Closed", fri: "16:30-23:30", sat: "16:30-23:30", sun: "16:30-23:30" },
    officialUrl: "https://guide.michelin.com/en/taipei-region/taipei/restaurant/good-friend-cold-noodles", sourcePhoto: images.goodFriend,
  }),
  cheap({
    id: "cheap-lao-shan-dong", name: "Lao Shan Dong Homemade Noodles", neighborhood: "Ximending", coordinates: [25.0424, 121.5065],
    description: "Deep inside the basement of Wannian Commercial Building, Lao Shan Dong cuts thick, elastic noodles for beef soup and sesame-sauce bowls. The setting feels frozen in an earlier Ximending; look for the food-court signage and bring cash.",
    foodServiceType: "cafeteria", cuisineTypes: ["taiwanese", "beef_noodles", "handmade_noodles"], attributeTags: ["budget_food", "local_favorite", "noodles", "solo_friendly"],
    hours: { mon: "10:30-21:30", tue: "10:30-21:30", wed: "10:30-21:30", thu: "10:30-21:30", fri: "10:30-21:30", sat: "10:30-21:30", sun: "10:30-21:30" },
    officialUrl: "https://guide.michelin.com/en/taipei-region/taipei/restaurant/lao-shan-dong-homemade-noodles", sourcePhoto: images.laoShanDong,
  }),
  cheap({
    id: "cheap-chung-chia", name: "Chung Chia Sheng Jian Bao", neighborhood: "Shilin", coordinates: [25.0894337, 121.5263316],
    description: "These pan-fried buns leave the griddle with crisp bottoms, fluffy tops, and either juicy pork or cabbage filling. They are dangerously hot at first bite; buy both versions, step away from the queue, and let the steam escape before committing.",
    foodServiceType: "stall", cuisineTypes: ["taiwanese", "sheng_jian_bao", "dumplings"], attributeTags: ["street_food", "market", "budget_food", "quick_service"],
    hours: { mon: "14:00-21:00", tue: "14:00-21:00", wed: "Closed", thu: "14:00-21:00", fri: "14:00-21:00", sat: "14:00-21:00", sun: "14:00-21:00" },
    officialUrl: "https://guide.michelin.com/en/taipei-region/taipei/restaurant/chung-chia-sheng-jian-bao", sourcePhoto: images.chungChia,
  }),
];

const hotelStops = [
  hotel({
    id: "hotel-capella", name: "Capella Taipei", neighborhood: "Songshan", coordinates: [25.0532059, 121.5499771],
    description: "André Fu conceived Capella as a modern mansion above Dunhua North Road, with just 86 rooms, calm residential interiors, and serious city views. Terrace suites add private pools; the small key count and in-house cultural programming distinguish it from Taipei's large luxury towers.",
    attributeTags: ["luxury", "design", "scenic", "spa"], officialUrl: "https://capellahotels.com/en/en/cn/taipei", bookingUrl: "https://www.booking.com/hotel/tw/capella-taipei.en-gb.html", sourcePhoto: images.capella,
    editorialUrls: ["https://guide.michelin.com/en/hotels-stays/Songshan%20District/capella-taipei-hotel-15366"],
  }),
  hotel({
    id: "hotel-mandarin", name: "Mandarin Oriental, Taipei", neighborhood: "Songshan", coordinates: [25.0556686, 121.5482403],
    description: "This low-rise-feeling Art Deco palace hides some of Taipei's largest rooms behind a formal stone façade. Service, spa, pool, and destination restaurants make it easy to stay in; choose it for cocooning near Taipei Arena, not for instant access to Ximending.",
    attributeTags: ["luxury", "spa", "romantic", "family_friendly"], officialUrl: "https://www.mandarinoriental.com/en/taipei/songshan", bookingUrl: "https://www.booking.com/hotel/tw/mandarin-oriental-taipei.en-gb.html", sourcePhoto: images.mandarin,
    editorialUrls: ["https://guide.michelin.com/us/en/hotels-stays/taipei/mandarin-oriental-taipei-7573"],
  }),
  hotel({
    id: "hotel-regent", name: "Regent Taipei", neighborhood: "Zhongshan", coordinates: [25.0541709, 121.5240968],
    description: "Regent is a full-service grande dame in Zhongshan, with a vast atrium, rooftop pool, serious breakfast operation, and Robin's Grill downstairs. The rooms are conventional but generous; proximity to shops and the red MRT line makes the scale useful rather than overwhelming.",
    attributeTags: ["luxury", "central", "family_friendly", "business"], officialUrl: "https://www.ihg.com/regent/hotels/us/en/taipei/tperg/hoteldetail", bookingUrl: "https://www.booking.com/hotel/tw/the-regent-taipei.en-gb.html", sourcePhoto: images.regent,
  }),
  hotel({
    id: "hotel-grand-hyatt", name: "Grand Hyatt Taipei", neighborhood: "Xinyi", coordinates: [25.0353021, 121.5626204],
    description: "Grand Hyatt places 850 rooms beside Taipei 101, the convention centre, malls, and Xinyi nightlife. It is a large, efficient hotel rather than an intimate one; tower-facing rooms, the outdoor pool, and near-indoor access to the district are the reasons to book.",
    attributeTags: ["luxury", "central", "family_friendly", "scenic"], officialUrl: "https://www.hyatt.com/grand-hyatt/en-US/taigh-grand-hyatt-taipei", bookingUrl: "https://www.booking.com/hotel/tw/grand-hyatt-taipei.en-gb.html", sourcePhoto: images.grandHyatt,
    editorialUrls: ["https://guide.michelin.com/ie/en/hotels-stays/taipei/grand-hyatt-taipei-7566"],
  }),
  hotel({
    id: "hotel-kimpton", name: "Kimpton Da An Hotel", neighborhood: "Da'an", coordinates: [25.0403701, 121.5455263],
    description: "Kimpton Da An trades marble grandeur for a compact, Japanese-influenced design by Neri & Hu. Rooms use warm timber and considered storage, while complimentary social hours and pet-friendly policies keep the atmosphere informal; Zhongxiao Fuxing MRT is close.",
    attributeTags: ["design", "boutique", "pet_friendly", "central"], officialUrl: "https://www.ihg.com/kimptonhotels/hotels/us/en/da-an-hotel-taipei/tpekm/hoteldetail", bookingUrl: "https://www.booking.com/hotel/tw/kimpton-da-an-taipei.en-gb.html", sourcePhoto: images.kimpton,
  }),
  hotel({
    id: "hotel-eslite", name: "eslite hotel", neighborhood: "Xinyi", coordinates: [25.0446431, 121.5618788],
    description: "Eslite hotel sits inside Songshan Cultural and Creative Park, linking bookshop culture, design retail, and green space. Rooms are calm and contemporary, many facing the park or skyline; it suits travellers who want Xinyi access without sleeping inside a shopping mall.",
    attributeTags: ["design", "scenic", "quiet", "central"], officialUrl: "https://www.eslitehotel.com/en/", bookingUrl: "https://www.booking.com/hotel/tw/eslite.en-gb.html", sourcePhoto: images.eslite,
  }),
  hotel({
    id: "hotel-proverbs", name: "Hotel Proverbs Taipei", neighborhood: "Da'an", coordinates: [25.0429182, 121.5459883],
    description: "Philippe Starck alumnus Ray Chen designed this 42-room hotel with dark metal, leather, and a tiny rooftop pool. Rooms feel more like dramatic apartments than corporate boxes; book it for Zhongxiao shopping and Da'an bars, but expect nightlife energy outside.",
    attributeTags: ["boutique", "design", "central", "rooftop"], officialUrl: "https://www.hotel-proverbs.com/", bookingUrl: "https://www.booking.com/hotel/tw/proverbs-taipei.en-gb.html", sourcePhoto: images.proverbs,
  }),
  hotel({
    id: "hotel-okura", name: "The Okura Prestige Taipei", neighborhood: "Zhongshan", coordinates: [25.052519, 121.5233831],
    description: "Okura brings Japanese service rhythms, spacious rooms, a rooftop pool, and a strong bakery to central Zhongshan. The look is polished rather than adventurous; travellers who value calm, immaculate upkeep, and easy red-line MRT access will appreciate the restraint.",
    attributeTags: ["luxury", "central", "quiet", "business"], officialUrl: "https://www.okurataipei.com.tw/en/", bookingUrl: "https://www.booking.com/hotel/tw/the-okura-prestige-taipei.en-gb.html", sourcePhoto: images.okura,
  }),
  hotel({
    id: "hotel-shangri-la", name: "Shangri-La Far Eastern, Taipei", neighborhood: "Da'an", coordinates: [25.0268, 121.5494],
    description: "The Shangri-La occupies the upper floors of the Far Eastern complex, giving even standard rooms broad views toward Taipei 101 or the hills. The rooftop pool is the visual payoff; the location is quieter than Xinyi and better for guests content to use taxis.",
    attributeTags: ["luxury", "scenic", "family_friendly", "rooftop"], officialUrl: "https://www.shangri-la.com/taipei/fareasternplazashangrila/", bookingUrl: "https://www.booking.com/hotel/tw/shangri-la-s-far-eastern-plaza-taipei.en-gb.html", sourcePhoto: images.shangriLa,
  }),
  hotel({
    id: "hotel-grand", name: "The Grand Hotel", neighborhood: "Zhongshan", coordinates: [25.0783, 121.5264],
    description: "The red-columned Grand Hotel is a Taipei landmark before it is a convenient base. Hilltop views, monumental interiors, and Cold War history are unforgettable; the tradeoff is distance from the MRT, softened by hotel shuttles and inexpensive taxis.",
    attributeTags: ["historic", "scenic", "iconic", "family_friendly"], officialUrl: "https://www.grand-hotel.org/EN/official/main.aspx", bookingUrl: "https://www.booking.com/hotel/tw/the-grand.en-gb.html", sourcePhoto: images.grandHotel,
  }),
];

const hostelStops = [
  hostel({
    id: "hostel-meander", name: "MEANDER Taipei", neighborhood: "Ximending", coordinates: [25.0438313, 121.5024671],
    description: "MEANDER's large common room and organised activities make it one of Ximending's most reliably social hostels. Dorms are straightforward and the walk from the MRT is longer than some rivals; choose it to meet people, not for monastic quiet.",
    attributeTags: ["budget", "social", "lively", "central"], officialUrl: "https://www.hostelworld.com/hostels/p/81680/meander-taipei/", bookingUrl: "https://www.hostelworld.com/hostels/p/81680/meander-taipei/", sourcePhoto: images.meander,
  }),
  hostel({
    id: "hostel-meander-1948", name: "MEANDER 1948", neighborhood: "Datong", coordinates: [25.050467, 121.5151217],
    description: "A restored 1948 building near Taipei Main Station gives this MEANDER branch more design character and a calmer pace than its Ximending sibling. The café and rooftop encourage conversation, while the Airport MRT and Ningxia Night Market sit within walking distance.",
    attributeTags: ["budget", "design", "social", "central"], officialUrl: "https://www.hostelworld.com/hostels/p/291838/meander-1948/", bookingUrl: "https://www.hostelworld.com/hostels/p/291838/meander-1948/", sourcePhoto: images.meander1948,
  }),
  hostel({
    id: "hostel-star", name: "Star Hostel Taipei Main Station", neighborhood: "Datong", coordinates: [25.0511, 121.5143],
    description: "Star's plant-filled lounge, timber bunks, and careful breakfast feel unusually polished for a hostel. It is social without being a party house and very convenient for the Airport MRT; light sleepers should still request a bunk away from common areas.",
    attributeTags: ["budget", "design", "social", "central"], officialUrl: "https://www.hostelworld.com/hostels/p/85980/star-hostel-taipei-main-station/", bookingUrl: "https://www.hostelworld.com/hostels/p/85980/star-hostel-taipei-main-station/", sourcePhoto: images.starHostel,
  }),
  hostel({
    id: "hostel-may-rooms", name: "May Rooms Taipei Main Station Hostel", neighborhood: "Zhongzheng", coordinates: [25.0474355, 121.5108621],
    description: "May Rooms is a compact, central choice close to Beimen and Taipei Main Station, with simple dorms and a small communal kitchen. It lacks the programmed social scene of larger hostels, which suits travellers prioritising transport and a low nightly rate.",
    attributeTags: ["budget", "central", "quiet", "solo_travel"], officialUrl: "https://www.hostelworld.com/hostels/p/289035/may-rooms-taipei-main-station-hostel/", bookingUrl: "https://www.hostelworld.com/hostels/p/289035/may-rooms-taipei-main-station-hostel/", sourcePhoto: images.mayRooms,
  }),
  hostel({
    id: "hostel-beimen-wow", name: "Beimen WOW Poshtel", neighborhood: "Datong", coordinates: [25.0522481, 121.5155035],
    description: "Beimen WOW mixes capsule-style dorms, private rooms, and a bright basement lounge near the Airport MRT. It is more polished than a bare-bones bunkhouse but still compact; check room dimensions carefully if travelling with large luggage.",
    attributeTags: ["budget", "central", "social", "design"], officialUrl: "https://www.hostelworld.com/hostels/p/270141/beimen-wow-poshtel/", bookingUrl: "https://www.hostelworld.com/hostels/p/270141/beimen-wow-poshtel/", sourcePhoto: images.beimen,
  }),
  hostel({
    id: "hostel-workinn", name: "Workinn at Taipei Main Station", neighborhood: "Zhongzheng", coordinates: [25.0455, 121.5158],
    description: "Workinn is built around privacy-conscious pods and single cabins rather than a backpacker party. Taipei Main Station is the practical advantage; shared bathrooms and limited floor space keep prices down, so it works best for short, transit-heavy stays.",
    attributeTags: ["budget", "central", "quiet", "work_friendly"], officialUrl: "https://www.hostelworld.com/hostels/p/328822/workinn-at-taipei-main-station/", bookingUrl: "https://www.hostelworld.com/hostels/p/328822/workinn-at-taipei-main-station/", sourcePhoto: images.workinn,
  }),
  hostel({
    id: "hostel-dongmen-3", name: "Dongmen 3 Hostel", neighborhood: "Da'an", coordinates: [25.0337761, 121.527701],
    description: "Dongmen 3 puts tidy dorms and private rooms beside Dongmen MRT, Yongkang Street, and excellent breakfast shops. The atmosphere is small and low-key rather than highly social; location and cleanliness are the strongest reasons to stay.",
    attributeTags: ["budget", "central", "quiet", "solo_travel"], officialUrl: "https://www.hostelworld.com/hostels/p/269813/dongmen-3-hostel/", bookingUrl: "https://www.hostelworld.com/hostels/p/269813/dongmen-3-hostel/", sourcePhoto: images.dongmen,
  }),
  hostel({
    id: "hostel-corner", name: "Corner Hostel & Cafe", neighborhood: "Datong", coordinates: [25.0722, 121.5154],
    description: "Corner Hostel occupies a quieter northern pocket beside Yuanshan MRT, Taipei Expo Park, and the Confucius Temple. The café and terrace create gentle communal space; it trades nightlife at the door for parks, temple walks, and easy red-line transport.",
    attributeTags: ["budget", "quiet", "social", "design"], officialUrl: "https://www.hostelworld.com/hostels/p/293890/corner-hostel-and-cafe/", bookingUrl: "https://www.hostelworld.com/hostels/p/293890/corner-hostel-and-cafe/", sourcePhoto: images.cornerHostel,
  }),
  hostel({
    id: "hostel-taipei-109", name: "Taipei 109 Hostel", neighborhood: "Zhongzheng", coordinates: [25.0459, 121.5111],
    description: "Taipei 109 is a small, friendly hostel on Bo'ai Road between the main station and Ximending. Reception is not staffed around the clock, so arrival communication matters; in return, guests get clean bunks, a useful common room, and exceptional transport access.",
    attributeTags: ["budget", "central", "social", "work_friendly"], officialUrl: "https://www.hostelworld.com/hostels/p/294739/taipei-109-hostel/", bookingUrl: "https://www.hostelworld.com/hostels/p/294739/taipei-109-hostel/", sourcePhoto: images.taipei109,
    hours: { default: "Check-in 15:00-23:00 and check-out by 11:00; limited reception and arrival instructions are published on the Hostelworld property page." },
  }),
  hostel({
    id: "hostel-taiwan-youth", name: "Taiwan Youth Hostel & Capsule Hotel", neighborhood: "Zhongzheng", coordinates: [25.0450314, 121.517779],
    description: "Below street level near Taipei Main Station, Taiwan Youth Hostel combines capsule bunks with a broad communal kitchen, work tables, and music rooms. The windowless layout will not suit everyone, but transport convenience and well-equipped shared space are excellent.",
    attributeTags: ["budget", "central", "social", "work_friendly"], officialUrl: "https://www.hostelworld.com/hostels/p/271891/taiwan-youth-hostel-and-capsule-hotel/", bookingUrl: "https://www.hostelworld.com/hostels/p/271891/taiwan-youth-hostel-and-capsule-hotel/", sourcePhoto: images.taiwanYouth,
  }),
];

const casualBarStops = [
  casualBar({
    id: "bar-taihu-driftwood", name: "Taihu Driftwood", neighborhood: "Ximending", coordinates: [25.0468243, 121.505598],
    description: "Taihu turns a timber-lined room beside Papa Whale into a lively showcase for Taiwan-brewed IPAs, fruit beers, and canned cocktail experiments. The kitchen leans snacky and the crowd mixed; start with a flight before committing to the stronger taps.",
    nightlifeType: "brewery", attributeTags: ["craft_beer", "lively_nightlife", "casual_nightlife", "walk_in_friendly_nightlife"],
    hours: { mon: "17:00-23:30", tue: "17:00-23:30", wed: "17:00-23:30", thu: "17:00-23:30", fri: "17:00-01:00", sat: "15:00-01:00", sun: "15:00-23:30" },
    officialUrl: "https://www.taihubrewing.com/en/pages/taihu-retail", sourcePhoto: images.taihu, editorialUrls: [guideUrls.beerAsia],
  }),
  casualBar({
    id: "bar-mikkeller", name: "Mikkeller Bar Taipei", neighborhood: "Datong", coordinates: [25.0536758, 121.5101463],
    description: "Mikkeller occupies a narrow heritage shophouse at the foot of Dihua Street, pairing Danish house beers with a rotating Taiwanese and international tap list. Upstairs seating is intimate and steep-staired; ask staff for local pours before defaulting to familiar labels.",
    nightlifeType: "beer_bar", attributeTags: ["craft_beer", "low_key_nightlife", "tourist_friendly", "casual_nightlife"],
    hours: { mon: "16:00-00:00", tue: "16:00-00:00", wed: "16:00-00:00", thu: "16:00-00:00", fri: "16:00-00:00", sat: "16:00-00:00", sun: "14:00-00:00" },
    officialUrl: "https://www.mikkeller.com/locations/mikkeller-bar-taipei", sourcePhoto: images.mikkeller, editorialUrls: [guideUrls.beerAsia],
  }),
  casualBar({
    id: "bar-floating", name: "Floating Taipei", neighborhood: "Datong", coordinates: [25.0538347, 121.512399],
    description: "Floating anchors its Nanjing West Road bar with 18 rotating taps, an extensive cocktail list, and frequent discounts on Taiwanese brewers such as Taihu, 23 Brewing, and Ugly Half. Baseball figures and cartoons projected across the walls keep the room playful; the front window bench is the better perch on a mild night.",
    nightlifeType: "beer_bar", attributeTags: ["craft_beer", "local_bar", "casual_nightlife", "walk_in_friendly_nightlife"],
    hours: { mon: "18:00-01:30", tue: "18:00-01:30", wed: "18:00-01:30", thu: "18:00-01:30", fri: "18:00-02:30", sat: "18:00-02:30", sun: "18:00-00:00" },
    officialUrl: "https://www.instagram.com/floatingtaipei/", sourcePhoto: images.floating,
    editorialUrls: ["https://www.travel.taipei/en/pictorial/article/67397", guideUrls.taiwanderersBeer],
  }),
  casualBar({
    id: "bar-revolver", name: "Revolver", neighborhood: "Zhongzheng", coordinates: [25.0342656, 121.5174376],
    description: "A teal-painted downstairs bar supports a tiny upstairs live room where Taipei indie, punk, and experimental bands play at close range. Drinks are simple and affordable; check the performance calendar because the atmosphere changes completely when a show is on.",
    nightlifeType: "live_music_venue", musicGenres: ["indie", "punk", "rock", "experimental"], attributeTags: ["live_music", "lively_nightlife", "casual_nightlife", "late_late"],
    hours: { mon: "18:30-01:00", tue: "18:30-03:00", wed: "18:30-03:00", thu: "18:30-03:00", fri: "18:30-04:00", sat: "18:30-04:00", sun: "18:30-03:00" },
    officialUrl: "https://www.facebook.com/revolvertaipei/", sourcePhoto: images.revolver, editorialUrls: [guideUrls.beerAsia],
  }),
  casualBar({
    id: "bar-flow", name: "Flow Brewing Beer Taproom", neighborhood: "Xinyi", coordinates: [25.0295, 121.5586],
    description: "Flow's clean Jiaxing Street taproom is built for drinkers who want to talk directly with the brewers. Hazy IPAs and fruit-driven experiments dominate, with small pours useful for comparison; food is limited, so eat before settling in.",
    nightlifeType: "brewery", attributeTags: ["craft_beer", "low_key_nightlife", "local_bar", "walk_in_friendly_nightlife"],
    hours: { mon: "Closed", tue: "17:00-00:00", wed: "17:00-00:00", thu: "17:00-00:00", fri: "17:00-00:30", sat: "17:00-00:30", sun: "17:00-00:00" },
    officialUrl: "https://www.instagram.com/flowbrewing.tw/", sourcePhoto: images.flow, editorialUrls: [guideUrls.beerAsia, guideUrls.taiwanderersBeer],
  }),
  casualBar({
    id: "bar-23-public", name: "23 Public", neighborhood: "Da'an", coordinates: [25.0228911, 121.5432053],
    description: "Part taproom, part record shop, 23 Public serves each house beer with a small card explaining style and flavor. The hexagonal bar encourages conversation, and the hand-pulled real ale adds range beyond standard keg pours; snacks remain secondary.",
    nightlifeType: "brewery", attributeTags: ["craft_beer", "local_bar", "low_key_nightlife", "walk_in_friendly_nightlife"],
    hours: { mon: "16:30-00:00", tue: "16:30-00:00", wed: "12:30-00:00", thu: "12:30-00:00", fri: "12:30-01:00", sat: "12:30-01:00", sun: "12:30-00:00" },
    officialUrl: "https://www.instagram.com/23_public/", sourcePhoto: images.public23, editorialUrls: [guideUrls.beerAsia],
  }),
  casualBar({
    id: "bar-jim-dads", name: "Jim & Dad's Taproom", neighborhood: "Datong", coordinates: [25.0564, 121.5106],
    description: "Jim & Dad's brings its Yilan brewery to Dadaocheng through tea, kumquat, guava, and passionfruit beers that taste rooted in Taiwan rather than novelty-driven. The bottle-shop shelves reward browsing; ask for a tasting pour before ordering the fruitier releases.",
    nightlifeType: "brewery", attributeTags: ["craft_beer", "local_bar", "casual_nightlife", "walk_in_friendly_nightlife"],
    hours: { mon: "16:00-00:00", tue: "Closed", wed: "16:00-00:00", thu: "16:00-00:00", fri: "16:00-00:00", sat: "16:00-00:00", sun: "Closed" },
    officialUrl: "https://www.instagram.com/jimanddads.taipei/", sourcePhoto: images.jimDads, editorialUrls: [guideUrls.beerAsia],
  }),
  casualBar({
    id: "bar-crafted", name: "Crafted Beer & Co.", neighborhood: "Zhongshan", coordinates: [25.0706, 121.5202],
    description: "Inside Maji Square, Crafted combines four taps with fridges of Taiwanese and imported bottles. Expo Park events can make the terrace lively, while quieter nights suit label browsing; it is a bottle-shop bar, so the choice matters more than elaborate service.",
    nightlifeType: "beer_bar", attributeTags: ["craft_beer", "outdoor_seating", "casual_nightlife", "walk_in_friendly_nightlife"],
    hours: { mon: "17:00-23:30", tue: "17:00-23:30", wed: "17:00-23:30", thu: "17:00-23:30", fri: "14:00-00:30", sat: "13:00-00:30", sun: "13:00-23:30" },
    officialUrl: "https://www.instagram.com/craftedbeerandco/", sourcePhoto: images.crafted, editorialUrls: [guideUrls.beerAsia],
  }),
  casualBar({
    id: "bar-ximen-beer", name: "Ximen Beer Bar", neighborhood: "Ximending", coordinates: [25.0453318, 121.5051232],
    description: "Neon, pavement stools, and a multilingual crowd make Ximen Beer Bar unusually easy for solo travellers. The list spans Taiwanese craft beer, imports, whisky, and cider; it is more social than scholarly, especially once the cinema-street crowd arrives.",
    nightlifeType: "beer_bar", attributeTags: ["craft_beer", "social", "lively_nightlife", "late_late"],
    hours: { mon: "19:00-02:00", tue: "19:00-02:00", wed: "19:00-02:00", thu: "19:00-02:00", fri: "18:00-02:30", sat: "18:00-02:30", sun: "19:00-02:00" },
    officialUrl: "https://www.instagram.com/ximenbeerbar/", sourcePhoto: images.ximenBeer, editorialUrls: [guideUrls.beerAsia, guideUrls.taiwanderersBeer],
  }),
  casualBar({
    id: "bar-on-tap", name: "ON TAP", neighborhood: "Da'an", coordinates: [25.0413, 121.5528],
    description: "ON TAP is an English-style pub with two floors, draught beer, pool, darts, a beer garden, and enough screens for major football. Come for communal match energy and pub food rather than Taiwanese brewing subtlety; big fixtures fill the room.",
    nightlifeType: "pub", attributeTags: ["sports_screening", "games", "group_friendly", "lively_nightlife"],
    hours: { mon: "17:00-00:30", tue: "17:00-00:30", wed: "17:00-01:30", thu: "17:00-01:30", fri: "17:00-02:30", sat: "16:00-02:30", sun: "16:00-00:30" },
    officialUrl: "https://www.facebook.com/ontaptaipei/", sourcePhoto: images.onTap, editorialUrls: ["https://www.findglocal.com/TW/Taipei/141391212589901/On-Tap"],
  }),
];

const cocktailStops = [
  cocktailBar({
    id: "cocktail-infinity", name: "To Infinity & Beyond", neighborhood: "Xinyi", coordinates: [25.0377, 121.5674],
    description: "A futuristic room high in Xinyi uses centrifuges, clarification, and precise temperature control without losing sight of drinkability. Cocktails arrive with visual theatre and Taiwanese references; reserve a seat, then let the menu explain its more technical constructions.",
    attributeTags: ["craft_cocktails", "dressy", "scenic_nightlife", "reservation_recommended_nightlife"], officialUrl: "https://www.instagram.com/toinfinityandbeyond.tw/", sourcePhoto: images.infinity,
    editorialUrls: ["https://www.theworlds50best.com/bars/best-in-asia/the-list/to-infinity-and-beyond.html"],
  }),
  cocktailBar({
    id: "cocktail-bar-mood", name: "Bar Mood Taipei", neighborhood: "Da'an", coordinates: [25.0372, 121.5507],
    description: "Nick Wu's warm, handcrafted room uses Taiwanese flowers, herbs, tea, and agricultural flavors in polished cocktails. Counter seats are worth requesting because the bartenders explain the produce; the mood remains hospitable rather than laboratory-cold.",
    attributeTags: ["craft_cocktails", "romantic_nightlife", "local_bar", "reservation_recommended_nightlife"],
    hours: { mon: "18:00-01:00", tue: "18:00-01:00", wed: "18:00-01:00", thu: "18:00-01:00", fri: "18:00-02:00", sat: "18:00-02:00", sun: "18:00-01:00" },
    officialUrl: "https://barmood.wordpress.com/", bookingUrl: "https://barmood.wordpress.com/", sourcePhoto: images.barMood,
  }),
  cocktailBar({
    id: "cocktail-public-house", name: "The Public House", neighborhood: "Xinyi", coordinates: [25.0295, 121.5613],
    description: "The Public House looks like a neighborhood tavern but treats cocktails with ranking-list seriousness, balancing Taiwanese ingredients with accessible classics. It is lively and unpretentious; arrive early for the bar, where ordering off-menu is easier.",
    attributeTags: ["craft_cocktails", "lively_nightlife", "local_bar", "walk_in_friendly_nightlife"], officialUrl: "https://www.instagram.com/thepublichouse_taipei/", sourcePhoto: images.publicHouse,
    editorialUrls: ["https://www.theworlds50best.com/discovery/Establishments/Taiwan/Taipei/The-Public-House.html", guideUrls.asiaBars2026],
  }),
  cocktailBar({
    id: "cocktail-lab", name: "Lab", neighborhood: "Xinyi", coordinates: [25.0317351, 121.5581631],
    description: "Makita Takafumi strips the room and drinks of distracting color so aroma, dilution, and texture take over. Many cocktails appear crystal clear despite layered flavors; this is a focused, small-format experience for technique-minded drinkers, not a loud group night.",
    attributeTags: ["craft_cocktails", "low_key_nightlife", "dressy", "reservation_recommended_nightlife"], officialUrl: "https://www.instagram.com/lab_tw/", sourcePhoto: images.lab,
    editorialUrls: ["https://www.theworlds50best.com/discovery/Establishments/Taiwan/Taipei/Lab.html", guideUrls.asiaBars2026],
  }),
  cocktailBar({
    id: "cocktail-indulge", name: "Indulge Experimental Bistro", neighborhood: "Da'an", coordinates: [25.0391, 121.5442],
    description: "Aki Wang's long-running bar helped define modern Taiwanese cocktails through tea, local spirits, and culinary technique. Drinks can be intricate and presentation-led, but the bistro food keeps the evening grounded; reservations are sensible for a full dinner-and-drinks visit.",
    attributeTags: ["craft_cocktails", "destination_bar", "dressy", "reservation_recommended_nightlife"], officialUrl: "https://www.facebook.com/INDULGE.TAIPEI/", bookingUrl: "https://www.facebook.com/INDULGE.TAIPEI/", sourcePhoto: images.indulge,
    editorialUrls: ["https://www.theworlds50best.com/discovery/Establishments/Taiwan/Taipei/Indulge-Experimental-Bistro.html"],
  }),
  cocktailBar({
    id: "cocktail-bar-pine", name: "Bar Pine", neighborhood: "Da'an", coordinates: [25.0321, 121.5505],
    description: "Ariel Hou draws on memory, Taiwanese ingredients, wood, and visual art in a restrained former timber-shop space. Menus change by cultural theme rather than spirit category; Tuesday is the fixed closure, and a reservation protects the small room on weekends.",
    attributeTags: ["craft_cocktails", "design", "romantic_nightlife", "reservation_recommended_nightlife"],
    hours: { default: "Evening cocktail service Wednesday-Monday; closed Tuesday, with nightly opening and reservation windows published on the linked official Bar Pine page." },
    officialUrl: "https://barpine.com/about", bookingUrl: "https://barpine.com/about", sourcePhoto: images.barPine,
  }),
  cocktailBar({
    id: "cocktail-ounce", name: "Ounce Taipei", neighborhood: "Da'an", coordinates: [25.0423, 121.5485],
    description: "Ounce is a low-lit, conversation-first room where bartenders handle classics with confidence and build originals around the guest. The Old Fashioned is a reliable opening order; weekend groups should reserve, while early weekday walk-ins have a better chance.",
    attributeTags: ["craft_cocktails", "speakeasy", "romantic_nightlife", "reservation_recommended_nightlife"],
    hours: { mon: "Closed", tue: "20:00-02:00", wed: "20:00-02:00", thu: "20:00-02:00", fri: "20:00-02:00", sat: "20:00-02:00", sun: "Closed" },
    officialUrl: "https://www.instagram.com/ounce.taipei/", sourcePhoto: images.ounce, editorialUrls: ["https://barsforkings.com/bars/taipei/ounce/"],
  }),
  cocktailBar({
    id: "cocktail-east-end", name: "East End", neighborhood: "Da'an", coordinates: [25.0429182, 121.5459883],
    description: "East End occupies Hotel Proverbs with a polished back bar, serious Japanese-influenced technique, and enough space for a composed hotel-bar evening. Drinks skew precise and spirit-forward; it is dressier and quieter than the nearby standing bars.",
    attributeTags: ["craft_cocktails", "hotel_bar", "dressy", "romantic_nightlife"], officialUrl: "https://www.hotel-proverbs.com/east-end/", bookingUrl: "https://www.hotel-proverbs.com/east-end/", sourcePhoto: images.eastEnd,
    editorialUrls: ["https://barsforkings.com/bars/taipei/east-end-cocktail/"],
  }),
  cocktailBar({
    id: "cocktail-draftland", name: "Draft Land", neighborhood: "Da'an", coordinates: [25.0415, 121.5539],
    description: "Draft Land made cocktails-on-tap credible by pairing speed and consistency with thoughtful recipes such as tea spritzes and clarified classics. There are no stools at the Zhongxiao bar, prices stay approachable, and walk-ins can sample small pours without committing to a ceremony.",
    price: "$$", attributeTags: ["craft_cocktails", "walk_in_friendly_nightlife", "casual_nightlife", "lively_nightlife"],
    hours: { mon: "18:00-01:00", tue: "18:00-01:00", wed: "18:00-01:00", thu: "18:00-01:00", fri: "18:00-01:00", sat: "18:00-01:00", sun: "18:00-01:00" },
    officialUrl: "https://www.draftland.tw/tpe", sourcePhoto: images.draftland,
  }),
  cocktailBar({
    id: "cocktail-bar-pun", name: "Bar Pun", neighborhood: "Zhongshan", coordinates: [25.0528, 121.5254],
    description: "Bar Pun uses wordplay—Mai Tai-pei and other menu jokes—as the doorway to technically sharp drinks with Sichuan spice, fruit, and tea. The hidden entrance adds fun without becoming the entire experience; reserve later weekend slots.",
    attributeTags: ["craft_cocktails", "speakeasy", "lively_nightlife", "reservation_recommended_nightlife"], officialUrl: "https://www.instagram.com/bar_pun/", sourcePhoto: images.barPun,
    editorialUrls: ["https://barsforkings.com/bars/taipei/bar-pun/"],
  }),
];

const cultureStops = [
  cultureStop({
    id: "culture-palace-museum", name: "National Palace Museum", neighborhood: "Shilin", coordinates: [25.1015744, 121.5488623],
    description: "Imperial painting, calligraphy, bronzes, ceramics, and small marvels from the former Qing collection fill this mountainside museum. The jade cabbage is only a gateway; choose two galleries, use the English labels, and allow time for rotation-dependent displays.",
    price: "$$", attributeTags: ["museum", "historic_site", "educational", "rainy_day"],
    hours: { mon: "Closed except dates announced on the official 2026 opening calendar", tue: "09:00-17:00", wed: "09:00-17:00", thu: "09:00-17:00", fri: "09:00-17:00", sat: "09:00-17:00", sun: "09:00-17:00" },
    officialUrl: "https://www.npm.gov.tw/Articles.aspx?l=2&sno=02007001", sourcePhoto: images.palaceMuseum,
  }),
  cultureStop({
    id: "culture-tfam", name: "Taipei Fine Arts Museum", neighborhood: "Zhongshan", coordinates: [25.0720297, 121.5246613],
    description: "TFAM's stacked white galleries present modern and contemporary art from Taiwan alongside international exhibitions and the Taipei Biennial. The building rewards wandering, but exhibition quality sets the visit length; Saturday evening opening is useful for a less rushed look.",
    price: "$", attributeTags: ["museum", "gallery", "contemporary_art", "rainy_day"],
    hours: { mon: "Closed", tue: "09:30-17:30", wed: "09:30-17:30", thu: "09:30-17:30", fri: "09:30-17:30", sat: "09:30-20:30", sun: "09:30-17:30" },
    officialUrl: "https://www.tfam.museum/", sourcePhoto: images.tfam,
  }),
  cultureStop({
    id: "culture-moca", name: "Museum of Contemporary Art Taipei", neighborhood: "Datong", coordinates: [25.0507814, 121.518965],
    description: "A red-brick former school becomes an approachable sequence of rooms for Taiwanese and international contemporary art. MOCA is smaller than TFAM and easier to pair with Zhongshan; installations often use the historic architecture, so even uneven shows reveal the building.",
    price: "$", attributeTags: ["museum", "gallery", "contemporary_art", "historic_site"],
    hours: { mon: "Closed", tue: "10:00-18:00", wed: "10:00-18:00", thu: "10:00-18:00", fri: "10:00-18:00", sat: "10:00-18:00", sun: "10:00-18:00" },
    officialUrl: "https://www.moca.taipei/en/", sourcePhoto: images.moca,
  }),
  cultureStop({
    id: "culture-taiwan-museum", name: "National Taiwan Museum", neighborhood: "Zhongzheng", coordinates: [25.0427647, 121.5150029],
    description: "Taiwan's oldest museum uses its neoclassical main building for natural history, indigenous cultures, and the island's layered environment. A combined ticket can include nearby branches; start here for context before choosing the Land Bank's dinosaur hall or Railway Department.",
    price: "$", attributeTags: ["museum", "historic_site", "educational", "family_culture"],
    hours: { mon: "Closed", tue: "09:30-17:00", wed: "09:30-17:00", thu: "09:30-17:00", fri: "09:30-17:00", sat: "09:30-17:00", sun: "09:30-17:00" },
    officialUrl: "https://www.taiwanmuseum.tw/en/cp.aspx?n=5684", sourcePhoto: images.taiwanMuseum,
  }),
  cultureStop({
    id: "culture-history-museum", name: "National Museum of History", neighborhood: "Zhongzheng", coordinates: [25.0315433, 121.5111845],
    description: "Reopened after a long restoration, this compact museum overlooks the Botanical Garden and ranges across Chinese painting, crafts, archaeology, and modern Taiwanese history. The refurbished building and garden setting make it a calm half-day pairing rather than an all-day institution.",
    price: "$", attributeTags: ["museum", "historic_site", "educational", "garden"],
    hours: { mon: "Closed", tue: "10:00-18:00", wed: "10:00-18:00", thu: "10:00-18:00", fri: "10:00-18:00", sat: "10:00-18:00", sun: "10:00-18:00" },
    officialUrl: "https://www.nmh.gov.tw/en/cp.aspx?n=7162", sourcePhoto: images.historyMuseum,
  }),
  cultureStop({
    id: "culture-longshan", name: "Longshan Temple", neighborhood: "Wanhua", coordinates: [25.0352844, 121.4995813],
    description: "Longshan is an active temple, not a preserved stage set: worshippers consult deities, carry offerings, and move through incense-hazed halls throughout the day. Observe quietly, follow the circulation, and cross to Bopiliao for architectural context after the visit.",
    price: "$", priceSource: "Official temple visitor information: free admission", attributeTags: ["religious_site", "historic_site", "architecture", "free_entry"],
    hours: { default: "Daily 07:00-22:00 according to the official temple visitor information and Taipei Travel listing." },
    officialUrl: "https://www.lungshan.org.tw/en/", sourcePhoto: images.longshan,
  }),
  cultureStop({
    id: "culture-baoan", name: "Dalongdong Baoan Temple", neighborhood: "Datong", coordinates: [25.0723373, 121.5155847],
    description: "Baoan Temple rewards close looking: competing craftspeople filled its roofs, columns, and courtyards with dragons, stone carving, painting, and cut-and-paste ceramics. It remains a working shrine to Baosheng Dadi; combine it with the Confucius Temple across the road.",
    price: "$", priceSource: "Taipei Travel official listing: free admission", attributeTags: ["religious_site", "historic_site", "architecture", "free_entry"],
    hours: { default: "Daily 06:00-21:00 on the official Taipei Travel attraction page." },
    officialUrl: "https://travel.taipei/en/attraction/details/480", sourcePhoto: images.baoan,
  }),
  cultureStop({
    id: "culture-songshan-park", name: "Songshan Cultural and Creative Park", neighborhood: "Xinyi", coordinates: [25.04503, 121.55951],
    description: "A former tobacco factory now holds design exhibitions, maker shops, courtyards, and the Taiwan Design Museum beside Eslite. Public grounds are easy to wander, but the real payoff depends on the current exhibition calendar rather than the retail alone.",
    price: "$", attributeTags: ["historic_site", "design", "gallery", "park"],
    hours: { default: "Public park daily 08:00-22:00; museum, exhibition, and shop hours follow the linked official venue calendar." },
    officialUrl: "https://www.songshanculturalpark.org/english", sourcePhoto: images.songshanPark,
  }),
  cultureStop({
    id: "culture-huashan", name: "Huashan 1914 Creative Park", neighborhood: "Zhongzheng", coordinates: [25.0446089, 121.5291829],
    description: "Brick warehouses from a former winery now host pop-up exhibitions, cinema, concerts, cafés, and design retail. The grounds remain open around the clock, but Huashan is only as good as its current programme; inspect the official calendar before paying for a branded show.",
    price: "$", attributeTags: ["historic_site", "design", "performance_venue", "free_entry"],
    hours: { default: "Public outdoor areas open 24 hours daily; exhibitions, cinema, shops, and performances follow the linked official event calendar." },
    officialUrl: "https://www.huashan1914.com/w/huashan1914_en/index", sourcePhoto: images.huashan,
  }),
  cultureStop({
    id: "culture-cks-memorial", name: "Chiang Kai-shek Memorial Hall", neighborhood: "Zhongzheng", coordinates: [25.0345759, 121.5217812],
    description: "The immense square, blue-roofed memorial, theatre, and concert hall embody both authoritarian commemoration and Taiwan's democratic public life. Read the historical displays critically, then watch how rehearsals, protests, families, and everyday exercise continually remake the space.",
    price: "$", priceSource: "Official memorial visitor information: free admission", attributeTags: ["monument", "historic_site", "architecture", "free_entry"],
    hours: { default: "Memorial Hall daily 09:00-18:00; park grounds 05:00-24:00 according to the official visitor page." },
    officialUrl: "https://www.cksmh.gov.tw/en/", sourcePhoto: images.cks,
  }),
];

const activityStops = [
  cultureStop({
    id: "activity-taipei-101", name: "Taipei 101 Observatory", neighborhood: "Xinyi", coordinates: [25.0335248, 121.5648104],
    description: "High-speed lifts reach indoor views on the 89th floor, the enormous tuned-mass damper, and an outdoor level when weather permits. Visibility matters more than sunset mythology; buy a timed ticket after checking cloud cover, then stay through blue hour if conditions cooperate.",
    price: "$$$", attributeTags: ["scenic_view", "iconic_landmark", "ticketed_activity", "rainy_day"],
    hours: { default: "Daily 10:00-21:00 with last admission controlled by the linked official timed-ticket calendar; outdoor access depends on weather." },
    officialUrl: "https://www.taipei-101.com.tw/en/observatory", bookingUrl: "https://www.taipei-101.com.tw/en/observatory", sourcePhoto: images.taipei101,
  }),
  cultureStop({
    id: "activity-elephant-mountain", name: "Elephant Mountain Trail", neighborhood: "Xinyi", coordinates: [25.0274, 121.5708],
    description: "Steep stone steps climb quickly from Xiangshan MRT to classic Taipei 101 viewpoints and continue into the Four Beasts trail network. The first platforms crowd at sunset; carry water, use shoes with grip, and climb farther for breathing room.",
    price: "$", priceSource: "Taipei Travel official attraction page: free admission", attributeTags: ["hiking", "scenic_view", "sunset", "active_outdoors"],
    hours: { default: "Trail access is continuous; use daylight hours, with safe access dependent on weather, surface condition, and official Taipei trail advisories." },
    officialUrl: "https://travel.taipei/en/attraction/details/564", sourcePhoto: images.elephant,
  }),
  cultureStop({
    id: "activity-maokong-gondola", name: "Maokong Gondola", neighborhood: "Wenshan", coordinates: [24.9873695, 121.5919276],
    description: "The gondola rises from the zoo to tea-growing hills, crossing green valleys in standard or glass-bottom cabins. Wind and thunderstorms can halt service; ride up in clear weather, walk between teahouses, and use the bus down if queues build.",
    price: "$$", attributeTags: ["scenic_view", "train", "family_activity", "outdoor_activity"],
    hours: { mon: "Closed except public holidays", tue: "09:00-21:00", wed: "09:00-21:00", thu: "09:00-21:00", fri: "09:00-22:00", sat: "08:30-22:00", sun: "08:30-21:00", default: "Service is suspended for unsafe wind, lightning, maintenance, and closures announced on the official gondola page." },
    officialUrl: "https://www.gondola.taipei/", bookingUrl: "https://www.gondola.taipei/", sourcePhoto: images.maokong,
  }),
  cultureStop({
    id: "activity-taipei-zoo", name: "Taipei Zoo", neighborhood: "Wenshan", coordinates: [24.9953546, 121.5861491],
    description: "This enormous, green zoo works best as a half-day of selected zones rather than a completion challenge. Giant pandas draw attention, but Taiwanese fauna and the hillside habitats are more distinctive; pair the lower entrance with the Maokong Gondola only if stamina allows.",
    price: "$", attributeTags: ["wildlife", "family_activity", "outdoor_activity", "educational"],
    hours: { default: "Daily 09:00-17:00; last entry and animal-house closures follow the linked official zoo schedule and annual maintenance notices." },
    officialUrl: "https://english.zoo.gov.taipei/", bookingUrl: "https://english.zoo.gov.taipei/", sourcePhoto: images.zoo,
  }),
  cultureStop({
    id: "activity-beitou-museum", name: "Beitou Hot Spring Museum", neighborhood: "Beitou", coordinates: [25.1365786, 121.5071899],
    description: "A restored 1913 public bathhouse explains Beitou's Japanese-era spa culture through tatami rooms, tiled pools, and the architecture of bathing. Entry is free and shoes come off; combine it with Thermal Valley rather than expecting an operating hot spring.",
    price: "$", priceSource: "Official museum visitor page: free admission", attributeTags: ["museum", "historic_site", "wellness_activity", "free_entry"],
    hours: { mon: "Closed", tue: "10:00-18:00", wed: "10:00-18:00", thu: "10:00-18:00", fri: "10:00-18:00", sat: "10:00-18:00", sun: "10:00-18:00" },
    officialUrl: "https://hotspringmuseum.taipei/en/content.aspx?id=33&pid=29", sourcePhoto: images.beitouMuseum,
  }),
  cultureStop({
    id: "activity-thermal-valley", name: "Thermal Valley", neighborhood: "Beitou", coordinates: [25.1380367, 121.5118723],
    description: "Sulfurous steam rolls above an intensely hot green pool that once supplied Beitou's bathhouses. The loop is short and there is no bathing; visit early for clearer views, then book a legal public or private spring elsewhere in the district.",
    price: "$", priceSource: "Taipei Travel official attraction page: free admission", attributeTags: ["wellness_activity", "nature_escape", "free_entry", "quick_stop"],
    hours: { mon: "Closed", tue: "09:00-17:00", wed: "09:00-17:00", thu: "09:00-17:00", fri: "09:00-17:00", sat: "09:00-17:00", sun: "09:00-17:00" },
    officialUrl: "https://travel.taipei/en/attraction/details/505", sourcePhoto: images.thermalValley,
  }),
  cultureStop({
    id: "activity-qingtiangang", name: "Qingtiangang Grassland", neighborhood: "Yangmingshan", coordinates: [25.1672, 121.5747],
    description: "Open grassland on an old lava terrace gives Yangmingshan an unexpectedly pastoral face, often with water buffalo grazing near fenced paths. Fog can erase the view and buses fill on weekends; check park weather, keep distance from animals, and carry layers.",
    price: "$", priceSource: "Yangmingshan National Park official recreation page: free admission", attributeTags: ["hiking", "wildlife", "nature_escape", "scenic_view"],
    hours: { default: "Outdoor paths are continuously accessible; safe visiting depends on daylight, mountain weather, buffalo controls, trail notices, and transport updates from Yangmingshan National Park." },
    officialUrl: "https://www.ymsnp.gov.tw/En/StaticPage/Recreation", sourcePhoto: images.qingtiangang,
  }),
  cultureStop({
    id: "activity-dihua-street", name: "Dihua Street", neighborhood: "Datong", coordinates: [25.0561728, 121.5102161],
    description: "Dihua Street layers tea merchants, dried-goods shops, fabric houses, restored shophouses, cafés, and temples along Taipei's old commercial spine. Walk north from Dadaocheng, look above the merchandise at the façades, and avoid Lunar New Year crowds unless the market is the purpose.",
    price: "$", priceSource: "Taipei Travel official attraction page: free admission", attributeTags: ["walking_route", "historic_site", "shopping_street", "local_makers"],
    hours: { default: "The public street is accessible 24 hours daily; individual merchant, temple, market, and exhibition schedules are controlled by their linked property pages." },
    officialUrl: "https://travel.taipei/en/attraction/details/1686", sourcePhoto: images.dihua,
  }),
  cultureStop({
    id: "activity-raohe", name: "Raohe Street Tourist Night Market", neighborhood: "Songshan", coordinates: [25.0506792, 121.5759774],
    description: "A single, navigable lane packs pepper buns, herbal pork-rib soup, grilled seafood, sweets, and games behind Ciyou Temple. Queue for the oven-baked pepper bun at the east gate, then graze selectively; weekend congestion can turn a short walk into a shuffle.",
    price: "$", priceSource: "Taipei Travel official market page and vendor prices", attributeTags: ["market_retail", "street_food", "late_night", "walking_route"],
    hours: { default: "Daily 17:00-00:00 on the official Taipei Travel attraction page; individual vendors may finish earlier when sold out." },
    officialUrl: "https://travel.taipei/en/attraction/details/1691", sourcePhoto: images.raohe,
  }),
  cultureStop({
    id: "activity-ximending", name: "Ximending Pedestrian Area", neighborhood: "Wanhua", coordinates: [25.0442, 121.5072],
    description: "Taipei's neon pedestrian quarter mixes youth fashion, street performance, cinemas, food stalls, LGBTQ+ bars around the Red House, and relentless advertising. Visit after dark for full energy, then escape the main junctions into side streets when the crowds become exhausting.",
    price: "$", priceSource: "Taipei Travel official attraction page: free admission", attributeTags: ["walking_route", "shopping_street", "lively", "queer_friendly"],
    hours: { default: "Public pedestrian streets are accessible 24 hours daily; retail, performance, market, and Red House schedules follow their respective official calendars." },
    officialUrl: "https://travel.taipei/en/attraction/details/1572", sourcePhoto: images.ximending,
  }),
];

function guide(
  id: string,
  title: string,
  category: ListCategory,
  seoSlug: string,
  seoTitle: string,
  seoDescription: string,
  description: string,
  stops: GuideStop[],
  guideSources: ListSource[],
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
    location: taipeiLocation,
    creator: { id: "rguide-editorial", name: "R Guide Editorial", avatar: avatar(category) },
    upvotes: 0,
    createdAt,
    stops,
    sources: guideSources,
  };
}

export const taipeiCitywideGuides: MapList[] = [
  guide(
    "list-taipei-citywide-dining", "Taiwanese Tasting Menus & Power Tables", "Food", "best-restaurants", "Best Restaurants in Taipei",
    "Best restaurants in Taipei for Taiwanese tasting menus, Cantonese dim sum, tempura counters, contemporary cooking, and serious reservation dinners.",
    "Taipei's destination dining is most compelling when Taiwanese produce, banquet memory, Japanese precision, and globally trained technique meet without sanding away local character.", diningStops, sources.dining,
  ),
  guide(
    "list-taipei-citywide-cheap-eats", "Soy Milk, Beef Noodles & Night-Market Staples", "Food", "best-cheap-eats", "Best Cheap Eats in Taipei",
    "Best cheap eats in Taipei for soy-milk breakfasts, beef noodles, braised pork rice, guabao, cold noodles, dumplings, and night-market snacks.",
    "Taipei's inexpensive food culture rewards early breakfasts, basement noodle counters, one-dish specialists, and market stalls where speed, texture, and decades of repetition matter more than décor.", cheapEatStops, sources.cheap,
  ),
  guide(
    "list-taipei-citywide-hotels", "Design Mansions, Grand Hotels & Skyline Rooms", "Stay", "best-hotels", "Best Hotels in Taipei",
    "Best hotels in Taipei for luxury service, design stays, Taipei 101 views, central MRT access, rooftop pools, spa breaks, and historic atmosphere.",
    "Taipei's hotels divide between intimate design properties, full-service Asian grande dames, Xinyi towers, and one unmistakable historic landmark; choose the district before the marble.", hotelStops, sources.hotels,
  ),
  guide(
    "list-taipei-citywide-hostels", "Social Bunks & Main-Station Capsules", "Stay", "best-hostels", "Best Hostels in Taipei",
    "Best hostels in Taipei for social common rooms, capsule beds, Taipei Main Station, Ximending, Dongmen, airport MRT access, and quiet budget stays.",
    "Taipei's strongest hostels cluster around the main station and west side, balancing excellent transport with compact rooms; the real decision is lively common space versus sleep-first capsules.", hostelStops, sources.hostels,
  ),
  guide(
    "list-taipei-citywide-casual-bars", "Taprooms, Indie Stages & Easy Pints", "Nightlife", "best-bars", "Best Casual Bars in Taipei",
    "Best casual bars in Taipei for Taiwanese craft beer, brewery taprooms, live indie music, sports pubs, bottle shops, Ximending nights, and easy walk-ins.",
    "Taipei's casual drinking rooms are at their best when local breweries, record-shop intimacy, tiny live stages, and pavement sociability replace cocktail ceremony.", casualBarStops, sources.casual,
  ),
  guide(
    "list-taipei-citywide-cocktail-bars", "Tea, Technique & Taiwanese Spirits", "Nightlife", "best-cocktail-bars", "Best Cocktail Bars in Taipei",
    "Best cocktail bars in Taipei for tea-driven drinks, Taiwanese ingredients, high-tech technique, speakeasies, hotel polish, cocktails on tap, and reservations.",
    "Taipei's cocktail scene is technically ambitious but rarely humorless: tea, fruit, local spirits, laboratory methods, and warm counter hospitality keep the city's best rooms distinct.", cocktailStops, sources.cocktails,
  ),
  guide(
    "list-taipei-citywide-culture", "Imperial Art, Temples & Creative Parks", "Culture", "best-culture", "Best Culture in Taipei",
    "Best culture in Taipei for the National Palace Museum, contemporary art, Taiwanese history, active temples, restored factories, monuments, and design parks.",
    "Taipei's culture lives across imperial collections, active religious practice, contested monuments, contemporary galleries, and industrial sites reused as public creative space.", cultureStops, sources.culture,
  ),
  guide(
    "list-taipei-citywide-things-to-do", "Mountain Views, Hot Springs & Night Markets", "Activities", "best-things-to-do", "Best Things to Do in Taipei",
    "Best things to do in Taipei for Taipei 101, Elephant Mountain, Maokong Gondola, Taipei Zoo, Beitou, Yangmingshan, old streets, and night markets.",
    "Taipei makes city and landscape easy to combine: a morning on volcanic hills or hot-spring ground can give way to observatories, old merchant streets, and night-market grazing.", activityStops, sources.activities,
  ),
];

taipeiCitywideGuides.push(buildNatureGuide({
  city: "Taipei",
  country: "Taiwan",
  continent: "Asia",
  id: "list-taipei-citywide-nature",
  slug: "taipei-parks-mountain-trails-and-wetlands",
  seoSlug: "best-parks-and-nature",
  seoTitle: "Best Parks and Nature in Taipei for Mountain Trails, Wetlands and Hot Springs",
  seoDescription: "Ten source-backed Taipei nature stops spanning volcanic Yangmingshan, Elephant Mountain, river wetlands, forest parks, tea hills, and botanical gardens.",
  title: "Volcanic Hills, Wetlands & Urban Forests",
  description: "Taipei places volcanic ridges, subtropical forest, hot-spring terrain, riverside habitat, and carefully planted gardens within reach of the MRT. These ten landscapes balance celebrated viewpoints with quieter ecological reserves.",
  createdAt: "2026-07-29T00:00:00.000Z",
  checkedAt: "2026-08-04",
  sources: [
    { name: "Yangmingshan National Park", url: "https://www.ymsnp.gov.tw/En/" },
    { name: "Taipei Travel nature and outdoor information", url: "https://www.travel.taipei/en/must-visit/outdoor" },
    { name: "Taiwan Tourism Administration", url: "https://eng.taiwan.net.tw/" },
  ],
  stops: [
    {
      id: "taipei-nature-yangmingshan",
      name: "Yangmingshan National Park",
      coordinates: [25.1667, 121.5533],
      description: "Volcanic peaks, fumaroles, grasslands, and seasonal flower displays make this Taipei's most varied large landscape, with trail conditions governed by the park authority.",
      hours: { default: "Park landscapes and principal trails are open 24 hours daily. Headquarters Visitor Center daily 8:30 AM–4:30 PM; Xiaoyoukeng, Datun, Erziping, Qingtiangang, Lengshuikeng, Longfenggu, and Yangmingshuwu visitor centers daily 9:00 AM–4:30 PM. Visitor centers close on Lunar New Year's Eve and the last Monday of each month." },
      officialUrl: "https://www.ymsnp.gov.tw/En/",
      attributeTags: ["national park", "volcanic", "hiking", "seasonal flowers"],
    },
    {
      id: "taipei-nature-xiangshan",
      name: "Xiangshan (Elephant Mountain)",
      coordinates: [25.027, 121.57],
      description: "A steep stone stair trail reaches sandstone outcrops and the classic Taipei 101 skyline view, especially rewarding near sunset on a clear day.",
      hours: { default: "Open 24 hours daily." },
      officialUrl: "https://www.travel.taipei/en/attraction/details/564",
      attributeTags: ["hiking", "viewpoint", "sunset", "city views"],
    },
    {
      id: "taipei-nature-thermal-valley",
      name: "Beitou Thermal Valley",
      coordinates: [25.138, 121.511],
      description: "Sulfurous steam rises from a geothermal pool beside the Beitou hot-spring district, revealing the volcanic system without requiring a full mountain excursion.",
      hours: { default: "Tuesday–Sunday 9:00 AM–5:00 PM; May 15–September 14 until 6:00 PM. Closed Mondays, Lunar New Year's Eve, and Lunar New Year's Day." },
      officialUrl: "https://www.water.gov.taipei/News_Content.aspx?n=20FD034365D9809C&s=CA22DFCC722E6905&sms=87415A8B9CE81B16",
      attributeTags: ["geothermal", "hot springs", "accessible", "geology"],
    },
    {
      id: "taipei-nature-daan-forest",
      name: "Daan Forest Park",
      coordinates: [25.031, 121.536],
      description: "Taipei's central green lung combines ponds, mature canopy, lawns, and productive bird habitat directly above a metro station and beside dense neighborhoods.",
      hours: { default: "Open 24 hours daily." },
      officialUrl: "https://www.travel.taipei/en/attraction/details/524",
      attributeTags: ["urban park", "birding", "ponds", "metro access"],
    },
    {
      id: "taipei-nature-botanical-garden",
      name: "Taipei Botanical Garden",
      coordinates: [25.031, 121.51],
      description: "Research collections, lotus ponds, native plants, and shaded paths turn this compact garden into a strong introduction to Taiwan's subtropical flora.",
      hours: { default: "Daily 6:00 AM–8:00 PM." },
      officialUrl: "https://tpbg.tfri.gov.tw/en/Opening.php",
      attributeTags: ["botanical garden", "native plants", "lotus", "birding"],
    },
    {
      id: "taipei-nature-guandu",
      name: "Guandu Nature Park",
      coordinates: [25.119, 121.469],
      description: "Freshwater ponds, reed beds, and estuary habitat support migratory birds at the Keelung and Tamsui river meeting point, with hides and guided interpretation.",
      hours: { default: "April–September: Tuesday–Friday Nature Center 9:00 AM–5:00 PM, outdoor area until 5:30 PM; weekends and holidays Nature Center until 6:00 PM, outdoor area until 6:30 PM. October–March: Tuesday–Friday Nature Center 9:00 AM–5:00 PM, outdoor area until 5:30 PM; weekends and holidays Nature Center until 5:30 PM, outdoor area until 6:00 PM. Closed Mondays." },
      officialUrl: "https://gd-park.org.tw/en/hours",
      attributeTags: ["wetland", "birding", "nature reserve", "estuary"],
    },
    {
      id: "taipei-nature-maokong",
      name: "Maokong Tea Hills",
      coordinates: [24.968, 121.588],
      description: "Tea gardens, forest footpaths, temples, and ridge views spread beyond the gondola terminal, making Maokong a landscape destination rather than only a cable-car ride.",
      hours: { default: "Tea-hill roads and public trails are open 24 hours daily. Maokong Gondola operates Tuesday–Friday 9:00 AM–9:00 PM and weekends and holidays 9:00 AM–10:00 PM; closed Mondays except national holidays and the first Monday of each month, and closed on Lunar New Year's Eve." },
      officialUrl: "https://english.gondola.taipei/cp.aspx?n=0FC5FEA256DB1B77",
      photo: "https://commons.wikimedia.org/wiki/File:Maokong,_Taipei_-_Maokong5086.jpg",
      attributeTags: ["tea landscape", "forest trails", "gondola", "viewpoint"],
    },
    {
      id: "taipei-nature-fuyang",
      name: "Fuyang Eco Park",
      coordinates: [25.018, 121.557],
      description: "A reclaimed military site preserves low-elevation forest, streams, butterflies, and firefly habitat only a short walk from an urban metro station.",
      hours: { default: "Open 24 hours daily." },
      officialUrl: "https://www.travel.taipei/en/attraction/details/517",
      attributeTags: ["urban forest", "butterflies", "fireflies", "easy hike"],
    },
    {
      id: "taipei-nature-dajia-riverside",
      name: "Dajia Riverside Park",
      coordinates: [25.074, 121.534],
      description: "Broad lawns, cycling paths, floodplain planting, and long river views create breathing room on the Keelung River's engineered but ecologically useful edge.",
      hours: { default: "Open 24 hours daily." },
      officialUrl: "https://www.travel.taipei/en/attraction/details/518",
      attributeTags: ["riverside", "cycling", "lawns", "sunset"],
    },
    {
      id: "taipei-nature-shilin-residence",
      name: "Shilin Official Residence Gardens",
      coordinates: [25.095, 121.53],
      description: "Formal rose beds, orchid displays, wooded slopes, and seasonal flower shows surround the former presidential residence in a carefully maintained public garden.",
      hours: { default: "Residence Park daily 8:00 AM–6:00 PM. Former residence Tuesday–Sunday 9:30 AM–noon and 1:30 PM–5:00 PM; closed Mondays." },
      officialUrl: "https://www.travel.taipei/en/attraction/details/450",
      attributeTags: ["historic garden", "roses", "seasonal flowers", "accessible"],
    },
  ],
}));
