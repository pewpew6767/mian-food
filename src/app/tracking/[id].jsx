import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import BillSummary from '@/components/BillSummary';
import EmptyState from '@/components/EmptyState';
import OrderTimeline from '@/components/OrderTimeline';
import PrimaryButton from '@/components/PrimaryButton';
import ScreenHeader from '@/components/ScreenHeader';
import { useCart } from '@/context/CartContext';
import { useOrders } from '@/context/OrdersContext';
import { ORDER_STEPS } from '@/data/orderStatus';
import { getMenuItem, getRestaurant } from '@/data/restaurants';
import { colors, radius, shadows, spacing } from '@/theme';
import { formatClock, formatDate, formatPKR } from '@/utils/format';

function DetailRow({ icon, label, value, last = false }) {
  return (
    <View style={[styles.detailRow, !last && styles.detailBorder]}>
      <View style={styles.detailIcon}>
        <Ionicons name={icon} size={16} color={colors.primary} />
      </View>
      <View style={styles.detailCopy}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    </View>
  );
}

export default function TrackingScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { getOrder, hydrated } = useOrders();
  const { addItem } = useCart();
  const order = getOrder(id);

  if (!hydrated) {
    return (
      <SafeAreaView style={styles.screen} edges={['top']}>
        <ScreenHeader title="Track order" />
        <View style={styles.loading}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={styles.screen} edges={['top']}>
        <ScreenHeader title="Track order" />
        <EmptyState
          icon="receipt-outline"
          title="Order not found"
          message="We could not find this order on your device. It may have been placed on another device."
          actionLabel="Back to home"
          onAction={() => router.replace('/')}
        />
      </SafeAreaView>
    );
  }

  const restaurant = getRestaurant(order.restaurantId);
  const delivered = order.statusIndex >= ORDER_STEPS.length - 1;
  const currentStep = ORDER_STEPS[order.statusIndex];
  const itemCount = order.items.reduce((sum, line) => sum + line.qty, 0);
  const deliveredAt = order.timeline[order.timeline.length - 1]?.at;
  const heroColors = delivered
    ? ['#15B364', '#0B7A3B']
    : [colors.primary, colors.primaryDark];

  const reorder = () => {
    if (!restaurant) return;
    let added = 0;
    order.items.forEach((line) => {
      const item = getMenuItem(restaurant, line.itemId);
      if (!item) return;
      addItem(restaurant, item, line.extras || [], line.qty);
      added += 1;
    });
    if (added > 0) {
      router.push('/cart');
    }
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScreenHeader
        title="Track order"
        subtitle={`Order ${order.id}`}
        right={
          delivered ? (
            <View style={styles.doneChip}>
              <Ionicons
                name="checkmark-circle"
                size={14}
                color={colors.success}
              />
              <Text style={styles.doneText}>Completed</Text>
            </View>
          ) : (
            <View style={styles.liveChip}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>Live</Text>
            </View>
          )
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, spacing.xl) + spacing.lg },
        ]}
      >
        <LinearGradient
          colors={heroColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.heroTop}>
            <View style={styles.heroBadge}>
              <Ionicons
                name={delivered ? 'checkmark-circle' : 'bicycle'}
                size={13}
                color={colors.white}
              />
              <Text style={styles.heroBadgeText}>
                {delivered ? 'Delivered' : 'Live tracking'}
              </Text>
            </View>
            <Text style={styles.heroEta}>
              {delivered ? 'Completed' : `~ ${order.eta} min`}
            </Text>
          </View>
          <Text style={styles.heroTitle}>
            {delivered ? 'Enjoy your meal!' : currentStep.title}
          </Text>
          <Text style={styles.heroSubtitle}>
            {delivered
              ? `Delivered at ${formatClock(deliveredAt)}. We hope you loved it.`
              : currentStep.description}
          </Text>

          <View style={styles.heroMeta}>
            <View style={styles.heroMetaItem}>
              <Text style={styles.heroMetaLabel}>Restaurant</Text>
              <Text numberOfLines={1} style={styles.heroMetaValue}>
                {order.restaurantName}
              </Text>
            </View>
            <View style={styles.heroDivider} />
            <View style={styles.heroMetaItem}>
              <Text style={styles.heroMetaLabel}>Items</Text>
              <Text style={styles.heroMetaValue}>{itemCount}</Text>
            </View>
            <View style={styles.heroDivider} />
            <View style={styles.heroMetaItem}>
              <Text style={styles.heroMetaLabel}>Total</Text>
              <Text style={styles.heroMetaValue}>
                {formatPKR(order.totals.total)}
              </Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.demoNote}>
          <Ionicons
            name="time-outline"
            size={15}
            color={colors.textMuted}
          />
          <Text style={styles.demoText}>
            Demo tracking: each stage advances automatically every 5 seconds.
          </Text>
        </View>

        <View>
          <Text style={styles.sectionTitle}>Order status</Text>
          <OrderTimeline order={order} />
        </View>

        <View>
          <Text style={styles.sectionTitle}>Order summary</Text>
          <View style={styles.card}>
            <View style={styles.restaurantHead}>
              <Image
                source={order.restaurantImage || restaurant?.image}
                style={styles.restaurantImage}
              />
              <View style={styles.restaurantCopy}>
                <Text style={styles.restaurantName}>
                  {order.restaurantName}
                </Text>
                <Text style={styles.restaurantMeta}>
                  Placed on {formatDate(order.placedAt)} at{' '}
                  {formatClock(order.placedAt)}
                </Text>
              </View>
            </View>
            <View style={styles.itemLines}>
              {order.items.map((line) => (
                <View key={line.key || line.name} style={styles.itemLine}>
                  <Text style={styles.itemQty}>{line.qty}x</Text>
                  <View style={styles.itemCopy}>
                    <Text style={styles.itemName}>{line.name}</Text>
                    {line.extras?.length > 0 ? (
                      <Text style={styles.itemExtras}>
                        + {line.extras.map((extra) => extra.name).join(', ')}
                      </Text>
                    ) : null}
                  </View>
                  <Text style={styles.itemPrice}>
                    {formatPKR(line.unitPrice * line.qty)}
                  </Text>
                </View>
              ))}
            </View>
            <BillSummary
              subtotal={order.totals.subtotal}
              discount={order.totals.discount}
              deliveryFee={order.totals.deliveryFee}
              total={order.totals.total}
              style={styles.bill}
            />
          </View>
        </View>

        <View>
          <Text style={styles.sectionTitle}>Delivery details</Text>
          <View style={styles.card}>
            <DetailRow
              icon="location-outline"
              label={order.address?.label || 'Delivery address'}
              value={
                order.address
                  ? `${order.address.line}, ${order.address.city}`
                  : 'Address not available'
              }
            />
            <DetailRow
              icon="call-outline"
              label={order.customerName}
              value={order.phone}
            />
            <DetailRow
              icon="cash-outline"
              label="Payment method"
              value={order.paymentMethod}
            />
            {order.instructions ? (
              <DetailRow
                icon="chatbox-ellipses-outline"
                label="Instructions"
                value={order.instructions}
                last
              />
            ) : null}
          </View>
        </View>

        <View style={styles.actions}>
          {delivered && restaurant ? (
            <PrimaryButton
              label="Reorder these items"
              icon="repeat"
              onPress={reorder}
            />
          ) : (
            <PrimaryButton
              label="Get help with this order"
              icon="chatbubbles-outline"
              variant="secondary"
              onPress={() => router.push(`/help?orderId=${order.id}`)}
            />
          )}
          <PrimaryButton
            label="Back to home"
            variant="ghost"
            onPress={() => router.replace('/')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.successLight,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  doneText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: colors.success,
  },
  liveChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  liveText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: colors.primary,
  },
  content: {
    paddingHorizontal: spacing.xl,
    gap: spacing.lg,
  },
  hero: {
    borderRadius: radius.xxl,
    padding: spacing.xl,
    overflow: 'hidden',
    ...shadows.floating,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  heroBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: colors.white,
  },
  heroEta: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.white,
  },
  heroTitle: {
    fontSize: 23,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: -0.4,
    marginTop: spacing.lg,
  },
  heroSubtitle: {
    fontSize: 12.5,
    lineHeight: 18,
    color: 'rgba(255, 255, 255, 0.86)',
    marginTop: 5,
  },
  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    marginTop: spacing.lg,
  },
  heroMetaItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  heroMetaLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.75)',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  heroMetaValue: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.white,
    marginTop: 3,
    maxWidth: '100%',
  },
  heroDivider: {
    width: 1,
    height: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  demoNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.xs,
    marginTop: -spacing.sm,
  },
  demoText: {
    flex: 1,
    fontSize: 10.5,
    color: colors.textMuted,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  restaurantHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  restaurantImage: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceAlt,
  },
  restaurantCopy: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 13.5,
    fontWeight: '800',
    color: colors.text,
  },
  restaurantMeta: {
    fontSize: 10.5,
    color: colors.textMuted,
    marginTop: 2,
  },
  itemLines: {
    paddingTop: spacing.xs,
  },
  itemLine: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    paddingVertical: 7,
  },
  itemQty: {
    fontSize: 11.5,
    fontWeight: '800',
    color: colors.primary,
    minWidth: 20,
  },
  itemCopy: {
    flex: 1,
  },
  itemName: {
    fontSize: 12.5,
    fontWeight: '600',
    color: colors.text,
  },
  itemExtras: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 1,
  },
  itemPrice: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },
  bill: {
    marginTop: spacing.md,
    borderWidth: 0,
    backgroundColor: colors.surfaceAlt,
    boxShadow: 'none',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  detailBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailCopy: {
    flex: 1,
    paddingTop: 1,
  },
  detailLabel: {
    fontSize: 10.5,
    fontWeight: '600',
    color: colors.textMuted,
  },
  detailValue: {
    fontSize: 12.5,
    fontWeight: '600',
    color: colors.text,
    marginTop: 2,
    lineHeight: 18,
  },
  actions: {
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
});
