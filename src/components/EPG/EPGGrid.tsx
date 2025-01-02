import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import EPGProgramDetails from './EPGProgramDetails';
import EPGSearch from './EPGSearch';
import EPGCategories from './EPGCategories';
import EPGTimeline from './EPGTimeline';
import EPGChannelList from './EPGChannelList';
import { IEPGProgram } from '@/types';

interface EPGGridProps {
  programs: IEPGProgram[];
  channels: IChannel[];
  selectedChannelId?: number;
  currentTime: number;
  onClose?: () => void;
  onChannelSelect?: (channel: IChannel) => void;
  onProgramSelect?: (program: IEPGProgram) => void;
}

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${({ theme }) => theme.colors.background.card};
  z-index: 1000;
  display: flex;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.typography.sizes.xl};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const TimelineContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  overflow-x: auto;
`;

const TimeSlot = styled.div<{ current?: boolean }>`
  min-width: 120px;
  padding: ${({ theme }) => theme.spacing.sm};
  text-align: center;
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme, current }) =>
    current ? theme.colors.secondary.main : theme.colors.text.secondary};
  border-bottom: 2px solid
    ${({ theme, current }) =>
      current ? theme.colors.secondary.main : 'transparent'};
`;

const Grid = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const Program = styled.div<{ selected?: boolean; current?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme, selected, current }) =>
    selected
      ? theme.colors.background.hover
      : current
      ? theme.colors.background.card
      : 'transparent'};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};

  &.focused {
    background: ${({ theme }) => theme.colors.background.hover};
    border: 2px solid ${({ theme }) => theme.colors.secondary.main};
  }
`;

const Time = styled.div`
  min-width: 100px;
  font-size: ${({ theme }) => theme.typography.sizes.md};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const ProgramInfo = styled.div`
  flex: 1;
`;

const ProgramTitle = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.md};
  font-weight: bold;
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

const Duration = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const NoPrograms = styled.div`
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

const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing.xl};
`;

const EPGGrid: React.FC<EPGGridProps> = ({
  programs,
  channels,
  selectedChannelId,
  currentTime,
  onClose,
  onChannelSelect,
  onProgramSelect,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedProgram, setSelectedProgram] = useState<IEPGProgram | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [showCategories, setShowCategories] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
          setSelectedIndex((prev) => Math.max(0, prev - 1));
          break;
        case 'ArrowDown':
          setSelectedIndex((prev) =>
            Math.min(programs.length - 1, prev + 1)
          );
          break;
        case 'Enter':
          if (programs[selectedIndex]) {
            setSelectedProgram(programs[selectedIndex]);
          }
          break;
        case 'KeyS':
          setShowSearch(true);
          break;
        case 'KeyC':
          setShowCategories(true);
          break;
        case 'Escape':
          onClose?.();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [programs, selectedIndex, onProgramSelect, onClose]);

  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = Math.floor(currentTime / 3600) * 3600 + i * 3600;
    return hour;
  });

  const getCurrentTimeSlot = (time: number): number => {
    return Math.floor(time / 3600) * 3600;
  };

  const currentTimeSlot = getCurrentTimeSlot(currentTime);

  return (
    <Container>
      <EPGChannelList
        channels={channels}
        selectedChannelId={selectedChannelId}
        onChannelSelect={onChannelSelect}
      />
      <Content>
        <Header>
          <Title>Program Guide</Title>
        </Header>

        <EPGTimeline
          currentTime={currentTime}
          duration={86400} // 24 hours
          onTimeChange={(time) => {
            // TODO: Handle time change
            console.log('Time changed:', time);
          }}
        />

        <TimelineContainer>
          {timeSlots.map((slot) => (
            <TimeSlot key={slot} current={slot === currentTimeSlot}>
              {formatTime(slot)}
            </TimeSlot>
          ))}
        </TimelineContainer>

        <Grid>
          {programs.length > 0 ? (
            programs.map((program, index) => {
              const isCurrentProgram =
                currentTime >= new Date(program.start).getTime() / 1000 &&
                currentTime < new Date(program.end).getTime() / 1000;

              return (
                <Program
                  key={`${program.start}-${program.end}`}
                  selected={index === selectedIndex}
                  current={isCurrentProgram}
                  className={index === selectedIndex ? 'focused' : ''}
                  onClick={() => onProgramSelect?.(program)}
                >
                  <Time>
                    {formatTime(new Date(program.start).getTime() / 1000)}
                  </Time>
                  <ProgramInfo>
                    <ProgramTitle>{program.title}</ProgramTitle>
                    {program.description && (
                      <ProgramDescription>{program.description}</ProgramDescription>
                    )}
                  </ProgramInfo>
                  <Duration>
                    {formatDuration(program.start, program.end)}
                  </Duration>
                </Program>
              );
            })
          ) : (
            <NoPrograms>No program information available</NoPrograms>
          )}
        </Grid>

        <HelpText>
          Press UP/DOWN to navigate • Press ENTER to view details • Press S to search • Press C for categories • Press RETURN to close
        </HelpText>

        {selectedProgram && (
          <EPGProgramDetails
            program={selectedProgram}
            onClose={() => setSelectedProgram(null)}
            onRecord={() => {
              // TODO: Implement recording functionality
              console.log('Record program:', selectedProgram);
            }}
            onReminder={() => {
              // TODO: Implement reminder functionality
              console.log('Set reminder for program:', selectedProgram);
            }}
          />
        )}

        {showSearch && (
          <EPGSearch
            programs={programs}
            onSelect={(program) => {
              setSelectedProgram(program);
              setShowSearch(false);
            }}
            onClose={() => setShowSearch(false)}
          />
        )}

        {showCategories && (
          <EPGCategories
            programs={programs}
            onSelect={(program) => {
              setSelectedProgram(program);
              setShowCategories(false);
            }}
            onClose={() => setShowCategories(false)}
          />
        )}
      </Content>
    </Container>
  );
};

export default EPGGrid;
