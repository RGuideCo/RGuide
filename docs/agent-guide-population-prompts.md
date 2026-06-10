# Agent Guide Population Prompts

Use these prompts when assigning new city guide population work to another agent. These prompts point to `docs/new-guide-population-runbook.md`, which is the durable process source of truth.

For the one-file prompt card Brandon can reference directly, use `docs/populate-guide-agent-short-prompt.md`.

## Short Prompt Dispatch

When Brandon says something like `populate Prague`, `populate Lisbon`, `populate Prague food`, or `populate Alfama nightlife`, interpret it as:

```text
Populate the requested city, category, or neighborhood by following docs/new-guide-population-runbook.md exactly.

Use the Reusable City Prompt Template in this file. Fill in the city name, country, city-id, export name, and requested city/category/neighborhood scope yourself before starting.

Do not pause to ask where guide modules live. Stage 0 tells you how to create/register missing city modules.
Do not edit guide data beyond Stage 0 scaffolding until the source ledger and candidate selection are complete.
Do not write, publish, or verify a guide until every selected stop has a concrete hours plan: structured hours when available, or a source-backed schedule caveat when hours are genuinely variable.
Do not write a citywide guide with fewer than 10 top-level stops unless Brandon explicitly requested a smaller scoped guide.
Do not call the task done until strict local verification, normalized publish, R2 ingestion, and strict live verification have passed.
```

## Reusable City Prompt Template

