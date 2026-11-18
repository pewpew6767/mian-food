import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useCart } from '@/context/CartContext';
import { colors, shadows } from '@/theme';

export default function CartButton({ overlay = false }) {
  const router = useRouter();
  const { itemCount } = useCart();

  return (
    <Pressable
      onPress={() => router.push('/cart')}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={`Open cart, ${itemCount} items`}
      style={[styles.button, overlay && styles.overlay]}
    >
      <Ionicons name="cart-outline" size={22} color={colors.primary} />
      {itemCount > 0 ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {itemCount > 9 ? '9+' : itemCount}
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    backgroundColor: colors.white,
    ...shadows.card,
  },
  badge: {
    position: 'absolute',
    top: -3,
    right: -3,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.white,
  },
  badgeText: {
    color: colors.white,
    fontSize: 9.5,
    fontWeight: '800',
  },
});
