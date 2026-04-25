import React, { useRef } from 'react';
import { Animated, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../constants';

const CustomButton = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 6,
    }).start();
  };

  const variantStyles = {
    primary: {
      backgroundColor: COLORS.primary,
      borderColor: COLORS.primary,
    },
    secondary: {
      backgroundColor: COLORS.secondary,
      borderColor: COLORS.secondary,
    },
    danger: {
      backgroundColor: COLORS.danger,
      borderColor: COLORS.danger,
    },
    outline: {
      backgroundColor: 'transparent',
      borderColor: COLORS.primary,
      borderWidth: 2,
    },
    ghost: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
    },
  };

  const sizeStyles = {
    small: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 10 },
    medium: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12 },
    large: { paddingVertical: 16, paddingHorizontal: 32, borderRadius: 14 },
  };

  const textColor = variant === 'outline' || variant === 'ghost'
    ? COLORS.primary
    : COLORS.white;

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={1}
        style={[
          styles.base,
          variantStyles[variant],
          sizeStyles[size],
          disabled && styles.disabled,
          SHADOWS.small,
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator size="small" color={textColor} />
        ) : (
          <Text style={[styles.text, { color: textColor }, textStyle]}>
            {title}
          </Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  text: {
    fontSize: SIZES.medium,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  disabled: {
    opacity: 0.5,
  },
});

export default CustomButton;
