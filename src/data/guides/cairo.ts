import type { GuideStop, ListCategory, ListSource, MapList } from "@/types";

const createdAt = "2026-08-11T00:00:00.000Z";
const checkedAt = "2026-08-11";

const cairoLocation = {
  city: "Cairo",
  country: "Egypt",
  continent: "Africa",
  scope: "city" as const,
};

const colors: Record<ListCategory, string> = {
  Food: "b45309",
  Nightlife: "7c3aed",
  Nature: "15803d",
  Culture: "9a3412",
  Stay: "0369a1",
  Activities: "be123c",
  Routes: "475569",
  Essentials: "475569",
};

function avatar(category: ListCategory) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
      <rect width="160" height="160" rx="80" fill="#${colors[category]}" />
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

const editorial = {
  eater: "https://www.eater.com/maps/best-restaurants-cairo-egypt",
  cnRestaurants:
    "https://www.cntravellerme.com/story/best-restaurants-in-cairo",
  nightlife: "https://nawart-eg.com/blog/best-bars-in-cairo",
  hostelworld: "https://www.hostelworld.com/hostels/africa/egypt/cairo/",
  museums:
    "https://www.cairo.gov.eg/en/tourism/tourism-destinations/cultural/museums/",
  historicalCairo: "https://egymonuments.gov.eg/collections/historical-cairo/",
  monumentTickets:
    "https://mota.gov.eg/media/5a2ja2iu/ticket-english-5-11-2024-1.pdf",
};

const images = {
  khufus:
    "https://media.cntravellerme.com/photos/67ea8baf1e62103246688ede/master/w_1600,c_limit/Khufu_s_Restaurant_41.jpg",
  almeria:
    "https://media.cntravellerme.com/photos/69ce029fc0ab7c9fc3a86cbf/master/w_1600,c_limit/WhatsApp%20Image%202026-04-01%20at%2022.25.35.jpeg",
  mayrig:
    "https://media.cntravellerme.com/photos/69cce18dbaeb36dd7ab68fac/master/w_1600,c_limit/Screenshot%202026-04-01%20at%201.12.33%E2%80%AFPM.png",
  tenaya:
    "https://media.cntravellerme.com/photos/69ccdee5da7abcd64f4667af/master/w_1600,c_limit/IMG_3212.JPG",
  barranco:
    "https://media.cntravellerme.com/photos/69ce02a707b917062e74eaa0/master/w_1600,c_limit/WhatsApp%20Image%202026-04-01%20at%2016.55.52.jpeg",
  reif: "https://media.cntravellerme.com/photos/67ea887d88a8f23b3bc4777d/master/w_1600,c_limit/Reif-dish.jpg",
  norma:
    "https://media.cntravellerme.com/photos/66968e9ff6d6cb91a1aecac3/master/w_1600,c_limit/Norma.jpg",
  crimson:
    "https://media.cntravellerme.com/photos/69cceb06bb21a22f531b209c/master/w_1600,c_limit/IMG_9708.jpg",
  trattoria:
    "https://media.cntravellerme.com/photos/66968e9ccc312b54edde7fbd/master/w_1600,c_limit/La%20Trattoria.jpg",
  kazoku:
    "https://media.cntravellerme.com/photos/67ea81de88a8f23b3bc4777b/master/w_1600,c_limit/Kazoku-interior.JPG",
  sheikhMohamed:
    "https://welp-prod.s3.amazonaws.com/media/businesss/12-03-2024/1710250321_XAa5Hqm.jpeg",
  hawawshi:
    "https://welp-prod.s3.amazonaws.com/media/businesss/14-03-2024/1710424289.jpeg",
  abouTarek: "https://live.staticflickr.com/4705/28245099499_08f079ef16_b.jpg",
  somaya:
    "https://media.cntravellerme.com/photos/64afcb277e05fa81b21f31af/master/w_1600,c_limit/FASHAHET%20SOMAYA%20Vermicelli%20JULY%2023%20PR.jpg",
  zooba:
    "https://static.wixstatic.com/media/5eff48_c7dcbd8640bc49abaeacf9005c9495fb~mv2.jpg/v1/fill/w_980,h_980,al_c,q_85/5eff48_c7dcbd8640bc49abaeacf9005c9495fb~mv2.jpg",
  kosharyTahrir:
    "https://live.staticflickr.com/1894/30850840538_864938eecf_b.jpg",
  sobhy:
    "https://img.restaurantguru.com/reviews/small/w550/h367/882511.jpg",
  aboHashem:
    "https://img.restaurantguru.com/w550/h367/r131-Abo-Hashem-food-2021-09.jpg",
  farahat:
    "https://img.restaurantguru.com/w550/h367/rd5b-Farahat-meals-2021-09-1.jpg",
  aboHaider:
    "https://img.restaurantguru.com/w550/h367/ra66-Abou-Haidar-Shawerma-meals-2022-09.jpg",
  menaHouse:
    "https://en.amwalalghad.com/wp-content/uploads/2018/08/Marriott-Mena-House.jpg",
  fourSeasonsNile:
    "https://www.fourseasons.com/alt/img-opt/~80.1530.0,0000-211,0685-3000,0000-1687,5000/publish/content/dam/fourseasons/images/web/CAI/CAI_962_original.jpg",
  stRegis: "https://marriott.africa-newsroom.com/files/large/e95d609e3d3c0c3",
  nileRitz:
    "https://cache.marriott.com/content/dam/marriott-renditions/dm-static-renditions/rz/emea/hws/c/cairz/en_us/photo/unlimited/assets/rz-cairz-cairz-exterior-day-29094-feature-hor.jpg?downsize=1920px:*&interpolation=progressive-bilinear&output-quality=70",
  sofitelDowntown:
    "https://m.ahstatic.com/is/image/accorhotels/HCM_P_3591185:8by10?dpr=on,1.5&fmt=jpg&hei=1178&icc=sRGB&iccEmbed=true&op_usm=1.75,0.3,2,0&qlt=80&resMode=sharp2&wid=943",
  kempinski:
    "https://storage.kempinski.com/cdn-cgi/image/w=1920,f=auto,fit=scale-down/ki-cms-prod/images/1/7/1/5/65171-1-eng-GB/abb1d7474666-73654605_4K.jpg",
  cairoMarriott:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Cairo_Marriott_Hotel.jpg/1920px-Cairo_Marriott_Hotel.jpg",
  steigenberger:
    "https://assets.hrewards.com/assets/jpg.xxlarge_hyscai71_shr_el_tahrir_cairo_exterior_ram_8132fcrop1_16a8d9288c.jpg?optimize",
  fairmont:
    "https://m.ahstatic.com/is/image/accorhotels/aja_p_5834-38:8by10?dpr=on,1.5&fmt=jpg&hei=1178&icc=sRGB&iccEmbed=true&op_usm=1.75,0.3,2,0&qlt=80&resMode=sharp2&wid=943",
  fourSeasonsFirst:
    "https://www.fourseasons.com/alt/img-opt/~80.1530.0,0000-20,7500-3000,0000-1687,5000/publish/content/dam/fourseasons/images/web/CAF/CAF_526_original.jpg",
  dahab:
    "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/6/6292/y9w1n2vqwmso9kqcex5j.jpg",
  villaLayla:
    "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/3/330811/exopxiec7jtvocwcwmku.jpg",
  australian:
    "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/2/20070/gpszbvyyyyvbnuhm4uwk.jpg",
  meramees:
    "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/2/2332/qvrtd4rsun5aqd2uvldw.jpg",
  madina:
    "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/3/307046/jat6ifpglivmofwnyf3f.jpg",
  holySheet:
    "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/2/294199/ymexgrwlwdrmwz8n8drr.jpg",
  cairoHouse:
    "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/3/310001/bczn6yuv61wsegjjoaxc.jpg",
  cheers:
    "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/2/295113/vyshfqkr7g23fbfvwyqe.jpg",
  zamalekX:
    "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/3/317001/lmlkpdllbwjdtxpoquuh.jpg",
  heritage:
    "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/2/297621/sljrvfflusb6cl6n91id.jpg",
  pub28: "https://nawart-eg.com/venues/pub28/1.jpg",
  cellar: "https://nawart-eg.com/venues/cairo-cellar/1.jpg",
  tapEast: "https://img02.restaurantguru.com/ca54-design-The-Tap-East-1.jpg",
  tapWest:
    "https://static.wixstatic.com/media/5eff48_00a520696fc24429957b99f7253e1c63~mv2.jpg/v1/fill/w_980,h_653,al_c,q_85/5eff48_00a520696fc24429957b99f7253e1c63~mv2.jpg",
  cairoJazz: "https://nawart-eg.com/venues/cairo-jazz-club/1.jpg",
  cjc610:
    "https://static.where-e.com/Egypt/Giza_Governorate/First_Al_Sheikh_Zayed/Cairo-Jazz-Club-610_2fd021ff8b4be892067fe400fc3a34e4.jpg",
  underground: "https://cairogossip.com/app/uploads/2023/09/AMP-89.jpg",
  gigi: "https://nawart-eg.com/venues/gigi-bar/1.jpg",
  brasserie:
    "https://assets.cairo360.com/app/uploads/2026/05/05/SnapInsta.to_475441413_17931250653003520_6512071699198964354_n-1024x675.jpg",
  roomGarden:
    "https://static1.squarespace.com/static/553a4b47e4b04b9963846b3f/t/592b1c1437c58112b30fe6c6/1495997461852/for+website+copy.jpg?format=1500w",
  tipsyCamel: "https://nawart-eg.com/venues/tipsy-camel/1.jpg",
  escaCueva: "https://nawart-eg.com/venues/esca-cueva/1.jpg",
  mexicali: "https://nawart-eg.com/venues/mexicali/1.jpg",
  aqua: "https://dq5r178u4t83b.cloudfront.net/wp-content/uploads/sites/23/2025/04/29081501/Photo-13-1170x780.jpg",
  estro:
    "https://egyptianstreets.com/wp-content/uploads/2020/03/72230957_134250881243518_240886333172613120_o.jpg",
  sangria:
    "https://img3.restaurantguru.ru/r8cf-Sangria-Restaurant-design-2025-06-4.jpg",
  escobar:
    "https://img02.restaurantguru.com/c717-Escobar-Restaurant-Egypt-interior.jpg",
  barOro:
    "https://cache.marriott.com/content/dam/marriott-renditions/CAIRZ/cairz-bar-0025-sq.jpg?output-quality=70&interpolation=progressive-bilinear&downsize=960px:*",
  stRegisBar:
    "https://cache.marriott.com/content/dam/marriott-renditions/CAIXR/caixr-water-garden-9992-hor-pano.jpg",
  gem: commons("Grand_Egyptian_Museum_2025_(22928).jpg"),
  egyptianMuseum:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Egyptian_views%3B_Cairo_%28Masr%29._Museum_of_Cairo%2C_exterior_LOC_matpc.01484.jpg/1920px-Egyptian_views%3B_Cairo_%28Masr%29._Museum_of_Cairo%2C_exterior_LOC_matpc.01484.jpg",
  nmec: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/NMEC-MainEntrance.jpg/1920px-NMEC-MainEntrance.jpg",
  coptic:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Coptic_Museum_in_Cairo.jpg/1920px-Coptic_Museum_in_Cairo.jpg",
  islamicArt:
    "https://upload.wikimedia.org/wikipedia/commons/8/8d/Museum_of_Islamic_Art%2C_Cairo.jpg",
  gayerAnderson:
    "https://upload.wikimedia.org/wikipedia/commons/3/35/Gayer-Anderson_Museum%2C_Cairo_02.jpg",
  manial:
    "https://upload.wikimedia.org/wikipedia/commons/d/dd/Garden_of_Manial_Palace_and_Museum.jpg",
  abdeen:
    "https://upload.wikimedia.org/wikipedia/commons/1/17/Abdeen_Palace.jpg",
  citadel:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Flickr_-_HuTect_ShOts_-_Citadel_of_Salah_El.Din_and_Masjid_Muhammad_Ali_%D9%82%D9%84%D8%B9%D8%A9_%D8%B5%D9%84%D8%A7%D8%AD_%D8%A7%D9%84%D8%AF%D9%8A%D9%86_%D8%A7%D9%84%D8%A3%D9%8A%D9%88%D8%A8%D9%8A_%D9%88%D9%85%D8%B3%D8%AC%D8%AF_%D9%85%D8%AD%D9%85%D8%AF_%D8%B9%D9%84%D9%8A_-_Cairo_-_Egypt_-_17_04_2010_%284%29.jpg/1920px-thumbnail.jpg",
  modernArt:
    "https://upload.wikimedia.org/wikipedia/commons/2/2a/Cairo_ModernArts_byDanielCsorfoly.JPG",
  pyramids:
    "https://egymonuments.gov.eg//media/1215/pyramidsss.jpg?crop=0,0,0,0.21230307576894228&cropmode=percentage&width=1200&height=630&rnd=134309227760000000",
  khan: commons("Khan_el-Khalili,_Cairo_Egypt_-_panoramio_(6).jpg"),
  muizz:
    "https://egypttoursgroup.com/wp-content/uploads/2024/06/Untitled-design-7.png",
  azharPark:
    "https://assets.cairo360.com/app/uploads/2026/03/14/Azhar-park.jpg",
  ibnTulun: commons(
    "Entrance_to_the_Mosque_of_Ibn_Tulun,_Cairo,_876-79_(11).jpg",
  ),
};

type StopOptions = Partial<GuideStop> & {
  sourcePhoto: string;
  imagePage?: string;
  mapQuery?: string;
  editorialUrls?: string[];
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
    imagePage,
    mapQuery,
    editorialUrls = [],
    sourceEvidence,
    imageSourceUrl,
    officialUrl,
    bookingUrl,
    sourceUrls: extraSourceUrls = [],
    ...rest
  } = options;
  const mapUrl =
    sourceEvidence?.mapUrl ?? maps(mapQuery ?? `${name} Cairo Egypt`);
  const officialEvidence =
    sourceEvidence?.officialUrl ?? officialUrl ?? bookingUrl;
  const imageUrl = imageSourceUrl ?? sourcePhoto;
  const imageEvidence = imagePage ?? sourceEvidence?.imageSourceUrl ?? imageUrl;
  const sourceUrls = [
    officialEvidence,
    mapUrl,
    imageEvidence,
    ...editorialUrls,
    ...extraSourceUrls,
  ].filter(Boolean) as string[];

  return {
    id,
    name,
    coordinates,
    description,
    photo: sourcePhoto,
    imageSourceUrl: imageUrl,
    sourceUrls: [...new Set(sourceUrls)],
    sourceEvidence: {
      officialUrl: officialEvidence,
      mapUrl,
      currentStatusUrl: mapUrl,
      imageSourceUrl: imageEvidence,
      editorialUrls,
      checkedAt,
      notes:
        "Official, booking, editorial, and map evidence checked on 2026-08-11; no permanent-closure warning appeared in the active source set.",
      ...sourceEvidence,
    },
    ...(officialUrl ? { officialUrl } : {}),
    ...(bookingUrl ? { bookingUrl } : {}),
    ...rest,
  };
}

