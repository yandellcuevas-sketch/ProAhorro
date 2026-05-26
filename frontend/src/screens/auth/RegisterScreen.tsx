import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StatusBar,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius } from '../../theme';
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
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={[Colors.primaryDeep, Colors.primaryDark]}
        style={styles.header}
      >
        <Pressable style={styles.backBtn} onPress={onNavigateToLogin}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </Pressable>
        <Text style={styles.headerTitle}>Crear cuenta</Text>
        <Text style={styles.headerSubtitle}>Empieza a ahorrar hoy</Text>
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.body}
      >
        <ScrollView
          contentContainerStyle={styles.form}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {submitError ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{submitError}</Text>
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
                leftIcon="person-outline"
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
                leftIcon="mail-outline"
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
                leftIcon="lock-closed-outline"
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
                leftIcon="shield-checkmark-outline"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.confirmPassword?.message}
              />
            )}
          />

          <Text style={styles.disclaimer}>
            Al crear una cuenta aceptas nuestros{' '}
            <Text style={styles.link}>Términos de uso</Text> y{' '}
            <Text style={styles.link}>Política de privacidad</Text>.
          </Text>

          <Button
            label="Crear mi cuenta"
            variant="primary"
            loading={isLoading}
            onPress={handleSubmit(onSubmit)}
            style={styles.submitBtn}
          />

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>¿Ya tienes cuenta? </Text>
            <Button
              label="Inicia sesión"
              variant="ghost"
              size="sm"
              fullWidth={false}
              onPress={onNavigateToLogin}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.backgroundMain },
  header: {
    paddingTop: 60,
    paddingBottom: 32,
    paddingHorizontal: Spacing.screenHorizontal,
    gap: 4,
  },
  backBtn: { marginBottom: Spacing[4] },
  headerTitle: {
    fontFamily: FontFamily.soraBold,
    fontSize: FontSize['2xl'],
    color: Colors.white,
  },
  headerSubtitle: {
    fontFamily: FontFamily.dmSansRegular,
    fontSize: FontSize.base,
    color: 'rgba(255,255,255,0.7)',
  },
  body: { flex: 1 },
  form: {
    padding: Spacing.screenHorizontal,
    paddingTop: Spacing[6],
  },
  errorBanner: {
    backgroundColor: Colors.dangerLight,
    borderRadius: BorderRadius.sm,
    padding: Spacing[3],
    marginBottom: Spacing[4],
    borderLeftWidth: 3,
    borderLeftColor: Colors.danger,
  },
  errorBannerText: {
    fontFamily: FontFamily.dmSansRegular,
    fontSize: FontSize.sm,
    color: Colors.danger,
  },
  disclaimer: {
    fontFamily: FontFamily.dmSansRegular,
    fontSize: FontSize.xs,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: Spacing[5],
    lineHeight: FontSize.xs * 1.6,
  },
  link: {
    color: Colors.primary,
    fontFamily: FontFamily.dmSansMedium,
  },
  submitBtn: { marginBottom: Spacing[4] },
  loginRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginText: {
    fontFamily: FontFamily.dmSansRegular,
    fontSize: FontSize.base,
    color: Colors.textMedium,
  },
});
