import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { ISeries, ICategory } from '@/types';

interface SeriesCategoriesProps {
  categories: ICategory[];
  series: ISeries[];
  onSelect: (series: ISeries) => void;
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

const SeriesCount = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.background.main};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
`;

const SeriesList = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const SeriesItem = styled.div<{ selected?: boolean }>`
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

const SeriesTitle = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.md};
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SeriesDetails = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const SeriesDescription = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const NoSeries = styled.div`
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

const SeriesCategories: React.FC<SeriesCategoriesProps> = ({
  categories,
  series,
  onSelect,
  onClose,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [focusedElement, setFocusedElement] = useState<'categories' | 'series'>('categories');

  const filteredSeries = selectedCategory
    ? series.filter((s) => s.categoryId === selectedCategory)
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
          } else if (focusedElement === 'series') {
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
          } else if (focusedElement === 'series') {
            setSelectedIndex((prev) =>
              Math.min(filteredSeries.length - 1, prev + 1)
            );
          }
          break;
        case 'ArrowRight':
          if (focusedElement === 'categories' && selectedCategory) {
            setFocusedElement('series');
            setSelectedIndex(0);
          }
          break;
        case 'ArrowLeft':
          if (focusedElement === 'series') {
            setFocusedElement('categories');
          }
          break;
        case 'Enter':
          if (focusedElement === 'series' && filteredSeries[selectedIndex]) {
            onSelect(filteredSeries[selectedIndex]);
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
    filteredSeries,
    onSelect,
    onClose,
  ]);

  return (
    <Container>
      <Title>Series Categories</Title>

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
              <SeriesCount>
                {
                  series.filter((s) => s.categoryId === category.categoryId)
                    .length
                }
              </SeriesCount>
            </CategoryItem>
          ))}
        </CategoryList>

        {selectedCategory && (
          <SeriesList>
            {filteredSeries.length > 0 ? (
              filteredSeries.map((series, index) => (
                <SeriesItem
                  key={series.seriesId}
                  selected={index === selectedIndex}
                  className={
                    focusedElement === 'series' && index === selectedIndex
                      ? 'focused'
                      : ''
                  }
                  onClick={() => {
                    onSelect(series);
                    onClose?.();
                  }}
                >
                  <Poster
                    src={series.cover || '/placeholder.jpg'}
                    alt={series.title}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.jpg';
                    }}
                  />
                  <Info>
                    <SeriesTitle>{series.title}</SeriesTitle>
                    <SeriesDetails>
                      <div>{series.releaseDate.split('-')[0]}</div>
                      <div>{series.totalSeasons} Seasons</div>
                      {series.rating && <div>⭐ {series.rating}</div>}
                    </SeriesDetails>
                    {series.plot && (
                      <SeriesDescription>{series.plot}</SeriesDescription>
                    )}
                  </Info>
                </SeriesItem>
              ))
            ) : (
              <NoSeries>No series in this category</NoSeries>
            )}
          </SeriesList>
        )}
      </div>

      <HelpText>
        Use LEFT/RIGHT to switch between categories and series • Press ENTER to
        select • Press RETURN to close
      </HelpText>
    </Container>
  );
};

export default SeriesCategories;
