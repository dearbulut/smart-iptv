import { useEffect } from 'react';

interface TizenTVOptions {
  onKeyDown?: (event: KeyboardEvent) => void;
  onKeyUp?: (event: KeyboardEvent) => void;
  onVisibilityChange?: (hidden: boolean) => void;
  onNetworkChange?: (online: boolean) => void;
}

const useTizenTV = (options: TizenTVOptions = {}) => {
  const { onKeyDown, onKeyUp, onVisibilityChange, onNetworkChange } = options;

  useEffect(() => {
    // Handle key events
    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevent default behavior for TV remote keys
      if (event.keyCode >= 400 && event.keyCode <= 499) {
        event.preventDefault();
      }
      onKeyDown?.(event);
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      onKeyUp?.(event);
    };

    // Handle visibility change
    const handleVisibilityChange = () => {
      onVisibilityChange?.(document.hidden);
    };

    // Handle network change
    const handleNetworkChange = () => {
      onNetworkChange?.(navigator.onLine);
    };

    // Add event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('online', handleNetworkChange);
    window.addEventListener('offline', handleNetworkChange);

    // Initialize Tizen TV features
    try {
      // Disable screen saver
      if (window.webapis?.appcommon) {
        window.webapis.appcommon.setScreenSaver(
          window.webapis.appcommon.AppCommonScreenSaverState.SCREEN_SAVER_OFF
        );
      }

      // Set screen orientation to landscape
      if (window.screen?.orientation) {
        window.screen.orientation.lock('landscape');
      }

      // Request wake lock to prevent screen from turning off
      if (navigator.wakeLock) {
        navigator.wakeLock.request('screen').catch(console.error);
      }
    } catch (error) {
      console.error('Error initializing Tizen TV features:', error);
    }

    // Clean up
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('online', handleNetworkChange);
      window.removeEventListener('offline', handleNetworkChange);
    };
  }, [onKeyDown, onKeyUp, onVisibilityChange, onNetworkChange]);
};

export { useTizenTV };
