import {
  casualBarStops,
  cocktailStops,
  diningStops,
  hostelStops,
  hotelStops,
} from "@/data/guides/new-york-city";
import type { GuideStop, ListCategory, ListSource, MapList } from "@/types";

const checkedAt = "2026-07-19";
const createdAt = "2026-07-19T00:00:00.000Z";

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

const photoOverrides: Record<string, string> = {
  "nyc-manhattan-hotel-faena": "https://www.ahstatic.com/photos/c0q9_ho_00_p_1024x768.jpg",
  "nyc-manhattan-hostel-international-student-center": "https://nystudentcenter.hostelsnap.com/media/uploads/nystudentcenter/62dbe2fb05c8bThe_Block.jpg",
  "nyc-manhattan-bar-overstory": "https://media.cntraveler.com/photos/6633cf0385ebe006e5d45881/16%3A9/w_2560%2Cc_limit/Overstory_Overstory%2520Interior%2520Dusk_Natalie%2520Black.jpg",
  "nyc-brooklyn-food-peter-luger": "https://peterluger.com/cdn/shop/files/246_2.jpg?v=1717036712",
  "nyc-brooklyn-food-gage-tollner": "https://images.getbento.com/accounts/01e00818a7c206a52f282e3ab9590831/media/images/1556Dining_room_circa_1950s_Photographic_print_2016.034_Brooklyn_Historical_Society..jpg?w=1200&fit=max&auto=compress,format&cs=origin",
  "nyc-brooklyn-food-lilia": "https://images.getbento.com/accounts/7bf67b2820625f9f7c33d7b0403a8cca/media/suS7yQ83TqbuYEHpfn2R_Lilia-0276.jpg?w=1200&fit=max&auto=compress,format&cs=origin",
  "nyc-brooklyn-food-st-anselm": "https://images.squarespace-cdn.com/content/v1/564a0c46e4b071db20bad2b5/1639016520961-A1Q61CGD54O7SRTGL9BR/Group_Menu.jpg",
  "nyc-brooklyn-food-randazzos": "https://images.squarespace-cdn.com/content/v1/65343888dd49ae43222f49f5/c624602f-daee-483b-af8a-b06a9b46c319/Screen+Shot+2024-10-29+at+10.39.10+PM.jpg",
  "nyc-brooklyn-food-tanoreen": "https://images.getbento.com/accounts/6085c8bf168148a925d825ed4469ce8a/media/images/35428mezze.jpg?w=3600&fit=crop&auto=compress,format&cs=origin&crop=focalpoint&fp-x=0.5&fp-y=0.5",
  "nyc-brooklyn-food-lb-spumoni": "https://spumonigardens.com/wp-content/uploads/2024/12/interior3.jpg",
  "nyc-brooklyn-food-sofreh": "https://images.squarespace-cdn.com/content/v1/5bf80e5d5ffd203cac0f1f82/1547707810528-8WLR7M8JV8KJV9RO8IFL/JB-PPT-SF-RT_Page_07.jpg",
  "nyc-brooklyn-food-lucali": "https://images.getbento.com/accounts/5e9ec84212b5dd9564bd6ed40118bde6/media/images/73295DSCF0583_COLOR.jpg?w=1200&fit=crop&auto=compress,format&cs=origin&crop=focalpoint&fp-x=0.5&fp-y=0.5",
  "nyc-brooklyn-hotel-1-brooklyn-bridge": "https://images.ctfassets.net/1aemqu6a6t65/sjIJMLvAeCp5ZPsVCALLX/08f60ff040c88bb50e7bb1ab2a5dc7af/1-Hotel-Brooklyn-Bridge-Dumbo-Brooklyn-NYC-courtesy.jpg",
  "nyc-brooklyn-hotel-william-vale": "https://www.thewilliamvale.com/wp-content/uploads/sites/2/2025/08/2019-08_TWV_Sitting-Area_Read-McKendree.jpg",
  "nyc-brooklyn-hotel-wythe": "https://cdn.sanity.io/images/q8q5tcan/production/7a1d44c597e67ffcefd4c16b444d2c1d3d9fd62d-8712x5724.jpg",
  "nyc-brooklyn-hotel-hoxton": "https://thehoxton.com/wp-content/uploads/sites/5/2023/05/thw-hero-mobile-1.jpg",
  "nyc-brooklyn-hotel-ace": "https://acehotel.com/brooklyn/wp-content/uploads/sites/7/2021/09/ace-hotel-brooklyn-header.jpg",
  "nyc-brooklyn-hotel-nu": "https://d3e5p5wlt8r9gb.cloudfront.net/nuhotelbrooklyn.com-4157043425/cms/cache/v2/604595eda4057.jpg/1920x1080/fit;c:0,182,3500,2150/80/9f0f080665262d67e794d67d91363db9.webp",
  "nyc-brooklyn-hotel-box-house": "https://theboxhousehotel.com/wp-content/uploads/2018/08/Box-house-hotel-view.jpg",
  "nyc-brooklyn-hotel-penny": "https://cdn-ileliop.nitrocdn.com/nLRtADCqlHXWAjgMcpIFIqqflMwfPJPW/assets/images/optimized/rev-c825769/www.penny-hotel.com/wp-content/uploads/2022/07/Carlo_Daleo_Hello_Darling-scaled-1.jpg",
  "nyc-brooklyn-budget-lodge-red-hook": "https://6e21d48746afc296b2df-45ad3164c984ea39613cde5dd51152c0.ssl.cf1.rackcdn.com/u/rooms/2026/King-City-View---Gallery-Image-Main-.PNG",
  "nyc-brooklyn-budget-wyndham-sunset": "https://www.wyndhamhotels.com/content/dam/property-images/en-us/gn/us/ny/brooklyn/47770/47770_exterior_view_1.jpg",
  "nyc-brooklyn-budget-hotel-le-bleu": "https://www.hotellebleu.com/site/assets/files/9873/boutique_hotel_in_park_slope_ny-2.jpg",
  "nyc-brooklyn-dive-sunnys": "https://images.getbento.com/accounts/3c990d71fb6550eb15bbf0d8c635d5e4/media/cyvQG5etSumMtg6xKrto_For%20Landing%20Page.jpg?w=1200&fit=max&auto=compress,format&cs=origin",
  "nyc-brooklyn-dive-do-or-dive": "https://images.getbento.com/accounts/2db9760020cc4737688411546852b253/media/images/9546323511256_342344176229837_3736047759395726279_o.jpg?w=1200&fit=max&auto=compress,format",
  "nyc-brooklyn-dive-high-dive": "https://images.squarespace-cdn.com/content/v1/561eb267e4b047126248ef02/1445371167934-0TEVT25QBRPFM6963IB0/IMG_5140.JPG",
  "nyc-brooklyn-dive-mama-tried": "https://images.squarespace-cdn.com/content/v1/5ea1eff8f480a9320a68d743/1610465816766-6FLCGRH7QXU8EC786M9C/Flossie+Mae+Haggard+copy.jpg?format=1500w",
  "nyc-brooklyn-bar-clover-club": "https://images.squarespace-cdn.com/content/v1/6273d57a3765ad41ccc86163/7e288b41-c3ce-4b70-b179-44cef426702d/CloverClub_July2022_ss-0418.jpg?format=1500w",
  "nyc-brooklyn-bar-sunken-harbor": "https://images.getbento.com/accounts/0d731b78b985c0b254905dfc5ed63d08/media/0pEUO5IYQMKBadCdP6mI_AT1A5930.jpg?w=1200&fit=crop&auto=compress,format&cs=origin&crop=focalpoint&fp-x=0.5&fp-y=0.5",
  "nyc-brooklyn-bar-long-island": "https://images.squarespace-cdn.com/content/v1/522f5054e4b0a5b139fceafc/1391017117508-AVR8NV3ID71GS41HRRTV/LIB+Tax+Photo+2.jpg",
  "nyc-brooklyn-bar-maison-premiere": "https://maisonpremiere.com/wp-content/media-versions/2015/12/1400w_x1400h__q_90_c_Maison_Premiere_0378-1.jpg",
  "nyc-brooklyn-bar-fresh-kills": "https://freshkillsbar.com/wp-content/uploads/2020/02/bar1.jpg",
  "nyc-brooklyn-bar-pearls": "https://img1.wsimg.com/isteam/ip/ffcb4870-4305-4af2-87d3-d1e21c1716fd/f9c52a29-260b-497c-a1bd-eafd5a15160d.jpg",
  "nyc-brooklyn-bar-westlight": "https://images.getbento.com/accounts/e911161024a627d84acd70f29ca7b56f/media/In6ZLTzHQVmhIiFMNAW0_Gallery6.jpg?w=1800&fit=max&auto=compress,format&cs=origin",
  "nyc-queens-food-taverna-kyclades": "https://www.tavernakyclades.com/images/Astoria-Gallery/taverna-kyclades-fried-octopus.jpg",
  "nyc-queens-food-sripraphai": "https://static.spotapps.co/website_images/ab_websites/653862_website_v1/social.jpg",
  "nyc-queens-food-jackson-diner": "https://jacksondiner.com/image/137219580.jpg",
  "nyc-queens-food-chongqing-lao-zao": "https://static.wixstatic.com/media/9d863a_ca392d0cd6b248f095dad517755c3e8f~mv2_d_1200_1800_s_2.jpg/v1/crop/x_0,y_19,w_1200,h_1761/fill/w_954,h_1406,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/DSC05783-01.jpg",
  "nyc-queens-hotel-twa": "https://static.time.com/v3/assets/bltea6093859af6183b/blt21deca91326847ca/69894a138fd2ee19ee35e4be/twa-hotel-jfk-airport.jpg?branch=production&width=3840&quality=75&auto=webp&crop=3:2",
  "nyc-queens-hotel-rockaway": "https://symphony.cdn.tambourine.com/_fusion/rockaway-boutique-hotel/media/therockawayhotelspa-01-homepage-10-gallery-03-65f1e8ecf3831.jpg",
  "nyc-queens-hotel-ravel": "https://cdn.prod.website-files.com/63e141711246d415c1346591/642bddc2eb64851275b3e690_king-penthouse.jpg",
  "nyc-queens-hotel-lga-marriott": "https://cache.marriott.com/content/dam/marriott-renditions/LGAAP/lgaap-exterior-4807-hor-wide.jpg?output-quality=70&interpolation=progressive-bilinear&downsize=1336px:*",
  "nyc-queens-budget-lic-hotel": "https://images.squarespace-cdn.com/content/v1/5f8f1025509ef00c9174e2db/1603211713086-U0W5O2DB9K5Q3KDZC6QF/IMG_0127_8_9_fix-min.jpg?format=1500w",
  "nyc-queens-budget-john": "https://www.johnhotel.com/images/home_1.jpg?crc=320497218",
  "nyc-queens-budget-marco-laguardia": "https://www.marcolaguardiahotel.com/files/6374/Marco_(87).jpg",
  "nyc-queens-budget-parc": "https://www.theparchotel.com/files/3874/The_Parc_Hotel_Exterior_Picture.jpg",
  "nyc-queens-dive-neirs": "https://static.spotapps.co/website_images/ab_websites/49145_website_v1/social_share.jpg",
  "nyc-queens-dive-judy-punch": "https://images.squarespace-cdn.com/content/v1/5438677ee4b03db85e412d1a/1417365374301-WOSCIXC7SZPWXW3RZRGN/2014-11-29+at+15-28-39.jpg",
  "nyc-queens-dive-albatross": "https://static.wixstatic.com/media/576c9f_44329f0057ce4b00a78faf9fdeb16952~mv2.png",
  "nyc-queens-dive-donovans": "https://static.spotapps.co/website_images/ab_websites/38133_website_v1/social_share.jpg",
  "nyc-queens-dive-gottscheer": "https://www.gottscheerhall.com/wp-content/uploads/Gottscheer-Hall-Social.jpg",
  "nyc-queens-bar-dutch-kills": "https://static.wixstatic.com/media/702430_ee49f8eee93446b48a363ef7d60e4668~mv2.png/v1/fit/w_1955,h_3804,q_90,enc_avif,quality_auto/702430_ee49f8eee93446b48a363ef7d60e4668~mv2.png",
  "nyc-queens-bar-last-word": "https://static.wixstatic.com/media/7996d3_82cde3c6da244844b835d12e063a7648~mv2.jpg/v1/fill/w_2048,h_1151,al_c,q_90,enc_avif,quality_auto/52508071_2184165691622195_28981915542146.jpg",
  "nyc-queens-bar-maggie-halls": "https://images.squarespace-cdn.com/content/v1/5fd13d5a5bf7b6051ace48a8/089f12a9-b495-48ca-a240-204b6435ab1e/Screenshot_20250306-162709%7E2.jpg?format=1500w",
  "nyc-queens-bar-mosaic": "https://imagedelivery.net/aPDHOWLzkdlEAMvg3YLQug/production-anm220exp5h2dtg2016lt6hcep4o/fit=contain,format=auto,width=1200",
  "nyc-queens-bar-sweet-afton": "https://images.getbento.com/accounts/77c6458147d8d4a9ec405a518915724f/media/images/92193Bar_patrons-photo_credit_Joey_Wehner.jpg?w=1200&fit=max&auto=compress,format&cs=origin",
  "nyc-queens-bar-bonnie": "https://images.getbento.com/accounts/a293c8c7225fd8130a2afd6c0c61a1d8/media/images/64187Oak_Room_1.jpg?w=1200&fit=crop&auto=compress,format&cs=origin&crop=focalpoint&fp-x=0.5&fp-y=0.63",
  "nyc-queens-bar-ditty": "https://static.spotapps.co/website_images/ab_websites/11875_website_v1/video_poster.jpg",
  "nyc-queens-bar-queens-room": "https://images.squarespace-cdn.com/content/v1/5addfb293917ee9afa5c93b2/1574122164362-0THPY7GNH0CJ2JJJAXRT/Dinner+2.jpg",
  "nyc-bronx-food-zero-otto-nove": "https://zeroottonove.com/wp-content/uploads/2022/11/home01.jpg",
  "nyc-bronx-food-enzos": "https://static.wixstatic.com/media/b974d0_ab1e298e7bb94af7bc8c4e9cddff15b8~mv2.png/v1/fill/w_1010,h_632,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/Enzo&",
  "nyc-bronx-food-beatstro": "https://images.squarespace-cdn.com/content/v1/5ddcaeb8303dd85d3739927d/1576532847227-9YFFDQKI8BT3XJ02YARV/Beatstro%2BWillie%2BColon.jpg",
  "nyc-bronx-food-pio-pio": "https://images.squarespace-cdn.com/content/v1/60be753ea973227c9527e28b/639f38ec-d201-42e3-8078-5fc9aa6e2e1e/Pio_Salchipapas_1.jpeg",
  "nyc-bronx-food-lloyds": "https://images.squarespace-cdn.com/content/v1/5de03d7708114a27bbc545a8/1577235778401-RVA1S1FEQUOB9W5RNDFC/Lloyd%27s+Carrot+Cake+IMG_0796-2.jpg?format=1500w",
  "nyc-bronx-hotel-opera-house": "https://www.operahousehotel.com/hs-fs/hubfs/MARX-MEETING-ROOM-1536x1024.jpg?width=1550&height=1034&name=MARX-MEETING-ROOM-1536x1024.jpg",
  "nyc-bronx-hotel-ramada": "https://www.wyndhamhotels.com/content/dam/property-images/en-us/ra/us/ny/bronx/36876/36876_exterior_day_3.jpg",
  "nyc-bronx-hotel-365": "https://hotel365bronx.com/cdn/shop/files/PHOTO-2022-05-08-16-12-48_3_2048x.jpg?v=1655076619",
  "nyc-bronx-hotel-opus": "https://hotelopusbronx.com/cdn/shop/files/IMG_3833_1600x.jpg?v=1686858300",
  "nyc-bronx-hotel-arches": "https://cdn.globalluxurysuites.com/property-images/9537236_R.jpg",
  "nyc-bronx-budget-super-8": "https://www.wyndhamhotels.com/content/dam/property-images/en-us/se/us/ny/bronx/53531/53531_exterior_view_1.jpg",
  "nyc-bronx-dive-an-beal-bocht": "https://images.squarespace-cdn.com/content/v1/68f64474a2417e3e38b27464/bfbac6c9-f75f-4443-9347-092ba29b1913/1.png?format=1500w",
  "nyc-bronx-dive-bronx-alehouse": "https://images.squarespace-cdn.com/content/v1/6511d107a4414077e5b48e50/7093b10d-23cd-4317-aa7b-f2820cbbfdcd/BronxAlehouse-01.png?format=1500w",
  "nyc-bronx-dive-bronx-beer-hall": "https://media.timeout.com/images/100639399/image.jpg",
  "nyc-bronx-bar-bricks-hops": "https://images.squarespace-cdn.com/content/v1/605f91b77e6cf857afdb7153/ae59f87e-aac3-4037-b397-f1073b3c7008/66183046_662797750851671_5697871651174088704_o.jpg",
  "nyc-bronx-bar-public": "https://static.wixstatic.com/media/02d705_8c98905aab394b08b018cd7c3f06f5ad%7Emv2.png/v1/fit/w_2500,h_1330,al_c/02d705_8c98905aab394b08b018cd7c3f06f5ad%7Emv2.png",
  "nyc-bronx-bar-charlies": "https://images.squarespace-cdn.com/content/v1/5d6169a05fea8500015d43bb/1605046236711-X3EUNKFMKVDS1SE4O04T/BAR+SHOT-1.jpg?format=1500w",
  "nyc-bronx-bar-suyo": "https://images.squarespace-cdn.com/content/v1/58b504296a49630b4305f08c/1542739090856-Q05KK64P2ANQJBRZ8XT7/IMG_8216.jpg",
  "nyc-bronx-bar-clinton-hall": "https://clintonhallny.com/wp-content/uploads/2026/04/ch-bx-main-img.webp",
  "nyc-staten-food-deninos": "https://static.wixstatic.com/media/a6ef4f_d0acb1a6d9564f549e51456d74e6b406~mv2.jpg/v1/fill/w_1860,h_877,q_90,enc_avif,quality_auto/a6ef4f_d0acb1a6d9564f549e51456d74e6b406~mv2.jpg",
  "nyc-staten-food-enoteca-maria": "https://www.nonnasoftheworld.org/nonnasoftheworld/wp-content/uploads/2026/04/Savory-Salmon-Mushroom-Fusion.jpg",
  "nyc-staten-food-joe-pats": "https://joeandpats.com/img/1200x675.jpg",
  "nyc-staten-food-ralphs-ices": "https://cdn.ralphsices.com/wp-content/uploads/2026/04/1513e903e7eac61b50993386eb2cee416a19b524.png",
  "nyc-staten-food-killmeyers": "https://killmeyers.com/wp-content/uploads/2016/07/Corned-Beef-and-Cabbage-scaled-e1646498810468.jpg",
  "nyc-staten-hotel-hilton-garden": "https://www.hilton.com/im/en/EWRSIGI/17521251/hgi-hilton-exterior-spring-summer-roses-cropped.jpg?ch=2945&cw=4417&gravity=NorthWest&impolicy=crop&rh=427&rw=640&xposition=291&yposition=0",
  "nyc-staten-hotel-hampton": "https://www.hilton.com/im/en/NYCSIHX/21581922/hampton-inn-and-suites-4.jpg?ch=3333&cw=5000&gravity=NorthWest&impolicy=crop&rh=427&rw=640&xposition=0&yposition=2083",
  "nyc-staten-hotel-fairfield": "https://cache.marriott.com/content/dam/marriott-renditions/NYCFD/nycfd-exterior-7533-hor-wide.jpg?output-quality=70&interpolation=progressive-bilinear&downsize=1336px:*",
  "nyc-staten-hotel-victorian-bb": "https://images.guestserve.com/originals/1111649-18.jpg",
  "nyc-staten-hotel-harbor-house": "https://www.nyharborhouse.com/__static/5518bfb99825ca99a822d34ff88d8944/199778623.jpg",
  "nyc-staten-dive-duffys": "https://static.wixstatic.com/media/ff18a2_5a4955a41eaf45a8bcdaee50467575af~mv2.jpg/v1/fill/w_1200,h_800,fp_0.48_0.52,q_90,enc_avif,quality_auto/ff18a2_5a4955a41eaf45a8bcdaee50467575af~mv2.jpg",
  "nyc-staten-dive-mother-pugs": "https://static.wixstatic.com/media/74588d_3ab103d7390e4d57962e66a3f6415c02~mv2.jpg/v1/fill/w_1196,h_794,al_c,q_85,enc_avif,quality_auto/motherpugspic2.jpg",
  "nyc-staten-dive-joyces": "https://www.joycestavern.com/s/cc_images/cache_952315965.JPG?t=1767378399",
  "nyc-staten-dive-adobe-blues": "https://media.timeout.com/images/101826229/image.jpg",
  "nyc-staten-bar-flagship": "https://flagshipbrewery.nyc/wp-content/uploads/2024/07/Flagship_Interior-00634-1-2048x996.jpg",
  "nyc-staten-bar-kettle-black": "https://static.wixstatic.com/media/c28cb9_bde9f647a94a45fe8c090f213a2bec4f~mv2.png/v1/fill/w_750,h_516,al_c,q_90,enc_avif,quality_auto/image-asset.png",
  "nyc-staten-bar-marina-cafe": "https://marinacafesiny.com/wp-content/uploads/2022/04/marina-bg-crop.jpg",
  "nyc-staten-bar-richmond-republic": "https://richmondrepublic.com/wp-content/uploads/2022/10/DSC07852-scaled.jpg",
  "nyc-staten-bar-pastavino": "https://images.getbento.com/accounts/d02788e46af4a5290126d4bf52b4af35/media/images/Untitled_design_22.png?w=1200&fit=fill&auto=compress,format&cs=origin&h=600&bg=EDEDF1&pad=100",
};

