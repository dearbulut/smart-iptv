export interface IEpisode {
  id: string;
  season: number;
  episode: number;
  title: string;
  plot?: string;
  duration: number;
  releaseDate: string;
  rating?: number;
  streamId: number;
  containerExtension: string;
  info?: {
    [key: string]: any;
  };
}

export interface ISeries {
  seriesId: number;
  title: string;
  cover: string;
  backdrop?: string;
  rating?: number;
  categoryId: string;
  plot?: string;
  cast?: string;
  director?: string;
  genre?: string;
  releaseDate: string;
  language?: string;
  totalSeasons: number;
  episodes: IEpisode[];
}
