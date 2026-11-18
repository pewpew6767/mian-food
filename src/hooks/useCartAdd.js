import { useCallback, useState } from 'react';
import { useCart } from '@/context/CartContext';

export default function useCartAdd(restaurant) {
  const { cart, addItem, clearCart } = useCart();
  const [pending, setPending] = useState(null);

  const requestAdd = useCallback(
    (item, extras = [], qty = 1) => {
      if (cart && cart.restaurantId !== restaurant.id) {
        setPending({ item, extras, qty });
        return false;
      }
      addItem(restaurant, item, extras, qty);
      return true;
    },
    [addItem, cart, restaurant]
  );

  const confirmReplace = useCallback(() => {
    if (!pending) return;
    clearCart();
    addItem(restaurant, pending.item, pending.extras, pending.qty);
    setPending(null);
  }, [addItem, clearCart, pending, restaurant]);

  const cancelReplace = useCallback(() => setPending(null), []);

  return { requestAdd, pending, confirmReplace, cancelReplace };
}
