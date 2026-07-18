import type { GuideStop, ListCategory, ListSource, MapList } from "@/types";
import {
  createDerivedEditorialGuide,
  createVenueVariantFromGuideStop,
} from "@/lib/derived-editorial-guide";

const createdAt = "2026-05-07T00:00:00.000Z";

type EditorialCategory = Extract<
  ListCategory,
  "Food" | "Nightlife" | "Nature" | "Culture" | "Stay" | "Activities"
>;

const avatar = (letter: string) =>
  `data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3E${letter}%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20`;

const creators: Record<EditorialCategory, MapList["creator"]> = {
  Food: { id: "user-rguide-food", name: "R Food", avatar: avatar("R") },
  Nightlife: { id: "user-rguide-nightlife", name: "R Nightlife", avatar: avatar("R") },
  Nature: { id: "user-rguide-nature", name: "R Nature", avatar: avatar("R") },
  Culture: { id: "user-rguide-culture", name: "R Culture", avatar: avatar("R") },
  Stay: { id: "user-rguide-stay", name: "R Stay", avatar: avatar("R") },
  Activities: { id: "user-rguide-activities", name: "R Activities", avatar: avatar("R") },
};

const photos = {
  food: "https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=900&q=80",
  nightlife: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=900&q=80",
  stay: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80",
  culture: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=900&q=80",
  nature: undefined,
  activities: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=80",
  eiffel: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Paris%2C_Eiffelturm_--_2014_--_1249.jpg/1280px-Paris%2C_Eiffelturm_--_2014_--_1249.jpg",
  seine: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Paris%2C_Seine_--_2014_--_1321.jpg/1280px-Paris%2C_Seine_--_2014_--_1321.jpg",
  montmartre: "https://www.sacre-coeur-montmartre.com/app/uploads/2023/09/basilique-butte.jpg",
  canal: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=900&q=80",
};

type PoiPhotoSource = {
  photo: string;
  source: string;
};

const poiPhotoSources: Record<string, PoiPhotoSource> = {
  "Arc de Triomphe": {
    photo:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Arc_de_Triomphe%2C_Paris_5_February_2019.jpg/1280px-Arc_de_Triomphe%2C_Paris_5_February_2019.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Arc_de_Triomphe,_Paris_5_February_2019.jpg",
  },
  "Basilique du Sacre-Coeur": {
    photo: "https://www.sacre-coeur-montmartre.com/app/uploads/2023/07/3-bonnes-raisons-visite-dome-500x691.jpg",
    source: "https://www.sacre-coeur-montmartre.com/",
  },
  Angelina: {
    photo:
      "https://cdn.prod.website-files.com/63934002307dbde359e3565a/63f3b2c5c03bb8dc2fd26b0a_AnyConv.com__63d29426b1abcd3ee319a0fc_ANGELINA%20PARIS_%20RIVOLI%20(9)-min-p-2000.webp",
    source: "https://www.angelina-paris.fr/",
  },
  Arpege: {
    photo: "https://www.alain-passard.com/wp-content/uploads/2022/02/Arpege_salon2-1520x1900.jpg",
    source: "https://www.alain-passard.com/",
  },
  "Au Lapin Agile": {
    photo: "https://i0.wp.com/au-lapin-agile.com/wp-content/uploads/2022/11/cabaret_accueil_nuit_01.jpeg?w=1914&ssl=1",
    source: "https://au-lapin-agile.com/",
  },
  "Bar 228": {
    photo:
      "https://www.dorchestercollection.com/media/zpuna4hh/le-meurice-bar-228-hr-mark-read-full-size.jpg?rxy=0.5012531328320802%2C0.6286549707602339&width=1600&height=540&format=webp&rmode=crop",
    source: "https://www.dorchestercollection.com/paris/le-meurice/restaurants-bars/bar-228/",
  },
  "Bar Josephine": {
    photo: "https://media.ffycdn.net/eu/mandarin-oriental-hotel-group/s6ihZdXeAHUgigbsZdxS.jpg?mod=v1/cover=1920x617&quality=75",
    source: "https://www.mandarinoriental.com/en/paris/lutetia",
  },
  "Bar Nouveau": {
    photo: "https://barnouveau.fr/wp-content/uploads/2026/04/IMG_6999-2.jpg",
    source: "https://barnouveau.fr/",
  },
  "Bistrot des Tournelles": {
    photo:
      "https://www.bistrotdestournelles.com/i/bistrot-des-tournelles-588065/3/5/8/3/0/5/1/5/1/6/8/2/7/1687945738_201/d4465fc6d383438aed4fb15c7fcc4716.jpg",
    source: "https://www.bistrotdestournelles.com/en/photos/",
  },
  "Bouillon Racine": {
    photo:
      "https://www.bouillonracine.fr/i/bouillon-racine-bar-du-bouillon-699051/1/3/2/1/5/1/9/7/7/2/1736436971_447/275ce644a7ab192176f5c796493e2a59.website.jpg",
    source: "https://www.bouillonracine.fr/",
  },
  "Bouillon Chartier Grands Boulevards": {
    photo: "https://www.bouillon-chartier.com/chartier_medias/2023/11/bouillon-chartier-home-grandsboulevards.jpg",
    source: "https://www.bouillon-chartier.com/en/",
  },
  "Brasserie Lipp": {
    photo: "https://ugc.zenchef.com/3/4/5/9/5/3/1/5/1/3/7/1/9/1714144479_381/27da576e9c340bdf3ca689ae48b78286.website.jpg",
    source: "https://www.brasserielipp.fr/",
  },
  "Breizh Cafe Abbesses": {
    photo:
      "https://images.squarespace-cdn.com/content/v1/619f05c41ec5d21532f581fb/238318af-60d2-4b6d-9f0a-58399f6b6215/DSCF7774+copie_2500.jpg",
    source: "https://en.breizhcafe.com/abbesses",
  },
  Candelaria: {
    photo:
      "https://images.squarespace-cdn.com/content/v1/601823bdac5fb55d1bfc8913/459898a4-3052-4e7d-995f-8029a76bfa0f/010-CANDELARIA-2022-LOWDEF.jpg?format=1500w",
    source: "https://www.candelaria-paris.com/bar",
  },
  "Cafe Varenne": {
    photo: "https://menuonline.fr/cafevarenne/images/restaurant_YINIaC.webp",
    source: "https://menuonline.fr/cafevarenne/",
  },
  "Cafe de Flore": {
    photo: "https://cafedeflore.fr/wp-content/uploads/sb-instagram-feed-images/579118853_1317925440376401_4607922785340561355_nlow.webp",
    source: "https://cafedeflore.fr/",
  },
  "Castor Club": {
    photo: "https://res.cloudinary.com/the-infatuation/image/upload/f_auto/q_auto/v1714688747/TTownsend_photo3_ucrfbj.jpg",
    source: "https://www.theinfatuation.com/paris/reviews/castor-club",
  },
  "Cheval Blanc Paris": {
    photo:
      "https://images.prismic.io/lvmh-chevalblanc/Z-vdqXdAxsiBwLEY_WebRGB-ChevalBlancParis_SuiteEiffel_VincentLeroux.jpg?auto=format%2Ccompress&fit=max&w=3840",
    source: "https://www.chevalblanc.com/en/maison/paris/",
  },
  "Chez Prune": {
    photo: "https://cdn.res-menu.net/chez-prune/albums-1.jpg",
    source: "https://chez-prune.res-menu.net/",
  },
  Clamato: {
    photo: "https://www.theworlds50best.com/discovery/filestore/jpg/Clamato-Paris-France-03.jpg",
    source: "https://www.theworlds50best.com/discovery/Establishments/France/Paris/Clamato.html",
  },
  Danico: {
    photo: "https://www.daroco.com/wp-content/uploads/2024/02/AM2A5871-2100x1400.jpg",
    source: "https://www.daroco.com/en/danico/",
  },
  "David Toutain": {
    photo:
      "https://images.getbento.com/accounts/ff03f9e731b42b40fa602140d58b60a7/media/images/536811062024-DTV1-43.jpg?w=1200&fit=crop&auto=compress,format&cs=origin&crop=focalpoint&fp-x=0.47&fp-y=0.4",
    source: "https://www.davidtoutain.com/",
  },
  "Du Pain et des Idees": {
    photo: "https://cdn.prod.website-files.com/68d3ac079a10da70917c11f6/68e5135e14cb5c374a8efb3d_dpdi_image_9.webp",
    source: "https://www.dupainetdesidees.com/",
  },
  "Early June": {
    photo: "https://early-june.fr/wp-content/uploads/2020/09/Background.jpg",
    source: "https://early-june.fr/",
  },
  "Eglise Saint-Germain-des-Pres": {
    photo:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Choir_of_the_Abbey_of_Saint-Germain-des-Pr%C3%A9s%2C_Paris_July_2013.jpg/1280px-Choir_of_the_Abbey_of_Saint-Germain-des-Pr%C3%A9s%2C_Paris_July_2013.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Choir_of_the_Abbey_of_Saint-Germain-des-Pr%C3%A9s,_Paris_July_2013.jpg",
  },
  Fitzgerald: {
    photo: "https://cdn.prod.website-files.com/657ebf942cf08a351e21c1b1/69f9aac1ec8806fc5db98ecc_ChatGPT%20Image%205%20mai%202026%2C%2010_30_27.png",
    source: "https://www.fitzgerald.paris/",
  },
  "Generator Paris": {
    photo:
      "https://staygenerator.com/web/media/widget-spaces-rooms/paris/rooms-photos-2025/generator-paris-hostel-deluxe-king-room-1.jpg?mode=max&quality=100&v=202508261351",
    source: "https://staygenerator.com/hostels/paris",
  },
  "Galerie Martel": {
    photo: "https://www.galeriemartel.com/wp-content/uploads/2024/05/DC_7-1200x801.webp",
    source: "https://www.galeriemartel.com/la-galerie/",
  },
  "Gravity Bar": {
    photo: "https://media.cntraveler.com/photos/5a80a85d52e7b4436ff64db7/16:9/w_1000,c_limit/Gravity_JB-Lemal_2018_4---copie.jpg",
    source: "https://www.cntraveler.com/bars/paris/gravity-bar",
  },
  "Hardware Societe": {
    photo:
      "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=1155,fit=crop/A0xlVlXoQ0Fee1kM/dscf6837-YNq2nl68Mnfl28ap.jpg",
    source: "https://www.hardwaresociete.com/",
  },
  "Holybelly 5": {
    photo:
      "https://www.holybellycafe.com/media/uploads/20260505_161901_albindurand--_albin_----holybelly---avril-25---ID-00558---_DSC0672.jpg",
    source: "https://holybellycafe.com/",
  },
  "Hotel d'Aubusson": {
    photo:
      "https://api.pulse-cdn.com/api/v1/resize/uploads/175585-hotel-daubusson/7ad7838c-9bb5-48e6-9d34-fb729882af50.jpg-crop-1200-627-90-webp",
    source: "https://www.hoteldaubusson.com/",
  },
  "Hotel des Arts Montmartre": {
    photo: "https://d1txkfjbeeh9pc.cloudfront.net/cache/img/8af589222e4bd0bca6a45a7d26470d3c4bcf0db0-8af589-1200-627-crop.jpg?q=1713865147",
    source: "https://www.arts-hotel-paris.com/",
  },
  "Hotel des Grandes Ecoles": {
    photo:
      "https://cdn.prod.website-files.com/67befba334a0e368cac3c30a/67befba334a0e368cac3c30c_hotel%20grandes%20ecoles%20paris%20elegancia.jpg",
    source: "https://en.hoteldesgrandesecoles.com/",
  },
  "Hotel Jules and Jim": {
    photo: "https://d32rszyoapv4qs.cloudfront.net/cache/img/76a193697235133f42f40d77d57283e7035f1fbf-266727-1940-1100-crop.jpg?q=1766140173",
    source: "https://www.hoteljulesetjim.com/",
  },
  "Hotel La Comtesse": {
    photo: "https://comtesse-hotel.com/_novaimg/4504177-1382971_0_95_2200_1199_2200_1200.rc.jpg",
    source: "https://www.comtesse-hotel.com/",
  },
  "Hotel Le Walt": {
    photo: "https://d13rhhrxazfw7c.cloudfront.net/cache/img/hotel-le-walt-chambre-217527-1084-1020-crop.jpg?q=1714492253",
    source: "https://www.lewaltparis.com/",
  },
  "Hotel Les Dames du Pantheon": {
    photo: "https://www.hotellesdamesdupantheon.com/uploads/images/gallery/pantheon_Classique_02.jpg",
    source: "https://www.hotellesdamesdupantheon.com/",
  },
  "Hotel de Sully": {
    photo: "https://upload.wikimedia.org/wikipedia/commons/1/12/Sully_Garten.JPG",
    source: "https://commons.wikimedia.org/wiki/File:Sully_Garten.JPG",
  },
  "Hotel Lutetia": {
    photo: "https://media.ffycdn.net/eu/mandarin-oriental-hotel-group/Dp1L67ZGkQdRy3mcxbZo.jpg?mod=v1/contain=-x1000&quality=75",
    source: "https://www.mandarinoriental.com/en/paris/lutetia",
  },
  "Hotel Madame Reve": {
    photo: "https://madamereve.com/wp-content/uploads/2021/10/deluxe-vue-exceptionnel-atelier-3-hotel-madame-reve-2.webp",
    source: "https://madamereve.com/",
  },
  "Hotel Montalembert": {
    photo: "https://360.agencewebcom.com/web/uploads/api/site-887/0619196f06c640b1e1084ca64fcfcaf06b82797f.jpg",
    source: "https://www.hotelmontalembert-paris.com/",
  },
  "Hotel Monte Cristo": {
    photo:
      "https://api.pulse-cdn.com/api/v1/resize/uploads/153367-hotel-montecristo/b5e89c5c-97e0-46c5-94b9-b5cd8803b032.jpg-resize-900-0-90-webp",
    source: "https://www.hotelmontecristoparis.com/",
  },
  "Hotel Providence": {
    photo: "https://hotelprovidenceparis.com/wp-content/uploads/2022/10/hotel-providence-paris-classic-room-0002.jpg",
    source: "https://hotelprovidenceparis.com/",
  },
  "Hotel Regina Louvre": {
    photo: "https://hapi.mmcreation.com/hapidam/12eec0c2-0c6e-47a5-8999-bb871fab9fa6/hotel-regina-facilities-facade-012.jpg?w=1200&mode=cover&coi=50%2C50",
    source: "https://www.regina-hotel.com/",
  },
  "Hotel Rochechouart": {
    photo: "https://cdn.prod.website-files.com/654aaadae3591f971954c0a0/670fbb77632822b170bc0526_Capture%20d%E2%80%99e%CC%81cran%202024-10-16%20a%CC%80%2015.11.16.avif",
    source: "https://www.orsohotels.com/hotel-rochechouart",
  },
  "Hotel Sookie": {
    photo: "https://cdn.prod.website-files.com/6862bbb7e9136bfb00b4600f/68b98acb3823d6d605a76af6_SOOKIE%20MADEO%20BD%20%C2%A9%20Nicolas%20Anetson-7.jpg",
    source: "https://hotelsuzieblue.com/en",
  },
  "Huitrerie Regis": {
    photo: "https://huitrerie-regis.com/wp-content/uploads/2020/07/capture-decran-2020-07-07-a-17-03-52.png",
    source: "https://huitrerie-regis.com/",
  },
  "Institut de France": {
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Institut_France.jpg/960px-Institut_France.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Institut_France.jpg",
  },
  "J.K. Place Paris": {
    photo:
      "https://www.jkplaces.com/jkparis/wp-content/uploads/2025/03/JK-Palace-Parigi_0008-960x720.jpg",
    source: "https://www.jkplaces.com/jkparis/",
  },
  Juveniles: {
    photo: "https://images.squarespace-cdn.com/content/v1/56c59d0327d4bd568aa24071/1724845110981-KYTZ5BXJL4EZ0RASJQ4O/IMG_0302.jpeg",
    source: "https://www.juvenileswinebar.com/",
  },
  "L'As du Fallafel": {
    photo: "https://upload.wikimedia.org/wikipedia/commons/6/62/L%27As_du_Fallafel%2C_Paris_30_January_2017.jpg",
    source: "https://commons.wikimedia.org/wiki/File:L%27As_du_Fallafel,_Paris_30_January_2017.jpg",
  },
  "La Boite aux Lettres": {
    photo: "https://laboiteauxlettres.com/img/salle.jpg",
    source: "https://laboiteauxlettres.com/",
  },
  "La Fontaine de Mars": {
    photo: "https://www.fontaine-de-mars.com/wp-content/uploads/2025/12/DConstantini_Exterieur_6-69.jpg",
    source: "https://www.fontaine-de-mars.com/",
  },
  "La Gare / Le Gore": {
    photo: "https://res.cloudinary.com/du5jifpgg/image/upload/t_opengraph_image/Surcharge-APIDAE/La_Gare_le_Gore.jpg",
    source: "https://www.visitparisregion.com/en/la-gare-le-gore",
  },
  "La Maison d'Isabelle": {
    photo: "https://live.staticflickr.com/65535/54467619158_fef7498b48_b.jpg",
    source: "https://www.flickr.com/",
  },
  "La Meduse": {
    photo: "https://media.timeout.com/images/105202137/750/562/image.jpg",
    source: "https://www.timeout.com/paris/en/bars-and-pubs/la-meduse",
  },
  "La Perle": {
    photo: "https://www.barsparis.com/wp-content/uploads/2012/08/bar-la-perle.jpg",
    source: "https://www.barsparis.com/la-perle/",
  },
  "La Tour d'Argent": {
    photo: "https://tourdargent.com/wp-content/uploads/2023/11/HomePage_Cover_UpdateOctober2-Shade.jpg.webp",
    source: "https://tourdargent.com/",
  },
  "Laduree Champs-Elysees": {
    photo: "https://laduree.com/cdn/shop/files/yext-M3cQOx2E2GueTz8QYL46gf_PtFQu-hKdDC2T5Dzl0-4-4000x2670.jpg?v=1750779854&width=1200",
    source: "https://laduree.com/en/pages/store/laduree-paris-champs-elysees",
  },
  "Le Bar du Marche": {
    photo: "https://cdn.menu-world.com/bar-du-marche/1.jpg",
    source: "https://cdn.menu-world.com/bar-du-marche/1.jpg",
  },
  "Le Baratin": {
    photo: "https://axwwgrkdco.cloudimg.io/v7/__gmpics3__/c6696ac82c3b4f2782f69f9c7e8048aa.jpg?w=1200&h=1200&org_if_sml=1",
    source: "https://guide.michelin.com/us/en/ile-de-france/paris/restaurant/le-baratin",
  },
  "Le Caveau de la Huchette": {
    photo: "https://live.staticflickr.com/3477/3189736294_aa0bc76b82_b.jpg",
    source: "https://www.flickr.com/",
  },
  "Le Citizen Hotel": {
    photo: "https://cdn.prod.website-files.com/6890326346b61808ab3700cc/68d55164d541d1a0ab36bc0b_Citizen%C2%A9RomainRicard-17.jpg",
    source: "https://lecitizenhotel.com/",
  },
  "Le Comptoir General": {
    photo: "https://lecomptoirgeneral.com/wp-content/uploads/2021/09/@desprezmarie-lcg-shoot1-2-scaled.jpg",
    source: "https://lecomptoirgeneral.com/",
  },
  "Le Coq and Fils": {
    photo: "https://lecoq-fils.com/wp-content/uploads/2022/09/restaurant-excellence-lecoqetfils-e1663758233252.jpg",
    source: "https://lecoq-fils.com/",
  },
  "Le Coupe-Chou": {
    photo: "https://cdn.prod.website-files.com/5e6a2ea289b7cec0e283a0fa/60230d376a2c7a6af7d3177d_lecoupechou63-1500.jpg",
    source: "https://www.lecoupechou.com/",
  },
  "Le Duc des Lombards": {
    photo: "https://ducdeslombards.com/sites/default/files/ducdeslombards/styles/auto_1920/public/ged/img_2005.jpg?itok=ipUunJnW",
    source: "https://ducdeslombards.com/",
  },
  "Le Fumoir": {
    photo: "https://www.lefumoir.com/wp-content/uploads/2021/08/bg_06.jpg",
    source: "https://www.lefumoir.com/",
  },
  "Le Grand Mazarin": {
    photo: "https://www.legrandmazarin.com/wp-content/uploads/2024/06/onglets-bien-etre.jpg",
    source: "https://www.legrandmazarin.com/",
  },
  "Le Meurice": {
    photo: "https://www.dorchestercollection.com/media/4jvbro04/le-meurice-lobby-the-kiss-wide-hr-by-mark-read.jpg?format=webp&rmode=crop",
    source: "https://www.dorchestercollection.com/paris/le-meurice/",
  },
  "Le Nemours": {
    photo: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/26/c1/20/74/terrasse.jpg?w=900&h=-1&s=1",
    source: "https://www.tripadvisor.com/",
  },
  "Le Piano Vache": {
    photo: "https://www.lepianovache.fr/wp-content/uploads/2019/02/cropped-wolfgang-hasselmann-1266795-unsplash-1.jpg",
    source: "https://www.lepianovache.fr/",
  },
  "Le Poulbot": {
    photo: "https://lepoulbot.com/wp-content/uploads/2017/11/Post_1_Deux_Poulbot.jpg",
    source: "https://lepoulbot.com/",
  },
  "Le Recrutement Cafe": {
    photo: "https://upload.wikimedia.org/wikipedia/commons/3/34/Le_Recrutement_Cafe_in_Paris.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Le_Recrutement_Cafe_in_Paris.jpg",
  },
  "Le Requin Chagrin": {
    photo: "https://upload.wikimedia.org/wikipedia/commons/5/53/CF1505_Paris_5e_place_Contrescarpe_Requin_Chagrin_rwk.jpg",
    source: "https://commons.wikimedia.org/wiki/File:CF1505_Paris_5e_place_Contrescarpe_Requin_Chagrin_rwk.jpg",
  },
  "Le Tres Particulier": {
    photo: "https://1e64.net/lw-hpm-48dbc2/uploads/bar-piano-tres-particulier-hotel-particulier-montmartre-NVo5.webp",
    source: "https://www.hotelparticulier.com/tresparticulier.html",
  },
  "Le Village Montmartre": {
    photo: "https://www.villagehostel.fr/wp-content/uploads/2019/11/Terrasse-4-Village-2019-Large-1024x683.jpg",
    source: "https://www.villagehostel.fr/",
  },
  "Les Invalides": {
    photo:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/H%C3%B4tel_des_Invalides%2C_North_View%2C_Paris_7e_140402_1.jpg/1920px-H%C3%B4tel_des_Invalides%2C_North_View%2C_Paris_7e_140402_1.jpg",
    source: "https://commons.wikimedia.org/wiki/File:H%C3%B4tel_des_Invalides,_North_View,_Paris_7e_140402_1.jpg",
  },
  "Les Ombres": {
    photo: "https://www.lesombres-restaurant.com/wp-content/uploads/2022/11/Les_Ombres_20-10-20-@-Julien-Mouffron-Gardner_7616-1-1200x730.jpg",
    source: "https://www.lesombres-restaurant.com/",
  },
  "Madison Hotel": {
    photo: "https://cdn.prod.website-files.com/698a0b7e7e2005d6daeaa106/698b521d47a7208810e8d244_hotel-madison-chambre-2.avif",
    source: "https://www.hotel-madison.com/",
  },
  "Marlusse et Lapin": {
    photo: "https://privateaser-media.s3.eu-west-1.amazonaws.com/etab_photos/3188/1500x750/316436.jpg",
    source: "https://www.privateaser.com/lieu/3188-marlusse-et-lapin",
  },
  "Marche des Enfants Rouges": {
    photo: "https://res.cloudinary.com/du5jifpgg/image/upload/t_opengraph_image/Surcharge-APIDAE/marche-des-enfants-rouges-tablee.jpg",
    source: "https://www.visitparisregion.com/en/marche-des-enfants-rouges",
  },
  "Maison de Victor Hugo": {
    photo:
      "https://www.maisonsvictorhugo.paris.fr/sites/default/files/styles/1440x760/public/images/2022-11/hauteville_guide_salle_a_manger_14042019_8732.jpg?h=bc816b12&itok=_X-19vKJ",
    source: "https://www.maisonsvictorhugo.paris.fr/",
  },
  "MIJE Marais": {
    photo: "https://images.pexels.com/photos/10595335/pexels-photo-10595335.jpeg",
    source: "https://www.pexels.com/photo/10595335/",
  },
  "Mom'Art Hotel": {
    photo: "https://www.hotelmomart.com/wp-content/uploads/sites/544/2023/05/FR-Paris-Hotel-Mom-Art-Patio-3728-scaled.jpg",
    source: "https://www.hotelmomart.com/en/",
  },
  "Monnaie de Paris": {
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Monnaie_de_Paris.jpg/500px-Monnaie_de_Paris.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Monnaie_de_Paris.jpg",
  },
  "Moulin de la Galette": {
    photo: "https://moulindelagaletteparis.com/wp-content/uploads/2025/06/moulin-06-scaled.jpg",
    source: "https://moulindelagaletteparis.com/",
  },
  "Musee Carnavalet": {
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Carnavalet_Par%C3%ADs_10.JPG/3840px-Carnavalet_Par%C3%ADs_10.JPG",
    source: "https://commons.wikimedia.org/wiki/File:Carnavalet_Par%C3%ADs_10.JPG",
  },
  "Musee Picasso Paris": {
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/5_Rue_de_Thorigny%2C_Paris_%2812%29.jpg/1280px-5_Rue_de_Thorigny%2C_Paris_%2812%29.jpg",
    source: "https://commons.wikimedia.org/wiki/File:5_Rue_de_Thorigny,_Paris_(12).jpg",
  },
  "Musee Rodin": {
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/The_Kiss.JPG/1280px-The_Kiss.JPG",
    source: "https://commons.wikimedia.org/wiki/File:The_Kiss.JPG",
  },
  "Musee Rodin Sculpture Garden": {
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/The_Kiss.JPG/1280px-The_Kiss.JPG",
    source: "https://commons.wikimedia.org/wiki/File:The_Kiss.JPG",
  },
  "Musee d'Orsay": {
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/MuseeDOrsay.jpg/3840px-MuseeDOrsay.jpg",
    source: "https://commons.wikimedia.org/wiki/File:MuseeDOrsay.jpg",
  },
  "Musee de Cluny": {
    photo:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/The_Lady_and_the_Unicorn_Tapestries%2C_Paris_9_July_2015.jpg/3840px-The_Lady_and_the_Unicorn_Tapestries%2C_Paris_9_July_2015.jpg",
    source: "https://commons.wikimedia.org/wiki/File:The_Lady_and_the_Unicorn_Tapestries,_Paris_9_July_2015.jpg",
  },
  "Musee de Montmartre": {
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Swing-Renoir.jpeg/1280px-Swing-Renoir.jpeg",
    source: "https://commons.wikimedia.org/wiki/File:Swing-Renoir.jpeg",
  },
  "Musee de l'Orangerie": {
    photo: "https://cdn.mediatheque.epmoo.fr/link/jmn19ajgq2pe6u8.jpg",
    source: "https://www.musee-orangerie.fr/",
  },
  "Musee du Louvre": {
    photo:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Louvre_Museum%2C_Paris_22_June_2014.jpg/1280px-Louvre_Museum%2C_Paris_22_June_2014.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail",
    source: "https://commons.wikimedia.org/wiki/File:Louvre_Museum,_Paris_22_June_2014.jpg",
  },
  "Musee national Eugene-Delacroix": {
    photo: "https://www.musee-delacroix.fr/local/cache-responsive/cache-1920/3beb74c590519a4a9d1a7b223232c9eb.jpg.webp?1777884936",
    source: "https://www.musee-delacroix.fr/",
  },
  "Notre-Dame Cathedral": {
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Notre-Dame_de_Paris_2013-07-24.jpg/1280px-Notre-Dame_de_Paris_2013-07-24.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Notre-Dame_de_Paris_2013-07-24.jpg",
  },
  "Palace of Versailles": {
    photo:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Chateau_Versailles_Galerie_des_Glaces.jpg/1280px-Chateau_Versailles_Galerie_des_Glaces.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Chateau_Versailles_Galerie_des_Glaces.jpg",
  },
  "Palais Garnier": {
    photo: "https://upload.wikimedia.org/wikipedia/commons/0/06/Palais_Garnier_auditorium_and_stage.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Palais_Garnier_auditorium_and_stage.jpg",
  },
  "Palais Royal": {
    photo: "https://upload.wikimedia.org/wikipedia/commons/8/85/Conseil_d%27Etat_Paris_WA.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Conseil_d%27Etat_Paris_WA.jpg",
  },
  Pantheon: {
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Panth%C3%A9on_de_Paris_2012-10-11_n1.jpg/3840px-Panth%C3%A9on_de_Paris_2012-10-11_n1.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Panth%C3%A9on_de_Paris_2012-10-11_n1.jpg",
  },
  "Paris Catacombs": {
    photo:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Catacumbas%2C_Par%C3%ADs%2C_Francia%2C_2022-11-01%2C_DD_105-107_HDR.jpg/3840px-Catacumbas%2C_Par%C3%ADs%2C_Francia%2C_2022-11-01%2C_DD_105-107_HDR.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Catacumbas,_Par%C3%ADs,_Francia,_2022-11-01,_DD_105-107_HDR.jpg",
  },
  "Place de la Republique": {
    photo: "https://upload.wikimedia.org/wikipedia/commons/1/10/Place_de_la_Republique%2C_Monument_for_Gloire_de_la_Republique_Francaise_%282%29.JPG",
    source: "https://commons.wikimedia.org/wiki/File:Place_de_la_Republique,_Monument_for_Gloire_de_la_Republique_Francaise_(2).JPG",
  },
  "Place de la Sorbonne": {
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Place_de_la_Sorbonne%2C_Paris_5e.jpg/3840px-Place_de_la_Sorbonne%2C_Paris_5e.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Place_de_la_Sorbonne,_Paris_5e.jpg",
  },
  "Place du Tertre": {
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Restaurants%2C_Place_du_Tertre%2C_Paris_30_September_2019.jpg/960px-Restaurants%2C_Place_du_Tertre%2C_Paris_30_September_2019.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Restaurants,_Place_du_Tertre,_Paris_30_September_2019.jpg",
  },
  Parcelles: {
    photo: "https://www.parcelles-paris.fr/i/parcelles/3/5/4/8/8/6/1/5/1/1/2/5/3/1616675932_336/a6fafd739cd7f9e24bc0afe3dc6f42e2.small_original.jpg",
    source: "https://www.parcelles-paris.fr/en/",
  },
  "Pierre Herme Bonaparte": {
    photo: "https://www.pierreherme.com/media/amasty/ammegamenu/Food/macarons-signatures.jpg",
    source: "https://www.pierreherme.com/en/",
  },
  "Point Ephemere": {
    photo: "https://www.pointephemere.org/images/batiment.jpg",
    source: "https://www.pointephemere.org/",
  },
  Poilane: {
    photo: "https://a.storyblok.com/f/141505/1200x800/1f1eb46f4b/miche-poilane-jf-aime-b-verlomme.jpg",
    source: "https://www.poilane.com/",
  },
  "Prescription Cocktail Club": {
    photo:
      "https://cdn.prod.website-files.com/67b6fce677eb54f5aa34dce0/67b6fce677eb54f5aa34dd0d_prescription%20coctail%20club%20%C2%A9%20patrick%20locqueneux-%20mrtripper-1%201.jpg",
    source: "https://www.prescriptioncocktailclub.com/",
  },
  "Relais Christine": {
    photo: "https://images.trvl-media.com/lodging/11000000/10370000/10369100/10369036/1b28040f.jpg?impolicy=resizecrop&rw=1200&ra=fit",
    source: "https://www.hotels.com/ho506523/relais-christine-paris-france/",
  },
  "Rosa Bonheur sur Seine": {
    photo: "https://rosabonheur.fr/wp-content/uploads/2024/06/Seine-RosaB-0822-LevietPhoto-8955-uai-2133x1600.jpg",
    source: "https://www.rosabonheur.fr/lieu/rosa-sur-seine/",
  },
  Sanukiya: {
    photo:
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Sanukiya%2C%20Paris%2C%2019%20March%202016.jpg?width=1200",
    source: "https://commons.wikimedia.org/wiki/Category:Sanukiya",
  },
  Semilla: {
    photo: "https://cdn.prod.website-files.com/624f207df2b57804135dc63e/6713ef61488d938173013eef_DSC07439.jpg",
    source: "https://www.semillaparis.com/",
  },
  Septime: {
    photo:
      "https://media.cntraveler.com/photos/5a81fbb48ea5f04e2cf773a0/16:9/w_2240,c_limit/Septime__2018_colvert,-echalotte-roti,-condiment-figue-et-jus-a%CC%80-la-genievre-.jpg",
    source: "https://www.cntraveler.com/",
  },
  "Septime La Cave": {
    photo: "https://parisbymouth.com/wp-content/uploads/2014/09/septime-cave-for-pbm.jpg",
    source: "https://parisbymouth.com/septime-cave/",
  },
  "Shakespeare and Company": {
    photo: "https://www.shakespeareandcompany.com/media/general/_2680x1608_crop_center-center_none/178/b64bf78e-92ff-4d15-b8b0-e3f6e795cdf0.jpg",
    source: "https://www.shakespeareandcompany.com/",
  },
  "Sainte-Chapelle": {
    photo:
      "https://www.sainte-chapelle.fr/var/cmn_inter/storage/images/_aliases/homepage_banner_webp/7/3/8/9/122049837-2-fre-FR/1790805e9cd3-page-accueil-sainte-chapelle.webp.webp",
    source: "https://www.sainte-chapelle.fr/",
  },
  "Seine Bookstalls and Quays": {
    photo:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Paris_75005_Quai_de_Montebello_Bouquinistes_20071014.jpg/1280px-Paris_75005_Quai_de_Montebello_Bouquinistes_20071014.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Paris_75005_Quai_de_Montebello_Bouquinistes_20071014.jpg",
  },
  "Sorbonne Chapel and Place de la Sorbonne": {
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Place_de_la_Sorbonne%2C_Paris_5e.jpg/3840px-Place_de_la_Sorbonne%2C_Paris_5e.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Place_de_la_Sorbonne,_Paris_5e.jpg",
  },
  "St Christopher's Inn Canal": {
    photo: "https://images.ctfassets.net/wqkd101r9z5s/7JuethZ3p5V7zQHyubsMIM/d25dad4126547d595f20cea943636537/iStock-1133449890_copy.jpg?w=720&q=85",
    source: "https://www.st-christophers.co.uk/paris/canal-hostel/",
  },
  "Teddy's Bar": {
    photo: "https://storage.googleapis.com/schlouk-map/cache/gallery/uploads/images/places/teddys-bar-620cf617b686b5.56325506.jpeg",
    source: "https://www.schlouk-map.com/en/places/teddys-bar",
  },
  "Terrass Hotel": {
    photo: "https://cdn.prod.website-files.com/67c6b692ecd52285b2aee65e/67c6b692ecd52285b2aeebeb_62e017535f238d181d78c820_test_2_1_1_.webp",
    source: "https://www.terrass-hotel.com/",
  },
  "Terrass Hotel Rooftop": {
    photo: "https://cdn.prod.website-files.com/67c6b692ecd52285b2aee65e/6924760508778a8ff8ffe1d7_5.png",
    source: "https://www.terrass-hotel.com/",
  },
  "The Cambridge Public House": {
    photo:
      "https://assets.softr-files.com/applications/c2cee8a4-259a-4091-b855-5852ab255c78/assets/520508b0-b7e0-4eb3-a200-83352def6907.jpeg",
    source: "https://www.thecambridge.paris/en/",
  },
  "The Hoxton Paris": {
    photo: "https://thehoxton.com/wp-content/uploads/sites/5/2025/04/New-Project-2.jpg?w=1300&quality=70",
    source: "https://thehoxton.com/paris/",
  },
  "The People Paris Belleville": {
    photo: "https://www.thepeoplehostel.com/wp-content/uploads/2025/06/LivelyBackground-04_2_11zon.jpg",
    source: "https://www.thepeoplehostel.com/en/destinations/paris-belleville/",
  },
  Verjus: {
    photo:
      "https://images.squarespace-cdn.com/content/v1/59d4c7672278e78c2beb5c7b/1768840776711-IQCEW7IJOROP4YTNPQOL/05-LClavisyFarmPlate.jpg?format=2500w",
    source: "https://www.verjusparis.com/",
  },
  "Young and Happy Latin Quarter": {
    photo: "https://www.youngandhappy.fr/wp-content/uploads/2024/01/dortoir-femme-4-1024x682.jpg",
    source: "https://www.youngandhappy.fr/",
  },
};

