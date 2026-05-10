import type { GuideStop, ListCategory, ListSource, MapList, SubmissionType } from "@/types";

const createdAt = "2026-05-10T00:00:00.000Z";

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

const londonLocation = {
  city: "London",
  country: "United Kingdom",
  continent: "Europe",
  scope: "city" as const,
};

const sources: Record<string, ListSource[]> = {
  food: [
    { name: "The Infatuation - Best Restaurants in London", url: "https://www.theinfatuation.com/london/guides/best-restaurants-london" },
    { name: "Eater London - Essential London Restaurants", url: "https://london.eater.com/maps/best-restaurants-london-38" },
    { name: "Michelin Guide - London restaurants", url: "https://guide.michelin.com/gb/en/greater-london/london/restaurants" },
  ],
  culture: [
    { name: "Visit London - Things to do in London", url: "https://www.visitlondon.com/things-to-do" },
    { name: "Time Out - London attractions", url: "https://www.timeout.com/london/attractions" },
    { name: "London Theatre - West End guide", url: "https://www.londontheatre.co.uk/theatre-news/west-end-theatre-guide" },
  ],
  stay: [
    { name: "Conde Nast Traveler - London hotels", url: "https://www.cntraveler.com/gallery/best-hotels-in-london" },
    { name: "Time Out - Best hotels in London", url: "https://www.timeout.com/london/hotels/best-hotels-in-london" },
    { name: "The Telegraph - London hotel guide", url: "https://www.telegraph.co.uk/travel/destinations/europe/united-kingdom/england/london/hotels/" },
  ],
  hostels: [
    { name: "Hostelworld - London hostels", url: "https://www.hostelworld.com/st/hostels/europe/england/london/" },
    { name: "Visit London - Budget accommodation", url: "https://www.visitlondon.com/where-to-stay/budget-accommodation" },
  ],
  nightlife: [
    { name: "Time Out - Best bars in London", url: "https://www.timeout.com/london/bars-and-pubs/best-bars-in-london" },
    { name: "The Infatuation - London bars", url: "https://www.theinfatuation.com/london/guides/best-bars-london" },
    { name: "Resident Advisor - London events", url: "https://ra.co/events/uk/london" },
  ],
  nature: [
    { name: "Royal Parks - London parks", url: "https://www.royalparks.org.uk/parks" },
    { name: "Visit London - Parks and gardens", url: "https://www.visitlondon.com/things-to-do/sightseeing/london-attraction/park" },
    { name: "Canal & River Trust - London canals", url: "https://canalrivertrust.org.uk/enjoy-the-waterways/canal-and-river-network/london" },
  ],
};

const photo = {
  london: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1600&q=80",
  restaurant: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80",
  pub: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1600&q=80",
  hotel: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80",
  theatre: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=1600&q=80",
  park: "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?auto=format&fit=crop&w=1600&q=80",
  market: "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?auto=format&fit=crop&w=1600&q=80",
  museum: "https://images.unsplash.com/photo-1564324144208-0fba095a2ae5?auto=format&fit=crop&w=1600&q=80",
  hostel: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1600&q=80",
};

