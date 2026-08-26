# New Guide Population Runbook

Use this runbook whenever an agent creates or materially rewrites R Guide editorial guides. The goal is to stop fast, generic guide passes from reaching Supabase. A guide is not complete until the research, local data, normalized publish, R2 ingestion, and rendered payload checks all pass.

For category writing standards and city examples, also read `docs/editorial-guide-population-reference.md`.

For the one-file prompt card Brandon can reference directly, use `docs/populate-guide-agent-short-prompt.md`. For the reusable template and dispatch rules behind that short prompt, see `docs/agent-guide-population-prompts.md`.

## Required Agent Prompt

Use this prompt as the standard wrapper for a new guide task:

```text
Populate {City}, {Country} guides by following docs/new-guide-population-runbook.md exactly.

Do not edit guide files until Stage 1 and Stage 2 are complete.
Do not publish until the local guide data passes verification.
Do not call the task complete until R2 ingestion and rendered payload verification pass.
Citywide guides must have at least 10 top-level stops, and every real stop must have real source-backed hours or a named schedule caveat.

Target scope:
- {describe city/category/neighborhood/guide set}

Final report must include:
- guides created or updated
- source count per guide
- source ledger notes and weak/blocked sources
- destination left-panel image result when added or replaced
- R2 ingestion result
- verification command output summary
- any stops needing manual editorial review
```

## Stage 0: Bootstrap And City Image Audit

Locate `src/data/guides/{city-id}.ts`. Create and register a missing city module using the repository's existing guide registry pattern, but do not add substantive guide data before Stage 1 and Stage 2 are complete.

When the city has not previously been populated, inspect the image currently shown in its left panel as part of bootstrap. Check both the canonical destination row and the rendered app state. Classify the image as one of:

- credible city-specific image;
- missing;
- generic or unrelated image;
- placeholder or fallback artwork.

An existing image URL is not enough. The image must visibly depict the correct city and be suitable as the city's primary destination image. Record a required destination-image remediation when it is missing or fails this quality check. Perform the actual reviewed R2 replacement after normalized publication, when the city is linked to published entries.

## Stage 1: Source Ledger

Create a source ledger before writing guide copy. Do not skip this stage.

For every guide, collect at least 10 meaningful list-level sources in `sources`. The source set should include:

- one top search-result-style editorial source for the guide type, such as `best food in {City}`, `best hostels in {City}`, or `best cocktail bars in {City}`;
- official venue/property/attraction pages for selected stops when available;
- Google Maps or another current map/platform source for open status, coordinates, hours, and closure warnings;
- category-specific sources such as MICHELIN, Eater, The Infatuation, Time Out, Conde Nast Traveler, Hostelworld, Booking.com, official tourism boards, official museum pages, official park pages, or current local media.

For every stop, store source evidence on the stop itself:

```ts
sourceUrls: [
  "https://official-site.example/venue",
  "https://maps.google.com/...",
  "https://editorial-source.example/review"
],
sourceEvidence: {
  officialUrl: "https://official-site.example/venue",
  mapUrl: "https://maps.google.com/...",
  editorialUrls: ["https://editorial-source.example/review"],
  imageSourceUrl: "https://official-site.example/image-source-page",
  checkedAt: "2026-05-28"
}
```

Use `officialUrl`, `bookingUrl`, `priceSource`, `imageSourceUrl`, `cuisineTypes`, `musicGenres`, `attributeTags`, `foodServiceType`, `nightlifeType`, and `lodgingType` where applicable. The verifier reads these fields.

## Stage 2: Candidate Selection

Before writing final guide data, propose the stop set and remove weak picks.

Every candidate needs:

- current public name;
- category and subcategory;
- neighborhood fit;
- coordinates in `[latitude, longitude]`;
- current open-status evidence;
- verified hours source and the exact `hours` value to write, either structured day/time hours or a source-backed caveat naming the schedule dependency;
- official URL where available;
- map/current-status URL;
- image source candidate URL;
- at least two supporting source URLs;
- the source-backed offering or distinction that qualifies it for the guide;
- caveats such as booking need, price tier, crowd, timing, access, or audience fit.

Reject:

- permanently closed or unclear-status places;
- duplicate-location bundles pretending to be one POI;
- random tourist-trap filler;
- places with weak source support when stronger current alternatives exist;
- hotel and hostel stops mixed into the same Stay guide;
- photos that are logos, favicons, generic stock placeholders, parked domains, or unrelated search thumbnails.

