import type { GuideStop, ListCategory, ListSource, MapList } from "@/types";
import { buildNatureGuide } from "@/data/guides/nature-guide-builder";

const createdAt = "2026-07-19T00:00:00.000Z";
const checkedAt = "2026-07-19";

const viennaLocation = {
  city: "Vienna",
  country: "Austria",
  continent: "Europe",
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

const verifiedMediaSources: Record<string, string> = {
  "Mraz & Sohn Vienna.jpg": "https://cdn.sanity.io/images/oismmolt/production/a8a86c2b160a4c04ad3d0e1e128d4d86b84aa51b-3600x3600.jpg?w=1920&fit=max&auto=format",
  "Pramerl and the Wolf Vienna.jpg": "https://pramerlandthewolf.com/wp-content/uploads/2021/05/PW-katsey__T1A9308_SCHWARZ.jpg",
  "TIAN Restaurant Vienna.jpg": "https://www.tian-restaurant.com/wien/wp-content/uploads/sites/2/2018/07/Tian-Restaurant-Wien-Es-lebel-das-Leben.jpg",
  "Gasthaus Stern Wien.jpg": "https://www.gasthausstern.at/images/20190218_stern-154-bearbeitet-l-3.jpg?crc=4045472495",
  "Reznicek Vienna restaurant.jpg": "https://static.wixstatic.com/media/6a4f52_086128989e214d9b9d868cd9177b9f82~mv2.jpg",
  "MAST Weinbistro Vienna.jpg": "https://www.mast.wine/pluginAppObj/pluginAppObj_21_35/Pitra-Lacina-Breitzke-2--TransgourmetChristian-Maislinger.jpg",
  "Meierei im Stadtpark Wien.jpg": "https://commons.wikimedia.org/wiki/Special:FilePath/Meierei%20im%20Stadtpark%202.jpg",
  "Skopik and Lohn Vienna.jpg": "https://skopikundlohn.at/wp-content/uploads/2024/11/SL_04_SkopikLohn_002-2048x1365.jpg",
  "Trzesniewski Dorotheergasse Vienna.jpg": "https://www.trzesniewski.at/og/branch/1.jpg?v=1",
  "Würstelstand Albertina Vienna.jpg": "https://commons.wikimedia.org/wiki/Special:FilePath/Wien%2001%20W%C3%BCrstelstand%20Bitzinger%20a.jpg",
  "Würstelstand Leo Vienna.jpg": "https://wuerstelstandleo.at/wp-content/uploads/2025/12/LEO_shop.webp",
  "Wiener Würstelstand Pfeilgasse.jpg": "https://linktr.ee/og/image/wienerwuerstelstand.jpg",
  "Leberkas Pepi Operngasse Vienna.jpg": "https://commons.wikimedia.org/wiki/Special:FilePath/Leberkas-Pepi%20in%20Wien.jpg",
  "Kolar Beisl Vienna.jpg": "https://www.kolar-beisl.at/wp-content/uploads/2015/01/DSC_2835.jpg",
  "Der Wiener Deewan Vienna.jpg": "https://s3.amazonaws.com/onthegrid.city/assets/grid/vienna/alsergrund/der-wiener-deewan/_facebookImageTransform/Maria-Ritsch-529B6613_wienerdeewan.jpg",
  "NENI am Naschmarkt Vienna.jpg": "https://nenifood.com/application/images/nan/dsc03442.jpg",
  "Gasthaus Kopp Vienna.jpg": "https://lirp.cdn-website.com/55e47070/dms3rep/multi/opt/20200505_134840-3cf7cb11-1920w.jpg",
  "Swing Kitchen Schwedenplatz Vienna.jpg": "https://www.swingkitchen.com/wp-content/uploads/2026/01/schwedenplatz-innenansicht-e1769080143695-705x705.webp",
  "Rosewood Vienna hotel.jpg": "https://images.rosewoodhotels.com/is/image/rwhg/rwvie_destination_DSC8230",
  "Hotel Imperial Vienna.jpg": "https://commons.wikimedia.org/wiki/Special:FilePath/Wien%20-%20Hotel%20Imperial.jpg",
  "Park Hyatt Vienna.jpg": "https://commons.wikimedia.org/wiki/Special:FilePath/Vienna-City%2C%20the%20Park%20Hyatt%20Vienna.jpg",
  "The Guesthouse Vienna.jpg": "https://theguesthouse.at/_Resources/Persistent/7da79a1411f1cb08dc49e5eb1c97a65bfdeb09f9/The_Guesthouse_Vienna_Deluxe_Opera_View_Room_01_Photo_by_Andreas_Scheiblecker-1920x1280.jpg",
  "Sans Souci Vienna hotel.jpg": "https://commons.wikimedia.org/wiki/Special:FilePath/Hotel%20Sans%20Souci%20Exterior.jpg",
  "Altstadt Vienna hotel.jpg": "https://www.altstadt.at/fileadmin/_processed_/e/f/csm_altstadt_open-graph_1200x630_ee0e621158.jpg",
  "Hotel Josefine Vienna.jpg": "https://media.booking-channel.com/api/hotels/3555/images/47.jpeg",
  "25hours Hotel MuseumsQuartier Vienna.jpg": "https://25hours-hotels.com/wp-content/uploads/sites/39/2024/08/25h_at_museumsquartier_hotelpage_header_1.jpg",
  "magdas HOTEL Vienna City.jpg": "https://magdas-hotel.at/storage/app/media//magdas_HOTEL_Vienna_City_Apartment_web_c_Julia-Geiter_005_1200x950.png",
  "Hostel Ruthensteiner Vienna.jpg": "https://hostelruthensteiner.com/wp-content/uploads/2023/06/lush-green-hostel-garden-vienna.jpg",
  "Wombats City Hostel Vienna Naschmarkt.jpg": "https://www.wombats-hostels.com/fileadmin/_processed_/0/9/csm_1.1.201907101634-0139-PNL_8631-Luiza_Puiu_907cce5b08.webp",
  "JO and JOE Vienna hostel.jpg": "https://www.joandjoe.com/vienna/wp-content/uploads/sites/9/2023/03/JOJOE_Vienna_Hero_image.jpg",
  "St Christophers Vienna hostel.jpg": "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/3/312724/rwfwmcv9dllbgelr1lix.jpg",
  "Vienna Boutique Hostel Kandlgasse.jpg": "https://viennaboutique.at/wp-content/uploads/2022/04/Hostel2021_DSC3447_big-480x480.jpg",
  "Stadtaffe Chic Hostel Vienna.jpg": "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/3/316937/esrwymajyjf96d4cc2zq.jpg",
  "A and T Hotel Hostel Vienna.jpg": "https://vienna-at.com/data/Photos/1920x1080w/17583/1758357/1758357231.JPEG",
  "MEININGER Vienna Downtown Franz.jpg": "https://www.meininger-hotels.com/fileadmin/_processed_/e/7/csm_Hotel_Header_Hotel_3543x2316_VIE-RS-2.desktop_e047e8dfc8.jpg",
  "Jugendherberge Wien Myrthengasse.jpg": "https://www.oejhv.at/wp-content/uploads/Wien-Jugendherberge-Myrthengasse.jpg",
  "Cafe Bendl Vienna.jpg": "https://bendl.wordpress.com/wp-content/uploads/2016/03/cropped-img_6004.jpg",
  "Espresso Burggasse Vienna.jpg": "https://commons.wikimedia.org/wiki/Special:FilePath/Espresso%20Wien.jpg",
  "Schikaneder Kino Vienna.jpg": "https://www.schikaneder.at/jart/prj3/schikaneder/images/cache/b213a176898e4e7fdd7fd181688da2f8/0x3DCB279E0209F603961C2DED64541773.jpeg",
  "Kaenguruh Pub Vienna.jpg": "https://img3.restaurantguru.com/w550/h367/r38e-Kaenguru-design-2025-08.jpg",
  "1516 Brewing Company Vienna.jpg": "https://www.1516brewingcompany.com/web/wp-content/uploads/2022/05/J0A0265-11-scaled.jpg",
  "Ammutson Craft Beer Dive Vienna.jpg": "https://img3.restaurantguru.com/w550/h367/r8d1-interior-AmmutsOn-Craft-Beer-Dive-2025-08.jpg",
  "Brauhund Vienna.jpg": "https://images.squarespace-cdn.com/content/v1/5ebce0a1cf2c4023b544d3f6/1603549865023-TMA6GIGQRWNCL1YYSIUI/IMG_4870-1-low.jpg",
  "Beaver Brewing Company Vienna.jpg": "https://static.wixstatic.com/media/6e2705_602404ffb235422280d0f94f9e4ff0cff000.jpg",
  "Rhiz Vienna Guertel.jpg": "https://dev.rhizosphere.vision/wp-content/uploads/2024/11/welcome.jpg",
  "Loos American Bar Vienna.jpg": "https://commons.wikimedia.org/wiki/Special:FilePath/American%20Bar%20Adolf%20Loos%20Vienna%201908%2001.jpg",
  "Kleinod Vienna bar.jpg": "https://static.wixstatic.com/media/c85ce7_298c9c1520564e28b58a73176ebbda0b~mv2_d_4890_2875_s_4_2.jpg",
  "Tuer 7 Vienna bar.jpg": "https://img.restaurantguru.com/reviews/small/w550/h367/1052717.jpg",
  "Josef Cocktail Bar Vienna.jpg": "https://images.squarespace-cdn.com/content/v1/679950e06df2220ee04a1564/25d3fb08-e8e2-46fa-b341-71aa70693862/JOSEF_Web_cocktails_7.jpg",
  "Miranda Bar Vienna.jpg": "https://www.wien.info/resource/image/304774/19x10/1200/630/69f72c6884ad56ca0a168b920324922d/08BB6E81B7DA2CDAD1AED5F0239E68BB/miranda-bar-cocktailbar-bar.jpg",
  "Krypt Bar Vienna.jpg": "https://static.wixstatic.com/media/ee15fa_9e469faa47b84f919a1fba1210adc696~mv2.jpg",
  "The Sign Lounge Vienna.jpg": "https://static.wixstatic.com/media/08ea4d_5fe5f9e5f2b84bcfb3cbdf19df99f735~mv2.jpg",
  "Moby Dick Cocktailbar Vienna.jpg": "https://static.wixstatic.com/media/e6e0f4_8cafdd4d178d4c78a0501dbf0c10a213~mv2.jpg",
  "Dinos Apothecary Bar Vienna.jpg": "https://dinos.at/wp-content/uploads/Dino-s-American-Bar-Wien-scaled.jpg",
  "First Floor Bar Vienna.jpg": "https://www.firstfloorbar.at/album/show_large/ad1ak6ng2ruo.jpg",
  "Leopold Museum Vienna.jpg": "https://www.leopoldmuseum.org/media/image/c950x576/5365.jpg",
  "Jewish Museum Vienna Dorotheergasse.jpg": "https://www.jmw.at/jart/prj3/jmw/images/cache/c88ed9576b03a211780b1221b81a7a16/0x973B2A12FDE1DCCBD67ED3BDD5529B19.jpeg",
  "MAK Museum Vienna.jpg": "https://www.mak.at/jart/prj3/mak-resp/images/cache/f36a384e47a2c8e0aa906f9ca60c4391/0x6BE0CB0D7F1383CC9990C9E76531B401.jpeg",
  "Haus der Musik Vienna.jpg": "https://www.hdm.at/wp-content/uploads/2023/10/Haus-Der-Musik_VirtuellerDirigent-2%C2%A9HannaPribitzer-1.jpg",
  "Hofburg Vienna Michaelertrakt.jpg": "https://www.sisimuseum-hofburg.at/fileadmin/_processed_/e/4/csm_Sisi_Museum_Michaelerplatz_0064_c__Schloss_Schoenbrunn_Kultur-_und_Betriebsges.m.b.H._-_Severin_Wurnig_web_0e19c4f8da.jpg",
  "Wiener Riesenrad Vienna.jpg": "https://wienerriesenrad.com/wp-content/uploads/2026/04/Wiener_Riesenrad_Daemmerung2-1-1.jpg",
  "Kahlenberg Vienna view.jpg": "https://www.wien.info/resource/image/301968/3x2/1040/693/f7e2657cd1707ca75615406639c044d/F7999CF61FCAC993EF94A0E6C78E0E29/kahlenberg-wienerwald-wandern-wiener-hausberg-berg-wanderung-route-weinberge-weingaerten-ausblick-aussicht.webp",
};

function media(file: string) {
  if (verifiedMediaSources[file]) return verifiedMediaSources[file];
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}`;
}

const sources = {
  dining: [
    source("MICHELIN Guide Austria 2026", "https://www.michelin.com/en/publications/products-and-services/michelin-guide-austria-2026"),
    source("Vienna Tourist Board - dining", "https://www.wien.info/en/dine-drink"),
    source("Vienna Tourist Board - modern Beisl", "https://www.wien.info/en/dine-drink/viennese-cuisine/modern-viennese-inns-364186"),
    source("Steirereck official", "https://steirereck.net/en/steirereck/kontakt"),
    source("Mraz & Sohn official", "https://www.mrazundsohn.at/products/call?lang=en"),
    source("Konstantin Filippou official", "https://konstantinfilippou.com/restaurant/reservations/"),
    source("Pramerl & the Wolf official", "https://pramerlandthewolf.com/"),
    source("TIAN Wien official", "https://www.tian-restaurant.com/wien/en/"),
    source("Gasthaus Stern official", "https://www.gasthausstern.at/speisen.html"),
    source("Reznicek official", "https://www.reznicek.co.at/en"),
    source("MAST Weinbistro official", "https://www.mast.wine/kontakt.html"),
    source("Meierei im Stadtpark official", "https://www.steirereck.at/en/meierei"),
    source("Skopik & Lohn official", "https://skopikundlohn.at/kontakt/"),
    source("Google Maps - Vienna restaurants", maps("best restaurants Vienna Austria")),
  ],
  cheapEats: [
    source("Vienna Tourist Board - street food", "https://www.wien.info/en/dine-drink/viennese-cuisine/viennese-street-food-516784"),
    source("Vienna Tourist Board - sausage stands", "https://www.wien.info/en/dine-drink/viennese-cuisine/hot-dog-stands-348128"),
    source("City of Vienna - Naschmarkt", "https://www.wien.gv.at/freizeit/naschmarkt"),
    source("Trzesniewski Dorotheergasse official", "https://www.trzesniewski.at/filialen/dorotheergasse"),
    source("Bitzinger Würstelstand official", "https://bitzinger.wien/en/wuerstelstand/"),
    source("Würstelstand LEO official", "https://wuerstelstandleo.at/en/"),
    source("Wiener Würstelstand official", "https://www.wienerwue.at/"),
    source("Leberkas-Pepi official", "https://www.leberkaspepi.at/standorte.php"),
    source("Kolar official", "https://www.kolar-beisl.at/tagesfladen-neu/"),
    source("Der Wiener Deewan official", "https://deewan.at/d1-d1"),
    source("NENI am Naschmarkt official", "https://nenifood.com/restaurants/naschmarkt"),
    source("Gasthaus Kopp official", "https://www.gasthaus-kopp.at/en-gb"),
    source("Swing Kitchen official", "https://www.swingkitchen.com/"),
    source("Google Maps - Vienna cheap eats", maps("best cheap eats Vienna Austria")),
  ],
  hotels: [
    source("Condé Nast Traveller - best Vienna hotels", "https://www.cntraveller.com/gallery/vienna-hotels-best"),
    source("Condé Nast Traveler - Vienna hotels", "https://www.cntraveler.com/gallery/best-hotels-in-vienna-austria"),
    source("Hotel Sacher Wien official", "https://www.sacher.com/en/vienna/"),
    source("Rosewood Vienna official", "https://www.rosewoodhotels.com/en/vienna"),
    source("Hotel Imperial Vienna official", "https://www.imperialvienna.com/en"),
    source("Park Hyatt Vienna official", "https://www.hyatt.com/en-US/hotel/austria/park-hyatt-vienna/vieph"),
    source("The Guesthouse Vienna official", "https://theguesthouse.at/en"),
    source("Hotel Sans Souci Vienna official", "https://www.sanssouci-wien.com/en/"),
    source("Altstadt Vienna official", "https://www.altstadt.at/en/"),
    source("Hotel Josefine official", "https://www.hoteljosefine.at/en/"),
    source("25hours Hotel MuseumsQuartier official", "https://25hours-hotels.com/vienna/at-museumsquartier/"),
    source("magdas HOTEL Vienna City official", "https://magdas-hotel.at/en/vienna-city/"),
    source("Vienna Tourist Board - accommodation", "https://www.wien.info/en/travel-info/hotels-accomodations"),
    source("Google Travel - Vienna hotels", "https://www.google.com/travel/hotels/Vienna"),
  ],
  hostels: [
    source("Hostelworld - Vienna hostels", "https://www.hostelworld.com/st/hostels/europe/austria/vienna/"),
    source("Vienna Tourist Board - hostels", "https://www.wien.info/en/travel-info/hotels-accomodations/youth-hostels-camping-366504"),
    source("Hostel Ruthensteiner official", "https://hostelruthensteiner.com/"),
    source("Wombat's Vienna official", "https://www.wombats-hostels.com/vienna"),
    source("JO&JOE Vienna official", "https://www.joandjoe.com/vienna/en/"),
    source("St Christopher's Vienna official", "https://www.st-christophers.co.uk/vienna/"),
    source("Vienna Boutique Hostel official", "https://viennaboutique.at/"),
    source("Stadtaffe official", "https://www.stadtaffe.at/"),
    source("A&T Hotel and Hostel official", "https://www.athostel.com/home_en/"),
    source("a&o Wien Hauptbahnhof official", "https://www.aohostels.com/en/vienna/vienna-hauptbahnhof/"),
    source("MEININGER Downtown Franz official", "https://www.meininger-hotels.com/en/hotels/vienna/hotel-vienna-downtown-franz/"),
    source("Hostel Wien Myrthengasse official", "https://www.oejhv.at/en/youth-hostels/vienna/1070-vienna/"),
    source("Hostel Wien Myrthengasse 2026 rates", "https://www.oejhv.at/wp-content/uploads/Preisliste-1070-Vienna-2026-D-E.pdf"),
    source("Google Travel - Vienna hostels", "https://www.google.com/travel/hotels/Vienna?q=hostels%20vienna"),
  ],
  pubs: [
    source("Vienna Tourist Board - bars and clubs", "https://www.wien.info/en/dine-drink/bars-clubs"),
    source("Vienna Tourist Board - live locations", "https://www.wien.info/en/dine-drink/bars-clubs/live-locations"),
    source("Vienna Tourist Board - Gürtel nightlife", "https://www.wien.info/en/dine-drink/bars-clubs/nightlife-under-subway-354334"),
    source("Café Bendl official", "https://bendl.wordpress.com/"),
    source("Espresso official", "https://www.espresso-wien.at/"),
    source("Schikaneder official", "https://www.schikaneder.at/bar/about_schikaneder"),
    source("Känguruh Pub listing", "https://www.theviennareview.at/food-drink/2165/kanguruh"),
    source("1516 Brewing Company official", "https://www.1516brewingcompany.com/contact/"),
    source("Ammutsøn official", "https://www.ammutson.com/"),
    source("Brauhund official", "https://www.brauhund.com/"),
    source("Beaver Brewing Company official", "https://www.beaverbrewing.at/"),
    source("Chelsea official", "https://www.chelsea.co.at/"),
    source("rhiz official", "https://rhiz.wien/"),
    source("Google Maps - Vienna pubs", maps("best pubs Vienna Austria")),
  ],
  cocktails: [
    source("Vienna Tourist Board - cocktail bars", "https://www.wien.info/en/dine-drink/bars-clubs/bars"),
    source("Falstaff - best bars in Vienna", "https://www.falstaff.com/en/listings/the-best-bars-in-vienna"),
    source("Falstaff Bar Guide 2026", "https://www.falstaff.com/at/news/falstaff-barguide-2026-das-sind-die-besten-bars-und-bartender-oesterreichs"),
    source("Loos American Bar official", "https://www.loosbar.at/"),
    source("Kleinod official", "https://www.kleinod.wien/"),
    source("Tür 7 official", "https://www.tuer7.at/"),
    source("JOSEF Cocktail Bar official", "https://www.josef-bar.at/"),
    source("Miranda Bar official", "https://www.mirandabar.com/"),
    source("krypt.bar official", "https://www.krypt.bar/"),
    source("The Sign Lounge official", "https://www.thesignlounge.at/"),
    source("Moby Dick official", "https://www.mobydickvienna.at/"),
    source("Dino's Apothecary Bar official", "https://dinos.at/kontakt/"),
    source("First Floor official", "https://www.firstfloorbar.at/"),
    source("Google Maps - Vienna cocktail bars", maps("best cocktail bars Vienna Austria")),
  ],
  culture: [
    source("City of Vienna - museums", "https://www.wien.gv.at/en/leisure/museums"),
    source("Vienna Tourist Board - museums", "https://www.wien.info/en/art-culture/museums-exhibitions"),
    source("Kunsthistorisches Museum official", "https://www.khm.at/en/visit/besucherinformation/hours-admission/"),
    source("ALBERTINA official", "https://www.albertina.at/en/visit/opening-hours/"),
    source("Upper Belvedere official", "https://www.belvedere.at/en/visit/upper-belvedere"),
    source("Leopold Museum official", "https://www.leopoldmuseum.org/en/visit/opening-hours"),
    source("mumok official", "https://www.mumok.at/en"),
    source("Wien Museum official", "https://guide.wienmuseum.at/en/seite/oeffnungszeiten"),
    source("Jewish Museum Vienna official", "https://www.jmw.at/en/visit"),
    source("Austrian National Library State Hall official", "https://www.onb.ac.at/en/museums/state-hall/"),
    source("MAK official", "https://www.mak.at/visit"),
    source("House of Music official", "https://www.hdm.at/en/faq/what-are-the-opening-hours-/"),
    source("MuseumsQuartier opening hours", "https://www.mqw.at/en/visit/opening-hours/"),
    source("Google Maps - Vienna museums", maps("best museums Vienna Austria")),
  ],
  activities: [
    source("Vienna Tourist Board - sights", "https://www.wien.info/en/see-do/sights-from-a-to-z"),
    source("Schönbrunn Palace official", "https://www.schoenbrunn.at/en/visitor-information/opening-times/"),
    source("St Stephen's Cathedral visitor page", "https://www.wien.info/en/see-do/sights-from-a-to-z/st-stephens-cathedral-359690"),
    source("Sisi Museum official", "https://www.sisimuseum-hofburg.at/en/visitor-information/opening-hours/"),
    source("Vienna State Opera official", "https://www.wiener-staatsoper.at/en/staatsoper/guided-tours/"),
    source("Spanish Riding School official", "https://www.srs.at/en/visitor-information/vienna/opening-hours"),
    source("Vienna Giant Ferris Wheel official", "https://wienerriesenrad.com/en/opening-times/"),
    source("City of Vienna - Naschmarkt", "https://www.wien.gv.at/freizeit/naschmarkt"),
    source("Upper Belvedere official", "https://www.belvedere.at/en/visit/upper-belvedere"),
    source("Kunsthistorisches Museum official", "https://www.khm.at/en/visit/besucherinformation/hours-admission/"),
    source("Vienna Tourist Board - Kahlenberg", "https://www.wien.info/en/livable-vienna/parks-green-spaces/kahlenberg-337908"),
    source("Vienna Tourist Board - imperial sights", "https://www.wien.info/en/art-culture/imperial-sights"),
    source("Vienna Tourist Board - first visit", "https://www.wien.info/en/see-do"),
    source("Google Maps - Vienna things to do", maps("top things to do Vienna Austria")),
  ],
};

type StopOptions = Partial<GuideStop> & {
  sourcePhoto: string;
  officialUrl: string;
  editorialUrls?: string[];
  mapQuery?: string;
};

function stop(id: string, name: string, coordinates: [number, number], description: string, options: StopOptions): GuideStop {
  const { sourcePhoto, officialUrl, editorialUrls = [], mapQuery, bookingUrl, sourceEvidence, imageSourceUrl, ...rest } = options;
  const mapUrl = sourceEvidence?.mapUrl ?? maps(mapQuery ?? `${name} Vienna Austria`);
  const imageUrl = imageSourceUrl ?? sourcePhoto;
  const officialEvidence = sourceEvidence?.officialUrl ?? officialUrl ?? bookingUrl;
  const sourceUrls = [officialEvidence, mapUrl, imageUrl, ...editorialUrls, ...(options.sourceUrls ?? [])].filter(Boolean) as string[];

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
      imageSourceUrl: imageUrl,
      editorialUrls,
      checkedAt,
      notes: "Source ledger checked the official/property page, a current map-status search, category editorial coverage, and a venue-specific image candidate on 2026-07-19; candidates with closure or material quality warnings were excluded.",
      ...sourceEvidence,
    },
    officialUrl,
    ...(bookingUrl ? { bookingUrl } : {}),
    ...rest,
  };
}

const diningStops: GuideStop[] = [
  stop("vienna-dining-steirereck", "Steirereck", [48.204418, 16.381353], "Heinz Reitbauer's Stadtpark flagship turns Austrian produce, freshwater fish, mountain herbs, and exacting service into Vienna's defining contemporary tasting-menu meal. Reserve well ahead and treat lunch as the slightly calmer way into the room.", { venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["austrian", "fine_dining", "tasting_menu"], price: "$$$$", priceSource: "Official reservations / MICHELIN Guide Austria 2026", attributeTags: ["fine_dining", "tasting_menu", "destination_dining", "reservation_recommended"], hours: { default: "Mon-Fri 11:30 AM-2:30 PM and dinner from 6:30 PM, with last reservations at 9:00 PM; closed Sat-Sun and public holidays." }, officialUrl: "https://steirereck.net/en/steirereck/kontakt", sourcePhoto: media("Wien 03 Steirereck b.jpg"), editorialUrls: ["https://guide.michelin.com/at/en/vienna/wien/restaurant/steirereck-im-stadtpark", "https://www.wien.info/en/dine-drink"] }),
  stop("vienna-dining-mraz-sohn", "Mraz & Sohn", [48.23136, 16.37606], "Mraz & Sohn is Vienna's playful long-form dinner: a family-run room where Markus and Lukas Mraz push Austrian ingredients through irreverent, technically sharp courses. Go hungry, surrender the evening, and do not plan a quick exit.", { venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["creative", "austrian", "tasting_menu"], price: "$$$$", priceSource: "Official booking page / MICHELIN Guide", attributeTags: ["fine_dining", "tasting_menu", "reservation_recommended", "lively_food"], hours: { default: "Mon-Fri 7:00 PM-midnight; closed Sat-Sun." }, officialUrl: "https://www.mrazundsohn.at/products/call?lang=en", sourcePhoto: media("Mraz & Sohn Vienna.jpg"), editorialUrls: ["https://guide.michelin.com/at/en/vienna/wien/restaurant/mraz-sohn", "https://www.wien.info/en/dine-drink"] }),
  stop("vienna-dining-konstantin-filippou", "Restaurant Konstantin Filippou", [48.21076, 16.37978], "Filippou's compact dining room balances his Greek roots with Austrian seafood, game, and vegetables in controlled tasting menus. The short walk from the Danube Canal hides one of the city's most rigorous kitchens.", { venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["mediterranean", "austrian", "fine_dining"], price: "$$$$", priceSource: "Official reservation page / MICHELIN Guide", attributeTags: ["fine_dining", "tasting_menu", "date_night", "reservation_recommended"], hours: { default: "Lunch Mon and Thu-Sat noon-3:00 PM, kitchen closes 2:00 PM; dinner Mon and Thu-Sat 6:00 PM-11:30 PM, kitchen closes 10:00 PM; closed Tue-Wed and Sun." }, officialUrl: "https://konstantinfilippou.com/restaurant/reservations/", sourcePhoto: media("Dominikanerbastei 17.jpg"), editorialUrls: ["https://guide.michelin.com/at/en/vienna/wien/restaurant/konstantin-filippou", "https://www.wien.info/en/dine-drink"] }),
  stop("vienna-dining-pramerl-wolf", "Pramerl & the Wolf", [48.22207, 16.36485], "A former neighborhood Beisl now serves one of Vienna's most intimate tasting menus, with a handful of tables, instinctive plating, and no luxury-hotel cushioning. The personality is direct; the booking commitment is real.", { venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["austrian", "creative", "tasting_menu"], price: "$$$$", priceSource: "Official restaurant / MICHELIN Guide", attributeTags: ["fine_dining", "intimate", "reservation_recommended", "local_favorite"], hours: { default: "Wed-Thu 7:00 PM-midnight; Fri-Sat 6:00 PM-midnight; closed Sun-Tue." }, officialUrl: "https://pramerlandthewolf.com/", sourcePhoto: media("Pramerl and the Wolf Vienna.jpg"), editorialUrls: ["https://guide.michelin.com/at/en/vienna/wien/restaurant/pramerl-the-wolf", "https://www.wien.info/en/dine-drink"] }),
  stop("vienna-dining-tian", "TIAN Wien", [48.20502, 16.37365], "TIAN makes the city's strongest case for vegetarian fine dining, building elaborate menus around vegetables, fermentation, dairy, and carefully sourced produce rather than treating meatlessness as a constraint.", { venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["vegetarian", "fine_dining", "tasting_menu"], price: "$$$$", priceSource: "Official restaurant / MICHELIN Guide", attributeTags: ["vegetarian_friendly", "fine_dining", "tasting_menu", "reservation_recommended"], hours: { default: "Tue-Sat 6:00 PM-11:00 PM; selected December Mondays and holiday services follow the official reservation calendar." }, officialUrl: "https://www.tian-restaurant.com/wien/en/", sourcePhoto: media("TIAN Restaurant Vienna.jpg"), editorialUrls: ["https://guide.michelin.com/at/en/vienna/wien/restaurant/tian", "https://www.wien.info/en/dine-drink"] }),
  stop("vienna-dining-gasthaus-stern", "Gasthaus Stern", [48.1698, 16.4218], "Christian Werner keeps the Viennese inn tradition alive in Simmering through offal, game, schnitzel, and a wine list worth the tram ride. This is the counterweight to center-city dining rooms polished for visitors.", { venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["viennese", "austrian", "offal"], price: "$$$", priceSource: "Official menu / MICHELIN Guide", attributeTags: ["local_favorite", "classic", "reservation_recommended", "midrange"], hours: { default: "Wed-Fri 5:30 PM-11:00 PM; Sat 11:00 AM-11:00 PM; Sun 11:00 AM-4:00 PM; closed Mon-Tue." }, officialUrl: "https://www.gasthausstern.at/speisen.html", sourcePhoto: media("Gasthaus Stern Wien.jpg"), editorialUrls: ["https://guide.michelin.com/at/en/vienna/wien/restaurant/gasthaus-stern-1215810", "https://www.wien.info/en/dine-drink/viennese-cuisine/viennese-cuisine-364190"] }),
  stop("vienna-dining-reznicek", "Reznicek", [48.22823, 16.35739], "Reznicek is a contemporary Wirtshaus with real command of broth, freshwater fish, Backfleisch, offal, cheese, and Austrian wine. The bare tables and warm room keep the meal grounded even when the sourcing gets serious.", { venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["austrian", "regional", "viennese"], price: "$$$", priceSource: "Official menu / MICHELIN Guide", attributeTags: ["local_favorite", "reservation_recommended", "natural_wine", "midrange"], hours: { default: "Tue-Sat 5:00 PM-1:00 AM; closed Sun-Mon and public holidays." }, officialUrl: "https://www.reznicek.co.at/en", sourcePhoto: media("Reznicek Vienna restaurant.jpg"), editorialUrls: ["https://guide.michelin.com/at/en/vienna/wien/restaurant/reznicek", "https://www.wien.info/en/dine-drink"] }),
  stop("vienna-dining-mast", "MAST Weinbistro", [48.2243, 16.3616], "MAST is a wine-first bistro where low-intervention bottles meet precise seasonal cooking without tasting-menu formality. It works for a focused lunch or for letting the sommeliers shape an entire evening.", { venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["austrian", "modern_european", "wine_bar"], price: "$$$", priceSource: "Official menu / MICHELIN Guide", attributeTags: ["natural_wine", "date_night", "reservation_recommended", "midrange"], hours: { default: "Kitchen Wed-Fri noon-2:00 PM and 6:00 PM-10:00 PM; Sat-Sun 6:00 PM-10:00 PM; closed Mon-Tue; public holidays evening only." }, officialUrl: "https://www.mast.wine/kontakt.html", sourcePhoto: media("MAST Weinbistro Vienna.jpg"), editorialUrls: ["https://guide.michelin.com/at/en/vienna/wien/restaurant/mast-weinbistro", "https://www.wien.info/en/dine-drink"] }),
  stop("vienna-dining-meierei", "Meierei im Stadtpark", [48.20446, 16.38128], "Steirereck's brighter sibling turns breakfast, cheese, milk, freshwater fish, and unfussy Austrian plates into an all-day Stadtpark address. It is the practical way to taste the Reitbauer world without committing to the flagship menu.", { venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["austrian", "breakfast", "cheese"], price: "$$$", priceSource: "Official restaurant page / MICHELIN Guide", attributeTags: ["breakfast", "scenic_food", "reservation_recommended", "central"], hours: { default: "Mon-Fri 8:00 AM-11:00 PM; Sat 9:00 AM-7:00 PM; closed Sun and public holidays." }, officialUrl: "https://www.steirereck.at/en/meierei", sourcePhoto: media("Meierei im Stadtpark Wien.jpg"), editorialUrls: ["https://guide.michelin.com/mo/en/vienna/wien/restaurant/meierei-im-stadtpark", "https://www.wien.info/en/dine-drink"] }),
  stop("vienna-dining-skopik-lohn", "Skopik & Lohn", [48.2177, 16.3745], "Beneath Otto Zitko's looping black ceiling, Skopik & Lohn serves a confident bistro menu that moves between schnitzel, fish, oysters, and French technique. It stays stylish without turning dinner into ceremony.", { venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["austrian", "french", "bistro"], price: "$$$", priceSource: "Official menu / Vienna editorial coverage", attributeTags: ["lively_food", "date_night", "reservation_recommended", "design"], hours: { default: "Daily 6:00 PM-midnight." }, officialUrl: "https://skopikundlohn.at/kontakt/", sourcePhoto: media("Skopik and Lohn Vienna.jpg"), editorialUrls: ["https://www.wien.info/en/dine-drink", "https://guide.michelin.com/at/en/vienna/wien/restaurants"] }),
];

const cheapEatStops: GuideStop[] = [
  stop("vienna-cheap-trzesniewski", "Trzesniewski Dorotheergasse", [48.2079, 16.3707], "Vienna's open-faced sandwich institution keeps lunch wonderfully small: choose several finely chopped toppings on rye, add a Pfiff of beer, and eat standing if the room is packed.", { venueKind: "food_drink", foodServiceType: "counter_service", cuisineTypes: ["viennese", "sandwiches"], price: "$", priceSource: "Official menu", attributeTags: ["budget_food", "lunch", "walk_in_friendly", "central"], hours: { default: "Mon-Fri 8:30 AM-7:30 PM; Sat 9:00 AM-6:00 PM; Sun and public holidays 10:00 AM-5:00 PM." }, officialUrl: "https://www.trzesniewski.at/filialen/dorotheergasse", sourcePhoto: media("Trzesniewski Dorotheergasse Vienna.jpg"), editorialUrls: ["https://www.wien.info/en/dine-drink/viennese-cuisine/viennese-street-food-516784"] }),
  stop("vienna-cheap-bitzinger", "Bitzinger Würstelstand Albertina", [48.2045, 16.3682], "Behind the Opera, Bitzinger is the efficient first lesson in Käsekrainer, Bosna, mustard, bread, and late-night curbside Vienna. The setting is tourist-heavy; the sausage-stand ritual is still real.", { venueKind: "food_drink", foodServiceType: "stall", cuisineTypes: ["viennese", "sausages"], price: "$", priceSource: "Official stand menu", attributeTags: ["street_food", "late_night", "walk_in_friendly", "central"], hours: { default: "Daily 8:00 AM-4:00 AM." }, officialUrl: "https://bitzinger.wien/en/wuerstelstand/", sourcePhoto: media("Würstelstand Albertina Vienna.jpg"), editorialUrls: ["https://www.wien.info/en/dine-drink/viennese-cuisine/hot-dog-stands-348128"] }),
  stop("vienna-cheap-leo", "Würstelstand LEO", [48.2321, 16.3528], "LEO has served sausages since 1928 and remains a useful northern late-night stop for Käsekrainer, currywurst, and compact hot dogs away from the Ring's most photographed counters.", { venueKind: "food_drink", foodServiceType: "stall", cuisineTypes: ["viennese", "sausages"], price: "$", priceSource: "Official stand menu", attributeTags: ["street_food", "late_night", "local_favorite", "walk_in_friendly"], hours: { default: "Mon-Thu 10:30 AM-4:00 AM; Fri-Sat 10:30 AM-5:30 AM; Sun and public holidays noon-midnight." }, officialUrl: "https://wuerstelstandleo.at/en/", sourcePhoto: media("Würstelstand Leo Vienna.jpg"), editorialUrls: ["https://www.wien.info/en/dine-drink/viennese-cuisine/hot-dog-stands-348128"] }),
  stop("vienna-cheap-wiener-wue", "Wiener Würstelstand Pfeilgasse", [48.2096, 16.3477], "This Josefstadt stand treats the sausage counter as a modern neighborhood kitchen, with quality meat, vegetarian options, sharp condiments, and a crowd that feels more after-work than sightseeing circuit.", { venueKind: "food_drink", foodServiceType: "stall", cuisineTypes: ["viennese", "sausages", "vegetarian"], price: "$", priceSource: "Official menu", attributeTags: ["street_food", "local_favorite", "vegetarian_friendly", "late_night"], hours: { default: "Daily 12:00 PM-12:00 AM." }, officialUrl: "https://www.wienerwue.at/", sourcePhoto: media("Wiener Würstelstand Pfeilgasse.jpg"), editorialUrls: ["https://www.wien.info/en/dine-drink/viennese-cuisine/hot-dog-stands-348128"] }),
  stop("vienna-cheap-leberkas-pepi", "Leberkas-Pepi Operngasse", [48.2003, 16.368], "A warm slice of Leberkäse in a roll is one of Vienna's best fast meals, and Pepi offers enough versions—from classic to cheese and chili—to make the counter more than a novelty stop.", { venueKind: "food_drink", foodServiceType: "counter_service", cuisineTypes: ["austrian", "leberkase"], price: "$", priceSource: "Official location menu", attributeTags: ["budget_food", "fast_casual", "walk_in_friendly", "central"], hours: { default: "Mon-Thu 9:00 AM-11:00 PM; Fri-Sat 9:00 AM-midnight; Sun and public holidays 10:00 AM-10:00 PM; confirm exceptions on the official location page." }, officialUrl: "https://www.leberkaspepi.at/standorte.php", sourcePhoto: media("Leberkas Pepi Operngasse Vienna.jpg"), editorialUrls: ["https://www.wien.info/en/dine-drink/viennese-cuisine/viennese-street-food-516784"] }),
  stop("vienna-cheap-kolar", "Kolar", [48.2109, 16.3706], "Kolar's baked flatbreads arrive blistered and stuffed with combinations like spinach and sheep's cheese or ham and corn. The vaulted Beisl is central, inexpensive by Innere Stadt standards, and built for an unplanned meal with beer.", { venueKind: "food_drink", foodServiceType: "pub", cuisineTypes: ["flatbread", "austrian"], price: "$", priceSource: "Official menu", attributeTags: ["budget_food", "casual", "walk_in_friendly", "central"], hours: { default: "Mon-Thu 11:00 AM-midnight; Fri-Sat 11:00 AM-1:00 AM; Sun and public holidays 1:00 PM-midnight." }, officialUrl: "https://www.kolar-beisl.at/tagesfladen-neu/", sourcePhoto: media("Kolar Beisl Vienna.jpg"), editorialUrls: ["https://www.wien.info/en/dine-drink"] }),
  stop("vienna-cheap-deewan", "Der Wiener Deewan", [48.2179, 16.3592], "Deewan's Pakistani buffet runs on a pay-as-you-wish model that has made it a genuine student institution. Take what you will eat, include the excellent daal and curries, and pay fairly enough for the model to keep working.", { venueKind: "food_drink", foodServiceType: "cafeteria", cuisineTypes: ["pakistani", "buffet"], price: "$", priceSource: "Official pay-as-you-wish policy", attributeTags: ["budget_food", "vegetarian_friendly", "vegan_friendly", "local_favorite"], hours: { default: "Mon-Sat 11:00 AM-11:00 PM; buffet 11:30 AM-10:30 PM; closed Sun and public holidays." }, officialUrl: "https://deewan.at/d1-d1", sourcePhoto: media("Der Wiener Deewan Vienna.jpg"), editorialUrls: ["https://www.wien.info/en/dine-drink"] }),
  stop("vienna-cheap-neni", "NENI am Naschmarkt", [48.1984, 16.3611], "NENI's original market address layers hummus, shakshuka, mezze, and Levantine comfort into a bustling all-day room. It is no longer a secret bargain, but sharing plates keeps it useful at a medium budget.", { venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["levantine", "israeli", "mediterranean"], price: "$$", priceSource: "Official menu", attributeTags: ["market", "brunch", "vegetarian_friendly", "lively_food"], hours: { default: "Mon-Sat 8:00 AM-11:00 PM; Sun 10:00 AM-9:00 PM." }, officialUrl: "https://nenifood.com/restaurants/naschmarkt", sourcePhoto: media("NENI am Naschmarkt Vienna.jpg"), editorialUrls: ["https://www.wien.gv.at/freizeit/naschmarkt"] }),
  stop("vienna-cheap-kopp", "Gasthaus Kopp", [48.2387, 16.386], "Kopp is a big, busy neighborhood Gasthaus built for schnitzel, roast pork, dumplings, and portions that make the trip into Brigittenau worthwhile. Come early at peak lunch and dinner times.", { venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["viennese", "austrian"], price: "$$", priceSource: "Official menu", attributeTags: ["budget_food", "local_favorite", "group_friendly", "classic"], hours: { default: "Wed-Sun 10:00 AM-11:00 PM, winter closing 10:00 PM; kitchen until 9:30 PM; closed Mon-Tue." }, officialUrl: "https://www.gasthaus-kopp.at/en-gb", sourcePhoto: media("Gasthaus Kopp Vienna.jpg"), editorialUrls: ["https://www.wien.info/en/dine-drink/viennese-cuisine/viennese-cuisine-364190"] }),
  stop("vienna-cheap-swing-kitchen", "Swing Kitchen Schwedenplatz", [48.2118, 16.3782], "Swing Kitchen turns burgers, nuggets, fries, and soft serve fully vegan without asking for a health-food mood. The Schwedenplatz branch is most useful as a quick central fallback and a late meal for mixed-diet groups.", { venueKind: "food_drink", foodServiceType: "fast_casual", cuisineTypes: ["vegan", "burgers"], price: "$$", priceSource: "Official menu / current delivery listing", attributeTags: ["vegan_friendly", "fast_casual", "group_friendly", "central"], hours: { default: "Sun-Thu 11:00 AM-10:00 PM; Fri-Sat 11:00 AM-11:00 PM." }, officialUrl: "https://www.swingkitchen.com/", sourcePhoto: media("Swing Kitchen Schwedenplatz Vienna.jpg"), editorialUrls: ["https://wolt.com/en/aut/vienna/restaurant/swing-kitchen-schwedenplatz", "https://maps.apple.com/place?place-id=I38ED406072D33A4D"] }),
];

const hotelStops: GuideStop[] = [
  stop("vienna-hotel-sacher", "Hotel Sacher Wien", [48.2033, 16.3693], "The Sacher is Vienna's grand-hotel shorthand: opened in 1876, opposite the State Opera and Albertina, with 152 individually furnished rooms, a serious spa, and the original Sachertorte downstairs. The address earns its premium when the trip centers on the historic core.", { venueKind: "lodging", lodgingType: "hotel", price: "$$$$", priceSource: "Official property booking page", attributeTags: ["luxury", "central", "historic", "wellness"], hours: { default: "Hotel and front desk operate daily, 24 hours; the official property booking page controls check-in, check-out, breakfast, spa, and bar schedules." }, officialUrl: "https://www.sacher.com/en/vienna/", bookingUrl: "https://www.booking.com/hotel/at/sacher-wien.en-gb.html", sourcePhoto: media("Hotel Sacher Wien exterior.jpg"), editorialUrls: ["https://www.wien.info/en/hotel-sacher-wien-162042", "https://www.cntraveller.com/gallery/vienna-hotels-best"] }),
  stop("vienna-hotel-rosewood", "Rosewood Vienna", [48.209, 16.3697], "Rosewood occupies a restored financial building on Petersplatz, with 100 rooms, residential-scale interiors, and a rooftop restaurant looking across the old center. It suits travelers who want polished privacy without leaving the Graben orbit.", { venueKind: "lodging", lodgingType: "hotel", price: "$$$$", priceSource: "Official property booking page", attributeTags: ["luxury", "central", "design", "scenic"], hours: { default: "Hotel and front desk operate daily, 24 hours; the official property booking page controls check-in, check-out, breakfast, spa, and rooftop schedules." }, officialUrl: "https://www.rosewoodhotels.com/en/vienna", bookingUrl: "https://www.booking.com/hotel/at/rosewood-vienna-wien.en-gb.html", sourcePhoto: media("Rosewood Vienna hotel.jpg"), editorialUrls: ["https://www.wien.info/en/rosewood-vienna-433620", "https://www.cntraveler.com/gallery/best-hotels-in-vienna-austria"] }),
  stop("vienna-hotel-imperial", "Hotel Imperial Vienna", [48.2012, 16.3737], "A former Württemberg palace on the Ring, the Imperial leans fully into marble, chandeliers, butler-level service, and musical history. Choose it for ceremony, Musikverein proximity, and a stay that feels inseparable from imperial Vienna.", { venueKind: "lodging", lodgingType: "hotel", price: "$$$$", priceSource: "Official property booking page", attributeTags: ["luxury", "historic", "central", "romantic"], hours: { default: "Hotel and front desk operate daily, 24 hours; the official property page controls check-in, check-out, dining, and service schedules." }, officialUrl: "https://www.imperialvienna.com/en", bookingUrl: "https://www.booking.com/hotel/at/hotelimperialwien.en-gb.html", sourcePhoto: media("Hotel Imperial Vienna.jpg"), editorialUrls: ["https://www.cntraveller.com/gallery/vienna-hotels-best"] }),
  stop("vienna-hotel-park-hyatt", "Park Hyatt Vienna", [48.2116, 16.3678], "Park Hyatt turns a former bank at Am Hof into a calm luxury base, retaining stone, wood, and vault details while converting the old cash vault into the swimming pool. It is central but less theatrically Viennese than the Ring grandees.", { venueKind: "lodging", lodgingType: "hotel", price: "$$$$", priceSource: "Official property booking page", attributeTags: ["luxury", "wellness", "central", "design"], hours: { default: "Hotel and front desk operate daily, 24 hours; the official property booking page controls check-in, check-out, spa, pool, breakfast, and bar schedules." }, officialUrl: "https://www.hyatt.com/en-US/hotel/austria/park-hyatt-vienna/vieph", bookingUrl: "https://www.booking.com/hotel/at/park-hyatt-vienna.en-gb.html", sourcePhoto: media("Park Hyatt Vienna.jpg"), editorialUrls: ["https://www.cntraveler.com/gallery/best-hotels-in-vienna-austria"] }),
  stop("vienna-hotel-guesthouse", "The Guesthouse Vienna", [48.2047, 16.3691], "Sir Terence Conran's compact hotel faces the Albertina with window seats, warm modern rooms, and an excellent ground-floor brasserie. The position is hard to beat for a first trip, while the scale feels more personal than a palace hotel.", { venueKind: "lodging", lodgingType: "hotel", price: "$$$$", priceSource: "Official property booking page", attributeTags: ["luxury", "central", "design", "romantic"], hours: { default: "Hotel and guest contact operate daily, 24 hours; the official booking page controls check-in, check-out, breakfast, and brasserie schedules." }, officialUrl: "https://theguesthouse.at/en", bookingUrl: "https://www.booking.com/hotel/at/the-guesthouse-vienna.html", sourcePhoto: media("The Guesthouse Vienna.jpg"), editorialUrls: ["https://www.cntraveller.com/gallery/vienna-hotels-best"] }),
  stop("vienna-hotel-sans-souci", "Hotel Sans Souci Vienna", [48.2052, 16.3568], "Sans Souci pairs a Ring-adjacent address opposite MuseumsQuartier with contemporary art, spacious rooms, and a 20-meter indoor pool. It is the strongest luxury fit when museum days and Neubau evenings matter more than Stephansplatz.", { venueKind: "lodging", lodgingType: "hotel", price: "$$$$", priceSource: "Official property booking page", attributeTags: ["luxury", "wellness", "design", "central"], hours: { default: "Hotel and front desk operate daily, 24 hours; the official property booking page controls check-in, check-out, breakfast, spa, pool, and bar schedules." }, officialUrl: "https://www.sanssouci-wien.com/en/", bookingUrl: "https://www.booking.com/hotel/at/sans-souci-wien.en-gb.html", sourcePhoto: media("Sans Souci Vienna hotel.jpg"), editorialUrls: ["https://www.cntraveler.com/gallery/best-hotels-in-vienna-austria"] }),
  stop("vienna-hotel-altstadt", "Altstadt Vienna", [48.2045, 16.3506], "Altstadt fills a Patrician house in Spittelberg with 62 individually designed rooms, contemporary art, salon breakfasts, and afternoon tea. It feels like staying inside a cultivated collector's home rather than a standardized design hotel.", { venueKind: "lodging", lodgingType: "hotel", price: "$$$", priceSource: "Official property booking page", attributeTags: ["design", "romantic", "central", "local_favorite"], hours: { default: "Hotel and front desk operate daily, 24 hours; the official property page controls check-in, check-out, breakfast, salon, and bar schedules." }, officialUrl: "https://www.altstadt.at/en/", bookingUrl: "https://www.booking.com/hotel/at/altstadt-vienna.html", sourcePhoto: media("Altstadt Vienna hotel.jpg"), editorialUrls: ["https://www.cntraveller.com/gallery/vienna-hotels-best"] }),
  stop("vienna-hotel-josefine", "Hotel Josefine", [48.1959, 16.3496], "Josefine channels interwar Vienna through dark woods, patterned textiles, brass, and the basement Barfly's Club. Its Mariahilf location works for Naschmarkt and independent shopping, with more mood than amenity sprawl.", { venueKind: "lodging", lodgingType: "hotel", price: "$$$", priceSource: "Official property booking page", attributeTags: ["design", "romantic", "midrange", "central"], hours: { default: "Hotel and front desk operate daily, 24 hours; the official property page controls check-in, check-out, breakfast, and Barfly's Club schedules." }, officialUrl: "https://www.hoteljosefine.at/en/", bookingUrl: "https://www.booking.com/hotel/at/josefine-wien.en-gb.html", sourcePhoto: media("Hotel Josefine Vienna.jpg"), editorialUrls: ["https://www.cntraveller.com/gallery/vienna-hotels-best"] }),
  stop("vienna-hotel-25hours", "25hours Hotel at MuseumsQuartier", [48.2068, 16.355], "The 25hours uses circus references, playful rooms, bikes, and the Dachboden rooftop bar to create a social, deliberately unserious base beside MuseumsQuartier. Book it for energy and location, not quiet classicism.", { venueKind: "lodging", lodgingType: "hotel", price: "$$$", priceSource: "Official property booking page", attributeTags: ["design", "lively", "central", "group_friendly"], hours: { default: "Hotel and front desk operate daily, 24 hours; the official property booking page controls check-in, check-out, breakfast, restaurant, sauna, and rooftop-bar schedules." }, officialUrl: "https://25hours-hotels.com/vienna/at-museumsquartier/", bookingUrl: "https://www.booking.com/hotel/at/25hours-wien.html", sourcePhoto: media("25hours Hotel MuseumsQuartier Vienna.jpg"), editorialUrls: ["https://www.cntraveler.com/gallery/best-hotels-in-vienna-austria"] }),
  stop("vienna-hotel-magdas", "magdas HOTEL Vienna City", [48.1997, 16.3861], "magdas is a Caritas social business where a multilingual team with refugee and migrant backgrounds runs a thoughtful city hotel near Stadtpark and Belvedere. The garden, local design, and mission give the stay substance beyond price.", { venueKind: "lodging", lodgingType: "hotel", price: "$$", priceSource: "Official property booking page", attributeTags: ["midrange", "design", "garden", "accessible"], hours: { default: "Hotel and front desk operate daily, 24 hours; the official property booking page controls check-in, check-out, breakfast, garden, and event schedules." }, officialUrl: "https://magdas-hotel.at/en/vienna-city/", bookingUrl: "https://www.booking.com/hotel/at/magdas-vienna-city-wien.en-gb.html", sourcePhoto: media("magdas HOTEL Vienna City.jpg"), editorialUrls: ["https://www.wien.info/en/travel-info/hotels-accomodations"] }),
];

const hostelStops: GuideStop[] = [
  stop("vienna-hostel-ruthensteiner", "Hostel Ruthensteiner Vienna", [48.1946, 16.338], "Ruthensteiner is Vienna's independent hostel benchmark: a leafy garden, sociable bar, guest kitchen, instruments, house beer, and a mix of dorms and private rooms near Westbahnhof. It is social without requiring a party-hostel tolerance.", { venueKind: "lodging", lodgingType: "hostel", price: "$", priceSource: "Official booking page / Hostelworld", attributeTags: ["budget", "social", "garden", "solo_friendly"], hours: { default: "Check-in 2:00 PM-midnight; check-out by 10:00 AM; reception, bar, and facility schedules follow the official booking page." }, officialUrl: "https://hostelruthensteiner.com/", bookingUrl: "https://www.hostelworld.com/hostels/p/731/hostel-ruthensteiner-vienna/", sourcePhoto: media("Hostel Ruthensteiner Vienna.jpg"), editorialUrls: ["https://www.hostelworld.com/st/hostels/europe/austria/vienna/"] }),
  stop("vienna-hostel-wombats", "Wombat's City Hostel Vienna Naschmarkt", [48.1975, 16.3592], "Wombat's combines a highly practical Naschmarkt location with 24-hour reception, a guest kitchen, café, and lively bar. The scale makes meeting people easy, though light sleepers should request distance from social areas.", { venueKind: "lodging", lodgingType: "hostel", price: "$", priceSource: "Official booking page / Hostelworld", attributeTags: ["budget", "social", "central", "party"], hours: { default: "Reception operates 24 hours daily; check-in, check-out, breakfast, kitchen, and bar schedules follow the official property page." }, officialUrl: "https://www.wombats-hostels.com/vienna", bookingUrl: "https://www.hostelworld.com/hostels/p/45674/wombat-s-city-hostel-vienna-naschmarkt/", sourcePhoto: media("Wombats City Hostel Vienna Naschmarkt.jpg"), editorialUrls: ["https://www.hostelworld.com/st/hostels/europe/austria/vienna/"] }),
  stop("vienna-hostel-jo-and-joe", "JO&JOE Vienna", [48.1967, 16.337], "JO&JOE sits above IKEA at Westbahnhof with a rooftop, huge social floor, events, dorms, and private rooms. It works best for travelers who want built-in activity and effortless rail and U-Bahn connections.", { venueKind: "lodging", lodgingType: "hostel", price: "$$", priceSource: "Official booking page / Hostelworld", attributeTags: ["social", "lively", "group_friendly", "rooftop"], hours: { default: "Reception operates 24 hours daily; standard check-in 3:00 PM-11:00 PM and check-out by 10:00 AM; rooftop and event hours follow the official calendar." }, officialUrl: "https://www.joandjoe.com/vienna/en/", bookingUrl: "https://www.hostelworld.com/hostels/p/310022/jo-and-joe-vienna/", sourcePhoto: media("JO and JOE Vienna hostel.jpg"), editorialUrls: ["https://www.hostelworld.com/st/hostels/europe/austria/vienna/"] }),
  stop("vienna-hostel-st-christophers", "St Christopher's Vienna", [48.1776, 16.376], "St Christopher's brings ensuite dorms, female-only rooms, private rooms, and a Belushi's bar to a well-connected Favoriten base. It is a reliable social chain choice close to Hauptbahnhof rather than an atmospheric old-center stay.", { venueKind: "lodging", lodgingType: "hostel", price: "$", priceSource: "Official booking page / Hostelworld", attributeTags: ["budget", "social", "group_friendly", "late_night"], hours: { default: "Reception operates 24 hours daily; check-in 3:00 PM-11:00 PM and check-out by 11:00 AM; bar and breakfast schedules follow the official property page." }, officialUrl: "https://www.st-christophers.co.uk/vienna/", bookingUrl: "https://www.hostelworld.com/hostels/p/312724/st-christopher-s-vienna/", sourcePhoto: media("St Christophers Vienna hostel.jpg"), editorialUrls: ["https://www.hostelworld.com/st/hostels/europe/austria/vienna/"] }),
  stop("vienna-hostel-boutique", "Vienna Boutique Hostel", [48.2036, 16.3418], "This small Neubau hostel prioritizes calm, unusually clean shared spaces, privacy curtains, generous bunks, secure coded entry, and free coffee over organized partying. It is a strong solo fit when sleep quality matters more than a staffed late-night lobby.", { venueKind: "lodging", lodgingType: "hostel", price: "$", priceSource: "Official booking page / Hostelworld", attributeTags: ["budget", "quiet", "solo_friendly", "design"], hours: { default: "Daily reception 8:00 AM-2:00 PM with 24-hour phone availability; check-in 2:00 PM-12:00 AM and check-out by 10:00 AM." }, officialUrl: "https://viennaboutique.at/", bookingUrl: "https://www.hostelworld.com/hostels/p/307479/vienna-boutique-hostel/", sourcePhoto: media("Vienna Boutique Hostel Kandlgasse.jpg"), editorialUrls: ["https://www.hostelworld.com/st/hostels/europe/austria/vienna/"] }),
  stop("vienna-hostel-stadtaffe", "Stadtaffe - Chic Hostel VIE", [48.2117, 16.3348], "Stadtaffe gives budget travelers modern pod-like bunks, a courtyard, and Ottakring access with a smaller, more design-conscious feel than Vienna's mega-hostels. After-hours arrivals depend on the self-check-in instructions.", { venueKind: "lodging", lodgingType: "hostel", price: "$", priceSource: "Official booking page / Hostelworld", attributeTags: ["budget", "design", "social", "solo_friendly"], hours: { default: "Daily reception 9:00 AM-10:00 PM; check-in 3:00 PM-10:00 PM with self-check-in instructions after hours; check-out by 10:00 AM." }, officialUrl: "https://www.stadtaffe.at/", bookingUrl: "https://www.hostelworld.com/hostels/p/316937/stadtaffe-chic-hostel-vie/", sourcePhoto: media("Stadtaffe Chic Hostel Vienna.jpg"), editorialUrls: ["https://www.hostelworld.com/st/hostels/europe/austria/vienna/"] }),
  stop("vienna-hostel-at", "A&T Hotel and Hostel", [48.1701, 16.3765], "A&T is a quiet, no-frills Favoriten sleep with private bathrooms, two- to six-bed rooms, and a women-only wing. Pick it for clean separation between sleep and sightseeing, not for a central social scene.", { venueKind: "lodging", lodgingType: "hostel", price: "$", priceSource: "Official booking page / Hostelworld", attributeTags: ["budget", "quiet", "group_friendly", "family_friendly"], hours: { default: "Property operates daily; reception, check-in, check-out, breakfast, and luggage-storage schedules follow the official booking page." }, officialUrl: "https://www.athostel.com/home_en/", bookingUrl: "https://www.hostelworld.com/hostels/p/67989/a-and-t-hotel-and-hostel/", sourcePhoto: media("A and T Hotel Hostel Vienna.jpg"), editorialUrls: ["https://www.wien.info/en/travel-info/hotels-accomodations/youth-hostels-camping-366504"] }),
  stop("vienna-hostel-ao-hbf", "a&o Wien Hauptbahnhof", [48.1842, 16.3797], "a&o is the logistics-first choice near Hauptbahnhof: 24-hour reception, dorms and family rooms, lockers, laundry, and quick trains without a boutique-hostel premium. Expect a large chain property and choose it for transport convenience.", { venueKind: "lodging", lodgingType: "hostel", price: "$", priceSource: "Official booking page", attributeTags: ["budget", "group_friendly", "family_friendly", "accessible"], hours: { default: "Reception and lobby service operate 24 hours daily; check-in, check-out, breakfast, and late-check-out schedules follow the official property page." }, officialUrl: "https://www.aohostels.com/en/vienna/vienna-hauptbahnhof/", bookingUrl: "https://www.hostelworld.com/st/hostels/p/72499/a-and-o-wien-hauptbahnhof/", sourcePhoto: media("a&o Wien Hauptbahnhof.jpg"), editorialUrls: ["https://www.wien.info/en/travel-info/hotels-accomodations/youth-hostels-camping-366504"] }),
  stop("vienna-hostel-meininger", "MEININGER Vienna Downtown Franz", [48.2208, 16.3698], "MEININGER mixes hostel dorms with family and private rooms, a 24-hour reception, guest kitchen, game zone, and bar near the Danube Canal. It is especially useful for mixed groups that cannot agree on one room type.", { venueKind: "lodging", lodgingType: "hostel", price: "$$", priceSource: "Official booking page / Hostelworld", attributeTags: ["group_friendly", "family_friendly", "social", "accessible"], hours: { default: "Reception operates 24 hours daily; check-in, check-out, breakfast, guest-kitchen, and bar schedules follow the official property page." }, officialUrl: "https://www.meininger-hotels.com/en/hotels/vienna/hotel-vienna-downtown-franz/", bookingUrl: "https://www.hostelworld.com/hostels/p/52575/meininger-hotel-vienna-downtown-franz/", sourcePhoto: media("MEININGER Vienna Downtown Franz.jpg"), editorialUrls: ["https://www.hostelworld.com/st/hostels/europe/austria/vienna/"] }),
  stop("vienna-hostel-myrthengasse", "Hostel Wien - Myrthengasse (HI)", [48.2053, 16.3481], "Myrthengasse is an old-school youth hostel with an excellent Neubau location, strong security, breakfast included, 24-hour reception, a green courtyard, and little interest in boutique theatrics. It delivers the basics at a fair rate.", { venueKind: "lodging", lodgingType: "hostel", price: "$", priceSource: "Official 2026 price list / Hostelworld", attributeTags: ["budget", "central", "quiet", "family_friendly"], hours: { default: "Hostel and reception operate 24 hours daily; check-in from 2:00 PM and check-out by 10:00 AM; meals follow the official property schedule." }, officialUrl: "https://www.oejhv.at/en/youth-hostels/vienna/1070-vienna/", bookingUrl: "https://www.hostelworld.com/hostels/p/53031/hostel-wien-myrthengasse-hi/", sourcePhoto: media("Jugendherberge Wien Myrthengasse.jpg"), editorialUrls: ["https://www.oejhv.at/wp-content/uploads/Preisliste-1070-Vienna-2026-D-E.pdf"] }),
];

const pubStops: GuideStop[] = [
  stop("vienna-pub-bendl", "Café Bendl", [48.2138, 16.3555], "Bendl is a gloriously unpolished café-bar of red vinyl, smoke-stained memory, cheap drinks, and improbable opening hours. Come for lived-in Vienna rather than service choreography, and bring cash expectations.", { venueKind: "nightlife", nightlifeType: "dive_bar", musicGenres: ["jukebox"], price: "$", priceSource: "Current venue listing", attributeTags: ["local_bar", "cheap_drinks", "low_key_nightlife", "late_night"], hours: { default: "Mon-Wed 8:00 AM-2:00 AM; Thu-Fri 8:00 AM-midnight; Sat 6:00 PM-midnight; Sun 6:00 PM-midnight; verify holiday exceptions on the official page." }, officialUrl: "https://bendl.wordpress.com/", sourcePhoto: media("Cafe Bendl Vienna.jpg"), editorialUrls: ["https://www.wien.info/en/dine-drink/bars-clubs"] }),
  stop("vienna-pub-espresso", "Espresso", [48.2048, 16.3505], "Espresso preserves its 1950s fittings while functioning as a modern all-day Neubau café and natural-wine bar. Breakfast can slide into aperitivo and a late drink without the room changing personality.", { venueKind: "nightlife", nightlifeType: "wine_bar", musicGenres: ["indie"], price: "$$", priceSource: "Official venue / Vienna Review", attributeTags: ["natural_wine", "local_bar", "casual_nightlife", "walk_in_friendly_nightlife"], hours: { default: "Mon-Thu 8:00 AM-midnight; Fri 7:30 AM-1:00 AM; Sat 9:00 AM-1:00 AM; Sun closed." }, officialUrl: "https://www.espresso-wien.at/", sourcePhoto: media("Espresso Burggasse Vienna.jpg"), editorialUrls: ["https://www.theviennareview.at/food-drink/279/espresso"] }),
  stop("vienna-pub-schikaneder", "Schikaneder", [48.1971, 16.3653], "An independent cinema, scuffed couch bar, DJ room, and creative-industry hangout share this Margareten address. Check the film and event listings, or simply arrive after dark when the bar becomes its own program.", { venueKind: "nightlife", nightlifeType: "dive_bar", musicGenres: ["indie", "disco", "electronic"], price: "$$", priceSource: "Official venue / Vienna Tourist Board", attributeTags: ["dj_sets", "local_bar", "lively_nightlife", "late_night"], hours: { default: "Mon-Wed 5:00 PM-1:00 AM; Thu 5:00 PM-2:00 AM; Fri-Sat 5:00 PM-4:00 AM; Sun 5:00 PM-midnight." }, officialUrl: "https://www.schikaneder.at/bar/about_schikaneder", sourcePhoto: media("Schikaneder Kino Vienna.jpg"), editorialUrls: ["https://www.wien.info/en/schikaneder-159866"] }),
  stop("vienna-pub-kaenguruh", "Känguruh Pub", [48.193, 16.3505], "Känguruh is a candlelit beer specialist with more than 200 bottles, deep Belgian representation, Austrian small breweries, and enough food to extend a tasting session. Ask rather than pretending to know the whole list.", { venueKind: "nightlife", nightlifeType: "beer_bar", musicGenres: ["bar"], price: "$$", priceSource: "Venue listing / current business registry", attributeTags: ["craft_beer", "local_bar", "casual_nightlife", "group_friendly"], hours: { default: "Mon-Thu 5:00 PM-1:00 AM; Fri-Sat 5:00 PM-2:00 AM; Sun closed." }, officialUrl: "https://www.kaenguruh-pub.at/", sourcePhoto: media("Kaenguruh Pub Vienna.jpg"), editorialUrls: ["https://www.theviennareview.at/food-drink/2165/kanguruh"] }),
  stop("vienna-pub-1516", "1516 Brewing Company", [48.2018, 16.3736], "1516 is the central brewpub answer when a group needs house-brewed ales, lagers, sports screens, and a kitchen that runs after midnight. It is busy and unsubtle in exactly the useful way.", { venueKind: "nightlife", nightlifeType: "brewery", foodServiceType: "pub", musicGenres: ["bar"], price: "$$", priceSource: "Official menu", attributeTags: ["craft_beer", "group_friendly", "late_night", "sports_screening"], hours: { default: "Daily 10:00 AM-2:00 AM; kitchen 11:30 AM-1:30 AM; closed only December 24." }, officialUrl: "https://www.1516brewingcompany.com/contact/", sourcePhoto: media("1516 Brewing Company Vienna.jpg"), editorialUrls: ["https://www.theviennareview.at/food-drink/184/1516-brewing-company"] }),
  stop("vienna-pub-ammutson", "Ammutsøn Craft Beer Dive", [48.1971, 16.3523], "Ammutsøn brings a rotating wall of serious draft beer into a compact Mariahilf room with dive-bar energy and no need for a full meal. It is the stop for drinkers who want the tap list to make the decisions.", { venueKind: "nightlife", nightlifeType: "beer_bar", musicGenres: ["rock"], price: "$$", priceSource: "Official venue / current business listing", attributeTags: ["craft_beer", "local_bar", "late_night", "casual_nightlife"], hours: { default: "Mon-Thu 4:00 PM-2:00 AM; Fri 4:00 PM-4:00 AM; Sat 2:00 PM-4:00 AM; Sun 2:00 PM-midnight." }, officialUrl: "https://www.ammutson.com/", sourcePhoto: media("Ammutson Craft Beer Dive Vienna.jpg"), editorialUrls: ["https://www.wien.info/en/dine-drink/bars-clubs"] }),
  stop("vienna-pub-brauhund", "Brauhund", [48.1979, 16.3294], "Brauhund is a West Vienna neighborhood living room for independent beer, burgers, soul food, cards, and long conversations. The short menu and friendly room matter as much as the taps.", { venueKind: "nightlife", nightlifeType: "beer_bar", foodServiceType: "pub", musicGenres: ["rock", "soul"], price: "$$", priceSource: "Official menu", attributeTags: ["craft_beer", "local_bar", "casual_nightlife", "group_friendly"], hours: { default: "Mon, Wed-Thu 5:00 PM-midnight; Fri-Sat 5:00 PM-2:00 AM; Sun 4:00 PM-11:00 PM; Tue closed." }, officialUrl: "https://www.brauhund.com/", sourcePhoto: media("Brauhund Vienna.jpg"), editorialUrls: ["https://www.wien.info/en/dine-drink/bars-clubs"] }),
  stop("vienna-pub-beaver", "Beaver Brewing Company", [48.2254, 16.3558], "Beaver pairs American-style house beer with wings, burgers, and a bright Alsergrund brewpub atmosphere. It is more dinner-friendly than the specialist beer dives and easier for mixed-interest groups.", { venueKind: "nightlife", nightlifeType: "brewery", foodServiceType: "pub", musicGenres: ["bar"], price: "$$", priceSource: "Official menu", attributeTags: ["craft_beer", "group_friendly", "casual_nightlife", "sports_screening"], hours: { default: "Mon-Tue 4:30 PM-11:00 PM; Wed-Thu 4:30 PM-midnight; Fri-Sat noon-12:30 AM; Sun noon-10:00 PM; kitchen closes 10:00 PM, 9:30 PM Sun-Mon." }, officialUrl: "https://www.beaverbrewing.at/", sourcePhoto: media("Beaver Brewing Company Vienna.jpg"), editorialUrls: ["https://www.wien.info/en/dine-drink/bars-clubs"] }),
  stop("vienna-pub-chelsea", "Chelsea", [48.2118, 16.3395], "Chelsea is the Gürtel institution for British guitar music, live bands, DJs, football, ales, and a crowd that spreads through three Stadtbahn arches. Look at the concert calendar before assuming it is a quiet pint night.", { venueKind: "nightlife", nightlifeType: "live_music_venue", musicGenres: ["indie", "rock", "punk"], price: "$$", priceSource: "Official venue / Vienna Tourist Board", attributeTags: ["live_music", "sports_screening", "late_night", "lively_nightlife"], hours: { default: "Daily 6:00 PM-4:00 AM; concert door times follow the official event calendar." }, officialUrl: "https://www.chelsea.co.at/", sourcePhoto: media("Chelsea Vienna Guertel.jpg"), editorialUrls: ["https://www.wien.info/en/dine-drink/bars-clubs/live-locations/chelsea-342528"] }),
  stop("vienna-pub-rhiz", "rhiz", [48.2094, 16.3382], "rhiz is the Gürtel's electronic and experimental listening room, with small concerts, laptop music history, eclectic DJs, and weekend nights that can turn the bar into a party without losing its edge.", { venueKind: "nightlife", nightlifeType: "live_music_venue", musicGenres: ["electronic", "experimental", "indie"], price: "$$", priceSource: "Official venue / Vienna Tourist Board", attributeTags: ["live_music", "dj_sets", "local_bar", "lively_nightlife"], hours: { default: "Wed-Fri 7:00 PM-1:00 AM; Sat 7:00 PM-6:00 AM; specific concert and DJ times follow the official calendar." }, officialUrl: "https://rhiz.wien/", sourcePhoto: media("Rhiz Vienna Guertel.jpg"), editorialUrls: ["https://www.wien.info/en/dine-drink/bars-clubs/live-locations/rhiz-356670"] }),
];

const cocktailStops: GuideStop[] = [
  stop("vienna-cocktail-loos", "Loos American Bar", [48.2072, 16.3714], "Adolf Loos compressed mirrors, onyx, brass, and mahogany into 27 square meters in 1908. The bar gets crowded enough to erase personal space, but a classic cocktail here is still Vienna architecture you can drink inside.", { venueKind: "nightlife", nightlifeType: "cocktail_bar", musicGenres: ["lounge"], price: "$$$", priceSource: "Official bar / Vienna Tourist Board", attributeTags: ["craft_cocktails", "historic", "central", "late_night"], hours: { default: "Daily noon-4:00 AM." }, officialUrl: "https://www.loosbar.at/", sourcePhoto: media("Loos American Bar Vienna.jpg"), editorialUrls: ["https://www.wien.info/en/dine-drink/bars-clubs/loos-american-bar-351284"] }),
  stop("vienna-cocktail-kleinod", "Kleinod", [48.2078, 16.3722], "Kleinod is a polished central crowd-pleaser where technically sound drinks, upbeat service, and a late-running room make more sense than hushed speakeasy theatre. It can feel celebratory even on an unplanned weeknight.", { venueKind: "nightlife", nightlifeType: "cocktail_bar", musicGenres: ["pop", "lounge"], price: "$$$", priceSource: "Official bar menu", attributeTags: ["craft_cocktails", "lively_nightlife", "central", "late_night"], hours: { default: "Mon-Sat 8:00 PM-4:00 AM; Sun 8:00 PM-2:00 AM." }, officialUrl: "https://www.kleinod.wien/", sourcePhoto: media("Kleinod Vienna bar.jpg"), editorialUrls: ["https://www.falstaff.com/en/listings/the-best-bars-in-vienna"] }),
  stop("vienna-cocktail-tuer7", "Tür 7", [48.2119, 16.35], "Ring the unmarked door at Buchfeldgasse 7 for a small reservation-led room that builds drinks around conversation and preference. The intimacy is the point; groups and spontaneous bar-hopping are not.", { venueKind: "nightlife", nightlifeType: "cocktail_bar", musicGenres: ["lounge"], price: "$$$", priceSource: "Official bar / current business listing", attributeTags: ["speakeasy", "craft_cocktails", "reservation_recommended_nightlife", "date_night"], hours: { default: "Daily 9:00 PM-4:00 AM; reservations and holiday exceptions follow the official bar page." }, officialUrl: "https://www.tuer7.at/", sourcePhoto: media("Tuer 7 Vienna bar.jpg"), editorialUrls: ["https://www.falstaff.com/en/listings/the-best-bars-in-vienna"] }),
  stop("vienna-cocktail-josef", "JOSEF Cocktail Bar", [48.2104, 16.3718], "JOSEF mixes a baroque shell with modern culinary techniques, foams, house signatures, tiki references, and strong classics. The central location is easy; the drinks still show enough personality to justify planning around it.", { venueKind: "nightlife", nightlifeType: "cocktail_bar", musicGenres: ["lounge"], price: "$$$", priceSource: "Official cocktail menu", attributeTags: ["craft_cocktails", "date_night", "central", "late_night"], hours: { default: "Daily 6:00 PM-3:00 AM." }, officialUrl: "https://www.josef-bar.at/", sourcePhoto: media("Josef Cocktail Bar Vienna.jpg"), editorialUrls: ["https://www.falstaff.com/en/listings/the-best-bars-in-vienna"] }),
  stop("vienna-cocktail-miranda", "Miranda Bar", [48.1961, 16.3508], "Pastel colors and a clean-lined room make Miranda visually lighter than Vienna's dark speakeasies, while the compact menu keeps the drinks focused. It is a strong Mariahilf date stop before or after dinner.", { venueKind: "nightlife", nightlifeType: "cocktail_bar", musicGenres: ["lounge"], price: "$$$", priceSource: "Official bar / Vienna Tourist Board", attributeTags: ["craft_cocktails", "design", "date_night", "local_bar"], hours: { default: "Mon-Wed 6:00 PM-midnight; Thu-Sat 6:00 PM-2:00 AM; Sun closed." }, officialUrl: "https://www.mirandabar.com/", sourcePhoto: media("Miranda Bar Vienna.jpg"), editorialUrls: ["https://www.wien.info/en/dine-drink/bars-clubs/bars"] }),
  stop("vienna-cocktail-krypt", "krypt.bar", [48.2171, 16.3582], "A narrow stair opens into a 250-square-meter historic cellar redesigned in marble, walnut, and shadow. The architecture is dramatic, while vegetable-led signatures keep the cocktail list from becoming mere scenery.", { venueKind: "nightlife", nightlifeType: "cocktail_bar", musicGenres: ["electronic", "lounge"], price: "$$$", priceSource: "Official bar / Vienna Tourist Board", attributeTags: ["speakeasy", "design", "craft_cocktails", "date_night"], hours: { default: "Tue-Thu 7:00 PM-1:00 AM; Fri-Sat 8:00 PM-3:00 AM; closed Sun-Mon." }, officialUrl: "https://www.krypt.bar/", sourcePhoto: media("Krypt Bar Vienna.jpg"), editorialUrls: ["https://www.wien.info/en/dine-drink/bars-clubs/krypt-bar-350154"] }),
  stop("vienna-cocktail-sign", "The Sign Lounge", [48.2303, 16.356], "Kan Zuo's Alsergrund lounge is known for ambitious, playful presentations and a long list that rewards asking the team for direction. It sits outside the center's bar cluster and feels more like a destination because of it.", { venueKind: "nightlife", nightlifeType: "cocktail_bar", musicGenres: ["lounge"], price: "$$$", priceSource: "Official cocktail menu", attributeTags: ["craft_cocktails", "destination_dining", "reservation_recommended_nightlife", "group_friendly"], hours: { default: "Summer hours July 1-August 31: Tue-Thu 6:00 PM-1:00 AM; Fri-Sat 6:00 PM-2:00 AM; Sun 6:00 PM-1:00 AM; closed Mon. Outside summer, use the official schedule." }, officialUrl: "https://www.thesignlounge.at/", sourcePhoto: media("The Sign Lounge Vienna.jpg"), editorialUrls: ["https://www.wien.info/en/dine-drink/bars-clubs/bars/the-sign-lounge-361088"] }),
  stop("vienna-cocktail-moby-dick", "Moby Dick", [48.2043, 16.3548], "Moby Dick connects low-waste cocktails to a tiny food menu, using peels, trims, fermentation, and pairings rather than sustainability slogans. The result is a relaxed Neubau bar where flavor comes before spectacle.", { venueKind: "nightlife", nightlifeType: "cocktail_bar", musicGenres: ["indie", "lounge"], price: "$$$", priceSource: "Official bar and food menu", attributeTags: ["craft_cocktails", "date_night", "local_bar", "reservation_recommended_nightlife"], hours: { default: "Wed-Thu 6:00 PM-midnight; Fri-Sat 6:00 PM-2:00 AM; kitchen until 10:00 PM; closed Sun-Tue." }, officialUrl: "https://www.mobydickvienna.at/", sourcePhoto: media("Moby Dick Cocktailbar Vienna.jpg"), editorialUrls: ["https://www.theviennareview.at/food-drink/features/110/recommended-bars-in-vienna"] }),
  stop("vienna-cocktail-dinos", "Dino's Apothecary Bar", [48.2126, 16.3701], "Bartenders in white coats work through an enormous catalogue of classics and house prescriptions in a warm 1970s New York-inspired room. The pharmacy concept is playful; the breadth and technique are serious.", { venueKind: "nightlife", nightlifeType: "cocktail_bar", musicGenres: ["lounge"], price: "$$$", priceSource: "Official bar menu / Falstaff", attributeTags: ["craft_cocktails", "central", "late_night", "group_friendly"], hours: { default: "Tue-Thu 5:00 PM-2:00 AM; Fri-Sat 5:00 PM-3:00 AM; Sun 8:00 PM-midnight; Mon closed; kitchen closes one hour before the bar." }, officialUrl: "https://dinos.at/kontakt/", sourcePhoto: media("Dinos Apothecary Bar Vienna.jpg"), editorialUrls: ["https://www.falstaff.com/en/listings/the-best-bars-in-vienna"] }),
  stop("vienna-cocktail-first-floor", "First Floor", [48.2113, 16.3746], "Upstairs from the Bermuda Triangle, First Floor offers an aquarium-like wall of aquatic plants, old Mounier Bar furniture, jazz nights, and excellent classics. It is the civilized pause inside Vienna's loudest central nightlife pocket.", { venueKind: "nightlife", nightlifeType: "cocktail_bar", musicGenres: ["jazz", "lounge"], price: "$$$", priceSource: "Official bar / Falstaff Bar Guide 2026", attributeTags: ["craft_cocktails", "live_music", "central", "late_night"], hours: { default: "Sun-Thu 6:00 PM-2:00 AM; Fri-Sat 6:00 PM-4:00 AM." }, officialUrl: "https://www.firstfloorbar.at/", sourcePhoto: media("First Floor Bar Vienna.jpg"), editorialUrls: ["https://www.wien.info/en/dine-drink/bars-clubs/bars/first-floor-345990", "https://www.falstaff.com/nordics/bars/first-floor"] }),
];

const cultureStops: GuideStop[] = [
  stop("vienna-culture-khm", "Kunsthistorisches Museum Wien", [48.2038, 16.3615], "The KHM makes Habsburg collecting power tangible through Bruegel, Velázquez, Titian, ancient Egypt, Kunstkammer marvels, and a building grand enough to compete with the art. Give it half a day, not an hour between palaces.", { venueKind: "culture", subcategory: "art_museum", price: "$$", priceSource: "Official ticket page", attributeTags: ["museum", "art", "historic", "ticketed"], hours: { default: "Tue-Sun 10:00 AM-6:00 PM; Thu until 9:00 PM; Mon closed except listed public-holiday openings on the official calendar." }, officialUrl: "https://www.khm.at/en/visit/besucherinformation/hours-admission/", sourcePhoto: media("Kunsthistorisches Museum Wien.jpg"), editorialUrls: ["https://www.wien.info/en/art-culture/museums-exhibitions/top-museums"] }),
  stop("vienna-culture-albertina", "ALBERTINA", [48.2045, 16.3683], "The Albertina combines one of the world's great works-on-paper collections with modern painting, temporary exhibitions, and Habsburg state rooms. Its central position makes it easy to visit; the collection rewards resisting the urge to rush.", { venueKind: "culture", subcategory: "art_museum", price: "$$", priceSource: "Official ticket page", attributeTags: ["museum", "art", "central", "ticketed"], hours: { default: "Daily 10:00 AM-6:00 PM; Wed and Fri until 9:00 PM." }, officialUrl: "https://www.albertina.at/en/visit/opening-hours/", sourcePhoto: media("Albertina Vienna.jpg"), editorialUrls: ["https://www.wien.info/en/art-culture/museums-exhibitions/top-museums"] }),
  stop("vienna-culture-belvedere", "Upper Belvedere", [48.1914, 16.3809], "Upper Belvedere sets Klimt's The Kiss and the largest collection of his paintings inside Prince Eugene's baroque palace, with medieval, Biedermeier, Schiele, and Funke works adding real range beyond one masterpiece.", { venueKind: "culture", subcategory: "art_museum", price: "$$", priceSource: "Official timed-ticket page", attributeTags: ["museum", "art", "historic", "scenic"], hours: { default: "Daily 9:00 AM-6:00 PM; extended to 7:00 PM July 15-August 31, 2026; timed entry follows the official ticket calendar." }, officialUrl: "https://www.belvedere.at/en/visit/upper-belvedere", sourcePhoto: media("Upper Belvedere Vienna.jpg"), editorialUrls: ["https://www.wien.info/en/art-culture/museums-exhibitions/top-museums"] }),
  stop("vienna-culture-leopold", "Leopold Museum", [48.2023, 16.358], "The Leopold is Vienna 1900 in concentrated form: the world's largest Egon Schiele collection, major Klimt, and design and art that explain the city's break with academic tradition. The white galleries are much calmer than the MQ courtyards outside.", { venueKind: "culture", subcategory: "art_museum", price: "$$", priceSource: "Official ticket page", attributeTags: ["museum", "art", "design", "ticketed"], hours: { default: "Daily 10:00 AM-6:00 PM, including public holidays; official notices control exceptional gallery closures." }, officialUrl: "https://www.leopoldmuseum.org/en/visit/opening-hours", sourcePhoto: media("Leopold Museum Vienna.jpg"), editorialUrls: ["https://www.mqw.at/en/visit/opening-hours/"] }),
  stop("vienna-culture-mumok", "mumok", [48.2038, 16.3586], "The dark basalt block in MuseumsQuartier holds Vienna's essential modern and contemporary collection, from classical modernism and Pop to Fluxus, conceptual work, film, and the city's difficult history of Actionism.", { venueKind: "culture", subcategory: "modern_art_museum", price: "$$", priceSource: "Official ticket page", attributeTags: ["museum", "modern_art", "design", "ticketed"], hours: { default: "Tue-Sun and public holidays 10:00 AM-6:00 PM; Mon closed." }, officialUrl: "https://www.mumok.at/en", sourcePhoto: media("Mumok Vienna.jpg"), editorialUrls: ["https://www.mqw.at/en/venues-spaces/mumok/"] }),
  stop("vienna-culture-wien-museum", "Wien Museum Karlsplatz", [48.2002, 16.3734], "The rebuilt Wien Museum tells the city's story through politics, housing, immigration, design, everyday objects, and a huge Prater model. The permanent exhibition is free, making it the best context-setting first museum.", { venueKind: "culture", subcategory: "city_history_museum", price: "$", priceSource: "Official admission page", attributeTags: ["museum", "history", "free_entry", "accessible"], hours: { default: "Tue-Wed and Fri 9:00 AM-6:00 PM; Thu 9:00 AM-9:00 PM; Sat-Sun 10:00 AM-6:00 PM; Mon closed; also closed Jan 1, May 1, and Dec 25." }, officialUrl: "https://guide.wienmuseum.at/en/seite/oeffnungszeiten", sourcePhoto: media("Wien Museum Karlsplatz.jpg"), editorialUrls: ["https://www.wien.gv.at/en/leisure/museums"] }),
  stop("vienna-culture-jewish-museum", "Jewish Museum Vienna - Dorotheergasse", [48.2077, 16.3705], "Palais Eskeles traces Jewish life in Vienna across religion, intellectual culture, persecution, restitution, and the present. Pair it with the Judenplatz location, whose medieval synagogue remains are covered by the same ticket within seven days.", { venueKind: "culture", subcategory: "history_museum", price: "$$", priceSource: "Official museum ticket page", attributeTags: ["museum", "history", "central", "accessible"], hours: { default: "Sun-Fri 10:00 AM-6:00 PM; Sat closed. The separate Judenplatz location closes at 5:00 PM Fri." }, officialUrl: "https://www.jmw.at/en/visit", sourcePhoto: media("Jewish Museum Vienna Dorotheergasse.jpg"), editorialUrls: ["https://www.wien.info/en/see-do/discover-vienna/jewish-vienna/jewish-museum-349300"] }),
  stop("vienna-culture-state-hall", "Austrian National Library State Hall", [48.2064, 16.3665], "The 18th-century State Hall is an 80-meter baroque library of frescoes, walnut bookcases, imperial statues, and enormous Venetian globes. It is visually immediate, but temporary exhibitions add intellectual substance to the room.", { venueKind: "culture", subcategory: "historic_library", price: "$$", priceSource: "Official museum ticket page", attributeTags: ["historic", "architecture", "central", "ticketed"], hours: { default: "Tue-Wed and Fri-Sun 9:00 AM-6:00 PM; Thu 9:00 AM-9:00 PM; closed Mondays October-May, with summer Monday openings and holiday exceptions on the official calendar." }, officialUrl: "https://www.onb.ac.at/en/museums/state-hall/", sourcePhoto: media("Austrian National Library State Hall Vienna.jpg"), editorialUrls: ["https://www.wien.info/en/art-culture/imperial-sights/national-library-353578"] }),
  stop("vienna-culture-mak", "MAK - Museum of Applied Arts", [48.2073, 16.381], "MAK connects Wiener Werkstätte furniture, textiles, glass, posters, Asian art, architecture, and contemporary design. The collection makes Vienna's famous interiors legible as systems of production, taste, and reform.", { venueKind: "culture", subcategory: "design_museum", price: "$$", priceSource: "Official ticket page", attributeTags: ["museum", "design", "architecture", "ticketed"], hours: { default: "Tue 10:00 AM-9:00 PM; Wed-Sun 10:00 AM-6:00 PM; Mon closed; open on public holidays." }, officialUrl: "https://www.mak.at/visit", sourcePhoto: media("MAK Museum Vienna.jpg"), editorialUrls: ["https://www.wien.info/en/art-culture/museums-exhibitions"] }),
  stop("vienna-culture-house-music", "House of Music", [48.2043, 16.3748], "Four interactive floors move from the Vienna Philharmonic and classical composers into acoustics, hearing, experimentation, and the famously unforgiving Virtual Conductor. It is one of the rare central museums that improves after dinner.", { venueKind: "culture", subcategory: "interactive_museum", price: "$$", priceSource: "Official ticket page", attributeTags: ["museum", "music", "family_friendly", "late_night"], hours: { default: "Daily 10:00 AM-10:00 PM, including weekends and public holidays; last entry 9:00 PM; Dec 24 closes 6:00 PM." }, officialUrl: "https://www.hdm.at/en/faq/what-are-the-opening-hours-/", sourcePhoto: media("Haus der Musik Vienna.jpg"), editorialUrls: ["https://www.wien.info/en/art-culture/music-stage-shows/house-music-348372"] }),
];

const activityStops: GuideStop[] = [
  stop("vienna-activity-schoenbrunn", "Schönbrunn Palace", [48.1845, 16.3122], "Schönbrunn is the imperial half-day: state rooms, Empress Maria Theresa's domestic theater of power, formal gardens, the Gloriette climb, and enough side attractions to punish an unplanned visit. Book a timed palace slot first, then shape the grounds around it.", { venueKind: "landmark", subcategory: "palace", price: "$$", priceSource: "Official timed-ticket page", attributeTags: ["historic", "garden", "family_friendly", "ticketed"], hours: { default: "Palace daily: Mar 27-Jun 30, 2026 8:30 AM-5:30 PM; Jul 1-Aug 31 8:30 AM-6:00 PM; Sep 1-Nov 2 8:30 AM-5:30 PM; Nov 3-Mar 31, 2027 8:30 AM-5:00 PM; last entry 45 minutes before closing. Park gates open 6:30 AM with seasonal closing." }, officialUrl: "https://www.schoenbrunn.at/en/visitor-information/opening-times/", sourcePhoto: media("Schönbrunn Palace Vienna.jpg"), editorialUrls: ["https://www.wien.info/en/art-culture/imperial-sights"] }),
  stop("vienna-activity-st-stephen", "St Stephen's Cathedral", [48.2085, 16.3731], "Vienna's tiled-roof Gothic landmark is both active cathedral and layered visitor site: the nave, catacombs, South Tower stairs, and lift-served North Tower each reveal a different building. Work around worship rather than treating it as a museum lobby.", { venueKind: "landmark", subcategory: "cathedral", price: "$", priceSource: "Official cathedral visitor tariffs", attributeTags: ["historic", "architecture", "central", "ticketed"], hours: { default: "Cathedral Mon-Sat 6:00 AM-10:00 PM and Sun/public holidays 7:00 AM-10:00 PM; tourist areas, towers, catacombs, guided tours, and worship restrictions follow the official cathedral schedule." }, officialUrl: "https://www.stephanskirche.at/", sourcePhoto: media("St. Stephen's Cathedral Vienna Austria.jpg"), editorialUrls: ["https://www.wien.info/en/see-do/sights-from-a-to-z/st-stephens-cathedral-359690"] }),
  stop("vienna-activity-sisi", "Sisi Museum and Imperial Apartments", [48.2075, 16.3655], "The Hofburg's Sisi Museum cuts through imperial mythology with personal objects, portraits, rooms, beauty rituals, restlessness, and the machinery of court life. Timed entry helps, and the lack of luggage storage matters on transfer days.", { venueKind: "culture", subcategory: "palace_museum", price: "$$", priceSource: "Official ticket page", attributeTags: ["museum", "historic", "central", "ticketed"], hours: { default: "Daily and public holidays 9:00 AM-5:30 PM; last admission and ticket office 4:30 PM; Sisi Museum galleries close 5:00 PM and Imperial Apartments 5:30 PM." }, officialUrl: "https://www.sisimuseum-hofburg.at/en/visitor-information/opening-hours/", sourcePhoto: media("Hofburg Vienna Michaelertrakt.jpg"), editorialUrls: ["https://www.wien.info/en/art-culture/imperial-sights"] }),
  stop("vienna-activity-opera", "Vienna State Opera", [48.2031, 16.369], "The State Opera is best experienced through an actual performance, standing-room ticket, or official guided tour rather than a façade photograph. Its repertory system means the building can present a different opera night after night during season.", { venueKind: "event_venue", subcategory: "opera_house", price: "$$", priceSource: "Official performance and tour calendar", attributeTags: ["music", "theatre_show", "historic", "central"], hours: { default: "Interior access is limited to performances and official guided tours; tour times and evening doors follow the dated official calendar. Foyer box office inquiries Mon-Sat 10:00 AM-6:00 PM." }, officialUrl: "https://www.wiener-staatsoper.at/en/staatsoper/guided-tours/", timetableUrl: "https://www.wiener-staatsoper.at/en/calendar/", sourcePhoto: media("Vienna State Opera building.jpg"), editorialUrls: ["https://www.wiener-staatsoper.at/en/opening-hours/"] }),
  stop("vienna-activity-riding-school", "Spanish Riding School", [48.2078, 16.3666], "The Winter Riding School is living court culture rather than a static horse museum. Choose among morning exercise, performance, architectural tour, and stable tour by date; in summer the Lipizzaners' program changes, so the calendar is the experience.", { venueKind: "event_venue", subcategory: "equestrian_school", price: "$$", priceSource: "Official 2026 program and booking page", attributeTags: ["historic", "family_friendly", "reservation_recommended", "ticketed"], hours: { default: "Visitor center daily 9:00 AM-4:00 PM and shop daily 9:00 AM-4:30 PM; morning exercise, performances, stable tours, and summer substitutions follow the official dated calendar." }, officialUrl: "https://www.srs.at/en/visitor-information/vienna/opening-hours", timetableUrl: "https://www.srs.at/files/pdf/SRS_TerminePreise_2026_Online_EN_01.pdf", sourcePhoto: media("Spanish Riding School Vienna.jpg"), editorialUrls: ["https://www.wien.info/en/art-culture/imperial-sights/spanish-riding-school-359386"] }),
  stop("vienna-activity-ferris-wheel", "Vienna Giant Ferris Wheel", [48.2166, 16.3959], "The 1897 Riesenrad turns slowly enough for the city to unfold: Prater rides below, the old center westward, and the Danube corridor beyond. Go near sunset, but accept that weather and queues can matter more than the nominal ride time.", { venueKind: "landmark", subcategory: "observation_wheel", price: "$$", priceSource: "Official ticket page", attributeTags: ["scenic", "family_friendly", "romantic", "ticketed"], hours: { default: "Open daily year-round; July 2026 dates list 9:00 AM-11:45 PM, while exact daily hours and maintenance closures follow the official date selector." }, officialUrl: "https://wienerriesenrad.com/en/opening-times/", sourcePhoto: media("Wiener Riesenrad Vienna.jpg"), editorialUrls: ["https://www.wien.info/en/see-do"] }),
  stop("vienna-activity-naschmarkt", "Naschmarkt", [48.1985, 16.3618], "Naschmarkt is most useful as a living city market rather than a souvenir checklist: go early for produce, compare prices, skip aggressive sampling, and use the Saturday flea market or surrounding specialist shops to widen the visit.", { venueKind: "retail", subcategory: "market", price: "$", priceSource: "City of Vienna market rules", attributeTags: ["market", "street_food", "free_entry", "central"], hours: { default: "Maximum stall hours Mon-Fri 6:00 AM-9:00 PM and Sat 6:00 AM-6:00 PM; all stalls core Tue-Fri 3:00 PM-6:00 PM; restaurants Mon-Sat 6:00 AM-11:00 PM and Sun/public holidays 9:00 AM-9:00 PM." }, officialUrl: "https://www.wien.gv.at/freizeit/naschmarkt", sourcePhoto: media("Naschmarkt Vienna.jpg"), editorialUrls: ["https://www.wien.info/en/dine-drink/markets/naschmarkt-353536"] }),
  stop("vienna-activity-belvedere", "Upper Belvedere", [48.1914, 16.3809], "Come for Klimt's The Kiss, stay for the baroque sightline, palace gardens, Schiele, and a collection that makes Austrian art more than one gilded image. Timed entry is worth booking during summer and weekends.", { venueKind: "culture", subcategory: "art_museum", price: "$$", priceSource: "Official timed-ticket page", attributeTags: ["museum", "art", "historic", "scenic"], hours: { default: "Daily 9:00 AM-6:00 PM; extended to 7:00 PM July 15-August 31, 2026; timed entry follows the official ticket calendar." }, officialUrl: "https://www.belvedere.at/en/visit/upper-belvedere", sourcePhoto: media("Upper Belvedere Vienna.jpg"), editorialUrls: ["https://www.wien.info/en/art-culture/museums-exhibitions/top-museums"] }),
  stop("vienna-activity-khm", "Kunsthistorisches Museum Wien", [48.2038, 16.3615], "The KHM is the museum to choose when one collection must carry the weight of imperial Vienna: Bruegel, Velázquez, Titian, antiquities, Kunstkammer objects, and monumental architecture justify a generous block of time.", { venueKind: "culture", subcategory: "art_museum", price: "$$", priceSource: "Official ticket page", attributeTags: ["museum", "art", "historic", "ticketed"], hours: { default: "Tue-Sun 10:00 AM-6:00 PM; Thu until 9:00 PM; Mon closed except listed public-holiday openings on the official calendar." }, officialUrl: "https://www.khm.at/en/visit/besucherinformation/hours-admission/", sourcePhoto: media("Kunsthistorisches Museum Wien.jpg"), editorialUrls: ["https://www.wien.info/en/art-culture/museums-exhibitions/top-museums"] }),
  stop("vienna-activity-kahlenberg", "Kahlenberg Viewpoint", [48.2767, 16.3339], "Kahlenberg gives the trip air: bus 38A reaches a broad view across Vienna, the Danube, vineyards, and the Vienna Woods, while walking routes can descend through Nussdorf and heuriger country. Clear weather makes the difference.", { venueKind: "outdoors", subcategory: "viewpoint", price: "$", priceSource: "Public viewpoint / official tourism page", attributeTags: ["scenic", "nature", "free_entry", "family_friendly"], hours: { default: "Public viewpoint and hiking approaches are accessible daily; bus 38A, church, café, restaurant, and seasonal trail facilities follow their own official timetables and weather policies." }, officialUrl: "https://www.wien.info/en/livable-vienna/parks-green-spaces/kahlenberg-337908", sourcePhoto: media("Kahlenberg Vienna view.jpg"), editorialUrls: ["https://www.austria.info/en-gb/locations/kahlenberg/"] }),
];

function guide(category: ListCategory, id: string, slug: string, seoSlug: string, title: string, description: string, stops: GuideStop[], guideSources: ListSource[], seoTitle: string, seoDescription: string): MapList {
  return {
    id,
    slug,
    seoSlug,
    seoTitle,
    seoDescription,
    title,
    description,
    url: maps(`${title} Vienna Austria`),
    category,
    location: viennaLocation,
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

export const viennaCitywideGuides: MapList[] = [
  guide("Food", "list-vienna-citywide-dining", "vienna-best-restaurants-citywide", "best-restaurants", "Vienna Restaurants With Range and Point of View", "Vienna's strongest dining moves between ambitious tasting menus, vegetable-led cooking, contemporary Wirtshaus craft, natural wine, and serious versions of the city's own cuisine. These ten stops reward planning without pretending every memorable dinner needs palace formality.", diningStops, sources.dining, "Best Restaurants in Vienna for Fine Dining and Modern Austrian Food", "Source-backed Vienna restaurant guide covering Steirereck, Mraz & Sohn, Konstantin Filippou, Pramerl & the Wolf, TIAN, Stern, Reznicek, MAST, Meierei, and Skopik & Lohn."),
  guide("Food", "list-vienna-medium-cheap-eats", "vienna-best-cheap-eats-medium-budget", "best-cheap-eats", "Sausage Stands, Counters, and Casual Vienna Meals", "Vienna's inexpensive and medium-budget food is strongest at sausage stands, sandwich counters, student institutions, unfussy Gasthäuser, and market rooms. The list stays useful by mixing central quick stops with neighborhood meals worth leaving the postcard loop for.", cheapEatStops, sources.cheapEats, "Best Cheap Eats in Vienna for Würstelstands, Markets, and Quick Meals", "Budget and medium-price Vienna food guide with Trzesniewski, Bitzinger, LEO, Wiener Würstelstand, Leberkas-Pepi, Kolar, Deewan, NENI, Kopp, and Swing Kitchen."),
  guide("Stay", "list-vienna-citywide-hotels", "vienna-best-hotels-citywide", "best-hotels", "Hotels for Imperial Scale, Design, and Smarter Bases", "Vienna hotels can put you inside imperial ceremony, modern luxury, art-filled townhouse rooms, lively museum-quarter design, or a social enterprise with real purpose. This hotel-only guide separates the stays by mood and location so the nightly premium has a reason.", hotelStops, sources.hotels, "Best Hotels in Vienna for Luxury, Design, and Central Bases", "Hotel-only Vienna guide with Sacher, Rosewood, Imperial, Park Hyatt, The Guesthouse, Sans Souci, Altstadt, Josefine, 25hours MuseumsQuartier, and magdas HOTEL."),
  guide("Stay", "list-vienna-citywide-hostels", "vienna-best-hostels-citywide", "best-hostels", "Hostels for Social Trips, Quiet Sleep, and Rail Logistics", "Vienna's hostel scene ranges from independent garden hostels and huge social properties to clean quiet bunks, family-friendly chains, and transport-first bases. Hotels are deliberately excluded so dorm quality, security, reception, kitchens, and actual traveler fit remain visible.", hostelStops, sources.hostels, "Best Hostels in Vienna for Budget Beds, Solo Trips, and Groups", "Hostel-only Vienna guide with Ruthensteiner, Wombat's, JO&JOE, St Christopher's, Vienna Boutique Hostel, Stadtaffe, A&T, a&o Hauptbahnhof, MEININGER Franz, and Myrthengasse."),
  guide("Nightlife", "list-vienna-pubs-dive-bars", "vienna-best-pubs-dive-bars", "best-pubs-and-dive-bars", "Pubs, Beer Rooms, and Casual Late-Night Vienna", "Vienna's casual nightlife lives in worn-in café-bars, serious beer rooms, brewpubs, cinema couches, and the Gürtel arches. These are places for pints, local texture, live sound, and an evening that does not need a reservation ritual.", pubStops, sources.pubs, "Best Pubs and Casual Bars in Vienna for Beer, Live Music, and Dive Nights", "Vienna pub and casual-nightlife guide covering Café Bendl, Espresso, Schikaneder, Känguruh, 1516, Ammutsøn, Brauhund, Beaver Brewing, Chelsea, and rhiz."),
  guide("Nightlife", "list-vienna-cocktail-bars", "vienna-best-cocktail-bars", "best-cocktail-bars", "Cocktail Bars for Architecture, Technique, and Late Hours", "Vienna's cocktail identity spans Adolf Loos modernism, hidden appointment bars, vaulted-cellar design, low-waste experimentation, lavish classics, and all-night central institutions. The common thread is a drink with enough craft to justify the room around it.", cocktailStops, sources.cocktails, "Best Cocktail Bars in Vienna for Loos Bar, Kleinod, Tür 7, and More", "Source-backed Vienna cocktail guide with Loos American Bar, Kleinod, Tür 7, JOSEF, Miranda, krypt, The Sign, Moby Dick, Dino's, and First Floor."),
  guide("Culture", "list-vienna-citywide-culture", "vienna-best-culture-museums-landmarks-citywide", "best-culture", "Museums That Explain Vienna Beyond the Palace", "Vienna's culture is not one imperial collection or one Klimt painting. This route connects old-master power, modernism, city history, Jewish Vienna, applied arts, contemporary work, baroque books, and an interactive music museum that stays open after dinner.", cultureStops, sources.culture, "Best Museums and Culture in Vienna for Art, History, Design, and Music", "Citywide Vienna culture guide with KHM, Albertina, Upper Belvedere, Leopold, mumok, Wien Museum, Jewish Museum, the National Library State Hall, MAK, and House of Music."),
  guide("Activities", "list-vienna-top-things-to-do", "vienna-top-things-to-do", "best-things-to-do", "Ten Stops That Make a First Vienna Trip Work", "A strong first Vienna trip needs imperial rooms, Gothic stone, live music culture, Lipizzan tradition, a market, major art, a slow turn above the Prater, and one high viewpoint beyond the Ring. These ten stops give the city range without turning it into a frantic monument count.", activityStops, sources.activities, "Top Things to Do in Vienna With 10 Essential Stops", "Ten source-backed Vienna things to do: Schönbrunn, St Stephen's, the Sisi Museum, State Opera, Spanish Riding School, Giant Ferris Wheel, Naschmarkt, Upper Belvedere, KHM, and Kahlenberg."),
];

viennaCitywideGuides.push(buildNatureGuide({
  city: "Vienna",
  country: "Austria",
  continent: "Europe",
  id: "list-vienna-citywide-nature",
  slug: "vienna-woods-wetlands-and-imperial-parks",
  seoSlug: "best-parks-and-nature",
  seoTitle: "Best Parks and Nature in Vienna for Woods, Wetlands and Imperial Gardens",
  seoDescription: "Ten source-backed Vienna landscapes spanning the Prater, Danube wetlands, Vienna Woods viewpoints, wildlife reserves, botanical collections, and historic parks.",
  title: "Danube Wetlands, Vienna Woods & Imperial Parks",
  description: "Vienna's green identity extends from formal Ringstrasse gardens to floodplain forest, vineyard hills, wildlife reserves, and the long recreational spine of the Danube. These ten places show both designed and self-willed landscapes.",
  createdAt: "2026-07-29T00:00:00.000Z",
  checkedAt: "2026-08-04",
  sources: [
    { name: "City of Vienna parks and nature", url: "https://www.wien.gv.at/english/environment/parks/" },
    { name: "Vienna Tourist Board green Vienna", url: "https://www.wien.info/en/livable-vienna/parks-green-spaces" },
    { name: "Donau-Auen National Park", url: "https://www.donauauen.at/en" },
  ],
  stops: [
    {
      id: "vienna-nature-prater",
      name: "Green Prater",
      coordinates: [48.216, 16.4],
      description: "Beyond the amusement park, long chestnut avenues, meadow, woodland, and former Danube channels make the Prater Vienna's great flat landscape for walking and cycling.",
      hours: { default: "Open 24 hours daily." },
      officialUrl: "https://www.wien.info/en/livable-vienna/parks-green-spaces/prater-344756",
      photo: "https://commons.wikimedia.org/wiki/File:Hauptallee_Prater_Wien_2022-08-09_20.jpg",
      attributeTags: ["large park", "cycling", "woodland", "meadow"],
    },
    {
      id: "vienna-nature-schoenbrunn",
      name: "Schönbrunn Palace Park",
      coordinates: [48.1845, 16.3122],
      description: "Formal parterres, wooded slopes, fountains, and the Gloriette axis turn the Habsburg estate into one of Europe's most legible designed landscapes.",
      hours: { default: "Park gates daily: Jan–Feb and Nov–Dec 6:30 AM–5:30 PM; Mar and Oct 6:30 AM–7:00 PM; Apr 6:30 AM–8:00 PM; May–Jul 6:30 AM–9:00 PM; Aug–Sep 6:30 AM–8:00 PM." },
      officialUrl: "https://www.schoenbrunn.at/en/about-schoenbrunn/gardens",
      attributeTags: ["historic garden", "formal landscape", "viewpoint", "UNESCO"],
    },
    {
      id: "vienna-nature-danube-island",
      name: "Danube Island",
      coordinates: [48.225, 16.41],
      description: "A twenty-one-kilometer flood-protection island doubles as Vienna's broad recreational corridor, with beaches, meadow, cycling routes, and quieter ecological sections.",
      hours: { default: "Open 24 hours daily." },
      officialUrl: "https://www.wien.gv.at/english/environment/water/danube-island/",
      attributeTags: ["river island", "cycling", "swimming", "flood landscape"],
    },
    {
      id: "vienna-nature-lobau",
      name: "Lobau",
      coordinates: [48.197, 16.514],
      description: "Backwaters, riparian forest, dry meadows, and old Danube channels form Vienna's section of Donau-Auen National Park, with sensitive habitat beyond the marked paths.",
      hours: { default: "Daily daybreak–dark on the Donau-Auen National Park official calendar." },
      officialUrl: "https://www.donauauen.at/en/visit/visitor-information/lobau",
      attributeTags: ["national park", "wetland", "riparian forest", "birding"],
    },
    {
      id: "vienna-nature-kahlenberg",
      name: "Kahlenberg and the Vienna Woods",
      coordinates: [48.2767, 16.3339],
      description: "Forest trails, vineyard edges, and a panoramic terrace overlook Vienna and the Danube from the city's northeastern Vienna Woods ridge.",
      hours: { default: "Open 24 hours daily." },
      officialUrl: "https://www.wien.info/en/livable-vienna/parks-green-spaces/kahlenberg-337890",
      attributeTags: ["forest", "vineyards", "hiking", "viewpoint"],
    },
    {
      id: "vienna-nature-lainzer-tiergarten",
      name: "Lainzer Tiergarten",
      coordinates: [48.171, 16.244],
      description: "Ancient oak and beech woodland, wild boar habitat, meadows, and hilltop views survive inside a walled former imperial hunting reserve.",
      hours: { default: "2026 daily hours: Jul 27–Aug 16 8:00 AM–8:30 PM; Aug 17–30 8:00 AM–8:00 PM; Aug 31–Sep 13 8:00 AM–7:30 PM; Sep 14–27 8:00 AM–7:00 PM; Sep 28–Oct 11 8:00 AM–6:30 PM; Oct 12–24 8:00 AM–6:00 PM; Oct 25–Nov 8 8:00 AM–5:00 PM; Nov 9–Dec 31 8:00 AM–4:30 PM." },
      officialUrl: "https://www.wien.gv.at/english/environment/forest/recreation/lainzertiergarten.html",
      attributeTags: ["wildlife reserve", "ancient woodland", "hiking", "family"],
    },
    {
      id: "vienna-nature-stadtpark",
      name: "Stadtpark",
      coordinates: [48.204, 16.381],
      description: "Curving paths, ornamental planting, mature trees, and the Wien River make this central nineteenth-century park an easy study in Ringstrasse landscape design.",
      hours: { default: "Open 24 hours daily." },
      officialUrl: "https://www.wien.gv.at/english/environment/parks/stadtpark.html",
      attributeTags: ["historic park", "central", "river", "accessible"],
    },
    {
      id: "vienna-nature-volksgarten",
      name: "Volksgarten",
      coordinates: [48.208, 16.36],
      description: "Thousands of roses, formal beds, fountains, and neoclassical monuments create an intensely maintained garden between the Hofburg and parliament.",
      hours: { default: "Daily: Mar 7:00 AM–7:00 PM; Apr–Oct 6:00 AM–10:00 PM; Nov–Feb 7:00 AM–5:30 PM." },
      officialUrl: "https://www.wien.info/en/see-do/sights-from-a-to-z/volksgarten-357880",
      attributeTags: ["rose garden", "formal garden", "historic park", "central"],
    },
    {
      id: "vienna-nature-tuerkenschanzpark",
      name: "Türkenschanzpark",
      coordinates: [48.234, 16.333],
      description: "Rolling lawns, ponds, streams, exotic specimen trees, and rocky garden structures give this neighborhood park unusually varied terrain and planting.",
      hours: { default: "Open 24 hours daily." },
      officialUrl: "https://www.wien.gv.at/english/environment/parks/tuerkenschanzpark.html",
      attributeTags: ["neighborhood park", "ponds", "specimen trees", "family"],
    },
    {
      id: "vienna-nature-botanical-garden",
      name: "Botanical Garden of the University of Vienna",
      coordinates: [48.191, 16.383],
      description: "Living research collections beside the Belvedere represent alpine, Pannonian, Mediterranean, and global flora across an accessible scientific garden.",
      hours: { default: "Daily: Jan and Nov–Dec 10:00 AM–4:00 PM; Feb–Mar and Oct 10:00 AM–5:00 PM; Apr–Sep 10:00 AM–6:00 PM. Closed Dec 24–Jan 6." },
      officialUrl: "https://botanischergarten.univie.ac.at/en/",
      attributeTags: ["botanical garden", "research", "alpine plants", "accessible"],
    },
  ],
}));
