import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { ORDER_STEPS, STEP_INTERVAL_MS } from '@/data/orderStatus';
import useStoredState from '@/utils/useStoredState';

const OrdersContext = createContext(null);

export function OrdersProvider({ children }) {
  const [orders, setOrders, hydrated] = useStoredState(
    'mianfood.orders.v2',
    []
  );
  const ordersRef = useRef(orders);
  const timers = useRef({});

  useEffect(() => {
    ordersRef.current = orders;
  }, [orders]);

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
    if (!orders.length) return;
    orders.forEach((order) => {
      if (order.statusIndex < ORDER_STEPS.length - 1) {
        schedule(order.id);
      }
    });
  }, [orders, schedule]);

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
        statusIndex: 0,
        placedAt: now,
        timeline: [{ step: 0, at: now }],
      };
      setOrders((previous) => [order, ...previous]);
      schedule(id);
      return order;
    },
    [schedule, setOrders]
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
