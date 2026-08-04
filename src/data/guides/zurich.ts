import type { GuideStop, ListCategory, ListSource, MapList } from "@/types";
import { buildNatureGuide } from "@/data/guides/nature-guide-builder";

const createdAt = "2026-07-29T00:00:00.000Z";
const checkedAt = "2026-07-29";

const location = {
  city: "Zurich",
  country: "Switzerland",
  continent: "Europe",
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
  bookingUrl?: string;
  editorialUrls?: string[];
  mapQuery?: string;
  price?: GuideStop["price"];
  priceSource?: string;
  venueKind?: GuideStop["venueKind"];
  foodServiceType?: GuideStop["foodServiceType"];
  cuisineTypes?: string[];
  nightlifeType?: GuideStop["nightlifeType"];
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
  const fill = colors[category] ?? "475569";
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

const verifiedVenuePhotos: Record<string, string> = {
  Kronenhalle:
    "https://www.kronenhalle.com/img/link_preview/cover_04_16x9_3000x1688.jpg",
  "Haus Hiltl": "https://hiltl.ch/hv-media/video-1.jpg",
  "Zunfthaus zur Waag":
    "https://static1.squarespace.com/static/6399afad06875d4366eabea3/t/63cecd21222ed21134e8c279/1674497317384/Design+ohne+Titel.png?format=1500w",
  "The Restaurant at The Dolder Grand":
    "https://www.thedoldergrand.com/app/uploads/2020/08/HB_The_Restaurant_web.jpg",
  "Widder Restaurant":
    "https://media.thelivingcircle.ch/XBNKIT01/at/tzjr86n55q3m67pp5p55p6n/TheLivingCircle_Widder_Restaurant_final_CDigitaleMassarbeit_007.jpg?format=webp&width=1600&height=900&fit=crop",
  "Restaurant Markthalle":
    "https://www.restaurant-markthalle.ch/medien/header_martk-1.jpg",
  "Restaurant Rigiblick":
    "https://static.wixstatic.com/media/3bcfa7_8ad246fe28bf4fa689f415d945e04e7d%7Emv2.jpg/v1/fit/w_2500,h_1330,al_c/3bcfa7_8ad246fe28bf4fa689f415d945e04e7d%7Emv2.jpg",
  "Äss-Bar Stüssihofstatt":
    "https://www.aess-bar.ch/shop/open_graph_image.php?id=0",
  "Brot Bistro Bar":
    "https://cdn.prod.website-files.com/67dadc4d05601ab66943d569/69e4c78b3243db57b41e281c_brot-bistro-bar-zuerich-cover.jpg",
  "The Bite":
    "https://static.wixstatic.com/media/4f7ded_57bc852c7b6a4c4caf8c940214180645~mv2.jpg/v1/crop/x_494,y_0,w_1752,h_1920/fill/w_730,h_800,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/DSCF5017.jpg",
  "Raclette Factory":
    "https://static.wixstatic.com/media/ea6ef6_a338bc187a4a44aaa0408cedda5cd6c5%7Emv2_d_2339_1654_s_2.png/v1/fit/w_2500,h_1330,al_c/ea6ef6_a338bc187a4a44aaa0408cedda5cd6c5%7Emv2_d_2339_1654_s_2.png",
  "Wesley's Kitchen": "https://wesleys-kitchen.ch/imagetypes/share/facebook2.jpg",
  "Holy Cow! Niederdorf":
    "https://holycow.ch/wp-content/uploads/2021/03/HolyCoW_Accompagnement_PortionFrites.jpg",
  "Café & Conditorei 1842":
    "https://www.cafe1842.ch/fileadmin/user_upload/_img/Cafe_1842/2025_Cafe_Patisserie.jpg",
  "Marktküche":
    "https://www.zuerich.com/sites/default/files/keyvisual/web_zurich_restaurant_marktkueche_03.jpg",
  "IGNIV Zürich":
    "https://www.zuerich.com/sites/default/files/web_zuerich_restaurant_igniv_1280x960_31491.jpg",
  "Boucherie AuGust":
    "https://www.zuerich.com/sites/default/files/keyvisual/web_zurich_restaurant_august_01.jpg",
  "Sternen Grill":
    "https://www.zuerich.com/sites/default/files/image/2022/web_zurich_restaurant_sternengrill_1280x960_44142.jpg",
  "John Baker Bahnhofstrasse":
    "https://www.zuerich.com/sites/default/files/image/2023/web_zuerich_shopping_john-baker_1280x960_47839.jpg",
  "tibits Seefeld":
    "https://www.zuerich.com/sites/default/files/keyvisual/web_zurich_gastronomie_tibits_nzz_01.jpg",
  "The Dolder Grand":
    "https://www.thedoldergrand.com/app/uploads/2020/09/HIBR_D_00198588_send-1024x682.jpg",
  "Baur au Lac":
    "https://www.bauraulac.ch/upload/rm/ba/ll/bal-lakeside-corner-suite-lounge-area-4.jpg?_=1761125877000",
  "Mandarin Oriental Savoy":
    "https://media.ffycdn.net/eu/mandarin-oriental-hotel-group/VRz9rryU4UGyU7mxx5jC.jpg",
  "Widder Hotel":
    "https://media.thelivingcircle.ch/XBNKIT01/at/rk86wkt4866sk735fm9xgj6/TLC_Widder_Rooms_CDigitaleMassarbeit_091.jpg?format=webp&width=1600&height=900&fit=crop",
  "Storchen Zürich":
    "https://media.thelivingcircle.ch/XBNKIT01/at/2tfjbhnbszqrgp8gt6kkhvp/_OPE5717_anges.jpg?format=webp&width=1600&height=900&fit=crop",
  "25hours Hotel Langstrasse":
    "https://25hours-hotels.com/wp-content/uploads/sites/39/2024/10/25h_langstrasse_hotelpage_header_1.jpg",
  "Park Hyatt Zurich":
    "https://www.zuerich.com/sites/default/files/image/2021/web_zuerich_park_hyatt_1280x960_33230.jpg",
  "B2 Hotel Zürich":
    "https://commons.wikimedia.org/wiki/File:B2_Boutique_Hotel_%2B_Spa.jpg",
  "Marktgasse Hotel":
    "https://www.marktgassehotel.ch/files/zimmer/Marktgasse-Hotel-Historic-Double-Room-2024-11_web.jpg",
  "Zurich Youth Hostel":
    "https://backend.youthhostel.ch/sites/default/files/styles/socialshare/public/canto/ls4jn3t0n534n4q1espon4255g/20240404_Jugendherberge-Zuerich-Aussenansicht-Leonidas_Portmann-02_t1776845493.jpg.jpeg?v=1643d19d",
  "MEININGER Zürich Greencity":
    "https://www.meininger-hotels.com/fileadmin/_processed_/7/e/csm_MEININGER_Hotel_Zuerich-Greencity_breakfast_room_00006_4cad62dc5e.jpg",
  "Oldtown Hostel Otter":
    "https://oldtownzurich.com/wp-content/uploads/2016/10/Hotel_Otter_Zurich_Oberdorfstrasse.jpg",
  "Green Marmot Capsule Hostel":
    "https://static1.squarespace.com/static/676cf90fff8d85208e62001a/t/6877025b6588572799f64344/1752629851564/main_entrance.jpg?format=1500w",
  "Guesthouse fürDich":
    "https://static.wixstatic.com/media/a53b9a_9fdefd813bb049ce912c54eccc3dc602~mv2.jpg/v1/fill/w_987,h_657,al_c/a53b9a_9fdefd813bb049ce912c54eccc3dc602~mv2.jpg",
  "Camping Fischers Fritz":
    "https://www.fischers-fritz.ch/templates/assets/images/og_image.jpg",
  "Viktoria Budget Hostel":
    "https://viktoria-budget-hostel.hotelinzurich.net/data/Photos/700x500w/17588/1758893/1758893196.JPEG",
  "Alpine Garden Capsule Hotel":
    "https://www.gruppenhaus.ch/images/haus/1309/Hotel-Alpine-Garden-Capsule-Hotel-Aussenansicht.jpg",
  "Josephine's Guesthouse for Women":
    "https://www.zuerich.com/sites/default/files/image/2022/Josephine_Guesthouse_1280x960.jpg",
  "Pension Kafischnaps":
    "https://www.zuerich.com/sites/default/files/web_zuerich_pension_kafischnaps_1280x960_28258.jpg",
  "Olé Olé Bar":
    "https://www.zuerich.com/sites/default/files/image/2022/web_zuerich_nightlife_oleole_bar_1280x960_4630.jpg",
  "El Lokal":
    "https://static.wixstatic.com/media/170674_c79f19bd648c483287858787b854251d~mv2.jpg/v1/crop/x_0,y_35,w_520,h_520/fill/w_520,h_520,al_c,q_85,enc_avif,quality_auto/hg_ryb1.jpg",
  "Gräbli Bar":
    "https://www.zuerich.com/sites/default/files/keyvisual/zurich_gastronomie_graebli-bar_01.jpg",
  Eldorado:
    "https://www.zuerich.com/sites/default/files/web_zuerich_eldorado_bier_1280x960_21429.jpg",
  "Kon-Tiki":
    "https://www.zuerich.com/sites/default/files/keyvisual/web_zurich_bars_zueribar_kontiki_zt_4629.jpg",
  "Züri Bar":
    "https://www.zuerich.com/sites/default/files/web_zuerich_zueri_bar_1280x960_30443.jpg",
  "Regenbogen Bar":
    "https://www.zuerich.com/sites/default/files/keyvisual/webzurich_regenbogenbar_09.jpg",
  "Cabaret Voltaire Bar":
    "https://www.cabaretvoltaire.ch/assets/contents/_image/Teaser-Kuenstlerinnenkneipe.jpg",
  "Old Crow": "https://www.oldcrow.ch/wp-content/uploads/2019/10/test6-2000x1200.jpg",
  "Widder Bar":
    "https://media.thelivingcircle.ch/XBNKIT01/at/6n7pkn3ss3trz7hwfthzm9/2023-09-12_Widder_Drinks-21.jpg?format=webp&width=1600&height=900&fit=crop",
  "Kronenhalle Bar":
    "https://www.kronenhalle.com/img/link_preview/cover_02_bar_02_3000x1688.jpg",
  "Tales Bar": "https://www.tales-bar.ch/wp-content/uploads/2014/05/titel-website.jpg",
  Raygrodski:
    "https://raygrodski-bar.ch/media/pages/home/8672b350b5-1784624207/2607_newmenu-20-2700x.jpg",
  "Cinchona Bar":
    "https://25hours-hotels.com/wp-content/uploads/sites/39/2024/09/25h_langstrasse_cinchonabar_featuredimage_2.jpg",
  "The International Beer Bar":
    "https://www.zuerich.com/sites/default/files/web_zuerich_international_beer_bar_1280x960_26685.jpg",
  "Mikkeller Zürich":
    "https://www.zuerich.com/sites/default/files/image/2025/web_zuerich_mikkeller_1280x960px_55569.jpg",
  "Bar am Wasser":
    "https://www.zuerich.com/sites/default/files/web_zuerich_bar_am_wasser_1280x960_25855.jpg",
  "Bar Sacchi":
    "https://www.zuerich.com/sites/default/files/image/2022/web_zuerich_nightlife_bar_sacchi_1280x960_30017.jpg",
  "Onyx Bar":
    "https://www.zuerich.com/sites/default/files/image/2021/web_zuerich_park_hyatt_onyx_bar_1280x960_33236.jpg",
  "Clouds Bar":
    "https://www.zuerich.com/sites/default/files/keyvisual/web_zurich_gastronomie_clouds_03.jpg",
  "Kunsthaus Zürich":
    "https://kunsthausrelaunch8251-live-a33132ecc05c-1c0f54b.divio-media.net/images/jeffrey-gibson-16-9-01.2e16d0ba.fill-1200x630.jpg",
  "Museum Rietberg": "https://rietberg.ch/files/Museum/_squareXs/ZH_Rietberg_DSC0312.jpg",
  "Museum für Gestaltung":
    "https://mfg.rokka.io/fe_nuxt_crop/variables-w-1920-h-1080/13914f6acb829b47eb8327e44c7ef856096eb5f0/image.jpg",
  "Museum Haus Konstruktiv":
    "https://admin.hauskonstruktiv.ch/assets/image/_1920xAUTO_crop_center-center_none_ns/HK_260602_0045_WEB.jpg?w=1600&q=85",
  "National Museum Zurich":
    "https://www.zuerich.com/sites/default/files/image/2022/web_zurich_landesmuseum_ZT_22616_1280x960.jpg",
  "FIFA Museum":
    "https://www.zuerich.com/sites/default/files/image/2023/web_zuerich_museum_fifa_museum_1280x960_46629.jpg",
  "Natural History Museum UZH":
    "https://www.zuerich.com/sites/default/files/keyvisual/web_zurich_museum_zoologischesmuseum_01.jpg",
  "Beyer Clock and Watch Museum":
    "https://www.zuerich.com/sites/default/files/image/2021/web_zuerich_uhrenmuseum_beyer_1280x960_34083.jpg",
  focusTerra:
    "https://focusterra.ethz.ch/en/_jcr_content/pageimages/image.imageformat.lightbox.86642068.jpg",
  "Grossmünster and Karlsturm":
    "https://www.grossmuenster.ch/portal/upload/portalkg_imgfile53255.jpg",
  "Lake Zurich Round Trip": "https://www.zsg.ch/wp-content/uploads/zsg_1200x630.jpg",
  "Uetliberg Ridge Walk":
    "https://www.zuerich.com/sites/default/files/image/2025/web_zuerich_Uetliberg_1280x960px_24964.jpg",
  "Botanical Garden UZH":
    "https://www.bg.uzh.ch/dam/jcr%3Acd5e5abd-c15e-4eda-b71a-98760dd6228d/P7141168_.jpg",
  "Polybahn and Polyterrasse":
    "https://www.zuerich.com/sites/default/files/image/2024/web_zuerich_polybahn_1280x960_52478.jpg",
  "Markthalle im Viadukt":
    "https://www.zuerich.com/sites/default/files/image/2023/web_zurich_shopping_markthalle_viadukt_1280x960_48671.jpg",
  Lindenhof:
    "https://www.zuerich.com/sites/default/files/keyvisual/web_zuerich_lindenhof.jpg",
  "Zoo Zürich":
    "https://zoo-live.rokka.io/hero_full_xl_1x/baa350ebefc6bac3fa6b0431b59f8e96a9385d70/2244-22324.jpg?h=907334e5&itok=v8fLrSoG",
  "Lindt Home of Chocolate":
    "https://www.lindt-home-of-chocolate.com/wp-content/uploads/2020/04/lind-home-of-chocolate-facebook.jpg",
  Uetliberg:
    "https://www.zuerich.com/sites/default/files/web_zuerich_uetliberg_1280x960_9573.jpg",
  "Lake Zurich Promenade":
    "https://www.zuerich.com/sites/default/files/image/2025/web_zuerich_Seepromenade_1280x960px_01.jpg",
  "Botanical Garden of the University of Zurich":
    "https://www.bg.uzh.ch/dam/jcr%3A7233467f-2ee4-4984-b497-6faf06c9092b/P7141178_.jpg",
  "Zürichhorn":
    "https://www.zuerich.com/sites/default/files/web_zuerich_heureka_tinguely_1280x960_21994.jpg",
  Sihlwald:
    "https://www.zuerich.com/sites/default/files/keyvisual/web_zuerich_natur-und-sport_sihlwald_02.jpg",
  "Käferberg and Hönggerberg Forest":
    "https://www.zuerich.com/sites/default/files/image/2023/web_zuerich_waid_1280x960_43.jpg",
  Werdinsel:
    "https://media.zuerich.com/image/727218228053/image_gpeb39bpop3a96616sihv4sk52",
  "Langenberg Wildlife Park":
    "https://www.zuerich.com/sites/default/files/keyvisual/web_zuerich_natur-und-sport_langenberg_01.jpg",
};

function stop(input: StopInput): GuideStop {
  const mapUrl = maps(input.mapQuery ?? `${input.name} Zurich Switzerland`);
  const imageSourceUrl = verifiedVenuePhotos[input.name] ?? input.officialUrl;
  const sourceUrls = [
    input.officialUrl,
    input.bookingUrl,
    mapUrl,
    imageSourceUrl,
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
    photo: imageSourceUrl,
    imageSourceUrl,
    imageSourceName: "Official venue, property, or Zurich Tourism media",
    price: input.price,
    priceSource: input.priceSource,
    venueKind: input.venueKind,
    foodServiceType: input.foodServiceType,
    cuisineTypes: input.cuisineTypes,
    nightlifeType: input.nightlifeType,
    lodgingType: input.lodgingType,
    subcategory: input.subcategory,
    attributeTags: input.attributeTags,
    sourceUrls: [...new Set(sourceUrls)],
    sourceEvidence: {
      officialUrl: input.officialUrl,
      mapUrl,
      currentStatusUrl: mapUrl,
      imageSourceUrl,
      editorialUrls: input.editorialUrls ?? [],
      platformUrls: input.bookingUrl ? [input.bookingUrl] : [],
      checkedAt,
      notes:
        "The official venue/property page or the official Zurich Tourism venue record was checked with a current map query. Hours reproduce the published schedule or name the exact booking, seasonal, timetable, service, or admission dependency.",
    },
  };
}

const diningStops: GuideStop[] = [
  stop({
    id: "zurich-dining-kronenhalle",
    name: "Kronenhalle",
    coordinates: [47.3675511, 8.5457188],
    description:
      "Kronenhalle pairs Zürcher classics such as sliced veal with rösti with an art collection that includes works by Miró, Chagall and Giacometti. Come for a formal old-Zurich meal, not novelty, and reserve if the historic dining room matters.",
    officialUrl: "https://www.kronenhalle.com/",
    bookingUrl: "https://www.kronenhalle.com/en/restaurant/",
    hours: { default: "Daily 12:00 PM–12:00 AM." },
    price: "$$$$",
    priceSource: "Official restaurant menu and reservation page",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["swiss", "zurich", "european"],
    subcategory: "historic_swiss_restaurant",
    attributeTags: ["historic", "reservation_recommended", "art_collection", "splurge_food"],
    editorialUrls: ["https://www.zuerich.com/en/visit/restaurants/kronenhalle"],
  }),
  stop({
    id: "zurich-dining-hiltl",
    name: "Haus Hiltl",
    coordinates: [47.3733042, 8.5367495],
    description:
      "Founded in 1898, Hiltl turns vegetarian eating into a broad buffet and à-la-carte institution rather than a compromise meal. It works especially well for mixed groups and irregular meal times, though the central buffet can be busiest at lunch.",
    officialUrl: "https://hiltl.ch/en/",
    hours: {
      default:
        "Mon–Thu 7:00 AM–10:00 PM; Fri 7:00 AM–11:00 PM; Sat 8:00 AM–11:00 PM; Sun 10:00 AM–10:00 PM.",
    },
    price: "$$",
    priceSource: "Official Hiltl menus and Zurich Tourism venue record",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["vegetarian", "vegan", "international"],
    subcategory: "vegetarian_institution",
    attributeTags: ["vegetarian", "vegan_friendly", "group_friendly", "historic"],
    editorialUrls: ["https://www.zuerich.com/en/visit/restaurants/haus-hiltl"],
  }),
  stop({
    id: "zurich-dining-marktkueche",
    name: "Marktküche",
    coordinates: [47.3787172, 8.5233543],
    description:
      "Marktküche builds ambitious plant-based tasting menus from vegetables, fermentation and precise saucing, with none of the buffet logic associated with older vegetarian restaurants. The compact evening schedule makes this a reservation-led dinner.",
    officialUrl: "https://www.marktkueche.ch/",
    bookingUrl: "https://www.marktkueche.ch/",
    hours: {
      default:
        "Wed–Fri 5:30 PM–11:30 PM; Sat 12:00 PM–3:00 PM and 5:30 PM–11:30 PM; closed Sun–Tue.",
    },
    price: "$$$",
    priceSource: "Official tasting-menu and reservation page",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["vegan", "contemporary", "seasonal"],
    subcategory: "plant_based_tasting_menu",
    attributeTags: ["vegan", "tasting_menu", "reservation_recommended", "date_night"],
    editorialUrls: ["https://www.zuerich.com/en/visit/restaurants/marktkuche"],
  }),
  stop({
    id: "zurich-dining-waag",
    name: "Zunfthaus zur Waag",
    coordinates: [47.3702401, 8.5403116],
    description:
      "The linen-weavers' guild house on Münsterhof serves polished Swiss and French cooking inside one of the old town's most atmospheric civic interiors. Lunch suits a measured sightseeing day; dinner is quieter, and Sunday is a hard closure.",
    officialUrl: "https://www.zunfthaus-zur-waag.ch/",
    hours: {
      default:
        "Mon–Sat 11:30 AM–2:00 PM and 6:00 PM–10:00 PM; closed Sun.",
    },
    price: "$$$",
    priceSource: "Official menu and Zurich Tourism venue record",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["swiss", "french", "european"],
    subcategory: "guild_house_restaurant",
    attributeTags: ["historic", "reservation_recommended", "old_town", "business_lunch"],
    editorialUrls: ["https://www.zuerich.com/en/visit/restaurants/zunfthaus-zur-waag"],
  }),
  stop({
    id: "zurich-dining-dolder",
    name: "The Restaurant at The Dolder Grand",
    coordinates: [47.3727936, 8.5733694],
    description:
      "Heiko Nieder's flagship uses long tasting menus, exacting technique and the Dolder's hilltop setting for Zurich's most ceremonial dining experience. Allow the whole evening and treat the Wednesday-only dinner and Thursday-Friday lunch split as part of the planning.",
    officialUrl: "https://www.thedoldergrand.com/en/restaurants/the-restaurant/",
    bookingUrl: "https://www.thedoldergrand.com/en/restaurants/the-restaurant/",
    hours: {
      default:
        "Wed 7:00 PM–10:00 PM; Thu–Fri 12:00 PM–2:00 PM and 7:00 PM–10:00 PM; Sat 7:00 PM–10:00 PM; closed Sun–Tue.",
    },
    price: "$$$$",
    priceSource: "Official restaurant menu and reservation calendar",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["creative", "european", "tasting_menu"],
    subcategory: "destination_fine_dining",
    attributeTags: ["fine_dining", "tasting_menu", "reservation_required", "scenic_food"],
    editorialUrls: ["https://www.zuerich.com/en/visit/restaurants/the-restaurant-dolder-grand"],
  }),
  stop({
    id: "zurich-dining-widder",
    name: "Widder Restaurant",
    coordinates: [47.3722677, 8.539968],
    description:
      "Stefan Heilemann's Widder dining room layers Asian acidity and spice into technically precise European tasting menus inside the medieval Widder complex. Lunch is limited to Thursday and Friday, while evening reservations run Wednesday through Saturday.",
    officialUrl: "https://www.widderhotel.com/en/eat-drink/widder-restaurant/",
    bookingUrl: "https://www.widderhotel.com/en/eat-drink/widder-restaurant/",
    hours: {
      default:
        "Wed 7:00 PM–11:00 PM; Thu–Fri 12:00 PM–1:30 PM and 7:00 PM–11:00 PM; Sat 7:00 PM–11:00 PM; closed Sun–Tue.",
    },
    price: "$$$$",
    priceSource: "Official menu and reservation page",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["creative", "european", "asian_influenced"],
    subcategory: "fine_dining",
    attributeTags: ["fine_dining", "tasting_menu", "reservation_required", "old_town"],
    editorialUrls: ["https://www.zuerich.com/en/node/2092"],
  }),
  stop({
    id: "zurich-dining-igniv",
    name: "IGNIV Zürich",
    coordinates: [47.3719712, 8.5436611],
    description:
      "IGNIV turns Andreas Caminada's fine-dining language into a sequence of shareable small plates inside Marktgasse Hotel. The convivial format still demands a full evening; use the reservation calendar because lunch and dinner seatings vary by service day.",
    officialUrl: "https://www.marktgassehotel.ch/en/igniv-zurich",
    bookingUrl: "https://www.marktgassehotel.ch/en/igniv-zurich",
    hours: {
      default:
        "Wed–Fri lunch 11:30 AM–2:00 PM and dinner 6:00 PM–11:30 PM; Tue and Sat dinner 6:00 PM–11:30 PM; closed Sun–Mon. Closed Jul 20–Aug 9, 2026.",
    },
    price: "$$$$",
    priceSource: "Official IGNIV menu and reservation calendar",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["creative", "swiss", "sharing_menu"],
    subcategory: "sharing_fine_dining",
    attributeTags: ["fine_dining", "sharing_menu", "reservation_required", "date_night"],
    editorialUrls: ["https://www.zuerich.com/en/visit/bars-lounges/igniv-zurich"],
  }),
  stop({
    id: "zurich-dining-markthalle",
    name: "Restaurant Markthalle",
    coordinates: [47.387744, 8.5263897],
    description:
      "Inside the Viadukt arches, Markthalle serves produce-forward bistro cooking that matches the surrounding food shops and neighborhood rhythm. It is strongest as an unforced lunch or early dinner before exploring Zurich-West, with the kitchen starting at 11:30 AM.",
    officialUrl: "https://www.restaurant-markthalle.ch/",
    hours: {
      default:
        "Mon 9:00 AM–11:00 PM; Tue–Sat 9:00 AM–12:00 AM; closed Sun. Hot food from 11:30 AM.",
    },
    price: "$$",
    priceSource: "Official restaurant menu and Zurich Tourism venue record",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["swiss", "seasonal", "european"],
    subcategory: "market_bistro",
    attributeTags: ["seasonal", "market_hall", "lunch", "group_friendly"],
    editorialUrls: ["https://www.zuerich.com/en/visit/restaurants/restaurant-markthalle"],
  }),
  stop({
    id: "zurich-dining-rigiblick",
    name: "Restaurant Rigiblick",
    coordinates: [47.3883565, 8.5532985],
    description:
      "Rigiblick combines a hillside panorama with modern European cooking that is more disciplined than the view-driven setting suggests. Weekend continuous service is useful, but the restaurant publishes holiday closures that should be treated as firm.",
    officialUrl: "https://www.restaurantrigiblick.ch/",
    bookingUrl: "https://www.restaurantrigiblick.ch/",
    hours: {
      default:
        "Wed–Fri 11:30 AM–2:00 PM and 6:00 PM–9:00 PM; Sat–Sun 12:00 PM–9:00 PM; closed Mon–Tue. Closed Aug 3–12 and Oct 4–13, 2026.",
    },
    price: "$$$",
    priceSource: "Official menu, reservation page, and published 2026 closure dates",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["european", "seasonal", "swiss"],
    subcategory: "scenic_restaurant",
    attributeTags: ["scenic_food", "reservation_recommended", "seasonal", "weekend_lunch"],
    editorialUrls: ["https://www.zuerich.com/en/visit/restaurants/restaurant-rigiblick"],
  }),
  stop({
    id: "zurich-dining-august",
    name: "Boucherie AuGust",
    coordinates: [47.3723326, 8.5400106],
    description:
      "AuGust is the Widder's relaxed counterpoint: a handsome butcher-shop room for Swiss beef, sausages, charcuterie and direct, ingredient-led plates. Daily all-day opening makes it one of the old town's more dependable quality meals without a tasting-menu commitment.",
    officialUrl: "https://www.widderhotel.com/en/eat-drink/august/",
    hours: { default: "Daily 11:30 AM–11:00 PM." },
    price: "$$$",
    priceSource: "Official menu and Zurich Tourism venue record",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["swiss", "steakhouse", "charcuterie"],
    subcategory: "meat_restaurant",
    attributeTags: ["meat_focused", "old_town", "all_day", "walk_in_friendly"],
    editorialUrls: ["https://www.zuerich.com/en/visit/restaurants/boucherie-august"],
  }),
];

const cheapEatStops: GuideStop[] = [
  stop({
    id: "zurich-cheap-sternen",
    name: "Sternen Grill",
    coordinates: [47.3672776, 8.5455633],
    description:
      "The downstairs counter is Zurich's classic standing meal: a grilled bratwurst, mustard and a crusty Bürli roll, eaten quickly beside Bellevue. It is fast, local and unusually late-opening; the upstairs restaurant is a different, slower operation.",
    officialUrl: "https://www.sternengrill.ch/",
    hours: {
      default:
        "Mon 10:30 AM–11:00 PM; Tue–Sat 10:30 AM–12:00 AM; Sun 10:30 AM–11:00 PM.",
    },
    price: "$",
    priceSource: "Official counter menu and Zurich Tourism venue record",
    venueKind: "food_drink",
    foodServiceType: "counter_service",
    cuisineTypes: ["swiss", "sausages", "street_food"],
    subcategory: "sausage_counter",
    attributeTags: ["budget_food", "quick_bite", "late_night", "local_classic"],
    editorialUrls: ["https://www.zuerich.com/de/besuchen/restaurants/sternen-grill"],
  }),
  stop({
    id: "zurich-cheap-aessbar",
    name: "Äss-Bar Stüssihofstatt",
    coordinates: [47.3726469, 8.5439266],
    description:
      "Äss-Bar rescues the previous day's unsold bread and pastries from local bakeries and sells them at reduced prices. The old-town branch is an economical breakfast or picnic stop with a sustainability model that is concrete rather than decorative.",
    officialUrl: "https://aess-bar.ch/",
    hours: {
      default:
        "Tue–Fri 9:00 AM–4:00 PM; Sat 9:30 AM–4:00 PM; closed Sun–Mon.",
    },
    price: "$",
    priceSource: "Official concept page and Zurich Tourism branch record",
    venueKind: "food_drink",
    foodServiceType: "bakery",
    cuisineTypes: ["bakery", "pastry", "swiss"],
    subcategory: "surplus_bakery",
    attributeTags: ["budget_food", "sustainable", "takeaway", "breakfast"],
    editorialUrls: ["https://www.zuerich.com/en/visit/shopping/ass-bar"],
  }),
  stop({
    id: "zurich-cheap-john-baker",
    name: "John Baker Bahnhofstrasse",
    coordinates: [47.368301, 8.5395473],
    description:
      "John Baker mills organic grain and bakes sourdough, filled rolls and laminated pastries in a central shop that is useful before a lake or old-town walk. Prices are Zurich bakery prices, but the bread quality and portability make the value clear.",
    officialUrl: "https://johnbaker.ch/",
    hours: {
      default:
        "Mon–Fri 7:00 AM–6:30 PM; Sat 8:00 AM–5:00 PM; closed Sun.",
    },
    price: "$",
    priceSource: "Official bakery range and Zurich Tourism branch record",
    venueKind: "food_drink",
    foodServiceType: "bakery",
    cuisineTypes: ["bakery", "sandwiches", "coffee"],
    subcategory: "artisan_bakery",
    attributeTags: ["budget_food", "breakfast", "takeaway", "organic"],
    editorialUrls: ["https://www.zuerich.com/en/visit/restaurants/john-baker-bahnhofstrasse"],
  }),
  stop({
    id: "zurich-cheap-brot",
    name: "Brot Bistro Bar",
    coordinates: [47.377488, 8.52584],
    description:
      "Set directly in Bäckeranlage, Brot serves changing lunch plates, soups, savory tarts and cakes with room to spill into the park. It is most useful for a low-pressure neighborhood meal or coffee, and summer brings free park concerts.",
    officialUrl: "https://brot.zuerich/",
    hours: {
      default:
        "Mon–Thu 8:00 AM–10:00 PM; Fri 8:00 AM–11:00 PM; Sat–Sun 9:00 AM–11:00 PM.",
    },
    price: "$",
    priceSource: "Official menu and Zurich Tourism venue record",
    venueKind: "food_drink",
    foodServiceType: "cafe",
    cuisineTypes: ["cafe", "swiss", "seasonal"],
    subcategory: "park_cafe",
    attributeTags: ["budget_food", "family_friendly", "outdoor_seating", "lunch"],
    editorialUrls: ["https://www.zuerich.com/en/visit/restaurants/brot-bistro-bar"],
  }),
  stop({
    id: "zurich-cheap-bite",
    name: "The Bite",
    coordinates: [47.3773121, 8.5277904],
    description:
      "The Bite makes substantial burgers with house sauces and Swiss beef in Kreis 4, with vegetarian alternatives and weekend brunch service. It costs more than a fast-food chain but remains a practical full meal in an expensive district.",
    officialUrl: "https://thebite.ch/",
    hours: {
      default:
        "Mon–Fri 5:30 PM–10:00 PM; Sat–Sun 10:00 AM–2:00 PM and 5:30 PM–10:00 PM.",
    },
    price: "$$",
    priceSource: "Official menu and Zurich Tourism venue record",
    venueKind: "food_drink",
    foodServiceType: "fast_casual",
    cuisineTypes: ["burgers", "american", "brunch"],
    subcategory: "burger_restaurant",
    attributeTags: ["casual", "group_friendly", "weekend_brunch", "vegetarian_options"],
    editorialUrls: ["https://www.zuerich.com/en/visit/restaurants/the-bite"],
  }),
  stop({
    id: "zurich-cheap-raclette",
    name: "Raclette Factory",
    coordinates: [47.3723807, 8.5439299],
    description:
      "Raclette Factory gives the melted-cheese ritual a compact, accessible old-town format with classic and flavored cheeses, potatoes and pickles. It is tourist-facing but honest about the product, and the continuous schedule is useful outside traditional meal windows.",
    officialUrl: "https://raclette-factory.ch/",
    hours: {
      default:
        "Mon–Thu and Sun 11:30 AM–10:30 PM; Fri–Sat 11:30 AM–11:30 PM.",
    },
    price: "$$",
    priceSource: "Official menu and Zurich Tourism venue record",
    venueKind: "food_drink",
    foodServiceType: "fast_casual",
    cuisineTypes: ["swiss", "raclette", "cheese"],
    subcategory: "raclette_counter",
    attributeTags: ["local_specialty", "casual", "old_town", "vegetarian_options"],
    editorialUrls: ["https://www.zuerich.com/en/visit/restaurants/raclette-factory"],
  }),
  stop({
    id: "zurich-cheap-wesleys",
    name: "Wesley's Kitchen",
    coordinates: [47.381828, 8.5326917],
    description:
      "Wesley's focuses on Shanghai-style dumplings, noodles and small plates with enough range for a shared table. The split weekday service and continuous weekend hours make it a useful value stop near Langstrasse and the main station.",
    officialUrl: "https://wesleys-kitchen.ch/",
    hours: {
      default:
        "Mon–Fri 11:30 AM–2:30 PM and 5:00 PM–10:00 PM; Sat 11:00 AM–10:00 PM; Sun 11:00 AM–9:00 PM.",
    },
    price: "$$",
    priceSource: "Official menu and Zurich Tourism venue record",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["chinese", "shanghainese", "dumplings"],
    subcategory: "dumpling_restaurant",
    attributeTags: ["casual", "sharing_food", "group_friendly", "vegetarian_options"],
    editorialUrls: ["https://www.zuerich.com/en/visit/restaurants/wesleys-kitchen"],
  }),
  stop({
    id: "zurich-cheap-holy-cow",
    name: "Holy Cow! Niederdorf",
    coordinates: [47.375082, 8.54444],
    description:
      "Holy Cow uses Swiss-sourced beef, chicken and cheese for fast burgers, including a Zürich honey-mustard version, in a shop close to Central. It is a reliable quick meal rather than a destination restaurant, with takeaway and broad daily hours.",
    officialUrl: "https://www.holycow.ch/",
    hours: {
      default:
        "Mon–Wed and Sun 11:00 AM–10:00 PM; Thu–Sat 11:00 AM–11:00 PM.",
    },
    price: "$",
    priceSource: "Official chain menu and Zurich Tourism Niederdorf record",
    venueKind: "food_drink",
    foodServiceType: "fast_food",
    cuisineTypes: ["burgers", "swiss", "fast_food"],
    subcategory: "burger_counter",
    attributeTags: ["budget_food", "quick_bite", "takeaway", "central"],
    editorialUrls: ["https://www.zuerich.com/en/visit/restaurants/holy-cow-niederdorf"],
  }),
  stop({
    id: "zurich-cheap-tibits",
    name: "tibits Seefeld",
    coordinates: [47.3649526, 8.5478868],
    description:
      "tibits prices its vegetarian and vegan buffet by weight, letting a small plate stay genuinely inexpensive while a large one can escalate. The Seefeld branch opens early and late, making it unusually flexible for breakfast, lunch or a post-lake dinner.",
    officialUrl: "https://www.tibits.ch/en/restaurants/zurich-seefeld",
    hours: {
      default:
        "Mon–Thu 6:30 AM–10:30 PM; Fri 6:30 AM–11:30 PM; Sat 8:00 AM–11:30 PM; Sun 9:00 AM–10:30 PM.",
    },
    price: "$",
    priceSource: "Official buffet pricing and Zurich Tourism branch record",
    venueKind: "food_drink",
    foodServiceType: "cafeteria",
    cuisineTypes: ["vegetarian", "vegan", "international"],
    subcategory: "vegetarian_buffet",
    attributeTags: ["budget_food", "vegan_friendly", "all_day", "quick_bite"],
    editorialUrls: ["https://www.zuerich.com/en/visit/restaurants/tibits-seefeld"],
  }),
  stop({
    id: "zurich-cheap-cafe-1842",
    name: "Café & Conditorei 1842",
    coordinates: [47.3714893, 8.5443699],
    description:
      "This richly paneled old-town café is better used for coffee, hot chocolate and a slice of house cake than for a full restaurant meal. The ornate rooms supply atmosphere without requiring a dinner budget, and the daily daytime schedule is simple.",
    officialUrl: "https://www.cafe1842.ch/",
    hours: { default: "Daily 9:00 AM–7:00 PM." },
    price: "$$",
    priceSource: "Official pastry menu and Zurich Tourism venue record",
    venueKind: "food_drink",
    foodServiceType: "cafe",
    cuisineTypes: ["swiss", "pastry", "coffee"],
    subcategory: "historic_cafe",
    attributeTags: ["historic", "coffee", "dessert", "old_town"],
    editorialUrls: ["https://www.zuerich.com/en/visit/restaurants/cafe-conditorei-1842"],
  }),
];

const hotelStops: GuideStop[] = [
  stop({
    id: "zurich-hotel-dolder",
    name: "The Dolder Grand",
    coordinates: [47.3727936, 8.5733694],
    description:
      "The Dolder sits above the city with lake-and-Alps views, a major art collection, a large spa and both historic and contemporary wings. Its seclusion is the luxury: use the Dolderbahn or hotel transfer rather than pretending it is an old-town base.",
    officialUrl: "https://www.thedoldergrand.com/en/",
    bookingUrl: "https://www.thedoldergrand.com/en/rooms-suites/",
    hours: {
      default:
        "Reception operates 24 hours daily; official check-in is from 3:00 PM and check-out is by 12:00 PM.",
    },
    price: "$$$$",
    priceSource: "Official property and booking pages",
    venueKind: "lodging",
    lodgingType: "hotel",
    subcategory: "hilltop_luxury_hotel",
    attributeTags: ["luxury", "spa", "scenic", "art_collection"],
    editorialUrls: ["https://www.zuerich.com/en/accommodation/the-dolder-grand"],
  }),
  stop({
    id: "zurich-hotel-baur-au-lac",
    name: "Baur au Lac",
    coordinates: [47.3671121, 8.5393433],
    description:
      "Family-owned since 1844, Baur au Lac occupies a private garden between Bahnhofstrasse and the lake, delivering old-school service without sacrificing a walkable center. Choose it for discreet formality and garden calm, not contemporary minimalism.",
    officialUrl: "https://www.bauraulac.ch/en/",
    bookingUrl: "https://www.bauraulac.ch/en/rooms-suites/",
    hours: {
      default:
        "Reception operates 24 hours daily; official check-in is from 3:00 PM and check-out is by 12:00 PM.",
    },
    price: "$$$$",
    priceSource: "Official property and reservation pages",
    venueKind: "lodging",
    lodgingType: "hotel",
    subcategory: "historic_luxury_hotel",
    attributeTags: ["luxury", "historic", "garden", "central"],
    editorialUrls: ["https://www.zuerich.com/en/accommodation/baur-au-lac"],
  }),
  stop({
    id: "zurich-hotel-mandarin-savoy",
    name: "Mandarin Oriental Savoy",
    coordinates: [47.3697691, 8.5397725],
    description:
      "The restored 1838 Savoy places Mandarin Oriental service directly on Paradeplatz, with contemporary interiors and a rooftop above the financial district. The address is exceptionally central but feels urban rather than retreat-like.",
    officialUrl: "https://www.mandarinoriental.com/en/zurich/savoy",
    bookingUrl: "https://www.mandarinoriental.com/en/zurich/savoy/accommodation",
    hours: {
      default:
        "Reception operates 24 hours daily; official check-in is from 3:00 PM and check-out is by 12:00 PM.",
    },
    price: "$$$$",
    priceSource: "Official Mandarin Oriental property and booking pages",
    venueKind: "lodging",
    lodgingType: "hotel",
    subcategory: "paradeplatz_luxury",
    attributeTags: ["luxury", "design", "central", "rooftop"],
    editorialUrls: ["https://www.zuerich.com/en/accommodation/mandarin-oriental-savoy"],
  }),
  stop({
    id: "zurich-hotel-widder",
    name: "Widder Hotel",
    coordinates: [47.3724404, 8.5398562],
    description:
      "Widder threads contemporary rooms through nine medieval old-town houses, preserving timber, stone and irregular plans rather than flattening them into one generic hotel. It is ideal for design-conscious travelers who want both history and a serious bar and restaurant downstairs.",
    officialUrl: "https://www.widderhotel.com/en/",
    bookingUrl: "https://www.widderhotel.com/en/rooms-suites/",
    hours: {
      default:
        "Reception operates 24 hours daily; official check-in is from 3:00 PM and check-out is by 12:00 PM.",
    },
    price: "$$$$",
    priceSource: "Official property and booking pages",
    venueKind: "lodging",
    lodgingType: "hotel",
    subcategory: "old_town_design_hotel",
    attributeTags: ["luxury", "design", "historic", "central"],
    editorialUrls: ["https://www.zuerich.com/en/accommodation/widder-hotel"],
  }),
  stop({
    id: "zurich-hotel-storchen",
    name: "Storchen Zürich",
    coordinates: [47.3712661, 8.5417938],
    description:
      "Storchen faces the Limmat from Weinplatz, turning river views and a tiny old-town footprint into its main advantage. Rooms can be compact, but the boat landing, breakfast terrace and walkability make the location unusually functional.",
    officialUrl: "https://storchen.ch/en/",
    bookingUrl: "https://storchen.ch/en/rooms-suites/",
    hours: {
      default:
        "Reception operates 24 hours daily; official check-in is from 3:00 PM and check-out is by 12:00 PM.",
    },
    price: "$$$$",
    priceSource: "Official property and reservation pages",
    venueKind: "lodging",
    lodgingType: "hotel",
    subcategory: "riverfront_luxury_hotel",
    attributeTags: ["luxury", "scenic", "old_town", "central"],
    editorialUrls: ["https://www.zuerich.com/en/accommodation/hotel-storchen"],
  }),
  stop({
    id: "zurich-hotel-park-hyatt",
    name: "Park Hyatt Zurich",
    coordinates: [47.3664228, 8.5360401],
    description:
      "Park Hyatt offers large contemporary rooms, polished business-hotel service and an easy walk to both the lake and Bahnhofstrasse. It lacks old-town romance, but travelers prioritizing space, predictable service and Enge access may prefer exactly that.",
    officialUrl: "https://www.hyatt.com/park-hyatt/en-US/zurph-park-hyatt-zurich",
    bookingUrl: "https://www.hyatt.com/park-hyatt/en-US/zurph-park-hyatt-zurich/rooms",
    hours: {
      default:
        "Reception operates 24 hours daily; official check-in is from 3:00 PM and check-out is by 12:00 PM.",
    },
    price: "$$$$",
    priceSource: "Official Hyatt property and booking pages",
    venueKind: "lodging",
    lodgingType: "hotel",
    subcategory: "modern_luxury_hotel",
    attributeTags: ["luxury", "business_travel", "spacious_rooms", "central"],
    editorialUrls: ["https://www.zuerich.com/en/accommodation/park-hyatt-zurich"],
  }),
  stop({
    id: "zurich-hotel-schweizerhof",
    name: "Hotel Schweizerhof Zürich",
    coordinates: [47.3768257, 8.5393966],
    description:
      "Schweizerhof stands directly opposite the main station, combining traditional service with the city's easiest rail arrival. It is the practical polished choice for early trains and short stays; request a quieter room if station-side energy is a concern.",
    officialUrl: "https://www.hotelschweizerhof.com/en/",
    bookingUrl: "https://www.hotelschweizerhof.com/en/rooms-suites/",
    hours: {
      default:
        "Reception operates 24 hours daily; official check-in is from 3:00 PM and check-out is by 12:00 PM.",
    },
    price: "$$$",
    priceSource: "Official property and booking pages",
    venueKind: "lodging",
    lodgingType: "hotel",
    subcategory: "station_hotel",
    attributeTags: ["rail_access", "central", "historic", "business_travel"],
    editorialUrls: ["https://www.zuerich.com/en/accommodation/hotel-schweizerhof-zurich"],
  }),
  stop({
    id: "zurich-hotel-25hours",
    name: "25hours Hotel Langstrasse",
    coordinates: [47.3804427, 8.5287088],
    description:
      "25hours translates Langstrasse's rail-and-nightlife edge into playful rooms, a lively lobby, sauna and bikes for exploring. The social atmosphere is a feature, but light sleepers should choose room orientation carefully near the tracks.",
    officialUrl: "https://25hours-hotels.com/zurich/langstrasse/",
    bookingUrl: "https://25hours-hotels.com/zurich/langstrasse/rooms/",
    hours: {
      default:
        "Reception operates 24 hours daily; official check-in is from 3:00 PM and check-out is by 12:00 PM.",
    },
    price: "$$$",
    priceSource: "Official property and booking pages",
    venueKind: "lodging",
    lodgingType: "hotel",
    subcategory: "lifestyle_hotel",
    attributeTags: ["design", "nightlife", "social", "sauna"],
    editorialUrls: ["https://www.zuerich.com/en/accommodation/25hours-hotel-langstrasse"],
  }),
  stop({
    id: "zurich-hotel-b2",
    name: "B2 Hotel Zürich",
    coordinates: [47.3644259, 8.5244677],
    description:
      "B2 converts the former Hürlimann brewery into a warm design hotel whose library lounge and direct thermal-bath access carry the industrial story forward. It is south of the core but rewards the detour with a genuine spa stay rather than a decorative wellness room.",
    officialUrl: "https://www.b2hotel.ch/en/",
    bookingUrl: "https://www.b2hotel.ch/en/rooms/",
    hours: {
      default:
        "Reception operates 24 hours daily; official check-in is from 3:00 PM and check-out is by 11:00 AM.",
    },
    price: "$$$",
    priceSource: "Official property, room, and spa pages",
    venueKind: "lodging",
    lodgingType: "hotel",
    subcategory: "brewery_spa_hotel",
    attributeTags: ["design", "spa", "industrial_heritage", "quiet"],
    editorialUrls: ["https://www.zuerich.com/en/accommodation/b2-boutique-hotel-spa"],
  }),
  stop({
    id: "zurich-hotel-marktgasse",
    name: "Marktgasse Hotel",
    coordinates: [47.3720083, 8.5434795],
    description:
      "Marktgasse combines restrained contemporary rooms with a 15th-century old-town building and direct access to IGNIV and the lively Niederdorf lanes. Location wins over room size; expect historic geometry and evening street energy.",
    officialUrl: "https://www.marktgassehotel.ch/en/",
    bookingUrl: "https://www.marktgassehotel.ch/en/rooms-suites",
    hours: {
      default:
        "Reception operates 24 hours daily; official check-in is from 3:00 PM and check-out is by 12:00 PM.",
    },
    price: "$$$",
    priceSource: "Official property and booking pages",
    venueKind: "lodging",
    lodgingType: "hotel",
    subcategory: "old_town_boutique_hotel",
    attributeTags: ["boutique", "design", "old_town", "nightlife"],
    editorialUrls: ["https://www.zuerich.com/en/accommodation/hotel-marktgasse"],
  }),
];

const hostelStops: GuideStop[] = [
  stop({
    id: "zurich-hostel-youth-hostel",
    name: "Zurich Youth Hostel",
    coordinates: [47.3476905, 8.5278084],
    description:
      "This purpose-built Swiss Youth Hostels property offers real dorms, family rooms, breakfast and generous common space near Wollishofen and the lake. It is not central on foot, but frequent tram and bus links make the quieter location workable.",
    officialUrl: "https://www.youthhostel.ch/en/hostels/zurich-youth-hostel",
    bookingUrl: "https://www.youthhostel.ch/en/hostels/zurich-youth-hostel",
    hours: {
      default:
        "Reception operates 24 hours daily; official check-in is from 3:00 PM and check-out is by 10:00 AM.",
    },
    price: "$",
    priceSource: "Official Swiss Youth Hostels booking page",
    venueKind: "lodging",
    lodgingType: "hostel",
    subcategory: "youth_hostel",
    attributeTags: ["dorms", "family_friendly", "breakfast_included", "lake_access"],
    editorialUrls: ["https://www.zuerich.com/en/accommodation/zurich-youth-hostel"],
  }),
  stop({
    id: "zurich-hostel-meininger",
    name: "MEININGER Zürich Greencity",
    coordinates: [47.3382, 8.5185],
    description:
      "MEININGER mixes dorm beds, private rooms, a guest kitchen and a social lobby beside Manegg station in the Greencity development. The train reaches the center quickly, but the suburban setting is chosen for value rather than street life.",
    officialUrl: "https://www.meininger-hotels.com/en/hotels/zurich/hotel-zurich-greencity/",
    bookingUrl: "https://www.meininger-hotels.com/en/hotels/zurich/hotel-zurich-greencity/",
    hours: {
      default:
        "Reception operates 24 hours daily; official check-in is from 3:00 PM and check-out is by 11:00 AM.",
    },
    price: "$",
    priceSource: "Official MEININGER room and dorm booking page",
    venueKind: "lodging",
    lodgingType: "hostel",
    subcategory: "large_social_hostel",
    attributeTags: ["dorms", "guest_kitchen", "rail_access", "group_friendly"],
    editorialUrls: ["https://www.hostelworld.com/hostels/p/311098/meininger-zurich-greencity/"],
  }),
  stop({
    id: "zurich-hostel-otter",
    name: "Oldtown Hostel Otter",
    coordinates: [47.3685524, 8.5455884],
    description:
      "Otter places simple dorms and private rooms above a bar on one of the old town's liveliest pedestrian lanes. The location is exceptional for nightlife and lake access, but noise and stairs are the honest tradeoffs.",
    officialUrl: "https://oldtownzurich.com/",
    bookingUrl: "https://oldtownzurich.com/",
    hours: {
      default:
        "Reception and staffed check-in daily 3:00 PM–9:00 PM; late arrivals use the official key-box procedure. Check-out is 8:30 AM–10:00 AM.",
    },
    price: "$",
    priceSource: "Official hostel room and booking page",
    venueKind: "lodging",
    lodgingType: "hostel",
    subcategory: "old_town_hostel",
    attributeTags: ["dorms", "nightlife", "central", "bar"],
    editorialUrls: ["https://www.hostelworld.com/hostels/p/10031/oldtown-hostel-otter/"],
  }),
  stop({
    id: "zurich-hostel-green-marmot",
    name: "Green Marmot Capsule Hostel",
    coordinates: [47.36952, 8.54458],
    description:
      "Green Marmot offers compact sleeping capsules near the Limmat and Bellevue, prioritizing privacy and location over lounge space. It suits short, light-luggage stays; the stacked capsules and shared bathrooms are deliberate constraints.",
    officialUrl: "https://www.greenmarmot.com/zurich",
    bookingUrl: "https://www.greenmarmot.com/zurich",
    hours: {
      default:
        "Reception daily 2:00 PM–10:00 PM; official online check-in handles approved late arrivals. Check-out is by 10:00 AM.",
    },
    price: "$",
    priceSource: "Official capsule and reservation page",
    venueKind: "lodging",
    lodgingType: "hostel",
    subcategory: "capsule_hostel",
    attributeTags: ["capsules", "central", "short_stay", "shared_bathrooms"],
    editorialUrls: ["https://www.hostelworld.com/hostels/p/311994/green-marmot-capsule-hostel-zurich/"],
  }),
  stop({
    id: "zurich-hostel-viktoria",
    name: "Viktoria Budget Hostel",
    coordinates: [47.3998517, 8.5012448],
    description:
      "Viktoria is a small budget property in residential Höngg with shared facilities and a quieter feel than the center's dorms. The tram ride is the price of lower rates; travelers wanting nightlife at the door should stay elsewhere.",
    officialUrl: "https://www.viktoria-budget-hostel.ch/",
    bookingUrl: "https://www.viktoria-budget-hostel.ch/",
    hours: {
      default:
        "Official check-in window is 3:00 PM–10:00 PM and check-out is by 10:00 AM; arrival details are issued by the property booking page.",
    },
    price: "$",
    priceSource: "Official property and current hostel booking pages",
    venueKind: "lodging",
    lodgingType: "hostel",
    subcategory: "quiet_budget_hostel",
    attributeTags: ["budget", "quiet", "shared_facilities", "tram_access"],
    editorialUrls: ["https://www.hostelworld.com/hostels/p/318198/viktoria-budget-hostel/"],
  }),
  stop({
    id: "zurich-hostel-alpine-garden",
    name: "Alpine Garden Capsule Hotel",
    coordinates: [47.452039, 8.5626989],
    description:
      "Alpine Garden puts sleeping capsules inside Zurich Airport, turning a late arrival or early departure into the entire point of the stay. It is in Kloten rather than the city center, so choose it only when terminal access outweighs neighborhood experience.",
    officialUrl: "https://capsulehotel.ch/en/zurich-airport/",
    bookingUrl: "https://capsulehotel.ch/en/zurich-airport/",
    hours: {
      default:
        "Reception operates 24 hours daily; official check-in is from 2:00 PM and check-out is by 10:00 AM.",
    },
    price: "$",
    priceSource: "Official capsule and airport booking page",
    venueKind: "lodging",
    lodgingType: "hostel",
    subcategory: "airport_capsule_hostel",
    attributeTags: ["capsules", "airport", "late_arrival", "short_stay"],
    editorialUrls: ["https://www.hostelworld.com/hostels/p/313250/alpine-garden-capsule-hotel/"],
  }),
  stop({
    id: "zurich-hostel-josephines",
    name: "Josephine's Guesthouse for Women",
    coordinates: [47.37472, 8.52636],
    description:
      "Josephine's is a women-only guesthouse with private rooms, shared kitchens and a roof terrace near Langstrasse. It offers more independence and calm than a dorm hostel while keeping social shared spaces and a clear safety-focused policy.",
    officialUrl: "https://www.josephines.ch/en/",
    bookingUrl: "https://www.josephines.ch/en/rooms-prices/",
    hours: {
      default:
        "Staffed reception Mon–Fri 8:00 AM–5:00 PM; official self-check-in instructions cover evenings and weekends. Room check-in is from 3:00 PM and check-out by 11:00 AM.",
    },
    price: "$$",
    priceSource: "Official women-only guesthouse room and booking page",
    venueKind: "lodging",
    lodgingType: "guesthouse",
    subcategory: "women_only_guesthouse",
    attributeTags: ["women_only", "guest_kitchen", "roof_terrace", "longer_stay"],
    editorialUrls: ["https://www.zuerich.com/en/accommodation/josephines-guesthouse-for-women"],
  }),
  stop({
    id: "zurich-hostel-fuerdich",
    name: "Guesthouse fürDich",
    coordinates: [47.37337, 8.51796],
    description:
      "fürDich rents individually styled guest rooms above a neighborhood café by Bullingerplatz, giving travelers a residential Kreis 4 base rather than a conventional lobby. Shared bathrooms in some categories keep prices lower, and café hours define in-person assistance.",
    officialUrl: "https://www.fuerdich.ch/guesthouse/",
    bookingUrl: "https://www.fuerdich.ch/guesthouse/",
    hours: {
      default:
        "Check-in Mon–Sat 3:00 PM–11:00 PM and Sun 3:00 PM–8:00 PM; check-out by 11:00 AM.",
    },
    price: "$$",
    priceSource: "Official guesthouse room and booking page",
    venueKind: "lodging",
    lodgingType: "guesthouse",
    subcategory: "cafe_guesthouse",
    attributeTags: ["neighborhood", "cafe", "shared_bathrooms", "quiet"],
    editorialUrls: ["https://www.zuerich.com/en/accommodation/pension-furdich"],
  }),
  stop({
    id: "zurich-hostel-kafischnaps",
    name: "Pension Kafischnaps",
    coordinates: [47.38516, 8.52908],
    description:
      "Kafischnaps combines a small pension with a local café-bar near Limmatplatz, so the stay feels embedded in daily neighborhood life. Rooms are simple and individual; this is for independent travelers who prefer character to round-the-clock hotel infrastructure.",
    officialUrl: "https://www.kafischnaps.ch/",
    bookingUrl: "https://www.kafischnaps.ch/pension/",
    hours: {
      default:
        "Check-in daily 3:00 PM–11:45 PM; check-out by 11:00 AM.",
    },
    price: "$$",
    priceSource: "Official pension room and booking page",
    venueKind: "lodging",
    lodgingType: "guesthouse",
    subcategory: "neighborhood_pension",
    attributeTags: ["neighborhood", "cafe", "independent", "tram_access"],
    editorialUrls: ["https://www.zuerich.com/en/accommodation/pension-kafischnaps"],
  }),
  stop({
    id: "zurich-hostel-fischers-fritz",
    name: "Camping Fischers Fritz",
    coordinates: [47.32551, 8.54232],
    description:
      "Fischers Fritz offers lakeside tent and camper pitches in Wollishofen with direct swimming access and city transit nearby. It is seasonal outdoor lodging, not a cheap room substitute: weather, equipment and the campground calendar shape the experience.",
    officialUrl: "https://www.fischers-fritz.ch/en/camping/",
    bookingUrl: "https://www.fischers-fritz.ch/en/camping/",
    hours: {
      default:
        "Camping reception daily 8:00 AM–12:00 PM and 2:00 PM–8:00 PM during the official camping season; arrivals and seasonal opening dates follow the property booking calendar.",
    },
    price: "$",
    priceSource: "Official campground tariff and booking page",
    venueKind: "lodging",
    lodgingType: "camping",
    subcategory: "urban_lakeside_camping",
    attributeTags: ["camping", "lake_access", "seasonal", "outdoors"],
    editorialUrls: ["https://www.zuerich.com/en/accommodation/camping-fischers-fritz"],
  }),
];

const casualBarStops: GuideStop[] = [
  stop({
    id: "zurich-bar-ole-ole",
    name: "Olé Olé Bar",
    coordinates: [47.3800296, 8.5280643],
    description:
      "Olé Olé is a tiny, loud Langstrasse institution where stickers, football talk and close quarters matter more than drink technique. It is best treated as a late stop with strong neighborhood character, not a polished cocktail destination.",
    officialUrl: "https://www.zuerich.com/en/visit/bars-lounges/ole-ole-bar",
    hours: { default: "Daily 5:00 PM–4:00 AM." },
    price: "$$",
    priceSource: "Current Zurich Tourism venue record and bar menu",
    venueKind: "food_drink",
    nightlifeType: "dive_bar",
    subcategory: "late_dive_bar",
    attributeTags: ["late_night", "local_classic", "loud", "walk_in_friendly"],
  }),
  stop({
    id: "zurich-bar-el-lokal",
    name: "El Lokal",
    coordinates: [47.3744071, 8.5336734],
    description:
      "El Lokal fills a riverside former warehouse with mismatched art, a giant skeleton, concerts and an easygoing bar crowd. The terrace and Sihl setting make late afternoon as compelling as night, while the live calendar controls the energy.",
    officialUrl: "https://www.ellokal.ch/",
    hours: {
      default:
        "Mon–Fri 4:15 PM–12:00 AM; Sat–Sun 2:15 PM–12:00 AM. Concert timing follows the official event calendar.",
    },
    price: "$$",
    priceSource: "Official bar and event pages",
    venueKind: "event_venue",
    nightlifeType: "live_music_venue",
    subcategory: "riverside_live_bar",
    attributeTags: ["live_music", "outdoor_seating", "casual", "local_classic"],
    editorialUrls: ["https://www.zuerich.com/en/visit/bars-lounges/el-lokal"],
  }),
  stop({
    id: "zurich-bar-graebli",
    name: "Gräbli Bar",
    coordinates: [47.3755965, 8.5441089],
    description:
      "Gräbli is the Niederdorf's all-hours pressure valve, serving a mixed crowd from dawn until nearly dawn and running continuously through Friday and Saturday. Go for people-watching and old-school bar culture, not quiet conversation.",
    officialUrl: "https://www.zuerich.com/en/visit/bars-lounges/grabli-bar",
    hours: {
      default:
        "Mon–Thu and Sun 5:00 AM–4:00 AM the following day; open continuously Fri–Sat.",
    },
    price: "$$",
    priceSource: "Current Zurich Tourism venue record and bar menu",
    venueKind: "food_drink",
    nightlifeType: "dive_bar",
    subcategory: "all_hours_bar",
    attributeTags: ["late_night", "early_morning", "old_town", "people_watching"],
  }),
  stop({
    id: "zurich-bar-eldorado",
    name: "Eldorado",
    coordinates: [47.38347, 8.53102],
    description:
      "Eldorado stocks 101 beers beside Limmatplatz and occasionally turns the compact room over to live bands. It is a selection-first neighborhood bar with a relaxed crowd; Friday and Saturday extend later than the weekday rhythm.",
    officialUrl: "https://www.zuerich.com/en/visit/bars-lounges/eldorado",
    hours: {
      default:
        "Mon–Tue 5:00 PM–12:00 AM; Wed–Thu 5:00 PM–1:00 AM; Fri 5:00 PM–2:00 AM; Sat 8:00 PM–2:00 AM; closed Sun.",
    },
    price: "$$",
    priceSource: "Current Zurich Tourism venue record and beer list",
    venueKind: "event_venue",
    nightlifeType: "beer_bar",
    subcategory: "craft_beer_bar",
    attributeTags: ["craft_beer", "live_music", "casual", "nightlife"],
  }),
  stop({
    id: "zurich-bar-international",
    name: "The International Beer Bar",
    coordinates: [47.3828872, 8.5287112],
    description:
      "This compact bar rotates independent Swiss and international taps with a knowledgeable but unpretentious service style. The daily 4 PM opening and midnight close make it a dependable first or middle stop rather than an after-hours room.",
    officialUrl: "https://www.theinternational.ch/",
    hours: { default: "Daily 4:00 PM–12:00 AM." },
    price: "$$",
    priceSource: "Official tap list and Zurich Tourism venue record",
    venueKind: "food_drink",
    nightlifeType: "beer_bar",
    subcategory: "independent_beer_bar",
    attributeTags: ["craft_beer", "rotating_taps", "casual", "walk_in_friendly"],
    editorialUrls: ["https://www.zuerich.com/en/visit/bars-lounges/the-international-beer-bar"],
  }),
  stop({
    id: "zurich-bar-mikkeller",
    name: "Mikkeller Zürich",
    coordinates: [47.3712712, 8.520318],
    description:
      "Mikkeller brings the Danish brewery's broad tap range to a clean, low-key Sihlfeld room, with enough styles to support a tasting rather than one default lager. It is calmer than Langstrasse and closes earlier on Sunday.",
    officialUrl: "https://www.mikkeller.com/locations/mikkeller-bar-zurich",
    hours: {
      default:
        "Tue–Fri 5:00 PM–12:00 AM; Sat 3:00 PM–12:00 AM; Sun 3:00 PM–10:00 PM; closed Mon.",
    },
    price: "$$",
    priceSource: "Official location tap list and Zurich Tourism venue record",
    venueKind: "food_drink",
    nightlifeType: "beer_bar",
    subcategory: "brewery_tap_bar",
    attributeTags: ["craft_beer", "rotating_taps", "casual", "neighborhood"],
    editorialUrls: ["https://www.zuerich.com/en/visit/bars-lounges/mikkeller-zurich"],
  }),
  stop({
    id: "zurich-bar-kon-tiki",
    name: "Kon-Tiki",
    coordinates: [47.3738276, 8.5437708],
    description:
      "Kon-Tiki is a deliberately unfussy Niederdorf pub with a broad regular crowd, inexpensive mood and longer weekend nights. Despite the name, it is better understood as an old-town local than a themed tiki cocktail bar.",
    officialUrl: "https://www.zuerich.com/en/visit/bars-lounges/kon-tiki-coffeeshop-bar",
    hours: {
      default:
        "Mon–Thu and Sun 3:00 PM–12:00 AM; Fri–Sat 3:00 PM–2:00 AM.",
    },
    price: "$$",
    priceSource: "Current Zurich Tourism venue record and bar menu",
    venueKind: "food_drink",
    nightlifeType: "pub",
    subcategory: "old_town_pub",
    attributeTags: ["casual", "old_town", "late_night", "walk_in_friendly"],
  }),
  stop({
    id: "zurich-bar-zueri",
    name: "Züri Bar",
    coordinates: [47.3739069, 8.543775],
    description:
      "Züri Bar is a compact Niederdorf drinking room with a neighborhood feel and little need for a concept beyond conversation and straightforward drinks. It is closed Sunday and saves its 2 AM finish for Friday and Saturday.",
    officialUrl: "https://www.zuerich.com/en/visit/bars-lounges/zuri-bar",
    hours: {
      default:
        "Mon–Thu 5:00 PM–12:00 AM; Fri–Sat 5:00 PM–2:00 AM; closed Sun.",
    },
    price: "$$",
    priceSource: "Current Zurich Tourism venue record and bar menu",
    venueKind: "food_drink",
    nightlifeType: "pub",
    subcategory: "neighborhood_bar",
    attributeTags: ["casual", "old_town", "late_night", "local_crowd"],
  }),
  stop({
    id: "zurich-bar-regenbogen",
    name: "Regenbogen Bar",
    coordinates: [47.3731353, 8.5432846],
    description:
      "Regenbogen is a long-running LGBTQ+ bar in the old town whose welcoming daytime-to-late schedule supports both aperitif conversation and weekend nights. Saturday begins at 11 AM, while Thursday through Saturday carry the 2 AM close.",
    officialUrl: "https://www.zuerich.com/en/visit/bars-lounges/regenbogen-bar",
    hours: {
      default:
        "Mon–Wed and Sun 2:00 PM–12:30 AM; Thu–Fri 2:00 PM–2:00 AM; Sat 11:00 AM–2:00 AM.",
    },
    price: "$$",
    priceSource: "Current Zurich Tourism venue record and bar menu",
    venueKind: "food_drink",
    nightlifeType: "other",
    subcategory: "lgbtq_bar",
    attributeTags: ["lgbtq_friendly", "welcoming", "old_town", "late_night"],
  }),
  stop({
    id: "zurich-bar-cabaret-voltaire",
    name: "Cabaret Voltaire Bar",
    coordinates: [47.3716594, 8.5440651],
    description:
      "The birthplace of Dada remains a working cultural space, with a café-bar, exhibitions, performances and a library compressed into the Spiegelgasse building. Come for the overlap of art and drinking; the event calendar matters more than bar theatrics.",
    officialUrl: "https://www.cabaretvoltaire.ch/",
    hours: {
      default:
        "Tue–Thu 5:00 PM–12:00 AM; Fri–Sat 1:30 PM–1:30 AM; Sun 1:30 PM–6:00 PM; closed Mon. Events follow the official calendar.",
    },
    price: "$$",
    priceSource: "Official venue program and Zurich Tourism bar record",
    venueKind: "event_venue",
    nightlifeType: "other",
    subcategory: "arts_bar",
    attributeTags: ["art", "historic", "events", "old_town"],
    editorialUrls: ["https://www.zuerich.com/en/visit/bars-lounges/bar/cafe-cabaret-voltaire"],
  }),
];

const cocktailStops: GuideStop[] = [
  stop({
    id: "zurich-cocktail-old-crow",
    name: "Old Crow",
    coordinates: [47.37212, 8.5412013],
    description:
      "Old Crow is a spirit library disguised as a small old-town bar, with deep whisky shelves and bartenders comfortable moving between classics and precise custom drinks. Seats are scarce and the room rewards an early arrival.",
    officialUrl: "https://www.oldcrow.ch/",
    hours: { default: "Mon–Sat 5:00 PM–12:30 AM; closed Sun." },
    price: "$$$",
    priceSource: "Official drinks list and Zurich Tourism venue record",
    venueKind: "food_drink",
    nightlifeType: "cocktail_bar",
    subcategory: "spirits_cocktail_bar",
    attributeTags: ["cocktails", "whisky", "intimate", "reservation_recommended"],
    editorialUrls: ["https://www.zuerich.com/en/visit/bars-lounges/old-crow"],
  }),
  stop({
    id: "zurich-cocktail-widder",
    name: "Widder Bar",
    coordinates: [47.3724404, 8.5398562],
    description:
      "Widder Bar combines a vast spirits collection, technically exact classics and nightly live jazz inside the historic hotel complex. Prices reflect the setting, but the music and depth of the back bar make it more than a generic hotel lounge.",
    officialUrl: "https://www.widderhotel.com/en/eat-drink/widder-bar/",
    hours: {
      default:
        "Mon–Thu 12:00 PM–1:00 AM; Fri–Sat 12:00 PM–2:00 AM; Sun 12:00 PM–12:00 AM. Live music follows the official calendar.",
    },
    price: "$$$",
    priceSource: "Official drinks menu and live-music page",
    venueKind: "event_venue",
    nightlifeType: "cocktail_bar",
    subcategory: "hotel_jazz_bar",
    attributeTags: ["cocktails", "live_music", "whisky", "splurge_drinks"],
    editorialUrls: ["https://www.zuerich.com/en/visit/bars-lounges/widder-bar"],
  }),
  stop({
    id: "zurich-cocktail-kronenhalle",
    name: "Kronenhalle Bar",
    coordinates: [47.3675511, 8.5457188],
    description:
      "Robert Haussmann's sculptural interior and original works by Picasso and Miró turn Kronenhalle Bar into a design and art stop with serious classic cocktails. Summer hours shift to an evening start, so do not assume the dining room's noon opening applies.",
    officialUrl: "https://www.kronenhalle.com/en/bar/",
    hours: {
      default:
        "Sep–Jun: Mon–Thu and Sun 11:30 AM–12:00 AM, Fri–Sat 11:30 AM–12:30 AM. Jul–Aug: daily 5:00 PM–12:00 AM.",
    },
    price: "$$$",
    priceSource: "Official bar menu and seasonal hours page",
    venueKind: "food_drink",
    nightlifeType: "cocktail_bar",
    subcategory: "historic_art_bar",
    attributeTags: ["cocktails", "art_collection", "historic", "design"],
    editorialUrls: ["https://www.zuerich.com/en/visit/bars-lounges/kronenhalle-bar"],
  }),
  stop({
    id: "zurich-cocktail-am-wasser",
    name: "Bar am Wasser",
    coordinates: [47.3675716, 8.5416358],
    description:
      "Bar am Wasser uses a bright riverside room for polished cocktails, Champagne and a daytime coffee-to-aperitif transition. Its early opening is unusual for a serious bar, while Sunday remains a firm closure.",
    officialUrl: "https://baramwasser.ch/",
    hours: { default: "Mon–Sat 8:00 AM–12:00 AM; closed Sun." },
    price: "$$$",
    priceSource: "Official drinks menu and Zurich Tourism venue record",
    venueKind: "food_drink",
    nightlifeType: "cocktail_bar",
    subcategory: "riverside_cocktail_bar",
    attributeTags: ["cocktails", "riverside", "aperitif", "design"],
    editorialUrls: ["https://www.zuerich.com/de/besuchen/bars-lounges/bar-am-wasser"],
  }),
  stop({
    id: "zurich-cocktail-tales",
    name: "Tales Bar",
    coordinates: [47.3727707, 8.5326599],
    description:
      "Tales is a bartender-led room near Selnau where focused menus and custom recommendations take precedence over spectacle. The 3 AM close makes it a rare serious late option, but the bar is closed Sunday and Monday.",
    officialUrl: "https://www.tales-bar.ch/",
    hours: { default: "Tue–Sat 6:00 PM–3:00 AM; closed Sun–Mon." },
    price: "$$$",
    priceSource: "Official cocktail menu and Zurich Tourism venue record",
    venueKind: "food_drink",
    nightlifeType: "cocktail_bar",
    subcategory: "late_cocktail_bar",
    attributeTags: ["cocktails", "late_night", "bartender_choice", "intimate"],
    editorialUrls: ["https://www.zuerich.com/en/visit/bars-lounges/tales-bar"],
  }),
  stop({
    id: "zurich-cocktail-sacchi",
    name: "Bar Sacchi",
    coordinates: [47.3753496, 8.5165696],
    description:
      "Sacchi runs from morning espresso to late cocktails in a warm neighborhood room near Lochergut. The all-day identity is the point: arrive for an aperitivo and stay if the room shifts into a Friday or Saturday night.",
    officialUrl: "https://www.barsacchi.ch/",
    hours: {
      default:
        "Mon–Wed 8:00 AM–12:00 AM; Thu 8:00 AM–1:00 AM; Fri 8:00 AM–2:00 AM; Sat 9:00 AM–2:00 AM; Sun 10:00 AM–12:00 AM.",
    },
    price: "$$",
    priceSource: "Official bar menu and Zurich Tourism venue record",
    venueKind: "food_drink",
    nightlifeType: "cocktail_bar",
    subcategory: "all_day_neighborhood_bar",
    attributeTags: ["cocktails", "coffee", "aperitif", "neighborhood"],
    editorialUrls: ["https://www.zuerich.com/en/visit/bars-lounges/bar-sacchi"],
  }),
  stop({
    id: "zurich-cocktail-raygrodski",
    name: "Raygrodski",
    coordinates: [47.374717, 8.5167506],
    description:
      "Raygrodski is a low-lit Sihlfeld cocktail room where balanced classics, house drinks and a compact crowd create more intimacy than theater. It opens only in the evening and stays closed Sunday.",
    officialUrl: "https://www.raygrodski.ch/",
    hours: {
      default:
        "Mon–Wed 6:00 PM–12:00 AM; Thu 6:00 PM–1:00 AM; Fri–Sat 6:00 PM–2:00 AM; closed Sun.",
    },
    price: "$$$",
    priceSource: "Official drinks menu and Zurich Tourism venue record",
    venueKind: "food_drink",
    nightlifeType: "cocktail_bar",
    subcategory: "neighborhood_cocktail_bar",
    attributeTags: ["cocktails", "intimate", "date_night", "late_night"],
    editorialUrls: ["https://www.zuerich.com/en/visit/bars-lounges/raygrodski"],
  }),
  stop({
    id: "zurich-cocktail-cinchona",
    name: "Cinchona Bar",
    coordinates: [47.3805067, 8.5286126],
    description:
      "Cinchona anchors the 25hours lobby with highballs, aperitifs and a playful hotel-bar crowd that spills into Langstrasse. The long daily schedule makes it dependable, though weekend evenings are much louder than weekday afternoons.",
    officialUrl: "https://25hours-hotels.com/zurich/langstrasse/restaurants-bars/cinchona-bar/",
    hours: {
      default:
        "Mon–Thu and Sun 10:00 AM–1:00 AM; Fri–Sat 10:00 AM–2:00 AM.",
    },
    price: "$$$",
    priceSource: "Official 25hours drinks menu and Zurich Tourism venue record",
    venueKind: "food_drink",
    nightlifeType: "cocktail_bar",
    subcategory: "lifestyle_hotel_bar",
    attributeTags: ["cocktails", "highballs", "social", "late_night"],
    editorialUrls: ["https://www.zuerich.com/en/visit/bars-lounges/cinchona-bar"],
  }),
  stop({
    id: "zurich-cocktail-onyx",
    name: "Onyx Bar",
    coordinates: [47.3664228, 8.5360401],
    description:
      "Onyx is Park Hyatt's polished lobby bar, built around a glowing stone counter, deep spirits shelves and classic service. The current Thursday-to-Saturday schedule is unusually narrow, so it should be planned rather than used as a default hotel fallback.",
    officialUrl: "https://www.hyatt.com/park-hyatt/en-US/zurph-park-hyatt-zurich/dining",
    hours: { default: "Thu–Sat 5:00 PM–1:00 AM; closed Sun–Wed." },
    price: "$$$",
    priceSource: "Official Hyatt dining page and Zurich Tourism venue record",
    venueKind: "food_drink",
    nightlifeType: "cocktail_bar",
    subcategory: "luxury_hotel_bar",
    attributeTags: ["cocktails", "luxury", "whisky", "quiet"],
    editorialUrls: ["https://www.zuerich.com/en/visit/bars-lounges/onyx-bar"],
  }),
  stop({
    id: "zurich-cocktail-clouds",
    name: "Clouds Bar",
    coordinates: [47.3860207, 8.5171884],
    description:
      "Clouds uses the Prime Tower's height for city and rail-yard views, pairing accessible cocktails with a full bistro and weekend brunch. The panorama is the main draw; sunset and weekend tables benefit from reservations.",
    officialUrl: "https://www.clouds.ch/",
    bookingUrl: "https://www.clouds.ch/",
    hours: {
      default:
        "Mon–Thu 11:00 AM–11:00 PM; Fri 11:00 AM–12:00 AM; Sat 4:00 PM–12:00 AM; Sun 4:00 PM–11:00 PM. Weekend brunch runs 10:00 AM–3:00 PM.",
    },
    price: "$$$",
    priceSource: "Official bar, bistro, and reservation pages",
    venueKind: "food_drink",
    nightlifeType: "rooftop_bar",
    subcategory: "skyline_bar",
    attributeTags: ["cocktails", "scenic", "reservation_recommended", "brunch"],
    editorialUrls: ["https://www.zuerich.com/en/visit/bars-lounges/clouds-bar-bistro"],
  }),
];

const cultureStops: GuideStop[] = [
  stop({
    id: "zurich-culture-kunsthaus",
    name: "Kunsthaus Zürich",
    coordinates: [47.3702241, 8.5479797],
    description:
      "Kunsthaus connects Swiss modernism—especially Giacometti and Hodler—to major European painting and the Chipperfield extension's larger collection displays. Its scale rewards choosing a few threads rather than treating both buildings as a checklist.",
    officialUrl: "https://www.kunsthaus.ch/en/",
    bookingUrl: "https://www.kunsthaus.ch/en/visit/",
    hours: {
      default:
        "Tue–Wed and Fri–Sun 10:00 AM–6:00 PM; Thu 10:00 AM–8:00 PM; closed Mon.",
    },
    venueKind: "culture",
    subcategory: "art_museum",
    attributeTags: ["art", "modernism", "architecture", "ticketed"],
    editorialUrls: ["https://www.zuerich.com/en/visit/culture/kunsthaus-zurich"],
  }),
  stop({
    id: "zurich-culture-landesmuseum",
    name: "National Museum Zurich",
    coordinates: [47.3792397, 8.5407019],
    description:
      "The National Museum uses a turreted 1898 building and a sharp modern extension to tell Swiss history through objects, domestic interiors, politics and migration. Its position beside the main station makes a focused two-hour visit unusually easy to place.",
    officialUrl: "https://www.landesmuseum.ch/en",
    bookingUrl: "https://www.landesmuseum.ch/en/your-visit",
    hours: {
      default:
        "Tue–Wed and Fri–Sun 10:00 AM–5:00 PM; Thu 10:00 AM–7:00 PM; closed Mon.",
    },
    venueKind: "culture",
    subcategory: "national_history_museum",
    attributeTags: ["history", "architecture", "family_friendly", "ticketed"],
    editorialUrls: ["https://www.zuerich.com/en/visit/attractions/national-museum-zurich"],
  }),
  stop({
    id: "zurich-culture-rietberg",
    name: "Museum Rietberg",
    coordinates: [47.3589183, 8.5297352],
    description:
      "Rietberg places art from Asia, Africa, the Americas and Oceania in villas and a mostly subterranean extension within a landscaped park. It deserves its own half-day because the collection and grounds offer a different frame from the city-center art museums.",
    officialUrl: "https://rietberg.ch/en",
    bookingUrl: "https://rietberg.ch/en/visit",
    hours: {
      default:
        "Tue–Wed and Fri–Sun 10:00 AM–5:00 PM; Thu 10:00 AM–8:00 PM; closed Mon.",
    },
    venueKind: "culture",
    subcategory: "global_art_museum",
    attributeTags: ["art", "global_collections", "park", "architecture"],
    editorialUrls: ["https://www.zuerich.com/en/visit/culture/museum-rietberg-art-from-all-over-the-world"],
  }),
  stop({
    id: "zurich-culture-gestaltung",
    name: "Museum für Gestaltung",
    coordinates: [47.3829824, 8.5357988],
    description:
      "The Ausstellungsstrasse building turns Switzerland's graphic, product and poster traditions into tightly argued temporary exhibitions. Design specialists should also note that the museum operates more than one site; this stop is the landmark 1933 building near the station.",
    officialUrl: "https://museum-gestaltung.ch/en/",
    bookingUrl: "https://museum-gestaltung.ch/en/visit/",
    hours: {
      default:
        "Tue–Wed and Fri–Sun 10:00 AM–5:00 PM; Thu 10:00 AM–8:00 PM; closed Mon.",
    },
    venueKind: "culture",
    subcategory: "design_museum",
    attributeTags: ["design", "graphic_design", "architecture", "temporary_exhibitions"],
    editorialUrls: ["https://www.zuerich.com/de/besuchen/kultur/museum-fuer-gestaltung-ausstellungsstrasse"],
  }),
  stop({
    id: "zurich-culture-fifa",
    name: "FIFA Museum",
    coordinates: [47.3635785, 8.5315195],
    description:
      "FIFA's museum treats football as both global culture and governed spectacle, using trophies, shirts, film and interactive play to build the argument. Fans will spend longer than skeptics, but the institution is candidly polished rather than locally rooted.",
    officialUrl: "https://www.fifamuseum.com/en/",
    bookingUrl: "https://www.fifamuseum.com/en/visit/",
    hours: { default: "Tue–Sun 10:00 AM–6:00 PM; closed Mon." },
    venueKind: "culture",
    subcategory: "sports_museum",
    attributeTags: ["football", "interactive", "family_friendly", "ticketed"],
    editorialUrls: ["https://www.zuerich.com/en/visit/culture/fifa-museum"],
  }),
  stop({
    id: "zurich-culture-corbusier",
    name: "Pavillon Le Corbusier",
    coordinates: [47.3560973, 8.5508641],
    description:
      "Le Corbusier's final completed building is a modular steel-and-glass Gesamtkunstwerk whose color, ramps and compact rooms make the architecture itself the collection. The pavilion is seasonal and closes for winter, so it cannot be treated as a year-round indoor fallback.",
    officialUrl: "https://pavillon-le-corbusier.ch/en/",
    bookingUrl: "https://pavillon-le-corbusier.ch/en/visit/",
    hours: {
      default:
        "Tue–Wed and Fri–Sun 12:00 PM–6:00 PM; Thu 12:00 PM–8:00 PM; closed Mon. Seasonal closure Dec 2026–Apr 2027.",
    },
    venueKind: "culture",
    subcategory: "architecture_museum",
    attributeTags: ["architecture", "design", "seasonal", "lake_access"],
    editorialUrls: ["https://www.zuerich.com/en/visit/attractions/pavillon-le-corbusier"],
  }),
  stop({
    id: "zurich-culture-konstruktiv",
    name: "Museum Haus Konstruktiv",
    coordinates: [47.3891301, 8.5252692],
    description:
      "Haus Konstruktiv concentrates on constructive, concrete and conceptual art, extending Zurich's specific history of geometric abstraction into contemporary exhibitions. Its move to the Löwenbräu complex places it within a useful cluster of galleries and art institutions.",
    officialUrl: "https://www.hauskonstruktiv.ch/en/",
    bookingUrl: "https://www.hauskonstruktiv.ch/en/visit/",
    hours: {
      default:
        "Tue and Thu–Sun 11:00 AM–6:00 PM; Wed 11:00 AM–8:00 PM; closed Mon.",
    },
    venueKind: "culture",
    subcategory: "concrete_art_museum",
    attributeTags: ["contemporary_art", "concrete_art", "temporary_exhibitions", "zurich_west"],
    editorialUrls: ["https://www.zuerich.com/en/visit/culture/museum-haus-konstruktiv"],
  }),
  stop({
    id: "zurich-culture-focusterra",
    name: "focusTerra",
    coordinates: [47.37844, 8.54855],
    description:
      "ETH's earth-science center turns minerals, fossils, tectonics and natural hazards into hands-on exhibits, capped by an earthquake simulator. Free admission and a strong Sunday demonstration program make it especially good for curious families.",
    officialUrl: "https://focusterra.ethz.ch/en/",
    hours: {
      default:
        "Mon–Fri 9:00 AM–5:00 PM; Sun 10:00 AM–4:00 PM; closed Sat. Sunday public tours and demonstrations run 11:00 AM–4:00 PM.",
    },
    venueKind: "culture",
    subcategory: "earth_science_museum",
    attributeTags: ["science", "free", "interactive", "family_friendly"],
    editorialUrls: ["https://www.zuerich.com/en/visit/culture/focusterra-earth-science-discovery-center-of-the-eth-zurich"],
  }),
  stop({
    id: "zurich-culture-natural-history",
    name: "Natural History Museum UZH",
    coordinates: [47.37572, 8.54842],
    description:
      "UZH's free natural-history museum uses Swiss wildlife, fossils and biodiversity displays to make regional ecology tangible, with strong family appeal. Thursday adds an evening window after the normal daytime session.",
    officialUrl: "https://www.nmz.uzh.ch/en.html",
    hours: {
      default:
        "Tue–Wed and Fri–Sun 10:00 AM–5:00 PM; Thu 10:00 AM–5:00 PM and 5:30 PM–8:00 PM; closed Mon.",
    },
    venueKind: "culture",
    subcategory: "natural_history_museum",
    attributeTags: ["natural_history", "free", "family_friendly", "science"],
    editorialUrls: ["https://www.zuerich.com/en/visit/culture/natural-history-museum-of-the-university-of-zurich"],
  }),
  stop({
    id: "zurich-culture-beyer",
    name: "Beyer Clock and Watch Museum",
    coordinates: [47.3709245, 8.5385422],
    description:
      "Beyer's basement museum traces timekeeping from shadow sticks and Renaissance automata to precision marine clocks and wristwatches. The collection is compact and excellent, but weekday-afternoon-only opening requires deliberate scheduling.",
    officialUrl: "https://www.beyer-ch.com/en/museum/",
    hours: { default: "Mon–Fri 2:00 PM–6:00 PM; closed Sat–Sun." },
    venueKind: "culture",
    subcategory: "horology_museum",
    attributeTags: ["watches", "design", "technology", "compact_visit"],
    editorialUrls: ["https://www.zuerich.com/en/visit/culture/beyer-clock-and-watch-museum"],
  }),
];

const activityStops: GuideStop[] = [
  stop({
    id: "zurich-activity-grossmuenster",
    name: "Grossmünster and Karlsturm",
    coordinates: [47.3701214, 8.5439115],
    description:
      "The twin-towered Grossmünster anchors Zurich's Reformation history, while the Karlsturm climb supplies a tight roof-and-river panorama after 187 steps. Church access is easy; the tower is the physical commitment and may close independently for safety.",
    officialUrl: "https://www.grossmuenster.ch/",
    hours: {
      default:
        "Mar–Oct Mon–Sat 10:00 AM–6:00 PM and Sun 12:30 PM–6:00 PM; Nov–Feb closes at 5:00 PM and Sunday entry follows worship. Karlsturm admission follows the church desk and safety policy.",
    },
    venueKind: "landmark",
    subcategory: "church_tower_climb",
    attributeTags: ["architecture", "history", "viewpoint", "stairs"],
    editorialUrls: ["https://www.zuerich.com/en/visit/attractions/grossmunster"],
  }),
  stop({
    id: "zurich-activity-fraumuenster",
    name: "Fraumünster and Chagall Windows",
    coordinates: [47.3697153, 8.5411996],
    description:
      "Fraumünster's Romanesque core, Giacometti window and Chagall's five luminous choir windows reward a slow interior visit rather than a façade photo. Visitor entry pauses for services, making Sunday timing distinct from weekdays.",
    officialUrl: "https://www.fraumuenster.ch/en/",
    hours: {
      default:
        "Mar–Oct Mon–Sat 10:00 AM–6:00 PM and Sun 12:00 PM–6:00 PM; Nov–Feb closes at 5:00 PM and Sunday entry follows worship.",
    },
    venueKind: "landmark",
    subcategory: "church_art_visit",
    attributeTags: ["architecture", "stained_glass", "history", "quiet"],
    editorialUrls: ["https://www.zuerich.com/en/visit/attractions/marc-chagalls-church-windows-at-the-fraumunster"],
  }),
  stop({
    id: "zurich-activity-uetliberg",
    name: "Uetliberg Ridge Walk",
    coordinates: [47.3518692, 8.4874187],
    description:
      "Zurich's local mountain gives a fast transition from city streets to forest, a summit panorama and the Planet Trail toward Felsenegg. In 2026 the S10 construction closure shifts boarding from Zürich HB to Selnau, so the timetable is part of the hike.",
    officialUrl: "https://www.uetliberg.ch/en/",
    hours: {
      default:
        "Public trails are open daily; access follows the official SZU S10 timetable. Apr 29–Oct 18, 2026, S10 trains do not serve Zürich HB and begin at Zürich Selnau.",
    },
    venueKind: "outdoors",
    subcategory: "urban_mountain_hike",
    attributeTags: ["hiking", "viewpoint", "forest", "public_transit"],
    editorialUrls: ["https://www.zuerich.com/en/visit/nature/uetliberg-zurichs-very-own-mountain"],
  }),
  stop({
    id: "zurich-activity-lake-cruise",
    name: "Lake Zurich Round Trip",
    coordinates: [47.36632, 8.54143],
    description:
      "A ZSG boat turns the lakefront into a moving geography lesson, linking villa shores, swimming spots and Alpine sightlines without a tour-bus narrative. Choose the short or long round trip deliberately; service is frequent in summer and reduced outside it.",
    officialUrl: "https://www.zsg.ch/en/",
    bookingUrl: "https://www.zsg.ch/en/timetable-prices/timetable-scheduled-cruises",
    hours: {
      default:
        "Departures follow the dated official ZSG scheduled-cruise timetable, with numerous daily sailings in summer and reduced spring, autumn, and winter service.",
    },
    venueKind: "transport",
    subcategory: "lake_cruise",
    attributeTags: ["boat", "scenic", "family_friendly", "timetable_dependent"],
    editorialUrls: ["https://www.zuerich.com/en/visit/nature/round-trips-on-the-lake-lake-zurich-navigation-company"],
  }),
  stop({
    id: "zurich-activity-lindenhof",
    name: "Lindenhof",
    coordinates: [47.37301, 8.54049],
    description:
      "Lindenhof layers Roman foundations, medieval civic history and a calm tree-shaded overlook above the Limmat. It is best used as a pause between old-town lanes, with chess games and river views supplying more life than a formal attraction would.",
    officialUrl: "https://www.zuerich.com/en/visit/nature/lindenhof",
    hours: { default: "Public viewpoint and park open daily, 24 hours." },
    venueKind: "outdoors",
    subcategory: "historic_viewpoint",
    attributeTags: ["free", "viewpoint", "history", "old_town"],
  }),
  stop({
    id: "zurich-activity-zoo",
    name: "Zoo Zürich",
    coordinates: [47.3869141, 8.5775992],
    description:
      "Zurich Zoo's strongest habitats—the Masoala rainforest and Kaeng Krachan elephant park—use large-scale environments to frame conservation rather than rows of cages. The hillside site is substantial; allow at least half a day and note that Masoala opens later.",
    officialUrl: "https://www.zoo.ch/en",
    bookingUrl: "https://www.zoo.ch/en/plan-your-visit",
    hours: {
      default:
        "Mar–Oct 9:00 AM–6:00 PM; Nov–Feb 9:00 AM–5:00 PM. Masoala Rainforest opens daily at 10:00 AM.",
    },
    venueKind: "outdoors",
    subcategory: "conservation_zoo",
    attributeTags: ["wildlife", "family_friendly", "half_day", "ticketed"],
    editorialUrls: ["https://www.zuerich.com/en/visit/nature/zurich-zoo-masoala-rainforest"],
  }),
  stop({
    id: "zurich-activity-botanical",
    name: "Botanical Garden UZH",
    coordinates: [47.3585048, 8.5605701],
    description:
      "UZH's botanical garden combines free outdoor collections with three sculptural dome greenhouses holding tropical and arid plants. It is a quiet Seefeld reset, but the greenhouses close well before the summer grounds.",
    officialUrl: "https://www.bg.uzh.ch/en.html",
    hours: {
      default:
        "Grounds Mon–Fri 7:00 AM–7:00 PM and Sat–Sun 8:00 AM–6:00 PM; greenhouses daily 9:30 AM–4:45 PM.",
    },
    venueKind: "outdoors",
    subcategory: "botanical_garden",
    attributeTags: ["free", "plants", "greenhouse", "quiet"],
    editorialUrls: ["https://www.zuerich.com/en/visit/nature/botanical-garden-of-the-university-of-zurich"],
  }),
  stop({
    id: "zurich-activity-polybahn",
    name: "Polybahn and Polyterrasse",
    coordinates: [47.3767482, 8.5460479],
    description:
      "The red Polybahn climbs from Central to ETH in under two minutes, preserving a small piece of 19th-century transit in everyday use. Pair the ride with Polyterrasse views; it is a useful connection, not an amusement ride.",
    officialUrl: "https://www.vbz.ch/en/travel-information/polybahn/",
    hours: {
      default:
        "Mon–Fri 6:30 AM–9:00 PM; Sat 7:30 AM–9:00 PM; Sun 9:00 AM–9:00 PM. Service follows the official VBZ operating notice.",
    },
    venueKind: "transport",
    subcategory: "historic_funicular",
    attributeTags: ["public_transit", "viewpoint", "historic", "quick_activity"],
    editorialUrls: ["https://www.zuerich.com/de/besuchen/sehenswuerdigkeiten/polybahn"],
  }),
  stop({
    id: "zurich-activity-viadukt",
    name: "Markthalle im Viadukt",
    coordinates: [47.387744, 8.5263897],
    description:
      "The railway viaduct's arches now hold independent food shops, design stores and a covered market, turning infrastructure into one of Zurich-West's most usable public interiors. Visit by day for shopping, then continue toward Josefwiese or the bars around Hardbrücke.",
    officialUrl: "https://www.im-viadukt.ch/en/",
    hours: { default: "Mon–Sat 9:00 AM–8:00 PM; closed Sun." },
    venueKind: "retail",
    subcategory: "market_hall",
    attributeTags: ["shopping", "food_market", "architecture", "zurich_west"],
    editorialUrls: ["https://www.zuerich.com/en/visit/shopping/market-hall-viaduct-arches"],
  }),
  stop({
    id: "zurich-activity-lindt",
    name: "Lindt Home of Chocolate",
    coordinates: [47.3184665, 8.5509004],
    description:
      "Lindt's Kilchberg visitor center combines an enormous chocolate fountain, production history and a tasting-heavy audio tour. It is brand theater done at scale; timed tickets are essential, and the short train-and-bus trip sits outside central Zurich.",
    officialUrl: "https://www.lindt-home-of-chocolate.com/en/",
    bookingUrl: "https://tickets.lindt-home-of-chocolate.com/",
    hours: {
      default:
        "Museum and shop daily 10:00 AM–7:00 PM; admission uses the exact timed slot on the official ticket calendar.",
    },
    venueKind: "landmark",
    subcategory: "chocolate_museum",
    attributeTags: ["chocolate", "interactive", "family_friendly", "reservation_required"],
    editorialUrls: ["https://www.zuerich.com/de/besuchen/kultur/lindt-home-of-chocolate"],
  }),
];

const editorialSources = {
  dining: [
    source("Zurich Tourism – Restaurants", "https://www.zuerich.com/en/eat-drink/restaurants"),
    source("MICHELIN Guide – Zurich restaurants", "https://guide.michelin.com/en/zurich-region/zurich/restaurants"),
    source("GaultMillau Switzerland – Zurich", "https://www.gaultmillau.ch/zuerich"),
  ],
  cheap: [
    source("Zurich Tourism – Affordable Zurich", "https://www.zuerich.com/en/visit/affordable-zurich"),
    source("Zurich Tourism – Restaurants", "https://www.zuerich.com/en/eat-drink/restaurants"),
    source("Zurich Tourism – Cafés", "https://www.zuerich.com/en/eat-drink/cafes"),
  ],
  hotels: [
    source("Zurich Tourism – Luxury hotels", "https://www.zuerich.com/en/inform-plan/find-accommodation/hotels/luxury-hotels"),
    source("Zurich Tourism – Hotels", "https://www.zuerich.com/en/inform-plan/find-accommodation/hotels"),
    source("MICHELIN Guide – Zurich hotels", "https://guide.michelin.com/en/hotels-stays/zurich"),
  ],
  hostels: [
    source("Zurich Tourism – Budget accommodation", "https://www.zuerich.com/en/visit/accommodation-in-zurich/budget-accommodation"),
    source("Hostelworld – Zurich", "https://www.hostelworld.com/hostels/europe/switzerland/zurich/?ShowAll=1"),
    source("ETH Zurich – Hotels and hostels", "https://www.wohnen.ethz.ch/en/search-accommodation/hotels-hostels.html"),
  ],
  bars: [
    source("Zurich Tourism – Pubs", "https://www.zuerich.com/en/eat-drink/bars-and-pubs/pubs"),
    source("Zurich Tourism – Cult bars", "https://www.zuerich.com/en/eat-drink/bars-and-pubs/cult-bars"),
    source("Zurich Tourism – Nightlife", "https://www.zuerich.com/en/eat-drink/bars-and-pubs"),
  ],
  cocktails: [
    source("Zurich Tourism – Cocktail bars", "https://www.zuerich.com/en/eat-drink/bars-and-pubs/cocktail-bars"),
    source("Zurich Tourism – Mocktail bars", "https://www.zuerich.com/en/eat-drink/bars-and-pubs/mocktail-bars"),
    source("Falstaff – Zurich bars", "https://www.falstaff.com/en/listings/the-best-bars-in-zurich"),
  ],
  culture: [
    source("Zurich Tourism – Art and culture", "https://www.zuerich.com/en/art-culture"),
    source("City of Zurich – Museums", "https://www.stadt-zuerich.ch/en/culture/museums.html"),
    source("Zurich Tourism – Museums", "https://www.zuerich.com/en/visit/culture/museums-in-zurich"),
  ],
  activities: [
    source("Zurich Tourism – Sights and attractions", "https://www.zuerich.com/en/visit/the-must-sees-in-zurich"),
    source("Zurich Tourism – Nature", "https://www.zuerich.com/en/visit/nature"),
    source("ZVV – Timetables", "https://www.zvv.ch/zvv/en/timetable.html"),
  ],
};

function completeSources(editorial: ListSource[], stops: GuideStop[]) {
  const combined = [
    ...editorial,
    ...stops.map((item) => source(`${item.name} source`, item.officialUrl ?? maps(item.name))),
  ];
  return combined.filter(
    (item, index) => combined.findIndex((candidate) => candidate.url === item.url) === index,
  );
}

const guideSources = {
  dining: completeSources(editorialSources.dining, diningStops),
  cheap: completeSources(editorialSources.cheap, cheapEatStops),
  hotels: completeSources(editorialSources.hotels, hotelStops),
  hostels: completeSources(editorialSources.hostels, hostelStops),
  bars: completeSources(editorialSources.bars, casualBarStops),
  cocktails: completeSources(editorialSources.cocktails, cocktailStops),
  culture: completeSources(editorialSources.culture, cultureStops),
  activities: completeSources(editorialSources.activities, activityStops),
};

function guide(
  category: ListCategory,
  id: string,
  slug: string,
  seoSlug: string,
  title: string,
  description: string,
  stops: GuideStop[],
  sources: ListSource[],
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
    url: maps(`${title} Zurich Switzerland`),
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
    sources,
  };
}

