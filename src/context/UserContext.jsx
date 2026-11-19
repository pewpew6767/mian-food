import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import useStoredState from '@/utils/useStoredState';

const EMPTY_USER = {
  id: '',
  name: '',
  phone: '',
  addresses: [],
  selectedAddressId: null,
};

// Profile saved by the old demo build; it may contain demo personal details.
const LEGACY_USER_KEY = 'mianfood.user.v3';

const normalizePhone = (phone = '') => phone.replace(/\D/g, '');

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser, hydrated] = useStoredState(
    'mianfood.user.v4',
    EMPTY_USER
  );
  const [accounts, setAccounts, accountsHydrated] = useStoredState(
    'mianfood.accounts.v1',
    {}
  );

  useEffect(() => {
    // Old demo data is never read again; drop it from the device.
    AsyncStorage.removeItem(LEGACY_USER_KEY).catch(() => {});
  }, []);

  // Keep the saved account registry in sync with the signed-in profile.
  useEffect(() => {
    if (!hydrated || !accountsHydrated) return;
    if (!user.id || !user.name?.trim() || !user.phone?.trim()) return;
    setAccounts((previous) => {
      const saved = previous[user.id];
      if (saved && JSON.stringify(saved) === JSON.stringify(user)) {
        return previous;
      }
      return { ...previous, [user.id]: user };
    });
  }, [accountsHydrated, hydrated, setAccounts, user]);

  const signUp = useCallback(
    ({ name, phone }) => {
      const cleanName = name.trim();
      const cleanPhone = phone.trim();
      const key = normalizePhone(cleanPhone);
      const duplicate = Object.values(accounts).some(
        (account) => normalizePhone(account.phone) === key
      );
      if (duplicate) {
        return {
          ok: false,
          error: 'This phone number already has an account. Log in instead.',
        };
      }

      // Keep any address the customer added before creating the account.
      const profile = {
        id: `acct-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: cleanName,
        phone: cleanPhone,
        addresses: user.id ? [] : user.addresses,
        selectedAddressId: user.id ? null : user.selectedAddressId,
      };
      setAccounts((previous) => ({ ...previous, [profile.id]: profile }));
      setUser(profile);
      return { ok: true };
    },
    [accounts, setAccounts, setUser, user.addresses, user.id, user.selectedAddressId]
  );

  const logIn = useCallback(
    (phone) => {
      const key = normalizePhone(phone);
      const account = Object.values(accounts).find(
        (entry) => normalizePhone(entry.phone) === key
      );
      if (!account) {
        return {
          ok: false,
          error: 'No account found for this number. Create one first.',
        };
      }
      setUser({
        id: account.id,
        name: account.name,
        phone: account.phone,
        addresses: account.addresses || [],
        selectedAddressId: account.selectedAddressId || null,
      });
      return { ok: true };
    },
    [accounts, setUser]
  );

  const logOut = useCallback(() => {
    if (user.id && user.name?.trim() && user.phone?.trim()) {
      setAccounts((previous) => ({ ...previous, [user.id]: user }));
    }
    setUser(EMPTY_USER);
  }, [setAccounts, setUser, user]);

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

  const hasAccount = useMemo(
    () => Boolean(user.id && user.name?.trim() && user.phone?.trim()),
    [user.id, user.name, user.phone]
  );

  const value = useMemo(
    () => ({
      user,
      hydrated,
      hasAccount,
      selectedAddress,
      signUp,
      logIn,
      logOut,
      updateProfile,
      addAddress,
      updateAddress,
      removeAddress,
      selectAddress,
    }),
    [
      user,
      hydrated,
      hasAccount,
      selectedAddress,
      signUp,
      logIn,
      logOut,
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
