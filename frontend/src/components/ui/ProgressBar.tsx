import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { S, Theme } from '../../theme/style';

interface ProgressBarProps {
  progress: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  size = 'md',
  color = Theme.color.primary,
}) => {
  const clampedProgress = Math.min(100, Math.max(0, progress));
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: clampedProgress / 100,
      duration: 900,
      useNativeDriver: false,
    }).start();
  }, [clampedProgress]);

  const trackStyle = {
    sm: S.Progress.trackSm,
    md: S.Progress.trackMd,
    lg: S.Progress.trackLg,
  }[size];

  return (
    <View style={trackStyle}>
      <Animated.View
        style={[
          S.Progress.fill,
          {
            backgroundColor: color,
            width: progressAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            }),
          },
        ]}
      />
    </View>
  );
};
