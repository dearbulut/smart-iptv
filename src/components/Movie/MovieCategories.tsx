import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { IMovie, ICategory } from '@/types';

interface MovieCategoriesProps {
  categories: ICategory[];
  movies: IMovie[];
  onSelect: (movie: IMovie) => void;
  onClose?: () => void;
}

const slideIn = keyframes`
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
`;

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 400px;
  background: ${({ theme }) => theme.colors.background.card};
  padding: ${({ theme }) => theme.spacing.xl};
  animation: ${slideIn} 0.3s ease-in-out;
  z-index: 1000;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.typography.sizes.xl};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const CategoryList = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const CategoryItem = styled.div<{ selected?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme, selected }) =>
    selected ? theme.colors.background.hover : 'transparent'};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};

  &.focused {
    background: ${({ theme }) => theme.colors.background.hover};
    border: 2px solid ${({ theme }) => theme.colors.secondary.main};
  }
`;

const CategoryName = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.md};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const MovieCount = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.background.main};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
`;

const MovieList = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const MovieItem = styled.div<{ selected?: boolean }>`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme, selected }) =>
    selected ? theme.colors.background.hover : 'transparent'};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};

  &.focused {
    background: ${({ theme }) => theme.colors.background.hover};
    border: 2px solid ${({ theme }) => theme.colors.secondary.main};
  }
`;

const Poster = styled.img`
  width: 80px;
  height: 120px;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
`;

const Info = styled.div`
  flex: 1;
  min-width: 0;
`;

const MovieTitle = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.md};
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MovieYear = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const MovieDescription = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const NoMovies = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const HelpText = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  border-top: 1px solid ${({ theme }) => theme.colors.background.hover};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const MovieCategories: React.FC<MovieCategoriesProps> = ({
  categories,
  movies,
  onSelect,
  onClose,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [focusedElement, setFocusedElement] = useState<'categories' | 'movies'>('categories');

  const filteredMovies = selectedCategory
    ? movies.filter((movie) => movie.categoryId === selectedCategory)
    : [];

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
          if (focusedElement === 'categories') {
            setSelectedCategory((prev) => {
              const index = categories.findIndex((c) => c.categoryId === prev);
              const newIndex = Math.max(0, index - 1);
              return categories[newIndex].categoryId;
            });
          } else if (focusedElement === 'movies') {
            setSelectedIndex((prev) => Math.max(0, prev - 1));
          }
          break;
        case 'ArrowDown':
          if (focusedElement === 'categories') {
            setSelectedCategory((prev) => {
              const index = categories.findIndex((c) => c.categoryId === prev);
              const newIndex = Math.min(categories.length - 1, index + 1);
              return categories[newIndex].categoryId;
            });
          } else if (focusedElement === 'movies') {
            setSelectedIndex((prev) =>
              Math.min(filteredMovies.length - 1, prev + 1)
            );
          }
          break;
        case 'ArrowRight':
          if (focusedElement === 'categories' && selectedCategory) {
            setFocusedElement('movies');
            setSelectedIndex(0);
          }
          break;
        case 'ArrowLeft':
          if (focusedElement === 'movies') {
            setFocusedElement('categories');
          }
          break;
        case 'Enter':
          if (focusedElement === 'movies' && filteredMovies[selectedIndex]) {
            onSelect(filteredMovies[selectedIndex]);
          }
          break;
        case 'Escape':
          onClose?.();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    focusedElement,
    selectedCategory,
    selectedIndex,
    categories,
    filteredMovies,
    onSelect,
    onClose,
  ]);

  return (
    <Container>
      <Title>Movie Categories</Title>

      <div style={{ display: 'flex', gap: '1rem', flex: 1 }}>
        <CategoryList>
          {categories.map((category) => (
            <CategoryItem
              key={category.categoryId}
              selected={category.categoryId === selectedCategory}
              className={
                focusedElement === 'categories' &&
                category.categoryId === selectedCategory
                  ? 'focused'
                  : ''
              }
              onClick={() => {
                setSelectedCategory(category.categoryId);
                setFocusedElement('categories');
              }}
            >
              <CategoryName>{category.categoryName}</CategoryName>
              <MovieCount>
                {
                  movies.filter((m) => m.categoryId === category.categoryId)
                    .length
                }
              </MovieCount>
            </CategoryItem>
          ))}
        </CategoryList>

        {selectedCategory && (
          <MovieList>
            {filteredMovies.length > 0 ? (
              filteredMovies.map((movie, index) => (
                <MovieItem
                  key={movie.streamId}
                  selected={index === selectedIndex}
                  className={
                    focusedElement === 'movies' && index === selectedIndex
                      ? 'focused'
                      : ''
                  }
                  onClick={() => {
                    onSelect(movie);
                    onClose?.();
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
                    <MovieTitle>{movie.title}</MovieTitle>
                    <MovieYear>
                      {new Date(movie.releaseDate).getFullYear()}
                    </MovieYear>
                    {movie.description && (
                      <MovieDescription>
                        {movie.description}
                      </MovieDescription>
                    )}
                  </Info>
                </MovieItem>
              ))
            ) : (
              <NoMovies>No movies in this category</NoMovies>
            )}
          </MovieList>
        )}
      </div>

      <HelpText>
        Use LEFT/RIGHT to switch between categories and movies • Press ENTER to
        select • Press RETURN to close
      </HelpText>
    </Container>
  );
};

export default MovieCategories;
