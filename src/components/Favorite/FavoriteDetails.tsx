import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { IChannel, IMovie, ISeries } from '@/types';

interface FavoriteDetailsProps {
  item: IChannel | IMovie | ISeries;
  onClose?: () => void;
  onPlay?: () => void;
  onRemove?: () => void;
}

const slideIn = keyframes`
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
`;

const Container = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 500px;
  background: ${({ theme }) => theme.colors.background.card};
  padding: ${({ theme }) => theme.spacing.xl};
  animation: ${slideIn} 0.3s ease-in-out;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const Backdrop = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
`;

const BackdropImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.typography.sizes.xl};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Info = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.sizes.md};
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Description = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.md};
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const MetaInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.background.main};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const MetaItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MetaLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const MetaValue = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: auto;
`;

const Button = styled.button<{ primary?: boolean }>`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme, primary }) =>
    primary ? theme.colors.secondary.main : 'transparent'};
  border: 2px solid ${({ theme }) => theme.colors.secondary.main};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme, primary }) =>
    primary ? theme.colors.background.main : theme.colors.secondary.main};
  font-size: ${({ theme }) => theme.typography.sizes.md};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};

  &.focused {
    background: ${({ theme }) => theme.colors.secondary.main};
    color: ${({ theme }) => theme.colors.background.main};
  }
`;

const FavoriteDetails: React.FC<FavoriteDetailsProps> = ({
  item,
  onClose,
  onPlay,
  onRemove,
}) => {
  const [focusedButton, setFocusedButton] = useState<'play' | 'remove'>('play');

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          setFocusedButton('play');
          break;
        case 'ArrowRight':
          setFocusedButton('remove');
          break;
        case 'Enter':
          if (focusedButton === 'play') {
            onPlay?.();
          } else if (focusedButton === 'remove') {
            onRemove?.();
          }
          break;
        case 'Escape':
          onClose?.();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedButton, onPlay, onRemove, onClose]);

  const getItemType = (): string => {
    if ('num' in item) return 'Channel';
    if ('duration' in item) return 'Movie';
    if ('episodes' in item) return 'Series';
    return 'Unknown';
  };

  const getItemImage = (): string => {
    if ('streamIcon' in item) return item.streamIcon;
    if ('backdrop' in item) return item.backdrop;
    if ('cover' in item) return item.cover;
    return '/placeholder.jpg';
  };

  const getItemDetails = () => {
    if ('num' in item) {
      return {
        type: 'Channel',
        number: item.num,
        group: item.group,
      };
    }
    if ('duration' in item) {
      return {
        type: 'Movie',
        duration: `${item.duration} min`,
        genre: item.genre,
        director: item.director,
        cast: item.cast,
        language: item.language,
      };
    }
    if ('episodes' in item) {
      return {
        type: 'Series',
        seasons: item.totalSeasons,
        genre: item.genre,
        director: item.director,
        cast: item.cast,
        language: item.language,
      };
    }
    return {};
  };

  const details = getItemDetails();

  return (
    <Container>
      <Backdrop>
        <BackdropImage
          src={getItemImage() || '/placeholder.jpg'}
          alt={item.title || item.name}
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder.jpg';
          }}
        />
      </Backdrop>

      <Title>{item.title || item.name}</Title>

      <Info>
        <div>{getItemType()}</div>
        {'rating' in item && item.rating && (
          <Rating>
            ⭐ {item.rating}
          </Rating>
        )}
      </Info>

      {'plot' in item && item.plot && (
        <Description>{item.plot}</Description>
      )}

      <MetaInfo>
        {Object.entries(details).map(([key, value]) => (
          <MetaItem key={key}>
            <MetaLabel>{key.charAt(0).toUpperCase() + key.slice(1)}</MetaLabel>
            <MetaValue>{value}</MetaValue>
          </MetaItem>
        ))}
      </MetaInfo>

      <ButtonContainer>
        <Button
          primary
          className={focusedButton === 'play' ? 'focused' : ''}
          onClick={onPlay}
        >
          Play
        </Button>
        <Button
          className={focusedButton === 'remove' ? 'focused' : ''}
          onClick={onRemove}
        >
          Remove from Favorites
        </Button>
      </ButtonContainer>
    </Container>
  );
};

export default FavoriteDetails;
