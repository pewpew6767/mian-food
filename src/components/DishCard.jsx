import { useRouter } from 'expo-router';
import { Image, Pressable, StyleSheet, Text } from 'react-native';
import { colors, radius, shadows } from '@/theme';
import { formatPKR } from '@/utils/format';

export default function DishCard({ restaurant, item, width = 176 }) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(`/food/${restaurant.id}/${item.id}`)}
      style={({ pressed }) => [
        styles.card,
        { width },
        pressed && styles.pressed,
      ]}
      accessibilityRole="button"
    >
      <Image source={item.image} style={styles.image} />
      <Text numberOfLines={1} style={styles.name}>
        {item.name}
      </Text>
      <Text numberOfLines={1} style={styles.restaurant}>
        {restaurant.name}
      </Text>
      <Text style={styles.price}>{formatPKR(item.price)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadows.subtle,
  },
  pressed: {
    opacity: 0.9,
  },
  image: {
    width: '100%',
    height: 104,
    backgroundColor: colors.surfaceAlt,
  },
  name: {
    fontSize: 12.5,
    fontWeight: '700',
    color: colors.text,
    paddingHorizontal: 10,
    paddingTop: 8,
  },
  restaurant: {
    fontSize: 10.5,
    color: colors.textMuted,
    paddingHorizontal: 10,
    marginTop: 1,
  },
  price: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.text,
    paddingHorizontal: 10,
    paddingTop: 4,
    paddingBottom: 10,
  },
});
