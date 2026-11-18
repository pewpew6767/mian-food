import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useOrders } from '@/context/OrdersContext';
import useBreakpoint from '@/hooks/useBreakpoint';
import { colors } from '@/theme';

export default function TabsLayout() {
  const { activeOrders } = useOrders();
  const { hideTabs } = useBreakpoint();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: hideTabs
          ? { display: 'none' }
          : {
              backgroundColor: colors.white,
              borderTopColor: colors.border,
              borderTopWidth: 1,
              paddingTop: 6,
            },
        tabBarLabelStyle: {
          fontSize: 10.5,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'search' : 'search-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          tabBarBadge:
            activeOrders.length > 0 ? activeOrders.length : undefined,
          tabBarBadgeStyle: {
            backgroundColor: colors.primary,
            color: colors.white,
            fontSize: 9,
            fontWeight: '800',
          },
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'receipt' : 'receipt-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
