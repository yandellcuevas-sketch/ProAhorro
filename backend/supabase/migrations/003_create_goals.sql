-- ============================================================
-- ProAhorro — Migración 003: Tabla de metas
-- ============================================================

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

-- Columna calculada de progreso (virtual)
ALTER TABLE public.goals
  ADD COLUMN IF NOT EXISTS progress_pct NUMERIC(5,2)
  GENERATED ALWAYS AS (
    CASE WHEN target_amount > 0
      THEN LEAST(ROUND((current_amount / target_amount) * 100, 2), 100)
      ELSE 0
    END
  ) STORED;

-- Índices
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON public.goals(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_status ON public.goals(status);
CREATE INDEX IF NOT EXISTS idx_goals_user_status ON public.goals(user_id, status);

COMMENT ON TABLE public.goals IS 'Metas de ahorro por usuario';
COMMENT ON COLUMN public.goals.progress_pct IS 'Porcentaje de progreso calculado automáticamente';
