-- Mega Eletrônicos & Personalizados — Supabase schema
-- Execute no SQL Editor do projeto Supabase antes de usar checkout/auth.

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  share_token uuid not null unique default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'awaiting_confirmation',
  customer jsonb not null,
  delivery jsonb not null,
  payment jsonb not null default '{}'::jsonb,
  items jsonb not null default '[]'::jsonb,
  subtotal numeric(12, 2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_user_created_idx on public.orders (user_id, created_at desc);
create index if not exists orders_share_token_idx on public.orders (share_token);

alter table public.orders enable row level security;

drop policy if exists "Clients can read their own orders" on public.orders;
create policy "Clients can read their own orders"
  on public.orders for select
  to authenticated
  using (auth.uid() = user_id);

-- Pedidos são criados e lidos pelo vendedor exclusivamente via service role no servidor.
-- Não crie políticas de INSERT/UPDATE para anon ou authenticated.

create or replace function public.touch_orders_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists orders_touch_updated_at on public.orders;
create trigger orders_touch_updated_at
before update on public.orders
for each row execute function public.touch_orders_updated_at();

-- Bucket privado para originais e prévias.
insert into storage.buckets (id, name, public)
values ('order-assets', 'order-assets', false)
on conflict (id) do nothing;

-- Sem políticas de storage para anon/authenticated: os arquivos são acessados
-- apenas pelo servidor (service role), que gera links assinados temporários.
