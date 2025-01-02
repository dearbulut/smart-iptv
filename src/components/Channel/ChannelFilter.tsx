import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { IChannel, ICategory } from '@/types';

interface ChannelFilterProps {
  channels: IChannel[];
  categories: ICategory[];
  onFilter: (filters: ChannelFilters) => void;
  onClose?: () => void;
}

interface ChannelFilters {
  category?: string;
  name?: string;
  favorite?: boolean;
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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.sizes.md};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const Select = styled.select`
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

const Option = styled.option`
  background: ${({ theme }) => theme.colors.background.main};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Input = styled.input`
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

const Checkbox = styled.div<{ checked?: boolean; focused?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.background.main};
  border: 2px solid
    ${({ theme, focused }) =>
      focused ? theme.colors.secondary.main : 'transparent'};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;

  &::before {
    content: '';
    width: 20px;
    height: 20px;
    border: 2px solid ${({ theme }) => theme.colors.text.secondary};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    background: ${({ theme, checked }) =>
      checked ? theme.colors.secondary.main : 'transparent'};
    transition: ${({ theme }) => theme.transitions.default};
  }
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

const ChannelFilter: React.FC<ChannelFilterProps> = ({
  categories,
  onFilter,
  onClose,
}) => {
  const [filters, setFilters] = useState<ChannelFilters>({});
  const [focusedField, setFocusedField] = useState<string>('category');

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
          switch (focusedField) {
            case 'name':
              setFocusedField('category');
              break;
            case 'favorite':
              setFocusedField('name');
              break;
            case 'cancel':
            case 'apply':
              setFocusedField('favorite');
              break;
          }
          break;
        case 'ArrowDown':
          switch (focusedField) {
            case 'category':
              setFocusedField('name');
              break;
            case 'name':
              setFocusedField('favorite');
              break;
            case 'favorite':
              setFocusedField('cancel');
              break;
          }
          break;
        case 'ArrowLeft':
          if (focusedField === 'apply') {
            setFocusedField('cancel');
          }
          break;
        case 'ArrowRight':
          if (focusedField === 'cancel') {
            setFocusedField('apply');
          }
          break;
        case 'Enter':
          switch (focusedField) {
            case 'favorite':
              setFilters((prev) => ({
                ...prev,
                favorite: !prev.favorite,
              }));
              break;
            case 'apply':
              onFilter(filters);
              onClose?.();
              break;
            case 'cancel':
              onClose?.();
              break;
          }
          break;
        case 'Escape':
          onClose?.();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedField, filters, onFilter, onClose]);

  return (
    <Container>
      <Title>Filter Channels</Title>
      <Form onSubmit={(e) => e.preventDefault()}>
        <FormGroup>
          <Label>Category</Label>
          <Select
            value={filters.category || ''}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, category: e.target.value }))
            }
            className={focusedField === 'category' ? 'focused' : ''}
            onFocus={() => setFocusedField('category')}
          >
            <Option value="">All Categories</Option>
            {categories.map((category) => (
              <Option key={category.categoryId} value={category.categoryId}>
                {category.categoryName}
              </Option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Channel Name</Label>
          <Input
            type="text"
            value={filters.name || ''}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Search by name..."
            className={focusedField === 'name' ? 'focused' : ''}
            onFocus={() => setFocusedField('name')}
          />
        </FormGroup>

        <Checkbox
          checked={filters.favorite}
          focused={focusedField === 'favorite'}
          onClick={() =>
            setFilters((prev) => ({ ...prev, favorite: !prev.favorite }))
          }
          onFocus={() => setFocusedField('favorite')}
          tabIndex={0}
        >
          Show only favorites
        </Checkbox>

        <ButtonContainer>
          <Button
            className={focusedField === 'cancel' ? 'focused' : ''}
            onClick={() => onClose?.()}
          >
            Cancel
          </Button>
          <Button
            primary
            className={focusedField === 'apply' ? 'focused' : ''}
            onClick={() => {
              onFilter(filters);
              onClose?.();
            }}
          >
            Apply
          </Button>
        </ButtonContainer>
      </Form>
    </Container>
  );
};

export default ChannelFilter;
