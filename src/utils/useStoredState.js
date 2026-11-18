import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export default function useStoredState(key, initialValue) {
  const [value, setValue] = useState(initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(key)
      .then((raw) => {
        if (!active || raw == null) return;
        try {
          setValue(JSON.parse(raw));
        } catch {
          // Ignore corrupted data and keep the defaults.
        }
      })
      .finally(() => {
        if (active) setHydrated(true);
      });
    return () => {
      active = false;
    };
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(key, JSON.stringify(value)).catch(() => {});
  }, [hydrated, key, value]);

  return [value, setValue, hydrated];
}