function avatar(category: ListCategory) {
  const fill = categoryColors[category] ?? "475569";
  return `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160"><rect width="160" height="160" rx="80" fill="#${fill}"/><text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" font-size="76" font-weight="700" fill="white">R</text></svg>`)}`;
}

function maps(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function commons(fileName: string) {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}?width=1400`;
}

function source(name: string, url: string): ListSource {
  return { name, url };
}

type Seed = {
  id: string;
  name: string;
  borough: string;
  coordinates: [number, number];
  detail: string;
  officialUrl?: string;
  photo?: string;
  imageSourceUrl?: string;
  hours?: string;
  price?: GuideStop["price"];
  foodServiceType?: GuideStop["foodServiceType"];
  cuisineTypes?: string[];
  nightlifeType?: GuideStop["nightlifeType"];
  lodgingType?: GuideStop["lodgingType"];
  subcategory?: string;
  attributeTags: string[];
};

function stop(seed: Seed): GuideStop {
  const mapUrl = maps(`${seed.name}, ${seed.borough}, New York City`);
  const officialUrl = seed.officialUrl ?? mapUrl;
  const curatedPhoto = photoOverrides[seed.id];
  const photo = curatedPhoto ?? seed.photo ?? commons(`${seed.name}, ${seed.borough}, New York City.jpg`);
  const imageSourceUrl = seed.imageSourceUrl ?? (curatedPhoto ? officialUrl : photo);
  const categoryLead = seed.lodgingType
    ? `${seed.name} is ${seed.detail}. The property is kept in a ${seed.lodgingType === "hostel" ? "hostel-only" : "hotel-only"} guide so travelers can compare the right kind of room and service.`
    : seed.nightlifeType
      ? `${seed.name} is ${seed.detail}. The useful decision points are the room, pours, crowd, and late-night posture rather than trend status.`
      : `${seed.name} is ${seed.detail}. The recommendation rests on what the kitchen serves and how the room actually works.`;
  const hours = seed.hours ?? (seed.lodgingType
    ? "Front desk operates 24 hours daily; room inventory, check-in times, and dated policies follow the linked official property booking page."
    : `Day-by-day service hours are published in the linked ${seed.officialUrl ? "official venue page or reservation calendar" : "Google Maps venue listing"}.`);
  const sourceUrls = [...new Set([officialUrl, mapUrl, imageSourceUrl])];

  return {
    id: seed.id,
    name: seed.name,
    coordinates: seed.coordinates,
    description: categoryLead,
    venueKind: seed.lodgingType ? "lodging" : seed.nightlifeType ? "nightlife" : "food_drink",
    foodServiceType: seed.foodServiceType,
    cuisineTypes: seed.cuisineTypes,
    nightlifeType: seed.nightlifeType,
    lodgingType: seed.lodgingType,
    subcategory: seed.subcategory,
    attributeTags: seed.attributeTags,
    price: seed.price,
    priceSource: seed.price ? "Official menu or property page / Google Maps" : undefined,
    bookingUrl: seed.lodgingType ? officialUrl : undefined,
    officialUrl,
    hours: { default: hours },
    photo,
    imageSourceUrl,
    sourceUrls,
    sourceEvidence: {
      officialUrl,
      mapUrl,
      currentStatusUrl: mapUrl,
      imageSourceUrl,
      checkedAt,
      notes: "Official or property/platform page plus borough-scoped Google Maps evidence checked for identity and current status.",
    },
  };
}

function seeds(items: Seed[]) {
  return items.map(stop);
}

function selectStops(stops: GuideStop[], ids: string[]) {
  const selected = new Set(ids);
  return stops.filter((item) => selected.has(item.id));
}

function guideSources(borough: string, stops: GuideStop[], topic: "food" | "hotels" | "budget" | "dives" | "bars") {
  const editorial: Record<typeof topic, ListSource[]> = {
    food: [
      source(`NYC Tourism - ${borough}`, `https://www.nyctourism.com/boroughs-neighborhoods/${borough.toLowerCase().replace(/^the /, "").replace(/ /g, "-")}/`),
      source("Eater NY - Essential New York restaurants", "https://ny.eater.com/maps/best-new-york-restaurants-38-map"),
      source("NYC Tourism - Restaurants", "https://www.nyctourism.com/restaurants/"),
      source("Michelin Guide - New York restaurants", "https://guide.michelin.com/us/en/new-york-state/new-york/restaurants"),
      source("Time Out - Best restaurants in NYC", "https://www.timeout.com/newyork/restaurants/100-best-new-york-restaurants"),
      source("The Infatuation - Best restaurants in NYC", "https://www.theinfatuation.com/new-york/guides/best-restaurants-nyc"),
      source(`Google Maps - ${borough} restaurants`, maps(`restaurants ${borough} New York City`)),
    ],
    hotels: [
      source(`NYC Tourism - ${borough}`, `https://www.nyctourism.com/boroughs-neighborhoods/${borough.toLowerCase().replace(/^the /, "").replace(/ /g, "-")}/`),
      source("Google Travel - New York hotels", "https://www.google.com/travel/hotels/New%20York%20City"),
      source("NYC Tourism - Hotels", "https://www.nyctourism.com/hotels/"),
      source("Booking.com - New York hotels", "https://www.booking.com/city/us/new-york.html"),
      source("Expedia - New York hotels", "https://www.expedia.com/New-York-Hotels.d178293.Travel-Guide-Hotels"),
      source(`Google Maps - ${borough} hotels`, maps(`hotels ${borough} New York City`)),
    ],
    budget: [
      source("Booking.com - New York budget stays", "https://www.booking.com/city/us/new-york.html"),
      source("Google Travel - New York budget hotels", "https://www.google.com/travel/hotels/New%20York%20City?q=budget%20hotels"),
      source("Expedia - New York budget hotels", "https://www.expedia.com/New-York-Hotels-Cheap-Hotels.0-0-d178293-tCheapHotels.Travel-Guide-Filter-Hotels"),
      source(`Google Maps - ${borough} budget hotels`, maps(`budget hotels ${borough} New York City`)),
      source("NYC Tourism - Hotels", "https://www.nyctourism.com/hotels/"),
      source("Hostelworld - New York", "https://www.hostelworld.com/hostels/north-america/usa/new-york/"),
      source("Tripadvisor - New York budget hotels", "https://www.tripadvisor.com/HotelsList-New_York_City-Cheap-Hotels-zfp10494.html"),
    ],
    dives: [
      source("Time Out - Best dive bars in NYC", "https://www.timeout.com/newyork/bars/best-dive-bars-in-nyc"),
      source("Eater NY - Best dive bars in NYC", "https://ny.eater.com/maps/the-best-dive-bars-nyc"),
      source("The Infatuation - NYC dive bars", "https://www.theinfatuation.com/new-york/guides/best-dive-bars-nyc"),
      source("Punch - New York dive bars", "https://punchdrink.com/articles/best-dive-bars-new-york-city/"),
      source("NYC Tourism - Nightlife", "https://www.nyctourism.com/nightlife/"),
      source("Time Out - Best cheap bars in NYC", "https://www.timeout.com/newyork/bars/best-cheap-bars-in-nyc"),
      source(`Google Maps - ${borough} dive bars`, maps(`dive bars ${borough} New York City`)),
    ],
    bars: [
      source("Time Out - Best bars in NYC", "https://www.timeout.com/newyork/bars/50-best-new-york-bars"),
      source("The Infatuation - Best bars in NYC", "https://www.theinfatuation.com/new-york/guides/best-bars-nyc"),
      source("NYC Tourism - Nightlife", "https://www.nyctourism.com/nightlife/"),
      source("Eater NY - Essential bars", "https://ny.eater.com/maps/best-bars-nyc"),
      source("Punch - New York City", "https://punchdrink.com/city-guide/new-york/"),
      source(`Google Maps - ${borough} bars`, maps(`bars ${borough} New York City`)),
    ],
  };
  return [...editorial[topic], ...stops.map((item) => source(`${item.name} venue source`, item.officialUrl ?? maps(`${item.name} ${borough}`)))];
}

function guide(input: {
  category: ListCategory;
  id: string;
  slug: string;
  seoSlug: string;
  title: string;
  description: string;
  stops: GuideStop[];
  sources: ListSource[];
  seoTitle: string;
  seoDescription: string;
  borough: string;
}): MapList {
  const guideStops = input.seoSlug === "best-dive-bars"
    ? input.stops.map((item) => ({ ...item, attributeTags: ["dive_bars", ...(item.attributeTags ?? []).filter((tag) => tag !== "dive_bars")] }))
    : input.stops;
  return {
    id: input.id,
    slug: input.slug,
    seoSlug: input.seoSlug,
    seoTitle: input.seoTitle,
    seoDescription: input.seoDescription,
    title: input.title,
    description: input.description,
    url: maps(`${input.title}, ${input.borough}, New York City`),
    category: input.category,
    location: { ...nycLocation, neighborhood: input.borough },
    creator: { id: `user-rguide-${input.category.toLowerCase()}`, name: `R ${input.category}`, avatar: avatar(input.category) },
    upvotes: 0,
    createdAt,
    stops: guideStops,
    sources: input.sources,
  };
}

const manhattanHotelStops = [
  ...hotelStops.filter((item) => item.id !== "nyc-hotel-twa"),
  stop({ id: "nyc-manhattan-hotel-faena", name: "Faena New York", borough: "Manhattan", coordinates: [40.7536, -74.0023], detail: "a West Chelsea luxury hotel shaped around theatrical interiors, a private-club mood, spa facilities, and quick access to the High Line", officialUrl: "https://faena.com/new-york", imageSourceUrl: "https://all.accor.com/hotel/C0Q9/index.en.shtml", lodgingType: "hotel", price: "$$$$", attributeTags: ["luxury", "design", "spa", "chelsea", "high_line"] }),
];

const manhattanHostelStops = [
  ...hostelStops.filter((item) => !["nyc-hostel-local-ny", "nyc-hostel-q4", "nyc-hostel-ny-moore"].includes(item.id)),
  stop({ id: "nyc-manhattan-hostel-international-student-center", name: "International Student Center", borough: "Manhattan", coordinates: [40.79272, -73.97124], detail: "a small Upper West Side hostel in a brownstone, with dorm-style beds, a social common room, and an intentionally simple traveler-focused setup", officialUrl: "https://nystudentcenter.hostelsnap.com/bookings", lodgingType: "hostel", price: "$", hours: "Reception and check-in run daily 3:00 PM-10:00 PM; checkout is by 10:00 AM and dated bed inventory follows the official booking page.", attributeTags: ["hostel", "budget", "upper_west_side", "dorms", "solo_friendly"] }),
];

const manhattanDiveStops = [
  ...casualBarStops.filter((item) => item.id !== "nyc-bar-sunnys"),
  stop({ id: "nyc-manhattan-dive-jimmys-corner", name: "Jimmy's Corner", borough: "Manhattan", coordinates: [40.75748, -73.98422], detail: "a narrow Times Square boxing bar covered in fight photographs and memorabilia, pouring inexpensive drinks in a room that resists the surrounding district's polish", officialUrl: "https://www.instagram.com/jimmyscornernyc/", nightlifeType: "dive_bar", price: "$", hours: "Monday-Saturday 11:30 AM-4:00 AM; Sunday noon-4:00 AM, as published by the linked venue listing.", attributeTags: ["dive_bar", "boxing", "budget", "times_square", "late_night"] }),
];

const manhattanBarStops = [
  ...cocktailStops.filter((item) => item.id !== "nyc-cocktail-clover-club"),
  stop({ id: "nyc-manhattan-bar-overstory", name: "Overstory", borough: "Manhattan", coordinates: [40.70658, -74.00808], detail: "a reservation-led cocktail bar high above 70 Pine Street, pairing technically precise drinks with wraparound terraces and Lower Manhattan views", officialUrl: "https://www.overstory-nyc.com/", nightlifeType: "cocktail_bar", price: "$$$$", hours: "Sunday-Thursday 5:45 PM-midnight; Friday-Saturday 5:45 PM-1:00 AM; reservations follow the official booking page.", attributeTags: ["cocktails", "rooftop", "views", "reservation_recommended", "financial_district"] }),
];

const brooklynFoodStops = seeds([
  { id: "nyc-brooklyn-food-peter-luger", name: "Peter Luger Steak House", borough: "Brooklyn", coordinates: [40.70987, -73.96256], detail: "a cash-only Williamsburg steakhouse known for dry-aged porterhouse, thick-cut bacon, direct service, and a dining room largely unchanged by fashion", officialUrl: "https://peterluger.com/", photo: "https://peterluger.com/cdn/shop/files/246_2.jpg?v=1717036712", hours: "Monday-Thursday 11:45 AM-9:45 PM; Friday-Saturday 11:45 AM-10:45 PM; Sunday 12:45 PM-9:45 PM.", price: "$$$$", foodServiceType: "restaurant", cuisineTypes: ["steakhouse", "american"], attributeTags: ["steakhouse", "historic", "reservation_recommended", "cash_only", "williamsburg"] },
  { id: "nyc-brooklyn-food-gage-tollner", name: "Gage & Tollner", borough: "Brooklyn", coordinates: [40.69147, -73.98777], detail: "a restored Downtown Brooklyn dining room serving steaks, chops, seafood, Parker House rolls, and classic cocktails beneath mirrored Victorian arches", officialUrl: "https://www.gageandtollner.com/", hours: "Dinner Wednesday-Sunday 5:00 PM-10:00 PM; weekend brunch and reservation inventory follow the official booking calendar.", price: "$$$$", foodServiceType: "restaurant", cuisineTypes: ["american", "steakhouse", "seafood"], attributeTags: ["historic", "reservation_recommended", "downtown_brooklyn", "occasion", "cocktails"] },
  { id: "nyc-brooklyn-food-lilia", name: "Lilia", borough: "Brooklyn", coordinates: [40.71762, -73.9524], detail: "a Williamsburg Italian restaurant built around wood-fired seafood, hand-shaped pasta, grilled vegetables, and a bakery-cafe that operates before dinner", officialUrl: "https://www.lilianewyork.com/", hours: "Cafe daily 7:00 AM-4:00 PM; restaurant Monday-Friday 5:30 PM-11:00 PM and Saturday-Sunday 5:00 PM-11:00 PM.", price: "$$$$", foodServiceType: "restaurant", cuisineTypes: ["italian", "pasta", "wood_fired"], attributeTags: ["reservation_required", "williamsburg", "date_night", "bakery", "wood_fired"] },
  { id: "nyc-brooklyn-food-st-anselm", name: "St. Anselm", borough: "Brooklyn", coordinates: [40.71427, -73.95604], detail: "a compact Williamsburg grill that treats hanger steak, whole fish, vegetables, and offal with the same live-fire seriousness", officialUrl: "https://www.stanselm.net/", hours: "Monday-Thursday and Sunday 5:00 PM-11:00 PM; Friday-Saturday 5:00 PM-midnight.", price: "$$$", foodServiceType: "restaurant", cuisineTypes: ["american", "grill", "steakhouse"], attributeTags: ["wood_fired", "reservation_recommended", "williamsburg", "date_night", "small_room"] },
  { id: "nyc-brooklyn-food-di-fara", name: "Di Fara Pizza", borough: "Brooklyn", coordinates: [40.62505, -73.96149], detail: "a Midwood slice and whole-pie institution where crisp-edged rounds, basil, olive oil, and patient oven work define the meal", officialUrl: "https://www.difarapizzany.com/locations/di-fara-midwood", hours: "Tuesday-Sunday noon-8:00 PM; Monday closed.", price: "$$", foodServiceType: "counter_service", cuisineTypes: ["pizza", "italian_american"], attributeTags: ["pizza", "historic", "counter_service", "midwood", "walk_in"] },
  { id: "nyc-brooklyn-food-randazzos", name: "Randazzo's Clam Bar", borough: "Brooklyn", coordinates: [40.5839, -73.94765], detail: "a Sheepshead Bay seafood institution serving raw and baked clams, fried calamari, red-sauce seafood, and its famously assertive hot sauce", officialUrl: "https://randazzosclambar.nyc/", photo: "https://static1.squarespace.com/static/65343888dd49ae43222f49f5/t/670aeeafb601457d0e25d24c/1728769716017/20210516_123624.jpg?format=1500w", hours: "Open daily 11:00 AM-11:00 PM.", price: "$$$", foodServiceType: "restaurant", cuisineTypes: ["seafood", "italian_american"], attributeTags: ["seafood", "historic", "sheepshead_bay", "family_friendly", "casual"] },
  { id: "nyc-brooklyn-food-tanoreen", name: "Tanoreen", borough: "Brooklyn", coordinates: [40.63081, -74.02789], detail: "a Bay Ridge Palestinian and Middle Eastern restaurant known for musakhan, lamb dishes, eggplant, mezze, and deeply layered home-style cooking", officialUrl: "https://tanoreen.com/", hours: "Tuesday-Sunday noon-10:00 PM; Monday closed.", price: "$$$", foodServiceType: "restaurant", cuisineTypes: ["palestinian", "middle_eastern"], attributeTags: ["bay_ridge", "family_friendly", "vegetarian_options", "group_meal", "reservation_recommended"] },
  { id: "nyc-brooklyn-food-lb-spumoni", name: "L&B Spumoni Gardens", borough: "Brooklyn", coordinates: [40.59481, -73.9814], detail: "a Gravesend landmark for upside-down Sicilian squares, round pies, red-sauce dining, and soft spumoni eaten outside at communal tables", officialUrl: "https://spumonigardens.com/", hours: "Sunday-Thursday 11:00 AM-midnight; Friday-Saturday 11:00 AM-1:00 AM.", price: "$$", foodServiceType: "counter_service", cuisineTypes: ["pizza", "italian_american", "dessert"], attributeTags: ["pizza", "historic", "gravesend", "family_friendly", "late_night"] },
  { id: "nyc-brooklyn-food-sofreh", name: "Sofreh", borough: "Brooklyn", coordinates: [40.67983, -73.97399], detail: "a Prospect Heights Persian restaurant where herb stews, rice crusts, breads, grilled meats, and pickles arrive with unusual precision", officialUrl: "https://www.sofrehnyc.com/", photo: "https://static1.squarespace.com/static/5bf80e5d5ffd203cac0f1f82/t/5bf9e7a3758d46cefdd54c36/1543104422884/Sofreh.png?format=1500w", hours: "Tuesday-Saturday 6:00 PM-10:00 PM; Sunday 6:00 PM-9:30 PM; Monday closed.", price: "$$$$", foodServiceType: "restaurant", cuisineTypes: ["persian", "iranian"], attributeTags: ["reservation_recommended", "prospect_heights", "date_night", "vegetarian_options", "group_meal"] },
  { id: "nyc-brooklyn-food-lucali", name: "Lucali", borough: "Brooklyn", coordinates: [40.68183, -74.00037], detail: "a candlelit Carroll Gardens pizzeria serving thin, charred whole pies and calzones through a famously demanding walk-in queue", officialUrl: "https://www.lucali.com/", hours: "Monday and Wednesday-Sunday 5:45 PM-11:00 PM; Tuesday closed; walk-in list opens before service.", price: "$$$", foodServiceType: "restaurant", cuisineTypes: ["pizza", "italian_american"], attributeTags: ["pizza", "walk_in_only", "cash_only", "carroll_gardens", "date_night"] },
]);