const sources = {
  dining: [
    source(
      "Condé Nast Traveller Middle East - best Cairo restaurants",
      editorial.cnRestaurants,
    ),
    source("Eater - essential Cairo restaurants", editorial.eater),
    source("Khufu's official", "https://khufus.com/"),
    source("Almería official", "https://www.almeria.cafe/"),
    source(
      "Mayrig at Crowne Plaza West Cairo Arkan",
      "https://www.ihg.com/crowneplaza/hotels/gb/en/cairo/caisz/hoteldetail/dining",
    ),
    source(
      "Tenaya official Instagram",
      "https://www.instagram.com/tenayaegypt/",
    ),
    source("Barranco official", "https://barrancocairo.com/"),
    source("Baky Hospitality", "https://www.bakyhospitality.com/"),
    source("Crimson official", "https://www.crimsoncairo.com/"),
    source(
      "La Trattoria official Instagram",
      "https://www.instagram.com/latrattoriacairo/",
    ),
  ],
  cheapEats: [
    source("Eater - essential Cairo restaurants", editorial.eater),
    source(
      "Condé Nast Traveller Middle East - best Cairo restaurants",
      editorial.cnRestaurants,
    ),
    source(
      "Koshary Abou Tarek official",
      "https://www.instagram.com/kosharyaboutarek/",
    ),
    source(
      "Fasahet Somaya official Instagram",
      "https://www.instagram.com/fasahetsomaya/",
    ),
    source("Zooba official", "https://zoobaeats.com/"),
    source("Koshary El Tahrir official", "https://kosharyeltahrir.com/"),
    source(
      "Sobhy Kaber official",
      "https://www.instagram.com/sobhykaber.restaurant/",
    ),
    source(
      "Abo Hashem source post",
      "https://www.instagram.com/p/C2kTffBNx3k/",
    ),
    source("Farahat official Instagram", "https://www.instagram.com/farahat.restaurant/"),
    source(
      "Abo Haider source post",
      "https://www.instagram.com/p/BtGgZWkBCIm/",
    ),
  ],
  hotels: [
    source(
      "Marriott Mena House official",
      "https://www.marriott.com/en-us/hotels/caimn-marriott-mena-house-cairo/overview/",
    ),
    source(
      "Four Seasons Nile Plaza official",
      "https://www.fourseasons.com/caironp/",
    ),
    source(
      "The St. Regis Cairo official",
      "https://www.marriott.com/en-us/hotels/caixr-the-st-regis-cairo/overview/",
    ),
    source(
      "The Nile Ritz-Carlton official",
      "https://www.ritzcarlton.com/en/hotels/cairz-the-nile-ritz-carlton-cairo/overview/",
    ),
    source(
      "Sofitel Cairo Downtown Nile official",
      "https://sofitel.accor.com/en/hotels/C3J2.html",
    ),
    source(
      "Kempinski Nile Hotel official",
      "https://www.kempinski.com/en/nile-hotel",
    ),
    source(
      "Cairo Marriott official",
      "https://www.marriott.com/en-us/hotels/caieg-cairo-marriott-hotel/overview/",
    ),
    source(
      "Steigenberger El Tahrir official",
      "https://hrewards.com/en/steigenberger-hotel-el-tahrir-cairo",
    ),
    source(
      "Fairmont Nile City official",
      "https://www.fairmont.com/en/hotels/cairo/fairmont-nile-city.html",
    ),
    source(
      "Four Seasons First Residence official",
      "https://www.fourseasons.com/cairofr/",
    ),
  ],
  hostels: [
    source("Hostelworld - Cairo hostels", editorial.hostelworld),
    source(
      "Hostelworld - Dahab Hostel",
      "https://www.hostelworld.com/hostels/p/6292/dahab-hostel/",
    ),
    source(
      "Hostelworld - Villa Layla",
      "https://www.hostelworld.com/hostels/p/330811/villa-layla/",
    ),
    source(
      "Hostelworld - The Australian Hostel",
      "https://www.hostelworld.com/hostels/p/20070/the-australian-hostel/",
    ),
    source(
      "Hostelworld - Meramees Hostel",
      "https://www.hostelworld.com/hostels/p/2332/meramees-hostel/",
    ),
    source(
      "Hostelworld - Madina Hostel",
      "https://www.hostelworld.com/hostels/p/307046/madina-hostel/",
    ),
    source(
      "Hostelworld - Holy Sheet Hostel",
      "https://www.hostelworld.com/hostels/p/294199/holy-sheet-hostel/",
    ),
    source(
      "Hostelworld - Cairo House",
      "https://www.hostelworld.com/hostels/p/310001/cairo-house/",
    ),
    source(
      "Hostelworld - Cheers Hostel Cairo",
      "https://www.hostelworld.com/hostels/p/295113/cheers-hostel-cairo/",
    ),
    source(
      "Hostelworld - Zamalek X Hostel",
      "https://www.hostelworld.com/hostels/p/317001/zamalek-x-hostel/",
    ),
    source(
      "Hostelworld - Heritage Hostel Cairo",
      "https://www.hostelworld.com/hostels/p/297621/heritage-hostel-cairo/",
    ),
  ],
  casualBars: [
    source("Nawart - best bars in Cairo", editorial.nightlife),
    source("Nawart - Pub 28", "https://nawart-eg.com/r/pub28"),
    source("Nawart - The Cairo Cellar", "https://nawart-eg.com/r/cairo-cellar"),
    source("Nawart - The Tap East", "https://nawart-eg.com/r/tap-east"),
    source("Nawart - The Tap West", "https://nawart-eg.com/r/tap-west"),
    source(
      "Nawart - Cairo Jazz Club",
      "https://nawart-eg.com/r/cairo-jazz-club",
    ),
    source("Nawart - Cairo Jazz Club 610", "https://nawart-eg.com/r/cjc610"),
    source(
      "Nawart - Underground by After 8",
      "https://nawart-eg.com/r/underground-after8",
    ),
    source("Nawart - GIGI Burger Bar", "https://nawart-eg.com/r/gigi-bar"),
    source(
      "Nawart - The Brasserie Lake View",
      "https://nawart-eg.com/r/brasserie-lakeview",
    ),
    source("Room Art Space official", "https://www.roomart.space/"),
  ],
  cocktails: [
    source("Nawart - best bars in Cairo", editorial.nightlife),
    source("Nawart - Crimson", "https://nawart-eg.com/r/crimson"),
    source("Nawart - Tipsy Camel", "https://nawart-eg.com/r/tipsy-camel"),
    source("Nawart - ESCĀ Cueva", "https://nawart-eg.com/r/esca-cueva"),
    source("Nawart - Mexi Cali", "https://nawart-eg.com/r/mexicali"),
    source(
      "Sofitel - Aqua Rooftop Lounge",
      "https://www.sofitel-cairo-nile-elgezirah.com/restaurants-bars/aqua-rooftop-lounge/",
    ),
    source(
      "Estro current rooftop guide",
      "https://www.therooftopguide.com/rooftop-bars-in-cairo/estro.html",
    ),
    source("Nawart - Sangria", "https://nawart-eg.com/r/sangria"),
    source(
      "The Nile Ritz-Carlton dining",
      "https://www.ritzcarlton.com/en/hotels/cairz-the-nile-ritz-carlton-cairo/dining/",
    ),
    source(
      "The St. Regis Bar official",
      "https://www.marriott.com/de/dining/restaurant-bar/caixr-the-st-regis-cairo/6400933-the-st-regis-bar-the-water-garden.mi",
    ),
  ],
  culture: [
    source("Cairo Governorate museum portal", editorial.museums),
    source("Grand Egyptian Museum official", "https://gem.eg/en/"),
    source(
      "Egyptian Museum official",
      "https://egymonuments.gov.eg/en/museums/egyptian-museum/",
    ),
    source("NMEC official", "https://nmec.gov.eg/"),
    source(
      "Coptic Museum official",
      "https://egymonuments.gov.eg/en/museums/coptic-museum/",
    ),
    source(
      "Museum of Islamic Art official",
      "https://egymonuments.gov.eg/en/museums/museum-of-islamic-art/",
    ),
    source(
      "Gayer-Anderson Museum official",
      "https://egymonuments.gov.eg/en/museums/gayer-anderson-museum/",
    ),
    source(
      "Manial Palace official",
      "https://egymonuments.gov.eg/en/subportals-group/manial-palace-museum/manial-palace-1-visit/",
    ),
    source(
      "Abdeen Palace Museums official portal",
      "https://www.presidency.eg/en/%D8%A7%D9%84%D9%85%D8%AA%D8%A7%D8%AD%D9%81/%D9%85%D8%AA%D8%A7%D8%AD%D9%81-%D9%82%D8%B5%D8%B1-%D8%B9%D8%A7%D8%A8%D8%AF%D9%8A%D9%86/",
    ),
    source("Historical Cairo official collection", editorial.historicalCairo),
  ],
  activities: [
    source(
      "Official Egyptian monument hours and tickets",
      editorial.monumentTickets,
    ),
    source(
      "Giza Plateau official",
      "https://egymonuments.gov.eg/en/archaeological-sites/giza-plateau/",
    ),
    source("Grand Egyptian Museum official tickets", "https://tickets.gem.eg/"),
    source(
      "Egyptian Museum official",
      "https://egymonuments.gov.eg/en/museums/egyptian-museum/",
    ),
    source("Historical Cairo official collection", editorial.historicalCairo),
    source(
      "Salah El-Din Citadel official",
      "https://egymonuments.gov.eg/en/archaeological-sites/salah-al-din-al-ayyubi-citadel/",
    ),
    source("NMEC official", "https://nmec.gov.eg/"),
    source(
      "Coptic Museum official",
      "https://egymonuments.gov.eg/en/museums/coptic-museum/",
    ),
    source(
      "Al-Azhar Park current 2026 hours",
      "https://www.cairo360.com/ar/article/%D8%A7%D9%84%D8%AD%D9%8A%D8%A7%D8%A9-%D9%81%D9%8A-%D9%83%D8%A7%D9%8A%D8%B1%D9%88/eid-fitr-2026-best-places-cairo/",
    ),
    source(
      "Mosque of Ibn Tulun official",
      "https://egymonuments.gov.eg/en/monuments/the-mosque-of-ahmad-ibn-tulun/",
    ),
  ],
};

