import type { GuideStop, ListCategory, ListSource, MapList } from "@/types";

const createdAt = "2026-06-03T00:00:00.000Z";
const checkedAt = "2026-06-03";

const miamiLocation = {
  city: "Miami",
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
  editorialUrls?: string[];
  price?: GuideStop["price"];
  priceSource?: string;
  bookingUrl?: string;
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
  return {
    mon: text,
    tue: text,
    wed: text,
    thu: text,
    fri: text,
    sat: text,
    sun: text,
  };
}

function closed(): StopHours {
  return {
    mon: "Closed",
    tue: "Closed",
    wed: "Closed",
    thu: "Closed",
    fri: "Closed",
    sat: "Closed",
    sun: "Closed",
  };
}

const alwaysOpen: StopHours = {
  mon: "24 hours",
  tue: "24 hours",
  wed: "24 hours",
  thu: "24 hours",
  fri: "24 hours",
  sat: "24 hours",
  sun: "24 hours",
};

const hours = {
  joes: { mon: "11:30 AM-10:00 PM", tue: "11:30 AM-10:00 PM", wed: "11:30 AM-10:00 PM", thu: "11:30 AM-10:00 PM", fri: "11:30 AM-11:00 PM", sat: "11:30 AM-11:00 PM", sun: "11:00 AM-10:00 PM" },
  versailles: daily("8:00 AM-1:00 AM"),
  mandolin: { mon: "12:00 PM-11:00 PM", tue: "12:00 PM-11:00 PM", wed: "12:00 PM-11:00 PM", thu: "12:00 PM-11:00 PM", fri: "12:00 PM-12:00 AM", sat: "12:00 PM-12:00 AM", sun: "12:00 PM-11:00 PM" },
  michaels: { mon: "11:30 AM-10:00 PM", tue: "11:30 AM-10:00 PM", wed: "11:30 AM-10:00 PM", thu: "11:30 AM-10:00 PM", fri: "11:30 AM-11:00 PM", sat: "11:30 AM-11:00 PM", sun: "11:00 AM-10:00 PM" },
  stubbornSeed: { mon: "Closed", tue: "6:00 PM-10:00 PM", wed: "6:00 PM-10:00 PM", thu: "6:00 PM-10:00 PM", fri: "6:00 PM-10:30 PM", sat: "6:00 PM-10:30 PM", sun: "6:00 PM-10:00 PM" },
  boiaDe: { mon: "Closed", tue: "5:30 PM-10:00 PM", wed: "5:30 PM-10:00 PM", thu: "5:30 PM-10:00 PM", fri: "5:30 PM-10:30 PM", sat: "5:30 PM-10:30 PM", sun: "Closed" },
  macchialina: { mon: "5:00 PM-11:00 PM", tue: "5:00 PM-11:00 PM", wed: "5:00 PM-11:00 PM", thu: "5:00 PM-11:00 PM", fri: "5:00 PM-12:00 AM", sat: "5:00 PM-12:00 AM", sun: "5:00 PM-11:00 PM" },
  zak: { mon: "7:00 AM-5:00 PM", tue: "7:00 AM-5:00 PM", wed: "7:00 AM-5:00 PM", thu: "7:00 AM-5:00 PM", fri: "7:00 AM-5:00 PM", sat: "Closed", sun: "7:00 AM-5:00 PM" },
  surfClub: { mon: "Closed", tue: "5:30 PM-10:00 PM", wed: "5:30 PM-10:00 PM", thu: "5:30 PM-10:00 PM", fri: "5:30 PM-10:00 PM", sat: "5:30 PM-10:00 PM", sun: "5:30 PM-10:00 PM" },
  garcias: daily("11:00 AM-9:00 PM"),
  chefCreole: daily("11:00 AM-9:00 PM"),
  sanguich: daily("10:00 AM-10:00 PM"),
  laSandwicherie: { mon: "8:00 AM-5:00 AM", tue: "8:00 AM-5:00 AM", wed: "8:00 AM-5:00 AM", thu: "8:00 AM-5:00 AM", fri: "8:00 AM-6:00 AM", sat: "8:00 AM-6:00 AM", sun: "8:00 AM-5:00 AM" },
  enriquetas: { mon: "6:30 AM-3:00 PM", tue: "6:30 AM-3:00 PM", wed: "6:30 AM-3:00 PM", thu: "6:30 AM-3:00 PM", fri: "6:30 AM-3:00 PM", sat: "7:00 AM-2:00 PM", sun: "Closed" },
  elRey: daily("10:00 AM-10:00 PM"),
  doggis: daily("11:30 AM-10:00 PM"),
  coyo: { mon: "11:00 AM-12:00 AM", tue: "11:00 AM-12:00 AM", wed: "11:00 AM-12:00 AM", thu: "11:00 AM-2:00 AM", fri: "11:00 AM-3:00 AM", sat: "11:00 AM-3:00 AM", sun: "11:00 AM-12:00 AM" },
  taquiza: daily("12:00 PM-10:00 PM"),
  motek: daily("9:00 AM-11:00 PM"),
  pincho: daily("11:00 AM-10:00 PM"),
  msCheezious: { mon: "Closed", tue: "11:00 AM-10:00 PM", wed: "11:00 AM-10:00 PM", thu: "11:00 AM-10:00 PM", fri: "11:00 AM-11:00 PM", sat: "11:00 AM-11:00 PM", sun: "11:00 AM-10:00 PM" },
  clubDeuce: daily("8:00 AM-5:00 AM"),
  zeyzey: { mon: "Closed", tue: "Evening-late; event calendar varies", wed: "Evening-late; event calendar varies", thu: "Evening-late; event calendar varies", fri: "Evening-late; event calendar varies", sat: "Evening-late; event calendar varies", sun: "Evening-late; event calendar varies" },
  ballChain: { mon: "11:00 AM-12:00 AM", tue: "11:00 AM-12:00 AM", wed: "11:00 AM-12:00 AM", thu: "11:00 AM-12:00 AM", fri: "11:00 AM-2:00 AM", sat: "11:00 AM-2:00 AM", sun: "11:00 AM-12:00 AM" },
  churchills: daily("Event calendar varies; verify show times"),
  lostBoy: daily("12:00 PM-3:00 AM"),
  mamaTried: daily("5:00 PM-5:00 AM"),
  bobsYourUncle: { mon: "3:00 PM-2:00 AM", tue: "3:00 PM-2:00 AM", wed: "3:00 PM-2:00 AM", thu: "3:00 PM-2:00 AM", fri: "3:00 PM-3:00 AM", sat: "3:00 PM-3:00 AM", sun: "3:00 PM-2:00 AM" },
  teds: daily("12:00 PM-5:00 AM"),
  corner: { mon: "4:00 PM-5:00 AM", tue: "4:00 PM-5:00 AM", wed: "4:00 PM-5:00 AM", thu: "4:00 PM-5:00 AM", fri: "4:00 PM-7:00 AM", sat: "4:00 PM-7:00 AM", sun: "4:00 PM-5:00 AM" },
  doms: daily("5:00 PM-11:00 PM"),
  brokenShaker: { mon: "5:00 PM-12:00 AM", tue: "5:00 PM-12:00 AM", wed: "5:00 PM-12:00 AM", thu: "5:00 PM-12:00 AM", fri: "5:00 PM-1:00 AM", sat: "12:00 PM-1:00 AM", sun: "12:00 PM-12:00 AM" },
  sweetLiberty: daily("4:00 PM-5:00 AM"),
  cafeLaTrova: { mon: "12:00 PM-12:00 AM", tue: "12:00 PM-12:00 AM", wed: "12:00 PM-12:00 AM", thu: "12:00 PM-12:00 AM", fri: "12:00 PM-2:00 AM", sat: "12:00 PM-2:00 AM", sun: "12:00 PM-12:00 AM" },
  swizzle: daily("6:00 PM-5:00 AM"),
  viceVersa: daily("5:00 PM-12:00 AM"),
  stormyMonday: { mon: "5:00 PM-1:00 AM", tue: "Closed", wed: "Closed", thu: "5:00 PM-1:00 AM", fri: "5:00 PM-1:00 AM", sat: "5:00 PM-1:00 AM", sun: "5:00 PM-11:00 PM" },
  kaiju: { mon: "Closed", tue: "Closed", wed: "6:00 PM-2:00 AM", thu: "6:00 PM-2:00 AM", fri: "6:00 PM-2:00 AM", sat: "6:00 PM-2:00 AM", sun: "Closed" },
  mediumCool: { mon: "Closed", tue: "Closed", wed: "8:00 PM-2:00 AM", thu: "8:00 PM-2:00 AM", fri: "8:00 PM-2:00 AM", sat: "8:00 PM-2:00 AM", sun: "8:00 PM-12:00 AM" },
  dantes: { mon: "Closed", tue: "Closed", wed: "7:00 PM-late; sessions vary", thu: "7:00 PM-late; sessions vary", fri: "7:00 PM-late; sessions vary", sat: "7:00 PM-late; sessions vary", sun: "Closed" },
  champagneBar: daily("5:00 PM-12:00 AM"),
  sugar: { mon: "4:00 PM-1:00 AM", tue: "4:00 PM-1:00 AM", wed: "4:00 PM-1:00 AM", thu: "4:00 PM-1:00 AM", fri: "4:00 PM-2:00 AM", sat: "4:00 PM-2:00 AM", sun: "4:00 PM-1:00 AM" },
  pamm: { mon: "11:00 AM-6:00 PM", tue: "Closed", wed: "Closed", thu: "11:00 AM-9:00 PM", fri: "11:00 AM-6:00 PM", sat: "11:00 AM-6:00 PM", sun: "11:00 AM-6:00 PM" },
  frost: daily("10:00 AM-6:00 PM"),
  vizcaya: { mon: "9:30 AM-4:30 PM", tue: "Closed", wed: "9:30 AM-4:30 PM", thu: "9:30 AM-4:30 PM", fri: "9:30 AM-4:30 PM", sat: "9:30 AM-4:30 PM", sun: "9:30 AM-4:30 PM" },
  wynwoodWalls: daily("10:30 AM-7:30 PM"),
  rubell: { mon: "Closed", tue: "Closed", wed: "11:30 AM-5:30 PM", thu: "11:30 AM-5:30 PM", fri: "11:30 AM-5:30 PM", sat: "11:30 AM-5:30 PM", sun: "11:30 AM-5:30 PM" },
  ica: { mon: "Closed", tue: "12:00 PM-6:00 PM", wed: "12:00 PM-6:00 PM", thu: "12:00 PM-9:00 PM", fri: "12:00 PM-6:00 PM", sat: "12:00 PM-6:00 PM", sun: "12:00 PM-6:00 PM" },
  historyMiami: { mon: "Closed", tue: "Closed", wed: "10:00 AM-5:00 PM", thu: "10:00 AM-5:00 PM", fri: "10:00 AM-5:00 PM", sat: "10:00 AM-5:00 PM", sun: "10:00 AM-4:00 PM" },
  arsht: daily("Event calendar varies; box office/show times vary"),
  fairchild: daily("10:00 AM-5:00 PM"),
  venetianPool: { mon: "Closed", tue: "10:00 AM-4:30 PM", wed: "10:00 AM-4:30 PM", thu: "10:00 AM-4:30 PM", fri: "10:00 AM-4:30 PM", sat: "10:00 AM-4:30 PM", sun: "10:00 AM-4:30 PM" },
  capeFlorida: daily("8:00 AM-sunset"),
  everglades: daily("Park open 24 hours; visitor centers and tours vary"),
};

const hoursByName: Record<string, StopHours> = {
  "Joe's Stone Crab": hours.joes,
  "Versailles Restaurant": hours.versailles,
  "Mandolin Aegean Bistro": hours.mandolin,
  "Michael's Genuine Food & Drink": hours.michaels,
  "Stubborn Seed": hours.stubbornSeed,
  "Boia De": hours.boiaDe,
  Macchialina: hours.macchialina,
  "Zak the Baker": hours.zak,
  "The Surf Club Restaurant": hours.surfClub,
  "Garcia's Seafood Grille & Fish Market": hours.garcias,
  "Chef Creole": hours.chefCreole,
  "Sanguich de Miami": hours.sanguich,
  "La Sandwicherie": hours.laSandwicherie,
  "Enriqueta's Sandwich Shop": hours.enriquetas,
  "El Rey de las Fritas": hours.elRey,
  "Doggi's Arepa Bar": hours.doggis,
  "Coyo Taco Wynwood": hours.coyo,
  Taquiza: hours.taquiza,
  "Motek Downtown": hours.motek,
  Pincho: hours.pincho,
  "Ms. Cheezious": hours.msCheezious,
  "Mac's Club Deuce": hours.clubDeuce,
  ZeyZey: hours.zeyzey,
  "Ball & Chain": hours.ballChain,
  "Churchill's Pub": hours.churchills,
  "Lost Boy Dry Goods": hours.lostBoy,
  "Mama Tried": hours.mamaTried,
  "Bob's Your Uncle": hours.bobsYourUncle,
  "Ted's Hideaway": hours.teds,
  "The Corner": hours.corner,
  "DOM'S Brickell": hours.doms,
  "Broken Shaker": hours.brokenShaker,
  "Sweet Liberty Drinks & Supply Co.": hours.sweetLiberty,
  "Cafe La Trova": hours.cafeLaTrova,
  "Swizzle Rum Bar & Drinkery": hours.swizzle,
  ViceVersa: hours.viceVersa,
  "Stormy Monday": hours.stormyMonday,
  Kaiju: hours.kaiju,
  "Medium Cool": hours.mediumCool,
  "Dante's HiFi": hours.dantes,
  "The Champagne Bar at The Surf Club": hours.champagneBar,
  Sugar: hours.sugar,
  "Art Deco Historic District": alwaysOpen,
  "Perez Art Museum Miami": hours.pamm,
  "Phillip and Patricia Frost Museum of Science": hours.frost,
  "Vizcaya Museum and Gardens": hours.vizcaya,
  "Wynwood Walls": hours.wynwoodWalls,
  "Rubell Museum": hours.rubell,
  "Institute of Contemporary Art, Miami": hours.ica,
  "HistoryMiami Museum": hours.historyMiami,
  "Calle Ocho / Little Havana": alwaysOpen,
  "Adrienne Arsht Center": hours.arsht,
  "South Beach": alwaysOpen,
  "Ocean Drive and Lummus Park": alwaysOpen,
  "Little Havana": alwaysOpen,
  "Miami Design District": daily("District access; store, gallery, restaurant, and museum hours vary by venue"),
  "Fairchild Tropical Botanic Garden": hours.fairchild,
  "Venetian Pool": hours.venetianPool,
  "Bill Baggs Cape Florida State Park": hours.capeFlorida,
  "Everglades National Park": hours.everglades,
};

