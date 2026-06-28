
-- PROFILES
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  company text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "own profile select" on public.profiles for select using (auth.uid() = id);
create policy "own profile update" on public.profiles for update using (auth.uid() = id);
create policy "own profile insert" on public.profiles for insert with check (auth.uid() = id);

-- auto profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email,'@',1)));
  return new;
end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
for each row execute function public.handle_new_user();

-- SHIPMENTS
create table if not exists public.shipments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  reference text not null,
  origin text not null,
  destination text not null,
  status text not null default 'in_transit',
  eta date,
  progress int not null default 0,
  current_lat numeric,
  current_lng numeric,
  cargo text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.shipments enable row level security;
create policy "own shipments all" on public.shipments for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create index on public.shipments (user_id, created_at desc);

-- STOCK
create table if not exists public.stock_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  sku text not null,
  name text not null,
  quantity int not null default 0,
  unit text not null default 'units',
  location text,
  updated_at timestamptz not null default now()
);
alter table public.stock_items enable row level security;
create policy "own stock all" on public.stock_items for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- NOTIFICATIONS
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  message text,
  category text default 'info',
  read boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.notifications enable row level security;
create policy "own notif select" on public.notifications for select using (auth.uid() = user_id);
create policy "own notif update" on public.notifications for update using (auth.uid() = user_id);
create policy "own notif insert" on public.notifications for insert with check (auth.uid() = user_id);
create index on public.notifications (user_id, created_at desc);

-- realtime
alter publication supabase_realtime add table public.shipments;
