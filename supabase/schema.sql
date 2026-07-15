-- Vouch schema: tables, RLS policies, storage buckets, and the
-- auto-provisioning trigger that creates a business + seed questions on signup.
--
-- Run this once against a fresh Supabase project (SQL Editor, or `psql`).

create extension if not exists "pgcrypto";

-- ============================================================
-- Tables
-- ============================================================

create table businesses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  slug text not null unique,
  logo_url text,
  brand_color text not null default '#0f172a',
  reward_text text,
  reward_code text,
  reward_terms text,
  created_at timestamptz not null default now()
);

create index businesses_owner_id_idx on businesses (owner_id);

create table questions (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses (id),
  text text not null,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index questions_business_id_idx on questions (business_id);

create table responses (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses (id),
  customer_name text,
  customer_email text,
  customer_phone text,
  consent boolean not null default false,
  status text not null check (status in ('pending', 'approved', 'rejected')) default 'pending',
  created_at timestamptz not null default now()
);

create index responses_business_id_idx on responses (business_id);

create table answers (
  id uuid primary key default gen_random_uuid(),
  response_id uuid not null references responses (id) on delete cascade,
  question_id uuid not null references questions (id),
  video_url text,
  text_answer text,
  skipped boolean not null default false,
  created_at timestamptz not null default now()
);

create index answers_response_id_idx on answers (response_id);
create index answers_question_id_idx on answers (question_id);

-- ============================================================
-- RLS
-- ============================================================

alter table businesses enable row level security;
alter table questions enable row level security;
alter table responses enable row level security;
alter table answers enable row level security;

-- businesses: owner full access
create policy "owner_all_businesses" on businesses
  for all
  to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

-- businesses: everyone (anon + authenticated) can read, to resolve a slug on
-- the public collection page, and so a logged-in owner can preview any page
create policy "public_select_businesses" on businesses
  for select
  to public
  using (true);

-- questions: owner full access via parent business
create policy "owner_all_questions" on questions
  for all
  to authenticated
  using (exists (
    select 1 from businesses b
    where b.id = questions.business_id and b.owner_id = auth.uid()
  ))
  with check (exists (
    select 1 from businesses b
    where b.id = questions.business_id and b.owner_id = auth.uid()
  ));

-- questions: everyone can read active questions only
create policy "public_select_active_questions" on questions
  for select
  to public
  using (is_active = true);

-- responses: owner full access via parent business
create policy "owner_all_responses" on responses
  for all
  to authenticated
  using (exists (
    select 1 from businesses b
    where b.id = responses.business_id and b.owner_id = auth.uid()
  ))
  with check (exists (
    select 1 from businesses b
    where b.id = responses.business_id and b.owner_id = auth.uid()
  ));

-- responses: anon can insert only -- no public select at all. The client
-- generates the row's id itself (crypto.randomUUID()) and inserts without
-- .select(), so no SELECT policy is ever required for the public flow.
create policy "public_insert_responses" on responses
  for insert
  to anon
  with check (true);

-- answers: owner full access via response -> business
create policy "owner_all_answers" on answers
  for all
  to authenticated
  using (exists (
    select 1 from responses r
    join businesses b on b.id = r.business_id
    where r.id = answers.response_id and b.owner_id = auth.uid()
  ))
  with check (exists (
    select 1 from responses r
    join businesses b on b.id = r.business_id
    where r.id = answers.response_id and b.owner_id = auth.uid()
  ));

-- answers: anon can insert only, same reasoning as responses above
create policy "public_insert_answers" on answers
  for insert
  to anon
  with check (true);

-- ============================================================
-- Storage
-- ============================================================

-- testimonials: customer-submitted video answers. Public read (owners and,
-- eventually, exported clips need direct URLs), anon insert (the public
-- collection page uploads with no session). Capped at 100 MiB and restricted
-- to the two codecs the recorder can actually produce.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('testimonials', 'testimonials', true, 104857600, array['video/webm', 'video/mp4'])
on conflict (id) do nothing;

create policy "public_read_testimonials_bucket" on storage.objects
  for select
  to public
  using (bucket_id = 'testimonials');

create policy "anon_insert_testimonials_bucket" on storage.objects
  for insert
  to anon
  with check (bucket_id = 'testimonials');

-- logos: business-owner-uploaded branding assets. Public read, authenticated
-- insert/update -- not path-scoped to the owner's own business, since every
-- write in the app is already constructed from the current owner's session
-- and there's no adversarial path-guessing scenario worth defending against
-- in a demo.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('logos', 'logos', true, 10485760, array['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'])
on conflict (id) do nothing;

create policy "public_read_logos_bucket" on storage.objects
  for select
  to public
  using (bucket_id = 'logos');

create policy "authenticated_write_logos_bucket" on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'logos');

create policy "authenticated_update_logos_bucket" on storage.objects
  for update
  to authenticated
  using (bucket_id = 'logos')
  with check (bucket_id = 'logos');

-- ============================================================
-- Auto-provisioning: new signup -> business + seed questions
-- ============================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  new_business_id uuid;
  business_name text := coalesce(new.raw_user_meta_data ->> 'business_name', 'My Business');
  final_slug text := lower(regexp_replace(business_name, '[^a-zA-Z0-9]+', '-', 'g'))
                     || '-' || substr(md5(random()::text), 1, 4);
begin
  insert into public.businesses (owner_id, name, slug)
  values (new.id, business_name, final_slug)
  returning id into new_business_id;

  insert into public.questions (business_id, text, is_active, sort_order)
  values
    (new_business_id, 'What made you choose us today?', true, 0),
    (new_business_id, 'What was your favourite dish?', true, 1),
    (new_business_id, 'How would you describe the service?', true, 2),
    (new_business_id, 'Would you recommend us to a friend, and why?', true, 3),
    (new_business_id, 'How did you hear about us?', false, 4),
    (new_business_id, 'How was the ambience?', false, 5),
    (new_business_id, 'Anything we could do better?', false, 6),
    (new_business_id, 'How likely are you to come back?', false, 7),
    (new_business_id, 'Describe your experience in one sentence.', false, 8);

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
