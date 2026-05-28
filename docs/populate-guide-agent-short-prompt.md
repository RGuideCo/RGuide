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
5. Do not call the task done until strict local verification, normalized publish, R2 ingestion, and strict live verification have passed.

Required final commands:

```bash
npm run verify:guide-publish -- --city {City} --strict --local-only
npm run push:editorial-guides -- --city {City}
npm run ingest:venue-media-r2 -- --city {City}
npm run verify:guide-publish -- --city {City} --strict --live
```

If the prompt is category- or neighborhood-scoped, use the same workflow and narrow the guide set to that requested scope.
