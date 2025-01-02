import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { IChannel, ICategory } from '@/types';

interface ChannelGroupProps {
  channels: IChannel[];
  categories: ICategory[];
  onSelect: (channel: IChannel) => void;
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

const CategoryList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
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

const NoChannels = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const ChannelGroup: React.FC<ChannelGroupProps> = ({
  channels,
  categories,
  onSelect,
  onClose,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filteredChannels = channels.filter(
    (channel) => !selectedCategory || channel.categoryId === selectedCategory
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
          setSelectedIndex((prev) => Math.max(0, prev - 1));
          break;
        case 'ArrowDown':
          setSelectedIndex((prev) =>
            Math.min(filteredChannels.length - 1, prev + 1)
          );
          break;
        case 'ArrowLeft':
          setSelectedCategory(null);
          break;
        case 'ArrowRight':
          if (!selectedCategory && categories.length > 0) {
            setSelectedCategory(categories[0].categoryId);
          }
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
  }, [filteredChannels, selectedIndex, selectedCategory, categories, onSelect, onClose]);

  return (
    <Container>
      <Title>Channel Groups</Title>
      <CategoryList>
        <CategoryButton
          active={!selectedCategory}
          onClick={() => setSelectedCategory(null)}
          className={!selectedCategory ? 'focused' : ''}
        >
          All
        </CategoryButton>
        {categories.map((category) => (
          <CategoryButton
            key={category.categoryId}
            active={selectedCategory === category.categoryId}
            onClick={() => setSelectedCategory(category.categoryId)}
            className={selectedCategory === category.categoryId ? 'focused' : ''}
          >
            {category.categoryName}
          </CategoryButton>
        ))}
      </CategoryList>
      <ChannelList>
        {filteredChannels.length > 0 ? (
          filteredChannels.map((channel, index) => (
            <ChannelItem
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
            </ChannelItem>
          ))
        ) : (
          <NoChannels>No channels in this category</NoChannels>
        )}
      </ChannelList>
    </Container>
  );
};

export default ChannelGroup;
