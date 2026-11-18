import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { ORDER_STEPS } from '@/data/orderStatus';
import { colors, radius, spacing } from '@/theme';
import { formatClock } from '@/utils/format';

export default function OrderTimeline({ order }) {
  return (
    <View style={styles.card}>
      {ORDER_STEPS.map((step, index) => {
        const done = index < order.statusIndex;
        const active = index === order.statusIndex;
        const reached = done || active;
        const event = order.timeline.find((entry) => entry.step === index);
        const last = index === ORDER_STEPS.length - 1;

        return (
          <View key={step.key} style={styles.row}>
            <View style={styles.rail}>
              <View
                style={[
                  styles.dot,
                  reached && styles.dotReached,
                  active && styles.dotActive,
                ]}
              >
                <Ionicons
                  name={step.icon}
                  size={14}
                  color={reached ? colors.white : colors.textLight}
                />
              </View>
              {!last ? (
                <View
                  style={[
                    styles.connector,
                    done && styles.connectorDone,
                  ]}
                />
              ) : null}
            </View>
            <View style={[styles.body, last && styles.bodyLast]}>
              <Text
                style={[styles.title, !reached && styles.titlePending]}
              >
                {step.title}
              </Text>
              <Text style={styles.description}>{step.description}</Text>
              <View style={styles.metaRow}>
                {event ? (
                  <Text style={styles.time}>{formatClock(event.at)}</Text>
                ) : null}
                {active && !last ? (
                  <View style={styles.live}>
                    <View style={styles.liveDot} />
                    <Text style={styles.liveText}>In progress</Text>
                  </View>
                ) : null}
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    paddingBottom: 2,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  rail: {
    alignItems: 'center',
    width: 30,
  },
  dot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotReached: {
    backgroundColor: colors.primary,
  },
  dotActive: {
    borderWidth: 3,
    borderColor: colors.primaryLight,
  },
  connector: {
    width: 2,
    flex: 1,
    minHeight: 18,
    backgroundColor: colors.border,
    marginVertical: 3,
  },
  connectorDone: {
    backgroundColor: colors.primary,
  },
  body: {
    flex: 1,
    paddingBottom: spacing.xl,
    paddingTop: 4,
  },
  bodyLast: {
    paddingBottom: spacing.lg,
  },
  title: {
    fontSize: 13.5,
    fontWeight: '700',
    color: colors.text,
  },
  titlePending: {
    color: colors.textLight,
  },
  description: {
    fontSize: 11.5,
    color: colors.textMuted,
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: 5,
  },
  time: {
    fontSize: 10.5,
    fontWeight: '600',
    color: colors.textLight,
  },
  live: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  liveText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: colors.primary,
  },
});
