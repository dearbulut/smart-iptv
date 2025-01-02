import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { ISeries } from '@/types';

interface SeriesFilterProps {
  series: ISeries[];
  onApply: (filters: SeriesFilters) => void;
  onClose?: () => void;
}

interface SeriesFilters {
  year?: number;
  genre?: string;
  rating?: number;
  language?: string;
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

const SeriesFilter: React.FC<SeriesFilterProps> = ({
  series,
  onApply,
  onClose,
}) => {
  const [filters, setFilters] = useState<SeriesFilters>({});
  const [focusedField, setFocusedField] = useState<string>('year');

  // Extract unique values from series
  const years = Array.from(
    new Set(
      series.map((s) => new Date(s.releaseDate).getFullYear()).sort((a, b) => b - a)
    )
  );
  const genres = Array.from(new Set(series.map((s) => s.genre)));
  const ratings = Array.from(
    new Set(series.map((s) => Math.floor(s.rating || 0)))
  ).sort((a, b) => b - a);
  const languages = Array.from(new Set(series.map((s) => s.language)));

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
          switch (focusedField) {
            case 'genre':
              setFocusedField('year');
              break;
            case 'rating':
              setFocusedField('genre');
              break;
            case 'language':
              setFocusedField('rating');
              break;
            case 'cancel':
            case 'apply':
              setFocusedField('language');
              break;
          }
          break;
        case 'ArrowDown':
          switch (focusedField) {
            case 'year':
              setFocusedField('genre');
              break;
            case 'genre':
              setFocusedField('rating');
              break;
            case 'rating':
              setFocusedField('language');
              break;
            case 'language':
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
          if (focusedField === 'apply') {
            onApply(filters);
          } else if (focusedField === 'cancel') {
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
  }, [focusedField, filters, onApply, onClose]);

  return (
    <Container>
      <Title>Filter Series</Title>

      <Form>
        <FormGroup>
          <Label>Year</Label>
          <Select
            value={filters.year || ''}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                year: e.target.value ? parseInt(e.target.value) : undefined,
              }))
            }
            className={focusedField === 'year' ? 'focused' : ''}
            onFocus={() => setFocusedField('year')}
          >
            <Option value="">All Years</Option>
            {years.map((year) => (
              <Option key={year} value={year}>
                {year}
              </Option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Genre</Label>
          <Select
            value={filters.genre || ''}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                genre: e.target.value || undefined,
              }))
            }
            className={focusedField === 'genre' ? 'focused' : ''}
            onFocus={() => setFocusedField('genre')}
          >
            <Option value="">All Genres</Option>
            {genres.map((genre) => (
              <Option key={genre} value={genre}>
                {genre}
              </Option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Rating</Label>
          <Select
            value={filters.rating || ''}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                rating: e.target.value ? parseInt(e.target.value) : undefined,
              }))
            }
            className={focusedField === 'rating' ? 'focused' : ''}
            onFocus={() => setFocusedField('rating')}
          >
            <Option value="">All Ratings</Option>
            {ratings.map((rating) => (
              <Option key={rating} value={rating}>
                {rating}+ Stars
              </Option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Language</Label>
          <Select
            value={filters.language || ''}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                language: e.target.value || undefined,
              }))
            }
            className={focusedField === 'language' ? 'focused' : ''}
            onFocus={() => setFocusedField('language')}
          >
            <Option value="">All Languages</Option>
            {languages.map((language) => (
              <Option key={language} value={language}>
                {language}
              </Option>
            ))}
          </Select>
        </FormGroup>

        <ButtonContainer>
          <Button
            className={focusedField === 'cancel' ? 'focused' : ''}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            primary
            className={focusedField === 'apply' ? 'focused' : ''}
            onClick={() => onApply(filters)}
          >
            Apply Filters
          </Button>
        </ButtonContainer>
      </Form>

      <HelpText>
        Press UP/DOWN to navigate • Press ENTER to apply • Press RETURN to close
      </HelpText>
    </Container>
  );
};

export default SeriesFilter;
