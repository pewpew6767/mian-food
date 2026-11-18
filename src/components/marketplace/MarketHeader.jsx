import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';
import { useUser } from '@/context/UserContext';
import { RESTAURANTS } from '@/data/restaurants';
import useBreakpoint from '@/hooks/useBreakpoint';
import { colors, radius, shadows, spacing } from '@/theme';
import { formatPKR } from '@/utils/format';
import useStoredState from '@/utils/useStoredState';

const LANGUAGES = [
  { id: 'en', label: 'English', short: 'EN' },
  { id: 'ur', label: 'Urdu', short: 'UR', native: 'اردو' },
  { id: 'rm', label: 'Roman Urdu', short: 'RM' },
];

const POPULAR_SEARCHES = ['Biryani', 'Pizza', 'Coffee', 'Burgers', 'Cakes', 'Karahi'];

function Brand({ compact = false }) {
  return (
    <View style={styles.brand}>
      <Image
        source={require('../../../assets/logo-mascot.png')}
        style={styles.logo}
        resizeMode="contain"
        accessibilityLabel="MIAN FOOD mascot"
      />
      <View>
        <Text style={[styles.brandName, compact && styles.brandNameCompact]}>
          MIAN FOOD
        </Text>
        {!compact ? (
          <Text style={styles.brandTag}>Faisalabad&apos;s food marketplace</Text>
        ) : null}
      </View>
    </View>
  );
}

