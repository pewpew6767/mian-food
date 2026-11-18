import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '@/theme';

const COLUMNS = [
  {
    title: 'Explore',
    links: [
      { label: 'All restaurants', href: '/search' },
      { label: 'Mian Mart groceries', href: '/mart' },
      { label: 'Shops near you', href: '/shops' },
      { label: 'Your favourites', href: '/favorites' },
      {
        label: 'Daily deals',
        href: { pathname: '/search', params: { filter: 'deals' } },
      },
    ],
  },
  {
    title: 'Your account',
    links: [
      { label: 'Profile', href: '/account' },
      { label: 'Your orders', href: '/orders' },
      { label: 'Saved addresses', href: '/addresses' },
      { label: 'View cart', href: '/cart' },
      { label: 'Help centre', href: '/help' },
    ],
  },
  {
    title: 'Help & info',
    links: [
      { label: 'Delivery areas', href: '/address-picker' },
      { label: 'Order tracking', href: '/orders' },
      { label: 'Payment options', href: '/checkout' },
      { label: 'Contact support', href: '/help' },
    ],
  },
];

export default function MarketFooter({ onBackToTop }) {
  const router = useRouter();

  return (
    <View style={styles.footer}>
      <View style={styles.inner}>
        <View style={styles.top}>
          <View style={styles.brandCol}>
            <View style={styles.brandLine}>
              <Image
                source={require('../../../assets/icon.png')}
                style={styles.logo}
              />
              <Text style={styles.brand}>MIAN FOOD</Text>
            </View>
            <Text style={styles.tagline}>
              Faisalabad&apos;s food marketplace for burgers, biryani, pizza,
              coffee and groceries - delivered to your door.
            </Text>
            <View style={styles.trustRow}>
              <View style={styles.trustPill}>
                <Ionicons
                  name="cash-outline"
                  size={13}
                  color={colors.success}
                />
                <Text style={styles.trustText}>Cash on delivery</Text>
              </View>
              <View style={styles.trustPill}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={13}
                  color={colors.primary}
                />
                <Text style={styles.trustText}>Demo checkout</Text>
              </View>
            </View>
          </View>

          {COLUMNS.map((column) => (
            <View key={column.title} style={styles.linkCol}>
              <Text style={styles.linkTitle}>{column.title}</Text>
              {column.links.map((link) => (
                <Pressable
                  key={link.label}
                  onPress={() => router.push(link.href)}
                  style={({ pressed }) => [
                    styles.linkButton,
                    pressed && styles.pressed,
                  ]}
                  accessibilityRole="link"
                >
                  <Text style={styles.linkText}>{link.label}</Text>
                </Pressable>
              ))}
            </View>
          ))}
        </View>

        <View style={styles.demoStrip}>
          <Ionicons
            name="information-circle-outline"
            size={14}
            color={colors.textMuted}
          />
          <Text style={styles.demoText}>
            Demo marketplace: MIAN FOOD is a prototype. Restaurant names,
            menus, prices and offers are sample data and do not represent live
            availability. No real payment is taken.
          </Text>
        </View>

        <View style={styles.bottom}>
          <Text style={styles.copyright}>
            © 2026 MIAN FOOD - A demo food delivery marketplace for Faisalabad
          </Text>
          <Pressable
            onPress={onBackToTop}
            style={({ pressed }) => [
              styles.topButton,
              pressed && styles.pressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Back to top"
            testID="footer-back-to-top"
          >
            <Ionicons name="arrow-up" size={12} color={colors.primary} />
            <Text style={styles.topButtonText}>Back to top</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    backgroundColor: colors.surfaceAlt,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: spacing.huge,
  },
  inner: {
    width: '100%',
    maxWidth: 1280,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingTop: spacing.xxxl,
  },
  top: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xxl,
  },
  brandCol: {
    flexGrow: 2,
    flexBasis: 280,
    maxWidth: 420,
  },
  brandLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  logo: {
    width: 36,
    height: 36,
    borderRadius: 10,
  },
  brand: {
    fontSize: 19,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: -0.6,
  },
  tagline: {
    fontSize: 11,
    lineHeight: 17,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
  trustRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: spacing.md,
  },
  trustPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  trustText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.textMuted,
  },
  linkCol: {
    flexGrow: 1,
    flexBasis: 140,
  },
  linkTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: colors.text,
    marginBottom: 7,
    letterSpacing: 0.1,
  },
  linkButton: {
    paddingVertical: 3.5,
  },
  linkText: {
    fontSize: 10.5,
    fontWeight: '500',
    color: colors.textMuted,
  },
  demoStrip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginTop: spacing.xxl,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  demoText: {
    flex: 1,
    fontSize: 9.5,
    lineHeight: 15,
    color: colors.textLight,
  },
  bottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
  },
  copyright: {
    fontSize: 9.5,
    fontWeight: '500',
    color: colors.textLight,
  },
  topButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  topButtonText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: colors.primary,
  },
  pressed: {
    opacity: 0.75,
  },
});
