import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { IChannel, ICategory } from '@/types';
import { useFavoritesService } from '@/contexts/ServiceContext';

interface ChannelListProps {
  channels: IChannel[];
  categories: ICategory[];
  selectedChannelId?: number;
  onChannelSelect: (channel: IChannel) => void;
}

const Container = styled.div`
  width: 400px;
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

const Title = styled.h2`
  font-size: ${({ theme }) => theme.typography.sizes.xl};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const CategoryList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const CategoryButton = styled.button<{ active?: boolean }>`
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  background: ${({ theme, active }) =>
    active ? theme.colors.secondary.main : theme.colors.background.main};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  color: ${({ theme, active }) =>
    active ? theme.colors.background.main : theme.colors.text.primary};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};

  &.focused {
    background: ${({ theme }) => theme.colors.secondary.main};
    color: ${({ theme }) => theme.colors.background.main};
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.background.main};
  border: 2px solid transparent;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.sizes.md};
  margin-top: ${({ theme }) => theme.spacing.md};

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

const FavoriteIcon = styled.span`
  color: ${({ theme }) => theme.colors.secondary.main};
  font-size: ${({ theme }) => theme.typography.sizes.lg};
`;

const NoResults = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const ChannelList: React.FC<ChannelListProps> = ({
  channels,
  categories,
  selectedChannelId,
  onChannelSelect,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [focusedElement, setFocusedElement] = useState<'search' | 'category' | 'channel'>('channel');
  const favoritesService = useFavoritesService();

  const filteredChannels = channels.filter((channel) => {
    const matchesCategory =
      !selectedCategory || channel.categoryId === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      channel.num.toString().includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
          if (focusedElement === 'channel') {
            setSelectedIndex((prev) => Math.max(0, prev - 1));
          } else if (focusedElement === 'category') {
            setFocusedElement('search');
          }
          break;
        case 'ArrowDown':
          if (focusedElement === 'search') {
            setFocusedElement('category');
          } else if (focusedElement === 'category') {
            setFocusedElement('channel');
          } else if (focusedElement === 'channel') {
            setSelectedIndex((prev) =>
              Math.min(filteredChannels.length - 1, prev + 1)
            );
          }
          break;
        case 'Enter':
          if (focusedElement === 'channel' && filteredChannels[selectedIndex]) {
            onChannelSelect(filteredChannels[selectedIndex]);
          }
          break;
        case 'Escape':
          setSelectedCategory(null);
          setSearchQuery('');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedElement, selectedIndex, filteredChannels, onChannelSelect]);

  return (
    <Container>
      <Header>
        <Title>Channels</Title>
        <SearchInput
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search channels..."
          className={focusedElement === 'search' ? 'focused' : ''}
          onFocus={() => setFocusedElement('search')}
        />
        <CategoryList>
          <CategoryButton
            active={!selectedCategory}
            onClick={() => setSelectedCategory(null)}
            className={
              focusedElement === 'category' && !selectedCategory ? 'focused' : ''
            }
            onFocus={() => setFocusedElement('category')}
          >
            All
          </CategoryButton>
          {categories.map((category) => (
            <CategoryButton
              key={category.categoryId}
              active={selectedCategory === category.categoryId}
              onClick={() => setSelectedCategory(category.categoryId)}
              className={
                focusedElement === 'category' &&
                selectedCategory === category.categoryId
                  ? 'focused'
                  : ''
              }
              onFocus={() => setFocusedElement('category')}
            >
              {category.categoryName}
            </CategoryButton>
          ))}
        </CategoryList>
      </Header>
      <List>
        {filteredChannels.length > 0 ? (
          filteredChannels.map((channel, index) => (
            <ChannelItem
              key={channel.streamId}
              selected={channel.streamId === selectedChannelId}
              className={
                focusedElement === 'channel' && index === selectedIndex
                  ? 'focused'
                  : ''
              }
              onClick={() => onChannelSelect(channel)}
              onFocus={() => {
                setFocusedElement('channel');
                setSelectedIndex(index);
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
              {favoritesService.isFavorite(channel.streamId) && (
                <FavoriteIcon>★</FavoriteIcon>
              )}
            </ChannelItem>
          ))
        ) : (
          <NoResults>No channels found</NoResults>
        )}
      </List>
    </Container>
  );
};

export default ChannelList;
