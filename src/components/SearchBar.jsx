import { Ionicons } from '@expo/vector-icons';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { colors, radius, spacing } from '@/theme';

export default function SearchBar({
  value,
  onChangeText,
  onPress,
  onSubmit,
  placeholder = 'Search restaurants and dishes',
  autoFocus = false,
  style,
}) {
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.wrap, pressed && styles.pressed, style]}
        accessibilityRole="button"
        accessibilityLabel="Search restaurants and dishes"
      >
        <Ionicons name="search" size={19} color={colors.textLight} />
        <Text style={styles.placeholder} numberOfLines={1}>
          {placeholder}
        </Text>
      </Pressable>
    );
  }

  return (
    <View style={[styles.wrap, style]}>
      <Ionicons name="search" size={19} color={colors.textMuted} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        placeholder={placeholder}
        placeholderTextColor={colors.textLight}
        style={styles.input}
        autoFocus={autoFocus}
        returnKeyType="search"
        autoCorrect={false}
        autoCapitalize="none"
      />
      {value ? (
        <Pressable
          onPress={() => onChangeText?.('')}
          hitSlop={8}
          accessibilityLabel="Clear search"
        >
          <Ionicons name="close-circle" size={18} color={colors.textLight} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    height: 50,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: {
    opacity: 0.85,
  },
  placeholder: {
    flex: 1,
    fontSize: 14,
    color: colors.textLight,
    fontWeight: '500',
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
    paddingVertical: 0,
  },
});
