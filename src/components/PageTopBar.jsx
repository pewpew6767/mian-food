import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import CartButton from '@/components/CartButton';
import { colors, shadows, spacing } from '@/theme';

export default function PageTopBar({ title, subtitle, right, showCart = true }) {
  const router = useRouter();

  return (
    <View style={styles.bar}>
      <Pressable
        onPress={() => router.back()}
        style={({ pressed }) => [styles.back, pressed && styles.pressed]}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Ionicons name="arrow-back" size={19} color={colors.text} />
      </Pressable>
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? (
          <Text numberOfLines={1} style={styles.subtitle}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right || (showCart ? <CartButton /> : null)}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  back: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.subtle,
  },
  copy: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 10.5,
    fontWeight: '500',
    color: colors.textMuted,
    marginTop: 1,
  },
  pressed: {
    opacity: 0.8,
  },
});