const googleMaps: ListSource = { name: "Google Maps", url: "https://maps.google.com" };

const parisFoodSources: ListSource[] = [
  { name: "Eater - Best Restaurants in Paris", url: "https://www.eater.com/maps/best-restaurants-paris-france" },
  { name: "Eater - Paris", url: "https://www.eater.com/paris" },
  { name: "The Infatuation - Paris", url: "https://www.theinfatuation.com/paris" },
  { name: "The Infatuation - Le Marais", url: "https://www.theinfatuation.com/paris/neighborhoods/le-marais" },
  { name: "MICHELIN Guide - Paris restaurants", url: "https://guide.michelin.com/us/en/ile-de-france/paris/restaurants" },
  { name: "Time Out - Paris restaurants", url: "https://www.timeout.com/paris/en/restaurants" },
  googleMaps,
];

const parisBoulangerieSources: ListSource[] = [
  { name: "Du Pain et des Idees official", url: "https://www.dupainetdesidees.com/" },
  { name: "Poilane official", url: "https://www.poilane.com/" },
  { name: "Holybelly official", url: "https://holybellycafe.com/" },
  { name: "Eater - Best Restaurants in Paris", url: "https://www.eater.com/maps/best-restaurants-paris-france" },
  googleMaps,
];

const parisBrasserieSources: ListSource[] = [
  { name: "Bouillon Chartier official", url: "https://www.bouillon-chartier.com/en/" },
  { name: "Brasserie Lipp official", url: "https://www.brasserielipp.fr/" },
  { name: "Bouillon Racine official", url: "https://www.bouillonracine.fr/" },
  { name: "The Infatuation - Paris", url: "https://www.theinfatuation.com/paris" },
  googleMaps,
];

const parisPatisserieSources: ListSource[] = [
  { name: "Angelina official", url: "https://www.angelina-paris.fr/" },
  { name: "Pierre Herme official", url: "https://www.pierreherme.com/en/" },
  { name: "Laduree Champs-Elysees official", url: "https://laduree.com/en/pages/store/laduree-paris-champs-elysees" },
  { name: "Eater - Best Restaurants in Paris", url: "https://www.eater.com/maps/best-restaurants-paris-france" },
  googleMaps,
];

const parisNightlifeSources: ListSource[] = [
  { name: "The World's 50 Best Bars - Bar Nouveau", url: "https://www.theworlds50best.com/bars/the-list/bar-nouveau.html" },
  { name: "The World's 50 Best Bars - The Cambridge Public House", url: "https://www.theworlds50best.com/bars/the-list/the-cambridge-public-house.html" },
  { name: "The World's 50 Best Bars - Danico", url: "https://www.theworlds50best.com/bars/the-list/danico.html" },
  { name: "Time Out - Best cocktail bars in Paris", url: "https://www.timeout.com/paris/en/bars-pubs/best-cocktail-bars-in-paris" },
  { name: "Time Out - Canal Saint-Martin bars", url: "https://www.timeout.com/paris/en/bars-pubs/bars-in-canal-saint-martin-ourcq-villette" },
  { name: "Visit Paris Region - La Gare / Le Gore", url: "https://www.visitparisregion.com/en/la-gare-le-gore" },
  googleMaps,
];

const parisLiveNightlifeSources: ListSource[] = [
  { name: "Le Duc des Lombards official", url: "https://ducdeslombards.com/" },
  { name: "Visit Paris Region - La Gare / Le Gore", url: "https://www.visitparisregion.com/en/la-gare-le-gore" },
  { name: "Le Caveau de la Huchette official", url: "https://www.caveaudelahuchette.fr/" },
  { name: "Au Lapin Agile official", url: "https://au-lapin-agile.com/" },
  { name: "Point Ephemere official", url: "https://pointephemere.org/" },
  googleMaps,
];

const parisLowKeyNightlifeSources: ListSource[] = [
  { name: "BarsParis - Marlusse et Lapin", url: "https://www.barsparis.com/bar-paris/marlusse-et-lapin/" },
  { name: "Le Piano Vache official", url: "https://www.lepianovache.fr/" },
  { name: "MisterGoodBeer - Marlusse et Lapin", url: "https://www.mistergoodbeer.com/en/bars/marlusse-et-lapin-paris" },
  { name: "Time Out - Paris bars", url: "https://www.timeout.com/paris/en/bars-pubs" },
  googleMaps,
];

const parisCultureSources: ListSource[] = [
  { name: "Louvre - Hours and admission", url: "https://www.louvre.fr/en/visit/hours-admission" },
  { name: "Musee d'Orsay - Visit", url: "https://www.musee-orsay.fr/en/visit" },
  { name: "Notre-Dame de Paris - Practical information", url: "https://www.notredamedeparis.fr/en/visit/practical-information/" },
  { name: "Chateau de Versailles - Practical information", url: "https://en.chateauversailles.fr/plan-your-visit/practical-information" },
  { name: "Eiffel Tower official visit guide", url: "https://www.toureiffel.paris/en/news/visit" },
  { name: "Paris je t'aime - Place des Vosges", url: "https://parisjetaime.com/eng/transport/place-des-vosges-p1907" },
  { name: "Sacre-Coeur Montmartre official", url: "https://www.sacre-coeur-montmartre.com/" },
  { name: "Paris Opera - Visit the Palais Garnier", url: "https://www.operadeparis.fr/en/visits/visit-and-explore/visit-the-palais-garnier" },
  { name: "Paris Catacombs official", url: "https://www.catacombes.paris.fr/en" },
  { name: "Musee Rodin - Plan your visit", url: "https://www.musee-rodin.fr/en/plan-your-visit/plan-your-visit-musee-rodin" },
  { name: "Sorbonne guided visits", url: "https://www.sorbonne.fr/la-sorbonne/visiter-la-sorbonne/visite-sorbonne-palais-academique/" },
  { name: "Galerie Martel official", url: "https://www.galeriemartel.com/la-galerie/" },
  googleMaps,
];

const parisNatureSources: ListSource[] = [
  { name: "Ville de Paris - Parc des Buttes-Chaumont", url: "https://www.paris.fr/equipements/parc-des-buttes-chaumont-1757" },
  { name: "Ville de Paris - Coulee verte Rene Dumont", url: "https://www.paris.fr/lieux/coulee-verte-rene-dumont-1772" },
  { name: "Ville de Paris - Pere-Lachaise", url: "https://www.paris.fr/lieux/cimetiere-du-pere-lachaise-4080" },
  { name: "Paris je t'aime - Pere-Lachaise", url: "https://parisjetaime.com/eng/paris-museum-monument/71470/Cimetiere-du-Pere-Lachaise" },
  { name: "Louvre - Tuileries Garden hours", url: "https://www.louvre.fr/en/visit/hours-admission" },
  googleMaps,
];

const parisStaySources: ListSource[] = [
  { name: "Conde Nast Traveler - Best hotels in Paris", url: "https://www.cntraveler.com/gallery/best-hotels-in-paris" },
  { name: "Hostelworld - Paris hostels", url: "https://www.hostelworld.com/hostels/Paris" },
  { name: "The Times - Best hotels in Paris 2026", url: "https://www.thetimes.com/travel/destinations/europe-travel/france/paris/best-hotels-in-paris-65dngr3zt" },
  { name: "Tripadvisor - Paris hotels", url: "https://www.tripadvisor.com/Hotels-g187147-Paris_Ile_de_France-Hotels.html" },
  googleMaps,
];

type StopSeed = Omit<GuideStop, "photo" | "hours"> & {
  photo?: string;
  hours?: GuideStop["hours"];
};

const hotelStay = { venueKind: "lodging", lodgingType: "hotel" } as const;
const hostelStay = { venueKind: "lodging", lodgingType: "hostel" } as const;
const lodgingHours = {
  default:
    "24-hour guest operation; check-in, front-desk, late-arrival, and amenity schedules are controlled by the official property or booking page.",
} satisfies GuideStop["hours"];

type GuideSeed = {
  id: string;
  slug: string;
  seoSlug: string;
  seoTitle: string;
  seoDescription: string;
  title: string;
  description: string;
  url: string;
  category: EditorialCategory;
  neighborhood?: string;
  stops: StopSeed[];
  sources: ListSource[];
};

type NeighborhoodGuideOptions = {
  idTopic?: string;
  slugTopic?: string;
  seoSlug?: string;
  seoTitle?: string;
  seoDescription?: string;
};

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function defaultPhoto(category: EditorialCategory) {
  if (category === "Food") return photos.food;
  if (category === "Nightlife") return photos.nightlife;
  if (category === "Stay") return photos.stay;
  if (category === "Nature") return photos.nature;
  if (category === "Activities") return photos.activities;
  return photos.culture;
}

function poiPhotoFor(name: string) {
  return poiPhotoSources[name]?.photo;
}

function inferredHoursForStop(seed: StopSeed): GuideStop["hours"] | undefined {
  if (seed.venueKind === "lodging") return lodgingHours;
  return undefined;
}

function stop(seed: StopSeed, category: EditorialCategory): GuideStop {
  const hours = seed.hours ?? inferredHoursForStop(seed);
  return {
    ...seed,
    photo: seed.photo ?? poiPhotoFor(seed.name) ?? defaultPhoto(category),
    ...(hours ? { hours } : {}),
  };
}

function guide(seed: GuideSeed): MapList {
  return {
    id: seed.id,
    slug: seed.slug,
    seoSlug: seed.seoSlug,
    seoTitle: seed.seoTitle,
    seoDescription: seed.seoDescription,
    title: seed.title,
    description: seed.description,
    url: seed.url,
    category: seed.category,
    location: {
      city: "Paris",
      neighborhood: seed.neighborhood,
      country: "France",
      continent: "Europe",
      scope: "city",
    },
    creator: creators[seed.category],
    upvotes: 0,
    createdAt,
    stops: seed.stops.map((item) => stop(item, seed.category)),
    sources: seed.sources,
  };
}

function neighborhoodGuide(
  neighborhood: string,
  category: EditorialCategory,
  topic: string,
  stops: StopSeed[],
  title: string,
  description: string,
  sources: ListSource[],
  options: NeighborhoodGuideOptions = {},
) {
  const neighborhoodSlug = slugify(neighborhood);
  const idTopic = options.idTopic ?? topic;
  const slugTopic = options.slugTopic ?? topic;
  const idTopicSlug = slugify(idTopic);
  const slugTopicSlug = slugify(slugTopic);
  const seoSlug =
    options.seoSlug ??
    (category === "Food"
      ? "best-restaurants"
      : category === "Nightlife"
        ? "best-bars"
        : category === "Stay"
          ? topic.toLowerCase().includes("hostel")
            ? "best-hostels"
            : "best-hotels"
          : category === "Culture"
            ? "best-culture"
            : category === "Nature"
              ? "best-parks"
              : "best-things-to-do");

  return guide({
    id: `list-paris-${neighborhoodSlug}-${idTopicSlug}`,
    slug: `paris-${neighborhoodSlug}-${slugTopicSlug}`,
    seoSlug,
    seoTitle: options.seoTitle ?? `Best ${topic} in ${neighborhood}, Paris`,
    seoDescription:
      options.seoDescription ??
      `Best ${topic.toLowerCase()} in ${neighborhood}, Paris, with neighborhood-specific places and practical visit details.`,
    title,
    description,
    url: `https://www.google.com/maps/search/${encodeURIComponent(`${neighborhood} ${topic} Paris`)}`,
    category,
    neighborhood,
    stops,
    sources,
  });
}

const citywideFood: StopSeed[] = [
  {
    id: "paris-food-bistrot-tournelles",
    name: "Bistrot des Tournelles",
    coordinates: [48.8555, 2.366],
    description:
      "Bistrot des Tournelles serves steak frites and terrines in a classic Marais bistro room where reservations protect a proper meal from the neighborhood's crowded walk-in circuit.",
    price: "$$",
    priceSource: "The Infatuation / Google Maps",
  },
  {
    id: "paris-food-brasserie-lipp",
    name: "Brasserie Lipp",
    coordinates: [48.8535, 2.3332],
    description:
      "Brasserie Lipp serves Alsatian-leaning classics in a polished Saint-Germain room with literary history and a durable see-and-be-seen crowd. Book it when boulevard atmosphere matters as much as the plate.",
    price: "$$$",
    priceSource: "The Infatuation / Google Maps",
  },
  {
    id: "paris-food-le-baratin",
    name: "Le Baratin",
    coordinates: [48.8731, 2.3857],
    description:
      "Le Baratin is Raquel Carena's Belleville bistro, known for personal blackboard cooking, restrained prices, and an appealing natural-wine list. Seasonal plates and an unpolished dining room keep the experience closer to a neighborhood restaurant than a trophy reservation.",
    price: "$$",
    priceSource: "Eater / Time Out / MICHELIN Guide",
  },
  {
    id: "paris-food-septime",
    name: "Septime",
    coordinates: [48.8535, 2.3829],
    description:
      "Septime is Bertrand Grebaut's one-star restaurant in the 11th, pairing seasonal cooking with a calm industrial room near Charonne. Reservations are difficult and worth securing early for one of contemporary Paris's most exacting menus.",
    price: "$$$",
    priceSource: "MICHELIN Guide / Eater",
  },
  {
    id: "paris-food-clamato",
    name: "Clamato",
    coordinates: [48.8536, 2.3828],
    description:
      "Clamato is Septime's seafood-focused sibling, the MICHELIN-noted room for oysters, crudo, shellfish, vegetables, and share plates without a formal tasting menu.",
    price: "$$",
    priceSource: "MICHELIN Guide / Paris by Mouth",
  },
  {
    id: "paris-food-du-pain-idees",
    name: "Du Pain et des Idees",
    coordinates: [48.8719, 2.3622],
    description:
      "Du Pain et des Idees is a Canal Saint-Martin boulangerie for pain des amis, escargot pastries, and a morning that starts with craft rather than convenience.",
    price: "$",
    priceSource: "Eater / Google Maps",
  },
  {
    id: "paris-food-david-toutain",
    name: "David Toutain",
    coordinates: [48.8617, 2.3048],
    description:
      "David Toutain serves highly composed seasonal tasting menus near Invalides, with vegetables, texture, and a nature-driven point of view shaping the kitchen's fine-dining style.",
    price: "$$$",
    priceSource: "MICHELIN Guide / David Toutain official",
  },
];

const citywideBoulangerieFood: StopSeed[] = [
  {
    id: "paris-food-boulangerie-du-pain-idees",
    name: "Du Pain et des Idees",
    coordinates: [48.8719, 2.3622],
    description:
      "Du Pain et des Idees is a citywide boulangerie for pain des amis, buttery escargot pastries, and a Canal Saint-Martin morning with purpose.",
    price: "$",
    priceSource: "Eater / official bakery site / Google Maps",
  },
  {
    id: "paris-food-boulangerie-poilane",
    name: "Poilane",
    coordinates: [48.8499, 2.3261],
    description:
      "Poilane gives the Left Bank its legendary sourdough, apple tarts, and serious bread counter on Rue du Cherche-Midi.",
    price: "$",
    priceSource: "Official bakery site / Google Maps",
  },
  {
    id: "paris-food-boulangerie-maison-isabelle",
    name: "La Maison d'Isabelle",
    coordinates: [48.8498, 2.3486],
    description:
      "La Maison d'Isabelle is a Latin Quarter bakery known for high-quality croissants and quick counter breakfasts near the Pantheon, Cluny, and Mouffetard.",
    price: "$",
    priceSource: "Google Maps / Paris bakery guides",
  },
  {
    id: "paris-food-boulangerie-holybelly",
    name: "Holybelly 5",
    coordinates: [48.8723, 2.3606],
    description:
      "Holybelly 5 is a seated breakfast cafe near Canal Saint-Martin known for pancakes, eggs, seasonal plates, and carefully made coffee. The full-service format suits anyone who wants more than a pastry at the counter.",
    price: "$$",
    priceSource: "Official cafe site / Google Maps",
  },
];

