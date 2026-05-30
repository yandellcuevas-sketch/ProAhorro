// ============================================================
//  AhorroPro — Sistema de Diseño Completo
//  Un solo archivo. Importa lo que necesites.
//  Uso: import { S, Layout, Theme } from '../../theme/style';
// ============================================================

import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width: SW, height: SH } = Dimensions.get('window');

// ─────────────────────────────────────────────────────────────
//  1. TOKENS — La única fuente de verdad del diseño
// ─────────────────────────────────────────────────────────────
export const Theme = {
    color: {
        // Marca
        primary: '#0B8F3A',
        primaryDark: '#064E2E',
        primaryDarker: '#03301C',
        primaryLight: '#DFF5E7',
        primaryLighter: '#F0FAF4',
        primaryMid: '#1DA851',
        primaryAccent: '#00C853',
        primaryMuted: '#5BBF82',

        // Fondos
        bgMain: '#F4F6F5',
        bgCard: '#FFFFFF',
        bgElevated: '#FFFFFF',

        // Texto
        textDark: '#1C1C1C',
        textMedium: '#4A5550',
        textMuted: '#7D908A',
        textPlaceholder: '#A8B5AF',

        // Neutros
        white: '#FFFFFF',
        gray100: '#EAEEED',
        gray200: '#D2D8D5',
        gray300: '#A8B5AF',
        gray400: '#7D908A',
        gray500: '#556260',
        gray600: '#3A4A47',

        // Bordes
        borderLight: '#E8EEEB',
        borderMid: '#C8D5D0',

        // Semánticos
        danger: '#E53935',
        dangerLight: '#FEECEC',
        warning: '#F59E0B',
        warningLight: '#FEF3C7',
        info: '#1976D2',
        infoLight: '#E3F2FD',
    },

    font: {
        // Sora — títulos, importes, números
        soraBold: 'Sora-Bold',
        soraSemiBold: 'Sora-SemiBold',
        soraRegular: 'Sora-Regular',
        // DM Sans — cuerpo y UI
        dmSansBold: 'DMSans-Bold',
        dmSansMedium: 'DMSans-Medium',
        dmSansRegular: 'DMSans-Regular',
    },

    size: {
        xs: 10,
        sm: 13,
        md: 15,
        lg: 17,
        xl: 20,
        xxl: 24,
        xxxl: 30,
        hero: 36,
    },

    space: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        xxl: 48,
        xxxl: 64,
    },

    radius: {
        xs: 4,
        sm: 8,
        md: 12,
        lg: 16,
        xl: 20,
        xxl: 24,
        full: 9999,
    },

    shadow: {
        xs: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 1,
        },
        sm: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.07,
            shadowRadius: 8,
            elevation: 2,
        },
        md: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.10,
            shadowRadius: 14,
            elevation: 4,
        },
        lg: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.13,
            shadowRadius: 24,
            elevation: 7,
        },
        green: {
            shadowColor: '#0B8F3A',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.38,
            shadowRadius: 14,
            elevation: 8,
        },
        greenLg: {
            shadowColor: '#0B8F3A',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.45,
            shadowRadius: 24,
            elevation: 12,
        },
        danger: {
            shadowColor: '#E53935',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.32,
            shadowRadius: 14,
            elevation: 6,
        },
    },

    screen: {
        width: SW,
        height: SH,
    },
} as const;

// ─────────────────────────────────────────────────────────────
//  2. LAYOUT — Contenedores, pantallas, headers, scroll
// ─────────────────────────────────────────────────────────────
export const Layout = StyleSheet.create({

    // Pantalla base
    screen: {
        flex: 1,
        backgroundColor: Theme.color.bgMain,
    },
    screenWhite: {
        flex: 1,
        backgroundColor: Theme.color.bgCard,
    },

    // Scroll content
    scrollPad: {
        paddingHorizontal: Theme.space.md,
        paddingTop: Theme.space.sm,
        paddingBottom: Theme.space.xxl,
    },
    scrollPadLg: {
        paddingHorizontal: Theme.space.lg,
        paddingTop: Theme.space.lg,
        paddingBottom: Theme.space.xxl,
    },

    // Header de pantalla estándar
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Theme.space.md,
        paddingTop: Platform.OS === 'ios' ? 16 : 12,
        paddingBottom: 12,
        backgroundColor: Theme.color.bgMain,
    },
    headerWhite: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Theme.space.md,
        paddingTop: Platform.OS === 'ios' ? 16 : 12,
        paddingBottom: 12,
        backgroundColor: Theme.color.bgCard,
        borderBottomWidth: 1,
        borderBottomColor: Theme.color.borderLight,
    },
    headerTitle: {
        fontFamily: Theme.font.soraBold,
        fontSize: Theme.size.lg,
        color: Theme.color.textDark,
        letterSpacing: -0.3,
    },

    // Botón atrás circular
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Theme.color.bgCard,
        borderWidth: 1,
        borderColor: Theme.color.borderLight,
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Botón icono circular genérico
    iconBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Theme.color.bgCard,
        borderWidth: 1,
        borderColor: Theme.color.borderLight,
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Espaciador de sección
    sectionGap: {
        height: Theme.space.lg,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rowBetween: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    rowWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Theme.space.sm,
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    flex1: {
        flex: 1,
    },
});

