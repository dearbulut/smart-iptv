import { useState, useEffect } from 'react';
import { IChannel, IMovie, ISeries } from '@/types';

const FAVORITES_KEY = 'favorites';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<(IChannel | IMovie | ISeries)[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const storedFavorites = localStorage.getItem(FAVORITES_KEY);
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch (error) {
        console.error('Error loading favorites:', error);
        localStorage.removeItem(FAVORITES_KEY);
      }
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (item: IChannel | IMovie | ISeries) => {
    setFavorites((prev) => {
      // Check if item already exists
      const exists = prev.some((favorite) => {
        if ('num' in item && 'num' in favorite) {
          return item.num === favorite.num;
        }
        if ('streamId' in item && 'streamId' in favorite) {
          return item.streamId === favorite.streamId;
        }
        if ('seriesId' in item && 'seriesId' in favorite) {
          return item.seriesId === favorite.seriesId;
        }
        return false;
      });

      if (exists) {
        return prev;
      }

      return [...prev, item];
    });
  };

  const removeFavorite = (item: IChannel | IMovie | ISeries) => {
    setFavorites((prev) =>
      prev.filter((favorite) => {
        if ('num' in item && 'num' in favorite) {
          return item.num !== favorite.num;
        }
        if ('streamId' in item && 'streamId' in favorite) {
          return item.streamId !== favorite.streamId;
        }
        if ('seriesId' in item && 'seriesId' in favorite) {
          return item.seriesId !== favorite.seriesId;
        }
        return true;
      })
    );
  };

  const isFavorite = (item: IChannel | IMovie | ISeries): boolean => {
    return favorites.some((favorite) => {
      if ('num' in item && 'num' in favorite) {
        return item.num === favorite.num;
      }
      if ('streamId' in item && 'streamId' in favorite) {
        return item.streamId === favorite.streamId;
      }
      if ('seriesId' in item && 'seriesId' in favorite) {
        return item.seriesId === favorite.seriesId;
      }
      return false;
    });
  };

  const toggleFavorite = (item: IChannel | IMovie | ISeries) => {
    if (isFavorite(item)) {
      removeFavorite(item);
    } else {
      addFavorite(item);
    }
  };

  const clearFavorites = () => {
    setFavorites([]);
    localStorage.removeItem(FAVORITES_KEY);
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
    clearFavorites,
  };
};
