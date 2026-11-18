import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import BillSummary from '@/components/BillSummary';
import EmptyState from '@/components/EmptyState';
import Field from '@/components/Field';
import PrimaryButton from '@/components/PrimaryButton';
import ScreenHeader from '@/components/ScreenHeader';
import { useCart } from '@/context/CartContext';
import { useOrders } from '@/context/OrdersContext';
import { useUser } from '@/context/UserContext';
import { colors, radius, shadows, spacing, type } from '@/theme';
import { formatPKR } from '@/utils/format';

export default function CheckoutScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { cart, restaurant, itemCount, subtotal, discount, deliveryFee, total, clearCart } =
    useCart();
  const { user, selectedAddress } = useUser();
  const { placeOrder } = useOrders();
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [instructions, setInstructions] = useState('');
  const [errors, setErrors] = useState({});
  const [placing, setPlacing] = useState(false);

  if (!cart || !restaurant) {
    return (
      <SafeAreaView style={styles.screen} edges={['top']}>
        <ScreenHeader title="Checkout" />
        <EmptyState
          icon="cart-outline"
          title="Nothing to checkout"
          message="Your cart is empty right now. Add a few dishes first."
          actionLabel="Browse restaurants"
          onAction={() => router.replace('/')}
        />
      </SafeAreaView>
    );
  }

  const clearError = (key) =>
    setErrors((previous) => ({ ...previous, [key]: undefined }));

  const validate = () => {
    const next = {};
    if (name.trim().length < 2) {
      next.name = 'Please enter your full name.';
    }
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 10) {
      next.phone = 'Enter a valid phone number, e.g. 0300 1234567.';
    }
    if (!selectedAddress) {
      next.address = 'Choose where we should deliver your order.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onPlaceOrder = () => {
    if (!validate() || placing) return;
    setPlacing(true);

    setTimeout(() => {
      const order = placeOrder({
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        restaurantImage: restaurant.image,
        items: cart.items.map((line) => ({
          key: line.key,
          itemId: line.itemId,
          name: line.name,
          unitPrice: line.unitPrice,
          qty: line.qty,
          extras: line.extras,
        })),
        totals: { subtotal, discount, deliveryFee, total },
        eta: restaurant.deliveryTime,
        address: selectedAddress
          ? {
              id: selectedAddress.id,
              label: selectedAddress.label,
              line: selectedAddress.line,
              city: selectedAddress.city,
            }
          : null,
        customerName: name.trim(),
        phone: phone.trim(),
        instructions: instructions.trim(),
        paymentMethod: 'Cash on delivery',
      });

      clearCart();
      router.replace(`/tracking/${order.id}`);
    }, 700);
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScreenHeader title="Checkout" subtitle="Almost there" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.content}
        >
          <View>
            <Text style={styles.sectionTitle}>Delivery address</Text>
            <Pressable
              onPress={() => router.push('/address-picker')}
              style={({ pressed }) => [
                styles.addressCard,
                errors.address && styles.addressError,
                pressed && styles.pressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Change delivery address"
            >
              <View style={styles.addressIcon}>
                <Ionicons
                  name="location"
                  size={18}
                  color={colors.primary}
                />
              </View>
              <View style={styles.addressCopy}>
                {selectedAddress ? (
                  <>
                    <Text style={styles.addressLabel}>
                      {selectedAddress.label}
                    </Text>
                    <Text style={styles.addressLine}>
                      {selectedAddress.line}, {selectedAddress.city}
                    </Text>
                  </>
                ) : (
                  <Text style={styles.addressLabel}>
                    Select a delivery address
                  </Text>
                )}
              </View>
              <Text style={styles.changeText}>Change</Text>
            </Pressable>
            {errors.address ? (
              <Text style={styles.errorText}>{errors.address}</Text>
            ) : null}
          </View>

          <View style={styles.fieldsCard}>
            <Text style={styles.cardTitle}>Contact details</Text>
            <Field
              label="Full name"
              value={name}
              onChangeText={(text) => {
                setName(text);
                clearError('name');
              }}
              placeholder="Your name"
              autoCapitalize="words"
              error={errors.name}
            />
            <Field
              label="Phone number"
              value={phone}
              onChangeText={(text) => {
                setPhone(text);
                clearError('phone');
              }}
              placeholder="03xx xxxxxxx"
              keyboardType="phone-pad"
              error={errors.phone}
            />
            <Field
              label="Delivery instructions (optional)"
              value={instructions}
              onChangeText={setInstructions}
              placeholder="Ring the bell, leave at the door..."
              multiline
            />
          </View>

          <View>
            <Text style={styles.sectionTitle}>Payment method</Text>
            <View style={styles.paymentCard}>
              <View style={styles.paymentIcon}>
                <Ionicons
                  name="cash-outline"
                  size={19}
                  color={colors.success}
                />
              </View>
              <View style={styles.paymentCopy}>
                <Text style={styles.paymentTitle}>Cash on delivery</Text>
                <Text style={styles.paymentHint}>
                  Pay the rider when your food arrives
                </Text>
              </View>
              <View style={styles.radio}>
                <View style={styles.radioDot} />
              </View>
            </View>
          </View>

          <View>
            <Text style={styles.sectionTitle}>Order summary</Text>
            <View style={styles.summaryCard}>
              <View style={styles.summaryHead}>
                <Text style={styles.summaryRestaurant}>
                  {restaurant.name}
                </Text>
                <Text style={styles.summaryCount}>
                  {itemCount} {itemCount === 1 ? 'item' : 'items'}
                </Text>
              </View>
              {cart.items.map((line) => (
                <View key={line.key} style={styles.summaryLine}>
                  <Text style={styles.summaryQty}>{line.qty}x</Text>
                  <View style={styles.summaryItemCopy}>
                    <Text numberOfLines={1} style={styles.summaryName}>
                      {line.name}
                    </Text>
                    {line.extras.length > 0 ? (
                      <Text numberOfLines={1} style={styles.summaryExtras}>
                        + {line.extras.map((extra) => extra.name).join(', ')}
                      </Text>
                    ) : null}
                  </View>
                  <Text style={styles.summaryPrice}>
                    {formatPKR(line.unitPrice * line.qty)}
                  </Text>
                </View>
              ))}
            </View>
            <BillSummary
              subtotal={subtotal}
              discount={discount}
              deliveryFee={deliveryFee}
              total={total}
              style={styles.bill}
            />
          </View>

          <View style={styles.demoNote}>
            <Ionicons
              name="information-circle-outline"
              size={16}
              color={colors.textMuted}
            />
            <Text style={styles.demoText}>
              This is a demo checkout. No real payment is processed and your
              order is simulated on this device.
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
            label={placing ? 'Placing order' : 'Place order'}
            icon="checkmark-circle"
            loading={placing}
            onPress={onPlaceOrder}
            style={styles.placeButton}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
    gap: spacing.xl,
  },
  sectionTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.md,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  addressError: {
    borderColor: colors.danger,
  },
  addressIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressCopy: {
    flex: 1,
  },
  addressLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.text,
  },
  addressLine: {
    fontSize: 11.5,
    lineHeight: 16,
    color: colors.textMuted,
    marginTop: 2,
  },
  changeText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: colors.primary,
  },
  errorText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: colors.danger,
    marginTop: 6,
  },
  pressed: {
    opacity: 0.9,
  },
  fieldsCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.lg,
  },
  cardTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: colors.text,
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.primary,
    padding: spacing.md,
  },
  paymentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.successLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentCopy: {
    flex: 1,
  },
  paymentTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.text,
  },
  paymentHint: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  summaryCard: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  summaryHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  summaryRestaurant: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
  },
  summaryCount: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
  },
  summaryLine: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    paddingVertical: 10,
  },
  summaryQty: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
    minWidth: 22,
  },
  summaryItemCopy: {
    flex: 1,
  },
  summaryName: {
    fontSize: 12.5,
    fontWeight: '600',
    color: colors.text,
  },
  summaryExtras: {
    fontSize: 10.5,
    color: colors.textMuted,
    marginTop: 1,
  },
  summaryPrice: {
    fontSize: 12.5,
    fontWeight: '700',
    color: colors.text,
  },
  bill: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderTopWidth: 0,
    backgroundColor: colors.surface,
  },
  demoNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  demoText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 16,
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
  placeButton: {
    flex: 1.2,
  },
});