## Stage 3: Write Local Guide Data

Edit only the matching city module under `src/data/guides/{city-id}.ts`. Add a new city module and register it in `src/data/guides/index.ts` only when the city does not exist yet.

Each guide needs:

- stable `id` and `slug`;
- explicit canonical SEO fields: `seoSlug`, `seoTitle`, and `seoDescription`;
- editorial visible `title`;
- source-backed `description`;
- correct `category`;
- `sources` with at least 10 meaningful URLs for new guide work;
- stops with stable ids, coordinates, descriptions, hours, source evidence, category-specific classification fields, and image source fields.

Citywide stop minimum:

- every citywide guide must contain at least 10 top-level stops;
- this applies to Food, Stay, Nightlife, Culture, and Activities citywide guides;
- do not pad with weak duplicate stops, bundled multi-location stops, permanently closed places, or POIs that belong in another category;
- use fewer than 10 only when the user explicitly requested a smaller scoped guide, such as one neighborhood, one micro-category, or a repair to an existing guide.

Canonical SEO URL rules:

- `slug` is internal/legacy identity.
- `seoSlug` is the public URL slug and must be written explicitly.
- Citywide guides resolve to `/city/{city}/{category}/{seoSlug}`.
- Neighborhood guides resolve to `/city/{city}/{neighborhood}/{category}/{seoSlug}`.
- Never use `citywide`, `top-10`, `list-`, or duplicated city names in `seoSlug`.
- Do not create URLs like `/city/barcelona/food/best-restaurants-citywide`, `/city/barcelona/barcelona-best-restaurants`, or `/city/barcelona/list-barcelona-citywide-dining`.
- Use clean search-intent slugs such as `best-restaurants`, `best-cheap-eats`, `best-hotels`, `best-hostels`, `best-bars`, `best-dive-bars`, `best-cocktail-bars`, `best-rooftop-bars`, `best-culture`, `best-museums-and-cultural-stops`, `best-parks`, and `best-things-to-do`.
- If multiple guides in the same city, neighborhood, and category would produce the same `seoSlug`, make the `seoSlug` more specific.
- Directly opening a canonical guide URL must expand that exact guide.
- Legacy/internal URLs should redirect to the clean canonical URL when possible.
- Only canonical SEO URLs should be added to the sitemap.

Good examples:

```ts
seoSlug: "best-restaurants"
seoTitle: "Best Restaurants in Barcelona"
seoDescription: "Best restaurants in Barcelona for tapas, seafood, tasting menus, neighborhood dining, and local favorites."
```

Bad examples:

```ts
seoSlug: "best-restaurants-citywide"
seoSlug: "barcelona-best-restaurants"
seoSlug: "list-barcelona-citywide-dining"
```

Description rules:

- write 1-3 fact-first sentences per stop, usually 25-80 words; a concrete 16-24 word sentence is acceptable, and padding to hit a target is not;
- use facts from the venue/property/official/source pages;
- lead with what the venue cooks, pours, plays, exhibits, stages, rents, or provides;
- name the source-backed draw: dish, technique, music programming, room, collection, amenities, crowd, price tradeoff, booking posture, view, or design;
- add a caveat only when it materially changes the visit, such as a reservation, queue, door policy, event calendar, accessibility issue, seasonal opening, or room/noise tradeoff;
- apply the transcript-derived voice method in `docs/editorial-guide-population-reference.md`: concrete observation, human stakes, fact-backed contradiction, clear judgment, and practical accuracy without imitating a host persona;
- do not use generic keyword chains, tourist-board wording, repeated sentence frames, or phrases like `hidden gem`, `must-see`, or `something for everyone`;
- do not use selection-role or itinerary filler such as `the pick`, `the stop`, `earns its spot`, `belongs in this guide`, `gives the route`, `anchors the day`, `use it before/after`, or `the night needs`;
- hard-ban itinerary choreography such as `pair it with`, `pair this with`, `follow it with`, `start here`, `end here`, `save this for later`, `make this your first/last stop`, `sets the pace`, `keeps the day/night moving`, `works well before/after`, or `the perfect follow-up`;
- run the four-pass fact/judgment/decision/swap test from the copy reference; if a different venue name can replace the real one without breaking the sentence, rewrite or delete it;
- for memorials, conflict, atrocity, and disaster sites, name the physical evidence, responsible system, and human stakes precisely; do not turn suffering into mood or use victims as material for wit;
- keep source support, review patterns, map evidence, and selection rationale in evidence fields rather than narrating them in the public description;
- when the same venue appears in two guides, keep its factual core consistent and add guide-specific copy only when it explains a genuinely different use; do not manufacture variation.

