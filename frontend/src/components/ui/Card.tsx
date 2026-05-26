import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { Colors, BorderRadius, Shadows, Spacing } from '../../theme';

interface CardProps extends ViewProps {
  variant?: 'white' | 'green' | 'soft';
  padding?: number;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'white',
  padding = Spacing.cardPadding,
  noPadding = false,
  style,
  ...props
}) => {
  return (
    <View
      style={[
        styles.base,
        styles[variant],
        !noPadding && { padding },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: BorderRadius.card,
    overflow: 'hidden',
  },
  white: {
    backgroundColor: Colors.white,
    ...Shadows.md,
  },
  green: {
    backgroundColor: Colors.primaryDark,
    ...Shadows.hero,
  },
  soft: {
    backgroundColor: Colors.primarySoft,
    borderWidth: 1,
    borderColor: Colors.primaryLight,
  },
});