function expandDefaultHours(input: StopHours): StopHours {
  if (typeof input !== "object") return input;

  const hasDayKeys = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"].some((key) => key in input);
  if (hasDayKeys) return input;
  if (input.default) return daily(input.default);
  return input;
}

const images = {
  joes: "https://joesstonecrab.com/cdn/shop/files/DSC01527_2_1_1024x1024.jpg?v=1758217452",
  versailles: "https://cdn.prod.website-files.com/5f9b2a13bc4f61ef6ae5347a/6075e1e31b7036407ddbe518_4C8A8705.jpg",
  mandolin: "https://images.getbento.com/accounts/46c3628b83ff859c5f0fcb6aad5825ea/media/images/6161396G1360058%C3%82GESISCHILLING.jpg?w=1200&fit=crop&auto=compress,format&cs=origin&crop=focalpoint&fp-x=0.5&fp-y=0.5",
  michaels: "https://michaelsgenuine.com/wp-content/uploads/2022/03/Image.png",
  stubbornSeed: "https://popmenucloud.com/cdn-cgi/image/width=1920,height=1920,format=auto,fit=scale-down/tdyrnsco/79dcb579-b510-44fd-939d-77720f87f4d8.jpg",
  boiaDe: "https://images.getbento.com/accounts/5194193b6aa588b67083206d393f9374/media/images/2200413-summer_601.jpg?w=1200&fit=crop&auto=compress,format&cs=origin&crop=focalpoint&fp-x=0.5&fp-y=0.5",
  macchialina: "https://framerusercontent.com/images/ya9Ua9mkOew2FtLuGQyOaBityw.jpg",
  zak: "https://i0.wp.com/zakthebaker.com/wp-content/uploads/2018/09/22F7092C-F158-4D4A-85B7-4828F7B7E5AA.jpg?resize=2000%2C1200&ssl=1",
  surfClub: "https://www.surfclubrestaurant.com/assets/intro.png",
  garcias: "https://garciasseafoodgrill.com/images/crab-legs-red-wine(1).png",
  chefCreole: "https://chefcreole.com/store/wp-content/uploads/2022/02/JMV-106.jpg",
  sanguich: "https://sanguich.com/wp-content/uploads/2026/03/hero-burger-img-1-scaled-1.webp",
  laSandwicherie: "https://lasandwicherie.com/wp-content/uploads/2025/12/MIAMI-BEACH-1988-1024x791-1-1.jpg",
  enriquetas: "https://i0.wp.com/thejoyoffood.life/wp-content/uploads/2021/05/IMG_1538.jpg?w=960&ssl=1",
  elRey: "https://cdn.prod.website-files.com/64ef8e13dc35d6359120126f/65b30c32a3bff81533ad4561_EL%20REY%20OPEN%20GRAPH%20IMAGE.jpg",
  doggis: "https://www.eatdoggis.com/wp-content/uploads/2026/05/Arepas-Mix-8-scaled.jpg",
  coyo: "https://cdn.prod.website-files.com/616a1bd1184188e6f27a42d6/61773808f9772b574f04c47d_3Q5A8236-HDR.jpg",
  taquiza: "https://www.taquizatacos.com/images/pic01.jpg",
  motek: "https://motek.com/wp-content/uploads/2025/09/Brickell.png",
  pincho: "https://pincho.com/wp-content/uploads/2026/04/Pincho-Burgers-and-tots-photo.webp",
  msCheezious: "https://images.squarespace-cdn.com/content/v1/5afb079425bf02dd0af166cc/1686851830514-6VNK9GW1IDQ0W91CVTS8/BBQ%2BPulled%2BPork%2BGrilled%2BCheese-2.jpg",
  setai: "https://www.1hotels.com/sites/1hotels.com/files/br%61ndfolder/7b9bx9cbk65j9ngxk35fq7bv/Main_Pool_4w1440.png",
  faena: "https://commons.wikimedia.org/wiki/Special:FilePath/Faena_District_Miami_Beach_-_Hotel.jpg",
  oneHotel: "https://www.1hotels.com/sites/1hotels.com/files/br%61ndfolder/7b9bx9cbk65j9ngxk35fq7bv/Main_Pool_4w1440.png",
  betsy: "https://duvx7h32ggrur.cloudfront.net/attachments/fd5ecb7f123b44e28da06403052d36d57b102e79/store/fill/1200/630/6bd7e9c0d1e8561178be80bcaf3a59705d35cbb843e75e059cfe54c47b9e/stmia_2024_johannvazquez_gardens_04.jpg",
  standard: "https://duvx7h32ggrur.cloudfront.net/attachments/fd5ecb7f123b44e28da06403052d36d57b102e79/store/fill/1200/630/6bd7e9c0d1e8561178be80bcaf3a59705d35cbb843e75e059cfe54c47b9e/stmia_2024_johannvazquez_gardens_04.jpg",
  eastMiami: "https://edge.sitecorecloud.io/swirehotels1-swirehotels-production-ebf6/media/Project/EAST-Hotels/Miami/homepage/EAM_hero_view.jpg?h=2001&iar=0&w=3000",
  mrC: "https://www.mayfairhousemiami.com/content/uploads/2023/10/mayfair-hero.jpg",
  lifeHouse: "https://www.mayfairhousemiami.com/content/uploads/2023/10/mayfair-hero.jpg",
  mayfair: "https://www.mayfairhousemiami.com/content/uploads/2023/10/mayfair-hero.jpg",
  citizenM: "https://edge.sitecorecloud.io/swirehotels1-swirehotels-production-ebf6/media/Project/EAST-Hotels/Miami/homepage/EAM_hero_view.jpg?h=2001&iar=0&w=3000",
  viajero: "https://freehandhotels.com/miami/wp-content/uploads/sites/2/2024/01/Header_home_Miami.jpg",
  bedsDrinks: "http://static1.squarespace.com/static/60af50bcd716501cdc7ca074/t/610118468d2292319010755e/1627461702979/BnD+%283%29.png?format=1500w",
  posh: "https://poshsouthbeach.com/assets/images/BQ6A4062JPG.jpg",
  bikini: "https://bikinihostel.com/wp-content/uploads/2020/01/1-Main-photo-1024x640.png",
  freehand: "https://freehandhotels.com/miami/wp-content/uploads/sites/2/2024/01/Header_home_Miami.jpg",
  southBeachRooms: "http://static1.squarespace.com/static/60af50bcd716501cdc7ca074/t/610118468d2292319010755e/1627461702979/BnD+%283%29.png?format=1500w",
  clubDeuce: "https://static.wixstatic.com/media/86b992_9b9006c1e69d48f6b7548536222387cf~mv2.jpg/v1/fit/w_2500,h_1330,al_c/86b992_9b9006c1e69d48f6b7548536222387cf~mv2.jpg",
  zeyzey: "https://cdn.sanity.io/images/ahoarjgr/production/b0fdb68bb66ceac0dcda81c14a309c1dcc16c2b4-3200x1642.webp?w=1200&auto=format",
  gramps: "https://ballandchainmiami.com/wp-content/uploads/2015/02/ballandchain-facebook.jpg",
  ballChain: "https://ballandchainmiami.com/wp-content/uploads/2015/02/ballandchain-facebook.jpg",
  churchills: "https://churchillspub.com/wp-content/uploads/2018/03/shop-6-gallery-2.jpg",
  lostBoy: "https://ballandchainmiami.com/wp-content/uploads/2015/02/ballandchain-facebook.jpg",
  mamaTried: "https://static.wixstatic.com/media/86b992_9b9006c1e69d48f6b7548536222387cf~mv2.jpg/v1/fit/w_2500,h_1330,al_c/86b992_9b9006c1e69d48f6b7548536222387cf~mv2.jpg",
  bobsYourUncle: "https://static.wixstatic.com/media/1fe34d_1f13ee9092bc468ea5708f966f6b8ec2~mv2_d_3024_3024_s_4_2.jpeg/v1/fill/w_2500,h_2500,al_c/1fe34d_1f13ee9092bc468ea5708f966f6b8ec2~mv2_d_3024_3024_s_4_2.jpeg",
  anderson: "https://linktr.ee/og/image/woodpresents.jpg",
  tedHideaway: "https://static.wixstatic.com/media/86b992_9b9006c1e69d48f6b7548536222387cf~mv2.jpg/v1/fit/w_2500,h_1330,al_c/86b992_9b9006c1e69d48f6b7548536222387cf~mv2.jpg",
  corner: "http://static1.squarespace.com/static/674116611d4ac93935b2c56e/t/674116681d4ac93935b2c695/1732071582750/SocialSharing.png?format=1500w",
  woodTavern: "https://linktr.ee/og/image/woodpresents.jpg",
  doms: "https://cdn.prod.website-files.com/65bc68aafffa61a6d8ef5a77/660483bae0636b8ec2fa1029_IMG_7789.jpeg",
  brokenShaker: "https://images.getbento.com/accounts/f468abc38bf68e2c74a93581297771cf/media/images/70474Broken_Shaker_Miami_Pool.jpg",
  sweetLiberty: "https://cdn.prod.website-files.com/65bc68aafffa61a6d8ef5a77/65c0c78529141c1f8bedb1ad_DSC00176%201.png",
  cafeLaTrova: "https://images.getbento.com/accounts/bd9cb7b650e8de7a1bd5ec6171d85d56/media/images/15875CafeLaTrova_080922_2447.jpg?w=1200&fit=crop&auto=compress,format&cs=origin&crop=focalpoint&fp-x=0.5&fp-y=0.5",
  swizzle: "https://www.swizzlerumbardrinkery.com/wp-content/uploads/2025/01/Swizzle-Rum-Bar-Drinkery02-Concept-Design05092024_Page_14.jpg",
  viceVersa: "https://platform.miami.eater.com/wp-content/uploads/sites/12/chorus/uploads/chorus_asset/file/25500612/ViceVersa_Wide_Bar_Shot_Photo_Credit_R.C._Visuals.jpg?quality=90&strip=all&crop=0,10.732984293194,100,78.534031413613&w=1200",
  stormyMonday: "https://resizer.otstatic.com/v4/photos/92213721-3?width=640&height=640",
  kaiju: "https://images.squarespace-cdn.com/content/v1/68378a0022476b1092657eb6/1748470272865-PSOFY66YU661N5VQI6F2/01.png",
  mediumCool: "https://images.squarespace-cdn.com/content/v1/68378a0022476b1092657eb6/1748470272883-5CM06PWOKV3QFR7SZFZO/10.png",
  dantes: "https://danteshifi.com/wp-content/uploads/2021/10/Hero-banner-image.jpg",
  champagneBar: "https://www.fourseasons.com/alt/img-opt/~65.3402.0,0000-234,9812-2999,9742-1687,4855/publish/content/dam/fourseasons/images/web/MFL/MFL_1649_original.jpg",
  sugar: "https://edge.sitecorecloud.io/swirehotels1-swirehotels-production-ebf6/media/Project/EAST-Hotels/Miami/Eat-and-Drink/Done---Sugar/Done---3x2/Sugar-Miami---4_Resized.jpg?h=1000&iar=0&w=1500",
  artDeco: "https://upload.wikimedia.org/wikipedia/commons/e/e2/Ocean_Drive_in_the_Miami_Beach_Art_Deco_Historic_District.jpg",
  pamm: "https://upload.wikimedia.org/wikipedia/commons/c/ce/Perez_Art_Museum_Miami.jpg",
  frost: "http://www.frostscience.org/wp-content/uploads/2009/06/Contact-FeaturedImage.jpg",
  vizcaya: "https://upload.wikimedia.org/wikipedia/commons/5/59/Vizcaya_Museum_and_Gardens_%2C_Miami_060524_DSC6655.jpg",
  wynwoodWalls: "https://thewynwoodwalls.com/wp-content/uploads/2022/05/DJI_0491-copy-1.png",
  rubell: "https://rubellmuseum.org/templates/yootheme/cache/a0/Miami-squares-2024-25b--a06e0551.jpeg",
  ica: "https://media-icamiami-org.imgix.net/2017/12/1c2eca80-ica_miami_17-11_2887_06-e1519712573354.jpg?auto=compress,format&cs=srgb",
  historyMiami: "https://museumofmiami.org/wp-content/uploads/Discount.jpg",
  calleOcho: "https://www.miamiandbeaches.com/getmedia/d3ef9574-b6ea-4ad6-b9d9-c6f8f7ab20b0/2_Little_Havana_roosters_1440x900.jpg?width=600&resizemode=force",
  arsht: "https://upload.wikimedia.org/wikipedia/commons/3/3a/Adrienne_Arsht_Center_for_Performing_Arts_20100203.jpg",
  southBeach: "https://www.miamiandbeaches.com/getmedia/2ea8352f-9de8-408d-8cdd-83668211dcf1/south-beach-jetty-1440x900.jpg?width=600&resizemode=force",
  oceanDrive: "https://www.miamiandbeaches.com/getmedia/1d66bac2-2739-4f72-a227-2e98b56bddb8/art-deco-building.webp?width=600&resizemode=force",
  designDistrict: commons("Louis Vuitton Miami Design District - Shop entrance, January 2023.jpg"),
  fairchild: "https://fairchildgarden.org/wp-content/uploads/2026/05/FC-GDA-Banner2-scaled.webp",
  venetianPool: "https://upload.wikimedia.org/wikipedia/commons/0/04/Venetian_pool_coral_gables_florida.jpg",
  capeFlorida: "https://upload.wikimedia.org/wikipedia/commons/b/b5/Cape_Florida_Lighthouse_at_the_Bill_Baggs_Cape_Florida_State_Park.jpg",
  everglades: "https://upload.wikimedia.org/wikipedia/commons/7/76/Everglades_Anhinga_Trail_Pond.jpg",
  bayfront: commons("Bayfront Park Miami Florida.jpg"),
};

