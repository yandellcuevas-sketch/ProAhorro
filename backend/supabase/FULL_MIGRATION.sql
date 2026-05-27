-- ============================================================
-- ProAhorro — MIGRACIÓN COMPLETA
-- Pega y ejecuta esto en: Supabase → SQL Editor → New query → Run
-- ============================================================

-- ─── 001: Tabla de usuarios ──────────────────────────────────

CREATE TABLE IF NOT EXISTS public.users (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL,
  auth_provider TEXT NOT NULL DEFAULT 'email' CHECK (auth_provider IN ('email', 'apple', 'google')),
  provider_uid  TEXT,
  avatar_url    TEXT,
  main_currency TEXT NOT NULL DEFAULT 'DOP',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at    TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_deleted_at ON public.users(deleted_at);

-- ─── 002: Monedas ────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.currencies (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES public.users(id) ON DELETE CASCADE,
  code          TEXT NOT NULL,
  name          TEXT NOT NULL,
  symbol        TEXT NOT NULL,
  exchange_rate NUMERIC(12,6) NOT NULL DEFAULT 1.0,
  is_default    BOOLEAN NOT NULL DEFAULT false,
  is_system     BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_currencies_user_id ON public.currencies(user_id);
CREATE INDEX IF NOT EXISTS idx_currencies_code ON public.currencies(code);
CREATE UNIQUE INDEX IF NOT EXISTS idx_currencies_system_code
  ON public.currencies(code) WHERE is_system = true;

-- ─── 003: Metas ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.goals (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name           TEXT NOT NULL,
  description    TEXT,
  target_amount  NUMERIC(14,2) NOT NULL CHECK (target_amount > 0),
  current_amount NUMERIC(14,2) NOT NULL DEFAULT 0 CHECK (current_amount >= 0),
  currency       TEXT NOT NULL DEFAULT 'DOP',
  deadline       DATE,
  status         TEXT NOT NULL DEFAULT 'active'
                 CHECK (status IN ('active', 'paused', 'completed', 'deleted')),
  icon           TEXT NOT NULL DEFAULT 'wallet',
  color          TEXT NOT NULL DEFAULT '#0B8F3A',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.goals
  ADD COLUMN IF NOT EXISTS progress_pct NUMERIC(5,2)
  GENERATED ALWAYS AS (
    CASE WHEN target_amount > 0
      THEN LEAST(ROUND((current_amount / target_amount) * 100, 2), 100)
      ELSE 0
    END
  ) STORED;

CREATE INDEX IF NOT EXISTS idx_goals_user_id ON public.goals(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_status ON public.goals(status);
CREATE INDEX IF NOT EXISTS idx_goals_user_status ON public.goals(user_id, status);

-- ─── 004a: Lotes de ahorro (reparticiones) ───────────────────

CREATE TABLE IF NOT EXISTS public.saving_batches (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  total_amount NUMERIC(14,2) NOT NULL CHECK (total_amount > 0),
  currency     TEXT NOT NULL DEFAULT 'DOP',
  date         DATE NOT NULL DEFAULT CURRENT_DATE,
  method       TEXT NOT NULL DEFAULT 'cash'
               CHECK (method IN ('cash', 'transfer', 'card', 'digital', 'other')),
  note         TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_saving_batches_user_id ON public.saving_batches(user_id);
CREATE INDEX IF NOT EXISTS idx_saving_batches_date ON public.saving_batches(date);

-- ─── 004b: Ahorros individuales ──────────────────────────────

CREATE TABLE IF NOT EXISTS public.savings (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  batch_id   UUID REFERENCES public.saving_batches(id) ON DELETE SET NULL,
  amount     NUMERIC(14,2) NOT NULL CHECK (amount > 0),
  currency   TEXT NOT NULL DEFAULT 'DOP',
  date       DATE NOT NULL DEFAULT CURRENT_DATE,
  type       TEXT NOT NULL DEFAULT 'free'
             CHECK (type IN ('free', 'goal', 'split')),
  goal_id    UUID REFERENCES public.goals(id) ON DELETE SET NULL,
  method     TEXT NOT NULL DEFAULT 'cash'
             CHECK (method IN ('cash', 'transfer', 'card', 'digital', 'other')),
  note       TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_savings_user_id ON public.savings(user_id);
CREATE INDEX IF NOT EXISTS idx_savings_date ON public.savings(date);
CREATE INDEX IF NOT EXISTS idx_savings_goal_id ON public.savings(goal_id);
CREATE INDEX IF NOT EXISTS idx_savings_batch_id ON public.savings(batch_id);
CREATE INDEX IF NOT EXISTS idx_savings_user_date ON public.savings(user_id, date);
CREATE INDEX IF NOT EXISTS idx_savings_currency ON public.savings(user_id, currency);

-- ─── 004c: Configuración por usuario ─────────────────────────

CREATE TABLE IF NOT EXISTS public.settings (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  main_currency          TEXT NOT NULL DEFAULT 'DOP',
  theme                  TEXT NOT NULL DEFAULT 'light'
                         CHECK (theme IN ('light', 'dark', 'system')),
  pin_enabled            BOOLEAN NOT NULL DEFAULT false,
  biometric_enabled      BOOLEAN NOT NULL DEFAULT false,
  notifications_enabled  BOOLEAN NOT NULL DEFAULT true,
  onboarding_done        BOOLEAN NOT NULL DEFAULT false,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_settings_user_id ON public.settings(user_id);

-- ─── 005: Triggers y funciones de negocio ────────────────────

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_users_updated_at ON public.users;
CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_goals_updated_at ON public.goals;
CREATE TRIGGER trg_goals_updated_at
  BEFORE UPDATE ON public.goals
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_savings_updated_at ON public.savings;
CREATE TRIGGER trg_savings_updated_at
  BEFORE UPDATE ON public.savings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_settings_updated_at ON public.settings;
CREATE TRIGGER trg_settings_updated_at
  BEFORE UPDATE ON public.settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Auto-crear perfil y settings cuando se registra un usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, name, email, auth_provider)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    'email'
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.settings (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Recalcular progreso de una meta
CREATE OR REPLACE FUNCTION public.recalculate_goal_progress(p_goal_id UUID)
RETURNS VOID AS $$
DECLARE
  v_total NUMERIC;
BEGIN
  SELECT COALESCE(SUM(amount), 0)
  INTO v_total
  FROM public.savings
  WHERE goal_id = p_goal_id;

  UPDATE public.goals
  SET current_amount = v_total
  WHERE id = p_goal_id;

  UPDATE public.goals
  SET status = 'completed'
  WHERE id = p_goal_id
    AND current_amount >= target_amount
    AND status = 'active';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Eliminar todos los datos del usuario (cumplimiento Apple)
CREATE OR REPLACE FUNCTION public.delete_current_user_data()
RETURNS VOID AS $$
DECLARE
  v_user_id UUID;
BEGIN
  v_user_id := auth.uid();

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'No autenticado';
  END IF;

  DELETE FROM public.savings WHERE user_id = v_user_id;
  DELETE FROM public.saving_batches WHERE user_id = v_user_id;
  DELETE FROM public.goals WHERE user_id = v_user_id;
  DELETE FROM public.settings WHERE user_id = v_user_id;
  DELETE FROM public.currencies WHERE user_id = v_user_id;

  UPDATE public.users
  SET deleted_at = NOW(),
      name = 'Usuario eliminado',
      email = 'deleted_' || v_user_id || '@deleted.com'
  WHERE id = v_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─── 006: Row Level Security ─────────────────────────────────

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.currencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saving_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.savings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- USERS
DROP POLICY IF EXISTS "users_select_own" ON public.users;
CREATE POLICY "users_select_own" ON public.users FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "users_insert_own" ON public.users;
CREATE POLICY "users_insert_own" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "users_update_own" ON public.users;
CREATE POLICY "users_update_own" ON public.users FOR UPDATE USING (auth.uid() = id);

-- CURRENCIES
DROP POLICY IF EXISTS "currencies_select" ON public.currencies;
CREATE POLICY "currencies_select" ON public.currencies
  FOR SELECT USING (is_system = true OR auth.uid() = user_id);
DROP POLICY IF EXISTS "currencies_insert_own" ON public.currencies;
CREATE POLICY "currencies_insert_own" ON public.currencies FOR INSERT WITH CHECK (auth.uid() = user_id AND is_system = false);
DROP POLICY IF EXISTS "currencies_update_own" ON public.currencies;
CREATE POLICY "currencies_update_own" ON public.currencies FOR UPDATE USING (auth.uid() = user_id AND is_system = false);
DROP POLICY IF EXISTS "currencies_delete_own" ON public.currencies;
CREATE POLICY "currencies_delete_own" ON public.currencies FOR DELETE USING (auth.uid() = user_id AND is_system = false);

-- GOALS
DROP POLICY IF EXISTS "goals_select_own" ON public.goals;
CREATE POLICY "goals_select_own" ON public.goals FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "goals_insert_own" ON public.goals;
CREATE POLICY "goals_insert_own" ON public.goals FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "goals_update_own" ON public.goals;
CREATE POLICY "goals_update_own" ON public.goals FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "goals_delete_own" ON public.goals;
CREATE POLICY "goals_delete_own" ON public.goals FOR DELETE USING (auth.uid() = user_id);

-- SAVING_BATCHES
DROP POLICY IF EXISTS "batches_select_own" ON public.saving_batches;
CREATE POLICY "batches_select_own" ON public.saving_batches FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "batches_insert_own" ON public.saving_batches;
CREATE POLICY "batches_insert_own" ON public.saving_batches FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "batches_update_own" ON public.saving_batches;
CREATE POLICY "batches_update_own" ON public.saving_batches FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "batches_delete_own" ON public.saving_batches;
CREATE POLICY "batches_delete_own" ON public.saving_batches FOR DELETE USING (auth.uid() = user_id);

-- SAVINGS
DROP POLICY IF EXISTS "savings_select_own" ON public.savings;
CREATE POLICY "savings_select_own" ON public.savings FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "savings_insert_own" ON public.savings;
CREATE POLICY "savings_insert_own" ON public.savings FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "savings_update_own" ON public.savings;
CREATE POLICY "savings_update_own" ON public.savings FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "savings_delete_own" ON public.savings;
CREATE POLICY "savings_delete_own" ON public.savings FOR DELETE USING (auth.uid() = user_id);

-- SETTINGS
DROP POLICY IF EXISTS "settings_select_own" ON public.settings;
CREATE POLICY "settings_select_own" ON public.settings FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "settings_insert_own" ON public.settings;
CREATE POLICY "settings_insert_own" ON public.settings FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "settings_update_own" ON public.settings;
CREATE POLICY "settings_update_own" ON public.settings FOR UPDATE USING (auth.uid() = user_id);

-- ─── SEED: Monedas del sistema ────────────────────────────────

INSERT INTO public.currencies (code, name, symbol, exchange_rate, is_default, is_system)
VALUES
  ('DOP', 'Peso Dominicano', 'RD$', 58.5,  true,  true),
  ('USD', 'Dólar Americano', '$',   1.0,   false, true),
  ('EUR', 'Euro',            '€',   0.92,  false, true)
ON CONFLICT (code) WHERE is_system = true DO NOTHING;

-- ✅ Migración completa. Tablas, triggers, RLS y seed listos.
