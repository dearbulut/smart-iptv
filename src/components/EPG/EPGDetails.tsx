import React from 'react';
import styled, { keyframes } from 'styled-components';
import { IEPGProgram } from '@/types';

interface EPGDetailsProps {
  program: IEPGProgram;
  onClose?: () => void;
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

const HelpText = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  border-top: 1px solid ${({ theme }) => theme.colors.background.hover};
  margin-top: auto;
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

const EPGDetails: React.FC<EPGDetailsProps> = ({ program, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

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

      <HelpText>Press RETURN to close</HelpText>
    </Container>
  );
};

export default EPGDetails;
