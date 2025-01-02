import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

interface TizenDialogProps {
  title: string;
  type: 'text' | 'number' | 'select' | 'toggle';
  value: any;
  options?: { label: string; value: any }[];
  onConfirm: (value: any) => void;
  onCancel: () => void;
}

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideIn = keyframes`
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${fadeIn} 0.3s ease-in-out;
  z-index: 2000;
`;

const Container = styled.div`
  background: ${({ theme }) => theme.colors.background.card};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  min-width: 400px;
  animation: ${slideIn} 0.3s ease-in-out;
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.typography.sizes.xl};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.background.main};
  border: 2px solid transparent;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.sizes.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.secondary.main};
  }

  &.focused {
    border-color: ${({ theme }) => theme.colors.secondary.main};
  }
`;

const Select = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Option = styled.div<{ selected?: boolean }>`
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme, selected }) =>
    selected ? theme.colors.background.hover : theme.colors.background.main};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};

  &.focused {
    background: ${({ theme }) => theme.colors.background.hover};
    border: 2px solid ${({ theme }) => theme.colors.secondary.main};
  }
`;

const Toggle = styled.div<{ checked?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.background.main};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;

  &::before {
    content: '';
    width: 40px;
    height: 24px;
    background: ${({ theme, checked }) =>
      checked ? theme.colors.secondary.main : theme.colors.background.hover};
    border-radius: 12px;
    position: relative;
    transition: ${({ theme }) => theme.transitions.default};

    &::after {
      content: '';
      width: 20px;
      height: 20px;
      background: ${({ theme }) => theme.colors.text.primary};
      border-radius: 50%;
      position: absolute;
      top: 2px;
      left: ${({ checked }) => (checked ? '18px' : '2px')};
      transition: ${({ theme }) => theme.transitions.default};
    }
  }

  &.focused {
    border: 2px solid ${({ theme }) => theme.colors.secondary.main};
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
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

const TizenDialog: React.FC<TizenDialogProps> = ({
  title,
  type,
  value,
  options = [],
  onConfirm,
  onCancel,
}) => {
  const [currentValue, setCurrentValue] = useState(value);
  const [focusedElement, setFocusedElement] = useState<string>('input');

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
          if (type === 'select') {
            setCurrentValue((prev: any) => {
              const currentIndex = options.findIndex((o) => o.value === prev);
              const newIndex = Math.max(0, currentIndex - 1);
              return options[newIndex].value;
            });
          }
          break;
        case 'ArrowDown':
          if (type === 'select') {
            setCurrentValue((prev: any) => {
              const currentIndex = options.findIndex((o) => o.value === prev);
              const newIndex = Math.min(options.length - 1, currentIndex + 1);
              return options[newIndex].value;
            });
          }
          break;
        case 'ArrowLeft':
          if (focusedElement === 'confirm') {
            setFocusedElement('cancel');
          }
          break;
        case 'ArrowRight':
          if (focusedElement === 'cancel') {
            setFocusedElement('confirm');
          }
          break;
        case 'Enter':
          if (type === 'toggle') {
            setCurrentValue((prev) => !prev);
          } else if (focusedElement === 'confirm') {
            onConfirm(currentValue);
          } else if (focusedElement === 'cancel') {
            onCancel();
          }
          break;
        case 'Escape':
          onCancel();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [type, options, currentValue, focusedElement, onConfirm, onCancel]);

  const renderInput = () => {
    switch (type) {
      case 'text':
      case 'number':
        return (
          <Input
            type={type}
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            className={focusedElement === 'input' ? 'focused' : ''}
            onFocus={() => setFocusedElement('input')}
          />
        );
      case 'select':
        return (
          <Select>
            {options.map((option) => (
              <Option
                key={option.value}
                selected={currentValue === option.value}
                className={
                  currentValue === option.value &&
                  focusedElement === 'input'
                    ? 'focused'
                    : ''
                }
                onClick={() => setCurrentValue(option.value)}
              >
                {option.label}
              </Option>
            ))}
          </Select>
        );
      case 'toggle':
        return (
          <Toggle
            checked={currentValue}
            className={focusedElement === 'input' ? 'focused' : ''}
            onClick={() => setCurrentValue((prev) => !prev)}
          >
            {currentValue ? 'On' : 'Off'}
          </Toggle>
        );
      default:
        return null;
    }
  };

  return (
    <Overlay>
      <Container>
        <Title>{title}</Title>
        {renderInput()}
        <ButtonContainer>
          <Button
            className={focusedElement === 'cancel' ? 'focused' : ''}
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            primary
            className={focusedElement === 'confirm' ? 'focused' : ''}
            onClick={() => onConfirm(currentValue)}
          >
            Confirm
          </Button>
        </ButtonContainer>
      </Container>
    </Overlay>
  );
};

export default TizenDialog;