// ─────────────────────────────────────────────────────────────
//  3. TIPOGRAFÍA — Todos los estilos de texto reutilizables
// ─────────────────────────────────────────────────────────────
export const Typography = StyleSheet.create({

    // Display — Sora (números grandes, títulos heroes)
    displayXl: {
        fontFamily: Theme.font.soraBold,
        fontSize: 40,
        letterSpacing: -1.5,
        lineHeight: 44,
        color: Theme.color.textDark,
    },
    displayLg: {
        fontFamily: Theme.font.soraBold,
        fontSize: 32,
        letterSpacing: -1.2,
        lineHeight: 36,
        color: Theme.color.textDark,
    },
    displayMd: {
        fontFamily: Theme.font.soraBold,
        fontSize: Theme.size.xxxl,
        letterSpacing: -0.8,
        lineHeight: 36,
        color: Theme.color.textDark,
    },

    // Títulos de pantalla
    headingXl: {
        fontFamily: Theme.font.soraBold,
        fontSize: Theme.size.xxl,
        letterSpacing: -0.6,
        lineHeight: 30,
        color: Theme.color.textDark,
    },
    headingLg: {
        fontFamily: Theme.font.soraBold,
        fontSize: Theme.size.xl,
        letterSpacing: -0.4,
        color: Theme.color.textDark,
    },
    headingMd: {
        fontFamily: Theme.font.soraSemiBold,
        fontSize: Theme.size.lg,
        letterSpacing: -0.3,
        color: Theme.color.textDark,
    },
    headingSm: {
        fontFamily: Theme.font.soraSemiBold,
        fontSize: Theme.size.md,
        color: Theme.color.textDark,
    },

    // Cuerpo — DM Sans
    bodyLg: {
        fontFamily: Theme.font.dmSansRegular,
        fontSize: Theme.size.md,
        lineHeight: 23,
        color: Theme.color.textMedium,
    },
    bodyMd: {
        fontFamily: Theme.font.dmSansRegular,
        fontSize: Theme.size.sm,
        lineHeight: 20,
        color: Theme.color.textMedium,
    },
    bodySm: {
        fontFamily: Theme.font.dmSansRegular,
        fontSize: Theme.size.xs + 1,
        lineHeight: 17,
        color: Theme.color.textMuted,
    },

    // Labels de formulario
    label: {
        fontFamily: Theme.font.dmSansMedium,
        fontSize: Theme.size.sm,
        fontWeight: '600' as const,
        color: Theme.color.textMedium,
    },
    labelCaps: {
        fontFamily: Theme.font.dmSansMedium,
        fontSize: Theme.size.xs,
        fontWeight: '600' as const,
        letterSpacing: 0.7,
        textTransform: 'uppercase' as const,
        color: Theme.color.textMuted,
    },

    // Importes numéricos
    amountHero: {
        fontFamily: Theme.font.soraBold,
        fontSize: Theme.size.hero,
        letterSpacing: -1.5,
        lineHeight: 42,
        color: Theme.color.textDark,
    },
    amountLg: {
        fontFamily: Theme.font.soraBold,
        fontSize: Theme.size.xxl,
        letterSpacing: -0.8,
        color: Theme.color.textDark,
    },
    amountMd: {
        fontFamily: Theme.font.soraBold,
        fontSize: Theme.size.lg,
        letterSpacing: -0.4,
        color: Theme.color.textDark,
    },
    amountSm: {
        fontFamily: Theme.font.soraSemiBold,
        fontSize: Theme.size.md,
        letterSpacing: -0.2,
        color: Theme.color.textDark,
    },
    amountXs: {
        fontFamily: Theme.font.soraSemiBold,
        fontSize: Theme.size.sm,
        color: Theme.color.textDark,
    },

    // Especiales
    link: {
        fontFamily: Theme.font.dmSansMedium,
        fontSize: Theme.size.md,
        fontWeight: '600' as const,
        color: Theme.color.primary,
    },
    linkSm: {
        fontFamily: Theme.font.dmSansMedium,
        fontSize: Theme.size.sm,
        fontWeight: '600' as const,
        color: Theme.color.primary,
    },
    danger: {
        fontFamily: Theme.font.dmSansMedium,
        fontSize: Theme.size.sm,
        color: Theme.color.danger,
        fontWeight: '600' as const,
    },
    muted: {
        fontFamily: Theme.font.dmSansRegular,
        fontSize: Theme.size.sm,
        color: Theme.color.textMuted,
    },
    caption: {
        fontFamily: Theme.font.dmSansRegular,
        fontSize: Theme.size.xs + 1,
        color: Theme.color.textMuted,
    },
});

