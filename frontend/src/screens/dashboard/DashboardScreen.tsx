import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../components/ui/Card';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { EmptyState } from '../../components/ui/EmptyState';
import { Colors, FontFamily, FontSize, Spacing, Shadows, BorderRadius } from '../../theme';
import { savingsService } from '../../services/savingsService';
import { useAuthStore } from '../../store/authStore';
import type { Saving, Goal } from '../../types';

// Utilidad para formatear montos
const formatAmount = (amount: number, currency: string) => {
  const symbols: Record<string, string> = { DOP: 'RD$', USD: '$', EUR: '€' };
  const symbol = symbols[currency] ?? currency;
  return `${symbol}${amount.toLocaleString('es-DO', { minimumFractionDigits: 0 })}`;
};

const METHOD_LABELS: Record<string, string> = {
  cash: 'Efectivo',
  transfer: 'Transferencia',
  card: 'Tarjeta',
  digital: 'Cuenta digital',
  other: 'Otro',
};

interface DashboardScreenProps {
  onAddSaving: () => void;
  onGoToGoals: () => void;
  onGoToHistory: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onAddSaving,
  onGoToGoals,
  onGoToHistory,
}) => {
  const { user } = useAuthStore();
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const data = await savingsService.getDashboardSummary();
      setSummary(data);
    } catch {
      // Silenciar error — mostrar estado vacío
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  const mainCurrency = user?.main_currency ?? 'DOP';
  const mainTotal = summary?.total_by_currency?.find(
    (t: any) => t.currency === mainCurrency
  );

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Buenos días';
    if (h < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
      >
        {/* ─── HERO CARD ─── */}
        <LinearGradient
          colors={[Colors.primaryDeep, Colors.primaryDark, '#0D6B3D']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <Text style={styles.greeting}>{greeting()}, {user?.name?.split(' ')[0]} 👋</Text>
          <Text style={styles.heroLabel}>Total ahorrado</Text>

          {loading ? (
            <ActivityIndicator color={Colors.white} size="large" style={{ marginVertical: 16 }} />
          ) : (
            <Text style={styles.heroAmount}>
              {mainTotal
                ? formatAmount(mainTotal.total, mainCurrency)
                : formatAmount(0, mainCurrency)}
            </Text>
          )}

          <View style={styles.heroStats}>
            <View style={styles.heroStat}>
              <Text style={styles.heroStatLabel}>Este mes</Text>
              <Text style={styles.heroStatValue}>
                {summary ? formatAmount(summary.monthly_total, mainCurrency) : '—'}
              </Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStat}>
              <Text style={styles.heroStatLabel}>Metas activas</Text>
              <Text style={styles.heroStatValue}>
                {summary?.active_goals?.length ?? '—'}
              </Text>
            </View>
          </View>

          {/* Más monedas */}
          {summary?.total_by_currency?.filter((t: any) => t.currency !== mainCurrency).map((t: any) => (
            <View key={t.currency} style={styles.otherCurrency}>
              <Text style={styles.otherCurrencyText}>
                {formatAmount(t.total, t.currency)}
              </Text>
            </View>
          ))}
        </LinearGradient>

        {/* ─── ACCIONES RÁPIDAS ─── */}
        <View style={styles.quickActions}>
          <Pressable style={styles.quickAction} onPress={onAddSaving}>
            <View style={[styles.quickActionIcon, { backgroundColor: Colors.primaryLight }]}>
              <Ionicons name="add" size={24} color={Colors.primary} />
            </View>
            <Text style={styles.quickActionLabel}>Agregar</Text>
          </Pressable>
          <Pressable style={styles.quickAction} onPress={onGoToGoals}>
            <View style={[styles.quickActionIcon, { backgroundColor: Colors.primaryLight }]}>
              <Ionicons name="flag-outline" size={22} color={Colors.primary} />
            </View>
            <Text style={styles.quickActionLabel}>Metas</Text>
          </Pressable>
          <Pressable style={styles.quickAction} onPress={onGoToHistory}>
            <View style={[styles.quickActionIcon, { backgroundColor: Colors.primaryLight }]}>
              <Ionicons name="time-outline" size={22} color={Colors.primary} />
            </View>
            <Text style={styles.quickActionLabel}>Historial</Text>
          </Pressable>
          <Pressable style={styles.quickAction} onPress={onAddSaving}>
            <View style={[styles.quickActionIcon, { backgroundColor: Colors.primaryLight }]}>
              <Ionicons name="git-branch-outline" size={22} color={Colors.primary} />
            </View>
            <Text style={styles.quickActionLabel}>Repartir</Text>
          </Pressable>
        </View>

        {/* ─── METAS ACTIVAS ─── */}
        {summary?.active_goals?.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Metas activas</Text>
              <Pressable onPress={onGoToGoals}>
                <Text style={styles.sectionLink}>Ver todas</Text>
              </Pressable>
            </View>
            {summary.active_goals.map((goal: Goal) => (
              <Card key={goal.id} style={styles.goalCard}>
                <View style={styles.goalRow}>
                  <View style={[styles.goalIcon, { backgroundColor: goal.color + '20' }]}>
                    <Ionicons name={goal.icon as any ?? 'wallet'} size={20} color={goal.color ?? Colors.primary} />
                  </View>
                  <View style={styles.goalInfo}>
                    <Text style={styles.goalName}>{goal.name}</Text>
                    <Text style={styles.goalAmounts}>
                      {formatAmount(goal.current_amount, goal.currency)} de {formatAmount(goal.target_amount, goal.currency)}
                    </Text>
                  </View>
                  <Text style={styles.goalPct}>{Math.round(goal.progress_pct)}%</Text>
                </View>
                <ProgressBar
                  progress={goal.progress_pct}
                  showPercentage={false}
                  color={goal.color ?? Colors.primary}
                />
              </Card>
            ))}
          </View>
        )}

        {/* ─── ÚLTIMOS MOVIMIENTOS ─── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Últimos movimientos</Text>
            <Pressable onPress={onGoToHistory}>
              <Text style={styles.sectionLink}>Ver todo</Text>
            </Pressable>
          </View>

          {!loading && (!summary?.recent_savings || summary.recent_savings.length === 0) ? (
            <EmptyState
              icon="wallet-outline"
              title="Aún no hay ahorros"
              subtitle="Toca el botón + para registrar tu primer ahorro"
              actionLabel="Agregar ahorro"
              onAction={onAddSaving}
            />
          ) : (
            summary?.recent_savings?.map((s: Saving) => (
              <Card key={s.id} style={styles.savingCard}>
                <View style={styles.savingRow}>
                  <View style={styles.savingLeft}>
                    <View style={styles.savingIconBg}>
                      <Ionicons name="trending-up" size={18} color={Colors.primary} />
                    </View>
                    <View>
                      <Text style={styles.savingType}>
                        {s.type === 'free' ? 'Ahorro libre' : s.goal?.name ?? 'Meta'}
                      </Text>
                      <Text style={styles.savingMeta}>
                        {METHOD_LABELS[s.method]} · {new Date(s.date).toLocaleDateString('es-DO', { day: '2-digit', month: 'short' })}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.savingAmount}>
                    +{formatAmount(s.amount, s.currency)}
                  </Text>
                </View>
              </Card>
            ))
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ─── FAB ─── */}
      <Pressable style={styles.fab} onPress={onAddSaving}>
        <LinearGradient
          colors={[Colors.primary, Colors.primaryDark]}
          style={styles.fabGradient}
        >
          <Ionicons name="add" size={28} color={Colors.white} />
        </LinearGradient>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.backgroundMain },
  scroll: { paddingBottom: 24 },

  heroCard: {
    margin: Spacing.screenHorizontal,
    borderRadius: BorderRadius.card,
    padding: Spacing[6],
    ...Shadows.hero,
  },
  greeting: {
    fontFamily: FontFamily.dmSansRegular,
    fontSize: FontSize.base,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  heroLabel: {
    fontFamily: FontFamily.dmSansRegular,
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 8,
  },
  heroAmount: {
    fontFamily: FontFamily.soraBold,
    fontSize: FontSize['4xl'],
    color: Colors.white,
    marginBottom: Spacing[4],
  },
  heroStats: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: BorderRadius.md,
    padding: Spacing[4],
  },
  heroStat: { flex: 1, alignItems: 'center' },
  heroStatLabel: {
    fontFamily: FontFamily.dmSansRegular,
    fontSize: FontSize.xs,
    color: 'rgba(255,255,255,0.6)',
  },
  heroStatValue: {
    fontFamily: FontFamily.soraSemiBold,
    fontSize: FontSize.md,
    color: Colors.white,
    marginTop: 2,
  },
  heroStatDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
  otherCurrency: {
    marginTop: Spacing[2],
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing[2],
    paddingVertical: 2,
  },
  otherCurrencyText: {
    fontFamily: FontFamily.soraSemiBold,
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.9)',
  },

  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.screenHorizontal,
    gap: 12,
    marginBottom: Spacing[4],
  },
  quickAction: { flex: 1, alignItems: 'center', gap: 8 },
  quickActionIcon: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionLabel: {
    fontFamily: FontFamily.dmSansMedium,
    fontSize: FontSize.xs,
    color: Colors.textDark,
  },

  section: { paddingHorizontal: Spacing.screenHorizontal, marginBottom: Spacing[4] },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing[3],
  },
  sectionTitle: {
    fontFamily: FontFamily.dmSansSemiBold,
    fontSize: FontSize.md,
    color: Colors.textDark,
  },
  sectionLink: {
    fontFamily: FontFamily.dmSansMedium,
    fontSize: FontSize.sm,
    color: Colors.primary,
  },

  goalCard: { marginBottom: Spacing[3], gap: Spacing[3] },
  goalRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing[3] },
  goalIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalInfo: { flex: 1 },
  goalName: {
    fontFamily: FontFamily.dmSansSemiBold,
    fontSize: FontSize.base,
    color: Colors.textDark,
  },
  goalAmounts: {
    fontFamily: FontFamily.dmSansRegular,
    fontSize: FontSize.xs,
    color: Colors.textMedium,
    marginTop: 2,
  },
  goalPct: {
    fontFamily: FontFamily.soraSemiBold,
    fontSize: FontSize.sm,
    color: Colors.primary,
  },

  savingCard: { marginBottom: Spacing[2] },
  savingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  savingLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing[3] },
  savingIconBg: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  savingType: {
    fontFamily: FontFamily.dmSansMedium,
    fontSize: FontSize.sm,
    color: Colors.textDark,
  },
  savingMeta: {
    fontFamily: FontFamily.dmSansRegular,
    fontSize: FontSize.xs,
    color: Colors.textLight,
    marginTop: 2,
  },
  savingAmount: {
    fontFamily: FontFamily.soraSemiBold,
    fontSize: FontSize.base,
    color: Colors.primary,
  },

  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    ...Shadows.fab,
  },
  fabGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