const poiPhotos: Record<string, string> = {
  "covent-bar-american": "https://cdn.prod.website-files.com/68f4d1c2a6858f0bfbded044/69523fcda2f98be3456934d0_TheSavoy_American_Bar_Piano_Side_Jack_Hardy_2023%203%20(1).avif",
  "covent-bar-eve": "http://static1.squarespace.com/static/6963e188cc56fb63737dd363/t/6985d6a394f8c541cb40629b/1770378915642/Untitled+design-7.png?format=1500w",
  "covent-bar-foggs": "https://www.mr-foggs.com/propeller/uploads/sites/2/2024/02/TAVERN-VENUE-2.jpg",
  "covent-bar-lamb-flag": "https://gkbr-p-001.sitecorecontenthub.cloud/api/public/content/2e24602a17e941f9a0b418648592d1b8?v=96f496f3",
  "covent-bar-porterhouse": "https://www.porterhousebrewco.com/wp-content/uploads/2024/03/porterhouse-covent-garden.jpg",
  "covent-culture-national-gallery": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Galer%C3%ADa_Nacional%2C_Londres%2C_Inglaterra%2C_2014-08-07%2C_DD_036.JPG/3840px-Galer%C3%ADa_Nacional%2C_Londres%2C_Inglaterra%2C_2014-08-07%2C_DD_036.JPG",
  "covent-culture-royal-opera-house": "https://upload.wikimedia.org/wikipedia/commons/b/bb/Royal_Opera_House_and_ballerina.jpg",
  "covent-culture-somerset-house": "https://upload.wikimedia.org/wikipedia/commons/4/45/The_courtyard_of_Somerset_House%2C_Strand%2C_London_-_geograph.org.uk_-_1601172.jpg",
  "covent-culture-theatre-royal": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Theatre_Royal%2C_Drury_Lane_20130408_022.jpg/3840px-Theatre_Royal%2C_Drury_Lane_20130408_022.jpg",
  "covent-culture-transport-museum": "https://upload.wikimedia.org/wikipedia/commons/3/3a/London_Transport_Museum%2C_Covent_Garden.jpg",
  "covent-food-barbary": "https://cdn.sanity.io/images/2o1bir6p/production/ccb0cf75fc832dc30d3574a14209c530f0989157-2500x1667.jpg?rect=0,181,2500,1306&w=1200&h=627&fit=crop",
  "covent-food-clos-maggiore": "https://cdn.prod.website-files.com/61fabcffab54a71be404a2e5/65bc07ff2cff03d9a8a18c25_255-CarolSachs-ClosMaggiore-5D3_2974_LoRes.webp",
  "covent-food-dishoom": "https://cdn.sanity.io/images/daku84np/production/b492504165ed7b5327abddaf1086b7a099f65418-1200x797.jpg?rect=0,86,1200,627&w=1200&h=627&fit=crop&auto=format",
  "covent-food-frenchie": "https://frenchiecoventgarden.com/wp-content/uploads/2024/05/Frenchie-Covent-Garden-Dining-Room.jpg",
  "covent-food-rules": "https://rules.co.uk/wp-content/uploads/2024/05/Rules-Restaurant-Tables-Close-up-Table-Settings.jpg",
  "covent-stay-fielding": "https://www.fieldinghotel.co.uk/wp-content/uploads/2024/02/fielding-hotel-covent-garden.jpg",
  "covent-stay-henrietta": "https://cdn.prod.website-files.com/5ec4103257f3f04e327c1113/5edcfe64a6554e16a4f52263_og-henrietta.png",
  "covent-stay-nomad": "https://www.thenomadhotel.com/wp-content/uploads/2021/05/NoMad-London-Exterior.jpg",
  "covent-stay-one-aldwych": "https://www.onealdwych.com/wp-content/uploads/2025/02/OA_Exterior-Day-1-PH019_OA0724_001_WEB-scaled.jpg",
  "covent-stay-savoy": "https://cdn.prod.website-files.com/68f4d1c2a6858f0bfbded01c/6905fd1604f6b402518f81d0_Savoy-SEO-Image.jpg",
  "hostel-astor-museum": "https://astorhostels.co.uk/wp-content/uploads/2023/11/astor-museum-hostel-london.jpg",
  "hostel-generator": "https://staygenerator.com/web/media/widget-spaces-rooms/london/rooms-photos/generator-london-hostel-private-room-superior-king-1.jpg?mode=max&quality=100&v=202210271039",
  "hostel-onefam-notting": "https://onefamhostels.com/wp-content/uploads/2024/01/onefam-notting-hill-london.jpg",
  "hostel-st-christopher-borough": "https://images.ctfassets.net/wqkd101r9z5s/6ooLpT3FzFKu1RMg3D8FEW/0698a175c1a53a4af48babecc3274429/hero.jpg?w=720&q=85",
  "hostel-wombats": "https://www.wombats-hostels.com/fileadmin/_processed_/b/9/csm_London_architecture_outside_0d950a903d.webp",
  "nature-greenwich-park": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Greenwich_Park%2C_London%2C_from_the_observatory.jpg/3840px-Greenwich_Park%2C_London%2C_from_the_observatory.jpg",
  "nature-hampstead-heath": "https://upload.wikimedia.org/wikipedia/commons/6/65/01DVG_HAMPSTEAD_HEATH_EXTENSION.jpg",
  "nature-hyde-park": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Hyde_Park_London_from_the_air.jpg/3840px-Hyde_Park_London_from_the_air.jpg",
  "nature-regents-canal": "https://upload.wikimedia.org/wikipedia/commons/f/f0/Regents_Canal%2C_London%2C_England_-Islington_tunnel-21March2010.jpg",
  "nature-regents-park": "https://upload.wikimedia.org/wikipedia/commons/5/59/Regent%27s_Park_bandstand.jpg",
  "nature-richmond-park": "https://upload.wikimedia.org/wikipedia/commons/3/36/Richmond_Park_-_Pen_Ponds_-_geograph.org.uk_-_1755600.jpg",
  "notting-bar-churchill": "https://www.churchillarmskensington.co.uk/-/media/sites/main-website/mainsite/share-image-open-graph/fullers_share_image.jpg",
  "notting-bar-cow": "https://www.thecowlondon.co.uk/wp-content/uploads/2024/01/the-cow-notting-hill.jpg",
  "notting-bar-sun": "https://www.suninsplendourpub.co.uk/wp-content/uploads/2024/08/sun-in-splendour-notting-hill.jpg",
  "notting-bar-trailer": "https://trailerh.com/wp-content/uploads/2025/04/Trailer-Happiness-2025-Interiors-031.jpg",
  "notting-bar-walmer": "https://www.walmercastle-nottinghill.co.uk/wp-content/uploads/2023/11/WalmerCastle_0030_R_lowb.jpg",
  "notting-culture-electric-cinema": "https://upload.wikimedia.org/wikipedia/commons/3/3a/Electric_Cinema_Notting_Hill_2009.jpg",
  "notting-culture-graffik": "https://upload.wikimedia.org/wikipedia/commons/8/89/Portobello_Road%2C_Notting_Hill_-_geograph.org.uk_-_1271581.jpg",
  "notting-culture-museum-brands": "https://upload.wikimedia.org/wikipedia/commons/b/b4/Museum_of_Brands_1950s_displays.jpg",
  "notting-culture-portobello": "https://upload.wikimedia.org/wikipedia/commons/4/4f/Portobello_Road_market_London.jpg",
  "notting-culture-tabernacle": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Tabernacle_1.jpg/3840px-Tabernacle_1.jpg",
  "notting-food-core": "https://corebyclaresmyth.com/wp-content/uploads/2023/10/COREbyClareSmyth-46b.jpg",
  "notting-food-falafel-king": "https://www.falafelking.co.uk/wp-content/uploads/2024/01/falafel-king-portobello.jpg",
  "notting-food-farm-girl": "https://ed2s424mkhs.exactdn.com/wp-content/uploads/2024/10/Untitled-9-1024x569.jpg?strip=all",
  "notting-food-gold": "https://www.goldnottinghill.com/wp-content/uploads/2025/06/homecollage-1-300x294.png",
  "notting-food-ledbury": "https://www.theledbury.com/medium_large.1763919416.png",
  "notting-stay-kensington-court": "https://cdn.traveltripper.io/site-assets/32_918_19454/media/2018-10-19-063216/large_home-banner-1.jpg",
  "notting-stay-laslett": "https://www.living-rooms.co.uk/media/vq0plnga/livingrooms-22.jpg?anchor=center&mode=crop&quality=70&width=1200&height=800&rnd=133656834964670000",
  "notting-stay-portobello": "https://hotelcms-production.imgix.net/portobellohotel.com/wp-content/uploads/2018/12/Exterior.jpg",
  "notting-stay-ravna-gora": "https://www.ravnagorahotel.com/wp-content/uploads/2024/01/ravna-gora-hotel-london.jpg",
  "notting-stay-ruby-zoe": "https://digital.ihg.com/is/image/ihg/independent-london-10378057422-2x1",
  "shoreditch-bar-book-club": "https://images.squarespace-cdn.com/content/v1/687f8875e97234270604da3c/a8f41cb9-f651-4416-b628-a75f63057143/TBC+statement+%283080+x+1350+px%29.png?format=2500w",
  "shoreditch-bar-happiness": "https://images.squarespace-cdn.com/content/v1/5a11be1280bd5e96f8b8096a/1585772810398-J9NO2DU8K0ASK409999N/Happiness+Forgets+Interiors+2018-13.jpg?format=2500w",
  "shoreditch-bar-old-blue-last": "https://images.squarespace-cdn.com/content/v1/6272794b194fd97dab3c181a/3caa64cb-edc9-4c30-8bc0-d1f787b3215a/OBL+X+GREAT+ESCAPE+2+-_-49.JPG?format=2500w",
  "shoreditch-bar-queen-adelaide": "https://www.thequeenadelaide.co.uk/wp-content/uploads/sites/98/2024/04/DSC4538.jpg?format=auto&width=1920",
  "shoreditch-bar-village-underground": "https://villageunderground.co.uk/wp-content/uploads/2023/09/vu-about-365-large_opt-1.jpeg",
  "shoreditch-culture-barbican": "https://upload.wikimedia.org/wikipedia/commons/9/9a/Barbican_Centre%2C_London.jpg",
  "shoreditch-culture-brick-lane": "https://upload.wikimedia.org/wikipedia/commons/5/5d/Brick_Lane_street_signs.JPG",
  "shoreditch-culture-museum-home": "https://upload.wikimedia.org/wikipedia/commons/a/a9/Geffrye_Museum_-_geograph.org.uk_-_843762.jpg",
  "shoreditch-culture-spitalfields": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Old_Spitalfields_Market_Panorama%2C_London%2C_UK_-_Diliff.jpg/3840px-Old_Spitalfields_Market_Panorama%2C_London%2C_UK_-_Diliff.jpg",
  "shoreditch-culture-whitechapel": "https://upload.wikimedia.org/wikipedia/commons/5/54/Whitechapel_Gallery_-_geograph.org.uk_-_1651030.jpg",
  "shoreditch-food-brat": "https://bratrestaurant.co.uk/src/img/brat-x-redchurch-2.png",
  "shoreditch-food-manteca": "http://static1.squarespace.com/static/6148999de4729f514b11cace/t/61489cb8c50e045d873b32a2/1632148664579/Manteca+-220621-01.png?format=1500w",
  "shoreditch-food-pellicci": "https://epellicci.co.uk/wp-content/uploads/image42.jpg",
  "shoreditch-food-smoking-goat": "https://www.smokinggoatbar.com/src/img/share.png",
  "shoreditch-food-st-john": "https://stjohnrestaurant.com/cdn/shop/files/Bread-and-Wine_1200x800.jpg",
  "shoreditch-stay-batty-langley": "https://www.battylangleys.com/wp-content/uploads/2024/01/batty-langleys-bedroom.jpg",
  "shoreditch-stay-boundary": "https://boundary.london/wp-content/uploads/2024/01/Boundary-OG-grey@2x.png",
  "shoreditch-stay-citizenm": "https://assets.citizenm.com/images/hotels/europe/london/london-shoreditch/london-shoreditch-hotel-exterior.jpg",
  "shoreditch-stay-hoxton": "https://thehoxton.com/wp-content/uploads/sites/5/2020/05/Shoreditch_Hero.jpg",
  "shoreditch-stay-mondrian": "https://virginhotels.com/wp-content/uploads/2024/08/London-Shoreditch-Exterior.jpg",
  "soho-bar-bradleys": "https://www.bradleysspanishbar.com/quality_auto/deae33_caaaca5cb20e4b449cbe7f56b2a8012d~mv2.jpg",
  "soho-bar-french-house": "https://www.frenchhousesoho.com/img/frenchinsidebw_side2.jpg",
  "soho-bar-ronnies": "https://www.ronniescotts.co.uk/media/5y0hqxii/ronnie-scotts-stage.jpg",
  "soho-bar-ship": "https://www.shipsoho.co.uk/-/media/sites/main-website/mainsite/share-image-open-graph/fullers_share_image.jpg",
  "soho-bar-swift": "https://images.squarespace-cdn.com/content/v1/6408946af82c2a0b73bbf390/d53b143c-fe43-4b68-a67f-cd474043d43a/Swift+soho-115.jpg?format=2500w",
  "soho-culture-british-museum": "https://upload.wikimedia.org/wikipedia/commons/8/86/British_Museum_%28aerial%29.jpg",
  "soho-culture-carnaby": "https://upload.wikimedia.org/wikipedia/commons/8/81/Carnaby_Street%2C_London_2015.jpg",
  "soho-culture-liberty": "https://upload.wikimedia.org/wikipedia/commons/b/bb/Liberty_department_store_London.jpg",
  "soho-culture-photographers-gallery": "https://upload.wikimedia.org/wikipedia/commons/3/39/The_Photographers%27_Gallery%2C_London.jpg",
  "soho-culture-soho-theatre": "https://upload.wikimedia.org/wikipedia/commons/a/ad/Soho_Theatre.jpg",
  "soho-food-bao": "https://cdn.sanity.io/images/we4m1nyk/production/6c0f8c3d07710c3822521b096e76d4155a68a983-2880x1920.png",
  "soho-food-barrafina-dean": "https://www.barrafina.com/wp-content/uploads/2025/02/social-image.png",
  "soho-food-kiln": "https://kilnsoho.com/cms/uploads/image/kiln_insta_reopen.jpg",
  "soho-food-mildreds": "https://www.mildreds.com/wp-content/uploads/2024/06/mildreds-soho-restaurant.jpg",
  "soho-food-noble-rot": "https://cdn.noblerot.co.uk/nr_soho_hero.webp?q=100",
  "soho-stay-broadwick": "https://www.broadwicksoho.com/images/image.jpg",
  "soho-stay-ham-yard": "https://www.firmdalehotels.com/media/uukfasmm/ham-yard-hotel-library-1.jpg",
  "soho-stay-hazlitts": "https://www.hazlittshotel.com/wp-content/uploads/2024/01/hazlitts-hotel-soho-bedroom.jpg",
  "soho-stay-resident": "https://www.residenthotels.com/wp-content/uploads/2024/03/the-resident-soho-exterior.jpg",
  "soho-stay-z-hotel": "https://www.thezhotels.com/media/1502/4_img_5227.jpg?rxy=0.5306122448979592,0.7653061224489796&width=1200&height=1200&rnd=133383956904970000",
  "southbank-bar-anchor": "https://gkbr-p-001.sitecorecontenthub.cloud/api/public/content/2e24602a17e941f9a0b418648592d1b8?v=96f496f3",
  "southbank-bar-founders": "https://www.foundersarms.co.uk/wp-content/uploads/sites/88/2024/11/The-Founders-2024-78-1.jpg?format=auto&width=1920",
  "southbank-bar-omeara": "https://raeslondon.co.uk/wp-content/uploads/2023/02/87A8716-x-1024x682.jpg",
  "southbank-bar-twelve-knot": "https://www.seacontainerslondon.com/media/ymoh4fbf/website-banner-5.jpg?anchor=center&mode=crop&quality=70&width=740&height=540&rnd=133814251056930000",
  "southbank-bar-understudy": "https://www.nationaltheatre.org.uk/wp-content/uploads/2024/01/understudy-bar-national-theatre.jpg",
  "southbank-culture-bfi": "https://upload.wikimedia.org/wikipedia/commons/2/20/BFI_Southbank_2010.jpg",
  "southbank-culture-globe": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Restaurante_The_Swan%2C_Londres%2C_Inglaterra%2C_2014-08-11%2C_DD_113.jpg/3840px-Restaurante_The_Swan%2C_Londres%2C_Inglaterra%2C_2014-08-11%2C_DD_113.jpg",
  "southbank-culture-national-theatre": "https://upload.wikimedia.org/wikipedia/commons/3/3f/National_Theatre%2C_London.jpg",
  "southbank-culture-southbank-centre": "https://upload.wikimedia.org/wikipedia/commons/d/d2/Southbank_Centre_aerial_photo.jpg",
  "southbank-culture-tate-modern": "https://upload.wikimedia.org/wikipedia/commons/6/6f/Tate_Modern_%28London%29.jpg",
  "southbank-food-borough-market": "https://boroughmarket.org.uk/wp-content/uploads/2021/03/cropped-Social-URL-Image.jpg",
  "southbank-food-brat-x-climpson": "https://bratrestaurant.co.uk/src/img/brat-x-climspons.jpg",
  "southbank-food-flat-iron-square": "https://flatironsquare.co.uk/wp-content/uploads/2024/03/DSC02058-1024x683.jpg",
  "southbank-food-padella": "https://www.padella.co/wp-content/uploads/2026/04/padella-borough.webp",
  "southbank-food-wright-brothers": "https://cdn.shopify.com/s/files/1/0357/3497/8696/files/borough_2_500x.jpg?v=1723638311",
  "southbank-stay-citizenm": "https://assets.citizenm.com/images/hotels/europe/london/london-bankside/london-bankside-hotel-exterior.jpg",
  "southbank-stay-hoxton": "https://thehoxton.com/wp-content/uploads/sites/5/2020/05/Southwark_Lobby.jpg",
  "southbank-stay-london-bridge": "https://www.londonbridgehotel.com/wp-content/uploads/2024/01/london-bridge-hotel-exterior.jpg",
  "southbank-stay-park-plaza": "https://www.parkplazawestminsterbridge.com/wp-content/uploads/2020/01/PPWL_exterior_028-1-e1578926393892.jpg",
  "southbank-stay-sea-containers": "https://www.seacontainerslondon.com/media/0bjpoxdj/riverview_studio_suite_james_mcdonald_3.jpg?anchor=center&mode=crop&quality=70&width=2000&height=1010&rnd=134146925805970000",
};

