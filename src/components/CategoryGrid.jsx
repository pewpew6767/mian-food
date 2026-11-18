import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CATEGORIES } from '@/data/categories';
import { colors, spacing } from '@/theme';

export default function CategoryGrid({ onSelect }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.heading}>What are you craving?</Text>
      <View style={styles.grid}>
        {CATEGORIES.map((category) => (
          <Pressable
            key={category.id}
            onPress={() => onSelect(category)}
            style={({ pressed }) => [
              styles.item,
              pressed && styles.pressed,
            ]}
            accessibilityRole="button"
          >
            <View style={styles.iconCircle}>
              <Ionicons
                name={category.icon}
                size={24}
                color={colors.primary}
              />
            </View>
            <Text style={styles.label} numberOfLines={1}>
              {category.name}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.xl,
  },
  heading: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  item: {
    width: '25%',
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingHorizontal: 2,
  },
  pressed: {
    opacity: 0.7,
  },
  iconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
  },
});
