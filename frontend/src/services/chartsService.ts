import { supabase } from './supabaseClient';
import type { ChartsData, MonthlyChartData } from '../types';

const MONTH_LABELS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

export const chartsService = {
  /**
   * Obtener todos los datos para la pantalla de gráficos
   */
  async getChartsData(currency?: string): Promise<ChartsData> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Sesión expirada.');

    // Últimos 6 meses
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    const fromDate = sixMonthsAgo.toISOString().split('T')[0];

    const { data: savings } = await supabase
      .from('savings')
      .select('amount, currency, date, type, goal_id')
      .eq('user_id', user.id)
      .gte('date', fromDate)
      .order('date', { ascending: true });

    const allSavings = savings ?? [];

    // Filtrar por moneda si se especifica
    const filtered = currency
      ? allSavings.filter((s) => s.currency === currency)
      : allSavings;

    // Barras mensuales
    const monthlyMap = new Map<string, number>();
    filtered.forEach((s) => {
      const key = s.date.substring(0, 7); // 'YYYY-MM'
      monthlyMap.set(key, (monthlyMap.get(key) ?? 0) + s.amount);
    });

    const monthly: MonthlyChartData[] = Array.from(monthlyMap.entries())
      .sort()
      .map(([month, total]) => {
        const [, m] = month.split('-');
        return {
          month,
          label: MONTH_LABELS[parseInt(m, 10) - 1],
          total,
          currency: currency ?? 'mixed',
        };
      });

    // Por moneda
    const currencyMap = new Map<string, number>();
    allSavings.forEach((s) => {
      currencyMap.set(s.currency, (currencyMap.get(s.currency) ?? 0) + s.amount);
    });
    const totalAll = Array.from(currencyMap.values()).reduce((a, b) => a + b, 0);
    const by_currency = Array.from(currencyMap.entries()).map(([curr, total]) => ({
      currency: curr,
      symbol: curr === 'DOP' ? 'RD$' : curr === 'USD' ? '$' : '€',
      total,
      percentage: totalAll > 0 ? (total / totalAll) * 100 : 0,
    }));

    // Distribución por metas
    const { data: goalSavings } = await supabase
      .from('savings')
      .select('amount, goal_id, goal:goals(id, name, color)')
      .eq('user_id', user.id)
      .eq('type', 'goal')
      .not('goal_id', 'is', null);

    const goalMap = new Map<string, { name: string; color: string; amount: number }>();
    (goalSavings ?? []).forEach((s: any) => {
      if (!s.goal_id) return;
      const existing = goalMap.get(s.goal_id);
      if (existing) {
        existing.amount += s.amount;
      } else {
        goalMap.set(s.goal_id, {
          name: s.goal?.name ?? 'Meta',
          color: s.goal?.color ?? '#0B8F3A',
          amount: s.amount,
        });
      }
    });

    const goalTotal = Array.from(goalMap.values()).reduce((a, b) => a + b.amount, 0);
    const goal_distribution = Array.from(goalMap.entries()).map(([id, g]) => ({
      goal_id: id,
      goal_name: g.name,
      amount: g.amount,
      percentage: goalTotal > 0 ? (g.amount / goalTotal) * 100 : 0,
      color: g.color,
    }));

    // Línea de crecimiento acumulada
    let cumulative = 0;
    const growth_line = filtered.map((s) => {
      cumulative += s.amount;
      return { date: s.date, cumulative };
    });

    // Libre vs metas
    const free = filtered.filter((s) => s.type === 'free').reduce((a, s) => a + s.amount, 0);
    const goals = filtered.filter((s) => s.type === 'goal').reduce((a, s) => a + s.amount, 0);

    return {
      monthly,
      by_currency,
      goal_distribution,
      growth_line,
      free_vs_goals: { free, goals },
    };
  },

  /**
   * Ahorro mensual resumido (últimos N meses)
   */
  async getMonthlySavings(months = 6): Promise<{ month: string; total: number }[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const fromDate = new Date();
    fromDate.setMonth(fromDate.getMonth() - (months - 1));
    fromDate.setDate(1);

    const { data } = await supabase
      .from('savings')
      .select('amount, date')
      .eq('user_id', user.id)
      .gte('date', fromDate.toISOString().split('T')[0])
      .order('date', { ascending: true });

    const map = new Map<string, number>();
    (data ?? []).forEach((s) => {
      const key = s.date.substring(0, 7);
      map.set(key, (map.get(key) ?? 0) + s.amount);
    });

    return Array.from(map.entries())
      .sort()
      .map(([month, total]) => ({ month, total }));
  },

  /**
   * Distribución por moneda (total + porcentaje)
   */
  async getCurrencyDistribution(): Promise<{ currency: string; total: number; percentage: number }[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data } = await supabase
      .from('savings')
      .select('amount, currency')
      .eq('user_id', user.id);

    const map = new Map<string, number>();
    (data ?? []).forEach((s) => {
      map.set(s.currency, (map.get(s.currency) ?? 0) + s.amount);
    });

    const totalAll = Array.from(map.values()).reduce((a, b) => a + b, 0);
    return Array.from(map.entries()).map(([currency, total]) => ({
      currency,
      total,
      percentage: totalAll > 0 ? (total / totalAll) * 100 : 0,
    }));
  },

  /**
   * Crecimiento acumulado (últimos N días)
   */
  async getCumulativeGrowth(days = 90): Promise<{ date: string; cumulative: number }[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);

    const { data } = await supabase
      .from('savings')
      .select('amount, date')
      .eq('user_id', user.id)
      .gte('date', fromDate.toISOString().split('T')[0])
      .order('date', { ascending: true });

    let cumulative = 0;
    return (data ?? []).map((s) => {
      cumulative += s.amount;
      return { date: s.date, cumulative };
    });
  },
};
