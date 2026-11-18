import { createContext, useCallback, useContext, useMemo } from 'react';
import { getRestaurant } from '@/data/restaurants';
import useStoredState from '@/utils/useStoredState';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useStoredState('mianfood.cart.v1', null);

  const addItem = useCallback(
    (restaurant, item, extras = [], qty = 1) => {
      const extraTotal = extras.reduce((sum, extra) => sum + extra.price, 0);
      const unitPrice = item.price + extraTotal;
      const key = `${item.id}|${extras
        .map((extra) => extra.id)
        .sort()
        .join('+')}`;
      const cartItem = {
        key,
        itemId: item.id,
        name: item.name,
        unitPrice,
        qty,
        extras: extras.map((extra) => ({
          id: extra.id,
          name: extra.name,
          price: extra.price,
        })),
      };

      setCart((previous) => {
        if (!previous || previous.restaurantId !== restaurant.id) {
          return { restaurantId: restaurant.id, items: [cartItem] };
        }
        const existing = previous.items.find((entry) => entry.key === key);
        if (existing) {
          return {
            ...previous,
            items: previous.items.map((entry) =>
              entry.key === key
                ? { ...entry, qty: entry.qty + qty }
                : entry
            ),
          };
        }
        return { ...previous, items: [...previous.items, cartItem] };
      });
    },
    [setCart]
  );

  const changeQty = useCallback(
    (key, delta) => {
      setCart((previous) => {
        if (!previous) return previous;
        const items = previous.items
          .map((entry) =>
            entry.key === key ? { ...entry, qty: entry.qty + delta } : entry
          )
          .filter((entry) => entry.qty > 0);
        return items.length ? { ...previous, items } : null;
      });
    },
    [setCart]
  );

  const removeItem = useCallback(
    (key) => {
      setCart((previous) => {
        if (!previous) return previous;
        const items = previous.items.filter((entry) => entry.key !== key);
        return items.length ? { ...previous, items } : null;
      });
    },
    [setCart]
  );

  const clearCart = useCallback(() => setCart(null), [setCart]);

  const restaurant = cart ? getRestaurant(cart.restaurantId) : null;

  const totals = useMemo(() => {
    const subtotal = cart
      ? cart.items.reduce(
          (sum, item) => sum + item.unitPrice * item.qty,
          0
        )
      : 0;
    const discount = restaurant
      ? Math.round((subtotal * restaurant.discount) / 100)
      : 0;
    const deliveryFee = restaurant ? restaurant.deliveryFee : 0;
    return {
      subtotal,
      discount,
      deliveryFee,
      total: subtotal - discount + deliveryFee,
    };
  }, [cart, restaurant]);

  const itemCount = cart
    ? cart.items.reduce((sum, item) => sum + item.qty, 0)
    : 0;

  const value = useMemo(
    () => ({
      cart,
      restaurant,
      itemCount,
      ...totals,
      addItem,
      changeQty,
      removeItem,
      clearCart,
    }),
    [
      cart,
      restaurant,
      itemCount,
      totals,
      addItem,
      changeQty,
      removeItem,
      clearCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used inside CartProvider');
  }
  return context;
}