// ─────────────────────────────────────────────────────────────
//  4. TARJETAS (CARDS) — Todos los contenedores visuales
// ─────────────────────────────────────────────────────────────
export const Cards = StyleSheet.create({

    // Card base
    base: {
        backgroundColor: Theme.color.bgCard,
        borderRadius: Theme.radius.lg,
        borderWidth: 1,
        borderColor: Theme.color.borderLight,
        ...Theme.shadow.sm,
    },
    basePad: {
        backgroundColor: Theme.color.bgCard,
        borderRadius: Theme.radius.lg,
        borderWidth: 1,
        borderColor: Theme.color.borderLight,
        padding: Theme.space.md,
        ...Theme.shadow.sm,
    },
    basePadLg: {
        backgroundColor: Theme.color.bgCard,
        borderRadius: Theme.radius.xl,
        borderWidth: 1,
        borderColor: Theme.color.borderLight,
        padding: Theme.space.lg,
        ...Theme.shadow.sm,
    },

    // Card hero del dashboard (fondo verde oscuro)
    hero: {
        backgroundColor: Theme.color.primaryDark,
        borderRadius: Theme.radius.xl,
        padding: Theme.space.lg,
        overflow: 'hidden' as const,
        position: 'relative' as const,
        ...Theme.shadow.greenLg,
    },

    // Card de meta
    goal: {
        backgroundColor: Theme.color.bgCard,
        borderRadius: Theme.radius.xl,
        borderWidth: 1,
        borderColor: Theme.color.borderLight,
        padding: Theme.space.md,
        marginBottom: Theme.space.sm,
        ...Theme.shadow.xs,
    },

    // Card de movimiento en historial
    movement: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        gap: Theme.space.sm,
        paddingVertical: 13,
        paddingHorizontal: Theme.space.md,
        backgroundColor: Theme.color.bgCard,
    },

    // Card de estadística
    stat: {
        flex: 1,
        backgroundColor: Theme.color.bgCard,
        borderRadius: Theme.radius.lg,
        borderWidth: 1,
        borderColor: Theme.color.borderLight,
        padding: Theme.space.md,
        ...Theme.shadow.xs,
    },

    // Card de sección agrupada (lista de configuración)
    listSection: {
        backgroundColor: Theme.color.bgCard,
        borderRadius: Theme.radius.lg,
        borderWidth: 1,
        borderColor: Theme.color.borderLight,
        overflow: 'hidden' as const,
        ...Theme.shadow.xs,
    },

    // Card con borde de peligro
    danger: {
        backgroundColor: Theme.color.dangerLight,
        borderRadius: Theme.radius.lg,
        borderWidth: 1.5,
        borderColor: Theme.color.danger + '30',
        padding: Theme.space.md,
    },

    // Card de monto (input de ahorro)
    amountInput: {
        backgroundColor: Theme.color.primaryLighter,
        borderRadius: Theme.radius.xl,
        borderWidth: 2,
        borderColor: Theme.color.primaryLight,
        padding: Theme.space.lg,
    },
    amountInputFocused: {
        backgroundColor: Theme.color.primaryLighter,
        borderRadius: Theme.radius.xl,
        borderWidth: 2,
        borderColor: Theme.color.primary,
        padding: Theme.space.lg,
    },

    // Card de onboarding / empty state
    centered: {
        backgroundColor: Theme.color.bgCard,
        borderRadius: Theme.radius.xl,
        padding: Theme.space.xl,
        alignItems: 'center' as const,
        ...Theme.shadow.sm,
    },
});

// ─────────────────────────────────────────────────────────────
//  5. FORMULARIOS — Inputs, selects, labels, errores
// ─────────────────────────────────────────────────────────────
export const Forms = StyleSheet.create({

    // Grupo de campo completo (label + input + error)
    group: {
        marginBottom: Theme.space.md,
    },
    groupSm: {
        marginBottom: Theme.space.sm,
    },

    // Row de label (label + link opcional)
    labelRow: {
        flexDirection: 'row' as const,
        justifyContent: 'space-between' as const,
        alignItems: 'center' as const,
        marginBottom: 6,
    },

    // Input estándar con ícono
    inputWrap: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        gap: 10,
        backgroundColor: Theme.color.bgMain,
        borderWidth: 1.5,
        borderColor: Theme.color.borderLight,
        borderRadius: Theme.radius.md,
        paddingHorizontal: Theme.space.md,
        paddingVertical: 14,
    },
    inputWrapFocused: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        gap: 10,
        backgroundColor: Theme.color.primaryLighter,
        borderWidth: 1.5,
        borderColor: Theme.color.primary,
        borderRadius: Theme.radius.md,
        paddingHorizontal: Theme.space.md,
        paddingVertical: 14,
    },
    inputWrapError: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        gap: 10,
        backgroundColor: Theme.color.dangerLight,
        borderWidth: 1.5,
        borderColor: Theme.color.danger,
        borderRadius: Theme.radius.md,
        paddingHorizontal: Theme.space.md,
        paddingVertical: 14,
    },

    // El TextInput en sí (sin bordes, va dentro de inputWrap)
    input: {
        flex: 1,
        fontFamily: Theme.font.dmSansRegular,
        fontSize: Theme.size.md,
        color: Theme.color.textDark,
        padding: 0,
    },

    // Input de importe grande (pantalla de agregar ahorro)
    amountField: {
        flex: 1,
        fontFamily: Theme.font.soraBold,
        fontSize: Theme.size.hero,
        color: Theme.color.textDark,
        letterSpacing: -1.5,
        padding: 0,
    },
    amountSymbol: {
        fontFamily: Theme.font.soraBold,
        fontSize: 26,
        color: Theme.color.primary,
        letterSpacing: -0.5,
    },
    amountCurrencyPill: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        gap: 4,
        backgroundColor: Theme.color.primaryLight,
        borderRadius: Theme.radius.full,
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
    amountCurrencyPillText: {
        fontFamily: Theme.font.dmSansMedium,
        fontSize: Theme.size.sm,
        fontWeight: '700' as const,
        color: Theme.color.primary,
    },

    // Textarea
    textareaWrap: {
        flexDirection: 'row' as const,
        alignItems: 'flex-start' as const,
        gap: 10,
        backgroundColor: Theme.color.bgCard,
        borderWidth: 1.5,
        borderColor: Theme.color.borderLight,
        borderRadius: Theme.radius.md,
        paddingHorizontal: Theme.space.md,
        paddingVertical: 12,
    },
    textarea: {
        flex: 1,
        fontFamily: Theme.font.dmSansRegular,
        fontSize: Theme.size.md,
        color: Theme.color.textDark,
        padding: 0,
        lineHeight: 22,
        minHeight: 64,
    },

    // Mensaje de error
    errorText: {
        fontFamily: Theme.font.dmSansRegular,
        fontSize: Theme.size.xs + 1,
        color: Theme.color.danger,
        marginTop: 4,
    },

    // Helper text
    helperText: {
        fontFamily: Theme.font.dmSansRegular,
        fontSize: Theme.size.xs + 1,
        color: Theme.color.textMuted,
        marginTop: 4,
    },

    // Divider con texto (— o continúa con —)
    dividerRow: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        gap: Theme.space.sm,
        marginVertical: Theme.space.lg,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: Theme.color.borderLight,
    },
    dividerText: {
        fontFamily: Theme.font.dmSansRegular,
        fontSize: Theme.size.sm,
        color: Theme.color.textMuted,
    },
});

