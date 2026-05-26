import React, { useEffect } from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  PressableProps,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Colors, FontFamily, FontSize, BorderRadius, Shadows } from '../../theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends PressableProps {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Button: React.FC<ButtonProps> = ({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = true,
  icon,
  disabled,
  onPress,
  ...props
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15 });
  };
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  const isDisabled = disabled || loading;

  return (
    <AnimatedPressable
      style={[
        styles.base,
        styles[`size_${size}`],
        styles[`variant_${variant}`],
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        variant === 'primary' && Shadows.button,
        variant === 'danger' && Shadows.buttonDanger,
        animatedStyle,
      ]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'ghost' ? Colors.primary : Colors.white}
          size="small"
        />
      ) : (
        <>
          {icon && icon}
          <Text style={[styles.label, styles[`label_${variant}`], styles[`labelSize_${size}`]]}>
            {label}
          </Text>
        </>
      )}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: BorderRadius.button,
  },
  fullWidth: { width: '100%' },
  disabled: { opacity: 0.5 },

  // Sizes
  size_sm: { height: 40, paddingHorizontal: 16 },
  size_md: { height: 52, paddingHorizontal: 24 },
  size_lg: { height: 60, paddingHorizontal: 32 },

  // Variants
  variant_primary: { backgroundColor: Colors.primary },
  variant_secondary: { backgroundColor: Colors.primaryDark },
  variant_outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  variant_danger: { backgroundColor: Colors.danger },
  variant_ghost: { backgroundColor: 'transparent' },

  // Labels
  label: { fontFamily: FontFamily.dmSansSemiBold },
  label_primary: { color: Colors.white },
  label_secondary: { color: Colors.white },
  label_outline: { color: Colors.primary },
  label_danger: { color: Colors.white },
  label_ghost: { color: Colors.primary },

  labelSize_sm: { fontSize: FontSize.sm },
  labelSize_md: { fontSize: FontSize.base },
  labelSize_lg: { fontSize: FontSize.md },
});