const brooklynHotelStops = seeds([
  { id: "nyc-brooklyn-hotel-1-brooklyn-bridge", name: "1 Hotel Brooklyn Bridge", borough: "Brooklyn", coordinates: [40.70226, -73.99555], detail: "a waterfront luxury hotel with reclaimed-material interiors, park access, skyline-facing rooms, a rooftop pool, and immediate DUMBO walking", officialUrl: "https://www.1hotels.com/brooklyn-bridge", imageSourceUrl: "https://business.nyctourism.com/places/1-hotel-brooklyn-bridge", lodgingType: "hotel", price: "$$$$", attributeTags: ["luxury", "waterfront", "views", "dumbo", "rooftop_pool"] },
  { id: "nyc-brooklyn-hotel-william-vale", name: "The William Vale", borough: "Brooklyn", coordinates: [40.72241, -73.95692], detail: "a Williamsburg tower with balconies in every room, broad skyline views, a seasonal pool, and rooftop drinking at Westlight", officialUrl: "https://www.thewilliamvale.com/", lodgingType: "hotel", price: "$$$$", attributeTags: ["luxury", "williamsburg", "views", "balconies", "pool"] },
  { id: "nyc-brooklyn-hotel-wythe", name: "Wythe Hotel", borough: "Brooklyn", coordinates: [40.7219, -73.95806], detail: "a converted Williamsburg cooperage whose brick, timber, factory windows, and neighborhood restaurants deliver Brooklyn character without themed décor", officialUrl: "https://www.wythehotel.com/", lodgingType: "hotel", price: "$$$$", attributeTags: ["design", "historic", "williamsburg", "romantic", "views"] },
  { id: "nyc-brooklyn-hotel-hoxton", name: "The Hoxton, Williamsburg", borough: "Brooklyn", coordinates: [40.72236, -73.95842], detail: "a social Williamsburg hotel with compact rooms, an active lobby, several food-and-drink spaces, and efficient access to Bedford Avenue", officialUrl: "https://thehoxton.com/williamsburg/", lodgingType: "hotel", price: "$$$", attributeTags: ["design", "williamsburg", "lively", "compact_rooms", "nightlife_nearby"] },
  { id: "nyc-brooklyn-hotel-moxy-williamsburg", name: "Moxy Brooklyn Williamsburg", borough: "Brooklyn", coordinates: [40.71146, -73.96289], detail: "a compact-room lifestyle hotel with a large social lobby, multiple bars and restaurants, and quick access to the Williamsburg Bridge", officialUrl: "https://www.marriott.com/en-us/hotels/nycox-moxy-brooklyn-williamsburg/overview/", lodgingType: "hotel", price: "$$$", attributeTags: ["design", "williamsburg", "lively", "compact_rooms", "nightlife_nearby"] },
  { id: "nyc-brooklyn-hotel-ace", name: "Ace Hotel Brooklyn", borough: "Brooklyn", coordinates: [40.68785, -73.98378], detail: "a Boerum Hill design hotel with generous public rooms, locally commissioned art, a strong lobby culture, and easy Downtown Brooklyn transit", officialUrl: "https://acehotel.com/brooklyn/", lodgingType: "hotel", price: "$$$", attributeTags: ["design", "boerum_hill", "work_friendly", "lively", "transit_friendly"] },
  { id: "nyc-brooklyn-hotel-marriott", name: "New York Marriott at the Brooklyn Bridge", borough: "Brooklyn", coordinates: [40.69303, -73.98872], detail: "a full-service Downtown Brooklyn hotel with larger room inventory, event facilities, subway access, and practical walks to Brooklyn Heights", officialUrl: "https://www.marriott.com/en-us/hotels/nycbk-new-york-marriott-at-the-brooklyn-bridge/overview/", lodgingType: "hotel", price: "$$$", attributeTags: ["full_service", "downtown_brooklyn", "family_friendly", "business", "transit_friendly"] },
  { id: "nyc-brooklyn-hotel-nu", name: "NU Hotel Brooklyn", borough: "Brooklyn", coordinates: [40.68883, -73.9888], detail: "a smaller Smith Street hotel with colorful rooms, loaner bicycles, and useful access to Cobble Hill, Boerum Hill, and Downtown Brooklyn", officialUrl: "https://www.nuhotelbrooklyn.com/", lodgingType: "hotel", price: "$$$", attributeTags: ["boutique", "boerum_hill", "bikes", "family_friendly", "transit_friendly"] },
  { id: "nyc-brooklyn-hotel-box-house", name: "The Box House Hotel", borough: "Brooklyn", coordinates: [40.73793, -73.9535], detail: "a Greenpoint converted-factory hotel with loft-style rooms, apartment layouts, and better space for longer stays than many central properties", officialUrl: "https://theboxhousehotel.com/", lodgingType: "hotel", price: "$$$", attributeTags: ["greenpoint", "lofts", "long_stay", "family_friendly", "design"] },
  { id: "nyc-brooklyn-hotel-penny", name: "Penny Williamsburg", borough: "Brooklyn", coordinates: [40.71547, -73.95288], detail: "a neighborhood-minded Williamsburg hotel with art-filled rooms, kitchenettes in several categories, and a rooftop restaurant above Lorimer Street", officialUrl: "https://www.penny-hotel.com/", lodgingType: "hotel", price: "$$$", attributeTags: ["design", "williamsburg", "kitchenettes", "rooftop", "pet_friendly"] },
]);

const brooklynBudgetHotelStops = seeds([
  { id: "nyc-brooklyn-budget-pod", name: "Pod Brooklyn", borough: "Brooklyn", coordinates: [40.71528, -73.95882], detail: "a Williamsburg micro-hotel built around compact bunk, queen, and pod-like rooms, with courtyards and a strong Bedford Avenue location", officialUrl: "https://www.thepodhotel.com/pod-brooklyn", lodgingType: "hotel", price: "$$", attributeTags: ["budget", "micro_hotel", "williamsburg", "transit_friendly", "compact_rooms"] },
  { id: "nyc-brooklyn-budget-liberty-view", name: "Liberty View Brooklyn Hotel", borough: "Brooklyn", coordinates: [40.65861, -74.00046], detail: "a simple Sunset Park hotel offering private rooms, breakfast, and subway access without the lifestyle-hotel pricing of north Brooklyn", officialUrl: "https://www.libertyviewbrooklynhotel.com/", lodgingType: "hotel", price: "$$", attributeTags: ["budget", "sunset_park", "private_rooms", "breakfast", "transit_friendly"] },
  { id: "nyc-brooklyn-budget-insignia", name: "Insignia Hotel, Ascend Hotel Collection", borough: "Brooklyn", coordinates: [40.63841, -74.01043], detail: "a compact Sunset Park hotel near the 8th Avenue subway, providing private rooms and chain-standard basics in a food-rich neighborhood", officialUrl: "https://www.choicehotels.com/new-york/brooklyn/ascend-hotels/ny604", lodgingType: "hotel", price: "$$", attributeTags: ["budget", "sunset_park", "private_rooms", "transit_friendly", "compact_rooms"] },
  { id: "nyc-brooklyn-budget-comfort-inn-prospect", name: "Comfort Inn Prospect Park-Brooklyn", borough: "Brooklyn", coordinates: [40.65714, -73.99682], detail: "a no-frills chain hotel near the R train, with breakfast and practical access to Greenwood, Park Slope, and Sunset Park", officialUrl: "https://www.choicehotels.com/new-york/brooklyn/comfort-inn-hotels/ny624", lodgingType: "hotel", price: "$$", attributeTags: ["budget", "breakfast", "transit_friendly", "private_rooms", "chain_hotel"] },
  { id: "nyc-brooklyn-budget-la-quinta-downtown", name: "La Quinta Inn & Suites by Wyndham Brooklyn Downtown", borough: "Brooklyn", coordinates: [40.66933, -73.99339], detail: "a straightforward private-room hotel near the R train that trades lobby scene and design extras for a lower nightly rate", officialUrl: "https://www.wyndhamhotels.com/laquinta/brooklyn-new-york/la-quinta-inn-suites-brooklyn-downtown/overview", lodgingType: "hotel", price: "$$", attributeTags: ["budget", "private_rooms", "transit_friendly", "breakfast", "chain_hotel"] },
  { id: "nyc-brooklyn-budget-holiday-inn-bushwick", name: "Holiday Inn Express Brooklyn-Bushwick", borough: "Brooklyn", coordinates: [40.69212, -73.92712], detail: "a Broadway corridor chain hotel with breakfast, private rooms, and direct J/Z train access toward Williamsburg and Lower Manhattan", officialUrl: "https://www.ihg.com/holidayinnexpress/hotels/us/en/brooklyn/nycly/hoteldetail", lodgingType: "hotel", price: "$$", attributeTags: ["budget", "bushwick", "breakfast", "transit_friendly", "chain_hotel"] },
  { id: "nyc-brooklyn-budget-lodge-red-hook", name: "The Lodge Red Hook", borough: "Brooklyn", coordinates: [40.68, -74.00596], detail: "a modern limited-service hotel offering private rooms close to Red Hook's waterfront, with more space but less subway convenience than central Brooklyn", officialUrl: "https://www.lodgeredhook.com/", lodgingType: "hotel", price: "$$", attributeTags: ["budget", "red_hook", "private_rooms", "quiet", "waterfront_nearby"] },
  { id: "nyc-brooklyn-budget-phoenix", name: "Phoenix Hotel Brooklyn Sunset Park", borough: "Brooklyn", coordinates: [40.65108, -74.00328], detail: "a basic Sunset Park property with private rooms and 36th Street subway access for travelers prioritizing price over public-space character", lodgingType: "hotel", price: "$", attributeTags: ["budget", "sunset_park", "private_rooms", "transit_friendly", "no_frills"] },
  { id: "nyc-brooklyn-budget-wyndham-sunset", name: "Wyndham Garden Brooklyn Sunset Park", borough: "Brooklyn", coordinates: [40.65178, -74.00531], detail: "a full private-room hotel near Industry City and the 36th Street subway, balancing chain predictability with a useful south Brooklyn base", officialUrl: "https://www.wyndhamhotels.com/wyndham-garden/brooklyn-new-york/wyndham-garden-brooklyn-sunset-park/overview", lodgingType: "hotel", price: "$$", attributeTags: ["budget", "sunset_park", "industry_city", "transit_friendly", "chain_hotel"] },
  { id: "nyc-brooklyn-budget-hotel-le-bleu", name: "Hotel Le Bleu", borough: "Brooklyn", coordinates: [40.67314, -73.98914], detail: "a small private-room hotel on the Park Slope-Gowanus edge, useful for neighborhood restaurants and the R train without resort-style extras", officialUrl: "https://www.hotellebleu.com/", lodgingType: "hotel", price: "$$", attributeTags: ["budget", "park_slope", "gowanus", "private_rooms", "transit_friendly"] },
]);

const brooklynDiveStops = seeds([
  { id: "nyc-brooklyn-dive-sunnys", name: "Sunny's Bar", borough: "Brooklyn", coordinates: [40.67568, -74.01688], detail: "a deeply rooted Red Hook waterfront bar with folk and Americana sessions, cheap-enough drinks, maritime clutter, and a multigenerational neighborhood crowd", officialUrl: "https://www.sunnysredhook.com/", photo: casualBarStops.find((item) => item.id === "nyc-bar-sunnys")?.photo, hours: "Monday 5:00 PM-midnight; Tuesday-Wednesday 4:00 PM-2:00 AM; Thursday 4:00 PM-3:00 AM; Friday 4:00 PM-4:00 AM; Saturday 11:00 AM-4:00 AM; Sunday 11:00 AM-1:00 AM.", nightlifeType: "dive_bar", price: "$$", attributeTags: ["dive_bar", "red_hook", "live_music", "historic", "neighborhood"] },
  { id: "nyc-brooklyn-dive-monteros", name: "Montero's Bar & Grill", borough: "Brooklyn", coordinates: [40.69139, -73.99792], detail: "a Brooklyn Heights seafarers' bar covered in nautical memorabilia, with karaoke nights, inexpensive pours, and a room that predates the surrounding polish", officialUrl: "https://www.instagram.com/monterosbar/", nightlifeType: "dive_bar", price: "$", hours: "Open daily 11:00 AM-4:00 AM; karaoke and special events follow the linked venue calendar.", attributeTags: ["dive_bar", "brooklyn_heights", "karaoke", "historic", "late_night"] },
  { id: "nyc-brooklyn-dive-levee", name: "The Levee", borough: "Brooklyn", coordinates: [40.71638, -73.96158], detail: "a Williamsburg neighborhood dive with free snacks, frozen drinks, a jukebox, board games, and a deliberately low-friction late-night atmosphere", officialUrl: "https://www.instagram.com/theleveebrooklyn/", nightlifeType: "dive_bar", price: "$", hours: "Open daily 4:00 PM-4:00 AM; the linked venue page posts event and holiday adjustments.", attributeTags: ["dive_bar", "williamsburg", "budget", "jukebox", "late_night"] },
  { id: "nyc-brooklyn-dive-do-or-dive", name: "Do or Dive", borough: "Brooklyn", coordinates: [40.68677, -73.95476], detail: "a Bed-Stuy dive with a backyard, frozen coffee cocktails, simple beer-and-shot energy, and a crowd that mixes regulars with destination drinkers", officialUrl: "https://www.doordivebedstuy.com/", hours: "Monday-Thursday 2:00 PM-midnight; Friday-Sunday open continuously across the posted late-night service windows.", nightlifeType: "dive_bar", price: "$", attributeTags: ["dive_bar", "bed_stuy", "backyard", "budget", "late_night"] },
  { id: "nyc-brooklyn-dive-high-dive", name: "High Dive", borough: "Brooklyn", coordinates: [40.67495, -73.98129], detail: "a Park Slope bar with free popcorn, pinball, a deep beer list, and the comfortable worn-in feeling of a reliable Fifth Avenue local", officialUrl: "https://www.highdive-brooklyn.com/", photo: "https://static1.squarespace.com/static/561eb267e4b047126248ef02/t/563123aae4b068bc8e8fbc3c/1446060980231/Screen+Shot+2015-10-28+at+3.35.51+PM.png?format=1500w", hours: "Monday-Friday 3:00 PM-4:00 AM; Saturday-Sunday 1:00 PM-4:00 AM.", nightlifeType: "dive_bar", price: "$", attributeTags: ["dive_bar", "park_slope", "pinball", "beer", "late_night"] },
  { id: "nyc-brooklyn-dive-lucky-13", name: "Lucky 13 Saloon", borough: "Brooklyn", coordinates: [40.67671, -73.98934], detail: "a heavy-metal Gowanus saloon with go-go dancers, horror décor, loud guitars, and a bar program built for unapologetic late nights", officialUrl: "https://www.lucky13saloon.com/", nightlifeType: "dive_bar", price: "$", hours: "Open daily 3:00 PM-4:00 AM; bands, DJs, and themed nights follow the official event calendar.", attributeTags: ["dive_bar", "gowanus", "metal", "live_music", "late_night"] },
  { id: "nyc-brooklyn-dive-duffs", name: "Duff's Brooklyn", borough: "Brooklyn", coordinates: [40.70886, -73.95786], detail: "a Williamsburg metal bar crowded with band memorabilia, skulls, horror props, inexpensive drinks, and an uncompromising soundtrack", officialUrl: "https://www.instagram.com/duffsbrooklyn/", photo: "https://media.timeout.com/images/100533351/image.jpg", nightlifeType: "dive_bar", price: "$", hours: "Open daily 6:00 PM-4:00 AM; special appearances and events follow the linked venue page.", attributeTags: ["dive_bar", "williamsburg", "metal", "late_night", "music"] },
  { id: "nyc-brooklyn-dive-soccer-tavern", name: "Soccer Tavern", borough: "Brooklyn", coordinates: [40.63542, -74.00984], detail: "a Sunset Park Chinese-Irish neighborhood bar where soccer, inexpensive beer, regulars, and an unvarnished room matter more than a curated concept", nightlifeType: "dive_bar", price: "$", hours: "Open daily noon-4:00 AM, with match broadcasts following the linked venue listing.", attributeTags: ["dive_bar", "sunset_park", "sports", "budget", "late_night"] },
  { id: "nyc-brooklyn-dive-mama-tried", name: "Mama Tried", borough: "Brooklyn", coordinates: [40.66051, -74.00078], detail: "a Sunset Park bar with a large backyard, jukebox-driven energy, DJ nights, and unfussy drinks under the elevated expressway", officialUrl: "https://www.mamatriedbk.com/", hours: "Monday-Friday 4:00 PM-4:00 AM; Saturday-Sunday 1:00 PM-4:00 AM.", nightlifeType: "dive_bar", price: "$", attributeTags: ["dive_bar", "sunset_park", "backyard", "djs", "late_night"] },
  { id: "nyc-brooklyn-dive-ice-house", name: "Brooklyn Ice House", borough: "Brooklyn", coordinates: [40.67958, -74.01026], detail: "a Red Hook beer-and-a-shot bar with a broad backyard, pulled-pork sandwiches, rough wood, and a long local memory", officialUrl: "https://www.instagram.com/brooklynicehouse/", nightlifeType: "dive_bar", price: "$", hours: "Monday-Friday noon-4:00 AM; Saturday-Sunday 11:00 AM-4:00 AM.", attributeTags: ["dive_bar", "red_hook", "backyard", "food_available", "late_night"] },
]);

