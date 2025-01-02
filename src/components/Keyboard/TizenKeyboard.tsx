import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useTVNavigation } from '@/hooks/useTVNavigation';

interface TizenKeyboardProps {
  onSubmit: (text: string) => void;
  onCancel: () => void;
  initialValue?: string;
  placeholder?: string;
  type?: 'text' | 'password' | 'number';
}

const Container = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: ${({ theme }) => theme.colors.background.card};
  padding: ${({ theme }) => theme.spacing.xl};
  border-top: 1px solid ${({ theme }) => theme.colors.background.hover};
  z-index: 1000;
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.background.main};
  border: 2px solid transparent;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.sizes.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.secondary.main};
  }
`;

const KeyboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Key = styled.button<{ wide?: boolean }>`
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.background.main};
  border: 2px solid transparent;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.sizes.md};
  grid-column: ${({ wide }) => wide ? 'span 2' : 'span 1'};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};

  &.focused {
    border-color: ${({ theme }) => theme.colors.secondary.main};
    background: ${({ theme }) => theme.colors.background.hover};
  }
`;

const ButtonRow = styled.div`
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

const LAYOUTS = {
  default: [
    '1234567890',
    'qwertyuiop',
    'asdfghjkl',
    'zxcvbnm',
    ' ',
  ],
  shift: [
    '1234567890',
    'QWERTYUIOP',
    'ASDFGHJKL',
    'ZXCVBNM',
    ' ',
  ],
  symbols: [
    '!@#$%^&*()',
    '-_=+[]{}\|',
    ';:\'",.<>/?',
    '~`',
    ' ',
  ],
};

const TizenKeyboard: React.FC<TizenKeyboardProps> = ({
  onSubmit,
  onCancel,
  initialValue = '',
  placeholder = '',
  type = 'text',
}) => {
  const [value, setValue] = useState(initialValue);
  const [layout, setLayout] = useState<keyof typeof LAYOUTS>('default');

  const { registerElement } = useTVNavigation({
    grid: true,
    gridColumns: 10,
    onSelect: (element) => {
      const key = element.getAttribute('data-key');
      if (!key) return;

      switch (key) {
        case 'backspace':
          setValue((prev) => prev.slice(0, -1));
          break;
        case 'space':
          setValue((prev) => prev + ' ');
          break;
        case 'shift':
          setLayout((prev) => prev === 'default' ? 'shift' : 'default');
          break;
        case 'symbols':
          setLayout((prev) => prev === 'symbols' ? 'default' : 'symbols');
          break;
        case 'submit':
          onSubmit(value);
          break;
        case 'cancel':
          onCancel();
          break;
        default:
          setValue((prev) => prev + key);
      }
    },
  });

  const currentLayout = LAYOUTS[layout];

  return (
    <Container>
      <Input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
      />

      {currentLayout.map((row, rowIndex) => (
        <KeyboardGrid key={rowIndex}>
          {rowIndex === 0 && (
            <Key
              className="focusable"
              ref={(el) => registerElement(el, rowIndex * 10)}
              data-key="symbols"
            >
              {layout === 'symbols' ? 'ABC' : '#@!'}
            </Key>
          )}

          {row.split('').map((char, charIndex) => (
            <Key
              key={charIndex}
              className="focusable"
              ref={(el) => registerElement(el, rowIndex * 10 + charIndex + 1)}
              data-key={char}
              wide={char === ' '}
            >
              {char === ' ' ? 'SPACE' : char}
            </Key>
          ))}

          {rowIndex === 0 && (
            <Key
              className="focusable"
              ref={(el) => registerElement(el, rowIndex * 10 + row.length + 1)}
              data-key="backspace"
            >
              ⌫
            </Key>
          )}
        </KeyboardGrid>
      ))}

      <ButtonRow>
        <Button
          className="focusable"
          ref={(el) => registerElement(el, 50)}
          data-key="cancel"
        >
          Cancel
        </Button>
        <Button
          primary
          className="focusable"
          ref={(el) => registerElement(el, 51)}
          data-key="submit"
        >
          Submit
        </Button>
      </ButtonRow>
    </Container>
  );
};

export default TizenKeyboard;
