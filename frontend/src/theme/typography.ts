/**
 * ProAhorro — Sistema tipográfico
 * DM Sans para texto general
 * Sora para montos, números y títulos destacados
 */
import { Platform } from 'react-native';

export const FontFamily = {
  // DM Sans — Texto general
  dmSansRegular: 'DMSans-Regular',
  dmSansMedium: 'DMSans-Medium',
  dmSansSemiBold: 'DMSans-SemiBold',
  dmSansBold: 'DMSans-Bold',

  // Sora — Números y títulos de impacto
  soraRegular: 'Sora-Regular',
  soraSemiBold: 'Sora-SemiBold',
  soraBold: 'Sora-Bold',

  // Fallback sistema
  systemDefault: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }),
} as const;

export const FontSize = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 24,
  '2xl': 28,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
} as const;

export const LineHeight = {
  tight: 1.2,
  snug: 1.35,
  normal: 1.5,
  relaxed: 1.65,
} as const;

// Estilos de texto reutilizables
export const TextStyles = {
  // Títulos
  heroAmount: {
    fontFamily: FontFamily.soraBold,
    fontSize: FontSize['4xl'],
    lineHeight: FontSize['4xl'] * LineHeight.tight,
  },
  titleLarge: {
    fontFamily: FontFamily.soraSemiBold,
    fontSize: FontSize['2xl'],
    lineHeight: FontSize['2xl'] * LineHeight.snug,
  },
  titleMedium: {
    fontFamily: FontFamily.soraSemiBold,
    fontSize: FontSize.xl,
    lineHeight: FontSize.xl * LineHeight.snug,
  },
  titleSmall: {
    fontFamily: FontFamily.dmSansSemiBold,
    fontSize: FontSize.lg,
    lineHeight: FontSize.lg * LineHeight.snug,
  },

  // Cuerpo
  bodyLarge: {
    fontFamily: FontFamily.dmSansRegular,
    fontSize: FontSize.md,
    lineHeight: FontSize.md * LineHeight.normal,
  },
  bodyMedium: {
    fontFamily: FontFamily.dmSansRegular,
    fontSize: FontSize.base,
    lineHeight: FontSize.base * LineHeight.normal,
  },
  bodySmall: {
    fontFamily: FontFamily.dmSansRegular,
    fontSize: FontSize.sm,
    lineHeight: FontSize.sm * LineHeight.normal,
  },

  // Labels
  labelMedium: {
    fontFamily: FontFamily.dmSansMedium,
    fontSize: FontSize.base,
    lineHeight: FontSize.base * LineHeight.normal,
  },
  labelSmall: {
    fontFamily: FontFamily.dmSansMedium,
    fontSize: FontSize.sm,
    lineHeight: FontSize.sm * LineHeight.normal,
  },

  // Números/montos
  amountLarge: {
    fontFamily: FontFamily.soraBold,
    fontSize: FontSize['3xl'],
    lineHeight: FontSize['3xl'] * LineHeight.tight,
  },
  amountMedium: {
    fontFamily: FontFamily.soraSemiBold,
    fontSize: FontSize.xl,
    lineHeight: FontSize.xl * LineHeight.tight,
  },
  amountSmall: {
    fontFamily: FontFamily.soraSemiBold,
    fontSize: FontSize.md,
    lineHeight: FontSize.md * LineHeight.tight,
  },

  // Caption
  caption: {
    fontFamily: FontFamily.dmSansRegular,
    fontSize: FontSize.xs,
    lineHeight: FontSize.xs * LineHeight.normal,
  },
} as const;
