-- Petus Go schema
create extension if not exists pgcrypto;

-- ───────── Enums ─────────
create type species as enum ('canino','felino');
create type pet_size as enum ('pequeño','mediano','grande');
create type pet_sex as enum ('macho','hembra');
create type membership_status as enum ('pendiente','activa','vencida','cancelada');
create type benefit_type as enum ('bolsa_gratis','bano','consulta');
create type staff_role as enum ('cajero','admin');

-- ───────── Catálogo ─────────
create table sites (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text,
  is_active boolean not null default true
);

create table food_brands (
  id text primary key,               -- 'rc','hills',...
  name text not null,
  is_active boolean not null default true
);

create table food_presentations (
  id uuid primary key default gen_random_uuid(),
  brand_id text not null references food_brands(id) on delete cascade,
  label text not null,               -- '7.5 kg'
  base_price numeric(10,2) not null check (base_price >= 0),
  unique (brand_id, label)
);

create table pharmacy_products (
  id text primary key,
  name text not null,
  category text not null,
  normal_price numeric(10,2) not null check (normal_price >= 0),
  is_active boolean not null default true
);

create table terms_versions (
  id serial primary key,
  version text not null unique,
  body_md text not null,
  published_at timestamptz not null default now()
);

-- ───────── Miembros ─────────
create table tutors (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null unique,
  phone text not null,
  address text not null,
  national_id text not null unique,   -- cédula
  created_at timestamptz not null default now()
);

create table pets (
  id uuid primary key default gen_random_uuid(),
  tutor_id uuid not null references tutors(id) on delete cascade,
  name text not null,
  species species not null,
  sex pet_sex,
  size pet_size,
  weight_kg numeric(5,2) check (weight_kg > 0),
  age_text text,                      -- UI usa texto libre ("3 años")
  last_deworming date,
  last_vaccine date,
  sterilized boolean,
  photo_path text,                    -- storage bucket 'pet-photos'
  created_at timestamptz not null default now()
);

create sequence membership_seq start 1000;

create table memberships (
  id uuid primary key default gen_random_uuid(),
  code text not null unique
    default ('PG-' || extract(year from now())::int || '-' || nextval('membership_seq')),
  tutor_id uuid not null references tutors(id),
  pet_id uuid not null unique references pets(id),   -- 1 membresía por mascota
  status membership_status not null default 'pendiente',
  registered_at timestamptz not null default now(),
  activated_at timestamptz,           -- 1ª compra de alimento
  valid_until date,                   -- activated_at + 365d
  terms_version_id int not null references terms_versions(id),
  terms_accepted_at timestamptz not null default now()
);
create index on memberships(tutor_id);

-- ───────── Operación ─────────
create table stamp_cycles (            -- ciclo 5+1
  id uuid primary key default gen_random_uuid(),
  membership_id uuid not null references memberships(id) on delete cascade,
  presentation_id uuid not null references food_presentations(id),
  stamps int not null default 0 check (stamps between 0 and 5),
  is_open boolean not null default true,
  created_at timestamptz not null default now()
);
create unique index one_open_cycle on stamp_cycles(membership_id) where is_open;

create table food_purchases (
  id uuid primary key default gen_random_uuid(),
  membership_id uuid not null references memberships(id),
  cycle_id uuid references stamp_cycles(id),
  presentation_id uuid not null references food_presentations(id),
  unit_price numeric(10,2) not null,
  site_id uuid references sites(id),
  staff_id uuid references auth.users(id),
  purchased_at timestamptz not null default now()
);
create index on food_purchases(membership_id);

create table pharmacy_purchases (
  id uuid primary key default gen_random_uuid(),
  membership_id uuid not null references memberships(id),
  subtotal numeric(10,2) not null,
  discount numeric(10,2) not null,
  total numeric(10,2) not null,
  site_id uuid references sites(id),
  staff_id uuid references auth.users(id),
  purchased_at timestamptz not null default now()
);

create table benefit_redemptions (
  id uuid primary key default gen_random_uuid(),
  membership_id uuid not null references memberships(id),
  benefit benefit_type not null,
  cycle_id uuid references stamp_cycles(id),
  site_id uuid references sites(id),
  staff_id uuid references auth.users(id),
  redeemed_at timestamptz not null default now()
);
-- bano / consulta: máx 1 por membresía
create unique index one_bano on benefit_redemptions(membership_id) where benefit = 'bano';
create unique index one_consulta on benefit_redemptions(membership_id) where benefit = 'consulta';

create table staff_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role staff_role not null default 'cajero',
  site_id uuid references sites(id)
);

-- ───────── Lógica 5+1 ─────────
-- Registra compra de alimento: activa membresía, suma sello, cierra ciclo al llegar a 5.
-- Si cambia la presentación (marca/línea/tamaño) el ciclo abierto se descarta y empieza uno nuevo (T&C §2).
create or replace function record_food_purchase(
  p_membership uuid, p_presentation uuid, p_site uuid, p_staff uuid
) returns jsonb language plpgsql security definer as $$
declare
  m memberships; c stamp_cycles; price numeric;
