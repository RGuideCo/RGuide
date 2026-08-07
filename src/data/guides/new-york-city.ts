import type { GuideStop, ListCategory, ListSource, MapList } from "@/types";
import { buildNatureGuide } from "@/data/guides/nature-guide-builder";

const createdAt = "2026-06-02T00:00:00.000Z";
const checkedAt = "2026-07-19";

const nycLocation = {
  city: "New York City",
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

const images = {
  katz: "https://d2zyb4ugwufqpc.cloudfront.net/media/wysiwyg/home-banner-main.jpg",
  russ: "https://images.squarespace-cdn.com/content/v1/54b5af9ce4b0ad6fb5d06c8a/1438709811513-CKFCBG2A2RUPS3MHDNTZ/R%26D+cafe+table+with+food.jpg?format=2500w",
  keens: "https://www.keens.com/img/galleryimg/mainbar.jpg",
  balthazar: commons("Balthazar on Spring Street.jpg"),
  sylvias: "https://static.spotapps.co/spots/25/213c0658a248629a68fb93a0c30353/full",
  nomWah: commons("Nom Wah Tea Parlor, Chinatown, Manhattan.jpg"),
  oysterBar: "https://www.oysterbarny.com/wp-content/uploads/2020/09/cocktail4.jpg",
  tavernGreen: "https://images.getbento.com/accounts/f00864b7095e96646695fc3d0533341a/media/images/82046Garlic_Shrimp.jpg?w=1200&fit=crop&auto=compress,format&cs=origin&crop=focalpoint&fp-x=0.5&fp-y=0.5",
  veselka: "https://veselka.com/cdn/shop/products/CopyofStudioSession-153copy.jpg?v=1736740003&width=3840",
  lombardis: "https://www.firstpizza.com/assets/PXL-20260316-173528596-2-large.jpeg",
  graysPapaya: "https://i0.wp.com/grayspapaya.nyc/wp-content/uploads/2018/05/Grays-Papaya-NYC-Hot-Dogs.jpg?w=599&ssl=1",
  joesPizza: "https://images.squarespace-cdn.com/content/v1/5fb3405312797c6fcd738f7a/538d1af1-55a1-4f48-8bc7-7b38c3509503/Joes_Pizza_NYC_039.jpg?format=2500w",
  mamouns: "https://images.getbento.com/accounts/0e58cf8ea89fa9cc4ccdf16360d9f235/media/images/53624Bleecker2.png?w=1200&fit=max&auto=compress,format&cs=origin",
  xian: "https://cdn.prod.website-files.com/64e57dd33e949526478688ea/64e91187859a49761cd8569f_shop_book-edit.webp",
  vanessas: "https://static.wixstatic.com/media/27eac3_14ff820a082f4c24bb99a4ee8ba96543~mv2.png/v1/fill/w_1824,h_978,al_c,q_90,enc_avif,quality_auto/27eac3_14ff820a082f4c24bb99a4ee8ba96543~mv2.png",
  losTacos: "https://www.lostacos1.com/wp-content/uploads/2020/09/los-tacos-no1-adobada.jpg",
  absoluteBagels: commons("Absolute Bagels, Broadway, New York City.jpg"),
  tompkinsSquareBagels: "https://images.getbento.com/accounts/9b1eaed7048b093ab52b15286e6794f4/media/images/93085tsb.png?w=1200&fit=fill&auto=compress,format&cs=origin&h=600&bg=EDEDF1&pad=100",
  punjabiDeli: commons("Punjabi Deli, New York City.jpg"),
  hhBagels: commons("H&H Bagel.JPG"),
  taim: "https://taimkitchen.com/cdn/shop/files/website_800x.jpg?v=1654220561",
  plaza: commons("The Plaza Hotel from Central Park.jpg"),
  chelseaHotel: "https://hotelchelsea.com/uploads/images/2564_HotelChelsea_4C_22%20-%20Copy(1).jpg",
  beekman: "https://assets.hyatt.com/content/dam/hyatt/hyattdam/images/2022/08/01/1542/LGATH-P0142-Superior-King-Guest-Room-Bed.jpg/LGATH-P0142-Superior-King-Guest-Room-Bed.16x9.jpg?imwidth=1920",
  boweryHotel: commons("Bowery Hotel full.jpg"),
  standardHighLine: "https://duvx7h32ggrur.cloudfront.net/attachments/d1da33cc9b320659d1b2e9d150b38b2e3f212933/store/fill/1200/630/471fbd7143127fd59a563d862a5d2aaff7d96843610c7afc4823f24f32cf/standard-hotel9838-3-.jpg",
  carlyle: commons("Carlyle Hotel Madison Avenue New York.jpg"),
  ludlow: "https://www.ludlowhotel.com/full/1932_theludlow_lounge_040-1.jpg",
  ace: "https://acehotel.com/new-york/wp-content/uploads/sites/9/2021/08/ace-hotel-new-york-medium-474x646.jpg",
  twa: commons("TWA Flight Center, JFK Airport.jpg"),
  marlton: commons("The Marlton Hotel Greenwich Village.jpg"),
  hiNyc: commons("Hostelling International New York (9764457726).jpg"),
  localNyc: "https://thelocalny.com/wp-content/uploads/2014/02/0081.jpg",
  q4: "https://www.q4hotelny.com/wp-content/uploads/q4-hotel-common-areas-0122.jpg",
  nyMoore: "https://www.nymoorehostel.com/wp-content/uploads/2023/07/NYMH-HOSTE-Apr-7-1-of-1-1.jpg",
  westSideYmca: "https://tbb-prod-emea.imgix.net/attachments/room_type_photos/images/1228383/1228383/DSC00200_small.jpg?auto=format,compress&fit=crop&crop=entropy&w=1680&q=75",
  chelseaInternational: "https://static.wixstatic.com/media/428e88_877b813f2f68490ea93357cc5d7ab19e.jpg/v1/fill/w_1988,h_1325,al_c,q_90,usm_0.66_1.00_0.01,enc_auto/428e88_877b813f2f68490ea93357cc5d7ab19e.jpg",
  napYork: "https://cdn.shopify.com/s/files/1/0960/2764/0086/files/SFO_common_area.jpg?v=1776807093",
  americanDream: "https://images.squarespace-cdn.com/content/v1/53f645f1e4b00109d8c74f4e/1776894676554-GUAY9EC6RB8UB17JGFCH/American+dream+hostel+computer+room.jpg",
  kamaCentralPark: "https://lirp.cdn-website.com/e436dda7/dms3rep/multi/opt/KAMA_Hostel_NewYork9-1920w.jpg",
  eastHarlemHostel: "https://a.hwstatic.com/image/upload/f_auto,q_auto,w_1024,c_limit,e_sharpen,e_improve,e_vibrance:60/propertyimages/3/323639/hzbomxdeejsmq6blj6m9.jpg",
  mcsorleys: "https://mcsorleysoldalehouse.nyc/wp-content/uploads/2023/12/bar-looking-door_BRT5377-1140x761.webp",
  whiteHorse: "https://popmenucloud.com/cdn-cgi/image/width%3D1536%2Cheight%3D1536%2Cfit%3Dscale-down%2Cformat%3Dauto%2Cquality%3D60/kholdwtm/27e44b42-8dc4-41ad-9e25-76ee8f5ffb3a.jpg",
  earInn: "https://images.squarespace-cdn.com/content/v1/56b9615fb6aa60109e0601ee/1463525442550-1FXLAUCOTG0RK7CXM4SV/BF3A2840.jpg?format=2500w",
  petesTavern: "https://static.wixstatic.com/media/a6913a_1d7512182ba843bf8662c19f005ba2a1~mv2.jpg/v1/fill/w_482,h_482,q_90,enc_avif,quality_auto/a6913a_1d7512182ba843bf8662c19f005ba2a1~mv2.jpg",
  julius: commons("Julius' Bar, Greenwich Village.jpg"),
  stonewall: "https://images.squarespace-cdn.com/content/v1/569e93263b0be3cdaf4ce48d/1483654459886-GONZ0E99FFA8ADHJXLRM/sw+original_03+full+size.png?format=2500w",
  sunnys: "https://images.getbento.com/accounts/3c990d71fb6550eb15bbf0d8c635d5e4/media/images/36207facade-truck.jpg?w=1200&fit=max&auto=compress,format&cs=origin",
  fraunces: "https://static.spotapps.co/website_images/ab_websites/2802_website/hideout_bar_bg_new.jpg",
  oldTownBar: commons("Old Town Bar & Restaurant, Manhattan, New York City (4026975387).jpg"),
  rudys: commons("Rudy's Bar and Grill New York City.jpg"),
  bemelmans: commons("Bemelmans Bar at The Carlyle.jpg"),
  deadRabbit: "https://images.squarespace-cdn.com/content/v1/685080dd8e7237157b3c865e/25ccf4aa-aa73-4acd-b9dd-e221903daf66/TDRAUXSIGN4-1.webp?format=1000w",
  employeesOnly: "https://www.employeesonlynyc.com/content/3-galleries/03-space/space_04.jpg",
  pdt: "https://images.wsj.net/im-89230183?width=1280&size=1.499&pixel_ratio=2",
  attaboy: commons("Attaboy bar New York City.jpg"),
  cloverClub: "https://images.squarespace-cdn.com/content/v1/6273d57a3765ad41ccc86163/7e288b41-c3ce-4b70-b179-44cef426702d/CloverClub_July2022_ss-0418.jpg?format=2500w",
  dante: "https://images.getbento.com/accounts/e8eee6aef7c2e8242e267a82a199ac35/media/images/37253OLD_FASHIONED_WHISKEY_COCKTAIL.jpg?w=1800&fit=max&auto=compress,format&cs=origin",
  deathCo: commons("Death & Company, New York City.jpg"),
  angelShare: "https://images.squarespace-cdn.com/content/v1/5e712909f0a8ee01b4364b5f/269050cf-ecda-47b5-8521-8ce0ee428b5c/As+Mural+.jpg?format=2500w",
  kingCole: commons("King Cole Bar, St. Regis New York.jpg"),
  met: "https://images.wsj.net/im-80733661?width=700&size=1.214&pixel_ratio=2",
  moma: commons("Museum of Modern Art NYC 53rd Street.jpg"),
  whitney: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Whitney_Museum_of_American_Art_%2849051573133%29.jpg/1920px-Whitney_Museum_of_American_Art_%2849051573133%29.jpg",
  tenement: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/97_Orchard_Street_Front.jpg/1280px-97_Orchard_Street_Front.jpg",
  studioMuseum: "https://studiomuseum.imgix.net/images/StudioMuseuminHarlem_125thExterior_1.jpg?auto=format,compress&fit=max&w=2760",
  brooklynMuseum: commons("Brooklyn Museum Eastern Parkway.jpg"),
  lincolnCenter: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Lincoln_Center_Overview_%2848047495362%29.jpg/3840px-Lincoln_Center_Overview_%2848047495362%29.jpg",
  apollo: commons("Apollo Theater, Harlem.jpg"),
  noguchi: commons("Noguchi Museum, Queens.jpg"),
  movingImage: commons("MOMI.jpg"),
  statueLiberty: commons("Statue of Liberty 7.jpg"),
  ellisIsland: commons("Ellis Island Immigration Museum.jpg"),
  centralPark: commons("Central Park New York City New York 23 cropped.jpg"),
  highLine: commons("High Line 20th Street looking downtown.jpg"),
  brooklynBridge: commons("Brooklyn Bridge, New York City.jpg"),
  grandCentral: commons("Grand Central Station Main Concourse Jan 2006.jpg"),
  ferry: commons("Staten Island Ferry Whitehall Terminal.jpg"),
  prospectPark: commons("Long meadow in Prospect Park.jpg"),
  yankeeStadium: commons("Yankee Stadium (27353652982).jpg"),
  brooklynBotanic: "https://www.bbg.org/img/uploads/hero/_list_thumbnail_retina/japanese-garden_fall-foliage_bb.jpg",
  brooklynBridgePark: "https://brooklynbridgepark.org/wp-content/uploads/2023/03/Brooklyn-Bridge-Park-Emily-Warren-Roebling-Plaza-CZ5A8659-scaled-1.jpg",
  newYorkAquarium: "https://cdn.wcs.org/2022/05/23/158ytm0u1j_Julie_Larsen_Maher_8737_Giant_Pacific_Octopus_SPI_AQ_02_04_20_2.jpg",
  greenWood: "https://www.green-wood.com/wp-content/uploads/2026/06/The-Arch-Green-Wood-Staff-scaled.jpg",
  dominoPark: "https://cdn.sanity.io/images/4shd8slw/production/dfd64f3402af102a4ddbc037ba1696b40b3e47b3-4536x2808.jpg?rect=0,214,4536,2381&w=1200&h=630&q=90&fit=clip",
  brooklynChildren: commons("Brooklyn Children's Museum (52142426214).jpg"),
  brooklynPromenade: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Brooklyn_Heights_Promenade_%2855268460453%29.jpg/3840px-Brooklyn_Heights_Promenade_%2855268460453%29.jpg",
  momaPs1: "https://upload.wikimedia.org/wikipedia/en/a/a3/MoMA_PS1_FFP.jpg",
  queensMuseum: commons("Flushing Meadows Fair Grounds td (2018-05-26) 011 - Queens Museum.jpg"),
  queensBotanic: "https://queensbotanical.org/wp-content/uploads/2017/03/2015.10.16-Entrance-Plaza_Anne-Tan-Detchkov-scaled.jpg",
  louisArmstrong: "https://lahm.sfo3.digitaloceanspaces.com/wp-content/uploads/2025/12/31160947/1987_14_3690.jpg",
  socrates: "https://socratessculpturepark.org/wp-content/uploads/page/home/Teens-Solar-Cart-768x512.jpg",
  gantry: commons("View from Gantry Plaza State Park.jpg"),
  queensZoo: "https://cdn.wcs.org/2022/05/23/9cpppxbiqc_QZ_winter_2020_1.jpg",
  flushingMeadows: commons("Flushing Meadows Corona Park Unisphere.jpg"),
  bronxZoo: "https://cdn.wcs.org/2022/05/23/2439zohzq4_76768945_200ee080_6772_11ea_99f1_23346ee95a58.jpg",
  nyBotanicalGarden: "https://www.nybg.org/content/uploads/2019/08/Ben_Hider_BH_06016_3.1.jpg",
  waveHill: "https://www.wavehill.org/uploads/general/_1200x630_crop_center-center_none/wavehill-social-share.png",
  bronxMuseum: "https://bronxmuseum.org/wp-content/uploads/2022/10/cropped-The_Bronx_Museum_Social_Card.png",
  vanCortlandtPark: "https://vancortlandt.org/wp-content/uploads/2019/11/About-header.jpg",
  pelhamBayPark: commons("Orchard Beach - Pelham Bay Park - The Bronx.jpg"),
  bartowPell: commons("Bartow-pell-mansion.jpg"),
  vanCortlandtHouse: "https://www.vchm.org/uploads/2/5/7/5/25751801/editor/oe-top-for-eventbrite-etc.png?1782933885",
  woodlawn: commons("Woodlawn Cemetery in Bronx, New York (1).jpg"),
  snugHarbor: "https://snug-harbor.org/wp-content/uploads/2025/11/image-107.png",
  statenIslandMuseum: "https://www.statenislandmuseum.org/wp-content/uploads/2020/06/699.jpg",
  chineseScholarsGarden: "https://snug-harbor.org/wp-content/uploads/2026/03/SH_A737864_202509_MylesClapp-1.jpg",
  statenIslandZoo: commons("Staten Island Zoo Entrance.jpg"),
  historicRichmondTown: commons("School in Historic Richmond Town in Staten Island.jpg"),
  fortWadsworth: "https://www.nps.gov/gate/learn/historyculture/images/FOWAOverlook2.jpg",
  lighthouseMuseum: commons("National Lighthouse Museum Educational Resource Center.jpg"),
  aliceAusten: "https://i0.wp.com/aliceausten.org/wp-content/uploads/2024/04/Screen-Shot-2024-04-12-at-12.51.24-PM.png?fit=1200%2C964&ssl=1",
  conferenceHouse: commons("Conference-house-staten-island.jpg"),
};

const editorial = {
  restaurants: [
    source("Top organic result: Eater NY - Best Restaurants in New York City", "https://ny.eater.com/maps/best-new-york-restaurants-38-map"),
    source("The Infatuation - The Best Restaurants in NYC", "https://www.theinfatuation.com/new-york/guides/best-restaurants-nyc"),
    source("MICHELIN Guide - New York restaurants", "https://guide.michelin.com/us/en/new-york-state/new-york/restaurants"),
    source("Time Out - Best restaurants in NYC", "https://www.timeout.com/newyork/restaurants/100-best-new-york-restaurants"),
    source("New York Magazine Grub Street", "https://www.grubstreet.com/"),
  ],
  cheapEats: [
    source("Top organic result: Eater NY - Best Cheap Eats in NYC", "https://ny.eater.com/maps/best-cheap-eats-nyc"),
    source("The Infatuation - Best Cheap Eats NYC", "https://www.theinfatuation.com/new-york/guides/best-cheap-eats-nyc"),
    source("Time Out - Best cheap eats in NYC", "https://www.timeout.com/newyork/restaurants/best-cheap-eats-in-nyc"),
    source("New York Magazine - Cheap Eats", "https://www.grubstreet.com/tags/cheap-eats/"),
    source("Serious Eats - New York", "https://www.seriouseats.com/new-york-city"),
  ],
  hotels: [
    source("Top organic result: Conde Nast Traveler - Best Hotels in New York City", "https://www.cntraveler.com/gallery/best-hotels-in-new-york-city"),
    source("Travel + Leisure - Best Hotels in New York City", "https://www.travelandleisure.com/best-hotels-in-new-york-city-7371984"),
    source("MICHELIN Guide - New York hotels", "https://guide.michelin.com/us/en/hotels-stays/new-york-state/new-york"),
    source("Forbes Travel Guide - New York City hotels", "https://www.forbestravelguide.com/destinations/new-york-new-york/travel-guide"),
    source("Google Travel - New York City hotels", "https://www.google.com/travel/hotels/New%20York%20City"),
  ],
  hostels: [
    source("Top organic result: Hostelworld - New York hostels", "https://www.hostelworld.com/hostels/north-america/usa/new-york/"),
    source("Hostelgeeks - Best Hostels in New York City", "https://hostelgeeks.com/best-hostels-in-new-york-city-usa/"),
    source("The Broke Backpacker - Best Hostels in New York", "https://www.thebrokebackpacker.com/best-hostels-in-new-york-usa/"),
    source("Booking.com - New York hostels", "https://www.booking.com/hostels/city/us/new-york.html"),
    source("Google Travel - New York hostels", "https://www.google.com/travel/hotels/New%20York%20City?q=hostels%20new%20york%20city"),
  ],
  casualBars: [
    source("Top organic result: Time Out - Best dive bars in NYC", "https://www.timeout.com/newyork/bars/best-dive-bars-in-new-york"),
    source("Eater NY - Classic bars in NYC", "https://ny.eater.com/maps/classic-bars-nyc"),
    source("The Infatuation - Best Bars in NYC", "https://www.theinfatuation.com/new-york/guides/best-bars-nyc"),
    source("NYC LGBT Historic Sites Project", "https://www.nyclgbtsites.org/"),
    source("Google Maps - NYC dive bars", maps("best dive bars New York City")),
  ],
  cocktails: [
    source("Top organic result: Time Out - Best cocktail bars in NYC", "https://www.timeout.com/newyork/bars/best-cocktail-bars-in-new-york"),
    source("Eater NY - Best cocktail bars in NYC", "https://ny.eater.com/maps/best-cocktail-bars-nyc"),
    source("The Infatuation - Best cocktail bars NYC", "https://www.theinfatuation.com/new-york/guides/best-cocktail-bars-nyc"),
    source("World's 50 Best Bars - New York", "https://www.worlds50bestbars.com/"),
    source("Punch - New York cocktail bars", "https://punchdrink.com/"),
  ],
  culture: [
    source("Top organic result: NYC Tourism - Museums and Galleries", "https://www.nyctourism.com/museums-galleries/"),
    source("Time Out - Best museums in NYC", "https://www.timeout.com/newyork/museums/best-museums-in-nyc"),
    source("New York Magazine - Museums", "https://nymag.com/tags/museums/"),
    source("NYC Arts", "https://www.nyc-arts.org/"),
    source("Google Maps - NYC museums", maps("best museums culture New York City")),
  ],
  activities: [
    source("Top organic result: NYC Tourism - Things to Do", "https://www.nyctourism.com/things-to-do/"),
    source("Time Out - Best things to do in NYC", "https://www.timeout.com/newyork/things-to-do/best-things-to-do-in-new-york"),
    source("Lonely Planet - Best things to do in New York City", "https://www.lonelyplanet.com/articles/top-things-to-do-in-new-york-city"),
    source("Central Park Conservancy", "https://www.centralparknyc.org/"),
    source("National Park Service - Statue of Liberty and Ellis Island", "https://www.nps.gov/stli/index.htm"),
  ],
};

type StopInput = {
  id: string;
  name: string;
  coordinates: [number, number];
  description: string;
  officialUrl: string;
  photo: string;
  hours: string;
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

const verifiedHoursByStopId: Record<string, string> = {
  "nyc-dining-katzs": "Monday-Friday 8:00 AM-10:45 PM; Saturday-Sunday 8:00 AM-11:00 PM. Private-event closures are posted on Katz's official hours page.",
  "nyc-dining-russ-daughters": "The original Houston Street shop is open daily 8:00 AM-4:00 PM; the Orchard Street cafe seats Monday-Thursday 8:30 AM-2:30 PM and Friday-Sunday 8:30 AM-3:30 PM.",
  "nyc-dining-sylvias": "Wednesday-Saturday 11:00 AM-10:00 PM; Sunday-Tuesday 11:00 AM-8:00 PM.",
  "nyc-dining-nom-wah": "Open daily 11:00 AM-9:00 PM, including major holidays.",
  "nyc-dining-oyster-bar": "Monday-Friday 11:30 AM-9:30 PM; Saturday-Sunday closed. Grand Central posts holiday exceptions separately.",
  "nyc-dining-veselka": "Monday-Thursday 9:00 AM-midnight; Friday 9:00 AM through overnight service; Saturday open 24 hours; Sunday closes 11:00 PM.",
  "nyc-dining-lombardis": "Sunday-Thursday 11:30 AM-10:00 PM; Friday-Saturday 11:30 AM-midnight.",
  "nyc-cheap-grays-papaya": "Sunday-Wednesday 8:00 AM-10:00 PM; Thursday-Saturday 8:00 AM-11:00 PM.",
  "nyc-cheap-joes-pizza": "Sunday-Thursday 10:00 AM-3:00 AM; Friday-Saturday 10:00 AM-4:00 AM at the Carmine Street shop.",
  "nyc-cheap-mamouns": "Monday-Wednesday 11:00 AM-2:00 AM; Thursday 11:00 AM-3:00 AM; Friday-Saturday 11:00 AM-4:00 AM; Sunday 11:00 AM-1:00 AM.",
  "nyc-cheap-vanessas": "Open daily 10:30 AM-9:30 PM at 118A Eldridge Street.",
  "nyc-cheap-los-tacos": "Open daily 11:00 AM-10:00 PM at Chelsea Market.",
  "nyc-cheap-punjabi-deli": "Open daily 8:00 AM-10:00 PM.",
  "nyc-cheap-hh-bagels": "Open daily 6:00 AM-5:00 PM at the Upper East Side shop; airport and station branches keep terminal-specific schedules.",
  "nyc-cheap-taim": "Open daily 11:00 AM-10:00 PM at the Waverly Place shop.",
  "nyc-hostel-local-ny": "The official booking page lists date-specific reception, check-in, dorm, and private-room availability.",
  "nyc-hostel-q4": "The official booking page lists date-specific check-in, dorm, and private-room availability.",
  "nyc-hostel-ny-moore": "The official booking page lists date-specific reception, check-in, dorm, and private-room availability.",
  "nyc-hostel-west-side-ymca": "The official booking page lists date-specific check-in windows, room inventory, and facility access.",
  "nyc-hostel-chelsea-international": "The official booking page lists date-specific check-in windows, dorms, and private-room inventory.",
  "nyc-hostel-nap-york": "The official booking page lists date-specific check-in rules and pod inventory.",
  "nyc-hostel-american-dream": "The official booking page lists date-specific check-in policies and private-room inventory.",
  "nyc-bar-mcsorleys": "Monday-Saturday 11:00 AM-1:00 AM; Sunday noon-1:00 AM.",
  "nyc-bar-white-horse": "Open daily 11:00 AM-4:00 AM; kitchen service ends earlier than the bar.",
  "nyc-bar-ear-inn": "Open daily 11:30 AM-4:00 AM; kitchen closes nightly at 2:00 AM.",
  "nyc-bar-petes-tavern": "Open daily noon-2:00 AM; kitchen closes Sunday-Thursday 11:00 PM and Friday-Saturday midnight.",
  "nyc-bar-julius": "Monday-Thursday 4:00 PM-2:00 AM; Friday 4:00 PM-4:00 AM; Saturday noon-4:00 AM; Sunday noon-2:00 AM.",
  "nyc-bar-stonewall": "Open daily 2:00 PM-4:00 AM; drag, karaoke, and DJ times follow the official event calendar.",
  "nyc-bar-sunnys": "Monday-Tuesday 3:00 PM-midnight; Wednesday-Thursday 3:00 PM-1:00 AM; Friday 2:00 PM-1:00 AM; Saturday noon-1:00 AM; Sunday noon-midnight.",
  "nyc-bar-fraunces": "Monday-Friday 11:30 AM-midnight; Saturday 11:00 AM-1:00 AM; Sunday 11:00 AM-midnight. The museum keeps separate daytime hours.",
  "nyc-bar-old-town": "Sunday noon-10:30 PM; Monday 11:30 AM-midnight; Tuesday-Thursday and Saturday 11:30 AM-12:30 AM; Friday 11:30 AM-1:00 AM.",
  "nyc-bar-rudys": "Monday-Saturday 8:00 AM-4:00 AM; Sunday noon-4:00 AM.",
  "nyc-cocktail-bemelmans": "Sunday-Monday noon-midnight; Tuesday-Thursday noon-12:30 AM; Friday-Saturday noon-1:00 AM. Music cover charges begin at 5:30 PM.",
  "nyc-cocktail-dead-rabbit": "Taproom Sunday-Thursday 11:00 AM-2:00 AM and Friday-Saturday 11:00 AM-3:00 AM; Parlor Tuesday-Saturday 5:00 PM-1:00 AM and Sunday 4:00 PM-midnight.",
  "nyc-cocktail-employees-only": "Open daily 6:00 PM-4:00 AM; full kitchen until 3:00 AM and reserved dinner seating until 11:00 PM.",
  "nyc-cocktail-pdt": "Sunday 4:00 PM-2:00 AM; Monday-Wednesday 5:00 PM-2:00 AM; Thursday-Saturday 4:00 PM-2:00 AM.",
  "nyc-cocktail-attaboy": "Open daily 5:00 PM-3:00 AM; limited reservations and walk-in seating are restricted to parties of six or fewer.",
  "nyc-cocktail-dante": "Monday-Friday opens noon; Saturday-Sunday opens 10:00 AM. Food service ends Sunday-Wednesday 11:00 PM and Thursday-Saturday midnight.",
  "nyc-cocktail-death-co": "Sunday-Wednesday 6:00 PM-1:00 AM; Thursday-Saturday 6:00 PM-2:00 AM.",
  "nyc-cocktail-angels-share": "Open daily 5:30 PM-midnight; seating inventory follows the official reservation page.",
  "nyc-cocktail-king-cole": "Open daily 4:00 PM-11:00 PM.",
  "nyc-culture-met": "Sunday-Tuesday and Thursday 10:00 AM-5:00 PM; Friday-Saturday 10:00 AM-9:00 PM; Wednesday closed.",
  "nyc-culture-moma": "Saturday-Thursday 10:30 AM-5:30 PM; Friday 10:30 AM-8:30 PM.",
  "nyc-culture-whitney": "Summer schedule through August 18: daily 10:30 AM-6:00 PM, Friday until 10:00 PM; the official seasonal hours page lists the post-summer Tuesday closure.",
  "nyc-culture-studio-museum": "Wednesday-Thursday and Saturday-Sunday 11:00 AM-6:00 PM; Friday 11:00 AM-9:00 PM; Monday-Tuesday closed.",
  "nyc-culture-brooklyn-museum": "Wednesday-Sunday 11:00 AM-6:00 PM; Monday-Tuesday closed.",
  "nyc-culture-lincoln-center": "Campus public spaces are open daily; performances, tours, and box offices follow the official event calendar for each constituent venue.",
  "nyc-culture-apollo": "Performances, tours, and box-office access follow the official Apollo event calendar; each ticket page lists doors and show time.",
  "nyc-culture-noguchi": "Wednesday-Sunday 11:00 AM-6:00 PM; Monday-Tuesday closed. First Fridays from May through September continue until 8:00 PM.",
  "nyc-culture-moving-image": "Thursday 2:00 PM-6:00 PM; Friday 2:00 PM-8:00 PM; Saturday-Sunday 11:00 AM-6:00 PM; Monday-Wednesday closed.",
  "nyc-activity-statue-liberty": "Visitor access follows the official Statue City Cruises ferry timetable and NPS ticket calendar; first departures and final return boats are listed by date.",
  "nyc-activity-ellis-island": "Visitor access follows the official Statue City Cruises ferry timetable and NPS ticket calendar; first departures and final return boats are listed by date.",
  "nyc-activity-high-line": "July 1-September 30 daily 7:00 AM-11:00 PM; fall, winter, and spring closing times follow the official seasonal hours page.",
  "nyc-activity-grand-central": "Terminal open daily 5:15 AM-2:00 AM; shops, dining, tours, and rail services keep separate schedules.",
  "nyc-activity-met": "Sunday-Tuesday and Thursday 10:00 AM-5:00 PM; Friday-Saturday 10:00 AM-9:00 PM; Wednesday closed.",
};

function stop(input: StopInput): GuideStop {
  const mapUrl = maps(input.mapQuery ?? `${input.name} New York City`);
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
    hours: { default: verifiedHoursByStopId[input.id] ?? input.hours },
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
      notes: "Official page plus Google Maps search/listing evidence checked for current status; no permanent-closure warning found in the source set.",
    },
  };
}

