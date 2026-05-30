import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { S, Theme } from '../../theme/style';
import { useAuthStore } from '../../store/authStore';

const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const { login, isLoading } = useAuthStore();
  const [submitError, setSubmitError] = useState('');

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 8, tension: 50, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      setSubmitError('Por favor ingresa tu correo y contraseña');
      return;
    }
    setSubmitError('');
    try {
      await login(email, password);
    } catch (err: any) {
      setSubmitError(err.message || 'Error al iniciar sesión');
    }
  };

  return (
    <KeyboardAvoidingView
      style={S.Layout.screenWhite}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="dark-content" backgroundColor={Theme.color.bgCard} />
      <ScrollView
        contentContainerStyle={[S.Layout.scrollPadLg, { paddingTop: 64 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

          {/* Logo */}
          <View style={[S.Buttons.iconCircleGreen, { width: 56, height: 56, borderRadius: 16, marginBottom: Theme.space.xl }]}>
            <Image
              source={require('../../assets/images/imglogo.png')}
              style={{ width: 32, height: 32, tintColor: Theme.color.white }}
              resizeMode="contain"
            />
          </View>

          <Text style={[S.Typography.displayMd, { marginBottom: 4 }]}>
            {'Bienvenido de\nvuelta'}
          </Text>
          <Text style={[S.Typography.bodyLg, { marginBottom: Theme.space.xl }]}>
            Inicia sesión para ver tus ahorros
          </Text>

          {/* Error banner */}
          {submitError ? (
            <View style={[S.Cards.danger, { marginBottom: Theme.space.md, borderLeftWidth: 3, borderLeftColor: Theme.color.danger }]}>
              <Text style={[S.Typography.danger, { fontSize: Theme.size.sm }]}>{submitError}</Text>
            </View>
          ) : null}

          {/* Email */}
          <View style={S.Forms.group}>
            <Text style={S.Typography.label}>Correo electrónico</Text>
            <View style={[
              focusedField === 'email' ? S.Forms.inputWrapFocused : S.Forms.inputWrap,
            ]}>
              <MaterialCommunityIcons
                name="email-outline"
                size={18}
                color={focusedField === 'email' ? Theme.color.primary : Theme.color.textPlaceholder}
              />
              <TextInput
                style={S.Forms.input}
                placeholder="tu@correo.com"
                placeholderTextColor={Theme.color.textPlaceholder}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
              />
            </View>
          </View>

          {/* Password */}
          <View style={S.Forms.group}>
            <View style={S.Forms.labelRow}>
              <Text style={S.Typography.label}>Contraseña</Text>
              <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('ForgotPassword')}>
                <Text style={S.Typography.linkSm}>¿Olvidaste tu contraseña?</Text>
              </TouchableOpacity>
            </View>
            <View style={[
              focusedField === 'pass' ? S.Forms.inputWrapFocused : S.Forms.inputWrap,
            ]}>
              <MaterialCommunityIcons
                name="lock-outline"
                size={18}
                color={focusedField === 'pass' ? Theme.color.primary : Theme.color.textPlaceholder}
              />
              <TextInput
                style={S.Forms.input}
                placeholder="••••••••"
                placeholderTextColor={Theme.color.textPlaceholder}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPass}
                onFocus={() => setFocusedField('pass')}
                onBlur={() => setFocusedField(null)}
              />
              <TouchableOpacity onPress={() => setShowPass(!showPass)} activeOpacity={0.7}>
                <MaterialCommunityIcons
                  name={showPass ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color={Theme.color.textPlaceholder}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* CTA principal */}
          <TouchableOpacity
            style={[S.Buttons.primaryLg, isLoading && S.Buttons.disabled, { marginTop: Theme.space.sm, marginBottom: Theme.space.lg }]}
            activeOpacity={0.85}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={S.Buttons.primaryText}>{isLoading ? 'Iniciando...' : 'Iniciar sesión'}</Text>
            {!isLoading && <MaterialCommunityIcons name="arrow-right" size={18} color={Theme.color.white} />}
          </TouchableOpacity>

          {/* Divider */}
          <View style={S.Forms.dividerRow}>
            <View style={S.Forms.dividerLine} />
            <Text style={S.Forms.dividerText}>o continúa con</Text>
            <View style={S.Forms.dividerLine} />
          </View>

          {/* Social */}
          <TouchableOpacity style={[S.Buttons.apple, { marginBottom: Theme.space.sm }]} activeOpacity={0.85}>
            <MaterialCommunityIcons name="apple" size={20} color={Theme.color.white} />
            <Text style={S.Buttons.appleText}>Continuar con Apple</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[S.Buttons.google, { marginBottom: Theme.space.xl }]} activeOpacity={0.85}>
            <MaterialCommunityIcons name="google" size={18} color="#EA4335" />
            <Text style={S.Buttons.googleText}>Continuar con Google</Text>
          </TouchableOpacity>

          {/* Footer */}
          <View style={[S.Layout.row, { justifyContent: 'center' }]}>
            <Text style={S.Typography.bodyLg}>¿No tienes cuenta?</Text>
            <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('Register')}>
              <Text style={[S.Typography.link, { marginLeft: 4 }]}> Regístrate</Text>
            </TouchableOpacity>
          </View>

        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