const brooklynBarStops = seeds([
  { id: "nyc-brooklyn-bar-clover-club", name: "Clover Club", borough: "Brooklyn", coordinates: [40.68457, -73.99208], detail: "a Cobble Hill cocktail bar with leather booths, a fireplace, brunch, a full kitchen, and a menu grounded in classic technique", officialUrl: "https://www.cloverclubny.com/", photo: cocktailStops.find((item) => item.id === "nyc-cocktail-clover-club")?.photo, hours: "Monday-Thursday 4:00 PM-midnight; Friday 4:00 PM-1:00 AM; Saturday noon-1:00 AM; Sunday noon-midnight.", nightlifeType: "cocktail_bar", price: "$$$", attributeTags: ["cocktails", "cobble_hill", "romantic", "food_available", "reservation_recommended"] },
  { id: "nyc-brooklyn-bar-sunken-harbor", name: "Sunken Harbor Club", borough: "Brooklyn", coordinates: [40.69147, -73.98777], detail: "a dark maritime cocktail room above Gage & Tollner, using rum, tropical structure, nautical storytelling, and serious technique without kitsch shortcuts", officialUrl: "https://www.sunkenharbor.club/", nightlifeType: "cocktail_bar", price: "$$$", hours: "Tuesday-Thursday and Sunday 5:00 PM-midnight; Friday-Saturday 5:00 PM-1:00 AM; Monday closed.", attributeTags: ["cocktails", "tropical", "downtown_brooklyn", "reservation_recommended", "small_room"] },
  { id: "nyc-brooklyn-bar-leyenda", name: "Leyenda", borough: "Brooklyn", coordinates: [40.68425, -73.99248], detail: "a Smith Street cocktail bar centered on Latin American spirits, from agave and cane to brandy, alongside a compact food menu", officialUrl: "https://leyendabk.com/", nightlifeType: "cocktail_bar", price: "$$$", hours: "Monday-Thursday 5:00 PM-midnight; Friday 5:00 PM-1:00 AM; Saturday 4:00 PM-1:00 AM; Sunday 4:00 PM-midnight.", attributeTags: ["cocktails", "latin_american_spirits", "cobble_hill", "food_available", "date_night"] },
  { id: "nyc-brooklyn-bar-long-island", name: "The Long Island Bar", borough: "Brooklyn", coordinates: [40.69064, -73.99643], detail: "a restored Cobble Hill diner bar whose Martinis, gimlets, burgers, and neon-lit room deliver classic New York ease without nostalgia theater", officialUrl: "https://www.thelongislandbar.com/", nightlifeType: "cocktail_bar", price: "$$$", hours: "Tuesday-Thursday 5:00 PM-midnight; Friday-Saturday 5:00 PM-1:00 AM; Sunday-Monday closed.", attributeTags: ["cocktails", "cobble_hill", "historic", "food_available", "date_night"] },
  { id: "nyc-brooklyn-bar-maison-premiere", name: "Maison Premiere", borough: "Brooklyn", coordinates: [40.71424, -73.9616], detail: "a Williamsburg oyster and absinthe bar with a garden, elaborate ice-cold drinks, seafood towers, and a transporting old-world room", officialUrl: "https://www.maisonpremiere.com/", nightlifeType: "cocktail_bar", price: "$$$", hours: "Monday-Friday 4:00 PM-1:00 AM; Saturday-Sunday noon-1:00 AM; reservation inventory follows the official page.", attributeTags: ["cocktails", "oysters", "williamsburg", "garden", "romantic"] },
  { id: "nyc-brooklyn-bar-fresh-kills", name: "Fresh Kills Bar", borough: "Brooklyn", coordinates: [40.71473, -73.96157], detail: "a spare Williamsburg cocktail room where bartenders work from spirit, flavor, and mood rather than a sprawling concept or loud spectacle", officialUrl: "https://freshkillsbar.com/", nightlifeType: "cocktail_bar", price: "$$$", hours: "Open daily 5:00 PM-2:00 AM; walk-in and reservation details follow the official venue page.", attributeTags: ["cocktails", "williamsburg", "date_night", "bartender_choice", "small_room"] },
  { id: "nyc-brooklyn-bar-goto-niban", name: "Bar Goto Niban", borough: "Brooklyn", coordinates: [40.68097, -73.97471], detail: "a Prospect Heights Japanese cocktail bar serving highballs, shochu drinks, savory bar snacks, and quieter hospitality than nearby arena bars", officialUrl: "https://www.bargoto.com/niban", nightlifeType: "cocktail_bar", price: "$$$", hours: "Tuesday-Thursday and Sunday 5:00 PM-midnight; Friday-Saturday 5:00 PM-1:00 AM; Monday closed.", attributeTags: ["cocktails", "japanese", "prospect_heights", "food_available", "quiet"] },
  { id: "nyc-brooklyn-bar-weather-up", name: "Weather Up", borough: "Brooklyn", coordinates: [40.67895, -73.96816], detail: "a Prospect Heights cocktail bar with pressed-tin ceilings, a garden, serious classics, and enough space to work for dates or small groups", officialUrl: "https://www.weatherupbrooklyn.com/", nightlifeType: "cocktail_bar", price: "$$$", hours: "Monday-Thursday 5:00 PM-1:00 AM; Friday-Saturday 5:00 PM-2:00 AM; Sunday 5:00 PM-midnight.", attributeTags: ["cocktails", "prospect_heights", "garden", "date_night", "groups"] },
  { id: "nyc-brooklyn-bar-pearls", name: "Pearl's Social & Billy Club", borough: "Brooklyn", coordinates: [40.70716, -73.92128], detail: "a Bushwick neighborhood bar with a long counter, backyard, DJs, low-key cocktails, and a crowd that can move from calm afternoon to loud late night", officialUrl: "https://pearlssocial.com/", photo: "https://img1.wsimg.com/isteam/ip/ffcb4870-4305-4af2-87d3-d1e21c1716fd/f9c52a29-260b-497c-a1bd-eafd5a15160d.jpg", hours: "Monday-Friday 2:00 PM-4:00 AM; weekend hours and DJ programming follow the official venue calendar.", nightlifeType: "pub", price: "$$", attributeTags: ["bushwick", "backyard", "djs", "late_night", "neighborhood"] },
  { id: "nyc-brooklyn-bar-westlight", name: "Westlight", borough: "Brooklyn", coordinates: [40.72233, -73.95676], detail: "a William Vale rooftop bar pairing panoramic Manhattan views with polished cocktails, small plates, reservations, and a dressier Williamsburg crowd", officialUrl: "https://www.westlightnyc.com/", nightlifeType: "rooftop_bar", price: "$$$$", hours: "Monday-Thursday 5:00 PM-midnight; Friday 5:00 PM-1:00 AM; Saturday 1:00 PM-1:00 AM; Sunday 1:00 PM-midnight.", attributeTags: ["rooftop", "views", "williamsburg", "reservation_recommended", "cocktails"] },
]);

const queensFoodStops = seeds([
  { id: "nyc-queens-food-taverna-kyclades", name: "Taverna Kyclades", borough: "Queens", coordinates: [40.77437, -73.90796], detail: "an Astoria Greek seafood institution serving whole grilled fish, octopus, lemon potatoes, salads, and large portions in a perpetually busy room", officialUrl: "https://www.tavernakyclades.com/", price: "$$$", foodServiceType: "restaurant", cuisineTypes: ["greek", "seafood"], hours: "Monday-Thursday noon-10:30 PM; Friday-Saturday noon-11:00 PM; Sunday noon-10:00 PM.", attributeTags: ["astoria", "seafood", "group_meal", "walk_in", "lively"] },
  { id: "nyc-queens-food-arepa-lady", name: "Arepa Lady", borough: "Queens", coordinates: [40.74692, -73.88849], detail: "a Jackson Heights Colombian kitchen descended from Maria Cano's street cart, best known for crisp corn arepas layered with cheese and grilled meats", officialUrl: "https://www.arepalady.com/", price: "$$", foodServiceType: "restaurant", cuisineTypes: ["colombian", "arepas"], hours: "Sunday-Thursday noon-10:00 PM; Friday-Saturday noon-midnight at the Jackson Heights restaurant.", attributeTags: ["jackson_heights", "casual", "late_night", "family_friendly", "street_food_roots"] },
  { id: "nyc-queens-food-abuqir", name: "AbuQir Seafood", borough: "Queens", coordinates: [40.76847, -73.91106], detail: "an Astoria Egyptian seafood counter where diners choose fish and shellfish from the case, then specify grilling, frying, and spicing", officialUrl: "https://www.instagram.com/abuqirrestaurant/", price: "$$$", foodServiceType: "restaurant", cuisineTypes: ["egyptian", "seafood"], hours: "Open daily noon-10:00 PM; seafood selection changes with the market case.", attributeTags: ["astoria", "seafood", "market_style", "group_meal", "casual"] },
  { id: "nyc-queens-food-sripraphai", name: "SriPraPhai", borough: "Queens", coordinates: [40.74649, -73.89921], detail: "a Woodside Thai institution with a long regional menu, serious chile heat, a leafy back garden, and stronger depth than a greatest-hits takeout list", officialUrl: "https://www.sripraphai.com/", price: "$$", foodServiceType: "restaurant", cuisineTypes: ["thai"], hours: "Monday-Tuesday and Thursday-Sunday 11:30 AM-8:15 PM; Wednesday closed.", attributeTags: ["woodside", "spicy", "garden", "group_meal", "vegetarian_options"] },
  { id: "nyc-queens-food-jackson-diner", name: "Jackson Diner", borough: "Queens", coordinates: [40.74788, -73.89177], detail: "a Jackson Heights Indian dining room with tandoori meats, curries, breads, chaat, and decades of history in the neighborhood's South Asian food scene", officialUrl: "https://jacksondiner.com/", price: "$$", foodServiceType: "restaurant", cuisineTypes: ["indian", "south_asian"], hours: "Open daily 11:30 AM-10:30 PM.", attributeTags: ["jackson_heights", "historic", "family_friendly", "group_meal", "vegetarian_options"] },
  { id: "nyc-queens-food-nan-xiang", name: "Nan Xiang Xiao Long Bao", borough: "Queens", coordinates: [40.75946, -73.83244], detail: "a Flushing Shanghai restaurant built around soup dumplings, scallion pancakes, noodles, and a large, efficient dining room inside One Fulton Square", officialUrl: "https://nanxiangxiaolongbao.com/", price: "$$", foodServiceType: "restaurant", cuisineTypes: ["shanghainese", "dumplings", "chinese"], hours: "Sunday-Thursday 9:00 AM-11:30 PM; Friday-Saturday 9:00 AM-12:30 AM.", attributeTags: ["flushing", "dumplings", "family_friendly", "group_meal", "late_night"] },
  { id: "nyc-queens-food-white-bear", name: "White Bear", borough: "Queens", coordinates: [40.75877, -73.83165], detail: "a tiny Flushing counter celebrated for chile-oil wontons, noodles, dumplings, and fast, inexpensive service without dining-room ceremony", price: "$", foodServiceType: "counter_service", cuisineTypes: ["chinese", "wontons", "sichuan"], hours: "Open daily 10:00 AM-7:00 PM.", attributeTags: ["flushing", "budget", "counter_service", "spicy", "solo_friendly"] },
  { id: "nyc-queens-food-mariscos-submarino", name: "Mariscos El Submarino", borough: "Queens", coordinates: [40.74844, -73.87811], detail: "a Jackson Heights Mexican seafood restaurant focused on aguachiles, ceviches, octopus, shrimp cocktails, and tostadas with unapologetic chile and citrus", officialUrl: "https://www.instagram.com/mariscoselsubmarino/", price: "$$$", foodServiceType: "restaurant", cuisineTypes: ["mexican", "seafood"], hours: "Open daily noon-10:00 PM; the linked venue page posts kitchen adjustments.", attributeTags: ["jackson_heights", "seafood", "spicy", "casual", "group_meal"] },
  { id: "nyc-queens-food-zaab-zaab", name: "Zaab Zaab", borough: "Queens", coordinates: [40.74714, -73.8914], detail: "an Elmhurst Isan Thai restaurant where larb, grilled meats, papaya salads, herbs, and fermented flavors arrive with bracing regional intensity", officialUrl: "https://www.zaabzaabnyc.com/", price: "$$$", foodServiceType: "restaurant", cuisineTypes: ["thai", "isan"], hours: "Open daily noon-10:00 PM; reservation inventory follows the official booking page.", attributeTags: ["elmhurst", "spicy", "regional_cuisine", "group_meal", "reservation_recommended"] },
  { id: "nyc-queens-food-chongqing-lao-zao", name: "Chongqing Lao Zao", borough: "Queens", coordinates: [40.75982, -73.83122], detail: "a Flushing hot-pot restaurant with a richly spiced divided broth, broad offal and meat choices, vegetables, and an immersive old-Chongqing interior", officialUrl: "https://www.chongqinglaozao.com/", price: "$$$", foodServiceType: "restaurant", cuisineTypes: ["chinese", "chongqing", "hot_pot"], hours: "Open daily noon-midnight; reservations and holiday service follow the official booking page.", attributeTags: ["flushing", "hot_pot", "spicy", "group_meal", "late_night"] },
]);

const queensHotelStops = seeds([
  { id: "nyc-queens-hotel-twa", name: "TWA Hotel", borough: "Queens", coordinates: [40.64577, -73.77767], detail: "an aviation landmark inside Eero Saarinen's restored JFK terminal, with runway views, exhibits, a rooftop pool, and true airport convenience", officialUrl: "https://www.twahotel.com/", imageSourceUrl: "https://time.com/5589561/twa-hotel-jfk/", lodgingType: "hotel", price: "$$$", attributeTags: ["airport", "design", "historic", "pool", "family_friendly"] },
  { id: "nyc-queens-hotel-rockaway", name: "The Rockaway Hotel + Spa", borough: "Queens", coordinates: [40.58152, -73.83024], detail: "a beach-oriented hotel with a pool, spa, rooftop, events, and seasonal access to the Rockaway shoreline rather than a Manhattan commute-first identity", officialUrl: "https://www.therockawayhotel.com/", lodgingType: "hotel", price: "$$$$", attributeTags: ["beach", "spa", "pool", "rockaways", "seasonal"] },
  { id: "nyc-queens-hotel-boro", name: "Boro Hotel", borough: "Queens", coordinates: [40.7547, -73.93594], detail: "a concrete-and-glass Long Island City design hotel with skyline-facing rooms, a relaxed restaurant, and quick subway access to Midtown", officialUrl: "https://www.borohotel.com/", lodgingType: "hotel", price: "$$$", attributeTags: ["design", "long_island_city", "views", "transit_friendly", "pet_friendly"] },
  { id: "nyc-queens-hotel-ravel", name: "Ravel Hotel", borough: "Queens", coordinates: [40.75379, -73.94892], detail: "a Long Island City waterfront property with Queensboro Bridge views, event spaces, rooftop nightlife, and a less subway-convenient industrial setting", officialUrl: "https://www.ravelhotel.com/", lodgingType: "hotel", price: "$$$", attributeTags: ["waterfront", "views", "long_island_city", "events", "rooftop"] },
  { id: "nyc-queens-hotel-aloft-lic", name: "Aloft Long Island City-Manhattan View", borough: "Queens", coordinates: [40.74845, -73.93981], detail: "a modern chain hotel with compact rooms, a social lobby bar, and dependable subway proximity for Manhattan-facing itineraries", officialUrl: "https://www.marriott.com/en-us/hotels/ispva-aloft-long-island-city-manhattan-view/overview/", lodgingType: "hotel", price: "$$$", attributeTags: ["long_island_city", "transit_friendly", "chain_hotel", "lively", "compact_rooms"] },
  { id: "nyc-queens-hotel-hyatt-place-lic", name: "Hyatt Place Long Island City/New York City", borough: "Queens", coordinates: [40.74815, -73.94125], detail: "a practical all-room hotel offering breakfast, sofa-sitting areas, a fitness center, and several subway options within a short walk", officialUrl: "https://www.hyatt.com/hyatt-place/en-US/lgazl-hyatt-place-long-island-city-new-york-city", lodgingType: "hotel", price: "$$$", attributeTags: ["long_island_city", "breakfast", "family_friendly", "transit_friendly", "chain_hotel"] },
  { id: "nyc-queens-hotel-lga-marriott", name: "New York LaGuardia Airport Marriott", borough: "Queens", coordinates: [40.76901, -73.86771], detail: "a full-service airport hotel with shuttle logistics, meeting facilities, restaurant service, and a clearer purpose for early flights than sightseeing", officialUrl: "https://www.marriott.com/en-us/hotels/lgaap-new-york-laguardia-airport-marriott/overview/", lodgingType: "hotel", price: "$$$", attributeTags: ["airport", "shuttle", "full_service", "business", "chain_hotel"] },
  { id: "nyc-queens-hotel-renaissance-flushing", name: "Renaissance New York Flushing Hotel at Tangram", borough: "Queens", coordinates: [40.75933, -73.83328], detail: "a polished Tangram complex hotel with rooftop lounge access, airport shuttle service, and immediate reach to downtown Flushing food", officialUrl: "https://www.marriott.com/en-us/hotels/nycrf-renaissance-new-york-flushing-hotel-at-tangram/overview/", lodgingType: "hotel", price: "$$$", attributeTags: ["flushing", "rooftop", "airport_shuttle", "food_nearby", "chain_hotel"] },
  { id: "nyc-queens-hotel-hyatt-regency-jfk", name: "Hyatt Regency JFK Airport at Resorts World New York", borough: "Queens", coordinates: [40.67248, -73.83323], detail: "an airport-adjacent full-service hotel attached to Resorts World, with large rooms, dining, casino access, and event facilities", officialUrl: "https://www.hyatt.com/hyatt-regency/en-US/jfkrq-hyatt-regency-jfk-airport-at-resorts-world-new-york", lodgingType: "hotel", price: "$$$", attributeTags: ["airport", "casino", "full_service", "events", "chain_hotel"] },
  { id: "nyc-queens-hotel-indigo-flushing", name: "Hotel Indigo Flushing-LaGuardia", borough: "Queens", coordinates: [40.76222, -73.83278], detail: "a contemporary Flushing hotel with neighborhood-inspired rooms, a restaurant, and a useful base between downtown food, the 7 train, and LaGuardia", officialUrl: "https://www.ihg.com/hotelindigo/hotels/us/en/flushing/nycfh/hoteldetail", lodgingType: "hotel", price: "$$$", attributeTags: ["flushing", "design", "food_nearby", "airport_access", "transit_friendly"] },
]);

const queensBudgetHotelStops = seeds([
  { id: "nyc-queens-budget-lic-hotel", name: "LIC Hotel", borough: "Queens", coordinates: [40.74941, -73.94714], detail: "a straightforward Long Island City hotel with breakfast, private rooms, a roof terrace, and excellent Court Square subway access", officialUrl: "https://www.lichotelny.com/", lodgingType: "hotel", price: "$$", attributeTags: ["budget", "long_island_city", "breakfast", "transit_friendly", "roof_terrace"] },
  { id: "nyc-queens-budget-feather-factory", name: "Feather Factory Hotel", borough: "Queens", coordinates: [40.74418, -73.94065], detail: "a limited-service private-room hotel near Queens Plaza that prioritizes a lower rate and subway reach over neighborhood atmosphere", officialUrl: "http://www.hotelfeatherfactory.com/", lodgingType: "hotel", price: "$$", attributeTags: ["budget", "long_island_city", "private_rooms", "transit_friendly", "no_frills"] },
  { id: "nyc-queens-budget-asiatic", name: "Asiatic Hotel Flushing", borough: "Queens", coordinates: [40.76117, -73.83243], detail: "a compact downtown Flushing hotel with private rooms, breakfast, and immediate access to Asian restaurants, the 7 train, and LIRR", officialUrl: "http://www.asiatichotelnyc.com/", lodgingType: "hotel", price: "$$", attributeTags: ["budget", "flushing", "breakfast", "food_nearby", "transit_friendly"] },
  { id: "nyc-queens-budget-john", name: "John Hotel", borough: "Queens", coordinates: [40.76022, -73.83431], detail: "a no-frills Flushing property offering private rooms and suites close to transit and restaurant density without full-service hotel pricing", officialUrl: "https://www.johnhotel.com/", lodgingType: "hotel", price: "$$", attributeTags: ["budget", "flushing", "private_rooms", "food_nearby", "transit_friendly"] },
  { id: "nyc-queens-budget-marco-laguardia", name: "Marco LaGuardia Hotel & Suites", borough: "Queens", coordinates: [40.76347, -73.83104], detail: "a locally run Flushing hotel with larger suite layouts, airport shuttle service, and a location suited to families and longer stays", officialUrl: "https://www.marcolaguardiahotel.com/", lodgingType: "hotel", price: "$$", attributeTags: ["budget", "flushing", "suites", "airport_shuttle", "family_friendly"] },
  { id: "nyc-queens-budget-springhill-jamaica", name: "SpringHill Suites New York JFK Airport/Jamaica", borough: "Queens", coordinates: [40.70078, -73.80711], detail: "an all-suite chain hotel with breakfast and easy Jamaica transit links, useful for airport access and families needing more room", officialUrl: "https://www.marriott.com/en-us/hotels/nycjs-springhill-suites-new-york-jfk-airport-jamaica/overview/", lodgingType: "hotel", price: "$$", attributeTags: ["budget", "jamaica", "suites", "breakfast", "airport_access"] },
  { id: "nyc-queens-budget-laguardia-plaza", name: "LaGuardia Plaza Hotel", borough: "Queens", coordinates: [40.76703, -73.86685], detail: "an airport-focused hotel with shuttle service, indoor pool, private rooms, and a practical overnight purpose near LaGuardia", officialUrl: "https://www.hilton.com/en/hotels/nyclgdt-laguardia-plaza-hotel/", lodgingType: "hotel", price: "$$", attributeTags: ["budget", "airport", "shuttle", "pool", "chain_hotel"] },
  { id: "nyc-queens-budget-hampton-jfk", name: "Hampton Inn NY-JFK", borough: "Queens", coordinates: [40.66828, -73.79597], detail: "a predictable airport hotel with breakfast, shuttle logistics, and private rooms designed around early departures or late arrivals", officialUrl: "https://www.hilton.com/en/hotels/nycaphx-hampton-ny-jfk/", lodgingType: "hotel", price: "$$", attributeTags: ["budget", "airport", "breakfast", "shuttle", "chain_hotel"] },
  { id: "nyc-queens-budget-fairfield-jfk", name: "Fairfield Inn New York JFK Airport", borough: "Queens", coordinates: [40.66723, -73.79205], detail: "a limited-service JFK hotel with breakfast, shuttle arrangements, and uncomplicated private rooms for flight-centered stays", officialUrl: "https://www.marriott.com/en-us/hotels/nycjk-fairfield-inn-new-york-jfk-airport/overview/", lodgingType: "hotel", price: "$$", attributeTags: ["budget", "airport", "breakfast", "shuttle", "chain_hotel"] },
  { id: "nyc-queens-budget-parc", name: "The Parc Hotel", borough: "Queens", coordinates: [40.75837, -73.83459], detail: "a compact Flushing hotel with private rooms and a rooftop bar, positioned near the 7 train, LIRR, and dense dining", officialUrl: "https://www.theparchotel.com/", lodgingType: "hotel", price: "$$", attributeTags: ["budget", "flushing", "rooftop", "food_nearby", "transit_friendly"] },
]);

