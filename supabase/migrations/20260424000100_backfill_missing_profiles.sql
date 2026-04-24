-- Backfill missing profile rows for existing auth users while avoiding duplicate-email conflicts.

insert into public.profiles (id, email, role)
select
  au.id,
  case
    when exists (
      select 1
      from public.profiles p
      where lower(p.email) = lower(au.email)
        and p.id <> au.id
    ) then au.id::text || '@local.invalid'
    else au.email
  end,
  'user'
from auth.users au
left join public.profiles p on p.id = au.id
where p.id is null
on conflict (id) do nothing;