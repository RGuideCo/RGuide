# RGuide

Production-ready Next.js App Router scaffold for a curated Google Maps list aggregator.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Lucide React
- React-Leaflet
- Zustand
- Mock local data only

## Quick Start

```bash
npm install
npm run dev
```

## Folder Structure

```text
src/
  app/
    city/[continent]/[country]/[city]/page.tsx
    category/[category]/page.tsx
    creator/[name]/page.tsx
    favorites/page.tsx
    list/[slug]/page.tsx
    submit/page.tsx
    error.tsx
    globals.css
    layout.tsx
    loading.tsx
    not-found.tsx
    page.tsx
  components/
    auth/
    cards/
    city/
    home/
    layout/
    list/
    map/
    shared/
  data/
    geography.ts
    index.ts
    lists.ts
    users.ts
  lib/
    constants.ts
    mock-data.ts
    routes.ts
    utils.ts
  store/
    app-store.ts
  types/
    index.ts
```

## Notes

- Auth, favorites sync, analytics, and database writes are mocked for now.
- TODO comments mark future Supabase/Auth/server integration points.
- The map is isolated to a client-only Leaflet component to avoid SSR issues.

## Editorial References

- [Editorial guide population reference](docs/editorial-guide-population-reference.md)
- [Restaurant research sources](docs/restaurant-research-sources.md)
- [Stay research sources](docs/stay-research-sources.md)
