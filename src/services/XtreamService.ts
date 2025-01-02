import axios from 'axios';
import { ICategory, IChannel, IEPGProgram, ISeriesChannel, IVodChannel } from '@/types';

export class XtreamService {
  private baseUrl: string;
  private username: string;
  private password: string;

  constructor(url: string, username: string, password: string) {
    this.baseUrl = url;
    this.username = username;
    this.password = password;
  }

  async authenticate(): Promise<any> {
    try {
      const response = await this.get('');
      return response;
    } catch (error) {
      console.error('Authentication error:', error);
      throw error;
    }
  }

  async get(endpoint: string): Promise<any> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/player_api.php?username=${this.username}&password=${this.password}${endpoint}`
      );
      return response.data;
    } catch (error) {
      console.error('API error:', error);
      throw error;
    }
  }

  async getLiveStreams(): Promise<IChannel[]> {
    try {
      const response = await this.get('/live_streams');
      return response;
    } catch (error) {
      console.error('Error fetching live streams:', error);
      throw error;
    }
  }

  async getLiveCategories(): Promise<ICategory[]> {
    try {
      const response = await this.get('/live_categories');
      return response;
    } catch (error) {
      console.error('Error fetching live categories:', error);
      throw error;
    }
  }

  async getVODStreams(): Promise<IVodChannel[]> {
    try {
      const response = await this.get('/vod_streams');
      return response;
    } catch (error) {
      console.error('Error fetching VOD streams:', error);
      throw error;
    }
  }

  async getVODCategories(): Promise<ICategory[]> {
    try {
      const response = await this.get('/vod_categories');
      return response;
    } catch (error) {
      console.error('Error fetching VOD categories:', error);
      throw error;
    }
  }

  async getSeriesStreams(): Promise<ISeriesChannel[]> {
    try {
      const response = await this.get('/series');
      return response;
    } catch (error) {
      console.error('Error fetching series streams:', error);
      throw error;
    }
  }

  async getSeriesCategories(): Promise<ICategory[]> {
    try {
      const response = await this.get('/series_categories');
      return response;
    } catch (error) {
      console.error('Error fetching series categories:', error);
      throw error;
    }
  }

  async getEPG(streamId: number): Promise<IEPGProgram[]> {
    try {
      const response = await this.get(`/epg/${streamId}`);
      return response.epg_listings;
    } catch (error) {
      console.error('Error fetching EPG:', error);
      throw error;
    }
  }

  getLiveStreamUrl(streamId: number): string {
    return `${this.baseUrl}/live/${this.username}/${this.password}/${streamId}.ts`;
  }

  getVodStreamUrl(streamId: number): string {
    return `${this.baseUrl}/movie/${this.username}/${this.password}/${streamId}.mp4`;
  }

  getSeriesStreamUrl(streamId: number): string {
    return `${this.baseUrl}/series/${this.username}/${this.password}/${streamId}.mp4`;
  }
}
