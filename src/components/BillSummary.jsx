import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, shadows, spacing } from '@/theme';
import { formatPKR } from '@/utils/format';

export default function BillSummary({
  subtotal,
  discount = 0,
  deliveryFee = 0,
  total,
  style,
}) {
  return (
    <View style={[styles.card, style]}>
      <Text style={styles.title}>Bill details</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Subtotal</Text>
        <Text style={styles.value}>{formatPKR(subtotal)}</Text>
      </View>
      {discount > 0 ? (
        <View style={styles.row}>
          <Text style={[styles.label, styles.discountLabel]}>Discount</Text>
          <Text style={[styles.value, styles.discountValue]}>
            - {formatPKR(discount)}
          </Text>
        </View>
      ) : null}
      <View style={styles.row}>
        <Text style={styles.label}>Delivery fee</Text>
        <Text
          style={[
            styles.value,
            deliveryFee === 0 && styles.freeValue,
          ]}
        >
          {deliveryFee === 0 ? 'Free' : formatPKR(deliveryFee)}
        </Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.row}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>{formatPKR(total)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    ...shadows.subtle,
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  label: {
    fontSize: 12.5,
    fontWeight: '500',
    color: colors.textMuted,
  },
  value: {
    fontSize: 12.5,
    fontWeight: '600',
    color: colors.text,
  },
  discountLabel: {
    color: colors.success,
    fontWeight: '600',
  },
  discountValue: {
    color: colors.success,
    fontWeight: '700',
  },
  freeValue: {
    color: colors.success,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
});
