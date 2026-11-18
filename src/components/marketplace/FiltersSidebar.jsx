import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CUISINES } from '@/data/categories';
import { colors, radius, shadows, spacing } from '@/theme';

export const SORT_OPTIONS = [
  { id: 'relevance', label: 'Relevance', icon: 'sparkles-outline' },
  { id: 'fastest', label: 'Fastest delivery', icon: 'flash-outline' },
  { id: 'distance', label: 'Distance', icon: 'navigate-outline' },
  { id: 'top', label: 'Top rated', icon: 'star-outline' },
];

const RATINGS = [
  { value: 0, label: 'Any' },
  { value: 4, label: '4.0+' },
  { value: 4.3, label: '4.3+' },
  { value: 4.5, label: '4.5+' },
];

const TIMES = [
  { value: 0, label: 'Any' },
  { value: 20, label: '20 min' },
  { value: 30, label: '30 min' },
  { value: 40, label: '40 min' },
];

const PRICES = [
  { id: 'u500', label: 'Under 500', max: 500 },
  { id: 'u800', label: 'Under 800', max: 800 },
  { id: 'u1200', label: 'Under 1200', max: 1200 },
  { id: 'above', label: 'Above 1200', min: 1200 },
];

export const DEFAULT_FILTERS = {
  sort: 'relevance',
  freeDelivery: false,
  deals: false,
  rating: 0,
  cuisine: null,
  price: null,
  time: 0,
};

export function countActiveFilters(filters) {
  let active = 0;
  if (filters.sort !== 'relevance') active += 1;
  if (filters.freeDelivery) active += 1;
  if (filters.deals) active += 1;
  if (filters.rating) active += 1;
  if (filters.cuisine) active += 1;
  if (filters.price) active += 1;
  if (filters.time) active += 1;
  return active;
}

function distanceValue(restaurant) {
  return parseFloat(String(restaurant.distance)) || 99;
}

export function applyFilters(restaurants, filters) {
  let list = restaurants.slice();

  if (filters.freeDelivery) {
    list = list.filter((restaurant) => restaurant.deliveryFee === 0);
  }
  if (filters.deals) {
    list = list.filter((restaurant) => restaurant.discount > 0);
  }
  if (filters.rating) {
    list = list.filter((restaurant) => restaurant.rating >= filters.rating);
  }
  if (filters.cuisine) {
    const cuisine = CUISINES.find((entry) => entry.id === filters.cuisine);
    if (cuisine) {
      list = list.filter((restaurant) =>
        restaurant.cuisines.includes(cuisine.name)
      );
    }
  }
  if (filters.price) {
    const bucket = PRICES.find((entry) => entry.id === filters.price);
    if (bucket) {
      list = list.filter((restaurant) => {
        const minOrder = restaurant.minOrder || 0;
        if (bucket.max != null && minOrder > bucket.max) return false;
        if (bucket.min != null && minOrder < bucket.min) return false;
        return true;
      });
    }
  }
  if (filters.time) {
    list = list.filter(
      (restaurant) => restaurant.deliveryTime <= filters.time
    );
  }

  if (filters.sort === 'fastest') {
    list.sort((a, b) => a.deliveryTime - b.deliveryTime);
  } else if (filters.sort === 'distance') {
    list.sort((a, b) => distanceValue(a) - distanceValue(b));
  } else if (filters.sort === 'top') {
    list.sort((a, b) => b.rating - a.rating);
  }

  return list;
}

function SectionLabel({ children }) {
  return <Text style={styles.sectionLabel}>{children}</Text>;
}

function SortRow({ option, active, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.sortRow,
        active && styles.sortRowActive,
        pressed && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      testID={`filter-sort-${option.id}`}
    >
      <Ionicons
        name={option.icon}
        size={14}
        color={active ? colors.primary : colors.textMuted}
      />
      <Text style={[styles.sortText, active && styles.sortTextActive]}>
        {option.label}
      </Text>
      <View style={[styles.radio, active && styles.radioActive]}>
        {active ? <View style={styles.radioDot} /> : null}
      </View>
    </Pressable>
  );
}

function ToggleRow({ label, hint, active, onPress, testID }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.toggleRow, pressed && styles.pressed]}
      accessibilityRole="switch"
      accessibilityState={{ checked: active }}
      testID={testID}
    >
      <View style={styles.toggleCopy}>
        <Text style={styles.toggleLabel}>{label}</Text>
        {hint ? <Text style={styles.toggleHint}>{hint}</Text> : null}
      </View>
      <View style={[styles.switch, active && styles.switchOn]}>
        <View style={[styles.knob, active && styles.knobOn]} />
      </View>
    </Pressable>
  );
}

