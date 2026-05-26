import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius, Shadows } from '../../theme';

interface PrivacySecurityScreenProps {
  onNavigateToDeleteAccount: () => void;
  onBack: () => void;
}

const MenuItem: React.FC<{
  icon: string;
  title: string;
  subtitle: string;
  onPress?: () => void;
  danger?: boolean;
}> = ({ icon, title, subtitle, onPress, danger }) => (
  <Pressable
    style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
    onPress={onPress}
  >
    <View style={[styles.menuIcon, danger && styles.menuIconDanger]}>
      <Ionicons name={icon as any} size={22} color={danger ? Colors.danger : Colors.primary} />
    </View>
    <View style={styles.menuInfo}>
      <Text style={[styles.menuTitle, danger && styles.menuTitleDanger]}>{title}</Text>
      <Text style={styles.menuSubtitle}>{subtitle}</Text>
    </View>
    <Ionicons name="chevron-forward" size={18} color={Colors.textLight} />
  </Pressable>
);

export const PrivacySecurityScreen: React.FC<PrivacySecurityScreenProps> = ({
  onNavigateToDeleteAccount,
  onBack,
}) => {
  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={[Colors.primaryDeep, Colors.primaryDark]}
        style={styles.header}
      >
        <Pressable style={styles.backBtn} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </Pressable>
        <Text style={styles.headerTitle}>Privacidad y seguridad</Text>
        <Text style={styles.headerSubtitle}>Controla tus datos y acceso</Text>
      </LinearGradient>

      <View style={styles.content}>
        <Text style={styles.sectionLabel}>Acceso</Text>
        <View style={styles.group}>
          <MenuItem
            icon="finger-print-outline"
            title="Face ID / Biometría"
            subtitle="Protege el acceso con tu huella o cara"
          />
          <MenuItem
            icon="keypad-outline"
            title="PIN de seguridad"
            subtitle="Código de 4 dígitos para entrar a la app"
          />
        </View>

        <Text style={styles.sectionLabel}>Datos</Text>
        <View style={styles.group}>
          <MenuItem
            icon="download-outline"
            title="Exportar datos"
            subtitle="Descarga todos tus datos en formato JSON"
          />
          <MenuItem
            icon="document-text-outline"
            title="Política de privacidad"
            subtitle="Cómo usamos y protegemos tus datos"
          />
        </View>

        <Text style={styles.sectionLabel}>Cuenta</Text>
        <View style={styles.group}>
          <MenuItem
            icon="trash-outline"
            title="Eliminar cuenta"
            subtitle="Borra permanentemente tu cuenta y todos tus datos"
            onPress={onNavigateToDeleteAccount}
            danger
          />
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="shield-checkmark" size={20} color={Colors.primary} />
          <Text style={styles.infoText}>
            Tus datos se almacenan de forma segura y encriptada. Solo tú tienes acceso a tu información.
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.backgroundMain },
  header: {
    paddingTop: 60,
    paddingBottom: 28,
    paddingHorizontal: Spacing.screenHorizontal,
    gap: 4,
  },
  backBtn: { marginBottom: Spacing[3] },
  headerTitle: {
    fontFamily: FontFamily.soraBold,
    fontSize: FontSize.xl,
    color: Colors.white,
  },
  headerSubtitle: {
    fontFamily: FontFamily.dmSansRegular,
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.7)',
  },
  content: { padding: Spacing.screenHorizontal, paddingTop: Spacing[5] },
  sectionLabel: {
    fontFamily: FontFamily.dmSansSemiBold,
    fontSize: FontSize.xs,
    color: Colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing[2],
    marginTop: Spacing[4],
  },
  group: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.card,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing[4],
    gap: Spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  menuItemPressed: { backgroundColor: Colors.backgroundMain },
  menuIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIconDanger: { backgroundColor: Colors.dangerLight },
  menuInfo: { flex: 1 },
  menuTitle: {
    fontFamily: FontFamily.dmSansMedium,
    fontSize: FontSize.base,
    color: Colors.textDark,
  },
  menuTitleDanger: { color: Colors.danger },
  menuSubtitle: {
    fontFamily: FontFamily.dmSansRegular,
    fontSize: FontSize.xs,
    color: Colors.textLight,
    marginTop: 2,
  },
  infoBox: {
    flexDirection: 'row',
    gap: Spacing[3],
    backgroundColor: Colors.primarySoft,
    borderRadius: BorderRadius.md,
    padding: Spacing[4],
    marginTop: Spacing[6],
    borderWidth: 1,
    borderColor: Colors.primaryLight,
  },
  infoText: {
    flex: 1,
    fontFamily: FontFamily.dmSansRegular,
    fontSize: FontSize.sm,
    color: Colors.primaryDeep,
    lineHeight: FontSize.sm * 1.5,
  },
});
