import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Animated,
  FlatList,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { S, Theme } from '../../theme/style';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { EmptyState } from '../../components/ui/EmptyState';

type GoalStatus = 'active' | 'paused' | 'completed';

interface Goal {
  id: string;
  name: string;
  icon: string;
  current: number;
  target: number;
  currency: string;
  deadline?: string;
  status: GoalStatus;
  color: string;
  prediction?: string;
}

const GOALS: Goal[] = [
  { id: '1', name: 'Viaje a Europa',   icon: 'airplane',             current: 42000, target: 80000, currency: 'RD$', deadline: 'Dic 2025', status: 'active',    color: '#1976D2', prediction: 'Oct 2025' },
  { id: '2', name: 'Carro nuevo',      icon: 'car-outline',          current: 18500, target: 50000, currency: 'RD$', deadline: 'Mar 2026', status: 'active',    color: '#7B1FA2', prediction: 'Feb 2026' },
  { id: '3', name: 'Fondo emergencia', icon: 'shield-check-outline', current: 22000, target: 30000, currency: 'RD$', status: 'active',    color: '#00796B', prediction: 'Jul 2025' },
  { id: '4', name: 'Laptop nueva',     icon: 'laptop',               current: 4000,  target: 12000, currency: 'RD$', status: 'paused',    color: '#E65100' },
  { id: '5', name: 'Vacaciones RD',    icon: 'beach',                current: 8000,  target: 8000,  currency: 'RD$', status: 'completed', color: '#2E7D32' },
];

const STATUS_CONFIG: Record<GoalStatus, { label: string; chipStyle: object; textStyle: object }> = {
  active:    { label: 'Activa',     chipStyle: S.Chips.badgeGreen,   textStyle: S.Chips.badgeTextGreen   },
  paused:    { label: 'Pausada',    chipStyle: S.Chips.badgeWarning, textStyle: S.Chips.badgeTextWarning },
  completed: { label: 'Completada', chipStyle: S.Chips.badgeInfo,    textStyle: S.Chips.badgeTextInfo    },
};

