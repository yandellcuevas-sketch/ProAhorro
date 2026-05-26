import { supabase } from './supabaseClient';
import type { Goal } from '../types';

export const goalsService = {
  /**
   * Obtener todas las metas del usuario
   */
  async getGoals(status?: Goal['status']): Promise<Goal[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Sesión expirada.');

    let query = supabase
      .from('goals')
      .select('*')
      .eq('user_id', user.id)
      .neq('status', 'deleted')
      .order('created_at', { ascending: false });

    if (status) query = query.eq('status', status);

    const { data, error } = await query;
    if (error) throw new Error('No se pudieron cargar las metas.');
    return (data ?? []) as Goal[];
  },

  /**
   * Obtener detalle de una meta
   */
  async getGoal(id: string): Promise<Goal> {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error('No se pudo cargar la meta.');
    return data as Goal;
  },

  /**
   * Crear nueva meta
   */
  async createGoal(payload: {
    name: string;
    description?: string;
    target_amount: number;
    currency: string;
    deadline?: string;
    icon?: string;
    color?: string;
  }): Promise<Goal> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Sesión expirada.');

    const { data, error } = await supabase
      .from('goals')
      .insert({
        user_id: user.id,
        ...payload,
        current_amount: 0,
        status: 'active',
        icon: payload.icon ?? 'wallet',
        color: payload.color ?? '#0B8F3A',
      })
      .select()
      .single();

    if (error) throw new Error('No se pudo crear la meta. Intenta de nuevo.');
    return data as Goal;
  },

  /**
   * Actualizar meta
   */
  async updateGoal(id: string, payload: Partial<Goal>): Promise<Goal> {
    const { data, error } = await supabase
      .from('goals')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error('No se pudo actualizar la meta.');
    return data as Goal;
  },

  /**
   * Cambiar estado de meta (pausar, completar, reactivar)
   */
  async setGoalStatus(id: string, status: Goal['status']): Promise<void> {
    const { error } = await supabase
      .from('goals')
      .update({ status })
      .eq('id', id);

    if (error) throw new Error('No se pudo cambiar el estado de la meta.');
  },

  /**
   * Eliminar meta (soft delete)
   */
  async deleteGoal(id: string): Promise<void> {
    await goalsService.setGoalStatus(id, 'deleted');
  },

  /**
   * Calcular predicción de cuándo se alcanzará la meta
   */
  async getGoalPrediction(goalId: string): Promise<{
    can_predict: boolean;
    months_remaining?: number;
    predicted_date?: string;
    weekly_avg?: number;
  }> {
    // Obtener últimos 3 meses de ahorros para esta meta
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const { data: savings } = await supabase
      .from('savings')
      .select('amount, date')
      .eq('goal_id', goalId)
      .gte('date', threeMonthsAgo.toISOString().split('T')[0])
      .order('date', { ascending: true });

    if (!savings || savings.length < 3) {
      return { can_predict: false };
    }

    const { data: goal } = await supabase
      .from('goals')
      .select('target_amount, current_amount, currency')
      .eq('id', goalId)
      .single();

    if (!goal) return { can_predict: false };

    const remaining = goal.target_amount - goal.current_amount;
    if (remaining <= 0) return { can_predict: false };

    // Calcular promedio semanal
    const totalInPeriod = savings.reduce((s, r) => s + r.amount, 0);
    const weeks = 12; // ~3 meses
    const weeklyAvg = totalInPeriod / weeks;

    if (weeklyAvg <= 0) return { can_predict: false };

    const weeksRemaining = Math.ceil(remaining / weeklyAvg);
    const monthsRemaining = Math.ceil(weeksRemaining / 4.33);

    const predictedDate = new Date();
    predictedDate.setDate(predictedDate.getDate() + weeksRemaining * 7);

    return {
      can_predict: true,
      months_remaining: monthsRemaining,
      predicted_date: predictedDate.toISOString().split('T')[0],
      weekly_avg: weeklyAvg,
    };
  },
};
