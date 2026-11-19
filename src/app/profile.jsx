import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Redirect, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Field from '@/components/Field';
import PrimaryButton from '@/components/PrimaryButton';
import ScreenHeader from '@/components/ScreenHeader';
import { useUser } from '@/context/UserContext';
import { colors, radius, spacing } from '@/theme';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, hydrated, updateProfile } = useUser();
  const [nameDraft, setNameDraft] = useState(null);
  const [phoneDraft, setPhoneDraft] = useState(null);
  // Fall back to the saved profile so the fields fill in once it loads,
  // without resetting anything the customer is typing.
  const name = nameDraft ?? user.name;
  const phone = phoneDraft ?? user.phone;
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  if (!hydrated) {
    return null;
  }

  if (!user.id) {
    return <Redirect href="/login" />;
  }

  const initials = user.name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const save = () => {
    const next = {};
    if (name.trim().length < 2) {
      next.name = 'Please enter your full name.';
    }
    if (phone.replace(/\D/g, '').length < 10) {
      next.phone = 'Enter a valid phone number.';
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    updateProfile({ name: name.trim(), phone: phone.trim() });
    setSaved(true);
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScreenHeader title="Profile" subtitle="Manage your account details" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <LinearGradient
          colors={[colors.primaryLight, colors.white]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials || 'G'}</Text>
          </View>
          <Text style={styles.heroName}>{user.name}</Text>
          <Text style={styles.heroPhone}>{user.phone}</Text>
          <View style={styles.heroMeta}>
            <Ionicons
              name="shield-checkmark"
              size={13}
              color={colors.success}
            />
            <Text style={styles.heroMetaText}>
              Saved on this device
            </Text>
          </View>
        </LinearGradient>

        {saved ? (
          <View style={styles.savedBanner}>
            <Ionicons
              name="checkmark-circle"
              size={17}
              color={colors.success}
            />
            <Text style={styles.savedText}>
              Profile updated. Checkout will use these details.
            </Text>
          </View>
        ) : null}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Personal details</Text>
          <Field
            label="Full name"
            value={name}
            onChangeText={(text) => {
              setNameDraft(text);
              setSaved(false);
              setErrors((previous) => ({ ...previous, name: undefined }));
            }}
            placeholder="Your full name"
            autoCapitalize="words"
            error={errors.name}
          />
          <Field
            label="Phone number"
            value={phone}
            onChangeText={(text) => {
              setPhoneDraft(text);
              setSaved(false);
              setErrors((previous) => ({ ...previous, phone: undefined }));
            }}
            placeholder="03xx xxxxxxx"
            keyboardType="phone-pad"
            error={errors.phone}
          />
        </View>

        <PrimaryButton
          label="Save changes"
          icon="checkmark"
          onPress={save}
        />

        <Pressable
          onPress={() => router.push('/addresses')}
          style={styles.linkRow}
          accessibilityRole="button"
        >
          <View style={styles.linkIcon}>
            <Ionicons name="location-outline" size={18} color={colors.primary} />
          </View>
          <View style={styles.linkCopy}>
            <Text style={styles.linkTitle}>Saved addresses</Text>
            <Text style={styles.linkHint}>
              {user.addresses.length}{' '}
              {user.addresses.length === 1 ? 'address' : 'addresses'} saved
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={17}
            color={colors.textLight}
          />
        </Pressable>

        <Text style={styles.note}>
          Your name and phone number are used to autofill checkout. All data is
          stored locally on this device.
        </Text>
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
    paddingBottom: spacing.xxxl,
    gap: spacing.lg,
  },
  hero: {
    alignItems: 'center',
    borderRadius: radius.xxl,
    paddingVertical: spacing.xxl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatar: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: colors.white,
    boxShadow: '0px 6px 16px rgba(240, 46, 116, 0.25)',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: 1,
  },
  heroName: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginTop: spacing.md,
    letterSpacing: -0.3,
  },
  heroPhone: {
    fontSize: 12.5,
    fontWeight: '500',
    color: colors.textMuted,
    marginTop: 3,
  },
  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: spacing.sm,
  },
  heroMetaText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: colors.success,
  },
  savedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.successLight,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
  },
  savedText: {
    flex: 1,
    fontSize: 11.5,
    fontWeight: '600',
    color: colors.success,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.lg,
  },
  cardTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: colors.text,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  linkIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkCopy: {
    flex: 1,
  },
  linkTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  linkHint: {
    fontSize: 10.5,
    color: colors.textMuted,
    marginTop: 2,
  },
  note: {
    fontSize: 11,
    lineHeight: 16,
    color: colors.textLight,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
});
