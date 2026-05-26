import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, Pressable,
  RefreshControl, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../components/ui/Card';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { EmptyState } from '../../components/ui/EmptyState';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius, Shadows } from '../../theme';
import { useGoalsStore } from '../../store/goalsStore';
import { formatAmount } from '../../utils/format';
import type { Goal } from '../../types';

const STATUS_LABELS: Record<string, string> = {
  active: 'Activa',
  paused: 'Pausada',
  completed: 'Completada',
};
const STATUS_COLORS: Record<string, string> = {
  active: Colors.primary,
  paused: Colors.warning,
  completed: Colors.primary,
};

interface GoalsScreenProps {
  onCreateGoal: () => void;
  onGoalDetail: (goal: Goal) => void;
}

export const GoalsScreen: React.FC<GoalsScreenProps> = ({
  onCreateGoal,
  onGoalDetail,
}) => {
  const { goals, isLoading, fetchGoals } = useGoalsStore();
  const [filter, setFilter] = useState<'all' | 'active' | 'paused' | 'completed'>('all');

  useEffect(() => { fetchGoals(); }, []);

  const filtered = filter === 'all'
    ? goals
    : goals.filter((g) => g.status === filter);

  const renderGoal = ({ item }: { item: Goal }) => (
    <Pressable onPress={() => onGoalDetail(item)} style={styles.goalPressable}>
      <Card style={styles.goalCard}>
        <View style={styles.goalHeader}>
          <View style={[styles.goalIcon, { backgroundColor: (item.color ?? Colors.primary) + '20' }]}>
            <Ionicons name={item.icon as any ?? 'wallet'} size={22} color={item.color ?? Colors.primary} />
          </View>
          <View style={styles.goalMeta}>
            <Text style={styles.goalName} numberOfLines={1}>{item.name}</Text>
            {item.deadline && (
              <Text style={styles.goalDeadline}>
                Límite: {new Date(item.deadline + 'T00:00:00').toLocaleDateString('es-DO', { day: '2-digit', month: 'short', year: 'numeric' })}
              </Text>
            )}
          </View>
          <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[item.status] + '18' }]}>
            <Text style={[styles.statusText, { color: STATUS_COLORS[item.status] }]}>
              {STATUS_LABELS[item.status] ?? item.status}
            </Text>
          </View>
        </View>

        <View style={styles.amountsRow}>
          <Text style={styles.currentAmount}>{formatAmount(item.current_amount, item.currency)}</Text>
          <Text style={styles.targetAmount}>de {formatAmount(item.target_amount, item.currency)}</Text>
        </View>

        <ProgressBar progress={item.progress_pct} color={item.color ?? Colors.primary} showPercentage />
      </Card>
    </Pressable>
  );

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={[Colors.primaryDeep, Colors.primaryDark]} style={styles.header}>
        <Text style={styles.headerTitle}>Mis metas</Text>
        <Text style={styles.headerSub}>{goals.filter(g => g.status === 'active').length} metas activas</Text>
      </LinearGradient>

      {/* Filtros */}
      <View style={styles.filtersRow}>
        {(['all', 'active', 'paused', 'completed'] as const).map((f) => (
          <Pressable key={f} style={[styles.filterChip, filter === f && styles.filterChipActive]} onPress={() => setFilter(f)}>
            <Text style={[styles.filterChipText, filter === f && styles.filterChipTextActive]}>
              {f === 'all' ? 'Todas' : STATUS_LABELS[f]}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderGoal}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={() => fetchGoals()} tintColor={Colors.primary} />
        }
        ListEmptyComponent={
          !isLoading ? (
            <EmptyState
              icon="flag-outline"
              title="Sin metas aún"
              subtitle="Crea tu primera meta de ahorro y empieza a progresar."
              actionLabel="Crear meta"
              onAction={onCreateGoal}
            />
          ) : null
        }
      />

      {/* FAB */}
      <Pressable style={styles.fab} onPress={onCreateGoal}>
        <LinearGradient colors={[Colors.primary, Colors.primaryDark]} style={styles.fabGradient}>
          <Ionicons name="add" size={28} color={Colors.white} />
        </LinearGradient>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.backgroundMain },
  header: { paddingTop: 60, paddingBottom: 24, paddingHorizontal: Spacing.screenHorizontal },
  headerTitle: { fontFamily: FontFamily.soraBold, fontSize: FontSize['2xl'], color: Colors.white },
  headerSub: { fontFamily: FontFamily.dmSansRegular, fontSize: FontSize.sm, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  filtersRow: { flexDirection: 'row', paddingHorizontal: Spacing.screenHorizontal, paddingVertical: Spacing[3], gap: 8 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: BorderRadius.full, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.white },
  filterChipActive: { borderColor: Colors.primary, backgroundColor: Colors.primary },
  filterChipText: { fontFamily: FontFamily.dmSansMedium, fontSize: FontSize.sm, color: Colors.textMedium },
  filterChipTextActive: { color: Colors.white },
  list: { padding: Spacing.screenHorizontal, paddingBottom: 100 },
  goalPressable: { marginBottom: Spacing[3] },
  goalCard: { gap: Spacing[3] },
  goalHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing[3] },
  goalIcon: { width: 44, height: 44, borderRadius: BorderRadius.md, alignItems: 'center', justifyContent: 'center' },
  goalMeta: { flex: 1 },
  goalName: { fontFamily: FontFamily.dmSansSemiBold, fontSize: FontSize.base, color: Colors.textDark },
  goalDeadline: { fontFamily: FontFamily.dmSansRegular, fontSize: FontSize.xs, color: Colors.textLight, marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: BorderRadius.full },
  statusText: { fontFamily: FontFamily.dmSansMedium, fontSize: FontSize.xs },
  amountsRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
  currentAmount: { fontFamily: FontFamily.soraSemiBold, fontSize: FontSize.xl, color: Colors.textDark },
  targetAmount: { fontFamily: FontFamily.dmSansRegular, fontSize: FontSize.sm, color: Colors.textLight },
  fab: { position: 'absolute', bottom: 24, right: 24, ...Shadows.fab },
  fabGradient: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
});