Hours rules:

- every real venue stop must have a non-empty `hours` field before publish;
- verify hours from the official site, a booking platform, an official calendar, or another source-backed current-status page first;
- use Google Maps/Places only as a capped last-resort fallback when official/property/booking/calendar sources do not expose usable hours;
- use structured day keys where possible;
- use `mon` through `sun` keys whenever hours differ by weekday; the UI selects the current weekday only from these structured keys and does not infer today's hours from weekday prose packed into `default`;
- use `{ default: "..." }` only for one schedule that applies independently of weekday, a genuinely schedule-driven caveat, or an exact month-range summary;
- for exact month-range summaries, keep every segment parseable and month-led, for example `Jan-Mar daily 7:00 AM-8:00 PM; Apr daily 7:00 AM-10:00 PM; May-Sep daily 7:00 AM-11:00 PM; Oct-Dec daily 7:00 AM-8:00 PM`; the renderer selects only the active month segment;
- never flatten a weekday-varying schedule into one `default` sentence merely to satisfy the non-empty-hours check;
- use a schedule caveat only when hours are genuinely event-dependent, seasonal, weather-dependent, or unavailable from reliable sources, and make the caveat source-backed;
- do not use vague placeholders like `Hours vary`, `verify current hours`, `confirm before going`, `current-status evidence is map-based`, or `open and active in the current source set`;
- if hours truly vary, the caveat must name the exact dependency and source, such as the official calendar, booking page, show schedule, market-day schedule, weather policy, seasonal opening, or property page;
- do not publish if any stop is missing `hours`; fix the guide data first;
- persist venue-level hours through the normalized publisher into `venue_hours`/`venue_special_hours` or `venues.hours_note`;
- treat `venue_hours`/`venue_special_hours`/`venues.hours_note` as the live source of truth after publish;
- use `entry_stops.hours` only as an import/display fallback, not as the final place to maintain shared venue facts.

Google fallback rules:

- do not call Google Places while drafting if official/source-backed hours are available;
- after publishing, run `npm run report:venue-hours -- {city-slug} --rendered-bad`;
- use `npm run ingest:venue-hours-google -- --city {city-slug} --plan-only` to preview candidate venues without making Google requests;
- only if the report still shows missing or placeholder canonical hours, run `npm run ingest:venue-hours-google -- --city {city-slug} --limit 25`;
- the Google fallback writes to canonical `venue_hours`/`venues.hours_note`, records the Google place id in `venue_external_refs`, refreshes affected `entry_render_cache` rows, and logs every Google request in `external_api_usage_events`;
- respect `GOOGLE_PLACES_DAILY_LIMIT` and `GOOGLE_PLACES_MONTHLY_LIMIT`; do not bypass them for normal population.

Category requirements:

- Food stops need `foodServiceType`, `cuisineTypes`, price where useful, `priceSource`, and searchable `attributeTags`.
- Nightlife stops need `nightlifeType`, `musicGenres` where relevant, price where useful, and searchable `attributeTags`.
- Stay guides must split hotels and hostels. Stay stops need `lodgingType`, `bookingUrl`, price where useful, and searchable `attributeTags`.
- Activities should not be a random attraction dump. It should be a route-useful top-things guide built from the strongest vetted food, culture, nature, nightlife, and logistics stops.

## Stage 4: Local Verification

Run the local gate before publishing:

```bash
npm run verify:guide-publish -- --city {City} --strict --local-only
```

If the local gate reports a citywide guide with fewer than 10 top-level stops, missing hours, placeholder hours, or weak schedule caveats, stop and repair the local guide file. Do not publish first and repair later.

For a single guide:

```bash
npm run verify:guide-publish -- --slug {guide-slug} --strict --local-only
```

Fix all errors before publishing. Warnings should either be fixed or explained in the final report.

## Stage 5: Normalized Publish

Publish through the normalized writer only:

```bash
npm run push:editorial-guides -- --city {City}
```

For a description-only bulk revision, use the normalized writer's copy-only mode:

```bash
node scripts/backfill-normalized-editorial-guides.mjs --city {City} --copy-only
```

