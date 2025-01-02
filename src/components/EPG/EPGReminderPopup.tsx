import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { IEPGProgram } from '@/types';

interface EPGReminderPopupProps {
  program: IEPGProgram;
  autoSwitch?: boolean;
  onClose?: () => void;
  onSwitch?: () => void;
}

const slideIn = keyframes`
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(0);
  }
`;

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: ${({ theme }) => theme.colors.background.card};
  padding: ${({ theme }) => theme.spacing.xl};
  animation: ${slideIn} 0.3s ease-in-out;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const Content = styled.div`
  flex: 1;
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.typography.sizes.xl};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Message = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.md};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const Time = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Button = styled.button<{ primary?: boolean }>`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.xl}`};
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

const EPGReminderPopup: React.FC<EPGReminderPopupProps> = ({
  program,
  autoSwitch = false,
  onClose,
  onSwitch,
}) => {
  const [focusedButton, setFocusedButton] = useState<'dismiss' | 'switch'>(
    autoSwitch ? 'switch' : 'dismiss'
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          setFocusedButton('dismiss');
          break;
        case 'ArrowRight':
          setFocusedButton('switch');
          break;
        case 'Enter':
          if (focusedButton === 'dismiss') {
            onClose?.();
          } else if (focusedButton === 'switch') {
            onSwitch?.();
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
  }, [focusedButton, onClose, onSwitch]);

  // Auto-close after 30 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose?.();
    }, 30000);

    return () => clearTimeout(timer);
  }, [onClose]);

  // Auto-switch if enabled
  useEffect(() => {
    if (autoSwitch) {
      const timer = setTimeout(() => {
        onSwitch?.();
        onClose?.();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [autoSwitch, onSwitch, onClose]);

  return (
    <Container>
      <Content>
        <Title>Program Reminder</Title>
        <Time>
          {formatTime(program.start)} - {formatTime(program.end)}
        </Time>
        <Message>
          {program.title} is about to start{autoSwitch ? ' (switching in 5s)' : ''}
        </Message>
      </Content>

      <ButtonContainer>
        <Button
          className={focusedButton === 'dismiss' ? 'focused' : ''}
          onClick={onClose}
        >
          Dismiss
        </Button>
        <Button
          primary
          className={focusedButton === 'switch' ? 'focused' : ''}
          onClick={() => {
            onSwitch?.();
            onClose?.();
          }}
        >
          Switch Now
        </Button>
      </ButtonContainer>
    </Container>
  );
};

export default EPGReminderPopup;