const citywideBrasserieFood: StopSeed[] = [
  {
    id: "paris-food-brasserie-chartier",
    name: "Bouillon Chartier Grands Boulevards",
    coordinates: [48.8738, 2.3439],
    description:
      "Bouillon Chartier Grands Boulevards is the historic bouillon for French onion soup, steak frites, and a room that turns efficiency into theatre. It is useful when a traditional Paris meal should be affordable, central, and lively.",
    price: "$",
    priceSource: "Official restaurant site / Google Maps",
  },
  {
    id: "paris-food-brasserie-lipp-guide",
    name: "Brasserie Lipp",
    coordinates: [48.8535, 2.3332],
    description:
      "Brasserie Lipp is a polished Saint-Germain institution serving Alsatian-leaning classics in a literary boulevard room that remains part of the city's dining memory.",
    price: "$$$",
    priceSource: "The Infatuation / Google Maps",
  },
  {
    id: "paris-food-brasserie-bouillon-racine",
    name: "Bouillon Racine",
    coordinates: [48.849, 2.341],
    description:
      "Bouillon Racine brings Art Nouveau detail and classic comfort to the Latin Quarter, making it a good brasserie-style stop near Odeon, Cluny, and the Sorbonne.",
    price: "$$",
    priceSource: "Official restaurant site / Google Maps",
  },
  {
    id: "paris-food-brasserie-fontaine-mars",
    name: "La Fontaine de Mars",
    coordinates: [48.8587, 2.3044],
    description:
      "La Fontaine de Mars is the Rue Saint-Dominique classic for duck, cassoulet, steak, and a room that still works as neighborhood dining despite its Eiffel-side address.",
    price: "$$$",
    priceSource: "Official restaurant site / Google Maps",
  },
];

const citywidePatisserieFood: StopSeed[] = [
  {
    id: "paris-food-patisserie-angelina",
    name: "Angelina",
    coordinates: [48.8651, 2.3286],
    description:
      "Angelina stages the grand Paris tea-room ritual through thick hot chocolate, Mont-Blanc, pastries, and an ornate Rue de Rivoli dining room.",
    price: "$$",
    priceSource: "Official tea-room site / Google Maps",
  },
  {
    id: "paris-food-patisserie-pierre-herme",
    name: "Pierre Herme Bonaparte",
    coordinates: [48.8516, 2.3333],
    description:
      "Pierre Herme Bonaparte is a polished Left Bank patisserie known for macarons, chocolate, and flavor combinations that treat pastry as design. It is a boutique counter rather than a casual neighborhood bakery.",
    price: "$$",
    priceSource: "Official patisserie site / Google Maps",
  },
  {
    id: "paris-food-patisserie-laduree",
    name: "Laduree Champs-Elysees",
    coordinates: [48.8704, 2.3069],
    description:
      "Laduree Champs-Elysees is the famous macaron house in its polished avenue form, with ornate tea-room service, pastries, and gift boxes near the Arc de Triomphe side.",
    price: "$$",
    priceSource: "Official patisserie site / Google Maps",
  },
  {
    id: "paris-food-patisserie-du-pain-idees",
    name: "Du Pain et des Idees",
    coordinates: [48.8719, 2.3622],
    description:
      "Du Pain et des Idees is as strong on viennoiserie as bread, especially its spiral escargot pastries and pain des amis. The Canal Saint-Martin bakery is compact, craft-led, and focused on a short, recognizable range.",
    price: "$",
    priceSource: "Official bakery site / Google Maps",
  },
];

const citywideNightlife: StopSeed[] = [
  {
    id: "paris-nightlife-bar-nouveau",
    name: "Bar Nouveau",
    coordinates: [48.8623, 2.3579],
    description:
      "Bar Nouveau is a stylish Marais bar for Art Nouveau design, producer-led cocktails upstairs, and a six-cocktail set-menu experience downstairs on weekends.",
    price: "$$$",
    priceSource: "World's 50 Best Bars",
  },
  {
    id: "paris-nightlife-cambridge",
    name: "The Cambridge Public House",
    coordinates: [48.8618, 2.3632],
    description:
      "The Cambridge Public House calls itself a cocktail pub, which is exactly the lane: pub ease, rotating cocktail creations, craft beers, natural wines, snacks, and Guinness in the Marais. It suits groups that want quality without turning the night precious.",
    price: "$$",
    priceSource: "World's 50 Best Bars",
  },
  {
    id: "paris-nightlife-danico",
    name: "Danico",
    coordinates: [48.8666, 2.3399],
    description:
      "Danico is the polished Galerie Vivienne destination backed by World 50 Best, useful for a hidden-room feel near Palais Royal, Bourse, or the covered passages. It is more special-occasion glam than loose neighborhood hang.",
    price: "$$$",
    priceSource: "World's 50 Best Bars",
  },
  {
    id: "paris-nightlife-septime-cave",
    name: "Septime La Cave",
    coordinates: [48.8539, 2.3823],
    description:
      "Septime La Cave gives the 11th a wine-led first or final stop near the Charonne restaurant cluster. Save it when natural wine, small plates, and a standing-room mood suit the night better than a full second dinner or a polished cocktail lounge.",
    price: "$$",
    priceSource: "Eater / Google Maps",
  },
  {
    id: "paris-nightlife-duc-lombards",
    name: "Le Duc des Lombards",
    coordinates: [48.8593, 2.3476],
    description:
      "Le Duc des Lombards is a central live-music venue, built for a ticketed set rather than a loose bar crawl.",
    price: "$$",
    priceSource: "Paris venue listings / Google Maps",
  },
  {
    id: "paris-nightlife-la-gare-le-gore",
    name: "La Gare / Le Gore",
    coordinates: [48.8927, 2.3839],
    description:
      "La Gare / Le Gore is the northeast night out: live music in a former station, garden-and-terrace breathing room, then a basement club that can run into the early hours.",
    price: "$",
    priceSource: "Visit Paris Region",
  },
];

const citywideLiveNightlife: StopSeed[] = [
  {
    id: "paris-nightlife-live-duc-lombards",
    name: "Le Duc des Lombards",
    coordinates: [48.8593, 2.3476],
    description:
      "Le Duc des Lombards is a central live-room music venue: book a set, arrive on time, and let the night be about musicianship rather than another round of bar hopping.",
    price: "$$",
    priceSource: "Official venue site / Google Maps",
  },
  {
    id: "paris-nightlife-live-caveau-huchette",
    name: "Le Caveau de la Huchette",
    coordinates: [48.8525, 2.3468],
    description:
      "Le Caveau de la Huchette is a Latin Quarter dancing cellar with live jazz, old-stone atmosphere, and a crowd that comes to move rather than treat music as background.",
    price: "$$",
    priceSource: "Official venue site / Google Maps",
  },
  {
    id: "paris-nightlife-live-lapin-agile",
    name: "Au Lapin Agile",
    coordinates: [48.8888, 2.3401],
    description:
      "Au Lapin Agile is a historic Montmartre cabaret presenting traditional French song and intimate live performance in a room steeped in artist lore. Admission follows the performance schedule rather than drop-in bar hours.",
    price: "$$",
    priceSource: "Official venue site / Google Maps",
  },
  {
    id: "paris-nightlife-live-la-gare-gore",
    name: "La Gare / Le Gore",
    coordinates: [48.8927, 2.3839],
    description:
      "La Gare / Le Gore stretches the night from live jazz and experimental sets in a former station into a scrappier basement dance floor with late electronic programming.",
    price: "$",
    priceSource: "Visit Paris Region / Google Maps",
  },
  {
    id: "paris-nightlife-live-point-ephemere",
    name: "Point Ephemere",
    coordinates: [48.8819, 2.3686],
    description:
      "Point Ephemere combines concerts, exhibitions, artist studios, a bar, and a canal-side terrace in one former industrial space. Programming changes nightly, so the official calendar matters more than a generic bar recommendation.",
    price: "$$",
    priceSource: "Official venue site / Google Maps",
  },
];

const citywideLowKeyNightlife: StopSeed[] = [
  {
    id: "paris-nightlife-low-key-marlusse",
    name: "Marlusse et Lapin",
    coordinates: [48.8842, 2.3364],
    description:
      "Marlusse et Lapin is the funky Montmartre nook for creative cocktails, happy hour, small-room chaos, and occasional live performances. It is low-key without being sleepy.",
    price: "$$",
    priceSource: "BarsParis / MisterGoodBeer / Google Maps",
  },
  {
    id: "paris-nightlife-low-key-piano-vache",
    name: "Le Piano Vache",
    coordinates: [48.8503, 2.3488],
    description:
      "Le Piano Vache is the Latin Quarter dive-bar institution: posters, student energy, cheap drinks, and a night that does not ask anyone to dress up.",
    price: "$",
    priceSource: "Official venue site / Google Maps",
  },
  {
    id: "paris-nightlife-low-key-requin",
    name: "Le Requin Chagrin",
    coordinates: [48.8465, 2.3478],
    description:
      "Le Requin Chagrin is a casual Pantheon-side pub with beer, group tables, and a low-pressure room near Mouffetard.",
    price: "$",
    priceSource: "Google Maps / local nightlife guides",
  },
  {
    id: "paris-nightlife-low-key-la-perle",
    name: "La Perle",
    coordinates: [48.8608, 2.3614],
    description:
      "La Perle is the Marais sidewalk-crowd standby, useful for people-watching, spillover energy, and minimal planning between galleries and late wandering.",
    price: "$$",
    priceSource: "Time Out / Google Maps",
  },
  {
    id: "paris-nightlife-low-key-teddys",
    name: "Teddy's Bar",
    coordinates: [48.8473, 2.3443],
    description:
      "Teddy's Bar is a compact, low-pressure Rue Mouffetard room pouring beer and cocktails for casual groups.",
    price: "$$",
    priceSource: "Google Maps / local nightlife guides",
  },
  {
    id: "paris-nightlife-low-key-cambridge",
    name: "The Cambridge Public House",
    coordinates: [48.8618, 2.3632],
    description:
      "The Cambridge Public House is a Marais pub for a dive-bar-adjacent Paris night: relaxed service, craft beers, Guinness, rotating cocktails, and enough food to keep the group moving without making the stop precious.",
    price: "$$",
    priceSource: "World's 50 Best Bars / Time Out",
  },
  {
    id: "paris-nightlife-low-key-bar-marche",
    name: "Le Bar du Marche",
    coordinates: [48.8532, 2.3362],
    description:
      "Le Bar du Marche is a loud, social Rue de Buci terrace for casual drinks, crowd energy, and people-watching rather than polished cocktail technique.",
    price: "$$",
    priceSource: "Google Maps / local nightlife guides",
  },
  {
    id: "paris-nightlife-low-key-caveau-huchette",
    name: "Le Caveau de la Huchette",
    coordinates: [48.8525, 2.3468],
    description:
      "Le Caveau de la Huchette adds the Latin Quarter cellar lane: old stone, live music, dancing, and late-night atmosphere with more personality than a standard pub stop.",
    price: "$$",
    priceSource: "Official venue site / Google Maps",
  },
  {
    id: "paris-nightlife-low-key-point-ephemere",
    name: "Point Ephemere",
    coordinates: [48.8819, 2.3686],
    description:
      "Point Ephemere is the Canal Saint-Martin wildcard: music, terrace energy, art-space programming, and a looser crowd farther north.",
    price: "$$",
    priceSource: "Time Out / Google Maps",
  },
  {
    id: "paris-nightlife-low-key-recrutement",
    name: "Le Recrutement Cafe",
    coordinates: [48.8568, 2.304],
    description:
      "Le Recrutement Cafe is a casual Rue Saint-Dominique terrace for simple drinks and people-watching near the Eiffel Tower and Invalides.",
    price: "$$",
    priceSource: "Google Maps / local nightlife guides",
  },
];

const citywideCulture: StopSeed[] = [
  {
    id: "paris-culture-louvre",
    name: "Musee du Louvre",
    coordinates: [48.8606, 2.3376],
    description:
      "The Louvre is a Paris cultural must-do: a former royal palace holding one of the world's great art collections. Its icons include the Mona Lisa, the Venus de Milo, the Winged Victory of Samothrace, Egyptian antiquities, French painting, and monumental galleries that make the building part of the experience.",
  },
  {
    id: "paris-culture-orsay",
    name: "Musee d'Orsay",
    coordinates: [48.8599, 2.3266],
    description:
      "Musee d'Orsay fills a former Beaux-Arts railway station with the world's largest collection of Impressionist and Post-Impressionist masterpieces. Monet, Renoir, Degas, Manet, Cezanne, Van Gogh, sculpture, decorative arts, and the great clock views make it one of Paris's essential museums.",
  },
  {
    id: "paris-culture-notre-dame",
    name: "Notre-Dame Cathedral",
    coordinates: [48.853, 2.3499],
    description:
      "Notre-Dame Cathedral is the Gothic heart of the Ile de la Cite, famous for its twin towers, rose windows, sculpted portals, flying buttresses, and restored spire.",
  },
  {
    id: "paris-culture-sainte-chapelle",
    name: "Sainte-Chapelle",
    coordinates: [48.8554, 2.345],
    description:
      "Sainte-Chapelle is a 13th-century royal chapel built for Louis IX, famous for its towering stained-glass windows. The upper chapel surrounds visitors with biblical scenes in deep blue, red, and gold glass, making it one of the most intense Gothic interiors in Paris.",
  },
  {
    id: "paris-culture-picasso",
    name: "Musee Picasso Paris",
    coordinates: [48.8599, 2.3623],
    description:
      "Musee Picasso Paris occupies the Hotel Sale, a grand Marais mansion filled with Picasso's paintings, sculptures, drawings, prints, ceramics, notebooks, and archives. The display shows both finished works and process, giving the museum a strong sense of the artist's range and working life.",
  },
  {
    id: "paris-culture-palais-garnier",
    name: "Palais Garnier",
    coordinates: [48.8719, 2.3316],
    description:
      "Palais Garnier is Paris's 19th-century opera house, built for opera and ballet on a spectacular scale. The Grand Staircase, gilded foyers, auditorium, Chagall ceiling, stage machinery, and marble-heavy facade make it one of the city's great theatrical interiors.",
  },
  {
    id: "paris-culture-rodin",
    name: "Musee Rodin",
    coordinates: [48.8554, 2.3158],
    description:
      "Musee Rodin presents Auguste Rodin's sculpture inside the Hotel Biron and its gardens. The collection includes The Thinker, The Kiss, The Burghers of Calais, studies, plasters, drawings, and outdoor works that show how Rodin shaped modern sculpture.",
  },
  {
    id: "paris-culture-catacombs",
    name: "Paris Catacombs",
    coordinates: [48.8338, 2.3324],
    description:
      "The Paris Catacombs are an underground ossuary holding the remains of millions of Parisians, arranged in former limestone quarry tunnels beneath the city. The visit is eerie, historic, and physically memorable: narrow passages, carved signs, stacked bones, and a very different view of Paris below street level.",
  },
  {
    id: "paris-culture-eiffel-tower",
    name: "Eiffel Tower",
    coordinates: [48.8584, 2.2945],
    description:
      "The Eiffel Tower is Paris's defining landmark, built for the 1889 Exposition Universelle and still the city's most recognizable silhouette. Its iron structure, observation levels, engineering history, and night illumination make it a major cultural stop, not only a viewpoint.",
    photo: photos.eiffel,
  },
  {
    id: "paris-culture-versailles",
    name: "Palace of Versailles",
    coordinates: [48.8049, 2.1204],
    description:
      "The Palace of Versailles is the great royal estate of Louis XIV, with state apartments, the Hall of Mirrors, formal gardens, fountains, the Grand Trianon, Petit Trianon, and Marie-Antoinette's Hamlet. The scale demands a dedicated day trip rather than a rushed palace interior.",
  },
];

const citywideHistoricCoreCulture: StopSeed[] = [
  {
    id: "paris-culture-core-notre-dame",
    name: "Notre-Dame Cathedral",
    coordinates: [48.853, 2.3499],
    description:
      "Notre-Dame Cathedral gives the historic core its Gothic centerpiece: towers, portals, rose windows, flying buttresses, and a restored interior shaped by centuries of worship and civic memory.",
  },
  {
    id: "paris-culture-core-sainte-chapelle",
    name: "Sainte-Chapelle",
    coordinates: [48.8554, 2.345],
    description:
      "Sainte-Chapelle is the stained-glass jewel of the Ile de la Cite, built as a royal chapel and still astonishing for the height, color, and density of its windows.",
  },
  {
    id: "paris-culture-core-shakespeare",
    name: "Shakespeare and Company",
    coordinates: [48.8526, 2.3471],
    description:
      "Shakespeare and Company is the Latin Quarter's famous English-language bookshop, known for its crowded rooms, reading culture, and position facing Notre-Dame from the Left Bank.",
  },
  {
    id: "paris-culture-core-seine-bookstalls",
    name: "Seine Bookstalls and Quays",
    coordinates: [48.8527, 2.347],
    description:
      "The Seine bookstalls and quays turn the river into a cultural object: old green boxes, secondhand books, prints, posters, and views across the islands.",
  },
];

const citywideSmallArtCulture: StopSeed[] = [
  {
    id: "paris-culture-small-point-ephemere",
    name: "Point Ephemere",
    coordinates: [48.8819, 2.3686],
    description:
      "Point Ephemere is a canal-side art and music space with exhibitions, studios, concerts, and terrace energy. It gives Paris culture a low-key, current edge outside the museum circuit.",
  },
  {
    id: "paris-culture-small-galerie-martel",
    name: "Galerie Martel",
    coordinates: [48.8752, 2.3528],
    description:
      "Galerie Martel is a small 10th-arrondissement gallery focused on illustration, comics, drawing, painting, and graphic arts. It is a low-key cultural site for seeing contemporary work at a more intimate scale.",
  },
  {
    id: "paris-culture-small-delacroix",
    name: "Musee national Eugene-Delacroix",
    coordinates: [48.8541, 2.3356],
    description:
      "Musee national Eugene-Delacroix is an artist-house museum in the painter's former apartment and studio, with works, objects, and a small garden that make the visit feel personal rather than institutional.",
  },
  {
    id: "paris-culture-small-monnaie",
    name: "Monnaie de Paris",
    coordinates: [48.8567, 2.3391],
    description:
      "Monnaie de Paris combines a working mint, exhibition spaces, metalwork history, and a monumental Seine-side building.",
  },
];

const citywideHotelStay: StopSeed[] = [
  {
    id: "paris-stay-cheval-blanc",
    name: "Cheval Blanc Paris",
    coordinates: [48.8588, 2.342],
    description:
      "Cheval Blanc Paris is the Seine-facing palace hotel above Samaritaine, with exclusive rooms and suites, some framing the Eiffel Tower. The stay is built around high-service luxury, river access, and Michelin-starred rooftop dining at Le Tout-Paris.",
    price: "$$$",
    priceSource: "Conde Nast Traveler / Google Travel",
    officialUrl: "https://www.chevalblanc.com/en/maison/paris/",
    ...hotelStay,
  },
  {
    id: "paris-stay-lutetia",
    name: "Hotel Lutetia",
    coordinates: [48.8517, 2.327],
    description:
      "Hotel Lutetia is the grand Left Bank hotel reference: restored Art Deco scale, polished public rooms, spa facilities, and a wide range of rooms and suites for Saint-Germain heritage with full-service luxury.",
    price: "$$$",
    priceSource: "Conde Nast Traveler / Google Travel",
    officialUrl: "https://www.mandarinoriental.com/en/paris/lutetia",
    ...hotelStay,
  },
  {
    id: "paris-stay-grand-mazarin",
    name: "Le Grand Mazarin",
    coordinates: [48.858, 2.3546],
    description:
      "Le Grand Mazarin is the stylish Marais hotel for chic maximalist design, a central old-quarter address, a pool and wellness mood, and easy access to galleries, restaurants, Hotel de Ville, and late bars.",
    price: "$$$",
    priceSource: "Conde Nast Traveler / Vogue",
    officialUrl: "https://www.legrandmazarin.com/",
    ...hotelStay,
  },
  {
    id: "paris-stay-hoxton",
    name: "The Hoxton Paris",
    coordinates: [48.87, 2.3475],
    description:
      "The Hoxton Paris turns an 18th-century building near the Grands Boulevards into a lively hotel with restaurants, bars, a courtyard, work-friendly lobby spaces, and rooms that suit travelers who want central energy without palace formality.",
    price: "$$",
    priceSource: "Conde Nast Traveler / Google Travel",
    officialUrl: "https://thehoxton.com/paris/",
    ...hotelStay,
  },
  {
    id: "paris-stay-rochechouart",
    name: "Hotel Rochechouart",
    coordinates: [48.8822, 2.3425],
    description:
      "Hotel Rochechouart is the South Pigalle and Montmartre-edge hotel with Art Deco character, a rooftop, lively dining, and quick access to Pigalle, Abbesses, and north-side evenings without sleeping on the busiest summit streets.",
    price: "$$",
    priceSource: "Conde Nast Traveler / Google Travel",
    officialUrl: "https://www.orsohotels.com/hotel-rochechouart",
    ...hotelStay,
  },
];

const citywideHostelStay: StopSeed[] = [
  {
    id: "paris-stay-generator",
    name: "Generator Paris",
    coordinates: [48.8795, 2.3696],
    description:
      "Generator Paris is a design-hostel near Canal Saint-Martin, with dorms, private rooms, social common areas, and a rooftop with city views. It keeps the budget lower while still giving travelers a polished base and easy east-side movement.",
    price: "$",
    priceSource: "Hostelworld / Google Maps",
    officialUrl: "https://staygenerator.com/hostels/paris",
    ...hostelStay,
  },
  {
    id: "paris-stay-people-belleville",
    name: "The People Paris Belleville",
    coordinates: [48.8709, 2.3773],
    description:
      "The People Paris Belleville is part of The People's Paris hostel network, with dorms, private rooms, social spaces, and an east-side base close to Belleville food and metro links. Pick this location for a lower-cost stay with neighborhood energy.",
    price: "$",
    priceSource: "Hostelworld / Google Maps",
    officialUrl: "https://www.thepeoplehostel.com/en/destinations/paris-belleville/",
    ...hostelStay,
  },
  {
    id: "paris-stay-young-happy",
    name: "Young and Happy Latin Quarter",
    coordinates: [48.8446, 2.3507],
    description:
      "Young and Happy Latin Quarter offers dorms near Mouffetard and the Pantheon, including smaller dorm options and women-only rooms when available. Cozy common spaces keep the hostel social without feeling oversized.",
    price: "$",
    priceSource: "Hostelworld / Tripadvisor",
    officialUrl: "https://www.youngandhappy.fr/",
    ...hostelStay,
  },
  {
    id: "paris-stay-mije-marais",
    name: "MIJE Marais",
    coordinates: [48.8564, 2.3615],
    description:
      "MIJE Marais keeps the old quarter affordable through simple hostel rooms inside historic Marais houses. It is a location-first hostel for Place des Vosges, Hotel de Ville, and the Seine nearby without hotel pricing.",
    price: "$",
    priceSource: "Hostelworld / Google Maps",
    officialUrl: "https://www.mije.com/",
    ...hostelStay,
  },
  {
    id: "paris-stay-village-montmartre",
    name: "Le Village Montmartre",
    coordinates: [48.8842, 2.3446],
    description:
      "Le Village Montmartre combines hostel dorms, superior private rooms, and a terrace near Anvers and Sacre-Coeur. The format keeps Montmartre accessible at a lower nightly spend.",
    price: "$",
    priceSource: "Hostelworld / HostelsClub",
    officialUrl: "https://www.villagehostel.fr/",
    ...hostelStay,
  },
  {
    id: "paris-stay-st-christophers-canal",
    name: "St Christopher's Inn Canal",
    coordinates: [48.8868, 2.3756],
    description:
      "St Christopher's Inn Canal is the bigger social hostel north on the waterline, with dorms, private rooms, events, and easy movement toward Bassin de la Villette. It suits groups and solo travelers who want a budget base with built-in activity.",
    price: "$",
    priceSource: "Hostelworld / Google Maps",
    officialUrl: "https://www.st-christophers.co.uk/paris/canal-hostel/",
    ...hostelStay,
  },
];

const citywideNature: StopSeed[] = [
  {
    id: "paris-nature-luxembourg",
    name: "Jardin du Luxembourg",
    coordinates: [48.8462, 2.3372],
    description:
      "Jardin du Luxembourg links Saint-Germain and the Latin Quarter through movable chairs, lawns, fountains, tree-lined walks, and palace views. It is the Left Bank's most useful green pause rather than a trip out to nature.",
    photo: photos.nature,
  },
  {
    id: "paris-nature-tuileries-seine",
    name: "Tuileries Garden and Seine Walk",
    coordinates: [48.8635, 2.327],
    description:
      "Tuileries Garden and the Seine connect the Louvre and Orsay through formal lawns, sculpture, river light, and a low-effort outdoor reset between major museums.",
    photo: photos.seine,
  },
  {
    id: "paris-nature-buttes-chaumont",
    name: "Parc des Buttes-Chaumont",
    coordinates: [48.8809, 2.382],
    description:
      "Buttes-Chaumont is a northeast hill-park, with dramatic slopes and local picnic energy even while sections undergo renovation.",
    photo: photos.nature,
  },
  {
    id: "paris-nature-pere-lachaise",
    name: "Cimetiere du Pere-Lachaise",
    coordinates: [48.8614, 2.3934],
    description:
      "Pere-Lachaise is both cemetery and open-air museum, best approached as a slow leafy walk with a map rather than a quick celebrity-grave hunt.",
    photo: photos.nature,
  },
  {
    id: "paris-nature-coulee-verte",
    name: "Coulee verte Rene-Dumont",
    coordinates: [48.8467, 2.3754],
    description:
      "Coulee verte Rene-Dumont gives Bastille and the 12th an elevated linear walk built from old rail infrastructure.",
    photo: photos.nature,
  },
  {
    id: "paris-nature-parc-belleville",
    name: "Parc de Belleville",
    coordinates: [48.8718, 2.3843],
    description:
      "Parc de Belleville climbs the neighborhood's steep slope through terraces, planting, lawns, and broad skyline views without the Sacre-Coeur crowd. Sunset makes the geography of eastern Paris especially clear.",
    photo: photos.nature,
  },
];

