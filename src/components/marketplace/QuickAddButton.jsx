import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import ConfirmDialog from '@/components/ConfirmDialog';
import { colors, shadows } from '@/theme';
import useCartAdd from '@/hooks/useCartAdd';

export default function QuickAddButton({
  restaurant,
  item,
  style,
  size = 34,
  label,
}) {
  const { requestAdd, pending, confirmReplace, cancelReplace } =
    useCartAdd(restaurant);
  const [added, setAdded] = useState(false);
  const timer = useRef(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

  const handleAdd = () => {
    const success = requestAdd(item);
    if (!success) return;
    setAdded(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 1100);
  };

  return (
    <>
      <Pressable
        onPress={handleAdd}
        hitSlop={6}
        accessibilityRole="button"
        accessibilityLabel={label || `Add ${item.name} to cart`}
        testID={`quick-add-${item.id}`}
        style={({ pressed }) => [
          styles.button,
          { width: size, height: size, borderRadius: size / 2 },
          added && styles.added,
          pressed && styles.pressed,
          style,
        ]}
      >
        <Ionicons
          name={added ? 'checkmark' : 'add'}
          size={size * 0.55}
          color={added ? colors.white : colors.primary}
        />
      </Pressable>
      <ConfirmDialog
        visible={!!pending}
        icon="cart"
        title="Start a new cart?"
        message="Your cart has items from another restaurant. Adding this item will clear your current cart."
        confirmLabel="Start new cart"
        onConfirm={confirmReplace}
        onCancel={cancelReplace}
      />
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.card,
  },
  added: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.94 }],
  },
});
