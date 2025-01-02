export interface IChannel {
  streamId: number;
  num: number;
  name: string;
  streamType: string;
  streamIcon: string;
  epgChannelId: string;
  added: string;
  categoryId: string;
  customSid: string;
  tvArchive: number;
  directSource: string;
  tvArchiveDuration: number;
}

export interface ICategory {
  categoryId: string;
  categoryName: string;
  parentId: number;
}

export interface IEPGProgram {
  id: string;
  epgId: string;
  title: string;
  lang: string;
  start: string;
  end: string;
  description: string;
  channelId: string;
  startTimestamp: number;
  endTimestamp: number;
}

export interface IXtreamConfig {
  host: string;
  username: string;
  password: string;
}

export interface ISettings {
  server: {
    url: string;
    username: string;
    password: string;
  };
  player: {
    autoplay: boolean;
    volume: number;
    quality: string;
  };
  epg: {
    enabled: boolean;
    source: string;
  };
}
