/**
 * ProAhorro — Sombras suaves estilo fintech
 */
import { Platform } from 'react-native';

const createShadow = (
  color: string,
  offset: { width: number; height: number },
  opacity: number,
  radius: number,
  elevation: number
) => ({
  ...Platform.select({
    ios: {
      shadowColor: color,
      shadowOffset: offset,
      shadowOpacity: opacity,
      shadowRadius: radius,
    },
    android: {
      elevation,
    },
  }),
});

export const Shadows = {
  none: {},

  xs: createShadow('#064E2E', { width: 0, height: 1 }, 0.06, 4, 2),

  sm: createShadow('#064E2E', { width: 0, height: 2 }, 0.08, 8, 4),

  md: createShadow('#064E2E', { width: 0, height: 4 }, 0.10, 12, 6),

  lg: createShadow('#064E2E', { width: 0, height: 8 }, 0.12, 16, 10),

  xl: createShadow('#064E2E', { width: 0, height: 12 }, 0.15, 24, 14),

  // Sombra especial para tarjeta hero
  hero: createShadow('#03301C', { width: 0, height: 8 }, 0.20, 20, 12),

  // Sombra para botón principal
  button: createShadow('#0B8F3A', { width: 0, height: 4 }, 0.25, 12, 8),

  // Sombra para botón de peligro
  buttonDanger: createShadow('#E53935', { width: 0, height: 4 }, 0.20, 12, 8),

  // Sombra para FAB
  fab: createShadow('#0B8F3A', { width: 0, height: 6 }, 0.30, 16, 12),
} as const;
