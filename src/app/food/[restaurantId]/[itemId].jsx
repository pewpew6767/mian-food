import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CartButton from '@/components/CartButton';
import ConfirmDialog from '@/components/ConfirmDialog';
import EmptyState from '@/components/EmptyState';
import PrimaryButton from '@/components/PrimaryButton';
import QuantityStepper from '@/components/QuantityStepper';
import { getMenuItem, getRestaurant } from '@/data/restaurants';
import useCartAdd from '@/hooks/useCartAdd';
import { colors, radius, spacing, type } from '@/theme';
import { formatPKR } from '@/utils/format';

export default function FoodDetailsScreen() {
  const { restaurantId, itemId } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const restaurant = getRestaurant(restaurantId);
  const item = getMenuItem(restaurant, itemId);
  const [extraIds, setExtraIds] = useState([]);
  const [qty, setQty] = useState(1);
  const { requestAdd, pending, confirmReplace, cancelReplace } =
    useCartAdd(restaurant || { id: 'missing' });

  const selectedExtras = useMemo(
    () => (item?.extras || []).filter((extra) => extraIds.includes(extra.id)),
    [extraIds, item]
  );

  if (!restaurant || !item) {
    return (
      <EmptyState
        icon="fast-food-outline"
        title="Item not available"
        message="This dish is no longer on the menu."
        actionLabel="Back to search"
        onAction={() => router.replace('/search')}
      />
    );
  }

  const extrasTotal = selectedExtras.reduce(
    (sum, extra) => sum + extra.price,
    0
  );
  const total = (item.price + extrasTotal) * qty;

  const toggleExtra = (extra) => {
    setExtraIds((previous) =>
      previous.includes(extra.id)
        ? previous.filter((id) => id !== extra.id)
        : [...previous, extra.id]
    );
  };

  const addToCart = () => {
    const added = requestAdd(item, selectedExtras, qty);
    if (added) router.back();
  };

  const confirmAndAdd = () => {
    confirmReplace();
    router.back();
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 + insets.bottom }}
      >
        <Image source={item.image} style={styles.image} />

        <View style={styles.content}>
          <Text style={styles.restaurant}>{restaurant.name}</Text>
          <Text style={styles.name}>{item.name}</Text>
          {item.badge ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.badge}</Text>
            </View>
          ) : null}
          <Text style={styles.description}>{item.description}</Text>
          <Text style={styles.price}>{formatPKR(item.price)}</Text>

          {item.extras.length > 0 ? (
            <View style={styles.extrasSection}>
              <Text style={styles.sectionTitle}>Make it extra</Text>
              <Text style={styles.sectionHint}>
                Optional add-ons for your order
              </Text>
              <View style={styles.extrasCard}>
                {item.extras.map((extra, index) => {
                  const selected = extraIds.includes(extra.id);
                  return (
                    <Pressable
                      key={extra.id}
                      onPress={() => toggleExtra(extra)}
                      style={({ pressed }) => [
                        styles.extraRow,
                        index < item.extras.length - 1 &&
                          styles.extraRowBorder,
                        pressed && styles.pressed,
                      ]}
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked: selected }}
                    >
                      <View
                        style={[
                          styles.checkbox,
                          selected && styles.checkboxActive,
                        ]}
                      >
                        {selected ? (
                          <Ionicons
                            name="checkmark"
                            size={14}
                            color={colors.white}
                          />
                        ) : null}
                      </View>
                      <Text style={styles.extraName}>{extra.name}</Text>
                      <Text style={styles.extraPrice}>
                        + {formatPKR(extra.price)}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ) : null}

          <View style={styles.qtyRow}>
            <View>
              <Text style={styles.sectionTitle}>Quantity</Text>
              <Text style={styles.sectionHint}>How many do you need?</Text>
            </View>
            <QuantityStepper
              qty={qty}
              onMinus={() => setQty((value) => Math.max(1, value - 1))}
              onPlus={() => setQty((value) => Math.min(20, value + 1))}
            />
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Item total</Text>
            <Text style={styles.totalValue}>{formatPKR(total)}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.header, { top: insets.top + spacing.sm }]}>
        <Pressable
          onPress={() => router.back()}
          style={styles.headerButton}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </Pressable>
        <View style={styles.headerSpacer} />
        <CartButton overlay />
      </View>

      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom, spacing.md) },
        ]}
      >
        <View style={styles.footerCopy}>
          <Text style={styles.footerLabel}>{qty} x {item.name}</Text>
          <Text style={styles.footerTotal}>{formatPKR(total)}</Text>
        </View>
        <PrimaryButton
          label="Add to cart"
          icon="cart"
          onPress={addToCart}
          style={styles.addButton}
        />
      </View>

      <ConfirmDialog
        visible={!!pending}
        icon="cart"
        title="Start a new cart?"
        message="Your cart has items from another restaurant. Adding this item will clear your current cart."
        confirmLabel="Start new cart"
        onConfirm={confirmAndAdd}
        onCancel={cancelReplace}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  image: {
    width: '100%',
    height: 320,
    backgroundColor: colors.surfaceAlt,
  },
  content: {
    padding: spacing.xl,
    marginTop: -spacing.xl,
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
  },
  restaurant: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  name: {
    ...type.h1,
    marginTop: 4,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryLight,
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 3,
    marginTop: spacing.sm,
  },
  badgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.3,
  },
  description: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
  price: {
    fontSize: 19,
    fontWeight: '800',
    color: colors.text,
    marginTop: spacing.md,
  },
  extrasSection: {
    marginTop: spacing.xxl,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  sectionHint: {
    fontSize: 11,
    color: colors.textLight,
    marginTop: 2,
  },
  extrasCard: {
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  extraRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
  },
  extraRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  pressed: {
    opacity: 0.85,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  extraName: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  extraPrice: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xxl,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: spacing.xl,
    paddingTop: spacing.lg,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  totalValue: {
    fontSize: 19,
    fontWeight: '800',
    color: colors.text,
  },
  header: {
    position: 'absolute',
    left: spacing.xl,
    right: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerSpacer: {
    flex: 1,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 3px 10px rgba(17, 17, 24, 0.14)',
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerCopy: {
    flex: 1,
  },
  footerLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: colors.textMuted,
  },
  footerTotal: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
  },
  addButton: {
    flex: 1.1,
  },
});
