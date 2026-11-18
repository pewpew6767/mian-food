import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CarouselArrows } from '@/components/marketplace/Carousel';
import { colors, spacing } from '@/theme';

export default function MarketSectionHeader({
  title,
  subtitle,
  actionLabel,
  onAction,
  carousel,
  carouselId,
  style,
}) {
  return (
    <View style={[styles.wrap, style]}>
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      <View style={styles.controls}>
        {onAction && actionLabel ? (
          <Pressable
            onPress={onAction}
            style={({ pressed }) => [
              styles.action,
              pressed && styles.pressed,
            ]}
            accessibilityRole="button"
          >
            <Text style={styles.actionText}>{actionLabel}</Text>
            <Ionicons
              name="arrow-forward"
              size={13}
              color={colors.primary}
            />
          </Pressable>
        ) : null}
        {carousel ? (
          <CarouselArrows
            carousel={carousel}
            label={title}
            testIDPrefix={carouselId}
          />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  copy: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 12.5,
    fontWeight: '500',
    color: colors.textMuted,
    marginTop: 3,
    lineHeight: 18,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexShrink: 0,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.pinkSoft,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  pressed: {
    opacity: 0.75,
  },
  actionText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: colors.primary,
  },
});