// ─── Tarjeta de meta animada ──────────────────────────────────
const AnimatedGoalCard: React.FC<{ goal: Goal; index: number; onPress: () => void }> = ({
  goal,
  index,
  onPress,
}) => {
  const fade  = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade,  { toValue: 1, duration: 380, delay: index * 70, useNativeDriver: true }),
      Animated.spring(slide, { toValue: 0, delay: index * 70, friction: 9, tension: 55, useNativeDriver: true }),
    ]).start();
  }, []);

  const progress = Math.min(goal.current / goal.target, 1);
  const pct      = Math.round(progress * 100);
  const cfg      = STATUS_CONFIG[goal.status];

  return (
    <Animated.View style={{ opacity: fade, transform: [{ translateY: slide }] }}>
      <TouchableOpacity style={S.Cards.goal} activeOpacity={0.75} onPress={onPress}>

        {/* Top row */}
        <View style={[S.Layout.row, { gap: 10, marginBottom: Theme.space.md }]}>
          <View style={[S.IconWrap.lg, { backgroundColor: goal.color + '18', borderRadius: 12 }]}>
            <MaterialCommunityIcons name={goal.icon as any} size={22} color={goal.color} />
          </View>
          <View style={S.Layout.flex1}>
            <Text style={S.Typography.headingSm}>{goal.name}</Text>
            {goal.deadline && (
              <View style={[S.Layout.row, { gap: 3, marginTop: 2 }]}>
                <MaterialCommunityIcons name="calendar-outline" size={12} color={Theme.color.textMuted} />
                <Text style={S.Typography.bodySm}>Límite: {goal.deadline}</Text>
              </View>
            )}
          </View>
          <View style={cfg.chipStyle as any}>
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: goal.color }} />
            <Text style={cfg.textStyle as any}>{cfg.label}</Text>
          </View>
        </View>

        {/* Amounts */}
        <View style={[S.Layout.rowBetween, { marginBottom: 10 }]}>
          <View>
            <Text style={S.Typography.caption}>Ahorrado</Text>
            <Text style={[S.Typography.amountMd, { color: goal.color }]}>
              {goal.currency}{goal.current.toLocaleString()}
            </Text>
          </View>
          <View style={{
            width: 46, height: 46, borderRadius: 23,
            backgroundColor: Theme.color.bgMain,
            alignItems: 'center', justifyContent: 'center',
            borderWidth: 1, borderColor: Theme.color.borderLight,
          }}>
            <Text style={[S.Typography.amountXs, { color: goal.color, letterSpacing: -0.3 }]}>{pct}%</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={S.Typography.caption}>Objetivo</Text>
            <Text style={[S.Typography.amountMd, { color: Theme.color.textDark }]}>
              {goal.currency}{goal.target.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Progress bar */}
        <ProgressBar progress={pct} color={goal.color} size="sm" />

        {/* Predicción */}
        {goal.prediction && goal.status === 'active' && (
          <View style={[S.Layout.row, { gap: 4, marginTop: 8 }]}>
            <MaterialCommunityIcons name="lightning-bolt" size={13} color={goal.color} />
            <Text style={[S.Typography.caption, { color: Theme.color.textMedium }]}>
              Estimado: {goal.prediction}
            </Text>
          </View>
        )}

        {/* Actions */}
        <View style={[S.Layout.row, {
          gap: 8, paddingTop: 10,
          borderTopWidth: 1, borderTopColor: Theme.color.borderLight,
          marginTop: 10,
        }]}>
          <TouchableOpacity style={S.Buttons.actionText} activeOpacity={0.7}>
            <MaterialCommunityIcons name="plus-circle-outline" size={15} color={Theme.color.primary} />
            <Text style={S.Buttons.actionTextLabel}>Agregar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={S.Buttons.actionText} activeOpacity={0.7}>
            <MaterialCommunityIcons name="pencil-outline" size={15} color={Theme.color.textMedium} />
            <Text style={[S.Buttons.actionTextLabel, { color: Theme.color.textMedium }]}>Editar</Text>
          </TouchableOpacity>
          {goal.status === 'active' && (
            <TouchableOpacity style={S.Buttons.actionText} activeOpacity={0.7}>
              <MaterialCommunityIcons name="pause-circle-outline" size={15} color={Theme.color.warning} />
              <Text style={[S.Buttons.actionTextLabel, { color: Theme.color.warning }]}>Pausar</Text>
            </TouchableOpacity>
          )}
          {goal.status === 'paused' && (
            <TouchableOpacity style={S.Buttons.actionText} activeOpacity={0.7}>
              <MaterialCommunityIcons name="play-circle-outline" size={15} color={Theme.color.primary} />
              <Text style={S.Buttons.actionTextLabel}>Reanudar</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ─── Pantalla principal ───────────────────────────────────────
const GoalsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <View style={S.Layout.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={Theme.color.bgMain} />

      {/* Header */}
      <View style={S.Layout.header}>
        <TouchableOpacity style={S.Layout.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <MaterialCommunityIcons name="chevron-left" size={24} color={Theme.color.textDark} />
        </TouchableOpacity>
        <Text style={S.Layout.headerTitle}>Mis metas</Text>
        <TouchableOpacity style={S.Buttons.iconCircleGreen} activeOpacity={0.8}>
          <MaterialCommunityIcons name="plus" size={20} color={Theme.color.white} />
        </TouchableOpacity>
      </View>

      {/* Summary chips */}
      <View style={[S.Layout.row, { gap: 8, paddingHorizontal: Theme.space.md, marginBottom: Theme.space.md }]}>
        {[
          { icon: 'check-circle-outline', label: `${GOALS.filter(g => g.status === 'active').length} activas`,    chip: S.Chips.badgeGreen,   text: S.Chips.badgeTextGreen   },
          { icon: 'pause-circle-outline', label: `${GOALS.filter(g => g.status === 'paused').length} pausadas`,   chip: S.Chips.badgeWarning, text: S.Chips.badgeTextWarning },
          { icon: 'trophy-outline',       label: `${GOALS.filter(g => g.status === 'completed').length} completadas`, chip: S.Chips.badgeInfo, text: S.Chips.badgeTextInfo },
        ].map(chip => (
          <View key={chip.label} style={[S.Chips.filter, { borderRadius: Theme.radius.full }]}>
            <Text style={S.Chips.filterText}>{chip.label}</Text>
          </View>
        ))}
      </View>

      <FlatList
        data={GOALS}
        keyExtractor={item => item.id}
        contentContainerStyle={[S.Layout.scrollPad, { paddingTop: 4 }]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <AnimatedGoalCard
            goal={item}
            index={index}
            onPress={() => navigation.navigate('GoalDetail', { goalId: item.id })}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="flag-outline"
            title="No tienes metas aún"
            subtitle="Crea tu primera meta de ahorro"
            actionLabel="Crear meta"
            onAction={() => navigation.navigate('CreateGoal')}
          />
        }
        ListFooterComponent={<View style={{ height: 80 }} />}
      />
    </View>
  );
};

export default GoalsScreen;
