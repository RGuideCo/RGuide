import type { GuideStop, ListCategory, ListSource, MapList } from "@/types";

const createdAt = "2026-05-19T00:00:00.000Z";
const checkedAt = "2026-08-27";

const cityLocation = {
  city: "Istanbul",
  country: "Turkey",
  continent: "Europe",
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
  const fill = categoryColors[category];
  return `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160"><rect width="160" height="160" rx="80" fill="#${fill}"/><text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle" font-family="Arial,sans-serif" font-size="76" font-weight="700" fill="white">R</text></svg>`,
  )}`;
}

function creator(category: ListCategory) {
  return {
    id: `user-rguide-${category.toLowerCase()}`,
    name: `R ${category}`,
    avatar: avatar(category),
  };
}

function maps(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function source(name: string, url: string): ListSource {
  return { name, url };
}

const alwaysOpen = {
  mon: "24 hours",
  tue: "24 hours",
  wed: "24 hours",
  thu: "24 hours",
  fri: "24 hours",
  sat: "24 hours",
  sun: "24 hours",
};

const images = {
  ciya: "https://www.ciya.com.tr/images/foods/big/03-06.jpg",
  karakoyLokantasi: "https://www.karakoylokantasi.com/assets/img/info/lunch-small-1.jpg",
  pandeli:
    "https://images.squarespace-cdn.com/content/v1/5be41583b27e39e75420c52e/1541702509636-S45XI7NKVQ4C40VPPUDX/masa.jpg",
  mikla: "https://www.miklarestaurant.com/media/gy2d2xkr/1.jpg",
  asitane:
    "https://www.asitanerestaurant.com/English/wp-content/uploads/2015/07/kavun-dolmasi-asitane-restaurant-4.jpg",
  neolokal: "https://www.neolokal.com/wp-content/uploads/2023/09/neolokal_interior.jpg",
  turk: "https://www.turkft.com/dist/img/tabak-1-ocak-26.jpg",
  yeniLokanta:
    "https://static.wixstatic.com/media/934cc5_44d5da3b179242dabbadb1ef97eb9ac0~mv2.jpg/v1/fill/w_483,h_276,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/cephe.jpg",
  aheste:
    "https://images.squarespace-cdn.com/content/v1/55214176e4b019d71221d355/1770302849301-NP083N17558T0ZFTDHQ2/PHOTO-2026-02-05-09-40-55.jpg",
  balikciSabahattin:
    "https://static.wixstatic.com/media/eb309f_cd22c93e9d47451a899189c212adf346~mv2.jpg/v1/fill/w_450,h_650,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/balikci-sabahattin-galeri-1.jpg",
  miklaBar: "https://www.miklarestaurant.com/media/yqifidum/mikla-bar.jpg",
  flekk: "https://framerusercontent.com/images/On1RUrp5l9SRjonznrZAIUyVErk.jpeg",
  nardis: "https://www.nardisjazz.com/wp-content/uploads/2024/09/Group-3-3-3-e1730790704465.png",
  arkaoda: "https://www.arkaoda.com/uploads/details/20170830190108.jpg",
  threeSixty: "https://360istanbul.com/wp-content/uploads/2024/09/slide1.jpg",
  lucca: "https://luccastyle.com/wp-content/uploads/2022/06/lucca_is_lucca.jpg",
  monkey: "https://www.monkeyistanbul.com/assets/images/slide-04.jpg",
  miniMuzikhol:
    "https://static.wixstatic.com/media/6adc7a_7506575badd74345bbfecd481d9758a8~mv2.jpg/v1/fill/w_1200,h_800,al_c/6adc7a_7506575badd74345bbfecd481d9758a8~mv2.jpg",
  moretenders: "https://framerusercontent.com/images/c89Jojt15I5p6dOXaTMQT4nDV9A.jpg?scale-down-to=1024",
  klein: "https://klein-entertainment.com/wp-content/uploads/2021/11/yeni-klein-phonix-1.jpg",
  hagiaSophia: "https://commons.wikimedia.org/wiki/Special:FilePath/Hagia%20Sophia%20Mars%202013.jpg",
  topkapi: "https://commons.wikimedia.org/wiki/Special:FilePath/Topkapi%20Palace%20Bosphorus.JPG",
  blueMosque: "https://commons.wikimedia.org/wiki/Special:FilePath/Blue%20mosque%2C%20Istanbul.jpg",
  basilica: "https://commons.wikimedia.org/wiki/Special:FilePath/Istanbul%2C%20Basilica%20Cistern.jpg",
  archaeology:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Istanbularcheology.jpg/3840px-Istanbularcheology.jpg",
  chora: "https://commons.wikimedia.org/wiki/Special:FilePath/Chora%20Church%202024.jpg",
  suleymaniye: "https://commons.wikimedia.org/wiki/Special:FilePath/S%C3%BCleymaniyeMosqueIstanbul.jpg",
  istanbulModern: "https://commons.wikimedia.org/wiki/Special:FilePath/Exterior%20of%20Istanbul%20Modern.jpg",
  peraMuseum: "https://commons.wikimedia.org/wiki/Special:FilePath/PeraMuseum.JPG",
  rahmiKoc:
    "https://commons.wikimedia.org/wiki/Special:FilePath/Istanbul%20asv2021-11%20img15%20Rahmi%20Ko%C3%A7%20Museum.jpg",
  gulhane: "https://commons.wikimedia.org/wiki/Special:FilePath/G%C3%BClhane%20Park%20Istanbul.jpg",
  emirgan:
    "https://commons.wikimedia.org/wiki/Special:FilePath/Istanbul%20Tulip%20Festival%20in%20Emirgan%20Park.jpg",
  yildiz: "https://commons.wikimedia.org/wiki/Special:FilePath/Yildiz%20Park%2002.jpg",
  moda: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Moda_%C4%B0skelesi_2019-08.jpg",
  buyukada: "https://live.staticflickr.com/3489/3951334827_7325c2a771_b.jpg",
  camlica: "https://commons.wikimedia.org/wiki/Special:FilePath/%C3%87aml%C4%B1ca%20Hill%20public%20park.jpg",
  arboretum: "https://commons.wikimedia.org/wiki/Special:FilePath/Atat%C3%BCrkArboretum%20%282%29.jpg",
  belgradForest: "https://commons.wikimedia.org/wiki/Special:FilePath/Belgrad%20Forest%20%2811%29.jpg",
  fenerbahce: "https://commons.wikimedia.org/wiki/Special:FilePath/Fenerbah%C3%A7e%20Park%C4%B1%2007.jpg",
  fethiPasa: "https://commons.wikimedia.org/wiki/Special:FilePath/Fethipa%C5%9Fa%20Korusu.jpg",
  grandBazaar: "https://commons.wikimedia.org/wiki/Special:FilePath/Grand%20Bazaar%20Istanbul%202007.jpg",
  spiceBazaar: "https://commons.wikimedia.org/wiki/Special:FilePath/Crowd%20In%20Spice%20Bazaar%2C%20Istanbul.jpg",
  ferry: "https://commons.wikimedia.org/wiki/Special:FilePath/Istanbul%20Bosphorus%20ferry.jpg",
  hamami: "https://kilicalipasahamami.com/storage/sliders/May2023/mtDhvGvv1s4ENIVV4sHz.jpg",
  galata: "https://commons.wikimedia.org/wiki/Special:FilePath/Istanbul%20asv2020-02%20img48%20Galata%20Tower.jpg",
  dolmabahce:
    "https://commons.wikimedia.org/wiki/Special:FilePath/Dolmabah%C3%A7e%20Palace%2C%20Istanbul%20cropped.jpg",
  maiden: "https://commons.wikimedia.org/wiki/Special:FilePath/Maidens%20Tower%202007.jpg",
  pierreLoti:
    "https://commons.wikimedia.org/wiki/Special:FilePath/Golden%20Horn%20panorama%20from%20Pierre%20Loti%20Hill.jpg",
  kadikoyMarket: "https://commons.wikimedia.org/wiki/Special:FilePath/Kad%C4%B1k%C3%B6y%20market%20stall%2C%20Istanbul.jpg",
  fourSeasons:
    "https://www.fourseasons.com/alt/img-opt/~80.570.0,0000-312,5000-3000,0000-1687,5000/publish/content/dam/fourseasons/images/web/IST/IST_794_original.jpg",
  peraPalace: "https://perapalace.com/wp-content/uploads/2024/09/Pera-Dis-Gorsel.jpg",
  sohoHouse:
    "https://media.fastly.sohohousedigital.com/f_auto,q_auto,fl_progressive:steep,w_640/t_dc_base/sitecore-prod/images/dotcom-sites/house-pages/2024-house-page-update/eu/istanbul/001_soho-house-istanbul-carousel.jpg",
  peninsula: "https://commons.wikimedia.org/wiki/Special:FilePath/The%20Peninsula%20Istanbul.png",
  kocatas:
    "https://assets.anantara.com/image/upload/q_auto,f_auto,c_limit,w_1920/media/minor/anantara/images/kocatas-mansion-istanbul/akmi-image/1_homepage/kocatas_mansions_homepage_banner_1920x900.jpg",
  ciragan:
    "https://storage.kempinski.com/cdn-cgi/image/w=1920,f=auto,fit=scale-down/ki-cms-prod/images/1/6/1/9/1799161-1-eng-GB/69bbf4a2ee22-75516038_4K.jpg",
  shangriLa:
    "https://sitecore-cd-imgr.shangri-la.com/MediaFiles/6/8/7/%7B687EA661-082E-47FB-BB79-FCAFE126A85C%7Doverview-sitesection-banner-1920x940.jpg?w=600&h=500&mode=crop&scale=both",
  raffles: "https://m.ahstatic.com/is/image/accorhotels/met_p_a011-50?wid=1920",
  bankHotel: "https://www.thebankhotelistanbul.com/medias/slide/big/41/kkk.jpg",
  ajwa: "https://www.ajwa.com.tr/src/img/HomeDisplay/sultanahmet.jpg",
  cheers: "https://www.cheershostel.com/panel/uploads/galleries_v/images/cheers//570x570/dsc00885-edit.jpg",
  bahaus:
    "https://a.hwstatic.com/image/upload/f_auto,q_auto,h_320,c_limit,e_sharpen,e_improve,e_vibrance:60/propertyimages/6/6418/sdf6usepeqak67j4ufj3.jpg",
  wabi: "https://static-resources-elementor.mirai.com/wp-content/uploads/sites/191/bed-shared-balcony01.jpg",
  hush: "https://a.hwstatic.com/image/upload/f_auto,q_auto,h_320,c_limit,e_sharpen,e_improve,e_vibrance:60/propertyimages/4/42030/6.jpg",
  secondHome:
    "https://a.hwstatic.com/image/upload/f_auto,q_auto,h_320,c_limit,e_sharpen,e_improve,e_vibrance:60/propertyimages/3/35924/r4pnt012uzd7ggiqa456.jpg",
  yolo:
    "https://a.hwstatic.com/image/upload/f_auto,q_auto,h_320,c_limit,e_sharpen,e_improve,e_vibrance:60/propertyimages/2/296549/lpmwq6xsqlp7t0dorvgc.jpg",
  archeo: "https://www.archeopol.com/wp-content/uploads/2025/04/@Ariilussi-21-1000x565.jpg",
  leBanc: "https://lebancistanbul.com/lebanc-hero-photo.png",
  stanpoli:
    "https://a.hwstatic.com/image/upload/f_auto,q_auto,h_320,c_limit,e_sharpen,e_improve,e_vibrance:60/propertyimages/7/75980/ml6g30st6twoe224bzxc.jpg",
  hanchi: "https://ak-d.tripcdn.com/images/0583812000sez89i0AA38_R_960_660_R5_D.jpg",
};

type StopOptions = Partial<GuideStop> & {
  sourcePhoto: string;
  officialUrl: string;
  editorialUrls?: string[];
  platformUrls?: string[];
  mapQuery?: string;
};

function stop(
  id: string,
  name: string,
  coordinates: [number, number],
  description: string,
  options: StopOptions,
): GuideStop {
  const {
    sourcePhoto,
    officialUrl,
    editorialUrls = [],
    platformUrls = [],
    mapQuery,
    bookingUrl,
    sourceEvidence,
    imageSourceUrl,
    sourceUrls = [],
    ...rest
  } = options;
  const mapUrl = sourceEvidence?.mapUrl ?? maps(mapQuery ?? `${name} Istanbul`);
  const imageUrl = imageSourceUrl ?? sourcePhoto;
  const evidence = [
    officialUrl,
    bookingUrl,
    mapUrl,
    imageUrl,
    ...editorialUrls,
    ...platformUrls,
    ...sourceUrls,
  ].filter((url): url is string => Boolean(url));

  return {
    id,
    name,
    coordinates,
    description,
    photo: sourcePhoto,
    imageSourceUrl: imageUrl,
    sourceUrls: [...new Set(evidence)],
    sourceEvidence: {
      officialUrl,
      mapUrl,
      currentStatusUrl: mapUrl,
      imageSourceUrl: imageUrl,
      editorialUrls,
      platformUrls,
      checkedAt,
      notes: "Retained after official, map/current-status, hours, and media-source review on the listed check date.",
      ...sourceEvidence,
    },
    officialUrl,
    ...(bookingUrl ? { bookingUrl } : {}),
    ...rest,
  };
}

const restaurantStops: GuideStop[] = [
  stop("istanbul-food-ciya-sofrasi", "Ciya Sofrasi", [40.9895, 29.0247], "Ciya Sofrasi treats Anatolian cooking as a living archive rather than a nostalgia act, with regional stews, kebabs, salads, and sweets moving through the counter each day. The Kadikoy location matters because the room sits inside a working market rhythm, not a polished tasting-menu bubble.", { category: "Food", subcategory: "regional_turkish", venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["turkish", "anatolian", "kurdish"], attributeTags: ["local_favorite", "destination_dining", "market", "casual"], price: "$$", priceSource: "MICHELIN Guide and map listings", hours: { default: "Daily 11:30 AM-10:00 PM." }, officialUrl: "https://www.ciya.com.tr/", sourcePhoto: images.ciya, editorialUrls: ["https://guide.michelin.com/en/istanbul-province/istanbul/restaurant/ciya-sofrasi"] }),
  stop("istanbul-food-karakoy-lokantasi", "Karakoy Lokantasi", [41.0242, 28.9787], "Karakoy Lokantasi keeps two useful Istanbul formats under one tiled roof: a bright daytime lokanta and a more raki-and-meze-driven dinner room. The cooking is classic enough for comfort, but the setting and service make it feel like a deliberate Karakoy meal rather than a default old-city fallback.", { category: "Food", subcategory: "lokanta", venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["turkish", "meze", "seafood"], attributeTags: ["local_favorite", "date_night", "reservation_recommended", "lively_food"], price: "$$", priceSource: "Official site and MICHELIN Guide", hours: { mon: "12:00 PM-4:00 PM, 5:30 PM-12:00 AM", tue: "12:00 PM-4:00 PM, 5:30 PM-12:00 AM", wed: "12:00 PM-4:00 PM, 5:30 PM-12:00 AM", thu: "12:00 PM-4:00 PM, 5:30 PM-12:00 AM", fri: "12:00 PM-4:00 PM, 5:30 PM-12:00 AM", sat: "12:00 PM-4:00 PM, 5:30 PM-12:00 AM", sun: "4:00 PM-12:00 AM" }, officialUrl: "https://www.karakoylokantasi.com/en/info", sourcePhoto: images.karakoyLokantasi, editorialUrls: ["https://guide.michelin.com/en/istanbul-province/istanbul/restaurant/karakoy-lokantasi"] }),
  stop("istanbul-food-pandeli", "Pandeli", [41.0163, 28.9708], "Pandeli turns the Spice Bazaar into a sit-down lunch through blue-tiled rooms, old Istanbul service, and dishes such as hunkar begendi. Its value is continuity and location: the meal still feels tied to Eminonu trade rather than detached from the market below.", { category: "Food", subcategory: "historic_restaurant", venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["turkish", "ottoman", "classic"], attributeTags: ["historic", "market", "destination_dining", "lunch"], price: "$$", priceSource: "Official site and map listings", hours: { mon: "11:00 AM-6:30 PM", tue: "11:00 AM-6:30 PM", wed: "11:00 AM-6:30 PM", thu: "11:00 AM-6:30 PM", fri: "11:00 AM-6:30 PM", sat: "11:00 AM-6:30 PM", sun: "Closed" }, officialUrl: "https://pandeli.squarespace.com/", sourcePhoto: images.pandeli, editorialUrls: ["https://guide.michelin.com/en/istanbul-province/istanbul/restaurant/pandeli"] }),
  stop("istanbul-food-mikla", "Mikla", [41.0315, 28.9748], "Mikla combines New Anatolian cooking, Turkish wine, and a high Pera view without letting the skyline do all the work. The kitchen is strongest when regional ingredients and modern technique stay visible in the plate, making the reservation about more than a rooftop photograph.", { category: "Food", subcategory: "fine_dining", venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["modern_turkish", "anatolian", "tasting_menu"], attributeTags: ["fine_dining", "tasting_menu", "scenic_food", "reservation_recommended"], price: "$$$$", priceSource: "Official site and MICHELIN Guide", hours: { mon: "6:00 PM-12:00 AM", tue: "6:00 PM-12:00 AM", wed: "6:00 PM-12:00 AM", thu: "6:00 PM-12:00 AM", fri: "6:00 PM-12:00 AM", sat: "6:00 PM-12:00 AM", sun: "Closed" }, officialUrl: "https://www.miklarestaurant.com/mikla", sourcePhoto: images.mikla, editorialUrls: ["https://guide.michelin.com/en/istanbul-province/istanbul/restaurant/mikla"] }),
  stop("istanbul-food-asitane", "Asitane Restaurant", [41.0312, 28.9392], "Asitane builds dinner around documented Ottoman palace recipes, which gives the meal a clearer purpose than broad imperial styling. Dishes such as stuffed melon and historic stews make the archive edible, while the Edirnekapi setting keeps the experience close to Chora and the land-wall side of the city.", { category: "Food", subcategory: "ottoman_cuisine", venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["ottoman", "turkish", "historic"], attributeTags: ["destination_dining", "historic", "date_night", "reservation_recommended"], price: "$$$", priceSource: "Official site and map listings", hours: { default: "Daily 12:00 PM-11:30 PM." }, officialUrl: "https://www.asitanerestaurant.com/English/about-us/", sourcePhoto: images.asitane, editorialUrls: ["https://guide.michelin.com/en/istanbul-province/istanbul/restaurant/asitane"] }),
  stop("istanbul-food-neolokal", "Neolokal", [41.0247, 28.9737], "Neolokal works from Salt Galata with a menu that translates Anatolian products, preservation methods, and regional memory into contemporary plates. The room is polished, but the stronger argument is the kitchen's insistence that modern Istanbul cooking can be technically sharp without cutting itself off from the countryside.", { category: "Food", subcategory: "modern_turkish", venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["modern_turkish", "anatolian", "tasting_menu"], attributeTags: ["fine_dining", "tasting_menu", "destination_dining", "reservation_recommended"], price: "$$$$", priceSource: "Official site and MICHELIN Guide", hours: { mon: "Closed", tue: "6:00 PM-12:00 AM", wed: "6:00 PM-12:00 AM", thu: "6:00 PM-12:00 AM", fri: "6:00 PM-12:00 AM", sat: "6:00 PM-12:00 AM", sun: "Closed" }, officialUrl: "https://www.neolokal.com/en/neolokal_en/", sourcePhoto: images.neolokal, editorialUrls: ["https://guide.michelin.com/en/istanbul-province/istanbul/restaurant/neolokal"] }),
  stop("istanbul-food-turk-fatih-tutak", "TURK Fatih Tutak", [41.0578, 28.9921], "TURK Fatih Tutak is Istanbul's most formal argument for contemporary Turkish fine dining, using long-menu structure, fermentation, fire, and regional references with unusually tight control. The Bomonti location keeps the focus on the kitchen rather than old-city scenery.", { category: "Food", subcategory: "fine_dining", venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["modern_turkish", "tasting_menu", "fine_dining"], attributeTags: ["fine_dining", "tasting_menu", "destination_dining", "reservation_recommended"], price: "$$$$", priceSource: "Official reservation page and MICHELIN Guide", hours: { mon: "Closed", tue: "6:30 PM-11:00 PM", wed: "6:30 PM-11:00 PM", thu: "6:30 PM-11:00 PM", fri: "6:30 PM-11:00 PM", sat: "6:30 PM-11:00 PM", sun: "Closed" }, officialUrl: "https://www.turkft.com/", sourcePhoto: images.turk, editorialUrls: ["https://guide.michelin.com/en/istanbul-province/istanbul/restaurant/turk-fatih-tutak"] }),
  stop("istanbul-food-yeni-lokanta", "Yeni Lokanta", [41.0332, 28.9776], "Yeni Lokanta brings Aegean, Anatolian, and Istanbul tavern instincts into a contemporary Beyoglu dining room. The menu is less ceremonial than the tasting-menu restaurants, which makes the cooking useful for a serious dinner that still leaves room for meze, bread, and conversation.", { category: "Food", subcategory: "modern_turkish", venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["modern_turkish", "aegean", "meze"], attributeTags: ["date_night", "reservation_recommended", "lively_food", "local_favorite"], price: "$$$", priceSource: "Official site and MICHELIN Guide", hours: { mon: "6:00 PM-12:00 AM", tue: "6:00 PM-12:00 AM", wed: "6:00 PM-12:00 AM", thu: "6:00 PM-12:00 AM", fri: "6:00 PM-12:00 AM", sat: "6:00 PM-12:00 AM", sun: "Closed" }, officialUrl: "https://www.yenilokanta.com/", sourcePhoto: images.yeniLokanta, editorialUrls: ["https://guide.michelin.com/en/istanbul-province/istanbul/restaurant/yeni-lokanta"] }),
  stop("istanbul-food-aheste", "Aheste", [41.0284, 28.9742], "Aheste is a Pera meyhane with a tasting-menu option, giving meze, seafood, offal, and seasonal vegetables a more deliberate structure than a casual raki table. The room has enough intimacy for a slow dinner, but the appeal is the kitchen's detail rather than candlelit vagueness.", { category: "Food", subcategory: "meyhane", venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["turkish", "meze", "seafood"], attributeTags: ["date_night", "reservation_recommended", "seafood", "lively_food"], price: "$$$", priceSource: "Official site and MICHELIN Guide", hours: { default: "Daily 5:30 PM-10:30 PM." }, officialUrl: "https://ahesterestaurant.com/visit", sourcePhoto: images.aheste, editorialUrls: ["https://guide.michelin.com/en/istanbul-province/istanbul/restaurant/aheste"] }),
  stop("istanbul-food-balikci-sabahattin", "Balikci Sabahattin", [41.0038, 28.9796], "Balikci Sabahattin turns a Sultanahmet seafood meal into something older and calmer than the surrounding hotel traffic. The draw is grilled fish, meze, garden tables, and a family-run dining room whose history gives the old city a less transactional dinner option.", { category: "Food", subcategory: "seafood", venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["seafood", "turkish", "meze"], attributeTags: ["seafood", "historic", "date_night", "reservation_recommended"], price: "$$$", priceSource: "Official site and map listings", hours: { default: "Daily 12:00 PM-12:00 AM." }, officialUrl: "https://www.balikcisabahattin.com/", sourcePhoto: images.balikciSabahattin, editorialUrls: ["https://guide.michelin.com/en/istanbul-province/istanbul/restaurant/balikci-sabahattin"] }),
];

const nightlifeStops: GuideStop[] = [
  stop("istanbul-nightlife-mikla-bar", "Mikla Bar", [41.0315, 28.9748], "Mikla Bar gives the Pera rooftop treatment a cleaner shape: serious cocktails, old-city silhouettes, and enough restraint that the view does not become the whole product. It suits a composed first round or a late drink when club energy would flatten the night.", { category: "Nightlife", subcategory: "rooftop_bar", venueKind: "nightlife", nightlifeType: "rooftop_bar", musicGenres: ["lounge", "jazz", "electronic"], attributeTags: ["craft_cocktails", "scenic_nightlife", "premium_drinks", "date_night"], price: "$$$", priceSource: "Official site and map listings", hours: { mon: "6:00 PM-2:00 AM", tue: "6:00 PM-2:00 AM", wed: "6:00 PM-2:00 AM", thu: "6:00 PM-2:00 AM", fri: "6:00 PM-2:00 AM", sat: "6:00 PM-2:00 AM", sun: "Closed" }, officialUrl: "https://www.miklarestaurant.com/mikla", sourcePhoto: images.miklaBar }),
  stop("istanbul-nightlife-flekk", "Flekk Cocktail Bar", [41.0321, 28.9788], "Flekk is a compact Beyoglu cocktail bar built around careful drinks, art on the walls, and DJ-led weekends rather than rooftop spectacle. Its value is craft at street level: a tighter room where the bartender and the glass matter more than the panorama.", { category: "Nightlife", subcategory: "cocktail_bar", venueKind: "nightlife", nightlifeType: "cocktail_bar", musicGenres: ["dj_sets", "lounge", "electronic"], attributeTags: ["craft_cocktails", "date_night", "low_key_nightlife", "premium_drinks"], price: "$$", priceSource: "Official site and map listings", hours: { default: "Daily 5:00 PM-2:00 AM." }, officialUrl: "https://www.flekkcocktailbar.com/", sourcePhoto: images.flekk, editorialUrls: ["https://www.flekkcocktailbar.com/menu"] }),
  stop("istanbul-nightlife-nardis", "Nardis Jazz Club", [41.0267, 28.9747], "Nardis is a compact Galata jazz club built for listening, with reservations, seated attention, and a calendar that favors focused live sets over background music. The intimate room is the reason to go; a casual drop-in can miss the point when the stronger shows sell out.", { category: "Nightlife", subcategory: "jazz_club", venueKind: "nightlife", nightlifeType: "live_music_venue", musicGenres: ["jazz", "improvisation"], attributeTags: ["live_music", "reservation_recommended_nightlife", "low_key_nightlife", "date_night"], price: "$$", priceSource: "Official event listings and Time Out", hours: { default: "Official event calendar lists show nights; most published concerts begin around 8:30 PM." }, officialUrl: "https://nardisjazz.com/", sourcePhoto: images.nardis, editorialUrls: ["https://www.timeout.com/istanbul/music/nardis"] }),
  stop("istanbul-nightlife-arkaoda", "Arkaoda", [40.9874, 29.027], "Arkaoda keeps Kadikoy's indie reputation practical through DJ nights, live sets, a garden, and a room that stays looser than the rooftop circuit. The calendar decides the night, so the difference between a quiet drink and a packed music room is real.", { category: "Nightlife", subcategory: "indie_bar", venueKind: "nightlife", nightlifeType: "live_music_venue", musicGenres: ["indie", "electronic", "dj_sets"], attributeTags: ["live_music", "dj_sets", "local_bar", "lively_nightlife"], price: "$$", priceSource: "Official venue listings and map listings", hours: { mon: "Closed", tue: "8:00 PM-2:00 AM", wed: "8:00 PM-2:00 AM", thu: "8:00 PM-2:00 AM", fri: "8:00 PM-3:00 AM", sat: "8:00 PM-3:00 AM", sun: "8:00 PM-2:00 AM" }, officialUrl: "https://www.arkaoda.com/", sourcePhoto: images.arkaoda }),
  stop("istanbul-nightlife-360-istanbul", "360 Istanbul", [41.0339, 28.9772], "360 Istanbul is a conspicuous Beyoglu rooftop where dinner, cocktails, skyline photos, and late programming sit in the same room. It is better for groups that want spectacle and momentum than for anyone chasing a quiet cocktail bar.", { category: "Nightlife", subcategory: "rooftop_bar", venueKind: "nightlife", nightlifeType: "rooftop_bar", musicGenres: ["house", "pop", "dj_sets"], attributeTags: ["scenic_nightlife", "party_nightlife", "group_friendly", "dressy"], price: "$$$", priceSource: "Official site and map listings", hours: { sun: "12:00 PM-2:00 AM", mon: "12:00 PM-2:00 AM", tue: "12:00 PM-2:00 AM", wed: "12:00 PM-2:00 AM", thu: "12:00 PM-2:00 AM", fri: "12:00 PM-4:00 AM", sat: "12:00 PM-4:00 AM" }, officialUrl: "https://360istanbul.com/", sourcePhoto: images.threeSixty }),
  stop("istanbul-nightlife-lucca", "Lucca", [41.0671, 29.0437], "Lucca is Bebek's long-running social bar-restaurant, built around cocktails, terrace watching, and a crowd that treats the room as much like a scene as a meal. The Bosphorus-side address is the draw, but the visit is really about seeing Istanbul's polished neighborhood nightlife up close.", { category: "Nightlife", subcategory: "bar_restaurant", venueKind: "nightlife", nightlifeType: "cocktail_bar", musicGenres: ["house", "lounge", "pop"], attributeTags: ["craft_cocktails", "lively_nightlife", "premium_drinks", "scenic_nightlife"], price: "$$$", priceSource: "Official site and map listings", hours: { default: "Daily 10:00 AM-2:00 AM." }, officialUrl: "https://luccastyle.com/en/", sourcePhoto: images.lucca, editorialUrls: ["https://www.timeout.com/istanbul/bars-and-pubs/lucca"] }),
  stop("istanbul-nightlife-monkey-istanbul", "Monkey Istanbul", [41.031, 28.9742], "Monkey Istanbul uses the IKSV building rooftop for Golden Horn views, cocktails, and DJ-led nights that begin early enough for sunset and stretch into a proper late plan. It is a view bar with movement, not a hushed terrace.", { category: "Nightlife", subcategory: "rooftop_bar", venueKind: "nightlife", nightlifeType: "rooftop_bar", musicGenres: ["house", "dj_sets", "pop"], attributeTags: ["scenic_nightlife", "dj_sets", "lively_nightlife", "premium_drinks"], price: "$$$", priceSource: "Official site and map listings", hours: { default: "Daily 6:00 PM-2:00 AM." }, officialUrl: "https://www.monkeyistanbul.com/", sourcePhoto: images.monkey }),
  stop("istanbul-nightlife-minimuzikhol", "MiniMuzikhol", [41.0318, 28.9832], "MiniMuzikhol is an intimate Cihangir club with a reputation for underground electronic nights rather than broad commercial spectacle. Capacity is part of the experience, so the official calendar and ticket posture matter more than a casual bar schedule.", { category: "Nightlife", subcategory: "club", venueKind: "nightlife", nightlifeType: "club", musicGenres: ["electronic", "house", "techno"], attributeTags: ["dj_sets", "dance_floor", "late_late", "party_nightlife"], price: "$$", priceSource: "Official club calendar and ticket listings", hours: { default: "Fri-Sat event nights 11:00 PM-5:00 AM; other openings follow the official event calendar." }, officialUrl: "https://www.minimuzikhol.club/", sourcePhoto: images.miniMuzikhol, platformUrls: ["https://ra.co/clubs/1052"] }),
  stop("istanbul-nightlife-moretenders", "Moretenders Cocktail Crib", [41.0551, 29.0354], "Moretenders is an Arnavutkoy cocktail room where sushi, bar food, and long hours make the night more flexible than a pure reservation bar. It is strongest when the table wants serious drinks without giving up food or neighborhood movement.", { category: "Nightlife", subcategory: "cocktail_bar", venueKind: "nightlife", nightlifeType: "cocktail_bar", musicGenres: ["lounge", "pop", "electronic"], attributeTags: ["craft_cocktails", "date_night", "lively_nightlife", "late_night"], price: "$$$", priceSource: "Official site and map listings", hours: { default: "Daily 11:30 AM-2:00 AM." }, officialUrl: "https://www.moretenders.com/", sourcePhoto: images.moretenders }),
  stop("istanbul-nightlife-klein-phonix", "Klein Phonix", [41.0619, 28.9913], "Klein Phonix is the large-format club choice, with international electronic bookings, ticketed nights, and a door posture that makes planning more important than wandering in. The point is scale: sound, lights, and a crowd built around the event rather than the bar.", { category: "Nightlife", subcategory: "club", venueKind: "nightlife", nightlifeType: "club", musicGenres: ["electronic", "techno", "house"], attributeTags: ["dance_floor", "dj_sets", "late_late", "party_nightlife"], price: "$$$", priceSource: "Official event listings and RA", hours: { default: "Fri-Sat event nights 8:30 PM-3:00 AM; other openings follow the official event calendar." }, officialUrl: "https://klein-entertainment.com/", sourcePhoto: images.klein, platformUrls: ["https://ra.co/clubs/180502"] }),
];

const cultureStops: GuideStop[] = [
  stop("istanbul-culture-hagia-sophia", "Hagia Sophia", [41.0086, 28.98], "Hagia Sophia carries Istanbul's argument in stone: Byzantine basilica, Ottoman mosque, Republican museum chapter, and active mosque again. Scale, light, calligraphy, and surviving mosaics make the building more than a headline about contested heritage.", { category: "Culture", subcategory: "mosque_museum", venueKind: "culture", attributeTags: ["historic", "architecture", "religious_site", "central"], hours: { default: "Daily 9:00 AM-7:30 PM for tourist visiting areas; access pauses around prayer times." }, officialUrl: "https://muze.gen.tr/muze-detay/ayasofya", sourcePhoto: images.hagiaSophia, imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Hagia_Sophia_Mars_2013.jpg", editorialUrls: ["https://whc.unesco.org/en/list/356"] }),
  stop("istanbul-culture-topkapi-palace", "Topkapi Palace", [41.0115, 28.9834], "Topkapi Palace turns Ottoman court power into courtyards, kitchens, treasury rooms, relic chambers, harem routes, and terraces. Its depth is cumulative; rushing through the grounds reduces a working imperial system to a few isolated rooms.", { category: "Culture", subcategory: "palace", venueKind: "culture", attributeTags: ["historic", "museum", "architecture", "central"], hours: { mon: "9:00 AM-5:00 PM", tue: "Closed", wed: "9:00 AM-5:00 PM", thu: "9:00 AM-5:00 PM", fri: "9:00 AM-5:00 PM", sat: "9:00 AM-5:00 PM", sun: "9:00 AM-5:00 PM" }, officialUrl: "https://www.millisaraylar.gov.tr/en/palaces/topkapi-palace", sourcePhoto: images.topkapi, imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Topkapi_Palace_Bosphorus.JPG", editorialUrls: ["https://whc.unesco.org/en/list/356"] }),
  stop("istanbul-culture-blue-mosque", "Blue Mosque", [41.0054, 28.9768], "The Blue Mosque combines cascading domes, six minarets, and an interior lined with Iznik tiles directly opposite Hagia Sophia. It remains an active mosque, so prayer rhythm and visitor etiquette are part of the cultural fact, not a side note.", { category: "Culture", subcategory: "mosque", venueKind: "culture", attributeTags: ["historic", "architecture", "religious_site", "central"], hours: { default: "Daily 9:00 AM-6:00 PM outside prayer closures." }, officialUrl: "https://istanbul.ktb.gov.tr/EN-276528/sultanahmet-blue-mosque.html", sourcePhoto: images.blueMosque, imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Blue_mosque,_Istanbul.jpg", editorialUrls: ["https://whc.unesco.org/en/list/356"] }),
  stop("istanbul-culture-basilica-cistern", "Basilica Cistern", [41.0084, 28.9779], "The Basilica Cistern makes Byzantine infrastructure physical through columns, water, Medusa bases, and a restored visitor route below Sultanahmet. The drama is useful because it reveals the engineered city beneath the imperial surface.", { category: "Culture", subcategory: "historic_site", venueKind: "culture", attributeTags: ["historic", "architecture", "rainy_day", "central"], hours: { default: "Daily 9:00 AM-10:00 PM; last admission follows the timed ticket page." }, officialUrl: "https://www.yerebatan.com/en", sourcePhoto: images.basilica, imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Istanbul,_Basilica_Cistern.jpg", editorialUrls: ["https://istanbul.ktb.gov.tr/EN-276928/basilica-cistern.html"] }),
  stop("istanbul-culture-archaeological-museums", "Istanbul Archaeological Museums", [41.0117, 28.9813], "Istanbul Archaeological Museums connect classical antiquity, the ancient Near East, and Ottoman collecting across three institutions, including the Tiled Kiosk. The collection gives Sultanahmet's monuments a deeper timeline than mosque-and-palace sightseeing can supply alone.", { category: "Culture", subcategory: "archaeology_museum", venueKind: "culture", attributeTags: ["museum", "history", "rainy_day", "central"], hours: { default: "Daily 9:00 AM-6:30 PM." }, officialUrl: "https://muze.gov.tr/muze-detay?SectionId=IAR01&DistId=MRK", sourcePhoto: images.archaeology, imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Istanbularcheology.jpg", editorialUrls: ["https://istanbul.ktb.gov.tr/EN-276930/istanbul-archaeological-museums.html"] }),
  stop("istanbul-culture-chora-mosque", "Chora Mosque", [41.0317, 28.9393], "Chora's mosaics and frescoes make Byzantine visual theology unusually legible, even after the building's renewed mosque status changed the visit format. The Edirnekapi location also pulls cultural time westward, toward the land walls and older residential fabric.", { category: "Culture", subcategory: "mosque_museum", venueKind: "culture", attributeTags: ["historic", "religious_site", "art", "architecture"], hours: { default: "Daily 9:00 AM-6:00 PM outside prayer closures." }, officialUrl: "https://muze.gen.tr/muze-detay/kariye", sourcePhoto: images.chora, imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Chora_Church_2024.jpg", editorialUrls: ["https://istanbul.ktb.gov.tr/EN-276934/chora-museum.html"] }),
  stop("istanbul-culture-suleymaniye-mosque", "Suleymaniye Mosque", [41.0162, 28.9637], "Suleymaniye Mosque shows Sinan's imperial architecture at urban scale: a hilltop complex, graveyard, courtyards, and a skyline position that explains Ottoman power without museum glass. The active mosque setting rewards patience with etiquette and timing.", { category: "Culture", subcategory: "mosque", venueKind: "culture", attributeTags: ["architecture", "historic", "religious_site", "scenic"], hours: { default: "Daily 9:00 AM-6:00 PM outside prayer closures." }, officialUrl: "https://istanbul.ktb.gov.tr/EN-276532/suleymaniye-mosque.html", sourcePhoto: images.suleymaniye, imageSourceUrl: "https://commons.wikimedia.org/wiki/File:S%C3%BCleymaniyeMosqueIstanbul.jpg", editorialUrls: ["https://whc.unesco.org/en/list/356"] }),
  stop("istanbul-culture-istanbul-modern", "Istanbul Modern", [41.0269, 28.9836], "Istanbul Modern's Renzo Piano building gives contemporary Turkish art a waterfront institution rather than a borrowed industrial shell. The collection and temporary exhibitions are most useful for seeing the city as a modern art capital, not only an imperial-history destination.", { category: "Culture", subcategory: "contemporary_art_museum", venueKind: "culture", attributeTags: ["museum", "art", "design", "rainy_day"], hours: { mon: "Closed", tue: "10:00 AM-6:00 PM", wed: "10:00 AM-6:00 PM", thu: "10:00 AM-8:00 PM", fri: "10:00 AM-6:00 PM", sat: "10:00 AM-6:00 PM", sun: "10:00 AM-6:00 PM" }, officialUrl: "https://www.istanbulmodern.org/en/visit", sourcePhoto: images.istanbulModern, imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Exterior_of_Istanbul_Modern.jpg", editorialUrls: ["https://www.timeout.com/istanbul/museums/istanbul-modern"] }),
  stop("istanbul-culture-pera-museum", "Pera Museum", [41.0318, 28.975], "Pera Museum uses a Beyoglu hotel building to hold Orientalist painting, Anatolian weights and measures, Kutahya ceramics, and sharp temporary exhibitions. The scale is manageable, which makes it a strong counterweight to Sultanahmet's heavier monument days.", { category: "Culture", subcategory: "art_museum", venueKind: "culture", attributeTags: ["museum", "art", "rainy_day", "central"], hours: { mon: "Closed", tue: "10:00 AM-7:00 PM", wed: "10:00 AM-7:00 PM", thu: "10:00 AM-7:00 PM", fri: "10:00 AM-10:00 PM", sat: "10:00 AM-7:00 PM", sun: "12:00 PM-6:00 PM" }, officialUrl: "https://www.peramuseum.org/visit", sourcePhoto: images.peraMuseum, imageSourceUrl: "https://commons.wikimedia.org/wiki/File:PeraMuseum.JPG", editorialUrls: ["https://www.timeout.com/istanbul/museums/pera-museum"] }),
  stop("istanbul-culture-rahmi-koc-museum", "Rahmi M. Koc Museum", [41.042, 28.9493], "Rahmi M. Koc Museum fills Golden Horn industrial buildings with transport, engineering, maritime objects, planes, cars, and working machines. It is strongest when treated as material history: how people moved, built, repaired, and imagined modern life.", { category: "Culture", subcategory: "industrial_museum", venueKind: "culture", attributeTags: ["museum", "industrial", "family_friendly", "rainy_day"], hours: { mon: "Closed", tue: "10:00 AM-5:00 PM", wed: "10:00 AM-5:00 PM", thu: "10:00 AM-5:00 PM", fri: "10:00 AM-5:00 PM", sat: "10:00 AM-6:00 PM", sun: "10:00 AM-6:00 PM" }, officialUrl: "https://www.rmk-museum.org.tr/en/istanbul/visit", sourcePhoto: images.rahmiKoc, imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Istanbul_asv2021-11_img15_Rahmi_Ko%C3%A7_Museum.jpg", editorialUrls: ["https://www.timeout.com/istanbul/museums/rahmi-m-koc-museum"] }),
];

const natureStops: GuideStop[] = [
  stop("istanbul-nature-gulhane-park", "Gulhane Park", [41.0136, 28.9813], "Gulhane Park gives the historic core shaded paths, benches, seasonal planting, and a softer exit toward Sirkeci or the waterfront. Its former palace-garden role still matters because the green space breaks Sultanahmet's stone-heavy rhythm without leaving the old city.", { category: "Nature", subcategory: "park", venueKind: "outdoors", hours: { default: "Daily 6:00 AM-10:00 PM." }, officialUrl: "https://www.istanbuluseyret.istanbul/gulhane-parki", sourcePhoto: images.gulhane, imageSourceUrl: "https://commons.wikimedia.org/wiki/File:G%C3%BClhane_Park_Istanbul.jpg" }),
  stop("istanbul-nature-emirgan-park", "Emirgan Park", [41.1087, 29.0526], "Emirgan Park brings scale to the Bosphorus shore through hills, pavilions, mature trees, and tulip-season color. The northern position slows the city down, especially when the water and garden are allowed to compete with each other.", { category: "Nature", subcategory: "park", venueKind: "outdoors", hours: { default: "Daily 7:00 AM-10:30 PM." }, officialUrl: "https://www.istanbuluseyret.istanbul/emirgan-korusu", sourcePhoto: images.emirgan, imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Istanbul_Tulip_Festival_in_Emirgan_Park.jpg" }),
  stop("istanbul-nature-yildiz-park", "Yildiz Park", [41.0498, 29.0139], "Yildiz Park carries palace-garden history through shaded woodland paths, pavilions, ponds, and occasional Bosphorus glimpses between Besiktas and Ortakoy. The terrain feels unusually protected because the traffic and waterfront crowds sit just outside the gates.", { category: "Nature", subcategory: "park", venueKind: "outdoors", hours: { default: "Daily 6:00 AM-10:00 PM." }, officialUrl: "https://www.istanbuluseyret.istanbul/yildiz-korusu", sourcePhoto: images.yildiz, imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Yildiz_Park_02.jpg" }),
  stop("istanbul-nature-moda-sahil", "Moda Coastal Park and Path", [40.9821, 29.0259], "Moda's waterfront is everyday urban nature: tea gardens, sunset walkers, Marmara views, and long paths along the Kadikoy edge. It is not wilderness, and that is the point; the coast belongs to neighborhood life as much as scenery.", { category: "Nature", subcategory: "waterfront", venueKind: "outdoors", hours: alwaysOpen, officialUrl: "https://kulturenvanteri.com/tr/yer/moda-sahil-parki/", sourcePhoto: images.moda, imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Moda_%C4%B0skelesi_2019-08.jpg" }),
  stop("istanbul-nature-buyukada", "Buyukada", [40.8567, 29.1227], "Buyukada turns open space into a ferry-day experience: sea air, pine hills, old villas, walking routes, and a clean break from central traffic. Public areas remain accessible, but the ferry timetable controls the real shape of the visit.", { category: "Nature", subcategory: "island", venueKind: "outdoors", hours: { default: "Daily public areas 24 hours; ferry timetable controls departures from morning through evening." }, officialUrl: "https://www.sehirhatlari.istanbul/en/timetables/domestic-trips/adalar-176", sourcePhoto: images.buyukada, imageSourceUrl: "https://www.flickr.com/photos/20670095@N04/3951334827" }),
  stop("istanbul-nature-camlica-hill", "Camlica Hill", [41.027, 29.0688], "Camlica Hill gives the Asian side a broad, legible view over the Bosphorus, old city, bridges, and high-rise edges. The public park setting keeps the panorama more casual than a ticketed observation deck.", { category: "Nature", subcategory: "viewpoint", venueKind: "outdoors", hours: alwaysOpen, officialUrl: "https://www.istanbuluseyret.istanbul/camlica-tepesi", sourcePhoto: images.camlica, imageSourceUrl: "https://commons.wikimedia.org/wiki/File:%C3%87aml%C4%B1ca_Hill_public_park.jpg" }),
  stop("istanbul-nature-ataturk-arboretum", "Ataturk Arboretum", [41.1787, 28.9879], "Ataturk Arboretum is the controlled nature option on the Belgrad Forest edge, with lakes, labeled tree collections, and a quieter walking environment than the city's central parks. The weekday-leaning schedule and entry rules make planning more important than at an open promenade.", { category: "Nature", subcategory: "arboretum", venueKind: "outdoors", hours: { mon: "Closed", tue: "9:00 AM-5:00 PM", wed: "9:00 AM-5:00 PM", thu: "9:00 AM-5:00 PM", fri: "9:00 AM-5:00 PM", sat: "9:00 AM-5:00 PM", sun: "9:00 AM-5:00 PM" }, officialUrl: "https://ataturkarboretumu.ogm.gov.tr/", sourcePhoto: images.arboretum, imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Atat%C3%BCrkArboretum_(2).jpg" }),
  stop("istanbul-nature-belgrad-forest", "Belgrad Forest", [41.1835, 28.9882], "Belgrad Forest offers Istanbul's most convincing large green escape, with reservoirs, shaded roads, picnic areas, and long walking loops north of the dense city. It rewards an early start because the access and weekend crowd are part of the tradeoff.", { category: "Nature", subcategory: "forest", venueKind: "outdoors", hours: { default: "Daily 6:00 AM-8:00 PM." }, officialUrl: "https://istanbul.ktb.gov.tr/EN-276699/belgrad-forest.html", sourcePhoto: images.belgradForest, imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Belgrad_Forest_(11).jpg" }),
  stop("istanbul-nature-fenerbahce-park", "Fenerbahce Park", [40.9709, 29.0365], "Fenerbahce Park stretches Kadikoy's waterfront mood into lawns, trees, marina views, and long Marmara-facing paths. It is useful because it feels local and coastal at once, with enough space to sit rather than merely pass through.", { category: "Nature", subcategory: "waterfront_park", venueKind: "outdoors", hours: alwaysOpen, officialUrl: "https://kulturenvanteri.com/tr/yer/fenerbahce-parki/", sourcePhoto: images.fenerbahce, imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Fenerbah%C3%A7e_Park%C4%B1_07.jpg" }),
  stop("istanbul-nature-fethi-pasa-grove", "Fethi Pasa Grove", [41.0343, 29.0258], "Fethi Pasa Grove climbs above Uskudar with wooded paths, tea terraces, and Bosphorus views that feel closer to daily city life than the formal palace gardens. The slope is part of the experience, giving the view a physical cost.", { category: "Nature", subcategory: "grove", venueKind: "outdoors", hours: { default: "Daily 6:00 AM-11:00 PM." }, officialUrl: "https://www.istanbuluseyret.istanbul/fethi-pasa-korusu", sourcePhoto: images.fethiPasa, imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Fethipa%C5%9Fa_Korusu.jpg" }),
];

const activityStops: GuideStop[] = [
  stop("istanbul-activities-grand-bazaar", "Grand Bazaar", [41.0107, 28.9681], "The Grand Bazaar is best read as a district of gates, hans, workshops, tea pauses, and commercial memory rather than as one covered shopping hall. Go with a target and a tolerance for getting turned around; the surrounding streets are part of the market system.", { category: "Activities", subcategory: "market", venueKind: "retail", hours: { mon: "8:30 AM-7:00 PM", tue: "8:30 AM-7:00 PM", wed: "8:30 AM-7:00 PM", thu: "8:30 AM-7:00 PM", fri: "8:30 AM-7:00 PM", sat: "8:30 AM-7:00 PM", sun: "Closed" }, officialUrl: "https://www.kapalicarsi.com.tr/", sourcePhoto: images.grandBazaar, imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Grand_Bazaar_Istanbul_2007.jpg", editorialUrls: ["https://istanbul.ktb.gov.tr/EN-276929/grand-bazaar.html"] }),
  stop("istanbul-activities-spice-bazaar", "Spice Bazaar", [41.0165, 28.9706], "The Spice Bazaar still works because its covered lanes connect to Eminonu's cheese shops, nut sellers, ferry docks, mosque courtyard, and food streets. The interior is only the visible core of a wider trade neighborhood.", { category: "Activities", subcategory: "market", venueKind: "retail", hours: { mon: "9:00 AM-7:00 PM", tue: "9:00 AM-7:00 PM", wed: "9:00 AM-7:00 PM", thu: "9:00 AM-7:00 PM", fri: "9:00 AM-7:00 PM", sat: "9:00 AM-7:00 PM", sun: "10:00 AM-7:00 PM" }, officialUrl: "https://www.misircarsisi.org.tr/", sourcePhoto: images.spiceBazaar, imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Crowd_In_Spice_Bazaar,_Istanbul.jpg", editorialUrls: ["https://istanbul.ktb.gov.tr/EN-276928/spice-bazaar.html"] }),
  stop("istanbul-activities-bosphorus-ferry", "Bosphorus Ferry Crossing", [41.0214, 29.0156], "A Bosphorus ferry crossing is Istanbul's clearest orientation tool: mosques behind you, palaces and yali along the banks, gulls overhead, and the Asian side arriving without drama. Choose the public ferry when the goal is city geography, not a packaged cruise.", { category: "Activities", subcategory: "ferry", venueKind: "transport", hours: { default: "Daily 6:30 AM-11:30 PM by route; official timetable controls exact departure times." }, officialUrl: "https://www.sehirhatlari.istanbul/en", timetableUrl: "https://www.sehirhatlari.istanbul/en/timetables", sourcePhoto: images.ferry, imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Istanbul_Bosphorus_ferry.jpg" }),
  stop("istanbul-activities-kilic-ali-pasa-hamam", "Kilic Ali Pasa Hamami", [41.0253, 28.9813], "Kilic Ali Pasa Hamami turns a restored Sinan bath complex into a controlled, timed bathing ritual. Separate time windows matter because the experience is physical and structured, not a spa add-on that can be squeezed into any open hour.", { category: "Activities", subcategory: "hammam", venueKind: "service", price: "$$$", priceSource: "Official booking page", hours: { default: "Daily women 8:00 AM-4:00 PM; men 4:30 PM-11:30 PM by booking page." }, officialUrl: "https://kilicalipasahamami.com/", bookingUrl: "https://kilicalipasahamami.com/reservation/", sourcePhoto: images.hamami }),
  stop("istanbul-activities-galata-tower", "Galata Tower", [41.0256, 28.9742], "Galata Tower's value is geographic rather than romantic: the view explains the Golden Horn, Bosphorus, old city, Karakoy, and Pera in one sweep. The queue can dominate the visit, so the timed ticket posture changes the decision.", { category: "Activities", subcategory: "viewpoint", venueKind: "landmark", price: "$$", priceSource: "Official museum ticket page", hours: { default: "Daily 8:30 AM-10:00 PM." }, officialUrl: "https://muze.gen.tr/muze-detay/galatakulesi", sourcePhoto: images.galata, imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Istanbul_asv2020-02_img48_Galata_Tower.jpg" }),
  stop("istanbul-activities-dolmabahce-palace", "Dolmabahce Palace", [41.0392, 29.0005], "Dolmabahce Palace shows the Ottoman court turning toward European ceremony through chandeliers, staircases, waterfront frontage, and administrative scale. The building is more nineteenth-century statecraft than old-city romance, and that shift is exactly what makes it useful.", { category: "Activities", subcategory: "palace", venueKind: "culture", price: "$$", priceSource: "Official palace ticket page", hours: { mon: "Closed", tue: "9:00 AM-5:00 PM", wed: "9:00 AM-5:00 PM", thu: "9:00 AM-5:00 PM", fri: "9:00 AM-5:00 PM", sat: "9:00 AM-5:00 PM", sun: "9:00 AM-5:00 PM" }, officialUrl: "https://www.millisaraylar.gov.tr/en/palaces/dolmabahce-palace", sourcePhoto: images.dolmabahce, imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Dolmabah%C3%A7e_Palace,_Istanbul_cropped.jpg" }),
  stop("istanbul-activities-maidens-tower", "Maiden's Tower", [41.0211, 29.0041], "Maiden's Tower makes the Bosphorus feel like a stage set only because the logistics are so specific: a tiny islet, shuttle boats, restored interiors, and a view back toward both shores. It is a small visit, but the water approach gives it disproportionate force.", { category: "Activities", subcategory: "landmark", venueKind: "landmark", price: "$$", priceSource: "Official ticket page", hours: { default: "Daily 9:00 AM-8:00 PM; boat transfer schedule follows the official ticket page." }, officialUrl: "https://kizkulesi.gov.tr/", sourcePhoto: images.maiden, imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Maidens_Tower_2007.jpg" }),
  stop("istanbul-activities-pierre-loti-hill", "Pierre Loti Hill and Eyup Cable Car", [41.0535, 28.9338], "Pierre Loti Hill turns the Golden Horn into a layered view of cemeteries, mosques, neighborhoods, and water. The cable car changes the visit from a lookout into a small piece of city movement, especially when the hill is treated as more than a tea terrace.", { category: "Activities", subcategory: "viewpoint", venueKind: "transport", price: "$", priceSource: "Metro Istanbul fare and map listings", hours: { default: "Daily 8:00 AM-11:00 PM for the cable car; public hill areas remain open 24 hours." }, officialUrl: "https://www.metro.istanbul/Hatlarimiz/HatDetay?hat=TF2", sourcePhoto: images.pierreLoti, imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Golden_Horn_panorama_from_Pierre_Loti_Hill.jpg" }),
  stop("istanbul-activities-kadikoy-market", "Kadikoy Market", [40.9904, 29.0257], "Kadikoy Market is the Asian-side food walk where fishmongers, pickle shops, bakeries, produce stalls, meyhanes, and coffee counters sit close enough to browse without a script. Individual businesses set their own hours, but the market streets are strongest from late morning through early evening.", { category: "Activities", subcategory: "market_walk", venueKind: "retail", price: "$", priceSource: "Map listings and local market pages", hours: { default: "Daily 9:00 AM-8:00 PM; individual vendor hours follow shop and market-day schedules." }, officialUrl: "https://kulturenvanteri.com/tr/yer/kadikoy-carsisi/", sourcePhoto: images.kadikoyMarket, imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Kad%C4%B1k%C3%B6y_market_stall,_Istanbul.jpg" }),
  stop("istanbul-activities-istanbul-modern", "Istanbul Modern", [41.0269, 28.9836], "Istanbul Modern gives Karakoy a contemporary-art pause with a Renzo Piano waterfront building, Turkish modern and contemporary works, and rotating exhibitions. It is useful when the trip needs living Istanbul culture rather than another imperial monument.", { category: "Activities", subcategory: "museum", venueKind: "culture", price: "$$", priceSource: "Official museum ticket page", hours: { mon: "Closed", tue: "10:00 AM-6:00 PM", wed: "10:00 AM-6:00 PM", thu: "10:00 AM-8:00 PM", fri: "10:00 AM-6:00 PM", sat: "10:00 AM-6:00 PM", sun: "10:00 AM-6:00 PM" }, officialUrl: "https://www.istanbulmodern.org/en/visit", sourcePhoto: images.istanbulModern, imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Exterior_of_Istanbul_Modern.jpg" }),
];

const hotelStops: GuideStop[] = [
  stop("istanbul-hotel-four-seasons-sultanahmet", "Four Seasons Hotel Istanbul at Sultanahmet", [41.0063, 28.9799], "Set in a restored former prison, the hotel's appeal is its rare mix of historic character, courtyard calm, and immediate access to Sultanahmet's major sights.", { category: "Stay", subcategory: "luxury_hotel", venueKind: "lodging", lodgingType: "hotel", attributeTags: ["luxury", "central", "quiet", "romantic"], price: "$$$$", priceSource: "Official booking page and Google Travel", hours: alwaysOpen, officialUrl: "https://www.fourseasons.com/istanbul/", bookingUrl: "https://www.fourseasons.com/istanbul/offers/", sourcePhoto: images.fourSeasons }),
  stop("istanbul-hotel-pera-palace", "Pera Palace Hotel", [41.0311, 28.974], "Pera Palace keeps old Pera tangible through Orient Express history, high-ceilinged public rooms, museum-like corridors, and a location near Tunel, Galata, and Istiklal. The tradeoff is useful: grand-hotel atmosphere without sleeping inside Sultanahmet's sightseeing zone.", { category: "Stay", subcategory: "historic_hotel", venueKind: "lodging", lodgingType: "hotel", attributeTags: ["luxury", "historic", "central", "romantic"], price: "$$$$", priceSource: "Official booking page and Google Travel", hours: alwaysOpen, officialUrl: "https://perapalace.com/en/", bookingUrl: "https://perapalace.com/en/rooms-suites/", sourcePhoto: images.peraPalace }),
  stop("istanbul-hotel-soho-house", "Soho House Istanbul", [41.0318, 28.9748], "Soho House Istanbul turns Palazzo Corpi into a social Beyoglu base with frescoed interiors, restaurants, work lounges, a hammam, and rooftop life. It rewards guests who will use the shared spaces, not just anyone looking for a quiet room near Istiklal.", { category: "Stay", subcategory: "design_hotel", venueKind: "lodging", lodgingType: "hotel", attributeTags: ["design", "social", "central", "luxury"], price: "$$$$", priceSource: "Official booking page and Google Travel", hours: alwaysOpen, officialUrl: "https://www.sohohouse.com/en-us/houses/soho-house-istanbul", bookingUrl: "https://www.sohohouse.com/en-us/houses/soho-house-istanbul/bedrooms", sourcePhoto: images.sohoHouse }),
  stop("istanbul-hotel-peninsula", "The Peninsula Istanbul", [41.0269, 28.9818], "The Peninsula Istanbul uses restored Karakoy waterfront buildings to make a busy port-side address feel composed. Rooms, terraces, spa space, and water views suit travelers who want contemporary luxury close to ferries and Galata rather than Ottoman-palace nostalgia.", { category: "Stay", subcategory: "luxury_hotel", venueKind: "lodging", lodgingType: "hotel", attributeTags: ["luxury", "scenic", "wellness", "central"], price: "$$$$", priceSource: "Official booking page and Google Travel", hours: alwaysOpen, officialUrl: "https://www.peninsula.com/en/istanbul/5-star-luxury-hotel-karakoy", bookingUrl: "https://www.peninsula.com/en/istanbul/5-star-luxury-hotel-karakoy/rooms-suites", sourcePhoto: images.peninsula, imageSourceUrl: "https://commons.wikimedia.org/wiki/File:The_Peninsula_Istanbul.png" }),
  stop("istanbul-hotel-kocatas-mansions", "Kocatas Mansions Istanbul", [41.1662, 29.0548], "Kocatas Mansions Istanbul is the northern Bosphorus alternative to central hotels, set in restored Ottoman-era waterfront mansions. The strength is quiet, views, spa time, and resort mood; the cost is a slower return from old-city museums and late Beyoglu plans.", { category: "Stay", subcategory: "mansion_hotel", venueKind: "lodging", lodgingType: "hotel", attributeTags: ["luxury", "quiet", "scenic", "wellness"], price: "$$$$", priceSource: "Official booking page and Google Travel", hours: alwaysOpen, officialUrl: "https://www.anantara.com/en/kocatas-mansions-istanbul", bookingUrl: "https://www.anantara.com/en/kocatas-mansions-istanbul/offers", sourcePhoto: images.kocatas }),
  stop("istanbul-hotel-ciragan-palace", "Ciragan Palace Kempinski Istanbul", [41.0432, 29.0151], "Ciragan Palace gives Bosphorus hotel luxury its clearest palace form, with restored Ottoman architecture, waterfront gardens, and resort-style pool space in Besiktas. It is expensive and slightly removed from old-city touring, but the water and grounds are the reason.", { category: "Stay", subcategory: "palace_hotel", venueKind: "lodging", lodgingType: "hotel", attributeTags: ["luxury", "historic", "scenic", "romantic"], price: "$$$$", priceSource: "Official booking page and Google Travel", hours: alwaysOpen, officialUrl: "https://www.kempinski.com/en/ciragan-palace", bookingUrl: "https://www.kempinski.com/en/ciragan-palace/rooms-suites", sourcePhoto: images.ciragan }),
  stop("istanbul-hotel-shangri-la-bosphorus", "Shangri-La Bosphorus, Istanbul", [41.0415, 29.0058], "Shangri-La Bosphorus is a polished Besiktas waterfront hotel, strong for ferry access, Dolmabahce, and rooms that face the strait. It offers a more conventional luxury-hotel experience than the palace properties, which can be an advantage for travelers who want service clarity over historical theater.", { category: "Stay", subcategory: "luxury_hotel", venueKind: "lodging", lodgingType: "hotel", attributeTags: ["luxury", "scenic", "central", "wellness"], price: "$$$$", priceSource: "Official booking page and Google Travel", hours: alwaysOpen, officialUrl: "https://www.shangri-la.com/istanbul/shangrila/", bookingUrl: "https://www.shangri-la.com/istanbul/shangrila/rooms-suites/", sourcePhoto: images.shangriLa }),
  stop("istanbul-hotel-raffles", "Raffles Istanbul", [41.0667, 29.0172], "Raffles Istanbul sits inside Zorlu Center, making shopping, performing arts, spa time, and road access part of the stay. It is not for old-city atmosphere; it is for travelers who prefer large modern rooms and a controlled luxury bubble outside the tourist core.", { category: "Stay", subcategory: "modern_luxury_hotel", venueKind: "lodging", lodgingType: "hotel", attributeTags: ["luxury", "design", "wellness", "quiet"], price: "$$$$", priceSource: "Official booking page and Google Travel", hours: alwaysOpen, officialUrl: "https://www.raffles.com/istanbul/", bookingUrl: "https://www.raffles.com/istanbul/rooms-suites/", sourcePhoto: images.raffles }),
  stop("istanbul-hotel-bank-hotel", "The Bank Hotel Istanbul", [41.0253, 28.9736], "The Bank Hotel turns a former Karakoy bank building into a design-led base near Galata, ferries, and the lower end of Beyoglu. The appeal is architectural character and neighborhood mobility, with less insulation than the grand waterfront hotels.", { category: "Stay", subcategory: "boutique_hotel", venueKind: "lodging", lodgingType: "hotel", attributeTags: ["design", "central", "historic", "romantic"], price: "$$$", priceSource: "Official booking page and Google Travel", hours: alwaysOpen, officialUrl: "https://www.thebankhotelistanbul.com/en", bookingUrl: "https://www.thebankhotelistanbul.com/en/rooms", sourcePhoto: images.bankHotel }),
  stop("istanbul-hotel-ajwa-sultanahmet", "Ajwa Sultanahmet", [41.0074, 28.9702], "Ajwa Sultanahmet offers Ottoman-inspired interiors, carved wood, tilework, a spa, and old-city access with a more conservative luxury profile. It suits travelers who want Sultanahmet convenience and decorative intensity without the former-prison calm of Four Seasons.", { category: "Stay", subcategory: "heritage_hotel", venueKind: "lodging", lodgingType: "hotel", attributeTags: ["luxury", "central", "wellness", "romantic"], price: "$$$$", priceSource: "Official booking page and Google Travel", hours: alwaysOpen, officialUrl: "https://www.ajwa.com.tr/en", bookingUrl: "https://www.ajwa.com.tr/en/rooms-suites", sourcePhoto: images.ajwa }),
];

const hostelStops: GuideStop[] = [
  stop("istanbul-hostel-cheers", "Cheers Hostel", [41.0095, 28.9781], "Cheers Hostel is a Sultanahmet social base with dorms, private rooms, a bar, and major sights within walking distance. The balance is useful: enough backpacker energy to meet people, but a location that still solves the first-time old-city itinerary.", { category: "Stay", subcategory: "social_hostel", venueKind: "lodging", lodgingType: "hostel", attributeTags: ["budget", "social", "central", "solo_friendly"], price: "$", priceSource: "Official hostel site and Hostelworld", hours: alwaysOpen, officialUrl: "https://www.cheershostel.com/", bookingUrl: "https://www.hostelworld.com/hostels/p/42084/cheers-hostel/", sourcePhoto: images.cheers }),
  stop("istanbul-hostel-bahaus", "Bahaus Guesthouse Hostel", [41.0052, 28.9795], "Bahaus Guesthouse Hostel keeps the old-city sights close while leaning into backpacker sociability through dorms, private rooms, and a rooftop bar. It is better for outgoing travelers than for anyone trying to make Sultanahmet feel hushed.", { category: "Stay", subcategory: "social_hostel", venueKind: "lodging", lodgingType: "hostel", attributeTags: ["budget", "party", "central", "solo_friendly"], price: "$", priceSource: "Official hostel site and Hostelworld", hours: alwaysOpen, officialUrl: "https://bahaushostel.com/", bookingUrl: "https://www.hostelworld.com/hostels/p/6418/bahaus-guesthouse-hostel/", sourcePhoto: images.bahaus }),
  stop("istanbul-hostel-wabi", "Wabi Hostels Istanbul", [41.0437, 28.9868], "Wabi Hostels Istanbul offers dorms, private rooms, rooftop social space, and quick access to Taksim transit and Istiklal nightlife. Airport-bus convenience and evening movement come with the tradeoff of being outside easy walking range of the old-city mosques.", { category: "Stay", subcategory: "design_hostel", venueKind: "lodging", lodgingType: "hostel", attributeTags: ["budget", "social", "central", "solo_friendly"], price: "$", priceSource: "Official hostel site and Hostelworld", hours: alwaysOpen, officialUrl: "https://www.wabihostels.com/en/", bookingUrl: "https://www.hostelworld.com/hostels/p/52419/wabi-hostels-istanbul/", sourcePhoto: images.wabi }),
  stop("istanbul-hostel-hush", "Hush Hostel Lounge", [40.9927, 29.0222], "Hush Hostel Lounge gives Kadikoy a real hostel base with dorms, private rooms, garden space, and ferry access. It suits travelers who want markets, bars, and Asian-side daily life to be the center of the stay, not a short detour.", { category: "Stay", subcategory: "neighborhood_hostel", venueKind: "lodging", lodgingType: "hostel", attributeTags: ["budget", "social", "local_favorite", "solo_friendly"], price: "$", priceSource: "Official hostel site and Hostelworld", hours: alwaysOpen, officialUrl: "https://hushhostels.com/", bookingUrl: "https://www.hostelworld.com/hostels/p/42030/hush-hostel-lounge/", sourcePhoto: images.hush }),
  stop("istanbul-hostel-second-home", "Second Home Hostel", [41.0144, 28.9766], "Second Home Hostel sits between Sirkeci, Sultanahmet, ferries, and trams, which makes logistics the main value. Dorms and private rooms keep it flexible for budget travelers who want central movement more than a high-design hostel scene.", { category: "Stay", subcategory: "central_hostel", venueKind: "lodging", lodgingType: "hostel", attributeTags: ["budget", "central", "casual", "solo_friendly"], price: "$", priceSource: "Official hostel site and Hostelworld", hours: alwaysOpen, officialUrl: "https://www.secondhomehostel.com/", bookingUrl: "https://www.hostelworld.com/hostels/p/35924/second-home-hostel/", sourcePhoto: images.secondHome }),
  stop("istanbul-hostel-yolo", "Yolo Hostel Kadikoy", [40.9919, 29.0241], "Yolo Hostel Kadikoy is a compact Asian-side hostel with dorms, private rooms, and a location close to ferries, bars, and market streets. The point is neighborhood immersion at a lower price, not old-city sightseeing convenience.", { category: "Stay", subcategory: "neighborhood_hostel", venueKind: "lodging", lodgingType: "hostel", attributeTags: ["budget", "local_favorite", "solo_friendly", "casual"], price: "$", priceSource: "Hostelworld and booking platform listings", hours: { default: "Daily reception 24 hours; check-in 2:00 PM-11:00 PM; checkout by 11:00 AM." }, officialUrl: "https://www.hostelworld.com/hostels/p/296549/yolo-hostel-kadikoy/", bookingUrl: "https://www.hostelworld.com/hostels/p/296549/yolo-hostel-kadikoy/", sourcePhoto: images.yolo }),
  stop("istanbul-hostel-archeo", "Archeo", [41.0284, 28.9812], "Archeo is a Karakoy hostel-hotel hybrid with dorms, private rooms, and a design-forward location between Galata, Tophane, and the waterfront. It is useful when the trip wants hostel pricing without giving up the lower-Beyoglu gallery-and-cafe circuit.", { category: "Stay", subcategory: "design_hostel", venueKind: "lodging", lodgingType: "hostel", attributeTags: ["budget", "design", "central", "solo_friendly"], price: "$$", priceSource: "Official hostel site and Hostelworld", hours: alwaysOpen, officialUrl: "https://www.archeopol.com/", bookingUrl: "https://www.hostelworld.com/hostels/p/300442/archeo/", sourcePhoto: images.archeo }),
  stop("istanbul-hostel-le-banc", "Le Banc Hostel", [41.0312, 28.976], "Le Banc Hostel places dorms and private rooms in the Galata-Beyoglu corridor, with a more polished social setup than the old-school backpacker hostels. The centrality is real, but street noise and nightlife proximity are part of the bargain.", { category: "Stay", subcategory: "social_hostel", venueKind: "lodging", lodgingType: "hostel", attributeTags: ["budget", "social", "central", "lively"], price: "$$", priceSource: "Official hostel site and Hostelworld", hours: { default: "Daily reception 24 hours; check-in from 2:00 PM; checkout by 11:00 AM." }, officialUrl: "https://lebancistanbul.com/", bookingUrl: "https://www.hostelworld.com/hostels/p/316768/le-banc-hostel/", sourcePhoto: images.leBanc }),
  stop("istanbul-hostel-stanpoli", "Stanpoli Hostel", [41.0042, 28.9791], "Stanpoli Hostel is a Sultanahmet budget base with dorms, private rooms, and a roof terrace within walking range of the old-city monuments. It is quieter and more practical than the party hostels, which makes the location do most of the work.", { category: "Stay", subcategory: "central_hostel", venueKind: "lodging", lodgingType: "hostel", attributeTags: ["budget", "central", "quiet", "solo_friendly"], price: "$", priceSource: "Official hostel site and Hostelworld", hours: { default: "Daily 24-hour front desk; check-in from 2:00 PM; checkout by 11:00 AM." }, officialUrl: "https://www.stanpolihostel.com/", bookingUrl: "https://www.hostelworld.com/hostels/p/75980/stanpoli-hostel/", sourcePhoto: images.stanpoli }),
  stop("istanbul-hostel-hanchi", "Hanchi Hostel", [41.0045, 28.9633], "Hanchi Hostel sits on the Kumkapi side of the old city, with dorms, private rooms, and easier access to seafood streets than to polished Beyoglu nightlife. The value is central and simple, but the district feels different from Sultanahmet's monument-facing hostel cluster.", { category: "Stay", subcategory: "central_hostel", venueKind: "lodging", lodgingType: "hostel", attributeTags: ["budget", "central", "casual", "solo_friendly"], price: "$", priceSource: "Booking platform and map listings", hours: { default: "Daily 24-hour front desk; check-in from 2:00 PM; checkout by 11:00 AM." }, officialUrl: "https://www.hanchihostel.com/", bookingUrl: "https://www.booking.com/hotel/tr/hanchi-hostel.en-gb.html", sourcePhoto: images.hanchi }),
];

export const istanbulCitywideGuides = [
  {
    id: "list-istanbul-citywide-restaurants",
    slug: "istanbul-best-restaurants-citywide",
    seoSlug: "best-restaurants",
    seoTitle: "Best Restaurants in Istanbul",
    seoDescription:
      "Best restaurants in Istanbul for Anatolian cooking, Ottoman palace cuisine, meyhane rooms, market classics, seafood, and modern Turkish tasting menus.",
    title: "Anatolia, Palace Kitchens, and New Turkish Tables",
    description:
      "Istanbul dining works across markets, old meyhane habits, Ottoman food history, seafood rooms, and modern Turkish kitchens that still answer to regional ingredients. The selection favors restaurants with a clear cooking argument, not generic view-led meals.",
    url: "https://www.google.com/maps/search/best+restaurants+istanbul",
    category: "Food",
    location: cityLocation,
    creator: creator("Food"),
    upvotes: 0,
    createdAt,
    stops: restaurantStops,
    sources: [
      source("Ciya official", "https://www.ciya.com.tr/"),
      source("Karakoy Lokantasi official", "https://www.karakoylokantasi.com/en/info"),
      source("Pandeli official", "https://pandeli.squarespace.com/"),
      source("Mikla official", "https://www.miklarestaurant.com/mikla"),
      source("Asitane official", "https://www.asitanerestaurant.com/English/about-us/"),
      source("Neolokal official", "https://www.neolokal.com/en/neolokal_en/"),
      source("TURK Fatih Tutak official", "https://www.turkft.com/"),
      source("Yeni Lokanta official", "https://www.yenilokanta.com/"),
      source("Aheste official", "https://ahesterestaurant.com/visit"),
      source("Balikci Sabahattin official", "https://www.balikcisabahattin.com/"),
      source("MICHELIN Guide Istanbul restaurants", "https://guide.michelin.com/en/istanbul-province/istanbul/restaurants"),
      source("Time Out Istanbul restaurants", "https://www.timeout.com/istanbul/restaurants"),
    ],
  },
  {
    id: "list-istanbul-citywide-bars-nightlife",
    slug: "istanbul-best-bars-nightlife-citywide",
    seoSlug: "best-bars-and-nightlife",
    seoTitle: "Best Bars and Nightlife in Istanbul",
    seoDescription:
      "Best bars and nightlife in Istanbul, from Bosphorus cocktails and rooftop views to Kadikoy music rooms, Galata jazz, and late Beyoglu clubs.",
    title: "Rooftops, Jazz Rooms, and Late Crossings",
    description:
      "Istanbul nightlife changes by shore and altitude: rooftops for skyline drama, Bosphorus bars for polish, Kadikoy rooms for music, and Beyoglu clubs for late electronic nights. The stronger stops make their format clear before the view takes over.",
    url: "https://www.google.com/maps/search/best+bars+nightlife+istanbul",
    category: "Nightlife",
    location: cityLocation,
    creator: creator("Nightlife"),
    upvotes: 0,
    createdAt,
    stops: nightlifeStops,
    sources: [
      source("Mikla official", "https://www.miklarestaurant.com/mikla"),
      source("Flekk Cocktail Bar official", "https://www.flekkcocktailbar.com/"),
      source("Nardis Jazz Club official", "https://nardisjazz.com/"),
      source("Arkaoda official", "https://www.arkaoda.com/"),
      source("360 Istanbul official", "https://360istanbul.com/"),
      source("Lucca official", "https://luccastyle.com/en/"),
      source("Monkey Istanbul official", "https://www.monkeyistanbul.com/"),
      source("MiniMuzikhol official", "https://www.minimuzikhol.club/"),
      source("Moretenders official", "https://www.moretenders.com/"),
      source("Klein Entertainment official", "https://klein-entertainment.com/"),
      source("Resident Advisor Istanbul", "https://ra.co/events/tr/istanbul"),
      source("Time Out Istanbul bars", "https://www.timeout.com/istanbul/bars-and-pubs"),
    ],
  },
  {
    id: "list-istanbul-citywide-cultural-stops",
    slug: "istanbul-best-museums-and-cultural-stops-citywide",
    seoSlug: "best-museums-and-cultural-stops",
    seoTitle: "Best Museums and Cultural Stops in Istanbul",
    seoDescription:
      "Best museums and cultural stops in Istanbul for Byzantine, Ottoman, mosque, palace, archaeological, contemporary art, and industrial history layers.",
    title: "Imperial Layers Without the Blur",
    description:
      "Istanbul culture needs more than a monument checklist: Byzantine churches, active mosques, Ottoman palace systems, archaeological collections, contemporary art, and industrial history all argue with each other. The strongest visits reveal a specific layer instead of selling generalized grandeur.",
    url: "https://www.google.com/maps/search/best+museums+cultural+stops+istanbul",
    category: "Culture",
    location: cityLocation,
    creator: creator("Culture"),
    upvotes: 0,
    createdAt,
    stops: cultureStops,
    sources: [
      source("Hagia Sophia official museum page", "https://muze.gen.tr/muze-detay/ayasofya"),
      source("Topkapi Palace official", "https://www.millisaraylar.gov.tr/en/palaces/topkapi-palace"),
      source("Blue Mosque tourism page", "https://istanbul.ktb.gov.tr/EN-276528/sultanahmet-blue-mosque.html"),
      source("Basilica Cistern official", "https://www.yerebatan.com/en"),
      source("Istanbul Archaeological Museums official", "https://muze.gov.tr/muze-detay?SectionId=IAR01&DistId=MRK"),
      source("Chora official museum page", "https://muze.gen.tr/muze-detay/kariye"),
      source("Suleymaniye Mosque tourism page", "https://istanbul.ktb.gov.tr/EN-276532/suleymaniye-mosque.html"),
      source("Istanbul Modern official", "https://www.istanbulmodern.org/en/visit"),
      source("Pera Museum official", "https://www.peramuseum.org/visit"),
      source("Rahmi M. Koc Museum official", "https://www.rmk-museum.org.tr/en/istanbul/visit"),
      source("UNESCO Historic Areas of Istanbul", "https://whc.unesco.org/en/list/356"),
      source("Wikimedia Commons Istanbul landmarks", "https://commons.wikimedia.org/wiki/Category:Tourist_attractions_in_Istanbul"),
    ],
  },
  {
    id: "list-istanbul-citywide-nature",
    slug: "istanbul-best-parks-waterfronts-citywide",
    seoSlug: "best-parks",
    seoTitle: "Best Parks and Waterfronts in Istanbul",
    seoDescription:
      "Best parks and waterfronts in Istanbul for Bosphorus views, palace gardens, Moda walks, Emirgan tulips, forest paths, and island air.",
    title: "Gardens, Ferries, and Breathing Room",
    description:
      "Istanbul's green space is tied to water, hills, and former palace land: shaded gardens in the center, Bosphorus groves farther north, Asian-side waterfronts, forest edges, and islands reached by ferry. The useful choices change the city's speed as much as its scenery.",
    url: "https://www.google.com/maps/search/best+parks+waterfronts+istanbul",
    category: "Nature",
    location: cityLocation,
    creator: creator("Nature"),
    upvotes: 0,
    createdAt,
    stops: natureStops,
    sources: [
      source("Istanbul Seyret parks", "https://www.istanbuluseyret.istanbul/"),
      source("Gulhane Park source", "https://www.istanbuluseyret.istanbul/gulhane-parki"),
      source("Emirgan Grove source", "https://www.istanbuluseyret.istanbul/emirgan-korusu"),
      source("Yildiz Grove source", "https://www.istanbuluseyret.istanbul/yildiz-korusu"),
      source("Camlica Hill source", "https://www.istanbuluseyret.istanbul/camlica-tepesi"),
      source("Fethi Pasa Grove source", "https://www.istanbuluseyret.istanbul/fethi-pasa-korusu"),
      source("Ataturk Arboretum official", "https://ataturkarboretumu.ogm.gov.tr/"),
      source("Belgrad Forest tourism page", "https://istanbul.ktb.gov.tr/EN-276699/belgrad-forest.html"),
      source("Sehir Hatlari ferry schedules", "https://www.sehirhatlari.istanbul/en"),
      source("Wikimedia Commons Istanbul parks", "https://commons.wikimedia.org/wiki/Category:Parks_in_Istanbul"),
    ],
  },
  {
    id: "list-istanbul-citywide-activities",
    slug: "istanbul-best-things-to-do-citywide",
    seoSlug: "best-things-to-do",
    seoTitle: "Best Things to Do in Istanbul",
    seoDescription:
      "Best things to do in Istanbul, mixing bazaars, ferries, hammams, tower views, palace visits, markets, and contemporary art.",
    title: "Markets, Crossings, Rituals, and Views",
    description:
      "Istanbul activities should make the city's geography and daily systems legible: covered markets, public ferries, bathing rituals, palace rooms, cable-car views, Asian-side food streets, and contemporary art. The useful experiences involve movement, timing, and texture, not just admission tickets.",
    url: "https://www.google.com/maps/search/best+things+to+do+istanbul",
    category: "Activities",
    location: cityLocation,
    creator: creator("Activities"),
    upvotes: 0,
    createdAt,
    stops: activityStops,
    sources: [
      source("Grand Bazaar official", "https://www.kapalicarsi.com.tr/"),
      source("Spice Bazaar official", "https://www.misircarsisi.org.tr/"),
      source("Sehir Hatlari ferry schedules", "https://www.sehirhatlari.istanbul/en"),
      source("Kilic Ali Pasa Hamami official", "https://kilicalipasahamami.com/"),
      source("Galata Tower ticket page", "https://muze.gen.tr/muze-detay/galatakulesi"),
      source("Dolmabahce Palace official", "https://www.millisaraylar.gov.tr/en/palaces/dolmabahce-palace"),
      source("Maiden's Tower official", "https://kizkulesi.gov.tr/"),
      source("Metro Istanbul Eyup cable car", "https://www.metro.istanbul/Hatlarimiz/HatDetay?hat=TF2"),
      source("Kadikoy market source", "https://kulturenvanteri.com/tr/yer/kadikoy-carsisi/"),
      source("Istanbul Modern official", "https://www.istanbulmodern.org/en/visit"),
      source("Istanbul tourism attractions", "https://istanbul.ktb.gov.tr/EN-276919/istanbul.html"),
      source("Wikimedia Commons Istanbul attractions", "https://commons.wikimedia.org/wiki/Category:Tourist_attractions_in_Istanbul"),
    ],
  },
  {
    id: "list-istanbul-citywide-hotels",
    slug: "istanbul-best-hotels",
    seoSlug: "best-hotels",
    seoTitle: "Best Hotels in Istanbul",
    seoDescription:
      "Best hotels in Istanbul, comparing Sultanahmet heritage stays, Pera grand hotels, Karakoy waterfront luxury, Beyoglu design rooms, and Bosphorus mansions.",
    title: "Sultanahmet, Pera, Karakoy, and the Bosphorus",
    description:
      "Istanbul hotels change the trip by district: monument access in Sultanahmet, grand-hotel history in Pera, design-led Beyoglu rooms, Karakoy waterfront luxury, Bosphorus palace scale, or a quieter mansion north of the center. The right stay is a tradeoff between sleep, water, and movement.",
    url: "https://www.google.com/maps/search/best+hotels+istanbul",
    category: "Stay",
    location: cityLocation,
    creator: creator("Stay"),
    upvotes: 0,
    createdAt,
    stops: hotelStops,
    sources: [
      source("Four Seasons Sultanahmet official", "https://www.fourseasons.com/istanbul/"),
      source("Pera Palace official", "https://perapalace.com/en/"),
      source("Soho House Istanbul official", "https://www.sohohouse.com/en-us/houses/soho-house-istanbul"),
      source("The Peninsula Istanbul official", "https://www.peninsula.com/en/istanbul/5-star-luxury-hotel-karakoy"),
      source("Kocatas Mansions Istanbul official", "https://www.anantara.com/en/kocatas-mansions-istanbul"),
      source("Ciragan Palace Kempinski official", "https://www.kempinski.com/en/ciragan-palace"),
      source("Shangri-La Bosphorus official", "https://www.shangri-la.com/istanbul/shangrila/"),
      source("Raffles Istanbul official", "https://www.raffles.com/istanbul/"),
      source("The Bank Hotel Istanbul official", "https://www.thebankhotelistanbul.com/en"),
      source("Ajwa Sultanahmet official", "https://www.ajwa.com.tr/en"),
      source("Conde Nast Traveler Istanbul hotels", "https://www.cntraveler.com/gallery/best-hotels-in-istanbul"),
      source("Booking.com Istanbul hotels", "https://www.booking.com/city/tr/istanbul.html"),
    ],
  },
  {
    id: "list-istanbul-citywide-hostels",
    slug: "istanbul-best-hostels-citywide",
    seoSlug: "best-hostels",
    seoTitle: "Best Hostels in Istanbul",
    seoDescription:
      "Best hostels in Istanbul, comparing Sultanahmet backpacker bases, Taksim social hostels, Kadikoy dorms, private rooms, rooftops, and ferry-friendly locations.",
    title: "Hostel Bases Across Both Sides",
    description:
      "Istanbul hostels divide by the side of town they make easy: old-city sightseeing, Taksim and Galata nightlife, Karakoy design edges, or Kadikoy market life. Dorms, private rooms, rooftops, and front-desk hours matter because the cheapest bed can change the whole route.",
    url: "https://www.google.com/maps/search/best+hostels+istanbul",
    category: "Stay",
    location: cityLocation,
    creator: creator("Stay"),
    upvotes: 0,
    createdAt,
    stops: hostelStops,
    sources: [
      source("Cheers Hostel official", "https://www.cheershostel.com/"),
      source("Bahaus Guesthouse Hostel official", "https://bahaushostel.com/"),
      source("Wabi Hostels official", "https://www.wabihostels.com/en/"),
      source("Hush Hostels official", "https://hushhostels.com/"),
      source("Second Home Hostel official", "https://www.secondhomehostel.com/"),
      source("Yolo Hostel Hostelworld", "https://www.hostelworld.com/hostels/p/296549/yolo-hostel-kadikoy/"),
      source("Archeo official", "https://www.archeopol.com/"),
      source("Le Banc Hostel official", "https://lebancistanbul.com/"),
      source("Stanpoli Hostel official", "https://www.stanpolihostel.com/"),
      source("Hanchi Hostel official", "https://www.hanchihostel.com/"),
      source("Hostelworld Istanbul hostels", "https://www.hostelworld.com/st/hostels/europe/turkey/istanbul/"),
      source("Booking.com Istanbul hostels", "https://www.booking.com/hostels/city/tr/istanbul.html"),
    ],
  },
] satisfies MapList[];
