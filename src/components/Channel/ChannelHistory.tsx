import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { IChannel } from '@/types';

interface ChannelHistoryProps {
  channels: IChannel[];
  onSelect: (channel: IChannel) => void;
  onClose?: () => void;
  maxItems?: number;
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

const Timestamp = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const NoHistory = styled.div`
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

interface HistoryItem {
  channel: IChannel;
  timestamp: number;
}

class ChannelHistoryManager {
  private static instance: ChannelHistoryManager;
  private history: HistoryItem[] = [];
  private maxItems: number = 10;

  private constructor() {
    this.loadHistory();
  }

  public static getInstance(): ChannelHistoryManager {
    if (!ChannelHistoryManager.instance) {
      ChannelHistoryManager.instance = new ChannelHistoryManager();
    }
    return ChannelHistoryManager.instance;
  }

  private loadHistory() {
    const savedHistory = localStorage.getItem('channelHistory');
    if (savedHistory) {
      this.history = JSON.parse(savedHistory);
    }
  }

  private saveHistory() {
    localStorage.setItem('channelHistory', JSON.stringify(this.history));
  }

  public addChannel(channel: IChannel) {
    // Remove existing entry for this channel
    this.history = this.history.filter(
      (item) => item.channel.streamId !== channel.streamId
    );

    // Add new entry at the beginning
    this.history.unshift({
      channel,
      timestamp: Date.now(),
    });

    // Trim history to max items
    if (this.history.length > this.maxItems) {
      this.history = this.history.slice(0, this.maxItems);
    }

    this.saveHistory();
  }

  public getHistory(): HistoryItem[] {
    return this.history;
  }

  public clearHistory() {
    this.history = [];
    this.saveHistory();
  }

  public setMaxItems(maxItems: number) {
    this.maxItems = maxItems;
    if (this.history.length > maxItems) {
      this.history = this.history.slice(0, maxItems);
      this.saveHistory();
    }
  }
}

const formatTimestamp = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;

  if (diff < 60000) {
    // Less than 1 minute
    return 'Just now';
  } else if (diff < 3600000) {
    // Less than 1 hour
    const minutes = Math.floor(diff / 60000);
    return `${minutes}m ago`;
  } else if (diff < 86400000) {
    // Less than 1 day
    const hours = Math.floor(diff / 3600000);
    return `${hours}h ago`;
  } else {
    // More than 1 day
    const days = Math.floor(diff / 86400000);
    return `${days}d ago`;
  }
};

const ChannelHistory: React.FC<ChannelHistoryProps> = ({
  onSelect,
  onClose,
  maxItems = 10,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const historyManager = ChannelHistoryManager.getInstance();
  const history = historyManager.getHistory();

  useEffect(() => {
    historyManager.setMaxItems(maxItems);
  }, [maxItems]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
          setSelectedIndex((prev) => Math.max(0, prev - 1));
          break;
        case 'ArrowDown':
          setSelectedIndex((prev) =>
            Math.min(history.length - 1, prev + 1)
          );
          break;
        case 'Enter':
          if (history[selectedIndex]) {
            onSelect(history[selectedIndex].channel);
            onClose?.();
          }
          break;
        case 'Delete':
        case 'Backspace':
          if (history[selectedIndex]) {
            historyManager.clearHistory();
          }
          break;
        case 'Escape':
          onClose?.();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [history, selectedIndex, onSelect, onClose]);

  return (
    <Container>
      <Title>Channel History</Title>
      <ChannelList>
        {history.length > 0 ? (
          history.map((item, index) => (
            <ChannelItem
              key={item.channel.streamId}
              selected={index === selectedIndex}
              className={index === selectedIndex ? 'focused' : ''}
              onClick={() => {
                onSelect(item.channel);
                onClose?.();
              }}
            >
              <ChannelLogo
                src={item.channel.streamIcon || '/placeholder.png'}
                alt={item.channel.name}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.png';
                }}
              />
              <ChannelInfo>
                <ChannelName>{item.channel.name}</ChannelName>
                <ChannelNumber>#{item.channel.num}</ChannelNumber>
              </ChannelInfo>
              <Timestamp>{formatTimestamp(item.timestamp)}</Timestamp>
            </ChannelItem>
          ))
        ) : (
          <NoHistory>No channel history yet</NoHistory>
        )}
      </ChannelList>
      <HelpText>
        Press DELETE to clear history • Press ENTER to select • Press RETURN to close
      </HelpText>
    </Container>
  );
};

export { ChannelHistory, ChannelHistoryManager };
