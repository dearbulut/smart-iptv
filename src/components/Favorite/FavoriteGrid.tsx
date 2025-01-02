import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { IChannel, IMovie, ISeries } from '@/types';

interface FavoriteGridProps {
  items: (IChannel | IMovie | ISeries)[];
  onSelect: (item: IChannel | IMovie | ISeries) => void;
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.md};
  overflow-y: auto;
`;

const ItemCard = styled.div<{ selected?: boolean }>`
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

const Image = styled.img`
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

const Details = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const Type = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.spacing.sm};
  right: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  background: rgba(0, 0, 0, 0.7);
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const FavoriteGrid: React.FC<FavoriteGridProps> = ({ items, onSelect }) => {
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
            return Math.min(items.length - 1, prev + columns);
          });
          break;
        case 'ArrowLeft':
          setSelectedIndex((prev) => Math.max(0, prev - 1));
          break;
        case 'ArrowRight':
          setSelectedIndex((prev) => Math.min(items.length - 1, prev + 1));
          break;
        case 'Enter':
          onSelect(items[selectedIndex]);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [items, selectedIndex, onSelect]);

  // Scroll selected item into view
  useEffect(() => {
    const element = document.querySelector(`[data-index="${selectedIndex}"]`);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [selectedIndex]);

  const getItemType = (item: IChannel | IMovie | ISeries): string => {
    if ('num' in item) return 'Channel';
    if ('duration' in item) return 'Movie';
    if ('episodes' in item) return 'Series';
    return 'Unknown';
  };

  const getItemImage = (item: IChannel | IMovie | ISeries): string => {
    if ('streamIcon' in item) return item.streamIcon;
    if ('cover' in item) return item.cover;
    return '/placeholder.jpg';
  };

  const getItemDetails = (item: IChannel | IMovie | ISeries): string => {
    if ('num' in item) return `Channel ${item.num}`;
    if ('duration' in item) return `${item.duration} min`;
    if ('episodes' in item) return `${item.totalSeasons} Seasons`;
    return '';
  };

  return (
    <Grid>
      {items.map((item, index) => (
        <ItemCard
          key={index}
          data-index={index}
          className={index === selectedIndex ? 'focused' : ''}
          onClick={() => {
            setSelectedIndex(index);
            onSelect(item);
          }}
        >
          <Image
            src={getItemImage(item) || '/placeholder.jpg'}
            alt={item.title || item.name}
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.jpg';
            }}
          />
          <Info>
            <Title>{item.title || item.name}</Title>
            <Details>
              <div>{getItemDetails(item)}</div>
              {'rating' in item && item.rating && <div>⭐ {item.rating}</div>}
            </Details>
          </Info>
          <Type>{getItemType(item)}</Type>
        </ItemCard>
      ))}
    </Grid>
  );
};

export default FavoriteGrid;
