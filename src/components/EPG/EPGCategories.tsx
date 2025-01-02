import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { IEPGProgram } from '@/types';

interface EPGCategoriesProps {
  programs: IEPGProgram[];
  onSelect?: (program: IEPGProgram) => void;
  onClose?: () => void;
}

interface Category {
  name: string;
  count: number;
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
  flex: 1;
  overflow-y: auto;
`;

const CategoryItem = styled.div<{ selected?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
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

const CategoryName = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.md};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const CategoryCount = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.background.main};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
`;

const ProgramList = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const Program = styled.div<{ selected?: boolean }>`
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

const ProgramTitle = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.md};
  font-weight: bold;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const ProgramTime = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const ProgramDescription = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const NoResults = styled.div`
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

const formatTime = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const EPGCategories: React.FC<EPGCategoriesProps> = ({
  programs,
  onSelect,
  onClose,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [focusedElement, setFocusedElement] = useState<'categories' | 'programs'>('categories');

  // Extract unique categories and count programs in each
  const categories = programs.reduce((acc: Category[], program) => {
    const category = program.title.split(':')[0].trim();
    const existing = acc.find((c) => c.name === category);
    if (existing) {
      existing.count++;
    } else {
      acc.push({ name: category, count: 1 });
    }
    return acc;
  }, []);

  const filteredPrograms = selectedCategory
    ? programs.filter((program) =>
        program.title.startsWith(selectedCategory)
      )
    : [];

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
          if (focusedElement === 'categories') {
            setSelectedCategory((prev) => {
              const index = categories.findIndex((c) => c.name === prev);
              const newIndex = Math.max(0, index - 1);
              return categories[newIndex].name;
            });
          } else if (focusedElement === 'programs') {
            setSelectedIndex((prev) => Math.max(0, prev - 1));
          }
          break;
        case 'ArrowDown':
          if (focusedElement === 'categories') {
            setSelectedCategory((prev) => {
              const index = categories.findIndex((c) => c.name === prev);
              const newIndex = Math.min(categories.length - 1, index + 1);
              return categories[newIndex].name;
            });
          } else if (focusedElement === 'programs') {
            setSelectedIndex((prev) =>
              Math.min(filteredPrograms.length - 1, prev + 1)
            );
          }
          break;
        case 'ArrowRight':
          if (focusedElement === 'categories' && selectedCategory) {
            setFocusedElement('programs');
            setSelectedIndex(0);
          }
          break;
        case 'ArrowLeft':
          if (focusedElement === 'programs') {
            setFocusedElement('categories');
          }
          break;
        case 'Enter':
          if (focusedElement === 'programs' && filteredPrograms[selectedIndex]) {
            onSelect?.(filteredPrograms[selectedIndex]);
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
  }, [
    focusedElement,
    selectedCategory,
    selectedIndex,
    categories,
    filteredPrograms,
    onSelect,
    onClose,
  ]);

  return (
    <Container>
      <Title>Program Categories</Title>

      <div style={{ display: 'flex', gap: '1rem', flex: 1 }}>
        <CategoryList>
          {categories.map((category) => (
            <CategoryItem
              key={category.name}
              selected={category.name === selectedCategory}
              className={
                focusedElement === 'categories' &&
                category.name === selectedCategory
                  ? 'focused'
                  : ''
              }
              onClick={() => {
                setSelectedCategory(category.name);
                setFocusedElement('categories');
              }}
            >
              <CategoryName>{category.name}</CategoryName>
              <CategoryCount>{category.count}</CategoryCount>
            </CategoryItem>
          ))}
        </CategoryList>

        {selectedCategory && (
          <ProgramList>
            {filteredPrograms.length > 0 ? (
              filteredPrograms.map((program, index) => (
                <Program
                  key={`${program.start}-${program.end}`}
                  selected={index === selectedIndex}
                  className={
                    focusedElement === 'programs' && index === selectedIndex
                      ? 'focused'
                      : ''
                  }
                  onClick={() => {
                    onSelect?.(program);
                    onClose?.();
                  }}
                >
                  <ProgramTitle>{program.title}</ProgramTitle>
                  <ProgramTime>
                    {formatTime(program.start)} - {formatTime(program.end)}
                  </ProgramTime>
                  {program.description && (
                    <ProgramDescription>
                      {program.description}
                    </ProgramDescription>
                  )}
                </Program>
              ))
            ) : (
              <NoResults>No programs in this category</NoResults>
            )}
          </ProgramList>
        )}
      </div>

      <HelpText>
        Use LEFT/RIGHT to switch between categories and programs • Press ENTER to
        select • Press RETURN to close
      </HelpText>
    </Container>
  );
};

export default EPGCategories;
