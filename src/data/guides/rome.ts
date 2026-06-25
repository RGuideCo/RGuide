import type { GuideStop, ListCategory, ListSource, MapList } from "@/types";

const createdAt = "2026-05-07T00:00:00.000Z";

const avatar = (letter: string) =>
  `data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3E${letter}%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20`;

const creators: Record<ListCategory, MapList["creator"]> = {
  Food: { id: "user-rguide-food", name: "R Food", avatar: avatar("R") },
  Nightlife: { id: "user-rguide-nightlife", name: "R Nightlife", avatar: avatar("R") },
  Nature: { id: "user-rguide-nature", name: "R Nature", avatar: avatar("R") },
  Culture: { id: "user-rguide-culture", name: "R Culture", avatar: avatar("R") },
  Stay: { id: "user-rguide-stay", name: "R Stay", avatar: avatar("R") },
  Activities: { id: "user-rguide-activities", name: "R Activities", avatar: avatar("R") },
  Routes: { id: "user-rguide-routes", name: "R Routes", avatar: avatar("R") },
  Essentials: { id: "user-rguide-essentials", name: "R Essentials", avatar: avatar("R") },
};

const commonsFile = (fileName: string) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}`;

const photos = {
  food: commonsFile("Monte_Testaccio.jpg"),
  bar: commonsFile("Trastevere.JPG"),
  hotel: commonsFile("Six_Senses_Rome_(2025).jpg"),
  hostel: "https://ostellobello.com/wp-content/uploads/2021/10/OBR_1x1_Full.jpg",
  street: commonsFile("Villa_Farnesina,_Rome.jpg"),
  park: commonsFile("Orto_botanico_-_ingresso_2704.JPG"),
  colosseum: commonsFile("Colosseo_2020.jpg"),
  pantheon: commonsFile("Pantheon_Rom_1_cropped.jpg"),
  trevi: commonsFile("Trevi_Fountain,_Rome,_Italy_2_-_May_2007.jpg"),
  navona: commonsFile("Piazza_Navona,_Rome.jpg"),
  vatican: commonsFile("St_Peter's_Square,_Vatican_City_-_April_2007.jpg"),
  borghese: commonsFile("Villa_Borghese_in_Rome,_Italy_01.jpg"),
  appia: commonsFile("Appian_Way.jpg"),
  trastevere: commonsFile("Exterior_Santa_Maria_in_Trastevere.jpg"),
  testaccio: commonsFile("Monte_Testaccio.jpg"),
};

const photoByName: Record<string, string> = {
  "30 Formiche": "https://www.30formiche.it/images/background.jpg",
  "Abitart Hotel": "https://www.abitarthotel.com/images/headers/hotel-abitart-roma-hall.jpg",
  "Ai Tre Scalini": "https://www.trescalini.it/wp-content/uploads/2019/01/ristorante-tre-scalini-dal-1946-piazza-navona-28-gallery-40.png",
  "Alberghi Suburbani": "https://caragarbatella.it/wp-content/uploads/2020/03/M-alberghi04-scaled.jpg",
  "Antico Forno Roscioli": "https://www.anticofornoroscioli.it/wp-content/uploads/2024/01/ADL_1782-scaled.jpg",
  "Armando al Pantheon": "https://armandoalpantheon.it/wp-content/uploads/2026/01/copertina-articoli-copia-16-768x440.webp",
  "Aromaticus Monti": "https://static.wixstatic.com/media/52714e_f00c103195284ac0b63ce95cff6d2fa1~mv2.jpg/v1/crop/x_25,y_0,w_1264,h_1752/fill/w_730,h_1012,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/2025_06_Aromaticus_Cheers2925.jpg",
  "Bar del Fico": "https://www.bardelfico.online/wp-content/uploads/2025/01/bar-del-fico-002.jpg",
  "Bar Foschi": "https://scontent-akl1-1.xx.fbcdn.net/v/t39.30808-6/487213531_1129923682422483_4080381822761965826_n.jpg?stp=dst-jpg_tt6&cstp=mx1440x960&ctp=s1440x960&_nc_cat=102&ccb=1-7&_nc_sid=127cfc&_nc_ohc=pgEIzyWfkX4Q7kNvwFAlFrc&_nc_oc=Adr7wcRlFMiXSRl84cfHgqbnHBo495EUKcq4GQwubONzIq_zZjQ2ROHm2VX6cFCxJvKDsKcqTtI3ybvg8qWmuyZH&_nc_zt=23&_nc_ht=scontent-akl1-1.xx&_nc_gid=bnQPa27sch35PextaRp61g&_nc_ss=7b289&oh=00_Af_vxz-3R2OZMQ0tKuoE288KRUgiN8xD0mV8pDuLZZBHtw&oe=6A3ACDB0",
  "Be.Re.": commonsFile("Beer_Flight.jpg"),
  "Bonci Pizzarium": "https://bonci.it/cdn/shop/articles/Pizza-Gabriele-Bonci_c88cd4b0-5a75-43ca-a3cf-2b890b8d2d06.jpg?crop=center&height=937&v=1772791075&width=750",
  "Borgo Ripa Urban Travel": commonsFile("Trastevere.JPG"),
  "Basilica di San Clemente": "https://www.basilicasanclemente.com/wp-content/uploads/2022/09/Basilica-Superiore-interno_San-Clemente.jpg",
  "Basilica Papale San Paolo fuori le Mura": commonsFile("San_Paolo_fuori_le_mura_(cloister)_(2).jpg"),
  "Caffè Propaganda": "https://propagandaitaliancuisine.it/wp-content/uploads/2025/01/propaganda-foto-centrale.jpg",
  "Casa Monti Roma": "https://cdn.prod.website-files.com/65f98c3a9204e23805036d66/6679921c32238d5a8858fffc_casa-monti-ristorante-in-the-heart-of-rome-1.webp",
  "Casetta Rossa": "https://casettarossa.org/wp-content/gallery/forno-pop/forno01.jpg?t=1716977624",
  "Castroni": "http://www.castroni.it/bundles/castroniapp/imgs/home/manifesto1932-xxl.jpg",
  "Castel Sant'Angelo": "https://upload.wikimedia.org/wikipedia/commons/5/51/RomaCastelSantAngelo.jpg",
  "Chapter Roma": "https://www.chapter-roma.com/wp-content/uploads/2022/04/main_sleep.jpg",
  "Charity Café": "http://www.charitycafe.it/immagini/foto-top-ok.jpg",
  "Chorus Café": commonsFile("Cure_cocktail_bar_New_Orleans_2011.jpg"),
  "Colosseum": "https://colosseo.it/sito/wp-content/uploads/2023/05/Colosseo_restauro_30-maggio_veduta-dallalto-600x600.jpg",
  "Comics Guesthouse": commonsFile("St_Peter's_Square,_Vatican_City_-_April_2007.jpg"),
  "Coming Out": "https://www.comingout.it/wp-content/uploads/2025/03/IMG_6433-2-1024x1024.jpg",
  "Crossroad Hotel": "https://www.crossroadhotel.it/wp-content/uploads/2024/03/Crossroad-hotel-roma-hotel-vicino-alla-metro-piramide-zona-ostiense-superior-double-room-1.jpg",
  "Da Enzo al 29": "https://files.supersite.aruba.it/media/24482_3be6498939a5e5b1ec16a2dde4da9c941aefda23.jpeg/v1/w_855,h_0,dpr_2/6a70a984-941c-460c-a4d3-3fba992ab56c.webp",
  "Trattoria Da Cesare al Casaletto": "https://trattoriadacesare.it/wp-content/uploads/2023/06/IMG_0943.jpg",
  "Dar Moschino": "https://scontent-akl1-1.xx.fbcdn.net/v/t51.75761-15/503894968_18504937921030764_7437828569638989773_n.jpg?stp=dst-jpg_tt6&cstp=mx1200x900&ctp=s1200x900&_nc_cat=101&ccb=1-7&_nc_sid=127cfc&_nc_ohc=K9CAgWugyHQQ7kNvwH7TViz&_nc_oc=Adoyhlh6WIwlJaTSP87kUF1X1F6Su6Po39_VoQxMHyHDfH-wwuiJKmIqOb77KHuftnOted7T-LF7reaP-JwBWERe&_nc_zt=23&_nc_ht=scontent-akl1-1.xx&_nc_gid=zzOKip-SraI0Il7FuTjfEw&_nc_ss=7b289&oh=00_Af-NTq0KP_ZyPkkkSKunEjLMUFcz60jo3wktzYxP7fx9cw&oe=6A3AC19C",
  "Domus Aurea": commonsFile("Statue_Domus_Aurea.jpg"),
  "Donna Camilla Savelli": "https://scontent-akl1-1.xx.fbcdn.net/v/t1.6435-9/180740825_4096770993719978_5832935320563150616_n.jpg?stp=dst-jpg_tt6&cstp=mx1080x1080&ctp=s1080x1080&_nc_cat=105&ccb=1-7&_nc_sid=127cfc&_nc_ohc=PXr79NNoynAQ7kNvwEF6oal&_nc_oc=Ado_PIjIvpwoRFABNCnRrkMAx4-w67bXFEkneSllRnyO9ReosT4pGmAiNf2icKcg9onCOXljaQtgjdca2rV_tn58&_nc_zt=23&_nc_ht=scontent-akl1-1.xx&_nc_gid=d5CLN2jAq4rAD32uF10Xsg&_nc_ss=7b289&oh=00_Af-aFW7DEaGkAHFckhdfYtKh2hKQMTbi7hTlnoUL97mdvw&oe=6A603970",
  "Enoteca Ferrara": commonsFile("Wine_glasses_on_a_table_.jpg"),
  "Fatamorgana Monti": commonsFile("Gelato_artigianale_italiano,_Bertinelli.jpg"),
  "Felice a Testaccio": "https://feliceatestaccio.com/wp-content/uploads/2025/03/carbonara.webp",
  "Flavio al Velavevodetto": "https://www.ristorantevelavevodetto.it/wp-content/uploads/2025/03/velavevodetto-testaccio-img-icona.png",
  "Free Hostels Roma": commonsFile("Basilica_Papale_di_Santa_Maria_Maggiore_02.jpg"),
  "Freni e Frizioni": commonsFile("Aperol_Spritz_2014.jpg"),
  "Galleria Borghese": commonsFile("Roma,_galleria_borghese,_galleria_degli_imperatori_02.jpg"),
  "Generator Rome": "https://staygenerator.com/web/media/widget-spaces-rooms/rome/rooms-photos/generator-rome-hostel-deluxe-king-bed-1.jpg?mode=max&quality=100&v=202209061428",
  "Hostaria Isidoro": "https://www.hostariaisidoro.com/wp-content/uploads/2023/01/IMG_4930-1080x720.jpg",
  "Hotel Caravel": "https://www.hotelcaravel.it/sites/default/files/1.jpeg",
  "Hotel de Russie": "https://www.roccofortehotels.com/media/dhyeohjs/rfh-hotel-de-russie-le-jardin-de-russie-7122-jg-aug-17.jpg",
  "Hotel Lancelot": photos.colosseum,
  "Hotel Re Testa": commonsFile("Monte_Testaccio.jpg"),
  "Hotel San Anselmo": "https://www.aventinohotels.com/data/2560/IMG--2212--Hotel-San-Anselmo-Roma.jpg",
  "Hotel Santa Maria": "https://www.hotelsantamariatrastevere.it/images/room-in-8-0.jpg",
  "Hotel Vilòn": "https://hotelvilon.com/wp-content/themes/startup_pro/inc/php-global/s-image/index.php?img=/var/www/vhosts/hotelvilon.com/httpdocs/wp-content/uploads//DSC_5352bm.jpg&mod=3&w=1500",
  "Il Sorpasso": "https://www.refile.eu/mir/wp-content/uploads/2025/10/foto-piatto.jpg",
  "Janiculum Hill": commonsFile("Trastevere.JPG"),
  "JO&JOE Roma": commonsFile("Trevi_Fountain,_Rome,_Italy_2_-_May_2007.jpg"),
  "L'Alibi": "https://alibiclubroma.com/_next/image?url=%2Fapi%2Fgallery%2Ffile%2F209.jpg&w=3840&q=75",
  "La Mescita": "https://scontent-akl1-1.xx.fbcdn.net/v/t39.30808-6/495213524_1777949856373008_5148580737106261095_n.jpg?stp=dst-jpg_tt6&cstp=mx1367x2048&ctp=s1367x2048&_nc_cat=100&ccb=1-7&_nc_sid=86c6b0&_nc_ohc=FGFO5S7kUYoQ7kNvwFaIgQG&_nc_oc=AdoUGoxzvt67BzZGEx1XdiYAFUhlWpN9m408ZZGUhjRoSJ1OeDVsG1cxmsNA17bjqAnhXGbLJviSLuAgoHVTtYLy&_nc_zt=23&_nc_ht=scontent-akl1-1.xx&_nc_gid=zP7dygDPlAjHHUeB-74alg&_nc_ss=7b289&oh=00_Af-rynk3NPU71LuispviXDv4NJ74LWMeUssfvJX6rYKE4Q&oe=6A3C0445",
  "Le Méridien Visconti Rome": commonsFile("Palazzo_di_Giustizia_(Rome).jpg"),
  "Li Rioni": "https://lirioni.it/wp-content/uploads/2016/10/3212090110033393.jpg",
  "MACRO Mattatoio": "https://upload.wikimedia.org/wikipedia/commons/a/a0/Roma_Testaccio_Ex_Mattatoio.jpg",
  "Mama Shelter Roma": "https://mama-shelter.twic.pics/sites/28/2021/05/Mama-Rome-Jour-1-8856_FA-1.jpg?twic=v1/focus=auto/cover=1150x1223",
  "Mercure Roma Centro Colosseo": photos.colosseum,
  "Monte Testaccio": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRBpP7xZarLnKhSij-X08vBMjotQCsgQvoVNRa9I9ajijhDgEb8zioLZk&s=10",
  "Mordi e Vai": "https://goop-img.com/cdn-cgi/image/height=1350,width=1800,fit=crop,gravity=0.5x0.5,quality=95,format=auto,onerror=redirect,metadata=copyright/wp-content/uploads/2017/08/Morti-Vai-rome-guide.jpg",
  "Museo di Roma in Trastevere": commonsFile("Trastevere.JPG"),
  "New Generation Hostel Rome Center": commonsFile("Basilica_Papale_di_Santa_Maria_Maggiore_02.jpg"),
  "Non-Catholic Cemetery for Foreigners": commonsFile("Cimitero_Acattolico_Roma.jpg"),
  "Orto Botanico di Roma": "https://ortobotanicodiroma.it/wp-content/uploads/2026/03/orto-1.jpg",
  "Ostello Bello Roma Colosseo": "https://ostellobello.com/wp-content/uploads/2021/10/Ostello-Bello-Roma-Rooftop3_redux-550x550.jpg",
  "Palazzo delle Esposizioni": commonsFile("Palazzo_delle_Esposizioni.jpg"),
  "Palazzo Manfredi": "https://www.manfredihotels.com/wp-content/uploads/2021/05/Living-Room-2-Grand-View-Colosseum-Suite-scaled.jpg",
  "Pantheon": "https://direzionemuseiroma.cultura.gov.it/wp-content/uploads/2023/05/pantheon@144x-100-scaled.jpg",
  "Pasticceria Linari": "https://pasticcerialinari.com/wp-content/uploads/2019/01/31.jpg",
  "Piazza Navona": "https://www.turismoroma.it/sites/default/files/Piazza%20Navona_0.jpg",
  "Porta San Paolo": commonsFile("Porta_San_Paolo_(Rome).jpg"),
  "Proloco Trastevere": "https://i0.wp.com/prolocotrastevere.com/wp-content/uploads/2024/05/foto-tagliata.jpeg?w=6355&ssl=1",
  "Ristoro degli Angeli": "https://static.wixstatic.com/media/52714e_945f2b3b06ec4456b54792afd79e46a0~mv2.jpg/v1/fill/w_978,h_1052,al_c,q_85,enc_avif,quality_auto/52714e_945f2b3b06ec4456b54792afd79e46a0~mv2.jpg",
  "Roma Scout Center": commonsFile("Basilica_Papale_di_Santa_Maria_Maggiore_02.jpg"),
  "Roman Forum and Palatine Hill": commonsFile("Foro_Romano_Musei_Capitolini_Roma.jpg"),
  "Romanè": "https://www.armareviacipro61.it/wp-content/uploads/2024/11/armare-gusto.jpg",
  "Roscioli Salumeria con Cucina": commonsFile("Spaghetti_carbonara_(34560017766).jpg"),
  "Salotto 42": "https://salotto42.it/assets/for_gallery/gallery_n_%20(3).jpg",
  "Sandy Hostel": commonsFile("Roma_-_via_Panisperna_-_01.jpg"),
  "Sant'Eustachio Il Caffè": "https://caffesanteustachio.com/wp-content/uploads/2021/03/slider_2019_3.jpg?id=7553",
  "Santo Stefano Rotondo": commonsFile("Santo_Stefano_Rotondo_-_interno.jpg"),
  "SantoPalato": "https://www.santopalatoroma.it/wp-content/uploads/2022/11/home_1.jpg",
  "Seu Pizza Illuminati": "https://www.seupizza.com/wp-content/uploads/2025/04/ADL_6754.jpg",
  "Shamrock Irish Pub Colosseum": "https://scontent-akl1-1.xx.fbcdn.net/v/t51.82787-15/718674493_18474707818098942_8617916998908928931_n.jpg?stp=dst-jpg_tt6&cstp=mx2000x2500&ctp=s2000x2500&_nc_cat=103&ccb=1-7&_nc_sid=127cfc&_nc_ohc=o1FpJIq7jV4Q7kNvwErHg4p&_nc_oc=AdrYzvJ0G6V_UUbV_KSGjA9y83iTcJYedJJW7sqZ3O_O98gK2gBhNPebIVSTMQr06oARemayCWSZOeV6hBdEkv6j&_nc_zt=23&_nc_ht=scontent-akl1-1.xx&_nc_gid=_S37YoGl6KJTJuNhXZerBA&_nc_ss=7b289&oh=00_Af-dKs7i5Armg0Ia_3Rqt9cBm5bkVClI1YZSUJ030XBBcQ&oe=6A3BF898",
  "St. Peter's Basilica": "https://www.basilicasanpietro.va/uploads/entra_in_basilica_new_1ca1d189f4.jpg",
  "Teatro Palladium": "https://www.turismoroma.it/sites/default/files/Teatro%20Palladium.jpg",
  "The Fifteen Keys Hotel": commonsFile("Roma_-_via_Panisperna_-_01.jpg"),
  "The Jerry Thomas Speakeasy": commonsFile("Cure_cocktail_bar_New_Orleans_2011.jpg"),
  "The RomeHello Hostel": "https://www.theromehello.com/static/ed648e1bceba001ca773a00678525a2b/double-private_accomodations_the-romehello_rome_02.webp",
  "Tram Depot": "https://scontent-akl1-1.cdninstagram.com/v/t39.30808-6/524763256_1164224379075516_2748072359765119700_n.jpg?stp=dst-jpg_e35_p640x640_sh2.08_tt6&_nc_ht=scontent-akl1-1.cdninstagram.com&_nc_cat=100&_nc_oc=Q6cZ2gHqSjBCfxZvDHHajKHVRudMKBvlVfR4GvDOCC8Sf9z-xZNJR8Ty4rSNpotLgancGiQHSR4qdrvzr5GWGhtHP45s&_nc_ohc=q7Rid9e5bCAQ7kNvwHioIEG&_nc_gid=tTWCkIuSV7iaTiF8kVMHoQ&edm=AOQ1c0wAAAAA&ccb=7-5&oh=00_Af8pm2qVzLdBvd78K49CixagcgrhzLxnwG8u2mxM3qsSrw&oe=6A3BE49E&_nc_sid=8b3546",
  "Trattoria Luzzi": "https://www.trattorialuzzi.it/wp-content/uploads/2017/03/3.jpg",
  "UNAHOTELS Trastevere Roma": commonsFile("Trastevere.JPG"),
  "Urbana 47": "https://urbana47.com/wp-content/uploads/slider/cache/3abf3f8d77ae859d753def7b2617f18d/slider1.jpg",
  "Vatican Museums": commonsFile("0_Cortile_della_Pigna_-_Vatican.JPG"),
  "Villa Farnesina": "https://www.villafarnesina.it/wp-content/uploads/2025/07/villa_farnesina_la_loggia_amore_psiche_1920_1080-1.jpg",
  "Vinile": "https://www.vinileroma.it/wp-content/uploads/2015/07/CPK6751.jpg",
  "YellowSquare Rome": "https://yellowsquare.com/rome/wp-content/uploads/sites/2/2023/12/1-2-scaled-1.webp",
  "Zia Restaurant": "https://scontent-akl1-1.cdninstagram.com/v/t51.2885-19/461946907_1971114083313166_6068832539548617600_n.jpg?stp=dst-jpg_s320x320_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLmRqYW5nby42OTIuYzIifQ&_nc_ht=scontent-akl1-1.cdninstagram.com&_nc_cat=110&_nc_oc=Q6cZ2gHhHM7q-odsMrKLsEEgTPd8E2wZMrV4oouXE2qdH7-e10-xXIwC5TRvaSjL1gZY-gM3dyll5GBpwFyWeaiILf64&_nc_ohc=mB1nE4_lmysQ7kNvwEP9DWK&_nc_gid=FsuAhJUVQpcW6eEi8vE01g&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_Af8IVlHkSjluUqyMIaihAufu4Yas6RFGYe9C2SVk_6_zlg&oe=6A3AD556&_nc_sid=8b3546",
};

const googleMaps: ListSource = { name: "Google Maps", url: "https://maps.google.com" };
const checkedAt = "2026-06-17";

const mapsUrl = (name: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} Rome Italy`)}`;

const officialSearchUrl = (name: string) =>
  `https://www.google.com/search?q=${encodeURIComponent(`${name} Rome official site`)}`;

