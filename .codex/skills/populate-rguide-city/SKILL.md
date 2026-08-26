---
name: populate-rguide-city
description: Populate or materially rebuild rGuide editorial guides for a city, city category, or neighborhood category from research through normalized publication and live verification. Use for requests such as "populate Prague," "populate Lisbon nightlife," "populate Alfama food in Lisbon," creating a missing city guide module, or completing an existing city population pass that requires source research, candidate selection, guide writing, canonical hours, R2 media ingestion, and strict publish verification.
---

# Populate rGuide City

Run rGuide's repository-defined city-population process without duplicating or weakening its quality gates. Treat the repository runbooks as the durable source of truth and the existing npm commands as the deterministic implementation surface.

## Establish Scope

1. Work only in the rGuide repository. Stop and explain the mismatch if the current workspace is another project.
2. Parse the requested city, country, category, neighborhood, and guide scope from the prompt. Infer conventional identifiers and existing module locations from repository data when unambiguous; ask only when a consequential ambiguity remains.
3. Treat short prompts such as `populate {City}`, `populate {City} {Category}`, and `populate {Neighborhood} {Category} in {City}` as full workflow dispatches.
4. Narrow the guide set when the user explicitly requests a category, neighborhood, repair, or other smaller scope. Do not silently expand beyond it.
5. Inspect the working tree before editing. Preserve unrelated user changes and modify only files required by the requested population work.

## Load the Authoritative Process

Before researching, scaffolding, or editing guide data, read these repository files completely:

1. `docs/populate-guide-agent-short-prompt.md`
2. `docs/agent-guide-population-prompts.md`
3. `docs/new-guide-population-runbook.md`
4. `docs/editorial-guide-population-reference.md`

Also follow the current repository `AGENTS.md`. If the documents disagree, follow `AGENTS.md`, treat `docs/new-guide-population-runbook.md` as the workflow source of truth, and treat the prompt documents as dispatch wrappers. Report a material contradiction instead of inventing a policy.

## Execute the Staged Workflow

Keep the stages ordered. Do not start guide writing before the source ledger and candidate selection are complete.

1. **Bootstrap:** Locate the matching city module. Create and register a missing module only as allowed by Stage 0; do not add substantive guide data yet. For a city receiving its first population, inspect the current left-panel destination image and record whether it is missing, generic, unrelated, or a placeholder.
2. **Build the source ledger:** Research the required current, meaningful sources for every guide. Prefer official venue, property, attraction, booking, calendar, and tourism sources; use current platform and editorial sources where the runbook requires them.
3. **Select candidates:** Vet every proposed stop for identity, category, neighborhood, coordinates, open status, hours plan, source support, image source, offering, and visit-changing caveats. Reject weak, duplicate, closed, unclear, or miscategorized candidates.
4. **Write local guide data:** Edit only the scoped city module and necessary registry entry. Apply every SEO, source-evidence, hours, description, category-field, stop-count, lodging-separation, and media-source rule from the runbooks.
5. **Verify locally:** Run the strict local verification command for the scoped city or guide. Repair every error before publishing. Explain unresolved warnings.
6. **Publish normalized data:** Use only the normalized writer described by the runbook. Never reintroduce legacy blob tables as source of truth.
7. **Check canonical hours:** Run the rendered-hours report after publishing. Use the capped Google Places plan and ingestion only when official, property, booking, and calendar sources still leave canonical hours missing or invalid. Never bypass configured limits.
8. **Set the destination image:** When a newly populated city has no credible left-panel image, or still uses a generic, unrelated, or placeholder image, run the destination-image dry-run and review flow from the runbook. Approve a city-specific licensed image, ingest it to R2, and confirm `destinations.image_url` uses `https://media.rguide.co/...`. Do not accept an automatic search match without visually checking the candidate.
9. **Ingest R2 venue media:** Run the canonical venue-media R2 pipeline for the scoped city or guide. Require the command to cover the full scope with zero failed candidates; a successful partial batch is not completion. Do not treat local image URLs as final live media.
10. **Verify live:** Run strict live verification and confirm the normalized records, render cache, canonical hours, stop counts, venue links, destination image, and R2-backed rendered photos pass.

Use the exact commands and conditional branches in the current runbooks rather than copying command variants into this skill. When a command fails because Supabase, R2, Vercel, credentials, or network access is unavailable, preserve completed local work, report the exact blocker, and do not claim the live site changed.

## Enforce Completion Gates

Do not describe the work as complete, live, polished, published, or R2-backed unless all gates required for the requested scope pass:

- Source ledger and candidate selection completed before substantive writing.
- Required guide and stop counts satisfied without filler.
- Every real stop has source-backed hours or a precise source-backed schedule dependency.
- Weekday-varying hours use structured day keys, and month-varying daily summaries use parseable month-led ranges so the UI can resolve the currently applicable hours.
- Strict local verification passed.
- Normalized publication succeeded.
- Conditional hours remediation completed when needed.
- A newly populated city's left-panel image is city-specific, non-placeholder, visually reviewed, stored in R2, and referenced by `destinations.image_url`.
- R2 ingestion succeeded.
- Strict live verification passed with rendered R2 media.

If a gate cannot pass, stop at that gate, keep the result explicitly incomplete, and provide the repair or external action required next.

## Report the Result

Use the final-report structure required by `docs/new-guide-population-runbook.md`. Include:

- Guides created or updated.
- Source count for each guide.
- Source-ledger weaknesses, blocked sources, and replacements.
- R2 uploaded, skipped, failed, and cache-refresh results.
- Destination left-panel image source, review, R2 URL, and live verification result when the city image was added or replaced.
- Strict local and strict live verification outcomes.
- Rendered-photo status and any exceptions.
- Stops needing manual editorial review.
- Exact blockers and the last successfully completed stage when the workflow remains incomplete.