const citywideActivities: StopSeed[] = [
  {
    id: "paris-activity-eiffel-tower",
    name: "Eiffel Tower",
    coordinates: [48.8584, 2.2945],
    description:
      "The Eiffel Tower is the defining Paris activity: observation levels, ironwork, restaurants, history, and night illumination in one landmark. Book ahead if going up the tower, or time the visit for evening light around the Champ de Mars.",
    photo: photos.eiffel,
  },
  {
    id: "paris-activity-louvre",
    name: "Musee du Louvre",
    coordinates: [48.8606, 2.3376],
    description:
      "The Louvre is Paris's essential museum activity, with the Mona Lisa, Winged Victory, Venus de Milo, Egyptian antiquities, French painting, decorative arts, and the palace architecture itself. Pick a theme or wing rather than trying to cover everything.",
    photo: photos.culture,
  },
  {
    id: "paris-activity-notre-dame",
    name: "Notre-Dame Cathedral",
    coordinates: [48.853, 2.3499],
    description:
      "Notre-Dame Cathedral is the Gothic heart of the Ile de la Cite, with twin towers, rose windows, sculpted portals, flying buttresses, and a restored interior shaped by centuries of worship and civic memory.",
    photo: photos.culture,
  },
  {
    id: "paris-activity-sainte-chapelle",
    name: "Sainte-Chapelle",
    coordinates: [48.8554, 2.345],
    description:
      "Sainte-Chapelle is one of Paris's most concentrated visual experiences: a royal Gothic chapel whose upper room rises into walls of blue, red, and gold stained glass. Timed entry helps keep the visit simple.",
    photo: photos.culture,
  },
  {
    id: "paris-activity-orsay",
    name: "Musee d'Orsay",
    coordinates: [48.8599, 2.3266],
    description:
      "Musee d'Orsay turns a former railway station into the city's major Impressionist and Post-Impressionist museum, with Monet, Renoir, Degas, Manet, Van Gogh, sculpture, decorative arts, and a great clock-facing hall.",
    photo: photos.culture,
  },
  {
    id: "paris-activity-arc-triomphe",
    name: "Arc de Triomphe",
    coordinates: [48.8738, 2.295],
    description:
      "The Arc de Triomphe is a monumental attraction of the Champs-Elysees, with sculpted reliefs, the Tomb of the Unknown Soldier, and a rooftop terrace looking over the avenues of western Paris.",
  },
  {
    id: "paris-activity-sacre-coeur",
    name: "Basilique du Sacre-Coeur",
    coordinates: [48.8867, 2.3431],
    description:
      "Basilique du Sacre-Coeur is Montmartre's white-domed hilltop church, with mosaics, crypt spaces, a dome climb, and one of the city's clearest high viewpoints from the basilica steps and summit.",
    photo: photos.montmartre,
  },
  {
    id: "paris-activity-palais-garnier",
    name: "Palais Garnier",
    coordinates: [48.8719, 2.3316],
    description:
      "Palais Garnier is Paris's 19th-century opera house, built for opera and ballet on a spectacular scale. The Grand Staircase, gilded foyers, auditorium, Chagall ceiling, and marble-heavy facade make the visit feel theatrical even without a performance.",
    photo: photos.culture,
  },
  {
    id: "paris-activity-orangerie",
    name: "Musee de l'Orangerie",
    coordinates: [48.8638, 2.3227],
    description:
      "Musee de l'Orangerie is an art museum for Monet's Water Lilies rooms, plus Impressionist and Post-Impressionist works by Renoir, Cezanne, Matisse, Modigliani, Picasso, and Soutine.",
    photo: photos.culture,
  },
  {
    id: "paris-activity-catacombs",
    name: "Paris Catacombs",
    coordinates: [48.8338, 2.3324],
    description:
      "The Paris Catacombs are an underground ossuary in former limestone quarry tunnels, with narrow passages, carved signs, and stacked bones that make the visit one of the city's most physically memorable historic experiences.",
    photo: photos.culture,
  },
];

export const parisCitywideGuides = [
  guide({
    id: "list-paris-citywide-restaurants",
    slug: "paris-best-restaurants",
    seoSlug: "best-restaurants",
    seoTitle: "Best Restaurants in Paris",
    seoDescription:
      "Best restaurants in Paris for classic bistros, wine-led rooms, bakeries, seafood, falafel counters, and modern reservation dinners by arrondissement.",
    title: "Bistros, Bakeries, and Modern Reservations",
    description:
      "Paris dining runs from classic bistros and natural-wine rooms to bakeries, falafel counters, seafood institutions, and modern tasting menus. The selection favors places with a distinct craft, service style, or neighborhood identity across the arrondissements.",
    url: "https://www.google.com/maps/search/best+restaurants+paris",
    category: "Food",
    stops: citywideFood,
    sources: parisFoodSources,
  }),
  guide({
    id: "list-paris-citywide-boulangeries-coffee-mornings",
    slug: "paris-best-boulangeries-coffee-mornings",
    seoSlug: "best-boulangeries",
    seoTitle: "Best Boulangeries and Coffee Mornings in Paris",
    seoDescription:
      "Best boulangeries and coffee mornings in Paris for croissants, baguettes, Canal Saint-Martin bakeries, Left Bank bread counters, and seated breakfast stops.",
    title: "Boulangeries and Coffee Mornings",
    description:
      "Paris is a cuisine capital before lunch starts: boulangeries, croissants, baguettes, coffee counters, and seated breakfasts can shape a whole morning.",
    url: "https://www.google.com/maps/search/best+boulangeries+coffee+paris",
    category: "Food",
    stops: citywideBoulangerieFood,
    sources: parisBoulangerieSources,
  }),
  guide({
    id: "list-paris-citywide-brasseries-bouillons",
    slug: "paris-best-brasseries-bouillons",
    seoSlug: "best-brasseries",
    seoTitle: "Best Brasseries and Bouillons in Paris",
    seoDescription:
      "Best brasseries and bouillons in Paris for steak frites, French onion soup, Art Nouveau rooms, boulevard classics, and traditional dining.",
    title: "Brasseries and Bouillon Classics",
    description:
      "Brasseries and bouillons are the Paris meal format for steak frites, French onion soup, duck, cassoulet, and rooms with real civic memory.",
    url: "https://www.google.com/maps/search/best+brasseries+bouillons+paris",
    category: "Food",
    stops: citywideBrasserieFood,
    sources: parisBrasserieSources,
  }),
  guide({
    id: "list-paris-citywide-patisseries-macarons",
    slug: "paris-best-patisseries-macarons",
    seoSlug: "best-patisseries",
    seoTitle: "Best Patisseries and Macarons in Paris",
    seoDescription:
      "Best patisseries and macarons in Paris for Angelina, Pierre Herme, Laduree, grand tea rooms, sweet counters, and pastry-led routes.",
    title: "Patisseries and Macarons",
    description:
      "Paris patisserie culture covers macarons, viennoiserie, formal tea rooms, polished counters, and boxed sweets made for carrying home. Technique and house specialties matter more here than photogenic display cases alone.",
    url: "https://www.google.com/maps/search/best+patisseries+macarons+paris",
    category: "Food",
    stops: citywidePatisserieFood,
    sources: parisPatisserieSources,
  }),
  guide({
    id: "list-paris-citywide-nightlife",
    slug: "paris-best-bars-nightlife",
    seoSlug: "best-bars",
    seoTitle: "Best Bars and Nightlife in Paris",
    seoDescription:
      "Best bars and nightlife in Paris for stylish cocktail bars, wine bars, live rooms, Canal Saint-Martin evenings, Marais drinks, and late Pigalle energy.",
    title: "Stylish Bars, Wine, Live Rooms, and Pigalle",
    description:
      "Paris nightlife ranges from natural-wine rooms and design-forward cocktails to ticketed music venues, canal terraces, and later Pigalle energy.",
    url: "https://www.google.com/maps/search/best+bars+nightlife+paris",
    category: "Nightlife",
    stops: citywideNightlife,
    sources: parisNightlifeSources,
  }),
  guide({
    id: "list-paris-citywide-nightlife-beyond-drinks",
    slug: "paris-nightlife-beyond-drinks",
    seoSlug: "nightlife-beyond-drinks",
    seoTitle: "Best Paris Nightlife Beyond Drinks",
    seoDescription:
      "Best Paris nightlife beyond drinks for live music, cabaret, dance floors, canal art spaces, Latin Quarter cellars, and late northeast venues.",
    title: "Nightlife Beyond Drinks",
    description:
      "Paris nightlife extends beyond bar crawls into ticketed sets, cabaret rooms, dancing cellars, canal arts programming, and live venues. Music, performance, or the dance floor is the main attraction at every address here.",
    url: "https://www.google.com/maps/search/live+music+shows+nightlife+paris",
    category: "Nightlife",
    stops: citywideLiveNightlife,
    sources: parisLiveNightlifeSources,
  }),
  guide({
    id: "list-paris-citywide-low-key-late-night-bars",
    slug: "paris-best-dive-bars",
    seoSlug: "best-dive-bars",
    seoTitle: "Best Dive Bars in Paris",
    seoDescription:
      "Best dive bars in Paris for low-key late nights, student pubs, Montmartre happy hour, Marais sidewalk crowds, canal music rooms, and casual Left Bank drinks.",
    title: "Low-Key Dive Bars and Late-Night Pubs",
    description:
      "Paris's looser drinking rooms favor modest prices, crowded terraces, student pubs, happy hours, music cellars, and canal-side bars over reservations and elaborate cocktail service. The common thread is an easy social room with some lived-in character.",
    url: "https://www.google.com/maps/search/best+dive+bars+paris",
    category: "Nightlife",
    stops: citywideLowKeyNightlife,
    sources: parisLowKeyNightlifeSources,
  }),
  guide({
    id: "list-paris-citywide-culture",
    slug: "paris-best-culture-citywide",
    seoSlug: "best-culture",
    seoTitle: "Best Culture in Paris",
    seoDescription:
      "Best culture in Paris for iconic museums, Gothic landmarks, the Eiffel Tower, opera architecture, sculpture gardens, catacombs, and Versailles.",
    title: "Paris Icons and Museum Masterpieces",
    description:
      "Paris culture is built from world-famous art, Gothic architecture, opera spectacle, sculpture gardens, underground history, and royal scale.",
    url: "https://www.google.com/maps/search/best+culture+paris",
    category: "Culture",
    stops: citywideCulture,
    sources: parisCultureSources,
  }),
  guide({
    id: "list-paris-citywide-notre-dame-seine-history",
    slug: "paris-notre-dame-seine-historic-core",
    seoSlug: "notre-dame-seine",
    seoTitle: "Notre-Dame, the Seine, and Historic Paris",
    seoDescription:
      "Notre-Dame, Sainte-Chapelle, Shakespeare and Company, and the Seine bookstalls for a historic Paris culture route around the islands and Left Bank.",
    title: "Notre-Dame, the Seine, and Historic Paris",
    description:
      "It gives the Seine and the islands their own cultural presence instead of treating them as background scenery.",
    url: "https://www.google.com/maps/search/notre+dame+seine+historic+paris",
    category: "Culture",
    stops: citywideHistoricCoreCulture,
    sources: parisCultureSources,
  }),
  guide({
    id: "list-paris-citywide-small-art-galleries",
    slug: "paris-small-art-galleries",
    seoSlug: "small-art-galleries",
    seoTitle: "Small Art Galleries and Low-Key Culture in Paris",
    seoDescription:
      "Small art galleries and low-key culture in Paris, from Point Ephemere and Galerie Martel to artist-house museums and craft institutions.",
    title: "Small Galleries and Low-Key Art Spaces",
    description:
      "Paris culture also lives in smaller art spaces, artist-house museums, graphic-art galleries, and craft-led institutions where the experience feels current, intimate, and easy to fold into a neighborhood walk.",
    url: "https://www.google.com/maps/search/small+art+galleries+paris",
    category: "Culture",
    stops: citywideSmallArtCulture,
    sources: parisCultureSources,
  }),
  guide({
    id: "list-paris-citywide-stays",
    slug: "paris-best-hotels",
    seoSlug: "best-hotels",
    seoTitle: "Best Hotels in Paris",
    seoDescription:
      "Best hotels in Paris, comparing palace hotels, Left Bank classics, Marais boutiques, Grands Boulevards stays, and Pigalle design hotels.",
    title: "Paris Hotels by Area and Style",
    description:
      "Paris hotel planning is an arrondissement decision before it is a brand decision: Seine-facing palace service, Left Bank grandeur, Marais style, Grands Boulevards energy, or Pigalle rooftops.",
    url: "https://www.google.com/maps/search/best+hotels+paris",
    category: "Stay",
    stops: citywideHotelStay,
    sources: parisStaySources,
  }),
  guide({
    id: "list-paris-citywide-hostels",
    slug: "paris-best-hostels",
    seoSlug: "best-hostels",
    seoTitle: "Best Hostels in Paris",
    seoDescription:
      "Best hostels in Paris for dorms, private rooms, social spaces, rooftop views, canal access, Belleville, Montmartre, Marais, and the Latin Quarter.",
    title: "Paris Hostels and Social Budget Bases",
    description:
      "Paris hostels trade palace polish for dorms, private rooms, communal kitchens or bars, and lower nightly rates. The strongest options spread across the canal, Belleville, Montmartre, Le Marais, and the Latin Quarter, with social energy varying sharply by property.",
    url: "https://www.google.com/maps/search/best+hostels+paris",
    category: "Stay",
    stops: citywideHostelStay,
    sources: parisStaySources,
  }),
  guide({
    id: "list-paris-top-parks-and-walks",
    slug: "paris-top-parks-and-walks",
    seoSlug: "best-parks",
    seoTitle: "Best Parks and Walks in Paris",
    seoDescription:
      "Best parks and walks in Paris for Luxembourg chairs, Tuileries and Seine routes, Buttes-Chaumont, Pere-Lachaise, Belleville views, and green east-side walks.",
    title: "Gardens, Cemeteries, and River Air",
    description:
      "Paris nature is about relief inside dense days: chair gardens, river walks, hill parks, cemeteries, elevated rail paths, and east-side viewpoints.",
    url: "https://www.google.com/maps/search/best+parks+walks+paris",
    category: "Nature",
    stops: citywideNature,
    sources: parisNatureSources,
  }),
  guide({
    id: "list-paris-top-things-to-do",
    slug: "paris-top-10-things-to-do",
    seoSlug: "best-things-to-do",
    seoTitle: "Top 10 Things to Do in Paris",
    seoDescription:
      "Top 10 things to do in Paris, including the Eiffel Tower, Louvre, Notre-Dame, Sainte-Chapelle, Musee d'Orsay, Arc de Triomphe, Sacre-Coeur, Palais Garnier, Orangerie, and the Catacombs.",
    title: "Top 10 Things to Do in Paris",
    description:
      "Ten essential Paris places to visit, from landmark viewpoints and Gothic interiors to major museums, opera-house spectacle, and the Catacombs below the city.",
    url: "https://www.google.com/maps/search/top+10+things+to+do+paris",
    category: "Activities",
    stops: citywideActivities,
    sources: parisCultureSources,
  }),
] satisfies MapList[];

const parisNeighborhoods = [
  "1st Arrondissement",
  "Le Marais",
  "Saint-Germain-des-Pres",
  "Latin Quarter",
  "Montmartre",
  "Canal Saint-Martin",
  "7th Arrondissement",
] as const;

type ParisNeighborhood = (typeof parisNeighborhoods)[number];

const neighborhoodCategories = [
  "Food",
  "Nightlife",
  "Nature",
  "Culture",
  "Stay",
] as const satisfies readonly EditorialCategory[];

type NeighborhoodCategory = (typeof neighborhoodCategories)[number];

const neighborhoodTopics: Record<EditorialCategory, string> = {
  Food: "Restaurants",
  Nightlife: "Bars",
  Nature: "Parks and Walks",
  Culture: "Culture",
  Stay: "Hotels",
  Activities: "Things to Do",
};

const neighborhoodSources: Record<EditorialCategory, ListSource[]> = {
  Food: parisFoodSources,
  Nightlife: parisNightlifeSources,
  Nature: parisNatureSources,
  Culture: parisCultureSources,
  Stay: parisStaySources,
  Activities: [...parisCultureSources, ...parisFoodSources, ...parisNatureSources],
};

type NeighborhoodGuideSeed = {
  title: string;
  description: string;
  stops: StopSeed[];
  topic?: string;
  idTopic?: string;
  slugTopic?: string;
  seoSlug?: string;
  seoTitle?: string;
  seoDescription?: string;
  sources?: ListSource[];
};

type NeighborhoodGuideSeedValue = NeighborhoodGuideSeed | NeighborhoodGuideSeed[];

function nStop(
  id: string,
  name: string,
  coordinates: [number, number],
  description: string,
  details: Partial<Omit<StopSeed, "id" | "name" | "coordinates" | "description">> = {},
): StopSeed {
  return { id, name, coordinates, description, ...details };
}

