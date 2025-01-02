import { XtreamService, createXtreamService } from './xtream.service';
import { ChannelService, createChannelService } from './channel.service';
import { EPGService, createEPGService } from './epg.service';
import { FavoritesService, createFavoritesService } from './favorites.service';
import { SettingsService, createSettingsService } from './settings.service';
import { ErrorService, createErrorService } from './error.service';

class ServiceManager {
  private static instance: ServiceManager;
  private xtreamService?: XtreamService;
  private channelService?: ChannelService;
  private epgService?: EPGService;
  private favoritesService?: FavoritesService;
  private settingsService?: SettingsService;
  private errorService?: ErrorService;

  private constructor() {
    this.initialize();
  }

  public static getInstance(): ServiceManager {
    if (!ServiceManager.instance) {
      ServiceManager.instance = new ServiceManager();
    }
    return ServiceManager.instance;
  }

  private initialize(): void {
    try {
      // Initialize services in the correct order
      this.errorService = createErrorService();
      this.settingsService = createSettingsService();

      const settings = this.settingsService.getSettings();
      this.xtreamService = createXtreamService({
        baseUrl: settings.server.url,
        auth: {
          username: settings.server.username,
          password: settings.server.password,
        },
      });

      this.channelService = createChannelService(
        this.xtreamService,
        settings.epg.updateInterval
      );

      this.epgService = createEPGService(settings.epg.updateInterval);
      this.favoritesService = createFavoritesService();

      // Listen for settings changes
      this.settingsService.addListener((newSettings) => {
        this.reinitializeServices(newSettings);
      });
    } catch (error) {
      console.error('Error initializing services:', error);
      this.errorService?.logError(
        'ServiceManager',
        'Failed to initialize services',
        error
      );
    }
  }

  private reinitializeServices(settings: any): void {
    try {
      // Reinitialize Xtream service with new settings
      this.xtreamService = createXtreamService({
        baseUrl: settings.server.url,
        auth: {
          username: settings.server.username,
          password: settings.server.password,
        },
      });

      // Reinitialize dependent services
      this.channelService = createChannelService(
        this.xtreamService,
        settings.epg.updateInterval
      );

      this.epgService = createEPGService(settings.epg.updateInterval);

      // Clear caches
      this.channelService.clearCache();
      this.epgService.clearCache();
    } catch (error) {
      console.error('Error reinitializing services:', error);
      this.errorService?.logError(
        'ServiceManager',
        'Failed to reinitialize services',
        error
      );
    }
  }

  public getXtreamService(): XtreamService {
    if (!this.xtreamService) {
      throw new Error('XtreamService not initialized');
    }
    return this.xtreamService;
  }

  public getChannelService(): ChannelService {
    if (!this.channelService) {
      throw new Error('ChannelService not initialized');
    }
    return this.channelService;
  }

  public getEPGService(): EPGService {
    if (!this.epgService) {
      throw new Error('EPGService not initialized');
    }
    return this.epgService;
  }

  public getFavoritesService(): FavoritesService {
    if (!this.favoritesService) {
      throw new Error('FavoritesService not initialized');
    }
    return this.favoritesService;
  }

  public getSettingsService(): SettingsService {
    if (!this.settingsService) {
      throw new Error('SettingsService not initialized');
    }
    return this.settingsService;
  }

  public getErrorService(): ErrorService {
    if (!this.errorService) {
      throw new Error('ErrorService not initialized');
    }
    return this.errorService;
  }
}

export const createServiceManager = () => ServiceManager.getInstance();
