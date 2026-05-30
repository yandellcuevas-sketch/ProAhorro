import React, { useState, forwardRef } from 'react';
import {
  View,
  TextInput,
  Text,
  Pressable,
  TextInputProps,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { S, Theme } from '../../theme/style';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: keyof typeof MaterialCommunityIcons.glyphMap;
  rightIcon?: keyof typeof MaterialCommunityIcons.glyphMap;
  onRightIconPress?: () => void;
  isPassword?: boolean;
}

export const Input = forwardRef<TextInput, InputProps>((
  {
    label,
    error,
    hint,
    leftIcon,
    rightIcon,
    onRightIconPress,
    isPassword = false,
    value,
    ...props
  },
  ref,
) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const hasError = !!error;

  const wrapStyle = hasError
    ? S.Forms.inputWrapError
    : isFocused
    ? S.Forms.inputWrapFocused
    : S.Forms.inputWrap;

  const iconColor = hasError
    ? Theme.color.danger
    : isFocused
    ? Theme.color.primary
    : Theme.color.textPlaceholder;

  return (
    <View style={S.Forms.group}>
      {label && <Text style={S.Typography.label}>{label}</Text>}

      <View style={wrapStyle}>
        {leftIcon && (
          <MaterialCommunityIcons
            name={leftIcon}
            size={19}
            color={iconColor}
          />
        )}

        <TextInput
          ref={ref}
          style={S.Forms.input}
          placeholderTextColor={Theme.color.textPlaceholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={isPassword && !showPassword}
          value={value}
          {...props}
        />

        {isPassword && (
          <Pressable
            onPress={() => setShowPassword(!showPassword)}
            hitSlop={8}
          >
            <MaterialCommunityIcons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={19}
              color={Theme.color.textPlaceholder}
            />
          </Pressable>
        )}

        {rightIcon && !isPassword && (
          <Pressable onPress={onRightIconPress} hitSlop={8}>
            <MaterialCommunityIcons name={rightIcon} size={19} color={Theme.color.textPlaceholder} />
          </Pressable>
        )}
      </View>

      {hasError && (
        <View style={S.Layout.row}>
          <MaterialCommunityIcons name="alert-circle-outline" size={13} color={Theme.color.danger} />
          <Text style={[S.Forms.errorText, { marginTop: 0, marginLeft: 4 }]}>{error}</Text>
        </View>
      )}

      {hint && !hasError && (
        <Text style={S.Forms.helperText}>{hint}</Text>
      )}
    </View>
  );
});

Input.displayName = 'Input';
