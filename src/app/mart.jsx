import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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
import CartBar from '@/components/CartBar';
import PageTopBar from '@/components/PageTopBar';
import QuickAddButton from '@/components/marketplace/QuickAddButton';
import { useCart } from '@/context/CartContext';
import { MIAN_MART } from '@/data/restaurants';
import useBreakpoint from '@/hooks/useBreakpoint';
import { colors, radius, shadows, spacing } from '@/theme';
import { formatPKR } from '@/utils/format';

function MartProductCard({ item, width }) {
  const router = useRouter();

  return (
    <View style={[styles.productCard, { width }]}>
      <Pressable
        onPress={() => router.push(`/food/${MIAN_MART.id}/${item.id}`)}
        style={({ pressed }) => [styles.productMain, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel={`${item.name}, ${formatPKR(item.price)}`}
        testID={`mart-product-${item.id}`}
      >
        <Image source={item.image} style={styles.productImage} />
        <View style={styles.productBody}>
          {item.badge ? (
            <View style={styles.productBadge}>
              <Text style={styles.productBadgeText}>{item.badge}</Text>
            </View>
          ) : null}
          <Text numberOfLines={1} style={styles.productName}>
            {item.name}
          </Text>
          <Text numberOfLines={2} style={styles.productDesc}>
            {item.description}
          </Text>
          <Text style={styles.productPrice}>{formatPKR(item.price)}</Text>
        </View>
      </Pressable>
      <QuickAddButton
        restaurant={MIAN_MART}
        item={item}
        size={30}
        style={styles.productAdd}
      />
    </View>
  );
}

export default function MartScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDesktop, isTablet } = useBreakpoint();
  const { cart, itemCount, total } = useCart();
  const [activeGroup, setActiveGroup] = useState(MIAN_MART.menu[0].id);
  const [gridWidth, setGridWidth] = useState(0);

  const group =
    MIAN_MART.menu.find((entry) => entry.id === activeGroup) ||
    MIAN_MART.menu[0];

  const cols = isDesktop ? 4 : isTablet ? 3 : 2;
  const gap = 12;
  const cardWidth =
    gridWidth > 0
      ? Math.floor((gridWidth - gap * (cols - 1)) / cols)
      : isDesktop
        ? 220
        : 160;

  const cartMatches = cart && cart.restaurantId === MIAN_MART.id && itemCount;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <PageTopBar title="Mian Mart" subtitle="Groceries in 30 minutes" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.inner}>
          <View style={styles.hero}>
            <LinearGradient
              colors={['#FDE7F0', '#FFF5F9']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroGradient}
            >
              <View style={styles.heroCopy}>
                <View style={styles.heroPill}>
                  <Ionicons name="basket" size={11} color={colors.white} />
                  <Text style={styles.heroPillText}>MIAN MART</Text>
                </View>
                <Text style={styles.heroTitle}>
                  Everyday groceries, delivered fast
                </Text>
                <Text style={styles.heroText}>
                  Fresh produce, dairy, bakery and pantry staples picked from
                  Mian Mart. Demo catalog with sample prices.
                </Text>
                <View style={styles.heroMeta}>
                  <View style={styles.heroMetaItem}>
                    <Ionicons
                      name="star"
                      size={12}
                      color={colors.success}
                    />
                    <Text style={styles.heroMetaText}>
                      {MIAN_MART.rating} ({MIAN_MART.ratingCount})
                    </Text>
                  </View>
                  <View style={styles.heroMetaItem}>
                    <Ionicons
                      name="time-outline"
                      size={12}
                      color={colors.primary}
                    />
                    <Text style={styles.heroMetaText}>
                      {MIAN_MART.deliveryTime} min
                    </Text>
                  </View>
                  <View style={styles.heroMetaItem}>
                    <Ionicons
                      name="bicycle-outline"
                      size={13}
                      color={colors.success}
                    />
                    <Text style={styles.heroMetaText}>Free delivery</Text>
                  </View>
                  <View style={styles.heroMetaItem}>
                    <Ionicons
                      name="bag-handle-outline"
                      size={12}
                      color={colors.textMuted}
                    />
                    <Text style={styles.heroMetaText}>
                      Min {formatPKR(MIAN_MART.minOrder)}
                    </Text>
                  </View>
                </View>
              </View>
              <Image source={MIAN_MART.image} style={styles.heroImage} />
            </LinearGradient>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.groupTrack}
          >
            {MIAN_MART.menu.map((menuGroup) => {
              const active = menuGroup.id === activeGroup;
              return (
                <Pressable
                  key={menuGroup.id}
                  onPress={() => setActiveGroup(menuGroup.id)}
                  style={({ pressed }) => [
                    styles.groupChip,
                    active && styles.groupChipActive,
                    pressed && styles.pressed,
                  ]}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  testID={`mart-group-${menuGroup.id}`}
                >
                  <Text
                    style={[
                      styles.groupText,
                      active && styles.groupTextActive,
                    ]}
                  >
                    {menuGroup.name}
                  </Text>
                  <Text
                    style={[
                      styles.groupCount,
                      active && styles.groupCountActive,
                    ]}
                  >
                    {menuGroup.items.length}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={styles.sectionHead}>
            <Text style={styles.sectionTitle}>{group.name}</Text>
            <Text style={styles.sectionSub}>
              {group.items.length} items - sample grocery prices
            </Text>
          </View>

          <View
            style={[styles.grid, { gap }]}
            onLayout={(event) => setGridWidth(event.nativeEvent.layout.width)}
            testID="mart-grid"
          >
            {group.items.map((item) => (
              <MartProductCard
                key={item.id}
                item={item}
                width={cardWidth}
              />
            ))}
          </View>

          <View style={styles.note}>
            <Ionicons
              name="information-circle-outline"
              size={15}
              color={colors.textMuted}
            />
            <Text style={styles.noteText}>
              Mian Mart is a demo grocery storefront in this prototype. Stock,
              pricing and delivery times are sample data.
            </Text>
          </View>

          <Pressable
            onPress={() => router.push('/shops')}
            style={({ pressed }) => [
              styles.backLink,
              pressed && styles.pressed,
            ]}
            accessibilityRole="button"
          >
            <Ionicons
              name="storefront-outline"
              size={14}
              color={colors.primary}
            />
            <Text style={styles.backLinkText}>Browse all shops</Text>
            <Ionicons
              name="arrow-forward"
              size={12}
              color={colors.primary}
            />
          </Pressable>
        </View>
        <View style={{ height: cartMatches ? 110 : spacing.huge }} />
      </ScrollView>

      {cartMatches ? (
        <CartBar
          count={itemCount}
          total={total}
          onPress={() => router.push('/cart')}
          style={[styles.cartBar, { bottom: insets.bottom + spacing.md }]}
        />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    paddingBottom: spacing.huge,
  },
  inner: {
    width: '100%',
    maxWidth: 1200,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingTop: spacing.xl,
  },
  pressed: {
    opacity: 0.85,
  },
  hero: {
    borderRadius: radius.xxl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.primaryLight,
  },
  heroGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.xl,
  },
  heroCopy: {
    flex: 1,
  },
  heroPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  heroPillText: {
    fontSize: 7.5,
    fontWeight: '900',
    color: colors.white,
    letterSpacing: 0.7,
  },
  heroTitle: {
    fontSize: 25,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: -0.6,
    marginTop: spacing.sm,
  },
  heroText: {
    fontSize: 11.5,
    lineHeight: 17,
    color: colors.textMuted,
    marginTop: 4,
    maxWidth: 520,
  },
  heroMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: spacing.md,
  },
  heroMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  heroMetaText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: colors.text,
  },
  heroImage: {
    width: 210,
    height: 150,
    borderRadius: radius.xl,
    backgroundColor: colors.white,
  },
  groupTrack: {
    gap: 8,
    paddingTop: spacing.xl,
    paddingBottom: spacing.sm,
  },
  groupChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    paddingHorizontal: 13,
    paddingVertical: 8,
  },
  groupChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  groupText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: colors.textMuted,
  },
  groupTextActive: {
    color: colors.white,
    fontWeight: '800',
  },
  groupCount: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.primary,
    backgroundColor: colors.primaryLight,
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  groupCountActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    color: colors.white,
  },
  sectionHead: {
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: -0.4,
  },
  sectionSub: {
    fontSize: 10.5,
    color: colors.textMuted,
    marginTop: 2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  productCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.xl,
    overflow: 'visible',
    ...shadows.subtle,
  },
  productMain: {
    borderRadius: radius.xl,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 116,
    backgroundColor: colors.surfaceAlt,
  },
  productBody: {
    padding: spacing.md,
  },
  productBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryLight,
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 2,
    marginBottom: 4,
  },
  productBadgeText: {
    fontSize: 7.5,
    fontWeight: '900',
    color: colors.primary,
  },
  productName: {
    fontSize: 12.5,
    fontWeight: '800',
    color: colors.text,
  },
  productDesc: {
    fontSize: 9.5,
    lineHeight: 13,
    color: colors.textMuted,
    marginTop: 2,
    minHeight: 26,
  },
  productPrice: {
    fontSize: 13.5,
    fontWeight: '900',
    color: colors.primary,
    marginTop: 5,
  },
  productAdd: {
    position: 'absolute',
    right: spacing.sm,
    bottom: spacing.sm,
  },
  note: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginTop: spacing.xxl,
  },
  noteText: {
    flex: 1,
    fontSize: 9.5,
    lineHeight: 15,
    color: colors.textMuted,
  },
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    marginTop: spacing.xl,
    backgroundColor: colors.pinkSoft,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  backLinkText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: colors.primary,
  },
  cartBar: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    maxWidth: 760,
    alignSelf: 'center',
  },
});
