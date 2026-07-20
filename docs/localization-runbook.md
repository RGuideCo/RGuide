# RGuide Localization Runbook

## Architecture

English normalized rows remain the canonical authored source. Translations live in typed tables keyed to the same destination, entry, stop, venue, event, activation, and occurrence IDs. Localized MapList JSON is a derived frontend cache, never authored content.

The first locale is Spanish (`es`). Spanish stays `noindex` until all required rows and localized caches pass verification. English URLs and caches are not replaced or rewritten.

## Spanish URLs

- Home: `/es`
- City: `/es/ciudad/{ciudad}`
- City category: `/es/ciudad/{ciudad}/{categoria}`
- Neighborhood category: `/es/ciudad/{ciudad}/{barrio}/{categoria}`
- Guide: `/es/ciudad/{ciudad}/{barrio?}/{categoria}/{seoSlug}`
- Event: `/es/eventos/{seoSlug}`

Every indexable English and Spanish page must have a self-canonical plus reciprocal `hreflang` links for `en`, `es`, and `x-default`. Only canonical URLs belong in the sitemap. Do not redirect visitors by browser language or IP; the language switcher changes locale explicitly.

## Initial Spanish Rollout

1. Apply `supabase/20260719_multilingual_content_foundation.sql`.
2. Add the GitHub Actions secret `SUPABASE_DB_URL` so the read-only verification workflow can inspect publication readiness.
3. Queue current published content:

   ```bash
   npm run translate:backfill -- --locale es
   ```

4. Export a small batch directly, or export up to 100 roots for balanced parallel translation:

   ```bash
   npm run translate:export -- --locale es --limit 5 --output translation-batches/work/es-next.json
   ```

   For a parallel 50-root batch, split by actual nested translation workload rather than raw guide count:

   ```bash
   npm run translate:export -- --locale es --type entry --limit 50 --output translation-batches/work/es-next-50.json
   npm run translate:shard -- --batch translation-batches/work/es-next-50.json --shards 5
   ```

   Assign each generated shard to one translator. Each translator must complete and self-review only its own shard. Do not add a second full-batch reviewer to the critical path; the parent process performs deterministic merge validation and an editorial sample from every shard.

5. Ask Codex to translate the exported file:

   ```text
   Translate the next Spanish content batch in translation-batches/work/es-next.json.
   Follow docs/localization-runbook.md exactly. Fill only each translation object,
   preserve every identifier and source hash, validate the batch, import it with
   --auto-publish, and report the verification result. Do not call a paid translation API.
   ```

6. Codex fills only each item's `translation` object. It must not edit `input`, IDs, locale, or source hashes. Merge parallel shards before importing:

   ```bash
   npm run translate:merge -- --batch translation-batches/work/es-next-50.json --shards 5 --output translation-batches/work/es-next-50-complete.json
   ```

   The merge rejects missing or duplicate jobs, changed inputs or source hashes, missing translated fields, changed nested IDs/order, altered `placesJson`, copied English descriptions, and invalid localized SEO slugs. Import the completed batch through the normalized writer:

   ```bash
   npm run translate:import -- --locale es --batch translation-batches/work/es-next-50-complete.json --auto-publish
   ```

   The importer rejects stale source hashes, mismatched IDs, missing stops or schedule items, and incomplete translated fields. It writes the typed translation tables and rebuilds localized MapList caches; the JSON batch is only a temporary handoff file.

7. Repeat export, Codex translation, and import until verification passes:

   ```bash
   npm run verify:translations -- --locale es
   ```

8. Enable Spanish indexing only after the verifier reports no missing, stale, open, or invalid rows:

   ```bash
   npm run translate:set-indexable -- --locale es
   ```

The indexability command refuses to publish an incomplete locale. To remove a locale from search while keeping its content available, run:

```bash
npm run translate:set-indexable -- --locale es --disable
```

## New And Updated Guides

Database triggers queue translations when a published entry, stop, destination description, category insight, event activation, occurrence, or rendered cache changes. They remain queued until a Codex batch is explicitly exported, translated, validated, and imported. There is no scheduled paid translation worker.

If only non-translatable data changes, such as a venue photo, hours, or schedule date, the importer can reuse the approved translation and rebuild the localized cache without translating the editorial copy again.

Batch files live under `translation-batches/work/` and are ignored by Git. They are operational handoff files, not another content source of truth.

## Adding Another Language

1. Add the locale to `content_locales` with `is_indexable = false`.
2. Add its compile-time definition, route segments, category slugs, and UI dictionary in `src/lib/i18n`.
3. Add its route tree under `src/app/{locale}` and its static-page translations.
4. Add the same route segments to `LOCALIZED_ROUTE_CONFIG` in `scripts/i18n-utils.mjs`.
5. Extend sitemap `hreflang` generation and the language switcher.
6. Queue, process, verify, and review the language before enabling indexing.

Never publish a new locale by copying English text into localized URLs. Missing translations stay unavailable or `noindex`; English remains available at its canonical URL.