begin
  select * into m from memberships where id = p_membership for update;
  if not found then raise exception 'membership_not_found'; end if;
  if m.status in ('vencida','cancelada') or (m.valid_until is not null and m.valid_until < current_date) then
    raise exception 'membership_not_active';
  end if;

  select base_price into price from food_presentations where id = p_presentation;
  if price is null then raise exception 'presentation_not_found'; end if;

  if m.status = 'pendiente' then
    update memberships set status='activa', activated_at=now(),
      valid_until=(current_date + 365) where id = m.id;
  end if;

  select * into c from stamp_cycles where membership_id = m.id and is_open for update;
  if found and c.presentation_id <> p_presentation then
    update stamp_cycles set is_open=false where id = c.id;
    c := null;
  end if;
  if c.id is null then
    insert into stamp_cycles(membership_id, presentation_id) values (m.id, p_presentation) returning * into c;
  end if;

  if c.stamps >= 5 then raise exception 'free_bag_pending'; end if;
  update stamp_cycles set stamps = stamps + 1 where id = c.id returning * into c;

  insert into food_purchases(membership_id, cycle_id, presentation_id, unit_price, site_id, staff_id)
  values (m.id, c.id, p_presentation, price, p_site, p_staff);

  return jsonb_build_object('cycle_id', c.id, 'stamps', c.stamps, 'free_bag_available', c.stamps = 5);
end $$;

-- Canjea beneficio (bolsa gratis / baño / consulta).
create or replace function redeem_benefit(
  p_membership uuid, p_benefit benefit_type, p_site uuid, p_staff uuid
) returns uuid language plpgsql security definer as $$
declare m memberships; c stamp_cycles; rid uuid;
begin
  select * into m from memberships where id = p_membership for update;
  if not found or m.status <> 'activa' or m.valid_until < current_date then
    raise exception 'membership_not_active';
  end if;

  if p_benefit = 'bolsa_gratis' then
    select * into c from stamp_cycles where membership_id = m.id and is_open and stamps = 5 for update;
    if not found then raise exception 'no_free_bag'; end if;
    update stamp_cycles set is_open = false where id = c.id;
  end if;

  insert into benefit_redemptions(membership_id, benefit, cycle_id, site_id, staff_id)
  values (m.id, p_benefit, c.id, p_site, p_staff) returning id into rid;
  return rid;
end $$;

-- Vista para el carnet digital
create or replace view member_card as
select m.code, m.status, m.registered_at, m.valid_until,
       t.full_name, t.email, t.phone, t.address, t.national_id,
       p.name as pet_name, p.species, p.sex, p.size, p.weight_kg, p.age_text,
       p.last_deworming, p.last_vaccine, p.sterilized, p.photo_path,
       coalesce((select stamps from stamp_cycles s where s.membership_id = m.id and s.is_open), 0) as stamps,
       m.status = 'activa' as pharmacy_discount_active,
       not exists (select 1 from benefit_redemptions r where r.membership_id = m.id and r.benefit='bano') as bath_available,
       not exists (select 1 from benefit_redemptions r where r.membership_id = m.id and r.benefit='consulta') as consult_available
from memberships m join tutors t on t.id = m.tutor_id join pets p on p.id = m.pet_id;

-- ───────── RLS ─────────
-- El backend usa service_role (bypass). Se bloquea todo acceso directo desde anon/authenticated.
alter table tutors enable row level security;
alter table pets enable row level security;
alter table memberships enable row level security;
alter table stamp_cycles enable row level security;
alter table food_purchases enable row level security;
alter table pharmacy_purchases enable row level security;
alter table benefit_redemptions enable row level security;
alter table staff_profiles enable row level security;
alter table sites enable row level security;
alter table terms_versions enable row level security;
alter table food_brands enable row level security;
alter table food_presentations enable row level security;
alter table pharmacy_products enable row level security;

-- Catálogo público de solo lectura
create policy "public read brands" on food_brands for select using (is_active);
create policy "public read presentations" on food_presentations for select using (true);
create policy "public read pharmacy" on pharmacy_products for select using (is_active);
create policy "public read terms" on terms_versions for select using (true);
create policy "public read sites" on sites for select using (is_active);

-- Funciones y vista con PII: solo backend (service_role). PostgREST no debe exponerlas.
revoke execute on function record_food_purchase(uuid,uuid,uuid,uuid), redeem_benefit(uuid,benefit_type,uuid,uuid)
  from public, anon, authenticated;
revoke all on member_card from anon, authenticated;

-- Bucket fotos
insert into storage.buckets (id, name, public) values ('pet-photos','pet-photos', false)
on conflict do nothing;
