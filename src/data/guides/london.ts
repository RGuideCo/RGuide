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
  "covent-food-barbary": "https://cdn.sanity.io/images/2o1bir6p/production/bfdaff00e6cd8158f57aedba0588f40c2507efd2-7155x4770.jpg?w=1920&q=90&auto=format",
  "covent-food-clos-maggiore": "https://cdn.prod.website-files.com/668d40cbb7db38de48db057d/668d44d25ab92dd3690fff90__DSC2645.avif",
  "covent-food-dishoom": "https://cdn.sanity.io/images/daku84np/production/b492504165ed7b5327abddaf1086b7a099f65418-1200x797.jpg?rect=0,86,1200,627&w=1200&h=627&fit=crop&auto=format",
  "covent-food-rules": "https://i0.wp.com/rules.co.uk/wp-content/uploads/2024/05/Rules-Restaurant-Food-Menu-Venison.jpg?ssl=1&w=2500&quality=85",
  "covent-food-zedel": "https://www.brasseriezedel.com/wp-content/uploads/2026/04/Zedel_Spring_Mains-2000x1200.jpg",
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
  "notting-culture-portobello": "https://visitportobello.com/wp-content/uploads/2025/11/CGunwooMarketshot.webp",
  "notting-culture-tabernacle": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Tabernacle_1.jpg/3840px-Tabernacle_1.jpg",
  "notting-food-core": "https://corebyclaresmyth.com/wp-content/uploads/2023/10/CORE-cornishturbot-1.jpg",
  "notting-food-falafel-king": "https://kingoffalafel.has.restaurant/wp-content/uploads/sites/17/2018/06/The-King-of-Falafel-london-7-e1529657670603.jpg",
  "notting-food-farm-girl": "https://ed2s424mkhs.exactdn.com/wp-content/uploads/2024/11/FP4A1182-683x1024.jpg?strip=all",
  "notting-food-gold": "https://www.goldnottinghill.com/wp-content/uploads/2025/06/GOLD_FIRST_FLOOR_WINDOWS.jpg",
  "notting-food-ledbury": "https://www.theledbury.com/axs/i.php?/000/995/MF-coupe-and-spoon-The-Ledbury-2025-96,huge.1765452017.jpg",
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
  "shoreditch-culture-spitalfields": "https://oldspitalfieldsmarket.com/cms/2024/07/97b653e2-ad14-414c-91fb-dd2fb366beb1.jpg",
  "shoreditch-culture-whitechapel": "https://upload.wikimedia.org/wikipedia/commons/5/54/Whitechapel_Gallery_-_geograph.org.uk_-_1651030.jpg",
  "shoreditch-food-brat": "https://bratrestaurant.co.uk/src/img/brat-climpsons-arch-04.jpg",
  "shoreditch-food-manteca": "https://images.squarespace-cdn.com/content/v1/6148999de4729f514b11cace/b8d87449-e960-4d89-b8c2-115fc6888c82/0P4A3706.jpeg?format=2500w",
  "shoreditch-food-pellicci": "https://epellicci.co.uk/wp-content/uploads/image4-1.jpg",
  "shoreditch-food-smoking-goat": "https://www.smokinggoatbar.com/src/img/share.png",
  "shoreditch-food-st-john": "https://stjohn-restaurant.imgix.net/52b78d1336e789bd03c5eca344b9da7d2a096effc9cb584dad4ee1a8e08a?auto=compress,format&fit=crop&ixlib=imgixjs-3.3.0&w=3400",
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
  "soho-food-barrafina-dean": "https://www.barrafina.com/wp-content/uploads/2025/02/240709_Barrafina_CoalDrops_Food_065-1-scaled.jpg",
  "soho-food-kiln": "https://scontent-fra3-1.cdninstagram.com/v/t51.82787-15/652190186_18081722786582403_3357658624367464291_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=103&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiQ0FST1VTRUxfSVRFTS5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_ohc=vQQ_8ubSv9cQ7kNvwGEBXnP&_nc_oc=AdrfS08pPIfx1S0UroMwXddlb5zJPQfRyHwE9lBOoB2gf845GkjHoPT0y0eCCajRuKavOzxQ0jNO74Nv-fp3aqbt&_nc_zt=23&_nc_ht=scontent-fra3-1.cdninstagram.com&edm=ANo9K5cEAAAA&_nc_gid=9TiMT8Ag5ACxM42ZRyjrlg&_nc_tpa=Q5bMBQHTYyCUlH5yuPc2bzH8rohd_EasMHEtlfaxg8dl1sacbICAZAqbY47ODdjjMQBfKvQknHiEAL3r&oh=00_Af7kX_J2Z9K47NiGtFp45noDbuzQ2wodMuTrd077YnQ6dg&oe=6A0B7758",
  "soho-food-mildreds": "https://images.getbento.com/accounts/e2fb5c6326b80b895f7411e60cc25964/media/images/99429Mildreds_HayleyKelsingPhotography-2.jpg?w=1200&fit=crop&auto=compress,format&cs=origin&crop=focalpoint&fp-x=0.5&fp-y=0.5",
  "soho-food-noble-rot": "https://cdn.noblerot.co.uk/nr_soho_hero.webp?q=100",
  "soho-stay-broadwick": "https://www.broadwicksoho.com/images/image.jpg",
  "soho-stay-ham-yard": "https://www.firmdalehotels.com/media/uukfasmm/ham-yard-hotel-library-1.jpg",
  "soho-stay-hazlitts": "https://www.hazlittshotel.com/wp-content/uploads/2024/01/hazlitts-hotel-soho-bedroom.jpg",
  "soho-stay-resident": "https://www.residenthotels.com/wp-content/uploads/2024/03/the-resident-soho-exterior.jpg",
  "soho-stay-z-hotel": "https://www.thezhotels.com/media/1502/4_img_5227.jpg?rxy=0.5306122448979592,0.7653061224489796&width=1200&height=1200&rnd=133383956904970000",
  "southbank-bar-anchor": "https://gkbr-p-001.sitecorecontenthub.cloud/api/public/content/9048abc7728749c995323049618c3963?v=758bf063&t=w1540",
  "southbank-bar-founders": "https://www.foundersarms.co.uk/wp-content/uploads/sites/88/2024/11/The-Founders-2024-78-1.jpg?format=auto&width=1920",
  "southbank-bar-omeara": "https://raeslondon.co.uk/wp-content/uploads/2023/02/87A8716-x-1024x682.jpg",
  "southbank-bar-twelve-knot": "https://www.seacontainerslondon.com/media/ymoh4fbf/website-banner-5.jpg?anchor=center&mode=crop&quality=70&width=740&height=540&rnd=133814251056930000",
  "southbank-bar-understudy": "https://www.nationaltheatre.org.uk/wp-content/uploads/2024/01/understudy-bar-national-theatre.jpg",
  "southbank-culture-bfi": "https://upload.wikimedia.org/wikipedia/commons/2/20/BFI_Southbank_2010.jpg",
  "southbank-culture-globe": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Restaurante_The_Swan%2C_Londres%2C_Inglaterra%2C_2014-08-11%2C_DD_113.jpg/3840px-Restaurante_The_Swan%2C_Londres%2C_Inglaterra%2C_2014-08-11%2C_DD_113.jpg",
  "southbank-culture-national-theatre": "https://upload.wikimedia.org/wikipedia/commons/3/3f/National_Theatre%2C_London.jpg",
  "southbank-culture-southbank-centre": "https://upload.wikimedia.org/wikipedia/commons/d/d2/Southbank_Centre_aerial_photo.jpg",
  "southbank-culture-tate-modern": "https://upload.wikimedia.org/wikipedia/commons/6/6f/Tate_Modern_%28London%29.jpg",
  "southbank-food-borough-market": "https://boroughmarket.org.uk/wp-content/uploads/2021/03/Our-story.jpg",
  "southbank-food-brat-x-climpson": "https://bratrestaurant.co.uk/src/img/brat-restaurant-plaice.jpg",
  "southbank-food-flat-iron-square": "https://flatironsquare.co.uk/wp-content/uploads/2026/03/fis-x-v7-72.jpg",
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
  "covent-food-rules": { default: "Mon-Sat noon-midnight; Sun noon-11:00 PM." },
  "covent-food-zedel": { default: "Daily noon-11:00 PM." },
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
  "mayfair-food-maru": { default: "Tue-Sat lunch and dinner; Sun-Mon closed." },
  "mayfair-food-sketch": { default: "Daily lunch, afternoon tea, and dinner; room hours vary." },
  "mayfair-bar-masons-arms": { default: "Mon-Sat noon-11:00 PM; Sun noon-10:30 PM." },
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
  "shoreditch-food-gunpowder": { default: "Daily noon-10:30 PM." },
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
  "soho-food-four-seasons": { default: "Daily noon-11:00 PM." },
  "soho-food-hoppers": { default: "Mon-Sat noon-10:30 PM; Sun noon-9:30 PM." },
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
  "camden-food-market": { default: "Daily 10:00 AM-6:00 PM; food traders and late openings vary." },
  "fitzrovia-bar-lore-of-the-land": { default: "Mon-Sat noon-11:00 PM; Sun noon-10:30 PM." },
  "westminster-bar-red-lion": { default: "Mon-Sat noon-11:00 PM; Sun noon-10:30 PM." },
  "westminster-bar-sherlock-holmes": { default: "Mon-Sat noon-11:00 PM; Sun noon-10:30 PM." },
  "southbank-stay-citizenm": { default: "24 hours." },
  "southbank-stay-hoxton": { default: "24 hours." },
  "southbank-stay-london-bridge": { default: "24 hours." },
  "southbank-stay-park-plaza": { default: "24 hours." },
  "southbank-stay-sea-containers": { default: "24 hours." },
};

