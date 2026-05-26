import React, { useCallback, useEffect } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import * as ExpoSplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AnimatedLogo } from '../../components/brand/AnimatedLogo';
import { Colors } from '../../theme';
import { STORAGE_KEYS, SPLASH_DURATION_MS } from '../../constants';
import { useAuthStore } from '../../store/authStore';

// Mantener el splash nativo visible hasta que terminemos
ExpoSplashScreen.preventAutoHideAsync();

interface SplashScreenProps {
  onFinish: (destination: 'onboarding' | 'login' | 'dashboard') => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const { loadSession, isAuthenticated } = useAuthStore();

  const init = useCallback(async () => {
    try {
      // Ocultar splash nativo
      await ExpoSplashScreen.hideAsync();

      // Cargar sesión de Supabase
      await loadSession();

      // Verificar onboarding
      const onboardingDone = await AsyncStorage.getItem(
        STORAGE_KEYS.ONBOARDING_DONE
      );

      // Determinar destino después del splash
      // (Se ejecuta tras la animación de 1.5s)
      if (!onboardingDone) {
        onFinish('onboarding');
      } else if (isAuthenticated) {
        onFinish('dashboard');
      } else {
        onFinish('login');
      }
    } catch {
      await ExpoSplashScreen.hideAsync();
      onFinish('login');
    }
  }, [loadSession, isAuthenticated, onFinish]);

  const handleAnimationComplete = useCallback(async () => {
    await init();
  }, [init]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryDark} />
      <AnimatedLogo
        showTagline
        size={110}
        onAnimationComplete={handleAnimationComplete}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
