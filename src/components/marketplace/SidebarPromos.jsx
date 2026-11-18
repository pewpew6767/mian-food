import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { IMAGES } from '@/data/images';
import { colors, radius, shadows, spacing } from '@/theme';

export function MartPromoCard({ style }) {
  const router = useRouter();
  return (
    <Pressable
      onPress={() => router.push('/mart')}
      style={({ pressed }) => [
        styles.martCard,
        style,
        pressed && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel="Shop groceries on Mian Mart"
      testID="mart-promo"
    >
      <Image source={IMAGES.produce} style={styles.martImage} />
      <LinearGradient
        colors={['rgba(17, 17, 24, 0)', 'rgba(17, 17, 24, 0.82)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.martShade}
      />
      <View style={styles.martBadge}>
        <Text style={styles.martBadgeText}>MIAN MART</Text>
      </View>
      <View style={styles.martCopy}>
        <Text style={styles.martTitle}>Groceries in 30 min</Text>
        <Text style={styles.martSubtitle}>Fresh produce, dairy and daily essentials</Text>
        <View style={styles.martLink}>
          <Text style={styles.martLinkText}>Shop Mian Mart</Text>
          <Ionicons name="arrow-forward" size={12} color={colors.white} />
        </View>
      </View>
    </Pressable>
  );
}

export function AppPromoCard({ style }) {
  return (
    <View style={[styles.appCard, style]} testID="app-promo">
      <View style={styles.appGlow} />
      <Text style={styles.appEyebrow}>MIAN FOOD APP</Text>
      <Text style={styles.appTitle}>Order on the go</Text>
      <Text style={styles.appSubtitle}>
        Scan the demo QR to open the MIAN FOOD experience on your phone.
      </Text>
      <View style={styles.qrRow}>
        <View style={styles.qrBox} testID="app-promo-qr">
          <QRCode
            value="https://mianfood.example/app"
            size={86}
            color={colors.text}
            backgroundColor={colors.white}
          />
        </View>
        <View style={styles.appStore}>
          <View style={styles.storePill}>
            <Ionicons name="logo-apple" size={15} color={colors.white} />
            <View>
              <Text style={styles.storeHint}>Download on the</Text>
              <Text style={styles.storeName}>App Store</Text>
            </View>
          </View>
          <View style={styles.storePill}>
            <Ionicons name="logo-google-playstore" size={14} color={colors.white} />
            <View>
              <Text style={styles.storeHint}>Get it on</Text>
              <Text style={styles.storeName}>Google Play</Text>
            </View>
          </View>
          <Text style={styles.demoNote}>Demo QR - prototype only</Text>
        </View>
      </View>
    </View>
  );
}

export default function SidebarPromos({ style }) {
  return (
    <View style={[styles.wrap, style]}>
      <MartPromoCard />
      <AppPromoCard />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.lg,
  },
  pressed: {
    opacity: 0.95,
  },
  martCard: {
    height: 188,
    borderRadius: radius.xxl,
    overflow: 'hidden',
    backgroundColor: colors.surfaceAlt,
    ...shadows.subtle,
  },
  martImage: {
    width: '100%',
    height: '100%',
  },
  martShade: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  martBadge: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  martBadgeText: {
    fontSize: 8,
    fontWeight: '900',
    color: colors.white,
    letterSpacing: 0.8,
  },
  martCopy: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    bottom: spacing.md,
  },
  martTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.white,
    letterSpacing: -0.3,
  },
  martSubtitle: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.82)',
    marginTop: 2,
  },
  martLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: spacing.sm,
  },
  martLinkText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: colors.white,
  },
  appCard: {
    backgroundColor: colors.text,
    borderRadius: radius.xxl,
    padding: spacing.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  appGlow: {
    position: 'absolute',
    right: -50,
    top: -60,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(240, 46, 116, 0.3)',
  },
  appEyebrow: {
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.2,
    color: colors.primaryLight,
  },
  appTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.white,
    marginTop: 3,
    letterSpacing: -0.3,
  },
  appSubtitle: {
    fontSize: 10,
    lineHeight: 14,
    color: 'rgba(255, 255, 255, 0.62)',
    marginTop: 3,
  },
  qrRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  qrBox: {
    backgroundColor: colors.white,
    padding: 7,
    borderRadius: radius.md,
  },
  appStore: {
    flex: 1,
    gap: 5,
  },
  storePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  storeHint: {
    fontSize: 6.5,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.65)',
  },
  storeName: {
    fontSize: 9.5,
    fontWeight: '800',
    color: colors.white,
  },
  demoNote: {
    fontSize: 7.5,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.42)',
  },
});
