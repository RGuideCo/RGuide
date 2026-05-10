alter table public.entry_stops
  add column if not exists subcategory text,
  add column if not exists subcategories jsonb not null default '[]'::jsonb;
