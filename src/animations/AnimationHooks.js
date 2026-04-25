import { useRef, useEffect } from 'react';
import { Animated, Easing } from 'react-native';

// Fade in animation hook
export const useFadeIn = (duration = 600, delay = 0) => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration,
      delay,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, []);

  return opacity;
};

// Slide up animation hook
export const useSlideUp = (distance = 40, duration = 500, delay = 0) => {
  const translateY = useRef(new Animated.Value(distance)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        delay,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return { translateY, opacity };
};

// Scale bounce animation hook (for task completion)
export const useScaleBounce = () => {
  const scale = useRef(new Animated.Value(1)).current;

  const bounce = () => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.15,
        duration: 120,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return { scale, bounce };
};

// Shake animation (for delete confirmation feedback)
export const useShake = () => {
  const translateX = useRef(new Animated.Value(0)).current;

  const shake = () => {
    Animated.sequence([
      Animated.timing(translateX, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(translateX, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(translateX, { toValue: -6, duration: 60, useNativeDriver: true }),
      Animated.timing(translateX, { toValue: 6, duration: 60, useNativeDriver: true }),
      Animated.timing(translateX, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  return { translateX, shake };
};

// Progress bar animation hook
export const useProgressAnimation = (targetValue, duration = 800) => {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: targetValue,
      duration,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();
  }, [targetValue]);

  return progress;
};

// Pulse animation for motivational banner
export const usePulse = () => {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.03,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  return scale;
};

// Staggered list item entrance animation
export const useStaggeredEntrance = (index, baseDelay = 80) => {
  const { translateY, opacity } = useSlideUp(30, 400, index * baseDelay);
  return { translateY, opacity };
};
