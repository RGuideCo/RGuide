import type { GuideStop, ListCategory, ListSource, MapList } from "@/types";

const createdAt = "2026-08-26T00:00:00.000Z";
const checkedAt = "2026-08-26";
const tourism = "https://danangfantasticity.com/en";
const michelin2026 =
  "https://danangfantasticity.com/en/discovery/complete-guide-to-michelin-recognized-restaurants-in-da-nang-2026";
const hostelworld = "https://www.hostelworld.com/hostels/asia/vietnam/da-nang/";

const location = {
  city: "Danang",
  country: "Vietnam",
  continent: "Asia",
  scope: "city" as const,
};
type StopHours = NonNullable<GuideStop["hours"]>;
type StopInput = {
  id: string;
  name: string;
  coordinates: [number, number];
  description: string;
  officialUrl: string;
  hours: StopHours;
  photo?: string;
  bookingUrl?: string;
  editorialUrls?: string[];
  mapQuery?: string;
  price?: GuideStop["price"];
  priceSource?: string;
  venueKind?: GuideStop["venueKind"];
  foodServiceType?: GuideStop["foodServiceType"];
  cuisineTypes?: string[];
  nightlifeType?: GuideStop["nightlifeType"];
  musicGenres?: string[];
  lodgingType?: GuideStop["lodgingType"];
  subcategory?: string;
  attributeTags?: string[];
};

