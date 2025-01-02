import { IEPGProgram } from '@/types';
import { XtreamService } from './XtreamService';

export class EPGService {
  private xtreamService: XtreamService;

  constructor(xtreamService: XtreamService) {
    this.xtreamService = xtreamService;
  }

  async getEPG(channelId: string): Promise<IEPGProgram[]> {
    try {
      const response = await this.xtreamService.get(`/epg/${channelId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching EPG:', error);
      throw error;
    }
  }
}

export const createEPGService = (xtreamService: XtreamService) => {
  return new EPGService(xtreamService);
};
