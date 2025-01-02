import { IMovie, ICategory } from '@/types';
import { XtreamService } from './XtreamService';

export class MovieService {
  private xtreamService: XtreamService;

  constructor(xtreamService: XtreamService) {
    this.xtreamService = xtreamService;
  }

  async getMovies(): Promise<IMovie[]> {
    try {
      const response = await this.xtreamService.get('/vod');
      return response.data.map((movie: any) => ({
        streamId: movie.stream_id,
        num: movie.num,
        name: movie.name,
        title: movie.title || movie.name,
        streamType: movie.stream_type,
        streamIcon: movie.stream_icon,
        rating: movie.rating,
        categoryId: movie.category_id,
        containerExtension: movie.container_extension,
        customSid: movie.custom_sid,
        directSource: movie.direct_source,
        added: movie.added,
        seriesId: movie.series_id,
        season: movie.season_num,
        episode: movie.episode_num,
        backdropUrl: movie.backdrop_path,
        duration: movie.duration || 0,
        plot: movie.plot,
        cast: movie.cast,
        director: movie.director,
        genre: movie.genre,
        releaseDate: movie.releasedate || movie.release_date || new Date().toISOString(),
        language: movie.language || 'Unknown',
      }));
    } catch (error) {
      console.error('Error fetching movies:', error);
      throw error;
    }
  }

  async getCategories(): Promise<ICategory[]> {
    try {
      const response = await this.xtreamService.get('/vod_categories');
      return response.data.map((category: any) => ({
        categoryId: category.category_id,
        categoryName: category.category_name,
        parentId: category.parent_id,
      }));
    } catch (error) {
      console.error('Error fetching movie categories:', error);
      throw error;
    }
  }

  async getMovieInfo(movieId: number): Promise<IMovie> {
    try {
      const response = await this.xtreamService.get(`/vod_info/${movieId}`);
      const movie = response.data.info;
      return {
        streamId: movie.stream_id,
        num: movie.num,
        name: movie.name,
        title: movie.title || movie.name,
        streamType: movie.stream_type,
        streamIcon: movie.stream_icon,
        rating: movie.rating,
        categoryId: movie.category_id,
        containerExtension: movie.container_extension,
        customSid: movie.custom_sid,
        directSource: movie.direct_source,
        added: movie.added,
        seriesId: movie.series_id,
        season: movie.season_num,
        episode: movie.episode_num,
        backdropUrl: movie.backdrop_path,
        duration: movie.duration || 0,
        plot: movie.plot,
        cast: movie.cast,
        director: movie.director,
        genre: movie.genre,
        releaseDate: movie.releasedate || movie.release_date || new Date().toISOString(),
        language: movie.language || 'Unknown',
      };
    } catch (error) {
      console.error('Error fetching movie info:', error);
      throw error;
    }
  }

  getStreamUrl(movie: IMovie): string {
    return this.xtreamService.getVodStreamUrl(movie.streamId);
  }
}
