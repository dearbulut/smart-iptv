import axios, { AxiosInstance } from 'axios';
import { Config, IAuthInfo, ICategory, IChannel, IEPGProgram, ISeriesChannel, IVodChannel } from '../types';

export class XtreamService {
  private config: Config;
  private api: AxiosInstance;

  constructor(config: Config) {
    this.config = config;
    this.api = axios.create({
      baseURL: config.baseUrl,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  }

  private get authParams() {
    return {
      username: this.config.auth.username,
      password: this.config.auth.password,
    };
  }

  private async execute<T>(action: string, sub?: string, params: Record<string, any> = {}) {
    try {
      const url = sub ? `/api.php?action=${action}&sub=${sub}` : `/api.php?action=${action}`;
      const response = await this.api.post<T>(url, new URLSearchParams({
        ...this.authParams,
        ...params,
      }).toString());
      return response.data;
    } catch (error) {
      console.error(`Error executing ${action}:`, error);
      throw error;
    }
  }

  async authenticate(): Promise<IAuthInfo> {
    return this.execute<IAuthInfo>('user', 'info');
  }

  async getLiveStreamCategories(): Promise<ICategory[]> {
    return this.execute<ICategory[]>('category', 'live');
  }

  async getVodCategories(): Promise<ICategory[]> {
    return this.execute<ICategory[]>('category', 'movie');
  }

  async getSeriesCategories(): Promise<ICategory[]> {
    return this.execute<ICategory[]>('category', 'series');
  }

  async getLiveStreams(categoryId?: string): Promise<IChannel[]> {
    return this.execute<IChannel[]>('stream', 'live', categoryId ? { category_id: categoryId } : {});
  }

  async getVodStreams(categoryId?: string): Promise<IVodChannel[]> {
    return this.execute<IVodChannel[]>('stream', 'movie', categoryId ? { category_id: categoryId } : {});
  }

  async getSeriesStreams(categoryId?: string): Promise<ISeriesChannel[]> {
    return this.execute<ISeriesChannel[]>('series', undefined, categoryId ? { category_id: categoryId } : {});
  }

  async getSeriesInfo(seriesId: number): Promise<ISeriesChannel> {
    return this.execute<ISeriesChannel>('series', 'info', { series_id: seriesId });
  }

  async getShortEPG(streamId: number, limit: number = 4): Promise<IEPGProgram[]> {
    return this.execute<IEPGProgram[]>('epg', 'short', { stream_id: streamId, limit });
  }

  async getEPG(streamId: number): Promise<IEPGProgram[]> {
    return this.execute<IEPGProgram[]>('epg', 'simple', { stream_id: streamId });
  }

  getStreamUrl(channel: IChannel | IVodChannel | ISeriesChannel): string {
    const ext = channel.streamType === 'live' ? 'm3u8' : 'mp4';
    return `${this.config.baseUrl}/${channel.streamType}/${this.config.auth.username}/${this.config.auth.password}/${channel.streamId}.${ext}`;
  }

  getCatchupUrl(channel: IChannel, timestamp: number): string {
    return `${this.config.baseUrl}/streaming/timeshift.php?username=${this.config.auth.username}&password=${this.config.auth.password}&stream=${channel.streamId}&start=${timestamp}`;
  }

  getM3U8Playlist(): string {
    return `${this.config.baseUrl}/get.php?username=${this.config.auth.username}&password=${this.config.auth.password}&type=m3u_plus&output=ts`;
  }

  getEPGXML(): string {
    return `${this.config.baseUrl}/xmltv.php?username=${this.config.auth.username}&password=${this.config.auth.password}`;
  }
}

export const createXtreamService = (config: Config) => new XtreamService(config);
