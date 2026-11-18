import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '@/theme';

export default function SectionHeader({
  title,
  subtitle,
  actionLabel = 'See all',
  onAction,
}) {
  return (
    <View style={styles.wrap}>
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {onAction ? (
        <Pressable
          onPress={onAction}
          style={styles.action}
          hitSlop={8}
          accessibilityRole="button"
        >
          <Text style={styles.actionText}>{actionLabel}</Text>
          <Ionicons
            name="chevron-forward"
            size={15}
            color={colors.primary}
          />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    marginTop: spacing.xxl,
    marginBottom: spacing.md,
  },
  copy: {
    flex: 1,
    paddingRight: spacing.md,
  },
  title: {
    fontSize: 19,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textMuted,
    marginTop: 2,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
});
