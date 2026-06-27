-- PRODUCTS TABLE
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  unit text not null,
  in_stock boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- PUBLIC READ-ONLY ACCESS FOR SHOP
alter table public.products enable row level security;
create policy "products select all" on public.products for select using (true);

-- INSERT SPICES
insert into public.products (name, description, unit, in_stock) values
  ('Cardamom', 'Premium green cardamom from Kerala', 'kg', true),
  ('Saffron', 'Pure Kashmiri saffron threads', 'grams', true),
  ('Black Pepper', 'Bold Malabar black pepper', 'kg', true),
  ('Cinnamon', 'Ceylon true cinnamon sticks', 'kg', true),
  ('Cloves', 'Aromatic whole cloves', 'kg', true),
  ('Turmeric', 'High-curcumin Erode turmeric powder', 'kg', true),
  ('Cumin', 'Rajasthan cumin seeds', 'kg', true),
  ('Coriander', 'Whole coriander seeds', 'kg', true)
on conflict (name) do nothing;
