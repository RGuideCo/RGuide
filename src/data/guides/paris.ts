import type { GuideStop, ListCategory, ListSource, MapList } from "@/types";

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
  eiffel: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=80",
  seine: "https://images.unsplash.com/photo-1508050919630-b135583b29ab?auto=format&fit=crop&w=900&q=80",
  montmartre: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=900&q=80",
  canal: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=900&q=80",
};

type PoiPhotoSource = {
  photo: string;
  source: string;
};

const poiPhotoSources: Record<string, PoiPhotoSource> = {
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
      "https://images.prismic.io/lvmh-chevalblanc/Z9AApRsAHJWomUFu_WebRGB-ChevalBlancParis_SuiteSeine_Jardind%27Hiver_511_VincentLeroux.jpg?auto=format,compress",
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
  Fitzgerald: {
    photo: "https://cdn.prod.website-files.com/657ebf942cf08a351e21c1b1/69f9aac1ec8806fc5db98ecc_ChatGPT%20Image%205%20mai%202026%2C%2010_30_27.png",
    source: "https://www.fitzgerald.paris/",
  },
  "Generator Paris": {
    photo:
      "https://staygenerator.com/web/media/widget-spaces-rooms/paris/rooms-photos-2025/generator-paris-hostel-deluxe-king-room-1.jpg?mode=max&quality=100&v=202508261351",
    source: "https://staygenerator.com/hostels/paris",
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
      "https://afar.brightspotcdn.com/dims4/default/71a678c/2147483647/strip/true/crop/1150x575+0+72/resize/1440x720!/quality/90/?url=https%3A%2F%2Fk3-prod-afar-media.s3.us-west-2.amazonaws.com%2Fbrightspot%2F92%2F49%2F3f50821ecdb57159ea09957abf9a%2Foriginal-a7ea05ff22395157eed13e6709f449ae.jpg",
    source: "https://www.afar.com/places/hotel-des-grandes-ecoles",
  },
  "Hotel Jules and Jim": {
    photo: "https://d32rszyoapv4qs.cloudfront.net/cache/img/2590db940b8abcc39ba5ea238be9c982d5d95b65-2590db-1200-627-crop.jpg?q=1731669479",
    source: "https://www.hoteljulesetjim.com/",
  },
  "Hotel La Comtesse": {
    photo: "https://comtesse-hotel.com/_novaimg/4317200-1346800_0_303_4800_2615_2200_1200.rc.jpg",
    source: "https://www.comtesse-hotel.com/",
  },
  "Hotel Le Walt": {
    photo: "https://d13rhhrxazfw7c.cloudfront.net/cache/img/dbe9def1157870691d427b027851ce61c5154ca9-dbe9de-1200-627-crop.jpg?q=1718102689",
    source: "https://www.lewaltparis.com/",
  },
  "Hotel Les Dames du Pantheon": {
    photo: "https://moonback-hotelbeds.b-cdn.net/21/213073/213073a_hb_ro_003.jpg?aspect_ratio=1200:628&width=1200&height=628",
    source: "https://www.timetomomo.com/en/visit/paris/accommodation/les-dames-du-pantheon/",
  },
  "Hotel Lutetia": {
    photo: "https://media.ffycdn.net/eu/mandarin-oriental-hotel-group/nsZ8J29W3zvRCSVUKdTY.jpg",
    source: "https://www.mandarinoriental.com/en/paris/lutetia",
  },
  "Hotel Madame Reve": {
    photo: "https://madamereve.com/wp-content/uploads/2021/10/Balise_og_madame-reve.jpg",
    source: "https://madamereve.com/",
  },
  "Hotel Montalembert": {
    photo: "https://d1uj7wsed4nlat.cloudfront.net/cache/img/ff862722b3c71ea1db76ea2c288926f09b962f8e-ff8627-1200-627-crop.jpg?q=1724323756",
    source: "https://www.hotelmontalembert-paris.com/",
  },
  "Hotel Monte Cristo": {
    photo: "https://www.hotelmontecristoparis.com/cache/img/6066525bbb917692f4a819383d3dca1b68e553e6-606652-1200-627-crop.jpg?q=1714492043&q=1777540737",
    source: "https://www.hotelmontecristoparis.com/",
  },
  "Hotel Providence": {
    photo: "https://hotelprovidenceparis.com/wp-content/uploads/2015/09/1w2a2225-5.jpg",
    source: "https://hotelprovidenceparis.com/",
  },
  "Hotel Regina Louvre": {
    photo: "https://hapi.mmcreation.com/hapidam/4d367904-2f7f-496a-9dcd-f7ef8e2734d0/2020_PH_V2.png.png",
    source: "https://www.regina-hotel.com/",
  },
  "Hotel Rochechouart": {
    photo: "https://cdn.prod.website-files.com/6543b2c91ab677016dcd0684/67b4ac82da9fb02ce391077d_opengraph%20rochechouart.png",
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
  "J.K. Place Paris": {
    photo:
      "https://www.jkplaces.com/jkparis/wp-content/themes/startup_pro/inc/php-global/s-image/index.php?img=/var/www/vhosts/jkplaces.com/httpdocs/jkparis/wp-content/uploads//2025/04/jkparis_5stars-hotel.jpg&mod=3&w=1456",
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
    photo: "https://cdn.prod.website-files.com/688e265d139102e1191b2a7e/68de7e48c27d5de0af98986d_ILO%20OPEN%20GRAPH.png",
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
    photo: "https://www.legrandmazarin.com/wp-content/uploads/2024/07/hotel-le-grand-mazarin-piscine-hotel.jpg",
    source: "https://www.legrandmazarin.com/",
  },
  "Le Meurice": {
    photo: "https://upload.wikimedia.org/wikipedia/commons/b/ba/H%C3%B4tel_Le_Meurice.jpg",
    source: "https://commons.wikimedia.org/wiki/File:H%C3%B4tel_Le_Meurice.jpg",
  },
  "Le Nemours": {
    photo: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/26/c1/20/74/terrasse.jpg?w=900&h=-1&s=1",
    source: "https://www.tripadvisor.com/",
  },
  "Le Piano Vache": {
    photo:
      "https://scontent-akl1-1.xx.fbcdn.net/v/t39.30808-6/487767264_1202613125203676_3118745092519676828_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=2a1932&_nc_ohc=ooPpM4hnkBoQ7kNvwGQAc4K&_nc_oc=Ado1Raxbg9UnWWnzF2pYADk7Qx9-knWtdDFkVTYETA5zrnGpMS5wwrCqzRTOFIa_QPSsPkiUESfGFDLsYVMsJ_uL&_nc_zt=23&_nc_ht=scontent-akl1-1.xx&_nc_gid=BlViuotPZMm-qvDqHN3mFg&_nc_ss=7b289&oh=00_Af4IOgg6il_lP2LlHSYW5E7ZRSzT9L22k2zAzurDyfvnHg&oe=6A06E690",
    source: "https://www.facebook.com/lepianovache/",
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
    photo: "https://www.villagehostel.fr/wp-content/uploads/2017/10/DBL-Large-1024x683.jpg",
    source: "https://www.villagehostel.fr/",
  },
  "Les Ombres": {
    photo: "https://www.lesombres-restaurant.com/wp-content/uploads/2022/11/Les_Ombres_20-10-20-@-Julien-Mouffron-Gardner_7616-1-1200x730.jpg",
    source: "https://www.lesombres-restaurant.com/",
  },
  "Madison Hotel": {
    photo: "https://cdn.prod.website-files.com/698a0b7e7e2005d6daeaa106/69a9877d0825f4a1ef17b909_1b7a495f330d533899299a529fcae740_hotel-madison.avif",
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
  "MIJE Marais": {
    photo: "https://www.mije.com/wp-content/uploads/2025/10/MIJE_Home-Page-header_Desktop_Imges-header_1920x526px_2025_1028.jpg",
    source: "https://www.mije.com/",
  },
  "Mom'Art Hotel": {
    photo: "https://www.hotelmomart.com/wp-content/uploads/sites/544/2023/05/FR-Paris-Hotel-Mom-Art-Patio-3728-1-2200x1200.jpg",
    source: "https://www.hotelmomart.com/en/",
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
    photo: "https://images.prismic.io/pointf/adfVVJ1ZCF7ETC06_PInata.jpg?auto=format&q=25&fm=webp&width=640",
    source: "https://pointephemere.org/",
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
    photo: "https://www.relais-christine.com/_novaimg/4915897-1568694_0_0_4800_3023_2000_1260-1600.webp",
    source: "https://www.relais-christine.com/",
  },
  "Rosa Bonheur sur Seine": {
    photo: "https://rosabonheur.fr/wp-content/uploads/2024/06/Seine-RosaB-0822-LevietPhoto-8955-uai-2133x1600.jpg",
    source: "https://www.rosabonheur.fr/lieu/rosa-sur-seine/",
  },
  Sanukiya: {
    photo:
      "https://scontent-akl1-1.xx.fbcdn.net/v/t39.30808-6/578416728_1269891911607016_4411219456707818124_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=2a1932&_nc_ohc=PjInFABFQKoQ7kNvwGT9MHm&_nc_oc=AdqDfLrX0u-HdWSLz0RTjbUR8nTbugfLx1AOCyv22Jx5bzHasulwvW0F4PpyMprJzYiPi_bMq61llE0tWcCbSVOb&_nc_zt=23&_nc_ht=scontent-akl1-1.xx&_nc_gid=YFFYhhnvEeYD2Bz_2mQgZw&_nc_ss=7b289&oh=00_Af49brobZ5nPCg8lL7rNx1UIC8KnhgNk3sHe28tITdo21A&oe=6A058A68",
    source: "https://www.facebook.com/sanukiyaparis/",
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
  "St Christopher's Inn Canal": {
    photo: "https://images.ctfassets.net/wqkd101r9z5s/7JuethZ3p5V7zQHyubsMIM/d25dad4126547d595f20cea943636537/iStock-1133449890_copy.jpg?w=720&q=85",
    source: "https://www.st-christophers.co.uk/paris/canal-hostel/",
  },
  "Teddy's Bar": {
    photo: "https://storage.googleapis.com/schlouk-map/cache/gallery/uploads/images/places/teddys-bar-620cf617b686b5.56325506.jpeg",
    source: "https://www.schlouk-map.com/en/places/teddys-bar",
  },
  "Terrass Hotel": {
    photo: "https://cdn.prod.website-files.com/62693a7ecfa12581d78e342f/62d81e5754d58251dcd6e467_Opengraph%20Terrass%20Hotel%20Montmartre%20Paris.png",
    source: "https://www.terrass-hotel.com/",
  },
  "Terrass Hotel Rooftop": {
    photo: "https://cdn.prod.website-files.com/67c6b692ecd52285b2aee65e/6924760508778a8ff8ffe1d7_5.png",
    source: "https://www.terrass-hotel.com/",
  },
  "The Cambridge Public House": {
    photo:
      "https://www.thecambridge.paris/i/the-cambridge-650415/3/6/0/6/8/5/1/5/2/0/2/2/3/1715590703_242/01c090c020bf664e4a7078f36173b693.website.jpg",
    source: "https://www.thecambridge.paris/en/",
  },
  "The Hoxton Paris": {
    photo: "https://thehoxton.com/wp-content/uploads/sites/5/2020/05/Paris_Hero.jpg",
    source: "https://thehoxton.com/paris/",
  },
  "The People Paris Belleville": {
    photo: "https://www.thepeoplehostel.com/wp-content/uploads/2025/06/hostel-belleville-LesPiaules-shared_room_new-768x402.jpg",
    source: "https://www.thepeoplehostel.com/en/destinations/paris-belleville/",
  },
  Verjus: {
    photo:
      "https://images.squarespace-cdn.com/content/v1/59d4c7672278e78c2beb5c7b/1768840776711-IQCEW7IJOROP4YTNPQOL/05-LClavisyFarmPlate.jpg?format=2500w",
    source: "https://www.verjusparis.com/",
  },
  "Young and Happy Latin Quarter": {
    photo: "https://www.youngandhappy.fr/wp-content/uploads/2024/01/dortoir-sdb-6-1024x682.jpg",
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
  { name: "Paris je t'aime - Place des Vosges", url: "https://parisjetaime.com/eng/transport/place-des-vosges-p1907" },
  { name: "Sacre-Coeur Montmartre official", url: "https://www.sacre-coeur-montmartre.com/" },
  { name: "Paris Opera - Visit the Palais Garnier", url: "https://www.operadeparis.fr/en/visits/visit-and-explore/visit-the-palais-garnier" },
  { name: "Paris Catacombs official", url: "https://www.catacombes.paris.fr/en" },
  { name: "Musee Rodin - Plan your visit", url: "https://www.musee-rodin.fr/en/plan-your-visit/plan-your-visit-musee-rodin" },
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

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function defaultHours(category: EditorialCategory): GuideStop["hours"] {
  if (category === "Stay") {
    return { default: "Reception and check-in details vary; confirm directly before booking." };
  }
  if (category === "Food") {
    return { default: "Hours and booking rules vary; confirm current service before going." };
  }
  if (category === "Nightlife") {
    return { default: "Evening hours and event schedules vary; confirm before going." };
  }
  return { default: "Hours, tickets, and access rules vary; confirm current details before visiting." };
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

function stop(seed: StopSeed, category: EditorialCategory): GuideStop {
  return {
    ...seed,
    photo: seed.photo ?? poiPhotoFor(seed.name) ?? defaultPhoto(category),
    hours: seed.hours ?? defaultHours(category),
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
) {
  const neighborhoodSlug = slugify(neighborhood);
  const topicSlug = slugify(topic);
  const seoSlug =
    category === "Food"
      ? "best-restaurants"
      : category === "Nightlife"
        ? "best-bars"
        : category === "Stay"
          ? "best-hotels"
          : category === "Culture"
            ? "best-culture"
            : category === "Nature"
              ? "best-parks"
              : "best-things-to-do";

  return guide({
    id: `list-paris-${neighborhoodSlug}-${topicSlug}`,
    slug: `paris-${neighborhoodSlug}-${topicSlug}`,
    seoSlug,
    seoTitle: `Best ${topic} in ${neighborhood}, Paris`,
    seoDescription: `Best ${topic.toLowerCase()} in ${neighborhood}, Paris, selected for source support, neighborhood fit, and useful saved-map routing.`,
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
      "Bistrot des Tournelles anchors the Marais with a classic Paris bistro room, steak frites, terrines, and the kind of reservation that still fits a neighborhood walk. Save it for a proper dinner near Place des Vosges when the day needs old-school comfort and a room with momentum.",
    price: "$$",
    priceSource: "The Infatuation / Google Maps",
  },
  {
    id: "paris-food-brasserie-lipp",
    name: "Brasserie Lipp",
    coordinates: [48.8535, 2.3332],
    description:
      "Brasserie Lipp gives Saint-Germain a literary brasserie stop with real use in a food guide: polished room, Alsatian-leaning classics, and a see-and-be-seen lunch or dinner that belongs to the boulevard. Book it when history and room tone matter as much as the plate.",
    price: "$$$",
    priceSource: "The Infatuation / Google Maps",
  },
  {
    id: "paris-food-le-baratin",
    name: "Le Baratin",
    coordinates: [48.8731, 2.3857],
    description:
      "Le Baratin is the Belleville bistro the MICHELIN Guide still flags for Raquel Carena's personal blackboard cooking, restrained prices, and appealing wines. It belongs because it shows a less-polished, deeply personal side of Paris dining: seasonal plates, natural wine, and a dinner worth planning across town.",
    price: "$$",
    priceSource: "Eater / Time Out / MICHELIN Guide",
  },
  {
    id: "paris-food-septime",
    name: "Septime",
    coordinates: [48.8535, 2.3829],
    description:
      "Septime gives the citywide guide a one-star fine-dining benchmark in the 11th, with Bertrand Grebaut's seasonal cooking and a calm industrial room near Charonne. Treat it as a priority reservation for travelers who want contemporary Paris at its most exacting.",
    price: "$$$",
    priceSource: "MICHELIN Guide / Eater",
  },
  {
    id: "paris-food-clamato",
    name: "Clamato",
    coordinates: [48.8536, 2.3828],
    description:
      "Clamato is Septime's seafood-focused sibling, the MICHELIN-noted room for oysters, crudo, shellfish, vegetables, and share plates without a formal tasting menu. Its first-come rhythm makes timing part of the plan, but the payoff is a lighter, sharper Paris meal.",
    price: "$$",
    priceSource: "MICHELIN Guide / Paris by Mouth",
  },
  {
    id: "paris-food-du-pain-idees",
    name: "Du Pain et des Idees",
    coordinates: [48.8719, 2.3622],
    description:
      "Du Pain et des Idees is the Canal Saint-Martin boulangerie stop for pain des amis, escargot pastries, and a morning that starts with craft rather than convenience. It belongs because the bread and viennoiserie can anchor a whole east-side route.",
    price: "$",
    priceSource: "Eater / Google Maps",
  },
  {
    id: "paris-food-david-toutain",
    name: "David Toutain",
    coordinates: [48.8617, 2.3048],
    description:
      "David Toutain gives Paris a serious fine-dining anchor near Invalides, with highly composed seasonal menus and a nature-driven point of view. Use it for one high-budget meal where the reservation, pacing, and room are the plan rather than a pause between sights.",
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
      "Du Pain et des Idees is the citywide boulangerie anchor for pain des amis, buttery escargot pastries, and a Canal Saint-Martin morning with purpose. Start here when the day should feel Parisian before the first museum or long walk.",
    price: "$",
    priceSource: "Eater / official bakery site / Google Maps",
  },
  {
    id: "paris-food-boulangerie-poilane",
    name: "Poilane",
    coordinates: [48.8499, 2.3261],
    description:
      "Poilane gives the Left Bank its legendary sourdough, apple tarts, and serious bread counter on Rue du Cherche-Midi. It is a morning stop for travelers who want a baguette or loaf with pedigree before Saint-Germain or Luxembourg.",
    price: "$",
    priceSource: "Official bakery site / Google Maps",
  },
  {
    id: "paris-food-boulangerie-maison-isabelle",
    name: "La Maison d'Isabelle",
    coordinates: [48.8498, 2.3486],
    description:
      "La Maison d'Isabelle is the Latin Quarter croissant stop for a quick, high-quality breakfast before Pantheon, Cluny, or Mouffetard. It keeps the morning simple: pastry first, then streets and museums.",
    price: "$",
    priceSource: "Google Maps / Paris bakery guides",
  },
  {
    id: "paris-food-boulangerie-holybelly",
    name: "Holybelly 5",
    coordinates: [48.8723, 2.3606],
    description:
      "Holybelly 5 adds the coffee-and-seated-breakfast version of a Paris morning near the canal. Use it when the group wants pancakes, eggs, and proper coffee before shifting into locks, shops, and east-side wandering.",
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
      "Brasserie Lipp gives the brasserie guide its polished Saint-Germain institution: Alsatian-leaning classics, literary boulevard energy, and a room that still feels like part of the city's dining memory.",
    price: "$$$",
    priceSource: "The Infatuation / Google Maps",
  },
  {
    id: "paris-food-brasserie-bouillon-racine",
    name: "Bouillon Racine",
    coordinates: [48.849, 2.341],
    description:
      "Bouillon Racine brings Art Nouveau detail and classic comfort to the Latin Quarter, making it a good brasserie-style stop near Odeon, Cluny, and the Sorbonne. It is strongest for groups that want setting without a luxury price point.",
    price: "$$",
    priceSource: "Official restaurant site / Google Maps",
  },
  {
    id: "paris-food-brasserie-fontaine-mars",
    name: "La Fontaine de Mars",
    coordinates: [48.8587, 2.3044],
    description:
      "La Fontaine de Mars is the Rue Saint-Dominique classic for duck, cassoulet, steak, and a room that still works as neighborhood dining despite its Eiffel-side address. Use it when monuments need a proper traditional table nearby.",
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
      "Angelina gives the patisserie guide the grand tea-room ritual: hot chocolate, Mont-Blanc, pastries, and a Rue de Rivoli room that pairs naturally with the Louvre and Tuileries.",
    price: "$$",
    priceSource: "Official tea-room site / Google Maps",
  },
  {
    id: "paris-food-patisserie-pierre-herme",
    name: "Pierre Herme Bonaparte",
    coordinates: [48.8516, 2.3333],
    description:
      "Pierre Herme Bonaparte is the Left Bank stop for polished macarons and high-end sweet creations. Use it when Saint-Germain needs a precise dessert destination rather than a casual bakery counter.",
    price: "$$",
    priceSource: "Official patisserie site / Google Maps",
  },
  {
    id: "paris-food-patisserie-laduree",
    name: "Laduree Champs-Elysees",
    coordinates: [48.8704, 2.3069],
    description:
      "Laduree Champs-Elysees brings the famous macaron house into a classic Paris itinerary, especially when the route already runs through the avenue or Arc de Triomphe side. It is the polished, gift-box version of the sweet stop.",
    price: "$$",
    priceSource: "Official patisserie site / Google Maps",
  },
  {
    id: "paris-food-patisserie-du-pain-idees",
    name: "Du Pain et des Idees",
    coordinates: [48.8719, 2.3622],
    description:
      "Du Pain et des Idees belongs here for viennoiserie as much as bread, especially the escargot pastries that can turn a canal walk into a pastry route. It gives the guide a craft-bakery counterpoint to the grand maisons.",
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
      "Bar Nouveau is the stylish Marais pick for Art Nouveau design, producer-led cocktails upstairs, and a six-cocktail set-menu experience downstairs on weekends. Use it when the night wants a polished, main-character start before dinner or galleries.",
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
      "Danico is the polished Galerie Vivienne cocktail room, backed by World 50 Best and useful when the night needs a destination bar near Palais Royal, Bourse, or the covered passages. It is more special-occasion cocktail stop than loose neighborhood bar.",
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
      "Le Duc des Lombards is the central live-music anchor, built for a ticketed set rather than a loose bar crawl. Its Chatelet position makes it easy after dinner, but the best version of the night starts with the calendar.",
    price: "$$",
    priceSource: "Paris venue listings / Google Maps",
  },
  {
    id: "paris-nightlife-la-gare-le-gore",
    name: "La Gare / Le Gore",
    coordinates: [48.8927, 2.3839],
    description:
      "La Gare / Le Gore is the northeast night out: live music in a former station, garden-and-terrace breathing room, then a basement club that can run into the early hours. Go when the plan can commit to La Villette and wants grit, dancing, and a less polished edge.",
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
      "Le Duc des Lombards is the easy central live-room choice: book a set, arrive on time, and let the night be about musicianship rather than another round of bar hopping.",
    price: "$$",
    priceSource: "Official venue site / Google Maps",
  },
  {
    id: "paris-nightlife-live-caveau-huchette",
    name: "Le Caveau de la Huchette",
    coordinates: [48.8525, 2.3468],
    description:
      "Le Caveau de la Huchette gives Paris a dancing-cellar night in the Latin Quarter, with live music, old-stone atmosphere, and a clear reason to stay after dinner.",
    price: "$$",
    priceSource: "Official venue site / Google Maps",
  },
  {
    id: "paris-nightlife-live-lapin-agile",
    name: "Au Lapin Agile",
    coordinates: [48.8888, 2.3401],
    description:
      "Au Lapin Agile is the Montmartre cabaret stop for song, performance, and artist-history atmosphere. Treat it as a planned show night, especially when the group wants nightlife without centering drinks.",
    price: "$$",
    priceSource: "Official venue site / Google Maps",
  },
  {
    id: "paris-nightlife-live-la-gare-gore",
    name: "La Gare / Le Gore",
    coordinates: [48.8927, 2.3839],
    description:
      "La Gare / Le Gore stretches the night from live sets in a former station into a basement dance floor. It is the guide's scrappier, later counterweight to seated central venues.",
    price: "$",
    priceSource: "Visit Paris Region / Google Maps",
  },
  {
    id: "paris-nightlife-live-point-ephemere",
    name: "Point Ephemere",
    coordinates: [48.8819, 2.3686],
    description:
      "Point Ephemere brings concerts, exhibitions, terrace energy, and canal-side programming into one address. Use it when the night should be built around what's on, not just where to drink.",
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
      "Le Piano Vache is the Latin Quarter dive-bar institution: posters, student energy, cheap-drink usefulness, and a night that does not ask anyone to dress up.",
    price: "$",
    priceSource: "Official venue site / Google Maps",
  },
  {
    id: "paris-nightlife-low-key-requin",
    name: "Le Requin Chagrin",
    coordinates: [48.8465, 2.3478],
    description:
      "Le Requin Chagrin keeps the Pantheon side casual with pub energy, group tables, and an easy second-stop role after Mouffetard or Latin Quarter dinner.",
    price: "$",
    priceSource: "Google Maps / local nightlife guides",
  },
  {
    id: "paris-nightlife-low-key-la-perle",
    name: "La Perle",
    coordinates: [48.8608, 2.3614],
    description:
      "La Perle is the Marais sidewalk-crowd standby, useful when the night wants people-watching, spillover energy, and minimal planning between galleries and late wandering.",
    price: "$$",
    priceSource: "Time Out / Google Maps",
  },
  {
    id: "paris-nightlife-low-key-teddys",
    name: "Teddy's Bar",
    coordinates: [48.8473, 2.3443],
    description:
      "Teddy's Bar gives Rue Mouffetard a compact, low-pressure stop for beer, cocktails, and a casual group reset before the night decides where it is going.",
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
      "The Louvre is the cultural heavyweight, but it works only when treated as a route rather than a dare. Book a time slot, choose a wing or theme, and pair the museum with Tuileries, Palais Royal, or a nearby meal so the day has shape beyond crowd management.",
    photo: photos.culture,
  },
  {
    id: "paris-culture-orsay",
    name: "Musee d'Orsay",
    coordinates: [48.8599, 2.3266],
    description:
      "Musee d'Orsay gives Paris a more manageable blockbuster than the Louvre, with Impressionism, sculpture, and the converted railway-station setting all in one Left Bank stop. It pairs naturally with Saint-Germain, the Seine, Rodin, or a 7th-arrondissement day.",
    photo: photos.seine,
  },
  {
    id: "paris-culture-sainte-chapelle",
    name: "Sainte-Chapelle",
    coordinates: [48.8554, 2.345],
    description:
      "Sainte-Chapelle is the short, high-impact Gothic stop for stained glass and Ile de la Cite context. It is best saved with timed entry and a nearby walk to Notre-Dame, the Conciergerie, or the river instead of being squeezed between unrelated cross-town stops.",
    photo: photos.culture,
  },
  {
    id: "paris-culture-picasso",
    name: "Musee Picasso Paris",
    coordinates: [48.8599, 2.3623],
    description:
      "Musee Picasso Paris gives the citywide culture list a Marais museum that is focused enough to pair with food and gallery detours. The Hotel Sale setting, collection depth, and easy Place des Vosges approach keep the stop substantial without becoming an all-day block.",
    photo: photos.culture,
  },
  {
    id: "paris-culture-palais-garnier",
    name: "Palais Garnier",
    coordinates: [48.8719, 2.3316],
    description:
      "Palais Garnier adds architecture and performance history to a Right Bank plan. Self-guided visits are strongest when the auditorium access is treated as a bonus, not a guarantee, and the stop is paired with passages, department stores, or a cocktail nearby.",
    photo: photos.culture,
  },
  {
    id: "paris-culture-rodin",
    name: "Musee Rodin",
    coordinates: [48.8554, 2.3158],
    description:
      "Musee Rodin is the 7th-arrondissement cultural pressure valve: sculpture, mansion rooms, and garden time in a calmer frame than the biggest museums. It works especially well between Invalides, Orsay, and an Eiffel-side walk.",
    photo: photos.nature,
  },
  {
    id: "paris-culture-catacombs",
    name: "Paris Catacombs",
    coordinates: [48.8338, 2.3324],
    description:
      "The Catacombs give Paris a darker, ticketed counterweight to palace and museum days. Because access is capacity-controlled and the visit is physically specific, build it as a deliberate south-side block rather than a spontaneous add-on.",
    photo: photos.culture,
  },
];

const citywideStay: StopSeed[] = [
  {
    id: "paris-stay-cheval-blanc",
    name: "Cheval Blanc Paris",
    coordinates: [48.8588, 2.342],
    description:
      "Cheval Blanc Paris is the Seine-facing luxury base for travelers who want palace-level service, Samaritaine access, and a central Right Bank position. It is best when the hotel is part of the trip, not just a bed between museum days.",
    price: "$$$",
    priceSource: "Conde Nast Traveler / Google Travel",
  },
  {
    id: "paris-stay-lutetia",
    name: "Hotel Lutetia",
    coordinates: [48.8517, 2.327],
    description:
      "Hotel Lutetia gives the citywide stay guide its grand Left Bank reference point, useful for Orsay, Luxembourg, Saint-Germain cafes, and polished cross-river days. Choose it when heritage and walkable calm matter more than immediate Marais nightlife.",
    price: "$$$",
    priceSource: "Conde Nast Traveler / Google Travel",
  },
  {
    id: "paris-stay-grand-mazarin",
    name: "Le Grand Mazarin",
    coordinates: [48.858, 2.3546],
    description:
      "Le Grand Mazarin is the citywide boutique-stay argument for sleeping in Le Marais, close to Hotel de Ville, galleries, restaurants, and late bars. It suits travelers who want old-center access with a design-forward mood rather than palace formality.",
    price: "$$$",
    priceSource: "Conde Nast Traveler / Vogue",
  },
  {
    id: "paris-stay-hoxton",
    name: "The Hoxton Paris",
    coordinates: [48.87, 2.3475],
    description:
      "The Hoxton Paris is the Grands Boulevards base for travelers who want a lively lobby, covered-passage walks, and quick movement toward the 2nd, 9th, and Marais. It is less intimate than a small boutique hotel, but very practical.",
    price: "$$",
    priceSource: "Conde Nast Traveler / Google Travel",
  },
  {
    id: "paris-stay-rochechouart",
    name: "Hotel Rochechouart",
    coordinates: [48.8822, 2.3425],
    description:
      "Hotel Rochechouart is the South Pigalle/Montmartre-edge choice when nightlife, rooftop views, and north-side browsing matter. Use it when you want easy evenings near Pigalle and Abbesses without sleeping on the busiest hilltop lanes.",
    price: "$$",
    priceSource: "Conde Nast Traveler / Google Travel",
  },
  {
    id: "paris-stay-generator",
    name: "Generator Paris",
    coordinates: [48.8795, 2.3696],
    description:
      "Generator Paris is the design-hostel option near Canal Saint-Martin, with dorms, private rooms, and a social setup that makes sense for budget travelers. It fits travelers who value common spaces and canal access over old-city charm.",
    price: "$",
    priceSource: "Hostelworld / Google Maps",
  },
  {
    id: "paris-stay-people-belleville",
    name: "The People Paris Belleville",
    coordinates: [48.8709, 2.3773],
    description:
      "The People Paris Belleville is the east-side hostel pick for travelers who want rooftop social energy, Belleville food, and fast metro access to the center. It is strongest for solo travelers and budget groups who actually plan to use the neighborhood.",
    price: "$",
    priceSource: "Hostelworld / Tripadvisor",
  },
];

const citywideNature: StopSeed[] = [
  {
    id: "paris-nature-luxembourg",
    name: "Jardin du Luxembourg",
    coordinates: [48.8462, 2.3372],
    description:
      "Jardin du Luxembourg gives the citywide nature guide its most useful Left Bank pause, linking Saint-Germain, the Latin Quarter, and museum days. Chairs, lawns, fountains, and palace views make it a practical reset rather than a nature detour.",
    photo: photos.nature,
  },
  {
    id: "paris-nature-tuileries-seine",
    name: "Tuileries Garden and Seine Walk",
    coordinates: [48.8635, 2.327],
    description:
      "Tuileries and the Seine turn the Louvre-Orsay corridor into a walkable day instead of two disconnected museum bookings. Use the garden and river edges for pacing, light, and a low-effort reset between major indoor stops.",
    photo: photos.seine,
  },
  {
    id: "paris-nature-buttes-chaumont",
    name: "Parc des Buttes-Chaumont",
    coordinates: [48.8809, 2.382],
    description:
      "Buttes-Chaumont is the northeast hill-park choice, with dramatic slopes and local picnic energy even while sections undergo renovation. It belongs in the guide because it makes Belleville and La Villette days feel greener and less central.",
    photo: photos.nature,
  },
  {
    id: "paris-nature-pere-lachaise",
    name: "Cimetiere du Pere-Lachaise",
    coordinates: [48.8614, 2.3934],
    description:
      "Pere-Lachaise is both cemetery and open-air museum, best approached as a slow leafy walk with a map rather than a quick celebrity-grave hunt. It pairs naturally with Belleville, Menilmontant, or the 11th after lunch.",
    photo: photos.nature,
  },
  {
    id: "paris-nature-coulee-verte",
    name: "Coulee verte Rene-Dumont",
    coordinates: [48.8467, 2.3754],
    description:
      "Coulee verte Rene-Dumont gives Bastille and the 12th an elevated linear walk built from old rail infrastructure. It is the right choice when the day needs movement, greenery, and a quieter east-side route toward Reuilly or Vincennes.",
    photo: photos.nature,
  },
  {
    id: "paris-nature-parc-belleville",
    name: "Parc de Belleville",
    coordinates: [48.8718, 2.3843],
    description:
      "Parc de Belleville gives the east a quick view payoff without the Sacre-Coeur crowd. Save it for a food-led Belleville plan, a sunset pause, or a simple way to understand the neighborhood's slope and skyline.",
    photo: photos.nature,
  },
];

const citywideActivities: StopSeed[] = [
  {
    id: "paris-activity-louvre-tuileries",
    name: "Louvre, Tuileries, and Palais Royal",
    coordinates: [48.8612, 2.3376],
    description:
      "Start with a bounded Louvre plan, then use Tuileries and Palais Royal as the breathing room around it. This stop keeps the first day central, scenic, and realistic without pretending the Louvre can be fully solved in one visit.",
    photo: photos.culture,
  },
  {
    id: "paris-activity-marais-vosges",
    name: "Le Marais and Place des Vosges",
    coordinates: [48.8567, 2.365],
    description:
      "Use Le Marais as the saved-map wandering day: Picasso or Carnavalet, Place des Vosges, Rue des Rosiers, boutiques, and a bistro or cocktail room. The point is density, not distance.",
    photo: photos.culture,
  },
  {
    id: "paris-activity-left-bank",
    name: "Saint-Germain and the Latin Quarter",
    coordinates: [48.8501, 2.3385],
    description:
      "Pair Saint-Germain polish with Latin Quarter history so the Left Bank becomes more than cafe lore: a brasserie, a bookshop, the Pantheon or Cluny, and Luxembourg Garden as the route's soft landing.",
    photo: photos.culture,
  },
  {
    id: "paris-activity-orsay-rodin-eiffel",
    name: "Orsay, Rodin, and the Eiffel Side",
    coordinates: [48.8584, 2.3126],
    description:
      "This 7th-arrondissement route gives the Eiffel Tower context by surrounding it with Orsay, Rodin, Invalides, river walks, and one serious meal. It is best as a slow westward day, not a tower-only errand.",
    photo: photos.eiffel,
  },
  {
    id: "paris-activity-canal-belleville",
    name: "Canal Saint-Martin to Belleville",
    coordinates: [48.8725, 2.3736],
    description:
      "Build the east-side day from bakery and canal paths into Belleville food, Parc de Belleville, or a late jazz/electronic room. It keeps Paris current, local-feeling, and less museum-heavy.",
    photo: photos.canal,
  },
  {
    id: "paris-activity-montmartre-pigalle",
    name: "Montmartre into South Pigalle",
    coordinates: [48.884, 2.338],
    description:
      "Make Montmartre a morning or golden-hour walk, then drop into South Pigalle for dinner, cocktails, or a show. This pacing keeps the hill from becoming a crowded postcard and gives the night a natural finish.",
    photo: photos.montmartre,
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
      "Paris food needs more than a trophy reservation: classic bistros, natural-wine rooms, bakeries, falafel counters, seafood waits, and modern tasting menus all solve different parts of the route. Use this to anchor meals by arrondissement instead of chasing one generic best-of list.",
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
      "Paris is a cuisine capital before lunch starts: boulangeries, croissants, baguettes, coffee counters, and seated breakfasts can shape a whole morning. Use this guide when Food is clicked first and the day needs bread, pastry, and coffee without choosing a neighborhood yet.",
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
      "Brasseries and bouillons are the Paris meal format for steak frites, French onion soup, duck, cassoulet, and rooms with real civic memory. This guide keeps the traditional dining experience central, useful, and easy to fold into sightseeing days.",
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
      "Patisseries give Paris its sweeter form of ceremony: macarons, tea rooms, viennoiserie, boxed gifts, and polished counters that can become a whole route. Use this guide for dessert-led planning across the city instead of treating sweets as an afterthought.",
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
      "Paris nights work best when the format is clear: natural wine before dinner, design-forward bars in the Marais or Bourse, ticketed live rooms, canal terraces, or later Pigalle energy. This guide keeps after-dark planning tied to geography instead of sending every night across town.",
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
      "Not every Paris night needs to be a bar crawl. This guide is for ticketed sets, cabaret rooms, dancing cellars, canal programming, and live venues where the plan is the show, the room, or the dance floor first.",
    url: "https://www.google.com/maps/search/live+music+shows+nightlife+paris",
    category: "Nightlife",
    stops: citywideLiveNightlife,
    sources: parisLiveNightlifeSources,
  }),
  guide({
    id: "list-paris-citywide-low-key-late-night-bars",
    slug: "paris-low-key-late-night-dive-bars",
    seoSlug: "low-key-bars",
    seoTitle: "Best Low-Key Late Night Bars in Paris",
    seoDescription:
      "Best low-key late night bars in Paris for dive bars, student pubs, Montmartre happy hour, Marais sidewalk crowds, and casual Latin Quarter drinks.",
    title: "Low-Key Late Nights and Dive Bars",
    description:
      "For nights that should feel loose, cheap-ish, and social, this guide skips the bougie reservation mood and leans into dive bars, low-key terraces, student pubs, happy hours, and neighborhood rooms with a bit of personality.",
    url: "https://www.google.com/maps/search/low+key+dive+bars+paris",
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
      "Best culture in Paris for major museums, Gothic interiors, Marais houses, opera architecture, sculpture gardens, and ticketed historic sites.",
    title: "Museum Weight and Smaller Rooms",
    description:
      "Paris culture is strongest when the heavyweight museums have room around them: Louvre or Orsay as anchors, then chapels, house museums, opera architecture, sculpture gardens, and darker underground history. Use this to build days with one big ticket and one smaller counterweight.",
    url: "https://www.google.com/maps/search/best+culture+paris",
    category: "Culture",
    stops: citywideCulture,
    sources: parisCultureSources,
  }),
  guide({
    id: "list-paris-citywide-stays",
    slug: "paris-best-hotels-and-hostels",
    seoSlug: "best-hotels",
    seoTitle: "Best Hotels and Hostels in Paris",
    seoDescription:
      "Best places to stay in Paris, comparing palace hotels, Left Bank classics, Marais boutiques, Pigalle stays, canal hostels, and Belleville budget bases.",
    title: "Sleep by Arrondissement Fit",
    description:
      "Paris stay planning is an arrondissement decision before it is a brand decision: palace Seine views, Left Bank calm, Marais nightlife, Grands Boulevards convenience, Pigalle energy, or hostel bases near the canal and Belleville. Use this to match sleep style to route shape.",
    url: "https://www.google.com/maps/search/best+hotels+hostels+paris",
    category: "Stay",
    stops: citywideStay,
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
      "Paris nature is about relief inside dense days: chair gardens, river walks, hill parks, cemeteries, elevated rail paths, and east-side viewpoints. Use this guide when the route needs air between museums, meals, and neighborhoods rather than a full day outside the city.",
    url: "https://www.google.com/maps/search/best+parks+walks+paris",
    category: "Nature",
    stops: citywideNature,
    sources: parisNatureSources,
  }),
  guide({
    id: "list-paris-weekend-activities",
    slug: "paris-weekend-activities",
    seoSlug: "best-things-to-do",
    seoTitle: "Best Things to Do in Paris for a Weekend",
    seoDescription:
      "Best things to do in Paris for a weekend, pacing museums, bistros, river walks, Marais wandering, Left Bank routes, the 7th, Belleville, and Montmartre.",
    title: "A Weekend With Museum Breathing Room",
    description:
      "This Paris activity guide turns the city into route blocks: one major museum, one Left Bank day, one Marais wander, one Eiffel-side culture path, and an east-side or Montmartre evening. It is built to prevent museum overload while still leaving room for meals and streets.",
    url: "https://www.google.com/maps/search/best+things+to+do+paris+weekend",
    category: "Activities",
    stops: citywideActivities,
    sources: [...parisCultureSources, ...parisFoodSources, ...parisNatureSources],
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
  "Activities",
] as const satisfies readonly EditorialCategory[];

const neighborhoodTopics: Record<EditorialCategory, string> = {
  Food: "Restaurants",
  Nightlife: "Bars",
  Nature: "Parks and Walks",
  Culture: "Culture",
  Stay: "Hotels and Hostels",
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
  sources?: ListSource[];
};

function nStop(
  id: string,
  name: string,
  coordinates: [number, number],
  description: string,
  details: Partial<Pick<StopSeed, "price" | "priceSource" | "photo" | "hours">> = {},
): StopSeed {
  return { id, name, coordinates, description, ...details };
}

const parisNeighborhoodGuideSeeds: Record<ParisNeighborhood, Record<EditorialCategory, NeighborhoodGuideSeed>> = {
  "1st Arrondissement": {
    Food: {
      title: "Museum-Day Meals Around the Royal Core",
      description:
        "The 1st needs meals that can survive Louvre timing, Tuileries walks, and central crowds. This guide mixes tea-room ritual, udon, polished dining, and a classic cafe so the day has food options without leaving the royal core.",
      stops: [
        nStop("first-food-angelina", "Angelina", [48.8651, 2.3286], "Angelina is the Tuileries-side tea-room ritual for hot chocolate, pastries, and a seated pause between the Louvre, Rue de Rivoli, and Concorde. Use it when the stop is about classic Paris room tone as much as sugar.", { price: "$$", priceSource: "Google Maps / Paris dining guides" }),
        nStop("first-food-sanukiya", "Sanukiya", [48.8648, 2.3339], "Sanukiya gives the 1st a warm, efficient udon stop near Pyramides, useful when the day wants comfort, speed, and a clear lunch plan around Palais Royal or the Louvre. It adds a different Paris food rhythm without pulling the route out of the royal core.", { price: "$", priceSource: "Google Maps / Paris dining guides" }),
        nStop("first-food-verjus", "Verjus", [48.8634, 2.3381], "Verjus is the small reservation dinner for travelers who want the Louvre area to end with a proper modern meal rather than a tourist-corridor compromise. Save it for a more deliberate evening near Palais Royal.", { price: "$$$", priceSource: "MICHELIN Guide / Google Maps" }),
        nStop("first-food-le-nemours", "Le Nemours", [48.8639, 2.3359], "Le Nemours is the cafe-brasserie hinge between the Louvre, Palais Royal, and Comedie-Francaise. It works for breakfast, coffee, or a simple lunch when location and terrace rhythm matter more than discovery.", { price: "$$", priceSource: "Google Maps / local dining guides" }),
        nStop("first-food-le-fumoir", "Le Fumoir", [48.8606, 2.3407], "Le Fumoir works in Food as well as Nightlife because it is a Louvre-facing restaurant, bar, and tea room open from morning into evening. Use it for Scandinavian-influenced lunch or dinner, Sunday brunch, tea, or a polished museum-edge drink.", { price: "$$$", priceSource: "Official restaurant site / Google Maps" }),
      ],
    },
    Nightlife: {
      title: "Museum-Edge Drinks and Hotel Bars",
      description:
        "Nights in the 1st work best as polished starts or final stops near galleries, passages, and palace hotels. This guide keeps the route central with hotel bars, hidden rooms, wine-led addresses, and hybrid restaurant-bars that do not pull the night across town.",
      stops: [
        nStop("first-nightlife-danico", "Danico", [48.8666, 2.3399], "Danico is the Galerie Vivienne destination with World 50 Best support and a hidden-room feel that fits a polished Right Bank night. Use it when the evening wants style near Palais Royal or Bourse.", { price: "$$$", priceSource: "World's 50 Best Bars / Google Maps" }),
        nStop("first-nightlife-bar-228", "Bar 228", [48.865, 2.3286], "Bar 228 at Le Meurice gives the Tuileries edge a grand-hotel drink with dark wood, deep seats, and classic service. It is strongest for a special-occasion nightcap after museums, dinner, or a river walk.", { price: "$$$", priceSource: "Official hotel site / Google Maps" }),
        nStop("first-nightlife-le-fumoir", "Le Fumoir", [48.8606, 2.3407], "Le Fumoir is a Louvre-adjacent restaurant, bar, and tea room, so it works when the museum day needs a composed drink or a real meal without changing neighborhoods. It is more all-day address than pure bar.", { price: "$$", priceSource: "Official restaurant site / Google Maps" }),
        nStop("first-nightlife-juveniles", "Juveniles", [48.8669, 2.3373], "Juveniles is the wine-bar and small-plates option that keeps the covered-passage area relaxed. It works when the plan wants bottles, food, and conversation instead of a formal hotel bar.", { price: "$$", priceSource: "Google Maps / local wine guides" }),
      ],
    },
    Nature: {
      title: "Gardens, River Edges, and Central Air",
      description:
        "Nature in the 1st is not wilderness; it is the breathing room around heavyweight sights. This guide links palace gardens, island edges, and the Seine so museum days can reset without adding another metro ride.",
      stops: [
        nStop("first-nature-tuileries", "Jardin des Tuileries", [48.8635, 2.327], "Jardin des Tuileries turns the Louvre-Orangerie corridor into a paced walk with chairs, fountains, and broad sightlines. Use it between timed tickets or as the soft landing after a crowded museum block.", { photo: photos.nature }),
        nStop("first-nature-palais-royal-garden", "Jardin du Palais Royal", [48.8637, 2.3377], "Jardin du Palais Royal is the quieter garden pause behind arcades and columns, useful when the Louvre side feels too exposed. It is a compact reset before covered passages, shopping, or dinner.", { photo: photos.nature }),
        nStop("first-nature-vert-galant", "Square du Vert-Galant", [48.8571, 2.3413], "Square du Vert-Galant gives the 1st a low island viewpoint at the tip of Ile de la Cite. Use it for a short Seine pause between Sainte-Chapelle, Pont Neuf, and the Louvre.", { photo: photos.seine }),
        nStop("first-nature-seine-quays", "Seine Quays by the Louvre", [48.8589, 2.3408], "The Seine quays make the 1st feel walkable instead of monument-heavy, especially between Pont Neuf, the Louvre, and Orsay views. Save this stop when the route needs light, orientation, and movement.", { photo: photos.seine }),
      ],
    },
    Culture: {
      title: "Royal Core and Museum Weight",
      description:
        "The 1st can overload a day if the Louvre is treated as the only point. This guide links the museum with Palais Royal, Orangerie, Sainte-Chapelle, and the surrounding gardens so the central core feels routeable.",
      stops: [
        nStop("first-culture-louvre", "Musee du Louvre", [48.8606, 2.3376], "The Louvre is the 1st Arrondissement heavyweight, but it works best as a bounded museum plan rather than a full-day endurance test. Choose a wing, book a time slot, and leave room for the garden or Palais Royal.", { photo: photos.culture }),
        nStop("first-culture-palais-royal", "Palais Royal", [48.8637, 2.3377], "Palais Royal gives the Louvre area a quieter architectural and garden pause, with arcades, columns, and a clean route toward covered passages. It is useful when the district needs a reset without leaving the core.", { photo: photos.culture }),
        nStop("first-culture-orangerie", "Musee de l'Orangerie", [48.8638, 2.3227], "Musee de l'Orangerie is the compact art stop that can balance or replace a larger museum block. Monet's rooms and the Tuileries setting make it a powerful but manageable cultural anchor.", { photo: photos.culture }),
        nStop("first-culture-sainte-chapelle", "Sainte-Chapelle", [48.8554, 2.345], "Sainte-Chapelle adds a short, high-impact Gothic stop on the Ile de la Cite edge of the 1st. Timed entry helps it pair cleanly with the Louvre, Conciergerie, river walks, or a Marais continuation.", { photo: photos.culture }),
      ],
    },
    Stay: {
      title: "Palace Hotels and Central Sleep",
      description:
        "Staying in the 1st is about paying for centrality: palace service, Louvre access, shopping arcades, and short walks to the Seine. This guide keeps the picks honest for travelers who want the hotel to be part of the trip.",
      stops: [
        nStop("first-stay-cheval-blanc", "Cheval Blanc Paris", [48.8588, 2.342], "Cheval Blanc Paris is the Seine-facing luxury base for travelers who want palace-level service, Samaritaine access, and immediate Right Bank positioning. It is best when the hotel experience matters as much as the route.", { price: "$$$", priceSource: "Conde Nast Traveler / Google Travel" }),
        nStop("first-stay-le-meurice", "Le Meurice", [48.865, 2.3286], "Le Meurice gives the 1st classic palace gravity on Rue de Rivoli, with Tuileries and the Louvre almost outside the door. Choose it for grand-service travel and museum-heavy days.", { price: "$$$", priceSource: "Official hotel site / Google Travel" }),
        nStop("first-stay-regina-louvre", "Hotel Regina Louvre", [48.8638, 2.3322], "Hotel Regina Louvre is the heritage stay for travelers who want Tuileries, Palais Royal, and Louvre access without the newest design-hotel mood. It fits first-time Paris routes that prize address and view corridors.", { price: "$$$", priceSource: "Google Travel / Tripadvisor" }),
        nStop("first-stay-madame-reve", "Hotel Madame Reve", [48.8626, 2.3428], "Hotel Madame Reve gives the 1st a newer design-led base in the former post-office building near Les Halles and the Louvre. It works when central access, rooftop energy, and contemporary rooms matter.", { price: "$$$", priceSource: "Conde Nast Traveler / Google Travel" }),
      ],
    },
    Activities: {
      title: "A Central Day That Does Not Spiral",
      description:
        "The 1st is strongest when it becomes a tight route rather than a list of famous errands. This guide groups museum time, gardens, island glass, passages, and Seine walks into manageable activity blocks.",
      stops: [
        nStop("first-activity-louvre-tuileries", "Louvre and Tuileries Block", [48.8612, 2.3376], "The Louvre and Tuileries block is the central activity anchor: one planned museum theme, then garden air and a clean westward walk. Use it as a half-day structure instead of trying to solve the whole museum.", { photo: photos.culture }),
        nStop("first-activity-sainte-chapelle-cite", "Sainte-Chapelle and Ile de la Cite", [48.8554, 2.345], "Sainte-Chapelle and Ile de la Cite turn the edge of the 1st into a short Gothic-and-river activity. It is best with timed entry, Pont Neuf, and a slow move back toward the Louvre.", { photo: photos.culture }),
        nStop("first-activity-palais-royal-passages", "Palais Royal and Covered Passages", [48.8642, 2.3381], "Palais Royal and the nearby covered passages make a weather-proof walk with arcades, shops, and architecture. Use it when the day needs detail and browsing after a major sight.", { photo: photos.culture }),
        nStop("first-activity-samaritaine-seine", "Samaritaine and the Seine", [48.8591, 2.3426], "Samaritaine and the Seine give the 1st a shopping-and-river activity that stays compact. It works for a lighter block between meals, hotel check-in, and central evening plans.", { photo: photos.seine }),
      ],
    },
  },
  "Le Marais": {
    Food: {
      title: "Old-Quarter Meals With a Point",
      description:
        "Le Marais food works when each stop has a job: a bistro, falafel counter, market lunch, or polished wine-led room. This guide keeps the old quarter from becoming only boutiques, dessert lines, and vague cafe wandering.",
      stops: [
        nStop("marais-food-bistrot-tournelles", "Bistrot des Tournelles", [48.8555, 2.366], "Bistrot des Tournelles is the Marais bistro pick for travelers who want a real sit-down meal near Place des Vosges. The throwback room and classic plates make it useful when the neighborhood needs dinner, not just snacks.", { price: "$$", priceSource: "The Infatuation / Google Maps" }),
        nStop("marais-food-las-fallafel", "L'As du Fallafel", [48.8574, 2.3591], "L'As du Fallafel is the Rue des Rosiers counter stop that still deserves a save because it solves a different Marais meal: fast, iconic, and better treated as a focused lunch or snack than a full restaurant plan.", { price: "$", priceSource: "The Infatuation / Google Maps" }),
        nStop("marais-food-parcelles", "Parcelles", [48.8612, 2.3568], "Parcelles is the Marais reservation for a polished bistro meal without leaving the old-quarter route: market cooking, careful sauces, and a wine list that makes dinner feel chosen. Use it when galleries and boutiques should end with a real table rather than another counter stop.", { price: "$$$", priceSource: "The Infatuation / Google Maps" }),
        nStop("marais-food-enfants-rouges", "Marche des Enfants Rouges", [48.8627, 2.3612], "Marche des Enfants Rouges gives the guide a flexible covered-market lunch: Moroccan tagines and couscous, Japanese bentos, Lebanese plates, sandwiches, produce stalls, and casual counters for mixed appetites. Treat it as lively grazing with neighborhood texture rather than a quiet sit-down meal.", { price: "$", priceSource: "Eater / Google Maps" }),
      ],
    },
    Nightlife: {
      title: "Marais High-Key Bars and Low-Key Terraces",
      description:
        "Le Marais nightlife works because polished bars, cocktail-pub ease, queer-friendly terraces, taco-counter energy, and late sidewalk crowds sit close together. This guide keeps the night walkable around the old quarter and gives the group a choice between bougie, playful, and low-key.",
      stops: [
        nStop("marais-nightlife-bar-nouveau", "Bar Nouveau", [48.8623, 2.3579], "Bar Nouveau brings Art Nouveau detail, a design-forward room, and a weekend six-cocktail set-menu experience downstairs. Use it for a stylish Marais start when the group wants the night to feel intentional.", { price: "$$$", priceSource: "World's 50 Best Bars / Google Maps" }),
        nStop("marais-nightlife-cambridge", "The Cambridge Public House", [48.8618, 2.3632], "The Cambridge Public House is a cocktail pub: relaxed service, rotating creations, craft beers, natural wines, and pub food in the Marais. It can start a night without making everyone commit to a hushed bar mood.", { price: "$$", priceSource: "World's 50 Best Bars / Time Out" }),
        nStop("marais-nightlife-candelaria", "Candelaria", [48.8631, 2.3615], "Candelaria keeps the Marais bar route playful with a taqueria-front, cocktail-back format that still feels useful near Rue de Saintonge. Save it when the night needs food-adjacent energy and a hidden-room mood.", { price: "$$", priceSource: "Time Out / Google Maps" }),
        nStop("marais-nightlife-la-perle", "La Perle", [48.8608, 2.3614], "La Perle is the sidewalk-crowd Marais standby for a looser drink between galleries, dinner, and late wandering. Its value is social texture and location, not a perfectly quiet cocktail.", { price: "$$", priceSource: "Time Out / Google Maps" }),
      ],
    },
    Nature: {
      title: "Squares and Quiet Edges Between Streets",
      description:
        "Le Marais is dense, so the useful green stops are squares, courtyards, and river edges that break up shopping and museums. This guide gives the old quarter small pauses without leaving the neighborhood route.",
      stops: [
        nStop("marais-nature-place-vosges", "Place des Vosges", [48.8556, 2.3655], "Place des Vosges is the Marais garden-square anchor, useful for a pause between arcades, Victor Hugo, Rue des Rosiers, and a bistro meal. It gives the old quarter symmetry and air.", { photo: photos.nature }),
        nStop("marais-nature-square-temple", "Square du Temple - Elie Wiesel", [48.8648, 2.3605], "Square du Temple - Elie Wiesel is the north Marais green reset near Enfants Rouges and Rue de Bretagne. Use it when the route needs shade and local rhythm away from the busiest lanes.", { photo: photos.nature }),
        nStop("marais-nature-jardin-anne-frank", "Jardin Anne Frank", [48.861, 2.3547], "Jardin Anne Frank is a tucked-away pocket garden that helps the western Marais slow down near museums and shopping streets. It is best as a short decompression stop, not a destination park.", { photo: photos.nature }),
        nStop("marais-nature-seine-hotel-ville", "Seine Quays by Hotel de Ville", [48.8567, 2.3522], "The Seine quays by Hotel de Ville pull Le Marais toward the river and give the neighborhood a scenic exit. Use them before crossing to the islands or looping back into the old streets.", { photo: photos.seine }),
      ],
    },
    Culture: {
      title: "Mansion Museums and Old-Quarter Memory",
      description:
        "Le Marais culture is built from historic houses, civic memory, courtyards, and squares rather than one blockbuster. This guide keeps Picasso, Carnavalet, Victor Hugo, and Hotel de Sully tied to a walkable old-quarter day.",
      stops: [
        nStop("marais-culture-picasso", "Musee Picasso Paris", [48.8599, 2.3623], "Inside Le Marais, Musee Picasso Paris adds a real museum block to a route that can otherwise lean too hard on shopping and falafel. The Hotel Sale setting and collection depth make it strong enough to anchor the neighborhood day.", { photo: photos.culture }),
        nStop("marais-culture-carnavalet", "Musee Carnavalet", [48.8575, 2.3629], "Musee Carnavalet is the Paris-history anchor for Le Marais, with free permanent collections and a mansion setting that rewards a slower visit. Use it to add civic context before Place des Vosges or Rue des Rosiers.", { photo: photos.culture }),
        nStop("marais-culture-victor-hugo", "Maison de Victor Hugo", [48.8549, 2.3661], "Maison de Victor Hugo turns Place des Vosges into more than a pretty square, giving the route literary rooms and domestic scale. It is best as a compact cultural add-on rather than a full museum day.", { photo: photos.culture }),
        nStop("marais-culture-hotel-sully", "Hotel de Sully", [48.8547, 2.3642], "Hotel de Sully gives the Marais one of its best courtyard passages and a clean hinge toward Place des Vosges. Use it when the walk needs architecture and a quieter transition.", { photo: photos.culture }),
      ],
    },
    Stay: {
      title: "Boutique Bases in the Old Quarter",
      description:
        "Staying in Le Marais means prioritizing restaurants, bars, galleries, and walkable old-center streets over large-room calm. This guide mixes design hotels and practical budget bases that honestly serve the neighborhood.",
      stops: [
        nStop("marais-stay-grand-mazarin", "Le Grand Mazarin", [48.858, 2.3546], "For Le Marais stays, Le Grand Mazarin puts maximalist boutique energy close to Hotel de Ville, galleries, restaurants, and late bars. It suits travelers who want old-center access with design-forward energy.", { price: "$$$", priceSource: "Conde Nast Traveler / Vogue" }),
        nStop("marais-stay-sookie", "Hotel Sookie", [48.8628, 2.3606], "Hotel Sookie is the smaller north Marais base for travelers who want Rue de Bretagne, Enfants Rouges, and gallery streets nearby. It fits a boutique-stay trip better than a palace-service trip.", { price: "$$", priceSource: "Google Travel / Tripadvisor" }),
        nStop("marais-stay-jules-jim", "Hotel Jules and Jim", [48.8632, 2.3567], "Hotel Jules and Jim gives the upper Marais a design-hotel option with a courtyard bar and quick access to Arts et Metiers. Use it when nightlife and central movement matter.", { price: "$$", priceSource: "Google Travel / Tripadvisor" }),
        nStop("marais-stay-mije", "MIJE Marais", [48.8564, 2.3615], "MIJE Marais is the budget-friendly historic-house option for travelers who want the old quarter without hotel pricing. It works best for simple rooms, school-group energy, and maximum location value.", { price: "$", priceSource: "Hostelworld / Google Maps" }),
      ],
    },
    Activities: {
      title: "Old Streets, Squares, and Late Stops",
      description:
        "Le Marais activities are about density: a mansion museum, a square, food streets, boutiques, and a bar can all fit without transit. This guide turns the neighborhood into a flexible half-day or evening route.",
      stops: [
        nStop("marais-activity-vosges-picasso", "Place des Vosges to Musee Picasso", [48.8578, 2.364], "Place des Vosges to Musee Picasso is the classic Marais culture walk, pairing a square, mansion museum, and old streets. Use it as the backbone of a daytime route.", { photo: photos.culture }),
        nStop("marais-activity-rue-rosiers", "Rue des Rosiers Food Walk", [48.8574, 2.3591], "Rue des Rosiers turns a Marais wander into a food-and-history stop with falafel counters, bakeries, and Jewish-quarter context. It is best as a focused lunch or snack block.", { photo: photos.food }),
        nStop("marais-activity-rue-bretagne", "Rue de Bretagne and Enfants Rouges", [48.8627, 2.3612], "Rue de Bretagne and Enfants Rouges keep the north Marais useful for market grazing, shopping, and cafe stops. Use it when the route needs flexible pacing.", { photo: photos.food }),
        nStop("marais-activity-cocktail-loop", "Marais Cocktail Loop", [48.862, 2.36], "The Marais cocktail loop links Bar Nouveau, Cambridge, Candelaria, and sidewalk cafes without requiring a cross-town night. It works when dinner and drinks should stay close.", { photo: photos.nightlife }),
      ],
    },
  },
  "Saint-Germain-des-Pres": {
    Food: {
      title: "Left Bank Tables and Cafe Rituals",
      description:
        "Saint-Germain food should not be only cafe mythology. This guide gives the area meal roles: brasserie history, oysters, a modern bistro, a quick sandwich, and one iconic terrace for Left Bank days that need food with context.",
      stops: [
        nStop("saint-germain-food-lipp", "Brasserie Lipp", [48.8535, 2.3332], "Brasserie Lipp is the Saint-Germain institution for a literary, polished boulevard meal. It is useful when the plan wants old Left Bank atmosphere and classic cooking that can carry lunch or dinner.", { price: "$$$", priceSource: "The Infatuation / Google Maps" }),
        nStop("saint-germain-food-huitrerie-regis", "Huitrerie Regis", [48.8532, 2.3351], "Huitrerie Regis gives Saint-Germain a precise seafood stop with oysters, white wine, and a compact room. Use it when the route needs a clean focused meal rather than a long brasserie sitting.", { price: "$$", priceSource: "Eater / Google Maps" }),
        nStop("saint-germain-food-semilla", "Semilla", [48.8535, 2.3374], "Semilla is the modern Left Bank bistro for travelers who want Saint-Germain without only heritage rooms. It fits an evening around galleries, the river, and Odeon.", { price: "$$", priceSource: "Eater / Google Maps" }),
        nStop("saint-germain-food-cafe-flore", "Cafe de Flore", [48.8542, 2.3322], "Cafe de Flore belongs as a context stop, not because it is hidden. Use it when the traveler wants the ritual of Saint-Germain cafe history and understands that the value is room and address.", { price: "$$", priceSource: "Conde Nast Traveler / Google Maps" }),
      ],
    },
    Nightlife: {
      title: "Left Bank Chic, Hotel Bars, and Speakeasies",
      description:
        "Saint-Germain nightlife is best when it stays elegant but not sleepy: 1930s-style speakeasy rooms, grand hotel bars, market-street terraces, and snug late-night addresses. This guide keeps the Left Bank evening close to dinner and river walks without making every stop feel formal.",
      stops: [
        nStop("saint-germain-nightlife-prescription", "Prescription Cocktail Club", [48.8538, 2.3372], "Prescription Cocktail Club gives Saint-Germain a 1930s-inspired, theatrical speakeasy mood near Odeon and Rue Mazarine. It is best when the night wants low light, style, and a short walk from dinner.", { price: "$$", priceSource: "Time Out / Google Maps" }),
        nStop("saint-germain-nightlife-josephine", "Bar Josephine", [48.8517, 2.327], "Bar Josephine at Hotel Lutetia brings grand Left Bank hotel energy, live music on select nights, and enough dining-and-stay context to make the room feel like an evening plan rather than a quick stop.", { price: "$$$", priceSource: "Official hotel site / Google Maps" }),
        nStop("saint-germain-nightlife-bar-marche", "Le Bar du Marche", [48.8532, 2.3362], "Le Bar du Marche is the buzzing Rue de Buci terrace for classic bistro fare from breakfast onward, plus cocktails when the Left Bank evening loosens up. Use it as a social hinge in the middle of Saint-Germain.", { price: "$$", priceSource: "Google Maps / local nightlife guides" }),
        nStop("saint-germain-nightlife-castor-club", "Castor Club", [48.8539, 2.3392], "Castor Club is a snug Left Bank speakeasy with a hidden-door feel, a compact room, and an extensive cocktail list. Save it for a late, intimate stop when the group wants atmosphere over scale.", { price: "$$", priceSource: "Time Out / Google Maps" }),
      ],
    },
    Nature: {
      title: "Luxembourg Chairs and River Walks",
      description:
        "Saint-Germain nature is mostly elegant pause space: Luxembourg chairs, small squares, and Seine edges. This guide keeps the Left Bank route breathable between galleries, cafes, Orsay, and dinner.",
      stops: [
        nStop("saint-germain-nature-luxembourg", "Jardin du Luxembourg", [48.8462, 2.3372], "From Saint-Germain, Jardin du Luxembourg is the natural reset before the route drifts toward the Latin Quarter or another museum block. Chairs, fountains, and palace views make it a practical pause rather than a detour.", { photo: photos.nature }),
        nStop("saint-germain-nature-laurent-prache", "Square Laurent-Prache", [48.8543, 2.3342], "Square Laurent-Prache is the small garden beside the church, useful when the boulevard needs a quiet minute. It works as a compact pause between cafes, shops, and the Delacroix museum.", { photo: photos.nature }),
        nStop("saint-germain-nature-gabriel-pierne", "Square Gabriel-Pierne", [48.8548, 2.3375], "Square Gabriel-Pierne gives Rue de Seine and the galleries a leafy pocket with benches and a quieter rhythm. Use it when the Left Bank walk needs shade without turning into a park visit.", { photo: photos.nature }),
        nStop("saint-germain-nature-quai-malaquais", "Quai Malaquais Seine Walk", [48.858, 2.335], "Quai Malaquais pulls Saint-Germain to the river, with views toward the Louvre and easy movement to Pont des Arts. It is the best reset between galleries, Orsay, and a central dinner.", { photo: photos.seine }),
      ],
    },
    Culture: {
      title: "Abbey, Galleries, and Left Bank Rooms",
      description:
        "Saint-Germain culture works at a smaller scale than the Louvre: church history, artist rooms, institutions, galleries, and the river. This guide keeps the neighborhood intellectual without making it feel like homework.",
      stops: [
        nStop("saint-germain-culture-eglise", "Eglise Saint-Germain-des-Pres", [48.8539, 2.3346], "Eglise Saint-Germain-des-Pres anchors the neighborhood with early-medieval depth and a direct link to the Left Bank's name. Use it as the compact cultural start before cafes or galleries.", { photo: photos.culture }),
        nStop("saint-germain-culture-delacroix", "Musee national Eugene-Delacroix", [48.8541, 2.3356], "Musee national Eugene-Delacroix is a small artist-house museum that rewards a slower Saint-Germain day. It pairs naturally with the church, Rue de Furstenberg, and a cafe stop.", { photo: photos.culture }),
        nStop("saint-germain-culture-monnaie", "Monnaie de Paris", [48.8567, 2.3391], "Monnaie de Paris gives the Seine edge an institution with exhibitions, craft history, and a strong courtyard setting. Use it when the neighborhood needs a cultural stop beyond literary cafes.", { photo: photos.culture }),
        nStop("saint-germain-culture-institut", "Institut de France", [48.8572, 2.3376], "Institut de France is a landmark exterior and riverfront orientation point across from the Louvre. It works as a cultural marker on a gallery-and-quay walk rather than a long visit.", { photo: photos.culture }),
      ],
    },
    Stay: {
      title: "Grand Left Bank and Quiet Boutique Bases",
      description:
        "Saint-Germain stays are for travelers who want cafe mornings, galleries, Luxembourg access, and calm returns after museum days. This guide balances palace heritage with smaller hotels close to the Left Bank route.",
      stops: [
        nStop("saint-germain-stay-lutetia", "Hotel Lutetia", [48.8517, 2.327], "In Saint-Germain, Hotel Lutetia is the grand hotel choice for Orsay, Luxembourg, polished cafe routes, and Left Bank calm. Choose it when heritage matters more than immediate Marais nightlife.", { price: "$$$", priceSource: "Conde Nast Traveler / The Times" }),
        nStop("saint-germain-stay-relais-christine", "Relais Christine", [48.8541, 2.3403], "Relais Christine gives Saint-Germain a tucked-away luxury base near the river and Odeon. It fits travelers who want quiet, romance, and historic-street access rather than lobby scene.", { price: "$$$", priceSource: "Conde Nast Traveler / Google Travel" }),
        nStop("saint-germain-stay-aubusson", "Hotel d'Aubusson", [48.8545, 2.3396], "Hotel d'Aubusson is a polished Left Bank hotel with jazz-bar energy and easy access to Rue de Buci, the Seine, and galleries. It works when the stay should support both culture and evenings.", { price: "$$$", priceSource: "Google Travel / Tripadvisor" }),
        nStop("saint-germain-stay-madison", "Madison Hotel", [48.8534, 2.3338], "Madison Hotel gives the boulevard a practical boutique base beside the church and classic cafes. Use it when location, metro access, and Saint-Germain identity matter more than resort amenities.", { price: "$$", priceSource: "Google Travel / Tripadvisor" }),
      ],
    },
    Activities: {
      title: "Cafe Rituals, Galleries, and Garden Time",
      description:
        "Saint-Germain activities are best built as a slow Left Bank sequence: coffee, church, galleries, garden, river, and dinner. This guide keeps the neighborhood polished without turning it into a postcard cafe crawl.",
      stops: [
        nStop("saint-germain-activity-cafe-abbey", "Cafe and Abbey Loop", [48.854, 2.334], "The cafe and abbey loop links Cafe de Flore, Brasserie Lipp, and Eglise Saint-Germain-des-Pres into one compact Left Bank ritual. Use it early, before the boulevard gets too crowded.", { photo: photos.food }),
        nStop("saint-germain-activity-rue-seine", "Rue de Seine Gallery Walk", [48.8547, 2.3367], "Rue de Seine gives Saint-Germain a browsable gallery spine between the church and river. It works when the day needs looking, wandering, and small cultural stops without another ticket.", { photo: photos.culture }),
        nStop("saint-germain-activity-luxembourg-odeon", "Luxembourg to Odeon", [48.8488, 2.339], "Luxembourg to Odeon is the soft walking block that connects garden chairs, bookshops, cinemas, and dinner streets. Use it to keep the Left Bank day relaxed.", { photo: photos.nature }),
        nStop("saint-germain-activity-orsay-bridge", "Orsay Bridge Walk", [48.8585, 2.3295], "The Orsay bridge walk connects Saint-Germain to the museum side through the Seine instead of the metro. It is a useful activity when art, views, and dinner need to stay aligned.", { photo: photos.seine }),
      ],
    },
  },
  "Latin Quarter": {
    Food: {
      title: "Historic Rooms and River-Edge Tables",
      description:
        "Latin Quarter food is strongest when it moves between bakeries, Art Nouveau dining rooms, candlelit old houses, and a formal Seine-side classic. This guide keeps meals tied to the Pantheon, Mouffetard, Cluny, and the river without forcing a casual campus frame onto serious restaurants.",
      stops: [
        nStop("latin-food-coupe-chou", "Le Coupe-Chou", [48.8485, 2.3483], "Le Coupe-Chou gives the Latin Quarter a candlelit old-house meal near the Sorbonne and Pantheon. Use it when the route wants atmosphere and a slower dinner without leaving the university streets.", { price: "$$", priceSource: "Google Maps / local dining guides" }),
        nStop("latin-food-bouillon-racine", "Bouillon Racine", [48.849, 2.341], "Bouillon Racine is the Art Nouveau dining-room choice near Odeon and Cluny, useful when the day needs a historic room at a more accessible format. It is best for groups that want setting and classic comfort.", { price: "$$", priceSource: "Google Maps / local dining guides" }),
        nStop("latin-food-maison-isabelle", "La Maison d'Isabelle", [48.8498, 2.3486], "La Maison d'Isabelle is the croissant and bakery stop that makes a Latin Quarter morning feel planned. Use it before the Pantheon, Mouffetard, or a museum block when breakfast should be quick and good.", { price: "$", priceSource: "Google Maps / Paris bakery guides" }),
        nStop("latin-food-tour-argent", "La Tour d'Argent", [48.8499, 2.3544], "La Tour d'Argent is the formal river-edge splurge for travelers who want old Paris ceremony and a view-backed meal. It belongs as a deliberate booking, not a casual neighborhood dinner.", { price: "$$$", priceSource: "MICHELIN Guide / Google Maps" }),
      ],
    },
    Nightlife: {
      title: "Live Cellars and Low-Key Latin Bars",
      description:
        "Latin Quarter nights work when old cellars, live music, pub energy, and casual Mouffetard bars are used deliberately. This guide focuses on music, dancing, and low-key late stops after bookshops, dinner, or a Pantheon day.",
      stops: [
        nStop("latin-nightlife-huchette", "Le Caveau de la Huchette", [48.8525, 2.3468], "Le Caveau de la Huchette is the Latin Quarter live-cellar anchor, useful when nightlife should be music, dancing, and old-stone atmosphere. Check the program before building the night around it.", { price: "$$", priceSource: "Official venue site / Google Maps" }),
        nStop("latin-nightlife-piano-vache", "Le Piano Vache", [48.8503, 2.3488], "Le Piano Vache gives the area a student-bar institution with posters, inexpensive drinks, and a looser mood near the Sorbonne. Use it when the night should stay casual and local-feeling.", { price: "$", priceSource: "Google Maps / local nightlife guides" }),
        nStop("latin-nightlife-teddys", "Teddy's Bar", [48.8473, 2.3443], "Teddy's Bar is a compact cocktail and beer stop near Mouffetard, useful for a low-pressure drink after dinner. It works best as part of a small Latin Quarter bar sequence.", { price: "$$", priceSource: "Google Maps / local nightlife guides" }),
        nStop("latin-nightlife-requin", "Le Requin Chagrin", [48.8465, 2.3478], "Le Requin Chagrin is the pub-style stop near the Pantheon and student streets, good for groups that want easy drinks without a reservation ritual. Save it for a casual second stop.", { price: "$", priceSource: "Google Maps / local nightlife guides" }),
      ],
    },
    Nature: {
      title: "Gardens, Arenas, and River Breathing Room",
      description:
        "The Latin Quarter has real green relief if the route steps off the lecture-hall streets. This guide links Luxembourg, Jardin des Plantes, Arenes de Lutece, and the Seine for pauses between culture and food.",
      stops: [
        nStop("latin-nature-luxembourg", "Jardin du Luxembourg", [48.8462, 2.3372], "Jardin du Luxembourg is the western green anchor for Latin Quarter days, especially before or after the Pantheon and Sorbonne. Chairs, fountains, and paths make it the easiest long pause.", { photo: photos.nature }),
        nStop("latin-nature-jardin-plantes", "Jardin des Plantes", [48.8439, 2.3599], "Jardin des Plantes stretches the Latin Quarter east toward natural history, garden paths, and family-friendly museum time. It is best when the day needs greenery and a quieter rhythm.", { photo: photos.nature }),
        nStop("latin-nature-arenes", "Arenes de Lutece", [48.8451, 2.3522], "Arenes de Lutece gives the neighborhood a Roman open-air pocket tucked behind ordinary streets. Use it as a short historical and green stop between Mouffetard and Jardin des Plantes.", { photo: photos.nature }),
        nStop("latin-nature-seine-bookstalls", "Seine Bookstalls and Quays", [48.8527, 2.347], "The Seine bookstalls and quays are the Latin Quarter's river reset, linking Shakespeare and Company, Notre-Dame views, and slow browsing. It is the easiest way to add air to a bookish route.", { photo: photos.seine }),
      ],
    },
    Culture: {
      title: "Books, Domes, and Medieval Rooms",
      description:
        "The Latin Quarter deserves its own cultural map because university streets, bookshops, medieval rooms, civic monuments, and gardens sit close enough to walk. Use this for history without turning the day into lectures and plaques.",
      stops: [
        nStop("latin-culture-pantheon", "Pantheon", [48.8462, 2.346], "The Pantheon is the Latin Quarter's civic-history anchor, connecting republican memory, architecture, and the Sorbonne-side street grid. It is best paired with Luxembourg or Cluny rather than rushed as a dome photo.", { photo: photos.culture }),
        nStop("latin-culture-cluny", "Musee de Cluny", [48.8506, 2.3431], "Musee de Cluny is the medieval counterweight to the big art museums, with tapestries, Roman bath remains, and a scale that suits a slower Left Bank day. It is useful when the group needs culture without Louvre sprawl.", { photo: photos.culture }),
        nStop("latin-culture-shakespeare", "Shakespeare and Company", [48.8526, 2.3471], "Shakespeare and Company is touristy for a reason, but it still gives the Latin Quarter its English-language literary stop near Notre-Dame and the Seine. Save it for a short browse and river walk.", { photo: photos.culture }),
        nStop("latin-culture-sorbonne", "Place de la Sorbonne", [48.8487, 2.3437], "Place de la Sorbonne turns the area's academic identity into a simple walking anchor. It works as connective tissue between the Pantheon, cafes, bookshops, and Luxembourg.", { photo: photos.culture }),
      ],
    },
    Stay: {
      title: "Bookish Bases Near the Pantheon",
      description:
        "Latin Quarter stays work for travelers who want student streets, bookshops, gardens, and easy RER or metro access. This guide balances boutique hotels, older quiet rooms, and one budget base that honestly serves the area.",
      stops: [
        nStop("latin-stay-dames-pantheon", "Hotel Les Dames du Pantheon", [48.846, 2.3459], "Hotel Les Dames du Pantheon is the location-first boutique stay with Pantheon views and direct access to the Sorbonne side. It fits travelers who want literary Left Bank mood and short walks.", { price: "$$", priceSource: "Google Travel / Tripadvisor" }),
        nStop("latin-stay-grandes-ecoles", "Hotel des Grandes Ecoles", [48.8434, 2.3509], "Hotel des Grandes Ecoles gives the Latin Quarter a courtyard-garden hotel near Mouffetard. Use it when calm, charm, and neighborhood feel matter more than large luxury services.", { price: "$$", priceSource: "Google Travel / Tripadvisor" }),
        nStop("latin-stay-monte-cristo", "Hotel Monte Cristo", [48.8377, 2.3523], "Hotel Monte Cristo is the southern Latin Quarter boutique base with a more styled, tucked-away mood. It works for travelers who want access to Mouffetard, Jardin des Plantes, and quieter nights.", { price: "$$", priceSource: "Google Travel / Tripadvisor" }),
        nStop("latin-stay-young-happy", "Young and Happy Latin Quarter", [48.8446, 2.3507], "Young and Happy Latin Quarter is the budget hostel pick for travelers who want Mouffetard, student bars, and simple access to the Pantheon area. It is strongest for social, low-cost stays.", { price: "$", priceSource: "Hostelworld / Google Maps" }),
      ],
    },
    Activities: {
      title: "A Bookish Left Bank Day",
      description:
        "Latin Quarter activities should move between books, civic history, gardens, and student streets. This guide turns the neighborhood into a walkable day with culture, browsing, food, and river edges.",
      stops: [
        nStop("latin-activity-pantheon-cluny", "Pantheon and Cluny Route", [48.8484, 2.3447], "The Pantheon and Cluny route gives the Latin Quarter its civic and medieval backbone in one compact walk. Use it when the day needs two strong cultural anchors without cross-town travel.", { photo: photos.culture }),
        nStop("latin-activity-bookshops-seine", "Bookshops and the Seine", [48.8526, 2.3471], "Bookshops and the Seine link Shakespeare and Company, bouquinistes, Notre-Dame views, and river walking. It is the classic short activity when the neighborhood needs romance and browsing.", { photo: photos.seine }),
        nStop("latin-activity-jardin-plantes", "Jardin des Plantes Afternoon", [48.8439, 2.3599], "A Jardin des Plantes afternoon adds gardens, natural-history museums, and family-friendly pacing to the Latin Quarter. It works especially well after dense historic streets.", { photo: photos.nature }),
        nStop("latin-activity-mouffetard", "Rue Mouffetard Food Walk", [48.8427, 2.3494], "Rue Mouffetard gives the area a market-street activity with bakeries, cheese shops, cafes, and casual dinner options. Use it when the day needs food texture rather than another ticket.", { photo: photos.food }),
      ],
    },
  },
  Montmartre: {
    Food: {
      title: "Hill Meals Beyond the View",
      description:
        "Montmartre food is strongest when the meal has a purpose: a poultry room, a tiny bistro, a brunch stop, a Breton crepe table, or a village-street dinner. This guide keeps the hill's food useful before and after the view.",
      stops: [
        nStop("montmartre-food-coq-fils", "Le Coq and Fils", [48.887, 2.3383], "Le Coq and Fils gives Montmartre a poultry-focused destination meal near the upper hill without leaning on postcard atmosphere alone. Use it for a planned lunch or dinner after the museum lanes.", { price: "$$$", priceSource: "MICHELIN Guide / Google Maps" }),
        nStop("montmartre-food-boite-lettres", "La Boite aux Lettres", [48.8878, 2.3356], "La Boite aux Lettres is the small bistro pick for travelers who want a neighborhood dinner near Lamarck-Caulaincourt. It works when the hill needs warmth, wine, and a room that feels local.", { price: "$$", priceSource: "Google Maps / Paris dining guides" }),
        nStop("montmartre-food-hardware", "Hardware Societe", [48.886, 2.3438], "Hardware Societe is the brunch-and-coffee stop for a Sacre-Coeur morning, with Australian cafe energy, plated breakfasts, and a location just below the basilica. Go early or treat the wait as part of a slower hill start.", { price: "$$", priceSource: "Google Maps / local dining guides" }),
        nStop("montmartre-food-breizh-cafe", "Breizh Cafe Abbesses", [48.8846, 2.3377], "Breizh Cafe Abbesses adds the crepe piece Montmartre should have, with Breton galettes, cider, and a useful Abbesses base below the summit. It is the casual, lighter meal that can sit between a hill walk and Pigalle or Lamarck-Caulaincourt.", { price: "$$", priceSource: "Official restaurant site / Google Maps" }),
        nStop("montmartre-food-poulbot", "Le Poulbot", [48.8866, 2.3404], "Le Poulbot gives the central hill a compact French meal close to Place du Tertre while still feeling more deliberate than the busiest tourist-strip terraces. It works for a warm bistro dinner after artist lanes, the basilica, or a Montmartre museum stop.", { price: "$$", priceSource: "Google Maps / local dining guides" }),
      ],
    },
    Nightlife: {
      title: "Hilltop Nightcaps and Old Cabaret Energy",
      description:
        "Montmartre nights work when they lean into the hill: rooftop views, old cabaret rooms, intimate hotel bars, and lower-hill dives. This guide keeps after-dark plans tied to the neighborhood's slope and mood.",
      stops: [
        nStop("montmartre-nightlife-terrass", "Terrass Hotel Rooftop", [48.8852, 2.3326], "Terrass Hotel Rooftop gives Montmartre a view-led drink without climbing back to the basilica steps. Use it for sunset, an early aperitif, or a calmer nightcap on the west side of the hill.", { price: "$$$", priceSource: "Official hotel site / Google Maps" }),
        nStop("montmartre-nightlife-lapin-agile", "Au Lapin Agile", [48.8888, 2.3401], "Au Lapin Agile is the historic cabaret stop that keeps Montmartre connected to song, performance, and artist lore. Check the schedule and treat it as a planned show, not a drop-in bar.", { price: "$$", priceSource: "Official venue site / Google Maps" }),
        nStop("montmartre-nightlife-tres-particulier", "Le Tres Particulier", [48.8882, 2.3339], "Le Tres Particulier is the hidden cocktail bar inside Hotel Particulier Montmartre, useful when the night wants garden secrecy and a more refined hilltop mood. Book or confirm access before relying on it.", { price: "$$$", priceSource: "Official hotel site / Google Maps" }),
        nStop("montmartre-nightlife-marlusse", "Marlusse et Lapin", [48.8842, 2.3364], "Marlusse et Lapin is the lower-hill bar for a looser, playful drink near Abbesses. It works when Montmartre should end social and casual rather than polished.", { price: "$$", priceSource: "Google Maps / local nightlife guides" }),
      ],
    },
    Nature: {
      title: "Steps, Slopes, and Quiet Hill Corners",
      description:
        "Montmartre's outdoor value is slope, view, and small green pockets rather than big parks. This guide links the basilica steps, squares, cemetery paths, and quieter hill corners into a route with real pauses.",
      stops: [
        nStop("montmartre-nature-sacre-steps", "Sacre-Coeur Steps", [48.8867, 2.3431], "The Sacre-Coeur steps are the obvious view point, but they work best early or late when the hill has room to breathe. Use them as a timed outdoor stop, not an all-day hangout.", { photo: photos.montmartre }),
        nStop("montmartre-nature-louise-michel", "Square Louise Michel", [48.8846, 2.3443], "Square Louise Michel gives the climb to Sacre-Coeur a garden frame, with switchback paths, lawns, and changing city views. It is useful when the route needs a slower ascent.", { photo: photos.nature }),
        nStop("montmartre-nature-suzanne-buisson", "Square Suzanne Buisson", [48.8886, 2.3369], "Square Suzanne Buisson is a quieter green pocket on the back side of the hill, away from the busiest summit lanes. Use it between Lamarck-Caulaincourt and the old mills.", { photo: photos.nature }),
        nStop("montmartre-nature-cemetery", "Cimetiere de Montmartre", [48.8875, 2.3306], "Cimetiere de Montmartre adds a leafy, reflective walk below the hill and works as a calmer counterpoint to Sacre-Coeur crowds. It is best for a slow route toward Pigalle or Rue Caulaincourt.", { photo: photos.nature }),
      ],
    },
    Culture: {
      title: "Hilltop Views Without the Rush",
      description:
        "Montmartre needs a guide because the famous stops can overwhelm the village texture. This route keeps Sacre-Coeur, artist history, old mills, and quieter lanes together without turning the hill into a photo queue.",
      stops: [
        nStop("montmartre-culture-sacre-coeur", "Basilique du Sacre-Coeur", [48.8867, 2.3431], "Sacre-Coeur is the hilltop anchor, but the best visit treats the basilica, dome, steps, and view as one timed block. Go early or late, then leave room for side streets.", { photo: photos.montmartre }),
        nStop("montmartre-culture-musee-montmartre", "Musee de Montmartre", [48.8872, 2.3408], "Musee de Montmartre gives the hill context beyond the basilica, with artist history, gardens, and a calmer pace near the busiest lanes. It is useful when the route needs texture instead of another viewpoint.", { photo: photos.montmartre }),
        nStop("montmartre-culture-place-tertre", "Place du Tertre", [48.8865, 2.3407], "Place du Tertre is crowded and commercial, but it still explains the neighborhood's artist-brand mythology. Pass through briefly, then use it as a hinge toward quieter lanes.", { photo: photos.montmartre }),
        nStop("montmartre-culture-moulin-galette", "Moulin de la Galette", [48.8873, 2.3367], "Moulin de la Galette helps turn Montmartre from postcard into neighborhood history: mills, artists, and winding streets. Use it as a walking marker between Lamarck-Caulaincourt, Abbesses, and the summit.", { photo: photos.montmartre }),
      ],
    },
    Stay: {
      title: "Hilltop Hotels and Social Budget Bases",
      description:
        "Montmartre stays are for travelers who want village streets, north-side evenings, and views more than central monument access. This guide balances rooftop hotels, small boutiques, and hostel bases near the hill.",
      stops: [
        nStop("montmartre-stay-terrass", "Terrass Hotel", [48.8852, 2.3326], "Terrass Hotel is the view-led Montmartre stay with rooftop drinks and easy access to Rue Caulaincourt and Abbesses. Use it when the hill should shape mornings and evenings.", { price: "$$$", priceSource: "Conde Nast Traveler / Google Travel" }),
        nStop("montmartre-stay-arts", "Hotel des Arts Montmartre", [48.8853, 2.3348], "Hotel des Arts Montmartre is a smaller neighborhood hotel close to Abbesses, restaurants, and hill walks. It fits travelers who want Montmartre charm without a big hotel scene.", { price: "$$", priceSource: "Google Travel / Tripadvisor" }),
        nStop("montmartre-stay-village", "Le Village Montmartre", [48.8842, 2.3446], "Le Village Montmartre is the hostel base near Anvers and Sacre-Coeur for budget travelers who want the hill within minutes. It works for simple dorms or privates with social energy.", { price: "$", priceSource: "Hostelworld / HostelsClub" }),
        nStop("montmartre-stay-momart", "Mom'Art Hotel", [48.8846, 2.3432], "Mom'Art Hotel gives the lower hill a compact boutique option near Anvers and Sacre-Coeur. Use it when convenience to the climb matters more than a quiet residential pocket.", { price: "$$", priceSource: "Google Travel / Tripadvisor" }),
      ],
    },
    Activities: {
      title: "A Hill Walk With Timing",
      description:
        "Montmartre activities need timing because the famous lanes crowd quickly. This guide builds the hill as a route: basilica, museum, old streets, lower-hill cafes, and an evening that does not depend on one viewpoint.",
      stops: [
        nStop("montmartre-activity-sacre-sunrise", "Sacre-Coeur Early or Late", [48.8867, 2.3431], "Sacre-Coeur early or late is the best way to make the hill feel spacious rather than hectic. Use the timing to pair the basilica, steps, and view with quieter lanes.", { photo: photos.montmartre }),
        nStop("montmartre-activity-artist-lanes", "Musee de Montmartre and Artist Lanes", [48.8872, 2.3408], "Musee de Montmartre and the artist lanes give the neighborhood context beyond Place du Tertre. It is a useful activity block for travelers who want history with the walk.", { photo: photos.culture }),
        nStop("montmartre-activity-abbesses-lamarck", "Abbesses to Lamarck-Caulaincourt", [48.886, 2.3365], "Abbesses to Lamarck-Caulaincourt is the calmer slope walk through cafes, shops, and back-of-hill streets. Use it when the route needs Montmartre texture without staying on the summit.", { photo: photos.montmartre }),
        nStop("montmartre-activity-cabaret-night", "Cabaret and Hill Night", [48.8888, 2.3401], "A cabaret and hill night uses Au Lapin Agile, rooftop drinks, or lower-hill bars to keep Montmartre after dark. It works when the evening is planned around a show or view.", { photo: photos.nightlife }),
      ],
    },
  },
  "Canal Saint-Martin": {
    Food: {
      title: "Bakery Mornings and Canal Tables",
      description:
        "Canal Saint-Martin food is best when it follows the water: bakery starts, brunch queues, rotating kitchens, and terrace meals. This guide keeps the meal plan walkable along the locks and north-south canal spine.",
      stops: [
        nStop("canal-food-du-pain", "Du Pain et des Idees", [48.8719, 2.3622], "Du Pain et des Idees is the bakery stop that makes canal mornings feel intentional. Use it for pastries and bread before the locks, Republique, or a north Marais route.", { price: "$", priceSource: "Eater / Google Maps" }),
        nStop("canal-food-holybelly", "Holybelly 5", [48.8723, 2.3606], "Holybelly 5 is the brunch-and-coffee anchor near the canal, useful when the morning needs a proper seated meal before walking. Expect demand and build timing around it.", { price: "$$", priceSource: "Google Maps / Paris dining guides" }),
        nStop("canal-food-early-june", "Early June", [48.8739, 2.3621], "Early June gives the canal a rotating-chef, natural-wine dinner that changes more often than a standard bistro menu. Save it for travelers who like a current, low-formality meal where the kitchen, bottles, and room feel tied to the neighborhood.", { price: "$$", priceSource: "Eater / Google Maps" }),
        nStop("canal-food-chez-prune", "Chez Prune", [48.8726, 2.3634], "Chez Prune is the canal-side cafe standby for lunch, aperitif, or an easy meal with the water close by. Use it as the social hinge of the route: a terrace, a meeting point, and a relaxed pause before the canal keeps moving north.", { price: "$$", priceSource: "Time Out / Google Maps" }),
      ],
    },
    Nightlife: {
      title: "Canal Drinks With a Route",
      description:
        "Canal Saint-Martin nights are strongest when they stay walkable: one proper cocktail, a music terrace, an atmospheric indoor bar, and a casual meeting-point cafe. The guide keeps the canal from becoming only bank-side wandering.",
      stops: [
        nStop("canal-nightlife-gravity", "Gravity Bar", [48.8728, 2.3622], "Gravity Bar is the cocktail stop for a canal night that wants design and sharper drinks before the route loosens up. It is best for a focused first drink near Rue des Vinaigriers.", { price: "$$", priceSource: "Time Out / Google Maps" }),
        nStop("canal-nightlife-la-meduse", "La Meduse", [48.8791, 2.3671], "La Meduse gives the canal a cocktail-and-natural-wine option right by the water, with enough food to keep the evening flexible. Use it when the night should stay canal-side but still feel deliberate.", { price: "$$", priceSource: "Time Out / Google Maps" }),
        nStop("canal-nightlife-point-ephemere", "Point Ephemere", [48.8819, 2.3686], "Point Ephemere gives the canal a music, terrace, and art-space anchor farther north. It works when the night needs programming or a looser crowd instead of another polished cocktail room.", { price: "$$", priceSource: "Time Out / Google Maps" }),
        nStop("canal-nightlife-comptoir-general", "Le Comptoir General", [48.8727, 2.3638], "Le Comptoir General is the eclectic canal room for groups that want decor, drinks, and a moodier indoor option after the banks get crowded. It is best saved for atmosphere-forward evenings.", { price: "$$", priceSource: "Time Out / Google Maps" }),
      ],
    },
    Nature: {
      title: "Locks, Banks, and East-Side Air",
      description:
        "Canal Saint-Martin's outdoor value is linear: locks, bridges, pocket gardens, and a walk north toward wider water. This guide gives the neighborhood air without pretending it is a park district.",
      stops: [
        nStop("canal-nature-locks", "Canal Saint-Martin Locks", [48.8721, 2.3648], "The Canal Saint-Martin locks are the neighborhood's outdoor spine, turning a simple walk into a sequence of bridges, water, and street corners. Use them between bakery, lunch, and evening drinks.", { photo: photos.canal }),
        nStop("canal-nature-villemin", "Jardin Villemin", [48.8764, 2.3614], "Jardin Villemin gives the canal a practical green pause near Gare de l'Est and the central banks. It is useful for shade, families, or a break from narrow sidewalks.", { photo: photos.nature }),
        nStop("canal-nature-frederic-lemaitre", "Square Frederic-Lemaitre", [48.871, 2.367], "Square Frederic-Lemaitre is a small green stop by the canal and Republique edge, helpful when the route needs a quieter bench between bars and water. It is a pause, not a destination.", { photo: photos.nature }),
        nStop("canal-nature-bassin-villette", "Bassin de la Villette", [48.884, 2.371], "Bassin de la Villette extends the canal walk into wider water, picnic edges, and summer activity. Use it when the route can continue north instead of looping back immediately.", { photo: photos.canal }),
      ],
    },
    Culture: {
      title: "Art Spaces, Courtyards, and Republique Edges",
      description:
        "Canal Saint-Martin culture is informal: music rooms, event spaces, old hospital courtyards, and civic squares. This guide keeps the neighborhood's creative stops tied to the water and evening route.",
      stops: [
        nStop("canal-culture-point-ephemere", "Point Ephemere", [48.8819, 2.3686], "Point Ephemere is the canal's art-and-music anchor, with exhibitions, concerts, and terrace energy beside the water. Check the program before making it the center of the route.", { photo: photos.canal }),
        nStop("canal-culture-comptoir-general", "Le Comptoir General", [48.8727, 2.3638], "Le Comptoir General works as a cultural room as much as a bar, with decor, events, and an atmospheric courtyard feel. Use it for a night that wants setting and social energy.", { photo: photos.nightlife }),
        nStop("canal-culture-hopital-saint-louis", "Hopital Saint-Louis Courtyard", [48.8738, 2.3687], "The Hopital Saint-Louis courtyard is a historic architectural pause close to the canal, useful for travelers who want a quieter layer of the neighborhood. Respect access rules and keep the stop brief.", { photo: photos.culture }),
        nStop("canal-culture-republique", "Place de la Republique", [48.8675, 2.363], "Place de la Republique gives the canal route civic scale and a clear southern meeting point. It works as orientation before moving north toward the locks and bars.", { photo: photos.culture }),
      ],
    },
    Stay: {
      title: "Canal Hotels and Social Bases",
      description:
        "Staying around Canal Saint-Martin is about east-side food, bars, train access, and social energy. This guide mixes canal-facing hotels, design hostels, and practical bases that serve the waterline route.",
      stops: [
        nStop("canal-stay-citizen", "Le Citizen Hotel", [48.8726, 2.3643], "Le Citizen Hotel is the canal-facing boutique stay for travelers who want the water, cafes, and bars directly outside. It is best when the canal is the daily base, not just one evening plan.", { price: "$$", priceSource: "Google Travel / Tripadvisor" }),
        nStop("canal-stay-generator", "Generator Paris", [48.8795, 2.3696], "Generator Paris is the design-hostel option near Canal Saint-Martin, with dorms, private rooms, and social common spaces. It fits budget travelers who value canal access over old-city charm.", { price: "$", priceSource: "Hostelworld / Google Maps" }),
        nStop("canal-stay-providence", "Hotel Providence", [48.8701, 2.3568], "Hotel Providence gives the canal-Republique edge a design-led hotel with strong food and bar access nearby. Use it when the stay should bridge the canal, the 10th, and central Right Bank routes.", { price: "$$$", priceSource: "Conde Nast Traveler / Google Travel" }),
        nStop("canal-stay-st-christophers", "St Christopher's Inn Canal", [48.8868, 2.3756], "St Christopher's Inn Canal is the larger social-hostel base north on the waterline, useful for budget travelers who want dorms, events, and Villette access. It is more canal extension than old-center stay.", { price: "$", priceSource: "Hostelworld / Google Maps" }),
      ],
    },
    Activities: {
      title: "A Waterline Day Into Night",
      description:
        "Canal Saint-Martin activities work as a sequence: bakery, locks, shopping streets, Republique, wider water, and music or drinks. This guide keeps the day linear so the neighborhood feels easy to follow.",
      stops: [
        nStop("canal-activity-bakery-locks", "Bakery and Locks Morning", [48.8721, 2.3648], "A bakery and locks morning starts at Du Pain et des Idees, then follows bridges and water north. It is the easiest way to make the canal feel like a route, not a single photo stop.", { photo: photos.food }),
        nStop("canal-activity-vinaigriers", "Rue des Vinaigriers and Canal Shops", [48.873, 2.362], "Rue des Vinaigriers and the canal shops give the neighborhood a browsing spine with cafes, small retailers, and bars nearby. Use it between brunch and aperitif.", { photo: photos.canal }),
        nStop("canal-activity-republique-canal", "Republique to the Canal", [48.8675, 2.363], "Republique to the canal is the practical southern approach, linking a major square to quieter bridges and water. It works when friends need an easy meeting point before wandering.", { photo: photos.culture }),
        nStop("canal-activity-point-ephemere-night", "Point Ephemere Night", [48.8819, 2.3686], "A Point Ephemere night turns the canal into music, terrace, and late programming. Check the event calendar and build dinner or drinks around the show rather than hoping something is on.", { photo: photos.nightlife }),
      ],
    },
  },
  "7th Arrondissement": {
    Food: {
      title: "Monument-Side Meals With Purpose",
      description:
        "The 7th needs food stops that can stand up to Eiffel, Invalides, Rodin, and Orsay days. This guide balances destination dining, classic bistros, and practical cafes so the district is more than monument logistics.",
      stops: [
        nStop("seventh-food-david-toutain", "David Toutain", [48.8617, 2.3048], "In the 7th, David Toutain is the destination-dining counterweight to monument routes, with highly composed seasonal menus and a serious reservation posture near Invalides and the Eiffel Tower. Plan it as the day's main meal.", { price: "$$$", priceSource: "MICHELIN Guide / David Toutain official" }),
        nStop("seventh-food-arpege", "Arpege", [48.8555, 2.3162], "Arpege is Alain Passard's garden-first fine-dining landmark, where the 7th becomes a serious food destination as much as a monument district. Use it only when the trip has room for a high-budget, high-commitment reservation built around craft and produce.", { price: "$$$", priceSource: "MICHELIN Guide / Google Maps" }),
        nStop("seventh-food-fontaine-mars", "La Fontaine de Mars", [48.8587, 2.3044], "La Fontaine de Mars is the Rue Saint-Dominique classic for cassoulet, duck, steak, and a room that feels properly neighborhood despite the Eiffel-side address. It works when the group wants traditional Paris cooking before or after a monument day.", { price: "$$$", priceSource: "Google Maps / Paris dining guides" }),
        nStop("seventh-food-cafe-varenne", "Cafe Varenne", [48.855, 2.3194], "Cafe Varenne is the practical brasserie near Rodin, Invalides, and government-quarter walks. Use it when the museum day needs a reliable lunch or dinner without a destination-dining commitment.", { price: "$$", priceSource: "Google Maps / local dining guides" }),
      ],
    },
    Nightlife: {
      title: "River Drinks and Polished Nightcaps",
      description:
        "The 7th is not a late-night district, so the best after-dark stops are intentional: river barges, hotel-adjacent bars, rooftops, and polished cafes. This guide keeps evenings close to Eiffel-side routes.",
      stops: [
        nStop("seventh-nightlife-fitzgerald", "Fitzgerald", [48.8572, 2.3078], "Fitzgerald gives the 7th a discreet cocktail-bar format behind a restaurant setting near Rue Saint-Dominique. Use it when the night wants a hidden-room feel without leaving the Eiffel side.", { price: "$$$", priceSource: "Time Out / Google Maps" }),
        nStop("seventh-nightlife-rosa-bonheur", "Rosa Bonheur sur Seine", [48.862, 2.3069], "Rosa Bonheur sur Seine brings the 7th to the river with a barge-party format that works better for groups and warm evenings than quiet cocktails. Check the night and crowd before relying on it.", { price: "$$", priceSource: "Google Maps / local nightlife guides" }),
        nStop("seventh-nightlife-les-ombres", "Les Ombres", [48.861, 2.2978], "Les Ombres is the Eiffel-view rooftop drink and dinner setting above Quai Branly, useful when the night is about scenery and occasion. Book ahead if the view is the point.", { price: "$$$", priceSource: "Google Maps / official venue site" }),
        nStop("seventh-nightlife-recrutement", "Le Recrutement Cafe", [48.8568, 2.304], "Le Recrutement Cafe is the casual Rue Saint-Dominique terrace for a simple drink after Eiffel or Invalides walking. Its value is location, people-watching, and low planning pressure.", { price: "$$", priceSource: "Google Maps / local nightlife guides" }),
      ],
    },
    Nature: {
      title: "Lawns, Gardens, and River Space",
      description:
        "Outdoor time in the 7th should soften monument days: Champ de Mars, Rodin's sculpture garden, Invalides lawns, and Seine edges. This guide gives the district air around its biggest tickets.",
      stops: [
        nStop("seventh-nature-champ-mars", "Champ de Mars", [48.8556, 2.2986], "Champ de Mars is the Eiffel-side lawn and view corridor, useful when the tower needs space around it. Use it early, late, or as a picnic pause rather than a midday crowd trap.", { photo: photos.eiffel }),
        nStop("seventh-nature-invalides", "Esplanade des Invalides", [48.8606, 2.313], "Esplanade des Invalides gives the 7th a broad green axis between the river and the dome. It works as a walking reset between Orsay, Rodin, and Invalides.", { photo: photos.nature }),
        nStop("seventh-nature-rodin-garden", "Musee Rodin Sculpture Garden", [48.8554, 2.3158], "The Musee Rodin sculpture garden is the district's best art-and-air combination, with outdoor works and calmer pacing than larger museums. Use it when culture needs breathing room.", { photo: photos.nature }),
        nStop("seventh-nature-solferino", "Port de Solferino Seine Walk", [48.861, 2.315], "Port de Solferino gives the 7th a river route between Orsay, Invalides, and Eiffel-side bridges. It is the easiest way to keep the day scenic without adding another ticket.", { photo: photos.seine }),
      ],
    },
    Culture: {
      title: "Eiffel-Side Culture With Context",
      description:
        "The 7th needs a guide because its icons can become isolated errands. This route connects the Eiffel Tower with Orsay, Rodin, Quai Branly, Invalides, gardens, and river walks so the district works as a full cultural day.",
      stops: [
        nStop("seventh-culture-eiffel", "Eiffel Tower", [48.8584, 2.2945], "The Eiffel Tower is the unavoidable 7th-arrondissement anchor, but it works best when the ticket, view, and surrounding walk are planned together. Pair it with the river or Champ de Mars.", { photo: photos.eiffel }),
        nStop("seventh-culture-orsay", "Musee d'Orsay", [48.8599, 2.3266], "Musee d'Orsay gives the 7th a museum anchor with enough scale for a half day but less sprawl than the Louvre. It pairs naturally with the Seine, Rodin, and Saint-Germain.", { photo: photos.seine }),
        nStop("seventh-culture-rodin", "Musee Rodin", [48.8554, 2.3158], "Musee Rodin is the district's garden-and-sculpture pause, a calmer stop that can soften a monument-heavy day. Use it between Orsay, Invalides, and Eiffel-side walks.", { photo: photos.nature }),
        nStop("seventh-culture-invalides", "Les Invalides", [48.8566, 2.3126], "Les Invalides anchors the 7th with military history, grand architecture, and Napoleon's tomb. It works well as the middle of a westward day between Rodin, the river, and the Eiffel Tower.", { photo: photos.culture }),
      ],
    },
    Stay: {
      title: "Eiffel-Side Hotels for Quiet Returns",
      description:
        "Staying in the 7th is about calm, monuments, museums, and polished streets rather than late nightlife. This guide focuses on hotels that keep Eiffel, Rodin, Invalides, and Orsay days walkable.",
      stops: [
        nStop("seventh-stay-la-comtesse", "Hotel La Comtesse", [48.8539, 2.3065], "Hotel La Comtesse is the Eiffel-view boutique stay for travelers who want Champ de Mars, Rue Cler, and Invalides close by. It works when view and location outweigh big-hotel amenities.", { price: "$$", priceSource: "Google Travel / Tripadvisor" }),
        nStop("seventh-stay-le-walt", "Hotel Le Walt", [48.8548, 2.3089], "Hotel Le Walt gives the 7th a smaller hotel base near Ecole Militaire and the Eiffel route. Use it when the plan needs quiet returns after museum and monument days.", { price: "$$", priceSource: "Google Travel / Tripadvisor" }),
        nStop("seventh-stay-jk-place", "J.K. Place Paris", [48.8604, 2.3183], "J.K. Place Paris is the design-luxury stay near the Seine, Orsay, and Invalides, with a more intimate mood than palace hotels. It fits travelers who want polish without Right Bank scale.", { price: "$$$", priceSource: "Conde Nast Traveler / Google Travel" }),
        nStop("seventh-stay-montalembert", "Hotel Montalembert", [48.8565, 2.327], "Hotel Montalembert sits on the Saint-Germain edge of the 7th, useful for Orsay, galleries, and Left Bank meals. Choose it when the stay should bridge the 7th and Saint-Germain.", { price: "$$$", priceSource: "Google Travel / Tripadvisor" }),
      ],
    },
    Activities: {
      title: "A Westward Museum and Monument Day",
      description:
        "The 7th works best as a westward route with art, gardens, river views, and one Eiffel-side moment. This guide makes the district feel like a full day rather than separate errands for photos and tickets.",
      stops: [
        nStop("seventh-activity-orsay-rodin-invalides", "Orsay, Rodin, and Invalides", [48.8576, 2.318], "Orsay, Rodin, and Invalides create the strongest cultural route in the 7th, moving from art to sculpture garden to military history. Use it as a slow museum day with outdoor pauses.", { photo: photos.culture }),
        nStop("seventh-activity-eiffel-champ", "Eiffel Tower and Champ de Mars", [48.8584, 2.2945], "Eiffel Tower and Champ de Mars is the classic district activity, but it works best with timing and a plan for the surrounding lawns and streets. Avoid making the tower the only stop.", { photo: photos.eiffel }),
        nStop("seventh-activity-quai-branly-river", "Quai Branly and River Walk", [48.8609, 2.2976], "Quai Branly and the river walk add cultural substance and waterline movement beside the Eiffel Tower. Use it when the area needs more than a view.", { photo: photos.seine }),
        nStop("seventh-activity-rue-cler", "Rue Cler and Rue Saint-Dominique", [48.856, 2.306], "Rue Cler and Rue Saint-Dominique give the 7th a food-shopping and cafe activity between monuments. It is useful for a lighter block before dinner or after Champ de Mars.", { photo: photos.food }),
      ],
    },
  },
};

export const parisNeighborhoodGuides = parisNeighborhoods.flatMap((neighborhood) =>
  neighborhoodCategories.map((category) => {
    const seed = parisNeighborhoodGuideSeeds[neighborhood][category];
    return neighborhoodGuide(
      neighborhood,
      category,
      seed.topic ?? neighborhoodTopics[category],
      seed.stops,
      seed.title,
      seed.description,
      seed.sources ?? neighborhoodSources[category],
    );
  }),
) satisfies MapList[];

export const parisGuides = [
  ...parisCitywideGuides,
  ...parisNeighborhoodGuides,
] satisfies MapList[];