export const diningStops = [
  stop({
    id: "nyc-dining-katzs",
    name: "Katz's Delicatessen",
    coordinates: [40.722233, -73.987429],
    description: "Katz's is New York's oldest operating deli, and the Lower East Side ritual still centers on hand-carved pastrami, ticket-in-hand counter service, and a room that feels inseparable from the city. Go for pastrami, matzo ball soup, and deli history rather than a quiet sit-down meal.",
    officialUrl: "https://katzsdelicatessen.com/",
    photo: images.katz,
    hours: "Official Katz's hours page lists day-by-day service, including late-night and 24-hour periods that vary by weekday/weekend.",
    price: "$$",
    priceSource: "Official menu / Google Maps",
    venueKind: "food_drink",
    foodServiceType: "counter_service",
    cuisineTypes: ["jewish_deli", "sandwiches", "new_york_classic"],
    attributeTags: ["classic", "counter_service", "lively", "historic", "solo_friendly"],
    editorialUrls: ["https://ny.eater.com/venue/11022/katz-s-delicatessen", "https://www.timeout.com/newyork/restaurants/katzs-delicatessen"],
  }),
  stop({
    id: "nyc-dining-russ-daughters",
    name: "Russ & Daughters",
    coordinates: [40.722758, -73.988203],
    description: "Russ & Daughters is the classic appetizing shop for smoked fish, bagels, caviar, babka, and a century of Lower East Side food culture. The original shop is takeaway-focused; the cafe supplies the seated version.",
    officialUrl: "https://www.russanddaughters.com/",
    photo: images.russ,
    hours: "Shop and cafe schedules vary by location; check the official hours page before choosing takeaway or a seated meal.",
    price: "$$",
    priceSource: "Official menu / Google Maps",
    venueKind: "food_drink",
    foodServiceType: "counter_service",
    cuisineTypes: ["jewish_appetizing", "bagels", "smoked_fish"],
    attributeTags: ["classic", "breakfast", "takeaway", "historic", "counter_service"],
    editorialUrls: ["https://www.theinfatuation.com/new-york/reviews/russ-daughters-cafe", "https://ny.eater.com/venue/3028/russ-daughters"],
  }),
  stop({
    id: "nyc-dining-keens",
    name: "Keens Steakhouse",
    coordinates: [40.750914, -73.986688],
    description: "Keens is a classic Midtown steakhouse with clay pipes overhead, dark wood rooms, a famous mutton chop, and serious beef near the theaters.",
    officialUrl: "https://www.keens.com/",
    photo: images.keens,
    hours: "Lunch and dinner service are posted by day on the official site; reservations strongly recommended.",
    price: "$$$$",
    priceSource: "Official menu / reservation platform",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["steakhouse", "american", "historic_new_york"],
    attributeTags: ["reservation_recommended", "historic", "date_night", "classic", "midtown"],
    editorialUrls: ["https://ny.eater.com/maps/classic-restaurants-nyc", "https://www.theinfatuation.com/new-york/reviews/keens-steakhouse"],
  }),
  stop({
    id: "nyc-dining-balthazar",
    name: "Balthazar",
    coordinates: [40.722712, -73.998159],
    description: "Balthazar is the SoHo brasserie that turns breakfast, oysters, steak frites, French onion soup, and red-banquette theater into one of downtown's most recognizable dining rooms. It broadens the classic-room list beyond steakhouses while keeping the meal unmistakably New York.",
    officialUrl: "https://balthazarny.com/",
    photo: images.balthazar,
    hours: "Official site posts daily breakfast, lunch, brunch, dinner, and bakery hours; reservations recommended for peak meals.",
    price: "$$$",
    priceSource: "Official menu / reservation platform",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["french", "brasserie", "soho"],
    attributeTags: ["reservation_recommended", "classic", "brunch", "lively", "soho"],
    editorialUrls: ["https://ny.eater.com/maps/classic-restaurants-nyc", "https://en.wikipedia.org/wiki/Balthazar_(restaurant)"],
  }),
  stop({
    id: "nyc-dining-sylvias",
    name: "Sylvia's Restaurant",
    coordinates: [40.808007, -73.944864],
    description: "Sylvia's is a legendary Harlem soul-food restaurant known for fried chicken, ribs, collards, cornbread, and a dining room that has helped define Lenox Avenue for generations.",
    officialUrl: "https://sylviasrestaurant.com/",
    photo: images.sylvias,
    hours: "Official site posts daily restaurant hours and special brunch/service notes; verify holiday and event schedules.",
    price: "$$",
    priceSource: "Official menu / Google Maps",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["soul_food", "american", "harlem"],
    attributeTags: ["historic", "family_friendly", "lively", "brunch", "harlem"],
    editorialUrls: ["https://ny.eater.com/maps/best-soul-food-restaurants-nyc", "https://www.timeout.com/newyork/restaurants/sylvias"],
  }),
  stop({
    id: "nyc-dining-nom-wah",
    name: "Nom Wah Tea Parlor",
    coordinates: [40.714512, -73.998235],
    description: "Nom Wah pairs Doyers Street history with old-school booths, dumplings, buns, and tea in one of Chinatown's longest-running dim sum rooms.",
    officialUrl: "https://nomwah.com/",
    photo: images.nomWah,
    hours: "Official site and map listings show daily dim sum service; check same-day hours and location-specific notes.",
    price: "$$",
    priceSource: "Official menu / Google Maps",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["dim_sum", "cantonese", "chinatown"],
    attributeTags: ["historic", "lunch", "group_meal", "walk_in_friendly", "chinatown"],
    editorialUrls: ["https://ny.eater.com/maps/best-dim-sum-restaurants-nyc", "https://www.theinfatuation.com/new-york/reviews/nom-wah-tea-parlor"],
  }),
  stop({
    id: "nyc-dining-oyster-bar",
    name: "Grand Central Oyster Bar",
    coordinates: [40.752746, -73.977229],
    description: "Grand Central Oyster Bar is the vaulted seafood room inside the terminal, good for oysters, chowder, a Midtown lunch, or a pre-train martini under one of the city's great interiors. The architecture and transit setting are as central as the seafood.",
    officialUrl: "https://www.oysterbarny.com/",
    photo: images.oysterBar,
    hours: "Official Oyster Bar hours page lists weekday and Saturday lunch/dinner service, with Sunday closures and holiday schedules handled separately.",
    price: "$$$",
    priceSource: "Official menu / Google Maps",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["seafood", "oyster_bar", "american"],
    attributeTags: ["historic", "midtown", "counter_service", "lunch", "architecture"],
    editorialUrls: ["https://ny.eater.com/maps/classic-restaurants-nyc", "https://www.timeout.com/newyork/restaurants/grand-central-oyster-bar"],
  }),
  stop({
    id: "nyc-dining-tavern-green",
    name: "Tavern on the Green",
    coordinates: [40.772246, -73.977619],
    description: "Tavern on the Green pairs a chandelier-lit dining room with one of Central Park's most recognizable restaurant settings; atmosphere carries more weight than culinary novelty.",
    officialUrl: "https://www.tavernonthegreen.com/",
    photo: images.tavernGreen,
    hours: "Official site posts brunch, lunch, dinner, and bar hours by day; reservations recommended.",
    price: "$$$",
    priceSource: "Official menu / reservation platform",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["american", "park_restaurant", "brunch"],
    attributeTags: ["scenic", "reservation_recommended", "brunch", "romantic", "central_park"],
    editorialUrls: ["https://www.timeout.com/newyork/restaurants/tavern-on-the-green", "https://www.nyctourism.com/restaurants/tavern-on-the-green/"],
  }),
  stop({
    id: "nyc-dining-veselka",
    name: "Veselka",
    coordinates: [40.729162, -73.986019],
    description: "Veselka is a durable Ukrainian East Village institution serving pierogi, borscht, latkes, and other comfort dishes through busy late service. Expect democratic bustle rather than hushed dining.",
    officialUrl: "https://www.veselka.com/",
    photo: images.veselka,
    hours: "Official site posts daily hours and location-specific updates; late hours can change, so verify before counting on a post-midnight meal.",
    price: "$$",
    priceSource: "Official menu / Google Maps",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["ukrainian", "diner", "comfort_food"],
    attributeTags: ["late_night", "east_village", "casual", "classic", "solo_friendly"],
    editorialUrls: ["https://ny.eater.com/maps/classic-restaurants-nyc", "https://www.theinfatuation.com/new-york/reviews/veselka"],
  }),
  stop({
    id: "nyc-dining-lombardis",
    name: "Lombardi's",
    coordinates: [40.72157, -73.995594],
    description: "Lombardi's is a coal-oven pizza landmark tied to New York's first-pizzeria story, serving whole pies in Little Italy with food history built into the meal.",
    officialUrl: "https://www.firstpizza.com/",
    photo: images.lombardis,
    hours: "Official site and map listings show daily lunch and dinner service; verify same-day hours before going.",
    price: "$$",
    priceSource: "Official menu / Google Maps",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["pizza", "italian_american", "coal_oven"],
    attributeTags: ["classic", "group_meal", "historic", "casual", "nolita"],
    editorialUrls: ["https://ny.eater.com/maps/best-pizza-nyc", "https://www.timeout.com/newyork/restaurants/lombardis-pizza"],
  }),
];

