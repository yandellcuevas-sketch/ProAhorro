import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Pressable,
  TextInput, Alert, StatusBar, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius, Shadows } from '../../theme';
import { splitService } from '../../services/splitService';
import { useGoalsStore } from '../../store/goalsStore';
import { formatAmount, todayISO } from '../../utils/format';
import { SAVING_METHODS } from '../../constants';
import type { Goal, SavingMethod } from '../../types';

interface SplitItem {
  goal: Goal;
  amount: string;
}

interface SplitSavingScreenProps {
  onBack: () => void;
  onSuccess: () => void;
}

export const SplitSavingScreen: React.FC<SplitSavingScreenProps> = ({ onBack, onSuccess }) => {
  const { goals, fetchGoals } = useGoalsStore();
  const [totalStr, setTotalStr] = useState('');
  const [currency, setCurrency] = useState('DOP');
  const [method, setMethod] = useState<SavingMethod>('transfer');
  const [note, setNote] = useState('');
  const [splits, setSplits] = useState<SplitItem[]>([]);
  const [leftoverAsFree, setLeftoverAsFree] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchGoals('active'); }, []);

  const total = parseFloat(totalStr) || 0;
  const distributed = splits.reduce((s, item) => s + (parseFloat(item.amount) || 0), 0);
  const leftover = Math.max(0, total - distributed);
  const progress = total > 0 ? Math.min(100, (distributed / total) * 100) : 0;
  const isOver = distributed > total;

  const activeGoals = goals.filter(
    (g) => g.status === 'active' && !splits.find((s) => s.goal.id === g.id)
  );

  const addGoal = (goal: Goal) => {
    setSplits((prev) => [...prev, { goal, amount: '' }]);
  };

  const removeGoal = (goalId: string) => {
    setSplits((prev) => prev.filter((s) => s.goal.id !== goalId));
  };

  const updateAmount = (goalId: string, value: string) => {
    setSplits((prev) =>
      prev.map((s) => (s.goal.id === goalId ? { ...s, amount: value } : s))
    );
  };

  const handleSubmit = async () => {
    if (total <= 0) {
      Alert.alert('Monto inválido', 'Ingresa un monto total mayor a 0.');
      return;
    }
    if (splits.length === 0) {
      Alert.alert('Sin metas', 'Agrega al menos una meta a repartir.');
      return;
    }
    if (isOver) {
      Alert.alert(
        'Total excedido',
        `El total repartido (${formatAmount(distributed, currency)}) supera el monto disponible (${formatAmount(total, currency)}). Ajusta la distribución.`
      );
      return;
    }

    setSubmitting(true);
    try {
      await splitService.createSplitSaving({
        total_amount: total,
        currency,
        date: todayISO(),
        method,
        note: note || undefined,
        splits: splits.map((s) => ({
          goal_id: s.goal.id,
          goal_name: s.goal.name,
          goal_icon: s.goal.icon,
          goal_color: s.goal.color,
          amount: parseFloat(s.amount) || 0,
        })).filter((s) => s.amount > 0),
        leftover_as_free: leftoverAsFree && leftover > 0,
        leftover_amount: leftover,
      });
      onSuccess();
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={[Colors.primaryDeep, Colors.primaryDark]} style={styles.header}>
        <Pressable style={styles.backBtn} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </Pressable>
        <Text style={styles.headerTitle}>Repartir ahorro</Text>
        <Text style={styles.headerSub}>Divide un monto entre varias metas</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

        {/* Monto total */}
        <Input
          label="Monto total a repartir"
          placeholder="0.00"
          keyboardType="decimal-pad"
          leftIcon="cash-outline"
          value={totalStr}
          onChangeText={setTotalStr}
        />

        {/* Moneda */}
        <Text style={styles.label}>Moneda</Text>
        <View style={styles.chips}>
          {['DOP', 'USD', 'EUR'].map((c) => (
            <Pressable key={c} style={[styles.chip, currency === c && styles.chipSel]} onPress={() => setCurrency(c)}>
              <Text style={[styles.chipTxt, currency === c && styles.chipTxtSel]}>{c}</Text>
            </Pressable>
          ))}
        </View>

        {/* Método */}
        <Text style={styles.label}>Método</Text>
        <View style={styles.chips}>
          {SAVING_METHODS.map((m) => (
            <Pressable key={m.value} style={[styles.chip, method === m.value && styles.chipSel]} onPress={() => setMethod(m.value as SavingMethod)}>
              <Ionicons name={m.icon as any} size={13} color={method === m.value ? Colors.white : Colors.textMedium} />
              <Text style={[styles.chipTxt, method === m.value && styles.chipTxtSel]}>{m.label}</Text>
            </Pressable>
          ))}
        </View>

        {/* Barra de progreso de distribución */}
        {total > 0 && (
          <Card style={styles.progressCard}>
            <View style={styles.progressRow}>
              <Text style={styles.progressLabel}>Repartido</Text>
              <Text style={[styles.progressValue, isOver && { color: Colors.danger }]}>
                {formatAmount(distributed, currency)} / {formatAmount(total, currency)}
              </Text>
            </View>
            <ProgressBar progress={progress} color={isOver ? Colors.danger : Colors.primary} showPercentage={false} height={10} />
            <View style={styles.progressRow}>
              <Text style={styles.leftoverLabel}>Pendiente</Text>
              <Text style={[styles.leftoverValue, isOver && { color: Colors.danger }]}>
                {isOver ? `Excedido ${formatAmount(distributed - total, currency)}` : formatAmount(leftover, currency)}
              </Text>
            </View>
          </Card>
        )}

        {/* Metas seleccionadas */}
        {splits.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Distribución</Text>
            {splits.map((item) => (
              <Card key={item.goal.id} style={styles.splitCard}>
                <View style={styles.splitHeader}>
                  <View style={[styles.splitIcon, { backgroundColor: (item.goal.color ?? Colors.primary) + '20' }]}>
                    <Ionicons name={item.goal.icon as any ?? 'wallet'} size={18} color={item.goal.color ?? Colors.primary} />
                  </View>
                  <Text style={styles.splitGoalName} numberOfLines={1}>{item.goal.name}</Text>
                  <Pressable onPress={() => removeGoal(item.goal.id)} hitSlop={8}>
                    <Ionicons name="close-circle" size={22} color={Colors.textLight} />
                  </Pressable>
                </View>
                <TextInput
                  style={styles.splitAmountInput}
                  placeholder="0.00"
                  placeholderTextColor={Colors.textLight}
                  keyboardType="decimal-pad"
                  value={item.amount}
                  onChangeText={(v) => updateAmount(item.goal.id, v)}
                />
              </Card>
            ))}
          </View>
        )}

        {/* Agregar metas */}
        {activeGoals.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Agregar metas</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.goalsScroll}>
              {activeGoals.map((g) => (
                <Pressable key={g.id} style={styles.goalChip} onPress={() => addGoal(g)}>
                  <Ionicons name={g.icon as any ?? 'wallet'} size={16} color={g.color ?? Colors.primary} />
                  <Text style={styles.goalChipText} numberOfLines={1}>{g.name}</Text>
                  <Ionicons name="add-circle" size={18} color={Colors.primary} />
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Sobrante como libre */}
        {leftover > 0 && !isOver && (
          <Pressable style={styles.leftoverToggle} onPress={() => setLeftoverAsFree(!leftoverAsFree)}>
            <View style={[styles.checkbox, leftoverAsFree && styles.checkboxActive]}>
              {leftoverAsFree && <Ionicons name="checkmark" size={14} color={Colors.white} />}
            </View>
            <Text style={styles.leftoverToggleText}>
              Guardar sobrante ({formatAmount(leftover, currency)}) como ahorro libre
            </Text>
          </Pressable>
        )}

        {/* Nota */}
        <Input label="Nota (opcional)" placeholder="¿De dónde viene este ahorro?" value={note} onChangeText={setNote} multiline />

        <Button label="Repartir ahorro" variant="primary" loading={submitting} onPress={handleSubmit}
          disabled={isOver || splits.length === 0 || total <= 0} style={styles.submitBtn} />

        {isOver && (
          <Text style={styles.errorMsg}>
            El total repartido supera el monto disponible. Ajusta la distribución.
          </Text>
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.backgroundMain },
  header: { paddingTop: 60, paddingBottom: 28, paddingHorizontal: Spacing.screenHorizontal, gap: 4 },
  backBtn: { marginBottom: Spacing[3] },
  headerTitle: { fontFamily: FontFamily.soraBold, fontSize: FontSize.xl, color: Colors.white },
  headerSub: { fontFamily: FontFamily.dmSansRegular, fontSize: FontSize.sm, color: 'rgba(255,255,255,0.7)' },
  content: { padding: Spacing.screenHorizontal, paddingTop: Spacing[4] },
  label: { fontFamily: FontFamily.dmSansMedium, fontSize: FontSize.sm, color: Colors.textDark, marginBottom: Spacing[2] },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: Spacing[4] },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 14, paddingVertical: 7, borderRadius: BorderRadius.full, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.white },
  chipSel: { borderColor: Colors.primary, backgroundColor: Colors.primary },
  chipTxt: { fontFamily: FontFamily.dmSansMedium, fontSize: FontSize.sm, color: Colors.textMedium },
  chipTxtSel: { color: Colors.white },
  progressCard: { marginBottom: Spacing[4], gap: Spacing[2] },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  progressLabel: { fontFamily: FontFamily.dmSansRegular, fontSize: FontSize.sm, color: Colors.textMedium },
  progressValue: { fontFamily: FontFamily.soraSemiBold, fontSize: FontSize.base, color: Colors.textDark },
  leftoverLabel: { fontFamily: FontFamily.dmSansRegular, fontSize: FontSize.sm, color: Colors.textLight },
  leftoverValue: { fontFamily: FontFamily.dmSansMedium, fontSize: FontSize.sm, color: Colors.primary },
  section: { marginBottom: Spacing[4] },
  sectionTitle: { fontFamily: FontFamily.dmSansSemiBold, fontSize: FontSize.base, color: Colors.textDark, marginBottom: Spacing[3] },
  splitCard: { marginBottom: Spacing[2], gap: Spacing[3] },
  splitHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing[2] },
  splitIcon: { width: 36, height: 36, borderRadius: BorderRadius.sm, alignItems: 'center', justifyContent: 'center' },
  splitGoalName: { flex: 1, fontFamily: FontFamily.dmSansMedium, fontSize: FontSize.base, color: Colors.textDark },
  splitAmountInput: { height: 44, borderWidth: 1.5, borderColor: Colors.border, borderRadius: BorderRadius.input, paddingHorizontal: 16, fontFamily: FontFamily.soraSemiBold, fontSize: FontSize.lg, color: Colors.textDark, backgroundColor: Colors.backgroundInput },
  goalsScroll: { marginBottom: Spacing[2] },
  goalChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 10, borderRadius: BorderRadius.lg, borderWidth: 1.5, borderColor: Colors.primaryLight, backgroundColor: Colors.white, marginRight: 10, maxWidth: 160, ...Shadows.xs },
  goalChipText: { fontFamily: FontFamily.dmSansMedium, fontSize: FontSize.sm, color: Colors.textDark, flex: 1 },
  leftoverToggle: { flexDirection: 'row', alignItems: 'center', gap: Spacing[3], backgroundColor: Colors.primarySoft, borderRadius: BorderRadius.md, padding: Spacing[4], marginBottom: Spacing[4], borderWidth: 1, borderColor: Colors.primaryLight },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: Colors.border, backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center' },
  checkboxActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  leftoverToggleText: { flex: 1, fontFamily: FontFamily.dmSansRegular, fontSize: FontSize.sm, color: Colors.textDark, lineHeight: FontSize.sm * 1.5 },
  submitBtn: { marginBottom: Spacing[3] },
  errorMsg: { fontFamily: FontFamily.dmSansRegular, fontSize: FontSize.sm, color: Colors.danger, textAlign: 'center', marginBottom: Spacing[3] },
});