const poiHours: Record<string, GuideStop["hours"]> = {
  "covent-bar-american": { default: "Daily noon-midnight." },
  "covent-bar-eve": { default: "Tue-Sat 5:00 PM-late; Sun-Mon closed." },
  "covent-bar-foggs": { default: "Mon-Wed noon-11:00 PM; Thu-Sat noon-1:00 AM; Sun noon-10:30 PM." },
  "covent-bar-lamb-flag": { default: "Mon-Sat noon-11:00 PM; Sun noon-10:30 PM." },
  "covent-bar-porterhouse": { default: "Mon-Sat noon-midnight; Sun noon-10:30 PM." },
  "covent-culture-national-gallery": { default: "Daily 10:00 AM-6:00 PM; Fri until 9:00 PM." },
  "covent-culture-royal-opera-house": { default: "Performance and tour times vary; daytime building access is usually around scheduled events." },
  "covent-culture-somerset-house": { default: "Daily 10:00 AM-6:00 PM; exhibition and event hours vary." },
  "covent-culture-theatre-royal": { default: "Performance and tour times vary by production." },
  "covent-culture-transport-museum": { default: "Daily 10:00 AM-6:00 PM." },
  "covent-food-barbary": { default: "Mon-Sat noon-11:00 PM; Sun noon-10:00 PM." },
  "covent-food-clos-maggiore": { default: "Daily noon-2:30 PM and 5:00 PM-10:30 PM." },
  "covent-food-dishoom": { default: "Daily 8:00 AM-11:00 PM; Fri-Sat until midnight." },
  "covent-food-frenchie": { default: "Tue-Sat noon-2:30 PM and 5:30 PM-10:00 PM; Sun-Mon closed." },
  "covent-food-rules": { default: "Mon-Sat noon-midnight; Sun noon-11:00 PM." },
  "covent-stay-fielding": { default: "24 hours." },
  "covent-stay-henrietta": { default: "24 hours." },
  "covent-stay-nomad": { default: "24 hours." },
  "covent-stay-one-aldwych": { default: "24 hours." },
  "covent-stay-savoy": { default: "24 hours." },
  "hostel-astor-museum": { default: "24 hours." },
  "hostel-generator": { default: "24 hours." },
  "hostel-onefam-notting": { default: "24 hours." },
  "hostel-st-christopher-borough": { default: "24 hours." },
  "hostel-wombats": { default: "24 hours." },
  "nature-greenwich-park": { default: "Daily 6:00 AM-dusk." },
  "nature-hampstead-heath": { default: "Open 24 hours." },
  "nature-hyde-park": { default: "Daily 5:00 AM-midnight." },
  "nature-regents-canal": { default: "Open 24 hours; towpath access can vary by section." },
  "nature-regents-park": { default: "Daily 5:00 AM-dusk." },
  "nature-richmond-park": { default: "Daily 7:30 AM-dusk; vehicle gate times vary seasonally." },
  "notting-bar-churchill": { default: "Daily noon-11:00 PM." },
  "notting-bar-cow": { default: "Mon-Sat noon-11:00 PM; Sun noon-10:30 PM." },
  "notting-bar-sun": { default: "Daily noon-11:00 PM." },
  "notting-bar-trailer": { default: "Tue-Thu 5:00 PM-midnight; Fri-Sat 5:00 PM-1:00 AM; Sun-Mon closed." },
  "notting-bar-walmer": { default: "Mon-Sat noon-11:00 PM; Sun noon-10:00 PM." },
  "notting-culture-electric-cinema": { default: "Screening times vary daily; cinema usually opens around the first screening." },
  "notting-culture-graffik": { default: "Daily 11:00 AM-6:00 PM." },
  "notting-culture-museum-brands": { default: "Mon-Sat 10:00 AM-6:00 PM; Sun 10:00 AM-5:00 PM." },
  "notting-culture-portobello": { default: "Market trading is usually Mon-Sat 9:00 AM-6:00 PM; main antiques day is Saturday." },
  "notting-culture-tabernacle": { default: "Daily 9:00 AM-11:00 PM; event times vary." },
  "notting-food-core": { default: "Tue-Sat lunch and dinner; Sun-Mon closed." },
  "notting-food-falafel-king": { default: "Daily 10:00 AM-8:00 PM." },
  "notting-food-farm-girl": { default: "Daily 8:00 AM-5:00 PM." },
  "notting-food-gold": { default: "Daily noon-late." },
  "notting-food-ledbury": { default: "Tue-Sat dinner; Fri-Sat lunch; Sun-Mon closed." },
  "notting-stay-kensington-court": { default: "24 hours." },
  "notting-stay-laslett": { default: "24 hours." },
  "notting-stay-portobello": { default: "24 hours." },
  "notting-stay-ravna-gora": { default: "24 hours." },
  "notting-stay-ruby-zoe": { default: "24 hours." },
  "shoreditch-bar-book-club": { default: "Tue-Thu 5:00 PM-midnight; Fri-Sat noon-2:00 AM; Sun noon-11:00 PM; Mon closed." },
  "shoreditch-bar-happiness": { default: "Tue-Sat 5:00 PM-11:30 PM; Sun-Mon closed." },
  "shoreditch-bar-old-blue-last": { default: "Mon-Sat noon-1:00 AM; Sun noon-midnight." },
  "shoreditch-bar-queen-adelaide": { default: "Mon-Sat noon-11:00 PM; Sun noon-10:30 PM." },
  "shoreditch-bar-village-underground": { default: "Event times vary; venue usually opens for evening shows and club nights." },
  "shoreditch-culture-barbican": { default: "Daily 10:00 AM-11:00 PM; gallery, cinema, and event times vary." },
  "shoreditch-culture-brick-lane": { default: "Street access is open 24 hours; busiest market hours are usually Sun 10:00 AM-5:00 PM." },
  "shoreditch-culture-museum-home": { default: "Tue-Sun 10:00 AM-5:00 PM; Mon closed." },
  "shoreditch-culture-spitalfields": { default: "Daily 10:00 AM-6:00 PM; trader hours vary." },
  "shoreditch-culture-whitechapel": { default: "Tue-Sun 11:00 AM-6:00 PM; Thu until 9:00 PM; Mon closed." },
  "shoreditch-food-brat": { default: "Daily noon-3:00 PM and 5:30 PM-10:30 PM." },
  "shoreditch-food-manteca": { default: "Mon-Sat noon-3:00 PM and 5:30 PM-10:30 PM; Sun noon-4:00 PM." },
  "shoreditch-food-pellicci": { default: "Mon-Sat 7:00 AM-3:30 PM; Sun closed." },
  "shoreditch-food-smoking-goat": { default: "Mon-Sat noon-midnight; Sun noon-10:30 PM." },
  "shoreditch-food-st-john": { default: "Mon-Sat 8:00 AM-11:00 PM; Sun 9:00 AM-6:00 PM." },
  "shoreditch-stay-batty-langley": { default: "24 hours." },
  "shoreditch-stay-boundary": { default: "24 hours." },
  "shoreditch-stay-citizenm": { default: "24 hours." },
  "shoreditch-stay-hoxton": { default: "24 hours." },
  "shoreditch-stay-mondrian": { default: "24 hours." },
  "soho-bar-bradleys": { default: "Mon-Sat noon-11:30 PM; Sun noon-10:30 PM." },
  "soho-bar-french-house": { default: "Mon-Sat noon-11:00 PM; Sun noon-10:30 PM." },
  "soho-bar-ronnies": { default: "Show times vary; club usually opens late afternoon through late evening." },
  "soho-bar-ship": { default: "Mon-Sat noon-11:00 PM; Sun noon-10:30 PM." },
  "soho-bar-swift": { default: "Daily 3:00 PM-midnight; Fri-Sat until 1:00 AM." },
  "soho-culture-british-museum": { default: "Daily 10:00 AM-5:00 PM; Fri until 8:30 PM." },
  "soho-culture-carnaby": { default: "Street access is open 24 hours; shops usually open 10:00 AM-8:00 PM." },
  "soho-culture-liberty": { default: "Mon-Sat 10:00 AM-8:00 PM; Sun 11:30 AM-6:00 PM." },
  "soho-culture-photographers-gallery": { default: "Tue-Sat 10:00 AM-6:00 PM; Thu until 8:00 PM; Sun 11:00 AM-6:00 PM; Mon closed." },
  "soho-culture-soho-theatre": { default: "Show times vary; venue is usually open afternoon through late evening on performance days." },
  "soho-food-bao": { default: "Mon-Sat noon-10:00 PM; Sun noon-9:00 PM." },
  "soho-food-barrafina-dean": { default: "Mon-Sat noon-11:00 PM; Sun noon-10:00 PM." },
  "soho-food-kiln": { default: "Mon-Sat noon-3:00 PM and 5:30 PM-10:30 PM; Sun closed." },
  "soho-food-mildreds": { default: "Daily 11:00 AM-11:00 PM." },
  "soho-food-noble-rot": { default: "Mon-Sat noon-11:00 PM; Sun closed." },
  "soho-stay-broadwick": { default: "24 hours." },
  "soho-stay-ham-yard": { default: "24 hours." },
  "soho-stay-hazlitts": { default: "24 hours." },
  "soho-stay-resident": { default: "24 hours." },
  "soho-stay-z-hotel": { default: "24 hours." },
  "southbank-bar-anchor": { default: "Daily 11:00 AM-11:00 PM." },
  "southbank-bar-founders": { default: "Daily 11:00 AM-11:00 PM." },
  "southbank-bar-omeara": { default: "Event times vary; venue usually opens for evening shows and club nights." },
  "southbank-bar-twelve-knot": { default: "Wed-Thu 5:00 PM-midnight; Fri-Sat 5:00 PM-1:00 AM; Sun noon-6:00 PM." },
  "southbank-bar-understudy": { default: "Mon-Sat noon-11:00 PM; Sun noon-6:00 PM." },
  "southbank-culture-bfi": { default: "Daily 11:00 AM-late; screening times vary." },
  "southbank-culture-globe": { default: "Tours usually run daily 10:00 AM-5:00 PM; performance times vary." },
  "southbank-culture-national-theatre": { default: "Mon-Sat 9:30 AM-late; Sun noon-6:00 PM; performance times vary." },
  "southbank-culture-southbank-centre": { default: "Daily 10:00 AM-11:00 PM; event and venue times vary." },
  "southbank-culture-tate-modern": { default: "Daily 10:00 AM-6:00 PM." },
  "southbank-food-borough-market": { default: "Mon-Fri 10:00 AM-5:00 PM; Sat 8:00 AM-5:00 PM; Sun 10:00 AM-4:00 PM." },
  "southbank-food-brat-x-climpson": { default: "Thu-Sat 6:00 PM-10:00 PM; Sun noon-4:00 PM." },
  "southbank-food-flat-iron-square": { default: "Tue-Sat noon-late; Sun noon-8:00 PM; Mon closed." },
  "southbank-food-padella": { default: "Daily noon-3:45 PM and 5:00 PM-10:00 PM." },
  "southbank-food-wright-brothers": { default: "Mon-Sat noon-10:00 PM; Sun noon-9:00 PM." },
  "southbank-stay-citizenm": { default: "24 hours." },
  "southbank-stay-hoxton": { default: "24 hours." },
  "southbank-stay-london-bridge": { default: "24 hours." },
  "southbank-stay-park-plaza": { default: "24 hours." },
  "southbank-stay-sea-containers": { default: "24 hours." },
};

