import React, { useState } from 'react';
import styled from 'styled-components';
import { useFavorites } from '@/hooks/useFavorites';
import { useTizenTV } from '@/hooks/useTizenTV';
import { useNotificationStore } from '@/store/notification';
import { IChannel, IMovie, ISeries } from '@/types';
import FavoriteGrid from '@/components/Favorite/FavoriteGrid';
import FavoriteDetails from '@/components/Favorite/FavoriteDetails';
import FavoriteFilter from '@/components/Favorite/FavoriteFilter';

interface FavoritesProps {
  onBack: () => void;
  onPlayChannel?: (channel: IChannel) => void;
  onPlayMovie?: (movie: IMovie) => void;
  onPlaySeries?: (series: ISeries) => void;
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

const NoFavorites = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
`;

const NoFavoritesIcon = styled.div`
  font-size: 64px;
`;

const NoFavoritesText = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.lg};
`;

const NoFavoritesSubText = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.md};
  max-width: 400px;
`;

const Favorites: React.FC<FavoritesProps> = ({
  onBack,
  onPlayChannel,
  onPlayMovie,
  onPlaySeries,
}) => {
  const { favorites, removeFavorite } = useFavorites();
  const { addNotification } = useNotificationStore();
  const [selectedItem, setSelectedItem] = useState<IChannel | IMovie | ISeries | null>(null);
  const [showFilter, setShowFilter] = useState(false);
  const [filter, setFilter] = useState<'all' | 'channels' | 'movies' | 'series'>('all');

  useTizenTV({
    onKeyDown: (event) => {
      switch (event.keyCode) {
        case 10009: // RETURN key
          if (selectedItem) {
            setSelectedItem(null);
          } else if (showFilter) {
            setShowFilter(false);
          } else {
            onBack();
          }
          break;
        case 70: // F key
          if (!selectedItem) {
            setShowFilter(true);
          }
          break;
      }
    },
  });

  const filteredFavorites = favorites.filter((item) => {
    switch (filter) {
      case 'channels':
        return 'num' in item; // IChannel has 'num' property
      case 'movies':
        return 'duration' in item; // IMovie has 'duration' property
      case 'series':
        return 'episodes' in item; // ISeries has 'episodes' property
      default:
        return true;
    }
  });

  const handlePlay = (item: IChannel | IMovie | ISeries) => {
    if ('num' in item) {
      onPlayChannel?.(item);
    } else if ('duration' in item) {
      onPlayMovie?.(item);
    } else if ('episodes' in item) {
      onPlaySeries?.(item);
    }
  };

  const handleRemove = (item: IChannel | IMovie | ISeries) => {
    removeFavorite(item);
    addNotification({
      message: `Removed from favorites: ${item.title || item.name}`,
      type: 'success',
      duration: 2000,
    });
  };

  if (favorites.length === 0) {
    return (
      <Container>
        <Content>
          <Header>
            <Title>Favorites</Title>
          </Header>

          <NoFavorites>
            <NoFavoritesIcon>⭐</NoFavoritesIcon>
            <NoFavoritesText>No favorites yet</NoFavoritesText>
            <NoFavoritesSubText>
              Add your favorite channels, movies, and TV shows to access them quickly
            </NoFavoritesSubText>
          </NoFavorites>
        </Content>
      </Container>
    );
  }

  return (
    <Container>
      <Content>
        <Header>
          <Title>Favorites</Title>
        </Header>

        <FavoriteGrid
          items={filteredFavorites}
          onSelect={(item) => {
            setSelectedItem(item);
            addNotification({
              message: `Selected: ${item.title || item.name}`,
              type: 'info',
              duration: 2000,
            });
          }}
        />

        <HelpText>
          Press F to filter • Press RETURN to go back
        </HelpText>

        {selectedItem && (
          <FavoriteDetails
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
            onPlay={() => {
              handlePlay(selectedItem);
              addNotification({
                message: `Playing: ${selectedItem.title || selectedItem.name}`,
                type: 'success',
                duration: 2000,
              });
            }}
            onRemove={() => {
              handleRemove(selectedItem);
              setSelectedItem(null);
            }}
          />
        )}

        {showFilter && (
          <FavoriteFilter
            currentFilter={filter}
            onApply={(newFilter) => {
              setFilter(newFilter);
              setShowFilter(false);
              addNotification({
                message: `Filter applied: ${newFilter}`,
                type: 'success',
                duration: 2000,
              });
            }}
            onClose={() => setShowFilter(false)}
          />
        )}
      </Content>
    </Container>
  );
};

export default Favorites;
