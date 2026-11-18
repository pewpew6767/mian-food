export const ORDER_STEPS = [
  {
    key: 'placed',
    title: 'Order placed',
    description: 'We have received your order',
    icon: 'receipt',
  },
  {
    key: 'accepted',
    title: 'Restaurant accepted',
    description: 'Your order has been confirmed',
    icon: 'checkmark-circle',
  },
  {
    key: 'preparing',
    title: 'Preparing your food',
    description: 'The kitchen is cooking your meal',
    icon: 'restaurant',
  },
  {
    key: 'picked',
    title: 'Rider picked up',
    description: 'Your food is on the way',
    icon: 'bicycle',
  },
  {
    key: 'delivered',
    title: 'Delivered',
    description: 'Enjoy your meal!',
    icon: 'home',
  },
];

export const STEP_INTERVAL_MS = 5000;
