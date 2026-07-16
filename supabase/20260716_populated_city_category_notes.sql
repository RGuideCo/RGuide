-- Replace generic left-pane category notes for every populated guide city.
--
-- Tokyo is intentionally excluded: its normalized notes are the editorial
-- reference for this pass. Existing chips and neighborhood-strength research
-- remain untouched. The stable note keys below make later copy revisions
-- update in place while older keys are retained as inactive history.

begin;

create temp table seed_populated_city_category_notes (
  destination_legacy_id text primary key,
  categories jsonb not null
) on commit drop;

insert into seed_populated_city_category_notes (destination_legacy_id, categories)
values
  (
    'city:netherlands:amsterdam',
    $notes${
      "Food": [
        {"label":"Morning","body":"Start with brown bread, cheese, pastries, or apple pie around De Pijp and the canal ring; serious brunch rooms draw their longest queues on weekends."},
        {"label":"Indonesian table","body":"Rijsttafel is one of Amsterdam's defining meals, built from the city's colonial relationship with Indonesia. Book a proper spread rather than treating it as a quick lunch."},
        {"label":"Market rhythm","body":"Albert Cuyp works for herring, stroopwafels, and casual grazing; Noord and the western canals are better for destination dinners that need their own part of the day."}
      ],
      "Nightlife": [
        {"label":"Districts","body":"Jordaan and the western canals suit brown cafes and wine bars; De Pijp runs younger and busier; Noord is for clubs, warehouse rooms, and nights built around the ferry."},
        {"label":"Late transport","body":"Trams thin out before the bars do. Check the night-bus or ferry route before crossing town, especially when the last stop is north of the IJ."},
        {"label":"Room type","body":"A brown cafe, a genever tasting room, a listening bar, and a dance club promise very different nights. Choose the room first, then plan the neighborhood."}
      ],
      "Culture": [
        {"label":"Museumplein","body":"The Rijksmuseum, Van Gogh Museum, and Stedelijk can fill more than a day; timed tickets protect the visit from becoming a queue-management exercise."},
        {"label":"Canal history","body":"The canal belt reads best through its houses, churches, archives, and migration stories, not only from a boat. Pair one major museum with a smaller historic interior."},
        {"label":"Across the IJ","body":"Noord adds film, music, architecture, and industrial reuse to a city often reduced to seventeenth-century scenery. The free ferry is part of the cultural route."}
      ],
      "Stay": [
        {"label":"Canal ring","body":"Central canal-house hotels give atmosphere and easy walking, but steep stairs, compact rooms, and street noise are common features of the historic buildings."},
        {"label":"De Pijp or Oost","body":"These districts trade postcard frontage for neighborhood restaurants, markets, and stronger value while keeping the center within a straightforward tram or metro ride."},
        {"label":"Noord","body":"Waterfront hotels and hostels can feel removed until the free ferry makes sense. Check which landing serves the property and how late that connection runs."}
      ],
      "Nature": [
        {"label":"City green","body":"Vondelpark is the central reset; Westerpark adds culture and food; Amsterdamse Bos is the choice when the city needs to feel genuinely spacious."},
        {"label":"Water","body":"Canals are scenery and transport. A ferry to Noord or a quieter canal loop gives more air than repeating the busiest bridges around Centraal."},
        {"label":"Weather","body":"Wind and rain change the value of an open boat or long cycle quickly. Keep a museum, cafe, or covered market close to the outdoor plan."}
      ],
      "Activities": [
        {"label":"Reserve","body":"Book the Anne Frank House and the major Museumplein museums before building the rest of the day; their timed entries are the least flexible pieces."},
        {"label":"By district","body":"Keep Jordaan with the western canals, Museumplein with De Pijp, and Noord with its ferry-side venues. Amsterdam is compact, but repeated cross-city loops still waste good hours."},
        {"label":"On the water","body":"Choose a canal cruise for architectural context, a public ferry for everyday city movement, or a bike only if riding in dense local traffic feels comfortable."}
      ],
      "Routes": [
        {"label":"Canal loops","body":"Walk one ring at a time and use bridges deliberately; the map looks compact, but constant zigzags across the canals add more distance than expected."},
        {"label":"Ferry logic","body":"Treat Noord as its own half-day or evening. Group the Eye, NDSM, waterfront food, and nightlife around the ferry landing that gets you home."},
        {"label":"Transit backup","body":"Trams are the useful shortcut when rain, luggage, or museum fatigue catches up. Keep the walking route, but know the parallel tram line."}
      ],
      "Essentials": [
        {"label":"Payments","body":"Contactless payment covers most transport and businesses, but some small venues may be card-only rather than cash-friendly. Check before ordering if payment matters."},
        {"label":"Cycling","body":"Bike lanes are working traffic, not extra sidewalk. Cross them with the same attention you would give a road and rent a bike only if dense urban riding is familiar."},
        {"label":"Booking","body":"Major museums, the Anne Frank House, and popular small restaurants reward advance booking; leave markets, parks, and brown cafes as the flexible parts of the day."}
      ]
    }$notes$::jsonb
  ),
  (
    'city:greece:athens',
    $notes${
      "Food": [
        {"label":"Morning","body":"Athens starts well with koulouri, pies, yogurt, and strong coffee; the central markets and neighborhood bakeries are more useful than a formal hotel breakfast."},
        {"label":"Taverna table","body":"Look for seasonal vegetables, grilled fish or meat, slow-cooked dishes, and plates meant for the table. Order in rounds instead of trying to predict the whole meal."},
        {"label":"Neighborhoods","body":"Monastiraki and Psyrri are convenient but busy; Pangrati, Petralona, Kypseli, and Exarchia give a broader view of contemporary Athenian cooking and everyday prices."}
      ],
      "Nightlife": [
        {"label":"Districts","body":"Psyrri and Monastiraki carry rooftop and visitor energy; Exarchia and Kypseli lean local and alternative; Gazi is the clearest late-club cluster."},
        {"label":"Timing","body":"Dinner runs late and bars fill later. A quiet room at 9:00 PM may be working exactly as intended rather than failing to find a crowd."},
        {"label":"Sound","body":"Cocktail bars, rebetiko rooms, open-air terraces, and dance clubs are separate Athens traditions. Check the music program before choosing a late stop."}
      ],
      "Culture": [
        {"label":"Acropolis","body":"Go at opening or late in the day, then use the Acropolis Museum to place the surviving monuments and sculpture in a clearer historical frame."},
        {"label":"Ancient city","body":"The Agora, Kerameikos, Roman Forum, and streets below the Acropolis explain civic Athens better together than as disconnected ruins."},
        {"label":"Modern Athens","body":"The National Archaeological Museum, Benaki collections, contemporary galleries, and neighborhoods shaped by migration keep the city from ending in the classical period."}
      ],
      "Stay": [
        {"label":"Historic core","body":"Plaka, Monastiraki, and Syntagma put the main monuments within walking distance, with higher prices and more visitor traffic around the busiest streets."},
        {"label":"Neighborhood base","body":"Koukaki and Pangrati balance local restaurants with central access; Exarchia and Kypseli offer stronger street life for travelers who do not need a postcard address."},
        {"label":"Summer sleep","body":"Air-conditioning, exterior noise, shade, and distance from the nearest metro matter more in an Athenian summer than a decorative rooftop photograph."}
      ],
      "Nature": [
        {"label":"Hills","body":"Lycabettus, Philopappos, and the Acropolis slopes offer different city views. Walk early or near sunset when heat and exposed stone are easier to manage."},
        {"label":"Coast","body":"The Athens Riviera needs its own half-day: tram or taxi time, swimming, and a waterfront meal make more sense than squeezing the coast between ruins."},
        {"label":"Heat","body":"From late spring through early autumn, shade and water determine the route. Put archaeological sites first and gardens, museums, or the coast later."}
      ],
      "Activities": [
        {"label":"First route","body":"Link the Acropolis, its museum, Plaka, and the Agora in one archaeological arc rather than climbing and descending the same streets repeatedly."},
        {"label":"Market city","body":"Varvakios Market and the surrounding food streets work best before lunch, when the counters are active and the visit can lead directly into a meal."},
        {"label":"One contrast","body":"Add a contemporary neighborhood, a hill at sunset, or the coast to the classical core. Athens makes more sense when ancient and present-day life share the itinerary."}
      ]
    }$notes$::jsonb
  ),
  (
    'city:thailand:bangkok',
    $notes${
      "Food": [
        {"label":"Street rhythm","body":"Morning markets, lunch stalls, mall food courts, and late Yaowarat counters each have their own hours. Follow when a dish is cooked, not an all-day checklist."},
        {"label":"Neighborhoods","body":"Yaowarat is strongest after dark; the old city handles historic shops and temple-route meals; Ari and Sathorn carry cafes and contemporary Thai rooms."},
        {"label":"Order widely","body":"Balance grilled dishes, curries, noodles, salads, fruit, and sweets. Bangkok rewards shared plates and repeat stops more than one oversized meal."}
      ],
      "Nightlife": [
        {"label":"Districts","body":"Sukhumvit offers the widest bar-to-club range; Silom and Sathorn sharpen the cocktail side; Chinatown turns dinner streets into a later drinking route."},
        {"label":"Rooftops","body":"Use a rooftop for the skyline, then move to a street-level bar, live-music room, or club where the night is built around more than the view."},
        {"label":"Getting home","body":"BTS and MRT service ends before many late rooms close. Keep the final stops close together and plan for a metered taxi or ride-hail afterward."}
      ],
      "Culture": [
        {"label":"Royal core","body":"The Grand Palace, Wat Pho, and Wat Arun form the main historic cluster. Start early, dress for temple rules, and cross the river by ferry."},
        {"label":"Living city","body":"Canal communities, Chinese shrines, markets, modern galleries, and historic houses show Bangkok beyond royal monuments. Give one district enough time to reveal its layers."},
        {"label":"Indoor pause","body":"Museums and traditional houses are not secondary stops in Bangkok heat. They provide context and a useful break between exposed temple grounds."}
      ],
      "Stay": [
        {"label":"Transit base","body":"Sukhumvit and Silom work best for BTS and MRT access, broad dining choice, and easy late returns; choose the station before comparing hotel lobbies."},
        {"label":"River base","body":"Riverside hotels trade rail convenience for ferries, views, and a slower sense of Bangkok. Confirm the nearest pier and the property's boat service."},
        {"label":"Old city","body":"Rattanakosin and Khao San put temples close but weaken cross-city transit. They suit short first visits or social stays more than nightly citywide exploring."}
      ],
      "Nature": [
        {"label":"Parks","body":"Lumphini and Benjakitti form the most useful central green escape, with a raised connection that turns two parks into a longer walk or cycle."},
        {"label":"River air","body":"Public ferries and canal boats give shade, movement, and a clearer view of how Bangkok grew around water. They are transport, not just sightseeing."},
        {"label":"Weather","body":"Heat, humidity, and sudden rain can reorder the day. Put exposed stops early and keep a mall, museum, or cafe close to the afternoon route."}
      ],
      "Activities": [
        {"label":"Cluster","body":"Keep the Grand Palace and Wat Pho together, cross to Wat Arun by ferry, and save Yaowarat for evening rather than forcing every landmark into one hot loop."},
        {"label":"Boat choice","body":"The Chao Phraya ferry is everyday transport; canal boats cut through traffic; private tours trade flexibility for interpretation. Choose the water route by purpose."},
        {"label":"Markets","body":"Check whether a market is a morning, weekend, or night operation before traveling across the city. Bangkok's best market hour is rarely arbitrary."}
      ]
    }$notes$::jsonb
  ),
  (
    'city:spain:barcelona',
    $notes${
      "Food": [
        {"label":"Meal clock","body":"Lunch is the value meal and dinner starts later than many visitors expect. Use vermouth, market snacks, or a bakery stop to bridge the afternoon."},
        {"label":"Neighborhoods","body":"The old city has historic counters and heavy visitor traffic; Eixample handles polished dining; Gracia, Poble-sec, and Sant Antoni are stronger for neighborhood taverns."},
        {"label":"Order","body":"Build a table from conservas, vegetables, seafood, rice, grilled dishes, and a few house specialties. Tapas works best as selection, not a keyword for every meal."}
      ],
      "Nightlife": [
        {"label":"Districts","body":"Born and the Gothic Quarter suit compact bar-hopping; Gracia and Sant Antoni are better for wine and conversation; Poblenou holds the largest dance floors."},
        {"label":"Timing","body":"Cocktail bars gather late and clubs later. Keep dinner near the first drinks, then make one deliberate move rather than crossing the city between every round."},
        {"label":"Last ride","body":"Night buses cover gaps after the metro changes frequency or closes. Check the return before committing to a beachfront or Poblenou club."}
      ],
      "Culture": [
        {"label":"Modernisme","body":"Sagrada Familia, the Eixample houses, Hospital de Sant Pau, and Palau de la Musica reveal different sides of Catalan Modernisme; reserve the major interiors."},
        {"label":"Old city","body":"Roman remains, the cathedral quarter, Jewish history, and medieval institutions sit close together. Walk slowly enough to separate the layers from the shopping streets."},
        {"label":"Museum hills","body":"Montjuic combines Catalan art, Miro, Olympic architecture, gardens, and city views. Treat it as a district-sized culture day rather than one museum stop."}
      ],
      "Stay": [
        {"label":"Eixample","body":"The grid gives the best all-purpose base: metro access, architecture, restaurants, and quieter sleep when the room faces away from a major avenue."},
        {"label":"Old city","body":"Gothic and Born addresses maximize atmosphere and walking but bring narrow rooms, late street noise, and more uneven taxi access."},
        {"label":"Neighborhood fit","body":"Gracia suits village-scale evenings; Poble-sec works for Montjuic and nightlife; Poblenou gives beach access with a longer trip to the historic core."}
      ],
      "Nature": [
        {"label":"Sea","body":"The city beaches are easy, social, and busiest near Barceloneta. Walk or cycle northeast for more space, or give a true beach day to the coast beyond the city."},
        {"label":"Hills","body":"Montjuic mixes gardens and museums; Collserola offers real trails; the Bunkers deliver a broad view with limited shade and heavy sunset demand."},
        {"label":"Season","body":"Summer sun makes exposed plazas and uphill routes harder than the map suggests. Use mornings for climbs and late afternoon for the waterfront."}
      ],
      "Activities": [
        {"label":"Book first","body":"Sagrada Familia, Park Guell, and the major Gaudi houses are timed-ticket anchors. Place flexible markets, beaches, and neighborhood walks around those entries."},
        {"label":"By district","body":"Pair Gothic with Born, Eixample with Sagrada Familia, and Montjuic with Poble-sec. Barcelona rewards adjacent neighborhoods more than repeated metro crossings."},
        {"label":"Street life","body":"Markets, plazas, vermouth hours, and evening promenades are part of the trip, not empty space between attractions. Leave one unscheduled block for them."}
      ],
      "Essentials": [
        {"label":"Airport","body":"The Aerobus is simple for Placa Catalunya; regional rail is useful for Sants and Passeig de Gracia; metro value depends on the final station and luggage."},
        {"label":"Tickets","body":"Timed monuments sell out before ordinary museums. Book the Gaudi interiors first, then keep city streets and markets flexible around the weather."},
        {"label":"Awareness","body":"Crowded transit and the old-city lanes demand ordinary pickpocket awareness. Keep phones and wallets controlled without letting caution flatten the experience."}
      ]
    }$notes$::jsonb
  ),
  (
    'city:germany:berlin',
    $notes${
      "Food": [
        {"label":"Everyday Berlin","body":"Currywurst, doner, Vietnamese kitchens, bakeries, and market counters are the working food map. They matter as much as the city's tasting-menu rooms."},
        {"label":"Neighborhoods","body":"Kreuzberg and Neukolln carry the broadest casual range; Charlottenburg protects old West Berlin institutions; Mitte concentrates polished rooms and visitor demand."},
        {"label":"Booking","body":"Reserve destination restaurants and small natural-wine rooms, but leave space for counters, lunch canteens, and bakeries that are strongest without ceremony."}
      ],
      "Nightlife": [
        {"label":"Sound first","body":"Berlin clubs are built around lineups and communities, not a generic late-night category. Choose the music, door policy, and event before choosing the district."},
        {"label":"Neighborhoods","body":"Kreuzberg and Neukolln hold bars and small rooms; Friedrichshain carries major clubs; Schoneberg remains essential to queer nightlife beyond one famous door."},
        {"label":"Transport","body":"Night buses and weekend all-night rail make long nights possible, but large distances remain real. Keep a backup venue in the same part of town."}
      ],
      "Culture": [
        {"label":"Museum Island","body":"The island is a major collection cluster, but closures and renovation phases change what is accessible. Check the individual museum rather than trusting the umbrella name."},
        {"label":"Twentieth century","body":"The Wall, Jewish history, Nazi institutions, divided-city infrastructure, and reunification need multiple sites. No single memorial can carry the whole story."},
        {"label":"Living culture","body":"Galleries, artist spaces, clubs, cinemas, and reused industrial buildings show how Berlin keeps making culture from unstable ground and cheap space that is no longer cheap."}
      ],
      "Stay": [
        {"label":"Mitte","body":"Mitte minimizes museum and landmark travel, with higher prices and a thinner neighborhood night once office and visitor traffic fades."},
        {"label":"East and south","body":"Kreuzberg, Neukolln, and Friedrichshain suit food and nightlife trips; choose a U-Bahn or S-Bahn connection that avoids several late transfers."},
        {"label":"West Berlin","body":"Charlottenburg and Schoneberg offer calmer streets, established hotels, and strong local history while keeping the center reachable by direct rail."}
      ],
      "Nature": [
        {"label":"Big parks","body":"Tiergarten is the central green corridor; Tempelhofer Feld is open-sky Berlin at full scale; Grunewald gives forest and lakes beyond the urban grid."},
        {"label":"Water","body":"The Spree, Landwehr Canal, and city lakes carry different moods. Canal banks suit an evening; Wannsee or Muggelsee deserves a proper half-day."},
        {"label":"Season","body":"Berlin's outdoor life changes sharply by season. Summer rewards lakes and long evenings; winter needs shorter walks anchored by museums, cafes, or saunas."}
      ],
      "Activities": [
        {"label":"Geography","body":"Group Museum Island and central history, the Wall's eastern remains, and the Kreuzberg-Neukolln corridor separately. Berlin punishes landmark lists that ignore distance."},
        {"label":"Book","body":"Reserve the Reichstag dome, major exhibitions, and ticketed performances. Parks, memorials, neighborhood walks, and most street history can remain flexible."},
        {"label":"After dark","body":"A club night, concert, opera, or repertory cinema belongs in the itinerary as a main event. Do not treat Berlin's cultural night as leftover time."}
      ]
    }$notes$::jsonb
  ),
  (
    'city:denmark:copenhagen',
    $notes${
      "Food": [
        {"label":"Morning","body":"Bakeries set the daily rhythm: cardamom buns, rye loaves, and laminated pastry are worth an early route before weekend queues form."},
        {"label":"Lunch","body":"Smorrebrod is a composed lunch rather than an open-sandwich novelty. Choose a specialist and order several seasonal pieces across the table."},
        {"label":"Dinner","body":"New Nordic tasting menus are only one register. Vesterbro, Norrebro, and Refshaleoen also carry neighborhood bistros, immigrant cooking, wine bars, and converted industrial rooms."}
      ],
      "Nightlife": [
        {"label":"Districts","body":"Vesterbro offers bars, music, and late rooms; Norrebro runs more neighborhood-led; the center carries historic beer halls and polished cocktails."},
        {"label":"Hours","body":"Copenhagen can start early and close earlier than a larger club city, except on event nights. Check the room's actual program before building a late crawl."},
        {"label":"Drinks","body":"Beer, natural wine, aquavit, and precise cocktails each have serious local followings. Pick one lane or let dinner determine the first stop."}
      ],
      "Culture": [
        {"label":"Royal core","body":"Rosenborg, Amalienborg, Christiansborg, and the historic center explain different parts of the monarchy and state; do not collapse them into one palace stop."},
        {"label":"Art route","body":"SMK and the Glyptotek anchor the center, while Louisiana requires a coastal train trip and rewards the time with art, architecture, and landscape together."},
        {"label":"Design city","body":"Furniture, urban swimming, cycling infrastructure, food halls, and adaptive reuse make design visible outside museums. Pay attention to how ordinary spaces work."}
      ],
      "Stay": [
        {"label":"Center","body":"Indre By gives first-time convenience and easy walking, with the city's highest room pressure and more visitor-facing streets."},
        {"label":"Vesterbro","body":"Vesterbro is the strongest all-round base for restaurants, bars, the central station, and quick airport access; street character changes block by block."},
        {"label":"Across the lakes","body":"Norrebro and Frederiksberg offer stronger neighborhood life and better value. A direct metro connection matters more than being a few blocks closer on paper."}
      ],
      "Nature": [
        {"label":"Harbor","body":"The harbor is Copenhagen's public front room: walking, swimming zones, bridges, and ferries connect Islands Brygge, Christianshavn, and the inner waterfront."},
        {"label":"Gardens","body":"The Botanical Garden, King's Garden, Frederiksberg Gardens, and the lakes make easy pauses; Dyrehaven is the larger landscape when half a day is available."},
        {"label":"Weather","body":"Wind changes cycling and waterfront plans quickly. Carry a sheltered indoor anchor and use the metro when the pleasant ride becomes a test of clothing."}
      ],
      "Activities": [
        {"label":"By bike","body":"Cycling is efficient when riders can follow local lane rules and signal confidently. Otherwise, metro, harbor bus, and walking cover the core without stress."},
        {"label":"Water","body":"A harbor cruise supplies architectural context; the harbor bus supplies transport; a swim is seasonal and must stay inside marked public zones."},
        {"label":"Day trip","body":"Louisiana, Roskilde, and the northern coast each deserve several hours. Choose one extension rather than reducing all three to station photographs."}
      ]
    }$notes$::jsonb
  ),
  (
    'city:uae:dubai',
    $notes${
      "Food": [
        {"label":"Old Dubai","body":"Deira, Bur Dubai, and Karama hold the broadest everyday range: Emirati, Iranian, Indian, Pakistani, Filipino, Levantine, and East African food shaped by migration and trade."},
        {"label":"Destination rooms","body":"Beach resorts and towers carry major chefs and serious dining rooms, but distance and valet time make each reservation its own part of the night."},
        {"label":"Timing","body":"Lunch value can be strong in polished restaurants; late dinners suit the city; Ramadan and summer hours can materially change when and how venues operate."}
      ],
      "Nightlife": [
        {"label":"Zones","body":"DIFC and Downtown concentrate polished bars; Marina and the Palm lean resort-led; warehouse and arts districts provide smaller event-driven rooms."},
        {"label":"Rules","body":"Alcohol is served in licensed venues, usually hotels, clubs, and designated restaurants. Dress codes and door policies are venue-specific and worth checking."},
        {"label":"Distance","body":"A skyline that looks adjacent can hide a long taxi ride. Keep dinner and drinks in one district unless the second venue genuinely justifies the transfer."}
      ],
      "Culture": [
        {"label":"Creek","body":"The Creek, Al Fahidi, textile and spice markets, and working abra crossings explain Dubai's trading history better than a heritage-themed photo stop alone."},
        {"label":"Contemporary","body":"Alserkal Avenue and the Jameel arts spaces carry the strongest contemporary program; exhibitions and events matter more than simply arriving at the complex."},
        {"label":"Architecture","body":"Mosques, wind towers, malls, metro stations, supertalls, and planned islands show several Dubais at once. Read the city through infrastructure as well as spectacle."}
      ],
      "Stay": [
        {"label":"Downtown","body":"Downtown works for first-time landmarks and polished dining but places the beach, old city, and Marina in separate taxi or metro journeys."},
        {"label":"Beach and Marina","body":"Jumeirah, the Palm, and Marina suit resort days and waterfront nights. Confirm beach access, because a sea view does not always mean a usable shore."},
        {"label":"Old Dubai","body":"Deira and Bur Dubai offer better value, street food, the Creek, and airport access, with a very different atmosphere from the resort corridor."}
      ],
      "Nature": [
        {"label":"Desert","body":"A desert trip is defined by operator quality, driving style, group size, and conservation practice. Sunset photographs alone do not explain the experience."},
        {"label":"Coast","body":"Public beaches, hotel beach clubs, and mangrove or wetland areas offer different access and rules. Check shade, facilities, and transport before setting out."},
        {"label":"Heat","body":"Summer changes the outdoor day completely. Put beaches, desert, or long walks near sunrise or evening and keep midday indoors."}
      ],
      "Activities": [
        {"label":"Book","body":"Reserve major observation decks, desert excursions, and high-demand restaurants; malls, Creek crossings, public beaches, and neighborhood food routes can stay flexible."},
        {"label":"Cluster","body":"Keep the Creek with old Dubai, Downtown with its skyline attractions, and Marina with the Palm or beach. Crossing all three in one day is mostly road time."},
        {"label":"Scale","body":"Dubai experiences are often sold as superlatives. Choose the ones that reveal trade, architecture, food, desert ecology, or public life rather than collecting height records."}
      ]
    }$notes$::jsonb
  ),
  (
    'city:ireland:ireland-dublin',
    $notes${
      "Food": [
        {"label":"Irish table","body":"Look beyond stew toward oysters, brown bread, farmhouse cheese, smoked fish, lamb, and produce-led modern cooking. The best rooms make origin part of the meal."},
        {"label":"Everyday stops","body":"Bakeries, delis, fish-and-chip counters, market lunches, and pub food carry more of daily Dublin than a chain of formal reservations."},
        {"label":"Booking","body":"Small dining rooms fill quickly from Thursday through Saturday. Reserve dinner, then leave lunch and pub stops loose enough to follow the neighborhood."}
      ],
      "Nightlife": [
        {"label":"Pub choice","body":"A traditional pub, a tourist singalong room, a sports bar, and a music session are not interchangeable. Check what actually happens in the room."},
        {"label":"Music","body":"Traditional sessions are live, often informal performances built around Irish tunes. Listen to the room, keep conversation down near the players, and order without interrupting."},
        {"label":"After hours","body":"Dublin nights start earlier than many club cities and late transport is limited by route and day. Keep the final stop near the hotel or a Nightlink line."}
      ],
      "Culture": [
        {"label":"Literary city","body":"Libraries, writers' museums, theatres, pubs, and streets all carry Dublin's literary history. Pair manuscripts and interpretation with a neighborhood where the work was lived."},
        {"label":"State history","body":"Dublin Castle, Kilmainham Gaol, the GPO, and national collections explain conquest, rebellion, independence, and civic identity from different positions."},
        {"label":"Living stages","body":"The Abbey, Gate, Project Arts Centre, music rooms, and contemporary museums keep culture active. Check the program rather than visiting every building only by day."}
      ],
      "Stay": [
        {"label":"South center","body":"St Stephen's Green and the south Georgian core give polished hotels, easy walking, and strong dining at the city's highest room prices."},
        {"label":"North and west","body":"Smithfield, the Liberties, and the north inner city can offer better value and sharper local character; compare the exact walk and late transport."},
        {"label":"Temple Bar","body":"The location is central, but street noise and visitor traffic are the trade. Stay there for immediate nightlife, not because the district represents all of Dublin."}
      ],
      "Nature": [
        {"label":"City green","body":"St Stephen's Green is a pause; Phoenix Park is a landscape. The latter needs time, distance awareness, and ideally a bike or a clear destination."},
        {"label":"Coast","body":"DART trains make Howth, Sandycove, Dun Laoghaire, and Bray practical coastal extensions. Choose one walk and check wind, rain, and daylight."},
        {"label":"Weather","body":"Dublin weather shifts without ceremony. Waterproof layers and a nearby pub, museum, or cafe make outdoor plans resilient rather than cancelled."}
      ],
      "Activities": [
        {"label":"Central route","body":"Trinity, the Georgian core, Dublin Castle, and the Liberties can form one strong walk when ticket times are placed in geographic order."},
        {"label":"Reserve","body":"Book Kilmainham Gaol, major distillery tours, popular theatre, and high-demand dinners. Parks, churches, markets, and most pubs can remain flexible."},
        {"label":"Leave town","body":"Use one DART trip for coastal air or one focused day trip beyond Dublin. Several distant excursions can erase the city you came to understand."}
      ]
    }$notes$::jsonb
  ),
  (
    'city:italy:florence',
    $notes${
      "Food": [
        {"label":"Counter lunch","body":"Lampredotto, schiacciata, ribollita, market counters, and simple trattorie carry Florence's everyday appetite. Lunch is where value and local rhythm meet."},
        {"label":"Tuscan table","body":"Order around season and ingredient: beans, vegetables, offal, game, bistecca, pecorino, and olive oil. Not every table needs to begin and end with steak."},
        {"label":"Across the river","body":"The historic center has essential institutions and heavy demand; Sant'Ambrogio and Oltrarno give more neighborhood choice once the main sights close."}
      ],
      "Nightlife": [
        {"label":"Early evening","body":"Enoteche and aperitivo bars are Florence's natural first act. Use them for Tuscan wine and small plates before deciding whether the night needs cocktails or live music."},
        {"label":"Districts","body":"Santa Croce carries student and late-bar energy; Santo Spirito is better for piazza life and neighborhood wine; central hotel bars skew polished."},
        {"label":"Scale","body":"Florence is not a major club city. A strong night is more often wine, a compact cocktail room, a concert, or conversation on a piazza edge."}
      ],
      "Culture": [
        {"label":"Book first","body":"Uffizi, Accademia, and the Duomo complex need timed planning. Their queues can otherwise consume the hours meant for the art."},
        {"label":"Churches","body":"Santa Croce, Santa Maria Novella, San Marco, and the Medici chapels hold painting, sculpture, architecture, and political history beyond the headline museums."},
        {"label":"Look up","body":"Florence is read through facades, courtyards, chapels, street tabernacles, workshops, and views across the Arno. Leave visual attention for the walk between tickets."}
      ],
      "Stay": [
        {"label":"Historic center","body":"Duomo and Signoria addresses maximize walking and minimize calm. Check lift access, street noise, and taxi reach in older palazzi."},
        {"label":"Oltrarno","body":"Santo Spirito and San Frediano suit travelers who want workshops, wine bars, and neighborhood evenings while keeping the river crossing easy."},
        {"label":"Station edge","body":"Santa Maria Novella is practical for trains and day trips. Choose the exact block carefully, because convenience and atmosphere vary quickly around the station."}
      ],
      "Nature": [
        {"label":"Gardens","body":"Boboli is monumental and exposed; Bardini is smaller with stronger city views; the rose and iris gardens are seasonal reasons to climb toward Piazzale Michelangelo."},
        {"label":"Arno","body":"The river is best as an evening route or a bridge-to-bridge walk. Move beyond Ponte Vecchio to see ordinary banks and quieter reflections."},
        {"label":"Hills","body":"Fiesole and the southern hills supply shade, villas, and perspective. Use a bus or taxi uphill, then walk where the route and heat make sense."}
      ],
      "Activities": [
        {"label":"Ticket spine","body":"Anchor the day with one major timed museum and one church or palace. Three headline interiors in succession flatten the differences between them."},
        {"label":"Market hours","body":"Visit Sant'Ambrogio or the working parts of San Lorenzo before lunch, when food stalls and neighborhood trade are still active."},
        {"label":"Viewpoint","body":"Piazzale Michelangelo is the famous panorama; San Miniato adds architecture and a quieter terrace; Bardini makes the climb part of a garden visit."}
      ]
    }$notes$::jsonb
  ),
  (
    'city:vietnam:vietnam-hanoi',
    $notes${
      "Food": [
        {"label":"Morning","body":"Pho, banh cuon, sticky rice, and strong coffee belong to the morning street rhythm. Go when the specialist is cooking rather than expecting every dish all day."},
        {"label":"Street table","body":"Bun cha, grilled meats, noodles, snails, and bia hoi work through narrow menus and quick turnover. A busy specialist is often more useful than a broad restaurant menu."},
        {"label":"Neighborhoods","body":"The Old Quarter concentrates famous counters and crowds; Truc Bach and Ba Dinh offer calmer local meals; Tay Ho carries cafes and contemporary Vietnamese dining."}
      ],
      "Nightlife": [
        {"label":"Districts","body":"The Old Quarter handles bia hoi, backpacker bars, and live rooms; Tay Ho suits cocktails, music, and a more international crowd; Truc Bach is quieter."},
        {"label":"Closing rules","body":"Enforcement and closing times can shift by street and venue. Treat the official hour as real and keep the last stop close to the hotel."},
        {"label":"Music","body":"Jazz clubs, Vietnamese live music, electronic events, beer corners, and cocktail bars are different nights. Check the program before crossing the city."}
      ],
      "Culture": [
        {"label":"Political core","body":"The Ho Chi Minh complex, national museums, and Ba Dinh sites frame modern state history; dress respectfully and check the limited opening windows."},
        {"label":"Old city","body":"The Old Quarter is a living commercial district of guild streets, temples, markets, and houses. Its history is easiest to read before traffic reaches full pressure."},
        {"label":"Performance","body":"Water puppetry, traditional music, contemporary art spaces, and French colonial architecture widen the story beyond monuments and war museums."}
      ],
      "Stay": [
        {"label":"Old Quarter","body":"The Old Quarter maximizes food, street life, and first-time convenience, with traffic, compact rooms, and late noise around the busiest lanes."},
        {"label":"French Quarter","body":"The French Quarter and Hoan Kiem's southern edge suit larger hotels, cultural institutions, and calmer streets while keeping the lake walkable."},
        {"label":"Tay Ho","body":"Tay Ho offers lake views, cafes, and longer stays, but daily sightseeing in the historic core requires repeated taxi or ride-hail trips."}
      ],
      "Nature": [
        {"label":"Lakes","body":"Hoan Kiem is the civic morning walk; West Lake is the larger cycling and sunset circuit. They solve different amounts of time and traffic."},
        {"label":"Weather","body":"Humidity, heavy rain, summer heat, and winter damp all change Hanoi outdoors. Build a temple, museum, cafe, or lunch stop into each walking section."},
        {"label":"Beyond Hanoi","body":"Ninh Binh, Ba Vi, and longer northern trips are not interchangeable day escapes. Choose landscape, travel time, and weather before choosing the photograph."}
      ],
      "Activities": [
        {"label":"Early city","body":"Use early morning for Hoan Kiem, markets, breakfast specialists, and the Old Quarter before heat and motorbike pressure dominate the streets."},
        {"label":"Book","body":"Reserve high-demand food tours, major performances, and any overnight excursion. Museums, temples, lakes, and casual counters can remain flexible around weather."},
        {"label":"Crossing streets","body":"Move predictably and watch the whole traffic flow rather than waiting for an empty road. Confidence here means consistency, not speed."}
      ]
    }$notes$::jsonb
  ),
  (
    'city:hong-kong:hong-kong',
    $notes${
      "Food": [
        {"label":"Morning","body":"Dim sum, congee, macaroni soup, pineapple buns, and milk tea give Hong Kong several distinct breakfasts. Pick one tradition instead of forcing them together."},
        {"label":"Districts","body":"Central and Wan Chai carry polished rooms; Sham Shui Po and Mong Kok excel at noodles and snacks; Kowloon City broadens the Cantonese and regional range."},
        {"label":"Specialists","body":"Roast goose, wonton noodles, clay-pot rice, seafood, and dai pai dong cooking reward focused kitchens. Follow the dish a place is known for."}
      ],
      "Nightlife": [
        {"label":"Districts","body":"Central and Sheung Wan lead cocktails; Wan Chai mixes pubs and live rooms; Tsim Sha Tsui gives harbor bars; Kowloon neighborhoods hold smaller local options."},
        {"label":"Vertical city","body":"The bar may be several floors above the sign. Confirm the building entrance, lift, and exact floor before assuming a venue has vanished."},
        {"label":"Late return","body":"MTR service ends before some bars and clubs. Keep the final room near a night bus, taxi rank, or the side of the harbor where you are sleeping."}
      ],
      "Culture": [
        {"label":"Harbor story","body":"Museums in West Kowloon, the Star Ferry, maritime history, and the skyline explain Hong Kong as a port shaped by trade, migration, and political change."},
        {"label":"Living heritage","body":"Temples, wet markets, tong lau buildings, public estates, and clan halls hold history inside working neighborhoods. Visit with attention rather than treating them as sets."},
        {"label":"Program","body":"M+, Tai Kwun, the arts center, film archives, and independent spaces change with their exhibitions. Check what is on before choosing only by architecture."}
      ],
      "Stay": [
        {"label":"Hong Kong Island","body":"Central, Sheung Wan, and Wan Chai suit business, nightlife, and fast transit; room sizes are often tight and harbor views command a steep premium."},
        {"label":"Kowloon","body":"Tsim Sha Tsui gives skyline access; Jordan and Yau Ma Tei add markets and stronger value; Mong Kok puts dense street life outside the door."},
        {"label":"Transit","body":"Choose a property by the nearest MTR entrance and harbor crossing, not by straight-line distance. Hills, footbridges, and station depth alter the real walk."}
      ],
      "Nature": [
        {"label":"Ridges","body":"The Peak is the famous view; Dragon's Back is an accessible ridge walk; Lion Rock is harder and more exposed. Match the trail to heat and fitness."},
        {"label":"Islands","body":"Lamma, Cheung Chau, and Lantau offer different village, beach, and hiking days. Ferry frequency and the return queue are part of the plan."},
        {"label":"Weather","body":"Humidity, typhoons, rain, and poor visibility can erase a viewpoint. Keep a museum or neighborhood route ready when the skyline disappears."}
      ],
      "Activities": [
        {"label":"Harbor crossing","body":"Ride the Star Ferry in daylight or at dusk, then continue into a district rather than treating the crossing as a self-contained attraction."},
        {"label":"Book","body":"Reserve headline restaurants, limited exhibitions, and popular day tours. Ferries, markets, temples, trams, and most hikes depend more on timing and weather."},
        {"label":"One side at a time","body":"Keep adjacent stops on Hong Kong Island or Kowloon together. Repeated harbor crossings and deep station transfers make a neat map much slower in practice."}
      ]
    }$notes$::jsonb
  ),
  (
    'city:turkey:istanbul',
    $notes${
      "Food": [
        {"label":"Morning","body":"A full Turkish breakfast is a shared event; simit, borek, soup, and tea are the quicker everyday versions. Choose the format before choosing the view."},
        {"label":"Neighborhoods","body":"Karakoy and Beyoglu carry contemporary rooms; Kadikoy excels at markets, meze, and casual eating; the old city is strongest when a historic specialist earns the stop."},
        {"label":"Table","body":"Meze, fish, kebabs, Black Sea cooking, offal, vegetable dishes, and palace recipes represent different traditions. Istanbul food is broader than one mixed grill."}
      ],
      "Nightlife": [
        {"label":"Districts","body":"Beyoglu carries live music and dense bar streets; Karakoy has polished cocktails; Kadikoy runs local, mixed, and late; Bosphorus rooms lean scenic and expensive."},
        {"label":"Crossings","body":"Ferries are the best early-evening transfer and stop before the deepest night. Check the last useful sailing before moving between Europe and Asia."},
        {"label":"Music","body":"Meyhane tables, jazz clubs, Turkish rock rooms, electronic nights, and rooftop bars need different pacing. Let the music or meal lead the choice."}
      ],
      "Culture": [
        {"label":"Imperial core","body":"Hagia Sophia, Topkapi, the Blue Mosque, the Hippodrome, and the cisterns are dense enough for more than one morning. Security and worship times affect the order."},
        {"label":"Across eras","body":"Byzantine churches, Ottoman mosques, synagogues, palaces, industrial museums, and Republican art spaces make the city legible beyond Sultanahmet."},
        {"label":"Neighborhood fabric","body":"Fener and Balat, Galata, Uskudar, and Kadikoy hold migration, commerce, worship, and everyday culture. Leave time for hills, ferries, and ordinary streets."}
      ],
      "Stay": [
        {"label":"Sultanahmet","body":"The old city puts major monuments near the hotel, with quieter nights, visitor-heavy dining, and more effort reaching the city's contemporary side."},
        {"label":"Beyoglu and Karakoy","body":"These districts balance ferries, restaurants, nightlife, and historic streets. Hills, tram noise, and weekend crowds vary sharply by block."},
        {"label":"Asian side","body":"Kadikoy suits repeat visitors, food-led trips, and local nights. Ferry time is a pleasure until an early old-city ticket makes it a commute."}
      ],
      "Nature": [
        {"label":"Bosphorus","body":"Public ferries are the city's most reliable scenic experience, linking neighborhoods while revealing palaces, villages, working ports, and the scale of the strait."},
        {"label":"Green space","body":"Gulhane is the central pause; Emirgan and Yildiz offer larger gardens; Belgrad Forest needs a dedicated trip beyond the historic core."},
        {"label":"Islands","body":"Buyukada and the Princes' Islands take roughly an hour to ninety minutes by ferry depending on departure and service. Give them most of a day."}
      ],
      "Activities": [
        {"label":"Ferry first","body":"Use ferries as route structure: old city to Kadikoy, Karakoy to Uskudar, or a longer Bosphorus ride. The crossing should connect places, not interrupt them."},
        {"label":"Book","body":"Reserve palace entries, limited museum slots, hammams, and destination dinners. Mosques, markets, neighborhood walks, and public ferries require timing more than tickets."},
        {"label":"Hills","body":"A short map distance can mean steep cobbles and stairs. Build downhill sections where possible and use funiculars, trams, or ferries to reset the route."}
      ]
    }$notes$::jsonb
  ),
  (
    'city:japan:kyoto',
    $notes${
      "Food": [
        {"label":"Season","body":"Kaiseki, temple cuisine, sweets, pickles, tofu, and market produce all follow Kyoto's seasons. Ask what is timely before chasing a fixed famous dish."},
        {"label":"Everyday meals","body":"Soba, udon, donburi, grilled fish sets, curry, bakeries, and neighborhood izakaya keep the city from becoming one formal tasting menu."},
        {"label":"Booking","body":"Small counters and kaiseki rooms have few seats and precise service times. Reserve early, arrive punctually, and disclose dietary restrictions before the day."}
      ],
      "Nightlife": [
        {"label":"Compact nights","body":"Kiyamachi, Pontocho, and Gion place sake bars, whisky counters, jazz, and izakaya close together; the best rooms are often tiny and quiet."},
        {"label":"Etiquette","body":"A small cover charge, limited seating, or a host-led pace is normal in intimate bars. Enter with a compact group and follow the room's tone."},
        {"label":"Last transport","body":"Kyoto winds down earlier than Osaka, and rail service does too. Keep late drinks near the hotel or plan for a taxi."}
      ],
      "Culture": [
        {"label":"Temple geography","body":"Higashiyama, Arashiyama, northern Kyoto, and Fushimi are separate clusters. Choose one or two areas rather than racing between famous gates."},
        {"label":"Beyond temples","body":"Imperial villas, craft workshops, gardens, modern museums, markets, and performing arts explain court, merchant, and contemporary Kyoto alongside religious sites."},
        {"label":"Respect","body":"Working temples, shrines, and residential lanes are not open-air sets. Observe photography rules, quiet hours, and any streets closed to casual visitors."}
      ],
      "Stay": [
        {"label":"Kyoto Station","body":"The station area is strongest for day trips, buses, luggage, and practical hotels; evenings feel more functional than atmospheric."},
        {"label":"Central Kyoto","body":"Downtown and the Kamo River balance restaurants, shopping, transit, and nightlife. They are the easiest first-time bases for a mixed itinerary."},
        {"label":"Historic east","body":"Gion and Higashiyama give early access to beautiful streets and temples, with higher prices, quieter late nights, and more visitor pressure by day."}
      ],
      "Nature": [
        {"label":"Gardens","body":"Dry gardens, stroll gardens, moss, borrowed scenery, and villa landscapes are distinct traditions. Choose a few and give them quiet time."},
        {"label":"Edges","body":"Arashiyama, the Philosopher's Path, Fushimi's wooded slopes, and northern temple grounds provide green routes without leaving Kyoto, but each draws peak-hour crowds."},
        {"label":"Season","body":"Blossom and autumn color drive room prices and congestion; summer brings heat and humidity. Dawn is often the most valuable reservation you do not need to make."}
      ],
      "Activities": [
        {"label":"Start early","body":"Use dawn for Fushimi Inari, Arashiyama, or the Higashiyama lanes, then move to ticketed interiors and quieter neighborhoods after crowds build."},
        {"label":"Reserve","body":"Imperial properties, tea experiences, workshops, kaiseki meals, and popular performances may require advance booking. Ordinary temple and market time should remain flexible."},
        {"label":"Transit","body":"Buses look direct but can be slow and crowded. Rail, subway, walking, and an occasional taxi often make a cleaner district route."}
      ]
    }$notes$::jsonb
  ),
  (
    'city:portugal:lisbon',
    $notes${
      "Food": [
        {"label":"Morning","body":"Pastelarias handle espresso, toast, pastries, and savory snacks quickly. A pastel de nata is a stop, not the full range of a Lisbon breakfast."},
        {"label":"Tasca table","body":"Grilled fish, pork, salt cod, rice dishes, soups, and daily specials make the tasca useful. Read what the kitchen is cooking rather than ordering by stereotype."},
        {"label":"Neighborhoods","body":"Baixa and Chiado carry landmarks and demand; Mouraria and Intendente broaden everyday cooking; Alcantara and Marvila hold newer rooms worth a deliberate trip."}
      ],
      "Nightlife": [
        {"label":"Districts","body":"Bairro Alto starts with dense small bars; Cais do Sodre carries the night later; Alfama and Mouraria are for fado rooms rather than a generic crawl."},
        {"label":"Fado","body":"Choose a listening room or a dinner performance knowingly. In serious rooms, the music asks for silence and the meal is not the only reason to book."},
        {"label":"Late return","body":"Hills and infrequent late transit make a short line on the map deceptive. Keep the final stop downhill or budget for a taxi or ride-hail."}
      ],
      "Culture": [
        {"label":"River history","body":"Belem's monastery, tower, maritime collections, and memorials explain empire and navigation; pair them with the people and costs absent from triumphal stone."},
        {"label":"Tiles and streets","body":"The Tile Museum gives the craft a timeline; Alfama, Mouraria, and palace interiors show how azulejos work in architecture and daily life."},
        {"label":"Collections","body":"The Gulbenkian, MAAT, fado museum, and contemporary spaces cover far more than the castle-and-tram image. Check exhibitions before choosing a museum day."}
      ],
      "Stay": [
        {"label":"Baixa and Chiado","body":"Central hotels simplify a first visit and price in that convenience. Street noise, steep side roads, and historic-building layouts vary by room."},
        {"label":"Avenida and Principe Real","body":"These areas suit higher-end stays, gardens, design shops, and polished restaurants while keeping the historic center within a manageable walk or metro ride."},
        {"label":"Neighborhood base","body":"Alfama gives atmosphere and stairs; Intendente offers stronger value and nightlife access; Alcantara and Marvila require more deliberate transport planning."}
      ],
      "Nature": [
        {"label":"River","body":"The Tagus is Lisbon's open horizon. Walk Belem, use the ferry, or take a miradouro route that returns to the water rather than collecting viewpoints alone."},
        {"label":"Hills","body":"Miradouros differ by light, direction, and surrounding neighborhood. Choose one for sunrise or sunset and let the walk reveal the city between elevations."},
        {"label":"Coast","body":"Cascais is the simplest rail-linked coast; Sintra is a hill-and-palace day with its own weather. Trying to combine both usually reduces each to transit."}
      ],
      "Activities": [
        {"label":"Tram sense","body":"Ride Tram 28 early or use another historic line; at peak hours it becomes a crowded transport experience rather than an effortless sightseeing loop."},
        {"label":"By hill","body":"Keep Alfama and Mouraria together, Baixa with Chiado, and Belem as its own riverside block. Build downhill walks and use funiculars for the reset."},
        {"label":"Reserve","body":"Book major fado rooms, headline restaurants, Sintra palaces, and limited museum entries. Ferries, miradouros, markets, and neighborhood walks can follow weather."}
      ]
    }$notes$::jsonb
  ),
  (
    'city:united-kingdom:london',
    $notes${
      "Food": [
        {"label":"Neighborhoods","body":"Soho and the West End maximize range; East London carries bakeries, fire cooking, and immigrant food; South London rewards dedicated trips to Brixton, Peckham, and Tooting."},
        {"label":"British table","body":"Pubs, pie shops, caffs, chippies, bakeries, Sunday roasts, afternoon tea, and produce-led restaurants represent different parts of British food culture. Make room for several."},
        {"label":"Booking","body":"Reserve destination dinners and Sunday lunch, but keep markets and famous counters for off-peak hours. London queues can turn a casual bite into the day's main commitment."}
      ],
      "Nightlife": [
        {"label":"Choose the sound","body":"Jazz, theatre bars, queer clubs, pub rooms, electronic nights, and live rock belong to different London circuits. Start with the event or music, then choose the area."},
        {"label":"Districts","body":"Soho handles cocktails and queer history; Dalston and Hackney carry clubs and live rooms; Camden leans music; South London holds major dance floors and local pubs."},
        {"label":"Last transport","body":"Night Tube and buses help, but service depends on line and day. Keep the late venue near a reliable route or accept the cost of crossing London by cab."}
      ],
      "Culture": [
        {"label":"Museum scale","body":"The British Museum, National Gallery, Tate, V&A, and major science collections can each take hours. Pair one large institution with a smaller house, street, or performance."},
        {"label":"Beyond the center","body":"Hackney, Brixton, Camden, Southwark, and the East End carry music, migration, markets, and working-class history that the palace-and-monument route cannot explain."},
        {"label":"Book the stage","body":"West End theatre, the National, opera, dance, comedy, and repertory cinema are central London culture. Check programs before treating performance buildings as daytime landmarks."}
      ],
      "Stay": [
        {"label":"Tube line","body":"Choose the hotel by the line and journeys you will repeat. A room outside Zone 1 can be more useful than a central address with several daily changes."},
        {"label":"West or east","body":"The West End suits theatre, museums, and first-time landmarks; Shoreditch and Hackney favor restaurants and nightlife; South Bank balances culture with river walks."},
        {"label":"Room reality","body":"London rooms can be compact at every price. Check air-conditioning, lift access, street noise, and the exact walk from the station before paying for the postcode."}
      ],
      "Nature": [
        {"label":"Big green","body":"Hyde Park is central, Regent's Park adds gardens, Hampstead Heath brings views and rougher ground, and Richmond Park is a landscape-sized trip."},
        {"label":"Water","body":"The Thames Path, Regent's Canal, and wetlands offer different London walks. Pick a continuous section rather than trying to follow every bend through the city."},
        {"label":"Weather","body":"Rain is often manageable; wind and short winter daylight are the greater route changers. Keep a museum, pub, or market near the outdoor plan."}
      ],
      "Activities": [
        {"label":"Cluster","body":"Keep Westminster and the West End together, South Bank with Bankside, and East London as its own day or night. London wastes time through casual cross-city zigzags."},
        {"label":"Reserve","body":"Book major shows, high-demand exhibitions, palace interiors, skyline viewpoints, and Sunday roasts. Free museums still benefit from checking entry arrangements and closures."},
        {"label":"Use the river","body":"A public river boat can connect Greenwich, Westminster, and the South Bank while revealing the city. It is transport with a view, not only a tour."}
      ]
    }$notes$::jsonb
  ),
  (
    'city:usa:los-angeles',
    $notes${
      "Food": [
        {"label":"Range","body":"Los Angeles eats through tacos, Korean barbecue, Armenian bakeries, Thai noodles, Japanese counters, Persian grills, produce-led California rooms, and communities spread across the basin."},
        {"label":"Geography","body":"Build meals around the district already in the day. A great taco across town is not a quick detour when traffic turns ten miles into an hour."},
        {"label":"Counters and bookings","body":"Reserve destination dining, but protect time for trucks, strip-mall specialists, bakeries, and lunch counters. Much of the city's best food does not perform formality."}
      ],
      "Nightlife": [
        {"label":"Sound first","body":"Choose the band, DJ, comedy bill, queer night, or cocktail room before choosing a neighborhood. Los Angeles nightlife is program-led and widely dispersed."},
        {"label":"Districts","body":"Hollywood carries major venues; Silver Lake and Echo Park mix bars and music; Downtown holds clubs and cocktail rooms; West Hollywood remains central to LGBTQ+ nightlife."},
        {"label":"Closing time","body":"Most bars finish by 2:00 AM, so long transfers are expensive in more than miles. Keep the final two stops in the same district and plan the ride home."}
      ],
      "Culture": [
        {"label":"Museum geography","body":"The Getty Center, Museum Row, Downtown institutions, Exposition Park, and Pasadena collections are separate clusters. Give each major museum the half-day its location demands."},
        {"label":"Film city","body":"Studio history, repertory cinemas, archives, architecture, and working production neighborhoods tell more about Hollywood than a walk past souvenir shops."},
        {"label":"Communities","body":"Murals, music, food, gardens, and neighborhood institutions across East LA, Leimert Park, Little Tokyo, Koreatown, and beyond are core cultural history, not side trips."}
      ],
      "Stay": [
        {"label":"Choose the trip","body":"Stay near the part of Los Angeles the trip repeats: Hollywood for central sights, Downtown for institutions and transit, the Westside for beaches, or Eastside neighborhoods for food and nightlife."},
        {"label":"Transit reality","body":"Rail can solve specific corridors, but many hotels still require rides or a car. Check actual travel times to the planned districts at the hours you will move."},
        {"label":"Parking","body":"If driving, parking price and overnight access are part of the room rate. If not driving, a beautiful hotel on an isolated block can become its own island."}
      ],
      "Nature": [
        {"label":"Coast","body":"Santa Monica, Venice, Malibu, and the South Bay provide different beach days. Choose by access, swimming, walking, or scenery rather than treating the coast as one stop."},
        {"label":"Trails","body":"Griffith Park offers city views and many routes; the Santa Monica Mountains feel wilder. Heat, fire conditions, water, and parking shape both."},
        {"label":"Light","body":"Marine layer can hide a morning coast while inland heat builds. Use the forecast by neighborhood and keep sunset flexible when the sky is doing the directing."}
      ],
      "Activities": [
        {"label":"One zone","body":"Build each day around one or two adjacent zones: Downtown and Arts District, Hollywood and Griffith, Museum Row and West Hollywood, or a dedicated beach corridor."},
        {"label":"Reserve","body":"Book studio tours, major performances, popular museums, destination dinners, and timed observatory or exhibition entries. Beaches and neighborhood routes can follow traffic and weather."},
        {"label":"Driving time","body":"Check the route at the hour you will travel, not at midnight while planning. Los Angeles distance is measured in traffic conditions as much as miles."}
      ]
    }$notes$::jsonb
  ),
  (
    'city:spain:madrid',
    $notes${
      "Food": [
        {"label":"Meal clock","body":"Lunch is the main meal and dinner starts late. Use coffee, tortilla, vermouth, pastries, or a market counter between them instead of fighting the local rhythm."},
        {"label":"Taverns","body":"Cocido, callos, grilled offal, seafood, jamon, stews, and simple tapas live in different institutions. Order the house specialty before adding a broad spread."},
        {"label":"Neighborhoods","body":"Centro carries historic rooms and crowds; Chamberi and Retiro suit polished neighborhood dining; Lavapies broadens the city's immigrant kitchens and casual range."}
      ],
      "Nightlife": [
        {"label":"Districts","body":"Malasana carries indie bars and late energy; Chueca anchors queer nightlife and cocktails; La Latina starts with taverns; Lavapies mixes music, bars, and cultural rooms."},
        {"label":"Timing","body":"Madrid starts late and keeps going. An empty cocktail bar at 9:00 PM may fill after midnight, while vermouth and tavern culture belong earlier."},
        {"label":"Night transport","body":"Metro hours do not cover every late finish. Keep the club or final bar near a night bus route, a taxi stand, or the bed."}
      ],
      "Culture": [
        {"label":"Art walk","body":"The Prado, Reina Sofia, and Thyssen form a powerful cluster with very different collections. One major museum plus a smaller stop is often the sharper day."},
        {"label":"Royal city","body":"The palace, Plaza Mayor, Habsburg streets, convents, and old taverns reveal court and civic Madrid beyond a single ceremonial interior."},
        {"label":"Living stages","body":"Theatre, flamenco, film, contemporary art, and neighborhood cultural centers keep Madrid's identity active. Check the program before choosing only daytime monuments."}
      ],
      "Stay": [
        {"label":"Centro","body":"Sol, Gran Via, and the Habsburg core minimize walking to first-time sights, with the city's highest concentration of street noise and visitor traffic."},
        {"label":"Neighborhood base","body":"Malasana and Chueca suit nightlife; Barrio de las Letras balances museums and taverns; Chamberi offers calmer streets and strong local dining."},
        {"label":"Metro logic","body":"Madrid's metro makes a slightly outer base practical when the line is direct. Check the last return if the trip is built around late dinners and clubs."}
      ],
      "Nature": [
        {"label":"Retiro","body":"Retiro is a full urban park of formal gardens, shaded paths, exhibition spaces, and lawns. Use it as a destination, not only the gap beside the Prado."},
        {"label":"West side","body":"Casa de Campo, Madrid Rio, and the palace gardens create a larger green and river corridor. Cable-car operations and summer heat affect the route."},
        {"label":"Heat","body":"Summer afternoons can flatten exposed plazas and park plans. Walk early, take a long lunch, and return to gardens or rooftops when the light softens."}
      ],
      "Activities": [
        {"label":"Central arc","body":"Link the palace and old Madrid, then use a separate day for the Art Walk and Retiro. Combining both creates museum fatigue and repeated crossings."},
        {"label":"Book","body":"Reserve major football matches, popular flamenco rooms, palace entries, high-demand restaurants, and temporary exhibitions. Parks, markets, and tavern routes can remain flexible."},
        {"label":"Sunday","body":"The Rastro changes La Latina on Sunday mornings. Go for the market early, then move into nearby streets for lunch before the district becomes a single crowd."}
      ]
    }$notes$::jsonb
  ),
  (
    'city:australia:melbourne',
    $notes${
      "Food": [
        {"label":"Morning","body":"Coffee, bakeries, and all-day breakfast are serious Melbourne institutions. Choose a neighborhood cafe rather than treating the first meal as fuel."},
        {"label":"Communities","body":"Vietnamese in Richmond and Footscray, Greek history, Italian Carlton, Chinese regional cooking, and newer migrant kitchens shape the city more than one central dining district."},
        {"label":"Dinner","body":"Destination tasting menus, wine bars, pubs, and small neighborhood restaurants all matter. Reserve the room that needs it and let markets or counters carry lunch."}
      ],
      "Nightlife": [
        {"label":"Districts","body":"The CBD hides bars in lanes and upper floors; Fitzroy and Collingwood carry pubs, music, and late rooms; Brunswick extends the live and alternative circuit north."},
        {"label":"Music","body":"Melbourne is a live-music city. Choose by the night's bill and venue scale, then use nearby pubs or cocktail bars around the show."},
        {"label":"Late transport","body":"Night Network service helps on weekends, not every night or route. Check the final tram or train before settling into a distant northern venue."}
      ],
      "Culture": [
        {"label":"First Peoples","body":"Begin with Aboriginal and Torres Strait Islander art, history, and living culture in the major collections, then notice whose Country the city occupies."},
        {"label":"Screen and stage","body":"Film, theatre, comedy, music, and sport are central cultural languages here. Programs at ACMI, the arts precinct, and independent venues change the value of a visit."},
        {"label":"Neighborhood city","body":"Lanes, markets, Victorian suburbs, migrant institutions, and industrial conversions explain Melbourne beyond federation-era landmarks and central galleries."}
      ],
      "Stay": [
        {"label":"CBD","body":"The center is best for first-time transit, major culture, and easy day trips. The exact block decides whether evenings feel lively, corporate, or deserted."},
        {"label":"Inner north","body":"Fitzroy, Collingwood, and Carlton suit restaurants, bars, and neighborhood days; tram access matters more than a short straight-line distance."},
        {"label":"South and bayside","body":"Southbank puts arts and river walks close; St Kilda offers beach and nightlife with a longer tram ride to most central plans."}
      ],
      "Nature": [
        {"label":"Bay","body":"St Kilda, Brighton, and the bay trail make easy urban coast time; surf beaches and the Great Ocean Road are separate, longer commitments."},
        {"label":"Gardens","body":"The Royal Botanic Gardens, Carlton Gardens, and riverside paths provide central green space; the Dandenongs require a dedicated excursion."},
        {"label":"Weather","body":"Four seasons can arrive in one day. Carry a layer, sun protection, and a weatherproof cultural stop near any garden, coast, or market route."}
      ],
      "Activities": [
        {"label":"By tram","body":"Use the tram network to build north-south neighborhood days rather than returning to the CBD between every stop. Know when the free central zone ends."},
        {"label":"Book","body":"Reserve major sports, theatre, concerts, special exhibitions, and destination restaurants. Markets, gardens, neighborhood walks, and most galleries can follow the weather."},
        {"label":"Day trips","body":"The Great Ocean Road, wine regions, Phillip Island, and the Dandenongs solve different days. Choose one by travel time and season, not by checklist pressure."}
      ]
    }$notes$::jsonb
  ),
  (
    'city:mexico:mexico-city',
    $notes${
      "Food": [
        {"label":"Street rhythm","body":"Tamales and atole belong early; fonda lunches arrive midday; tacos change by stand and hour. Follow the dish's schedule instead of expecting a universal menu."},
        {"label":"Neighborhoods","body":"Centro carries historic institutions; Roma and Condesa mix modern rooms and demand; Juarez, San Rafael, Coyoacan, and farther markets widen the city's food vocabulary."},
        {"label":"Reserve and roam","body":"Book destination restaurants well ahead, then protect room for seafood lunches, market cooking, bakeries, cantinas, and specialist taco stands that reward flexibility."}
      ],
      "Nightlife": [
        {"label":"Districts","body":"Roma, Condesa, and Juarez lead cocktails and mixed nights; Centro holds historic cantinas; Zona Rosa anchors queer nightlife; farther clubs depend on the event."},
        {"label":"Drinks","body":"Cantina beer and botanas, mezcal bars, pulquerias, listening rooms, and technical cocktail bars represent different traditions. Choose the room before ordering the spirit."},
        {"label":"Late movement","body":"Distances and traffic remain real after dark. Use registered ride services, keep the final stops together, and avoid improvising a long cross-city transfer at closing."}
      ],
      "Culture": [
        {"label":"Museum scale","body":"The Anthropology Museum alone can take half a day; Chapultepec, Centro, Coyoacan, and UNAM are separate cultural clusters with distinct histories."},
        {"label":"Ancient city","body":"Templo Mayor, the national collections, and a deliberate Teotihuacan day connect Mexica and earlier worlds without treating the past as a decorative preface."},
        {"label":"Murals and modernity","body":"Palaces, schools, museums, public housing, and university buildings carry muralism, modern architecture, revolution, and civic ambition across the city."}
      ],
      "Stay": [
        {"label":"Roma and Condesa","body":"These neighborhoods offer restaurants, parks, and nightlife with high visitor demand and rising prices. Choose the exact block for noise and transit."},
        {"label":"Reforma and Juarez","body":"This central corridor balances hotels, museums, business, queer nightlife, and fast access to Centro or Chapultepec."},
        {"label":"Centro","body":"The historic center gives unmatched architecture and daytime intensity; evenings vary sharply by street, so property location matters more than the district label."}
      ],
      "Nature": [
        {"label":"Chapultepec","body":"The park is a district-sized landscape of museums, lakes, woodland, and recreation. Choose a section instead of trying to clear the whole map."},
        {"label":"Southern green","body":"UNAM, Xochimilco, Pedregal, and the southern forests reveal lava, wetlands, gardens, and urban ecology far beyond the central parks."},
        {"label":"Altitude and air","body":"The city's elevation can slow the first day, while rain and air quality alter long outdoor plans. Build in water, shade, and a flexible indoor anchor."}
      ],
      "Activities": [
        {"label":"Cluster","body":"Keep Centro, Chapultepec, Roma-Juarez, Coyoacan, and the southern city as separate route blocks. Cross-city zigzags consume the day in traffic."},
        {"label":"Reserve","body":"Book Frida Kahlo Museum, major restaurants, popular exhibitions, and any responsible Xochimilco or Teotihuacan tour. Street and market time should remain loose."},
        {"label":"Sunday and Monday","body":"Sunday closes parts of Reforma to cars and fills parks; many museums close Monday. Let those rhythms determine the week before buying individual tickets."}
      ]
    }$notes$::jsonb
  ),
  (
    'city:usa:miami',
    $notes${
      "Food": [
        {"label":"Miami table","body":"Cuban, Haitian, Bahamian, Nicaraguan, Venezuelan, Peruvian, Jewish, and seafood traditions make Miami's food map. One South Beach dinner cannot summarize it."},
        {"label":"Neighborhoods","body":"Little Havana carries Cuban institutions; Little Haiti and North Miami broaden Caribbean cooking; Wynwood and the Design District hold newer rooms; Miami Beach skews polished."},
        {"label":"Timing","body":"Use bakeries and ventanitas early, seafood and sandwiches for lunch, and reserve destination dinners. Heat makes a long midday food crawl less charming than it looks."}
      ],
      "Nightlife": [
        {"label":"Districts","body":"South Beach carries clubs, hotel bars, and queer history; Wynwood handles bars and live rooms; Downtown and Little River hold listening spaces and event-led nights."},
        {"label":"Check the venue","body":"Miami rooms change names and operators quickly. Confirm the official calendar and current address before building the night around an old recommendation."},
        {"label":"Distance","body":"Beach-to-mainland transfers add bridge traffic and ride cost. Keep dinner and the first drinks on the same side of Biscayne Bay."}
      ],
      "Culture": [
        {"label":"Beyond Art Deco","body":"South Beach architecture matters, but Little Havana, Little Haiti, Overtown, Coconut Grove, and indigenous history carry equally important Miami stories."},
        {"label":"Art circuit","body":"PAMM, the Design District, Wynwood institutions, private collections, and artist-run spaces change with exhibitions. Check the program, especially outside fair week."},
        {"label":"Water city","body":"Climate, migration, port trade, hotels, and real-estate ambition shape Miami's design and culture. Notice the shoreline and infrastructure alongside the galleries."}
      ],
      "Stay": [
        {"label":"Miami Beach","body":"Stay on the beach for sand, Art Deco, and nightlife; accept higher resort fees, visitor prices, and bridge travel to mainland neighborhoods."},
        {"label":"Brickell and Downtown","body":"These areas suit transit, skyline hotels, and mainland dining. Beach days require a deliberate crossing rather than a walk outside."},
        {"label":"Coconut Grove","body":"The Grove offers trees, marina air, and a calmer neighborhood base. It works best for travelers comfortable using Metrorail, rides, or a car."}
      ],
      "Nature": [
        {"label":"Beach","body":"South Beach is the social landmark; North Beach is calmer; Key Biscayne adds parks and a longer ride. Check surf, heat, and storm conditions."},
        {"label":"Everglades","body":"An Everglades visit should reveal wetlands and wildlife, not only an airboat. Operator, season, water level, and route determine what the day actually teaches."},
        {"label":"Weather","body":"Heat, lightning, hurricanes, and afternoon rain are planning facts. Put exposed walks and beach time early, then keep an indoor cultural option ready."}
      ],
      "Activities": [
        {"label":"Choose a side","body":"Group South Beach and Mid-Beach, or keep Wynwood, Design District, Downtown, and Little Havana in a mainland route. Repeated bridge crossings waste the day."},
        {"label":"On the water","body":"Public beach time, Biscayne Bay boats, paddling, fishing, and the Everglades are distinct experiences. Choose by ecology, access, and weather rather than one water label."},
        {"label":"Reserve","body":"Book major clubs, destination restaurants, boat trips, wildlife excursions, and fair-week events. Neighborhood walks and beaches can flex with the forecast."}
      ]
    }$notes$::jsonb
  ),
  (
    'city:italy:milan',
    $notes${
      "Food": [
        {"label":"Milanese table","body":"Risotto, cotoletta, ossobuco, minestrone, mondeghili, and panettone belong to the city's cooking; order them in restaurants that treat tradition as a kitchen, not a theme."},
        {"label":"Everyday food","body":"Panzerotti, pizza al trancio, bakeries, bars, market counters, and immigrant kitchens carry the working city between formal lunches and design-led dinners."},
        {"label":"Aperitivo","body":"Aperitivo ranges from a serious drink with small bites to a buffet replacing dinner. Decide which version the venue offers before building the evening around it."}
      ],
      "Nightlife": [
        {"label":"Districts","body":"Navigli is dense and social; Porta Venezia mixes cocktails and LGBTQ+ nightlife; Isola carries smaller bars and music; Brera skews polished and expensive."},
        {"label":"Start early","body":"Aperitivo is the natural first act, not proof the night ends early. Clubs and event spaces gather later, often outside the prettiest central streets."},
        {"label":"Program","body":"Design-week parties, fashion events, live music, and club nights are calendar-driven. Check who is playing and whether entry requires registration or advance tickets."}
      ],
      "Culture": [
        {"label":"Book first","body":"The Last Supper, La Scala performances, and major design-week events require advance planning. Build flexible churches and galleries around those fixed entries."},
        {"label":"Art city","body":"The Duomo, Brera, Ambrosiana, modern collections, house museums, and industrial art spaces show Milan beyond fashion storefronts."},
        {"label":"Design in use","body":"Showrooms, transit, apartment buildings, cafes, furniture, and adaptive reuse make design part of ordinary Milan. Look beyond museums for how the city works."}
      ],
      "Stay": [
        {"label":"Center","body":"Duomo and Brera put major sights and polished dining close, with premium prices and a thinner sense of residential Milan."},
        {"label":"Porta Venezia and Isola","body":"These districts balance nightlife, restaurants, architecture, and metro access. They suit travelers who want a neighborhood evening after the museums close."},
        {"label":"Station logic","body":"Centrale is practical for rail and airports but changes block by block. Check the exact walk, late arrival route, and metro line before booking."}
      ],
      "Nature": [
        {"label":"City green","body":"Parco Sempione links the castle, design, and residential streets; the Indro Montanelli gardens offer a smaller central pause; Biblioteca degli Alberi gives modern public landscape."},
        {"label":"Canals","body":"Navigli is more social waterfront than wilderness. Walk beyond the busiest bar stretch or use the canal as the start of a cycling route."},
        {"label":"Day escape","body":"Lake Como is possible by train but deserves a clear town, ferry, and return plan. Treat it as a landscape day, not a Milan afternoon errand."}
      ],
      "Activities": [
        {"label":"Central spine","body":"Link the Duomo, Galleria, La Scala, and Brera on foot, then reserve a separate block for the Last Supper and western institutions."},
        {"label":"Book","body":"Reserve the Last Supper first, then opera, football, major exhibitions, and destination dinners. Churches, parks, and design walks can stay flexible."},
        {"label":"Event city","body":"Fashion and design weeks transform prices, access, and neighborhood energy. Check the city calendar even when the trip is not built around an event."}
      ]
    }$notes$::jsonb
  ),
  (
    'city:germany:munich',
    $notes${
      "Food": [
        {"label":"Bavarian table","body":"Weisswurst, roast meats, dumplings, lake fish, asparagus, mushrooms, and pastry follow meal and season. Beer-hall menus are only one part of Munich cooking."},
        {"label":"Markets and counters","body":"Viktualienmarkt, bakeries, butcher counters, Turkish grills, and university-area lunches give the city everyday range beyond formal Bavarian rooms."},
        {"label":"Reservations","body":"Book destination restaurants and popular evening taverns, especially during trade fairs or festivals. Beer gardens remain the flexible weather-dependent meal."}
      ],
      "Nightlife": [
        {"label":"Beer culture","body":"Beer halls are ceremonial and central; beer gardens are seasonal and social; neighborhood Wirtshauser are where food and regulars matter most. Choose the setting deliberately."},
        {"label":"Districts","body":"Glockenbachviertel carries cocktails and queer nightlife; Maxvorstadt suits students and bars; Haidhausen offers calmer local rooms; larger clubs sit farther from postcard Munich."},
        {"label":"Last ride","body":"Night transport varies by line and day. Keep the final stop near an S-Bahn, U-Bahn, or known night-bus connection."}
      ],
      "Culture": [
        {"label":"Museum quarter","body":"The Pinakotheken, Lenbachhaus, Glyptothek, and Egyptian collection form a dense art cluster. Choose by collection rather than trying to clear every institution."},
        {"label":"Royal city","body":"The Residenz, Nymphenburg, churches, and formal avenues explain Bavarian court power; give palace interiors and gardens separate time."},
        {"label":"Modern history","body":"Nazi movement sites, the Documentation Center, postwar rebuilding, and the 1972 Olympic landscape require attention beyond the preserved old town."}
      ],
      "Stay": [
        {"label":"Altstadt","body":"The historic center offers maximum walking and minimum room value. It suits short first visits, especially when early trains are not the priority."},
        {"label":"Maxvorstadt and Schwabing","body":"These districts balance museums, universities, restaurants, and neighborhood evenings while staying close by U-Bahn or tram."},
        {"label":"Station edge","body":"Hauptbahnhof hotels are practical for rail and airport connections, but construction and block character change. Check the exact entrance route before arrival."}
      ],
      "Nature": [
        {"label":"English Garden","body":"The English Garden is larger than a central stroll: river surfing, meadows, beer gardens, and northern quiet require choosing a section."},
        {"label":"Isar","body":"The Isar banks are Munich's informal summer living room. Swimming conditions, current, and local restrictions matter more than how calm the water appears."},
        {"label":"Alps and lakes","body":"Tegernsee, Starnberger See, and Alpine routes need weather, train, and trail planning. Choose one landscape rather than collecting distant station stops."}
      ],
      "Activities": [
        {"label":"Book","body":"Reserve major football, opera, palace tours, special exhibitions, and high-demand restaurants. Markets, parks, beer gardens, and central churches can remain flexible."},
        {"label":"Sunday","body":"Sunday retail closures change the city rhythm. Use the day for museums, parks, cafes, walks, and meals rather than a shopping list."},
        {"label":"Festival calendar","body":"Oktoberfest is only the largest example: trade fairs, football, concerts, and seasonal festivals alter rooms and transport. Check dates before setting the base."}
      ]
    }$notes$::jsonb
  ),
  (
    'city:usa:new-york-city',
    $notes${
      "Food": [
        {"label":"Neighborhoods","body":"New York food is borough and neighborhood history: Jewish appetizing, Caribbean cooking, Chinese regional kitchens, Italian institutions, soul food, pizza, and new immigrant counters."},
        {"label":"Meal type","body":"Bagels, diners, slices, lunch counters, market stalls, dining rooms, and tasting menus solve different moments. Do not make every recommendation compete as dinner."},
        {"label":"Booking","body":"Reserve destination tables early, especially for prime weekend times. Use walk-in counters and neighborhood specialists as flexible anchors rather than backup consolation."}
      ],
      "Nightlife": [
        {"label":"Choose the event","body":"A jazz set, Broadway bar, queer dance floor, dive, comedy room, and listening bar are different New York nights. Start with the program."},
        {"label":"Districts","body":"Lower Manhattan is dense but expensive; Brooklyn carries major clubs and neighborhood bars; Harlem remains vital for music; Queens rewards event-specific trips."},
        {"label":"Late transport","body":"Subways run overnight but service changes, waits grow, and transfers close. Keep the late venue on a direct line to the bed and check planned work."}
      ],
      "Culture": [
        {"label":"Museum scale","body":"The Met, MoMA, Natural History, Whitney, and major outer-borough museums each demand time. One large collection plus a smaller institution is a strong day."},
        {"label":"Performance city","body":"Broadway, Lincoln Center, jazz, comedy, dance, experimental theatre, and repertory film are not evening extras. Let a ticket shape the neighborhood route."},
        {"label":"Beyond Manhattan","body":"Brooklyn, Queens, the Bronx, Staten Island, Harlem, and the Lower East Side carry migration, art, music, labor, and civic history absent from a Midtown-only trip."}
      ],
      "Stay": [
        {"label":"Subway line","body":"Choose the hotel by the lines and boroughs you will repeat. A central address that requires awkward transfers can be less useful than a direct outer-neighborhood base."},
        {"label":"Manhattan tradeoff","body":"Midtown gives transit and first-time landmarks; Downtown suits dining and nightlife; Upper West and Upper East provide museums and calmer residential evenings."},
        {"label":"Across the river","body":"Brooklyn and Queens can offer neighborhood character or value, but the exact station and late service determine whether the room expands or restricts the trip."}
      ],
      "Nature": [
        {"label":"Big parks","body":"Central Park is a landscape of routes, not one lawn; Prospect Park serves Brooklyn; the Bronx and upper Manhattan hold gardens, woods, and river edges worth the train."},
        {"label":"Waterfront","body":"Hudson River Park, Brooklyn Bridge Park, Governors Island, and Queens waterfronts offer distinct skyline angles. Choose one that connects to the day's neighborhoods."},
        {"label":"Season","body":"Heat, snow, wind tunnels, foliage, and early winter darkness change how far New York feels. Put a museum, cafe, or transit shortcut beside long outdoor sections."}
      ],
      "Activities": [
        {"label":"Cluster","body":"Keep Lower Manhattan with the harbor, Midtown with major architecture, Museum Mile with Central Park, and outer-borough stops in focused district routes."},
        {"label":"Reserve","body":"Book major shows, skyline observatories, popular museums, sports, and high-demand restaurants. Ferries, parks, bridges, and neighborhood walks can flex with weather."},
        {"label":"Use transit","body":"The subway is usually faster than a car for long north-south moves; ferries improve waterfront routes; walking is for discovering within a district, not crossing every borough."}
      ]
    }$notes$::jsonb
  ),
  (
    'city:usa:orlando',
    $notes${
      "Food": [
        {"label":"Beyond the parks","body":"Mills 50, Colonialtown, Winter Park, and other local districts carry Vietnamese, Puerto Rican, Caribbean, Southern, and contemporary Florida cooking beyond resort property."},
        {"label":"Park meals","body":"Inside the major resorts, reservations, mobile ordering, and location determine whether food supports the day or becomes another queue. Plan the anchor meal before arrival."},
        {"label":"Distance","body":"A restaurant marketed as Orlando may be a long drive from the hotel or park. Check real travel time before turning dinner into a second transportation project."}
      ],
      "Nightlife": [
        {"label":"Districts","body":"Downtown has clubs and bars; Mills 50 and Ivanhoe suit local rooms; Winter Park runs polished; resort districts provide convenient but manufactured late options."},
        {"label":"Event first","body":"Live music, comedy, queer nights, cocktail bars, breweries, and theme-park after-hours events all depend on the calendar. Confirm what is actually happening."},
        {"label":"Getting home","body":"Late transit is limited and distances are large. Choose a designated driver, ride service, or a night close to the hotel before the first round."}
      ],
      "Culture": [
        {"label":"Local institutions","body":"The Morse Museum, Orlando Museum of Art, performing arts, gardens, and regional history give Central Florida a cultural life separate from themed entertainment."},
        {"label":"Communities","body":"Puerto Rican, Caribbean, Vietnamese, African American, and LGBTQ+ communities shape Orlando through food, festivals, music, faith, and neighborhood businesses."},
        {"label":"Theme design","body":"The parks are also architecture, engineering, performance, and storytelling at industrial scale. Read how the illusion is built rather than pretending it is not culture."}
      ],
      "Stay": [
        {"label":"On property","body":"Resort hotels trade price for transport, early-entry benefits, and a controlled experience. The value depends on which park system the trip actually repeats."},
        {"label":"Lake Buena Vista","body":"This area offers broad hotel choice and dining access, with traffic and shuttle quality varying sharply by property."},
        {"label":"Local Orlando","body":"Downtown, Winter Park, and northern neighborhoods suit food and culture trips but require deliberate drives to the major parks."}
      ],
      "Nature": [
        {"label":"Springs","body":"Central Florida's freshwater springs offer swimming, paddling, and wildlife, but capacity, water conditions, and seasonal access must be checked before the drive."},
        {"label":"Wetlands","body":"Lakes, wetlands, and wildlife areas reveal the ecosystem beneath the attractions. Use established operators and maintain distance from alligators and nesting animals."},
        {"label":"Weather","body":"Heat, humidity, lightning, and hurricane season are operational facts. Put exposed activity early and treat afternoon storms as expected rather than exceptional."}
      ],
      "Activities": [
        {"label":"Park strategy","body":"Choose the day's priorities before the gates: top rides, show times, meals, rest, and exit plan. A complete attraction list is not a humane itinerary."},
        {"label":"Reserve","body":"Book park passes, high-demand dining, special events, and timed experiences first. Local museums, gardens, and neighborhood food can fill the flexible days."},
        {"label":"Rest day","body":"Place a pool, garden, local neighborhood, or springs day between major parks. Orlando improves when the schedule acknowledges heat, walking, and sensory load."}
      ]
    }$notes$::jsonb
  ),
  (
    'city:japan:osaka',
    $notes${
      "Food": [
        {"label":"Counter city","body":"Takoyaki, okonomiyaki, kushikatsu, udon, sushi, horumon, and yakiniku belong to distinct specialists. Follow the dish rather than a menu trying to serve all of Osaka."},
        {"label":"Neighborhoods","body":"Namba and Dotonbori deliver density and spectacle; Kuromon is strongest earlier; Tenma, Fukushima, and Shinsekai give more local counter and drinking routes."},
        {"label":"Pace","body":"Many of Osaka's best meals are quick, standing, grilled in front of you, or squeezed into a narrow room. Turnover and informality are part of the appeal."}
      ],
      "Nightlife": [
        {"label":"Districts","body":"Namba and Shinsaibashi carry the broadest late range; Umeda hides bars across towers and basements; Tenma is built for compact izakaya hopping."},
        {"label":"Room type","body":"Standing bars, game bars, rock rooms, tiny cocktail counters, karaoke, and clubs are separate Osaka nights. Pick the room before joining the crowd."},
        {"label":"Last train","body":"Rail stops before every bar does. Keep the late route inside one hub unless the group is prepared for taxis or an all-night finish."}
      ],
      "Culture": [
        {"label":"Merchant city","body":"The history museum, castle context, river trade, markets, and commercial districts explain Osaka as a merchant power rather than Kyoto's louder neighbor."},
        {"label":"Performance","body":"Bunraku, comedy, theatre, and live music are central Osaka culture. Check schedules and translations rather than visiting the venue only from outside."},
        {"label":"Modern city","body":"Postwar architecture, Expo legacies, industrial waterfronts, contemporary art, and dense rail hubs show a city continually remaking its practical systems."}
      ],
      "Stay": [
        {"label":"Namba","body":"Namba suits food, nightlife, and airport access, with crowds and street noise around the busiest entertainment blocks."},
        {"label":"Umeda","body":"Umeda is the strongest rail base for Kyoto, Kobe, and northern Osaka; the district is vertical, polished, and less intimate after office hours."},
        {"label":"Neighborhood value","body":"Tennoji, Shinsekai, and farther stations can offer larger rooms or lower prices. A direct line matters more than saving a few blocks on the map."}
      ],
      "Nature": [
        {"label":"River city","body":"Nakanoshima, riverside promenades, and public boats reveal Osaka's commercial geography while giving space between dense station districts."},
        {"label":"Parks","body":"Osaka Castle Park is central and monumental; Nagai and Tsurumi Ryokuchi offer broader local green space; Minoh provides an easy wooded escape."},
        {"label":"Season","body":"Cherry blossom, summer humidity, autumn foliage, and winter illumination all change outdoor routes. Use mornings and river air when heat is strongest."}
      ],
      "Activities": [
        {"label":"Cluster","body":"Keep Namba, Shinsaibashi, and Dotonbori together; treat Umeda as a separate vertical district; pair the castle with nearby museums and river space."},
        {"label":"Reserve","body":"Book theme parks, popular observatories, major performances, and destination counters. Markets, street food, parks, and neighborhood bar routes can remain flexible."},
        {"label":"Day trips","body":"Kyoto, Nara, Kobe, and Himeji are distinct days with direct rail. Choose one by history, food, or landscape rather than collecting station arrivals."}
      ]
    }$notes$::jsonb
  ),
  (
    'city:france:paris',
    $notes${
      "Food": [
        {"label":"Daily rhythm","body":"Bakeries own the morning, lunch formulas reward timing, patisseries suit the afternoon, and dinner reservations shape the night. Let each institution do its proper job."},
        {"label":"Paris table","body":"Bistros, bouillons, brasseries, wine bars, market counters, immigrant kitchens, and tasting rooms are different parts of the city, not a ladder from cheap to serious."},
        {"label":"Neighborhoods","body":"The center carries historic rooms and demand; the 10th, 11th, 18th, 19th, and 20th broaden contemporary cooking, North and West African food, and neighborhood value."}
      ],
      "Nightlife": [
        {"label":"Districts","body":"Pigalle and the 9th mix cocktails and music; the Marais carries queer history and polished bars; the 11th and northeast offer clubs, dives, and live rooms."},
        {"label":"Program first","body":"Jazz cellars, cabaret, electronic clubs, wine bars, concert halls, and hotel cocktails promise different nights. Choose the bill or room before the arrondissement."},
        {"label":"Last ride","body":"Metro service ends before every late room does. Keep the final venue near a night bus, taxi route, or a direct path back to the hotel."}
      ],
      "Culture": [
        {"label":"Museum scale","body":"The Louvre, Orsay, Pompidou program, and major fashion or science collections each need real time. One large institution plus a smaller museum is a better day."},
        {"label":"Historic layers","body":"Roman remains, medieval churches, royal axes, revolution, occupation, migration, and modern planning sit across different neighborhoods. Read Paris beyond one monumental center."},
        {"label":"Performance","body":"Opera, theatre, dance, cinema, jazz, and contemporary exhibitions keep the city active after museum hours. Check schedules before treating the building as the whole experience."}
      ],
      "Stay": [
        {"label":"Central tradeoff","body":"The 1st through 6th minimize first-time travel and maximize room prices. Historic buildings can mean small rooms, limited lifts, and street noise."},
        {"label":"Right Bank neighborhoods","body":"The 9th, 10th, 11th, and parts of the northeast offer restaurants and nightlife with strong metro access; block character changes quickly around stations."},
        {"label":"Line logic","body":"Choose a hotel near a useful metro line and a neighborhood you enjoy at night. A cheaper room requiring two transfers adds cost every day."}
      ],
      "Nature": [
        {"label":"Gardens","body":"The Tuileries is formal and central; Luxembourg is a living neighborhood garden; Buttes-Chaumont and Belleville give slopes and east-side views; Bois de Vincennes offers scale."},
        {"label":"River and canals","body":"The Seine is best walked in sections tied to nearby districts; Canal Saint-Martin and the Bassin de la Villette offer a more local waterside rhythm."},
        {"label":"Season","body":"Summer heat, winter darkness, spring rain, and autumn light alter long walks. Keep arcades, cafes, churches, and museums as natural shelters along the route."}
      ],
      "Activities": [
        {"label":"Cluster","body":"Keep the Louvre and Palais Royal together, the Latin Quarter with the islands, Montmartre on its hill, and the northeast as its own cultural route."},
        {"label":"Reserve","body":"Book headline museums, temporary exhibitions, major performances, monuments with timed entry, and high-demand restaurants. Gardens, passages, markets, and river walks can flex."},
        {"label":"Look beyond icons","body":"A market morning, neighborhood cinema, cemetery walk, canal evening, or local museum often explains Paris better than a second panoramic queue."}
      ]
    }$notes$::jsonb
  ),
  (
    'city:czech-republic:prague',
    $notes${
      "Food": [
        {"label":"Czech table","body":"Roast meats, sauces, dumplings, schnitzel, game, freshwater fish, open sandwiches, pastry, and modern Czech cooking deserve more attention than one plate of goulash."},
        {"label":"Lunch","body":"Weekday lunch menus are the practical way into pubs and restaurants. Go when local kitchens are serving their strongest value rather than waiting for a late tourist dinner."},
        {"label":"Neighborhoods","body":"The old center holds important institutions and inflated menus; Karlin, Holesovice, Vinohrady, and Zizkov broaden contemporary dining, cafes, and neighborhood pubs."}
      ],
      "Nightlife": [
        {"label":"Beer room","body":"Historic pubs, tank-beer halls, microbreweries, and neighborhood hospody offer different Czech beer experiences. Fresh service and room culture matter more than the longest tap list."},
        {"label":"Districts","body":"Old Town carries classic bars and visitor pressure; Zizkov and Vinohrady suit pubs; Holesovice and Karlin hold event spaces and newer cocktail rooms."},
        {"label":"Music","body":"Jazz cellars, classical halls, electronic clubs, and rock bars need a calendar check. Prague nightlife is stronger when the performance leads the route."}
      ],
      "Culture": [
        {"label":"Castle ridge","body":"The castle, cathedral, palaces, and Mala Strana form a large political and religious complex. Start early and descend through the district rather than climbing twice."},
        {"label":"Jewish history","body":"The synagogues, cemetery, and museum collections require time and context. They are not interchangeable interiors on an Old Town walk."},
        {"label":"Modern city","body":"Cubism, functionalism, communist rule, dissident history, contemporary art, and industrial districts keep Prague from ending with baroque facades."}
      ],
      "Stay": [
        {"label":"Old center","body":"Old Town and Mala Strana maximize landmark access while bringing crowds, cobbles, and higher prices. Check vehicle access if arriving with luggage."},
        {"label":"Vinohrady and Zizkov","body":"These neighborhoods offer cafes, pubs, and stronger value east of the center, with tram and metro routes doing the daily work."},
        {"label":"Karlin and Holesovice","body":"Modern hotels and hostels here suit food, design, and event-led trips. Confirm the direct night connection back from the historic core."}
      ],
      "Nature": [
        {"label":"Hill views","body":"Petrin is the formal central climb; Letna offers river bridges and beer-garden space; Vitkov gives a less romantic view tied to modern history."},
        {"label":"River","body":"Walk the Vltava beyond Charles Bridge, use the islands, or take a public ferry. The water is more revealing away from the single crowded crossing."},
        {"label":"Season","body":"Winter ice, summer heat, and shoulder-season rain make steep cobbles and exposed hills behave differently. Build a tram or indoor escape into the route."}
      ],
      "Activities": [
        {"label":"Start early","body":"Cross Charles Bridge and enter the castle side early, then let the route descend toward Mala Strana before tour traffic reaches full force."},
        {"label":"Book","body":"Reserve major concerts, special castle tours, popular restaurants, and limited exhibitions. Churches, hills, river walks, and most museums offer more flexibility."},
        {"label":"Use trams","body":"Prague's trams are the clean answer to repeated hills and outer neighborhoods. Walk downhill through the historic core and ride back when the legs have learned enough."}
      ]
    }$notes$::jsonb
  ),
  (
    'city:italy:rome',
    $notes${
      "Food": [
        {"label":"Roman table","body":"Carbonara, gricia, amatriciana, cacio e pepe, quinto quarto, seasonal vegetables, pizza, and Jewish-Roman cooking belong to specific traditions and kitchens."},
        {"label":"Daytime","body":"Coffee bars, markets, bakeries, pizza al taglio, supplì, and gelato make Rome work between long museum and archaeological routes. Use them at their natural hour."},
        {"label":"Neighborhoods","body":"The historic center requires careful selection; Testaccio is essential for Roman food history; Trastevere varies by street; San Lorenzo, Ostiense, and farther districts broaden the map."}
      ],
      "Nightlife": [
        {"label":"Districts","body":"Trastevere is dense and visitor-heavy; Monti suits wine and cocktails; Testaccio and Ostiense carry clubs and music; Pigneto and San Lorenzo run younger and local."},
        {"label":"Start outside","body":"Aperitivo and piazza drinking are part of the Roman evening, but use a serious bar, enoteca, music room, or club when the night needs more than scenery."},
        {"label":"Getting home","body":"Late public transport is limited and taxis can be scarce at peak moments. Keep the final stop near the hotel or a known night route."}
      ],
      "Culture": [
        {"label":"Ancient city","body":"The Forum, Palatine, Colosseum, Pantheon, baths, roads, and neighborhood ruins explain different Roman systems. Spread them across routes rather than one endurance test."},
        {"label":"Church interiors","body":"Basilicas and small churches hold mosaics, Caravaggio, Bernini, ancient foundations, and living worship. Dress appropriately and respect service times."},
        {"label":"After antiquity","body":"Renaissance palaces, Baroque planning, Jewish history, modern art, Fascist architecture, film, and postwar neighborhoods prevent Rome from becoming one long archaeological label."}
      ],
      "Stay": [
        {"label":"Historic center","body":"Pantheon, Campo, and Trevi addresses maximize walking and cost, with cobbles, late noise, compact rooms, and difficult vehicle access on some streets."},
        {"label":"Monti and Celio","body":"These areas suit ancient-site access and neighborhood evenings while keeping Termini and central transit within reach."},
        {"label":"Prati and Testaccio","body":"Prati works for Vatican mornings and calmer nights; Testaccio suits food-led trips and local bars. Both require more deliberate movement to the opposite side of Rome."}
      ],
      "Nature": [
        {"label":"Villas","body":"Villa Borghese is the central park-and-museum link; Villa Doria Pamphilj offers more space; the Appian Way combines landscape, archaeology, and a longer route."},
        {"label":"River","body":"The Tiber is most useful as a connecting walk, especially near Trastevere, the Jewish Ghetto, and Prati. Island and bank access varies by section and season."},
        {"label":"Heat","body":"Summer stone stores heat and exposed sites offer little shade. Put ruins early, use churches and museums midday, and return to parks or piazzas late."}
      ],
      "Activities": [
        {"label":"One Rome at a time","body":"Separate the ancient core, Vatican and Prati, historic-center churches, and Testaccio-Appian routes. Each district contains enough history for a full day."},
        {"label":"Reserve","body":"Book the Colosseum complex, Borghese Gallery, Vatican Museums, major excavations, and high-demand dinners. Churches, fountains, markets, and many ruins stay flexible."},
        {"label":"Walking reality","body":"Rome rewards walking but punishes straight-line optimism. Cobbles, heat, crowds, and archaeological barriers make a nearby stop slower than it appears."}
      ]
    }$notes$::jsonb
  ),
  (
    'city:usa:san-francisco',
    $notes${
      "Food": [
        {"label":"City table","body":"Chinese regional cooking, Mission burritos, sourdough, seafood, Italian institutions, Filipino food, bakeries, and produce-led California rooms all belong to San Francisco."},
        {"label":"Neighborhoods","body":"Chinatown and North Beach carry historic density; the Mission excels at casual range; Richmond and Sunset reward cross-town trips; Hayes and the northeast hold polished rooms."},
        {"label":"Timing","body":"Reserve small destination restaurants, but use bakeries, dim sum, taquerias, seafood counters, and lunch menus as flexible route food before they sell out."}
      ],
      "Nightlife": [
        {"label":"Districts","body":"The Mission carries bars and live rooms; the Castro anchors queer history; North Beach and Chinatown hold old institutions; SoMa depends on the club or event."},
        {"label":"Start early","body":"San Francisco nights often begin and finish earlier than New York or Los Angeles. Check kitchen, show, and last-call hours before assuming the room will wait."},
        {"label":"Event first","body":"Jazz, punk, electronic nights, drag, comedy, neighborhood dives, and technical cocktails belong to distinct local histories. Let the program lead."}
      ],
      "Culture": [
        {"label":"Museum clusters","body":"SFMOMA and Yerba Buena form the central contemporary cluster; Golden Gate Park holds major science and art institutions; the Legion of Honor stands apart."},
        {"label":"Neighborhood history","body":"Chinatown, the Mission, Japantown, North Beach, the Castro, and Fillmore carry migration, labor, music, queer, and civil-rights stories absent from skyline sightseeing."},
        {"label":"Built city","body":"Victorian housing, earthquake rebuilding, bridges, transit, murals, modernism, and waterfront industry make architecture inseparable from geology and politics."}
      ],
      "Stay": [
        {"label":"Downtown choice","body":"Union Square offers transit and hotel inventory; SoMa suits museums and events. Street conditions and late atmosphere vary block by block, so inspect the exact location."},
        {"label":"Neighborhood base","body":"North Beach, the Marina, Hayes Valley, and the Castro provide stronger evening character with fewer large hotels and different transit tradeoffs."},
        {"label":"Hills and lines","body":"Choose the property by Muni route and hill, not straight-line distance. Luggage turns a picturesque grade into a practical problem quickly."}
      ],
      "Nature": [
        {"label":"Headlands and coast","body":"Lands End, the Presidio, Ocean Beach, and Marin headlands offer different exposure and distance. Fog and wind can change the view within an hour."},
        {"label":"City parks","body":"Golden Gate Park is a long cultural landscape, not one field; the Presidio mixes forest and military history; smaller hill parks deliver neighborhood-scale views."},
        {"label":"Layers","body":"A sunny Mission afternoon can coexist with a cold western shore. Carry a layer and check neighborhood weather before crossing the city for an outdoor plan."}
      ],
      "Activities": [
        {"label":"Cluster","body":"Keep the northeast waterfront, central museums, Mission-Castro corridor, and Golden Gate Park-western coast as separate geographic days."},
        {"label":"Reserve","body":"Book Alcatraz, major performances, popular restaurants, and limited exhibitions first. Parks, neighborhoods, ferries, and most museums offer more flexibility."},
        {"label":"Transit mix","body":"Use Muni rail and buses for distance, cable cars for one historic route, ferries for the bay, and walking within neighborhoods where the hill makes sense."}
      ]
    }$notes$::jsonb
  ),
  (
    'city:south-korea:seoul',
    $notes${
      "Food": [
        {"label":"Morning and soup","body":"Gukbap, seolleongtang, porridge, market food, bakeries, and coffee give Seoul more morning range than the idea of one Korean breakfast."},
        {"label":"Shared table","body":"Barbecue, stews, seafood, fried chicken, temple food, and drinking dishes work through different group sizes and pacing. Order for the table's actual appetite."},
        {"label":"Neighborhoods","body":"Jongno and markets carry old specialists; Euljiro mixes workshops and new bars; Mapo handles barbecue; Hannam, Apgujeong, and Seongsu lead contemporary rooms."}
      ],
      "Nightlife": [
        {"label":"Districts","body":"Hongdae carries live music and youth clubs; Itaewon remains international and queer; Euljiro mixes tiny bars and workshops; Gangnam holds large polished rooms."},
        {"label":"One district","body":"Seoul nights can outlast the subway. Keep late stops in one district unless the group is comfortable with taxis after rail service ends."},
        {"label":"Room type","body":"Pochas, noraebang, listening bars, soju rooms, cocktail counters, live clubs, and dance floors are different social rituals. Choose the format first."}
      ],
      "Culture": [
        {"label":"Palace city","body":"Gyeongbokgung, Changdeokgung, Jongmyo, and the old urban fabric explain different royal and ritual functions. Check closed days and guided-access areas."},
        {"label":"Modern history","body":"Colonial rule, war, division, dictatorship, industrialization, and democracy are visible in museums, prisons, memorials, architecture, and transformed districts."},
        {"label":"Contemporary Seoul","body":"Design, fashion, K-pop, film, galleries, gaming, and independent music move through Seongsu, Hongdae, Hannam, and beyond. Follow current programs rather than static fame."}
      ],
      "Stay": [
        {"label":"Jongno","body":"Jongno and Euljiro suit palaces, markets, transit, and older Seoul, with business streets that become bars after work."},
        {"label":"Hongdae","body":"Hongdae works for social stays, airport rail, nightlife, and younger travelers; weekend noise and crowds are part of the bargain."},
        {"label":"South of the river","body":"Gangnam, Apgujeong, and Jamsil suit shopping, business, and modern attractions but increase travel time to palace and market days."}
      ],
      "Nature": [
        {"label":"Mountains","body":"Bukhansan offers serious trails; Namsan is the central climb; Inwangsan gives a shorter ridge with city-wall history. Match footwear and weather to the route."},
        {"label":"River","body":"The Han River parks are for cycling, picnics, sunset, and ordinary Seoul life. Choose the park by bridge, subway access, and the district that follows."},
        {"label":"Season","body":"Fine dust, monsoon rain, summer humidity, snow, blossom, and autumn color can each control the outdoor day. Check conditions, not just temperature."}
      ],
      "Activities": [
        {"label":"Cluster","body":"Keep the palace-Jongno core together, Hongdae with the western districts, and Gangnam-Seongsu routes deliberate. River crossings and transfers consume more time than the map suggests."},
        {"label":"Reserve","body":"Book limited palace tours, major performances, popular observatories, beauty appointments, and destination restaurants. Markets, parks, and neighborhood shopping can flex."},
        {"label":"Late city","body":"Build one evening around dinner, drinks, music, and noraebang in the same district. The sequence reveals Seoul's social rhythm better than isolated stops."}
      ]
    }$notes$::jsonb
  ),
  (
    'city:singapore:singapore',
    $notes${
      "Food": [
        {"label":"Hawker logic","body":"Hawker centers are communities of specialists, not one restaurant. Share seats, return trays where required, and order from stalls known for a dish."},
        {"label":"Range","body":"Malay, Chinese, Indian, Peranakan, Eurasian, Indonesian, and newer migrant cooking shape Singapore. Build the trip around several traditions, not a generic street-food label."},
        {"label":"Timing","body":"Famous stalls can sell out or keep narrow hours. Use breakfast, lunch, and late-night specialists when they cook, then reserve destination dining separately."}
      ],
      "Nightlife": [
        {"label":"Districts","body":"The civic center and Chinatown lead cocktails; Kampong Glam mixes bars and live rooms; Robertson Quay is easygoing; large clubs depend on the complex and event."},
        {"label":"Price","body":"Taxes, service, and alcohol prices make rounds add up quickly. Happy hours, beer rooms, and one serious cocktail stop keep the night intentional."},
        {"label":"Program","body":"Listening bars, hotel lounges, breweries, live music, and dance floors are separate scenes. Check the night's event and dress expectations before arrival."}
      ],
      "Culture": [
        {"label":"Civic core","body":"National collections, colonial institutions, war history, and contemporary art cluster around the river and civic district; exhibitions determine how long each deserves."},
        {"label":"Living districts","body":"Chinatown, Little India, Kampong Glam, Joo Chiat, and Katong hold faith, trade, architecture, food, and community life beyond decorative heritage facades."},
        {"label":"City making","body":"Public housing, water systems, gardens, ports, transit, and planning are central Singapore culture. Read the infrastructure alongside temples and museums."}
      ],
      "Stay": [
        {"label":"Civic center","body":"City Hall, Marina Bay, and the river suit first-time landmarks and polished hotels, with the highest rates and a less residential evening."},
        {"label":"Chinatown and Bugis","body":"These districts balance food, culture, transit, hotels, and hostels. Choose the exact street for late noise and market traffic."},
        {"label":"Neighborhood base","body":"Little India, Katong, and farther districts give stronger local rhythm and value when the property sits near an MRT station."}
      ],
      "Nature": [
        {"label":"Gardens","body":"The Botanic Gardens is a living tropical collection; Gardens by the Bay is designed spectacle; MacRitchie and the nature reserves offer forest trails with real humidity."},
        {"label":"Islands and wetlands","body":"Pulau Ubin and Sungei Buloh reveal mangroves, wildlife, and older landscapes. Weather, tides, ferry timing, and mosquito protection matter."},
        {"label":"Heat and rain","body":"Outdoor routes work best early or late. Build hawker centers, museums, malls, or transit into the middle rather than asking the body to ignore the climate."}
      ],
      "Activities": [
        {"label":"Cluster","body":"Keep Marina Bay with the civic district, Chinatown with the river, and Kampong Glam with Bugis. MRT efficiency does not make constant backtracking interesting."},
        {"label":"Reserve","body":"Book major attractions, popular restaurants, special exhibitions, and limited nature tours. Hawker centers, gardens, neighborhoods, and transit-led walks can flex with rain."},
        {"label":"Public city","body":"Ride the MRT, walk an HDB town center, eat in a hawker center, and use a park connector. Singapore's ordinary systems are among its most revealing experiences."}
      ]
    }$notes$::jsonb
  ),
  (
    'city:australia:sydney',
    $notes${
      "Food": [
        {"label":"Morning","body":"Sydney takes coffee, bakeries, and breakfast seriously, especially near beaches and inner neighborhoods. Use the morning meal to place the day geographically."},
        {"label":"Communities","body":"Cantonese and regional Chinese food, Vietnamese, Lebanese, Thai, Greek, Italian, Indian, and Pacific cooking require looking beyond the harbor center."},
        {"label":"Sea and produce","body":"Seafood, contemporary Australian rooms, pubs, wine bars, and market cooking all benefit from season and source. Reserve the view only when the kitchen earns it too."}
      ],
      "Nightlife": [
        {"label":"Districts","body":"The CBD and Circular Quay lean hotel and cocktail-led; Surry Hills and Newtown carry pubs, queer rooms, and live music; Marrickville adds breweries and warehouse events."},
        {"label":"Program first","body":"Live music, theatre, dance floors, pubs, and technical cocktail bars operate on different calendars and closing patterns. Check the event before crossing town."},
        {"label":"Late return","body":"Train and bus service thins late, while harbor geography lengthens rides. Keep the final venue on a direct route to the bed."}
      ],
      "Culture": [
        {"label":"First Nations","body":"Begin with Aboriginal and Torres Strait Islander art, history, language, and Country in the major collections, then recognize the harbor as lived cultural landscape."},
        {"label":"Harbor institutions","body":"The Opera House, Art Gallery, museums, Rocks history, and Walsh Bay stages form a central cluster, but each needs a performance or collection choice."},
        {"label":"Beyond the postcard","body":"Western Sydney, migrant neighborhoods, live-music rooms, independent galleries, and industrial heritage carry a broader city than the bridge-to-beach route."}
      ],
      "Stay": [
        {"label":"Harbor core","body":"Circular Quay and the Rocks provide landmark views and easy first-time access at premium prices, with fewer everyday neighborhood options."},
        {"label":"Inner city","body":"Surry Hills, Potts Point, and Newtown suit restaurants, bars, and local streets; choose a station connection that matches the planned coast and harbor days."},
        {"label":"Beach base","body":"Bondi and Manly turn the trip toward sand and early mornings. They are rewarding when the commute to central museums and nights is an accepted trade."}
      ],
      "Nature": [
        {"label":"Coastal walks","body":"Bondi-Coogee is social and accessible; Manly-Spit is longer and bushier; Royal National Park needs a dedicated day. Choose by terrain, heat, and transport."},
        {"label":"Harbor","body":"Public ferries are Sydney's best scenic transport, connecting coves, suburbs, islands, and beaches while revealing the harbor's true scale."},
        {"label":"Conditions","body":"Sun, heat, surf, smoke, and storms change outdoor safety quickly. Carry water and protection, swim between flags, and check park or beach alerts."}
      ],
      "Activities": [
        {"label":"Use ferries","body":"Build Manly, Watsons Bay, Cockatoo Island, or Taronga around public ferry routes. The crossing is part of the day and removes a road transfer."},
        {"label":"Reserve","body":"Book Opera House performances or tours, bridge climbs, major sports, destination restaurants, and limited exhibitions. Beaches and walks can follow conditions."},
        {"label":"One coast","body":"Pair a harbor district with one beach or coastal walk rather than crossing repeatedly between east, north, and inner west. Sydney's water makes distance beautiful and real."}
      ]
    }$notes$::jsonb
  )
