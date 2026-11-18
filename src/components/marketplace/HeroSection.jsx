import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import useBreakpoint from '@/hooks/useBreakpoint';
import { colors, radius, shadows, spacing } from '@/theme';

function BannerSlide({ banner, height, onPress }) {
  const { isMobile } = useBreakpoint();

  return (
    <Pressable
      onPress={() => onPress(banner)}
      style={({ pressed }) => [pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={`${banner.title}. ${banner.subtitle}`}
      testID={`banner-${banner.id}`}
    >
      <LinearGradient
        colors={banner.colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.slide, { height }]}
      >
        <View style={styles.decorCircle} />
        <View style={styles.slideCopy}>
          <View style={styles.eyebrowPill}>
            <Text style={styles.eyebrow}>{banner.eyebrow}</Text>
          </View>
          <Text
            style={[
              styles.slideTitle,
              isMobile && styles.slideTitleMobile,
            ]}
          >
            {banner.title}
          </Text>
          <Text numberOfLines={2} style={styles.slideSubtitle}>
            {banner.subtitle}
          </Text>
          <View style={styles.cta}>
            <Text style={styles.ctaText}>{banner.cta}</Text>
            <Ionicons
              name="arrow-forward"
              size={14}
              color={colors.primary}
            />
          </View>
        </View>
        <View style={styles.imageBlock}>
          <Image source={banner.image} style={styles.image} />
        </View>
      </LinearGradient>
    </Pressable>
  );
}

function MiniPromo({ banner, onPress }) {
  return (
    <Pressable
      onPress={() => onPress(banner)}
      style={({ pressed }) => [styles.miniPromo, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={banner.title}
      testID={`banner-${banner.id}`}
    >
      <View style={styles.miniCopy}>
        <Text style={styles.miniEyebrow}>{banner.eyebrow}</Text>
        <Text numberOfLines={2} style={styles.miniTitle}>
          {banner.title}
        </Text>
        <View style={styles.miniLink}>
          <Text style={styles.miniLinkText}>Order now</Text>
          <Ionicons
            name="arrow-forward"
            size={11}
            color={colors.primary}
          />
        </View>
      </View>
      <Image source={banner.image} style={styles.miniImage} />
    </Pressable>
  );
}

export default function HeroSection({ banners, onBanner }) {
  const { isDesktop, isMobile } = useBreakpoint();
  const [index, setIndex] = useState(0);

  const height = isDesktop ? 318 : isMobile ? 208 : 272;
  const banner = banners[index] || banners[0];
  const sideBanners = banners.filter(
    (entry) => entry.id === 'b-free' || entry.id === 'b-coffee'
  );

  useEffect(() => {
    if (banners.length < 2) return;
    const timer = setInterval(() => {
      setIndex((previous) => (previous + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const goTo = (next) => setIndex((next + banners.length) % banners.length);

  return (
    <View style={styles.wrap}>
      <View style={styles.carouselWrap}>
        <View style={styles.carousel}>
          <BannerSlide
            banner={banner}
            height={height}
            onPress={onBanner}
          />

          {!isMobile ? (
            <>
              <Pressable
                onPress={() => goTo(index - 1)}
                style={[styles.arrow, styles.arrowLeft]}
                accessibilityRole="button"
                accessibilityLabel="Previous banner"
              >
                <Ionicons
                  name="chevron-back"
                  size={18}
                  color={colors.text}
                />
              </Pressable>
              <Pressable
                onPress={() => goTo(index + 1)}
                style={[styles.arrow, styles.arrowRight]}
                accessibilityRole="button"
                accessibilityLabel="Next banner"
              >
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={colors.text}
                />
              </Pressable>
            </>
          ) : null}

          <View style={styles.dots}>
            {banners.map((entry, dotIndex) => (
              <Pressable
                key={entry.id}
                onPress={() => goTo(dotIndex)}
                style={styles.dotButton}
                hitSlop={6}
                accessibilityRole="button"
                accessibilityLabel={`Go to ${entry.title}`}
              >
                <View
                  style={[
                    styles.dot,
                    dotIndex === index && styles.dotActive,
                  ]}
                />
              </Pressable>
            ))}
          </View>
        </View>

        {isDesktop ? (
          <View style={styles.sideColumn}>
            {sideBanners.map((banner) => (
              <Pressable
                key={banner.id}
                onPress={() => onBanner(banner)}
                style={({ pressed }) => [
                  styles.sideCard,
                  pressed && styles.pressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel={banner.title}
                testID={`banner-${banner.id}`}
              >
                <View style={styles.sideCopy}>
                  <Text style={styles.sideEyebrow}>{banner.eyebrow}</Text>
                  <Text style={styles.sideTitle}>{banner.title}</Text>
                  <Text numberOfLines={2} style={styles.sideSubtitle}>
                    {banner.subtitle}
                  </Text>
                  <View style={styles.sideLink}>
                    <Text style={styles.sideLinkText}>Order now</Text>
                    <Ionicons
                      name="arrow-forward"
                      size={12}
                      color={colors.primary}
                    />
                  </View>
                </View>
                <Image source={banner.image} style={styles.sideImage} />
              </Pressable>
            ))}
          </View>
        ) : null}
      </View>

      {!isDesktop ? (
        <View style={styles.miniRow}>
          {sideBanners.map((banner) => (
            <MiniPromo
              key={banner.id}
              banner={banner}
              onPress={onBanner}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: spacing.xl,
  },
  carouselWrap: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  carousel: {
    flex: 1,
    position: 'relative',
    borderRadius: radius.xxl,
    overflow: 'visible',
  },
  slide: {
    width: '100%',
    borderRadius: radius.xxl,
    flexDirection: 'row',
    overflow: 'hidden',
    position: 'relative',
  },
  pressed: {
    opacity: 0.96,
  },
  decorCircle: {
    position: 'absolute',
    right: -60,
    top: -90,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(255, 255, 255, 0.09)',
  },
  slideCopy: {
    flex: 1,
    paddingHorizontal: spacing.xxl + 4,
    paddingVertical: spacing.xxl,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  eyebrowPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  eyebrow: {
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 1.3,
    color: colors.white,
  },
  slideTitle: {
    marginTop: spacing.sm + 2,
    fontSize: 38,
    lineHeight: 42,
    fontWeight: '900',
    color: colors.white,
    letterSpacing: -1.2,
  },
  slideTitleMobile: {
    fontSize: 25,
    lineHeight: 29,
    letterSpacing: -0.7,
  },
  slideSubtitle: {
    marginTop: spacing.sm,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.88)',
    maxWidth: 340,
  },
  cta: {
    marginTop: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  ctaText: {
    fontSize: 12,
    fontWeight: '900',
    color: colors.primary,
  },
  imageBlock: {
    width: '40%',
    padding: spacing.md,
    paddingLeft: 0,
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: radius.xl,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  arrow: {
    position: 'absolute',
    bottom: spacing.md,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.card,
  },
  arrowLeft: {
    right: 58,
  },
  arrowRight: {
    right: spacing.md + 4,
  },
  dots: {
    position: 'absolute',
    left: spacing.xxl + 4,
    bottom: spacing.md,
    flexDirection: 'row',
    gap: 5,
    backgroundColor: 'rgba(17, 17, 24, 0.18)',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  dotButton: {
    justifyContent: 'center',
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  dotActive: {
    width: 14,
    backgroundColor: colors.white,
  },
  sideColumn: {
    width: 292,
    gap: spacing.lg,
  },
  sideCard: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: radius.xxl,
    backgroundColor: colors.pinkSoft,
    borderWidth: 1,
    borderColor: colors.primaryLight,
    overflow: 'hidden',
  },
  sideCopy: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  sideEyebrow: {
    fontSize: 8.5,
    fontWeight: '900',
    letterSpacing: 1.1,
    color: colors.primary,
  },
  sideTitle: {
    marginTop: 4,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: -0.3,
  },
  sideSubtitle: {
    marginTop: 4,
    fontSize: 10.5,
    lineHeight: 15,
    color: colors.textMuted,
  },
  sideLink: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sideLinkText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: colors.primary,
  },
  sideImage: {
    width: '38%',
    height: '100%',
    backgroundColor: colors.surfaceAlt,
  },
  miniRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  miniPromo: {
    flex: 1,
    flexDirection: 'row',
    height: 112,
    borderRadius: radius.xl,
    backgroundColor: colors.pinkSoft,
    borderWidth: 1,
    borderColor: colors.primaryLight,
    overflow: 'hidden',
  },
  miniCopy: {
    flex: 1,
    padding: spacing.md,
    justifyContent: 'center',
  },
  miniEyebrow: {
    fontSize: 7.5,
    fontWeight: '900',
    letterSpacing: 0.8,
    color: colors.primary,
  },
  miniTitle: {
    marginTop: 3,
    fontSize: 12.5,
    lineHeight: 15,
    fontWeight: '900',
    color: colors.text,
  },
  miniLink: {
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  miniLinkText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.primary,
  },
  miniImage: {
    width: '36%',
    height: '100%',
    backgroundColor: colors.surfaceAlt,
  },
});
