interface Window {
  webapis?: {
    appcommon?: {
      AppCommonScreenSaverState: {
        SCREEN_SAVER_OFF: number;
        SCREEN_SAVER_ON: number;
      };
      setScreenSaver: (
        state: number,
        successCallback: () => void,
        errorCallback: (error: Error) => void
      ) => void;
    };
    tv?: {
      ScreenResolution: {
        HD_1080: number;
        HD_720: number;
        SD_480: number;
      };
      setScreenResolution: (
        resolution: number,
        successCallback: () => void,
        errorCallback: (error: Error) => void
      ) => void;
    };
    network?: {
      isConnectedToGateway: () => boolean;
      addNetworkStateChangeListener: (callback: () => void) => void;
      removeNetworkStateChangeListener: (callback: () => void) => void;
    };
    avplay?: {
      getState: () => number;
      open: (url: string) => void;
      close: () => void;
      play: () => void;
      pause: () => void;
      stop: () => void;
      setDisplayRect: (x: number, y: number, width: number, height: number) => void;
      setListener: (listeners: {
        oncurrentplaytime?: (time: number) => void;
        onbufferingstart?: () => void;
        onbufferingprogress?: (percent: number) => void;
        onbufferingcomplete?: () => void;
        onerror?: (error: string) => void;
        onsubtitlechange?: (duration: number, text: string, data3: any) => void;
        ondrmevent?: (drmEvent: string, drmData: string) => void;
      }) => void;
    };
  };
  tizen?: {
    application: {
      getCurrentApplication: () => {
        exit: () => void;
      };
    };
  };
}