const diningStops = [
  stop(
    "cairo-dining-khufus",
    "Khufu's",
    [29.978406, 31.124271],
    "Khufu's turns the Giza plateau into part of the meal without letting the pyramid view excuse the kitchen. Contemporary Egyptian tasting menus, polished service, and strict reservation timing make this a deliberate half-day pairing with the monuments.",
    {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["egyptian", "fine_dining", "tasting_menu"],
      price: "$$$$",
      priceSource: "Official restaurant and reservation pages",
      attributeTags: [
        "fine_dining",
        "tasting_menu",
        "reservation_recommended",
        "scenic_food",
      ],
      hours: {
        default:
          "Daily breakfast, lunch, and dinner seatings are published by date on the official reservation page.",
      },
      officialUrl: "https://khufus.com/",
      bookingUrl: "https://khufus.com/reservations/",
      sourcePhoto: images.khufus,
      imagePage: editorial.cnRestaurants,
      editorialUrls: [editorial.cnRestaurants, editorial.eater],
    },
  ),
  stop(
    "cairo-dining-almeria",
    "Almería",
    [30.0488118, 31.2392468],
    "Almería gives Downtown Cairo an all-day Spanish-Mediterranean room with breakfast, careful coffee, seafood, and cocktails. The broad schedule makes it useful between museum blocks, while the kitchen's sharper plates keep it above generic hotel-café territory.",
    {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["spanish", "mediterranean", "all_day"],
      price: "$$$",
      priceSource: "Official restaurant menu",
      attributeTags: [
        "all_day",
        "date_night",
        "central",
        "reservation_recommended",
      ],
      hours: {
        default:
          "Daily 10:00 AM-1:00 AM after August 1; kitchen and bar last orders at midnight.",
      },
      officialUrl: "https://www.almeria.cafe/",
      sourcePhoto: images.almeria,
      imagePage: editorial.cnRestaurants,
      editorialUrls: [editorial.cnRestaurants],
    },
  ),
  stop(
    "cairo-dining-mayrig",
    "Mayrig",
    [30.02093445, 31.0048455],
    "Mayrig brings Armenian-Lebanese cooking to the Arkan complex through mezze, cherry-sauced kebabs, manti, and a terrace suited to a long group dinner. It is far west of central Cairo, so book it when Sheikh Zayed is already part of the day.",
    {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["armenian", "lebanese", "middle_eastern"],
      price: "$$$",
      priceSource: "IHG dining page and current reservation listing",
      attributeTags: [
        "group_friendly",
        "terrace",
        "reservation_recommended",
        "date_night",
      ],
      hours: { default: "Daily 1:00 PM-1:00 AM." },
      officialUrl:
        "https://www.ihg.com/crowneplaza/hotels/gb/en/cairo/caisz/hoteldetail/dining",
      bookingUrl: "https://www.opentable.com/r/mayrig-cairo",
      sourcePhoto: images.mayrig,
      imagePage: editorial.cnRestaurants,
      editorialUrls: [editorial.cnRestaurants],
    },
  ),
  stop(
    "cairo-dining-tenaya",
    "Tenaya",
    [29.9556044, 31.252504],
    "Tenaya is a leafy Maadi dining room where Mediterranean plates, handmade pasta, and a serious bakery program move comfortably from breakfast into dinner. Go for the garden atmosphere, but expect a polished destination restaurant rather than a neighborhood bargain.",
    {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["mediterranean", "italian", "bakery"],
      price: "$$$",
      priceSource: "Official social menu and current map listing",
      attributeTags: [
        "garden",
        "all_day",
        "date_night",
        "reservation_recommended",
      ],
      hours: { default: "Daily 9:00 AM-1:00 AM." },
      officialUrl: "https://www.instagram.com/tenayaegypt/",
      sourcePhoto: images.tenaya,
      imagePage: editorial.cnRestaurants,
      editorialUrls: [editorial.cnRestaurants],
    },
  ),
  stop(
    "cairo-dining-barranco",
    "Barranco",
    [30.0183441, 31.0728818],
    "Barranco at Hyatt Regency Cairo West uses Nikkei technique, sushi, anticuchos, and Peruvian sauces in a dramatic room built for a full evening. The western location and luxury-hotel pricing demand planning, but the menu has a clearer identity than most resort dining.",
    {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["nikkei", "peruvian", "japanese"],
      price: "$$$$",
      priceSource: "Official restaurant and Hyatt pages",
      attributeTags: [
        "fine_dining",
        "reservation_recommended",
        "date_night",
        "hotel_restaurant",
      ],
      hours: {
        default:
          "Daily dinner 5:00 PM-1:00 AM; official reservations publish available seatings by date.",
      },
      officialUrl: "https://barrancocairo.com/",
      bookingUrl:
        "https://www.hyatt.com/hyatt-regency/en-US/hberc-hyatt-regency-cairo-west/dining",
      sourcePhoto: images.barranco,
      imagePage: editorial.cnRestaurants,
      editorialUrls: [editorial.cnRestaurants],
    },
  ),
  stop(
    "cairo-dining-reif",
    "Reif Kushiyaki Cairo",
    [30.008718, 31.402641],
    "Reif Kushiyaki delivers skewers, ramen, sushi, and playful Japanese street-food technique in a compact New Cairo setting. It works best as a shared-table dinner, and the distance east makes a reservation smarter than hoping to fold it into a Downtown route.",
    {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["japanese", "kushiyaki", "ramen"],
      price: "$$$",
      priceSource: "Baky Hospitality and current restaurant listings",
      attributeTags: [
        "group_friendly",
        "reservation_recommended",
        "sharing_plates",
        "lively",
      ],
      hours: { default: "Daily 12:00 PM-12:00 AM." },
      officialUrl: "https://www.bakyhospitality.com/",
      sourcePhoto: images.reif,
      imagePage: editorial.cnRestaurants,
      editorialUrls: [editorial.cnRestaurants, editorial.eater],
    },
  ),
  stop(
    "cairo-dining-norma",
    "Norma",
    [30.0254871, 31.0113535],
    "Norma is a handsome Sheikh Zayed Italian room centered on fresh pasta, pizza, and precise comfort food. The design is polished without becoming stiff, making it a reliable western-Cairo dinner when the table wants familiarity executed well.",
    {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["italian", "pasta", "pizza"],
      price: "$$$",
      priceSource: "Official social menu and current map listing",
      attributeTags: [
        "date_night",
        "reservation_recommended",
        "group_friendly",
        "midrange",
      ],
      hours: { default: "Daily 1:00 PM-midnight." },
      officialUrl: "https://www.instagram.com/normaegypt/",
      sourcePhoto: images.norma,
      imagePage: editorial.cnRestaurants,
      editorialUrls: [editorial.cnRestaurants],
    },
  ),
  stop(
    "cairo-dining-crimson",
    "Crimson Bar & Grill",
    [30.0707225, 31.2223429],
    "Crimson's rooftop terrace wraps Nile views around a grill-led menu in Zamalek. It earns its place for sunset atmosphere and a long service day, though reservations and a clearly higher spend matter more than culinary surprise.",
    {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["grill", "international", "mediterranean"],
      price: "$$$",
      priceSource: "Official menu and current reservation listing",
      attributeTags: [
        "rooftop",
        "scenic_food",
        "date_night",
        "reservation_recommended",
      ],
      hours: { default: "Daily 8:00 AM-1:00 AM." },
      officialUrl: "https://www.crimsoncairo.com/",
      sourcePhoto: images.crimson,
      imagePage: editorial.cnRestaurants,
      editorialUrls: [
        editorial.cnRestaurants,
        "https://nawart-eg.com/r/crimson",
      ],
    },
  ),
  stop(
    "cairo-dining-la-trattoria",
    "La Trattoria",
    [30.0653593, 31.2211392],
    "La Trattoria is the durable Zamalek Italian choice: intimate rooms, handmade pasta, veal, seafood, and service that values regulars over novelty. Choose it for an unhurried dinner, particularly when the group wants calm rather than a scene.",
    {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["italian", "pasta", "seafood"],
      price: "$$$",
      priceSource: "Official social menu and current map listing",
      attributeTags: [
        "date_night",
        "quiet",
        "reservation_recommended",
        "neighborhood_favorite",
      ],
      hours: { default: "Daily 12:00 PM-12:00 AM." },
      officialUrl: "https://www.instagram.com/latrattoriacairo/",
      sourcePhoto: images.trattoria,
      imagePage: editorial.cnRestaurants,
      editorialUrls: [editorial.cnRestaurants],
    },
  ),
  stop(
    "cairo-dining-kazoku",
    "Kazoku",
    [30.0615079, 31.437244],
    "Kazoku is New Cairo's polished Japanese destination for sushi, robata, and carefully composed plates in a theatrical room. The journey east and premium bill make sense when the restaurant is the evening's purpose, not an add-on after Downtown sightseeing.",
    {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["japanese", "sushi", "robata"],
      price: "$$$$",
      priceSource: "Baky Hospitality and current reservation listing",
      attributeTags: [
        "fine_dining",
        "reservation_recommended",
        "date_night",
        "destination_dining",
      ],
      hours: { default: "Daily 2:00 PM-1:00 AM." },
      officialUrl: "https://www.bakyhospitality.com/",
      sourcePhoto: images.kazoku,
      imagePage: editorial.cnRestaurants,
      editorialUrls: [editorial.cnRestaurants],
    },
  ),
];

const cheapEatStops = [
  stop(
    "cairo-cheap-sheikh-mohamed",
    "El Sheikh Mohamed",
    [30.021173, 31.107603],
    "El Sheikh Mohamed specializes in camel liver and charcoal grills with the speed, smoke, and directness of a serious street-side operation. Portions are built for sharing, prices stay low, and the Dokki location works best with an appetite rather than ceremony.",
    {
      venueKind: "food_drink",
      foodServiceType: "counter_service",
      cuisineTypes: ["egyptian", "grilled_meat", "offal"],
      price: "$",
      priceSource: "Eater reporting and current map listing",
      attributeTags: [
        "cheap_eats",
        "local_favorite",
        "late_night",
        "group_friendly",
      ],
      hours: { default: "Open 24 hours daily." },
      officialUrl: "https://www.instagram.com/p/CVh9_FGsHrY/",
      sourcePhoto: images.sheikhMohamed,
      imagePage:
        "https://welpstar.com/en/biz/%D8%A7%D9%84%D8%B4%D9%8A%D8%AE-%D9%85%D8%AD%D9%85%D8%AF-%D9%84%D9%84%D9%83%D8%A8%D8%AF%D8%A9-%D8%A7%D9%84%D8%AC%D9%85%D9%84%D9%8A-%D8%A3%D8%A8%D9%88%D8%B9%D8%A8%D8%AF%D8%A7%D9%84%D9%84%D9%87",
      editorialUrls: [editorial.eater],
    },
  ),
  stop(
    "cairo-cheap-hawawshi-el-rabie",
    "Hawawshi El Rabie",
    [30.085928, 31.219382],
    "Hawawshi El Rabie bakes spiced minced meat inside crisp baladi bread, with pickles and tahini supplying the necessary cut. The Shubra stop is messy, fast, inexpensive, and worth treating as a focused food mission.",
    {
      venueKind: "food_drink",
      foodServiceType: "counter_service",
      cuisineTypes: ["egyptian", "hawawshi", "street_food"],
      price: "$",
      priceSource: "Eater reporting and current map listing",
      attributeTags: [
        "cheap_eats",
        "street_food",
        "quick_meal",
        "local_favorite",
      ],
      hours: { default: "Daily noon-2:00 AM." },
      officialUrl: "https://www.instagram.com/p/C3DazYFIpvS/",
      sourcePhoto: images.hawawshi,
      imagePage:
        "https://welpstar.com/en/biz/%D8%AD%D9%88%D8%A7%D9%88%D8%B4%D9%89-%D8%A7%D9%84%D8%B1%D8%A8%D9%8A%D8%B9",
      editorialUrls: [editorial.eater],
    },
  ),
  stop(
    "cairo-cheap-abou-tarek",
    "Koshary Abou Tarek",
    [30.050237, 31.237725],
    "Abou Tarek is the high-throughput Downtown benchmark for koshary: rice, lentils, pasta, chickpeas, fried onions, tomato sauce, and vinegar heat assembled with practiced speed. It is famous, still affordable, and easiest outside peak meal waves.",
    {
      venueKind: "food_drink",
      foodServiceType: "counter_service",
      cuisineTypes: ["egyptian", "koshary", "vegetarian"],
      price: "$",
      priceSource: "Official social page and current map listing",
      attributeTags: [
        "cheap_eats",
        "quick_meal",
        "central",
        "vegetarian_friendly",
      ],
      hours: { default: "Daily 7:00 AM-11:30 PM." },
      officialUrl: "https://www.instagram.com/kosharyaboutarek/",
      sourcePhoto: images.abouTarek,
      imagePage: "https://www.flickr.com/photos/23465722@N00/28245099499",
      imageCredit: "Edgardo W. Olivera",
      imageLicense: "CC BY 2.0",
      editorialUrls: [editorial.eater, editorial.cnRestaurants],
    },
  ),
  stop(
    "cairo-cheap-fasahet-somaya",
    "Fasahet Somaya",
    [30.0457093, 31.23981535],
    "Somaya El-Adi cooks a short daily menu of Egyptian home food in a tiny Downtown room, changing the stews, rice, vegetables, and proteins rather than repeating a tourist checklist. Arrive at opening because the prepared dishes sell out.",
    {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["egyptian", "home_cooking", "seasonal"],
      price: "$",
      priceSource: "Official social page and current restaurant listing",
      attributeTags: [
        "cheap_eats",
        "local_favorite",
        "limited_menu",
        "walk_in_friendly",
      ],
      hours: {
        default:
          "Daily service follows the rotating menu on the official social page; doors open around 5:00 PM and close when that day's prepared dishes sell out.",
      },
      officialUrl: "https://www.instagram.com/fasahetsomaya/",
      sourcePhoto: images.somaya,
      imagePage: editorial.cnRestaurants,
      editorialUrls: [editorial.cnRestaurants, editorial.eater],
    },
  ),
  stop(
    "cairo-cheap-zooba-zamalek",
    "Zooba Zamalek",
    [30.0610723, 31.2193064],
    "Zooba packages fuul, taameya, koshary, eggs, and baladi bread in a bright, legible format that is useful for a first Egyptian breakfast. It costs more than a street cart, but clean sourcing and long hours lower the friction.",
    {
      venueKind: "food_drink",
      foodServiceType: "counter_service",
      cuisineTypes: ["egyptian", "street_food", "breakfast"],
      price: "$$",
      priceSource: "Official menu",
      attributeTags: [
        "breakfast",
        "vegetarian_friendly",
        "quick_meal",
        "group_friendly",
      ],
      hours: { default: "Daily 8:00 AM-1:00 AM." },
      officialUrl: "https://zoobaeats.com/",
      sourcePhoto: images.zooba,
      imagePage:
        "https://www.localguidetoegypt.com/post/10-best-restaurants-in-cairo-straight-from-the-mouths-of-locals",
      editorialUrls: [editorial.eater],
    },
  ),
  stop(
    "cairo-cheap-koshary-el-tahrir",
    "Koshary El Tahrir",
    [30.0490612, 31.2393413],
    "Koshary El Tahrir is the efficient chain alternative when Abou Tarek's crowds are the wrong kind of famous. The bowls are customizable, the Downtown branch is central, and the price remains low enough for a true utility meal.",
    {
      venueKind: "food_drink",
      foodServiceType: "counter_service",
      cuisineTypes: ["egyptian", "koshary", "vegetarian"],
      price: "$",
      priceSource: "Official menu and current map listing",
      attributeTags: [
        "cheap_eats",
        "quick_meal",
        "central",
        "vegetarian_friendly",
      ],
      hours: { default: "Daily 8:00 AM-2:00 AM." },
      officialUrl: "https://kosharyeltahrir.com/",
      sourcePhoto: images.kosharyTahrir,
      imagePage: "https://www.flickr.com/photos/8249050@N02/30850840538",
      imageCredit: "Koshary photograph via Flickr",
      imageLicense: "CC BY 2.0",
      editorialUrls: [editorial.eater],
    },
  ),
  stop(
    "cairo-cheap-sobhy-kaber",
    "Sobhy Kaber",
    [30.083813, 31.234735],
    "Sobhy Kaber is a sprawling Rod El Farag grill house for molokhia, pigeon, fatta, kebabs, and family-size Egyptian meals. The scale can feel chaotic, but quick turnover, generous portions, and broad hours make it an effective group feast.",
    {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["egyptian", "grill", "family_style"],
      price: "$$",
      priceSource: "Official social page and current map listing",
      attributeTags: [
        "group_friendly",
        "local_favorite",
        "late_night",
        "family_friendly",
      ],
      hours: { default: "Daily 12:00 PM-5:00 AM." },
      officialUrl: "https://www.instagram.com/sobhykaber.restaurant/",
      sourcePhoto: images.sobhy,
      imagePage: "https://restaurantguru.com/Sobhy-Kaber-Cairo",
      editorialUrls: [editorial.eater],
    },
  ),
  stop(
    "cairo-cheap-abo-hashem",
    "Abo Hashem",
    [30.044721, 31.25929],
    "Abo Hashem keeps the order narrow and useful: grilled kofta, kebabs, bread, salads, and tahini near Islamic Cairo. It is a practical protein-heavy lunch between monuments, with smoke and speed replacing decorative atmosphere.",
    {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["egyptian", "grill", "kofta"],
      price: "$",
      priceSource: "Eater reporting and current map listing",
      attributeTags: ["cheap_eats", "local_favorite", "quick_meal", "central"],
      hours: { default: "Daily 2:00 PM-11:30 PM." },
      officialUrl: "https://www.instagram.com/p/C2kTffBNx3k/",
      sourcePhoto: images.aboHashem,
      imagePage: "https://restaurantguru.com/Abo-Hashem-Egypt",
      editorialUrls: [editorial.eater],
    },
  ),
  stop(
    "cairo-cheap-farahat",
    "Farahat",
    [30.046338, 31.260843],
    "Farahat is the focused pigeon stop beside Khan el-Khalili, serving stuffed hamam mahshi with rice, soups, and simple sides in a narrow dining room. It is more memorable than another mixed grill and easy to pair with Al-Muizz.",
    {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["egyptian", "pigeon", "rice"],
      price: "$$",
      priceSource: "Eater reporting and current map listing",
      attributeTags: [
        "local_favorite",
        "central",
        "quick_meal",
        "historic_district",
      ],
      hours: { default: "Daily 12:00 PM-12:00 AM." },
      officialUrl: "https://www.instagram.com/farahat.restaurant/",
      sourcePhoto: images.farahat,
      imagePage: "https://restaurantguru.com/Kababgy-El-Azhar-Farahat-Cairo",
      editorialUrls: [editorial.eater],
    },
  ),
  stop(
    "cairo-cheap-abo-haider",
    "Abo Haider",
    [30.091492, 31.318872],
    "Abo Haider in Heliopolis is built around shawarma, liver, sausages, and sandwiches that travel well into the late night. The branch is far from Downtown sightseeing, but it earns the detour when Korba or the airport side is already on the route.",
    {
      venueKind: "food_drink",
      foodServiceType: "counter_service",
      cuisineTypes: ["egyptian", "shawarma", "sandwiches"],
      price: "$",
      priceSource: "Eater reporting and current map listing",
      attributeTags: [
        "cheap_eats",
        "late_night",
        "quick_meal",
        "local_favorite",
      ],
      hours: {
        default:
          "Sunday 8:30 AM-12:00 AM; Monday-Saturday 8:30 AM-1:30 AM.",
      },
      officialUrl: "https://www.instagram.com/p/BtGgZWkBCIm/",
      sourcePhoto: images.aboHaider,
      imagePage: "https://restaurantguru.com/shawrmh-abw-hydr-Cairo",
      editorialUrls: [editorial.eater],
    },
  ),
];

