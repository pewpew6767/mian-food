import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, radius } from '@/theme';

export default function FilterChip({ label, active, onPress, icon }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        active && styles.active,
        pressed && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
    >
      {icon ? (
        <Ionicons
          name={icon}
          size={13}
          color={active ? colors.white : colors.textMuted}
        />
      ) : null}
      <Text style={[styles.label, active && styles.labelActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  active: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    fontSize: 12.5,
    fontWeight: '600',
    color: colors.textMuted,
  },
  labelActive: {
    color: colors.white,
  },
});
