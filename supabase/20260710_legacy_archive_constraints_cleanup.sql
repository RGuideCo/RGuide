begin;

-- Archived snapshots must not constrain deletes or updates in active schemas.
alter table legacy_archive.destination_descriptions
  drop constraint if exists destination_descriptions_destination_id_fkey;

alter table legacy_archive.submitted_guides
  drop constraint if exists submitted_guides_user_id_fkey;

commit;
