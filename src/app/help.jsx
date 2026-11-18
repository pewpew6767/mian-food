import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '@/components/ScreenHeader';
import StatusPill from '@/components/StatusPill';
import { useOrders } from '@/context/OrdersContext';
import { FAQS, SUPPORT } from '@/data/faqs';
import { colors, radius, spacing } from '@/theme';

function ContactRow({ icon, tint, title, subtitle, onPress, last = false }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.contactRow,
        !last && styles.contactBorder,
        pressed && styles.pressed,
      ]}
      accessibilityRole="button"
    >
      <View style={[styles.contactIcon, { backgroundColor: `${tint}18` }]}>
        <Ionicons name={icon} size={18} color={tint} />
      </View>
      <View style={styles.contactCopy}>
        <Text style={styles.contactTitle}>{title}</Text>
        <Text style={styles.contactSubtitle}>{subtitle}</Text>
      </View>
      <Ionicons
        name="chevron-forward"
        size={16}
        color={colors.textLight}
      />
    </Pressable>
  );
}

export default function HelpScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams();
  const { getOrder } = useOrders();
  const order = orderId ? getOrder(orderId) : null;
  const orderItemCount = order
    ? order.items.reduce((sum, line) => sum + line.qty, 0)
    : 0;
  const [openIndex, setOpenIndex] = useState(0);

  const openLink = (url) => {
    Linking.openURL(url).catch(() => {});
  };

  const callSupport = () => openLink(`tel:${SUPPORT.phone}`);
  const whatsappSupport = () =>
    openLink(`https://wa.me/${SUPPORT.whatsapp.replace(/\D/g, '')}`);
  const emailSupport = () =>
    openLink(
      `mailto:${SUPPORT.email}?subject=${encodeURIComponent(
        order
          ? `Help with order ${order.id}`
          : 'MIAN FOOD support request'
      )}`
    );

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScreenHeader
        title="Help & support"
        subtitle="We are here for you"
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {order ? (
          <Pressable
            onPress={() => router.push(`/tracking/${order.id}`)}
            style={({ pressed }) => [
              styles.orderCard,
              pressed && styles.pressed,
            ]}
            accessibilityRole="button"
          >
            <View style={styles.orderHead}>
              <View style={styles.orderIcon}>
                <Ionicons
                  name="receipt-outline"
                  size={19}
                  color={colors.primary}
                />
              </View>
              <View style={styles.orderCopy}>
                <Text style={styles.orderTitle}>
                  Help with order {order.id}
                </Text>
                <Text style={styles.orderMeta}>
                  {order.restaurantName} - {orderItemCount}{' '}
                  {orderItemCount === 1 ? 'item' : 'items'}
                </Text>
              </View>
              <StatusPill statusIndex={order.statusIndex} />
            </View>
            <View style={styles.orderLink}>
              <Text style={styles.orderLinkText}>View order details</Text>
              <Ionicons
                name="arrow-forward"
                size={14}
                color={colors.primary}
              />
            </View>
          </Pressable>
        ) : null}

        <View>
          <Text style={styles.sectionTitle}>Contact us</Text>
          <View style={styles.card}>
            <ContactRow
              icon="call"
              tint={colors.primary}
              title="Call support"
              subtitle={SUPPORT.phone}
              onPress={callSupport}
            />
            <ContactRow
              icon="logo-whatsapp"
              tint={colors.success}
              title="WhatsApp"
              subtitle="Chat with our team instantly"
              onPress={whatsappSupport}
            />
            <ContactRow
              icon="mail-outline"
              tint={colors.warning}
              title="Email"
              subtitle={SUPPORT.email}
              onPress={emailSupport}
              last
            />
          </View>
        </View>

        <View>
          <Text style={styles.sectionTitle}>Frequently asked questions</Text>
          <View style={styles.card}>
            {FAQS.map((faq, index) => {
              const open = openIndex === index;
              return (
                <View
                  key={faq.question}
                  style={[
                    styles.faqItem,
                    index < FAQS.length - 1 && styles.faqBorder,
                  ]}
                >
                  <Pressable
                    onPress={() => setOpenIndex(open ? null : index)}
                    style={styles.faqHead}
                    accessibilityRole="button"
                    accessibilityState={{ expanded: open }}
                  >
                    <Text style={styles.faqQuestion}>{faq.question}</Text>
                    <Ionicons
                      name={open ? 'chevron-up' : 'chevron-down'}
                      size={17}
                      color={colors.textMuted}
                    />
                  </Pressable>
                  {open ? (
                    <Text style={styles.faqAnswer}>{faq.answer}</Text>
                  ) : null}
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.hoursCard}>
          <Ionicons name="time-outline" size={17} color={colors.primary} />
          <View style={styles.hoursCopy}>
            <Text style={styles.hoursTitle}>Support hours</Text>
            <Text style={styles.hoursText}>
              Every day, 10:00 AM to 12:00 AM. Average reply time is under 3
              minutes.
            </Text>
          </View>
        </View>
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
    gap: spacing.xl,
  },
  orderCard: {
    backgroundColor: colors.pinkSoft,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.primaryLight,
    padding: spacing.lg,
  },
  orderHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  orderIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderCopy: {
    flex: 1,
  },
  orderTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.text,
  },
  orderMeta: {
    fontSize: 10.5,
    color: colors.textMuted,
    marginTop: 2,
  },
  orderLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.primaryLight,
  },
  orderLinkText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: colors.primary,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  contactBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  pressed: {
    opacity: 0.88,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactCopy: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  contactSubtitle: {
    fontSize: 10.5,
    color: colors.textMuted,
    marginTop: 2,
  },
  faqItem: {
    paddingVertical: spacing.md,
  },
  faqBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  faqHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  faqQuestion: {
    flex: 1,
    fontSize: 12.5,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 18,
  },
  faqAnswer: {
    fontSize: 11.5,
    lineHeight: 17,
    color: colors.textMuted,
    marginTop: spacing.sm,
    paddingRight: spacing.lg,
  },
  hoursCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  hoursCopy: {
    flex: 1,
  },
  hoursTitle: {
    fontSize: 11.5,
    fontWeight: '700',
    color: colors.text,
  },
  hoursText: {
    fontSize: 11,
    lineHeight: 16,
    color: colors.textMuted,
    marginTop: 2,
  },
});
