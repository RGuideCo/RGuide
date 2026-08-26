# rGuide Agent Instructions

This repository is rGuide, the travel guide and destination website. Do not apply assumptions, files, prompts, or styling from Brian's portfolio or any other project.

## Project Boundary

- Work only inside `/Users/brodriguez/Projects/rGuide` unless the user explicitly gives a different path.
- Do not edit portfolio files, personal-site files, or other repos from this workspace.
- If the user asks for portfolio work, confirm that the current repo is wrong and ask them to switch to the portfolio workspace.
- Keep unrelated local changes intact. Stage and commit only files directly required for the current task.

## Architecture

- This is a Next.js app backed by Supabase.
- Normalized Supabase tables are the source of truth for destinations, entries, entry stops, venues, sources, events, schedules, media, and render caches.
- Do not reintroduce legacy blob-table workflows as source of truth.
- Render/cache payloads exist to support the frontend MapList shape, not to replace normalized records.

## Guide Population Rules

- For guide-population tasks, follow `docs/populate-guide-agent-short-prompt.md` and `docs/new-guide-population-runbook.md`.
- Citywide guides need at least 10 top-level stops unless the user explicitly requests a smaller scoped guide.
- Stay guides must keep hotels and hostels separate. Do not mix hotel and hostel lodging types in one guide.
- Every stop needs source-backed hours before publish. Do not use placeholder-only hours like `Hours vary`, `verify current hours`, `confirm before going`, or `open and active in the current source set`.
- If hours are seasonal, event-driven, show-driven, or otherwise variable, name the exact dependency, such as the official calendar, reservation page, booking page, show schedule, market days, weather policy, or property page.
- Stop descriptions must use actual venue/source facts with editorial judgment. Avoid generic travel copy, keyword chains, and repeated filler.
- Every stop should include useful category classification fields and `attributeTags` for filtering.
- When populating a city for the first time, inspect its left-panel destination image. If it is missing, generic, unrelated, or a placeholder, use the reviewed destination-image R2 workflow in the population runbook and make `destinations.image_url` the canonical city-specific R2 image before calling the city complete.

## Media And R2

- Venue photos should flow through the canonical venue media/R2 pipeline.
- Local photo URLs are source candidates, not the intended final live image source.
- After publishing guide changes that affect photos, run the relevant R2 ingestion and guide publish verification before calling the work complete.
- Do not add duplicate or placeholder images to venue media.

## Validation

- Use scoped verification for guide changes:
  - `npm run verify:guide-publish -- --city <City> --strict --local-only`
  - After publish/R2 ingestion, use live verification when appropriate.
- For app-wide code changes, run the relevant lint/build checks when practical.
- If Supabase, R2, Vercel, or network access fails due to sandboxing, report the exact blocker and do not claim the live site changed.

## Localization

- Follow `docs/localization-runbook.md` for translation work.
- Use explicit Codex translation batches through `translate:export` and `translate:import`.
- For batches above 25 roots, use compact `translate:shard` handoffs to balance nested translation workload across agents and `translate:merge` for deterministic validation. Use 10 disjoint shards for a 50-root batch.
- Require translator self-review, parent merge validation, and one editorial sample per shard. Do not delay import with a redundant full-batch reviewer unless a sample exposes a quality problem.
- For routine translation batches, do not run a production build when application and workflow code are unchanged. Keep sampling off the post-translation critical path by reviewing each shard as it finishes.
- Do not call a paid translation API or enable a scheduled translation worker unless the user explicitly changes this policy.
- Translation batch JSON is a temporary handoff. Normalized translation tables and localized render caches remain the source of truth.
- Keep a locale `noindex` until `verify:translations` passes completely.

## Git

- Prefer small, focused commits.
- Do not stage unrelated changes.
- If the working tree is mixed, explicitly stage only the files in scope.
- Push only after verification or after clearly explaining why verification was skipped.
