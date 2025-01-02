import React, { useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ServiceProvider } from '@/contexts/ServiceContext';
import { useServices } from '@/hooks/useServices';
import { GlobalStyle } from '@/styles/GlobalStyle';
import { theme } from '@/styles/theme';
import { IChannel, IMovie, ISeries, ISettings } from '@/types';

// Pages
import LiveTV from '@/pages/LiveTV/LiveTV';
import Movies from '@/pages/Movies/Movies';
import Series from '@/pages/Series/Series';
import Settings from '@/pages/Settings/Settings';
import Favorites from '@/pages/Favorites/Favorites';

const queryClient = new QueryClient();

interface PageProps {
  onBack: () => void;
}

interface LiveTVProps extends PageProps {
  onChannelSelect: (channel: IChannel) => void;
}

interface MoviesProps extends PageProps {
  onMovieSelect: (movie: IMovie) => void;
}

interface SeriesProps extends PageProps {
  onSeriesSelect: (series: ISeries) => void;
}

interface SettingsProps extends PageProps {
  onSave: (settings: ISettings) => void;
}

interface FavoritesProps extends PageProps {
  onPlayChannel: (channel: IChannel) => void;
  onPlayMovie: (movie: IMovie) => void;
  onPlaySeries: (series: ISeries) => void;
}

const App: React.FC = () => {
  const services = useServices();
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedChannel, setSelectedChannel] = useState<IChannel | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<IMovie | null>(null);
  const [selectedSeries, setSelectedSeries] = useState<ISeries | null>(null);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const handleChannelSelect = (channel: IChannel) => {
    setSelectedChannel(channel);
  };

  const handleMovieSelect = (movie: IMovie) => {
    setSelectedMovie(movie);
  };

  const handleSeriesSelect = (series: ISeries) => {
    setSelectedSeries(series);
  };

  const handleSettingsSave = (settings: ISettings) => {
    services.settingsService.updateSettings(settings);
    handleNavigate('home');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'live':
        return (
          <LiveTV
            onBack={() => handleNavigate('home')}
            onChannelSelect={handleChannelSelect}
          />
        );
      case 'movies':
        return (
          <Movies
            onBack={() => handleNavigate('home')}
            onMovieSelect={handleMovieSelect}
          />
        );
      case 'series':
        return (
          <Series
            onBack={() => handleNavigate('home')}
            onSeriesSelect={handleSeriesSelect}
          />
        );
      case 'settings':
        return (
          <Settings
            onBack={() => handleNavigate('home')}
            onSave={handleSettingsSave}
          />
        );
      case 'favorites':
        return (
          <Favorites
            onBack={() => handleNavigate('home')}
            onPlayChannel={handleChannelSelect}
            onPlayMovie={handleMovieSelect}
            onPlaySeries={handleSeriesSelect}
          />
        );
      default:
        return (
          <div>
            <button onClick={() => handleNavigate('live')}>Live TV</button>
            <button onClick={() => handleNavigate('movies')}>Movies</button>
            <button onClick={() => handleNavigate('series')}>Series</button>
            <button onClick={() => handleNavigate('favorites')}>Favorites</button>
            <button onClick={() => handleNavigate('settings')}>Settings</button>
          </div>
        );
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <ServiceProvider services={services}>
          <GlobalStyle />
          {renderPage()}
        </ServiceProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
