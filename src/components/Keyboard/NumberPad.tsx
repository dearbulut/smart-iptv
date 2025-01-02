import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

interface NumberPadProps {
  onNumber?: (number: number) => void;
  onEnter?: () => void;
  onClose?: () => void;
  timeout?: number;
}

const Container = styled.div`
  position: fixed;
  top: 50%;
  right: ${({ theme }) => theme.spacing.xl};
  transform: translateY(-50%);
  background: ${({ theme }) => theme.colors.background.card};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const Number = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.xxl};
  color: ${({ theme }) => theme.colors.text.primary};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  min-height: ${({ theme }) => theme.typography.sizes.xxl};
`;

const Timer = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const NumberPad: React.FC<NumberPadProps> = ({
  onNumber,
  onEnter,
  onClose,
  timeout = 3000,
}) => {
  const [numbers, setNumbers] = useState<string>('');
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>();
  const [remainingTime, setRemainingTime] = useState(timeout / 1000);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;
      if (/^[0-9]$/.test(key)) {
        setNumbers((prev) => {
          const newNumbers = prev + key;
          onNumber?.(parseInt(newNumbers, 10));
          return newNumbers;
        });
        resetTimeout();
      } else if (key === 'Enter') {
        onEnter?.();
        onClose?.();
      } else if (key === 'Escape' || key === 'Backspace') {
        onClose?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNumber, onEnter, onClose]);

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          onClose?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeout, onClose]);

  const resetTimeout = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    setRemainingTime(timeout / 1000);
    const id = setTimeout(() => {
      onClose?.();
    }, timeout);
    setTimeoutId(id);
  };

  useEffect(() => {
    resetTimeout();
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [numbers]);

  return (
    <Container>
      <Number>{numbers || ' '}</Number>
      <Timer>{remainingTime}s</Timer>
    </Container>
  );
};

export default NumberPad;