const hotelStops = [
  stop(
    "cairo-hotel-mena-house",
    "Marriott Mena House, Cairo",
    [29.985364, 31.133072],
    "Mena House is the pyramid-first hotel choice, with gardens, a resort rhythm, and some rooms facing the Giza plateau. The tradeoff is distance from central Cairo; choose it for early monument access and a slower base, not nightlife convenience.",
    {
      venueKind: "lodging",
      lodgingType: "hotel",
      price: "$$$$",
      priceSource: "Official Marriott booking page",
      attributeTags: ["luxury", "pool", "historic", "landmark_views"],
      hours: {
        default:
          "Open 24 hours daily; check-in from 3:00 PM and check-out by 12:00 PM.",
      },
      bookingUrl:
        "https://www.marriott.com/en-us/hotels/caimn-marriott-mena-house-cairo/overview/",
      sourcePhoto: images.menaHouse,
      imagePage:
        "https://www.akorndmc.com/destinations/egypt/hotels/the-marriott-mena-house-hotel/",
      editorialUrls: [
        "https://www.marriott.com/en-us/hotels/caimn-marriott-mena-house-cairo/overview/",
      ],
    },
  ),
  stop(
    "cairo-hotel-four-seasons-nile-plaza",
    "Four Seasons Hotel Cairo at Nile Plaza",
    [30.0361097, 31.2296318],
    "Four Seasons Nile Plaza is the full-service Garden City base for river views, multiple restaurants, a serious pool deck, and dependable luxury logistics. Traffic remains Cairo traffic, but the location balances Downtown museums with Zamalek and Old Cairo better than Giza resorts.",
    {
      venueKind: "lodging",
      lodgingType: "hotel",
      price: "$$$$",
      priceSource: "Official Four Seasons booking page",
      attributeTags: ["luxury", "pool", "spa", "nile_view"],
      hours: {
        default:
          "Open 24 hours daily; check-in from 3:00 PM and check-out by 12:00 PM.",
      },
      bookingUrl: "https://www.fourseasons.com/caironp/",
      sourcePhoto: images.fourSeasonsNile,
      imagePage: "https://www.fourseasons.com/caironp/",
      editorialUrls: ["https://www.fourseasons.com/caironp/"],
    },
  ),
  stop(
    "cairo-hotel-st-regis",
    "The St. Regis Cairo",
    [30.0629354, 31.2274123],
    "The St. Regis pairs large Nile-facing rooms with butler service, ambitious public spaces, and one of the city's strongest luxury-bar programs. Its north-corniche position suits Zamalek and Downtown, while the scale can feel more grand hotel than intimate retreat.",
    {
      venueKind: "lodging",
      lodgingType: "hotel",
      price: "$$$$",
      priceSource: "Official Marriott booking page",
      attributeTags: ["luxury", "pool", "spa", "nile_view"],
      hours: {
        default:
          "Open 24 hours daily; check-in from 3:00 PM and check-out by 12:00 PM.",
      },
      bookingUrl:
        "https://www.marriott.com/en-us/hotels/caixr-the-st-regis-cairo/overview/",
      sourcePhoto: images.stRegis,
      imagePage:
        "https://marriott.africa-newsroom.com/press/st-regis-hotels-heralds-a-new-beacon-of-luxury-on-the-nile-with-the-opening-of-the-st-regis-cairo?lang=en",
      editorialUrls: [
        "https://www.marriott.com/en-us/hotels/caixr-the-st-regis-cairo/overview/",
      ],
    },
  ),
  stop(
    "cairo-hotel-nile-ritz",
    "The Nile Ritz-Carlton, Cairo",
    [30.0458889, 31.2320351],
    "The Nile Ritz-Carlton puts Tahrir Square, the Egyptian Museum, and the corniche directly outside the lobby. Rooms and public spaces favor classic scale over boutique character, but the central positioning and deep dining roster simplify a first Cairo stay.",
    {
      venueKind: "lodging",
      lodgingType: "hotel",
      price: "$$$$",
      priceSource: "Official Ritz-Carlton booking page",
      attributeTags: ["luxury", "pool", "central", "nile_view"],
      hours: {
        default:
          "Open 24 hours daily; check-in from 3:00 PM and check-out by 12:00 PM.",
      },
      bookingUrl:
        "https://www.ritzcarlton.com/en/hotels/cairz-the-nile-ritz-carlton-cairo/overview/",
      sourcePhoto: images.nileRitz,
      imagePage:
        "https://www.ritzcarlton.com/en/hotels/cairz-the-nile-ritz-carlton-cairo/overview/",
      editorialUrls: [
        "https://www.ritzcarlton.com/en/hotels/cairz-the-nile-ritz-carlton-cairo/overview/",
      ],
    },
  ),
  stop(
    "cairo-hotel-sofitel-downtown",
    "Sofitel Cairo Downtown Nile",
    [30.05208775, 31.22610815],
    "Sofitel Cairo Downtown Nile is a modern corniche tower with broad river views, four restaurants, a spa, and a useful bridge between Tahrir and the northern waterfront. Its scale favors facilities and convenience over neighborhood intimacy.",
    {
      venueKind: "lodging",
      lodgingType: "hotel",
      price: "$$$$",
      priceSource: "Official Accor booking page",
      attributeTags: ["luxury", "pool", "spa", "nile_view"],
      hours: {
        default:
          "Open 24 hours daily; check-in from 3:00 PM and check-out by 12:00 PM.",
      },
      bookingUrl: "https://sofitel.accor.com/en/hotels/C3J2.html",
      sourcePhoto: images.sofitelDowntown,
      imagePage:
        "https://luxuryescapes.com/au/partner/sofitel-cairo-downtown-nile/435d6073-945b-4931-b241-c9832891e9cf",
      editorialUrls: ["https://sofitel.accor.com/en/hotels/C3J2.html"],
    },
  ),
  stop(
    "cairo-hotel-kempinski",
    "Kempinski Nile Hotel Cairo",
    [30.038695, 31.2308814],
    "Kempinski Nile Hotel is smaller than the nearby mega-hotels, giving Garden City stays a more contained luxury rhythm. The rooftop pool and river-facing rooms are the draw; choose carefully because entry categories may face the city instead.",
    {
      venueKind: "lodging",
      lodgingType: "hotel",
      price: "$$$$",
      priceSource: "Official Kempinski booking page",
      attributeTags: ["luxury", "rooftop_pool", "spa", "nile_view"],
      hours: {
        default:
          "Open 24 hours daily; check-in from 3:00 PM and check-out by 12:00 PM.",
      },
      bookingUrl: "https://www.kempinski.com/en/nile-hotel",
      sourcePhoto: images.kempinski,
      imagePage: "https://www.kempinski.com/en/nile-hotel",
      editorialUrls: ["https://www.kempinski.com/en/nile-hotel"],
    },
  ),
  stop(
    "cairo-hotel-cairo-marriott",
    "Cairo Marriott Hotel",
    [30.0570884, 31.2251468],
    "Cairo Marriott folds a restored khedival palace, large gardens, towers, restaurants, and a casino into a central Zamalek compound. The historic core has more character than many guestrooms, but the neighborhood and shaded grounds remain highly practical.",
    {
      venueKind: "lodging",
      lodgingType: "hotel",
      price: "$$$",
      priceSource: "Official Marriott booking page",
      attributeTags: ["historic", "pool", "central", "garden"],
      hours: {
        default:
          "Open 24 hours daily; check-in from 3:00 PM and check-out by 12:00 PM.",
      },
      bookingUrl:
        "https://www.marriott.com/en-us/hotels/caieg-cairo-marriott-hotel/overview/",
      sourcePhoto: images.cairoMarriott,
      imagePage:
        "https://commons.wikimedia.org/wiki/File:Cairo_Marriott_Hotel.jpg",
      imageCredit: "Wikimedia Commons contributor",
      imageLicense: "Creative Commons",
      editorialUrls: [
        "https://www.marriott.com/en-us/hotels/caieg-cairo-marriott-hotel/overview/",
      ],
    },
  ),
  stop(
    "cairo-hotel-steigenberger",
    "Steigenberger Hotel El Tahrir",
    [30.0467285, 31.235259],
    "Steigenberger El Tahrir is the efficient mid-upscale Downtown option: a compact pool, reliable rooms, and a short walk to Tahrir Square and the Egyptian Museum. Street noise and busy approaches are the price of genuine centrality.",
    {
      venueKind: "lodging",
      lodgingType: "hotel",
      price: "$$$",
      priceSource: "Official H Rewards booking page",
      attributeTags: ["central", "pool", "business_friendly", "walkable"],
      hours: {
        default:
          "Open 24 hours daily; check-in from 3:00 PM and check-out by 12:00 PM.",
      },
      bookingUrl: "https://hrewards.com/en/steigenberger-hotel-el-tahrir-cairo",
      sourcePhoto: images.steigenberger,
      imagePage: "https://hrewards.com/en/steigenberger-hotel-el-tahrir-cairo",
      editorialUrls: [
        "https://hrewards.com/en/steigenberger-hotel-el-tahrir-cairo",
      ],
    },
  ),
  stop(
    "cairo-hotel-fairmont",
    "Fairmont Nile City",
    [30.0717901, 31.2277359],
    "Fairmont Nile City delivers Art Deco-influenced rooms, a rooftop pool, spa, and a deep restaurant roster above the northern corniche. It is best for travelers who value self-contained luxury; walking immediately outside is less rewarding than in Zamalek or Downtown.",
    {
      venueKind: "lodging",
      lodgingType: "hotel",
      price: "$$$$",
      priceSource: "Official Fairmont booking page",
      attributeTags: ["luxury", "rooftop_pool", "spa", "nile_view"],
      hours: {
        default:
          "Open 24 hours daily; check-in from 3:00 PM and check-out by 12:00 PM.",
      },
      bookingUrl:
        "https://www.fairmont.com/en/hotels/cairo/fairmont-nile-city.html",
      sourcePhoto: images.fairmont,
      imagePage:
        "https://www.fairmont.com/en/hotels/cairo/fairmont-nile-city.html",
      editorialUrls: [
        "https://www.fairmont.com/en/hotels/cairo/fairmont-nile-city.html",
      ],
    },
  ),
  stop(
    "cairo-hotel-four-seasons-first",
    "Four Seasons Hotel Cairo at The First Residence",
    [30.0243051, 31.2168314],
    "Four Seasons First Residence is the quieter Giza-bank sibling, combining attentive service, Nile views, a pool, and direct access to the First Nile Boat restaurants. It suits travelers prioritizing calm over a walkable Downtown doorstep.",
    {
      venueKind: "lodging",
      lodgingType: "hotel",
      price: "$$$$",
      priceSource: "Official Four Seasons booking page",
      attributeTags: ["luxury", "pool", "spa", "quiet"],
      hours: {
        default:
          "Open 24 hours daily; check-in from 3:00 PM and check-out by 12:00 PM.",
      },
      bookingUrl: "https://www.fourseasons.com/cairofr/",
      sourcePhoto: images.fourSeasonsFirst,
      imagePage: "https://www.fourseasons.com/cairofr/",
      editorialUrls: ["https://www.fourseasons.com/cairofr/"],
    },
  ),
];