const cheapEatStops = [
  stop({ id: "nyc-cheap-grays-papaya", name: "Gray's Papaya", coordinates: [40.778984, -73.981812], description: "Gray's Papaya is the Upper West Side hot-dog counter for a quick, cheap New York meal near Central Park or Lincoln Center. The appeal is simple: franks, papaya drinks, fast service, and a classic storefront.", officialUrl: "https://www.grayspapaya.nyc/", photo: images.graysPapaya, hours: "Official Gray's Papaya listings show long daily counter-service hours, with late-night hours posted by the Upper West Side shop.", price: "$", priceSource: "Official menu / Google Maps", venueKind: "food_drink", foodServiceType: "fast_food", cuisineTypes: ["hot_dogs", "american", "counter_service"], attributeTags: ["budget", "quick_meal", "late_night", "classic", "solo_friendly"], editorialUrls: ["https://ny.eater.com/maps/best-cheap-eats-nyc", "https://www.timeout.com/newyork/restaurants/grays-papaya"] }),
  stop({ id: "nyc-cheap-joes-pizza", name: "Joe's Pizza", coordinates: [40.730554, -74.002142], description: "Joe's is the Village slice-shop standard: hot cheese slices, fast counter service, and a plain-slice baseline that still feels useful at almost any hour.", officialUrl: "https://www.joespizzanyc.com/", photo: images.joesPizza, hours: "Official site lists location-specific daily hours, including late hours at some branches; verify the Carmine Street listing.", price: "$", priceSource: "Official menu / Google Maps", venueKind: "food_drink", foodServiceType: "counter_service", cuisineTypes: ["pizza", "new_york_slice", "italian_american"], attributeTags: ["budget", "quick_meal", "late_night", "walk_in_friendly", "classic"], editorialUrls: ["https://ny.eater.com/maps/best-pizza-nyc", "https://www.theinfatuation.com/new-york/reviews/joes-pizza"] }),
  stop({ id: "nyc-cheap-mamouns", name: "Mamoun's Falafel", coordinates: [40.730216, -74.000087], description: "Mamoun's is a long-running Village counter for inexpensive falafel, shawarma, hummus, and vegetarian Middle Eastern plates. Fast service and late hours keep it useful well beyond lunch.", officialUrl: "https://mamouns.com/", photo: images.mamouns, hours: "Official site posts location-specific daily hours; verify late-night service before planning around it.", price: "$", priceSource: "Official menu / Google Maps", venueKind: "food_drink", foodServiceType: "fast_casual", cuisineTypes: ["falafel", "shawarma", "middle_eastern"], attributeTags: ["budget", "quick_meal", "vegetarian", "late_night", "village"], editorialUrls: ["https://ny.eater.com/maps/best-cheap-eats-nyc", "https://www.timeout.com/newyork/restaurants/mamouns-falafel"] }),
  stop({ id: "nyc-cheap-xian-famous-foods", name: "Xi'an Famous Foods", coordinates: [40.715874, -73.997031], description: "Xi'an Famous Foods specializes in hand-ripped noodles, cumin lamb, chili heat, and the chewy textures of northwestern Chinese cooking. Central branches work for a fast lunch; lingering atmosphere is not the attraction.", officialUrl: "https://www.xianfoods.com/", photo: images.xian, hours: "Official site posts branch-specific daily hours; check the chosen location before routing.", price: "$", priceSource: "Official menu / Google Maps", venueKind: "food_drink", foodServiceType: "fast_casual", cuisineTypes: ["xian", "noodles", "chinese"], attributeTags: ["budget", "quick_meal", "spicy", "counter_service", "solo_friendly"], editorialUrls: ["https://ny.eater.com/maps/best-cheap-eats-nyc", "https://www.theinfatuation.com/new-york/reviews/xian-famous-foods"] }),
  stop({ id: "nyc-cheap-vanessas", name: "Vanessa's Dumpling House", coordinates: [40.718329, -73.991576], description: "Vanessa's is a Chinatown-edge counter for dumplings, sesame pancake sandwiches, noodles, and quick plates that keep a downtown day affordable. It is especially useful for groups because a few orders cover a lot of ground.", officialUrl: "https://www.vanessas.com/", photo: images.vanessas, hours: "Official site and map listings show daily service by location; verify Eldridge Street hours before going.", price: "$", priceSource: "Official menu / Google Maps", venueKind: "food_drink", foodServiceType: "counter_service", cuisineTypes: ["dumplings", "chinese", "cheap_eats"], attributeTags: ["budget", "quick_meal", "group_meal", "counter_service", "chinatown_edge"], editorialUrls: ["https://ny.eater.com/maps/best-cheap-eats-nyc", "https://www.theinfatuation.com/new-york/reviews/vanessas-dumpling-house"] }),
  stop({ id: "nyc-cheap-los-tacos", name: "Los Tacos No. 1", coordinates: [40.742279, -74.006445], description: "Los Tacos No. 1 is popular because the adobada, carne asada, tortillas, and quick counter rhythm actually justify the line.", officialUrl: "https://www.lostacos1.com/", photo: images.losTacos, hours: "Official site lists location-specific daily hours; verify the branch before going.", price: "$$", priceSource: "Official menu / Google Maps", venueKind: "food_drink", foodServiceType: "counter_service", cuisineTypes: ["tacos", "mexican", "counter_service"], attributeTags: ["quick_meal", "popular", "counter_service", "chelsea", "group_meal"], editorialUrls: ["https://ny.eater.com/maps/best-cheap-eats-nyc", "https://www.theinfatuation.com/new-york/reviews/los-tacos-no-1"] }),
  stop({ id: "nyc-cheap-tompkins-square-bagels", name: "Tompkins Square Bagels", coordinates: [40.728046, -73.980821], description: "Tompkins Square Bagels hand-rolls and bakes bagels throughout the day at its original Avenue A shop, with classic, tofu, and flavored schmears plus substantial breakfast sandwiches. It replaces the now-closed Absolute Bagels with a current, source-backed East Village counter.", officialUrl: "https://www.tompkinssquarebagels.com/location/east-village-bagel-shop-avenue-a/", photo: images.tompkinsSquareBagels, hours: "Open daily 7:00 AM-5:00 PM at 165 Avenue A.", price: "$", priceSource: "Official menu / Google Maps", venueKind: "food_drink", foodServiceType: "bakery", cuisineTypes: ["bagels", "breakfast", "bakery"], attributeTags: ["budget", "breakfast", "counter_service", "east_village", "takeaway"], editorialUrls: ["https://ny.eater.com/maps/best-bagels-nyc", "https://www.timeout.com/newyork/restaurants/tompkins-square-bagels"] }),
  stop({ id: "nyc-cheap-punjabi-deli", name: "Punjabi Deli", coordinates: [40.723172, -73.996497], description: "Punjabi Deli is the taxi-driver counter that turns rice, chana, saag, samosas, and chai into one of downtown's most useful budget meals. The space is small and functional; go because it feeds you honestly between SoHo, Nolita, and the Lower East Side.", officialUrl: "https://www.punjabidelinyc.com/", photo: images.punjabiDeli, hours: "Official Punjabi Deli site and Google Maps listing show long daily service windows, with late-night hours posted by the shop/listing.", price: "$", priceSource: "Official menu / Google Maps", venueKind: "food_drink", foodServiceType: "counter_service", cuisineTypes: ["punjabi", "indian", "vegetarian"], attributeTags: ["budget", "vegetarian", "quick_meal", "counter_service", "late_night"], editorialUrls: ["https://ny.eater.com/maps/best-cheap-eats-nyc", "https://www.theinfatuation.com/new-york/reviews/punjabi-deli"] }),
  stop({ id: "nyc-cheap-hh-bagels", name: "H&H Bagels", coordinates: [40.774433, -73.95448], description: "H&H Bagels serves classic New York bagels, spreads, and breakfast sandwiches from multiple city locations, with quick counter service and broad morning availability.", officialUrl: "https://www.hhbagels.com/", photo: images.hhBagels, hours: "Official H&H locations page lists store-specific hours for Upper East Side, Upper West Side, Moynihan, JFK, and LaGuardia branches.", price: "$", priceSource: "Official menu / Google Maps", venueKind: "food_drink", foodServiceType: "bakery", cuisineTypes: ["bagels", "breakfast", "bakery"], attributeTags: ["budget", "breakfast", "counter_service", "upper_east_side", "takeaway"], editorialUrls: ["https://www.cntraveler.com/story/best-bagels-new-york-city", "https://en.wikipedia.org/wiki/H%26H_Bagels"] }),
  stop({ id: "nyc-cheap-taim", name: "Taïm", coordinates: [40.735948, -74.001522], description: "Taïm serves fresh falafel, sabich, salads, and other fast vegetarian-friendly food without requiring a reservation. The business now has several branches, each with location-specific hours.", officialUrl: "https://www.taimfalafel.com/", photo: images.taim, hours: "Official site lists location-specific hours; verify the branch before going.", price: "$", priceSource: "Official menu / Google Maps", venueKind: "food_drink", foodServiceType: "fast_casual", cuisineTypes: ["falafel", "israeli", "vegetarian"], attributeTags: ["budget", "vegetarian", "quick_meal", "healthy", "fast_casual"], editorialUrls: ["https://ny.eater.com/maps/best-cheap-eats-nyc", "https://www.timeout.com/newyork/restaurants/taim"] }),
];

export const hotelStops = [
  stop({ id: "nyc-hotel-plaza", name: "The Plaza Hotel", coordinates: [40.764489, -73.974488], description: "The Plaza is a Central Park South landmark with grand public rooms, formal service, and immediate access to Fifth Avenue, the park, and Midtown. Its high price reflects both the hospitality and the hotel's iconography.", officialUrl: "https://www.theplazany.com/", bookingUrl: "https://www.theplazany.com/rooms-suites/", photo: images.plaza, hours: "Hotel operates 24 hours daily; restaurants, afternoon tea, and spa keep separate schedules.", price: "$$$$", priceSource: "Official booking site / Google Travel", venueKind: "lodging", lodgingType: "hotel", attributeTags: ["luxury", "central", "romantic", "historic", "family_friendly"], editorialUrls: ["https://www.cntraveler.com/hotels/new-york/the-plaza-hotel", "https://guide.michelin.com/us/en/hotels-stays/new-york/the-plaza-11724"] }),
  stop({ id: "nyc-hotel-chelsea", name: "Hotel Chelsea", coordinates: [40.744413, -73.996802], description: "Hotel Chelsea pairs restored rooms and long corridors with the building's history as a home for artists and writers. Its downtown charge, gallery access, and nightlife feel far removed from hushed corporate hospitality.", officialUrl: "https://hotelchelsea.com/", bookingUrl: "https://hotelchelsea.com/rooms/", photo: images.chelseaHotel, hours: "Hotel operates 24 hours daily; restaurant and bar schedules vary.", price: "$$$$", priceSource: "Official booking site / Google Travel", venueKind: "lodging", lodgingType: "hotel", attributeTags: ["design", "historic", "central", "lively", "romantic"], editorialUrls: ["https://www.cntraveler.com/hotels/new-york/hotel-chelsea", "https://www.travelandleisure.com/hotel-chelsea-new-york-city-review-7480891"] }),
  stop({ id: "nyc-hotel-beekman", name: "The Beekman, A Thompson Hotel", coordinates: [40.711337, -74.006983], description: "The Beekman is a downtown base with a dramatic atrium, restored Temple Court bones, and easy access to City Hall, Tribeca, FiDi, and the Brooklyn Bridge.", officialUrl: "https://www.thebeekman.com/", bookingUrl: "https://www.thebeekman.com/rooms/", photo: images.beekman, hours: "Hotel operates 24 hours daily; restaurants and bars keep separate schedules.", price: "$$$$", priceSource: "Official booking site / Google Travel", venueKind: "lodging", lodgingType: "hotel", attributeTags: ["luxury", "design", "historic", "downtown", "romantic"], editorialUrls: ["https://www.cntraveler.com/hotels/new-york/the-beekman-a-thompson-hotel", "https://guide.michelin.com/us/en/hotels-stays/new-york/the-beekman-a-thompson-hotel-6867"] }),
  stop({ id: "nyc-hotel-bowery", name: "The Bowery Hotel", coordinates: [40.726145, -73.991381], description: "The Bowery Hotel is an atmospheric downtown property defined by fireplaces, velvet, brick, and an East Village/NoHo address. Neighborhood character and walkability come at a high nightly price.", officialUrl: "https://theboweryhotel.com/", bookingUrl: "https://theboweryhotel.com/rooms/", photo: images.boweryHotel, hours: "Hotel operates 24 hours daily; restaurant and lounge hours vary.", price: "$$$$", priceSource: "Official booking site / Google Travel", venueKind: "lodging", lodgingType: "hotel", attributeTags: ["design", "romantic", "central", "nightlife_nearby", "luxury"], editorialUrls: ["https://www.cntraveler.com/hotels/new-york/the-bowery-hotel", "https://www.travelandleisure.com/hotels-resorts/boutique-hotels/bowery-hotel-new-york-review"] }),
  stop({ id: "nyc-hotel-standard-high-line", name: "The Standard, High Line", coordinates: [40.740995, -74.007652], description: "The Standard is the Meatpacking stay for views, nightlife proximity, and a High Line address that makes west-side wandering easy.", officialUrl: "https://www.standardhotels.com/new-york/properties/high-line", bookingUrl: "https://www.standardhotels.com/new-york/properties/high-line/rooms", photo: images.standardHighLine, hours: "Hotel operates 24 hours daily; rooftop, restaurants, and clubs keep separate schedules.", price: "$$$$", priceSource: "Official booking site / Google Travel", venueKind: "lodging", lodgingType: "hotel", attributeTags: ["design", "lively", "scenic", "nightlife_nearby", "luxury"], editorialUrls: ["https://www.cntraveler.com/hotels/new-york/the-standard-high-line", "https://guide.michelin.com/us/en/hotels-stays/new-york/the-standard-high-line-5854"] }),
  stop({ id: "nyc-hotel-carlyle", name: "The Carlyle, A Rosewood Hotel", coordinates: [40.774415, -73.963301], description: "The Carlyle pairs old New York discretion with formal service, Bemelmans Bar, Cafe Carlyle, and an Upper East Side address near museums and Central Park. It is expensive, self-contained, and proudly not downtown.", officialUrl: "https://www.rosewoodhotels.com/en/the-carlyle-new-york", bookingUrl: "https://www.rosewoodhotels.com/en/the-carlyle-new-york/accommodation", photo: images.carlyle, hours: "Hotel operates 24 hours daily; Bemelmans Bar, Cafe Carlyle, and dining keep separate schedules.", price: "$$$$", priceSource: "Official booking site / Google Travel", venueKind: "lodging", lodgingType: "hotel", attributeTags: ["luxury", "quiet", "historic", "romantic", "upper_east_side"], editorialUrls: ["https://www.cntraveler.com/hotels/new-york/the-carlyle-a-rosewood-hotel", "https://guide.michelin.com/us/en/hotels-stays/new-york/the-carlyle-a-rosewood-hotel-5830"] }),
  stop({ id: "nyc-hotel-ludlow", name: "The Ludlow Hotel", coordinates: [40.72194, -73.987261], description: "The Ludlow is the Lower East Side hotel for downtown restaurants, bars, galleries, and subway reach without staying in a glass tower. Rooms can be compact, so book for neighborhood energy and views rather than square footage.", officialUrl: "https://www.ludlowhotel.com/", bookingUrl: "https://www.ludlowhotel.com/rooms/", photo: images.ludlow, hours: "Hotel operates 24 hours daily; restaurant and lounge schedules vary.", price: "$$$", priceSource: "Official booking site / Google Travel", venueKind: "lodging", lodgingType: "hotel", attributeTags: ["design", "central", "nightlife_nearby", "midrange", "downtown"], editorialUrls: ["https://www.cntraveler.com/hotels/new-york/the-ludlow-hotel", "https://guide.michelin.com/us/en/hotels-stays/new-york/the-ludlow-hotel-6444"] }),
  stop({ id: "nyc-hotel-ace", name: "Ace Hotel New York", coordinates: [40.745764, -73.988101], description: "Ace Hotel New York is the NoMad base for travelers who like lobby life, design looseness, and easy subway access more than luxury polish.", officialUrl: "https://acehotel.com/new-york/", bookingUrl: "https://acehotel.com/new-york/rooms/", photo: images.ace, hours: "Hotel operates 24 hours daily; lobby, restaurant, and bar programming vary.", price: "$$$", priceSource: "Official booking site / Google Travel", venueKind: "lodging", lodgingType: "hotel", attributeTags: ["design", "central", "work_friendly", "lively", "midrange"], editorialUrls: ["https://www.cntraveler.com/hotels/new-york/ace-hotel-new-york", "https://guide.michelin.com/us/en/hotels-stays/new-york/ace-hotel-new-york-5820"] }),
  stop({ id: "nyc-hotel-twa", name: "TWA Hotel", coordinates: [40.645994, -73.777302], description: "TWA Hotel occupies Eero Saarinen's restored terminal at JFK, combining airport logistics with aviation design, exhibits, a pool deck, and mid-century nostalgia. It is an airport property, not a practical Manhattan sightseeing hotel.", officialUrl: "https://www.twahotel.com/", bookingUrl: "https://www.twahotel.com/rooms", photo: images.twa, hours: "Hotel operates 24 hours daily; pool, bars, and exhibits keep separate schedules.", price: "$$$", priceSource: "Official booking site / Google Travel", venueKind: "lodging", lodgingType: "hotel", attributeTags: ["design", "airport", "historic", "family_friendly", "scenic"], editorialUrls: ["https://www.cntraveler.com/hotels/new-york/twa-hotel", "https://guide.michelin.com/us/en/hotels-stays/new-york/twa-hotel-11662"] }),
  stop({ id: "nyc-hotel-marlton", name: "The Marlton Hotel", coordinates: [40.732592, -73.99725], description: "The Marlton is a Greenwich Village small-hotel with literary ghosts, compact rooms, and a location that makes downtown walking feel natural.", officialUrl: "https://www.marltonhotel.com/", bookingUrl: "https://www.marltonhotel.com/rooms/", photo: images.marlton, hours: "Hotel operates 24 hours daily; restaurant and bar hours vary.", price: "$$$", priceSource: "Official booking site / Google Travel", venueKind: "lodging", lodgingType: "hotel", attributeTags: ["design", "romantic", "central", "historic", "quiet"], editorialUrls: ["https://www.cntraveler.com/hotels/new-york/the-marlton-hotel", "https://guide.michelin.com/us/en/hotels-stays/new-york/the-marlton-hotel-5945"] }),
];

