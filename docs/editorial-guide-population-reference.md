# Editorial Guide Population Reference

Use this when asking Codex to populate R Guide editorial lists, audit existing lists, or rewrite guide descriptions. Barcelona is the working example because the seed data already covers every app category: Food, Nightlife, Nature, Culture, Stay, and Activities.

Related source notes:

- [Restaurant research sources](restaurant-research-sources.md)
- [Stay research sources](stay-research-sources.md)

## Data Shape

Each editorial guide should follow the `MapList` shape in `src/types/index.ts`.

Required list-level fields:

- `id`: stable ID, usually `list-{city}-{neighborhood-or-scope}-{topic}`.
- `slug`: stable route slug. Keep it SEO-readable and do not churn it casually.
- `seoSlug`: reusable SEO phrase such as `best-restaurants`, `best-bars`, `best-hostels`, `best-things-to-do`, or `best-parks`.
- `seoTitle`: direct search phrase, usually `Best {Category} in {Neighborhood}, {City}`.
- `seoDescription`: concise search-facing summary with the city, category, and real selection angle.
- `title`: human-facing guide title. Make it specific, editorial, and contextual to the area. Keep the SEO/search wording out of the visible title unless it is genuinely useful to the reader.
- `description`: one-sentence guide summary explaining the list's purpose and local angle.
- `url`: Google Maps search or shared-list URL.
- `category`: one of `Food`, `Nightlife`, `Nature`, `Culture`, `Stay`, `Activities`.
- `location`: city/country/continent, optional neighborhood, `scope: "city"`.
- `creator`: matching R Guide creator for the category.
- `upvotes`: usually `0` for editorial seed lists.
- `createdAt`: ISO timestamp.
- `stops`: the selected places.
- `sources`: list-level research sources used to build or validate the guide.

Required stop-level fields:

- `id`: stable, readable place ID, usually `{neighborhood}-{place-name}`.
- `name`: current public name from official site or Google Maps.
- `coordinates`: `[latitude, longitude]`. This app uses latitude first.
- `description`: 1-3 sentences explaining why the place belongs in this exact guide.
- `hours`: verified from Google Maps, official site, or venue platform. Use structured day keys when possible.

Conditional stop-level fields:

- `price`: use for restaurants, bars, hotels, hostels, and paid experiences when useful. Allowed values are `$`, `$$`, `$$$`.
- `priceSource`: cite the source behind the price tier, such as `MICHELIN Guide / Google Maps`.
- `places`: nested places only when a stop represents a larger area or itinerary cluster.

Every location should include:

- Current existence and current name.
- Accurate coordinates.
- Neighborhood fit.
- Why it is worth a saved-map spot.
- Best-use context: who it is for, when to go, or how it fits a route.
- Price tier when money meaningfully affects the user's decision.
- Hours or schedule caveat.
- At least two supporting sources unless it is an official landmark, official park, or user-provided personal guide.

## Selection Standard

Use a source-backed editorial standard, not a generic "top-rated" standard.

- Prefer places supported by at least two independent sources.
- At least one source should be official, editorial, expert, or a high-confidence platform with current details.
- Use Google Maps for existence, coordinates, recent review pattern, hours, and closure warnings.
- Use official venue/property pages for names, ticketing posture, amenities, and schedule details.
- Replace weak picks when recent sources show closure, poor value, tourist-trap patterns, safety concerns, or a mismatch with the guide audience.
- For citywide rollups, pull the strongest neighborhood picks together. Do not build citywide lists as disconnected search-result lists.

## SEO Names vs Guide Names

Keep search fields stable and generic; make visible guide copy editorial.

- `slug`, `seoSlug`, `seoTitle`, and `seoDescription` should stay keyword-forward so Google can still understand queries like `best dive bars`, `best restaurants`, `best hostels`, or `best things to do`.
- The visible `title` should not simply repeat the SEO phrase or city name. Use a memorable guide name that reflects the neighborhood, route, scene, cuisine, or trip use case.
- Avoid putting the city name in a visible `title` when the page context already shows the city. Use it only when there is a real disambiguation need.
- Neighborhood titles should feel local: reference the old-city lanes, market, waterfront, hill, plaza culture, nightlife strip, architecture grid, or other place-specific context.
- Citywide rollup titles should communicate selection logic: cross-town essentials, counter meals, late-night rooms, hostel bases, museum spine, weekend route, etc.
- List descriptions should be more than a category label. Name the geography, the reason this guide exists, the kind of stops included, and the best-use context.
- Do not change SEO fields just because the visible title changes. Preserve indexed routes unless there is a clear product or SEO reason to migrate them.

