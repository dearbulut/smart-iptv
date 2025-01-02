import { useMemo } from 'react';
import {
  XtreamService,
  createChannelService,
  createEPGService,
  createFavoritesService,
  createSettingsService,
  createErrorService,
} from '@/services';

export const useServices = () => {
  return useMemo(() => {
    const settingsService = createSettingsService();
    const settings = settingsService.getSettings();

    const xtreamService = new XtreamService(
      settings.server?.url || '',
      settings.server?.username || '',
      settings.server?.password || ''
    );

    const channelService = createChannelService(xtreamService);
    const epgService = createEPGService(xtreamService);
    const favoritesService = createFavoritesService();
    const errorService = createErrorService();

    return {
      xtreamService,
      channelService,
      epgService,
      favoritesService,
      settingsService,
      errorService,
    };
  }, []);
};
