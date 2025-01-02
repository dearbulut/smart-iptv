declare namespace tizen {
  namespace WebAPIException {
    const UNKNOWN_ERR: number;
    const INVALID_VALUES_ERR: number;
    const IO_ERR: number;
    const PERMISSION_DENIED_ERR: number;
    const SERVICE_NOT_AVAILABLE_ERR: number;
  }

  interface WebAPIError {
    readonly code: number;
    readonly name: string;
    readonly message: string;
  }

  interface WebAPIException extends WebAPIError {
    readonly code: number;
    readonly name: string;
    readonly message: string;
  }

  interface ApplicationControlData {
    key: string;
    value: string[];
  }

  interface ApplicationControl {
    appId?: string;
    operation?: string;
    uri?: string;
    mime?: string;
    category?: string;
    data?: ApplicationControlData[];
    launchMode?: ApplicationControlLaunchMode;
  }

  type ApplicationControlLaunchMode = 'SINGLE' | 'GROUP';

  interface Application {
    readonly appId: string;
    readonly name: string;
    readonly iconPath: string;
    readonly version: string;
    readonly show: boolean;
    readonly categories: string[];
    readonly installDate: Date;
    readonly size: number;
    readonly packageId: string;
  }

  interface ApplicationInformation extends Application {
    readonly id: string;
    readonly name: string;
    readonly iconPath: string;
    readonly version: string;
    readonly show: boolean;
    readonly categories: string[];
    readonly installDate: Date;
    readonly size: number;
    readonly packageId: string;
  }

  interface ApplicationManager {
    getCurrentApplication(): ApplicationInformation;
    launch(id: string, successCallback?: () => void, errorCallback?: (error: WebAPIError) => void): void;
    launchAppControl(
      appControl: ApplicationControl,
      id?: string,
      successCallback?: () => void,
      errorCallback?: (error: WebAPIError) => void,
      replyCallback?: () => void
    ): void;
  }

  interface SystemInfo {
    getCapability(key: string): any;
  }

  interface SystemInfoPropertySuccessCallback {
    (properties: SystemInfoProperty): void;
  }

  interface SystemInfoProperty {
    [key: string]: any;
  }

  interface Package {
    readonly id: string;
    readonly name: string;
    readonly iconPath: string;
    readonly author: string;
    readonly version: string;
    readonly totalSize: number;
    readonly dataSize: number;
    readonly lastModified: Date;
    readonly installDate: Date;
  }

  interface PackageInformation extends Package {
    readonly id: string;
    readonly name: string;
    readonly iconPath: string;
    readonly author: string;
    readonly version: string;
    readonly totalSize: number;
    readonly dataSize: number;
    readonly lastModified: Date;
    readonly installDate: Date;
  }

  interface PackageManager {
    getPackageInfo(id: string): PackageInformation;
  }

  interface TVInfo {
    readonly productType: string;
    readonly duid: string;
    readonly modelName: string;
    readonly firmwareVersion: string;
    readonly smartTVServerVersion: string;
    readonly api: {
      readonly version: {
        readonly major: number;
        readonly minor: number;
      };
    };
  }

  interface TVInfoManager {
    getTVInfo(): TVInfo;
  }
}

declare namespace webapis {
  namespace avplay {
    const PLAYER_STATE_NONE: number;
    const PLAYER_STATE_IDLE: number;
    const PLAYER_STATE_READY: number;
    const PLAYER_STATE_PLAYING: number;
    const PLAYER_STATE_PAUSED: number;

    function getAVPlay(): AVPlay;
  }

  interface AVPlay {
    open(url: string): void;
    close(): void;
    play(): void;
    pause(): void;
    stop(): void;
    seek(position: number): void;
    getCurrentTime(): number;
    getDuration(): number;
    setListener(listener: AVPlayListener): void;
    setDisplayRect(x: number, y: number, width: number, height: number): void;
    setDisplayMethod(method: string): void;
    suspend(): void;
    restore(): void;
  }

  interface AVPlayListener {
    onbufferingstart?(): void;
    onbufferingprogress?(percent: number): void;
    onbufferingcomplete?(): void;
    oncurrentplaytime?(currentTime: number): void;
    onevent?(eventType: string, eventData?: any): void;
    onerror?(error: AVPlayError): void;
    onplaybackcomplete?(): void;
    onplaystatechange?(state: number): void;
    onsubtitlechange?(duration: number, text: string, data3: number, data4: string): void;
    ondrmevent?(drmEvent: string, drmData?: any): void;
  }

  interface AVPlayError {
    readonly code: number;
    readonly message: string;
  }

  namespace tv {
    interface ChannelManager {
      getChannelList(successCallback: (channels: Channel[]) => void, errorCallback?: (error: WebAPIError) => void): void;
      getCurrentChannel(successCallback: (channel: Channel) => void, errorCallback?: (error: WebAPIError) => void): void;
      tune(channel: Channel): void;
    }

    interface Channel {
      readonly channelNumber: string;
      readonly channelName: string;
      readonly programNumber: number;
      readonly ptc: number;
      readonly lcn: number;
      readonly sourceID: number;
      readonly transportStreamID: number;
      readonly originalNetworkID: number;
      readonly serviceName: string;
      readonly channelType: string;
      readonly channelTypeId: number;
      readonly isScrambled: boolean;
      readonly isLocked: boolean;
      readonly isInvisible: boolean;
      readonly isSkipped: boolean;
      readonly isDeleted: boolean;
      readonly isBlocked: boolean;
      readonly isUsedAsFavorite: boolean;
      readonly favoriteGroup: number;
    }

    interface Window {
      setSource(type: string, source: string): void;
      show(): void;
      hide(): void;
      getRect(): WindowRect;
      setRect(rect: WindowRect): void;
    }

    interface WindowRect {
      x: number;
      y: number;
      width: number;
      height: number;
    }
  }
}

declare namespace tizen.tvinputdevice {
  interface RegisterKey {
    name: string;
    code: number;
  }

  function registerKey(key: RegisterKey): void;
  function unregisterKey(key: RegisterKey): void;
  function getSupportedKeys(): RegisterKey[];
}

declare namespace tizen.application {
  function getCurrentApplication(): tizen.ApplicationInformation;
  function launch(id: string, successCallback?: () => void, errorCallback?: (error: tizen.WebAPIError) => void): void;
  function launchAppControl(
    appControl: tizen.ApplicationControl,
    id?: string,
    successCallback?: () => void,
    errorCallback?: (error: tizen.WebAPIError) => void,
    replyCallback?: () => void
  ): void;
}

declare namespace tizen.systeminfo {
  function getCapability(key: string): any;
  function getPropertyValue(
    property: string,
    successCallback: tizen.SystemInfoPropertySuccessCallback,
    errorCallback?: (error: tizen.WebAPIError) => void
  ): void;
}

declare namespace tizen.package {
  function getPackageInfo(id: string): tizen.PackageInformation;
}

declare namespace tizen.tvinfo {
  function getTVInfo(): tizen.TVInfo;
}
