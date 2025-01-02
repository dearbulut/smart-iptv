export interface ISettings {
  [key: string]: any;
  theme: 'light' | 'dark';
  language: string;
  autoplay: boolean;
  quality: 'auto' | 'high' | 'medium' | 'low';
  volume: number;
  muted: boolean;
  favorites: string[];
  recentlyWatched: string[];
  epgTimeshift: number;
  epgDays: number;
  channelOrder: string[];
  channelGroups: {
    [key: string]: string[];
  };
}

export interface IPlayerConfig {
  autoplay?: boolean;
  quality?: 'auto' | 'high' | 'medium' | 'low';
  volume?: number;
  muted?: boolean;
  controls?: boolean;
  loop?: boolean;
}

export interface IPlayerState {
  playing: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  quality: string;
  buffering: boolean;
  error?: string;
}

export interface IPlayerError {
  code: number;
  message: string;
}
