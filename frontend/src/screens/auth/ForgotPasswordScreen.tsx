import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  Pressable, KeyboardAvoidingView, Platform, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius } from '../../theme';
import { authService } from '../../services/authService';

const schema = z.object({
  email: z.string().email('Ingresa un email válido'),
});
type FormData = z.infer<typeof schema>;

interface ForgotPasswordScreenProps {
  onBack: () => void;
}

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ onBack }) => {
  const [sent, setSent] = useState(false);
  const [sentEmail, setSentEmail] = useState('');
  const [error, setError] = useState('');

  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  });

  const onSubmit = async ({ email }: FormData) => {
    setError('');
    try {
      await authService.resetPassword(email);
      setSentEmail(email);
      setSent(true);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={[Colors.primaryDeep, Colors.primaryDark]} style={styles.header}>
        <Pressable style={styles.backBtn} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </Pressable>
        <View style={styles.headerIcon}>
          <Ionicons name="key-outline" size={36} color={Colors.white} />
        </View>
        <Text style={styles.headerTitle}>Recuperar contraseña</Text>
        <Text style={styles.headerSub}>Te enviaremos un enlace a tu email</Text>
      </LinearGradient>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.body}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {!sent ? (
            <>
              <Text style={styles.instruction}>
                Ingresa el email con el que creaste tu cuenta y te enviaremos un enlace para restablecer tu contraseña.
              </Text>

              {error ? (
                <View style={styles.errorBanner}>
                  <Ionicons name="alert-circle-outline" size={16} color={Colors.danger} />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              <Controller
                control={control} name="email"
                render={({ field: { onChange, value, onBlur } }) => (
                  <Input label="Email" placeholder="tu@email.com" keyboardType="email-address"
                    autoCapitalize="none" autoCorrect={false} leftIcon="mail-outline"
                    value={value} onChangeText={onChange} onBlur={onBlur} error={errors.email?.message} />
                )}
              />

              <Button label="Enviar enlace" variant="primary" loading={isSubmitting} onPress={handleSubmit(onSubmit)} />
              <Button label="Volver al inicio de sesión" variant="ghost" onPress={onBack} style={{ marginTop: Spacing[3] }} />
            </>
          ) : (
            /* Estado: enviado */
            <View style={styles.successContainer}>
              <View style={styles.successIcon}>
                <Ionicons name="checkmark-circle" size={64} color={Colors.primary} />
              </View>
              <Text style={styles.successTitle}>¡Email enviado!</Text>
              <Text style={styles.successText}>
                Revisá tu bandeja de entrada en{'\n'}
                <Text style={styles.successEmail}>{sentEmail}</Text>{'\n\n'}
                Haz clic en el enlace del email para restablecer tu contraseña. Revisa también la carpeta de spam.
              </Text>
              <Button label="Volver al inicio de sesión" variant="primary" onPress={onBack} style={{ marginTop: Spacing[6] }} />
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.backgroundMain },
  header: { paddingTop: 60, paddingBottom: 32, paddingHorizontal: Spacing.screenHorizontal, alignItems: 'center', gap: Spacing[2] },
  backBtn: { position: 'absolute', top: 60, left: Spacing.screenHorizontal },
  headerIcon: { width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginTop: 24 },
  headerTitle: { fontFamily: FontFamily.soraBold, fontSize: FontSize.xl, color: Colors.white },
  headerSub: { fontFamily: FontFamily.dmSansRegular, fontSize: FontSize.sm, color: 'rgba(255,255,255,0.75)' },
  body: { flex: 1 },
  content: { padding: Spacing.screenHorizontal, paddingTop: Spacing[6] },
  instruction: { fontFamily: FontFamily.dmSansRegular, fontSize: FontSize.base, color: Colors.textMedium, lineHeight: FontSize.base * 1.6, marginBottom: Spacing[5] },
  errorBanner: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: Colors.dangerLight, borderRadius: BorderRadius.sm, padding: Spacing[3], borderLeftWidth: 3, borderLeftColor: Colors.danger, marginBottom: Spacing[4] },
  errorText: { flex: 1, fontFamily: FontFamily.dmSansRegular, fontSize: FontSize.sm, color: Colors.danger },
  successContainer: { alignItems: 'center', paddingTop: Spacing[6] },
  successIcon: { marginBottom: Spacing[4] },
  successTitle: { fontFamily: FontFamily.soraBold, fontSize: FontSize['2xl'], color: Colors.textDark, marginBottom: Spacing[3] },
  successText: { fontFamily: FontFamily.dmSansRegular, fontSize: FontSize.base, color: Colors.textMedium, textAlign: 'center', lineHeight: FontSize.base * 1.7 },
  successEmail: { fontFamily: FontFamily.dmSansSemiBold, color: Colors.primary },
});