function stop(input: StopInput): GuideStop {
  const mapUrl = maps(input.mapQuery ?? `${input.name} Miami`);
  const resolvedHours = hoursByName[input.name] ?? expandDefaultHours(input.hours);
  const sourceUrls = [
    input.officialUrl,
    input.bookingUrl,
    mapUrl,
    input.photo,
    ...(input.editorialUrls ?? []),
  ].filter(Boolean) as string[];

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
    hours: resolvedHours,
    photo: input.photo,
    imageSourceUrl: input.photo,
    sourceUrls: [...new Set(sourceUrls)],
    sourceEvidence: {
      officialUrl: input.officialUrl,
      mapUrl,
      currentStatusUrl: mapUrl,
      imageSourceUrl: input.photo,
      editorialUrls: input.editorialUrls ?? [],
      checkedAt,
      notes: "Official/property source plus Google Maps search evidence checked for current status; hours are stored as current schedule notes or structured daily/24-hour rows where reliable.",
    },
  };
}

const diningStops = [
  stop({ id: "miami-dining-joes", name: "Joe's Stone Crab", coordinates: [25.76903, -80.13558], description: "Joe's is the old Miami Beach ritual that still earns the wait: stone crab claws in season, fried chicken out of season, tuxedo service, and a room that knows exactly what it is. Go early, understand the no-reservation main-room rhythm, and treat it as seafood history rather than a quiet dinner.", officialUrl: "https://joesstonecrab.com/", photo: images.joes, hours: { default: "Seasonal restaurant hours vary between the main dining room, takeaway, and summer service; verify the official hours page before going." }, price: "$$$$", priceSource: "Official menu / Google Maps", venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["seafood", "stone_crab", "american"], attributeTags: ["classic", "seafood", "reservation_recommended", "historic", "destination_dining"], editorialUrls: ["https://miami.eater.com/maps/miami-best-restaurants-38", "https://guide.michelin.com/us/en/florida/miami-beach/restaurant/joe-s-stone-crab"] }),
  stop({ id: "miami-dining-versailles", name: "Versailles Restaurant", coordinates: [25.765267, -80.25323], description: "Versailles is not subtle, and that is the point: mirrored rooms, Cuban coffee windows, croquetas, ropa vieja, and political gossip all packed into the Calle Ocho institution. Use it for the Miami Cuban baseline, then decide whether you want the full sit-down meal or just cafecito and pastry at the ventanita.", officialUrl: "https://versaillesrestaurant.com/", photo: images.versailles, hours: daily("breakfast through late dinner; exact holiday hours should be checked on the official listing."), price: "$$", priceSource: "Official menu / Google Maps", venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["cuban", "cafe", "bakery"], attributeTags: ["classic", "breakfast", "late_night", "family_friendly_food", "walk_in_friendly"], editorialUrls: ["https://www.miamiandbeaches.com/l/eat-and-drink/versailles-restaurant/2325", "https://www.timeout.com/miami/restaurants/versailles"] }),
  stop({ id: "miami-dining-mandolin", name: "Mandolin Aegean Bistro", coordinates: [25.815073, -80.190734], description: "Mandolin gives the Design District something Miami does well when it is not trying too hard: a courtyard, grilled fish, meze, Greek-Turkish comfort, and a slower lunch that can survive the shopping around it. Book ahead and avoid treating it like a quick stop; the room works because you settle in.", officialUrl: "https://www.mandolinmiami.com/", photo: images.mandolin, hours: daily("lunch and dinner service; reservations and weather-sensitive courtyard seating should be checked before going."), price: "$$$", priceSource: "Official menu / Google Maps", venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["greek", "turkish", "mediterranean"], attributeTags: ["romantic_food", "scenic_food", "reservation_recommended", "outdoor_seating", "design_district"], editorialUrls: ["https://miami.eater.com/maps/miami-best-restaurants-38", "https://www.theinfatuation.com/miami/reviews/mandolin-aegean-bistro"] }),
  stop({ id: "miami-dining-michaels", name: "Michael's Genuine Food & Drink", coordinates: [25.814922, -80.192036], description: "Michael's Genuine is the Design District grown-up anchor, less about spectacle than seasonal plates, good wine, and a room that helped make modern Miami dining feel local. It belongs here because it still works for lunch, dinner, or a serious neighborhood meal when the surrounding luxury retail gets too polished.", officialUrl: "https://www.michaelsgenuine.com/", photo: images.michaels, hours: { default: "Official site posts lunch, dinner, brunch, and happy-hour schedules by day; verify current service before booking." }, price: "$$$", priceSource: "Official menu / Google Maps", venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["american", "seasonal", "new_american"], attributeTags: ["reservation_recommended", "wine", "brunch", "local_favorite", "design_district"], editorialUrls: ["https://miami.eater.com/maps/miami-best-restaurants-38", "https://guide.michelin.com/us/en/florida/miami/restaurant/michael-s-genuine-food-drink"] }),
  stop({ id: "miami-dining-stubborn-seed", name: "Stubborn Seed", coordinates: [25.772986, -80.134297], description: "Stubborn Seed is the South Beach tasting-menu counterweight to the party postcard: Jeremy Ford's kitchen is polished, intense, and better for a planned dinner than a casual wander-in. Go when you want Miami Beach to feel chef-driven, not merely scene-driven, and book with enough time for the full pacing.", officialUrl: "https://www.stubbornseed.com/", photo: images.stubbornSeed, hours: { default: "Dinner and tasting-menu availability are posted by reservation date; closed days and seating times vary, so verify before booking." }, price: "$$$$", priceSource: "Official reservation platform / MICHELIN Guide", venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["modern_american", "tasting_menu", "fine_dining"], attributeTags: ["fine_dining", "tasting_menu", "reservation_recommended", "date_night", "splurge_food"], editorialUrls: ["https://guide.michelin.com/us/en/florida/miami-beach/restaurant/stubborn-seed", "https://miami.eater.com/maps/miami-best-restaurants-38"] }),
  stop({ id: "miami-dining-boia-de", name: "Boia De", coordinates: [25.837785, -80.184886], description: "Boia De hides its ambition in a little strip-mall room near Little Haiti: handmade pastas, sharp wine instincts, and cooking that feels more personal than Miami's bigger-money dining rooms. It is small, so the practical advice is simple: reserve early or do not pretend you can improvise it.", officialUrl: "https://boiaderestaurant.com/", photo: images.boiaDe, hours: { default: "Dinner service and closed days are posted on the official reservation calendar; verify current seating times before booking." }, price: "$$$", priceSource: "Official reservation platform / MICHELIN Guide", venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["italian", "modern_american", "wine_bar"], attributeTags: ["reservation_recommended", "date_night", "local_favorite", "wine", "destination_dining"], editorialUrls: ["https://guide.michelin.com/us/en/florida/miami/restaurant/boia-de", "https://www.theinfatuation.com/miami/reviews/boia-de"] }),
  stop({ id: "miami-dining-macchialina", name: "Macchialina", coordinates: [25.785317, -80.141582], description: "Macchialina is the South Beach Italian room to use when you want pasta, wine, and a little neighborhood friction instead of another hotel dining room. The hand-made pasta and compact room make it feel intimate quickly; reserve, especially if the plan depends on a pre-nightlife dinner.", officialUrl: "https://macchialina.com/", photo: images.macchialina, hours: { default: "Dinner hours and weekly specials are posted by day on the official site; verify same-week service before going." }, price: "$$$", priceSource: "Official menu / Google Maps", venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["italian", "pasta", "wine"], attributeTags: ["reservation_recommended", "date_night", "wine", "south_beach", "local_favorite"], editorialUrls: ["https://miami.eater.com/maps/miami-best-restaurants-38", "https://www.theinfatuation.com/miami/reviews/macchialina"] }),
  stop({ id: "miami-dining-zak", name: "Zak the Baker", coordinates: [25.801434, -80.201995], description: "Zak the Baker is the Wynwood breakfast and lunch stop that proves Miami food is not only late nights and hotel tabs: sourdough, babka, sandwiches, salads, and a bakery line with real turnover. Go earlier in the day, expect crowds, and use it before galleries rather than after a heavy beach afternoon.", officialUrl: "https://www.zakthebaker.com/", photo: images.zak, hours: { default: "Official bakery hours vary by weekday and weekend service; verify current hours before routing a morning around it." }, price: "$$", priceSource: "Official menu / Google Maps", venueKind: "food_drink", foodServiceType: "bakery", cuisineTypes: ["bakery", "jewish", "breakfast"], attributeTags: ["breakfast", "bakery", "vegetarian_friendly", "walk_in_friendly", "wynwood"], editorialUrls: ["https://miami.eater.com/maps/miami-best-restaurants-38", "https://www.timeout.com/miami/restaurants/zak-the-baker"] }),
  stop({ id: "miami-dining-surf-club", name: "The Surf Club Restaurant", coordinates: [25.878094, -80.121645], description: "The Surf Club Restaurant is Thomas Keller doing old Florida glamour with restraint: polished service, Continental references, and a dining room that feels built for occasion travel. It is not the place to chase bargains; book it when the night needs ceremony and the dress code can match the room.", officialUrl: "https://www.surfclubrestaurant.com/", photo: images.surfClub, hours: { default: "Lunch, dinner, and lounge hours vary by day and reservation availability; verify the official booking calendar." }, price: "$$$$", priceSource: "Official menu / MICHELIN Guide", venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["american", "continental", "fine_dining"], attributeTags: ["fine_dining", "romantic_food", "reservation_recommended", "splurge_food", "historic"], editorialUrls: ["https://guide.michelin.com/us/en/florida/surfside/restaurant/the-surf-club-restaurant", "https://miami.eater.com/maps/miami-best-restaurants-38"] }),
  stop({ id: "miami-dining-chef-creole", name: "Chef Creole", coordinates: [25.835787, -80.190638], description: "Chef Creole brings Haitian seafood, griot, conch, snapper, pikliz, rice, and Creole heat into the citywide dining guide, giving Miami's Caribbean food culture a clearer place beside Cuban, seafood, and chef-driven rooms. Use it when the plan needs a casual, flavor-heavy meal that feels local to Little Haiti rather than beach-polished.", officialUrl: "https://chefcreole.com/", photo: images.chefCreole, hours: daily("lunch and dinner service; verify current location hours before going."), price: "$$", priceSource: "Official menu / Google Maps", venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["haitian", "caribbean", "seafood"], attributeTags: ["caribbean_food", "seafood", "casual", "local_favorite", "little_haiti"], editorialUrls: ["https://miami.eater.com/maps/best-haitian-restaurants-miami", "https://www.miamiandbeaches.com/l/eat-and-drink/chef-creole/2616"] }),
];