const hostelStops = [
  stop(
    "cairo-hostel-dahab",
    "Dahab Hostel",
    [30.0480652, 31.2374697],
    "Dahab Hostel's rooftop garden, Downtown position, dorms, and private rooms make it the classic independent-traveler base. The building is simple and stairs matter, but generous common space and 24-hour reception support late Cairo logistics.",
    {
      venueKind: "lodging",
      lodgingType: "hostel",
      price: "$",
      priceSource: "Current Hostelworld property page",
      attributeTags: ["dorms", "private_rooms", "rooftop", "social"],
      hours: {
        default:
          "Reception is open 24 hours daily; check-in 2:00 PM-12:00 AM and check-out by 12:00 PM.",
      },
      bookingUrl: "https://www.hostelworld.com/hostels/p/6292/dahab-hostel/",
      sourcePhoto: images.dahab,
      imagePage: "https://www.hostelworld.com/hostels/p/6292/dahab-hostel/",
      editorialUrls: [editorial.hostelworld],
    },
  ),
  stop(
    "cairo-hostel-villa-layla",
    "Villa Layla",
    [30.036027, 31.23542],
    "Villa Layla offers a smaller, guesthouse-like hostel experience with shared rooms, private options, and staff help in central Cairo. The late-evening arrival cutoff is stricter than 24-hour competitors, so confirm transport before landing.",
    {
      venueKind: "lodging",
      lodgingType: "hostel",
      price: "$",
      priceSource: "Current Hostelworld property page",
      attributeTags: ["dorms", "private_rooms", "quiet", "central"],
      hours: {
        default:
          "Reception is open 24 hours daily; check-in 3:00 PM-11:00 PM and check-out by 11:00 AM.",
      },
      bookingUrl: "https://www.hostelworld.com/hostels/p/330811/villa-layla/",
      sourcePhoto: images.villaLayla,
      imagePage: "https://www.hostelworld.com/hostels/p/330811/villa-layla/",
      editorialUrls: [editorial.hostelworld],
    },
  ),
  stop(
    "cairo-hostel-australian",
    "The Australian Hostel",
    [30.0503919, 31.2415404],
    "The Australian Hostel is a sociable Downtown fallback with dorms, private rooms, breakfast, and common areas close to the metro. Décor is functional rather than polished, but round-the-clock reception helps with unpredictable arrivals.",
    {
      venueKind: "lodging",
      lodgingType: "hostel",
      price: "$",
      priceSource: "Current Hostelworld property page",
      attributeTags: ["dorms", "private_rooms", "social", "central"],
      hours: {
        default:
          "Reception is open 24 hours daily; check-in 1:00 PM-12:00 AM and check-out by 11:00 AM.",
      },
      bookingUrl:
        "https://www.hostelworld.com/hostels/p/20070/the-australian-hostel/",
      sourcePhoto: images.australian,
      imagePage:
        "https://www.hostelworld.com/hostels/p/20070/the-australian-hostel/",
      editorialUrls: [editorial.hostelworld],
    },
  ),
  stop(
    "cairo-hostel-meramees",
    "Meramees Hostel",
    [30.0467446, 31.2404528],
    "Meramees occupies a high-ceilinged Downtown building with dorms, private rooms, breakfast, and a long-running backpacker setup. The finish is older, but the central grid and flexible reception remain useful for value-first travelers.",
    {
      venueKind: "lodging",
      lodgingType: "hostel",
      price: "$",
      priceSource: "Current Hostelworld property page",
      attributeTags: ["dorms", "private_rooms", "historic_building", "central"],
      hours: {
        default:
          "Reception is open 24 hours daily; check-in 1:00 PM-12:00 AM and check-out by 1:00 PM.",
      },
      bookingUrl: "https://www.hostelworld.com/hostels/p/2332/meramees-hostel/",
      sourcePhoto: images.meramees,
      imagePage: "https://www.hostelworld.com/hostels/p/2332/meramees-hostel/",
      editorialUrls: [editorial.hostelworld],
    },
  ),
  stop(
    "cairo-hostel-madina",
    "Madina Hostel",
    [30.0468102, 31.2365739],
    "Madina is a brighter modern hostel near Tahrir with dorm curtains, private rooms, a shared kitchen, and attentive traveler logistics. It costs more than Cairo's oldest backpacker floors, but privacy and cleanliness are the point.",
    {
      venueKind: "lodging",
      lodgingType: "hostel",
      price: "$$",
      priceSource: "Current Hostelworld property page",
      attributeTags: ["dorms", "private_rooms", "modern", "central"],
      hours: {
        default:
          "Reception is open 24 hours daily; check-in 12:00 PM-11:00 PM and check-out by 11:00 AM.",
      },
      bookingUrl: "https://www.hostelworld.com/hostels/p/307046/madina-hostel/",
      sourcePhoto: images.madina,
      imagePage: "https://www.hostelworld.com/hostels/p/307046/madina-hostel/",
      editorialUrls: [editorial.hostelworld],
    },
  ),
  stop(
    "cairo-hostel-holy-sheet",
    "Holy Sheet Hostel",
    [30.0472373, 31.2400134],
    "Holy Sheet is a contemporary Downtown hostel with pod-like dorm beds, private rooms, communal breakfasts, and a genuinely social lounge. The playful branding comes with practical privacy curtains and 24/7 arrival support.",
    {
      venueKind: "lodging",
      lodgingType: "hostel",
      price: "$$",
      priceSource: "Current Hostelworld property page",
      attributeTags: ["dorms", "private_rooms", "social", "privacy_curtains"],
      hours: {
        default:
          "Reception is open 24 hours daily; check-in 1:00 PM-12:00 AM and check-out by 12:00 PM, with earlier access when the assigned bed or room is ready.",
      },
      bookingUrl:
        "https://www.hostelworld.com/hostels/p/294199/holy-sheet-hostel/",
      sourcePhoto: images.holySheet,
      imagePage:
        "https://www.hostelworld.com/hostels/p/294199/holy-sheet-hostel/",
      editorialUrls: [editorial.hostelworld],
    },
  ),
  stop(
    "cairo-hostel-cairo-house",
    "Cairo House",
    [30.04882235, 31.2412414],
    "Cairo House combines dorms, family rooms, private rooms, and balconies in the Downtown grid. It is more guesthouse than party hostel, making it useful for pairs who want low prices without giving up a private door.",
    {
      venueKind: "lodging",
      lodgingType: "hostel",
      price: "$",
      priceSource: "Current Hostelworld property page",
      attributeTags: ["dorms", "private_rooms", "quiet", "central"],
      hours: {
        default:
          "Reception is open 24 hours daily; check-in 12:00 PM-10:00 PM and check-out by 12:00 PM.",
      },
      bookingUrl: "https://www.hostelworld.com/hostels/p/310001/cairo-house/",
      sourcePhoto: images.cairoHouse,
      imagePage: "https://www.hostelworld.com/hostels/p/310001/cairo-house/",
      editorialUrls: [editorial.hostelworld],
    },
  ),
  stop(
    "cairo-hostel-cheers",
    "Cheers Hostel Cairo",
    [30.0511876, 31.2405934],
    "Cheers is a compact Downtown hostel with dorms, private rooms, breakfast, and traveler-focused staff close to Talaat Harb. It is social at a smaller scale, though arrivals after 11:00 PM should be arranged directly.",
    {
      venueKind: "lodging",
      lodgingType: "hostel",
      price: "$",
      priceSource: "Current Hostelworld property page",
      attributeTags: ["dorms", "private_rooms", "social", "central"],
      hours: {
        default:
          "Reception is open 24 hours daily; check-in 1:00 PM-11:00 PM and check-out by 12:00 PM.",
      },
      bookingUrl:
        "https://www.hostelworld.com/hostels/p/295113/cheers-hostel-cairo/",
      sourcePhoto: images.cheers,
      imagePage:
        "https://www.hostelworld.com/hostels/p/295113/cheers-hostel-cairo/",
      editorialUrls: [editorial.hostelworld],
    },
  ),
  stop(
    "cairo-hostel-zamalek-x",
    "Zamalek X Hostel",
    [30.0618268, 31.2173855],
    "Zamalek X trades Downtown chaos for an apartment-style base in leafy Zamalek, with dorms, work space, a kitchen, and a shared living room. The quieter neighborhood costs more and check-in closes earlier, but the setting is easier for longer stays.",
    {
      venueKind: "lodging",
      lodgingType: "hostel",
      price: "$$",
      priceSource: "Current Hostelworld property page",
      attributeTags: ["dorms", "coworking", "quiet", "long_stay"],
      hours: {
        default:
          "Daily check-in 12:00 PM-10:00 PM and check-out by 11:00 AM; coordinate late arrival with the property before travel.",
      },
      bookingUrl:
        "https://www.hostelworld.com/hostels/p/317001/zamalek-x-hostel/",
      sourcePhoto: images.zamalekX,
      imagePage:
        "https://www.hostelworld.com/hostels/p/317001/zamalek-x-hostel/",
      editorialUrls: [editorial.hostelworld],
    },
  ),
  stop(
    "cairo-hostel-heritage",
    "Heritage Hostel Cairo",
    [30.0461735, 31.2376527],
    "Heritage Hostel faces the Egyptian Museum from a Downtown building, offering dorms and private rooms with unbeatable museum-day logistics. Street activity and an older lift are part of the deal; book it for location rather than resort calm.",
    {
      venueKind: "lodging",
      lodgingType: "hostel",
      price: "$",
      priceSource: "Current Hostelworld property page",
      attributeTags: ["dorms", "private_rooms", "central", "museum_access"],
      hours: {
        default:
          "Reception is open 24 hours daily; check-in 12:00 PM-11:00 PM, with the checkout time published on the selected Hostelworld booking date.",
      },
      bookingUrl:
        "https://www.hostelworld.com/hostels/p/297621/heritage-hostel-cairo/",
      sourcePhoto: images.heritage,
      imagePage:
        "https://www.hostelworld.com/hostels/p/297621/heritage-hostel-cairo/",
      editorialUrls: [editorial.hostelworld],
    },
  ),
];

const casualBarStops = [
  stop(
    "cairo-bar-pub28",
    "Pub 28",
    [30.0628122, 31.2197998],
    "Pub 28 is the worn-in Zamalek pub for cold local beer, straightforward plates, and conversation at a volume that does not require performance. The small room fills quickly, and smoke can be part of the atmosphere.",
    {
      venueKind: "nightlife",
      nightlifeType: "pub",
      price: "$$",
      priceSource: "Current Nawart listing and map menu",
      attributeTags: ["casual", "local_favorite", "beer", "neighborhood_bar"],
      hours: { default: "Daily noon-2:00 AM." },
      officialUrl: "https://www.facebook.com/Pub28Zamalek/",
      sourcePhoto: images.pub28,
      imagePage: "https://nawart-eg.com/r/pub28",
      editorialUrls: [editorial.nightlife, "https://nawart-eg.com/r/pub28"],
    },
  ),
  stop(
    "cairo-bar-cellar",
    "The Cairo Cellar",
    [30.0677035, 31.2194854],
    "The Cairo Cellar has occupied the President Hotel basement since 1978, serving burgers, drinks, and cigars in low-lit booths. It is clubby rather than fashionable, useful for a late Zamalek drink when rooftop spectacle feels exhausting.",
    {
      venueKind: "nightlife",
      nightlifeType: "pub",
      price: "$$",
      priceSource: "Current Nawart listing and map menu",
      attributeTags: ["casual", "historic", "late_night", "neighborhood_bar"],
      hours: { default: "Daily 4:00 PM-3:00 AM." },
      officialUrl: "https://presidenthotelcairo.com/",
      sourcePhoto: images.cellar,
      imagePage: "https://nawart-eg.com/r/cairo-cellar",
      editorialUrls: [
        editorial.nightlife,
        "https://nawart-eg.com/r/cairo-cellar",
      ],
    },
  ),
  stop(
    "cairo-bar-tap-east",
    "The Tap East",
    [30.0455834, 31.4761462],
    "The Tap East is a New Cairo gastropub with draft beer, wings, sport screens, live sets, and an outdoor terrace. It works for groups who want food and noise together, though big match nights change the pace completely.",
    {
      venueKind: "nightlife",
      nightlifeType: "pub",
      musicGenres: ["live_music", "dj_sets"],
      price: "$$$",
      priceSource: "Current Nawart feature and map menu",
      attributeTags: [
        "group_friendly",
        "sports",
        "live_music",
        "outdoor_seating",
      ],
      hours: {
        default:
          "Daily 3:00 PM-1:00 AM; live music and match screenings follow the official event schedule.",
      },
      officialUrl: "https://www.instagram.com/thetap.co/",
      sourcePhoto: images.tapEast,
      imagePage: "https://restaurantguru.com/The-Tap-East-New-Cairo-City",
      editorialUrls: [editorial.nightlife, "https://nawart-eg.com/r/tap-east"],
    },
  ),
  stop(
    "cairo-bar-tap-west",
    "The Tap West",
    [30.0172055, 31.0007751],
    "The Tap West carries the same beer, pub-food, sport, and live-music formula into Arkan's broad outdoor terrace. It is a practical western-Cairo group night, especially when table space matters more than cocktail precision.",
    {
      venueKind: "nightlife",
      nightlifeType: "pub",
      musicGenres: ["live_music", "dj_sets"],
      price: "$$$",
      priceSource: "Current Nawart feature and map menu",
      attributeTags: [
        "group_friendly",
        "sports",
        "live_music",
        "outdoor_seating",
      ],
      hours: {
        default:
          "Daily 3:00 PM-3:00 AM; performances and match screenings follow the official event schedule.",
      },
      officialUrl: "https://www.instagram.com/thetap.co/",
      sourcePhoto: images.tapWest,
      imagePage:
        "https://www.localguidetoegypt.com/post/12-best-bars-pubs-and-restobars-in-6-october-cairo",
      editorialUrls: [editorial.nightlife, "https://nawart-eg.com/r/tap-west"],
    },
  ),
  stop(
    "cairo-bar-cairo-jazz",
    "Cairo Jazz Club",
    [30.062177, 31.2119015],
    "Cairo Jazz Club is the long-running Agouza room for bands, electronic nights, and local alternative music. The name understates the range; the calendar decides the experience, and advance reservations are often necessary.",
    {
      venueKind: "nightlife",
      nightlifeType: "live_music_venue",
      musicGenres: ["jazz", "electronic", "indie", "world_music"],
      price: "$$$",
      priceSource: "Official event page and current Nawart listing",
      attributeTags: [
        "live_music",
        "reservation_recommended",
        "dancing",
        "late_night",
      ],
      hours: {
        default:
          "Daily event window is 5:00 PM-1:00 AM; exact doors, sets, and admission are published on the official event calendar.",
      },
      officialUrl: "https://www.cairojazzclub.com/",
      sourcePhoto: images.cairoJazz,
      imagePage: "https://nawart-eg.com/r/cairo-jazz-club",
      editorialUrls: [
        editorial.nightlife,
        "https://nawart-eg.com/r/cairo-jazz-club",
      ],
    },
  ),
  stop(
    "cairo-bar-cjc610",
    "Cairo Jazz Club 610",
    [30.0193288, 31.002856],
    "Cairo Jazz Club 610 gives Sheikh Zayed a larger stage, outdoor space, bands, DJ nights, and a crowd willing to build an evening around the booking. Treat it as an event venue: the artist and door policy matter more than generic hours.",
    {
      venueKind: "nightlife",
      nightlifeType: "live_music_venue",
      musicGenres: ["electronic", "indie", "live_music", "dj_sets"],
      price: "$$$",
      priceSource: "Official event calendar and current Nawart listing",
      attributeTags: [
        "live_music",
        "dancing",
        "reservation_recommended",
        "outdoor_seating",
      ],
      hours: {
        default:
          "Doors and closing time follow the official event calendar; every listed concert or DJ night publishes its date, entry time, and reservation rules.",
      },
      officialUrl: "https://www.cairojazzclub.com/",
      sourcePhoto: images.cjc610,
      imagePage: "https://cairo-jazz-club-610.wheree.com/",
      editorialUrls: [editorial.nightlife, "https://nawart-eg.com/r/cjc610"],
    },
  ),
  stop(
    "cairo-bar-underground",
    "Underground by After 8",
    [30.04419785, 31.1197377],
    "Underground by After 8 is a Mohandessin basement stage for Egyptian bands, cover sets, and dance-oriented nights. It is not a drop-in neighborhood bar; check the bill, reservation instructions, and minimum-charge policy first.",
    {
      venueKind: "nightlife",
      nightlifeType: "live_music_venue",
      musicGenres: ["arabic", "pop", "live_music", "dance"],
      price: "$$$",
      priceSource: "Official event page and current Nawart listing",
      attributeTags: [
        "live_music",
        "dancing",
        "reservation_recommended",
        "late_night",
      ],
      hours: {
        default:
          "Opening, doors, and closing follow the official event calendar; each scheduled show publishes its start time and reservation requirements.",
      },
      officialUrl: "https://www.facebook.com/UndergroundbyAfter8/",
      sourcePhoto: images.underground,
      imagePage: "https://nawart-eg.com/r/underground-after8",
      editorialUrls: [
        editorial.nightlife,
        "https://nawart-eg.com/r/underground-after8",
      ],
    },
  ),
  stop(
    "cairo-bar-gigi",
    "GIGI Burger Bar",
    [30.0167, 31.0012],
    "GIGI at Arkan is a relaxed beer-and-burger bar with outdoor tables, draft options, and enough food to anchor a group. It is casual by design, with weekend volume and sport making the room livelier than the menu suggests.",
    {
      venueKind: "nightlife",
      nightlifeType: "pub",
      price: "$$",
      priceSource: "Current venue listing and map menu",
      attributeTags: ["casual", "group_friendly", "beer", "outdoor_seating"],
      hours: {
        default:
          "Daily 10:00 AM-2:00 AM, with Friday service listed to approximately 2:15 AM.",
      },
      officialUrl: "https://www.facebook.com/gigiburgerbar.arkan/",
      sourcePhoto: images.gigi,
      imagePage: "https://nawart-eg.com/r/gigi-bar",
      editorialUrls: [editorial.nightlife, "https://nawart-eg.com/r/gigi-bar"],
    },
  ),
  stop(
    "cairo-bar-brasserie",
    "The Brasserie Lake View",
    [30.0302, 31.5003],
    "The Brasserie Lake View is a broad New Cairo terrace for drinks, Mediterranean food, celebrations, and scheduled live music. The setting favors groups and occasions; performance nights and private functions can change both access and noise.",
    {
      venueKind: "nightlife",
      nightlifeType: "live_music_venue",
      musicGenres: ["live_music", "lounge", "pop"],
      price: "$$$",
      priceSource: "Official menu and current Nawart listing",
      attributeTags: [
        "live_music",
        "outdoor_seating",
        "group_friendly",
        "reservation_recommended",
      ],
      hours: {
        default:
          "Daily from 4:00 PM; closing time, live sets, and private-event access follow the official venue schedule.",
      },
      officialUrl: "https://linktr.ee/thebrasserieeg",
      sourcePhoto: images.brasserie,
      imagePage:
        "https://cairo360.com/article/nightlife/the-brasserie-lake-view-where-elegant-dining-meets-a-lively-night-out/",
      editorialUrls: [
        editorial.nightlife,
        "https://nawart-eg.com/r/brasserie-lakeview",
      ],
    },
  ),
  stop(
    "cairo-bar-room-garden-city",
    "Room Art Space & Café — Garden City",
    [30.0353166, 31.2315383],
    "Room Art Space is Garden City's intimate all-purpose stage for local bands, karaoke, comedy, film, and theatre, backed by a café menu rather than a conventional bar program. It earns its place through the density of the calendar: choose the artist or format first, then book the shared-table ticket rather than treating it as a casual walk-in.",
    {
      venueKind: "nightlife",
      nightlifeType: "live_music_venue",
      musicGenres: ["live_music", "acoustic", "world_music", "open_mic"],
      price: "$$",
      priceSource: "Official 2026 event listings and ticket pages",
      attributeTags: [
        "live_music",
        "local_favorite",
        "reservation_recommended",
        "central",
      ],
      hours: {
        default:
          "Daily 10:00 AM-midnight for ticket purchase and café access; doors, showtimes, admission, and minimum order follow the official event calendar.",
      },
      officialUrl: "https://www.roomart.space/",
      bookingUrl: "https://www.roomart.space/events",
      sourcePhoto: images.roomGarden,
      imagePage: "https://www.roomart.space/",
      editorialUrls: ["https://www.roomart.space/events"],
    },
  ),
];

