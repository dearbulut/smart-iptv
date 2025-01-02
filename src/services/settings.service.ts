interface Settings {
  server: {
    url: string;
    username: string;
    password: string;
  };
  player: {
    autoplay: boolean;
    quality: string;
    bufferSize: number;
  };
  epg: {
    enabled: boolean;
    updateInterval: number;
  };
}

class SettingsService {
  private static instance: SettingsService;
  private settings: Settings;
  private listeners: ((settings: Settings) => void)[] = [];

  private readonly DEFAULT_SETTINGS: Settings = {
    server: {
      url: '',
      username: '',
      password: '',
    },
    player: {
      autoplay: true,
      quality: 'auto',
      bufferSize: 30,
    },
    epg: {
      enabled: true,
      updateInterval: 3600,
    },
  };

  private constructor() {
    this.settings = this.loadFromStorage();
  }

  public static getInstance(): SettingsService {
    if (!SettingsService.instance) {
      SettingsService.instance = new SettingsService();
    }
    return SettingsService.instance;
  }

  public getSettings(): Settings {
    return { ...this.settings };
  }

  public updateSettings(newSettings: Partial<Settings>): void {
    this.settings = {
      ...this.settings,
      ...newSettings,
    };
    this.saveToStorage();
    this.notifyListeners();
  }

  public updateSection<K extends keyof Settings>(
    section: K,
    value: Partial<Settings[K]>
  ): void {
    this.settings = {
      ...this.settings,
      [section]: {
        ...this.settings[section],
        ...value,
      },
    };
    this.saveToStorage();
    this.notifyListeners();
  }

  public resetToDefaults(): void {
    this.settings = { ...this.DEFAULT_SETTINGS };
    this.saveToStorage();
    this.notifyListeners();
  }

  public addListener(listener: (settings: Settings) => void): void {
    this.listeners.push(listener);
  }

  public removeListener(listener: (settings: Settings) => void): void {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.getSettings()));
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem('settings', JSON.stringify(this.settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }

  private loadFromStorage(): Settings {
    try {
      const data = localStorage.getItem('settings');
      if (data) {
        const parsedSettings = JSON.parse(data);
        return {
          ...this.DEFAULT_SETTINGS,
          ...parsedSettings,
          server: {
            ...this.DEFAULT_SETTINGS.server,
            ...parsedSettings.server,
          },
          player: {
            ...this.DEFAULT_SETTINGS.player,
            ...parsedSettings.player,
          },
          epg: {
            ...this.DEFAULT_SETTINGS.epg,
            ...parsedSettings.epg,
          },
        };
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
    return { ...this.DEFAULT_SETTINGS };
  }
}

export const createSettingsService = () => SettingsService.getInstance();
export type { Settings };