Good pattern:

```text
seoTitle: Best Dive Bars in Barcelona
title: Cellars, Counters, and Late-Night Regulars
description: Low-key drinking rooms pulled from the strongest neighborhood guides, favoring bodegas, cava counters, old taverns, and music-adjacent bars over polished cocktail destinations.
```

## Barcelona Category Examples

Use these Barcelona guides as examples of how to structure other cities.

### Nature

Barcelona example:

- `list-barcelona-top-parks`
- Title: `Green Escapes and Hilltop Views`
- Angle: landmark parks, historic gardens, hilltop viewpoints, architecture, and city panoramas.

Barcelona source stack:

- Turisme de Barcelona parks and gardens: https://www.barcelonaturisme.com/wv3/en/page/32/parks-and-gardens.html
- Ajuntament de Barcelona parks directory: https://ajuntament.barcelona.cat/ecologiaurbana/en/services/the-city-works/parks-and-gardens
- Lonely Planet Barcelona parks: https://www.lonelyplanet.com/articles/best-parks-barcelona
- Time Out Barcelona parks: https://www.timeout.com/barcelona/things-to-do/best-parks-in-barcelona
- Conde Nast Traveler Barcelona destination coverage: https://www.cntraveler.com/destinations/barcelona
- Park Guell official: https://parkguell.barcelona/en
- UNESCO Works of Antoni Gaudi: https://whc.unesco.org/en/list/320
- Google Maps: https://maps.google.com
- Tripadvisor Barcelona parks: https://www.tripadvisor.com/Attractions-g187497-Activities-c57-Barcelona_Catalonia.html

For other cities, look for:

- Official tourism board parks, gardens, viewpoints, beaches, trails, and public-space pages.
- City government park directories.
- National park, regional park, botanical garden, or conservancy pages.
- UNESCO pages when applicable.
- Editorial travel guides for what visitors actually save.
- Google Maps and Tripadvisor for current access, review patterns, and closure flags.

### Food

Barcelona examples:

- `list-barcelona-gothic-quarter-restaurants`
- `list-barcelona-el-born-restaurants`
- `list-barcelona-eixample-restaurants`
- `list-barcelona-gracia-restaurants`
- `list-barcelona-poble-sec-restaurants`

Barcelona writing angles:

- Avoid tourist-trap old-city filler.
- Mix classics, modern rooms, counters, destination meals, casual anchors, and neighborhood-specific dining rhythms.
- Explain the use case: quick tapas stop, special reservation, group-friendly room, wine-led dinner, market-adjacent meal.

Barcelona source stack:

- Eater Barcelona: https://www.eater.com/maps/best-restaurants-barcelona-spain
- Eater Old City/Gothic Quarter: https://www.eater.com/maps/barcelona-old-city-gothic-quarter-best-restaurants
- The Infatuation Barcelona: https://www.theinfatuation.com/barcelona/guides/best-restaurants-hotels-barcelona
- The Infatuation El Born: https://www.theinfatuation.com/barcelona/neighborhoods/el-born
- Time Out Barcelona restaurants: https://www.timeout.com/barcelona/restaurants
- MICHELIN Guide Barcelona: https://guide.michelin.com/us/en/catalunya/barcelona/restaurants
- Tripadvisor Barcelona restaurants: https://www.tripadvisor.com/Restaurants-g187497-Barcelona_Catalonia.html
- Google Maps: https://maps.google.com
- Resy Barcelona: https://resy.com/cities/barcelona
- TheFork Barcelona: https://www.thefork.com/restaurants/barcelona-c41710
- World's 50 Best Discovery: https://www.theworlds50best.com/discovery/

For other cities, start with `docs/restaurant-research-sources.md`, then add city-specific local food media. Strong food descriptions should name the source-backed reason the place belongs, the meal format, the room/scene, and the value tradeoff.

