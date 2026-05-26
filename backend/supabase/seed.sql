-- ============================================================
-- ProAhorro — Seed: datos iniciales y demo
-- ============================================================

-- ─── Monedas del sistema ──────────────────────────────────────

INSERT INTO public.currencies (code, name, symbol, exchange_rate, is_default, is_system)
VALUES
  ('DOP', 'Peso Dominicano', 'RD$', 58.5,  true,  true),
  ('USD', 'Dólar Americano', '$',   1.0,   false, true),
  ('EUR', 'Euro',            '€',   0.92,  false, true)
ON CONFLICT (code) WHERE is_system = true DO NOTHING;

-- ============================================================
-- DATOS DEMO para cuenta de revisión Apple
-- Email: review@proahorro.app / ProAhorro2026!
--
-- INSTRUCCIONES:
-- 1. Crear el usuario en Supabase Auth primero
-- 2. Obtener su UUID y reemplazar 'REVIEW_USER_ID' abajo
-- 3. Ejecutar este bloque manualmente en el SQL Editor
-- ============================================================

-- Reemplazar con el UUID real del usuario de revisión:
-- DO $$
-- DECLARE
--   v_user_id UUID := 'REVIEW_USER_ID_AQUI';
-- BEGIN

--   -- Perfil
--   INSERT INTO public.users (id, name, email, auth_provider, main_currency)
--   VALUES (v_user_id, 'Usuario Demo', 'review@proahorro.app', 'email', 'DOP')
--   ON CONFLICT (id) DO NOTHING;

--   -- Configuración
--   INSERT INTO public.settings (user_id, main_currency, onboarding_done)
--   VALUES (v_user_id, 'DOP', true)
--   ON CONFLICT (user_id) DO NOTHING;

--   -- Metas demo
--   INSERT INTO public.goals (user_id, name, description, target_amount, current_amount, currency, icon, color, status)
--   VALUES
--     (v_user_id, 'Viaje a Europa', 'Vacaciones de verano 2025', 150000, 87500, 'DOP', 'airplane', '#0B8F3A', 'active'),
--     (v_user_id, 'Fondo de emergencia', '3 meses de gastos', 60000, 32000, 'DOP', 'medkit', '#064E2E', 'active'),
--     (v_user_id, 'Nuevo carro', 'Inicial para carro usado', 200000, 45000, 'DOP', 'car', '#22C55E', 'active');

--   -- Ahorros demo (últimos 3 meses)
--   INSERT INTO public.savings (user_id, amount, currency, date, type, method, note)
--   VALUES
--     (v_user_id, 5000,  'DOP', CURRENT_DATE - 1,  'free', 'transfer', 'Salario enero'),
--     (v_user_id, 3000,  'DOP', CURRENT_DATE - 5,  'free', 'cash',     'Venta de artículo'),
--     (v_user_id, 8000,  'DOP', CURRENT_DATE - 10, 'free', 'transfer', 'Bono trimestral'),
--     (v_user_id, 2500,  'DOP', CURRENT_DATE - 15, 'free', 'digital',  ''),
--     (v_user_id, 4000,  'DOP', CURRENT_DATE - 22, 'free', 'transfer', 'Ahorro quincenal'),
--     (v_user_id, 6000,  'DOP', CURRENT_DATE - 30, 'free', 'transfer', 'Salario diciembre');

-- END $$;

-- Nota: Los datos demo se cargan manualmente para la cuenta de revisión Apple.
-- Ver docs/REVIEW_NOTES.md para instrucciones detalladas.
