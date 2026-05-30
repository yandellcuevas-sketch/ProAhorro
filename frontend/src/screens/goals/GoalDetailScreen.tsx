import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
  StatusBar,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { S, Theme } from '../../theme/style';
import { useGoalsStore } from '../../store/goalsStore';
import { goalsService } from '../../services/goalsService';
import type { Goal } from '../../types';

// Helper local para formateo
const formatAmount = (amount: number, currency: string) => {
  const symbols: Record<string, string> = { DOP: 'RD$', USD: '$', EUR: '€' };
  const symbol = symbols[currency] ?? currency;
  return `${symbol}${amount.toLocaleString('es-DO', { minimumFractionDigits: 0 })}`;
};

const formatDate = (dateString?: string) => {
  if (!dateString) return '';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('es-DO', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return dateString;
  }
};

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
  const { setGoalStatus, deleteGoal } = useGoalsStore();
  const [goal, setGoal] = useState(initialGoal);
  const [prediction, setPrediction] = useState<{
    can_predict: boolean;
    months_remaining?: number;
    predicted_date?: string;
    weekly_avg?: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  // Animaciones de entrada
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 9, tension: 55, useNativeDriver: true }),
    ]).start();
  }, []);

  useEffect(() => {
    goalsService.getGoalPrediction(goal.id).then(setPrediction);
  }, [goal.id]);

  const remaining = Math.max(0, goal.target_amount - goal.current_amount);

  const handleStatusChange = (status: Goal['status'], label: string) => {
    Alert.alert(`${label}`, `¿Quieres ${label.toLowerCase()} esta meta?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: label,
        onPress: async () => {
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
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          await deleteGoal(goal.id);
          onBack();
        },
      },
    ]);
  };

  const iconColor = goal.color ?? Theme.color.primary;

  return (
    <View style={S.Layout.screen}>
      <StatusBar barStyle="light-content" backgroundColor={Theme.color.primaryDarker} />
      
      {/* Cabecera con Gradiente */}
      <LinearGradient
        colors={[Theme.color.primaryDarker, Theme.color.primaryDark, iconColor + 'A0']}
        style={{
          paddingTop: 56,
          paddingBottom: 28,
          paddingHorizontal: Theme.space.md,
          alignItems: 'center',
          gap: 12,
        }}
      >
        <Pressable
          style={[S.Layout.backBtn, { position: 'absolute', top: 52, left: Theme.space.md, backgroundColor: 'rgba(255,255,255,0.15)', borderColor: 'rgba(255,255,255,0.2)' }]}
          onPress={onBack}
        >
          <MaterialCommunityIcons name="arrow-left" size={22} color={Theme.color.white} />
        </Pressable>
        <Pressable
          style={[S.Layout.backBtn, { position: 'absolute', top: 52, right: Theme.space.md, backgroundColor: 'rgba(255,255,255,0.15)', borderColor: 'rgba(255,255,255,0.2)' }]}
          onPress={() => onEdit(goal)}
        >
          <MaterialCommunityIcons name="pencil-outline" size={20} color={Theme.color.white} />
        </Pressable>

        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: 'rgba(255,255,255,0.2)',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 24,
            marginBottom: Theme.space.xs,
          }}
        >
          <MaterialCommunityIcons name={(goal.icon as any) ?? 'wallet-outline'} size={36} color={Theme.color.white} />
        </View>

        <Text style={[S.Typography.headingLg, { color: Theme.color.white, textAlign: 'center' }]}>
          {goal.name}
        </Text>
        {goal.description ? (
          <Text style={[S.Typography.bodyMd, { color: 'rgba(255,255,255,0.8)', textAlign: 'center', paddingHorizontal: Theme.space.md }]}>
            {goal.description}
          </Text>
        ) : null}
      </LinearGradient>

      <ScrollView contentContainerStyle={S.Layout.scrollPad} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }], gap: Theme.space.md }}>
          
          {/* Progreso principal */}
          <Card style={S.Cards.basePad}>
            <Text style={[S.Typography.label, { color: Theme.color.textMuted, marginBottom: Theme.space.sm }]}>
              Progreso total
            </Text>
            
            <View style={[S.Layout.rowBetween, { alignItems: 'baseline', marginBottom: Theme.space.sm }]}>
              <View style={[S.Layout.row, { alignItems: 'baseline' }]}>
                <Text style={S.Typography.amountLg}>{formatAmount(goal.current_amount, goal.currency)}</Text>
                <Text style={[S.Typography.bodyMd, { color: Theme.color.textMuted }]}> de </Text>
                <Text style={[S.Typography.headingSm, { color: Theme.color.textMedium }]}>
                  {formatAmount(goal.target_amount, goal.currency)}
                </Text>
              </View>
              <Text style={[S.Typography.amountSm, { color: iconColor }]}>
                {Math.round(goal.progress_pct)}%
              </Text>
            </View>

            <ProgressBar progress={goal.progress_pct} color={iconColor} />

            <View style={[S.Layout.row, { gap: 6, marginTop: Theme.space.md }]}>
              <MaterialCommunityIcons name="trending-up" size={16} color={Theme.color.textMuted} />
              <Text style={S.Typography.bodySm}>
                Faltan {formatAmount(remaining, goal.currency)}
              </Text>
            </View>
          </Card>

          {/* Predicción */}
          <Card style={S.Cards.basePad}>
            <View style={[S.Layout.row, { gap: 8, marginBottom: Theme.space.sm }]}>
              <MaterialCommunityIcons name="clock-outline" size={20} color={Theme.color.primary} />
              <Text style={S.Typography.headingSm}>Predicción</Text>
            </View>

            {prediction === null ? (
              <ActivityIndicator color={Theme.color.primary} style={{ marginVertical: Theme.space.sm }} />
            ) : prediction.can_predict ? (
              <View style={{ gap: Theme.space.xs }}>
                <Text style={S.Typography.bodyMd}>
                  Al ritmo actual llegarás en{' '}
                  <Text style={[S.Typography.link, { color: Theme.color.primary }]}>{prediction.months_remaining} meses</Text>
                </Text>
                {prediction.predicted_date && (
                  <Text style={S.Typography.bodySm}>
                    Fecha estimada: {formatDate(prediction.predicted_date)}
                  </Text>
                )}
                {prediction.weekly_avg && (
                  <Text style={S.Typography.bodySm}>
                    Promedio semanal: {formatAmount(prediction.weekly_avg, goal.currency)}
                  </Text>
                )}
              </View>
            ) : (
              <Text style={[S.Typography.bodySm, { fontStyle: 'italic' }]}>
                Necesitamos más historial de ahorros para calcular una predicción.
              </Text>
            )}
          </Card>

          {/* Info de la meta */}
          <Card style={S.Cards.listSection}>
            <View style={[S.ListItems.row, S.ListItems.rowBorder]}>
              <Text style={S.ListItems.rowLabel}>Moneda</Text>
              <Text style={[S.Typography.bodyMd, { color: Theme.color.textDark }]}>{goal.currency}</Text>
            </View>
            
            {goal.deadline && (
              <View style={[S.ListItems.row, S.ListItems.rowBorder]}>
                <Text style={S.ListItems.rowLabel}>Fecha límite</Text>
                <Text style={[S.Typography.bodyMd, { color: Theme.color.textDark }]}>{formatDate(goal.deadline)}</Text>
              </View>
            )}

            <View style={S.ListItems.row}>
              <Text style={S.ListItems.rowLabel}>Estado</Text>
              <Text style={[S.Typography.bodyMd, { color: Theme.color.primary, fontWeight: '600' }]}>
                {goal.status === 'active' ? 'Activa' : goal.status === 'paused' ? 'Pausada' : 'Completada'}
              </Text>
            </View>
          </Card>

          {/* Acciones */}
          <View style={{ gap: Theme.space.sm, marginTop: Theme.space.sm }}>
            {goal.status !== 'completed' && goal.status !== 'deleted' && (
              <Button
                label="Agregar ahorro a esta meta"
                variant="primary"
                onPress={() => onAddSaving(goal.id)}
              />
            )}

            {goal.status === 'active' && (
              <Button
                label="Pausar meta"
                variant="outline"
                onPress={() => handleStatusChange('paused', 'Pausar')}
              />
            )}
            {goal.status === 'paused' && (
              <Button
                label="Reactivar meta"
                variant="outline"
                onPress={() => handleStatusChange('active', 'Reactivar')}
              />
            )}

            <Button
              label="Eliminar meta"
              variant="danger"
              onPress={handleDelete}
            />
          </View>
          
        </Animated.View>
      </ScrollView>
    </View>
  );
};
