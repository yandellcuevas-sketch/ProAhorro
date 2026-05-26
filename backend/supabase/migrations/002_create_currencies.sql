-- ============================================================
-- ProAhorro — Migración 002: Tabla de monedas
-- ============================================================

CREATE TABLE IF NOT EXISTS public.currencies (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES public.users(id) ON DELETE CASCADE,
  code          TEXT NOT NULL,       -- 'DOP', 'USD', 'EUR'
  name          TEXT NOT NULL,       -- 'Peso Dominicano'
  symbol        TEXT NOT NULL,       -- 'RD$'
  exchange_rate NUMERIC(12,6) NOT NULL DEFAULT 1.0, -- relativo a USD
  is_default    BOOLEAN NOT NULL DEFAULT false,
  is_system     BOOLEAN NOT NULL DEFAULT false,   -- monedas del sistema
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_currencies_user_id ON public.currencies(user_id);
CREATE INDEX IF NOT EXISTS idx_currencies_code ON public.currencies(code);
CREATE UNIQUE INDEX IF NOT EXISTS idx_currencies_system_code
  ON public.currencies(code) WHERE is_system = true;

COMMENT ON TABLE public.currencies IS 'Monedas disponibles — sistema y personalizadas por usuario';
COMMENT ON COLUMN public.currencies.user_id IS 'NULL = moneda del sistema accesible para todos';
