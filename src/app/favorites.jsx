import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EmptyState from '@/components/EmptyState';
import PageTopBar from '@/components/PageTopBar';
import RestaurantCard from '@/components/RestaurantCard';
import { useFavorites } from '@/context/FavoritesContext';
import { RESTAURANTS } from '@/data/restaurants';
import useBreakpoint from '@/hooks/useBreakpoint';
import { colors, radius, spacing } from '@/theme';

export default function FavoritesScreen() {
  const router = useRouter();
  const { favorites, count } = useFavorites();
  const { isDesktop, isTablet } = useBreakpoint();
  const [gridWidth, setGridWidth] = useState(0);

  const saved = favorites
    .map((id) => RESTAURANTS.find((restaurant) => restaurant.id === id))
    .filter(Boolean);

  const cols = isDesktop ? 4 : isTablet ? 3 : 1;
  const gap = 14;
  const cardWidth =
    gridWidth > 0
      ? Math.floor((gridWidth - gap * (cols - 1)) / cols)
      : isDesktop
        ? 240
        : 280;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <PageTopBar
        title="Your favourites"
        subtitle={`${count} saved restaurant${count === 1 ? '' : 's'}`}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.inner}>
          <View style={styles.hero}>
            <View style={styles.heroIcon}>
              <Ionicons name="heart" size={22} color={colors.primary} />
            </View>
            <View style={styles.heroCopy}>
              <Text style={styles.heroTitle}>Restaurants you love</Text>
              <Text style={styles.heroText}>
                Tap the heart on any restaurant to save it here. Favourites are
                stored on this device only.
              </Text>
            </View>
          </View>

          {saved.length ? (
            <View
              style={[styles.grid, { gap }]}
              onLayout={(event) => setGridWidth(event.nativeEvent.layout.width)}
              testID="favorites-grid"
            >
              {saved.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  width={cardWidth}
                />
              ))}
            </View>
          ) : (
            <View style={styles.empty}>
              <EmptyState
                icon="heart-outline"
                title="No saved restaurants yet"
                message="Browse the marketplace and tap the heart on places you want to order from again."
                actionLabel="Browse restaurants"
                onAction={() => router.replace('/')}
              />
            </View>
          )}
        </View>
      </ScrollView>
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
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.pinkSoft,
    borderWidth: 1,
    borderColor: colors.primaryLight,
    borderRadius: radius.xxl,
    padding: spacing.lg,
  },
  heroIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCopy: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: colors.text,
  },
  heroText: {
    fontSize: 11,
    lineHeight: 16,
    color: colors.textMuted,
    marginTop: 3,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.xl,
  },
  empty: {
    minHeight: 420,
    justifyContent: 'center',
  },
});
