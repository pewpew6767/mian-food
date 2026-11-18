import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import {
  CarouselTrack,
  useCarousel,
} from '@/components/marketplace/Carousel';
import MarketSectionHeader from '@/components/marketplace/MarketSectionHeader';
import QuickAddButton from '@/components/marketplace/QuickAddButton';
import useBreakpoint from '@/hooks/useBreakpoint';
import { colors, radius, shadows, spacing } from '@/theme';
import { formatPKR } from '@/utils/format';

export function ProductCard({ entry, width }) {
  const router = useRouter();
  const { restaurant, item } = entry;

  return (
    <View style={[styles.card, { width }]}>
      <Pressable
        onPress={() => router.push(`/food/${restaurant.id}/${item.id}`)}
        style={({ pressed }) => [styles.main, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel={`${item.name} from ${restaurant.name}, ${formatPKR(
          item.price
        )}`}
        testID={`product-${item.id}`}
      >
        <View style={styles.imageWrap}>
          <Image source={item.image} style={styles.image} />
          {item.badge ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.badge}</Text>
            </View>
          ) : null}
        </View>
        <View style={styles.body}>
          {entry.label ? (
            <Text style={styles.label}>{entry.label}</Text>
          ) : null}
          <Text numberOfLines={1} style={styles.name}>
            {item.name}
          </Text>
          <Text numberOfLines={1} style={styles.restaurant}>
            {restaurant.name}
          </Text>
          <View style={styles.metaRow}>
            <Ionicons name="star" size={11} color={colors.star} />
            <Text style={styles.rating}>{restaurant.rating}</Text>
            <Text style={styles.dot}>-</Text>
            <Ionicons
              name="time-outline"
              size={11}
              color={colors.textMuted}
            />
            <Text style={styles.meta}>{restaurant.deliveryTime} min</Text>
          </View>
          <Text style={styles.price}>{formatPKR(item.price)}</Text>
        </View>
      </Pressable>
      <QuickAddButton
        restaurant={restaurant}
        item={item}
        size={32}
        style={styles.add}
      />
    </View>
  );
}

export default function ProductRail({
  title,
  subtitle,
  items,
  actionLabel,
  onAction,
  carouselId,
}) {
  const { isDesktop, isTablet } = useBreakpoint();
  const cardWidth = isDesktop ? 204 : isTablet ? 184 : 164;
  const carousel = useCarousel();

  return (
    <View style={styles.section}>
      <MarketSectionHeader
        title={title}
        subtitle={subtitle}
        actionLabel={actionLabel}
        onAction={onAction}
        carousel={carousel}
        carouselId={carouselId}
      />
      <CarouselTrack carousel={carousel} testID={carouselId}>
        {items.map((entry) => (
          <ProductCard key={entry.key} entry={entry} width={cardWidth} />
        ))}
      </CarouselTrack>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: spacing.xxxl,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'visible',
    ...shadows.subtle,
  },
  main: {
    borderRadius: radius.xl,
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.94,
  },
  imageWrap: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 138,
    backgroundColor: colors.surfaceAlt,
  },
  badge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: colors.white,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.sm,
    ...shadows.subtle,
  },
  badgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.2,
  },
  body: {
    padding: spacing.md,
  },
  label: {
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: colors.primary,
    marginBottom: 2,
  },
  name: {
    fontSize: 13.5,
    fontWeight: '800',
    color: colors.text,
  },
  restaurant: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 6,
  },
  rating: {
    fontSize: 10.5,
    fontWeight: '800',
    color: colors.text,
  },
  dot: {
    fontSize: 10,
    color: colors.textLight,
    marginHorizontal: 1,
  },
  meta: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textMuted,
  },
  price: {
    fontSize: 14.5,
    fontWeight: '900',
    color: colors.text,
    marginTop: 7,
  },
  add: {
    position: 'absolute',
    right: spacing.sm + 2,
    bottom: spacing.md,
  },
});