### Culture

Barcelona examples:

- `list-barcelona-gothic-quarter-culture`
- `list-barcelona-el-born-culture`
- `list-barcelona-eixample-culture`
- `list-barcelona-gracia-culture`
- `list-barcelona-poble-sec-culture`
- `list-barcelona-citywide-culture`

Barcelona source stack:

- Barcelona Turisme: https://www.barcelonaturisme.com
- Official museum and landmark sites, such as Fundacio Joan Miro: https://www.fmirobcn.org
- UNESCO Works of Antoni Gaudi: https://whc.unesco.org/en/list/320
- Casa Batllo official: https://www.casabatllo.es
- Casa Mila official: https://www.lapedrera.com
- Sagrada Familia official: https://sagradafamilia.org
- Museu Picasso official: https://museupicassobcn.cat
- MUHBA official: https://www.barcelona.cat/museuhistoria
- Time Out Barcelona things to do: https://www.timeout.com/barcelona/things-to-do
- Lonely Planet Barcelona: https://www.lonelyplanet.com/spain/barcelona
- Google Maps: https://maps.google.com

For other cities, look for:

- Official tourism pages for museums, landmarks, historic districts, architecture, and major festivals.
- Official museum/landmark pages for hours, tickets, and current names.
- UNESCO pages for heritage claims.
- Local cultural institution pages.
- Editorial travel sources to understand which stops are truly useful to visitors.

Culture writing should explain the historical or artistic role of the place and how it fits the neighborhood route. Avoid empty praise like "must-see" unless the source-backed importance is stated.

### Stay

Barcelona examples:

- Neighborhood hotel/stay lists: Gothic Quarter, El Born, Eixample, Gracia, Poble-sec.
- Hostel lists: citywide plus neighborhood hostels.

Barcelona source stack:

- Hostelworld Barcelona: https://www.hostelworld.com/st/hostels/europe/spain/barcelona/
- Google Travel / Google Maps: https://maps.google.com
- Booking.com Barcelona: https://www.booking.com/city/es/barcelona.html
- Tripadvisor Barcelona hotels: https://www.tripadvisor.com/Hotels-g187497-Barcelona_Catalonia-Hotels.html
- Official property websites.
- Time Out Barcelona hotels: https://www.timeout.com/barcelona/hotels
- Conde Nast Traveler Barcelona hotels: https://www.cntraveler.com/gallery/best-hotels-in-barcelona
- The Infatuation Barcelona hotel context: https://www.theinfatuation.com/barcelona/guides/best-restaurants-hotels-barcelona

For other cities, start with `docs/stay-research-sources.md`. Stay descriptions should make the tradeoff explicit: location, sleep style, room type, social energy, quietness, design, value, and transit fit.

### Nightlife

Barcelona examples:

- Dive/low-key bar lists by neighborhood.
- Popular bar lists by neighborhood.
- Citywide dive bars and citywide popular bars.

Barcelona source stack:

- Time Out Barcelona bars: https://www.timeout.com/barcelona/bars-and-pubs
- Time Out best bars: https://www.timeout.com/barcelona/bars-and-pubs/best-bars-in-barcelona
- World's 50 Best Bars: https://www.worlds50bestbars.com
- The Infatuation Barcelona: https://www.theinfatuation.com/barcelona
- Eater Barcelona: https://www.eater.com/maps/best-restaurants-barcelona-spain
- Resident Advisor Barcelona events: https://ra.co/events/es/barcelona
- Official venue/bar sites.
- Instagram geo-tags and venue accounts.
- Google Maps: https://maps.google.com
- Tripadvisor Barcelona nightlife: https://www.tripadvisor.com/Attractions-g187497-Activities-c20-Barcelona_Catalonia.html

Nightlife source requirements:

- Every R Guide nightlife list needs 5+ list-level sources before publication.
- The 5+ sources must be meaningfully varied. Do not count five pages from the same publisher as five independent signals.
- Use at least one neighborhood-specific source for neighborhood nightlife lists when one exists.
- Use at least one official venue/bar source for popular bars, clubs, live-music rooms, cabaret rooms, or high-demand cocktail destinations.
- Use at least one map/platform source for current operating confidence, but do not let platform ratings alone choose the list.
- Check for closure signals before saving a stop. If a source marks a place closed, remove or replace it unless a newer official source proves it has reopened.
- If a guide title is neighborhood-specific, every stop should be in that neighborhood or directly on its edge with the description explaining the edge case.
- When stronger current sources surface better picks, replace weak or out-of-neighborhood stops rather than only adding sources.

Barcelona neighborhood source packs:

- Eixample: Time Out Eixample/bar pages, Condé Nast Traveler bar reviews, World's 50 Best Bars, Sips official, Ajuntament de Barcelona listings, The Infatuation, National Geographic vermouth coverage, Google Maps.
- El Born: Time Out El Born bars, World's 50 Best Bars, Paradiso official, Condé Nast Traveler Paradiso, The Infatuation Barcelona bars, Lonely Planet bars, neighborhood nightlife guides, Google Maps.
- Gothic Quarter: Time Out Gothic Quarter bars, Jamboree official, Barcelona.cat/Jamboree, Culture Trip Gothic bars, ShBarcelona Gothic bars, Barcelona Secreta/Jamboree, Google Maps.
- Gràcia: Time Out Gràcia bars, Lonely Planet Gràcia bars, Bobby Gin official, Old Fashioned official, Condé Nast Traveler Old Fashioned/Barcelona bars, Fem Gràcia, Barcelona Urbana gin-bar coverage, Google Maps.
- Poble-sec: Time Out Poble-sec bars, Sala Apolo official, Tinta Roja official, Bodega Saltó official, Quimet & Quimet official, Barcelona Food Experience, Barcelona Urbana Poble-sec guide, Barcelona city listings, Google Maps.
- Citywide Barcelona nightlife: World's 50 Best Bars, Resident Advisor events, Time Out best bars, Condé Nast Traveler best bars, official venue/bar sites, Barcelona Turisme, Google Maps, and neighborhood source packs from the included stops.

For other cities, separate:

- Low-key bars: bodegas, pubs, neighborhood taverns, wine bars, dive bars, casual cocktail rooms.
- Popular bars: destination cocktail bars, clubs, rooftops, music venues, high-demand social rooms.

Nightlife descriptions should name the energy level, crowd, likely wait/booking posture, and best night use. Do not describe a packed cocktail destination like a hidden local dive.

### Activities

Barcelona examples:

- `list-barcelona-one-day-activities`
- `list-barcelona-weekend-activities`
- `list-barcelona-week-activities`

Barcelona source stack:

- Barcelona Turisme: https://www.barcelonaturisme.com
- Google Maps: https://maps.google.com
- Time Out Barcelona things to do: https://www.timeout.com/barcelona/things-to-do
- Lonely Planet Barcelona: https://www.lonelyplanet.com/spain/barcelona
- Conde Nast Traveler Barcelona: https://www.cntraveler.com/destinations/barcelona
- Eater Barcelona: https://www.eater.com/maps/best-restaurants-barcelona-spain
- The Infatuation Barcelona: https://www.theinfatuation.com/barcelona/guides/best-restaurants-hotels-barcelona
- MICHELIN Guide Barcelona: https://guide.michelin.com/us/en/catalunya/barcelona/restaurants
- Hostelworld Barcelona: https://www.hostelworld.com/st/hostels/europe/spain/barcelona/

For other cities, build Activities lists from the strongest vetted picks in Food, Nightlife, Nature, Culture, and Stay. Activities should feel like a route or itinerary, not a random attraction dump.

## Descriptive Writing Reference

R Guide descriptions should be practical, source-aware, and editorial. The tone is confident but not inflated.

List descriptions:

- Use the same elevated editorial style as city and neighborhood descriptions. One sentence can work for very compact guides, but two sentences are preferred when the guide card has room.
- Explorer city/category description cap: 320 characters. Write city intro and category intro copy so the useful meaning fits inside that limit.
- Aim for 220-320 characters. Get close to the cap when it helps the card feel balanced, but do not pad.
- The first sentence should name the geography and the distinctive reason the list exists.
- The second sentence should explain the best-use context: when to use the guide, what kind of night/day it solves, or what tradeoff it makes.
- For neighborhood guides, make the list description feel local to that neighborhood rather than only naming the category.
- For citywide guides, explain the selection logic across neighborhoods instead of sounding like a generic "best of" bucket.
- Avoid generic claims like "something for everyone."
- Avoid keyword chains. Fewer details with stronger editorial meaning are better than a list of every possible stop type.