const stops: Record<string, GuideStop> = {
  nobleRot: stop("soho-food-noble-rot", "Noble Rot Soho", [51.5126, -0.1318], "Noble Rot gives Soho a wine-led modern British anchor: serious bottles, sharp cooking, and enough polish for a planned dinner without losing the neighborhood's loose evening rhythm.", photo.restaurant, "$$$"),
  kiln: stop("soho-food-kiln", "Kiln", [51.5137, -0.1361], "Kiln is the compact counter stop for northern Thai grills, clay-pot noodles, and a room that moves fast. Use it when Soho needs high-flavor food before theater or drinks.", photo.restaurant, "$$"),
  barrafinaDean: stop("soho-food-barrafina-dean", "Barrafina Dean Street", [51.5138, -0.1327], "Barrafina Dean Street keeps Soho's tapas energy direct and useful: counter seats, seafood, tortillas, sherry, and a no-fuss format that works between shows and late bars.", photo.restaurant, "$$"),
  mildreds: stop("soho-food-mildreds", "Mildreds Soho", [51.5145, -0.1361], "Mildreds is the practical Soho vegetarian classic, good for mixed groups who need a casual table with enough pace to stay useful on a central London route.", photo.restaurant, "$$"),
  baoSoho: stop("soho-food-bao", "BAO Soho", [51.5137, -0.1366], "BAO Soho is small, efficient, and still one of the area's best quick destination meals, especially when the plan needs a short, satisfying stop rather than a long reservation.", photo.restaurant, "$$"),

  rules: stop("covent-food-rules", "Rules", [51.5107, -0.1234], "Rules brings Covent Garden its historic dining-room weight: game, pies, puddings, and theatre-district ceremony. Use it when the night wants old London rather than another casual bite.", photo.restaurant, "$$$"),
  closMaggiore: stop("covent-food-clos-maggiore", "Clos Maggiore", [51.5113, -0.1247], "Clos Maggiore is the romantic Covent Garden booking, with a polished dining room and pre-theatre usefulness that makes it a strong special-occasion anchor.", photo.restaurant, "$$$"),
  barbary: stop("covent-food-barbary", "The Barbary", [51.5142, -0.1268], "The Barbary gives the neighborhood a counter-service burst of North African and Middle Eastern cooking, ideal when Covent Garden needs energy instead of formality.", photo.restaurant, "$$"),
  dishoomCovent: stop("covent-food-dishoom", "Dishoom Covent Garden", [51.5124, -0.1269], "Dishoom Covent Garden is reliable for group-friendly Bombay cafe food, breakfast, and late meals in a part of town where dependable flexibility matters.", photo.restaurant, "$$"),
  frenchie: stop("covent-food-frenchie", "Frenchie Covent Garden", [51.5113, -0.1239], "Frenchie is the modern Covent Garden reservation for a tighter, more contemporary dinner before or after the West End, with enough polish to justify planning around it.", photo.restaurant, "$$$"),

  brat: stop("shoreditch-food-brat", "BRAT", [51.5245, -0.0755], "BRAT is the Shoreditch wood-fire benchmark, built around turbot, grilled breads, seasonal produce, and a room that feels destination-worthy without leaving east London.", photo.restaurant, "$$$"),
  smokingGoat: stop("shoreditch-food-smoking-goat", "Smoking Goat Shoreditch", [51.5238, -0.0787], "Smoking Goat is the high-impact casual stop for Thai drinking food, smoke, spice, and late energy. It fits when Shoreditch food should slide naturally into bars.", photo.restaurant, "$$"),
  stJohnBread: stop("shoreditch-food-st-john", "St. John Bread and Wine", [51.5208, -0.0734], "St. John Bread and Wine anchors Spitalfields with nose-to-tail British cooking, breakfast, and a spare dining room that still feels essential to the city.", photo.restaurant, "$$"),
  manteca: stop("shoreditch-food-manteca", "Manteca", [51.5263, -0.0808], "Manteca is the pasta-and-butcher counter pick, useful for a Shoreditch dinner that wants handmade comfort, cured meats, and proper reservation gravity.", photo.restaurant, "$$"),
  ePellicci: stop("shoreditch-food-pellicci", "E. Pellicci", [51.5262, -0.0629], "E. Pellicci gives east London a living-cafe classic: fry-ups, marble, regulars, and family history. Use it for daytime texture before the route turns more polished.", photo.restaurant, "$"),

  core: stop("notting-food-core", "Core by Clare Smyth", [51.5177, -0.2047], "Core is the Notting Hill fine-dining anchor, a destination reservation that turns the neighborhood into a planned evening rather than just a pastel-street wander.", photo.restaurant, "$$$"),
  theLedbury: stop("notting-food-ledbury", "The Ledbury", [51.5173, -0.2003], "The Ledbury is a serious Notting Hill booking with tasting-menu focus and neighborhood calm, ideal when west London needs the trip's most deliberate meal.", photo.restaurant, "$$$"),
  farmGirl: stop("notting-food-farm-girl", "Farm Girl", [51.5136, -0.2001], "Farm Girl is the easy daytime stop for brunch, coffee, and a softer Notting Hill pace before Portobello Road or a park walk.", photo.restaurant, "$$"),
  gold: stop("notting-food-gold", "Gold", [51.5161, -0.2032], "Gold brings wood-fired sharing plates and a lively room to Portobello Road, making it the neighborhood's useful bridge between market browsing and drinks.", photo.restaurant, "$$$"),
  falafelKing: stop("notting-food-falafel-king", "Falafel King", [51.5144, -0.2005], "Falafel King is the quick Portobello counter when the route needs a cheap, unfussy bite between shops, antiques, and the next west London stop.", photo.restaurant, "$"),

  boroughMarket: stop("southbank-food-borough-market", "Borough Market", [51.5054, -0.0906], "Borough Market is the South Bank area's flexible food engine: grazing, produce, bakeries, and quick counters that work for groups without locking the day into one table.", photo.market, "$$"),
  padella: stop("southbank-food-padella", "Padella Borough", [51.5051, -0.0899], "Padella is the pasta queue worth understanding before you go: fast, affordable, high-demand, and perfectly placed for a Borough-to-river route.", photo.restaurant, "$$"),
  bratXclimpson: stop("southbank-food-brat-x-climpson", "BRAT x Climpson's Arch", [51.5059, -0.0921], "BRAT's Borough-side presence gives the area a destination grill option when the market mood needs to become a proper dinner.", photo.restaurant, "$$$"),
  wrightBrothers: stop("southbank-food-wright-brothers", "Wright Brothers Borough", [51.5052, -0.0911], "Wright Brothers is the seafood and oyster stop near the market, useful when the South Bank route wants a briny counter rather than another street-food pass.", photo.restaurant, "$$"),
  flatIronSquare: stop("southbank-food-flat-iron-square", "Flat Iron Square", [51.5056, -0.0961], "Flat Iron Square works for casual groups, drinks, snacks, and flexible pacing between Borough, Tate Modern, and the river walk.", photo.market, "$$"),

  britishMuseum: stop("soho-culture-british-museum", "British Museum", [51.5194, -0.127], "The British Museum gives the central route global collection weight, but it is best used with a tight plan so the day keeps moving toward Soho or Covent Garden.", photo.museum),
  photographersGallery: stop("soho-culture-photographers-gallery", "The Photographers' Gallery", [51.5144, -0.1395], "The Photographers' Gallery is the compact Soho culture stop: contemporary photography, bookshop energy, and an easy hour between Oxford Street and Carnaby.", photo.museum),
  sohoTheatre: stop("soho-culture-soho-theatre", "Soho Theatre", [51.5142, -0.1321], "Soho Theatre keeps the neighborhood performance-led, with comedy, cabaret, and new writing that suit a night built around smaller rooms rather than major West End stages.", photo.theatre),
  carnabyStreet: stop("soho-culture-carnaby", "Carnaby Street", [51.5136, -0.1396], "Carnaby Street is commercial now, but its music, fashion, and youth-culture memory still makes it a useful orientation point for Soho's layered identity.", photo.london),
  liberty: stop("soho-culture-liberty", "Liberty London", [51.5141, -0.1402], "Liberty works as retail culture rather than just shopping: Tudor-revival architecture, design departments, and a central-London sense of occasion.", photo.london),

  royalOpera: stop("covent-culture-royal-opera-house", "Royal Opera House", [51.5129, -0.1222], "The Royal Opera House is Covent Garden's high-culture anchor, useful for ballet, opera, backstage tours, or just making the piazza feel connected to performance.", photo.theatre),
  nationalGallery: stop("covent-culture-national-gallery", "National Gallery", [51.5089, -0.1283], "The National Gallery gives the West End route a free, heavyweight art stop, especially useful when the day needs a culture anchor before dinner or theatre.", photo.museum),
  londonTransport: stop("covent-culture-transport-museum", "London Transport Museum", [51.5118, -0.1216], "London Transport Museum makes the city itself easier to read: tube maps, buses, design, and engineering history right inside Covent Garden.", photo.museum),
  somersetHouse: stop("covent-culture-somerset-house", "Somerset House", [51.5111, -0.1171], "Somerset House links galleries, courtyard programming, design events, and river-edge architecture, giving Covent Garden a broader cultural frame.", photo.museum),
  theatreRoyal: stop("covent-culture-theatre-royal", "Theatre Royal Drury Lane", [51.5129, -0.1206], "Theatre Royal Drury Lane is the West End heritage stop: restored interiors, long stage history, and a useful way to make theatre feel architectural too.", photo.theatre),

  barbican: stop("shoreditch-culture-barbican", "Barbican Centre", [51.5202, -0.0938], "The Barbican gives the east-central route brutalist architecture, concerts, cinema, galleries, and conservatory texture in one dense cultural complex.", photo.museum),
  whitechapelGallery: stop("shoreditch-culture-whitechapel", "Whitechapel Gallery", [51.5163, -0.0709], "Whitechapel Gallery is the contemporary-art anchor on the Shoreditch edge, useful for a sharper east London culture day beyond street art alone.", photo.museum),
  spitalfieldsMarket: stop("shoreditch-culture-spitalfields", "Old Spitalfields Market", [51.5197, -0.0755], "Old Spitalfields Market layers food, fashion, migration history, and East End commerce into a practical stop between Shoreditch and the City.", photo.market),
  brickLane: stop("shoreditch-culture-brick-lane", "Brick Lane", [51.5217, -0.0717], "Brick Lane is the street-culture corridor for curry houses, markets, murals, vintage shops, and east London identity that should be walked rather than rushed.", photo.london),
  geffrye: stop("shoreditch-culture-museum-home", "Museum of the Home", [51.5314, -0.0765], "Museum of the Home gives Shoreditch a quieter domestic-history stop, with period rooms and gardens that counterbalance the neighborhood's nightlife image.", photo.museum),

  portobello: stop("notting-culture-portobello", "Portobello Road Market", [51.5156, -0.2033], "Portobello Road Market is the Notting Hill spine: antiques, color, crowds, cafes, and the reason the neighborhood works best as a slow browse.", photo.market),
  electricCinema: stop("notting-culture-electric-cinema", "Electric Cinema", [51.515, -0.2058], "Electric Cinema gives Portobello an atmospheric film stop, pairing neighborhood glamour with a restored room that works for a quieter evening.", photo.theatre),
  museumBrands: stop("notting-culture-museum-brands", "Museum of Brands", [51.5177, -0.2063], "Museum of Brands is small but specific, turning packaging, advertising, and everyday objects into a surprisingly useful cultural detour.", photo.museum),
  tabernacle: stop("notting-culture-tabernacle", "The Tabernacle", [51.5173, -0.2017], "The Tabernacle connects Notting Hill to carnival, community arts, music, and local programming rather than only film-location prettiness.", photo.theatre),
  graffik: stop("notting-culture-graffik", "Graffik Gallery", [51.5191, -0.208], "Graffik Gallery adds street-art texture near Portobello, useful when the route needs a short contemporary stop between market browsing and food.", photo.museum),

  tateModern: stop("southbank-culture-tate-modern", "Tate Modern", [51.5076, -0.0994], "Tate Modern is the South Bank's cultural heavyweight, combining free collection time, Turbine Hall scale, river views, and easy links to Borough or St. Paul's.", photo.museum),
  globe: stop("southbank-culture-globe", "Shakespeare's Globe", [51.5081, -0.0972], "Shakespeare's Globe makes the river walk theatrical and historic, with tours and performances that fit naturally beside Tate Modern.", photo.theatre),
  southbankCentre: stop("southbank-culture-southbank-centre", "Southbank Centre", [51.5058, -0.1168], "Southbank Centre anchors the riverside with music, festivals, literature, food markets, and brutalist public space that changes by season.", photo.theatre),
  nationalTheatre: stop("southbank-culture-national-theatre", "National Theatre", [51.5071, -0.1141], "National Theatre gives the South Bank a major performance stop and a strong architectural presence, useful even when the plan is only drinks and a river walk.", photo.theatre),
  bfi: stop("southbank-culture-bfi", "BFI Southbank", [51.507, -0.1152], "BFI Southbank is the film-lover's anchor, with repertory screenings, festivals, and a location that slides easily into an evening by Waterloo.", photo.theatre),

  zSoho: stop("soho-stay-z-hotel", "The Z Hotel Soho", [51.5132, -0.1298], "The Z Hotel Soho is the compact central pick for travelers who want location over room size, especially for theatre, bars, and short stays.", photo.hotel, "$$"),
  hamYard: stop("soho-stay-ham-yard", "Ham Yard Hotel", [51.5118, -0.1347], "Ham Yard is the polished Soho design stay, with enough restaurant, bar, and courtyard energy to make the hotel part of the night.", photo.hotel, "$$$"),
  hazlitts: stop("soho-stay-hazlitts", "Hazlitt's", [51.514, -0.1338], "Hazlitt's gives Soho a historic townhouse base, useful for travelers who want character, centrality, and a quieter room behind the district's noise.", photo.hotel, "$$$"),
  broadwick: stop("soho-stay-broadwick", "Broadwick Soho", [51.5133, -0.1365], "Broadwick Soho is the maximalist luxury pick for a design-forward stay within walking distance of restaurants, theatres, and late bars.", photo.hotel, "$$$"),
  residentSoho: stop("soho-stay-resident", "The Resident Soho", [51.5141, -0.1356], "The Resident Soho is practical and central, with a quieter serviced-hotel feel that suits travelers planning to use the city more than the lobby.", photo.hotel, "$$"),

  nomad: stop("covent-stay-nomad", "NoMad London", [51.513, -0.1215], "NoMad London is the Covent Garden statement stay, set in the former Bow Street Magistrates' Court with destination dining and excellent theatre access.", photo.hotel, "$$$"),
  savoy: stop("covent-stay-savoy", "The Savoy", [51.5104, -0.1201], "The Savoy is the grand river-edge classic, best when the trip wants London hotel history, American Bar ritual, and a base between Covent Garden and the Thames.", photo.hotel, "$$$"),
  henrietta: stop("covent-stay-henrietta", "Henrietta Hotel", [51.5105, -0.1244], "Henrietta Hotel is a small Covent Garden base for travelers who want boutique scale, restaurant access, and a walkable West End plan.", photo.hotel, "$$$"),
  fielding: stop("covent-stay-fielding", "Fielding Hotel", [51.5133, -0.1237], "Fielding Hotel is the simpler theatre-district option, useful when location and value matter more than a full-service hotel scene.", photo.hotel, "$$"),
  oneAldwych: stop("covent-stay-one-aldwych", "One Aldwych", [51.5117, -0.1193], "One Aldwych gives Covent Garden a polished independent stay with a pool, strong service, and easy access to the Strand, theatres, and river.", photo.hotel, "$$$"),

  boundary: stop("shoreditch-stay-boundary", "Boundary Shoreditch", [51.5245, -0.0761], "Boundary Shoreditch is the design-hotel pick for rooftop drinks, east London dining, and a base that feels tied to the neighborhood's creative identity.", photo.hotel, "$$$"),
  hoxton: stop("shoreditch-stay-hoxton", "The Hoxton Shoreditch", [51.5273, -0.0818], "The Hoxton Shoreditch is the social-lobby classic, good for travelers who want east London energy, workspace, and easy access to bars.", photo.hotel, "$$"),
  mondrian: stop("shoreditch-stay-mondrian", "Mondrian Shoreditch", [51.5246, -0.0796], "Mondrian Shoreditch gives the area a larger, more polished base with rooftop pull and enough amenities for a longer east London stay.", photo.hotel, "$$$"),
  citizenM: stop("shoreditch-stay-citizenm", "citizenM London Shoreditch", [51.5244, -0.0788], "citizenM Shoreditch is the compact tech-forward option for travelers who want a simple room and a strong location near Boxpark and Shoreditch High Street.", photo.hotel, "$$"),
  battyLangley: stop("shoreditch-stay-batty-langley", "Batty Langley's", [51.5196, -0.0748], "Batty Langley's is the character townhouse stay near Spitalfields, useful when the route wants old East End atmosphere rather than new-build gloss.", photo.hotel, "$$$"),

  laslett: stop("notting-stay-laslett", "The Laslett", [51.5097, -0.1963], "The Laslett is the Notting Hill boutique base, well placed for Portobello, Holland Park, and travelers who want west London calm with design credibility.", photo.hotel, "$$$"),
  portobelloHotel: stop("notting-stay-portobello", "The Portobello Hotel", [51.5126, -0.202], "The Portobello Hotel gives the neighborhood romantic townhouse character and a quieter stay close to the market without feeling generic.", photo.hotel, "$$$"),
  rubyZoe: stop("notting-stay-ruby-zoe", "Ruby Zoe Hotel", [51.5104, -0.1976], "Ruby Zoe is the efficient modern pick near Notting Hill Gate, good for travelers who want west London access and a lighter hotel footprint.", photo.hotel, "$$"),
  ravnaGora: stop("notting-stay-ravna-gora", "Ravna Gora", [51.5113, -0.2008], "Ravna Gora is a value-oriented Notting Hill stay in a Victorian building, useful when budget matters but the route still wants west London placement.", photo.hotel, "$"),
  kensingtonCourt: stop("notting-stay-kensington-court", "Kensington Court Hotel Notting Hill", [51.5117, -0.1888], "Kensington Court Hotel is a practical west London base near transit, giving Notting Hill access without leaning on luxury pricing.", photo.hotel, "$$"),

  seaContainers: stop("southbank-stay-sea-containers", "Sea Containers London", [51.5081, -0.1069], "Sea Containers is the South Bank riverside stay for design, views, and a base that makes Tate Modern, Borough, and the West End easy to link.", photo.hotel, "$$$"),
  hoxtonSouthwark: stop("southbank-stay-hoxton", "The Hoxton Southwark", [51.5057, -0.1037], "The Hoxton Southwark gives the area a social, design-led base close to Blackfriars, Tate Modern, and Borough without West End hotel pricing.", photo.hotel, "$$"),
  citizenMSouthbank: stop("southbank-stay-citizenm", "citizenM London Bankside", [51.5055, -0.098], "citizenM Bankside is compact, reliable, and well placed for Tate, the river, and Borough Market, especially for short city breaks.", photo.hotel, "$$"),
  londonBridgeHotel: stop("southbank-stay-london-bridge", "London Bridge Hotel", [51.5052, -0.0864], "London Bridge Hotel is the practical station-side base for Borough, the City, and quick transit, good when the itinerary is bigger than the hotel.", photo.hotel, "$$"),
  parkPlaza: stop("southbank-stay-park-plaza", "Park Plaza Westminster Bridge", [51.5009, -0.1167], "Park Plaza Westminster Bridge is the large-format South Bank stay for families, groups, and landmark access near Westminster and Waterloo.", photo.hotel, "$$"),

  generator: stop("hostel-generator", "Generator London", [51.5265, -0.1248], "Generator London is the citywide hostel workhorse, with social spaces, dorms, and transit access that suit first-time visitors who want a central base.", photo.hostel, "$"),
  wombats: stop("hostel-wombats", "Wombat's City Hostel London", [51.5115, -0.0682], "Wombat's is the east-side social hostel near Tower Hill and Whitechapel, useful for travelers who want good common areas and easy transit.", photo.hostel, "$"),
  astorMuseum: stop("hostel-astor-museum", "Astor Museum Hostel", [51.5195, -0.1269], "Astor Museum is the culture-first budget base, sitting beside the British Museum with strong walking access to Soho and Covent Garden.", photo.hostel, "$"),
  onefamNotting: stop("hostel-onefam-notting", "Onefam Notting Hill", [51.5154, -0.1936], "Onefam Notting Hill is the social west London hostel pick, useful for travelers who want neighborhood calm by day and organized plans at night.", photo.hostel, "$"),
  stChristopherBorough: stop("hostel-st-christopher-borough", "St Christopher's Inn London Bridge", [51.5043, -0.0911], "St Christopher's Inn London Bridge works for backpackers who want Borough Market, river walks, and pub energy right at the door.", photo.hostel, "$"),

  frenchHouse: stop("soho-bar-french-house", "The French House", [51.5127, -0.1326], "The French House is the Soho regulars' pub: half-pints, history, artists, theatre people, and a room that works best as a focused stop rather than a crawl filler.", photo.pub, "$$"),
  bradleys: stop("soho-bar-bradleys", "Bradley's Spanish Bar", [51.515, -0.1328], "Bradley's keeps Soho scruffy and useful, with jukebox energy, simple drinks, and the kind of late central-London feel polished cocktail rooms cannot fake.", photo.pub, "$"),
  ship: stop("soho-bar-ship", "The Ship", [51.5139, -0.1362], "The Ship is a compact Soho pub for a proper pint before or after dinner, especially when the night needs old central-London texture.", photo.pub, "$"),
  swift: stop("soho-bar-swift", "Swift Soho", [51.5136, -0.1327], "Swift is the polished Soho cocktail pick, split between quick upstairs drinks and a more deliberate downstairs bar when the night has room to linger.", photo.pub, "$$$"),
  ronnieScotts: stop("soho-bar-ronnies", "Ronnie Scott's", [51.5135, -0.1319], "Ronnie Scott's is the jazz institution that turns a Soho night into a booked event. Plan it rather than treating it as a casual bar stop.", photo.theatre, "$$$"),

  lambFlag: stop("covent-bar-lamb-flag", "The Lamb & Flag", [51.5114, -0.1259], "The Lamb & Flag is the Covent Garden pub classic, tucked off the piazza with enough history and bustle to make it a strong pre-theatre pint.", photo.pub, "$$"),
  porterhouse: stop("covent-bar-porterhouse", "The Porterhouse", [51.5105, -0.1231], "The Porterhouse is the large, multi-level beer stop for groups who need capacity near Covent Garden without defaulting to a bland chain bar.", photo.pub, "$$"),
  americanBar: stop("covent-bar-american", "American Bar at The Savoy", [51.5104, -0.1202], "The American Bar is the heritage cocktail splurge, best used when the night wants ceremony and a sense of London hotel-bar history.", photo.pub, "$$$"),
  mrFoggs: stop("covent-bar-foggs", "Mr Fogg's Tavern", [51.5109, -0.1247], "Mr Fogg's Tavern is theatrical and tourist-friendly, but it earns a Covent Garden slot for groups wanting an easy themed drink near the shows.", photo.pub, "$$"),
  eveBar: stop("covent-bar-eve", "Eve Bar", [51.5115, -0.1238], "Eve Bar gives Covent Garden a basement cocktail option with more edge than the piazza's most obvious choices.", photo.pub, "$$$"),

  bookClub: stop("shoreditch-bar-book-club", "The Book Club", [51.5262, -0.0804], "The Book Club is a casual Shoreditch all-rounder for drinks, DJs, and group starts, useful when the night should stay flexible.", photo.pub, "$$"),
  happinessForgets: stop("shoreditch-bar-happiness", "Happiness Forgets", [51.5298, -0.0836], "Happiness Forgets is the basement cocktail benchmark for a quieter, better-made Hoxton drink before the night gets louder.", photo.pub, "$$$"),
  oldBlueLast: stop("shoreditch-bar-old-blue-last", "The Old Blue Last", [51.5246, -0.0807], "The Old Blue Last keeps Shoreditch tied to live music, beer, and late energy, making it a useful stop when the route wants a less polished room.", photo.pub, "$"),
  queenAdelaide: stop("shoreditch-bar-queen-adelaide", "The Queen Adelaide", [51.5248, -0.0755], "The Queen Adelaide is the pub pick near Hackney Road and Shoreditch High Street, good for a grounded pint between restaurants and clubs.", photo.pub, "$"),
  villageUnderground: stop("shoreditch-bar-village-underground", "Village Underground", [51.5233, -0.0782], "Village Underground gives Shoreditch a proper gig-and-club destination, best treated as the anchor of the night rather than a drop-in drink.", photo.theatre, "$$"),

  churchillArms: stop("notting-bar-churchill", "The Churchill Arms", [51.5069, -0.1948], "The Churchill Arms is famous for flowers and Thai food, but it still works as a Notting Hill pub landmark when the route wants charm and recognizability.", photo.pub, "$$"),
  trailerHappiness: stop("notting-bar-trailer", "Trailer Happiness", [51.5162, -0.2049], "Trailer Happiness gives Portobello a rum-soaked basement cocktail identity, ideal when Notting Hill needs a late stop with more personality than prettiness.", photo.pub, "$$"),
  theCow: stop("notting-bar-cow", "The Cow", [51.5206, -0.2001], "The Cow is the neighborhood pub-and-oyster institution, useful for a west London evening that starts with pints and seafood rather than cocktails.", photo.pub, "$$"),
  sunInSplendour: stop("notting-bar-sun", "Sun in Splendour", [51.5098, -0.1971], "Sun in Splendour is the practical Notting Hill Gate pub, good for meeting up, waiting out weather, or beginning a Portobello walk.", photo.pub, "$"),
  walmerCastle: stop("notting-bar-walmer", "The Walmer Castle", [51.5116, -0.2078], "The Walmer Castle is the polished pub option near Ledbury Road, with enough dining and cocktail pull for a more grown-up neighborhood night.", photo.pub, "$$"),

  anchorBankside: stop("southbank-bar-anchor", "The Anchor Bankside", [51.5074, -0.0927], "The Anchor Bankside is the riverside pub stop for views, history, and an easy pint between Borough Market and Tate Modern.", photo.pub, "$$"),
  foundersArms: stop("southbank-bar-founders", "Founder's Arms", [51.5083, -0.1048], "Founder's Arms is useful for straightforward river drinks, especially when the plan values Thames views over bar-world novelty.", photo.pub, "$$"),
  twelveKnot: stop("southbank-bar-twelve-knot", "12th Knot", [51.5081, -0.1069], "12th Knot is the rooftop South Bank cocktail stop, strongest at sunset when the river and skyline are part of the reason to go.", photo.pub, "$$$"),
  underStudy: stop("southbank-bar-understudy", "The Understudy", [51.5071, -0.1141], "The Understudy is the National Theatre bar for craft beer, casual drinks, and a performance-adjacent stop that does not require dressing up.", photo.pub, "$$"),
  omeara: stop("southbank-bar-omeara", "OMEARA", [51.5055, -0.0961], "OMEARA gives the Borough side a live-music and club option, useful when South Bank nightlife should continue after market drinks.", photo.theatre, "$$"),

  hydePark: stop("nature-hyde-park", "Hyde Park", [51.5073, -0.1657], "Hyde Park is London's central green reset: Serpentine walks, lawns, Speaker's Corner, and an easy link to Kensington Gardens and museum days.", photo.park),
  regentsPark: stop("nature-regents-park", "Regent's Park", [51.5313, -0.1569], "Regent's Park brings formal gardens, open fields, London Zoo, and Primrose Hill access into one of the city's most useful slow-day routes.", photo.park),
  hampsteadHeath: stop("nature-hampstead-heath", "Hampstead Heath", [51.5608, -0.1657], "Hampstead Heath is the wilder London park day, with ponds, hills, woods, and Parliament Hill views that make the city feel suddenly spacious.", photo.park),
  richmondPark: stop("nature-richmond-park", "Richmond Park", [51.4479, -0.2743], "Richmond Park is the big western escape, best for deer, long walks, cycling, and a half-day plan that leaves central London behind.", photo.park),
  greenwichPark: stop("nature-greenwich-park", "Greenwich Park", [51.4769, -0.0005], "Greenwich Park combines views, maritime history, the observatory, and village pacing, making it more than a simple park stop.", photo.park),
  regentsCanal: stop("nature-regents-canal", "Regent's Canal", [51.5396, -0.1454], "Regent's Canal is the linear London walk for Camden, King's Cross, Islington, and east London, useful when parks alone feel too static.", photo.park),
};

