import { ISettings } from '@/types';

type SettingsListener = (settings: ISettings) => void;

const defaultSettings: ISettings = {
  theme: 'dark',
  language: 'en',
  autoplay: true,
  quality: 'auto',
  volume: 100,
  muted: false,
  favorites: [],
  recentlyWatched: [],
  epgTimeshift: 0,
  epgDays: 7,
  channelOrder: [],
  channelGroups: {},
};

export class SettingsService {
  private storageKey = 'settings';
  private listeners: SettingsListener[] = [];

  getSettings(): ISettings {
    const settings = localStorage.getItem(this.storageKey);
    return settings ? { ...defaultSettings, ...JSON.parse(settings) } : defaultSettings;
  }

  updateSettings(settings: Partial<ISettings>): void {
    const currentSettings = this.getSettings();
    const newSettings = { ...currentSettings, ...settings };
    localStorage.setItem(this.storageKey, JSON.stringify(newSettings));
    this.notifyListeners(newSettings);
  }

  addListener(listener: SettingsListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners(settings: ISettings): void {
    this.listeners.forEach((listener) => listener(settings));
  }

  resetSettings(): void {
    localStorage.removeItem(this.storageKey);
    this.notifyListeners(defaultSettings);
  }
}

export const createSettingsService = () => {
  return new SettingsService();
};