function IconAction({ icon, label, onPress, badge, testID }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={label}
      testID={testID}
    >
      <Ionicons name={icon} size={20} color={colors.text} />
      {badge ? (
        <View style={styles.iconBadge}>
          <Text style={styles.iconBadgeText}>{badge > 9 ? '9+' : badge}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

function ModeSwitcher({ mode, onChange }) {
  return (
    <View style={styles.modeSwitch}>
      <Pressable
        onPress={() => onChange('delivery')}
        style={[
          styles.modeButton,
          mode === 'delivery' && styles.modeButtonActive,
        ]}
        accessibilityRole="button"
        accessibilityState={{ selected: mode === 'delivery' }}
        testID="header-delivery"
      >
        <Ionicons
          name="bicycle-outline"
          size={15}
          color={mode === 'delivery' ? colors.white : colors.textMuted}
        />
        <Text
          style={[
            styles.modeText,
            mode === 'delivery' && styles.modeTextActive,
          ]}
        >
          Delivery
        </Text>
      </Pressable>
      <Pressable
        onPress={() => onChange('pickup')}
        style={[
          styles.modeButton,
          mode === 'pickup' && styles.modeButtonActive,
        ]}
        accessibilityRole="button"
        accessibilityState={{ selected: mode === 'pickup' }}
        testID="header-pickup"
      >
        <Ionicons
          name="bag-handle-outline"
          size={15}
          color={mode === 'pickup' ? colors.white : colors.textMuted}
        />
        <Text
          style={[
            styles.modeText,
            mode === 'pickup' && styles.modeTextActive,
          ]}
        >
          Pick-up
        </Text>
      </Pressable>
    </View>
  );
}

export default function MarketHeader({ mode, onModeChange }) {
  const router = useRouter();
  const { user, selectedAddress } = useUser();
  const { itemCount, total } = useCart();
  const { count: favoriteCount } = useFavorites();
  const { isDesktop } = useBreakpoint();
  const [language, setLanguage] = useStoredState(
    'mianfood.language.v1',
    LANGUAGES[0]
  );
  const [languageOpen, setLanguageOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  const queryText = query.trim().toLowerCase();

  const restaurantMatches = useMemo(() => {
    if (queryText.length < 2) return [];
    return RESTAURANTS.filter(
      (restaurant) =>
        restaurant.name.toLowerCase().includes(queryText) ||
        restaurant.cuisines.join(' ').toLowerCase().includes(queryText)
    ).slice(0, 3);
  }, [queryText]);

  const dishMatches = useMemo(() => {
    if (queryText.length < 2) return [];
    const matches = [];
    RESTAURANTS.forEach((restaurant) => {
      restaurant.menu.forEach((menuGroup) => {
        menuGroup.items.forEach((item) => {
          if (
            item.name.toLowerCase().includes(queryText) ||
            item.description.toLowerCase().includes(queryText)
          ) {
            matches.push({ restaurant, item });
          }
        });
      });
    });
    return matches.slice(0, 4);
  }, [queryText]);

  const city =
    selectedAddress?.city || selectedAddress?.line || 'Faisalabad';

  const openAddress = () => router.push('/address-picker');

  const submitSearch = (value = query) => {
    const text = value.trim();
    setSearchOpen(false);
    router.push({
      pathname: '/search',
      params: { q: text, t: String(Date.now()) },
    });
  };

  const openSearch = () => {
    setSearchOpen(false);
    setQuery('');
    router.push({ pathname: '/search', params: { t: String(Date.now()) } });
  };

  const selectRestaurant = (restaurant) => {
    setSearchOpen(false);
    setQuery('');
    router.push(`/restaurant/${restaurant.id}`);
  };

  const selectDish = (restaurant, item) => {
    setSearchOpen(false);
    setQuery('');
    router.push(`/food/${restaurant.id}/${item.id}`);
  };

  const searchBox = (
    <View style={styles.searchOuter}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={19} color={colors.primary} />
        <TextInput
          value={query}
          onChangeText={(value) => {
            setQuery(value);
            setSearchOpen(true);
          }}
          onFocus={() => setSearchOpen(true)}
          onSubmitEditing={() => submitSearch()}
          placeholder="Search restaurants, cuisines or dishes"
          placeholderTextColor={colors.textLight}
          style={styles.searchInput}
          returnKeyType="search"
          testID="search-input"
          accessibilityLabel="Search restaurants, cuisines or dishes"
        />
        {query ? (
          <Pressable
            onPress={() => setQuery('')}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Clear search"
          >
            <Ionicons
              name="close-circle"
              size={18}
              color={colors.textLight}
            />
          </Pressable>
        ) : null}
        <Pressable
          onPress={() => submitSearch()}
          style={({ pressed }) => [
            styles.searchButton,
            pressed && styles.pressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Search"
          testID="search-submit"
        >
          {isDesktop ? (
            <Text style={styles.searchButtonText}>Search</Text>
          ) : (
            <Ionicons name="arrow-forward" size={16} color={colors.white} />
          )}
        </Pressable>
      </View>

      {searchOpen ? (
        <View style={styles.suggestPanel}>
          {queryText.length >= 2 ? (
            <>
              {restaurantMatches.length ? (
                <>
                  <Text style={styles.suggestLabel}>Restaurants</Text>
                  {restaurantMatches.map((restaurant) => (
                    <Pressable
                      key={restaurant.id}
                      onPress={() => selectRestaurant(restaurant)}
                      style={({ pressed }) => [
                        styles.suggestRow,
                        pressed && styles.suggestRowPressed,
                      ]}
                      accessibilityRole="button"
                      testID={`suggest-restaurant-${restaurant.id}`}
                    >
                      <Image
                        source={restaurant.image}
                        style={styles.suggestImage}
                      />
                      <View style={styles.suggestCopy}>
                        <Text style={styles.suggestTitle}>
                          {restaurant.name}
                        </Text>
                        <Text style={styles.suggestMeta}>
                          {restaurant.cuisines.join(', ')}
                        </Text>
                      </View>
                      <Ionicons
                        name="chevron-forward"
                        size={14}
                        color={colors.textLight}
                      />
                    </Pressable>
                  ))}
                </>
              ) : null}

              {dishMatches.length ? (
                <>
                  <Text style={styles.suggestLabel}>Dishes</Text>
                  {dishMatches.map(({ restaurant, item }) => (
                    <Pressable
                      key={`${restaurant.id}-${item.id}`}
                      onPress={() => selectDish(restaurant, item)}
                      style={({ pressed }) => [
                        styles.suggestRow,
                        pressed && styles.suggestRowPressed,
                      ]}
                      accessibilityRole="button"
                      testID={`suggest-dish-${item.id}`}
                    >
                      <Image source={item.image} style={styles.suggestImage} />
                      <View style={styles.suggestCopy}>
                        <Text style={styles.suggestTitle}>{item.name}</Text>
                        <Text style={styles.suggestMeta}>
                          {restaurant.name} - {formatPKR(item.price)}
                        </Text>
                      </View>
                      <Ionicons
                        name="arrow-forward"
                        size={13}
                        color={colors.textLight}
                      />
                    </Pressable>
                  ))}
                </>
              ) : null}

              {!restaurantMatches.length && !dishMatches.length ? (
                <View style={styles.noResults}>
                  <Ionicons
                    name="search-outline"
                    size={22}
                    color={colors.textLight}
                  />
                  <Text style={styles.noResultsText}>
                    No matches for &quot;{query.trim()}&quot;
                  </Text>
                </View>
              ) : null}

              <Pressable
                onPress={() => submitSearch()}
                style={styles.searchAll}
                accessibilityRole="button"
              >
                <Text style={styles.searchAllText}>
                  See all results for &quot;{query.trim()}&quot;
                </Text>
                <Ionicons
                  name="arrow-forward"
                  size={13}
                  color={colors.primary}
                />
              </Pressable>
            </>
          ) : (
            <>
              <View style={styles.suggestHead}>
                <Text style={styles.suggestLabel}>Popular searches</Text>
                <Pressable
                  onPress={() => setSearchOpen(false)}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel="Close search suggestions"
                >
                  <Ionicons
                    name="close"
                    size={17}
                    color={colors.textMuted}
                  />
                </Pressable>
              </View>
              <View style={styles.popularRow}>
                {POPULAR_SEARCHES.map((term) => (
                  <Pressable
                    key={term}
                    onPress={() => submitSearch(term)}
                    style={({ pressed }) => [
                      styles.popularChip,
                      pressed && styles.suggestRowPressed,
                    ]}
                    accessibilityRole="button"
                  >
                    <Text style={styles.popularText}>{term}</Text>
                  </Pressable>
                ))}
              </View>
              <Pressable
                onPress={openSearch}
                style={styles.searchAll}
                accessibilityRole="button"
              >
                <Text style={styles.searchAllText}>
                  Browse all restaurants and dishes
                </Text>
                <Ionicons
                  name="arrow-forward"
                  size={13}
                  color={colors.primary}
                />
              </Pressable>
            </>
          )}
        </View>
      ) : null}
    </View>
  );

  return (
    <View style={styles.header}>
      <View style={styles.headerInner}>
        {isDesktop ? (
          <>
            <View style={styles.topRow}>
              <Brand />
              <View style={styles.nav}>
                <ModeSwitcher mode={mode} onChange={onModeChange} />
                <Pressable
                  onPress={() => router.push('/shops')}
                  style={({ pressed }) => [
                    styles.navLink,
                    pressed && styles.pressed,
                  ]}
                  accessibilityRole="button"
                  testID="header-shops"
                >
                  <Ionicons
                    name="storefront-outline"
                    size={17}
                    color={colors.text}
                  />
                  <Text style={styles.navText}>Shops</Text>
                </Pressable>
                <Pressable
                  onPress={() => router.push('/mart')}
                  style={({ pressed }) => [
                    styles.navLink,
                    pressed && styles.pressed,
                  ]}
                  accessibilityRole="button"
                  testID="header-mart"
                >
                  <Ionicons
                    name="basket-outline"
                    size={17}
                    color={colors.primary}
                  />
                  <Text style={[styles.navText, styles.navTextMart]}>
                    Mian Mart
                  </Text>
                  <View style={styles.newBadge}>
                    <Text style={styles.newBadgeText}>NEW</Text>
                  </View>
                </Pressable>
              </View>
              <View style={styles.actions}>
                <Pressable
                  onPress={openAddress}
                  style={({ pressed }) => [
                    styles.addressButton,
                    pressed && styles.pressed,
                  ]}
                  accessibilityRole="button"
                  testID="header-address"
                >
                  <View style={styles.addressIcon}>
                    <Ionicons
                      name="location"
                      size={16}
                      color={colors.primary}
                    />
                  </View>
                  <View style={styles.addressCopy}>
                    <Text style={styles.addressLabel}>
                      {mode === 'delivery' ? 'Delivering to' : 'Pick-up from'}
                    </Text>
                    <Text numberOfLines={1} style={styles.addressCity}>
                      {city}
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-down"
                    size={14}
                    color={colors.textMuted}
                  />
                </Pressable>

                <Pressable
                  onPress={() => setLanguageOpen(true)}
                  style={({ pressed }) => [
                    styles.languageButton,
                    pressed && styles.pressed,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel="Change language"
                  testID="header-language"
                >
                  <Ionicons
                    name="globe-outline"
                    size={17}
                    color={colors.text}
                  />
                  <Text style={styles.languageText}>{language.short}</Text>
                </Pressable>

                <IconAction
                  icon="heart-outline"
                  label={`Favorites, ${favoriteCount} restaurants`}
                  onPress={() => router.push('/favorites')}
                  badge={favoriteCount}
                  testID="header-favorites"
                />
                <Pressable
                  onPress={() => router.push('/account')}
                  style={({ pressed }) => [
                    styles.avatar,
                    pressed && styles.pressed,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel="Your profile"
                  testID="header-profile"
                >
                  <Text style={styles.avatarText}>
                    {user.name?.trim().charAt(0).toUpperCase() || 'M'}
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => router.push('/cart')}
                  style={({ pressed }) => [
                    styles.cartPill,
                    pressed && styles.pressed,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`Cart, ${itemCount} items, ${formatPKR(total)}`}
                  testID="header-cart"
                >
                  <Ionicons
                    name="cart-outline"
                    size={18}
                    color={colors.primary}
                  />
                  <View style={styles.cartCopy}>
                    <Text style={styles.cartLabel}>
                      {itemCount ? `${itemCount} item${itemCount > 1 ? 's' : ''}` : 'Cart'}
                    </Text>
                    <Text style={styles.cartValue}>
                      {itemCount ? formatPKR(total) : 'Empty'}
                    </Text>
                  </View>
                </Pressable>
              </View>
            </View>

            <View style={styles.searchRow}>
              {searchBox}
              <View style={styles.quickLinks}>
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: '/search',
                      params: { filter: 'free', t: String(Date.now()) },
                    })
                  }
                  style={({ pressed }) => [
                    styles.quickChip,
                    pressed && styles.pressed,
                  ]}
                  accessibilityRole="button"
                >
                  <Ionicons
                    name="bicycle-outline"
                    size={14}
                    color={colors.success}
                  />
                  <Text style={styles.quickText}>Free delivery</Text>
                </Pressable>
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: '/search',
                      params: { filter: 'deals', t: String(Date.now()) },
                    })
                  }
                  style={({ pressed }) => [
                    styles.quickChip,
                    pressed && styles.pressed,
                  ]}
                  accessibilityRole="button"
                >
                  <Ionicons
                    name="pricetag-outline"
                    size={14}
                    color={colors.primary}
                  />
                  <Text style={styles.quickText}>Deals</Text>
                </Pressable>
              </View>
            </View>
          </>
        ) : (
          <>
            <View style={styles.compactTop}>
              <Pressable onPress={() => router.push('/')} accessibilityRole="button">
                <Brand compact />
              </Pressable>
              <View style={styles.compactActions}>
                <IconAction
                  icon="heart-outline"
                  label={`Favorites, ${favoriteCount} restaurants`}
                  onPress={() => router.push('/favorites')}
                  badge={favoriteCount}
                  testID="header-favorites"
                />
                <IconAction
                  icon="cart-outline"
                  label={`Cart, ${itemCount} items`}
                  onPress={() => router.push('/cart')}
                  badge={itemCount}
                  testID="header-cart"
                />
                <Pressable
                  onPress={() => router.push('/account')}
                  style={({ pressed }) => [
                    styles.avatar,
                    pressed && styles.pressed,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel="Your profile"
                  testID="header-profile"
                >
                  <Text style={styles.avatarText}>
                    {user.name?.trim().charAt(0).toUpperCase() || 'M'}
                  </Text>
                </Pressable>
              </View>
            </View>
            <View style={styles.compactSearch}>{searchBox}</View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.compactNav}
            >
              <ModeSwitcher mode={mode} onChange={onModeChange} />
              <Pressable
                onPress={() => router.push('/shops')}
                style={({ pressed }) => [
                  styles.compactLink,
                  pressed && styles.pressed,
                ]}
                accessibilityRole="button"
                testID="header-shops"
              >
                <Ionicons
                  name="storefront-outline"
                  size={15}
                  color={colors.text}
                />
                <Text style={styles.compactLinkText}>Shops</Text>
              </Pressable>
              <Pressable
                onPress={() => router.push('/mart')}
                style={({ pressed }) => [
                  styles.compactLink,
                  pressed && styles.pressed,
                ]}
                accessibilityRole="button"
                testID="header-mart"
              >
                <Ionicons
                  name="basket-outline"
                  size={15}
                  color={colors.primary}
                />
                <Text style={[styles.compactLinkText, styles.navTextMart]}>
                  Mian Mart
                </Text>
                <View style={styles.newBadge}>
                  <Text style={styles.newBadgeText}>NEW</Text>
                </View>
              </Pressable>
              <Pressable
                onPress={() => setLanguageOpen(true)}
                style={({ pressed }) => [
                  styles.compactLink,
                  pressed && styles.pressed,
                ]}
                accessibilityRole="button"
                testID="header-language"
              >
                <Ionicons
                  name="globe-outline"
                  size={15}
                  color={colors.text}
                />
                <Text style={styles.compactLinkText}>{language.short}</Text>
              </Pressable>
            </ScrollView>
          </>
        )}
      </View>

      <Modal
        visible={languageOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setLanguageOpen(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setLanguageOpen(false)}
        >
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <View style={styles.modalHead}>
              <Text style={styles.modalTitle}>Choose language</Text>
              <Pressable
                onPress={() => setLanguageOpen(false)}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Close language selector"
              >
                <Ionicons name="close" size={19} color={colors.textMuted} />
              </Pressable>
            </View>
            {LANGUAGES.map((option) => {
              const active = language.id === option.id;
              return (
                <Pressable
                  key={option.id}
                  onPress={() => {
                    setLanguage(option);
                    setLanguageOpen(false);
                  }}
                  style={({ pressed }) => [
                    styles.languageRow,
                    pressed && styles.suggestRowPressed,
                  ]}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                >
                  <View style={styles.languageCopy}>
                    <Text style={styles.languageLabel}>{option.label}</Text>
                    {option.native ? (
                      <Text style={styles.languageNative}>{option.native}</Text>
                    ) : null}
                  </View>
                  <View
                    style={[
                      styles.radio,
                      active && styles.radioActive,
                    ]}
                  >
                    {active ? <View style={styles.radioDot} /> : null}
                  </View>
                </Pressable>
              );
            })}
            <Text style={styles.languageNote}>
              Demo storefront: menu content stays in English. Your language
              choice is saved on this device.
            </Text>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    zIndex: 60,
  },
  headerInner: {
    width: '100%',
    maxWidth: 1280,
    alignSelf: 'center',
    paddingHorizontal: 24,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    paddingTop: 12,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logo: {
    width: 34,
    height: 46,
  },
  brandName: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: -0.8,
  },
  brandNameCompact: {
    fontSize: 20,
  },
  brandTag: {
    fontSize: 9.5,
    fontWeight: '600',
    color: colors.textLight,
    marginTop: -1,
    letterSpacing: 0.1,
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  modeSwitch: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.pill,
    padding: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radius.pill,
  },
  modeButtonActive: {
    backgroundColor: colors.primary,
    ...shadows.subtle,
  },
  modeText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: colors.textMuted,
  },
  modeTextActive: {
    color: colors.white,
    fontWeight: '800',
  },
  navLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 7,
    paddingVertical: 8,
    borderRadius: radius.md,
  },
  navText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },
  navTextMart: {
    color: colors.primary,
  },
  newBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  newBadgeText: {
    fontSize: 7,
    fontWeight: '900',
    color: colors.white,
    letterSpacing: 0.4,
  },
  actions: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 9,
  },
  addressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: radius.md,
    maxWidth: 176,
  },
  addressIcon: {
    width: 29,
    height: 29,
    borderRadius: 15,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressCopy: {
    flexShrink: 1,
  },
  addressLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: colors.textLight,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  addressCity: {
    fontSize: 11.5,
    fontWeight: '800',
    color: colors.text,
    marginTop: 1,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: 9,
    paddingVertical: 8,
  },
  languageText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: colors.text,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.8,
  },
  iconBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 3,
    borderRadius: 8,
    backgroundColor: colors.primary,
    borderWidth: 1.5,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBadgeText: {
    fontSize: 8,
    fontWeight: '900',
    color: colors.white,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.primaryLight,
  },
  avatarText: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.white,
  },
  cartPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.primaryLight,
    borderRadius: radius.md,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  cartCopy: {
    minWidth: 54,
  },
  cartLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  cartValue: {
    fontSize: 11,
    fontWeight: '900',
    color: colors.text,
    marginTop: 1,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingTop: 10,
    paddingBottom: 12,
  },
  searchOuter: {
    flex: 1,
    position: 'relative',
    zIndex: 80,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    paddingLeft: 14,
    paddingRight: 5,
    height: 46,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    color: colors.text,
    paddingVertical: 0,
    outlineStyle: 'none',
  },
  searchButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    height: 36,
    minWidth: 42,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButtonText: {
    color: colors.white,
    fontSize: 11.5,
    fontWeight: '800',
  },
  suggestPanel: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
    ...shadows.modal,
    zIndex: 120,
  },
  suggestHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
    paddingTop: 4,
  },
  suggestLabel: {
    fontSize: 9.5,
    fontWeight: '900',
    color: colors.textLight,
    letterSpacing: 0.9,
    textTransform: 'uppercase',
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.sm,
    paddingBottom: 5,
  },
  suggestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 7,
    borderRadius: radius.md,
  },
  suggestRowPressed: {
    backgroundColor: colors.pinkSoft,
  },
  suggestImage: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: colors.surfaceAlt,
  },
  suggestCopy: {
    flex: 1,
  },
  suggestTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.text,
  },
  suggestMeta: {
    fontSize: 10,
    fontWeight: '500',
    color: colors.textMuted,
    marginTop: 1,
  },
  noResults: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: spacing.md,
  },
  noResultsText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
  },
  searchAll: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.sm,
    paddingVertical: 10,
  },
  searchAllText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: colors.primary,
  },
  popularRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    paddingHorizontal: spacing.sm,
    paddingBottom: 4,
  },
  popularChip: {
    backgroundColor: colors.pinkSoft,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  popularText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  quickLinks: {
    flexDirection: 'row',
    gap: 8,
  },
  quickChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: 11,
    paddingVertical: 8,
    backgroundColor: colors.white,
  },
  quickText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: colors.text,
  },
  compactTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    gap: spacing.sm,
  },
  compactActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  compactSearch: {
    paddingTop: 8,
  },
  compactNav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 9,
    paddingBottom: 10,
  },
  compactLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: 11,
    paddingVertical: 7,
    backgroundColor: colors.white,
  },
  compactLinkText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: colors.text,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: colors.white,
    borderRadius: radius.xxl,
    padding: spacing.xl,
    ...shadows.modal,
  },
  modalHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: colors.text,
  },
  languageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  languageCopy: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  languageLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  languageNative: {
    fontSize: 12,
    color: colors.textMuted,
  },
  radio: {
    width: 19,
    height: 19,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    borderColor: colors.primary,
  },
  radioDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  languageNote: {
    marginTop: spacing.md,
    fontSize: 10,
    lineHeight: 15,
    color: colors.textLight,
  },
});