// ─────────────────────────────────────────────────────────────
//  6. BOTONES — Todas las variantes
// ─────────────────────────────────────────────────────────────
export const Buttons = StyleSheet.create({

    // Primario — verde principal
    primary: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        gap: Theme.space.sm,
        backgroundColor: Theme.color.primary,
        borderRadius: Theme.radius.md,
        paddingVertical: 16,
        paddingHorizontal: Theme.space.lg,
        ...Theme.shadow.green,
    },
    primaryLg: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        gap: Theme.space.sm,
        backgroundColor: Theme.color.primary,
        borderRadius: Theme.radius.lg,
        paddingVertical: 18,
        paddingHorizontal: Theme.space.xl,
        ...Theme.shadow.green,
    },
    primaryText: {
        fontFamily: Theme.font.dmSansMedium,
        fontSize: Theme.size.md,
        fontWeight: '700' as const,
        color: Theme.color.white,
    },

    // Secundario — fondo verde claro
    secondary: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        gap: Theme.space.sm,
        backgroundColor: Theme.color.primaryLight,
        borderRadius: Theme.radius.md,
        paddingVertical: 14,
        paddingHorizontal: Theme.space.lg,
        borderWidth: 1,
        borderColor: Theme.color.primaryMuted + '40',
    },
    secondaryText: {
        fontFamily: Theme.font.dmSansMedium,
        fontSize: Theme.size.md,
        fontWeight: '600' as const,
        color: Theme.color.primaryDark,
    },

    // Outline — borde verde
    outline: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        gap: Theme.space.sm,
        backgroundColor: 'transparent',
        borderRadius: Theme.radius.md,
        paddingVertical: 14,
        paddingHorizontal: Theme.space.lg,
        borderWidth: 1.5,
        borderColor: Theme.color.primary,
    },
    outlineText: {
        fontFamily: Theme.font.dmSansMedium,
        fontSize: Theme.size.md,
        fontWeight: '600' as const,
        color: Theme.color.primary,
    },

    // Ghost — borde gris
    ghost: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        gap: Theme.space.sm,
        backgroundColor: Theme.color.bgCard,
        borderRadius: Theme.radius.md,
        paddingVertical: 14,
        paddingHorizontal: Theme.space.lg,
        borderWidth: 1.5,
        borderColor: Theme.color.borderMid,
    },
    ghostText: {
        fontFamily: Theme.font.dmSansMedium,
        fontSize: Theme.size.md,
        fontWeight: '600' as const,
        color: Theme.color.textDark,
    },

    // Danger
    danger: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        gap: Theme.space.sm,
        backgroundColor: Theme.color.danger,
        borderRadius: Theme.radius.lg,
        paddingVertical: 17,
        paddingHorizontal: Theme.space.lg,
        ...Theme.shadow.danger,
    },
    dangerText: {
        fontFamily: Theme.font.dmSansMedium,
        fontSize: Theme.size.md,
        fontWeight: '700' as const,
        color: Theme.color.white,
    },

    // Danger ghost — fondo rojo claro
    dangerGhost: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        gap: Theme.space.sm,
        backgroundColor: Theme.color.bgCard,
        borderRadius: Theme.radius.lg,
        paddingVertical: 14,
        borderWidth: 1,
        borderColor: Theme.color.dangerLight,
    },
    dangerGhostText: {
        fontFamily: Theme.font.dmSansMedium,
        fontSize: Theme.size.md,
        fontWeight: '600' as const,
        color: Theme.color.danger,
    },

    // Apple login
    apple: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        gap: Theme.space.sm,
        backgroundColor: Theme.color.textDark,
        borderRadius: Theme.radius.md,
        paddingVertical: 15,
        paddingHorizontal: Theme.space.lg,
    },
    appleText: {
        fontFamily: Theme.font.dmSansMedium,
        fontSize: Theme.size.md,
        fontWeight: '600' as const,
        color: Theme.color.white,
    },

    // Google login
    google: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        gap: Theme.space.sm,
        backgroundColor: Theme.color.bgCard,
        borderRadius: Theme.radius.md,
        paddingVertical: 15,
        paddingHorizontal: Theme.space.lg,
        borderWidth: 1.5,
        borderColor: Theme.color.borderMid,
    },
    googleText: {
        fontFamily: Theme.font.dmSansMedium,
        fontSize: Theme.size.md,
        fontWeight: '600' as const,
        color: Theme.color.textDark,
    },

    // FAB central del navbar
    fab: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: Theme.color.primary,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        marginTop: -20,
        ...Theme.shadow.green,
    },
    fabLg: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: Theme.color.primary,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        ...Theme.shadow.greenLg,
    },

    // Botón icono pequeño circular
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Theme.color.primaryLight,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
    },
    iconCircleGreen: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Theme.color.primary,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        ...Theme.shadow.green,
    },

    // Estado deshabilitado (aplica opacity encima de cualquier botón)
    disabled: {
        opacity: 0.42,
    },

    // Texto genérico de acción pequeña
    actionText: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        gap: 5,
        paddingHorizontal: 10,
        paddingVertical: 7,
        borderRadius: Theme.radius.sm,
        backgroundColor: Theme.color.bgMain,
    },
    actionTextLabel: {
        fontFamily: Theme.font.dmSansMedium,
        fontSize: 12,
        fontWeight: '600' as const,
        color: Theme.color.primary,
    },
});

