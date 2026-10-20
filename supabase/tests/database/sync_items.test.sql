-- Row-level security and conflict rules for sync_items. Run with: pnpm db:test
begin;
create extension if not exists pgtap with schema extensions;
select plan(15);

-- Two people, Asha and Ravi.
insert into auth.users (id, aud, role, phone)
values
  ('00000000-0000-0000-0000-00000000000a', 'authenticated', 'authenticated', '910000000101'),
  ('00000000-0000-0000-0000-00000000000b', 'authenticated', 'authenticated', '910000000102');

-- Act as Asha.
set local role authenticated;
set local request.jwt.claims = '{"sub": "00000000-0000-0000-0000-00000000000a", "role": "authenticated"}';

insert into public.sync_items (kind, key, data, client_updated_at)
values ('check_in', '2026-10-20', '{"pain": 3}', '2026-10-20 09:00+05:30');

select is(
  (select user_id::text from public.sync_items where kind = 'check_in'),
  '00000000-0000-0000-0000-00000000000a',
  'user_id defaults to the signed-in user'
);

select throws_ok(
  $$ insert into public.sync_items (user_id, kind, key, data, client_updated_at)
     values ('00000000-0000-0000-0000-00000000000b', 'check_in', 'x', '{}', now()) $$,
  '42501',
  null,
  'cannot write rows for someone else'
);

-- An older edit arriving late does not overwrite a newer one.
update public.sync_items set data = '{"pain": 1}', client_updated_at = '2026-10-20 08:00+05:30'
where kind = 'check_in';
select is(
  (select data ->> 'pain' from public.sync_items where kind = 'check_in'),
  '3',
  'older edit is ignored (last write wins)'
);

update public.sync_items set data = '{"pain": 5}', client_updated_at = '2026-10-20 10:00+05:30'
where kind = 'check_in';
select is(
  (select data ->> 'pain' from public.sync_items where kind = 'check_in'),
  '5',
  'newer edit replaces the item'
);

-- Upsert, as the app sends it.
insert into public.sync_items (kind, key, data, client_updated_at)
values ('check_in', '2026-10-20', '{"pain": 2}', '2026-10-20 11:00+05:30')
on conflict (user_id, kind, key) do update
  set data = excluded.data, client_updated_at = excluded.client_updated_at, deleted = excluded.deleted;
select is(
  (select data ->> 'pain' from public.sync_items where kind = 'check_in'),
  '2',
  'upsert applies a newer edit'
);

insert into public.sync_items (kind, key, data, client_updated_at)
values ('check_in', '2026-10-20', '{"pain": 8}', '2026-10-20 07:00+05:30')
on conflict (user_id, kind, key) do update
  set data = excluded.data, client_updated_at = excluded.client_updated_at, deleted = excluded.deleted;
select is(
  (select data ->> 'pain' from public.sync_items where kind = 'check_in'),
  '2',
  'upsert ignores an older edit'
);

-- Soft delete clears the data but keeps a tombstone.
update public.sync_items set deleted = true, client_updated_at = '2026-10-20 12:00+05:30'
where kind = 'check_in';
select ok(
  (select deleted and data is null from public.sync_items where kind = 'check_in'),
  'deleting keeps a tombstone without data'
);

-- A phone clock far in the future is capped.
insert into public.sync_items (kind, key, data, client_updated_at)
values ('profile', 'me', '{"name": "Asha"}', now() + interval '1 year');
select ok(
  (select client_updated_at < now() + interval '6 minutes' from public.sync_items where kind = 'profile'),
  'future timestamps are capped'
);

select throws_ok(
  $$ delete from public.sync_items where kind = 'profile' $$,
  '42501',
  null,
  'rows cannot be hard-deleted by the app'
);

select throws_ok(
  $$ insert into public.sync_items (kind, key, data, client_updated_at) values ('Bad Kind!', 'k', '{}', now()) $$,
  '23514',
  null,
  'kind must be a simple lowercase name'
);

-- Act as Ravi: Asha's rows are invisible and untouchable.
set local request.jwt.claims = '{"sub": "00000000-0000-0000-0000-00000000000b", "role": "authenticated"}';

select is((select count(*)::int from public.sync_items), 0, 'cannot see another person''s rows');

update public.sync_items set data = '{"name": "hacked"}', client_updated_at = now() + interval '1 minute';
reset role;
select is(
  (select data ->> 'name' from public.sync_items where kind = 'profile'),
  'Asha',
  'cannot change another person''s rows'
);

-- Signed-out visitors can't read anything.
set local role anon;
set local request.jwt.claims = '{"role": "anon"}';
select throws_ok(
  $$ select * from public.sync_items $$,
  '42501',
  null,
  'signed-out visitors have no access'
);

-- Deleting an account removes all of that person's data.
set local role authenticated;
set local request.jwt.claims = '{"sub": "00000000-0000-0000-0000-00000000000a", "role": "authenticated"}';
select public.delete_my_account();
reset role;
select is(
  (select count(*)::int from public.sync_items where user_id = '00000000-0000-0000-0000-00000000000a'),
  0,
  'deleting the account deletes its data'
);
select is(
  (select count(*)::int from auth.users where id = '00000000-0000-0000-0000-00000000000b'),
  1,
  'other accounts are untouched'
);

select * from finish();
rollback;
