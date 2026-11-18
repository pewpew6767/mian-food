import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import {
  CarouselTrack,
  useCarousel,
} from '@/components/marketplace/Carousel';
import MarketSectionHeader from '@/components/marketplace/MarketSectionHeader';
import useBreakpoint from '@/hooks/useBreakpoint';
import { colors, shadows, spacing } from '@/theme';

export default function CuisineRail({
  cuisines,
  activeCuisine,
  onSelect,
  onSeeAll,
}) {
  const { isDesktop, isTablet } = useBreakpoint();
  const cardWidth = isDesktop ? 140 : isTablet ? 124 : 104;
  const imageSize = isDesktop ? 114 : isTablet ? 100 : 84;
  const carousel = useCarousel();

  return (
    <View style={styles.section}>
      <MarketSectionHeader
        title="Cuisines for you"
        subtitle="From desi comfort food to coffee and cake"
        actionLabel="All cuisines"
        onAction={onSeeAll}
        carousel={carousel}
        carouselId="cuisines"
      />
      <CarouselTrack
        carousel={carousel}
        testID="cuisines"
        contentContainerStyle={styles.track}
      >
        {cuisines.map((cuisine) => {
          const active = activeCuisine === cuisine.name;
          return (
            <Pressable
              key={cuisine.id}
              onPress={() => onSelect(active ? 'all' : cuisine.name)}
              style={({ pressed }) => [
                styles.item,
                { width: cardWidth },
                pressed && styles.pressed,
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              testID={`cuisine-${cuisine.id}`}
            >
              <View
                style={[
                  styles.imageWrap,
                  { width: imageSize, height: imageSize },
                  active && styles.imageWrapActive,
                ]}
              >
                <Image
                  source={cuisine.image}
                  style={[
                    styles.image,
                    { width: imageSize - 8, height: imageSize - 8 },
                  ]}
                />
              </View>
              <Text
                numberOfLines={1}
                style={[styles.label, active && styles.labelActive]}
              >
                {cuisine.name}
              </Text>
            </Pressable>
          );
        })}
      </CarouselTrack>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: spacing.xxxl,
  },
  track: {
    gap: spacing.sm,
    paddingBottom: spacing.xs,
  },
  item: {
    alignItems: 'center',
    gap: 7,
  },
  pressed: {
    opacity: 0.86,
    transform: [{ scale: 0.98 }],
  },
  imageWrap: {
    borderRadius: 26,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.subtle,
  },
  imageWrapActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  image: {
    borderRadius: 21,
    backgroundColor: colors.surfaceAlt,
  },
  label: {
    fontSize: 11.5,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  labelActive: {
    color: colors.primary,
    fontWeight: '900',
  },
});