export const hostelStops = [
  stop({ id: "nyc-hostel-hi-nyc", name: "HI New York City Hostel", coordinates: [40.798765, -73.966018], description: "HI New York City is a big, hostel near the Upper West Side and subway lines, with dorms, private rooms, common spaces, and enough scale for solo travelers to find people. It is not downtown-cool, but it is useful, social, and close to Central Park.", officialUrl: "https://www.hiusa.org/find-hostels/new-york/new-york-891-amsterdam-ave", bookingUrl: "https://www.hiusa.org/find-hostels/new-york/new-york-891-amsterdam-ave", photo: images.hiNyc, hours: "Official HI USA booking page lists date-specific dorm/private availability, check-in policies, and reception details for this hostel.", price: "$$", priceSource: "Official booking site / Hostelworld", venueKind: "lodging", lodgingType: "hostel", attributeTags: ["budget", "social", "central", "solo_friendly", "family_friendly"], editorialUrls: ["https://www.hostelworld.com/hostels/p/1856/hi-new-york-city-hostel/", "https://hostelgeeks.com/best-hostels-in-new-york-city-usa/"] }),
  stop({ id: "nyc-hostel-local-ny", name: "The Local NY", coordinates: [40.747032, -73.95077], description: "The Local NY gives Queens a social hostel with dorms, private rooms, a bar, workspace energy, and quick subway access to Midtown.", officialUrl: "https://www.thelocalny.com/", bookingUrl: "https://www.thelocalny.com/rooms/", photo: images.localNyc, hours: "Reception/check-in information is posted by the hostel; dorms and private rooms are date-dependent.", price: "$$", priceSource: "Official booking site / Hostelworld", venueKind: "lodging", lodgingType: "hostel", attributeTags: ["budget", "social", "work_friendly", "queens", "private_rooms"], editorialUrls: ["https://www.hostelworld.com/hostels/p/84599/the-local-ny/", "https://hostelgeeks.com/best-hostels-in-new-york-city-usa/"] }),
  stop({ id: "nyc-hostel-q4", name: "Q4 Hotel & Hostel", coordinates: [40.75022, -73.940943], description: "Q4 Hotel & Hostel is a Long Island City budget base with dorms, private rooms, common areas, and subway access into Manhattan and Queens.", officialUrl: "https://q4hotel.com/", bookingUrl: "https://q4hotel.com/rooms/", photo: images.q4, hours: "Hotel/hostel check-in runs daily; dorm and private inventory changes by date.", price: "$$", priceSource: "Official booking site / Hostelworld", venueKind: "lodging", lodgingType: "hostel", attributeTags: ["budget", "queens", "private_rooms", "dorms", "transit_friendly"], editorialUrls: ["https://www.hostelworld.com/hostels/p/78292/q4-hotel-and-hostel/", "https://www.booking.com/hostels/city/us/new-york.html"] }),
  stop({ id: "nyc-hostel-ny-moore", name: "NY Moore Hostel", coordinates: [40.704554, -73.933902], description: "NY Moore Hostel offers dorms, private rooms, and larger common areas in Brooklyn, with access to Bushwick and Williamsburg and less compression than Manhattan properties.", officialUrl: "https://www.nymoorehostel.com/", bookingUrl: "https://www.nymoorehostel.com/rooms/", photo: images.nyMoore, hours: "Reception/check-in runs daily; dorm and private room availability should be verified before booking.", price: "$$", priceSource: "Official booking site / Hostelworld", venueKind: "lodging", lodgingType: "hostel", attributeTags: ["budget", "brooklyn", "social", "private_rooms", "dorms"], editorialUrls: ["https://www.hostelworld.com/hostels/p/59834/ny-moore-hostel/", "https://hostelgeeks.com/best-hostels-in-new-york-city-usa/"] }),
  stop({ id: "nyc-hostel-west-side-ymca", name: "West Side YMCA", coordinates: [40.770826, -73.980451], description: "West Side YMCA is a bare-bones Central Park/Lincoln Center budget base with private-style rooms and shared-facility practicality rather than hostel-party energy.", officialUrl: "https://ymcanyc.org/locations/west-side-ymca/guest-rooms", bookingUrl: "https://ymcanyc.org/locations/west-side-ymca/guest-rooms", photo: images.westSideYmca, hours: "Official YMCA guest-rooms page and booking partners list date-specific room availability, facility access, and check-in policies.", price: "$$", priceSource: "Official booking site / Booking.com", venueKind: "lodging", lodgingType: "hostel", attributeTags: ["budget", "central", "quiet", "private_rooms", "family_friendly"], editorialUrls: ["https://www.booking.com/hostels/city/us/new-york.html", "https://www.google.com/travel/hotels/New%20York%20City?q=West%20Side%20YMCA%20guest%20rooms"] }),
  stop({ id: "nyc-hostel-chelsea-international", name: "Chelsea International Hostel", coordinates: [40.742785, -74.000129], description: "Chelsea International Hostel is a central, no-frills hostel with dorms and private rooms for Manhattan address value over design polish.", officialUrl: "https://www.chelseahostel.com/", bookingUrl: "https://www.chelseahostel.com/", photo: images.chelseaInternational, hours: "Hostel operates daily; dorm and private room inventory changes by date.", price: "$$", priceSource: "Official booking site / Hostelworld", venueKind: "lodging", lodgingType: "hostel", attributeTags: ["budget", "central", "dorms", "private_rooms", "transit_friendly"], editorialUrls: ["https://www.hostelworld.com/hostels/p/801/chelsea-international-hostel/", "https://www.booking.com/hostels/city/us/new-york.html"] }),
  stop({ id: "nyc-hostel-nap-york", name: "Nap York Central Park Sleep Station", coordinates: [40.765092, -73.981919], description: "Nap York is a pod-style Midtown hostel for travelers who prioritize sleep, location, and a lower private-feeling footprint over hostel social life.", officialUrl: "https://napyork.com/", bookingUrl: "https://napyork.com/", photo: images.napYork, hours: "Property operates daily; pod availability and check-in rules are booking-date specific.", price: "$$", priceSource: "Official booking site / Google Travel", venueKind: "lodging", lodgingType: "hostel", attributeTags: ["budget", "central", "quiet", "solo_friendly", "private_rooms"], editorialUrls: ["https://www.booking.com/hostels/city/us/new-york.html", "https://www.google.com/travel/hotels/New%20York%20City?q=Nap%20York%20Central%20Park%20Sleep%20Station"] }),
  stop({ id: "nyc-hostel-east-harlem", name: "East Harlem Hostel", coordinates: [40.797928, -73.941372], description: "East Harlem Hostel is a family-run, no-frills budget stay for a clean uptown base near the 116th Street subway rather than a Midtown price tag.", officialUrl: "https://www.theneighborhoodhostel.com/", bookingUrl: "https://www.theneighborhoodhostel.com/", photo: images.eastHarlemHostel, hours: "Open 24 hours daily; room types and self-check-in details should be verified before booking.", price: "$", priceSource: "Official booking site / Hostelworld / Google Travel", venueKind: "lodging", lodgingType: "hostel", attributeTags: ["budget", "uptown", "private_rooms", "transit_friendly", "no_frills"], editorialUrls: ["https://www.hostelworld.com/hostels/p/323639/east-harlem-hostel/", "https://www.concerthotels.com/hotel/east-harlem-hostel/584577"] }),
  stop({ id: "nyc-hostel-american-dream", name: "American Dream Hostel", coordinates: [40.737113, -73.984344], description: "American Dream Hostel is a calm Gramercy and Flatiron budget property with private rooms and shared baths rather than a party-hostel setup. Room categories, breakfast, and current amenities should be verified at booking.", officialUrl: "https://www.americandreamhostel.com/", bookingUrl: "https://www.americandreamhostel.com/", photo: images.americanDream, hours: "Property operates daily; private room availability and check-in policies are date-specific.", price: "$$", priceSource: "Official booking site / Booking.com", venueKind: "lodging", lodgingType: "hostel", attributeTags: ["budget", "central", "quiet", "private_rooms", "transit_friendly"], editorialUrls: ["https://www.booking.com/hostels/city/us/new-york.html", "https://www.google.com/travel/hotels/New%20York%20City?q=American%20Dream%20Hostel"] }),
  stop({ id: "nyc-hostel-kama-central-park", name: "Kama Central Park Hostel", coordinates: [40.79943, -73.960558], description: "Kama Central Park Hostel is an Upper West Side pod-hostel with enclosed sleep pods, private ensuite rooms, a coffee bar, shared kitchen, rooftop garden, and Central Park access.", officialUrl: "https://www.kamahostel.com/", bookingUrl: "https://hotels.cloudbeds.com/en/reservation/4kVvq7", photo: images.kamaCentralPark, hours: "Open 24 hours daily; pod, dorm, and private-room availability changes by date.", price: "$$", priceSource: "Official booking site / Hostelworld", venueKind: "lodging", lodgingType: "hostel", attributeTags: ["budget", "pods", "private_rooms", "central_park", "uptown"], editorialUrls: ["https://www.hostelworld.com/hostels/p/317612/kama-central-park/", "https://www.kamahostel.com/about-us"] }),
];

export const casualBarStops = [
  stop({ id: "nyc-bar-mcsorleys", name: "McSorley's Old Ale House", coordinates: [40.728735, -73.989727], description: "McSorley's is a sawdust-floor beer institution where the choice is light or dark ale and the room is half the reason to go: loud, historic, unpretentious, and unmistakably East Village.", officialUrl: "https://mcsorleysoldalehouse.nyc/", photo: images.mcsorleys, hours: "Official McSorley's page and Google Maps listing provide day-specific afternoon/evening service hours for the ale house.", price: "$$", priceSource: "Official/menu evidence / Google Maps", venueKind: "nightlife", nightlifeType: "beer_bar", attributeTags: ["historic", "lively", "casual", "beer", "east_village"], editorialUrls: ["https://www.timeout.com/newyork/bars/mcsorleys-old-ale-house", "https://ny.eater.com/maps/classic-bars-nyc"] }),
  stop({ id: "nyc-bar-white-horse", name: "White Horse Tavern", coordinates: [40.735782, -74.006741], description: "White Horse Tavern is a West Village literary pub with Dylan Thomas lore, classic tavern food, and a historic corner-room feel near Hudson Street.", officialUrl: "https://whitehorsetavern1880.com/", photo: images.whiteHorse, hours: "Official site posts daily bar and kitchen hours; verify before going late.", price: "$$", priceSource: "Official menu / Google Maps", venueKind: "nightlife", nightlifeType: "pub", attributeTags: ["historic", "casual", "west_village", "food_available", "lively"], editorialUrls: ["https://ny.eater.com/maps/classic-bars-nyc", "https://www.timeout.com/newyork/bars/white-horse-tavern"] }),
  stop({ id: "nyc-bar-ear-inn", name: "Ear Inn", coordinates: [40.725864, -74.009661], description: "Ear Inn is the far-west downtown bar that feels like the city still has corners you can miss if you only chase lists.", officialUrl: "https://www.earinn.com/", photo: images.earInn, hours: "Official site and map listings show daily service with kitchen/bar hours; verify same-day schedule.", price: "$$", priceSource: "Official menu / Google Maps", venueKind: "nightlife", nightlifeType: "pub", attributeTags: ["historic", "casual", "food_available", "west_side", "lively"], editorialUrls: ["https://ny.eater.com/maps/classic-bars-nyc", "https://www.timeout.com/newyork/bars/ear-inn"] }),
  stop({ id: "nyc-bar-petes-tavern", name: "Pete's Tavern", coordinates: [40.736816, -73.986772], description: "Pete's Tavern is a Gramercy classic combining an old bar, Italian-American comfort food, O. Henry lore, and an easy pint near Union Square. It serves a dependable pub-style meal without hotel-lounge polish.", officialUrl: "https://www.petestavern.com/", photo: images.petesTavern, hours: "Official site posts daily bar and dining hours; verify holiday hours.", price: "$$", priceSource: "Official menu / Google Maps", venueKind: "nightlife", nightlifeType: "pub", attributeTags: ["historic", "casual", "food_available", "gramercy", "group_friendly"], editorialUrls: ["https://ny.eater.com/maps/classic-bars-nyc", "https://www.timeout.com/newyork/bars/petes-tavern"] }),
  stop({ id: "nyc-bar-julius", name: "Julius'", coordinates: [40.73345, -74.002987], description: "Julius' is one of New York's essential queer bars, known for the 1966 Sip-In, burgers, beer, and a West Village room that still feels casual and lived-in.", officialUrl: "https://juliusbarny.com/", photo: images.julius, hours: "Official Julius' site and Google Maps listing provide current daily bar hours and event/service updates.", price: "$$", priceSource: "Official/menu evidence / Google Maps", venueKind: "nightlife", nightlifeType: "dive_bar", attributeTags: ["lgbtq", "historic", "casual", "west_village", "food_available"], editorialUrls: ["https://www.nyclgbtsites.org/site/julius-bar/", "https://www.timeout.com/newyork/bars/julius"] }),
  stop({ id: "nyc-bar-stonewall", name: "The Stonewall Inn", coordinates: [40.733824, -74.002164], description: "The Stonewall Inn is both a working LGBTQ+ bar and the landmark tied to the 1969 uprising, with drag, karaoke, DJs, and Christopher Park next door. Its history and current bar programming remain inseparable.", officialUrl: "https://thestonewallinnnyc.com/", photo: images.stonewall, hours: "Official site posts bar/event hours; verify current schedule before going.", price: "$$", priceSource: "Official/event listings / Google Maps", venueKind: "nightlife", nightlifeType: "pub", musicGenres: ["dj", "drag", "karaoke"], attributeTags: ["lgbtq", "historic", "events", "west_village", "lively"], editorialUrls: ["https://www.nyclgbtsites.org/site/stonewall-inn-christopher-park/", "https://www.nps.gov/places/stonewall-inn.htm"] }),
  stop({ id: "nyc-bar-sunnys", name: "Sunny's Bar", coordinates: [40.675337, -74.016076], description: "Sunny's is a deeply rooted Red Hook bar with live folk and Americana, neighborhood loyalty, and waterfront oddness that feels nothing like a downtown copy.", officialUrl: "https://www.sunnysredhook.com/", photo: images.sunnys, hours: "Official site posts bar and event hours; verify before making the Red Hook trip.", price: "$$", priceSource: "Official/event listings / Google Maps", venueKind: "nightlife", nightlifeType: "dive_bar", musicGenres: ["folk", "americana", "live_music"], attributeTags: ["live_music", "brooklyn", "casual", "lively", "neighborhood"], editorialUrls: ["https://ny.eater.com/maps/classic-bars-nyc", "https://www.timeout.com/newyork/bars/sunnys"] }),
  stop({ id: "nyc-bar-fraunces", name: "Fraunces Tavern", coordinates: [40.703399, -74.011356], description: "Fraunces Tavern is a Lower Manhattan historic complex with multiple dining and drinking rooms, from the Porterhouse Bar to the Hideout and museum upstairs.", officialUrl: "https://www.frauncestavern.com/", photo: images.fraunces, hours: "Official site posts restaurant, bar, and museum hours separately; verify the room you want.", price: "$$", priceSource: "Official menu / Google Maps", venueKind: "nightlife", nightlifeType: "pub", attributeTags: ["historic", "food_available", "fidi", "group_friendly", "casual"], editorialUrls: ["https://ny.eater.com/maps/classic-bars-nyc", "https://www.nyctourism.com/restaurants/fraunces-tavern/"] }),
  stop({ id: "nyc-bar-old-town", name: "Old Town Bar", coordinates: [40.737499, -73.989455], description: "Old Town Bar is a Flatiron/Union Square classic with high ceilings, old fixtures, burgers, pints, and lively weekday crowd energy without club volume.", officialUrl: "https://www.oldtownbar.com/", photo: images.oldTownBar, hours: "Official site posts bar and kitchen hours by day; verify before going late.", price: "$$", priceSource: "Official menu / Google Maps", venueKind: "nightlife", nightlifeType: "pub", attributeTags: ["historic", "casual", "food_available", "central", "after_work"], editorialUrls: ["https://ny.eater.com/maps/classic-bars-nyc", "https://www.timeout.com/newyork/bars/old-town-bar"] }),
  stop({ id: "nyc-bar-rudys", name: "Rudy's Bar & Grill", coordinates: [40.759681, -73.991905], description: "Rudy's counters expensive Midtown drinking with cheap beer, red booths, a pig mascot, and its famous free-hot-dog tradition.", officialUrl: "https://rudysbarnyc.com/", photo: images.rudys, hours: "Official Rudy's site and Google Maps listing provide daily bar hours and late-night service windows for Hell's Kitchen.", price: "$", priceSource: "Official/menu evidence / Google Maps", venueKind: "nightlife", nightlifeType: "dive_bar", attributeTags: ["budget", "casual", "late_night", "theater_district", "lively"], editorialUrls: ["https://www.timeout.com/newyork/bars/rudys-bar-grill", "https://www.theinfatuation.com/new-york/reviews/rudys-bar-grill"] }),
];