const parisNeighborhoodGuideSeeds: Record<ParisNeighborhood, Record<NeighborhoodCategory, NeighborhoodGuideSeedValue>> = {
  "1st Arrondissement": {
    Food: {
      title: "Museum-Day Meals Around the Royal Core",
      description:
        "Restaurants around the Louvre and Palais Royal span quick udon counters, historic brasseries, seasonal tasting menus, and a formal tea room without leaning on Rue de Rivoli's tourist formulas. Counter service keeps lunch brief; the tasting menu and tea room require more time and, for dinner, a reservation.",
      stops: [
        nStop("first-food-angelina", "Angelina", [48.8651, 2.3286], "Angelina is the Tuileries-side tea-room ritual for hot chocolate, pastries, and a seated pause between the Louvre, Rue de Rivoli, and Concorde.", { price: "$$", priceSource: "Google Maps / Paris dining guides" }),
        nStop("first-food-sanukiya", "Sanukiya", [48.8648, 2.3339], "Sanukiya is a warm, efficient udon restaurant near Pyramides, offering comfort, speed, and a distinct Japanese lunch format close to Palais Royal and the Louvre.", { price: "$", priceSource: "Google Maps / Paris dining guides" }),
        nStop("first-food-verjus", "Verjus", [48.8634, 2.3381], "Verjus is a small, reservation-led restaurant near the Louvre serving modern seasonal cooking far removed from the tourist corridor's default menus.", { price: "$$$", priceSource: "MICHELIN Guide / Google Maps" }),
        nStop("first-food-le-nemours", "Le Nemours", [48.8639, 2.3359], "Le Nemours is a cafe-brasserie between the Louvre, Palais Royal, and Comedie-Francaise, serving breakfast, coffee, and simple lunches from a prominent terrace. Location and Paris cafe rhythm are the draw.", { price: "$$", priceSource: "Google Maps / local dining guides" }),
        nStop("first-food-le-fumoir", "Le Fumoir", [48.8606, 2.3407], "Le Fumoir is a Louvre-facing restaurant, bar, and tea room open from morning into evening, serving Scandinavian-influenced lunch and dinner, Sunday brunch, tea, and polished drinks.", { price: "$$$", priceSource: "Official restaurant site / Google Maps" }),
      ],
    },
    Nightlife: {
      title: "Museum-Edge Drinks and Hotel Bars",
      description:
        "Nightlife in the 1st favors polished cocktail rooms and palace-hotel bars tucked near galleries and covered passages, with elegance taking priority over late club energy.",
      stops: [
        nStop("first-nightlife-danico", "Danico", [48.8666, 2.3399], "Danico is the Galerie Vivienne destination with World 50 Best support and a hidden-room feel that fits a polished Right Bank night.", { price: "$$$", priceSource: "World's 50 Best Bars / Google Maps" }),
        nStop("first-nightlife-bar-228", "Bar 228", [48.865, 2.3286], "Bar 228 at Le Meurice gives the Tuileries edge a grand-hotel drink with dark wood, deep seats, and classic service.", { price: "$$$", priceSource: "Official hotel site / Google Maps" }),
        nStop("first-nightlife-le-fumoir", "Le Fumoir", [48.8606, 2.3407], "Le Fumoir combines a restaurant, bar, and tea room beside the Louvre. Its composed all-day dining room is equally credible for a drink or a full meal.", { price: "$$", priceSource: "Official restaurant site / Google Maps" }),
        nStop("first-nightlife-juveniles", "Juveniles", [48.8669, 2.3373], "Juveniles is a relaxed wine bar and small-plates restaurant near the covered passages. The emphasis is on bottles, food, and conversation rather than the ceremony of the area's formal hotel bars.", { price: "$$", priceSource: "Google Maps / local wine guides" }),
      ],
    },
    Nature: {
      title: "Gardens, River Edges, and Central Air",
      description:
        "In the 1st, outdoor space runs from the formal Tuileries and Palais Royal gardens to low Seine-level lawns beside Pont Neuf. The larger gardens support an unhurried break between museums; the quays and island tip provide a short walk with open river views.",
      stops: [
        nStop("first-nature-tuileries", "Jardin des Tuileries", [48.8635, 2.327], "Jardin des Tuileries turns the Louvre-Orangerie corridor into a paced walk with chairs, fountains, and broad sightlines.", { photo: photos.nature }),
        nStop("first-nature-palais-royal-garden", "Jardin du Palais Royal", [48.8637, 2.3377], "Jardin du Palais Royal is the quieter garden pause behind arcades and columns, useful when the Louvre side feels too exposed.", { photo: photos.nature }),
        nStop("first-nature-vert-galant", "Square du Vert-Galant", [48.8571, 2.3413], "Square du Vert-Galant is a low island viewpoint at the tip of Ile de la Cite, with Seine-level lawns and benches beside Pont Neuf.", { photo: photos.seine }),
        nStop("first-nature-seine-quays", "Seine Quays by the Louvre", [48.8589, 2.3408], "The Seine quays make the 1st feel walkable instead of monument-heavy, especially between Pont Neuf, the Louvre, and Orsay views.", { photo: photos.seine }),
      ],
    },
    Culture: {
      title: "Louvre, Palais Royal, and Gothic Glass",
      description:
        "The 1st holds some of Paris's most recognizable culture: the Louvre's palace galleries, Palais Royal's arcades, Monet's Water Lilies, and Sainte-Chapelle's stained glass.",
      stops: [
        nStop("first-culture-louvre", "Musee du Louvre", [48.8606, 2.3376], "The Louvre is Paris's essential art museum and a former royal palace, home to the Mona Lisa, Winged Victory, Venus de Milo, Egyptian antiquities, French painting, and monumental galleries that make the architecture part of the visit."),
        nStop("first-culture-palais-royal", "Palais Royal", [48.8637, 2.3377], "Palais Royal is a 17th-century palace complex with arcades, formal gardens, the Conseil d'Etat facade, and Daniel Buren's black-and-white columns in the courtyard. It is one of the cleanest architectural contrasts in central Paris."),
        nStop("first-culture-orangerie", "Musee de l'Orangerie", [48.8638, 2.3227], "Musee de l'Orangerie is an art gallery dedicated to Impressionist and Post-Impressionist painting, best known for Monet's Water Lilies rooms. The collection also includes works by Renoir, Cezanne, Matisse, Modigliani, Picasso, and Soutine."),
        nStop("first-culture-sainte-chapelle", "Sainte-Chapelle", [48.8554, 2.345], "Sainte-Chapelle is a royal Gothic chapel with one of Europe's great stained-glass interiors. Its upper chapel rises into walls of color, with biblical scenes wrapping the room in blue, red, and gold glass."),
      ],
    },
    Stay: {
      title: "Palace Hotels and Central Sleep",
      description:
        "Staying in the 1st is about paying for centrality: palace service, Louvre access, shopping arcades, and short walks to the Seine.",
      stops: [
        nStop("first-stay-cheval-blanc", "Cheval Blanc Paris", [48.8588, 2.342], "Cheval Blanc Paris is the Seine-facing palace hotel above Samaritaine, with exclusive rooms and suites, some framing the Eiffel Tower. The stay is built around high-service luxury, river access, and Michelin-starred rooftop dining at Le Tout-Paris.", { price: "$$$", priceSource: "Conde Nast Traveler / Google Travel", officialUrl: "https://www.chevalblanc.com/en/maison/paris/", ...hotelStay }),
        nStop("first-stay-le-meurice", "Le Meurice", [48.865, 2.3286], "Le Meurice gives the 1st classic palace gravity on Rue de Rivoli, with Tuileries and the Louvre almost outside the door. It is a grand-service hotel for old Paris formality, polished rooms, and a major hotel bar.", { price: "$$$", priceSource: "Official hotel site / Google Travel", officialUrl: "https://www.dorchestercollection.com/paris/le-meurice/", ...hotelStay }),
        nStop("first-stay-regina-louvre", "Hotel Regina Louvre", [48.8638, 2.3322], "Hotel Regina Louvre is the heritage hotel opposite the Tuileries, with Belle Epoque character, Louvre-side views, and a location that keeps Palais Royal, Rue de Rivoli, and the river close.", { price: "$$$", priceSource: "Google Travel / Tripadvisor", officialUrl: "https://www.regina-hotel.com/", ...hotelStay }),
        nStop("first-stay-madame-reve", "Hotel Madame Reve", [48.8626, 2.3428], "Hotel Madame Reve gives the 1st a contemporary hotel in the former Louvre post-office building, with warm rooms, restaurants, rooftop-facing energy, and central access to Les Halles, the Louvre, and the Seine.", { price: "$$$", priceSource: "Conde Nast Traveler / Google Travel", officialUrl: "https://madamereve.com/", ...hotelStay }),
      ],
    },
  },
  "Le Marais": {
    Food: {
      title: "Old-Quarter Meals With a Point",
      description:
        "Le Marais moves between classic bistros, falafel counters, market lunches, and polished wine-led rooms across a dense old-quarter street grid.",
      stops: [
        nStop("marais-food-bistrot-tournelles", "Bistrot des Tournelles", [48.8555, 2.366], "Bistrot des Tournelles is a Marais bistro for a real sit-down meal near Place des Vosges. The throwback room and classic plates make it useful for dinner, not just snacks.", { price: "$$", priceSource: "The Infatuation / Google Maps" }),
        nStop("marais-food-las-fallafel", "L'As du Fallafel", [48.8574, 2.3591], "L'As du Fallafel is the iconic Rue des Rosiers counter for fast falafel, vegetables, sauces, and a focused lunch or substantial snack rather than a long sit-down meal.", { price: "$", priceSource: "The Infatuation / Google Maps" }),
        nStop("marais-food-parcelles", "Parcelles", [48.8612, 2.3568], "Parcelles is a polished Marais bistro built around market cooking, careful sauces, and a wine list serious enough to shape the dinner.", { price: "$$$", priceSource: "The Infatuation / Google Maps" }),
        nStop("marais-food-enfants-rouges", "Marche des Enfants Rouges", [48.8627, 2.3612], "Marche des Enfants Rouges is a covered market where Moroccan tagines and couscous, Japanese bentos, Lebanese plates, sandwiches, and produce stalls share the hall. Casual counters and mixed cuisines favor lively grazing over a quiet sit-down meal.", { price: "$", priceSource: "Eater / Google Maps" }),
      ],
    },
    Nightlife: {
      title: "Marais High-Key Bars and Low-Key Terraces",
      description:
        "Le Marais compresses polished cocktails, easygoing pubs, queer-friendly terraces, taco counters, and late sidewalk crowds into a few dense old-quarter streets.",
      stops: [
        nStop("marais-nightlife-bar-nouveau", "Bar Nouveau", [48.8623, 2.3579], "Bar Nouveau pairs Art Nouveau detail with a design-forward room and a six-cocktail set menu downstairs on weekends.", { price: "$$$", priceSource: "World's 50 Best Bars / Google Maps" }),
        nStop("marais-nightlife-cambridge", "The Cambridge Public House", [48.8618, 2.3632], "The Cambridge Public House is a cocktail pub: relaxed service, rotating creations, craft beers, natural wines, and pub food in the Marais. It can start a night without making everyone commit to a hushed bar mood.", { price: "$$", priceSource: "World's 50 Best Bars / Time Out" }),
        nStop("marais-nightlife-candelaria", "Candelaria", [48.8631, 2.3615], "Candelaria pairs a narrow taqueria with a hidden cocktail bar behind it, giving Rue de Saintonge tacos, serious drinks, and a playful two-room format.", { price: "$$", priceSource: "Time Out / Google Maps" }),
        nStop("marais-nightlife-la-perle", "La Perle", [48.8608, 2.3614], "La Perle is the sidewalk-crowd Marais standby for a looser drink between galleries, dinner, and late wandering. Its value is social texture and location, not a perfectly quiet cocktail.", { price: "$$", priceSource: "Time Out / Google Maps" }),
      ],
    },
    Nature: {
      title: "Squares and Quiet Edges Between Streets",
      description:
        "Le Marais finds breathing room in formal squares, tucked courtyards, pocket gardens, and the Seine edge between shops and museums.",
      stops: [
        nStop("marais-nature-place-vosges", "Place des Vosges", [48.8556, 2.3655], "Place des Vosges is a Marais garden-square, useful for a pause between arcades, Victor Hugo, Rue des Rosiers, and a bistro meal. It gives the old quarter symmetry and air.", { photo: photos.nature }),
        nStop("marais-nature-square-temple", "Square du Temple - Elie Wiesel", [48.8648, 2.3605], "Square du Temple - Elie Wiesel is the north Marais green reset near Enfants Rouges and Rue de Bretagne.", { photo: photos.nature }),
        nStop("marais-nature-jardin-anne-frank", "Jardin Anne Frank", [48.861, 2.3547], "Jardin Anne Frank is a tucked-away pocket garden that helps the western Marais slow down near museums and shopping streets. It is best as a short decompression stop, not a destination park.", { photo: photos.nature }),
        nStop("marais-nature-seine-hotel-ville", "Seine Quays by Hotel de Ville", [48.8567, 2.3522], "The Seine quays by Hotel de Ville pull Le Marais toward the river and give the neighborhood a scenic exit.", { photo: photos.seine }),
      ],
    },
    Culture: {
      title: "Marais Houses, Picasso, and Paris Memory",
      description:
        "Across the Marais, former private mansions hold collections devoted to Picasso, Paris history, and the writers who lived in the district. These are compact, room-by-room museums with architecture worth noticing, a better fit for focused visits than an all-day blockbuster.",
      stops: [
        nStop("marais-culture-picasso", "Musee Picasso Paris", [48.8599, 2.3623], "Musee Picasso Paris fills the Hotel Sale with paintings, sculpture, drawings, ceramics, prints, notebooks, and archival material from Picasso's life and studio. The mansion setting makes the display feel intimate despite the depth of the collection."),
        nStop("marais-culture-carnavalet", "Musee Carnavalet", [48.8575, 2.3629], "Musee Carnavalet is the museum of Paris history, set across historic Marais mansions. Its rooms move through the city's archaeology, Revolution, street signs, interiors, paintings, objects, and everyday civic memory."),
        nStop("marais-culture-victor-hugo", "Maison de Victor Hugo", [48.8549, 2.3661], "Maison de Victor Hugo is the actual Place des Vosges apartment where the writer lived from 1832 to 1848. The museum uses rooms, drawings, manuscripts, furniture, and family material to show Hugo as a writer, public figure, and designer of his own interiors."),
        nStop("marais-culture-hotel-sully", "Hotel de Sully", [48.8547, 2.3642], "Hotel de Sully is a 17th-century private mansion with sculpted facades, courtyard passages, and a garden connection toward Place des Vosges. It is one of the clearest examples of aristocratic Marais architecture."),
      ],
    },
    Stay: [
      {
        title: "Marais Boutique Hotels",
        description:
          "Marais hotels place restaurants, galleries, bars, and old-center streets within a short walk, trading large rooms for historic buildings and immediate neighborhood life.",
        stops: [
          nStop("marais-stay-grand-mazarin", "Le Grand Mazarin", [48.858, 2.3546], "Le Grand Mazarin gives Le Marais a stylish, chic hotel with maximalist rooms, wellness spaces, and a central address near Hotel de Ville, galleries, restaurants, and late bars.", { price: "$$$", priceSource: "Conde Nast Traveler / Vogue", officialUrl: "https://www.legrandmazarin.com/", ...hotelStay }),
          nStop("marais-stay-sookie", "Hotel Sookie", [48.8628, 2.3606], "Hotel Sookie is the smaller north Marais hotel with modern, calming design, warm rooms, and quick access to Rue de Bretagne, Enfants Rouges, galleries, and cafe-heavy side streets.", { price: "$$", priceSource: "Google Travel / Tripadvisor", officialUrl: "https://hotelsuzieblue.com/en", ...hotelStay }),
          nStop("marais-stay-jules-jim", "Hotel Jules and Jim", [48.8632, 2.3567], "Hotel Jules and Jim is a compact upper-Marais design hotel with contemporary rooms and a courtyard bar. Arts et Metiers, Rue de Bretagne, and central nightlife are close at hand.", { price: "$$", priceSource: "Google Travel / Tripadvisor", officialUrl: "https://www.hoteljulesetjim.com/", ...hotelStay }),
        ],
      },
      {
        topic: "Hostels",
        title: "Marais Hostels and Budget Beds",
        description:
          "The Marais has far fewer true hostels than hotels. Its credible budget beds favor compact dorms, private-room flexibility, and old-quarter access over the design polish and service of the neighborhood's boutique properties.",
        stops: [
          nStop("marais-stay-mije", "MIJE Marais", [48.8564, 2.3615], "MIJE Marais is a budget-friendly historic-house hostel for the old quarter without hotel pricing. Expect simple rooms, shared spaces, and a location-first stay close to Place des Vosges and the Seine.", { price: "$", priceSource: "Hostelworld / Google Maps", officialUrl: "https://www.mije.com/", ...hostelStay }),
        ],
      },
    ],
  },
  "Saint-Germain-des-Pres": {
    Food: {
      title: "Left Bank Tables and Cafe Rituals",
      description:
        "Saint-Germain food is more than cafe mythology. Historic brasseries, oysters, modern bistro cooking, sandwiches, and grand terraces show how the Left Bank moves from quick lunch to formal dinner without losing its street life.",
      stops: [
        nStop("saint-germain-food-lipp", "Brasserie Lipp", [48.8535, 2.3332], "Brasserie Lipp is a literary Saint-Germain institution serving classic brasserie cooking in a polished boulevard room at lunch and dinner.", { price: "$$$", priceSource: "The Infatuation / Google Maps" }),
        nStop("saint-germain-food-huitrerie-regis", "Huitrerie Regis", [48.8532, 2.3351], "Huitrerie Regis gives Saint-Germain a precise seafood stop with oysters, white wine, and a compact room.", { price: "$$", priceSource: "Eater / Google Maps" }),
        nStop("saint-germain-food-semilla", "Semilla", [48.8535, 2.3374], "Semilla is the modern Left Bank bistro for Saint-Germain without only heritage rooms. It fits an evening around galleries, the river, and Odeon.", { price: "$$", priceSource: "Eater / Google Maps" }),
        nStop("saint-germain-food-cafe-flore", "Cafe de Flore", [48.8542, 2.3322], "Cafe de Flore is a Saint-Germain institution known for its literary history, mirrored dining room, terrace, coffee, and classic cafe service. The premium pays for the setting and address rather than exclusivity.", { price: "$$", priceSource: "Conde Nast Traveler / Google Maps" }),
      ],
    },
    Nightlife: {
      title: "Left Bank Chic, Hotel Bars, and Speakeasies",
      description:
        "Saint-Germain nightlife is best when it stays elegant but not sleepy: 1930s-style speakeasy rooms, grand hotel bars, market-street terraces, and snug late-night addresses.",
      stops: [
        nStop("saint-germain-nightlife-prescription", "Prescription Cocktail Club", [48.8538, 2.3372], "Prescription Cocktail Club is a low-lit, 1930s-inspired cocktail room near Odeon and Rue Mazarine, with theatrical style and polished drinks close to Saint-Germain restaurants.", { price: "$$", priceSource: "Time Out / Google Maps" }),
        nStop("saint-germain-nightlife-josephine", "Bar Josephine", [48.8517, 2.327], "Bar Josephine at Hotel Lutetia combines grand Left Bank hotel design, cocktails, dining, and live music on select nights in a room made for a full evening.", { price: "$$$", priceSource: "Official hotel site / Google Maps" }),
        nStop("saint-germain-nightlife-bar-marche", "Le Bar du Marche", [48.8532, 2.3362], "Le Bar du Marche is the buzzing Rue de Buci terrace for classic bistro fare from breakfast onward, plus cocktails when the Left Bank evening loosens up.", { price: "$$", priceSource: "Google Maps / local nightlife guides" }),
        nStop("saint-germain-nightlife-castor-club", "Castor Club", [48.8539, 2.3392], "Castor Club is a snug Left Bank speakeasy with a hidden-door feel, a compact room, and an extensive cocktail list.", { price: "$$", priceSource: "Time Out / Google Maps" }),
      ],
    },
    Nature: {
      title: "Luxembourg Chairs and River Walks",
      description:
        "Saint-Germain's outdoor space extends from Luxembourg Garden to the Seine, with smaller church-side squares among the galleries. The garden supports a long walk or afternoon in a chair; the river and pocket squares are better for short breaks between museums, shops, and meals.",
      stops: [
        nStop("saint-germain-nature-luxembourg", "Jardin du Luxembourg", [48.8462, 2.3372], "Jardin du Luxembourg offers formal paths, fountains, palace views, trees, lawns, and the familiar green chairs on the Saint-Germain edge of the Latin Quarter.", { photo: photos.nature }),
        nStop("saint-germain-nature-laurent-prache", "Square Laurent-Prache", [48.8543, 2.3342], "Square Laurent-Prache is the small garden beside the church, useful when the boulevard needs a quiet minute. It is a compact pause between cafes, shops, and the Delacroix museum.", { photo: photos.nature }),
        nStop("saint-germain-nature-gabriel-pierne", "Square Gabriel-Pierne", [48.8548, 2.3375], "Square Gabriel-Pierne gives Rue de Seine and the galleries a leafy pocket with benches and a quieter rhythm.", { photo: photos.nature }),
        nStop("saint-germain-nature-quai-malaquais", "Quai Malaquais Seine Walk", [48.858, 2.335], "Quai Malaquais pulls Saint-Germain to the river, with views toward the Louvre and easy movement to Pont des Arts. It is the best reset between galleries, Orsay, and a central dinner.", { photo: photos.seine }),
      ],
    },
    Culture: {
      title: "Saint-Germain Abbey, Delacroix, and the Seine",
      description:
        "Saint-Germain culture moves through an ancient abbey, an artist's former home, the French mint, and the domed Institut de France.",
      stops: [
        nStop("saint-germain-culture-eglise", "Eglise Saint-Germain-des-Pres", [48.8539, 2.3346], "Eglise Saint-Germain-des-Pres is one of Paris's oldest churches, with Romanesque foundations and Gothic 12th-century architecture in its choir and early medieval layers. The painted interior, columns, and abbey history make the neighborhood's name visible."),
        nStop("saint-germain-culture-delacroix", "Musee national Eugene-Delacroix", [48.8541, 2.3356], "Musee national Eugene-Delacroix occupies the painter's final apartment and studio, with works, objects, letters, and a quiet garden. The scale is personal, focused on Delacroix's late life and artistic circle."),
        nStop("saint-germain-culture-monnaie", "Monnaie de Paris", [48.8567, 2.3391], "Monnaie de Paris is the historic Paris mint, with exhibitions, craft displays, metalwork history, and a monumental 18th-century building on the Seine. It gives the Left Bank a culture stop rooted in making, materials, and institutional history."),
        nStop("saint-germain-culture-institut", "Institut de France", [48.8572, 2.3376], "Institut de France is the domed home of France's academies, including the Academie francaise, facing the Louvre across the Seine. Its facade, cupola, and riverside presence make it one of the Left Bank's major intellectual landmarks."),
      ],
    },
    Stay: {
      title: "Grand Left Bank Hotels",
      description:
        "Saint-Germain hotels put Luxembourg Garden, the Seine, and the Left Bank's galleries within an easy walk. The grand Art Deco address has a full spa and larger public rooms; the townhouse hotels are smaller and quieter, with Rue de Buci or neighborhood cafes just outside.",
      stops: [
        nStop("saint-germain-stay-lutetia", "Hotel Lutetia", [48.8517, 2.327], "Hotel Lutetia is a grand Left Bank hotel, with Art Deco scale, polished public rooms, spa facilities, and a range of exclusive rooms and suites near Saint-Germain cafes, Orsay, and Luxembourg.", { price: "$$$", priceSource: "Conde Nast Traveler / The Times", officialUrl: "https://www.mandarinoriental.com/en/paris/lutetia", ...hotelStay }),
        nStop("saint-germain-stay-relais-christine", "Relais Christine", [48.8541, 2.3403], "Relais Christine gives Saint-Germain a tucked-away luxury hotel near the river and Odeon, with historic-street access, intimate rooms, and a quieter mood than the larger Left Bank addresses.", { price: "$$$", priceSource: "Conde Nast Traveler / Google Travel", ...hotelStay }),
        nStop("saint-germain-stay-aubusson", "Hotel d'Aubusson", [48.8545, 2.3396], "Hotel d'Aubusson sits in a 17th-century townhouse with elegant rooms, grand public spaces, a jazz bar, and easy access to Rue de Buci, the Seine, galleries, and Left Bank evenings.", { price: "$$$", priceSource: "Google Travel / Tripadvisor", officialUrl: "https://www.hoteldaubusson.com/", ...hotelStay }),
        nStop("saint-germain-stay-madison", "Madison Hotel", [48.8534, 2.3338], "Madison Hotel is a polished boutique hotel beside Saint-Germain-des-Pres church, with rooms and suites that keep the boulevard, classic cafes, metro access, and gallery streets close.", { price: "$$", priceSource: "Google Travel / Tripadvisor", officialUrl: "https://www.hotel-madison.com/", ...hotelStay }),
      ],
    },
  },
  "Latin Quarter": {
    Food: {
      title: "Historic Rooms and River-Edge Tables",
      description:
        "Latin Quarter food is strongest when it moves between bakeries, Art Nouveau dining rooms, candlelit old houses, and a formal Seine-side classic.",
      stops: [
        nStop("latin-food-coupe-chou", "Le Coupe-Chou", [48.8485, 2.3483], "Le Coupe-Chou serves French classics in a candlelit old townhouse near the Sorbonne and Pantheon. Small rooms, exposed beams, and a slower dinner pace are central to the appeal.", { price: "$$", priceSource: "Google Maps / local dining guides" }),
        nStop("latin-food-bouillon-racine", "Bouillon Racine", [48.849, 2.341], "Bouillon Racine serves classic brasserie fare in an ornate Art Nouveau dining room near Odeon and Cluny. The accessible format and dramatic setting work particularly well for groups.", { price: "$$", priceSource: "Google Maps / local dining guides" }),
        nStop("latin-food-maison-isabelle", "La Maison d'Isabelle", [48.8498, 2.3486], "La Maison d'Isabelle is a Latin Quarter bakery known for award-winning butter croissants, baguettes, and a brisk morning counter.", { price: "$", priceSource: "Google Maps / Paris bakery guides" }),
        nStop("latin-food-tour-argent", "La Tour d'Argent", [48.8499, 2.3544], "La Tour d'Argent serves formal French dining with old-Paris ceremony and elevated views across the Seine. The historic room and high prices make it a deliberate reservation rather than a casual neighborhood dinner.", { price: "$$$", priceSource: "MICHELIN Guide / Google Maps" }),
      ],
    },
    Nightlife: {
      title: "Live Cellars and Low-Key Latin Bars",
      description:
        "Latin Quarter nights belong to old stone cellars, live music, student pubs, and casual Mouffetard bars rather than polished destination cocktails.",
      stops: [
        nStop("latin-nightlife-huchette", "Le Caveau de la Huchette", [48.8525, 2.3468], "Le Caveau de la Huchette is a Latin Quarter live-cellar bar, useful when nightlife should be music, dancing, and old-stone atmosphere.", { price: "$$", priceSource: "Official venue site / Google Maps" }),
        nStop("latin-nightlife-piano-vache", "Le Piano Vache", [48.8503, 2.3488], "Le Piano Vache gives the area a student-bar institution with posters, inexpensive drinks, and a looser mood near the Sorbonne.", { price: "$", priceSource: "Google Maps / local nightlife guides" }),
        nStop("latin-nightlife-teddys", "Teddy's Bar", [48.8473, 2.3443], "Teddy's Bar is a compact, low-pressure cocktail and beer room near Mouffetard, sized for small groups rather than a large nightlife crowd.", { price: "$$", priceSource: "Google Maps / local nightlife guides" }),
        nStop("latin-nightlife-requin", "Le Requin Chagrin", [48.8465, 2.3478], "Le Requin Chagrin is a pub-style bar near the Pantheon and student streets, good for groups that want easy drinks without a reservation ritual.", { price: "$", priceSource: "Google Maps / local nightlife guides" }),
      ],
    },
    Nature: {
      title: "Gardens, Arenas, and River Breathing Room",
      description:
        "The Latin Quarter's green spaces extend from Luxembourg Garden to the planted paths of Jardin des Plantes, with a Roman amphitheater between ordinary streets. The gardens can fill an afternoon; the arena and Seine quays provide shorter breaks from the museums and dense central blocks.",
      stops: [
        nStop("latin-nature-luxembourg", "Jardin du Luxembourg", [48.8462, 2.3372], "Jardin du Luxembourg pairs formal paths, fountains, lawns, tree-lined promenades, and the familiar green chairs of a Paris public garden. Its scale supports anything from a short bench break to a long afternoon outdoors.", { photo: photos.nature }),
        nStop("latin-nature-jardin-plantes", "Jardin des Plantes", [48.8439, 2.3599], "Jardin des Plantes stretches the Latin Quarter east toward natural history, garden paths, and family-friendly museum time.", { photo: photos.nature }),
        nStop("latin-nature-arenes", "Arenes de Lutece", [48.8451, 2.3522], "Arenes de Lutece preserves part of a Roman amphitheater in an open-air pocket hidden behind ordinary Latin Quarter streets. Stone seating, trees, and neighborhood use keep the ruin from feeling sealed off as a monument.", { photo: photos.nature }),
        nStop("latin-nature-seine-bookstalls", "Seine Bookstalls and Quays", [48.8527, 2.347], "The Seine bookstalls and quays are the Latin Quarter's river reset, linking Shakespeare and Company, Notre-Dame views, and slow browsing."),
      ],
    },
    Culture: {
      title: "Pantheon, Cluny, Books, and the Sorbonne",
      description:
        "Civic memory, medieval art, book culture, and the Sorbonne's academic presence reveal the Latin Quarter beyond its cafes and nightlife.",
      stops: [
        nStop("latin-culture-pantheon", "Pantheon", [48.8462, 2.346], "The Pantheon is a neoclassical monument with a vast dome, frescoed interior, Foucault pendulum, and crypts for major French figures including Voltaire, Rousseau, Victor Hugo, Emile Zola, Marie Curie, and Josephine Baker."),
        nStop("latin-culture-cluny", "Musee de Cluny", [48.8506, 2.3431], "Musee de Cluny is the museum of medieval art, known for the Lady and the Unicorn tapestries, medieval jewellery, sculptures, stained glass, carved ivories, manuscripts, and the remains of Roman baths beneath the building."),
        nStop("latin-culture-shakespeare", "Shakespeare and Company", [48.8526, 2.3471], "Shakespeare and Company is an English-language bookshop and literary landmark facing Notre-Dame, with packed shelves, reading rooms, author events, and a long association with writers passing through Paris."),
        nStop("latin-culture-sorbonne", "Sorbonne Chapel and Place de la Sorbonne", [48.8487, 2.3437], "Place de la Sorbonne opens toward the Sorbonne's historic academic complex and the Chapelle Sainte-Ursule de la Sorbonne, the domed 17th-century chapel associated with Cardinal Richelieu. The chapel is a landmark of the university quarter even when interior access is limited."),
      ],
    },
    Stay: [
      {
        title: "Latin Quarter Hotels Near the Pantheon",
        description:
          "Latin Quarter hotels cluster around the Pantheon, Mouffetard, Jardin des Plantes, bookshops, and practical RER or metro links.",
        stops: [
          nStop("latin-stay-dames-pantheon", "Hotel Les Dames du Pantheon", [48.846, 2.3459], "Hotel Les Dames du Pantheon is the Pantheon-facing boutique hotel where each floor has a different theme. It suits travelers who want Left Bank atmosphere, Sorbonne access, and short walks to bookshops and gardens.", { price: "$$", priceSource: "Google Travel / Tripadvisor", officialUrl: "https://www.hotellesdamesdupantheon.com/", ...hotelStay }),
          nStop("latin-stay-grandes-ecoles", "Hotel des Grandes Ecoles", [48.8434, 2.3509], "Hotel des Grandes Ecoles feels like a country home in central Paris, with a calm garden near Mouffetard and the Pantheon. Quiet charm takes priority over large-hotel services.", { price: "$$", priceSource: "Google Travel / Tripadvisor", officialUrl: "https://en.hoteldesgrandesecoles.com/", ...hotelStay }),
          nStop("latin-stay-monte-cristo", "Hotel Monte Cristo", [48.8377, 2.3523], "Hotel Monte Cristo is a styled southern Latin Quarter hotel with a wellness area, pool, sauna, bar, restaurant, and a range of rooms and suites. It works well for Mouffetard, Jardin des Plantes, and quieter nights.", { price: "$$", priceSource: "Google Travel / Tripadvisor", officialUrl: "https://www.hotelmontecristoparis.com/", ...hotelStay }),
        ],
      },
      {
        topic: "Hostels",
        title: "Latin Quarter Hostel Beds",
        description:
          "The Latin Quarter has a limited hostel field. Its strongest budget base combines dorm and private-room options with practical access to Mouffetard, the Pantheon, and the area's metro and RER connections.",
        stops: [
          nStop("latin-stay-young-happy", "Young and Happy Latin Quarter", [48.8446, 2.3507], "Young and Happy Latin Quarter is the Mouffetard hostel for dorms near the Pantheon area, including smaller dorm options and women-only rooms depending on availability. Cozy common spaces keep it social without feeling oversized.", { price: "$", priceSource: "Hostelworld / Google Maps", officialUrl: "https://www.youngandhappy.fr/", ...hostelStay }),
        ],
      },
    ],
  },
  Montmartre: {
    Food: {
      title: "Hill Meals Beyond the View",
      description:
        "Montmartre food is strongest when the meal has a purpose: a poultry room, a tiny bistro, a brunch stop, a Breton crepe table, or a village-street dinner.",
      stops: [
        nStop("montmartre-food-coq-fils", "Le Coq and Fils", [48.887, 2.3383], "Le Coq and Fils gives Montmartre a poultry-focused destination meal near the upper hill without leaning on postcard atmosphere alone.", { price: "$$$", priceSource: "MICHELIN Guide / Google Maps" }),
        nStop("montmartre-food-boite-lettres", "La Boite aux Lettres", [48.8878, 2.3356], "La Boite aux Lettres is a small Montmartre bistro serving modern French plates in a neighborhood room near Lamarck-Caulaincourt.", { price: "$$", priceSource: "Google Maps / Paris dining guides" }),
        nStop("montmartre-food-hardware", "Hardware Societe", [48.886, 2.3438], "Hardware Societe is a brunch-and-coffee cafe for a Sacre-Coeur morning, with Australian cafe energy, plated breakfasts, and a location just below the basilica. Go early or treat the wait as part of a slower hill start.", { price: "$$", priceSource: "Google Maps / local dining guides" }),
        nStop("montmartre-food-breizh-cafe", "Breizh Cafe Abbesses", [48.8846, 2.3377], "Breizh Cafe Abbesses adds the crepe piece Montmartre should have, with Breton galettes, cider, and a useful Abbesses base below the summit. It is the casual, lighter meal that can sit between a hill walk and Pigalle or Lamarck-Caulaincourt.", { price: "$$", priceSource: "Official restaurant site / Google Maps" }),
        nStop("montmartre-food-poulbot", "Le Poulbot", [48.8866, 2.3404], "Le Poulbot gives the central hill a compact French meal close to Place du Tertre while still feeling more deliberate than the busiest tourist-strip terraces.", { price: "$$", priceSource: "Google Maps / local dining guides" }),
        nStop("montmartre-food-moulin-galette", "Moulin de la Galette", [48.8873, 2.3367], "Moulin de la Galette is both food and history: a restaurant beside one of Montmartre's surviving windmills, tied to the old dance-hall name painted by Renoir, Van Gogh, and other artists. It suits a meal where the hill's story should be part of the table.", { price: "$$$", priceSource: "Official restaurant site / Google Maps" }),
      ],
    },
    Nightlife: {
      title: "Hilltop Views and Low-Key Montmartre Nights",
      description:
        "Montmartre's nightlife splits between the upper hill's sunset terraces, historic song cabarets, and discreet hotel bars, with more casual drinking near Abbesses below. Cabaret requires a ticket and fixed performance time; the rooftop and cocktail bars suit a single aperitif without committing to a full show.",
      stops: [
        nStop("montmartre-nightlife-terrass", "Terrass Hotel Rooftop", [48.8852, 2.3326], "Terrass Hotel Rooftop serves polished aperitifs and cocktails with broad sunset views from Montmartre, without requiring the climb to the basilica steps.", { price: "$$$", priceSource: "Official hotel site / Google Maps" }),
        nStop("montmartre-nightlife-lapin-agile", "Au Lapin Agile", [48.8888, 2.3401], "Au Lapin Agile is a historic Montmartre cabaret presenting traditional French song and intimate live performance in a room steeped in artist lore. Admission follows the performance schedule rather than drop-in bar hours.", { price: "$$", priceSource: "Official venue site / Google Maps" }),
        nStop("montmartre-nightlife-tres-particulier", "Le Tres Particulier", [48.8882, 2.3339], "Le Tres Particulier is the hidden bar inside Hotel Particulier Montmartre, with garden secrecy, piano-bar intimacy, and a more chic hilltop mood.", { price: "$$$", priceSource: "Official hotel site / Google Maps" }),
        nStop("montmartre-nightlife-marlusse", "Marlusse et Lapin", [48.8842, 2.3364], "Marlusse et Lapin is the lower-hill bar for creative cocktails, a funky nook, live-performance nights, and happy-hour momentum near Abbesses.", { price: "$$", priceSource: "Google Maps / local nightlife guides" }),
      ],
    },
    Nature: {
      title: "Steps, Slopes, and Quiet Hill Corners",
      description:
        "Montmartre's outdoor routes use the hill itself: Sacre-Coeur viewpoints, garden paths on the climb, and quieter green pockets toward Lamarck-Caulaincourt. Go early or late for the clearest views; at midday, the cemetery and back-of-hill squares provide more room than the basilica terrace.",
      stops: [
        nStop("montmartre-nature-sacre-steps", "Sacre-Coeur Steps", [48.8867, 2.3431], "The Sacre-Coeur steps provide Montmartre's obvious city view, clearest early or late when the hill has room to breathe. Midday crowds make the terrace a brief viewpoint rather than an all-day hangout.", { photo: photos.montmartre }),
        nStop("montmartre-nature-louise-michel", "Square Louise Michel", [48.8846, 2.3443], "Square Louise Michel gives the climb to Sacre-Coeur a garden frame, with switchback paths, lawns, and changing city views.", { photo: photos.nature }),
        nStop("montmartre-nature-suzanne-buisson", "Square Suzanne Buisson", [48.8886, 2.3369], "Square Suzanne Buisson is a quiet green pocket on the back of Montmartre hill, near Lamarck-Caulaincourt and the old mills but removed from the busiest summit lanes.", { photo: photos.nature }),
        nStop("montmartre-nature-cemetery", "Cimetiere de Montmartre", [48.8875, 2.3306], "Cimetiere de Montmartre adds a leafy, reflective walk below the hill and is a calmer alternative to Sacre-Coeur crowds.", { photo: photos.nature }),
      ],
    },
    Culture: {
      title: "Montmartre Basilica, Artists, and Old Windmills",
      description:
        "Montmartre culture spans the basilica, artist studios, village squares, surviving windmills, and the hill's long place in Paris art history.",
      stops: [
        nStop("montmartre-culture-sacre-coeur", "Basilique du Sacre-Coeur", [48.8867, 2.3431], "Basilique du Sacre-Coeur is Montmartre's white-domed hilltop church, with mosaics, crypt spaces, a dome climb, and one of the city's most recognizable silhouettes. Its position makes the basilica both a religious site and a Paris viewpoint."),
        nStop("montmartre-culture-musee-montmartre", "Musee de Montmartre", [48.8872, 2.3408], "Musee de Montmartre occupies 17th-century houses and gardens where artists including Renoir once worked. The museum covers Montmartre's studios, cabarets, posters, village life, and bohemian art history."),
        nStop("montmartre-culture-place-tertre", "Place du Tertre", [48.8865, 2.3407], "Place du Tertre is Montmartre's artist square, lined with portrait painters, cafes, and narrow streets that keep the neighborhood's open-air studio identity visible. Portraiture remains part of the square's public life rather than something confined to a museum."),
        nStop("montmartre-culture-moulin-galette", "Moulin de la Galette", [48.8873, 2.3367], "Moulin de la Galette is the historic Montmartre windmill and restaurant site linked to the old dance hall painted by Renoir and other artists. It makes the hill's mill, restaurant, and art-history layers clear in one place."),
      ],
    },
    Stay: [
      {
        title: "Montmartre Hilltop Hotels",
        description:
          "Montmartre hotels combine village streets, rooftop views, and north-side evenings on a steep hill. These are private-room stays, kept separate from the area's hostel beds.",
        stops: [
          nStop("montmartre-stay-terrass", "Terrass Hotel", [48.8852, 2.3326], "Terrass Hotel is the view-led Montmartre hotel, with rooftop drinks, rooms near Rue Caulaincourt, and easy access to Abbesses, the cemetery, and lower-hill restaurants.", { price: "$$$", priceSource: "Conde Nast Traveler / Google Travel", officialUrl: "https://www.terrass-hotel.com/", ...hotelStay }),
          nStop("montmartre-stay-arts", "Hotel des Arts Montmartre", [48.8853, 2.3348], "Hotel des Arts Montmartre is a smaller neighborhood hotel close to Abbesses, restaurants, and hill walks, with a warmer boutique mood than the bigger view-led properties.", { price: "$$", priceSource: "Google Travel / Tripadvisor", officialUrl: "https://www.arts-hotel-paris.com/", ...hotelStay }),
          nStop("montmartre-stay-momart", "Mom'Art Hotel", [48.8846, 2.3432], "Mom'Art Hotel is a compact boutique hotel near Anvers, Abbesses, and Sacre-Coeur, with a patio and lower-hill access that keeps the Montmartre climb, cafes, and evening streets close.", { price: "$$", priceSource: "Google Travel / Tripadvisor", officialUrl: "https://www.hotelmomart.com/en/", ...hotelStay }),
        ],
      },
      {
        topic: "Hostels",
        title: "Montmartre Hostel Beds and Budget Rooms",
        description:
          "Near Anvers, Le Village Montmartre combines dorm beds, private rooms, and a terrace within walking distance of Sacre-Coeur. It lowers the nightly cost without giving up a central hill address, but remains a hostel rather than a substitute for the area's full-service hotels.",
        stops: [
          nStop("montmartre-stay-village", "Le Village Montmartre", [48.8842, 2.3446], "Le Village Montmartre combines hostel dorms, superior private rooms, and a terrace near Anvers and Sacre-Coeur. The format keeps Montmartre accessible at a lower nightly spend.", { price: "$", priceSource: "Hostelworld / HostelsClub", officialUrl: "https://www.villagehostel.fr/", ...hostelStay }),
        ],
      },
    ],
  },
  "Canal Saint-Martin": {
    Food: {
      title: "Bakery Mornings and Canal Tables",
      description:
        "Canal Saint-Martin food is best when it follows the water: bakery starts, brunch queues, rotating kitchens, and terrace meals.",
      stops: [
        nStop("canal-food-du-pain", "Du Pain et des Idees", [48.8719, 2.3622], "Du Pain et des Idees is a Canal Saint-Martin bakery known for pain des amis, escargot pastries, and focused morning counter service near Republique.", { price: "$", priceSource: "Eater / Google Maps" }),
        nStop("canal-food-holybelly", "Holybelly 5", [48.8723, 2.3606], "Holybelly 5 is a high-demand seated brunch cafe near the canal, serving pancakes, eggs, seasonal plates, and carefully made coffee. Queues are common.", { price: "$$", priceSource: "Google Maps / Paris dining guides" }),
        nStop("canal-food-early-june", "Early June", [48.8739, 2.3621], "Early June gives the canal a rotating-chef, natural-wine dinner that changes more often than a standard bistro menu.", { price: "$$", priceSource: "Eater / Google Maps" }),
        nStop("canal-food-chez-prune", "Chez Prune", [48.8726, 2.3634], "Chez Prune is the canal-side cafe standby for lunch, aperitif, or an easy meal with the water close by.", { price: "$$", priceSource: "Time Out / Google Maps" }),
      ],
    },
    Nightlife: {
      title: "Canal Drinks With a Route",
      description:
        "Canal Saint-Martin nights are strongest when they stay walkable: a designed room, a music terrace, an atmospheric indoor spot, and a casual meeting-point cafe.",
      stops: [
        nStop("canal-nightlife-gravity", "Gravity Bar", [48.8728, 2.3622], "Gravity Bar gives the canal sophisticated craft cocktails, creative tapas, natural wines, and a hip room with a wavy-ceiling look.", { price: "$$", priceSource: "Time Out / Google Maps" }),
        nStop("canal-nightlife-la-meduse", "La Meduse", [48.8791, 2.3671], "La Meduse gives the canal a cocktail-and-natural-wine option right by the water, with enough food to keep the evening flexible.", { price: "$$", priceSource: "Time Out / Google Maps" }),
        nStop("canal-nightlife-point-ephemere", "Point Ephemere", [48.8819, 2.3686], "Point Ephemere is a canal-side arts center with concerts, exhibitions, artist studios, a bar, and a broad terrace. The crowd and format change with the official program, making the calendar central to the visit.", { price: "$$", priceSource: "Time Out / Google Maps" }),
        nStop("canal-nightlife-comptoir-general", "Le Comptoir General", [48.8727, 2.3638], "Le Comptoir General gives the canal a rustic-chic room and leafy terrace, with classic fish dishes, cocktails, and a decor-heavy mood that can carry dinner into drinks. It is best saved for atmosphere-forward evenings.", { price: "$$", priceSource: "Time Out / Google Maps" }),
      ],
    },
    Nature: {
      title: "Locks, Banks, and East-Side Air",
      description:
        "Canal Saint-Martin's outdoor space follows the water, running past working locks and footbridges from Republique toward the broader Bassin de la Villette. Small gardens provide benches along the way, but the continuous waterside walk is more substantial than any single park.",
      stops: [
        nStop("canal-nature-locks", "Canal Saint-Martin Locks", [48.8721, 2.3648], "The Canal Saint-Martin locks turn a neighborhood walk into a sequence of bridges, water, working gates, and street corners lined with bakeries, cafes, and evening bars.", { photo: photos.canal }),
        nStop("canal-nature-villemin", "Jardin Villemin", [48.8764, 2.3614], "Jardin Villemin gives the canal a practical green pause near Gare de l'Est and the central banks.", { photo: photos.nature }),
        nStop("canal-nature-frederic-lemaitre", "Square Frederic-Lemaitre", [48.871, 2.367], "Square Frederic-Lemaitre is a compact neighborhood garden beside the canal near Republique, with trees, planting, and benches set back from the traffic. It is useful as public green space, not as a destination park.", { photo: photos.nature }),
        nStop("canal-nature-bassin-villette", "Bassin de la Villette", [48.884, 2.371], "Bassin de la Villette extends the canal walk into wider water, picnic edges, and summer activity.", { photo: photos.canal }),
      ],
    },
    Culture: {
      title: "Canal Art Spaces and Low-Key Galleries",
      description:
        "Current, low-key culture around Canal Saint-Martin includes art spaces, graphic galleries, music venues, and civic squares near the water and Republique.",
      stops: [
        nStop("canal-culture-point-ephemere", "Point Ephemere", [48.8819, 2.3686], "Point Ephemere is a canal-side art and music space with exhibitions, artist studios, concerts, workshops, a bar, and a broad waterside terrace. The official program determines the room's character from one date to the next."),
        nStop("canal-culture-comptoir-general", "Le Comptoir General", [48.8727, 2.3638], "Le Comptoir General is a cultural venue as much as a bar, with layered decor, events, a leafy terrace, and a slightly theatrical canal-side atmosphere. It gives the neighborhood a social, design-heavy stop."),
        nStop("canal-culture-galerie-martel", "Galerie Martel", [48.8752, 2.3528], "Galerie Martel is a small gallery devoted to illustration, comics, drawing, painting, and graphic arts. Its exhibitions feel more niche and intimate than institutional."),
        nStop("canal-culture-republique", "Place de la Republique", [48.8675, 2.363], "Place de la Republique is the large civic square south of the canal, centered on the Monument a la Republique. It works culturally as a public gathering space, protest site, meeting point, and piece of republican symbolism."),
      ],
    },
    Stay: [
      {
        title: "Canal Saint-Martin Hotels",
        description:
          "Hotels around Canal Saint-Martin favor small, design-conscious rooms and immediate access to the water, Republique, and Gare de l'Est. The smaller hotel puts canal views in every room; the design hotel sits closer to Strasbourg-Saint-Denis restaurants and bars but not directly on the water.",
        stops: [
          nStop("canal-stay-citizen", "Le Citizen Hotel", [48.8726, 2.3643], "Le Citizen Hotel is a small canal-facing hotel with refined simplicity, elegant rooms, and canal views from each room.", { price: "$$", priceSource: "Google Travel / Tripadvisor", officialUrl: "https://lecitizenhotel.com/", ...hotelStay }),
          nStop("canal-stay-providence", "Hotel Providence", [48.8701, 2.3568], "Hotel Providence is a design-led hotel in the heart of the eastern district, close to Canal Saint-Martin, Strasbourg-Saint-Denis, Republique, restaurants, and late bars.", { price: "$$$", priceSource: "Conde Nast Traveler / Google Travel", officialUrl: "https://hotelprovidenceparis.com/", ...hotelStay }),
        ],
      },
      {
        topic: "Hostels",
        title: "Canal Hostels and Social Bases",
        description:
          "Canal Saint-Martin has a real hostel scene built around dorms, private rooms, bars, rooftops, events, and large communal spaces. The properties range from party-forward to design-conscious, so social profile matters as much as bed price.",
        stops: [
          nStop("canal-stay-generator", "Generator Paris", [48.8795, 2.3696], "Generator Paris is a design-hostel near Canal Saint-Martin, with dorms, private rooms, social common areas, and a rooftop with city views. It keeps costs lower while still feeling polished.", { price: "$", priceSource: "Hostelworld / Google Maps", officialUrl: "https://staygenerator.com/hostels/paris", ...hostelStay }),
          nStop("canal-stay-st-christophers", "St Christopher's Inn Canal", [48.8868, 2.3756], "St Christopher's Inn Canal is the larger social-hostel base north on the waterline, useful for budget travelers who want dorms, events, private rooms, and Villette access.", { price: "$", priceSource: "Hostelworld / Google Maps", officialUrl: "https://www.st-christophers.co.uk/paris/canal-hostel/", ...hostelStay }),
        ],
      },
    ],
  },
  "7th Arrondissement": {
    Food: {
      title: "Monument-Side Meals With Purpose",
      description:
        "In the 7th, restaurants cluster around the Eiffel Tower, Invalides, Rodin Museum, and Orsay rather than a single dining street. Produce-led tasting menus demand a long, expensive reservation, while neighborhood brasseries are better for a direct lunch between museums.",
      stops: [
        nStop("seventh-food-david-toutain", "David Toutain", [48.8617, 2.3048], "In the 7th, David Toutain is the destination-dining counterweight to monument routes, with highly composed seasonal menus and a serious reservation posture near Invalides and the Eiffel Tower.", { price: "$$$", priceSource: "MICHELIN Guide / David Toutain official" }),
        nStop("seventh-food-arpege", "Arpege", [48.8555, 2.3162], "Arpege is Alain Passard's garden-first fine-dining landmark, built around exceptional produce and meticulous craft. The high-budget reservation demands a long, committed meal.", { price: "$$$", priceSource: "MICHELIN Guide / Google Maps" }),
        nStop("seventh-food-fontaine-mars", "La Fontaine de Mars", [48.8587, 2.3044], "La Fontaine de Mars serves cassoulet, duck, and steak in a proper neighborhood dining room despite its Eiffel-side Rue Saint-Dominique address.", { price: "$$$", priceSource: "Google Maps / Paris dining guides" }),
        nStop("seventh-food-cafe-varenne", "Cafe Varenne", [48.855, 2.3194], "Cafe Varenne is a neighborhood brasserie near the Rodin Museum and Invalides, serving familiar French lunch and dinner plates in a straightforward dining room. It is dependable rather than destination-driven.", { price: "$$", priceSource: "Google Maps / local dining guides" }),
        nStop("seventh-food-fitzgerald", "Fitzgerald", [48.8572, 2.3078], "Fitzgerald works as more than a hidden bar: it has lunch, dinner, drinks, terrace hours, and a Sunday brunch format that can soften an Eiffel-side day. Add it when the 7th needs something relaxed but still stylish.", { price: "$$$", priceSource: "Official restaurant site / Google Maps" }),
      ],
    },
    Nightlife: {
      title: "River Drinks and Polished Nightcaps",
      description:
        "The 7th is not a late-night district, so the best after-dark stops are intentional: river barges, hotel-adjacent bars, rooftops, and polished cafes.",
      stops: [
        nStop("seventh-nightlife-fitzgerald", "Fitzgerald", [48.8572, 2.3078], "Fitzgerald gives the 7th a restaurant, terrace, and speakeasy-style bar behind Rue Saint-Dominique. It can start as brunch or dinner and turn into a more dressed-up late drink without leaving the Eiffel side.", { price: "$$$", priceSource: "Time Out / Google Maps" }),
        nStop("seventh-nightlife-rosa-bonheur", "Rosa Bonheur sur Seine", [48.862, 2.3069], "Rosa Bonheur sur Seine brings the 7th to the river with a barge-party format that works better for groups and warm evenings than quiet cocktails.", { price: "$$", priceSource: "Google Maps / local nightlife guides" }),
        nStop("seventh-nightlife-les-ombres", "Les Ombres", [48.861, 2.2978], "Les Ombres is the Eiffel-view rooftop restaurant and bar above Quai Branly, serving lunch and dinner with contemporary French cooking touched by Mediterranean influence.", { price: "$$$", priceSource: "Google Maps / official venue site" }),
        nStop("seventh-nightlife-recrutement", "Le Recrutement Cafe", [48.8568, 2.304], "Le Recrutement Cafe is a casual Rue Saint-Dominique terrace for simple drinks, low-pressure service, and people-watching near the Eiffel Tower and Invalides.", { price: "$$", priceSource: "Google Maps / local nightlife guides" }),
      ],
    },
    Nature: {
      title: "Lawns, Gardens, and River Space",
      description:
        "Outdoor time in the 7th should soften monument days: Champ de Mars, Rodin's sculpture garden, Invalides lawns, and Seine edges.",
      stops: [
        nStop("seventh-nature-champ-mars", "Champ de Mars", [48.8556, 2.2986], "Champ de Mars is the Eiffel-side lawn and view corridor, best early, late, or with a picnic when the tower has space around it. Midday brings the heaviest crowds.", { photo: photos.eiffel }),
        nStop("seventh-nature-invalides", "Esplanade des Invalides", [48.8606, 2.313], "Esplanade des Invalides gives the 7th a broad green axis between the river and the dome. It is a walking reset between Orsay, Rodin, and Invalides.", { photo: photos.nature }),
        nStop("seventh-nature-rodin-garden", "Musee Rodin Sculpture Garden", [48.8554, 2.3158], "The Musee Rodin sculpture garden is the district's best art-and-air combination, with outdoor works and a slower pace than the larger museums. It keeps sculpture, garden time, and 7th-arrondissement calm in the same stop."),
        nStop("seventh-nature-solferino", "Port de Solferino Seine Walk", [48.861, 2.315], "Port de Solferino opens the 7th directly onto the Seine, with a low riverbank path linking the Orsay side to bridges toward Invalides and the Eiffel Tower. The experience is free, linear, and defined by changing water-level views.", { photo: photos.seine }),
      ],
    },
    Culture: {
      title: "Eiffel Tower, Rodin, Orsay, and Invalides",
      description:
        "The 7th holds some of Paris's clearest cultural landmarks: the Eiffel Tower, Orsay's railway-station museum, Rodin's sculpture rooms and garden, and the Invalides dome.",
      stops: [
        nStop("seventh-culture-eiffel", "Eiffel Tower", [48.8584, 2.2945], "The Eiffel Tower is Paris's defining landmark, built for the 1889 Exposition Universelle. Its iron lattice structure, observation levels, engineering history, restaurants, and night illumination make it a cultural monument as much as a viewpoint.", { photo: photos.eiffel }),
        nStop("seventh-culture-orsay", "Musee d'Orsay", [48.8599, 2.3266], "Musee d'Orsay is a former railway station turned art museum, holding the world's largest collection of Impressionist and Post-Impressionist masterpieces. Monet, Renoir, Degas, Manet, Van Gogh, sculpture, and decorative arts fill the great hall and upper galleries."),
        nStop("seventh-culture-rodin", "Musee Rodin", [48.8554, 2.3158], "Musee Rodin presents Rodin's sculpture inside the Hotel Biron and its garden, including The Thinker, The Kiss, The Gates of Hell, studies, plasters, and outdoor bronzes. The museum shows both finished icons and the making process behind them."),
        nStop("seventh-culture-invalides", "Les Invalides", [48.8566, 2.3126], "Les Invalides is a vast 17th-century complex built for veterans, now housing military museums, courtyards, the gilded Dome Church, and Napoleon's tomb. Its scale makes it one of the defining monuments of the 7th."),
      ],
    },
    Stay: {
      title: "Eiffel-Side Hotels",
      description:
        "Hotels in the 7th put the Eiffel Tower, Invalides, Orsay, and the Seine within a calm, largely residential base. Smaller properties charge for views and walkability; higher-priced stays add spas, pools, and more elaborate interiors, while late-night bar access remains limited.",
      stops: [
        nStop("seventh-stay-la-comtesse", "Hotel La Comtesse", [48.8539, 2.3065], "Hotel La Comtesse is the Eiffel-view boutique hotel for Champ de Mars, Rue Cler, and Invalides close by, with location and view doing more work than big-resort amenities.", { price: "$$", priceSource: "Google Travel / Tripadvisor", officialUrl: "https://www.comtesse-hotel.com/", ...hotelStay }),
        nStop("seventh-stay-le-walt", "Hotel Le Walt", [48.8548, 2.3089], "Hotel Le Walt is a smaller, quieter, room-focused property near Ecole Militaire, Rue Cler, Invalides, and the Eiffel Tower.", { price: "$$", priceSource: "Google Travel / Tripadvisor", officialUrl: "https://www.lewaltparis.com/", ...hotelStay }),
        nStop("seventh-stay-jk-place", "J.K. Place Paris", [48.8604, 2.3183], "J.K. Place Paris is an intimate design-luxury hotel near the Seine, Orsay, and Invalides, with polished residential interiors, a wellness spa, and a marble-and-tile pool.", { price: "$$$", priceSource: "Conde Nast Traveler / Google Travel", officialUrl: "https://www.jkplaces.com/jkparis/", ...hotelStay }),
        nStop("seventh-stay-montalembert", "Hotel Montalembert", [48.8565, 2.327], "Hotel Montalembert sits on the Saint-Germain edge of the 7th, with elegant rooms, Left Bank dining nearby, and easy movement between Orsay, galleries, Rue du Bac, and Saint-Germain cafes.", { price: "$$$", priceSource: "Google Travel / Tripadvisor", officialUrl: "https://www.hotelmontalembert-paris.com/", ...hotelStay }),
      ],
    },
  },
};