This mode updates `entries.description`, guide-specific `entry_stops.description`, nested-place copy, and `entry_render_cache`. It deliberately leaves canonical venue hours, classifications, sources, and media untouched, and fails when a selected live entry or stop is missing.

For a title-only revision, use the normalized writer's title-only mode:

```bash
npm run push:editorial-guides -- --city {City} --title-only
```

This mode updates `entries.title` and `entry_render_cache` only. It verifies that both normalized and rendered titles match the source and leaves stops, venues, hours, classifications, sources, and media untouched.

or for a single guide:

```bash
npm run push:editorial-guides -- --slug {guide-slug}
```

Do not regenerate or depend on legacy blob tables. The normalized publish writes `entries`, `entry_stops`, `venues`, `sources`, `entity_sources`, `venue_media`, and `entry_render_cache`.

## Stage 6: Destination Left-Panel Image

This stage is required for a newly populated city whose Stage 0 audit found a missing, generic, unrelated, or placeholder left-panel image. The canonical source is `public.destinations.image_url`; the final URL must be R2-backed. Do not solve this by adding another frontend-only fallback.

First search without writing and create a visual review page:

```bash
npm run ingest:destination-images-r2 -- --scope city --slug {city-id} --published-entries-only --force --dry-run --review-output .destination-image-review-{city-id}.html
```

Open the generated HTML file and visually inspect the candidate. Approve it only when it:

- clearly depicts the correct city;
- is not a logo, favicon, map screenshot, generic stock skyline, unrelated landmark, or placeholder;
- has a credible source and usable license/credit metadata;
- is large and clear enough for the left panel.

If the automatic candidate is wrong, refine `--query` or `--provider`, or use a properly licensed explicit source. Never upload a candidate merely because the script returned it. After approving the candidate, run the same scoped ingestion without `--dry-run`:

```bash
npm run ingest:destination-images-r2 -- --scope city --slug {city-id} --published-entries-only --force
```

The ingestion must upload the image to R2, write the R2 URL to `destinations.image_url`, store attribution and source data under `destinations.metadata.destination_image`, and update the local destination fallback map. Delete the temporary review artifact after inspection; do not commit it.

Verify the city left panel renders the new image and that the normalized URL starts with `https://media.rguide.co/`. A newly populated city is incomplete while it still displays a placeholder or generic fallback.

Skip this replacement stage when the Stage 0 audit confirms the city already has a credible, city-specific R2 image. Do not replace good destination media just because a city guide was republished.

## Stage 7: Venue R2 Media Ingestion

R2 ingestion is mandatory. Local image URLs are source candidates, not the final live media target.

Run:

```bash
npm run ingest:venue-media-r2 -- --city {City}
```

or:

```bash
npm run ingest:venue-media-r2 -- --slug {guide-slug}
```

This command runs the R2 ingestion pipeline and then promotes stored R2 media into `venues.primary_photo_id` through `scripts/enforce-r2-venue-photos.mjs`.

The scoped command must process the full city or guide in one run and must exit nonzero if any candidate upload fails or any scoped published stop lacks a stored R2 primary photo in the rendered payload. Do not interpret a partial batch, a nonzero failure count, or a check limited to newly promoted venues as successful ingestion.

## Stage 8: Live Verification

After publishing and R2 ingestion, run:

```bash
npm run verify:guide-publish -- --city {City} --strict --live
```

or:

```bash
npm run verify:guide-publish -- --slug {guide-slug} --strict --live
```

This checks:

- local guide quality;
- published `entries`;
- `entry_stops` count;
- venue links;
- `venues.primary_photo_id`;
- stored R2 media;
- current `entry_render_cache`;
- rendered MapList stop photos using `https://media.rguide.co/...`.
- the newly populated city's left-panel destination image when Stage 6 was required.

If this command fails, the guide is not done.

## Final Report Format

The agent's final answer must include:

```text
Guides created/updated:
- ...

Source counts:
- Guide title: 10+ sources

Weak or blocked sources:
- ...

Destination image:
- Existing credible R2 image, or reviewed source + stored R2 URL + live left-panel result

R2 ingestion:
- uploaded/skipped/failed/cache refreshed summary

Verification:
- local strict: pass/fail
- live strict: pass/fail
- rendered photos: all R2 / list exceptions

Manual review:
- ...
```

Do not claim the guide is live, polished, or R2-backed unless Stage 7 passes.
