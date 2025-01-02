import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

interface TizenNotificationProps {
  message: string;
  type?: 'info' | 'success' | 'error' | 'warning';
  duration?: number;
  onClose?: () => void;
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

const slideOut = keyframes`
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(100%);
    opacity: 0;
  }
`;

const Container = styled.div<{ type: string; isClosing: boolean }>`
  position: fixed;
  bottom: ${({ theme }) => theme.spacing.xl};
  left: 50%;
  transform: translateX(-50%);
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.xl}`};
  background: ${({ theme, type }) => {
    switch (type) {
      case 'success':
        return '#4CAF50';
      case 'error':
        return '#f44336';
      case 'warning':
        return '#ff9800';
      default:
        return theme.colors.background.card;
    }
  }};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.sizes.md};
  box-shadow: ${({ theme }) => theme.shadows.card};
  z-index: 2000;
  animation: ${({ isClosing }) => (isClosing ? slideOut : slideIn)} 0.3s ease-in-out;
`;

const Message = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Icon = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.lg};
`;

const getIcon = (type: string) => {
  switch (type) {
    case 'success':
      return '✓';
    case 'error':
      return '✕';
    case 'warning':
      return '⚠';
    default:
      return 'ℹ';
  }
};

const TizenNotification: React.FC<TizenNotificationProps> = ({
  message,
  type = 'info',
  duration = 3000,
  onClose,
}) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const closeTimeout = setTimeout(() => {
      setIsClosing(true);
    }, duration - 300);

    const removeTimeout = setTimeout(() => {
      onClose?.();
    }, duration);

    return () => {
      clearTimeout(closeTimeout);
      clearTimeout(removeTimeout);
    };
  }, [duration, onClose]);

  return (
    <Container type={type} isClosing={isClosing}>
      <Message>
        <Icon>{getIcon(type)}</Icon>
        {message}
      </Message>
    </Container>
  );
};

export default TizenNotification;