;

create temp table expanded_populated_city_category_notes on commit drop as
select
  seed.destination_legacy_id,
  category.key as category,
  note.ordinality::integer as note_position,
  nullif(btrim(note.value ->> 'label'), '') as note_label,
  btrim(note.value ->> 'body') as note_body
from seed_populated_city_category_notes seed
cross join lateral jsonb_each(seed.categories) category
cross join lateral jsonb_array_elements(category.value) with ordinality as note(value, ordinality);

do $$
declare
  invalid_count integer;
begin
  select count(*) into invalid_count
  from (
    select destination_legacy_id, category, count(*) as note_count
    from expanded_populated_city_category_notes
    group by destination_legacy_id, category
    having count(*) <> 3
  ) invalid;

  if invalid_count > 0 then
    raise exception 'Every seeded city/category must contain exactly three notes';
  end if;

  if exists (
    select 1
    from expanded_populated_city_category_notes
    where category not in ('Food', 'Nightlife', 'Culture', 'Stay', 'Nature', 'Activities', 'Routes', 'Essentials')
       or note_body = ''
       or note_label is null
  ) then
    raise exception 'Seed contains an invalid category, blank label, or blank body';
  end if;
end;
$$;

insert into public.destination_category_insights (
  destination_id,
  category,
  locale,
  label,
  sort_order,
  source_type,
  source_metadata,
  is_active
)
select distinct
  destination.id,
  seed.category,
  'en',
  case when seed.category = 'Activities' then 'Activity notes' else seed.category || ' notes' end,
  case seed.category
    when 'Food' then 10
    when 'Nightlife' then 20
    when 'Culture' then 30
    when 'Stay' then 40
    when 'Nature' then 50
    when 'Activities' then 60
    when 'Routes' then 70
    when 'Essentials' then 80
  end,
  'editorial',
  jsonb_build_object(
    'source', 'populated_city_category_notes_20260716',
    'editorial_reference', 'city:japan:tokyo'
  ),
  true
