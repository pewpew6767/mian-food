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

function DealCard({ entry, width }) {
  const router = useRouter();
  const { restaurant, item, offerPrice, originalPrice, description } = entry;

  return (
    <View style={[styles.card, { width }]}>
      <Pressable
        onPress={() => router.push(`/food/${restaurant.id}/${item.id}`)}
        style={({ pressed }) => [styles.main, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel={`${item.name} deal from ${restaurant.name}`}
        testID={`deal-${item.id}`}
      >
        <View style={styles.imageWrap}>
          <Image source={item.image} style={styles.image} />
          <View style={styles.discount}>
            <Text style={styles.discountText}>
              {restaurant.discount}% OFF
            </Text>
          </View>
          <View style={styles.timeChip}>
            <Ionicons name="time-outline" size={11} color={colors.text} />
            <Text style={styles.timeText}>{restaurant.deliveryTime} min</Text>
          </View>
        </View>
        <View style={styles.body}>
          <View style={styles.titleRow}>
            <Text numberOfLines={1} style={styles.name}>
              {item.name}
            </Text>
            <View style={styles.rating}>
              <Ionicons name="star" size={10} color={colors.star} />
              <Text style={styles.ratingText}>{restaurant.rating}</Text>
            </View>
          </View>
          <Text style={styles.restaurant}>{restaurant.name}</Text>
          <Text numberOfLines={2} style={styles.description}>
            {description}
          </Text>
          <View style={styles.priceRow}>
            <Text style={styles.offer}>{formatPKR(offerPrice)}</Text>
            <Text style={styles.original}>{formatPKR(originalPrice)}</Text>
          </View>
        </View>
      </Pressable>
      <QuickAddButton
        restaurant={restaurant}
        item={item}
        size={34}
        style={styles.add}
      />
    </View>
  );
}

export default function DealsRail({ deals, onSeeAll }) {
  const { isDesktop, isTablet } = useBreakpoint();
  const width = isDesktop ? 276 : isTablet ? 252 : 238;
  const carousel = useCarousel();

  return (
    <View style={styles.section}>
      <MarketSectionHeader
        title="Your daily deals"
        subtitle="Restaurant discounts applied automatically at checkout"
        actionLabel="View all deals"
        onAction={onSeeAll}
        carousel={carousel}
        carouselId="deals"
      />
      <CarouselTrack carousel={carousel} testID="deals">
        {deals.map((entry) => (
          <DealCard key={entry.key} entry={entry} width={width} />
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
    height: 142,
    backgroundColor: colors.surfaceAlt,
  },
  discount: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: colors.primary,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: radius.sm,
  },
  discountText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  timeChip: {
    position: 'absolute',
    bottom: spacing.sm,
    left: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  timeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: colors.text,
  },
  body: {
    padding: spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  name: {
    flex: 1,
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: colors.successLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
  },
  ratingText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: colors.success,
  },
  restaurant: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 3,
  },
  description: {
    fontSize: 11,
    lineHeight: 16,
    color: colors.textMuted,
    marginTop: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 7,
    marginTop: 8,
  },
  offer: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.primary,
  },
  original: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textLight,
    textDecorationLine: 'line-through',
  },
  add: {
    position: 'absolute',
    right: spacing.md,
    bottom: spacing.md,
  },
});
