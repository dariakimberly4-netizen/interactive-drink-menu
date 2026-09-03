-- Menu Orbit — Barista / Service Crew Operations Backend
-- Safe additive migration. Review against the live Supabase schema before running in production.
-- This migration does not delete existing production data and does not expose a service-role key.

begin;

create extension if not exists pgcrypto;

-- ---------- ENUM-LIKE CHECK VALUES ARE IMPLEMENTED AS TEXT CHECKS ----------
-- This keeps the migration easier to extend without destructive enum migrations.

-- ---------- STAFF PROFILES ----------
create table if not exists public.mo_staff_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  full_name text not null,
  email text,
  role text not null default 'barista' check (role in ('barista','service_crew','shift_supervisor','manager','administrator')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.mo_branch_assignments (
  id uuid primary key default gen_random_uuid(),
  staff_id uuid not null references public.mo_staff_profiles(id) on delete cascade,
  branch_key text not null,
  is_primary boolean not null default true,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique(staff_id, branch_key)
);

create table if not exists public.mo_station_assignments (
  id uuid primary key default gen_random_uuid(),
  staff_id uuid not null references public.mo_staff_profiles(id) on delete cascade,
  branch_key text not null,
  station text not null check (station in ('Espresso Bar','Cold Bar','Food Station','Handoff','Float / Support')),
  shift_status text not null default 'off_shift' check (shift_status in ('off_shift','clocked_in','break')),
  active boolean not null default true,
  assigned_at timestamptz not null default now(),
  assigned_by uuid references public.mo_staff_profiles(id),
  unique(staff_id, branch_key, active)
);

-- ---------- SHIFTS ----------
create table if not exists public.mo_shift_sessions (
  id uuid primary key default gen_random_uuid(),
  staff_id uuid not null references public.mo_staff_profiles(id) on delete cascade,
  branch_key text not null,
  station text,
  clock_in_at timestamptz not null default now(),
  clock_out_at timestamptz,
  handover_note text,
  created_at timestamptz not null default now(),
  check (clock_out_at is null or clock_out_at >= clock_in_at)
);

create index if not exists mo_shift_sessions_staff_idx on public.mo_shift_sessions(staff_id, clock_in_at desc);
create index if not exists mo_shift_sessions_branch_idx on public.mo_shift_sessions(branch_key, clock_in_at desc);

-- ---------- ITEM-LEVEL PREPARATION ----------
-- Existing order/order_item IDs are stored as text so this remains compatible whether the current project uses UUIDs or another ID type.
create table if not exists public.mo_order_item_preparation (
  id uuid primary key default gen_random_uuid(),
  order_id text not null,
  order_item_id text not null,
  product_id text,
  product_name text not null,
  quantity numeric not null default 1 check (quantity > 0),
  size text,
  style text,
  milk text,
  sugar_level text,
  ice_level text,
  add_ons jsonb not null default '[]'::jsonb,
  special_request text,
  dietary_allergy_note text,
  branch_key text not null,
  assigned_station text,
  assigned_staff_id uuid references public.mo_staff_profiles(id),
  preparation_status text not null default 'not_started' check (preparation_status in ('not_started','in_progress','done','problem')),
  started_at timestamptz,
  completed_at timestamptz,
  inventory_deducted_at timestamptz,
  idempotency_key text,
  version integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(order_item_id)
);

create index if not exists mo_item_prep_order_idx on public.mo_order_item_preparation(order_id);
create index if not exists mo_item_prep_branch_status_idx on public.mo_order_item_preparation(branch_key, preparation_status);
create index if not exists mo_item_prep_staff_idx on public.mo_order_item_preparation(assigned_staff_id, preparation_status);

-- ---------- INVENTORY + RECIPES ----------
create table if not exists public.mo_inventory_items (
  id uuid primary key default gen_random_uuid(),
  branch_key text not null,
  item_key text not null,
  item_name text not null,
  category text not null check (category in ('PRODUCTS','INGREDIENTS','PACKAGING')),
  current_quantity numeric not null default 0 check (current_quantity >= 0),
  unit text not null,
  low_stock_threshold numeric not null default 0 check (low_stock_threshold >= 0),
  reorder_threshold numeric not null default 0 check (reorder_threshold >= 0),
  manual_override_status text check (manual_override_status is null or manual_override_status in ('AVAILABLE','LOW STOCK','SOLD OUT')),
  manual_override_expires_at timestamptz,
  updated_by uuid references public.mo_staff_profiles(id),
  updated_at timestamptz not null default now(),
  unique(branch_key, item_key)
);

create index if not exists mo_inventory_branch_category_idx on public.mo_inventory_items(branch_key, category);

create table if not exists public.mo_recipe_items (
  id uuid primary key default gen_random_uuid(),
  product_key text not null,
  size_key text not null default '',
  inventory_item_key text not null,
  quantity_required numeric not null check (quantity_required > 0),
  unit text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique(product_key, size_key, inventory_item_key)
);

create table if not exists public.mo_inventory_transactions (
  id uuid primary key default gen_random_uuid(),
  branch_key text not null,
  inventory_item_id uuid not null references public.mo_inventory_items(id),
  order_id text,
  order_item_id text,
  transaction_type text not null check (transaction_type in ('DEDUCTION','RESTOCK','ADJUSTMENT','REVERSAL')),
  quantity_delta numeric not null,
  unit text not null,
  idempotency_key text unique,
  performed_by uuid references public.mo_staff_profiles(id),
  reason text,
  created_at timestamptz not null default now()
);

create index if not exists mo_inventory_tx_branch_idx on public.mo_inventory_transactions(branch_key, created_at desc);

-- ---------- SUBSTITUTIONS ----------
create table if not exists public.mo_substitution_requests (
  id uuid primary key default gen_random_uuid(),
  order_id text not null,
  order_item_id text,
  branch_key text not null,
  unavailable_item text not null,
  proposed_substitute text not null,
  proposed_by uuid references public.mo_staff_profiles(id),
  proposed_at timestamptz not null default now(),
  customer_response text not null default 'pending' check (customer_response in ('pending','accepted','declined')),
  response_at timestamptz,
  note text
);

create index if not exists mo_substitution_order_idx on public.mo_substitution_requests(order_id, proposed_at desc);

-- ---------- PICKUP VERIFICATION ----------
create table if not exists public.mo_pickup_verification (
  id uuid primary key default gen_random_uuid(),
  order_id text not null unique,
  branch_key text not null,
  pickup_pin_hash text,
  qr_token_hash text,
  verified boolean not null default false,
  verification_method text check (verification_method is null or verification_method in ('order_number','pin','qr')),
  verified_by uuid references public.mo_staff_profiles(id),
  verified_at timestamptz,
  created_at timestamptz not null default now()
);

-- ---------- ESCALATIONS ----------
create table if not exists public.mo_escalations (
  id uuid primary key default gen_random_uuid(),
  escalation_ref text not null unique default ('ESC-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,8))),
  order_id text,
  branch_key text not null,
  staff_id uuid not null references public.mo_staff_profiles(id),
  category text not null check (category in ('refund_issue','serious_customer_complaint','inventory_override','machine_failure','payment_dispute','customer_substitution_dispute','incorrect_order','security_concern')),
  priority text not null default 'normal' check (priority in ('normal','urgent','critical')),
  description text not null,
  manager_id uuid references public.mo_staff_profiles(id),
  status text not null default 'OPEN' check (status in ('OPEN','ACKNOWLEDGED','IN REVIEW','RESOLVED','REJECTED')),
  resolution text,
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create index if not exists mo_escalations_branch_status_idx on public.mo_escalations(branch_key, status, created_at desc);

-- ---------- EQUIPMENT ----------
create table if not exists public.mo_equipment (
  id uuid primary key default gen_random_uuid(),
  branch_key text not null,
  equipment_key text not null,
  equipment_name text not null,
  station text,
  status text not null default 'WORKING' check (status in ('WORKING','LIMITED','MAINTENANCE','DOWN')),
  note text,
  updated_by uuid references public.mo_staff_profiles(id),
  updated_at timestamptz not null default now(),
  unique(branch_key, equipment_key)
);

-- ---------- CUSTOMER NOTIFICATIONS ----------
create table if not exists public.mo_customer_notifications (
  id uuid primary key default gen_random_uuid(),
  order_id text not null,
  branch_key text not null,
  event_type text not null check (event_type in ('order_accepted','preparation_started','substitution_request','order_ready','problem_requires_response','order_released','order_cancelled')),
  title text not null,
  message text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists mo_notifications_order_idx on public.mo_customer_notifications(order_id, created_at desc);

-- ---------- AUDIT LOG ----------
create table if not exists public.mo_audit_log (
  id bigint generated always as identity primary key,
  staff_id uuid references public.mo_staff_profiles(id),
  staff_name text,
  branch_key text not null,
  order_id text,
  order_item_id text,
  action text not null,
  previous_value jsonb,
  new_value jsonb,
  session_id text,
  created_at timestamptz not null default now()
);

create index if not exists mo_audit_branch_time_idx on public.mo_audit_log(branch_key, created_at desc);
create index if not exists mo_audit_order_idx on public.mo_audit_log(order_id, created_at desc);

-- ---------- QUALITY CHECK + HANDOVER CONFIG ----------
create table if not exists public.mo_branch_operations_config (
  branch_key text primary key,
  quality_check_required boolean not null default false,
  ready_unclaimed_minutes integer not null default 15 check (ready_unclaimed_minutes >= 1),
  sound_alert_enabled boolean not null default true,
  updated_by uuid references public.mo_staff_profiles(id),
  updated_at timestamptz not null default now()
);

create table if not exists public.mo_quality_checks (
  id uuid primary key default gen_random_uuid(),
  order_id text not null unique,
  branch_key text not null,
  correct_drinks boolean not null default false,
  correct_sizes boolean not null default false,
  correct_modifications boolean not null default false,
  food_included boolean not null default false,
  packaging_complete boolean not null default false,
  checked_by uuid references public.mo_staff_profiles(id),
  checked_at timestamptz,
  created_at timestamptz not null default now()
);

-- ---------- HELPER FUNCTIONS ----------
create or replace function public.mo_current_staff_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id from public.mo_staff_profiles where user_id = auth.uid() and active = true limit 1;
$$;

create or replace function public.mo_is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists(
    select 1 from public.mo_staff_profiles
    where user_id = auth.uid() and active = true and role = 'administrator'
  );
$$;

create or replace function public.mo_is_manager_for_branch(p_branch text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists(
    select 1
    from public.mo_staff_profiles s
    join public.mo_branch_assignments b on b.staff_id = s.id and b.active = true
    where s.user_id = auth.uid()
      and s.active = true
      and s.role in ('manager','administrator')
      and (s.role = 'administrator' or b.branch_key = p_branch)
  );
$$;

create or replace function public.mo_staff_can_access_branch(p_branch text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.mo_is_admin() or exists(
    select 1
    from public.mo_staff_profiles s
    join public.mo_branch_assignments b on b.staff_id = s.id
    where s.user_id = auth.uid() and s.active = true and b.active = true and b.branch_key = p_branch
  );
$$;

-- Atomic item claim: prevents two staff members from claiming the same item.
create or replace function public.mo_claim_order_item(p_item_id uuid)
returns public.mo_order_item_preparation
language plpgsql
security definer
set search_path = public
as $$
declare
  v_staff uuid := public.mo_current_staff_id();
  v_row public.mo_order_item_preparation;
begin
  if v_staff is null then raise exception 'Unauthorized staff account'; end if;

  update public.mo_order_item_preparation
     set assigned_staff_id = v_staff,
         preparation_status = 'in_progress',
         started_at = coalesce(started_at, now()),
         updated_at = now(),
         version = version + 1
   where id = p_item_id
     and preparation_status = 'not_started'
     and public.mo_staff_can_access_branch(branch_key)
  returning * into v_row;

  if v_row.id is null then
    raise exception 'Item is already claimed, unavailable, or outside your branch';
  end if;

  insert into public.mo_audit_log(staff_id, branch_key, order_id, order_item_id, action, new_value)
  values(v_staff, v_row.branch_key, v_row.order_id, v_row.order_item_id, 'ITEM_CLAIMED', jsonb_build_object('status','in_progress'));

  return v_row;
end;
$$;

-- Complete item safely. Inventory deduction is only performed once when recipes are configured.
create or replace function public.mo_complete_order_item(p_item_id uuid, p_idempotency_key text)
returns public.mo_order_item_preparation
language plpgsql
security definer
set search_path = public
as $$
declare
  v_staff uuid := public.mo_current_staff_id();
  v_row public.mo_order_item_preparation;
  v_recipe record;
  v_inv public.mo_inventory_items;
  v_tx_key text;
begin
  if v_staff is null then raise exception 'Unauthorized staff account'; end if;
  if p_idempotency_key is null or length(trim(p_idempotency_key)) < 8 then raise exception 'Idempotency key required'; end if;

  select * into v_row from public.mo_order_item_preparation where id = p_item_id for update;
  if v_row.id is null then raise exception 'Item not found'; end if;
  if not public.mo_staff_can_access_branch(v_row.branch_key) then raise exception 'Branch access denied'; end if;
  if v_row.assigned_staff_id is distinct from v_staff and not public.mo_is_manager_for_branch(v_row.branch_key) then raise exception 'Item is assigned to another staff member'; end if;

  if v_row.preparation_status = 'done' then return v_row; end if;
  if v_row.preparation_status not in ('in_progress','not_started') then raise exception 'Item cannot be completed from current state'; end if;

  if v_row.inventory_deducted_at is null and v_row.product_id is not null then
    for v_recipe in
      select * from public.mo_recipe_items
      where product_key = v_row.product_id
        and active = true
        and (size_key = coalesce(v_row.size,'') or size_key = '')
    loop
      select * into v_inv
      from public.mo_inventory_items
      where branch_key = v_row.branch_key and item_key = v_recipe.inventory_item_key
      for update;

      if v_inv.id is null then raise exception 'INSUFFICIENT STOCK: inventory item % is not configured', v_recipe.inventory_item_key; end if;
      if v_inv.current_quantity < (v_recipe.quantity_required * v_row.quantity) then
        raise exception 'INSUFFICIENT STOCK: %', v_inv.item_name;
      end if;

      v_tx_key := p_idempotency_key || ':' || v_inv.id::text;
      if not exists(select 1 from public.mo_inventory_transactions where idempotency_key = v_tx_key) then
        update public.mo_inventory_items
          set current_quantity = current_quantity - (v_recipe.quantity_required * v_row.quantity),
              updated_by = v_staff,
              updated_at = now()
        where id = v_inv.id;

        insert into public.mo_inventory_transactions(branch_key, inventory_item_id, order_id, order_item_id, transaction_type, quantity_delta, unit, idempotency_key, performed_by, reason)
        values(v_row.branch_key, v_inv.id, v_row.order_id, v_row.order_item_id, 'DEDUCTION', -(v_recipe.quantity_required * v_row.quantity), v_inv.unit, v_tx_key, v_staff, 'Order item completed');
      end if;
    end loop;
  end if;

  update public.mo_order_item_preparation
     set preparation_status='done',
         completed_at=now(),
         inventory_deducted_at=coalesce(inventory_deducted_at, now()),
         idempotency_key=p_idempotency_key,
         updated_at=now(),
         version=version+1
   where id=p_item_id
  returning * into v_row;

  insert into public.mo_audit_log(staff_id, branch_key, order_id, order_item_id, action, new_value)
  values(v_staff, v_row.branch_key, v_row.order_id, v_row.order_item_id, 'ITEM_COMPLETED', jsonb_build_object('status','done'));

  return v_row;
end;
$$;

create or replace function public.mo_order_all_items_done(p_order_id text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists(select 1 from public.mo_order_item_preparation where order_id = p_order_id)
     and not exists(select 1 from public.mo_order_item_preparation where order_id = p_order_id and preparation_status <> 'done');
$$;

create or replace function public.mo_inventory_status(p_inventory public.mo_inventory_items)
returns text
language sql
stable
as $$
  select case
    when p_inventory.manual_override_status is not null
      and (p_inventory.manual_override_expires_at is null or p_inventory.manual_override_expires_at > now()) then p_inventory.manual_override_status
    when p_inventory.current_quantity <= 0 then 'SOLD OUT'
    when p_inventory.current_quantity <= p_inventory.low_stock_threshold then 'LOW STOCK'
    else 'AVAILABLE'
  end;
$$;

-- ---------- RLS ----------
alter table public.mo_staff_profiles enable row level security;
alter table public.mo_branch_assignments enable row level security;
alter table public.mo_station_assignments enable row level security;
alter table public.mo_shift_sessions enable row level security;
alter table public.mo_order_item_preparation enable row level security;
alter table public.mo_inventory_items enable row level security;
alter table public.mo_recipe_items enable row level security;
alter table public.mo_inventory_transactions enable row level security;
alter table public.mo_substitution_requests enable row level security;
alter table public.mo_pickup_verification enable row level security;
alter table public.mo_escalations enable row level security;
alter table public.mo_equipment enable row level security;
alter table public.mo_customer_notifications enable row level security;
alter table public.mo_audit_log enable row level security;
alter table public.mo_branch_operations_config enable row level security;
alter table public.mo_quality_checks enable row level security;

-- Drop only policies owned by this migration so reruns are safe.
drop policy if exists mo_staff_self_read on public.mo_staff_profiles;
create policy mo_staff_self_read on public.mo_staff_profiles for select using (user_id = auth.uid() or public.mo_is_admin());

drop policy if exists mo_staff_admin_manage on public.mo_staff_profiles;
create policy mo_staff_admin_manage on public.mo_staff_profiles for all using (public.mo_is_admin()) with check (public.mo_is_admin());

drop policy if exists mo_branch_assignment_read on public.mo_branch_assignments;
create policy mo_branch_assignment_read on public.mo_branch_assignments for select using (staff_id = public.mo_current_staff_id() or public.mo_is_admin());

drop policy if exists mo_branch_assignment_manage on public.mo_branch_assignments;
create policy mo_branch_assignment_manage on public.mo_branch_assignments for all using (public.mo_is_admin() or public.mo_is_manager_for_branch(branch_key)) with check (public.mo_is_admin() or public.mo_is_manager_for_branch(branch_key));

drop policy if exists mo_station_read on public.mo_station_assignments;
create policy mo_station_read on public.mo_station_assignments for select using (public.mo_staff_can_access_branch(branch_key));

drop policy if exists mo_station_manage on public.mo_station_assignments;
create policy mo_station_manage on public.mo_station_assignments for all using (public.mo_is_manager_for_branch(branch_key)) with check (public.mo_is_manager_for_branch(branch_key));

drop policy if exists mo_shift_branch_access on public.mo_shift_sessions;
create policy mo_shift_branch_access on public.mo_shift_sessions for select using (public.mo_staff_can_access_branch(branch_key));

drop policy if exists mo_shift_self_write on public.mo_shift_sessions;
create policy mo_shift_self_write on public.mo_shift_sessions for insert with check (staff_id = public.mo_current_staff_id() and public.mo_staff_can_access_branch(branch_key));

drop policy if exists mo_shift_self_update on public.mo_shift_sessions;
create policy mo_shift_self_update on public.mo_shift_sessions for update using (staff_id = public.mo_current_staff_id() or public.mo_is_manager_for_branch(branch_key)) with check (staff_id = public.mo_current_staff_id() or public.mo_is_manager_for_branch(branch_key));

drop policy if exists mo_item_branch_read on public.mo_order_item_preparation;
create policy mo_item_branch_read on public.mo_order_item_preparation for select using (public.mo_staff_can_access_branch(branch_key));

drop policy if exists mo_item_branch_write on public.mo_order_item_preparation;
create policy mo_item_branch_write on public.mo_order_item_preparation for all using (public.mo_staff_can_access_branch(branch_key)) with check (public.mo_staff_can_access_branch(branch_key));

drop policy if exists mo_inventory_branch_read on public.mo_inventory_items;
create policy mo_inventory_branch_read on public.mo_inventory_items for select using (public.mo_staff_can_access_branch(branch_key));

drop policy if exists mo_inventory_manager_write on public.mo_inventory_items;
create policy mo_inventory_manager_write on public.mo_inventory_items for all using (public.mo_is_manager_for_branch(branch_key)) with check (public.mo_is_manager_for_branch(branch_key));

drop policy if exists mo_recipe_staff_read on public.mo_recipe_items;
create policy mo_recipe_staff_read on public.mo_recipe_items for select using (public.mo_current_staff_id() is not null);

drop policy if exists mo_recipe_admin_write on public.mo_recipe_items;
create policy mo_recipe_admin_write on public.mo_recipe_items for all using (public.mo_is_admin()) with check (public.mo_is_admin());

drop policy if exists mo_inventory_tx_branch_read on public.mo_inventory_transactions;
create policy mo_inventory_tx_branch_read on public.mo_inventory_transactions for select using (public.mo_staff_can_access_branch(branch_key));

drop policy if exists mo_substitution_branch on public.mo_substitution_requests;
create policy mo_substitution_branch on public.mo_substitution_requests for all using (public.mo_staff_can_access_branch(branch_key)) with check (public.mo_staff_can_access_branch(branch_key));

drop policy if exists mo_pickup_branch on public.mo_pickup_verification;
create policy mo_pickup_branch on public.mo_pickup_verification for all using (public.mo_staff_can_access_branch(branch_key)) with check (public.mo_staff_can_access_branch(branch_key));

drop policy if exists mo_escalation_branch_read on public.mo_escalations;
create policy mo_escalation_branch_read on public.mo_escalations for select using (public.mo_staff_can_access_branch(branch_key));

drop policy if exists mo_escalation_staff_insert on public.mo_escalations;
create policy mo_escalation_staff_insert on public.mo_escalations for insert with check (staff_id = public.mo_current_staff_id() and public.mo_staff_can_access_branch(branch_key));

drop policy if exists mo_escalation_manager_update on public.mo_escalations;
create policy mo_escalation_manager_update on public.mo_escalations for update using (public.mo_is_manager_for_branch(branch_key)) with check (public.mo_is_manager_for_branch(branch_key));

drop policy if exists mo_equipment_branch_read on public.mo_equipment;
create policy mo_equipment_branch_read on public.mo_equipment for select using (public.mo_staff_can_access_branch(branch_key));

drop policy if exists mo_equipment_manager_write on public.mo_equipment;
create policy mo_equipment_manager_write on public.mo_equipment for all using (public.mo_is_manager_for_branch(branch_key)) with check (public.mo_is_manager_for_branch(branch_key));

drop policy if exists mo_notification_branch_staff on public.mo_customer_notifications;
create policy mo_notification_branch_staff on public.mo_customer_notifications for select using (public.mo_staff_can_access_branch(branch_key));

drop policy if exists mo_notification_branch_insert on public.mo_customer_notifications;
create policy mo_notification_branch_insert on public.mo_customer_notifications for insert with check (public.mo_staff_can_access_branch(branch_key));

drop policy if exists mo_audit_branch_read on public.mo_audit_log;
create policy mo_audit_branch_read on public.mo_audit_log for select using (public.mo_staff_can_access_branch(branch_key));
-- No client INSERT/UPDATE/DELETE policy for audit log; privileged security-definer functions write it.

drop policy if exists mo_config_branch_read on public.mo_branch_operations_config;
create policy mo_config_branch_read on public.mo_branch_operations_config for select using (public.mo_staff_can_access_branch(branch_key));

drop policy if exists mo_config_manager_write on public.mo_branch_operations_config;
create policy mo_config_manager_write on public.mo_branch_operations_config for all using (public.mo_is_manager_for_branch(branch_key)) with check (public.mo_is_manager_for_branch(branch_key));

drop policy if exists mo_quality_branch on public.mo_quality_checks;
create policy mo_quality_branch on public.mo_quality_checks for all using (public.mo_staff_can_access_branch(branch_key)) with check (public.mo_staff_can_access_branch(branch_key));

-- Restrict direct execution to authenticated users; helper functions enforce branch rules internally.
grant execute on function public.mo_claim_order_item(uuid) to authenticated;
grant execute on function public.mo_complete_order_item(uuid,text) to authenticated;
grant execute on function public.mo_order_all_items_done(text) to authenticated;

-- Realtime: add operational tables if not already present in publication.
do $$
begin
  if exists(select 1 from pg_publication where pubname='supabase_realtime') then
    begin alter publication supabase_realtime add table public.mo_order_item_preparation; exception when duplicate_object then null; end;
    begin alter publication supabase_realtime add table public.mo_substitution_requests; exception when duplicate_object then null; end;
    begin alter publication supabase_realtime add table public.mo_customer_notifications; exception when duplicate_object then null; end;
    begin alter publication supabase_realtime add table public.mo_escalations; exception when duplicate_object then null; end;
    begin alter publication supabase_realtime add table public.mo_equipment; exception when duplicate_object then null; end;
  end if;
end $$;

commit;

-- IMPORTANT ACTIVATION NOTES
-- 1) Run this migration in Supabase SQL Editor only after reviewing the live schema.
-- 2) Populate mo_staff_profiles + mo_branch_assignments for real staff accounts.
-- 3) Seed mo_recipe_items and mo_inventory_items before enabling automatic deductions.
-- 4) Existing orders/order_items remain untouched. A later adapter can sync their IDs into mo_order_item_preparation.
-- 5) Demo mode should continue using browser-only sample data and must never call these write RPCs.
