/* eslint-disable react-hooks/refs -- the scroll ref only travels to ScrollView props */
import { Ionicons } from '@expo/vector-icons';
import { useCallback, useRef, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { colors, spacing } from '@/theme';

const EDGE_SLOP = 4;
const PAGE_RATIO = 0.8;
const MIN_STEP = 240;

export function useCarousel() {
  const ref = useRef(null);
  const metrics = useRef({ x: 0, viewport: 0, content: 0 });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const sync = useCallback(() => {
    const { x, viewport, content } = metrics.current;
    const prev = x > EDGE_SLOP;
    const next =
      viewport > 0 && content > viewport + EDGE_SLOP
        ? x + viewport < content - EDGE_SLOP
        : false;
    setCanPrev((value) => (value === prev ? value : prev));
    setCanNext((value) => (value === next ? value : next));
  }, []);

  const onScroll = useCallback(
    (event) => {
      metrics.current.x = event.nativeEvent.contentOffset.x;
      sync();
    },
    [sync]
  );

  const onContentSizeChange = useCallback(
    (width) => {
      metrics.current.content = width;
      sync();
    },
    [sync]
  );

  const onLayout = useCallback(
    (event) => {
      metrics.current.viewport = event.nativeEvent.layout.width;
      sync();
    },
    [sync]
  );

  const scrollBy = useCallback(
    (direction) => {
      const { x, viewport, content } = metrics.current;
      const max = Math.max(content - viewport, 0);
      const step = Math.max(viewport * PAGE_RATIO, MIN_STEP);
      const target = Math.min(
        Math.max(direction > 0 ? x + step : x - step, 0),
        max
      );
      ref.current?.scrollTo({ x: target, y: 0, animated: true });
      metrics.current.x = target;
      sync();
    },
    [sync]
  );

  const scrollPrev = useCallback(() => scrollBy(-1), [scrollBy]);
  const scrollNext = useCallback(() => scrollBy(1), [scrollBy]);

  const attachScrollRef = useCallback((node) => {
    ref.current = node;
  }, []);

  return {
    attachScrollRef,
    canPrev,
    canNext,
    onScroll,
    onContentSizeChange,
    onLayout,
    scrollPrev,
    scrollNext,
  };
}

export function CarouselTrack({
  carousel,
  children,
  contentContainerStyle,
  style,
  testID,
}) {
  return (
    <View style={[styles.viewport, style]}>
      <ScrollView
        ref={carousel.attachScrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={carousel.onScroll}
        scrollEventThrottle={16}
        onContentSizeChange={carousel.onContentSizeChange}
        onLayout={carousel.onLayout}
        contentContainerStyle={[styles.track, contentContainerStyle]}
        testID={testID}
      >
        {children}
      </ScrollView>
    </View>
  );
}

function ArrowButton({ direction, disabled, onPress, label, testID }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={6}
      style={({ pressed }) => [
        styles.arrow,
        disabled && styles.arrowDisabled,
        pressed && !disabled && styles.arrowPressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`Scroll ${label} ${direction}`}
      accessibilityState={{ disabled }}
      testID={testID}
    >
      <Ionicons
        name={direction === 'left' ? 'chevron-back' : 'chevron-forward'}
        size={16}
        color={disabled ? colors.textLight : colors.primary}
      />
    </Pressable>
  );
}

export function CarouselArrows({ carousel, label, testIDPrefix }) {
  return (
    <View style={styles.arrows}>
      <ArrowButton
        direction="left"
        disabled={!carousel.canPrev}
        onPress={carousel.scrollPrev}
        label={label}
        testID={testIDPrefix ? `${testIDPrefix}-prev` : undefined}
      />
      <ArrowButton
        direction="right"
        disabled={!carousel.canNext}
        onPress={carousel.scrollNext}
        label={label}
        testID={testIDPrefix ? `${testIDPrefix}-next` : undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  viewport: {
    overflow: 'hidden',
  },
  track: {
    gap: spacing.md,
    paddingBottom: spacing.xs,
  },
  arrows: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  arrow: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.primaryLight,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowDisabled: {
    opacity: 0.35,
    backgroundColor: colors.surfaceAlt,
  },
  arrowPressed: {
    backgroundColor: colors.pinkSoft,
    transform: [{ scale: 0.94 }],
  },
});