```text
Populate editorial guides for {City}, {Country} by following docs/new-guide-population-runbook.md exactly.

Stage 0: Bootstrap the city module

First determine whether this file exists:
src/data/guides/{city-id}.ts

If it exists:
- Edit only that city guide file unless index registration is missing.

If it does not exist:
- Create src/data/guides/{city-id}.ts.
- Export:
  export const {cityExportName}CitywideGuides: MapList[] = [...]
- Register it in:
  src/data/guides/index.ts
- Add:
  import { {cityExportName}CitywideGuides } from "@/data/guides/{city-id}";
- Add `...{cityExportName}CitywideGuides` to `editorialGuideLists`.

Use one existing city file as the structural pattern only:
- For European cities, prefer src/data/guides/rome.ts, src/data/guides/amsterdam.ts, or src/data/guides/berlin.ts.
- For North American cities, prefer src/data/guides/san-francisco.ts or the closest existing city file.
- Do not pause to report that the module is missing. Create it and continue.
- Do not broadly audit the registry unless the import/export fails.

Target guide set:
- Food: 1 citywide dining guide and 1 medium-to-cheap eats guide. Each citywide guide needs at least 10 top-level stops.
- Stay: 1 hotel guide and 1 hostel guide, each with at least 10 top-level stops. Do not mix hotels and hostels.
- Nightlife: 1 dive bar/pub/casual bar guide and 1 cocktail bar guide. Each citywide guide needs at least 10 top-level stops.
- Culture: 1 citywide culture guide with at least 10 top-level stops.
- Activities: 1 "top things to do" guide with at least 10 strong top-level stops.

If the user requested only one category or neighborhood, keep the same process but narrow the guide set to that requested scope.

Do not edit guide files beyond Stage 0 scaffolding until Stage 1 and Stage 2 are complete.

Hard gates before any guide data is considered publishable:
- Every guide must include an explicit `seoSlug`. Do not derive it from the internal `slug`.
- Citywide guide URLs resolve as `/city/{city}/{category}/{seoSlug}`.
- Neighborhood guide URLs resolve as `/city/{city}/{neighborhood}/{category}/{seoSlug}`.
- `slug` is internal/legacy identity. `seoSlug` is the public URL slug.
- Never use `citywide`, `top-10`, `list-`, or duplicated city names in `seoSlug`.
- Use clean search-intent slugs such as `best-restaurants`, `best-cheap-eats`, `best-hotels`, `best-hostels`, `best-dive-bars`, `best-cocktail-bars`, `best-culture`, or `best-things-to-do`.
- If two guides in the same city, neighborhood, and category would share a `seoSlug`, make the newer one more specific, such as `best-cocktail-bars`, `best-dive-bars`, or `best-rooftop-bars`.
- Direct canonical guide URLs must expand that exact guide. Legacy/internal URLs should redirect to the clean canonical URL when possible.
- Sitemap entries must use only canonical SEO URLs.
- Every citywide guide must have at least 10 top-level stops.
- Every real venue stop must have a non-empty `hours` field. Verify hours from Google Maps, the official site, a booking/platform page, an official calendar, or another current-status source. Write the hours into the local stop data so the normalized publisher can persist them to `venue_hours`/`venue_special_hours` and preserve any guide-specific display override in `entry_stops.hours`.
- Do not publish with missing or placeholder hours. Banned placeholder-only values include `Hours vary`, `verify current hours`, `confirm before going`, `current-status evidence is map-based`, `open and active in the current source set`, and similar generic caveats. If exact hours are variable, event-dependent, seasonal, or unavailable, write a clear source-backed caveat that names the dependency, such as `hours: { default: "Hours vary by show; verify the official calendar before going." }`.
- Descriptions must have editorial bite and practical truth: Anthony Bourdain curiosity, TripAdvisor usefulness, actual source facts, one useful caveat, and no generic review filler.

Stage 1: Source ledger
Create a source ledger first. Each guide needs at least 10 meaningful list-level sources. Include:
- official venue/property/attraction pages,
- Google Maps/current-status evidence,
- category-specific editorial/platform sources,
- at least one top search-result-style source for that guide type.

Stage 2: Candidate selection
Before writing guide data, propose candidate stops. For each stop include:
- name,
- category/subcategory,
- neighborhood,
- coordinates in [latitude, longitude],
- current open-status evidence,
- verified hours source and the exact structured hours or source-backed schedule caveat that will be written into `hours`,
- official URL,
- map URL,
- image source candidate URL,
- at least two supporting source URLs,
- why it belongs in this exact guide.

Reject weak picks, duplicate-location bundles, permanently closed places, generic tourist traps, unclear-status venues, and stops with poor source support.

Stage 3: Write guide data
After the source ledger and candidate list are complete, edit:
src/data/guides/{city-id}.ts

Every stop must include source evidence fields:
- sourceUrls,
- sourceEvidence.officialUrl where available,
- sourceEvidence.mapUrl,
- sourceEvidence.imageSourceUrl,
- officialUrl or bookingUrl where relevant.

Every stop must include `hours` before publish:
- Prefer structured day keys when the source provides them.
- Use `{ default: "..." }` for reliable summary hours or source-backed variable schedules.
- Use `"24 hours"` only when the source explicitly supports it.
- For neighborhoods, districts, beaches, parks, markets, museums, restaurants, hotels, bars, clubs, galleries, transport hubs, and attractions, either write real hours or a caveat naming the schedule dependency.
- Do not use `current-status evidence is map-based`, `open and active in the current source set`, `verify current hours`, `confirm before going`, or bare `Hours vary` as the actual `hours` value.
- After normalized publish, the stop-level `hours` must be visible in `entry_stops.hours`, and venue-level hours/caveats must be available through `venue_hours`, `venue_special_hours`, or `venues.hours_note`.

Category fields are required:
- Food: foodServiceType, cuisineTypes, price/priceSource where useful, attributeTags.
- Stay: lodgingType, bookingUrl, price/priceSource where useful, attributeTags.
- Nightlife: nightlifeType, musicGenres where relevant, price/priceSource where useful, attributeTags.

Descriptions must use actual facts from venue/property/source pages. Write 2-4 specific sentences per stop with editorial flair and practical judgment: what the place feels like, what it is best for, what to order/book/avoid/time correctly, and why it belongs in this exact guide. Do not use generic travel copy, keyword chains, repeated sentence frames, or unsupported claims.

Photo sourcing:
- Start with the actual venue/property/official website.
- Then use Wikimedia API/FilePath where appropriate.
- Then use Openverse Creative Commons fallback.
- Do not use logos, favicons, random thumbnails, placeholder stock, parked domains, or unrelated images.
- Local photo URLs are only source candidates. Final live images must go through R2.

Before publishing, run:
npm run verify:guide-publish -- --city {City} --strict --local-only

Fix every error before publishing.

Then publish:
npm run push:editorial-guides -- --city {City}

Then ingest images into R2:
npm run ingest:venue-media-r2 -- --city {City}

Then verify live/rendered data:
npm run verify:guide-publish -- --city {City} --strict --live

The task is not complete until strict live verification passes and rendered guide payload photos use https://media.rguide.co/ URLs.

Final response must include:
- Guides created/updated
- Source count per guide
- Weak or blocked sources
- R2 ingestion result
- Verification result
- Any stops needing manual editorial review
```
