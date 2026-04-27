# Places Been Persistence

Places Been entries must be treated as user-owned profile data, not component state.

Current local development source of truth:

- `src/store/app-store.ts`
- `placesBeenByUserId[userId]`
- Zustand persist key: `rguide-app-store`

The legacy per-feature browser keys are read once by `use-persisted-places-been.ts` only to rescue old data:

- `rguide:places-been-countries:{userId}`
- `rguide:places-been-cities:{userId}`
- `rguide:places-been-places:{userId}`

Production source of truth should be a database table keyed by authenticated user ID:

```sql
create table user_places_been (
  user_id text primary key references users(id) on delete cascade,
  countries text[] not null default '{}',
  cities text[] not null default '{}',
  places text[] not null default '{}',
  updated_at timestamptz not null default now()
);
```

Write rule:

- Every `setPlacesBeenForUser(userId, entries)` call should upsert this row.
- On login/app boot, hydrate `placesBeenByUserId[userId]` from this row.
- Local Zustand persistence should become an offline cache, not the canonical store.
