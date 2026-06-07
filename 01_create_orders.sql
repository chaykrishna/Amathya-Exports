-- Run this in your Supabase dashboard → SQL Editor

-- 1. Products table
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  unit text not null default 'kg',
  image_url text,
  in_stock boolean default true,
  created_at timestamptz default now()
);

-- 2. Orders table
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null default 'ORD-' || upper(substr(gen_random_uuid()::text, 1, 8)),
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  customer_address text not null,
  status text not null default 'pending',
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. Order items table
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  product_name text not null,
  quantity numeric not null,
  unit text not null default 'kg',
  created_at timestamptz default now()
);

-- 4. Enable RLS
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- 5. RLS Policies
create policy "Anyone can view products" on public.products for select using (true);
create policy "Anyone can insert orders" on public.orders for insert with check (true);
create policy "Anyone can view orders" on public.orders for select using (true);
create policy "Anyone can update orders" on public.orders for update using (true);
create policy "Anyone can insert order items" on public.order_items for insert with check (true);
create policy "Anyone can view order items" on public.order_items for select using (true);

-- 6. Seed spice products
insert into public.products (name, description, unit) values
  ('Cardamom', 'Premium green cardamom from Kerala', 'kg'),
  ('Saffron', 'Pure Kashmiri saffron threads', 'grams'),
  ('Black Pepper', 'Bold Malabar black pepper', 'kg'),
  ('Cinnamon', 'Ceylon true cinnamon sticks', 'kg'),
  ('Cloves', 'Aromatic whole cloves', 'kg'),
  ('Turmeric', 'High-curcumin Erode turmeric powder', 'kg'),
  ('Cumin', 'Rajasthan cumin seeds', 'kg'),
  ('Coriander', 'Whole coriander seeds', 'kg');