const parisRepairCheckedAt = "2026-07-16";

const parisTargetGuideIds = new Set([
  "list-paris-1st-arrondissement-restaurants",
  "list-paris-1st-arrondissement-parks-and-walks",
  "list-paris-le-marais-culture",
  "list-paris-saint-germain-des-pres-parks-and-walks",
  "list-paris-saint-germain-des-pres-hotels-and-hostels",
  "list-paris-latin-quarter-parks-and-walks",
  "list-paris-montmartre-bars",
  "list-paris-montmartre-parks-and-walks",
  "list-paris-montmartre-hostels",
  "list-paris-canal-saint-martin-parks-and-walks",
  "list-paris-canal-saint-martin-hotels-and-hostels",
  "list-paris-7th-arrondissement-restaurants",
  "list-paris-7th-arrondissement-hotels-and-hostels",
]);

const parisEveryDay = (value: string, defaultNote?: string): NonNullable<GuideStop["hours"]> => ({
  ...(defaultNote ? { default: defaultNote } : {}),
  mon: value,
  tue: value,
  wed: value,
  thu: value,
  fri: value,
  sat: value,
  sun: value,
});

type ParisStopRepair = Partial<GuideStop> & {
  officialUrl: string;
  statusUrl?: string;
};

const parisStopRepairs: Record<string, ParisStopRepair> = {
  "first-food-angelina": {
    officialUrl: "https://www.angelina-paris.fr/adresses/paris-rivoli",
    statusUrl: "https://parisjetaime.com/eng/restaurant/angelina-rivoli-p1127",
    hours: { mon: "7:30 AM-7:00 PM", tue: "7:30 AM-7:00 PM", wed: "7:30 AM-7:00 PM", thu: "7:30 AM-7:00 PM", fri: "7:30 AM-7:30 PM", sat: "8:00 AM-7:30 PM", sun: "8:00 AM-7:30 PM" },
    venueKind: "food_drink", foodServiceType: "cafe", cuisineTypes: ["French", "Patisserie", "Tea room"],
    attributeTags: ["historic", "dessert", "breakfast", "reservation_recommended"],
  },
  "first-food-sanukiya": {
    officialUrl: "https://www.instagram.com/sanukiya_udon/",
    statusUrl: "https://www.pagesjaunes.fr/pros/51318713",
    hours: parisEveryDay("11:30 AM-10:30 PM"),
    venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["Japanese", "Udon"],
    attributeTags: ["casual", "counter_seating", "budget_food", "walk_in_friendly"],
    imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Sanukiya,_Paris,_19_March_2016.jpg",
  },
  "first-food-verjus": {
    officialUrl: "https://www.verjusparis.com/contact",
    statusUrl: "https://guide.michelin.com/en/ile-de-france/paris/restaurant/verjus",
    hours: { mon: "6:00 PM-11:00 PM", tue: "6:00 PM-11:00 PM", wed: "6:00 PM-11:00 PM", thu: "6:00 PM-11:00 PM", fri: "12:30 PM-2:00 PM; 6:00 PM-11:00 PM", sat: "Closed", sun: "Closed" },
    venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["Contemporary", "Modern French"],
    attributeTags: ["date_night", "tasting_menu", "reservation_required", "destination_dining"],
  },
  "first-food-le-nemours": {
    officialUrl: "https://www.lenemours.paris/contact-infos",
    statusUrl: "https://parisjetaime.com/eng/restaurant/le-nemours-p1277",
    hours: { mon: "8:00 AM-12:00 AM", tue: "8:00 AM-12:00 AM", wed: "8:00 AM-12:00 AM", thu: "8:00 AM-12:00 AM", fri: "8:00 AM-12:00 AM", sat: "9:00 AM-12:00 AM", sun: "9:00 AM-8:00 PM" },
    venueKind: "food_drink", foodServiceType: "cafe", cuisineTypes: ["French", "Brasserie"],
    attributeTags: ["terrace", "breakfast", "central", "walk_in_friendly"],
    photo: "https://cdn.restovisio.com/resize/800/gallery/large/57d6c5341dfc4-3a9acd9d3df46d37388d74711234552a.jpg",
    imageSourceUrl: "https://www.lenemours.paris/#section-galerie",
  },
  "first-food-le-fumoir": {
    officialUrl: "https://www.lefumoir.com/",
    statusUrl: "https://parisjetaime.com/eng/restaurant/le-fumoir-p1281",
    hours: parisEveryDay("11:00 AM-2:00 AM"),
    venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["French", "Scandinavian-influenced"],
    attributeTags: ["date_night", "late_night", "central", "reservation_recommended"],
  },

  "first-nature-tuileries": {
    officialUrl: "https://www.louvre.fr/en/explore/the-gardens",
    statusUrl: "https://www.louvre.fr/en/visit/hours-admission",
    hours: parisEveryDay("7:00 AM-10:30 PM", "The Louvre's dated seasonal garden timetable controls closing time; the current 21 June-30 July period closes at 10:30 PM."),
    venueKind: "outdoors", subcategory: "formal_garden", attributeTags: ["scenic", "walking", "central", "free_entry"],
    photo: "https://upload.wikimedia.org/wikipedia/commons/0/00/Grand_bassin_octogonal_Jardin_des_Tuileries_003.jpg",
    imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Grand_bassin_octogonal_Jardin_des_Tuileries_003.jpg",
  },
  "first-nature-palais-royal-garden": {
    officialUrl: "https://www.domaine-palais-royal.fr/visiter/informations-pratiques",
    hours: parisEveryDay("8:00 AM-10:30 PM", "The official seasonal schedule is 8:00 AM-10:30 PM from April through September and 8:00 AM-8:30 PM from October through March."),
    venueKind: "outdoors", subcategory: "formal_garden", attributeTags: ["quiet", "walking", "central", "free_entry"],
    photo: "https://upload.wikimedia.org/wikipedia/commons/e/e8/P1120936_Paris_Ier_Palais-Royal_galerie_de_Beaujolais_rwk.JPG",
    imageSourceUrl: "https://commons.wikimedia.org/wiki/File:P1120936_Paris_Ier_Palais-Royal_galerie_de_Beaujolais_rwk.JPG",
  },
  "first-nature-vert-galant": {
    officialUrl: "https://www.paris.fr/lieux/square-du-vert-galant-2825",
    hours: parisEveryDay("Open 24 hours", "The dated Ville de Paris seasonal timetable and weather-safety notices control exceptional gate closures."),
    venueKind: "outdoors", subcategory: "riverside_park", attributeTags: ["scenic", "romantic", "walking", "free_entry"],
    photo: "https://upload.wikimedia.org/wikipedia/commons/3/32/Square_du_Vert-Galant_003.jpg",
    imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Square_du_Vert-Galant_003.jpg",
  },
  "first-nature-seine-quays": {
    officialUrl: "https://www.paris.fr/lieux/parc-rives-de-seine-15619",
    hours: parisEveryDay("Open 24 hours", "Flood, weather, and river-safety closures are published on the official Ville de Paris page."),
    venueKind: "outdoors", subcategory: "river_walk", attributeTags: ["walking", "scenic", "central", "free_entry"],
    photo: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Quai_du_Louvre_from_Pont_des_Arts_%40_Seine_%40_Paris_%2833394149414%29.jpg",
    imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Quai_du_Louvre_from_Pont_des_Arts_@_Seine_@_Paris_(33394149414).jpg",
  },

  "marais-culture-picasso": {
    officialUrl: "https://www.museepicassoparis.fr/en/plan-your-visit",
    hours: { mon: "Closed", tue: "10:30 AM-6:00 PM", wed: "10:30 AM-6:00 PM", thu: "10:30 AM-6:00 PM", fri: "10:30 AM-6:00 PM", sat: "9:30 AM-6:00 PM", sun: "9:30 AM-6:00 PM" },
    venueKind: "culture", subcategory: "art_museum", attributeTags: ["museum", "art", "timed_ticket", "rainy_day"],
  },
  "marais-culture-carnavalet": {
    officialUrl: "https://www.carnavalet.paris.fr/en/prepare-your-visit",
    hours: { mon: "Closed", tue: "10:00 AM-6:00 PM", wed: "10:00 AM-6:00 PM", thu: "10:00 AM-6:00 PM", fri: "10:00 AM-6:00 PM", sat: "10:00 AM-6:00 PM", sun: "10:00 AM-6:00 PM" },
    venueKind: "culture", subcategory: "history_museum", attributeTags: ["museum", "historic", "free_entry", "rainy_day"],
  },
  "marais-culture-victor-hugo": {
    officialUrl: "https://www.maisonsvictorhugo.paris.fr/en/paris/visit",
    hours: { mon: "Closed", tue: "10:00 AM-6:00 PM", wed: "10:00 AM-6:00 PM", thu: "10:00 AM-6:00 PM", fri: "10:00 AM-6:00 PM", sat: "10:00 AM-6:00 PM", sun: "10:00 AM-6:00 PM" },
    venueKind: "culture", subcategory: "literary_museum", attributeTags: ["museum", "historic", "free_entry", "rainy_day"],
    photo: "https://upload.wikimedia.org/wikipedia/commons/4/46/Maison_de_Victor_Hugo_Paris_27122012_Chambre.jpg",
    imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Maison_de_Victor_Hugo_Paris_27122012_Chambre.jpg",
  },
  "marais-culture-hotel-sully": {
    officialUrl: "https://www.hotel-de-sully.fr/en/visit/practical-information",
    hours: parisEveryDay("9:00 AM-7:00 PM", "Courtyard and garden-passage access follows the official monument schedule and security notices."),
    venueKind: "culture", subcategory: "historic_architecture", attributeTags: ["historic", "architecture", "free_entry", "walking"],
  },

  "saint-germain-nature-luxembourg": {
    officialUrl: "https://jardin.senat.fr/",
    hours: { default: "Gate hours follow the dated biweekly timetable published by the French Senate; official ceremonies and severe-weather closures are posted on that timetable." },
    venueKind: "outdoors", subcategory: "formal_garden", attributeTags: ["scenic", "walking", "family_friendly", "free_entry"],
    photo: "https://upload.wikimedia.org/wikipedia/commons/a/af/Palais_du_Luxembourg%2C_South_View_140116_1.jpg",
    imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Palais_du_Luxembourg,_South_View_140116_1.jpg",
  },
  "saint-germain-nature-laurent-prache": {
    officialUrl: "https://www.paris.fr/lieux/square-laurent-prache-2455",
    hours: { default: "The dated Ville de Paris seasonal timetable controls gate hours and exceptional weather closures.", mon: "9:30 AM-8:30 PM", tue: "9:30 AM-8:30 PM", wed: "9:30 AM-8:30 PM", thu: "9:30 AM-8:30 PM", fri: "9:30 AM-8:30 PM", sat: "9:00 AM-8:30 PM", sun: "9:00 AM-8:30 PM" },
    venueKind: "outdoors", subcategory: "neighborhood_garden", attributeTags: ["quiet", "central", "free_entry", "historic"],
    photo: "https://upload.wikimedia.org/wikipedia/commons/c/cc/P1240329_Paris_VI_square_Laurent-Prache_rwk.jpg",
    imageSourceUrl: "https://commons.wikimedia.org/wiki/File:P1240329_Paris_VI_square_Laurent-Prache_rwk.jpg",
  },
  "saint-germain-nature-gabriel-pierne": {
    officialUrl: "https://www.paris.fr/lieux/square-gabriel-pierne-2453",
    hours: { default: "Ville de Paris's official summer-night exception runs 16 July-6 September 2026; the dated seasonal timetable and safety notices control later changes.", mon: "8:00 AM-11:59 PM", tue: "8:00 AM-11:59 PM", wed: "8:00 AM-11:59 PM", thu: "8:00 AM-11:59 PM", fri: "8:00 AM-11:59 PM", sat: "9:00 AM-11:59 PM", sun: "9:00 AM-11:59 PM" },
    venueKind: "outdoors", subcategory: "neighborhood_garden", attributeTags: ["quiet", "central", "free_entry", "art"],
    photo: "https://upload.wikimedia.org/wikipedia/commons/4/4e/F5759_Paris_6e_square_Gabriel_Pierne_rwk.jpg",
    imageSourceUrl: "https://commons.wikimedia.org/wiki/File:F5759_Paris_6e_square_Gabriel_Pierne_rwk.jpg",
  },
  "saint-germain-nature-quai-malaquais": {
    officialUrl: "https://www.paris.fr/lieux/parc-rives-de-seine-15619",
    hours: parisEveryDay("Open 24 hours", "Flood, weather, and river-safety closures are published on the official Ville de Paris page."),
    venueKind: "outdoors", subcategory: "river_walk", attributeTags: ["walking", "scenic", "central", "free_entry"],
    photo: "https://upload.wikimedia.org/wikipedia/commons/2/27/Paris_75006_Street_light_quai_Malaquais_20060526.jpg",
    imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Paris_75006_Street_light_quai_Malaquais_20060526.jpg",
  },

  "saint-germain-stay-lutetia": { officialUrl: "https://www.mandarinoriental.com/en/paris/lutetia", lodgingType: "hotel", attributeTags: ["luxury", "wellness", "historic", "central"] },
  "saint-germain-stay-relais-christine": { officialUrl: "https://www.relais-christine.com/", lodgingType: "hotel", attributeTags: ["luxury", "romantic", "quiet", "historic"] },
  "saint-germain-stay-aubusson": { officialUrl: "https://www.hoteldaubusson.com/", lodgingType: "hotel", attributeTags: ["luxury", "historic", "live_music", "wellness"] },
  "saint-germain-stay-madison": { officialUrl: "https://www.hotel-madison.com/", lodgingType: "hotel", attributeTags: ["design", "central", "romantic", "midrange"] },

  "latin-nature-luxembourg": {
    officialUrl: "https://jardin.senat.fr/",
    hours: { default: "Gate hours follow the dated biweekly timetable published by the French Senate; official ceremonies and severe-weather closures are posted on that timetable." },
    venueKind: "outdoors", subcategory: "formal_garden", attributeTags: ["scenic", "walking", "family_friendly", "free_entry"],
    photo: "https://upload.wikimedia.org/wikipedia/commons/a/af/Palais_du_Luxembourg%2C_South_View_140116_1.jpg",
    imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Palais_du_Luxembourg,_South_View_140116_1.jpg",
  },
  "latin-nature-jardin-plantes": {
    officialUrl: "https://www.jardindesplantesdeparis.fr/en/prepare-your-visit",
    statusUrl: "https://www.mnhn.fr/en/jardin-des-plantes",
    hours: parisEveryDay("7:30 AM-8:00 PM", "Garden gates follow the official seasonal schedule; individual galleries, greenhouses, and zoo areas keep separate ticketed timetables."),
    venueKind: "outdoors", subcategory: "botanical_garden", attributeTags: ["nature", "family_friendly", "museum", "walking"],
    photo: "https://upload.wikimedia.org/wikipedia/commons/4/42/Paris_-_Jardin_des_plantes_-_AL_Jussieu.jpg",
    imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Paris_-_Jardin_des_plantes_-_AL_Jussieu.jpg",
  },
  "latin-nature-arenes": {
    officialUrl: "https://www.paris.fr/lieux/arenes-de-lutece-et-square-capitan-1787",
    hours: parisEveryDay("8:00 AM-9:30 PM", "The dated Ville de Paris seasonal timetable controls gate hours and event closures."),
    venueKind: "outdoors", subcategory: "archaeological_park", attributeTags: ["historic", "free_entry", "family_friendly", "walking"],
    photo: "https://upload.wikimedia.org/wikipedia/commons/0/0f/Arenes_de_Lutece_IMG_8656.JPG",
    imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Arenes_de_Lutece_IMG_8656.JPG",
  },
  "latin-nature-seine-bookstalls": {
    officialUrl: "https://www.paris.fr/pages/les-bouquinistes-de-paris-18838",
    hours: parisEveryDay("Open 24 hours for the public quays", "Individual green-box bookstalls follow each vendor's daytime and weather schedule."),
    venueKind: "outdoors", subcategory: "river_walk", attributeTags: ["walking", "books", "shopping_street", "scenic"],
    photo: "https://upload.wikimedia.org/wikipedia/commons/c/c2/Paris_75005_Quai_de_Montebello_Bouquinistes_20071014.jpg",
    imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Paris_75005_Quai_de_Montebello_Bouquinistes_20071014.jpg",
  },

  "montmartre-nightlife-terrass": {
    officialUrl: "https://en.terrass-hotel.com/rooftop",
    hours: { default: "Breakfast and soft drinks run 7:00 AM-3:30 PM Monday-Saturday.", mon: "3:30 PM-11:30 PM", tue: "3:30 PM-12:30 AM", wed: "3:30 PM-12:30 AM", thu: "3:30 PM-12:30 AM", fri: "3:30 PM-12:30 AM", sat: "3:30 PM-12:30 AM", sun: "3:30 PM-11:30 PM" },
    venueKind: "nightlife", nightlifeType: "rooftop_bar", attributeTags: ["rooftop", "scenic_nightlife", "premium_drinks", "date_night"],
  },
  "montmartre-nightlife-lapin-agile": {
    officialUrl: "https://au-lapin-agile.com/pratique/",
    hours: { mon: "Closed", tue: "9:00 PM-1:00 AM", wed: "Closed", thu: "9:00 PM-1:00 AM", fri: "9:00 PM-1:00 AM", sat: "9:00 PM-1:00 AM", sun: "Closed" },
    venueKind: "nightlife", nightlifeType: "live_music_venue", musicGenres: ["French chanson", "cabaret"],
    attributeTags: ["historic", "live_music", "reservation_recommended", "local_specialty"],
  },
  "montmartre-nightlife-tres-particulier": {
    officialUrl: "https://www.hotelparticulier.com/tresparticulier?lng=fr",
    hours: { mon: "6:00 PM-2:00 AM", tue: "6:00 PM-2:00 AM", wed: "6:00 PM-2:00 AM", thu: "6:00 PM-2:00 AM", fri: "6:00 PM-2:00 AM", sat: "6:00 PM-2:00 AM", sun: "4:00 PM-12:00 AM" },
    venueKind: "nightlife", nightlifeType: "cocktail_bar", attributeTags: ["premium_drinks", "romantic_nightlife", "design", "low_key_nightlife"],
  },
  "montmartre-nightlife-marlusse": {
    officialUrl: "https://www.instagram.com/marlusse_et_lapin/",
    statusUrl: "https://maps.apple.com/place?place-id=I1270593410FA14DC",
    hours: parisEveryDay("6:00 PM-2:00 AM"),
    venueKind: "nightlife", nightlifeType: "dive_bar", attributeTags: ["local_bar", "cheap_drinks", "late_night", "lively_nightlife"],
  },

  "montmartre-nature-sacre-steps": {
    officialUrl: "https://www.sacre-coeur-montmartre.com/english/visit-and-audio-guide/",
    hours: parisEveryDay("Open 24 hours for the public steps", "Basilica, dome, and event access follow separate official site and liturgical schedules."),
    venueKind: "outdoors", subcategory: "viewpoint", attributeTags: ["scenic", "walking", "central", "free_entry"],
    imageSourceUrl: "https://www.sacre-coeur-montmartre.com/",
  },
  "montmartre-nature-louise-michel": {
    officialUrl: "https://www.paris.fr/lieux/square-louise-michel-1766",
    hours: { default: "Gate hours follow the dated seasonal timetable published by Ville de Paris; weather, security, and scheduled-event closures are posted there." },
    venueKind: "outdoors", subcategory: "hillside_garden", attributeTags: ["scenic", "walking", "free_entry", "central"],
    photo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Paris_Square_Louise-Michel_Fontaine_monumentale_087.jpg",
    imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Paris_Square_Louise-Michel_Fontaine_monumentale_087.jpg",
  },
  "montmartre-nature-suzanne-buisson": {
    officialUrl: "https://www.paris.fr/lieux/square-suzanne-buisson-2688",
    hours: { default: "The dated Ville de Paris seasonal timetable controls gate hours and exceptional weather closures.", mon: "8:00 AM-8:30 PM", tue: "8:00 AM-8:30 PM", wed: "8:00 AM-8:30 PM", thu: "8:00 AM-8:30 PM", fri: "8:00 AM-8:30 PM", sat: "9:00 AM-8:30 PM", sun: "9:00 AM-8:30 PM" },
    venueKind: "outdoors", subcategory: "neighborhood_garden", attributeTags: ["quiet", "historic", "walking", "free_entry"],
    photo: "https://upload.wikimedia.org/wikipedia/commons/e/e1/P1060375_Paris_XVIII_square_Suzanne-Buisson_rwk.JPG",
    imageSourceUrl: "https://commons.wikimedia.org/wiki/File:P1060375_Paris_XVIII_square_Suzanne-Buisson_rwk.JPG",
  },
  "montmartre-nature-cemetery": {
    officialUrl: "https://www.paris.fr/lieux/cimetiere-de-montmartre-5061",
    statusUrl: "https://www.paris.fr/lieux/cimetieres/tous-les-horaires",
    hours: { mon: "8:00 AM-6:00 PM", tue: "8:00 AM-6:00 PM", wed: "8:00 AM-6:00 PM", thu: "8:00 AM-6:00 PM", fri: "8:00 AM-6:00 PM", sat: "8:30 AM-6:00 PM", sun: "9:00 AM-6:00 PM" },
    venueKind: "outdoors", subcategory: "historic_cemetery", attributeTags: ["quiet", "historic", "walking", "free_entry"],
    photo: "https://upload.wikimedia.org/wikipedia/commons/6/64/Cimeti%C3%A8re_de_Montmartre_-_Vue_de_la_division_9.jpg",
    imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Cimeti%C3%A8re_de_Montmartre_-_Vue_de_la_division_9.jpg",
  },
  "montmartre-stay-village": { officialUrl: "https://www.villagehostel.fr/", lodgingType: "hostel", attributeTags: ["budget", "social", "central", "terrace"] },

  "canal-nature-locks": {
    officialUrl: "https://www.paris.fr/pages/le-canal-saint-martin-6815",
    hours: parisEveryDay("Open 24 hours for the public canal banks", "Navigation and lock operations follow the official canal timetable; temporary bridge and bank closures are posted by Ville de Paris."),
    venueKind: "outdoors", subcategory: "canal_walk", attributeTags: ["walking", "scenic", "free_entry", "local_favorite"],
    photo: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Canal_Saint-Martin_-_%C3%89cluses_des_R%C3%A9collets_001.JPG",
    imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Canal_Saint-Martin_-_%C3%89cluses_des_R%C3%A9collets_001.JPG",
  },
  "canal-nature-villemin": {
    officialUrl: "https://www.paris.fr/lieux/jardin-villemin-mahsa-jina-amini-1798",
    hours: { default: "Ville de Paris's official summer-night exception runs 4 July-6 September 2026; the dated seasonal timetable and safety notices control later changes.", mon: "7:00 AM-11:59 PM", tue: "7:00 AM-11:59 PM", wed: "7:00 AM-11:59 PM", thu: "7:00 AM-11:59 PM", fri: "7:00 AM-11:59 PM", sat: "8:00 AM-11:59 PM", sun: "8:00 AM-11:59 PM" },
    venueKind: "outdoors", subcategory: "neighborhood_garden", attributeTags: ["family_friendly", "relaxing", "free_entry", "local_favorite"],
    photo: "https://upload.wikimedia.org/wikipedia/commons/3/36/P1040702_Paris_X_rue_des_R%C3%A9collets_jardin_Villemin_rwk.jpg",
    imageSourceUrl: "https://commons.wikimedia.org/wiki/File:P1040702_Paris_X_rue_des_R%C3%A9collets_jardin_Villemin_rwk.jpg",
  },
  "canal-nature-frederic-lemaitre": {
    officialUrl: "https://www.paris.fr/lieux/square-frederick-lemaitre-2486",
    hours: { default: "The dated Ville de Paris seasonal timetable controls gate hours and exceptional weather closures.", mon: "8:00 AM-8:30 PM", tue: "8:00 AM-8:30 PM", wed: "8:00 AM-8:30 PM", thu: "8:00 AM-8:30 PM", fri: "8:00 AM-8:30 PM", sat: "9:00 AM-8:30 PM", sun: "9:00 AM-8:30 PM" },
    venueKind: "outdoors", subcategory: "neighborhood_garden", attributeTags: ["quiet", "walking", "free_entry", "local_favorite"],
    photo: "https://upload.wikimedia.org/wikipedia/commons/4/4d/Square_Fr%C3%A9d%C3%A9rick-Lema%C3%AEtre%2C_Paris_10e_2.jpg",
    imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Square_Fr%C3%A9d%C3%A9rick-Lema%C3%AEtre,_Paris_10e_2.jpg",
  },
  "canal-nature-bassin-villette": {
    officialUrl: "https://www.paris.fr/pages/tmp-canaux-7834",
    hours: parisEveryDay("Open 24 hours for the public banks", "Supervised swimming, navigation, and waterside events follow the dated official canal and event calendars."),
    venueKind: "outdoors", subcategory: "canal_basin", attributeTags: ["scenic", "walking", "family_friendly", "free_entry"],
    photo: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Bassin_de_la_Villette_1.jpg",
    imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Bassin_de_la_Villette_1.jpg",
  },
  "canal-stay-citizen": { officialUrl: "https://lecitizenhotel.com/", lodgingType: "hotel", attributeTags: ["design", "scenic", "quiet", "midrange"] },
  "canal-stay-providence": { officialUrl: "https://hotelprovidenceparis.com/", lodgingType: "hotel", attributeTags: ["design", "luxury", "nightlife", "central"] },

  "seventh-food-david-toutain": {
    officialUrl: "https://www.davidtoutain.com/location/horaires-et-localisation/",
    statusUrl: "https://guide.michelin.com/en/ile-de-france/paris/restaurant/david-toutain",
    hours: { mon: "12:30 PM-2:00 PM; 7:30 PM-9:00 PM", tue: "12:00 PM-2:00 PM; 7:30 PM-9:00 PM", wed: "7:30 PM-9:00 PM", thu: "12:00 PM-2:00 PM; 7:30 PM-9:00 PM", fri: "12:00 PM-2:00 PM; 7:30 PM-9:00 PM", sat: "Closed", sun: "Closed" },
    venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["Contemporary", "Modern French"],
    attributeTags: ["fine_dining", "tasting_menu", "destination_dining", "reservation_required"],
  },
  "seventh-food-arpege": {
    officialUrl: "https://www.alain-passard.com/en/",
    statusUrl: "https://guide.michelin.com/en/ile-de-france/paris/restaurant/arpege",
    hours: { mon: "12:00 PM-2:00 PM; 7:30 PM-10:00 PM", tue: "12:00 PM-2:00 PM; 7:30 PM-10:00 PM", wed: "12:00 PM-2:00 PM; 7:30 PM-10:00 PM", thu: "12:00 PM-2:00 PM; 7:30 PM-10:00 PM", fri: "12:00 PM-2:00 PM; 7:30 PM-10:00 PM", sat: "Closed", sun: "Closed" },
    venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["Vegetable-led", "Modern French"],
    attributeTags: ["fine_dining", "tasting_menu", "vegetarian_friendly", "reservation_required"],
  },
  "seventh-food-fontaine-mars": {
    officialUrl: "https://www.fontaine-de-mars.com/en/",
    hours: { mon: "12:00 PM-3:00 PM; 7:00 PM-11:00 PM", tue: "12:00 PM-3:00 PM; 7:00 PM-11:00 PM", wed: "12:00 PM-3:00 PM; 7:00 PM-11:00 PM", thu: "12:00 PM-3:00 PM; 7:00 PM-11:00 PM", fri: "12:00 PM-3:00 PM; 7:00 PM-11:00 PM", sat: "12:00 PM-3:30 PM; 7:00 PM-11:00 PM", sun: "12:00 PM-3:30 PM; 7:00 PM-11:00 PM" },
    venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["French", "Southwestern French", "Bistro"],
    attributeTags: ["historic", "local_specialty", "classic", "reservation_recommended"],
  },
  "seventh-food-cafe-varenne": {
    officialUrl: "https://menuonline.fr/cafevarenne/",
    statusUrl: "https://lefooding.com/restaurants/cafe-varenne",
    hours: { mon: "7:30 AM-10:30 PM", tue: "7:30 AM-10:30 PM", wed: "7:30 AM-10:30 PM", thu: "7:30 AM-10:30 PM", fri: "7:30 AM-10:30 PM", sat: "9:00 AM-10:30 PM", sun: "Closed" },
    venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["French", "Brasserie"],
    attributeTags: ["local_favorite", "solo_friendly", "terrace", "walk_in_friendly"],
  },
  "seventh-food-fitzgerald": {
    officialUrl: "https://www.fitz-group.fr/en/fitzgerald-paris",
    hours: { mon: "12:00 PM-2:30 PM; 6:30 PM-2:00 AM", tue: "12:00 PM-2:30 PM; 6:30 PM-2:00 AM", wed: "12:00 PM-2:30 PM; 6:30 PM-2:00 AM", thu: "12:00 PM-2:30 PM; 6:30 PM-2:00 AM", fri: "12:00 PM-2:30 PM; 6:30 PM-2:00 AM", sat: "6:30 PM-2:00 AM", sun: "11:30 AM-2:30 PM; 6:30 PM-2:00 AM" },
    description: "Fitzgerald pairs modern French small plates with a terrace, late dinner service, cocktails, and Sunday brunch in an Art Deco dining room near Invalides.",
    venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["Modern French", "Small plates"],
    attributeTags: ["brunch", "late_night", "date_night", "lively_food"],
    photo: "https://cdn.prod.website-files.com/657ebf942cf08a351e21c1b1/69fa2572be134d9316ca5b21_FITZGERALD%20terrasse%20avril%202026%20%C2%A9Yann%20Deret-9859.jpg",
    imageSourceUrl: "https://www.fitz-group.fr/en/fitzgerald-paris",
  },

  "seventh-stay-la-comtesse": { officialUrl: "https://www.comtesse-hotel.com/", lodgingType: "hotel", attributeTags: ["scenic", "design", "romantic", "midrange"] },
  "seventh-stay-le-walt": { officialUrl: "https://www.lewaltparis.com/", lodgingType: "hotel", attributeTags: ["quiet", "design", "romantic", "midrange"] },
  "seventh-stay-jk-place": { officialUrl: "https://www.jkplaces.com/jkparis/", lodgingType: "hotel", attributeTags: ["luxury", "wellness", "design", "quiet"] },
  "seventh-stay-montalembert": { officialUrl: "https://www.hotelmontalembert-paris.com/", lodgingType: "hotel", attributeTags: ["luxury", "historic", "central", "design"] },
};

