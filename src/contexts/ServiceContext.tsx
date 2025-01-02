import React, { createContext, useContext, useState } from 'react';
import { IChannel, ICategory, IEPGProgram, IXtreamConfig } from '@/types';

interface IChannelService {
  getChannels: () => Promise<IChannel[]>;
  getCategories: () => Promise<ICategory[]>;
}

interface IEPGService {
  getPrograms: (channelId: string, fetchEPG: () => Promise<IEPGProgram[]>) => Promise<IEPGProgram[]>;
}

interface IFavoritesService {
  getFavorites: () => IChannel[];
  addFavorite: (channel: IChannel) => void;
  removeFavorite: (channelId: number) => void;
  isFavorite: (channelId: number) => boolean;
}

interface IXtreamService {
  getStreamUrl: (channel: IChannel) => string;
  getEPG: (channelId: number) => Promise<IEPGProgram[]>;
}

interface ServiceContextType {
  channelService: IChannelService;
  epgService: IEPGService;
  favoritesService: IFavoritesService;
  xtreamService: IXtreamService;
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

const ServiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<IChannel[]>(() => {
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  const channelService: IChannelService = {
    getChannels: async () => {
      // TODO: Implement channel fetching
      return [];
    },
    getCategories: async () => {
      // TODO: Implement category fetching
      return [];
    },
  };

  const epgService: IEPGService = {
    getPrograms: async (channelId, fetchEPG) => {
      // TODO: Implement EPG fetching with caching
      return fetchEPG();
    },
  };

  const favoritesService: IFavoritesService = {
    getFavorites: () => favorites,
    addFavorite: (channel) => {
      const newFavorites = [...favorites, channel];
      setFavorites(newFavorites);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
    },
    removeFavorite: (channelId) => {
      const newFavorites = favorites.filter((c) => c.streamId !== channelId);
      setFavorites(newFavorites);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
    },
    isFavorite: (channelId) => favorites.some((c) => c.streamId === channelId),
  };

  const xtreamService: IXtreamService = {
    getStreamUrl: (channel) => {
      // TODO: Implement stream URL generation
      return '';
    },
    getEPG: async (channelId) => {
      // TODO: Implement EPG fetching
      return [];
    },
  };

  return (
    <ServiceContext.Provider
      value={{
        channelService,
        epgService,
        favoritesService,
        xtreamService,
      }}
    >
      {children}
    </ServiceContext.Provider>
  );
};

const useChannelService = () => {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error('useChannelService must be used within a ServiceProvider');
  }
  return context.channelService;
};

const useEPGService = () => {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error('useEPGService must be used within a ServiceProvider');
  }
  return context.epgService;
};

const useFavoritesService = () => {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error('useFavoritesService must be used within a ServiceProvider');
  }
  return context.favoritesService;
};

const useXtreamService = () => {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error('useXtreamService must be used within a ServiceProvider');
  }
  return context.xtreamService;
};

export {
  ServiceProvider,
  useChannelService,
  useEPGService,
  useFavoritesService,
  useXtreamService,
};
