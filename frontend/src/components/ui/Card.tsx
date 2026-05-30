import React from 'react';
import { View, ViewProps } from 'react-native';
import { S, Theme } from '../../theme/style';

interface CardProps extends ViewProps {
  variant?: 'base' | 'padded' | 'paddedLg' | 'goal' | 'stat' | 'listSection' | 'danger';
  padding?: number;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'padded',
  padding,
  noPadding = false,
  style,
  ...props
}) => {
  const variantStyle = {
    base: S.Cards.base,
    padded: S.Cards.basePad,
    paddedLg: S.Cards.basePadLg,
    goal: S.Cards.goal,
    stat: S.Cards.stat,
    listSection: S.Cards.listSection,
    danger: S.Cards.danger,
  }[variant];

  return (
    <View
      style={[
        variantStyle,
        noPadding && { padding: 0 },
        padding !== undefined && { padding },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};
