import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  Animated,
  RefreshControl,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { EmptyState } from '../../components/ui/EmptyState';
import { S, Theme } from '../../theme/style';
import { savingsService } from '../../services/savingsService';
import { useAuthStore } from '../../store/authStore';
import type { Saving, Goal } from '../../types';

// ─── Utilidades ───────────────────────────────────────────────
const formatAmount = (amount: number, currency: string) => {
  const symbols: Record<string, string> = { DOP: 'RD$', USD: '$', EUR: '€' };
  const symbol = symbols[currency] ?? currency;
  return `${symbol}${amount.toLocaleString('es-DO', { minimumFractionDigits: 0 })}`;
};

const METHOD_ICONS: Record<string, keyof typeof MaterialCommunityIcons.glyphMap> = {
  cash:     'cash',
  transfer: 'bank-transfer',
  card:     'credit-card-outline',
  digital:  'cellphone',
  other:    'dots-horizontal-circle-outline',
};

const METHOD_LABELS: Record<string, string> = {
  cash: 'Efectivo', transfer: 'Transferencia', card: 'Tarjeta', digital: 'Cuenta digital', other: 'Otro',
};

const QUICK_ACTIONS = [
  { icon: 'plus-circle-outline' as const,     label: 'Agregar',   action: 'add'     },
  { icon: 'flag-outline' as const,            label: 'Metas',     action: 'goals'   },
  { icon: 'history' as const,                 label: 'Historial', action: 'history' },
  { icon: 'arrow-split-vertical' as const,    label: 'Repartir',  action: 'split'   },
];

// ─── Interfaces ───────────────────────────────────────────────
interface DashboardScreenProps {
  onAddSaving: () => void;
  onGoToGoals: () => void;
  onGoToHistory: () => void;
}

