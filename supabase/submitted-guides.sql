create table if not exists public.submitted_guides (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  list jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.submitted_guides enable row level security;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists submitted_guides_set_updated_at on public.submitted_guides;

create trigger submitted_guides_set_updated_at
before update on public.submitted_guides
for each row
execute function public.set_updated_at();

drop policy if exists "Public guides are readable" on public.submitted_guides;
drop policy if exists "Authenticated users can create their own guides" on public.submitted_guides;
drop policy if exists "Users can update their own guides" on public.submitted_guides;
drop policy if exists "Users can delete their own guides" on public.submitted_guides;

create policy "Public guides are readable"
on public.submitted_guides
for select
using (
  auth.uid() = user_id
  or coalesce(list #>> '{journal,visibility}', 'public') <> 'private'
);

create policy "Authenticated users can create their own guides"
on public.submitted_guides
for insert
with check (auth.uid() = user_id);

create policy "Users can update their own guides"
on public.submitted_guides
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their own guides"
on public.submitted_guides
for delete
using (auth.uid() = user_id);
