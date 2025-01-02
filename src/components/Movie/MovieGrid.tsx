import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { IMovie } from '@/types';

interface MovieGridProps {
  movies: IMovie[];
  onSelect: (movie: IMovie) => void;
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.md};
  overflow-y: auto;
`;

const MovieCard = styled.div<{ selected?: boolean }>`
  position: relative;
  aspect-ratio: 2/3;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};

  &.focused {
    transform: scale(1.05);
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
    border: 2px solid ${({ theme }) => theme.colors.secondary.main};
  }
`;

const Poster = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Info = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: ${({ theme }) => theme.spacing.md};
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.9));
`;

const Title = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.md};
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Year = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const Rating = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.spacing.sm};
  right: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  background: rgba(0, 0, 0, 0.7);
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const MovieGrid: React.FC<MovieGridProps> = ({ movies, onSelect }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
          setSelectedIndex((prev) => {
            const columns = Math.floor(window.innerWidth / 200);
            return Math.max(0, prev - columns);
          });
          break;
        case 'ArrowDown':
          setSelectedIndex((prev) => {
            const columns = Math.floor(window.innerWidth / 200);
            return Math.min(movies.length - 1, prev + columns);
          });
          break;
        case 'ArrowLeft':
          setSelectedIndex((prev) => Math.max(0, prev - 1));
          break;
        case 'ArrowRight':
          setSelectedIndex((prev) => Math.min(movies.length - 1, prev + 1));
          break;
        case 'Enter':
          onSelect(movies[selectedIndex]);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movies, selectedIndex, onSelect]);

  // Scroll selected movie into view
  useEffect(() => {
    const element = document.querySelector(`[data-index="${selectedIndex}"]`);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [selectedIndex]);

  return (
    <Grid>
      {movies.map((movie, index) => (
        <MovieCard
          key={movie.streamId}
          data-index={index}
          className={index === selectedIndex ? 'focused' : ''}
          onClick={() => {
            setSelectedIndex(index);
            onSelect(movie);
          }}
        >
          <Poster
            src={movie.streamIcon || '/placeholder.jpg'}
            alt={movie.title}
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.jpg';
            }}
          />
          <Info>
            <Title>{movie.title}</Title>
            <Year>{new Date(movie.releaseDate).getFullYear()}</Year>
          </Info>
          {movie.rating && <Rating>⭐ {movie.rating}</Rating>}
        </MovieCard>
      ))}
    </Grid>
  );
};

export default MovieGrid;
