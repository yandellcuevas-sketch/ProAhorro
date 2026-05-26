import { supabase } from './supabaseClient';
import type { User } from '../types';

export const authService = {
  /**
   * Iniciar sesión con email y contraseña
   */
  async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) throw new Error(mapAuthError(error.message));
    return data;
  },

  /**
   * Registrar nuevo usuario
   */
  async register(name: string, email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: { name },
      },
    });

    if (error) throw new Error(mapAuthError(error.message));

    // Crear perfil de usuario y configuración inicial
    if (data.user) {
      await Promise.all([
        supabase.from('users').upsert({
          id: data.user.id,
          name,
          email: email.trim().toLowerCase(),
          auth_provider: 'email',
          main_currency: 'DOP',
        }),
        supabase.from('settings').upsert({
          user_id: data.user.id,
          main_currency: 'DOP',
          theme: 'light',
          pin_enabled: false,
          biometric_enabled: false,
          notifications_enabled: true,
          onboarding_done: false,
        }),
      ]);
    }

    return data;
  },

  /**
   * Cerrar sesión
   */
  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error('Error al cerrar sesión. Intenta de nuevo.');
  },

  /**
   * Enviar email de recuperación de contraseña
   */
  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(
      email.trim().toLowerCase(),
      {
        redirectTo: 'proahorro://reset-password',
      }
    );
    if (error) throw new Error(mapAuthError(error.message));
  },

  /**
   * Obtener sesión actual
   */
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) return null;
    return session;
  },

  /**
   * Obtener usuario actual desde la base de datos
   */
  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .is('deleted_at', null)
      .single();

    if (error) return null;
    return data as User;
  },

  /**
   * Escuchar cambios de sesión
   */
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  },
};

/**
 * Mapear errores de Supabase Auth a mensajes amigables en español
 */
function mapAuthError(errorMessage: string): string {
  const map: Record<string, string> = {
    'Invalid login credentials': 'Email o contraseña incorrectos.',
    'Email not confirmed': 'Debes confirmar tu email antes de ingresar.',
    'User already registered': 'Ya existe una cuenta con ese email.',
    'Password should be at least 6 characters': 'La contraseña debe tener al menos 8 caracteres.',
    'Rate limit exceeded': 'Demasiados intentos. Espera unos minutos.',
    'Email rate limit exceeded': 'Demasiados intentos. Espera unos minutos.',
    'For security purposes, you can only request this once every 60 seconds':
      'Por seguridad, espera 60 segundos antes de intentar de nuevo.',
  };

  for (const [key, value] of Object.entries(map)) {
    if (errorMessage.includes(key)) return value;
  }

  return 'Ocurrió un error inesperado. Intenta de nuevo.';
}
