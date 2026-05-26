/**
 * ProAhorro — Sistema de espaciado
 * Base 4px para coherencia
 */
export const Spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  12: 48,
  14: 56,
  16: 64,

  // Semánticos
  screenHorizontal: 20,
  screenVertical: 24,
  cardPadding: 20,
  sectionGap: 24,
  itemGap: 12,
  buttonHeight: 52,
  inputHeight: 52,
  iconSize: 24,
  iconSizeLarge: 32,
  iconSizeXL: 48,
} as const;

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  full: 9999,

  // Semánticos
  button: 14,
  card: 20,
  input: 14,
  badge: 8,
  modal: 24,
  bottomSheet: 28,
  avatar: 9999,
} as const;
