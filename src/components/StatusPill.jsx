import { StyleSheet, Text, View } from 'react-native';
import { ORDER_STEPS } from '@/data/orderStatus';
import { colors, radius } from '@/theme';

const SHORT_LABELS = [
  'Order placed',
  'Confirmed',
  'Preparing',
  'On the way',
  'Delivered',
];

export default function StatusPill({ statusIndex }) {
  const delivered = statusIndex >= ORDER_STEPS.length - 1;
  const label = SHORT_LABELS[statusIndex] || 'Placed';

  return (
    <View style={[styles.pill, delivered ? styles.delivered : styles.active]}>
      <View
        style={[styles.dot, delivered ? styles.dotDelivered : styles.dotActive]}
      />
      <Text
        style={[
          styles.label,
          delivered ? styles.labelDelivered : styles.labelActive,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  active: {
    backgroundColor: colors.primaryLight,
  },
  delivered: {
    backgroundColor: colors.successLight,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    backgroundColor: colors.primary,
  },
  dotDelivered: {
    backgroundColor: colors.success,
  },
  label: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  labelActive: {
    color: colors.primary,
  },
  labelDelivered: {
    color: colors.success,
  },
});
