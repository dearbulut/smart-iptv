import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

interface FavoriteFilterProps {
  currentFilter: 'all' | 'channels' | 'movies' | 'series';
  onApply: (filter: 'all' | 'channels' | 'movies' | 'series') => void;
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

const FilterList = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const FilterItem = styled.div<{ selected?: boolean }>`
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

const FilterIcon = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.lg};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const FilterInfo = styled.div`
  flex: 1;
`;

const FilterName = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.md};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const FilterDescription = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
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

const HelpText = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  border-top: 1px solid ${({ theme }) => theme.colors.background.hover};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const filters = [
  {
    id: 'all',
    icon: '🌟',
    name: 'All Favorites',
    description: 'Show all favorite items',
  },
  {
    id: 'channels',
    icon: '📺',
    name: 'Channels',
    description: 'Show favorite TV channels only',
  },
  {
    id: 'movies',
    icon: '🎬',
    name: 'Movies',
    description: 'Show favorite movies only',
  },
  {
    id: 'series',
    icon: '📺',
    name: 'TV Series',
    description: 'Show favorite TV series only',
  },
] as const;

const FavoriteFilter: React.FC<FavoriteFilterProps> = ({
  currentFilter,
  onApply,
  onClose,
}) => {
  const [selectedFilter, setSelectedFilter] = useState(currentFilter);
  const [focusedElement, setFocusedElement] = useState<'filters' | 'buttons'>('filters');
  const [focusedFilter, setFocusedFilter] = useState(
    filters.findIndex((f) => f.id === currentFilter)
  );
  const [focusedButton, setFocusedButton] = useState<'cancel' | 'apply'>('apply');

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
          if (focusedElement === 'filters') {
            setFocusedFilter((prev) => Math.max(0, prev - 1));
          } else if (focusedElement === 'buttons') {
            setFocusedElement('filters');
          }
          break;
        case 'ArrowDown':
          if (focusedElement === 'filters') {
            if (focusedFilter === filters.length - 1) {
              setFocusedElement('buttons');
            } else {
              setFocusedFilter((prev) => Math.min(filters.length - 1, prev + 1));
            }
          }
          break;
        case 'ArrowLeft':
          if (focusedElement === 'buttons') {
            setFocusedButton('cancel');
          }
          break;
        case 'ArrowRight':
          if (focusedElement === 'buttons') {
            setFocusedButton('apply');
          }
          break;
        case 'Enter':
          if (focusedElement === 'filters') {
            setSelectedFilter(filters[focusedFilter].id);
          } else if (focusedElement === 'buttons') {
            if (focusedButton === 'apply') {
              onApply(selectedFilter);
            } else {
              onClose?.();
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
    focusedFilter,
    focusedButton,
    selectedFilter,
    onApply,
    onClose,
  ]);

  return (
    <Container>
      <Title>Filter Favorites</Title>

      <FilterList>
        {filters.map((filter, index) => (
          <FilterItem
            key={filter.id}
            selected={filter.id === selectedFilter}
            className={
              focusedElement === 'filters' && index === focusedFilter
                ? 'focused'
                : ''
            }
            onClick={() => {
              setSelectedFilter(filter.id);
              setFocusedElement('filters');
              setFocusedFilter(index);
            }}
          >
            <FilterIcon>{filter.icon}</FilterIcon>
            <FilterInfo>
              <FilterName>{filter.name}</FilterName>
              <FilterDescription>{filter.description}</FilterDescription>
            </FilterInfo>
          </FilterItem>
        ))}
      </FilterList>

      <ButtonContainer>
        <Button
          className={
            focusedElement === 'buttons' && focusedButton === 'cancel'
              ? 'focused'
              : ''
          }
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          primary
          className={
            focusedElement === 'buttons' && focusedButton === 'apply'
              ? 'focused'
              : ''
          }
          onClick={() => onApply(selectedFilter)}
        >
          Apply Filter
        </Button>
      </ButtonContainer>

      <HelpText>
        Press UP/DOWN to navigate • Press ENTER to select • Press RETURN to close
      </HelpText>
    </Container>
  );
};

export default FavoriteFilter;
