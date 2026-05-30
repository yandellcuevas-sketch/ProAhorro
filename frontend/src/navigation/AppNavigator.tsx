import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { S, Theme } from '../theme/style';

// Pantallas
import { DashboardScreen } from '../screens/dashboard/DashboardScreen';
import GoalsScreen from '../screens/goals/GoalsScreen';
import HistoryScreen from '../screens/history/HistoryScreen';
import { ChartsScreen } from '../screens/charts/ChartsScreen';
import { AccountScreen } from '../screens/account/AccountScreen';
import AddSavingScreen from '../screens/savings/AddSavingScreen';
import SplitSavingScreen from '../screens/split/SplitSavingScreen';
import { GoalDetailScreen } from '../screens/goals/GoalDetailScreen';
import { CreateGoalScreen } from '../screens/goals/CreateGoalScreen';
import { PrivacySecurityScreen } from '../screens/account/PrivacySecurityScreen';
import { DeleteAccountScreen } from '../screens/account/DeleteAccountScreen';
import { CurrencySettingsScreen } from '../screens/account/CurrencySettingsScreen';
import type { Goal } from '../types';

type Tab = 'dashboard' | 'goals' | 'history' | 'charts' | 'account';
type ModalScreen =
  | { name: 'addSaving'; goalId?: string }
  | { name: 'split' }
  | { name: 'goalDetail'; goal: Goal }
  | { name: 'createGoal' }
  | { name: 'privacy' }
  | { name: 'deleteAccount' }
  | { name: 'currency' };

const TABS: { key: Tab; icon: keyof typeof MaterialCommunityIcons.glyphMap; iconActive: keyof typeof MaterialCommunityIcons.glyphMap; label: string }[] = [
  { key: 'dashboard', icon: 'home-outline',     iconActive: 'home',      label: 'Inicio'   },
  { key: 'goals',     icon: 'flag-outline',      iconActive: 'flag',      label: 'Metas'    },
  { key: 'history',   icon: 'history',           iconActive: 'history',   label: 'Historial'},
  { key: 'charts',    icon: 'chart-bar',         iconActive: 'chart-bar', label: 'Gráficos' },
  { key: 'account',   icon: 'account-outline',   iconActive: 'account',   label: 'Cuenta'   },
];

interface AppNavigatorProps {
  onLogout: () => void;
}

export const AppNavigator: React.FC<AppNavigatorProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [modal, setModal]         = useState<ModalScreen | null>(null);

  const goTo   = useCallback((screen: ModalScreen) => setModal(screen), []);
  const goBack = useCallback(() => setModal(null), []);

  // Modal stack
  if (modal) {
    switch (modal.name) {
      case 'addSaving':
        return (
          <AddSavingScreen
            navigation={{ goBack, navigate: (route: string) => { if (route === 'SplitSaving') setModal({ name: 'split' }); } }}
          />
        );
      case 'split':
        return <SplitSavingScreen navigation={{ goBack }} route={{ params: {} } as any} />;
      case 'goalDetail':
        return (
          <GoalDetailScreen
            goal={modal.goal as any}
            onBack={goBack}
            onEdit={(g: any) => setModal({ name: 'goalDetail', goal: g })}
            onAddSaving={(goalId: string) => setModal({ name: 'addSaving', goalId })}
          />
        );
      case 'createGoal':
        return (
          <CreateGoalScreen
            onBack={goBack}
            onSuccess={() => { goBack(); setActiveTab('goals'); }}
          />
        );
      case 'privacy':
        return (
          <PrivacySecurityScreen
            onBack={goBack}
            onNavigateToDeleteAccount={() => setModal({ name: 'deleteAccount' })}
          />
        );
      case 'deleteAccount':
        return (
          <DeleteAccountScreen
            onBack={goBack}
            onDeleted={onLogout}
          />
        );
      case 'currency':
        return <CurrencySettingsScreen onBack={goBack} />;
    }
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardScreen
            onAddSaving={() => goTo({ name: 'addSaving' })}
            onGoToGoals={() => setActiveTab('goals')}
            onGoToHistory={() => setActiveTab('history')}
          />
        );
      case 'goals':
        return (
          <GoalsScreen
            navigation={{ navigate: (screen: string, params?: any) => {
              if (screen === 'GoalDetail') goTo({ name: 'goalDetail', goal: params?.goal || { id: '1' } });
              if (screen === 'CreateGoal') goTo({ name: 'createGoal' });
            } }}
          />
        );
      case 'history':
        return (
          <HistoryScreen
            navigation={{ navigate: (route: string) => { if (route === 'AddSaving') goTo({ name: 'addSaving' }); } }}
          />
        );
      case 'charts':
        return <ChartsScreen />;
      case 'account':
        return (
          <AccountScreen
            navigation={{ navigate: (screen: string) => {
              if (screen === 'Privacy')       goTo({ name: 'privacy' });
              if (screen === 'DeleteAccount') goTo({ name: 'deleteAccount' });
            }, reset: onLogout }}
          />
        );
    }
  };

  return (
    <View style={[S.Layout.screen, { backgroundColor: Theme.color.bgMain }]}>
      {/* Tab content */}
      <View style={S.Layout.flex1}>{renderTab()}</View>

      {/* Bottom Tab Bar */}
      <View style={S.Navbar.container}>
        {TABS.map(tab => {
          const isActive = activeTab === tab.key;
          return (
            <Pressable
              key={tab.key}
              style={S.Navbar.item}
              onPress={() => setActiveTab(tab.key)}
            >
              {isActive && <View style={S.Navbar.activeDot} />}
              <MaterialCommunityIcons
                name={isActive ? tab.iconActive : tab.icon}
                size={24}
                color={isActive ? Theme.color.primary : Theme.color.gray300}
              />
              <Text style={[S.Navbar.label, isActive && S.Navbar.labelActive]}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};
