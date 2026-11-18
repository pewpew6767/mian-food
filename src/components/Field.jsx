import { StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, radius, spacing } from '@/theme';

export default function Field({
  label,
  error,
  multiline = false,
  style,
  inputStyle,
  ...props
}) {
  return (
    <View style={[styles.wrap, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        placeholderTextColor={colors.textLight}
        multiline={multiline}
        style={[
          styles.input,
          multiline && styles.multiline,
          error && styles.inputError,
          inputStyle,
        ]}
        {...props}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.2,
  },
  input: {
    minHeight: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: spacing.md,
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  multiline: {
    minHeight: 84,
    paddingTop: spacing.md,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: colors.danger,
    backgroundColor: colors.dangerLight,
  },
  error: {
    fontSize: 11.5,
    fontWeight: '600',
    color: colors.danger,
  },
});