// ─────────────────────────────────────────────────────────────
//  7. CHIPS & BADGES — Pills, etiquetas de estado, filtros
// ─────────────────────────────────────────────────────────────
export const Chips = StyleSheet.create({

    // Chip de filtro (historial, gráficos)
    filter: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        gap: 5,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: Theme.radius.full,
        borderWidth: 1.5,
        borderColor: Theme.color.borderLight,
        backgroundColor: Theme.color.bgCard,
    },
    filterActive: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        gap: 5,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: Theme.radius.full,
        borderWidth: 1.5,
        borderColor: Theme.color.primary,
        backgroundColor: Theme.color.primary,
    },
    filterText: {
        fontFamily: Theme.font.dmSansMedium,
        fontSize: Theme.size.sm,
        fontWeight: '600' as const,
        color: Theme.color.textMuted,
    },
    filterTextActive: {
        fontFamily: Theme.font.dmSansMedium,
        fontSize: Theme.size.sm,
        fontWeight: '600' as const,
        color: Theme.color.white,
    },

    // Chip de método de pago
    method: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        gap: 6,
        paddingHorizontal: 14,
        paddingVertical: 9,
        borderRadius: Theme.radius.full,
        borderWidth: 1.5,
        borderColor: Theme.color.borderLight,
        backgroundColor: Theme.color.bgCard,
    },
    methodActive: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        gap: 6,
        paddingHorizontal: 14,
        paddingVertical: 9,
        borderRadius: Theme.radius.full,
        borderWidth: 1.5,
        borderColor: Theme.color.primary,
        backgroundColor: Theme.color.primary,
    },
    methodText: {
        fontFamily: Theme.font.dmSansMedium,
        fontSize: Theme.size.sm,
        fontWeight: '600' as const,
        color: Theme.color.textMedium,
    },
    methodTextActive: {
        fontFamily: Theme.font.dmSansMedium,
        fontSize: Theme.size.sm,
        fontWeight: '600' as const,
        color: Theme.color.white,
    },

    // Badge de estado de meta
    badgeGreen: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        gap: 4,
        paddingHorizontal: 9,
        paddingVertical: 4,
        borderRadius: Theme.radius.full,
        backgroundColor: Theme.color.primaryLight,
    },
    badgeWarning: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        gap: 4,
        paddingHorizontal: 9,
        paddingVertical: 4,
        borderRadius: Theme.radius.full,
        backgroundColor: Theme.color.warningLight,
    },
    badgeInfo: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        gap: 4,
        paddingHorizontal: 9,
        paddingVertical: 4,
        borderRadius: Theme.radius.full,
        backgroundColor: Theme.color.infoLight,
    },
    badgeDanger: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        gap: 4,
        paddingHorizontal: 9,
        paddingVertical: 4,
        borderRadius: Theme.radius.full,
        backgroundColor: Theme.color.dangerLight,
    },
    badgeGray: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        gap: 4,
        paddingHorizontal: 9,
        paddingVertical: 4,
        borderRadius: Theme.radius.full,
        backgroundColor: Theme.color.gray100,
    },
    badgeTextGreen: {
        fontFamily: Theme.font.dmSansMedium,
        fontSize: 11,
        fontWeight: '600' as const,
        color: Theme.color.primaryDark,
    },
    badgeTextWarning: {
        fontFamily: Theme.font.dmSansMedium,
        fontSize: 11,
        fontWeight: '600' as const,
        color: '#92400E',
    },
    badgeTextInfo: {
        fontFamily: Theme.font.dmSansMedium,
        fontSize: 11,
        fontWeight: '600' as const,
        color: '#0D47A1',
    },
    badgeTextDanger: {
        fontFamily: Theme.font.dmSansMedium,
        fontSize: 11,
        fontWeight: '600' as const,
        color: Theme.color.danger,
    },
    badgeTextGray: {
        fontFamily: Theme.font.dmSansMedium,
        fontSize: 11,
        fontWeight: '600' as const,
        color: Theme.color.gray500,
    },

    // Hero chip (sobre el card oscuro del dashboard)
    heroChip: {
        backgroundColor: 'rgba(255,255,255,0.12)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.18)',
        borderRadius: Theme.radius.full,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    heroChipText: {
        fontFamily: Theme.font.dmSansMedium,
        fontSize: 11,
        color: 'rgba(255,255,255,0.82)',
    },
});

