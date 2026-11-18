import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import ConfirmDialog from '@/components/ConfirmDialog';
import Field from '@/components/Field';
import PrimaryButton from '@/components/PrimaryButton';
import ScreenHeader from '@/components/ScreenHeader';
import { useUser } from '@/context/UserContext';
import { colors, radius, shadows, spacing } from '@/theme';

const labelIcon = (label = '') => {
  const value = label.toLowerCase();
  if (value.includes('home')) return 'home-outline';
  if (value.includes('work') || value.includes('office')) {
    return 'briefcase-outline';
  }
  return 'location-outline';
};

export default function AddressesScreen() {
  const insets = useSafeAreaInsets();
  const {
    user,
    selectAddress,
    addAddress,
    updateAddress,
    removeAddress,
  } = useUser();
  const [formVisible, setFormVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [label, setLabel] = useState('Home');
  const [line, setLine] = useState('');
  const [city, setCity] = useState('Faisalabad');
  const [errors, setErrors] = useState({});
  const [pendingDelete, setPendingDelete] = useState(null);

  const openAdd = () => {
    setEditingId(null);
    setLabel('Home');
    setLine('');
    setCity('Faisalabad');
    setErrors({});
    setFormVisible(true);
  };

  const openEdit = (address) => {
    setEditingId(address.id);
    setLabel(address.label);
    setLine(address.line);
    setCity(address.city);
    setErrors({});
    setFormVisible(true);
  };

  const saveAddress = () => {
    const next = {};
    if (line.trim().length < 5) {
      next.line = 'Enter a complete street address.';
    }
    if (city.trim().length < 2) {
      next.city = 'Enter a city.';
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const payload = {
      label: label.trim() || 'Home',
      line: line.trim(),
      city: city.trim(),
    };

    if (editingId) {
      updateAddress(editingId, payload);
    } else {
      addAddress(payload);
    }
    setFormVisible(false);
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScreenHeader
        title="Saved addresses"
        subtitle="Pick where your food should arrive"
        right={
          <Pressable
            onPress={openAdd}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Add a new address"
          >
            <Ionicons name="add-circle" size={28} color={colors.primary} />
          </Pressable>
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {user.addresses.length === 0 ? (
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="location-outline"
                size={32}
                color={colors.primary}
              />
            </View>
            <Text style={styles.emptyTitle}>No addresses yet</Text>
            <Text style={styles.emptyText}>
              Add your home or work address to speed up checkout.
            </Text>
          </View>
        ) : (
          user.addresses.map((address) => {
            const selected = address.id === user.selectedAddressId;
            return (
              <View
                key={address.id}
                style={[styles.card, selected && styles.cardSelected]}
              >
                <Pressable
                  onPress={() => selectAddress(address.id)}
                  style={styles.cardMain}
                  accessibilityRole="radio"
                  accessibilityState={{ selected, checked: selected }}
                >
                  <View
                    style={[
                      styles.icon,
                      selected && styles.iconSelected,
                    ]}
                  >
                    <Ionicons
                      name={labelIcon(address.label)}
                      size={18}
                      color={colors.primary}
                    />
                  </View>
                  <View style={styles.cardCopy}>
                    <View style={styles.labelRow}>
                      <Text style={styles.label}>{address.label}</Text>
                      {selected ? (
                        <View style={styles.defaultPill}>
                          <Text style={styles.defaultText}>Default</Text>
                        </View>
                      ) : null}
                    </View>
                    <Text style={styles.line}>{address.line}</Text>
                    <Text style={styles.city}>{address.city}</Text>
                  </View>
                  <View style={[styles.radio, selected && styles.radioOn]}>
                    {selected ? <View style={styles.radioDot} /> : null}
                  </View>
                </Pressable>

                <View style={styles.actions}>
                  <Pressable
                    onPress={() => openEdit(address)}
                    style={styles.action}
                    hitSlop={6}
                  >
                    <Ionicons
                      name="create-outline"
                      size={15}
                      color={colors.textMuted}
                    />
                    <Text style={styles.actionText}>Edit</Text>
                  </Pressable>
                  <View style={styles.actionDivider} />
                  <Pressable
                    onPress={() => setPendingDelete(address)}
                    style={styles.action}
                    hitSlop={6}
                  >
                    <Ionicons
                      name="trash-outline"
                      size={15}
                      color={colors.danger}
                    />
                    <Text style={[styles.actionText, styles.removeText]}>
                      Remove
                    </Text>
                  </Pressable>
                </View>
              </View>
            );
          })
        )}

        <PrimaryButton
          label="Add new address"
          icon="add"
          variant="secondary"
          onPress={openAdd}
        />

        <Text style={styles.note}>
          Tap an address to make it your default delivery location.
        </Text>
      </ScrollView>

      {formVisible ? (
        <Modal
          visible
          transparent
        animationType="slide"
        onRequestClose={() => setFormVisible(false)}
      >
        <View style={styles.modalRoot}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setFormVisible(false)}
          />
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <View
              style={[
                styles.sheet,
                {
                  paddingBottom: Math.max(insets.bottom, spacing.lg),
                },
              ]}
            >
              <View style={styles.handle} />
              <View style={styles.sheetHead}>
                <View>
                  <Text style={styles.sheetTitle}>
                    {editingId ? 'Edit address' : 'Add address'}
                  </Text>
                  <Text style={styles.sheetSubtitle}>
                    We will deliver your order here
                  </Text>
                </View>
                <Pressable
                  onPress={() => setFormVisible(false)}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel="Close"
                >
                  <Ionicons
                    name="close"
                    size={22}
                    color={colors.textMuted}
                  />
                </Pressable>
              </View>

              <View style={styles.sheetFields}>
                <Field
                  label="Label"
                  value={label}
                  onChangeText={setLabel}
                  placeholder="Home, Work, Other"
                />
                <Field
                  label="Street address"
                  value={line}
                  onChangeText={(text) => {
                    setLine(text);
                    setErrors((previous) => ({
                      ...previous,
                      line: undefined,
                    }));
                  }}
                  placeholder="House, street, area"
                  error={errors.line}
                />
                <Field
                  label="City"
                  value={city}
                  onChangeText={(text) => {
                    setCity(text);
                    setErrors((previous) => ({
                      ...previous,
                      city: undefined,
                    }));
                  }}
                  placeholder="Faisalabad"
                  error={errors.city}
                />
              </View>

              <PrimaryButton
                label={editingId ? 'Save address' : 'Add address'}
                icon="checkmark"
                onPress={saveAddress}
                style={styles.sheetButton}
              />
            </View>
          </KeyboardAvoidingView>
        </View>
        </Modal>
      ) : null}

      <ConfirmDialog
        visible={!!pendingDelete}
        icon="trash"
        destructive
        title="Remove address?"
        message={`"${pendingDelete?.label}" will be removed from your saved addresses.`}
        confirmLabel="Remove"
        onConfirm={() => {
          if (pendingDelete) removeAddress(pendingDelete.id);
          setPendingDelete(null);
        }}
        onCancel={() => setPendingDelete(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl,
    gap: spacing.lg,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  cardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.pinkSoft,
  },
  cardMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
  },
  icon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconSelected: {
    backgroundColor: colors.primaryLight,
  },
  cardCopy: {
    flex: 1,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  label: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
  },
  defaultPill: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  defaultText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  line: {
    fontSize: 12,
    lineHeight: 17,
    color: colors.textMuted,
    marginTop: 3,
  },
  city: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textLight,
    marginTop: 2,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOn: {
    borderColor: colors.primary,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.white,
  },
  action: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 10,
  },
  actionText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: colors.textMuted,
  },
  removeText: {
    color: colors.danger,
  },
  actionDivider: {
    width: 1,
    height: 18,
    backgroundColor: colors.border,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.xl,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
  },
  emptyText: {
    fontSize: 12.5,
    lineHeight: 18,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  note: {
    fontSize: 11,
    color: colors.textLight,
    textAlign: 'center',
  },
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(17, 17, 24, 0.45)',
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    ...shadows.modal,
  },
  handle: {
    alignSelf: 'center',
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginBottom: spacing.md,
  },
  sheetHead: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  sheetSubtitle: {
    fontSize: 11.5,
    color: colors.textMuted,
    marginTop: 2,
  },
  sheetFields: {
    gap: spacing.md,
  },
  sheetButton: {
    marginTop: spacing.xl,
  },
});
