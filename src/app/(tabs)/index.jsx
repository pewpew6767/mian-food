import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import {
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EmptyState from '@/components/EmptyState';
import FilterChip from '@/components/FilterChip';
import RestaurantCard from '@/components/RestaurantCard';
import CuisineRail from '@/components/marketplace/CuisineRail';
import DealsRail from '@/components/marketplace/DealsRail';
import FiltersSidebar, {
  applyFilters,
  countActiveFilters,
  DEFAULT_FILTERS,
  SORT_OPTIONS,
} from '@/components/marketplace/FiltersSidebar';
import HeroSection from '@/components/marketplace/HeroSection';
import MarketFooter from '@/components/marketplace/MarketFooter';
import MarketHeader from '@/components/marketplace/MarketHeader';
import MarketSectionHeader from '@/components/marketplace/MarketSectionHeader';
import {
  CarouselTrack,
  useCarousel,
} from '@/components/marketplace/Carousel';
import ProductRail from '@/components/marketplace/ProductRail';
import SidebarPromos from '@/components/marketplace/SidebarPromos';
import { useUser } from '@/context/UserContext';
import { BANNERS } from '@/data/banners';
import { CUISINES } from '@/data/categories';
import { IMAGES } from '@/data/images';
import {
  COFFEE_PRODUCTS,
  DAILY_DEALS,
  DESSERT_RAILS,
  ORDER_AGAIN,
  POPULAR_SECTIONS,
} from '@/data/marketplace';
import { RESTAURANTS } from '@/data/restaurants';
import useBreakpoint from '@/hooks/useBreakpoint';
import { colors, radius, shadows, spacing } from '@/theme';

const PRICE_LABELS = {
  u500: 'Under Rs. 500',
  u800: 'Under Rs. 800',
  u1200: 'Under Rs. 1200',
  above: 'Above Rs. 1200',
};

const SECTION_ACTIONS = {
  popular: {},
  'top-rated': { sort: 'rating' },
  fastest: { sort: 'time' },
  discounts: { filter: 'deals' },
  'free-delivery': { filter: 'free' },
};

function MartStrip() {
  const router = useRouter();
  const { isMobile } = useBreakpoint();
  return (
    <Pressable
      onPress={() => router.push('/mart')}
      style={({ pressed }) => [
        styles.martStrip,
        pressed && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel="Shop groceries on Mian Mart"
      testID="home-mart-strip"
    >
      <LinearGradient
        colors={['#FDE7F0', '#FFF5F9']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.martStripGradient}
      >
        <View style={styles.martStripCopy}>
          <View style={styles.martPill}>
            <Ionicons name="basket" size={11} color={colors.white} />
            <Text style={styles.martPillText}>MIAN MART</Text>
          </View>
          <Text style={styles.martTitle}>
            Groceries delivered in 30 minutes
          </Text>
          <Text style={styles.martSubtitle}>
            Fresh produce, dairy, snacks and household essentials from Mian
            Mart, our grocery store.
          </Text>
          <View style={styles.martCta}>
            <Text style={styles.martCtaText}>Shop Mian Mart</Text>
            <Ionicons
              name="arrow-forward"
              size={13}
              color={colors.white}
            />
          </View>
        </View>
        <Image
          source={IMAGES.produce}
          style={[
            styles.martStripImage,
            isMobile && styles.martStripImageMobile,
          ]}
        />
      </LinearGradient>
    </Pressable>
  );
}

function RestaurantRail({ section, onSeeAll }) {
  const { isDesktop, isTablet } = useBreakpoint();
  const width = isDesktop ? 320 : isTablet ? 292 : 282;
  const carousel = useCarousel();
  const restaurants = section.ids
    .map((id) => RESTAURANTS.find((entry) => entry.id === id))
    .filter(Boolean);

  if (!restaurants.length) return null;

  return (
    <View style={styles.restaurantSection}>
      <MarketSectionHeader
        title={section.title}
        subtitle={section.subtitle}
        actionLabel="See all"
        onAction={onSeeAll}
        carousel={carousel}
        carouselId={section.id}
      />
      <CarouselTrack carousel={carousel} testID={section.id}>
        {restaurants.map((restaurant) => (
          <RestaurantCard
            key={restaurant.id}
            restaurant={restaurant}
            variant="row"
            width={width}
          />
        ))}
      </CarouselTrack>
    </View>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const { selectedAddress } = useUser();
  const { isDesktop, isTablet, isMobile } = useBreakpoint();
  const scrollRef = useRef(null);
  const gridY = useRef(0);
  const [mode, setMode] = useState('delivery');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [gridWidth, setGridWidth] = useState(0);

  const filtered = useMemo(
    () => applyFilters(RESTAURANTS, filters),
    [filters]
  );

  const activeCount = countActiveFilters(filters);
  const activeCuisineName = filters.cuisine
    ? CUISINES.find((cuisine) => cuisine.id === filters.cuisine)?.name
    : null;

  const updateFilters = (patch) =>
    setFilters((previous) => ({ ...previous, ...patch }));
  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  const openSearch = (params = {}) =>
    router.push({
      pathname: '/search',
      params: { ...params, t: String(Date.now()) },
    });

  const handleBanner = (banner) => {
    const { action } = banner;
    if (action.type === 'restaurant') {
      router.push(`/restaurant/${action.id}`);
    } else if (action.type === 'filter') {
      openSearch({ filter: action.filter });
    } else if (action.type === 'cuisine') {
      openSearch({ cuisine: action.cuisine });
    }
  };

  const scrollToGrid = () => {
    scrollRef.current?.scrollTo({
      y: Math.max(gridY.current - 80, 0),
      animated: true,
    });
  };

  const handleCuisineSelect = (name) => {
    if (name === 'all') {
      updateFilters({ cuisine: null });
      return;
    }
    const cuisine = CUISINES.find((entry) => entry.name === name);
    updateFilters({ cuisine: cuisine ? cuisine.id : null });
    scrollToGrid();
  };

  const activeChips = [];
  if (filters.freeDelivery) {
    activeChips.push({
      key: 'free',
      label: 'Free delivery',
      patch: { freeDelivery: false },
    });
  }
  if (filters.deals) {
    activeChips.push({
      key: 'deals',
      label: 'Deals',
      patch: { deals: false },
    });
  }
  if (filters.rating) {
    activeChips.push({
      key: 'rating',
      label: `${filters.rating}+ rating`,
      patch: { rating: 0 },
    });
  }
  if (activeCuisineName) {
    activeChips.push({
      key: 'cuisine',
      label: activeCuisineName,
      patch: { cuisine: null },
    });
  }
  if (filters.price) {
    activeChips.push({
      key: 'price',
      label: PRICE_LABELS[filters.price] || 'Price',
      patch: { price: null },
    });
  }
  if (filters.time) {
    activeChips.push({
      key: 'time',
      label: `Under ${filters.time} min`,
      patch: { time: 0 },
    });
  }

  const gridCols = isDesktop ? 3 : isTablet ? 2 : 1;
  const gridGap = 14;
  const cardWidth =
    gridWidth > 0
      ? Math.floor((gridWidth - gridGap * (gridCols - 1)) / gridCols)
      : isMobile
        ? 320
        : 260;

  const city = selectedAddress?.city || 'Faisalabad';

  const restaurantSection = (
    <View
      style={styles.gridSection}
      onLayout={(event) => {
        gridY.current = event.nativeEvent.layout.y;
        setGridWidth(event.nativeEvent.layout.width);
      }}
      testID="restaurant-grid-section"
    >
      <View style={styles.gridHead}>
        <View style={styles.gridHeadCopy}>
          <Text style={styles.gridTitle}>
            Restaurants delivering to {city}
          </Text>
          <Text style={styles.gridSub}>
            {filtered.length} of {RESTAURANTS.length} places - demo listings
            with sample menus and prices
          </Text>
        </View>
        {!isDesktop ? (
          <Pressable
            onPress={() => setFilterModalOpen(true)}
            style={({ pressed }) => [
              styles.filterButton,
              pressed && styles.pressed,
            ]}
            accessibilityRole="button"
            testID="home-filter-open"
          >
            <Ionicons name="options-outline" size={14} color={colors.primary} />
            <Text style={styles.filterButtonText}>Filters</Text>
            {activeCount ? (
              <View style={styles.filterCount}>
                <Text style={styles.filterCountText}>{activeCount}</Text>
              </View>
            ) : null}
          </Pressable>
        ) : null}
      </View>

      {!isDesktop ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.sortTrack}
        >
          {SORT_OPTIONS.map((option) => (
            <FilterChip
              key={option.id}
              label={option.label}
              icon={option.icon}
              active={filters.sort === option.id}
              onPress={() => updateFilters({ sort: option.id })}
            />
          ))}
        </ScrollView>
      ) : null}

      {activeChips.length ? (
        <View style={styles.activeChipRow}>
          {activeChips.map((chip) => (
            <Pressable
              key={chip.key}
              onPress={() => updateFilters(chip.patch)}
              style={({ pressed }) => [
                styles.activeChip,
                pressed && styles.pressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel={`Remove ${chip.label} filter`}
            >
              <Text style={styles.activeChipText}>{chip.label}</Text>
              <Ionicons name="close" size={11} color={colors.primaryDark} />
            </Pressable>
          ))}
          <Pressable
            onPress={resetFilters}
            style={styles.clearAll}
            accessibilityRole="button"
          >
            <Text style={styles.clearAllText}>Clear all</Text>
          </Pressable>
        </View>
      ) : null}

      {filtered.length ? (
        <View style={[styles.grid, { gap: gridGap }]}>
          {filtered.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              width={cardWidth}
            />
          ))}
        </View>
      ) : (
        <View style={styles.gridEmpty}>
          <EmptyState
            icon="funnel-outline"
            title="No restaurants match"
            message="Try clearing a filter or searching for a different cuisine."
            actionLabel="Reset filters"
            onAction={resetFilters}
          />
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <MarketHeader mode={mode} onModeChange={setMode} />
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        testID="home-scroll"
      >
        <View style={[styles.body, isMobile && styles.bodyMobile]}>
          <Pressable
            onPress={() => router.push('/address-picker')}
            style={({ pressed }) => [
              styles.addressStrip,
              pressed && styles.pressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel={`Change delivery address. Delivering to ${city}`}
            testID="home-address-strip"
          >
            <View style={styles.addressIcon}>
              <Ionicons
                name={mode === 'delivery' ? 'location' : 'storefront'}
                size={18}
                color={colors.primary}
              />
            </View>
            <View style={styles.addressCopy}>
              <Text style={styles.addressLabel}>
                {mode === 'delivery' ? 'DELIVERING TO' : 'PICK-UP FROM'}
              </Text>
              <View style={styles.addressLine}>
                <Text style={styles.addressCity}>{city}</Text>
                <Text numberOfLines={1} style={styles.addressDetail}>
                  {selectedAddress
                    ? `${selectedAddress.label} - ${selectedAddress.line}`
                    : 'Choose a delivery address'}
                </Text>
              </View>
            </View>
            <View style={styles.demoChip}>
              <Ionicons
                name="information-circle-outline"
                size={11}
                color={colors.textMuted}
              />
              <Text style={styles.demoChipText}>Demo listings</Text>
            </View>
            <View style={styles.changeButton}>
              <Text style={styles.changeText}>Change</Text>
              <Ionicons
                name="chevron-down"
                size={12}
                color={colors.primary}
              />
            </View>
          </Pressable>

          <HeroSection banners={BANNERS} onBanner={handleBanner} />

          <DealsRail
            deals={DAILY_DEALS}
            onSeeAll={() => openSearch({ filter: 'deals' })}
          />

          <CuisineRail
            cuisines={CUISINES}
            activeCuisine={activeCuisineName}
            onSelect={handleCuisineSelect}
            onSeeAll={() => openSearch()}
          />

          <MartStrip />

          {isDesktop ? (
            <View style={styles.marketRow}>
              <View style={styles.sidebarColumn}>
                <FiltersSidebar
                  filters={filters}
                  onChange={updateFilters}
                  onReset={resetFilters}
                  style={
                    Platform.OS === 'web'
                      ? [styles.sidebarSticky, styles.sidebarPanel]
                      : styles.sidebarPanel
                  }
                />
                <SidebarPromos style={styles.sidebarPromos} />
              </View>
              <View style={styles.mainColumn}>{restaurantSection}</View>
            </View>
          ) : (
            <>
              {restaurantSection}
              <SidebarPromos style={styles.compactPromos} />
            </>
          )}

          <ProductRail
            title="Coffee, Tea & Drinks"
            subtitle="Barista coffee, chai and fresh shakes"
            items={COFFEE_PRODUCTS}
            actionLabel="See all drinks"
            onAction={() => openSearch({ q: 'coffee' })}
            carouselId="coffee-drinks"
          />

          <ProductRail
            title="Order again"
            subtitle="Your recent favourites, ready in a tap"
            items={ORDER_AGAIN}
            actionLabel="View orders"
            onAction={() => router.push('/orders')}
            carouselId="order-again"
          />

          {DESSERT_RAILS.map((rail) => (
            <ProductRail
              key={rail.id}
              title={rail.title}
              subtitle={rail.subtitle}
              items={rail.items}
              actionLabel="See all"
              onAction={() => openSearch({ q: rail.title })}
              carouselId={rail.id}
            />
          ))}

          {POPULAR_SECTIONS.map((section) => (
            <RestaurantRail
              key={section.id}
              section={section}
              onSeeAll={() => openSearch(SECTION_ACTIONS[section.id] || {})}
            />
          ))}

          <View style={styles.promiseRow}>
            <View style={styles.promise}>
              <Ionicons name="bicycle-outline" size={20} color={colors.primary} />
              <View>
                <Text style={styles.promiseTitle}>Fast local delivery</Text>
                <Text style={styles.promiseText}>
                  Sample delivery estimates from 18-45 minutes
                </Text>
              </View>
            </View>
            <View style={styles.promise}>
              <Ionicons name="cash-outline" size={20} color={colors.primary} />
              <View>
                <Text style={styles.promiseTitle}>Cash on delivery</Text>
                <Text style={styles.promiseText}>
                  Demo checkout, no real payments taken
                </Text>
              </View>
            </View>
            <View style={styles.promise}>
              <Ionicons
                name="shield-checkmark-outline"
                size={20}
                color={colors.primary}
              />
              <View>
                <Text style={styles.promiseTitle}>Original MIAN FOOD demo</Text>
                <Text style={styles.promiseText}>
                  Prototype marketplace for Faisalabad
                </Text>
              </View>
            </View>
          </View>
        </View>

        <MarketFooter
          onBackToTop={() =>
            scrollRef.current?.scrollTo({ y: 0, animated: true })
          }
        />
      </ScrollView>

      <Modal
        visible={filterModalOpen}
        animationType="slide"
        onRequestClose={() => setFilterModalOpen(false)}
      >
        <SafeAreaView style={styles.filterModal} edges={['top', 'bottom']}>
          <View style={styles.filterModalHead}>
            <View>
              <Text style={styles.filterModalTitle}>Filters & sort</Text>
              <Text style={styles.filterModalSub}>
                {filtered.length} restaurants match
              </Text>
            </View>
            <Pressable
              onPress={() => setFilterModalOpen(false)}
              style={styles.filterClose}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Close filters"
              testID="home-filter-close"
            >
              <Ionicons name="close" size={20} color={colors.text} />
            </Pressable>
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.filterModalBody}
          >
            <FiltersSidebar
              compact
              filters={filters}
              onChange={updateFilters}
              onReset={resetFilters}
            />
          </ScrollView>
          <View style={styles.filterModalFoot}>
            <Pressable
              onPress={resetFilters}
              style={({ pressed }) => [
                styles.filterResetButton,
                pressed && styles.pressed,
              ]}
              accessibilityRole="button"
            >
              <Text style={styles.filterResetText}>Reset</Text>
            </Pressable>
            <Pressable
              onPress={() => setFilterModalOpen(false)}
              style={({ pressed }) => [
                styles.filterApplyButton,
                pressed && styles.pressed,
              ]}
              accessibilityRole="button"
              testID="home-filter-apply"
            >
              <Text style={styles.filterApplyText}>
                Show {filtered.length} places
              </Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    paddingBottom: 0,
  },
  body: {
    width: '100%',
    maxWidth: 1280,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingTop: spacing.md,
  },
  bodyMobile: {
    paddingHorizontal: spacing.lg,
  },
  pressed: {
    opacity: 0.86,
  },
  addressStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.primaryLight,
    backgroundColor: colors.pinkSoft,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    flexWrap: 'wrap',
  },
  addressIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.subtle,
  },
  addressCopy: {
    flex: 1,
    minWidth: 180,
  },
  addressLabel: {
    fontSize: 8,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: 1,
  },
  addressLine: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 1,
  },
  addressCity: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: -0.2,
  },
  addressDetail: {
    flexShrink: 1,
    fontSize: 10.5,
    fontWeight: '500',
    color: colors.textMuted,
  },
  demoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  demoChipText: {
    fontSize: 8.5,
    fontWeight: '700',
    color: colors.textMuted,
  },
  changeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.primaryLight,
  },
  changeText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: colors.primary,
  },
  martStrip: {
    marginTop: spacing.xxxl,
    borderRadius: radius.xxl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.primaryLight,
    ...shadows.subtle,
  },
  martStripGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.xl,
    gap: spacing.lg,
  },
  martStripCopy: {
    flex: 1,
  },
  martPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  martPillText: {
    fontSize: 7.5,
    fontWeight: '900',
    color: colors.white,
    letterSpacing: 0.7,
  },
  martTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: -0.5,
    marginTop: 7,
  },
  martSubtitle: {
    fontSize: 11,
    lineHeight: 16,
    color: colors.textMuted,
    marginTop: 4,
    maxWidth: 520,
  },
  martCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    marginTop: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  martCtaText: {
    fontSize: 11,
    fontWeight: '900',
    color: colors.white,
  },
  martStripImage: {
    width: 210,
    height: 132,
    borderRadius: radius.xl,
    backgroundColor: colors.white,
  },
  martStripImageMobile: {
    width: 108,
    height: 108,
  },
  marketRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xxl,
    marginTop: spacing.xxxl,
  },
  sidebarColumn: {
    width: 260,
  },
  sidebarSticky: {
    position: 'sticky',
    top: 16,
  },
  sidebarPanel: {
    zIndex: 2,
  },
  sidebarPromos: {
    marginTop: spacing.lg,
  },
  mainColumn: {
    flex: 1,
    minWidth: 0,
  },
  gridSection: {
    marginTop: 0,
  },
  gridHead: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  gridHeadCopy: {
    flex: 1,
  },
  gridTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: -0.5,
  },
  gridSub: {
    fontSize: 11.5,
    lineHeight: 17,
    fontWeight: '500',
    color: colors.textMuted,
    marginTop: 3,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  filterButtonText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
  },
  filterCount: {
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  filterCountText: {
    fontSize: 8,
    fontWeight: '900',
    color: colors.white,
  },
  sortTrack: {
    gap: 7,
    paddingBottom: spacing.md,
  },
  activeChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 5,
    marginBottom: spacing.md,
  },
  activeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.primaryLight,
    borderRadius: radius.pill,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  activeChipText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  clearAll: {
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  clearAllText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'stretch',
  },
  gridEmpty: {
    paddingVertical: spacing.xxl,
  },
  restaurantSection: {
    marginTop: spacing.xxxl,
  },
  compactPromos: {
    marginTop: spacing.xxxl,
  },
  promiseRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.lg,
    marginTop: spacing.huge,
    paddingTop: spacing.xxl,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  promise: {
    flex: 1,
    minWidth: 210,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  promiseTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.text,
  },
  promiseText: {
    fontSize: 10,
    lineHeight: 15,
    color: colors.textMuted,
    marginTop: 2,
  },
  filterModal: {
    flex: 1,
    backgroundColor: colors.white,
  },
  filterModalHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterModalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.text,
  },
  filterModalSub: {
    fontSize: 10.5,
    fontWeight: '500',
    color: colors.textMuted,
    marginTop: 1,
  },
  filterClose: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterModalBody: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    paddingBottom: spacing.xxxl,
  },
  filterModalFoot: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.white,
  },
  filterResetButton: {
    width: 100,
    height: 46,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterResetText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.text,
  },
  filterApplyButton: {
    flex: 1,
    height: 46,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.floating,
  },
  filterApplyText: {
    fontSize: 13,
    fontWeight: '900',
    color: colors.white,
  },
});
