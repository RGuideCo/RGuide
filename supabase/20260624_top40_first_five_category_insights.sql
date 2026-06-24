-- Seed first-pass top-40 city category notes and category-level neighborhood strengths.
--
-- This extends the Tokyo category-insight prototype to the first five target
-- guide cities in the current editorial queue: Bangkok, Paris, Madrid, London,
-- and Istanbul.

with seed_neighborhoods(
  destination_legacy_id,
  parent_legacy_id,
  slug,
  name,
  country_name,
  city_name,
  latitude,
  longitude,
  description
) as (
  values
    (
      'neighborhood:thailand:bangkok:bangkok:rattanakosin',
      'city:thailand:bangkok',
      'rattanakosin',
      'Rattanakosin',
      'Thailand',
      'Bangkok',
      13.751,
      100.492,
      'The old royal island, where the Grand Palace, Wat Pho, Wat Phra Kaew, river piers, and Khao San edges make temple-heavy days feel coherent.'
    ),
    (
      'neighborhood:thailand:bangkok:bangkok:chinatown-yaowarat',
      'city:thailand:bangkok',
      'chinatown-yaowarat',
      'Chinatown & Yaowarat',
      'Thailand',
      'Bangkok',
      13.739,
      100.509,
      'The night-food furnace, built around Yaowarat Road, market lanes, gold shops, seafood counters, noodle stops, and cocktail rooms after dark.'
    ),
    (
      'neighborhood:thailand:bangkok:bangkok:sukhumvit',
      'city:thailand:bangkok',
      'sukhumvit',
      'Sukhumvit',
      'Thailand',
      'Bangkok',
      13.737,
      100.561,
      'The long hotel, mall, restaurant, and nightlife corridor, held together by the BTS and a habit of stretching plans later than expected.'
    ),
    (
      'neighborhood:thailand:bangkok:bangkok:silom-sathorn',
      'city:thailand:bangkok',
      'silom-sathorn',
      'Silom & Sathorn',
      'Thailand',
      'Bangkok',
      13.724,
      100.529,
      'A business-district pair with serious restaurants, cocktail rooms, old Bangkok lanes, Lumphini Park access, and central hotels.'
    ),
    (
      'neighborhood:thailand:bangkok:bangkok:riverside',
      'city:thailand:bangkok',
      'riverside',
      'Riverside',
      'Thailand',
      'Bangkok',
      13.728,
      100.512,
      'The Chao Phraya side of Bangkok, where ferries, temple approaches, historic hotels, warehouse districts, and skyline bars make the city feel theatrical.'
    ),
    (
      'neighborhood:thailand:bangkok:bangkok:ari',
      'city:thailand:bangkok',
      'ari',
      'Ari',
      'Thailand',
      'Bangkok',
      13.780,
      100.544,
      'A calmer Bangkok neighborhood register: cafes, small restaurants, social hostels, local bars, and leafy side streets near the BTS.'
    ),
    (
      'neighborhood:turkey:istanbul:istanbul:sultanahmet',
      'city:turkey:istanbul',
      'sultanahmet',
      'Sultanahmet',
      'Turkey',
      'Istanbul',
      41.0085,
      28.9802,
      'The imperial core, where Hagia Sophia, the Blue Mosque, Topkapi, the cisterns, and old stone streets carry the heaviest history in the city.'
    ),
    (
      'neighborhood:turkey:istanbul:istanbul:beyoglu',
      'city:turkey:istanbul',
      'beyoglu',
      'Beyoglu',
      'Turkey',
      'Istanbul',
      41.0369,
      28.9847,
      'Beyoglu is Istanbul after dark and between eras: Istiklal, Pera hotels, music rooms, meyhanes, passages, galleries, and late bars.'
    ),
    (
      'neighborhood:turkey:istanbul:istanbul:karakoy-galata',
      'city:turkey:istanbul',
      'karakoy-galata',
      'Karakoy & Galata',
      'Turkey',
      'Istanbul',
      41.0257,
      28.9745,
      'A steep harbor edge of ferries, banks, churches, boutiques, coffee, fish, cocktail rooms, and Galata Tower views.'
    ),
    (
      'neighborhood:turkey:istanbul:istanbul:kadikoy',
      'city:turkey:istanbul',
      'kadikoy',
      'Kadikoy',
      'Turkey',
      'Istanbul',
      40.9903,
      29.0275,
      'The Asian-side answer to tourist Istanbul, with market streets, casual bars, rock rooms, ferries, meze tables, and Moda walks.'
    ),
    (
      'neighborhood:turkey:istanbul:istanbul:cihangir-cukurcuma',
      'city:turkey:istanbul',
      'cihangir-cukurcuma',
      'Cihangir & Cukurcuma',
      'Turkey',
      'Istanbul',
      41.031,
      28.986,
      'A hillside pocket of cafes, antique shops, small galleries, wine bars, and apartment-window Istanbul above the Bosphorus edge.'
    ),
    (
      'neighborhood:turkey:istanbul:istanbul:besiktas-ortakoy',
      'city:turkey:istanbul',
      'besiktas-ortakoy',
      'Besiktas & Ortakoy',
      'Turkey',
      'Istanbul',
      41.043,
      29.005,
      'A Bosphorus-facing stretch where ferry traffic, palace edges, university energy, breakfast streets, waterfront bars, and Ortakoy spectacle keep Istanbul social.'
    )
)
insert into public.destinations (
  legacy_id,
  parent_id,
  slug,
  scope,
  name,
  display_name,
  continent_name,
  country_name,
  city_name,
  neighborhood_name,
  coordinates,
  description,
  metadata,
  is_published
)
select
  seed.destination_legacy_id,
  parent_destination.id,
  seed.slug,
  'neighborhood'::public.destination_scope,
  seed.name,
  seed.name,
  parent_destination.continent_name,
  seed.country_name,
  seed.city_name,
  seed.name,
  jsonb_build_array(seed.latitude, seed.longitude),
  seed.description,
  jsonb_build_object('source', 'top40_first_five_category_insight_seed', 'entityId', seed.slug),
  true