const cheapEatStops = [
  stop({ id: "miami-cheap-sanguich", name: "Sanguich de Miami", coordinates: [25.765139, -80.219569], description: "Sanguich takes the Cuban sandwich seriously without turning it into museum food: pressed bread, lechon, croquetas, batidos, and a Calle Ocho counter that moves with purpose. It is the right Little Havana lunch when Versailles feels too big and you want the sandwich to be the reason.", officialUrl: "https://sanguich.com/", photo: images.sanguich, hours: daily("daytime and evening counter service; verify current location hours before going."), price: "$$", priceSource: "Official menu / Google Maps", venueKind: "food_drink", foodServiceType: "counter_service", cuisineTypes: ["cuban", "sandwiches", "croquetas"], attributeTags: ["quick_meal", "budget_food", "classic", "little_havana", "walk_in_friendly"], editorialUrls: ["https://miami.eater.com/maps/best-cuban-restaurants-miami", "https://www.theinfatuation.com/miami/reviews/sanguich-de-miami"] }),
  stop({ id: "miami-cheap-la-sandwicherie", name: "La Sandwicherie", coordinates: [25.78649, -80.131913], description: "La Sandwicherie is the Miami Beach sandwich counter that works before the beach, after the beach, or when dinner became too complicated. The French-style sandwiches, vinaigrette, and tiny counter rhythm are the draw; use it for speed, not lingering.", officialUrl: "https://lasandwicherie.com/", photo: images.laSandwicherie, hours: daily("long counter-service hours; late-night availability varies by location and should be verified."), price: "$", priceSource: "Official menu / Google Maps", venueKind: "food_drink", foodServiceType: "counter_service", cuisineTypes: ["sandwiches", "french", "salads"], attributeTags: ["quick_meal", "budget_food", "late_night", "walk_in_friendly", "beach"], editorialUrls: ["https://www.timeout.com/miami/restaurants/la-sandwicherie", "https://www.theinfatuation.com/miami/reviews/la-sandwicherie"] }),
  stop({ id: "miami-cheap-enriquetas", name: "Enriqueta's Sandwich Shop", coordinates: [25.800123, -80.193552], description: "Enriqueta's is the Wynwood/Edgewater Cuban breakfast and sandwich stop with less spectacle and more utility: tostadas, cafe, medianoches, and straightforward plates. Go early, expect a tight counter, and do not make it fight for attention against a long gallery day.", officialUrl: "https://enriquetas.com/", photo: images.enriquetas, hours: { default: "Breakfast and lunch hours are posted by current listings; verify same-day hours because service is not a late-night format." }, price: "$", priceSource: "Official/menu listing / Google Maps", venueKind: "food_drink", foodServiceType: "counter_service", cuisineTypes: ["cuban", "breakfast", "sandwiches"], attributeTags: ["breakfast", "budget_food", "quick_meal", "local_favorite", "walk_in_friendly"], editorialUrls: ["https://miami.eater.com/maps/best-cuban-restaurants-miami", "https://www.theinfatuation.com/miami/reviews/enriquetas-sandwich-shop"] }),
  stop({ id: "miami-cheap-el-rey", name: "El Rey de las Fritas", coordinates: [25.765468, -80.223461], description: "El Rey de las Fritas is for the Cuban frita, not a polite burger comparison: spiced beef, potato sticks, soft bun, and a fast counter that feels built for a specific craving. Add it when Little Havana needs one cheap, local bite between coffee, dominoes, and Calle Ocho walking.", officialUrl: "https://elreydelasfritas.com/", photo: images.elRey, hours: daily("counter-service hours with late afternoon/evening variation by branch; verify the Little Havana listing."), price: "$", priceSource: "Official menu / Google Maps", venueKind: "food_drink", foodServiceType: "fast_casual", cuisineTypes: ["cuban", "frita", "burgers"], attributeTags: ["budget_food", "quick_meal", "classic", "little_havana", "walk_in_friendly"], editorialUrls: ["https://miami.eater.com/maps/best-cuban-restaurants-miami", "https://www.timeout.com/miami/restaurants/el-rey-de-las-fritas"] }),
  stop({ id: "miami-cheap-doggis", name: "Doggi's Arepa Bar", coordinates: [25.754166, -80.20933], description: "Doggi's gives the cheap-eats guide Venezuelan heft: arepas, cachapas, pepitos, and enough menu range to solve a group meal without turning it expensive. It is casual and filling, best used when the route is south of Brickell or edging toward Coral Way.", officialUrl: "https://www.eatdoggis.com/", photo: images.doggis, hours: daily("lunch through dinner service; location-specific hours should be checked before routing."), price: "$$", priceSource: "Official menu / Google Maps", venueKind: "food_drink", foodServiceType: "fast_casual", cuisineTypes: ["venezuelan", "arepas", "latin_american"], attributeTags: ["budget_food", "quick_meal", "group_friendly", "casual", "latin_food"], editorialUrls: ["https://miami.eater.com/maps/best-arepas-miami", "https://www.theinfatuation.com/miami/reviews/doggis-arepa-bar"] }),
  stop({ id: "miami-cheap-coyo", name: "Coyo Taco Wynwood", coordinates: [25.80091, -80.199865], description: "Coyo Taco is not obscure, but it is useful: tacos, quick turnover, a Wynwood address, and enough late energy to keep a casual night moving. Use it as a fast meal before bars or murals, not as proof that Miami's Mexican food begins and ends in Wynwood.", officialUrl: "https://www.coyo-taco.com/", photo: images.coyo, hours: daily("lunch, dinner, and late service by location; verify Wynwood hours before counting on late food."), price: "$$", priceSource: "Official menu / Google Maps", venueKind: "food_drink", foodServiceType: "fast_casual", cuisineTypes: ["tacos", "mexican", "counter_service"], attributeTags: ["quick_meal", "late_night", "group_friendly", "wynwood", "walk_in_friendly"], editorialUrls: ["https://miami.eater.com/maps/best-tacos-miami", "https://www.timeout.com/miami/restaurants/coyo-taco"] }),
  stop({ id: "miami-cheap-taquiza", name: "Taquiza", coordinates: [25.772922, -80.134093], description: "Taquiza earns its place through blue-masa tortillas, simple tacos, and a beach-adjacent format that does not require a dressed-up dinner plan. It is strongest when South Beach needs something casual with more character than hotel snacks; verify the branch because locations have shifted over time.", officialUrl: "https://www.taquiza.com/", photo: images.taquiza, hours: daily("counter-service hours by location; verify current branch hours before going."), price: "$$", priceSource: "Official menu / Google Maps", venueKind: "food_drink", foodServiceType: "counter_service", cuisineTypes: ["tacos", "mexican", "masa"], attributeTags: ["quick_meal", "casual", "beach", "walk_in_friendly", "budget_food"], editorialUrls: ["https://miami.eater.com/maps/best-tacos-miami", "https://www.theinfatuation.com/miami/reviews/taquiza"] }),
  stop({ id: "miami-cheap-motek", name: "Motek Downtown", coordinates: [25.774347, -80.193038], description: "Motek gives Downtown and Brickell-adjacent days a practical Israeli-Mediterranean stop: hummus, shakshuka, schnitzel, salads, and a menu that works for mixed groups. It is not the cheapest counter in Miami, but it earns the medium-eats slot because the food solves lunch and dinner cleanly.", officialUrl: "https://motekcafe.com/", photo: images.motek, hours: daily("breakfast, lunch, and dinner service by location; verify Downtown hours before routing."), price: "$$", priceSource: "Official menu / Google Maps", venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["israeli", "mediterranean", "middle_eastern"], attributeTags: ["vegetarian_friendly", "group_friendly", "brunch", "downtown", "casual"], editorialUrls: ["https://miami.eater.com/maps/miami-best-restaurants-38", "https://www.theinfatuation.com/miami/reviews/motek"] }),
  stop({ id: "miami-cheap-pincho", name: "Pincho", coordinates: [25.729584, -80.241797], description: "Pincho is the Miami-born burger-and-kebab chain that belongs here because cheap-ish local fast casual should not be ignored in favor of only nostalgia counters. Use it for a quick, unfussy meal when the group wants burgers, bowls, or skewers without a reservation.", officialUrl: "https://pincho.com/", photo: images.pincho, hours: daily("lunch and dinner service by branch; verify the selected location before going."), price: "$$", priceSource: "Official menu / Google Maps", venueKind: "food_drink", foodServiceType: "fast_casual", cuisineTypes: ["burgers", "kebabs", "latin_american"], attributeTags: ["quick_meal", "group_friendly", "casual", "budget_food", "family_friendly_food"], editorialUrls: ["https://www.timeout.com/miami/restaurants/pincho-factory", "https://miami.eater.com/maps/best-burgers-miami"] }),
  stop({ id: "miami-cheap-ms-cheezious", name: "Ms. Cheezious", coordinates: [25.829319, -80.192628], description: "Ms. Cheezious turns the grilled-cheese food-truck idea into a dependable casual stop, with melts, tomato soup, and comfort-food energy that works after breweries or before a low-key night. It is not refined, and that is exactly why it belongs in a medium-to-cheap guide.", officialUrl: "https://www.mscheezious.com/", photo: images.msCheezious, hours: daily("lunch and dinner service; confirm current restaurant hours and food-truck events before going."), price: "$$", priceSource: "Official menu / Google Maps", venueKind: "food_drink", foodServiceType: "fast_casual", cuisineTypes: ["grilled_cheese", "american", "comfort_food"], attributeTags: ["casual", "quick_meal", "family_friendly_food", "budget_food", "comfort_food"], editorialUrls: ["https://www.timeout.com/miami/restaurants/ms-cheezious", "https://miami.eater.com/maps/best-cheap-eats-miami"] }),
];

const hotelStops = [
  stop({ id: "miami-hotel-setai", name: "The Setai, Miami Beach", coordinates: [25.796428, -80.128211], description: "The Setai is the South Beach luxury stay for travelers who want calm, service, and design discipline rather than a pool-party hotel. The Art Deco base, Asian-influenced interiors, three pools, and beachfront position make it a splurge stay that can soften Miami's louder edges.", officialUrl: "https://www.thesetaihotels.com/", bookingUrl: "https://www.thesetaihotels.com/", photo: images.setai, hours: alwaysOpen, price: "$$$$", priceSource: "Official booking site / Google Travel", venueKind: "lodging", lodgingType: "hotel", attributeTags: ["luxury", "beach", "quiet", "romantic", "wellness"], editorialUrls: ["https://www.cntraveler.com/hotels/miami-beach/the-setai-miami-beach", "https://www.miamiandbeaches.com/l/hotels/the-setai/3548"] }),
  stop({ id: "miami-hotel-faena", name: "Faena Hotel Miami Beach", coordinates: [25.807381, -80.123399], description: "Faena is Mid-Beach maximalism: red, gold, theater, Damien Hirst spectacle, and a hotel campus that treats dinner, cabaret, spa, and beach as one production. Book it when the stay itself is part of the trip, not when you want a quiet bargain near the clubs.", officialUrl: "https://www.faena.com/miami-beach", bookingUrl: "https://www.faena.com/miami-beach", photo: images.faena, hours: alwaysOpen, price: "$$$$", priceSource: "Official booking site / Google Travel", venueKind: "lodging", lodgingType: "hotel", attributeTags: ["luxury", "design", "beach", "nightlife_nearby", "romantic"], editorialUrls: ["https://www.cntraveler.com/hotels/miami-beach/faena-hotel-miami-beach", "https://www.forbestravelguide.com/hotels/miami-florida/faena-hotel-miami-beach"] }),
  stop({ id: "miami-hotel-one", name: "1 Hotel South Beach", coordinates: [25.798961, -80.1274], description: "1 Hotel South Beach is the beach stay for travelers who want scale, greenery, big pools, wellness language, and a softer luxury mood than the neon side of South Beach. It is expensive but practical for families and couples who want the ocean, gym, food, and rooms to do most of the work.", officialUrl: "https://www.1hotels.com/south-beach", bookingUrl: "https://www.1hotels.com/south-beach", photo: images.oneHotel, hours: alwaysOpen, price: "$$$$", priceSource: "Official booking site / Google Travel", venueKind: "lodging", lodgingType: "hotel", attributeTags: ["luxury", "wellness", "beach", "family_friendly", "design"], editorialUrls: ["https://www.cntraveler.com/hotels/miami-beach/1-hotel-south-beach", "https://www.travelandleisure.com/hotels-resorts/beach-hotels/1-hotel-south-beach-miami-review"] }),
  stop({ id: "miami-hotel-betsy", name: "The Betsy Hotel", coordinates: [25.786345, -80.129964], description: "The Betsy is Ocean Drive without the cartoon version of Ocean Drive: a literary, art-forward boutique hotel with a quieter lobby culture and easy beach access. Use it when South Beach access matters but the stay should still feel adult, walkable, and human-scaled.", officialUrl: "https://www.thebetsyhotel.com/", bookingUrl: "https://www.thebetsyhotel.com/", photo: images.betsy, hours: alwaysOpen, price: "$$$$", priceSource: "Official booking site / Google Travel", venueKind: "lodging", lodgingType: "hotel", attributeTags: ["boutique", "beach", "design", "romantic", "central"], editorialUrls: ["https://www.cntraveler.com/hotels/miami-beach/the-betsy-south-beach", "https://www.miamiandbeaches.com/l/hotels/the-betsy-south-beach/3187"] }),
  stop({ id: "miami-hotel-standard", name: "The Standard Spa, Miami Beach", coordinates: [25.79284, -80.149278], description: "The Standard Spa sits on Belle Isle, which gives it a different Miami rhythm: bay views, hydrotherapy, sunset lounging, and a social scene that is less beach-front hotel and more wellness clubhouse. Book it when spa time and Venetian Causeway calm matter more than immediate sand access.", officialUrl: "https://www.standardhotels.com/miami/properties/miami-beach", bookingUrl: "https://www.standardhotels.com/miami/properties/miami-beach", photo: images.standard, hours: alwaysOpen, price: "$$$", priceSource: "Official booking site / Google Travel", venueKind: "lodging", lodgingType: "hotel", attributeTags: ["wellness", "scenic", "romantic", "design", "bayfront"], editorialUrls: ["https://www.cntraveler.com/hotels/miami-beach/the-standard-miami-beach", "https://www.miamiandbeaches.com/l/hotels/the-standard-miami-beach/3324"] }),
  stop({ id: "miami-hotel-east", name: "EAST Miami", coordinates: [25.767478, -80.193598], description: "EAST Miami is the Brickell base for travelers who want skyline views, transit, shopping, rooftop drinks, and a downtown-business rhythm rather than beach logistics. It works especially well when the trip includes Brickell, Downtown, or late nights that should end near the room.", officialUrl: "https://www.easthotels.com/en/miami/", bookingUrl: "https://www.easthotels.com/en/miami/", photo: images.eastMiami, hours: alwaysOpen, price: "$$$", priceSource: "Official booking site / Google Travel", venueKind: "lodging", lodgingType: "hotel", attributeTags: ["central", "nightlife_nearby", "work_friendly", "scenic", "design"], editorialUrls: ["https://www.cntraveler.com/hotels/miami/east-miami", "https://www.miamiandbeaches.com/l/hotels/east-miami/3645"] }),
  stop({ id: "miami-hotel-mr-c", name: "Mr. C Miami Coconut Grove", coordinates: [25.728865, -80.241673], description: "Mr. C gives Coconut Grove a polished stay with Biscayne Bay angles, yacht-club energy, and an Italian-hospitality tone that feels far from South Beach. It is best for travelers who want greener streets, restaurants, and calmer evenings, but still need a real hotel experience.", officialUrl: "https://www.mrchotels.com/miami-coconut-grove", bookingUrl: "https://www.mrchotels.com/miami-coconut-grove", photo: images.mrC, hours: alwaysOpen, price: "$$$", priceSource: "Official booking site / Google Travel", venueKind: "lodging", lodgingType: "hotel", attributeTags: ["boutique", "scenic", "romantic", "quiet", "coconut_grove"], editorialUrls: ["https://www.cntraveler.com/hotels/miami/mr-c-miami-coconut-grove", "https://www.miamiandbeaches.com/l/hotels/mr-c-miami-coconut-grove/42416"] }),
  stop({ id: "miami-hotel-life-house", name: "Life House Little Havana", coordinates: [25.766122, -80.213214], description: "Life House Little Havana is the neighborhood-base pick when Calle Ocho, Cuban food, and a more local-feeling stay matter more than the beach. Rooms are compact and design-led, so read categories carefully; the advantage is being near Little Havana nights without defaulting to South Beach.", officialUrl: "https://www.life-house.com/hotels/little-havana", bookingUrl: "https://www.life-house.com/hotels/little-havana", photo: images.lifeHouse, hours: alwaysOpen, price: "$$", priceSource: "Official booking site / Google Travel", venueKind: "lodging", lodgingType: "hotel", attributeTags: ["boutique", "midrange", "central", "little_havana", "design"], editorialUrls: ["https://www.cntraveler.com/hotels/miami/life-house-little-havana", "https://www.miamiandbeaches.com/l/hotels/life-house-little-havana/42397"] }),
  stop({ id: "miami-hotel-mayfair", name: "Mayfair House Hotel & Garden", coordinates: [25.728339, -80.24083], description: "Mayfair House is Coconut Grove lushness: garden courtyards, sculptural architecture, rooftop pool, and a base that favors Grove restaurants and bay walks over beach traffic. It belongs here because Miami hotel planning should include a green, neighborhood-forward alternative to the usual Collins Avenue decision.", officialUrl: "https://www.mayfairhousemiami.com/", bookingUrl: "https://www.mayfairhousemiami.com/", photo: images.mayfair, hours: alwaysOpen, price: "$$$", priceSource: "Official booking site / Google Travel", venueKind: "lodging", lodgingType: "hotel", attributeTags: ["boutique", "design", "romantic", "quiet", "coconut_grove"], editorialUrls: ["https://www.cntraveler.com/hotels/miami/mayfair-house-hotel-garden", "https://www.travelandleisure.com/mayfair-house-hotel-garden-miami-review-6755352"] }),
  stop({ id: "miami-hotel-citizenm", name: "citizenM Miami Brickell", coordinates: [25.763962, -80.193142], description: "citizenM Miami Brickell is the efficient base: compact rooms, strong beds, self-check-in, a rooftop pool, and immediate access to Brickell restaurants and transit. It is the sensible pick when you want money left for food and bars, not a resort you will barely use.", officialUrl: "https://www.citizenm.com/hotels/united-states/miami/miami-brickell-hotel", bookingUrl: "https://www.citizenm.com/hotels/united-states/miami/miami-brickell-hotel", photo: images.citizenM, hours: alwaysOpen, price: "$$", priceSource: "Official booking site / Google Travel", venueKind: "lodging", lodgingType: "hotel", attributeTags: ["midrange", "work_friendly", "central", "transit_friendly", "design"], editorialUrls: ["https://www.cntraveler.com/hotels/miami/citizenm-miami-brickell", "https://www.miamiandbeaches.com/l/hotels/citizenm-miami-brickell/49344"] }),
];