// ─────────────────────────────────────────────────────────────
//  8. ICONOS CONTENEDORES — Envolturas para íconos en cards
// ─────────────────────────────────────────────────────────────
export const IconWrap = StyleSheet.create({

    sm: {
        width: 32,
        height: 32,
        borderRadius: 9,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        backgroundColor: Theme.color.primaryLight,
    },
    md: {
        width: 40,
        height: 40,
        borderRadius: 11,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        backgroundColor: Theme.color.primaryLight,
    },
    lg: {
        width: 48,
        height: 48,
        borderRadius: 13,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        backgroundColor: Theme.color.primaryLight,
    },
    xl: {
        width: 60,
        height: 60,
        borderRadius: 16,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        backgroundColor: Theme.color.primaryLight,
    },

    // Variante de movimiento libre
    free: {
        width: 38,
        height: 38,
        borderRadius: 10,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        backgroundColor: Theme.color.primaryLight,
    },
    // Variante de movimiento con meta
    goal: {
        width: 38,
        height: 38,
        borderRadius: 10,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        backgroundColor: Theme.color.infoLight,
    },
    // Variante de lote/repartición
    batch: {
        width: 38,
        height: 38,
        borderRadius: 10,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        backgroundColor: Theme.color.warningLight,
    },
    // Danger
    danger: {
        width: 38,
        height: 38,
        borderRadius: 10,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        backgroundColor: Theme.color.dangerLight,
    },
});

// ─────────────────────────────────────────────────────────────
//  9. BARRAS DE PROGRESO
// ─────────────────────────────────────────────────────────────
export const Progress = StyleSheet.create({

    trackSm: {
        width: '100%' as const,
        height: 5,
        backgroundColor: Theme.color.gray100,
        borderRadius: Theme.radius.full,
        overflow: 'hidden' as const,
    },
    trackMd: {
        width: '100%' as const,
        height: 7,
        backgroundColor: Theme.color.primaryLight,
        borderRadius: Theme.radius.full,
        overflow: 'hidden' as const,
    },
    trackLg: {
        width: '100%' as const,
        height: 10,
        backgroundColor: Theme.color.gray100,
        borderRadius: Theme.radius.full,
        overflow: 'hidden' as const,
    },
    fill: {
        height: '100%' as const,
        borderRadius: Theme.radius.full,
        backgroundColor: Theme.color.primary,
    },
    fillDanger: {
        height: '100%' as const,
        borderRadius: Theme.radius.full,
        backgroundColor: Theme.color.danger,
    },
    fillWarning: {
        height: '100%' as const,
        borderRadius: Theme.radius.full,
        backgroundColor: Theme.color.warning,
    },
});

// ─────────────────────────────────────────────────────────────
//  10. LISTA ITEMS — Filas reutilizables en cualquier pantalla
// ─────────────────────────────────────────────────────────────
export const ListItems = StyleSheet.create({

    // Fila estándar (configuración, privacidad, cuenta)
    row: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        gap: 12,
        paddingVertical: 14,
        paddingHorizontal: Theme.space.md,
        backgroundColor: Theme.color.bgCard,
    },
    rowBorder: {
        borderBottomWidth: 1,
        borderBottomColor: '#F0F4F2',
    },
    rowLabel: {
        flex: 1,
        fontFamily: Theme.font.dmSansMedium,
        fontSize: Theme.size.md,
        fontWeight: '500' as const,
        color: Theme.color.textDark,
    },
    rowSublabel: {
        fontFamily: Theme.font.dmSansRegular,
        fontSize: 11,
        color: Theme.color.textMuted,
        marginTop: 1,
    },

    // Header de sección en listas agrupadas (fecha en historial)
    sectionHeader: {
        flexDirection: 'row' as const,
        justifyContent: 'space-between' as const,
        alignItems: 'center' as const,
        paddingVertical: 8,
    },
    sectionHeaderText: {
        fontFamily: Theme.font.dmSansMedium,
        fontSize: Theme.size.sm,
        fontWeight: '700' as const,
        color: Theme.color.textDark,
    },
    sectionHeaderCount: {
        fontFamily: Theme.font.dmSansRegular,
        fontSize: 11,
        color: Theme.color.textMuted,
    },
});

