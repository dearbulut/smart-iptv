import { IEPGProgram } from '@/types';

interface EPGCache {
  [channelId: string]: {
    programs: IEPGProgram[];
    lastUpdate: number;
  };
}

class EPGService {
  private static instance: EPGService;
  private cache: EPGCache = {};
  private updateInterval: number;
  private listeners: ((channelId: string, programs: IEPGProgram[]) => void)[] = [];

  private constructor(updateInterval: number = 3600) {
    this.updateInterval = updateInterval * 1000; // Convert to milliseconds
    this.loadFromStorage();
  }

  public static getInstance(updateInterval?: number): EPGService {
    if (!EPGService.instance) {
      EPGService.instance = new EPGService(updateInterval);
    }
    return EPGService.instance;
  }

  public async getPrograms(
    channelId: string,
    fetchFn: () => Promise<IEPGProgram[]>
  ): Promise<IEPGProgram[]> {
    const now = Date.now();
    const cached = this.cache[channelId];

    if (
      !cached ||
      now - cached.lastUpdate > this.updateInterval ||
      this.isProgramsOutdated(cached.programs)
    ) {
      try {
        const programs = await fetchFn();
        this.cache[channelId] = {
          programs,
          lastUpdate: now,
        };
        this.saveToStorage();
        this.notifyListeners(channelId, programs);
        return programs;
      } catch (error) {
        console.error('Error fetching EPG:', error);
        return cached?.programs || [];
      }
    }

    return cached.programs;
  }

  public getCurrentProgram(channelId: string): IEPGProgram | undefined {
    const programs = this.cache[channelId]?.programs;
    if (!programs) return undefined;

    const now = Date.now() / 1000;
    return programs.find(
      (program) =>
        now >= new Date(program.start).getTime() / 1000 &&
        now < new Date(program.end).getTime() / 1000
    );
  }

  public getNextProgram(channelId: string): IEPGProgram | undefined {
    const programs = this.cache[channelId]?.programs;
    if (!programs) return undefined;

    const now = Date.now() / 1000;
    return programs.find(
      (program) => new Date(program.start).getTime() / 1000 > now
    );
  }

  public clearCache(): void {
    this.cache = {};
    this.saveToStorage();
  }

  public addListener(
    listener: (channelId: string, programs: IEPGProgram[]) => void
  ): void {
    this.listeners.push(listener);
  }

  public removeListener(
    listener: (channelId: string, programs: IEPGProgram[]) => void
  ): void {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  private notifyListeners(channelId: string, programs: IEPGProgram[]): void {
    this.listeners.forEach((listener) => listener(channelId, programs));
  }

  private isProgramsOutdated(programs: IEPGProgram[]): boolean {
    const now = Date.now() / 1000;
    return !programs.some(
      (program) => new Date(program.end).getTime() / 1000 > now
    );
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem('epg_cache', JSON.stringify(this.cache));
    } catch (error) {
      console.error('Error saving EPG cache:', error);
    }
  }

  private loadFromStorage(): void {
    try {
      const data = localStorage.getItem('epg_cache');
      if (data) {
        this.cache = JSON.parse(data);
      }
    } catch (error) {
      console.error('Error loading EPG cache:', error);
    }
  }
}

export const createEPGService = (updateInterval?: number) =>
  EPGService.getInstance(updateInterval);
