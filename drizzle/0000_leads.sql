-- Leads captured from beholdlabs.com.
--
-- Apply once, against the Supabase project this site's DATABASE_URL points at:
--   psql "$DATABASE_URL" -f drizzle/0000_leads.sql
-- or paste it into the Supabase SQL editor.
--
-- Written by hand rather than generated: drizzle-kit pulls in a vulnerable esbuild-kit
-- chain for what amounts to one table, and a migration you can read is worth more here
-- than one you have to trust.

create extension if not exists "pgcrypto";

create table if not exists leads (
  id               uuid primary key default gen_random_uuid(),
  email            text not null unique,
  first_name       text,
  last_name        text,
  job_title        text,
  company_name     text,
  personal_website text,
  company_website  text,
  heard_about      text,
  captured_from    text,
  details_at       timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists leads_created_at_idx on leads (created_at);

-- RLS on with no policy for anon/authenticated, so a leaked Supabase API key still
-- reaches nothing through PostgREST.
alter table leads enable row level security;

comment on table leads is
  'Marketing site leads. Step one stores the email; the dialog fills the rest. No IP or user agent is kept.';


-- --------------------------------------------------------------------------------------
-- The role the site connects as.
--
-- Deliberately not the project owner. If the site is ever compromised, the blast radius
-- is this one table and these two verbs — the attacker cannot read a lead's name, delete
-- anything, or see another table in the schema.
--
-- Set the password out of band and put the resulting URL in DATABASE_URL; the pooler
-- expects the username as `bhl_site.<project-ref>`.
--   create role bhl_site with login password '<generated>';
-- --------------------------------------------------------------------------------------

grant usage on schema public to bhl_site;
grant insert, update on table leads to bhl_site;

-- Column-level, not table-level. `insert ... on conflict (email)` needs to read the
-- arbiter column to detect the conflict, and nothing more; a table-level `grant select`
-- here would hand the site read access to every lead's name, company and title.
grant select (email) on table leads to bhl_site;

-- RLS applies to this role (it is not the owner), so the grants above do nothing without
-- matching policies. `site_select` exists for the same reason as the column grant: under
-- RLS, `on conflict do update` must be able to see the row it is about to update.
drop policy if exists site_insert on leads;
drop policy if exists site_update on leads;
drop policy if exists site_select on leads;
create policy site_insert on leads for insert to bhl_site with check (true);
create policy site_update on leads for update to bhl_site using (true) with check (true);
create policy site_select on leads for select to bhl_site using (true);
