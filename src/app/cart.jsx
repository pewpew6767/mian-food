import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import BillSummary from '@/components/BillSummary';
import ConfirmDialog from '@/components/ConfirmDialog';
import EmptyState from '@/components/EmptyState';
import PrimaryButton from '@/components/PrimaryButton';
import QuantityStepper from '@/components/QuantityStepper';
import ScreenHeader from '@/components/ScreenHeader';
import { useCart } from '@/context/CartContext';
import { getMenuItem } from '@/data/restaurants';
import { colors, radius, shadows, spacing, type } from '@/theme';
import { formatPKR } from '@/utils/format';

export default function CartScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    cart,
    restaurant,
    itemCount,
    subtotal,
    discount,
    deliveryFee,
    total,
    changeQty,
    removeItem,
    clearCart,
  } = useCart();
  const [confirmClear, setConfirmClear] = useState(false);

  if (!cart || !restaurant) {
    return (
      <SafeAreaView style={styles.screen} edges={['top']}>
        <ScreenHeader title="Your cart" />
        <EmptyState
          icon="cart-outline"
          title="Your cart is empty"
          message="Hungry? Add dishes from your favourite restaurants and they will show up here."
          actionLabel="Browse restaurants"
          onAction={() => router.replace('/')}
          secondaryLabel="Search for a dish"
          onSecondary={() => router.push('/search')}
        />
      </SafeAreaView>
    );
  }

  const belowMinimum = subtotal < restaurant.minOrder;

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScreenHeader
        title="Your cart"
        subtitle={`${itemCount} ${itemCount === 1 ? 'item' : 'items'} from ${
          restaurant.name
        }`}
        right={
          <Pressable
            onPress={() => setConfirmClear(true)}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Clear cart"
          >
            <Text style={styles.clearText}>Clear</Text>
          </Pressable>
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Pressable
          onPress={() => router.push(`/restaurant/${restaurant.id}`)}
          style={styles.restaurantRow}
          accessibilityRole="button"
        >
          <Image source={restaurant.image} style={styles.restaurantImage} />
          <View style={styles.restaurantCopy}>
            <Text style={styles.restaurantName}>{restaurant.name}</Text>
            <Text style={styles.restaurantMeta}>
              {restaurant.deliveryTime} min delivery -{' '}
              {restaurant.distance}
            </Text>
          </View>
          <Text style={styles.addMore}>Add more</Text>
        </Pressable>

        <View style={styles.itemsCard}>
          {cart.items.map((line, index) => {
            const menuItem = getMenuItem(restaurant, line.itemId);
            return (
              <View
                key={line.key}
                style={[
                  styles.line,
                  index < cart.items.length - 1 && styles.lineBorder,
                ]}
              >
                <Image
                  source={menuItem?.image || restaurant.image}
                  style={styles.lineImage}
                />
                <View style={styles.lineCopy}>
                  <View style={styles.lineTop}>
                    <Text numberOfLines={2} style={styles.lineName}>
                      {line.name}
                    </Text>
                    <Pressable
                      onPress={() => removeItem(line.key)}
                      hitSlop={8}
                      accessibilityRole="button"
                      accessibilityLabel={`Remove ${line.name}`}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={17}
                        color={colors.textLight}
                      />
                    </Pressable>
                  </View>
                  {line.extras.length > 0 ? (
                    <Text numberOfLines={1} style={styles.extras}>
                      + {line.extras.map((extra) => extra.name).join(', ')}
                    </Text>
                  ) : null}
                  <View style={styles.lineBottom}>
                    <Text style={styles.linePrice}>
                      {formatPKR(line.unitPrice * line.qty)}
                    </Text>
                    <QuantityStepper
                      qty={line.qty}
                      onMinus={() => changeQty(line.key, -1)}
                      onPlus={() => changeQty(line.key, 1)}
                    />
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {belowMinimum ? (
          <View style={styles.minimumNote}>
            <Ionicons
              name="information-circle"
              size={16}
              color={colors.warning}
            />
            <Text style={styles.minimumText}>
              Minimum order is {formatPKR(restaurant.minOrder)}. Add{' '}
              {formatPKR(restaurant.minOrder - subtotal)} more to checkout.
            </Text>
          </View>
        ) : null}

        <BillSummary
          subtotal={subtotal}
          discount={discount}
          deliveryFee={deliveryFee}
          total={total}
        />

        <View style={styles.deliveryNote}>
          <Ionicons name="leaf-outline" size={15} color={colors.success} />
          <Text style={styles.deliveryNoteText}>
            {deliveryFee === 0
              ? 'This restaurant delivers free. Nice choice!'
              : `Estimated delivery in ${restaurant.deliveryTime} minutes.`}
          </Text>
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom, spacing.md) },
        ]}
      >
        <View style={styles.footerCopy}>
          <Text style={styles.footerLabel}>Total to pay</Text>
          <Text style={styles.footerTotal}>{formatPKR(total)}</Text>
        </View>
        <PrimaryButton
          label="Go to checkout"
          icon="arrow-forward"
          disabled={belowMinimum}
          onPress={() => router.push('/checkout')}
          style={styles.checkoutButton}
        />
      </View>

      <ConfirmDialog
        visible={confirmClear}
        icon="trash"
        destructive
        title="Clear your cart?"
        message="All items from this restaurant will be removed."
        confirmLabel="Clear cart"
        onConfirm={() => {
          clearCart();
          setConfirmClear(false);
        }}
        onCancel={() => setConfirmClear(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  clearText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: colors.primary,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  restaurantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  restaurantImage: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceAlt,
  },
  restaurantCopy: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
  },
  restaurantMeta: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  addMore: {
    fontSize: 11.5,
    fontWeight: '700',
    color: colors.primary,
  },
  itemsCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
  },
  line: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingVertical: spacing.lg,
  },
  lineBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  lineImage: {
    width: 64,
    height: 64,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceAlt,
  },
  lineCopy: {
    flex: 1,
  },
  lineTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  lineName: {
    flex: 1,
    fontSize: 13.5,
    fontWeight: '700',
    color: colors.text,
  },
  extras: {
    fontSize: 10.5,
    color: colors.textMuted,
    marginTop: 2,
  },
  lineBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  linePrice: {
    fontSize: 13.5,
    fontWeight: '800',
    color: colors.text,
  },
  minimumNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: '#FFF8E8',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
  },
  minimumText: {
    flex: 1,
    fontSize: 11.5,
    fontWeight: '600',
    lineHeight: 16,
    color: '#8A5B00',
  },
  deliveryNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  deliveryNoteText: {
    fontSize: 11.5,
    fontWeight: '500',
    color: colors.textMuted,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...shadows.subtle,
  },
  footerCopy: {
    flex: 1,
  },
  footerLabel: {
    fontSize: 10.5,
    fontWeight: '500',
    color: colors.textMuted,
  },
  footerTotal: {
    ...type.price,
    fontSize: 19,
  },
  checkoutButton: {
    flex: 1.2,
  },
});