function stop(id: string, name: string, coordinates: [number, number], description: string, stopPhoto: string, price?: GuideStop["price"]): GuideStop {
  return {
    id,
    name,
    coordinates,
    description,
    ...(price ? { price, priceSource: "Editorial source review / Google Maps" } : {}),
    hours: poiHours[id] ?? { default: "Hours vary; check current official hours before going." },
    photo: poiPhotos[id] ?? stopPhoto,
  };
}

type GuideSpec = {
  id: string;
  slug: string;
  seoSlug: string;
  seoTitle: string;
  seoDescription: string;
  title: string;
  description: string;
  category: ListCategory;
  submissionType?: SubmissionType;
  itinerary?: MapList["itinerary"];
  neighborhood?: string;
  sourceKey: keyof typeof sources;
  stopIds: string[];
  stopDays?: number[];
};

function guide(spec: GuideSpec): MapList {
  const isItinerary = spec.submissionType === "itinerary";

  return {
    id: `list-london-${spec.id}`,
    slug: `london-${spec.slug}`,
    seoSlug: spec.seoSlug,
    seoTitle: spec.seoTitle,
    seoDescription: spec.seoDescription,
    title: spec.title,
    description: spec.description,
    url: `https://www.google.com/maps/search/${encodeURIComponent(spec.seoTitle.toLowerCase())}`,
    category: spec.category,
    ...(spec.itinerary ? { itinerary: spec.itinerary } : {}),
    ...(spec.submissionType ? { submissionType: spec.submissionType } : {}),
    location: spec.neighborhood
      ? { ...londonLocation, neighborhood: spec.neighborhood }
      : londonLocation,
    creator: {
      id: isItinerary ? "user-rguide-itineraries" : `user-rguide-${spec.category.toLowerCase()}`,
      name: isItinerary ? "R Itineraries" : `R ${spec.category}`,
      avatar: avatar(spec.category),
    },
    upvotes: 0,
    createdAt,
    stops: spec.stopIds.map((id, index) => ({
      ...stops[id],
      ...(isItinerary ? { itineraryDay: spec.stopDays?.[index] ?? 1 } : {}),
    })),
    sources: sources[spec.sourceKey],
  };
}