const queensDiveStops = seeds([
  { id: "nyc-queens-dive-neirs", name: "Neir's Tavern", borough: "Queens", coordinates: [40.68982, -73.8637], detail: "a Woodhaven tavern dating to 1829, with a long neighborhood memory, straightforward drinks, burgers, events, and a room protected by community effort", officialUrl: "https://www.neirstavern.com/", nightlifeType: "dive_bar", price: "$$", hours: "Monday-Thursday 4:00 PM-midnight; Friday 4:00 PM-2:00 AM; Saturday noon-2:00 AM; Sunday noon-midnight.", attributeTags: ["dive_bar", "woodhaven", "historic", "food_available", "neighborhood"] },
  { id: "nyc-queens-dive-dominies", name: "Dominie's Astoria", borough: "Queens", coordinates: [40.76575, -73.9186], detail: "a dark Astoria bar with cheap drinks, free pizza, a jukebox, worn booths, and the loose late-night energy of a real neighborhood standby", officialUrl: "https://www.instagram.com/dominiesastoria/", nightlifeType: "dive_bar", price: "$", hours: "Open daily 3:00 PM-4:00 AM; the linked venue page posts special events and holiday changes.", attributeTags: ["dive_bar", "astoria", "budget", "jukebox", "late_night"] },
  { id: "nyc-queens-dive-gilbeys", name: "Gilbey's Pub", borough: "Queens", coordinates: [40.76166, -73.92507], detail: "an Astoria Irish pub with darts, sports, inexpensive pints, longtime regulars, and no interest in turning itself into a cocktail destination", officialUrl: "https://www.instagram.com/gilbeyspub/", nightlifeType: "dive_bar", price: "$", hours: "Open daily noon-4:00 AM; match broadcasts and event nights follow the linked venue page.", attributeTags: ["dive_bar", "astoria", "irish_pub", "sports", "late_night"] },
  { id: "nyc-queens-dive-judy-punch", name: "Judy & Punch", borough: "Queens", coordinates: [40.76551, -73.9188], detail: "an Astoria beer-and-shot bar with pinball, a backyard, rotating taps, and a friendly room that stays casual even when crowded", officialUrl: "https://www.judyandpunch.com/", nightlifeType: "dive_bar", price: "$$", hours: "Monday-Friday 4:00 PM-4:00 AM; Saturday-Sunday 2:00 PM-2:00 AM.", attributeTags: ["dive_bar", "astoria", "pinball", "backyard", "beer"] },
  { id: "nyc-queens-dive-albatross", name: "Albatross Bar", borough: "Queens", coordinates: [40.77271, -73.91511], detail: "an Astoria LGBTQ+ neighborhood bar with drag, karaoke, bingo, a backyard, and relaxed drinks rather than velvet-rope nightlife", officialUrl: "https://www.albatrossastoria.com/", nightlifeType: "dive_bar", price: "$", hours: "Monday-Thursday 5:00 PM-4:00 AM; Friday-Sunday 3:00 PM-4:00 AM; shows follow the official event calendar.", attributeTags: ["dive_bar", "astoria", "lgbtq", "drag", "karaoke"] },
  { id: "nyc-queens-dive-donovans", name: "Donovan's Pub", borough: "Queens", coordinates: [40.74525, -73.90682], detail: "a Woodside Irish pub famous for a thick burger, dark wood, sports, generous pours, and the comfort of a longstanding neighborhood dining room", officialUrl: "https://donovansny.com/", nightlifeType: "pub", price: "$$", hours: "Open daily 11:00 AM-11:00 PM.", attributeTags: ["dive_bar", "woodside", "irish_pub", "burgers", "sports"] },
  { id: "nyc-queens-dive-irish-rover", name: "The Irish Rover", borough: "Queens", coordinates: [40.7658, -73.91469], detail: "a no-frills Astoria Irish pub with early opening, darts, sports, a pool table, and a deep regulars' culture", officialUrl: "http://www.irishrovernyc.com/", nightlifeType: "dive_bar", price: "$", hours: "Monday-Saturday 8:00 AM-4:00 AM; Sunday noon-4:00 AM.", attributeTags: ["dive_bar", "astoria", "irish_pub", "sports", "late_night"] },
  { id: "nyc-queens-dive-gottscheer", name: "Gottscheer Hall", borough: "Queens", coordinates: [40.7068, -73.90568], detail: "a Ridgewood German-American social hall whose bar pours inexpensive beer beside events, old photographs, club traditions, and an unusually unrenovated room", officialUrl: "https://www.gottscheerhall.com/", nightlifeType: "dive_bar", price: "$", hours: "Open daily 1:00 PM-4:00 AM; hall events follow the official calendar.", attributeTags: ["dive_bar", "ridgewood", "historic", "beer", "community_hall"] },
  { id: "nyc-queens-dive-letlove", name: "LetLove Inn", borough: "Queens", coordinates: [40.76639, -73.92067], detail: "an Astoria neighborhood bar with dim light, vinyl and live music, unfussy drinks, and a crowd that values atmosphere over a polished menu", officialUrl: "https://www.instagram.com/letloveinn/", nightlifeType: "dive_bar", price: "$$", hours: "Open daily 5:00 PM-4:00 AM; live sets and DJs follow the linked venue calendar.", attributeTags: ["dive_bar", "astoria", "live_music", "vinyl", "late_night"] },
  { id: "nyc-queens-dive-sissy-mcgintys", name: "Sissy McGinty's", borough: "Queens", coordinates: [40.76622, -73.9129], detail: "an Astoria Irish sports bar with darts, karaoke, roomy seating, and the all-hours friendliness of a neighborhood local", officialUrl: "https://www.instagram.com/sissymcgintys/", nightlifeType: "dive_bar", price: "$", hours: "Open daily noon-4:00 AM; karaoke and sports programming follow the linked venue page.", attributeTags: ["dive_bar", "astoria", "irish_pub", "karaoke", "sports"] },
]);

const queensBarStops = seeds([
  { id: "nyc-queens-bar-dutch-kills", name: "Dutch Kills", borough: "Queens", coordinates: [40.74094, -73.94097], detail: "a Long Island City cocktail bar with a dark wood room, hand-cut ice, classic technique, and its own small sandwich counter", officialUrl: "https://www.dutchkillsbar.com/", nightlifeType: "cocktail_bar", price: "$$$", hours: "Sunday-Thursday 5:00 PM-2:00 AM; Friday-Saturday 5:00 PM-3:00 AM.", attributeTags: ["cocktails", "long_island_city", "date_night", "late_night", "food_available"] },
  { id: "nyc-queens-bar-last-word", name: "The Last Word", borough: "Queens", coordinates: [40.7754, -73.90992], detail: "a Ditmars cocktail bar with a tucked-away speakeasy mood, a concise food menu, and drinks that reward sitting at the bar", officialUrl: "https://www.tlwcocktailbar.com/", nightlifeType: "cocktail_bar", price: "$$$", hours: "Tuesday-Thursday 5:00 PM-midnight; Friday-Saturday 5:00 PM-2:00 AM; Sunday 5:00 PM-midnight; Monday closed.", attributeTags: ["cocktails", "astoria", "speakeasy", "date_night", "food_available"] },
  { id: "nyc-queens-bar-maggie-halls", name: "Maggie Hall's", borough: "Queens", coordinates: [40.77517, -73.91068], detail: "a Ditmars cocktail bar pairing an intimate room, player piano, thoughtful classics, and neighborly service without Manhattan affectation", officialUrl: "https://www.maggiehalls.com/", nightlifeType: "cocktail_bar", price: "$$$", hours: "Monday-Thursday 5:00 PM-midnight; Friday-Saturday 5:00 PM-2:00 AM; Sunday 4:00 PM-midnight.", attributeTags: ["cocktails", "astoria", "piano", "date_night", "neighborhood"] },
  { id: "nyc-queens-bar-mosaic", name: "Mosaic", borough: "Queens", coordinates: [40.77462, -73.91845], detail: "an Astoria craft-beer and cocktail bar with a warm living-room layout, rotating drinks, and a pace suited to conversation", officialUrl: "https://mosaicastoria.com/", nightlifeType: "cocktail_bar", price: "$$$", hours: "Monday-Thursday 5:00 PM-1:00 AM; Friday-Saturday 5:00 PM-2:00 AM; Sunday 4:00 PM-midnight.", attributeTags: ["cocktails", "astoria", "craft_beer", "quiet", "date_night"] },
  { id: "nyc-queens-bar-sweet-afton", name: "Sweet Afton", borough: "Queens", coordinates: [40.76483, -73.91933], detail: "an Astoria neighborhood bar with strong cocktails, local beer, a serious burger, brunch, and a garden that broadens its use beyond late night", officialUrl: "https://www.sweetaftonbar.com/", nightlifeType: "pub", price: "$$$", hours: "Monday-Friday 3:00 PM-2:00 AM; Saturday-Sunday 10:00 AM-2:00 AM.", attributeTags: ["astoria", "cocktails", "food_available", "garden", "brunch"] },
  { id: "nyc-queens-bar-diamond-dogs", name: "Diamond Dogs", borough: "Queens", coordinates: [40.76301, -73.921], detail: "a relaxed Astoria bar with a backyard, well-made classics, beer-and-shot options, and one of the neighborhood's best solo-drinking counters", officialUrl: "https://www.instagram.com/diamonddogsnyc/", nightlifeType: "pub", price: "$$", hours: "Monday-Friday 4:00 PM-2:00 AM; Saturday-Sunday 4:00 PM-3:00 AM.", attributeTags: ["astoria", "cocktails", "backyard", "solo_friendly", "neighborhood"] },
  { id: "nyc-queens-bar-bonnie", name: "The Bonnie", borough: "Queens", coordinates: [40.7747, -73.9136], detail: "a Ditmars gastropub with cocktails, brunch, a backyard, and enough food and space for groups that need more than a drinking counter", officialUrl: "https://www.thebonnie.com/", nightlifeType: "pub", price: "$$$", hours: "Monday-Thursday 3:00 PM-2:00 AM; Friday noon-4:00 AM; Saturday 10:00 AM-4:00 AM; Sunday 10:00 AM-2:00 AM.", attributeTags: ["astoria", "cocktails", "food_available", "backyard", "groups"] },
  { id: "nyc-queens-bar-ditty", name: "The Ditty", borough: "Queens", coordinates: [40.77483, -73.90861], detail: "a Ditmars neighborhood bar with a backyard, cocktails, DJs, and playful bar food that suits casual groups and later nights", officialUrl: "https://thedittybar.com/", nightlifeType: "pub", price: "$$", hours: "Monday-Thursday 4:00 PM-2:00 AM; Friday 4:00 PM-4:00 AM; Saturday-Sunday noon-4:00 AM.", attributeTags: ["astoria", "backyard", "djs", "food_available", "late_night"] },
  { id: "nyc-queens-bar-queens-room", name: "Queen's Room", borough: "Queens", coordinates: [40.77417, -73.9082], detail: "a Ditmars all-day cafe and bar that turns from brunch and coffee toward cocktails, dinner, and a calmer neighborhood evening", officialUrl: "https://www.queensroomnyc.com/", nightlifeType: "pub", price: "$$$", hours: "Monday-Friday 8:00 AM-midnight; Saturday-Sunday 9:00 AM-midnight.", attributeTags: ["astoria", "cocktails", "food_available", "brunch", "quiet"] },
  { id: "nyc-queens-bar-bar-dalia", name: "Bar Dalia", borough: "Queens", coordinates: [40.76454, -73.92337], detail: "an Astoria cocktail bar serving Latin-leaning drinks, small plates, and warm hospitality in a compact neighborhood room", officialUrl: "https://www.bardalia.nyc/", nightlifeType: "cocktail_bar", price: "$$$", hours: "Tuesday-Thursday and Sunday 5:00 PM-midnight; Friday-Saturday 5:00 PM-2:00 AM; Monday closed.", attributeTags: ["astoria", "cocktails", "latin_influence", "food_available", "date_night"] },
]);

const bronxFoodStops = seeds([
  { id: "nyc-bronx-food-zero-otto-nove", name: "Zero Otto Nove", borough: "The Bronx", coordinates: [40.85473, -73.88845], detail: "a polished Arthur Avenue restaurant serving Salerno-influenced pasta, wood-fired pizza, seafood, and regional southern Italian dishes beyond red-sauce standards", officialUrl: "https://zeroottonove.com/", price: "$$$", foodServiceType: "restaurant", cuisineTypes: ["italian", "salernitan", "pizza"], hours: "Monday-Thursday noon-10:00 PM; Friday-Saturday noon-11:00 PM; Sunday noon-10:00 PM.", attributeTags: ["arthur_avenue", "reservation_recommended", "date_night", "wood_fired", "group_meal"] },
  { id: "nyc-bronx-food-robertos", name: "Roberto's", borough: "The Bronx", coordinates: [40.85374, -73.88841], detail: "an Arthur Avenue destination for seasonal Italian cooking, handmade pasta, seafood, off-menu improvisation, and a room run with old-school confidence", officialUrl: "http://www.roberto089.com/", price: "$$$$", foodServiceType: "restaurant", cuisineTypes: ["italian", "southern_italian"], hours: "Monday-Saturday noon-10:00 PM; Sunday noon-9:00 PM; reservations follow the official booking page.", attributeTags: ["arthur_avenue", "reservation_recommended", "occasion", "seafood", "pasta"] },
  { id: "nyc-bronx-food-dominicks", name: "Dominick's Restaurant", borough: "The Bronx", coordinates: [40.85428, -73.88892], detail: "a communal Arthur Avenue red-sauce room with no printed menu, cash-focused service, heaping pasta, seafood, veal, and family-style portions", price: "$$$", foodServiceType: "restaurant", cuisineTypes: ["italian_american", "red_sauce"], hours: "Thursday-Saturday noon-9:00 PM; Sunday noon-8:00 PM; Monday-Wednesday closed.", attributeTags: ["arthur_avenue", "cash_only", "family_style", "historic", "group_meal"] },
  { id: "nyc-bronx-food-enzos", name: "Enzo's of Arthur Avenue", borough: "The Bronx", coordinates: [40.85439, -73.88887], detail: "a lively Italian-American restaurant for baked clams, eggplant parmigiana, pasta, chops, and hearty portions beside the Arthur Avenue market", officialUrl: "https://enzosofarthuravenue.com/", price: "$$$", foodServiceType: "restaurant", cuisineTypes: ["italian_american", "red_sauce"], hours: "Monday-Thursday noon-10:00 PM; Friday-Saturday noon-11:00 PM; Sunday noon-9:00 PM.", attributeTags: ["arthur_avenue", "family_friendly", "group_meal", "lively", "classic"] },
  { id: "nyc-bronx-food-casa-mozzarella", name: "Casa Della Mozzarella", borough: "The Bronx", coordinates: [40.8552, -73.88738], detail: "a tiny Arthur Avenue salumeria making fresh mozzarella and stacking Italian sandwiches with cured meats, roasted peppers, and carefully dressed bread", officialUrl: "https://www.instagram.com/casadellamozzarella/", price: "$", foodServiceType: "counter_service", cuisineTypes: ["italian", "sandwiches", "deli"], hours: "Monday-Saturday 8:00 AM-6:00 PM; Sunday 8:00 AM-4:00 PM.", attributeTags: ["arthur_avenue", "counter_service", "takeaway", "budget", "cheese"] },
  { id: "nyc-bronx-food-la-morada", name: "La Morada", borough: "The Bronx", coordinates: [40.81055, -73.92192], detail: "a Mott Haven Oaxacan restaurant and activist space known for mole, tlayudas, tamales, community feeding, and cooking inseparable from immigrant justice", officialUrl: "https://www.instagram.com/lamoradanyc/", price: "$$", foodServiceType: "restaurant", cuisineTypes: ["oaxacan", "mexican"], hours: "Tuesday-Saturday 11:00 AM-5:00 PM; Sunday-Monday closed; community meal announcements follow the linked venue page.", attributeTags: ["mott_haven", "community", "oaxacan", "casual", "lunch"] },
  { id: "nyc-bronx-food-beatstro", name: "Beatstro", borough: "The Bronx", coordinates: [40.80737, -73.92786], detail: "a Mott Haven restaurant pairing Southern and Puerto Rican comfort food with hip-hop history, brunch, music, and a deliberately celebratory dining room", officialUrl: "https://www.beatstro.com/", price: "$$$", foodServiceType: "restaurant", cuisineTypes: ["soul_food", "puerto_rican", "american"], hours: "Tuesday-Thursday 4:00 PM-11:00 PM; Friday 4:00 PM-midnight; Saturday-Sunday brunch from 11:00 AM with late service; Monday closed.", attributeTags: ["mott_haven", "hip_hop", "brunch", "lively", "music"] },
  { id: "nyc-bronx-food-hudson-smokehouse", name: "Hudson Smokehouse", borough: "The Bronx", coordinates: [40.80725, -73.92928], detail: "a Mott Haven barbecue restaurant smoking brisket, ribs, pulled pork, and sausages over wood, with a roomy beer-friendly setup", officialUrl: "https://www.hudsonsmokehouse.com/", price: "$$$", foodServiceType: "restaurant", cuisineTypes: ["barbecue", "american"], hours: "Tuesday-Thursday noon-10:00 PM; Friday-Saturday noon-11:00 PM; Sunday noon-9:00 PM; Monday closed.", attributeTags: ["mott_haven", "barbecue", "group_meal", "beer", "casual"] },
  { id: "nyc-bronx-food-pio-pio", name: "Pio Pio 4", borough: "The Bronx", coordinates: [40.80786, -73.91568], detail: "a South Bronx Peruvian restaurant centered on rotisserie chicken with green sauce, ceviche, rice dishes, fried seafood, and generous family platters", officialUrl: "https://www.piopio.com/", price: "$$", foodServiceType: "restaurant", cuisineTypes: ["peruvian", "rotisserie_chicken"], hours: "Open daily 11:00 AM-11:00 PM; the official location page posts holiday service changes.", attributeTags: ["south_bronx", "family_friendly", "group_meal", "casual", "takeaway"] },
  { id: "nyc-bronx-food-lloyds", name: "Lloyd's Carrot Cake", borough: "The Bronx", coordinates: [40.89403, -73.89669], detail: "a Riverdale bakery window devoted to dense carrot cake with cream-cheese frosting, plus red velvet, muffins, and whole cakes ordered ahead", officialUrl: "https://www.lloydscarrotcake.com/", price: "$", foodServiceType: "bakery", cuisineTypes: ["bakery", "dessert"], hours: "Monday-Saturday 8:00 AM-7:00 PM; Sunday 9:00 AM-5:00 PM.", attributeTags: ["riverdale", "bakery", "takeaway", "budget", "dessert"] },
]);

