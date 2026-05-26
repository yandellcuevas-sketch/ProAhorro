import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontFamily, FontSize, BorderRadius, Spacing } from '../../theme';

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'wallet-outline',
  title,
  subtitle,
  actionLabel,
  onAction,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={48} color={Colors.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {actionLabel && onAction && (
        <Pressable style={styles.action} onPress={onAction}>
          <Text style={styles.actionLabel}>{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: Spacing[12],
    paddingHorizontal: Spacing[8],
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing[5],
  },
  title: {
    fontFamily: FontFamily.dmSansSemiBold,
    fontSize: FontSize.lg,
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: Spacing[2],
  },
  subtitle: {
    fontFamily: FontFamily.dmSansRegular,
    fontSize: FontSize.base,
    color: Colors.textMedium,
    textAlign: 'center',
    lineHeight: FontSize.base * 1.5,
  },
  action: {
    marginTop: Spacing[5],
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[6],
    backgroundColor: Colors.primaryLight,
    borderRadius: BorderRadius.button,
  },
  actionLabel: {
    fontFamily: FontFamily.dmSansSemiBold,
    fontSize: FontSize.base,
    color: Colors.primary,
  },
});