export const cocktailStops = [
  stop({ id: "nyc-cocktail-bemelmans", name: "Bemelmans Bar", coordinates: [40.774415, -73.963301], description: "Bemelmans is The Carlyle's cocktail room, distinguished by Ludwig Bemelmans murals, piano and jazz performances, formal service, and Upper East Side theater. Covers, minimums, and dress guidance apply at certain times.", officialUrl: "https://www.rosewoodhotels.com/en/the-carlyle-new-york/dining/bemelmans-bar", photo: images.bemelmans, hours: "Official site posts bar hours, entertainment schedules, covers, and dress guidance; verify before going.", price: "$$$$", priceSource: "Official bar page / menu", venueKind: "nightlife", nightlifeType: "cocktail_bar", musicGenres: ["piano", "jazz"], attributeTags: ["luxury", "romantic", "live_music", "hotel_bar", "reservation_recommended"], editorialUrls: ["https://www.timeout.com/newyork/bars/bemelmans-bar", "https://www.theinfatuation.com/new-york/reviews/bemelmans-bar"] }),
  stop({ id: "nyc-cocktail-dead-rabbit", name: "The Dead Rabbit", coordinates: [40.703303, -74.011165], description: "The Dead Rabbit gives FiDi both a casual Irish pub side and a more composed cocktail room upstairs, with food, whiskey, and enough energy for a planned Lower Manhattan night. It is one of the city's clearest crossover spots between pub culture and serious drinks.", officialUrl: "https://thedeadrabbit.com/", photo: images.deadRabbit, hours: "Official site posts bar, kitchen, and event hours; verify same-day schedule.", price: "$$$", priceSource: "Official menu / Google Maps", venueKind: "nightlife", nightlifeType: "cocktail_bar", attributeTags: ["cocktails", "fidi", "food_available", "lively", "award_winning"], editorialUrls: ["https://ny.eater.com/maps/best-cocktail-bars-nyc", "https://www.worlds50bestbars.com/the-list/the-dead-rabbit.html"] }),
  stop({ id: "nyc-cocktail-employees-only", name: "Employees Only", coordinates: [40.733454, -74.006117], description: "Employees Only is a West Village cocktail institution where the speakeasy idea still has enough hospitality and speed to work. Go for a late drink, a bar seat if you can get one, and the old-school downtown buzz; reservations help when the night is tight.", officialUrl: "https://www.employeesonlynyc.com/", photo: images.employeesOnly, hours: "Official site posts nightly bar and kitchen hours; verify late-night service and reservations.", price: "$$$", priceSource: "Official menu / Google Maps", venueKind: "nightlife", nightlifeType: "cocktail_bar", attributeTags: ["cocktails", "late_night", "west_village", "reservation_recommended", "lively"], editorialUrls: ["https://ny.eater.com/maps/best-cocktail-bars-nyc", "https://www.theworlds50best.com/discovery/Establishments/US/New-York/Employees-Only.html"] }),
  stop({ id: "nyc-cocktail-pdt", name: "Please Don't Tell", coordinates: [40.727124, -73.983758], description: "Please Don't Tell hides a small cocktail room behind a phone booth inside Crif Dogs, pairing serious drinks with hot dogs from next door. Reservations and compact party sizes matter in the narrow East Village space.", officialUrl: "https://pdtnyc.com/", photo: images.pdt, hours: "Official reservation page posts nightly availability; check same-day booking windows and hours.", price: "$$$", priceSource: "Official/reservation menu evidence", venueKind: "nightlife", nightlifeType: "cocktail_bar", attributeTags: ["speakeasy", "reservation_recommended", "east_village", "cocktails", "date_night"], editorialUrls: ["https://ny.eater.com/maps/best-cocktail-bars-nyc", "https://www.timeout.com/newyork/bars/please-dont-tell"] }),
  stop({ id: "nyc-cocktail-attaboy", name: "Attaboy", coordinates: [40.718913, -73.991306], description: "Attaboy has no printed menu; the bartender builds each cocktail from a conversation about spirits, flavors, and mood. The Lower East Side room is tiny, so patience and a party of one or two produce the best version of it.", officialUrl: "https://www.attaboy.us/nyc", photo: images.attaboy, hours: "Official site posts nightly walk-in/reservation guidance and hours; verify before going.", price: "$$$", priceSource: "Official site / Google Maps", venueKind: "nightlife", nightlifeType: "cocktail_bar", attributeTags: ["cocktails", "small_room", "date_night", "lower_east_side", "award_winning"], editorialUrls: ["https://ny.eater.com/maps/best-cocktail-bars-nyc", "https://www.worlds50bestbars.com/the-list/attaboy.html"] }),
  stop({ id: "nyc-cocktail-clover-club", name: "Clover Club", coordinates: [40.68432, -73.993982], description: "Clover Club gives Brooklyn a polished cocktail room with booths, a strong food menu, brunch, and a Cobble Hill pace that works well for dates or small groups. It is grown-up without feeling stiff, which helps balance the Manhattan-heavy cocktail list.", officialUrl: "https://www.cloverclubny.com/", photo: images.cloverClub, hours: "Official site posts dinner, brunch, and bar hours; reservations recommended.", price: "$$$", priceSource: "Official menu / Google Maps", venueKind: "nightlife", nightlifeType: "cocktail_bar", attributeTags: ["brooklyn", "romantic", "food_available", "reservation_recommended", "cocktails"], editorialUrls: ["https://ny.eater.com/maps/best-cocktail-bars-nyc", "https://www.timeout.com/newyork/bars/clover-club"] }),
  stop({ id: "nyc-cocktail-dante", name: "Dante", coordinates: [40.728774, -74.001839], description: "Dante is the Greenwich Village aperitivo bar for negronis, spritzes, Martinis, and Italian-leaning food in a room that works from afternoon into evening. It is a strong cocktail bar when the night should begin with a drink rather than end with one.", officialUrl: "https://www.dante-nyc.com/", photo: images.dante, hours: "Official site posts daily cafe/bar hours by location; verify the MacDougal Street schedule.", price: "$$$", priceSource: "Official menu / Google Maps", venueKind: "nightlife", nightlifeType: "cocktail_bar", attributeTags: ["aperitivo", "reservation_recommended", "west_village", "cocktails", "food_available"], editorialUrls: ["https://ny.eater.com/maps/best-cocktail-bars-nyc", "https://www.worlds50bestbars.com/the-list/dante.html"] }),
  stop({ id: "nyc-cocktail-death-co", name: "Death & Co", coordinates: [40.725821, -73.984476], description: "Death & Co is a dark, intimate East Village cocktail bar known for balanced drinks, a detailed menu, and attentive service. Reservations or early arrival suit the small room better than a large group.", officialUrl: "https://www.deathandcompany.com/location/death-co-new-york/", photo: images.deathCo, hours: "Official site posts nightly service hours and reservation guidance; verify before going.", price: "$$$", priceSource: "Official menu / Google Maps", venueKind: "nightlife", nightlifeType: "cocktail_bar", attributeTags: ["cocktails", "date_night", "east_village", "reservation_recommended", "quiet"], editorialUrls: ["https://ny.eater.com/maps/best-cocktail-bars-nyc", "https://www.timeout.com/newyork/bars/death-company"] }),
  stop({ id: "nyc-cocktail-angels-share", name: "Angel's Share", coordinates: [40.731438, -73.988343], description: "Angel's Share is a Japanese-influenced cocktail room built around precise drinks, restrained service, and quiet focus rather than spectacle.", officialUrl: "https://www.angelssharenyc.com/", photo: images.angelShare, hours: "Official site posts current hours and reservation guidance; verify before going.", price: "$$$", priceSource: "Official menu / Google Maps", venueKind: "nightlife", nightlifeType: "cocktail_bar", attributeTags: ["cocktails", "quiet", "date_night", "reservation_recommended", "japanese_influence"], editorialUrls: ["https://ny.eater.com/maps/best-cocktail-bars-nyc", "https://www.timeout.com/newyork/bars/angels-share"] }),
  stop({ id: "nyc-cocktail-king-cole", name: "King Cole Bar", coordinates: [40.761521, -73.974284], description: "King Cole Bar is the Midtown hotel-bar classic where the Maxfield Parrish mural, martinis, and Red Snapper lore do the heavy lifting.", officialUrl: "https://www.marriott.com/en-us/hotels/nycxr-the-st-regis-new-york/dining/", photo: images.kingCole, hours: "Official St. Regis dining page lists current King Cole Bar service hours, dress guidance, and holiday schedule changes.", price: "$$$$", priceSource: "Official hotel dining page / Google Maps", venueKind: "nightlife", nightlifeType: "cocktail_bar", attributeTags: ["hotel_bar", "historic", "midtown", "luxury", "cocktails"], editorialUrls: ["https://www.timeout.com/newyork/bars/king-cole-bar", "https://www.theinfatuation.com/new-york/reviews/king-cole-bar"] }),
];

const cultureStops = [
  stop({ id: "nyc-culture-met", name: "The Metropolitan Museum of Art", coordinates: [40.779437, -73.963244], description: "The Met is New York's major encyclopedic museum, spanning ancient art, European paintings, American rooms, fashion, arms and armor, and major temporary exhibitions beside Central Park. It is a single museum for a first culture pass.", officialUrl: "https://www.metmuseum.org/", photo: images.met, hours: "Official site posts museum hours, closed days, and exhibition-specific ticketing; verify before visiting.", venueKind: "culture", subcategory: "museum", attributeTags: ["museum", "art", "classic", "upper_east_side", "family_friendly"], editorialUrls: ["https://www.nyctourism.com/museums-galleries/the-metropolitan-museum-of-art/", "https://www.timeout.com/newyork/museums/metropolitan-museum-of-art"] }),
  stop({ id: "nyc-culture-moma", name: "Museum of Modern Art", coordinates: [40.761433, -73.977622], description: "MoMA is a Midtown modern-art museum where the greatest hits are real but the crowds can flatten the experience if you drift.", officialUrl: "https://www.moma.org/", photo: images.moma, hours: "Official site posts daily hours, member hours, and ticketing notes; verify before visiting.", venueKind: "culture", subcategory: "museum", attributeTags: ["museum", "modern_art", "midtown", "indoor", "family_friendly"], editorialUrls: ["https://www.nyctourism.com/museums-galleries/museum-of-modern-art-moma/", "https://www.timeout.com/newyork/museums/museum-of-modern-art-moma"] }),
  stop({ id: "nyc-culture-whitney", name: "Whitney Museum of American Art", coordinates: [40.739609, -74.008861], description: "The Whitney focuses on American art and connects its galleries to the city through terraces overlooking the Meatpacking District and High Line.", officialUrl: "https://whitney.org/", photo: images.whitney, hours: "Official site posts museum hours, late nights, and ticketing notes; verify current schedule.", venueKind: "culture", subcategory: "museum", attributeTags: ["museum", "american_art", "scenic", "west_side", "indoor"], editorialUrls: ["https://www.nyctourism.com/museums-galleries/whitney-museum-of-american-art/", "https://www.timeout.com/newyork/museums/whitney-museum-of-american-art"] }),
  stop({ id: "nyc-culture-tenement", name: "Tenement Museum", coordinates: [40.718793, -73.99007], description: "The Tenement Museum interprets immigration, housing, labor, and Lower East Side history through preserved apartments and themed guided stories. Visits require a scheduled tour, so the topic and ticket time should be chosen in advance.", officialUrl: "https://www.tenement.org/", photo: images.tenement, hours: "Official site posts tour schedules and ticket availability; advance booking recommended.", venueKind: "culture", subcategory: "history_museum", attributeTags: ["history", "guided_tour", "lower_east_side", "reservation_recommended", "indoor"], editorialUrls: ["https://www.nyctourism.com/museums-galleries/tenement-museum/", "https://www.timeout.com/newyork/museums/tenement-museum"] }),
  stop({ id: "nyc-culture-studio-museum", name: "The Studio Museum in Harlem", coordinates: [40.808163, -73.944856], description: "The Studio Museum is Harlem's key institution for artists of African descent, with exhibitions, public programs, and a new 125th Street building shaping its next chapter. Its focus reaches well beyond the neighborhood's performance venues.", officialUrl: "https://studiomuseum.org/", photo: images.studioMuseum, hours: "Official Studio Museum calendar and visitor-information pages list public programs, exhibition access, and opening details during the new-building period.", venueKind: "culture", subcategory: "museum", attributeTags: ["museum", "black_art", "harlem", "programming", "indoor"], editorialUrls: ["https://www.nyctourism.com/museums-galleries/studio-museum-in-harlem/", "https://www.timeout.com/newyork/museums/the-studio-museum-in-harlem"] }),
  stop({ id: "nyc-culture-brooklyn-museum", name: "Brooklyn Museum", coordinates: [40.671206, -73.963631], description: "Brooklyn Museum holds major Egyptian, American, African, Asian, and feminist art collections alongside ambitious temporary exhibitions and First Saturday programming. Its position beside Prospect Park and the Botanic Garden rewards a real half-day in Brooklyn.", officialUrl: "https://www.brooklynmuseum.org/", photo: images.brooklynMuseum, hours: "Official site posts museum hours, first Saturdays, and ticketed exhibition details; verify before visiting.", venueKind: "culture", subcategory: "museum", attributeTags: ["museum", "brooklyn", "art", "family_friendly", "indoor"], editorialUrls: ["https://www.nyctourism.com/museums-galleries/brooklyn-museum/", "https://www.timeout.com/newyork/museums/brooklyn-museum"] }),
  stop({ id: "nyc-culture-lincoln-center", name: "Lincoln Center", coordinates: [40.772464, -73.983489], description: "Lincoln Center is a major performing-arts campus for opera, classical music, theater, dance, film, and outdoor programming across distinct halls and companies. Tickets and schedules define the experience beyond the public plaza.", officialUrl: "https://www.lincolncenter.org/", photo: images.lincolnCenter, hours: "Campus is publicly accessible, while performances, box offices, tours, and restaurants keep separate schedules.", venueKind: "culture", subcategory: "performing_arts", attributeTags: ["performing_arts", "music", "dance", "upper_west_side", "tickets_required"], editorialUrls: ["https://www.nyctourism.com/venues/lincoln-center-for-the-performing-arts/", "https://www.nyc-arts.org/organizations/lincoln-center-for-the-performing-arts/"] }),
  stop({ id: "nyc-culture-apollo", name: "Apollo Theater", coordinates: [40.810033, -73.950057], description: "Apollo Theater's Amateur Night, music, comedy, dance, and community programs carry Harlem performance history into a working venue. The building is not a daytime museum; choose a show or tour from the official calendar.", officialUrl: "https://www.apollotheater.org/", photo: images.apollo, hours: "Performances, tours, and box-office access follow the official Apollo event calendar; each ticket page lists doors and show time.", venueKind: "culture", subcategory: "theater", attributeTags: ["performing_arts", "harlem", "music", "historic", "tickets_required"], editorialUrls: ["https://www.nyctourism.com/venues/apollo-theater/", "https://www.timeout.com/newyork/music/apollo-theater"] }),
  stop({ id: "nyc-culture-noguchi", name: "The Noguchi Museum", coordinates: [40.766778, -73.938087], description: "The Noguchi Museum is the quiet Queens counterweight to Manhattan's blockbuster rooms: sculpture, garden space, and a slower encounter with one artist's world. It is best paired with Socrates Sculpture Park or Astoria plans; check hours because the trip is intentional.", officialUrl: "https://www.noguchi.org/", photo: images.noguchi, hours: "Official site posts museum hours, garden access, and ticketing notes; verify before visiting.", venueKind: "culture", subcategory: "museum", attributeTags: ["museum", "sculpture", "quiet", "queens", "garden"], editorialUrls: ["https://www.nyctourism.com/museums-galleries/the-noguchi-museum/", "https://www.timeout.com/newyork/museums/noguchi-museum"] }),
  stop({ id: "nyc-culture-moving-image", name: "Museum of the Moving Image", coordinates: [40.756345, -73.92395], description: "Museum of the Moving Image examines film, television, games, and production craft through exhibitions, artifacts, and screenings in Astoria. The hands-on displays suit mixed-age groups, while the program calendar rewards advance checking.", officialUrl: "https://movingimage.org/", photo: images.movingImage, hours: "Official site posts museum hours, screenings, and event schedules; verify before visiting.", venueKind: "culture", subcategory: "museum", attributeTags: ["museum", "film", "family_friendly", "queens", "interactive"], editorialUrls: ["https://www.nyctourism.com/museums-galleries/museum-of-the-moving-image/", "https://www.timeout.com/newyork/museums/museum-of-the-moving-image"] }),
];

const activityStops = [
  stop({ id: "nyc-activity-statue-liberty", name: "Statue of Liberty", coordinates: [40.689249, -74.0445], description: "Book official tickets, understand security and timing, and choose pedestal/crown access only if the logistics fit the day.", officialUrl: "https://www.nps.gov/stli/index.htm", bookingUrl: "https://www.cityexperiences.com/new-york/city-cruises/statue/", photo: images.statueLiberty, hours: "National Park Service and official ferry schedules vary by season, weather, and ticket type; verify before visiting.", venueKind: "landmark", subcategory: "national_monument", attributeTags: ["landmark", "harbor", "tickets_required", "family_friendly", "scenic"], editorialUrls: ["https://www.nyctourism.com/attractions-tours/statue-of-liberty/", "https://www.lonelyplanet.com/articles/top-things-to-do-in-new-york-city"] }),
  stop({ id: "nyc-activity-ellis-island", name: "Ellis Island National Museum of Immigration", coordinates: [40.699475, -74.039559], description: "Ellis Island is a companion museum that gives the harbor trip emotional weight beyond the skyline.", officialUrl: "https://www.nps.gov/elis/index.htm", bookingUrl: "https://www.cityexperiences.com/new-york/city-cruises/statue/", photo: images.ellisIsland, hours: "National Park Service and official ferry schedules vary by season, weather, and ticket type; verify before visiting.", venueKind: "culture", subcategory: "museum", attributeTags: ["history", "harbor", "tickets_required", "family_friendly", "museum"], editorialUrls: ["https://www.nyctourism.com/museums-galleries/ellis-island-national-museum-of-immigration/", "https://www.nps.gov/elis/planyourvisit/hours.htm"] }),
  stop({ id: "nyc-activity-central-park", name: "Central Park", coordinates: [40.782865, -73.965355], description: "Central Park is not one stop so much as the city breathing between neighborhoods, museums, hotels, and long walks. Pick a zone: Bethesda and the Mall for classics, the Ramble for wandering, or the north end for fewer people and more texture.", officialUrl: "https://www.centralparknyc.org/", photo: images.centralPark, hours: "Park open daily 6:00 AM-1:00 AM; attractions, restrooms, and concessions keep separate schedules.", venueKind: "outdoors", subcategory: "park", attributeTags: ["park", "free_entry", "scenic", "family_friendly", "walking"], editorialUrls: ["https://www.nyctourism.com/attractions-tours/central-park/", "https://www.timeout.com/newyork/things-to-do/central-park-guide"] }),
  stop({ id: "nyc-activity-high-line", name: "The High Line", coordinates: [40.747993, -74.004765], description: "The High Line turns an elevated west-side rail line into a linear park of planting, public art, architecture, and city views. Midday crowds can be dense; early and shoulder hours leave more room to notice the landscape.", officialUrl: "https://www.thehighline.org/", photo: images.highLine, hours: "Official site posts seasonal park hours and temporary closure notices; verify before visiting.", venueKind: "outdoors", subcategory: "elevated_park", attributeTags: ["park", "free_entry", "walking", "west_side", "scenic"], editorialUrls: ["https://www.nyctourism.com/attractions-tours/the-high-line/", "https://www.timeout.com/newyork/parks/high-line"] }),
  stop({ id: "nyc-activity-brooklyn-bridge", name: "Brooklyn Bridge", coordinates: [40.706086, -73.996864], description: "The Brooklyn Bridge pedestrian walk delivers harbor views, skyline, Gothic stonework, and a clear sense of the East River's scale. Early or late hours reduce crowd and summer-heat pressure; walking toward Manhattan produces the classic skyline reveal.", officialUrl: "https://www.nyc.gov/html/dot/html/infrastructure/brooklyn-bridge.shtml", photo: images.brooklynBridge, hours: "Pedestrian path open daily; weather, construction, and crowd conditions vary.", venueKind: "landmark", subcategory: "bridge_walk", attributeTags: ["free_entry", "walking", "scenic", "landmark", "brooklyn"], editorialUrls: ["https://www.nyctourism.com/attractions-tours/brooklyn-bridge/", "https://www.lonelyplanet.com/articles/top-things-to-do-in-new-york-city"] }),
  stop({ id: "nyc-activity-grand-central", name: "Grand Central Terminal", coordinates: [40.752726, -73.977229], description: "Grand Central is the indoor landmark that works even on a bad-weather day: celestial ceiling, ramps, Oyster Bar, whispering gallery, and trains doing actual city work around you. Visit outside peak commute if you want to look up without becoming an obstacle.", officialUrl: "https://www.grandcentralterminal.com/", photo: images.grandCentral, hours: "Terminal open daily with posted building hours; shops, dining, tours, and transit keep separate schedules.", venueKind: "transport", subcategory: "terminal", attributeTags: ["landmark", "architecture", "free_entry", "midtown", "indoor"], editorialUrls: ["https://www.nyctourism.com/attractions-tours/grand-central-terminal/", "https://www.timeout.com/newyork/attractions/grand-central-terminal"] }),
  stop({ id: "nyc-activity-staten-island-ferry", name: "Staten Island Ferry", coordinates: [40.701034, -74.013177], description: "The Staten Island Ferry provides free harbor transit with skyline views and clear Statue of Liberty angles without pretending to be a guided cruise. Service runs around the clock, with frequency changing by time of day.", officialUrl: "https://www.nyc.gov/html/dot/html/ferrybus/staten-island-ferry.shtml", photo: images.ferry, hours: "Ferry operates 24 hours daily, with frequency varying by time of day; verify official schedule before riding.", venueKind: "transport", subcategory: "ferry", attributeTags: ["free_entry", "scenic", "harbor", "family_friendly", "transport"], editorialUrls: ["https://www.nyctourism.com/attractions-tours/staten-island-ferry/", "https://www.lonelyplanet.com/articles/top-things-to-do-in-new-york-city"] }),
  stop({ id: "nyc-activity-prospect-park", name: "Prospect Park", coordinates: [40.660204, -73.968956], description: "Prospect Park gives Brooklyn broad lawns, wooded paths, water, and the long open sweep of the Long Meadow. The park also sits near Brooklyn Museum, the Botanic Garden, and Park Slope.", officialUrl: "https://www.prospectpark.org/", photo: images.prospectPark, hours: "Park open daily 5:00 AM-1:00 AM; attractions and facilities keep separate schedules.", venueKind: "outdoors", subcategory: "park", attributeTags: ["park", "brooklyn", "free_entry", "family_friendly", "walking"], editorialUrls: ["https://www.nyctourism.com/attractions-tours/prospect-park/", "https://www.timeout.com/newyork/parks/prospect-park"] }),
  stop({ id: "nyc-activity-yankee-stadium", name: "Yankee Stadium", coordinates: [40.829643, -73.926175], description: "Yankee Stadium turns a baseball game into a full Bronx event, with Monument Park, pregame food, and generations of team history built into the ballpark. Check the schedule and gate times; the experience depends entirely on the game-day calendar.", officialUrl: "https://www.mlb.com/yankees/ballpark", bookingUrl: "https://www.mlb.com/yankees/tickets", photo: images.yankeeStadium, hours: "On Yankees home-game days, all gates open 90 minutes before the scheduled first pitch. Game times and dated tour sessions follow the official 2026 season and public-tour calendars.", venueKind: "event_venue", subcategory: "stadium", attributeTags: ["sports", "bronx", "tickets_required", "family_friendly", "evening"], editorialUrls: ["https://www.nyctourism.com/venues/yankee-stadium/", "https://www.mlb.com/yankees/schedule"] }),
  stop({ id: "nyc-activity-met", name: "The Metropolitan Museum of Art", coordinates: [40.779437, -73.963244], description: "The Met holds more than 5,000 years of art across an encyclopedic collection whose scale can absorb an entire day. Choose several departments or a temporary exhibition rather than attempting the whole building at once.", officialUrl: "https://www.metmuseum.org/", photo: images.met, hours: "Official site posts museum hours, closed days, and exhibition-specific ticketing; verify before visiting.", venueKind: "culture", subcategory: "museum", attributeTags: ["museum", "art", "classic", "tickets_required", "upper_east_side"], editorialUrls: ["https://www.nyctourism.com/museums-galleries/the-metropolitan-museum-of-art/", "https://www.timeout.com/newyork/museums/metropolitan-museum-of-art"] }),
];