const neighborhoodGuides: GuideSpec[] = [
  foodGuide("soho-restaurants", "soho-restaurants", "Best Restaurants in Soho, London", "Old central London counters, wine rooms, Thai grills, tapas bars, and vegetarian classics for eating well before theatre or late drinks.", "Soho", ["nobleRot", "kiln", "barrafinaDean", "mildreds", "baoSoho"], "Theatreland Tables and Counter Heat"),
  foodGuide("covent-garden-restaurants", "covent-garden-restaurants", "Best Restaurants in Covent Garden, London", "Historic rooms, romantic bookings, counter cooking, and pre-theatre restaurants that keep Covent Garden from becoming only a show district.", "Covent Garden", ["rules", "closMaggiore", "barbary", "dishoomCovent", "frenchie"], "Pre-Theatre Classics and Counters"),
  foodGuide("shoreditch-restaurants", "shoreditch-restaurants", "Best Restaurants in Shoreditch, London", "Wood-fire rooms, Thai drinking food, East End cafes, pasta counters, and Spitalfields anchors for a food route that can roll into bars.", "Shoreditch", ["brat", "smokingGoat", "stJohnBread", "manteca", "ePellicci"], "Fire, Spice, and East London Tables"),
  foodGuide("notting-hill-restaurants", "notting-hill-restaurants", "Best Restaurants in Notting Hill, London", "Fine-dining anchors, brunch stops, Portobello grazing, and west London rooms for a neighborhood that rewards slower pacing.", "Notting Hill", ["core", "theLedbury", "farmGirl", "gold", "falafelKing"], "Portobello Browsing to Big Bookings"),
  foodGuide("south-bank-restaurants", "south-bank-restaurants", "Best Restaurants near South Bank, London", "Market grazing, pasta queues, seafood counters, river-adjacent dinners, and flexible group stops between Borough and the Thames.", "South Bank", ["boroughMarket", "padella", "bratXclimpson", "wrightBrothers", "flatIronSquare"], "Market Plates by the River"),

  cultureGuide("soho-culture", "soho-culture", "Best Culture in Soho, London", "Photography, comedy, jazz, retail history, and British Museum spillover for reading Soho as more than food, bars, and theatre crowds.", "Soho", ["britishMuseum", "photographersGallery", "sohoTheatre", "carnabyStreet", "liberty"], "Photography, Comedy, and Carnaby Memory"),
  cultureGuide("covent-garden-culture", "covent-garden-culture", "Best Culture in Covent Garden, London", "Opera, West End heritage, free major art, design history, and Strand institutions that make Covent Garden a cultural base.", "Covent Garden", ["royalOpera", "nationalGallery", "londonTransport", "somersetHouse", "theatreRoyal"], "Opera, Galleries, and Stage Doors"),
  cultureGuide("shoreditch-culture", "shoreditch-culture", "Best Culture in Shoreditch, London", "Brutalist arts, contemporary galleries, markets, street culture, and East End history for a sharper east London culture route.", "Shoreditch", ["barbican", "whitechapelGallery", "spitalfieldsMarket", "brickLane", "geffrye"], "East End Layers and Contemporary Rooms"),
  cultureGuide("notting-hill-culture", "notting-hill-culture", "Best Culture in Notting Hill, London", "Portobello antiques, cinema, carnival-linked community arts, design nostalgia, and small galleries for west London browsing.", "Notting Hill", ["portobello", "electricCinema", "museumBrands", "tabernacle", "graffik"], "Markets, Movies, and Carnival Echoes"),
  cultureGuide("south-bank-culture", "south-bank-culture", "Best Culture on South Bank, London", "Tate Modern, theatre, cinema, riverside festivals, and brutalist public space for London's easiest culture-heavy walk.", "South Bank", ["tateModern", "globe", "southbankCentre", "nationalTheatre", "bfi"], "A River Walk Built From Stages"),

  stayGuide("soho-stays", "soho-hotels", "Best Hotels in Soho, London", "Compact rooms, design hotels, townhouses, and nightlife-adjacent stays for travelers who want central London at the doorstep.", "Soho", ["zSoho", "hamYard", "hazlitts", "broadwick", "residentSoho"], "Sleep Inside the West End Current"),
  stayGuide("covent-garden-stays", "covent-garden-hotels", "Best Hotels in Covent Garden, London", "Grand hotels, boutique rooms, theatre-district value, and Strand access for a stay built around shows and walkability.", "Covent Garden", ["nomad", "savoy", "henrietta", "fielding", "oneAldwych"], "Theatre-Ready Hotel Bases"),
  stayGuide("shoreditch-stays", "shoreditch-hotels", "Best Hotels in Shoreditch, London", "Design hotels, social lobbies, Spitalfields townhouses, and rooftop energy for travelers using east London as their base.", "Shoreditch", ["boundary", "hoxton", "mondrian", "citizenM", "battyLangley"], "Design Hotels and East-Side Lobbies"),
  stayGuide("notting-hill-stays", "notting-hill-hotels", "Best Hotels in Notting Hill, London", "Townhouse character, boutique calm, value stays, and transit-friendly west London rooms near Portobello and Holland Park.", "Notting Hill", ["laslett", "portobelloHotel", "rubyZoe", "ravnaGora", "kensingtonCourt"], "Townhouse Calm Near Portobello"),
  stayGuide("south-bank-stays", "south-bank-hotels", "Best Hotels near South Bank, London", "Riverside design, station access, family-scale rooms, and Bankside bases for Tate, Borough, Westminster, and the Thames.", "South Bank", ["seaContainers", "hoxtonSouthwark", "citizenMSouthbank", "londonBridgeHotel", "parkPlaza"], "Riverside Beds and Easy Crossings"),

  hostelGuide("soho-hostels", "soho-hostels", "Best Hostels near Soho, London", "Central hostel bases that put budget travelers close to the British Museum, Soho, Covent Garden, and late-night transit.", "Soho", ["astorMuseum", "generator", "zSoho", "residentSoho"]),
  hostelGuide("covent-garden-hostels", "covent-garden-hostels", "Best Hostels near Covent Garden, London", "Budget stays and compact central rooms for travelers who want theatre, museums, and the West End without long night journeys.", "Covent Garden", ["astorMuseum", "generator", "fielding", "zSoho"]),
  hostelGuide("shoreditch-hostels", "shoreditch-hostels", "Best Hostels in Shoreditch, London", "East-side social bases for backpackers who want bars, markets, live music, and quick links into the City.", "Shoreditch", ["wombats", "generator", "citizenM", "battyLangley"]),
  hostelGuide("notting-hill-hostels", "notting-hill-hostels", "Best Hostels in Notting Hill, London", "West London budget bases for Portobello days, park access, and a quieter sleep than the central party districts.", "Notting Hill", ["onefamNotting", "ravnaGora", "rubyZoe", "kensingtonCourt"]),
  hostelGuide("south-bank-hostels", "south-bank-hostels", "Best Hostels near South Bank, London", "Borough and river-adjacent budget bases for travelers who want markets, Tate Modern, and station access on foot.", "South Bank", ["stChristopherBorough", "wombats", "citizenMSouthbank", "londonBridgeHotel"]),

  diveBarGuide("soho-dive-bars", "soho-dive-bars", "Best Dive Bars and Pubs in Soho, London", "Old pubs, jukebox rooms, jazz history, and low-lit Soho stops that keep the neighborhood grounded between cocktail reservations.", "Soho", ["frenchHouse", "bradleys", "ship", "swift", "ronnieScotts"], "Half-Pints, Jukeboxes, and Jazz"),
  popularBarGuide("soho-popular-bars", "soho-popular-nightlife", "Best Bars in Soho, London", "Cocktails, jazz, classic pubs, theatre-adjacent drinks, and central London rooms with enough pull to plan the night around.", "Soho", ["swift", "ronnieScotts", "frenchHouse", "nobleRot", "bradleys"], "Cocktails and Rooms With Gravity"),
  diveBarGuide("covent-garden-dive-bars", "covent-garden-dive-bars", "Best Pubs in Covent Garden, London", "Historic pubs, beer halls, and theatreland pints for drinking near Covent Garden without getting trapped by the piazza.", "Covent Garden", ["lambFlag", "porterhouse", "mrFoggs", "eveBar", "americanBar"], "Pints Off the Piazza"),
  popularBarGuide("covent-garden-popular-bars", "covent-garden-popular-nightlife", "Best Bars in Covent Garden, London", "Hotel-bar ceremony, themed taverns, basement cocktails, and large group-friendly rooms for West End nights.", "Covent Garden", ["americanBar", "eveBar", "porterhouse", "mrFoggs", "lambFlag"], "West End Drinks Before the Curtain"),
  diveBarGuide("shoreditch-dive-bars", "shoreditch-dive-bars", "Best Dive Bars and Pubs in Shoreditch, London", "Casual pubs, basement cocktails, live rooms, and flexible east London starts that can become a bigger night quickly.", "Shoreditch", ["oldBlueLast", "queenAdelaide", "bookClub", "happinessForgets", "villageUnderground"], "Loose Starts Around Old Street"),
  popularBarGuide("shoreditch-popular-bars", "shoreditch-popular-nightlife", "Best Bars in Shoreditch, London", "Cocktail basements, gig venues, DJ rooms, and group-friendly bars for an east London night with proper momentum.", "Shoreditch", ["happinessForgets", "villageUnderground", "bookClub", "oldBlueLast", "queenAdelaide"], "Basements, Gigs, and Late East Energy"),
  diveBarGuide("notting-hill-dive-bars", "notting-hill-dive-bars", "Best Pubs in Notting Hill, London", "Flowered pubs, seafood pints, Portobello basements, and neighborhood rooms that make west London feel lived in.", "Notting Hill", ["churchillArms", "theCow", "sunInSplendour", "trailerHappiness", "walmerCastle"], "Portobello Pints and Basement Rum"),
  popularBarGuide("notting-hill-popular-bars", "notting-hill-popular-nightlife", "Best Bars in Notting Hill, London", "Rum cocktails, polished pubs, Portobello drinks, and west London rooms for a softer but still lively night out.", "Notting Hill", ["trailerHappiness", "walmerCastle", "theCow", "churchillArms", "sunInSplendour"], "West London Drinks With Character"),
  diveBarGuide("south-bank-dive-bars", "south-bank-dive-bars", "Best Pubs near South Bank, London", "Riverside pubs, theatre bars, market drinks, and easy group stops for keeping a South Bank walk relaxed.", "South Bank", ["anchorBankside", "foundersArms", "underStudy", "flatIronSquare", "omeara"], "Pints Along the Thames"),
  popularBarGuide("south-bank-popular-bars", "south-bank-popular-nightlife", "Best Bars near South Bank, London", "Rooftop cocktails, river pubs, live music, theatre bars, and Borough-side rooms for a night that stays near the Thames.", "South Bank", ["twelveKnot", "anchorBankside", "foundersArms", "underStudy", "omeara"], "River Views Into Late Rooms"),
];