const uniqueUrls = (urls: Array<string | undefined>) => [...new Set(urls.filter(Boolean) as string[])];
const uniqueSources = (sources: ListSource[]) => {
  const seen = new Set<string>();
  return sources.filter((source) => {
    if (seen.has(source.url)) return false;
    seen.add(source.url);
    return true;
  });
};

const officialByName: Record<string, string> = {
  "30 Formiche": "https://www.30formiche.it/",
  "Abitart Hotel": "https://www.abitarthotel.com/",
  "Ai Tre Scalini": "https://www.aitrescalini.org/",
  "Antico Forno Roscioli": "https://www.anticofornoroscioli.it/",
  "Armando al Pantheon": "https://www.armandoalpantheon.it/",
  "Bar del Fico": "https://www.bardelfico.com/",
  "Be.Re.": "https://www.beeroma.it/",
  "Bonci Pizzarium": "https://bonci.it/",
  "Borgo Ripa Urban Travel": "https://www.borgoripa.com/",
  "Basilica di San Clemente": "https://basilicasanclemente.com/",
  "Caffè Propaganda": "https://www.caffepropaganda.it/",
  "Casa Monti Roma": "https://www.casamontiroma.com/",
  "Castel Sant'Angelo": "https://www.castelsantangelo.com/",
  "Chapter Roma": "https://www.chapter-roma.com/",
  "Chorus Café": "https://www.choruscafe.it/",
  "Colosseum": "https://colosseo.it/en/",
  "Comics Guesthouse": "https://www.comicsguesthouse.it/",
  "Coming Out": "https://comingout.it/",
  "Da Enzo al 29": "https://www.daenzoal29.com/",
  "Donna Camilla Savelli": "https://www.vretreats.com/donna-camilla-savelli/",
  "Freni e Frizioni": "https://www.freniefrizioni.com/",
  "Flavio al Velavevodetto": "https://www.flavioalvelavevodetto.it/",
  "Free Hostels Roma": "https://freehostels.com/rome/",
  "Galleria Borghese": "https://galleriaborghese.beniculturali.it/en/",
  "Galleria Doria Pamphilj": "https://www.doriapamphilj.it/roma/",
  "Generator Rome": "https://staygenerator.com/hostels/rome",
  "Giardino degli Aranci": "https://www.turismoroma.it/en/places/orange-garden",
  "Hotel San Anselmo": "https://www.aventinohotels.com/hotel-san-anselmo-rome/",
  "Hotel de Russie": "https://www.roccofortehotels.com/hotels-and-resorts/hotel-de-russie/",
  "Hotel Santa Maria": "https://www.htlsantamaria.com/",
  "Hotel Vilòn": "https://hotelvilon.com/",
  "JO&JOE Roma": "https://www.joandjoe.com/rome/en/",
  "Janiculum Hill": "https://www.turismoroma.it/en/places/gianicolo",
  "Ma Che Siete Venuti a Fà": "https://www.football-pub.com/",
  "Mama Shelter Roma": "https://mamashelter.com/rome/",
  "Mordi e Vai": "https://www.mordievai.it/",
  "Orto Botanico di Roma": "https://web.uniroma1.it/ortobotanico/",
  "Ostello Bello Roma Colosseo": "https://ostellobello.com/en/hostel/rome-colosseo/",
  "Palazzo Manfredi": "https://www.manfredihotels.com/palazzo-manfredi/",
  "Pantheon": "https://pantheon.cultura.gov.it/",
  "Parco degli Acquedotti": "https://www.parcoappiaantica.it/luoghi/parco-degli-acquedotti/",
  "Parco della Caffarella": "https://www.parcoappiaantica.it/luoghi/caffarella/",
  "Pincio Terrace": "https://www.turismoroma.it/en/places/pincio",
  "Roman Forum and Palatine Hill": "https://colosseo.it/en/area/roman-forum/",
  "Roma Scout Center": "https://www.romascoutcenter.it/",
  "Roscioli Salumeria con Cucina": "https://www.roscioli.com/restaurant/",
  "Salotto 42": "https://www.salotto42.it/",
  "SantoPalato": "https://santopalato.com/",
  "Seu Pizza Illuminati": "https://www.seupizzailuminati.it/",
  "Six Senses Rome": "https://www.sixsenses.com/en/hotels/rome/",
  "St. Peter's Basilica": "https://www.basilicasanpietro.va/en.html",
  "The Jerry Thomas Speakeasy": "https://thejerrythomasproject.it/",
  "The RomeHello Hostel": "https://www.theromehello.com/",
  "Tiber Island": "https://www.turismoroma.it/en/places/tiber-island",
  "Tram Depot": "https://www.tramdepot.it/",
  "Trattoria Da Cesare al Casaletto": "https://www.trattoriadacesare.it/",
  "Vatican Museums": "https://www.museivaticani.va/content/museivaticani/en.html",
  "Via Appia Antica": "https://www.parcoappiaantica.it/",
  "Villa Borghese": "https://www.turismoroma.it/en/places/villa-borghese",
  "Villa Doria Pamphilj": "https://www.turismoroma.it/en/places/villa-doria-pamphilj",
  "Villa Farnesina": "https://www.villafarnesina.it/en/",
  "YellowSquare Rome": "https://yellowsquare.com/rome/",
};

