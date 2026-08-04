import type { GuideStop, ListCategory, ListSource, MapList } from "@/types";
import { buildNatureGuide } from "@/data/guides/nature-guide-builder";

const createdAt = "2026-07-18T00:00:00.000Z";
const checkedAt = "2026-07-18";

const lasVegasLocation = {
  city: "Las Vegas",
  country: "United States",
  continent: "North America",
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

type StopHours = NonNullable<GuideStop["hours"]>;

type StopInput = {
  id: string;
  name: string;
  coordinates: [number, number];
  description: string;
  officialUrl: string;
  photo: string;
  hours: StopHours;
  mapQuery?: string;
  imageSourceUrl?: string;
  editorialUrls?: string[];
  bookingUrl?: string;
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
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}?width=1400`;
}

function daily(text: string): StopHours {
  return { mon: text, tue: text, wed: text, thu: text, fri: text, sat: text, sun: text };
}

function stop(input: StopInput): GuideStop {
  const mapUrl = maps(input.mapQuery ?? `${input.name} Las Vegas`);
  const imageSourceUrl = input.imageSourceUrl ?? input.photo;
  const sourceUrls = [input.officialUrl, input.bookingUrl, mapUrl, imageSourceUrl, ...(input.editorialUrls ?? [])].filter(Boolean) as string[];

  return {
    id: input.id,
    name: input.name,
    coordinates: input.coordinates,
    description: input.description,
    venueKind: input.venueKind,
    foodServiceType: input.foodServiceType,
    cuisineTypes: input.cuisineTypes,
    nightlifeType: input.nightlifeType,
    musicGenres: input.musicGenres,
    lodgingType: input.lodgingType,
    subcategory: input.subcategory,
    attributeTags: input.attributeTags,
    price: input.price,
    priceSource: input.priceSource,
    bookingUrl: input.bookingUrl,
    officialUrl: input.officialUrl,
    hours: input.hours,
    photo: input.photo,
    imageSourceUrl,
    sourceUrls: [...new Set(sourceUrls)],
    sourceEvidence: {
      officialUrl: input.officialUrl,
      mapUrl,
      currentStatusUrl: input.officialUrl,
      imageSourceUrl,
      editorialUrls: input.editorialUrls ?? [],
      checkedAt,
      notes: "Official venue, property, government, reservation, or event-calendar evidence checked for current status and hours. Seasonal and show-driven access names the exact official dependency.",
    },
  };
}

const eaterRestaurants = "https://vegas.eater.com/maps/best-restaurants-las-vegas-strip";
const eaterCheap = "https://vegas.eater.com/maps/best-las-vegas-affordable-restaurants-cheap-eats";
const eaterBars = "https://vegas.eater.com/maps/best-bars-lounges-las-vegas";
const infatuationRestaurants = "https://www.theinfatuation.com/las-vegas/guides/las-vegas-restaurants";
const infatuationBars = "https://www.theinfatuation.com/las-vegas/guides/best-bars-las-vegas";
const cnRestaurants = "https://www.cntraveler.com/gallery/best-restaurants-in-las-vegas";
const cnHotels = "https://www.cntraveler.com/gallery/best-hotels-in-las-vegas";
const cnThings = "https://www.cntraveler.com/gallery/best-things-to-do-in-las-vegas";
const visitLasVegas = "https://www.visitlasvegas.com/";

const images = {
  joelRobuchon: "https://thelibrary.mgmresorts.com/transform/g3i9x2qCo8M2/MGM01445.tif",
  anima: "https://animabyedo.com/og-anima.jpg",
  wingLei: commons("Wing Lei, Wynn Las Vegas.jpg"),
  carbone: "https://thelibrary.mgmresorts.com/transform/ogD0c4jjS571/ARI01084.tif",
  bazaarMar: "https://images.getbento.com/accounts/81bb1875cf6e20eae65ebdfd8c190b75/media/images/37255Bazaar_Mar_Interiors_07-28-24_Katrina_Frederick.jpg?w=1200&fit=crop&auto=compress,format&cs=origin&h=600",
  esthers: "https://images.getbento.com/accounts/d77efcef5d5855a0d736f3e5f66c77b3/media/images/40184esther-s_3-9-24_FINALS-87.jpg?w=1200&fit=crop&auto=compress,format&cs=origin&h=600",
  lotus: commons("Lotus of siam facade.jpg"),
  sparrowWolf: commons("Dry Aged Porterhouse – Miso Rub, American Banchan.jpg"),
  partage: "https://partage.vegas/img/partage_homepage.jpg",
  kaisekiYuzu: "https://static.wixstatic.com/media/667275_ee396d08223443628c6a9baebf330608%7Emv2.jpg",
  tacosElGordo: "https://tacoselgordobc.com/wp-content/uploads/2015/02/location-lasvegasblvd2.jpg",
  shang: "https://static.wixstatic.com/media/8fee1a_f887ed1f01b248f3931c92177d1d582c%7Emv2.jpg/v1/fit/w_2500,h_1330,al_c/8fee1a_f887ed1f01b248f3931c92177d1d582c%7Emv2.jpg",
  monta: "https://static1.squarespace.com/static/609e98b8d24f7b7f19439091/t/621e8c09c3ab5b1ea23506f0/1646169097695/050321-101.jpg?format=1500w",
  goodPie: "https://platform.vegas.eater.com/wp-content/uploads/sites/24/chorus/uploads/chorus_asset/file/22133887/Good_Pie_front.jpg?quality=90&strip=all&crop=0%2C29.057591623037%2C100%2C41.884816753927&w=1200",
  evelPie: "https://www.casino.org/vitalvegas/wp-content/uploads/2016/11/evel_pie3.jpg",
  fukuburger: "https://images.squarespace-cdn.com/content/v1/52dc39dee4b0826240aa5213/1536117938306-AH8NQ0KWT3B29AHLREYU/outside.jpg",
  vivaArepas: "https://res.cloudinary.com/neonfeast/image/upload/c_limit,w_1200/v1644627801/sys/listings/bc7afca5-c2fd-4f83-aacd-5e55599719c6/arepas.jpg",
  bajamar: "https://static.spotapps.co/website_images/ab_websites/77484_website_v1/share_social.jpg",
  cornishPasty: "https://www.cornishpastyco.com/wp-content/uploads/2018/08/vegas.jpg",
  villagePub: "https://cdn.prod.website-files.com/6092d6f09a3178ca121f21b7/674527c6f29e218d178537ee_vpcomp2.jpg",
  bellagio: "https://thelibrary.mgmresorts.com/transform/gDVfq1q8t61/18-BEL-03963-0048---Bellagio-Hero-Shot---Resize-v00PP",
  wynn: "https://cdn.wynnresorts.com/image/upload/w_auto,f_auto,q_auto/f_auto/q_auto/v1680023284/Wynn%20Las%20Vegas/Careers/Explore/Hero/Wynn-Exterior-828x466",
  venetian: commons("Las Vegas-5603 (The Venetian).jpg"),
  cosmopolitan: "https://thelibrary.mgmresorts.com/transform/Y945oB5fzqq67c2J/TCO159373640.jpg",
  fontainebleau: commons("Fontainebleau Las Vegas Hotel Lobby.jpg"),
  fourSeasons: "https://www.fourseasons.com/content/dam/fourseasons/images/web/VGS/VGS_590_original.jpg",
  aria: "https://thelibrary.mgmresorts.com/transform/c7UtV0msiN95AQmG/ARI165823761.tif",
  circa: "https://www.circalasvegas.com/wp-content/uploads/2020/12/Vegas-Vickies-1.jpg",
  goldenNugget: commons("Golden Nugget Las Vegas entrance sign.jpg"),
  redRock: "https://i0.wp.com/redrockresort.com/wp-content/uploads/2025/08/Hotel-Lobby.jpg",
  atomicLiquors: "https://images.squarespace-cdn.com/content/v1/62572ad46ef1a308af8c298e/35fb7b63-1249-4af4-b9be-1beb00f4e013/274887505_628179284951066_6970709576909017558_n.jpg",
  dinos: "https://img1.wsimg.com/isteam/ip/f6ec2673-0d1c-4442-ad11-f5a7357d402d/IMG_0697.jpg",
  doubleDown: "https://scoundrelsfieldguide.com/wp-content/uploads/2022/12/Las-Vegas-Double-Down-Saloon-17-scaled.jpg",
  frankies: "https://frankiestikiroom.com/wp-content/uploads/2020/03/frankies-exterior.jpg",
  hardHat: "https://images.squarespace-cdn.com/content/v1/635c4d6701bf03391182461a/bbd407b7-1e77-40ec-b998-6c164fbd31f2/_DSC4591.jpg",
  stageDoor: "https://media.timeout.com/images/102150451/1372/772/image.webp",
  silverStamp: "https://silverstamplv.com/wp-content/uploads/2021/03/img_6287.jpg",
  rebar: "https://img1.wsimg.com/isteam/ip/50965b5b-baf0-4de5-81f7-1cc9ffa0792f/rebarpress-NYTimes.webp",
  sandDollar: "https://thesanddollarlv.com/wp-content/uploads/2021/08/SD.interior2-7.jpg",
  hogs: "https://hogsandheiferslasvegas.com/wp-content/uploads/2018/05/Hogs-Heifers-Saloon_0834.jpg",
  velveteen: "https://images.squarespace-cdn.com/content/v1/5ce7085d97edaf000146dc2a/1603053087713-44APTCTEAFAFITFB6WHZ/velvrab-67.jpg",
  herbsRye: "https://cdn.prod.website-files.com/611d8f70ad65bdc2abcc9aa2/6136dbeec9ac13402f834692_Herbs-and-rye-3-poster-00001.jpg",
  goldenTiki: "https://images.getbento.com/accounts/a4b2ead6b9219285b249a253a4bf1caf/media/images/8118tiki.finsls-127.jpg",
  oakIvy: "https://dtplv.com/wp-content/uploads/2016/08/DSC0850.jpg",
  laundryRoom: "https://images.squarespace-cdn.com/content/v1/5f245b2e63500f4918245892/1596220483283-OPBA7AF1OBGRXF0KCRBJ/DSC02170.jpg",
  strayPirate: "https://straypirate.com/wp-content/uploads/2025/08/hero-home-1.webp",
  vesper: "https://thelibrary.mgmresorts.com/transform/s5JIZxdMMrH41AVJ/TCO154472588.tif?io=transform:fill,width:1440,height:720&format=webp&quality=75",
  vault: "https://thelibrary.mgmresorts.com/transform/Y5lxvCYajfh01sFh/BEL153202395.tif",
  hereKitty: "https://www.rwlasvegas.com/wp-content/uploads/2024/10/HKK_1920x720.jpg",
  skiLodge: "https://thelibrary.mgmresorts.com/transform/QDY2xJLKEG61okiX/TCO159513085.jpg",
  neonMuseum: commons("Neon Museum Las Vegas walkway.jpg"),
  mobMuseum: commons("Las Vegas Mob Museum 2012.jpg"),
  atomicMuseum: commons("National Atomic Testing Museum.JPG"),
  stateMuseum: "https://www.lasvegasnvmuseum.org/wp-content/uploads/sites/3/2023/02/Museum-Featured-Image.jpg",
  springs: commons("Springs Preserve garden building.jpg"),
  naturalHistory: commons("Las Vegas Natural History Museum (14479990133).jpg"),
  punkMuseum: "https://images.squarespace-cdn.com/content/v1/5fea576a0ab2aa2312215010/d90fbc21-e6a8-4eb2-ac3f-8de10c14a043/Visit+The+Punk+Rock+Museum.jpg",
  eroticMuseum: commons("Erotic Heritage Museum, Las Vegas interior 2009 - 02.jpg"),
  charlestonGallery: "https://sawebfilesprod001.blob.core.windows.net/images/Hero-CharlestonHeights.jpg",
  smithCenter: commons("The Smith Center for the Performing Arts & DISCOVERY Children's Museum.jpg"),
  redRockCanyon: commons("2012.09.09.102454 Scenic drive Red Rock Canyon Nevada.jpg"),
  valleyFire: commons("Road in Valley of Fire.jpg"),
  hooverDam: commons("Hoover Dam, Nevada (Arizona-Nevada, USA) -- 2012 -- 6125.jpg"),
  bellagioFountains: commons("Bellagio Fountains at night.jpg"),
  fremont: commons("Fremont Street Experience - Las Vegas, Nevada (8772603245).jpg"),
  highRoller: commons("Las Vegas, High Roller, 2018.11.22 (01).jpg"),
  sphere: commons("The Sphere in Las Vegas.jpg"),
  omegaMart: commons("Omega Mart shelves.png"),
  pinball: commons("Pinball Hall of Fame - new machine row.jpg"),
  sevenMagic: commons("2020-02-12 Seven Magic Mountains 20.jpg"),
};

const diningStops: GuideStop[] = [
  stop({
    id: "las-vegas-joel-robuchon",
    name: "Joël Robuchon",
    coordinates: [36.1031998, -115.167761],
    description: "The MGM Grand mansion dining room remains Las Vegas's maximal French tasting-menu experience: polished service, intricate plates, and a bill suited to a major celebration. Reserve well ahead and budget a full evening.",
    officialUrl: "https://mgmgrand.mgmresorts.com/en/restaurants/joel-robuchon-french-restaurant.html",
    photo: images.joelRobuchon,
    hours: { mon: "5:00 PM–9:30 PM", tue: "Closed", wed: "Closed", thu: "5:00 PM–9:30 PM", fri: "5:00 PM–9:30 PM", sat: "5:00 PM–9:30 PM", sun: "5:00 PM–9:30 PM" },
    bookingUrl: "https://mgmgrand.mgmresorts.com/en/restaurants/joel-robuchon-french-restaurant.html",
    price: "$$$$",
    priceSource: "Official tasting-menu and reservation page checked July 2026.",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["French", "Fine dining"],
    subcategory: "Tasting menu",
    attributeTags: ["reservations-essential", "special-occasion", "tasting-menu", "strip"],
    editorialUrls: [eaterRestaurants, cnRestaurants],
  }),
  stop({
    id: "las-vegas-anima-by-edo",
    name: "Anima by EDO",
    coordinates: [36.0845912, -115.2936113],
    description: "This southwest Las Vegas dining room brings Spanish, Catalan, Italian, and Mediterranean ideas into playful small plates and an unusually accessible tasting menu. The drive is worthwhile when the table wants a long, chef-led meal away from casinos.",
    officialUrl: "https://animabyedo.com/",
    photo: images.anima,
    hours: daily("Dinner from 5:00 PM; last reservation 8:45 PM"),
    bookingUrl: "https://animabyedo.com/",
    price: "$$$",
    priceSource: "Official à la carte and tasting menus checked July 2026.",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["Spanish", "Mediterranean", "Italian"],
    subcategory: "Chef-driven small plates",
    attributeTags: ["southwest-las-vegas", "tasting-menu", "vegetarian-options", "reservations-recommended"],
    editorialUrls: [eaterRestaurants, "https://vegas.eater.com/maps/best-restaurants-off-strip-las-vegas"],
  }),
  stop({
    id: "las-vegas-wing-lei",
    name: "Wing Lei",
    coordinates: [36.1256805, -115.1595791],
    description: "Wynn's gold-toned dining room pairs refined Cantonese cooking with one of the Strip's most formal services. It is a strong choice for Peking duck or a banquet-style dinner rather than an improvised casino meal.",
    officialUrl: "https://www.wynnlasvegas.com/dining/fine-dining/wing-lei",
    photo: images.wingLei,
    hours: { mon: "5:30 PM–9:30 PM", tue: "Closed", wed: "Closed", thu: "5:30 PM–9:30 PM", fri: "5:30 PM–10:00 PM", sat: "5:30 PM–10:00 PM", sun: "5:30 PM–9:30 PM" },
    bookingUrl: "https://www.wynnlasvegas.com/dining/fine-dining/wing-lei",
    price: "$$$$",
    priceSource: "Official menu and reservation page checked July 2026.",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["Cantonese", "Chinese", "Fine dining"],
    subcategory: "Cantonese fine dining",
    attributeTags: ["reservations-recommended", "special-occasion", "peking-duck", "strip"],
    editorialUrls: [eaterRestaurants, cnRestaurants],
  }),
  stop({
    id: "las-vegas-carbone",
    name: "Carbone",
    coordinates: [36.1083317, -115.1766353],
    description: "ARIA's theatrical Italian-American room turns tableside service, spicy rigatoni, and red-sauce glamour into a full Strip production. High demand makes the official reservation calendar more important than a nominal closing time.",
    officialUrl: "https://aria.mgmresorts.com/en/restaurants/carbone.html",
    photo: images.carbone,
    hours: { mon: "5:00 PM–10:30 PM", tue: "5:00 PM–10:30 PM", wed: "5:00 PM–10:30 PM", thu: "5:00 PM–10:30 PM", fri: "5:00 PM–11:00 PM", sat: "5:00 PM–11:00 PM", sun: "5:00 PM–10:30 PM" },
    bookingUrl: "https://aria.mgmresorts.com/en/restaurants/carbone.html",
    price: "$$$$",
    priceSource: "Official menu and reservation page checked July 2026.",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["Italian American", "Italian"],
    subcategory: "Italian American",
    attributeTags: ["reservations-essential", "tableside-service", "special-occasion", "strip"],
    editorialUrls: [eaterRestaurants, infatuationRestaurants],
  }),
  stop({
    id: "las-vegas-bazaar-mar",
    name: "Bazaar Mar",
    coordinates: [36.1077414, -115.1742962],
    description: "José Andrés's seafood room at The Shops at Crystals moves from raw-bar bites to whole fish and playful small plates. It works best for groups willing to share and order broadly across the menu.",
    officialUrl: "https://www.thebazaar.com/location/the-bazaar-mar-las-vegas-nv/",
    photo: images.bazaarMar,
    hours: { mon: "5:00 PM–9:00 PM", tue: "5:00 PM–9:00 PM", wed: "5:00 PM–9:00 PM", thu: "5:00 PM–9:00 PM", fri: "5:00 PM–10:00 PM", sat: "5:00 PM–10:00 PM", sun: "5:00 PM–9:00 PM" },
    bookingUrl: "https://www.thebazaar.com/location/the-bazaar-mar-las-vegas-nv/",
    price: "$$$$",
    priceSource: "Official menu and reservation page checked July 2026.",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["Seafood", "Spanish"],
    subcategory: "Seafood",
    attributeTags: ["reservations-recommended", "raw-bar", "group-friendly", "strip"],
    editorialUrls: [eaterRestaurants, cnRestaurants],
  }),
  stop({
    id: "las-vegas-esthers-kitchen",
    name: "Esther's Kitchen",
    coordinates: [36.1577291, -115.1534213],
    description: "This Arts District anchor makes sourdough, pasta, and seasonal Italian plates in a bright neighborhood dining room. It is the most useful all-day choice here, but dinner and weekend brunch still reward reservations.",
    officialUrl: "https://www.estherslv.com/location/esthers-kitchen/",
    photo: images.esthers,
    hours: { mon: "11:00 AM–3:00 PM; 5:00 PM–11:00 PM", tue: "11:00 AM–3:00 PM; 5:00 PM–11:00 PM", wed: "11:00 AM–3:00 PM; 5:00 PM–11:00 PM", thu: "11:00 AM–3:00 PM; 5:00 PM–11:00 PM", fri: "11:00 AM–3:00 PM; 5:00 PM–11:00 PM", sat: "10:00 AM–3:00 PM; 5:00 PM–11:00 PM", sun: "10:00 AM–3:00 PM; 5:00 PM–11:00 PM" },
    bookingUrl: "https://www.estherslv.com/location/esthers-kitchen/",
    price: "$$$",
    priceSource: "Official menu checked July 2026.",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["Italian", "New American"],
    subcategory: "Neighborhood restaurant",
    attributeTags: ["arts-district", "housemade-pasta", "brunch", "reservations-recommended"],
    editorialUrls: [eaterRestaurants, infatuationRestaurants],
  }),
  stop({
    id: "las-vegas-lotus-of-siam-flamingo",
    name: "Lotus of Siam – Flamingo Road",
    coordinates: [36.115159, -115.149637],
    description: "The Flamingo Road location carries Lotus of Siam's deep northern Thai menu, from khao soi to chile-forward specialties and a serious German-wine list. Confirm this branch when booking; the guide does not point to the separate Red Rock location.",
    officialUrl: "https://www.lotusofsiamlv.com/contact",
    photo: images.lotus,
    hours: daily("11:30 AM–10:00 PM"),
    bookingUrl: "https://www.lotusofsiamlv.com/contact",
    price: "$$",
    priceSource: "Official menu checked July 2026.",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["Northern Thai", "Thai"],
    subcategory: "Northern Thai",
    attributeTags: ["off-strip", "spicy", "wine-list", "group-friendly"],
    editorialUrls: [eaterRestaurants, cnRestaurants],
  }),
  stop({
    id: "las-vegas-sparrow-and-wolf",
    name: "Sparrow + Wolf",
    coordinates: [36.1263855, -115.2014123],
    description: "Chef Brian Howard's Chinatown room folds live-fire cooking and globally influenced small plates into a distinctly Las Vegas menu. Sit at the counter for a closer look at the kitchen or bring a group ready to share.",
    officialUrl: "https://sparrowandwolflv.com/",
    photo: images.sparrowWolf,
    hours: daily("5:00 PM–10:00 PM"),
    bookingUrl: "https://sparrowandwolflv.com/",
    price: "$$$",
    priceSource: "Official menu checked July 2026.",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["New American", "Global"],
    subcategory: "Chef-driven small plates",
    attributeTags: ["chinatown", "live-fire", "sharing-plates", "reservations-recommended"],
    editorialUrls: [eaterRestaurants, infatuationRestaurants],
  }),
  stop({
    id: "las-vegas-partage",
    name: "Partage",
    coordinates: [36.1264368, -115.1908959],
    description: "Partage brings contemporary French tasting menus to Chinatown without a casino setting. Choose the menu length before arrival and leave time for a paced meal; this is a reservation-led dinner, not a quick pre-show stop.",
    officialUrl: "https://partage.vegas/",
    photo: images.partage,
    hours: { mon: "Closed", tue: "5:30 PM–9:00 PM", wed: "5:30 PM–9:00 PM", thu: "5:30 PM–9:00 PM", fri: "5:30 PM–9:00 PM", sat: "5:30 PM–9:00 PM", sun: "Closed" },
    bookingUrl: "https://partage.vegas/",
    price: "$$$",
    priceSource: "Official tasting-menu page checked July 2026.",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["French", "Fine dining"],
    subcategory: "Tasting menu",
    attributeTags: ["chinatown", "tasting-menu", "reservations-essential", "off-strip"],
    editorialUrls: [eaterRestaurants, infatuationRestaurants],
  }),
  stop({
    id: "las-vegas-kaiseki-yuzu",
    name: "Kaiseki Yuzu",
    coordinates: [36.12707, -115.1924672],
    description: "A small, reservation-only kaiseki counter where seasonal Japanese courses arrive in a fixed progression. The official booking page offers two seatings on operating nights, so late walk-in flexibility is effectively zero.",
    officialUrl: "https://www.kaisekiyuzu.com/",
    photo: images.kaisekiYuzu,
    hours: { mon: "5:30 PM or 8:15 PM seatings", tue: "Closed", wed: "Closed", thu: "5:30 PM or 8:15 PM seatings", fri: "5:30 PM or 8:15 PM seatings", sat: "5:30 PM or 8:15 PM seatings", sun: "5:30 PM or 8:15 PM seatings" },
    bookingUrl: "https://www.kaisekiyuzu.com/",
    price: "$$$$",
    priceSource: "Official kaiseki and reservation page checked July 2026.",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["Japanese", "Kaiseki"],
    subcategory: "Kaiseki",
    attributeTags: ["chinatown", "tasting-menu", "reservations-essential", "counter-seating"],
    editorialUrls: [eaterRestaurants, infatuationRestaurants],
  }),
];

const cheapEatStops: GuideStop[] = [
  stop({ id: "las-vegas-tacos-el-gordo", name: "Tacos El Gordo", coordinates: [36.1321219, -115.1648463], description: "The Strip-adjacent counter is built for Tijuana-style tacos ordered by meat line: adobada, asada, lengua, and suadero each have their own queue. Split up, order deliberately, and expect a crowd after shows.", officialUrl: "https://tacoselgordobc.com/locations/", photo: images.tacosElGordo, hours: { mon: "10:00 AM–2:00 AM", tue: "10:00 AM–2:00 AM", wed: "10:00 AM–2:00 AM", thu: "10:00 AM–2:00 AM", fri: "10:00 AM–4:00 AM", sat: "10:00 AM–4:00 AM", sun: "10:00 AM–2:00 AM" }, price: "$", priceSource: "Official menu checked July 2026.", venueKind: "food_drink", foodServiceType: "counter_service", cuisineTypes: ["Mexican", "Tijuana-style tacos"], subcategory: "Taco counter", attributeTags: ["late-night", "counter-service", "strip", "quick-meal"], editorialUrls: [eaterCheap] }),
  stop({ id: "las-vegas-shang-artisan-noodle", name: "Shang Artisan Noodle", coordinates: [36.114907, -115.2097592], description: "Watch hand-pulled or knife-shaved noodles go into beef broth, dan dan sauce, and stir-fries at this compact Chinatown-area room. The portions and quick turnover make it a reliable lunch between more elaborate Vegas meals.", officialUrl: "https://www.shangartisannoodle.com/location", photo: images.shang, hours: daily("11:00 AM–10:00 PM"), price: "$$", priceSource: "Official menu checked July 2026.", venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["Chinese", "Noodles"], subcategory: "Noodle shop", attributeTags: ["hand-pulled-noodles", "off-strip", "quick-meal", "chinatown-area"], editorialUrls: [eaterCheap, infatuationRestaurants] }),
  stop({ id: "las-vegas-monta-ramen", name: "Monta Ramen", coordinates: [36.1270214, -115.209544], description: "Monta specializes in Kurume-style tonkotsu ramen with a focused menu and no casino theatrics. The small room fills quickly, so treat it as a fast bowl rather than a lingering group dinner.", officialUrl: "https://www.montaramen.com/", photo: images.monta, hours: daily("11:30 AM–11:00 PM"), price: "$", priceSource: "Official menu checked July 2026.", venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["Japanese", "Ramen"], subcategory: "Ramen shop", attributeTags: ["chinatown", "quick-meal", "small-dining-room", "late-night"], editorialUrls: [eaterCheap] }),
  stop({ id: "las-vegas-good-pie", name: "Good Pie", coordinates: [36.1571872, -115.1537721], description: "An Arts District pizzeria covering Brooklyn rounds, Grandma slices, Detroit squares, and gluten-free options. Order by the slice for a gallery-hop break or take a whole pie to a brewery table nearby.", officialUrl: "https://www.goodpie.com/location/good-pie/", photo: images.goodPie, hours: { mon: "11:00 AM–10:00 PM", tue: "11:00 AM–10:00 PM", wed: "11:00 AM–10:00 PM", thu: "11:00 AM–10:00 PM", fri: "11:00 AM–11:00 PM", sat: "11:00 AM–11:00 PM", sun: "11:00 AM–10:00 PM" }, price: "$", priceSource: "Official menu checked July 2026.", venueKind: "food_drink", foodServiceType: "counter_service", cuisineTypes: ["Pizza", "Italian American"], subcategory: "Pizzeria", attributeTags: ["arts-district", "by-the-slice", "gluten-free-options", "quick-meal"], editorialUrls: [eaterCheap] }),
  stop({ id: "las-vegas-evel-pie", name: "Evel Pie", coordinates: [36.169242, -115.140074], description: "A loud Evel Knievel-themed slice shop on Fremont East with inexpensive pizza, beer, and genuinely late hours. It is most useful after downtown bars, when table-service plans have long disappeared.", officialUrl: "https://www.evelpie.com/location/evel-pie/", photo: images.evelPie, hours: { mon: "11:00 AM–2:00 AM", tue: "11:00 AM–2:00 AM", wed: "11:00 AM–2:00 AM", thu: "11:00 AM–2:00 AM", fri: "11:00 AM–4:00 AM", sat: "11:00 AM–4:00 AM", sun: "11:00 AM–2:00 AM" }, price: "$", priceSource: "Official menu checked July 2026.", venueKind: "food_drink", foodServiceType: "counter_service", cuisineTypes: ["Pizza", "Italian American"], subcategory: "Pizza by the slice", attributeTags: ["downtown", "late-night", "by-the-slice", "casual"], editorialUrls: [eaterCheap] }),
  stop({ id: "las-vegas-fukuburger-chinatown", name: "Fukuburger – Chinatown", coordinates: [36.1266049, -115.2253053], description: "Japanese-American burgers arrive with furikake, teriyaki, wasabi mayo, and crisp fries at Fukuburger's Chinatown shop. It is a practical, flavor-heavy counter meal that stays open well past dinner.", officialUrl: "https://www.fukuburger.com/food-truck-schedule-1", photo: images.fukuburger, hours: daily("11:30 AM–1:00 AM"), price: "$", priceSource: "Official menu checked July 2026.", venueKind: "food_drink", foodServiceType: "fast_casual", cuisineTypes: ["Japanese American", "Burgers"], subcategory: "Burger shop", attributeTags: ["chinatown", "late-night", "counter-service", "casual"], editorialUrls: [eaterCheap, infatuationRestaurants] }),
  stop({ id: "las-vegas-viva-las-arepas", name: "Viva Las Arepas", coordinates: [36.1518889, -115.1521063], description: "Venezuelan arepas come split and packed with shredded beef, chicken, cheese, beans, or pork at this no-frills Las Vegas Boulevard counter. It is fast, filling, and especially useful before an Arts District night.", officialUrl: "https://vivalasarepas.com/page/contact-us", photo: images.vivaArepas, hours: daily("9:00 AM–10:00 PM"), price: "$", priceSource: "Official menu checked July 2026.", venueKind: "food_drink", foodServiceType: "counter_service", cuisineTypes: ["Venezuelan", "Arepas"], subcategory: "Arepa counter", attributeTags: ["counter-service", "gluten-free-options", "quick-meal", "off-strip"], editorialUrls: [eaterCheap] }),
  stop({ id: "las-vegas-bajamar-seafood-and-tacos", name: "Bajamar Seafood & Tacos", coordinates: [36.1517351, -115.151815], description: "Baja-style fish and shrimp tacos are the point at this compact counter north of the Strip. Order a few different tacos rather than one oversized plate, and note the earlier Sunday close.", officialUrl: "https://bajamarlv.com/", photo: images.bajamar, hours: { mon: "11:00 AM–7:00 PM", tue: "11:00 AM–7:00 PM", wed: "11:00 AM–7:00 PM", thu: "11:00 AM–7:00 PM", fri: "11:00 AM–8:00 PM", sat: "11:00 AM–8:00 PM", sun: "11:00 AM–6:00 PM" }, price: "$", priceSource: "Official menu checked July 2026.", venueKind: "food_drink", foodServiceType: "counter_service", cuisineTypes: ["Mexican", "Baja seafood"], subcategory: "Seafood taco counter", attributeTags: ["fish-tacos", "counter-service", "quick-meal", "off-strip"], editorialUrls: [eaterCheap] }),
  stop({ id: "las-vegas-cornish-pasty-co", name: "Cornish Pasty Co.", coordinates: [36.1589762, -115.1533256], description: "This Arts District pub wraps traditional steak-and-potato and more freewheeling fillings into substantial pasties. It is an unusually good late-night group option because meat, vegan, and vegetarian choices share one menu.", officialUrl: "https://www.cornishpastyco.com/locations/", photo: images.cornishPasty, hours: { mon: "11:00 AM–12:00 AM", tue: "11:00 AM–12:00 AM", wed: "11:00 AM–12:00 AM", thu: "11:00 AM–12:00 AM", fri: "11:00 AM–2:00 AM", sat: "11:00 AM–2:00 AM", sun: "11:00 AM–12:00 AM" }, price: "$$", priceSource: "Official menu checked July 2026.", venueKind: "food_drink", foodServiceType: "pub", cuisineTypes: ["British", "Pub food"], subcategory: "Pasty pub", attributeTags: ["arts-district", "late-night", "vegetarian-options", "group-friendly"], editorialUrls: [eaterCheap] }),
  stop({ id: "las-vegas-village-pub-ellis-island", name: "Village Pub at Ellis Island", coordinates: [36.1132965, -115.163954], description: "The 24-hour casino pub is a pressure-release valve for the Strip: breakfast, burgers, barbecue, and the long-running steak special without resort pricing. It is functional rather than glamorous, which is exactly the appeal.", officialUrl: "https://www.ellisislandcasino.com/the-village-pub", photo: images.villagePub, hours: daily("Open 24 hours"), price: "$", priceSource: "Official menu checked July 2026.", venueKind: "food_drink", foodServiceType: "pub", cuisineTypes: ["American", "Pub food"], subcategory: "Casino coffee shop", attributeTags: ["open-24-hours", "near-strip", "breakfast", "value"], editorialUrls: [eaterCheap] }),
];

const hotelStops: GuideStop[] = [
  stop({ id: "las-vegas-bellagio-hotel", name: "Bellagio", coordinates: [36.1123192, -115.178723], description: "Choose Bellagio for a center-Strip base with fountain views, a serious art gallery, conservatory, pools, and a deep restaurant bench. Rooms in such a large resort vary, so select the exact tower and view rather than relying on the name alone.", officialUrl: "https://bellagio.mgmresorts.com/en.html", bookingUrl: "https://www.booking.com/hotel/us/bellagio.html", photo: images.bellagio, hours: daily("Open 24 hours; official booking calendar controls room inventory and amenity schedules"), price: "$$$$", priceSource: "Official property and booking pages checked July 2026.", venueKind: "lodging", lodgingType: "hotel", subcategory: "Luxury casino hotel", attributeTags: ["strip", "pool", "spa", "fine-dining", "fountain-views"], editorialUrls: [cnHotels] }),
  stop({ id: "las-vegas-wynn-hotel", name: "Wynn Las Vegas", coordinates: [36.1256805, -115.1595791], description: "Wynn is the polished north-Strip choice for travelers who want high service levels, strong dining, pools, spa facilities, and nightlife under one roof. The self-contained scale suits a resort-first trip more than constant downtown exploration.", officialUrl: "https://www.wynnlasvegas.com/", bookingUrl: "https://www.booking.com/hotel/us/wynn-las-vegas-boulevard.html", photo: images.wynn, hours: daily("Open 24 hours; official booking calendar controls room inventory and amenity schedules"), price: "$$$$", priceSource: "Official property and booking pages checked July 2026.", venueKind: "lodging", lodgingType: "hotel", subcategory: "Luxury casino hotel", attributeTags: ["north-strip", "pool", "spa", "fine-dining", "nightlife"], editorialUrls: [cnHotels] }),
  stop({ id: "las-vegas-venetian-hotel", name: "The Venetian Resort", coordinates: [36.1217073, -115.1693352], description: "All-suite rooms and an enormous restaurant-and-shopping complex make The Venetian useful for groups, conventions, and first-time Strip stays. Walking distances inside the property are substantial; choose it because you want the city-within-a-city format.", officialUrl: "https://www.venetianlasvegas.com/hotel/the-venetian.html", bookingUrl: "https://www.booking.com/hotel/us/the-venetian-resort-casino.html", photo: images.venetian, hours: daily("Open 24 hours; official booking calendar controls room inventory and amenity schedules"), price: "$$$$", priceSource: "Official property and booking pages checked July 2026.", venueKind: "lodging", lodgingType: "hotel", subcategory: "All-suite casino hotel", attributeTags: ["strip", "all-suite", "convention-friendly", "shopping", "group-friendly"], editorialUrls: [cnHotels] }),
  stop({ id: "las-vegas-cosmopolitan-hotel", name: "The Cosmopolitan of Las Vegas", coordinates: [36.1101567, -115.1740915], description: "The Cosmopolitan combines center-Strip geography with balcony rooms, a dense food collection, and nightlife that stays lively deep into the evening. Book a terrace category if the outdoor space is central to the trip; not every room has one.", officialUrl: "https://cosmopolitanlasvegas.mgmresorts.com/en.html", bookingUrl: "https://www.booking.com/hotel/us/the-cosmopolitan-of-las-vegas-las-vegas2.html", photo: images.cosmopolitan, hours: daily("Open 24 hours; official booking calendar controls room inventory and amenity schedules"), price: "$$$$", priceSource: "Official property and booking pages checked July 2026.", venueKind: "lodging", lodgingType: "hotel", subcategory: "Luxury casino hotel", attributeTags: ["center-strip", "balcony-rooms", "nightlife", "food-hall", "pool"], editorialUrls: [cnHotels] }),
  stop({ id: "las-vegas-fontainebleau-hotel", name: "Fontainebleau Las Vegas", coordinates: [36.1374208, -115.1592284], description: "This high-rise north-Strip resort brings contemporary rooms, a broad pool deck, spa, restaurants, and a major nightclub into one vertically organized property. Its location works best when the resort itself or the nearby convention center anchors the stay.", officialUrl: "https://www.fontainebleaulasvegas.com/", bookingUrl: "https://www.booking.com/hotel/us/fontainebleau-las-vegas.html", photo: images.fontainebleau, hours: daily("Open 24 hours; official booking calendar controls room inventory and amenity schedules"), price: "$$$$", priceSource: "Official property and booking pages checked July 2026.", venueKind: "lodging", lodgingType: "hotel", subcategory: "Luxury casino hotel", attributeTags: ["north-strip", "convention-friendly", "pool", "spa", "nightlife"], editorialUrls: [cnHotels] }),
  stop({ id: "las-vegas-four-seasons-hotel", name: "Four Seasons Hotel Las Vegas", coordinates: [36.0912656, -115.1749144], description: "Four Seasons occupies nongaming floors within Mandalay Bay, providing a quieter lobby, its own pool, and polished service while retaining access to the larger resort. It is the clearest Strip answer for travelers who want luxury without crossing a casino to check in.", officialUrl: "https://www.fourseasons.com/lasvegas/", bookingUrl: "https://www.booking.com/hotel/us/four-seasons-las-vegas.html", photo: images.fourSeasons, hours: daily("Open 24 hours; official booking calendar controls room inventory and amenity schedules"), price: "$$$$", priceSource: "Official property and booking pages checked July 2026.", venueKind: "lodging", lodgingType: "hotel", subcategory: "Nongaming luxury hotel", attributeTags: ["south-strip", "nongaming", "quiet-base", "pool", "spa"], editorialUrls: [cnHotels] }),
  stop({ id: "las-vegas-aria-hotel", name: "ARIA Resort & Casino", coordinates: [36.1083317, -115.1766353], description: "ARIA's modern rooms, central location, large pool complex, spa, and restaurant roster make it a balanced first-timer base. It is especially convenient for CityCenter dining, though navigating the connected complexes still takes time.", officialUrl: "https://aria.mgmresorts.com/en.html", bookingUrl: "https://www.booking.com/hotel/us/aria-resort-casino.html", photo: images.aria, hours: daily("Open 24 hours; official booking calendar controls room inventory and amenity schedules"), price: "$$$$", priceSource: "Official property and booking pages checked July 2026.", venueKind: "lodging", lodgingType: "hotel", subcategory: "Luxury casino hotel", attributeTags: ["center-strip", "pool", "spa", "fine-dining", "tram-access"], editorialUrls: [cnHotels] }),
  stop({ id: "las-vegas-circa-hotel", name: "Circa Resort & Casino", coordinates: [36.1697494, -115.1415836], description: "Circa is downtown's adults-only hotel play, built around a giant sports book, Stadium Swim, and immediate Fremont Street access. The 21-and-over property is energetic and sports-focused, not a quiet family base.", officialUrl: "https://www.circalasvegas.com/", bookingUrl: "https://www.booking.com/hotel/us/circa-resort-amp-casino.html", photo: images.circa, hours: daily("Open 24 hours; official booking calendar controls room inventory and amenity schedules"), price: "$$$", priceSource: "Official property and booking pages checked July 2026.", venueKind: "lodging", lodgingType: "hotel", subcategory: "Adults-only casino hotel", attributeTags: ["downtown", "adults-only", "sportsbook", "pool", "fremont-street"], editorialUrls: [cnHotels] }),
  stop({ id: "las-vegas-golden-nugget-hotel", name: "Golden Nugget Las Vegas", coordinates: [36.1700371, -115.1454312], description: "The Golden Nugget supplies classic downtown casino atmosphere, a central Fremont address, and a pool built around a shark tank. Tower choice matters for room age, street noise, and walking distance inside the property.", officialUrl: "https://goldennugget.com/las-vegas/hotel/", bookingUrl: "https://www.booking.com/hotel/us/golden-nugget-amp-casino-las-vegas.html", photo: images.goldenNugget, hours: daily("Open 24 hours; official booking calendar controls room inventory and amenity schedules"), price: "$$$", priceSource: "Official property and booking pages checked July 2026.", venueKind: "lodging", lodgingType: "hotel", subcategory: "Downtown casino hotel", attributeTags: ["downtown", "fremont-street", "pool", "classic-vegas", "value-luxury"], editorialUrls: [cnHotels] }),
  stop({ id: "las-vegas-red-rock-hotel", name: "Red Rock Casino Resort & Spa", coordinates: [36.158, -115.33382], description: "Red Rock trades Strip access for a polished suburban resort near Summerlin and Red Rock Canyon. It makes sense for pool, spa, golf, or hiking-oriented trips with a car; it is a poor base for repeated Strip nights.", officialUrl: "https://redrockresort.com/stay/", bookingUrl: "https://www.booking.com/hotel/us/red-rock-casino-resort-amp-spa.html", photo: images.redRock, hours: daily("Open 24 hours; official booking calendar controls room inventory and amenity schedules"), price: "$$$", priceSource: "Official property and booking pages checked July 2026.", venueKind: "lodging", lodgingType: "hotel", subcategory: "Off-Strip casino hotel", attributeTags: ["summerlin", "near-red-rock-canyon", "pool", "spa", "car-recommended"], editorialUrls: [cnHotels] }),
];

const casualBarStops: GuideStop[] = [
  stop({ id: "las-vegas-atomic-liquors", name: "Atomic Liquors", coordinates: [36.1667395, -115.1355199], description: "Las Vegas's oldest freestanding bar keeps its tavern scale, rooftop-history mythology, and a modern craft-beer list at the eastern edge of Fremont. The patio is the move in tolerable weather; weekend nights can feel much busier than the room suggests.", officialUrl: "https://atomic.vegas/home", photo: images.atomicLiquors, hours: { mon: "12:00 PM–2:00 AM", tue: "12:00 PM–2:00 AM", wed: "12:00 PM–2:00 AM", thu: "12:00 PM–2:00 AM", fri: "12:00 PM–3:00 AM", sat: "12:00 PM–3:00 AM", sun: "12:00 PM–2:00 AM" }, price: "$$", priceSource: "Official drinks page checked July 2026.", venueKind: "nightlife", nightlifeType: "dive_bar", subcategory: "Historic tavern", attributeTags: ["downtown", "patio", "craft-beer", "historic"], editorialUrls: [eaterBars, infatuationBars] }),
  stop({ id: "las-vegas-dinos-lounge", name: "Dino's Lounge", coordinates: [36.1529634, -115.1511118], description: "Dino's is a cash-friendly, 24-hour neighborhood dive where karaoke takes over Thursday through Saturday nights. Expect strong pours, cigarette smoke, and regulars rather than themed Vegas polish.", officialUrl: "https://dinoslv.com/", photo: images.dinos, hours: daily("Open 24 hours; karaoke Thursday–Saturday from 10:00 PM"), price: "$", priceSource: "Official bar information checked July 2026.", venueKind: "nightlife", nightlifeType: "karaoke_bar", musicGenres: ["Karaoke"], subcategory: "Dive karaoke bar", attributeTags: ["open-24-hours", "karaoke", "smoking", "local-bar"], editorialUrls: [eaterBars, infatuationBars] }),
  stop({ id: "las-vegas-double-down-saloon", name: "Double Down Saloon", coordinates: [36.1053825, -115.1509162], description: "A 24-hour punk dive near the university, famous for graffiti, loud bands, and its deliberately confrontational house shot. Go for underground Vegas character, not comfort, cocktails, or a smoke-free room.", officialUrl: "https://doubledownsaloon.com/", photo: images.doubleDown, hours: daily("Open 24 hours"), price: "$", priceSource: "Official bar information checked July 2026.", venueKind: "nightlife", nightlifeType: "dive_bar", musicGenres: ["Punk", "Rock"], subcategory: "Punk dive bar", attributeTags: ["open-24-hours", "live-music", "punk", "smoking"], editorialUrls: [eaterBars, infatuationBars] }),
  stop({ id: "las-vegas-frankies-tiki-room", name: "Frankie's Tiki Room", coordinates: [36.1587264, -115.1642554], description: "Frankie's packs original tiki carvings, very dark lighting, and potent rum drinks into a compact 24-hour room west of downtown. It is immersive and unapologetically smoky, with collectible mugs for travelers who want the full ritual.", officialUrl: "https://frankiestikiroom.com/", photo: images.frankies, hours: daily("Open 24 hours"), price: "$$", priceSource: "Official drinks page checked July 2026.", venueKind: "nightlife", nightlifeType: "dive_bar", subcategory: "Tiki dive", attributeTags: ["open-24-hours", "tiki", "rum", "smoking"], editorialUrls: [eaterBars, infatuationBars] }),
  stop({ id: "las-vegas-hard-hat-lounge", name: "Hard Hat Lounge", coordinates: [36.1513407, -115.1599221], description: "A restored 1962 tavern with its original Frank Bowers mural, a compact bar, and burgers from Stay Tuned Burgers. It preserves neighborhood-dive texture while giving food a real reason to visit before midnight.", officialUrl: "https://hardhatloungelv.com/", photo: images.hardHat, hours: daily("Open 24 hours"), price: "$", priceSource: "Official bar and food menu checked July 2026.", venueKind: "nightlife", nightlifeType: "dive_bar", subcategory: "Historic neighborhood bar", attributeTags: ["open-24-hours", "historic", "burgers", "local-bar"], editorialUrls: [eaterBars] }),
  stop({ id: "las-vegas-stage-door-casino", name: "Stage Door Casino", coordinates: [36.114949, -115.1683579], description: "This tiny 24-hour casino bar behind the Cromwell is the blunt antidote to Strip drink prices: bottled beer, basic mixed drinks, video poker, and hot dogs. Security procedures and a no-frills room are part of the bargain.", officialUrl: "https://stagedoorcasino.com/contact/", photo: images.stageDoor, hours: daily("Open 24 hours"), price: "$", priceSource: "Official property information checked July 2026.", venueKind: "nightlife", nightlifeType: "gaming_bar", subcategory: "Casino dive bar", attributeTags: ["open-24-hours", "near-strip", "video-poker", "value"], editorialUrls: [eaterBars, infatuationBars] }),
  stop({ id: "las-vegas-silver-stamp", name: "The Silver Stamp", coordinates: [36.1545216, -115.1518146], description: "The Silver Stamp resembles a lovingly preserved Midwestern basement bar and pours one of the city's most thoughtful beer lists. Ask the bartenders for guidance, then settle into a booth rather than treating it as a quick crawl stop.", officialUrl: "https://silverstamplv.com/", photo: images.silverStamp, hours: daily("1:00 PM–1:00 AM"), price: "$$", priceSource: "Official drinks information checked July 2026.", venueKind: "nightlife", nightlifeType: "beer_bar", subcategory: "Craft beer bar", attributeTags: ["arts-district", "craft-beer", "quiet-conversation", "local-bar"], editorialUrls: [eaterBars, infatuationBars] }),
  stop({ id: "las-vegas-rebar", name: "ReBAR", coordinates: [36.1565826, -115.1535043], description: "Part antique shop, part patio bar, ReBAR lets guests drink among salvaged signs and buy much of the decor. It is an easy daytime-to-late-night Arts District anchor with events, bar food, and a sociable yard.", officialUrl: "https://rebarlv.com/", photo: images.rebar, hours: { mon: "12:00 PM–12:00 AM", tue: "12:00 PM–12:00 AM", wed: "12:00 PM–12:00 AM", thu: "12:00 PM–12:00 AM", fri: "12:00 PM–2:00 AM", sat: "12:00 PM–2:00 AM", sun: "12:00 PM–2:00 AM" }, price: "$$", priceSource: "Official drinks and events pages checked July 2026.", venueKind: "nightlife", nightlifeType: "pub", subcategory: "Patio bar", attributeTags: ["arts-district", "patio", "events", "antiques"], editorialUrls: [eaterBars] }),
  stop({ id: "las-vegas-sand-dollar-lounge", name: "The Sand Dollar Lounge", coordinates: [36.12603, -115.1847883], description: "The original Sand Dollar is a late-night live-music bar where blues, rock, pizza, and cocktails share the room. The official music calendar determines the night's character, so check the bill before committing.", officialUrl: "https://thesanddollarlv.com/lounge/", photo: images.sandDollar, hours: daily("4:00 PM–4:00 AM; official live-music calendar controls performance times"), price: "$$", priceSource: "Official drinks and events pages checked July 2026.", venueKind: "nightlife", nightlifeType: "live_music_venue", musicGenres: ["Blues", "Rock", "Roots"], subcategory: "Live-music bar", attributeTags: ["late-night", "live-music", "pizza", "off-strip"], editorialUrls: [eaterBars, infatuationBars] }),
  stop({ id: "las-vegas-hogs-heifers-outpost", name: "Hogs & Heifers Saloon – OUTPOST", coordinates: [36.1715877, -115.1470854], description: "Hogs & Heifers now operates its loud, bartender-led OUTPOST at the Plaza's Main Street address, not the former Third Street building. Expect motorcycles, bras overhead, shouted toasts, and an intentionally rowdy floor.", officialUrl: "https://hogsandheiferslasvegas.com/contact/", photo: images.hogs, mapQuery: "Hogs and Heifers Saloon OUTPOST Plaza Hotel Las Vegas", hours: daily("1:00 PM–4:00 AM"), price: "$", priceSource: "Official current-location and bar pages checked July 2026.", venueKind: "nightlife", nightlifeType: "dive_bar", subcategory: "Biker bar", attributeTags: ["downtown", "late-night", "rowdy", "relocated-venue"], editorialUrls: [eaterBars] }),
];

const cocktailStops: GuideStop[] = [
  stop({ id: "las-vegas-velveteen-rabbit", name: "Velveteen Rabbit", coordinates: [36.1571207, -115.153777], description: "Sisters Pamela and Christina Dylag built an Arts District cocktail bar with seasonal menus, vintage furniture, and an intimate back patio. It feels handmade rather than casino-produced and works especially well for a first drink before dinner nearby.", officialUrl: "https://velveteenrabbitlv.com/drink", photo: images.velveteen, hours: { mon: "5:00 PM–12:00 AM", tue: "5:00 PM–12:00 AM", wed: "5:00 PM–12:00 AM", thu: "5:00 PM–12:00 AM", fri: "5:00 PM–2:00 AM", sat: "5:00 PM–2:00 AM", sun: "5:00 PM–12:00 AM" }, price: "$$", priceSource: "Official drinks page checked July 2026.", venueKind: "nightlife", nightlifeType: "cocktail_bar", subcategory: "Neighborhood cocktail bar", attributeTags: ["arts-district", "seasonal-menu", "patio", "date-night"], editorialUrls: [eaterBars, infatuationBars] }),
  stop({ id: "las-vegas-herbs-and-rye", name: "Herbs & Rye", coordinates: [36.1442327, -115.1910672], description: "Herbs & Rye organizes its cocktail list by historical era and backs it with steaks and a long-running late-night service. The dark room is popular with hospitality workers; reservations help if dinner matters as much as drinks.", officialUrl: "https://www.herbsandrye.com/index.html", photo: images.herbsRye, hours: { mon: "5:00 PM–3:00 AM", tue: "5:00 PM–3:00 AM", wed: "5:00 PM–3:00 AM", thu: "5:00 PM–3:00 AM", fri: "5:00 PM–3:00 AM", sat: "5:00 PM–3:00 AM", sun: "Closed" }, bookingUrl: "https://www.herbsandrye.com/index.html", price: "$$$", priceSource: "Official food and drinks menus checked July 2026.", venueKind: "nightlife", nightlifeType: "cocktail_bar", subcategory: "Cocktail and steak bar", attributeTags: ["late-night", "cocktail-history", "steakhouse", "reservations-recommended"], editorialUrls: [eaterBars, infatuationBars] }),
  stop({ id: "las-vegas-golden-tiki", name: "The Golden Tiki", coordinates: [36.1261193, -115.1922894], description: "An elaborate Chinatown tiki bar filled with carved figures, moving effects, shrunken-head portraits, and rum-heavy drinks. It never closes, but reservations are issued in two-hour windows and are prudent at conventional nightlife hours.", officialUrl: "https://www.thegoldentiki.com/contact/", photo: images.goldenTiki, hours: daily("Open 24 hours; reservations use two-hour seating windows"), bookingUrl: "https://www.thegoldentiki.com/contact/", price: "$$", priceSource: "Official drinks and reservation pages checked July 2026.", venueKind: "nightlife", nightlifeType: "cocktail_bar", subcategory: "Tiki bar", attributeTags: ["chinatown", "open-24-hours", "tiki", "reservations-recommended", "age-21-plus"], editorialUrls: [eaterBars, infatuationBars] }),
  stop({ id: "las-vegas-oak-and-ivy", name: "Oak & Ivy", coordinates: [36.1677856, -115.1382149], description: "A compact whiskey-focused cocktail bar inside the Downtown Container Park, with barrel-aged drinks and bartenders who can steer both novices and collectors. Outdoor mall access makes weather and the park's entry rules part of the visit.", officialUrl: "https://oakandivy.com/", photo: images.oakIvy, hours: { mon: "3:00 PM–11:00 PM", tue: "3:00 PM–11:00 PM", wed: "3:00 PM–11:00 PM", thu: "3:00 PM–11:00 PM", fri: "12:00 PM–1:00 AM", sat: "12:00 PM–1:00 AM", sun: "3:00 PM–11:00 PM" }, price: "$$", priceSource: "Official drinks page checked July 2026.", venueKind: "nightlife", nightlifeType: "cocktail_bar", subcategory: "Whiskey bar", attributeTags: ["downtown", "whiskey", "barrel-aged-cocktails", "small-bar"], editorialUrls: [eaterBars, infatuationBars] }),
  stop({ id: "las-vegas-laundry-room", name: "The Laundry Room", coordinates: [36.1686486, -115.1398165], description: "A reservation-only, 16-seat cocktail room hidden behind Commonwealth on Fremont East. The appeal is quiet, tailored service in contrast to the street outside; follow the booking instructions and house rules before arrival.", officialUrl: "https://www.laundryroomlv.com/home", photo: images.laundryRoom, hours: { mon: "6:00 PM–10:00 PM", tue: "6:00 PM–10:00 PM", wed: "6:00 PM–10:00 PM", thu: "6:00 PM–10:00 PM", fri: "5:00 PM–9:00 PM", sat: "5:00 PM–9:00 PM", sun: "6:00 PM–10:00 PM" }, bookingUrl: "https://www.laundryroomlv.com/home", price: "$$$", priceSource: "Official reservation page checked July 2026.", venueKind: "nightlife", nightlifeType: "cocktail_bar", subcategory: "Reservation-only cocktail room", attributeTags: ["downtown", "reservations-essential", "speakeasy-style", "quiet-conversation"], editorialUrls: [eaterBars, infatuationBars] }),
  stop({ id: "las-vegas-stray-pirate", name: "Stray Pirate", coordinates: [36.1553689, -115.1550752], description: "This Arts District rum bar wraps serious tropical drinks in a playful pirate-and-dog narrative. The design is immersive, but the menu has enough balance and technique to stand apart from a novelty stop.", officialUrl: "https://straypirate.com/", photo: images.strayPirate, hours: { mon: "2:00 PM–12:00 AM", tue: "2:00 PM–12:00 AM", wed: "2:00 PM–12:00 AM", thu: "2:00 PM–12:00 AM", fri: "2:00 PM–1:00 AM", sat: "1:00 PM–1:00 AM", sun: "1:00 PM–12:00 AM" }, price: "$$", priceSource: "Official drinks page checked July 2026.", venueKind: "nightlife", nightlifeType: "cocktail_bar", subcategory: "Rum bar", attributeTags: ["arts-district", "rum", "immersive-design", "themed-bar"], editorialUrls: [eaterBars, infatuationBars] }),
  stop({ id: "las-vegas-vesper-bar", name: "Vesper Bar", coordinates: [36.1101567, -115.1740915], description: "The Cosmopolitan's lobby-level bar is a rare 24-hour option for a properly built classic cocktail in the middle of the Strip. Its location makes it best as a rendezvous point or nightcap, with constant casino traffic as the backdrop.", officialUrl: "https://cosmopolitanlasvegas.mgmresorts.com/en/nightlife/vesper.html", photo: images.vesper, hours: daily("Open 24 hours"), price: "$$$", priceSource: "Official venue page checked July 2026.", venueKind: "nightlife", nightlifeType: "cocktail_bar", subcategory: "Casino cocktail bar", attributeTags: ["strip", "open-24-hours", "classic-cocktails", "hotel-bar"], editorialUrls: [eaterBars] }),
  stop({ id: "las-vegas-the-vault", name: "The Vault", coordinates: [36.1123192, -115.178723], description: "Bellagio's small, discreet cocktail room leans into rare spirits, restrained service, and a dressed-up atmosphere. Capacity is limited and pricing is firmly luxury-tier, so it suits an intentional splurge more than a spontaneous bar crawl.", officialUrl: "https://bellagio.mgmresorts.com/en/nightlife/the-vault.html", photo: images.vault, hours: { mon: "5:00 PM–12:00 AM", tue: "5:00 PM–12:00 AM", wed: "5:00 PM–12:00 AM", thu: "5:00 PM–12:00 AM", fri: "5:00 PM–2:00 AM", sat: "5:00 PM–2:00 AM", sun: "5:00 PM–12:00 AM" }, bookingUrl: "https://bellagio.mgmresorts.com/en/nightlife/the-vault.html", price: "$$$$", priceSource: "Official venue page checked July 2026.", venueKind: "nightlife", nightlifeType: "cocktail_bar", subcategory: "Luxury cocktail room", attributeTags: ["strip", "rare-spirits", "special-occasion", "reservations-recommended"], editorialUrls: [eaterBars] }),
  stop({ id: "las-vegas-here-kitty-kitty", name: "Here Kitty Kitty Vice Den", coordinates: [36.1336945, -115.1661576], description: "A hidden cocktail den reached through Famous Foods Street Eats at Resorts World. The low-lit, Asian-inspired room offers a calmer alternative to the property's clubs, but the concealed entrance and evening-only hours reward planning.", officialUrl: "https://www.rwlasvegas.com/dining/herekittykitty/", photo: images.hereKitty, hours: { mon: "6:00 PM–12:00 AM", tue: "6:00 PM–12:00 AM", wed: "6:00 PM–12:00 AM", thu: "6:00 PM–12:00 AM", fri: "6:00 PM–1:00 AM", sat: "6:00 PM–1:00 AM", sun: "6:00 PM–12:00 AM" }, price: "$$$", priceSource: "Official drinks page checked July 2026.", venueKind: "nightlife", nightlifeType: "cocktail_bar", subcategory: "Hidden cocktail den", attributeTags: ["north-strip", "hidden-entrance", "hotel-bar", "date-night"], editorialUrls: [eaterBars] }),
  stop({ id: "las-vegas-ski-lodge", name: "Ski Lodge", coordinates: [36.1101567, -115.1740915], description: "Behind Superfrico at The Cosmopolitan, this chalet-themed bar serves cocktails and pizza in a deliberately theatrical winter set. It is more exuberant than intimate and pairs naturally with dinner or a show in the same complex.", officialUrl: "https://cosmopolitanlasvegas.mgmresorts.com/en/nightlife/ski-lodge.html", photo: images.skiLodge, hours: { mon: "2:00 PM–2:00 AM", tue: "2:00 PM–2:00 AM", wed: "2:00 PM–2:00 AM", thu: "2:00 PM–2:00 AM", fri: "12:00 PM–2:00 AM", sat: "12:00 PM–2:00 AM", sun: "12:00 PM–2:00 AM" }, price: "$$$", priceSource: "Official venue page checked July 2026.", venueKind: "nightlife", nightlifeType: "cocktail_bar", subcategory: "Themed cocktail bar", attributeTags: ["strip", "themed-bar", "pizza", "late-night"], editorialUrls: [eaterBars] }),
];

const cultureStops: GuideStop[] = [
  stop({ id: "las-vegas-neon-museum", name: "The Neon Museum", coordinates: [36.1765127, -115.1352767], description: "Retired casino and business signs turn Las Vegas design history into an outdoor collection. Summer visits are deliberately after dark; timed admission, last-entry rules, and weather make advance tickets the sensible approach.", officialUrl: "https://neonmuseum.org/your-visit/", bookingUrl: "https://neonmuseum.org/your-visit/", photo: images.neonMuseum, hours: { default: "Daily: June–August 8:00 PM–12:00 AM; September–May 3:00 PM–11:00 PM; last entry one hour before close" }, price: "$$", priceSource: "Official ticket page checked July 2026.", venueKind: "culture", subcategory: "Design and history museum", attributeTags: ["downtown", "outdoor-museum", "timed-entry", "night-visit", "historic-signage"], editorialUrls: [cnThings] }),
  stop({ id: "las-vegas-mob-museum", name: "The Mob Museum", coordinates: [36.1727999, -115.1413908], description: "A former federal courthouse houses a substantial, artifact-led account of organized crime, law enforcement, and Las Vegas power. Plan at least two hours; the basement distillery and speakeasy are additions, not substitutes for the main galleries.", officialUrl: "https://themobmuseum.org/plan-your-visit/purchase-tickets/", bookingUrl: "https://themobmuseum.org/plan-your-visit/purchase-tickets/", photo: images.mobMuseum, hours: daily("9:00 AM–9:00 PM"), price: "$$", priceSource: "Official ticket page checked July 2026.", venueKind: "culture", subcategory: "History museum", attributeTags: ["downtown", "history", "interactive-exhibits", "indoor"], editorialUrls: [cnThings] }),
  stop({ id: "las-vegas-atomic-museum", name: "Atomic Museum", coordinates: [36.1142142, -115.1476925], description: "The Smithsonian-affiliated museum examines Nevada Test Site history through equipment, films, civil-defense material, and nuclear-era interpretation. Allow time for dense exhibits rather than expecting a quick collection of retro objects.", officialUrl: "https://www.atomicmuseum.vegas/", bookingUrl: "https://www.atomicmuseum.vegas/", photo: images.atomicMuseum, hours: { mon: "9:00 AM–6:00 PM; box office closes 5:15 PM", tue: "9:00 AM–6:00 PM; box office closes 5:15 PM", wed: "9:00 AM–6:00 PM; box office closes 5:15 PM", thu: "9:00 AM–6:00 PM; box office closes 5:15 PM", fri: "9:00 AM–6:00 PM; box office closes 5:15 PM", sat: "9:00 AM–6:00 PM; box office closes 5:15 PM", sun: "9:00 AM–5:00 PM; box office closes 4:15 PM" }, price: "$$", priceSource: "Official admissions page checked July 2026.", venueKind: "culture", subcategory: "Science and history museum", attributeTags: ["nuclear-history", "indoor", "smithsonian-affiliate", "educational"], editorialUrls: [cnThings] }),
  stop({ id: "las-vegas-nevada-state-museum", name: "Nevada State Museum, Las Vegas", coordinates: [36.1697206, -115.1924832], description: "Inside Springs Preserve, the state museum connects regional geology, Indigenous history, mining, migration, and the development of Las Vegas. Pair it with the preserve only if the Thursday-to-Monday schedule leaves enough time before the shared afternoon close.", officialUrl: "https://www.lasvegasnvmuseum.org/about-the-museum/", photo: images.stateMuseum, hours: { mon: "9:00 AM–4:00 PM", tue: "Closed", wed: "Closed", thu: "9:00 AM–4:00 PM", fri: "9:00 AM–4:00 PM", sat: "9:00 AM–4:00 PM", sun: "9:00 AM–4:00 PM" }, price: "$", priceSource: "Official admission page checked July 2026.", venueKind: "culture", subcategory: "State history museum", attributeTags: ["springs-preserve", "nevada-history", "family-friendly", "indoor"], editorialUrls: [cnThings] }),
  stop({ id: "las-vegas-springs-preserve", name: "Springs Preserve", coordinates: [36.1688252, -115.1924789], description: "Botanical gardens, desert trails, sustainability exhibits, and historic Boomtown interpret the water source that made Las Vegas possible. Outdoor areas can close in extreme heat, and the last general entry is an hour before the afternoon close.", officialUrl: "https://www.springspreserve.org/visitor-information/plan-your-visit.html", bookingUrl: "https://www.springspreserve.org/visitor-information/plan-your-visit.html", photo: images.springs, hours: { mon: "9:00 AM–4:00 PM; last entry 3:00 PM", tue: "Closed", wed: "Closed", thu: "9:00 AM–4:00 PM; last entry 3:00 PM", fri: "9:00 AM–4:00 PM; last entry 3:00 PM", sat: "9:00 AM–4:00 PM; last entry 3:00 PM", sun: "9:00 AM–4:00 PM; last entry 3:00 PM", summer: "Outdoor attractions may close under the official heat policy" }, price: "$$", priceSource: "Official admission page checked July 2026.", venueKind: "culture", subcategory: "Cultural and botanical campus", attributeTags: ["gardens", "desert-history", "family-friendly", "heat-sensitive", "outdoors"], editorialUrls: [cnThings] }),
  stop({ id: "las-vegas-natural-history-museum", name: "Las Vegas Natural History Museum", coordinates: [36.1798986, -115.1338175], description: "A compact, family-oriented museum with dinosaur, marine-life, wildlife, and Egyptian galleries near Cashman Center. It is a useful indoor daytime stop, especially with children, but official holiday closures still apply.", officialUrl: "https://www.lvnhm.org/plan-your-visit", bookingUrl: "https://www.lvnhm.org/plan-your-visit", photo: images.naturalHistory, hours: daily("9:00 AM–4:00 PM; official holiday calendar controls closure dates"), price: "$", priceSource: "Official admission page checked July 2026.", venueKind: "culture", subcategory: "Natural history museum", attributeTags: ["family-friendly", "dinosaurs", "indoor", "downtown-area"], editorialUrls: [cnThings] }),
  stop({ id: "las-vegas-punk-rock-museum", name: "The Punk Rock Museum", coordinates: [36.1540251, -115.1606023], description: "Guitars, flyers, clothing, photographs, and band ephemera tell punk history through the people who made it. Guided tours led by musicians appear on the official calendar and are worth considering for context beyond the cases.", officialUrl: "https://www.thepunkrockmuseum.com/faqs", bookingUrl: "https://www.thepunkrockmuseum.com/faqs", photo: images.punkMuseum, hours: { mon: "11:00 AM–5:00 PM", tue: "1:00 PM–6:00 PM", wed: "1:00 PM–6:00 PM", thu: "1:00 PM–6:00 PM", fri: "12:00 PM–7:00 PM", sat: "12:00 PM–7:00 PM", sun: "12:00 PM–6:00 PM" }, price: "$$", priceSource: "Official admission page checked July 2026.", venueKind: "culture", subcategory: "Music museum", attributeTags: ["punk", "music-history", "guided-tours", "indoor"], editorialUrls: [cnThings] }),
  stop({ id: "las-vegas-erotic-heritage-museum", name: "Erotic Heritage Museum", coordinates: [36.1300839, -115.174684], description: "A nonprofit museum addressing sexuality through art, artifacts, cultural history, and changing exhibitions. The subject matter is adult and the galleries are more academic and eclectic than a typical Strip attraction.", officialUrl: "https://www.eroticmuseumvegas.com/contact-us/", bookingUrl: "https://www.eroticmuseumvegas.com/contact-us/", photo: images.eroticMuseum, hours: { mon: "11:00 AM–7:00 PM; last entry 6:00 PM", tue: "11:00 AM–7:00 PM; last entry 6:00 PM", wed: "11:00 AM–7:00 PM; last entry 6:00 PM", thu: "11:00 AM–7:00 PM; last entry 6:00 PM", fri: "11:00 AM–10:00 PM; last entry 9:00 PM", sat: "11:00 AM–10:00 PM; last entry 9:00 PM", sun: "11:00 AM–7:00 PM; last entry 6:00 PM" }, price: "$$", priceSource: "Official admission page checked July 2026.", venueKind: "culture", subcategory: "Art and cultural-history museum", attributeTags: ["adult-subject-matter", "art", "cultural-history", "indoor"], editorialUrls: [cnThings] }),
  stop({ id: "las-vegas-charleston-heights-art-gallery", name: "Charleston Heights Art Gallery", coordinates: [36.1623192, -115.2109994], description: "This city-run gallery presents rotating contemporary and community exhibitions without Strip admission prices. The municipal schedule changes on August 1, 2026, so use the correct date band rather than assuming one weekly pattern.", officialUrl: "https://www.lasvegasnevada.gov/Residents/Parks-Facilities/Charleston-Heights-Art-Gallery", photo: images.charlestonGallery, hours: { default: "Through July 31, 2026: Tuesday–Saturday 8:00 AM–6:30 PM; Sunday–Monday closed. From August 1, 2026: Monday and Saturday 8:30 AM–6:30 PM; Tuesday–Friday 8:30 AM–9:00 PM; Sunday closed" }, price: "$", priceSource: "Free city gallery; official municipal page checked July 2026.", venueKind: "culture", subcategory: "Contemporary art gallery", attributeTags: ["free", "city-run", "rotating-exhibitions", "local-art"], editorialUrls: [visitLasVegas] }),
  stop({ id: "las-vegas-smith-center", name: "The Smith Center", coordinates: [36.1723364, -115.1499953], description: "Downtown's Art Deco performing-arts campus hosts Broadway tours, concerts, dance, jazz, and resident companies. It is a show-driven stop: the official calendar controls access, and the box office opens two hours before performances.", officialUrl: "https://thesmithcenter.com/calendar/", bookingUrl: "https://thesmithcenter.com/calendar/", photo: images.smithCenter, hours: daily("Official performance calendar controls event times; box office opens two hours before each performance; phone ticketing Monday–Friday 10:00 AM–6:00 PM"), price: "$$$", priceSource: "Official event calendar checked July 2026; ticket prices vary by performance.", venueKind: "event_venue", nightlifeType: "concert_hall", musicGenres: ["Classical", "Jazz", "Broadway", "Dance"], subcategory: "Performing arts center", attributeTags: ["downtown", "performing-arts", "ticketed", "calendar-dependent"], editorialUrls: [cnThings] }),
];

const activityStops: GuideStop[] = [
  stop({ id: "las-vegas-red-rock-canyon", name: "Red Rock Canyon Scenic Drive", coordinates: [36.1355682, -115.4279246], description: "A 13-mile one-way drive opens access to sandstone overlooks and trailheads less than an hour from the Strip. Timed reservations are required for entry from 8:00 AM to 5:00 PM between October 1 and May 31; summer heat demands an early start.", officialUrl: "https://www.blm.gov/programs/national-conservation-lands/nevada/red-rock-canyon", bookingUrl: "https://www.blm.gov/programs/national-conservation-lands/nevada/red-rock-canyon", photo: images.redRockCanyon, hours: { winter: "Daily November–February: 6:00 AM–5:00 PM", spring: "Daily March: 6:00 AM–7:00 PM; April–May: 6:00 AM–8:00 PM", summer: "Daily June–September: 6:00 AM–8:00 PM; avoid exposed hikes in extreme heat", fall: "Daily October: 6:00 AM–7:00 PM; November: 6:00 AM–5:00 PM", default: "Daily; timed entry required October 1–May 31 for arrivals from 8:00 AM–5:00 PM" }, price: "$", priceSource: "Official BLM fees and reservation page checked July 2026.", venueKind: "outdoors", subcategory: "Scenic drive and hiking", attributeTags: ["timed-entry-seasonal", "hiking", "scenic-drive", "car-required", "heat-sensitive"], editorialUrls: [cnThings] }),
  stop({ id: "las-vegas-valley-of-fire", name: "Valley of Fire State Park", coordinates: [36.4299853, -114.5137694], description: "Nevada's red-sandstone state park is a high-impact day trip for scenic roads, petroglyphs, and short trails. The park closes annually December 1–14, and its major trails close May 15–September 30 because of dangerous heat.", officialUrl: "https://parks.nv.gov/parks/valley-of-fire", bookingUrl: "https://parks.nv.gov/parks/valley-of-fire", photo: images.valleyFire, hours: { default: "Open daily sunrise–sunset; closed annually December 1–14", summer: "Major trails closed May 15–September 30 under the official seasonal safety policy" }, price: "$", priceSource: "Official Nevada State Parks fee page checked July 2026.", venueKind: "outdoors", subcategory: "State park", attributeTags: ["day-trip", "hiking", "petroglyphs", "car-required", "summer-trail-closures"], editorialUrls: [cnThings] }),
  stop({ id: "las-vegas-hoover-dam", name: "Hoover Dam", coordinates: [36.0161557, -114.7393133], description: "The monumental Colorado River dam combines free exterior viewpoints with ticketed visitor-center, powerplant, and dam tours. Tour tickets and security add time; arrive well before the 4:10 PM final tour rather than treating 5:00 PM as an entry time.", officialUrl: "https://www.usbr.gov/lc/hooverdam/service/index.html", bookingUrl: "https://www.usbr.gov/lc/hooverdam/service/index.html", photo: images.hooverDam, hours: daily("Dam access 5:00 AM–9:00 PM; visitor center and tours 9:00 AM–5:00 PM; doors close 4:15 PM and last tour departs 4:10 PM; visitor facilities close Thanksgiving and Christmas"), price: "$$", priceSource: "Official Bureau of Reclamation ticket page checked July 2026.", venueKind: "landmark", subcategory: "Engineering landmark", attributeTags: ["day-trip", "guided-tours", "architecture", "car-recommended", "security-screening"], editorialUrls: [cnThings] }),
  stop({ id: "las-vegas-bellagio-fountains", name: "Fountains of Bellagio", coordinates: [36.1123192, -115.178723], description: "The free lake show remains the Strip's most efficient spectacle, pairing water, light, and a rotating soundtrack. Wind can cancel performances, and the shorter 15-minute interval begins only in the evening.", officialUrl: "https://bellagio.mgmresorts.com/en/entertainment/fountains-of-bellagio.html", photo: images.bellagioFountains, hours: { mon: "Every 30 minutes 3:00 PM–7:30 PM; every 15 minutes 8:00 PM–12:00 AM", tue: "Every 30 minutes 3:00 PM–7:30 PM; every 15 minutes 8:00 PM–12:00 AM", wed: "Every 30 minutes 3:00 PM–7:30 PM; every 15 minutes 8:00 PM–12:00 AM", thu: "Every 30 minutes 3:00 PM–7:30 PM; every 15 minutes 8:00 PM–12:00 AM", fri: "Every 30 minutes 3:00 PM–7:30 PM; every 15 minutes 8:00 PM–12:00 AM", sat: "Every 30 minutes 12:00 PM–7:30 PM; every 15 minutes 8:00 PM–12:00 AM", sun: "Every 30 minutes 12:00 PM–7:30 PM; every 15 minutes 8:00 PM–12:00 AM", default: "Holiday schedule follows the official weekend cadence; shows may be canceled for high wind" }, price: "$", priceSource: "Free attraction; official schedule checked July 2026.", venueKind: "landmark", subcategory: "Free outdoor show", attributeTags: ["free", "strip", "night-view", "family-friendly", "weather-dependent"], editorialUrls: [cnThings] }),
  stop({ id: "las-vegas-fremont-viva-vision", name: "Viva Vision at Fremont Street Experience", coordinates: [36.169191, -115.141039], description: "The downtown canopy runs free music-and-light shows across a five-block pedestrian mall while stages and casinos compete below. Hourly shows continue late, but the street atmosphere becomes louder and more adult as night develops.", officialUrl: "https://vegasexperience.com/viva-vision-light-show-schedule/", photo: images.fremont, hours: daily("Hourly shows from 6:00 PM–2:00 AM"), price: "$", priceSource: "Free attraction; official show schedule checked July 2026.", venueKind: "landmark", subcategory: "Free light show", attributeTags: ["free", "downtown", "night-view", "live-entertainment", "pedestrian-mall"], editorialUrls: [cnThings] }),
  stop({ id: "las-vegas-high-roller", name: "High Roller Observation Wheel", coordinates: [36.1177429, -115.1693967], description: "The 550-foot observation wheel gives a slow, air-conditioned panorama from the LINQ Promenade, with the strongest city lights after sunset. The official booking calendar lists the current boarding slots and cabin products for each date.", officialUrl: "https://www.caesars.com/linq/things-to-do/attractions/high-roller", bookingUrl: "https://www.caesars.com/linq/things-to-do/attractions/high-roller", photo: images.highRoller, hours: daily("Official booking calendar lists available High Roller boarding slots for the selected date"), price: "$$", priceSource: "Official booking calendar checked July 2026.", venueKind: "landmark", subcategory: "Observation wheel", attributeTags: ["strip", "city-views", "air-conditioned", "timed-ticket", "night-view"], editorialUrls: [cnThings] }),
  stop({ id: "las-vegas-sphere", name: "Sphere", coordinates: [36.1212076, -115.1620674], description: "The giant programmable exterior is visible for free, while the interior is accessible only through ticketed concerts, films, and events. Treat this as a calendar-driven venue: show time, doors, age rules, and bag policy come from the official event listing.", officialUrl: "https://www.thesphere.com/shows", bookingUrl: "https://www.thesphere.com/shows", photo: images.sphere, hours: daily("Sphere official event calendar lists each ticketed show time and event-specific door time"), price: "$$$", priceSource: "Official event calendar checked July 2026; prices vary by performance.", venueKind: "event_venue", nightlifeType: "concert_hall", musicGenres: ["Rock", "Pop", "Electronic", "Film score"], subcategory: "Immersive performance venue", attributeTags: ["ticketed", "calendar-dependent", "immersive", "near-strip", "architecture"], editorialUrls: [cnThings] }),
  stop({ id: "las-vegas-omega-mart", name: "Omega Mart at AREA15", coordinates: [36.1317802, -115.181282], description: "Meow Wolf's explorable supermarket opens into a sprawling narrative installation of rooms, portals, and corporate satire. Budget at least two hours, wear comfortable shoes, and use a timed ticket; Friday and Saturday entries are listed on the official booking calendar.", officialUrl: "https://meowwolf.com/visit/las-vegas/hours-location", bookingUrl: "https://meowwolf.com/visit/las-vegas/hours-location", photo: images.omegaMart, hours: { mon: "10:00 AM–10:00 PM", tue: "10:00 AM–10:00 PM", wed: "10:00 AM–10:00 PM", thu: "10:00 AM–10:00 PM", fri: "Official booking calendar lists available timed entries", sat: "Official booking calendar lists available timed entries", sun: "10:00 AM–10:00 PM" }, price: "$$$", priceSource: "Official ticket page checked July 2026.", venueKind: "culture", subcategory: "Immersive art experience", attributeTags: ["timed-ticket", "immersive-art", "family-friendly", "indoor", "area15"], editorialUrls: [cnThings] }),
  stop({ id: "las-vegas-pinball-hall-of-fame", name: "Pinball Hall of Fame", coordinates: [36.0848073, -115.1708164], description: "A vast nonprofit arcade south of the main Strip, filled with playable pinball and novelty machines from multiple eras. Admission is free and play is pay-per-game, making it easy to scale from a quick stop to several nostalgic hours.", officialUrl: "https://pinballmuseum.org/direct.php", photo: images.pinball, hours: { mon: "10:00 AM–9:00 PM", tue: "10:00 AM–9:00 PM", wed: "10:00 AM–9:00 PM", thu: "10:00 AM–9:00 PM", fri: "10:00 AM–10:00 PM", sat: "10:00 AM–10:00 PM", sun: "10:00 AM–9:00 PM" }, price: "$", priceSource: "Free admission; machines priced per play. Official page checked July 2026.", venueKind: "culture", subcategory: "Playable arcade museum", attributeTags: ["family-friendly", "retro-games", "pay-per-play", "indoor", "south-strip"], editorialUrls: [cnThings] }),
  stop({ id: "las-vegas-seven-magic-mountains", name: "Seven Magic Mountains", coordinates: [35.8383115, -115.27095], description: "Ugo Rondinone's seven fluorescent boulder towers rise from the desert beside Interstate 15 south of Las Vegas. The installation is free and unshaded; visit in daylight, avoid peak summer heat, and do not treat the site as an overnight stop.", officialUrl: "https://sevenmagicmountains.com/visit/", photo: images.sevenMagic, hours: daily("Daily sunrise–sunset; the season determines the available daylight window; no overnight use"), price: "$", priceSource: "Free public artwork; official visitor page checked July 2026.", venueKind: "culture", subcategory: "Desert public art", attributeTags: ["free", "public-art", "car-required", "unshaded", "daylight-visit"], editorialUrls: [cnThings] }),
];

const editorial = {
  restaurants: [
    source("Top organic result: Eater Las Vegas - Best restaurants", eaterRestaurants),
    source("Condé Nast Traveler - Best restaurants in Las Vegas", cnRestaurants),
    source("The Infatuation - Las Vegas restaurants", infatuationRestaurants),
    source("Visit Las Vegas - Restaurants", "https://www.visitlasvegas.com/restaurants/"),
    source("Visit Las Vegas - Downtown dining", "https://www.visitlasvegas.com/experience/post/downtown-las-vegas-restaurants/"),
  ],
  cheapEats: [
    source("Top organic result: Eater Las Vegas - Affordable restaurants", eaterCheap),
    source("The Infatuation - Las Vegas restaurants", infatuationRestaurants),
    source("Eater Las Vegas - Best restaurants", eaterRestaurants),
    source("Visit Las Vegas - Restaurants", "https://www.visitlasvegas.com/restaurants/"),
    source("Visit Las Vegas - Downtown dining", "https://www.visitlasvegas.com/experience/post/downtown-las-vegas-restaurants/"),
  ],
  hotels: [
    source("Top organic result: Condé Nast Traveler - Best hotels in Las Vegas", cnHotels),
    source("Visit Las Vegas - Hotels and casinos", "https://www.visitlasvegas.com/hotels-casinos/"),
    source("Forbes Travel Guide - Las Vegas hotels", "https://www.forbestravelguide.com/destinations/las-vegas-nevada/hotels"),
    source("Travel + Leisure - Las Vegas hotels", "https://www.travelandleisure.com/hotels-resorts/best-hotels-in-las-vegas"),
    source("Booking.com - Las Vegas hotels", "https://www.booking.com/city/us/las-vegas.html"),
  ],
  casualBars: [
    source("Top organic result: Eater Las Vegas - Best bars and lounges", eaterBars),
    source("The Infatuation - Best bars in Las Vegas", infatuationBars),
    source("Visit Las Vegas - Nightlife", "https://www.visitlasvegas.com/experience/nightlife/"),
    source("Las Vegas Weekly - Bars", "https://lasvegasweekly.com/nightlife/"),
    source("Downtown Las Vegas - Bars and nightlife", "https://www.lasvegasnevada.gov/Visitors/Downtown-Las-Vegas"),
  ],
  cocktails: [
    source("Top organic result: Eater Las Vegas - Best bars and lounges", eaterBars),
    source("The Infatuation - Best bars in Las Vegas", infatuationBars),
    source("Visit Las Vegas - Nightlife", "https://www.visitlasvegas.com/experience/nightlife/"),
    source("Las Vegas Weekly - Nightlife", "https://lasvegasweekly.com/nightlife/"),
    source("Condé Nast Traveler - Las Vegas travel guide", "https://www.cntraveler.com/destinations/las-vegas"),
  ],
  culture: [
    source("Top organic result: Visit Las Vegas - Museums", "https://www.visitlasvegas.com/experience/post/las-vegas-museums/"),
    source("Visit Las Vegas - Arts and culture", "https://www.visitlasvegas.com/experience/arts-culture/"),
    source("City of Las Vegas - Arts and culture", "https://www.lasvegasnevada.gov/Residents/Arts-Culture"),
    source("Condé Nast Traveler - Best things to do in Las Vegas", cnThings),
    source("Travel Nevada - Las Vegas", "https://travelnevada.com/cities/las-vegas/"),
  ],
  activities: [
    source("Top organic result: Condé Nast Traveler - Best things to do in Las Vegas", cnThings),
    source("Visit Las Vegas - Things to do", "https://www.visitlasvegas.com/experience/things-to-do/"),
    source("Visit Las Vegas - Outdoor activities", "https://www.visitlasvegas.com/experience/outdoor-recreation/"),
    source("Travel Nevada - Las Vegas", "https://travelnevada.com/cities/las-vegas/"),
    source("City of Las Vegas - Downtown visitors guide", "https://www.lasvegasnevada.gov/Visitors/Downtown-Las-Vegas"),
  ],
};

const sources = {
  restaurants: [...editorial.restaurants, ...diningStops.slice(0, 5).map((item) => source(`${item.name} official`, item.officialUrl ?? maps(item.name)))],
  cheapEats: [...editorial.cheapEats, ...cheapEatStops.slice(0, 5).map((item) => source(`${item.name} official`, item.officialUrl ?? maps(item.name)))],
  hotels: [...editorial.hotels, ...hotelStops.slice(0, 5).map((item) => source(`${item.name} official`, item.officialUrl ?? maps(item.name)))],
  casualBars: [...editorial.casualBars, ...casualBarStops.slice(0, 5).map((item) => source(`${item.name} official`, item.officialUrl ?? maps(item.name)))],
  cocktails: [...editorial.cocktails, ...cocktailStops.slice(0, 5).map((item) => source(`${item.name} official`, item.officialUrl ?? maps(item.name)))],
  culture: [...editorial.culture, ...cultureStops.slice(0, 5).map((item) => source(`${item.name} official`, item.officialUrl ?? maps(item.name)))],
  activities: [...editorial.activities, ...activityStops.slice(0, 5).map((item) => source(`${item.name} official`, item.officialUrl ?? maps(item.name)))],
};

function guide(category: ListCategory, id: string, slug: string, seoSlug: string, title: string, description: string, stops: GuideStop[], guideSources: ListSource[], seoTitle: string, seoDescription: string): MapList {
  return {
    id,
    slug,
    seoSlug,
    seoTitle,
    seoDescription,
    title,
    description,
    url: maps(`${title} Las Vegas`),
    category,
    location: lasVegasLocation,
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

export const lasVegasCitywideGuides: MapList[] = [
  guide("Food", "list-las-vegas-best-restaurants", "las-vegas-best-restaurants", "best-restaurants", "The Las Vegas Restaurant Shortlist", "A citywide Las Vegas restaurant guide balancing landmark Strip tasting rooms with the off-Strip kitchens that make Chinatown and the Arts District essential. Every stop earns its place through cooking, setting, or a distinct use case.", diningStops, sources.restaurants, "Best Restaurants in Las Vegas, From Strip Icons to Chinatown", "Ten source-backed Las Vegas restaurants spanning French tasting menus, Cantonese fine dining, northern Thai cooking, seafood, Italian, and Chinatown chef counters."),
  guide("Food", "list-las-vegas-cheap-eats", "las-vegas-best-cheap-eats", "best-cheap-eats", "Cheap Eats for Long Las Vegas Days", "A practical map for tacos, noodles, pizza, arepas, burgers, seafood, pasties, and 24-hour casino comfort food. These stops solve lunch, late-night, and budget pressure without padding the guide with generic food courts.", cheapEatStops, sources.cheapEats, "Best Cheap Eats in Las Vegas for Tacos, Noodles, Pizza, and Late Nights", "Ten affordable Las Vegas food stops with current hours, official evidence, and useful options near the Strip, Chinatown, downtown, and the Arts District."),
  guide("Stay", "list-las-vegas-hotels", "las-vegas-best-hotels", "best-hotels", "The Las Vegas Hotel Shortlist", "A hotel-only guide for matching the base to the trip: center-Strip access, north-Strip resort days, nongaming quiet, downtown energy, convention logistics, or a Red Rock and Summerlin itinerary.", hotelStops, sources.hotels, "Best Hotels in Las Vegas for the Strip, Downtown, and Red Rock", "Ten source-backed Las Vegas hotels, kept strictly separate from hostels, with practical notes on location, resort scale, pools, nightlife, and quiet."),
  guide("Nightlife", "list-las-vegas-dive-bars-casual-bars", "las-vegas-best-dive-bars-casual-bars", "best-dive-bars", "Dives, Beer Bars & Casual Vegas Nights", "The casual side of Las Vegas nightlife runs through 24-hour dives, punk rooms, karaoke, beer bars, patios, live music, and downtown taverns. This map favors character and utility over bottle service.", casualBarStops, sources.casualBars, "Best Dive Bars and Casual Bars in Las Vegas", "Ten source-backed Las Vegas dive and casual bars, including 24-hour locals, karaoke, punk, tiki, beer, patios, gaming, and live music."),
  guide("Nightlife", "list-las-vegas-cocktail-bars", "las-vegas-best-cocktail-bars", "best-cocktail-bars", "Cocktails, Tiki & Hidden Rooms", "Serious Las Vegas drinks exist well beyond casino lounges: seasonal neighborhood menus, historical classics, whiskey, rum, elaborate tiki, reservation-only rooms, and a few Strip bars worth the premium.", cocktailStops, sources.cocktails, "Best Cocktail Bars in Las Vegas for Tiki, Whiskey, and Hidden Rooms", "Ten source-backed Las Vegas cocktail bars across the Arts District, Chinatown, downtown, Resorts World, Bellagio, and The Cosmopolitan."),
  guide("Culture", "list-las-vegas-culture", "las-vegas-best-culture", "best-culture", "Museums, Design & Performance in Las Vegas", "Las Vegas culture is written in neon, organized crime, atomic testing, desert water, punk archives, state history, public galleries, and live performance. These ten stops reveal the city behind the casino floor.", cultureStops, sources.culture, "Best Culture in Las Vegas for Museums, Art, History, and Performance", "Ten source-backed Las Vegas culture stops covering neon, mob and atomic history, museums, gardens, punk, art, and performing arts."),
  guide("Activities", "list-las-vegas-top-things-to-do", "las-vegas-best-things-to-do", "best-things-to-do", "Ten Las Vegas Experiences Worth Planning", "A top-things-to-do map built around the city's real contrasts: free Strip spectacle, downtown light, immersive art, playable history, engineering, desert public art, and two heat-sensitive landscapes beyond the resorts.", activityStops, sources.activities, "Top Things to Do in Las Vegas With 10 Strong Stops", "Ten source-backed Las Vegas activities with exact schedules, timed-entry rules, summer closures, ticket calendars, and day-trip logistics."),
];

lasVegasCitywideGuides.push(buildNatureGuide({
  city: "Las Vegas", country: "United States", continent: "North America",
  id: "list-las-vegas-citywide-nature", slug: "las-vegas-best-nature-and-hikes-citywide", seoSlug: "best-nature-and-hikes",
  seoTitle: "Best Nature and Hikes near Las Vegas", seoDescription: "Las Vegas nature guide to red-rock canyons, desert wetlands, fossil beds, alpine forest, Lake Mead, and Mojave parks.",
  title: "Red Rock, Desert Water, and High-Country Pines",
  description: "Las Vegas is surrounded by sharper nature than the Strip suggests: sandstone escarpments, fossil beds, desert wetlands, volcanic valleys, reservoir shore, and alpine forest. Heat, timed entry, flash floods, long drives, and almost no shade demand conservative planning.",
  createdAt: "2026-07-29T00:00:00.000Z", checkedAt: "2026-08-04",
  sources: [
    { name: "Top organic result: Travel Nevada Las Vegas outdoors", url: "https://travelnevada.com/outdoor-recreation/" },
    { name: "Bureau of Land Management Southern Nevada", url: "https://www.blm.gov/programs/national-conservation-lands/nevada" },
    { name: "National Park Service Nevada", url: "https://www.nps.gov/state/nv/index.htm" },
    { name: "Google Maps - Las Vegas nature and hikes", url: "https://www.google.com/maps/search/best+nature+and+hikes+Las+Vegas" },
  ],
  stops: [
    { id: "las-vegas-nature-red-rock", name: "Red Rock Canyon National Conservation Area", coordinates: [36.1355, -115.427], description: "Red Rock Canyon places striped sandstone, desert scrub, bighorn habitat, climbing walls, and trailheads minutes west of Las Vegas. The scenic drive uses seasonal timed entry, while heat and flash-flood risk make start time a safety decision.", hours: { default: "Scenic Drive daily: November–February 6:00 AM–5:00 PM; March and October 6:00 AM–7:00 PM; April–September 6:00 AM–8:00 PM. Timed entry required October 1–May 31 for arrivals 8:00 AM–5:00 PM." }, officialUrl: "https://www.blm.gov/programs/national-conservation-lands/nevada/red-rock-canyon", subcategory: "desert_canyon", attributeTags: ["hiking", "geology", "climbing", "timed_entry", "scenic_drive"] },
    { id: "las-vegas-nature-valley-of-fire", name: "Valley of Fire State Park", coordinates: [36.4858, -114.5316], description: "Valley of Fire layers red Aztec sandstone, petroglyphs, arches, slot-like washes, and open Mojave sky northeast of the city. Trails close during extreme summer heat, and exposed rock leaves no room for casual water planning.", hours: { default: "Daily sunrise–sunset—approximately 6:50 AM–4:30 PM in December and 5:20 AM–8:00 PM in June. Park closed December 1–14; multiple trails closed annually May 15–September 30." }, officialUrl: "https://parks.nv.gov/parks/valley-of-fire", subcategory: "desert_state_park", attributeTags: ["geology", "hiking", "petroglyphs", "day_trip", "extreme_heat"] },
    { id: "las-vegas-nature-springs-preserve", name: "Springs Preserve", coordinates: [36.1708, -115.1908], description: "Springs Preserve interprets the desert springs that made Las Vegas possible through botanical gardens, trails, archaeology, wildlife exhibits, and museums. It is managed, educational nature with shade and indoor relief, not a substitute for wild desert.", hours: { default: "Thursday–Monday 9:00 AM–4:00 PM; last entry 3:00 PM. Closed Tuesday–Wednesday, Thanksgiving, and Christmas." }, officialUrl: "https://www.springspreserve.org/visitor-information/plan-your-visit.html", subcategory: "desert_botanical_campus", attributeTags: ["garden", "desert", "museum", "family_friendly", "ticketed"] },
    { id: "las-vegas-nature-wetlands", name: "Clark County Wetlands Park", coordinates: [36.1019, -115.021], description: "Clark County Wetlands Park follows the Las Vegas Wash through ponds, cottonwoods, desert scrub, bird habitat, and a substantial trail network. The landscape is restored and working, carrying treated water toward Lake Mead while supporting wildlife.", hours: { default: "Trails daily dawn–dusk—approximately 6:50 AM–4:30 PM in December and 5:20 AM–8:00 PM in June. Nature Center Tuesday–Sunday 9:00 AM–3:00 PM." }, officialUrl: "https://www.clarkcountynv.gov/government/departments/parks___recreation/wetlands_park/", subcategory: "desert_wetland", attributeTags: ["wetland", "birdwatching", "walking", "cycling", "free_entry"] },
    { id: "las-vegas-nature-lake-mead", name: "Lake Mead National Recreation Area", coordinates: [36.015, -114.737], description: "Lake Mead pairs vast reservoir shoreline with desert mountains, coves, historic routes, and access to the Colorado River. Falling water levels, summer heat, wind, and changing launch conditions make current National Park Service notices essential.", hours: { default: "Open 24 hours daily; the visitor center, launch ramps, marinas, and concession services keep separate schedules." }, officialUrl: "https://www.nps.gov/lake/planyourvisit/hours.htm", subcategory: "national_recreation_area", attributeTags: ["lake", "boating", "hiking", "desert", "day_trip"] },
    { id: "las-vegas-nature-mount-charleston", name: "Spring Mountains National Recreation Area", coordinates: [36.271, -115.695], description: "The Spring Mountains lift Las Vegas into bristlecone pine, fir forest, limestone cliffs, snow, and cooler hiking around Mount Charleston. Elevation changes weather quickly, and wildfire, snow, or storm damage can close roads and trails.", hours: { default: "Open 24 hours daily; campgrounds, picnic sites, visitor facilities, and gated roads keep separate posted schedules." }, officialUrl: "https://www.fs.usda.gov/r04/humboldt-toiyabe/recreation/spring-mountains-national-recreation-area", subcategory: "mountain_forest", attributeTags: ["mountain", "hiking", "forest", "snow", "day_trip"] },
    { id: "las-vegas-nature-floyd-lamb", name: "Floyd Lamb Park at Tule Springs", coordinates: [36.3211, -115.267], description: "Floyd Lamb Park surrounds spring-fed ponds, cottonwoods, lawns, birdlife, and historic ranch buildings in the northwest valley. It offers easy shade and family space, but admission and gate hours distinguish it from an always-open neighborhood park.", hours: { default: "April–September daily 8:00 AM–8:00 PM; October–March daily 8:00 AM–5:00 PM." }, officialUrl: "https://www.lasvegasnevada.gov/Residents/Parks-Facilities/Floyd-Lamb-Park", subcategory: "spring_park", attributeTags: ["pond", "birdwatching", "picnic", "family_friendly", "historic"] },
    { id: "las-vegas-nature-sloan", name: "Sloan Canyon National Conservation Area", coordinates: [35.927, -115.109], description: "Sloan Canyon protects volcanic ridges, desert habitat, and a remarkable petroglyph concentration south of Henderson. The cultural site deserves restraint, while exposed routes, rough roads, and little shade require strong navigation and water discipline.", hours: { default: "Petroglyph Canyon Day Use Area: October 1–May 19 daily 8:00 AM–4:30 PM; June 1–September 30 Monday–Thursday 8:00 AM–noon and Friday–Sunday 7:00 AM–noon. BLM has no regular hours posted for May 20–31." }, officialUrl: "https://www.blm.gov/programs/national-conservation-lands/nevada/sloan-canyon-nca", subcategory: "desert_conservation_area", attributeTags: ["hiking", "petroglyphs", "desert", "archaeology", "strenuous"] },
    { id: "las-vegas-nature-tule-springs", name: "Tule Springs Fossil Beds National Monument", coordinates: [36.315, -115.31], description: "Tule Springs preserves Ice Age fossil beds and desert wash landscape along the valley’s northern edge. Infrastructure is minimal and fossils must remain untouched, so the value lies in geology, open ground, and ranger-led interpretation.", hours: { default: "Daily sunrise–sunset—approximately 6:50 AM–4:30 PM in December and 5:20 AM–8:00 PM in June; the monument is closed at night." }, officialUrl: "https://home.nps.gov/tusk/planyourvisit/basicinfo.htm", subcategory: "fossil_monument", attributeTags: ["geology", "fossils", "desert", "free_entry", "educational"] },
    { id: "las-vegas-nature-sunset-park", name: "Sunset Park", coordinates: [36.0696, -115.114], description: "Sunset Park gives the urban valley a large lake, mature trees, running paths, sports grounds, and bird habitat close to the airport. Aircraft noise is constant, but shade and everyday local use make it a practical green counterpoint to resort space.", hours: { default: "Daily 6:00 AM–11:00 PM." }, officialUrl: "https://www.clarkcountynv.gov/government/departments/parks___recreation/services/area_reservations/sunset-park-webpage", subcategory: "urban_lake_park", attributeTags: ["park", "lake", "running", "birdwatching", "family_friendly"] },
  ],
}));
