/**
 * ProAhorro — Constantes de la aplicación
 */

export const APP_NAME = 'ProAhorro';
export const APP_TAGLINE = 'Ahorra con claridad';
export const APP_VERSION = '1.0.0';
export const BUNDLE_ID = 'com.proahorro.app';
export const SUPPORT_EMAIL = 'soporte@proahorro.app';
export const PRIVACY_URL = 'https://proahorro.app/privacy';
export const TERMS_URL = 'https://proahorro.app/terms';

// ─── Storage Keys ────────────────────────────────────────────────────────────
export const STORAGE_KEYS = {
  SESSION: 'proahorro_session',
  ONBOARDING_DONE: 'proahorro_onboarding_done',
  LAST_CURRENCY: 'proahorro_last_currency',
  LAST_METHOD: 'proahorro_last_method',
  THEME: 'proahorro_theme',
} as const;

// ─── Secure Store Keys ───────────────────────────────────────────────────────
export const SECURE_KEYS = {
  ACCESS_TOKEN: 'proahorro_access_token',
  REFRESH_TOKEN: 'proahorro_refresh_token',
  PIN: 'proahorro_pin_hash',
} as const;

// ─── Métodos de ahorro ────────────────────────────────────────────────────────
export const SAVING_METHODS = [
  { value: 'cash', label: 'Efectivo', icon: 'cash-outline' },
  { value: 'transfer', label: 'Transferencia', icon: 'swap-horizontal-outline' },
  { value: 'card', label: 'Tarjeta', icon: 'card-outline' },
  { value: 'digital', label: 'Cuenta digital', icon: 'phone-portrait-outline' },
  { value: 'other', label: 'Otro', icon: 'ellipsis-horizontal-outline' },
] as const;

// ─── Destinos de ahorro ───────────────────────────────────────────────────────
export const SAVING_DESTINATIONS = [
  { value: 'free', label: 'Ahorro libre', icon: 'wallet-outline' },
  { value: 'goal', label: 'Asociar a meta', icon: 'flag-outline' },
  { value: 'new_goal', label: 'Crear nueva meta', icon: 'add-circle-outline' },
  { value: 'split', label: 'Repartir entre metas', icon: 'git-branch-outline' },
] as const;

// ─── Iconos de metas ─────────────────────────────────────────────────────────
export const GOAL_ICONS = [
  { value: 'airplane', label: 'Viaje' },
  { value: 'car', label: 'Carro' },
  { value: 'home', label: 'Casa' },
  { value: 'medkit', label: 'Emergencia' },
  { value: 'school', label: 'Educación' },
  { value: 'laptop', label: 'Tecnología' },
  { value: 'gift', label: 'Regalo' },
  { value: 'bicycle', label: 'Bicicleta' },
  { value: 'restaurant', label: 'Gastronomía' },
  { value: 'fitness', label: 'Salud' },
  { value: 'business', label: 'Negocio' },
  { value: 'wallet', label: 'Fondo general' },
] as const;

// ─── Colores de metas ────────────────────────────────────────────────────────
export const GOAL_COLORS = [
  '#0B8F3A', // Verde principal
  '#064E2E', // Verde oscuro
  '#22C55E', // Verde vivo
  '#3B82F6', // Azul
  '#8B5CF6', // Morado
  '#F59E0B', // Ámbar
  '#EF4444', // Rojo
  '#EC4899', // Rosa
  '#06B6D4', // Cian
  '#84CC16', // Lima
  '#F97316', // Naranja
  '#6B7280', // Gris
] as const;

// ─── Onboarding slides ───────────────────────────────────────────────────────
export const ONBOARDING_SLIDES = [
  {
    id: 1,
    title: 'Controla tus ahorros\ncon claridad.',
    subtitle: 'Registra cada peso que guardas y mantén el control de tu dinero.',
    icon: 'wallet',
  },
  {
    id: 2,
    title: 'Crea metas o ahorra\nlibremente.',
    subtitle: 'Desde un viaje hasta una emergencia — tú decides adónde va tu dinero.',
    icon: 'flag',
  },
  {
    id: 3,
    title: 'Reparte un monto\nentre varias metas.',
    subtitle: 'Divide un ahorro en segundos y mantén todo organizado en un solo lugar.',
    icon: 'git-branch',
  },
] as const;

// ─── Paginación ───────────────────────────────────────────────────────────────
export const HISTORY_PAGE_SIZE = 20;
export const GOALS_PAGE_SIZE = 50;

// ─── Duración splash ──────────────────────────────────────────────────────────
export const SPLASH_DURATION_MS = 1500;

// ─── Monedas del sistema ─────────────────────────────────────────────────────
export const SYSTEM_CURRENCIES = [
  { code: 'DOP', name: 'Peso Dominicano', symbol: 'RD$' },
  { code: 'USD', name: 'Dólar Americano', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
] as const;
