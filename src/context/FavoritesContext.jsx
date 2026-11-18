import { createContext, useCallback, useContext, useMemo } from 'react';
import useStoredState from '@/utils/useStoredState';

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useStoredState('mianfood.favorites.v1', []);

  const isFavorite = useCallback(
    (restaurantId) => favorites.includes(restaurantId),
    [favorites]
  );

  const toggleFavorite = useCallback(
    (restaurantId) => {
      setFavorites((previous) =>
        previous.includes(restaurantId)
          ? previous.filter((id) => id !== restaurantId)
          : [...previous, restaurantId]
      );
    },
    [setFavorites]
  );

  const value = useMemo(
    () => ({
      favorites,
      count: favorites.length,
      isFavorite,
      toggleFavorite,
    }),
    [favorites, isFavorite, toggleFavorite]
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used inside FavoritesProvider');
  }
  return context;
}
