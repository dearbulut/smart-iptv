import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { IChannel, IEPGProgram } from '@/types';

interface ChannelInfoProps {
  channel: IChannel;
  currentProgram?: IEPGProgram;
  nextProgram?: IEPGProgram;
  progress?: number;
  onClose?: () => void;
  timeout?: number;
}

const slideIn = keyframes`
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const Container = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.9));
  padding: ${({ theme }) => theme.spacing.xl};
  animation: ${slideIn} 0.3s ease-in-out;
`;

const ChannelHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ChannelLogo = styled.img`
  width: 80px;
  height: 80px;
  object-fit: contain;
  background: ${({ theme }) => theme.colors.background.card};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const ChannelInfo = styled.div`
  flex: 1;
`;

const ChannelName = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.xl};
  font-weight: bold;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const ChannelNumber = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const ProgramInfo = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ProgramTitle = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.lg};
  font-weight: bold;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const ProgramTime = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const ProgramDescription = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  overflow: hidden;
`;

const Progress = styled.div<{ percent: number }>`
  width: ${({ percent }) => percent}%;
  height: 100%;
  background: ${({ theme }) => theme.colors.secondary.main};
  transition: width 0.3s ease;
`;

const NextProgram = styled.div`
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const NextTitle = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const formatTime = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const ChannelInfoOverlay: React.FC<ChannelInfoProps> = ({
  channel,
  currentProgram,
  nextProgram,
  progress = 0,
  onClose,
  timeout = 5000,
}) => {
  useEffect(() => {
    if (timeout > 0) {
      const timer = setTimeout(() => {
        onClose?.();
      }, timeout);
      return () => clearTimeout(timer);
    }
  }, [timeout, onClose]);

  return (
    <Container>
      <ChannelHeader>
        <ChannelLogo
          src={channel.streamIcon || '/placeholder.png'}
          alt={channel.name}
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder.png';
          }}
        />
        <ChannelInfo>
          <ChannelName>{channel.name}</ChannelName>
          <ChannelNumber>#{channel.num}</ChannelNumber>
        </ChannelInfo>
      </ChannelHeader>

      {currentProgram && (
        <ProgramInfo>
          <ProgramTitle>{currentProgram.title}</ProgramTitle>
          <ProgramTime>
            {formatTime(currentProgram.start)} - {formatTime(currentProgram.end)}
          </ProgramTime>
          {currentProgram.description && (
            <ProgramDescription>{currentProgram.description}</ProgramDescription>
          )}
          <ProgressBar>
            <Progress percent={progress} />
          </ProgressBar>
        </ProgramInfo>
      )}

      {nextProgram && (
        <NextProgram>
          <NextTitle>Next: {nextProgram.title}</NextTitle>
          <ProgramTime>
            {formatTime(nextProgram.start)} - {formatTime(nextProgram.end)}
          </ProgramTime>
        </NextProgram>
      )}
    </Container>
  );
};

export default ChannelInfoOverlay;
