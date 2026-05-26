import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  StatusBar,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius, Shadows } from '../../theme';
import { useAuthStore } from '../../store/authStore';
import { accountService } from '../../services/accountService';

interface AccountScreenProps {
  onNavigateToPrivacy: () => void;
  onNavigateToCurrency: () => void;
  onLogout: () => void;
}

const SettingRow: React.FC<{
  icon: string;
  label: string;
  value?: string;
  onPress?: () => void;
  danger?: boolean;
  toggle?: boolean;
  toggleValue?: boolean;
  onToggle?: (v: boolean) => void;
}> = ({ icon, label, value, onPress, danger, toggle, toggleValue, onToggle }) => (
  <Pressable
    style={({ pressed }) => [styles.settingRow, pressed && styles.settingRowPressed]}
    onPress={onPress}
    disabled={!onPress && !toggle}
  >
    <View style={[styles.settingIconBg, danger && styles.settingIconBgDanger]}>
      <Ionicons
        name={icon as any}
        size={20}
        color={danger ? Colors.danger : Colors.primary}
      />
    </View>
    <Text style={[styles.settingLabel, danger && styles.settingLabelDanger]}>{label}</Text>
    {toggle ? (
      <Switch
        value={toggleValue}
        onValueChange={onToggle}
        trackColor={{ false: Colors.border, true: Colors.primary }}
        thumbColor={Colors.white}
      />
    ) : (
      <View style={styles.settingRight}>
        {value ? <Text style={styles.settingValue}>{value}</Text> : null}
        {onPress && <Ionicons name="chevron-forward" size={18} color={Colors.textLight} />}
      </View>
    )}
  </Pressable>
);

export const AccountScreen: React.FC<AccountScreenProps> = ({
  onNavigateToPrivacy,
  onNavigateToCurrency,
  onLogout,
}) => {
  const { user, settings, logout, refreshUser } = useAuthStore();
  const [notifications, setNotifications] = useState(settings?.notifications_enabled ?? true);

  const handleToggleNotifications = async (value: boolean) => {
    setNotifications(value);
    await accountService.updateSettings({ notifications_enabled: value });
    await refreshUser();
  };

  const handleLogout = async () => {
    await logout();
    onLogout();
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient
        colors={[Colors.primaryDeep, Colors.primaryDark]}
        style={styles.header}
      >
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarInitial}>
            {user?.name?.charAt(0).toUpperCase() ?? 'P'}
          </Text>
        </View>
        <Text style={styles.userName}>{user?.name ?? 'Usuario'}</Text>
        <Text style={styles.userEmail}>{user?.email ?? ''}</Text>

        <View style={styles.headerBadge}>
          <Ionicons name="shield-checkmark" size={14} color={Colors.primaryLight} />
          <Text style={styles.headerBadgeText}>Cuenta segura</Text>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Cuenta */}
        <Text style={styles.sectionTitle}>Cuenta</Text>
        <View style={styles.settingsGroup}>
          <SettingRow
            icon="cash-outline"
            label="Moneda principal"
            value={user?.main_currency ?? 'DOP'}
            onPress={onNavigateToCurrency}
          />
          <SettingRow
            icon="notifications-outline"
            label="Notificaciones"
            toggle
            toggleValue={notifications}
            onToggle={handleToggleNotifications}
          />
        </View>

        {/* Privacidad */}
        <Text style={styles.sectionTitle}>Privacidad y seguridad</Text>
        <View style={styles.settingsGroup}>
          <SettingRow
            icon="shield-outline"
            label="Privacidad y seguridad"
            onPress={onNavigateToPrivacy}
          />
          <SettingRow
            icon="download-outline"
            label="Exportar mis datos"
            onPress={async () => {
              await accountService.exportUserData();
            }}
          />
        </View>

        {/* Información */}
        <Text style={styles.sectionTitle}>Información</Text>
        <View style={styles.settingsGroup}>
          <SettingRow
            icon="document-text-outline"
            label="Política de privacidad"
            onPress={() => {}}
          />
          <SettingRow
            icon="reader-outline"
            label="Términos de uso"
            onPress={() => {}}
          />
          <SettingRow
            icon="information-circle-outline"
            label="Versión"
            value="1.0.0"
          />
        </View>

        {/* Sesión */}
        <View style={styles.settingsGroup}>
          <SettingRow
            icon="log-out-outline"
            label="Cerrar sesión"
            onPress={handleLogout}
            danger
          />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.backgroundMain },
  header: {
    paddingTop: 60,
    paddingBottom: 32,
    alignItems: 'center',
    gap: Spacing[2],
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing[2],
  },
  avatarInitial: {
    fontFamily: FontFamily.soraBold,
    fontSize: FontSize['3xl'],
    color: Colors.white,
  },
  userName: {
    fontFamily: FontFamily.soraSemiBold,
    fontSize: FontSize.xl,
    color: Colors.white,
  },
  userEmail: {
    fontFamily: FontFamily.dmSansRegular,
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.7)',
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    marginTop: Spacing[2],
  },
  headerBadgeText: {
    fontFamily: FontFamily.dmSansMedium,
    fontSize: FontSize.xs,
    color: Colors.primaryLight,
  },
  scroll: { flex: 1 },
  content: { padding: Spacing.screenHorizontal, paddingTop: Spacing[5] },
  sectionTitle: {
    fontFamily: FontFamily.dmSansSemiBold,
    fontSize: FontSize.sm,
    color: Colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing[2],
    marginTop: Spacing[4],
  },
  settingsGroup: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.card,
    overflow: 'hidden',
    ...Shadows.sm,
    marginBottom: Spacing[2],
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing[4],
    gap: Spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  settingRowPressed: { backgroundColor: Colors.backgroundMain },
  settingIconBg: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingIconBgDanger: { backgroundColor: Colors.dangerLight },
  settingLabel: {
    flex: 1,
    fontFamily: FontFamily.dmSansRegular,
    fontSize: FontSize.base,
    color: Colors.textDark,
  },
  settingLabelDanger: { color: Colors.danger },
  settingRight: { flexDirection: 'row', alignItems: 'center', gap: Spacing[2] },
  settingValue: {
    fontFamily: FontFamily.dmSansMedium,
    fontSize: FontSize.sm,
    color: Colors.textLight,
  },
});
