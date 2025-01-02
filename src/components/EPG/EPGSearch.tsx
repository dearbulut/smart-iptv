import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { IEPGProgram } from '@/types';

interface EPGSearchProps {
  programs: IEPGProgram[];
  onSelect?: (program: IEPGProgram) => void;
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

  &.focused {
    border-color: ${({ theme }) => theme.colors.secondary.main};
  }
`;

const Results = styled.div`
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

const EPGSearch: React.FC<EPGSearchProps> = ({
  programs,
  onSelect,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [focusedElement, setFocusedElement] = useState<'search' | 'results'>('search');

  const filteredPrograms = programs.filter(
    (program) =>
      program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
          if (focusedElement === 'results') {
            setSelectedIndex((prev) => Math.max(0, prev - 1));
          } else if (focusedElement === 'search') {
            setFocusedElement('results');
            setSelectedIndex(0);
          }
          break;
        case 'ArrowDown':
          if (focusedElement === 'search') {
            setFocusedElement('results');
            setSelectedIndex(0);
          } else if (focusedElement === 'results') {
            setSelectedIndex((prev) =>
              Math.min(filteredPrograms.length - 1, prev + 1)
            );
          }
          break;
        case 'Enter':
          if (focusedElement === 'results' && filteredPrograms[selectedIndex]) {
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
  }, [focusedElement, selectedIndex, filteredPrograms, onSelect, onClose]);

  return (
    <Container>
      <Title>Search Programs</Title>
      <SearchInput
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search by title or description..."
        className={focusedElement === 'search' ? 'focused' : ''}
        onFocus={() => setFocusedElement('search')}
      />

      <Results>
        {filteredPrograms.length > 0 ? (
          filteredPrograms.map((program, index) => (
            <Program
              key={`${program.start}-${program.end}`}
              selected={index === selectedIndex}
              className={
                focusedElement === 'results' && index === selectedIndex
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
                <ProgramDescription>{program.description}</ProgramDescription>
              )}
            </Program>
          ))
        ) : (
          <NoResults>No programs found</NoResults>
        )}
      </Results>

      <HelpText>
        Press UP/DOWN to navigate • Press ENTER to select • Press RETURN to close
      </HelpText>
    </Container>
  );
};

export default EPGSearch;
