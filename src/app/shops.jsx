import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EmptyState from '@/components/EmptyState';
import FilterChip from '@/components/FilterChip';
import PageTopBar from '@/components/PageTopBar';
import RestaurantCard from '@/components/RestaurantCard';
import { CUISINES } from '@/data/categories';
import { RESTAURANTS } from '@/data/restaurants';
import useBreakpoint from '@/hooks/useBreakpoint';
import { colors, radius, shadows, spacing } from '@/theme';

export default function ShopsScreen() {
  const router = useRouter();
  const { isMobile } = useBreakpoint();
  const [cuisine, setCuisine] = useState('all');
  const [free, setFree] = useState(false);
  const [deals, setDeals] = useState(false);
  const [gridWidth, setGridWidth] = useState(0);

  const cuisineName =
    cuisine === 'all'
      ? null
      : CUISINES.find((entry) => entry.id === cuisine)?.name || null;

  const shops = useMemo(
    () =>
      RESTAURANTS.filter((restaurant) => {
        if (
          cuisineName &&
          !restaurant.cuisines.some((name) => name === cuisineName)
        ) {
          return false;
        }
        if (free && restaurant.deliveryFee !== 0) return false;
        if (deals && !(restaurant.discount > 0)) return false;
        return true;
      }),
    [cuisineName, free, deals]
  );

  const cols = isMobile ? 1 : 2;
  const gap = 14;
  const cardWidth =
    gridWidth > 0 ? Math.floor((gridWidth - gap * (cols - 1)) / cols) : 520;

  const reset = () => {
    setCuisine('all');
    setFree(false);
    setDeals(false);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <PageTopBar
        title="Shops near you"
        subtitle={`${RESTAURANTS.length} restaurants and stores in Faisalabad`}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.inner}>
          <View style={styles.hero}>
            <View style={styles.heroIcon}>
              <Ionicons
                name="storefront"
                size={22}
                color={colors.primary}
              />
            </View>
            <View style={styles.heroCopy}>
              <Text style={styles.heroTitle}>Faisalabad food directory</Text>
              <Text style={styles.heroText}>
                Browse every restaurant and store in the MIAN FOOD demo
                marketplace. Menus, fees and offers are sample data.
              </Text>
            </View>
            <View style={styles.heroStats}>
              <Text style={styles.heroStatValue}>{RESTAURANTS.length}</Text>
              <Text style={styles.heroStatLabel}>shops</Text>
            </View>
          </View>

          <Pressable
            onPress={() => router.push('/mart')}
            style={({ pressed }) => [
              styles.martRow,
              pressed && styles.pressed,
            ]}
            accessibilityRole="button"
            testID="shops-mart"
          >
            <View style={styles.martIcon}>
              <Ionicons name="basket" size={17} color={colors.primary} />
            </View>
            <View style={styles.martCopy}>
              <Text style={styles.martTitle}>Mian Mart groceries</Text>
              <Text style={styles.martText}>
                Produce, dairy and pantry essentials in 30 minutes
              </Text>
            </View>
            <Ionicons
              name="arrow-forward"
              size={14}
              color={colors.primary}
            />
          </Pressable>

          <Text style={styles.filterLabel}>Cuisine</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipRow}
          >
            <FilterChip
              label="All cuisines"
              active={cuisine === 'all'}
              onPress={() => setCuisine('all')}
            />
            {CUISINES.map((entry) => (
              <FilterChip
                key={entry.id}
                label={entry.name}
                active={cuisine === entry.id}
                onPress={() =>
                  setCuisine(cuisine === entry.id ? 'all' : entry.id)
                }
              />
            ))}
          </ScrollView>

          <View style={styles.toggleRow}>
            <FilterChip
              label="Free delivery"
              icon="bicycle"
              active={free}
              onPress={() => setFree(!free)}
            />
            <FilterChip
              label="Deals"
              icon="pricetag"
              active={deals}
              onPress={() => setDeals(!deals)}
            />
          </View>

          <View style={styles.resultsHead}>
            <Text style={styles.resultsText}>
              {shops.length} shop{shops.length === 1 ? '' : 's'} found
            </Text>
            {cuisine !== 'all' || free || deals ? (
              <Pressable
                onPress={reset}
                hitSlop={6}
                accessibilityRole="button"
              >
                <Text style={styles.resetText}>Clear filters</Text>
              </Pressable>
            ) : null}
          </View>

          {shops.length ? (
            <View
              style={[styles.grid, { gap }]}
              onLayout={(event) => setGridWidth(event.nativeEvent.layout.width)}
              testID="shops-grid"
            >
              {shops.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  variant="row"
                  width={cardWidth}
                />
              ))}
            </View>
          ) : (
            <View style={styles.empty}>
              <EmptyState
                icon="storefront-outline"
                title="No shops match"
                message="Try another cuisine or clear the delivery filters."
                actionLabel="Clear filters"
                onAction={reset}
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
  pressed: {
    opacity: 0.85,
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
    ...shadows.subtle,
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
    fontSize: 10.5,
    lineHeight: 16,
    color: colors.textMuted,
    marginTop: 3,
  },
  heroStats: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
  },
  heroStatValue: {
    fontSize: 17,
    fontWeight: '900',
    color: colors.primary,
  },
  heroStatLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  martRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.xl,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  martIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  martCopy: {
    flex: 1,
  },
  martTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: colors.text,
  },
  martText: {
    fontSize: 9.5,
    color: colors.textMuted,
    marginTop: 1,
  },
  filterLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: colors.textLight,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginTop: spacing.xl,
    marginBottom: 7,
  },
  chipRow: {
    gap: 7,
    paddingBottom: 2,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 7,
    marginTop: spacing.sm,
  },
  resultsHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  resultsText: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.text,
  },
  resetText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: colors.primary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  empty: {
    minHeight: 360,
    justifyContent: 'center',
  },
});
