import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StatusBar,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { AnimatedLogo } from '../../components/brand/AnimatedLogo';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius } from '../../theme';
import { loginSchema, type LoginFormData } from '../../validations/auth.schema';
import { useAuthStore } from '../../store/authStore';

interface LoginScreenProps {
  onNavigateToRegister: () => void;
  onNavigateToForgotPassword: () => void;
  onLoginSuccess: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onNavigateToRegister,
  onNavigateToForgotPassword,
  onLoginSuccess,
}) => {
  const { login, isLoading } = useAuthStore();
  const [submitError, setSubmitError] = useState('');

  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormData) => {
    setSubmitError('');
    try {
      await login(data.email, data.password);
      onLoginSuccess();
    } catch (err: any) {
      setSubmitError(err.message);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={[Colors.primaryDeep, Colors.primaryDark, Colors.primary]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <AnimatedLogo showTagline={false} size={72} />
        <Text style={styles.headerTitle}>ProAhorro</Text>
        <Text style={styles.headerSubtitle}>Bienvenido de vuelta</Text>
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
          <Text style={styles.title}>Iniciar sesión</Text>
          <Text style={styles.subtitle}>Ingresa para ver tus ahorros</Text>

          {submitError ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{submitError}</Text>
            </View>
          ) : null}

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
                placeholder="••••••••"
                isPassword
                leftIcon="lock-closed-outline"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.password?.message}
              />
            )}
          />

          <Button
            label="¿Olvidaste tu contraseña?"
            variant="ghost"
            size="sm"
            fullWidth={false}
            onPress={onNavigateToForgotPassword}
            style={styles.forgotBtn}
          />

          <Button
            label="Entrar"
            variant="primary"
            loading={isLoading}
            onPress={handleSubmit(onSubmit)}
            style={styles.loginBtn}
          />

          <View style={styles.registerRow}>
            <Text style={styles.registerText}>¿No tienes cuenta? </Text>
            <Button
              label="Crear cuenta"
              variant="ghost"
              size="sm"
              fullWidth={false}
              onPress={onNavigateToRegister}
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
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
    gap: 8,
  },
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
  title: {
    fontFamily: FontFamily.soraSemiBold,
    fontSize: FontSize.xl,
    color: Colors.textDark,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: FontFamily.dmSansRegular,
    fontSize: FontSize.base,
    color: Colors.textMedium,
    marginBottom: Spacing[6],
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
  forgotBtn: { alignSelf: 'flex-end', marginTop: -Spacing[2], marginBottom: Spacing[4] },
  loginBtn: { marginTop: Spacing[2] },
  registerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing[4],
  },
  registerText: {
    fontFamily: FontFamily.dmSansRegular,
    fontSize: FontSize.base,
    color: Colors.textMedium,
  },
});
