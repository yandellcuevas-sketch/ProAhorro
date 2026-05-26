import React, { useState, useCallback } from 'react';
import { SplashScreen } from '../screens/splash/SplashScreen';
import { OnboardingScreen } from '../screens/onboarding/OnboardingScreen';
import { AuthNavigator } from './AuthNavigator';
import { AppNavigator } from './AppNavigator';
import { useAuthStore } from '../store/authStore';

type RootState = 'splash' | 'onboarding' | 'auth' | 'app';

export const RootNavigator: React.FC = () => {
  const [state, setState] = useState<RootState>('splash');
  const { logout } = useAuthStore();

  const handleSplashFinish = useCallback((dest: 'onboarding' | 'login' | 'dashboard') => {
    if (dest === 'onboarding') setState('onboarding');
    else if (dest === 'dashboard') setState('app');
    else setState('auth');
  }, []);

  const handleLogout = useCallback(async () => {
    await logout();
    setState('auth');
  }, [logout]);

  switch (state) {
    case 'splash':
      return <SplashScreen onFinish={handleSplashFinish} />;
    case 'onboarding':
      return <OnboardingScreen onFinish={() => setState('auth')} />;
    case 'auth':
      return <AuthNavigator onAuthenticated={() => setState('app')} />;
    case 'app':
      return <AppNavigator onLogout={handleLogout} />;
  }
};
