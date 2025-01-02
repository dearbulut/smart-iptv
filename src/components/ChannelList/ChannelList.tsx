import React, { useState } from 'react';
import styled from 'styled-components';
import { useTVNavigation } from '@/hooks/useTVNavigation';
import { useFavoritesService } from '@/contexts/ServiceContext';
import { IChannel, ICategory } from '@/types';

interface ChannelListProps {
  channels: IChannel[];
  categories: ICategory[];
  selectedChannelId?: number;
  onChannelSelect: (channel: IChannel) => void;
  onBack?: () => void;
}

const Container = styled.div`
  width: 300px;
  height: 100%;
  background: ${({ theme }) => theme.colors.background.card};
  color: ${({ theme }) => theme.colors.text.primary};
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.background.hover};
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.background.main};
  border: 1px solid ${({ theme }) => theme.colors.background.hover};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.sizes.md};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.secondary.main};
  }
`;

const CategoryList = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.sm};
  overflow-x: auto;
  white-space: nowrap;

  &::-webkit-scrollbar {
    height: 4px;
  }
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

const ChannelsContainer = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const ChannelItem = styled.div<{ selected?: boolean }>`
  padding: ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  cursor: pointer;
  background: ${({ theme, selected }) =>
    selected ? theme.colors.background.hover : 'transparent'};
  border-left: 4px solid ${({ theme, selected }) =>
    selected ? theme.colors.secondary.main : 'transparent'};
  transition: ${({ theme }) => theme.transitions.default};

  &.focused {
    background: ${({ theme }) => theme.colors.background.hover};
    border-left-color: ${({ theme }) => theme.colors.secondary.main};
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
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const FavoriteIcon = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.md};
  color: ${({ theme }) => theme.colors.secondary.main};
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

const ChannelList: React.FC<ChannelListProps> = ({
  channels,
  categories,
  selectedChannelId,
  onChannelSelect,
  onBack,
}) => {
  const favoritesService = useFavoritesService();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { registerElement } = useTVNavigation({
    onSelect: (element) => {
      const channelId = element.getAttribute('data-channel-id');
      const channel = channels.find((c) => c.streamId.toString() === channelId);
      if (channel) {
        onChannelSelect(channel);
      }
    },
    onBack,
  });

  const filteredChannels = channels.filter((channel) => {
    const matchesCategory = !selectedCategory || channel.categoryId === selectedCategory;
    const matchesSearch = !searchQuery || 
      channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      channel.num.toString().includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  return (
    <Container>
      <Header>
        <SearchInput
          type="text"
          placeholder="Search channels..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Header>

      <CategoryList>
        <CategoryButton
          active={!selectedCategory}
          onClick={() => setSelectedCategory(null)}
          className="focusable"
          ref={(el) => registerElement(el, 0)}
        >
          All
        </CategoryButton>
        {categories.map((category, index) => (
          <CategoryButton
            key={category.categoryId}
            active={selectedCategory === category.categoryId}
            onClick={() => setSelectedCategory(category.categoryId)}
            className="focusable"
            ref={(el) => registerElement(el, index + 1)}
          >
            {category.categoryName}
          </CategoryButton>
        ))}
      </CategoryList>

      <ChannelsContainer>
        {filteredChannels.map((channel, index) => (
          <ChannelItem
            key={channel.streamId}
            selected={channel.streamId === selectedChannelId}
            ref={(el) => registerElement(el, index + categories.length + 1)}
            data-channel-id={channel.streamId}
            className="focusable"
          >
            <ChannelLogo
              src={channel.streamIcon || '/placeholder.png'}
              alt={channel.name}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.png';
              }}
            />
            <ChannelInfo>
              <div>
                <ChannelName>{channel.name}</ChannelName>
                <ChannelNumber>#{channel.num}</ChannelNumber>
              </div>
              {favoritesService.isFavorite(channel.streamId) && (
                <FavoriteIcon>⭐</FavoriteIcon>
              )}
            </ChannelInfo>
          </ChannelItem>
        ))}
      </ChannelsContainer>
    </Container>
  );
};

export default ChannelList;