from seed_neighborhoods seed
join public.destinations parent_destination on parent_destination.legacy_id = seed.parent_legacy_id
on conflict (legacy_id) do update set
  parent_id = excluded.parent_id,
  slug = excluded.slug,
  scope = excluded.scope,
  name = excluded.name,
  display_name = excluded.display_name,
  continent_name = excluded.continent_name,
  country_name = excluded.country_name,
  city_name = excluded.city_name,
  neighborhood_name = excluded.neighborhood_name,
  coordinates = excluded.coordinates,
  description = coalesce(nullif(public.destinations.description, ''), excluded.description),
  metadata = public.destinations.metadata || excluded.metadata,
  is_published = true,
  updated_at = now();

with seed_insights(destination_legacy_id, category, label, chips, notes, sort_order) as (
  values
    (
      'city:thailand:bangkok',
      'Food',
      'Food notes',
      array['Thai', 'Street Food', 'Seafood', 'Noodles']::text[],
      '[
        {"label":"Heat","body":"Eat earlier than pride tells you; market trays, grilled things, noodles, and fruit are better before the city has fully cooked you."},
        {"label":"Neighborhoods","body":"Chinatown is night seafood, noodles, and neon; Rattanakosin is temple-route counters; Sukhumvit gives polished dinners and late backups; Ari is calmer cafe-and-neighborhood eating."},
        {"label":"Reset","body":"Use malls, boats, and 7-Eleven cold air as resets between street stops. Bangkok food is easier when comfort is part of the route."}
      ]'::jsonb,
      10
    ),
    (
      'city:thailand:bangkok',
      'Nightlife',
      'Nightlife notes',
      array['Live Music', 'Late Night', 'Rooftops']::text[],
      '[
        {"label":"Zones","body":"Sukhumvit is the broadest hotel-to-bar corridor; Silom and Sathorn are cocktail rooms and sharper dinners; Chinatown gives neon drinks after food; Ari is softer and local."},
        {"label":"Music","body":"Live music is usually a planned room, not a random stumble. Old-city bars, Sukhumvit-side rooms, and dedicated jazz or blues stops all need a quick calendar check."},
        {"label":"Altitude","body":"Rooftops are for first-drink views; street-level bars and music rooms are where the night usually gets more human."}
      ]'::jsonb,
      20
    ),
    (
      'city:thailand:bangkok',
      'Nature',
      'Nature notes',
      array['Views', 'Urban Parks', 'Waterfront', 'Gardens']::text[],
      '[
        {"label":"Water","body":"The Chao Phraya is the cleanest outdoor route: Riverside piers, temple approaches, and ferry decks give Bangkok air when traffic starts winning."},
        {"label":"Shade","body":"Silom and Sathorn work for Lumphini breaks; Ari gives smaller leafy pauses; old-city plans need shade, water, and fewer midday promises."},
        {"label":"Weather","body":"Heat and rain decide the day faster than distance. Pair open-air stops with a nearby indoor reset before the sky makes the choice for you."}
      ]'::jsonb,
      30
    ),
    (
      'city:thailand:bangkok',
      'Culture',
      'Culture notes',
      array['Architecture', 'Museums', 'Galleries', 'Historic Streets']::text[],
      '[
        {"label":"Old city","body":"Rattanakosin carries the palace and temple weight; go early, dress correctly, and leave room for a quieter stop afterward."},
        {"label":"Commerce","body":"Chinatown makes migration, trade, food, and gold-shop spectacle visible at street level; Riverside adds ferries, piers, and old hotel history."},
        {"label":"Indoors","body":"Use museums, houses, and galleries as heat breaks, not apology stops. Bangkok culture often gets clearer once the body has cooled down."}
      ]'::jsonb,
      40
    ),
    (
      'city:thailand:bangkok',
      'Stay',
      'Stay notes',
      array['Hotels', 'Hostels', 'Vacation Rentals']::text[],
      '[
        {"label":"Base","body":"Riverside is ceremony and ferry logic; Sukhumvit is convenience and late backups; Silom and Sathorn are polished central bases; Ari is calmer and more social."},
        {"label":"Comfort","body":"Pool, shade, breakfast, and rail or boat access matter more here than a slightly prettier lobby."},
        {"label":"Tradeoff","body":"Old-city stays give atmosphere but fewer easy nights. Transit-heavy bases can be less romantic and much more useful."}
      ]'::jsonb,
      50
    ),
    (
      'city:thailand:bangkok',
      'Activities',
      'Activity notes',
      array['Walking Tours', 'Shopping', 'Family Spots', 'Wellness']::text[],
      '[
        {"label":"Route","body":"Rattanakosin is temples, Chinatown is night food, Riverside is boats, Sukhumvit is shopping and nights, and Ari is the pause when the city feels too loud."},
        {"label":"Cooling","body":"One temple cluster, one meal zone, and one cool-down stop usually beats a heroic checklist."},
        {"label":"Night","body":"Bangkok gets louder and more legible after dark. Save some appetite and energy instead of spending the whole day by 4 p.m."}
      ]'::jsonb,
      60
    ),
    (
      'city:france:paris',
      'Food',
      'Food notes',
      array['French', 'Bistro', 'Bakery', 'Seafood']::text[],
      '[
        {"label":"Morning","body":"Bakeries are not filler; Montmartre, Canal Saint-Martin, and Saint-Germain all read differently before museums take over."},
        {"label":"Districts","body":"Le Marais is bistros, wine, and old streets; Saint-Germain is cafes and brasseries; Canal is casual and younger; the 1st and 7th are better for formal rooms."},
        {"label":"Dinner","body":"Reserve serious rooms, but leave space for the small bar or late glass that makes Paris feel less staged."}
      ]'::jsonb,
      10
    ),
    (
      'city:france:paris',
      'Nightlife',
      'Nightlife notes',
      array['Live Music', 'Late Night', 'Rooftops']::text[],
      '[
        {"label":"Scale","body":"Paris nightlife is usually a room, not a crawl. Pick the district and let the night stay close."},
        {"label":"Districts","body":"Le Marais is wine, cocktails, and queer bars; Canal Saint-Martin is casual bars and music; Montmartre and Pigalle carry cabaret and late energy; Saint-Germain is polished second drinks."},
        {"label":"Dinner","body":"Dinner runs the night. Drinks work best as an extension of the table, not a separate mission across town."}
      ]'::jsonb,
      20
    ),
    (
      'city:france:paris',
      'Nature',
      'Nature notes',
      array['Views', 'Urban Parks', 'Waterfront', 'Gardens']::text[],
      '[
        {"label":"Pause","body":"The 1st and 7th give Seine edges, Tuileries, and monument views; Saint-Germain and the Latin Quarter lean on Luxembourg Garden; Canal Saint-Martin is the easy waterside reset."},
        {"label":"Hill","body":"Montmartre is the view walk when timing is kind. Go morning or golden hour before the steps and souvenir traffic flatten the romance."},
        {"label":"Season","body":"Light changes everything. Gardens, cemeteries, canals, and river walks should move with the weather, not the checklist."}
      ]'::jsonb,
      30
    ),
    (
      'city:france:paris',
      'Culture',
      'Culture notes',
      array['Architecture', 'Museums', 'Galleries', 'Historic Streets']::text[],
      '[
        {"label":"Weight","body":"The 1st is Louvre and royal Paris; the 7th is monuments and museums; the Latin Quarter is academic old Paris; Le Marais gives mansion museums, Jewish history, and queer streets."},
        {"label":"Smaller rooms","body":"House museums, churches, galleries, and streets often make the big institutions easier to absorb."},
        {"label":"Pace","body":"Do not stack the Louvre, Orsay, and every monument into one obedient march. Paris culture needs a district, a pause, and a table."}
      ]'::jsonb,
      40
    ),
    (
      'city:france:paris',
      'Stay',
      'Stay notes',
      array['Hotels', 'Hostels', 'Vacation Rentals']::text[],
      '[
        {"label":"Base","body":"Saint-Germain is classic Left Bank rhythm; Le Marais is central and social; the 1st is efficient museum access; the 7th is monument polish; Canal is younger and looser."},
        {"label":"Tradeoff","body":"Central convenience costs money and calm. Outer districts can pay you back in better evenings."},
        {"label":"Sleep","body":"Charming streets are not always quiet streets. Check the night rhythm before falling for the address."}
      ]'::jsonb,
      50
    ),
    (
      'city:france:paris',
      'Activities',
      'Activity notes',
      array['Walking Tours', 'Shopping', 'Family Spots', 'Wellness']::text[],
      '[
        {"label":"Arc","body":"The 1st handles museums and gardens; Le Marais handles shops and old streets; Montmartre handles a timed hill walk; Canal works for a looser local-feeling afternoon."},
        {"label":"Reservations","body":"Timed museums and restaurant bookings should shape the day before small stops fill in."},
        {"label":"Drift","body":"Paris rewards the planned detour more than the completed checklist."}
      ]'::jsonb,
      60
    ),
    (
      'city:spain:madrid',
      'Food',
      'Food notes',
      array['Tapas', 'Spanish', 'Steakhouse', 'Seafood']::text[],
      '[
        {"label":"Clock","body":"Madrid eats late. Do not judge the room too early or force dinner into a borrowed schedule."},
        {"label":"Neighborhoods","body":"La Latina is tapas streets and tavern life; Chueca is wine-led dinners and stylish rooms; Sol is useful for old doors; Las Letras and Retiro handle polished lunches near the museum axis."},
        {"label":"Ritual","body":"Vermouth, tortillas, cod counters, market lunches, and formal dining each deserve their own lane."}
      ]'::jsonb,
      10
    ),
    (
      'city:spain:madrid',
      'Nightlife',
      'Nightlife notes',
      array['Live Music', 'Late Night', 'Rooftops']::text[],
      '[
        {"label":"Start","body":"The night can begin as a drink before dinner and still turn into the main event."},
        {"label":"Districts","body":"Chueca is stylish, social, and late; Malasana is looser bars and young energy; La Latina is tavern-led; Las Letras works when the night wants polish near dinner."},
        {"label":"Pace","body":"Madrid nights build slowly. Leave room for the second room."}
      ]'::jsonb,
      20
    ),
    (
      'city:spain:madrid',
      'Nature',
      'Nature notes',
      array['Views', 'Urban Parks', 'Waterfront', 'Gardens']::text[],
      '[
        {"label":"Retiro","body":"Retiro is the green reset after the Prado and a real planning tool, not just a park pin between museums."},
        {"label":"Air","body":"Las Letras and Retiro pair culture with shade; La Latina and Sol need plaza timing; Chueca and Malasana are better for street life than open space."},
        {"label":"Heat","body":"Summer afternoons need shade, indoor art, or a long lunch. Madrid rewards the traveler who stops pretending the sun is negotiable."}
      ]'::jsonb,
      30
    ),
    (
      'city:spain:madrid',
      'Culture',
      'Culture notes',
      array['Architecture', 'Museums', 'Galleries', 'Historic Streets']::text[],
      '[
        {"label":"Prado axis","body":"Las Letras and Retiro carry the museum triangle; Sol and Centro carry royal and civic Madrid; La Latina keeps older tavern streets in the picture."},
        {"label":"Streets","body":"Madrid culture is not only inside museums. Literary streets, plazas, markets, and taverns carry memory too."},
        {"label":"Pairing","body":"Retiro after the Prado is not a break from culture; it is part of the Madrid rhythm."}
      ]'::jsonb,
      40
    ),
    (
      'city:spain:madrid',
      'Stay',
      'Stay notes',
      array['Hotels', 'Hostels', 'Vacation Rentals']::text[],
      '[
        {"label":"Base","body":"Stay by sleep tolerance and evening plans, not only by the map center."},
        {"label":"Mood","body":"Sol is useful when the hotel protects you from noise; Chueca keeps dinner and bars close; Retiro is calmer; La Latina keeps tavern life near the door."},
        {"label":"Tradeoff","body":"Malasana is fun until it is directly under your window. Polished addresses can save more energy than they cost."}
      ]'::jsonb,
      50
    ),
    (
      'city:spain:madrid',
      'Activities',
      'Activity notes',
      array['Walking Tours', 'Shopping', 'Family Spots', 'Wellness']::text[],
      '[
        {"label":"Loop","body":"Use Las Letras and Retiro for art and air, Sol for civic Madrid, La Latina for markets and taverns, Chueca for stylish late energy, and Malasana for a looser night."},
        {"label":"Lunch","body":"A long lunch is not dead time in Madrid. It is often the hinge between museums, plazas, and a late night."},
        {"label":"Checklist","body":"Madrid works better by neighborhood rhythm than by monument collection."}
      ]'::jsonb,
      60
    ),
    (
      'city:united-kingdom:london',
      'Food',
      'Food notes',
      array['British', 'Pub Food', 'Indian', 'Seafood']::text[],
      '[
        {"label":"Scale","body":"London food is spread across villages. Pick the area before chasing the best table."},
        {"label":"Neighborhoods","body":"Soho is counter seats, Chinatown, and pre-theatre food; Shoreditch is restaurants and late bars; Brixton is market energy and Caribbean roots; South Bank works when Borough Market is part of the route."},
        {"label":"Formats","body":"Pubs, South Asian routes, modern British rooms, markets, and hotel dining belong in separate plans."}
      ]'::jsonb,
      10
    ),
    (
      'city:united-kingdom:london',
      'Nightlife',
      'Nightlife notes',
      array['Live Music', 'Late Night', 'Rooftops']::text[],
      '[
        {"label":"Pub first","body":"The pub is infrastructure, not a backup. Use it to read the neighborhood."},
        {"label":"Zones","body":"Soho is bars, queer history, jazz, and theatre spillover; Shoreditch is cocktails and clubs; Camden is live music; Brixton is late bars and gigs; Marylebone skews polished."},
        {"label":"Transit","body":"Last trains and long rides matter. Keep late plans on one line or in one pocket."}
      ]'::jsonb,
      20
    ),
    (
      'city:united-kingdom:london',
      'Nature',
      'Nature notes',
      array['Views', 'Urban Parks', 'Waterfront', 'Gardens']::text[],
      '[
        {"label":"Breathing room","body":"Westminster gives royal parks, South Bank gives the Thames spine, Camden gives canal edges, Marylebone has Regent Park close, and Hackney can loosen into markets and green space."},
        {"label":"River","body":"Use the Thames as movement, especially when the city starts feeling like separate towns stitched by the Tube."},
        {"label":"Weather","body":"Have a wet-weather version of every outdoor plan. London will test the romance."}
      ]'::jsonb,
      30
    ),
    (
      'city:united-kingdom:london',
      'Culture',
      'Culture notes',
      array['Architecture', 'Museums', 'Galleries', 'Historic Streets']::text[],
      '[
        {"label":"Clusters","body":"South Bank is performance and modern art; Westminster is ceremony; Bloomsbury is museums and books; Covent Garden is theatre; Shoreditch adds galleries and street-level contemporary culture."},
        {"label":"Free weight","body":"Major museums are generous but huge. Choose one deeply instead of collecting lobbies."},
        {"label":"Geography","body":"Group culture by area. Cross-town ambition eats the day."}
      ]'::jsonb,
      40
    ),
    (
      'city:united-kingdom:london',
      'Stay',
      'Stay notes',
      array['Hotels', 'Hostels', 'Vacation Rentals']::text[],
      '[
        {"label":"Transit","body":"The right station matters more than the prettiest postcode."},
        {"label":"Mood","body":"Soho is nightlife, South Bank is culture, Shoreditch is east-side energy, Bloomsbury is calmer central logic, and Marylebone is polished without full West End noise."},
        {"label":"Tradeoff","body":"London rewards a base with repeat usefulness. Luxury in the wrong place still wastes time."}
      ]'::jsonb,
      50
    ),
    (
      'city:united-kingdom:london',
      'Activities',
      'Activity notes',
      array['Walking Tours', 'Shopping', 'Family Spots', 'Wellness']::text[],
      '[
        {"label":"Area first","body":"South Bank handles river culture, Soho and Covent Garden handle food and theatre, Camden handles markets and music, Shoreditch handles east-side nights, and Brixton gives a different south London pulse."},
        {"label":"Mix","body":"London works when museums, food, parks, pubs, and theatre share the same route logic."},
        {"label":"Slack","body":"Leave time for transit, weather, and the useful accident."}
      ]'::jsonb,
      60
    ),
    (
      'city:turkey:istanbul',
      'Food',
      'Food notes',
      array['Turkish', 'Kebab', 'Mezze', 'Seafood']::text[],
      '[
        {"label":"Table","body":"Istanbul food is best when the meal has time: meyhane, fish, kebab, tea, sweets, and market grazing all need their own rhythm."},
        {"label":"Neighborhoods","body":"Kadikoy is market eating, meze, and a younger local appetite; Karakoy is polished lunch and fish; Beyoglu is meyhane and late tables; Sultanahmet is useful around monuments if you choose carefully."},
        {"label":"Crossing","body":"European and Asian Istanbul eat differently. Cross the water for more than the view."}
      ]'::jsonb,
      10
    ),
    (
      'city:turkey:istanbul',
      'Nightlife',
      'Nightlife notes',
      array['Live Music', 'Late Night', 'Rooftops']::text[],
      '[
        {"label":"Table first","body":"A meyhane can be the night, not just dinner before something else."},
        {"label":"Districts","body":"Beyoglu is the broadest night out, with bars, clubs, and live music; Karakoy is cocktails and pre- or post-dinner drinks; Kadikoy is casual bars, rock rooms, and a younger local night; Cihangir is wine, conversation, and a slower second drink."},
        {"label":"Water","body":"Rooftop views are tempting, but ferry timing and neighborhood choice matter more than altitude."}
      ]'::jsonb,
      20
    ),
    (
      'city:turkey:istanbul',
      'Nature',
      'Nature notes',
      array['Views', 'Urban Parks', 'Waterfront', 'Gardens']::text[],
      '[
        {"label":"Ferry","body":"The ferry is the best scenic route in Istanbul and its most useful pause. Use it between old-city weight, Kadikoy meals, and Bosphorus edges."},
        {"label":"Edges","body":"Besiktas and Ortakoy give Bosphorus air; Kadikoy and Moda give Asian-side waterfront room; Sultanahmet has Gulhane when the monuments get dense."},
        {"label":"Weather","body":"Wind, heat, and ferry schedules should shape the outdoor plan before the highlight list does."}
      ]'::jsonb,
      30
    ),
    (
      'city:turkey:istanbul',
      'Culture',
      'Culture notes',
      array['Architecture', 'Museums', 'Galleries', 'Historic Streets']::text[],
      '[
        {"label":"Layers","body":"Sultanahmet is Byzantine and Ottoman weight; Karakoy and Galata are port, banking, churches, and views; Beyoglu carries Pera, passages, galleries, and republican-era city life."},
        {"label":"Respect","body":"Mosque visits need timing, dress, and patience; they are living spaces before landmarks."},
        {"label":"Markets","body":"Bazaars are culture, commerce, and theater at once. Go with curiosity, not just a shopping list."}
      ]'::jsonb,
      40
    ),
    (
      'city:turkey:istanbul',
      'Stay',
      'Stay notes',
      array['Hotels', 'Hostels', 'Vacation Rentals']::text[],
      '[
        {"label":"Base","body":"Sultanahmet is first-time monument access; Karakoy and Beyoglu work better for food and nights; Kadikoy is brilliant if ferries are part of the plan; Besiktas is Bosphorus-facing and more residential."},
        {"label":"Crossing","body":"Staying Asian-side can be a gift or a chore. Decide whether ferry rhythm feels romantic or inconvenient for this trip."},
        {"label":"Hills","body":"Istanbul geography is physical. Check slopes, stairs, and traffic before romanticizing the address."}
      ]'::jsonb,
      50
    ),
    (
      'city:turkey:istanbul',
      'Activities',
      'Activity notes',
      array['Walking Tours', 'Shopping', 'Family Spots', 'Wellness']::text[],
      '[
        {"label":"Movement","body":"Let the day earn its crossings. Too many sides and hills in one route will grind the city down."},
        {"label":"Pairing","body":"Put major monuments early, then let markets, ferries, and tables carry the rest."},
        {"label":"Neighborhoods","body":"Sultanahmet is monuments, Karakoy and Galata are the hinge, Beyoglu is galleries and nights, Kadikoy is food and bars, and Besiktas is water-facing social Istanbul."}
      ]'::jsonb,
      60
    )
),
upserted_insights as (
  insert into public.destination_category_insights (
    destination_id,
    category,
    locale,
    label,
    sort_order,
    source_type,
    source_metadata
  )
  select
    destination.id,
    seed.category,
    'en',
    seed.label,
    seed.sort_order,
    'editorial',
    jsonb_build_object('source', 'top40_first_five_category_insight_seed')
  from seed_insights seed
  join public.destinations destination on destination.legacy_id = seed.destination_legacy_id
  on conflict (destination_id, category, locale) do update set
    label = excluded.label,
    sort_order = excluded.sort_order,
    source_metadata = public.destination_category_insights.source_metadata || excluded.source_metadata,
    is_active = true,
    updated_at = now()
  returning id, destination_id, category, locale
),
upserted_chips as (
  insert into public.destination_category_insight_chips (
    insight_id,
    chip_slug,
    label,
    filter_kind,
    filter_value,
    sort_order,
    source_metadata
  )
  select
    insight.id,
    lower(regexp_replace(chip.label, '[^a-zA-Z0-9]+', '_', 'g')),
    chip.label,
    case when insight.category = 'Food' then 'cuisine' else 'subcategory' end,
    chip.label,
    (chip.sort_order::integer * 10),
    jsonb_build_object('source', 'top40_first_five_category_insight_seed')
  from upserted_insights insight
  join public.destinations destination on destination.id = insight.destination_id
  join seed_insights seed
    on seed.destination_legacy_id = destination.legacy_id
   and seed.category = insight.category
  cross join lateral unnest(seed.chips) with ordinality as chip(label, sort_order)
  on conflict (insight_id, chip_slug) do update set
    label = excluded.label,
    filter_kind = excluded.filter_kind,
    filter_value = excluded.filter_value,
    sort_order = excluded.sort_order,
    source_metadata = public.destination_category_insight_chips.source_metadata || excluded.source_metadata,
    is_active = true,
    updated_at = now()
  returning insight_id
)
insert into public.destination_category_insight_notes (
  insight_id,
  note_key,
  label,
  body,
  sort_order,
  source_metadata
)
select
  insight.id,
  coalesce(nullif(lower(regexp_replace(note.value ->> 'label', '[^a-zA-Z0-9]+', '_', 'g')), ''), 'note_' || note.sort_order::text),
  note.value ->> 'label',
  note.value ->> 'body',
  (note.sort_order::integer * 10),
  jsonb_build_object('source', 'top40_first_five_category_insight_seed')
