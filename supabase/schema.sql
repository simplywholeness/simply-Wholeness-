create extension if not exists "pgcrypto";

create type public.app_role as enum ('client', 'coach');
create type public.habit_category as enum ('mind', 'body', 'spirit', 'integration');
create type public.goal_status as enum ('not_started', 'in_progress', 'complete');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  email text,
  role public.app_role not null default 'client',
  coach_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.daily_check_ins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  check_in_date date not null default current_date,
  mind text not null default '',
  body text not null default '',
  spirit text not null default '',
  integration text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, check_in_date)
);

create table public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  category public.habit_category not null default 'mind',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.habit_completions (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid not null references public.habits(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  completed_on date not null default current_date,
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  unique (habit_id, completed_on)
);

create table public.morning_routine (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  completed_on date not null default current_date,
  item_key text not null,
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  unique (user_id, completed_on, item_key)
);

create table public.weekly_reflections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  week_start date not null,
  wins text not null default '',
  challenges text not null default '',
  energy int not null default 5 check (energy between 1 and 10),
  stress int not null default 5 check (stress between 1 and 10),
  lessons_learned text not null default '',
  focus_next_week text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, week_start)
);

create table public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  why text not null default '',
  target_date date,
  status public.goal_status not null default 'not_started',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  body text not null,
  created_at timestamptz not null default now()
);

create table public.encouragement_comments (
  id uuid primary key default gen_random_uuid(),
  coach_id uuid not null references public.profiles(id) on delete cascade,
  client_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'client')::public.app_role
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.daily_check_ins enable row level security;
alter table public.habits enable row level security;
alter table public.habit_completions enable row level security;
alter table public.morning_routine enable row level security;
alter table public.weekly_reflections enable row level security;
alter table public.goals enable row level security;
alter table public.journal_entries enable row level security;
alter table public.encouragement_comments enable row level security;

create or replace function public.is_coach()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'coach'
  );
$$;

create policy "Profiles are visible to self and coaches"
on public.profiles for select
to authenticated
using (id = auth.uid() or public.is_coach());

create policy "Users can update their own profile"
on public.profiles for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

create policy "Clients manage own check-ins"
on public.daily_check_ins for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "Coaches view check-ins"
on public.daily_check_ins for select
to authenticated
using (public.is_coach());

create policy "Clients manage own habits"
on public.habits for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "Coaches view habits"
on public.habits for select
to authenticated
using (public.is_coach());

create policy "Clients manage own habit completions"
on public.habit_completions for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "Coaches view habit completions"
on public.habit_completions for select
to authenticated
using (public.is_coach());

create policy "Clients manage own routine"
on public.morning_routine for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "Coaches view routine"
on public.morning_routine for select
to authenticated
using (public.is_coach());

create policy "Clients manage own reflections"
on public.weekly_reflections for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "Coaches view reflections"
on public.weekly_reflections for select
to authenticated
using (public.is_coach());

create policy "Clients manage own goals"
on public.goals for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "Coaches view goals"
on public.goals for select
to authenticated
using (public.is_coach());

create policy "Clients manage own journal"
on public.journal_entries for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "Coaches view journal"
on public.journal_entries for select
to authenticated
using (public.is_coach());

create policy "Clients and coaches view comments"
on public.encouragement_comments for select
to authenticated
using (client_id = auth.uid() or coach_id = auth.uid() or public.is_coach());

create policy "Coaches create comments"
on public.encouragement_comments for insert
to authenticated
with check (coach_id = auth.uid() and public.is_coach());

create index daily_check_ins_user_date_idx on public.daily_check_ins (user_id, check_in_date desc);
create index habit_completions_user_date_idx on public.habit_completions (user_id, completed_on desc);
create index weekly_reflections_user_week_idx on public.weekly_reflections (user_id, week_start desc);
create index encouragement_client_idx on public.encouragement_comments (client_id, created_at desc);
