import React, { useState, forwardRef } from 'react';
import {
  View,
  TextInput,
  Text,
  Pressable,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontFamily, FontSize, BorderRadius, Spacing, Shadows } from '../../theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  isPassword?: boolean;
}

export const Input = forwardRef<TextInput, InputProps>(({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  onRightIconPress,
  isPassword = false,
  value,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const hasError = !!error;

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[
          styles.inputWrapper,
          isFocused && styles.inputWrapperFocused,
          hasError && styles.inputWrapperError,
        ]}
      >
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={20}
            color={hasError ? Colors.danger : isFocused ? Colors.primary : Colors.textLight}
            style={styles.leftIcon}
          />
        )}

        <TextInput
          ref={ref}
          style={[
            styles.input,
            leftIcon ? styles.inputWithLeft : null,
            (rightIcon || isPassword) ? styles.inputWithRight : null,
          ]}
          placeholderTextColor={Colors.textLight}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={isPassword && !showPassword}
          value={value}
          {...props}
        />

        {isPassword && (
          <Pressable
            onPress={() => setShowPassword(!showPassword)}
            style={styles.rightIconBtn}
            hitSlop={8}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={Colors.textLight}
            />
          </Pressable>
        )}

        {rightIcon && !isPassword && (
          <Pressable
            onPress={onRightIconPress}
            style={styles.rightIconBtn}
            hitSlop={8}
          >
            <Ionicons name={rightIcon} size={20} color={Colors.textLight} />
          </Pressable>
        )}
      </View>

      {hasError && (
        <View style={styles.errorRow}>
          <Ionicons name="alert-circle-outline" size={14} color={Colors.danger} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {hint && !hasError && (
        <Text style={styles.hintText}>{hint}</Text>
      )}
    </View>
  );
});

Input.displayName = 'Input';

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing[4],
  },
  label: {
    fontFamily: FontFamily.dmSansMedium,
    fontSize: FontSize.sm,
    color: Colors.textDark,
    marginBottom: Spacing[2],
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: Spacing.inputHeight,
    backgroundColor: Colors.backgroundInput,
    borderRadius: BorderRadius.input,
    borderWidth: 1.5,
    borderColor: Colors.border,
    ...Shadows.xs,
  },
  inputWrapperFocused: {
    borderColor: Colors.primary,
    backgroundColor: Colors.white,
  },
  inputWrapperError: {
    borderColor: Colors.danger,
    backgroundColor: Colors.dangerLight,
  },
  input: {
    flex: 1,
    fontFamily: FontFamily.dmSansRegular,
    fontSize: FontSize.base,
    color: Colors.textDark,
    paddingHorizontal: Spacing[4],
    height: '100%',
  },
  inputWithLeft: { paddingLeft: 8 },
  inputWithRight: { paddingRight: 8 },
  leftIcon: { marginLeft: Spacing[3] },
  rightIconBtn: { paddingHorizontal: Spacing[3] },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: Spacing[1],
  },
  errorText: {
    fontFamily: FontFamily.dmSansRegular,
    fontSize: FontSize.xs,
    color: Colors.danger,
    flex: 1,
  },
  hintText: {
    fontFamily: FontFamily.dmSansRegular,
    fontSize: FontSize.xs,
    color: Colors.textLight,
    marginTop: Spacing[1],
  },
});
