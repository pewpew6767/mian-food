import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PrimaryButton from '@/components/PrimaryButton';
import ScreenHeader from '@/components/ScreenHeader';
import { useUser } from '@/context/UserContext';
import { colors, radius, spacing } from '@/theme';

const labelIcon = (label = '') => {
  const value = label.toLowerCase();
  if (value.includes('home')) return 'home-outline';
  if (value.includes('work') || value.includes('office')) {
    return 'briefcase-outline';
  }
  return 'location-outline';
};

export default function AddressPickerScreen() {
  const router = useRouter();
  const { user, selectAddress } = useUser();

  const choose = (id) => {
    selectAddress(id);
    router.back();
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <ScreenHeader
        title="Delivery address"
        subtitle="Where should we deliver?"
        right={
          <Pressable
            onPress={() => router.back()}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Close"
          >
            <Ionicons name="close" size={23} color={colors.textMuted} />
          </Pressable>
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.hint}>
          Choose a saved address for this order.
        </Text>

        {user.addresses.map((address) => {
          const selected = address.id === user.selectedAddressId;
          return (
            <Pressable
              key={address.id}
              onPress={() => choose(address.id)}
              style={({ pressed }) => [
                styles.card,
                selected && styles.cardSelected,
                pressed && styles.pressed,
              ]}
              accessibilityRole="radio"
              accessibilityState={{ selected, checked: selected }}
            >
              <View style={[styles.icon, selected && styles.iconSelected]}>
                <Ionicons
                  name={labelIcon(address.label)}
                  size={19}
                  color={colors.primary}
                />
              </View>
              <View style={styles.copy}>
                <Text style={styles.label}>{address.label}</Text>
                <Text style={styles.line}>{address.line}</Text>
                <Text style={styles.city}>{address.city}</Text>
              </View>
              <View style={[styles.radio, selected && styles.radioOn]}>
                {selected ? (
                  <Ionicons
                    name="checkmark"
                    size={14}
                    color={colors.white}
                  />
                ) : null}
              </View>
            </Pressable>
          );
        })}

        {user.addresses.length === 0 ? (
          <Text style={styles.emptyText}>
            You have no saved addresses yet. Add one to start ordering.
          </Text>
        ) : null}

        <PrimaryButton
          label="Add or manage addresses"
          icon="create-outline"
          variant="secondary"
          onPress={() => router.push('/addresses')}
          style={styles.manageButton}
        />
      </ScrollView>
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
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  hint: {
    fontSize: 11.5,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  cardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.pinkSoft,
  },
  pressed: {
    opacity: 0.9,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconSelected: {
    backgroundColor: colors.primaryLight,
  },
  copy: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
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
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  emptyText: {
    fontSize: 12.5,
    lineHeight: 18,
    color: colors.textMuted,
    textAlign: 'center',
    paddingVertical: spacing.xl,
  },
  manageButton: {
    marginTop: spacing.sm,
  },
});
