import React, { useState } from 'react';
import LoginScreen from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { ForgotPasswordScreen } from '../screens/auth/ForgotPasswordScreen';

type AuthScreen = 'login' | 'register' | 'forgot';

interface AuthNavigatorProps {
  onAuthenticated: () => void;
}

export const AuthNavigator: React.FC<AuthNavigatorProps> = ({ onAuthenticated }) => {
  const [screen, setScreen] = useState<AuthScreen>('login');

  switch (screen) {
    case 'register':
      return (
        <RegisterScreen
          onNavigateToLogin={() => setScreen('login')}
          onRegisterSuccess={onAuthenticated}
        />
      );
    case 'forgot':
      return <ForgotPasswordScreen onBack={() => setScreen('login')} />;
    default:
      return (
        <LoginScreen
          navigation={{
            navigate: (screen: string) => {
              if (screen === 'Register') setScreen('register');
              if (screen === 'ForgotPassword') setScreen('forgot');
            },
            replace: onAuthenticated,
          }}
        />
      );
  }
};
