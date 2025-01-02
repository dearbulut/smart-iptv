import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { IChannel } from '@/types';

interface ChannelHistoryProps {
  onSelect: (channel: IChannel) => void;
  maxItems?: number;
}

const Container = styled.div`
  position: fixed;
  top: ${({ theme }) => theme.spacing.xl};
  right: ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.background.card};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.card};
  max-width: 300px;
`;

const Title = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.lg};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Item = styled.div<{ selected?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme, selected }) =>
    selected ? theme.colors.background.hover : 'transparent'};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
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
  color: ${({ theme }) => theme.colors.text.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ChannelNumber = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const HelpText = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: ${({ theme }) => theme.spacing.md};
  text-align: center;
`;

class ChannelHistoryManager {
  private static instance: ChannelHistoryManager;
  private history: IChannel[] = [];
  private maxItems: number;
  private listeners: ((history: IChannel[]) => void)[] = [];

  private constructor(maxItems: number = 10) {
    this.maxItems = maxItems;
  }

  public static getInstance(maxItems: number = 10): ChannelHistoryManager {
    if (!ChannelHistoryManager.instance) {
      ChannelHistoryManager.instance = new ChannelHistoryManager(maxItems);
    }
    return ChannelHistoryManager.instance;
  }

  public addChannel(channel: IChannel) {
    this.history = [
      channel,
      ...this.history.filter((c) => c.streamId !== channel.streamId),
    ].slice(0, this.maxItems);
    this.notifyListeners();
  }

  public getHistory(): IChannel[] {
    return [...this.history];
  }

  public addListener(listener: (history: IChannel[]) => void) {
    this.listeners.push(listener);
  }

  public removeListener(listener: (history: IChannel[]) => void) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener(this.getHistory()));
  }
}

const ChannelHistory: React.FC<ChannelHistoryProps> = ({
  onSelect,
  maxItems = 10,
}) => {
  const [history, setHistory] = useState<IChannel[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const historyManager = ChannelHistoryManager.getInstance(maxItems);
    const handleHistoryChange = (newHistory: IChannel[]) => {
      setHistory(newHistory);
    };

    historyManager.addListener(handleHistoryChange);
    setHistory(historyManager.getHistory());

    return () => historyManager.removeListener(handleHistoryChange);
  }, [maxItems]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'p' || event.key === 'P') {
        setVisible(true);
        setSelectedIndex(0);
      } else if (visible) {
        switch (event.key) {
          case 'ArrowUp':
            setSelectedIndex((prev) => Math.max(0, prev - 1));
            break;
          case 'ArrowDown':
            setSelectedIndex((prev) => Math.min(history.length - 1, prev + 1));
            break;
          case 'Enter':
            if (history[selectedIndex]) {
              onSelect(history[selectedIndex]);
              setVisible(false);
            }
            break;
          case 'Escape':
          case 'Backspace':
            setVisible(false);
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [visible, history, selectedIndex, onSelect]);

  if (!visible || history.length === 0) return null;

  return (
    <Container>
      <Title>Recent Channels</Title>
      <List>
        {history.map((channel, index) => (
          <Item
            key={channel.streamId}
            selected={index === selectedIndex}
            className={index === selectedIndex ? 'focused' : ''}
            onClick={() => {
              onSelect(channel);
              setVisible(false);
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
          </Item>
        ))}
      </List>
      <HelpText>
        Use UP/DOWN to navigate, ENTER to select, ESC to close
      </HelpText>
    </Container>
  );
};

export { ChannelHistory, ChannelHistoryManager };
