import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import { GlobalStyle } from './styles/GlobalStyle';
import { ServiceProvider } from './contexts/ServiceContext';
import Home from './pages/Home/Home';
import LiveTV from './pages/LiveTV/LiveTV';
import Settings from './pages/Settings/Settings';
import Favorites from './pages/Favorites/Favorites';
import { useChannelStore } from './store/channel';
import NotificationList from './components/Notification/NotificationList';
import TizenSplashScreen from './components/Loading/TizenSplashScreen';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App: React.FC = () => {
  const [currentSection, setCurrentSection] = useState('home');
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('Initializing...');

  const handleNavigate = (section: string) => {
    setCurrentSection(section);
  };

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Simulate loading steps
        setLoadingMessage('Loading resources...');
        setLoadingProgress(20);
        await new Promise(resolve => setTimeout(resolve, 500));

        setLoadingMessage('Checking network...');
        setLoadingProgress(40);
        await new Promise(resolve => setTimeout(resolve, 500));

        setLoadingMessage('Loading channels...');
        setLoadingProgress(60);
        await new Promise(resolve => setTimeout(resolve, 500));

        setLoadingMessage('Loading EPG data...');
        setLoadingProgress(80);
        await new Promise(resolve => setTimeout(resolve, 500));

        setLoadingMessage('Almost ready...');
        setLoadingProgress(100);
        await new Promise(resolve => setTimeout(resolve, 500));

        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing app:', error);
        setLoadingMessage('Error loading app. Please try again.');
      }
    };

    initializeApp();
  }, []);

  const setSelectedChannel = useChannelStore((state) => state.setSelectedChannel);

  const renderContent = () => {
    switch (currentSection) {
      case 'live':
        return <LiveTV />;
      case 'settings':
        return <Settings onBack={() => handleNavigate('home')} />;
      case 'favorites':
        return (
          <Favorites
            onChannelSelect={(channel) => {
              setSelectedChannel(channel);
              setCurrentSection('live');
            }}
            onBack={() => handleNavigate('home')}
          />
        );
      default:
        return <Home onNavigate={handleNavigate} />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <ServiceProvider>
          {isLoading ? (
            <TizenSplashScreen
              message={loadingMessage}
              progress={loadingProgress}
            />
          ) : (
            <>
              {renderContent()}
              <NotificationList />
            </>
          )}
        </ServiceProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