const cocktailStops = [
  stop(
    "cairo-cocktail-crimson",
    "Crimson Bar & Grill",
    [30.0707225, 31.2223429],
    "Crimson is Zamalek's view-first cocktail terrace, with the Nile wrapping around the rooftop and a full grill menu supporting long evenings. Sunset bookings are competitive, and the premium is as much for the table as the drink.",
    {
      venueKind: "nightlife",
      nightlifeType: "cocktail_bar",
      price: "$$$",
      priceSource: "Official menu and current reservation listing",
      attributeTags: [
        "craft_cocktails",
        "rooftop",
        "date_night",
        "reservation_recommended",
      ],
      hours: { default: "Daily 8:00 AM-1:00 AM." },
      officialUrl: "https://www.crimsoncairo.com/",
      sourcePhoto: images.crimson,
      imagePage: editorial.cnRestaurants,
      editorialUrls: [editorial.nightlife, "https://nawart-eg.com/r/crimson"],
    },
  ),
  stop(
    "cairo-cocktail-escobar",
    "Escobar",
    [30.0397227, 31.2333674],
    "Escobar mixes cocktails and Latin-leaning plates in a warm, greenery-filled Garden City room. It is more restaurant-bar than laboratory, making it useful for groups who need a real dinner alongside margaritas and music.",
    {
      venueKind: "nightlife",
      nightlifeType: "cocktail_bar",
      musicGenres: ["latin", "dj_sets"],
      price: "$$$",
      priceSource: "Official social menu and current map listing",
      attributeTags: [
        "craft_cocktails",
        "date_night",
        "group_friendly",
        "reservation_recommended",
      ],
      hours: { default: "Daily 5:00 PM-2:00 AM." },
      officialUrl: "https://www.instagram.com/escobarcairo/",
      sourcePhoto: images.escobar,
      imagePage: "https://restaurantguru.com/Escobar-Restaurant-Egypt-Egypt",
      editorialUrls: [editorial.eater],
    },
  ),
  stop(
    "cairo-cocktail-tipsy-camel",
    "Tipsy Camel",
    [29.9584365, 31.2690403],
    "Tipsy Camel is Maadi's easygoing cocktail bar for pool, football, mixed drinks, and a neighborhood crowd. The program values a relaxed night over hushed technique, so it works when different tastes need one flexible table.",
    {
      venueKind: "nightlife",
      nightlifeType: "cocktail_bar",
      price: "$$",
      priceSource: "Current Nawart listing and map menu",
      attributeTags: [
        "craft_cocktails",
        "casual",
        "sports",
        "neighborhood_bar",
      ],
      hours: { default: "Daily 3:00 PM-2:00 AM." },
      officialUrl: "https://www.instagram.com/tipsycamel/",
      sourcePhoto: images.tipsyCamel,
      imagePage: "https://nawart-eg.com/r/tipsy-camel",
      editorialUrls: [
        editorial.nightlife,
        "https://nawart-eg.com/r/tipsy-camel",
      ],
    },
  ),
  stop(
    "cairo-cocktail-esca-cueva",
    "ESCĀ Cueva",
    [30.0212108, 31.0515445],
    "ESCĀ Cueva brings a dramatic cave-like room, composed cocktails, and an upscale dinner menu to New Giza. It is designed as a full occasion, with reservations, dress expectations, and the western location all requiring intent.",
    {
      venueKind: "nightlife",
      nightlifeType: "cocktail_bar",
      musicGenres: ["lounge", "dj_sets"],
      price: "$$$$",
      priceSource: "Current Nawart listing and official social menu",
      attributeTags: [
        "craft_cocktails",
        "date_night",
        "reservation_recommended",
        "destination_bar",
      ],
      hours: {
        default: "Sun-Wed and Sat 4:00 PM-1:00 AM; Thu-Fri 4:00 PM-2:00 AM.",
      },
      officialUrl: "https://www.instagram.com/escacueva/",
      sourcePhoto: images.escaCueva,
      imagePage: "https://nawart-eg.com/r/esca-cueva",
      editorialUrls: [
        editorial.nightlife,
        "https://nawart-eg.com/r/esca-cueva",
      ],
    },
  ),
  stop(
    "cairo-cocktail-mexicali",
    "Mexi Cali",
    [30.01664425, 31.00105265],
    "Mexi Cali is the playful Arkan cocktail option for tequila drinks, tacos, bright interiors, and group energy. The bar favors approachable margaritas and a lively room over quiet precision, especially late in the week.",
    {
      venueKind: "nightlife",
      nightlifeType: "cocktail_bar",
      musicGenres: ["latin", "dj_sets"],
      price: "$$$",
      priceSource: "Current Nawart listing and official social menu",
      attributeTags: [
        "craft_cocktails",
        "group_friendly",
        "lively",
        "reservation_recommended",
      ],
      hours: { default: "Daily 3:00 PM-2:00 AM." },
      officialUrl: "https://www.instagram.com/mexicaliegypt/",
      sourcePhoto: images.mexicali,
      imagePage: "https://nawart-eg.com/r/mexicali",
      editorialUrls: [editorial.nightlife, "https://nawart-eg.com/r/mexicali"],
    },
  ),
  stop(
    "cairo-cocktail-aqua",
    "Aqua Rooftop Lounge",
    [30.0384068, 31.2235356],
    "Aqua crowns Sofitel El Gezirah with a backlit bar, resident DJ, and uninterrupted river views. It is a hotel rooftop with polished service and hotel pricing, but the official 2025 refurbishment sharpened both the room and the outlook.",
    {
      venueKind: "nightlife",
      nightlifeType: "rooftop_bar",
      musicGenres: ["lounge", "dj_sets"],
      price: "$$$$",
      priceSource: "Official Sofitel venue page",
      attributeTags: ["craft_cocktails", "rooftop", "nile_view", "date_night"],
      hours: {
        default:
          "Daily 6:00 PM-3:00 AM; outdoor service remains subject to weather and private-event notices on the official hotel page.",
      },
      officialUrl:
        "https://www.sofitel-cairo-nile-elgezirah.com/restaurants-bars/aqua-rooftop-lounge/",
      sourcePhoto: images.aqua,
      imagePage:
        "https://www.sofitel-cairo-nile-elgezirah.com/restaurants-bars/aqua-rooftop-lounge/",
      editorialUrls: [editorial.nightlife],
    },
  ),
  stop(
    "cairo-cocktail-estro",
    "Estro",
    [29.9582676, 31.2692085],
    "Estro sits above the Royal Maadi Hotel with Sicilian food, aperitivo drinks, and broad south-Cairo views. Daylight and sunset are the sweet spots; the glass-and-terrace room feels calmer than Cairo's louder club bars.",
    {
      venueKind: "nightlife",
      nightlifeType: "rooftop_bar",
      price: "$$$",
      priceSource: "Official social menu and current rooftop guide",
      attributeTags: ["craft_cocktails", "rooftop", "date_night", "quiet"],
      hours: { default: "Daily 9:00 AM-midnight." },
      officialUrl: "https://www.instagram.com/estro.cairo/",
      sourcePhoto: images.estro,
      imagePage:
        "https://www.therooftopguide.com/rooftop-bars-in-cairo/estro.html",
      editorialUrls: [editorial.nightlife, "https://nawart-eg.com/r/estro"],
    },
  ),
  stop(
    "cairo-cocktail-sangria",
    "Sangria",
    [30.0465969, 31.4756976],
    "Sangria is a New Cairo lounge built around Mediterranean food, mixed drinks, sculptural interiors, and a dressed-up evening crowd. The mood is social rather than purist; reserve when dinner and cocktails need to share one table.",
    {
      venueKind: "nightlife",
      nightlifeType: "cocktail_bar",
      musicGenres: ["lounge", "dj_sets"],
      price: "$$$",
      priceSource: "Current Nawart listing and map menu",
      attributeTags: [
        "craft_cocktails",
        "group_friendly",
        "date_night",
        "reservation_recommended",
      ],
      hours: { default: "Daily 6:00 PM-1:00 AM." },
      officialUrl: "https://www.instagram.com/sangriarestaurant/",
      sourcePhoto: images.sangria,
      imagePage: "https://restaurantguru.com/Sangria-Restaurant-Egypt",
      editorialUrls: [editorial.nightlife, "https://nawart-eg.com/r/sangria"],
    },
  ),
  stop(
    "cairo-cocktail-bar-oro",
    "Bar'Oro",
    [30.0458889, 31.2320351],
    "Bar'Oro is the Nile Ritz-Carlton's classic cocktail room, pairing Italian aperitivi, signature drinks, small plates, river views, and a walk-in humidor. It is formal without being a nightclub, making it a strong Downtown pre-dinner choice.",
    {
      venueKind: "nightlife",
      nightlifeType: "cocktail_bar",
      price: "$$$$",
      priceSource: "Official Ritz-Carlton dining page",
      attributeTags: ["craft_cocktails", "hotel_bar", "date_night", "quiet"],
      hours: { default: "Daily noon-1:00 AM." },
      officialUrl:
        "https://www.ritzcarlton.com/en/hotels/cairz-the-nile-ritz-carlton-cairo/dining/",
      sourcePhoto: images.barOro,
      imagePage:
        "https://www.ritzcarlton.com/en/hotels/cairz-the-nile-ritz-carlton-cairo/dining/",
      editorialUrls: [
        "https://www.ritzcarlton.com/en/hotels/cairz-the-nile-ritz-carlton-cairo/dining/",
      ],
    },
  ),
  stop(
    "cairo-cocktail-st-regis-bar",
    "The St. Regis Bar & Water Garden",
    [30.0629354, 31.2274123],
    "The St. Regis Bar uses the Pink Sun mural, polished ritual, and Water Garden setting to turn a hotel drink into a proper occasion. Come for controlled service and classic cocktails, accepting luxury-hotel prices and a quieter crowd.",
    {
      venueKind: "nightlife",
      nightlifeType: "cocktail_bar",
      price: "$$$$",
      priceSource: "Official Marriott dining page",
      attributeTags: ["craft_cocktails", "hotel_bar", "date_night", "quiet"],
      hours: {
        default:
          "Daily 5:00 PM-2:00 AM; holiday changes are published on the official Marriott dining page.",
      },
      officialUrl:
        "https://www.marriott.com/de/dining/restaurant-bar/caixr-the-st-regis-cairo/6400933-the-st-regis-bar-the-water-garden.mi",
      sourcePhoto: images.stRegisBar,
      imagePage:
        "https://www.marriott.com/de/dining/restaurant-bar/caixr-the-st-regis-cairo/6400933-the-st-regis-bar-the-water-garden.mi",
      editorialUrls: [
        "https://marriott.africa-newsroom.com/press/st-regis-hotels-heralds-a-new-beacon-of-luxury-on-the-nile-with-the-opening-of-the-st-regis-cairo?lang=en",
      ],
    },
  ),
];

