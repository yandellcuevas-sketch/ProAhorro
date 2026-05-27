import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, Pressable,
  Dimensions, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, FontFamily, FontSize, Spacing, Shadows } from '../theme';

// Pantallas
import { DashboardScreen } from '../screens/dashboard/DashboardScreen';
import { GoalsScreen } from '../screens/goals/GoalsScreen';
import { HistoryScreen } from '../screens/history/HistoryScreen';
import { ChartsScreen } from '../screens/charts/ChartsScreen';
import { AccountScreen } from '../screens/account/AccountScreen';
import { AddSavingScreen } from '../screens/savings/AddSavingScreen';
import { SplitSavingScreen } from '../screens/split/SplitSavingScreen';
import { GoalDetailScreen } from '../screens/goals/GoalDetailScreen';
import { CreateGoalScreen } from '../screens/goals/CreateGoalScreen';
import { PrivacySecurityScreen } from '../screens/account/PrivacySecurityScreen';
import { DeleteAccountScreen } from '../screens/account/DeleteAccountScreen';
import { CurrencySettingsScreen } from '../screens/account/CurrencySettingsScreen';
import type { Goal, Saving } from '../types';

type Tab = 'dashboard' | 'goals' | 'history' | 'charts' | 'account';
type ModalScreen =
  | { name: 'addSaving'; goalId?: string }
  | { name: 'split' }
  | { name: 'goalDetail'; goal: Goal }
  | { name: 'createGoal' }
  | { name: 'privacy' }
  | { name: 'deleteAccount' }
  | { name: 'currency' };

const TABS: { key: Tab; icon: string; iconActive: string; label: string }[] = [
  { key: 'dashboard', icon: 'home-outline', iconActive: 'home', label: 'Inicio' },
  { key: 'goals', icon: 'flag-outline', iconActive: 'flag', label: 'Metas' },
  { key: 'history', icon: 'time-outline', iconActive: 'time', label: 'Historial' },
  { key: 'charts', icon: 'bar-chart-outline', iconActive: 'bar-chart', label: 'Gráficos' },
  { key: 'account', icon: 'person-outline', iconActive: 'person', label: 'Cuenta' },
];

interface AppNavigatorProps {
  onLogout: () => void;
}

export const AppNavigator: React.FC<AppNavigatorProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [modal, setModal] = useState<ModalScreen | null>(null);

  const goTo = useCallback((screen: ModalScreen) => setModal(screen), []);
  const goBack = useCallback(() => setModal(null), []);

  // Modal stack — si hay modal activo lo muestra sobre los tabs
  if (modal) {
    switch (modal.name) {
      case 'addSaving':
        return (
          <AddSavingScreen
            onBack={goBack}
            onSuccess={goBack}
            onGoToSplit={() => setModal({ name: 'split' })}
          />
        );
      case 'split':
        return <SplitSavingScreen onBack={goBack} onSuccess={goBack} />;
      case 'goalDetail':
        return (
          <GoalDetailScreen
            goal={modal.goal}
            onBack={goBack}
            onEdit={(g) => setModal({ name: 'goalDetail', goal: g })}
            onAddSaving={(goalId) => setModal({ name: 'addSaving', goalId })}
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
            onCreateGoal={() => goTo({ name: 'createGoal' })}
            onGoalDetail={(goal) => goTo({ name: 'goalDetail', goal })}
          />
        );
      case 'history':
        return (
          <HistoryScreen
            onSavingDetail={() => {}}
            onAddSaving={() => goTo({ name: 'addSaving' })}
          />
        );
      case 'charts':
        return <ChartsScreen />;
      case 'account':
        return (
          <AccountScreen
            onNavigateToPrivacy={() => goTo({ name: 'privacy' })}
            onNavigateToCurrency={() => goTo({ name: 'currency' })}
            onLogout={onLogout}
          />
        );
    }
  };

  return (
    <View style={styles.root}>
      <View style={styles.content}>{renderTab()}</View>

      {/* Bottom Tab Bar */}
      <View style={styles.tabBar}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <Pressable
              key={tab.key}
              style={styles.tabItem}
              onPress={() => setActiveTab(tab.key)}
            >
              {isActive && (
                <View style={styles.activeIndicator} />
              )}
              <Ionicons
                name={(isActive ? tab.iconActive : tab.icon) as any}
                size={24}
                color={isActive ? Colors.primary : Colors.textLight}
              />
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.backgroundMain },
  content: { flex: 1 },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    paddingBottom: Platform.OS === 'ios' ? 28 : 8,
    paddingTop: 8,
    ...Shadows.tabBar,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  activeIndicator: {
    position: 'absolute',
    top: -8,
    width: 32,
    height: 3,
    borderRadius: 2,
    backgroundColor: Colors.primary,
  },
  tabLabel: {
    fontFamily: FontFamily.dmSansRegular,
    fontSize: 10,
    color: Colors.textLight,
  },
  tabLabelActive: {
    fontFamily: FontFamily.dmSansSemiBold,
    color: Colors.primary,
  },
});