from expanded_populated_city_category_notes seed
join public.destinations destination
  on destination.legacy_id = seed.destination_legacy_id
 and destination.scope = 'city'::public.destination_scope
on conflict (destination_id, category, locale) do update set
  label = excluded.label,
  sort_order = excluded.sort_order,
  source_type = excluded.source_type,
  source_metadata = public.destination_category_insights.source_metadata || excluded.source_metadata,
  is_active = true,
  updated_at = now();

update public.destination_category_insight_notes note
set
  is_active = false,
  updated_at = now()
from public.destination_category_insights insight
join public.destinations destination on destination.id = insight.destination_id
join (
  select distinct destination_legacy_id, category
  from expanded_populated_city_category_notes
) seed
  on seed.destination_legacy_id = destination.legacy_id
 and seed.category = insight.category
where note.insight_id = insight.id
  and insight.locale = 'en';

insert into public.destination_category_insight_notes (
  insight_id,
  note_key,
  label,
  body,
  sort_order,
  is_active,
  source_metadata
)
select
  insight.id,
  'note-' || lpad(seed.note_position::text, 2, '0'),
  seed.note_label,
  seed.note_body,
  seed.note_position * 10,
  true,
  jsonb_build_object(
    'source', 'populated_city_category_notes_20260716',
    'editorial_reference', 'city:japan:tokyo'
  )
from expanded_populated_city_category_notes seed
join public.destinations destination on destination.legacy_id = seed.destination_legacy_id
join public.destination_category_insights insight
  on insight.destination_id = destination.id
 and insight.category = seed.category
 and insight.locale = 'en'
on conflict (insight_id, note_key) do update set
  label = excluded.label,
  body = excluded.body,
  sort_order = excluded.sort_order,
  is_active = true,
  source_metadata = public.destination_category_insight_notes.source_metadata || excluded.source_metadata,
  updated_at = now();

commit;
