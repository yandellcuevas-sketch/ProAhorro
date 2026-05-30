import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { S, Theme } from '../../theme/style';

interface EmptyStateProps {
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'piggy-bank-outline',
  title,
  subtitle,
  actionLabel,
  onAction,
}) => {
  return (
    <View style={S.Empty.container}>
      <View style={[S.IconWrap.xl, { marginBottom: Theme.space.md, opacity: 0.55 }]}>
        <MaterialCommunityIcons
          name={icon}
          size={32}
          color={Theme.color.primary}
        />
      </View>
      <Text style={S.Empty.title}>{title}</Text>
      {subtitle && <Text style={S.Empty.description}>{subtitle}</Text>}
      {actionLabel && onAction && (
        <Pressable style={S.Buttons.secondary} onPress={onAction}>
          <Text style={S.Buttons.secondaryText}>{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
};