const stops: Record<string, GuideStop> = {
  nobleRot: stop("soho-food-noble-rot", "Noble Rot Soho", [51.5126, -0.1318], "Noble Rot Soho turns the former Gay Hussar site into a wine-led modern British dining room: go for serious bottles, confident seasonal cooking, and the feeling that dinner is plugged into Soho's literary and political past.", photo.restaurant, "$$$"),
  kiln: stop("soho-food-kiln", "Kiln", [51.5137, -0.1361], "Kiln is a counter around live fire, claypots, seafood, and regional Thai cooking shaped by northern Thailand, Burma, and Yunnan. Go when Soho needs heat, smoke, and close-up kitchen theatre rather than a polite pre-theatre table.", photo.restaurant, "$$"),
  barrafinaDean: stop("soho-food-barrafina-dean", "Barrafina Dean Street", [51.5138, -0.1327], "Barrafina Dean Street is the Soho tapas counter to choose for seafood, tortillas, croquetas, sherry, and quick decisions made from a stool. It works because the format keeps the meal lively without needing a long reservation.", photo.restaurant, "$$"),
  mildreds: stop("soho-food-mildreds", "Mildreds Soho", [51.5145, -0.1361], "Mildreds Soho is the long-running vegetarian crowd-pleaser for internationally inspired plant-based food, seasonal produce, cocktails, and enough menu range to satisfy mixed groups who are not all eating the same way.", photo.restaurant, "$$"),
  baoSoho: stop("soho-food-bao", "BAO Soho", [51.5137, -0.1366], "BAO Soho is small, fast, and focused: steamed buns, Taiwanese snacks, rice bowls, and a tight room that suits a quick destination meal before bars or theatre. Go for precision and texture, not lingering.", photo.restaurant, "$$"),
  hoppers: stop("soho-food-hoppers", "Hoppers Soho", [51.5133, -0.1365], "Hoppers Soho helped push Sri Lankan and South Indian cooking into central London's mainstream. Go for hoppers, dosas, kothu, sambols, kari, and arrack drinks in a room that feels like a real meal, not a novelty stop.", photo.restaurant, "$$"),
  fourSeasonsChinatown: stop("soho-food-four-seasons", "Four Seasons Chinatown", [51.5117, -0.1315], "Four Seasons Chinatown is the practical West End choice for Cantonese roast duck, char siu, rice plates, and group-friendly Chinese food when the guide needs something specific in Chinatown rather than a vague 'Asian' stop.", photo.restaurant, "$$"),

  rules: stop("covent-food-rules", "Rules", [51.5107, -0.1234], "Rules has been serving Covent Garden since 1798, and the point is old London ceremony: game from its estate, pies, puddings, polished service, and a dining room that makes a theatre night feel rooted rather than generic.", photo.restaurant, "$$$"),
  closMaggiore: stop("covent-food-clos-maggiore", "Clos Maggiore", [51.5113, -0.1247], "Clos Maggiore is the Covent Garden French booking for romance: Provençal and Tuscan influence, a flower-filled conservatory, deep wine list, and a pre-theatre setup that still feels like an occasion.", photo.restaurant, "$$$"),
  barbary: stop("covent-food-barbary", "The Barbary", [51.5142, -0.1268], "The Barbary is a Covent Garden counter built around the cooking of the Barbary Coast: North African fire, Middle Eastern breads, ferments, spice, and close-up grilling in Neal's Yard.", photo.restaurant, "$$"),
  dishoomCovent: stop("covent-food-dishoom", "Dishoom Covent Garden", [51.5124, -0.1269], "Dishoom Covent Garden channels old Bombay cafe culture into an all-day London workhorse: bacon naan rolls at breakfast, black daal, grills, chaats, cocktails, and a room that handles groups better than most central tables.", photo.restaurant, "$$"),
  zedel: stop("covent-food-zedel", "Brasserie Zedel", [51.5104, -0.1351], "Brasserie Zedel is the Piccadilly choice for scale and value: a grand Art Deco Parisian brasserie below street level, classic French dishes, fast pre-theatre service, and enough glamour to make an affordable meal feel dressed up.", photo.restaurant, "$$"),

  brat: stop("shoreditch-food-brat", "BRAT", [51.5245, -0.0755], "BRAT is the Shoreditch wood-fire benchmark for Basque-influenced cooking: whole turbot, grilled breads, seasonal produce, smoked potatoes, and a room where the grill is the reason to book rather than background atmosphere.", photo.restaurant, "$$$"),
  smokingGoat: stop("shoreditch-food-smoking-goat", "Smoking Goat Shoreditch", [51.5238, -0.0787], "Smoking Goat is built around Thai drinking food, charcoal, heat, and Bangkok late-night canteen energy. Go for fish-sauce wings, smoky sharing plates, strong drinks, and a Shoreditch dinner that can roll into bars.", photo.restaurant, "$$"),
  stJohnBread: stop("shoreditch-food-st-john", "St. John Bread and Wine", [51.5208, -0.0734], "St. John Bread and Wine is the Spitalfields branch of London's nose-to-tail institution, with breakfast, Eccles cakes, offal, roasts, rarebit, and a plain room that makes British cooking feel serious without fuss.", photo.restaurant, "$$"),
  manteca: stop("shoreditch-food-manteca", "Manteca", [51.5263, -0.0808], "Manteca is the Shoreditch pasta-and-butcher counter for hand-rolled pasta, house-cured salumi, nose-to-tail cuts, and Italian cooking with enough meat, fat, and craft to make a casual room feel destination-worthy.", photo.restaurant, "$$"),
  ePellicci: stop("shoreditch-food-pellicci", "E. Pellicci", [51.5262, -0.0629], "E. Pellicci is a family-run Bethnal Green cafe with over a century of history, Grade II-listed wood panelling, full English breakfasts, Italian classics, and a room where the welcome is part of the reason to go.", photo.restaurant, "$"),
  gunpowder: stop("shoreditch-food-gunpowder", "Gunpowder Spitalfields", [51.5187, -0.0758], "Gunpowder Spitalfields brings modern Indian small plates into a compact East End room: go for Kashmiri lamb, mustard fish, chaat, spice, and a sharper alternative to a generic Brick Lane curry stop.", photo.restaurant, "$$"),

  core: stop("notting-food-core", "Core by Clare Smyth", [51.5177, -0.2047], "Core is Clare Smyth's Notting Hill flagship, built around precise modern British tasting menus, elegant service, and dishes that make luxury feel calm rather than theatrical. Go when the meal is the trip anchor.", photo.restaurant, "$$$"),
  theLedbury: stop("notting-food-ledbury", "The Ledbury", [51.5173, -0.2003], "The Ledbury pairs Brett Graham's produce-led modern cooking with serious wine and a polished Notting Hill room. It is one of the west London bookings to choose when you want innovation without losing warmth.", photo.restaurant, "$$$"),
  farmGirl: stop("notting-food-farm-girl", "Farm Girl", [51.5136, -0.2001], "Farm Girl is the Portobello daytime stop for Australian-style brunch, coffee, smoothies, and a lighter Notting Hill rhythm before the market. It is more about morning fuel and people-watching than dinner ambition.", photo.restaurant, "$$"),
  gold: stop("notting-food-gold", "Gold", [51.5161, -0.2032], "Gold turns Portobello into a proper evening with wood-fired modern European plates, sharing dishes, a garden room, and enough polish to bridge the gap between casual market browsing and a booked dinner.", photo.restaurant, "$$$"),
  falafelKing: stop("notting-food-falafel-king", "Falafel King", [51.5144, -0.2005], "Falafel King is the Portobello counter for a low-cost reset: falafel, wraps, salads, and quick Middle Eastern food that makes sense between antiques, vintage shops, and a more expensive west London dinner.", photo.restaurant, "$"),
  sketch: stop("mayfair-food-sketch", "Sketch", [51.5129, -0.1416], "Sketch is the Mayfair restaurant complex to book for London spectacle: art-led rooms, Gallery afternoon tea, cocktails, and special-occasion dining where the interiors are as much the draw as the food.", photo.restaurant, "$$$"),
  maru: stop("mayfair-food-maru", "Maru", [51.5106, -0.1449], "Maru is a tiny Mayfair omakase counter built for precision: a small number of seats, Japanese technique, seasonal fish, and a quiet pace that adds East Asian fine-dining range to the London list.", photo.restaurant, "$$$"),

  boroughMarket: stop("southbank-food-borough-market", "Borough Market", [51.5054, -0.0906], "Borough Market has traded near London Bridge for around 1,000 years and is still London's defining food market. Go for Kappacasein toasties, Bread Ahead doughnuts, Brindisa, produce stalls, seafood, and grazing under the railway arches.", photo.market, "$$"),
  padella: stop("southbank-food-padella", "Padella Borough", [51.5051, -0.0899], "Padella Borough opened at the edge of the market in 2016 and helped reset London's fresh-pasta expectations: hand-rolled pasta in the window, affordable plates, wine, and a queue that is part of the ritual.", photo.restaurant, "$$"),
  bratXclimpson: stop("southbank-food-brat-x-climpson", "BRAT x Climpson's Arch", [51.5059, -0.0921], "BRAT x Climpson's Arch is a working factory-style dining room where the appeal is smoke, scale, and looseness: seasonal food from wood-fired ovens and grills, cocktails, and a more industrial sibling to the Shoreditch original.", photo.restaurant, "$$$"),
  wrightBrothers: stop("southbank-food-wright-brothers", "Wright Brothers Borough", [51.5052, -0.0911], "Wright Brothers Borough is the seafood counter to use when Borough Market needs to become a seated meal: oysters, shellfish, fish plates, cold white wine, and a briny pause from street-food grazing.", photo.restaurant, "$$"),
  flatIronSquare: stop("southbank-food-flat-iron-square", "Flat Iron Square", [51.5056, -0.0961], "Flat Iron Square is a Bankside courtyard and taproom setup for groups: rotating street-food vendors, beer, cocktails, screenings, DJs, and flexible seating near London Bridge without committing to one restaurant.", photo.market, "$$"),
  camdenMarket: stop("camden-food-market", "Camden Market", [51.5413, -0.1469], "Camden Market is the canal-side food-and-culture stop for street food, vintage fashion, alternative retail, and more than 1,000 stalls, shops, and vendors around Camden Lock and Hawley Wharf.", photo.market, "$$"),

  britishMuseum: stop("soho-culture-british-museum", "British Museum", [51.5194, -0.127], "The British Museum is the central London heavyweight for global archaeology, contested empire history, the Rosetta Stone, Assyrian reliefs, Egyptian galleries, and a Great Court that can anchor a whole morning if you choose a tight route.", photo.museum),
  photographersGallery: stop("soho-culture-photographers-gallery", "The Photographers' Gallery", [51.5144, -0.1395], "The Photographers' Gallery is the compact Soho stop for contemporary photography, changing exhibitions, photobooks, prints, and a smarter cultural pause between Oxford Street, Carnaby, and dinner.", photo.museum),
  sohoTheatre: stop("soho-culture-soho-theatre", "Soho Theatre", [51.5142, -0.1321], "Soho Theatre keeps the area performance-led beyond West End musicals, with comedy, cabaret, new writing, late shows, and small rooms that make a night feel current rather than purely tourist-facing.", photo.theatre),
  carnabyStreet: stop("soho-culture-carnaby", "Carnaby Street", [51.5136, -0.1396], "Carnaby Street is now retail-heavy, but it still works as a cultural waypoint for 1960s fashion, music, youth culture, independent shops, Kingly Court food stops, and the Soho-to-Mayfair shopping spine.", photo.london),
  liberty: stop("soho-culture-liberty", "Liberty London", [51.5141, -0.1402], "Liberty London is retail as architecture and design history: Tudor-revival frontage, fabric rooms, perfume, homeware, fashion edits, and a slower department-store experience than the Oxford Street crush outside.", photo.london),

  royalOpera: stop("covent-culture-royal-opera-house", "Royal Opera House", [51.5129, -0.1222], "The Royal Opera House is Covent Garden's grand performance anchor for opera, ballet, backstage tours, terrace drinks, and a sense of how the piazza's market history turned into London's most formal stage culture.", photo.theatre),
  nationalGallery: stop("covent-culture-national-gallery", "National Gallery", [51.5089, -0.1283], "The National Gallery gives the West End a free masterpiece stop, from Renaissance altarpieces to Turner, Van Gogh, and Impressionism, with Trafalgar Square right outside for an easy bridge into theatre or dinner.", photo.museum),
  londonTransport: stop("covent-culture-transport-museum", "London Transport Museum", [51.5118, -0.1216], "London Transport Museum is more useful than it sounds: Tube design, roundels, Routemasters, maps, engineering, posters, and a family-friendly way to understand how London became navigable.", photo.museum),
  somersetHouse: stop("covent-culture-somerset-house", "Somerset House", [51.5111, -0.1171], "Somerset House gives the Strand a civic courtyard, major exhibitions, design programming, winter skating, summer fountains, and river-edge architecture that widens a Covent Garden day beyond shops and theatres.", photo.museum),
  theatreRoyal: stop("covent-culture-theatre-royal", "Theatre Royal Drury Lane", [51.5129, -0.1206], "Theatre Royal Drury Lane is the West End heritage stop for restored interiors, long-running stage history, guided tours, afternoon tea, and the feeling that theatre can be architectural as well as performed.", photo.theatre),

  barbican: stop("shoreditch-culture-barbican", "Barbican Centre", [51.5202, -0.0938], "The Barbican is a whole cultural estate rather than one venue: brutalist walkways, concert halls, cinemas, galleries, theatre, the conservatory, and enough concrete atmosphere to make east-central London feel cinematic.", photo.museum),
  whitechapelGallery: stop("shoreditch-culture-whitechapel", "Whitechapel Gallery", [51.5163, -0.0709], "Whitechapel Gallery has shown modern and contemporary art on the East End edge for more than a century. Go for serious exhibitions, artist commissions, books, and a sharper counterweight to Shoreditch street-art shorthand.", photo.museum),
  spitalfieldsMarket: stop("shoreditch-culture-spitalfields", "Old Spitalfields Market", [51.5197, -0.0755], "Old Spitalfields Market mixes a Victorian market hall with independent designers, artisan makers, vintage and antique dealers, restaurants, and street-food kitchens, making it a useful bridge between Liverpool Street and Shoreditch.", photo.market),
  brickLane: stop("shoreditch-culture-brick-lane", "Brick Lane", [51.5217, -0.0717], "Brick Lane is the East End corridor where migration, food, street art, vintage retail, markets, curry houses, and bagel counters all overlap. Go to walk it slowly, then choose a specific food stop rather than treating the street as one venue.", photo.london),
  geffrye: stop("shoreditch-culture-museum-home", "Museum of the Home", [51.5314, -0.0765], "Museum of the Home uses almshouse buildings, period rooms, gardens, and domestic objects to show how Londoners have lived. It gives a Shoreditch day a quieter, more human scale after markets and bars.", photo.museum),

  portobello: stop("notting-culture-portobello", "Portobello Road Market", [51.5156, -0.2033], "Portobello Road Market is Notting Hill's main act: a mile-plus run of antiques, vintage, food, fashion, fruit and veg, and more than 1,000 vendors, with Friday and Saturday bringing the biggest antiques-and-crowd energy.", photo.market),
  electricCinema: stop("notting-culture-electric-cinema", "Electric Cinema", [51.515, -0.2058], "Electric Cinema gives Portobello a properly atmospheric evening stop: restored interiors, armchairs, sofas, a bar, and film programming that makes a movie feel like part of the neighborhood rather than a fallback plan.", photo.theatre),
  museumBrands: stop("notting-culture-museum-brands", "Museum of Brands", [51.5177, -0.2063], "Museum of Brands turns packaging, advertising, toys, household goods, and everyday design into a compact social-history walk. It is especially good when Portobello browsing needs context rather than another shop.", photo.museum),
  tabernacle: stop("notting-culture-tabernacle", "The Tabernacle", [51.5173, -0.2017], "The Tabernacle is Notting Hill's community-arts anchor, tied to carnival culture, live music, theatre, classes, food, and local programming. It helps the area feel lived-in rather than only cinematic.", photo.theatre),
  graffik: stop("notting-culture-graffik", "Graffik Gallery", [51.5191, -0.208], "Graffik Gallery gives the Portobello route a street-art and contemporary-painting stop, with exhibitions, workshops, and urban art context that connects west London browsing to the city's wider graffiti culture.", photo.museum),

  tateModern: stop("southbank-culture-tate-modern", "Tate Modern", [51.5076, -0.0994], "Tate Modern is the South Bank's cultural heavyweight: free modern-art collections, Turbine Hall scale, major exhibitions, river views, and an easy bridge to St Paul's or Borough when the museum energy starts to fade.", photo.museum),
  globe: stop("southbank-culture-globe", "Shakespeare's Globe", [51.5081, -0.0972], "Shakespeare's Globe makes the river walk theatrical through open-air performances, indoor Sam Wanamaker Playhouse shows, tours, and a rebuilt playhouse context that gives Bankside more than postcard views.", photo.theatre),
  southbankCentre: stop("southbank-culture-southbank-centre", "Southbank Centre", [51.5058, -0.1168], "Southbank Centre is a riverside campus for concerts, literature, festivals, talks, markets, public terraces, and brutalist architecture. It is the best South Bank stop when the day needs something scheduled but flexible.", photo.theatre),
  nationalTheatre: stop("southbank-culture-national-theatre", "National Theatre", [51.5071, -0.1141], "National Theatre gives the South Bank major drama, new writing, backstage buzz, terrace bars, and a monumental concrete presence. Even without a ticket, it is a useful cultural and drinking anchor by the river.", photo.theatre),
  bfi: stop("southbank-culture-bfi", "BFI Southbank", [51.507, -0.1152], "BFI Southbank is the film-lover's anchor for repertory screenings, festivals, restored classics, talks, a specialist bookshop, and a bar-cafe setup that fits neatly before or after Waterloo plans.", photo.theatre),

  zSoho: stop("soho-stay-z-hotel", "The Z Hotel Soho", [51.5132, -0.1298], "The Z Hotel Soho is for travelers choosing location over room size: compact rooms, sharp pricing for the area, and immediate access to theatres, Chinatown, Soho bars, Tottenham Court Road, and late-night food.", photo.hotel, "$$"),
  hamYard: stop("soho-stay-ham-yard", "Ham Yard Hotel", [51.5118, -0.1347], "Ham Yard is the polished Firmdale stay with bold interiors, a courtyard, restaurant, bar, roof terrace, spa, bowling alley, and a Soho location that lets the hotel feel like part of the night, not just a bed.", photo.hotel, "$$$"),
  hazlitts: stop("soho-stay-hazlitts", "Hazlitt's", [51.514, -0.1338], "Hazlitt's is the historic Soho townhouse option for four-poster character, literary atmosphere, antique-heavy rooms, and a quieter retreat behind Frith Street's restaurants and late bars.", photo.hotel, "$$$"),
  broadwick: stop("soho-stay-broadwick", "Broadwick Soho", [51.5133, -0.1365], "Broadwick Soho is the maximalist luxury choice for guests who want the hotel itself to have personality: vivid design, rooftop drinks, destination dining, and instant access to Berwick Street, Carnaby, and theatreland.", photo.hotel, "$$$"),
  residentSoho: stop("soho-stay-resident", "The Resident Soho", [51.5141, -0.1356], "The Resident Soho is a practical central base with compact rooms, in-room mini-kitchens, and a calmer serviced-hotel feel. Choose it when walkability matters more than lobby scene.", photo.hotel, "$$"),

  nomad: stop("covent-stay-nomad", "NoMad London", [51.513, -0.1215], "NoMad London turns the former Bow Street Magistrates' Court into a theatrical Covent Garden stay, with grand interiors, destination dining, cocktail energy, and unbeatable access to the Royal Opera House and West End.", photo.hotel, "$$$"),
  savoy: stop("covent-stay-savoy", "The Savoy", [51.5104, -0.1201], "The Savoy is the grand river-edge classic for London hotel history: Thames views, American Bar ritual, afternoon tea, service theatre, and a base that links Covent Garden, the Strand, and the South Bank.", photo.hotel, "$$$"),
  henrietta: stop("covent-stay-henrietta", "Henrietta Hotel", [51.5105, -0.1244], "Henrietta Hotel is a boutique Covent Garden base with townhouse scale, design-led rooms, strong restaurant access, and the kind of location that lets theatre, Soho, and the river stay walkable.", photo.hotel, "$$$"),
  fielding: stop("covent-stay-fielding", "Fielding Hotel", [51.5133, -0.1237], "Fielding Hotel is the simpler theatre-district choice on a quiet Covent Garden street, best when the priority is value, location, and getting to shows or the Tube without paying for a big hotel scene.", photo.hotel, "$$"),
  oneAldwych: stop("covent-stay-one-aldwych", "One Aldwych", [51.5117, -0.1193], "One Aldwych is the polished independent stay at the Covent Garden and Strand corner, with strong service, a pool, restaurants, and fast access to theatres, Somerset House, Waterloo Bridge, and the river.", photo.hotel, "$$$"),

  boundary: stop("shoreditch-stay-boundary", "Boundary Shoreditch", [51.5245, -0.0761], "Boundary Shoreditch is the design-hotel pick for Redchurch Street energy, rooftop drinks, strong neighborhood dining, and a base that feels connected to east London's creative identity rather than dropped into it.", photo.hotel, "$$$"),
  hoxton: stop("shoreditch-stay-hoxton", "The Hoxton Shoreditch", [51.5273, -0.0818], "The Hoxton Shoreditch is the social-lobby classic for east London: workspace, all-day restaurant energy, compact rooms, and an easy walk to Hoxton Square, Old Street, Shoreditch High Street, and late bars.", photo.hotel, "$$"),
  mondrian: stop("shoreditch-stay-mondrian", "Mondrian Shoreditch", [51.5246, -0.0796], "Mondrian Shoreditch is the larger polished base for guests who want east-side nightlife without giving up amenities: rooftop pull, pool-club energy, bigger-hotel service, and easy access to Spitalfields and Shoreditch.", photo.hotel, "$$$"),
  citizenM: stop("shoreditch-stay-citizenm", "citizenM London Shoreditch", [51.5244, -0.0788], "citizenM Shoreditch is the compact tech-forward option for travelers who want a reliable room, 24-hour lobby, strong Wi-Fi, and location near Boxpark, Shoreditch High Street, and the Overground.", photo.hotel, "$$"),
  battyLangley: stop("shoreditch-stay-batty-langley", "Batty Langley's", [51.5196, -0.0748], "Batty Langley's is the Spitalfields character stay, all Georgian townhouse atmosphere, antique furniture, drawing rooms, and old East End mood within walking distance of Liverpool Street and Brick Lane.", photo.hotel, "$$$"),

  laslett: stop("notting-stay-laslett", "The Laslett", [51.5097, -0.1963], "The Laslett is the Notting Hill boutique base for design, books, art, neighborhood calm, and immediate Notting Hill Gate transport. It suits travelers who want west London texture rather than a grand hotel bubble.", photo.hotel, "$$$"),
  portobelloHotel: stop("notting-stay-portobello", "The Portobello Hotel", [51.5126, -0.202], "The Portobello Hotel is the romantic townhouse stay close to the market, known for eccentric rooms, rock-and-roll west London lore, and a quieter residential feel just off Portobello Road.", photo.hotel, "$$$"),
  rubyZoe: stop("notting-stay-ruby-zoe", "Ruby Zoe Hotel", [51.5104, -0.1976], "Ruby Zoe is the efficient modern Notting Hill Gate pick, with compact rooms, a bar, transit access, and a lighter price-to-location equation than the neighborhood's more romantic townhouse hotels.", photo.hotel, "$$"),
  ravnaGora: stop("notting-stay-ravna-gora", "Ravna Gora", [51.5113, -0.2008], "Ravna Gora is a value-oriented west London stay in a Victorian building, useful for travelers who want Portobello and Holland Park nearby without pretending the budget is luxury.", photo.hotel, "$"),
  kensingtonCourt: stop("notting-stay-kensington-court", "Kensington Court Hotel Notting Hill", [51.5117, -0.1888], "Kensington Court Hotel is a practical transit-first west London base, better for guests who need simple rooms near Notting Hill Gate, Bayswater, and Kensington Gardens than a scene-heavy hotel.", photo.hotel, "$$"),

  seaContainers: stop("southbank-stay-sea-containers", "Sea Containers London", [51.5081, -0.1069], "Sea Containers is the South Bank riverside stay for design, Thames views, rooftop drinks, and a base that links Tate Modern, Borough, Blackfriars, and the West End without making the river feel like a commute.", photo.hotel, "$$$"),
  hoxtonSouthwark: stop("southbank-stay-hoxton", "The Hoxton Southwark", [51.5057, -0.1037], "The Hoxton Southwark gives Bankside a social, design-led base with lobby energy, restaurants, workspace, and quick walks to Blackfriars, Tate Modern, Borough Market, and the Thames Path.", photo.hotel, "$$"),
  citizenMSouthbank: stop("southbank-stay-citizenm", "citizenM London Bankside", [51.5055, -0.098], "citizenM Bankside is compact, reliable, and well placed for Tate Modern, Shakespeare's Globe, Borough Market, and London Bridge, especially when a short trip needs a simple room and strong location.", photo.hotel, "$$"),
  londonBridgeHotel: stop("southbank-stay-london-bridge", "London Bridge Hotel", [51.5052, -0.0864], "London Bridge Hotel is the practical station-side base for Borough Market, the Shard, trains, and the City. Choose it when fast movement matters more than a destination lobby.", photo.hotel, "$$"),
  parkPlaza: stop("southbank-stay-park-plaza", "Park Plaza Westminster Bridge", [51.5009, -0.1167], "Park Plaza Westminster Bridge is the large-format South Bank stay for families and groups who want Westminster, Waterloo, the London Eye, meeting rooms, and landmark access without tiny central rooms.", photo.hotel, "$$"),

  generator: stop("hostel-generator", "Generator London", [51.5265, -0.1248], "Generator London is the social hostel workhorse near Russell Square and King's Cross, with dorms, private rooms, a bar, lounge spaces, and enough transit reach for first-time visitors who want central without sterile.", photo.hostel, "$"),
  wombats: stop("hostel-wombats", "Wombat's City Hostel London", [51.5115, -0.0682], "Wombat's City Hostel is the east-side social base near Tower Hill and Whitechapel, useful for backpackers who want bigger common areas, a bar, lockers, and easy Tube access to both the City and Shoreditch.", photo.hostel, "$"),
  astorMuseum: stop("hostel-astor-museum", "Astor Museum Hostel", [51.5195, -0.1269], "Astor Museum Hostel is the culture-first budget base beside the British Museum, giving dorm travelers Bloomsbury calm, Soho and Covent Garden walks, and a more central landing than many party hostels.", photo.hostel, "$"),
  onefamNotting: stop("hostel-onefam-notting", "Onefam Notting Hill", [51.5154, -0.1936], "Onefam Notting Hill is the social west London hostel for travelers who want organized group energy at night but a calmer Portobello, Hyde Park, and Notting Hill Gate setting by day.", photo.hostel, "$"),
  stChristopherBorough: stop("hostel-st-christopher-borough", "St Christopher's Inn London Bridge", [51.5043, -0.0911], "St Christopher's Inn London Bridge works for backpackers who want Borough Market, river walks, London Bridge transport, and pub energy downstairs rather than a quiet, tucked-away dorm.", photo.hostel, "$"),

  frenchHouse: stop("soho-bar-french-house", "The French House", [51.5127, -0.1326], "The French House is a Soho institution for half-pints, artists, writers, theatre people, and old central-London conversation. Go for the bar's history and upstairs dining, not because the name means French fine dining.", photo.pub, "$$"),
  bradleys: stop("soho-bar-bradleys", "Bradley's Spanish Bar", [51.515, -0.1328], "Bradley's Spanish Bar keeps Soho satisfyingly rough-edged: cava, beer, jukebox energy, narrow rooms, and a loyal late crowd. It is best when a polished cocktail bar would kill the mood.", photo.pub, "$"),
  ship: stop("soho-bar-ship", "The Ship", [51.5139, -0.1362], "The Ship is a compact Wardour Street pub for a proper pint, old Soho feel, and an easy pre- or post-dinner reset. Go when the night needs a real pub rather than another bar concept.", photo.pub, "$"),
  swift: stop("soho-bar-swift", "Swift Soho", [51.5136, -0.1327], "Swift Soho splits the night well: fast, bright aperitif drinks upstairs and a darker basement for more deliberate cocktails, strong technique, and a room polished enough for dates without feeling stiff.", photo.pub, "$$$"),
  ronnieScotts: stop("soho-bar-ronnies", "Ronnie Scott's", [51.5135, -0.1319], "Ronnie Scott's is the Soho jazz institution that turns nightlife into a booked event: world-class players, late shows, supper-club atmosphere, and a reason to build the whole evening around music.", photo.theatre, "$$$"),

  lambFlag: stop("covent-bar-lamb-flag", "The Lamb & Flag", [51.5114, -0.1259], "The Lamb & Flag is a traditional Georgian Covent Garden pub with Charles Dickens lore, narrow lanes, cask ale, pub food, and enough theatreland bustle to work before a show without feeling invented for tourists.", photo.pub, "$$"),
  porterhouse: stop("covent-bar-porterhouse", "The Porterhouse", [51.5105, -0.1231], "The Porterhouse is the large multi-level Covent Garden beer hall for groups, house-brewed beers, Irish pub energy, screens, and capacity when smaller historic pubs are too packed to be useful.", photo.pub, "$$"),
  americanBar: stop("covent-bar-american", "American Bar at The Savoy", [51.5104, -0.1202], "The American Bar at The Savoy is a heritage cocktail splurge for piano, white-jacket service, classic drinks, and London hotel-bar ceremony. Book it when the drink is meant to be part of the story.", photo.pub, "$$$"),
  mrFoggs: stop("covent-bar-foggs", "Mr Fogg's Tavern", [51.5109, -0.1247], "Mr Fogg's Tavern is a playful Covent Garden pub for groups who want theatrical decor, gin, pub food, and an easy pre-show drink. It is not subtle, but it solves the fun-near-the-piazza problem.", photo.pub, "$$"),
  eveBar: stop("covent-bar-eve", "Eve Bar", [51.5115, -0.1238], "Eve Bar is the basement cocktail escape under Frog by Adam Handling, useful when Covent Garden needs sharper drinks, low light, and more edge than the piazza's obvious pub-and-chain circuit.", photo.pub, "$$$"),

  bookClub: stop("shoreditch-bar-book-club", "The Book Club", [51.5262, -0.0804], "The Book Club is a casual Shoreditch all-rounder for brunch, drinks, ping-pong, DJs, workshops, and group starts. Use it when the night needs flexibility more than cocktail precision.", photo.pub, "$$"),
  happinessForgets: stop("shoreditch-bar-happiness", "Happiness Forgets", [51.5298, -0.0836], "Happiness Forgets is the Hoxton basement cocktail benchmark: low light, serious classics, no big performance, and a calmer counterpoint before or after the louder Shoreditch rooms.", photo.pub, "$$$"),
  oldBlueLast: stop("shoreditch-bar-old-blue-last", "The Old Blue Last", [51.5246, -0.0807], "The Old Blue Last keeps Shoreditch connected to live music, beer, club nights, and rougher pub energy. Go when the route needs volume, bands, and history rather than a designed cocktail lounge.", photo.pub, "$"),
  queenAdelaide: stop("shoreditch-bar-queen-adelaide", "The Queen Adelaide", [51.5248, -0.0755], "The Queen Adelaide is a grounded east London pub near Hackney Road for pints, queer-friendly energy, DJs, and a less polished pause between Shoreditch restaurants, clubs, and Brick Lane.", photo.pub, "$"),
  villageUnderground: stop("shoreditch-bar-village-underground", "Village Underground", [51.5233, -0.0782], "Village Underground is Shoreditch's railway-arch gig and club destination, known for concerts, electronic nights, and the tube-car rooftop landmark. Treat it as the plan, not a casual drink stop.", photo.theatre, "$$"),

  churchillArms: stop("notting-bar-churchill", "The Churchill Arms", [51.5069, -0.1948], "The Churchill Arms is the flower-covered Kensington pub that earns its fame with Thai food, Churchill memorabilia, cask ale, and instant recognizability. It works for both a pint and a spice-route detour.", photo.pub, "$$"),
  trailerHappiness: stop("notting-bar-trailer", "Trailer Happiness", [51.5162, -0.2049], "Trailer Happiness gives Portobello a basement rum-bar identity: tiki drinks, low ceilings, loud personality, and a late-night Notting Hill option that keeps the area from feeling too polished.", photo.pub, "$$"),
  theCow: stop("notting-bar-cow", "The Cow", [51.5206, -0.2001], "The Cow is one of Notting Hill's defining gastropubs, famous for Guinness, oysters, seafood platters, fish stew, bangers and mash, and an upstairs dining room that makes a pint feel like dinner.", photo.pub, "$$"),
  sunInSplendour: stop("notting-bar-sun", "Sun in Splendour", [51.5098, -0.1971], "Sun in Splendour is the practical Notting Hill Gate pub for meeting up, Sunday roasts, cask ale, and starting or ending a Portobello walk without pushing the day into a reservation.", photo.pub, "$"),
  walmerCastle: stop("notting-bar-walmer", "The Walmer Castle", [51.5116, -0.2078], "The Walmer Castle is the polished Ledbury Road pub for a more grown-up west London night: dining room, cocktails, pints, and enough comfort to work after Portobello or before a Notting Hill dinner.", photo.pub, "$$"),

  anchorBankside: stop("southbank-bar-anchor", "The Anchor Bankside", [51.5074, -0.0927], "The Anchor Bankside is a Thameside pub with roots back to 1615, serving real ale and pub food between Borough Market and Tate Modern. Go for history, riverside views, and an easy South Bank meal.", photo.pub, "$$"),
  foundersArms: stop("southbank-bar-founders", "Founder's Arms", [51.5083, -0.1048], "Founder's Arms is the straightforward river pub for outdoor tables, Thames views, pints, and unfussy food between Blackfriars and Tate Modern. It is strongest when the view matters as much as the menu.", photo.pub, "$$"),
  twelveKnot: stop("southbank-bar-twelve-knot", "12th Knot", [51.5081, -0.1069], "12th Knot is the Sea Containers rooftop bar for skyline cocktails, DJ nights, and sunset views over the Thames. It works when the South Bank route needs height and polish after museums or markets.", photo.pub, "$$$"),
  underStudy: stop("southbank-bar-understudy", "The Understudy", [51.5071, -0.1141], "The Understudy is the National Theatre's relaxed bar for craft beer, casual drinks, river terraces, and a performance-adjacent pause that does not require a ticket or a dress code.", photo.pub, "$$"),
  omeara: stop("southbank-bar-omeara", "OMEARA", [51.5055, -0.0961], "OMEARA gives the Borough side a proper live-music and club room under the railway arches, useful when market drinks need to become a gig, DJ night, or late South Bank plan.", photo.theatre, "$$"),
  redLion: stop("westminster-bar-red-lion", "The Red Lion", [51.5019, -0.1262], "The Red Lion is a classic Westminster pub for cask ale, pies, political-drama atmosphere, and a proper central London lunch between Parliament, St James's, Whitehall, and theatre plans.", photo.pub, "$$"),
  masonsArms: stop("mayfair-bar-masons-arms", "The Mason's Arms", [51.5119, -0.1465], "The Mason's Arms gives Mayfair a grounded pub-food option for roasts, pies, pints, and a less performative meal near Bond Street and Grosvenor Square, where casual choices can feel thin.", photo.pub, "$$"),
  sherlockHolmesPub: stop("westminster-bar-sherlock-holmes", "The Sherlock Holmes Pub", [51.5073, -0.1245], "The Sherlock Holmes Pub is a central old-school pub with British comfort food, cask ale, Sherlock memorabilia, and a tourist-friendly dining room that still fits the pub-meal brief near Charing Cross.", photo.pub, "$$"),
  loreOfTheLand: stop("fitzrovia-bar-lore-of-the-land", "The Lore of the Land", [51.5223, -0.1415], "The Lore of the Land is a polished Fitzrovia pub for seasonal British cooking, roasts, thoughtful beer, and a dining room with enough intent to make 'pub dinner' feel like a real reservation.", photo.pub, "$$$"),

  hydePark: stop("nature-hyde-park", "Hyde Park", [51.5073, -0.1657], "Hyde Park is the central green reset for the Serpentine, Speakers' Corner, memorials, rowing, lawns, and a natural link to Kensington Gardens, Mayfair, Knightsbridge, and museum days.", photo.park),
  regentsPark: stop("nature-regents-park", "Regent's Park", [51.5313, -0.1569], "Regent's Park brings formal gardens, rose beds, open fields, London Zoo, boating, and Primrose Hill access into one slow-day route, making it one of the city's most useful parks for first-time visitors.", photo.park),
  hampsteadHeath: stop("nature-hampstead-heath", "Hampstead Heath", [51.5608, -0.1657], "Hampstead Heath is the wilder London park day for swimming ponds, woods, meadows, Kenwood House, muddy paths, and Parliament Hill views that make the city feel suddenly spacious.", photo.park),
  richmondPark: stop("nature-richmond-park", "Richmond Park", [51.4479, -0.2743], "Richmond Park is the big western escape for deer, cycling, long walks, ancient trees, Isabella Plantation, and a half-day plan that makes London feel more like countryside than capital.", photo.park),
  greenwichPark: stop("nature-greenwich-park", "Greenwich Park", [51.4769, -0.0005], "Greenwich Park combines hilltop skyline views, the Royal Observatory, maritime history, flower gardens, deer-park traces, and a village-river route that makes it more than a simple green pause.", photo.park),
  regentsCanal: stop("nature-regents-canal", "Regent's Canal", [51.5396, -0.1454], "Regent's Canal is the linear walk for seeing London change by water: Little Venice, Regent's Park, Camden Lock, King's Cross, Islington, Broadway Market, and east London without staying underground.", photo.park),
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

const guideDescriptions: Record<string, string> = {
  "soho-restaurants": [
    "Soho does not reward timid eating. Start with the wine-room hush of Noble Rot, take the counter heat at Kiln or Barrafina Dean Street, then let Mildreds and BAO Soho keep the route loose enough for theatre, records, or one more drink.",
    "This is central London food at street level: quick decisions, close tables, good bottles, and rooms that know how to feed people before the night changes shape.",
  ].join(" "),
  "covent-garden-restaurants": [
    "Covent Garden can feel polished to a shine, but the right table gives it some bite. Rules brings the old dining-room theatre, Clos Maggiore gives you the French special-occasion booking, while The Barbary, Dishoom, and Brasserie Zedel keep the neighborhood useful before or after the West End.",
    "Use this when dinner needs to work with the West End instead of fighting it.",
  ].join(" "),
  "shoreditch-restaurants": [
    "This is not a single cuisine guide anymore; it is an East End day-to-night route. E. Pellicci handles the full-English morning, St. John Bread and Wine and Manteca cover British and pasta-led meals, while BRAT and Smoking Goat bring the fire, Basque influence, and Bangkok heat for bigger dinners.",
    "Use it when Shoreditch needs breakfast, lunch, and dinner logic instead of one vague spicy label.",
  ].join(" "),
  "notting-hill-restaurants": [
    "Notting Hill is slower than central London, and the meals should respect that. Core and The Ledbury are the big reservations, Gold gives Portobello a lively middle gear, Farm Girl handles the softer morning, and Falafel King is there when the market has done its work and you just need something good in your hand.",
    "This guide is for a west London day that knows when to linger.",
  ].join(" "),
  "south-bank-restaurants": [
    "The South Bank is at its best when eating stays close to the river. Borough Market gives you the crowd and the appetite, Padella turns a queue into a reward, Wright Brothers handles oysters, BRAT x Climpson's Arch adds fire, and Flat Iron Square keeps groups from overplanning themselves into misery.",
    "Use it for a day that moves by foot, hunger, and the Thames.",
  ].join(" "),

  "soho-culture": [
    "Soho is never just one thing, which is the point. The British Museum sits just north with empire-scale weight, The Photographers' Gallery brings the eye back to the present, Soho Theatre keeps the room unpredictable, and Carnaby Street and Liberty carry the ghosts of fashion, music, and retail ceremony.",
    "This is a compact route for reading the neighborhood between meals and late rooms.",
  ].join(" "),
  "covent-garden-culture": [
    "Covent Garden is built on performance, but the stage is not only inside the theatre. The Royal Opera House and Theatre Royal Drury Lane give it ceremony, the National Gallery pulls the route toward Trafalgar Square, while the London Transport Museum and Somerset House add machinery, design, and Strand-side discipline.",
    "It is a culture day that still leaves room for dinner.",
  ].join(" "),
  "shoreditch-culture": [
    "Shoreditch is where London lets the edges show. The Barbican supplies concrete ambition, Whitechapel Gallery gives the art some teeth, Old Spitalfields Market and Brick Lane keep commerce and migration in the frame, and Museum of the Home slows everything down just enough to notice domestic history.",
    "This is east London beyond the shorthand.",
  ].join(" "),
  "notting-hill-culture": [
    "Notting Hill's culture lives in shopfronts, screens, basements, and market weather. Portobello Road is the spine, Electric Cinema turns a film into a room worth remembering, Museum of Brands catches the strange poetry of packaging, while The Tabernacle and Graffik Gallery keep the neighborhood connected to carnival, community, and paint.",
    "Go slowly; the good parts are in the browse.",
  ].join(" "),
  "south-bank-culture": [
    "The South Bank is London's easiest argument for walking. Tate Modern, Shakespeare's Globe, the Southbank Centre, the National Theatre, and BFI Southbank line up like a civic dare: art, theatre, film, river air, repeat.",
    "It can be high culture without being precious, especially when you let the bridges and bookstalls do some of the work.",
  ].join(" "),

  "soho-stays": [
    "Staying in Soho means accepting that the city will not politely go to bed. The Z Hotel and The Resident keep things practical, Hazlitt's gives you townhouse atmosphere, Ham Yard brings design polish, and Broadwick Soho adds a bit of velvet mischief near the bars and theatres.",
    "Choose this guide when the point is to step outside and already be in the night.",
  ].join(" "),
  "covent-garden-stays": [
    "Covent Garden is for travelers who want their London measured in short walks: theatre, museums, dinner, bed. NoMad and The Savoy bring the occasion, Henrietta and One Aldwych add boutique polish, and The Fielding keeps the theatre-district base more grounded.",
    "It is not the quietest choice, but it is brutally useful.",
  ].join(" "),
  "shoreditch-stays": [
    "A Shoreditch hotel should feel like more than a place to drop luggage. Boundary and The Hoxton understand the neighborhood's social rhythm, Mondrian and citizenM keep the base contemporary, and Batty Langley's gives Spitalfields a moodier, older counterpoint.",
    "Stay here when east London is part of the trip, not an afterthought.",
  ].join(" "),
  "notting-hill-stays": [
    "Notting Hill is the softer landing: pastel streets, Portobello mornings, and a little distance from central London's elbows. The Laslett and The Portobello Hotel carry the townhouse romance, Ruby Zoe keeps it modern, while Ravna Gora and Kensington Court make the west side more reachable.",
    "This is where you sleep when you want London to start gently.",
  ].join(" "),
  "south-bank-stays": [
    "South Bank hotels work because the river solves half the itinerary. Sea Containers gives the view, The Hoxton Southwark and citizenM Bankside keep Tate and Borough close, London Bridge Hotel is all station logic, and Park Plaza Westminster Bridge handles scale without losing the landmarks.",
    "Pick this base when walking matters as much as the room.",
  ].join(" "),

  "soho-hostels": [
    "A budget bed near Soho is about staying close to the action without spending the whole trip on trains. Astor Museum and Generator put Bloomsbury and the West End within reach, while The Z Hotel and The Resident are compact upgrades when privacy matters more than the dorm-room story.",
    "It is central, imperfect, and extremely useful.",
  ].join(" "),
  "covent-garden-hostels": [
    "For Covent Garden on a budget, the trick is to stay close enough that the last show, pint, or night bus does not become a second itinerary. Astor Museum and Generator cover the hostel end, while The Fielding and The Z Hotel offer small-room practicality near the West End.",
    "This is about location doing the heavy lifting.",
  ].join(" "),
  "shoreditch-hostels": [
    "Shoreditch budget stays should make it easy to say yes to one more bar, market, or late train home. Wombat's and Generator bring the social base, citizenM keeps things efficient, and Batty Langley's gives the area a characterful splurge when the dorm years are behind you.",
    "Use this when east London is the version of the city you came for.",
  ].join(" "),
  "notting-hill-hostels": [
    "Notting Hill is a gentler budget play: Portobello by day, parks nearby, and enough distance from the loudest parts of town to actually sleep. Onefam Notting Hill handles the social hostel lane, while Ravna Gora, Ruby Zoe, and Kensington Court give the route a mix of value and private-room calm.",
    "It is west London without pretending money is no object.",
  ].join(" "),
  "south-bank-hostels": [
    "A South Bank budget base lets the river do the navigation. St Christopher's at the Village keeps Borough Market close, Wombat's gives you an eastward option, and citizenM Bankside or London Bridge Hotel make sense when a small room beats another dorm but the plan still revolves around Tate, trains, and the Thames.",
    "It is practical first, which in London is its own kind of luxury.",
  ].join(" "),

  "soho-dive-bars": [
    "Soho's best low-key drinking is not about novelty; it is about rooms that have already seen everything. The French House and Bradley's still feel like old central London, The Ship keeps the pub energy direct, Swift gives the night a cocktail gear, and Ronnie Scott's turns the crawl toward jazz when standing around is no longer enough.",
    "This is for half-pints, narrow staircases, and nights that refuse to become tidy.",
  ].join(" "),
  "soho-popular-bars": [
    "When Soho wants a proper night out, start with Swift for polished cocktails, let Ronnie Scott's put music in the room, then keep The French House, Noble Rot, and Bradley's nearby for the kind of drinking that feels less planned and more earned.",
    "It is popular because the neighborhood still knows how to hold a crowd.",
  ].join(" "),
  "covent-garden-dive-bars": [
    "The trick in Covent Garden is escaping the obvious pint. Lamb & Flag and The Porterhouse keep the pub route sturdy, Mr Fogg's adds theatreland absurdity, Eve brings the basement cocktail turn, and the American Bar is there when the night wants polish instead of another round.",
    "Use this when you want the West End without surrendering to the piazza.",
  ].join(" "),
  "covent-garden-popular-bars": [
    "Covent Garden drinks can go grand, strange, or happily excessive. The American Bar supplies hotel legend, Eve handles the low-lit cocktail hour, The Porterhouse works for groups, Mr Fogg's leans into the costume, and Lamb & Flag keeps the whole thing from floating away.",
    "It is a pre- or post-theatre night with several escape routes.",
  ].join(" "),
  "shoreditch-dive-bars": [
    "Shoreditch does not need much encouragement after dark. The Old Blue Last and Queen Adelaide keep the pub bones intact, The Book Club gives groups somewhere to sprawl, Happiness Forgets goes underground for better cocktails, and Village Underground turns the route into a gig when the night asks for volume.",
    "Loose, loud, and better when you do not over-schedule it.",
  ].join(" "),
  "shoreditch-popular-bars": [
    "For a bigger Shoreditch night, let Happiness Forgets set the cocktail standard, Village Underground supply the event energy, and The Book Club, Old Blue Last, and Queen Adelaide carry the messy middle. It is not a single strip so much as a set of rooms that reward wandering.",
    "This guide gives the night a spine without taking away its bad ideas.",
  ].join(" "),
  "notting-hill-dive-bars": [
    "Notting Hill drinks best when the polish cracks a little. The Churchill Arms is all flowers and pints, The Cow brings seafood and old-school confidence, Sun in Splendour keeps Portobello casual, Trailer Happiness goes basement rum, and The Walmer Castle rounds it out with west London pub warmth.",
    "This is neighborhood drinking with better scenery than it admits.",
  ].join(" "),
  "notting-hill-popular-bars": [
    "A Notting Hill night is softer than Soho but not sleepy. Trailer Happiness gives it rum and neon, The Walmer Castle and The Cow bring the polished pub current, while The Churchill Arms and Sun in Splendour keep the route tied to Portobello rather than some generic cocktail map.",
    "Go for character, not velocity.",
  ].join(" "),
  "south-bank-dive-bars": [
    "South Bank drinking is best when it keeps moving with the river. The Anchor and Founders Arms give you the Thames in the glass, The Understudy catches the theatre crowd, Flat Iron Square handles groups, and OMEARA is the late-room option when Borough refuses to call it.",
    "It is a pub crawl disguised as a walk.",
  ].join(" "),
  "south-bank-popular-bars": [
    "For a South Bank night with more lift, start high at 12th Knot, drop to The Anchor or Founders Arms for the river, then let The Understudy and OMEARA pull the route toward theatre bars and live music. The area works because nothing feels too far if you keep the water beside you.",
    "Good for dates, groups, and nights that want views before volume.",
  ].join(" "),

  "top-parks": [
    "London's parks are not pauses from the city; they are part of its operating system. Hyde Park and Regent's Park give the royal scale, Hampstead Heath gives the lungs and the view, Richmond Park adds deer and distance, Greenwich Park drops toward the river, and Regent's Canal turns the whole thing into a walkable thread.",
    "Use this when the city starts to feel too hard-edged and you need air without leaving London behind.",
  ].join(" "),
  "citywide-restaurants": [
    "This is the London eating list for people willing to cross town for the right room. Noble Rot and Rules hold central London history in different registers, BRAT and Manteca bring east-side fire and pasta, while Core, The Ledbury, and Sketch cover the reservations that can shape a whole day.",
    "It is not comprehensive; it is a set of meals worth planning a day around.",
  ].join(" "),
  "citywide-markets": [
    "London markets are where the city stops pretending to be orderly. Borough is the historic food heavyweight, Camden and Flat Iron Square feed casual groups, Spitalfields mixes designers and street-food kitchens, Portobello keeps the antiques hunt alive, and Brick Lane adds bagels, curry houses, and weekend crush.",
    "Come hungry, leave with something you did not mean to buy.",
  ].join(" "),
  "citywide-pub-dining": [
    "Some London meals are better when they start as a pint, whether that means breakfast at E. Pellicci, oysters at The Cow, a Thameside lunch at The Anchor, or a proper pub dinner at Lamb & Flag, The Red Lion, The Mason's Arms, The Sherlock Holmes Pub, and The Lore of the Land.",
    "This is pub culture as a meal plan, not just a list of places to drink.",
  ].join(" "),
  "citywide-fine-dining": [
    "London fine dining is not one mood. Core and The Ledbury bring west-side precision, Clos Maggiore does French romance, Sketch supplies the iconic room, Maru adds Japanese omakase focus, Noble Rot gives wine-soaked intelligence, BRAT keeps smoke in the room, and Rules keeps the old British ceremony alive.",
    "Book carefully, then let the city dress up a little.",
  ].join(" "),
  "citywide-south-asian": [
    "London's spice map is bigger than one cuisine, so this guide now makes that range explicit. Dishoom, Hoppers, and Gunpowder cover Indian, Sri Lankan, and modern South Asian routes, while Kiln, Smoking Goat, The Churchill Arms, Four Seasons Chinatown, and Maru pull in Thai, Chinese, and Japanese stops.",
    "It is a cross-city starting point for Asian food rather than a narrow Brick Lane shorthand.",
  ].join(" "),
  "citywide-popular-bars": [
    "For a London night with range, move from Swift's Soho cocktails to the American Bar's hotel polish, then east to Happiness Forgets, west to Trailer Happiness, or up to 12th Knot for a skyline finish. The city does not have one nightlife center; it has moods connected by trains.",
    "This guide is the good version of chasing them.",
  ].join(" "),
  "citywide-dive-bars": [
    "The best low-key London bars feel less designed than inherited. The French House and Bradley's keep Soho close and strange, Lamb & Flag does the theatreland pint, Old Blue Last adds east-side noise, and The Anchor puts the river in the background.",
    "It is a list for drinking somewhere with a little damage and a lot of memory.",
  ].join(" "),
  "citywide-culture": [
    "London culture works because the heavyweights are not all alike. The British Museum and National Gallery carry the old institutional gravity, Tate Modern and the Barbican push the city forward, while the Royal Opera House and Shakespeare's Globe remind you that London has always understood the value of a stage.",
    "Do not try to conquer it; build a day with rhythm.",
  ].join(" "),
  "citywide-hotels": [
    "Choosing a London hotel is really choosing your version of the city. Ham Yard puts you in Soho's current, NoMad works the theatre district, Boundary gives Shoreditch a roof and a lobby, The Laslett softens the west, and Sea Containers keeps the river at your window.",
    "The right base saves more time than any clever itinerary.",
  ].join(" "),
  "citywide-hostels": [
    "A good London hostel is not just cheap; it keeps the city usable after midnight and bearable in the morning. Generator and Wombat's bring social momentum, Astor Museum keeps the center close, Onefam Notting Hill softens the west-side landing, and St Christopher's Borough puts markets and trains within reach.",
    "Spend less on the bed, not on the city.",
  ].join(" "),
  "one-day-activities": [
    "One day in London has to be ruthless without feeling joyless. Start with the British Museum, eat your way through Borough Market, cross into Tate Modern, leave room for Shakespeare's Globe, and finish with a proper drink at Swift instead of collapsing into the nearest chain pub.",
    "It is not all of London; it is one strong line through it.",
  ].join(" "),
  "weekend-activities": [
    "A London weekend should have both polish and a little dirt under the nails. NoMad and the National Gallery set up the West End, Rules and Ronnie Scott's handle the old central night, then BRAT, Hampstead Heath, and 12th Knot push the second day from fire to open air to river views.",
    "Two nights is enough to feel the city change accents if you let it.",
  ].join(" "),
  "week-activities": [
    "A week in London should feel like several cities stitched together by buses, parks, and appetite. Generator, Hyde Park, the British Museum, Kiln, and the Royal Opera House cover the central opening; BRAT and Brick Lane turn it east; Portobello, Core, Tate Modern, Borough Market, and Hampstead Heath give the back half room to breathe.",
    "The goal is not to finish London. The goal is to leave with a few neighborhoods still calling you back.",
  ].join(" "),
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
    description: guideDescriptions[spec.id] ?? spec.description,
    url: `https://www.google.com/maps/search/${encodeURIComponent(spec.seoTitle.toLowerCase())}`,
    category: spec.category,
    ...(spec.itinerary ? { itinerary: spec.itinerary } : {}),
    ...(spec.submissionType ? { submissionType: spec.submissionType } : {}),
    location: spec.neighborhood
      ? { ...londonLocation, neighborhood: spec.neighborhood }
      : londonLocation,
    creator: {
      id: isItinerary ? "user-rguide-itineraries" : `user-rguide-${spec.category.toLowerCase()}`,
      name: isItinerary ? "R Journeys" : `R ${spec.category}`,
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
  foodGuide("covent-garden-restaurants", "covent-garden-restaurants", "Best Restaurants in Covent Garden, London", "Historic rooms, romantic bookings, counter cooking, and pre-theatre restaurants that keep Covent Garden from becoming only a show district.", "Covent Garden", ["rules", "closMaggiore", "barbary", "dishoomCovent", "zedel"], "Pre-Theatre Classics and Counters"),
  foodGuide("shoreditch-restaurants", "shoreditch-restaurants", "Best Restaurants in Shoreditch, London", "Breakfast cafes, British anchors, hand-rolled pasta, Basque wood fire, and Thai late-night heat for a clearer East London food day.", "Shoreditch", ["ePellicci", "stJohnBread", "manteca", "brat", "smokingGoat"], "East End Breakfast, Fire, and Dinner Tables"),
  foodGuide("notting-hill-restaurants", "notting-hill-restaurants", "Best Restaurants in Notting Hill, London", "Breakfast, Portobello grazing, wood-fired dinners, and west London reservations for a neighborhood that rewards slower pacing.", "Notting Hill", ["farmGirl", "portobello", "falafelKing", "gold", "theLedbury", "core"], "Portobello Breakfast to Big Bookings"),
  foodGuide("south-bank-restaurants", "south-bank-restaurants", "Best Restaurants near South Bank, London", "Borough Market grazing, housemade pasta, oysters, wood-fired dinners, and flexible group stops between Borough and the Thames.", "South Bank", ["boroughMarket", "padella", "wrightBrothers", "bratXclimpson", "flatIronSquare"], "Borough Market to Bankside Tables"),

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
  foodGuide("citywide-restaurants", "best-restaurants-citywide", "Best Restaurants in London", "Best restaurants in London, pulling destination meals from Soho, Covent Garden, Shoreditch, Notting Hill, Mayfair, and the South Bank.", undefined, ["nobleRot", "rules", "brat", "manteca", "core", "theLedbury", "sketch"], "Tables Worth Crossing the Tube For"),
  foodGuide("citywide-markets", "best-food-markets-citywide", "Best Food Markets in London", "Best food markets and grazing routes in London, from Borough and Camden to Spitalfields, Portobello, Bankside, and Brick Lane.", undefined, ["boroughMarket", "camdenMarket", "spitalfieldsMarket", "portobello", "flatIronSquare", "brickLane"], "Markets, Counters, and Grazing Streets"),
  foodGuide("citywide-pub-dining", "best-pub-food-citywide", "Best Pub Food in London", "Best pub lunches, pub dinners, oyster pints, roasts, pies, and old London cafe meals across the city.", undefined, ["ePellicci", "frenchHouse", "lambFlag", "theCow", "anchorBankside", "redLion", "masonsArms", "sherlockHolmesPub", "loreOfTheLand"], "Pub Breakfasts, Lunches, and Proper Dinners"),
  foodGuide("citywide-fine-dining", "best-fine-dining-citywide", "Best Fine Dining in London", "Best fine dining in London, collecting special-occasion bookings, tasting menus, grand rooms, omakase counters, and high-polish neighborhood anchors.", undefined, ["core", "theLedbury", "closMaggiore", "sketch", "maru", "nobleRot", "brat", "rules"], "Reservations to Build the Trip Around"),
  foodGuide("citywide-south-asian", "best-asian-spice-routes-citywide", "Best Asian Restaurants and Spice Routes in London", "Best Asian and spice-led restaurants in London, from Indian and Sri Lankan rooms to Thai, Chinese, and Japanese destination counters.", undefined, ["dishoomCovent", "hoppers", "gunpowder", "kiln", "smokingGoat", "churchillArms", "fourSeasonsChinatown", "maru"], "Spice Routes Across London"),
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
