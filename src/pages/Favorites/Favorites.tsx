import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useFavoritesService } from '@/contexts/ServiceContext';
import { IChannel, IMovie, ISeries } from '@/types';
import FavoriteGrid from '@/components/Favorite/FavoriteGrid';
import FavoriteDetails from '@/components/Favorite/FavoriteDetails';

interface FavoritesProps {
  onBack: () => void;
  onPlayChannel: (channel: IChannel) => void;
  onPlayMovie: (movie: IMovie) => void;
  onPlaySeries: (series: ISeries) => void;
}

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.backgroundDark};
`;

const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
`;

const BackButton = styled.button`
  margin-right: 1rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const Content = styled.div`
  position: relative;
  overflow: hidden;
`;

const Favorites: React.FC<FavoritesProps> = ({
  onBack,
  onPlayChannel,
  onPlayMovie,
  onPlaySeries,
}) => {
  const favoritesService = useFavoritesService();
  const [favorites, setFavorites] = useState<(IChannel | IMovie | ISeries)[]>([]);
  const [selectedItem, setSelectedItem] = useState<IChannel | IMovie | ISeries | null>(null);

  useEffect(() => {
    setFavorites(favoritesService.getFavorites());
  }, [favoritesService]);

  const handleItemSelect = (item: IChannel | IMovie | ISeries) => {
    setSelectedItem(item);
  };

  const handlePlay = (item: IChannel | IMovie | ISeries) => {
    if ('epgChannelId' in item) {
      onPlayChannel(item as IChannel);
    } else if ('duration' in item) {
      onPlayMovie(item as IMovie);
    } else {
      onPlaySeries(item as ISeries);
    }
  };

  const handleRemove = (item: IChannel | IMovie | ISeries) => {
    favoritesService.removeFavorite(item);
    setFavorites(favoritesService.getFavorites());
    setSelectedItem(null);
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={onBack}>Back</BackButton>
        <Title>Favorites</Title>
      </Header>
      <Content>
        <FavoriteGrid
          items={favorites}
          selectedItem={selectedItem}
          onItemSelect={handleItemSelect}
          onItemPlay={handlePlay}
          onItemRemove={handleRemove}
        />
        {selectedItem && (
          <FavoriteDetails
            item={selectedItem}
            onPlay={handlePlay}
            onRemove={handleRemove}
            onClose={() => setSelectedItem(null)}
          />
        )}
      </Content>
    </Container>
  );
};

export default Favorites;
