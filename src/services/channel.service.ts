import { IChannel, ICategory } from '@/types';
import { XtreamService } from './xtream.service';

interface ChannelCache {
  channels: IChannel[];
  categories: ICategory[];
  lastUpdate: number;
}

class ChannelService {
  private static instance: ChannelService;
  private cache: ChannelCache | null = null;
  private updateInterval: number;
  private xtreamService: XtreamService;
  private listeners: ((cache: ChannelCache) => void)[] = [];

  private constructor(xtreamService: XtreamService, updateInterval: number = 3600) {
    this.xtreamService = xtreamService;
    this.updateInterval = updateInterval * 1000; // Convert to milliseconds
    this.loadFromStorage();
  }

  public static getInstance(
    xtreamService: XtreamService,
    updateInterval?: number
  ): ChannelService {
    if (!ChannelService.instance) {
      ChannelService.instance = new ChannelService(xtreamService, updateInterval);
    }
    return ChannelService.instance;
  }

  public async getChannels(): Promise<IChannel[]> {
    await this.updateCacheIfNeeded();
    return this.cache?.channels || [];
  }

  public async getCategories(): Promise<ICategory[]> {
    await this.updateCacheIfNeeded();
    return this.cache?.categories || [];
  }

  public async getChannelsByCategory(categoryId: string): Promise<IChannel[]> {
    const channels = await this.getChannels();
    return channels.filter((channel) => channel.categoryId === categoryId);
  }

  public async searchChannels(query: string): Promise<IChannel[]> {
    const channels = await this.getChannels();
    const lowerQuery = query.toLowerCase();
    return channels.filter(
      (channel) =>
        channel.name.toLowerCase().includes(lowerQuery) ||
        channel.num.toString().includes(lowerQuery)
    );
  }

  public async getChannelByNumber(number: number): Promise<IChannel | undefined> {
    const channels = await this.getChannels();
    return channels.find((channel) => channel.num === number);
  }

  public clearCache(): void {
    this.cache = null;
    localStorage.removeItem('channel_cache');
  }

  public addListener(listener: (cache: ChannelCache) => void): void {
    this.listeners.push(listener);
  }

  public removeListener(listener: (cache: ChannelCache) => void): void {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  private async updateCacheIfNeeded(): Promise<void> {
    const now = Date.now();
    if (
      !this.cache ||
      now - this.cache.lastUpdate > this.updateInterval
    ) {
      try {
        const [channels, categories] = await Promise.all([
          this.xtreamService.getLiveStreams(),
          this.xtreamService.getLiveStreamCategories(),
        ]);

        this.cache = {
          channels,
          categories,
          lastUpdate: now,
        };

        this.saveToStorage();
        this.notifyListeners();
      } catch (error) {
        console.error('Error updating channel cache:', error);
        throw error;
      }
    }
  }

  private notifyListeners(): void {
    if (this.cache) {
      this.listeners.forEach((listener) => listener(this.cache!));
    }
  }

  private saveToStorage(): void {
    try {
      if (this.cache) {
        localStorage.setItem('channel_cache', JSON.stringify(this.cache));
      }
    } catch (error) {
      console.error('Error saving channel cache:', error);
    }
  }

  private loadFromStorage(): void {
    try {
      const data = localStorage.getItem('channel_cache');
      if (data) {
        this.cache = JSON.parse(data);
      }
    } catch (error) {
      console.error('Error loading channel cache:', error);
    }
  }
}

export const createChannelService = (
  xtreamService: XtreamService,
  updateInterval?: number
) => ChannelService.getInstance(xtreamService, updateInterval);
