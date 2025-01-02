import React, { createContext, useContext } from 'react';
import {
  ChannelService,
  EPGService,
  FavoritesService,
  SettingsService,
  ErrorService,
  XtreamService,
  MovieService,
  SeriesService,
} from '@/services';

interface ServiceContextType {
  channelService: ChannelService;
  epgService: EPGService;
  favoritesService: FavoritesService;
  settingsService: SettingsService;
  errorService: ErrorService;
  xtreamService: XtreamService;
  movieService: MovieService;
  seriesService: SeriesService;
}

const ServiceContext = createContext<ServiceContextType | null>(null);

interface ServiceProviderProps {
  children: React.ReactNode;
  services: ServiceContextType;
}

export const ServiceProvider: React.FC<ServiceProviderProps> = ({
  children,
  services,
}) => {
  return (
    <ServiceContext.Provider value={services}>
      {children}
    </ServiceContext.Provider>
  );
};

export const useChannelService = () => {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error('useChannelService must be used within a ServiceProvider');
  }
  return context.channelService;
};

export const useEPGService = () => {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error('useEPGService must be used within a ServiceProvider');
  }
  return context.epgService;
};

export const useFavoritesService = () => {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error('useFavoritesService must be used within a ServiceProvider');
  }
  return context.favoritesService;
};

export const useSettingsService = () => {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error('useSettingsService must be used within a ServiceProvider');
  }
  return context.settingsService;
};

export const useErrorService = () => {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error('useErrorService must be used within a ServiceProvider');
  }
  return context.errorService;
};

export const useXtreamService = () => {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error('useXtreamService must be used within a ServiceProvider');
  }
  return context.xtreamService;
};

export const useMovieService = () => {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error('useMovieService must be used within a ServiceProvider');
  }
  return context.movieService;
};

export const useSeriesService = () => {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error('useSeriesService must be used within a ServiceProvider');
  }
  return context.seriesService;
};