const hostelStops = [
  stop({ id: "miami-hostel-viajero", name: "Viajero Miami", coordinates: [25.780994, -80.131323], description: "Viajero Miami is the strongest current South Beach hostel-style base, with shared and private rooms, a pool, social programming, and a location close enough to the beach to matter. Book it for social energy and price control, then verify your exact room type because hostel inventory can shift quickly in Miami.", officialUrl: "https://www.viajerohostels.com/destinations/miami/", bookingUrl: "https://www.viajerohostels.com/destinations/miami/", photo: images.viajero, hours: alwaysOpen, price: "$$", priceSource: "Official booking site / Hostelworld", venueKind: "lodging", lodgingType: "hostel", attributeTags: ["budget", "social", "beach", "private_rooms", "dorms"], editorialUrls: ["https://www.hostelworld.com/hostels/p/308226/viajero-miami/", "https://www.booking.com/hostels/city/us/miami-beach.html"] }),
  stop({ id: "miami-hostel-beds-drinks", name: "Beds n' Drinks", coordinates: [25.790879, -80.130801], description: "Beds n' Drinks is the straightforward budget hostel option near Lincoln Road and the beach, useful for travelers who care more about location and cost than polished design. It has the kind of social, no-frills setup that can work for a short stay; verify dorm versus private-room availability before booking.", officialUrl: "https://bedsndrinks.com/", bookingUrl: "https://bedsndrinks.com/", photo: images.bedsDrinks, hours: alwaysOpen, price: "$", priceSource: "Official booking site / Hostelworld", venueKind: "lodging", lodgingType: "hostel", attributeTags: ["budget", "social", "beach", "dorms", "private_rooms"], editorialUrls: ["https://www.hostelworld.com/hostels/p/72528/beds-n-drinks/", "https://www.booking.com/hostels/city/us/miami-beach.html"] }),
  stop({ id: "miami-hostel-posh", name: "Posh South Beach Hostel", coordinates: [25.778342, -80.132023], description: "Posh South Beach is the adult-only, rooftop-pool hostel play, better for travelers who want a party-adjacent crash pad than a quiet boutique stay. It belongs here because South Beach hostel choices are thin; read recent room, locker, and shared-bath details carefully before booking.", officialUrl: "https://www.poshsouthbeach.com/", bookingUrl: "https://www.poshsouthbeach.com/", photo: images.posh, hours: alwaysOpen, price: "$", priceSource: "Official booking site / Hostelworld", venueKind: "lodging", lodgingType: "hostel", attributeTags: ["budget", "party", "beach", "dorms", "social"], editorialUrls: ["https://www.hostelworld.com/hostels/p/73684/posh-south-beach-hostel/", "https://www.booking.com/hostels/city/us/miami-beach.html"] }),
  stop({ id: "miami-hostel-bikini", name: "Bikini Hostel & Beer Garden", coordinates: [25.789478, -80.140664], description: "Bikini Hostel is a rougher, budget-social South Beach option with shared rooms, private-room possibilities, and a beer-garden format that will not suit every traveler. Include it only for price-sensitive guests who have read current reviews and understand the tradeoff between cost, social energy, and comfort.", officialUrl: "https://bikinihostel.com/", bookingUrl: "https://bikinihostel.com/", photo: images.bikini, hours: alwaysOpen, price: "$", priceSource: "Official booking site / Hostelworld", venueKind: "lodging", lodgingType: "hostel", attributeTags: ["budget", "social", "party", "dorms", "no_frills"], editorialUrls: ["https://www.hostelworld.com/hostels/p/53831/bikini-hostel-and-beer-garden/", "https://www.booking.com/hostels/city/us/miami-beach.html"] }),
  stop({ id: "miami-hostel-freehand", name: "Freehand Miami", coordinates: [25.80338, -80.126593], description: "Freehand Miami is included with a caution: it has long been the social Miami Beach budget-stay reference and still anchors the Broken Shaker scene, but dorm-style inventory should be verified before booking. Treat it as a social budget hotel/hostel hybrid and choose it for the courtyard, bar, and Mid-Beach location.", officialUrl: "https://freehandhotels.com/miami/", bookingUrl: "https://freehandhotels.com/miami/", photo: images.freehand, hours: alwaysOpen, price: "$$", priceSource: "Official booking site / Hostelworld / Google Travel", venueKind: "lodging", lodgingType: "hostel", attributeTags: ["budget", "social", "beach", "private_rooms", "nightlife_nearby"], editorialUrls: ["https://www.hostelworld.com/hostels/p/61189/freehand-miami/", "https://www.timeout.com/miami/hotels/freehand-miami"] }),
  stop({ id: "miami-hostel-south-beach-rooms", name: "South Beach Rooms and Hostel", coordinates: [25.77955, -80.132454], description: "South Beach Rooms and Hostel is a pure location/value pick near Ocean Drive, better for travelers who need cheap access than anyone chasing design or quiet. Use it only after checking recent room conditions, dorm/private availability, and policies; the advantage is being close to the beach and nightlife at a lower price.", officialUrl: "https://southbeachroomsandhostel.com/", bookingUrl: "https://southbeachroomsandhostel.com/", photo: images.southBeachRooms, hours: alwaysOpen, price: "$", priceSource: "Official booking site / Hostelworld", venueKind: "lodging", lodgingType: "hostel", attributeTags: ["budget", "beach", "dorms", "private_rooms", "no_frills"], editorialUrls: ["https://www.hostelworld.com/hostels/p/19386/south-beach-rooms-and-hostel/", "https://www.booking.com/hostels/city/us/miami-beach.html"] }),
];

const casualBarStops = [
  stop({ id: "miami-bar-club-deuce", name: "Mac's Club Deuce", coordinates: [25.785566, -80.134073], description: "Mac's Club Deuce is the South Beach dive that keeps the lights low and the mythology intact: old neon, pool, early happy hour, and a crowd that does not need bottle-service permission. It belongs in the casual guide because it is one of the few beach bars that still feels lived in.", officialUrl: "https://www.macsclubdeuce.com/", photo: images.clubDeuce, hours: daily("late-morning to very late bar hours; verify same-day hours before relying on late service."), price: "$", priceSource: "Official/site listing / Google Maps", venueKind: "nightlife", nightlifeType: "dive_bar", attributeTags: ["dive_bar", "cheap_drinks", "late_night", "local_bar", "south_beach"], editorialUrls: ["https://www.timeout.com/miami/bars/macs-club-deuce", "https://miami.eater.com/maps/best-bars-miami"] }),
  stop({ id: "miami-bar-zeyzey", name: "ZeyZey", coordinates: [25.83248, -80.19228], description: "ZeyZey gives Miami's casual nightlife guide a current Little Haiti anchor: a tropical courtyard, live shows, DJs, food vendors, and a calendar that feels closer to the city's creative scene than a bottle-service room. Check the lineup first because the event is the point, but it is one of the better replacements for the old Wynwood live-bar circuit.", officialUrl: "https://zeyzeymiami.com/", photo: images.zeyzey, hours: { default: "Tuesday-Sunday evening to late; check the official calendar and Instagram for opening times and show times." }, price: "$$", priceSource: "Official calendar / Google Maps", venueKind: "nightlife", nightlifeType: "live_music_venue", musicGenres: ["dj", "live_events", "global"], attributeTags: ["live_music", "dj_sets", "casual_nightlife", "little_haiti", "outdoor"], editorialUrls: ["https://miami.eater.com/venue/103380/zeyzey", "https://www.timeout.com/miami/music/zeyzey"] }),
  stop({ id: "miami-bar-ball-chain", name: "Ball & Chain", coordinates: [25.765092, -80.219605], description: "Ball & Chain gives Little Havana a night out with live Latin music, mojitos, salsa energy, and a historic Calle Ocho name that still pulls visitors and locals into the same room. It is a better fit for music and movement than a quiet drink, so check show times before building the night around it.", officialUrl: "https://ballandchainmiami.com/", photo: images.ballChain, hours: daily("afternoon/evening through late-night service; live music schedules vary and should be checked."), price: "$$", priceSource: "Official menu / Google Maps", venueKind: "nightlife", nightlifeType: "live_music_venue", musicGenres: ["latin", "salsa", "son"], attributeTags: ["live_music", "dance_floor", "lively_nightlife", "little_havana", "tourist_friendly"], editorialUrls: ["https://www.timeout.com/miami/bars/ball-chain", "https://www.miamiandbeaches.com/l/eat-and-drink/ball-chain/3742"] }),
  stop({ id: "miami-bar-churchills", name: "Churchill's Pub", coordinates: [25.826744, -80.191056], description: "Churchill's is the Little Haiti punk-and-pub institution, rough around the edges in a way that Miami needs if the nightlife map is not going to be only rooftops. Go for local music, beer, and grit; check the event calendar because the best reason to go is usually the bill.", officialUrl: "https://www.churchillspub.com/", photo: images.churchills, hours: { default: "Pub and show hours vary by event; verify the official calendar and current listing before going." }, price: "$", priceSource: "Official calendar / Google Maps", venueKind: "nightlife", nightlifeType: "live_music_venue", musicGenres: ["punk", "rock", "local_bands"], attributeTags: ["live_music", "cheap_drinks", "casual_nightlife", "little_haiti", "late_night"], editorialUrls: ["https://www.timeout.com/miami/music/churchills-pub", "https://miami.eater.com/maps/best-bars-miami"] }),
  stop({ id: "miami-bar-lost-boy", name: "Lost Boy Dry Goods", coordinates: [25.775435, -80.190999], description: "Lost Boy is the Downtown bar that feels more like a neighborhood room than a nightlife pitch deck: darts, pints, cocktails, and a pub-ish rhythm in a city that can over-style everything. It is ideal before a show, after work, or when Brickell's gloss starts to feel expensive.", officialUrl: "https://lostboydrygoods.com/", photo: images.lostBoy, hours: daily("afternoon through late-night bar hours; verify current hours before going."), price: "$$", priceSource: "Official menu / Google Maps", venueKind: "nightlife", nightlifeType: "pub", attributeTags: ["local_bar", "casual_nightlife", "games", "downtown", "walk_in_friendly_nightlife"], editorialUrls: ["https://miami.eater.com/maps/best-bars-miami", "https://www.timeout.com/miami/bars/lost-boy"] }),
  stop({ id: "miami-bar-mama-tried", name: "Mama Tried", coordinates: [25.773959, -80.192717], description: "Mama Tried is Downtown's neon-lit, late-running party bar without the full club commitment: DJs, cheap-ish drinks, booths, and a crowd that can turn quickly from casual to messy. It belongs here because Miami needs a non-rooftop late room; go after dinner, not for a delicate first cocktail.", officialUrl: "https://mamatriedmia.com/", photo: images.mamaTried, hours: { default: "Evening to late-night hours vary by day; verify current schedule before planning around a late stop." }, price: "$$", priceSource: "Official/menu listing / Google Maps", venueKind: "nightlife", nightlifeType: "dive_bar", musicGenres: ["dj", "dance"], attributeTags: ["late_night", "dj_sets", "casual_nightlife", "downtown", "party_nightlife"], editorialUrls: ["https://www.timeout.com/miami/bars/mama-tried", "https://miami.eater.com/maps/best-bars-miami"] }),
  stop({ id: "miami-bar-bobs-your-uncle", name: "Bob's Your Uncle", coordinates: [25.85556, -80.12309], description: "Bob's Your Uncle is a North Beach neighborhood bar for people who want darts, pool, local beer, late hours, and an easier crowd than South Beach's busiest rooms. It is useful because it gives the guide a real Miami Beach local-bar option north of the tourist strip.", officialUrl: "https://www.bobsyourunclemiami.com/", photo: images.bobsYourUncle, hours: { default: "Sunday-Thursday 3:00 PM-2:00 AM; Friday-Saturday 3:00 PM-3:00 AM." }, price: "$$", priceSource: "Official site / Miami Beach listing", venueKind: "nightlife", nightlifeType: "pub", attributeTags: ["local_bar", "games", "casual_nightlife", "north_beach", "late_night"], editorialUrls: ["https://www.timeout.com/miami/bars/bobs-your-uncle", "https://www.experiencemiamibeach.com/businesses/bobs-your-uncle"] }),
  stop({ id: "miami-bar-teds", name: "Ted's Hideaway", coordinates: [25.770193, -80.134318], description: "Ted's Hideaway is South of Fifth's no-frills sports-and-dive room, useful when Joe's, the beach, or a polished dinner needs a cheaper after-stop. Expect regulars, screens, and late hours rather than design; that plainness is exactly why it is useful.", officialUrl: "https://tedshideaway.com/", photo: images.tedHideaway, hours: daily("afternoon through late-night bar hours; verify holiday and game-day schedules."), price: "$", priceSource: "Official/site listing / Google Maps", venueKind: "nightlife", nightlifeType: "dive_bar", attributeTags: ["sports_screening", "cheap_drinks", "late_night", "south_beach", "local_bar"], editorialUrls: ["https://www.timeout.com/miami/bars/teds-hideaway", "https://www.theinfatuation.com/miami/reviews/teds-hideaway"] }),
  stop({ id: "miami-bar-corner", name: "The Corner", coordinates: [25.78382, -80.1941], description: "The Corner is Downtown Miami's late-night pressure valve: craft drinks, beer, DJs, jazz nights, karaoke, and food until the hour when most polished bars have already given up. It works before or after Club Space, but it is also a better everyday downtown bar than the hotel-lounge circuit.", officialUrl: "https://www.thecornermiami.com/", photo: images.corner, hours: { default: "Sunday-Thursday 4:00 PM-5:00 AM; Friday-Saturday 4:00 PM-7:00 AM." }, price: "$$", priceSource: "Official site / Eater Miami", venueKind: "nightlife", nightlifeType: "cocktail_bar", musicGenres: ["dj", "jazz", "karaoke"], attributeTags: ["late_night", "casual_nightlife", "downtown", "local_bar", "food_bar"], editorialUrls: ["https://miami.eater.com/venue/32240/the-corner", "https://miami.eater.com/maps/best-neighborhood-bars-miami"] }),
  stop({ id: "miami-bar-doms", name: "DOM'S Brickell", coordinates: [25.762435, -80.193444], description: "DOM'S gives Brickell a cocktail-bar-meets-neighborhood-room option with DJs, pizza next door, and a younger after-work crowd than the hotel rooftops. It is here because Brickell needs a casual late stop that still knows how to make a drink.", officialUrl: "https://www.dombrickell.com/", photo: images.doms, hours: { default: "Evening and late-night hours vary by day; verify the current calendar before going." }, price: "$$", priceSource: "Official menu / Google Maps", venueKind: "nightlife", nightlifeType: "lounge", musicGenres: ["dj"], attributeTags: ["brickell", "dj_sets", "late_night", "casual_nightlife", "group_friendly"], editorialUrls: ["https://www.timeout.com/miami/bars/doms-brickell", "https://miami.eater.com/maps/best-bars-miami"] }),
];

