import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

interface VideoControlsProps {
  playing: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  quality: string;
  qualities: string[];
  onPlay: () => void;
  onPause: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onQualityChange: (quality: string) => void;
  onClose?: () => void;
}

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const Container = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.9));
  padding: ${({ theme }) => theme.spacing.xl};
  animation: ${fadeIn} 0.3s ease-in-out;
  z-index: 1000;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const Button = styled.button<{ active?: boolean }>`
  padding: ${({ theme }) => theme.spacing.md};
  background: transparent;
  border: none;
  color: ${({ theme, active }) =>
    active ? theme.colors.secondary.main : theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.sizes.xl};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};

  &.focused {
    color: ${({ theme }) => theme.colors.secondary.main};
    transform: scale(1.1);
  }
`;

const TimelineContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Timeline = styled.div`
  flex: 1;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  position: relative;
  cursor: pointer;
`;

const Progress = styled.div<{ percent: number }>`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: ${({ percent }) => percent}%;
  background: ${({ theme }) => theme.colors.secondary.main};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
`;

const Time = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.md};
  color: ${({ theme }) => theme.colors.text.primary};
  min-width: 80px;
  text-align: center;
`;

const VolumeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const VolumeSlider = styled.div`
  width: 100px;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  position: relative;
  cursor: pointer;
`;

const VolumeLevel = styled.div<{ percent: number }>`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: ${({ percent }) => percent}%;
  background: ${({ theme }) => theme.colors.secondary.main};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
`;

const QualityButton = styled(Button)`
  font-size: ${({ theme }) => theme.typography.sizes.md};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border: 1px solid ${({ theme }) => theme.colors.text.primary};
  border-radius: ${({ theme }) => theme.borderRadius.sm};

  &.focused {
    border-color: ${({ theme }) => theme.colors.secondary.main};
  }
`;

const QualityMenu = styled.div`
  position: absolute;
  bottom: 100%;
  right: ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.background.card};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const QualityOption = styled.button<{ active?: boolean }>`
  padding: ${({ theme }) => theme.spacing.md};
  background: transparent;
  border: none;
  color: ${({ theme, active }) =>
    active ? theme.colors.secondary.main : theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.sizes.md};
  cursor: pointer;
  text-align: left;
  transition: ${({ theme }) => theme.transitions.default};

  &.focused {
    background: ${({ theme }) => theme.colors.background.hover};
    color: ${({ theme }) => theme.colors.secondary.main};
  }
`;

const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return hours > 0
    ? `${hours}:${minutes.toString().padStart(2, '0')}:${secs
        .toString()
        .padStart(2, '0')}`
    : `${minutes}:${secs.toString().padStart(2, '0')}`;
};

const VideoControls: React.FC<VideoControlsProps> = ({
  playing,
  currentTime,
  duration,
  volume,
  quality,
  qualities,
  onPlay,
  onPause,
  onSeek,
  onVolumeChange,
  onQualityChange,
  onClose,
}) => {
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [focusedElement, setFocusedElement] = useState<string>('play');
  const [selectedQualityIndex, setSelectedQualityIndex] = useState(
    qualities.indexOf(quality)
  );

  // Auto-hide controls after 5 seconds of inactivity
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose?.();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          if (showQualityMenu) {
            return;
          }
          switch (focusedElement) {
            case 'timeline':
              onSeek(Math.max(0, currentTime - 10));
              break;
            case 'volume':
              onVolumeChange(Math.max(0, volume - 0.1));
              break;
            case 'quality':
              setFocusedElement('volume');
              break;
            default:
              setFocusedElement('timeline');
              break;
          }
          break;
        case 'ArrowRight':
          if (showQualityMenu) {
            return;
          }
          switch (focusedElement) {
            case 'timeline':
              onSeek(Math.min(duration, currentTime + 10));
              break;
            case 'volume':
              onVolumeChange(Math.min(1, volume + 0.1));
              break;
            case 'play':
              setFocusedElement('volume');
              break;
            case 'volume':
              setFocusedElement('quality');
              break;
          }
          break;
        case 'ArrowUp':
          if (showQualityMenu) {
            setSelectedQualityIndex((prev) =>
              Math.max(0, prev - 1)
            );
          }
          break;
        case 'ArrowDown':
          if (showQualityMenu) {
            setSelectedQualityIndex((prev) =>
              Math.min(qualities.length - 1, prev + 1)
            );
          }
          break;
        case 'Enter':
          switch (focusedElement) {
            case 'play':
              playing ? onPause() : onPlay();
              break;
            case 'quality':
              if (showQualityMenu) {
                onQualityChange(qualities[selectedQualityIndex]);
                setShowQualityMenu(false);
              } else {
                setShowQualityMenu(true);
              }
              break;
          }
          break;
        case 'Escape':
          if (showQualityMenu) {
            setShowQualityMenu(false);
          } else {
            onClose?.();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    focusedElement,
    showQualityMenu,
    selectedQualityIndex,
    playing,
    currentTime,
    duration,
    volume,
    qualities,
    onPlay,
    onPause,
    onSeek,
    onVolumeChange,
    onQualityChange,
    onClose,
  ]);

  return (
    <Container>
      <Controls>
        <Button
          className={focusedElement === 'play' ? 'focused' : ''}
          onClick={() => (playing ? onPause() : onPlay())}
        >
          {playing ? '⏸' : '▶'}
        </Button>

        <TimelineContainer>
          <Time>{formatTime(currentTime)}</Time>
          <Timeline
            className={focusedElement === 'timeline' ? 'focused' : ''}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const percent = (e.clientX - rect.left) / rect.width;
              onSeek(percent * duration);
            }}
          >
            <Progress percent={(currentTime / duration) * 100} />
          </Timeline>
          <Time>{formatTime(duration)}</Time>
        </TimelineContainer>

        <VolumeContainer>
          <Button
            className={focusedElement === 'volume' ? 'focused' : ''}
            onClick={() => onVolumeChange(volume === 0 ? 1 : 0)}
          >
            {volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
          </Button>
          <VolumeSlider
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const percent = (e.clientX - rect.left) / rect.width;
              onVolumeChange(Math.max(0, Math.min(1, percent)));
            }}
          >
            <VolumeLevel percent={volume * 100} />
          </VolumeSlider>
        </VolumeContainer>

        <QualityButton
          className={focusedElement === 'quality' ? 'focused' : ''}
          onClick={() => setShowQualityMenu((prev) => !prev)}
        >
          {quality}
        </QualityButton>

        {showQualityMenu && (
          <QualityMenu>
            {qualities.map((q, index) => (
              <QualityOption
                key={q}
                active={q === quality}
                className={index === selectedQualityIndex ? 'focused' : ''}
                onClick={() => {
                  onQualityChange(q);
                  setShowQualityMenu(false);
                }}
              >
                {q}
              </QualityOption>
            ))}
          </QualityMenu>
        )}
      </Controls>
    </Container>
  );
};

export default VideoControls;
