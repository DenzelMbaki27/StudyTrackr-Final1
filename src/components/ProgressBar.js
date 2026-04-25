import React from 'react';
import { Animated, View, Text, StyleSheet } from 'react-native';
import { useProgressAnimation } from '../animations/AnimationHooks';
import { COLORS, SIZES } from '../constants';

const ProgressBar = ({ completed, total, showLabel = true }) => {
  const percentage = total > 0 ? (completed / total) * 100 : 0;
  const animatedWidth = useProgressAnimation(percentage);

  const widthInterpolate = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  const colorInterpolate = animatedWidth.interpolate({
    inputRange: [0, 50, 100],
    outputRange: [COLORS.danger, COLORS.accent, COLORS.completedGreen],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.wrapper}>
      {showLabel && (
        <View style={styles.labelRow}>
          <Text style={styles.label}>Progress</Text>
          <Text style={styles.percentage}>{Math.round(percentage)}%</Text>
        </View>
      )}
      <View style={styles.track}>
        <Animated.View
          style={[
            styles.fill,
            {
              width: widthInterpolate,
              backgroundColor: colorInterpolate,
            },
          ]}
        />
      </View>
      {showLabel && (
        <Text style={styles.subLabel}>
          {completed} of {total} tasks completed
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    fontSize: SIZES.medium,
    color: COLORS.textMedium,
    fontWeight: '600',
  },
  percentage: {
    fontSize: SIZES.medium,
    color: COLORS.primary,
    fontWeight: '700',
  },
  track: {
    height: 12,
    backgroundColor: COLORS.border,
    borderRadius: 6,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 6,
  },
  subLabel: {
    fontSize: SIZES.small,
    color: COLORS.textLight,
    marginTop: 5,
    textAlign: 'center',
  },
});

export default ProgressBar;
