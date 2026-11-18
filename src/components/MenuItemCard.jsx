import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, shadows, spacing } from '@/theme';
import { formatPKR } from '@/utils/format';

export default function MenuItemCard({ item, onPress, onAdd }) {
  return (
    <View style={styles.row}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.main, pressed && styles.pressed]}
        accessibilityRole="button"
      >
        <View style={styles.copy}>
          {item.badge ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.badge}</Text>
            </View>
          ) : null}
          <Text style={styles.name}>{item.name}</Text>
          <Text numberOfLines={2} style={styles.description}>
            {item.description}
          </Text>
          <Text style={styles.price}>{formatPKR(item.price)}</Text>
        </View>
        <View style={styles.imageWrap}>
          <Image source={item.image} style={styles.image} />
        </View>
      </Pressable>
      <Pressable
        onPress={onAdd}
        style={styles.addButton}
        hitSlop={6}
        accessibilityRole="button"
        accessibilityLabel={`Add ${item.name} to cart`}
      >
        <Ionicons name="add" size={19} color={colors.primary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    position: 'relative',
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  main: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  pressed: {
    opacity: 0.85,
  },
  copy: {
    flex: 1,
    gap: 3,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryLight,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginBottom: 2,
  },
  badgeText: {
    color: colors.primary,
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  description: {
    fontSize: 12,
    lineHeight: 17,
    color: colors.textMuted,
  },
  price: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
    marginTop: 3,
  },
  imageWrap: {
    width: 96,
    height: 96,
  },
  image: {
    width: 96,
    height: 96,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceAlt,
  },
  addButton: {
    position: 'absolute',
    right: 0,
    bottom: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.card,
  },
});
