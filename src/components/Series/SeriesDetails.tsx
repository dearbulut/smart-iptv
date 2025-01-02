import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { ISeries, IEpisode } from '@/types';

interface SeriesDetailsProps {
  series: ISeries;
  onClose?: () => void;
  onPlay?: (episode: IEpisode) => void;
  onAddToFavorites?: () => void;
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

const SeasonList = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  overflow-x: auto;
`;

const SeasonButton = styled.button<{ active?: boolean }>`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  background: ${({ theme, active }) =>
    active ? theme.colors.secondary.main : theme.colors.background.main};
  border: 2px solid ${({ theme }) => theme.colors.secondary.main};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme, active }) =>
    active ? theme.colors.background.main : theme.colors.secondary.main};
  font-size: ${({ theme }) => theme.typography.sizes.md};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};
  white-space: nowrap;

  &.focused {
    background: ${({ theme }) => theme.colors.secondary.main};
    color: ${({ theme }) => theme.colors.background.main};
  }
`;

const EpisodeList = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const Episode = styled.div<{ selected?: boolean }>`
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

const EpisodeImage = styled.img`
  width: 160px;
  height: 90px;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
`;

const EpisodeInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const EpisodeTitle = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.md};
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const EpisodeNumber = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const EpisodeDescription = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
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

const SeriesDetails: React.FC<SeriesDetailsProps> = ({
  series,
  onClose,
  onPlay,
  onAddToFavorites,
}) => {
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisodeIndex, setSelectedEpisodeIndex] = useState(0);
  const [focusedElement, setFocusedElement] = useState<'seasons' | 'episodes' | 'buttons'>('episodes');
  const [focusedButton, setFocusedButton] = useState<'play' | 'favorite'>('play');

  const episodes = series.episodes.filter((e) => e.season === selectedSeason);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
          if (focusedElement === 'episodes') {
            setSelectedEpisodeIndex((prev) => Math.max(0, prev - 1));
          } else if (focusedElement === 'buttons') {
            setFocusedElement('episodes');
          }
          break;
        case 'ArrowDown':
          if (focusedElement === 'episodes') {
            if (selectedEpisodeIndex === episodes.length - 1) {
              setFocusedElement('buttons');
            } else {
              setSelectedEpisodeIndex((prev) =>
                Math.min(episodes.length - 1, prev + 1)
              );
            }
          }
          break;
        case 'ArrowLeft':
          if (focusedElement === 'seasons') {
            setSelectedSeason((prev) => Math.max(1, prev - 1));
          } else if (focusedElement === 'buttons') {
            if (focusedButton === 'favorite') {
              setFocusedButton('play');
            }
          }
          break;
        case 'ArrowRight':
          if (focusedElement === 'seasons') {
            setSelectedSeason((prev) =>
              Math.min(series.totalSeasons, prev + 1)
            );
          } else if (focusedElement === 'buttons') {
            if (focusedButton === 'play') {
              setFocusedButton('favorite');
            }
          }
          break;
        case 'Enter':
          if (focusedElement === 'episodes') {
            onPlay?.(episodes[selectedEpisodeIndex]);
          } else if (focusedElement === 'buttons') {
            if (focusedButton === 'play') {
              onPlay?.(episodes[selectedEpisodeIndex]);
            } else if (focusedButton === 'favorite') {
              onAddToFavorites?.();
            }
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
    focusedButton,
    selectedSeason,
    selectedEpisodeIndex,
    episodes,
    series.totalSeasons,
    onPlay,
    onAddToFavorites,
    onClose,
  ]);

  return (
    <Container>
      <Backdrop>
        <BackdropImage
          src={series.backdrop || series.cover || '/placeholder.jpg'}
          alt={series.title}
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder.jpg';
          }}
        />
      </Backdrop>

      <Title>{series.title}</Title>

      <Info>
        <div>{series.releaseDate.split('-')[0]}</div>
        <div>{series.totalSeasons} Seasons</div>
        {series.rating && (
          <Rating>
            ⭐ {series.rating}
          </Rating>
        )}
      </Info>

      <Description>{series.plot}</Description>

      <MetaInfo>
        <MetaItem>
          <MetaLabel>Genre</MetaLabel>
          <MetaValue>{series.genre}</MetaValue>
        </MetaItem>
        <MetaItem>
          <MetaLabel>Cast</MetaLabel>
          <MetaValue>{series.cast}</MetaValue>
        </MetaItem>
        <MetaItem>
          <MetaLabel>Director</MetaLabel>
          <MetaValue>{series.director}</MetaValue>
        </MetaItem>
        <MetaItem>
          <MetaLabel>Language</MetaLabel>
          <MetaValue>{series.language}</MetaValue>
        </MetaItem>
      </MetaInfo>

      <SeasonList>
        {Array.from({ length: series.totalSeasons }, (_, i) => i + 1).map(
          (season) => (
            <SeasonButton
              key={season}
              active={season === selectedSeason}
              className={
                focusedElement === 'seasons' && season === selectedSeason
                  ? 'focused'
                  : ''
              }
              onClick={() => {
                setSelectedSeason(season);
                setFocusedElement('seasons');
              }}
            >
              Season {season}
            </SeasonButton>
          )
        )}
      </SeasonList>

      <EpisodeList>
        {episodes.map((episode, index) => (
          <Episode
            key={`${episode.season}-${episode.episode}`}
            selected={index === selectedEpisodeIndex}
            className={
              focusedElement === 'episodes' && index === selectedEpisodeIndex
                ? 'focused'
                : ''
            }
            onClick={() => {
              setSelectedEpisodeIndex(index);
              setFocusedElement('episodes');
            }}
          >
            <EpisodeImage
              src={episode.info?.still_path || '/placeholder.jpg'}
              alt={episode.title}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.jpg';
              }}
            />
            <EpisodeInfo>
              <EpisodeTitle>{episode.title}</EpisodeTitle>
              <EpisodeNumber>
                Episode {episode.episode}
              </EpisodeNumber>
              {episode.plot && (
                <EpisodeDescription>{episode.plot}</EpisodeDescription>
              )}
            </EpisodeInfo>
          </Episode>
        ))}
      </EpisodeList>

      <ButtonContainer>
        <Button
          primary
          className={
            focusedElement === 'buttons' && focusedButton === 'play'
              ? 'focused'
              : ''
          }
          onClick={() => onPlay?.(episodes[selectedEpisodeIndex])}
        >
          Play Episode
        </Button>
        <Button
          className={
            focusedElement === 'buttons' && focusedButton === 'favorite'
              ? 'focused'
              : ''
          }
          onClick={onAddToFavorites}
        >
          Add to Favorites
        </Button>
      </ButtonContainer>
    </Container>
  );
};

export default SeriesDetails;