const parisFoodRepairSources: ListSource[] = [
  { name: "MICHELIN Guide - Paris restaurants", url: "https://guide.michelin.com/en/fr/ile-de-france/paris/restaurants" },
  { name: "Paris je t'aime - Restaurants", url: "https://parisjetaime.com/eng/restaurants-paris" },
  { name: "Le Fooding - Paris restaurants", url: "https://lefooding.com/en/search/restaurant/place/paris-8246" },
  { name: "The Infatuation - Best Paris restaurants", url: "https://www.theinfatuation.com/paris/guides/best-restaurants-paris" },
  { name: "Time Out Paris - Restaurants", url: "https://www.timeout.com/paris/en/restaurants" },
  { name: "Conde Nast Traveler - Paris restaurants", url: "https://www.cntraveler.com/gallery/best-restaurants-in-paris" },
  { name: "Gault et Millau - Paris", url: "https://fr.gaultmillau.com/en/search/restaurant/Paris" },
  { name: "Google Maps", url: "https://maps.google.com" },
  { name: "Apple Maps Paris", url: "https://maps.apple.com/?q=Paris%20restaurants" },
  { name: "OpenStreetMap Paris", url: "https://www.openstreetmap.org/relation/7444" },
];

const parisNightlifeRepairSources: ListSource[] = [
  { name: "Paris je t'aime - Bars", url: "https://parisjetaime.com/eng/article/bars-in-paris-a946" },
  { name: "Time Out Paris - Bars", url: "https://www.timeout.com/paris/en/bars-pubs" },
  { name: "Conde Nast Traveler - Paris bars", url: "https://www.cntraveler.com/gallery/best-bars-in-paris" },
  { name: "World's 50 Best Bars", url: "https://www.worlds50bestbars.com/list/1-50" },
  { name: "Terrass Hotel rooftop", url: "https://en.terrass-hotel.com/rooftop" },
  { name: "Au Lapin Agile practical information", url: "https://au-lapin-agile.com/pratique/" },
  { name: "Le Tres Particulier official", url: "https://www.hotelparticulier.com/tresparticulier?lng=fr" },
  { name: "Google Maps", url: "https://maps.google.com" },
  { name: "Apple Maps Paris bars", url: "https://maps.apple.com/?q=Paris%20bars" },
  { name: "OpenStreetMap Paris", url: "https://www.openstreetmap.org/relation/7444" },
];

