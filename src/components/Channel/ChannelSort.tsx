import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { IChannel } from '@/types';

interface ChannelSortProps {
  channels: IChannel[];
  onSave: (channels: IChannel[]) => void;
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

const ChannelItem = styled.div<{ selected?: boolean; dragging?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme, selected }) =>
    selected ? theme.colors.background.hover : 'transparent'};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: move;
  transition: ${({ theme }) => theme.transitions.default};
  opacity: ${({ dragging }) => (dragging ? 0.5 : 1)};

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

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const Button = styled.button<{ primary?: boolean }>`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.xl}`};
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

const HelpText = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  border-top: 1px solid ${({ theme }) => theme.colors.background.hover};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const ChannelSort: React.FC<ChannelSortProps> = ({
  channels,
  onSave,
  onClose,
}) => {
  const [sortedChannels, setSortedChannels] = useState([...channels]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [focusedButton, setFocusedButton] = useState<'cancel' | 'save' | null>(
    null
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
          if (focusedButton) {
            setFocusedButton(null);
            setSelectedIndex(sortedChannels.length - 1);
          } else {
            setSelectedIndex((prev) => Math.max(0, prev - 1));
          }
          break;
        case 'ArrowDown':
          if (selectedIndex === sortedChannels.length - 1) {
            setSelectedIndex(-1);
            setFocusedButton('cancel');
          } else {
            setSelectedIndex((prev) => Math.min(sortedChannels.length - 1, prev + 1));
          }
          break;
        case 'ArrowLeft':
          if (focusedButton === 'save') {
            setFocusedButton('cancel');
          }
          break;
        case 'ArrowRight':
          if (focusedButton === 'cancel') {
            setFocusedButton('save');
          }
          break;
        case 'Enter':
          if (focusedButton === 'save') {
            onSave(sortedChannels);
            onClose?.();
          } else if (focusedButton === 'cancel') {
            onClose?.();
          } else if (draggingIndex === null) {
            setDraggingIndex(selectedIndex);
          } else {
            setDraggingIndex(null);
          }
          break;
        case 'Escape':
          if (draggingIndex !== null) {
            setDraggingIndex(null);
          } else {
            onClose?.();
          }
          break;
        case ' ':
          if (draggingIndex !== null && draggingIndex !== selectedIndex) {
            const newChannels = [...sortedChannels];
            const [removed] = newChannels.splice(draggingIndex, 1);
            newChannels.splice(selectedIndex, 0, removed);
            setSortedChannels(newChannels);
            setDraggingIndex(selectedIndex);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    sortedChannels,
    selectedIndex,
    draggingIndex,
    focusedButton,
    onSave,
    onClose,
  ]);

  return (
    <Container>
      <Title>Sort Channels</Title>
      <ChannelList>
        {sortedChannels.map((channel, index) => (
          <ChannelItem
            key={channel.streamId}
            selected={index === selectedIndex}
            dragging={index === draggingIndex}
            className={index === selectedIndex ? 'focused' : ''}
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
        ))}
      </ChannelList>

      <ButtonContainer>
        <Button
          className={focusedButton === 'cancel' ? 'focused' : ''}
          onClick={() => onClose?.()}
        >
          Cancel
        </Button>
        <Button
          primary
          className={focusedButton === 'save' ? 'focused' : ''}
          onClick={() => {
            onSave(sortedChannels);
            onClose?.();
          }}
        >
          Save
        </Button>
      </ButtonContainer>

      <HelpText>
        Press ENTER to start/stop moving • Press SPACE to place • Press UP/DOWN to
        navigate • Press RETURN to cancel
      </HelpText>
    </Container>
  );
};

export default ChannelSort;
