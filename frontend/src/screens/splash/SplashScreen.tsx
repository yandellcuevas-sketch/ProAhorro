import React, { useCallback, useEffect, useRef } from 'react';
import { View, StatusBar, Animated } from 'react-native';
import * as ExpoSplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AnimatedLogo } from '../../components/brand/AnimatedLogo';
import { S, Theme } from '../../theme/style';
import { STORAGE_KEYS } from '../../constants';
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
      await ExpoSplashScreen.hideAsync();
      await loadSession();
      const onboardingDone = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_DONE);
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
    <View style={{
      flex: 1,
      backgroundColor: Theme.color.primaryDark,
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <StatusBar barStyle="light-content" backgroundColor={Theme.color.primaryDark} />
      <AnimatedLogo
        showTagline
        size={110}
        onAnimationComplete={handleAnimationComplete}
      />
    </View>
  );
};
