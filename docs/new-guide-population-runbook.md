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
- R2 ingestion result
- verification command output summary
- any stops needing manual editorial review
```

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
- a specific reason it belongs in this exact guide;
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

- write 2-4 specific sentences per stop;
- use facts from the venue/property/official/source pages;
- explain why the stop belongs in this exact guide;
- name the source-backed draw: dish, room, collection, crowd, price tradeoff, location fit, booking posture, view, design, or route role;
- add one useful caveat or best-use note;
- write with Anthony Bourdain curiosity and TripAdvisor usefulness: textured, opinionated, and specific, but still practical for someone deciding where to go;
- do not use generic keyword chains, tourist-board wording, repeated sentence frames, or phrases like `hidden gem`, `must-see`, or `something for everyone`;
- when the same venue appears in two guides, write a different description for each guide context.

Hours rules:

- every real venue stop must have a non-empty `hours` field before publish;
- verify hours from Google Maps, the official site, a booking platform, an official calendar, or another current-status source;
- use structured day keys where possible;
- use `{ default: "..." }` when the source gives summary hours or when the venue is schedule-driven;
- use a schedule caveat only when hours are genuinely event-dependent, seasonal, weather-dependent, or unavailable from reliable sources, and make the caveat source-backed;
- do not use vague placeholders like `Hours vary`, `verify current hours`, `confirm before going`, `current-status evidence is map-based`, or `open and active in the current source set`;
- if hours truly vary, the caveat must name the exact dependency and source, such as the official calendar, booking page, show schedule, market-day schedule, weather policy, seasonal opening, or property page;
- do not publish if any stop is missing `hours`; fix the guide data first;
- persist venue-level hours through the normalized publisher into `venue_hours`/`venue_special_hours` or `venues.hours_note`;
- treat `venue_hours`/`venue_special_hours`/`venues.hours_note` as the live source of truth after publish;
- use `entry_stops.hours` only as an import/display fallback, not as the final place to maintain shared venue facts.

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

or for a single guide:

```bash
npm run push:editorial-guides -- --slug {guide-slug}
```

Do not regenerate or depend on legacy blob tables. The normalized publish writes `entries`, `entry_stops`, `venues`, `sources`, `entity_sources`, `venue_media`, and `entry_render_cache`.

## Stage 6: R2 Media Ingestion

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

## Stage 7: Live Verification

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
