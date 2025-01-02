export interface IMovie {
  streamId: number;
  num: number;
  name: string;
  title: string;
  streamType: string;
  streamIcon: string;
  rating: number;
  categoryId: string;
  containerExtension: string;
  customSid: string;
  directSource: string;
  added: string;
  backdrop?: string;
  duration: number;
  plot?: string;
  cast?: string;
  director?: string;
  genre?: string;
  releaseDate: string;
  language?: string;
}
