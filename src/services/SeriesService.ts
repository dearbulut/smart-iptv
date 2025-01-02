import { ISeries, ICategory, IEpisode } from '@/types';
import { XtreamService } from './XtreamService';

export class SeriesService {
  private xtreamService: XtreamService;

  constructor(xtreamService: XtreamService) {
    this.xtreamService = xtreamService;
  }

  async getSeries(): Promise<ISeries[]> {
    try {
      const response = await this.xtreamService.get('/series');
      return response.data.map((series: any) => ({
        seriesId: series.series_id,
        title: series.title || series.name,
        cover: series.cover,
        backdrop: series.backdrop_path,
        rating: series.rating,
        categoryId: series.category_id,
        plot: series.plot,
        cast: series.cast,
        director: series.director,
        genre: series.genre,
        releaseDate: series.releasedate || series.release_date || new Date().toISOString(),
        language: series.language || 'Unknown',
        totalSeasons: series.episode_run_time || 1,
        episodes: [],
      }));
    } catch (error) {
      console.error('Error fetching series:', error);
      throw error;
    }
  }

  async getCategories(): Promise<ICategory[]> {
    try {
      const response = await this.xtreamService.get('/series_categories');
      return response.data.map((category: any) => ({
        categoryId: category.category_id,
        categoryName: category.category_name,
        parentId: category.parent_id,
      }));
    } catch (error) {
      console.error('Error fetching series categories:', error);
      throw error;
    }
  }

  async getSeriesInfo(seriesId: number): Promise<ISeries> {
    try {
      const response = await this.xtreamService.get(`/series/${seriesId}`);
      const series = response.data.info;
      const episodes = response.data.episodes;

      const mappedEpisodes: IEpisode[] = [];
      for (const seasonNum in episodes) {
        for (const episodeNum in episodes[seasonNum]) {
          const episode = episodes[seasonNum][episodeNum];
          mappedEpisodes.push({
            id: episode.id,
            season: parseInt(seasonNum),
            episode: parseInt(episodeNum),
            title: episode.title,
            plot: episode.plot,
            duration: episode.duration,
            releaseDate: episode.releasedate || episode.release_date || new Date().toISOString(),
            rating: episode.rating,
            streamId: episode.stream_id,
            containerExtension: episode.container_extension,
            info: episode.info || {},
          });
        }
      }

      return {
        seriesId: series.series_id,
        title: series.title || series.name,
        cover: series.cover,
        backdrop: series.backdrop_path,
        rating: series.rating,
        categoryId: series.category_id,
        plot: series.plot,
        cast: series.cast,
        director: series.director,
        genre: series.genre,
        releaseDate: series.releasedate || series.release_date || new Date().toISOString(),
        language: series.language || 'Unknown',
        totalSeasons: Object.keys(episodes).length,
        episodes: mappedEpisodes,
      };
    } catch (error) {
      console.error('Error fetching series info:', error);
      throw error;
    }
  }

  getStreamUrl(episode: IEpisode): string {
    return this.xtreamService.getSeriesStreamUrl(episode.streamId);
  }
}
