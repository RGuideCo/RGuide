# Populate Guide Agent Short Prompt

Use this when assigning guide population work to another agent.

## City

```text
Populate {City}. Follow docs/populate-guide-agent-short-prompt.md exactly.
```

Example:

```text
Populate Prague. Follow docs/populate-guide-agent-short-prompt.md exactly.
```

## City Category

```text
Populate {City} {Category}. Follow docs/populate-guide-agent-short-prompt.md exactly.
```

Example:

```text
Populate Lisbon nightlife. Follow docs/populate-guide-agent-short-prompt.md exactly.
```

## Neighborhood Category

```text
Populate {Neighborhood} {Category} in {City}. Follow docs/populate-guide-agent-short-prompt.md exactly.
```

Example:

```text
Populate Alfama food in Lisbon. Follow docs/populate-guide-agent-short-prompt.md exactly.
```

## Agent Instructions

When you receive one of the short prompts above:

1. Read `docs/agent-guide-population-prompts.md`.
2. Use its Short Prompt Dispatch and Reusable City Prompt Template.
3. Follow `docs/new-guide-population-runbook.md` for the actual staged workflow.
4. Do not edit guide data beyond Stage 0 scaffolding until the source ledger and candidate selection are complete.
5. Apply the hard quality gates before writing:
   - every guide needs an explicit clean `seoSlug` for the canonical `/city/...` URL;
   - never put `citywide`, `top-10`, `list-`, or the city name in `seoSlug`;
   - every citywide guide needs at least 10 top-level stops; this applies to food, stay, nightlife, culture, and activities unless the user explicitly requested a smaller scoped guide;
   - every stop needs a non-empty `hours` field backed by Google Maps, the official site, a booking/platform page, an official calendar, or a clearly sourced seasonal/event caveat;
   - when hours differ by weekday, write structured `mon` through `sun` keys; do not pack a weekly schedule into `default`, because current-day resolution depends on those keys;
   - when a daily schedule changes by month, use a parseable month-led summary such as `Jan-Mar daily ...; Apr daily ...; May-Sep daily ...; Oct-Dec daily ...`; the UI will display only the active month range;
   - Google Places API is a last-resort fallback, not the first research step; use official/property/booking/calendar sources first, then run the capped Google fallback only for venues still missing canonical hours;
   - do not use placeholder hours such as `Hours vary`, `verify current hours`, `confirm before going`, `current-status evidence is map-based`, or `open and active in the current source set`; use real day/time hours when available, or a source-backed caveat that names the exact dependency such as the official calendar, reservation page, show schedule, market days, weather, season, or property page;
   - do not publish if any real venue stop is missing real hours or a source-backed schedule caveat; fix the stop data first so the normalized publisher can write canonical `venue_hours`/`venue_special_hours` or `venues.hours_note`;
   - after publish, canonical venue hours are the live source of truth; `entry_stops.hours` is only an import/display fallback and must not be treated as the final place to maintain venue facts;
   - every stop description needs source-grounded editorial texture: Anthony Bourdain curiosity with TripAdvisor usefulness, not keyword chains;
   - lead with what the venue actually cooks, pours, plays, exhibits, stages, rents, or provides; itinerary position is never the main description;
   - do not use meta or route filler such as `earns its spot`, `belongs in this guide`, `gives the route`, `anchors the day`, `use it before/after`, or `the night needs`;
   - practical advice is optional and must change the venue decision: what to order/book, queue or reservation posture, room choice, door policy, schedule, accessibility, or a real price/noise tradeoff.
6. Do not call the task done until strict local verification, normalized publish, R2 ingestion, and strict live verification have passed.

Required final commands:

```bash
npm run verify:guide-publish -- --city {City} --strict --local-only
npm run push:editorial-guides -- --city {City}
npm run report:venue-hours -- {city-slug} --rendered-bad
npm run ingest:venue-hours-google -- --city {city-slug} --plan-only
npm run ingest:venue-hours-google -- --city {city-slug} --limit 25
npm run ingest:venue-media-r2 -- --city {City}
npm run report:venue-hours -- {city-slug} --rendered-summary
npm run verify:guide-publish -- --city {City} --strict --live
```

Only run `ingest:venue-hours-google` after the official/source-backed hours pass and only when `report:venue-hours --rendered-bad` still shows missing or placeholder canonical hours. The script is capped by `GOOGLE_PLACES_DAILY_LIMIT` and `GOOGLE_PLACES_MONTHLY_LIMIT`; never bypass those caps for normal guide population.

If verification reports fewer than 10 top-level stops in a citywide guide, missing hours, placeholder hours, missing canonical venue hours, or schedule caveats without source evidence, stop and repair the guide data before rerunning publish. Do not describe the guide as complete while hours are only implied by sources or visible on a website.

If the prompt is category- or neighborhood-scoped, use the same workflow and narrow the guide set to that requested scope.
