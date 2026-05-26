-- ============================================================
-- ProAhorro — Migración 004: Lotes de ahorro (reparticiones)
-- ============================================================

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

-- Índices
CREATE INDEX IF NOT EXISTS idx_saving_batches_user_id ON public.saving_batches(user_id);
CREATE INDEX IF NOT EXISTS idx_saving_batches_date ON public.saving_batches(date);

COMMENT ON TABLE public.saving_batches IS 'Lotes de ahorro — agrupan reparticiones entre varias metas';

-- ============================================================
-- ProAhorro — Migración 005: Ahorros individuales
-- ============================================================

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

-- Índices
CREATE INDEX IF NOT EXISTS idx_savings_user_id ON public.savings(user_id);
CREATE INDEX IF NOT EXISTS idx_savings_date ON public.savings(date);
CREATE INDEX IF NOT EXISTS idx_savings_goal_id ON public.savings(goal_id);
CREATE INDEX IF NOT EXISTS idx_savings_batch_id ON public.savings(batch_id);
CREATE INDEX IF NOT EXISTS idx_savings_user_date ON public.savings(user_id, date);
CREATE INDEX IF NOT EXISTS idx_savings_currency ON public.savings(user_id, currency);

COMMENT ON TABLE public.savings IS 'Movimientos individuales de ahorro';
COMMENT ON COLUMN public.savings.type IS 'free=ahorro libre, goal=asociado a meta, split=parte de repartición';

-- ============================================================
-- ProAhorro — Migración 006: Configuración por usuario
-- ============================================================

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

-- Índices
CREATE UNIQUE INDEX IF NOT EXISTS idx_settings_user_id ON public.settings(user_id);

COMMENT ON TABLE public.settings IS 'Configuración y preferencias por usuario';