export const zurichCitywideGuides: MapList[] = [
  guide(
    "Food",
    "list-zurich-citywide-dining",
    "zurich-citywide-dining",
    "best-restaurants",
    "Guild Houses, Tasting Menus & Zurich Institutions",
    "Zurich's strongest restaurants stretch from rösti and guild-house formality to ambitious plant-based cooking and intricate tasting menus. These ten rooms earn their place through specific food and hospitality, with service days made explicit.",
    diningStops,
    guideSources.dining,
    "Best Restaurants in Zurich for Swiss Classics and Tasting Menus",
    "Ten source-backed Zurich restaurants spanning historic Swiss institutions, vegetarian pioneers, guild houses, fine dining, market cooking and scenic destination meals.",
  ),
  guide(
    "Food",
    "list-zurich-citywide-cheap-eats",
    "zurich-citywide-cheap-eats",
    "best-cheap-eats",
    "Bratwurst, Bakeries & Practical Cheap Eats",
    "Zurich is expensive, but a good low-cost meal still exists at sausage counters, surplus bakeries, vegetarian buffets, park cafés and fast local chains. These ten stops make portion, format and real opening windows visible.",
    cheapEatStops,
    guideSources.cheap,
    "Best Cheap Eats in Zurich for Bratwurst, Bakeries and Quick Meals",
    "Ten affordable Zurich food stops with verified hours, covering bratwurst, bread, pastry, vegetarian buffets, burgers, dumplings, raclette and neighborhood cafés.",
  ),
  guide(
    "Stay",
    "list-zurich-citywide-hotels",
    "zurich-citywide-hotels",
    "best-hotels",
    "Lakefront Grandeur, Old-Town Design & Spa Stays",
    "Zurich's best hotels divide between formal lake-and-Bahnhofstrasse landmarks, medieval old-town conversions, Langstrasse design energy and quiet spa retreats. These ten properties state the location tradeoff alongside the service and architecture.",
    hotelStops,
    guideSources.hotels,
    "Best Hotels in Zurich for Luxury, Design, Rail Access and Spa Stays",
    "Ten Zurich hotels with source-backed check-in details, from lakefront grande dames and medieval design hotels to station convenience, Langstrasse style and a brewery spa.",
  ),
  guide(
    "Stay",
    "list-zurich-citywide-hostels",
    "zurich-citywide-hostels",
    "best-hostels",
    "Hostels, Capsules & Shared Budget Stays",
    "Zurich has fewer true hostels than most large European cities, so this guide keeps hotels out and expands honestly to capsules, women-only guesthouses, pensions and seasonal camping. Each entry explains reception, transit and shared-facility tradeoffs.",
    hostelStops,
    guideSources.hostels,
    "Best Hostels and Budget Stays in Zurich for Dorms, Capsules and Camping",
    "Ten non-hotel Zurich budget stays with verified arrival rules, covering dorm hostels, capsules, women-only lodging, independent guesthouses and lakeside camping.",
  ),
  guide(
    "Nightlife",
    "list-zurich-citywide-bars",
    "zurich-citywide-bars",
    "best-bars",
    "Dive Bars, Beer Rooms & Local Late Nights",
    "Casual Zurich nightlife runs from Niederdorf all-hours bars to Langstrasse dives, independent taprooms, LGBTQ+ rooms and a Dada landmark that still hosts events. These ten places prioritize atmosphere and usable closing times over polish.",
    casualBarStops,
    guideSources.bars,
    "Best Casual Bars in Zurich for Beer, Dive Bars and Late Nights",
    "Ten source-backed Zurich bars spanning late dives, craft beer, neighborhood pubs, LGBTQ+ nightlife, live music and Cabaret Voltaire, with current schedules.",
  ),
  guide(
    "Nightlife",
    "list-zurich-citywide-cocktail-bars",
    "zurich-citywide-cocktail-bars",
    "best-cocktail-bars",
    "Cocktail Craft, Art Rooms & Skyline Drinks",
    "Zurich's cocktail range is unusually broad for its size: spirit libraries, bartender-led late rooms, art-filled institutions, neighborhood aperitif bars and a Prime Tower panorama. These ten distinguish drink quality from view, history and hotel service.",
    cocktailStops,
    guideSources.cocktails,
    "Best Cocktail Bars in Zurich for Classic Drinks, Art and Skyline Views",
    "Ten Zurich cocktail bars with verified hours, from Old Crow and Tales to historic art rooms, jazz, neighborhood aperitifs, luxury lounges and Prime Tower views.",
  ),
  guide(
    "Culture",
    "list-zurich-citywide-culture",
    "zurich-citywide-culture",
    "best-culture",
    "Swiss Art, Global Collections & Designed Objects",
    "Zurich's museums are strongest when read together: Swiss modernism, national history, global art, concrete abstraction, design, horology and university science. These ten institutions reward selective, well-timed visits rather than museum-counting.",
    cultureStops,
    guideSources.culture,
    "Best Museums in Zurich for Art, Design, History and Science",
    "Ten source-backed Zurich museums covering Kunsthaus, Swiss history, global art, design, football, Le Corbusier, concrete art, earth science, wildlife and watches.",
  ),
  guide(
    "Activities",
    "list-zurich-citywide-activities",
    "zurich-citywide-activities",
    "best-things-to-do",
    "Ten Zurich Experiences Worth the Time",
    "The best Zurich activities connect the compact old town to the lake, wooded hills, working transit and industrial reuse. Exact church seasons, boat and rail timetables, greenhouse windows and timed tickets keep these experiences practical.",
    activityStops,
    guideSources.activities,
    "Best Things to Do in Zurich for Lake Views, Old Town, Nature and Design",
    "Ten source-backed Zurich activities with current 2026 logistics, including church art, Uetliberg, lake cruises, parks, the zoo, botanical domes, Polybahn, Viadukt and Lindt.",
  ),
];

