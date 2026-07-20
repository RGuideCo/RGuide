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
2. Add GitHub Actions secrets `SUPABASE_DB_URL` and `OPENAI_API_KEY`.
3. Optionally set the repository variable `OPENAI_TRANSLATION_MODEL`; the worker defaults to `gpt-5-mini`.
4. Queue current published content:

   ```bash
   npm run translate:backfill -- --locale es
   ```

5. Process the queue in reviewed batches:

   ```bash
   npm run translate:process -- --locale es --limit 25 --auto-publish
   ```

6. Repeat until verification passes:

   ```bash
   npm run verify:translations -- --locale es
   ```

7. Enable Spanish indexing only after the verifier reports no missing, stale, open, or invalid rows:

   ```bash
   npm run translate:set-indexable -- --locale es
   ```

The indexability command refuses to publish an incomplete locale. To remove a locale from search while keeping its content available, run:

```bash
npm run translate:set-indexable -- --locale es --disable
```

## New And Updated Guides

Database triggers queue translations when a published entry, stop, destination description, category insight, event activation, occurrence, or rendered cache changes. The scheduled GitHub workflow processes pending work every two hours and automatically publishes complete translations.

If only non-translatable data changes, such as a venue photo, hours, or schedule date, the worker reuses the approved translation and rebuilds the localized cache without making another model call.

## Adding Another Language

1. Add the locale to `content_locales` with `is_indexable = false`.
2. Add its compile-time definition, route segments, category slugs, and UI dictionary in `src/lib/i18n`.
3. Add its route tree under `src/app/{locale}` and its static-page translations.
4. Add the same route segments to `LOCALIZED_ROUTE_CONFIG` in `scripts/i18n-utils.mjs`.
5. Extend sitemap `hreflang` generation and the language switcher.
6. Queue, process, verify, and review the language before enabling indexing.

Never publish a new locale by copying English text into localized URLs. Missing translations stay unavailable or `noindex`; English remains available at its canonical URL.