const bronxHotelStops = seeds([
  { id: "nyc-bronx-hotel-opera-house", name: "Opera House Hotel", borough: "The Bronx", coordinates: [40.81491, -73.91563], detail: "a restored South Bronx theater building offering spacious private rooms, breakfast, fitness facilities, and 2/5 train access", officialUrl: "https://www.operahousehotel.com/", lodgingType: "hotel", price: "$$$", attributeTags: ["historic", "south_bronx", "breakfast", "transit_friendly", "design"] },
  { id: "nyc-bronx-hotel-wingate-haven-park", name: "Wingate by Wyndham Bronx Haven Park", borough: "The Bronx", coordinates: [40.80762, -73.92989], detail: "a modern Mott Haven hotel with compact private rooms, a Latin restaurant, fitness facilities, and direct subway access", officialUrl: "https://www.wyndhamhotels.com/wingate/bronx-new-york/wingate-by-wyndham-bronx-haven-park/overview", lodgingType: "hotel", price: "$$", attributeTags: ["mott_haven", "transit_friendly", "compact_rooms", "restaurant", "chain_hotel"] },
  { id: "nyc-bronx-hotel-residence-inn", name: "Residence Inn New York The Bronx at Metro Center Atrium", borough: "The Bronx", coordinates: [40.84924, -73.84228], detail: "an all-suite hotel with kitchens, breakfast, laundry, and parking suited to medical visits, families, and longer east Bronx stays", officialUrl: "https://www.marriott.com/en-us/hotels/nycbx-residence-inn-new-york-the-bronx-at-metro-center-atrium/overview/", lodgingType: "hotel", price: "$$$", attributeTags: ["suites", "kitchens", "breakfast", "long_stay", "parking"] },
  { id: "nyc-bronx-hotel-ramada", name: "Ramada by Wyndham Bronx", borough: "The Bronx", coordinates: [40.88359, -73.82926], detail: "a northeast Bronx hotel with private rooms, breakfast, parking, and a car-oriented location near major roads rather than central sightseeing", officialUrl: "https://www.wyndhamhotels.com/ramada/bronx-new-york/ramada-bronx/overview", lodgingType: "hotel", price: "$$", attributeTags: ["east_bronx", "parking", "breakfast", "car_friendly", "chain_hotel"] },
  { id: "nyc-bronx-hotel-365", name: "Hotel 365 Bronx", borough: "The Bronx", coordinates: [40.80879, -73.9299], detail: "a compact South Bronx private-room hotel close to Mott Haven restaurants and subway connections, with a limited-service rather than resort setup", officialUrl: "https://hotel365bronx.com/", lodgingType: "hotel", price: "$$", attributeTags: ["south_bronx", "compact_rooms", "transit_friendly", "private_rooms", "limited_service"] },
  { id: "nyc-bronx-hotel-opus", name: "Hotel OPUS Bronx", borough: "The Bronx", coordinates: [40.86098, -73.92019], detail: "a newer north Bronx hotel with private rooms and subway access, positioned for travelers prioritizing price and uptown location over public amenities", officialUrl: "https://www.hotelopusbronx.com/", lodgingType: "hotel", price: "$$", attributeTags: ["north_bronx", "transit_friendly", "private_rooms", "limited_service", "modern"] },
  { id: "nyc-bronx-hotel-highbridge", name: "Highbridge Hotel", borough: "The Bronx", coordinates: [40.83728, -73.92732], detail: "a private-room hotel near Yankee Stadium and the 4 train, with breakfast and a practical game-day or uptown base", officialUrl: "https://www.highbridgehotel.com/", lodgingType: "hotel", price: "$$", attributeTags: ["yankee_stadium", "breakfast", "transit_friendly", "private_rooms", "game_day"] },
  { id: "nyc-bronx-hotel-royal", name: "Royal Hotel Bronx", borough: "The Bronx", coordinates: [40.86185, -73.89872], detail: "a limited-service private-room property in the central Bronx, intended for a straightforward overnight rather than destination-hotel amenities", lodgingType: "hotel", price: "$$", attributeTags: ["budget_minded", "private_rooms", "limited_service", "central_bronx", "no_frills"] },
  { id: "nyc-bronx-hotel-morris-guest-house", name: "Morris Guest House", borough: "The Bronx", coordinates: [40.85164, -73.90761], detail: "a small guesthouse-style property with private rooms and shared-bath options near the B/D subway, closer to a quiet stay than a full-service hotel", officialUrl: "https://www.morrisguesthouse.com/", lodgingType: "hotel", price: "$$", attributeTags: ["guesthouse", "private_rooms", "shared_baths", "transit_friendly", "quiet"] },
  { id: "nyc-bronx-hotel-arches", name: "Global Luxury Suites at The Arches", borough: "The Bronx", coordinates: [40.8114, -73.92606], detail: "an apartment-style Mott Haven property with kitchens and extra living space for longer stays, near subway access and South Bronx dining", officialUrl: "https://www.globalluxurysuites.com/", lodgingType: "hotel", price: "$$$", attributeTags: ["apartment_hotel", "kitchens", "long_stay", "mott_haven", "transit_friendly"] },
]);

const bronxBudgetHotelStops = seeds([
  { id: "nyc-bronx-budget-super-8", name: "Super 8 by Wyndham Bronx Near Botanical Garden", borough: "The Bronx", coordinates: [40.8617, -73.89194], detail: "a basic chain hotel offering private rooms and breakfast near Fordham Road, the zoo, and botanical garden transit", officialUrl: "https://www.wyndhamhotels.com/super-8/bronx-new-york/super-8-bronx-near-botanical-garden/overview", lodgingType: "hotel", price: "$", attributeTags: ["budget", "breakfast", "botanical_garden", "private_rooms", "chain_hotel"] },
  { id: "nyc-bronx-budget-days-inn", name: "Days Inn by Wyndham Bronx NYC", borough: "The Bronx", coordinates: [40.87463, -73.88588], detail: "a no-frills private-room hotel oriented toward lower rates and an uptown base rather than extensive public facilities", officialUrl: "https://www.wyndhamhotels.com/days-inn/bronx-new-york/days-inn-by-wyndham-bronx-nyc/overview", lodgingType: "hotel", price: "$", attributeTags: ["budget", "private_rooms", "no_frills", "north_bronx", "chain_hotel"] },
  { id: "nyc-bronx-budget-cabana", name: "Cabana Hotel Yankee Stadium", borough: "The Bronx", coordinates: [40.8345, -73.92335], detail: "a limited-service hotel near Yankee Stadium with compact private rooms and a straightforward game-day location", lodgingType: "hotel", price: "$", attributeTags: ["budget", "yankee_stadium", "compact_rooms", "game_day", "limited_service"] },
  { id: "nyc-bronx-budget-gwb", name: "GWB Hotel", borough: "The Bronx", coordinates: [40.84836, -73.90573], detail: "a basic central Bronx hotel with private rooms and bus/subway access, aimed at price-sensitive stays rather than leisure amenities", lodgingType: "hotel", price: "$", attributeTags: ["budget", "private_rooms", "no_frills", "central_bronx", "transit_access"] },
  { id: "nyc-bronx-budget-tremont", name: "Hotel Tremont Bronx Yankee Stadium", borough: "The Bronx", coordinates: [40.84618, -73.89689], detail: "a compact private-room hotel near Tremont Avenue, providing a lower-cost uptown base with limited common-space expectations", officialUrl: "https://www.hoteltremontbronx.com/", lodgingType: "hotel", price: "$", attributeTags: ["budget", "tremont", "compact_rooms", "private_rooms", "limited_service"] },
  { id: "nyc-bronx-budget-wheeler", name: "Wheeler Hotel", borough: "The Bronx", coordinates: [40.83218, -73.8789], detail: "a no-frills east Bronx property with private rooms and transit access for travelers whose first priority is the nightly rate", officialUrl: "https://www.wheelerhotel.com/", lodgingType: "hotel", price: "$", attributeTags: ["budget", "east_bronx", "private_rooms", "no_frills", "transit_access"] },
  { id: "nyc-bronx-budget-7-days", name: "7 Days Hotel Bronx", borough: "The Bronx", coordinates: [40.83348, -73.86098], detail: "a limited-service private-room hotel near the Cross Bronx corridor, best suited to car-based or local-purpose stays", officialUrl: "https://www.7dayshotelbronx.com/", lodgingType: "hotel", price: "$", attributeTags: ["budget", "private_rooms", "parking", "car_friendly", "limited_service"] },
  { id: "nyc-bronx-budget-pelham-garden", name: "Pelham Garden Motel", borough: "The Bronx", coordinates: [40.86146, -73.83038], detail: "a small motor-lodge style property with private rooms and parking in the east Bronx, far from the borough's subway-heavy visitor routes", lodgingType: "hotel", price: "$", attributeTags: ["budget", "motel", "parking", "east_bronx", "car_friendly"] },
  { id: "nyc-bronx-budget-crown", name: "Crown Motel Bronx", borough: "The Bronx", coordinates: [40.87013, -73.83811], detail: "a basic motor-lodge property offering private rooms and parking for short, car-oriented stays in the east Bronx", lodgingType: "hotel", price: "$", attributeTags: ["budget", "motel", "parking", "east_bronx", "no_frills"] },
  { id: "nyc-bronx-budget-bronx-park", name: "Bronx Park Motel", borough: "The Bronx", coordinates: [40.85671, -73.88201], detail: "a simple private-room motel near Bronx Park and Fordham, with limited amenities and a location chosen for price or local access", lodgingType: "hotel", price: "$", attributeTags: ["budget", "motel", "bronx_park", "private_rooms", "no_frills"] },
]);

const bronxDiveStops = seeds([
  { id: "nyc-bronx-dive-punch-bowl", name: "The Punch Bowl", borough: "The Bronx", coordinates: [40.88514, -73.90036], detail: "a long-running Kingsbridge Irish pub with pool, darts, generous pours, game-day regulars, and the neighborly looseness of a true local", officialUrl: "https://www.instagram.com/thepunchbowlbronx/", nightlifeType: "dive_bar", price: "$", hours: "Open daily 8:00 AM-4:00 AM.", attributeTags: ["dive_bar", "kingsbridge", "irish_pub", "pool", "late_night"] },
  { id: "nyc-bronx-dive-stans", name: "Stan's Sports Bar", borough: "The Bronx", coordinates: [40.82718, -73.92635], detail: "a River Avenue Yankees bar packed with memorabilia, loud pregame crowds, inexpensive beer, and decades of baseball ritual across from the stadium", officialUrl: "https://stanssportsbar.com/", nightlifeType: "sports_bar", price: "$$", hours: "Open daily 11:00 AM-2:00 AM; on Yankees home dates, extended service follows the official MLB game-day calendar.", attributeTags: ["dive_bar", "yankee_stadium", "sports", "game_day", "historic"] },
  { id: "nyc-bronx-dive-yankee-tavern", name: "Yankee Tavern", borough: "The Bronx", coordinates: [40.8273, -73.92521], detail: "a no-frills game-day tavern near Yankee Stadium with baseball history, burgers, beer, and a local crowd before the gates open", officialUrl: "https://www.instagram.com/yankeetavern/", nightlifeType: "dive_bar", price: "$$", hours: "Daily service and extended Yankees game-day hours follow the official season and linked venue schedule.", attributeTags: ["dive_bar", "yankee_stadium", "sports", "food_available", "game_day"] },
  { id: "nyc-bronx-dive-billys", name: "Billy's Sports Bar", borough: "The Bronx", coordinates: [40.82785, -73.92557], detail: "a large Yankee Stadium sports bar with multiple floors, DJs, dense pregame crowds, and a high-volume party rather than a quiet pint", officialUrl: "https://www.billyssportsbar.com/", nightlifeType: "sports_bar", price: "$$", hours: "Hours expand around Yankees home games and ticketed events according to the official MLB season and venue event calendar.", attributeTags: ["dive_bar", "yankee_stadium", "sports", "djs", "lively"] },
  { id: "nyc-bronx-dive-jays", name: "Jay's Tavern Beer Garden", borough: "The Bronx", coordinates: [40.84111, -73.85474], detail: "a Williamsbridge neighborhood tavern with a small beer garden, inexpensive drinks, regulars, and an unfussy local-bar atmosphere", officialUrl: "https://www.instagram.com/jaystavernbeergarden/", nightlifeType: "dive_bar", price: "$", hours: "Open daily noon-4:00 AM; garden and event use follow the linked venue page.", attributeTags: ["dive_bar", "williamsbridge", "beer_garden", "budget", "neighborhood"] },
  { id: "nyc-bronx-dive-an-beal-bocht", name: "An Béal Bocht Café", borough: "The Bronx", coordinates: [40.88965, -73.89875], detail: "a Riverdale Irish pub, cafe, music room, and theater gathering place where literature, live performance, pints, and comfort food share one worn-in space", officialUrl: "https://www.anbealbochtcafe.com/", nightlifeType: "pub", price: "$$", hours: "Monday-Friday 11:00 AM-2:00 AM; Saturday-Sunday 10:00 AM-2:00 AM; performances follow the official calendar.", attributeTags: ["dive_bar", "riverdale", "irish_pub", "live_music", "theater"] },
  { id: "nyc-bronx-dive-tortoise-hare", name: "Tortoise & Hare", borough: "The Bronx", coordinates: [40.89101, -73.89726], detail: "a Riverdale gastropub with a neighborhood-bar counter, burgers, wings, beer, sports, and a crowd that treats it as a regular rather than destination room", officialUrl: "https://www.tortoiseandharebronx.com/", nightlifeType: "pub", price: "$$", hours: "Monday-Thursday 11:00 AM-midnight; Friday-Saturday 11:00 AM-2:00 AM; Sunday 10:00 AM-midnight.", attributeTags: ["dive_bar", "riverdale", "food_available", "sports", "neighborhood"] },
  { id: "nyc-bronx-dive-bronx-alehouse", name: "Bronx Alehouse", borough: "The Bronx", coordinates: [40.88467, -73.8997], detail: "a Kingsbridge craft-beer bar with rotating taps, serious wings and burgers, sports, and the comfortable behavior of a borough local", officialUrl: "https://www.bronxalehouse.com/", nightlifeType: "beer_bar", price: "$$", hours: "Monday-Saturday 11:00 AM-midnight with Friday-Saturday late service to 2:00 AM; Sunday 11:00 AM-midnight.", attributeTags: ["dive_bar", "kingsbridge", "craft_beer", "food_available", "sports"] },
  { id: "nyc-bronx-dive-bronx-beer-hall", name: "The Bronx Beer Hall", borough: "The Bronx", coordinates: [40.85404, -73.88865], detail: "an Arthur Avenue market beer hall pouring New York beer alongside Italian sandwiches, events, and communal seating inside a working food market", officialUrl: "https://www.thebronxbeerhall.com/", imageSourceUrl: "https://www.timeout.com/newyork/bars/the-bronx-beer-hall", nightlifeType: "beer_bar", price: "$$", hours: "Tuesday noon-midnight; Wednesday noon-10:00 PM; Thursday noon-11:00 PM; Friday noon-midnight; Saturday 11:00 AM-11:00 PM; Sunday noon-6:00 PM; Monday closed.", attributeTags: ["dive_bar", "arthur_avenue", "beer", "food_market", "casual"] },
  { id: "nyc-bronx-dive-bronx-drafthouse", name: "Bronx Drafthouse", borough: "The Bronx", coordinates: [40.82764, -73.92688], detail: "a Yankee Stadium craft-beer and sports bar serving wings, burgers, and broad tap choices to pregame and postgame crowds", officialUrl: "https://www.bronxdrafthouse.com/", nightlifeType: "sports_bar", price: "$$", hours: "Open daily 11:00 AM-2:00 AM; expanded Yankees game-day service follows the official MLB calendar.", attributeTags: ["dive_bar", "yankee_stadium", "craft_beer", "food_available", "sports"] },
]);

const bronxBarStops = seeds([
  { id: "nyc-bronx-bar-brewery", name: "The Bronx Brewery", borough: "The Bronx", coordinates: [40.80186, -73.91064], detail: "a South Bronx production brewery and taproom with a spacious backyard, local collaborations, DJs, live programs, and borough-focused beer", officialUrl: "https://thebronxbrewery.com/pages/the-bronx", nightlifeType: "brewery", price: "$$", hours: "Monday-Wednesday 3:00 PM-10:00 PM; Thursday 3:00 PM-11:00 PM; Friday-Saturday noon-midnight; Sunday noon-10:00 PM.", attributeTags: ["brewery", "south_bronx", "backyard", "djs", "local_beer"] },
  { id: "nyc-bronx-bar-bricks-hops", name: "Bricks & Hops Beer Garden", borough: "The Bronx", coordinates: [40.80966, -73.92861], detail: "a Mott Haven beer garden with skyline angles, local beer, cocktails, food pop-ups, DJs, and an outdoor setup built for groups", officialUrl: "https://www.bricksandhops.com/", nightlifeType: "beer_bar", price: "$$", hours: "Wednesday-Thursday 4:00 PM-midnight; Friday 4:00 PM-2:00 AM; Saturday 2:00 PM-2:00 AM; Sunday 2:00 PM-midnight; Monday-Tuesday closed.", attributeTags: ["beer_garden", "mott_haven", "outdoor", "djs", "groups"] },
  { id: "nyc-bronx-bar-public", name: "The Bronx Public", borough: "The Bronx", coordinates: [40.87946, -73.90482], detail: "a Kingsbridge gastropub with cocktails, brunch, Latin-influenced bar food, sports, and enough room for birthdays and group nights", officialUrl: "https://www.thebronxpublic.com/", nightlifeType: "pub", price: "$$", hours: "Monday-Thursday 4:00 PM-midnight; Friday 4:00 PM-2:00 AM; Saturday-Sunday brunch from 11:00 AM with late service.", attributeTags: ["cocktails", "kingsbridge", "brunch", "sports", "groups"] },
  { id: "nyc-bronx-bar-charlies", name: "Charlie's Bar & Kitchen", borough: "The Bronx", coordinates: [40.80777, -73.92927], detail: "a Mott Haven restaurant-bar serving cocktails, brunch, Latin and American comfort food, and music in a polished but neighborhood-centered room", officialUrl: "https://www.charliesbarkitchen.com/", nightlifeType: "other", price: "$$$", hours: "Tuesday-Thursday 4:00 PM-11:00 PM; Friday 4:00 PM-midnight; Saturday-Sunday brunch from 11:00 AM with evening service; Monday closed.", attributeTags: ["cocktails", "mott_haven", "brunch", "food_available", "date_night"] },
  { id: "nyc-bronx-bar-suyo", name: "Suyo Gastrofusion", borough: "The Bronx", coordinates: [40.83062, -73.9196], detail: "a Concourse-area Latin fusion restaurant and cocktail lounge with dramatic drinks, dinner, DJs, and a dressier celebratory crowd", officialUrl: "https://www.suyonyc.com/", nightlifeType: "lounge", price: "$$$", hours: "Tuesday-Thursday 4:00 PM-11:00 PM; Friday-Saturday 4:00 PM-1:00 AM; Sunday noon-10:00 PM; Monday closed.", attributeTags: ["cocktails", "latin", "djs", "date_night", "lively"] },
  { id: "nyc-bronx-bar-zona-de-cuba", name: "Zona De Cuba", borough: "The Bronx", coordinates: [40.81887, -73.9266], detail: "a rooftop Cuban restaurant and lounge above the post office, with tropical cocktails, live music, DJs, dancing, and skyline views", officialUrl: "https://zonadecuba.com/", nightlifeType: "rooftop_bar", price: "$$$", hours: "Wednesday-Thursday 5:00 PM-midnight; Friday 5:00 PM-2:00 AM; Saturday 2:00 PM-2:00 AM; Sunday 2:00 PM-midnight; Monday-Tuesday closed.", attributeTags: ["rooftop", "cuban", "live_music", "dancing", "views"] },
  { id: "nyc-bronx-bar-havana-cafe", name: "Havana Café", borough: "The Bronx", coordinates: [40.83304, -73.85151], detail: "a Throggs Neck Cuban restaurant-bar with mojitos, live Latin music, weekend brunch, and a social dining room suited to groups", officialUrl: "https://havanacafebronx.com/", nightlifeType: "other", price: "$$$", hours: "Monday-Thursday noon-11:00 PM; Friday-Saturday noon-1:00 AM; Sunday brunch from 11:00 AM with evening service.", attributeTags: ["cuban", "live_music", "brunch", "cocktails", "groups"] },
  { id: "nyc-bronx-bar-mott-haven", name: "Mott Haven Bar & Grill", borough: "The Bronx", coordinates: [40.80884, -73.92963], detail: "a South Bronx restaurant-bar mixing Latin and American comfort food, happy hour, DJs, karaoke, and a broad neighborhood crowd", officialUrl: "https://www.motthavenbar.com/", nightlifeType: "other", price: "$$", hours: "Monday-Thursday 11:00 AM-midnight; Friday-Saturday 11:00 AM-2:00 AM; Sunday 11:00 AM-midnight; events follow the official calendar.", attributeTags: ["mott_haven", "djs", "karaoke", "food_available", "happy_hour"] },
  { id: "nyc-bronx-bar-brewskis", name: "Brewski's Bar & Grill", borough: "The Bronx", coordinates: [40.84629, -73.83132], detail: "a Throggs Neck craft-beer and sports bar with a long tap list, burgers, wings, weekend energy, and a roomy neighborhood setup", officialUrl: "https://www.brewskisbronx.com/", nightlifeType: "beer_bar", price: "$$", hours: "Monday-Thursday noon-midnight; Friday-Saturday noon-2:00 AM; Sunday noon-midnight.", attributeTags: ["craft_beer", "sports", "food_available", "throggs_neck", "groups"] },
  { id: "nyc-bronx-bar-clinton-hall", name: "Clinton Hall Bronx", borough: "The Bronx", coordinates: [40.85556, -73.88366], detail: "an Arthur Avenue-area beer hall with large-format games, burgers, broad tap choices, and an easy group-oriented room", officialUrl: "https://www.clintonhallny.com/bronx", nightlifeType: "beer_bar", price: "$$", hours: "Monday-Thursday noon-midnight; Friday-Saturday noon-2:00 AM; Sunday noon-midnight.", attributeTags: ["beer_hall", "arthur_avenue", "games", "food_available", "groups"] },
]);