const brooklynBoroughStops = [
  activityStops.find((item) => item.id === "nyc-activity-brooklyn-bridge")!,
  activityStops.find((item) => item.id === "nyc-activity-prospect-park")!,
  cultureStops.find((item) => item.id === "nyc-culture-brooklyn-museum")!,
  stop({ id: "nyc-brooklyn-botanic-garden", name: "Brooklyn Botanic Garden", coordinates: [40.668897, -73.962501], description: "Brooklyn Botanic Garden concentrates Japanese hill-and-pond design, a celebrated cherry collection, native flora, conservatories, and seasonal borders beside Prospect Park. Pairing it with the Brooklyn Museum works because the entrances are close, but the garden deserves unhurried time of its own.", officialUrl: "https://www.bbg.org/", photo: images.brooklynBotanic, hours: "Summer hours: Tuesday and Thursday 10:00 AM-8:30 PM; Wednesday and Friday-Sunday 10:00 AM-6:00 PM; Monday closed.", venueKind: "outdoors", subcategory: "botanical_garden", attributeTags: ["garden", "brooklyn", "family_friendly", "seasonal", "walking"], editorialUrls: ["https://en.wikipedia.org/wiki/Brooklyn_Botanic_Garden", "https://www.nyctourism.com/boroughs-neighborhoods/brooklyn/"] }),
  stop({ id: "nyc-brooklyn-bridge-park", name: "Brooklyn Bridge Park", coordinates: [40.700291, -73.996699], description: "Brooklyn Bridge Park turns 85 acres of former industrial waterfront into piers, lawns, playgrounds, sports courts, restored habitats, and close views of Lower Manhattan. The park is a better harbor pause than a single photo stop, especially around Pier 1 and the Emily Roebling Plaza connection.", officialUrl: "https://brooklynbridgepark.org/", photo: images.brooklynBridgePark, hours: "Park open daily 6:00 AM-1:00 AM; piers, courts, concessions, and programming keep separate schedules.", venueKind: "outdoors", subcategory: "waterfront_park", attributeTags: ["park", "waterfront", "free_entry", "family_friendly", "scenic"], editorialUrls: ["https://en.wikipedia.org/wiki/Brooklyn_Bridge_Park", "https://www.nyctourism.com/boroughs-neighborhoods/brooklyn/"] }),
  stop({ id: "nyc-brooklyn-new-york-aquarium", name: "New York Aquarium", coordinates: [40.574324, -73.974073], description: "The New York Aquarium anchors the Coney Island boardwalk with sharks, sea lions, marine conservation exhibits, and Ocean Wonders: Sharks! Its far-south location makes sense as part of a Coney Island day rather than an isolated cross-borough museum trip.", officialUrl: "https://nyaquarium.com/", bookingUrl: "https://nyaquarium.com/shop/ticket-options", photo: images.newYorkAquarium, hours: "May 23-September 7 daily entry 10:00 AM-5:00 PM with exhibits closing 6:00 PM; the official seasonal calendar lists later autumn and winter hours.", venueKind: "culture", subcategory: "aquarium", attributeTags: ["aquarium", "brooklyn", "family_friendly", "tickets_required", "coney_island"], editorialUrls: ["https://en.wikipedia.org/wiki/New_York_Aquarium", "https://www.nyctourism.com/boroughs-neighborhoods/brooklyn/"] }),
  stop({ id: "nyc-brooklyn-green-wood", name: "The Green-Wood Cemetery", coordinates: [40.652197, -73.990225], description: "Green-Wood combines a National Historic Landmark landscape, glacial hills, mature trees, ornate monuments, and wide harbor views across 478 acres. It rewards respectful walking for architecture and New York history; tours add context about residents ranging from artists to civic figures.", officialUrl: "https://www.green-wood.com/visit/", photo: images.greenWood, hours: "Grounds open daily 7:00 AM-7:00 PM; scheduled tours and special access follow the official event calendar.", venueKind: "outdoors", subcategory: "historic_cemetery", attributeTags: ["history", "architecture", "walking", "quiet", "brooklyn"], editorialUrls: ["https://en.wikipedia.org/wiki/Green-Wood_Cemetery", "https://www.nyctourism.com/boroughs-neighborhoods/brooklyn/"] }),
  stop({ id: "nyc-brooklyn-domino-park", name: "Domino Park", coordinates: [40.715003, -73.96716], description: "Domino Park preserves gantry cranes, syrup tanks, and other elements from the former Domino Sugar Refinery within a compact Williamsburg waterfront park. The elevated walkway clarifies the industrial site while the lawn, fountains, and river edge make it useful beyond its design story.", officialUrl: "https://www.dominopark.com/plan-your-visit", photo: images.dominoPark, hours: "Open daily 6:00 AM-11:00 PM; fountain and programmed activity schedules are posted seasonally.", venueKind: "outdoors", subcategory: "waterfront_park", attributeTags: ["park", "industrial_history", "waterfront", "free_entry", "williamsburg"], editorialUrls: ["https://en.wikipedia.org/wiki/Domino_Park", "https://www.nyctourism.com/boroughs-neighborhoods/brooklyn/"] }),
  stop({ id: "nyc-brooklyn-childrens-museum", name: "Brooklyn Children's Museum", coordinates: [40.674394, -73.944146], description: "Brooklyn Children's Museum, founded in 1899, builds its strongest visits around hands-on science, culture, sensory play, and the indoor streetscape of World Brooklyn. It is explicitly designed for children and caregivers, making it a more honest family recommendation than a general museum with a small kids program.", officialUrl: "https://www.brooklynkids.org/visit/", photo: images.brooklynChildren, hours: "Wednesday-Sunday 10:00 AM-5:00 PM; Monday-Tuesday closed. Free Thursday afternoon admission uses timed entry.", venueKind: "culture", subcategory: "childrens_museum", attributeTags: ["museum", "family_friendly", "interactive", "indoor", "brooklyn"], editorialUrls: ["https://en.wikipedia.org/wiki/Brooklyn_Children%27s_Museum", "https://www.nyctourism.com/boroughs-neighborhoods/brooklyn/"] }),
  stop({ id: "nyc-brooklyn-heights-promenade", name: "Brooklyn Heights Promenade", coordinates: [40.698111, -73.996813], description: "The Brooklyn Heights Promenade is a cantilevered esplanade above the Brooklyn-Queens Expressway with an unusually direct panorama of the harbor, Lower Manhattan, and Brooklyn Bridge. Its short length works best as a neighborhood connector through Brooklyn Heights rather than a stand-alone excursion.", officialUrl: "https://www.nycgovparks.org/parks/brooklyn-heights-promenade", photo: images.brooklynPromenade, hours: "Open daily 6:00 AM-1:00 AM; maintenance and severe-weather restrictions are posted by NYC Parks.", venueKind: "outdoors", subcategory: "promenade", attributeTags: ["viewpoint", "free_entry", "walking", "architecture", "brooklyn_heights"], editorialUrls: ["https://en.wikipedia.org/wiki/Brooklyn_Heights_Promenade", "https://www.nyctourism.com/boroughs-neighborhoods/brooklyn/"] }),
];

const queensBoroughStops = [
  cultureStops.find((item) => item.id === "nyc-culture-noguchi")!,
  cultureStops.find((item) => item.id === "nyc-culture-moving-image")!,
  stop({ id: "nyc-queens-moma-ps1", name: "MoMA PS1", coordinates: [40.745595, -73.947095], description: "MoMA PS1 uses a former Long Island City public school for contemporary art that is more experimental and installation-driven than its Midtown parent. Courtyard commissions and Warm Up programming change the social character of the building, so exhibitions and event dates should shape the visit.", officialUrl: "https://www.momaps1.org/en/visit", photo: images.momaPs1, hours: "Thursday-Friday, Sunday, and Monday noon-6:00 PM; Saturday 10:00 AM-6:00 PM; Tuesday-Wednesday closed.", venueKind: "culture", subcategory: "contemporary_art_museum", attributeTags: ["museum", "contemporary_art", "queens", "indoor", "events"], editorialUrls: ["https://en.wikipedia.org/wiki/MoMA_PS1", "https://www.nyctourism.com/boroughs-neighborhoods/queens/"] }),
  stop({ id: "nyc-queens-museum", name: "Queens Museum", coordinates: [40.745789, -73.846704], description: "Queens Museum occupies the New York City Building from the 1939 World's Fair and centers the Panorama of the City of New York, a room-size urban model first built for 1964. The World's Fair context and community-focused exhibitions distinguish it from Manhattan's encyclopedic collections.", officialUrl: "https://queensmuseum.org/", photo: images.queensMuseum, hours: "Wednesday-Friday noon-5:00 PM; Saturday-Sunday 11:00 AM-5:00 PM; Monday-Tuesday closed.", venueKind: "culture", subcategory: "museum", attributeTags: ["museum", "worlds_fair", "architecture", "family_friendly", "queens"], editorialUrls: ["https://en.wikipedia.org/wiki/Queens_Museum", "https://www.nyctourism.com/boroughs-neighborhoods/queens/"] }),
  stop({ id: "nyc-queens-botanical-garden", name: "Queens Botanical Garden", coordinates: [40.751622, -73.826846], description: "Queens Botanical Garden is a compact Flushing landscape with bee, herb, rose, perennial, and wetland gardens shaped by the borough's cultural and ecological diversity. Its scale suits a calm hour or two before food in downtown Flushing rather than an all-day garden itinerary.", officialUrl: "https://queensbotanical.org/hours_admission/", photo: images.queensBotanic, hours: "April-October Tuesday-Sunday 8:00 AM-6:00 PM; Thursday evenings June-August continue until 8:30 PM; Monday closed.", venueKind: "outdoors", subcategory: "botanical_garden", attributeTags: ["garden", "queens", "family_friendly", "seasonal", "flushing"], editorialUrls: ["https://en.wikipedia.org/wiki/Queens_Botanical_Garden", "https://www.nyctourism.com/boroughs-neighborhoods/queens/"] }),
  stop({ id: "nyc-queens-louis-armstrong-house", name: "Louis Armstrong House Museum", coordinates: [40.755604, -73.861997], description: "Louis Armstrong's modest Corona home preserves his furnishings, recordings, archives, and the domestic setting he shared with Lucille Armstrong. Guided tours make the musician's neighborhood life tangible in a way a broad music museum cannot, and timed entry keeps the small house manageable.", officialUrl: "https://www.louisarmstronghouse.org/visit/", bookingUrl: "https://www.louisarmstronghouse.org/visit/", photo: images.louisArmstrong, hours: "Thursday-Saturday 11:00 AM-4:00 PM with tours hourly from 11:00 AM through 3:00 PM; Sunday-Wednesday closed.", venueKind: "culture", subcategory: "historic_house_museum", attributeTags: ["music", "history", "guided_tour", "queens", "reservation_recommended"], editorialUrls: ["https://en.wikipedia.org/wiki/Louis_Armstrong_House", "https://www.nyctourism.com/boroughs-neighborhoods/queens/"] }),
  stop({ id: "nyc-queens-socrates-sculpture-park", name: "Socrates Sculpture Park", coordinates: [40.768466, -73.936746], description: "Socrates Sculpture Park turns a former waterfront landfill into an open-air site for large contemporary commissions, artist projects, education, and East River views. Admission is free, installations change, and the short walk to the Noguchi Museum makes the pair unusually coherent.", officialUrl: "https://socratessculpturepark.org/visit/directions-and-hours/", photo: images.socrates, hours: "Open daily 9:00 AM-sunset; on United States federal holidays the park closes at 1:00 PM.", venueKind: "outdoors", subcategory: "sculpture_park", attributeTags: ["public_art", "free_entry", "waterfront", "queens", "walking"], editorialUrls: ["https://en.wikipedia.org/wiki/Socrates_Sculpture_Park", "https://www.nyctourism.com/boroughs-neighborhoods/queens/"] }),
  stop({ id: "nyc-queens-gantry-plaza", name: "Gantry Plaza State Park", coordinates: [40.747466, -73.959216], description: "Gantry Plaza State Park frames the East River with restored rail-transfer gantries, piers, lawns, playgrounds, and direct Midtown views. The industrial structures give the waterfront identity, while the linked Hunters Point parks create enough distance for a real evening walk.", officialUrl: "https://parks.ny.gov/visit/state-parks/gantry-plaza-state-park", photo: images.gantry, hours: "Open daily dawn-dusk. The seasonal spray pad operates Saturday-Sunday 10:00 AM-5:30 PM in June and daily 10:00 AM-5:30 PM from July 4 through Labor Day.", venueKind: "outdoors", subcategory: "waterfront_park", attributeTags: ["park", "waterfront", "free_entry", "scenic", "long_island_city"], editorialUrls: ["https://en.wikipedia.org/wiki/Gantry_Plaza_State_Park", "https://www.nyctourism.com/boroughs-neighborhoods/queens/"] }),
  stop({ id: "nyc-queens-zoo", name: "Queens Zoo", coordinates: [40.743193, -73.849242], description: "Queens Zoo focuses on animals of the Americas in an 18-acre loop built from a 1964 World's Fair pavilion, with sea lions, bison, pumas, aviaries, and a domestic-animal farm. Its manageable footprint suits families already exploring Flushing Meadows.", officialUrl: "https://queenszoo.com/plan-your-visit/hours-and-rates", bookingUrl: "https://queenszoo.com/shop/ticket-options", photo: images.queensZoo, hours: "April 2-October 31 weekdays 10:00 AM-5:00 PM and weekends/federal holidays 10:00 AM-5:30 PM; November-March daily 10:00 AM-4:30 PM.", venueKind: "culture", subcategory: "zoo", attributeTags: ["zoo", "family_friendly", "queens", "tickets_required", "worlds_fair"], editorialUrls: ["https://en.wikipedia.org/wiki/Queens_Zoo", "https://www.nyctourism.com/boroughs-neighborhoods/queens/"] }),
  stop({ id: "nyc-queens-flushing-meadows", name: "Flushing Meadows Corona Park", coordinates: [40.749824, -73.840785], description: "Flushing Meadows Corona Park carries the surviving geometry of two World's Fairs through the Unisphere, New York State Pavilion, broad promenades, lakes, museums, sports grounds, and the USTA complex. Choose a cluster because the park's scale is much larger than the famous globe suggests.", officialUrl: "https://www.nycgovparks.org/parks/flushing-meadows-corona-park", photo: images.flushingMeadows, hours: "Open daily 6:00 AM-1:00 AM; museums, stadiums, recreation centers, and special events keep separate schedules.", venueKind: "outdoors", subcategory: "major_park", attributeTags: ["park", "worlds_fair", "free_entry", "architecture", "queens"], editorialUrls: ["https://en.wikipedia.org/wiki/Flushing_Meadows%E2%80%93Corona_Park", "https://www.nyctourism.com/boroughs-neighborhoods/queens/"] }),
];

