import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, shadows, spacing } from '@/theme';
import { formatPKR, pluralize } from '@/utils/format';

export default function CartBar({ count, total, onPress, style }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.bar,
        pressed && styles.pressed,
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`View cart, ${count} ${pluralize(
        count,
        'item'
      )}, ${formatPKR(total)}`}
    >
      <View style={styles.left}>
        <View style={styles.countBubble}>
          <Text style={styles.countText}>{count}</Text>
        </View>
        <View>
          <Text style={styles.items}>
            {count} {pluralize(count, 'item')}
          </Text>
          <Text style={styles.total}>{formatPKR(total)}</Text>
        </View>
      </View>
      <View style={styles.cta}>
        <Text style={styles.ctaText}>View cart</Text>
        <Ionicons name="cart" size={16} color={colors.primary} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primary,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    ...shadows.floating,
  },
  pressed: {
    opacity: 0.92,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  countBubble: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '800',
  },
  items: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 11,
    fontWeight: '600',
  },
  total: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '800',
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: radius.pill,
  },
  ctaText: {
    color: colors.primary,
    fontSize: 12.5,
    fontWeight: '800',
  },
});
