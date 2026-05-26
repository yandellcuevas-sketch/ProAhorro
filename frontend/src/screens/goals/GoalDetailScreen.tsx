import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Pressable,
  Alert, StatusBar, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius, Shadows } from '../../theme';
import { useGoalsStore } from '../../store/goalsStore';
import { goalsService } from '../../services/goalsService';
import { formatAmount, formatDate } from '../../utils/format';
import type { Goal } from '../../types';

interface GoalDetailScreenProps {
  goal: Goal;
  onBack: () => void;
  onEdit: (goal: Goal) => void;
  onAddSaving: (goalId: string) => void;
}

export const GoalDetailScreen: React.FC<GoalDetailScreenProps> = ({
  goal: initialGoal,
  onBack,
  onEdit,
  onAddSaving,
}) => {
  const { setGoalStatus, deleteGoal, refreshGoal } = useGoalsStore();
  const [goal, setGoal] = useState(initialGoal);
  const [prediction, setPrediction] = useState<{
    can_predict: boolean; months_remaining?: number; predicted_date?: string; weekly_avg?: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    goalsService.getGoalPrediction(goal.id).then(setPrediction);
  }, [goal.id]);

  const remaining = Math.max(0, goal.target_amount - goal.current_amount);

  const handleStatusChange = (status: Goal['status'], label: string) => {
    Alert.alert(`${label}`, `¿Quieres ${label.toLowerCase()} esta meta?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: label, onPress: async () => {
          setLoading(true);
          await setGoalStatus(goal.id, status);
          setGoal((g) => ({ ...g, status }));
          setLoading(false);
        },
      },
    ]);
  };

  const handleDelete = () => {
    Alert.alert('Eliminar meta', '¿Eliminar esta meta? Los ahorros asociados no se eliminarán.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar', style: 'destructive', onPress: async () => {
          await deleteGoal(goal.id);
          onBack();
        },
      },
    ]);
  };

  const iconColor = goal.color ?? Colors.primary;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={[Colors.primaryDeep, Colors.primaryDark, iconColor + 'CC']} style={styles.header}>
        <Pressable style={styles.backBtn} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </Pressable>
        <Pressable style={styles.editBtn} onPress={() => onEdit(goal)}>
          <Ionicons name="pencil-outline" size={22} color={Colors.white} />
        </Pressable>
        <View style={[styles.headerIcon, { backgroundColor: iconColor + '30' }]}>
          <Ionicons name={goal.icon as any ?? 'wallet'} size={40} color={Colors.white} />
        </View>
        <Text style={styles.headerTitle}>{goal.name}</Text>
        {goal.description ? <Text style={styles.headerDesc}>{goal.description}</Text> : null}
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Progreso principal */}
        <Card style={styles.progressCard}>
          <Text style={styles.progressLabel}>Progreso total</Text>
          <View style={styles.amountsRow}>
            <Text style={styles.currentAmt}>{formatAmount(goal.current_amount, goal.currency)}</Text>
            <Text style={styles.separator}> de </Text>
            <Text style={styles.targetAmt}>{formatAmount(goal.target_amount, goal.currency)}</Text>
          </View>
          <ProgressBar progress={goal.progress_pct} color={iconColor} height={12} showPercentage />
          <View style={styles.remainingRow}>
            <Ionicons name="trending-up" size={16} color={Colors.textLight} />
            <Text style={styles.remainingText}>
              Faltan {formatAmount(remaining, goal.currency)}
            </Text>
          </View>
        </Card>

        {/* Predicción */}
        <Card style={styles.predCard}>
          <View style={styles.predHeader}>
            <Ionicons name="time-outline" size={20} color={Colors.primary} />
            <Text style={styles.predTitle}>Predicción</Text>
          </View>
          {prediction === null ? (
            <ActivityIndicator color={Colors.primary} />
          ) : prediction.can_predict ? (
            <View style={styles.predBody}>
              <Text style={styles.predMain}>
                Al ritmo actual llegarás en{' '}
                <Text style={styles.predHighlight}>{prediction.months_remaining} meses</Text>
              </Text>
              {prediction.predicted_date && (
                <Text style={styles.predSub}>
                  Fecha estimada: {formatDate(prediction.predicted_date)}
                </Text>
              )}
              {prediction.weekly_avg && (
                <Text style={styles.predSub}>
                  Promedio semanal: {formatAmount(prediction.weekly_avg, goal.currency)}
                </Text>
              )}
            </View>
          ) : (
            <Text style={styles.predNone}>
              Necesitamos más historial de ahorros para calcular una predicción.
            </Text>
          )}
        </Card>

        {/* Info */}
        <Card style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Moneda</Text>
            <Text style={styles.infoValue}>{goal.currency}</Text>
          </View>
          {goal.deadline && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Fecha límite</Text>
              <Text style={styles.infoValue}>{formatDate(goal.deadline)}</Text>
            </View>
          )}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Estado</Text>
            <Text style={[styles.infoValue, { color: Colors.primary }]}>{goal.status === 'active' ? 'Activa' : goal.status === 'paused' ? 'Pausada' : 'Completada'}</Text>
          </View>
        </Card>

        {/* Acciones */}
        {goal.status !== 'completed' && goal.status !== 'deleted' && (
          <Button
            label="Agregar ahorro a esta meta"
            variant="primary"
            onPress={() => onAddSaving(goal.id)}
            style={styles.actionBtn}
          />
        )}

        {goal.status === 'active' && (
          <Button label="Pausar meta" variant="outline" onPress={() => handleStatusChange('paused', 'Pausar')} style={styles.actionBtn} />
        )}
        {goal.status === 'paused' && (
          <Button label="Reactivar meta" variant="outline" onPress={() => handleStatusChange('active', 'Reactivar')} style={styles.actionBtn} />
        )}

        <Button label="Eliminar meta" variant="danger" onPress={handleDelete} style={styles.actionBtn} />
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.backgroundMain },
  header: { paddingTop: 60, paddingBottom: 32, paddingHorizontal: Spacing.screenHorizontal, alignItems: 'center', gap: Spacing[2] },
  backBtn: { position: 'absolute', top: 60, left: Spacing.screenHorizontal },
  editBtn: { position: 'absolute', top: 60, right: Spacing.screenHorizontal },
  headerIcon: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginTop: 32, marginBottom: Spacing[2] },
  headerTitle: { fontFamily: FontFamily.soraBold, fontSize: FontSize.xl, color: Colors.white, textAlign: 'center' },
  headerDesc: { fontFamily: FontFamily.dmSansRegular, fontSize: FontSize.sm, color: 'rgba(255,255,255,0.75)', textAlign: 'center' },
  content: { padding: Spacing.screenHorizontal, paddingTop: Spacing[5] },
  progressCard: { gap: Spacing[3], marginBottom: Spacing[3] },
  progressLabel: { fontFamily: FontFamily.dmSansMedium, fontSize: FontSize.sm, color: Colors.textLight },
  amountsRow: { flexDirection: 'row', alignItems: 'baseline' },
  currentAmt: { fontFamily: FontFamily.soraBold, fontSize: FontSize['3xl'], color: Colors.textDark },
  separator: { fontFamily: FontFamily.dmSansRegular, fontSize: FontSize.base, color: Colors.textLight },
  targetAmt: { fontFamily: FontFamily.soraSemiBold, fontSize: FontSize.lg, color: Colors.textLight },
  remainingRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  remainingText: { fontFamily: FontFamily.dmSansRegular, fontSize: FontSize.sm, color: Colors.textLight },
  predCard: { gap: Spacing[3], marginBottom: Spacing[3] },
  predHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  predTitle: { fontFamily: FontFamily.dmSansSemiBold, fontSize: FontSize.base, color: Colors.textDark },
  predBody: { gap: 4 },
  predMain: { fontFamily: FontFamily.dmSansRegular, fontSize: FontSize.base, color: Colors.textDark, lineHeight: FontSize.base * 1.5 },
  predHighlight: { fontFamily: FontFamily.soraSemiBold, color: Colors.primary },
  predSub: { fontFamily: FontFamily.dmSansRegular, fontSize: FontSize.sm, color: Colors.textLight },
  predNone: { fontFamily: FontFamily.dmSansRegular, fontSize: FontSize.sm, color: Colors.textLight, fontStyle: 'italic' },
  infoCard: { marginBottom: Spacing[4] },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: Spacing[3], borderBottomWidth: 1, borderBottomColor: Colors.divider },
  infoLabel: { fontFamily: FontFamily.dmSansRegular, fontSize: FontSize.base, color: Colors.textMedium },
  infoValue: { fontFamily: FontFamily.dmSansMedium, fontSize: FontSize.base, color: Colors.textDark },
  actionBtn: { marginBottom: Spacing[3] },
});
