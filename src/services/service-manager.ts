import { ISettings } from '@/types';
import {
  XtreamService,
  ChannelService,
  EPGService,
  FavoritesService,
  SettingsService,
  ErrorService,
  MovieService,
  SeriesService,
} from '@/services';

export class ServiceManager {
  private xtreamService: XtreamService;
  private channelService: ChannelService;
  private epgService: EPGService;
  private favoritesService: FavoritesService;
  private settingsService: SettingsService;
  private errorService: ErrorService;
  private movieService: MovieService;
  private seriesService: SeriesService;

  private epgUpdateInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.settingsService = new SettingsService();
    const settings = this.settingsService.getSettings();

    this.xtreamService = new XtreamService(
      settings.server?.url || '',
      settings.server?.username || '',
      settings.server?.password || ''
    );

    this.channelService = new ChannelService(this.xtreamService);
    this.epgService = new EPGService(this.xtreamService);
    this.favoritesService = new FavoritesService();
    this.errorService = new ErrorService();
    this.movieService = new MovieService(this.xtreamService);
    this.seriesService = new SeriesService(this.xtreamService);

    this.setupEPGUpdate();
    this.setupSettingsListener();
    this.setupErrorHandler();
  }

  private setupEPGUpdate(): void {
    const settings = this.settingsService.getSettings();
    if (settings.epg?.enabled) {
      this.startEPGUpdate(settings.epg.updateInterval || 3600000);
    }
  }

  private setupSettingsListener(): void {
    this.settingsService.addListener((newSettings: ISettings) => {
      if (newSettings.epg?.enabled) {
        this.startEPGUpdate(newSettings.epg.updateInterval || 3600000);
      } else {
        this.stopEPGUpdate();
      }
    });
  }

  private setupErrorHandler(): void {
    window.onerror = (message, source, lineno, colno, error) => {
      this.errorService.handleError(error || new Error(String(message)));
    };

    window.onunhandledrejection = (event) => {
      this.errorService.handleError(event.reason);
    };
  }

  private startEPGUpdate(interval: number): void {
    this.stopEPGUpdate();
    this.epgUpdateInterval = setInterval(() => {
      this.updateEPG();
    }, interval);
  }

  private stopEPGUpdate(): void {
    if (this.epgUpdateInterval) {
      clearInterval(this.epgUpdateInterval);
      this.epgUpdateInterval = null;
    }
  }

  private async updateEPG(): Promise<void> {
    try {
      const channels = await this.channelService.getChannels();
      for (const channel of channels) {
        await this.epgService.getEPG(channel.streamId.toString());
      }
    } catch (error) {
      this.errorService.handleError(error as Error);
    }
  }

  public async initialize(): Promise<void> {
    try {
      await this.xtreamService.authenticate();
      await this.updateEPG();
    } catch (error) {
      this.errorService.handleError(error as Error);
    }
  }

  public dispose(): void {
    this.stopEPGUpdate();
  }

  public getServices() {
    return {
      xtreamService: this.xtreamService,
      channelService: this.channelService,
      epgService: this.epgService,
      favoritesService: this.favoritesService,
      settingsService: this.settingsService,
      errorService: this.errorService,
      movieService: this.movieService,
      seriesService: this.seriesService,
    };
  }
}
