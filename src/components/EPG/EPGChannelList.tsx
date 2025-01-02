import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { IChannel } from '@/types';

interface EPGChannelListProps {
  channels: IChannel[];
  selectedChannelId?: number;
  onChannelSelect: (channel: IChannel) => void;
}

const Container = styled.div`
  width: 300px;
  height: 100%;
  background: ${({ theme }) => theme.colors.background.card};
  border-right: 1px solid ${({ theme }) => theme.colors.background.hover};
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.background.hover};
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.background.main};
  border: 2px solid transparent;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.sizes.md};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.secondary.main};
  }

  &.focused {
    border-color: ${({ theme }) => theme.colors.secondary.main};
  }
`;

const List = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing.md};
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

const NoResults = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const EPGChannelList: React.FC<EPGChannelListProps> = ({
  channels,
  selectedChannelId,
  onChannelSelect,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [focusedElement, setFocusedElement] = useState<'search' | 'list'>('list');

  const filteredChannels = channels.filter(
    (channel) =>
      channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      channel.num.toString().includes(searchQuery)
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
          if (focusedElement === 'list') {
            setSelectedIndex((prev) => Math.max(0, prev - 1));
          } else if (focusedElement === 'search') {
            setFocusedElement('list');
            setSelectedIndex(0);
          }
          break;
        case 'ArrowDown':
          if (focusedElement === 'list') {
            setSelectedIndex((prev) =>
              Math.min(filteredChannels.length - 1, prev + 1)
            );
          }
          break;
        case 'Enter':
          if (focusedElement === 'list' && filteredChannels[selectedIndex]) {
            onChannelSelect(filteredChannels[selectedIndex]);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedElement, selectedIndex, filteredChannels, onChannelSelect]);

  return (
    <Container>
      <Header>
        <SearchInput
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search channels..."
          className={focusedElement === 'search' ? 'focused' : ''}
          onFocus={() => setFocusedElement('search')}
        />
      </Header>

      <List>
        {filteredChannels.length > 0 ? (
          filteredChannels.map((channel, index) => (
            <ChannelItem
              key={channel.streamId}
              selected={channel.streamId === selectedChannelId}
              className={
                focusedElement === 'list' && index === selectedIndex
                  ? 'focused'
                  : ''
              }
              onClick={() => onChannelSelect(channel)}
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
          <NoResults>No channels found</NoResults>
        )}
      </List>
    </Container>
  );
};

export default EPGChannelList;