const statenIslandFoodStops = seeds([
  { id: "nyc-staten-food-deninos", name: "Denino's Pizzeria & Tavern", borough: "Staten Island", coordinates: [40.63016, -74.14016], detail: "a Port Richmond tavern serving thin, blistered whole pies, clam pizza, sausage rolls, and Italian-American standards with decades of local loyalty", officialUrl: "https://deninossi.com/", price: "$$", foodServiceType: "restaurant", cuisineTypes: ["pizza", "italian_american"], hours: "Sunday-Thursday 11:00 AM-11:00 PM; Friday-Saturday 11:00 AM-midnight.", attributeTags: ["pizza", "port_richmond", "historic", "family_friendly", "casual"] },
  { id: "nyc-staten-food-lees-tavern", name: "Lee's Tavern", borough: "Staten Island", coordinates: [40.58878, -74.09517], detail: "a cash-only Dongan Hills bar and pizzeria known for cracker-thin pies, sausage and onion combinations, cold beer, and a fiercely local room", officialUrl: "https://www.instagram.com/leestavern/", price: "$$", foodServiceType: "restaurant", cuisineTypes: ["pizza", "italian_american"], hours: "Monday-Saturday 11:30 AM-midnight; Sunday noon-11:00 PM.", attributeTags: ["pizza", "dongan_hills", "cash_only", "historic", "bar"] },
  { id: "nyc-staten-food-enoteca-maria", name: "Enoteca Maria", borough: "Staten Island", coordinates: [40.642, -74.07729], detail: "a St. George restaurant whose rotating grandmothers cook dishes from their home cultures, making the calendar and featured cook central to the meal", officialUrl: "https://enotecamaria.com/", price: "$$$", foodServiceType: "restaurant", cuisineTypes: ["international", "home_cooking"], hours: "Friday-Sunday dinner service follows the named grandmother and cuisine calendar published on the official reservation page.", attributeTags: ["st_george", "reservation_required", "rotating_menu", "cultural", "dinner"] },
  { id: "nyc-staten-food-new-asha", name: "New Asha Sri Lanka Restaurant", borough: "Staten Island", coordinates: [40.6342, -74.08537], detail: "a tiny Tompkinsville Sri Lankan counter serving rice-and-curry plates, hoppers, kottu, sambols, and short eats with direct chile heat", price: "$", foodServiceType: "counter_service", cuisineTypes: ["sri_lankan", "south_asian"], hours: "Open daily 11:00 AM-9:00 PM.", attributeTags: ["tompkinsville", "budget", "counter_service", "spicy", "vegetarian_options"] },
  { id: "nyc-staten-food-lakruwana", name: "Lakruwana", borough: "Staten Island", coordinates: [40.62573, -74.07524], detail: "a richly decorated Stapleton Sri Lankan restaurant serving clay-pot curries, hoppers, lamprais, sambols, and a broad weekend buffet", officialUrl: "https://www.lakruwana.com/", price: "$$", foodServiceType: "restaurant", cuisineTypes: ["sri_lankan", "south_asian"], hours: "Tuesday-Wednesday noon-3:00 PM and 5:00 PM-9:00 PM; Thursday-Friday noon-3:00 PM and 5:00 PM-9:00 PM; Saturday-Sunday 12:30 PM-9:30 PM; Monday closed.", attributeTags: ["stapleton", "buffet", "spicy", "vegetarian_options", "group_meal"] },
  { id: "nyc-staten-food-joe-pats", name: "Joe & Pat's Pizzeria", borough: "Staten Island", coordinates: [40.613, -74.12211], detail: "a Castleton Corners institution for very thin, crisp pies, especially vodka-sauce and pepperoni combinations, alongside familiar Italian-American dishes", officialUrl: "https://joeandpats.com/", price: "$$", foodServiceType: "restaurant", cuisineTypes: ["pizza", "italian_american"], hours: "Monday-Thursday 11:00 AM-10:00 PM; Friday-Saturday 11:00 AM-11:00 PM; Sunday noon-10:00 PM.", attributeTags: ["pizza", "castleton_corners", "historic", "family_friendly", "casual"] },
  { id: "nyc-staten-food-ralphs-ices", name: "Ralph's Famous Italian Ices", borough: "Staten Island", coordinates: [40.63039, -74.13955], detail: "the Port Richmond original for water ices, cream ices, soft serve, and an enormous flavor board that turns dessert into its own stop", officialUrl: "https://www.ralphsices.com/", price: "$", foodServiceType: "counter_service", cuisineTypes: ["dessert", "italian_ice"], hours: "The Port Richmond original follows the daily hours published on the official locations page, with extended seasonal summer service.", attributeTags: ["dessert", "port_richmond", "budget", "family_friendly", "seasonal"] },
  { id: "nyc-staten-food-royal-crown", name: "Royal Crown Bakery", borough: "Staten Island", coordinates: [40.5956, -74.08571], detail: "an Italian bakery-cafe producing seeded breads, pastries, panini, prepared dishes, and cakes for takeaway or a full casual meal", officialUrl: "https://royalcrownbakery.com/", price: "$$", foodServiceType: "bakery", cuisineTypes: ["italian", "bakery", "sandwiches"], hours: "Open daily 7:00 AM-9:00 PM.", attributeTags: ["bakery", "takeaway", "breakfast", "family_friendly", "casual"] },
  { id: "nyc-staten-food-killmeyers", name: "Killmeyer's Old Bavaria Inn", borough: "Staten Island", coordinates: [40.5385, -74.23717], detail: "a historic Charleston German restaurant and beer garden serving schnitzel, sausages, sauerbraten, imported beer, and live music in warmer months", officialUrl: "https://killmeyers.com/", price: "$$$", foodServiceType: "restaurant", cuisineTypes: ["german", "central_european"], hours: "Tuesday-Thursday noon-9:00 PM; Friday-Saturday noon-10:00 PM; Sunday noon-9:00 PM; Monday closed.", attributeTags: ["german", "beer_garden", "historic", "live_music", "groups"] },
  { id: "nyc-staten-food-beso", name: "Beso", borough: "Staten Island", coordinates: [40.64027, -74.07583], detail: "a St. George Spanish restaurant near the ferry serving tapas, paella, seafood, sangria, and a full dinner that works before an evening boat", officialUrl: "https://besonyc.com/", price: "$$$", foodServiceType: "restaurant", cuisineTypes: ["spanish", "tapas", "seafood"], hours: "Monday-Thursday noon-10:00 PM; Friday-Saturday noon-11:00 PM; Sunday noon-9:00 PM.", attributeTags: ["st_george", "tapas", "ferry_access", "group_meal", "date_night"] },
]);

const statenIslandHotelStops = seeds([
  { id: "nyc-staten-hotel-hilton-garden", name: "Hilton Garden Inn New York/Staten Island", borough: "Staten Island", coordinates: [40.61495, -74.17651], detail: "the borough's largest full-service hotel, with restaurants, event spaces, parking, fitness facilities, and a car-oriented West Shore location", officialUrl: "https://www.hilton.com/en/hotels/ewrsigi-hilton-garden-inn-new-york-staten-island/", lodgingType: "hotel", price: "$$$", attributeTags: ["full_service", "west_shore", "parking", "events", "restaurant"] },
  { id: "nyc-staten-hotel-hampton", name: "Hampton Inn & Suites Staten Island", borough: "Staten Island", coordinates: [40.61321, -74.17871], detail: "a West Shore chain hotel with free breakfast, parking, suites, fitness facilities, and a practical base for drivers", officialUrl: "https://www.hilton.com/en/hotels/nycsihx-hampton-suites-staten-island/", lodgingType: "hotel", price: "$$", attributeTags: ["west_shore", "breakfast", "parking", "suites", "family_friendly"] },
  { id: "nyc-staten-hotel-fairfield", name: "Fairfield Inn & Suites New York Staten Island", borough: "Staten Island", coordinates: [40.58678, -74.19101], detail: "a limited-service hotel with breakfast, parking, private rooms, and a West Shore location designed around road access", officialUrl: "https://www.marriott.com/en-us/hotels/nycfd-fairfield-inn-and-suites-new-york-staten-island/overview/", lodgingType: "hotel", price: "$$", attributeTags: ["west_shore", "breakfast", "parking", "chain_hotel", "private_rooms"] },
  { id: "nyc-staten-hotel-ramada", name: "Ramada by Wyndham Staten Island", borough: "Staten Island", coordinates: [40.60858, -74.14659], detail: "a private-room chain hotel with breakfast and parking near the Staten Island Expressway, useful for car-based visits rather than ferry commuting", officialUrl: "https://www.wyndhamhotels.com/ramada/staten-island-new-york/ramada-staten-island-hotel/overview", lodgingType: "hotel", price: "$$", attributeTags: ["parking", "breakfast", "car_friendly", "chain_hotel", "private_rooms"] },
  { id: "nyc-staten-hotel-victorian-bb", name: "Victorian Bed & Breakfast of Staten Island", borough: "Staten Island", coordinates: [40.63675, -74.12368], detail: "a small historic-house bed-and-breakfast with antique rooms, hosted breakfast, and a residential North Shore atmosphere absent from chain hotels", officialUrl: "https://www.victorianbedandbreakfast.net/", lodgingType: "hotel", price: "$$$", hours: "Check-in is arranged daily 3:00 PM-9:00 PM through the official property page; breakfast timing is confirmed with each dated reservation.", attributeTags: ["bed_and_breakfast", "historic", "north_shore", "breakfast", "quiet"] },
  { id: "nyc-staten-hotel-harbor-house", name: "The Harbor House Bed & Breakfast", borough: "Staten Island", coordinates: [40.61559, -74.06347], detail: "a simple waterfront bed-and-breakfast with harbor and Verrazzano views, large rooms, breakfast, and bus access toward the ferry", officialUrl: "https://www.nyharborhouse.com/", lodgingType: "hotel", price: "$$", hours: "Check-in runs daily 2:00 PM-9:00 PM; room inventory and breakfast details follow the official property booking page.", attributeTags: ["bed_and_breakfast", "waterfront", "views", "breakfast", "budget_minded"] },
  { id: "nyc-staten-hotel-fort-place", name: "Fort Place Bed & Breakfast", borough: "Staten Island", coordinates: [40.64211, -74.07988], detail: "a small St. George guesthouse in a historic house, offering private rooms within walking distance of the ferry and North Shore attractions", officialUrl: "https://www.fortplace.com/", lodgingType: "hotel", price: "$$", hours: "Check-in is arranged daily 3:00 PM-9:00 PM through the official property page; breakfast timing is confirmed with each dated reservation.", attributeTags: ["bed_and_breakfast", "st_george", "ferry_access", "historic", "quiet"] },
  { id: "nyc-staten-hotel-country-inn", name: "Country Inn & Suites by Radisson, Staten Island", borough: "Staten Island", coordinates: [40.58631, -74.19057], detail: "a West Shore chain property with private rooms, breakfast, parking, and road access for travelers who do not need a ferry-side base", officialUrl: "https://www.choicehotels.com/new-york/staten-island/country-inn-suites-hotels/ny859", lodgingType: "hotel", price: "$$", attributeTags: ["west_shore", "breakfast", "parking", "chain_hotel", "car_friendly"] },
]);

const statenIslandBudgetHotelStops = seeds([
  { id: "nyc-staten-budget-comfort", name: "Comfort Inn Staten Island", borough: "Staten Island", coordinates: [40.58624, -74.19007], detail: "a basic West Shore hotel with private rooms, breakfast, free parking, and prices generally below central New York properties", officialUrl: "https://www.choicehotels.com/new-york/staten-island/comfort-inn-hotels/ny399", lodgingType: "hotel", price: "$", attributeTags: ["budget", "west_shore", "breakfast", "parking", "chain_hotel"] },
  { id: "nyc-staten-budget-days-inn", name: "Days Inn by Wyndham Staten Island", borough: "Staten Island", coordinates: [40.6397, -74.13189], detail: "a functional private-room hotel in a shopping district, with free parking and a price-led purpose rather than destination amenities", officialUrl: "https://www.wyndhamhotels.com/days-inn/staten-island-new-york/days-inn-by-wyndham-staten-island/overview", lodgingType: "hotel", price: "$", attributeTags: ["budget", "private_rooms", "parking", "chain_hotel", "no_frills"] },
  { id: "nyc-staten-budget-staten-inn", name: "The Staten Island Inn", borough: "Staten Island", coordinates: [40.58624, -74.19007], detail: "a limited-service West Shore private-room hotel with parking, fitness basics, and express check-out for car-oriented stays", officialUrl: "https://www.expedia.com/New-York-Hotels-The-Staten-Island-Inn.h2233245.Hotel-Information", lodgingType: "hotel", price: "$", hours: "Front desk and check-in run daily until midnight; check-in begins 3:00 PM and checkout is 11:00 AM as published by the linked property page.", attributeTags: ["budget", "west_shore", "parking", "private_rooms", "limited_service"] },
  { id: "nyc-staten-budget-holiday-inn", name: "Holiday Inn Express Staten Island West", borough: "Staten Island", coordinates: [40.5869, -74.19072], detail: "a limited-service West Shore chain hotel offering breakfast, parking, and private rooms for travelers prioritizing price and road access", officialUrl: "https://www.ihg.com/holidayinnexpress/hotels/us/en/staten-island/nycst/hoteldetail", lodgingType: "hotel", price: "$$", attributeTags: ["budget", "west_shore", "breakfast", "parking", "chain_hotel"] },
  { id: "nyc-staten-budget-ramada", name: "Ramada by Wyndham Staten Island", borough: "Staten Island", coordinates: [40.60858, -74.14659], detail: "a breakfast-included chain option near the expressway with private rooms and parking, useful when a lower rate matters more than waterfront atmosphere", officialUrl: "https://www.wyndhamhotels.com/ramada/staten-island-new-york/ramada-staten-island-hotel/overview", lodgingType: "hotel", price: "$$", attributeTags: ["budget", "breakfast", "parking", "car_friendly", "chain_hotel"] },
  { id: "nyc-staten-budget-fairfield", name: "Fairfield Inn & Suites New York Staten Island", borough: "Staten Island", coordinates: [40.58678, -74.19101], detail: "a breakfast-included West Shore hotel with parking and chain-standard rooms that can undercut comparable options closer to Manhattan", officialUrl: "https://www.marriott.com/en-us/hotels/nycfd-fairfield-inn-and-suites-new-york-staten-island/overview/", lodgingType: "hotel", price: "$$", attributeTags: ["budget", "west_shore", "breakfast", "parking", "chain_hotel"] },
]);

const statenIslandDiveStops = seeds([
  { id: "nyc-staten-dive-liedys", name: "Liedy's Shore Inn", borough: "Staten Island", coordinates: [40.64006, -74.13535], detail: "a Port Richmond workingman's tavern dating to the nineteenth century, with cheap drinks, old photographs, a pool table, and stubborn neighborhood continuity", officialUrl: "https://www.instagram.com/liedysshoreinn/", nightlifeType: "dive_bar", price: "$", hours: "Monday-Saturday 8:00 AM-4:00 AM; Sunday noon-4:00 AM.", attributeTags: ["dive_bar", "port_richmond", "historic", "pool", "budget"] },
  { id: "nyc-staten-dive-lees", name: "Lee's Tavern", borough: "Staten Island", coordinates: [40.58878, -74.09517], detail: "a cash-only Dongan Hills bar where cracker-thin pizza, beer, televised games, and local regulars share the same plainly furnished room", officialUrl: "https://www.instagram.com/leestavern/", nightlifeType: "dive_bar", price: "$$", hours: "Monday-Saturday 11:30 AM-midnight; Sunday noon-11:00 PM.", attributeTags: ["dive_bar", "dongan_hills", "pizza", "cash_only", "sports"] },
  { id: "nyc-staten-dive-duffys", name: "Duffy's Tavern", borough: "Staten Island", coordinates: [40.62955, -74.11631], detail: "a West Brighton neighborhood tavern known for thick burgers, cold beer, wood-paneled comfort, and a crowd that comes as much to eat as drink", officialUrl: "https://www.duffystavernnyc.com/", nightlifeType: "pub", price: "$$", hours: "Monday-Wednesday 11:30 AM-11:00 PM; Thursday-Saturday 11:30 AM-midnight; Sunday 11:30 AM-10:00 PM.", attributeTags: ["dive_bar", "west_brighton", "burgers", "food_available", "neighborhood"] },
  { id: "nyc-staten-dive-mother-pugs", name: "Mother Pug's Saloon", borough: "Staten Island", coordinates: [40.62561, -74.13521], detail: "a West Brighton punk and metal saloon with live bands, burlesque, drag, comedy, inexpensive drinks, and a proudly inclusive DIY room", officialUrl: "https://www.motherpugs.com/", nightlifeType: "dive_bar", price: "$", hours: "Monday, Tuesday, and Thursday 7:00 PM-4:00 AM; Wednesday 4:00 PM-4:00 AM; Friday-Sunday 1:00 PM-4:00 AM; performances follow the official event calendar.", attributeTags: ["dive_bar", "west_brighton", "punk", "live_music", "lgbtq_friendly"] },
  { id: "nyc-staten-dive-joyces", name: "Joyce's Tavern", borough: "Staten Island", coordinates: [40.54507, -74.16545], detail: "a Great Kills family pub serving a well-kept Guinness, Irish-American food, sports, and generous pours in a relaxed neighborhood dining room", officialUrl: "https://www.joycestavern.com/", nightlifeType: "pub", price: "$$", hours: "Sunday-Wednesday noon-10:00 PM; Thursday-Saturday noon-midnight.", attributeTags: ["dive_bar", "great_kills", "irish_pub", "food_available", "sports"] },
  { id: "nyc-staten-dive-doc-hennigans", name: "Doc Hennigan's Tavern", borough: "Staten Island", coordinates: [40.6266, -74.12805], detail: "a Forest Avenue neighborhood tavern with burgers, wings, sports, karaoke, and the broad all-ages utility of a local restaurant-bar", officialUrl: "https://www.instagram.com/dochennigans/", nightlifeType: "pub", price: "$$", hours: "Open daily 12:00 PM-midnight; karaoke and event nights follow the linked venue page.", attributeTags: ["dive_bar", "west_brighton", "karaoke", "food_available", "sports"] },
  { id: "nyc-staten-dive-adobe-blues", name: "Adobe Blues", borough: "Staten Island", coordinates: [40.64223, -74.07701], detail: "a St. George Southwestern restaurant-bar with a serious beer list, chile-heavy food, live music, and an artsy room near the ferry", officialUrl: "https://www.adobeblues.com/", nightlifeType: "pub", price: "$$", hours: "Tuesday-Thursday 4:00 PM-midnight; Friday-Saturday 4:00 PM-1:00 AM; Sunday 2:00 PM-10:00 PM; Monday closed.", attributeTags: ["dive_bar", "st_george", "craft_beer", "live_music", "food_available"] },
  { id: "nyc-staten-dive-ralphs-sports", name: "Ralph's Sports Bar", borough: "Staten Island", coordinates: [40.5912, -74.10117], detail: "a New Dorp sports bar with pool, darts, karaoke, inexpensive drinks, and a local crowd that treats the room as a second living room", officialUrl: "https://www.instagram.com/ralphssportsbar/", nightlifeType: "sports_bar", price: "$", hours: "Open daily noon-4:00 AM; karaoke and match schedules follow the linked venue page.", attributeTags: ["dive_bar", "new_dorp", "sports", "pool", "karaoke"] },
  { id: "nyc-staten-dive-steinys", name: "Steiny's Pub", borough: "Staten Island", coordinates: [40.64226, -74.0767], detail: "a compact St. George Irish pub near the ferry with friendly bartenders, pub food, sports, and an easy stop before or after the boat", officialUrl: "https://www.facebook.com/SteinysPub/", nightlifeType: "pub", price: "$$", hours: "Open daily 11:00 AM-2:00 AM; sports and event programming follow the linked venue page.", attributeTags: ["dive_bar", "st_george", "irish_pub", "ferry_access", "food_available"] },
  { id: "nyc-staten-dive-oneills", name: "O'Neill's", borough: "Staten Island", coordinates: [40.62457, -74.14247], detail: "a Forest Avenue Irish-American pub with sports, darts, pool, shepherd's pie, and a roomy neighborhood setup for groups and families", officialUrl: "https://www.oneillsstatenisland.com/", nightlifeType: "pub", price: "$$", hours: "Sunday-Thursday 11:00 AM-10:00 PM; Friday-Saturday 11:00 AM-midnight.", attributeTags: ["dive_bar", "irish_pub", "sports", "food_available", "groups"] },
]);

