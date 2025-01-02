import { IChannel, IMovie, ISeries } from '@/types';

export class FavoritesService {
  private storageKey = 'favorites';

  getFavorites(): (IChannel | IMovie | ISeries)[] {
    const favorites = localStorage.getItem(this.storageKey);
    return favorites ? JSON.parse(favorites) : [];
  }

  addFavorite(item: IChannel | IMovie | ISeries): void {
    const favorites = this.getFavorites();
    const exists = favorites.some((favorite) => {
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

    if (!exists) {
      favorites.push(item);
      localStorage.setItem(this.storageKey, JSON.stringify(favorites));
    }
  }

  removeFavorite(item: IChannel | IMovie | ISeries): void {
    const favorites = this.getFavorites();
    const filtered = favorites.filter((favorite) => {
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
    });
    localStorage.setItem(this.storageKey, JSON.stringify(filtered));
  }

  isFavorite(item: IChannel | IMovie | ISeries): boolean {
    const favorites = this.getFavorites();
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
  }

  clearFavorites(): void {
    localStorage.removeItem(this.storageKey);
  }
}

export const createFavoritesService = () => {
  return new FavoritesService();
};
