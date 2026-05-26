/**
 * ProAhorro — Paleta de colores oficial
 * Tema: Verde dólar premium con blanco
 */
export const Colors = {
  // ─── Verdes principales ─────────────────────────────────
  primary: '#0B8F3A',       // Verde dólar — botones, CTAs, acentos
  primaryDark: '#064E2E',   // Verde oscuro — fondos hero, headers
  primaryDeep: '#03301C',   // Verde más oscuro — texto sobre fondo claro
  primaryLight: '#DFF5E7',  // Verde claro — fondos de tarjetas suaves
  primarySoft: '#F0FAF4',   // Verde suave — background de pantallas

  // ─── Neutros ────────────────────────────────────────────
  white: '#FFFFFF',
  backgroundMain: '#F4F6F5',  // Gris fondo principal
  backgroundCard: '#FFFFFF',  // Fondo de tarjetas
  backgroundInput: '#F8FAFA', // Fondo de inputs

  // ─── Texto ──────────────────────────────────────────────
  textDark: '#1C1C1C',      // Texto principal
  textMedium: '#4A5568',    // Texto secundario
  textLight: '#9AA5B4',     // Texto deshabilitado / placeholder
  textOnGreen: '#FFFFFF',   // Texto sobre fondos verdes

  // ─── Semánticos ─────────────────────────────────────────
  danger: '#E53935',        // Rojo peligro — eliminar, errores críticos
  dangerLight: '#FFEBEE',   // Rojo suave — backgrounds de error
  warning: '#FF8F00',       // Naranja — advertencias
  warningLight: '#FFF8E1',  // Naranja suave
  success: '#0B8F3A',       // Igual que primary
  successLight: '#DFF5E7',  // Igual que primaryLight

  // ─── UI Elements ────────────────────────────────────────
  border: '#E8EEEB',        // Bordes suaves
  borderStrong: '#C5D5CC',  // Bordes marcados
  divider: '#EEF2F0',       // Divisores
  overlay: 'rgba(0,0,0,0.5)',       // Overlays modales
  overlayLight: 'rgba(0,0,0,0.15)', // Overlays suaves

  // ─── Gráficos ───────────────────────────────────────────
  chart: {
    primary: '#0B8F3A',
    secondary: '#22C55E',
    tertiary: '#86EFAC',
    accent: '#064E2E',
    muted: '#DFF5E7',
  },

  // ─── Modo oscuro (preparado para futuro) ────────────────
  dark: {
    background: '#0A0F0C',
    surface: '#131A15',
    card: '#1A2B1F',
    text: '#F0FAF4',
    textMedium: '#9AA5B4',
    border: '#2D4A38',
  },
} as const;

export type ColorKey = keyof typeof Colors;
