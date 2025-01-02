import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { IEPGProgram } from '@/types';

interface EPGProgramDetailsProps {
  program: IEPGProgram;
  onClose: () => void;
  onRecord?: () => void;
  onReminder?: () => void;
}

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 1000;
`;

const Content = styled.div`
  width: 80%;
  max-width: 600px;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 8px;
  padding: 2rem;
`;

const Title = styled.h2`
  margin: 0 0 1rem;
  color: ${({ theme }) => theme.colors.text};
`;

const Time = styled.div`
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Description = styled.div`
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.text};
  white-space: pre-wrap;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button<{ primary?: boolean; focused?: boolean }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background-color: ${({ theme, primary }) =>
    primary ? theme.colors.primary : theme.colors.backgroundDark};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  outline: ${({ theme, focused }) => (focused ? `2px solid ${theme.colors.primary}` : 'none')};

  &:hover {
    background-color: ${({ theme, primary }) =>
      primary ? theme.colors.primaryDark : theme.colors.backgroundLight};
  }
`;

const EPGProgramDetails: React.FC<EPGProgramDetailsProps> = ({
  program,
  onClose,
  onRecord,
  onReminder,
}) => {
  const [focusedButton, setFocusedButton] = useState<'record' | 'reminder' | 'close'>('close');

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          setFocusedButton((prev) => {
            if (prev === 'close') return onRecord ? 'record' : 'close';
            if (prev === 'record') return onReminder ? 'reminder' : 'close';
            return 'close';
          });
          break;
        case 'ArrowRight':
          setFocusedButton((prev) => {
            if (prev === 'close') return onReminder ? 'reminder' : onRecord ? 'record' : 'close';
            if (prev === 'record') return 'close';
            return onRecord ? 'record' : 'close';
          });
          break;
        case 'Enter':
          switch (focusedButton) {
            case 'record':
              onRecord?.();
              break;
            case 'reminder':
              onReminder?.();
              break;
            case 'close':
              onClose();
              break;
          }
          break;
        case 'Escape':
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onRecord, onReminder, focusedButton]);

  return (
    <Container>
      <Content>
        <Title>{program.title}</Title>
        <Time>
          {new Date(program.start).toLocaleString()} - {new Date(program.end).toLocaleString()}
        </Time>
        {program.description && <Description>{program.description}</Description>}
        {program.genre && <div>Genre: {program.genre}</div>}
        {program.cast && <div>Cast: {program.cast}</div>}
        {program.director && <div>Director: {program.director}</div>}
        {program.rating && <div>Rating: {program.rating}</div>}
        <ButtonGroup>
          {onRecord && (
            <Button
              focused={focusedButton === 'record'}
              onClick={() => {
                setFocusedButton('record');
                onRecord();
              }}
            >
              Record
            </Button>
          )}
          {onReminder && (
            <Button
              focused={focusedButton === 'reminder'}
              onClick={() => {
                setFocusedButton('reminder');
                onReminder();
              }}
            >
              Set Reminder
            </Button>
          )}
          <Button
            primary
            focused={focusedButton === 'close'}
            onClick={() => {
              setFocusedButton('close');
              onClose();
            }}
          >
            Close
          </Button>
        </ButtonGroup>
      </Content>
    </Container>
  );
};

export default EPGProgramDetails;
