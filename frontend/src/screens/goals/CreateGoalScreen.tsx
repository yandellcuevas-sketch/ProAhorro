import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, ScrollView, StatusBar,
  Pressable, TouchableOpacity, Animated,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { S, Theme } from '../../theme/style';
import { createGoalSchema, type CreateGoalFormData } from '../../validations/goal.schema';
import { useGoalsStore } from '../../store/goalsStore';
import { GOAL_ICONS, GOAL_COLORS } from '../../constants';

interface CreateGoalScreenProps {
  onBack: () => void;
  onSuccess: () => void;
}

export const CreateGoalScreen: React.FC<CreateGoalScreenProps> = ({ onBack, onSuccess }) => {
  const { createGoal } = useGoalsStore();
  const [selectedIcon, setSelectedIcon]   = useState('wallet');
  const [selectedColor, setSelectedColor] = useState<string>(Theme.color.primary);

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 9, tension: 55, useNativeDriver: true }),
    ]).start();
  }, []);

  const { control, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<CreateGoalFormData>({
      resolver: zodResolver(createGoalSchema),
      defaultValues: {
        name: '', description: '', target_amount: '',
        currency: 'DOP', icon: 'wallet', color: Theme.color.primary,
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
    <View style={S.Layout.screen}>
      <StatusBar barStyle="light-content" backgroundColor={Theme.color.primaryDarker} />

      {/* Header con gradiente */}
      <LinearGradient
        colors={[Theme.color.primaryDarker, Theme.color.primaryDark]}
        style={{
          paddingTop: Platform.OS === 'ios' ? 52 : 40,
          paddingBottom: 28,
          paddingHorizontal: Theme.space.md,
          gap: 4,
        }}
      >
        <Pressable
          style={[S.Layout.backBtn, { backgroundColor: 'rgba(255,255,255,0.15)', borderColor: 'rgba(255,255,255,0.2)' }]}
          onPress={onBack}
        >
          <MaterialCommunityIcons name="arrow-left" size={22} color={Theme.color.white} />
        </Pressable>
        <Text style={[S.Typography.headingXl, { color: Theme.color.white, marginTop: Theme.space.sm }]}>
          Nueva meta
        </Text>
        <Text style={[S.Typography.bodyMd, { color: 'rgba(255,255,255,0.7)' }]}>
          ¿Qué quieres lograr?
        </Text>
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={S.Layout.flex1}
      >
        <ScrollView
          contentContainerStyle={S.Layout.scrollPad}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

            <Controller control={control} name="name"
              render={({ field: { onChange, value, onBlur } }) => (
                <Input label="Nombre de la meta" placeholder="Ej: Viaje a Europa"
                  leftIcon="flag-outline" value={value} onChangeText={onChange}
                  onBlur={onBlur} error={errors.name?.message} />
              )}
            />

            <Controller control={control} name="description"
              render={({ field: { onChange, value } }) => (
                <Input label="Descripción (opcional)" placeholder="¿Para qué es esta meta?"
                  value={value} onChangeText={onChange} multiline />
              )}
            />

            <Controller control={control} name="target_amount"
              render={({ field: { onChange, value } }) => (
                <Input label="Monto objetivo" placeholder="0.00" keyboardType="decimal-pad"
                  leftIcon="cash-multiple" value={value} onChangeText={onChange}
                  error={errors.target_amount?.message} />
              )}
            />

            {/* Moneda */}
            <Text style={[S.Typography.label, { marginBottom: Theme.space.sm, marginTop: Theme.space.sm }]}>
              Moneda
            </Text>
            <Controller control={control} name="currency"
              render={({ field: { value, onChange } }) => (
                <View style={[S.Layout.row, { gap: 10, marginBottom: Theme.space.md }]}>
                  {['DOP', 'USD', 'EUR'].map(c => (
                    <Pressable
                      key={c}
                      style={[
                        S.Chips.filter,
                        { borderRadius: Theme.radius.full },
                        value === c && S.Chips.filterActive,
                      ]}
                      onPress={() => onChange(c)}
                    >
                      <Text style={value === c ? S.Chips.filterTextActive : S.Chips.filterText}>{c}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            />

            <Controller control={control} name="deadline"
              render={({ field: { onChange, value } }) => (
                <Input label="Fecha límite (opcional)" placeholder="YYYY-MM-DD"
                  leftIcon="calendar-outline" value={value ?? ''} onChangeText={onChange}
                  error={errors.deadline?.message} />
              )}
            />

            {/* Iconos */}
            <Text style={[S.Typography.label, { marginBottom: Theme.space.sm, marginTop: Theme.space.sm }]}>
              Ícono
            </Text>
            <View style={[S.Layout.rowWrap, { gap: 10, marginBottom: Theme.space.md }]}>
              {GOAL_ICONS.map((ic: any) => (
                <TouchableOpacity
                  key={ic.value}
                  style={[
                    S.DestinationPicker.iconWrap,
                    { width: 52, height: 52, borderRadius: Theme.radius.md },
                    selectedIcon === ic.value && {
                      borderColor: selectedColor,
                      backgroundColor: selectedColor + '15',
                    },
                  ]}
                  onPress={() => setSelectedIcon(ic.value)}
                  activeOpacity={0.7}
                >
                  <MaterialCommunityIcons
                    name={ic.value as any}
                    size={22}
                    color={selectedIcon === ic.value ? selectedColor : Theme.color.textPlaceholder}
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* Colores */}
            <Text style={[S.Typography.label, { marginBottom: Theme.space.sm }]}>Color</Text>
            <View style={[S.Layout.rowWrap, { gap: 10, marginBottom: Theme.space.md }]}>
              {GOAL_COLORS.map((c: string) => (
                <TouchableOpacity
                  key={c}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: c,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: selectedColor === c ? 3 : 0,
                    borderColor: Theme.color.white,
                  }}
                  onPress={() => setSelectedColor(c)}
                  activeOpacity={0.8}
                >
                  {selectedColor === c && (
                    <MaterialCommunityIcons name="check" size={16} color={Theme.color.white} />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Preview */}
            <View style={[S.Cards.basePad, {
              flexDirection: 'row',
              alignItems: 'center',
              gap: Theme.space.md,
              borderColor: selectedColor + '40',
              borderWidth: 1.5,
              marginBottom: Theme.space.lg,
            }]}>
              <View style={[S.IconWrap.xl, { backgroundColor: selectedColor + '20', borderRadius: Theme.radius.md }]}>
                <MaterialCommunityIcons name={selectedIcon as any} size={28} color={selectedColor} />
              </View>
              <Text style={S.Typography.bodyMd}>Vista previa de tu meta</Text>
            </View>

            <Button
              label="Crear meta"
              variant="primary"
              loading={isSubmitting}
              onPress={handleSubmit(onSubmit)}
              icon="flag-outline"
            />

            <View style={{ height: 40 }} />
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};
