import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { S, Theme } from '../../theme/style';
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

  // Animaciones de entrada
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 9, tension: 55, useNativeDriver: true }),
    ]).start();
  }, [sent]); // Re-animar si cambia el estado a enviado

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
    <View style={S.Layout.screenWhite}>
      <StatusBar barStyle="light-content" backgroundColor={Theme.color.primaryDarker} />
      
      {/* Header con gradiente */}
      <LinearGradient
        colors={[Theme.color.primaryDarker, Theme.color.primaryDark]}
        style={{
          paddingTop: Platform.OS === 'ios' ? 52 : 40,
          paddingBottom: 32,
          paddingHorizontal: Theme.space.md,
          alignItems: 'center',
          gap: Theme.space.sm,
        }}
      >
        <Pressable
          style={[
            S.Layout.backBtn,
            {
              position: 'absolute',
              top: Platform.OS === 'ios' ? 48 : 36,
              left: Theme.space.md,
              backgroundColor: 'rgba(255,255,255,0.15)',
              borderColor: 'rgba(255,255,255,0.2)',
            },
          ]}
          onPress={onBack}
        >
          <MaterialCommunityIcons name="arrow-left" size={22} color={Theme.color.white} />
        </Pressable>
        
        <View
          style={{
            width: 72,
            height: 72,
            borderRadius: 36,
            backgroundColor: 'rgba(255,255,255,0.2)',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 24,
          }}
        >
          <MaterialCommunityIcons name="key-outline" size={34} color={Theme.color.white} />
        </View>
        <Text style={[S.Typography.headingLg, { color: Theme.color.white, marginTop: Theme.space.xs }]}>
          Recuperar contraseña
        </Text>
        <Text style={[S.Typography.bodyMd, { color: 'rgba(255,255,255,0.75)' }]}>
          Te enviaremos un enlace a tu email
        </Text>
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={S.Layout.flex1}
      >
        <ScrollView
          contentContainerStyle={S.Layout.scrollPad}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            {!sent ? (
              <>
                <Text style={[S.Typography.bodyLg, { color: Theme.color.textMedium, lineHeight: 24, marginBottom: Theme.space.lg }]}>
                  Ingresa el email con el que creaste tu cuenta y te enviaremos un enlace para restablecer tu contraseña.
                </Text>

                {error ? (
                  <View style={[S.Cards.danger, S.Layout.row, { alignItems: 'flex-start', gap: 8, marginBottom: Theme.space.md }]}>
                    <MaterialCommunityIcons name="alert-circle-outline" size={18} color={Theme.color.danger} />
                    <Text style={[S.Typography.bodySm, { color: Theme.color.danger, flex: 1 }]}>{error}</Text>
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
                      leftIcon="email-outline"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.email?.message}
                    />
                  )}
                />

                <Button
                  label="Enviar enlace"
                  variant="primary"
                  loading={isSubmitting}
                  onPress={handleSubmit(onSubmit)}
                />
                
                <Button
                  label="Volver al inicio de sesión"
                  variant="ghost"
                  onPress={onBack}
                  style={{ marginTop: Theme.space.md }}
                />
              </>
            ) : (
              /* Estado: enviado */
              <View style={[S.Layout.center, { paddingTop: Theme.space.xl, gap: Theme.space.md }]}>
                <View style={{ marginBottom: Theme.space.sm }}>
                  <MaterialCommunityIcons name="check-circle" size={64} color={Theme.color.primary} />
                </View>
                <Text style={S.Typography.headingXl}>¡Email enviado!</Text>
                <Text style={[S.Typography.bodyLg, { textAlign: 'center', lineHeight: 26 }]}>
                  Revisá tu bandeja de entrada en{'\n'}
                  <Text style={[S.Typography.link, { color: Theme.color.primary }]}>{sentEmail}</Text>{'\n\n'}
                  Haz clic en el enlace del email para restablecer tu contraseña. Revisa también la carpeta de spam.
                </Text>
                <Button
                  label="Volver al inicio de sesión"
                  variant="primary"
                  onPress={onBack}
                  style={{ marginTop: Theme.space.xl }}
                />
              </View>
            )}
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};