const bronxBoroughStops = [
  activityStops.find((item) => item.id === "nyc-activity-yankee-stadium")!,
  stop({ id: "nyc-bronx-zoo", name: "Bronx Zoo", coordinates: [40.850596, -73.876998], description: "The Bronx Zoo spreads wildlife habitats, conservation interpretation, and historic architecture across 265 acres, making route choice essential. Congo Gorilla Forest, Tiger Mountain, and the Wild Asia Monorail are substantial anchors; families should plan around walking distance rather than trying to clear every exhibit.", officialUrl: "https://bronxzoo.com/plan-your-visit", bookingUrl: "https://bronxzoo.com/shop/ticket-options", photo: images.bronxZoo, hours: "April 2-October 31 weekdays 10:00 AM-5:00 PM and weekends/federal holidays 10:00 AM-5:30 PM; November-March daily 10:00 AM-4:30 PM.", venueKind: "culture", subcategory: "zoo", attributeTags: ["zoo", "bronx", "family_friendly", "tickets_required", "full_day"], editorialUrls: ["https://en.wikipedia.org/wiki/Bronx_Zoo", "https://www.nyctourism.com/boroughs-neighborhoods/the-bronx/"] }),
  stop({ id: "nyc-bronx-nybg", name: "New York Botanical Garden", coordinates: [40.86239, -73.877247], description: "The New York Botanical Garden combines the Thain Family Forest, Haupt Conservatory, extensive plant collections, and ambitious seasonal exhibitions across 250 acres. It deserves a deliberate route through the landscape, not only the conservatory spectacle promoted for a given season.", officialUrl: "https://www.nybg.org/visit/admission/", bookingUrl: "https://www.nybg.org/visit/admission/", photo: images.nyBotanicalGarden, hours: "Tuesday-Sunday 10:00 AM-6:00 PM; open on select Monday holidays listed on the official calendar.", venueKind: "outdoors", subcategory: "botanical_garden", attributeTags: ["garden", "bronx", "family_friendly", "tickets_required", "seasonal"], editorialUrls: ["https://en.wikipedia.org/wiki/New_York_Botanical_Garden", "https://www.nyctourism.com/boroughs-neighborhoods/the-bronx/"] }),
  stop({ id: "nyc-bronx-wave-hill", name: "Wave Hill", coordinates: [40.897997, -73.911486], description: "Wave Hill is a 28-acre public garden and cultural center above the Hudson, known for designed flower gardens, woodland, greenhouses, Glyndor Gallery, and long Palisades views. Its human scale and quiet horticulture provide a distinct alternative to the much larger botanical garden.", officialUrl: "https://www.wavehill.org/visit", photo: images.waveHill, hours: "Tuesday-Sunday grounds 10:00 AM-5:30 PM; Wave Hill House and Glyndor Gallery 10:00 AM-4:30 PM; Monday closed.", venueKind: "outdoors", subcategory: "public_garden", attributeTags: ["garden", "viewpoint", "quiet", "bronx", "art"], editorialUrls: ["https://en.wikipedia.org/wiki/Wave_Hill", "https://www.nyctourism.com/boroughs-neighborhoods/the-bronx/"] }),
  stop({ id: "nyc-bronx-museum", name: "The Bronx Museum", coordinates: [40.831104, -73.919642], description: "The Bronx Museum presents contemporary art through a strong focus on artists of African, Asian, and Latin American ancestry and work connected to the borough. Free admission and a Grand Concourse address make it a practical culture stop before a stadium game or neighborhood meal.", officialUrl: "https://bronxmuseum.org/visit/", photo: images.bronxMuseum, hours: "Wednesday-Sunday 11:00 AM-6:00 PM; Monday-Tuesday closed.", venueKind: "culture", subcategory: "contemporary_art_museum", attributeTags: ["museum", "free_entry", "contemporary_art", "bronx", "indoor"], editorialUrls: ["https://en.wikipedia.org/wiki/Bronx_Museum_of_the_Arts", "https://www.nyctourism.com/boroughs-neighborhoods/the-bronx/"] }),
  stop({ id: "nyc-bronx-van-cortlandt-park", name: "Van Cortlandt Park", coordinates: [40.897435, -73.886132], description: "Van Cortlandt Park contains cross-country trails, a freshwater lake, wetlands, playing fields, a public golf course, and historic routes across more than 1,100 acres. The northwest Bronx landscape rewards a chosen trail or historic-house pairing rather than an undefined pin at the center.", officialUrl: "https://vancortlandt.org/visit/directions/", photo: images.vanCortlandtPark, hours: "Open daily 6:00 AM-10:00 PM; facilities, golf, and programmed activities keep separate schedules.", venueKind: "outdoors", subcategory: "major_park", attributeTags: ["park", "hiking", "free_entry", "bronx", "nature"], editorialUrls: ["https://en.wikipedia.org/wiki/Van_Cortlandt_Park", "https://www.nyctourism.com/boroughs-neighborhoods/the-bronx/"] }),
  stop({ id: "nyc-bronx-pelham-bay-park", name: "Pelham Bay Park and Orchard Beach", coordinates: [40.865382, -73.808881], description: "Pelham Bay Park is New York City's largest park, with salt-marsh ecology, rocky shoreline, forest, bridle paths, and Orchard Beach on Long Island Sound. Pick the beach, a nature trail, or Bartow-Pell Mansion; the distances are too large for casual wandering without a route.", officialUrl: "https://www.pelhambaypark.org/planning-a-visit", photo: images.pelhamBayPark, hours: "Park open daily 6:00 AM-10:00 PM; Orchard Beach lifeguards are on duty daily 10:00 AM-6:00 PM from May 23 through September 13, 2026.", venueKind: "outdoors", subcategory: "coastal_park", attributeTags: ["park", "beach", "nature", "free_entry", "bronx"], editorialUrls: ["https://en.wikipedia.org/wiki/Pelham_Bay_Park", "https://www.nyctourism.com/boroughs-neighborhoods/the-bronx/"] }),
  stop({ id: "nyc-bronx-bartow-pell", name: "Bartow-Pell Mansion Museum", coordinates: [40.871669, -73.805599], description: "Bartow-Pell preserves a Greek Revival country house, formal terraced garden, and remnant of the nineteenth-century estates once lining Pelham Bay. The mansion supplies architectural and domestic history that the surrounding park cannot explain on its own.", officialUrl: "https://www.bartowpellmansionmuseum.org/", bookingUrl: "https://www.bartowpellmansionmuseum.org/visit", photo: images.bartowPell, hours: "Mansion open Wednesday, Saturday, and Sunday noon-4:00 PM; gardens open daily 8:30 AM-dusk.", venueKind: "culture", subcategory: "historic_house_museum", attributeTags: ["history", "architecture", "garden", "bronx", "guided_tour"], editorialUrls: ["https://en.wikipedia.org/wiki/Bartow-Pell_Mansion", "https://www.nyctourism.com/boroughs-neighborhoods/the-bronx/"] }),
  stop({ id: "nyc-bronx-van-cortlandt-house", name: "Van Cortlandt House Museum", coordinates: [40.89129, -73.894129], description: "Van Cortlandt House, completed in 1748, is the Bronx's oldest surviving building and interprets the plantation household, the enslaved people whose labor sustained it, and the site's Revolutionary-era use. Its location inside Van Cortlandt Park makes the history inseparable from the landscape.", officialUrl: "https://www.vchm.org/visit.html", photo: images.vanCortlandtHouse, hours: "Wednesday-Sunday 11:00 AM-4:00 PM with last entry 3:30 PM; Monday-Tuesday closed.", venueKind: "culture", subcategory: "historic_house_museum", attributeTags: ["history", "architecture", "bronx", "museum", "park"], editorialUrls: ["https://en.wikipedia.org/wiki/Van_Cortlandt_House_Museum", "https://www.nyctourism.com/boroughs-neighborhoods/the-bronx/"] }),
  stop({ id: "nyc-bronx-woodlawn", name: "Woodlawn Cemetery", coordinates: [40.889, -73.874], description: "Woodlawn is a National Historic Landmark cemetery whose monuments, mausoleums, landscape design, and residents form an unusually rich record of New York architecture and culture. Guided walks provide essential context; independent visitors should treat it as an active cemetery first.", officialUrl: "https://www.woodlawn.org/about/plan-a-visit/", photo: images.woodlawn, hours: "Grounds open daily 8:30 AM-4:30 PM; tours and archive access follow the official event calendar and reservation page.", venueKind: "outdoors", subcategory: "historic_cemetery", attributeTags: ["history", "architecture", "walking", "quiet", "bronx"], editorialUrls: ["https://en.wikipedia.org/wiki/Woodlawn_Cemetery_(Bronx,_New_York)", "https://www.nyctourism.com/boroughs-neighborhoods/the-bronx/"] }),
];

const statenIslandBoroughStops = [
  activityStops.find((item) => item.id === "nyc-activity-staten-island-ferry")!,
  stop({ id: "nyc-staten-snug-harbor", name: "Snug Harbor Cultural Center & Botanical Garden", coordinates: [40.6427, -74.102], description: "Snug Harbor occupies an 83-acre former sailors' retirement complex with Greek Revival buildings, botanical collections, museums, galleries, a farm, and performance spaces. The grounds connect several separate attractions, so a useful visit begins by choosing a museum or garden rather than treating the campus as one room.", officialUrl: "https://snug-harbor.org/visit/hours-admissions/", photo: images.snugHarbor, hours: "Outdoor grounds and gardens open daily dawn-dusk. During the 2026 summer season, the Chinese Scholar's Garden opens Wednesday-Friday noon-7:00 PM and Saturday-Sunday 11:00 AM-7:00 PM; other campus attractions post their own dated schedules.", venueKind: "culture", subcategory: "cultural_campus", attributeTags: ["garden", "architecture", "staten_island", "family_friendly", "arts"], editorialUrls: ["https://en.wikipedia.org/wiki/Sailors%27_Snug_Harbor", "https://www.nyctourism.com/boroughs-neighborhoods/staten-island/"] }),
  stop({ id: "nyc-staten-island-museum", name: "Staten Island Museum", coordinates: [40.6445, -74.102], description: "Staten Island Museum joins natural science, local history, and art in a single institution at Snug Harbor. Collections on the borough's ecology and past make it the campus stop most clearly rooted in place, while the world-art gallery broadens the visit.", officialUrl: "https://www.statenislandmuseum.org/visit/", photo: images.statenIslandMuseum, hours: "Wednesday-Sunday 11:00 AM-5:00 PM; Monday-Tuesday closed.", venueKind: "culture", subcategory: "museum", attributeTags: ["museum", "natural_history", "staten_island", "family_friendly", "indoor"], editorialUrls: ["https://en.wikipedia.org/wiki/Staten_Island_Museum", "https://www.nyctourism.com/boroughs-neighborhoods/staten-island/"] }),
  stop({ id: "nyc-staten-chinese-scholars-garden", name: "New York Chinese Scholar's Garden", coordinates: [40.645, -74.1021], description: "The New York Chinese Scholar's Garden uses traditional Suzhou construction, pavilions, rock compositions, courtyards, water, and framed views to create a sequence rather than one vista. It is a ticketed enclosure within Snug Harbor, not the same experience as walking the free campus grounds.", officialUrl: "https://snug-harbor.org/things-to-do/outdoor-exploration/chinese-scholars-garden/", bookingUrl: "https://snug-harbor.org/things-to-do/outdoor-exploration/chinese-scholars-garden/", photo: images.chineseScholarsGarden, hours: "May 1-September 26 Wednesday-Friday noon-7:00 PM and Saturday-Sunday 11:00 AM-7:00 PM; last entry 6:30 PM. Listed private-event and weather closures apply.", venueKind: "outdoors", subcategory: "historic_garden", attributeTags: ["garden", "architecture", "staten_island", "tickets_required", "quiet"], editorialUrls: ["https://en.wikipedia.org/wiki/New_York_Chinese_Scholar%27s_Garden", "https://www.nyctourism.com/boroughs-neighborhoods/staten-island/"] }),
  stop({ id: "nyc-staten-island-zoo", name: "Staten Island Zoo", coordinates: [40.6252, -74.1159], description: "Staten Island Zoo is a compact neighborhood zoo with a renowned reptile collection, Amur leopards, farm animals, aquarium exhibits, and a strong education mission. Its manageable size works particularly well for younger children and does not demand the full-day commitment of the Bronx Zoo.", officialUrl: "https://www.statenislandzoo.org/plan-your-visit", bookingUrl: "https://www.statenislandzoo.org/plan-your-visit", photo: images.statenIslandZoo, hours: "Open daily 10:00 AM-4:45 PM; closed Thanksgiving, Christmas Day, and New Year's Day.", venueKind: "culture", subcategory: "zoo", attributeTags: ["zoo", "family_friendly", "staten_island", "tickets_required", "compact"], editorialUrls: ["https://en.wikipedia.org/wiki/Staten_Island_Zoo", "https://www.nyctourism.com/boroughs-neighborhoods/staten-island/"] }),
  stop({ id: "nyc-staten-historic-richmond-town", name: "Historic Richmond Town", coordinates: [40.5709, -74.1456], description: "Historic Richmond Town preserves houses, shops, public buildings, and working trades across a village landscape that interprets more than three centuries of Staten Island life. Demonstrations and open interiors depend on the seasonal program, so the calendar matters more than merely walking the grounds.", officialUrl: "https://www.historicrichmondtown.org/visit", bookingUrl: "https://www.historicrichmondtown.org/visit", photo: images.historicRichmondTown, hours: "May-December Wednesday-Sunday 11:00 AM-4:00 PM; January-March Friday-Sunday 11:00 AM-4:00 PM; April Wednesday-Sunday 11:00 AM-4:00 PM.", venueKind: "culture", subcategory: "living_history_museum", attributeTags: ["history", "architecture", "staten_island", "family_friendly", "guided_tour"], editorialUrls: ["https://en.wikipedia.org/wiki/Historic_Richmond_Town", "https://www.nyctourism.com/boroughs-neighborhoods/staten-island/"] }),
  stop({ id: "nyc-staten-fort-wadsworth", name: "Fort Wadsworth", coordinates: [40.6048, -74.0532], description: "Fort Wadsworth guards the Narrows with batteries, overlooks, and military layers dating from the colonial period through the Cold War. The Verrazzano-Narrows Bridge now dominates the view, while National Park Service interpretation explains why the harbor entrance was fortified for centuries.", officialUrl: "https://www.nps.gov/gate/learn/historyculture/fort-wadsworth.htm", photo: images.fortWadsworth, hours: "Fort grounds open daily 6:00 AM-9:00 PM; visitor center Friday-Monday 10:00 AM-4:00 PM.", venueKind: "landmark", subcategory: "historic_fort", attributeTags: ["history", "viewpoint", "free_entry", "staten_island", "national_park"], editorialUrls: ["https://en.wikipedia.org/wiki/Fort_Wadsworth", "https://www.nyctourism.com/boroughs-neighborhoods/staten-island/"] }),
  stop({ id: "nyc-staten-lighthouse-museum", name: "National Lighthouse Museum", coordinates: [40.6407, -74.0734], description: "The National Lighthouse Museum occupies the former United States Lighthouse Service General Depot beside St. George, explaining optics, keepers, supply systems, and the site's national role from 1864 to 1939. Its compact exhibits fit naturally before or after the ferry.", officialUrl: "https://lighthousemuseum.org/plan-your-visit/", photo: images.lighthouseMuseum, hours: "Wednesday-Sunday 11:00 AM-4:00 PM; Monday and legal holidays closed. Boat tours follow the official seasonal calendar.", venueKind: "culture", subcategory: "history_museum", attributeTags: ["museum", "maritime", "history", "staten_island", "ferry_access"], editorialUrls: ["https://en.wikipedia.org/wiki/National_Lighthouse_Museum", "https://www.nyctourism.com/boroughs-neighborhoods/staten-island/"] }),
  stop({ id: "nyc-staten-alice-austen-house", name: "Alice Austen House", coordinates: [40.6152, -74.0638], description: "Alice Austen House interprets the pioneering photographer through her waterfront home, images of working New York, and the 55-year relationship with Gertrude Tate that makes the site nationally significant to LGBTQ+ history. Contemporary photography exhibitions keep the museum from becoming a sealed period room.", officialUrl: "https://aliceausten.org/", photo: images.aliceAusten, hours: "Wednesday-Friday noon-5:00 PM; Saturday 11:00 AM-5:00 PM; Sunday-Tuesday closed.", venueKind: "culture", subcategory: "historic_house_museum", attributeTags: ["photography", "lgbtq", "history", "waterfront", "staten_island"], editorialUrls: ["https://en.wikipedia.org/wiki/Alice_Austen_House", "https://www.nyctourism.com/boroughs-neighborhoods/staten-island/"] }),
  stop({ id: "nyc-staten-conference-house", name: "Conference House Park", coordinates: [40.5025, -74.2537], description: "Conference House Park reaches Staten Island's southern tip with Raritan Bay shoreline, trails, historic trees, and the stone manor where a 1776 peace conference failed to end the Revolution. The museum supplies the political history; the park carries the waterfront setting and distance from central New York.", officialUrl: "https://conferencehouse.org/visit/directions-hours/", bookingUrl: "https://conferencehouse.org/visit/directions-hours/", photo: images.conferenceHouse, hours: "Park open daily 6:00 AM-1:00 AM; house tours Saturday-Sunday noon-4:00 PM on dates listed by the official seasonal calendar.", venueKind: "outdoors", subcategory: "historic_park", attributeTags: ["history", "park", "waterfront", "staten_island", "guided_tour"], editorialUrls: ["https://en.wikipedia.org/wiki/Conference_House", "https://www.nyctourism.com/boroughs-neighborhoods/staten-island/"] }),
];

const manhattanBoroughStops = [
  activityStops.find((item) => item.id === "nyc-activity-central-park")!,
  cultureStops.find((item) => item.id === "nyc-culture-met")!,
  cultureStops.find((item) => item.id === "nyc-culture-moma")!,
  cultureStops.find((item) => item.id === "nyc-culture-whitney")!,
  activityStops.find((item) => item.id === "nyc-activity-high-line")!,
  activityStops.find((item) => item.id === "nyc-activity-grand-central")!,
  cultureStops.find((item) => item.id === "nyc-culture-tenement")!,
  cultureStops.find((item) => item.id === "nyc-culture-studio-museum")!,
  cultureStops.find((item) => item.id === "nyc-culture-apollo")!,
  cultureStops.find((item) => item.id === "nyc-culture-lincoln-center")!,
];

const sources = {
  dining: [...editorial.restaurants, ...diningStops.slice(0, 5).map((item) => source(`${item.name} official`, item.officialUrl ?? item.sourceEvidence?.officialUrl ?? maps(item.name)))],
  cheapEats: [...editorial.cheapEats, ...cheapEatStops.slice(0, 5).map((item) => source(`${item.name} official`, item.officialUrl ?? maps(item.name)))],
  hotels: [...editorial.hotels, ...hotelStops.slice(0, 5).map((item) => source(`${item.name} official`, item.officialUrl ?? maps(item.name)))],
  hostels: [...editorial.hostels, ...hostelStops.slice(0, 5).map((item) => source(`${item.name} official`, item.officialUrl ?? maps(item.name)))],
  casualBars: [...editorial.casualBars, ...casualBarStops.slice(0, 5).map((item) => source(`${item.name} official`, item.officialUrl ?? maps(item.name)))],
  cocktails: [...editorial.cocktails, ...cocktailStops.slice(0, 5).map((item) => source(`${item.name} official`, item.officialUrl ?? maps(item.name)))],
  culture: [...editorial.culture, ...cultureStops.slice(0, 5).map((item) => source(`${item.name} official`, item.officialUrl ?? maps(item.name)))],
  activities: [...editorial.activities, ...activityStops.slice(0, 5).map((item) => source(`${item.name} official`, item.officialUrl ?? maps(item.name)))],
};

function boroughSources(editorialSources: ListSource[], stops: GuideStop[]): ListSource[] {
  return [
    ...editorialSources,
    ...stops.map((item) => source(`${item.name} official`, item.officialUrl ?? item.sourceEvidence?.officialUrl ?? maps(item.name))),
  ];
}