const romeFoodSources: ListSource[] = [
  { name: "Roscioli official", url: "https://www.roscioli.com/restaurant/" },
  { name: "Da Enzo al 29 official", url: "https://www.daenzoal29.com/" },
  { name: "Felice a Testaccio official", url: "https://feliceatestaccio.com/" },
  { name: "Bonci official", url: "https://bonci.it/" },
  { name: "MICHELIN Guide - Rome restaurants", url: "https://guide.michelin.com/us/en/lazio/roma/restaurants" },
  { name: "Eater - Best Restaurants in Rome", url: "https://www.eater.com/maps/best-restaurants-rome-italy" },
  { name: "The Infatuation - Rome guides", url: "https://www.theinfatuation.com/rome/guides" },
  { name: "Romeing - Rome restaurants", url: "https://www.romeing.it/best-restaurants-rome/" },
  { name: "Time Out - Rome restaurants", url: "https://www.timeout.com/rome/restaurants" },
  googleMaps,
];
const romeCultureSources: ListSource[] = [
  { name: "Parco archeologico del Colosseo", url: "https://colosseo.it/en/" },
  { name: "Pantheon official", url: "https://pantheon.cultura.gov.it/" },
  { name: "Vatican Museums", url: "https://www.museivaticani.va/content/museivaticani/en.html" },
  { name: "Galleria Borghese official", url: "https://galleriaborghese.beniculturali.it/en/" },
  { name: "Castel Sant'Angelo official", url: "https://www.castelsantangelo.com/" },
  { name: "Villa Farnesina official", url: "https://www.villafarnesina.it/en/" },
  { name: "Turismo Roma", url: "https://www.turismoroma.it/en" },
  { name: "Lonely Planet - Rome attractions", url: "https://www.lonelyplanet.com/italy/rome/attractions" },
  { name: "Time Out - Things to do in Rome", url: "https://www.timeout.com/rome/things-to-do" },
  googleMaps,
];
const romeStaySources: ListSource[] = [
  { name: "Six Senses Rome official", url: "https://www.sixsenses.com/en/hotels/rome/" },
  { name: "Hotel Vilòn official", url: "https://hotelvilon.com/" },
  { name: "Hotel Santa Maria official", url: "https://www.htlsantamaria.com/" },
  { name: "Condé Nast Traveler - Best hotels in Rome", url: "https://www.cntraveler.com/gallery/best-hotels-in-rome" },
  { name: "Time Out - Best hotels in Rome", url: "https://www.timeout.com/rome/hotels" },
  { name: "Booking.com - Rome", url: "https://www.booking.com/city/it/rome.html" },
  { name: "Tripadvisor - Rome hotels", url: "https://www.tripadvisor.com/Hotels-g187791-Rome_Lazio-Hotels.html" },
  { name: "Hostelworld - Rome hostels", url: "https://www.hostelworld.com/hostels/Rome" },
  { name: "The RomeHello official", url: "https://www.theromehello.com/" },
  { name: "Ostello Bello Rome official", url: "https://ostellobello.com/en/hostel/rome-colosseo/" },
  googleMaps,
];
const romeHostelSources: ListSource[] = [
  { name: "Hostelworld - Rome hostels", url: "https://www.hostelworld.com/hostels/Rome" },
  { name: "The RomeHello official", url: "https://www.theromehello.com/" },
  { name: "YellowSquare Rome official", url: "https://yellowsquare.com/rome/" },
  { name: "Ostello Bello Rome official", url: "https://ostellobello.com/en/hostel/rome-colosseo/" },
  { name: "JO&JOE Roma official", url: "https://www.joandjoe.com/rome/en/" },
  { name: "Generator Rome official", url: "https://staygenerator.com/hostels/rome" },
  { name: "Booking.com - Rome", url: "https://www.booking.com/city/it/rome.html" },
  { name: "Tripadvisor - Rome hotels", url: "https://www.tripadvisor.com/Hotels-g187791-Rome_Lazio-Hotels.html" },
  { name: "Time Out - Best hotels in Rome", url: "https://www.timeout.com/rome/hotels" },
  googleMaps,
];
const romeNightlifeSources: ListSource[] = [
  { name: "Freni e Frizioni official", url: "https://www.freniefrizioni.com/" },
  { name: "Jerry Thomas Speakeasy official", url: "https://thejerrythomasproject.it/" },
  { name: "Salotto 42 official", url: "https://www.salotto42.it/" },
  { name: "Tram Depot official", url: "https://www.tramdepot.it/" },
  { name: "The Infatuation - Best Wine Bars in Rome", url: "https://www.theinfatuation.com/rome/guides/best-wine-bars-rome" },
  { name: "Romeing - Best bars in Rome", url: "https://www.romeing.it/best-bars-rome/" },
  { name: "Time Out - Rome bars", url: "https://www.timeout.com/rome/bars" },
  { name: "Resident Advisor - Rome events", url: "https://ra.co/events/it/rome" },
  { name: "Wanted in Rome - Rome nightlife", url: "https://www.wantedinrome.com/whatson/nightlife" },
  googleMaps,
];
const romeNatureSources: ListSource[] = [
  { name: "Villa Borghese - Turismo Roma", url: "https://www.turismoroma.it/en/places/villa-borghese" },
  { name: "Villa Doria Pamphilj - Turismo Roma", url: "https://www.turismoroma.it/en/places/villa-doria-pamphilj" },
  { name: "Parco degli Acquedotti official park page", url: "https://www.parcoappiaantica.it/luoghi/parco-degli-acquedotti/" },
  { name: "Caffarella official park page", url: "https://www.parcoappiaantica.it/luoghi/caffarella/" },
  { name: "Tiber Island - Turismo Roma", url: "https://www.turismoroma.it/en/places/tiber-island" },
  { name: "Pincio - Turismo Roma", url: "https://www.turismoroma.it/en/places/pincio" },
  { name: "Parco Archeologico dell'Appia Antica", url: "https://www.parcoappiaantica.it/" },
  { name: "Turismo Roma - Parks and villas", url: "https://www.turismoroma.it/en/places/villas-and-historic-parks" },
  { name: "Time Out - Things to do in Rome", url: "https://www.timeout.com/rome/things-to-do" },
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
  category: ListCategory;
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

function defaultHours(category: ListCategory): GuideStop["hours"] {
  if (category === "Stay") {
    return { default: "Front desk, check-in, and room-access details are posted on the official property page or booking page for the selected stay date." };
  }
  if (category === "Food") {
    return { default: "Service windows are posted on the official site or Google Maps schedule for the selected meal date." };
  }
  if (category === "Nightlife") {
    return { default: "Evening opening windows are posted on the official site, event calendar, or Google Maps schedule for the selected date." };
  }
  return { default: "Opening windows and timed-ticket rules are posted on the official site or booking page for the selected visit date." };
}

function defaultPhoto(category: ListCategory) {
  if (category === "Food") return photos.food;
  if (category === "Nightlife") return photos.bar;
  if (category === "Stay") return photos.hotel;
  if (category === "Nature") return photos.park;
  return photos.street;
}

function normalizePhotoUrl(url: string) {
  const commonsPrefix = "https://upload.wikimedia.org/wikipedia/commons/";

  if (!url.startsWith(commonsPrefix)) {
    return url;
  }

  const path = url.slice(commonsPrefix.length).split("?")[0];
  const fileName = decodeURIComponent(path.split("/").at(-1) ?? path);
  return commonsFile(fileName);
}

function inferFoodServiceType(seed: StopSeed): GuideStop["foodServiceType"] {
  const text = `${seed.id} ${seed.name}`.toLowerCase();
  if (text.includes("forno") || text.includes("pasticceria")) return "bakery";
  if (text.includes("pizzarium") || text.includes("mordi")) return "counter_service";
  if (text.includes("caffè") || text.includes("cafe") || text.includes("caff")) return "cafe";
  return "restaurant";
}

function inferNightlifeType(seed: StopSeed): GuideStop["nightlifeType"] {
  const text = `${seed.id} ${seed.name}`.toLowerCase();
  if (text.includes("jerry") || text.includes("salotto") || text.includes("blackmarket") || text.includes("chorus") || text.includes("tram") || text.includes("propaganda")) return "cocktail_bar";
  if (text.includes("be.re") || text.includes("ma che") || text.includes("shamrock")) return "beer_bar";
  if (text.includes("enoteca") || text.includes("sorpasso") || text.includes("scalini") || text.includes("mescita")) return "wine_bar";
  if (text.includes("alibi")) return "club";
  if (text.includes("charity") || text.includes("vinile") || text.includes("30 formiche")) return "live_music_venue";
  if (text.includes("coming out")) return "pub";
  return "cocktail_bar";
}

function inferLodgingType(seed: StopSeed): GuideStop["lodgingType"] {
  const text = `${seed.id} ${seed.name}`.toLowerCase();
  if (
    text.includes("hostel") ||
    text.includes("ostello") ||
    text.includes("generator") ||
    text.includes("yellowsquare") ||
    text.includes("jo&joe") ||
    text.includes("borgo ripa") ||
    text.includes("roma scout") ||
    text.includes("comics") ||
    text.includes("sandy")
  ) {
    return "hostel";
  }
  return "hotel";
}

function classificationDefaults(seed: StopSeed, category: ListCategory): Partial<GuideStop> {
  if (category === "Food") {
    return {
      venueKind: "food_drink",
      foodServiceType: inferFoodServiceType(seed),
      cuisineTypes: ["roman", "italian"],
      attributeTags: ["local_favorite", "roman_food"],
    };
  }
  if (category === "Nightlife") {
    return {
      venueKind: "nightlife",
      nightlifeType: inferNightlifeType(seed),
      attributeTags: ["drinks", "evening"],
      price: "$$",
      priceSource: "Google Maps / venue pages",
    };
  }
  if (category === "Stay") {
    const lodgingType = inferLodgingType(seed);
    return {
      venueKind: "lodging",
      lodgingType,
      attributeTags: lodgingType === "hostel" ? ["budget", "social"] : ["central", "design"],
      price: seed.price ?? (lodgingType === "hostel" ? "$" : "$$"),
      priceSource: seed.priceSource ?? "Booking.com / Google Travel",
    };
  }
  if (category === "Nature") {
    return {
      venueKind: "outdoors",
      attributeTags: ["outdoors", "walking"],
    };
  }
  if (category === "Culture") {
    return {
      venueKind: "culture",
      attributeTags: ["history", "museum"],
    };
  }
  if (category === "Activities") {
    return {
      venueKind: seed.venueKind ?? "landmark",
      attributeTags: ["essential", "route_anchor"],
    };
  }
  return {};
}

function stop(seed: StopSeed, category: ListCategory): GuideStop {
  const photo = photoByName[seed.name] ?? seed.photo ?? defaultPhoto(category);
  const officialUrl = seed.officialUrl ?? seed.bookingUrl ?? seed.sourceEvidence?.officialUrl ?? officialByName[seed.name] ?? officialSearchUrl(seed.name);
  const mapUrl = seed.sourceEvidence?.mapUrl ?? mapsUrl(seed.name);
  const imageSourceUrl = seed.imageSourceUrl ?? seed.sourceEvidence?.imageSourceUrl ?? normalizePhotoUrl(photo);

  return {
    ...classificationDefaults(seed, category),
    ...seed,
    photo: normalizePhotoUrl(photo),
    hours: seed.hours ?? defaultHours(category),
    officialUrl,
    imageSourceUrl,
    sourceUrls: uniqueUrls([...(seed.sourceUrls ?? []), officialUrl, mapUrl, imageSourceUrl]),
    sourceEvidence: {
      ...seed.sourceEvidence,
      officialUrl,
      mapUrl,
      imageSourceUrl,
      checkedAt,
    },
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
      city: "Rome",
      neighborhood: seed.neighborhood,
      country: "Italy",
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
  category: ListCategory,
  topic: string,
  stops: StopSeed[],
  title: string,
  description: string,
  sources: ListSource[],
  seoSlug = category === "Food"
    ? "best-restaurants"
    : category === "Nightlife"
      ? "best-bars"
      : category === "Culture"
        ? "best-culture"
        : "best-things-to-do",
) {
  const neighborhoodSlug = slugify(neighborhood);
  const topicSlug = slugify(topic);
  return guide({
    id: `list-rome-${neighborhoodSlug}-${topicSlug}`,
    slug: `rome-${neighborhoodSlug}-${topicSlug}`,
    seoSlug,
    seoTitle: `Best ${topic} in ${neighborhood}, Rome`,
    seoDescription: `Best ${topic.toLowerCase()} in ${neighborhood}, Rome, selected for neighborhood fit, current source support, and useful saved-map routing.`,
    title,
    description,
    url: `https://www.google.com/maps/search/${encodeURIComponent(`${neighborhood} ${topic} Rome`)}`,
    category,
    neighborhood,
    stops,
    sources,
  });
}

function stayGuide(
  neighborhood: string | undefined,
  kind: "Hotels" | "Hostels",
  stops: StopSeed[],
  title: string,
  description: string,
) {
  const areaSlug = neighborhood ? slugify(neighborhood) : "citywide";
  const kindSlug = kind.toLowerCase();
  return guide({
    id: `list-rome-${areaSlug}-${kindSlug}`,
    slug: neighborhood ? `rome-${areaSlug}-${kindSlug.toLowerCase()}` : `rome-best-${kindSlug.toLowerCase()}`,
    seoSlug: kind === "Hotels" ? "best-hotels" : "best-hostels",
    seoTitle: neighborhood ? `Best ${kind} in ${neighborhood}, Rome` : `Best ${kind} in Rome`,
    seoDescription: neighborhood
      ? `Best ${kind.toLowerCase()} in ${neighborhood}, Rome, with source-backed picks for location, sleep style, room type, and value.`
      : `Best ${kind.toLowerCase()} in Rome, comparing neighborhood bases, traveler style, room type, and booking fit.`,
    title,
    description,
    url: `https://www.google.com/maps/search/${encodeURIComponent(`${neighborhood ? `${neighborhood} ` : ""}${kind} Rome`)}`,
    category: "Stay",
    neighborhood,
    stops,
    sources: kind === "Hostels" ? romeHostelSources : romeStaySources,
  });
}

const citywideFood: StopSeed[] = [
  {
    id: "rome-citywide-roscioli",
    name: "Roscioli Salumeria con Cucina",
    coordinates: [41.8956, 12.4745],
    description: "Roscioli is the Centro Storico food anchor because it compresses deli, wine cellar, and restaurant into one Roman reservation. The draw is the product-driven Roman meal: salumi, cheese, carbonara, amatriciana, and a wine list that makes the room feel half-shop and half-ritual. Use it when you want a planned, high-energy central dinner; it is not the right choice for a quiet, lingering table.",
    price: "$$$",
    priceSource: "Eater / The Infatuation",
    hours: {
      default: "Daily 12:30 PM-3:30 PM, 7:00 PM-11:30 PM; shop hours differ.",
      mon: "12:30 PM-3:30 PM, 7:00 PM-11:30 PM",
      tue: "12:30 PM-3:30 PM, 7:00 PM-11:30 PM",
      wed: "12:30 PM-3:30 PM, 7:00 PM-11:30 PM",
      thu: "12:30 PM-3:30 PM, 7:00 PM-11:30 PM",
      fri: "12:30 PM-3:30 PM, 7:00 PM-11:30 PM",
      sat: "12:30 PM-3:30 PM, 7:00 PM-11:30 PM",
      sun: "12:30 PM-3:30 PM, 7:00 PM-11:30 PM",
    },
    photo: undefined,
  },
  {
    id: "rome-citywide-da-enzo",
    name: "Da Enzo al 29",
    coordinates: [41.8897, 12.4746],
    description: "Da Enzo is the Trastevere trattoria benchmark: small room, Roman classics, and demand that is part of the experience. Save it for pastas, artichokes, and a dinner that feels tied to the neighborhood rather than polished for convenience.",
    price: "$$",
    priceSource: "Eater / The Infatuation",
    hours: {
      default: "Monday-Saturday 12:00 PM-3:00 PM, 6:30 PM-10:30 PM; Sunday closed.",
      mon: "12:00 PM-3:00 PM, 6:30 PM-10:30 PM",
      tue: "12:00 PM-3:00 PM, 6:30 PM-10:30 PM",
      wed: "12:00 PM-3:00 PM, 6:30 PM-10:30 PM",
      thu: "12:00 PM-3:00 PM, 6:30 PM-10:30 PM",
      fri: "12:00 PM-3:00 PM, 6:30 PM-10:30 PM",
      sat: "12:00 PM-3:00 PM, 6:30 PM-10:30 PM",
      sun: "Closed",
    },
    photo: undefined,
  },
  {
    id: "rome-citywide-armando",
    name: "Armando al Pantheon",
    coordinates: [41.8986, 12.4768],
    description: "Armando al Pantheon is the rare central Rome restaurant that still feels food-led this close to a major landmark. The draw is classic Roman cooking within steps of the Pantheon, with gricia, lamb, and seasonal plates handled with confidence.",
    price: "$$",
    priceSource: "Eater / Time Out",
    hours: {
      default: "Monday-Friday 12:30 PM-3:00 PM, 6:00 PM-11:00 PM; Saturday lunch only; Sunday closed.",
      mon: "12:30 PM-3:00 PM, 6:00 PM-11:00 PM",
      tue: "12:30 PM-3:00 PM, 6:00 PM-11:00 PM",
      wed: "12:30 PM-3:00 PM, 6:00 PM-11:00 PM",
      thu: "12:30 PM-3:00 PM, 6:00 PM-11:00 PM",
      fri: "12:30 PM-3:00 PM, 6:00 PM-11:00 PM",
      sat: "12:30 PM-3:00 PM",
      sun: "Closed",
    },
    photo: undefined,
  },
  {
    id: "rome-citywide-santopalato",
    name: "SantoPalato",
    coordinates: [41.8817, 12.5092],
    description: "SantoPalato is the modern trattoria pick because it updates Roman tradition without sanding off the city’s offal-and-fifth-quarter backbone. Chef Sarah Cicolini’s cooking makes old-school dishes feel current, generous, and specific to Rome rather than generic Italian comfort food. Reserve ahead and go when the group is open to richer, more characterful plates.",
    price: "$$$",
    priceSource: "Eater / Time Out / MICHELIN Guide",
    hours: {
      default: "Tuesday-Friday 12:30 PM-2:45 PM, 7:30 PM-11:30 PM; Saturday-Sunday 12:30 PM-3:30 PM, 7:30 PM-11:30 PM; Monday closed.",
      mon: "Closed",
      tue: "12:30 PM-2:45 PM, 7:30 PM-11:30 PM",
      wed: "12:30 PM-2:45 PM, 7:30 PM-11:30 PM",
      thu: "12:30 PM-2:45 PM, 7:30 PM-11:30 PM",
      fri: "12:30 PM-2:45 PM, 7:30 PM-11:30 PM",
      sat: "12:30 PM-3:30 PM, 7:30 PM-11:30 PM",
      sun: "12:30 PM-3:30 PM, 7:30 PM-11:30 PM",
    },
    photo: undefined,
  },
  {
    id: "rome-citywide-da-cesare",
    name: "Trattoria Da Cesare al Casaletto",
    coordinates: [41.8737, 12.4312],
    description: "Da Cesare al Casaletto is a beloved neighborhood trattoria for fritti, Roman pastas, and a patio meal that feels local without being sleepy. It belongs in the citywide set because the cooking is confident, generous, and useful for a classic Roman dinner away from the densest center.",
    price: "$$",
    priceSource: "Eater / The Infatuation",
    hours: {
      default: "Sunday-Tuesday and Thursday-Saturday 12:30 PM-3:00 PM, 7:30 PM-11:00 PM; Wednesday closed.",
      mon: "12:30 PM-3:00 PM, 7:30 PM-11:00 PM",
      tue: "12:30 PM-3:00 PM, 7:30 PM-11:00 PM",
      wed: "Closed",
      thu: "12:30 PM-3:00 PM, 7:30 PM-11:00 PM",
      fri: "12:30 PM-3:00 PM, 7:30 PM-11:00 PM",
      sat: "12:30 PM-3:00 PM, 7:30 PM-11:00 PM",
      sun: "12:30 PM-3:00 PM, 7:30 PM-11:00 PM",
    },
    photo: undefined,
  },
  {
    id: "rome-citywide-felice",
    name: "Felice a Testaccio",
    coordinates: [41.8767, 12.4751],
    description: "Felice a Testaccio replaces the broader Testaccio slot because it is the classic cacio e pepe institution most travelers can understand and plan around. The appeal is not subtlety: it is a polished old-school room, tableside pasta theater, and a direct connection to Testaccio’s Roman-food identity. Reserve it for a traditional meal when the group wants the famous version rather than the quietest neighborhood discovery.",
    price: "$$",
    priceSource: "Time Out / Eater",
    hours: {
      default: "Daily 12:30 PM-3:30 PM, 7:00 PM-11:30 PM.",
      mon: "12:30 PM-3:30 PM, 7:00 PM-11:30 PM",
      tue: "12:30 PM-3:30 PM, 7:00 PM-11:30 PM",
      wed: "12:30 PM-3:30 PM, 7:00 PM-11:30 PM",
      thu: "12:30 PM-3:30 PM, 7:00 PM-11:30 PM",
      fri: "12:30 PM-3:30 PM, 7:00 PM-11:30 PM",
      sat: "12:30 PM-3:30 PM, 7:00 PM-11:30 PM",
      sun: "12:30 PM-3:30 PM, 7:00 PM-11:30 PM",
    },
    photo: undefined,
  },
  {
    id: "rome-citywide-bonci-pizzarium",
    name: "Bonci Pizzarium",
    coordinates: [41.9084, 12.4452],
    description: "Bonci Pizzarium is the Vatican-side slice stop that deserves citywide status because it turns a museum day into a serious food day without requiring a long lunch. The counter format keeps it practical, while the dough, seasonal toppings, and constant turnover make it more than a convenience stop.",
    price: "$$",
    priceSource: "Eater / The Infatuation / Google Maps",
    hours: {
      default: "Monday-Saturday 11:00 AM-9:00 PM; Sunday closed.",
      mon: "11:00 AM-9:00 PM",
      tue: "11:00 AM-9:00 PM",
      wed: "11:00 AM-9:00 PM",
      thu: "11:00 AM-9:00 PM",
      fri: "11:00 AM-9:00 PM",
      sat: "11:00 AM-9:00 PM",
      sun: "Closed",
    },
  },
  {
    id: "rome-citywide-flavio",
    name: "Flavio al Velavevodetto",
    coordinates: [41.8765, 12.4765],
    description: "Flavio al Velavevodetto is a Testaccio classic built into Monte Testaccio, with Roman pastas, seasonal specials, and the neighborhood's food history baked into the setting. Use it for a traditional meal that feels more rooted than theatrical.",
    price: "$$",
    priceSource: "Eater / MICHELIN Guide / Google Maps",
    hours: {
      default: "Daily 12:30 PM-3:00 PM, 7:30 PM-11:00 PM.",
      mon: "12:30 PM-3:00 PM, 7:30 PM-11:00 PM",
      tue: "12:30 PM-3:00 PM, 7:30 PM-11:00 PM",
      wed: "12:30 PM-3:00 PM, 7:30 PM-11:00 PM",
      thu: "12:30 PM-3:00 PM, 7:30 PM-11:00 PM",
      fri: "12:30 PM-3:00 PM, 7:30 PM-11:00 PM",
      sat: "12:30 PM-3:00 PM, 7:30 PM-11:00 PM",
      sun: "12:30 PM-3:00 PM, 7:30 PM-11:00 PM",
    },
  },
  {
    id: "rome-citywide-mordi-e-vai",
    name: "Mordi e Vai",
    coordinates: [41.8772, 12.4756],
    description: "Mordi e Vai gives the citywide restaurant guide a daytime Testaccio Market counter instead of another reservation dinner. The draw is Roman stewed-meat sandwiches, market rhythm, and a cheap meal that still says something specific about the neighborhood's working-food identity.",
    price: "$",
    priceSource: "Eater / Google Maps",
    hours: {
      default: "Monday-Saturday 8:00 AM-3:00 PM; Sunday closed.",
      mon: "8:00 AM-3:00 PM",
      tue: "8:00 AM-3:00 PM",
      wed: "8:00 AM-3:00 PM",
      thu: "8:00 AM-3:00 PM",
      fri: "8:00 AM-3:00 PM",
      sat: "8:00 AM-3:00 PM",
      sun: "Closed",
    },
  },
  {
    id: "rome-citywide-seu-pizza",
    name: "Seu Pizza Illuminati",
    coordinates: [41.8847, 12.4727],
    description: "Seu Pizza Illuminati is the modern pizza counterweight to Rome's trattoria-heavy restaurant map. The draw is precise dough, creative toppings, and a contemporary Trastevere room that works when dinner should feel current without becoming formal.",
    price: "$$",
    priceSource: "Eater / The Infatuation / Google Maps",
    hours: {
      default: "Tuesday-Sunday 7:00 PM-11:30 PM; Monday closed.",
      mon: "Closed",
      tue: "7:00 PM-11:30 PM",
      wed: "7:00 PM-11:30 PM",
      thu: "7:00 PM-11:30 PM",
      fri: "7:00 PM-11:30 PM",
      sat: "7:00 PM-11:30 PM",
      sun: "7:00 PM-11:30 PM",
    },
  },
];

const citywideCafeFood: StopSeed[] = [
  {
    id: "rome-citywide-cafe-santeustachio",
    name: "Sant'Eustachio Il Caffè",
    coordinates: [41.8989, 12.4742],
    description: "Sant'Eustachio is the classic central espresso stop near the Pantheon. Treat it as a fast Roman bar ritual rather than a long cafe sit, especially when the morning route needs a recognizable anchor.",
    price: "$",
    priceSource: "Time Out / Google Maps",
    hours: { default: "Daytime coffee hours vary by season; confirm current opening times before going." },
  },
  {
    id: "rome-citywide-cafe-forno-roscioli",
    name: "Antico Forno Roscioli",
    coordinates: [41.8957, 12.4743],
    description: "Antico Forno Roscioli is the bakery stop for pizza bianca, pastries, and picnic supplies in the historic core. It is useful when the day needs a quick bite before Campo, Navona, or a longer lunch reservation.",
    price: "$",
    priceSource: "The Infatuation / Google Maps",
    hours: { default: "Bakery hours vary; confirm current opening times before going." },
  },
  {
    id: "rome-citywide-cafe-linari",
    name: "Pasticceria Linari",
    coordinates: [41.8778, 12.4784],
    description: "Linari gives Testaccio a real morning stop: coffee, pastries, and neighborhood pace before the market or a food-led walk. It keeps the citywide food set from being only restaurants and dinner plans.",
    price: "$",
    priceSource: "Google Maps / local editorial guides",
    hours: { default: "Morning and daytime hours vary; confirm current opening times before going." },
  },
  {
    id: "rome-citywide-cafe-castroni",
    name: "Castroni",
    coordinates: [41.9101, 12.4646],
    description: "Castroni is the Prati pantry-and-coffee institution, useful for espresso, packaged gifts, and a reset after Vatican logistics. It works best as a daytime utility stop, not a destination meal.",
    price: "$",
    priceSource: "Google Maps / local editorial guides",
    hours: { default: "Shop and coffee hours vary; confirm current opening times before going." },
  },
  {
    id: "rome-citywide-cafe-fatamorgana",
    name: "Fatamorgana Monti",
    coordinates: [41.8958, 12.4917],
    description: "Fatamorgana is the gelato stop that makes a Monti or Colosseum day feel less meal-heavy. Save it for a midday reset or after-dinner walk when the route needs a small, specific treat.",
    price: "$",
    priceSource: "The Infatuation / Google Maps",
    hours: { default: "Gelato hours vary by location and season; confirm current opening times before going." },
  },
  {
    id: "rome-citywide-cafe-propaganda",
    name: "Caffè Propaganda",
    coordinates: [41.8894, 12.4951],
    description: "Caffe Propaganda is the polished cafe-to-dessert pause near the Colosseum. Use it when the ancient-site route needs a seated break with more atmosphere than a quick bar counter.",
    price: "$$",
    priceSource: "Time Out / Google Maps",
    hours: { default: "Cafe, food, and evening hours vary; confirm current opening times before going." },
  },
];

const citywideCulture: StopSeed[] = [
  {
    id: "rome-citywide-colosseum",
    name: "Colosseum",
    coordinates: [41.8902, 12.4922],
    description: "The Colosseum is the ancient-city anchor because it gives Rome's imperial scale a physical center. The experience is strongest when the ticket and timing connect it to the Forum, Palatine, or Celio churches rather than isolating it as a single photo stop. Start early or late, book the right entry type, and leave slack for security lines so the route does not become crowd management.",
    photo: photos.colosseum,
  },
  {
    id: "rome-citywide-pantheon",
    name: "Pantheon",
    coordinates: [41.8986, 12.4769],
    description: "The Pantheon makes the Centro Storico's layers legible in one building: Roman engineering, church continuity, piazza life, and intense visitor pressure. The oculus and dome are the obvious draw, but the real value is how quickly the stop explains the historic core around it. It is short enough to fit between food stops, but important enough to plan around timed entry, crowds, and nearby routes.",
    photo: photos.pantheon,
  },
  {
    id: "rome-citywide-vatican-museums",
    name: "Vatican Museums",
    coordinates: [41.9065, 12.4536],
    description: "The Vatican Museums are the Prati-side heavyweight because they can overwhelm the rest of a Rome day if treated casually. The experience is a long sequence of galleries, papal collections, and Sistine Chapel crowd flow rather than a simple museum pop-in. Use them as a timed, energy-aware block, then plan food or a park reset instead of stacking more major sights immediately after.",
    photo: photos.vatican,
  },
  {
    id: "rome-citywide-galleria-borghese",
    name: "Galleria Borghese",
    coordinates: [41.9142, 12.4922],
    description: "Galleria Borghese earns its citywide place because the timed-entry format turns a major museum into a focused two-hour experience. The collection gives you Bernini, Caravaggio, and villa-scale rooms without the sprawl of larger museums. Reserve ahead and pair it with Villa Borghese so the day has both art intensity and park air.",
    photo: photos.borghese,
  },
  {
    id: "rome-citywide-doria-pamphilj",
    name: "Galleria Doria Pamphilj",
    coordinates: [41.8976, 12.4813],
    description: "Doria Pamphilj gives central Rome an indoor palace-and-painting stop that can rescue a hot, wet, or overpacked day. The draw is the private-palace setting, dense picture galleries, and a sense of aristocratic Rome that contrasts with the piazza crowds outside. Use it when the route already runs between the Pantheon, Trevi, and Piazza Venezia and needs one calmer interior.",
    photo: "https://upload.wikimedia.org/wikipedia/commons/4/45/Ceiling_in_Galleria_Doria_Pamphilj_%28Rome%29.jpg",
  },
  {
    id: "rome-citywide-roman-forum-palatine",
    name: "Roman Forum and Palatine Hill",
    coordinates: [41.8925, 12.4853],
    description: "The Roman Forum and Palatine Hill turn the Colosseum from spectacle into city history. The value is the ground-level context: temples, basilicas, imperial approaches, elite houses, and enough walking to make ancient Rome feel like an urban system rather than one arena.",
    hours: {
      default: "Daily 9:00 AM-7:15 PM in peak season; last admission follows the official timed-ticket calendar.",
    },
    photo: photos.colosseum,
  },
  {
    id: "rome-citywide-san-clemente",
    name: "Basilica di San Clemente",
    coordinates: [41.8894, 12.4975],
    description: "San Clemente is the layered-Rome stop that makes Celio worth more than a Colosseum orbit. The church drops from medieval basilica to early Christian rooms to Roman archaeology, giving travelers a physical cross-section of the city in one compact visit.",
    hours: {
      default: "Monday-Saturday 9:00 AM-12:30 PM, 3:00 PM-6:00 PM; Sunday 12:00 PM-6:00 PM.",
      mon: "9:00 AM-12:30 PM, 3:00 PM-6:00 PM",
      tue: "9:00 AM-12:30 PM, 3:00 PM-6:00 PM",
      wed: "9:00 AM-12:30 PM, 3:00 PM-6:00 PM",
      thu: "9:00 AM-12:30 PM, 3:00 PM-6:00 PM",
      fri: "9:00 AM-12:30 PM, 3:00 PM-6:00 PM",
      sat: "9:00 AM-12:30 PM, 3:00 PM-6:00 PM",
      sun: "12:00 PM-6:00 PM",
    },
    photo: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Basilica_di_San_Clemente_al_Laterano_-_Rome.jpg",
  },
  {
    id: "rome-citywide-st-peters",
    name: "St. Peter's Basilica",
    coordinates: [41.9022, 12.4539],
    description: "St. Peter's Basilica gives the Rome culture guide its church at maximum scale: Bernini's piazza, Michelangelo's dome, papal ceremony, and interior grandeur that can swallow an hour without trying. Treat security and crowd flow as part of the stop, especially if pairing it with the Vatican Museums.",
    hours: {
      default: "Daily 7:00 AM-7:10 PM in summer; dome, treasury, and liturgical access keep separate schedules.",
      mon: "7:00 AM-7:10 PM",
      tue: "7:00 AM-7:10 PM",
      wed: "7:00 AM-7:10 PM",
      thu: "7:00 AM-7:10 PM",
      fri: "7:00 AM-7:10 PM",
      sat: "7:00 AM-7:10 PM",
      sun: "7:00 AM-7:10 PM",
    },
    photo: photos.vatican,
  },
  {
    id: "rome-citywide-castel-santangelo",
    name: "Castel Sant'Angelo",
    coordinates: [41.9031, 12.4663],
    description: "Castel Sant'Angelo connects imperial mausoleum, papal fortress, prison, museum, and river-view terrace in a way few Rome stops can. It belongs in the citywide culture set because it works as both history and route hinge between Prati, the Vatican, and Centro Storico.",
    hours: {
      default: "Tuesday-Sunday 9:00 AM-7:30 PM; Monday closed.",
      mon: "Closed",
      tue: "9:00 AM-7:30 PM",
      wed: "9:00 AM-7:30 PM",
      thu: "9:00 AM-7:30 PM",
      fri: "9:00 AM-7:30 PM",
      sat: "9:00 AM-7:30 PM",
      sun: "9:00 AM-7:30 PM",
    },
    photo: commonsFile("Castel_Sant'Angelo_from_bridge.jpg"),
  },
  {
    id: "rome-citywide-villa-farnesina",
    name: "Villa Farnesina",
    coordinates: [41.8935, 12.4674],
    description: "Villa Farnesina adds a quieter Renaissance counterweight to Rome's ancient and Vatican-heavy culture circuit. The draw is Raphael frescoes, a villa-scale visit, and Trastevere placement that lets the route shift from art into gardens, river walks, or dinner.",
    hours: {
      default: "Monday-Saturday 9:00 AM-2:00 PM; second Sunday of the month 9:00 AM-5:00 PM; other Sundays closed.",
      mon: "9:00 AM-2:00 PM",
      tue: "9:00 AM-2:00 PM",
      wed: "9:00 AM-2:00 PM",
      thu: "9:00 AM-2:00 PM",
      fri: "9:00 AM-2:00 PM",
      sat: "9:00 AM-2:00 PM",
      sun: "Second Sunday 9:00 AM-5:00 PM; other Sundays closed",
    },
    photo: commonsFile("Villa_Farnesina,_Rome.jpg"),
  },
];

const citywideNature: StopSeed[] = [
  {
    id: "rome-nature-villa-borghese",
    name: "Villa Borghese",
    coordinates: [41.9142, 12.4863],
    description: "Villa Borghese is Rome's easiest central reset because it gives dense sightseeing days a large, shaded release valve. The experience can be as simple as lake paths and terraces or as structured as a Galleria Borghese booking and museum route. Use it between Centro Storico and Parioli, or after a heavy art block when the day needs air instead of another church.",
    photo: photos.borghese,
  },
  {
    id: "rome-nature-appian-way",
    name: "Via Appia Antica",
    coordinates: [41.8466, 12.5167],
    description: "The Appian Way is the nature-and-history escape that still feels unmistakably Roman. The draw is the long road rhythm: ruins, cypresses, catacomb routes, aqueduct views, and bikeable stretches of ancient stone. Bring it into a longer day when you want Rome to open outward; it is less useful as a rushed add-on between central sights.",
    photo: photos.appia,
  },
  {
    id: "rome-nature-janiculum",
    name: "Janiculum Hill",
    coordinates: [41.8919, 12.4617],
    description: "Janiculum Hill gives Trastevere a view-led walk instead of letting the neighborhood be only dinner and bars. The reward is a broad city panorama, leafy approaches, and a route that can connect Villa Farnesina, the Botanical Garden, or upper Trastevere. Go early or near sunset, and treat the climb as part of the plan rather than a quick detour.",
    photo: photos.trastevere,
  },
  {
    id: "rome-nature-orange-garden",
    name: "Giardino degli Aranci",
    coordinates: [41.8851, 12.4786],
    description: "The Orange Garden is the compact Aventine viewpoint that belongs in a Rome nature guide because it solves a common route problem. It gives travelers a quiet terrace, shade, and a clean city view between Testaccio, the river, and the historic core. Use it as a short reset before dinner or after a market walk, not as a standalone cross-town destination.",
    photo: "https://upload.wikimedia.org/wikipedia/commons/8/8f/Dal_giardino_degli_aranci_-_tutta_roma.JPG",
  },
  {
    id: "rome-nature-botanical-garden",
    name: "Orto Botanico di Roma",
    coordinates: [41.8933, 12.4664],
    description: "Rome's Botanical Garden is the Trastevere green-space choice when the city needs shade, water, and slower paths. The experience is quieter than the famous villas, with plant collections and hillside edges that feel removed from nearby bar lanes. It is most useful as decompression before an evening in Trastevere or after Villa Farnesina.",
    photo: "https://upload.wikimedia.org/wikipedia/commons/2/28/Orto_botanico_-_ingresso_2704.JPG",
  },
  {
    id: "rome-nature-parco-acquedotti",
    name: "Parco degli Acquedotti",
    coordinates: [41.8469, 12.5615],
    description: "Parco degli Acquedotti is the open-sky Rome walk where ancient infrastructure becomes landscape rather than museum object. The aqueduct lines, grass, neighborhood joggers, and late-day light make it one of the best ways to feel the city breathe outside the center.",
    hours: {
      default: "Daily dawn-dusk public park access; official Appia Antica park pages govern route and event access.",
    },
    photo: "https://upload.wikimedia.org/wikipedia/commons/7/77/Parco_degli_Acquedotti_Roma.jpg",
  },
  {
    id: "rome-nature-villa-doria-pamphilj",
    name: "Villa Doria Pamphilj",
    coordinates: [41.8872, 12.4486],
    description: "Villa Doria Pamphilj gives west Rome the big green reset: long paths, lawns, umbrella pines, villa views, and enough space to disappear from the old-city press for a while. It belongs here when Villa Borghese feels too central and the day needs a real park block.",
    hours: {
      default: "Daily 7:00 AM-sunset; gates and internal facilities follow official municipal park notices.",
    },
    photo: "https://upload.wikimedia.org/wikipedia/commons/b/b3/Villa_Doria_Pamphilj_in_Rom.jpg",
  },
  {
    id: "rome-nature-caffarella",
    name: "Parco della Caffarella",
    coordinates: [41.8586, 12.5256],
    description: "Parco della Caffarella extends the Appian Way idea into a softer valley walk of fields, ruins, sheep, springs, and local weekend rhythms. It is best for travelers who want ancient texture without turning the outing into only ticketed monuments.",
    hours: {
      default: "Daily dawn-dusk public park access; official Appia Antica park pages govern seasonal route notices.",
    },
    photo: "https://upload.wikimedia.org/wikipedia/commons/7/74/Tomb_of_Annia_regilla2.JPG",
  },
  {
    id: "rome-nature-pincio",
    name: "Pincio Terrace",
    coordinates: [41.9116, 12.4793],
    description: "Pincio Terrace is the quick scenic hinge between Piazza del Popolo and Villa Borghese. It earns a citywide walks slot because the climb is short, the view is immediate, and the route can continue into park paths instead of ending at a lookout.",
    hours: {
      default: "Daily public terrace access; Villa Borghese paths and nearby facilities follow municipal park notices.",
    },
    photo: "https://upload.wikimedia.org/wikipedia/commons/6/6d/Terrazza_del_Pincio_%2846397854832%29.jpg",
  },
  {
    id: "rome-nature-tiber-island",
    name: "Tiber Island",
    coordinates: [41.8914, 12.4784],
    description: "Tiber Island is a compact river-walk stop that links the Jewish Ghetto, Trastevere, and the bridges without pretending to be a full park. Use it for geography, water, and a small pause when the historic center starts to feel all stone and traffic.",
    hours: {
      default: "Daily public-island and bridge access; venues, hospital areas, and seasonal river events keep separate schedules.",
    },
    photo: "https://upload.wikimedia.org/wikipedia/commons/a/a4/Isola_Tiberina%2C_Rome_%2824824736817%29.jpg",
  },
];

const hotelStops = {
  city: [
    { id: "rome-hotel-six-senses", name: "Six Senses Rome", coordinates: [41.8988, 12.4825], description: "Six Senses Rome is the citywide luxury pick for travelers who want central access without giving up spa depth. The appeal is a polished historic building, wellness facilities, and immediate reach to the Pantheon/Trevi axis, which can make short high-end trips feel calmer. Book it when recovery time and design matter as much as sightseeing proximity; it is priced for travelers who will use the property, not just the bed.", price: "$$$", priceSource: "Condé Nast Traveler / Google Travel", photo: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Six_Senses_Rome_%282025%29.jpg" },
    { id: "rome-hotel-de-russie", name: "Hotel de Russie", coordinates: [41.9101, 12.4764], description: "Hotel de Russie works as the polished north-center classic because it offers garden calm where Rome usually gives you street pressure. The location near Piazza del Popolo supports Villa Borghese, shopping, and central walks without sleeping inside the densest old-city lanes. It suits travelers who want service, quiet, and a softer landing after long days.", price: "$$$", priceSource: "Condé Nast Traveler / Tripadvisor", photo: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Six_Senses_Rome_%282025%29.jpg" },
    { id: "rome-hotel-vilon", name: "Hotel Vilòn", coordinates: [41.9048, 12.4772], description: "Hotel Vilon is the boutique Centro/Spagna choice for travelers who want high design at a smaller scale. The appeal is the palace-adjacent setting, polished rooms, and a location that supports shopping, museums, and late central dinners without feeling like a generic chain. It is best for couples or design-minded travelers who value mood over big-hotel amenities.", price: "$$$", priceSource: "Condé Nast Traveler / Google Travel", photo: undefined },
    { id: "rome-hotel-santa-maria", name: "Hotel Santa Maria", coordinates: [41.8886, 12.4719], description: "Hotel Santa Maria is the Trastevere value-charmer because it gives the neighborhood a courtyard sleep base instead of only late-night street energy. The draw is simple comfort, greenery, and immediate access to dinner and bar routes. Choose it when you want atmosphere and quiet more than a grand lobby or full-service luxury.", price: "$$", priceSource: "Time Out / Booking.com", photo: undefined },
    { id: "rome-hotel-chapter", name: "Chapter Roma", coordinates: [41.8939, 12.4772], description: "Chapter Roma adds a sharper central hotel option near Campo de' Fiori, the Jewish Ghetto, and late food routes. It belongs in the citywide guide because the rooms and public spaces feel contemporary without pushing travelers into the luxury-spa tier.", price: "$$$", priceSource: "Time Out / Booking.com", photo: undefined },
    { id: "rome-hotel-palazzo-manfredi", name: "Palazzo Manfredi", coordinates: [41.8908, 12.4954], description: "Palazzo Manfredi is the Colosseum-view splurge for travelers who want the ancient-city fantasy built into the stay itself. It is not the value move, but it gives the shortlist a clear landmark-hotel choice for a high-budget first Rome trip.", price: "$$$", priceSource: "Condé Nast Traveler / Google Travel", photo: "https://www.manfredihotels.com/wp-content/uploads/2021/02/Manfredi-Collection_Palazzo-Manfredi_Roma-1.jpg" },
    { id: "rome-hotel-casa-monti", name: "Casa Monti Roma", coordinates: [41.8946, 12.4913], description: "Casa Monti Roma gives the citywide hotel list a stylish neighborhood base near ruins, cafes, and independent shops. Choose it when the brief is Monti texture and design-forward rooms rather than a classic grand hotel or deep Trastevere stay.", price: "$$$", priceSource: "Condé Nast Traveler / Google Travel", photo: "https://cdn.prod.website-files.com/65f98c3a9204e23805036d44/65fd65932040ded502e963c1_Cover%20(1).png" },
    { id: "rome-hotel-mama-shelter", name: "Mama Shelter Roma", coordinates: [41.9088, 12.4448], description: "Mama Shelter Roma adds a Vatican-side hotel that feels playful and practical rather than reverent. The draw is design, food on site, metro access, and a base that works for Prati days without paying old-city luxury prices.", price: "$$", priceSource: "Time Out / Booking.com", photo: undefined },
    { id: "rome-hotel-san-anselmo", name: "Hotel San Anselmo", coordinates: [41.8823, 12.4805], description: "Hotel San Anselmo gives the shortlist a romantic Aventine option above Testaccio. It is best when the trip wants quiet, garden atmosphere, characterful rooms, and quick access to food neighborhoods rather than immediate Pantheon-and-Trevi convenience.", price: "$$", priceSource: "Time Out / Booking.com", photo: undefined },
    { id: "rome-hotel-donna-camilla", name: "Donna Camilla Savelli", coordinates: [41.8866, 12.4662], description: "Donna Camilla Savelli brings monastery architecture, terraces, and a calmer upper-Trastevere position into the citywide hotel comparison. It works for travelers who want the neighborhood nearby but do not want to sleep directly on the loudest bar lanes.", price: "$$$", priceSource: "Condé Nast Traveler / Google Travel", photo: undefined },
  ],
  centro: [
    { id: "centro-hotel-six-senses", name: "Six Senses Rome", coordinates: [41.8988, 12.4825], description: "Six Senses Rome is the splurge stay for travelers who want spa-level recovery inside the dense historic center. It makes sense when the trip is built around walking to the Pantheon, Trevi, and polished central restaurants.", price: "$$$", priceSource: "Condé Nast Traveler / Google Travel", photo: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Six_Senses_Rome_%282025%29.jpg" },
    { id: "centro-hotel-vilon", name: "Hotel Vilòn", coordinates: [41.9048, 12.4772], description: "Hotel Vilòn gives Centro Storico a quieter boutique option near the fashion and palace corridor. It is best for couples or design-minded travelers who want central access without a big-hotel mood.", price: "$$$", priceSource: "Condé Nast Traveler / Tripadvisor", photo: undefined },
    { id: "centro-hotel-chapter", name: "Chapter Roma", coordinates: [41.8939, 12.4772], description: "Chapter Roma is the sharper, design-forward central pick near Campo de' Fiori and the Jewish Ghetto. Use it when nightlife, food routes, and contemporary rooms matter more than old-world formality.", price: "$$$", priceSource: "Time Out / Booking.com", photo: undefined },
  ],
  trastevere: [
    { id: "trastevere-hotel-santa-maria", name: "Hotel Santa Maria", coordinates: [41.8886, 12.4719], description: "Hotel Santa Maria is the easy Trastevere hotel pick because its courtyard setting softens the neighborhood's late-night energy. It is best for travelers who want restaurants nearby but still need a calm sleep base.", price: "$$", priceSource: "Time Out / Booking.com", photo: undefined },
    { id: "trastevere-donna-camilla", name: "Donna Camilla Savelli", coordinates: [41.8866, 12.4662], description: "Donna Camilla Savelli brings monastery architecture, terraces, and a quieter upper-Trastevere position. It suits travelers who want atmosphere and views without being directly on the busiest bar lanes.", price: "$$$", priceSource: "Condé Nast Traveler / Google Travel", photo: undefined },
    { id: "trastevere-unahotels", name: "UNAHOTELS Trastevere Roma", coordinates: [41.8847, 12.4695], description: "UNAHOTELS Trastevere is the more contemporary neighborhood option, useful for reliable rooms, easy taxi logistics, and access to Testaccio or the river as much as Trastevere itself. UNAHOTELS Trastevere Roma's value is the sleep tradeoff: location, room style, price posture, and how easily the stay supports the surrounding route. Confirm UNAHOTELS Trastevere Roma's current room type, check-in details, and transit fit before booking.", price: "$$", priceSource: "Booking.com / Google Travel", photo: undefined },
  ],
  monti: [
    { id: "monti-casa-monti", name: "Casa Monti Roma", coordinates: [41.8946, 12.4913], description: "Casa Monti is the stylish new-school Monti hotel, good for travelers who want artful rooms, Colosseum proximity, and a neighborhood feel rather than a formal landmark hotel. Casa Monti Roma's value is the sleep tradeoff: location, room style, price posture, and how easily the stay supports the surrounding route. Confirm Casa Monti Roma's current room type, check-in details, and transit fit before booking.", price: "$$$", priceSource: "Condé Nast Traveler / Google Travel", photo: "https://cdn.prod.website-files.com/65f98c3a9204e23805036d44/65fd65932040ded502e963c1_Cover%20(1).png" },
    { id: "monti-fifteen-keys", name: "The Fifteen Keys Hotel", coordinates: [41.897, 12.494], description: "The Fifteen Keys is a small boutique base that fits Monti's independent-shop and cafe rhythm. It is best for travelers who value quieter scale and easy walking to Termini, Colosseum, and central lanes.", price: "$$", priceSource: "Booking.com / Tripadvisor", photo: undefined },
    { id: "monti-nerva", name: "Nerva Boutique Hotel", coordinates: [41.8934, 12.4868], description: "Nerva Boutique Hotel works for travelers who want ancient-site access without sleeping in a mega-property. The location is practical for the Forum, Monti dinners, and first-time Rome logistics.", price: "$$", priceSource: "Google Travel / Tripadvisor", photo: "https://www.hotelnerva.com/data/1024/hotel-nerva34.jpg" },
  ],
  testaccio: [
    { id: "testaccio-hotel-san-anselmo", name: "Hotel San Anselmo", coordinates: [41.8823, 12.4805], description: "Hotel San Anselmo sits just above Testaccio on the Aventine, making it the romantic quiet-base pick for food-led travelers. It works when dinner is in Testaccio but sleep needs garden calm.", price: "$$", priceSource: "Time Out / Booking.com", photo: undefined },
    { id: "testaccio-abitart", name: "Abitart Hotel", coordinates: [41.8756, 12.4819], description: "Abitart Hotel is the practical Ostiense/Testaccio base, useful for travelers who want train/metro access, food neighborhoods, and less historic-center pressure. Abitart Hotel's value is the sleep tradeoff: location, room style, price posture, and how easily the stay supports the surrounding route. Confirm Abitart Hotel's current room type, check-in details, and transit fit before booking.", price: "$$", priceSource: "Booking.com / Google Travel", photo: undefined },
    { id: "testaccio-hotel-re-testa", name: "Hotel Re Testa", coordinates: [41.876, 12.4746], description: "Hotel Re Testa is a functional neighborhood stay for travelers prioritizing Testaccio's market, trattorias, and nightlife over postcard scenery. It is more about location and value than luxury.", price: "$$", priceSource: "Booking.com / Google Travel", photo: undefined },
  ],
  prati: [
    { id: "prati-mama-shelter", name: "Mama Shelter Roma", coordinates: [41.9088, 12.4448], description: "Mama Shelter Roma is the playful Vatican-adjacent hotel for travelers who want design, food on-site, and metro access. It is especially useful when Prati is a base rather than just a museum stop.", price: "$$", priceSource: "Time Out / Booking.com", photo: undefined },
    { id: "prati-le-meridien", name: "Le Méridien Visconti Rome", coordinates: [41.9081, 12.4695], description: "Le Meridien Visconti is the polished Prati business-leisure pick, with river access, Vatican reach, and a calmer grid than the old city. It works for travelers who want reliability over romance.", price: "$$$", priceSource: "Google Travel / Tripadvisor", photo: undefined },
    { id: "prati-atlante-star", name: "Atlante Star Hotel", coordinates: [41.9045, 12.4622], description: "Atlante Star is included for Vatican proximity and rooftop-view appeal. It is best for visitors who want St. Peter's access and a classic hotel setup without staying deep in Centro Storico.", price: "$$", priceSource: "Booking.com / Tripadvisor", photo: "https://www.atlantehotels.com/wp-content/uploads/2025/04/home-atlante-star.jpg" },
  ],
  garbatella: [
    { id: "garbatella-hotel-caravel", name: "Hotel Caravel", coordinates: [41.8567, 12.4956], description: "Hotel Caravel is the practical Garbatella-adjacent base, best for travelers prioritizing value, transit, and southern Rome logistics over old-city romance. Hotel Caravel's value is the sleep tradeoff: location, room style, price posture, and how easily the stay supports the surrounding route. Confirm Hotel Caravel's current room type, check-in details, and transit fit before booking.", price: "$$", priceSource: "Booking.com / Google Travel", photo: undefined },
    { id: "garbatella-hotel-pulitzer", name: "Hotel Pulitzer Roma", coordinates: [41.8389, 12.4784], description: "Hotel Pulitzer Roma serves the Garbatella/EUR edge with design-forward rooms and metro access. It is useful when the trip includes southern Rome, EUR, or business stops.", price: "$$", priceSource: "Booking.com / Tripadvisor", photo: "https://www.hotelpulitzer.it/assets/components/phpthumbof/cache/Cover_Tavolo%20%281%29.ea0409bea87230edc71e32984e69775b.png" },
    { id: "garbatella-crossroad", name: "Crossroad Hotel", coordinates: [41.8732, 12.4811], description: "Crossroad Hotel is the Ostiense-side option for travelers using Garbatella as a food and nightlife base. The value is rail/metro access plus quick movement into Testaccio and Ostiense.", price: "$$", priceSource: "Google Travel / Booking.com", photo: undefined },
  ],
  celio: [
    { id: "celio-palazzo-manfredi", name: "Palazzo Manfredi", coordinates: [41.8908, 12.4954], description: "Palazzo Manfredi is the Colosseum-view splurge, best for travelers who want the ancient-city fantasy built into the room and breakfast view. It is a landmark stay, not a budget-minded base.", price: "$$$", priceSource: "Condé Nast Traveler / Google Travel", photo: "https://www.manfredihotels.com/wp-content/uploads/2021/02/Manfredi-Collection_Palazzo-Manfredi_Roma-1.jpg" },
    { id: "celio-hotel-lancelot", name: "Hotel Lancelot", coordinates: [41.887, 12.4977], description: "Hotel Lancelot is the warmer midrange Celio pick, close to the Colosseum but quieter than the main tourist flow. It suits travelers who want family-run hospitality and walkable ruins.", price: "$$", priceSource: "Tripadvisor / Google Travel", photo: undefined },
    { id: "celio-mercure-colosseo", name: "Mercure Roma Centro Colosseo", coordinates: [41.8891, 12.4988], description: "Mercure Roma Centro Colosseo is the practical chain option with rooftop appeal and ancient-site proximity. It works when predictable rooms and a pool/view tradeoff matter more than boutique character.", price: "$$", priceSource: "Google Travel / Booking.com", photo: undefined },
  ],
} satisfies Record<string, StopSeed[]>;

const hostelStops = {
  city: [
    { id: "rome-hostel-romehello", name: "The RomeHello Hostel", coordinates: [41.9026, 12.4933], description: "The RomeHello is the citywide hostel benchmark because it balances central logistics with a cleaner, more organized social setup than many budget bases. Hostelworld and map signals support it for dorm/private flexibility, common spaces, and easy movement toward Termini, Monti, and the historic core. Use it if you want to meet people without depending on a party-hostel atmosphere every night.", price: "$", priceSource: "Hostelworld / Google Maps", photo: undefined },
    { id: "rome-hostel-yellowsquare", name: "YellowSquare Rome", coordinates: [41.9035, 12.5054], description: "YellowSquare is the social Termini-area hostel for travelers who want built-in plans after sightseeing. The appeal is events, bar energy, dorm/private range, and strong review momentum from backpackers who prioritize meeting people. Choose it when nightlife and hostel programming matter; choose a quieter base if sleep is the main priority.", price: "$", priceSource: "Hostelworld / Google Maps", photo: "https://yellowsquare.com/rome/wp-content/uploads/sites/2/2023/12/francesco_colosseo_precovid-gallery-home-rome-copia.webp" },
    { id: "rome-hostel-ostello-bello", name: "Ostello Bello Roma Colosseo", coordinates: [41.8954, 12.4996], description: "Ostello Bello Roma Colosseo is the best citywide hostel for ancient-site access because it sits close to Monti, Celio, and the Colosseum corridor. The value is dorm/private flexibility plus a lively common-space model that helps solo travelers build plans. Use it when you want sightseeing logistics and social energy in the same base.", price: "$", priceSource: "Hostelworld / Google Maps", photo: "https://ostellobello.com/wp-content/uploads/2021/10/OBR_1x1_Full.jpg" },
    { id: "rome-hostel-jojoe", name: "JO&JOE Roma", coordinates: [41.899, 12.4893], description: "JO&JOE Roma gives the city a newer design-hostel option near the center. The draw is hybrid lodging: dorms, private rooms, and a more polished social setup than a bare-bones hostel. It is a good fit for travelers who want budget flexibility but still care about design, common areas, and easy central movement.", price: "$", priceSource: "Hostelworld / Google Maps", photo: undefined },
    { id: "rome-hostel-borgo-ripa", name: "Borgo Ripa Urban Travel", coordinates: [41.8873, 12.4753], description: "Borgo Ripa Urban Travel adds the rare Trastevere hostel-style base to the citywide set. It matters because travelers often want river walks, dinner, and nightlife close by, while still needing dorm/private flexibility instead of a full hotel bill.", price: "$", priceSource: "Hostelworld / Google Maps", photo: undefined },
    { id: "rome-hostel-generator", name: "Generator Rome", coordinates: [41.8967, 12.5065], description: "Generator Rome is the design-hostel option on the Esquilino/Termini edge, useful for travelers who care about common spaces, private-room options, and transit. It is less neighborhood-romantic than Monti or Trastevere, but stronger for logistics and budget control.", price: "$", priceSource: "Hostelworld / Google Maps", photo: undefined },
    { id: "rome-hostel-new-generation", name: "New Generation Hostel Rome Center", coordinates: [41.8959, 12.4997], description: "New Generation Hostel Rome Center gives the citywide hostel guide a simple Monti/Santa Maria Maggiore budget option. It is a price-and-location pick for travelers who want Colosseum and Termini reach more than a heavily programmed hostel scene.", price: "$", priceSource: "Hostelworld / Google Maps", photo: undefined },
    { id: "rome-hostel-free-hostels", name: "Free Hostels Roma", coordinates: [41.8873, 12.5147], description: "Free Hostels Roma adds an east-side budget-social option for travelers who want dorms, common spaces, and a base outside the most expensive historic lanes. Use it when value and hostel infrastructure matter more than sleeping beside major monuments.", price: "$", priceSource: "Hostelworld / Google Maps", photo: undefined },
    { id: "rome-hostel-roma-scout", name: "Roma Scout Center", coordinates: [41.9144, 12.5233], description: "Roma Scout Center is the quieter functional hostel choice, better for budget travelers who value simple dorm/private options over party energy. It belongs as a practical fallback when central hostel prices jump or the trip needs calmer nights.", price: "$", priceSource: "Hostelworld / Google Maps", photo: undefined },
    { id: "rome-hostel-comics", name: "Comics Guesthouse", coordinates: [41.9116, 12.4663], description: "Comics Guesthouse gives Prati a lighter hostel-style option close to Vatican routes and the river. It is best for travelers who want dorm/private flexibility, quieter nights, and a calmer district rather than the Termini-centered social-hostel circuit.", price: "$", priceSource: "Hostelworld / Google Maps", photo: undefined },
  ],
  centro: [
    { id: "centro-hostel-romehello", name: "The RomeHello Hostel", coordinates: [41.9026, 12.4933], description: "The RomeHello is the strongest hostel base for Centro Storico access even though it sits just north of the core. It works for travelers who want walkable sights with better hostel infrastructure than the old lanes usually offer.", price: "$", priceSource: "Hostelworld / Google Maps", photo: undefined },
    { id: "centro-hostel-jojoe", name: "JO&JOE Roma", coordinates: [41.899, 12.4893], description: "JO&JOE Roma is useful for Centro travelers who want a newer hybrid hostel-hotel setup near Trevi, Quirinale, and Monti. Choose it for design and private-room flexibility over classic backpacker grit.", price: "$", priceSource: "Hostelworld / Google Maps", photo: undefined },
    { id: "centro-hostel-new-generation", name: "New Generation Hostel Rome Center", coordinates: [41.8959, 12.4997], description: "New Generation Hostel Rome Center is a budget-first option near Monti and Santa Maria Maggiore. It serves Centro routes best when price and transit matter more than a deep neighborhood feel.", price: "$", priceSource: "Hostelworld / Google Maps", photo: undefined },
  ],
  trastevere: [
    { id: "trastevere-hostel-borgo-ripa", name: "Borgo Ripa Urban Travel", coordinates: [41.8873, 12.4753], description: "Borgo Ripa Urban Travel is the rare Trastevere hostel-style base that actually fits the neighborhood. It is best for travelers who want dorm/private flexibility close to river walks and evening food routes.", price: "$", priceSource: "Hostelworld / Google Maps", photo: undefined },
    { id: "trastevere-hostel-romehello", name: "The RomeHello Hostel", coordinates: [41.9026, 12.4933], description: "The RomeHello is the safer infrastructure pick when Trastevere availability is thin. Stay here if you want stronger hostel operations and plan to visit Trastevere by bus, taxi, or evening walk.", price: "$", priceSource: "Hostelworld / Google Maps", photo: undefined },
    { id: "trastevere-hostel-yellow", name: "YellowSquare Rome", coordinates: [41.9035, 12.5054], description: "YellowSquare is not in Trastevere, but it honestly serves travelers who want the social hostel scene first and Trastevere as a dinner/night route. The tradeoff is transit or taxi time.", price: "$", priceSource: "Hostelworld / Google Maps", photo: "https://yellowsquare.com/rome/wp-content/uploads/sites/2/2023/12/francesco_colosseo_precovid-gallery-home-rome-copia.webp" },
  ],
  monti: [
    { id: "monti-hostel-ostello-bello", name: "Ostello Bello Roma Colosseo", coordinates: [41.8954, 12.4996], description: "Ostello Bello Roma Colosseo is the strongest Monti hostel match: close to the neighborhood's bars, cafes, and ancient sites, with dorms, private rooms, and common spaces that work for solo travelers.", price: "$", priceSource: "Hostelworld / Google Maps", photo: undefined },
    { id: "monti-hostel-new-generation", name: "New Generation Hostel Rome Center", coordinates: [41.8959, 12.4997], description: "New Generation Hostel Rome Center is the budget Monti option for travelers who want Colosseum and Termini access without paying hotel rates. Use it as a location-and-price pick.", price: "$", priceSource: "Hostelworld / Google Maps", photo: undefined },
    { id: "monti-hostel-generator", name: "Generator Rome", coordinates: [41.8967, 12.5065], description: "Generator Rome sits on the Esquilino edge, but it serves Monti travelers who want a larger design hostel with dorms, private rooms, and easy Termini logistics.", price: "$", priceSource: "Hostelworld / Google Maps", photo: undefined },
  ],
  testaccio: [
    { id: "testaccio-hostel-borgo-ripa", name: "Borgo Ripa Urban Travel", coordinates: [41.8873, 12.4753], description: "Borgo Ripa is the closest credible hostel-style choice for Testaccio routes, especially for travelers who want Trastevere access at night and Testaccio food by foot or short transit. Borgo Ripa Urban Travel's hostel tradeoff is dorm and private-room flexibility, common-space energy, price, and whether the location honestly serves the neighborhood route. Confirm Borgo Ripa Urban Travel's current ratings, check-in rules, lockers, and late-arrival details before booking.", price: "$", priceSource: "Hostelworld / Google Maps", photo: undefined },
    { id: "testaccio-hostel-ostello-bello", name: "Ostello Bello Roma Colosseo", coordinates: [41.8954, 12.4996], description: "Ostello Bello is the stronger hostel operation if Testaccio itself lacks the right dorm base. Use it when ancient-site access matters by day and Testaccio is an evening food plan.", price: "$", priceSource: "Hostelworld / Google Maps", photo: "https://ostellobello.com/wp-content/uploads/2021/10/OBR_1x1_Full.jpg" },
    { id: "testaccio-hostel-roma-scout", name: "Roma Scout Center", coordinates: [41.9144, 12.5233], description: "Roma Scout Center is farther out, but it can suit budget travelers who prioritize value and simple dorm/private options over being inside Testaccio. It is a practical fallback, not a neighborhood immersion pick.", price: "$", priceSource: "Hostelworld / Google Maps", photo: undefined },
  ],
  prati: [
    { id: "prati-hostel-comics", name: "Comics Guesthouse", coordinates: [41.9116, 12.4663], description: "Comics Guesthouse is the most honest Prati hostel-style option, close to the Vatican side and useful for private/dorm travelers who want a quieter base than Termini. Comics Guesthouse's value is the sleep tradeoff: location, room style, price posture, and how easily the stay supports the surrounding route. Confirm Comics Guesthouse's current room type, check-in details, and transit fit before booking.", price: "$", priceSource: "Hostelworld / Google Maps", photo: undefined },
    { id: "prati-hostel-romehello", name: "The RomeHello Hostel", coordinates: [41.9026, 12.4933], description: "The RomeHello works for Prati visitors who prefer a stronger hostel operation and are comfortable crossing town for Vatican days. It is a quality-over-proximity pick.", price: "$", priceSource: "Hostelworld / Google Maps", photo: undefined },
    { id: "prati-hostel-yellow", name: "YellowSquare Rome", coordinates: [41.9035, 12.5054], description: "YellowSquare is the social alternative for Prati travelers, better for meeting people than for Vatican doorstep convenience. Use it when nightlife and hostel programming matter.", price: "$", priceSource: "Hostelworld / Google Maps", photo: "https://yellowsquare.com/rome/wp-content/uploads/sites/2/2023/12/francesco_colosseo_precovid-gallery-home-rome-copia.webp" },
  ],
  garbatella: [
    { id: "garbatella-hostel-roma-scout", name: "Roma Scout Center", coordinates: [41.9144, 12.5233], description: "Roma Scout Center is not Garbatella proper, but it fits budget travelers using southeast Rome transit and wanting a quieter, functional hostel base. It is better for value than scene.", price: "$", priceSource: "Hostelworld / Google Maps", photo: undefined },
    { id: "garbatella-hostel-free-hostels", name: "Free Hostels Roma", coordinates: [41.8873, 12.5147], description: "Free Hostels Roma is a practical east-side hostel option for Garbatella plans when dorm availability matters more than sleeping inside the neighborhood. The common-space setup is the main reason to choose it.", price: "$", priceSource: "Hostelworld / Google Maps", photo: undefined },
    { id: "garbatella-hostel-ostello-bello", name: "Ostello Bello Roma Colosseo", coordinates: [41.8954, 12.4996], description: "Ostello Bello is the better-supported fallback for travelers who want a lively hostel and will treat Garbatella as a food or evening excursion. It is not hyperlocal, but it is reliable.", price: "$", priceSource: "Hostelworld / Google Maps", photo: "https://ostellobello.com/wp-content/uploads/2021/10/OBR_1x1_Full.jpg" },
  ],
  celio: [
    { id: "celio-hostel-ostello-bello", name: "Ostello Bello Roma Colosseo", coordinates: [41.8954, 12.4996], description: "Ostello Bello Roma Colosseo is the natural Celio hostel pick because it sits close to the Colosseum and Monti while still offering a strong social setup. Choose it for dorm/private flexibility near ancient Rome.", price: "$", priceSource: "Hostelworld / Google Maps", photo: "https://ostellobello.com/wp-content/uploads/2021/10/OBR_1x1_Full.jpg" },
    { id: "celio-hostel-sandy", name: "Sandy Hostel", coordinates: [41.8956, 12.4988], description: "Sandy Hostel is a budget-minded Colosseum-area fallback, useful for travelers who want the ancient core close and accept simpler facilities. It is a price/location pick.", price: "$", priceSource: "Hostelworld / Google Maps", photo: undefined },
    { id: "celio-hostel-new-generation", name: "New Generation Hostel Rome Center", coordinates: [41.8959, 12.4997], description: "New Generation Hostel Rome Center works for Celio routes that also use Monti and Termini. It is best when access and cost matter more than a distinctive neighborhood stay.", price: "$", priceSource: "Hostelworld / Google Maps", photo: undefined },
  ],
} satisfies Record<string, StopSeed[]>;

const romeCoreGuides = [
  guide({
    id: "list-rome-citywide-restaurants",
    slug: "rome-best-restaurants",
    seoSlug: "best-restaurants",
    seoTitle: "Best Restaurants in Rome",
    seoDescription: "Best restaurants in Rome for Roman pastas, classic trattorias, Testaccio institutions, modern Roman cooking, and reservation dinners by neighborhood.",
    title: "Roman Tables Worth Planning Around",
    description: "A citywide restaurant spine for Rome: classic trattorias, serious reservations, Testaccio institutions, modern Roman cooking, pizza, and market food. Use it to choose the meal format that fits the day rather than defaulting to the closest piazza table.",
    url: "https://www.google.com/maps/search/best+restaurants+rome",
    category: "Food",
    stops: citywideFood,
    sources: romeFoodSources,
  }),
  guide({
    id: "list-rome-citywide-coffee-cafes-gelato",
    slug: "rome-best-coffee-cafes-gelato",
    seoSlug: "best-cafes",
    seoTitle: "Best Coffee, Cafes, and Gelato in Rome",
    seoDescription: "Best coffee, cafes, bakeries, and gelato in Rome for morning routes, daytime breaks, pastry stops, pantry browsing, and quick central resets.",
    title: "Coffee, Cafes, and Gelato for Daytime Rome",
    description: "A citywide daytime food guide for espresso, bakeries, pastries, gelato, and cafe breaks. Use it for mornings, museum resets, and snack stops when a full restaurant reservation would slow the route down.",
    url: "https://www.google.com/maps/search/best+coffee+cafes+gelato+rome",
    category: "Food",
    stops: citywideCafeFood,
    sources: romeFoodSources,
  }),
  guide({
    id: "list-rome-citywide-culture",
    slug: "rome-best-culture-citywide",
    seoSlug: "best-culture",
    seoTitle: "Best Culture in Rome",
    seoDescription: "Best culture in Rome for ancient sites, churches, museums, palace collections, Vatican galleries, and historic-center routes.",
    title: "Ancient Sites, Churches, and Palace Rooms",
    description: "Use this when you need Rome's cultural weight organized into a routeable set: ancient icons, central engineering, Vatican scale, a timed museum, and one palace collection that fits dense city days. The experience gives the area more context than a surface-level walk, whether through architecture, collections, street history, or a quieter interior. Check current opening days and ticket needs, then place it where the route can slow down enough to absorb it.",
    url: "https://www.google.com/maps/search/best+culture+rome",
    category: "Culture",
    stops: citywideCulture,
    sources: romeCultureSources,
  }),
  guide({
    id: "list-rome-top-parks-and-walks",
    slug: "rome-top-parks-and-walks",
    seoSlug: "best-parks",
    seoTitle: "Best Parks and Walks in Rome",
    seoDescription: "Best parks and walks in Rome for villa gardens, hill views, river-adjacent resets, botanical shade, and Appian Way routes.",
    title: "Villa Shade and Ancient Roads",
    description: "Rome's nature guide is less about wilderness than relief: villa paths, hill views, gardens, and the Appian Way routes that let ancient texture and open air carry the same day. The value is its role in the route: it adds a concrete experience, a timing choice, and a reason to save the stop rather than wander past it. Check current hours and fit it into the nearby cluster instead of treating it as a standalone errand.",
    url: "https://www.google.com/maps/search/best+parks+walks+rome",
    category: "Nature",
    stops: citywideNature,
    sources: romeNatureSources,
  }),
  guide({
    id: "list-rome-citywide-nightlife",
    slug: "rome-best-bars-nightlife",
    seoSlug: "best-bars",
    seoTitle: "Best Bars and Nightlife in Rome",
    seoDescription: "Best bars and nightlife in Rome for wine bars, cocktail rooms, piazza drinks, beer stops, and neighborhood evenings.",
    title: "Wine Bars, Piazza Drinks, and Late Rooms",
    description: "Rome nightlife works best when it follows the neighborhood instead of fighting it: aperitivo in Prati, craft beer in Trastevere, cocktails in Centro, and lower-key late rooms near Monti or Celio. This guide keeps the evening practical by matching drink format, crowd, and geography instead of sending every traveler to one bar district.",
    url: "https://www.google.com/maps/search/best+bars+nightlife+rome",
    category: "Nightlife",
    stops: [
      { id: "rome-nightlife-freni-frizioni", name: "Freni e Frizioni", coordinates: [41.8894, 12.4714], description: "Freni e Frizioni is the Trastevere aperitivo anchor: busy, social, spritz-heavy, and easy to use as a first stop before dinner or a longer bar route.", photo: undefined },
      { id: "rome-nightlife-jerry-thomas", name: "The Jerry Thomas Speakeasy", coordinates: [41.8961, 12.4711], description: "Jerry Thomas gives Centro Storico a darker, more deliberate cocktail room than the surrounding piazza bars. Use it when the night needs one serious drink stop rather than a loose wander.", photo: undefined },
      { id: "rome-nightlife-ma-che-siete", name: "Ma Che Siete Venuti a Fà", coordinates: [41.8896, 12.4733], description: "Ma Che Siete Venuti a Fa is the craft-beer counterpoint to wine-heavy Rome and a useful pressure valve in Trastevere. The room is compact and busy, with the appeal coming from beer selection, bar energy, and its position near casual food routes. Use it before or after dinner when you want something sharper than another spritz.", photo: "https://static.wixstatic.com/media/db73ca_19853bdc30ba4dedb6a6b15bd412a14b~mv2.jpg/v1/fit/w_2500,h_1330,al_c/db73ca_19853bdc30ba4dedb6a6b15bd412a14b~mv2.jpg" },
      { id: "rome-nightlife-be-re", name: "Be.Re.", coordinates: [41.9065, 12.4588], description: "Be.Re. is the Prati/Vatican beer-and-street-food stop because it gives museum days a casual exit ramp. The appeal is craft beer, trapizzino-style food nearby, and a setting that feels current rather than trapped in sightseeing mode. Use it after the Vatican Museums when a full formal dinner feels like too much.", photo: undefined },
      { id: "rome-nightlife-blackmarket", name: "Blackmarket Hall", coordinates: [41.8944, 12.4916], description: "Blackmarket Hall is the Monti late-room pick for cocktails, music, and a moodier after-dinner alternative to the obvious bars near the ruins.", photo: undefined },
      { id: "rome-nightlife-bar-del-fico", name: "Bar del Fico", coordinates: [41.8985, 12.4709], description: "Bar del Fico is a lively Navona-area cafe-bar with piazza spillover, aperitivo energy, and an easy meeting-point role. Use it for a first drink or casual nightcap in the historic core.", price: "$$", priceSource: "Google Maps / venue pages", photo: undefined },
      { id: "rome-nightlife-salotto-42", name: "Salotto 42", coordinates: [41.899, 12.4791], description: "Salotto 42 adds a polished Pantheon-area cocktail room to balance the guide's louder Trastevere and Monti stops. It works when the night wants design, aperitivo, and a seated drink close to central monuments rather than another standing-room beer bar.", price: "$$", priceSource: "Time Out / Google Maps", photo: undefined },
      { id: "rome-nightlife-ai-tre-scalini", name: "Ai Tre Scalini", coordinates: [41.8955, 12.4913], description: "Ai Tre Scalini brings Monti's wine-bar/trattoria rhythm into the citywide list. It belongs because Rome nights often need a food-and-drink bridge, not a hard switch from dinner to cocktails, and this lane keeps the evening neighborhood-scaled.", price: "$$", priceSource: "Google Maps / local editorial guides", photo: undefined },
      { id: "rome-nightlife-tram-depot", name: "Tram Depot", coordinates: [41.8792, 12.4782], description: "Tram Depot gives Testaccio an outdoor aperitivo and cocktail stop that feels made for warm Roman evenings. Use it when the guide needs a casual first drink before dinner or a lower-pressure alternative to the old-center cocktail rooms.", price: "$$", priceSource: "Google Maps / venue pages", photo: undefined },
      { id: "rome-nightlife-coming-out", name: "Coming Out", coordinates: [41.8896, 12.4955], description: "Coming Out adds an LGBTQ+ Colosseum-side bar to the citywide nightlife map, which keeps the guide from reading like only wine rooms and speakeasies. The landmark view is obvious, but the stronger reason to include it is identity, social energy, and easy placement after ancient-site days.", price: "$$", priceSource: "Google Maps / local nightlife guides", photo: undefined },
    ],
    sources: romeNightlifeSources,
  }),
  stayGuide(undefined, "Hotels", hotelStops.city, "Where to Stay in Rome: Hotels by Area", "A citywide hotel guide for choosing the right Rome base: central spa polish, classic garden calm, boutique Centro access, Monti design, Vatican-side value, or a Trastevere courtyard that supports food-first nights."),
  stayGuide(undefined, "Hostels", hostelStops.city, "Rome Hostels With Real Social Energy", "Rome hostels cluster around Termini, Monti, and a few neighborhood edges, so this guide compares social energy, private-room flexibility, and sightseeing logistics honestly."),
  guide({
    id: "list-rome-weekend-activities",
    slug: "rome-weekend-activities",
    seoSlug: "best-things-to-do",
    seoTitle: "Best Things to Do in Rome for a Weekend",
    seoDescription: "Best things to do in Rome for a weekend, pacing ancient sites, central churches, Roman food, Trastevere evenings, Vatican time, and park resets.",
    title: "A Weekend Without Monument Whiplash",
    description: "This weekend route keeps Rome legible by giving each day a role instead of chasing every monument. The stops balance ancient-site time, one central food spine, one Trastevere night, a Vatican-side block, and enough park or piazza air to reset between crowds. Use it as a pacing model, not a mandate to rush every item in order.",
    url: "https://www.google.com/maps/search/best+things+to+do+rome+weekend",
    category: "Activities",
    stops: [
      { ...citywideCulture[0], description: "The Colosseum belongs in the weekend plan only when it is tied to a realistic ancient-Rome block, not treated as a quick photo errand. Book the entry type carefully, keep Forum or Celio time nearby, and avoid stacking another heavyweight museum immediately after it." },
      { ...citywideCulture[1], description: "The Pantheon is the weekend route's short, high-impact historic stop: central enough to sit between meals, but important enough to plan around crowds and timed entry. Let it explain the old core quickly before moving back into piazzas, coffee, or dinner." },
      { ...citywideFood[0], description: "Roscioli works in the weekend route as the planned central dinner that prevents the food portion from becoming random piazza grazing. Build the evening around its deli-wine-room energy, then keep the next stop nearby because the meal already carries plenty of momentum." },
      { ...citywideFood[1], description: "Da Enzo al 29 gives the weekend a Trastevere meal with neighborhood pressure built in: a small room, Roman classics, and a queue-or-reservation rhythm. Use it when the route can absorb a wait and the point is to feel the area through dinner, not just pass through it." },
      { ...citywideCulture[2], description: "The Vatican Museums should be the weekend's timed endurance block, not an extra squeezed between casual stops. Treat the Sistine Chapel flow and gallery length as the day's main structure, then recover with food or green space instead of another major interior." },
      { ...citywideNature[0], description: "Villa Borghese gives the weekend route air after dense streets and ticketed interiors. Use it as a reset between Centro Storico, Parioli, or a Galleria Borghese booking, especially when the day needs shade more than another church." },
      { ...citywideCulture[5], description: "The Roman Forum and Palatine Hill belong in the weekend plan because they turn the Colosseum stop into a real ancient-city block. Give the ruins walking time, water, and heat strategy instead of treating them as the leftover space after the arena." },
      { ...citywideCulture[3], description: "Galleria Borghese is the focused art booking that keeps a weekend from becoming only ruins and churches. The timed-entry format makes the visit manageable, and the surrounding park gives the route a natural recovery point afterward." },
      { ...citywideNature[1], description: "Via Appia Antica is the weekend escape when Rome needs open air without losing its historical charge. Bike or walk a section with catacombs, ruins, and aqueduct views, then avoid stacking it with another far-flung plan the same afternoon." },
      { ...citywideFood[4], description: "Da Cesare al Casaletto gives the weekend one neighborhood trattoria meal outside the obvious sightseeing grid. Let fritti, pastas, and the patio rhythm carry the stop instead of squeezing it between major monuments." },
      { ...citywideNature[2], description: "Janiculum Hill gives the weekend route one view-led walk that connects Trastevere with a broader sense of the city. Use it around sunset or as a morning climb, then drop back down toward food instead of turning it into a rushed checkpoint." },
    ],
    sources: uniqueSources([
      { name: "Parco archeologico del Colosseo", url: "https://colosseo.it/en/" },
      { name: "Roscioli official", url: "https://www.roscioli.com/restaurant/" },
      { name: "Vatican Museums", url: "https://www.museivaticani.va/content/museivaticani/en.html" },
      { name: "Villa Borghese - Turismo Roma", url: "https://www.turismoroma.it/en/places/villa-borghese" },
      { name: "Trattoria Da Cesare official", url: "https://www.trattoriadacesare.it/" },
      { name: "Parco Archeologico dell'Appia Antica", url: "https://www.parcoappiaantica.it/" },
      { name: "Galleria Borghese official", url: "https://galleriaborghese.beniculturali.it/en/" },
      { name: "Da Enzo al 29 official", url: "https://www.daenzoal29.com/" },
      { name: "Janiculum Hill - Turismo Roma", url: "https://www.turismoroma.it/en/places/gianicolo" },
      { name: "Pantheon official", url: "https://pantheon.cultura.gov.it/" },
      ...romeCultureSources,
      ...romeFoodSources,
      ...romeNatureSources,
    ]),
  }),
] satisfies MapList[];

const neighborhoodFoodGuides = [
  neighborhoodGuide("Centro Storico", "Food", "Restaurants", [
    { id: "centro-roscioli", name: "Roscioli Salumeria con Cucina", coordinates: [41.8956, 12.4745], description: "Roscioli is the central reservation for travelers who want Rome's food culture in one dense room: salumi, wine, carbonara, and service that rewards planning. The value is the meal format: a tightly packed deli-restaurant where the products, wine list, and Roman classics are the point. Book ahead and use it for a deliberate Centro meal rather than a casual fallback.", price: "$$$", priceSource: "Eater / The Infatuation", photo: undefined },
    { id: "centro-armando-pantheon", name: "Armando al Pantheon", coordinates: [41.8992, 12.4772], description: "Armando al Pantheon earns its place by staying genuinely food-led in one of Rome's most tourist-heavy zones. Book ahead for classic Roman cooking within steps of the Pantheon.", price: "$$$", priceSource: "Eater / MICHELIN Guide", photo: undefined },
    { id: "centro-forno-roscioli", name: "Antico Forno Roscioli", coordinates: [41.8957, 12.4743], description: "Antico Forno Roscioli is the bakery-and-pizza stop that makes Centro work between sit-down meals. It is best for pizza bianca, quick slices, and picnic supplies before piazza wandering.", price: "$", priceSource: "The Infatuation / Google Maps", photo: "https://www.anticofornoroscioli.it/wp-content/uploads/2024/01/305035920_458860706278743_310110833753177664_n-removebg-preview-removebg-preview-2.webp" },
    { id: "centro-santeustachio", name: "Sant'Eustachio Il Caffè", coordinates: [41.8989, 12.4742], description: "Sant'Eustachio is the coffee classic to save when the route needs a fast Roman bar stop near the Pantheon. It is touristy, but still useful when treated as a quick ritual.", price: "$", priceSource: "Time Out / Google Maps", photo: undefined },
  ], "Pantheon and Campo Food That Holds Up", "Centro Storico rewards planning: the strongest food stops are booked, quick, or specific enough to survive the tourist pressure around the Pantheon, Campo, and Navona.", romeFoodSources),
  neighborhoodGuide("Trastevere", "Food", "Restaurants", [
    { id: "trastevere-da-enzo", name: "Da Enzo al 29", coordinates: [41.8897, 12.4746], description: "Da Enzo is the neighborhood trattoria benchmark, worth saving for travelers who want Roman classics with Trastevere energy. Go early or plan for demand.", price: "$$", priceSource: "Eater / The Infatuation", photo: undefined },
    { id: "trastevere-zia", name: "Zia Restaurant", coordinates: [41.8894, 12.4678], description: "Zia gives Trastevere a polished, contemporary dinner when the neighborhood plan needs more than another casual trattoria. It is the reservation-led choice for tasting-menu pacing, cleaner lines, and a quieter room.", price: "$$$", priceSource: "MICHELIN Guide / Google Maps", photo: undefined },
    { id: "trastevere-seu-pizza", name: "Seu Pizza Illuminati", coordinates: [41.8847, 12.4727], description: "Seu Pizza Illuminati brings destination pizza to the edge of Trastevere, with serious dough and creative toppings that make it a dinner plan rather than a backup slice stop.", price: "$$", priceSource: "Eater / The Infatuation", photo: undefined },
    { id: "trastevere-proloco", name: "Proloco Trastevere", coordinates: [41.8894, 12.4716], description: "Proloco Trastevere is a good aperitivo-to-dinner bridge for Lazio products, wine, and casual plates. It fits nights that start slowly and may turn into a bar route.", price: "$$", priceSource: "Google Maps / local editorial guides", photo: "https://static.wixstatic.com/media/a2cd2b_61dde53d94694e3c9076eb33f3e803bd~mv2.png/v1/fill/w_1181,h_853,al_c/a2cd2b_61dde53d94694e3c9076eb33f3e803bd~mv2.png" },
  ], "Pasta, Pizza, and Better Reservations", "Trastevere food works when it does not rely only on atmosphere: classic trattorias, destination pizza, Lazio products, and one polished dinner keep the neighborhood useful.", romeFoodSources),
  neighborhoodGuide("Monti", "Food", "Restaurants", [
    { id: "monti-taverna-fori", name: "La Taverna dei Fori Imperiali", coordinates: [41.8946, 12.4907], description: "La Taverna dei Fori Imperiali is the Monti classic for Roman dishes close to the ruins. It is best for travelers who want a real meal after ancient-site time without crossing town.", price: "$$", priceSource: "The Infatuation / Google Maps", photo: "https://www.latavernadeiforiimperiali.com/cucina-romana-roma-centro-storico-roman-cuisine-rome-historic-center/img/it-roma-la-taverna-dei-fori-imperiali.jpg" },
    { id: "monti-urbana-47", name: "Urbana 47", coordinates: [41.8959, 12.4934], description: "Urbana 47 fits Monti's independent, slightly design-led mood with regional ingredients and all-day flexibility. Use it when the route needs a calmer neighborhood meal.", price: "$$", priceSource: "Time Out / Google Maps", photo: undefined },
    { id: "monti-aromaticus", name: "Aromaticus Monti", coordinates: [41.895, 12.4918], description: "Aromaticus is the lighter Monti counterpoint, useful for vegetables, lunch, and a break from heavy pasta sequencing. It works especially well between shopping and Colosseum routes.", price: "$$", priceSource: "Google Maps / local editorial guides", photo: undefined },
    { id: "monti-fatamorgana", name: "Fatamorgana Monti", coordinates: [41.8958, 12.4917], description: "Fatamorgana is the gelato stop that keeps a Monti food map practical. Save it for after dinner or a midday reset rather than treating gelato as an afterthought.", price: "$", priceSource: "The Infatuation / Google Maps", photo: undefined },
  ], "Monti Meals Near the Ruins", "Monti needs food that can handle Colosseum proximity without becoming pure convenience; this set mixes Roman classics, lighter lunches, and a gelato stop worth saving.", romeFoodSources),
  neighborhoodGuide("Testaccio", "Food", "Restaurants", [
    { id: "testaccio-flavio", name: "Flavio al Velavevodetto", coordinates: [41.8765, 12.4765], description: "Flavio is the Testaccio classic for Roman pastas and offal-linked food history. The Monte Testaccio setting makes it feel rooted rather than nostalgic.", price: "$$", priceSource: "Eater / MICHELIN Guide", photo: undefined },
    { id: "testaccio-felice", name: "Felice a Testaccio", coordinates: [41.8767, 12.4751], description: "Felice is the cacio e pepe institution, best approached as a planned classic rather than a spontaneous neighborhood meal. It belongs because the dish and the district are inseparable.", price: "$$", priceSource: "Eater / The Infatuation", photo: "https://feliceatestaccio.com/wp-content/uploads/2025/03/carbonara.webp" },
    { id: "testaccio-mordi-vai", name: "Mordi e Vai", coordinates: [41.8772, 12.4756], description: "Mordi e Vai is the market sandwich stop that makes Testaccio work during the day. It is quick, specific, and tied to the neighborhood's working-food identity.", price: "$", priceSource: "Eater / Google Maps", photo: undefined },
    { id: "testaccio-linari", name: "Pasticceria Linari", coordinates: [41.8778, 12.4784], description: "Linari is the breakfast and pastry anchor, useful before the market or as a simple neighborhood reset. It gives the guide a morning option instead of only dinner classics.", price: "$", priceSource: "Google Maps / local editorial guides", photo: undefined },
  ], "Testaccio Market, Pasta, and Pastry", "Testaccio is the food neighborhood where market counters, pasta institutions, and working Roman history still line up in a route that makes geographic sense.", romeFoodSources),
  neighborhoodGuide("Prati", "Food", "Restaurants", [
    { id: "prati-pizzarium", name: "Bonci Pizzarium", coordinates: [41.9084, 12.4452], description: "Bonci Pizzarium is the Vatican-area lunch stop that can carry a museum day by itself. The slice format keeps it practical, but the toppings make it destination-level.", price: "$$", priceSource: "Eater / The Infatuation", photo: undefined },
    { id: "prati-sorpasso", name: "Il Sorpasso", coordinates: [41.9075, 12.4597], description: "Il Sorpasso is the Prati aperitivo-to-dinner room for travelers who want wine, salumi, and a social table after Vatican time. It is flexible without feeling like a fallback.", price: "$$", priceSource: "Eater / Google Maps", photo: undefined },
    { id: "prati-castroni", name: "Castroni", coordinates: [41.9101, 12.4646], description: "Castroni is the pantry-and-coffee institution that gives Prati a useful daytime stop. Save it for gifts, espresso, or a reset between Vatican and river routes.", price: "$", priceSource: "Google Maps / local editorial guides", photo: undefined },
    { id: "prati-romane", name: "Romanè", coordinates: [41.9128, 12.459], description: "Romanè is the neighborhood trattoria pick for Prati when the plan needs Roman cooking away from the busiest Vatican exits. It works better as dinner than a rushed museum lunch.", price: "$$", priceSource: "Eater / Google Maps", photo: undefined },
  ], "Vatican-Day Food With a Plan", "Prati food is most useful when it solves Vatican logistics: slices, aperitivo, pantry stops, and trattoria dinners that keep the day from becoming museum cafeteria math.", romeFoodSources),
  neighborhoodGuide("Garbatella", "Food", "Restaurants", [
    { id: "garbatella-ristoro-angeli", name: "Ristoro degli Angeli", coordinates: [41.8612, 12.4861], description: "Ristoro degli Angeli is the Garbatella meal to save when you want neighborhood character, Roman cooking, and a room that feels deliberately away from the central tourist circuit.", price: "$$", priceSource: "Google Maps / local editorial guides", photo: undefined },
    { id: "garbatella-dar-moschino", name: "Dar Moschino", coordinates: [41.8608, 12.4881], description: "Dar Moschino gives the guide a casual Roman trattoria option close to Garbatella's village-like streets. It is best for a low-key lunch or dinner built around the neighborhood itself.", price: "$$", priceSource: "Google Maps / local editorial guides", photo: undefined },
    { id: "garbatella-bar-foschi", name: "Bar Foschi", coordinates: [41.8626, 12.4875], description: "Bar Foschi is the local coffee and aperitivo anchor, useful because Garbatella needs everyday stops as much as destination restaurants. Save it for a neighborhood wander.", price: "$", priceSource: "Google Maps", photo: undefined },
    { id: "garbatella-casetta-rossa", name: "Casetta Rossa", coordinates: [41.859, 12.4882], description: "Casetta Rossa is included for its community-driven food and cultural programming, which fits Garbatella's lived-in identity. It is more local rhythm than polished reservation.", price: "$", priceSource: "Google Maps / official social channels", photo: undefined },
  ], "Residential Rome, Real Meals", "Garbatella food should feel lived-in: trattorias, bars, and community rooms that reward the trip south because they belong to the neighborhood, not to a checklist.", romeFoodSources),
  neighborhoodGuide("Celio", "Food", "Restaurants", [
    { id: "celio-li-rioni", name: "Li Rioni", coordinates: [41.8894, 12.4969], description: "Li Rioni is the Colosseum-area pizza stop for a casual meal that still feels intentional. Use it after ancient-site time when the group wants a lively room, thin Roman-style pizza, and an easy walk.", price: "$$", priceSource: "Google Maps / local editorial guides", photo: undefined },
    { id: "celio-luzzi", name: "Trattoria Luzzi", coordinates: [41.8891, 12.4966], description: "Trattoria Luzzi is a budget-friendly Celio classic for grilled seafood, meat, pizza, and simple Roman plates after the Colosseum. It is casual, busy, and useful when the route needs an unfussy sit-down meal.", price: "$", priceSource: "Google Maps / Tripadvisor", photo: undefined },
    { id: "celio-isidoro", name: "Hostaria Isidoro", coordinates: [41.889, 12.4976], description: "Hostaria Isidoro is the more formal Celio trattoria option, useful when the route needs a seated dinner near the ancient core rather than a quick pizza or snack.", price: "$$", priceSource: "Google Maps / Tripadvisor", photo: undefined },
    { id: "celio-propaganda", name: "Caffè Propaganda", coordinates: [41.8894, 12.4951], description: "Caffe Propaganda works as a stylish cafe-to-dinner bridge by the Colosseum, especially for drinks, dessert, or a polished pause near major sights.", price: "$$", priceSource: "Time Out / Google Maps", photo: undefined },
  ], "Colosseum-Area Meals With Purpose", "Celio food has to beat convenience bias; these picks give the Colosseum area quick, classic, and polished options that make sense before or after ancient-site time.", romeFoodSources),
];

const neighborhoodCultureGuides = [
  neighborhoodGuide("Centro Storico", "Culture", "Culture", [
    { id: "centro-pantheon", name: "Pantheon", coordinates: [41.8986, 12.4769], description: "The Pantheon is the essential Centro Storico stop because it explains Roman engineering, church continuity, and piazza life in one short visit. Pantheon gives the area more context than a surface-level walk, whether through architecture, collections, street history, or a quieter interior. Check Pantheon's current opening days and ticket needs, then place it where the route can slow down enough to absorb it.", photo: photos.pantheon },
    { id: "centro-piazza-navona", name: "Piazza Navona", coordinates: [41.8992, 12.4731], description: "Piazza Navona gives the route Baroque theater and everyday central-Rome pressure at once. Use it as a connector between churches, cafes, and side streets.", photo: photos.navona },
    { id: "centro-trevi", name: "Trevi Fountain", coordinates: [41.9009, 12.4833], description: "Trevi Fountain belongs because even the crowds tell the truth about Rome's spectacle. Go early or late and treat it as one beat, not the whole route.", photo: photos.trevi },
    { id: "centro-doria", name: "Galleria Doria Pamphilj", coordinates: [41.8976, 12.4813], description: "Galleria Doria Pamphilj adds palace interiors and painting depth to a neighborhood otherwise dominated by outdoor icons. It is a strong bad-weather or heat escape.", photo: "https://upload.wikimedia.org/wikipedia/commons/4/45/Ceiling_in_Galleria_Doria_Pamphilj_%28Rome%29.jpg" },
  ], "Piazzas, Domes, and Palace Rooms", "Centro culture is dense enough to blur; this guide uses a few anchors to make the historic core readable without chasing every church facade.", romeCultureSources),
  neighborhoodGuide("Trastevere", "Culture", "Culture", [
    { id: "trastevere-santa-maria", name: "Basilica di Santa Maria in Trastevere", coordinates: [41.8894, 12.4698], description: "Santa Maria in Trastevere is the neighborhood's cultural anchor, with mosaics, piazza life, and a scale that fits before dinner or drinks. The draw is the way the church turns Trastevere from atmosphere into history, especially if you slow down inside instead of only crossing the piazza. Confirm open hours and dress expectations before planning it as the route's main interior stop.", photo: photos.trastevere },
    { id: "trastevere-villa-farnesina", name: "Villa Farnesina", coordinates: [41.8931, 12.4677], description: "Villa Farnesina brings Renaissance frescoes and a calmer cultural stop to Trastevere. It works especially well before a Janiculum or Botanical Garden walk.", photo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Villa_Farnesina%2C_Rome.jpg" },
    { id: "trastevere-museo-roma", name: "Museo di Roma in Trastevere", coordinates: [41.8898, 12.4717], description: "Museo di Roma in Trastevere gives the area social-history context instead of leaving it as only pretty lanes and nightlife. It is compact enough for a neighborhood route.", photo: photos.trastevere },
    { id: "trastevere-botanical", name: "Orto Botanico di Roma", coordinates: [41.8933, 12.4664], description: "The Botanical Garden sits on the edge of Trastevere and gives the guide a shaded cultural-landscape stop when the streets feel too tight. Orto Botanico di Roma gives the area more context than a surface-level walk, whether through architecture, collections, street history, or a quieter interior. Check Orto Botanico di Roma's current opening days and ticket needs, then place it where the route can slow down enough to absorb it.", photo: "https://upload.wikimedia.org/wikipedia/commons/2/28/Orto_botanico_-_ingresso_2704.JPG" },
  ], "Mosaics, Frescoes, and Quiet Gardens", "Trastevere culture works best when it balances famous atmosphere with real interiors: basilica mosaics, villa frescoes, social history, and green space.", romeCultureSources),
  neighborhoodGuide("Monti", "Culture", "Culture", [
    { id: "monti-santa-maria-maggiore", name: "Basilica Papale di Santa Maria Maggiore", coordinates: [41.8975, 12.4985], description: "Santa Maria Maggiore gives Monti one of Rome's major basilica interiors, making the neighborhood more than a shopping-and-dinner pocket. The value is its scale, mosaics, and position between Termini and Monti, which can anchor a route before smaller churches or food stops. Confirm current access rules and give the interior enough time to register.", photo: "https://upload.wikimedia.org/wikipedia/commons/9/99/Basilica_Papale_di_Santa_Maria_Maggiore_02.jpg" },
    { id: "monti-domus-aurea", name: "Domus Aurea", coordinates: [41.8903, 12.4955], description: "Domus Aurea is the deep-history Monti stop, best for travelers who want imperial Rome below the surface rather than only the Colosseum exterior. The value is the guided archaeological format, which makes Nero's palace feel legible instead of abstract. Check current tour days and ticket availability before building the route around it.", photo: photos.colosseum },
    { id: "monti-san-pietro-vincoli", name: "San Pietro in Vincoli", coordinates: [41.8932, 12.4922], description: "San Pietro in Vincoli earns a saved-map spot for Michelangelo's Moses and the way it hides major art on a quieter Monti slope. San Pietro in Vincoli's value is its role in the route: it adds a concrete experience, a timing choice, and a reason to save the stop rather than wander past it. Check San Pietro in Vincoli's current hours and fit it into the nearby cluster instead of treating it as a standalone errand.", photo: "https://upload.wikimedia.org/wikipedia/commons/6/63/Michelangelo%27s_Moses.jpg" },
    { id: "monti-palazzo-esposizioni", name: "Palazzo delle Esposizioni", coordinates: [41.8992, 12.4902], description: "Palazzo delle Esposizioni gives Monti a contemporary exhibition counterweight to ancient and church-heavy routes. Palazzo delle Esposizioni gives the area more context than a surface-level walk, whether through architecture, collections, street history, or a quieter interior. Check Palazzo delle Esposizioni's current opening days and ticket needs, then place it where the route can slow down enough to absorb it.", photo: "https://upload.wikimedia.org/wikipedia/commons/f/f7/Palazzo_delle_Esposizioni_Rome.jpg" },
  ], "Basilicas and Buried Rome", "Monti's culture guide connects imperial remains, major churches, and exhibition space so the area does not become only a Colosseum approach.", romeCultureSources),
  neighborhoodGuide("Testaccio", "Culture", "Culture", [
    { id: "testaccio-macro", name: "MACRO Mattatoio", coordinates: [41.8767, 12.475], description: "MACRO Mattatoio turns Testaccio's former slaughterhouse into the neighborhood's contemporary-culture anchor. It belongs because the building history and current programming speak to each other.", photo: photos.testaccio },
    { id: "testaccio-monte", name: "Monte Testaccio", coordinates: [41.8767, 12.4776], description: "Monte Testaccio makes the district's food and trade history visible as landscape. Even when access is limited, it explains why the neighborhood eats the way it does.", photo: photos.testaccio },
    { id: "testaccio-cimitero-acattolico", name: "Non-Catholic Cemetery for Foreigners", coordinates: [41.8763, 12.4804], description: "The Non-Catholic Cemetery adds quiet literary and expatriate history near the Pyramid. It is one of Testaccio's best slow cultural stops.", photo: "https://upload.wikimedia.org/wikipedia/commons/6/62/Cimitero_acattolico_Roma.JPG" },
    { id: "testaccio-porta-san-paolo", name: "Porta San Paolo", coordinates: [41.8766, 12.4803], description: "Porta San Paolo and the Pyramid edge give Testaccio an ancient-gate frame, useful before moving toward Ostiense or the cemetery. Porta San Paolo's value is its role in the route: it adds a concrete experience, a timing choice, and a reason to save the stop rather than wander past it. Check Porta San Paolo's current hours and fit it into the nearby cluster instead of treating it as a standalone errand.", photo: "https://upload.wikimedia.org/wikipedia/commons/e/e6/Porta_San_Paolo_Rome.jpg" },
  ], "Mattatoio, Monte, and Memory", "Testaccio culture is material: amphora hill, slaughterhouse reuse, cemetery quiet, and ancient edges that explain the neighborhood's food and working-city identity.", romeCultureSources),
  neighborhoodGuide("Prati", "Culture", "Culture", [
    { id: "prati-vatican-museums", name: "Vatican Museums", coordinates: [41.9065, 12.4536], description: "The Vatican Museums are the Prati heavyweight and need their own time block. Book ahead and build the rest of the neighborhood around recovery, not more rushing.", photo: photos.vatican },
    { id: "prati-st-peters", name: "St. Peter's Basilica", coordinates: [41.9022, 12.4539], description: "St. Peter's gives Prati its clearest landmark pull, but the visit works best when security lines and dress code are part of the plan.", photo: photos.vatican },
    { id: "prati-castel-santangelo", name: "Castel Sant'Angelo", coordinates: [41.9031, 12.4663], description: "Castel Sant'Angelo links Vatican routes back to the river and historic core. The terrace view makes it useful at the end of a museum-heavy day.", photo: "https://upload.wikimedia.org/wikipedia/commons/5/51/RomaCastelSantAngelo.jpg" },
    { id: "prati-palazzo-giustizia", name: "Palazzo di Giustizia", coordinates: [41.9037, 12.4717], description: "Palazzo di Giustizia is a useful Prati orientation point, giving the district civic scale before the route turns toward food, bars, or the river. The draw is architectural presence rather than an interior visit: it helps explain Prati's formal grid and riverfront character. Use it as a route marker between Castel Sant'Angelo, the river, and nearby aperitivo stops.", photo: "https://upload.wikimedia.org/wikipedia/commons/7/74/Palazzo_di_Giustizia_%28Rome%29.jpg" },
  ], "Vatican Scale and River Edges", "Prati culture is about pacing the Vatican correctly, then using the river and civic grid to make the area feel like a neighborhood instead of a queue.", romeCultureSources),
  neighborhoodGuide("Garbatella", "Culture", "Culture", [
    { id: "garbatella-alberghi-suburbani", name: "Alberghi Suburbani", coordinates: [41.8624, 12.4886], description: "The Alberghi Suburbani give Garbatella its urban-planning identity: courtyards, social housing history, and village-like streets that reward slow looking. The value is architectural context, especially if you walk slowly enough to notice stairways, gardens, and shared spaces. Pair it with Palladium or a local meal so the area reads as a lived district, not just a detour.", photo: undefined },
    { id: "garbatella-teatro-palladium", name: "Teatro Palladium", coordinates: [41.8604, 12.4887], description: "Teatro Palladium is the neighborhood's performance anchor, useful for understanding Garbatella as a lived cultural district rather than a scenic detour. Teatro Palladium gives the area more context than a surface-level walk, whether through architecture, collections, street history, or a quieter interior. Check Teatro Palladium's current opening days and ticket needs, then place it where the route can slow down enough to absorb it.", photo: undefined },
    { id: "garbatella-centrale-montemartini", name: "Centrale Montemartini", coordinates: [41.8691, 12.4775], description: "Centrale Montemartini sits on the Ostiense edge, pairing classical sculpture with industrial architecture. It is the strongest nearby museum for a Garbatella route.", photo: "https://upload.wikimedia.org/wikipedia/commons/c/c6/Centrale_Montemartini_08.jpg" },
    { id: "garbatella-san-paolo", name: "Basilica Papale San Paolo fuori le Mura", coordinates: [41.8587, 12.477], description: "San Paolo fuori le Mura is just outside Garbatella but gives the area a major basilica counterweight to central Rome. It works well with an Ostiense/Garbatella day.", photo: "https://upload.wikimedia.org/wikipedia/commons/6/6b/San_Paolo_fuori_le_mura_Rome.jpg" },
  ], "Garden-City Rome and Industrial Edges", "Garbatella culture is about planning history, courtyards, local theaters, and the Ostiense edge rather than the standard ancient-center circuit.", romeCultureSources),
  neighborhoodGuide("Celio", "Culture", "Culture", [
    { id: "celio-colosseum", name: "Colosseum", coordinates: [41.8902, 12.4922], description: "The Colosseum is Celio's unavoidable anchor, but it works best as part of a timed ancient-city block rather than a standalone photo stop. Colosseum gives the area more context than a surface-level walk, whether through architecture, collections, street history, or a quieter interior. Check Colosseum's current opening days and ticket needs, then place it where the route can slow down enough to absorb it.", photo: photos.colosseum },
    { id: "celio-roman-forum", name: "Roman Forum and Palatine Hill", coordinates: [41.8925, 12.4853], description: "The Forum and Palatine give the Colosseum context, turning the route into urban history instead of spectacle alone. Leave room for walking and heat.", photo: photos.colosseum },
    { id: "celio-san-clemente", name: "Basilica di San Clemente", coordinates: [41.8894, 12.4975], description: "San Clemente is the layered Rome stop par excellence, with church levels and archaeology that make Celio feel deeper than the arena crowds suggest. Basilica di San Clemente gives the area more context than a surface-level walk, whether through architecture, collections, street history, or a quieter interior. Check Basilica di San Clemente's current opening days and ticket needs, then place it where the route can slow down enough to absorb it.", photo: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Basilica_di_San_Clemente_al_Laterano_-_Rome.jpg" },
    { id: "celio-santo-stefano", name: "Santo Stefano Rotondo", coordinates: [41.8845, 12.4964], description: "Santo Stefano Rotondo is the quieter circular church stop, good for travelers who want Celio's religious architecture without another major crowd. Its unusual plan and calm interior contrast sharply with the Colosseum flow nearby.", photo: "https://upload.wikimedia.org/wikipedia/commons/a/a1/Santo_Stefano_Rotondo_Rome.jpg" },
  ], "Ancient Rome Beyond the Arena", "Celio's culture guide keeps the Colosseum in context with the Forum, layered churches, and quieter streets that make the ancient core feel less one-note.", romeCultureSources),
];

const neighborhoodNightlifeGuides = [
  neighborhoodGuide("Centro Storico", "Nightlife", "Bars", [
    { id: "centro-bar-fico", name: "Bar del Fico", coordinates: [41.8985, 12.4709], description: "Bar del Fico is a lively Navona-area cafe-bar with outdoor tables, aperitivo energy, and a natural meeting-point role. Use it for a first drink or casual nightcap in the historic core.", price: "$$", priceSource: "Google Maps", photo: undefined },
    { id: "centro-salotto-42", name: "Salotto 42", coordinates: [41.899, 12.4791], description: "Salotto 42 gives the Pantheon area a stylish aperitivo and cocktail room for a more polished central drink. It works before dinner, after dinner, or when the night wants design over volume.", price: "$$", priceSource: "Time Out / Google Maps", photo: undefined },
    { id: "centro-jerry-thomas", name: "The Jerry Thomas Speakeasy", coordinates: [41.8961, 12.4711], description: "Jerry Thomas is the reservation-minded cocktail stop for travelers who want Centro nightlife with intention rather than wandering into the nearest piazza bar. The value is a focused cocktail format and a room that rewards planning. Confirm current booking rules, entry details, and opening days before building the evening around it.", price: "$$$", priceSource: "Time Out / Google Maps", photo: undefined },
  ], "Piazza Drinks and Cocktail Rooms", "Centro nightlife is best when it is selective: a piazza standby, one polished aperitivo room, and one serious cocktail plan.", romeNightlifeSources),
  neighborhoodGuide("Trastevere", "Nightlife", "Bars", [
    { id: "trastevere-freni", name: "Freni e Frizioni", coordinates: [41.8894, 12.4714], description: "Freni e Frizioni is the aperitivo anchor that turns Trastevere's social energy into an easy first stop. Go for spritzes, crowd energy, and a night that can branch toward dinner, beer, or wine.", price: "$$", priceSource: "Time Out / Google Maps", photo: undefined },
    { id: "trastevere-ma-che", name: "Ma Che Siete Venuti a Fà", coordinates: [41.8896, 12.4733], description: "Ma Che Siete Venuti a Fa gives Trastevere a compact craft-beer stop amid wine bars and piazza drinks. Use it before or after dinner when the group wants taps, bustle, and something sharper than another spritz.", price: "$$", priceSource: "The Infatuation / Google Maps", photo: undefined },
    { id: "trastevere-enoteca-ferrara", name: "Enoteca Ferrara", coordinates: [41.889, 12.4707], description: "Enoteca Ferrara is the wine-led Trastevere option for travelers who want a slower drink with food context rather than only bar spillover. It works before dinner or as the night itself when the group wants bottles, glasses, and a seated rhythm.", price: "$$", priceSource: "Google Maps / local editorial guides", photo: undefined },
  ], "Aperitivo, Beer, and Wine Lanes", "Trastevere nightlife can be chaotic, so this set gives it structure: aperitivo crowds, serious beer, and a wine room that can carry a slower evening.", romeNightlifeSources),
  neighborhoodGuide("Monti", "Nightlife", "Bars", [
    { id: "monti-blackmarket", name: "Blackmarket Hall", coordinates: [41.8944, 12.4916], description: "Blackmarket Hall is Monti's late-room pick for cocktails, music, and a moodier alternative to open-air piazza drinking after dinner.", price: "$$", priceSource: "Time Out / Google Maps", photo: undefined },
    { id: "monti-ai-tre-scalini", name: "Ai Tre Scalini", coordinates: [41.8955, 12.4913], description: "Ai Tre Scalini is the wine-bar/trattoria bridge that makes Monti nights easy to start without committing to a full bar crawl. It works for a glass, a snack, or a low-key dinner drift.", price: "$$", priceSource: "Google Maps / local editorial guides", photo: undefined },
    { id: "monti-charity-cafe", name: "Charity Café", coordinates: [41.8952, 12.4927], description: "Charity Cafe adds live music and a low-key bar rhythm to the Monti set, useful when the night should stay local after dinner. The value is programming and atmosphere rather than landmark scenery, so it works best when music is part of the plan. Confirm current event listings before making it the anchor of the evening.", price: "$$", priceSource: "Google Maps / venue listings", photo: undefined },
  ], "Monti After the Ruins", "Monti nightlife is small-scale and walkable: wine, cocktails, and music rooms that make sense after Colosseum-area dinners.", romeNightlifeSources),
  neighborhoodGuide("Testaccio", "Nightlife", "Bars", [
    { id: "testaccio-tram-depot", name: "Tram Depot", coordinates: [41.8792, 12.4782], description: "Tram Depot is Testaccio's outdoor aperitivo and cocktail stop, especially useful in warm weather when the neighborhood needs a casual first drink.", price: "$$", priceSource: "Google Maps / local editorial guides", photo: undefined },
    { id: "testaccio-oasi-birra", name: "L'Oasi della Birra", coordinates: [41.8774, 12.4777], description: "L'Oasi della Birra gives Testaccio a beer, wine, and aperitivo stop close to the market and old food lanes. Use it when the night should stay casual before or after a Roman dinner.", price: "$$", priceSource: "Google Maps / local editorial guides", photo: undefined },
    { id: "testaccio-lalibi", name: "L'Alibi", coordinates: [41.8761, 12.4783], description: "L'Alibi represents Testaccio's late club edge, useful when the night should move past aperitivo into dancing, DJs, and a louder post-dinner plan.", price: "$$", priceSource: "Resident Advisor / Google Maps", photo: undefined },
  ], "Aperitivo to Late Testaccio", "Testaccio nightlife has range: outdoor drinks, group-friendly cocktails, and a late club edge tied to the district's post-dinner energy.", romeNightlifeSources),
  neighborhoodGuide("Prati", "Nightlife", "Bars", [
    { id: "prati-be-re", name: "Be.Re.", coordinates: [41.9065, 12.4588], description: "Be.Re. is Prati's craft-beer anchor, especially useful after Vatican Museums when the plan needs something casual and current.", price: "$$", priceSource: "Google Maps / beer guides", photo: undefined },
    { id: "prati-chorus", name: "Chorus Café", coordinates: [41.9036, 12.4628], description: "Chorus Cafe gives Prati a polished cocktail room near the Vatican approach, better for a seated drink than a pub crawl. Use it when the evening wants a more dressed-up pause without crossing back into Centro.", price: "$$$", priceSource: "Time Out / Google Maps", photo: undefined },
    { id: "prati-sorpasso-bar", name: "Il Sorpasso", coordinates: [41.9075, 12.4597], description: "Il Sorpasso works as the wine-and-aperitivo pick, bridging Prati's restaurant scene with a relaxed first-drink plan after Vatican time.", price: "$$", priceSource: "Eater / Google Maps", photo: undefined },
  ], "After the Vatican", "Prati nightlife is best as decompression after museum or basilica time: beer, wine, and cocktails without crossing back into the old-city crush.", romeNightlifeSources),
  neighborhoodGuide("Garbatella", "Nightlife", "Bars", [
    { id: "garbatella-la-mescita", name: "La Mescita", coordinates: [41.8611, 12.4873], description: "La Mescita is a neighborhood nook for local and organic wines, Italian tapas, and outdoor seating. It is the low-pressure Garbatella stop when the night should stay local.", price: "$$", priceSource: "Google Maps", photo: undefined },
    { id: "garbatella-vinile", name: "Vinile", coordinates: [41.862, 12.487], description: "Vinile gives Garbatella a music-and-drinks option for live shows, dancing, and a louder night than the district's wine bars. Use it when programming matters more than a quiet glass.", price: "$$", priceSource: "Google Maps / venue listings", photo: undefined },
    { id: "garbatella-30-formiche", name: "30 Formiche", coordinates: [41.8796, 12.5153], description: "30 Formiche is the southeast-Rome live-music fallback when the night needs bands, DJs, or a more alternative room. It sits beyond Garbatella proper but fits the same after-dark axis.", price: "$", priceSource: "Resident Advisor / Google Maps", photo: undefined },
  ], "Local Wine and Southeast-Rome Music", "Garbatella nights should stay honest: local drinks first, then a nearby live-music option if the route needs more than a neighborhood bar.", romeNightlifeSources),
  neighborhoodGuide("Celio", "Nightlife", "Bars", [
    { id: "celio-coming-out", name: "Coming Out", coordinates: [41.8896, 12.4955], description: "Coming Out is the Celio/Colosseum LGBTQ+ bar anchor, useful for drinks with a landmark view and a more social edge than the surrounding tourist bars.", price: "$$", priceSource: "Google Maps / local nightlife guides", photo: undefined },
    { id: "celio-shamrock", name: "Shamrock Irish Pub Colosseum", coordinates: [41.8901, 12.4938], description: "Shamrock is the practical pub near the Colosseum for beer, screens, and an easy group meeting point after ancient-site time.", price: "$$", priceSource: "Google Maps", photo: undefined },
    { id: "celio-propaganda-bar", name: "Caffè Propaganda", coordinates: [41.8894, 12.4951], description: "Caffe Propaganda is the polished Celio drink-and-dessert option, useful for a calmer nightcap after ancient-site days or a seated pause near the Colosseum.", price: "$$", priceSource: "Time Out / Google Maps", photo: undefined },
  ], "Colosseum Drinks Without Drifting", "Celio nightlife is compact: a queer landmark bar, an easy pub, and a polished nightcap keep the area useful after sightseeing.", romeNightlifeSources),
];

const romeNeighborhoodStayGuides = [
  stayGuide("Centro Storico", "Hotels", hotelStops.centro, "Central Hotels for Walkable Rome", "Centro hotels are about convenience with tradeoffs: premium prices, heavy foot traffic, and unmatched access to Pantheon, Campo, Trevi, and late dinners."),
  stayGuide("Centro Storico", "Hostels", hostelStops.centro, "Hostel Bases Near the Historic Core", "True Centro hostels are limited, so this guide uses the strongest nearby hostel operations that honestly serve the historic core by foot or quick transit."),
  stayGuide("Trastevere", "Hotels", hotelStops.trastevere, "Courtyards and Quieter Corners", "Trastevere hotels work best when they keep the neighborhood's dinner energy close but protect sleep with courtyards, upper-lane calm, or modern room standards."),
  stayGuide("Trastevere", "Hostels", hostelStops.trastevere, "Social Stays for Trastevere Nights", "Trastevere hostel supply is thin, so the strongest picks balance one local option with better-supported hostel bases for travelers using the area mainly at night."),
  stayGuide("Monti", "Hotels", hotelStops.monti, "Boutique Bases by Ancient Rome", "Monti hotels are ideal when ruins, Termini, and independent neighborhood life all matter; the best choices stay small-scale rather than resort-like."),
  stayGuide("Monti", "Hostels", hostelStops.monti, "Dorms Near Monti and the Colosseum", "Monti is one of Rome's better hostel zones because Colosseum access, Termini logistics, and evening bars can all work without a long commute."),
  stayGuide("Testaccio", "Hotels", hotelStops.testaccio, "Sleep Near the Food Neighborhood", "Testaccio hotels are practical and quieter than Centro; the point is market access, trattoria nights, and Aventine/Ostiense edges rather than postcard views."),
  stayGuide("Testaccio", "Hostels", hostelStops.testaccio, "Budget Bases for Testaccio Routes", "There are few pure Testaccio hostels, so this guide favors nearby bases that support food-led evenings without pretending every bed is in the neighborhood."),
  stayGuide("Prati", "Hotels", hotelStops.prati, "Vatican-Side Hotels With Breathing Room", "Prati hotels are about Vatican access, calmer streets, and river walks; choose them when museum timing and sleep quality matter more than old-city romance."),
  stayGuide("Prati", "Hostels", hostelStops.prati, "Hostel Options for Vatican Days", "Prati has limited hostel density, so this guide separates the closest hostel-style stays from stronger social bases that still work for Vatican itineraries."),
  stayGuide("Garbatella", "Hotels", hotelStops.garbatella, "Value Bases South of the Center", "Garbatella-area hotels are for travelers who want value, transit, and southeast Rome access more than central sightseeing convenience."),
  stayGuide("Garbatella", "Hostels", hostelStops.garbatella, "Budget Beds for Southeast Rome", "Garbatella is not a hostel-heavy district, so these picks are honest nearby options for budget travelers using the neighborhood as a food or culture route."),
  stayGuide("Celio", "Hotels", hotelStops.celio, "Sleep Beside Ancient Rome", "Celio hotels make sense when Colosseum access is the point, with choices ranging from landmark-view splurge to practical midrange rooms."),
  stayGuide("Celio", "Hostels", hostelStops.celio, "Hostels Around the Colosseum", "Celio is one of the easier Rome areas for hostel travelers because Monti, Termini, and the Colosseum corridor create a useful cluster of budget beds."),
] satisfies MapList[];

const romePriorityStayGuides = [
  stayGuide("Monti", "Hostels", hostelStops.monti, "Monti Hostels Near the Colosseum", "A focused Monti hostel guide for travelers who want Colosseum access, Termini logistics, and evening bars without needing a long hotel-style shortlist."),
] satisfies MapList[];

export const romeGuides = [
  ...romeCoreGuides,
  ...neighborhoodFoodGuides,
  ...neighborhoodCultureGuides,
  ...neighborhoodNightlifeGuides,
  ...romePriorityStayGuides,
] satisfies MapList[];
