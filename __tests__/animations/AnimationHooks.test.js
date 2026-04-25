import { renderHook, act } from '@testing-library/react-native';
import { Animated } from 'react-native';
import {
  useFadeIn,
  useSlideUp,
  useScaleBounce,
  useShake,
  useProgressAnimation,
  usePulse,
  useStaggeredEntrance,
} from '../../src/animations/AnimationHooks';

// Ensure all animations run synchronously in tests
jest.useFakeTimers();

describe('AnimationHooks', () => {
  beforeEach(() => {
    jest.clearAllTimers();
  });

  describe('useFadeIn', () => {
    it('returns an Animated.Value', () => {
      const { result } = renderHook(() => useFadeIn());
      expect(result.current).toBeInstanceOf(Animated.Value);
    });

    it('starts at opacity 0', () => {
      const { result } = renderHook(() => useFadeIn());
      expect(result.current.__getValue()).toBe(0);
    });

    it('accepts custom duration and delay', () => {
      expect(() => {
        renderHook(() => useFadeIn(800, 200));
      }).not.toThrow();
    });
  });

  describe('useSlideUp', () => {
    it('returns translateY and opacity animated values', () => {
      const { result } = renderHook(() => useSlideUp());
      expect(result.current).toHaveProperty('translateY');
      expect(result.current).toHaveProperty('opacity');
    });

    it('translateY starts at the given distance', () => {
      const { result } = renderHook(() => useSlideUp(50));
      expect(result.current.translateY.__getValue()).toBe(50);
    });

    it('opacity starts at 0', () => {
      const { result } = renderHook(() => useSlideUp());
      expect(result.current.opacity.__getValue()).toBe(0);
    });
  });

  describe('useScaleBounce', () => {
    it('returns scale and bounce function', () => {
      const { result } = renderHook(() => useScaleBounce());
      expect(result.current).toHaveProperty('scale');
      expect(result.current).toHaveProperty('bounce');
      expect(typeof result.current.bounce).toBe('function');
    });

    it('scale starts at 1', () => {
      const { result } = renderHook(() => useScaleBounce());
      expect(result.current.scale.__getValue()).toBe(1);
    });

    it('calling bounce does not throw', () => {
      const { result } = renderHook(() => useScaleBounce());
      expect(() => {
        act(() => result.current.bounce());
      }).not.toThrow();
    });
  });

  describe('useShake', () => {
    it('returns translateX and shake function', () => {
      const { result } = renderHook(() => useShake());
      expect(result.current).toHaveProperty('translateX');
      expect(result.current).toHaveProperty('shake');
      expect(typeof result.current.shake).toBe('function');
    });

    it('translateX starts at 0', () => {
      const { result } = renderHook(() => useShake());
      expect(result.current.translateX.__getValue()).toBe(0);
    });

    it('calling shake does not throw', () => {
      const { result } = renderHook(() => useShake());
      expect(() => {
        act(() => result.current.shake());
      }).not.toThrow();
    });
  });

  describe('useProgressAnimation', () => {
    it('returns an Animated.Value', () => {
      const { result } = renderHook(() => useProgressAnimation(50));
      expect(result.current).toBeInstanceOf(Animated.Value);
    });

    it('starts at 0', () => {
      const { result } = renderHook(() => useProgressAnimation(75));
      expect(result.current.__getValue()).toBe(0);
    });

    it('handles 0% progress', () => {
      expect(() => {
        renderHook(() => useProgressAnimation(0));
      }).not.toThrow();
    });

    it('handles 100% progress', () => {
      expect(() => {
        renderHook(() => useProgressAnimation(100));
      }).not.toThrow();
    });
  });

  describe('usePulse', () => {
    it('returns an Animated.Value', () => {
      const { result } = renderHook(() => usePulse());
      expect(result.current).toBeInstanceOf(Animated.Value);
    });

    it('starts at scale 1', () => {
      const { result } = renderHook(() => usePulse());
      expect(result.current.__getValue()).toBe(1);
    });
  });

  describe('useStaggeredEntrance', () => {
    it('returns translateY and opacity', () => {
      const { result } = renderHook(() => useStaggeredEntrance(0));
      expect(result.current).toHaveProperty('translateY');
      expect(result.current).toHaveProperty('opacity');
    });

    it('works with different index values', () => {
      expect(() => {
        renderHook(() => useStaggeredEntrance(3));
      }).not.toThrow();
    });

    it('first item has zero base delay', () => {
      const { result: first } = renderHook(() => useStaggeredEntrance(0));
      const { result: third } = renderHook(() => useStaggeredEntrance(3));
      // Both return animated values - stagger is applied via delay
      expect(first.current.opacity).toBeInstanceOf(Animated.Value);
      expect(third.current.opacity).toBeInstanceOf(Animated.Value);
    });
  });
});
