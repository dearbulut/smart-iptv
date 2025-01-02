import { IChannel } from '@/types';

class FavoritesService {
  private static instance: FavoritesService;
  private favorites: Map<string, IChannel> = new Map();
  private listeners: ((favorites: IChannel[]) => void)[] = [];

  private constructor() {
    this.loadFromStorage();
  }

  public static getInstance(): FavoritesService {
    if (!FavoritesService.instance) {
      FavoritesService.instance = new FavoritesService();
    }
    return FavoritesService.instance;
  }

  public addFavorite(channel: IChannel): void {
    this.favorites.set(channel.streamId.toString(), channel);
    this.saveToStorage();
    this.notifyListeners();
  }

  public removeFavorite(channelId: string | number): void {
    this.favorites.delete(channelId.toString());
    this.saveToStorage();
    this.notifyListeners();
  }

  public isFavorite(channelId: string | number): boolean {
    return this.favorites.has(channelId.toString());
  }

  public getFavorites(): IChannel[] {
    return Array.from(this.favorites.values());
  }

  public addListener(listener: (favorites: IChannel[]) => void): void {
    this.listeners.push(listener);
  }

  public removeListener(listener: (favorites: IChannel[]) => void): void {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  private notifyListeners(): void {
    const favorites = this.getFavorites();
    this.listeners.forEach((listener) => listener(favorites));
  }

  private saveToStorage(): void {
    try {
      const data = Array.from(this.favorites.values());
      localStorage.setItem('favorites', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }

  private loadFromStorage(): void {
    try {
      const data = localStorage.getItem('favorites');
      if (data) {
        const channels = JSON.parse(data) as IChannel[];
        channels.forEach((channel) => {
          this.favorites.set(channel.streamId.toString(), channel);
        });
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  }
}

export const createFavoritesService = () => FavoritesService.getInstance();