const citywideGuides: GuideSpec[] = [
  {
    id: "top-parks",
    slug: "top-parks-in-the-city",
    seoSlug: "best-parks",
    seoTitle: "Best Parks in London",
    seoDescription: "Best parks and green walks in London, from Hyde Park and Regent's Park to Hampstead Heath, Richmond Park, Greenwich, and Regent's Canal.",
    title: "Royal Parks, Heaths, and Canal Walks",
    description: "Use this when London needs air between museums, pubs, and markets: royal lawns, big heath views, deer park scale, maritime slopes, and canal walks that keep the route transit-aware.",
    category: "Nature",
    sourceKey: "nature",
    stopIds: ["hydePark", "regentsPark", "hampsteadHeath", "richmondPark", "greenwichPark", "regentsCanal"],
  },
  foodGuide("citywide-restaurants", "best-restaurants-citywide", "Best Restaurants in London", "Best restaurants in London, pulling destination meals from Soho, Covent Garden, Shoreditch, Notting Hill, and the South Bank.", undefined, ["nobleRot", "rules", "brat", "core", "boroughMarket", "theLedbury"], "Tables Worth Crossing the Tube For"),
  foodGuide("citywide-markets", "best-food-markets-citywide", "Best Food Markets in London", "Best food markets and grazing routes in London, from Borough and Spitalfields to Portobello, Covent Garden, and east London streets.", undefined, ["boroughMarket", "spitalfieldsMarket", "portobello", "flatIronSquare", "brickLane"], "Markets, Counters, and Grazing Streets"),
  foodGuide("citywide-pub-dining", "best-pub-food-citywide", "Best Pub Food in London", "Best pub and casual dining stops in London, using historic rooms, seafood pubs, theatreland pints, and East End classics.", undefined, ["frenchHouse", "lambFlag", "theCow", "anchorBankside", "ePellicci"], "Pints That Can Become Meals"),
  foodGuide("citywide-fine-dining", "best-fine-dining-citywide", "Best Fine Dining in London", "Best fine dining in London, collecting special-occasion bookings, tasting menus, grand rooms, and high-polish neighborhood anchors.", undefined, ["core", "theLedbury", "closMaggiore", "nobleRot", "brat", "rules"], "Reservations to Build the Trip Around"),
  foodGuide("citywide-south-asian", "best-south-asian-food-citywide", "Best South Asian Food in London", "Best South Asian and South Asian-influenced food routes in London, from Bombay cafe classics to market streets and central group meals.", undefined, ["dishoomCovent", "brickLane", "boroughMarket", "kiln", "smokingGoat"], "Spice Routes Across Central and East London"),
  popularBarGuide("citywide-popular-bars", "best-popular-bars-citywide", "Best Bars in London", "Best bars in London, from Soho cocktails and hotel classics to Shoreditch venues, west London pubs, and South Bank rooftops.", undefined, ["swift", "americanBar", "happinessForgets", "trailerHappiness", "twelveKnot"], "Cocktails, Clubs, and Skyline Drinks"),
  diveBarGuide("citywide-dive-bars", "best-dive-bars-citywide", "Best Pubs and Dive Bars in London", "Best pubs and low-key bars in London, collecting old central rooms, east London music pubs, Portobello pints, and riverside stops.", undefined, ["frenchHouse", "bradleys", "lambFlag", "oldBlueLast", "anchorBankside"], "Old Pubs and Late Rooms"),
  cultureGuide("citywide-culture", "best-culture-citywide", "Best Culture in London", "Best culture in London, linking museums, galleries, theatre, markets, modern art, and riverfront performance into a citywide route.", undefined, ["britishMuseum", "nationalGallery", "tateModern", "royalOpera", "barbican", "globe"], "Museums, Stages, and River Rooms"),
  stayGuide("citywide-hotels", "best-hotels-citywide", "Best Hotels in London", "Best hotels in London, comparing central nightlife, theatre access, east London design, west London calm, and South Bank river bases.", undefined, ["hamYard", "nomad", "boundary", "laslett", "seaContainers"], "Bases That Match the Itinerary"),
  hostelGuide("citywide-hostels", "best-hostels-citywide", "Best Hostels in London", "Best hostels in London for social central stays, east-side nights, west London calm, and South Bank access.", undefined, ["generator", "wombats", "astorMuseum", "onefamNotting", "stChristopherBorough"]),
  activityGuide("one-day-activities", "one-day-itinerary", "Best Things to Do in London in One Day", "Best one-day London itinerary, combining a major museum, market meal, riverside walk, theatre or gallery time, and a strong evening drink.", ["britishMuseum", "boroughMarket", "tateModern", "globe", "swift"], "One Strong Day, Kept Central", [1, 1, 1, 1, 1]),
  activityGuide("weekend-activities", "weekend-itinerary", "Best Things to Do in London for a Weekend", "Best London weekend itinerary, balancing West End shows, Soho meals, Shoreditch nightlife, South Bank culture, parks, and market browsing.", ["nomad", "nationalGallery", "rules", "ronnieScotts", "brat", "hampsteadHeath", "twelveKnot"], "Two Nights Across the Tube Map", [1, 1, 1, 1, 2, 2, 2]),
  activityGuide("week-activities", "week-itinerary", "Best Things to Do in London for a Week", "Best one-week London itinerary, using museums, restaurants, pubs, parks, markets, hostels, hotels, theatre, and neighborhood pacing.", ["generator", "hydePark", "britishMuseum", "kiln", "royalOpera", "brat", "brickLane", "portobello", "core", "tateModern", "boroughMarket", "hampsteadHeath"], "A Week of Villages, Parks, and Stages", [1, 1, 2, 2, 3, 3, 4, 5, 5, 6, 6, 7]),
];