zurichCitywideGuides.push(buildNatureGuide({
  city: "Zurich",
  country: "Switzerland",
  continent: "Europe",
  id: "list-zurich-citywide-nature",
  slug: "zurich-lake-forest-and-hill-nature",
  seoSlug: "best-parks-and-nature",
  seoTitle: "Best Parks and Nature in Zurich for Lake Walks, Forests and Hill Views",
  seoDescription: "Ten source-backed Zurich nature stops spanning lake promenades, Uetliberg, botanical gardens, urban woodland, river islands, and the Sihlwald forest.",
  title: "Lake Shores, Forest Hills & Botanical Gardens",
  description: "Zurich's compact center opens quickly onto lake shallows, wooded hills, river islands, scientific gardens, and a wild forest reserve. These ten landscapes make nature part of everyday city movement rather than a separate excursion.",
  createdAt: "2026-07-29T00:00:00.000Z",
  checkedAt: "2026-08-04",
  sources: [
    { name: "City of Zurich parks and open spaces", url: "https://www.stadt-zuerich.ch/ted/de/index/gsz/natur-erleben.html" },
    { name: "Zurich Tourism nature", url: "https://www.zuerich.com/en/visit/nature" },
    { name: "Wildnispark Zurich", url: "https://www.wildnispark.ch/en" },
  ],
  stops: [
    {
      id: "zurich-nature-lake-promenade",
      name: "Lake Zurich Promenade",
      coordinates: [47.363, 8.548],
      description: "Continuous waterfront paths, swimming lawns, mature trees, and lake-and-Alps views connect central quays with parkland on both shores.",
      hours: { default: "Open 24 hours daily." },
      officialUrl: "https://www.zuerich.com/en/visit/the-lake-promenade",
      photo: verifiedVenuePhotos["Lake Zurich Promenade"],
      imageSourceUrl: verifiedVenuePhotos["Lake Zurich Promenade"],
      attributeTags: ["lakefront", "walking", "swimming", "Alps views"],
    },
    {
      id: "zurich-nature-uetliberg",
      name: "Uetliberg",
      coordinates: [47.3519, 8.4874],
      description: "Zurich's local mountain combines forest trails, a panoramic ridge, and direct rail access, with broad views over the city, lake, and Alps.",
      hours: { default: "Open 24 hours daily; trains follow the official SZU timetable." },
      officialUrl: "https://www.zuerich.com/en/visit/attractions/uetliberg",
      photo: verifiedVenuePhotos.Uetliberg,
      imageSourceUrl: verifiedVenuePhotos.Uetliberg,
      attributeTags: ["mountain", "hiking", "viewpoint", "rail access"],
    },
    {
      id: "zurich-nature-botanical-garden-uzh",
      name: "Botanical Garden of the University of Zurich",
      coordinates: [47.3585, 8.5606],
      description: "Three domed glasshouses, systematic beds, ponds, and global living collections make this university garden especially valuable in poor weather and changing seasons.",
      hours: {
        default: "Outdoor garden: November–March Monday–Friday 8:00 AM–6:00 PM and Saturday–Sunday/holidays 8:00 AM–5:00 PM; April–October Monday–Friday 7:00 AM–7:00 PM and Saturday–Sunday/holidays 8:00 AM–6:00 PM. Tropical houses: daily 9:30 AM–4:45 PM.",
      },
      officialUrl: "https://www.bg.uzh.ch/en.html",
      photo: verifiedVenuePhotos["Botanical Garden of the University of Zurich"],
      imageSourceUrl: verifiedVenuePhotos["Botanical Garden of the University of Zurich"],
      attributeTags: ["botanical garden", "glasshouses", "research", "year-round"],
    },
    {
      id: "zurich-nature-old-botanical-garden",
      name: "Old Botanical Garden",
      coordinates: [47.37, 8.533],
      description: "A medieval herb garden, old trees, and a palm house survive on a quiet bastion above the Sihl, creating an unexpectedly secluded central refuge.",
      hours: { default: "November–March daily 8:00 AM–6:00 PM; April–October daily 7:00 AM–7:00 PM." },
      officialUrl: "https://www.bg.uzh.ch/en/visit/old-botanical-garden.html",
      attributeTags: ["historic garden", "herb garden", "old trees", "central"],
    },
    {
      id: "zurich-nature-chinese-garden",
      name: "Chinese Garden",
      coordinates: [47.354, 8.551],
      description: "Pavilions, stone, water, and symbolic planting form a compact scholar's garden near the lakeshore, designed as a friendship gift from Kunming.",
      hours: { default: "November–April daily 11:00 AM–5:00 PM; May–October daily 11:00 AM–7:00 PM." },
      officialUrl: "https://www.stadt-zuerich.ch/ted/de/index/gsz/angebote_u_beratung/park-_und_gruenanlagen/chinagarten.html",
      attributeTags: ["Chinese garden", "pond", "architecture", "seasonal"],
    },
    {
      id: "zurich-nature-zuerichhorn",
      name: "Zürichhorn",
      coordinates: [47.3548, 8.5525],
      description: "Lakefront lawns, specimen trees, sculpture, and swimming access create a broad park sequence where the Hornbach stream reaches Lake Zurich.",
      hours: { default: "Open 24 hours daily." },
      officialUrl: "https://www.zuerich.com/en/visit/attractions/zurichhorn",
      photo: verifiedVenuePhotos["Zürichhorn"],
      imageSourceUrl: verifiedVenuePhotos["Zürichhorn"],
      attributeTags: ["lakefront park", "swimming", "sculpture", "picnic"],
    },
    {
      id: "zurich-nature-sihlwald",
      name: "Sihlwald",
      coordinates: [47.267, 8.55],
      description: "Protected beech forest is being allowed to age with minimal intervention, creating deadwood-rich habitat and a rare wild woodland experience close to Zurich.",
      hours: { default: "Open 24 hours daily; the forest and forest adventure trail are freely accessible at all times." },
      officialUrl: "https://www.wildnispark.ch/en/the-park/sihlwald",
      photo: verifiedVenuePhotos.Sihlwald,
      imageSourceUrl: verifiedVenuePhotos.Sihlwald,
      attributeTags: ["forest reserve", "hiking", "biodiversity", "rewilding"],
    },
    {
      id: "zurich-nature-kaeferberg",
      name: "Käferberg and Hönggerberg Forest",
      coordinates: [47.403, 8.52],
      description: "Wooded ridges, meadow clearings, family paths, and city viewpoints form a substantial everyday recreation landscape above northern Zurich.",
      hours: { default: "Open 24 hours daily." },
      officialUrl: "https://www.stadt-zuerich.ch/ted/de/index/gsz/natur-erleben/stadtwald.html",
      photo: verifiedVenuePhotos["Käferberg and Hönggerberg Forest"],
      imageSourceUrl: verifiedVenuePhotos["Käferberg and Hönggerberg Forest"],
      attributeTags: ["urban forest", "walking", "viewpoint", "family"],
    },
    {
      id: "zurich-nature-werdinsel",
      name: "Werdinsel",
      coordinates: [47.4, 8.48],
      description: "River channels, gravel banks, woodland, and swimming places make this Limmat island a popular summer landscape with quieter habitat at its edges.",
      hours: { default: "Open 24 hours daily." },
      officialUrl: "https://www.stadt-zuerich.ch/ted/de/index/gsz/angebote_u_beratung/park-_und_gruenanlagen/werdinsel.html",
      photo: verifiedVenuePhotos.Werdinsel,
      imageSourceUrl: verifiedVenuePhotos.Werdinsel,
      attributeTags: ["river island", "swimming", "woodland", "summer"],
    },
    {
      id: "zurich-nature-langenberg",
      name: "Langenberg Wildlife Park",
      coordinates: [47.29, 8.53],
      description: "Large forest enclosures hold native and formerly native European animals, linking species interpretation with the broader Sihlwald protected landscape.",
      hours: { default: "Langenberg East animal enclosures are open 24 hours daily; Langenberg West is open daily 9:00 AM–4:00 PM." },
      officialUrl: "https://www.wildnispark.ch/en/the-park/langenberg",
      photo: verifiedVenuePhotos["Langenberg Wildlife Park"],
      imageSourceUrl: verifiedVenuePhotos["Langenberg Wildlife Park"],
      attributeTags: ["wildlife park", "native animals", "forest", "family"],
    },
  ],
}));
