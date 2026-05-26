import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius, Shadows } from '../../theme';
import { addSavingSchema, type AddSavingFormData } from '../../validations/saving.schema';
import { savingsService } from '../../services/savingsService';
import { SAVING_METHODS, SAVING_DESTINATIONS } from '../../constants';

interface AddSavingScreenProps {
  onBack: () => void;
  onSuccess: () => void;
  onGoToSplit: () => void;
}

export const AddSavingScreen: React.FC<AddSavingScreenProps> = ({
  onBack,
  onSuccess,
  onGoToSplit,
}) => {
  const { control, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } =
    useForm<AddSavingFormData>({
      resolver: zodResolver(addSavingSchema),
      defaultValues: {
        amount: '',
        currency: 'DOP',
        date: new Date().toISOString().split('T')[0],
        method: 'cash',
        note: '',
        destination: 'free',
      },
    });

  const destination = watch('destination');

  const onSubmit = async (data: AddSavingFormData) => {
    if (data.destination === 'split') {
      onGoToSplit();
      return;
    }
    await savingsService.createSaving({
      amount: parseFloat(data.amount),
      currency: data.currency,
      date: data.date,
      method: data.method,
      note: data.note,
      type: data.destination === 'free' ? 'free' : 'goal',
      goal_id: data.goal_id,
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
        <Text style={styles.headerTitle}>Agregar ahorro</Text>
        <Text style={styles.headerSubtitle}>¿Cuánto guardaste hoy?</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
        <Controller
          control={control}
          name="amount"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Monto"
              placeholder="0.00"
              keyboardType="decimal-pad"
              leftIcon="cash-outline"
              value={value}
              onChangeText={onChange}
              error={errors.amount?.message}
            />
          )}
        />

        {/* Moneda */}
        <Text style={styles.label}>Moneda</Text>
        <View style={styles.chipsRow}>
          {['DOP', 'USD', 'EUR'].map((c) => (
            <Controller key={c} control={control} name="currency"
              render={({ field: { value, onChange } }) => (
                <Pressable
                  style={[styles.chip, value === c && styles.chipSelected]}
                  onPress={() => onChange(c)}
                >
                  <Text style={[styles.chipText, value === c && styles.chipTextSelected]}>{c}</Text>
                </Pressable>
              )}
            />
          ))}
        </View>

        {/* Método */}
        <Text style={styles.label}>Método</Text>
        <View style={styles.chipsRow}>
          {SAVING_METHODS.map((m) => (
            <Controller key={m.value} control={control} name="method"
              render={({ field: { value, onChange } }) => (
                <Pressable
                  style={[styles.chip, value === m.value && styles.chipSelected]}
                  onPress={() => onChange(m.value)}
                >
                  <Ionicons
                    name={m.icon as any}
                    size={14}
                    color={value === m.value ? Colors.white : Colors.textMedium}
                  />
                  <Text style={[styles.chipText, value === m.value && styles.chipTextSelected]}>
                    {m.label}
                  </Text>
                </Pressable>
              )}
            />
          ))}
        </View>

        {/* Destino */}
        <Text style={styles.label}>¿Adónde va este ahorro?</Text>
        <View style={styles.destinationGrid}>
          {SAVING_DESTINATIONS.map((d) => (
            <Controller key={d.value} control={control} name="destination"
              render={({ field: { value, onChange } }) => (
                <Pressable
                  style={[styles.destCard, value === d.value && styles.destCardSelected]}
                  onPress={() => onChange(d.value)}
                >
                  <Ionicons
                    name={d.icon as any}
                    size={22}
                    color={value === d.value ? Colors.primary : Colors.textMedium}
                  />
                  <Text style={[styles.destLabel, value === d.value && styles.destLabelSelected]}>
                    {d.label}
                  </Text>
                </Pressable>
              )}
            />
          ))}
        </View>

        <Controller
          control={control}
          name="note"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Nota (opcional)"
              placeholder="¿De dónde viene este ahorro?"
              value={value}
              onChangeText={onChange}
              multiline
            />
          )}
        />

        <Button
          label={destination === 'split' ? 'Ir a repartir' : 'Guardar ahorro'}
          variant="primary"
          loading={isSubmitting}
          onPress={handleSubmit(onSubmit)}
          style={styles.saveBtn}
        />
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.backgroundMain },
  header: {
    paddingTop: 60,
    paddingBottom: 28,
    paddingHorizontal: Spacing.screenHorizontal,
    gap: 4,
  },
  backBtn: { marginBottom: Spacing[3] },
  headerTitle: {
    fontFamily: FontFamily.soraBold,
    fontSize: FontSize.xl,
    color: Colors.white,
  },
  headerSubtitle: {
    fontFamily: FontFamily.dmSansRegular,
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.7)',
  },
  form: { padding: Spacing.screenHorizontal, paddingTop: Spacing[5] },
  label: {
    fontFamily: FontFamily.dmSansMedium,
    fontSize: FontSize.sm,
    color: Colors.textDark,
    marginBottom: Spacing[2],
    marginTop: Spacing[2],
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[2],
    marginBottom: Spacing[4],
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2],
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  chipSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  chipText: {
    fontFamily: FontFamily.dmSansMedium,
    fontSize: FontSize.sm,
    color: Colors.textMedium,
  },
  chipTextSelected: { color: Colors.white },
  destinationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[3],
    marginBottom: Spacing[4],
  },
  destCard: {
    width: '47%',
    padding: Spacing[4],
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    alignItems: 'center',
    gap: Spacing[2],
    ...Shadows.xs,
  },
  destCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primarySoft,
  },
  destLabel: {
    fontFamily: FontFamily.dmSansMedium,
    fontSize: FontSize.sm,
    color: Colors.textMedium,
    textAlign: 'center',
  },
  destLabelSelected: { color: Colors.primary },
  saveBtn: { marginTop: Spacing[4] },
});