City descriptions:

- Use the same 320-character explorer cap, and aim close to the cap without padding. A practical target is 270-320 characters.
- Prefer two sentences. The first sentence should establish the city's specific travel identity; the second should explain how the city works as a route, base, or browsing experience.
- Keep the voice punchy and descriptive, not like a string of category keywords. Name fewer things, but make the chosen details carry more local meaning.
- Avoid ending city descriptions with generic utility copy like `Use it for food, nightlife, stays...`.
- Avoid long inventory chains such as `museums, wine bars, hotels, parks, markets, cafes, galleries...` unless the rhythm has a clear editorial point.
- Preserve distinctive style by writing to the city's geography and pacing: district logic, transit, late nights, waterfronts, mountains, old-city lanes, market culture, hotel-base tradeoffs, or day-trip pressure.
- Every city description should be readable in the explorer card without linebreak tricks. Do not add manual line breaks to fill the card height.

Good city pattern:

```text
Berlin is a spread-out capital where Cold War memory, museum corridors, canal neighborhoods, and club culture sit beside practical transit choices. It works best when the route is split by district, with parks, lakes, late rooms, and quiet wine bars giving each day its own temperature.
```

Neighborhood descriptions:

- Use the same 320-character explorer cap and aim for the same 270-320 character band when the copy appears in the explorer panel.
- Prefer two sentences: one sentence for what makes the neighborhood distinct, and one sentence for how it works as a route, base, or timing choice.
- Be quite specific to the neighborhood. Name the street pattern, anchor institution, market, nightlife strip, waterfront, park edge, old-city role, transit logic, or local dining rhythm that makes it different from nearby areas.
- Avoid generic phrases like `key neighborhood`, `local character`, `everyday favorites`, or `strong guide-building potential` unless they are replaced with concrete local detail.
- Neighborhood copy should not merely repeat the city description at smaller scale. It should explain why this pocket deserves its own saved-map view.

Good neighborhood pattern:

```text
Kreuzberg is Berlin's canal-and-counterculture district, shaped by Turkish food, street art, market halls, bars, and a stubbornly independent day-to-night rhythm. It works best on foot, moving from Kottbusser Tor and the Landwehr Canal toward dinner, drinks, and small stops that feel more local than polished.
```

Country descriptions:

- Use the same 320-character explorer cap as city and category intro copy.
- Country descriptions can stay slightly more summary-driven than city descriptions, but should still name real travel dimensions rather than generic identity claims.
- When a country has curated city coverage, name the strongest anchor cities or capital-region coverage.
- When fuller guide coverage is not available yet, make the description honest by saying coverage starts with the capital or seed regions, then expands into practical regional routes.
- Include useful travel dimensions rather than generic identity claims: food, nightlife, nature, culture, stays, activities, rail/road/ferry routing, coast, mountains, islands, heritage cities, or regional loops.
- Keep the description readable as app copy; do not write tourist-board slogans or unsupported superlatives.

Good pattern:

```text
Gothic Quarter restaurants that avoid the old-town tourist trap pattern, from historic Catalan dining rooms to tight modern tasting menus.
```

Good country pattern:

```text
Spain is a high-variety destination where late-night cities, island routes, mountain interiors, and Atlantic-Mediterranean coasts shape the trip. Use it for food, nightlife, nature, culture, stays, and activities across Barcelona, Madrid, and regional loops.
```

Stop descriptions:

- Lead with why this stop is included.
- Add the concrete thing a visitor will experience.
- Add a useful caveat, timing note, or audience fit when relevant.
- Keep most stops to 1-3 sentences.

Good Food pattern:

```text
Bar La Plata earns its spot through longevity, traveler-review consistency, and a menu that has stayed intentionally short since 1945. The value is the whole old-tavern package: fried fish, tomato salad, butifarra, house wine, fast counter service, and a room that still feels local despite being deep in the Gothic Quarter.
```

