import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CartBar from '@/components/CartBar';
import ConfirmDialog from '@/components/ConfirmDialog';
import EmptyState from '@/components/EmptyState';
import FilterChip from '@/components/FilterChip';
import MenuItemCard from '@/components/MenuItemCard';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';
import { getRestaurant } from '@/data/restaurants';
import useCartAdd from '@/hooks/useCartAdd';
import {
  colors,
  radius,
  shadows,
  spacing,
  type,
} from '@/theme';
import { formatCount, formatPKR } from '@/utils/format';

function InfoChip({ icon, value, label }) {
  return (
    <View style={styles.infoChip}>
      <Ionicons name={icon} size={15} color={colors.primary} />
      <Text style={styles.infoValue}>{value}</Text>
      <Text style={styles.infoLabel}>{label}</Text>
    </View>
  );
}

export default function RestaurantScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const restaurant = getRestaurant(id);
  const [activeGroup, setActiveGroup] = useState(
    restaurant?.menu[0]?.id || null
  );
  const scrollRef = useRef(null);
  const menuTop = useRef(0);
  const groupOffsets = useRef({});
  const { cart, itemCount, total } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { requestAdd, pending, confirmReplace, cancelReplace } =
    useCartAdd(restaurant);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset section when route id changes
    if (restaurant) setActiveGroup(restaurant.menu[0]?.id || null);
  }, [id]);

  if (!restaurant) {
    return (
      <EmptyState
        icon="restaurant-outline"
        title="Restaurant not found"
        message="This restaurant is no longer available."
        actionLabel="Back to home"
        onAction={() => router.replace('/')}
      />
    );
  }

  const goToGroup = (groupId) => {
    setActiveGroup(groupId);
    const offset = groupOffsets.current[groupId];
    if (offset == null) return;
    scrollRef.current?.scrollTo({ y: menuTop.current + offset - 10, animated: true });
  };

  const onShare = () => {
    Share.share({
      message: `${restaurant.name} on MIAN FOOD - ${restaurant.cuisines.join(
        ', '
      )}. Order now on the MIAN FOOD app!`,
    }).catch(() => {});
  };

  const cartMatches = cart && cart.restaurantId === restaurant.id && itemCount;

  return (
    <View style={styles.screen}>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View>
          <Image source={restaurant.image} style={styles.cover} />
          <LinearGradient
            colors={['rgba(17, 17, 24, 0.35)', 'rgba(17, 17, 24, 0)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.coverShade}
          />
        </View>

        <View style={styles.infoCard}>
          <View style={styles.titleRow}>
            <Image source={restaurant.image} style={styles.logoBadge} />
            <View style={styles.titleCopy}>
              <Text style={styles.name}>{restaurant.name}</Text>
              <Text style={styles.logoCaption}>Official store on MIAN FOOD</Text>
            </View>
          </View>
          <View style={styles.ratingLine}>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={11} color={colors.star} />
              <Text style={styles.ratingValue}>{restaurant.rating}</Text>
            </View>
            <Text style={styles.ratingCount}>
              {formatCount(restaurant.ratingCount)} ratings
            </Text>
            <Text style={styles.dot}>-</Text>
            <Text style={styles.ratingCount}>{restaurant.distance}</Text>
            <Text style={styles.dot}>-</Text>
            <Text style={styles.ratingCount}>
              {restaurant.cuisines.join(', ')}
            </Text>
          </View>
          <Text style={styles.description}>{restaurant.description}</Text>

          <View style={styles.infoRow}>
            <InfoChip
              icon="time-outline"
              value={`${restaurant.deliveryTime} min`}
              label="Delivery"
            />
            <InfoChip
              icon="bicycle-outline"
              value={
                restaurant.deliveryFee === 0
                  ? 'Free'
                  : formatPKR(restaurant.deliveryFee)
              }
              label="Fee"
            />
            <InfoChip
              icon="bag-handle-outline"
              value={formatPKR(restaurant.minOrder)}
              label="Min order"
            />
          </View>

          {restaurant.discount > 0 ? (
            <View style={styles.discountStrip}>
              <Ionicons
                name="pricetag"
                size={14}
                color={colors.primary}
              />
              <Text style={styles.discountText}>
                {restaurant.discount}% off your entire order at this
                restaurant
              </Text>
            </View>
          ) : null}
        </View>

        <View
          style={styles.menuSection}
          onLayout={(event) => {
            menuTop.current = event.nativeEvent.layout.y;
          }}
        >
          <View style={styles.menuHead}>
            <Text style={styles.menuTitle}>Menu</Text>
            <Text style={styles.menuCount}>
              {restaurant.menu.reduce(
                (sum, menuGroup) => sum + menuGroup.items.length,
                0
              )}{' '}
              items
            </Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.menuChips}
          >
            {restaurant.menu.map((menuGroup) => (
              <FilterChip
                key={menuGroup.id}
                label={menuGroup.name}
                active={activeGroup === menuGroup.id}
                onPress={() => goToGroup(menuGroup.id)}
              />
            ))}
          </ScrollView>

          {restaurant.menu.map((menuGroup) => (
            <View
              key={menuGroup.id}
              style={styles.groupBlock}
              onLayout={(event) => {
                groupOffsets.current[menuGroup.id] =
                  event.nativeEvent.layout.y;
              }}
            >
              <Text style={styles.groupTitle}>{menuGroup.name}</Text>
              {menuGroup.items.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  onPress={() =>
                    router.push(`/food/${restaurant.id}/${item.id}`)
                  }
                  onAdd={() => requestAdd(item)}
                />
              ))}
            </View>
          ))}
        </View>
        <View style={{ height: cartMatches ? 120 : spacing.xxxl }} />
      </ScrollView>

      <View
        style={[styles.overlayHeader, { top: insets.top + spacing.sm }]}
      >
        <Pressable
          onPress={() => router.back()}
          style={styles.overlayButton}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </Pressable>
        <View style={styles.overlaySpacer} />
        <Pressable
          onPress={() => toggleFavorite(restaurant.id)}
          style={[styles.overlayButton, styles.overlayAction]}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={
            isFavorite(restaurant.id)
              ? `Remove ${restaurant.name} from favorites`
              : `Save ${restaurant.name} to favorites`
          }
          accessibilityState={{ selected: isFavorite(restaurant.id) }}
          testID={`detail-favorite-${restaurant.id}`}
        >
          <Ionicons
            name={isFavorite(restaurant.id) ? 'heart' : 'heart-outline'}
            size={20}
            color={isFavorite(restaurant.id) ? colors.primary : colors.text}
          />
        </Pressable>
        <Pressable
          onPress={onShare}
          style={styles.overlayButton}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Share restaurant"
        >
          <Ionicons
            name="share-social-outline"
            size={20}
            color={colors.text}
          />
        </Pressable>
      </View>

      {cartMatches ? (
        <CartBar
          count={itemCount}
          total={total}
          onPress={() => router.push('/cart')}
          style={[
            styles.cartBar,
            { bottom: insets.bottom + spacing.md },
          ]}
        />
      ) : null}

      <ConfirmDialog
        visible={!!pending}
        icon="cart"
        title="Start a new cart?"
        message={`Your cart has items from another restaurant. Adding this item will clear your current cart.`}
        confirmLabel="Start new cart"
        onConfirm={confirmReplace}
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
  scrollContent: {
    paddingBottom: spacing.md,
  },
  cover: {
    width: '100%',
    height: 240,
    backgroundColor: colors.surfaceAlt,
  },
  coverShade: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 110,
  },
  overlayHeader: {
    position: 'absolute',
    left: spacing.xl,
    right: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
  },
  overlaySpacer: {
    flex: 1,
  },
  overlayAction: {
    marginRight: spacing.sm,
  },
  overlayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.card,
  },
  infoCard: {
    marginTop: -spacing.xxl,
    marginHorizontal: spacing.lg,
    backgroundColor: colors.white,
    borderRadius: radius.xxl,
    padding: spacing.xl,
    ...shadows.card,
  },
  name: {
    ...type.h1,
    fontSize: 24,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  logoBadge: {
    width: 52,
    height: 52,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.white,
    backgroundColor: colors.surfaceAlt,
    ...shadows.subtle,
  },
  titleCopy: {
    flex: 1,
  },
  logoCaption: {
    fontSize: 10.5,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 2,
  },
  ratingLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.sm,
    flexWrap: 'wrap',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.successLight,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  ratingValue: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.success,
  },
  ratingCount: {
    fontSize: 10.5,
    fontWeight: '500',
    color: colors.textMuted,
  },
  dot: {
    color: colors.textLight,
    fontSize: 10,
  },
  description: {
    fontSize: 12.5,
    lineHeight: 18,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  infoChip: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
  },
  infoValue: {
    fontSize: 12.5,
    fontWeight: '800',
    color: colors.text,
  },
  infoLabel: {
    fontSize: 9.5,
    fontWeight: '500',
    color: colors.textMuted,
  },
  discountStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 9,
    marginTop: spacing.md,
  },
  discountText: {
    flex: 1,
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  menuSection: {
    paddingHorizontal: spacing.xl,
    marginTop: spacing.xxl,
  },
  menuHead: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  menuCount: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
  },
  groupBlock: {
    marginTop: spacing.lg,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.2,
    marginBottom: spacing.xs,
  },
  menuTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.3,
  },
  menuChips: {
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  cartBar: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
  },
});
