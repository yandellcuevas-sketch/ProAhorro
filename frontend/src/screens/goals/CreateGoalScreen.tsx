import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  Pressable, StatusBar, TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius, Shadows } from '../../theme';
import { createGoalSchema, type CreateGoalFormData } from '../../validations/goal.schema';
import { useGoalsStore } from '../../store/goalsStore';
import { GOAL_ICONS, GOAL_COLORS } from '../../constants';

interface CreateGoalScreenProps {
  onBack: () => void;
  onSuccess: () => void;
}

export const CreateGoalScreen: React.FC<CreateGoalScreenProps> = ({ onBack, onSuccess }) => {
  const { createGoal } = useGoalsStore();
  const [selectedIcon, setSelectedIcon] = useState('wallet');
  const [selectedColor, setSelectedColor] = useState<string>(Colors.primary);

  const { control, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<CreateGoalFormData>({
      resolver: zodResolver(createGoalSchema),
      defaultValues: {
        name: '', description: '', target_amount: '',
        currency: 'DOP', icon: 'wallet', color: Colors.primary,
      },
    });

  const onSubmit = async (data: CreateGoalFormData) => {
    await createGoal({
      name: data.name,
      description: data.description,
      target_amount: parseFloat(data.target_amount),
      currency: data.currency,
      deadline: data.deadline,
      icon: selectedIcon,
      color: selectedColor,
    });
    onSuccess();
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={[Colors.primaryDeep, Colors.primaryDark]} style={styles.header}>
        <Pressable style={styles.backBtn} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </Pressable>
        <Text style={styles.headerTitle}>Nueva meta</Text>
        <Text style={styles.headerSub}>¿Qué quieres lograr?</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
        <Controller
          control={control} name="name"
          render={({ field: { onChange, value, onBlur } }) => (
            <Input label="Nombre de la meta" placeholder="Ej: Viaje a Europa" leftIcon="flag-outline"
              value={value} onChangeText={onChange} onBlur={onBlur} error={errors.name?.message} />
          )}
        />

        <Controller
          control={control} name="description"
          render={({ field: { onChange, value } }) => (
            <Input label="Descripción (opcional)" placeholder="¿Para qué es esta meta?"
              value={value} onChangeText={onChange} multiline />
          )}
        />

        <Controller
          control={control} name="target_amount"
          render={({ field: { onChange, value } }) => (
            <Input label="Monto objetivo" placeholder="0.00" keyboardType="decimal-pad"
              leftIcon="cash-outline" value={value} onChangeText={onChange} error={errors.target_amount?.message} />
          )}
        />

        {/* Moneda */}
        <Text style={styles.sectionLabel}>Moneda</Text>
        <Controller
          control={control} name="currency"
          render={({ field: { value, onChange } }) => (
            <View style={styles.row}>
              {['DOP', 'USD', 'EUR'].map((c) => (
                <Pressable key={c} style={[styles.chip, value === c && styles.chipSelected]} onPress={() => onChange(c)}>
                  <Text style={[styles.chipText, value === c && styles.chipTextSel]}>{c}</Text>
                </Pressable>
              ))}
            </View>
          )}
        />

        <Controller
          control={control} name="deadline"
          render={({ field: { onChange, value } }) => (
            <Input label="Fecha límite (opcional)" placeholder="YYYY-MM-DD"
              leftIcon="calendar-outline" value={value ?? ''} onChangeText={onChange}
              error={errors.deadline?.message} />
          )}
        />

        {/* Icono */}
        <Text style={styles.sectionLabel}>Icono</Text>
        <View style={styles.iconsGrid}>
          {GOAL_ICONS.map((ic) => (
            <TouchableOpacity
              key={ic.value}
              style={[styles.iconOption, selectedIcon === ic.value && { borderColor: selectedColor, backgroundColor: selectedColor + '15' }]}
              onPress={() => setSelectedIcon(ic.value)}
            >
              <Ionicons name={ic.value as any} size={22} color={selectedIcon === ic.value ? selectedColor : Colors.textLight} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Color */}
        <Text style={styles.sectionLabel}>Color</Text>
        <View style={styles.colorsGrid}>
          {GOAL_COLORS.map((c) => (
            <TouchableOpacity key={c} style={[styles.colorDot, { backgroundColor: c }, selectedColor === c && styles.colorDotSelected]} onPress={() => setSelectedColor(c)}>
              {selectedColor === c && <Ionicons name="checkmark" size={16} color={Colors.white} />}
            </TouchableOpacity>
          ))}
        </View>

        {/* Preview */}
        <View style={[styles.preview, { borderColor: selectedColor + '40' }]}>
          <View style={[styles.previewIcon, { backgroundColor: selectedColor + '20' }]}>
            <Ionicons name={selectedIcon as any} size={28} color={selectedColor} />
          </View>
          <Text style={styles.previewLabel}>Vista previa de tu meta</Text>
        </View>

        <Button label="Crear meta" variant="primary" loading={isSubmitting} onPress={handleSubmit(onSubmit)} style={styles.submitBtn} />
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
  form: { padding: Spacing.screenHorizontal, paddingTop: Spacing[5] },
  sectionLabel: { fontFamily: FontFamily.dmSansMedium, fontSize: FontSize.sm, color: Colors.textDark, marginBottom: Spacing[2], marginTop: Spacing[2] },
  row: { flexDirection: 'row', gap: 10, marginBottom: Spacing[4] },
  chip: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: BorderRadius.full, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.white },
  chipSelected: { borderColor: Colors.primary, backgroundColor: Colors.primary },
  chipText: { fontFamily: FontFamily.dmSansMedium, fontSize: FontSize.sm, color: Colors.textMedium },
  chipTextSel: { color: Colors.white },
  iconsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: Spacing[4] },
  iconOption: { width: 52, height: 52, borderRadius: BorderRadius.md, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center' },
  colorsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: Spacing[4] },
  colorDot: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  colorDotSelected: { borderWidth: 3, borderColor: Colors.white, ...Shadows.sm },
  preview: { flexDirection: 'row', alignItems: 'center', gap: Spacing[4], backgroundColor: Colors.white, borderRadius: BorderRadius.card, padding: Spacing[4], borderWidth: 1.5, marginBottom: Spacing[5], ...Shadows.sm },
  previewIcon: { width: 52, height: 52, borderRadius: BorderRadius.md, alignItems: 'center', justifyContent: 'center' },
  previewLabel: { fontFamily: FontFamily.dmSansMedium, fontSize: FontSize.base, color: Colors.textMedium },
  submitBtn: { marginTop: Spacing[2] },
});
