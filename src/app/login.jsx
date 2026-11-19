import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Field from '@/components/Field';
import PrimaryButton from '@/components/PrimaryButton';
import ScreenHeader from '@/components/ScreenHeader';
import { useUser } from '@/context/UserContext';
import { colors, radius, spacing } from '@/theme';

export default function LoginScreen() {
  const router = useRouter();
  const { logIn } = useUser();
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState({});

  const logInToAccount = () => {
    const next = {};
    if (phone.replace(/\D/g, '').length < 10) {
      next.phone = 'Enter the phone number you signed up with.';
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const result = logIn(phone.trim());
    if (!result.ok) {
      setErrors({ phone: result.error });
      return;
    }
    router.replace('/account');
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScreenHeader title="Log in" subtitle="Welcome back to MIAN FOOD" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
      >
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Find your account</Text>
          <Field
            label="Phone number"
            value={phone}
            onChangeText={(text) => {
              setPhone(text);
              setErrors((previous) => ({ ...previous, phone: undefined }));
            }}
            placeholder="03xx xxxxxxx"
            keyboardType="phone-pad"
            error={errors.phone}
            onSubmitEditing={logInToAccount}
          />
        </View>

        <PrimaryButton
          label="Log in"
          icon="log-in"
          onPress={logInToAccount}
        />

        <View style={styles.noteRow}>
          <Ionicons
            name="shield-checkmark-outline"
            size={15}
            color={colors.textMuted}
          />
          <Text style={styles.note}>
            Accounts are stored on this device, so logging in here only
            restores profiles created on this device.
          </Text>
        </View>

        <Pressable
          onPress={() => router.replace('/signup')}
          style={styles.linkRow}
          accessibilityRole="button"
        >
          <Text style={styles.linkMuted}>New to MIAN FOOD?</Text>
          <Text style={styles.link}>Create an account</Text>
        </Pressable>
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
  noteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  note: {
    flex: 1,
    fontSize: 11,
    lineHeight: 16,
    color: colors.textMuted,
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  linkMuted: {
    fontSize: 12.5,
    color: colors.textMuted,
  },
  link: {
    fontSize: 12.5,
    fontWeight: '800',
    color: colors.primary,
  },
});
