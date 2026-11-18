import { createContext, useCallback, useContext, useMemo } from 'react';
import useStoredState from '@/utils/useStoredState';

const DEFAULT_USER = {
  name: 'Hamza Khan',
  phone: '0300 1234567',
  addresses: [
    {
      id: 'addr-home',
      label: 'Home',
      line: 'House 12, Street 5, Susan Road, Madina Town',
      city: 'Faisalabad',
    },
    {
      id: 'addr-work',
      label: 'Work',
      line: 'Office 304, Kohinoor City, Main Jaranwala Road',
      city: 'Faisalabad',
    },
  ],
  selectedAddressId: 'addr-home',
};

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useStoredState('mianfood.user.v3', DEFAULT_USER);

  const updateProfile = useCallback(
    (patch) => {
      setUser((previous) => ({ ...previous, ...patch }));
    },
    [setUser]
  );

  const addAddress = useCallback(
    (address) => {
      const entry = { ...address, id: `addr-${Date.now()}` };
      setUser((previous) => ({
        ...previous,
        addresses: [...previous.addresses, entry],
        selectedAddressId: entry.id,
      }));
      return entry;
    },
    [setUser]
  );

  const updateAddress = useCallback(
    (id, patch) => {
      setUser((previous) => ({
        ...previous,
        addresses: previous.addresses.map((address) =>
          address.id === id ? { ...address, ...patch } : address
        ),
      }));
    },
    [setUser]
  );

  const removeAddress = useCallback(
    (id) => {
      setUser((previous) => {
        const addresses = previous.addresses.filter(
          (address) => address.id !== id
        );
        const selectedAddressId =
          previous.selectedAddressId === id
            ? addresses[0]?.id || null
            : previous.selectedAddressId;
        return { ...previous, addresses, selectedAddressId };
      });
    },
    [setUser]
  );

  const selectAddress = useCallback(
    (id) => {
      setUser((previous) => ({ ...previous, selectedAddressId: id }));
    },
    [setUser]
  );

  const selectedAddress = useMemo(
    () =>
      user.addresses.find((address) => address.id === user.selectedAddressId) ||
      null,
    [user.addresses, user.selectedAddressId]
  );

  const value = useMemo(
    () => ({
      user,
      selectedAddress,
      updateProfile,
      addAddress,
      updateAddress,
      removeAddress,
      selectAddress,
    }),
    [
      user,
      selectedAddress,
      updateProfile,
      addAddress,
      updateAddress,
      removeAddress,
      selectAddress,
    ]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used inside UserProvider');
  }
  return context;
}