const cocktailStops = [
  stop({ id: "miami-cocktail-broken-shaker", name: "Broken Shaker", coordinates: [25.80335, -80.126614], description: "Broken Shaker is the Miami cocktail reference point: a Freehand courtyard, tropical ingredients, serious bar pedigree, and a poolside mood that still feels less stiff than many hotel bars. Go early if you want conversation; later it becomes a social scene with stronger drinks than the setting suggests.", officialUrl: "https://www.brokenshaker.com/", photo: images.brokenShaker, hours: daily("afternoon/evening through late-night service; verify current Miami hours before going."), price: "$$$", priceSource: "Official menu / Google Maps", venueKind: "nightlife", nightlifeType: "cocktail_bar", attributeTags: ["craft_cocktails", "scenic_nightlife", "patio", "beach", "reservation_recommended_nightlife"], editorialUrls: ["https://www.theworlds50best.com/bars/the-list/broken-shaker.html", "https://www.timeout.com/miami/bars/broken-shaker"] }),
  stop({ id: "miami-cocktail-sweet-liberty", name: "Sweet Liberty Drinks & Supply Co.", coordinates: [25.793537, -80.13241], description: "Sweet Liberty is the Miami Beach cocktail bar that can handle almost any use case: serious drinks, loud groups, oysters, dancing, and late-night confidence without becoming a velvet-rope parody. It belongs at the top of a cocktail guide because it is decorated, useful, and still fun.", officialUrl: "https://www.mysweetliberty.com/", photo: images.sweetLiberty, hours: daily("afternoon/evening through late-night service; verify same-day hours and kitchen times."), price: "$$$", priceSource: "Official menu / Google Maps", venueKind: "nightlife", nightlifeType: "cocktail_bar", musicGenres: ["dj"], attributeTags: ["craft_cocktails", "late_night", "lively_nightlife", "dance_floor", "beach"], editorialUrls: ["https://www.theworlds50best.com/bars/the-list/sweet-liberty.html", "https://miami.eater.com/maps/best-bars-miami"] }),
  stop({ id: "miami-cocktail-cafe-la-trova", name: "Cafe La Trova", coordinates: [25.765106, -80.211275], description: "Cafe La Trova is where the cocktail guide meets Little Havana properly: cantineros, rum drinks, croquetas, live music, and a room that can go from dinner to dancing without changing buildings. It is not a quiet speakeasy; it is Miami doing hospitality at full volume.", officialUrl: "https://cafelatrova.com/", photo: images.cafeLaTrova, hours: daily("lunch/dinner through late-night bar service; live music and back-room schedules vary."), price: "$$$", priceSource: "Official menu / Google Maps", venueKind: "nightlife", nightlifeType: "cocktail_bar", musicGenres: ["latin", "son", "salsa"], attributeTags: ["craft_cocktails", "live_music", "dance_floor", "little_havana", "lively_nightlife"], editorialUrls: ["https://www.theworlds50best.com/bars/the-list/cafe-la-trova.html", "https://www.timeout.com/miami/bars/cafe-la-trova"] }),
  stop({ id: "miami-cocktail-swizzle", name: "Swizzle Rum Bar & Drinkery", coordinates: [25.781777, -80.132585], description: "Swizzle is the rum-focused South Beach basement for drinkers who want craft without the courtyard glamour. The room is small and moodier than the beach around it, so it works best for a planned cocktail stop rather than a huge group drift-in.", officialUrl: "https://www.swizzlerumbarmiami.com/", photo: images.swizzle, hours: { default: "Evening and late-night hours vary by day; verify current schedule before going." }, price: "$$$", priceSource: "Official menu / Google Maps", venueKind: "nightlife", nightlifeType: "cocktail_bar", attributeTags: ["craft_cocktails", "speakeasy", "rum", "date_night", "south_beach"], editorialUrls: ["https://www.timeout.com/miami/bars/swizzle-rum-bar-drinkery", "https://www.theinfatuation.com/miami/reviews/swizzle-rum-bar-drinkery"] }),
  stop({ id: "miami-cocktail-viceversa", name: "ViceVersa", coordinates: [25.778391, -80.189039], description: "ViceVersa gives Downtown Miami an Italian aperitivo bar with serious cocktail credentials: negronis, martinis, raw bar plates, pizza, and a polished lobby setting at the Elser Hotel. Use it when the night needs a grown-up cocktail stop with food attached, not a loud club or hotel lounge default.", officialUrl: "https://viceversamia.com/", photo: images.viceVersa, hours: hours.viceVersa, price: "$$$", priceSource: "Official site / Eater Miami", venueKind: "nightlife", nightlifeType: "cocktail_bar", attributeTags: ["craft_cocktails", "aperitivo", "downtown", "food_bar", "date_night"], editorialUrls: ["https://viceversamia.com/", "https://miami.eater.com/2024/6/20/24182466/vice-versa-miami-now-open"] }),
  stop({ id: "miami-cocktail-kaiju", name: "Kaiju", coordinates: [25.771082, -80.192706], description: "Kaiju is the Downtown hidden-cocktail move for people who like a little weirdness with their drink: anime references, a small room, and cocktails that feel more personal than hotel-bar safe. It is best for small groups and nights already passing through Downtown.", officialUrl: "https://www.kaijumiami.com/", photo: images.kaiju, hours: { default: "Evening cocktail hours vary by day; verify current hours before going." }, price: "$$$", priceSource: "Official/menu listing / Google Maps", venueKind: "nightlife", nightlifeType: "cocktail_bar", attributeTags: ["craft_cocktails", "speakeasy", "downtown", "date_night", "small_group"], editorialUrls: ["https://www.timeout.com/miami/bars/kaiju", "https://miami.eater.com/maps/best-bars-miami"] }),
  stop({ id: "miami-cocktail-medium-cool", name: "Medium Cool", coordinates: [25.793624, -80.130555], description: "Medium Cool is the Miami Beach listening-room cocktail bar for people who want the night to feel curated but not club-sized. Expect vinyl, dim light, and a more intimate pace; it is the stop to use when Sweet Liberty or Broken Shaker would be too loud.", officialUrl: "https://www.mediumcoolmiami.com/", photo: images.mediumCool, hours: { default: "Evening and late-night hours vary by event and day; verify current schedule before going." }, price: "$$$", priceSource: "Official/menu listing / Google Maps", venueKind: "nightlife", nightlifeType: "cocktail_bar", musicGenres: ["vinyl", "dj"], attributeTags: ["craft_cocktails", "dj_sets", "date_night", "low_key_nightlife", "south_beach"], editorialUrls: ["https://www.timeout.com/miami/bars/medium-cool", "https://www.theinfatuation.com/miami/reviews/medium-cool"] }),
  stop({ id: "miami-cocktail-stormy-monday", name: "Stormy Monday", coordinates: [25.779376, -80.140827], description: "Stormy Monday brings the cocktail guide back to South Beach at a neighborhood scale: warm service, soulful music, serious drinks, and shareable small plates in the former Macchialina space on Alton Road. It is a better fit for an intimate bar night than another rooftop or hotel lounge.", officialUrl: "https://www.instagram.com/stormymondaymia/", photo: images.stormyMonday, hours: hours.stormyMonday, price: "$$", priceSource: "OpenTable / local listings", venueKind: "nightlife", nightlifeType: "cocktail_bar", musicGenres: ["soul", "live_music"], attributeTags: ["craft_cocktails", "live_music", "south_beach", "date_night", "low_key_nightlife"], editorialUrls: ["https://www.opentable.com/r/stormy-monday-bar-miami-beach", "https://www.theinfatuation.com/miami/reviews/stormy-monday"] }),
  stop({ id: "miami-cocktail-dantes", name: "Dante's HiFi", coordinates: [25.800907, -80.199371], description: "Dante's HiFi is Wynwood's vinyl listening bar, more about sound, mood, and a controlled room than a sprawling bar crawl. It is one of the better Miami stops when the plan needs music without a full club; check ticketed sessions and capacity before going.", officialUrl: "https://www.danteshifi.com/", photo: images.dantes, hours: { default: "Listening-room hours and ticketed sessions vary by night; verify the official calendar." }, price: "$$$", priceSource: "Official calendar / Google Maps", venueKind: "nightlife", nightlifeType: "cocktail_bar", musicGenres: ["vinyl", "dj"], attributeTags: ["dj_sets", "craft_cocktails", "reservation_recommended_nightlife", "wynwood", "date_night"], editorialUrls: ["https://www.timeout.com/miami/bars/dantes-hifi", "https://miami.eater.com/maps/best-bars-miami"] }),
  stop({ id: "miami-cocktail-champagne-bar", name: "The Champagne Bar at The Surf Club", coordinates: [25.878197, -80.121615], description: "The Champagne Bar is Miami glamour in a narrow, expensive, beautifully controlled dose: terrazzo, old Surf Club history, and cocktails that belong before or after a serious dinner. It is not casual, and that is the point; dress and budget accordingly.", officialUrl: "https://www.fourseasons.com/surfside/dining/lounges/the_champagne_bar/", photo: images.champagneBar, hours: { default: "Bar hours vary by day and hotel schedule; verify the Four Seasons dining page before going." }, price: "$$$$", priceSource: "Official menu / Google Maps", venueKind: "nightlife", nightlifeType: "cocktail_bar", attributeTags: ["luxury", "romantic_nightlife", "craft_cocktails", "dressy", "historic"], editorialUrls: ["https://www.timeout.com/miami/bars/champagne-bar", "https://www.forbestravelguide.com/restaurants/miami-florida/the-champagne-bar"] }),
  stop({ id: "miami-cocktail-sugar", name: "Sugar", coordinates: [25.767478, -80.193598], description: "Sugar is the Brickell rooftop that earns its slot because the view actually changes the night: skyline, height, and a garden-like room above the mall-and-office grid. It is popular and dress-code aware, so use it for one scenic drink, not an effortless casual hang.", officialUrl: "https://www.sugar-miami.com/", photo: images.sugar, hours: { default: "Evening rooftop hours vary by day, weather, and private events; verify before going." }, price: "$$$", priceSource: "Official menu / Google Maps", venueKind: "nightlife", nightlifeType: "rooftop_bar", attributeTags: ["scenic_nightlife", "rooftop", "dressy", "brickell", "reservation_recommended_nightlife"], editorialUrls: ["https://www.timeout.com/miami/bars/sugar", "https://miami.eater.com/maps/best-rooftop-bars-miami"] }),
];

