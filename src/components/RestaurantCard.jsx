import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFavorites } from '@/context/FavoritesContext';
import { colors, radius, shadows, spacing } from '@/theme';
import { formatCount, formatPKR } from '@/utils/format';

function FavoriteButton({ restaurant, small = false }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(restaurant.id);
  return (
    <Pressable
      onPress={() => toggleFavorite(restaurant.id)}
      hitSlop={6}
      style={({ pressed }) => [
        small ? styles.favoriteSmall : styles.favorite,
        pressed && styles.favoritePressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={
        active
          ? `Remove ${restaurant.name} from favorites`
          : `Save ${restaurant.name} to favorites`
      }
      accessibilityState={{ selected: active }}
      testID={`favorite-${restaurant.id}`}
    >
      <Ionicons
        name={active ? 'heart' : 'heart-outline'}
        size={small ? 16 : 18}
        color={active ? colors.primary : colors.text}
      />
    </Pressable>
  );
}

function MetaRow({ restaurant, dense = false }) {
  return (
    <View style={styles.metaRow}>
      <View style={styles.ratingPill}>
        <Ionicons name="star" size={10} color={colors.success} />
        <Text style={styles.ratingText}>{restaurant.rating}</Text>
      </View>
      <Text style={styles.metaText}>
        ({formatCount(restaurant.ratingCount)})
      </Text>
      <Text style={styles.dot}>-</Text>
      <Ionicons name="time-outline" size={12} color={colors.textMuted} />
      <Text style={styles.metaText}>{restaurant.deliveryTime} min</Text>
      {!dense || restaurant.deliveryFee !== 0 ? (
        <>
          <Text style={styles.dot}>-</Text>
          <Ionicons
            name="bicycle-outline"
            size={13}
            color={
              restaurant.deliveryFee === 0
                ? colors.success
                : colors.textMuted
            }
          />
          <Text
            style={[
              styles.metaText,
              restaurant.deliveryFee === 0 && styles.freeText,
            ]}
          >
            {restaurant.deliveryFee === 0
              ? 'Free delivery'
              : formatPKR(restaurant.deliveryFee)}
          </Text>
        </>
      ) : null}
    </View>
  );
}

export default function RestaurantCard({
  restaurant,
  width,
  variant = 'grid',
}) {
  const router = useRouter();
  const open = () => router.push(`/restaurant/${restaurant.id}`);

  if (variant === 'row') {
    return (
      <View style={[styles.rowCard, width ? { width } : styles.rowFluid]}>
        <Pressable
          onPress={open}
          style={({ pressed }) => [
            styles.rowPress,
            pressed && styles.pressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel={`${restaurant.name}, ${restaurant.cuisines.join(
            ', '
          )}`}
          testID={`restaurant-row-${restaurant.id}`}
        >
          <View style={styles.rowImageWrap}>
            <Image source={restaurant.image} style={styles.rowImage} />
            {restaurant.discount > 0 ? (
              <View style={styles.rowDiscount}>
                <Text style={styles.rowDiscountText}>
                  {restaurant.discount}% OFF
                </Text>
              </View>
            ) : null}
          </View>
          <View style={styles.rowBody}>
            <Text numberOfLines={1} style={styles.name}>
              {restaurant.name}
            </Text>
            <Text numberOfLines={1} style={styles.cuisines}>
              {restaurant.cuisines.join(', ')}
            </Text>
            <MetaRow restaurant={restaurant} dense />
            <View style={styles.rowFoot}>
              {restaurant.badge ? (
                <Text style={styles.rowPromo}>{restaurant.badge}</Text>
              ) : (
                <Text style={styles.rowPromo}>
                  Rs. {formatPKR(restaurant.minOrder)} min order
                </Text>
              )}
            </View>
          </View>
        </Pressable>
        <View style={styles.rowFav}>
          <FavoriteButton restaurant={restaurant} small />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.card, { width: width || 250 }]}>
      <Pressable
        onPress={open}
        style={({ pressed }) => [styles.press, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel={`${restaurant.name}, ${restaurant.cuisines.join(
          ', '
        )}`}
        testID={`restaurant-${restaurant.id}`}
      >
        <View style={styles.imageWrap}>
          <Image source={restaurant.image} style={styles.image} />
          {restaurant.discount > 0 ? (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>
                {restaurant.discount}% OFF
              </Text>
            </View>
          ) : null}
          {restaurant.badge ? (
            <View style={styles.promoBadge}>
              <Ionicons
                name="pricetag"
                size={10}
                color={colors.primaryDark}
              />
              <Text style={styles.promoText}>{restaurant.badge}</Text>
            </View>
          ) : null}
          {restaurant.deliveryFee === 0 ? (
            <View style={styles.freeBadge}>
              <Ionicons name="bicycle" size={11} color={colors.success} />
              <Text style={styles.freeBadgeText}>Free delivery</Text>
            </View>
          ) : null}
        </View>
        <View style={styles.body}>
          <View style={styles.nameLine}>
            <Text numberOfLines={1} style={styles.name}>
              {restaurant.name}
            </Text>
            <Ionicons
              name="chevron-forward"
              size={14}
              color={colors.textLight}
            />
          </View>
          <Text numberOfLines={1} style={styles.cuisines}>
            {restaurant.cuisines.join(', ')} - {restaurant.distance}
          </Text>
          <MetaRow restaurant={restaurant} />
          {restaurant.discount > 0 ? (
            <View style={styles.dealLine}>
              <Ionicons
                name="pricetag-outline"
                size={11}
                color={colors.primary}
              />
              <Text style={styles.dealText}>
                Save {restaurant.discount}% on your order
              </Text>
            </View>
          ) : null}
        </View>
      </Pressable>
      <View style={styles.favoriteWrap}>
        <FavoriteButton restaurant={restaurant} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadows.card,
  },
  press: {
    flex: 1,
  },
  pressed: {
    opacity: 0.93,
  },
  imageWrap: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 148,
    backgroundColor: colors.surfaceAlt,
  },
  discountBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.sm,
    ...shadows.subtle,
  },
  discountText: {
    color: colors.white,
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
  promoBadge: {
    position: 'absolute',
    left: spacing.sm,
    bottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 7,
    paddingVertical: 3.5,
    borderRadius: radius.sm,
  },
  promoText: {
    color: colors.primaryDark,
    fontSize: 9,
    fontWeight: '800',
  },
  freeBadge: {
    position: 'absolute',
    right: spacing.sm,
    bottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.white,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: radius.sm,
    ...shadows.subtle,
  },
  freeBadgeText: {
    color: colors.success,
    fontSize: 8.5,
    fontWeight: '800',
  },
  favoriteWrap: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
  },
  favorite: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.subtle,
  },
  favoriteSmall: {
    width: 27,
    height: 27,
    borderRadius: 14,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.subtle,
  },
  favoritePressed: {
    transform: [{ scale: 0.92 }],
  },
  body: {
    padding: spacing.md,
    gap: 3,
  },
  nameLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  name: {
    flex: 1,
    fontSize: 15,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: -0.2,
  },
  cuisines: {
    fontSize: 10.5,
    fontWeight: '500',
    color: colors.textMuted,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    flexWrap: 'wrap',
    marginTop: 2,
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: colors.successLight,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ratingText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: colors.success,
  },
  metaText: {
    fontSize: 9.5,
    fontWeight: '600',
    color: colors.textMuted,
  },
  dot: {
    fontSize: 9,
    color: colors.textLight,
  },
  freeText: {
    color: colors.success,
    fontWeight: '800',
  },
  dealLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 6,
  },
  dealText: {
    flex: 1,
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary,
  },
  rowCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadows.card,
  },
  rowFluid: {
    width: '100%',
  },
  rowPress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
  },
  rowImageWrap: {
    position: 'relative',
  },
  rowImage: {
    width: 96,
    height: 96,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceAlt,
  },
  rowDiscount: {
    position: 'absolute',
    bottom: 5,
    left: 5,
    backgroundColor: colors.primary,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  rowDiscountText: {
    color: colors.white,
    fontSize: 8,
    fontWeight: '900',
  },
  rowBody: {
    flex: 1,
    gap: 2,
    paddingRight: 26,
  },
  rowFoot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 1,
  },
  rowPromo: {
    fontSize: 9.5,
    fontWeight: '800',
    color: colors.primary,
  },
  rowFav: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
  },
});
