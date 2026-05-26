-- ============================================================
-- ProAhorro — Migración 006: Row Level Security (RLS)
-- ============================================================
-- Cada usuario solo puede ver y modificar SUS propios datos.
-- Monedas del sistema son visibles para todos.

-- ─── Habilitar RLS en todas las tablas ──────────────────────

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.currencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saving_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.savings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- ─── USERS ──────────────────────────────────────────────────

DROP POLICY IF EXISTS "users_select_own" ON public.users;
CREATE POLICY "users_select_own" ON public.users
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "users_insert_own" ON public.users;
CREATE POLICY "users_insert_own" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "users_update_own" ON public.users;
CREATE POLICY "users_update_own" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- ─── CURRENCIES ─────────────────────────────────────────────

-- Ver monedas del sistema O propias
DROP POLICY IF EXISTS "currencies_select" ON public.currencies;
CREATE POLICY "currencies_select" ON public.currencies
  FOR SELECT USING (
    is_system = true OR auth.uid() = user_id
  );

DROP POLICY IF EXISTS "currencies_insert_own" ON public.currencies;
CREATE POLICY "currencies_insert_own" ON public.currencies
  FOR INSERT WITH CHECK (auth.uid() = user_id AND is_system = false);

DROP POLICY IF EXISTS "currencies_update_own" ON public.currencies;
CREATE POLICY "currencies_update_own" ON public.currencies
  FOR UPDATE USING (auth.uid() = user_id AND is_system = false);

DROP POLICY IF EXISTS "currencies_delete_own" ON public.currencies;
CREATE POLICY "currencies_delete_own" ON public.currencies
  FOR DELETE USING (auth.uid() = user_id AND is_system = false);

-- ─── GOALS ──────────────────────────────────────────────────

DROP POLICY IF EXISTS "goals_select_own" ON public.goals;
CREATE POLICY "goals_select_own" ON public.goals
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "goals_insert_own" ON public.goals;
CREATE POLICY "goals_insert_own" ON public.goals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "goals_update_own" ON public.goals;
CREATE POLICY "goals_update_own" ON public.goals
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "goals_delete_own" ON public.goals;
CREATE POLICY "goals_delete_own" ON public.goals
  FOR DELETE USING (auth.uid() = user_id);

-- ─── SAVING_BATCHES ─────────────────────────────────────────

DROP POLICY IF EXISTS "batches_select_own" ON public.saving_batches;
CREATE POLICY "batches_select_own" ON public.saving_batches
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "batches_insert_own" ON public.saving_batches;
CREATE POLICY "batches_insert_own" ON public.saving_batches
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "batches_update_own" ON public.saving_batches;
CREATE POLICY "batches_update_own" ON public.saving_batches
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "batches_delete_own" ON public.saving_batches;
CREATE POLICY "batches_delete_own" ON public.saving_batches
  FOR DELETE USING (auth.uid() = user_id);

-- ─── SAVINGS ────────────────────────────────────────────────

DROP POLICY IF EXISTS "savings_select_own" ON public.savings;
CREATE POLICY "savings_select_own" ON public.savings
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "savings_insert_own" ON public.savings;
CREATE POLICY "savings_insert_own" ON public.savings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "savings_update_own" ON public.savings;
CREATE POLICY "savings_update_own" ON public.savings
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "savings_delete_own" ON public.savings;
CREATE POLICY "savings_delete_own" ON public.savings
  FOR DELETE USING (auth.uid() = user_id);

-- ─── SETTINGS ───────────────────────────────────────────────

DROP POLICY IF EXISTS "settings_select_own" ON public.settings;
CREATE POLICY "settings_select_own" ON public.settings
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "settings_insert_own" ON public.settings;
CREATE POLICY "settings_insert_own" ON public.settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "settings_update_own" ON public.settings;
CREATE POLICY "settings_update_own" ON public.settings
  FOR UPDATE USING (auth.uid() = user_id);