const cultureStops = [
  stop(
    "cairo-culture-gem",
    "Grand Egyptian Museum",
    [29.9931986, 31.1244409],
    "The Grand Egyptian Museum finally gives the Giza plateau a collection on the same scale as the monuments, with Tutankhamun material, the Grand Staircase, conservation context, and daylight architecture. Reserve enough time; this is not a two-gallery add-on.",
    {
      venueKind: "culture",
      subcategory: "museum",
      attributeTags: ["museum", "ancient_egypt", "ticketed", "accessible"],
      hours: {
        default:
          "Galleries daily 9:00 AM-6:00 PM; the official ticket calendar publishes extended Wednesday and Saturday evenings and last-entry cutoffs.",
      },
      officialUrl: "https://gem.eg/en/visit/plan-your-visit/opening-hours/",
      bookingUrl: "https://tickets.gem.eg/",
      sourcePhoto: images.gem,
      imagePage:
        "https://commons.wikimedia.org/wiki/File:Grand_Egyptian_Museum_2025_(22928).jpg",
      imageCredit: "Amr F. Nagy / Wikimedia Commons",
      imageLicense: "CC BY-SA 4.0",
      editorialUrls: [editorial.museums],
    },
  ),
  stop(
    "cairo-culture-egyptian-museum",
    "Egyptian Museum",
    [30.0483167, 31.2336674],
    "The Egyptian Museum at Tahrir remains essential for the dense, old-school experience of Egyptian antiquities, even after major objects moved to GEM. The building rewards focus: choose a few rooms instead of treating the cases like an inventory.",
    {
      venueKind: "culture",
      subcategory: "museum",
      attributeTags: ["museum", "ancient_egypt", "ticketed", "central"],
      hours: {
        default:
          "Daily 9:00 AM-5:00 PM; ticket sales close at 4:00 PM, with holiday changes posted by the Ministry.",
      },
      officialUrl: "https://egymonuments.gov.eg/en/museums/egyptian-museum/",
      sourcePhoto: images.egyptianMuseum,
      imagePage:
        "https://commons.wikimedia.org/wiki/File:Egyptian_views;_Cairo_(Masr)._Museum_of_Cairo,_exterior_LOC_matpc.01484.jpg",
      imageCredit:
        "Matson Collection / Library of Congress via Wikimedia Commons",
      imageLicense: "Public domain",
      editorialUrls: [editorial.museums],
    },
  ),
  stop(
    "cairo-culture-nmec",
    "National Museum of Egyptian Civilization",
    [30.0085929, 31.2482393],
    "NMEC tells Egypt's story across eras rather than organizing everything by dynasty, and the Royal Mummies Hall supplies a focused counterpoint. Its Fustat location pairs naturally with Coptic Cairo, not the distant Giza museum circuit.",
    {
      venueKind: "culture",
      subcategory: "museum",
      attributeTags: ["museum", "egyptian_history", "ticketed", "accessible"],
      hours: {
        default:
          "Sat-Thu 9:00 AM-5:00 PM; Fri 9:00 AM-5:00 PM and 6:00 PM-9:00 PM, with last tickets one hour before closing.",
      },
      officialUrl: "https://nmec.gov.eg/",
      bookingUrl: "https://nmec.gov.eg/ticketing/",
      sourcePhoto: images.nmec,
      imagePage:
        "https://commons.wikimedia.org/wiki/File:NMEC-MainEntrance.jpg",
      imageCredit: "Wikimedia Commons contributor",
      imageLicense: "Creative Commons",
      editorialUrls: [
        "https://egymonuments.gov.eg/en/museums/national-museum-of-egyptian-civilization-nmec",
      ],
    },
  ),
  stop(
    "cairo-culture-coptic-museum",
    "Coptic Museum",
    [30.0057645, 31.2303972],
    "The Coptic Museum gives textiles, manuscripts, icons, carved stone, and woodwork the architectural setting they deserve inside Old Cairo. It fills the historical gap between pharaonic collections and Islamic Cairo with far less crowd pressure.",
    {
      venueKind: "culture",
      subcategory: "museum",
      attributeTags: ["museum", "coptic_art", "ticketed", "historic_district"],
      hours: {
        default:
          "Daily 9:00 AM-5:00 PM; ticket sales close at 4:00 PM, with Ramadan and holiday changes posted by the Ministry.",
      },
      officialUrl: "https://egymonuments.gov.eg/en/museums/coptic-museum/",
      sourcePhoto: images.coptic,
      imagePage:
        "https://commons.wikimedia.org/wiki/File:Coptic_Museum_in_Cairo.jpg",
      imageCredit: "Wikimedia Commons contributor",
      imageLicense: "Creative Commons",
      editorialUrls: [
        "https://egymonuments.gov.eg/media/8975/the-coptic-museum-en.pdf",
      ],
    },
  ),
  stop(
    "cairo-culture-islamic-art",
    "Museum of Islamic Art",
    [30.0446671, 31.2526837],
    "The Museum of Islamic Art makes metalwork, ceramics, manuscripts, textiles, glass, and architectural fragments legible beyond monument façades. Its Bab al-Khalq position is ideal before walking toward Al-Muizz, but the collection merits its own unhurried block.",
    {
      venueKind: "culture",
      subcategory: "museum",
      attributeTags: ["museum", "islamic_art", "ticketed", "central"],
      hours: {
        default:
          "Daily 9:00 AM-5:00 PM; ticket sales close at 4:00 PM, with official notices controlling holiday exceptions.",
      },
      officialUrl:
        "https://egymonuments.gov.eg/en/museums/museum-of-islamic-art/",
      sourcePhoto: images.islamicArt,
      imagePage:
        "https://commons.wikimedia.org/wiki/File:Museum_of_Islamic_Art,_Cairo.jpg",
      imageCredit: "Wikimedia Commons contributor",
      imageLicense: "Creative Commons",
      editorialUrls: [editorial.museums],
    },
  ),
  stop(
    "cairo-culture-gayer-anderson",
    "Gayer-Anderson Museum",
    [30.0283434, 31.2508152],
    "Gayer-Anderson links two Ottoman-era houses through courtyards, mashrabiya screens, domestic rooms, and an idiosyncratic collector's eye beside Ibn Tulun Mosque. Tight passages and layered interiors reward a guide or patient looking.",
    {
      venueKind: "culture",
      subcategory: "historic_house_museum",
      attributeTags: ["museum", "historic_house", "architecture", "ticketed"],
      hours: {
        default:
          "Daily 9:00 AM-5:00 PM; last tickets at 4:00 PM. Ramadan hours are 9:00 AM-3:00 PM unless the Ministry posts a new schedule.",
      },
      officialUrl:
        "https://egymonuments.gov.eg/en/museums/gayer-anderson-museum/",
      sourcePhoto: images.gayerAnderson,
      imagePage:
        "https://commons.wikimedia.org/wiki/File:Gayer-Anderson_Museum,_Cairo_02.jpg",
      imageCredit: "Wikimedia Commons contributor",
      imageLicense: "Creative Commons",
      editorialUrls: [editorial.museums],
    },
  ),
  stop(
    "cairo-culture-manial",
    "Manial Palace Museum",
    [30.0288053, 31.2299201],
    "Manial Palace combines Ottoman, Mamluk, Persian, and European references inside Prince Muhammad Ali's residence and gardens on Rawda Island. The interiors are ornate enough to overwhelm, so alternate rooms with the planted courtyards.",
    {
      venueKind: "culture",
      subcategory: "palace_museum",
      attributeTags: ["museum", "palace", "garden", "ticketed"],
      hours: {
        default:
          "Daily 9:00 AM-5:00 PM; last tickets at 4:00 PM, with official holiday notices controlling exceptions.",
      },
      officialUrl:
        "https://egymonuments.gov.eg/en/subportals-group/manial-palace-museum/manial-palace-1-visit/",
      sourcePhoto: images.manial,
      imagePage:
        "https://commons.wikimedia.org/wiki/File:Garden_of_Manial_Palace_and_Museum.jpg",
      imageCredit: "Wikimedia Commons contributor",
      imageLicense: "Creative Commons",
      editorialUrls: [editorial.museums],
    },
  ),
  stop(
    "cairo-culture-abdeen",
    "Abdeen Palace Museums",
    [30.0432125, 31.2472031],
    "Abdeen Palace's museum rooms concentrate royal silver, arms, documents, and presidential gifts inside a working state complex. Security closures are possible, so the official presidency page matters more here than a fixed sightseeing assumption.",
    {
      venueKind: "culture",
      subcategory: "palace_museum",
      attributeTags: [
        "museum",
        "palace",
        "modern_history",
        "security_controlled",
      ],
      hours: {
        default:
          "Visitor sessions are published on the official page for Abdeen Palace Museums; state ceremonies and security requirements can suspend public access on named dates.",
      },
      officialUrl:
        "https://www.presidency.eg/en/%D8%A7%D9%84%D9%85%D8%AA%D8%A7%D8%AD%D9%81/%D9%85%D8%AA%D8%A7%D8%AD%D9%81-%D9%82%D8%B5%D8%B1-%D8%B9%D8%A7%D8%A8%D8%AF%D9%8A%D9%86/",
      sourcePhoto: images.abdeen,
      imagePage: "https://commons.wikimedia.org/wiki/File:Abdeen_Palace.jpg",
      imageCredit: "Wikimedia Commons contributor",
      imageLicense: "Creative Commons",
      editorialUrls: [editorial.museums],
    },
  ),
  stop(
    "cairo-culture-citadel",
    "Salah El-Din Citadel",
    [30.0287457, 31.2597144],
    "The Citadel layers Ayyubid fortification, Ottoman and Mamluk buildings, museums, the Muhammad Ali Mosque, and a commanding city view. The complex is large and exposed; morning light and realistic walking time improve it enormously.",
    {
      venueKind: "culture",
      subcategory: "historic_site",
      attributeTags: ["fortress", "architecture", "viewpoint", "ticketed"],
      hours: {
        default:
          "Daily 8:00 AM-5:00 PM; last admission and seasonal changes follow the official Ministry ticket schedule.",
      },
      officialUrl:
        "https://egymonuments.gov.eg/en/archaeological-sites/salah-al-din-al-ayyubi-citadel/",
      sourcePhoto: images.citadel,
      imagePage:
        "https://commons.wikimedia.org/wiki/File:Flickr_-_HuTect_ShOts_-_Citadel_of_Salah_El.Din_and_Masjid_Muhammad_Ali_-_Cairo_-_Egypt_-_17_04_2010_(4).jpg",
      imageCredit: "HuTect ShOts via Wikimedia Commons",
      imageLicense: "Creative Commons",
      editorialUrls: [editorial.historicalCairo],
    },
  ),
  stop(
    "cairo-culture-modern-art",
    "Museum of Modern Egyptian Art",
    [30.0434432, 31.2248025],
    "The Museum of Modern Egyptian Art on Gezira Island broadens Cairo's museum day beyond antiquity through twentieth-century and contemporary Egyptian work. Exhibition access has changed over time, so confirm the active galleries before crossing the river.",
    {
      venueKind: "culture",
      subcategory: "art_museum",
      attributeTags: ["museum", "modern_art", "egyptian_art", "central"],
      hours: {
        default:
          "Gallery days, exhibition access, and any temporary closure are published on the official exhibition page maintained through the Ministry of Culture and Cairo Opera House.",
      },
      officialUrl: "https://www.cairoopera.org/",
      sourcePhoto: images.modernArt,
      imagePage:
        "https://commons.wikimedia.org/wiki/File:Cairo_ModernArts_byDanielCsorfoly.JPG",
      imageCredit: "Daniel Csörföly / Wikimedia Commons",
      imageLicense: "Creative Commons",
      editorialUrls: [editorial.museums],
    },
  ),
];