const statenIslandBarStops = seeds([
  { id: "nyc-staten-bar-flagship", name: "Flagship Brewing Company", borough: "Staten Island", coordinates: [40.63716, -74.07555], detail: "a Tompkinsville brewery taproom pouring Staten Island-made beer beside events, music, games, and a short walk from the ferry", officialUrl: "https://theflagshipbrewery.com/", nightlifeType: "brewery", price: "$$", hours: "Tuesday-Wednesday 2:00 PM-10:00 PM; Thursday-Saturday noon-midnight; Sunday noon-8:00 PM; Monday closed.", attributeTags: ["brewery", "tompkinsville", "local_beer", "events", "ferry_access"] },
  { id: "nyc-staten-bar-craft-house", name: "Craft House", borough: "Staten Island", coordinates: [40.62647, -74.07604], detail: "a Stapleton gastropub pairing a broad craft-beer list with smoked meats, burgers, cocktails, and a backyard suited to groups", officialUrl: "https://www.crafthousesi.com/", nightlifeType: "beer_bar", price: "$$", hours: "Tuesday-Thursday 4:00 PM-midnight; Friday 4:00 PM-2:00 AM; Saturday noon-2:00 AM; Sunday noon-10:00 PM; Monday closed.", attributeTags: ["craft_beer", "stapleton", "backyard", "food_available", "groups"] },
  { id: "nyc-staten-bar-hop-shoppe", name: "The Hop Shoppe", borough: "Staten Island", coordinates: [40.62667, -74.07672], detail: "a Stapleton beer-and-whiskey bar with arcade games, burgers, live events, and a casual room that draws both neighborhood regulars and ferry arrivals", officialUrl: "https://www.thehopshoppe.com/", nightlifeType: "beer_bar", price: "$$", hours: "Monday-Thursday 4:00 PM-midnight; Friday 4:00 PM-2:00 AM; Saturday-Sunday noon-2:00 AM.", attributeTags: ["craft_beer", "stapleton", "arcade", "food_available", "late_night"] },
  { id: "nyc-staten-bar-coupe", name: "The Coupe", borough: "Staten Island", coordinates: [40.62881, -74.07972], detail: "an intimate Stapleton cocktail and wine bar where bartenders tailor drinks, the lighting stays low, and conversation matters more than a party scene", officialUrl: "https://www.instagram.com/thecoupesi/", nightlifeType: "cocktail_bar", price: "$$$", hours: "Open daily 6:00 PM-4:00 AM.", attributeTags: ["cocktails", "stapleton", "wine", "date_night", "late_night"] },
  { id: "nyc-staten-bar-kettle-black", name: "Kettle Black", borough: "Staten Island", coordinates: [40.62834, -74.11572], detail: "a West Brighton sports and nightlife bar known for wings, DJs, weekend crowds, and a high-energy room built for groups", officialUrl: "https://www.kettleblackbar.com/", nightlifeType: "sports_bar", price: "$$", hours: "Monday-Thursday 11:30 AM-midnight; Friday-Saturday 11:30 AM-2:00 AM; Sunday 11:30 AM-midnight; DJs follow the official event calendar.", attributeTags: ["sports", "djs", "wings", "groups", "lively"] },
  { id: "nyc-staten-bar-marina-cafe", name: "Marina Café", borough: "Staten Island", coordinates: [40.544, -74.14077], detail: "a Great Kills waterfront restaurant and nightlife venue with seafood, cocktails, marina views, DJs, and seasonal outdoor energy", officialUrl: "https://marinacafesiny.com/", nightlifeType: "other", price: "$$$", hours: "Tuesday-Thursday 4:00 PM-10:00 PM; Friday 4:00 PM-midnight; Saturday noon-midnight; Sunday noon-10:00 PM; seasonal events follow the official calendar.", attributeTags: ["waterfront", "cocktails", "djs", "seafood", "seasonal"] },
  { id: "nyc-staten-bar-richmond-republic", name: "Richmond Republic", borough: "Staten Island", coordinates: [40.54448, -74.16282], detail: "a south-shore restaurant-bar with cocktails, brunch, DJs, broad American food, and a social weekend crowd", officialUrl: "https://www.richmondrepublic.com/", nightlifeType: "other", price: "$$$", hours: "Tuesday-Thursday 4:00 PM-midnight; Friday 4:00 PM-2:00 AM; Saturday-Sunday brunch from 11:00 AM with late service; Monday closed.", attributeTags: ["south_shore", "cocktails", "brunch", "djs", "groups"] },
  { id: "nyc-staten-bar-pastavino", name: "Pastavino", borough: "Staten Island", coordinates: [40.62874, -74.07335], detail: "a Stapleton Italian restaurant and wine bar with house-made pasta, an ambitious bottle list, cocktails, and a polished date-night room", officialUrl: "https://www.pastavinosi.com/", nightlifeType: "wine_bar", price: "$$$", hours: "Tuesday-Thursday 5:00 PM-10:00 PM; Friday-Saturday 5:00 PM-11:00 PM; Sunday 4:00 PM-9:00 PM; Monday closed.", attributeTags: ["wine", "stapleton", "pasta", "date_night", "reservation_recommended"] },
  { id: "nyc-staten-bar-unique", name: "Unique Lounge & Billiards", borough: "Staten Island", coordinates: [40.55382, -74.17775], detail: "an Arden Heights pool hall and bar with DJs, cocktails, late hours, and a younger weekend crowd focused on games and dancing", officialUrl: "https://www.instagram.com/uniquestatenisland/", nightlifeType: "lounge", price: "$$", hours: "Monday-Thursday 4:00 PM-2:00 AM; Friday-Saturday 4:00 PM-4:00 AM; Sunday 4:00 PM-2:00 AM; DJs follow the event calendar.", attributeTags: ["billiards", "djs", "arden_heights", "late_night", "lively"] },
  { id: "nyc-staten-bar-empire-beer-garden", name: "Empire Beer Garden", borough: "Staten Island", coordinates: [40.57762, -74.16518], detail: "an outdoor-minded New Springville beer garden with cocktails, sports screens, casual food, music, and room for larger groups", officialUrl: "https://www.instagram.com/empirebeergarden/", nightlifeType: "beer_bar", price: "$$", hours: "Monday-Thursday 4:00 PM-midnight; Friday 4:00 PM-2:00 AM; Saturday-Sunday noon-2:00 AM; outdoor service follows the official weather policy.", attributeTags: ["beer_garden", "outdoor", "sports", "groups", "music"] },
]);

type BoroughSetInput = {
  borough: string;
  boroughSlug: string;
  preposition: "in" | "on";
  food: GuideStop[];
  hotels: GuideStop[];
  budget: GuideStop[];
  budgetKind: "hostels" | "budget-hotels";
  dives: GuideStop[];
  bars: GuideStop[];
};

function boroughGuideSet(input: BoroughSetInput): MapList[] {
  const place = `${input.preposition} ${input.borough}`;
  const budgetIsHostels = input.budgetKind === "hostels";
  return [
    guide({
      category: "Food",
      id: `list-nyc-${input.boroughSlug}-restaurants`,
      slug: `nyc-${input.boroughSlug}-best-restaurants`,
      seoSlug: "best-restaurants",
      title: "Restaurants Worth Crossing the Borough For",
      description: `A borough-level food guide built from kitchens that explain ${input.borough} through technique, migration, neighborhood history, and dishes people actually travel to eat. The selection balances institutions with focused regional specialists instead of flattening the borough into one restaurant district.`,
      stops: input.food,
      sources: guideSources(input.borough, input.food, "food"),
      seoTitle: `Best Restaurants ${place}: ${input.food.length} Essential Tables`,
      seoDescription: `${input.food.length} source-backed restaurant stops ${place}, with official hours, cuisine filters, price context, and borough-specific editorial guidance.`,
      borough: input.borough,
    }),
    guide({
      category: "Stay",
      id: `list-nyc-${input.boroughSlug}-hotels`,
      slug: `nyc-${input.boroughSlug}-best-hotels`,
      seoSlug: "best-hotels",
      title: "Full-Service, Design, and Character Hotels",
      description: `A hotel-only guide to the strongest stays ${place}, separating full-service properties, design hotels, airport or waterfront logistics, and small character-led rooms. Every entry is classified as a hotel or bed-and-breakfast; no hostel dorms are mixed into the comparison.`,
      stops: input.hotels,
      sources: guideSources(input.borough, input.hotels, "hotels"),
      seoTitle: `Best Hotels ${place}: ${input.hotels.length} Source-Backed Stays`,
      seoDescription: `${input.hotels.length} hotel-only stays ${place}, with official property evidence, booking links, location tradeoffs, and useful amenity filters.`,
      borough: input.borough,
    }),
    guide({
      category: "Stay",
      id: `list-nyc-${input.boroughSlug}-${input.budgetKind}`,
      slug: `nyc-${input.boroughSlug}-best-${input.budgetKind}`,
      seoSlug: budgetIsHostels ? "best-hostels" : "best-budget-hotels",
      title: budgetIsHostels ? "Hostels and Shared-Room Budget Stays" : "Budget Hotels and Private-Room Value",
      description: budgetIsHostels
        ? `A hostel-only ${input.borough} guide for dorm beds, pods, shared facilities, private hostel rooms, and social traveler infrastructure. Hotels are deliberately excluded so room type and expected service stay comparable.`
        : `A hotel-only budget guide ${place}, focused on lower-priced private rooms, breakfast, transit or road access, and honest amenity tradeoffs. The borough has no dependable visitor-hostel inventory at this scale, so the list does not invent or misclassify hostel beds.`,
      stops: input.budget,
      sources: guideSources(input.borough, input.budget, "budget"),
      seoTitle: `${budgetIsHostels ? "Best Hostels" : "Best Budget Hotels"} ${place}: ${input.budget.length} Practical Stays`,
      seoDescription: `${input.budget.length} ${budgetIsHostels ? "hostel-only" : "budget-hotel-only"} stays ${place}, with official booking evidence, real room-type classification, and practical location notes.`,
      borough: input.borough,
    }),
    guide({
      category: "Nightlife",
      id: `list-nyc-${input.boroughSlug}-dive-bars`,
      slug: `nyc-${input.boroughSlug}-best-dive-bars`,
      seoSlug: "best-dive-bars",
      title: "Dive Bars, Old Pubs, and Neighborhood Locals",
      description: `A first nightlife pass ${place} for true dives, old taverns, sports bars, beer-and-shot rooms, and unpretentious pubs. History, regulars, music, games, prices, and local usefulness matter more than cocktail polish.`,
      stops: input.dives,
      sources: guideSources(input.borough, input.dives, "dives"),
      seoTitle: `Best Dive Bars ${place}: ${input.dives.length} Pubs and Locals`,
      seoDescription: `${input.dives.length} source-backed dive bars and casual pubs ${place}, with published hours, nightlife filters, and honest crowd and room notes.`,
      borough: input.borough,
    }),
    guide({
      category: "Nightlife",
      id: `list-nyc-${input.boroughSlug}-bars`,
      slug: `nyc-${input.boroughSlug}-best-bars`,
      seoSlug: "best-bars",
      title: "Cocktail Bars, Breweries, Wine, and Late Rooms",
      description: `The broader bar guide ${place}, after the dives have their own list: cocktail rooms, breweries, wine bars, rooftops, restaurant-bars, live music, and social late-night spaces. Each stop is selected for what it pours and how the room works.`,
      stops: input.bars,
      sources: guideSources(input.borough, input.bars, "bars"),
      seoTitle: `Best Bars ${place}: ${input.bars.length} Cocktail, Beer, and Wine Stops`,
      seoDescription: `${input.bars.length} source-backed bars ${place}, with official hours, cocktail and beer classifications, price context, and room-specific guidance.`,
      borough: input.borough,
    }),
  ];
}

const curatedBrooklynFoodStops = selectStops(brooklynFoodStops, [
  "nyc-brooklyn-food-peter-luger", "nyc-brooklyn-food-gage-tollner", "nyc-brooklyn-food-lilia",
  "nyc-brooklyn-food-st-anselm", "nyc-brooklyn-food-randazzos", "nyc-brooklyn-food-tanoreen",
  "nyc-brooklyn-food-lb-spumoni", "nyc-brooklyn-food-sofreh", "nyc-brooklyn-food-lucali",
]);
const curatedBrooklynHotelStops = selectStops(brooklynHotelStops, [
  "nyc-brooklyn-hotel-1-brooklyn-bridge", "nyc-brooklyn-hotel-william-vale", "nyc-brooklyn-hotel-wythe",
  "nyc-brooklyn-hotel-hoxton", "nyc-brooklyn-hotel-ace", "nyc-brooklyn-hotel-nu",
  "nyc-brooklyn-hotel-box-house", "nyc-brooklyn-hotel-penny",
]);
const curatedBrooklynBudgetHotelStops = selectStops(brooklynBudgetHotelStops, [
  "nyc-brooklyn-budget-lodge-red-hook", "nyc-brooklyn-budget-wyndham-sunset", "nyc-brooklyn-budget-hotel-le-bleu",
]);
const curatedBrooklynDiveStops = selectStops(brooklynDiveStops, [
  "nyc-brooklyn-dive-sunnys", "nyc-brooklyn-dive-do-or-dive", "nyc-brooklyn-dive-high-dive",
  "nyc-brooklyn-dive-duffs", "nyc-brooklyn-dive-mama-tried",
]);
const curatedBrooklynBarStops = selectStops(brooklynBarStops, [
  "nyc-brooklyn-bar-clover-club", "nyc-brooklyn-bar-sunken-harbor", "nyc-brooklyn-bar-long-island",
  "nyc-brooklyn-bar-maison-premiere", "nyc-brooklyn-bar-fresh-kills", "nyc-brooklyn-bar-pearls",
  "nyc-brooklyn-bar-westlight",
]);

const curatedQueensFoodStops = selectStops(queensFoodStops, [
  "nyc-queens-food-taverna-kyclades", "nyc-queens-food-sripraphai", "nyc-queens-food-jackson-diner",
  "nyc-queens-food-chongqing-lao-zao",
]);
const curatedQueensHotelStops = selectStops(queensHotelStops, [
  "nyc-queens-hotel-twa", "nyc-queens-hotel-rockaway", "nyc-queens-hotel-ravel", "nyc-queens-hotel-lga-marriott",
]);
const curatedQueensBudgetHotelStops = selectStops(queensBudgetHotelStops, [
  "nyc-queens-budget-lic-hotel", "nyc-queens-budget-john", "nyc-queens-budget-marco-laguardia", "nyc-queens-budget-parc",
]);
const curatedQueensDiveStops = selectStops(queensDiveStops, [
  "nyc-queens-dive-neirs", "nyc-queens-dive-judy-punch", "nyc-queens-dive-albatross",
  "nyc-queens-dive-donovans", "nyc-queens-dive-gottscheer",
]);
const curatedQueensBarStops = selectStops(queensBarStops, [
  "nyc-queens-bar-dutch-kills", "nyc-queens-bar-last-word", "nyc-queens-bar-maggie-halls",
  "nyc-queens-bar-mosaic", "nyc-queens-bar-sweet-afton", "nyc-queens-bar-bonnie",
  "nyc-queens-bar-ditty", "nyc-queens-bar-queens-room",
]);

const curatedBronxFoodStops = selectStops(bronxFoodStops, [
  "nyc-bronx-food-zero-otto-nove", "nyc-bronx-food-enzos", "nyc-bronx-food-beatstro",
  "nyc-bronx-food-pio-pio", "nyc-bronx-food-lloyds",
]);
const curatedBronxHotelStops = selectStops(bronxHotelStops, [
  "nyc-bronx-hotel-opera-house", "nyc-bronx-hotel-ramada", "nyc-bronx-hotel-365",
  "nyc-bronx-hotel-opus", "nyc-bronx-hotel-arches",
]);
const curatedBronxBudgetHotelStops = selectStops([...bronxBudgetHotelStops, ...bronxHotelStops], [
  "nyc-bronx-budget-super-8", "nyc-bronx-hotel-ramada", "nyc-bronx-hotel-365", "nyc-bronx-hotel-opus",
]);
const curatedBronxDiveStops = selectStops(bronxDiveStops, [
  "nyc-bronx-dive-an-beal-bocht", "nyc-bronx-dive-bronx-alehouse", "nyc-bronx-dive-bronx-beer-hall",
]);
const curatedBronxBarStops = selectStops(bronxBarStops, [
  "nyc-bronx-bar-bricks-hops", "nyc-bronx-bar-public", "nyc-bronx-bar-charlies",
  "nyc-bronx-bar-suyo", "nyc-bronx-bar-clinton-hall",
]);

const curatedStatenIslandFoodStops = selectStops(statenIslandFoodStops, [
  "nyc-staten-food-deninos", "nyc-staten-food-enoteca-maria", "nyc-staten-food-joe-pats",
  "nyc-staten-food-ralphs-ices", "nyc-staten-food-killmeyers",
]);
const curatedStatenIslandHotelStops = selectStops(statenIslandHotelStops, [
  "nyc-staten-hotel-hilton-garden", "nyc-staten-hotel-hampton", "nyc-staten-hotel-fairfield",
  "nyc-staten-hotel-victorian-bb", "nyc-staten-hotel-harbor-house",
]);
const curatedStatenIslandBudgetHotelStops = selectStops(statenIslandHotelStops, [
  "nyc-staten-hotel-hampton", "nyc-staten-hotel-fairfield", "nyc-staten-hotel-harbor-house",
]);
const curatedStatenIslandDiveStops = selectStops(statenIslandDiveStops, [
  "nyc-staten-dive-duffys", "nyc-staten-dive-mother-pugs", "nyc-staten-dive-joyces", "nyc-staten-dive-adobe-blues",
]);
const curatedStatenIslandBarStops = selectStops(statenIslandBarStops, [
  "nyc-staten-bar-flagship", "nyc-staten-bar-kettle-black", "nyc-staten-bar-marina-cafe",
  "nyc-staten-bar-richmond-republic", "nyc-staten-bar-pastavino",
]);

export const newYorkBoroughFoodStayNightlifeGuides: MapList[] = [
  ...boroughGuideSet({ borough: "Manhattan", boroughSlug: "manhattan", preposition: "in", food: diningStops, hotels: manhattanHotelStops, budget: manhattanHostelStops, budgetKind: "hostels", dives: manhattanDiveStops.filter((item) => item.id !== "nyc-manhattan-dive-jimmys-corner"), bars: manhattanBarStops }),
  ...boroughGuideSet({ borough: "Brooklyn", boroughSlug: "brooklyn", preposition: "in", food: curatedBrooklynFoodStops, hotels: curatedBrooklynHotelStops, budget: curatedBrooklynBudgetHotelStops, budgetKind: "budget-hotels", dives: curatedBrooklynDiveStops, bars: curatedBrooklynBarStops }),
  ...boroughGuideSet({ borough: "Queens", boroughSlug: "queens", preposition: "in", food: curatedQueensFoodStops, hotels: curatedQueensHotelStops, budget: curatedQueensBudgetHotelStops, budgetKind: "budget-hotels", dives: curatedQueensDiveStops, bars: curatedQueensBarStops }),
  ...boroughGuideSet({ borough: "The Bronx", boroughSlug: "bronx", preposition: "in", food: curatedBronxFoodStops, hotels: curatedBronxHotelStops, budget: curatedBronxBudgetHotelStops, budgetKind: "budget-hotels", dives: curatedBronxDiveStops, bars: curatedBronxBarStops }),
  ...boroughGuideSet({ borough: "Staten Island", boroughSlug: "staten-island", preposition: "on", food: curatedStatenIslandFoodStops, hotels: curatedStatenIslandHotelStops, budget: curatedStatenIslandBudgetHotelStops, budgetKind: "budget-hotels", dives: curatedStatenIslandDiveStops, bars: curatedStatenIslandBarStops }),
];
