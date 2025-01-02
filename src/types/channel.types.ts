export interface IChannel {
  num: number;
  name: string;
  streamId: number;
  streamType: string;
  streamIcon: string;
  epgChannelId: string;
  added: string;
  categoryId: string;
  customSid: string;
  tvArchive: number;
  directSource: string;
  tvArchiveDuration: number;
  group?: string;
  rating?: number;
  title?: string;
}

export interface IVodChannel extends IChannel {
  duration: number;
  plot?: string;
  cast?: string;
  director?: string;
  genre?: string;
  releaseDate: string;
}

export interface ISeriesChannel extends IChannel {
  seriesId: number;
  episodes: IEpisode[];
}
