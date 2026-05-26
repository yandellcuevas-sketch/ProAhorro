import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, Pressable,
  RefreshControl, Alert, StatusBar, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius } from '../../theme';
import { useSavingsStore } from '../../store/savingsStore';
import { formatAmount, formatDateShort } from '../../utils/format';
import type { Saving } from '../../types';

const METHOD_ICONS: Record<string, string> = {
  cash: 'cash-outline', transfer: 'swap-horizontal-outline',
  card: 'card-outline', digital: 'phone-portrait-outline', other: 'ellipsis-horizontal-outline',
};
const TYPE_LABELS: Record<string, string> = {
  free: 'Libre', goal: 'Meta', split: 'Repartición',
};

interface HistoryScreenProps {
  onSavingDetail: (saving: Saving) => void;
  onAddSaving: () => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({ onSavingDetail, onAddSaving }) => {
  const { savings, isLoading, isLoadingMore, hasMore, fetchSavings, loadMore, deleteSaving, filters, setFilter, clearFilters } = useSavingsStore();
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => { fetchSavings(); }, []);

  const handleDelete = (saving: Saving) => {
    Alert.alert('Eliminar ahorro', `¿Eliminar este ahorro de ${formatAmount(saving.amount, saving.currency)}?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => deleteSaving(saving.id, saving.goal_id) },
    ]);
  };

  const applyFilter = (key: string, value: string | undefined) => {
    setFilter(key, value);
    setTimeout(() => fetchSavings(), 50);
  };

  const renderItem = ({ item }: { item: Saving }) => (
    <Pressable onPress={() => onSavingDetail(item)}>
      <Card style={styles.savingCard}>
        <View style={styles.cardRow}>
          <View style={styles.iconBg}>
            <Ionicons name={METHOD_ICONS[item.method] as any ?? 'cash-outline'} size={18} color={Colors.primary} />
          </View>
          <View style={styles.savingInfo}>
            <Text style={styles.savingType}>
              {item.type === 'free' ? 'Ahorro libre' : item.goal?.name ?? 'Meta'}
              {item.batch_id ? ' · Repartición' : ''}
            </Text>
            <Text style={styles.savingMeta}>
              {formatDateShort(item.date)} · {TYPE_LABELS[item.type]}
              {item.note ? ` · ${item.note}` : ''}
            </Text>
          </View>
          <View style={styles.rightSide}>
            <Text style={styles.savingAmount}>+{formatAmount(item.amount, item.currency)}</Text>
            <Text style={styles.savingCurrency}>{item.currency}</Text>
          </View>
          <Pressable onPress={() => handleDelete(item)} hitSlop={8} style={styles.deleteBtn}>
            <Ionicons name="trash-outline" size={16} color={Colors.textLight} />
          </Pressable>
        </View>
      </Card>
    </Pressable>
  );

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={[Colors.primaryDeep, Colors.primaryDark]} style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Historial</Text>
            <Text style={styles.headerSub}>{savings.length} movimientos</Text>
          </View>
          <Pressable style={styles.filterBtn} onPress={() => setShowFilters(!showFilters)}>
            <Ionicons name="filter-outline" size={20} color={Colors.white} />
          </Pressable>
        </View>
      </LinearGradient>

      {/* Filtros */}
      {showFilters && (
        <View style={styles.filtersBar}>
          <ScrollableCurrencyFilter active={filters.currency} onSelect={(c) => applyFilter('currency', c)} />
          <ScrollableTypeFilter active={filters.type} onSelect={(t) => applyFilter('type', t)} />
          {(filters.currency || filters.type) && (
            <Pressable onPress={() => { clearFilters(); fetchSavings(); }}>
              <Text style={styles.clearFilters}>Limpiar filtros</Text>
            </Pressable>
          )}
        </View>
      )}

      <FlatList
        data={savings}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={() => fetchSavings()} tintColor={Colors.primary} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        ListFooterComponent={isLoadingMore ? <ActivityIndicator color={Colors.primary} style={{ padding: 16 }} /> : null}
        ListEmptyComponent={
          !isLoading ? (
            <EmptyState icon="time-outline" title="Sin movimientos" subtitle="Registra tu primer ahorro para verlo aquí." actionLabel="Agregar ahorro" onAction={onAddSaving} />
          ) : null
        }
      />
    </View>
  );
};

const ScrollableCurrencyFilter: React.FC<{ active?: string; onSelect: (v: string | undefined) => void }> = ({ active, onSelect }) => (
  <View style={fStyles.row}>
    {['DOP', 'USD', 'EUR'].map((c) => (
      <Pressable key={c} style={[fStyles.chip, active === c && fStyles.chipActive]} onPress={() => onSelect(active === c ? undefined : c)}>
        <Text style={[fStyles.chipText, active === c && fStyles.chipTextActive]}>{c}</Text>
      </Pressable>
    ))}
  </View>
);

const ScrollableTypeFilter: React.FC<{ active?: string; onSelect: (v: any) => void }> = ({ active, onSelect }) => (
  <View style={fStyles.row}>
    {[{ v: 'free', l: 'Libre' }, { v: 'goal', l: 'Meta' }, { v: 'split', l: 'Repartición' }].map(({ v, l }) => (
      <Pressable key={v} style={[fStyles.chip, active === v && fStyles.chipActive]} onPress={() => onSelect(active === v ? undefined : v)}>
        <Text style={[fStyles.chipText, active === v && fStyles.chipTextActive]}>{l}</Text>
      </Pressable>
    ))}
  </View>
);

const fStyles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  chip: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: BorderRadius.full, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.white },
  chipActive: { borderColor: Colors.primary, backgroundColor: Colors.primary },
  chipText: { fontFamily: FontFamily.dmSansMedium, fontSize: FontSize.xs, color: Colors.textMedium },
  chipTextActive: { color: Colors.white },
});

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.backgroundMain },
  header: { paddingTop: 60, paddingBottom: 20, paddingHorizontal: Spacing.screenHorizontal },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  headerTitle: { fontFamily: FontFamily.soraBold, fontSize: FontSize['2xl'], color: Colors.white },
  headerSub: { fontFamily: FontFamily.dmSansRegular, fontSize: FontSize.sm, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  filterBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' },
  filtersBar: { padding: Spacing[4], backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.divider, gap: Spacing[3] },
  clearFilters: { fontFamily: FontFamily.dmSansMedium, fontSize: FontSize.sm, color: Colors.danger },
  list: { padding: Spacing.screenHorizontal, paddingBottom: 100 },
  savingCard: { marginBottom: Spacing[2] },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing[3] },
  iconBg: { width: 38, height: 38, borderRadius: BorderRadius.sm, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  savingInfo: { flex: 1 },
  savingType: { fontFamily: FontFamily.dmSansMedium, fontSize: FontSize.sm, color: Colors.textDark },
  savingMeta: { fontFamily: FontFamily.dmSansRegular, fontSize: FontSize.xs, color: Colors.textLight, marginTop: 2, lineHeight: FontSize.xs * 1.4 },
  rightSide: { alignItems: 'flex-end' },
  savingAmount: { fontFamily: FontFamily.soraSemiBold, fontSize: FontSize.base, color: Colors.primary },
  savingCurrency: { fontFamily: FontFamily.dmSansRegular, fontSize: FontSize.xs, color: Colors.textLight },
  deleteBtn: { padding: 4 },
});