function Chip({ label, active, onPress, testID }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        active && styles.chipActive,
        pressed && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      testID={testID}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

export default function FiltersSidebar({
  filters,
  onChange,
  onReset,
  compact = false,
  style,
}) {
  const [showAllCuisines, setShowAllCuisines] = useState(false);
  const activeCount = countActiveFilters(filters);
  const cuisines = showAllCuisines ? CUISINES : CUISINES.slice(0, 6);

  return (
    <View style={[styles.panel, compact && styles.panelCompact, style]}>
      <View style={styles.head}>
        <View style={styles.headCopy}>
          <Ionicons name="options-outline" size={16} color={colors.primary} />
          <Text style={styles.headTitle}>Filters</Text>
          {activeCount ? (
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{activeCount}</Text>
            </View>
          ) : null}
        </View>
        {activeCount ? (
          <Pressable
            onPress={onReset}
            hitSlop={6}
            accessibilityRole="button"
            testID="filter-reset"
          >
            <Text style={styles.resetText}>Reset</Text>
          </Pressable>
        ) : null}
      </View>

      <SectionLabel>Sort by</SectionLabel>
      <View style={styles.sortList}>
        {SORT_OPTIONS.map((option) => (
          <SortRow
            key={option.id}
            option={option}
            active={filters.sort === option.id}
            onPress={() => onChange({ sort: option.id })}
          />
        ))}
      </View>

      <View style={styles.divider} />

      <SectionLabel>Filters</SectionLabel>
      <View style={styles.toggleGroup}>
        <ToggleRow
          label="Free delivery"
          hint="Zero delivery fee"
          active={filters.freeDelivery}
          onPress={() => onChange({ freeDelivery: !filters.freeDelivery })}
          testID="filter-free"
        />
        <ToggleRow
          label="Deals"
          hint="Discounted restaurants"
          active={filters.deals}
          onPress={() => onChange({ deals: !filters.deals })}
          testID="filter-deals"
        />
      </View>

      <SectionLabel>Rating</SectionLabel>
      <View style={styles.chipWrap}>
        {RATINGS.map((rating) => (
          <Chip
            key={rating.value}
            label={rating.label}
            active={filters.rating === rating.value}
            onPress={() => onChange({ rating: rating.value })}
            testID={`filter-rating-${rating.value}`}
          />
        ))}
      </View>

      <SectionLabel>Cuisine</SectionLabel>
      <View style={styles.chipWrap}>
        <Chip
          label="All"
          active={!filters.cuisine}
          onPress={() => onChange({ cuisine: null })}
          testID="filter-cuisine-all"
        />
        {cuisines.map((cuisine) => (
          <Chip
            key={cuisine.id}
            label={cuisine.name}
            active={filters.cuisine === cuisine.id}
            onPress={() =>
              onChange({
                cuisine: filters.cuisine === cuisine.id ? null : cuisine.id,
              })
            }
            testID={`filter-cuisine-${cuisine.id}`}
          />
        ))}
      </View>
      <Pressable
        onPress={() => setShowAllCuisines((previous) => !previous)}
        style={styles.moreLink}
        accessibilityRole="button"
        testID="filter-show-all-cuisines"
      >
        <Text style={styles.moreText}>
          {showAllCuisines
            ? 'Show fewer cuisines'
            : `Show all ${CUISINES.length} cuisines`}
        </Text>
        <Ionicons
          name={showAllCuisines ? 'chevron-up' : 'chevron-down'}
          size={12}
          color={colors.primary}
        />
      </Pressable>

      <SectionLabel>Price</SectionLabel>
      <View style={styles.chipWrap}>
        {PRICES.map((price) => (
          <Chip
            key={price.id}
            label={price.label}
            active={filters.price === price.id}
            onPress={() =>
              onChange({
                price: filters.price === price.id ? null : price.id,
              })
            }
            testID={`filter-price-${price.id}`}
          />
        ))}
      </View>

      <SectionLabel>Delivery time</SectionLabel>
      <View style={styles.chipWrap}>
        {TIMES.map((time) => (
          <Chip
            key={time.value}
            label={time.label}
            active={filters.time === time.value}
            onPress={() => onChange({ time: time.value })}
            testID={`filter-time-${time.value}`}
          />
        ))}
      </View>

      <Pressable
        onPress={onReset}
        style={({ pressed }) => [
          styles.resetButton,
          pressed && styles.pressed,
        ]}
        accessibilityRole="button"
        testID="filter-reset-bottom"
      >
        <Ionicons name="refresh-outline" size={13} color={colors.textMuted} />
        <Text style={styles.resetButtonText}>Reset all filters</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: colors.white,
    borderRadius: radius.xxl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    ...shadows.subtle,
  },
  panelCompact: {
    borderWidth: 0,
    boxShadow: 'none',
    padding: 0,
    borderRadius: 0,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  headCopy: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.text,
  },
  countBadge: {
    minWidth: 17,
    height: 17,
    borderRadius: 9,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  countText: {
    fontSize: 9,
    fontWeight: '900',
    color: colors.white,
  },
  resetText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: colors.primary,
  },
  sectionLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: colors.textLight,
    letterSpacing: 0.9,
    textTransform: 'uppercase',
    marginTop: spacing.md,
    marginBottom: 6,
  },
  sortList: {
    gap: 3,
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingVertical: 6,
    paddingHorizontal: 7,
    borderRadius: radius.sm,
  },
  sortRowActive: {
    backgroundColor: colors.pinkSoft,
  },
  sortText: {
    flex: 1,
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
  },
  sortTextActive: {
    color: colors.text,
    fontWeight: '800',
  },
  radio: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    borderColor: colors.primary,
  },
  radioDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginTop: spacing.md,
  },
  toggleGroup: {
    gap: 2,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  toggleCopy: {
    flex: 1,
  },
  toggleLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: colors.text,
  },
  toggleHint: {
    fontSize: 9,
    fontWeight: '500',
    color: colors.textLight,
    marginTop: 1,
  },
  switch: {
    width: 32,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.border,
    padding: 2,
    justifyContent: 'center',
  },
  switchOn: {
    backgroundColor: colors.primary,
  },
  knob: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.white,
    ...shadows.subtle,
  },
  knobOn: {
    alignSelf: 'flex-end',
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 4.5,
    backgroundColor: colors.white,
  },
  chipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  chipText: {
    fontSize: 9.5,
    fontWeight: '600',
    color: colors.textMuted,
  },
  chipTextActive: {
    color: colors.primaryDark,
    fontWeight: '800',
  },
  moreLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 6,
  },
  moreText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: colors.primary,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    marginTop: spacing.lg,
    paddingVertical: 9,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  resetButtonText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: colors.textMuted,
  },
  pressed: {
    opacity: 0.82,
  },
});
