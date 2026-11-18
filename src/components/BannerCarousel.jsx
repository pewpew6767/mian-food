import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { colors, radius, spacing } from '@/theme';

const GAP = spacing.md;

export default function BannerCarousel({ banners, onPress }) {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - spacing.xl * 2, 560);
  const step = cardWidth + GAP;
  const scrollRef = useRef(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (banners.length < 2) return;
    const timer = setTimeout(() => {
      const next = (index + 1) % banners.length;
      scrollRef.current?.scrollTo({ x: next * step, animated: true });
      setIndex(next);
    }, 4500);
    return () => clearTimeout(timer);
  }, [index, banners.length, step]);

  const handleScrollEnd = (event) => {
    const next = Math.round(event.nativeEvent.contentOffset.x / step);
    if (next !== index && next >= 0 && next < banners.length) {
      setIndex(next);
    }
  };

  const goTo = (target) => {
    scrollRef.current?.scrollTo({ x: target * step, animated: true });
    setIndex(target);
  };

  return (
    <View style={styles.wrap}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={step}
        decelerationRate="fast"
        disableIntervalMomentum
        onMomentumScrollEnd={handleScrollEnd}
        contentContainerStyle={styles.track}
      >
        {banners.map((banner) => (
          <Pressable
            key={banner.id}
            onPress={() => onPress(banner)}
            style={({ pressed }) => [
              styles.card,
              { width: cardWidth },
              pressed && styles.pressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel={`${banner.title}. ${banner.subtitle}`}
          >
            <ImageBackground
              source={banner.image}
              style={styles.image}
              imageStyle={styles.imageStyle}
            >
              <LinearGradient
                colors={['rgba(200, 30, 91, 0.95)', 'rgba(94, 10, 44, 0.25)']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={StyleSheet.absoluteFill}
              />
              <View style={styles.content}>
                <Text style={styles.eyebrow}>{banner.eyebrow}</Text>
                <Text style={styles.title}>{banner.title}</Text>
                <Text style={styles.subtitle}>{banner.subtitle}</Text>
                <View style={styles.cta}>
                  <Text style={styles.ctaText}>Order now</Text>
                  <Ionicons
                    name="arrow-forward"
                    size={13}
                    color={colors.primary}
                  />
                </View>
              </View>
            </ImageBackground>
          </Pressable>
        ))}
      </ScrollView>
      <View style={styles.dots}>
        {banners.map((banner, dotIndex) => (
          <Pressable
            key={banner.id}
            onPress={() => goTo(dotIndex)}
            style={[styles.dot, dotIndex === index && styles.dotActive]}
            accessibilityRole="button"
            accessibilityLabel={`Go to promotion ${dotIndex + 1}`}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: spacing.lg,
  },
  track: {
    paddingLeft: spacing.xl,
    paddingRight: spacing.xl - GAP,
  },
  card: {
    height: 152,
    marginRight: GAP,
    borderRadius: radius.xl,
    overflow: 'hidden',
    backgroundColor: colors.primaryDark,
  },
  pressed: {
    opacity: 0.94,
  },
  image: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  imageStyle: {
    borderRadius: radius.xl,
  },
  content: {
    padding: spacing.lg,
    width: '78%',
  },
  eyebrow: {
    color: 'rgba(255, 255, 255, 0.82)',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 1.4,
    marginBottom: 4,
  },
  title: {
    color: colors.white,
    fontSize: 23,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radius.pill,
    marginTop: spacing.md,
  },
  ctaText: {
    color: colors.primary,
    fontSize: 11.5,
    fontWeight: '800',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    marginTop: spacing.md,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E6E6EA',
  },
  dotActive: {
    width: 20,
    backgroundColor: colors.primary,
  },
});
