-- Synced app data. The phone keeps its own copy (the local cache) and this table is the backup
-- that keeps a person's devices in step. One row per item from a local store, e.g. kind
-- 'appointment' + key '<id>', or kind 'check_in' + key '2026-10-20'.
-- See docs/architecture/backend.md (section 6, Sync).

create table public.sync_items (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  kind text not null check (kind ~ '^[a-z][a-z0-9_]{0,39}$'),
  key text not null check (char_length(key) between 1 and 100),
  data jsonb,
  -- Deletions are kept as tombstones so other devices learn about them.
  deleted boolean not null default false,
  -- When the item was changed on the phone; decides which edit wins.
  client_updated_at timestamptz not null,
  -- When the server stored it; devices pull changes since their last sync.
  updated_at timestamptz not null default clock_timestamp(),
  primary key (user_id, kind, key),
  constraint sync_items_data_size check (data is null or octet_length(data::text) <= 262144),
  constraint sync_items_data_present check (deleted or data is not null)
);

comment on table public.sync_items is
  'Per-user copy of the app''s local stores, synced from each device. Row-level security: own rows only.';

create index sync_items_user_updated_at on public.sync_items (user_id, updated_at);

-- Last write wins per item, by the time it was changed on the phone. A late-arriving older edit
-- keeps the newer row. Phone clocks can be wrong, so times too far in the future are capped.
create function public.sync_items_resolve()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.client_updated_at := least(new.client_updated_at, clock_timestamp() + interval '5 minutes');
  if tg_op = 'UPDATE' then
    if new.client_updated_at < old.client_updated_at then
      return old;
    end if;
    new.user_id := old.user_id;
  end if;
  if new.deleted then
    new.data := null;
  end if;
  new.updated_at := clock_timestamp();
  return new;
end;
$$;

create trigger sync_items_resolve
before insert or update on public.sync_items
for each row execute function public.sync_items_resolve();

-- Row-level security: signed-in users read and write only their own rows. There is no delete
-- policy: items are soft-deleted (deleted = true), and deleting the account removes everything.
alter table public.sync_items enable row level security;

create policy "Users read their own items"
on public.sync_items for select to authenticated
using ((select auth.uid()) = user_id);

create policy "Users add their own items"
on public.sync_items for insert to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users update their own items"
on public.sync_items for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

revoke all on public.sync_items from anon, authenticated;
grant select, insert, update on public.sync_items to authenticated;

-- Lets a signed-in person delete their own account and, through the cascade, all their data.
create function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'Not signed in' using errcode = '28000';
  end if;
  delete from auth.users where id = auth.uid();
end;
$$;

revoke execute on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
