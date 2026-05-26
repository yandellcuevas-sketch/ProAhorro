-- ============================================================
-- ProAhorro — Migración 001: Tabla de usuarios
-- ============================================================

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

-- Índices
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_deleted_at ON public.users(deleted_at);

-- Comentarios
COMMENT ON TABLE public.users IS 'Perfil extendido de usuarios de ProAhorro';
COMMENT ON COLUMN public.users.deleted_at IS 'Soft delete — fecha de solicitud de eliminación de cuenta';
