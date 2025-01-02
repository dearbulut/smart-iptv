import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { ISeries } from '@/types';

interface SeriesSearchProps {
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

const SearchInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.background.main};
  border: 2px solid transparent;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.sizes.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.secondary.main};
  }

  &.focused {
    border-color: ${({ theme }) => theme.colors.secondary.main};
  }
`;

const Results = styled.div`
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

const NoResults = styled.div`
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

const SeriesSearch: React.FC<SeriesSearchProps> = ({
  series,
  onSelect,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [focusedElement, setFocusedElement] = useState<'search' | 'results'>('search');

  const filteredSeries = series.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.plot?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
          if (focusedElement === 'results') {
            setSelectedIndex((prev) => Math.max(0, prev - 1));
          } else if (focusedElement === 'search') {
            setFocusedElement('results');
            setSelectedIndex(0);
          }
          break;
        case 'ArrowDown':
          if (focusedElement === 'search') {
            setFocusedElement('results');
            setSelectedIndex(0);
          } else if (focusedElement === 'results') {
            setSelectedIndex((prev) =>
              Math.min(filteredSeries.length - 1, prev + 1)
            );
          }
          break;
        case 'Enter':
          if (focusedElement === 'results' && filteredSeries[selectedIndex]) {
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
  }, [focusedElement, selectedIndex, filteredSeries, onSelect, onClose]);

  return (
    <Container>
      <Title>Search TV Series</Title>
      <SearchInput
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search by title or description..."
        className={focusedElement === 'search' ? 'focused' : ''}
        onFocus={() => setFocusedElement('search')}
      />

      <Results>
        {filteredSeries.length > 0 ? (
          filteredSeries.map((series, index) => (
            <SeriesItem
              key={series.seriesId}
              selected={index === selectedIndex}
              className={
                focusedElement === 'results' && index === selectedIndex
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
          <NoResults>No series found</NoResults>
        )}
      </Results>

      <HelpText>
        Press UP/DOWN to navigate • Press ENTER to select • Press RETURN to close
      </HelpText>
    </Container>
  );
};

export default SeriesSearch;
