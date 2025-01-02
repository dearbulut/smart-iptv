import React from 'react';
import styled, { keyframes } from 'styled-components';
import EPGRecording from './EPGRecording';
import EPGReminder from './EPGReminder';
import { IEPGProgram } from '@/types';

interface EPGProgramDetailsProps {
  program: IEPGProgram;
  onClose?: () => void;
  onRecord?: () => void;
  onReminder?: () => void;
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
  overflow-y: auto;
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.typography.sizes.xl};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Time = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Duration = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.background.main};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  display: inline-block;
`;

const Description = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.md};
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  flex: 1;
`;

const MetaInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.background.main};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const MetaItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MetaLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const MetaValue = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
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

const formatTime = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString([], {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const formatDuration = (start: string, end: string): string => {
  const startTime = new Date(start).getTime();
  const endTime = new Date(end).getTime();
  const duration = (endTime - startTime) / 1000 / 60; // Duration in minutes
  const hours = Math.floor(duration / 60);
  const minutes = Math.floor(duration % 60);
  return hours > 0
    ? `${hours}h ${minutes}m`
    : `${minutes}m`;
};

const EPGProgramDetails: React.FC<EPGProgramDetailsProps> = ({
  program,
  onClose,
  onRecord,
  onReminder,
}) => {
  const [showRecording, setShowRecording] = useState(false);
  const [showReminder, setShowReminder] = useState(false);
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          if (focusedButton === 'reminder') {
            setFocusedButton('record');
          }
          break;
        case 'ArrowRight':
          if (focusedButton === 'record') {
            setFocusedButton('reminder');
          }
          break;
        case 'Enter':
          if (focusedButton === 'record') {
            setShowRecording(true);
          } else if (focusedButton === 'reminder') {
            setShowReminder(true);
          }
          break;
        case 'Escape':
          onClose?.();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onRecord, onReminder, focusedButton]);

  const [focusedButton, setFocusedButton] = useState<'record' | 'reminder'>('record');

  return (
    <Container>
      <Title>{program.title}</Title>
      <Time>
        {formatTime(program.start)} - {formatTime(program.end)}
      </Time>
      <Duration>{formatDuration(program.start, program.end)}</Duration>

      <MetaInfo>
        <MetaItem>
          <MetaLabel>Date</MetaLabel>
          <MetaValue>{formatDate(program.start)}</MetaValue>
        </MetaItem>
        <MetaItem>
          <MetaLabel>Language</MetaLabel>
          <MetaValue>{program.lang}</MetaValue>
        </MetaItem>
        <MetaItem>
          <MetaLabel>EPG ID</MetaLabel>
          <MetaValue>{program.epgId}</MetaValue>
        </MetaItem>
      </MetaInfo>

      {program.description && (
        <Description>{program.description}</Description>
      )}

      <ButtonContainer>
        <Button
          className={focusedButton === 'record' ? 'focused' : ''}
          onClick={() => setShowRecording(true)}
        >
          Record
        </Button>
        <Button
          primary
          className={focusedButton === 'reminder' ? 'focused' : ''}
          onClick={onReminder}
        >
          Set Reminder
        </Button>
      </ButtonContainer>

      {showRecording && (
        <EPGRecording
          program={program}
          onClose={() => setShowRecording(false)}
          onConfirm={(settings) => {
            onRecord?.();
            setShowRecording(false);
          }}
        />
      )}

      {showReminder && (
        <EPGReminder
          program={program}
          onClose={() => setShowReminder(false)}
          onConfirm={(settings) => {
            onReminder?.();
            setShowReminder(false);
          }}
        />
      )}
    </Container>
  );
};

export default EPGProgramDetails;
