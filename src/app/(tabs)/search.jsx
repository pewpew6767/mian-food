import { useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CartButton from '@/components/CartButton';
import DishCard from '@/components/DishCard';
import EmptyState from '@/components/EmptyState';
import FilterChip from '@/components/FilterChip';
import RestaurantCard from '@/components/RestaurantCard';
import SearchBar from '@/components/SearchBar';
import {
  CarouselArrows,
  CarouselTrack,
  useCarousel,
} from '@/components/marketplace/Carousel';
import { CATEGORIES } from '@/data/categories';
import { RESTAURANTS } from '@/data/restaurants';
import { colors, spacing, type } from '@/theme';
import { pluralize } from '@/utils/format';

export default function SearchScreen() {
  const params = useLocalSearchParams();
  const [query, setQuery] = useState('');
  const [cuisine, setCuisine] = useState('all');
  const [sort, setSort] = useState('relevance');
  const [deals, setDeals] = useState(false);
  const [free, setFree] = useState(false);
  const dishCarousel = useCarousel();

  useEffect(() => {
    if (!params.t) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync filters from navigation params
    setQuery(typeof params.q === 'string' ? params.q : '');
    setCuisine(params.cuisine ? String(params.cuisine) : 'all');
    setSort(
      params.sort === 'time'
        ? 'time'
        : params.sort === 'rating'
          ? 'rating'
          : 'relevance'
    );
    setDeals(params.filter === 'deals');
    setFree(params.filter === 'free');
  }, [params.t]);

  const cuisineName =
    cuisine === 'all'
      ? null
      : CATEGORIES.find((category) => category.id === cuisine)?.name || null;

  const filtered = useMemo(() => {
    const text = query.trim().toLowerCase();
    const list = RESTAURANTS.filter((restaurant) => {
      if (
        cuisineName &&
        !restaurant.cuisines.some(
          (name) => name.toLowerCase() === cuisineName.toLowerCase()
        )
      ) {
        return false;
      }
      if (deals && !(restaurant.discount > 0)) return false;
      if (free && restaurant.deliveryFee !== 0) return false;
      if (!text) return true;
      const inName = restaurant.name.toLowerCase().includes(text);
      const inCuisine = restaurant.cuisines
        .join(' ')
        .toLowerCase()
        .includes(text);
      const inMenu = restaurant.menu.some((group) =>
        group.items.some(
          (item) =>
            item.name.toLowerCase().includes(text) ||
            item.description.toLowerCase().includes(text)
        )
      );
      return inName || inCuisine || inMenu;
    });

    if (sort === 'rating') {
      return [...list].sort((a, b) => b.rating - a.rating);
    }
    if (sort === 'time') {
      return [...list].sort((a, b) => a.deliveryTime - b.deliveryTime);
    }
    return list;
  }, [cuisineName, deals, free, query, sort]);

  const dishes = useMemo(() => {
    const text = query.trim().toLowerCase();
    if (text.length < 2) return [];
    const matches = [];
    RESTAURANTS.forEach((restaurant) => {
      if (
        cuisineName &&
        !restaurant.cuisines.some(
          (name) => name.toLowerCase() === cuisineName.toLowerCase()
        )
      ) {
        return;
      }
      restaurant.menu.forEach((group) => {
        group.items.forEach((item) => {
          if (
            item.name.toLowerCase().includes(text) ||
            item.description.toLowerCase().includes(text)
          ) {
            matches.push({ restaurant, item });
          }
        });
      });
    });
    return matches.slice(0, 10);
  }, [cuisineName, query]);

  const hasFilters =
    cuisine !== 'all' || deals || free || sort !== 'relevance' || !!query.trim();

  const resetFilters = () => {
    setQuery('');
    setCuisine('all');
    setSort('relevance');
    setDeals(false);
    setFree(false);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.title}>Explore</Text>
          <Text style={styles.subtitle}>
            {RESTAURANTS.length} restaurants around you
          </Text>
        </View>
        <CartButton />
      </View>

      <SearchBar
        value={query}
        onChangeText={setQuery}
        style={styles.searchBar}
        onSubmit={() => {}}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={styles.content}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
        >
          <FilterChip
            label="All"
            active={cuisine === 'all'}
            onPress={() => setCuisine('all')}
          />
          {CATEGORIES.map((category) => (
            <FilterChip
              key={category.id}
              label={category.name}
              icon={category.icon}
              active={cuisine === category.id}
              onPress={() => setCuisine(category.id)}
            />
          ))}
        </ScrollView>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
        >
          <FilterChip
            label="Top rated"
            icon="star"
            active={sort === 'rating'}
            onPress={() =>
              setSort(sort === 'rating' ? 'relevance' : 'rating')
            }
          />
          <FilterChip
            label="Fastest"
            icon="flash"
            active={sort === 'time'}
            onPress={() => setSort(sort === 'time' ? 'relevance' : 'time')}
          />
          <FilterChip
            label="Deals"
            icon="pricetag"
            active={deals}
            onPress={() => setDeals(!deals)}
          />
          <FilterChip
            label="Free delivery"
            icon="bicycle"
            active={free}
            onPress={() => setFree(!free)}
          />
        </ScrollView>

        {dishes.length > 0 ? (
          <View style={styles.dishSection}>
            <View style={styles.dishHead}>
              <Text style={styles.sectionTitle}>Dishes</Text>
              <CarouselArrows
                carousel={dishCarousel}
                label="dishes"
                testIDPrefix="dishes"
              />
            </View>
            <CarouselTrack
              carousel={dishCarousel}
              contentContainerStyle={styles.dishTrack}
            >
              {dishes.map((entry) => (
                <DishCard
                  key={`${entry.restaurant.id}-${entry.item.id}`}
                  restaurant={entry.restaurant}
                  item={entry.item}
                  width={172}
                />
              ))}
            </CarouselTrack>
          </View>
        ) : null}

        <View style={styles.resultsHead}>
          <Text style={styles.resultsCount}>
            {filtered.length}{' '}
            {pluralize(filtered.length, 'restaurant')}
          </Text>
          {hasFilters ? (
            <Text style={styles.reset} onPress={resetFilters}>
              Clear filters
            </Text>
          ) : null}
        </View>

        <View style={styles.list}>
          {filtered.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              variant="row"
            />
          ))}
        </View>

        {filtered.length === 0 ? (
          <EmptyState
            icon="search-outline"
            title="No results found"
            message="Try a different dish, cuisine or clear your filters."
            actionLabel="Clear filters"
            onAction={resetFilters}
          />
        ) : null}
        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
  },
  title: {
    ...type.h1,
    fontSize: 24,
  },
  subtitle: {
    fontSize: 11.5,
    fontWeight: '500',
    color: colors.textMuted,
    marginTop: 2,
  },
  searchBar: {
    marginHorizontal: spacing.xl,
    marginTop: spacing.md,
  },
  content: {
    paddingTop: spacing.md,
  },
  chipRow: {
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  dishSection: {
    marginTop: spacing.lg,
  },
  dishHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
  },
  dishTrack: {
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
    paddingBottom: spacing.xs,
  },
  resultsHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  resultsCount: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
  },
  reset: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  list: {
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  bottomSpace: {
    height: spacing.xxxl,
  },
});