function foodGuide(id: string, slug: string, seoTitle: string, seoDescription: string, neighborhood: string | undefined, stopIds: string[], title: string): GuideSpec {
  return baseGuide(id, slug, "best-restaurants", seoTitle, seoDescription, title, "London food works best when it is planned by area: markets, pubs, modern British rooms, South Asian routes, and reservations that respect tube time.", "Food", "food", neighborhood, stopIds);
}

function cultureGuide(id: string, slug: string, seoTitle: string, seoDescription: string, neighborhood: string | undefined, stopIds: string[], title: string): GuideSpec {
  return baseGuide(id, slug, "best-culture", seoTitle, seoDescription, title, "Use this culture route to connect London's museums, galleries, performance rooms, street history, and neighborhood texture without turning the day into a cross-town checklist.", "Culture", "culture", neighborhood, stopIds);
}

function stayGuide(id: string, slug: string, seoTitle: string, seoDescription: string, neighborhood: string | undefined, stopIds: string[], title: string): GuideSpec {
  return baseGuide(id, slug, "best-hotels", seoTitle, seoDescription, title, "London hotels should be chosen by transit line, sleep style, and the part of the city you will actually use after dark.", "Stay", "stay", neighborhood, stopIds);
}

function hostelGuide(id: string, slug: string, seoTitle: string, seoDescription: string, neighborhood: string | undefined, stopIds: string[]): GuideSpec {
  return baseGuide(id, slug, "best-hostels", seoTitle, seoDescription, "Budget Beds With Useful Transit", "Use this for lower-cost London bases that still respect late-night transit, social energy, and the neighborhood you want to wake up in.", "Stay", "hostels", neighborhood, stopIds);
}

function diveBarGuide(id: string, slug: string, seoTitle: string, seoDescription: string, neighborhood: string | undefined, stopIds: string[], title: string): GuideSpec {
  return baseGuide(id, slug, "best-dive-bars", seoTitle, seoDescription, title, "London's low-key drinking works through pubs, basement rooms, old regulars' bars, and live-music spaces rather than one generic nightlife strip.", "Nightlife", "nightlife", neighborhood, stopIds);
}

function popularBarGuide(id: string, slug: string, seoTitle: string, seoDescription: string, neighborhood: string | undefined, stopIds: string[], title: string): GuideSpec {
  return baseGuide(id, slug, "best-bars", seoTitle, seoDescription, title, "Use this when the night needs stronger pull: cocktail rooms, hotel bars, live venues, theatre-adjacent drinks, and late rooms with a reason to cross town.", "Nightlife", "nightlife", neighborhood, stopIds);
}

function activityGuide(id: string, slug: string, seoTitle: string, seoDescription: string, stopIds: string[], title: string, stopDays: number[]): GuideSpec {
  return {
    ...baseGuide(id, slug, "best-things-to-do", seoTitle, seoDescription, title, "London itineraries should be built by area and transit line, mixing museums, food, parks, pubs, theatre, and markets without wasting the day underground.", "Activities", "culture", undefined, stopIds),
    itinerary: {},
    submissionType: "itinerary",
    stopDays,
  };
}

function baseGuide(
  id: string,
  slug: string,
  seoSlug: string,
  seoTitle: string,
  seoDescription: string,
  title: string,
  description: string,
  category: ListCategory,
  sourceKey: keyof typeof sources,
  neighborhood: string | undefined,
  stopIds: string[],
): GuideSpec {
  return { id, slug, seoSlug, seoTitle, seoDescription, title, description, category, neighborhood, sourceKey, stopIds };
}

export const londonNeighborhoodGuides = neighborhoodGuides.map(guide);
export const londonCitywideGuides = citywideGuides.map(guide);
export const londonGuides = [
  ...londonNeighborhoodGuides,
  ...londonCitywideGuides,
];