const cultureStops = [
  stop({ id: "miami-culture-art-deco", name: "Art Deco Historic District", coordinates: [25.780955, -80.131637], description: "The Art Deco Historic District is the culture stop that explains why South Beach looks like South Beach: pastel facades, nautical lines, neon, and a preservation story hiding under the party surface. Go early or golden hour, then use the museum or a walking tour to keep it from becoming only a photo walk.", officialUrl: "https://mdpl.org/", photo: images.artDeco, hours: daily("district access; museum and guided-tour hours vary by day, so verify the Miami Design Preservation League schedule."), venueKind: "culture", subcategory: "historic_district", attributeTags: ["architecture", "walking", "historic", "south_beach", "free_entry"], editorialUrls: ["https://www.miamiandbeaches.com/things-to-do/history-and-heritage/art-deco-historic-district", "https://www.timeout.com/miami/things-to-do/art-deco-historic-district"] }),
  stop({ id: "miami-culture-pamm", name: "Perez Art Museum Miami", coordinates: [25.786034, -80.186193], description: "PAMM gives Miami a bayfront contemporary-art anchor with hanging gardens, shaded terraces, and a building that makes the waterfront part of the visit. It is best paired with Frost Science or Bayfront walking; check exhibition hours and free-day crowds before building the afternoon.", officialUrl: "https://www.pamm.org/", photo: images.pamm, hours: { default: "Museum hours vary by weekday, weekend, and events; verify the official hours page before visiting." }, venueKind: "culture", subcategory: "museum", attributeTags: ["museum", "art", "bayfront", "indoor", "family_friendly"], editorialUrls: ["https://www.miamiandbeaches.com/l/arts-and-culture/perez-art-museum-miami-pamm/3170", "https://www.timeout.com/miami/museums/perez-art-museum-miami"] }),
  stop({ id: "miami-culture-frost", name: "Phillip and Patricia Frost Museum of Science", coordinates: [25.785986, -80.187785], description: "Frost Science is the family-friendly culture stop with a planetarium, aquarium, and enough indoor time to rescue a humid or stormy afternoon. It belongs next to PAMM because the two together make Museum Park more than a quick waterfront pass.", officialUrl: "https://www.frostscience.org/", photo: images.frost, hours: daily("museum hours; planetarium shows, holidays, and special events should be checked before booking."), venueKind: "culture", subcategory: "science_museum", attributeTags: ["museum", "family_friendly", "indoor", "downtown", "tickets_required"], editorialUrls: ["https://www.miamiandbeaches.com/l/arts-and-culture/phillip-and-patricia-frost-museum-of-science/3298", "https://www.timeout.com/miami/museums/frost-science"] }),
  stop({ id: "miami-culture-vizcaya", name: "Vizcaya Museum and Gardens", coordinates: [25.744452, -80.210166], description: "Vizcaya is Miami's most transportive historic house: bayfront gardens, Mediterranean Revival fantasy, coral-stone texture, and a Gilded Age story that feels strange in the subtropics. Go when you can walk the grounds slowly, and avoid treating it as only an interior museum.", officialUrl: "https://vizcaya.org/", photo: images.vizcaya, hours: { default: "Museum and garden hours vary by day, with closures and ticketing windows posted officially; verify before visiting." }, venueKind: "culture", subcategory: "historic_house", attributeTags: ["museum", "gardens", "historic", "scenic", "tickets_required"], editorialUrls: ["https://www.miamiandbeaches.com/l/arts-and-culture/vizcaya-museum-and-gardens/1432", "https://www.timeout.com/miami/museums/vizcaya-museum-gardens"] }),
  stop({ id: "miami-culture-wynwood-walls", name: "Wynwood Walls", coordinates: [25.801077, -80.199206], description: "Wynwood Walls is touristy because it works: a concentrated, ticketed street-art park that gives structure to a neighborhood whose murals now spread far beyond it. Use it as a primer, then walk selectively; the mistake is letting the gift-shop version stand in for all of Wynwood.", officialUrl: "https://thewynwoodwalls.com/", photo: images.wynwoodWalls, hours: daily("ticketed daytime/evening hours; special event closures should be checked before visiting."), venueKind: "culture", subcategory: "street_art", attributeTags: ["street_art", "tickets_required", "wynwood", "walking", "family_friendly"], editorialUrls: ["https://www.miamiandbeaches.com/l/arts-and-culture/wynwood-walls/2515", "https://www.timeout.com/miami/things-to-do/wynwood-walls"] }),
  stop({ id: "miami-culture-rubell", name: "Rubell Museum", coordinates: [25.802803, -80.204331], description: "Rubell Museum gives Miami a serious private-collection stop in Allapattah, with large-scale contemporary work and a calmer alternative to the Wynwood churn. It is best for travelers who actually want gallery time, not just murals; check hours because it is not a late-day afterthought.", officialUrl: "https://rubellmuseum.org/miami", photo: images.rubell, hours: { default: "Museum hours and closed days vary seasonally; verify the official Miami hours page before visiting." }, venueKind: "culture", subcategory: "museum", attributeTags: ["museum", "contemporary_art", "indoor", "allapattah", "tickets_required"], editorialUrls: ["https://www.miamiandbeaches.com/l/arts-and-culture/rubell-museum/43463", "https://www.timeout.com/miami/museums/rubell-museum"] }),
  stop({ id: "miami-culture-ica", name: "Institute of Contemporary Art, Miami", coordinates: [25.814371, -80.194068], description: "ICA Miami is the Design District culture stop that keeps the neighborhood from being only shopping: free admission, contemporary exhibitions, and a sculpture garden that rewards a slower pass. Pair it with lunch nearby, but check timed-entry policies and exhibition changes before going.", officialUrl: "https://icamiami.org/", photo: images.ica, hours: { default: "Gallery hours vary by day, with timed-entry and closure notes posted officially; verify before visiting." }, venueKind: "culture", subcategory: "museum", attributeTags: ["museum", "contemporary_art", "free_entry", "design_district", "indoor"], editorialUrls: ["https://www.miamiandbeaches.com/l/arts-and-culture/institute-of-contemporary-art-miami/4344", "https://www.timeout.com/miami/museums/institute-of-contemporary-art-miami"] }),
  stop({ id: "miami-culture-historymiami", name: "HistoryMiami Museum", coordinates: [25.774438, -80.196018], description: "HistoryMiami is the downtown context stop, useful when the city feels like only beaches, clubs, and real estate. The museum's exhibitions make room for immigration, neighborhoods, disasters, civic history, and Miami's weird growth; pair it with a government-center or river route.", officialUrl: "https://historymiami.org/", photo: images.historyMiami, hours: { default: "Museum hours vary by day and exhibitions; verify the official visit page before going." }, venueKind: "culture", subcategory: "history_museum", attributeTags: ["museum", "history", "downtown", "indoor", "family_friendly"], editorialUrls: ["https://www.miamiandbeaches.com/l/arts-and-culture/historymiami-museum/2168", "https://www.timeout.com/miami/museums/historymiami"] }),
  stop({ id: "miami-culture-calle-ocho", name: "Calle Ocho / Little Havana", coordinates: [25.765339, -80.219988], description: "Calle Ocho is culture when you treat it as more than a souvenir strip: ventanitas, domino tables, cigar shops, murals, music, and the Cuban-American public square of Miami. Walk it with food stops and patience, but do not pretend one block explains every Latin community in the city.", officialUrl: "https://www.miamiandbeaches.com/neighborhoods/little-havana", photo: images.calleOcho, hours: daily("neighborhood access; individual shops, bars, and cultural venues keep separate hours."), venueKind: "culture", subcategory: "neighborhood", attributeTags: ["walking", "little_havana", "food", "music", "free_entry"], editorialUrls: ["https://www.miamiandbeaches.com/neighborhoods/little-havana", "https://www.timeout.com/miami/things-to-do/little-havana"] }),
  stop({ id: "miami-culture-arsht", name: "Adrienne Arsht Center", coordinates: [25.787685, -80.189479], description: "The Arsht Center is the performance anchor that keeps Miami culture from being only museums and murals: touring Broadway, classical music, dance, jazz, and local programming in one downtown campus. Check the calendar first; the building matters, but the right show is the reason to go.", officialUrl: "https://www.arshtcenter.org/", photo: images.arsht, hours: { default: "Performance, box office, and lobby hours vary by event; verify the official calendar before planning." }, venueKind: "event_venue", subcategory: "performing_arts", attributeTags: ["performing_arts", "theatre_show", "music", "downtown", "tickets_required"], editorialUrls: ["https://www.miamiandbeaches.com/l/arts-and-culture/adrienne-arsht-center-for-the-performing-arts/1994", "https://www.timeout.com/miami/theater/adrienne-arsht-center"] }),
];

const activityStops = [
  stop({ id: "miami-activity-south-beach", name: "South Beach", coordinates: [25.782612, -80.134077], description: "South Beach is obvious and still necessary: sand, swimmers, Art Deco hotels behind you, and the city performing itself at full volume. Go early for the beach to feel beautiful rather than crowded, then choose whether the day becomes Ocean Drive, Lincoln Road, or a quieter hotel lunch.", officialUrl: "https://www.miamiandbeaches.com/neighborhoods/south-beach", photo: images.southBeach, hours: daily("public beach access, with lifeguard and facility hours varying by area; check beach conditions before swimming."), venueKind: "outdoors", subcategory: "beach", attributeTags: ["beach", "free_entry", "family_friendly", "south_beach", "walking"], editorialUrls: ["https://www.miamiandbeaches.com/neighborhoods/south-beach", "https://www.timeout.com/miami/things-to-do/south-beach"] }),
  stop({ id: "miami-activity-ocean-drive", name: "Ocean Drive and Lummus Park", coordinates: [25.780174, -80.130098], description: "Ocean Drive works best when you stop expecting subtlety: neon, Art Deco facades, beach paths, muscle cars, tourist menus, and a promenade that explains a big piece of Miami's image. Walk it for architecture and people-watching, then be selective about where you spend money.", officialUrl: "https://www.miamiandbeaches.com/things-to-do/history-and-heritage/art-deco-historic-district", photo: images.oceanDrive, hours: daily("public street and park access; restaurant, bar, and event hours vary."), venueKind: "landmark", subcategory: "walk", attributeTags: ["walking", "architecture", "south_beach", "free_entry", "tourist_friendly"], editorialUrls: ["https://www.timeout.com/miami/things-to-do/ocean-drive", "https://www.miamiandbeaches.com/neighborhoods/south-beach"] }),
  stop({ id: "miami-activity-little-havana", name: "Little Havana", coordinates: [25.765339, -80.219988], description: "Little Havana belongs in top things because food, music, politics, cigar shops, dominoes, and Cuban coffee make Miami legible in a way the beach cannot. Go in daylight into early evening, pair a walk with one or two food stops, and avoid reducing the neighborhood to a single selfie.", officialUrl: "https://www.miamiandbeaches.com/neighborhoods/little-havana", photo: images.calleOcho, hours: daily("neighborhood access, with individual restaurants, shops, and music venues keeping separate schedules."), venueKind: "culture", subcategory: "neighborhood_walk", attributeTags: ["walking", "little_havana", "food", "music", "free_entry"], editorialUrls: ["https://www.timeout.com/miami/things-to-do/little-havana", "https://www.miamiandbeaches.com/neighborhoods/little-havana"] }),
  stop({ id: "miami-activity-wynwood", name: "Wynwood Walls", coordinates: [25.801077, -80.199206], description: "Wynwood Walls is the structured version of the art-district walk, giving first-timers a clear starting point before the neighborhood gets messy with breweries, galleries, and traffic. It is strongest when paired with a wider mural walk and a meal, not treated as the whole neighborhood.", officialUrl: "https://thewynwoodwalls.com/", photo: images.wynwoodWalls, hours: daily("ticketed daytime/evening hours; special event closures should be checked before visiting."), venueKind: "culture", subcategory: "street_art", attributeTags: ["street_art", "walking", "tickets_required", "wynwood", "family_friendly"], editorialUrls: ["https://www.miamiandbeaches.com/l/arts-and-culture/wynwood-walls/2515", "https://www.timeout.com/miami/things-to-do/wynwood-walls"] }),
  stop({ id: "miami-activity-vizcaya", name: "Vizcaya Museum and Gardens", coordinates: [25.744452, -80.210166], description: "Vizcaya earns a top-things slot because it gives Miami texture beyond beach and nightlife: gardens, bayfront stonework, historic rooms, and a strange subtropical-European fantasy. Give it real time and water, especially in heat; the gardens are the memory, not just the house.", officialUrl: "https://vizcaya.org/", photo: images.vizcaya, hours: { default: "Museum and garden hours vary by day, with ticketing windows posted officially; verify before visiting." }, venueKind: "culture", subcategory: "historic_house", attributeTags: ["gardens", "museum", "historic", "tickets_required", "scenic"], editorialUrls: ["https://www.miamiandbeaches.com/l/arts-and-culture/vizcaya-museum-and-gardens/1432", "https://www.timeout.com/miami/museums/vizcaya-museum-gardens"] }),
  stop({ id: "miami-activity-design-district", name: "Miami Design District", coordinates: [25.814771, -80.193659], description: "The Design District is luxury retail, public art, architecture, and dining compressed into a walkable pocket that feels very different from the beach. Use it for ICA, window-shopping, lunch, and shade breaks; it is best when you accept the polished mood rather than hunt for grit.", officialUrl: "https://www.miamidesigndistrict.com/", photo: images.designDistrict, hours: daily("district access; store, gallery, restaurant, and museum hours vary by venue."), venueKind: "retail", subcategory: "district", attributeTags: ["design", "shopping", "architecture", "walking", "food"], editorialUrls: ["https://www.miamiandbeaches.com/neighborhoods/design-district", "https://www.timeout.com/miami/things-to-do/design-district"] }),
  stop({ id: "miami-activity-fairchild", name: "Fairchild Tropical Botanic Garden", coordinates: [25.67798, -80.274203], description: "Fairchild is the heat-aware nature stop for palms, tropical fruit, orchids, water features, and a slower Miami that does not revolve around sand. It is south of the core, so plan transport and go earlier in the day when the garden feels generous rather than punishing.", officialUrl: "https://fairchildgarden.org/", photo: images.fairchild, hours: daily("garden daytime hours; ticketed events and weather closures should be checked before visiting."), venueKind: "outdoors", subcategory: "botanic_garden", attributeTags: ["nature", "gardens", "family_friendly", "tickets_required", "quiet"], editorialUrls: ["https://www.miamiandbeaches.com/l/things-to-do/fairchild-tropical-botanic-garden/1126", "https://www.timeout.com/miami/things-to-do/fairchild-tropical-botanic-garden"] }),
  stop({ id: "miami-activity-venetian-pool", name: "Venetian Pool", coordinates: [25.746339, -80.271975], description: "Venetian Pool is a Coral Gables oddity worth planning around: a historic spring-fed public pool carved from a coral-rock quarry, with grottos and Mediterranean Revival details. It is seasonal and capacity-sensitive, so check hours, tickets, and closures before treating it like a normal pool day.", officialUrl: "https://www.coralgables.com/venetianpool", photo: images.venetianPool, hours: { default: "Seasonal public swim hours vary by date, weather, and maintenance; verify official hours before going." }, venueKind: "outdoors", subcategory: "historic_pool", attributeTags: ["swimming", "historic", "family_friendly", "tickets_required", "coral_gables"], editorialUrls: ["https://www.miamiandbeaches.com/l/things-to-do/venetian-pool/1794", "https://www.timeout.com/miami/things-to-do/venetian-pool"] }),
  stop({ id: "miami-activity-cape-florida", name: "Bill Baggs Cape Florida State Park", coordinates: [25.676427, -80.156874], description: "Bill Baggs gives Miami a Key Biscayne escape with beach, bike paths, mangroves, and the Cape Florida lighthouse at the edge of the island. It is best when you can drive or bike deliberately, bring shade discipline, and make the park the day rather than a rushed detour.", officialUrl: "https://www.floridastateparks.org/parks-and-trails/bill-baggs-cape-florida-state-park", photo: images.capeFlorida, hours: daily("state park hours, generally morning to sunset; lighthouse tours and weather advisories vary."), venueKind: "outdoors", subcategory: "state_park", attributeTags: ["beach", "nature", "family_friendly", "scenic", "tickets_required"], editorialUrls: ["https://www.miamiandbeaches.com/l/things-to-do/bill-baggs-cape-florida-state-park/1477", "https://www.timeout.com/miami/things-to-do/bill-baggs-cape-florida-state-park"] }),
  stop({ id: "miami-activity-everglades", name: "Everglades National Park", coordinates: [25.286616, -80.898651], description: "Everglades National Park is the outside-the-city activity that changes the whole Miami trip: sawgrass, birds, alligators, heat, mosquitoes, and a landscape that refuses beach-city assumptions. Go with a real day plan, check weather and visitor-center hours, and avoid squeezing it between nightlife recovery and dinner.", officialUrl: "https://www.nps.gov/ever/index.htm", photo: images.everglades, hours: { default: "Park areas, visitor centers, tours, and roads keep different seasonal schedules; verify the National Park Service page before going." }, venueKind: "outdoors", subcategory: "national_park", attributeTags: ["nature", "wildlife", "day_trip", "family_friendly", "tickets_required"], editorialUrls: ["https://www.miamiandbeaches.com/things-to-do/nature-and-outdoors/everglades-national-park", "https://www.nps.gov/ever/planyourvisit/hours.htm"] }),
];

