import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { IChannel, IEPGProgram } from '@/types';
import { useEPGService } from '@/contexts/ServiceContext';

interface EPGGridProps {
  channels: IChannel[];
  onChannelSelect: (channel: IChannel) => void;
  onProgramSelect: (program: IEPGProgram) => void;
}

const Container = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-template-rows: 50px 1fr;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.background};
`;

const TimeHeader = styled.div`
  grid-column: 2;
  grid-row: 1;
  display: flex;
  align-items: center;
  padding: 0 1rem;
  background-color: ${({ theme }) => theme.colors.backgroundDark};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const ChannelList = styled.div`
  grid-column: 1;
  grid-row: 2;
  overflow-y: auto;
  border-right: 1px solid ${({ theme }) => theme.colors.border};
`;

const ProgramGrid = styled.div`
  grid-column: 2;
  grid-row: 2;
  overflow: auto;
  position: relative;
`;

const ChannelItem = styled.div<{ selected?: boolean }>`
  display: flex;
  align-items: center;
  padding: 0.5rem;
  cursor: pointer;
  background-color: ${({ theme, selected }) =>
    selected ? theme.colors.primary : theme.colors.background};

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryLight};
  }
`;

const ChannelIcon = styled.img`
  width: 32px;
  height: 32px;
  margin-right: 0.5rem;
  border-radius: 4px;
`;

const ChannelName = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text};
`;

const ProgramItem = styled.div<{ width: number; left: number; selected?: boolean }>`
  position: absolute;
  height: 50px;
  left: ${({ left }) => left}px;
  width: ${({ width }) => width}px;
  padding: 0.25rem;
  background-color: ${({ theme, selected }) =>
    selected ? theme.colors.primary : theme.colors.backgroundDark};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  cursor: pointer;
  overflow: hidden;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryLight};
  }
`;

const ProgramTitle = styled.div`
  font-size: 0.8rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ProgramTime = styled.div`
  font-size: 0.7rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const EPGGrid: React.FC<EPGGridProps> = ({ channels, onChannelSelect, onProgramSelect }) => {
  const epgService = useEPGService();
  const [programs, setPrograms] = useState<{ [key: string]: IEPGProgram[] }>({});
  const [selectedChannel, setSelectedChannel] = useState<IChannel | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<IEPGProgram | null>(null);

  useEffect(() => {
    const loadEPG = async () => {
      const epgData: { [key: string]: IEPGProgram[] } = {};
      for (const channel of channels) {
        try {
          const channelPrograms = await epgService.getEPG(channel.streamId.toString());
          epgData[channel.streamId] = channelPrograms;
        } catch (error) {
          console.error(`Error loading EPG for channel ${channel.name}:`, error);
        }
      }
      setPrograms(epgData);
    };

    loadEPG();
  }, [channels, epgService]);

  const handleChannelClick = (channel: IChannel) => {
    setSelectedChannel(channel);
    onChannelSelect(channel);
  };

  const handleProgramClick = (program: IEPGProgram) => {
    setSelectedProgram(program);
    onProgramSelect(program);
  };

  return (
    <Container>
      <TimeHeader>
        {/* Time headers */}
      </TimeHeader>
      <ChannelList>
        {channels.map((channel) => (
          <ChannelItem
            key={channel.streamId}
            selected={selectedChannel?.streamId === channel.streamId}
            onClick={() => handleChannelClick(channel)}
          >
            <ChannelIcon
              src={channel.streamIcon}
              alt={channel.name}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.png';
              }}
            />
            <ChannelName>{channel.name}</ChannelName>
          </ChannelItem>
        ))}
      </ChannelList>
      <ProgramGrid>
        {channels.map((channel) => (
          <div key={channel.streamId}>
            {programs[channel.streamId]?.map((program) => (
              <ProgramItem
                key={program.id}
                width={100} // Calculate based on duration
                left={0} // Calculate based on start time
                selected={selectedProgram?.id === program.id}
                onClick={() => handleProgramClick(program)}
              >
                <ProgramTitle>{program.title}</ProgramTitle>
                <ProgramTime>
                  {new Date(program.start).toLocaleTimeString()} -{' '}
                  {new Date(program.end).toLocaleTimeString()}
                </ProgramTime>
              </ProgramItem>
            ))}
          </div>
        ))}
      </ProgramGrid>
    </Container>
  );
};

export default EPGGrid;
