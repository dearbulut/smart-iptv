export interface IEPGProgram {
  id: string;
  epgId: string;
  title: string;
  lang: string;
  start: string;
  end: string;
  description?: string;
  channelId: string;
  rating?: number;
  plot?: string;
  cast?: string;
  director?: string;
  genre?: string;
}