from upserted_insights insight
join public.destinations destination on destination.id = insight.destination_id
join seed_insights seed
  on seed.destination_legacy_id = destination.legacy_id
 and seed.category = insight.category
cross join (select count(*) from upserted_chips) chip_guard
cross join lateral jsonb_array_elements(seed.notes) with ordinality as note(value, sort_order)
where nullif(note.value ->> 'body', '') is not null
on conflict (insight_id, note_key) do update set
  label = excluded.label,
  body = excluded.body,
  sort_order = excluded.sort_order,
  source_metadata = public.destination_category_insight_notes.source_metadata || excluded.source_metadata,
  is_active = true,
  updated_at = now();

with city_sources(parent_legacy_id, source_urls) as (
  values
    (
      'city:thailand:bangkok',
      array[
        'https://www.timeout.com/bangkok/restaurants/best-restaurants-in-bangkok',
        'https://www.timeout.com/bangkok/bars/best-bars-in-bangkok',
        'https://www.timeout.com/bangkok/things-to-do/best-things-to-do-in-bangkok',
        'https://www.tourismthailand.org/Destinations/Provinces/Bangkok/219'
      ]::text[]
    ),
    (
      'city:france:paris',
      array[
        'https://www.parisjetaime.com/eng/',
        'https://www.timeout.com/paris/en',
        'https://guide.michelin.com/en/ile-de-france/paris/restaurants'
      ]::text[]
    ),
    (
      'city:spain:madrid',
      array[
        'https://www.esmadrid.com/en',
        'https://www.timeout.com/madrid',
        'https://guide.michelin.com/en/comunidad-de-madrid/madrid/restaurants'
      ]::text[]
    ),
    (
      'city:united-kingdom:london',
      array[
        'https://www.visitlondon.com/things-to-do',
        'https://www.timeout.com/london',
        'https://guide.michelin.com/gb/en/greater-london/london/restaurants'
      ]::text[]
    ),
    (
      'city:turkey:istanbul',
      array[
        'https://visit.istanbul/en/',
        'https://www.timeout.com/istanbul',
        'https://www.sehirhatlari.istanbul/en'
      ]::text[]
    )
),
strength_seed(parent_legacy_id, category, rationale, scores) as (
  values
    (
      'city:thailand:bangkok',
      'Food',
      'General food usefulness across market density, signature local meals, visitor routing, and range from street stops to planned dining.',
      '{"chinatown-yaowarat":9.5,"sukhumvit":8.7,"silom-sathorn":8.4,"rattanakosin":7.8,"riverside":7.2,"ari":7.0}'::jsonb
    ),
    (
      'city:thailand:bangkok',
      'Nightlife',
      'General nightlife strength across late streets, bars, music rooms, rooftop usefulness, and safe route concentration.',
      '{"sukhumvit":9.0,"silom-sathorn":8.6,"chinatown-yaowarat":8.0,"ari":6.7,"riverside":6.0,"rattanakosin":5.8}'::jsonb
    ),
    (
      'city:thailand:bangkok',
      'Nature',
      'Outdoor usefulness across river movement, parks, shade, viewpoints, and realistic heat management.',
      '{"riverside":8.8,"rattanakosin":7.2,"silom-sathorn":7.0,"ari":5.8,"sukhumvit":5.0,"chinatown-yaowarat":4.0}'::jsonb
    ),
    (
      'city:thailand:bangkok',
      'Culture',
      'Culture strength across temples, royal sites, museums, historic commerce, architecture, and city context.',
      '{"rattanakosin":9.6,"riverside":8.2,"chinatown-yaowarat":7.8,"silom-sathorn":6.2,"ari":5.0,"sukhumvit":4.5}'::jsonb
    ),
    (
      'city:thailand:bangkok',
      'Stay',
      'Stay usefulness across hotel depth, transit or ferry logic, comfort, and repeat access to the city.',
      '{"riverside":9.0,"sukhumvit":9.0,"silom-sathorn":8.2,"ari":7.0,"rattanakosin":6.8,"chinatown-yaowarat":5.8}'::jsonb
    ),
    (
      'city:thailand:bangkok',
      'Activities',
      'Activity strength across landmark access, markets, food routes, river movement, shopping, and route density.',
      '{"rattanakosin":9.0,"chinatown-yaowarat":8.5,"riverside":8.2,"sukhumvit":7.2,"silom-sathorn":6.8,"ari":5.8}'::jsonb
    ),
    (
      'city:france:paris',
      'Food',
      'General food usefulness across bistros, bakeries, wine bars, market streets, formal rooms, and neighborhood dining density.',
      '{"le-marais":8.6,"saint-germain-des-pres":8.4,"canal-saint-martin":8.0,"montmartre":7.6,"seventh-arrondissement":7.4,"latin-quarter":7.2,"first-arrondissement":7.0}'::jsonb
    ),
    (
      'city:france:paris',
      'Nightlife',
      'General nightlife strength across bar density, music, late usefulness, queer/social energy, and post-dinner route logic.',
      '{"le-marais":8.5,"canal-saint-martin":8.4,"montmartre":7.6,"saint-germain-des-pres":7.2,"latin-quarter":6.8,"first-arrondissement":6.0,"seventh-arrondissement":5.8}'::jsonb
    ),
    (
      'city:france:paris',
      'Nature',
      'Outdoor usefulness across gardens, Seine walks, canal edges, hill views, and open-air pauses between dense culture stops.',
      '{"seventh-arrondissement":8.5,"first-arrondissement":8.3,"saint-germain-des-pres":8.0,"canal-saint-martin":7.8,"montmartre":7.5,"latin-quarter":7.0,"le-marais":5.8}'::jsonb
    ),
    (
      'city:france:paris',
      'Culture',
      'Culture strength across museums, monuments, churches, galleries, historic streets, and district-specific memory.',
      '{"first-arrondissement":9.6,"seventh-arrondissement":9.2,"latin-quarter":8.6,"le-marais":8.4,"saint-germain-des-pres":8.2,"montmartre":7.6,"canal-saint-martin":6.5}'::jsonb
    ),
    (
      'city:france:paris',
      'Stay',
      'Stay usefulness across central access, sleep quality, neighborhood mood, dining proximity, and repeat route value.',
      '{"saint-germain-des-pres":8.7,"le-marais":8.5,"first-arrondissement":8.2,"seventh-arrondissement":7.8,"latin-quarter":7.4,"canal-saint-martin":6.8,"montmartre":6.5}'::jsonb
    ),
    (
      'city:france:paris',
      'Activities',
      'Activity strength across museum access, walking loops, shopping, views, food routes, and easy day structure.',
      '{"first-arrondissement":9.0,"le-marais":8.6,"saint-germain-des-pres":8.2,"montmartre":8.1,"latin-quarter":7.8,"seventh-arrondissement":7.8,"canal-saint-martin":7.0}'::jsonb
    ),
    (
      'city:spain:madrid',
      'Food',
      'General food usefulness across tapas streets, taverns, markets, wine-led rooms, formal dining, and late schedule fit.',
      '{"la-latina":9.0,"chueca":8.6,"sol-centro":8.2,"barrio-de-las-letras":7.8,"malasana":7.6,"retiro":6.8}'::jsonb
    ),
    (
      'city:spain:madrid',
      'Nightlife',
      'General nightlife strength across late bars, tavern density, LGBTQ and social energy, music, and second-room usefulness.',
      '{"chueca":9.2,"malasana":8.8,"la-latina":8.2,"barrio-de-las-letras":7.6,"sol-centro":7.2,"retiro":5.6}'::jsonb
    ),
    (
      'city:spain:madrid',
      'Nature',
      'Outdoor usefulness across park access, plazas, shade, museum-to-garden pacing, and summer heat relief.',
      '{"retiro":9.5,"barrio-de-las-letras":7.2,"sol-centro":5.8,"la-latina":5.5,"chueca":4.8,"malasana":4.6}'::jsonb
    ),
    (
      'city:spain:madrid',
      'Culture',
      'Culture strength across major museums, literary streets, royal-civic landmarks, historic plazas, and tavern memory.',
      '{"barrio-de-las-letras":9.0,"retiro":8.8,"sol-centro":8.4,"la-latina":7.6,"chueca":6.4,"malasana":6.2}'::jsonb
    ),
    (
      'city:spain:madrid',
      'Stay',
      'Stay usefulness across sleep quality, central access, evening proximity, neighborhood mood, and route repetition.',
      '{"chueca":8.7,"sol-centro":8.3,"retiro":8.0,"barrio-de-las-letras":7.8,"la-latina":7.2,"malasana":6.8}'::jsonb
    ),
    (
      'city:spain:madrid',
      'Activities',
      'Activity strength across museums, plazas, markets, tavern routes, shopping, and walkable district arcs.',
      '{"barrio-de-las-letras":8.8,"sol-centro":8.5,"retiro":8.4,"la-latina":8.0,"chueca":7.4,"malasana":7.2}'::jsonb
    ),
    (
      'city:united-kingdom:london',
      'Food',
      'General food usefulness across markets, pubs, South Asian routes, modern British rooms, counter dining, and neighborhood restaurant depth.',
      '{"soho":9.0,"shoreditch":8.8,"south-bank":8.5,"hackney":8.2,"brixton":8.0,"covent-garden":7.8,"marylebone":7.6,"bloomsbury":7.2,"camden":7.2,"westminster":6.5}'::jsonb
    ),
    (
      'city:united-kingdom:london',
      'Nightlife',
      'General nightlife strength across pubs, late streets, music rooms, theatre spillover, clubs, cocktail bars, and transit practicality.',
      '{"soho":9.3,"shoreditch":9.0,"camden":8.4,"brixton":8.2,"hackney":7.8,"covent-garden":7.5,"south-bank":7.0,"marylebone":6.4,"bloomsbury":6.0,"westminster":5.8}'::jsonb
    ),
    (
      'city:united-kingdom:london',
      'Nature',
      'Outdoor usefulness across royal parks, river walks, canal edges, commons, markets-to-park routes, and weatherproof backup value.',
      '{"westminster":8.7,"south-bank":8.5,"marylebone":8.0,"camden":7.8,"hackney":7.5,"bloomsbury":7.0,"brixton":6.5,"shoreditch":5.5,"covent-garden":5.0,"soho":4.5}'::jsonb
    ),
    (
      'city:united-kingdom:london',
      'Culture',
      'Culture strength across museums, theatre, royal sites, galleries, performance venues, architecture, and historic streets.',
      '{"south-bank":9.4,"westminster":9.2,"bloomsbury":8.8,"covent-garden":8.5,"soho":8.0,"marylebone":7.8,"shoreditch":7.5,"camden":7.2,"brixton":6.8,"hackney":6.5}'::jsonb
    ),
    (
      'city:united-kingdom:london',
      'Stay',
      'Stay usefulness across transit, repeat route value, hotel depth, neighborhood mood, nightlife access, and quieter central bases.',
      '{"soho":8.7,"south-bank":8.5,"covent-garden":8.3,"bloomsbury":8.0,"marylebone":8.0,"shoreditch":7.8,"westminster":7.5,"camden":6.8,"hackney":6.5,"brixton":5.8}'::jsonb
    ),
    (
      'city:united-kingdom:london',
      'Activities',
      'Activity strength across markets, museums, theatre, shopping, river walks, music nights, and neighborhood route density.',
      '{"south-bank":9.0,"westminster":8.8,"covent-garden":8.7,"soho":8.5,"camden":8.0,"shoreditch":8.0,"bloomsbury":7.5,"brixton":7.2,"marylebone":7.0,"hackney":6.8}'::jsonb
    ),
    (
      'city:turkey:istanbul',
      'Food',
      'General food usefulness across meyhane culture, markets, kebab, seafood, sweets, tea, and cross-water dining logic.',
      '{"kadikoy":9.0,"karakoy-galata":8.5,"beyoglu":8.3,"sultanahmet":7.8,"besiktas-ortakoy":7.7,"cihangir-cukurcuma":7.4}'::jsonb
    ),
    (
      'city:turkey:istanbul',
      'Nightlife',
      'General nightlife strength across meyhane evenings, casual bars, live music, cocktails, late energy, and ferry-aware route planning.',
      '{"beyoglu":9.2,"kadikoy":8.7,"karakoy-galata":8.5,"cihangir-cukurcuma":7.8,"besiktas-ortakoy":7.4,"sultanahmet":5.2}'::jsonb
    ),
    (
      'city:turkey:istanbul',
      'Nature',
      'Outdoor usefulness across ferry movement, Bosphorus edges, waterfront walks, parks, views, and weather-aware pacing.',
      '{"besiktas-ortakoy":8.8,"kadikoy":8.5,"sultanahmet":7.8,"karakoy-galata":7.2,"beyoglu":6.5,"cihangir-cukurcuma":6.0}'::jsonb
    ),
    (
      'city:turkey:istanbul',
      'Culture',
      'Culture strength across Byzantine, Ottoman, republican, religious, port, gallery, and market layers.',
      '{"sultanahmet":9.8,"karakoy-galata":8.6,"beyoglu":8.2,"besiktas-ortakoy":8.0,"kadikoy":7.0,"cihangir-cukurcuma":6.8}'::jsonb
    ),
    (
      'city:turkey:istanbul',
      'Stay',
      'Stay usefulness across landmark access, food and nightlife proximity, ferry logic, hotel depth, and hill or traffic friction.',
      '{"karakoy-galata":8.8,"beyoglu":8.4,"sultanahmet":8.0,"kadikoy":7.8,"besiktas-ortakoy":7.5,"cihangir-cukurcuma":7.2}'::jsonb
    ),
    (
      'city:turkey:istanbul',
      'Activities',
      'Activity strength across monuments, bazaars, ferries, hammams, food routes, views, and neighborhood walking loops.',
      '{"sultanahmet":9.3,"karakoy-galata":8.8,"beyoglu":8.4,"kadikoy":8.0,"besiktas-ortakoy":7.8,"cihangir-cukurcuma":7.0}'::jsonb
    )
),
expanded_strengths as (
  select
    parent_destination.id as parent_destination_id,
    neighborhood_destination.id as neighborhood_destination_id,
    strength.category,
    'default' as field_key,
    (score.value)::numeric(4,2) as score,
    strength.rationale,
    city_sources.source_urls
  from strength_seed strength
  join city_sources on city_sources.parent_legacy_id = strength.parent_legacy_id
  cross join lateral jsonb_each_text(strength.scores) as score(key, value)
  join public.destinations parent_destination on parent_destination.legacy_id = strength.parent_legacy_id
  join public.destinations neighborhood_destination
    on neighborhood_destination.legacy_id =
      replace(strength.parent_legacy_id, 'city:', 'neighborhood:')
      || ':'
      || split_part(strength.parent_legacy_id, ':', 3)
      || ':'
      || score.key
)
insert into public.destination_category_neighborhood_strengths (
  parent_destination_id,
  neighborhood_destination_id,
  category,
  field_key,
  score,
  rationale,
  source_urls,
  source_metadata
)
select
  parent_destination_id,
  neighborhood_destination_id,
  category,
  field_key,
  score,
  rationale,
  source_urls,
  jsonb_build_object('source', 'top40_first_five_category_strength_seed')
from expanded_strengths
on conflict (parent_destination_id, neighborhood_destination_id, category, field_key) do update set
  score = excluded.score,
  rationale = excluded.rationale,
  source_urls = excluded.source_urls,
  source_metadata = public.destination_category_neighborhood_strengths.source_metadata || excluded.source_metadata,
  is_active = true,
  updated_at = now();
