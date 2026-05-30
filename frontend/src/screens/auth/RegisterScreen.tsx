import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StatusBar,
  Animated,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { S, Theme } from '../../theme/style';
import { registerSchema, type RegisterFormData } from '../../validations/auth.schema';
import { useAuthStore } from '../../store/authStore';

interface RegisterScreenProps {
  onNavigateToLogin: () => void;
  onRegisterSuccess: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  onNavigateToLogin,
  onRegisterSuccess,
}) => {
  const { register, isLoading } = useAuthStore();
  const [submitError, setSubmitError] = useState('');

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 8, tension: 50, useNativeDriver: true }),
    ]).start();
  }, []);

  const { control, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setSubmitError('');
    try {
      await register(data.name, data.email, data.password);
      onRegisterSuccess();
    } catch (err: any) {
      setSubmitError(err.message);
    }
  };

  return (
    <View style={S.Layout.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={Theme.color.bgMain} />

      {/* Header */}
      <View style={[S.Layout.header, { backgroundColor: Theme.color.primaryDark, paddingTop: Platform.OS === 'ios' ? 52 : 36, paddingBottom: 24 }]}>
        <Pressable style={[S.Layout.backBtn, { backgroundColor: 'rgba(255,255,255,0.12)', borderColor: 'rgba(255,255,255,0.2)' }]} onPress={onNavigateToLogin}>
          <MaterialCommunityIcons name="arrow-left" size={22} color={Theme.color.white} />
        </Pressable>
        <View style={S.Layout.flex1}>
          <Text style={[S.Typography.headingXl, { color: Theme.color.white, marginBottom: 2 }]}>
            Crear cuenta
          </Text>
          <Text style={[S.Typography.bodyMd, { color: 'rgba(255,255,255,0.7)' }]}>
            Empieza a ahorrar hoy
          </Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

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

            {/* Error banner */}
            {submitError ? (
              <View style={[S.Cards.danger, { marginBottom: Theme.space.md, borderLeftWidth: 3, borderLeftColor: Theme.color.danger }]}>
                <Text style={S.Typography.danger}>{submitError}</Text>
              </View>
            ) : null}

            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value, onBlur } }) => (
                <Input
                  label="Nombre"
                  placeholder="Tu nombre"
                  autoCapitalize="words"
                  leftIcon="account-outline"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.name?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value, onBlur } }) => (
                <Input
                  label="Email"
                  placeholder="tu@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  leftIcon="email-outline"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.email?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value, onBlur } }) => (
                <Input
                  label="Contraseña"
                  placeholder="Mínimo 8 caracteres"
                  isPassword
                  leftIcon="lock-outline"
                  hint="Incluye mayúsculas, minúsculas y números"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, value, onBlur } }) => (
                <Input
                  label="Confirmar contraseña"
                  placeholder="Repite tu contraseña"
                  isPassword
                  leftIcon="shield-check-outline"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.confirmPassword?.message}
                />
              )}
            />

            <Text style={[S.Typography.caption, { textAlign: 'center', marginBottom: Theme.space.lg }]}>
              Al crear una cuenta aceptas nuestros{' '}
              <Text style={S.Typography.linkSm}>Términos de uso</Text>
              {' '}y{' '}
              <Text style={S.Typography.linkSm}>Política de privacidad</Text>.
            </Text>

            <Button
              label="Crear mi cuenta"
              variant="primary"
              loading={isLoading}
              onPress={handleSubmit(onSubmit)}
              icon="account-plus-outline"
            />

            <View style={[S.Layout.row, { justifyContent: 'center', marginTop: Theme.space.lg }]}>
              <Text style={S.Typography.bodyMd}>¿Ya tienes cuenta? </Text>
              <Pressable onPress={onNavigateToLogin}>
                <Text style={S.Typography.link}>Inicia sesión</Text>
              </Pressable>
            </View>

          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};
