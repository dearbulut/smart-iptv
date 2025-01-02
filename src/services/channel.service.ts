import { IChannel, ICategory } from '@/types';
import { XtreamService } from './XtreamService';

export class ChannelService {
  private xtreamService: XtreamService;

  constructor(xtreamService: XtreamService) {
    this.xtreamService = xtreamService;
  }

  async getChannels(): Promise<IChannel[]> {
    try {
      const response = await this.xtreamService.get('/live_streams');
      return response.data;
    } catch (error) {
      console.error('Error fetching channels:', error);
      throw error;
    }
  }

  async getCategories(): Promise<ICategory[]> {
    try {
      const response = await this.xtreamService.get('/live_categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  getStreamUrl(channel: IChannel): string {
    return this.xtreamService.getLiveStreamUrl(channel.streamId);
  }
}

export const createChannelService = (xtreamService: XtreamService) => {
  return new ChannelService(xtreamService);
};
