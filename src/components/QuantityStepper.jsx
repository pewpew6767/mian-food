import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius } from '@/theme';

export default function QuantityStepper({ qty, onMinus, onPlus }) {
  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={onMinus}
        style={styles.button}
        hitSlop={6}
        accessibilityRole="button"
        accessibilityLabel="Decrease quantity"
      >
        <Ionicons name="remove" size={15} color={colors.primary} />
      </Pressable>
      <Text style={styles.qty}>{qty}</Text>
      <Pressable
        onPress={onPlus}
        style={styles.button}
        hitSlop={6}
        accessibilityRole="button"
        accessibilityLabel="Increase quantity"
      >
        <Ionicons name="add" size={15} color={colors.primary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.primaryLight,
    padding: 3,
    gap: 2,
  },
  button: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qty: {
    minWidth: 22,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '800',
    color: colors.text,
  },
});