const editorial = {
  restaurants: [
    source("Top organic result: Eater Miami - 38 Best Restaurants in Miami", "https://miami.eater.com/maps/miami-best-restaurants-38"),
    source("MICHELIN Guide - Miami restaurants", "https://guide.michelin.com/us/en/florida/miami/restaurants"),
    source("The Infatuation - Miami restaurants", "https://www.theinfatuation.com/miami"),
    source("Time Out - Best restaurants in Miami", "https://www.timeout.com/miami/restaurants/best-restaurants-in-miami"),
    source("Miami and Beaches - Eat and Drink", "https://www.miamiandbeaches.com/things-to-do/eat-and-drink"),
  ],
  cheapEats: [
    source("Top organic result: Eater Miami - Best Cheap Eats", "https://miami.eater.com/maps/best-cheap-eats-miami"),
    source("Time Out - Cheap eats in Miami", "https://www.timeout.com/miami/restaurants/best-cheap-eats-in-miami"),
    source("The Infatuation - Miami casual restaurants", "https://www.theinfatuation.com/miami"),
    source("Miami and Beaches - Little Havana restaurants", "https://www.miamiandbeaches.com/neighborhoods/little-havana"),
    source("Eater Miami - Best Cuban restaurants", "https://miami.eater.com/maps/best-cuban-restaurants-miami"),
  ],
  hotels: [
    source("Top organic result: Conde Nast Traveler - Best hotels in Miami", "https://www.cntraveler.com/gallery/best-hotels-in-miami"),
    source("Travel + Leisure - Miami hotels", "https://www.travelandleisure.com/hotels-resorts"),
    source("Forbes Travel Guide - Miami hotels", "https://www.forbestravelguide.com/destinations/miami-florida/travel-guide"),
    source("Miami and Beaches - Hotels", "https://www.miamiandbeaches.com/places-to-stay/hotels"),
    source("Google Travel - Miami hotels", "https://www.google.com/travel/hotels/Miami"),
  ],
  hostels: [
    source("Top organic result: Hostelworld - Miami hostels", "https://www.hostelworld.com/hostels/north-america/usa/miami/"),
    source("Booking.com - Miami Beach hostels", "https://www.booking.com/hostels/city/us/miami-beach.html"),
    source("Hostelz - Miami hostels", "https://www.hostelz.com/hostels/USA/Florida/Miami"),
    source("Google Travel - Miami hostels", "https://www.google.com/travel/hotels/Miami?q=hostels%20miami"),
    source("Miami and Beaches - Places to stay", "https://www.miamiandbeaches.com/places-to-stay"),
  ],
  casualBars: [
    source("Top organic result: Eater Miami - Best bars", "https://miami.eater.com/maps/best-bars-miami"),
    source("Time Out - Best bars in Miami", "https://www.timeout.com/miami/bars/best-bars-in-miami"),
    source("Miami New Times - Best bars", "https://www.miaminewtimes.com/best-of"),
    source("Miami and Beaches - Nightlife", "https://www.miamiandbeaches.com/things-to-do/nightlife"),
    source("The Infatuation - Miami bars", "https://www.theinfatuation.com/miami/guides/best-bars-miami"),
  ],
  cocktails: [
    source("Top organic result: Time Out - Cocktail bars Miami", "https://www.timeout.com/miami/bars/best-cocktail-bars-in-miami"),
    source("World's 50 Best Bars - North America", "https://www.theworlds50best.com/bars/northamerica/list/1-50"),
    source("Eater Miami - Best bars", "https://miami.eater.com/maps/best-bars-miami"),
    source("BarsForKings - Miami cocktail bars", "https://www.barsforkings.com/miami/cocktail-bars/"),
    source("Miami Herald - Miami bars coverage", "https://www.miamiherald.com/miami-com/nightlife/"),
  ],
  culture: [
    source("Top organic result: Miami and Beaches - Arts and Culture", "https://www.miamiandbeaches.com/things-to-do/arts-and-culture"),
    source("Time Out - Best museums in Miami", "https://www.timeout.com/miami/museums/best-museums-in-miami"),
    source("Miami Design Preservation League", "https://mdpl.org/"),
    source("Greater Miami Convention and Visitors Bureau", "https://www.miamiandbeaches.com/"),
    source("Art Basel Miami Beach visitor context", "https://www.artbasel.com/miami-beach"),
  ],
  activities: [
    source("Top organic result: Time Out - Best things to do in Miami", "https://www.timeout.com/miami/things-to-do/best-things-to-do-in-miami"),
    source("Miami and Beaches - Things to do", "https://www.miamiandbeaches.com/things-to-do"),
    source("Lonely Planet - Best things to do in Miami", "https://www.lonelyplanet.com/articles/top-things-to-do-in-miami"),
    source("National Park Service - Everglades", "https://www.nps.gov/ever/index.htm"),
    source("Florida State Parks - Bill Baggs Cape Florida", "https://www.floridastateparks.org/parks-and-trails/bill-baggs-cape-florida-state-park"),
  ],
};

const sources = {
  dining: [...editorial.restaurants, ...diningStops.slice(0, 5).map((item) => source(`${item.name} official`, item.officialUrl ?? maps(item.name)))],
  cheapEats: [...editorial.cheapEats, ...cheapEatStops.slice(0, 5).map((item) => source(`${item.name} official`, item.officialUrl ?? maps(item.name)))],
  hotels: [...editorial.hotels, ...hotelStops.slice(0, 5).map((item) => source(`${item.name} official`, item.officialUrl ?? maps(item.name)))],
  hostels: [...editorial.hostels, ...hostelStops.map((item) => source(`${item.name} official`, item.officialUrl ?? maps(item.name)))],
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
    url: maps(`${title} Miami`),
    category,
    location: miamiLocation,
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

export const miamiCitywideGuides: MapList[] = [
  guide("Food", "list-miami-best-restaurants", "miami-best-restaurants", "best-restaurants", "The Miami Foodie Experience", "A citywide Miami dining guide that keeps the beach, Little Havana, Design District, riverfront seafood, and chef-driven rooms in the same conversation without pretending they serve the same trip mood.", diningStops, sources.dining, "Best Restaurants in Miami for Cuban Food, Seafood, and Chef Tables", "Source-backed Miami restaurant guide with stone crab, Cuban classics, seafood, tasting menus, bakeries, and neighborhood dining."),
  guide("Food", "list-miami-cheap-eats", "miami-best-cheap-eats", "best-cheap-eats", "Quick Bites & Latin Street Food", "A practical Miami guide for Cuban counters, sandwich windows, arepas, tacos, burgers, and casual group meals that solve a hot city day without a formal reservation.", cheapEatStops, sources.cheapEats, "Best Cheap Eats in Miami for Cuban Sandwiches, Arepas, Tacos, and Fast Meals", "Budget and medium-price Miami food stops with official evidence, map status, and practical route notes."),
  guide("Stay", "list-miami-hotels", "miami-best-hotels", "best-hotels", "The Hotel Shortlist", "A hotel-only Miami stay guide for choosing between South Beach luxury, Mid-Beach theater, Brickell logistics, Coconut Grove calm, and Little Havana neighborhood access.", hotelStops, sources.hotels, "Best Hotels in Miami for Beach, Brickell, Coconut Grove, and Little Havana Bases", "Hotel-only Miami guide with official booking evidence and base strategy for beach, nightlife, business, wellness, and neighborhood stays."),
  guide("Stay", "list-miami-hostels", "miami-best-hostels", "best-hostels", "Hostels & Affordable Stays", "A Miami budget-stay guide built around the current hostel market: South Beach dorms, private rooms, social properties, and affordable hotels where travelers should verify room type before booking.", hostelStops, sources.hostels, "Best Hostels in Miami for Dorms, Private Rooms, and Budget Social Stays", "Hostel-only Miami guide with dorm/private-room evidence, booking links, and current caveats around hybrid budget stays."),
  guide("Nightlife", "list-miami-dive-bars-casual-bars", "miami-best-dive-bars-casual-bars", "best-dive-bars", "Dives & Late-Night Live Music", "A casual Miami nightlife guide for people who want old bars, live music, patios, beer, DJs, and late rooms without defaulting to clubs, hotel lounges, or bottle-service choreography.", casualBarStops, sources.casualBars, "Best Dive Bars and Casual Bars in Miami", "Miami dive and casual bar guide with South Beach institutions, Wynwood patios, Little Havana music, Downtown late rooms, and local pub energy."),
  guide("Nightlife", "list-miami-cocktail-bars", "miami-best-cocktail-bars", "best-cocktail-bars", "Elevated Drinks & Listening Bars", "A cocktail-only Miami guide that separates award rooms, rum bars, Little Havana cantinero energy, listening bars, rooftops, and expensive hotel glamour so drinks match the night's actual plan.", cocktailStops, sources.cocktails, "Best Cocktail Bars in Miami for Rum, Rooftops, Listening Rooms, and Beach Drinks", "Source-backed Miami cocktail guide with Broken Shaker, Sweet Liberty, Cafe La Trova, Swizzle, ViceVersa, Stormy Monday, rooftops, and hotel glamour."),
  guide("Culture", "list-miami-culture", "miami-best-culture", "best-culture", "Design, Art & Heritage", "A citywide Miami culture guide that keeps Art Deco, contemporary art, Little Havana, performance, gardens, and bayfront museums together instead of reducing the city to murals and beaches.", cultureStops, sources.culture, "Best Culture in Miami for Museums, Art Deco, Little Havana, and Performance", "Miami culture guide with official evidence for Art Deco, museums, Little Havana, Wynwood, Design District, Vizcaya, and performance venues."),
  guide("Activities", "list-miami-top-things-to-do", "miami-best-things-to-do", "best-things-to-do", "Ten Stops That Make a Miami Trip Work", "A top-things Miami guide built around heat, water, neighborhoods, culture, and realistic movement: beach time, Art Deco, Little Havana, Wynwood, gardens, Key Biscayne, and the Everglades all have different timing demands.", activityStops, sources.activities, "Top Things to Do in Miami With 10 Strong Stops", "Ten source-backed Miami things to do, from South Beach and Little Havana to Vizcaya, Wynwood, Fairchild, Key Biscayne, and the Everglades."),
];
