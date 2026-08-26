import type { GuideStop, ListCategory, ListSource, MapList } from "@/types";

const createdAt = "2026-08-26T00:00:00.000Z";
const checkedAt = "2026-08-26";

const location = {
  city: "Kraków",
  country: "Poland",
  continent: "Europe",
  scope: "city" as const,
};

const colors: Record<ListCategory, string> = {
  Food: "b91c1c",
  Nightlife: "6d28d9",
  Nature: "15803d",
  Culture: "b45309",
  Stay: "0369a1",
  Activities: "be123c",
  Routes: "475569",
  Essentials: "475569",
};

function avatar(category: ListCategory) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><rect width="160" height="160" rx="80" fill="#${colors[category]}"/><text x="80" y="92" text-anchor="middle" font-family="Arial" font-size="76" font-weight="700" fill="white">R</text></svg>`)}`;
}

function maps(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

const IMAGE_BY_STOP_ID: Record<string, string> = {
  "krakow-dining-bottiglieria":
    "https://www.polska.travel/wp-content/uploads/2024/02/B1881_wnetrze_krakow.jpg",
  "krakow-dining-molam":
    "https://molam.pl/wp-content/uploads/2025/08/RM_07437.jpg",
  "krakow-dining-folga":
    "https://axwwgrkdco.cloudimg.io/v7/__gmpics3__/290c37c833154d1582a2d7ae0ef13a8c.jpeg?h=500&org_if_sml=1&w=500",
  "krakow-dining-noah":
    "https://noahkrakow.pl/wp-content/uploads/2024/04/16.jpg",
  "krakow-dining-bufet":
    "https://bufetkrk.com/wp-content/uploads/2024/05/bufet-home-001.webp",
  "krakow-dining-nat": "https://natbistro.pl/images/bg_4.webp",
  "krakow-dining-farina":
    "https://farina.com.pl/wp-content/uploads/2023/04/xxxmt230208-FARINA-WN%E2%94%80yTRZE-9490B.jpg",
  "krakow-dining-fiorentina":
    "https://cdn.prezentmarzen.com/img/p/2/7/0/7/7/27077.jpg",
  "krakow-dining-pod-nosem": "https://s.inyourpocket.com/gallery/218177.jpg",
  "krakow-dining-pod-baranem":
    "https://podbaranem.com/wp-content/uploads/2017/05/r2-1024x683.jpg",
  "krakow-cheap-temida": "https://tcdn.mindtrip.ai/images/417829/103g8c7.png",
  "krakow-cheap-tomasza": "https://milkbar-tomasza-krakow.pl/images/inside.jpg",
  "krakow-cheap-przystanek":
    "https://przystanek-pierogarnia.pl/wp-content/uploads/2025/10/Przystanek.Pierogarnia_Mieso.webp",
  "krakow-cheap-chimera":
    "https://chimera.com.pl/images/modules/gallery/wnetrze-baru-salatkowego/unnamed-5.webp",
  "krakow-cheap-vegab": "https://www.vegab.pl/assets/images/hero/queue.webp",
  "krakow-cheap-hummus":
    "https://static.wixstatic.com/media/dc1e0b_cb842242285449949db6b025bf979b8b~mv2.jpg",
  "krakow-cheap-andrus":
    "https://i0.wp.com/bezfarmazonu.pl/wp-content/uploads/2023/06/img_2663.jpg?fit=1200%2C967&ssl=1",
  "krakow-cheap-endzior":
    "https://api.culture.pl/sites/default/files/styles/1920_auto/public/images/imported/KUCHNIA/fast_food_polska/full_zapiekaniki_ag__770.jpg?itok=vtP6QDCi",
  "krakow-cheap-babcia":
    "https://kuchniaubabcimaliny.pl/wp-content/uploads/2019/01/1.jpg",
  "krakow-cheap-targowy": "https://s.inyourpocket.com/gallery/99948.jpg",
  "krakow-hotel-stary":
    "https://manager.lbooking.online/CmsImages/hs_hotel_galeria_1.jpg",
  "krakow-hotel-stradom":
    "https://stradomhouse.com/wp-content/uploads/2024/09/hotel-krakow.jpg",
  "krakow-hotel-h15":
    "https://hotelh15palace.pl/media/cache/resolve/og_meta_tags_image/data/files/000/004/17552051343.jpg",
  "krakow-hotel-copernicus":
    "https://manager.lbooking.online/CmsImages/hotel-copernicus-relais-et-chateaux%20(16).jpg",
  "krakow-hotel-bachleda":
    "https://u.profitroom.pl/2018-bachledaluxuryhotel-pl/thumb/1200x630/uploads/1.jpg",
  "krakow-hotel-saski":
    "https://www.hilton.com/im/en/KRKSHQQ/17522951/pu-saski-hilton-facade-019-pp.jpg?ch=2792&cw=4969&gravity=NorthWest&impolicy=crop&rh=430&rw=768&xposition=31&yposition=4111",
  "krakow-hotel-balthazar":
    "https://u.profitroom.pl/2019-balthazarhotel-com/thumb/1920x1080/uploads/1.jpg",
  "krakow-hotel-puro":
    "https://purohotels.com/media/zzcewm3u/puro_hotels_kazimierz_rooms_003.jpg?height=1280&v=1d88af0c2213550",
  "krakow-hotel-bonerowski":
    "https://wa-uploads.profitroom.com/thebonerowskipalace/1920x1080/17332216068203_HubEMQ6pVKrvLD4G.jpg",
  "krakow-hotel-queen":
    "https://wa-uploads.profitroom.com/queenboutiquehotel/500x350/16431053304762_queenboutiquehotel06.jpg",
  "krakow-hostel-greg-tom":
    "https://cf.bstatic.com/xdata/images/hotel/max1024x768/16211799.jpg?k=0da768a7c86e4aa203fd1a520fc3e1a87ebbc5e4a2113e4a2956aacc96899d05&o=",
  "krakow-hostel-havana":
    "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/9/96090/53.jpg",
  "krakow-hostel-lets-rock":
    "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/2/29686/qgdnz6yt60buecnkfzta.jpg",
  "krakow-hostel-meininger":
    "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/3/321183/c241nkm2xutue2qvzzii.jpg",
  "krakow-hostel-atlantis":
    "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/9/9702/fnel6hykp2hlsnrvg7qo.jpg",
  "krakow-hostel-dizzy-daisy":
    "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/5/5933/fg5oacbduvmxukhiljzr.jpg",
  "krakow-hostel-ginger":
    "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/2/276543/8.jpg",
  "krakow-hostel-deco":
    "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/1/13022/vcjqex2esfwdau1l1z4r.jpg",
  "krakow-hostel-mosquito":
    "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/2/28164/ge0lgiodgfisj6iaykpf.jpg",
  "krakow-hostel-freedom":
    "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/3/308422/xj8ofoviiffviydvvevv.jpg",
  "krakow-pub-house-of-beer":
    "https://www.houseofbeerkrakow.com/wp-content/uploads/2023/10/IMG_4550.jpg",
  "krakow-pub-multi-qlti":
    "https://tapbar.pl/wp-content/uploads/2024/11/Multi-Qlti-10.2022-82-scaled.jpg",
  "krakow-pub-wezze":
    "https://i0.wp.com/s.inyourpocket.com/img/text/poland/krakow/wezze-tytano-2.jpg?ssl=1&w=720",
  "krakow-pub-nowy-kraftowy":
    "https://bier-traveller.com/wp-content/uploads/2022/05/Krakow-Nowy-Kraftowy-Bier-Traveller-26.jpg",
  "krakow-pub-omerta":
    "https://images.myguide-cdn.com/krakow/companies/omerta/large/omerta-462395.jpg",
  "krakow-pub-nalej-se":
    "https://nalejse.pl/wp-content/uploads/2023/06/FR_20230623_0122-scaled.jpg",
  "krakow-pub-strefa-piwa": "https://s.inyourpocket.com/gallery/134341.jpg",
  "krakow-pub-alchemia":
    "https://s.inyourpocket.com/gallery/krakow/2024/06/324015593-640988497827976-3002244837188004057-n.jpg",
  "krakow-pub-eszeweria":
    "https://eszeweria-krakow.pl/assets/images/eszeweria-eszeweria-inside-cozy-candlelight-seating-rustic-warm-lighting-215x270.jpg",
  "krakow-pub-stary-port":
    "https://www.staryport.com.pl/materialy/gal/big/25.jpg",
  "krakow-cocktail-mercy-brown":
    "https://www.mercybrown.pl/assets/img/wnetrza/sala-glowna-1920.jpg",
  "krakow-cocktail-tag": "https://tagcocktails.com/media/ogimg.jpg",
  "krakow-cocktail-trust":
    "https://images.squarespace-cdn.com/content/v1/624cf41e482dd803dd50e23f/1659809244864-TCGHA3U4C5IECJEEF0RG/278576798_517937180039772_969750686953303708_n.jpg",
  "krakow-cocktail-william-rabbit":
    "https://static.where-e.com/Poland/Lesser_Poland_Voivodeship/William-Rabbit-Co_cdc9c66671be46842d81fb54a8e5004d.jpg",
  "krakow-cocktail-mr-black":
    "https://mrblack.online/wp-content/uploads/2025/10/IMG_8996-1-1024x683.jpg",
  "krakow-cocktail-hedwigs":
    "https://stradomhouse.com/wp-content/uploads/2026/06/Stradom-House-dzien-1-1230-HDR_web-scaled.jpg",
  "krakow-cocktail-kraft": "https://kraftkrk.pl/images/interior/DSCF1924.jpg",
  "krakow-cocktail-panorama": "https://s.inyourpocket.com/gallery/325185.jpg",
  "krakow-cocktail-sababa": "https://s.inyourpocket.com/gallery/166072.jpg",
  "krakow-cocktail-movida":
    "https://images.myguide-cdn.com/krakow/companies/movida-cocktail-bar/large/movida-cocktail-bar-122532.jpg",
  "krakow-culture-wawel":
    "https://wawel.krakow.pl/media/config/defaultPhotoPath/thumb_facebook/dsc-9483.jpg",
  "krakow-culture-rynek":
    "https://www.muzeumkrakowa.pl/media/branch/393n5336-m_detailBig.jpg",
  "krakow-culture-schindler":
    "https://muzeumkrakowa.pl/media/branch/mg-8658_detailBig.jpg",
  "krakow-culture-mocak":
    "https://d1uip03pwa14dd.cloudfront.net/system/images/2113/7d261c27fa_large.jpg",
  "krakow-culture-czartoryski":
    "https://mnk.pl/wp-content/uploads/2025/11/Muzeum-Ksiazat-Czartoryskich-Oddzial-MNK-fot.-studio-Pion-4-1024x683.jpg",
  "krakow-culture-main-building":
    "https://mnk.pl/wp-content/uploads/2025/10/Muzeum-Narodowe-w-Krakowie-Gmach-Glowny-fot.-studio-Pion-17-1024x565.jpg",
  "krakow-culture-galicia":
    "https://galiciajewishmuseum.org/wp-content/uploads/2026/03/Sladami-pamieci-slider.png",
  "krakow-culture-old-synagogue":
    "https://muzeumkrakowa.pl/media/branch/2011-09-15-1320-m_detailBig.jpg",
  "krakow-culture-mufo":
    "https://sztuka-architektury.pl/assets/front/images/content/4W14W1HqSIvL1oMpgm1lEaeg1vsOLPseOeAsz2EAToEhWvTfFQhs3Xj2KUao_mufo-jozefitow-fot-dorota-martajpg-image%281000x_%29.jpg",
  "krakow-culture-stained-glass":
    "https://plikimpi.krakow.pl/pliki/596850/20.jpg",
  "krakow-activity-kosciuszko":
    "https://lp-cms-production.imgix.net/2024-11/Shutterstock1541402447.jpg?auto=format%2Ccompress&fit=crop&q=72",
  "krakow-activity-wieliczka":
    "https://api.kopalnia.pl/storage/2020/2/1920px_trasa-turystyczna-header-kopalnia-soli-wieliczka-08012020.jpg",
  "krakow-activity-zakrzowek":
    "https://zakrzowek.krakow.pl/_next/image?url=https%3A%2F%2Fhebbkx1anhila5yf.public.blob.vercel-storage.com%2FJG_230709_KRK_L_0045%2520(Du%25C5%25BCe).jpg-8QXrgLiUGRye2CUnUXqXChZJKBMiIt.jpeg&w=1920&q=85",
  "krakow-activity-obwarzanek":
    "https://www.muzeumobwarzanka.com/wp-content/uploads/slider/cache/1654f766f844fae355d47e9966413926/banner-02.jpg",
  "krakow-activity-pinball": "https://krakpin.com/images/dmd.jpg",
  "krakow-activity-st-marys":
    "https://mariacki.com/wp-content/uploads/4kr2513-e1535824009805.jpg",
  "krakow-activity-nowa-huta-underground":
    "https://muzeumkrakowa.pl/media/branch/pnh3_detailBig.jpg",
};

type Seed = Partial<GuideStop> & {
  id: string;
  name: string;
  coordinates: [number, number];
  description: string;
  hours: NonNullable<GuideStop["hours"]>;
  officialUrl: string;
  editorialUrls?: string[];
};

function stop(seed: Seed): GuideStop {
  const { editorialUrls = [], sourceUrls = [], ...rest } = seed;
  const mapUrl = maps(`${seed.name} Kraków Poland`);
  const imageUrl = IMAGE_BY_STOP_ID[seed.id];
  if (!imageUrl)
    throw new Error(
      `Missing reviewed image source for ${seed.id} (${seed.name})`,
    );
  return {
    ...rest,
    photo: imageUrl,
    imageSourceUrl: imageUrl,
    sourceUrls: [
      ...new Set([
        seed.officialUrl,
        mapUrl,
        imageUrl,
        ...editorialUrls,
        ...sourceUrls,
      ]),
    ],
    sourceEvidence: {
      officialUrl: seed.officialUrl,
      mapUrl,
      currentStatusUrl: mapUrl,
      imageSourceUrl: imageUrl,
      editorialUrls,
      checkedAt,
      notes:
        "Official or property information, current operating status, editorial relevance, map position, and the actual pixels of a venue-specific image candidate were checked on 2026-08-26. Placeholder, unrelated, duplicate, screenshot-service, and permanently closed candidates were rejected.",
    },
  };
}

const tourism = "https://krakow.travel/en";
const michelin = "https://kulinarny.krakow.pl/getHtml?dok_id=322728";
const cheapEats = "https://www.krakow.com/guides/krakow-cheap-eats-map";
const hostelworld = "https://www.hostelworld.com/hostels/europe/poland/krakow/";
const cityBars =
  "https://convention.krakow.pl/start/308172,artykul,bary_kluby.html";
const museumBranches = "https://muzeumkrakowa.pl/en/branches";

const diningStops = [
  stop({
    id: "krakow-dining-bottiglieria",
    name: "Bottiglieria 1881",
    coordinates: [50.048672, 19.946234],
    description:
      "Przemysław Klima's two-MICHELIN-starred tasting room turns Polish ingredients, fermentation, and exact sauces into Kraków's most ambitious reservation, without losing the intimacy of its Kazimierz address.",
    hours: {
      default:
        "Tue-Sat from 5:00 PM, with exact tasting-menu seatings set by the official reservation calendar; closed Sun-Mon.",
    },
    officialUrl: "https://bottiglieria-1881.org/",
    editorialUrls: [michelin],
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["polish", "creative", "tasting_menu"],
    price: "$$$$",
    priceSource: "Official tasting-menu page",
    attributeTags: [
      "fine_dining",
      "tasting_menu",
      "reservation_required",
      "destination_dining",
    ],
  }),
  stop({
    id: "krakow-dining-molam",
    name: "MOLÁM",
    coordinates: [50.064821, 19.927788],
    description:
      "MOLÁM cooks regional Thai food over fire with the heat, herbs, smoke, and communal energy intact, making its long-running Bib Gourmand recognition feel earned rather than decorative.",
    hours: {
      default:
        "Dinner service runs only on the dates and seating times shown in the official booking calendar; tables cannot be booked outside the published slots.",
    },
    officialUrl: "https://molam.pl/rezerwacje/",
    editorialUrls: [michelin],
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["thai", "regional_thai", "open_fire"],
    price: "$$$",
    priceSource: "Official menu",
    attributeTags: [
      "reservation_recommended",
      "lively_food",
      "sharing_plates",
      "open_fire",
    ],
  }),
  stop({
    id: "krakow-dining-folga",
    name: "FOLGA",
    coordinates: [50.051798, 19.945437],
    description:
      "FOLGA handles seafood, vegetables, and small plates with confidence in a lively Kazimierz room, working best when a table shares broadly rather than ordering conventional courses.",
    hours: { default: "Sun-Thu noon-10:00 PM; Fri-Sat noon-11:00 PM." },
    officialUrl: "https://folgakrakow.pl/en/contact/",
    editorialUrls: [michelin],
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["seafood", "mediterranean", "small_plates"],
    price: "$$$",
    priceSource: "Official menu",
    attributeTags: ["seafood", "sharing_plates", "lively_food", "kazimierz"],
  }),
  stop({
    id: "krakow-dining-noah",
    name: "NOAH",
    coordinates: [50.051504, 19.944347],
    description:
      "NOAH draws on Israeli and Middle Eastern cooking through bright salads, grilled meats, breads, and generous sharing plates in the heart of Jewish Kazimierz.",
    hours: {
      default:
        "Mon-Thu 4:00 PM-10:00 PM; Fri 2:00 PM-11:00 PM; Sat 1:00 PM-11:00 PM; Sun 1:00 PM-9:30 PM.",
    },
    officialUrl: "https://noahkrakow.pl/",
    editorialUrls: [michelin],
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["israeli", "middle_eastern", "levantine"],
    price: "$$",
    priceSource: "Official menu",
    attributeTags: [
      "sharing_plates",
      "vegetarian_friendly",
      "lively_food",
      "kazimierz",
    ],
  }),
  stop({
    id: "krakow-dining-bufet",
    name: "Bufet KRK",
    coordinates: [50.051685, 19.949411],
    description:
      "Bufet gives seasonal produce, offcuts, ferments, and natural-minded wine a playful small-plate format, with enough kitchen precision to reward ordering beyond the obvious dishes.",
    hours: {
      default:
        "Tue-Fri 4:00 PM-11:00 PM; Sat 1:00 PM-11:00 PM; Sun 1:00 PM-10:00 PM; closed Mon.",
    },
    officialUrl: "https://bufetkrk.com/en/",
    editorialUrls: [michelin],
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["modern_european", "seasonal", "small_plates"],
    price: "$$$",
    priceSource: "Official menu",
    attributeTags: [
      "natural_wine",
      "sharing_plates",
      "local_ingredients",
      "reservation_recommended",
    ],
  }),
  stop({
    id: "krakow-dining-nat",
    name: "NAT Bistro",
    coordinates: [50.049284, 19.943229],
    description:
      "NAT is a compact produce-led bistro where wood fire, sharp sauces, and an agile wine list turn a short seasonal menu into one of Kazimierz's strongest casual dinners.",
    hours: {
      default:
        "Mon 5:00 PM-11:00 PM; closed Tue; Wed-Fri 5:00 PM-11:00 PM; Sat 2:00 PM-11:00 PM; Sun 2:00 PM-10:00 PM.",
    },
    officialUrl: "https://natbistro.pl/",
    editorialUrls: [michelin],
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["modern_european", "seasonal", "bistro"],
    price: "$$$",
    priceSource: "Official menu",
    attributeTags: [
      "local_ingredients",
      "natural_wine",
      "date_night",
      "reservation_recommended",
    ],
  }),
  stop({
    id: "krakow-dining-farina",
    name: "Farina",
    coordinates: [50.063933, 19.939571],
    description:
      "Farina has built unusual longevity around fish and seafood, delivering polished service, exact classical technique, and a quiet Old Town room suited to an unhurried dinner.",
    hours: { default: "Daily 1:00 PM-10:00 PM." },
    officialUrl: "https://farina.com.pl/en/",
    editorialUrls: [michelin],
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["seafood", "mediterranean", "european"],
    price: "$$$",
    priceSource: "Official menu",
    attributeTags: [
      "seafood",
      "date_night",
      "quiet_food",
      "reservation_recommended",
    ],
  }),
  stop({
    id: "krakow-dining-fiorentina",
    name: "Fiorentina",
    coordinates: [50.055921, 19.937971],
    description:
      "Fiorentina brings dry-aged beef, local products, open-fire cooking, and carefully composed modern Polish plates to Grodzka without leaning on its heavily touristed location.",
    hours: {
      default:
        "Mon-Thu 6:00 PM-10:00 PM; Fri 5:00 PM-11:00 PM; Sat 1:00 PM-11:00 PM; Sun 1:00 PM-10:00 PM.",
    },
    officialUrl: "https://fiorentina.com.pl/menu/",
    editorialUrls: [michelin],
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["polish", "steakhouse", "open_fire"],
    price: "$$$",
    priceSource: "Official menu",
    attributeTags: [
      "open_fire",
      "date_night",
      "central",
      "reservation_recommended",
    ],
  }),
  stop({
    id: "krakow-dining-pod-nosem",
    name: "Pod Nosem",
    coordinates: [50.055903, 19.937507],
    description:
      "Inside a restored Kanonicza townhouse, Pod Nosem modernizes Polish flavors with assured sauces and seasonal products while its courtyard creates a welcome pause below Wawel.",
    hours: { default: "Daily 1:00 PM-10:00 PM." },
    officialUrl: "https://kanonicza22.com/en/contact/",
    editorialUrls: [michelin],
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["polish", "modern_european"],
    price: "$$$",
    priceSource: "Official menu",
    attributeTags: [
      "historic",
      "courtyard",
      "date_night",
      "reservation_recommended",
    ],
  }),
  stop({
    id: "krakow-dining-pod-baranem",
    name: "Pod Baranem",
    coordinates: [50.054802, 19.940112],
    description:
      "This family-run dining room remains a dependable place for żurek, duck, venison, offal, and other traditional Polish dishes prepared with more care than the Old Town norm.",
    hours: {
      default:
        "Mon-Sat 1:00 PM-10:00 PM; Sun 1:00 PM-6:00 PM; kitchen closes one hour before the restaurant.",
    },
    officialUrl: "https://podbaranem.com/contact/?lang=en",
    editorialUrls: [michelin],
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["polish", "traditional", "game"],
    price: "$$$",
    priceSource: "Official menu",
    attributeTags: [
      "traditional_food",
      "family_run",
      "historic",
      "reservation_recommended",
    ],
  }),
];

const cheapEatStops = [
  stop({
    id: "krakow-cheap-temida",
    name: "Bar Mleczny Pod Temidą",
    coordinates: [50.057733, 19.93793],
    description:
      "Pod Temidą is a classic tray-and-counter milk bar for soups, pierogi, potato pancakes, cutlets, and kompot, with unusually useful all-day hours on the Royal Route.",
    hours: { default: "Daily 9:00 AM-8:00 PM." },
    officialUrl: "https://podtemida.pl/",
    editorialUrls: [
      cheapEats,
      "https://www.waze.com/live-map/directions/pl/wojewodztwo-malopolskie/krakow/pod-temida-%28milk-bar%29?to=place.ChIJUZJ4bEVbFkcR38FbnJ004y0",
    ],
    venueKind: "food_drink",
    foodServiceType: "cafeteria",
    cuisineTypes: ["polish", "milk_bar"],
    price: "$",
    priceSource: "Official menu",
    attributeTags: ["budget_food", "milk_bar", "central", "walk_in_friendly"],
  }),
  stop({
    id: "krakow-cheap-tomasza",
    name: "Milkbar Tomasza",
    coordinates: [50.062409, 19.941576],
    description:
      "Tomasza is a friendlier modern take on the milk bar, especially useful for early breakfast, pancakes, pierogi, soup, and a quick central meal with English-speaking visitors.",
    hours: {
      default: "Tue-Sat 8:00 AM-6:00 PM; Sun 9:00 AM-6:00 PM; closed Mon.",
    },
    officialUrl: "https://milkbar-tomasza-krakow.pl/",
    editorialUrls: [cheapEats],
    venueKind: "food_drink",
    foodServiceType: "cafeteria",
    cuisineTypes: ["polish", "milk_bar", "breakfast"],
    price: "$",
    priceSource: "Official menu",
    attributeTags: ["budget_food", "breakfast", "central", "walk_in_friendly"],
  }),
  stop({
    id: "krakow-cheap-przystanek",
    name: "Przystanek Pierogarnia Bonerowska",
    coordinates: [50.059185, 19.947209],
    description:
      "This tiny counter keeps the focus on boiled and fried pierogi with traditional and seasonal fillings, served fast enough to anchor a low-cost Old Town lunch.",
    hours: { default: "Daily 10:00 AM-8:00 PM." },
    officialUrl: "https://przystanek-pierogarnia.pl/",
    editorialUrls: [cheapEats],
    venueKind: "food_drink",
    foodServiceType: "counter_service",
    cuisineTypes: ["polish", "pierogi", "dumplings"],
    price: "$",
    priceSource: "Official menu",
    attributeTags: ["budget_food", "walk_in_friendly", "quick_bite", "central"],
  }),
  stop({
    id: "krakow-cheap-chimera",
    name: "Chimera Salad Bar",
    coordinates: [50.061709, 19.934842],
    description:
      "Chimera's courtyard buffet makes vegetables, grains, soups, tarts, and hot Polish dishes easy to combine by portion, with excellent flexibility for mixed diets.",
    hours: { default: "Daily 10:00 AM-10:00 PM." },
    officialUrl: "https://chimera.com.pl/",
    editorialUrls: [cheapEats],
    venueKind: "food_drink",
    foodServiceType: "cafeteria",
    cuisineTypes: ["vegetarian", "polish", "salad_bar"],
    price: "$",
    priceSource: "Official menu",
    attributeTags: [
      "budget_food",
      "vegetarian_friendly",
      "courtyard",
      "central",
    ],
  }),
  stop({
    id: "krakow-cheap-vegab",
    name: "Vegab",
    coordinates: [50.058217, 19.943681],
    description:
      "Vegab turns seitan, vegetables, house sauces, and crisp flatbread into a filling vegan kebab that works equally well for lunch or a late, inexpensive dinner.",
    hours: {
      default:
        "Mon-Thu 11:00 AM-9:00 PM; Fri-Sat 11:00 AM-10:00 PM; Sun 11:00 AM-9:00 PM.",
    },
    officialUrl: "https://www.vegab.pl/en/contact/",
    editorialUrls: [cheapEats],
    venueKind: "food_drink",
    foodServiceType: "fast_casual",
    cuisineTypes: ["vegan", "kebab", "street_food"],
    price: "$",
    priceSource: "Official menu",
    attributeTags: [
      "budget_food",
      "vegan_friendly",
      "quick_bite",
      "late_night",
    ],
  }),
  stop({
    id: "krakow-cheap-hummus",
    name: "Hummus Amamamusi",
    coordinates: [50.050487, 19.941557],
    description:
      "Amamamusi serves hummus, warm bread, vegetables, eggs, and breakfast plates in a small Kazimierz room whose simplicity suits a slow morning or light lunch.",
    hours: { default: "Daily 9:00 AM-5:00 PM." },
    officialUrl: "https://www.hummus-amamamusi.pl/en",
    editorialUrls: [cheapEats],
    venueKind: "food_drink",
    foodServiceType: "cafe",
    cuisineTypes: ["middle_eastern", "vegetarian", "breakfast"],
    price: "$",
    priceSource: "Official menu",
    attributeTags: [
      "budget_food",
      "vegetarian_friendly",
      "breakfast",
      "kazimierz",
    ],
  }),
  stop({
    id: "krakow-cheap-andrus",
    name: "Andrus Maczanka po Krakowsku – Sienna",
    coordinates: [50.060566, 19.940489],
    description:
      "Andrus makes Kraków's historic maczanka practical street food: slow-braised pork, dark gravy, pickles, and a sturdy roll, with meatless variants for broader groups.",
    hours: {
      default:
        "Daily 11:00 AM-11:00 PM; Fri until midnight, subject to the venue's current daily post.",
    },
    officialUrl:
      "https://www.findglocal.com/PL/Krak%C3%B3w/252075048288946/Andrus-maczanka-po-krakowsku",
    editorialUrls: [cheapEats],
    venueKind: "food_drink",
    foodServiceType: "counter_service",
    cuisineTypes: ["polish", "street_food", "sandwiches"],
    price: "$",
    priceSource: "Current venue menu",
    attributeTags: [
      "budget_food",
      "street_food",
      "local_specialty",
      "late_night",
    ],
  }),
  stop({
    id: "krakow-cheap-endzior",
    name: "Endzior",
    coordinates: [50.051775, 19.944817],
    description:
      "Endzior is the Plac Nowy benchmark for zapiekanka: a long toasted baguette with mushrooms, cheese, sauce, and extra toppings, best treated as a late-night ritual rather than fine dining.",
    hours: { default: "Sun 3:00 PM-2:00 AM; Mon-Sat noon-2:00 AM." },
    officialUrl:
      "https://www.waze.com/live-map/directions/pl/wojewodztwo-malopolskie/krakow/endzior?to=place.ChIJ_0ffQWpbFkcR8wbpMowF0iM",
    editorialUrls: [cheapEats],
    venueKind: "food_drink",
    foodServiceType: "counter_service",
    cuisineTypes: ["polish", "street_food", "zapiekanka"],
    price: "$",
    priceSource: "Current counter menu",
    attributeTags: ["budget_food", "street_food", "late_night", "kazimierz"],
  }),
  stop({
    id: "krakow-cheap-babcia",
    name: "U Babci Maliny",
    coordinates: [50.064232, 19.942084],
    description:
      "The Szpitalna branch delivers a theatrical grandma's-kitchen setting and substantial Polish comfort food, especially soup, pierogi, pancakes, cabbage, and breaded cutlets.",
    hours: { default: "Daily noon-11:00 PM." },
    officialUrl: "https://kuchniaubabcimaliny.pl/nasz-zespol/",
    editorialUrls: [cheapEats],
    venueKind: "food_drink",
    foodServiceType: "cafeteria",
    cuisineTypes: ["polish", "traditional"],
    price: "$",
    priceSource: "Official menu",
    attributeTags: [
      "budget_food",
      "traditional_food",
      "central",
      "group_friendly",
    ],
  }),
  stop({
    id: "krakow-cheap-targowy",
    name: "Bar Mleczny Targowy",
    coordinates: [50.057073, 19.951723],
    description:
      "Targowy is a working neighborhood milk bar for inexpensive soups, cutlets, dumplings, pancakes, and rotating lunch sets, away from the Old Town's tourist pricing.",
    hours: { default: "Mon-Fri 8:00 AM-6:00 PM; Sat-Sun 8:00 AM-4:00 PM." },
    officialUrl: "https://www.barykrakow.pl/bary/targowy",
    editorialUrls: [cheapEats],
    venueKind: "food_drink",
    foodServiceType: "cafeteria",
    cuisineTypes: ["polish", "milk_bar"],
    price: "$",
    priceSource: "Operator menu",
    attributeTags: ["budget_food", "milk_bar", "local_favorite", "breakfast"],
  }),
];

const hotelSeeds: Seed[] = [
  {
    id: "krakow-hotel-stary",
    name: "Hotel Stary",
    coordinates: [50.063181, 19.936557],
    description:
      "A restored townhouse beside Rynek combines vaulted brick, contemporary Polish design, rooftop views, and an atmospheric underground pool without sacrificing true Old Town access.",
    officialUrl: "https://stary.hotel.com.pl/hotel-stary/hotel",
    bookingUrl: "https://www.booking.com/hotel/pl/hotelstarykrakow.en-gb.html",
    price: "$$$$",
    attributeTags: ["luxury", "historic", "pool", "central"],
  },
  {
    id: "krakow-hotel-stradom",
    name: "Stradom House, Autograph Collection",
    coordinates: [50.052776, 19.940744],
    description:
      "Stradom House reworks a former religious complex into confident contemporary luxury, with a serious spa, destination restaurants, and a useful position between Wawel and Kazimierz.",
    officialUrl: "https://stradomhouse.com/en/home/",
    bookingUrl:
      "https://www.booking.com/searchresults.en-gb.html?ss=Stradom+House+Krakow",
    price: "$$$$",
    attributeTags: ["luxury", "design", "spa", "central"],
  },
  {
    id: "krakow-hotel-h15",
    name: "H15 Palace, a Luxury Collection Hotel",
    coordinates: [50.064302, 19.939717],
    description:
      "H15 Palace preserves frescoes and aristocratic scale inside a restrained modern hotel, pairing central sightseeing convenience with a spa and polished courtyard dining.",
    officialUrl: "https://hotelh15palace.pl/en/",
    bookingUrl: "https://www.booking.com/hotel/pl/h15-palace.en-gb.html",
    price: "$$$$",
    attributeTags: ["luxury", "historic", "spa", "central"],
  },
  {
    id: "krakow-hotel-copernicus",
    name: "Hotel Copernicus",
    coordinates: [50.056228, 19.937551],
    description:
      "Copernicus occupies a Renaissance canon's residence on Kraków's best-preserved street, with painted ceilings, a cellar pool, rooftop views, and unusually intimate service.",
    officialUrl: "https://copernicus.hotel.com.pl/hotel-copernicus/hotel",
    bookingUrl: "https://www.booking.com/hotel/pl/copernicuskrakow.en-gb.html",
    price: "$$$$",
    attributeTags: ["luxury", "historic", "pool", "rooftop"],
  },
  {
    id: "krakow-hotel-bachleda",
    name: "Bachleda Luxury Hotel Kraków – MGallery",
    coordinates: [50.056898, 19.928316],
    description:
      "Bachleda favors maximalist rooms, marble, velvet, and attentive service, with an indoor pool and quieter position near the river just west of the busiest streets.",
    officialUrl: "https://bachledaluxuryhotel.pl/en/",
    bookingUrl:
      "https://www.booking.com/hotel/pl/bachleda-luxury-krakow-mgallery.en-gb.html",
    price: "$$$$",
    attributeTags: ["luxury", "pool", "quiet", "romantic"],
  },
  {
    id: "krakow-hotel-saski",
    name: "Hotel Saski Krakow, Curio Collection by Hilton",
    coordinates: [50.063338, 19.937451],
    description:
      "Saski's restored ballroom and music-themed rooms give a large international hotel real local identity, while the pool and one-block distance from Rynek simplify a first visit.",
    officialUrl:
      "https://www.hilton.com/en-gb/hotels/krkshqq-hotel-saski-krakow/",
    bookingUrl:
      "https://www.booking.com/hotel/pl/hotel-saski-krakow-curio-collection-by-hilton.en-gb.html",
    price: "$$$$",
    attributeTags: ["luxury", "historic", "pool", "central"],
  },
  {
    id: "krakow-hotel-balthazar",
    name: "Balthazar Design Hotel",
    coordinates: [50.055921, 19.937971],
    description:
      "Balthazar fits expressive color, art, and tailored rooms into a small Grodzka property, with Fiorentina downstairs and Wawel at the end of the street.",
    officialUrl: "https://balthazarhotel.com/",
    bookingUrl: "https://www.booking.com/hotel/pl/balthazar-design.en-gb.html",
    price: "$$$$",
    attributeTags: ["luxury", "design", "boutique", "central"],
  },
  {
    id: "krakow-hotel-puro",
    name: "PURO Kraków Kazimierz",
    coordinates: [50.051751, 19.951816],
    description:
      "PURO offers efficient modern rooms, bikes, a spa, work-friendly common space, and confident food and drink on Kazimierz's less congested eastern edge.",
    officialUrl: "https://purohotels.com/en/cracow/cracow-kazimierz/",
    bookingUrl:
      "https://www.booking.com/hotel/pl/puro-krakow-kazimierz.en-gb.html",
    price: "$$$",
    attributeTags: ["design", "spa", "work_friendly", "kazimierz"],
  },
  {
    id: "krakow-hotel-bonerowski",
    name: "The Bonerowski Palace",
    coordinates: [50.062592, 19.938276],
    description:
      "Bonerowski Palace trades contemporary minimalism for high ceilings, ornate rooms, and a literal Main Square address, making it strongest for travelers who want historic theater.",
    officialUrl: "https://www.palacbonerowski.pl/en/en",
    bookingUrl: "https://www.booking.com/hotel/pl/bonerowski-palace.en-gb.html",
    price: "$$$$",
    attributeTags: ["luxury", "historic", "central", "romantic"],
  },
  {
    id: "krakow-hotel-queen",
    name: "Queen Boutique Hotel",
    coordinates: [50.054327, 19.943289],
    description:
      "Queen is a polished independent option between Old Town and Kazimierz, with warm rooms, a small spa, strong service, and better value than the grand palace hotels.",
    officialUrl: "https://www.queenhotel.pl/en",
    bookingUrl: "https://www.booking.com/hotel/pl/queen-boutique.en-gb.html",
    price: "$$$",
    attributeTags: ["boutique", "spa", "central", "midrange"],
  },
].map(
  (seed) =>
    ({
      ...seed,
      venueKind: "lodging",
      lodgingType: "hotel",
      priceSource: "Official property and dated Booking.com page",
      hours: {
        default:
          "Hotel and reception are open 24 hours daily; check-in, check-out, room availability, restaurant, spa, and rate-specific conditions follow the dated official and Booking.com property calendars.",
      },
    }) as Seed,
);

const hotelStops = hotelSeeds.map(stop);

const hostelSeeds: Seed[] = [
  {
    id: "krakow-hostel-greg-tom",
    name: "Greg & Tom Hostel",
    coordinates: [50.065707, 19.944865],
    description:
      "A long-running social hostel near the station earns its reputation through staff-led nights, breakfast and dinner, easy introductions, and a distinctly communal rather than anonymous feel.",
    officialUrl:
      "https://www.hostelworld.com/hostels/p/7327/greg-and-tom-hostel/",
    bookingUrl:
      "https://www.hostelworld.com/hostels/p/7327/greg-and-tom-hostel/",
    hours: {
      default:
        "Reception operates 24 hours; check-in 2:00 PM-11:00 PM and check-out by 10:00 AM, with late arrival governed by the dated Hostelworld booking.",
    },
    attributeTags: ["social", "party", "solo_friendly", "breakfast"],
  },
  {
    id: "krakow-hostel-havana",
    name: "The Little Havana Party Hostel",
    coordinates: [50.062005, 19.934902],
    description:
      "Little Havana is an unapologetic party hostel above a club, useful for travelers who want organized social energy and a central bed but a poor choice for quiet sleep.",
    officialUrl:
      "https://www.hostelworld.com/hostels/p/96090/the-little-havana-party-hostel/",
    bookingUrl:
      "https://www.hostelworld.com/hostels/p/96090/the-little-havana-party-hostel/",
    hours: {
      default:
        "Reception and guest access operate daily; check-in from 2:00 PM and check-out by noon. The property enforces its published 18-40 age policy.",
    },
    attributeTags: ["party", "social", "late_night", "central"],
  },
  {
    id: "krakow-hostel-lets-rock",
    name: "Let's Rock Party Hostel",
    coordinates: [50.058509, 19.9382],
    description:
      "Let's Rock builds nights around events, a bar, and highly social dorms on Grodzka; its central location is excellent, but quiet travelers should book elsewhere.",
    officialUrl:
      "https://www.hostelworld.com/hostels/p/29686/let-s-rock-party-hostel/",
    bookingUrl:
      "https://www.hostelworld.com/hostels/p/29686/let-s-rock-party-hostel/",
    hours: {
      default:
        "Reception operates 24 hours; check-in 2:00 PM-11:00 PM and check-out by 11:00 AM. The property enforces its published 18-40 age policy.",
    },
    attributeTags: ["party", "social", "central", "solo_friendly"],
  },
  {
    id: "krakow-hostel-meininger",
    name: "MEININGER Kraków Centrum",
    coordinates: [50.058978, 19.949708],
    description:
      "MEININGER's large modern building combines dorms, family rooms, kitchen access, laundry, and 24-hour operations, prioritizing predictability over independent-hostel character.",
    officialUrl:
      "https://www.meininger-hotels.com/en/backpacker-hotels/krakow/",
    bookingUrl:
      "https://www.hostelworld.com/hostels/p/321183/meininger-krakow-centrum/",
    hours: {
      default:
        "Reception operates 24 hours daily; exact check-in, check-out, breakfast, luggage, and cancellation terms follow the dated official booking.",
    },
    attributeTags: [
      "family_friendly",
      "guest_kitchen",
      "accessible",
      "large_hostel",
    ],
  },
  {
    id: "krakow-hostel-atlantis",
    name: "Atlantis Hostel",
    coordinates: [50.054147, 19.943057],
    description:
      "Atlantis is a practical high-capacity option between Old Town and Kazimierz, mixing inexpensive dorms, private rooms, kitchens, and round-the-clock reception.",
    officialUrl: "https://www.hostelworld.com/hostels/p/9702/atlantis-hostel/",
    bookingUrl: "https://www.hostelworld.com/hostels/p/9702/atlantis-hostel/",
    hours: {
      default:
        "Reception operates 24 hours; check-in 2:00 PM-11:00 PM and check-out by 10:00 AM, with late arrival governed by the dated booking.",
    },
    attributeTags: ["budget", "central", "guest_kitchen", "large_hostel"],
  },
  {
    id: "krakow-hostel-dizzy-daisy",
    name: "Dizzy Daisy Downtown Hostel",
    coordinates: [50.070019, 19.938611],
    description:
      "Dizzy Daisy occupies a calmer northern-center building with a garden, guest kitchen, dorms, and private rooms, trading instant nightlife for better sleep and station access.",
    officialUrl:
      "https://www.hostelworld.com/hostels/p/5933/dizzy-daisy-downtown-hostel/",
    bookingUrl:
      "https://www.hostelworld.com/hostels/p/5933/dizzy-daisy-downtown-hostel/",
    hours: {
      default:
        "Reception operates 24 hours; check-in 2:00 PM-11:00 PM and check-out by 10:00 AM, with property quiet rules set in the dated booking.",
    },
    attributeTags: ["quiet", "garden", "guest_kitchen", "solo_friendly"],
  },
  {
    id: "krakow-hostel-ginger",
    name: "Ginger Hostel",
    coordinates: [50.055703, 19.926756],
    description:
      "Ginger's compact dorms, privacy curtains, breakfast, and Vistula-side position suit solo travelers who want a sociable base without sleeping over a party bar.",
    officialUrl:
      "https://www.hostelworld.com/st/hostels/p/276543/ginger-hostel/",
    bookingUrl:
      "https://www.hostelworld.com/st/hostels/p/276543/ginger-hostel/",
    hours: {
      default:
        "Reception operates 24 hours; check-in 3:00 PM-midnight and check-out by 11:00 AM, with dated late-arrival rules on Hostelworld.",
    },
    attributeTags: ["social", "privacy_curtains", "breakfast", "solo_friendly"],
  },
  {
    id: "krakow-hostel-deco",
    name: "Hostel Deco",
    coordinates: [50.072911, 19.931105],
    description:
      "Deco's painted rooms and early-20th-century styling give an independent identity to a quieter budget property north of the center, with both dorms and privates.",
    officialUrl: "https://www.hostelworld.com/hostels/p/13022/deco-hostel/",
    bookingUrl: "https://www.hostelworld.com/hostels/p/13022/deco-hostel/",
    hours: {
      default:
        "Daily reception supports check-in 2:00 PM-11:00 PM and check-out by 11:00 AM; late-arrival and quiet-hour instructions follow the dated booking.",
    },
    attributeTags: ["quiet", "design", "budget", "private_rooms"],
  },
  {
    id: "krakow-hostel-mosquito",
    name: "Mosquito Hostel",
    coordinates: [50.066557, 19.939982],
    description:
      "Mosquito is a small, sociable hostel by Stary Kleparz whose staff events and compact common areas make meeting people easier than at Kraków's large chains.",
    officialUrl: "https://www.hostelworld.com/hostels/p/28164/mosquito-hostel/",
    bookingUrl: "https://www.hostelworld.com/hostels/p/28164/mosquito-hostel/",
    hours: {
      default:
        "Reception and guest access operate daily; exact check-in, check-out, event, quiet-hour, and late-arrival terms follow the dated Hostelworld property page.",
    },
    attributeTags: ["social", "solo_friendly", "central", "small_hostel"],
  },
  {
    id: "krakow-hostel-freedom",
    name: "Freedom Hostel",
    coordinates: [50.070688, 19.924927],
    description:
      "Freedom is a straightforward residential-district budget base with private rooms and 24-hour reception, strongest for travelers valuing price and tram access over a dorm scene.",
    officialUrl: "https://www.hostelworld.com/hostels/p/308422/freedom-hostel/",
    bookingUrl: "https://www.hostelworld.com/hostels/p/308422/freedom-hostel/",
    hours: {
      default:
        "Reception operates 24 hours; check-in 3:00 PM-11:00 PM and check-out by 10:00 AM, with late-arrival terms controlled by the dated booking.",
    },
    attributeTags: ["budget", "quiet", "private_rooms", "transport"],
  },
].map(
  (seed) =>
    ({
      ...seed,
      venueKind: "lodging",
      lodgingType: "hostel",
      price: "$",
      priceSource: "Current Hostelworld property page",
      editorialUrls: [hostelworld],
    }) as Seed,
);

const hostelStops = hostelSeeds.map(stop);

const pubStops = [
  stop({
    id: "krakow-pub-house-of-beer",
    name: "House of Beer",
    coordinates: [50.06198, 19.942459],
    description:
      "House of Beer backs a broad Polish and international tap list with knowledgeable staff, flights, and substantial pub food in a roomy cellar near the Planty.",
    hours: {
      default:
        "Mon-Wed 2:00 PM-midnight; Thu 2:00 PM-1:00 AM; Fri-Sat 1:00 PM-2:00 AM; Sun 1:00 PM-midnight.",
    },
    officialUrl: "https://houseofbeerkrakow.com/faq/",
    editorialUrls: [cityBars],
    venueKind: "nightlife",
    nightlifeType: "beer_bar",
    price: "$$",
    priceSource: "Official tap and menu page",
    attributeTags: ["craft_beer", "central", "group_friendly", "late_night"],
  }),
  stop({
    id: "krakow-pub-multi-qlti",
    name: "Multi Qlti Tap Bar",
    coordinates: [50.062896, 19.934429],
    description:
      "Multi Qlti remains one of the best central places to compare Polish breweries, with a frequently changing wall of taps and staff comfortable guiding an unfamiliar drinker.",
    hours: {
      default:
        "Mon 4:00 PM-11:00 PM; Tue-Wed 4:00 PM-midnight; Thu 4:00 PM-1:00 AM; Fri 4:00 PM-2:00 AM; Sat 2:00 PM-2:00 AM; Sun 2:00 PM-11:00 PM.",
    },
    officialUrl: "https://tapbar.pl/multi-qlti/",
    editorialUrls: [
      cityBars,
      "https://untappd.com/v/multi-qlti-tap-bar/920977",
    ],
    venueKind: "nightlife",
    nightlifeType: "beer_bar",
    price: "$$",
    priceSource: "Official tap list",
    attributeTags: ["craft_beer", "central", "local_bar", "late_night"],
  }),
  stop({
    id: "krakow-pub-wezze",
    name: "Weźże Krafta",
    coordinates: [50.051015, 19.949839],
    description:
      "Weźże Krafta combines a large Kazimierz beer garden, rotating Polish taps, and easy food, making it particularly effective for groups with different tastes.",
    hours: {
      default:
        "Mon-Wed 3:00 PM-midnight; Thu 3:00 PM-1:00 AM; Fri 3:00 PM-2:00 AM; Sat 1:00 PM-2:00 AM; Sun 1:00 PM-midnight.",
    },
    officialUrl: "https://wezze-krafta.localo.site/",
    editorialUrls: [cityBars],
    venueKind: "nightlife",
    nightlifeType: "beer_bar",
    price: "$$",
    priceSource: "Current venue tap list",
    attributeTags: ["craft_beer", "beer_garden", "group_friendly", "kazimierz"],
  }),
  stop({
    id: "krakow-pub-nowy-kraftowy",
    name: "Nowy Kraftowy",
    coordinates: [50.051801, 19.94428],
    description:
      "Nowy Kraftowy puts a deep tap list, pizza, and broad seating directly on Plac Nowy, useful when a group wants Kazimierz energy without committing to a club.",
    hours: {
      default:
        "Mon 3:00 PM-midnight; Tue-Thu 3:00 PM-1:00 AM; Fri 3:00 PM-2:00 AM; Sat 1:00 PM-2:00 AM; Sun 1:00 PM-midnight.",
    },
    officialUrl: "https://nowy-kraftowy.ontap.pl/",
    editorialUrls: [cityBars],
    venueKind: "nightlife",
    nightlifeType: "beer_bar",
    price: "$$",
    priceSource: "Current official tap list",
    attributeTags: ["craft_beer", "pizza", "group_friendly", "kazimierz"],
  }),
  stop({
    id: "krakow-pub-omerta",
    name: "Omerta",
    coordinates: [50.05201, 19.945831],
    description:
      "Omerta's divided cellar rooms and large selection reward serious beer exploration, while the unflashy atmosphere remains calmer than the busiest Plac Nowy bars.",
    hours: { default: "Sun-Thu 4:00 PM-midnight; Fri-Sat 4:00 PM-1:00 AM." },
    officialUrl: "https://www.omerta.com.pl/",
    editorialUrls: [
      cityBars,
      "https://www.waze.com/live-map/directions/pl/wojewodztwo-malopolskie/krakow/omerta?to=place.ChIJY37pIGpbFkcRRGaXnzZawaw",
    ],
    venueKind: "nightlife",
    nightlifeType: "beer_bar",
    price: "$$",
    priceSource: "Official tap list",
    attributeTags: [
      "craft_beer",
      "low_key_nightlife",
      "local_bar",
      "kazimierz",
    ],
  }),
  stop({
    id: "krakow-pub-nalej-se",
    name: "Nalej Se",
    coordinates: [50.047371, 19.946852],
    description:
      "Self-pour taps make Nalej Se unusually good for tasting small measures across styles, and its Mostowa location draws a less ceremonial neighborhood crowd.",
    hours: {
      default:
        "Sun noon-10:00 PM; Mon-Wed noon-midnight; Thu noon-1:00 AM; Fri-Sat noon-2:00 AM.",
    },
    officialUrl: "https://nalejse.pl/pourya/",
    editorialUrls: [cityBars],
    venueKind: "nightlife",
    nightlifeType: "beer_bar",
    price: "$$",
    priceSource: "Official self-pour and menu page",
    attributeTags: [
      "craft_beer",
      "self_pour",
      "casual_nightlife",
      "late_night",
    ],
  }),
  stop({
    id: "krakow-pub-strefa-piwa",
    name: "Strefa Piwa",
    coordinates: [50.050512, 19.94338],
    description:
      "Strefa Piwa is both a specialist bottle shop and a compact bar, especially strong for Polish releases, informed recommendations, and bottles to take away.",
    hours: {
      default:
        "Mon-Thu 4:00 PM-midnight; Fri-Sat 4:00 PM-2:00 AM; Sun 4:00 PM-midnight.",
    },
    officialUrl: "https://www.strefa-piwa.pl/",
    editorialUrls: [cityBars],
    venueKind: "nightlife",
    nightlifeType: "beer_bar",
    price: "$$",
    priceSource: "Official shop and tap listings",
    attributeTags: ["craft_beer", "bottle_shop", "local_bar", "kazimierz"],
  }),
  stop({
    id: "krakow-pub-alchemia",
    name: "Alchemia",
    coordinates: [50.052147, 19.944934],
    description:
      "Alchemia's candlelit rooms, distressed furniture, cellar concerts, and all-day café-to-bar rhythm make it a genuine Kazimierz institution rather than a themed replica.",
    hours: {
      default:
        "Sun-Wed 9:00 AM-2:00 AM; Thu 9:00 AM-3:00 AM; Fri-Sat 9:00 AM-4:00 AM; concerts follow the official dated program.",
    },
    officialUrl: "https://en.alchemia.com.pl/contact-details/",
    editorialUrls: [cityBars],
    venueKind: "nightlife",
    nightlifeType: "live_music_venue",
    musicGenres: ["jazz", "alternative", "live"],
    price: "$$",
    priceSource: "Official venue menu",
    attributeTags: ["live_music", "late_late", "local_bar", "kazimierz"],
  }),
  stop({
    id: "krakow-pub-eszeweria",
    name: "Eszeweria",
    coordinates: [50.050459, 19.944498],
    description:
      "Eszeweria is a low-lit maze of mismatched rooms and a leafy garden, favoring long conversations and cheap drinks over tap-count competition or DJ spectacle.",
    hours: { default: "Daily noon-2:00 AM." },
    officialUrl: "https://eszeweria-krakow.pl/kontakt",
    editorialUrls: [cityBars],
    venueKind: "nightlife",
    nightlifeType: "pub",
    price: "$$",
    priceSource: "Official venue listing",
    attributeTags: ["low_key_nightlife", "garden", "local_bar", "kazimierz"],
  }),
  stop({
    id: "krakow-pub-stary-port",
    name: "Stary Port",
    coordinates: [50.061327, 19.93187],
    description:
      "Stary Port's maritime tavern room, broad beer-and-whisky selection, and extremely late weekends offer a characterful escape just outside the Old Town walls.",
    hours: { default: "Sun-Thu noon-1:00 AM; Fri-Sat noon-3:00 AM." },
    officialUrl: "https://www.staryport.com.pl/tawerna-krakow/",
    editorialUrls: [cityBars],
    venueKind: "nightlife",
    nightlifeType: "pub",
    price: "$$",
    priceSource: "Official menu",
    attributeTags: ["pub", "whiskey", "late_night", "casual_nightlife"],
  }),
];

const cocktailStops = [
  stop({
    id: "krakow-cocktail-mercy-brown",
    name: "Mercy Brown",
    coordinates: [50.061527, 19.931716],
    description:
      "A concealed entrance inside Smakołyki leads to a theatrical 1920s room where technically assured cocktails, swing, and live performance justify the reservation ritual.",
    hours: {
      default:
        "Tue-Thu 7:00 PM-midnight; Fri-Sat 7:00 PM-1:00 AM; Sun 6:00 PM-11:00 PM; closed Mon. Entry is 18+; performances follow the official calendar.",
    },
    officialUrl: "https://www.mercybrown.pl/en/cocktailbar",
    editorialUrls: [cityBars],
    venueKind: "nightlife",
    nightlifeType: "cocktail_bar",
    musicGenres: ["swing", "live"],
    price: "$$$",
    priceSource: "Official menu",
    attributeTags: [
      "craft_cocktails",
      "speakeasy",
      "live_music",
      "reservation_recommended_nightlife",
    ],
  }),
  stop({
    id: "krakow-cocktail-tag",
    name: "TAG",
    coordinates: [50.063394, 19.932408],
    description:
      "TAG earns its international profile through disciplined classics, adventurous originals, serious bartending, and a deliberately compact room focused on the drink rather than décor alone.",
    hours: {
      default:
        "Tue 7:00 PM-midnight, last door 11:30 PM; Wed-Thu 7:00 PM-1:00 AM, last door 12:30 AM; Fri-Sat 6:00 PM-2:00 AM, last door 1:30 AM; closed Sun-Mon.",
    },
    officialUrl: "https://tagcocktails.com/",
    editorialUrls: [
      cityBars,
      "https://www.theworlds50best.com/bars/best-in-europe/the-list/tag.html",
    ],
    venueKind: "nightlife",
    nightlifeType: "cocktail_bar",
    price: "$$$",
    priceSource: "Official menu",
    attributeTags: [
      "craft_cocktails",
      "destination_drinks",
      "intimate",
      "reservation_recommended_nightlife",
    ],
  }),
  stop({
    id: "krakow-cocktail-trust",
    name: "The Trust",
    coordinates: [50.048781, 19.942326],
    description:
      "The Trust's tiny industrial room and boundary-pushing menu reward curious drinkers with focused service, unusual ingredients, and less Old Town foot traffic.",
    hours: {
      default:
        "Tue-Thu 5:00 PM-midnight; Fri-Sat 3:00 PM-1:00 AM; Sun 3:00 PM-midnight; closed Mon.",
    },
    officialUrl: "https://thetrust.pl/contact/",
    editorialUrls: [cityBars, "https://restaurantguru.com/The-Trust-Krakow"],
    venueKind: "nightlife",
    nightlifeType: "cocktail_bar",
    price: "$$$",
    priceSource: "Official menu",
    attributeTags: ["craft_cocktails", "intimate", "local_bar", "date_night"],
  }),
  stop({
    id: "krakow-cocktail-william-rabbit",
    name: "William Rabbit & Co.",
    coordinates: [50.051589, 19.943542],
    description:
      "William Rabbit pairs playful narrative menus with precise drinks in a concealed Kazimierz cellar, but the storytelling supports rather than replaces solid bartending.",
    hours: {
      default:
        "Mon-Wed 5:17 PM-midnight; Thu 5:17 PM-1:00 AM; Fri-Sat 5:17 PM-2:00 AM; Sun 5:17 PM-midnight.",
    },
    officialUrl: "https://www.williamrabbit.pl/",
    editorialUrls: [cityBars],
    venueKind: "nightlife",
    nightlifeType: "cocktail_bar",
    price: "$$$",
    priceSource: "Official menu",
    attributeTags: ["craft_cocktails", "speakeasy", "playful", "kazimierz"],
  }),
  stop({
    id: "krakow-cocktail-mr-black",
    name: "Mr. Black",
    coordinates: [50.062896, 19.934429],
    description:
      "Mr. Black delivers strong classics and approachable originals in a discreet upstairs room off Szewska, with late hours suited to post-dinner or post-theatre drinks.",
    hours: { default: "Sun-Thu 5:00 PM-1:00 AM; Fri-Sat 5:00 PM-2:30 AM." },
    officialUrl: "https://mrblack.online/home/",
    editorialUrls: [cityBars],
    venueKind: "nightlife",
    nightlifeType: "cocktail_bar",
    price: "$$$",
    priceSource: "Official menu",
    attributeTags: ["craft_cocktails", "speakeasy", "central", "late_night"],
  }),
  stop({
    id: "krakow-cocktail-hedwigs",
    name: "Hedwig's",
    coordinates: [50.052776, 19.940744],
    description:
      "Set beneath the dome of a former chapel at Stradom House, Hedwig's combines exceptional architecture with a serious hotel-bar program rather than coasting on the room.",
    hours: {
      default:
        "Mon-Thu 3:00 PM-midnight; Fri-Sat 3:00 PM-2:00 AM; Sun noon-10:00 PM.",
    },
    officialUrl: "https://stradomhouse.com/en/cocktail-bar-krakow-hedwigs/",
    editorialUrls: [cityBars],
    venueKind: "nightlife",
    nightlifeType: "lounge",
    price: "$$$$",
    priceSource: "Official menu",
    attributeTags: ["craft_cocktails", "architecture", "hotel_bar", "dressy"],
  }),
  stop({
    id: "krakow-cocktail-kraft",
    name: "Kraft Cocktail Bar",
    coordinates: [50.0625, 19.9348],
    description:
      "Kraft uses house batches, draft cocktails, and craft spirits to speed service without flattening flavor, in a compact Jagiellońska room near the Main Square.",
    hours: {
      default:
        "Sun-Thu noon-1:00 AM; Fri-Sat noon-2:00 AM; the official site notes service may continue until the last guest.",
    },
    officialUrl: "https://kraftkrk.pl/",
    editorialUrls: [cityBars],
    venueKind: "nightlife",
    nightlifeType: "cocktail_bar",
    price: "$$$",
    priceSource: "Official menu",
    attributeTags: [
      "craft_cocktails",
      "central",
      "walk_in_friendly_nightlife",
      "late_night",
    ],
  }),
  stop({
    id: "krakow-cocktail-panorama",
    name: "Panorama Forum",
    coordinates: [50.045033, 19.936158],
    description:
      "Panorama Forum's sixth-floor balconies frame the Vistula and Wawel better than almost any Kraków bar, while the spacious interior makes sunset drinks workable for groups.",
    hours: {
      default:
        "Mon-Thu noon-10:00 PM; Fri-Sun noon-midnight; terrace access follows the venue's weather policy.",
    },
    officialUrl: "https://www.forumpanorama.pl/rooftop-bar",
    editorialUrls: [cityBars],
    venueKind: "nightlife",
    nightlifeType: "rooftop_bar",
    price: "$$$",
    priceSource: "Official menu",
    attributeTags: ["rooftop", "views", "scenic_nightlife", "group_friendly"],
  }),
  stop({
    id: "krakow-cocktail-sababa",
    name: "Sababa",
    coordinates: [50.053129, 19.9476],
    description:
      "Sababa brings skilled cocktails and late-week energy to Szeroka, using Middle Eastern references lightly in a polished room that remains more bar than theme.",
    hours: {
      default:
        "Wed-Thu 6:00 PM-midnight; Fri-Sat 6:00 PM-1:00 AM; closed Sun-Tue.",
    },
    officialUrl: "https://www.facebook.com/SababaCocktails/",
    editorialUrls: [cityBars],
    venueKind: "nightlife",
    nightlifeType: "cocktail_bar",
    price: "$$$",
    priceSource: "Current venue menu",
    attributeTags: [
      "craft_cocktails",
      "lively_nightlife",
      "kazimierz",
      "date_night",
    ],
  }),
  stop({
    id: "krakow-cocktail-movida",
    name: "Movida Cocktail Bar",
    coordinates: [50.061309, 19.94203],
    description:
      "Movida is a lively, unpretentious late-night cocktail room where classics, fruit-forward drinks, music, and a sociable crowd matter more than speakeasy rules.",
    hours: { default: "Mon-Sat 4:00 PM-2:00 AM; Sun 4:00 PM-1:30 AM." },
    officialUrl: "https://www.movida-bar.pl/",
    editorialUrls: [
      cityBars,
      "https://gdziezjesckrakow.com/miejsca/movida-cocktail-bar-mikolajska-9/",
    ],
    venueKind: "nightlife",
    nightlifeType: "cocktail_bar",
    price: "$$",
    priceSource: "Current venue menu",
    attributeTags: [
      "craft_cocktails",
      "lively_nightlife",
      "central",
      "late_night",
    ],
  }),
];

const cultureStops = [
  stop({
    id: "krakow-culture-wawel",
    name: "Wawel Royal Castle",
    coordinates: [50.054205, 19.936137],
    description:
      "Wawel's state rooms, treasury, cathedral setting, archaeology, and rotating routes reveal a royal complex rather than a single monument; choose exhibitions before arriving.",
    hours: {
      default:
        "Daily route openings, timed entry, Monday free-access windows, seasonal last-entry times, and conservation closures follow the official dated ticket calendar for the selected Wawel exhibition.",
    },
    officialUrl: "https://wawel.krakow.pl/en/what-to-see",
    timetableUrl: "https://bilety.wawel.krakow.pl/",
    editorialUrls: [museumBranches],
    venueKind: "culture",
    subcategory: "castle_museum",
    price: "$$",
    priceSource: "Official route tickets",
    attributeTags: ["historic", "museum", "architecture", "essential"],
  }),
  stop({
    id: "krakow-culture-rynek",
    name: "Rynek Underground",
    coordinates: [50.061486, 19.936415],
    description:
      "Below the Main Square, excavated streets, trade objects, graves, and digital interpretation turn medieval Kraków's commercial growth into a physical, address-level story.",
    hours: {
      default:
        "Mon 10:00 AM-7:00 PM, except the second Monday of each month is closed; Tue 10:00 AM-3:00 PM; Wed-Thu 10:00 AM-7:00 PM; Fri-Sun 10:00 AM-8:00 PM.",
    },
    officialUrl: "https://www.muzeumkrakowa.pl/en/branches/rynek-underground",
    timetableUrl: "https://bilety.muzeumkrakowa.pl/",
    editorialUrls: [museumBranches],
    venueKind: "culture",
    subcategory: "archaeology_museum",
    price: "$$",
    priceSource: "Official ticket page",
    attributeTags: ["museum", "history", "central", "timed_entry"],
  }),
  stop({
    id: "krakow-culture-schindler",
    name: "Oskar Schindler's Enamel Factory",
    coordinates: [50.047877, 19.961369],
    description:
      "The permanent exhibition uses Kraków under Nazi occupation—not Schindler alone—as its frame, combining testimony, documents, recreated spaces, and hard choices across the city.",
    hours: {
      default:
        "Mon 10:00 AM-3:00 PM; Tue-Sun 9:00 AM-8:00 PM; closed the first Tuesday of each month. Advance timed tickets are strongly recommended.",
    },
    officialUrl:
      "https://muzeumkrakowa.pl/en/branches/oskar-schindlers-enamel-factory",
    timetableUrl: "https://bilety.muzeumkrakowa.pl/",
    editorialUrls: [museumBranches],
    venueKind: "culture",
    subcategory: "history_museum",
    price: "$$",
    priceSource: "Official ticket page",
    attributeTags: ["museum", "history", "essential", "timed_entry"],
  }),
  stop({
    id: "krakow-culture-mocak",
    name: "MOCAK Museum of Contemporary Art",
    coordinates: [50.047877, 19.961369],
    description:
      "MOCAK's postindustrial galleries place contemporary Polish work in international context, with changing exhibitions and the Mieczysław Porębski library broadening a Podgórze museum day.",
    hours: { default: "Tue-Sun 11:00 AM-7:00 PM; closed Mon." },
    officialUrl: "https://en.mocak.pl/visit",
    editorialUrls: [museumBranches],
    venueKind: "culture",
    subcategory: "contemporary_art_museum",
    price: "$$",
    priceSource: "Official ticket page",
    attributeTags: ["museum", "modern_art", "architecture", "podgorze"],
  }),
  stop({
    id: "krakow-culture-czartoryski",
    name: "MNK Czartoryski Museum",
    coordinates: [50.064741, 19.940096],
    description:
      "Leonardo's Lady with an Ermine anchors a dense historic collection of European painting, antiquities, arms, decorative arts, and Polish royal memory in restored rooms.",
    hours: { default: "Tue-Sun 10:00 AM-6:00 PM; closed Mon." },
    officialUrl: "https://mnk.pl/en/branches/czartoryski-museum/",
    editorialUrls: [museumBranches],
    venueKind: "culture",
    subcategory: "art_museum",
    price: "$$",
    priceSource: "Official ticket page",
    attributeTags: ["museum", "art", "central", "essential"],
  }),
  stop({
    id: "krakow-culture-main-building",
    name: "MNK Main Building",
    coordinates: [50.060437, 19.92361],
    description:
      "The National Museum's main building is strongest for Polish art, arms, decorative design, and large temporary exhibitions, providing scale and context beyond a single masterpiece.",
    hours: { default: "Tue-Sun 10:00 AM-6:00 PM; closed Mon." },
    officialUrl: "https://mnk.pl/en/branches/mnk-main-building/",
    editorialUrls: [museumBranches],
    venueKind: "culture",
    subcategory: "art_museum",
    price: "$$",
    priceSource: "Official ticket page",
    attributeTags: ["museum", "art", "design", "accessible"],
  }),
  stop({
    id: "krakow-culture-galicia",
    name: "Galicia Jewish Museum",
    coordinates: [50.050857, 19.949677],
    description:
      "Photography, testimony, and community programming examine Jewish life and Holocaust memory across former Galicia, giving the Kazimierz setting necessary regional and contemporary context.",
    hours: { default: "Daily 10:00 AM-6:00 PM." },
    officialUrl:
      "https://galiciajewishmuseum.org/en/visit/practical-information/",
    editorialUrls: [museumBranches],
    venueKind: "culture",
    subcategory: "jewish_history_museum",
    price: "$$",
    priceSource: "Official ticket page",
    attributeTags: ["museum", "jewish_history", "photography", "kazimierz"],
  }),
  stop({
    id: "krakow-culture-old-synagogue",
    name: "Old Synagogue",
    coordinates: [50.051435, 19.948704],
    description:
      "Poland's oldest surviving synagogue now interprets Jewish religion, ritual objects, and community life, making it a necessary historical anchor on Szeroka.",
    hours: {
      default:
        "Mon 10:00 AM-3:00 PM; Tue-Sun 9:00 AM-5:00 PM; closed the second Thursday of each month.",
    },
    officialUrl: "https://muzeumkrakowa.pl/en/branches/old-synagogue",
    editorialUrls: [museumBranches],
    venueKind: "culture",
    subcategory: "religious_history_museum",
    price: "$$",
    priceSource: "Official ticket page",
    attributeTags: ["museum", "jewish_history", "historic", "kazimierz"],
  }),
  stop({
    id: "krakow-culture-mufo",
    name: "MuFo Rakowicka",
    coordinates: [50.07045, 19.95353],
    description:
      "Poland's only museum devoted wholly to photography uses a converted military building to explore how images are made, circulated, remembered, and trusted across changing technologies.",
    hours: {
      default:
        "Mon closed; Tue 11:00 AM-7:00 PM; Wed-Fri 10:00 AM-6:00 PM; Sat-Sun 11:00 AM-7:00 PM.",
    },
    officialUrl: "https://mufo.krakow.pl/odwiedzaj/zaplanuj-wizyte",
    editorialUrls: [museumBranches],
    venueKind: "culture",
    subcategory: "photography_museum",
    price: "$$",
    priceSource: "Official ticket page",
    attributeTags: ["museum", "photography", "design", "accessible"],
  }),
  stop({
    id: "krakow-culture-stained-glass",
    name: "Stained Glass Museum",
    coordinates: [50.058984, 19.925936],
    description:
      "This living museum occupies the 1902 Żeleński workshop, where a guided route moves among artisans, tools, cartoons, colored glass, and finished Secession-era work.",
    hours: {
      default:
        "Guided visits Tue-Fri 11:30 AM-1:30 PM and 2:30 PM-4:30 PM; Sat 10:00 AM-5:00 PM; closed Sun-Mon and holidays. English tours at noon and 3:00 PM; additional Saturday times follow the official booking page.",
    },
    officialUrl: "https://muzeumwitrazu.pl/plan-your-visit/",
    editorialUrls: [museumBranches],
    venueKind: "culture",
    subcategory: "craft_museum",
    price: "$$",
    priceSource: "Official guided-tour page",
    attributeTags: ["museum", "craft", "guided_tour", "art"],
  }),
];

const extraActivities = [
  stop({
    id: "krakow-activity-kosciuszko",
    name: "Kościuszko Mound",
    coordinates: [50.054889, 19.892712],
    description:
      "A spiral climb up the 19th-century memorial mound yields Kraków's clearest wide panorama, while the surrounding fort and exhibition explain Kościuszko's Polish and American legacy.",
    hours: {
      default:
        "Daily 9:00 AM-7:00 PM; temporary weather, maintenance, and evening-access changes are posted on the official ticket page.",
    },
    officialUrl: "https://kopieckosciuszki.pl/en/tickets/",
    venueKind: "landmark",
    subcategory: "viewpoint",
    price: "$$",
    priceSource: "Official ticket page",
    attributeTags: ["views", "walking", "historic", "outdoors"],
  }),
  stop({
    id: "krakow-activity-wieliczka",
    name: "Wieliczka Salt Mine Tourist Route",
    coordinates: [49.983048, 20.055708],
    description:
      "A guide leads through carved salt chambers, chapels, lakes, and working-mine infrastructure far below Wieliczka, an experience whose scale justifies the half-day excursion.",
    hours: {
      default:
        "Jan-Mar and Nov-Dec 9:00 AM-5:00 PM; Apr-Jun and Sep-Oct 8:00 AM-6:00 PM; Jul-Aug 7:30 AM-6:30 PM. Entry is only with a guide at a language-specific time in the official calendar.",
    },
    officialUrl:
      "https://www.wieliczka-saltmine.com/individual-tourist/tourist-route",
    timetableUrl: "https://booking.kopalnia.pl/",
    venueKind: "culture",
    subcategory: "industrial_heritage_site",
    price: "$$$",
    priceSource: "Official timed-ticket page",
    attributeTags: ["guided_tour", "unesco", "half_day", "family_friendly"],
  }),
  stop({
    id: "krakow-activity-zakrzowek",
    name: "Zakrzówek Swimming Pools and Park",
    coordinates: [50.038555, 19.915987],
    description:
      "Boardwalks and controlled swimming basins turn the flooded limestone quarry into Kraków's most dramatic summer swim, but capacity and water safety are actively managed.",
    hours: {
      summer:
        "2026 swimming season Jun 1-Sep 30: Mon 2:00 PM-7:00 PM; Tue-Sun 8:00 AM-7:00 PM. The official water-quality, weather, and 300-person capacity notices can delay opening or close the basins.",
      default:
        "Park paths remain subject to posted municipal access rules outside the supervised swimming season.",
    },
    officialUrl: "https://zakrzowek.krakow.pl/",
    venueKind: "outdoors",
    subcategory: "urban_swimming",
    price: "$",
    priceSource: "Municipal public facility",
    attributeTags: ["swimming", "summer", "outdoors", "free_entry"],
  }),
  stop({
    id: "krakow-activity-obwarzanek",
    name: "Living Museum of Obwarzanek",
    coordinates: [50.066615, 19.9409],
    description:
      "A one-hour participatory workshop explains Kraków's protected ring bread, from guild history and twisting dough to boiling, baking, and eating your own obwarzanek.",
    hours: {
      default:
        "Individual one-hour workshop dates and language-specific start times are published in the official booking calendar; groups visit only by advance booking.",
    },
    officialUrl:
      "https://www.muzeumobwarzanka.com/practical-information/?lang=en",
    timetableUrl: "https://bilety.muzeumobwarzanka.com/",
    venueKind: "culture",
    subcategory: "food_museum",
    price: "$$",
    priceSource: "Official workshop calendar",
    attributeTags: [
      "workshop",
      "food_history",
      "family_friendly",
      "guided_tour",
    ],
  }),
  stop({
    id: "krakow-activity-pinball",
    name: "Krakow Pinball Museum",
    coordinates: [50.052787, 19.939946],
    description:
      "More than a static collection, this cellar lets one admission unlock playable pinball and arcade machines across decades, with enough range for both specialists and rainy-day groups.",
    hours: {
      default:
        "Mon-Thu 2:00 PM-9:00 PM; Fri 2:00 PM-10:00 PM; Sat noon-10:00 PM; Sun noon-9:00 PM.",
    },
    officialUrl: "https://krakpin.com/godziny_en.html",
    venueKind: "culture",
    subcategory: "interactive_museum",
    price: "$$",
    priceSource: "Official admission page",
    attributeTags: ["games", "interactive", "rainy_day", "group_friendly"],
  }),
  stop({
    id: "krakow-activity-st-marys",
    name: "St. Mary's Basilica",
    coordinates: [50.061655, 19.939449],
    description:
      "The dark brick basilica holds Veit Stoss's vast carved altarpiece and layers of polychrome decoration; the hourly hejnał outside connects the interior to the living square.",
    hours: {
      default:
        "Tourist visiting Mon-Sat 11:30 AM-6:00 PM; Sun and holidays 2:00 PM-6:00 PM. Religious services take precedence and can suspend sightseeing.",
    },
    officialUrl: "https://mariacki.com/en/tourists/",
    venueKind: "culture",
    subcategory: "historic_church",
    price: "$$",
    priceSource: "Official visitor page",
    attributeTags: ["architecture", "art", "historic", "central"],
  }),
  stop({
    id: "krakow-activity-nowa-huta-underground",
    name: "Nowa Huta Underground – os. Szkolne 37",
    coordinates: [50.076533, 20.050409],
    description:
      "A former school shelter interprets Cold War civil defense through original underground rooms, alarms, equipment, and the social history of planned Nowa Huta above.",
    hours: {
      default:
        "Wed-Sun 10:00 AM-5:00 PM; closed Mon-Tue; last individual entry 30 minutes before closing and guided entry 60 minutes before closing. Thursday quiet hours run 3:00 PM-5:00 PM.",
    },
    officialUrl:
      "https://muzeumkrakowa.pl/en/branches/nowa-huta-underground-os-szkolne-37",
    editorialUrls: [museumBranches],
    venueKind: "culture",
    subcategory: "cold_war_museum",
    price: "$$",
    priceSource: "Official ticket page",
    attributeTags: [
      "history",
      "guided_tour",
      "nowa_huta",
      "off_the_beaten_path",
    ],
  }),
];

const activityStops = [
  ...cultureStops.slice(0, 3).map((item, index) => ({
    ...item,
    id: `krakow-activity-culture-${index + 1}`,
  })),
  ...extraActivities,
];

function sourcesFor(
  stops: GuideStop[],
  categoryUrl: string,
  categoryName: string,
): ListSource[] {
  return [
    { name: categoryName, url: categoryUrl },
    { name: "Kraków official tourism", url: tourism },
    ...stops.map((item) => ({
      name: `${item.name} official/property source`,
      url: item.officialUrl!,
    })),
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
  categorySource: string,
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
    url: maps(`${title} Kraków Poland`),
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
    sources: sourcesFor(stops, categorySource, `${title} research index`),
  };
}

export const krakowCitywideGuides: MapList[] = [
  guide(
    "Food",
    "list-krakow-citywide-dining",
    "krakow-best-restaurants-citywide",
    "best-restaurants",
    "Kraków Restaurants With Modern Range",
    "Kraków's dining strength is no longer one narrow version of Polish tradition. These ten current kitchens cover ambitious tasting menus, regional Thai fire, seafood, natural wine, modern bistros, and carefully handled classics with distinct reasons to book.",
    diningStops,
    michelin,
    "Best Restaurants in Kraków for Modern Polish and Global Dining",
    "Ten source-backed Kraków restaurants, from Bottiglieria 1881 and MOLÁM to FOLGA, Bufet, NAT, Farina, Fiorentina, Pod Nosem, and Pod Baranem.",
  ),
  guide(
    "Food",
    "list-krakow-medium-cheap-eats",
    "krakow-best-cheap-eats-medium-budget",
    "best-cheap-eats",
    "Milk Bars and Kraków Food on a Budget",
    "Kraków's inexpensive food works best when milk bars, pierogi counters, vegan fast food, market-era zapiekanka, and the city's own maczanka share the map. Every stop here remains useful on current hours and earns its place beyond nostalgia.",
    cheapEatStops,
    cheapEats,
    "Best Cheap Eats and Milk Bars in Kraków",
    "Ten current Kraków cheap eats with source-backed hours, including Pod Temidą, Milkbar Tomasza, Przystanek Pierogarnia, Chimera, Vegab, Endzior, and Targowy.",
  ),
  guide(
    "Stay",
    "list-krakow-citywide-hotels",
    "krakow-best-hotels-citywide",
    "best-hotels",
    "Kraków Hotels for History, Design, and Location",
    "Kraków's best hotels turn restored townhouses, palaces, religious buildings, and modern Kazimierz rooms into genuinely different stays. This hotel-only guide weighs atmosphere, pools and spas, neighborhood logic, and sightseeing access without mixing in hostels.",
    hotelStops,
    "https://convention.krakow.pl/getPdf/?dok_id=306915",
    "Best Hotels in Kraków for Luxury, Design, and Location",
    "Hotel-only Kraków guide covering Hotel Stary, Stradom House, H15 Palace, Copernicus, Bachleda, Saski, Balthazar, PURO Kazimierz, Bonerowski, and Queen.",
  ),
  guide(
    "Stay",
    "list-krakow-citywide-hostels",
    "krakow-best-hostels-citywide",
    "best-hostels",
    "Kraków Hostels for Social Trips and Quiet Budget Beds",
    "Kraków's hostel scene spans famous party houses, staff-led social dorms, quiet independents, family-friendly chains, and simple private-room bases. Hotels are excluded so noise, age rules, kitchens, reception, and solo-traveler fit remain explicit.",
    hostelStops,
    hostelworld,
    "Best Hostels in Kraków for Solo Travelers and Budget Trips",
    "Hostel-only Kraków guide covering Greg & Tom, Little Havana, Let's Rock, MEININGER, Atlantis, Dizzy Daisy, Ginger, Deco, Mosquito, and Freedom.",
  ),
  guide(
    "Nightlife",
    "list-krakow-pubs-casual-bars",
    "krakow-best-pubs-casual-bars",
    "best-pubs-and-casual-bars",
    "Kraków Pubs, Beer Rooms, and Casual Late Nights",
    "Kraków's casual nightlife lives in serious craft-beer rooms, candlelit Kazimierz institutions, gardens, self-pour taps, and taverns built for conversation. These stops prioritize a distinct local use over generic square-side drinking.",
    pubStops,
    cityBars,
    "Best Pubs and Casual Bars in Kraków",
    "Ten current Kraków pubs and beer bars with source-backed hours, including House of Beer, Multi Qlti, Weźże Krafta, Omerta, Alchemia, Eszeweria, and Stary Port.",
  ),
  guide(
    "Nightlife",
    "list-krakow-cocktail-bars",
    "krakow-best-cocktail-bars",
    "best-cocktail-bars",
    "Kraków Cocktail Bars With Technique and Character",
    "Kraków's cocktail scene now ranges from internationally ranked specialist rooms and narrative speakeasies to a chapel bar, river-view rooftop, and lively late-night classics. Each selection makes a different argument for the evening.",
    cocktailStops,
    cityBars,
    "Best Cocktail Bars in Kraków for Speakeasies and Views",
    "Ten source-backed Kraków cocktail bars including Mercy Brown, TAG, The Trust, William Rabbit, Mr. Black, Hedwig's, Kraft, Panorama Forum, Sababa, and Movida.",
  ),
  guide(
    "Culture",
    "list-krakow-citywide-culture",
    "krakow-best-culture-museums-citywide",
    "best-culture",
    "Museums That Explain Kraków's Art and History",
    "Kraków's essential culture stretches from royal power and medieval trade to Jewish life, wartime occupation, contemporary art, photography, and a working stained-glass studio. This sequence supplies context rather than treating the historic center as scenery.",
    cultureStops,
    museumBranches,
    "Best Museums and Culture in Kraków",
    "Ten source-backed Kraków culture stops spanning Wawel, Rynek Underground, Schindler's Factory, MOCAK, two National Museum branches, Jewish history, photography, and stained glass.",
  ),
  guide(
    "Activities",
    "list-krakow-top-things-to-do",
    "krakow-top-things-to-do",
    "best-things-to-do",
    "Ten Stops That Make a First Kraków Trip Work",
    "A strong first Kraków trip needs royal and medieval anchors, clear wartime context, a broad view, a salt-mine half day, a seasonal swim, living food craft, play, sacred art, and one excursion into Nowa Huta's Cold War layer.",
    activityStops,
    tourism,
    "Top Things to Do in Kraków With 10 Essential Stops",
    "Ten source-backed Kraków things to do, combining Wawel, Rynek Underground, Schindler's Factory, Kościuszko Mound, Wieliczka, Zakrzówek, obwarzanek workshop, pinball, St. Mary's, and Nowa Huta Underground.",
  ),
];
