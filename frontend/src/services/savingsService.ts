import { supabase } from './supabaseClient';
import type { Saving, SavingBatch } from '../types';
import { HISTORY_PAGE_SIZE } from '../constants';

export const savingsService = {
  /**
   * Crear un ahorro individual (libre o asociado a meta)
   */
  async createSaving(payload: {
    amount: number;
    currency: string;
    date: string;
    method: string;
    note?: string;
    type: 'free' | 'goal';
    goal_id?: string;
    batch_id?: string;
  }): Promise<Saving> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Sesión expirada. Inicia sesión de nuevo.');

    const { data, error } = await supabase
      .from('savings')
      .insert({
        user_id: user.id,
        amount: payload.amount,
        currency: payload.currency,
        date: payload.date,
        method: payload.method,
        note: payload.note || null,
        type: payload.type,
        goal_id: payload.goal_id || null,
        batch_id: payload.batch_id || null,
      })
      .select(`
        *,
        goal:goals(id, name, icon, color)
      `)
      .single();

    if (error) throw new Error('No se pudo guardar el ahorro. Intenta de nuevo.');

    // Si tiene meta, recalcular progreso
    if (payload.goal_id) {
      await supabase.rpc('recalculate_goal_progress', {
        p_goal_id: payload.goal_id,
      });
    }

    return data as Saving;
  },

  /**
   * Obtener historial paginado
   */
  async getHistory(options?: {
    page?: number;
    currency?: string;
    goal_id?: string;
    type?: 'free' | 'goal' | 'split';
    date_from?: string;
    date_to?: string;
  }): Promise<{ savings: Saving[]; hasMore: boolean }> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Sesión expirada.');

    const page = options?.page ?? 0;
    const from = page * HISTORY_PAGE_SIZE;
    const to = from + HISTORY_PAGE_SIZE - 1;

    let query = supabase
      .from('savings')
      .select(`
        *,
        goal:goals(id, name, icon, color),
        batch:saving_batches(id, total_amount)
      `, { count: 'exact' })
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (options?.currency) query = query.eq('currency', options.currency);
    if (options?.goal_id) query = query.eq('goal_id', options.goal_id);
    if (options?.type) query = query.eq('type', options.type);
    if (options?.date_from) query = query.gte('date', options.date_from);
    if (options?.date_to) query = query.lte('date', options.date_to);

    const { data, error, count } = await query;

    if (error) throw new Error('No se pudo cargar el historial.');

    return {
      savings: (data ?? []) as Saving[],
      hasMore: (count ?? 0) > to + 1,
    };
  },

  /**
   * Actualizar un ahorro
   */
  async updateSaving(
    id: string,
    payload: { amount?: number; currency?: string; date?: string; method?: string; note?: string }
  ): Promise<Saving> {
    const { data, error } = await supabase
      .from('savings')
      .update(payload)
      .eq('id', id)
      .select(`*, goal:goals(id, name, icon, color)`)
      .single();

    if (error) throw new Error('No se pudo actualizar el ahorro.');
    return data as Saving;
  },

  /**
   * Eliminar un ahorro y recalcular meta si aplica
   */
  async deleteSaving(id: string, goal_id?: string): Promise<void> {
    const { error } = await supabase
      .from('savings')
      .delete()
      .eq('id', id);

    if (error) throw new Error('No se pudo eliminar el ahorro.');

    if (goal_id) {
      await supabase.rpc('recalculate_goal_progress', {
        p_goal_id: goal_id,
      });
    }
  },

  /**
   * Obtener resumen del dashboard
   */
  async getDashboardSummary() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Sesión expirada.');

    // Totales por moneda
    const { data: totals } = await supabase
      .from('savings')
      .select('currency, amount')
      .eq('user_id', user.id);

    // Ahorro del mes actual
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString()
      .split('T')[0];

    const { data: monthly } = await supabase
      .from('savings')
      .select('amount, currency')
      .eq('user_id', user.id)
      .gte('date', firstDay);

    // Últimos 5 movimientos
    const { data: recent } = await supabase
      .from('savings')
      .select(`*, goal:goals(id, name, icon, color)`)
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .limit(5);

    // Metas activas
    const { data: goals } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(3);

    // Agrupar totales por moneda
    const totalByCurrency = (totals ?? []).reduce(
      (acc, row) => {
        const key = row.currency;
        if (!acc[key]) acc[key] = 0;
        acc[key] += row.amount;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      total_by_currency: Object.entries(totalByCurrency).map(([currency, total]) => ({
        currency,
        total,
      })),
      monthly_total: (monthly ?? []).reduce((s, r) => s + r.amount, 0),
      monthly_currency: monthly?.[0]?.currency ?? 'DOP',
      recent_savings: (recent ?? []) as Saving[],
      active_goals: (goals ?? []),
    };
  },
};