const boroughGuideSources = {
  manhattan: boroughSources([
    source("Top organic result: NYC Tourism - Manhattan", "https://www.nyctourism.com/boroughs-neighborhoods/manhattan/"),
    source("Time Out - Best things to do in Manhattan", "https://www.timeout.com/newyork/things-to-do/best-things-to-do-in-manhattan"),
  ], manhattanBoroughStops),
  brooklyn: boroughSources([
    source("Top organic result: NYC Tourism - Brooklyn", "https://www.nyctourism.com/boroughs-neighborhoods/brooklyn/"),
    source("Time Out - Brooklyn", "https://www.timeout.com/newyork/brooklyn"),
  ], brooklynBoroughStops),
  queens: boroughSources([
    source("Top organic result: NYC Tourism - Queens", "https://www.nyctourism.com/boroughs-neighborhoods/queens/"),
    source("Time Out - Queens", "https://www.timeout.com/newyork/queens"),
  ], queensBoroughStops),
  bronx: boroughSources([
    source("Top organic result: NYC Tourism - The Bronx", "https://www.nyctourism.com/boroughs-neighborhoods/the-bronx/"),
    source("Bronx Tourism Council", "https://www.ilovethebronx.com/about-btc"),
  ], bronxBoroughStops),
  statenIsland: boroughSources([
    source("Top organic result: NYC Tourism - Staten Island", "https://www.nyctourism.com/boroughs-neighborhoods/staten-island/"),
    source("Time Out - Staten Island", "https://www.timeout.com/newyork/staten-island"),
  ], statenIslandBoroughStops),
};

function guide(category: ListCategory, id: string, slug: string, seoSlug: string, title: string, description: string, stops: GuideStop[], guideSources: ListSource[], seoTitle: string, seoDescription: string, neighborhood?: string): MapList {
  const guideStops = seoSlug === "best-dive-bars"
    ? stops.map((stop) => ({
        ...stop,
        attributeTags: ["dive_bars", ...(stop.attributeTags ?? []).filter((tag) => tag !== "dive_bars")],
      }))
    : stops;

  return {
    id,
    slug,
    seoSlug,
    seoTitle,
    seoDescription,
    title,
    description,
    url: maps(`${title} ${neighborhood ?? "New York City"}`),
    category,
    location: neighborhood
      ? { ...nycLocation, neighborhood }
      : nycLocation,
    creator: {
      id: `user-rguide-${category.toLowerCase()}`,
      name: `R ${category}`,
      avatar: avatar(category),
    },
    upvotes: 0,
    createdAt: neighborhood ? "2026-07-19T00:00:00.000Z" : createdAt,
    stops: guideStops,
    sources: guideSources,
  };
}

export const newYorkCityCitywideGuides: MapList[] = [
  guide("Food", "list-nyc-citywide-dining", "nyc-best-restaurants-citywide", "best-restaurants", "Classic Rooms, Serious Tables, and Neighborhood Icons", "New York's essential dining spans old delis, steakhouses, Chinatown dim sum, Harlem soul food, Grand Central seafood, and occasion rooms by the park. The city appears on the plate through history and neighborhood, not one tasting-menu lane.", diningStops, sources.dining, "Best Restaurants in New York City for Classic Dining and Essential Tables", "Source-backed NYC restaurant guide with delis, steakhouses, dim sum, soul food, seafood, pizza, and park-side dining."),
  guide("Food", "list-nyc-cheap-eats", "nyc-best-cheap-eats", "best-cheap-eats", "Bagels, Slices & Counter Classics", "A practical New York cheap-eats guide for bagels, slice counters, hot dogs, falafel, dumplings, tacos, Punjabi plates, and vegetarian-friendly fast meals that fit real city routing.", cheapEatStops, sources.cheapEats, "Best Cheap Eats in New York City for Slices, Bagels, Dumplings, and Fast Meals", "Budget and medium-price NYC food stops with source evidence, map status, and practical route notes."),
  guide("Stay", "list-nyc-hotels", "nyc-best-hotels", "best-hotels", "Hotels by Neighborhood, View, and Trip Mood", "New York hotels divided by what they actually provide: uptown ceremony, downtown design, airport logistics, west-side nightlife, or a smaller Village scale. Service, room character, amenities, and location matter more than luxury adjectives.", hotelStops, sources.hotels, "Best Hotels in New York City for Luxury, Design, Downtown, and Park Bases", "Hotel-only NYC stay guide with official booking evidence and neighborhood strategy for Manhattan, Brooklyn access, and JFK logistics."),
  guide("Stay", "list-nyc-hostels", "nyc-best-hostels", "best-hostels", "Hostels & Affordable Transit Bases", "A hostel-only New York stay guide with dorms, private rooms, pods, and no-frills budget bases across Manhattan, Queens, Brooklyn, and uptown subway routes.", hostelStops, sources.hostels, "Best Hostels in New York City for Dorms, Private Rooms, and Budget Bases", "Hostel-only NYC guide with dorm/private-room evidence, booking links, and neighborhood tradeoffs."),
  guide("Nightlife", "list-nyc-dive-bars-casual-pubs", "nyc-best-dive-bars-casual-pubs", "best-dive-bars", "Dive Bars, Old Pubs & Casual Pints", "A casual-bar guide for New York rooms where history, beer, neighborhood regulars, food, dive-bar energy, and queer nightlife landmarks matter more than mixology posture.", casualBarStops, sources.casualBars, "Best Dive Bars and Casual Pubs in New York City", "NYC dive bar and casual pub guide with old ale houses, queer landmarks, Red Hook music, and Midtown budget drinking."),
  guide("Nightlife", "list-nyc-cocktail-bars", "nyc-best-cocktail-bars", "best-cocktail-bars", "Cocktail Rooms Worth Planning Around", "New York cocktail culture across landmark hotel bars, modern award rooms, speakeasy theater, Brooklyn neighborhood drinking, and serious East Village counters. Drinks, service, room size, music, and reservation posture distinguish the selection.", cocktailStops, sources.cocktails, "Best Cocktail Bars in New York City for Classic and Modern Drinks", "Source-backed NYC cocktail guide with Bemelmans, Dead Rabbit, Employees Only, PDT, Attaboy, Clover Club, Dante, Death & Co, Angel's Share, and King Cole Bar."),
  guide("Culture", "list-nyc-culture-museums-performance", "nyc-best-culture-museums-performance", "best-culture", "Museums, Stages, and Neighborhood Culture", "A citywide New York culture guide that refuses to keep culture only on Museum Mile. It connects major art institutions, Lower East Side history, Harlem performance, Brooklyn scale, Queens film and sculpture, and Lincoln Center nights into one usable map.", cultureStops, sources.culture, "Best Culture in New York City for Museums, Performance, and Neighborhood History", "NYC culture guide with official evidence for museums, performance venues, Harlem, Brooklyn, Queens, and the Lower East Side."),
  guide("Activities", "list-nyc-top-things-to-do", "nyc-top-things-to-do", "best-things-to-do", "Ten Stops That Make a First New York Trip Work", "Ten New York essentials span harbor icons, major parks, bridge walking, Grand Central, a free ferry, baseball, and a major museum. Each reveals a different part of the city's scale beyond the postcard view.", activityStops, sources.activities, "Top Things to Do in New York City With 10 Strong Stops", "Ten source-backed NYC things to do, from Statue of Liberty and Central Park to Brooklyn Bridge, Grand Central, the ferry, Prospect Park, Yankee Stadium, and the Met."),
  guide("Activities", "list-nyc-manhattan-things-to-do", "nyc-manhattan-things-to-do", "best-things-to-do", "Manhattan: Museums, Parks, and City Landmarks", "Manhattan's strongest first route balances Central Park and the High Line with art, immigrant history, Harlem performance, Lincoln Center, and Grand Central. These stops explain the borough through institutions and public spaces rather than compressing it into Midtown viewpoints.", manhattanBoroughStops, boroughGuideSources.manhattan, "Best Things to Do in Manhattan: Museums, Parks, and Landmarks", "Ten source-backed Manhattan stops spanning Central Park, major museums, Harlem performance, Lower East Side history, the High Line, Lincoln Center, and Grand Central.", "Manhattan"),
  guide("Activities", "list-nyc-brooklyn-things-to-do", "nyc-brooklyn-things-to-do", "best-things-to-do", "Brooklyn: Parks, Culture, and Waterfront Walks", "Brooklyn rewards time at ground level: bridge approaches and harbor views, Prospect Park's landscape, major museums and gardens, neighborhood family institutions, an aquarium, and Green-Wood's history. The route makes the borough a destination rather than a skyline backdrop.", brooklynBoroughStops, boroughGuideSources.brooklyn, "Best Things to Do in Brooklyn: Parks, Culture, and Waterfront", "Ten source-backed Brooklyn stops for bridge walks, parks, museums, gardens, waterfront views, family attractions, the aquarium, and Green-Wood history.", "Brooklyn"),
  guide("Activities", "list-nyc-queens-things-to-do", "nyc-queens-things-to-do", "best-things-to-do", "Queens: Art, Film, Gardens, and World's Fair Landscapes", "Queens brings contemporary art, moving-image history, jazz, sculpture, gardens, wildlife, and the surviving landscape of two World's Fairs into one borough guide. Its institutions are spread across distinct neighborhoods, so the list favors focused anchors over a single forced walking route.", queensBoroughStops, boroughGuideSources.queens, "Best Things to Do in Queens: Art, Film, Gardens, and Parks", "Ten source-backed Queens stops spanning MoMA PS1, film and art museums, Louis Armstrong's home, sculpture, gardens, wildlife, and World's Fair landscapes.", "Queens"),
  guide("Activities", "list-nyc-bronx-things-to-do", "nyc-bronx-things-to-do", "best-things-to-do", "The Bronx: Gardens, Wildlife, History, and Big Parks", "The Bronx pairs New York's largest zoo and botanical garden with vast coastal and woodland parks, historic houses, contemporary art, baseball, and a landmark cemetery. These stops show a borough shaped as much by landscape and local history as by Yankee Stadium.", bronxBoroughStops, boroughGuideSources.bronx, "Best Things to Do in the Bronx: Gardens, Wildlife, and History", "Ten source-backed Bronx stops covering the zoo, botanical garden, Wave Hill, museums, Yankee Stadium, historic houses, Woodlawn, and New York City's largest parks.", "The Bronx"),
  guide("Activities", "list-nyc-staten-island-things-to-do", "nyc-staten-island-things-to-do", "best-things-to-do", "Staten Island: Harbor History, Gardens, and Coastal Parks", "Staten Island opens from its free ferry into maritime history, an 83-acre cultural campus, museums, gardens, a zoo, military overlooks, historic villages, photography, and the southern shoreline. The borough's distances demand deliberate routing, but they also provide New York's clearest sense of escape.", statenIslandBoroughStops, boroughGuideSources.statenIsland, "Best Things to Do on Staten Island: History, Gardens, and Coast", "Ten source-backed Staten Island stops from the ferry and Snug Harbor to maritime museums, historic houses, Fort Wadsworth, Richmond Town, and coastal parkland.", "Staten Island"),
];

newYorkCityCitywideGuides.push(buildNatureGuide({
  city: "New York City", country: "United States", continent: "North America",
  id: "list-new-york-city-citywide-nature", slug: "new-york-city-best-parks-and-nature-citywide", seoSlug: "best-parks",
  seoTitle: "Best Parks and Nature in New York City", seoDescription: "New York City nature guide to major parks, coastal wetlands, forest, botanical gardens, islands, and waterfront restoration.",
  title: "Forest Boroughs, Salt Marsh, and Designed Urban Wild",
  description: "New York’s nature is bigger and stranger than Central Park alone: old-growth fragments, salt marsh, beaches, botanical collections, islands, and ambitious waterfront landscapes cross all five boroughs. Transit, seasonal ferries, migration calendars, and park hours shape the real itinerary.",
  createdAt: "2026-07-29T00:00:00.000Z", checkedAt: "2026-08-04",
  sources: [
    { name: "Top organic result: NYC Parks", url: "https://www.nycgovparks.org/" },
    { name: "National Park Service Gateway", url: "https://www.nps.gov/gate/index.htm" },
    { name: "NYC Audubon birding", url: "https://nycbirdalliance.org/" },
    { name: "Google Maps - New York City parks and nature", url: "https://www.google.com/maps/search/best+parks+and+nature+New+York+City" },
  ],
  stops: [
    { id: "new-york-city-nature-central", name: "Central Park", coordinates: [40.7829, -73.9654], description: "Central Park layers rock outcrops, woodland, meadows, reservoirs, ravines, gardens, and migratory bird habitat into Manhattan’s engineered center. The Ramble and North Woods offer more nature than the famous lawns, though seasonal closures protect restoration areas.", hours: { default: "Open daily 6:00 AM-1:00 AM; facility, waterbody, and restoration restrictions follow official park notices." }, officialUrl: "https://www.centralparknyc.org/", subcategory: "urban_landscape_park", attributeTags: ["park", "forest", "birdwatching", "running", "central"] },
    { id: "new-york-city-nature-prospect", name: "Prospect Park", coordinates: [40.6602, -73.969], description: "Prospect Park combines Brooklyn’s Long Meadow, ravine forest, lake, wetlands, and sports grounds in a landscape by Olmsted and Vaux. The Ravine supplies the deepest sense of enclosure, while weekend lawns become intensely social.", hours: { default: "Open daily 6:00 AM-1:00 AM; lake, event, and restoration restrictions follow Prospect Park Alliance notices." }, officialUrl: "https://www.prospectpark.org/", subcategory: "urban_landscape_park", attributeTags: ["park", "forest", "lake", "running", "birdwatching"] },
    { id: "new-york-city-nature-high-line", name: "The High Line", coordinates: [40.748, -74.0048], description: "The High Line turns an elevated freight line into a narrow garden of grasses, perennials, art, architecture, and Hudson views. It is landscape design under crowd pressure, best early or in poor weather when the path can actually breathe.", hours: { default: "Daily: Apr–May 7:00 AM–10:00 PM; Jun–Sep 7:00 AM–11:00 PM; Oct–Nov 7:00 AM–10:00 PM; Dec–Mar 7:00 AM–7:00 PM." }, officialUrl: "https://www.thehighline.org/visit/", subcategory: "elevated_linear_park", attributeTags: ["garden", "walking", "architecture", "accessible", "crowded"] },
    { id: "new-york-city-nature-brooklyn-bridge", name: "Brooklyn Bridge Park", coordinates: [40.702, -73.996], description: "Brooklyn Bridge Park reshapes former piers into salt-tolerant planting, lawns, beaches, wetlands, sports space, and changing East River views. Tide and event programming animate different sections, while the promenade remains useful year-round.", hours: { default: "Open daily 6:00 AM-1:00 AM; piers, beaches, and programmed facilities follow official seasonal schedules." }, officialUrl: "https://www.brooklynbridgepark.org/", subcategory: "waterfront_park", attributeTags: ["waterfront", "wetland", "walking", "skyline", "accessible"] },
    { id: "new-york-city-nature-pelham-bay", name: "Pelham Bay Park", coordinates: [40.866, -73.808], description: "Pelham Bay Park is New York City’s largest park, with forest, salt marsh, rocky shore, bridle paths, lagoons, and Orchard Beach in the Bronx. Distances are substantial, and beach season provides only one version of its coastal ecology.", hours: { default: "Daily 6:00 AM–1:00 AM; Orchard Beach facilities keep separate seasonal hours." }, officialUrl: "https://www.nycgovparks.org/parks/pelham-bay-park", subcategory: "coastal_park", attributeTags: ["forest", "wetland", "beach", "hiking", "birdwatching"] },
    { id: "new-york-city-nature-jamaica-bay", name: "Jamaica Bay Wildlife Refuge", coordinates: [40.616, -73.825], description: "Jamaica Bay Wildlife Refuge protects salt marsh, ponds, coastal scrub, and major migratory bird habitat within Gateway National Recreation Area. Seasonal species and weather matter, while the exposed loop offers little relief from summer sun or winter wind.", hours: { default: "Daily 6:00 AM–9:00 PM; visitor center Fri–Mon 10:00 AM–4:00 PM." }, officialUrl: "https://www.nps.gov/gate/planyourvisit/hours.htm", subcategory: "coastal_wildlife_refuge", attributeTags: ["wetland", "birdwatching", "walking", "coast", "free_entry"] },
    { id: "new-york-city-nature-greenbelt", name: "Staten Island Greenbelt", coordinates: [40.59, -74.137], description: "The Staten Island Greenbelt connects forest, kettle ponds, wetlands, and ridges across the borough’s interior through a broad trail network. Some paths are rough and poorly connected by transit, offering genuine woodland at the cost of convenience.", hours: { default: "Daily 6:00 AM–1:00 AM under NYC Parks operating rules." }, officialUrl: "https://www.nycgovparks.org/parks/greenbelt", subcategory: "urban_forest_network", attributeTags: ["forest", "hiking", "wetland", "quiet", "free_entry"] },
    { id: "new-york-city-nature-governors-island", name: "Governors Island", coordinates: [40.6894, -74.0168], description: "Governors Island combines lawns, historic trees, restored shoreline, wetlands, and new hills built for harbor views and climate resilience. The ferry timetable controls every visit, while seasonal events can shift the island from calm landscape to festival ground.", hours: { mon: "7:00 AM–10:00 PM", tue: "7:00 AM–10:00 PM", wed: "7:00 AM–10:00 PM", thu: "7:00 AM–10:00 PM", fri: "7:00 AM–11:00 PM", sat: "7:00 AM–11:00 PM", sun: "7:00 AM–10:00 PM" }, officialUrl: "https://www.govisland.com/visit-the-island", subcategory: "harbor_island_park", attributeTags: ["island", "ferry", "cycling", "viewpoint", "family_friendly"] },
    { id: "new-york-city-nature-wave-hill", name: "Wave Hill", coordinates: [40.8978, -73.912], description: "Wave Hill terraces gardens, woodland, greenhouses, and Hudson–Palisades views across a former Riverdale estate. Horticulture and borrowed scenery carry the experience, with timed cultural programming adding structure without overwhelming the landscape.", hours: { mon: "Closed", tue: "10:00 AM–5:30 PM", wed: "10:00 AM–5:30 PM", thu: "10:00 AM–5:30 PM", fri: "10:00 AM–5:30 PM", sat: "10:00 AM–5:30 PM", sun: "10:00 AM–5:30 PM" }, officialUrl: "https://www.wavehill.org/visit", subcategory: "public_garden", attributeTags: ["garden", "viewpoint", "forest", "ticketed", "quiet"] },
    { id: "new-york-city-nature-nybg", name: "New York Botanical Garden", coordinates: [40.8623, -73.8776], description: "The New York Botanical Garden holds the old-growth Thain Family Forest, conservatory collections, seasonal displays, and extensive research grounds across the Bronx River landscape. Dated tickets and special exhibitions can make it a full-day commitment.", hours: { mon: "Closed except select Monday holidays", tue: "10:00 AM–6:00 PM", wed: "10:00 AM–6:00 PM", thu: "10:00 AM–6:00 PM", fri: "10:00 AM–6:00 PM", sat: "10:00 AM–6:00 PM", sun: "10:00 AM–6:00 PM" }, officialUrl: "https://www.nybg.org/visit/admission", subcategory: "botanical_garden", attributeTags: ["garden", "forest", "greenhouse", "ticketed", "full_day"] },
  ],
}));
