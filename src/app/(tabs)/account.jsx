import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOrders } from '@/context/OrdersContext';
import { useUser } from '@/context/UserContext';
import {
  colors,
  radius,
  shadows,
  spacing,
  type,
} from '@/theme';

function MenuRow({ icon, title, subtitle, onPress, last = false }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.menuRow,
        !last && styles.menuRowBorder,
        pressed && styles.pressed,
      ]}
      accessibilityRole="button"
    >
      <View style={styles.menuIcon}>
        <Ionicons name={icon} size={19} color={colors.primary} />
      </View>
      <View style={styles.menuCopy}>
        <Text style={styles.menuTitle}>{title}</Text>
        <Text style={styles.menuSubtitle}>{subtitle}</Text>
      </View>
      <Ionicons
        name="chevron-forward"
        size={17}
        color={colors.textLight}
      />
    </Pressable>
  );
}

export default function AccountScreen() {
  const router = useRouter();
  const { user } = useUser();
  const { orders } = useOrders();
  const initial = user.name?.trim().charAt(0).toUpperCase() || 'F';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={[colors.primary, colors.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.heroRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initial}</Text>
            </View>
            <View style={styles.heroCopy}>
              <Text style={styles.name}>{user.name}</Text>
              <Text style={styles.phone}>{user.phone}</Text>
            </View>
            <Pressable
              onPress={() => router.push('/profile')}
              style={({ pressed }) => [
                styles.editButton,
                pressed && styles.pressed,
              ]}
              accessibilityRole="button"
            >
              <Ionicons name="pencil" size={12} color={colors.white} />
              <Text style={styles.editText}>Edit</Text>
            </Pressable>
          </View>
          <View style={styles.heroStats}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{orders.length}</Text>
              <Text style={styles.statLabel}>Orders</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{user.addresses.length}</Text>
              <Text style={styles.statLabel}>Addresses</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>Cash</Text>
              <Text style={styles.statLabel}>On delivery</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.body}>
          <Text style={styles.sectionTitle}>Your account</Text>
          <View style={styles.menuCard}>
            <MenuRow
              icon="location-outline"
              title="Saved addresses"
              subtitle={`${user.addresses.length} saved - manage delivery spots`}
              onPress={() => router.push('/addresses')}
            />
            <MenuRow
              icon="heart-outline"
              title="Saved restaurants"
              subtitle="Your favourite places on MIAN FOOD"
              onPress={() => router.push('/favorites')}
            />
            <MenuRow
              icon="receipt-outline"
              title="Previous orders"
              subtitle={
                orders.length
                  ? `View all ${orders.length} ${
                      orders.length === 1 ? 'order' : 'orders'
                    }`
                  : 'No orders yet'
              }
              onPress={() => router.push('/orders')}
            />
            <MenuRow
              icon="help-circle-outline"
              title="Help & support"
              subtitle="FAQs, call, email or WhatsApp us"
              onPress={() => router.push('/help')}
              last
            />
          </View>

          <View style={styles.promoCard}>
            <View style={styles.promoIcon}>
              <Ionicons name="heart" size={22} color={colors.primary} />
            </View>
            <View style={styles.promoCopy}>
              <Text style={styles.promoTitle}>Made for food lovers</Text>
              <Text style={styles.promoText}>
                MIAN FOOD is a demo marketplace for Faisalabad. Browse 15
                sample restaurants and order with cash on delivery.
              </Text>
            </View>
          </View>

          <Text style={styles.version}>MIAN FOOD v1.0.0 - Faisalabad</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  hero: {
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
    borderBottomLeftRadius: radius.xxl,
    borderBottomRightRadius: radius.xxl,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 25,
    fontWeight: '800',
    color: colors.white,
  },
  heroCopy: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.white,
  },
  phone: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.82)',
    marginTop: 2,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  editText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.8,
  },
  heroStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xl,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: 1,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.white,
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 0.2,
  },
  statDivider: {
    width: 1,
    height: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  body: {
    padding: spacing.xl,
  },
  sectionTitle: {
    ...type.h3,
    fontSize: 16,
    marginBottom: spacing.md,
  },
  menuCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.subtle,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
  },
  menuRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuCopy: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: colors.text,
  },
  menuSubtitle: {
    fontSize: 10.5,
    fontWeight: '500',
    color: colors.textMuted,
    marginTop: 2,
  },
  promoCard: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.pinkSoft,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.primaryLight,
    padding: spacing.lg,
    marginTop: spacing.xl,
    alignItems: 'flex-start',
  },
  promoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promoCopy: {
    flex: 1,
  },
  promoTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  promoText: {
    fontSize: 11,
    lineHeight: 16,
    color: colors.textMuted,
    marginTop: 3,
  },
  version: {
    textAlign: 'center',
    fontSize: 10,
    fontWeight: '500',
    color: colors.textLight,
    marginTop: spacing.xxl,
  },
});
