import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { IChannel } from '@/types';
import { useFavoritesService } from '@/contexts/ServiceContext';

interface ChannelFavoritesProps {
  onSelect: (channel: IChannel) => void;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1rem;
`;

const Title = styled.h2`
  margin: 0 0 1rem;
  color: ${({ theme }) => theme.colors.text};
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  overflow-y: auto;
`;

const ChannelItem = styled.div<{ selected?: boolean }>`
  display: flex;
  align-items: center;
  padding: 0.5rem;
  border-radius: 4px;
  background-color: ${({ theme, selected }) =>
    selected ? theme.colors.primary : theme.colors.background};
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryLight};
  }
`;

const ChannelIcon = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 4px;
  margin-right: 1rem;
  object-fit: cover;
`;

const ChannelInfo = styled.div`
  flex: 1;
`;

const ChannelName = styled.div`
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
`;

const ChannelNumber = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const NoFavorites = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ChannelFavorites: React.FC<ChannelFavoritesProps> = ({ onSelect }) => {
  const favoritesService = useFavoritesService();
  const [favorites, setFavorites] = useState<IChannel[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  useEffect(() => {
    const items = favoritesService.getFavorites();
    setFavorites(items.filter((item): item is IChannel => 'epgChannelId' in item));
  }, [favoritesService]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
          setSelectedIndex((prev) => Math.max(0, prev - 1));
          break;
        case 'ArrowDown':
          setSelectedIndex((prev) => Math.min(favorites.length - 1, prev + 1));
          break;
        case 'Enter':
          if (favorites[selectedIndex]) {
            onSelect(favorites[selectedIndex]);
          }
          break;
        case 'Delete':
        case 'Backspace':
          if (favorites[selectedIndex]) {
            favoritesService.removeFavorite(favorites[selectedIndex]);
            setFavorites((prev) => prev.filter((_, i) => i !== selectedIndex));
            setSelectedIndex((prev) => Math.min(prev, favorites.length - 2));
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [favorites, selectedIndex, onSelect, favoritesService]);

  if (favorites.length === 0) {
    return <NoFavorites>No favorite channels</NoFavorites>;
  }

  return (
    <Container>
      <Title>Favorite Channels</Title>
      <List>
        {favorites.map((channel, index) => (
          <ChannelItem
            key={channel.streamId}
            selected={index === selectedIndex}
            onClick={() => {
              setSelectedIndex(index);
              onSelect(channel);
            }}
          >
            <ChannelIcon
              src={channel.streamIcon || '/placeholder.png'}
              alt={channel.name}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.png';
              }}
            />
            <ChannelInfo>
              <ChannelName>{channel.name}</ChannelName>
              <ChannelNumber>#{channel.num}</ChannelNumber>
            </ChannelInfo>
          </ChannelItem>
        ))}
      </List>
    </Container>
  );
};

export default ChannelFavorites;
