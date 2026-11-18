import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import {
  colors,
  radius,
  shadows,
  spacing,
} from '@/theme';

export default function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  icon = 'alert-circle',
  onConfirm,
  onCancel,
}) {
  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <Pressable style={styles.card} onPress={() => {}}>
          <View
            style={[
              styles.iconCircle,
              destructive && styles.iconCircleDanger,
            ]}
          >
            <Ionicons
              name={icon}
              size={24}
              color={destructive ? colors.danger : colors.primary}
            />
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.actions}>
            <Pressable
              onPress={onCancel}
              style={({ pressed }) => [
                styles.button,
                styles.cancel,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.cancelText}>{cancelLabel}</Text>
            </Pressable>
            <Pressable
              onPress={onConfirm}
              style={({ pressed }) => [
                styles.button,
                styles.confirm,
                destructive && styles.confirmDanger,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.confirmText}>{confirmLabel}</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(17, 17, 24, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: colors.white,
    borderRadius: radius.xxl,
    padding: spacing.xxl,
    alignItems: 'center',
    ...shadows.modal,
  },
  iconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  iconCircleDanger: {
    backgroundColor: colors.dangerLight,
  },
  title: {
    fontSize: 18,
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
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xl,
    width: '100%',
  },
  button: {
    flex: 1,
    height: 46,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancel: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  confirm: {
    backgroundColor: colors.primary,
  },
  confirmDanger: {
    backgroundColor: colors.danger,
  },
  pressed: {
    opacity: 0.85,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  confirmText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.white,
  },
});
