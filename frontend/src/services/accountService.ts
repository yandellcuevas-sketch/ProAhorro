import { supabase } from './supabaseClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

export const accountService = {
  /**
   * Eliminar cuenta del usuario actual
   * Flujo: soft delete → eliminar datos → logout → limpiar cache
   */
  async deleteAccount(): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No se encontró sesión activa.');

    // Llamar función SQL segura que opera solo sobre auth.uid()
    const { error } = await supabase.rpc('delete_current_user_data');

    if (error) {
      throw new Error(
        'No se pudo eliminar la cuenta. Por favor contacta a soporte@proahorro.app'
      );
    }

    // Limpiar cache local
    await Promise.allSettled([
      AsyncStorage.clear(),
      SecureStore.deleteItemAsync('proahorro_access_token'),
      SecureStore.deleteItemAsync('proahorro_refresh_token'),
      SecureStore.deleteItemAsync('proahorro_pin_hash'),
    ]);

    // Cerrar sesión de Supabase
    await supabase.auth.signOut();
  },

  /**
   * Actualizar perfil del usuario
   */
  async updateProfile(payload: { name?: string; main_currency?: string }): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Sesión expirada.');

    const { error } = await supabase
      .from('users')
      .update(payload)
      .eq('id', user.id);

    if (error) throw new Error('No se pudo actualizar el perfil.');
  },

  /**
   * Obtener configuración del usuario
   */
  async getSettings() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Sesión expirada.');

    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) return null;
    return data;
  },

  /**
   * Actualizar configuración
   */
  async updateSettings(payload: Record<string, unknown>): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Sesión expirada.');

    const { error } = await supabase
      .from('settings')
      .update(payload)
      .eq('user_id', user.id);

    if (error) throw new Error('No se pudo guardar la configuración.');
  },

  /**
   * Exportar datos del usuario como JSON
   */
  async exportUserData(): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Sesión expirada.');

    const [savings, goals, batches] = await Promise.all([
      supabase.from('savings').select('*').eq('user_id', user.id),
      supabase.from('goals').select('*').eq('user_id', user.id),
      supabase.from('saving_batches').select('*').eq('user_id', user.id),
    ]);

    const exportData = {
      exported_at: new Date().toISOString(),
      app: 'ProAhorro',
      user_id: user.id,
      savings: savings.data ?? [],
      goals: goals.data ?? [],
      saving_batches: batches.data ?? [],
    };

    return JSON.stringify(exportData, null, 2);
  },
};
