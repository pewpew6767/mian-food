import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CartProvider } from '@/context/CartContext';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { OrdersProvider } from '@/context/OrdersContext';
import { UserProvider } from '@/context/UserContext';
import { colors } from '@/theme';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <UserProvider>
        <FavoritesProvider>
          <CartProvider>
            <OrdersProvider>
              <StatusBar style="dark" />
              <Stack
                screenOptions={{
                  headerShown: false,
                  contentStyle: { backgroundColor: colors.background },
                  animation: 'slide_from_right',
                }}
              >
                <Stack.Screen name="(tabs)" />
                <Stack.Screen
                  name="address-picker"
                  options={{
                    presentation: 'modal',
                    animation: 'slide_from_bottom',
                  }}
                />
              </Stack>
            </OrdersProvider>
          </CartProvider>
        </FavoritesProvider>
      </UserProvider>
    </SafeAreaProvider>
  );
}