// ─── Componente ───────────────────────────────────────────────
export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onAddSaving,
  onGoToGoals,
  onGoToHistory,
}) => {
  const { user } = useAuthStore();
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Animación de entrada
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 480, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 8, tension: 50, useNativeDriver: true }),
    ]).start();
  }, []);

  const load = async () => {
    try {
      const data = await savingsService.getDashboardSummary();
      setSummary(data);
    } catch {
      // Estado vacío visible
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onRefresh = () => { setRefreshing(true); load(); };

  const mainCurrency = user?.main_currency ?? 'DOP';
  const mainTotal = summary?.total_by_currency?.find((t: any) => t.currency === mainCurrency);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Buenos días';
    if (h < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const handleQuickAction = (action: string) => {
    if (action === 'add')     return onAddSaving();
    if (action === 'goals')   return onGoToGoals();
    if (action === 'history') return onGoToHistory();
    if (action === 'split')   return onAddSaving();
  };

  return (
    <View style={S.Layout.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={Theme.color.bgMain} />

      <ScrollView
        contentContainerStyle={[S.Layout.scrollPad, { paddingTop: Theme.space.sm }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Theme.color.primary} />
        }
      >
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

          {/* ─── HERO CARD ─── */}
          <LinearGradient
            colors={[Theme.color.primaryDarker, Theme.color.primaryDark, '#0D6B3D']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[S.Cards.hero, { marginBottom: Theme.space.lg }]}
          >
            {/* Decoraciones */}
            <View style={S.HeroCard.decCircle1} />
            <View style={S.HeroCard.decCircle2} />

            {/* Top row */}
            <View style={[S.Layout.rowBetween, { marginBottom: Theme.space.md }]}>
              <View style={S.HeroCard.logoRow}>
                <Text style={S.HeroCard.appName}>ProAhorro</Text>
              </View>
              <View style={S.HeroCard.notifBtn}>
                <MaterialCommunityIcons name="bell-outline" size={18} color={Theme.color.white} />
              </View>
            </View>

            <Text style={S.HeroCard.greeting}>{greeting()}, {user?.name?.split(' ')[0]} 👋</Text>
            <Text style={S.HeroCard.label}>TOTAL AHORRADO</Text>

            {loading ? (
              <ActivityIndicator color={Theme.color.white} size="large" style={{ marginVertical: 16 }} />
            ) : (
              <Text style={S.HeroCard.amount}>
                {mainTotal ? formatAmount(mainTotal.total, mainCurrency) : formatAmount(0, mainCurrency)}
              </Text>
            )}

            {/* Stats pill */}
            <View style={[S.Layout.row, { gap: Theme.space.lg, marginBottom: Theme.space.sm }]}>
              <View>
                <Text style={[S.Typography.caption, { color: 'rgba(255,255,255,0.55)' }]}>Este mes</Text>
                <Text style={[S.Typography.amountXs, { color: Theme.color.white }]}>
                  {summary ? formatAmount(summary.monthly_total, mainCurrency) : '—'}
                </Text>
              </View>
              <View style={{ width: 1, backgroundColor: 'rgba(255,255,255,0.2)' }} />
              <View>
                <Text style={[S.Typography.caption, { color: 'rgba(255,255,255,0.55)' }]}>Metas activas</Text>
                <Text style={[S.Typography.amountXs, { color: Theme.color.white }]}>
                  {summary?.active_goals?.length ?? '—'}
                </Text>
              </View>
            </View>

            {/* Otras monedas */}
            {summary?.total_by_currency?.filter((t: any) => t.currency !== mainCurrency).map((t: any) => (
              <View key={t.currency} style={S.Chips.heroChip}>
                <Text style={S.Chips.heroChipText}>{formatAmount(t.total, t.currency)}</Text>
              </View>
            ))}
          </LinearGradient>

          {/* ─── ACCIONES RÁPIDAS ─── */}
          <View style={[S.Layout.row, { justifyContent: 'space-between', marginBottom: Theme.space.lg }]}>
            {QUICK_ACTIONS.map(qa => (
              <Pressable
                key={qa.action}
                style={{ flex: 1, alignItems: 'center', gap: 8 }}
                onPress={() => handleQuickAction(qa.action)}
              >
                <View style={S.Buttons.iconCircle}>
                  <MaterialCommunityIcons name={qa.icon} size={22} color={Theme.color.primary} />
                </View>
                <Text style={[S.Typography.caption, { color: Theme.color.textDark }]}>{qa.label}</Text>
              </Pressable>
            ))}
          </View>

          {/* ─── METAS ACTIVAS ─── */}
          {summary?.active_goals?.length > 0 && (
            <View style={{ marginBottom: Theme.space.lg }}>
              <View style={[S.Layout.rowBetween, { marginBottom: Theme.space.sm }]}>
                <Text style={S.Typography.headingSm}>Metas activas</Text>
                <Pressable onPress={onGoToGoals}>
                  <Text style={S.Typography.linkSm}>Ver todas</Text>
                </Pressable>
              </View>
              {summary.active_goals.map((goal: Goal) => (
                <View key={goal.id} style={[S.Cards.basePad, { marginBottom: Theme.space.sm, gap: Theme.space.sm }]}>
                  <View style={[S.Layout.row, { gap: Theme.space.sm }]}>
                    <View style={[S.IconWrap.md, { backgroundColor: (goal.color ?? Theme.color.primary) + '20' }]}>
                      <MaterialCommunityIcons
                        name={(goal.icon as any) ?? 'wallet-outline'}
                        size={20}
                        color={goal.color ?? Theme.color.primary}
                      />
                    </View>
                    <View style={S.Layout.flex1}>
                      <Text style={S.Typography.headingSm}>{goal.name}</Text>
                      <Text style={S.Typography.bodySm}>
                        {formatAmount(goal.current_amount, goal.currency)} de {formatAmount(goal.target_amount, goal.currency)}
                      </Text>
                    </View>
                    <Text style={[S.Typography.amountXs, { color: goal.color ?? Theme.color.primary }]}>
                      {Math.round(goal.progress_pct)}%
                    </Text>
                  </View>
                  <ProgressBar progress={goal.progress_pct} color={goal.color ?? Theme.color.primary} />
                </View>
              ))}
            </View>
          )}

          {/* ─── ÚLTIMOS MOVIMIENTOS ─── */}
          <View style={{ marginBottom: Theme.space.lg }}>
            <View style={[S.Layout.rowBetween, { marginBottom: Theme.space.sm }]}>
              <Text style={S.Typography.headingSm}>Últimos movimientos</Text>
              <Pressable onPress={onGoToHistory}>
                <Text style={S.Typography.linkSm}>Ver todo</Text>
              </Pressable>
            </View>

            {!loading && (!summary?.recent_savings || summary.recent_savings.length === 0) ? (
              <EmptyState
                icon="piggy-bank-outline"
                title="Aún no hay ahorros"
                subtitle="Toca el botón + para registrar tu primer ahorro"
                actionLabel="Agregar ahorro"
                onAction={onAddSaving}
              />
            ) : (
              <View style={S.Cards.listSection}>
                {summary?.recent_savings?.map((s: Saving, i: number) => (
                  <View
                    key={s.id}
                    style={[
                      S.Cards.movement,
                      i < summary.recent_savings.length - 1 && S.ListItems.rowBorder,
                    ]}
                  >
                    <View style={s.type === 'free' ? S.IconWrap.free : S.IconWrap.goal}>
                      <MaterialCommunityIcons
                        name={METHOD_ICONS[s.method] ?? 'cash'}
                        size={17}
                        color={s.type === 'free' ? Theme.color.primary : Theme.color.info}
                      />
                    </View>
                    <View style={S.Layout.flex1}>
                      <Text style={[S.Typography.headingSm, { fontSize: Theme.size.sm }]}>
                        {s.type === 'free' ? 'Ahorro libre' : s.goal?.name ?? 'Meta'}
                      </Text>
                      <Text style={S.Typography.bodySm}>
                        {METHOD_LABELS[s.method]} · {new Date(s.date).toLocaleDateString('es-DO', { day: '2-digit', month: 'short' })}
                      </Text>
                    </View>
                    <Text style={[S.Typography.amountSm, { color: Theme.color.primary }]}>
                      +{formatAmount(s.amount, s.currency)}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          <View style={{ height: Theme.space.xl }} />
        </Animated.View>
      </ScrollView>

      {/* ─── FAB ─── */}
      <Pressable style={[S.Buttons.fabLg, { position: 'absolute', bottom: 24, right: 24 }]} onPress={onAddSaving}>
        <MaterialCommunityIcons name="plus" size={28} color={Theme.color.white} />
      </Pressable>
    </View>
  );
};
