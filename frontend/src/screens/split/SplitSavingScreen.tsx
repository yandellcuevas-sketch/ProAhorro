import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { S, Theme } from '../../theme/style';
import { ProgressBar } from '../../components/ui/ProgressBar';

interface GoalSplit {
  id: string;
  name: string;
  icon: string;
  iconColor: string;
  currency: string;
  assigned: string;
}

const AVAILABLE_GOALS: GoalSplit[] = [
  { id: '1', name: 'Viaje a Europa',   icon: 'airplane',             iconColor: '#1976D2', currency: 'RD$', assigned: '' },
  { id: '2', name: 'Carro nuevo',      icon: 'car-outline',          iconColor: '#7B1FA2', currency: 'RD$', assigned: '' },
  { id: '3', name: 'Fondo emergencia', icon: 'shield-check-outline', iconColor: '#00796B', currency: 'RD$', assigned: '' },
  { id: '4', name: 'Laptop nueva',     icon: 'laptop',               iconColor: '#E65100', currency: 'RD$', assigned: '' },
];

const SplitSavingScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const totalAmount: number = route?.params?.totalAmount ?? 2000;
  const currency = route?.params?.currency ?? 'RD$';

  const [goals, setGoals]           = useState<GoalSplit[]>(AVAILABLE_GOALS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [freeAmount, setFreeAmount]   = useState('');

  const toggleGoal = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id],
    );
  };

  const updateAssigned = useCallback((id: string, value: string) => {
    setGoals(prev => prev.map(g => (g.id === id ? { ...g, assigned: value } : g)));
  }, []);

  const assignedTotal    = goals.filter(g => selectedIds.includes(g.id)).reduce((acc, g) => acc + (parseFloat(g.assigned) || 0), 0);
  const freeVal          = parseFloat(freeAmount) || 0;
  const totalDistributed = assignedTotal + freeVal;
  const remaining        = totalAmount - totalDistributed;
  const progressRatio    = Math.min(totalDistributed / totalAmount, 1);
  const isOver           = totalDistributed > totalAmount;
  const isComplete       = Math.abs(remaining) < 0.01;

  return (
    <KeyboardAvoidingView
      style={S.Layout.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="dark-content" backgroundColor={Theme.color.bgMain} />

      {/* Header */}
      <View style={S.Layout.header}>
        <TouchableOpacity style={S.Layout.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <MaterialCommunityIcons name="chevron-left" size={24} color={Theme.color.textDark} />
        </TouchableOpacity>
        <Text style={S.Layout.headerTitle}>Repartir ahorro</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={S.Layout.scrollPad}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

        {/* ─── SUMMARY CARD ─── */}
        <View style={[S.SplitPanel.summaryCard, { marginBottom: Theme.space.lg }]}>
          <View style={S.SplitPanel.summaryRow}>
            <Text style={S.Typography.bodyMd}>Total ingresado</Text>
            <Text style={S.Typography.amountMd}>{currency}{totalAmount.toLocaleString()}</Text>
          </View>
          <View style={S.SplitPanel.summaryRow}>
            <Text style={S.Typography.bodyMd}>Total repartido</Text>
            <Text style={[S.Typography.amountSm, isOver && { color: Theme.color.danger }]}>
              {currency}{totalDistributed.toLocaleString()}
            </Text>
          </View>
          <View style={S.SplitPanel.summaryRow}>
            <Text style={S.Typography.bodyMd}>Pendiente</Text>
            <Text style={[
              S.Typography.amountSm,
              isComplete ? { color: Theme.color.primary } :
              isOver     ? { color: Theme.color.danger  } :
                           { color: Theme.color.warning  },
            ]}>
              {isOver ? '−' : ''}{currency}{Math.abs(remaining).toLocaleString()}
            </Text>
          </View>

          {/* Progress bar */}
          <View style={{ marginTop: Theme.space.sm }}>
            <ProgressBar
              progress={progressRatio * 100}
              color={isOver ? Theme.color.danger : Theme.color.primary}
              size="md"
            />
          </View>

          {isOver && (
            <View style={S.SplitPanel.warningRow}>
              <MaterialCommunityIcons name="alert-circle-outline" size={14} color={Theme.color.danger} />
              <Text style={S.SplitPanel.warningText}>
                Excediste el monto por {currency}{(totalDistributed - totalAmount).toFixed(2)}. Ajusta los valores.
              </Text>
            </View>
          )}
        </View>

        {/* ─── GOALS ─── */}
        <Text style={[S.Typography.label, { marginBottom: Theme.space.sm }]}>Selecciona las metas</Text>

        {AVAILABLE_GOALS.map(goal => {
          const isSelected = selectedIds.includes(goal.id);
          return (
            <View
              key={goal.id}
              style={[S.SplitPanel.goalRow, isSelected && S.SplitPanel.goalRowActive]}
            >
              <TouchableOpacity
                style={[S.Layout.row, { flex: 1, gap: 10 }]}
                onPress={() => toggleGoal(goal.id)}
                activeOpacity={0.7}
              >
                <View style={[
                  S.SplitPanel.checkbox,
                  isSelected && S.SplitPanel.checkboxActive,
                ]}>
                  {isSelected && <MaterialCommunityIcons name="check" size={12} color={Theme.color.white} />}
                </View>
                <View style={[S.IconWrap.free, { backgroundColor: goal.iconColor + '18' }]}>
                  <MaterialCommunityIcons name={goal.icon as any} size={18} color={goal.iconColor} />
                </View>
                <View style={S.Layout.flex1}>
                  <Text style={[S.Typography.headingSm, { fontSize: Theme.size.sm }]}>{goal.name}</Text>
                  <Text style={S.Typography.bodySm}>{goal.currency}</Text>
                </View>
              </TouchableOpacity>

              {isSelected && (
                <View style={S.SplitPanel.assignInput}>
                  <Text style={[S.Typography.label, { marginRight: 4 }]}>{goal.currency}</Text>
                  <TextInput
                    style={S.SplitPanel.assignInputText}
                    placeholder="0.00"
                    placeholderTextColor={Theme.color.textPlaceholder}
                    value={goals.find(g => g.id === goal.id)?.assigned ?? ''}
                    onChangeText={v => updateAssigned(goal.id, v)}
                    keyboardType="decimal-pad"
                  />
                </View>
              )}
            </View>
          );
        })}

        {/* ─── FREE REMAINDER ─── */}
        <View style={S.SplitPanel.goalRow}>
          <View style={[S.Layout.row, { flex: 1, gap: 10 }]}>
            <View style={S.IconWrap.free}>
              <MaterialCommunityIcons name="piggy-bank-outline" size={18} color={Theme.color.primary} />
            </View>
            <View style={S.Layout.flex1}>
              <Text style={[S.Typography.headingSm, { fontSize: Theme.size.sm }]}>Ahorro libre</Text>
              <Text style={S.Typography.bodySm}>Guardar sobrante sin meta</Text>
            </View>
          </View>
          <View style={S.SplitPanel.assignInput}>
            <Text style={[S.Typography.label, { marginRight: 4 }]}>{currency}</Text>
            <TextInput
              style={S.SplitPanel.assignInputText}
              placeholder="0.00"
              placeholderTextColor={Theme.color.textPlaceholder}
              value={freeAmount}
              onChangeText={setFreeAmount}
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        {/* ─── QUICK FILL ─── */}
        {remaining > 0 && (
          <TouchableOpacity
            style={S.SplitPanel.quickFillBtn}
            activeOpacity={0.7}
            onPress={() => setFreeAmount(remaining.toFixed(2))}
          >
            <MaterialCommunityIcons name="lightning-bolt" size={15} color={Theme.color.primaryDark} />
            <Text style={S.SplitPanel.quickFillText}>
              Agregar {currency}{remaining.toFixed(2)} como ahorro libre
            </Text>
          </TouchableOpacity>
        )}

        {/* ─── CONFIRM ─── */}
        <TouchableOpacity
          style={[S.Buttons.primaryLg, (isOver || selectedIds.length === 0) && S.Buttons.disabled]}
          activeOpacity={0.85}
          disabled={isOver || selectedIds.length === 0}
        >
          <MaterialCommunityIcons name="check-circle-outline" size={20} color={Theme.color.white} />
          <Text style={S.Buttons.primaryText}>Confirmar repartición</Text>
        </TouchableOpacity>

        <View style={{ height: Theme.space.xl }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SplitSavingScreen;
