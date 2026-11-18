import { useRouter } from 'expo-router';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import EmptyState from '@/components/EmptyState';
import StatusPill from '@/components/StatusPill';
import { useOrders } from '@/context/OrdersContext';
import { ORDER_STEPS } from '@/data/orderStatus';
import { colors, radius, shadows, spacing, type } from '@/theme';
import { formatClock, formatDate, formatPKR } from '@/utils/format';

function OrderCard({ order, onPress }) {
  const active = order.statusIndex < ORDER_STEPS.length - 1;
  const itemCount = order.items.reduce((sum, item) => sum + item.qty, 0);
  const nextStep = ORDER_STEPS[Math.min(order.statusIndex + 1, 4)];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.pressed,
      ]}
      accessibilityRole="button"
    >
      <View style={styles.cardTop}>
        <View style={styles.iconCircle}>
          <Ionicons
            name={active ? 'bicycle' : 'checkmark-circle'}
            size={20}
            color={colors.primary}
          />
        </View>
        <View style={styles.cardCopy}>
          <Text style={styles.restaurantName}>{order.restaurantName}</Text>
          <Text style={styles.meta}>
            {formatDate(order.placedAt)} at {formatClock(order.placedAt)} -{' '}
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </Text>
        </View>
        <StatusPill statusIndex={order.statusIndex} />
      </View>

      {active ? (
        <View style={styles.progressBox}>
          <Ionicons
            name="time-outline"
            size={13}
            color={colors.primary}
          />
          <Text style={styles.progressText}>
            Next: {nextStep.title} - arriving in about {order.eta} min
          </Text>
        </View>
      ) : null}

      <View style={styles.cardBottom}>
        <View>
          <Text style={styles.totalLabel}>Order total</Text>
          <Text style={styles.total}>{formatPKR(order.totals.total)}</Text>
        </View>
        <View style={styles.detailsButton}>
          <Text style={styles.detailsText}>
            {active ? 'Track order' : 'View details'}
          </Text>
          <Ionicons
            name="chevron-forward"
            size={14}
            color={colors.primary}
          />
        </View>
      </View>
    </Pressable>
  );
}

export default function OrdersScreen() {
  const router = useRouter();
  const { orders } = useOrders();
  const ongoing = orders.filter(
    (order) => order.statusIndex < ORDER_STEPS.length - 1
  );
  const past = orders.filter(
    (order) => order.statusIndex >= ORDER_STEPS.length - 1
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Your orders</Text>
        <Text style={styles.subtitle}>
          {orders.length
            ? `${orders.length} total ${
                orders.length === 1 ? 'order' : 'orders'
              }`
            : 'Track live orders and revisit past meals'}
        </Text>
      </View>

      {orders.length === 0 ? (
        <EmptyState
          icon="receipt-outline"
          title="No orders yet"
          message="Your next meal is just a few taps away. Browse the restaurants around you."
          actionLabel="Browse restaurants"
          onAction={() => router.push('/')}
        />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {ongoing.length > 0 ? (
            <>
              <Text style={styles.sectionTitle}>Ongoing</Text>
              {ongoing.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onPress={() => router.push(`/tracking/${order.id}`)}
                />
              ))}
            </>
          ) : null}

          {past.length > 0 ? (
            <>
              <Text style={styles.sectionTitle}>Past orders</Text>
              {past.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onPress={() => router.push(`/tracking/${order.id}`)}
                />
              ))}
            </>
          ) : null}
          <View style={styles.bottomSpace} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  title: {
    ...type.h1,
    fontSize: 24,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textMuted,
    marginTop: 2,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.subtle,
  },
  pressed: {
    opacity: 0.92,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardCopy: {
    flex: 1,
    gap: 2,
  },
  restaurantName: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
  },
  meta: {
    fontSize: 10.5,
    fontWeight: '500',
    color: colors.textMuted,
  },
  progressBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.pinkSoft,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    marginTop: spacing.md,
  },
  progressText: {
    flex: 1,
    fontSize: 10.5,
    fontWeight: '600',
    color: colors.primaryDark,
  },
  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalLabel: {
    fontSize: 9.5,
    fontWeight: '600',
    color: colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  total: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
    marginTop: 1,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  detailsText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
  },
  bottomSpace: {
    height: spacing.xxxl,
  },
});