const parisStayRepairSources: ListSource[] = [
  { name: "Paris je t'aime - Accommodation", url: "https://parisjetaime.com/eng/accommodation" },
  { name: "Conde Nast Traveler - Best Paris hotels", url: "https://www.cntraveler.com/gallery/best-hotels-in-paris" },
  { name: "MICHELIN Guide - Paris hotels", url: "https://guide.michelin.com/en/hotels-stays/paris" },
  { name: "Forbes Travel Guide - Paris", url: "https://www.forbestravelguide.com/destinations/paris-france" },
  { name: "The Times - Best Paris hotels", url: "https://www.thetimes.com/travel/destinations/europe-travel/france/paris/best-hotels-in-paris-65dngr3zt" },
  { name: "Hostelworld - Paris hostels", url: "https://www.hostelworld.com/hostels/Paris" },
  { name: "Booking.com - Paris", url: "https://www.booking.com/city/fr/paris.html" },
  { name: "Tripadvisor - Paris hotels", url: "https://www.tripadvisor.com/Hotels-g187147-Paris_Ile_de_France-Hotels.html" },
  { name: "Google Maps", url: "https://maps.google.com" },
  { name: "OpenStreetMap Paris", url: "https://www.openstreetmap.org/relation/7444" },
];

const parisCultureRepairSources: ListSource[] = [
  { name: "Paris Musees", url: "https://www.parismusees.paris.fr/en" },
  { name: "Musee Picasso Paris", url: "https://www.museepicassoparis.fr/en" },
  { name: "Musee Carnavalet", url: "https://www.carnavalet.paris.fr/en" },
  { name: "Maison de Victor Hugo", url: "https://www.maisonsvictorhugo.paris.fr/en" },
  { name: "Hotel de Sully", url: "https://www.hotel-de-sully.fr/en" },
  { name: "Paris je t'aime - Museums", url: "https://parisjetaime.com/eng/discovering-paris/major-parisian-museums" },
  { name: "French Ministry of Culture", url: "https://www.culture.gouv.fr/en" },
  { name: "Google Maps", url: "https://maps.google.com" },
  { name: "Apple Maps Paris museums", url: "https://maps.apple.com/?q=Paris%20museums" },
  { name: "OpenStreetMap Paris", url: "https://www.openstreetmap.org/relation/7444" },
];

const parisNatureRepairSources: ListSource[] = [
  { name: "Ville de Paris - Parks current hours", url: "https://www.paris.fr/lieux/parcs-jardins-et-bois/tous-les-horaires" },
  { name: "Ville de Paris - River banks", url: "https://www.paris.fr/lieux/parc-rives-de-seine-15619" },
  { name: "Ville de Paris - Canals", url: "https://www.paris.fr/pages/tmp-canaux-7834" },
  { name: "French Senate - Luxembourg Garden", url: "https://jardin.senat.fr/" },
  { name: "Louvre - Tuileries Garden", url: "https://www.louvre.fr/en/explore/the-gardens" },
  { name: "Domaine national du Palais-Royal", url: "https://www.domaine-palais-royal.fr/visiter/informations-pratiques" },
  { name: "Museum national d'Histoire naturelle - Jardin des Plantes", url: "https://www.mnhn.fr/en/jardin-des-plantes" },
  { name: "Wikimedia Commons - Paris parks", url: "https://commons.wikimedia.org/wiki/Category:Parks_and_gardens_in_Paris" },
  { name: "Google Maps", url: "https://maps.google.com" },
  { name: "OpenStreetMap Paris", url: "https://www.openstreetmap.org/relation/7444" },
];

function uniqueParisSources(sources: ListSource[]) {
  return [...new Map(sources.filter((source) => /^https?:\/\//i.test(source.url)).map((source) => [source.url, source])).values()];
}

function repairParisTargetGuide(list: MapList): MapList {
  if (!parisTargetGuideIds.has(list.id)) return list;

  const stops = list.stops.map((item) => {
    const repair = parisStopRepairs[item.id];
    if (!repair) return item;
    const officialUrl = repair.officialUrl;
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${item.coordinates[0]},${item.coordinates[1]}`)}`;
    const statusUrl = repair.statusUrl ?? officialUrl;
    const imageSourceUrl = repair.imageSourceUrl ?? item.imageSourceUrl ?? poiPhotoSources[item.name]?.source ?? officialUrl;
    const stayDefaults: Partial<GuideStop> = list.category === "Stay"
      ? { venueKind: "lodging", lodgingType: "hotel", bookingUrl: officialUrl, attributeTags: ["central", "design"] }
      : {};

    return {
      ...item,
      ...stayDefaults,
      ...repair,
      officialUrl,
      ...(list.category === "Stay" ? { bookingUrl: repair.bookingUrl ?? officialUrl } : {}),
      imageSourceUrl,
      sourceUrls: [...new Set([...(item.sourceUrls ?? []), officialUrl, mapUrl, statusUrl, imageSourceUrl])],
      sourceEvidence: {
        ...item.sourceEvidence,
        officialUrl,
        mapUrl,
        currentStatusUrl: statusUrl,
        imageSourceUrl,
        checkedAt: parisRepairCheckedAt,
      },
    } satisfies GuideStop;
  });

  const categorySources = list.category === "Food"
    ? parisFoodRepairSources
    : list.category === "Nightlife"
      ? parisNightlifeRepairSources
      : list.category === "Stay"
        ? parisStayRepairSources
        : list.category === "Culture"
          ? parisCultureRepairSources
          : parisNatureRepairSources;
  const stopSources = stops.flatMap((item) => [
    ...(item.officialUrl ? [{ name: `${item.name} official`, url: item.officialUrl }] : []),
    ...(item.sourceEvidence?.currentStatusUrl ? [{ name: `${item.name} current status`, url: item.sourceEvidence.currentStatusUrl }] : []),
    ...(item.imageSourceUrl ? [{ name: `${item.name} image source`, url: item.imageSourceUrl }] : []),
  ]);

  return { ...list, stops, sources: uniqueParisSources([...(list.sources ?? []), ...categorySources, ...stopSources]) };
}

export const parisNeighborhoodGuides = parisNeighborhoods.flatMap((neighborhood) =>
  neighborhoodCategories.flatMap((category) => {
    const seedValue = parisNeighborhoodGuideSeeds[neighborhood][category];
    const seeds = Array.isArray(seedValue) ? seedValue : [seedValue];

    return seeds.map((seed) => {
      const topic = seed.topic ?? neighborhoodTopics[category];
      const idTopic = seed.idTopic ?? (category === "Stay" && topic === "Hotels" ? "Hotels and Hostels" : undefined);

      return neighborhoodGuide(
        neighborhood,
        category,
        topic,
        seed.stops,
        seed.title,
        seed.description,
        seed.sources ?? neighborhoodSources[category],
        {
          idTopic,
          slugTopic: seed.slugTopic,
          seoSlug: seed.seoSlug,
          seoTitle: seed.seoTitle,
          seoDescription: seed.seoDescription,
        },
      );
    });
  }),
).map(repairParisTargetGuide) satisfies MapList[];

const parisSourceGuides = [...parisCitywideGuides, ...parisNeighborhoodGuides];

const parisCocktailBarStops = [
  createVenueVariantFromGuideStop({
    sourceGuides: parisSourceGuides,
    sourceStopId: "marais-nightlife-bar-nouveau",
    officialUrl: "https://barnouveau.fr/",
    currentStatusUrl: "https://www.theworlds50best.com/bars/the-list/bar-nouveau.html",
    mapQuery: "Bar Nouveau, 5 Rue des Haudriettes, Paris, France",
    hours: parisEveryDay("3:00 PM-1:00 AM"),
    description: "Bar Nouveau is the design-led Marais choice for producer-focused cocktails upstairs and a six-drink tasting experience downstairs on weekends. Come for technique and a distinctive room rather than a hidden-door gimmick.",
    category: "Nightlife",
    venueKind: "nightlife",
    nightlifeType: "cocktail_bar",
    attributeTags: ["premium_drinks", "design", "date_night", "reservation_recommended"],
    editorialUrls: ["https://www.theworlds50best.com/bars/the-list/bar-nouveau.html"],
  }),
  createVenueVariantFromGuideStop({
    sourceGuides: parisSourceGuides,
    sourceStopId: "marais-nightlife-cambridge",
    officialUrl: "https://www.thecambridge.paris/",
    currentStatusUrl: "https://lefooding.com/en/bars/bar-the-cambridge-public-house-paris",
    mapQuery: "The Cambridge Public House, 8 Rue de Poitou, Paris, France",
    hours: parisEveryDay("3:00 PM-1:00 AM"),
    description: "The Cambridge Public House combines a British pub's easy social rhythm with serious seasonal cocktails, Guinness, craft beer, natural wine, and useful bar food. It is the strongest group-friendly option on this list.",
    category: "Nightlife",
    venueKind: "nightlife",
    nightlifeType: "cocktail_bar",
    attributeTags: ["premium_drinks", "group_friendly", "food_available", "walk_in_friendly"],
    editorialUrls: ["https://lefooding.com/en/bars/bar-the-cambridge-public-house-paris"],
  }),
  createVenueVariantFromGuideStop({
    sourceGuides: parisSourceGuides,
    sourceStopId: "marais-nightlife-candelaria",
    officialUrl: "https://www.candelaria-paris.com/",
    currentStatusUrl: "https://parisjetaime.com/restaurant/candelaria-p612",
    mapQuery: "Candelaria, 52 Rue de Saintonge, Paris, France",
    hours: parisEveryDay("6:00 PM-2:00 AM"),
    description: "Candelaria hides an agave-focused cocktail room behind its narrow Marais taqueria. It earns its place by pairing a playful two-room setup with serious drinks and tacos, though the small bar can require a wait at peak times.",
    category: "Nightlife",
    venueKind: "nightlife",
    nightlifeType: "cocktail_bar",
    attributeTags: ["agave_spirits", "hidden_bar", "food_available", "lively_nightlife"],
    editorialUrls: ["https://parisjetaime.com/restaurant/candelaria-p612"],
  }),
  createVenueVariantFromGuideStop({
    sourceGuides: parisSourceGuides,
    sourceStopId: "saint-germain-nightlife-prescription",
    officialUrl: "https://www.prescriptioncocktailclub.com/",
    currentStatusUrl: "https://parisjetaime.com/restaurant/prescription-cocktail-club-p625",
    mapQuery: "Prescription Cocktail Club, 23 Rue Mazarine, Paris, France",
    hours: {
      default: "The official site lists a summer closure from August 9-24, 2026.",
      mon: "7:00 PM-2:00 AM",
      tue: "7:00 PM-2:00 AM",
      wed: "7:00 PM-2:00 AM",
      thu: "7:00 PM-2:00 AM",
      fri: "7:00 PM-4:00 AM",
      sat: "7:00 PM-4:00 AM",
      sun: "8:00 PM-2:00 AM",
    },
    description: "Prescription Cocktail Club is a theatrical Left Bank lounge for polished drinks, low light, and genuinely late weekend hours. Its two-floor room works best for a dressed-up final stop near Odeon rather than an early casual aperitif.",
    category: "Nightlife",
    venueKind: "nightlife",
    nightlifeType: "cocktail_bar",
    attributeTags: ["late_night", "premium_drinks", "romantic_nightlife", "design"],
    editorialUrls: ["https://parisjetaime.com/restaurant/prescription-cocktail-club-p625"],
  }),
  createVenueVariantFromGuideStop({
    sourceGuides: parisSourceGuides,
    sourceStopId: "saint-germain-nightlife-castor-club",
    officialUrl: "https://www.instagram.com/castorclub/",
    currentStatusUrl: "https://lefooding.com/bars/bar-le-castor-club-paris",
    mapQuery: "Castor Club, 14 Rue Hautefeuille, Paris, France",
    hours: {
      mon: "Closed",
      tue: "7:00 PM-2:00 AM",
      wed: "7:00 PM-2:00 AM",
      thu: "7:00 PM-4:00 AM",
      fri: "7:00 PM-4:00 AM",
      sat: "7:00 PM-4:00 AM",
      sun: "Closed",
    },
    description: "Castor Club is the intimate Left Bank pick for a wood-lined speakeasy room, custom drinks, and a livelier downstairs mood late in the week. It is compact and better for pairs or small groups than a large bar crawl.",
    category: "Nightlife",
    venueKind: "nightlife",
    nightlifeType: "cocktail_bar",
    attributeTags: ["hidden_bar", "late_night", "intimate", "premium_drinks"],
    editorialUrls: ["https://lefooding.com/bars/bar-le-castor-club-paris"],
  }),
  createVenueVariantFromGuideStop({
    sourceGuides: parisSourceGuides,
    sourceStopId: "canal-nightlife-gravity",
    officialUrl: "https://gravity-bar.eatbu.com/?lang=en",
    currentStatusUrl: "https://www.cntraveler.com/bars/paris/gravity-bar",
    mapQuery: "Gravity Bar, 44 Rue des Vinaigriers, Paris, France",
    hours: {
      mon: "Closed",
      tue: "Closed",
      wed: "5:00 PM-11:00 PM",
      thu: "5:00 PM-11:00 PM",
      fri: "5:00 PM-11:00 PM",
      sat: "12:00 PM-11:00 PM",
      sun: "12:00 PM-11:00 PM",
    },
    description: "Gravity Bar is the Canal Saint-Martin option for creative cocktails, natural wine, tapas, and a relaxed room with a distinctive wave-like ceiling. Its earlier closing time makes it a first stop, not the place to end a late crawl.",
    category: "Nightlife",
    venueKind: "nightlife",
    nightlifeType: "cocktail_bar",
    attributeTags: ["creative_cocktails", "food_available", "natural_wine", "early_evening"],
    editorialUrls: ["https://www.cntraveler.com/bars/paris/gravity-bar"],
  }),
  createVenueVariantFromGuideStop({
    sourceGuides: parisSourceGuides,
    sourceStopId: "canal-nightlife-la-meduse",
    officialUrl: "https://www.timeout.com/paris/en/bars-and-pubs/la-meduse",
    currentStatusUrl: "https://www.google.com/maps/search/?api=1&query=La%20Meduse%2C%20177%20Quai%20de%20Valmy%2C%20Paris%2C%20France",
    mapQuery: "La Meduse, 177 Quai de Valmy, Paris, France",
    hours: {
      mon: "10:00 AM-4:00 PM; 6:00 PM-1:00 AM",
      tue: "10:00 AM-4:00 PM; 6:00 PM-1:00 AM",
      wed: "10:00 AM-4:00 PM; 6:00 PM-1:00 AM",
      thu: "10:00 AM-4:00 PM; 6:00 PM-1:00 AM",
      fri: "10:00 AM-4:00 PM; 6:00 PM-2:00 AM",
      sat: "10:00 AM-4:00 PM; 6:00 PM-2:00 AM",
      sun: "10:00 AM-4:00 PM; 6:00 PM-1:00 AM",
    },
    description: "La Meduse is a lower-key Canal Saint-Martin choice for cocktails, natural wine, and small plates beside the water. Treat it as a neighborhood alternative to the destination bars, and verify same-day status before crossing the city for it.",
    category: "Nightlife",
    venueKind: "nightlife",
    nightlifeType: "cocktail_bar",
    attributeTags: ["natural_wine", "food_available", "low_key_nightlife", "waterfront"],
    editorialUrls: ["https://www.timeout.com/paris/en/bars-and-pubs/la-meduse"],
  }),
  createVenueVariantFromGuideStop({
    sourceGuides: parisSourceGuides,
    sourceStopId: "seventh-nightlife-fitzgerald",
    officialUrl: "https://www.fitz-group.fr/en/fitzgerald-paris",
    currentStatusUrl: "https://www.opentable.com/r/fitzgerald-paris",
    mapQuery: "Fitzgerald, 54 Boulevard de la Tour-Maubourg, Paris, France",
    hours: parisEveryDay("10:00 PM-2:00 AM"),
    description: "Fitzgerald is a polished 7th-arrondissement restaurant and hidden boudoir bar where dinner, terrace drinks, and a late speakeasy can happen at one address. Choose it for a dressed-up Eiffel-side night rather than a dedicated cocktail pilgrimage.",
    category: "Nightlife",
    venueKind: "nightlife",
    nightlifeType: "cocktail_bar",
    attributeTags: ["hidden_bar", "late_night", "food_available", "date_night"],
    editorialUrls: ["https://www.opentable.com/r/fitzgerald-paris"],
  }),
  createVenueVariantFromGuideStop({
    sourceGuides: parisSourceGuides,
    sourceStopId: "first-nightlife-danico",
    officialUrl: "https://www.daroco.com/en/danico/",
    currentStatusUrl: "https://www.cntraveler.com/bars/paris/danico",
    mapQuery: "Danico, 6 Rue Vivienne, Paris, France",
    hours: parisEveryDay("5:00 PM-2:00 AM"),
    description: "Danico is the destination cocktail bar hidden behind Daroco in Galerie Vivienne, with internationally influenced menus and polished service. It is the strongest Right Bank option for a special-occasion drink near Palais Royal and Bourse.",
    category: "Nightlife",
    venueKind: "nightlife",
    nightlifeType: "cocktail_bar",
    attributeTags: ["destination_bar", "premium_drinks", "design", "date_night"],
    editorialUrls: ["https://www.cntraveler.com/bars/paris/danico"],
  }),
];

const hotelGuestHours: NonNullable<GuideStop["hours"]> = {
  default: "24-hour guest operation; check-in, front-desk, late-arrival, and amenity schedules are controlled by the official property or booking page.",
};

const parisBoutiqueHotelStops = [
  createVenueVariantFromGuideStop({
    sourceGuides: parisSourceGuides,
    sourceStopId: "paris-stay-grand-mazarin",
    officialUrl: "https://www.legrandmazarin.com/",
    bookingUrl: "https://www.legrandmazarin.com/",
    mapQuery: "Le Grand Mazarin, 17 Rue de la Verrerie, Paris, France",
    hours: hotelGuestHours,
    category: "Stay",
    venueKind: "lodging",
    lodgingType: "hotel",
    attributeTags: ["boutique", "luxury", "design", "wellness", "central"],
  }),
  createVenueVariantFromGuideStop({
    sourceGuides: parisSourceGuides,
    sourceStopId: "marais-stay-sookie",
    officialUrl: "https://hotelsuzieblue.com/en",
    bookingUrl: "https://hotelsuzieblue.com/en",
    mapQuery: "Hotel Sookie, 2 bis Rue Commines, Paris, France",
    hours: hotelGuestHours,
    category: "Stay",
    venueKind: "lodging",
    lodgingType: "hotel",
    attributeTags: ["boutique", "design", "quiet", "marais", "midrange"],
  }),
  createVenueVariantFromGuideStop({
    sourceGuides: parisSourceGuides,
    sourceStopId: "marais-stay-jules-jim",
    officialUrl: "https://www.hoteljulesetjim.com/",
    bookingUrl: "https://www.hoteljulesetjim.com/",
    mapQuery: "Hotel Jules and Jim, 11 Rue des Gravilliers, Paris, France",
    hours: hotelGuestHours,
    category: "Stay",
    venueKind: "lodging",
    lodgingType: "hotel",
    attributeTags: ["boutique", "design", "courtyard", "nightlife", "central"],
  }),
  createVenueVariantFromGuideStop({
    sourceGuides: parisSourceGuides,
    sourceStopId: "latin-stay-dames-pantheon",
    officialUrl: "https://www.hotellesdamesdupantheon.com/",
    bookingUrl: "https://www.hotellesdamesdupantheon.com/",
    mapQuery: "Hotel Les Dames du Pantheon, 19 Place du Pantheon, Paris, France",
    hours: hotelGuestHours,
    category: "Stay",
    venueKind: "lodging",
    lodgingType: "hotel",
    attributeTags: ["boutique", "historic", "scenic", "left_bank", "romantic"],
  }),
  createVenueVariantFromGuideStop({
    sourceGuides: parisSourceGuides,
    sourceStopId: "montmartre-stay-arts",
    officialUrl: "https://www.arts-hotel-paris.com/",
    bookingUrl: "https://www.arts-hotel-paris.com/",
    mapQuery: "Hotel des Arts Montmartre, 5 Rue Tholoze, Paris, France",
    hours: hotelGuestHours,
    category: "Stay",
    venueKind: "lodging",
    lodgingType: "hotel",
    attributeTags: ["boutique", "montmartre", "quiet", "wellness", "midrange"],
  }),
];

export const parisSeoQueryGuides = [
  createDerivedEditorialGuide({
    id: "list-paris-citywide-cocktail-bars",
    slug: "paris-best-cocktail-bars-citywide",
    seoSlug: "best-cocktail-bars",
    seoTitle: "Best Cocktail Bars in Paris",
    seoDescription: "The best cocktail bars in Paris for modern drinks, speakeasy rooms, hotel classics, neighborhood bars, and late-night cocktails across the city.",
    title: "Modern Cocktails, Hidden Rooms, and Paris Classics",
    description: "Paris cocktails now move well beyond grand-hotel formality. This citywide shortlist compares modern technique, discreet speakeasy rooms, pub-inspired hospitality, romantic hotel bars, and neighborhood specialists, with enough range to choose by mood instead of reputation alone.",
    category: "Nightlife",
    city: "Paris",
    country: "France",
    continent: "Europe",
    stopIds: [
      "marais-nightlife-bar-nouveau",
      "marais-nightlife-cambridge",
      "marais-nightlife-candelaria",
      "saint-germain-nightlife-prescription",
      "saint-germain-nightlife-castor-club",
      "montmartre-nightlife-tres-particulier",
      "canal-nightlife-gravity",
      "canal-nightlife-la-meduse",
      "seventh-nightlife-fitzgerald",
      "first-nightlife-danico",
    ],
    sourceGuides: parisSourceGuides,
    extraStops: parisCocktailBarStops,
  }),
  createDerivedEditorialGuide({
    id: "list-paris-citywide-boutique-hotels",
    slug: "paris-best-boutique-hotels-citywide",
    seoSlug: "best-boutique-hotels",
    seoTitle: "Best Boutique Hotels in Paris",
    seoDescription: "The best boutique hotels in Paris for design, townhouse scale, romantic rooms, neighborhood character, quiet streets, and useful Metro access.",
    title: "Design Hotels, Townhouses, and Neighborhood Stays",
    description: "The strongest Paris boutique hotels feel attached to their arrondissement rather than sealed off from it. These ten stays compare intimate scale, design character, historic rooms, nightlife access, quieter streets, and the practical Metro connections that shape the rest of the trip.",
    category: "Stay",
    city: "Paris",
    country: "France",
    continent: "Europe",
    stopIds: [
      "paris-stay-grand-mazarin",
      "marais-stay-sookie",
      "marais-stay-jules-jim",
      "saint-germain-stay-relais-christine",
      "saint-germain-stay-aubusson",
      "saint-germain-stay-madison",
      "latin-stay-dames-pantheon",
      "montmartre-stay-arts",
      "canal-stay-providence",
      "seventh-stay-le-walt",
    ],
    sourceGuides: parisSourceGuides,
    extraStops: parisBoutiqueHotelStops,
  }),
];

export const parisGuides = [
  ...parisCitywideGuides,
  ...parisNeighborhoodGuides,
  ...parisSeoQueryGuides,
] satisfies MapList[];