Good Culture pattern:

```text
MUHBA Placa del Rei gives the old-city portion historical depth instead of letting the Gothic Quarter become only atmosphere. The underground Roman route and palace context make Barcelona's layers easier to read for the rest of the week.
```

Good Stay pattern:

```text
Use Yeah Barcelona as the hostel-category base for a week because the location works for Eixample, Gracia, and Sagrada Familia while the social programming helps longer-stay travelers find plans without depending on random bar crawls.
```

Avoid:

- Unsupported superlatives.
- Vague mood words without evidence.
- Copying source phrasing.
- Descriptions that only repeat the category.
- Tourist-board language that sounds like a brochure.
- "Hidden gem" unless the place is genuinely under-covered.

Useful sentence frames:

- `{Place} earns its spot because {source-backed reason}, with {specific experience} and {best-use context}.`
- `{Place} is the {role} in this list: {format/scene}, {neighborhood fit}, and {caveat}.`
- `Use {Place} when {traveler scenario}; it works especially well for {timing/route/audience}.`
- `{Place} gives the route {contrast or purpose}, making it useful before/after {nearby plan}.`

## Prompt Templates

Use these when asking Codex to populate or change guides.

### Populate A New City

```text
Populate editorial guides for {City}, {Country} using docs/editorial-guide-population-reference.md as the standard and Barcelona as the example.

Please:
- Research current sources for Food, Nightlife, Nature, Culture, Stay, and Activities.
- Build neighborhood-level guides where the city has strong neighborhoods, plus citywide rollups where useful.
- Include list-level sources for every guide.
- Include stop IDs, names, coordinates in [latitude, longitude], descriptions, hours, price, and priceSource where relevant.
- Use the existing R Guide writing style: practical, source-backed, specific, and not generic.
- Keep SEO fields stable and keyword-forward.
- Update src/data/lists.ts and regenerate supabase/editorial-guides.sql.
- Run the relevant validation/build command.
```

### Populate One Category

```text
Populate {Category} guides for {City}, {Country}.

Use docs/editorial-guide-population-reference.md and the Barcelona {Category} examples as the model. Research current official, editorial, platform, and map sources. For each guide, include sources, accurate coordinates, hours, and category-specific context. Update src/data/lists.ts, regenerate supabase/editorial-guides.sql, and run validation/build.
```

### Rewrite Descriptions Only

```text
Rewrite the descriptions for {City} {guide/category/neighborhood}.

Keep the existing stops, slugs, IDs, coordinates, sources, prices, and hours unless you find a clear factual issue. Use docs/editorial-guide-population-reference.md for the R Guide writing style. Make each description more specific about why the stop belongs, what the visitor experiences, and any useful caveat or best-use context.
```

### Audit Existing Guides

```text
Audit the existing {City} editorial guides against docs/editorial-guide-population-reference.md.

Check for stale places, weak sources, missing coordinates/hours/prices, generic descriptions, neighborhood mismatches, and source gaps. Tell me the issues first, then patch the guides if the fixes are straightforward. Regenerate supabase/editorial-guides.sql after changes.
```

### Add A Personal Or Submitted Guide

```text
Add this submitted guide to R Guide: {paste places or shared Google Maps list}.

Use the user's provided source as the primary source. Add coordinates, concise descriptions, and location metadata. Mark it as a submitted guide if appropriate. Preserve the user's intent, but clean up names and descriptions so the guide fits the app.
```

## Working Checklist

Before changing data:

- Read `src/types/index.ts` and `src/data/lists.ts`.
- Check existing guides for the target city or category.
- Use Barcelona guides in `src/data/lists.ts` as the nearest pattern.
- Gather sources before writing descriptions.

While populating:

- Confirm every stop exists.
- Confirm coordinates and neighborhood.
- Confirm hours or mark schedule caveats.
- Add price and `priceSource` for paid categories.
- Keep descriptions specific to the list, not generic to the place.
- Add list-level `sources`.

After editing:

- Regenerate `supabase/editorial-guides.sql` with `npm run` or the existing export script if needed.
- Run build or the narrowest available validation command.
- Summarize what changed and any sources that were weak, blocked, or need future review.
