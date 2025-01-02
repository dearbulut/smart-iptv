import { openDB, IDBPDatabase, DBSchema } from 'idb';
import { ICategory, IChannel, IVodChannel, ISeriesChannel, IEPGProgram } from '../types';

interface IPTVDBSchema extends DBSchema {
  liveCategories: {
    key: string;
    value: ICategory;
    indexes: { 'by-name': string };
  };
  liveChannels: {
    key: string;
    value: IChannel;
    indexes: { 'by-category': string };
  };
  vodCategories: {
    key: string;
    value: ICategory;
    indexes: { 'by-name': string };
  };
  vodChannels: {
    key: string;
    value: IVodChannel;
    indexes: { 'by-category': string };
  };
  seriesCategories: {
    key: string;
    value: ICategory;
    indexes: { 'by-name': string };
  };
  seriesChannels: {
    key: string;
    value: ISeriesChannel;
    indexes: { 'by-category': string };
  };
  epg: {
    key: string;
    value: IEPGProgram;
    indexes: { 'by-channel': string; 'by-time': number };
  };
  favorites: {
    key: string;
    value: { type: 'live' | 'vod' | 'series'; channelId: string };
  };
}

export class DatabaseService {
  private db: IDBPDatabase<IPTVDBSchema> | null = null;
  private readonly DB_NAME = 'iptv-db';
  private readonly DB_VERSION = 1;

  async initialize() {
    try {
      this.db = await openDB<IPTVDBSchema>(this.DB_NAME, this.DB_VERSION, {
        upgrade(db) {
          // Live TV stores
          if (!db.objectStoreNames.contains('liveCategories')) {
            const liveCategoriesStore = db.createObjectStore('liveCategories', { keyPath: 'categoryId' });
            liveCategoriesStore.createIndex('by-name', 'categoryName');
          }

          if (!db.objectStoreNames.contains('liveChannels')) {
            const liveChannelsStore = db.createObjectStore('liveChannels', { keyPath: 'streamId' });
            liveChannelsStore.createIndex('by-category', 'categoryId');
          }

          // VOD stores
          if (!db.objectStoreNames.contains('vodCategories')) {
            const vodCategoriesStore = db.createObjectStore('vodCategories', { keyPath: 'categoryId' });
            vodCategoriesStore.createIndex('by-name', 'categoryName');
          }

          if (!db.objectStoreNames.contains('vodChannels')) {
            const vodChannelsStore = db.createObjectStore('vodChannels', { keyPath: 'streamId' });
            vodChannelsStore.createIndex('by-category', 'categoryId');
          }

          // Series stores
          if (!db.objectStoreNames.contains('seriesCategories')) {
            const seriesCategoriesStore = db.createObjectStore('seriesCategories', { keyPath: 'categoryId' });
            seriesCategoriesStore.createIndex('by-name', 'categoryName');
          }

          if (!db.objectStoreNames.contains('seriesChannels')) {
            const seriesChannelsStore = db.createObjectStore('seriesChannels', { keyPath: 'streamId' });
            seriesChannelsStore.createIndex('by-category', 'categoryId');
          }

          // EPG store
          if (!db.objectStoreNames.contains('epg')) {
            const epgStore = db.createObjectStore('epg', { keyPath: 'id' });
            epgStore.createIndex('by-channel', 'channelId');
            epgStore.createIndex('by-time', 'startTimestamp');
          }

          // Favorites store
          if (!db.objectStoreNames.contains('favorites')) {
            db.createObjectStore('favorites', { keyPath: 'channelId' });
          }
        },
      });

      return true;
    } catch (error) {
      console.error('Error initializing database:', error);
      return false;
    }
  }

  async addLiveCategory(category: ICategory) {
    if (!this.db) throw new Error('Database not initialized');
    await this.db.put('liveCategories', category);
  }

  async addLiveChannel(channel: IChannel) {
    if (!this.db) throw new Error('Database not initialized');
    await this.db.put('liveChannels', channel);
  }

  async getLiveCategories(): Promise<ICategory[]> {
    if (!this.db) throw new Error('Database not initialized');
    return this.db.getAll('liveCategories');
  }

  async getLiveChannels(categoryId?: string): Promise<IChannel[]> {
    if (!this.db) throw new Error('Database not initialized');
    if (categoryId) {
      return this.db.getAllFromIndex('liveChannels', 'by-category', categoryId);
    }
    return this.db.getAll('liveChannels');
  }

  async addVodCategory(category: ICategory) {
    if (!this.db) throw new Error('Database not initialized');
    await this.db.put('vodCategories', category);
  }

  async addVodChannel(channel: IVodChannel) {
    if (!this.db) throw new Error('Database not initialized');
    await this.db.put('vodChannels', channel);
  }

  async getVodCategories(): Promise<ICategory[]> {
    if (!this.db) throw new Error('Database not initialized');
    return this.db.getAll('vodCategories');
  }

  async getVodChannels(categoryId?: string): Promise<IVodChannel[]> {
    if (!this.db) throw new Error('Database not initialized');
    if (categoryId) {
      return this.db.getAllFromIndex('vodChannels', 'by-category', categoryId);
    }
    return this.db.getAll('vodChannels');
  }

  async addEPGProgram(program: IEPGProgram) {
    if (!this.db) throw new Error('Database not initialized');
    await this.db.put('epg', program);
  }

  async getEPGByChannel(channelId: string): Promise<IEPGProgram[]> {
    if (!this.db) throw new Error('Database not initialized');
    return this.db.getAllFromIndex('epg', 'by-channel', channelId);
  }

  async addToFavorites(type: 'live' | 'vod' | 'series', channelId: string) {
    if (!this.db) throw new Error('Database not initialized');
    await this.db.put('favorites', { type, channelId });
  }

  async removeFromFavorites(channelId: string) {
    if (!this.db) throw new Error('Database not initialized');
    await this.db.delete('favorites', channelId);
  }

  async getFavorites(): Promise<{ type: 'live' | 'vod' | 'series'; channelId: string }[]> {
    if (!this.db) throw new Error('Database not initialized');
    return this.db.getAll('favorites');
  }

  async clearStore(storeName: keyof IPTVDBSchema) {
    if (!this.db) throw new Error('Database not initialized');
    await this.db.clear(storeName);
  }
}

export const createDatabaseService = () => new DatabaseService();
