import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

interface EPGTimelineProps {
  currentTime: number;
  duration: number;
  onTimeChange?: (time: number) => void;
}

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  position: relative;
`;

const TimelineContainer = styled.div`
  flex: 1;
  height: 4px;
  background: ${({ theme }) => theme.colors.background.hover};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  position: relative;
  cursor: pointer;
`;

const Progress = styled.div<{ percent: number }>`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: ${({ percent }) => percent}%;
  background: ${({ theme }) => theme.colors.secondary.main};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
`;

const Cursor = styled.div<{ percent: number }>`
  position: absolute;
  top: 50%;
  left: ${({ percent }) => percent}%;
  transform: translate(-50%, -50%);
  width: 16px;
  height: 16px;
  background: ${({ theme }) => theme.colors.secondary.main};
  border: 2px solid ${({ theme }) => theme.colors.text.primary};
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover,
  &.focused {
    transform: translate(-50%, -50%) scale(1.2);
  }
`;

const Time = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  min-width: 80px;
  text-align: center;
`;

const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const EPGTimeline: React.FC<EPGTimelineProps> = ({
  currentTime,
  duration,
  onTimeChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startTime = currentTime - duration / 2;
  const endTime = currentTime + duration / 2;
  const progress = ((currentTime - startTime) / duration) * 100;

  const handleTimeChange = (clientX: number) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const newTime = startTime + percent * duration;
    onTimeChange?.(newTime);
  };

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (isDragging.current) {
        handleTimeChange(event.clientX);
      }
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [duration, startTime]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          onTimeChange?.(currentTime - 300); // -5 minutes
          break;
        case 'ArrowRight':
          onTimeChange?.(currentTime + 300); // +5 minutes
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentTime, onTimeChange]);

  return (
    <Container>
      <Time>{formatTime(startTime)}</Time>
      <TimelineContainer
        ref={containerRef}
        onClick={(e) => handleTimeChange(e.clientX)}
        onMouseDown={() => (isDragging.current = true)}
      >
        <Progress percent={progress} />
        <Cursor percent={progress} />
      </TimelineContainer>
      <Time>{formatTime(endTime)}</Time>
    </Container>
  );
};

export default EPGTimeline;