const colors: Record<ListCategory, string> = {
  Food: "b45309",
  Nightlife: "7c3aed",
  Nature: "15803d",
  Culture: "0f766e",
  Stay: "0369a1",
  Activities: "be123c",
  Routes: "475569",
  Essentials: "475569",
};
function avatar(category: ListCategory) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160"><rect width="160" height="160" rx="80" fill="#${colors[category]}"/><text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle" font-family="Arial,sans-serif" font-size="76" font-weight="700" fill="white">R</text></svg>`)}`;
}
function source(name: string, url: string): ListSource {
  return { name, url };
}
function maps(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
function daily(hours: string, note?: string): StopHours {
  return { default: `Daily ${hours}${note ? `; ${note}` : ""}.` };
}
const hotelHours = daily(
  "open 24 hours",
  "guest services run continuously; restaurants, spas, pools, and holiday services follow the official property page",
);

const sourceImages: Record<string, string> = {
  "danang-dining-la-maison-1888":
    "https://www.danang.intercontinental.com/wp-content/uploads/2026/06/LMS-cover-michelin-2026.jpg-1024x529.jpeg",
  "danang-dining-si":
    "https://sidiningdanang.com/wp-content/uploads/2025/07/sid-431.jpg",
  "danang-dining-temptation":
    "https://thetemptation.com.vn/uploads/files/The-Temptation-Restaurant.jpg",
  "danang-dining-le-comptoir":
    "https://lecomptoirdng.com/wp-content/uploads/2025/02/BOMM0102-4.webp",
  "danang-dining-madame-lan":
    "https://madamelan.net/storage/trang-chu/img-5801.png",
  "danang-dining-luk-lak":
    "https://luklak.vn/wp-content/uploads/2023/12/IMG_7630-Large-1024x768.jpeg",
  "danang-dining-moc":
    "https://mocseafood.com/wp-content/uploads/rtytbdyrr.webp",
  "danang-dining-my-hanh":
    "https://myhanhseafood.vn/wp-content/uploads/2024/01/bn-mh.jpg",
  "danang-dining-olivias-prime":
    "https://oliviasprime.com/web/image/845-76c46bec/Olivias-Prime-Steakhouse-main-entrance.jpg",
  "danang-dining-bep-cuon":
    "https://cdn.shopify.com/s/files/1/0740/8392/6321/files/342209430_2647966652011547_5903305013540972054_n.jpg?v=1739157393",
  "danang-cheap-ba-duong":
    "https://www.foodtourdanang.vn/public/upload/product/345835332-199615102959941-8393104979539376240-n-KiA3UPZEnl.jpg",
  "danang-cheap-bun-cha-ca-109":
    "https://foodtourdanang.vn/public/upload/product/342606703-744538307165689-2891429890010248891-n-Nh5T1niq6L.jpg",
  "danang-cheap-bun-cha-ca-hon":
    "https://www.foodtourdanang.vn/public/upload/product/af1qipoiwmmbazoyzakrzdbgp6tdfjt8pccky50dlhacs560-k-no-GvQvcvcFlz.jpg",
  "danang-cheap-hong-van":
    "https://axwwgrkdco.cloudimg.io/v7/__gmpics3__/8e802149bbea41adb30f5fb446eddb2f.jpeg?width=1000",
  "danang-cheap-ba-thuong":
    "https://axwwgrkdco.cloudimg.io/v7/__gmpics3__/ebb138b73b494ef2bbddca89286478b4.jpeg?width=1000",
  "danang-cheap-banh-canh-yen":
    "https://foodtourdanang.vn/public/upload/product/af1qipp8ze3emlujoh2cs51jrlyaurphukoueexruk8uw435-h652-p-k-no-HTLMcpMG0O.jpg",
  "danang-cheap-mi-quang-1a":
    "https://foodtourdanang.vn/public/upload/product/my-quang-1a-hai-phong-3-cDp5YXMM4K.jpg",
  "danang-cheap-banh-xeo-76":
    "https://dulichvietnam.com.vn/vnt_upload/news/06_2025/nha_hang_bib_gourmand_michelin_moi_o_da_nang_2025_d.jpg",
  "danang-cheap-an-thoi":
    "https://vnguide.vn/uploads/0000/11/2024/09/15/anthoi.jpg",
  "danang-cheap-nu-do":
    "https://axwwgrkdco.cloudimg.io/v7/__gmpics3__/db21b467b3a9468fb42ed896b61a7211.jpeg",
  "danang-hotel-intercontinental":
    "https://www.danang.intercontinental.com/wp-content/uploads/2024/02/Intercontinental-Danang-6901.jpg",
  "danang-hotel-tia":
    "https://tiawellnessresort.com/wp-content/uploads/2026/02/TIA-Wellness-Resort.webp",
  "danang-hotel-hyatt":
    "https://assets.hyatt.com/content/dam/hyatt/hyattdam/images/2017/04/10/1203/Hyatt-Regency-Danang-Resort-and-Spa-P298-Exterior-Aerial.jpg/Hyatt-Regency-Danang-Resort-and-Spa-P298-Exterior-Aerial.16x9.jpg?imwidth=1280",
  "danang-hotel-furama":
    "https://furamavietnam.com/wp-content/uploads/2025/01/01.-Exterior-Furama-5-1.jpg",
  "danang-hotel-naman":
    "https://namanbackend.mpoint.vn/uploads/images/background_homepage.jpg",
  "danang-hotel-premier-village":
    "https://www.uncovervietnam.com/wp-content/uploads/2021/06/Premier-Village-Danang-Resort.jpeg",
  "danang-hotel-m":
    "https://mhotel.vn/wp-content/uploads/2022/12/m-hotel-4-3-no-scaled.jpg",
  "danang-hotel-wink-centre":
    "https://wink-hotels.com/wp-content/uploads/2024/10/Hero-banner-3-1024x569.jpg",
  "danang-hotel-sala":
    "https://salahotelgroup.com/wp-content/uploads/2021/10/Untitled-design-12.png",
  "danang-hotel-four-points":
    "https://res.cloudinary.com/pleasant-holidays/image/upload/f_auto/q_auto/v1/Hotels/4DG/4dg-main.jpg",
  "danang-hostel-alolivier":
    "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/3/332846/hidglxp7fzifcnydn1jo.jpg",
  "danang-hostel-seahorse-signature":
    "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/3/319754/fbg6kuczzi7j8b9ixzsp.jpg",
  "danang-hostel-sujet-beach":
    "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/3/334340/udfx4sjivorgiysbjhd3.jpg",
  "danang-hostel-memory":
    "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/3/336958/q18twbdmikplswrlnrt0.jpg",
  "danang-hostel-garden-capsule":
    "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/3/318650/rvopykpijoyqn5h59jnd.jpg",
  "danang-hostel-tropical-dorm":
    "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/3/334118/hs2yqa1rwrk766xdjvmw.jpg",
  "danang-hostel-lighthouse":
    "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/2/286704/psdu0ifmbojhe4pecdsu.jpg",
  "danang-hostel-dorm-beachside":
    "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/3/339341/lovnreqs6mzli6dh8cgy.jpg",
  "danang-hostel-dorm-garden":
    "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/3/337766/qwhhaog6rtxpkf062nei.jpg",
  "danang-hostel-sujet-residence":
    "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/3/331798/tr5w9khcla3fkzlanbm8.jpg",
  "danang-bar-7-bridges":
    "https://static.wixstatic.com/media/d6f911_fb7644a621d34d109caebec719236df9~mv2.jpg/v1/fit/w_2500,h_1330,al_c/d6f911_fb7644a621d34d109caebec719236df9~mv2.jpg",
  "danang-bar-section30":
    "https://static.wixstatic.com/media/131df8_c9855db2c64b49b9bb8373b4809afa0c~mv2.jpg/v1/fill/w_980,h_653,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/131df8_c9855db2c64b49b9bb8373b4809afa0c~mv2.jpg",
  "danang-bar-bamboo2":
    "https://bamboo2bar.com/airo-assets/images/components/bamboo-aboutsection/bamboo-2-bar-interior-sports-bar-da-nang",
  "danang-bar-shamrock":
    "https://shamrocksportsbar.com/wp-content/uploads/2025/04/bar-08-2.png",
  "danang-bar-hannah":
    "https://graph.facebook.com/hannahpub/picture?type=large",
  "danang-bar-embassy":
    "https://embassyirishsportsbar.com/meta/link-preview.jpg",
  "danang-bar-chevy":
    "https://danangleisure.com/wp-content/uploads/2023/06/Chevy-Sports-Bar-and-Bistro-Danang-1-1024x548.jpg",
  "danang-bar-dirty-fingers":
    "https://dirtyfingersdanang.com/wp-content/uploads/2025/07/lucy_DF_SITE_Identity2.jpg",
  "danang-bar-mad-den":
    "https://themaddenirishbardanang.com/wp-content/uploads/2024/12/IMG_20240708_210844_960.jpg",
  "danang-bar-1920s":
    "https://chillvietnam.com/wp-content/uploads/2022/10/the-1920s-lounge-danh-cho-nhung-tam-hon-yeu-su-co-dien-1666040480-1024x681.jpg",
  "danang-cocktail-libre":
    "https://toplist.vn/images/800px/bar-libre-da-nang-805250.jpg",
  "danang-cocktail-do-yeu":
    "https://images.squarespace-cdn.com/content/v1/680c5bc962893f26952736f0/85c35398-24aa-4a1a-9b6a-1cc5f93e611c/bar%2B%C4%91%E1%BB%93%2By%C3%AAu.jpg",
  "danang-cocktail-black-wolf":
    "https://ghiendanang.com/wp-content/uploads/2025/02/black-wolf-bespoke-cocktail-bar-1.jpg",
  "danang-cocktail-makara":
    "https://danangleisure.com/wp-content/uploads/2023/08/Makara-Tropical-Cocktail-Bar-in-Da-Nang-2.jpg",
  "danang-cocktail-te":
    "https://danangleisure.com/wp-content/uploads/2022/10/Te-Bar-2-1024x683.jpg",
  "danang-cocktail-craftsman":
    "https://danang365.com/wp-content/uploads/2024/10/image-12-1024x683.png",
  "danang-cocktail-ket-high":
    "https://kalakalabeachclub.com/wp-content/uploads/2026/06/cocktail-bars-in-da-nang-5.jpg",
  "danang-cocktail-linger": "https://lingerbespoke.com/preview.jpg",
  "danang-cocktail-united":
    "https://www.foodtourdanang.vn/public/upload/product/271247307-5356378244428138-4358052308209901977-n-xBFZp22Ffo.jpg",
  "danang-cocktail-sky36":
    "https://sky36.vn/wp-content/uploads/2026/04/Sky36.6.2-124-scaled-1.jpg",
  "danang-culture-cham-museum":
    "https://danangfantasticity.com/wp-content/uploads/2020/07/tong-quan-bao-tang-dieu-khac-cham-da-nang-01.jpg",
  "danang-culture-city-museum":
    "https://danangfantasticity.com/wp-content/uploads/2025/12/bao-tang-da-nang-concept-1024x682.jpg",
  "danang-culture-fine-arts":
    "https://danangfantasticity.com/wp-content/uploads/2019/08/tong-quan-bao-tang-my-thuat-da-nang-78-le-duan-danang-fantasticity-com.jpg",
  "danang-culture-military-zone-5":
    "https://danangfantasticity.com/wp-content/uploads/2015/09/bao-tang-ho-chi-minh-chi-nhanh-quan-khu-5-010.jpg",
  "danang-culture-dong-dinh":
    "https://danangfantasticity.com/wp-content/uploads/2018/07/bao-tang-dong-dinh-dong-dinh-museum-%E3%83%89%E3%83%B3%E3%83%87%E3%82%A3%E3%83%B3%E5%8D%9A%E7%89%A9%E9%A4%A8-01.jpg",
  "danang-culture-buddhist-museum":
    "https://danangfantasticity.com/wp-content/uploads/2016/07/Buddist-Museum-01.jp3_.jpg",
  "danang-culture-cathedral":
    "https://capannam.com/wp-content/uploads/2020/04/la-cathedrale-da-nang.jpg",
  "danang-culture-non-nuoc-village":
    "https://explorevietnam.com.vn/da-nang/wp-content/uploads/2024/01/Champa-and-Vietnamese-cultures.png",
  "danang-culture-linh-ung":
    "https://danangfantasticity.com/wp-content/uploads/2015/09/linh-ung-pagoda-002.jpg",
  "danang-culture-marble-mountains":
    "https://danangfantasticity.com/wp-content/uploads/2015/09/di-tich-cap-quoc-gia-dac-biet-danh-thang-ngu-hanh-son.jpg",
  "danang-activity-my-khe":
    "https://sun-ecommerce-cdn.azureedge.net/ecommerce/service-sites/asset/SunParadiseLandPhuQuoc/google-doc/post_id_11357/AD_4nXdFRWCCjYqGNCO1zsbSK2Ojo-7iMvz0gx3Lc8cXgGutzl8reunQwNYgIKeO-lkJReKUbLEsIin4SwgKlWZg7KCSt_c8eCB86uJdxJovYyd6uH6_drX1zJi_f8reojCjgt4-fC25UZZNG0FOkowr7EQEXAzinA.webp",
  "danang-activity-marble-mountains":
    "https://danangfantasticity.com/wp-content/uploads/2015/09/di-tich-cap-quoc-gia-dac-biet-danh-thang-ngu-hanh-son.jpg",
  "danang-activity-son-tra":
    "https://danangfantasticity.com/wp-content/uploads/2025/08/ban-dao-son-tra-thanh-pho-da-nang.jpg",
  "danang-activity-linh-ung":
    "https://danangfantasticity.com/wp-content/uploads/2015/09/linh-ung-pagoda-002.jpg",
  "danang-activity-ba-na":
    "https://sun-ecommerce-cdn.azureedge.net/ecommerce/service-sites/asset/SunWorldBaNaHill/swold/sun-world-ba-na-hills-chinh-thuc-hoat-dong-tro-lai-tu-ngay-20-9-2020html/sun-world-ba-na-hills-chinh-thuc-hoat-dong-tro-lai-covid-19-1024x576.jpg",
  "danang-activity-dragon-bridge":
    "https://danangfantasticity.com/wp-content/uploads/2025/03/1-cau-rong-phun-lua-va-nuoc-vao-moi-thu-6-7-cn-hang-tuan-tai-da-nang.jpg",
  "danang-activity-son-tra-market":
    "https://danangfantasticity.com/wp-content/uploads/2023/10/nhung-khu-cho-noi-tieng-tai-da-nang-khong-the-bo-qua-scaled.jpg",
  "danang-activity-cham-museum":
    "https://danangfantasticity.com/wp-content/uploads/2020/07/tong-quan-bao-tang-dieu-khac-cham-da-nang-01.jpg",
  "danang-activity-downtown":
    "https://danangdowntown.com/wp-content/uploads/2026/04/Tong-the-Da-Nang-Downtown-voi-quy-hoach-hien-dai-ket-hop-hai-hoa-giua-khong-gian-giai-tri-va-canh-quan-thien-nhien-ven-song.png",
  "danang-activity-hai-van":
    "https://danangfantasticity.com/wp-content/uploads/2025/08/deo-hai-van-thien-ha-de-nhat-hung-quan-da-nang-0005.jpg",
};
function hostelHours(checkIn: string): StopHours {
  return {
    default: `Daily accommodation operations; check-in ${checkIn}. Reception coverage, late-arrival rules, and room availability follow the linked Hostelworld property page.`,
  };
}

function stop(input: StopInput): GuideStop {
  const mapUrl = maps(input.mapQuery ?? `${input.name} Da Nang Vietnam`);
  const photo = input.photo ?? sourceImages[input.id] ?? input.officialUrl;
  const evidence = [
    input.officialUrl,
    input.bookingUrl,
    mapUrl,
    photo,
    ...(input.editorialUrls ?? []),
  ].filter(Boolean) as string[];
  return {
    id: input.id,
    name: input.name,
    coordinates: input.coordinates,
    description: input.description,
    officialUrl: input.officialUrl,
    bookingUrl: input.bookingUrl,
    hours: input.hours,
    photo,
    imageSourceUrl: photo,
    price: input.price,
    priceSource: input.priceSource,
    venueKind: input.venueKind,
    foodServiceType: input.foodServiceType,
    cuisineTypes: input.cuisineTypes,
    nightlifeType: input.nightlifeType,
    musicGenres: input.musicGenres,
    lodgingType: input.lodgingType,
    subcategory: input.subcategory,
    attributeTags: input.attributeTags,
    sourceUrls: [...new Set(evidence)],
    sourceEvidence: {
      officialUrl: input.officialUrl,
      mapUrl,
      currentStatusUrl: mapUrl,
      imageSourceUrl: photo,
      editorialUrls: input.editorialUrls ?? [],
      platformUrls: input.bookingUrl ? [input.bookingUrl] : [],
      checkedAt,
      notes:
        "Official/property evidence, current map status, opening schedule, and a source image candidate were checked on 2026-08-26; venue media is normalized through the reviewed R2 pipeline.",
    },
  };
}

const diningStops = [
  stop({
    id: "danang-dining-la-maison-1888",
    name: "La Maison 1888",
    coordinates: [16.1219, 108.3073],
    description:
      "Pierre Gagnaire's dining room at InterContinental Danang pairs French technique with Vietnamese produce in a dramatic Bill Bensley resort setting above Son Tra Bay.",
    officialUrl:
      "https://www.danang.intercontinental.com/dining/la-maison-1888/",
    hours: daily(
      "6:30 PM-9:30 PM",
      "reservations and seasonal menus follow the official dining page",
    ),
    price: "$$$$",
    priceSource: "Official restaurant page / MICHELIN Guide 2026",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["french", "fine_dining", "tasting_menu"],
    attributeTags: [
      "fine_dining",
      "destination_dining",
      "reservation_recommended",
      "splurge_food",
    ],
    editorialUrls: [michelin2026],
  }),
  stop({
    id: "danang-dining-si",
    name: "Si Dining",
    coordinates: [16.0429, 108.2424],
    description:
      "Si Dining uses Italian technique, local seafood, and a leafy riverside villa to deliver polished tasting menus without a formal hotel-restaurant atmosphere.",
    officialUrl: "https://sidiningdanang.com/",
    hours: daily(
      "5:30 PM-9:30 PM",
      "the official reservation calendar controls seating availability",
    ),
    price: "$$$$",
    priceSource: "Official booking page / MICHELIN Guide 2026",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["italian", "contemporary", "tasting_menu"],
    attributeTags: [
      "fine_dining",
      "date_night",
      "reservation_recommended",
      "scenic_food",
    ],
    editorialUrls: [michelin2026],
  }),
  stop({
    id: "danang-dining-temptation",
    name: "The Temptation",
    coordinates: [16.0507, 108.2434],
    description:
      "Chef-led French cooking, precise sauces, and seasonal Vietnamese ingredients make The Temptation a compact alternative to Danang's larger luxury dining rooms.",
    officialUrl: "https://thetemptation.com.vn/",
    hours: {
      default:
        "The official reservation page controls holidays and private events.",
      mon: "6:00 PM-10:00 PM",
      tue: "11:00 AM-2:00 PM; 6:00 PM-10:00 PM",
      wed: "11:00 AM-2:00 PM; 6:00 PM-10:00 PM",
      thu: "11:00 AM-2:00 PM; 6:00 PM-10:00 PM",
      fri: "11:00 AM-2:00 PM; 6:00 PM-10:00 PM",
      sat: "11:00 AM-2:00 PM; 6:00 PM-10:00 PM",
      sun: "11:00 AM-2:00 PM; 6:00 PM-10:00 PM",
    },
    price: "$$$$",
    priceSource: "Official restaurant page / MICHELIN Guide 2026",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["french", "contemporary", "fine_dining"],
    attributeTags: [
      "fine_dining",
      "date_night",
      "reservation_recommended",
      "splurge_food",
    ],
    editorialUrls: [michelin2026],
  }),
  stop({
    id: "danang-dining-le-comptoir",
    name: "Le Comptoir",
    coordinates: [16.0501, 108.2418],
    description:
      "Le Comptoir serves modern French food in two tightly scheduled evening seatings, with a counter-scale room that keeps attention on the kitchen.",
    officialUrl: "https://lecomptoirdng.com/en/",
    hours: daily(
      "first seatings at 5:00 PM, 5:30 PM, or 6:00 PM; second seatings at 8:00 PM or 8:30 PM",
      "the reservation page controls available tables",
    ),
    price: "$$$$",
    priceSource: "Official reservation page / MICHELIN Guide 2026",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["french", "contemporary", "tasting_menu"],
    attributeTags: [
      "fine_dining",
      "reservation_recommended",
      "date_night",
      "tasting_menu",
    ],
    editorialUrls: [michelin2026],
  }),
  stop({
    id: "danang-dining-madame-lan",
    name: "Madame Lân",
    coordinates: [16.0752, 108.2228],
    description:
      "Madame Lân covers central Vietnamese standards in a large lantern-lit riverside complex, useful for groups wanting broad choice and comfortable service.",
    officialUrl: "https://madamelan.net/en",
    hours: daily(
      "6:30 AM-9:30 PM",
      "holiday services follow the official restaurant page",
    ),
    price: "$$",
    priceSource: "Official menu / MICHELIN Guide 2026",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["vietnamese", "central_vietnamese", "seafood"],
    attributeTags: [
      "group_friendly",
      "reservation_recommended",
      "scenic_food",
      "local_favorite",
    ],
    editorialUrls: [michelin2026],
  }),
  stop({
    id: "danang-dining-luk-lak",
    name: "LUK LAK Da Nang",
    coordinates: [16.0696, 108.2241],
    description:
      "LUK LAK presents regional Vietnamese dishes in a restored Bach Dang villa, balancing familiar flavors, careful plating, and an easy central location.",
    officialUrl: "https://luklak.vn/slideshow_home/luklak-da-nang/",
    hours: daily(
      "7:30 AM-10:00 PM",
      "private events and holidays follow the official page",
    ),
    price: "$$$",
    priceSource: "Official restaurant page / MICHELIN Guide 2026",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["vietnamese", "central_vietnamese", "modern_vietnamese"],
    attributeTags: [
      "group_friendly",
      "central",
      "reservation_recommended",
      "destination_dining",
    ],
    editorialUrls: [michelin2026],
  }),
  stop({
    id: "danang-dining-moc",
    name: "Mộc Quán Seafood",
    coordinates: [16.0606, 108.2399],
    description:
      "Mộc Quán turns a garden-like courtyard into a lively seafood room, with live tanks, grilled shellfish, hotpots, and late evening ordering.",
    officialUrl: "https://mocseafood.com/moc-da-nang",
    hours: daily("10:30 AM-11:45 PM", "last food orders are at 10:30 PM"),
    price: "$$$",
    priceSource: "Official menu / MICHELIN Guide 2026",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["vietnamese", "seafood", "grill"],
    attributeTags: ["seafood", "group_friendly", "lively_food", "late_night"],
    editorialUrls: [michelin2026],
  }),
  stop({
    id: "danang-dining-my-hanh",
    name: "Mỹ Hạnh Seafood",
    coordinates: [16.0718, 108.2447],
    description:
      "Mỹ Hạnh is a long-running beachfront seafood restaurant where tanks, whole fish, shellfish, and sea views matter more than minimalist presentation.",
    officialUrl: "https://myhanhseafood.vn/",
    hours: daily(
      "9:00 AM-11:00 PM",
      "same-day reservations and holiday services follow the official property page",
    ),
    price: "$$$",
    priceSource: "Official restaurant page / MICHELIN Guide 2026",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["vietnamese", "seafood", "central_vietnamese"],
    attributeTags: [
      "seafood",
      "scenic_food",
      "group_friendly",
      "reservation_recommended",
    ],
    editorialUrls: [michelin2026],
  }),
  stop({
    id: "danang-dining-olivias-prime",
    name: "Olivia's Prime Steakhouse",
    coordinates: [16.0652, 108.2411],
    description:
      "Olivia's Prime specializes in dry-aged steaks, imported cuts, and a serious wine list inside a polished room close to the riverfront bridges.",
    officialUrl:
      "https://oliviasprime.com/locations/oliviasprime-steakhouse-da-nang",
    hours: daily("11:00 AM-11:00 PM", "last food orders are at 10:00 PM"),
    price: "$$$$",
    priceSource: "Official menu / MICHELIN Guide 2026",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["steakhouse", "grill", "international"],
    attributeTags: [
      "splurge_food",
      "date_night",
      "reservation_recommended",
      "wine",
    ],
    editorialUrls: [michelin2026],
  }),
  stop({
    id: "danang-dining-bep-cuon",
    name: "Bếp Cuốn",
    coordinates: [16.0658, 108.2189],
    description:
      "Bếp Cuốn focuses on Vietnamese rolls, herbs, grilled meats, and shareable central-region dishes in a leafy courtyard that suits mixed groups.",
    officialUrl: "https://bepcuon.vn/",
    hours: daily(
      "10:00 AM-10:00 PM",
      "the official reservation page controls holiday schedules",
    ),
    price: "$$",
    priceSource: "Official menu / MICHELIN Guide 2026",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["vietnamese", "central_vietnamese", "grill"],
    attributeTags: [
      "group_friendly",
      "casual",
      "local_favorite",
      "reservation_recommended",
    ],
    editorialUrls: [michelin2026],
  }),
];

const cheapEatStops = [
  stop({
    id: "danang-cheap-ba-duong",
    name: "Bánh Xèo Bà Dưỡng",
    coordinates: [16.0567, 108.2154],
    description:
      "This alley institution serves crisp turmeric pancakes, pork skewers, herbs, rice paper, and its thick peanut-forward dipping sauce at relentless speed.",
    officialUrl: "https://www.foodtourdanang.vn/en/banh-xeo-ba-duong?food=56",
    hours: daily(
      "9:30 AM-9:30 PM",
      "Tet closures follow the linked city food page",
    ),
    price: "$",
    priceSource: "Da Nang Food Tour / MICHELIN Guide 2026",
    venueKind: "food_drink",
    foodServiceType: "counter_service",
    cuisineTypes: ["vietnamese", "banh_xeo", "nem_lui"],
    attributeTags: [
      "budget_food",
      "local_favorite",
      "walk_in_friendly",
      "lively_food",
    ],
    editorialUrls: [michelin2026],
  }),
  stop({
    id: "danang-cheap-bun-cha-ca-109",
    name: "Bún Chả Cá 109",
    coordinates: [16.0732, 108.2194],
    description:
      "Bún Chả Cá 109 builds a clear, savory noodle broth around springy fishcake, vegetables, and optional tuna at a central no-frills counter.",
    officialUrl: "https://foodtourdanang.vn/en/bun-cha-ca-109?food=0",
    hours: daily(
      "6:00 AM-10:00 PM",
      "holiday schedules follow the linked city food page",
    ),
    price: "$",
    priceSource: "Da Nang Food Tour / MICHELIN Guide 2026",
    venueKind: "food_drink",
    foodServiceType: "counter_service",
    cuisineTypes: ["vietnamese", "fishcake_noodles", "seafood"],
    attributeTags: [
      "budget_food",
      "breakfast",
      "walk_in_friendly",
      "local_favorite",
    ],
    editorialUrls: [michelin2026],
  }),
  stop({
    id: "danang-cheap-bun-cha-ca-hon",
    name: "Bún Chả Cá Hờn",
    coordinates: [16.0724, 108.2188],
    description:
      "Hờn's fishcake noodle soup is richer and busier than many breakfast bowls, with tuna, pumpkin, cabbage, and chili balanced in the broth.",
    officialUrl: "https://www.foodtourdanang.vn/en/bun-cha-ca-hon?food=55",
    hours: daily(
      "6:00 AM-10:30 PM",
      "holiday schedules follow the linked city food page",
    ),
    price: "$",
    priceSource: "Da Nang Food Tour / MICHELIN Guide 2026",
    venueKind: "food_drink",
    foodServiceType: "counter_service",
    cuisineTypes: ["vietnamese", "fishcake_noodles", "seafood"],
    attributeTags: [
      "budget_food",
      "breakfast",
      "walk_in_friendly",
      "late_night",
    ],
    editorialUrls: [michelin2026],
  }),
  stop({
    id: "danang-cheap-hong-van",
    name: "Mỳ Quảng Sứa Hồng Vân",
    coordinates: [16.0644, 108.2184],
    description:
      "Hồng Vân's uncommon jellyfish mì Quảng adds cool crunch to soft noodles, herbs, peanuts, rice cracker, and a restrained spoonful of broth.",
    officialUrl:
      "https://www.foodtourdanang.vn/en/mon-my-quang-tru-danh-cua-xu-quang",
    hours: daily(
      "6:00 AM-1:00 PM",
      "the kitchen closes when the morning batch sells out",
    ),
    price: "$",
    priceSource: "Da Nang Food Tour / MICHELIN Guide 2026",
    venueKind: "food_drink",
    foodServiceType: "counter_service",
    cuisineTypes: ["vietnamese", "mi_quang", "jellyfish"],
    attributeTags: ["budget_food", "breakfast", "local_favorite", "seafood"],
    editorialUrls: [michelin2026],
  }),
  stop({
    id: "danang-cheap-ba-thuong",
    name: "Bún Bò Huế Bà Thương",
    coordinates: [16.0675, 108.2205],
    description:
      "More than fifty years of practice show in Bà Thương's lemongrass-rich Huế broth, tender beef, pork, herbs, and disciplined morning-only service.",
    officialUrl:
      "https://www.foodtourdanang.vn/en/danh-sach-cac-co-so-an-uong-dat-chuan-michelin-guide-tai-da-nang-nam-2025",
    hours: daily(
      "6:00 AM-11:00 AM",
      "morning stock can sell out before closing",
    ),
    price: "$",
    priceSource: "Da Nang Food Tour / MICHELIN Guide",
    venueKind: "food_drink",
    foodServiceType: "counter_service",
    cuisineTypes: ["vietnamese", "bun_bo_hue", "noodles"],
    attributeTags: [
      "budget_food",
      "breakfast",
      "local_favorite",
      "walk_in_friendly",
    ],
    editorialUrls: [michelin2026],
  }),
  stop({
    id: "danang-cheap-banh-canh-yen",
    name: "Bánh Canh Yến",
    coordinates: [16.0545, 108.2127],
    description:
      "Yến serves chewy bánh canh noodles with snakehead fish, fishcake, quail egg, and a hot savory broth in a fast local dining room.",
    officialUrl: "https://foodtourdanang.vn/en/banh-canh-yen?food=134",
    hours: daily(
      "6:00 AM-10:00 PM",
      "holiday schedules follow the linked city food page",
    ),
    price: "$",
    priceSource: "Da Nang Food Tour / MICHELIN Guide 2026",
    venueKind: "food_drink",
    foodServiceType: "counter_service",
    cuisineTypes: ["vietnamese", "banh_canh", "snakehead_fish"],
    attributeTags: [
      "budget_food",
      "breakfast",
      "walk_in_friendly",
      "local_favorite",
    ],
    editorialUrls: [michelin2026],
  }),
  stop({
    id: "danang-cheap-mi-quang-1a",
    name: "Mì Quảng 1A",
    coordinates: [16.0738, 108.2175],
    description:
      "Mì Quảng 1A is the central benchmark for turmeric noodles, shrimp, pork, herbs, peanuts, rice cracker, and just enough concentrated broth.",
    officialUrl: "https://foodtourdanang.vn/en/mi-quang-1a?food=134",
    hours: daily(
      "6:30 AM-9:00 PM",
      "Tet closures follow the linked city food page",
    ),
    price: "$",
    priceSource: "Da Nang Food Tour / MICHELIN Guide 2026",
    venueKind: "food_drink",
    foodServiceType: "counter_service",
    cuisineTypes: ["vietnamese", "mi_quang", "central_vietnamese"],
    attributeTags: [
      "budget_food",
      "breakfast",
      "local_favorite",
      "walk_in_friendly",
    ],
    editorialUrls: [michelin2026],
  }),
  stop({
    id: "danang-cheap-banh-xeo-76",
    name: "Bánh Xèo 76",
    coordinates: [16.0389, 108.2431],
    description:
      "A charcoal grill at the entrance supplies smoky pork for crisp bánh xèo, corn rolls, herbs, noodles, and bright dipping sauce.",
    officialUrl:
      "https://www.foodtourdanang.vn/en/danh-sach-cac-co-so-an-uong-dat-chuan-michelin-guide-tai-da-nang-nam-2025",
    hours: daily(
      "10:00 AM-9:00 PM",
      "holiday schedules follow the linked city food page",
    ),
    price: "$",
    priceSource: "Da Nang Food Tour / MICHELIN Guide",
    venueKind: "food_drink",
    foodServiceType: "counter_service",
    cuisineTypes: ["vietnamese", "banh_xeo", "grilled_pork"],
    attributeTags: [
      "budget_food",
      "walk_in_friendly",
      "local_favorite",
      "lunch",
    ],
    editorialUrls: [michelin2026],
  }),
  stop({
    id: "danang-cheap-an-thoi",
    name: "Ăn Thôi",
    coordinates: [16.0685, 108.2243],
    description:
      "Ăn Thôi offers central Vietnamese home cooking, rice plates, noodles, and shared dishes in a colorful riverside room at moderate prices.",
    officialUrl: "https://www.foodtourdanang.vn/en/an-thoi-restaurant",
    hours: daily(
      "10:00 AM-10:00 PM",
      "holiday schedules follow the linked city food page",
    ),
    price: "$$",
    priceSource: "Da Nang Food Tour / MICHELIN Guide 2026",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["vietnamese", "central_vietnamese", "home_style"],
    attributeTags: [
      "budget_food",
      "group_friendly",
      "central",
      "walk_in_friendly",
    ],
    editorialUrls: [michelin2026],
  }),
  stop({
    id: "danang-cheap-nu-do",
    name: "Nú Đồ Kitchen",
    coordinates: [16.0398, 108.2433],
    description:
      "Nú Đồ Kitchen treats familiar Vietnamese noodles and rice dishes with chef-led care while keeping portions, pricing, and the small room approachable.",
    officialUrl: "https://www.foodtourdanang.vn/en/nu-do-kitchen",
    hours: daily(
      "9:00 AM-4:30 PM",
      "the official social page controls menu sell-outs and holidays",
    ),
    price: "$$",
    priceSource: "Da Nang Food Tour / MICHELIN Guide 2026",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["vietnamese", "modern_vietnamese", "noodles"],
    attributeTags: [
      "budget_food",
      "lunch",
      "local_favorite",
      "walk_in_friendly",
    ],
    editorialUrls: [michelin2026],
  }),
];

const hotelStops = [
  stop({
    id: "danang-hotel-intercontinental",
    name: "InterContinental Danang Sun Peninsula Resort",
    coordinates: [16.1219, 108.3073],
    description:
      "Bill Bensley's hillside resort layers private beach access, cable-car transfers, major restaurants, spa facilities, and expansive Son Tra Bay views.",
    officialUrl: "https://www.danang.intercontinental.com/",
    bookingUrl:
      "https://www.booking.com/hotel/vn/intercontinental-danang-sun-peninsula-resort.html",
    hours: hotelHours,
    price: "$$$$",
    priceSource: "Official booking page / Booking.com",
    venueKind: "lodging",
    lodgingType: "hotel",
    subcategory: "luxury_resort",
    attributeTags: ["luxury", "beach", "scenic", "spa", "romantic"],
  }),
  stop({
    id: "danang-hotel-tia",
    name: "TIA Wellness Resort",
    coordinates: [16.0373, 108.2551],
    description:
      "TIA builds its beachfront stay around private-pool villas, included spa treatments, wellness programming, plant-forward dining, and a deliberately quiet atmosphere.",
    officialUrl: "https://tiawellnessresort.com/",
    bookingUrl: "https://www.booking.com/hotel/vn/fusion-maia-resort.html",
    hours: hotelHours,
    price: "$$$$",
    priceSource: "Official booking page / Booking.com",
    venueKind: "lodging",
    lodgingType: "hotel",
    subcategory: "wellness_resort",
    attributeTags: ["luxury", "beach", "spa", "quiet", "romantic"],
  }),
  stop({
    id: "danang-hotel-hyatt",
    name: "Hyatt Regency Danang Resort and Spa",
    coordinates: [16.0069, 108.2648],
    description:
      "This broad Non Nuoc beachfront property combines hotel rooms, residences, several pools, family facilities, restaurants, and a substantial spa complex.",
    officialUrl:
      "https://www.hyatt.com/hyatt-regency/en-US/danhr-hyatt-regency-danang-resort-and-spa",
    bookingUrl:
      "https://www.booking.com/hotel/vn/hyatt-regency-danang-resort-and-spa.html",
    hours: hotelHours,
    price: "$$$$",
    priceSource: "Official booking page / Booking.com",
    venueKind: "lodging",
    lodgingType: "hotel",
    subcategory: "beach_resort",
    attributeTags: ["luxury", "beach", "family_friendly", "spa", "pool"],
  }),
  stop({
    id: "danang-hotel-furama",
    name: "Furama Resort Danang",
    coordinates: [16.0396, 108.2492],
    description:
      "Furama is an established beachfront resort with mature gardens, lagoon pools, multiple restaurants, and quick access to both My Khe and the city.",
    officialUrl: "https://furamavietnam.com/",
    bookingUrl: "https://www.booking.com/hotel/vn/furama-resort-danang.html",
    hours: hotelHours,
    price: "$$$$",
    priceSource: "Official booking page / Booking.com",
    venueKind: "lodging",
    lodgingType: "hotel",
    subcategory: "beach_resort",
    attributeTags: ["luxury", "beach", "family_friendly", "pool", "spa"],
  }),
  stop({
    id: "danang-hotel-naman",
    name: "Naman Retreat",
    coordinates: [15.9722, 108.2809],
    description:
      "Bamboo architecture, private villas, a long beach, spa rituals, and a calm southern setting distinguish Naman from Danang's busier central resorts.",
    officialUrl: "https://namanretreat.com/",
    bookingUrl: "https://www.booking.com/hotel/vn/naman-retreat.html",
    hours: hotelHours,
    price: "$$$$",
    priceSource: "Official booking page / Booking.com",
    venueKind: "lodging",
    lodgingType: "hotel",
    subcategory: "design_resort",
    attributeTags: ["luxury", "beach", "spa", "quiet", "design"],
  }),
  stop({
    id: "danang-hotel-premier-village",
    name: "Premier Village Danang Resort",
    coordinates: [16.0456, 108.2495],
    description:
      "Premier Village centers on multi-bedroom pool villas and direct beach access, making it strongest for families or groups needing shared private space.",
    officialUrl: "https://all.accor.com/hotel/9530/index.en.shtml",
    bookingUrl:
      "https://www.booking.com/hotel/vn/premier-village-danang-resort-managed-by-accor.html",
    hours: hotelHours,
    price: "$$$$",
    priceSource: "Official Accor page / Booking.com",
    venueKind: "lodging",
    lodgingType: "hotel",
    subcategory: "villa_resort",
    attributeTags: [
      "luxury",
      "beach",
      "family_friendly",
      "group_friendly",
      "private_pool",
    ],
  }),
  stop({
    id: "danang-hotel-m",
    name: "M Hotel Danang",
    coordinates: [16.0681, 108.2447],
    description:
      "M Hotel pairs a contemporary beachfront tower, rooftop pool, ocean-facing rooms, and streamlined design with immediate access to My Khe promenade.",
    officialUrl: "https://mhoteldanang.com/",
    bookingUrl: "https://www.booking.com/hotel/vn/m-danang.html",
    hours: hotelHours,
    price: "$$$",
    priceSource: "Official booking page / Booking.com",
    venueKind: "lodging",
    lodgingType: "hotel",
    subcategory: "design_hotel",
    attributeTags: ["beach", "scenic", "design", "pool", "central"],
  }),
  stop({
    id: "danang-hotel-wink-centre",
    name: "Wink Hotel Danang Centre",
    coordinates: [16.0687, 108.2234],
    description:
      "Wink's compact rooms, twenty-four-hour common spaces, laundry, gym, and central riverbank position suit short stays built around the city rather than a resort.",
    officialUrl: "https://wink-hotels.com/en/hotel/wink-hotel-danang-centre/",
    bookingUrl: "https://www.booking.com/hotel/vn/wink-danang-centre.html",
    hours: hotelHours,
    price: "$$",
    priceSource: "Official booking page / Booking.com",
    venueKind: "lodging",
    lodgingType: "hotel",
    subcategory: "lifestyle_hotel",
    attributeTags: ["central", "design", "value", "business", "gym"],
  }),
  stop({
    id: "danang-hotel-sala",
    name: "SALA Danang Beach Hotel",
    coordinates: [16.0579, 108.2452],
    description:
      "SALA offers an infinity pool, sea-facing rooms, family suites, and a My Khe location that remains convenient for the river bridges.",
    officialUrl: "https://salahotelgroup.com/",
    bookingUrl: "https://www.booking.com/hotel/vn/sala-danang-beach.html",
    hours: hotelHours,
    price: "$$$",
    priceSource: "Official booking page / Booking.com",
    venueKind: "lodging",
    lodgingType: "hotel",
    subcategory: "beach_hotel",
    attributeTags: ["beach", "scenic", "pool", "family_friendly", "central"],
  }),
  stop({
    id: "danang-hotel-four-points",
    name: "Four Points by Sheraton Danang",
    coordinates: [16.0785, 108.2451],
    description:
      "Four Points provides dependable full-service rooms, a rooftop pool, spa, and broad bay views from the quieter northern end of My Khe.",
    officialUrl:
      "https://www.marriott.com/en-us/hotels/dadfp-four-points-danang/overview/",
    bookingUrl:
      "https://www.booking.com/hotel/vn/four-points-by-sheraton-danang.html",
    hours: hotelHours,
    price: "$$$",
    priceSource: "Official Marriott page / Booking.com",
    venueKind: "lodging",
    lodgingType: "hotel",
    subcategory: "full_service_hotel",
    attributeTags: ["beach", "scenic", "pool", "spa", "business"],
  }),
];

const hostelStops = [
  stop({
    id: "danang-hostel-alolivier",
    name: "A L'Olivier Hostel",
    coordinates: [16.0551, 108.2412],
    description:
      "A L'Olivier favors a quiet, clean atmosphere near My Khe, adding a guest kitchen and limited-hour reception instead of a heavy party program.",
    officialUrl:
      "https://www.hostelworld.com/hostels/p/332846/a-l-olivier-hostel/",
    bookingUrl:
      "https://www.hostelworld.com/hostels/p/332846/a-l-olivier-hostel/",
    hours: hostelHours("2:00 PM-11:00 PM"),
    price: "$",
    priceSource: "Hostelworld property page checked 2026-08-26",
    venueKind: "lodging",
    lodgingType: "hostel",
    subcategory: "quiet_hostel",
    attributeTags: ["budget", "quiet", "beach", "kitchen", "solo_friendly"],
  }),
  stop({
    id: "danang-hostel-seahorse-signature",
    name: "Seahorse Signature Da Nang Hostel",
    coordinates: [16.0599, 108.2166],
    description:
      "Seahorse Signature combines dorms, private rooms, a rooftop pool, breakfast, and twenty-four-hour reception in a central, design-forward converted property.",
    officialUrl:
      "https://www.hostelworld.com/hostels/p/319754/seahorse-signature-da-nang-hostel-by-havil/",
    bookingUrl:
      "https://www.hostelworld.com/hostels/p/319754/seahorse-signature-da-nang-hostel-by-havil/",
    hours: hostelHours("2:00 PM-12:00 AM; 24-hour reception"),
    price: "$",
    priceSource: "Hostelworld property page checked 2026-08-26",
    venueKind: "lodging",
    lodgingType: "hostel",
    subcategory: "design_hostel",
    attributeTags: ["budget", "central", "pool", "social", "private_rooms"],
  }),
  stop({
    id: "danang-hostel-sujet-beach",
    name: "Sujet Beach Hostel and Hotel Danang",
    coordinates: [16.0559, 108.2461],
    description:
      "Sujet Beach puts bright dorms and private rooms close to My Khe, with a sociable common area and practical Haviland guest services.",
    officialUrl:
      "https://www.hostelworld.com/hostels/p/334340/sujet-beach-hostel-and-hotel-danang-by-haviland/",
    bookingUrl:
      "https://www.hostelworld.com/hostels/p/334340/sujet-beach-hostel-and-hotel-danang-by-haviland/",
    hours: hostelHours("2:00 PM-12:00 AM"),
    price: "$",
    priceSource: "Hostelworld property page checked 2026-08-26",
    venueKind: "lodging",
    lodgingType: "hostel",
    subcategory: "beach_hostel",
    attributeTags: [
      "budget",
      "beach",
      "social",
      "private_rooms",
      "solo_friendly",
    ],
  }),
  stop({
    id: "danang-hostel-memory",
    name: "The Memory Danang Boutique",
    coordinates: [16.0587, 108.2465],
    description:
      "The Memory uses Cham-inspired brickwork, crafted interiors, breakfast, and compact dorms to create a boutique hostel with unusually strong design character.",
    officialUrl:
      "https://www.hostelworld.com/hostels/p/336958/the-memory-danang-boutique/",
    bookingUrl:
      "https://www.hostelworld.com/hostels/p/336958/the-memory-danang-boutique/",
    hours: hostelHours("2:00 PM-11:00 PM"),
    price: "$$",
    priceSource: "Hostelworld property page checked 2026-08-26",
    venueKind: "lodging",
    lodgingType: "hostel",
    subcategory: "boutique_hostel",
    attributeTags: ["design", "beach", "quiet", "breakfast", "private_rooms"],
  }),
  stop({
    id: "danang-hostel-garden-capsule",
    name: "The Garden Capsule Hotel",
    coordinates: [16.0672, 108.2269],
    description:
      "Capsule beds, private pods, river-bridge access, and low nightly rates make The Garden a central option for travelers prioritizing privacy on a dorm budget.",
    officialUrl:
      "https://www.hostelworld.com/hostels/p/318650/the-garden-capsule-hotel/",
    bookingUrl:
      "https://www.hostelworld.com/hostels/p/318650/the-garden-capsule-hotel/",
    hours: hostelHours("2:00 PM-11:00 PM"),
    price: "$",
    priceSource: "Hostelworld property page checked 2026-08-26",
    venueKind: "lodging",
    lodgingType: "hostel",
    subcategory: "capsule_hostel",
    attributeTags: ["budget", "central", "capsule", "solo_friendly", "privacy"],
  }),
  stop({
    id: "danang-hostel-tropical-dorm",
    name: "Tropical Dorm Hostel Da Nang",
    coordinates: [16.0679, 108.2277],
    description:
      "Tropical Dorm offers tidy pod-like bunks, private rooms, helpful hosts, and central river access without the scale or noise of a party hostel.",
    officialUrl:
      "https://www.hostelworld.com/hostels/p/334118/tropical-dorm-hostel-da-nang-by-haviland/",
    bookingUrl:
      "https://www.hostelworld.com/hostels/p/334118/tropical-dorm-hostel-da-nang-by-haviland/",
    hours: hostelHours("2:00 PM-12:00 AM"),
    price: "$",
    priceSource: "Hostelworld property page checked 2026-08-26",
    venueKind: "lodging",
    lodgingType: "hostel",
    subcategory: "pod_hostel",
    attributeTags: [
      "budget",
      "central",
      "quiet",
      "solo_friendly",
      "private_rooms",
    ],
  }),
  stop({
    id: "danang-hostel-lighthouse",
    name: "Lighthouse Danang Hostel",
    coordinates: [16.0521, 108.2456],
    description:
      "Lighthouse is an established An Thuong dorm option with a rooftop, communal spaces, beach access, and a more traditional backpacker social rhythm.",
    officialUrl:
      "https://www.hostelworld.com/hostels/p/286704/lighthouse-danang-hostel/",
    bookingUrl:
      "https://www.hostelworld.com/hostels/p/286704/lighthouse-danang-hostel/",
    hours: hostelHours("2:00 PM-11:00 PM"),
    price: "$",
    priceSource: "Hostelworld property page checked 2026-08-26",
    venueKind: "lodging",
    lodgingType: "hostel",
    subcategory: "social_hostel",
    attributeTags: ["budget", "beach", "social", "rooftop", "solo_friendly"],
  }),
  stop({
    id: "danang-hostel-dorm-beachside",
    name: "Dorm Beachside Hotel & Hostel",
    coordinates: [16.0516, 108.2473],
    description:
      "Dorm Beachside supplies curtained bunks and private rooms within walking distance of My Khe, backed by Haviland's practical tour and reception services.",
    officialUrl:
      "https://www.hostelworld.com/hostels/p/339341/dorm-beachside-hotel-and-hostel-by-haviland/",
    bookingUrl:
      "https://www.hostelworld.com/hostels/p/339341/dorm-beachside-hotel-and-hostel-by-haviland/",
    hours: hostelHours("2:00 PM-12:00 AM"),
    price: "$",
    priceSource: "Hostelworld property page checked 2026-08-26",
    venueKind: "lodging",
    lodgingType: "hostel",
    subcategory: "beach_hostel",
    attributeTags: [
      "budget",
      "beach",
      "social",
      "private_rooms",
      "solo_friendly",
    ],
  }),
  stop({
    id: "danang-hostel-dorm-garden",
    name: "Dorm Garden Hostel Danang",
    coordinates: [16.0538, 108.2428],
    description:
      "Dorm Garden combines simple dorms, private rooms, planted common areas, and an An Thuong location suited to beach days and neighborhood food.",
    officialUrl:
      "https://www.hostelworld.com/hostels/p/337766/dorm-garden-hostel-danang-by-haviland/",
    bookingUrl:
      "https://www.hostelworld.com/hostels/p/337766/dorm-garden-hostel-danang-by-haviland/",
    hours: hostelHours("2:00 PM-12:00 AM"),
    price: "$",
    priceSource: "Hostelworld property page checked 2026-08-26",
    venueKind: "lodging",
    lodgingType: "hostel",
    subcategory: "garden_hostel",
    attributeTags: ["budget", "beach", "social", "garden", "private_rooms"],
  }),
  stop({
    id: "danang-hostel-sujet-residence",
    name: "Sujet Residence Da Nang Hostel",
    coordinates: [16.0753, 108.2259],
    description:
      "Sujet Residence places dorm beds and private rooms near the Han River, favoring central access and low prices over a dedicated party atmosphere.",
    officialUrl:
      "https://www.hostelworld.com/hostels/p/331798/sujet-residence-da-nang-hostel-by-haviland/",
    bookingUrl:
      "https://www.hostelworld.com/hostels/p/331798/sujet-residence-da-nang-hostel-by-haviland/",
    hours: hostelHours("2:00 PM-12:00 AM"),
    price: "$",
    priceSource: "Hostelworld property page checked 2026-08-26",
    venueKind: "lodging",
    lodgingType: "hostel",
    subcategory: "central_hostel",
    attributeTags: [
      "budget",
      "central",
      "quiet",
      "private_rooms",
      "solo_friendly",
    ],
  }),
];

const casualBarStops = [
  stop({
    id: "danang-bar-7-bridges",
    name: "7 Bridges Brewing Co.",
    coordinates: [16.067, 108.2264],
    description:
      "Danang-born craft beer anchors this riverside taproom, with changing house pours, bridge views, pub food, and an easy mixed local-traveler crowd.",
    officialUrl: "https://www.7bridges.vn/",
    hours: daily(
      "11:00 AM-12:00 AM",
      "tap releases and events follow the official page",
    ),
    price: "$$",
    priceSource: "Official taproom page",
    venueKind: "nightlife",
    nightlifeType: "brewery",
    musicGenres: ["background"],
    attributeTags: [
      "craft_beer",
      "casual_nightlife",
      "scenic_nightlife",
      "group_friendly",
    ],
  }),
  stop({
    id: "danang-bar-section30",
    name: "Section30",
    coordinates: [16.0528, 108.2442],
    description:
      "Section30 pairs Vietnamese craft beer and casual food with regular live bands in an open, energetic space close to My Khe.",
    officialUrl: "https://www.thesection30.com/",
    hours: daily(
      "4:00 PM-1:00 AM",
      "live sets follow the official event calendar",
    ),
    price: "$$",
    priceSource: "Official venue page",
    venueKind: "nightlife",
    nightlifeType: "live_music_venue",
    musicGenres: ["rock", "pop", "acoustic"],
    attributeTags: [
      "craft_beer",
      "live_music",
      "lively_nightlife",
      "casual_nightlife",
    ],
  }),
  stop({
    id: "danang-bar-bamboo2",
    name: "Bamboo 2 Bar",
    coordinates: [16.0667, 108.224],
    description:
      "Bamboo 2 is a long-running riverfront sports bar with football screens, pool, inexpensive drinks, and later weekend hours than most central pubs.",
    officialUrl: "https://bamboo2bar.com/",
    hours: {
      default:
        "Sport broadcasts and holidays follow the official event calendar.",
      mon: "1:00 PM-2:00 AM",
      tue: "1:00 PM-2:00 AM",
      wed: "1:00 PM-2:00 AM",
      thu: "1:00 PM-2:00 AM",
      fri: "1:00 PM-2:00 AM",
      sat: "11:00 AM-3:00 AM",
      sun: "11:00 AM-3:00 AM",
    },
    price: "$$",
    priceSource: "Official venue page",
    venueKind: "nightlife",
    nightlifeType: "sports_bar",
    musicGenres: ["background"],
    attributeTags: [
      "sports_screening",
      "games",
      "casual_nightlife",
      "late_night",
    ],
  }),
  stop({
    id: "danang-bar-shamrock",
    name: "Shamrock Sports Bar",
    coordinates: [16.0525, 108.2448],
    description:
      "Shamrock runs around the clock with multiple sports feeds, Western pub food, pool tables, and a practical late-night refuge in An Thuong.",
    officialUrl: "https://shamrocksportsbar.com/",
    hours: daily(
      "open 24 hours",
      "major-match programming follows the official event calendar",
    ),
    price: "$$",
    priceSource: "Official venue page",
    venueKind: "nightlife",
    nightlifeType: "sports_bar",
    musicGenres: ["background"],
    attributeTags: [
      "sports_screening",
      "games",
      "casual_nightlife",
      "late_late",
    ],
  }),
  stop({
    id: "danang-bar-hannah",
    name: "Hannah Pub",
    coordinates: [16.0508, 108.2435],
    description:
      "Hannah Pub brings rotating live bands, beer, cocktails, and a compact neighborhood room together without the bottle-service posture of a club.",
    officialUrl: "https://hannahpub.com/livemusic/",
    hours: daily(
      "4:00 PM-1:00 AM",
      "live music is normally scheduled Thursday and Saturday at 9:00 PM on the official calendar",
    ),
    price: "$$",
    priceSource: "Official venue and live-music pages",
    venueKind: "nightlife",
    nightlifeType: "live_music_venue",
    musicGenres: ["rock", "pop", "acoustic"],
    attributeTags: [
      "live_music",
      "casual_nightlife",
      "lively_nightlife",
      "local_bar",
    ],
  }),
  stop({
    id: "danang-bar-embassy",
    name: "Embassy Irish Sports Bar",
    coordinates: [16.0503, 108.244],
    description:
      "Embassy combines Irish-pub staples, breakfast on weekends, large sports screens, darts, and genuinely late closing in the An Thuong nightlife grid.",
    officialUrl: "https://embassyirishsportsbar.com/",
    hours: {
      default: "Sport broadcasts follow the official event calendar.",
      mon: "12:00 PM-3:00 AM",
      tue: "12:00 PM-3:00 AM",
      wed: "12:00 PM-3:00 AM",
      thu: "12:00 PM-3:00 AM",
      fri: "12:00 PM-3:00 AM",
      sat: "9:00 AM-3:00 AM",
      sun: "9:00 AM-3:00 AM",
    },
    price: "$$",
    priceSource: "Official venue page",
    venueKind: "nightlife",
    nightlifeType: "pub",
    musicGenres: ["background"],
    attributeTags: [
      "sports_screening",
      "casual_nightlife",
      "late_late",
      "games",
    ],
  }),
  stop({
    id: "danang-bar-chevy",
    name: "Chevy Sports Bar and Bistro",
    coordinates: [16.0517, 108.2431],
    description:
      "Chevy mixes live bands, sports screens, pool, and broad bistro food in a casual room that stays active well after dinner.",
    officialUrl: "https://www.facebook.com/chevysportsbarandbistro/",
    hours: daily(
      "11:00 AM-2:00 AM",
      "bands and sport broadcasts follow the official social event calendar",
    ),
    price: "$$",
    priceSource: "Official social page / current venue listing",
    venueKind: "nightlife",
    nightlifeType: "sports_bar",
    musicGenres: ["rock", "pop", "acoustic"],
    attributeTags: ["sports_screening", "live_music", "games", "late_night"],
  }),
  stop({
    id: "danang-bar-dirty-fingers",
    name: "Dirty Fingers",
    coordinates: [16.052, 108.2445],
    description:
      "Dirty Fingers is a laid-back barbecue bar for smoked meat, burgers, cold beer, sports, and group tables rather than polished cocktail ritual.",
    officialUrl: "https://dirtyfingersdanang.com/",
    hours: daily(
      "11:00 AM-12:00 AM",
      "special events follow the official social calendar",
    ),
    price: "$$",
    priceSource: "Official menu / current venue listing",
    venueKind: "nightlife",
    nightlifeType: "pub",
    musicGenres: ["rock", "background"],
    attributeTags: [
      "casual_nightlife",
      "sports_screening",
      "group_friendly",
      "walk_in_friendly_nightlife",
    ],
  }),
  stop({
    id: "danang-bar-mad-den",
    name: "The Mad Den Irish Bar",
    coordinates: [16.0511, 108.2426],
    description:
      "The Mad Den keeps a compact Irish-pub profile with draught beer, televised matches, familiar pub dishes, and consistent late-night opening.",
    officialUrl: "https://themaddenirishbardanang.com/",
    hours: daily(
      "5:00 PM-2:00 AM",
      "match schedules follow the official event calendar",
    ),
    price: "$$",
    priceSource: "Official venue page",
    venueKind: "nightlife",
    nightlifeType: "pub",
    musicGenres: ["background"],
    attributeTags: [
      "sports_screening",
      "casual_nightlife",
      "late_night",
      "local_bar",
    ],
  }),
  stop({
    id: "danang-bar-1920s",
    name: "The 1920's Lounge",
    coordinates: [16.0674, 108.2216],
    description:
      "A house band, jazz standards, polished service, and classic drinks give The 1920's Lounge a performance-first identity near the Han River.",
    officialUrl: "https://the1920s.vn/",
    hours: daily(
      "7:00 PM-1:30 AM",
      "the house-band and guest-performance calendar controls showtimes",
    ),
    price: "$$$",
    priceSource: "Official venue page",
    venueKind: "nightlife",
    nightlifeType: "live_music_venue",
    musicGenres: ["jazz", "soul", "pop"],
    attributeTags: [
      "live_music",
      "dressy",
      "date_night",
      "reservation_recommended_nightlife",
    ],
  }),
];

const cocktailStops = [
  stop({
    id: "danang-cocktail-libre",
    name: "Bar Libre",
    coordinates: [16.0671, 108.221],
    description:
      "Bar Libre is a small bartender-led room where balanced signatures, Vietnamese ingredients, and direct counter conversation matter more than elaborate scenery.",
    officialUrl: "https://www.facebook.com/barlibredanang/",
    hours: daily(
      "6:00 PM-1:00 AM",
      "guest shifts follow the official social event calendar",
    ),
    price: "$$$",
    priceSource: "Official social page / current listing",
    venueKind: "nightlife",
    nightlifeType: "cocktail_bar",
    musicGenres: ["lounge"],
    attributeTags: [
      "craft_cocktails",
      "date_night",
      "low_key_nightlife",
      "walk_in_friendly_nightlife",
    ],
  }),
  stop({
    id: "danang-cocktail-do-yeu",
    name: "Bar Đồ Yêu",
    coordinates: [16.053, 108.242],
    description:
      "Đồ Yêu builds playful signatures around regional flavors in a warm, intimate room that rewards questions and a seat at the bar.",
    officialUrl: "https://bardoyeu.online/",
    hours: daily(
      "6:00 PM-1:00 AM",
      "last orders are at 12:30 AM and events follow the official page",
    ),
    price: "$$$",
    priceSource: "Official menu and reservation page",
    venueKind: "nightlife",
    nightlifeType: "cocktail_bar",
    musicGenres: ["lounge"],
    attributeTags: [
      "craft_cocktails",
      "date_night",
      "local_bar",
      "low_key_nightlife",
    ],
  }),
  stop({
    id: "danang-cocktail-black-wolf",
    name: "Black Wolf Bespoke Cocktail Bar",
    coordinates: [16.0577, 108.2398],
    description:
      "Black Wolf works in a dark bespoke format, translating preferred spirits and flavor profiles into tailored drinks instead of pushing a fixed route.",
    officialUrl: "https://www.facebook.com/blackwolfcocktailbar/",
    hours: daily(
      "6:00 PM-1:00 AM",
      "guest shifts follow the official social event calendar",
    ),
    price: "$$$",
    priceSource: "Official social page / current venue listing",
    venueKind: "nightlife",
    nightlifeType: "cocktail_bar",
    musicGenres: ["lounge"],
    attributeTags: [
      "craft_cocktails",
      "speakeasy",
      "date_night",
      "low_key_nightlife",
    ],
  }),
  stop({
    id: "danang-cocktail-makara",
    name: "MAKARA Bar",
    coordinates: [16.0514, 108.2441],
    description:
      "MAKARA combines precise contemporary cocktails, Southeast Asian ingredients, guest bartender shifts, and a polished room without losing an easy beach-neighborhood mood.",
    officialUrl: "https://www.makarabar.com/",
    hours: {
      default: "Guest shifts and events follow the official calendar.",
      mon: "7:00 PM-1:00 AM",
      tue: "7:00 PM-1:00 AM",
      wed: "7:00 PM-1:00 AM",
      thu: "7:00 PM-1:00 AM",
      fri: "7:00 PM-2:00 AM",
      sat: "7:00 PM-2:00 AM",
      sun: "7:00 PM-1:00 AM",
    },
    price: "$$$",
    priceSource: "Official venue page",
    venueKind: "nightlife",
    nightlifeType: "cocktail_bar",
    musicGenres: ["lounge", "dj"],
    attributeTags: [
      "craft_cocktails",
      "date_night",
      "reservation_recommended_nightlife",
      "dressy",
    ],
  }),
  stop({
    id: "danang-cocktail-te",
    name: "Tê Bar",
    coordinates: [16.0678, 108.2215],
    description:
      "Hidden above a central street, Tê Bar uses Vietnamese herbs, fruit, tea, and spirits in thoughtful signatures served in a compact room.",
    officialUrl: "https://www.facebook.com/tecocktails",
    hours: daily(
      "7:00 PM-1:30 AM",
      "guest shifts follow the official social event calendar",
    ),
    price: "$$$",
    priceSource: "Official social page / current listing",
    venueKind: "nightlife",
    nightlifeType: "cocktail_bar",
    musicGenres: ["lounge"],
    attributeTags: ["craft_cocktails", "speakeasy", "date_night", "central"],
  }),
  stop({
    id: "danang-cocktail-craftsman",
    name: "The Craftsman Cocktail Bar",
    coordinates: [16.0523, 108.2422],
    description:
      "The Craftsman is a dim, detail-focused bar for classic structure, bartender originals, and slower conversation away from An Thuong's louder pubs.",
    officialUrl: "https://www.facebook.com/thecraftsmancocktailbar/",
    hours: daily(
      "6:30 PM-1:30 AM",
      "guest shifts and private events follow the official social calendar",
    ),
    price: "$$$",
    priceSource: "Official social page / current venue listing",
    venueKind: "nightlife",
    nightlifeType: "cocktail_bar",
    musicGenres: ["lounge"],
    attributeTags: [
      "craft_cocktails",
      "date_night",
      "low_key_nightlife",
      "reservation_recommended_nightlife",
    ],
  }),
  stop({
    id: "danang-cocktail-ket-high",
    name: "Kết High",
    coordinates: [16.0505, 108.2437],
    description:
      "Kết High pushes Danang's cocktail vocabulary toward bolder local flavors, late service, and a compact bar energy shaped by the bartender team.",
    officialUrl: "https://www.instagram.com/info.kethigh/",
    hours: daily(
      "7:30 PM-2:30 AM",
      "guest shifts follow the official social event calendar",
    ),
    price: "$$$",
    priceSource: "Official social page / current venue listing",
    venueKind: "nightlife",
    nightlifeType: "cocktail_bar",
    musicGenres: ["lounge", "hip_hop"],
    attributeTags: [
      "craft_cocktails",
      "late_night",
      "lively_nightlife",
      "local_bar",
    ],
  }),
  stop({
    id: "danang-cocktail-linger",
    name: "Linger Bespoke Cocktail Bar",
    coordinates: [16.0546, 108.2417],
    description:
      "Linger delivers bespoke drinks in a composed modern room, giving flavor preferences and bartender technique more weight than a long printed menu.",
    officialUrl: "https://lingerbespoke.com/",
    hours: daily(
      "6:00 PM-2:00 AM",
      "reservations and guest shifts follow the official page",
    ),
    price: "$$$",
    priceSource: "Official venue page",
    venueKind: "nightlife",
    nightlifeType: "cocktail_bar",
    musicGenres: ["lounge"],
    attributeTags: [
      "craft_cocktails",
      "date_night",
      "reservation_recommended_nightlife",
      "late_night",
    ],
  }),
  stop({
    id: "danang-cocktail-united",
    name: "United Bar",
    coordinates: [16.0691, 108.2209],
    description:
      "United is a discreet central cocktail room using Vietnamese ingredients and attentive bar service, with enough restraint for conversation across several rounds.",
    officialUrl: "https://www.foodtourdanang.vn/en/united-bar?food=100",
    hours: daily(
      "6:00 PM-1:00 AM",
      "guest shifts follow the linked official social event calendar",
    ),
    price: "$$$",
    priceSource: "Da Nang Food Tour / official social page",
    venueKind: "nightlife",
    nightlifeType: "cocktail_bar",
    musicGenres: ["lounge"],
    attributeTags: [
      "craft_cocktails",
      "date_night",
      "central",
      "low_key_nightlife",
    ],
  }),
  stop({
    id: "danang-cocktail-sky36",
    name: "Sky36",
    coordinates: [16.0772, 108.223],
    description:
      "Sky36 occupies a high Novotel rooftop with river and city views, mixing cocktails, DJs, dressier service, and late nightclub energy.",
    officialUrl: "https://sky36.vn/",
    hours: daily(
      "6:00 PM-2:00 AM",
      "DJ sets, table bookings, and weather operations follow the official event calendar",
    ),
    price: "$$$$",
    priceSource: "Official venue page",
    venueKind: "nightlife",
    nightlifeType: "rooftop_bar",
    musicGenres: ["dj", "electronic", "pop"],
    attributeTags: [
      "craft_cocktails",
      "scenic_nightlife",
      "dressy",
      "party_nightlife",
    ],
  }),
];

const cultureStops = [
  stop({
    id: "danang-culture-cham-museum",
    name: "Museum of Cham Sculpture",
    coordinates: [16.0602, 108.223],
    description:
      "The world's most concentrated collection of Cham sandstone sculpture gives essential context to the temples, deities, and kingdoms of central Vietnam.",
    officialUrl:
      "https://danangfantasticity.com/en/bao-tang-lich-su-va-van-hoa/bao-tang-dieu-khac-cham-da-nang",
    hours: daily(
      "7:30 AM-5:00 PM",
      "last admission and holiday notices follow the official museum page",
    ),
    venueKind: "culture",
    subcategory: "museum",
    attributeTags: [
      "museum",
      "historic_site",
      "educational",
      "indoor_activity",
    ],
    editorialUrls: ["https://chammuseum.vn/"],
  }),
  stop({
    id: "danang-culture-city-museum",
    name: "Da Nang Museum",
    coordinates: [16.0751, 108.222],
    description:
      "The relocated city museum at 31 Tran Phu traces Danang's maritime, wartime, urban, and community history through a modern multi-floor display.",
    officialUrl:
      "https://danangfantasticity.com/en/new-tourism-products-in-da-nang-2026",
    hours: daily(
      "8:00 AM-5:00 PM",
      "special exhibitions and holidays follow the official museum page",
    ),
    venueKind: "culture",
    subcategory: "museum",
    attributeTags: [
      "museum",
      "historic_site",
      "educational",
      "indoor_activity",
    ],
  }),
  stop({
    id: "danang-culture-fine-arts",
    name: "Da Nang Fine Arts Museum",
    coordinates: [16.0709, 108.2188],
    description:
      "Three floors cover modern regional painting, sculpture, lacquer, folk art, masks, textiles, and traditional crafts from central Vietnam and the highlands.",
    officialUrl: "https://danangfantasticity.com/en/bao-tang-my-thuat-da-nang",
    hours: daily(
      "8:00 AM-5:00 PM",
      "special exhibitions follow the official museum page",
    ),
    venueKind: "culture",
    subcategory: "art_museum",
    attributeTags: ["museum", "gallery", "educational", "indoor_activity"],
  }),
  stop({
    id: "danang-culture-military-zone-5",
    name: "Ho Chi Minh and Military Zone 5 Museum",
    coordinates: [16.0476, 108.2134],
    description:
      "Indoor galleries, captured aircraft and armor, memorial rooms, and a full-scale stilt-house replica frame central Vietnam's modern military history.",
    officialUrl: "https://danangfantasticity.com/en/ho-chi-minh-museum",
    hours: daily(
      "8:00 AM-4:30 PM",
      "ceremonial closures follow the official museum page",
    ),
    venueKind: "culture",
    subcategory: "military_museum",
    attributeTags: [
      "museum",
      "historic_site",
      "educational",
      "indoor_activity",
    ],
  }),
  stop({
    id: "danang-culture-dong-dinh",
    name: "Dong Dinh Art Museum",
    coordinates: [16.1117, 108.2764],
    description:
      "Garden houses on Son Tra hold Sa Huynh, Champa, Dai Viet, and highland artifacts alongside contemporary art in a forested setting.",
    officialUrl: "https://danangfantasticity.com/en/art/dong-dinh-museum",
    hours: daily(
      "8:00 AM-5:00 PM",
      "weather and private events follow the official museum page",
    ),
    venueKind: "culture",
    subcategory: "private_museum",
    attributeTags: ["museum", "garden", "historic_site", "nature_escape"],
  }),
  stop({
    id: "danang-culture-buddhist-museum",
    name: "Museum of Buddhist Culture",
    coordinates: [16.0037, 108.2639],
    description:
      "Quan The Am Pagoda's upper-floor collection brings together Buddhist statues, scriptures, ritual objects, paintings, and instruments from Vietnam and wider Asia.",
    officialUrl: "https://danangfantasticity.com/en/culture/buddist-museum",
    hours: daily(
      "8:00 AM-5:00 PM",
      "religious ceremonies and festival access follow the official pagoda page",
    ),
    venueKind: "culture",
    subcategory: "religious_museum",
    attributeTags: ["museum", "religious_site", "educational", "quiet_culture"],
  }),
  stop({
    id: "danang-culture-cathedral",
    name: "Da Nang Cathedral",
    coordinates: [16.0667, 108.2231],
    description:
      "The pink 1920s cathedral and its rooster weather vane remain a working Catholic parish, so worship schedules take priority over sightseeing access.",
    officialUrl: "https://www.giaoxudanang.org/",
    hours: {
      default:
        "Grounds are normally accessible daily 6:00 AM-6:00 PM; Mass and parish ceremonies follow the official church calendar.",
    },
    venueKind: "culture",
    subcategory: "cathedral",
    attributeTags: [
      "religious_site",
      "architecture",
      "historic_landmark",
      "free_entry",
    ],
  }),
  stop({
    id: "danang-culture-non-nuoc-village",
    name: "Non Nuoc Stone Carving Village",
    coordinates: [16.0015, 108.2647],
    description:
      "Generations of stoneworkers shape religious sculpture, household pieces, and contemporary commissions in workshops clustered below the Marble Mountains.",
    officialUrl:
      "https://danangfantasticity.com/en/non-nuoc-stone-carving-village",
    hours: daily(
      "8:00 AM-5:00 PM",
      "individual workshops and festival demonstrations keep separate schedules",
    ),
    venueKind: "culture",
    subcategory: "craft_village",
    attributeTags: ["local_makers", "historic_site", "hands_on", "free_entry"],
  }),
  stop({
    id: "danang-culture-linh-ung",
    name: "Linh Ung Bai But Pagoda",
    coordinates: [16.1006, 108.2771],
    description:
      "The immense Lady Buddha, temple courtyards, resident monkeys, and broad bay views make this active Son Tra monastery culturally and visually significant.",
    officialUrl: "https://danangfantasticity.com/en/linh-ung-pagoda",
    hours: daily(
      "5:00 AM-9:00 PM",
      "religious ceremonies and severe-weather access follow the official pagoda page",
    ),
    venueKind: "culture",
    subcategory: "pagoda",
    attributeTags: [
      "religious_site",
      "scenic_view",
      "architecture",
      "free_entry",
    ],
  }),
  stop({
    id: "danang-culture-marble-mountains",
    name: "Marble Mountains",
    coordinates: [16.0035, 108.2649],
    description:
      "Cave temples, pagodas, wartime traces, stone stairways, and viewpoints layer Buddhist practice with landscape and local craft history across Thuy Son.",
    officialUrl: "https://danangfantasticity.com/en/marble-mountains",
    hours: daily(
      "7:00 AM-5:30 PM",
      "last admission, elevator service, and storm closures follow the official attraction page",
    ),
    venueKind: "culture",
    subcategory: "heritage_landscape",
    attributeTags: [
      "historic_site",
      "religious_site",
      "caves",
      "scenic_view",
      "ticketed",
    ],
  }),
];

const activityStops = [
  stop({
    id: "danang-activity-my-khe",
    name: "My Khe Beach",
    coordinates: [16.0604, 108.2461],
    description:
      "A long urban beach, broad promenade, sunrise swimming, and dense food-and-hotel infrastructure make My Khe Danang's easiest daily outdoor ritual.",
    officialUrl: "https://danangfantasticity.com/en/my-khe-beach",
    hours: daily(
      "open 24 hours for the public promenade",
      "swim only during lifeguarded flags and hours posted by the official beach authority",
    ),
    venueKind: "outdoors",
    subcategory: "urban_beach",
    attributeTags: [
      "beach",
      "sunrise",
      "swimming",
      "free_entry",
      "walking_route",
    ],
  }),
  stop({
    id: "danang-activity-marble-mountains",
    name: "Marble Mountains",
    coordinates: [16.0035, 108.2649],
    description:
      "Climb stone stairways through cave sanctuaries, pagodas, and viewpoints on Thuy Son, allowing extra time for heat, crowds, and uneven surfaces.",
    officialUrl: "https://danangfantasticity.com/en/marble-mountains",
    hours: daily(
      "7:00 AM-5:30 PM",
      "last admission, elevator service, and storm closures follow the official attraction page",
    ),
    venueKind: "outdoors",
    subcategory: "cave_hike",
    attributeTags: [
      "hiking",
      "caves",
      "scenic_view",
      "ticketed",
      "religious_site",
    ],
  }),
  stop({
    id: "danang-activity-son-tra",
    name: "Son Tra Peninsula",
    coordinates: [16.1156, 108.2925],
    description:
      "Forest roads, coastal viewpoints, rare red-shanked doucs, steep gradients, and protected routes turn Son Tra into Danang's closest substantial nature escape.",
    officialUrl:
      "https://danangfantasticity.com/en/heritage-landscape/the-son-tra-peninsula",
    hours: {
      default:
        "Daily Mar-Sep 7:30 AM-6:30 PM; daily Oct-Feb 7:30 AM-5:30 PM. Official vehicle restrictions and weather closures apply.",
    },
    venueKind: "outdoors",
    subcategory: "peninsula_nature",
    attributeTags: [
      "nature_escape",
      "wildlife",
      "scenic_view",
      "cycling",
      "seasonal",
    ],
  }),
  stop({
    id: "danang-activity-linh-ung",
    name: "Linh Ung Bai But Pagoda",
    coordinates: [16.1006, 108.2771],
    description:
      "Visit the giant Lady Buddha and sea-facing temple courtyards while treating the working monastery, resident wildlife, and dress expectations with respect.",
    officialUrl: "https://danangfantasticity.com/en/linh-ung-pagoda",
    hours: daily(
      "5:00 AM-9:00 PM",
      "religious ceremonies and severe-weather access follow the official pagoda page",
    ),
    venueKind: "landmark",
    subcategory: "pagoda_viewpoint",
    attributeTags: [
      "religious_site",
      "scenic_view",
      "free_entry",
      "architecture",
    ],
  }),
  stop({
    id: "danang-activity-ba-na",
    name: "Sun World Ba Na Hills",
    coordinates: [15.9952, 107.9963],
    description:
      "Cable cars climb to the Golden Bridge, gardens, themed streets, indoor rides, and mountain weather that can shift quickly above the coastal plain.",
    officialUrl:
      "https://danangfantasticity.com/en/new-tourism-products-in-da-nang-2026",
    hours: daily(
      "8:00 AM-10:00 PM",
      "cable-car operations, shows, and weather closures follow the official attraction calendar",
    ),
    bookingUrl: "https://banahills.sunworld.vn/en/",
    venueKind: "outdoors",
    subcategory: "mountain_theme_park",
    attributeTags: [
      "ticketed_activity",
      "scenic_view",
      "family_activity",
      "cable_car",
      "weather",
    ],
  }),
  stop({
    id: "danang-activity-dragon-bridge",
    name: "Dragon Bridge Fire and Water Show",
    coordinates: [16.0611, 108.2275],
    description:
      "Danang's dragon-shaped river crossing becomes a compact public spectacle when its eastern head breathes fire and sprays water over weekend crowds.",
    officialUrl: "https://danangfantasticity.com/en/events/the-dragon-show",
    hours: {
      default:
        "Bridge sidewalks remain open daily 24 hours; the official show calendar controls cancellations.",
      fri: "Fire-and-water show 9:00 PM",
      sat: "Fire-and-water show 9:00 PM",
      sun: "Fire-and-water show 9:00 PM",
    },
    venueKind: "landmark",
    subcategory: "bridge_show",
    attributeTags: [
      "free_entry",
      "performance",
      "night_activity",
      "waterfront",
      "family_activity",
    ],
  }),
  stop({
    id: "danang-activity-son-tra-market",
    name: "Son Tra Night Market",
    coordinates: [16.0619, 108.2327],
    description:
      "Food stalls, seafood, souvenirs, small performances, and the nearby Dragon Bridge turn this market into a concentrated evening browse rather than a daytime stop.",
    officialUrl:
      "https://danangfantasticity.com/en/night-market/famous-local-markets-in-danang",
    hours: daily(
      "6:00 PM-11:00 PM",
      "individual stalls and weather closures follow the official market schedule",
    ),
    venueKind: "retail",
    subcategory: "night_market",
    attributeTags: [
      "market_retail",
      "street_food",
      "night_activity",
      "free_entry",
      "family_activity",
    ],
  }),
  stop({
    id: "danang-activity-cham-museum",
    name: "Museum of Cham Sculpture",
    coordinates: [16.0602, 108.223],
    description:
      "Spend focused time with sandstone deities, lintels, and temple fragments before visiting regional Cham sites; labels make the collection accessible without a guide.",
    officialUrl:
      "https://danangfantasticity.com/en/bao-tang-lich-su-va-van-hoa/bao-tang-dieu-khac-cham-da-nang",
    hours: daily(
      "7:30 AM-5:00 PM",
      "last admission and holiday notices follow the official museum page",
    ),
    venueKind: "culture",
    subcategory: "museum",
    attributeTags: ["museum", "rainy_day", "educational", "ticketed_activity"],
  }),
  stop({
    id: "danang-activity-downtown",
    name: "Da Nang Downtown",
    coordinates: [16.0386, 108.2264],
    description:
      "The riverside entertainment park combines the Sun Wheel, family rides, cultural shows, and evening lighting within a compact city-center footprint.",
    officialUrl: "https://danangdowntown.com/",
    hours: daily(
      "3:00 PM-10:00 PM",
      "ride maintenance, shows, and holiday extensions follow the official attraction calendar",
    ),
    venueKind: "other",
    subcategory: "amusement_park",
    attributeTags: [
      "ticketed_activity",
      "family_activity",
      "night_activity",
      "rides",
      "scenic_view",
    ],
  }),
  stop({
    id: "danang-activity-hai-van",
    name: "Hai Van Pass",
    coordinates: [16.1871, 108.1328],
    description:
      "The old mountain road climbs above Lang Co Bay through hairpins, bunkers, and sea views, demanding clear weather and confident riding or a hired driver.",
    officialUrl: "https://danangfantasticity.com/en/hai-van-pass",
    hours: daily(
      "open 24 hours for the public road",
      "fog, storms, landslides, and traffic restrictions follow official road and weather notices",
    ),
    venueKind: "outdoors",
    subcategory: "scenic_drive",
    attributeTags: [
      "scenic_view",
      "cycling",
      "motorbike",
      "weather",
      "historic_landmark",
    ],
  }),
];

const editorial = {
  dining: [
    source(
      "Da Nang tourism: MICHELIN-recognized restaurants 2026",
      michelin2026,
    ),
    source(
      "MICHELIN Guide: Da Nang restaurants",
      "https://guide.michelin.com/vn/en/da-nang-region/da-nang_2984390/restaurants",
    ),
    source(
      "Da Nang Food Tour: MICHELIN restaurants",
      "https://www.foodtourdanang.vn/en/nha-hang-michelin",
    ),
    source(
      "Vietnam Tourism: Da Nang",
      "https://vietnam.travel/places-to-go/central-vietnam/da-nang",
    ),
    source(
      "Google Maps: Danang restaurants",
      maps("best restaurants Da Nang Vietnam"),
    ),
  ],
  cheap: [
    source(
      "Da Nang tourism: MICHELIN-recognized restaurants 2026",
      michelin2026,
    ),
    source("Da Nang Food Tour", "https://www.foodtourdanang.vn/en"),
    source(
      "Da Nang Food Tour: MICHELIN 2025 additions",
      "https://www.foodtourdanang.vn/en/danh-sach-cac-co-so-an-uong-dat-chuan-michelin-guide-tai-da-nang-nam-2025",
    ),
    source(
      "Vietnam Tourism: Da Nang food",
      "https://vietnam.travel/things-to-do/food-guide-da-nang",
    ),
    source(
      "Google Maps: Danang cheap eats",
      maps("best cheap eats Da Nang Vietnam"),
    ),
  ],
  hotels: [
    source(
      "Booking.com: Da Nang hotels",
      "https://www.booking.com/city/vn/danang.html",
    ),
    source(
      "Vietnam Tourism: Da Nang",
      "https://vietnam.travel/places-to-go/central-vietnam/da-nang",
    ),
    source(
      "Da Nang tourism: accommodation",
      "https://danangfantasticity.com/en/accommodation",
    ),
    source(
      "MICHELIN Guide: Da Nang hotels",
      "https://guide.michelin.com/en/hotels-stays/da-nang",
    ),
    source("Google Maps: Danang hotels", maps("best hotels Da Nang Vietnam")),
  ],
  hostels: [
    source("Hostelworld: Da Nang hostels 2026", hostelworld),
    source(
      "Hostelworld: solo hostels in Da Nang",
      `${hostelworld}#best-hostels-for-solo-travellers`,
    ),
    source(
      "Booking.com: Da Nang hostels",
      "https://www.booking.com/hostels/city/vn/danang.html",
    ),
    source(
      "Vietnam Tourism: Da Nang",
      "https://vietnam.travel/places-to-go/central-vietnam/da-nang",
    ),
    source("Google Maps: Danang hostels", maps("best hostels Da Nang Vietnam")),
  ],
  bars: [
    source(
      "Da Nang tourism: bars and pubs",
      "https://danangfantasticity.com/en/bar-pub",
    ),
    source(
      "Da Nang tourism: nightlife",
      "https://danangfantasticity.com/en/nightlife",
    ),
    source("Digital Danang weekly events", "https://digitaldanang.com/"),
    source(
      "Vietnam Tourism: Da Nang",
      "https://vietnam.travel/places-to-go/central-vietnam/da-nang",
    ),
    source(
      "Google Maps: Danang pubs and live music",
      maps("best pubs live music Da Nang Vietnam"),
    ),
  ],
  cocktails: [
    source(
      "MAKARA: Da Nang's best cocktail bars",
      "https://www.makarabar.com/da-nangs-best-lists/da-nangs-best-cocktail-bars",
    ),
    source(
      "Da Nang tourism: bars and pubs",
      "https://danangfantasticity.com/en/bar-pub",
    ),
    source(
      "Nightlife Vietnam: Da Nang",
      "https://www.nightlifevietnam.com/da-nang",
    ),
    source("Digital Danang weekly events", "https://digitaldanang.com/"),
    source(
      "Google Maps: Danang cocktail bars",
      maps("best cocktail bars Da Nang Vietnam"),
    ),
  ],
  culture: [
    source(
      "Da Nang tourism: culture",
      "https://danangfantasticity.com/en/culture",
    ),
    source(
      "Da Nang tourism: new products 2026",
      "https://danangfantasticity.com/en/new-tourism-products-in-da-nang-2026",
    ),
    source(
      "Vietnam Tourism: Da Nang",
      "https://vietnam.travel/places-to-go/central-vietnam/da-nang",
    ),
    source(
      "Da Nang heritage passport 2026",
      "https://danangfantasticity.com/wp-content/uploads/2026/01/Ho-Chieu-Di-san-Da-Nang.pdf",
    ),
    source(
      "Google Maps: Danang museums and heritage",
      maps("best museums cultural sites Da Nang Vietnam"),
    ),
  ],
  activities: [
    source(
      "Da Nang tourism: new products 2026",
      "https://danangfantasticity.com/en/new-tourism-products-in-da-nang-2026",
    ),
    source(
      "Vietnam Tourism: Da Nang",
      "https://vietnam.travel/places-to-go/central-vietnam/da-nang",
    ),
    source(
      "Da Nang tourism: key times",
      "https://danangfantasticity.com/travel-information/key-times-to-save-for-your-da-nang-travel-itinerary",
    ),
    source("Da Nang tourism home", tourism),
    source(
      "Google Maps: Danang things to do",
      maps("best things to do Da Nang Vietnam"),
    ),
  ],
};

function sourcesFor(editorialSources: ListSource[], stops: GuideStop[]) {
  return [
    ...editorialSources,
    ...stops.map((item) =>
      source(
        `${item.name} property source`,
        item.officialUrl ?? maps(`${item.name} Da Nang`),
      ),
    ),
  ];
}

function guide(
  category: ListCategory,
  id: string,
  slug: string,
  seoSlug: string,
  title: string,
  description: string,
  stops: GuideStop[],
  guideSources: ListSource[],
  seoTitle: string,
  seoDescription: string,
): MapList {
  return {
    id,
    slug,
    seoSlug,
    seoTitle,
    seoDescription,
    title,
    description,
    url: maps(`${title} Da Nang Vietnam`),
    category,
    location,
    creator: {
      id: `user-rguide-${category.toLowerCase()}`,
      name: `R ${category}`,
      avatar: avatar(category),
    },
    upvotes: 0,
    createdAt,
    stops,
    sources: guideSources,
  };
}

export const danangCitywideGuides: MapList[] = [
  guide(
    "Food",
    "list-danang-best-restaurants",
    "danang-best-restaurants",
    "best-restaurants",
    "Danang's Destination Restaurants",
    "Danang's serious dining range now stretches from French tasting rooms and modern Italian technique to polished Vietnamese kitchens, beachfront seafood institutions, and a disciplined steakhouse. Reservations, service windows, and location should shape the choice.",
    diningStops,
    sourcesFor(editorial.dining, diningStops),
    "Best Restaurants in Danang for Fine Dining, Vietnamese Food, and Seafood",
    "Ten source-backed Danang restaurants with MICHELIN 2026 recognition, exact hours, booking evidence, and useful distinctions between tasting menus, local cooking, seafood, and steak.",
  ),
  guide(
    "Food",
    "list-danang-best-cheap-eats",
    "danang-best-cheap-eats",
    "best-cheap-eats",
    "Mì Quảng, Fishcake Noodles, and Crisp Bánh Xèo",
    "Danang's low-cost food identity is clearest in morning noodle rooms and specialist counters: mì Quảng, fishcake broth, bánh canh, bún bò Huế, and bánh xèo. Sell-outs and short morning windows matter more than reservations.",
    cheapEatStops,
    sourcesFor(editorial.cheap, cheapEatStops),
    "Best Cheap Eats in Danang for Mì Quảng, Bánh Xèo, and Noodle Soups",
    "Ten source-backed Danang cheap eats with MICHELIN-recognized counters, exact service windows, local specialties, and practical evidence for breakfast, lunch, and casual dinner.",
  ),
  guide(
    "Stay",
    "list-danang-best-hotels",
    "danang-best-hotels",
    "best-hotels",
    "Beach Resorts and Design-Led City Hotels",
    "Danang's hotel choice divides cleanly between large beach resorts, wellness retreats, private-villa compounds, and efficient towers near My Khe or the Han River. Beach access, transfer time, pools, spa depth, and room scale separate them.",
    hotelStops,
    sourcesFor(editorial.hotels, hotelStops),
    "Best Hotels in Danang for Beach Resorts, Wellness, and City Access",
    "Hotel-only Danang guide with direct property and Booking.com evidence, exact lodging classifications, price tiers, and distinctions across luxury resorts, villas, and central hotels.",
  ),
  guide(
    "Stay",
    "list-danang-best-hostels",
    "danang-best-hostels",
    "best-hostels",
    "Danang Hostels for Beach Access and Central Beds",
    "Danang's strongest hostels cluster around My Khe, An Thuong, and the Han River, ranging from quiet guest kitchens and capsule privacy to social rooftops and design-heavy dorms. Reception coverage and check-in windows vary.",
    hostelStops,
    sourcesFor(editorial.hostels, hostelStops),
    "Best Hostels in Danang for Beach Dorms, Capsules, and Private Rooms",
    "Hostel-only Danang guide using live 2026 Hostelworld property pages, check-in details, current availability evidence, and honest distinctions between quiet, social, beach, and central stays.",
  ),
  guide(
    "Nightlife",
    "list-danang-best-bars",
    "danang-best-bars",
    "best-bars",
    "Craft Beer, Sports Pubs, and Live Bands",
    "Casual Danang nightlife runs on local craft beer, televised sport, pub food, pool tables, and house bands rather than formal drinks programs. An Thuong carries the late-night density while the riverfront adds views and central access.",
    casualBarStops,
    sourcesFor(editorial.bars, casualBarStops),
    "Best Bars in Danang for Craft Beer, Sports, Pubs, and Live Music",
    "Ten current Danang bars with official hours, event dependencies, price tiers, and clear distinctions between breweries, sports rooms, Irish pubs, and live-music lounges.",
  ),
  guide(
    "Nightlife",
    "list-danang-best-cocktail-bars",
    "danang-best-cocktail-bars",
    "best-cocktail-bars",
    "Bespoke Drinks and Vietnamese Ingredients",
    "Danang's cocktail scene is compact but increasingly specific: bespoke counters, Vietnamese fruit and herbs, late beach-neighborhood rooms, and a rooftop club with city views. Guest shifts and weekend table pressure reward checking official calendars.",
    cocktailStops,
    sourcesFor(editorial.cocktails, cocktailStops),
    "Best Cocktail Bars in Danang for Bespoke Drinks and Rooftop Views",
    "Ten source-backed Danang cocktail bars with current hours, official evidence, price tiers, and distinctions spanning quiet counters, local ingredients, late service, and rooftop nightlife.",
  ),
  guide(
    "Culture",
    "list-danang-best-culture",
    "danang-best-culture",
    "best-culture",
    "Cham Sculpture, City Memory, and Living Sacred Sites",
    "Danang's culture is grounded in Cham sculpture, central Vietnamese art, military and urban history, Buddhist collections, working pagodas, Catholic architecture, and the stone-carving craft beneath Marble Mountains. Dress and ceremony matter at sacred sites.",
    cultureStops,
    sourcesFor(editorial.culture, cultureStops),
    "Best Culture in Danang for Museums, Cham Art, Pagodas, and Local Craft",
    "Ten source-backed Danang culture stops with official museum hours, 2026 exhibition evidence, religious-access caveats, and substantive context for Cham, Buddhist, military, and local art.",
  ),
  guide(
    "Activities",
    "list-danang-best-things-to-do",
    "danang-best-things-to-do",
    "best-things-to-do",
    "Danang's Essential Beaches, Mountains, and Night Sights",
    "Danang's strongest activities move between My Khe sunrise, cave temples, Son Tra forest, a mountain cable car, riverfront night spectacles, museums, rides, and Hai Van's high road. Weather and official show schedules are genuine constraints.",
    activityStops,
    sourcesFor(editorial.activities, activityStops),
    "Top Things to Do in Danang With 10 Source-Backed Stops",
    "Ten current Danang activities with exact or dependency-based hours, official 2026 evidence, and practical context for beaches, mountains, museums, markets, shows, rides, and scenic roads.",
  ),
];