const activityStops = [
  stop(
    "cairo-activity-giza",
    "Giza Pyramids and Sphinx",
    [29.97693485, 31.1326511],
    "The Giza plateau is a full archaeological landscape rather than one pyramid photo: Khufu, Khafre, Menkaure, queens' pyramids, causeways, tombs, and the Sphinx. Start early, use official tickets, and decide before arrival whether any pyramid interior is worth the heat.",
    {
      venueKind: "landmark",
      subcategory: "archaeological_site",
      attributeTags: ["ancient_egypt", "ticketed", "landmark", "outdoors"],
      hours: {
        default:
          "Daily 7:00 AM-5:00 PM; the Great Pyramid interior closes noon-1:00 PM, and last ticket times follow the official Ministry schedule.",
      },
      officialUrl:
        "https://egymonuments.gov.eg/en/archaeological-sites/giza-plateau/",
      bookingUrl: "https://egymonuments.com/locations/details/giza-pyramids",
      sourcePhoto: images.pyramids,
      imagePage:
        "https://egymonuments.gov.eg/en/archaeological-sites/giza-plateau/",
      editorialUrls: [editorial.monumentTickets],
    },
  ),
  stop(
    "cairo-activity-gem",
    "Grand Egyptian Museum",
    [29.9931986, 31.1244409],
    "GEM works best as the climate-controlled second half of a Giza day, turning objects, conservation, and royal collections into context after the plateau's monumental scale. Book a timed slot and resist trying to see every case.",
    {
      venueKind: "culture",
      subcategory: "museum",
      attributeTags: ["museum", "ancient_egypt", "ticketed", "accessible"],
      hours: {
        default:
          "Galleries daily 9:00 AM-6:00 PM; the official ticket calendar publishes extended Wednesday and Saturday evenings and last-entry cutoffs.",
      },
      officialUrl: "https://gem.eg/en/visit/plan-your-visit/opening-hours/",
      bookingUrl: "https://tickets.gem.eg/",
      sourcePhoto: images.gem,
      imagePage:
        "https://commons.wikimedia.org/wiki/File:Grand_Egyptian_Museum_2025_(22928).jpg",
      imageCredit: "Amr F. Nagy / Wikimedia Commons",
      imageLicense: "CC BY-SA 4.0",
      editorialUrls: [editorial.museums],
    },
  ),
  stop(
    "cairo-activity-egyptian-museum",
    "Egyptian Museum",
    [30.0483167, 31.2336674],
    "The Egyptian Museum remains the most atmospheric central collection, with dense cases and historic galleries that reward selective attention. Pair it with Tahrir and Downtown rather than forcing it into the already demanding Giza day.",
    {
      venueKind: "culture",
      subcategory: "museum",
      attributeTags: ["museum", "ancient_egypt", "ticketed", "central"],
      hours: {
        default:
          "Daily 9:00 AM-5:00 PM; ticket sales close at 4:00 PM, with holiday changes posted by the Ministry.",
      },
      officialUrl: "https://egymonuments.gov.eg/en/museums/egyptian-museum/",
      sourcePhoto: images.egyptianMuseum,
      imagePage:
        "https://commons.wikimedia.org/wiki/File:Egyptian_views;_Cairo_(Masr)._Museum_of_Cairo,_exterior_LOC_matpc.01484.jpg",
      editorialUrls: [editorial.museums],
    },
  ),
  stop(
    "cairo-activity-khan",
    "Khan el-Khalili",
    [30.0477386, 31.2622538],
    "Khan el-Khalili is a working market district of metalware, textiles, perfume, souvenirs, cafés, and compressed pedestrian life. Walk beyond the first souvenir lanes, bargain respectfully, and use Al-Muizz as the architectural spine instead of wandering without bearings.",
    {
      venueKind: "retail",
      subcategory: "market",
      attributeTags: ["market", "shopping", "historic_district", "free_entry"],
      hours: {
        default:
          "Market lanes remain publicly accessible, while most shops trade daily about 9:00 AM-11:00 PM; Friday prayers and individual merchants create exact exceptions.",
      },
      officialUrl: editorial.historicalCairo,
      sourcePhoto: images.khan,
      imagePage:
        "https://commons.wikimedia.org/wiki/File:Khan_el-Khalili,_Cairo_Egypt_-_panoramio_(6).jpg",
      imageCredit: "The Erica Chang via Wikimedia Commons",
      imageLicense: "CC BY 3.0",
      editorialUrls: [editorial.historicalCairo],
    },
  ),
  stop(
    "cairo-activity-muizz",
    "Al-Muizz Street",
    [30.0509306, 31.2615748],
    "Al-Muizz Street turns Fatimid, Mamluk, and Ottoman Cairo into a walkable sequence of mosques, madrasas, sabils, palaces, and markets. Buy the monument-complex ticket early enough to enter interiors before the evening street crowd takes over.",
    {
      venueKind: "landmark",
      subcategory: "historic_district",
      attributeTags: [
        "architecture",
        "walking",
        "historic_district",
        "ticketed_sites",
      ],
      hours: {
        default:
          "Street access is continuous; the ticketed monument complex opens daily 9:00 AM-5:00 PM, with last entry controlled by the official Ministry schedule.",
      },
      officialUrl: editorial.historicalCairo,
      sourcePhoto: images.muizz,
      imagePage: "https://egypttoursgroup.com/al-muizz-street/",
      editorialUrls: [editorial.historicalCairo, editorial.monumentTickets],
    },
  ),
  stop(
    "cairo-activity-citadel",
    "Salah El-Din Citadel",
    [30.0287457, 31.2597144],
    "The Citadel gives Cairo one of its strongest panoramic and architectural half-days through fortifications, mosques, museums, and exposed courtyards. Begin early, carry water, and leave enough time for the Muhammad Ali Mosque beyond the viewpoint.",
    {
      venueKind: "landmark",
      subcategory: "historic_site",
      attributeTags: ["fortress", "architecture", "viewpoint", "ticketed"],
      hours: {
        default:
          "Daily 8:00 AM-5:00 PM; last admission and seasonal changes follow the official Ministry ticket schedule.",
      },
      officialUrl:
        "https://egymonuments.gov.eg/en/archaeological-sites/salah-al-din-al-ayyubi-citadel/",
      sourcePhoto: images.citadel,
      imagePage:
        "https://commons.wikimedia.org/wiki/File:Flickr_-_HuTect_ShOts_-_Citadel_of_Salah_El.Din_and_Masjid_Muhammad_Ali_-_Cairo_-_Egypt_-_17_04_2010_(4).jpg",
      editorialUrls: [editorial.historicalCairo],
    },
  ),
  stop(
    "cairo-activity-nmec",
    "National Museum of Egyptian Civilization",
    [30.0085929, 31.2482393],
    "NMEC's chronological sweep and Royal Mummies Hall give first-time visitors a coherent national story without the Egyptian Museum's density. Build it into a Fustat and Coptic Cairo route to avoid losing time in cross-city traffic.",
    {
      venueKind: "culture",
      subcategory: "museum",
      attributeTags: ["museum", "egyptian_history", "ticketed", "accessible"],
      hours: {
        default:
          "Sat-Thu 9:00 AM-5:00 PM; Fri 9:00 AM-5:00 PM and 6:00 PM-9:00 PM, with last tickets one hour before closing.",
      },
      officialUrl: "https://nmec.gov.eg/",
      bookingUrl: "https://nmec.gov.eg/ticketing/",
      sourcePhoto: images.nmec,
      imagePage:
        "https://commons.wikimedia.org/wiki/File:NMEC-MainEntrance.jpg",
      editorialUrls: [
        "https://egymonuments.gov.eg/en/museums/national-museum-of-egyptian-civilization-nmec",
      ],
    },
  ),
  stop(
    "cairo-activity-coptic-cairo",
    "Coptic Cairo",
    [30.0057645, 31.2303972],
    "Coptic Cairo layers the Hanging Church, Saint Sergius and Bacchus, Ben Ezra Synagogue, Roman fortress remains, and the Coptic Museum into a compact walking district. Religious services and security checks mean each doorway keeps its own rhythm.",
    {
      venueKind: "landmark",
      subcategory: "historic_district",
      attributeTags: [
        "religious_history",
        "walking",
        "historic_district",
        "architecture",
      ],
      hours: {
        default:
          "District lanes are publicly accessible; the Coptic Museum opens daily 9:00 AM-5:00 PM, while churches and the synagogue follow their own worship and security schedules.",
      },
      officialUrl: "https://egymonuments.gov.eg/en/museums/coptic-museum/",
      sourcePhoto: images.coptic,
      imagePage:
        "https://commons.wikimedia.org/wiki/File:Coptic_Museum_in_Cairo.jpg",
      editorialUrls: [
        "https://egymonuments.gov.eg/media/8975/the-coptic-museum-en.pdf",
      ],
    },
  ),
  stop(
    "cairo-activity-azhar-park",
    "Al-Azhar Park",
    [30.0414258, 31.2655811],
    "Al-Azhar Park gives Islamic Cairo breathing room through formal gardens, lawns, fountains, restaurants, and Citadel views from reclaimed high ground. Late afternoon brings better light and cooler paths, while weekends draw a larger family crowd.",
    {
      venueKind: "outdoors",
      subcategory: "urban_park",
      attributeTags: ["park", "viewpoint", "family_friendly", "ticketed"],
      hours: {
        default:
          "Daily 9:00 AM-10:00 PM according to the current 2026 visitor notice; ticket prices differ between weekdays and weekends.",
      },
      officialUrl:
        "https://the.akdn/en/how-we-work/our-agencies/aga-khan-trust-culture/akhs/egypt/al-azhar-park-cairo",
      sourcePhoto: images.azharPark,
      imagePage:
        "https://www.cairo360.com/ar/article/%D8%A7%D9%84%D8%AD%D9%8A%D8%A7%D8%A9-%D9%81%D9%8A-%D9%83%D8%A7%D9%8A%D8%B1%D9%88/eid-fitr-2026-best-places-cairo/",
      editorialUrls: [editorial.historicalCairo],
    },
  ),
  stop(
    "cairo-activity-ibn-tulun",
    "Mosque of Ibn Tulun",
    [30.0288198, 31.2495214],
    "Ibn Tulun is Cairo's great open courtyard mosque, with spare Abbasid geometry, a spiral minaret, and enough space to understand the building as architecture. Dress respectfully, avoid prayer disruption, and pair it with Gayer-Anderson next door.",
    {
      venueKind: "landmark",
      subcategory: "mosque",
      attributeTags: [
        "architecture",
        "religious_site",
        "historic",
        "free_entry",
      ],
      hours: {
        default:
          "Daily visitor access generally 8:00 AM-5:00 PM; Friday prayers and the mosque's official worship schedule temporarily limit non-worship visits.",
      },
      officialUrl:
        "https://egymonuments.gov.eg/en/monuments/the-mosque-of-ahmad-ibn-tulun/",
      sourcePhoto: images.ibnTulun,
      imagePage:
        "https://commons.wikimedia.org/wiki/File:Entrance_to_the_Mosque_of_Ibn_Tulun,_Cairo,_876-79_(11).jpg",
      imageCredit: "Prof. Mortel via Wikimedia Commons",
      imageLicense: "Creative Commons",
      editorialUrls: [editorial.historicalCairo],
    },
  ),
];

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
    url: maps(`${title} Cairo Egypt`),
    category,
    location: cairoLocation,
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

export const cairoCitywideGuides: MapList[] = [
  guide(
    "Food",
    "list-cairo-citywide-dining",
    "cairo-best-restaurants-citywide",
    "best-restaurants",
    "Cairo Restaurants Worth Crossing the City For",
    "A citywide Cairo dining guide that balances contemporary Egyptian cooking, Armenian and Nikkei rooms, long-lived Zamalek institutions, and destination dinners in New Cairo and Sheikh Zayed.",
    diningStops,
    sources.dining,
    "Best Restaurants in Cairo for Egyptian, Japanese, Italian, and Mediterranean Dining",
    "Source-backed Cairo restaurant guide to Khufu's, Almería, Mayrig, Barranco, Reif, Crimson, and other destination tables.",
  ),
  guide(
    "Food",
    "list-cairo-citywide-cheap-eats",
    "cairo-best-cheap-eats-citywide",
    "best-cheap-eats",
    "Koshary, Hawawshi, Grills, and Cairo Value",
    "A practical Cairo value guide for koshary, hawawshi, pigeon, shawarma, Egyptian home cooking, and fast breakfasts, with real hours and cross-city location tradeoffs.",
    cheapEatStops,
    sources.cheapEats,
    "Best Cheap Eats in Cairo for Koshary, Hawawshi, Grills, and Street Food",
    "Current Cairo cheap-eats guide with Abou Tarek, Fasahet Somaya, Zooba, Sobhy Kaber, Farahat, and local sandwich counters.",
  ),
  guide(
    "Stay",
    "list-cairo-citywide-hotels",
    "cairo-best-hotels-citywide",
    "best-hotels",
    "Hotels for Pyramids, Nile Views, and Central Logistics",
    "This hotel-only Cairo guide compares Giza monument access, Garden City service, Downtown convenience, Zamalek gardens, and north-corniche resort facilities.",
    hotelStops,
    sources.hotels,
    "Best Hotels in Cairo for the Pyramids, Nile Views, Downtown, and Zamalek",
    "Hotel-only Cairo stay guide with ten official booking links, arrival windows, facilities, and neighborhood tradeoffs.",
  ),
  guide(
    "Stay",
    "list-cairo-citywide-hostels",
    "cairo-best-hostels-citywide",
    "best-hostels",
    "Hostels for Downtown Access and Social Beds",
    "A hostel-only Cairo guide for dorms, private rooms, social lounges, quieter Zamalek stays, Tahrir access, and realistic late-arrival planning.",
    hostelStops,
    sources.hostels,
    "Best Hostels in Cairo for Dorms, Private Rooms, Solo Travel, and Downtown Access",
    "Current Cairo hostel guide with ten live Hostelworld property pages, check-in windows, dorm evidence, and practical tradeoffs.",
  ),
  guide(
    "Nightlife",
    "list-cairo-citywide-casual-bars",
    "cairo-best-casual-bars-citywide",
    "best-dive-bars",
    "Old Pubs, Beer Terraces & Downtown Rooms",
    "Cairo's dive-bar equivalents run from old Zamalek pubs and Downtown beer halls to sports bars and event-led live rooms where cold beer and regular crowds outweigh presentation.",
    casualBarStops,
    sources.casualBars,
    "Best Dive Bars in Cairo for Pubs, Beer, and Live Music",
    "Ten source-backed Cairo dive bars and no-frills pubs with current event dependencies, official pages, and map evidence.",
  ),
  guide(
    "Nightlife",
    "list-cairo-citywide-cocktail-bars",
    "cairo-best-cocktail-bars-citywide",
    "best-cocktail-bars",
    "Cocktails With Nile Views and Real Rooms",
    "Cairo cocktails across Zamalek rooftops, Maadi neighborhood bars, New Giza occasion rooms, New Cairo lounges, and two polished hotel classics.",
    cocktailStops,
    sources.cocktails,
    "Best Cocktail Bars in Cairo for Rooftops, Hotel Bars, and Late Drinks",
    "Source-backed Cairo cocktail guide to Crimson, ESCĀ Cueva, Aqua, Estro, Bar'Oro, The St. Regis Bar, and more.",
  ),
  guide(
    "Culture",
    "list-cairo-citywide-culture",
    "cairo-best-culture-citywide",
    "best-culture",
    "Museums and Monuments Across Cairo's Eras",
    "Cairo culture from the Grand Egyptian Museum and Tahrir collections through Coptic and Islamic art, Ottoman houses, royal palaces, modern Egyptian work, and the Citadel.",
    cultureStops,
    sources.culture,
    "Best Culture in Cairo for Museums, Palaces, Islamic Art, and Egyptian History",
    "Official-source Cairo culture guide with museum hours, licensed images, map evidence, and ten collection-rich stops.",
  ),
  guide(
    "Activities",
    "list-cairo-top-things-to-do",
    "cairo-best-things-to-do-citywide",
    "best-things-to-do",
    "The Strong Cairo First-Timer Route",
    "A 10-stop Cairo things-to-do guide that paces Giza's monuments and museums with Downtown collections, Islamic Cairo, Coptic history, a sunset park, markets, and major mosque architecture.",
    activityStops,
    sources.activities,
    "Best Things to Do in Cairo for Pyramids, Museums, Markets, Mosques, and Parks",
    "Top Cairo activities with official ticketing, exact schedule dependencies, map evidence, and route-useful planning notes.",
  ),
];
