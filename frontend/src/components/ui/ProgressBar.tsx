import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontFamily, FontSize, BorderRadius, Spacing } from '../../theme';

interface ProgressBarProps {
  progress: number; // 0-100
  label?: string;
  showPercentage?: boolean;
  height?: number;
  color?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  label,
  showPercentage = true,
  height = 8,
  color = Colors.primary,
}) => {
  const clampedProgress = Math.min(100, Math.max(0, progress));
  const isComplete = clampedProgress >= 100;

  return (
    <View style={styles.container}>
      {(label || showPercentage) && (
        <View style={styles.header}>
          {label && <Text style={styles.label}>{label}</Text>}
          {showPercentage && (
            <Text style={[styles.percentage, isComplete && styles.percentageComplete]}>
              {Math.round(clampedProgress)}%
            </Text>
          )}
        </View>
      )}

      <View style={[styles.track, { height }]}>
        <View
          style={[
            styles.fill,
            {
              width: `${clampedProgress}%`,
              backgroundColor: isComplete ? Colors.primary : color,
              height,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { gap: Spacing[2] },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontFamily: FontFamily.dmSansRegular,
    fontSize: FontSize.sm,
    color: Colors.textMedium,
  },
  percentage: {
    fontFamily: FontFamily.soraSemiBold,
    fontSize: FontSize.sm,
    color: Colors.primary,
  },
  percentageComplete: { color: Colors.primary },
  track: {
    backgroundColor: Colors.primaryLight,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: BorderRadius.full,
  },
});
