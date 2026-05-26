import { supabase } from './supabaseClient';
import { savingsService } from './savingsService';
import type { SplitPayload } from '../types';

export const splitService = {
  /**
   * Ejecutar repartición de un monto entre varias metas
   */
  async createSplitSaving(payload: SplitPayload): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Sesión expirada.');

    // Validar que suma de splits no supere total
    const totalDistributed = payload.splits.reduce((s, item) => s + item.amount, 0);
    const leftover = payload.total_amount - totalDistributed;

    if (totalDistributed > payload.total_amount) {
      throw new Error(
        'El total repartido supera el monto disponible. Ajusta la distribución.'
      );
    }

    // Validar que las metas estén activas
    if (payload.splits.length > 0) {
      const goalIds = payload.splits.map((s) => s.goal_id);
      const { data: goals } = await supabase
        .from('goals')
        .select('id, status, name')
        .in('id', goalIds);

      const completedGoals = (goals ?? []).filter((g) => g.status === 'completed');
      if (completedGoals.length > 0) {
        const names = completedGoals.map((g) => g.name).join(', ');
        throw new Error(
          `Las siguientes metas ya están completadas y no aceptan ahorros: ${names}`
        );
      }
    }

    // Crear el lote (batch)
    const { data: batch, error: batchError } = await supabase
      .from('saving_batches')
      .insert({
        user_id: user.id,
        total_amount: payload.total_amount,
        currency: payload.currency,
        date: payload.date,
        method: payload.method,
        note: payload.note || null,
      })
      .select()
      .single();

    if (batchError) throw new Error('Error al iniciar la repartición. Intenta de nuevo.');

    // Crear ahorros individuales para cada meta
    const savingPromises = payload.splits.map((item) =>
      savingsService.createSaving({
        amount: item.amount,
        currency: payload.currency,
        date: payload.date,
        method: payload.method,
        note: payload.note,
        type: 'goal',
        goal_id: item.goal_id,
        batch_id: batch.id,
      })
    );

    // Si hay sobrante y el usuario quiere guardarlo como libre
    if (payload.leftover_as_free && leftover > 0) {
      savingPromises.push(
        savingsService.createSaving({
          amount: leftover,
          currency: payload.currency,
          date: payload.date,
          method: payload.method,
          note: payload.note ? `${payload.note} (sobrante)` : 'Sobrante de repartición',
          type: 'free',
          batch_id: batch.id,
        })
      );
    }

    await Promise.all(savingPromises);

    return batch.id;
  },
};
