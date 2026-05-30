import React from 'react';
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  PressableProps,
  Animated,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { S, Theme } from '../../theme/style';

type ButtonVariant = 'primary' | 'primaryLg' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'dangerGhost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends PressableProps {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  iconRight?: keyof typeof MaterialCommunityIcons.glyphMap;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = true,
  icon,
  iconRight,
  disabled,
  onPress,
  style,
  ...props
}) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true, speed: 50 }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 50 }).start();
  };

  const handlePress = (e: any) => {
    onPress?.(e);
  };

  const isDisabled = disabled || loading;

  const containerStyle = {
    primary: S.Buttons.primary,
    primaryLg: S.Buttons.primaryLg,
    secondary: S.Buttons.secondary,
    outline: S.Buttons.outline,
    ghost: S.Buttons.ghost,
    danger: S.Buttons.danger,
    dangerGhost: S.Buttons.dangerGhost,
  }[variant];

  const textStyle = {
    primary: S.Buttons.primaryText,
    primaryLg: S.Buttons.primaryText,
    secondary: S.Buttons.secondaryText,
    outline: S.Buttons.outlineText,
    ghost: S.Buttons.ghostText,
    danger: S.Buttons.dangerText,
    dangerGhost: S.Buttons.dangerGhostText,
  }[variant];

  const iconColor = {
    primary: Theme.color.white,
    primaryLg: Theme.color.white,
    secondary: Theme.color.primaryDark,
    outline: Theme.color.primary,
    ghost: Theme.color.textDark,
    danger: Theme.color.white,
    dangerGhost: Theme.color.danger,
  }[variant];

  const sizeOverride =
    size === 'sm' ? { paddingVertical: 10, paddingHorizontal: 16 } :
    size === 'lg' ? { paddingVertical: 18, paddingHorizontal: 32 } :
    undefined;

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, fullWidth && { width: '100%' }]}>
      <Pressable
        {...props}
        style={({ pressed }) => [
          containerStyle,
          sizeOverride,
          isDisabled && S.Buttons.disabled,
          typeof style === 'function' ? style({ pressed }) : style,
        ]}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isDisabled}
      >
        {loading ? (
          <ActivityIndicator
            color={variant === 'outline' || variant === 'ghost' || variant === 'dangerGhost'
              ? Theme.color.primary
              : Theme.color.white}
            size="small"
          />
        ) : (
          <>
            {icon && (
              <MaterialCommunityIcons name={icon} size={size === 'sm' ? 16 : 20} color={iconColor} />
            )}
            <Text style={textStyle}>{label}</Text>
            {iconRight && (
              <MaterialCommunityIcons name={iconRight} size={size === 'sm' ? 16 : 20} color={iconColor} />
            )}
          </>
        )}
      </Pressable>
    </Animated.View>
  );
};
