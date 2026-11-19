import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { useUser } from '@/context/UserContext';
import { ORDER_STEPS, STEP_INTERVAL_MS } from '@/data/orderStatus';
import useStoredState from '@/utils/useStoredState';

const OrdersContext = createContext(null);

// Orders saved by the old demo build; they may contain demo personal details.
const LEGACY_ORDERS_KEY = 'mianfood.orders.v2';

const normalizePhone = (phone = '') => phone.replace(/\D/g, '');

export function OrdersProvider({ children }) {
  const { user } = useUser();
  const [allOrders, setOrders, hydrated] = useStoredState(
    'mianfood.orders.v3',
    []
  );
  const ordersRef = useRef(allOrders);
  const timers = useRef({});

  useEffect(() => {
    AsyncStorage.removeItem(LEGACY_ORDERS_KEY).catch(() => {});
  }, []);

  useEffect(() => {
    ordersRef.current = allOrders;
  }, [allOrders]);

  // Each order is only visible to the account that placed it.
  const orders = useMemo(() => {
    if (user.id) {
      const phone = normalizePhone(user.phone);
      return allOrders.filter(
        (order) =>
          order.accountId === user.id ||
          (phone && normalizePhone(order.phone) === phone)
      );
    }
    return allOrders.filter((order) => !order.accountId);
  }, [allOrders, user.id, user.phone]);

  const advance = useCallback(
    (id) => {
      setOrders((previous) =>
        previous.map((order) => {
          if (order.id !== id) return order;
          if (order.statusIndex >= ORDER_STEPS.length - 1) return order;
          const nextIndex = order.statusIndex + 1;
          return {
            ...order,
            statusIndex: nextIndex,
            timeline: [
              ...order.timeline,
              { step: nextIndex, at: Date.now() },
            ],
          };
        })
      );
    },
    [setOrders]
  );

  const schedule = useCallback(
    (id) => {
      if (timers.current[id]) return;
      const tick = () => {
        const order = ordersRef.current.find((entry) => entry.id === id);
        if (!order || order.statusIndex >= ORDER_STEPS.length - 1) {
          clearTimeout(timers.current[id]);
          delete timers.current[id];
          return;
        }
        advance(id);
        timers.current[id] = setTimeout(tick, STEP_INTERVAL_MS);
      };
      timers.current[id] = setTimeout(tick, STEP_INTERVAL_MS);
    },
    [advance]
  );

  useEffect(() => {
    if (!allOrders.length) return;
    allOrders.forEach((order) => {
      if (order.statusIndex < ORDER_STEPS.length - 1) {
        schedule(order.id);
      }
    });
  }, [allOrders, schedule]);

  useEffect(() => {
    const activeTimers = timers.current;
    return () => {
      Object.values(activeTimers).forEach(clearTimeout);
    };
  }, []);

  const placeOrder = useCallback(
    (details) => {
      const now = Date.now();
      const id = `MF-${String(now).slice(-6)}-${Math.floor(
        Math.random() * 90 + 10
      )}`;
      const order = {
        ...details,
        id,
        accountId: user.id || null,
        statusIndex: 0,
        placedAt: now,
        timeline: [{ step: 0, at: now }],
      };
      setOrders((previous) => [order, ...previous]);
      schedule(id);
      return order;
    },
    [schedule, setOrders, user.id]
  );

  const getOrder = useCallback(
    (id) => orders.find((order) => order.id === id) || null,
    [orders]
  );

  const activeOrders = useMemo(
    () => orders.filter((order) => order.statusIndex < ORDER_STEPS.length - 1),
    [orders]
  );

  const value = useMemo(
    () => ({ orders, activeOrders, placeOrder, getOrder, hydrated }),
    [orders, activeOrders, placeOrder, getOrder, hydrated]
  );

  return (
    <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used inside OrdersProvider');
  }
  return context;
}