// ─────────────────────────────────────────────────────────────
//  11. NAVBAR — Barra inferior de navegación
// ─────────────────────────────────────────────────────────────
export const Navbar = StyleSheet.create({

    container: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        justifyContent: 'space-around' as const,
        backgroundColor: Theme.color.bgCard,
        borderTopWidth: 1,
        borderTopColor: Theme.color.borderLight,
        paddingTop: 10,
        paddingBottom: Platform.OS === 'ios' ? 28 : 14,
        paddingHorizontal: Theme.space.sm,
    },
    item: {
        flex: 1,
        alignItems: 'center' as const,
        gap: 3,
        paddingTop: 2,
    },
    label: {
        fontFamily: Theme.font.dmSansMedium,
        fontSize: 10,
        fontWeight: '600' as const,
        color: Theme.color.gray300,
        marginTop: 2,
    },
    labelActive: {
        color: Theme.color.primary,
    },
    activeDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: Theme.color.primary,
        position: 'absolute' as const,
        top: -5,
    },
});

// ─────────────────────────────────────────────────────────────
//  12. ESTADOS VACÍOS — Empty states y skeletons
// ─────────────────────────────────────────────────────────────
export const Empty = StyleSheet.create({

    container: {
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        paddingVertical: Theme.space.xxxl,
        paddingHorizontal: Theme.space.xl,
    },
    icon: {
        fontSize: 48,
        marginBottom: Theme.space.md,
        opacity: 0.35,
    },
    title: {
        fontFamily: Theme.font.soraSemiBold,
        fontSize: Theme.size.lg,
        color: Theme.color.textDark,
        textAlign: 'center' as const,
        marginBottom: Theme.space.sm,
    },
    description: {
        fontFamily: Theme.font.dmSansRegular,
        fontSize: Theme.size.md,
        color: Theme.color.textMuted,
        textAlign: 'center' as const,
        lineHeight: 22,
        maxWidth: 280,
        marginBottom: Theme.space.xl,
    },

    skeletonBase: {
        backgroundColor: Theme.color.gray100,
        borderRadius: Theme.radius.sm,
    },
    skeletonText: {
        height: 14,
        backgroundColor: Theme.color.gray100,
        borderRadius: Theme.radius.xs,
        marginBottom: 8,
    },
    skeletonCard: {
        height: 80,
        backgroundColor: Theme.color.gray100,
        borderRadius: Theme.radius.lg,
        marginBottom: Theme.space.sm,
    },
});

// ─────────────────────────────────────────────────────────────
//  13. SELECTOR DE DESTINO (AddSavingScreen)
// ─────────────────────────────────────────────────────────────
export const DestinationPicker = StyleSheet.create({

    grid: {
        flexDirection: 'row' as const,
        flexWrap: 'wrap' as const,
        gap: Theme.space.sm,
        marginBottom: Theme.space.lg,
    },
    option: {
        width: '48%' as const,
        backgroundColor: Theme.color.bgCard,
        borderRadius: Theme.radius.lg,
        borderWidth: 2,
        borderColor: Theme.color.borderLight,
        padding: Theme.space.md,
        alignItems: 'center' as const,
        position: 'relative' as const,
    },
    optionActive: {
        borderColor: Theme.color.primary,
        backgroundColor: Theme.color.primaryLighter,
    },
    iconWrap: {
        width: 50,
        height: 50,
        borderRadius: Theme.radius.md,
        backgroundColor: Theme.color.gray100,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        marginBottom: Theme.space.sm,
    },
    iconWrapActive: {
        backgroundColor: Theme.color.primaryLight,
    },
    label: {
        fontFamily: Theme.font.dmSansMedium,
        fontSize: Theme.size.sm,
        fontWeight: '700' as const,
        color: Theme.color.textDark,
        textAlign: 'center' as const,
        marginBottom: 3,
    },
    labelActive: {
        color: Theme.color.primary,
    },
    desc: {
        fontFamily: Theme.font.dmSansRegular,
        fontSize: 11,
        color: Theme.color.textMuted,
        textAlign: 'center' as const,
    },
    checkmark: {
        position: 'absolute' as const,
        top: 8,
        right: 8,
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: Theme.color.primary,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
    },
});

