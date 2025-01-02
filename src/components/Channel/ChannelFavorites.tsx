import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { IChannel } from '@/types';
import { useFavoritesService } from '@/contexts/ServiceContext';

interface ChannelFavoritesProps {
  onSelect: (channel: IChannel) => void;
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

const ChannelList = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const ChannelItem = styled.div<{ selected?: boolean }>`
  display: flex;
  align-items: center;
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

const ChannelLogo = styled.img`
  width: 40px;
  height: 40px;
  object-fit: contain;
  background: ${({ theme }) => theme.colors.background.main};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
`;

const ChannelInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ChannelName = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.md};
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ChannelNumber = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const NoFavorites = styled.div`
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

const ChannelFavorites: React.FC<ChannelFavoritesProps> = ({
  onSelect,
  onClose,
}) => {
  const favoritesService = useFavoritesService();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const favorites = favoritesService.getFavorites();

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
            onClose?.();
          }
          break;
        case 'Delete':
        case 'Backspace':
          if (favorites[selectedIndex]) {
            favoritesService.removeFavorite(favorites[selectedIndex].streamId);
          }
          break;
        case 'Escape':
          onClose?.();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [favorites, selectedIndex, onSelect, onClose, favoritesService]);

  return (
    <Container>
      <Title>Favorite Channels</Title>
      <ChannelList>
        {favorites.length > 0 ? (
          favorites.map((channel, index) => (
            <ChannelItem
              key={channel.streamId}
              selected={index === selectedIndex}
              className={index === selectedIndex ? 'focused' : ''}
              onClick={() => {
                onSelect(channel);
                onClose?.();
              }}
            >
              <ChannelLogo
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
          ))
        ) : (
          <NoFavorites>No favorite channels yet</NoFavorites>
        )}
      </ChannelList>
      <HelpText>
        Press DELETE to remove from favorites • Press ENTER to select • Press RETURN to close
      </HelpText>
    </Container>
  );
};

export default ChannelFavorites;
