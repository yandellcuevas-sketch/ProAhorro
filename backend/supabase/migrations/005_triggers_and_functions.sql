-- ============================================================
-- ProAhorro — Migración 005: Triggers updated_at
-- ============================================================

-- Función genérica para actualizar updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger en users
DROP TRIGGER IF EXISTS trg_users_updated_at ON public.users;
CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Trigger en goals
DROP TRIGGER IF EXISTS trg_goals_updated_at ON public.goals;
CREATE TRIGGER trg_goals_updated_at
  BEFORE UPDATE ON public.goals
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Trigger en savings
DROP TRIGGER IF EXISTS trg_savings_updated_at ON public.savings;
CREATE TRIGGER trg_savings_updated_at
  BEFORE UPDATE ON public.savings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Trigger en settings
DROP TRIGGER IF EXISTS trg_settings_updated_at ON public.settings;
CREATE TRIGGER trg_settings_updated_at
  BEFORE UPDATE ON public.settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- Migración 006: Funciones de negocio
-- ============================================================

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

  -- Auto-completar si llegó al objetivo
  UPDATE public.goals
  SET status = 'completed'
  WHERE id = p_goal_id
    AND current_amount >= target_amount
    AND status = 'active';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Eliminar todos los datos del usuario actual (para cumplimiento Apple)
CREATE OR REPLACE FUNCTION public.delete_current_user_data()
RETURNS VOID AS $$
DECLARE
  v_user_id UUID;
BEGIN
  v_user_id := auth.uid();

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'No autenticado';
  END IF;

  -- Eliminar datos en orden (respetando FK)
  DELETE FROM public.savings WHERE user_id = v_user_id;
  DELETE FROM public.saving_batches WHERE user_id = v_user_id;
  DELETE FROM public.goals WHERE user_id = v_user_id;
  DELETE FROM public.settings WHERE user_id = v_user_id;
  DELETE FROM public.currencies WHERE user_id = v_user_id;

  -- Soft delete en users
  UPDATE public.users
  SET deleted_at = NOW(),
      name = 'Usuario eliminado',
      email = 'deleted_' || v_user_id || '@deleted.com'
  WHERE id = v_user_id;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.delete_current_user_data() IS
  'Elimina todos los datos del usuario autenticado. Solo opera sobre auth.uid(). Cumplimiento Apple App Store.';

COMMENT ON FUNCTION public.recalculate_goal_progress(UUID) IS
  'Recalcula current_amount de una meta sumando todos sus ahorros asociados. Auto-completa si llega al objetivo.';
