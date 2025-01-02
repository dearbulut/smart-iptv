import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { IChannel } from '@/types';
import TizenKeyboard from '../Keyboard/TizenKeyboard';

interface TizenSearchProps {
  channels: IChannel[];
  onSelect: (channel: IChannel) => void;
  onClose?: () => void;
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

const SearchInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.background.main};
  border: 2px solid transparent;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.sizes.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.secondary.main};
  }
`;

const Results = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const Result = styled.div<{ selected?: boolean }>`
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

const TizenSearch: React.FC<TizenSearchProps> = ({
  channels,
  onSelect,
  onClose,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showKeyboard, setShowKeyboard] = useState(false);

  const filteredChannels = channels.filter(
    (channel) =>
      channel.name.toLowerCase().includes(query.toLowerCase()) ||
      channel.num.toString().includes(query)
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (showKeyboard) return;

      switch (event.key) {
        case 'ArrowUp':
          setSelectedIndex((prev) => Math.max(0, prev - 1));
          break;
        case 'ArrowDown':
          setSelectedIndex((prev) =>
            Math.min(filteredChannels.length - 1, prev + 1)
          );
          break;
        case 'Enter':
          if (filteredChannels[selectedIndex]) {
            onSelect(filteredChannels[selectedIndex]);
            onClose?.();
          }
          break;
        case 'Escape':
          onClose?.();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredChannels, selectedIndex, onSelect, onClose, showKeyboard]);

  return (
    <Container>
      <Title>Search Channels</Title>
      <SearchInput
        type="text"
        value={query}
        placeholder="Search by name or number..."
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setShowKeyboard(true)}
      />
      <Results>
        {filteredChannels.length > 0 ? (
          filteredChannels.map((channel, index) => (
            <Result
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
            </Result>
          ))
        ) : (
          <NoResults>No channels found</NoResults>
        )}
      </Results>
      {showKeyboard && (
        <TizenKeyboard
          initialValue={query}
          placeholder="Search channels..."
          onSubmit={(value) => {
            setQuery(value);
            setShowKeyboard(false);
          }}
          onCancel={() => setShowKeyboard(false)}
        />
      )}
    </Container>
  );
};

export default TizenSearch;