// ─────────────────────────────────────────────────────────────
//  14. PANEL DE REPARTICIÓN (SplitSavingScreen)
// ─────────────────────────────────────────────────────────────
export const SplitPanel = StyleSheet.create({

    summaryCard: {
        backgroundColor: Theme.color.bgCard,
        borderRadius: Theme.radius.xl,
        borderWidth: 1,
        borderColor: Theme.color.borderLight,
        padding: Theme.space.lg,
        marginBottom: Theme.space.lg,
        ...Theme.shadow.sm,
    },
    summaryRow: {
        flexDirection: 'row' as const,
        justifyContent: 'space-between' as const,
        alignItems: 'center' as const,
        paddingVertical: 5,
    },
    goalRow: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        backgroundColor: Theme.color.bgCard,
        borderRadius: Theme.radius.lg,
        borderWidth: 1.5,
        borderColor: Theme.color.borderLight,
        padding: Theme.space.md,
        marginBottom: 8,
        gap: Theme.space.sm,
    },
    goalRowActive: {
        borderColor: Theme.color.primary,
        backgroundColor: Theme.color.primaryLighter,
    },
    checkbox: {
        width: 22,
        height: 22,
        borderRadius: 6,
        borderWidth: 1.5,
        borderColor: Theme.color.borderMid,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        backgroundColor: Theme.color.bgCard,
    },
    checkboxActive: {
        backgroundColor: Theme.color.primary,
        borderColor: Theme.color.primary,
    },
    assignInput: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        backgroundColor: Theme.color.bgCard,
        borderWidth: 1.5,
        borderColor: Theme.color.primaryLight,
        borderRadius: Theme.radius.sm,
        paddingHorizontal: 10,
        paddingVertical: 7,
        minWidth: 100,
    },
    assignInputText: {
        fontFamily: Theme.font.soraBold,
        fontSize: Theme.size.md,
        color: Theme.color.textDark,
        padding: 0,
        letterSpacing: -0.3,
        minWidth: 56,
        textAlign: 'right' as const,
    },
    warningRow: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        gap: 5,
        marginTop: 8,
    },
    warningText: {
        fontFamily: Theme.font.dmSansRegular,
        fontSize: 12,
        color: Theme.color.danger,
        flex: 1,
    },
    quickFillBtn: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        gap: 6,
        backgroundColor: Theme.color.primaryLight,
        borderRadius: Theme.radius.md,
        paddingVertical: 11,
        marginBottom: Theme.space.lg,
        borderWidth: 1,
        borderColor: Theme.color.primaryMuted + '40',
    },
    quickFillText: {
        fontFamily: Theme.font.dmSansMedium,
        fontSize: Theme.size.sm,
        fontWeight: '600' as const,
        color: Theme.color.primaryDark,
    },
});

// ─────────────────────────────────────────────────────────────
//  15. HERO CARD del Dashboard (decoraciones y texto)
// ─────────────────────────────────────────────────────────────
export const HeroCard = StyleSheet.create({

    decCircle1: {
        position: 'absolute' as const,
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: 'rgba(255,255,255,0.04)',
        top: -60,
        right: -50,
    },
    decCircle2: {
        position: 'absolute' as const,
        width: 130,
        height: 130,
        borderRadius: 65,
        backgroundColor: 'rgba(0,200,83,0.07)',
        bottom: -35,
        right: 70,
    },
    logoRow: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        gap: 8,
    },
    logoWrap: {
        width: 32,
        height: 32,
        borderRadius: 8,
        overflow: 'hidden' as const,
    },
    appName: {
        fontFamily: Theme.font.soraBold,
        fontSize: Theme.size.lg,
        color: Theme.color.white,
        letterSpacing: -0.3,
    },
    notifBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.12)',
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
    },
    notifDot: {
        position: 'absolute' as const,
        top: 7,
        right: 7,
        width: 7,
        height: 7,
        borderRadius: 3.5,
        backgroundColor: '#FF5252',
        borderWidth: 1.5,
        borderColor: Theme.color.primaryDark,
    },
    greeting: {
        fontFamily: Theme.font.dmSansRegular,
        fontSize: Theme.size.sm,
        color: 'rgba(255,255,255,0.6)',
        marginBottom: Theme.space.xs,
    },
    label: {
        fontFamily: Theme.font.dmSansMedium,
        fontSize: Theme.size.xs,
        letterSpacing: 0.8,
        textTransform: 'uppercase' as const,
        color: 'rgba(255,255,255,0.5)',
        marginBottom: 4,
    },
    amount: {
        fontFamily: Theme.font.soraBold,
        fontSize: 34,
        color: Theme.color.white,
        letterSpacing: -1.2,
        lineHeight: 40,
        marginBottom: Theme.space.md,
    },
});

// ─────────────────────────────────────────────────────────────
//  16. PANTALLA DE ELIMINACIÓN DE CUENTA
// ─────────────────────────────────────────────────────────────
export const DeleteAccount = StyleSheet.create({

    iconWrap: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: Theme.color.dangerLight,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        alignSelf: 'center' as const,
        marginBottom: Theme.space.lg,
    },
    consequenceRow: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        gap: 8,
        paddingVertical: 5,
    },
    xCircle: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: Theme.color.danger,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
    },
    consequenceText: {
        fontFamily: Theme.font.dmSansRegular,
        fontSize: Theme.size.sm,
        color: '#7F1D1D',
        flex: 1,
    },
    confirmInputReady: {
        backgroundColor: Theme.color.dangerLight,
        borderColor: Theme.color.danger,
    },
    confirmKeyword: {
        fontFamily: Theme.font.dmSansMedium,
        color: Theme.color.danger,
        fontWeight: '700' as const,
    },
});

// ─────────────────────────────────────────────────────────────
//  EXPORT AGRUPADO — Importa solo lo que necesites
//  import { S } from '../../theme/style'
//  <View style={S.Cards.basePad}>
//  <Text style={S.Typography.amountHero}>
//  <TouchableOpacity style={S.Buttons.primary}>
// ─────────────────────────────────────────────────────────────
export const S = {
    Theme,
    Layout,
    Typography,
    Cards,
    Forms,
    Buttons,
    Chips,
    IconWrap,
    Progress,
    ListItems,
    Navbar,
    Empty,
    DestinationPicker,
    SplitPanel,
    HeroCard,
    DeleteAccount,
};

export default S;