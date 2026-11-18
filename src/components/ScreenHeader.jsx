import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '@/theme';

export default function ScreenHeader({
  title,
  subtitle,
  right,
  onBack,
  transparent = false,
}) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  return (
    <View style={[styles.container, transparent && styles.transparent]}>
      <Pressable
        onPress={handleBack}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        style={[styles.backButton, transparent && styles.overlayButton]}
      >
        <Ionicons
          name="arrow-back"
          size={21}
          color={transparent ? colors.text : colors.text}
        />
      </Pressable>
      <View style={styles.titleWrap}>
        {title ? (
          <Text numberOfLines={1} style={styles.title}>
            {title}
          </Text>
        ) : null}
        {subtitle ? (
          <Text numberOfLines={1} style={styles.subtitle}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <View style={styles.right}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
    gap: spacing.md,
  },
  transparent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: 'transparent',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceAlt,
  },
  overlayButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    boxShadow: '0px 3px 10px rgba(17, 17, 24, 0.14)',
  },
  titleWrap: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textMuted,
    marginTop: 1,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
});
