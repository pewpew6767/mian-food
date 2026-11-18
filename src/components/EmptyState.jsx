import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import PrimaryButton from '@/components/PrimaryButton';
import { colors, spacing } from '@/theme';

export default function EmptyState({
  icon = 'bag-outline',
  title,
  message,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondary,
}) {
  return (
    <View style={styles.wrap}>
      <View style={styles.iconCircle}>
        <Ionicons name={icon} size={38} color={colors.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {actionLabel ? (
        <PrimaryButton
          label={actionLabel}
          onPress={onAction}
          style={styles.button}
        />
      ) : null}
      {secondaryLabel ? (
        <PrimaryButton
          label={secondaryLabel}
          variant="ghost"
          small
          onPress={onSecondary}
          style={styles.secondary}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxxl,
  },
  iconCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 19,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
  },
  message: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  button: {
    marginTop: spacing.xl,
    alignSelf: 'stretch',
  },
  secondary: {
    marginTop: spacing.xs,
  },
});
