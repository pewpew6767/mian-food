import { Ionicons } from '@expo/vector-icons';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors, radius } from '@/theme';

export default function PrimaryButton({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  icon,
  small = false,
  style,
}) {
  const secondary = variant === 'secondary';
  const ghost = variant === 'ghost';
  const tint = secondary || ghost ? colors.primary : colors.white;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        small && styles.small,
        secondary && styles.secondary,
        ghost && styles.ghost,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={tint} />
      ) : (
        <View style={styles.content}>
          {icon ? <Ionicons name={icon} size={18} color={tint} /> : null}
          <Text
            style={[
              styles.label,
              small && styles.labelSmall,
              (secondary || ghost) && styles.labelSecondary,
            ]}
          >
            {label}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 52,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  small: {
    height: 42,
    borderRadius: radius.md,
  },
  secondary: {
    backgroundColor: colors.primaryLight,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: 0.1,
  },
  labelSmall: {
    fontSize: 13,
  },
  labelSecondary: {
    color: colors.primary,
  },
});
