import React from 'react';
import styled from 'styled-components';
import { IEPGProgram } from '../../types';

interface EPGProps {
  programs: IEPGProgram[];
  currentTime: number;
  onProgramSelect?: (program: IEPGProgram) => void;
}

const EPGContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 20px;
`;

const Timeline = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 2px;
`;

const Program = styled.div<{ width: number; isCurrent: boolean }>`
  min-width: ${({ width }) => width}px;
  padding: 10px;
  background: ${({ isCurrent }) => (isCurrent ? '#333' : '#222')};
  border-left: 2px solid ${({ isCurrent }) => (isCurrent ? '#ffde33' : 'transparent')};
  cursor: pointer;

  &:hover {
    background: #444;
  }
`;

const ProgramTitle = styled.div`
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 4px;
`;

const ProgramTime = styled.div`
  font-size: 12px;
  color: #999;
`;

const ProgramDescription = styled.div`
  font-size: 12px;
  margin-top: 4px;
  color: #ccc;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const EPG: React.FC<EPGProps> = ({ programs, currentTime, onProgramSelect }) => {
  // 1 minute = 2 pixels
  const PIXELS_PER_MINUTE = 2;

  const calculateWidth = (start: string, end: string) => {
    const duration = (new Date(end).getTime() - new Date(start).getTime()) / 1000 / 60;
    return duration * PIXELS_PER_MINUTE;
  };

  const isCurrentProgram = (start: string, end: string) => {
    const startTime = new Date(start).getTime() / 1000;
    const endTime = new Date(end).getTime() / 1000;
    return currentTime >= startTime && currentTime < endTime;
  };

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <EPGContainer>
      <Timeline>
        {programs.map((program) => (
          <Program
            key={program.id}
            width={calculateWidth(program.start, program.end)}
            isCurrent={isCurrentProgram(program.start, program.end)}
            onClick={() => onProgramSelect?.(program)}
          >
            <ProgramTitle>{program.title}</ProgramTitle>
            <ProgramTime>
              {formatTime(program.start)} - {formatTime(program.end)}
            </ProgramTime>
            {program.description && (
              <ProgramDescription>{program.description}</ProgramDescription>
            )}
          </Program>
        ))}
      </Timeline>
    </EPGContainer>
  );
};

export default EPG;
