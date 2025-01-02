import React, { useState } from 'react';
import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import { useMovieService } from '@/contexts/ServiceContext';
import { IMovie } from '@/types';
import MovieGrid from '@/components/Movie/MovieGrid';
import MovieDetails from '@/components/Movie/MovieDetails';
import MovieSearch from '@/components/Movie/MovieSearch';
import MovieCategories from '@/components/Movie/MovieCategories';
import MovieFilter from '@/components/Movie/MovieFilter';
import { useTizenTV } from '@/hooks/useTizenTV';
import { useNotificationStore } from '@/store/notification';

interface MoviesProps {
  onBack: () => void;
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  background: ${({ theme }) => theme.colors.background.main};
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing.xl};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.sizes.xxl};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const HelpText = styled.div`
  position: fixed;
  bottom: ${({ theme }) => theme.spacing.xl};
  left: ${({ theme }) => theme.spacing.xl};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  z-index: 1000;
`;

const Movies: React.FC<MoviesProps> = ({ onBack }) => {
  const movieService = useMovieService();
  const { addNotification } = useNotificationStore();
  const [selectedMovie, setSelectedMovie] = useState<IMovie | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const { data: movies, isLoading } = useQuery({
    queryKey: ['movies'],
    queryFn: () => movieService.getMovies(),
  });

  const { data: categories } = useQuery({
    queryKey: ['movie-categories'],
    queryFn: () => movieService.getCategories(),
  });

  useTizenTV({
    onKeyDown: (event) => {
      switch (event.keyCode) {
        case 10009: // RETURN key
          if (selectedMovie) {
            setSelectedMovie(null);
          } else if (showSearch) {
            setShowSearch(false);
          } else if (showCategories) {
            setShowCategories(false);
          } else if (showFilter) {
            setShowFilter(false);
          } else {
            onBack();
          }
          break;
        case 83: // S key
          if (!selectedMovie) {
            setShowSearch(true);
          }
          break;
        case 67: // C key
          if (!selectedMovie) {
            setShowCategories(true);
          }
          break;
        case 70: // F key
          if (!selectedMovie) {
            setShowFilter(true);
          }
          break;
      }
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Content>
        <Header>
          <Title>Movies</Title>
        </Header>

        <MovieGrid
          movies={movies || []}
          onSelect={(movie) => {
            setSelectedMovie(movie);
            addNotification({
              message: `Selected: ${movie.title}`,
              type: 'info',
              duration: 2000,
            });
          }}
        />

        <HelpText>
          Press S to search • Press C for categories • Press F to filter • Press
          RETURN to go back
        </HelpText>

        {selectedMovie && (
          <MovieDetails
            movie={selectedMovie}
            onClose={() => setSelectedMovie(null)}
            onPlay={() => {
              // TODO: Implement movie playback
              addNotification({
                message: `Playing: ${selectedMovie.title}`,
                type: 'success',
                duration: 2000,
              });
            }}
            onAddToFavorites={() => {
              // TODO: Implement favorites
              addNotification({
                message: `Added to favorites: ${selectedMovie.title}`,
                type: 'success',
                duration: 2000,
              });
            }}
          />
        )}

        {showSearch && (
          <MovieSearch
            movies={movies || []}
            onSelect={(movie) => {
              setSelectedMovie(movie);
              setShowSearch(false);
            }}
            onClose={() => setShowSearch(false)}
          />
        )}

        {showCategories && categories && (
          <MovieCategories
            categories={categories}
            movies={movies || []}
            onSelect={(movie) => {
              setSelectedMovie(movie);
              setShowCategories(false);
            }}
            onClose={() => setShowCategories(false)}
          />
        )}

        {showFilter && (
          <MovieFilter
            movies={movies || []}
            onApply={(filters) => {
              // TODO: Implement filtering
              console.log('Applied filters:', filters);
              setShowFilter(false);
            }}
            onClose={() => setShowFilter(false)}
          />
        )}
      </Content>
    </Container>
  );
};

export default Movies;
