-- Prevent privilege escalation by blocking role changes from non-admin users.

create or replace function public.prevent_non_admin_role_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role then
    if not exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role = 'admin'
    ) then
      raise exception 'Only admins can change profile roles';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists prevent_non_admin_role_change_trigger on public.profiles;
create trigger prevent_non_admin_role_change_trigger
before update on public.profiles
for each row
execute function public.prevent_non_admin_role_change();
