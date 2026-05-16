-- Row-level security policies
-- Enable RLS after auth is wired up (Phase 1)

-- For now, enable but allow all (Phase 0 has no auth)
alter table users enable row level security;
alter table sessions enable row level security;
alter table messages enable row level security;
alter table case_attempts enable row level security;
alter table pearl_unlocks enable row level security;
alter table streaks enable row level security;
alter table flags enable row level security;

-- Temporary: allow all reads/writes during Phase 0 prototype
-- Replace with user-scoped policies before pilot
create policy "allow_all_phase0" on users for all using (true) with check (true);
create policy "allow_all_phase0" on sessions for all using (true) with check (true);
create policy "allow_all_phase0" on messages for all using (true) with check (true);
create policy "allow_all_phase0" on case_attempts for all using (true) with check (true);
create policy "allow_all_phase0" on pearl_unlocks for all using (true) with check (true);
create policy "allow_all_phase0" on streaks for all using (true) with check (true);
create policy "allow_all_phase0" on flags for all using (true) with check (true);

-- Public tables (cases, pearls, kb_chunks — curated content)
alter table cases enable row level security;
alter table pearls enable row level security;
alter table kb_chunks enable row level security;
create policy "public_read_cases" on cases for select using (true);
create policy "public_read_pearls" on pearls for select using (true);
create policy "public_read_kb_chunks" on kb_chunks for select using (true);
